import React, { useState } from 'react';
import { Menu, X, Phone, MessageSquare, CalendarCheck, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCleanPhoneDigits, getFreeTrialWhatsAppUrl } from '../../utils/contactLinks';

interface NavbarProps {
  onNavigateAdmin: () => void;
  onSelectTrialGoal?: (goal: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateAdmin, onSelectTrialGoal }) => {
  const { state } = useApp();
  const { settings } = state;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home', alwaysVisible: false },
    { label: 'About', href: '#about', alwaysVisible: true },
    { label: 'Facilities', href: '#facilities', alwaysVisible: true },
    { label: 'Training', href: '#training', alwaysVisible: true },
    { label: 'Membership', href: '#membership', alwaysVisible: true },
    { label: 'Gallery', href: '#gallery', alwaysVisible: false },
    { label: 'Reviews', href: '#reviews', alwaysVisible: true },
    { label: 'Contact', href: '#contact', alwaysVisible: false },
  ];

  const handleBookTrialClick = () => {
    setMobileMenuOpen(false);
    if (onSelectTrialGoal) {
      onSelectTrialGoal('General Fitness');
    }
    const el = document.getElementById('free-trial');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Bar Contract: Strictly 1 row, 3 zones (Brand Wordmark | Nav Links | Primary Actions) */}
      <header className="sticky top-0 z-40 h-14 md:h-16 w-full bg-[#0A0A0B]/95 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-[1280px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#home"
            className="font-display text-base sm:text-lg font-extrabold tracking-tight text-[#F5F5F0] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-500"
          >
            {settings.businessName}
          </a>

          {/* Zone 2: Clean text navigation links with subtle hover underlines */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-300"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`${
                  item.alwaysVisible ? 'inline-block' : 'hidden xl:inline-block'
                } hover:text-white underline-offset-8 hover:underline decoration-amber-500 transition-colors whitespace-nowrap py-1`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1–2 Primary Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onNavigateAdmin}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white rounded-lg border border-transparent hover:border-neutral-800 transition-colors whitespace-nowrap"
              aria-label="Open Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={handleBookTrialClick}
              className="hidden md:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wide text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              BOOK FREE TRIAL
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0F1012] border-b border-neutral-800 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
            <div className="pb-2 border-b border-neutral-800/80">
              <p className="text-xs text-amber-400 font-medium">{settings.managedBy}</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                {settings.marathiName} · {settings.marathiManagedBy}
              </p>
            </div>
            <nav aria-label="Mobile Navigation" className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-200 hover:text-white hover:bg-neutral-900 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 border-t border-neutral-800/80">
              <button
                type="button"
                onClick={handleBookTrialClick}
                className="w-full py-2.5 px-4 rounded-lg bg-amber-500 text-neutral-950 font-semibold text-xs tracking-wide text-center"
              >
                BOOK FREE TRIAL
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateAdmin();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium text-xs text-center"
              >
                Admin Portal (/admin)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom CTA Bar (Strictly <= 15% aggregate sticky height: h-12 = 48px) */}
      <div
        role="region"
        aria-label="Quick Contact Actions"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-12 bg-[#0A0A0B]/95 backdrop-blur-md border-t border-neutral-800 grid grid-cols-3 divide-x divide-neutral-800"
      >
        <a
          href={`tel:${getCleanPhoneDigits(settings.phone)}`}
          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-200 hover:text-white active:bg-neutral-900 transition-colors whitespace-nowrap"
        >
          <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>CALL</span>
        </a>
        <a
          href={getFreeTrialWhatsAppUrl(settings.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 active:bg-neutral-900 transition-colors whitespace-nowrap"
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
          <span>WHATSAPP</span>
        </a>
        <button
          type="button"
          onClick={handleBookTrialClick}
          className="flex items-center justify-center gap-1.5 text-xs font-bold text-neutral-950 bg-amber-500 hover:bg-amber-400 transition-colors whitespace-nowrap"
        >
          <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
          <span>FREE TRIAL</span>
        </button>
      </div>
    </>
  );
};
