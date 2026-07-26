# Security

**Barada Academy — Security Model & Practices**
Last updated: July 2025

---

## Table of Contents

1. [Security Model](#1-security-model)
2. [Authentication Security](#2-authentication-security)
3. [Database Security (RLS)](#3-database-security-rls)
4. [API Security](#4-api-security)
5. [HTTP Security Headers](#5-http-security-headers)
6. [Secrets Management](#6-secrets-management)
7. [Resolved Vulnerabilities](#7-resolved-vulnerabilities)
8. [Known Limitations](#8-known-limitations)
9. [Reporting a Vulnerability](#9-reporting-a-vulnerability)
10. [Incident Response](#10-incident-response)

---

## 1. Security Model

Barada Academy uses a **defence-in-depth** model with four independent layers:

```
Layer 1: HTTP Headers (browser enforcement)
  CSP, HSTS, X-Frame-Options, X-Content-Type-Options

Layer 2: Edge Middleware (route protection)
  middleware.ts validates every request to /dashboard, /learn, /admin
  Uses getUser() — validated server-side against Supabase, not just cookie read

Layer 3: Server-side Auth Check (per page)
  Every protected Server Component calls supabase.auth.getUser()
  Double protection: middleware + page-level guard

Layer 4: Database RLS (data access)
  Every table has RLS enabled
  Default: DENY — no policy match means no access
  Users can only read and write their own rows
```

A vulnerability in one layer does not expose data — the next layer catches it.

---

## 2. Authentication Security

### Session management

- Sessions are stored in **HTTP-only cookies** managed by Supabase Auth via `@supabase/ssr`
- The browser never sees the JWT directly — it is only readable server-side
- Session expiry is configured in Supabase (default: 1 hour access token, 7-day refresh)
- `supabase.auth.getUser()` is used — not `getSession()` — because `getUser()` validates the JWT with Supabase's servers, making it impossible to spoof via cookie manipulation

### Why `getUser()` over `getSession()`

```typescript
// ❌ Insecure — reads cookie without server validation
const { data } = await supabase.auth.getSession()

// ✅ Secure — validates JWT with Supabase Auth servers
const { data: { user } } = await supabase.auth.getUser()
```

`getSession()` only reads the local cookie. A malicious user who can write cookies (e.g. via XSS) could forge a session. `getUser()` makes a server-to-server call that cannot be bypassed.

### Password policy

Enforced by Supabase Auth:
- Minimum 8 characters (also enforced client-side)
- Supabase bcrypt hashing (cost factor 10) — passwords are never stored in plain text

### Email verification

All new registrations require email verification before the account is fully active. Supabase sends a signed verification link that expires after 1 hour. The link is single-use.

### Redirect validation (open redirect prevention)

The `next` parameter accepted by `/api/auth/callback` is validated by `sanitiseNext()`:

```typescript
function sanitiseNext(raw: string | null): string {
  if (!raw) return '/dashboard'
  if (raw.startsWith('/') && !raw.includes('://') && !raw.startsWith('//')) {
    return raw.replace(/\/+/g, '/').slice(0, 200)
  }
  return '/dashboard'
}
```

This prevents `?next=https://evil.com` attacks where an attacker crafts a link that redirects users to a malicious site after authentication.

---

## 3. Database Security (RLS)

### Principles

- **Default DENY**: RLS is enabled on all tables. If no policy matches a query, the row is invisible to the requester
- **Learner isolation**: Every SELECT/INSERT/UPDATE policy checks `learner_id = auth.uid()` — learners can never access another learner's data
- **Admin elevation**: The `is_admin()` helper function grants admin-level SELECT on specific tables. It uses `SECURITY DEFINER` to query `admin_users` safely
- **Immutable quiz attempts**: There is no UPDATE policy on `quiz_attempts` — once submitted, a score cannot be changed

### Certificate security

**Fixed vulnerability (migration 004):** The original implementation had two overlapping SELECT policies on `public.certificates`:
1. `learner: read own certificates` — `learner_id = auth.uid()`
2. `public: verify certificate by id` — `status = 'issued'`

PostgreSQL ORs permissive policies. An authenticated learner satisfied their own policy and could then use the broader condition to read all issued certificates belonging to other learners.

**Fix:** Replaced the public SELECT policy with a `SECURITY DEFINER` function `verify_certificate(id)` that returns only safe public fields (`certificate_id`, `learner_name`, `course_title`, `issued_at`, `status`) for a specific certificate. The learner's PII (`learner_id`, `email`, `payment_id`) is never returned.

### Service role key

The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS entirely. It is:
- Never stored in `NEXT_PUBLIC_*` environment variables
- Never imported into Client Components or page components
- Only used in the `createAdminClient()` function in `lib/supabase/server.ts`
- Only called from server-side Route Handlers with explicit admin role checks

---

## 4. API Security

### Input validation

All API routes validate the request body using **Zod schemas** before any database operation:

```typescript
const EnrollSchema = z.object({
  courseSlug: z.string().min(1).max(100)
})
const parsed = EnrollSchema.safeParse(body)
if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
```

### Course slug validation

The `/api/progress` route validates that the submitted `courseSlug` exists in `data/courses.ts` before writing to the database. This prevents junk data from being inserted and ensures the progress trigger has valid course data to work with.

### Authentication check pattern

Every protected Route Handler follows this pattern:

```typescript
const { data: { user }, error: authError } = await supabase.auth.getUser()
if (authError || !user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
// ... proceed with authorised operation
```

The auth check always happens before any body parsing or DB query.

### Error messages

API errors never leak stack traces, SQL error messages, or internal implementation details to clients. Errors are logged server-side via `console.error()` and a generic message is returned.

---

## 5. HTTP Security Headers

Configured in `vercel.json` and applied to all routes:

| Header | Value | Purpose |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years; prevents SSL stripping |
| `Content-Security-Policy` | See below | Prevents XSS by declaring allowed content sources |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing attacks |
| `X-Frame-Options` | `SAMEORIGIN` | Prevents clickjacking (Barada pages cannot be iframed by other sites) |
| `X-XSS-Protection` | `1; mode=block` | Legacy browser XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referer information sent to third parties |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(self)` | Disables browser features not needed by the platform |

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline'
  https://www.googletagmanager.com
  https://www.clarity.ms
  https://checkout.razorpay.com;
style-src 'self' 'unsafe-inline'
  https://fonts.googleapis.com;
font-src 'self'
  https://fonts.gstatic.com;
img-src 'self' data:
  https://*.supabase.co
  https://img.youtube.com;
connect-src 'self'
  https://*.supabase.co
  https://www.google-analytics.com
  https://r.clarity.ms;
frame-src
  https://checkout.razorpay.com
  https://www.youtube.com;
object-src 'none';
base-uri 'self';
form-action 'self';
```

**Note on `unsafe-inline`:** Google Analytics, Microsoft Clarity, and Razorpay currently require inline scripts. When nonce-based CSP is implemented (Sprint 5+), `unsafe-inline` will be removed in favour of per-request nonces via Next.js middleware.

---

## 6. Secrets Management

### Classification

| Variable | Classification | Storage |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Environment variable — safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Environment variable — safe to expose; RLS enforces access |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Server-only env var; never in `NEXT_PUBLIC_*` |
| `RAZORPAY_KEY_SECRET` | **Secret** | Server-only env var |
| `RESEND_API_KEY` | **Secret** | Server-only env var |

### Rules

1. **Never commit secrets to git.** `.env.local` and `.env` are in `.gitignore`
2. **Never use `NEXT_PUBLIC_` prefix for secrets.** `NEXT_PUBLIC_*` variables are embedded in the client bundle and visible to anyone who inspects the page source
3. **Rotate keys if exposed.** If a secret is accidentally committed, rotate it immediately in the provider dashboard and update Vercel environment variables
4. **Vercel environment variables** — set secrets in Vercel → Project → Settings → Environment Variables with scope set to "Production" only where appropriate

### Git secret scanning

GitHub will automatically scan for known secret patterns and block pushes if secrets are detected. Additionally, `.gitignore` prevents `.env*` files from being staged.

---

## 7. Resolved Vulnerabilities

The following issues were identified during the pre-deployment security audit (July 2025) and fixed before any deployment.

| ID | Severity | File | Description | Fix |
|---|---|---|---|---|
| C1 | Critical | `api/auth/callback/route.ts` | Open redirect — `?next=https://evil.com` accepted without validation | `sanitiseNext()` validates relative paths only |
| C2 | Critical | *(missing)* | Sign-out form POSTed to non-existent `/api/auth/signout` route | Route created |
| C3 | Critical | `lib/supabase/server.ts` | `require()` in ESM context crashes Next.js 14 build | Replaced with ES `import` |
| C4 | Critical | `app/(auth)/login/page.tsx` | `useSearchParams()` without `Suspense` boundary — build error in production | Extracted `LoginForm.tsx` with `Suspense` wrapper |
| C5 | Critical | `middleware.ts` | Broad `(.*)` matcher conflicted with specific route patterns | Removed; replaced with explicit route list |
| C6 | Critical | `002_rls_policies.sql` | Two SELECT policies on certificates OR'd together — learners could read all issued certificates | Fixed in `004_fix_certificate_rls.sql` using `SECURITY DEFINER` function |
| H1 | High | `context/AuthContext.tsx` | `createClient()` called at component level — infinite re-render loop in React Strict Mode | `useRef()` stores stable client instance |
| H2 | High | `context/AuthContext.tsx` | `loadLearner` useCallback with unstable `supabase` dependency | Fixed dependency array |
| H3 | High | Auth pages | Form labels missing `htmlFor` — accessibility failure | `htmlFor`/`id` pairs added to all inputs |
| H4 | High | Auth pages | `<img>` used instead of `<Image>` — bypasses optimisation | Replaced with `next/image` |
| H5 | High | All routes | Missing `error.tsx` — unhandled errors show default Next.js page | `error.tsx` added globally and for dashboard |
| H6 | High | All routes | Missing `loading.tsx` — no skeleton during async data fetch | `loading.tsx` added for dashboard |
| H7 | High | `vercel.json` | No `Strict-Transport-Security` header | HSTS added with 2-year `max-age` and preload |
| H8 | High | `vercel.json` | No `Content-Security-Policy` | CSP added covering all external origins |

---

## 8. Known Limitations

| Limitation | Severity | Planned fix |
|---|---|---|
| No rate limiting on API routes | Medium | Sprint 4 — Vercel Edge Middleware with Upstash Redis |
| `unsafe-inline` in CSP for analytics | Medium | Sprint 5 — nonce-based CSP via middleware |
| YouTube video IDs visible in page source for enrolled learners | Low | Acceptable; lessons require auth. Future: Mux/Cloudflare Stream for DRM |
| No CAPTCHA on registration | Low | Sprint 4 — Cloudflare Turnstile on register form |
| No IP-based abuse detection | Low | Sprint 5 — Vercel WAF or Cloudflare |
| Admin role only set via SQL — no UI | Low | Sprint 4 — admin panel with role management |

---

## 9. Reporting a Vulnerability

If you discover a security vulnerability in Barada Academy:

1. **Do not open a public GitHub issue**
2. Email: `security@barada.in` with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if known)
3. We will acknowledge within 48 hours and aim to fix Critical/High issues within 7 days

---

## 10. Incident Response

### If a secret is exposed in git

1. **Immediately rotate the secret** in the relevant dashboard (Supabase, Razorpay, Resend)
2. Update the new value in Vercel environment variables
3. Trigger a new Vercel deployment to pick up the rotated secret
4. Check Supabase audit logs for any suspicious queries during the exposure window
5. If the service role key was exposed: review all admin operations in audit logs
6. Document in `CHANGELOG.md` under a security patch entry

### If user data is suspected to have been accessed

1. Take note of the time window
2. Query `audit_logs` for unusual patterns
3. Check Supabase dashboard → Authentication → Users for unexpected sign-ins
4. If confirmed breach: notify affected learners within 72 hours (DPDP Act 2023 requirement for India)
5. Suspend the affected account or API key

### If the site is down

1. Check Vercel status at status.vercel.com
2. Check Supabase status at status.supabase.com
3. If it is a deployment issue: `vercel rollback` to the previous deployment via CLI or dashboard
4. If it is a DB issue: Supabase → Project → Database → Restart (last resort)
