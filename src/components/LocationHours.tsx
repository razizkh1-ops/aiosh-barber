import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Navigation, Calendar, Compass, ExternalLink } from 'lucide-react';
import { SHOP_INFO } from '../data/barberData';

interface LocationHoursProps {
  onBookNow: () => void;
}

export const LocationHours: React.FC<LocationHoursProps> = ({ onBookNow }) => {
  return (
    <section id="location-section" className="py-16 sm:py-20 bg-neutral-950 border-b border-neutral-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>زورونا في سخنين</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            الموقع، ساعات العمل والتواصل المباشر
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            موقع مميز في قلب سخنين - الجليل. مواقف سيارات مريحة ومتوفرة بالقرب من الصالون.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 items-stretch">
          
          {/* Left Column: Opening Hours & Contact Details */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            
            {/* Contact Box */}
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-500" />
                تواصل مع صالون عيوش • AIOSH BARBER
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-neutral-950/80 border border-neutral-850">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-neutral-400">رقم الهاتف للاتصال المباشر</div>
                    <a
                      href={`tel:${SHOP_INFO.phoneRaw}`}
                      className="text-base font-extrabold text-white hover:text-amber-400 transition-colors"
                      dir="ltr"
                    >
                      {SHOP_INFO.phone} ({SHOP_INFO.phoneDisplay})
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-neutral-950/80 border border-neutral-850">
                  <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-neutral-400">حجز واستفسارات عبر الواتساب</div>
                    <a
                      href={SHOP_INFO.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>محادثة واتساب فورية ({SHOP_INFO.phone})</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-neutral-950/80 border border-neutral-850">
                  <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-neutral-400">العنوان والإحداثيات</div>
                    <div className="text-sm font-semibold text-neutral-200">
                      سخنين، شارع مغارة العشرة، إسرائيل
                    </div>
                    <div className="text-xs font-mono text-amber-400 font-semibold mt-1 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 inline-block" dir="ltr">
                      32°52'16.8"N 35°17'28.8"E
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      موقع الصالون الدقيق في سخنين بشارع مغارة العشرة مع إمكانية التوجيه المباشر عبر Waze و Google Maps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours Box */}
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                أوقات الدوام وساعات العمل
              </h3>

              <div className="space-y-2.5">
                {SHOP_INFO.hours.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-neutral-950 border border-neutral-850 text-xs sm:text-sm"
                  >
                    <span className="font-medium text-neutral-300">{h.days}</span>
                    <span className="font-bold text-amber-400" dir="ltr">{h.hours}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>الحجز الأونلاين متاح على مدار 24 ساعة طوال أيام الأسبوع.</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Map & Navigation Card */}
          <div className="lg:col-span-6 bg-neutral-900 rounded-2xl border border-neutral-800 p-6 flex flex-col justify-between space-y-6">
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-500" />
                  اتجاهات الوصول إلى سخنين
                </h3>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  سهولة الوصول ومواقف متوفرة
                </span>
              </div>

              {/* Map Illustration / Visual */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
                <iframe
                  title="خريطة صالون عيوش سخنين"
                  src="https://maps.google.com/maps?q=32.871333,35.291333&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 contrast-125 opacity-90 hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
                
                {/* Floating overlay pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="px-3 py-1.5 rounded-xl bg-neutral-950/95 border-2 border-amber-500 text-amber-400 font-extrabold text-xs shadow-2xl flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 fill-amber-500 text-neutral-950" />
                    <span>AIOSH BARBER • صالون عيوش سخنين</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <a
                  id="waze-directions-btn"
                  href={SHOP_INFO.wazeQuery}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <span>فتح في Waze</span>
                </a>

                <a
                  id="gmaps-directions-btn"
                  href={SHOP_INFO.googleMapsQuery}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-neutral-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>Google Maps</span>
                </a>
              </div>

              <button
                id="location-book-cta"
                onClick={onBookNow}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>احجز موعدك الآن واضمن دورك</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
