import React, { useState } from 'react';
import { Phone, MessageSquare, Calendar, Clock, Menu, X, Scissors, UserCheck, ShieldCheck, LogIn, LogOut, User } from 'lucide-react';
import { SHOP_INFO } from '../data/barberData';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenMyAppointments: () => void;
  onOpenBarberPortal: () => void;
  activeBookingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenMyAppointments,
  onOpenBarberPortal,
  activeBookingCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, loginWithGoogle, logout } = useAuth();

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      {/* Top micro bar with contact info */}
      <div className="bg-neutral-900 border-b border-neutral-800/80 px-4 py-1.5 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              سخنين، شارع مغارة العشرة
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              مفتوح اليوم: 10:00 – 21:00
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              id="top-nav-call"
              href={`tel:${SHOP_INFO.phoneRaw}`}
              className="flex items-center gap-1 hover:text-amber-400 transition-colors font-medium text-neutral-200"
            >
              <Phone className="w-3 h-3 text-amber-500" />
              <span>{SHOP_INFO.phoneDisplay}</span>
            </a>
            <span className="text-neutral-700">|</span>
            <a
              id="top-nav-whatsapp"
              href={SHOP_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageSquare className="w-3 h-3" />
              <span>واتساب</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo - Keep Title AIOSH BARBER */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-950/50 group-hover:scale-105 transition-transform duration-300">
            <Scissors className="w-6 h-6 text-neutral-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wider text-neutral-100 uppercase">
                AIOSH <span className="text-amber-500 font-light">BARBER</span>
              </span>
            </div>
            <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium flex items-center gap-1.5">
              <span>صالون عيوش</span>
              <span className="text-amber-500">•</span>
              <span>سخنين</span>
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <button
            id="nav-services-btn"
            onClick={() => scrollTo('services-section')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            الخدمات والأسعار
          </button>
          <button
            id="nav-location-btn"
            onClick={() => scrollTo('location-section')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            الموقع وساعات العمل
          </button>
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* User / Auth status */}
          {user ? (
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px]">
                  {user.displayName ? user.displayName[0] : 'U'}
                </div>
              )}
              <span className="text-neutral-300 max-w-[100px] truncate font-medium">
                {isAdmin ? 'عيوش (مسؤول)' : user.displayName || user.email?.split('@')[0]}
              </span>
              <button
                onClick={() => logout()}
                title="تسجيل الخروج"
                className="text-neutral-500 hover:text-red-400 p-0.5 rounded transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => loginWithGoogle()}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-300 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-amber-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
              title="تسجيل الدخول باستخدام حساب Google"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>دخول Google</span>
            </button>
          )}

          <button
            id="nav-my-bookings-btn"
            onClick={onOpenMyAppointments}
            className="relative px-3 py-2 rounded-lg text-xs font-semibold text-neutral-300 bg-neutral-900 border border-neutral-700/80 hover:border-amber-500/60 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>مواعيدي</span>
            {activeBookingCount > 0 && (
              <span className="w-4.5 h-4.5 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-extrabold flex items-center justify-center">
                {activeBookingCount}
              </span>
            )}
          </button>

          <button
            id="nav-book-now-cta"
            onClick={onOpenBooking}
            className="px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Scissors className="w-4 h-4" />
            <span>احجز دورك</span>
          </button>

          <button
            id="nav-portal-btn"
            onClick={onOpenBarberPortal}
            title="لوحة مواعيد الحلاق"
            className="p-2 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            id="mobile-book-quick"
            onClick={onOpenBooking}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-950 bg-amber-500 cursor-pointer"
          >
            احجز
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-neutral-900/98 border-b border-neutral-800 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyAppointments();
              }}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-neutral-800 text-neutral-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              مواعيدي ({activeBookingCount})
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBarberPortal();
              }}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-neutral-800 text-neutral-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-500" />
              لوحة المواعيد
            </button>
          </div>

          <div className="flex flex-col space-y-2 text-sm font-medium text-neutral-300">
            <button
              onClick={() => scrollTo('services-section')}
              className="text-right py-2 hover:text-amber-400 border-b border-neutral-800/60 cursor-pointer"
            >
              الخدمات والأسعار (₪)
            </button>
            <button
              onClick={() => scrollTo('location-section')}
              className="text-right py-2 hover:text-amber-400 cursor-pointer"
            >
              الموقع وساعات العمل (سخنين)
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href={`tel:${SHOP_INFO.phoneRaw}`}
              className="w-full py-2.5 rounded-lg bg-neutral-800 text-neutral-100 font-semibold text-center text-sm flex items-center justify-center gap-2 border border-neutral-700"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              اتصال: {SHOP_INFO.phoneDisplay}
            </a>
            <a
              href={SHOP_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-lg bg-emerald-600/90 text-white font-semibold text-center text-sm flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              محادثة واتساب
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
