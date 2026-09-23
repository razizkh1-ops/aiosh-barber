import React from 'react';
import { Scissors, Phone, MessageSquare, MapPin, Clock, Heart } from 'lucide-react';
import { SHOP_INFO } from '../data/barberData';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenMyAppointments: () => void;
  onOpenBarberPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenMyAppointments,
  onOpenBarberPortal,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-850 pt-16 pb-12 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-neutral-850">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-neutral-950 font-bold shadow-md">
                <Scissors className="w-5 h-5" />
              </div>
              <span className="font-black text-xl text-white tracking-wider">
                AIOSH <span className="text-amber-500 font-light">BARBER</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              صالون الحلاقة الرجالي الرائد في سخنين. متخصصون في القصات الحديثة، تدريج بالموس، نحت وتحديد اللحية، والحلاقة الملكية بالفوطة الساخنة.
            </p>
            <div className="text-xs text-neutral-300 font-medium">
              صالون عيوش • سخنين، إسرائيل
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">روابط سريعة</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => scrollTo('services-section')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  الخدمات وقائمة الأسعار (₪)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('location-section')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  الموقع وساعات العمل
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">تواصل مباشر</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${SHOP_INFO.phoneRaw}`} className="text-white hover:text-amber-400 font-bold" dir="ltr">
                  {SHOP_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={SHOP_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                  واتساب: {SHOP_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{SHOP_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>الأحد–الخميس والسبت: 10:00–21:00 | الجمعة: 09:00–18:00</span>
              </li>
            </ul>
          </div>

          {/* Client & Barber Management */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">إدارة المواعيد</h4>
            <p className="text-xs text-neutral-400">
              تريد مراجعة موعدك أو إلغاء/تعديل حجز مسبق؟
            </p>
            <div className="space-y-2 pt-1">
              <button
                onClick={onOpenMyAppointments}
                className="w-full py-2 px-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>مراجعة مواعيدي المحجوزة</span>
              </button>
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>حجز دور جديد الآن</span>
              </button>
              <button
                onClick={onOpenBarberPortal}
                className="text-[11px] text-neutral-400 hover:text-neutral-200 block mx-auto pt-1 underline cursor-pointer"
              >
                لوحة مواعيد الحلاق
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            © {new Date().getFullYear()} AIOSH BARBER • صالون عيوش. جميع الحقوق محفوظة. سخنين، إسرائيل.
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <span>صالون عيوش سخنين</span>
            <span>•</span>
            <a href={`tel:${SHOP_INFO.phoneRaw}`} className="text-amber-400 font-bold hover:underline" dir="ltr">
              {SHOP_INFO.phoneDisplay}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
