-- =============================================================================
-- SHIRSEKARS' FITNESS HUB (Managed by Fit Mantras)
-- Production Relational Database Schema (PostgreSQL / SQLite Compatible)
-- =============================================================================

-- 1. ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  role VARCHAR(64) NOT NULL DEFAULT 'Center Manager',
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(32),
  last_login_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- 2. LEADS TABLE
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(160),
  goal VARCHAR(120) NOT NULL,
  preferred_date VARCHAR(32),
  preferred_time VARCHAR(64),
  message TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'New', -- New | Contacted | Follow-up | Converted | Lost
  source VARCHAR(64) NOT NULL DEFAULT 'Free Trial Form',
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);

-- 3. TRIAL BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS trial_bookings (
  id VARCHAR(64) PRIMARY KEY,
  lead_id VARCHAR(64) REFERENCES leads(id) ON DELETE SET NULL,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(160),
  fitness_goal VARCHAR(120) NOT NULL,
  preferred_date VARCHAR(32) NOT NULL,
  preferred_time VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Scheduled', -- Scheduled | Attended | Rescheduled | Converted | No-Show
  trainer_assigned VARCHAR(120),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_trial_bookings_lead_id ON trial_bookings(lead_id);
CREATE INDEX IF NOT EXISTS idx_trial_bookings_date ON trial_bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_trial_bookings_status ON trial_bookings(status);

-- 4. MEMBERSHIPS TABLE
CREATE TABLE IF NOT EXISTS memberships (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  subtitle VARCHAR(200),
  price VARCHAR(64) NOT NULL DEFAULT 'Enquire for Rates',
  duration VARCHAR(64) NOT NULL DEFAULT 'Flexible Duration',
  features_json TEXT NOT NULL, -- JSON array of feature strings
  discount VARCHAR(100),
  offer VARCHAR(160),
  cta_text VARCHAR(64) NOT NULL DEFAULT 'ENQUIRE NOW',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_memberships_active_sort ON memberships(is_active, sort_order);

-- 5. PROGRAMS TABLE
CREATE TABLE IF NOT EXISTS programs (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  who_its_for VARCHAR(220) NOT NULL,
  image_url TEXT NOT NULL,
  trainer VARCHAR(120) NOT NULL DEFAULT 'Fit Mantras Coaching Team',
  duration VARCHAR(64) NOT NULL DEFAULT 'Ongoing / Custom',
  difficulty VARCHAR(64) NOT NULL DEFAULT 'All Levels',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_programs_active_sort ON programs(is_active, sort_order);

-- 6. GALLERY TABLE
CREATE TABLE IF NOT EXISTS gallery (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(140) NOT NULL,
  caption TEXT,
  category VARCHAR(64) NOT NULL, -- Gym | Equipment | Training | Community | Exterior | Videos
  image_url TEXT NOT NULL,
  video_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_representative BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_gallery_category_sort ON gallery(category, sort_order);

-- 7. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  review TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  photo_url TEXT,
  review_date VARCHAR(64) NOT NULL,
  source_label VARCHAR(80) NOT NULL DEFAULT 'Google Review Summary',
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published);

-- 8. FAQS TABLE
CREATE TABLE IF NOT EXISTS faqs (
  id VARCHAR(64) PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(64) NOT NULL DEFAULT 'General',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_faqs_published_sort ON faqs(is_published, sort_order);

-- 9. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS contact_messages (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(160),
  subject VARCHAR(160) NOT NULL DEFAULT 'Membership Enquiry',
  message TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Unread', -- Unread | Read | Replied
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);

-- 10. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS business_settings (
  id VARCHAR(64) PRIMARY KEY DEFAULT 'default',
  business_name VARCHAR(160) NOT NULL,
  marathi_name VARCHAR(160) NOT NULL,
  managed_by VARCHAR(120) NOT NULL,
  marathi_managed_by VARCHAR(160) NOT NULL,
  tagline VARCHAR(220) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  whatsapp VARCHAR(32) NOT NULL,
  email VARCHAR(160) NOT NULL,
  address TEXT NOT NULL,
  opening_hours VARCHAR(120) NOT NULL,
  google_rating VARCHAR(16) NOT NULL,
  google_reviews_count INTEGER NOT NULL,
  google_maps_link TEXT NOT NULL,
  google_reviews_link TEXT NOT NULL,
  plus_code VARCHAR(64) NOT NULL,
  hero_heading VARCHAR(180) NOT NULL,
  hero_description TEXT NOT NULL,
  hero_cta_primary VARCHAR(80) NOT NULL,
  hero_cta_secondary VARCHAR(80) NOT NULL,
  hero_image TEXT NOT NULL,
  about_heading VARCHAR(180) NOT NULL,
  about_description TEXT NOT NULL,
  facilities_json TEXT NOT NULL,
  seo_title VARCHAR(180) NOT NULL,
  seo_description TEXT NOT NULL,
  google_analytics_id VARCHAR(64),
  meta_pixel_id VARCHAR(64),
  social_instagram TEXT,
  social_facebook TEXT,
  social_youtube TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
