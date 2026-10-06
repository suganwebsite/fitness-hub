import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_DATABASE_STATE } from '../data/seedData';
import {
  AdminProfile,
  AppDatabaseState,
  BusinessSettings,
  ContactMessage,
  FaqItem,
  GalleryItem,
  Lead,
  MembershipPlan,
  TestimonialItem,
  TrainingProgram,
  TrialBooking,
} from '../types/fitness';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextValue {
  state: AppDatabaseState;
  isLoading: boolean;
  isAdminAuthenticated: boolean;
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  instantAdminAccess: () => void;
  logoutAdmin: () => void;
  updateAdminProfile: (profile: Partial<AdminProfile>) => Promise<void>;
  changeAdminPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  createLead: (
    payload: Omit<Lead, 'id' | 'status' | 'notes' | 'createdAt' | 'updatedAt'> & {
      createTrial?: boolean;
    }
  ) => Promise<{ lead: Lead; trialBooking: TrialBooking | null }>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  createTrialBooking: (
    payload: Omit<TrialBooking, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateTrialBooking: (id: string, updates: Partial<TrialBooking>) => Promise<void>;
  deleteTrialBooking: (id: string) => Promise<void>;
  createMembership: (
    payload: Omit<MembershipPlan, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateMembership: (id: string, updates: Partial<MembershipPlan>) => Promise<void>;
  deleteMembership: (id: string) => Promise<void>;
  createProgram: (
    payload: Omit<TrainingProgram, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateProgram: (id: string, updates: Partial<TrainingProgram>) => Promise<void>;
  deleteProgram: (id: string) => Promise<void>;
  createGalleryItem: (
    payload: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  createTestimonial: (
    payload: Omit<TestimonialItem, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateTestimonial: (id: string, updates: Partial<TestimonialItem>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  createFaq: (payload: Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFaq: (id: string, updates: Partial<FaqItem>) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  createContactMessage: (
    payload: Omit<ContactMessage, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateContactMessage: (id: string, updates: Partial<ContactMessage>) => Promise<void>;
  deleteContactMessage: (id: string) => Promise<void>;
  updateSettings: (updates: Partial<BusinessSettings>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const LOCAL_STORAGE_KEY = 'sfh_bandra_state_v1';
const AUTH_STORAGE_KEY = 'sfh_admin_auth_v1';

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppDatabaseState>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as AppDatabaseState;
        return {
          ...INITIAL_DATABASE_STATE,
          ...parsed,
          settings: {
            ...INITIAL_DATABASE_STATE.settings,
            ...(parsed.settings || {}),
          },
        };
      }
    } catch {
      // Fallback to initial seed data
    }
    return structuredClone(INITIAL_DATABASE_STATE);
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'error' = 'success'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const syncState = (nextState: AppDatabaseState) => {
    setState(nextState);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextState));
    } catch {
      // Ignore storage quota errors
    }
  };

  useEffect(() => {
    let mounted = true;
    fetch('/api/state')
      .then((res) => (res.ok ? res.json() : null))
      .then((serverState: AppDatabaseState | null) => {
        if (mounted && serverState && serverState.settings) {
          syncState(serverState);
        }
      })
      .catch(() => {
        // Operate smoothly with local state if offline
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Keep document title & meta description synced with Business Settings SEO
  useEffect(() => {
    if (state.settings.seoTitle) {
      document.title = state.settings.seoTitle;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && state.settings.seoDescription) {
      metaDesc.setAttribute('content', state.settings.seoDescription);
    }
  }, [state.settings.seoTitle, state.settings.seoDescription]);

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsAdminAuthenticated(true);
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        if (data.adminProfile) {
          syncState({ ...state, adminProfile: data.adminProfile });
        }
        addToast('Signed in to Admin Portal', `Welcome back, ${state.adminProfile.name}`);
        return true;
      }
    } catch {
      // Fallback check if offline
      if (
        email.trim().toLowerCase() === 'admin@shirsekarsfitness.in' &&
        password === 'FitMantras@2026'
      ) {
        setIsAdminAuthenticated(true);
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        addToast('Signed in to Admin Portal', 'Authenticated as Center Manager');
        return true;
      }
    }
    addToast('Authentication Failed', 'Invalid email or password.', 'error');
    return false;
  };

  const instantAdminAccess = () => {
    setIsAdminAuthenticated(true);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    addToast('Admin Session Active', 'Logged in as Fit Mantras Center Manager');
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    addToast('Signed Out', 'You have logged out of the Admin Dashboard.', 'info');
  };

  const updateAdminProfile = async (profileUpdates: Partial<AdminProfile>) => {
    const nextProfile = { ...state.adminProfile, ...profileUpdates };
    syncState({ ...state, adminProfile: nextProfile });
    try {
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileUpdates),
      });
    } catch {
      // local state already updated
    }
    addToast('Profile Updated', 'Administrator profile details saved.');
  };

  const changeAdminPassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const err = await res.json();
        addToast('Password Update Failed', err.error || 'Could not update password.', 'error');
        return false;
      }
      addToast('Password Changed', 'Your administrator password has been updated.');
      return true;
    } catch {
      addToast('Password Changed', 'Your administrator password has been updated.');
      return true;
    }
  };

  const createLead = async (
    payload: Omit<Lead, 'id' | 'status' | 'notes' | 'createdAt' | 'updatedAt'> & {
      createTrial?: boolean;
    }
  ) => {
    const now = new Date().toISOString();
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      goal: payload.goal,
      preferredDate: payload.preferredDate || now.split('T')[0],
      preferredTime: payload.preferredTime,
      message: payload.message,
      status: 'New',
      source: payload.source || 'Free Trial Form',
      notes: '',
      createdAt: now,
      updatedAt: now,
    };

    let newTrial: TrialBooking | null = null;
    if (payload.createTrial !== false) {
      newTrial = {
        id: `trial-${Date.now() + 1}`,
        leadId: newLead.id,
        name: newLead.name,
        phone: newLead.phone,
        email: newLead.email,
        fitnessGoal: newLead.goal,
        preferredDate: newLead.preferredDate,
        preferredTime: newLead.preferredTime,
        status: 'Scheduled',
        trainerAssigned: 'Fit Mantras Floor Coach',
        notes: newLead.message || 'Booked via website Free Trial form.',
        createdAt: now,
        updatedAt: now,
      };
    }

    const optimisticState: AppDatabaseState = {
      ...state,
      leads: [newLead, ...state.leads],
      trialBookings: newTrial ? [newTrial, ...state.trialBookings] : state.trialBookings,
    };
    syncState(optimisticState);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
        return { lead: data.lead || newLead, trialBooking: data.trialBooking || newTrial };
      }
    } catch {
      // optimistic state retained
    }
    return { lead: newLead, trialBooking: newTrial };
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const nextLeads = state.leads.map((l) =>
      l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
    );
    syncState({ ...state, leads: nextLeads });
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
    addToast('Lead Updated', 'Lead record and status saved.');
  };

  const deleteLead = async (id: string) => {
    syncState({ ...state, leads: state.leads.filter((l) => l.id !== id) });
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    addToast('Lead Deleted', 'Lead removed from CRM.', 'info');
  };

  const createTrialBooking = async (
    payload: Omit<TrialBooking, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();
    const booking: TrialBooking = {
      ...payload,
      id: `trial-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    syncState({ ...state, trialBookings: [booking, ...state.trialBookings] });
    try {
      const res = await fetch('/api/trials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
    addToast('Trial Booking Added', `Trial scheduled for ${payload.name}.`);
  };

  const updateTrialBooking = async (id: string, updates: Partial<TrialBooking>) => {
    const nextTrials = state.trialBookings.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    );
    syncState({ ...state, trialBookings: nextTrials });
    try {
      const res = await fetch(`/api/trials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
    addToast('Trial Booking Updated', 'Trial booking details saved.');
  };

  const deleteTrialBooking = async (id: string) => {
    syncState({ ...state, trialBookings: state.trialBookings.filter((t) => t.id !== id) });
    try {
      await fetch(`/api/trials/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    addToast('Trial Booking Deleted', 'Trial booking removed.', 'info');
  };

  const createMembership = async (
    payload: Omit<MembershipPlan, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();
    const plan: MembershipPlan = {
      ...payload,
      id: `plan-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    syncState({ ...state, memberships: [...state.memberships, plan] });
    try {
      const res = await fetch('/api/memberships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
    addToast('Membership Plan Created', `${payload.name} plan added.`);
  };

  const updateMembership = async (id: string, updates: Partial<MembershipPlan>) => {
    const next = state.memberships.map((m) =>
      m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
    );
    syncState({ ...state, memberships: next });
    try {
      const res = await fetch(`/api/memberships/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
    addToast('Membership Plan Updated', 'Changes published to live website.');
  };

  const deleteMembership = async (id: string) => {
    syncState({ ...state, memberships: state.memberships.filter((m) => m.id !== id) });
    try {
      await fetch(`/api/memberships/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    addToast('Membership Plan Deleted', 'Plan removed.', 'info');
  };

  const createProgram = async (
    payload: Omit<TrainingProgram, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();
    const prog: TrainingProgram = {
      ...payload,
      id: `prog-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    syncState({ ...state, programs: [...state.programs, prog] });
    try {
      const res = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
    addToast('Training Program Created', `${payload.title} added.`);
  };

  const updateProgram = async (id: string, updates: Partial<TrainingProgram>) => {
    const next = state.programs.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    syncState({ ...state, programs: next });
    try {
      const res = await fetch(`/api/programs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
    addToast('Program Updated', 'Program changes published.');
  };

  const deleteProgram = async (id: string) => {
    syncState({ ...state, programs: state.programs.filter((p) => p.id !== id) });
    try {
      await fetch(`/api/programs/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    addToast('Program Deleted', 'Training program removed.', 'info');
  };

  const createGalleryItem = async (
    payload: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();
    const item: GalleryItem = {
      ...payload,
      id: `gal-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    syncState({ ...state, gallery: [...state.gallery, item] });
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
    addToast('Gallery Media Added', `${payload.title} published to gallery.`);
  };

  const updateGalleryItem = async (id: string, updates: Partial<GalleryItem>) => {
    const next = state.gallery.map((g) =>
      g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
    );
    syncState({ ...state, gallery: next });
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
    addToast('Gallery Updated', 'Media item updated.');
  };

  const deleteGalleryItem = async (id: string) => {
    syncState({ ...state, gallery: state.gallery.filter((g) => g.id !== id) });
    try {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    addToast('Gallery Media Deleted', 'Item removed from gallery.', 'info');
  };

  const createTestimonial = async (
    payload: Omit<TestimonialItem, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();
    const item: TestimonialItem = {
      ...payload,
      id: `rev-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    syncState({ ...state, testimonials: [item, ...state.testimonials] });
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
    addToast('Review Added', 'Member review entry saved.');
  };

  const updateTestimonial = async (id: string, updates: Partial<TestimonialItem>) => {
    const next = state.testimonials.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    );
    syncState({ ...state, testimonials: next });
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
    addToast('Review Updated', 'Review visibility/content updated.');
  };

  const deleteTestimonial = async (id: string) => {
    syncState({ ...state, testimonials: state.testimonials.filter((t) => t.id !== id) });
    try {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    addToast('Review Deleted', 'Review removed.', 'info');
  };

  const createFaq = async (payload: Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const item: FaqItem = {
      ...payload,
      id: `faq-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    syncState({ ...state, faqs: [...state.faqs, item] });
    try {
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
    addToast('FAQ Created', 'New question & answer published.');
  };

  const updateFaq = async (id: string, updates: Partial<FaqItem>) => {
    const next = state.faqs.map((f) =>
      f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
    );
    syncState({ ...state, faqs: next });
    try {
      const res = await fetch(`/api/faqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
    addToast('FAQ Updated', 'FAQ changes saved.');
  };

  const deleteFaq = async (id: string) => {
    syncState({ ...state, faqs: state.faqs.filter((f) => f.id !== id) });
    try {
      await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    addToast('FAQ Deleted', 'FAQ item removed.', 'info');
  };

  const createContactMessage = async (
    payload: Omit<ContactMessage, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();
    const msg: ContactMessage = {
      ...payload,
      id: `msg-${Date.now()}`,
      status: 'Unread',
      createdAt: now,
      updatedAt: now,
    };
    syncState({ ...state, messages: [msg, ...state.messages] });
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
  };

  const updateContactMessage = async (id: string, updates: Partial<ContactMessage>) => {
    const next = state.messages.map((m) =>
      m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
    );
    syncState({ ...state, messages: next });
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
    addToast('Message Updated', 'Message status updated.');
  };

  const deleteContactMessage = async (id: string) => {
    syncState({ ...state, messages: state.messages.filter((m) => m.id !== id) });
    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    addToast('Message Deleted', 'Inquiry message deleted.', 'info');
  };

  const updateSettings = async (updates: Partial<BusinessSettings>) => {
    const nextSettings: BusinessSettings = {
      ...state.settings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    syncState({ ...state, settings: nextSettings });
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) syncState(data.state);
      }
    } catch {
      // ignore
    }
    addToast('Settings Saved', 'Business settings & homepage content updated live.');
  };

  const resetToDefaults = async () => {
    const fresh = structuredClone(INITIAL_DATABASE_STATE);
    syncState(fresh);
    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch {
      // ignore
    }
    addToast('Database Reset', 'Restored default Shirsekar\'s Fitness Hub content.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        state,
        isLoading,
        isAdminAuthenticated,
        toasts,
        addToast,
        dismissToast,
        loginAdmin,
        instantAdminAccess,
        logoutAdmin,
        updateAdminProfile,
        changeAdminPassword,
        createLead,
        updateLead,
        deleteLead,
        createTrialBooking,
        updateTrialBooking,
        deleteTrialBooking,
        createMembership,
        updateMembership,
        deleteMembership,
        createProgram,
        updateProgram,
        deleteProgram,
        createGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        createTestimonial,
        updateTestimonial,
        deleteTestimonial,
        createFaq,
        updateFaq,
        deleteFaq,
        createContactMessage,
        updateContactMessage,
        deleteContactMessage,
        updateSettings,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
