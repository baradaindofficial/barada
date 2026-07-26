# Architecture

**Barada Academy — Technical Architecture**
Last updated: July 2025 | Version: 2.0.0

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Tech Stack](#2-tech-stack)
3. [Application Structure](#3-application-structure)
4. [Data Flow](#4-data-flow)
5. [Authentication Architecture](#5-authentication-architecture)
6. [Deployment Architecture](#6-deployment-architecture)
7. [Architecture Decision Records](#7-architecture-decision-records)

---

## 1. System Overview

Barada Academy is a self-paced professional learning platform serving working professionals in India. The platform delivers AI and productivity courses, tracks learner progress, issues verified certificates, and processes certificate payments.

### Guiding principles

- **Server-first rendering** — content is rendered on the server; client JavaScript is minimal
- **Security by default** — every table has RLS; auth is validated server-side on every request
- **India-first infrastructure** — all services deployed in or near Mumbai (Vercel `bom1`, Supabase `ap-south-1`)
- **Incremental complexity** — features are added in discrete sprints; the system works at each stage

### High-level component map

```
┌─────────────────────────────────────────────────────────────────┐
│                        barada.in (DNS)                          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                    ┌───────────▼────────────┐
                    │   Vercel Edge Network  │
                    │   Region: bom1 (Mumbai)│
                    │   SSL: Auto-provisioned│
                    └───────────┬────────────┘
                                │
              ┌─────────────────▼──────────────────┐
              │         Next.js 14 Application      │
              │         (App Router + TypeScript)   │
              │                                     │
              │  ┌──────────┐  ┌───────────────┐   │
              │  │  Server  │  │    Client     │   │
              │  │Components│  │  Components   │   │
              │  │(RSC)     │  │  ('use client')│  │
              │  └────┬─────┘  └──────┬────────┘   │
              │       │               │             │
              │  ┌────▼───────────────▼──────────┐  │
              │  │       API Route Handlers       │  │
              │  │  /api/auth/callback            │  │
              │  │  /api/auth/signout             │  │
              │  │  /api/enrollment               │  │
              │  │  /api/progress                 │  │
              │  └────────────────┬───────────────┘  │
              └───────────────────┼──────────────────┘
                                  │
              ┌───────────────────▼──────────────────┐
              │              Supabase                 │
              │         Region: ap-south-1            │
              │                                       │
              │  ┌──────────────┐  ┌──────────────┐  │
              │  │  PostgreSQL  │  │    Auth      │  │
              │  │  (8 tables)  │  │  (email +    │  │
              │  │  RLS on all  │  │   OAuth)     │  │
              │  └──────────────┘  └──────────────┘  │
              └───────────────────────────────────────┘

External services (Sprint 4+):
  Razorpay  → Certificate payments (₹299)
  Resend    → Transactional email
  YouTube   → Lesson video hosting (unlisted)
```

---

## 2. Tech Stack

### Core framework

| Layer | Technology | Version | Reason |
|---|---|---|---|
| Framework | Next.js | 14.2.20 | App Router, RSC, edge middleware, TypeScript-native |
| Language | TypeScript | 5.6.x | Strict mode; catches DB shape errors at compile time |
| Styling | Tailwind CSS | 3.4.x | Utility-first; no CSS-in-JS overhead |
| Runtime | Node.js | ≥ 20.0.0 | Required by Next.js 14 |

### Backend / Data

| Layer | Technology | Reason |
|---|---|---|
| Database | Supabase (PostgreSQL 15) | Managed Postgres, built-in auth, RLS, real-time |
| Auth | Supabase Auth | Email/password + OAuth; session via cookies |
| ORM / Query | Supabase JS SDK v2 + raw SQL | Type-safe via generated `Database` types |
| Validation | Zod | Runtime schema validation on all API inputs |

### Infrastructure

| Layer | Technology | Reason |
|---|---|---|
| Hosting | Vercel | Serverless edge functions, automatic CI/CD from GitHub |
| Region | bom1 (Mumbai) | Lowest latency for India-primary audience |
| CDN | Vercel Edge Network | Static assets globally cached |
| DNS | Domain registrar → Vercel | CNAME + A record; automatic SSL |

### Payments & Email (Sprint 4)

| Service | Purpose |
|---|---|
| Razorpay | Certificate payment gateway (₹299); India-first, UPI + cards |
| Resend | Transactional email (verification, welcome, certificate delivery) |

### Analytics & Monitoring

| Service | ID | Purpose |
|---|---|---|
| Google Analytics 4 | G-313447218 | Page views, conversion events |
| Microsoft Clarity | xhif5v51ml | Session recordings, heatmaps |

---

## 3. Application Structure

```
barada-nextjs/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Route group: auth pages (no dashboard nav)
│   │   ├── layout.tsx          # Minimal layout — no top nav
│   │   ├── login/
│   │   │   ├── page.tsx        # Server component + Suspense wrapper
│   │   │   └── LoginForm.tsx   # Client component (owns useSearchParams)
│   │   ├── register/
│   │   │   ├── page.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── forgot-password/
│   │   ├── verify-email/
│   │   └── reset-password/
│   ├── (dashboard)/            # Route group: protected learner area
│   │   ├── layout.tsx          # Server-side auth check → redirect if unauthed
│   │   ├── loading.tsx         # Skeleton UI shown during data fetch
│   │   ├── error.tsx           # Error boundary with retry
│   │   └── dashboard/
│   │       └── page.tsx        # Async server component; fetches real DB data
│   ├── (academy)/              # Route group: public course pages (Sprint 4)
│   │   ├── academy/
│   │   ├── learn/[course]/[module]/[lesson]/
│   │   └── knowledge-centre/
│   ├── (admin)/                # Route group: admin panel (Sprint 4)
│   ├── (public)/               # Route group: marketing pages (Sprint 4)
│   ├── api/
│   │   ├── auth/
│   │   │   ├── callback/route.ts   # OAuth + email verification handler
│   │   │   └── signout/route.ts    # POST → sign out + redirect
│   │   ├── enrollment/route.ts     # POST → enroll learner in course
│   │   ├── progress/route.ts       # POST → mark lesson complete
│   │   ├── quiz/route.ts           # POST → submit quiz (Sprint 4)
│   │   └── certificates/route.ts   # POST → request certificate (Sprint 4)
│   ├── error.tsx               # Global error boundary
│   ├── not-found.tsx           # Custom 404 page
│   ├── globals.css             # Tailwind base + CSS variables
│   └── layout.tsx              # Root layout (fonts, GA, Clarity, AuthProvider)
│
├── components/                 # Reusable UI (Sprint 4)
├── context/
│   └── AuthContext.tsx         # Client-side auth state provider
├── data/
│   └── courses.ts              # Static course data (all 10 courses + 145 lessons)
├── docs/                       # ← This directory
├── hooks/                      # Custom React hooks (Sprint 4)
├── lib/
│   ├── db/
│   │   ├── learners.ts         # Learner CRUD
│   │   ├── enrollments.ts      # Enrollment operations
│   │   └── progress.ts         # Lesson progress tracking
│   └── supabase/
│       ├── client.ts           # Browser client (createBrowserClient)
│       └── server.ts           # Server client + admin client
├── middleware.ts               # Edge: route protection, session refresh
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       ├── 002_rls_policies.sql
│       ├── 003_triggers.sql
│       └── 004_fix_certificate_rls.sql  # Security fix
├── types/
│   ├── database.ts             # Supabase schema types (auto-gen target)
│   └── index.ts                # Application types
├── .env.local.example          # Required env vars with source instructions
├── .eslintrc.json
├── middleware.ts
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── vercel.json
```

### Route group pattern

Next.js route groups `(name)` allow shared layouts without affecting the URL. Barada uses four:

| Group | URL prefix | Layout | Protection |
|---|---|---|---|
| `(auth)` | `/login`, `/register`, etc. | Minimal (no nav) | Redirect to `/dashboard` if already authed |
| `(dashboard)` | `/dashboard/*` | Dashboard sidebar | Requires auth; redirect to `/login` if not |
| `(academy)` | `/academy/*`, `/learn/*` | Academy nav | `/learn/*` requires auth |
| `(admin)` | `/admin/*` | Admin layout | Requires auth + admin role |
| `(public)` | `/`, `/about/`, etc. | Full marketing nav | Public |

---

## 4. Data Flow

### Enrollment flow

```
Visitor clicks "Start Learning Free"
    │
    ▼
/academy/courses/[slug]         (public Server Component)
    │
    ▼
/login?next=/learn/[slug]/...   (unauthenticated → middleware redirect)
    │
    ▼
LoginForm.tsx                   (Client Component)
  supabase.auth.signInWithPassword()
    │
    ├── Error → show error message, stay on login
    │
    └── Success → router.push(next)
          │
          ▼
    middleware.ts reads session cookie
    getUser() validates JWT with Supabase servers
          │
          ▼
    /dashboard                  (protected Server Component)
    getLearnerEnrollments(userId) → []
          │
          ▼
    User clicks "Enroll" on course card
    POST /api/enrollment { courseSlug }
          │
          ├── isEnrolled() → already_enrolled → redirect to /learn/...
          │
          └── enrollLearner() → INSERT into enrollments
                │
                ▼
          POST /api/progress { courseSlug, moduleNumber: 1, lessonNumber: 1 }
          markLessonComplete() → UPSERT lesson_progress
          trigger fires → UPDATE enrollments SET completion_percentage
                │
                ▼
          /learn/[slug]/module-1/lesson-1
          Video player + lesson content
```

### Session refresh pattern

```
Browser makes request
    │
    ▼
middleware.ts (runs at edge)
  createServerClient() with cookie adapter
  supabase.auth.getUser()   ← validates JWT with Supabase
    │
    ├── Valid session → attach refreshed cookies to response → Next.js renders page
    │
    └── Invalid/expired → redirect to /login
```

The middleware calls `getUser()` (not `getSession()`). `getUser()` makes a network call to Supabase to validate the JWT — it cannot be spoofed by a client manipulating cookies. `getSession()` only reads the local cookie and is not safe for auth decisions.

---

## 5. Authentication Architecture

### Session storage

Sessions are stored in **HTTP-only cookies** managed by `@supabase/ssr`. The browser never has direct access to the JWT — it is read server-side in middleware and Server Components.

### Auth state propagation

```
Server (middleware/Server Components)
  └── createServerClient() → reads cookies → getUser() → validates with Supabase

Client (Client Components)
  └── AuthProvider (AuthContext.tsx)
        └── supabase.auth.onAuthStateChange() → updates React state
              Uses a stable client instance (useRef) — never recreated on render
```

### Auth flows

| Flow | Entry | Steps |
|---|---|---|
| Email registration | `/register` | SignUp → Supabase sends verification email → click link → `/api/auth/callback` → session created → trigger creates `learners` row → `/dashboard` |
| Email login | `/login` | signInWithPassword → session cookie set → `/dashboard` |
| Sign-out | Dashboard form | `POST /api/auth/signout` → `supabase.auth.signOut()` → redirect to `/` |
| Password reset | `/forgot-password` | Supabase sends reset email → click link → `/reset-password` → update password |
| OAuth (Sprint 4) | `/login` | signInWithOAuth (Google) → Supabase OAuth redirect → `/api/auth/callback` |

### Role model

| Role | How assigned | Capabilities |
|---|---|---|
| Learner | Auto-created on signup | Enroll, learn, track progress, earn certificates |
| Admin | Manual SQL INSERT into `admin_users` | All learner capabilities + admin panel |
| Super admin | `admin_users.role = 'super_admin'` | All capabilities + manage other admins |

---

## 6. Deployment Architecture

```
GitHub (main branch)
    │
    │ git push triggers
    ▼
Vercel Build Pipeline
    ├── npm install
    ├── tsc --noEmit          (TypeScript check)
    ├── next build            (production build)
    └── Deploy to edge network
          │
          ├── Mumbai (bom1)   ← primary
          └── Global CDN      ← static assets

barada.in DNS
    ├── A     @ → 76.76.21.21        (Vercel)
    └── CNAME www → cname.vercel-dns.com
```

### Environment separation

| Environment | URL | Supabase project | Branch |
|---|---|---|---|
| Production | barada.in | `barada-academy` (prod) | `main` |
| Preview | `*.vercel.app` | `barada-academy` (prod) | any PR branch |
| Development | localhost:3000 | local or prod with read-only key | local |

---

## 7. Architecture Decision Records

### ADR-001: Next.js App Router over Pages Router

**Decision:** Use App Router (introduced stable in Next.js 13.4).
**Reason:** Server Components reduce JavaScript sent to the browser; layouts enable persistent UI across navigations; async server-side data fetching eliminates prop-drilling from `getServerSideProps`.
**Trade-off:** Steeper learning curve; some libraries not yet App Router compatible.

### ADR-002: Supabase over Firebase / PlanetScale

**Decision:** Supabase for database + auth.
**Reason:** PostgreSQL (vs Firestore's document model) fits relational LMS data; RLS provides row-level security without application-layer enforcement; built-in auth removes a dependency; generous free tier; `ap-south-1` region serves India.
**Trade-off:** Supabase free tier has 500MB storage and 50,000 MAU limit — sufficient for launch; upgrade to Pro ($25/mo) when exceeded.

### ADR-003: `@supabase/ssr` over custom session handling

**Decision:** Use `@supabase/ssr` for both browser and server Supabase clients.
**Reason:** The library handles cookie serialisation/deserialisation correctly in Next.js 14's Server Components, Route Handlers, and middleware. Avoids the `cookies()` import footgun where Server Component clients cannot set cookies.
**Trade-off:** Adds a dependency; must follow the documented client separation pattern strictly.

### ADR-004: Static course data in `data/courses.ts` over CMS table

**Decision:** Store course metadata (titles, modules, lessons) as TypeScript constants rather than in a database table.
**Reason:** Course structure changes infrequently; TypeScript constants are type-safe and zero-latency; no CMS admin UI needed at this stage.
**Migration path:** When course creation is delegated to content editors, migrate to a `courses` Supabase table and build an admin UI. The `data/courses.ts` shape maps directly to the planned schema.

### ADR-005: Razorpay for payments

**Decision:** Use Razorpay over Stripe.
**Reason:** Razorpay is India-regulated and supports INR natively, UPI, NetBanking, and all major Indian card networks. No currency conversion fees. Stripe's India support requires additional KYC and has higher fees for domestic transactions.
**Trade-off:** Less international reach — acceptable given India-primary audience.

### ADR-006: Resend over SendGrid for transactional email

**Decision:** Use Resend over SendGrid / Mailchimp.
**Reason:** Developer-first API; generous free tier (3,000 emails/month); React Email integration for template design; straightforward domain verification.

### ADR-007: YouTube (unlisted) for video hosting

**Decision:** Host lesson videos on YouTube as unlisted videos, embedded in the lesson player.
**Reason:** Zero hosting cost; global CDN; adaptive bitrate streaming handled automatically; captions auto-generated; no encoding pipeline to maintain.
**Trade-off:** Dependency on YouTube; unlisted videos can be shared if URLs are extracted. Mitigation: Supabase-protected lesson pages require authentication before the video ID is rendered.
**Future option:** Migrate to Mux or Cloudflare Stream for DRM-level protection when course content is commercially sensitive.
