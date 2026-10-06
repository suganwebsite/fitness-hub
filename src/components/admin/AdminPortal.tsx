import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CreditCard,
  Dumbbell,
  Image as ImageIcon,
  MessageSquareQuote,
  HelpCircle,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminAuthScreen } from './AdminAuthScreen';
import {
  AdminDashboardOverview,
  AdminLeadsManager,
  AdminTrialsManager,
  AdminMessagesManager,
} from './AdminOverviewAndCrm';
import {
  AdminMembershipsManager,
  AdminProgramsManager,
  AdminGalleryManager,
  AdminTestimonialsManager,
  AdminFaqsManager,
  AdminSettingsManager,
} from './AdminContentManagers';

interface AdminPortalProps {
  onBackToSite: () => void;
}

export type AdminTabKey =
  | 'dashboard'
  | 'leads'
  | 'trials'
  | 'memberships'
  | 'programs'
  | 'gallery'
  | 'testimonials'
  | 'faqs'
  | 'messages'
  | 'settings';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToSite }) => {
  const { state, isAdminAuthenticated, logoutAdmin } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTabKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAdminAuthenticated) {
    return <AdminAuthScreen onBackToSite={onBackToSite} />;
  }

  const navItems: Array<{
    key: AdminTabKey;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }> = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      key: 'leads',
      label: 'Leads',
      icon: <Users className="w-4 h-4" />,
      badge: state.leads.filter((l) => l.status === 'New').length,
    },
    {
      key: 'trials',
      label: 'Trial Bookings',
      icon: <CalendarCheck className="w-4 h-4" />,
      badge: state.trialBookings.filter((t) => t.status === 'Scheduled').length,
    },
    {
      key: 'memberships',
      label: 'Memberships',
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      key: 'programs',
      label: 'Programs',
      icon: <Dumbbell className="w-4 h-4" />,
    },
    {
      key: 'gallery',
      label: 'Gallery',
      icon: <ImageIcon className="w-4 h-4" />,
    },
    {
      key: 'testimonials',
      label: 'Testimonials',
      icon: <MessageSquareQuote className="w-4 h-4" />,
    },
    {
      key: 'faqs',
      label: 'FAQs',
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      key: 'messages',
      label: 'Messages',
      icon: <Mail className="w-4 h-4" />,
      badge: state.messages.filter((m) => m.status === 'Unread').length,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const currentNavLabel = navItems.find((n) => n.key === activeTab)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0] flex">
      {/* Sidebar Navigation (260px fixed width on Desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0F1012] border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-sm font-extrabold text-white tracking-tight">
                SHIRSEKARS&apos; FITNESS HUB
              </p>
              <p className="text-[11px] text-amber-400 font-medium">
                {state.settings.managedBy} · Admin
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="lg:hidden p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav aria-label="Admin Sidebar Navigation" className="space-y-1">
            {navItems.map((item) => {
              const active = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-amber-500 text-neutral-950'
                      : 'text-neutral-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        active ? 'text-neutral-950 font-bold' : 'text-amber-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/[0.08] space-y-3">
          <div className="px-2">
            <p className="text-xs font-semibold text-white truncate">
              {state.adminProfile.name}
            </p>
            <p className="text-[11px] text-neutral-400 truncate">{state.adminProfile.email}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onBackToSite}
              className="py-2 px-2.5 rounded-lg bg-[#16181D] hover:bg-neutral-800 text-xs font-semibold text-neutral-200 border border-neutral-800 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Site</span>
            </button>
            <button
              type="button"
              onClick={logoutAdmin}
              className="py-2 px-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Contract for SaaS Dashboard: Breadcrumbs Left, Actions Right */}
        <header className="h-16 bg-[#0F1012] border-b border-white/[0.08] px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin navigation drawer"
              className="lg:hidden p-2 rounded-lg bg-[#16181D] text-neutral-200"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="text-xs sm:text-sm text-neutral-400 flex items-center gap-2">
              <span className="hidden sm:inline">Shirsekar&apos;s Fitness Hub</span>
              <span className="hidden sm:inline" aria-hidden="true">
                /
              </span>
              <span>Admin</span>
              <span aria-hidden="true">/</span>
              <span className="font-bold text-white">{currentNavLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToSite}
              className="px-3.5 py-2 rounded-lg bg-[#16181D] hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-[1280px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <AdminDashboardOverview
              onNavigateTab={(tab) => setActiveTab(tab as AdminTabKey)}
            />
          )}
          {activeTab === 'leads' && <AdminLeadsManager />}
          {activeTab === 'trials' && <AdminTrialsManager />}
          {activeTab === 'memberships' && <AdminMembershipsManager />}
          {activeTab === 'programs' && <AdminProgramsManager />}
          {activeTab === 'gallery' && <AdminGalleryManager />}
          {activeTab === 'testimonials' && <AdminTestimonialsManager />}
          {activeTab === 'faqs' && <AdminFaqsManager />}
          {activeTab === 'messages' && <AdminMessagesManager />}
          {activeTab === 'settings' && <AdminSettingsManager />}
        </main>
      </div>
    </div>
  );
};
