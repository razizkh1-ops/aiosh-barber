import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Phone, 
  Scissors, 
  MessageSquare, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Cloud,
  XCircle,
  LogIn
} from 'lucide-react';
import { AppointmentBooking } from '../types';
import { getStoredBookings, formatWhatsAppMessage, downloadIcsFile } from '../utils/bookingUtils';
import { subscribeToAppointments, updateAppointmentStatusInFirestore } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import { SHOP_INFO } from '../data/barberData';

interface MyAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNew: () => void;
}

export const MyAppointmentsModal: React.FC<MyAppointmentsModalProps> = ({
  isOpen,
  onClose,
  onBookNew,
}) => {
  const [searchPhone, setSearchPhone] = useState('');
  const [bookings, setBookings] = useState<AppointmentBooking[]>(() => getStoredBookings());
  const [statusMessage, setStatusMessage] = useState('');
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const { user, loginWithGoogle } = useAuth();

  // Real-time Firestore sync
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = subscribeToAppointments((updated) => {
      setBookings(updated);
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCancelBooking = async (id: string, ref: string) => {
    try {
      // Optimistic update
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)));
      await updateAppointmentStatusInFirestore(id, 'cancelled');
      setStatusMessage(`تم إلغاء الموعد رقم ${ref} بنجاح.`);
      setConfirmCancelId(null);
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setStatusMessage('حدث خطأ أثناء الإلغاء، يرجى المحاولة لاحقاً');
    }
  };

  const filtered = bookings.filter((b) => {
    // If user typed in search box
    if (searchPhone.trim()) {
      const cleanSearch = searchPhone.replace(/\D/g, '');
      const cleanCustPhone = b.customerPhone.replace(/\D/g, '');
      const cleanRef = b.bookingRef.toLowerCase();
      return cleanCustPhone.includes(cleanSearch) || cleanRef.includes(searchPhone.toLowerCase());
    }

    // If logged in and no search entered, prioritize appointments matching user's UID, email, or name
    if (user) {
      if (b.userId && b.userId === user.uid) return true;
      if (user.email && b.customerEmail?.toLowerCase() === user.email.toLowerCase()) return true;
      if (user.displayName && b.customerName.toLowerCase().includes(user.displayName.toLowerCase())) return true;
    }

    // Default: show all recent bookings
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">مواعيدي المحجوزة</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Cloud className="w-3 h-3" />
                  مزامنة سحابية
                </span>
              </div>
              <p className="text-xs text-neutral-400">متابعة وإلغاء حجوزاتك في صالون عيوش سخنين لحظياً</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Auth Banner */}
        {!user ? (
          <div className="px-4 py-2.5 bg-neutral-950/60 border-b border-neutral-800/80 flex items-center justify-between gap-2 text-xs">
            <span className="text-neutral-400">هل سجلت حجزك عبر Google؟ سجل دخولك لعرض مواعيدك تلقائياً:</span>
            <button
              onClick={() => loginWithGoogle()}
              className="px-2.5 py-1 rounded bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <LogIn className="w-3 h-3" />
              دخول Google
            </button>
          </div>
        ) : (
          <div className="px-4 py-2 bg-neutral-950/60 border-b border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
            <span>متصل بحساب: <strong className="text-neutral-200">{user.email}</strong></span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              مربوط بقاعدة البيانات
            </span>
          </div>
        )}

        {/* Search Bar & Status message */}
        <div className="p-4 border-b border-neutral-800/80 bg-neutral-900 space-y-2">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث برقم الهاتف أو رقم الحجز (مثال: AB-8821)..."
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-750 focus:border-amber-500 text-xs sm:text-sm text-white placeholder:text-neutral-500 outline-none"
            />
          </div>

          {statusMessage && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Appointments List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="text-neutral-300 font-semibold text-sm">لا توجد مواعيد مطابقة</div>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                لم يتم العثور على أي حجز برقم الهاتف أو المرجع المدخل. احجز موعدك الآن في صالون عيوش!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onBookNew();
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 cursor-pointer"
              >
                احجز موعد جديد الآن
              </button>
            </div>
          ) : (
            filtered.map((b) => {
              const isCancelled = b.status === 'cancelled';
              const isCompleted = b.status === 'completed';
              const isConfirming = confirmCancelId === b.id;

              return (
                <div
                  key={b.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCancelled
                      ? 'bg-neutral-950/40 border-neutral-800/40 opacity-60'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800/60">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-750 text-center">
                        <div className="text-sm font-bold text-amber-400">{b.time}</div>
                        <div className="text-[10px] text-neutral-400">{b.date}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{b.customerName}</span>
                          <span className="text-[10px] font-mono bg-neutral-900 text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-800">
                            {b.bookingRef}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                          <span>صالون عيوش</span>
                          <span>•</span>
                          <span className="text-amber-500 font-semibold">{b.serviceNames.join(' + ')}</span>
                          <span>•</span>
                          <span>₪{b.totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isCancelled
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : isCompleted
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isCancelled ? 'ملغي' : isCompleted ? 'مكتمل' : 'مؤكد'}
                      </span>
                    </div>
                  </div>

                  {/* Actions & details */}
                  <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3 text-neutral-400">
                      <span className="flex items-center gap-1" dir="ltr">
                        <Phone className="w-3.5 h-3.5 text-neutral-500" />
                        {b.customerPhone}
                      </span>
                      {b.notes && (
                        <span className="truncate max-w-[150px] italic text-neutral-500">
                          «{b.notes}»
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!isCancelled && !isCompleted && (
                        <>
                          <a
                            href={formatWhatsAppMessage(b)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-neutral-900 text-emerald-400 hover:bg-emerald-950/60 border border-neutral-800"
                            title="تأكيد عبر واتساب"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => downloadIcsFile(b)}
                            className="p-1.5 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 cursor-pointer"
                            title="تحميل للتقويم"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {isConfirming ? (
                            <div className="flex items-center gap-1 bg-red-950/40 p-1 rounded-lg border border-red-800">
                              <span className="text-[11px] text-red-300 px-1">تأكيد الإلغاء؟</span>
                              <button
                                onClick={() => handleCancelBooking(b.id, b.bookingRef)}
                                className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] cursor-pointer"
                              >
                                نعم، إلغاء
                              </button>
                              <button
                                onClick={() => setConfirmCancelId(null)}
                                className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] cursor-pointer"
                              >
                                تراجع
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmCancelId(b.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-neutral-400 hover:text-red-400 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 cursor-pointer flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>إلغاء الحجز</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400">
          <span>صالون عيوش • سخنين، شارع مغارة العشرة</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
