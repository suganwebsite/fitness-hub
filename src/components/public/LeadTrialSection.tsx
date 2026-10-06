import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  Send,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCleanPhoneDigits, getFreeTrialWhatsAppUrl } from '../../utils/contactLinks';

interface LeadTrialSectionProps {
  selectedGoal: string;
  prefilledNote: string;
}

export const LeadTrialSection: React.FC<LeadTrialSectionProps> = ({
  selectedGoal,
  prefilledNote,
}) => {
  const { state, createLead, createContactMessage, addToast } = useApp();
  const { settings } = state;

  const [activeTab, setActiveTab] = useState<'trial' | 'message'>('trial');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState(selectedGoal || 'General Fitness');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('Evening (6:00 PM – 9:00 PM)');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submittedDetails, setSubmittedDetails] = useState<{
    name: string;
    phone: string;
    goal: string;
    preferredDate: string;
    preferredTime: string;
    mode: 'trial' | 'message';
  } | null>(null);

  useEffect(() => {
    if (selectedGoal) {
      setGoal(selectedGoal);
    }
  }, [selectedGoal]);

  useEffect(() => {
    if (prefilledNote) {
      setMessage(prefilledNote);
    }
  }, [prefilledNote]);

  const validatePhone = (rawPhone: string) => {
    const digits = rawPhone.replace(/\D/g, '');
    return digits.length >= 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!validatePhone(phone)) {
      setFormError('Please enter a valid 10-digit Indian mobile or phone number.');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address or leave it blank.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (activeTab === 'trial') {
        await createLead({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          goal,
          preferredDate,
          preferredTime,
          message: message.trim(),
          source: 'Free Trial Form',
          createTrial: true,
        });
        addToast(
          'Free Trial Booked!',
          `We've registered your visit for ${preferredDate} (${preferredTime}).`
        );
      } else {
        await createContactMessage({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          subject: `Enquiry: ${goal}`,
          message: message.trim() || `Interested in ${goal}`,
        });
        await createLead({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          goal,
          preferredDate,
          preferredTime,
          message: message.trim(),
          source: 'Membership Enquiry',
          createTrial: false,
        });
        addToast('Enquiry Received!', 'Our Fit Mantras desk team will contact you shortly.');
      }

      setSubmittedDetails({
        name: name.trim(),
        phone: phone.trim(),
        goal,
        preferredDate,
        preferredTime,
        mode: activeTab,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedDetails(null);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  return (
    <section
      id="free-trial"
      className="py-16 md:py-24 border-b border-white/[0.08] bg-[#0A0A0B]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Value Proposition & What Happens on Your First Visit */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wider text-amber-500 uppercase">
                Start Today in Bandra East <span aria-hidden="true">·</span> No Obligation
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F5F0] tracking-tight">
                READY TO START?
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Your fitness journey starts with one visit. Book a complimentary trial session or
                enquire about membership plans at Shirsekar&apos;s Fitness Hub, managed by Fit
                Mantras.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#16181D] border border-white/[0.08] space-y-4">
              <h3 className="font-display text-base font-bold text-white">
                What to Expect on Your Trial Visit
              </h3>
              <ol className="space-y-3 text-xs sm:text-sm text-neutral-300">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-amber-500 font-bold tabular-nums">01.</span>
                  <span>
                    <strong className="text-white">Full Floor Walkthrough:</strong> Inspect our
                    strength, free weights, and cardio zones firsthand at Mahatma Gandhi
                    Vidyamandir.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-amber-500 font-bold tabular-nums">02.</span>
                  <span>
                    <strong className="text-white">Goal Discussion:</strong> Speak with a Fit
                    Mantras floor coach about your target routine (weight loss, muscle gain, or
                    general fitness).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-amber-500 font-bold tabular-nums">03.</span>
                  <span>
                    <strong className="text-white">Transparent Plan Options:</strong> Review
                    current monthly, quarterly, or annual rates with zero high-pressure sales.
                  </span>
                </li>
              </ol>
            </div>

            {/* Instant Contact Card */}
            <div className="p-5 rounded-xl bg-[#16181D]/60 border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-neutral-400">Prefer instant confirmation?</p>
                <p className="text-sm font-bold text-white font-mono tabular-nums mt-0.5">
                  Call / WhatsApp: {settings.phone}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${getCleanPhoneDigits(settings.phone)}`}
                  className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors whitespace-nowrap"
                >
                  Call Desk
                </a>
                <a
                  href={getFreeTrialWhatsAppUrl(settings.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: High-Converting Form or Confirmation State */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-xl bg-[#16181D] border border-white/[0.08] shadow-2xl">
              {submittedDetails ? (
                <div
                  data-testid="trial-confirmation-card"
                  className="py-6 space-y-6 text-center max-w-lg mx-auto"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      Request Logged in Fit Mantras CRM
                    </p>
                    <h3 className="font-display text-2xl font-extrabold text-white">
                      Thank You, {submittedDetails.name}!
                    </h3>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      Your{' '}
                      {submittedDetails.mode === 'trial'
                        ? 'free trial session request'
                        : 'membership enquiry'}{' '}
                      for <strong className="text-white">{submittedDetails.goal}</strong> has been
                      received. Our team at Shirsekar&apos;s Fitness Hub (Bandra East) will confirm
                      your slot shortly.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-left text-xs space-y-1.5 text-neutral-300">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Phone:</span>
                      <span className="font-mono text-white tabular-nums">
                        {submittedDetails.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Fitness Goal:</span>
                      <span className="text-amber-400 font-medium">{submittedDetails.goal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Preferred Visit:</span>
                      <span className="font-mono text-white tabular-nums">
                        {submittedDetails.preferredDate} · {submittedDetails.preferredTime}
                      </span>
                    </div>
                  </div>

                  {/* Immediate Follow-up Actions: WhatsApp & Call */}
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-neutral-400">
                      Want instant slot confirmation on WhatsApp or phone?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={getFreeTrialWhatsAppUrl(settings.whatsapp, {
                          name: submittedDetails.name,
                          goal: submittedDetails.goal,
                          preferredDate: submittedDetails.preferredDate,
                          preferredTime: submittedDetails.preferredTime,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                      >
                        <MessageSquare className="w-4 h-4 shrink-0" />
                        <span>CONFIRM VIA WHATSAPP</span>
                      </a>

                      <a
                        href={`tel:${getCleanPhoneDigits(settings.phone)}`}
                        className="py-3 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                      >
                        <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>CALL {settings.phone}</span>
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 cursor-pointer"
                  >
                    Submit another booking or enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Segmented Interactive Control: Free Trial vs Membership Enquiry */}
                  <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
                    <div
                      role="tablist"
                      aria-label="Enquiry Type"
                      className="flex items-center gap-1 p-1 bg-[#0A0A0B] rounded-lg border border-neutral-800"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'trial'}
                        onClick={() => setActiveTab('trial')}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          activeTab === 'trial'
                            ? 'bg-amber-500 text-neutral-950'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Book Free Trial
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'message'}
                        onClick={() => setActiveTab('message')}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          activeTab === 'message'
                            ? 'bg-amber-500 text-neutral-950'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Membership Enquiry
                      </button>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs text-amber-400 font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Fast Response</span>
                    </span>
                  </div>

                  {formError && (
                    <div
                      role="alert"
                      className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-medium"
                    >
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="lead-name"
                        className="block text-xs font-medium text-neutral-300 mb-1.5"
                      >
                        Full Name <span className="text-amber-500">*</span>
                      </label>
                      <input
                        id="lead-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Patil"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0A0B] border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm text-white placeholder:text-neutral-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lead-phone"
                        className="block text-xs font-medium text-neutral-300 mb-1.5"
                      >
                        Phone / WhatsApp Number <span className="text-amber-500">*</span>
                      </label>
                      <input
                        id="lead-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 98201 44120"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0A0B] border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm text-white font-mono tabular-nums placeholder:font-sans placeholder:text-neutral-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="lead-email"
                        className="block text-xs font-medium text-neutral-300 mb-1.5"
                      >
                        Email Address <span className="text-neutral-500">(Optional)</span>
                      </label>
                      <input
                        id="lead-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0A0B] border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm text-white placeholder:text-neutral-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lead-goal"
                        className="block text-xs font-medium text-neutral-300 mb-1.5"
                      >
                        Primary Fitness Goal
                      </label>
                      <select
                        id="lead-goal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0A0B] border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm text-white"
                      >
                        <option value="Strength Training">Strength Training</option>
                        <option value="Muscle Building">Muscle Building</option>
                        <option value="Weight Loss">Weight Loss</option>
                        <option value="General Fitness">General Fitness</option>
                        <option value="Beginner Training">Beginner Training</option>
                        <option value="Personal Training">Personal Training</option>
                        <option value="BASIC Membership">BASIC Membership Enquiry</option>
                        <option value="STANDARD Membership">STANDARD Membership Enquiry</option>
                        <option value="PREMIUM Membership">PREMIUM Membership Enquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="lead-date"
                        className="block text-xs font-medium text-neutral-300 mb-1.5"
                      >
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-500" />
                          <span>Preferred Visit Date</span>
                        </span>
                      </label>
                      <input
                        id="lead-date"
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0A0B] border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm text-white font-mono tabular-nums"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lead-time"
                        className="block text-xs font-medium text-neutral-300 mb-1.5"
                      >
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Preferred Time Slot</span>
                        </span>
                      </label>
                      <select
                        id="lead-time"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0A0B] border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm text-white"
                      >
                        <option value="Morning (6:30 AM – 10:00 AM)">
                          Morning (6:30 AM – 10:00 AM)
                        </option>
                        <option value="Midday (10:00 AM – 4:00 PM)">
                          Midday (10:00 AM – 4:00 PM)
                        </option>
                        <option value="Evening (5:00 PM – 8:00 PM)">
                          Evening (5:00 PM – 8:00 PM)
                        </option>
                        <option value="Late Evening (8:00 PM – 10:30 PM)">
                          Late Evening (8:00 PM – 10:30 PM)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="lead-message"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      Message or Specific Questions <span className="text-neutral-500">(Optional)</span>
                    </label>
                    <textarea
                      id="lead-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Any questions about timings, beginner coaching, or membership durations?"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0A0B] border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm text-white placeholder:text-neutral-600"
                    />
                  </div>

                  <div className="pt-1 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 py-3.5 px-6 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-extrabold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <Send className="w-4 h-4 shrink-0" />
                      <span>
                        {isSubmitting
                          ? 'SUBMITTING...'
                          : activeTab === 'trial'
                          ? 'BOOK MY FREE TRIAL'
                          : 'SEND MEMBERSHIP ENQUIRY'}
                      </span>
                    </button>

                    <a
                      href={getFreeTrialWhatsAppUrl(settings.whatsapp, {
                        name: name || undefined,
                        goal,
                        preferredDate,
                        preferredTime,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto py-3.5 px-5 rounded-lg bg-[#0A0A0B] hover:bg-neutral-900 text-emerald-400 border border-neutral-800 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                    >
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span>Book via WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
