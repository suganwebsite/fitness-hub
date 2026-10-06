import React, { useState } from 'react';
import { ExternalLink, Star, Expand, X, CheckCircle2, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ResilientImage } from '../ResilientImage';
import { GalleryCategory, GalleryItem } from '../../types/fitness';

const GALLERY_CATEGORIES: Array<'All' | GalleryCategory> = [
  'All',
  'Gym',
  'Equipment',
  'Training',
  'Community',
  'Exterior',
  'Videos',
];

export const GalleryAndReviews: React.FC = () => {
  const { state } = useApp();
  const { gallery, testimonials, settings } = state;

  const [selectedCategory, setSelectedCategory] = useState<'All' | GalleryCategory>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const sortedGallery = [...gallery].sort((a, b) => a.sortOrder - b.sortOrder);
  const filteredGallery =
    selectedCategory === 'All'
      ? sortedGallery
      : sortedGallery.filter((item) => item.category === selectedCategory);

  const publishedReviews = testimonials.filter((t) => t.isPublished);
  const hasRepresentativeImages = gallery.some((g) => g.isRepresentative);

  return (
    <>
      {/* ===================================================================
          GALLERY SECTION (#gallery)
      =================================================================== */}
      <section
        id="gallery"
        className="py-16 md:py-24 border-b border-white/[0.08] bg-[#0F1012]"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold tracking-wider text-amber-500 uppercase">
                Training Environment <span aria-hidden="true">·</span> Visual Showcase
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F5F5F0] tracking-tight">
                INSIDE THE TRAINING FLOOR
              </h2>
              <p className="text-sm sm:text-base text-neutral-400">
                Explore our workout zones across strength, free weights, cardio conditioning, and
                community sessions.
              </p>
            </div>

            {/* Interactive Category Filter Bar (Functional Buttons) */}
            <div
              role="tablist"
              aria-label="Gallery Categories"
              className="flex flex-wrap items-center gap-1 p-1 bg-[#0A0A0B] rounded-lg border border-neutral-800 self-start"
            >
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-neutral-950'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {hasRepresentativeImages && (
            <div className="p-3.5 rounded-lg bg-[#16181D] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-400">
              <span>
                <strong className="text-neutral-200 font-semibold">Transparency Note:</strong> Items
                marked <em>Representative Visual</em> are concept placeholders until the gym
                administrator uploads actual floor photographs in the Admin Gallery Manager.
              </span>
              <span className="font-mono text-amber-400 shrink-0">Editable in /admin</span>
            </div>
          )}

          {filteredGallery.length === 0 ? (
            <div className="p-12 rounded-xl bg-[#16181D] border border-white/[0.08] text-center space-y-3">
              <p className="text-sm font-semibold text-white">
                No media uploaded in the &ldquo;{selectedCategory}&rdquo; category yet.
              </p>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Switch back to &ldquo;All&rdquo; or upload new photos/videos in the Admin Gallery
                Manager.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold cursor-pointer"
              >
                Show All Media
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-xl bg-[#16181D] border border-white/[0.08] overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden">
                    <ResilientImage
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/90 via-transparent to-transparent" />
                    <button
                      type="button"
                      onClick={() => setLightboxItem(item)}
                      aria-label={`Inspect ${item.title} full screen`}
                      className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-black/70 hover:bg-amber-500 text-white hover:text-neutral-950 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Expand className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-neutral-300">
                      <span className="font-semibold text-amber-400">{item.category}</span>
                      {item.isRepresentative && (
                        <span className="text-neutral-400">Representative Visual</span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-1.5">
                    <h3 className="font-display text-base font-bold text-white">{item.title}</h3>
                    {item.caption && (
                      <p className="text-xs text-neutral-400 leading-relaxed">{item.caption}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl w-full rounded-xl bg-[#16181D] border border-neutral-800 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800">
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  {lightboxItem.title}
                </h3>
                <p className="text-xs text-neutral-400">
                  {lightboxItem.category}
                  {lightboxItem.isRepresentative ? ' · Representative Visual' : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                aria-label="Close image preview"
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-[16/10] bg-black">
              <ResilientImage
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                className="w-full h-full object-contain"
              />
            </div>
            {lightboxItem.caption && (
              <div className="p-4 text-xs sm:text-sm text-neutral-300 border-t border-neutral-800">
                {lightboxItem.caption}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================
          GOOGLE REVIEWS & TRUST SECTION (#reviews)
          "WHAT OUR MEMBERS SAY" & "REAL PEOPLE. REAL EXPERIENCES."
      =================================================================== */}
      <section id="reviews" className="py-16 md:py-24 border-b border-white/[0.08] bg-[#0A0A0B]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Top Header & Dedicated Trust Banner */}
          <div className="p-6 sm:p-10 rounded-xl bg-[#16181D] border border-white/[0.08] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <p className="text-xs font-semibold tracking-wider text-amber-500 uppercase">
                What Our Members Say <span aria-hidden="true">·</span> Unfiltered Transparency
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F5F5F0] tracking-tight">
                REAL PEOPLE. REAL EXPERIENCES.
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-[62ch]">
                We believe trust is built on honesty, not fabricated five-star quotes. On Google
                Maps, Shirsekar&apos;s Fitness Hub holds a{' '}
                <strong className="text-white font-mono tabular-nums">
                  {settings.googleRating} / 5 rating across {settings.googleReviewsCount} reviews
                </strong>
                . Read what local members appreciate and how Fit Mantras works on member feedback.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-xl bg-[#0A0A0B] border border-neutral-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-4xl font-extrabold text-white tabular-nums">
                    {settings.googleRating}
                  </span>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 text-neutral-600" />
                    </div>
                    <p className="text-xs text-neutral-400 font-mono tabular-nums">
                      {settings.googleReviewsCount} Google Reviews
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={settings.googleReviewsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
              >
                <span>VIEW GOOGLE REVIEWS</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </div>

          {/* Transparent Breakdown: Positive Themes vs Active Improvement Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-7 rounded-xl bg-[#16181D] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Positive Review Highlights
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                What Members Appreciate Most
              </h3>
              <ul className="space-y-2.5 text-sm text-neutral-300">
                <li>
                  <strong className="text-white">Motivating Atmosphere:</strong> Energetic
                  neighborhood crowd focused on serious daily workouts.
                </li>
                <li>
                  <strong className="text-white">Helpful Staff & Trainers:</strong> Approachable
                  floor guidance for form checks and workout routines.
                </li>
                <li>
                  <strong className="text-white">Practical Equipment:</strong> Functional selection
                  of free weights, benches, and resistance machines.
                </li>
                <li>
                  <strong className="text-white">Affordable Pricing:</strong> Accessible membership
                  options in Bandra East without inflated health-club markups.
                </li>
              </ul>
            </div>

            <div className="p-6 sm:p-7 rounded-xl bg-[#16181D] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Constructive Feedback & Action
                </span>
                <Wrench className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                Fit Mantras Continuous Improvement Focus
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Some past reviews have noted concerns regarding{' '}
                <strong className="text-white">
                  equipment maintenance, floor hygiene, peak-hour AC cooling, washroom availability,
                  and desk management
                </strong>
                . Rather than hiding critical feedback, our management team actively tracks routine
                equipment servicing and floor upkeep—and invites you to visit for a free trial so
                you can evaluate the gym in person before joining.
              </p>
              <div className="pt-2">
                <a
                  href={settings.googleReviewsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4"
                >
                  <span>READ ALL GOOGLE REVIEWS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Published Review Theme Cards (Editable by Admin) */}
          {publishedReviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publishedReviews.map((item) => (
                <article
                  key={item.id}
                  className="p-6 rounded-xl bg-[#16181D] border border-white/[0.08] flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span className="font-mono text-amber-400 font-semibold tabular-nums">
                        {'★'.repeat(item.rating)}
                        {'☆'.repeat(Math.max(0, 5 - item.rating))} ({item.rating}/5)
                      </span>
                      <span>{item.sourceLabel}</span>
                    </div>
                    <p className="text-sm text-neutral-200 leading-relaxed">&ldquo;{item.review}&rdquo;</p>
                  </div>
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{item.name}</span>
                    <span className="text-neutral-500">{item.reviewDate}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
