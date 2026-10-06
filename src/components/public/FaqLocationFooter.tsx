import React, { useState } from 'react';
import {
  ChevronDown,
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  Clock,
  CalendarCheck,
  Shield,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  getCleanPhoneDigits,
  getFreeTrialWhatsAppUrl,
  getWhatsAppUrl,
} from '../../utils/contactLinks';

interface FaqLocationFooterProps {
  onBookTrialClick: () => void;
  onNavigateAdmin: () => void;
}

export const FaqLocationFooter: React.FC<FaqLocationFooterProps> = ({
  onBookTrialClick,
  onNavigateAdmin,
}) => {
  const { state } = useApp();
  const { faqs, settings } = state;

  const publishedFaqs = [...faqs]
    .filter((f) => f.isPublished)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const [openFaqId, setOpenFaqId] = useState<string | null>(
    publishedFaqs[0]?.id || null
  );
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  // Build dynamic FAQPage JSON-LD schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: publishedFaqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  const hasSocialLinks = Boolean(
    settings.socialInstagram || settings.socialFacebook || settings.socialYoutube
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ===================================================================
          FAQ SECTION (#faq)
      =================================================================== */}
      <section id="faq" className="py-16 md:py-24 border-b border-white/[0.08] bg-[#0F1012]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs font-semibold tracking-wider text-amber-500 uppercase">
                Frequently Asked Questions
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F5F5F0] tracking-tight">
                EVERYTHING YOU NEED TO KNOW BEFORE VISITING
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                Have a question about gym timings, beginner guidance, or membership rates in Bandra
                East? Find answers below or message us directly on WhatsApp.
              </p>
              <div className="pt-2">
                <a
                  href={getWhatsAppUrl(
                    settings.whatsapp,
                    "Hi, I have a question about joining Shirsekar's Fitness Hub."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#16181D] hover:bg-neutral-800 text-emerald-400 border border-neutral-800 text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Ask Us on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3">
              {publishedFaqs.map((faq, idx) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-xl bg-[#16181D] border border-white/[0.08] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <span className="font-display text-sm sm:text-base font-bold text-white">
                        <span className="font-mono text-amber-500 mr-2 tabular-nums">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-amber-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-sm text-neutral-300 leading-relaxed border-t border-white/[0.06]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          LOCATION & CONTACT SECTION (#contact)
      =================================================================== */}
      <section id="contact" className="py-16 md:py-24 border-b border-white/[0.08] bg-[#0A0A0B]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-amber-500 uppercase">
              Visit Us in Bandra East <span aria-hidden="true">·</span> Direct Contact
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F5F5F0] tracking-tight">
              FIND SHIRSEKARS&apos; FITNESS HUB
            </h2>
            <p className="text-sm sm:text-base text-neutral-400">
              Stop by for a floor tour, call our desk, or drop a message on WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Contact Details & Action Matrix */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-xl bg-[#16181D] border border-white/[0.08] flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    {settings.businessName}
                  </h3>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">
                    {settings.managedBy} · {settings.marathiName}
                  </p>
                </div>

                <div className="space-y-4 text-sm text-neutral-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Address</p>
                      <p className="text-neutral-300 leading-relaxed mt-0.5">
                        Mahatma Gandhi Vidyamandir,
                        <br />
                        JL Shirshekar Marg, Government Colony,
                        <br />
                        Bandra East, Mumbai, Maharashtra 400051
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Phone & WhatsApp</p>
                      <p className="font-mono text-base text-amber-400 font-bold tabular-nums mt-0.5">
                        {settings.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Operating Hours</p>
                      <p className="text-neutral-300 mt-0.5">{settings.openingHours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Required Conversion Buttons */}
              <div className="pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${getCleanPhoneDigits(settings.phone)}`}
                  className="py-3 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>CALL NOW</span>
                </a>

                <a
                  href={getFreeTrialWhatsAppUrl(settings.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>WHATSAPP</span>
                </a>

                <a
                  href={settings.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-lg bg-[#0A0A0B] hover:bg-neutral-900 text-neutral-200 border border-neutral-700 font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Navigation className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>GET DIRECTIONS</span>
                </a>

                <button
                  type="button"
                  onClick={onBookTrialClick}
                  className="py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <CalendarCheck className="w-4 h-4 shrink-0" />
                  <span>BOOK FREE TRIAL</span>
                </button>
              </div>
            </div>

            {/* Map-Style Location Area */}
            <div className="lg:col-span-7 rounded-xl bg-[#16181D] border border-white/[0.08] overflow-hidden flex flex-col justify-between min-h-[360px]">
              <div className="relative flex-1 bg-[#0D0F14] p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
                {/* Architectural Street Grid Representation for Bandra East */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                  }}
                />
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="text-xs text-neutral-400">
                    <span className="text-amber-400 font-semibold">Landmark:</span> Mahatma Gandhi
                    Vidyamandir · Government Colony
                  </div>
                  <span className="text-xs font-mono text-neutral-400 tabular-nums">
                    Bandra East · 400051
                  </span>
                </div>

                {/* Center Map Pin Card */}
                <div className="relative z-10 my-8 max-w-md mx-auto w-full p-5 rounded-xl bg-[#16181D]/95 border border-amber-500/40 shadow-2xl space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-bold text-white">
                        Shirsekar&apos;s Fitness Hub
                      </h4>
                      <p className="text-xs text-neutral-300 mt-0.5">
                        JL Shirshekar Marg, Government Colony, Bandra East, Mumbai
                      </p>
                      <p className="text-xs text-amber-400 font-mono mt-1 tabular-nums">
                        ★ {settings.googleRating} ({settings.googleReviewsCount} Reviews) · Open
                        until 10:30 PM
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={settings.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs text-center transition-colors"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
                  <span>Easy access from Bandra Railway Station (East) & Western Express Hwy</span>
                  <a
                    href={settings.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline font-medium"
                  >
                    View Live Route
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          FOOTER
      =================================================================== */}
      <footer className="bg-[#0A0A0B] pt-14 pb-20 md:pb-12 text-neutral-400">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-white/[0.08]">
            {/* Brand Column */}
            <div className="lg:col-span-5 space-y-3">
              <p className="font-display text-xl font-extrabold text-white tracking-tight">
                {settings.businessName}
              </p>
              <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                {settings.managedBy}
              </p>
              <p className="text-xs text-neutral-400">
                {settings.marathiName} · {settings.marathiManagedBy}
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm pt-1">
                Strength training, free weights, cardio conditioning, and supportive coaching in
                Government Colony, Bandra East, Mumbai.
              </p>

              {/* Only display social accounts if actually configured */}
              {hasSocialLinks && (
                <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-neutral-300">
                  {settings.socialInstagram && (
                    <a
                      href={settings.socialInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-400 transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {settings.socialFacebook && (
                    <a
                      href={settings.socialFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-400 transition-colors"
                    >
                      Facebook
                    </a>
                  )}
                  {settings.socialYoutube && (
                    <a
                      href={settings.socialYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-400 transition-colors"
                    >
                      YouTube
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                Quick Links
              </h3>
              <ul className="grid grid-cols-2 gap-2 text-xs">
                <li>
                  <a href="#home" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#facilities" className="hover:text-white transition-colors">
                    Facilities
                  </a>
                </li>
                <li>
                  <a href="#training" className="hover:text-white transition-colors">
                    Training
                  </a>
                </li>
                <li>
                  <a href="#membership" className="hover:text-white transition-colors">
                    Membership
                  </a>
                </li>
                <li>
                  <a href="#gallery" className="hover:text-white transition-colors">
                    Gallery
                  </a>
                </li>
                <li>
                  <a href="#reviews" className="hover:text-white transition-colors">
                    Reviews
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Summary */}
            <div className="lg:col-span-4 space-y-3 text-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                Contact & Timings
              </h3>
              <p className="text-neutral-300 leading-relaxed">{settings.address}</p>
              <p className="font-mono text-white font-semibold tabular-nums">
                Phone: {settings.phone}
              </p>
              <p className="text-emerald-400">{settings.openingHours}</p>
            </div>
          </div>

          {/* Bottom Legal & Admin Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-500">
            <p>© 2026 Shirsekar&apos;s Fitness Hub. Managed by Fit Mantras.</p>
            <div className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={() => setLegalModal('privacy')}
                className="hover:text-neutral-300 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setLegalModal('terms')}
                className="hover:text-neutral-300 transition-colors cursor-pointer"
              >
                Terms & Conditions
              </button>
              <button
                type="button"
                onClick={onNavigateAdmin}
                className="inline-flex items-center gap-1 text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Dashboard (/admin)</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy / Terms & Conditions Modal */}
      {legalModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={legalModal === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions'}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-xl w-full rounded-xl bg-[#16181D] border border-neutral-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-display text-lg font-bold text-white">
                {legalModal === 'privacy'
                  ? "Privacy Policy — Shirsekar's Fitness Hub"
                  : "Terms & Conditions — Shirsekar's Fitness Hub"}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                aria-label="Close dialog"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-300 leading-relaxed max-h-[60vh] overflow-y-auto">
              {legalModal === 'privacy' ? (
                <>
                  <p>
                    Shirsekar&apos;s Fitness Hub (Managed by Fit Mantras) respects your privacy.
                    Contact information submitted through our Free Trial or Membership Enquiry forms
                    (Name, Phone Number, Email, and Fitness Goals) is used solely to schedule your
                    gym visit and share membership details.
                  </p>
                  <p>
                    We do not sell or rent member phone numbers or personal data to third-party
                    telemarketers. To request deletion of your enquiry record, contact our front
                    desk at {settings.phone}.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    1. Free trial sessions are subject to prior slot confirmation and presentation
                    of valid photo ID at the Shirsekar&apos;s Fitness Hub front desk in Bandra East.
                  </p>
                  <p>
                    2. Members and trial guests are requested to carry clean indoor workout shoes, a
                    hand towel, and re-rack weights after use to maintain a safe floor environment.
                  </p>
                  <p>
                    3. Membership fees, personal training packages, and promotional tariffs are
                    governed by the enrollment agreement signed at the gym desk.
                  </p>
                </>
              )}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
