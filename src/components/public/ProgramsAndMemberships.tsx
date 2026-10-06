import React from 'react';
import { Check, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ResilientImage } from '../ResilientImage';
import { getMembershipWhatsAppUrl } from '../../utils/contactLinks';

interface ProgramsAndMembershipsProps {
  onSelectGoalAndScroll: (goal: string, customMessage?: string) => void;
}

export const ProgramsAndMemberships: React.FC<ProgramsAndMembershipsProps> = ({
  onSelectGoalAndScroll,
}) => {
  const { state } = useApp();
  const { programs, memberships, settings } = state;

  const activePrograms = [...programs]
    .filter((p) => p.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const activeMemberships = [...memberships]
    .filter((m) => m.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      {/* ===================================================================
          TRAINING PROGRAMS SECTION (#training)
      =================================================================== */}
      <section id="training" className="py-16 md:py-24 border-b border-white/[0.08] bg-[#0A0A0B]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold tracking-wider text-amber-500 uppercase">
                Goal-Oriented Workouts <span aria-hidden="true">·</span> {settings.managedBy}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F5F5F0] tracking-tight">
                TRAINING PROGRAMS FOR EVERY FITNESS LEVEL
              </h2>
              <p className="text-sm sm:text-base text-neutral-400">
                Whether you are stepping into a gym for the first time or pushing progressive
                strength numbers, choose a training focus tailored to your goal.
              </p>
            </div>
            <a
              href="#free-trial"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline-offset-4 hover:underline whitespace-nowrap"
            >
              Not sure where to start? Book a free trial orientation →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePrograms.map((prog, index) => (
              <article
                key={prog.id}
                className="rounded-xl bg-[#16181D] border border-white/[0.08] overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition-colors"
              >
                <div>
                  {/* 4:3 Program Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900 border-b border-white/[0.06]">
                    <ResilientImage
                      src={prog.imageUrl}
                      alt={`${prog.title} at Shirsekar's Fitness Hub Bandra East`}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16181D] via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-neutral-300">
                      <span className="font-mono font-semibold text-amber-400 tabular-nums">
                        0{index + 1}. {prog.difficulty}
                      </span>
                      <span className="text-neutral-300">{prog.duration}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-display text-xl font-bold text-white">{prog.title}</h3>
                    <p className="text-sm text-neutral-300 leading-relaxed">{prog.description}</p>
                    <div className="pt-2 space-y-1 text-xs text-neutral-400">
                      <p>
                        <strong className="text-neutral-200 font-semibold">Who it&apos;s for:</strong>{' '}
                        {prog.whoItsFor}
                      </p>
                      <p>
                        <strong className="text-neutral-200 font-semibold">Guidance:</strong>{' '}
                        {prog.trainer}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectGoalAndScroll(
                        prog.title,
                        `Hi, I want to get started with the ${prog.title} program at Shirsekar's Fitness Hub.`
                      )
                    }
                    className="w-full py-2.5 px-4 rounded-lg bg-neutral-900 hover:bg-amber-500 text-neutral-100 hover:text-neutral-950 border border-neutral-700 hover:border-amber-500 font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>GET STARTED</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          MEMBERSHIP SECTION (#membership)
      =================================================================== */}
      <section
        id="membership"
        className="py-16 md:py-24 border-b border-white/[0.08] bg-[#0F1012]"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold tracking-wider text-amber-500 uppercase">
                Transparent & Accessible Options <span aria-hidden="true">·</span> Bandra East
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F5F5F0] tracking-tight">
                MEMBERSHIP PLANS TAILORED TO YOUR FITNESS GOALS
              </h2>
              <p className="text-sm sm:text-base text-neutral-300">
                Choose from flexible Basic, Standard, or Premium tiers. Contact us or visit the desk
                for current seasonal offers, student rates, and multi-month packages.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onSelectGoalAndScroll(
                    'General Fitness',
                    'Please share current membership tariff details and ongoing seasonal offers.'
                  )
                }
                className="px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs tracking-wide transition-colors cursor-pointer whitespace-nowrap"
              >
                GET MEMBERSHIP DETAILS
              </button>
            </div>
          </div>

          {/* Membership Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {activeMemberships.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-colors ${
                  plan.isFeatured
                    ? 'bg-[#16181D] border-2 border-amber-500 shadow-2xl'
                    : 'bg-[#16181D] border border-white/[0.08]'
                }`}
              >
                <div className="space-y-6">
                  {/* Top Header & Unboxed Status */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono uppercase tracking-wider text-amber-400 font-semibold">
                        {plan.isFeatured ? '★ Recommended Tier' : 'Flexible Tier'}
                      </span>
                      {plan.discount && (
                        <span className="text-emerald-400 font-medium">{plan.discount}</span>
                      )}
                    </div>
                    <h3 className="font-display text-2xl font-extrabold text-white tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      {plan.subtitle}
                    </p>
                  </div>

                  {/* Price & Duration Block */}
                  <div className="py-4 border-y border-white/[0.08] space-y-1">
                    <div className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums">
                      {plan.price}
                    </div>
                    <p className="text-xs text-neutral-400">{plan.duration}</p>
                    {plan.offer && (
                      <p className="text-xs text-amber-400 font-medium pt-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>{plan.offer}</span>
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-200">
                        <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="pt-8 space-y-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectGoalAndScroll(
                        plan.name + ' Membership',
                        `Enquiring about the ${plan.name} Membership Plan (${plan.duration}).`
                      )
                    }
                    className={`w-full py-3 px-4 rounded-lg font-bold text-xs tracking-wide transition-colors cursor-pointer whitespace-nowrap ${
                      plan.isFeatured
                        ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                    }`}
                  >
                    {plan.ctaText || 'ENQUIRE NOW'}
                  </button>

                  <a
                    href={getMembershipWhatsAppUrl(settings.whatsapp, plan.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-lg bg-transparent hover:bg-neutral-900 text-neutral-300 hover:text-emerald-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>WhatsApp for {plan.name} Rates</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
