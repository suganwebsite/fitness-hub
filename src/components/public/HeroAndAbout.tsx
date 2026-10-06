import React from 'react';
import {
  ArrowRight,
  MessageSquare,
  MapPin,
  Clock,
  Dumbbell,
  HeartPulse,
  Flame,
  UserCheck,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ResilientImage } from '../ResilientImage';
import { getFreeTrialWhatsAppUrl } from '../../utils/contactLinks';
import { FacilityItem } from '../../types/fitness';

interface HeroAndAboutProps {
  onBookTrialClick: (goal?: string) => void;
}

export const HeroAndAbout: React.FC<HeroAndAboutProps> = ({ onBookTrialClick }) => {
  const { state } = useApp();
  const { settings } = state;

  const renderFacilityIcon = (iconName: FacilityItem['iconName']) => {
    switch (iconName) {
      case 'Dumbbell':
        return <Dumbbell className="w-5 h-5 text-amber-500" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-amber-500" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-amber-500" />;
      case 'Users':
        return <Users className="w-5 h-5 text-amber-500" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-amber-500" />;
    }
  };

  const activeFacilities = settings.facilities.filter((f) => f.isActive);

  return (
    <>
      {/* ===================================================================
          HERO SECTION (#home)
      =================================================================== */}
      <section
        id="home"
        className="relative overflow-hidden border-b border-white/[0.08] bg-[#0A0A0B]"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Brand Lockup, Headline, Copy, CTAs, Trust Indicators */}
            <div className="lg:col-span-7 space-y-6">
              {/* Unboxed Brand & Marathi Identity Lockup (Zero-Pill Discipline) */}
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold tracking-wider text-amber-500 uppercase">
                  {settings.businessName} <span aria-hidden="true">·</span> {settings.managedBy}
                </p>
                <p className="text-xs sm:text-sm text-neutral-400 font-medium">
                  {settings.marathiName} <span aria-hidden="true">·</span>{' '}
                  {settings.marathiManagedBy}
                </p>
              </div>

              {/* Dominant Athletic Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F5F0] leading-[1.06] max-w-2xl">
                {settings.heroHeading}
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-[62ch]">
                {settings.heroDescription}
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => onBookTrialClick('General Fitness')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm tracking-wide transition-all duration-150 cursor-pointer whitespace-nowrap shadow-lg shadow-amber-500/10"
                >
                  <span>{settings.heroCtaPrimary}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <a
                  href={getFreeTrialWhatsAppUrl(settings.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#16181D] hover:bg-neutral-800 text-[#F5F5F0] border border-neutral-700 font-semibold text-sm tracking-wide transition-all duration-150 whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{settings.heroCtaSecondary}</span>
                </a>

                <a
                  href="#membership"
                  className="inline-flex items-center justify-center px-4 py-3.5 text-sm font-semibold text-neutral-300 hover:text-amber-400 underline-offset-8 hover:underline transition-colors whitespace-nowrap"
                >
                  VIEW MEMBERSHIPS
                </a>
              </div>

              {/* Small Trust Indicators — Clean Unboxed Metadata with Typographic Separators */}
              <div className="pt-6 border-t border-white/[0.08]">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-neutral-300">
                  <span className="font-semibold text-amber-400 tabular-nums">
                    ★ {settings.googleRating} Google Rating
                  </span>
                  <span aria-hidden="true" className="text-neutral-600">
                    ·
                  </span>
                  <span className="tabular-nums font-medium">
                    {settings.googleReviewsCount}+ Reviews
                  </span>
                  <span aria-hidden="true" className="text-neutral-600">
                    ·
                  </span>
                  <span className="text-neutral-300">Bandra East, Mumbai</span>
                  <span aria-hidden="true" className="text-neutral-600">
                    ·
                  </span>
                  <span className="text-emerald-400 font-medium">Open until 10:30 PM</span>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Mahatma Gandhi Vidyamandir, JL Shirshekar Marg, Government Colony, Bandra East,
                  Mumbai 400051
                </p>
              </div>
            </div>

            {/* Right Column: High-Impact 16:9 / 4:3 Athletic Visual Carrier with Measured Scrim */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#16181D] aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] shadow-2xl">
                <ResilientImage
                  src={settings.heroImage}
                  alt="Strength training floor at Shirsekar's Fitness Hub in Bandra East, Mumbai"
                  loading="eager"
                  className="w-full h-full object-cover"
                />
                {/* Measured Contrast Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
                      Government Colony · Bandra East
                    </p>
                    <p className="text-sm sm:text-base font-bold text-white mt-0.5">
                      Your fitness journey starts with one visit.
                    </p>
                  </div>
                  <a
                    href={settings.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-black/70 hover:bg-black text-xs font-semibold text-neutral-200 border border-white/15 whitespace-nowrap shrink-0 transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          ABOUT SECTION (#about) — WHY SHIRSEKARS' FITNESS HUB?
      =================================================================== */}
      <section id="about" className="py-16 md:py-24 border-b border-white/[0.08] bg-[#0A0A0B]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-3">
              <p className="text-xs font-semibold tracking-wider text-amber-500 uppercase">
                About Our Fitness Center <span aria-hidden="true">·</span> {settings.managedBy}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F5F5F0] tracking-tight">
                {settings.aboutHeading}
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                {settings.aboutDescription}
              </p>
            </div>
          </div>

          {/* Asymmetric Bento Grid — Core Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 (Spans 2 columns on desktop) */}
            <div className="md:col-span-2 p-6 sm:p-8 rounded-xl bg-[#16181D] border border-white/[0.08] flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs font-semibold text-amber-500 tabular-nums">
                    01. Managed by Fit Mantras
                  </span>
                  <span className="text-xs text-neutral-400">
                    {settings.marathiName} · {settings.marathiManagedBy}
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Practical Strength, Free Weights & Goal-Oriented Workouts
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-[65ch]">
                  We focus on what delivers real physical progress: dedicated free weights,
                  resistance machines, cardiovascular conditioning, and a supportive floor culture
                  where beginners and experienced lifters train side by side.
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-400">
                <span>Strength Training & Free Weights</span>
                <span aria-hidden="true">·</span>
                <span>Resistance Machines & Cardio</span>
                <span aria-hidden="true">·</span>
                <span>Accessible Neighborhood Memberships</span>
              </div>
            </div>

            {/* Pillar 2 (1 column) */}
            <div className="p-6 sm:p-8 rounded-xl bg-[#16181D] border border-white/[0.08] flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="font-mono text-xs font-semibold text-amber-500 tabular-nums">
                  02. Bandra East Location
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  Right inside Government Colony
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Conveniently situated at Mahatma Gandhi Vidyamandir on JL Shirshekar Marg, making
                  daily pre-work or post-work workouts effortless for Bandra East residents.
                </p>
              </div>
              <div className="space-y-2 pt-4 border-t border-white/[0.06] text-xs text-neutral-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>JL Shirshekar Marg, Government Colony, Bandra East, Mumbai 400051</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Listed Hours: Open until 10:30 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          FACILITIES SECTION (#facilities) — Editable via Admin Dashboard
      =================================================================== */}
      <section
        id="facilities"
        className="py-16 md:py-24 border-b border-white/[0.08] bg-[#0F1012]"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold tracking-wider text-amber-500 uppercase">
                Training Floor & Zones
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F5F5F0] tracking-tight">
                FACILITIES BUILT FOR CONSISTENT PROGRESS
              </h2>
              <p className="text-sm sm:text-base text-neutral-400">
                Everything you need for daily strength, conditioning, and guided fitness under one
                roof in Bandra East.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onBookTrialClick('General Fitness')}
              className="self-start md:self-auto px-5 py-2.5 rounded-lg bg-[#16181D] hover:bg-neutral-800 text-xs font-semibold text-amber-400 border border-neutral-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              Inspect Floor with a Free Trial →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeFacilities.map((facility, idx) => (
              <div
                key={facility.id}
                className={`p-6 sm:p-7 rounded-xl bg-[#16181D] border border-white/[0.08] hover:border-amber-500/40 transition-colors flex flex-col justify-between gap-5 ${
                  idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-neutral-500 tabular-nums">
                      0{idx + 1}. {facility.highlight}
                    </span>
                    {renderFacilityIcon(facility.iconName)}
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                    {facility.title}
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">{facility.description}</p>
                </div>
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
                  <span>Bandra East Facility</span>
                  <button
                    type="button"
                    onClick={() => onBookTrialClick(facility.title)}
                    className="font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    Book Trial →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
