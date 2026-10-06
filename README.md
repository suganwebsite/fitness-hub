# SHIRSEKARS' FITNESS HUB — Website & Admin SaaS Portal

**Managed by Fit Mantras**  
*शिरसेकर्स' फिटनेस हब — मैनेज्ड बाय - फिट मंत्रास*

Mahatma Gandhi Vidyamandir, JL Shirshekar Marg, Government Colony, Bandra East, Mumbai, Maharashtra 400051  
Phone / WhatsApp: `077100 39324` (`+91 77100 39324`)

---

## 1. Architecture Overview

This application is a full-stack TypeScript web platform and conversion-optimized gym management system consisting of:

- **Frontend (`src/`)**: React 19 + TypeScript + Tailwind CSS v4 with a custom dark-mode athletic aesthetic (`Syne` display headings, `Plus Jakarta Sans` prose, `JetBrains Mono` tabular metrics).
- **Admin Dashboard (`/admin`)**: Full SaaS back-office supporting Lead CRM, Trial Bookings, Membership Plans, Training Programs, Facilities, Image Gallery, Authentic Reviews, FAQs, Contact Messages, and Business/SEO Settings.
- **Backend API (`server.ts` + `src/server/db.ts`)**: Express server with RESTful endpoints (`/api/state`, `/api/leads`, `/api/trials`, `/api/memberships`, `/api/programs`, `/api/gallery`, `/api/testimonials`, `/api/faqs`, `/api/messages`, `/api/settings`, `/api/auth/*`) backed by persistent JSON/file-system storage and relational SQL schema (`database/schema.sql`).

---

## 2. Installation & Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy environment configuration
cp .env.example .env

# 3. Start the full-stack server (Express + Vite on port 3000)
npm run dev
```

---

## 3. Environment Variables

Configure your `.env` file based on `.env.example`:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `ADMIN_DEFAULT_EMAIL` | Initial administrator login email | `admin@shirsekarsfitness.in` |
| `ADMIN_DEFAULT_PASSWORD` | Initial administrator password | `FitMantras@2026` |
| `JWT_SECRET` | Secret key used for signing admin session tokens | `replace_with_secure_jwt_secret_in_production` |
| `VITE_WHATSAPP_NUMBER` | Default WhatsApp business number (digits with country code) | `917710039324` |
| `VITE_GOOGLE_MAPS_URL` | Direct Google Maps directions URL | Bandra East location query |
| `VITE_GOOGLE_ANALYTICS_ID` | Optional GA4 Measurement ID (`G-XXXXXXXXXX`) | `""` |
| `VITE_META_PIXEL_ID` | Optional Meta Pixel ID | `""` |

---

## 4. Database Setup

- **Development & Self-Contained Deployment**: The server automatically initializes and persists all 10 collections (`admins`, `leads`, `trial_bookings`, `memberships`, `programs`, `gallery`, `testimonials`, `faqs`, `contact_messages`, `business_settings`) in `/data/fitness_hub_db.json`.
- **Relational SQL Migration**: Run `database/schema.sql` against PostgreSQL or SQLite to provision all tables, foreign keys, and indexes (`idx_leads_status`, `idx_trial_bookings_date`, `idx_memberships_active_sort`, etc.).

---

## 5. Admin Dashboard Setup & Usage

1. Navigate to **`/admin`** (or click **Admin Portal** in the top navigation or footer).
2. Sign in with the configured credentials (`admin@shirsekarsfitness.in` / `FitMantras@2026`) or use the one-click **Instant Manager Access** button in preview environments.
3. From **Profile & Security**, you can update your administrator name, email, phone number, or change your password.

---

## 6. How to Update Website Content Without Code

Every public section is dynamically driven by the Admin Dashboard:

- **Homepage Hero, About & Facilities**: Go to `/admin` → **Settings & CMS** → **Homepage & Facilities Content** to edit the hero headline, supporting copy, CTA button labels, about description, and facility cards.
- **Membership Plans & Pricing**: Go to `/admin` → **Memberships** to create or edit plans (`BASIC`, `STANDARD`, `PREMIUM`), set exact prices or keep `"Enquire for Rates"`, add seasonal promotional banners, toggle active visibility, or mark a plan as Featured.
- **Training Programs**: Go to `/admin` → **Programs** to edit descriptions, target audience (*Who it's for*), difficulty, coach assignment, and imagery.
- **Photo & Video Gallery**: Go to `/admin` → **Gallery** to upload real gym photographs (via local file upload/base64 or image URL), categorize them (`Gym`, `Equipment`, `Training`, `Community`, `Exterior`, `Videos`), reorder items, and toggle the *Representative Placeholder* notice off once real gym photos are uploaded.
- **FAQs & Reviews**: Go to `/admin` → **FAQs** or **Testimonials** to add, reorder, publish, or unpublish items.

---

## 7. Configuring WhatsApp, Google Maps & Analytics

- **WhatsApp Integration**: In `/admin` → **Settings & CMS**, update the **WhatsApp Number** field (e.g., `917710039324`). All contextual WhatsApp links across the Hero, Membership cards, Free Trial confirmation, Contact section, and Mobile Sticky Bar automatically update with pre-filled enquiry messages.
- **Google Maps & Reviews Links**: Update the **Google Maps Directions URL** and **Google Reviews URL** in `/admin` → **Settings & CMS**.
- **Analytics & Meta Pixel**: Enter your `Google Analytics ID (G-XXXX)` and `Meta Pixel ID` in `/admin` → **Settings & CMS** → **SEO & Analytics**.

---

## 8. Production Deployment

```bash
# Build optimized frontend bundle
npm run build

# Start production server on port 3000
npm start
```
