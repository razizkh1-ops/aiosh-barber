import React from 'react';
import { 
  Scissors, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { SERVICES_LIST } from '../data/barberData';
import { BarberService } from '../types';

interface ServicesSectionProps {
  onSelectServiceToBook: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceToBook }) => {
  return (
    <section id="services-section" className="py-16 sm:py-20 bg-neutral-950 border-b border-neutral-850">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Scissors className="w-3.5 h-3.5" />
            <span>أسعار الحلاقة في صالون عيوش</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            خدمات الحلاقة والأسعار
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            أسعار واضحة ومحددة بالشيكل (₪) لدى الحلاق عيوش في سخنين. دقة بالعمل واحترافية عالية.
          </p>
        </div>

        {/* 2 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES_LIST.map((service: BarberService) => {
            const isBeard = service.id === 'haircut-with-beard';

            return (
              <div
                key={service.id}
                className={`rounded-2xl border p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  isBeard
                    ? 'bg-neutral-900 border-amber-500/50 shadow-2xl shadow-amber-500/10'
                    : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {isBeard && (
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black text-xs uppercase px-4 py-1.5 rounded-br-xl shadow-md">
                    الأكثر طلباً
                  </div>
                )}

                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                      isBeard 
                        ? 'bg-amber-500 text-neutral-950 font-bold' 
                        : 'bg-neutral-800 border border-neutral-700 text-amber-400'
                    }`}>
                      {isBeard ? <Sparkles className="w-7 h-7" /> : <Scissors className="w-7 h-7" />}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xl text-white">
                        {service.name}
                      </h3>
                      <span className="text-xs text-neutral-400 font-medium">
                        {service.nameHe}
                      </span>
                    </div>
                  </div>

                  <p className="text-neutral-300 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs text-neutral-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>المدة المقدرة: <strong>{service.durationMin} دقيقة</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{isBeard ? 'قص وتدريج شعر + ترتيب وتحديد اللحية بالموس' : 'قص شعر احترافي وتدريج متقن وتنظيف الرقبة'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>حلاقة شخصية على يد عيوش</span>
                    </div>
                  </div>
                </div>

                {/* Price & Book Action */}
                <div className="pt-6 mt-6 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-400 block font-medium">السعر:</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                        ₪{service.price}
                      </span>
                      <span className="text-xs text-neutral-400 font-semibold">شيكل</span>
                    </div>
                  </div>

                  <button
                    id={`book-service-${service.id}`}
                    onClick={() => onSelectServiceToBook(service.id)}
                    className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>احجز الآن</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
