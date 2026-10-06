import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  getDatabaseState,
  saveDatabaseState,
  getAdminCredentials,
  saveAdminCredentials,
} from './src/server/db';
import { INITIAL_DATABASE_STATE } from './src/data/seedData';
import {
  ContactMessage,
  FaqItem,
  GalleryItem,
  Lead,
  MembershipPlan,
  TestimonialItem,
  TrainingProgram,
  TrialBooking,
} from './src/types/fitness';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));

  // Serve generated images reliably in both dev and production
  app.use('/src/assets/images', express.static(path.resolve(__dirname, 'src/assets/images')));

  // =========================================================================
  // REST API ROUTES
  // =========================================================================

  // 1. Get full application state
  app.get('/api/state', (_req, res) => {
    const state = getDatabaseState();
    res.json(state);
  });

  // 2. Admin Authentication & Profile
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    const creds = getAdminCredentials();
    const state = getDatabaseState();

    if (
      String(email).trim().toLowerCase() === creds.email.toLowerCase() &&
      String(password) === creds.password
    ) {
      state.adminProfile.lastLoginAt = new Date().toISOString();
      saveDatabaseState(state);
      return res.json({
        success: true,
        token: 'sfh-session-token-2026',
        adminProfile: state.adminProfile,
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid email or password. Use the demo credentials or Instant Manager Access.',
    });
  });

  app.put('/api/auth/profile', (req, res) => {
    const state = getDatabaseState();
    const { name, email, role, phone } = req.body || {};
    state.adminProfile = {
      ...state.adminProfile,
      name: name ?? state.adminProfile.name,
      email: email ?? state.adminProfile.email,
      role: role ?? state.adminProfile.role,
      phone: phone ?? state.adminProfile.phone,
    };
    if (email) {
      const creds = getAdminCredentials();
      saveAdminCredentials({ ...creds, email: String(email).trim() });
    }
    saveDatabaseState(state);
    res.json({ success: true, adminProfile: state.adminProfile });
  });

  app.post('/api/auth/password', (req, res) => {
    const { currentPassword, newPassword } = req.body || {};
    const creds = getAdminCredentials();
    if (currentPassword && currentPassword !== creds.password) {
      return res.status(400).json({
        success: false,
        error: 'Current password did not match.',
      });
    }
    if (!newPassword || String(newPassword).length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters.',
      });
    }
    saveAdminCredentials({ ...creds, password: String(newPassword) });
    res.json({ success: true });
  });

  // 3. Leads & Free Trial Bookings
  app.post('/api/leads', (req, res) => {
    const state = getDatabaseState();
    const now = new Date().toISOString();
    const {
      name,
      phone,
      email = '',
      goal = 'General Fitness',
      preferredDate = '',
      preferredTime = 'Evening (6:00 PM – 9:00 PM)',
      message = '',
      source = 'Free Trial Form',
      createTrial = true,
    } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone number are required.' });
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      goal: String(goal).trim(),
      preferredDate: String(preferredDate || new Date().toISOString().split('T')[0]),
      preferredTime: String(preferredTime),
      message: String(message).trim(),
      status: 'New',
      source: String(source),
      notes: '',
      createdAt: now,
      updatedAt: now,
    };

    state.leads.unshift(newLead);

    let newTrial: TrialBooking | null = null;
    if (createTrial) {
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
      state.trialBookings.unshift(newTrial);
    }

    saveDatabaseState(state);
    res.status(201).json({ lead: newLead, trialBooking: newTrial, state });
  });

  app.put('/api/leads/:id', (req, res) => {
    const state = getDatabaseState();
    const idx = state.leads.findIndex((l) => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

    state.leads[idx] = {
      ...state.leads[idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDatabaseState(state);
    res.json({ lead: state.leads[idx], state });
  });

  app.delete('/api/leads/:id', (req, res) => {
    const state = getDatabaseState();
    state.leads = state.leads.filter((l) => l.id !== req.params.id);
    saveDatabaseState(state);
    res.json({ state });
  });

  // 4. Trial Bookings CRUD
  app.post('/api/trials', (req, res) => {
    const state = getDatabaseState();
    const now = new Date().toISOString();
    const booking: TrialBooking = {
      id: `trial-${Date.now()}`,
      name: String(req.body.name || '').trim(),
      phone: String(req.body.phone || '').trim(),
      email: String(req.body.email || '').trim(),
      fitnessGoal: String(req.body.fitnessGoal || 'General Fitness'),
      preferredDate: String(req.body.preferredDate || new Date().toISOString().split('T')[0]),
      preferredTime: String(req.body.preferredTime || 'Evening (6:00 PM – 9:00 PM)'),
      status: req.body.status || 'Scheduled',
      trainerAssigned: String(req.body.trainerAssigned || 'Fit Mantras Floor Coach'),
      notes: String(req.body.notes || ''),
      createdAt: now,
      updatedAt: now,
    };
    state.trialBookings.unshift(booking);
    saveDatabaseState(state);
    res.status(201).json({ trialBooking: booking, state });
  });

  app.put('/api/trials/:id', (req, res) => {
    const state = getDatabaseState();
    const idx = state.trialBookings.findIndex((t) => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Trial booking not found' });
    state.trialBookings[idx] = {
      ...state.trialBookings[idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDatabaseState(state);
    res.json({ trialBooking: state.trialBookings[idx], state });
  });

  app.delete('/api/trials/:id', (req, res) => {
    const state = getDatabaseState();
    state.trialBookings = state.trialBookings.filter((t) => t.id !== req.params.id);
    saveDatabaseState(state);
    res.json({ state });
  });

  // 5. Memberships CRUD
  app.post('/api/memberships', (req, res) => {
    const state = getDatabaseState();
    const now = new Date().toISOString();
    const plan: MembershipPlan = {
      id: `plan-${Date.now()}`,
      name: String(req.body.name || 'NEW PLAN').trim(),
      subtitle: String(req.body.subtitle || ''),
      price: String(req.body.price || 'Enquire for Rates'),
      duration: String(req.body.duration || 'Flexible Duration'),
      features: Array.isArray(req.body.features) ? req.body.features : [],
      discount: String(req.body.discount || ''),
      offer: String(req.body.offer || ''),
      ctaText: String(req.body.ctaText || 'ENQUIRE NOW'),
      isFeatured: Boolean(req.body.isFeatured),
      isActive: req.body.isActive !== false,
      sortOrder: Number(req.body.sortOrder ?? state.memberships.length + 1),
      createdAt: now,
      updatedAt: now,
    };
    state.memberships.push(plan);
    saveDatabaseState(state);
    res.status(201).json({ membership: plan, state });
  });

  app.put('/api/memberships/:id', (req, res) => {
    const state = getDatabaseState();
    const idx = state.memberships.findIndex((m) => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Membership not found' });
    state.memberships[idx] = {
      ...state.memberships[idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDatabaseState(state);
    res.json({ membership: state.memberships[idx], state });
  });

  app.delete('/api/memberships/:id', (req, res) => {
    const state = getDatabaseState();
    state.memberships = state.memberships.filter((m) => m.id !== req.params.id);
    saveDatabaseState(state);
    res.json({ state });
  });

  // 6. Training Programs CRUD
  app.post('/api/programs', (req, res) => {
    const state = getDatabaseState();
    const now = new Date().toISOString();
    const prog: TrainingProgram = {
      id: `prog-${Date.now()}`,
      title: String(req.body.title || 'New Program').trim(),
      description: String(req.body.description || ''),
      whoItsFor: String(req.body.whoItsFor || 'All Fitness Levels'),
      imageUrl: String(req.body.imageUrl || state.settings.heroImage),
      trainer: String(req.body.trainer || 'Fit Mantras Coaching Team'),
      duration: String(req.body.duration || 'Ongoing'),
      difficulty: String(req.body.difficulty || 'All Levels'),
      isActive: req.body.isActive !== false,
      sortOrder: Number(req.body.sortOrder ?? state.programs.length + 1),
      createdAt: now,
      updatedAt: now,
    };
    state.programs.push(prog);
    saveDatabaseState(state);
    res.status(201).json({ program: prog, state });
  });

  app.put('/api/programs/:id', (req, res) => {
    const state = getDatabaseState();
    const idx = state.programs.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Program not found' });
    state.programs[idx] = {
      ...state.programs[idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDatabaseState(state);
    res.json({ program: state.programs[idx], state });
  });

  app.delete('/api/programs/:id', (req, res) => {
    const state = getDatabaseState();
    state.programs = state.programs.filter((p) => p.id !== req.params.id);
    saveDatabaseState(state);
    res.json({ state });
  });

  // 7. Gallery CRUD & Reorder
  app.post('/api/gallery', (req, res) => {
    const state = getDatabaseState();
    const now = new Date().toISOString();
    const item: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: String(req.body.title || 'Gym Gallery Photo').trim(),
      caption: String(req.body.caption || ''),
      category: req.body.category || 'Gym',
      imageUrl: String(req.body.imageUrl || state.settings.heroImage),
      videoUrl: req.body.videoUrl ? String(req.body.videoUrl) : undefined,
      isFeatured: Boolean(req.body.isFeatured),
      isRepresentative: Boolean(req.body.isRepresentative),
      sortOrder: Number(req.body.sortOrder ?? state.gallery.length + 1),
      createdAt: now,
      updatedAt: now,
    };
    state.gallery.push(item);
    saveDatabaseState(state);
    res.status(201).json({ galleryItem: item, state });
  });

  app.put('/api/gallery/:id', (req, res) => {
    const state = getDatabaseState();
    const idx = state.gallery.findIndex((g) => g.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Gallery item not found' });
    state.gallery[idx] = {
      ...state.gallery[idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDatabaseState(state);
    res.json({ galleryItem: state.gallery[idx], state });
  });

  app.delete('/api/gallery/:id', (req, res) => {
    const state = getDatabaseState();
    state.gallery = state.gallery.filter((g) => g.id !== req.params.id);
    saveDatabaseState(state);
    res.json({ state });
  });

  // 8. Testimonials CRUD
  app.post('/api/testimonials', (req, res) => {
    const state = getDatabaseState();
    const now = new Date().toISOString();
    const item: TestimonialItem = {
      id: `rev-${Date.now()}`,
      name: String(req.body.name || 'Verified Member').trim(),
      review: String(req.body.review || '').trim(),
      rating: Math.min(5, Math.max(1, Number(req.body.rating || 5))),
      photoUrl: String(req.body.photoUrl || ''),
      reviewDate: String(req.body.reviewDate || new Date().toLocaleDateString('en-IN')),
      sourceLabel: String(req.body.sourceLabel || 'Authentic Member Review'),
      isPublished: req.body.isPublished !== false,
      createdAt: now,
      updatedAt: now,
    };
    state.testimonials.unshift(item);
    saveDatabaseState(state);
    res.status(201).json({ testimonial: item, state });
  });

  app.put('/api/testimonials/:id', (req, res) => {
    const state = getDatabaseState();
    const idx = state.testimonials.findIndex((t) => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Testimonial not found' });
    state.testimonials[idx] = {
      ...state.testimonials[idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDatabaseState(state);
    res.json({ testimonial: state.testimonials[idx], state });
  });

  app.delete('/api/testimonials/:id', (req, res) => {
    const state = getDatabaseState();
    state.testimonials = state.testimonials.filter((t) => t.id !== req.params.id);
    saveDatabaseState(state);
    res.json({ state });
  });

  // 9. FAQs CRUD
  app.post('/api/faqs', (req, res) => {
    const state = getDatabaseState();
    const now = new Date().toISOString();
    const item: FaqItem = {
      id: `faq-${Date.now()}`,
      question: String(req.body.question || '').trim(),
      answer: String(req.body.answer || '').trim(),
      category: String(req.body.category || 'General'),
      sortOrder: Number(req.body.sortOrder ?? state.faqs.length + 1),
      isPublished: req.body.isPublished !== false,
      createdAt: now,
      updatedAt: now,
    };
    state.faqs.push(item);
    saveDatabaseState(state);
    res.status(201).json({ faq: item, state });
  });

  app.put('/api/faqs/:id', (req, res) => {
    const state = getDatabaseState();
    const idx = state.faqs.findIndex((f) => f.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'FAQ not found' });
    state.faqs[idx] = {
      ...state.faqs[idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDatabaseState(state);
    res.json({ faq: state.faqs[idx], state });
  });

  app.delete('/api/faqs/:id', (req, res) => {
    const state = getDatabaseState();
    state.faqs = state.faqs.filter((f) => f.id !== req.params.id);
    saveDatabaseState(state);
    res.json({ state });
  });

  // 10. Contact Messages CRUD
  app.post('/api/messages', (req, res) => {
    const state = getDatabaseState();
    const now = new Date().toISOString();
    const msg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: String(req.body.name || '').trim(),
      phone: String(req.body.phone || '').trim(),
      email: String(req.body.email || '').trim(),
      subject: String(req.body.subject || 'Website Contact Enquiry').trim(),
      message: String(req.body.message || '').trim(),
      status: 'Unread',
      createdAt: now,
      updatedAt: now,
    };
    state.messages.unshift(msg);
    saveDatabaseState(state);
    res.status(201).json({ message: msg, state });
  });

  app.put('/api/messages/:id', (req, res) => {
    const state = getDatabaseState();
    const idx = state.messages.findIndex((m) => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Message not found' });
    state.messages[idx] = {
      ...state.messages[idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDatabaseState(state);
    res.json({ message: state.messages[idx], state });
  });

  app.delete('/api/messages/:id', (req, res) => {
    const state = getDatabaseState();
    state.messages = state.messages.filter((m) => m.id !== req.params.id);
    saveDatabaseState(state);
    res.json({ state });
  });

  // 11. Business Settings & Homepage CMS Update
  app.put('/api/settings', (req, res) => {
    const state = getDatabaseState();
    state.settings = {
      ...state.settings,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDatabaseState(state);
    res.json({ settings: state.settings, state });
  });

  // 12. Reset Demo Data
  app.post('/api/reset', (_req, res) => {
    const fresh = structuredClone(INITIAL_DATABASE_STATE);
    saveDatabaseState(fresh);
    res.json({ state: fresh });
  });

  // =========================================================================
  // VITE MIDDLEWARE (DEV) OR STATIC SERVING (PROD)
  // =========================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shirsekar's Fitness Hub server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
