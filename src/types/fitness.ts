export type LeadStatus = 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  goal: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: LeadStatus;
  source: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type TrialStatus = 'Scheduled' | 'Attended' | 'Rescheduled' | 'Converted' | 'No-Show';

export interface TrialBooking {
  id: string;
  leadId?: string;
  name: string;
  phone: string;
  email: string;
  fitnessGoal: string;
  preferredDate: string;
  preferredTime: string;
  status: TrialStatus;
  trainerAssigned: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface FacilityItem {
  id: string;
  title: string;
  description: string;
  highlight: string;
  iconName: 'Dumbbell' | 'HeartPulse' | 'Flame' | 'UserCheck' | 'Users' | 'ShieldCheck';
  isActive: boolean;
}

export interface MembershipPlan {
  id: string;
  name: string;
  subtitle: string;
  price: string; // e.g. "Enquire for Rates" or admin-entered price
  duration: string;
  features: string[];
  discount: string;
  offer: string;
  ctaText: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  whoItsFor: string;
  imageUrl: string;
  trainer: string;
  duration: string;
  difficulty: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type GalleryCategory = 'Gym' | 'Equipment' | 'Training' | 'Community' | 'Exterior' | 'Videos';

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: GalleryCategory;
  imageUrl: string;
  videoUrl?: string;
  isFeatured: boolean;
  isRepresentative: boolean; // True for initial placeholder visuals until owner uploads actual gym photos
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  review: string;
  rating: number;
  photoUrl: string;
  reviewDate: string;
  sourceLabel: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Replied';
  createdAt: string;
  updatedAt: string;
}

export interface BusinessSettings {
  id: string;
  businessName: string;
  marathiName: string;
  managedBy: string;
  marathiManagedBy: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  openingHours: string;
  googleRating: string;
  googleReviewsCount: number;
  googleMapsLink: string;
  googleReviewsLink: string;
  plusCode: string;
  heroHeading: string;
  heroDescription: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroImage: string;
  aboutHeading: string;
  aboutDescription: string;
  facilities: FacilityItem[];
  seoTitle: string;
  seoDescription: string;
  googleAnalyticsId: string;
  metaPixelId: string;
  socialInstagram: string;
  socialFacebook: string;
  socialYoutube: string;
  updatedAt: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  lastLoginAt: string;
}

export interface AppDatabaseState {
  settings: BusinessSettings;
  leads: Lead[];
  trialBookings: TrialBooking[];
  memberships: MembershipPlan[];
  programs: TrainingProgram[];
  gallery: GalleryItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  messages: ContactMessage[];
  adminProfile: AdminProfile;
}
