import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminAuthScreenProps {
  onBackToSite: () => void;
}

export const AdminAuthScreen: React.FC<AdminAuthScreenProps> = ({ onBackToSite }) => {
  const { loginAdmin, instantAdminAccess, state } = useApp();
  const [email, setEmail] = useState('admin@shirsekarsfitness.in');
  const [password, setPassword] = useState('FitMantras@2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const ok = await loginAdmin(email, password);
      if (!ok) {
        setError('Invalid credentials. Use the default credentials below or click Instant Manager Access.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0] flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white py-2 px-3 rounded-lg bg-[#16181D] border border-neutral-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-amber-500" />
          <span>Back to Public Website</span>
        </button>
        <span className="text-xs font-mono text-neutral-500">
          {state.settings.businessName} · Admin Portal
        </span>
      </div>

      <div className="max-w-md w-full mx-auto my-12 p-6 sm:p-8 rounded-xl bg-[#16181D] border border-white/[0.08] shadow-2xl space-y-6">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white tracking-tight">
            Admin & CRM Sign In
          </h1>
          <p className="text-xs text-neutral-400">
            {state.settings.businessName} ({state.settings.managedBy}) — Manage leads, free trials,
            memberships, gallery, and website content.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-medium text-neutral-300 mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#0A0A0B] border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-medium text-neutral-300 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#0A0A0B] border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs tracking-wide transition-colors cursor-pointer"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN TO DASHBOARD'}
          </button>
        </form>

        <div className="pt-4 border-t border-white/[0.08] space-y-3">
          <div className="p-3 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-xs text-neutral-400 space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>Configured Manager Credentials</span>
            </div>
            <p className="font-mono text-[11px] text-neutral-400">
              Email: admin@shirsekarsfitness.in
            </p>
            <p className="font-mono text-[11px] text-neutral-400">Pass: FitMantras@2026</p>
          </div>

          <button
            type="button"
            onClick={instantAdminAccess}
            className="w-full py-2.5 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-neutral-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Instant Manager Access (One-Click Demo Login)</span>
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-neutral-500">
        © 2026 Shirsekar&apos;s Fitness Hub · Managed by Fit Mantras
      </div>
    </div>
  );
};
