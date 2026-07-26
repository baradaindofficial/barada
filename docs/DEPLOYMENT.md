# Deployment Guide

**Barada Academy — Production Deployment Reference**
Last updated: July 2025

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [First Deployment](#2-first-deployment)
3. [Environment Variables](#3-environment-variables)
4. [Database Migrations](#4-database-migrations)
5. [Domain Configuration](#5-domain-configuration)
6. [Ongoing Deployments](#6-ongoing-deployments)
7. [Rollback Procedure](#7-rollback-procedure)
8. [Health Checks](#8-health-checks)
9. [Monitoring](#9-monitoring)

---

## 1. Prerequisites

Before deploying, ensure you have:

| Account | URL | Required for |
|---|---|---|
| Supabase | supabase.com | Database + Auth |
| Vercel | vercel.com | Hosting + CI/CD |
| GitHub | github.com | Source control |
| Domain registrar | (your registrar) | barada.in DNS |
| Razorpay | dashboard.razorpay.com | Certificate payments |
| Resend | resend.com | Transactional email |

Node.js ≥ 20.0.0 and npm ≥ 10.0.0 must be installed locally.

---

## 2. First Deployment

Follow these steps in exact order.

---

### Step 1 — Create Supabase project

1. Go to **supabase.com** → sign in → click **New project**
2. Configure:
   - **Name:** `barada-academy`
   - **Database password:** Generate a strong password (save it — you will need it for migrations)
   - **Region:** `ap-south-1` (Singapore — closest to India)
   - **Plan:** Free to start
3. Click **Create new project**
4. Wait approximately 2 minutes for provisioning (status: Active)
5. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`

**Verify:** Project shows "Active" status in the Supabase dashboard.

---

### Step 2 — Run database migrations

1. Go to **Supabase → SQL Editor → New query**
2. Run each migration in order:

**Migration 001 — Schema:**
- Paste contents of `supabase/migrations/001_initial_schema.sql`
- Click **Run**
- Expected: "Success. No rows returned."
- Verify: Table Editor shows 8 tables

**Migration 002 — RLS policies:**
- Paste contents of `supabase/migrations/002_rls_policies.sql`
- Click **Run**
- Expected: "Success. No rows returned."

**Migration 003 — Triggers:**
- Paste contents of `supabase/migrations/003_triggers.sql`
- Click **Run**
- Expected: "Success. No rows returned."

**Migration 004 — Certificate RLS fix:**
- Paste contents of `supabase/migrations/004_fix_certificate_rls.sql`
- Click **Run**
- Expected: "Success. No rows returned."

**Verify:** Go to Table Editor → `config_settings` → should contain 16 rows (platform config + lesson counts for all 10 courses).

---

### Step 3 — Configure Supabase Auth

1. **Authentication → URL Configuration:**
   - **Site URL:** `https://barada.in`
   - **Redirect URLs:** Add `https://barada.in/api/auth/callback`

2. **Authentication → Email Templates:**
   - **Confirm signup:** Update subject to `Confirm your Barada Academy account`
   - Update the body to reference Barada Academy

3. **Authentication → Providers:**
   - Ensure **Email** provider is enabled
   - OAuth providers (Google) — enable in Sprint 4

---

### Step 4 — Prepare local environment

```bash
# Clone or extract the project
cd barada-nextjs

# Copy env template
cp .env.local.example .env.local

# Fill in the Supabase values from Step 1
# NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
# SUPABASE_SERVICE_ROLE_KEY=eyJxxx
# NEXT_PUBLIC_APP_URL=http://localhost:3000

# Install dependencies
npm install

# Verify TypeScript compiles
npm run type-check
# Expected: no errors

# Start local dev server
npm run dev
# Open http://localhost:3000
```

**Local verification:**
- [ ] Homepage loads at `http://localhost:3000`
- [ ] `/register` creates an account (check Supabase → Authentication → Users)
- [ ] Verification email arrives in inbox
- [ ] `/login` with the registered credentials works
- [ ] `/dashboard` shows the learner's name

---

### Step 5 — Push to GitHub

```bash
# Initialise git (if not already done)
git init

# Stage all files (the .gitignore excludes .env.local)
git add .

# Verify .env.local is NOT staged
git status | grep ".env"
# Should show nothing — .env.local must not be committed

git commit -m "feat: Barada Academy v2.0.0 — Next.js 14 + Supabase production build"
git branch -M main

# Create a new private repository on GitHub named barada-academy
git remote add origin https://github.com/YOUR_USERNAME/barada-academy.git
git push -u origin main
```

---

### Step 6 — Deploy to Vercel

1. Go to **vercel.com** → **Add New Project**
2. Click **Import Git Repository** → select `barada-academy`
3. Framework detected as **Next.js** — leave build settings as-is
4. Click **Environment Variables** and add all variables (see Section 3)
5. Click **Deploy**
6. First build takes approximately 3 minutes
7. Note the `.vercel.app` preview URL

**Verify:** Open the preview URL — homepage should load correctly.

---

### Step 7 — Connect domain

1. Vercel → Project → **Settings → Domains**
2. Enter `barada.in` → click **Add**
3. Also add `www.barada.in` → configured to redirect to `barada.in`
4. Vercel shows the required DNS records:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

5. In your domain registrar (e.g. GoDaddy, Namecheap, Cloudflare):
   - Delete any existing `A`, `CNAME`, or `ALIAS` records for `@` and `www`
   - Add the records above
6. DNS propagation: typically 5–30 minutes; up to 48 hours
7. Vercel automatically provisions an SSL certificate via Let's Encrypt once DNS resolves

**Verify:** `https://barada.in` loads with a valid SSL certificate (padlock icon).

---

### Step 8 — Grant admin access

After registering your account on the live site:

```sql
-- Run in Supabase SQL Editor
INSERT INTO public.admin_users (learner_id, role)
SELECT learner_id, 'super_admin'
FROM public.learners
WHERE email = 'your-email@example.com';
```

---

### Step 9 — Post-deployment verification checklist

```
[ ] https://barada.in loads (not the old GitHub Pages version)
[ ] SSL certificate is valid
[ ] /register — creates a real account
[ ] Verification email arrives in inbox (check spam folder)
[ ] Click email link → redirects to /dashboard
[ ] /dashboard shows learner's name (not "there")
[ ] /dashboard without session → redirects to /login
[ ] /login with wrong password → shows error message
[ ] /login with correct credentials → dashboard
[ ] /learn/chatgpt-for-professionals/module-1/lesson-1 → loads without error
[ ] /academy → loads course listing
[ ] Browser dev tools → no console errors
[ ] Supabase → Table Editor → learners table has your row
[ ] Supabase → Table Editor → config_settings has 16 rows
[ ] Security headers visible: curl -I https://barada.in | grep -E "Strict-Transport|Content-Security"
```

---

## 3. Environment Variables

All variables must be set in **Vercel → Project → Settings → Environment Variables**.

Set scope to **Production** for secrets. Set scope to **All Environments** for public vars.

| Variable | Scope | Required | Where to get it |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | All | Yes | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | Yes | Supabase → Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Yes | Supabase → Settings → API → service_role key |
| `NEXT_PUBLIC_APP_URL` | All | Yes | `https://barada.in` in prod, `http://localhost:3000` in dev |
| `NEXT_PUBLIC_APP_NAME` | All | Yes | `Barada Academy` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | All | Yes | `G-313447218` |
| `NEXT_PUBLIC_CLARITY_ID` | All | Yes | `xhif5v51ml` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | All | Sprint 4 | Razorpay → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Production | Sprint 4 | Razorpay → Settings → API Keys |
| `RESEND_API_KEY` | Production | Sprint 4 | Resend → API Keys |
| `RESEND_FROM_EMAIL` | All | Sprint 4 | `academy@barada.in` |
| `RESEND_FROM_NAME` | All | Sprint 4 | `Barada Academy` |
| `NEXT_PUBLIC_CERT_PRICE_PAISE` | All | Sprint 4 | `29900` |
| `NEXT_PUBLIC_CERT_PRICE_DISPLAY` | All | Sprint 4 | `₹299` |
| `NEXT_TELEMETRY_DISABLED` | All | Recommended | `1` |

---

## 4. Database Migrations

### Applying a new migration

1. Write the migration file: `supabase/migrations/NNN_description.sql`
2. Test locally: `supabase db reset` (requires Supabase CLI)
3. Apply to production: Supabase → SQL Editor → paste → Run
4. Update `CHANGELOG.md`

### Migration ordering

Migrations must be applied in numeric order. Never skip a migration number. If a migration fails partway through, fix the issue and re-run — all statements use `IF NOT EXISTS` / `OR REPLACE` / `ON CONFLICT DO NOTHING` for idempotency.

### Supabase CLI (optional, for local development)

```bash
npm install -g supabase
supabase login
supabase init         # links to your Supabase project
supabase db pull      # pull remote schema to local
supabase db push      # push local migrations to remote
```

---

## 5. Domain Configuration

### DNS records (Vercel)

| Type | Name | Value | TTL |
|---|---|---|---|
| `A` | `@` | `76.76.21.21` | 3600 |
| `CNAME` | `www` | `cname.vercel-dns.com` | 3600 |

### Supabase custom domain (optional)

Supabase allows mapping a custom domain (e.g. `db.barada.in`) to your project. This is not required but improves branding and reduces dependency on Supabase's subdomain.

### Email domain verification (Resend)

For transactional emails from `academy@barada.in`:

1. Resend → Domains → Add Domain → enter `barada.in`
2. Add the required DNS records (TXT for SPF/DKIM, MX record)
3. Verify in Resend dashboard

---

## 6. Ongoing Deployments

### Automatic deployments

Every push to the `main` branch on GitHub triggers an automatic Vercel deployment:

```
git push origin main
→ Vercel build triggers
→ npm install → tsc → next build → deploy
→ New deployment live in ~3 minutes
```

### Preview deployments

Every pull request gets a unique preview URL (`branch-name.vercel.app`). Use these to review changes before merging to `main`.

### Deployment checklist for any release

```
[ ] npm run type-check — zero TypeScript errors
[ ] npm run lint — zero ESLint errors
[ ] New migration applied to production Supabase
[ ] Environment variables updated in Vercel if changed
[ ] CHANGELOG.md updated
[ ] git tag vX.Y.Z on the release commit
```

---

## 7. Rollback Procedure

### Rollback a Vercel deployment

```bash
# Via CLI
npx vercel rollback

# Via dashboard
Vercel → Project → Deployments → [previous deployment] → ... → Promote to Production
```

Rollback is instant — traffic switches to the previous build without a re-deploy.

### Rollback a database migration

SQL migrations cannot be automatically rolled back. Write a reverse migration:

```sql
-- Example: reverse 004_fix_certificate_rls.sql
-- Only if strictly necessary — security fixes should NOT be rolled back

drop function if exists public.verify_certificate(text);

-- Restore original policies
create policy "public: verify certificate by id"
  on public.certificates for select
  using (status = 'issued');
```

**Important:** Never roll back a security fix without understanding and accepting the security risk.

---

## 8. Health Checks

### Manual health check commands

```bash
# Check HTTP response and security headers
curl -I https://barada.in

# Verify SSL certificate
curl -v https://barada.in 2>&1 | grep "SSL certificate"

# Check response time from India
curl -o /dev/null -s -w "%{time_total}\n" https://barada.in
# Target: < 800ms for first meaningful paint

# Verify auth callback route exists
curl -I https://barada.in/api/auth/callback
# Expected: 302 (redirect) or 400 (missing code param) — NOT 404
```

### Automated monitoring (Sprint 4)

- **Vercel Analytics** — Core Web Vitals, real user monitoring
- **Sentry** — Error tracking and alerting
- **UptimeRobot** — Uptime monitoring with email/SMS alerts

---

## 9. Monitoring

### Vercel

- **Deployments** — build logs, deployment history
- **Analytics** — page views, performance, top routes
- **Functions** — API route invocations, errors, duration

### Supabase

- **Database** → **Performance** — slow queries, connection pool usage
- **Authentication** → **Users** — new registrations, last sign-in
- **Logs** — API request logs, auth events, DB errors

### Google Analytics

- **Events:** Page views, enrollment clicks, lesson completions (Sprint 4)
- **Dashboard:** GA4 → `G-313447218`

### Microsoft Clarity

- **Session recordings** — see exactly how users interact with the platform
- **Heatmaps** — identify UI friction points
- **Dashboard:** clarity.microsoft.com → `xhif5v51ml`
