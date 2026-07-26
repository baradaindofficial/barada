# Contributing

**Barada Academy — Engineering Contribution Guide**
Last updated: July 2025

---

## Table of Contents

1. [Who This Is For](#1-who-this-is-for)
2. [Local Development Setup](#2-local-development-setup)
3. [Branch Strategy](#3-branch-strategy)
4. [Commit Conventions](#4-commit-conventions)
5. [Pull Request Process](#5-pull-request-process)
6. [Code Standards](#6-code-standards)
7. [TypeScript Standards](#7-typescript-standards)
8. [Database Change Process](#8-database-change-process)
9. [Testing Requirements](#9-testing-requirements)
10. [Documentation Requirements](#10-documentation-requirements)

---

## 1. Who This Is For

This guide is for anyone making changes to the Barada Academy codebase:

- **BK Satpathy (Founder):** Primary reviewer and approver of all changes
- **Contract engineers:** Follow this guide strictly before opening a PR
- **Future team members:** This guide is the source of truth for how we work

If you are unsure about anything, open a discussion issue before writing code.

---

## 2. Local Development Setup

### Requirements

- Node.js ≥ 20.0.0
- npm ≥ 10.0.0
- Git ≥ 2.30

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/[org]/barada-academy.git
cd barada-academy

# 2. Copy environment template
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
# Use the development Supabase project (not production)

# 3. Install dependencies
npm install

# 4. Verify everything compiles
npm run type-check

# 5. Start development server
npm run dev
# Opens at http://localhost:3000
```

### Useful commands

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Production build (run before opening PR)
npm run type-check   # TypeScript type checking
npm run lint         # ESLint checks
npm run lint:fix     # Auto-fix ESLint issues
npm run build:check  # TypeScript + build in one command
```

### Development Supabase

Use a **separate Supabase project** for development — never develop against production data. Apply all migrations to the dev project. The dev project should have the same schema as production.

---

## 3. Branch Strategy

### Branch naming

```
[type]/[short-description]

feat/lesson-player-youtube
fix/auth-callback-redirect
docs/update-api-reference
chore/upgrade-next-15
security/rate-limiting
```

| Prefix | Use for |
|---|---|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `security/` | Security fixes (expedited review) |
| `docs/` | Documentation only |
| `chore/` | Dependency updates, build changes |
| `refactor/` | Code improvements without behaviour change |
| `sprint/` | Sprint-level branches (`sprint/4-lms-foundation`) |

### Branch rules

- `main` — production. **Direct commits are not allowed.** All changes via PR.
- All feature branches are created from `main`
- Sprint branches (`sprint/4-...`) collect related feature branches before merging to `main`
- Delete branches after merging

---

## 4. Commit Conventions

Use **Conventional Commits** format:

```
type(scope): short description (< 72 chars)

Optional longer description.
Reference issues: Fixes #123

type: feat | fix | docs | style | refactor | test | chore | security
scope: auth | dashboard | api | db | ui | config | docs
```

### Examples

```bash
feat(auth): add Google OAuth sign-in button
fix(api): validate courseSlug against courses data before DB write
security(rls): fix certificate SELECT policy conflict
docs(api): add quiz endpoint specification
chore(deps): upgrade @supabase/ssr to 0.6.0
refactor(dashboard): extract CourseProgressBar into reusable component
```

### Rules

- Use present tense ("add feature" not "added feature")
- Do not end subject line with a period
- Reference GitHub issues where relevant
- For security fixes: always use `security` type so they are easy to find in the changelog

---

## 5. Pull Request Process

### Before opening a PR

```
[ ] npm run type-check — zero errors
[ ] npm run lint — zero errors
[ ] npm run build — successful production build
[ ] Any new migrations applied to dev Supabase and tested
[ ] Tests written/updated for changed functionality
[ ] CHANGELOG.md updated (unreleased section)
[ ] Documentation updated if public-facing behaviour changed
```

### PR description template

```markdown
## Summary
What this PR does in 2–3 sentences.

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Security fix
- [ ] Refactoring
- [ ] Documentation

## Changes made
- List of specific files changed and why
- Note any migrations required

## Testing done
- How the change was tested locally
- Any edge cases considered

## Database changes
- None / List migrations

## Breaking changes
- None / Describe

## Checklist
- [ ] TypeScript: no errors
- [ ] ESLint: no errors
- [ ] Build: successful
- [ ] Migration applied to dev Supabase
- [ ] CHANGELOG.md updated
- [ ] Documentation updated
```

### Review process

1. Author opens PR against `main` (or sprint branch)
2. PR automatically triggers a Vercel preview deployment
3. Author posts the preview URL in the PR description
4. Founder reviews — typically within 2 business days
5. Comments addressed, additional commits pushed
6. Approved → merged via **Squash and merge** (keeps `main` history clean)
7. Vercel deploys automatically on merge to `main`

### Security fix process

Security fixes bypass the normal sprint cycle:

1. Create branch `security/description`
2. Fix the vulnerability
3. Open PR with `[SECURITY]` in the title
4. Tag `@bksatpathy` for immediate review
5. Review within 24 hours for Critical/High severity
6. Merge and deploy immediately
7. Update `SECURITY.md` resolved vulnerabilities table
8. Add entry to `CHANGELOG.md`

---

## 6. Code Standards

### File structure

- One component per file
- File name matches the default export name: `LoginForm.tsx` exports `LoginForm`
- Page files (`page.tsx`) contain only the page component and its metadata export
- Heavy logic extracted to separate files (hooks, lib functions, db functions)

### Imports order

```typescript
// 1. React and Next.js
import { useState, useCallback } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// 2. Third-party libraries
import { z } from 'zod'

// 3. Internal — types
import type { Course, Learner } from '@/types'

// 4. Internal — lib and context
import { createClient } from '@/lib/supabase/server'
import { getLearner } from '@/lib/db/learners'

// 5. Internal — data
import { COURSES } from '@/data/courses'

// 6. Internal — components
import CourseCard from '@/components/course/CourseCard'

// 7. Styles (rare — prefer Tailwind)
import styles from './Component.module.css'
```

### Component patterns

```typescript
// ✅ Server Component (default in App Router)
export default async function CoursePage({ params }: { params: { slug: string } }) {
  const course = getCourse(params.slug)
  if (!course) notFound()
  return <div>...</div>
}

// ✅ Client Component — only when needed
'use client'
export default function EnrollButton({ courseSlug }: { courseSlug: string }) {
  const [loading, setLoading] = useState(false)
  // ...
}

// ✅ Suspense boundary pattern for useSearchParams()
// page.tsx (Server Component)
import { Suspense } from 'react'
import ClientForm from './ClientForm'
export default function Page() {
  return <Suspense fallback={<Skeleton />}><ClientForm /></Suspense>
}
```

### Forbidden patterns

```typescript
// ❌ Never use getSession() for auth decisions
const { data } = await supabase.auth.getSession()
// Use: supabase.auth.getUser()

// ❌ Never use require() in TypeScript files
const { createClient } = require('@supabase/supabase-js')
// Use ES imports

// ❌ Never expose SUPABASE_SERVICE_ROLE_KEY to client
// NEXT_PUBLIC_ prefix = client bundle = exposed to browser

// ❌ Never use <img> — use next/image
<img src="/logo/icon.png" />
// Use: <Image src="/logo/icon.png" width={36} height={36} alt="..." />

// ❌ Never redirect to unvalidated external URLs
const next = searchParams.get('next')
return redirect(next)  // open redirect vulnerability
// Use sanitiseNext() from app/api/auth/callback/route.ts
```

---

## 7. TypeScript Standards

### Strict mode

TypeScript is configured in strict mode (`tsconfig.json`). All code must compile with zero errors.

```bash
npm run type-check
# Must exit 0 before any PR is opened
```

### Type definitions

- Prefer `interface` for object shapes, `type` for unions and intersections
- All DB types come from `types/database.ts`
- Application types are in `types/index.ts`
- Do not use `any` — use `unknown` and narrow, or extend types
- Always type function return values for public functions

```typescript
// ✅ Good
export async function getLearner(learnerId: string): Promise<Learner | null> {

// ❌ Avoid
export async function getLearner(learnerId) {
```

### Environment variables

All environment variable access must be type-safe:

```typescript
// ✅ Good — will throw at startup if missing, not at runtime
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!

// ✅ Better for server-only secrets — explicit error message
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required')
```

---

## 8. Database Change Process

Any change to the database schema requires:

1. **Write a new migration** (`supabase/migrations/NNN_description.sql`)
2. **Never edit existing migrations** — they may already be applied to production
3. Use `IF NOT EXISTS`, `OR REPLACE`, `ON CONFLICT DO NOTHING` for idempotency
4. **Apply to dev Supabase first** and test thoroughly
5. **Update `DATABASE.md`** with new tables, columns, or policies
6. **Apply to production** via Supabase SQL Editor
7. **Document in `CHANGELOG.md`**

### Migration checklist

```
[ ] Migration file named: NNN_description.sql (next sequential number)
[ ] All statements are idempotent
[ ] RLS policies added for any new table
[ ] Indexes added for foreign keys and common query patterns
[ ] Updated DATABASE.md table reference
[ ] Tested on dev Supabase: no errors, expected schema changes
[ ] CHANGELOG.md updated
```

---

## 9. Testing Requirements

**Current status:** No automated test suite exists. This is a known gap tracked in the backlog.

**Manual testing requirements before any PR:**

For any change to auth:
```
[ ] Register new account
[ ] Verification email arrives
[ ] Verify email → dashboard
[ ] Login works
[ ] Logout works
[ ] Forgot password sends email
[ ] Protected routes redirect to login when not authenticated
```

For any change to API routes:
```
[ ] Route returns correct status codes for all cases
[ ] Unauthenticated request returns 401
[ ] Invalid body returns 400 with descriptive error
[ ] Valid request returns expected response
```

For any change to database:
```
[ ] Migration applies cleanly to a fresh dev Supabase
[ ] RLS: learner cannot read another learner's data
[ ] RLS: unauthenticated user cannot read any data (except config_settings)
[ ] Admin can read all rows in relevant tables
```

### Planned testing (Sprint 6)

- **Unit tests:** Vitest for utility functions and DB functions
- **Integration tests:** Playwright for auth flows and enrollment
- **CI:** GitHub Actions runs type-check + lint + build on every PR

---

## 10. Documentation Requirements

When making changes, update the relevant docs directory file:

| Change type | Update |
|---|---|
| New API route | `API.md` — add route specification |
| DB schema change | `DATABASE.md` — update table reference |
| New security measure | `SECURITY.md` — add to model or headers section |
| New env variable | `.env.local.example` + `DEPLOYMENT.md` |
| Architecture change | `ARCHITECTURE.md` — update structure or ADR |
| New feature | `ROADMAP.md` — mark as complete |
| Any release | `CHANGELOG.md` — add entry under correct version |

Docs must be updated in the **same PR** as the code change — not in a follow-up PR.
