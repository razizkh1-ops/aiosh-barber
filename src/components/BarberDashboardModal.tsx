import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserCheck, 
  Calendar, 
  Clock, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Scissors, 
  TrendingUp,
  DollarSign,
  Cloud,
  LogIn,
  LogOut,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { AppointmentBooking } from '../types';
import { getStoredBookings } from '../utils/bookingUtils';
import { 
  subscribeToAppointments, 
  createAppointmentInFirestore, 
  updateAppointmentStatusInFirestore 
} from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import { BARBERS_LIST, SERVICES_LIST, SHOP_INFO } from '../data/barberData';

interface BarberDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BarberDashboardModal: React.FC<BarberDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const todayIso = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);
  const [selectedBarberFilter, setSelectedBarberFilter] = useState<string>('all');
  const [bookings, setBookings] = useState<AppointmentBooking[]>(() => getStoredBookings());
  const [showAddWalkIn, setShowAddWalkIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const { user, isAdmin, loginWithGoogle, logout } = useAuth();

  // Walk-in form state
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('+972 054');
  const [walkInServiceId, setWalkInServiceId] = useState(SERVICES_LIST[0].id);
  const [walkInBarberId, setWalkInBarberId] = useState(BARBERS_LIST[0].id);
  const [walkInTime, setWalkInTime] = useState('14:00');

  // Real-time Firestore sync
  useEffect(() => {
    if (!isOpen) return;

    setIsSyncing(true);
    const unsubscribe = subscribeToAppointments((updatedList) => {
      setBookings(updatedList);
      setIsSyncing(false);
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStatusChange = async (id: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    // Optimistic UI update
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    await updateAppointmentStatusInFirestore(id, status);
  };

  const handleAddWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) return;

    const s = SERVICES_LIST.find((srv) => srv.id === walkInServiceId) || SERVICES_LIST[0];
    const b = BARBERS_LIST.find((brb) => brb.id === walkInBarberId) || BARBERS_LIST[0];

    const newBooking = await createAppointmentInFirestore({
      serviceIds: [s.id],
      serviceNames: [s.name],
      totalPrice: s.price,
      totalDurationMin: s.durationMin,
      barberId: b.id,
      barberName: b.name,
      date: selectedDate,
      time: walkInTime,
      customerName: walkInName.trim() + ' (Walk-In)',
      customerPhone: walkInPhone.trim(),
      status: 'confirmed',
      notes: 'تمت الإضافة من مكتب الحلاق',
    });

    setBookings((prev) => [newBooking, ...prev]);
    setShowAddWalkIn(false);
    setWalkInName('');
  };

  const filtered = bookings.filter((b) => {
    if (b.date !== selectedDate) return false;
    if (selectedBarberFilter !== 'all' && b.barberId !== selectedBarberFilter) return false;
    return true;
  }).sort((a, b) => a.time.localeCompare(b.time));

  // Day stats
  const activeBookings = filtered.filter((b) => b.status !== 'cancelled');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 font-bold shadow-md">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">لوحة إدارة الحجوزات والمواعيد</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Cloud className="w-3 h-3 text-amber-400" />
                  Firebase Cloud
                </span>
              </div>
              <p className="text-xs text-neutral-400">صالون عيوش سخنين (+972 0549898923) • مزامنة حية مع قاعدة البيانات</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddWalkIn(!showAddWalkIn)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddWalkIn ? 'إغلاق النموذج' : '+ إضافة زبون مباشر (Walk-In)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth / Admin Bar */}
        <div className="px-5 py-2.5 bg-neutral-950/80 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>الحساب الحالي: <strong>{user.email}</strong></span>
                {isAdmin ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    مسؤول الصالون معتمد
                  </span>
                ) : (
                  <span className="text-neutral-500 text-[11px]">(مستخدم عادي)</span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-neutral-400">
                <span>لإدارة المواعيد المباشرة كمسؤول، يرجى تسجيل الدخول:</span>
                <button
                  onClick={() => loginWithGoogle()}
                  className="px-2.5 py-1 rounded bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3 h-3" />
                  تسجيل الدخول كمسؤول
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
            {isSyncing ? (
              <span className="flex items-center gap-1 text-amber-400">
                <RefreshCw className="w-3 h-3 animate-spin" />
                مزامنة البيانات مع السحابة...
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                متصل ومزامن لحظياً
              </span>
            )}

            {user && (
              <button
                onClick={() => logout()}
                className="text-neutral-500 hover:text-red-400 flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                خروج
              </button>
            )}
          </div>
        </div>

        {/* Walk-In Form Accordion */}
        {showAddWalkIn && (
          <form onSubmit={handleAddWalkIn} className="p-4 bg-neutral-950/70 border-b border-neutral-800 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="text-neutral-400 font-medium block mb-1">اسم الزبون:</label>
              <input
                type="text"
                required
                placeholder="مثال: يوسف غنايم"
                value={walkInName}
                onChange={(e) => setWalkInName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-neutral-400 font-medium block mb-1">رقم الهاتف:</label>
              <input
                type="text"
                dir="ltr"
                value={walkInPhone}
                onChange={(e) => setWalkInPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-neutral-400 font-medium block mb-1">الخدمة المطلوبة:</label>
              <select
                value={walkInServiceId}
                onChange={(e) => setWalkInServiceId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 outline-none focus:border-amber-500"
              >
                {SERVICES_LIST.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.price} ₪)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-neutral-400 font-medium block mb-1">وقت الموعد:</label>
              <input
                type="time"
                value={walkInTime}
                onChange={(e) => setWalkInTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition-all shadow-md"
              >
                تثبيت الدور المباشر
              </button>
            </div>
          </form>
        )}

        {/* Filter Bar & KPIs */}
        <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs font-semibold outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-medium">صالون:</span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-neutral-950">
                عيوش
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-neutral-400">إجمالي الزبائن:</span>
              <strong className="text-white text-sm">{activeBookings.length}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-sm">₪</span>
              <span className="text-neutral-400">الدخل المتوقع:</span>
              <strong className="text-emerald-400 text-sm">₪{totalRevenue}</strong>
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3 bg-neutral-950">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-neutral-500 space-y-2">
              <Calendar className="w-10 h-10 mx-auto text-neutral-700" />
              <div className="font-semibold text-neutral-400">لا توجد مواعيد مجدولة في تاريخ {selectedDate}</div>
              <p className="text-xs text-neutral-600">جميع الأدوار متاحة حالياً أو تمت تصفيتها.</p>
            </div>
          ) : (
            filtered.map((b) => {
              const isCancelled = b.status === 'cancelled';
              const isCompleted = b.status === 'completed';
              const statusLabel = isCancelled ? 'ملغي' : isCompleted ? 'مكتمل' : 'مؤكد';

              return (
                <div
                  key={b.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isCancelled
                      ? 'bg-neutral-900/30 border-neutral-850 opacity-50'
                      : isCompleted
                      ? 'bg-neutral-900/70 border-blue-900/40'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center min-w-[65px]">
                      <div className="text-base font-extrabold text-amber-400">{b.time}</div>
                      <div className="text-[10px] text-neutral-400 font-medium">{b.totalDurationMin} دقيقة</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm sm:text-base">{b.customerName}</span>
                        <span className="text-xs text-amber-500 font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
                          {b.bookingRef}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCancelled
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : isCompleted
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <div className="text-xs text-neutral-300 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 text-neutral-400">
                          <Scissors className="w-3.5 h-3.5 text-amber-500" />
                          {b.serviceNames.join(' + ')} ({b.totalPrice} ₪)
                        </span>

                        <span className="flex items-center gap-1 text-neutral-400" dir="ltr">
                          <Phone className="w-3.5 h-3.5 text-neutral-500" />
                          {b.customerPhone}
                        </span>
                      </div>

                      {b.notes && (
                        <div className="text-xs text-neutral-400 italic bg-neutral-950/60 px-2.5 py-1 rounded border border-neutral-850 inline-block mt-1">
                          ملاحظة: {b.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <a
                      href={`tel:${b.customerPhone}`}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
                      title="اتصال هاتفي"
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    <a
                      href={`https://wa.me/${b.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`مرحباً ${b.customerName}، صالون عيوش بسخنين يؤكد لك موعدك المحجوز.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800"
                      title="مراسلة واتساب"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>

                    {!isCompleted && !isCancelled && (
                      <button
                        onClick={() => handleStatusChange(b.id, 'completed')}
                        className="px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-semibold flex items-center gap-1 border border-blue-700/50 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        تمت الحلاقة
                      </button>
                    )}

                    {!isCancelled && (
                      <button
                        onClick={() => handleStatusChange(b.id, 'cancelled')}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 text-xs font-semibold cursor-pointer"
                        title="إلغاء الموعد"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400">
          <span>صالون عيوش • سخنين، إسرائيل • مزامنة Firebase لحظية</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold cursor-pointer"
          >
            إغلاق اللوحة
          </button>
        </div>

      </div>
    </div>
  );
};
