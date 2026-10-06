import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Upload,
  Check,
  X,
  Star,
  RotateCcw,
  Save,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ResilientImage } from '../ResilientImage';
import {
  FacilityItem,
  FaqItem,
  GalleryCategory,
  GalleryItem,
  MembershipPlan,
  TestimonialItem,
  TrainingProgram,
} from '../../types/fitness';
import {
  HERO_IMAGE_PATH,
  STRENGTH_IMAGE_PATH,
  CARDIO_IMAGE_PATH,
  FUNCTIONAL_IMAGE_PATH,
  COACHING_IMAGE_PATH,
} from '../../data/seedData';

const PRESET_IMAGES = [
  { label: 'Strength Barbell Hero', url: HERO_IMAGE_PATH },
  { label: 'Free Weights & Dumbbells', url: STRENGTH_IMAGE_PATH },
  { label: 'Cardio Conditioning Zone', url: CARDIO_IMAGE_PATH },
  { label: 'Functional Training Floor', url: FUNCTIONAL_IMAGE_PATH },
  { label: 'Personal Coaching Session', url: COACHING_IMAGE_PATH },
];

// ============================================================================
// 1. MEMBERSHIP MANAGEMENT
// ============================================================================
export const AdminMembershipsManager: React.FC = () => {
  const { state, createMembership, updateMembership, deleteMembership } = useApp();
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formPrice, setFormPrice] = useState('Enquire for Rates');
  const [formDuration, setFormDuration] = useState('Monthly / Quarterly / Annual');
  const [formFeaturesText, setFormFeaturesText] = useState(
    'Full access to gym floor\nFlexible duration\nInitial orientation'
  );
  const [formDiscount, setFormDiscount] = useState('');
  const [formOffer, setFormOffer] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    await createMembership({
      name: formName.trim().toUpperCase(),
      subtitle: formSubtitle.trim(),
      price: formPrice.trim() || 'Enquire for Rates',
      duration: formDuration.trim(),
      features: formFeaturesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      discount: formDiscount.trim(),
      offer: formOffer.trim(),
      ctaText: 'ENQUIRE NOW',
      isFeatured: formFeatured,
      isActive: true,
      sortOrder: state.memberships.length + 1,
    });
    setIsCreating(false);
    setFormName('');
    setFormSubtitle('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#16181D] border border-white/[0.08]">
        <div>
          <h3 className="font-display text-base font-bold text-white">
            Membership Plans & Tariff Manager
          </h3>
          <p className="text-xs text-neutral-400">
            Configure plan names, exact INR prices (or keep &ldquo;Enquire for Rates&rdquo;),
            durations, discounts, and featured tiers
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {state.memberships.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-xl bg-[#16181D] border flex flex-col justify-between gap-5 ${
              plan.isFeatured ? 'border-amber-500' : 'border-white/[0.08]'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-amber-400 font-semibold">
                  {plan.isFeatured ? '★ Featured Plan' : 'Standard Plan'} ·{' '}
                  {plan.isActive ? 'Active' : 'Hidden'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateMembership(plan.id, { isActive: !plan.isActive })}
                    className="px-2 py-1 rounded bg-[#0A0A0B] border border-neutral-800 text-[11px] text-neutral-300 hover:text-white cursor-pointer"
                  >
                    {plan.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMembership(plan.id, { isFeatured: !plan.isFeatured })}
                    className="px-2 py-1 rounded bg-[#0A0A0B] border border-neutral-800 text-[11px] text-amber-400 cursor-pointer"
                  >
                    {plan.isFeatured ? 'Unfeature' : 'Mark Featured'}
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-display text-xl font-extrabold text-white">{plan.name}</h4>
                <p className="text-xs text-neutral-400 mt-0.5">{plan.subtitle}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0A0A0B] border border-neutral-800 space-y-1">
                <div className="font-mono text-lg font-bold text-white tabular-nums">
                  {plan.price}
                </div>
                <div className="text-xs text-neutral-400">{plan.duration}</div>
                {plan.discount && (
                  <div className="text-xs text-emerald-400">Discount: {plan.discount}</div>
                )}
                {plan.offer && <div className="text-xs text-amber-400">Offer: {plan.offer}</div>}
              </div>

              <ul className="space-y-1.5 text-xs text-neutral-300">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setEditingPlan(plan)}
                className="flex-1 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Plan & Price</span>
              </button>
              <button
                type="button"
                onClick={() => deleteMembership(plan.id)}
                aria-label={`Delete ${plan.name} plan`}
                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Membership Modal */}
      {editingPlan && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Edit ${editingPlan.name}`}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-lg w-full rounded-xl bg-[#16181D] border border-neutral-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-display text-lg font-bold text-white">
                Edit Plan: {editingPlan.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                aria-label="Close modal"
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Plan Name</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">
                  Price (e.g. ₹1,500 / mo or Enquire for Rates)
                </label>
                <input
                  type="text"
                  value={editingPlan.price}
                  onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Duration</label>
                <input
                  type="text"
                  value={editingPlan.duration}
                  onChange={(e) => setEditingPlan({ ...editingPlan, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Discount Tag</label>
                <input
                  type="text"
                  value={editingPlan.discount}
                  onChange={(e) => setEditingPlan({ ...editingPlan, discount: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingPlan.subtitle}
                  onChange={(e) => setEditingPlan({ ...editingPlan, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Promotional Offer Text</label>
                <input
                  type="text"
                  value={editingPlan.offer}
                  onChange={(e) => setEditingPlan({ ...editingPlan, offer: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Features (One per line)</label>
                <textarea
                  rows={4}
                  value={editingPlan.features.join('\n')}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      features: e.target.value.split('\n').filter((line) => line.trim() !== ''),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await updateMembership(editingPlan.id, editingPlan);
                  setEditingPlan(null);
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold cursor-pointer"
              >
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Membership Modal */}
      {isCreating && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Create Membership Plan"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <form
            onSubmit={handleCreate}
            className="max-w-lg w-full rounded-xl bg-[#16181D] border border-neutral-800 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-display text-lg font-bold text-white">Create Membership Plan</h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                aria-label="Close modal"
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ANNUAL PRO"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Price</label>
                <input
                  type="text"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Duration</label>
                <input
                  type="text"
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Discount / Offer</label>
                <input
                  type="text"
                  value={formOffer}
                  onChange={(e) => setFormOffer(e.target.value)}
                  placeholder="e.g. Includes 2 PT sessions"
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Short Subtitle</label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Who this membership plan is designed for"
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Features (One per line)</label>
                <textarea
                  rows={3}
                  value={formFeaturesText}
                  onChange={(e) => setFormFeaturesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                />
                <span>Mark as Featured Plan on Website</span>
              </label>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold cursor-pointer"
              >
                Publish Plan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. TRAINING PROGRAM MANAGEMENT
// ============================================================================
export const AdminProgramsManager: React.FC = () => {
  const { state, createProgram, updateProgram, deleteProgram } = useApp();
  const [editingProg, setEditingProg] = useState<TrainingProgram | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [whoItsFor, setWhoItsFor] = useState('');
  const [trainer, setTrainer] = useState('Fit Mantras Floor Coaches');
  const [duration, setDuration] = useState('Ongoing');
  const [difficulty, setDifficulty] = useState('All Levels');
  const [imageUrl, setImageUrl] = useState(STRENGTH_IMAGE_PATH);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createProgram({
      title: title.trim(),
      description: description.trim(),
      whoItsFor: whoItsFor.trim() || 'All Fitness Levels',
      imageUrl,
      trainer: trainer.trim(),
      duration: duration.trim(),
      difficulty: difficulty.trim(),
      isActive: true,
      sortOrder: state.programs.length + 1,
    });
    setIsCreating(false);
    setTitle('');
    setDescription('');
    setWhoItsFor('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#16181D] border border-white/[0.08]">
        <div>
          <h3 className="font-display text-base font-bold text-white">
            Training Programs Manager
          </h3>
          <p className="text-xs text-neutral-400">
            Manage workout programs, descriptions, target audiences, trainers, and difficulty levels
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Program</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.programs.map((prog) => (
          <div
            key={prog.id}
            className="rounded-xl bg-[#16181D] border border-white/[0.08] overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] bg-neutral-900">
                <ResilientImage
                  src={prog.imageUrl}
                  alt={prog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <button
                    type="button"
                    onClick={() => updateProgram(prog.id, { isActive: !prog.isActive })}
                    className="px-2.5 py-1 rounded bg-black/80 text-xs font-semibold text-amber-400 border border-white/15 cursor-pointer"
                  >
                    {prog.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <div className="text-xs text-amber-400 font-mono">
                  {prog.difficulty} · {prog.duration}
                </div>
                <h4 className="font-display text-lg font-bold text-white">{prog.title}</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">{prog.description}</p>
                <p className="text-xs text-neutral-400 pt-1">
                  <strong className="text-neutral-200">For:</strong> {prog.whoItsFor}
                </p>
                <p className="text-xs text-neutral-400">
                  <strong className="text-neutral-200">Coach:</strong> {prog.trainer}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setEditingProg(prog)}
                className="flex-1 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Program</span>
              </button>
              <button
                type="button"
                onClick={() => deleteProgram(prog.id)}
                aria-label={`Delete ${prog.title}`}
                className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Program Modal */}
      {editingProg && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Edit ${editingProg.title}`}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-lg w-full rounded-xl bg-[#16181D] border border-neutral-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-display text-lg font-bold text-white">
                Edit Program: {editingProg.title}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProg(null)}
                aria-label="Close modal"
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Program Title</label>
                <input
                  type="text"
                  value={editingProg.title}
                  onChange={(e) => setEditingProg({ ...editingProg, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Trainer / Guidance</label>
                <input
                  type="text"
                  value={editingProg.trainer}
                  onChange={(e) => setEditingProg({ ...editingProg, trainer: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Duration</label>
                <input
                  type="text"
                  value={editingProg.duration}
                  onChange={(e) => setEditingProg({ ...editingProg, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Difficulty</label>
                <input
                  type="text"
                  value={editingProg.difficulty}
                  onChange={(e) => setEditingProg({ ...editingProg, difficulty: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Who It&apos;s For</label>
                <input
                  type="text"
                  value={editingProg.whoItsFor}
                  onChange={(e) => setEditingProg({ ...editingProg, whoItsFor: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProg.description}
                  onChange={(e) => setEditingProg({ ...editingProg, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProg(null)}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await updateProgram(editingProg.id, editingProg);
                  setEditingProg(null);
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold cursor-pointer"
              >
                Save Program
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Program Modal */}
      {isCreating && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Add Training Program"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <form
            onSubmit={handleCreate}
            className="max-w-lg w-full rounded-xl bg-[#16181D] border border-neutral-800 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-display text-lg font-bold text-white">Add Training Program</h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                aria-label="Close modal"
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Program Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Preset Visual</label>
                <select
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                >
                  {PRESET_IMAGES.map((img) => (
                    <option key={img.url} value={img.url}>
                      {img.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Trainer</label>
                <input
                  type="text"
                  value={trainer}
                  onChange={(e) => setTrainer(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Difficulty</label>
                <input
                  type="text"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Who It&apos;s For</label>
                <input
                  type="text"
                  value={whoItsFor}
                  onChange={(e) => setWhoItsFor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold cursor-pointer"
              >
                Add Program
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 3. GALLERY MANAGEMENT (Upload, Delete, Reorder, Category, Caption, Featured)
// ============================================================================
export const AdminGalleryManager: React.FC = () => {
  const { state, createGalleryItem, updateGalleryItem, deleteGalleryItem } = useApp();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('Gym');
  const [imageUrl, setImageUrl] = useState(HERO_IMAGE_PATH);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isRepresentative, setIsRepresentative] = useState(false);

  const sortedGallery = [...state.gallery].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createGalleryItem({
      title: title.trim(),
      caption: caption.trim(),
      category,
      imageUrl,
      isFeatured,
      isRepresentative,
      sortOrder: state.gallery.length + 1,
    });
    setTitle('');
    setCaption('');
  };

  const moveOrder = async (item: GalleryItem, direction: 'up' | 'down') => {
    const newOrder = direction === 'up' ? Math.max(1, item.sortOrder - 1) : item.sortOrder + 1;
    await updateGalleryItem(item.id, { sortOrder: newOrder });
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <form
        onSubmit={handleAddMedia}
        className="p-6 rounded-xl bg-[#16181D] border border-white/[0.08] space-y-4"
      >
        <div>
          <h3 className="font-display text-base font-bold text-white">
            Upload Gym Photo or Add Media Item
          </h3>
          <p className="text-xs text-neutral-400">
            Upload real photos of Shirsekar&apos;s Fitness Hub (Bandra East) from your device or
            choose an image URL
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-neutral-300 mb-1">Photo Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Squat Rack & Olympic Area"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GalleryCategory)}
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
            >
              <option value="Gym">Gym</option>
              <option value="Equipment">Equipment</option>
              <option value="Training">Training</option>
              <option value="Community">Community</option>
              <option value="Exterior">Exterior</option>
              <option value="Videos">Videos</option>
            </select>
          </div>
          <div>
            <label className="block text-neutral-300 mb-1">Upload Image File (Local Device)</label>
            <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#0A0A0B] hover:bg-neutral-900 border border-dashed border-neutral-700 text-amber-400 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Image File...</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-neutral-300 mb-1">Caption</label>
            <input
              type="text"
              placeholder="Describe the training zone or equipment shown..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-300 mb-1">Or Select Preset / Enter URL</label>
            <select
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
            >
              {PRESET_IMAGES.map((img) => (
                <option key={img.url} value={img.url}>
                  {img.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-6 text-xs text-neutral-300">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              <span>Mark as Featured</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRepresentative}
                onChange={(e) => setIsRepresentative(e.target.checked)}
              />
              <span>Label as Representative Concept Visual</span>
            </label>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer"
          >
            Publish to Gallery
          </button>
        </div>
      </form>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedGallery.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-[#16181D] border border-white/[0.08] overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] bg-neutral-900">
                <ResilientImage
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-black/80 text-amber-400 font-semibold">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/80 text-neutral-300 font-mono">
                    Order #{item.sortOrder}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-display text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-neutral-400">{item.caption}</p>
              </div>
            </div>

            <div className="p-3 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveOrder(item, 'up')}
                  aria-label={`Move ${item.title} up`}
                  className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveOrder(item, 'down')}
                  aria-label={`Move ${item.title} down`}
                  className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateGalleryItem(item.id, { isRepresentative: !item.isRepresentative })
                  }
                  className="px-2 py-1 rounded bg-neutral-800 text-[11px] text-neutral-300 cursor-pointer"
                >
                  {item.isRepresentative ? 'Real Gym Photo' : 'Mark Concept'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => deleteGalleryItem(item.id)}
                aria-label={`Delete ${item.title}`}
                className="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 4. TESTIMONIAL / REVIEW MANAGEMENT
// ============================================================================
export const AdminTestimonialsManager: React.FC = () => {
  const { state, createTestimonial, updateTestimonial, deleteTestimonial } = useApp();
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewDate, setReviewDate] = useState('Verified Google Review');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !review.trim()) return;
    await createTestimonial({
      name: name.trim(),
      review: review.trim(),
      rating,
      photoUrl: '',
      reviewDate: reviewDate.trim(),
      sourceLabel: 'Authentic Member Review',
      isPublished: true,
    });
    setName('');
    setReview('');
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleAdd}
        className="p-6 rounded-xl bg-[#16181D] border border-white/[0.08] space-y-4"
      >
        <div>
          <h3 className="font-display text-base font-bold text-white">
            Add Authentic Member Review / Google Review Entry
          </h3>
          <p className="text-xs text-neutral-400">
            Only add genuine member reviews or verified Google Maps feedback. Do not fabricate
            testimonials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-neutral-300 mb-1">Member Name / Theme *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Verified Google Reviewer"
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-300 mb-1">Star Rating (1–5)</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white font-mono"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Stars
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-neutral-300 mb-1">Date / Context</label>
            <input
              type="text"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
            />
          </div>
        </div>

        <div className="text-xs">
          <label className="block text-neutral-300 mb-1">Authentic Review Text *</label>
          <textarea
            rows={2}
            required
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Paste authentic review text..."
            className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer"
          >
            Add Authentic Review
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {state.testimonials.map((item: TestimonialItem) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-[#16181D] border border-white/[0.08] flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-mono font-bold">
                  <Star className="w-3.5 h-3.5 inline fill-amber-400 mr-1" />
                  {item.rating} / 5
                </span>
                <button
                  type="button"
                  onClick={() => updateTestimonial(item.id, { isPublished: !item.isPublished })}
                  className="px-2 py-0.5 rounded bg-[#0A0A0B] border border-neutral-800 text-[11px] text-neutral-300 cursor-pointer"
                >
                  {item.isPublished ? 'Published' : 'Unpublished'}
                </button>
              </div>
              <h4 className="font-display text-sm font-bold text-white">{item.name}</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">&ldquo;{item.review}&rdquo;</p>
            </div>
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-500">
              <span>{item.reviewDate}</span>
              <button
                type="button"
                onClick={() => deleteTestimonial(item.id)}
                aria-label={`Delete review ${item.name}`}
                className="text-rose-400 hover:text-rose-300 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 5. FAQ MANAGEMENT (Create, Edit, Delete, Reorder, Publish/Unpublish)
// ============================================================================
export const AdminFaqsManager: React.FC = () => {
  const { state, createFaq, updateFaq, deleteFaq } = useApp();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  const sortedFaqs = [...state.faqs].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    await createFaq({
      question: question.trim(),
      answer: answer.trim(),
      category: 'General',
      sortOrder: state.faqs.length + 1,
      isPublished: true,
    });
    setQuestion('');
    setAnswer('');
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleAddFaq}
        className="p-6 rounded-xl bg-[#16181D] border border-white/[0.08] space-y-4"
      >
        <h3 className="font-display text-base font-bold text-white">Add New FAQ Item</h3>
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-neutral-300 mb-1">Question *</label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Do you have locker rooms?"
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-300 mb-1">Answer *</label>
            <textarea
              rows={2}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Provide a clear, accurate answer..."
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer"
          >
            Publish FAQ
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {sortedFaqs.map((faq) => (
          <div
            key={faq.id}
            className="p-5 rounded-xl bg-[#16181D] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-amber-400 font-bold">#{faq.sortOrder}</span>
                <span className="font-display text-sm font-bold text-white">{faq.question}</span>
                <span className="text-neutral-500">
                  ({faq.isPublished ? 'Published' : 'Draft'})
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">{faq.answer}</p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => updateFaq(faq.id, { sortOrder: Math.max(1, faq.sortOrder - 1) })}
                aria-label={`Move FAQ ${faq.question} up`}
                className="p-1.5 rounded bg-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => updateFaq(faq.id, { sortOrder: faq.sortOrder + 1 })}
                aria-label={`Move FAQ ${faq.question} down`}
                className="p-1.5 rounded bg-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => updateFaq(faq.id, { isPublished: !faq.isPublished })}
                className="px-2.5 py-1.5 rounded bg-neutral-800 text-xs text-neutral-200 cursor-pointer"
              >
                {faq.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button
                type="button"
                onClick={() => setEditingFaq(faq)}
                aria-label={`Edit FAQ ${faq.question}`}
                className="p-1.5 rounded bg-neutral-800 text-amber-400 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => deleteFaq(faq.id)}
                aria-label={`Delete FAQ ${faq.question}`}
                className="p-1.5 rounded bg-rose-500/10 text-rose-400 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingFaq && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Edit FAQ"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-lg w-full rounded-xl bg-[#16181D] border border-neutral-800 p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-white">Edit FAQ</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Question</label>
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Answer</label>
                <textarea
                  rows={4}
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingFaq(null)}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await updateFaq(editingFaq.id, editingFaq);
                  setEditingFaq(null);
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold cursor-pointer"
              >
                Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 6. BUSINESS SETTINGS, HOMEPAGE CMS, FACILITIES, SEO & ADMIN PROFILE
// ============================================================================
export const AdminSettingsManager: React.FC = () => {
  const {
    state,
    updateSettings,
    updateAdminProfile,
    changeAdminPassword,
    resetToDefaults,
  } = useApp();

  const [form, setForm] = useState(state.settings);
  const [profileForm, setProfileForm] = useState(state.adminProfile);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(form);
  };

  const handleFacilityChange = (idx: number, updates: Partial<FacilityItem>) => {
    const nextFacilities = form.facilities.map((fac, i) =>
      i === idx ? { ...fac, ...updates } : fac
    );
    setForm({ ...form, facilities: nextFacilities });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAdminProfile(profileForm);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await changeAdminPassword(currentPass, newPass);
    if (ok) {
      setCurrentPass('');
      setNewPass('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Business Settings & Homepage Content Form */}
      <form
        onSubmit={handleSaveSettings}
        className="p-6 rounded-xl bg-[#16181D] border border-white/[0.08] space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Business Settings & Homepage Content Management (CMS)
            </h3>
            <p className="text-xs text-neutral-400">
              Edit business contact information, WhatsApp integration, hero copy, facilities, and
              SEO metadata without touching code
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer self-start"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>

        {/* Section A: Business Identity & Contact */}
        <div className="space-y-4">
          <h4 className="font-display text-sm font-bold text-amber-400 uppercase tracking-wider">
            1. Business Identity & Contact Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-neutral-300 mb-1">Business Name</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1">Management Subtitle</label>
              <input
                type="text"
                value={form.managedBy}
                onChange={(e) => setForm({ ...form, managedBy: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1">Marathi Name</label>
              <input
                type="text"
                value={form.marathiName}
                onChange={(e) => setForm({ ...form, marathiName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1">
                WhatsApp Number (with country code)
              </label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-neutral-300 mb-1">Full Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1">Opening Hours</label>
              <input
                type="text"
                value={form.openingHours}
                onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
          </div>
        </div>

        {/* Section B: Homepage Hero & About CMS */}
        <div className="space-y-4 pt-4 border-t border-white/[0.08]">
          <h4 className="font-display text-sm font-bold text-amber-400 uppercase tracking-wider">
            2. Homepage Hero & About Content
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-neutral-300 mb-1">Hero Heading</label>
              <input
                type="text"
                value={form.heroHeading}
                onChange={(e) => setForm({ ...form, heroHeading: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1">Primary CTA Button Text</label>
              <input
                type="text"
                value={form.heroCtaPrimary}
                onChange={(e) => setForm({ ...form, heroCtaPrimary: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-neutral-300 mb-1">Hero Supporting Description</label>
              <textarea
                rows={2}
                value={form.heroDescription}
                onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1">About Section Heading</label>
              <input
                type="text"
                value={form.aboutHeading}
                onChange={(e) => setForm({ ...form, aboutHeading: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1">Hero Visual</label>
              <select
                value={form.heroImage}
                onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              >
                {PRESET_IMAGES.map((img) => (
                  <option key={img.url} value={img.url}>
                    {img.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-neutral-300 mb-1">About Section Description</label>
              <textarea
                rows={3}
                value={form.aboutDescription}
                onChange={(e) => setForm({ ...form, aboutDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
          </div>
        </div>

        {/* Section C: Editable Facilities List */}
        <div className="space-y-4 pt-4 border-t border-white/[0.08]">
          <h4 className="font-display text-sm font-bold text-amber-400 uppercase tracking-wider">
            3. Editable Facilities Descriptions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.facilities.map((fac, idx) => (
              <div
                key={fac.id}
                className="p-4 rounded-lg bg-[#0A0A0B] border border-neutral-800 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={fac.title}
                    onChange={(e) => handleFacilityChange(idx, { title: e.target.value })}
                    className="font-bold text-white bg-transparent border-b border-neutral-700 focus:border-amber-500 focus:outline-none py-0.5"
                  />
                  <label className="inline-flex items-center gap-1.5 text-neutral-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fac.isActive}
                      onChange={(e) => handleFacilityChange(idx, { isActive: e.target.checked })}
                    />
                    <span>Visible</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={fac.highlight}
                  onChange={(e) => handleFacilityChange(idx, { highlight: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded bg-[#16181D] border border-neutral-800 text-amber-400"
                />
                <textarea
                  rows={2}
                  value={fac.description}
                  onChange={(e) => handleFacilityChange(idx, { description: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded bg-[#16181D] border border-neutral-800 text-neutral-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section D: Google Maps, Social Media, SEO & Analytics */}
        <div className="space-y-4 pt-4 border-t border-white/[0.08]">
          <h4 className="font-display text-sm font-bold text-amber-400 uppercase tracking-wider">
            4. Google Maps, Reviews, Social Media & SEO
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-neutral-300 mb-1">Google Maps Directions URL</label>
              <input
                type="url"
                value={form.googleMapsLink}
                onChange={(e) => setForm({ ...form, googleMapsLink: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1">Google Reviews URL</label>
              <input
                type="url"
                value={form.googleReviewsLink}
                onChange={(e) => setForm({ ...form, googleReviewsLink: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1">Website SEO Title</label>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1">
                Instagram URL (Leave blank to hide icon)
              </label>
              <input
                type="url"
                value={form.socialInstagram}
                onChange={(e) => setForm({ ...form, socialInstagram: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1">Google Analytics ID (GA4)</label>
              <input
                type="text"
                value={form.googleAnalyticsId}
                onChange={(e) => setForm({ ...form, googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1">Meta Pixel ID</label>
              <input
                type="text"
                value={form.metaPixelId}
                onChange={(e) => setForm({ ...form, metaPixelId: e.target.value })}
                placeholder="1234567890"
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-neutral-300 mb-1">Website SEO Meta Description</label>
              <textarea
                rows={2}
                value={form.seoDescription}
                onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={resetToDefaults}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Content to Defaults</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Business & Website Settings</span>
          </button>
        </div>
      </form>

      {/* Admin Profile & Password Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form
          onSubmit={handleSaveProfile}
          className="p-6 rounded-xl bg-[#16181D] border border-white/[0.08] space-y-4 text-xs"
        >
          <h3 className="font-display text-base font-bold text-white">
            Manage Administrator Profile
          </h3>
          <div>
            <label className="block text-neutral-400 mb-1">Admin Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-400 mb-1">Admin Email</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-400 mb-1">Role Title</label>
            <input
              type="text"
              value={profileForm.role}
              onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold cursor-pointer"
          >
            Update Profile
          </button>
        </form>

        <form
          onSubmit={handleChangePassword}
          className="p-6 rounded-xl bg-[#16181D] border border-white/[0.08] space-y-4 text-xs"
        >
          <h3 className="font-display text-base font-bold text-white">Change Admin Password</h3>
          <div>
            <label className="block text-neutral-400 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-400 mb-1">New Password (min 6 chars)</label>
            <input
              type="password"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};
