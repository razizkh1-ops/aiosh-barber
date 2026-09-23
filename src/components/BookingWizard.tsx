import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Phone, 
  Sparkles, 
  MessageSquare,
  CalendarPlus,
  Download,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { BarberService, AppointmentBooking } from '../types';
import { SERVICES_LIST, BARBERS_LIST, SHOP_INFO } from '../data/barberData';
import { generateDaySlots, saveBooking, formatWhatsAppMessage, generateGoogleCalendarUrl, downloadIcsFile } from '../utils/bookingUtils';
import { createAppointmentInFirestore } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';

interface BookingWizardProps {
  initialServiceId?: string | null;
  onBookingComplete?: (booking: AppointmentBooking) => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({ 
  initialServiceId, 
  onBookingComplete 
}) => {
  // Step 1: Service (Haircut) | Step 2: Date & Time | Step 3: Client Info | Step 4: Confirmed
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Selected Service (default to normal-haircut)
  const [selectedServiceId, setSelectedServiceId] = useState<string>('normal-haircut');
  
  // Barber is always Aiosh
  const barber = BARBERS_LIST[0] || { id: 'barber-aiosh', name: 'عيوش' };

  // Selected Date & Time
  const todayIso = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Client Info
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('+972 ');
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Completed Booking Result
  const [completedBooking, setCompletedBooking] = useState<AppointmentBooking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auth Context
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.displayName && !customerName) {
        setCustomerName(user.displayName);
      }
    }
  }, [user]);

  // Filter for time period in slot picker
  const [slotFilter, setSlotFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  // Initialize service if passed
  useEffect(() => {
    if (initialServiceId && SERVICES_LIST.some(s => s.id === initialServiceId)) {
      setSelectedServiceId(initialServiceId);
    } else {
      setSelectedServiceId('normal-haircut');
    }
  }, [initialServiceId]);

  // Derived selected service
  const selectedService = SERVICES_LIST.find(s => s.id === selectedServiceId) || SERVICES_LIST[0];
  const totalPrice = selectedService ? selectedService.price : 40;
  const totalDuration = selectedService ? selectedService.durationMin : 30;

  // Available slots for selected date & barber
  const daySlots = generateDaySlots(selectedDate, barber.id);
  const filteredSlots = daySlots.filter(s => slotFilter === 'all' || s.period === slotFilter);

  // Next 7 days for quick date selection
  const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const nextDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const isSaturday = d.getDay() === 6;
    const dayName = i === 0 ? 'اليوم' : i === 1 ? 'غداً' : arabicDays[d.getDay()];
    const dayNum = `${d.getDate()}/${d.getMonth() + 1}`;
    return { iso, dayName, dayNum, isSaturday };
  });

  const [sY, sM, sD] = selectedDate.split('-').map(Number);
  const isSelectedSaturday = new Date(sY, sM - 1, sD).getDay() === 6;

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('يرجى كتابة الاسم الكامل');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      setErrorMsg('يرجى إدخال رقم هاتف صحيح لنتمكن من تأكيد حجزك وتذكيرك.');
      return;
    }

    if (!selectedTime) {
      setErrorMsg('يرجى اختيار موعد وساعة الحلاقة المناسبة.');
      setStep(2);
      return;
    }

    setIsSubmitting(true);

    const bookingInput = {
      serviceIds: [selectedService.id],
      serviceNames: [selectedService.name],
      totalPrice,
      totalDurationMin: totalDuration,
      barberId: barber.id,
      barberName: barber.name,
      date: selectedDate,
      time: selectedTime,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: user?.email || undefined,
      notes: notes.trim() || undefined,
      status: 'confirmed' as const,
    };

    try {
      const newBooking = await createAppointmentInFirestore(bookingInput);
      setCompletedBooking(newBooking);
      setStep(4);
      if (onBookingComplete) {
        onBookingComplete(newBooking);
      }
    } catch (err) {
      console.warn('Fallback to local booking save:', err);
      const fallbackBooking = saveBooking(bookingInput);
      setCompletedBooking(fallbackBooking);
      setStep(4);
      if (onBookingComplete) {
        onBookingComplete(fallbackBooking);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedTime('');
    setCompletedBooking(null);
    setCustomerName('');
    setCustomerPhone('+972 ');
    setNotes('');
  };

  return (
    <div id="booking-section" className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
      
      {/* Wizard Header Bar */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
              نظام الحجز الفوري
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            صالون عيوش • AIOSH BARBER (سخنين)
          </h2>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { num: 1, label: 'نوع الحلاقة' },
              { num: 2, label: 'الموعد' },
              { num: 3, label: 'البيانات' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => s.num < step && setStep(s.num as any)}
                  disabled={s.num > step}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    step === s.num
                      ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-400/40'
                      : step > s.num
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-pointer'
                      : 'bg-neutral-800 text-neutral-500 border border-neutral-700/50'
                  }`}
                  title={s.label}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </button>
                {s.num < 3 && <div className="w-2 sm:w-4 h-0.5 bg-neutral-800" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wizard Content Body */}
      <div className="p-5 sm:p-7">
        
        {/* ================= STEP 1: SELECT HAIRCUT OPTION ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-amber-500" />
                الخطوة 1: اختر نوع الحلاقة
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                اختر بين قص شعر عادي (40 ₪) أو قص شعر مع لحية (50 ₪).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SERVICES_LIST.map((service) => {
                const isSelected = selectedServiceId === service.id;
                const isBeard = service.id === 'haircut-with-beard';

                return (
                  <div
                    key={service.id}
                    id={`service-card-${service.id}`}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-white ring-2 ring-amber-500/60 shadow-xl shadow-amber-500/10'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-850'
                    }`}
                  >
                    {isBeard && (
                      <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-neutral-950 shadow-sm">
                        الأكثر طلباً
                      </span>
                    )}

                    <div className="flex items-start gap-3.5">
                      <div className={`p-3 rounded-xl shrink-0 ${
                        isSelected ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-amber-400'
                      }`}>
                        {isBeard ? <Sparkles className="w-6 h-6" /> : <Scissors className="w-6 h-6" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-base sm:text-lg text-neutral-100 group-hover:text-amber-300 transition-colors">
                            {service.name}
                          </h4>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-800 text-xs">
                      <span className="text-neutral-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        {service.durationMin} دقيقة
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-amber-400">
                          ₪{service.price}
                        </span>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected ? 'bg-amber-500 border-amber-400 text-neutral-950' : 'border-neutral-700 text-transparent'
                        }`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Summary Bar */}
            <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm">
                <span className="text-neutral-400">الخدمة المختارة: </span>
                <span className="font-bold text-neutral-200">
                  {selectedService.name}
                </span>
                <div className="text-xs text-neutral-400 font-medium mt-0.5">
                  الوقت التقديري: <span className="text-amber-400 font-bold">{totalDuration} دقيقة</span> • السعر:{' '}
                  <span className="text-amber-400 font-bold text-base">₪{totalPrice}</span>
                </div>
              </div>

              <button
                id="step1-next-btn"
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>متابعة لاختيار التاريخ والساعة</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: SELECT DATE & TIME ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-500" />
                الخطوة 2: حدد اليوم والوقت المناسب
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                الحلاقة لدى <strong className="text-neutral-200">عيوش</strong> • صالون عيوش سخنين
              </p>
            </div>

            {/* Quick Date Pills */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">اختر يوم الموعد:</label>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                {nextDays.map((d) => {
                  const isSelected = selectedDate === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => {
                        setSelectedDate(d.iso);
                        setSelectedTime('');
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold shadow-md shadow-amber-500/30'
                          : d.isSaturday
                          ? 'bg-neutral-950/40 border-neutral-850 text-neutral-500 hover:border-neutral-800'
                          : 'bg-neutral-950/70 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-850'
                      }`}
                    >
                      <span className={`text-[11px] font-semibold ${
                        isSelected ? 'text-neutral-950' : d.isSaturday ? 'text-neutral-400' : 'text-amber-400'
                      }`}>
                        {d.dayName}
                      </span>
                      <span className="text-xs mt-0.5" dir="ltr">{d.dayNum}</span>
                      {d.isSaturday && (
                        <span className={`text-[9px] px-1 rounded font-bold mt-0.5 ${
                          isSelected ? 'bg-neutral-950 text-amber-400' : 'bg-rose-500/15 text-rose-400'
                        }`}>
                          مغلق
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Filter Pills */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  الساعات المتاحة للحجز:
                </label>
                <div className="flex gap-1 text-[11px]">
                  {[
                    { id: 'all', label: 'الكل' },
                    { id: 'afternoon', label: 'ظهراً' },
                    { id: 'evening', label: 'مساءً' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSlotFilter(p.id as any)}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        slotFilter === p.id
                          ? 'bg-neutral-800 text-amber-400 border border-neutral-700'
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {isSelectedSaturday ? (
                  <div className="col-span-full py-8 px-4 text-center rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold text-neutral-200">الصالون مغلق يوم السبت (عطلة أسبوعية)</div>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      يسعدنا استقبالكم الأحد والجمعة (12:00 – 21:00) والإثنين إلى الخميس (14:00 – 21:00). يرجى اختيار يوم آخر للحجز.
                    </p>
                  </div>
                ) : filteredSlots.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-neutral-500 text-sm">
                    لا توجد أدوار متاحة في هذه الفترة. يرجى اختيار تاريخ أو فترة أخرى.
                  </div>
                ) : (
                  filteredSlots.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    return (
                      <button
                        key={slot.time}
                        id={`slot-btn-${slot.time.replace(':', '-')}`}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-2.5 px-2 rounded-lg text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/30 ring-1 ring-amber-400'
                            : slot.available
                            ? 'bg-neutral-950 border-neutral-800 text-neutral-200 hover:border-amber-500/60 hover:text-amber-400 cursor-pointer'
                            : 'bg-neutral-900/40 border-neutral-850 text-neutral-600 line-through cursor-not-allowed'
                        }`}
                      >
                        <span dir="ltr">{slot.time}</span>
                        <span className={`text-[9px] font-normal ${
                          isSelected ? 'text-neutral-900 font-semibold' : slot.available ? 'text-emerald-500' : 'text-neutral-600'
                        }`}>
                          {slot.available ? 'متاح' : 'محجوز'}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-lg border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                رجوع
              </button>

              <button
                id="step2-next-btn"
                type="button"
                disabled={!selectedTime}
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>متابعة لبيانات الحجز</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: CLIENT DETAILS ================= */}
        {step === 3 && (
          <form onSubmit={handleConfirmBooking} className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-500" />
                الخطوة 3: بيانات الاتصال والتأكيد
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                سنقوم بتأكيد حجزك وتذكيرك عبر الواتساب أو الاتصال الهاتفي المباشر.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Summary Review Card */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-sm">
              <div className="font-bold text-amber-400 flex items-center justify-between">
                <span>ملخص الموعد المحجوز</span>
                <span className="text-base font-extrabold">₪{totalPrice}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300 pt-1">
                <div>
                  <span className="text-neutral-500">نوع الحلاقة: </span>
                  <span className="font-semibold text-neutral-200">{selectedService.name}</span>
                </div>
                <div>
                  <span className="text-neutral-500">الحلاق: </span>
                  <span className="font-semibold text-neutral-200">عيوش</span>
                </div>
                <div>
                  <span className="text-neutral-500">التاريخ والوقت: </span>
                  <span className="font-semibold text-neutral-200" dir="ltr">{selectedDate} at {selectedTime}</span>
                </div>
                <div>
                  <span className="text-neutral-500">الموقع: </span>
                  <span className="font-semibold text-neutral-200">{SHOP_INFO.address}</span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  الاسم الكامل <span className="text-red-400">*</span>
                </label>
                <input
                  id="input-customer-name"
                  type="text"
                  required
                  placeholder="مثال: أحمد منصور"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-neutral-100 text-sm placeholder:text-neutral-600 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  رقم الهاتف (واتساب) <span className="text-red-400">*</span>
                </label>
                <input
                  id="input-customer-phone"
                  type="tel"
                  required
                  placeholder="+972 054-989-8923"
                  dir="ltr"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-neutral-100 text-sm placeholder:text-neutral-600 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                ملاحظات خاصة (اختياري)
              </label>
              <textarea
                id="input-customer-notes"
                rows={2}
                placeholder="مثال: تدريج سكين فيد زيرو مع تحديد بالموس..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-neutral-100 text-sm placeholder:text-neutral-600 outline-none resize-none"
              />
            </div>

            {/* Navigation */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-lg border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                رجوع
              </button>

              <button
                id="submit-booking-btn"
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 disabled:opacity-50 text-neutral-950 font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'جاري تثبيت الحجز...' : 'تأكيد وتثبيت الحجز الآن'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 4: BOOKING CONFIRMED SUCCESS ================= */}
        {step === 4 && completedBooking && (
          <div className="space-y-6 text-center py-4">
            
            {/* Big Success Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-900/30 animate-bounce">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
                رقم مرجع الحجز: {completedBooking.bookingRef}
              </div>
              <h3 className="text-2xl font-black text-white">
                تم تثبيت حجزك بنجاح!
              </h3>
              <p className="text-neutral-300 text-sm max-w-md mx-auto mt-1">
                أهلاً وسهلاً بك <strong className="text-amber-400">{completedBooking.customerName}</strong>. مقعدك محجوز الآن لدى <strong className="text-white">عيوش</strong> في صالون AIOSH BARBER بسخنين.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="max-w-md mx-auto p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-right space-y-3 text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">التاريخ والساعة:</span>
                <span className="font-bold text-neutral-100 flex items-center gap-1.5" dir="ltr">
                  <CalendarIcon className="w-3.5 h-3.5 text-amber-500" />
                  {completedBooking.date} at {completedBooking.time}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">الحلاق:</span>
                <span className="font-bold text-neutral-100">عيوش</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">الخدمة:</span>
                <span className="font-bold text-neutral-100">{completedBooking.serviceNames.join('، ')}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">عنوان الصالون:</span>
                <span className="font-semibold text-neutral-200">{SHOP_INFO.address}</span>
              </div>

              <div className="flex items-center justify-between pt-1 text-base">
                <span className="font-bold text-neutral-300">المبلغ الإجمالي (الدفع في الصالون):</span>
                <span className="font-black text-amber-400">₪{completedBooking.totalPrice}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="max-w-md mx-auto space-y-2.5 pt-2">
              
              {/* WhatsApp Direct Confirmation */}
              <a
                id="booking-whatsapp-confirm-btn"
                href={formatWhatsAppMessage(completedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>إرسال تفاصيل الحجز فوراً عبر واتساب لصالون عيوش</span>
              </a>

              {/* Add to Calendar Options */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  id="add-google-calendar-btn"
                  href={generateGoogleCalendarUrl(completedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-neutral-200 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-amber-500" />
                  <span>Google Calendar</span>
                </a>

                <button
                  id="download-ics-btn"
                  type="button"
                  onClick={() => downloadIcsFile(completedBooking)}
                  className="py-2.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-neutral-200 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-500" />
                  <span>تقويم Apple / iCal</span>
                </button>
              </div>

              {/* Call Shop Button */}
              <a
                href={`tel:${SHOP_INFO.phoneRaw}`}
                className="w-full py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>لأي استفسار؟ اتصل بالصالون: {SHOP_INFO.phoneDisplay}</span>
              </a>

              {/* Reset to book another */}
              <button
                type="button"
                onClick={resetWizard}
                className="text-xs text-neutral-500 hover:text-amber-400 transition-colors pt-2 block mx-auto underline cursor-pointer"
              >
                حجز موعد آخر
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
