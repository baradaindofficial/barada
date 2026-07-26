# Roadmap

**Barada Academy — Product & Engineering Roadmap**
Last updated: July 2025

---

## Table of Contents

1. [Vision](#1-vision)
2. [Sprint History](#2-sprint-history)
3. [Current State (Post-Sprint 3)](#3-current-state-post-sprint-3)
4. [Sprint 4 — LMS Foundation](#4-sprint-4--lms-foundation)
5. [Sprint 5 — Revenue & Certificates](#5-sprint-5--revenue--certificates)
6. [Sprint 6 — Content & Growth](#6-sprint-6--content--growth)
7. [Long-Term Vision (12–18 months)](#7-long-term-vision-1218-months)
8. [Backlog](#8-backlog)
9. [Principles](#9-principles)

---

## 1. Vision

Barada Academy is India's AI & Professional Excellence Platform. The vision is to make professional-grade AI and career skills education genuinely accessible — free to learn, affordable to certify, and immediately applicable to real work.

**North star metric:** Verified certificates issued per month.

**Target learner:** Working professional in India with 2–15 years of experience, wants to upskill in AI but cannot take a 3-month bootcamp. Has a computer. Uses LinkedIn.

---

## 2. Sprint History

| Sprint | Focus | Status |
|---|---|---|
| Sprint 0 | Architecture design, DB schema, ADRs | ✅ Complete |
| Sprint 1 | Static marketing site (GitHub Pages) | ✅ Complete |
| Sprint 2 | Academy UI — 10 courses, lesson pages, PPT decks | ✅ Complete |
| Sprint 2.5 | Platform stabilisation, auth pages, dashboard UI | ✅ Complete |
| Sprint 3 | **Next.js + Supabase + Vercel migration** | ✅ Complete — awaiting deployment |
| Sprint 3.5 | **Pre-deployment audit — 6 Critical + 8 High issues fixed** | ✅ Complete |

---

## 3. Current State (Post-Sprint 3)

### What is working

- ✅ Professional marketing site (7 public pages)
- ✅ Academy listing — all 10 courses shown as active
- ✅ All course detail pages with complete curriculum
- ✅ Lesson player pages (Module 1 for all 10 courses)
- ✅ All 10 PowerPoint decks downloadable
- ✅ 157 lesson HTML pages (zero 404s)
- ✅ Auth pages (Login, Register, Forgot Password, Verify Email) — HTML complete
- ✅ Student dashboard — HTML complete with skeleton data
- ✅ Next.js 14 App Router application — production-ready code
- ✅ Supabase schema — 8 tables, RLS, triggers — SQL ready to apply
- ✅ All 6 Critical security issues resolved
- ✅ All 8 High security issues resolved

### What requires deployment to become functional

- ⏳ User registration (Supabase Auth)
- ⏳ User login and session management
- ⏳ Real enrollment tracking
- ⏳ Real progress tracking
- ⏳ Dashboard showing actual learner data
- ⏳ Email verification

### What requires human production

- 🎬 Video lessons (recording + upload to YouTube)
- 🎙️ Audio voiceover (recording + upload as MP3)
- 📄 PDF course notes (writing + formatting)
- 🤖 Prompt packs (writing + PDF export)
- 📝 Assignments (writing + format)

---

## 4. Sprint 4 — LMS Foundation

**Goal:** A learner can register, enroll in a course, complete lessons, and see their progress — all with real database persistence.

**Prerequisite:** Vercel + Supabase deployment complete (verified via the checklist in `DEPLOYMENT.md`).

### Must-have (Sprint 4)

| Feature | Description | Files |
|---|---|---|
| Academy listing page (Next.js) | Convert `sprint2_academy.html` to Next.js RSC | `app/(academy)/academy/page.tsx` |
| Course detail page (Next.js) | Full course page with all sections from `COURSE_STANDARDS.md` | `app/(academy)/academy/courses/[slug]/page.tsx` |
| Lesson player (Next.js) | Full player with YouTube embed, progress marking | `app/(academy)/learn/[course]/[module]/[lesson]/page.tsx` |
| Enrollment flow | Click "Start Learning" → enroll → redirect to Lesson 1 | Uses existing `/api/enrollment` |
| Progress persistence | Mark lesson complete → save to DB → update progress bar | Uses existing `/api/progress` |
| Dashboard — real data | Replace skeleton with live enrollment + progress data | Update `app/(dashboard)/dashboard/page.tsx` |
| Quiz framework | 5 MCQs per course, instant feedback, score calculation | `app/api/quiz/route.ts` |
| Forgot password flow | Request reset email → Supabase sends link → update password | `app/(auth)/forgot-password/`, `reset-password/` |
| Verify email page | Functional confirmation screen with resend | `app/(auth)/verify-email/page.tsx` |
| Cookie consent | GDPR-compliant banner with localStorage preference | `components/CookieBanner.tsx` |

### Nice-to-have (Sprint 4)

- Dashboard sub-pages: My Courses, Progress, Bookmarks
- Learning paths page (Next.js)
- Certificate info page (Next.js)
- Contact form with Formspree
- Google OAuth login

---

## 5. Sprint 5 — Revenue & Certificates

**Goal:** A learner can pay ₹299, receive a verified certificate, and share it on LinkedIn.

### Must-have (Sprint 5)

| Feature | Description |
|---|---|
| Razorpay integration | Create order → Razorpay checkout → verify signature → confirm payment |
| Certificate generation | Generate PDF with certificate ID, QR code, learner name, course title |
| Certificate delivery | Send PDF via Resend email |
| Certificate verification page | Public `/verify/[id]` page using `verify_certificate()` function |
| Dashboard: Certificates | Show issued certificates with download + share buttons |
| Admin panel foundation | View learner list, enrollments, certificates. Issue/revoke certs manually |

### Nice-to-have (Sprint 5)

- LinkedIn share integration (pre-filled post with certificate image)
- WhatsApp share button for certificate
- Certificate preview before payment
- Bulk certificate operations for admin

---

## 6. Sprint 6 — Content & Growth

**Goal:** First cohort of learners completes a course and earns a certificate.

### Must-have (Sprint 6)

| Feature | Description |
|---|---|
| Video lessons (ChatGPT course) | Record and upload all 17 lessons of the active course |
| YouTube embed in player | Replace placeholder with actual YouTube iframes |
| PDF notes (ChatGPT course) | Module-level PDF summaries |
| Prompt packs (ChatGPT course) | 18 ready-to-use prompts as downloadable PDF |
| Email automation | Welcome email, lesson completion nudge, certificate email |
| Progress reminders | Email when learner has been inactive for 7 days |

### Nice-to-have (Sprint 6)

- Community forum or Discord integration
- Learner testimonials (collect on dashboard, display on marketing page)
- Course completion survey
- Referral program

---

## 7. Long-Term Vision (12–18 months)

| Quarter | Goal |
|---|---|
| Q3 2025 | Platform live. First 100 registered learners. First certificate issued. |
| Q4 2025 | 500 learners. ChatGPT course fully recorded. ₹299 revenue active. |
| Q1 2026 | 2,000 learners. 3 courses fully recorded. Admin panel operational. |
| Q2 2026 | 5,000 learners. All 10 courses recorded. Partner integrations. |
| Q3 2026 | 10,000 learners. Barada Academy brand recognized in India professional market. |

### Platform expansion

- **Live cohort sessions** — Monthly live sessions for enrolled learners (Zoom / Google Meet)
- **Corporate learning** — B2B offering for team upskilling (Partnerschaft synergy)
- **Barada Academy mobile app** — React Native, Sprint 8+
- **AI Course Factory** — Internal tooling to generate course curricula, quizzes, and scripts at scale (see `AI_CONTENT_PIPELINE.md`)
- **Instructor model** — Allow vetted external instructors to create courses on the platform

---

## 8. Backlog

Features researched and designed but not yet scheduled:

| Feature | Notes |
|---|---|
| CAPTCHA on registration | Cloudflare Turnstile — prevent bot signups |
| Nonce-based CSP | Replace `unsafe-inline` in Content-Security-Policy |
| Rate limiting | Vercel Edge Middleware + Upstash Redis |
| Supabase CLI in CI | Automated migration checks in GitHub Actions |
| Sentry error monitoring | Real-time error alerts + performance tracing |
| Offline support (PWA) | Service worker for lesson content caching |
| Dark mode | CSS variables already support it — needs UI toggle |
| Multi-language | Hindi UI for broader India reach (Sprint 9+) |
| Supabase Realtime | Live progress updates across devices |
| Custom email templates | React Email for branded transactional emails |

---

## 9. Principles

**Ship working software, not perfect software.** Each sprint must produce a deployable, testable increment.

**Security before features.** All Critical and High security issues are fixed before a feature is shipped to production.

**Data model first.** Schema changes are designed and reviewed before writing application code.

**Document as you build.** The docs directory is updated in the same sprint as the feature.

**One active course first.** Record and complete the ChatGPT course before starting the next. Depth over breadth.
