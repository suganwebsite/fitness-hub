import React, { useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  MessageSquare,
  Phone,
  Download,
  X,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStatus, TrialBooking, TrialStatus } from '../../types/fitness';
import { getCleanPhoneDigits, getWhatsAppUrl } from '../../utils/contactLinks';

const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'];
const TRIAL_STATUSES: TrialStatus[] = [
  'Scheduled',
  'Attended',
  'Rescheduled',
  'Converted',
  'No-Show',
];

// ============================================================================
// 1. DASHBOARD OVERVIEW VIEW (KPI Cards + Charts)
// ============================================================================
export const AdminDashboardOverview: React.FC<{
  onNavigateTab: (tab: string) => void;
}> = ({ onNavigateTab }) => {
  const { state } = useApp();
  const { leads, trialBookings, messages } = state;
  const [chartTimeframe, setChartTimeframe] = useState<'day' | 'week' | 'month'>('week');

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const followUps = leads.filter((l) => l.status === 'Follow-up' || l.status === 'Contacted').length;
  const convertedLeads = leads.filter((l) => l.status === 'Converted').length;
  const activeMembersCount = 38 + convertedLeads; // Base active members + CRM conversions
  const totalTrials = trialBookings.length;
  const conversionRate =
    totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  // Deterministic chart series for Day / Week / Month
  const chartData =
    chartTimeframe === 'day'
      ? [
          { label: 'Mon', leads: 3, trials: 2, enquiries: 1 },
          { label: 'Tue', leads: 5, trials: 3, enquiries: 2 },
          { label: 'Wed', leads: 4, trials: 3, enquiries: 1 },
          { label: 'Thu', leads: 6, trials: 4, enquiries: 2 },
          { label: 'Fri', leads: 5, trials: 3, enquiries: 2 },
          { label: 'Sat', leads: 8, trials: 6, enquiries: 3 },
          { label: 'Sun', leads: Math.max(4, newLeads + 2), trials: totalTrials, enquiries: 2 },
        ]
      : chartTimeframe === 'week'
      ? [
          { label: 'Wk 1', leads: 14, trials: 9, enquiries: 5 },
          { label: 'Wk 2', leads: 19, trials: 12, enquiries: 7 },
          { label: 'Wk 3', leads: 22, trials: 15, enquiries: 8 },
          { label: 'Wk 4', leads: 20 + totalLeads, trials: 14 + totalTrials, enquiries: 6 + messages.length },
        ]
      : [
          { label: 'Jul', leads: 54, trials: 36, enquiries: 18 },
          { label: 'Aug', leads: 68, trials: 44, enquiries: 24 },
          { label: 'Sep', leads: 79, trials: 52, enquiries: 27 },
          { label: 'Oct', leads: 65 + totalLeads, trials: 42 + totalTrials, enquiries: 21 + messages.length },
        ];

  const maxChartVal = Math.max(...chartData.map((d) => d.leads), 10);

  const kpiCards = [
    {
      label: 'TOTAL LEADS',
      value: totalLeads,
      sub: 'All inbound website & WhatsApp leads',
      actionTab: 'leads',
      accent: 'text-white',
    },
    {
      label: 'NEW LEADS',
      value: newLeads,
      sub: 'Awaiting first desk response',
      actionTab: 'leads',
      accent: 'text-amber-400',
    },
    {
      label: 'FOLLOW-UPS',
      value: followUps,
      sub: 'Contacted & active follow-up pipeline',
      actionTab: 'leads',
      accent: 'text-sky-400',
    },
    {
      label: 'CONVERTED',
      value: convertedLeads,
      sub: `${conversionRate}% lead-to-member conversion rate`,
      actionTab: 'leads',
      accent: 'text-emerald-400',
    },
    {
      label: 'MEMBERS',
      value: activeMembersCount,
      sub: 'Active enrolled gym members',
      actionTab: 'memberships',
      accent: 'text-white',
    },
    {
      label: 'TRIAL BOOKINGS',
      value: totalTrials,
      sub: 'Scheduled & completed floor trials',
      actionTab: 'trials',
      accent: 'text-amber-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 6 Required Dashboard Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => onNavigateTab(card.actionTab)}
            className="p-5 rounded-xl bg-[#16181D] border border-white/[0.08] hover:border-amber-500/40 text-left transition-colors flex flex-col justify-between gap-3 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                {card.label}
              </span>
              <span className="text-[11px] text-amber-400 font-medium">View →</span>
            </div>
            <div className={`font-mono text-3xl font-extrabold tabular-nums ${card.accent}`}>
              {card.value}
            </div>
            <p className="text-xs text-neutral-400">{card.sub}</p>
          </button>
        ))}
      </div>

      {/* Charts Grid: Leads by Day/Week/Month + Conversion Rate & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leads, Trial Bookings & Membership Enquiries Chart */}
        <div className="lg:col-span-8 p-6 rounded-xl bg-[#16181D] border border-white/[0.08] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Leads, Trial Bookings & Membership Enquiries
              </h3>
              <p className="text-xs text-neutral-400">
                Inbound conversion activity across Bandra East campaigns
              </p>
            </div>
            <div
              role="tablist"
              aria-label="Chart Timeframe"
              className="flex items-center gap-1 p-1 bg-[#0A0A0B] rounded-lg border border-neutral-800 self-start"
            >
              {(['day', 'week', 'month'] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  role="tab"
                  aria-selected={chartTimeframe === tf}
                  onClick={() => setChartTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-semibold rounded capitalize transition-colors cursor-pointer ${
                    chartTimeframe === tf
                      ? 'bg-amber-500 text-neutral-950'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-4 pb-2">
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 items-end h-48 border-b border-neutral-800 pb-3">
              {chartData.map((d) => {
                const leadHeight = Math.max(14, Math.round((d.leads / maxChartVal) * 150));
                const trialHeight = Math.max(10, Math.round((d.trials / maxChartVal) * 150));
                const enqHeight = Math.max(8, Math.round((d.enquiries / maxChartVal) * 150));
                return (
                  <div key={d.label} className="flex flex-col items-center gap-2">
                    <div className="flex items-end gap-1.5 h-40">
                      <div
                        title={`Total Leads: ${d.leads}`}
                        style={{ height: `${leadHeight}px` }}
                        className="w-3 sm:w-3.5 rounded-t bg-amber-500 transition-all"
                      />
                      <div
                        title={`Trial Bookings: ${d.trials}`}
                        style={{ height: `${trialHeight}px` }}
                        className="w-3 sm:w-3.5 rounded-t bg-emerald-500 transition-all"
                      />
                      <div
                        title={`Membership Enquiries: ${d.enquiries}`}
                        style={{ height: `${enqHeight}px` }}
                        className="w-3 sm:w-3.5 rounded-t bg-sky-500 transition-all"
                      />
                    </div>
                    <span className="font-mono text-xs text-neutral-400 tabular-nums">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                <span>Total Leads</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                <span>Trial Bookings</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-sky-500" />
                <span>Membership Enquiries</span>
              </span>
            </div>
          </div>
        </div>

        {/* Conversion Rate & Pipeline Breakdown */}
        <div className="lg:col-span-4 p-6 rounded-xl bg-[#16181D] border border-white/[0.08] flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-white">
              Conversion Pipeline
            </h3>
            <p className="text-xs text-neutral-400">
              Lead distribution by CRM stage
            </p>
          </div>

          <div className="space-y-4">
            {LEAD_STATUSES.map((st) => {
              const count = leads.filter((l) => l.status === st).length;
              const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
              return (
                <div key={st} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-200">{st}</span>
                    <span className="font-mono text-neutral-400 tabular-nums">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0A0A0B] overflow-hidden">
                    <div
                      style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
                      className={`h-full rounded-full ${
                        st === 'Converted'
                          ? 'bg-emerald-500'
                          : st === 'New'
                          ? 'bg-amber-500'
                          : st === 'Lost'
                          ? 'bg-rose-500'
                          : 'bg-sky-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-lg bg-[#0A0A0B] border border-neutral-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">Overall Conversion Rate</p>
              <p className="font-mono text-2xl font-extrabold text-emerald-400 tabular-nums">
                {conversionRate}%
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('leads')}
              className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white cursor-pointer"
            >
              Manage Leads
            </button>
          </div>
        </div>
      </div>

      {/* Recent Leads Quick Table */}
      <div className="p-6 rounded-xl bg-[#16181D] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Recent Free Trial & Membership Leads</h3>
            <p className="text-xs text-neutral-400">Latest enquiries submitted from the public website</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('leads')}
            className="text-xs font-semibold text-amber-400 hover:underline cursor-pointer"
          >
            Open Full Lead CRM →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 uppercase">
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Goal</th>
                <th className="py-3 px-3">Preferred Visit</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/70">
              {leads.slice(0, 5).map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-white">{lead.name}</td>
                  <td className="py-3 px-3 font-mono text-neutral-300 tabular-nums">{lead.phone}</td>
                  <td className="py-3 px-3 text-neutral-300">{lead.goal}</td>
                  <td className="py-3 px-3 font-mono text-neutral-400 tabular-nums">
                    {lead.preferredDate}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-semibold ${
                        lead.status === 'Converted'
                          ? 'text-emerald-400'
                          : lead.status === 'New'
                          ? 'text-amber-400'
                          : lead.status === 'Lost'
                          ? 'text-rose-400'
                          : 'text-sky-400'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <a
                      href={getWhatsAppUrl(
                         lead.phone,
                        `Hi ${lead.name}, this is Shirsekar's Fitness Hub (Managed by Fit Mantras) in Bandra East following up on your ${lead.goal} enquiry.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-medium"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. LEAD MANAGEMENT CRM VIEW
// ============================================================================
export const AdminLeadsManager: React.FC = () => {
  const { state, createLead, updateLead, deleteLead } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | LeadStatus>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // New lead modal state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newGoal, setNewGoal] = useState('Strength Training');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('Evening (6:00 PM – 9:00 PM)');
  const [newSource, setNewSource] = useState('Walk-in / Desk');
  const [newNotes, setNewNotes] = useState('');

  const filteredLeads = state.leads
    .filter((l) => (statusFilter === 'All' ? true : l.status === statusFilter))
    .filter((l) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.goal.toLowerCase().includes(q) ||
        l.source.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'oldest') return a.createdAt.localeCompare(b.createdAt);
      return b.createdAt.localeCompare(a.createdAt);
    });

  const handleExportCsv = () => {
    const headers = ['Name', 'Phone', 'Email', 'Goal', 'Preferred Date', 'Status', 'Source', 'Notes', 'Created'];
    const rows = filteredLeads.map((l) => [
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.goal}"`,
      `"${l.preferredDate}"`,
      `"${l.status}"`,
      `"${l.source}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${l.createdAt}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `shirsekars_fitness_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    await createLead({
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim(),
      goal: newGoal,
      preferredDate: newDate,
      preferredTime: newTime,
      message: newNotes.trim(),
      source: newSource,
      createTrial: true,
    });
    setIsAddModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-[#16181D] border border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, goal..."
              aria-label="Search leads"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-[#0A0A0B] rounded-lg border border-neutral-800">
            {(['All', ...LEAD_STATUSES] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-amber-500 text-neutral-950'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="Sort leads"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'name')}
            className="px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-xs text-neutral-200"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A–Z)</option>
          </select>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0A0A0B] hover:bg-neutral-900 text-xs font-semibold text-neutral-200 border border-neutral-800 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-xl bg-[#16181D] border border-white/[0.08] overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-white">No leads match your current filter.</p>
            <p className="text-xs text-neutral-400">
              Try clearing your search query or add a manual walk-in lead.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
              }}
              className="px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-[#0A0A0B]/60 text-neutral-400 uppercase">
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Goal</th>
                  <th className="py-3.5 px-4">Preferred Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/70">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{lead.name}</div>
                      {lead.notes && (
                        <div className="text-[11px] text-neutral-400 truncate max-w-[180px]">
                          Note: {lead.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-200 tabular-nums whitespace-nowrap">
                      {lead.phone}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400">{lead.email || '—'}</td>
                    <td className="py-3.5 px-4 text-neutral-200">{lead.goal}</td>
                    <td className="py-3.5 px-4 font-mono text-neutral-300 tabular-nums whitespace-nowrap">
                      <div>{lead.preferredDate}</div>
                      <div className="text-[11px] text-neutral-500">{lead.preferredTime}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        aria-label={`Change status for ${lead.name}`}
                        value={lead.status}
                        onChange={(e) =>
                          updateLead(lead.id, { status: e.target.value as LeadStatus })
                        }
                        className={`px-2.5 py-1 rounded bg-[#0A0A0B] border border-neutral-700 text-xs font-semibold ${
                          lead.status === 'Converted'
                            ? 'text-emerald-400'
                            : lead.status === 'New'
                            ? 'text-amber-400'
                            : lead.status === 'Lost'
                            ? 'text-rose-400'
                            : 'text-sky-400'
                        }`}
                      >
                        {LEAD_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400 whitespace-nowrap">{lead.source}</td>
                    <td className="py-3.5 px-4 font-mono text-neutral-400 tabular-nums whitespace-nowrap">
                      {lead.createdAt.slice(0, 10)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={getWhatsAppUrl(
                            lead.phone,
                            `Hi ${lead.name}, this is Shirsekar's Fitness Hub in Bandra East regarding your ${lead.goal} enquiry.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`WhatsApp ${lead.name}`}
                          className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${getCleanPhoneDigits(lead.phone)}`}
                          aria-label={`Call ${lead.name}`}
                          className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-400 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => setEditingLead(lead)}
                          aria-label={`Edit or add note for ${lead.name}`}
                          className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(lead.id)}
                          aria-label={`Delete ${lead.name}`}
                          className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / View / Add Note Modal */}
      {editingLead && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Edit Lead ${editingLead.name}`}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-lg w-full rounded-xl bg-[#16181D] border border-neutral-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-display text-lg font-bold text-white">
                Lead Details & Follow-up Notes
              </h3>
              <button
                type="button"
                onClick={() => setEditingLead(null)}
                aria-label="Close modal"
                className="p-1 rounded text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingLead.name}
                    onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Status</label>
                  <select
                    value={editingLead.status}
                    onChange={(e) =>
                      setEditingLead({ ...editingLead, status: e.target.value as LeadStatus })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                  >
                    {LEAD_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Goal</label>
                  <input
                    type="text"
                    value={editingLead.goal}
                    onChange={(e) => setEditingLead({ ...editingLead, goal: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                  />
                </div>
              </div>

              {editingLead.message && (
                <div className="p-3 rounded-lg bg-[#0A0A0B] border border-neutral-800">
                  <span className="text-neutral-500 block mb-0.5">Visitor Message:</span>
                  <span className="text-neutral-200">{editingLead.message}</span>
                </div>
              )}

              <div>
                <label className="block text-neutral-400 mb-1">CRM Follow-up Notes</label>
                <textarea
                  rows={3}
                  value={editingLead.notes}
                  onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                  placeholder="Add call summary, trial attendance notes, or membership preference..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingLead(null)}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await updateLead(editingLead.id, editingLead);
                  setEditingLead(null);
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Walk-in / Manual Lead Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Add New Lead"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <form
            onSubmit={handleAddLead}
            className="max-w-lg w-full rounded-xl bg-[#16181D] border border-neutral-800 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-display text-lg font-bold text-white">Add Walk-in / Phone Lead</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Close modal"
                className="p-1 rounded text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1">Goal</label>
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1">Preferred Visit Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1">Lead Source</label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
                >
                  <option value="Walk-in / Desk">Walk-in / Desk</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="WhatsApp CTA">WhatsApp CTA</option>
                  <option value="Google Maps">Google Maps</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-neutral-300 mb-1">Initial Desk Notes</label>
              <textarea
                rows={2}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-neutral-800 text-white"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold cursor-pointer"
              >
                Create Lead
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Dialog for Deletion */}
      {confirmDeleteId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm Delete Lead"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-sm w-full rounded-xl bg-[#16181D] border border-neutral-800 p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-display text-base font-bold text-white">Delete Lead Record?</h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              This will permanently remove the lead from your CRM pipeline.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteLead(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 3. TRIAL BOOKINGS MANAGER VIEW
// ============================================================================
export const AdminTrialsManager: React.FC = () => {
  const { state, updateTrialBooking, deleteTrialBooking } = useApp();
  const [filterStatus, setFilterStatus] = useState<'All' | TrialStatus>('All');

  const filtered = state.trialBookings.filter((t) =>
    filterStatus === 'All' ? true : t.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#16181D] border border-white/[0.08]">
        <div>
          <h3 className="font-display text-base font-bold text-white">
            Scheduled Free Trial Visits
          </h3>
          <p className="text-xs text-neutral-400">
            Track floor trial attendance, assign Fit Mantras coaches, and convert visitors
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#0A0A0B] rounded-lg border border-neutral-800">
          {(['All', ...TRIAL_STATUSES] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-amber-500 text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((trial: TrialBooking) => (
          <div
            key={trial.id}
            className="p-5 rounded-xl bg-[#16181D] border border-white/[0.08] flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-display text-base font-bold text-white">{trial.name}</h4>
                <select
                  aria-label={`Trial status for ${trial.name}`}
                  value={trial.status}
                  onChange={(e) =>
                    updateTrialBooking(trial.id, { status: e.target.value as TrialStatus })
                  }
                  className="px-2.5 py-1 rounded bg-[#0A0A0B] border border-neutral-700 text-xs font-semibold text-amber-400"
                >
                  {TRIAL_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-300">
                <span className="font-mono tabular-nums">{trial.phone}</span>
                <span>·</span>
                <span className="text-amber-400 font-medium">{trial.fitnessGoal}</span>
              </div>

              <div className="p-3 rounded-lg bg-[#0A0A0B] border border-neutral-800 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-mono tabular-nums">{trial.preferredDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{trial.preferredTime}</span>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <label className="block text-neutral-500">Assigned Floor Coach:</label>
                <input
                  type="text"
                  value={trial.trainerAssigned}
                  onChange={(e) =>
                    updateTrialBooking(trial.id, { trainerAssigned: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 rounded bg-[#0A0A0B] border border-neutral-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppUrl(
                    trial.phone,
                    `Hi ${trial.name}, confirming your Free Trial at Shirsekar's Fitness Hub (Bandra East) on ${trial.preferredDate} (${trial.preferredTime}).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded bg-emerald-500/15 text-emerald-400 text-xs font-semibold inline-flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Confirm Slot on WhatsApp</span>
                </a>
              </div>
              <button
                type="button"
                onClick={() => deleteTrialBooking(trial.id)}
                aria-label={`Delete trial for ${trial.name}`}
                className="p-1.5 rounded text-neutral-500 hover:text-rose-400 cursor-pointer"
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
// 4. CONTACT MESSAGES VIEW
// ============================================================================
export const AdminMessagesManager: React.FC = () => {
  const { state, updateContactMessage, deleteContactMessage } = useApp();

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-[#16181D] border border-white/[0.08]">
        <h3 className="font-display text-base font-bold text-white">
          General Enquiries & Contact Messages
        </h3>
        <p className="text-xs text-neutral-400">
          Direct messages submitted via the Membership Enquiry & Contact tabs
        </p>
      </div>

      {state.messages.length === 0 ? (
        <div className="p-12 rounded-xl bg-[#16181D] border border-white/[0.08] text-center text-xs text-neutral-400">
          No contact messages in inbox.
        </div>
      ) : (
        <div className="space-y-3">
          {state.messages.map((msg) => (
            <div
              key={msg.id}
              className="p-5 rounded-xl bg-[#16181D] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm font-bold text-white">{msg.name}</span>
                  <span className="font-mono text-xs text-amber-400 tabular-nums">{msg.phone}</span>
                  <span className="text-xs text-neutral-500">· {msg.status}</span>
                </div>
                <p className="text-xs font-semibold text-neutral-200">{msg.subject}</p>
                <p className="text-xs text-neutral-300 leading-relaxed">{msg.message}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    updateContactMessage(msg.id, {
                      status: msg.status === 'Unread' ? 'Read' : 'Replied',
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white inline-flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mark {msg.status === 'Unread' ? 'Read' : 'Replied'}</span>
                </button>
                <a
                  href={getWhatsAppUrl(
                    msg.phone,
                    `Hi ${msg.name}, regarding your message to Shirsekar's Fitness Hub: "${msg.subject}"`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 text-xs font-semibold"
                >
                  Reply on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => deleteContactMessage(msg.id)}
                  aria-label={`Delete message from ${msg.name}`}
                  className="p-1.5 rounded text-neutral-500 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
