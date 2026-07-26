# Changelog

All notable changes to Barada Academy are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [Unreleased]

Changes merged to `main` but not yet tagged as a release.

---

## [2.0.0] — Sprint 3 — Architecture Migration
*July 2025 — Not yet deployed*

Complete re-architecture from static GitHub Pages site to production-ready Next.js 14 application.

### Added

**Infrastructure**
- Next.js 14 App Router application with TypeScript strict mode
- Supabase integration: `@supabase/ssr` for cookie-based session management
- Vercel deployment configuration (`vercel.json`) with region `bom1` (Mumbai)
- Edge middleware (`middleware.ts`) for route protection
- Environment variable templates (`.env.local.example`, `.env.production.example`)
- ESLint configuration (`.eslintrc.json`) with `next/core-web-vitals` rules

**Database**
- Migration `001_initial_schema.sql`: 8 tables — learners, enrollments, lesson_progress, quiz_attempts, certificates, admin_users, config_settings, audit_logs
- Migration `002_rls_policies.sql`: Row Level Security on all tables, `is_admin()` helper function
- Migration `003_triggers.sql`: Auto-create learner on signup, enrollment progress recalculation, `updated_at` triggers, `get_learner_stats()` function

**Authentication**
- `app/(auth)/login/page.tsx` + `LoginForm.tsx`: Functional login with Supabase `signInWithPassword`
- `app/(auth)/register/page.tsx` + `RegisterForm.tsx`: Functional registration with email verification
- `app/api/auth/callback/route.ts`: OAuth and email verification callback handler
- `app/api/auth/signout/route.ts`: POST sign-out with redirect

**API Routes**
- `POST /api/enrollment`: Enroll authenticated learner in a course
- `POST /api/progress`: Mark a lesson complete

**Application**
- `app/layout.tsx`: Root layout with Poppins/Inter fonts, GA4, Clarity, AuthProvider
- `app/globals.css`: Tailwind base with CSS variables, focus-visible, skip-link
- `app/not-found.tsx`: Custom 404 page
- `app/error.tsx`: Global error boundary
- `app/(dashboard)/dashboard/page.tsx`: Server component with real DB data
- `app/(dashboard)/loading.tsx`: Loading skeleton for dashboard
- `app/(dashboard)/error.tsx`: Dashboard error boundary
- `context/AuthContext.tsx`: Client-side auth state provider
- `data/courses.ts`: All 10 courses with 145 lessons defined
- `lib/supabase/client.ts`: Browser Supabase client
- `lib/supabase/server.ts`: Server Supabase client + admin client
- `lib/db/learners.ts`: Learner CRUD functions
- `lib/db/enrollments.ts`: Enrollment operations
- `lib/db/progress.ts`: Lesson progress tracking

**Documentation**
- `docs/ARCHITECTURE.md`: System architecture, ADRs, data flow
- `docs/DATABASE.md`: Full schema reference, RLS, triggers, common queries
- `docs/API.md`: All API routes with request/response schemas
- `docs/SECURITY.md`: Security model, headers, resolved vulnerabilities
- `docs/DEPLOYMENT.md`: Step-by-step deployment guide
- `docs/ROADMAP.md`: Sprint history, upcoming features, long-term vision
- `docs/AI_CONTENT_PIPELINE.md`: Content generation workflow
- `docs/COURSE_STANDARDS.md`: Course quality and structure standards
- `docs/CONTRIBUTING.md`: Git workflow, code standards, PR process
- `docs/CHANGELOG.md`: This file

### Security (Pre-deployment audit)

*6 Critical + 8 High issues identified and fixed before any deployment.*

**Critical fixes**
- **[C1] Open redirect** (`api/auth/callback`): `?next=` parameter now validated by `sanitiseNext()` — only relative paths accepted
- **[C2] Missing sign-out route**: `POST /api/auth/signout` created
- **[C3] CommonJS `require()` in ESM**: Replaced with ES `import` in `lib/supabase/server.ts`
- **[C4] Missing Suspense boundary**: `useSearchParams()` in login/register wrapped in `<Suspense>` via page/form split
- **[C5] Middleware matcher conflict**: Removed broad `(.*)` catch-all; replaced with explicit route list
- **[C6] RLS certificate conflict** (`002_rls_policies.sql`): Two SELECT policies OR'd together allowed cross-user certificate reads — fixed in migration `004_fix_certificate_rls.sql`

**High fixes**
- **[H1]** AuthContext: `createClient()` called at component level causing infinite re-renders — fixed with `useRef()`
- **[H2]** `loadLearner` useCallback had unstable `supabase` dependency — fixed dependency array
- **[H3]** Form labels missing `htmlFor` on login and register — added `htmlFor`/`id` pairs
- **[H4]** Raw `<img>` tags in auth pages — replaced with `<Image>` from `next/image`
- **[H5]** No `error.tsx` files — added global and dashboard error boundaries
- **[H6]** No `loading.tsx` files — added dashboard loading skeleton
- **[H7]** No `Strict-Transport-Security` header — added with 2-year `max-age` and preload
- **[H8]** No `Content-Security-Policy` — added covering GA4, Clarity, Razorpay, YouTube, Supabase, Google Fonts

**Medium fixes**
- Removed unstable `typedRoutes` experimental flag from `next.config.ts`
- Added `reactStrictMode: true` and `poweredByHeader: false` to `next.config.ts`
- Added `engines` field to `package.json` (`node >= 20.0.0`)
- Added `NEXT_TELEMETRY_DISABLED=1` to env template
- Added ESLint configuration

**Database security**
- Migration `004_fix_certificate_rls.sql`: Drops conflicting policies on `certificates`; adds `verify_certificate(id)` SECURITY DEFINER function for public verification that returns only safe public fields

---

## [1.5.0] — Sprint 2.5 — Platform Stabilisation
*July 2025*

### Added
- Login page (HTML reference)
- Register page (HTML reference)
- Forgot password page (HTML reference)
- Email verification page (HTML reference)
- Student dashboard (HTML reference — dummy data)
- Course player (HTML reference — video placeholder)
- 4 lesson player pages for ChatGPT for Professionals (Module 1, L1–L4)
- Lesson player pages for Module 1 L1–L2 for all 10 courses
- Cookie consent banner on all pages (localStorage preference)
- Contact form with mailto fallback
- Sign-out API placeholder (HTML redirect)

### Fixed
- All 10 courses now marked as "Active" on Academy listing (removed "Coming Soon" treatment)
- Homepage: Barada parent brand — removed Academy branding from public homepage
- Ecosystem page: Complete rebuild with 7 platforms clearly shown
- Academy page: Two-section layout (Available Now / Coming Soon)
- Navigation: 8-item nav on homepage per spec (Home, Academy, Knowledge Centre, AI Tools, Services, Ecosystem, About, Contact)

---

## [1.0.0] — Sprint 2 — Academy UI
*July 2025*

### Added
- 10 flagship course pages (1 active, 9 coming soon)
- 157 lesson pages (module 1 + redirect pages for modules 2–4)
- 10 professional PowerPoint decks generated by pptxgenjs (avg 180KB each)
- Course player HTML reference with tabs (Overview, Transcript, Notes, Downloads)
- Learning paths page
- Certificate info page
- FAQ page
- Knowledge Centre (AI Tools, Prompt Library)
- About page with founder photos and credentials
- Services page
- Privacy Policy and Terms of Use
- GA4 (G-313447218) and Microsoft Clarity (xhif5v51ml) on all pages
- Sitemap.xml and robots.txt
- Custom 404 page
- PWA manifest.json
- .nojekyll for GitHub Pages

### Fixed
- All navigation links verified — zero 404s
- Barada logo / Barada Academy logo correctly assigned per page type
- Founder photos assigned to correct pages

---

## [0.1.0] — Sprint 0–1 — Foundation
*June 2025*

### Added
- Architecture Decision Records (ADRs 001–007)
- Database schema design (8 tables)
- Technology stack selection: Next.js 14, Supabase, Vercel, Razorpay, Resend
- Brand system: Red `#D11A1A`, Navy `#0D183D`, Gold `#D4AF37`
- Typography: Poppins (display) + Inter (body)
- Logo system: Barada parent (`3378.png`) + Barada Academy (`3418.png`)
- Static marketing site on GitHub Pages
- Homepage, About, Ecosystem, Services, Contact pages
- Google Alerts (~62 strings) for job search integration
- Social content calendar foundations

---

*This changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.*
*Dates represent sprint completion, not calendar dates of individual commits.*
