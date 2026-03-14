# UICSpacetime

**The official web platform for the Society of Physics Students (SPS) at the University of Illinois Chicago**, serving the dual Astronomy and Physics clubs with event management, membership tracking, galleries, announcements, and administrative tools.

Built with SvelteKit 5, TypeScript, Tailwind CSS, PostgreSQL, and Drizzle ORM.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Site Features Guide](#site-features-guide)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Scripts](#scripts)

---

## Overview

UICSpacetime is a full-stack web application designed for two university science clubs — **Astronomy** and **Physics** — operating under the Society of Physics Students at UIC. The platform provides:

- **Public-facing pages** for each club with unique visual identities (dark cosmic theme for Astronomy, clean light theme for Physics)
- **Member registration and dashboards** with email verification, RSVP tracking, and event check-in
- **Admin panels** with role-based access control for managing events, galleries, announcements, officers, and page content
- **Shared infrastructure** including an event calendar, RSVP system, QR-based check-in, and image hosting. 

---

## Features

### Member Management
- **Registration** with `@uic.edu` email validation
- **Email verification** via token-based flow (24-hour expiration)
- **Password reset** with secure one-time-use tokens (1-hour expiration)
- **Member profiles** with club memberships, academic year, major, and event preferences
- **Secondary email** — optional non-UIC backup email for alternative contact
- **Event interest preferences** — select from Stargazing, Lectures, Workshops, Social Events, Field Trips, Study Groups, Research, and Outreach during registration or on profile
- **Email opt-out** — members can opt out of event reminders and announcements while still receiving account security emails
- **Token-based unsubscribe** — one-click unsubscribe via unique per-member tokens in all event emails, with resubscribe option
- **Session management** with 30-day sliding window sessions

### Event System
- **Dual-club events** tagged as Astronomy or Physics
- **RSVP system** with going / maybe / not going statuses
- **QR code-based event check-in** with auto-generated 6-digit hex codes
- **Event capacity tracking** with max attendee limits
- **Draft/published states** for controlling event visibility
- **Interactive event calendar** with date filtering and club color coding
- **Predicted attendance** with reliability-weighted estimated turnout per event
- **Member reliability scores** — calculated from check-in history (check-ins / "going" RSVPs), color-coded green (>75%), orange (50-75%), red (<50%), gray (new members)
- **Historical turnout rate** per club averaged across past events
- **Email event announcements** — admins send targeted emails to eligible club members with duplicate prevention via announcement logs
- **Automated event reminders** — background scheduler sends 7-day and 1-day reminders to RSVP'd members with context-aware messaging

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
- **Event CRUD** with image upload, RSVP/attendance statistics, estimated turnout, reliability scores, sortable RSVP lists, and CSV export
- **Email announcement delivery** — send event announcements to eligible members with duplicate tracking; "Send to New Members" button for follow-up sends
- **Interest analytics** — bar charts of member event preferences with per-club breakdown and actionable insights
- **Member filtering by interest** — filter the member list by specific event interest preferences
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
3. Fill in your profile details — academic year, major, which clubs to join (Astronomy and/or Physics), and your event interest preferences (Stargazing, Lectures, Workshops, Social Events, Field Trips, Study Groups, Research, Outreach).

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
- Add an optional **secondary email** (non-UIC) as a backup contact method.
- Manage your club memberships (check/uncheck Astronomy or Physics).
- Update your event interest preferences to help the clubs plan events you care about.
- **Email Preferences** — toggle to opt out of event reminders and announcements. Account security emails (verification, password reset) are always sent regardless of this setting.

Click **Save** to apply your changes.

#### Email Unsubscribe (`/unsubscribe`)

Every event reminder and announcement email includes an unsubscribe link. Click it to open the unsubscribe page, where you can opt out of all event-related emails with one click. A resubscribe option is available if you change your mind. Account security emails (verification, password reset) are never affected by this setting. You can also manage this preference from your profile page.

#### Preference Review Reminders

If your event interest preferences have not been updated in over 4 months, the system will send you an email prompting you to review and update them. This helps the clubs plan events that align with current member interests. The email links directly to your profile page.

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
- **View statistics** — See RSVP counts (going / maybe / not going), check-in attendance, estimated turnout based on member reliability scores, and historical turnout rate for the club.
- **Reliability scores** — Each member in the RSVP list displays a color-coded reliability percentage (green >75%, orange 50-75%, red <50%, gray for new members) based on their check-in history.
- **RSVP list management** — Filter by status (going / maybe / not going), sort by name, status, or reliability score, and export the full list as a CSV file including reliability and check-in data.
- **Email announcements** — Send an event announcement email to all eligible members (verified, opted-in, belonging to the club, not yet notified). A confirmation dialog appears before sending. If the announcement was already sent, a "Send to New Members" button appears to notify only members who joined since the last send.
- **Delete** — Remove an event and its associated image.

Each event automatically gets a unique check-in code used to generate the QR code for in-person attendance.

#### Gallery Management (`/admin/astronomy/gallery` or `/admin/physics/gallery`)
Manage your club's photo gallery:
- **Upload** — Select an image file, add a caption and photographer credit. For astronomy images, you can also add observation metadata (coordinates, exposure time, equipment, sensor settings, observation date).
- **View** — See all gallery images with their metadata and dimensions.
- **Delete** — Remove an image from the gallery.

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
| **Runtime** | Node.js 22 |
| **Database** | PostgreSQL + Drizzle ORM |
| **CSS** | Tailwind CSS |

---

## Getting Started

### Prerequisites

- **Node.js** 22 or higher
- **PostgreSQL** database (local or hosted)

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

   Copy `.env.example` or create a `.env` file in the project root with the required variables (database URL, session secret, origin, etc.).

4. **Set up the database**

   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Dev** | `npm run dev` | Start development server with hot reload |
| **Build** | `npm run build` | Create production build |
| **Start** | `npm run start` | Start production server |
| **Preview** | `npm run preview` | Preview production build locally |
| **Check** | `npm run check` | Run `svelte-check` for type checking |
| **Lint** | `npm run lint` | Run ESLint + Prettier checks |
| **Format** | `npm run format` | Auto-format code with Prettier |
| **DB: Generate** | `npm run db:generate` | Generate Drizzle migrations from schema |
| **DB: Migrate** | `npm run db:migrate` | Apply pending database migrations |
| **DB: Seed** | `npm run db:seed` | Seed database with initial admin user |

---

## License

This project is maintained by the Society of Physics Students at the University of Illinois Chicago.
