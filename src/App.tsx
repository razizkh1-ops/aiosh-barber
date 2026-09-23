import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BookingWizard } from './components/BookingWizard';
import { ServicesSection } from './components/ServicesSection';
import { LocationHours } from './components/LocationHours';
import { Footer } from './components/Footer';
import { MyAppointmentsModal } from './components/MyAppointmentsModal';
import { BarberDashboardModal } from './components/BarberDashboardModal';
import { AppointmentBooking } from './types';
import { getStoredBookings } from './utils/bookingUtils';
import { subscribeToAppointments } from './services/appointmentService';
import { Phone, MessageSquare, Scissors, ArrowUp } from 'lucide-react';
import { SHOP_INFO } from './data/barberData';

export default function App() {
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | null>(null);
  const [isMyAppointmentsOpen, setIsMyAppointmentsOpen] = useState(false);
  const [isBarberPortalOpen, setIsBarberPortalOpen] = useState(false);
  const [bookingsList, setBookingsList] = useState<AppointmentBooking[]>(() => getStoredBookings());
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Real-time Firestore sync
  useEffect(() => {
    const unsub = subscribeToAppointments((updated) => {
      setBookingsList(updated);
    });
    return () => unsub();
  }, []);

  // Monitor scroll for back-to-top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenBooking = (serviceId?: string) => {
    if (serviceId) {
      setSelectedServiceForBooking(serviceId);
    }
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingCompleted = (booking: AppointmentBooking) => {
    setBookingsList(getStoredBookings());
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeBookingCount = bookingsList.filter(b => b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950">
      
      {/* Navigation */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenMyAppointments={() => setIsMyAppointmentsOpen(true)}
        onOpenBarberPortal={() => setIsBarberPortalOpen(true)}
        activeBookingCount={activeBookingCount}
      />

      {/* Main Content */}
      <main className="flex-grow">
        
        {/* Hero Section */}
        <Hero onBookNow={() => handleOpenBooking()} />

        {/* Live Booking Section */}
        <section id="booking-section" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-neutral-950 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs uppercase font-extrabold text-amber-500 tracking-widest">
                حجز فوري ومباشر عبر الإنترنت
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                اختر الخدمة واحجز دورك الآن
              </h2>
            </div>

            <BookingWizard
              initialServiceId={selectedServiceForBooking}
              onBookingComplete={handleBookingCompleted}
            />
          </div>
        </section>

        {/* Services & Pricing Menu */}
        <ServicesSection
          onSelectServiceToBook={(serviceId) => handleOpenBooking(serviceId)}
        />

        {/* Location, Map & Working Hours */}
        <LocationHours onBookNow={() => handleOpenBooking()} />

      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenMyAppointments={() => setIsMyAppointmentsOpen(true)}
        onOpenBarberPortal={() => setIsBarberPortalOpen(true)}
      />

      {/* Floating Speed Contact Bubble (Fixed Bottom-Left for RTL) */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2.5">
        
        {/* WhatsApp direct floating button */}
        <a
          id="floating-whatsapp-btn"
          href={SHOP_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all group"
          title="تواصل معنا عبر واتساب"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute left-14 bg-neutral-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md border border-neutral-700 shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            واتساب +972 0549898923
          </span>
        </a>

        {/* Phone Call direct floating button */}
        <a
          id="floating-call-btn"
          href={`tel:${SHOP_INFO.phoneRaw}`}
          className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 hover:scale-110 active:scale-95 transition-all group"
          title={`اتصال هاتفي بصالون عيوش: ${SHOP_INFO.phoneDisplay}`}
        >
          <Phone className="w-5 h-5 fill-neutral-950" />
          <span className="absolute left-14 bg-neutral-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md border border-neutral-700 shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            اتصال {SHOP_INFO.phoneDisplay}
          </span>
        </a>

        {/* Scroll To Top */}
        {showScrollTop && (
          <button
            id="back-to-top-btn"
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-neutral-850 hover:bg-neutral-750 text-neutral-300 hover:text-white flex items-center justify-center border border-neutral-700 shadow-lg transition-all cursor-pointer"
            title="العودة لأعلى الصفحة"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

      </div>

      {/* Client Appointments Lookup Modal */}
      <MyAppointmentsModal
        isOpen={isMyAppointmentsOpen}
        onClose={() => setIsMyAppointmentsOpen(false)}
        onBookNew={() => handleOpenBooking()}
      />

      {/* Owner Schedule & Barber Desk Modal */}
      <BarberDashboardModal
        isOpen={isBarberPortalOpen}
        onClose={() => setIsBarberPortalOpen(false)}
      />

    </div>
  );
}
