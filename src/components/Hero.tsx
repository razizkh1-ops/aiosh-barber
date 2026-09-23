import React from 'react';
import { Scissors, Phone, MessageSquare, Star, MapPin, Calendar, Clock, CheckCircle2, Award } from 'lucide-react';
import { SHOP_INFO } from '../data/barberData';

interface HeroProps {
  onBookNow: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookNow }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 bg-neutral-950 border-b border-neutral-850">
      {/* Subtle background ambient gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-32 right-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Hero Text & Main Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>الصالون الأول للرجال في سخنين • صالون عيوش</span>
            </div>

            {/* Main Headline - Keeping the title AIOSH BARBER */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.2]">
              قصات متقنة. تدريج احترافي. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 font-extrabold">
                AIOSH BARBER
              </span>{' '}
              في سخنين.
            </h1>

            {/* Description */}
            <p className="text-neutral-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
              نقدم لك أعلى معايير قصات الشعر العصرية، سكن فيد دقيق بالموس، نحت وتحديد اللحية، وحلاقة ملكية فاخرة بالفوطة الساخنة. حجز سريع أونلاين وتأكيد فوري عبر الواتساب.
            </p>

            {/* Quick Contact Ribbon */}
            <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400 font-medium">موقع الصالون</div>
                  <a 
                    href={SHOP_INFO.googleMapsQuery}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-neutral-200 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <span>{SHOP_INFO.address}</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400 font-medium">الاتصال والواتساب المباشر</div>
                  <a href={`tel:${SHOP_INFO.phoneRaw}`} className="font-bold text-amber-400 hover:underline">
                    {SHOP_INFO.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                id="hero-book-btn"
                onClick={onBookNow}
                className="px-7 py-4 rounded-xl text-base font-bold text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/35 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <Scissors className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                <span>احجز دورك أونلاين الآن</span>
              </button>

              <a
                id="hero-whatsapp-btn"
                href={SHOP_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-xl text-base font-semibold text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-700/80 hover:border-emerald-500/60 shadow-md transition-all flex items-center justify-center gap-2.5"
              >
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>واتساب عيوش: {SHOP_INFO.phone}</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-800/80 text-neutral-400 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>بدون انتظار بالدور</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span>حلاقة شخصية مع عيوش</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>قص 40 ₪ • مع لحية 50 ₪</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl shadow-black/80">
              
              {/* Image Frame */}
              <div className="aspect-[4/3] sm:aspect-[16/11] relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80"
                  alt="AIOSH BARBER صالون عيوش سخنين"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                
                {/* Floating Badge */}
                <div className="absolute top-4 left-4 bg-neutral-950/90 backdrop-blur-md border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-400 flex items-center gap-1.5 shadow-lg">
                  <Scissors className="w-3.5 h-3.5 text-amber-400" />
                  <span>قص شعر ₪40 • مع لحية ₪50</span>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-5 space-y-3 bg-neutral-900">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutral-400">الحلاق والمؤسس</div>
                    <div className="text-lg font-bold text-neutral-100">عيوش • AIOSH BARBER</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    فرع سخنين الرئيسي
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    مفتوح اليوم: 10:00 – 21:00
                  </span>
                  <button
                    onClick={onBookNow}
                    className="text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    اختر الخدمة والموعد ←
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
