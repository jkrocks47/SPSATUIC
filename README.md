# UICSpacetime

**The official web platform for the Society of Physics Students (SPS) at the University of Illinois Chicago**, serving the dual Astronomy and Physics clubs with event management, membership tracking, galleries, announcements, and administrative tools.

Built with SvelteKit 5, TypeScript, Tailwind CSS, PostgreSQL, and Drizzle ORM.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Site Features Guide](#site-features-guide)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Authentication & Authorization](#authentication--authorization)
- [Routes & Pages](#routes--pages)
- [Components](#components)
- [Styling & Theming](#styling--theming)
- [API Reference](#api-reference)
- [Admin Panel](#admin-panel)
- [Scripts](#scripts)
- [Deployment](#deployment)

---

## Overview

UICSpacetime is a full-stack web application designed for two university science clubs — **Astronomy** and **Physics** — operating under the Society of Physics Students at UIC. The platform provides:

- **Public-facing pages** for each club with unique visual identities (dark cosmic theme for Astronomy, clean light theme for Physics)
- **Member registration and dashboards** with email verification, RSVP tracking, and event check-in
- **Admin panels** with role-based access control for managing events, galleries, announcements, officers, and page content
- **Shared infrastructure** including an event calendar, RSVP system, QR-based check-in, and image hosting via Cloudinary

---

## Features

### Member Management
- **Registration** with `@uic.edu` email validation
- **Email verification** via token-based flow (24-hour expiration)
- **Password reset** with secure one-time-use tokens (1-hour expiration)
- **Member profiles** with club memberships, academic year, major, and event preferences
- **Session management** with 30-day sliding window sessions

### Event System
- **Dual-club events** tagged as Astronomy or Physics
- **RSVP system** with going / maybe / not going statuses
- **QR code-based event check-in** with auto-generated 6-digit hex codes
- **Event capacity tracking** with max attendee limits
- **Draft/published states** for controlling event visibility
- **Interactive event calendar** with date filtering and club color coding

### Gallery
- **Image uploads** via Cloudinary integration
- **Club-specific galleries** with captions, photographer credits, and dimensions
- **Admin management** for uploading, editing, and deleting images

### Announcements
- **Global or club-specific** announcements
- **Scheduling** with publish and expiration dates
- **Pinned announcements** displayed prominently
- **Automatic display** on member dashboards and club pages

### Admin Panel
- **Role-based access control** (super admin, astronomy admin, physics admin)
- **Member management** with search, filtering, role editing, and CSV export
- **Event CRUD** with image upload and RSVP/attendance statistics
- **Gallery management** with Cloudinary integration
- **Officer profiles** with bios, photos, and sort ordering
- **Page content editor** for club-specific sections
- **Announcement management** with create, delete, and pin toggle

### Visual Design
- **Astronomy theme**: Dark cosmic design with animated starfields, nebula backgrounds, parallax effects, HUD overlays, film grain, lunar phase visualizations, glassmorphism panels, and scanline effects
- **Physics theme**: Clean, bright design with geometric elements, atomic nucleus visualization, and minimal animations
- **Responsive design** with mobile-first approach and reduced motion support
- **Canvas-based animations** with intersection observer performance optimization

---

## Site Features Guide

### For Visitors (No Account Needed)

#### Landing Page (`/`)
The main entry point to the site. Features animated portal cards for both the Astronomy and Physics clubs, a shared event calendar showing upcoming events from both clubs, SPS mission and officer information, and contact links. Click a club portal card to enter that club's section of the site.

#### Astronomy Club Pages (`/astronomy/...`)
A dark, cosmic-themed section for the Astronomy Club with immersive visual effects (starfields, nebula backgrounds, parallax scrolling, HUD overlays).

- **Homepage** (`/astronomy`) — Overview of the club with a hero banner, announcement bar, event timeline, and gallery preview. Scroll down to explore upcoming events and recent photos.
- **About** (`/astronomy/about`) — Learn about the club's mission, meeting schedule, current officers (with photos and bios), and history.
- **Events** (`/astronomy/events`) — Browse all upcoming and past Astronomy events. Click any event to view full details including date, time, location, and description.
- **Gallery** (`/astronomy/gallery`) — View club photos in a masonry layout. Click any image to open a lightbox with the full-size photo, caption, photographer credit, and astronomical metadata (coordinates, exposure time, equipment used).
- **Board** (`/astronomy/board`) — Meet the current board members with their photos, positions, bios, and contact emails.
- **Contact** (`/astronomy/contact`) — Reach out to the club via the contact form.
- **Join** (`/astronomy/join`) — Information on how to become a member of the Astronomy Club.

#### Physics Club Pages (`/physics/...`)
A clean, light-themed section for the Physics Club with a bright design, geometric elements, and atomic visualizations. The page structure mirrors the Astronomy section:

- **Homepage** (`/physics`) — Club overview with hero, events preview grid, gallery preview, and about snippet.
- **About** (`/physics/about`) — Club mission, meetings, officers, and history.
- **Events** (`/physics/events`) — Browse all Physics events. Click any event for full details.
- **Gallery** (`/physics/gallery`) — View Physics club photos with lightbox.
- **Board** (`/physics/board`) — Current board member profiles.
- **Contact** (`/physics/contact`) — Contact form for the Physics Club.
- **Join** (`/physics/join`) — Membership information.

#### Shared Event Calendar
Located on the landing page, the interactive calendar displays events from both clubs with color-coded dots. Use the filter pills (All / Astronomy / Physics) to narrow results. Click a date to see events on that day, then click an event to view its detail page.

---

### For Members (Requires Registration)

#### Registration (`/register`)
Create an account in three steps:
1. Choose whether you are a new or returning member.
2. Enter your name, `@uic.edu` email address, and a password (minimum 8 characters).
3. Fill in your profile details — academic year, major, which clubs to join (Astronomy and/or Physics), and your event interest preferences (workshops, lectures, observing sessions, social events, etc.).

After registering, you will receive a verification email. You must verify your email before you can RSVP to events.

#### Email Verification (`/verify-email`)
After registration, check your UIC email inbox for a verification link. Click the link to verify your account. The link expires after 24 hours — if it expires, you can request a new one from the verification page.

#### Login & Password Reset
- **Login** (`/login`) — Enter your email and password to sign in. You will stay logged in for 30 days.
- **Forgot Password** (`/forgot-password`) — Enter your email to receive a password reset link. For security, a success message is always shown regardless of whether the email exists.
- **Reset Password** (`/reset-password`) — Click the link in your reset email to set a new password. The link expires after 1 hour and can only be used once.

#### Dashboard (`/dashboard`)
Your personal hub after logging in. The dashboard shows:
- A welcome greeting and quick links to your clubs.
- **Stats cards** — your club memberships, total events attended, and active member progress.
- **Upcoming RSVP'd events** — events you have RSVPed to, with the ability to change your RSVP status (going / maybe / not going) directly from the dashboard.
- **Recent check-ins** — events you have physically attended via QR code check-in.

If you haven't updated your preferences in a while, a review banner will appear prompting you to update.

#### Profile Management (`/dashboard/profile`)
Edit your personal information from the profile page:
- Update your first name, last name, academic year, and major.
- Manage your club memberships (check/uncheck Astronomy or Physics).
- Update your event interest preferences to help the clubs plan events you care about.

Click **Save** to apply your changes.

#### Browsing & RSVPing to Events
Navigate to any club's events page (`/astronomy/events` or `/physics/events`) and click an event to view its detail page. If you are logged in and your email is verified, you will see RSVP buttons at the bottom of the event detail. Choose **Going**, **Maybe**, or **Not Going** — your RSVP will appear on your dashboard. You can also manage RSVPs from `/dashboard/events`.

#### Event Check-In (`/checkin/[eventId]`)
At in-person events, scan the QR code provided at the venue with your phone. This will open the check-in page and automatically record your attendance. If you are not yet a member of the hosting club, you will be auto-enrolled. A confirmation message will show the event title and date.

#### Gallery Viewing
Visit the gallery on either club's page (`/astronomy/gallery` or `/physics/gallery`). Photos are displayed in a masonry grid. Click any image to open a full-screen lightbox showing the image at full resolution, along with the caption, photographer credit, and (for astronomy images) observation metadata like coordinates, exposure time, and equipment used. Close the lightbox by clicking outside the image or pressing Escape.

---

### For Admins

#### Admin Login & Dashboard (`/admin`)
Navigate to `/admin` and log in with your admin credentials. The admin dashboard shows:
- **Membership statistics** — total members, per-club breakdown, and how many members have set preferences.
- **Interest breakdown** — bar charts showing which event interests are most popular and how they split across clubs, with actionable insights (e.g., "plan more observing sessions").
- Quick links to club-specific admin sections.

Access is role-based: **Super Admins** can manage both clubs; **Astronomy Admins** and **Physics Admins** can only manage their respective club.

#### Member Management (`/admin/members`)
View all registered members in a searchable, filterable table:
- **Search** by name or email.
- **Filter** by club (Astronomy / Physics) or role (Board).
- **Filter by interest** to see which members prefer specific event types.
- **Promote/demote** members between "member" and "board" roles using the role dropdown.
- **Export** the full member list as a CSV file.
- Click a member's name to view their **detail page** (`/admin/members/[id]`), which shows their full RSVP history and event check-in records.

#### Event Management (`/admin/astronomy/events` or `/admin/physics/events`)
Create and manage events for your club:
- **Create** — Fill in the title, description, date, time, location (with optional map URL), upload an event image, set max capacity, and choose to publish immediately or save as a draft.
- **Edit** — Update any event detail. Toggle between draft and published state.
- **View statistics** — See RSVP counts (going / maybe / not going) and check-in attendance for each event.
- **Delete** — Remove an event (this also deletes the associated image from cloud storage).

Each event automatically gets a 6-digit hex check-in code used to generate the QR code for in-person attendance.

#### Gallery Management (`/admin/astronomy/gallery` or `/admin/physics/gallery`)
Manage your club's photo gallery:
- **Upload** — Select an image file, add a caption and photographer credit. For astronomy images, you can also add observation metadata (coordinates, exposure time, equipment, sensor settings, observation date).
- **View** — See all gallery images with their metadata and dimensions.
- **Delete** — Remove an image from both the database and cloud storage.

#### Announcement Management (`/admin/announcements`)
Create and manage announcements displayed on member dashboards and club pages:
- **Create** — Set a title, body text, and target audience (both clubs, astronomy only, or physics only). Optionally set a publish date and expiration date.
- **Pin/Unpin** — Toggle pin status to feature important announcements prominently at the top.
- **Delete** — Remove outdated announcements.

#### Officer Profile Management (`/admin/astronomy/officers` or `/admin/physics/officers`)
Manage the officer profiles displayed on club About and Board pages:
- **Create/Edit** — Set the officer's name, position, bio, email, upload a photo, assign an academic year, and set the display sort order.
- Officers appear on the club's About page and Board page automatically.

#### Page Content Editor (`/admin/astronomy/content` or `/admin/physics/content`)
Edit the static text content on club pages without touching code:
- Browse editable content sections by slug (e.g., `hero-title`, `hero-subtitle`, `about-subtitle`).
- Edit the title and body of each section. Markdown is supported for rich formatting.
- Adjust sort ordering to control how sections appear on the page.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | SvelteKit 2.0 + Svelte 5 |
| **Language** | TypeScript 5 |
| **Build Tool** | Vite 5 |
| **Runtime** | Node.js 22 |
| **Database** | PostgreSQL |
| **ORM** | Drizzle ORM 0.45.1 |
| **Migrations** | Drizzle Kit 0.31.9 |
| **CSS Framework** | Tailwind CSS 3.4.9 |
| **Password Hashing** | bcryptjs 3.0.3 |
| **Validation** | Zod 4.3.6 |
| **Email Service** | Resend 6.9.3 |
| **Image Storage** | Cloudinary 2.9.0 |
| **QR Codes** | qrcode 1.5.4 |
| **Markdown** | marked 17.0.4 |
| **HTML Sanitization** | sanitize-html 2.17.1 |
| **Linting** | ESLint 9 + typescript-eslint 8 |
| **Formatting** | Prettier 3.3.2 (Svelte + Tailwind plugins) |
| **Fonts** | Space Grotesk, Inter, JetBrains Mono, Fira Mono |

---

## Project Structure

```
src/
├── app.css                              # Global styles & Tailwind imports
├── app.d.ts                             # App type definitions (Locals interface)
├── app.html                             # HTML template
├── hooks.server.ts                      # Auth middleware & route protection
├── lib/
│   ├── components/
│   │   ├── admin/                       # Admin UI components
│   │   ├── astronomy/                   # Astronomy visual effect components
│   │   │   ├── AmbientParticles.svelte  # Canvas floating particle system
│   │   │   ├── AstronomyFooter.svelte   # Dark footer with barcode & coordinates
│   │   │   ├── AstronomyNav.svelte      # Frosted glass nav with glow effects
│   │   │   ├── DeepFieldGallery.svelte  # Masonry gallery with HUD overlays
│   │   │   ├── FilmGrain.svelte         # SVG film grain texture overlay
│   │   │   ├── GlassPanel.svelte        # Glassmorphism container
│   │   │   ├── HeroSection.svelte       # Parallax hero with constellations
│   │   │   ├── HorizonsTimeline.svelte  # Horizontal event timeline
│   │   │   ├── HUDOverlay.svelte        # Sci-fi coordinate overlay
│   │   │   ├── LunarPhaseViz.svelte     # Moon phase SVG visualization
│   │   │   ├── MouseParallax.svelte     # Mouse-tracking parallax wrapper
│   │   │   ├── NebulaBackground.svelte  # Animated morphing blob layer
│   │   │   ├── ScrollReveal.svelte      # Scroll-triggered animations
│   │   │   └── StarField.svelte         # Canvas starfield with shooting stars
│   │   ├── physics/                     # Physics-specific components
│   │   │   ├── PhysicsFooter.svelte     # Light three-column footer
│   │   │   ├── PhysicsHero.svelte       # Clean hero with atom visualization
│   │   │   └── PhysicsNav.svelte        # Light-themed navigation
│   │   └── shared/                      # Shared across clubs
│   │       ├── AnnouncementBanner.svelte # Themed announcement display
│   │       ├── EventCalendar.svelte     # Interactive calendar with filters
│   │       ├── RSVPButtons.svelte       # RSVP status buttons with API
│   │       └── SEO.svelte               # Meta tags & OG card management
│   ├── server/
│   │   ├── auth.ts                      # Session management & token utils
│   │   ├── cloudinary.ts               # Cloudinary upload integration
│   │   ├── email.ts                     # Resend email service & templates
│   │   └── db/
│   │       ├── index.ts                 # Database connection (pg Pool)
│   │       ├── schema.ts               # Drizzle ORM schema definitions
│   │       └── seed.ts                  # Database seeding script
│   ├── styles/
│   │   └── effects.css                  # Glass, glow, scan, HUD CSS effects
│   └── utils/
│       ├── constants.ts                 # Enums, roles, RBAC helpers
│       ├── dates.ts                     # Date formatting & calendar utils
│       └── validation.ts               # Zod schemas for all forms
├── routes/
│   ├── +layout.svelte                   # Root layout
│   ├── +page.svelte                     # Landing page with club portals
│   ├── +page.server.ts                  # Homepage data loader
│   ├── admin/                           # Admin panel (see Admin Panel section)
│   │   ├── +layout.svelte
│   │   ├── +page.server.ts              # Admin login action
│   │   ├── +page.svelte                 # Admin login page
│   │   ├── announcements/               # Announcement CRUD
│   │   ├── astronomy/                   # Astronomy admin
│   │   │   ├── events/                  # Event management
│   │   │   ├── gallery/                 # Gallery management
│   │   │   ├── officers/                # Officer profiles
│   │   │   └── content/                 # Page content editor
│   │   ├── members/                     # Member management
│   │   │   └── [id]/                    # Individual member detail
│   │   └── physics/                     # Physics admin (mirrors astronomy)
│   ├── api/                             # REST API endpoints
│   │   ├── events/                      # GET events
│   │   ├── gallery/                     # GET gallery images
│   │   └── member/
│   │       ├── logout/                  # POST logout
│   │       └── rsvp/                    # POST RSVP
│   ├── astronomy/                       # Astronomy public pages
│   │   ├── +layout.svelte               # Dark theme wrapper
│   │   ├── +page.svelte                 # Club homepage
│   │   ├── about/                       # Club info
│   │   ├── contact/                     # Contact form
│   │   ├── events/                      # Event listings
│   │   │   └── [id]/                    # Event detail
│   │   ├── gallery/                     # Photo gallery
│   │   └── join/                        # Join info
│   ├── checkin/[eventId]/               # QR code event check-in
│   ├── dashboard/                       # Member dashboard
│   │   ├── +layout.svelte
│   │   ├── +page.svelte                 # Overview
│   │   ├── events/                      # RSVP'd events
│   │   └── profile/                     # Profile management
│   ├── forgot-password/                 # Password reset request
│   ├── login/                           # Member login
│   ├── physics/                         # Physics public pages (mirrors astronomy)
│   ├── register/                        # Member registration
│   ├── reset-password/                  # Password reset completion
│   └── verify-email/                    # Email verification
drizzle/                                 # Database migrations
├── 0000_glorious_purifiers.sql          # Initial schema
├── 0001_minor_maginty.sql               # Member system additions
└── meta/                                # Migration metadata
```

---

## Getting Started

### Prerequisites

- **Node.js** 22 or higher
- **PostgreSQL** database (local or hosted)
- **Cloudinary** account (for image uploads)
- **Resend** account (for transactional emails)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/SPSATUIC.git
   cd SPSATUIC
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` or create a `.env` file in the project root (see [Environment Variables](#environment-variables) below).

4. **Set up the database**

   ```bash
   # Generate migration files (if schema changed)
   npm run db:generate

   # Run migrations to create tables
   npm run db:migrate

   # Seed the database with initial admin user and sample data
   npm run db:seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (e.g., `postgresql://user:password@localhost:5432/uicspacetime`) |
| `ADMIN_EMAIL` | Yes | Default admin account email for seeding |
| `ADMIN_PASSWORD` | Yes | Default admin account password for seeding |
| `SESSION_SECRET` | Yes | Hex-encoded secret for session token generation |
| `ORIGIN` | Yes | Application origin URL (e.g., `http://localhost:5173` for dev) |
| `PUBLIC_BASE_URL` | Yes | Public base URL used in email templates for links |
| `RESEND_API_KEY` | Yes | API key from [Resend](https://resend.com) for sending emails |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name for image uploads |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |

**Example `.env`:**

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/uicspacetime
ADMIN_EMAIL=admin@uic.edu
ADMIN_PASSWORD=securepassword123
SESSION_SECRET=a1b2c3d4e5f6...
ORIGIN=http://localhost:5173
PUBLIC_BASE_URL=http://localhost:5173
RESEND_API_KEY=re_xxxxxxxxxxxx
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Database

### Schema Overview

The database uses PostgreSQL with Drizzle ORM. The schema is defined in `src/lib/server/db/schema.ts`.

#### Enums

| Enum | Values |
|------|--------|
| `club_type` | `astronomy`, `physics` |
| `role` | `super_admin`, `astronomy_admin`, `physics_admin` |
| `member_role` | `member`, `board` |
| `rsvp_status` | `going`, `maybe`, `not_going` |

#### Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `users` | Admin accounts | `id`, `email`, `passwordHash`, `name`, `role` |
| `sessions` | Admin session tokens | `id`, `userId`, `expiresAt` |
| `members` | Club members | `id`, `email`, `firstName`, `lastName`, `displayName`, `role`, `emailVerified`, `astronomyMember`, `physicsMember`, `year`, `major`, `eventPreferences` |
| `memberSessions` | Member session tokens | `id`, `memberId`, `expiresAt` |
| `emailVerificationTokens` | Email verification tokens | `id`, `memberId`, `token`, `expiresAt` |
| `passwordResetTokens` | Password reset tokens | `id`, `memberId`, `token`, `expiresAt`, `usedAt` |
| `events` | Club events | `id`, `title`, `description`, `date`, `time`, `location`, `locationUrl`, `clubType`, `imageUrl`, `maxAttendees`, `checkinCode`, `isPublished`, `createdBy` |
| `eventRsvps` | Event RSVP records | `id`, `eventId`, `memberId`, `status` (unique on eventId+memberId) |
| `eventCheckins` | Event attendance records | `id`, `eventId`, `memberId`, `checkedInAt` (unique on eventId+memberId) |
| `announcements` | Club announcements | `id`, `title`, `body`, `clubType`, `isPinned`, `publishAt`, `expiresAt` |
| `galleryImages` | Gallery photos | `id`, `url`, `publicId`, `caption`, `clubType`, `photographer`, `width`, `height`, `uploadDate` |
| `pageContent` | Editable page sections | `id`, `slug`, `clubType`, `section`, `title`, `body`, `metadata`, `sortOrder` |
| `clubInfo` | Club information | `id`, `clubType` (unique), `aboutText`, `meetingInfo`, `contactEmail`, `socialLinks` |
| `officers` | Officer profiles | `id`, `clubType`, `name`, `position`, `imageUrl`, `email`, `bio`, `sortOrder`, `academicYear` |

### Migrations

Migrations are stored in the `drizzle/` directory:

- `0000_glorious_purifiers.sql` — Initial schema (users, sessions, events, gallery, officers, page content, club info)
- `0001_minor_maginty.sql` — Member system (members, member sessions, verification tokens, password reset tokens, announcements, RSVPs, check-ins)

### Commands

```bash
# Generate new migrations after schema changes
npm run db:generate

# Apply pending migrations
npm run db:migrate

# Seed database with initial admin user
npm run db:seed
```

---

## Authentication & Authorization

The platform uses a **two-tier authentication system** with separate user tables, sessions, and cookies for admins and members.

### Admin Authentication

| Property | Detail |
|----------|--------|
| **User table** | `users` |
| **Session table** | `sessions` |
| **Cookie name** | `session` |
| **Session duration** | 30 days (sliding window) |
| **Roles** | `super_admin`, `astronomy_admin`, `physics_admin` |
| **Login route** | `/admin` |
| **Protected routes** | `/admin/*` |

### Member Authentication

| Property | Detail |
|----------|--------|
| **User table** | `members` |
| **Session table** | `memberSessions` |
| **Cookie name** | `member_session` |
| **Session duration** | 30 days (sliding window) |
| **Roles** | `member`, `board` |
| **Login route** | `/login` |
| **Protected routes** | `/dashboard/*`, `/checkin/*`, `/api/member/*` |

### Authentication Flows

#### Registration Flow
1. User submits registration form with `@uic.edu` email, password, name, and club selections
2. Password is hashed with bcryptjs (12 salt rounds)
3. Member record created with `emailVerified: false`
4. 24-hour verification token generated and emailed via Resend
5. Session created immediately (limited access until verified)
6. User redirected to `/verify-email`

#### Email Verification Flow
1. User clicks verification link with token parameter
2. Token validated against database (must not be expired)
3. Member's `emailVerified` set to `true`
4. Full dashboard access granted

#### Password Reset Flow
1. User submits email on `/forgot-password`
2. System always returns success (prevents email enumeration)
3. If member exists, 1-hour reset token generated and emailed
4. User clicks link to `/reset-password?token=...`
5. Token validated (must not be expired or previously used)
6. Password updated, token marked as used via `usedAt` timestamp

#### Session Sliding Window
Sessions automatically extend when less than 50% of the duration remains. This means active users stay logged in without re-authenticating.

### Role-Based Access Control (RBAC)

The `canManageClub(role, club)` function in `src/lib/utils/constants.ts` enforces:

- **`super_admin`** — Full access to both Astronomy and Physics admin sections
- **`astronomy_admin`** — Access only to `/admin/astronomy/*`
- **`physics_admin`** — Access only to `/admin/physics/*`
- **All admins** — Access to `/admin/members` and `/admin/announcements`

Route protection is enforced in `src/hooks.server.ts` middleware.

---

## Routes & Pages

### Public Routes (No Authentication Required)

| Route | Description |
|-------|-------------|
| `/` | Landing page with animated club portal cards and shared event calendar |
| `/astronomy` | Astronomy club homepage with hero, timeline, and gallery |
| `/astronomy/about` | Club information and details |
| `/astronomy/events` | Astronomy event listings |
| `/astronomy/events/[id]` | Individual event detail page (requires member login) |
| `/astronomy/gallery` | Photo gallery with masonry layout |
| `/astronomy/contact` | Contact form |
| `/astronomy/join` | Club membership information |
| `/physics` | Physics club homepage with hero, events preview, and gallery |
| `/physics/about` | Club information |
| `/physics/events` | Physics event listings |
| `/physics/events/[id]` | Individual event detail page (requires member login) |
| `/physics/gallery` | Photo gallery |
| `/physics/contact` | Contact form |
| `/physics/join` | Club membership information |

### Authentication Routes

| Route | Description |
|-------|-------------|
| `/register` | Member registration (requires `@uic.edu` email) |
| `/login` | Member login |
| `/verify-email` | Email verification page |
| `/forgot-password` | Password reset request |
| `/reset-password` | Password reset completion (with token) |

### Member Routes (Authentication Required)

| Route | Description |
|-------|-------------|
| `/dashboard` | Member overview — upcoming events, announcements, attendance stats |
| `/dashboard/events` | Member's RSVP'd and attended events |
| `/dashboard/profile` | Profile editing — name, year, major, clubs, preferences |
| `/checkin/[eventId]` | QR code-based event check-in |

### Admin Routes (Admin Authentication Required)

| Route | Description |
|-------|-------------|
| `/admin` | Admin login page |
| `/admin/members` | Member list with search, filters, and CSV export |
| `/admin/members/[id]` | Individual member detail with check-in/RSVP history |
| `/admin/announcements` | Announcement management (create, delete, pin) |
| `/admin/astronomy` | Astronomy admin dashboard |
| `/admin/astronomy/events` | Astronomy event CRUD with RSVP/attendance stats |
| `/admin/astronomy/gallery` | Astronomy gallery management |
| `/admin/astronomy/officers` | Astronomy officer profile management |
| `/admin/astronomy/content` | Astronomy page content editor |
| `/admin/physics` | Physics admin dashboard |
| `/admin/physics/events` | Physics event CRUD |
| `/admin/physics/gallery` | Physics gallery management |
| `/admin/physics/officers` | Physics officer profile management |
| `/admin/physics/content` | Physics page content editor |

### API Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/events` | `GET` | None | Fetch published events (query: `club`, `limit`) |
| `/api/gallery` | `GET` | None | Fetch gallery images (query: `club`, `limit`, `offset`) |
| `/api/member/rsvp` | `POST` | Member | Create/update RSVP (body: `eventId`, `status`) |
| `/api/member/logout` | `POST` | Member | Destroy session and clear cookie |

---

## Components

### Astronomy Components (`src/lib/components/astronomy/`)

These components create the immersive dark cosmic visual identity for the Astronomy club.

| Component | Description |
|-----------|-------------|
| `StarField.svelte` | Canvas-based animated starfield with twinkling and shooting stars. Responsive star counts (80 mobile, 200 desktop). Uses IntersectionObserver for performance. |
| `NebulaBackground.svelte` | 8 morphing blob animations with configurable opacity. Mobile-optimized (3 blobs on small screens). Pure CSS animations. |
| `AmbientParticles.svelte` | Canvas particle system with configurable count, color, and speed. Includes wobble motion. Respects `prefers-reduced-motion`. |
| `HeroSection.svelte` | Full-screen hero with parallax scrolling, animated SVG constellations, coordinate readouts, crosshairs, and lunar phase visualization. 9 animated layers. |
| `MouseParallax.svelte` | Wrapper providing mouse-tracking parallax via CSS variables (`--mx`, `--my`). Disabled on touch devices. |
| `ScrollReveal.svelte` | IntersectionObserver-based scroll-triggered reveal animations with configurable threshold and delay. |
| `FilmGrain.svelte` | Fixed SVG film grain texture overlay at 6% opacity. |
| `LunarPhaseViz.svelte` | SVG circular visualization of 8 lunar phases with rotating orbit animation and illumination calculations. |
| `HUDOverlay.svelte` | Hover-activated overlay displaying coordinates, exposure time, equipment, and date. Cyan color scheme with scan animation. |
| `DeepFieldGallery.svelte` | CSS column masonry gallery. Featured image (index 0) has permanent HUD overlay; others show on hover. |
| `HorizonsTimeline.svelte` | Horizontal scrollable timeline with torn-edge SVG transitions, halftone image filters, and orbital path animations. |
| `GlassPanel.svelte` | Reusable glassmorphic container with optional indigo glow and backdrop blur. |
| `AstronomyNav.svelte` | Fixed navigation with frosted glass effect, scroll-activated glow, `+` separator links, and mobile hamburger menu. |
| `AstronomyFooter.svelte` | Dark footer with barcode SVG, concentric circle animations, coordinate display, and social links. |

### Physics Components (`src/lib/components/physics/`)

Clean, minimal components for the Physics club's light theme.

| Component | Description |
|-----------|-------------|
| `PhysicsHero.svelte` | Bright hero section with decorative circles, atomic nucleus visualization, CTA buttons, and floating dot animations. |
| `PhysicsNav.svelte` | Light-themed fixed navigation with translucent background and smooth scroll tracking. |
| `PhysicsFooter.svelte` | Light footer with three-column grid (about, contact, social), divider, and minimal branding. |

### Shared Components (`src/lib/components/shared/`)

Components used across both clubs and the main site.

| Component | Description |
|-----------|-------------|
| `EventCalendar.svelte` | Interactive calendar with mini navigation, filter pills (All/Astronomy/Physics), event list, date selection, and color-coded dots. Responsive 2-column layout. |
| `AnnouncementBanner.svelte` | Flexible announcement display with theme variants (dark/light), pin indicators, and auto-sorting of pinned items. |
| `RSVPButtons.svelte` | Interactive RSVP component with login prompt, email verification check, and three status buttons (going/maybe/not going) with color coding. Submits to `/api/member/rsvp`. |
| `SEO.svelte` | Meta tag management with Open Graph and Twitter card support. |

---

## Styling & Theming

### Fonts

| Font | Usage | Weights |
|------|-------|---------|
| **Space Grotesk** | Display headings | 400, 500, 700 |
| **Inter** | Body text | 400, 500, 600, 700 |
| **JetBrains Mono** | Monospace / code | 400, 500 |
| **Fira Mono** | Secondary mono | 400 |

### Custom Color Palette

Defined in `tailwind.config.ts`:

**Shared / SPS Branding:**
- `cosmos-black: #0a0a0f` — Deep black background
- `cosmos-navy: #0d1b2a` — Navy background
- `cosmos-midnight: #1b2838` — Midnight accent
- `sps-red: #CE1126` — SPS brand red
- `sps-redLight: #E63946` — Light red accent
- `sps-redDark: #9B0A1A` — Dark red accent
- `sps-cream: #f5f0e8` — Cream text/background
- `sps-muted: #8892A4` — Muted text

**Astronomy Theme (`astro-*`):**
- `astro-indigo: #4f46e5` — Primary indigo
- `astro-cyan: #22d3ee` — Cyan accent
- `astro-purple: #a855f7` — Purple accent
- `astro-lavender: #c4b5fd` — Lavender
- `astro-orange: #f97316` — Orange accent
- `astro-gold: #fbbf24` — Gold accent
- `astro-cream: #f5f0e8` — Cream text
- `astro-ember: #e85d26` — Ember accent

**Physics Theme (`physics-*`):**
- `physics-blue: #0e79b2` — Primary blue
- `physics-dark: #191923` — Dark text
- `physics-light: #fbfef9` — Light background
- `physics-accent: #2563eb` — Blue accent

### CSS Effects (`src/lib/styles/effects.css`)

| Class | Description |
|-------|-------------|
| `.glass-panel` | Frosted glass with blur 12px, saturate 180%, indigo border |
| `.glass-panel-light` | Lighter glass variant |
| `.glow-indigo` / `.glow-cyan` | Box shadow glow effects |
| `.glow-text-indigo` / `.glow-text-cyan` | Text shadow glow effects |
| `.scan-effect` | Horizontal sweep animation on hover |
| `.scan-lines-overlay` | Subtle repeating scanline pattern |
| `.grid-overlay` | Indigo pixel grid at 60x60px |
| `.chromatic-text` | Red/blue offset text shadows |
| `.frosted-nav` | Backdrop blur for navigation bars |
| `.pill-btn` | Rounded button with indigo border |
| `.ember-glow-hover` | Orange glow on hover |
| `.hud-bracket-*` | Corner bracket decorations with pulse |
| `.paper-texture` | Noise overlay for cream sections |
| `.film-grain-enhanced` | Fixed grain overlay |
| `.nav-link-hover` | Animated underline on hover |

### Custom Animations

Defined in `tailwind.config.ts` keyframes:

| Animation | Duration | Description |
|-----------|----------|-------------|
| `star-drift` | Various | Vertical star movement |
| `glow-pulse` | 3s | Opacity pulsing |
| `grain` | 0.5s | Film grain jitter |
| `scan-line` | 4s | Vertical sweep |
| `float` / `drift` | Various | Subtle floating motion |
| `nebula-drift` | 30s | Blob position animation |
| `nebula-morph` | 15s | Blob shape morphing |
| `pulse-glow` | 2s | Glow expansion |
| `hud-scan` | 3s | Horizontal scan line |
| `bracket-pulse` | 2s | Scale pulsing |
| `orbit-draw` | 2s | SVG stroke animation |
| `reveal-up` | 0.6s | Fade in with translate |
| `particle-float` | Various | Upward particle motion |
| `concentric-rotate` | 90s | Slow rotation |
| `radar-sweep` | 20s | Radar sweep rotation |
| `fade-in-up` | 0.8s | Entrance animation |

---

## API Reference

### GET `/api/events`

Fetch upcoming published events.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `club` | `astronomy` \| `physics` | — | Filter by club type |
| `limit` | `number` | `20` | Max results (capped at 50) |

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "title": "Star Party",
    "description": "...",
    "date": "2025-03-15",
    "time": "20:00",
    "location": "Roof Observatory",
    "locationUrl": "https://maps.google.com/...",
    "clubType": "astronomy",
    "imageUrl": "https://res.cloudinary.com/...",
    "maxAttendees": 50,
    "isPublished": true
  }
]
```

### GET `/api/gallery`

Fetch gallery images.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `club` | `astronomy` \| `physics` | — | Filter by club type |
| `limit` | `number` | `20` | Max results (capped at 50) |
| `offset` | `number` | `0` | Pagination offset |

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "url": "https://res.cloudinary.com/...",
    "caption": "Orion Nebula",
    "clubType": "astronomy",
    "photographer": "Jane Doe",
    "width": 1920,
    "height": 1080,
    "uploadDate": "2025-03-01T00:00:00.000Z"
  }
]
```

### POST `/api/member/rsvp`

Create or update an RSVP for an event.

**Authentication:** Required (member session + email verified)

**Request Body:**
```json
{
  "eventId": "uuid",
  "status": "going" | "maybe" | "not_going"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "status": "going"
}
```

**Error Responses:**
- `401` — Not authenticated
- `403` — Email not verified
- `400` — Invalid request body
- `404` — Event not found or unpublished

### POST `/api/member/logout`

Destroy the member session and clear the cookie.

**Authentication:** Required (member session)

**Response:** Redirect to `/login`

---

## Admin Panel

### Access

Navigate to `/admin` and log in with admin credentials. The initial admin account is created during database seeding using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.

### Features by Section

#### Members (`/admin/members`)
- **List view** with search by name/email, filter by club and role
- **Attendance counts** showing events attended per member
- **Role management** — promote members to board or back to member
- **CSV export** of member data
- **Detail view** (`/admin/members/[id]`) showing full check-in and RSVP history

#### Announcements (`/admin/announcements`)
- **Create** announcements with title, body, optional club type (global if none)
- **Schedule** with publish and expiration dates
- **Pin/unpin** important announcements
- **Delete** announcements

#### Events (`/admin/astronomy/events` or `/admin/physics/events`)
- **Create** events with title, description, date, time, location, image upload, capacity, and publish state
- **Edit** existing event details
- **Toggle publish** status (draft/published)
- **View statistics** — RSVP counts (going/maybe/not going) and check-in attendance
- **Delete** events (also removes image from Cloudinary)
- **Auto-generated** 6-digit hex check-in codes

#### Gallery (`/admin/astronomy/gallery` or `/admin/physics/gallery`)
- **Upload** images with caption and photographer credit
- **View** all gallery images for the club
- **Delete** images (removes from both database and Cloudinary)

#### Officers (`/admin/astronomy/officers` or `/admin/physics/officers`)
- **Manage** officer profiles with name, position, bio, email, photo, and sort order
- **Academic year** tracking for officer terms

#### Content (`/admin/astronomy/content` or `/admin/physics/content`)
- **Edit** page content sections by slug
- **Markdown support** for rich text content
- **Sort ordering** for section arrangement

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Dev** | `npm run dev` | Start development server with hot reload |
| **Build** | `npm run build` | Create production build |
| **Start** | `npm run start` | Start production server (`node build/index.js`) |
| **Preview** | `npm run preview` | Preview production build locally |
| **Check** | `npm run check` | Run `svelte-check` for type checking |
| **Check:watch** | `npm run check:watch` | Run type checking in watch mode |
| **Lint** | `npm run lint` | Run ESLint + Prettier checks |
| **Format** | `npm run format` | Auto-format code with Prettier |
| **DB: Generate** | `npm run db:generate` | Generate Drizzle migrations from schema |
| **DB: Migrate** | `npm run db:migrate` | Apply pending database migrations |
| **DB: Seed** | `npm run db:seed` | Seed database with initial admin user |

---

## Deployment

### Production Build

The application uses `@sveltejs/adapter-node` for deployment as a standalone Node.js server.

```bash
# Build for production
npm run build

# Start the production server
node build/index.js
```

### Requirements

- **Node.js 22** or higher
- **PostgreSQL** database accessible from the production environment
- **Environment variables** configured (see [Environment Variables](#environment-variables))
- **Cloudinary** account for image storage
- **Resend** account for email delivery

### Production Considerations

- **Cookies**: The session cookies use `sameSite: 'lax'`. Secure flag is applied based on `NODE_ENV`.
- **Database**: Uses `pg.Pool` for connection pooling. Ensure your PostgreSQL instance supports concurrent connections.
- **Email**: Transactional emails (verification, password reset) are sent via Resend. Configure `PUBLIC_BASE_URL` to match your production domain for correct email links.
- **Images**: All uploaded images are stored in Cloudinary under `uicspacetime/{club}/{type}` folder structure. Ensure sufficient Cloudinary quota.
- **ORIGIN**: Must be set to the production URL for CSRF protection and correct URL generation.

### Railway Deployment

This project was initially scaffolded for [Railway](https://railway.app). To deploy:

1. Connect your repository to Railway
2. Set all environment variables in the Railway dashboard
3. Railway will auto-detect the Node.js build and start commands

---

## License

This project is maintained by the Society of Physics Students at the University of Illinois Chicago.
