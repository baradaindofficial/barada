# Database

**Barada Academy — Database Reference**
Last updated: July 2025 | PostgreSQL 15 via Supabase

---

## Table of Contents

1. [Overview](#1-overview)
2. [Table Reference](#2-table-reference)
3. [Relationships](#3-relationships)
4. [Row Level Security](#4-row-level-security)
5. [Triggers & Functions](#5-triggers--functions)
6. [Indexes](#6-indexes)
7. [Migrations](#7-migrations)
8. [Common Queries](#8-common-queries)

---

## 1. Overview

The database contains 8 tables, all in the `public` schema. Every table has Row Level Security enabled. The `auth.users` table is managed by Supabase and is the source of truth for authentication.

```
auth.users (Supabase managed)
    │
    └── public.learners         (1:1 — auto-created by trigger)
            │
            ├── public.enrollments           (1:many per course)
            │       │
            │       └── public.lesson_progress (1:many per lesson)
            │
            ├── public.quiz_attempts         (1:many per attempt)
            │
            └── public.certificates          (1:1 per course, after payment)

public.admin_users              (optional — links learner_id to admin role)
public.config_settings          (platform configuration — key/value)
public.audit_logs               (event log — all significant actions)
```

---

## 2. Table Reference

### `public.learners`

Learner profiles. One row per registered user. Auto-created by the `handle_new_user` trigger when a row is inserted into `auth.users`.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `learner_id` | `uuid` | No | — | Primary key. FK → `auth.users(id)` ON DELETE CASCADE |
| `name` | `text` | No | — | Full name. Populated from `raw_user_meta_data->>'full_name'` on signup |
| `email` | `text` | No | — | Unique. Mirrors `auth.users.email` |
| `avatar_url` | `text` | Yes | `null` | Profile photo URL (Supabase Storage, Sprint 4) |
| `bio` | `text` | Yes | `null` | Short professional bio |
| `profession` | `text` | Yes | `null` | Learner-entered job title / profession |
| `linkedin_url` | `text` | Yes | `null` | LinkedIn profile URL |
| `status` | `text` | No | `'active'` | `active` \| `suspended` \| `pending_verification` |
| `created_at` | `timestamptz` | No | `now()` | Account creation timestamp |
| `updated_at` | `timestamptz` | No | `now()` | Auto-updated by trigger on every UPDATE |

---

### `public.enrollments`

Records when a learner enrolls in a course. One row per learner per course.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `enrollment_id` | `uuid` | No | `uuid_generate_v4()` | Primary key |
| `learner_id` | `uuid` | No | — | FK → `learners(learner_id)` ON DELETE CASCADE |
| `course_slug` | `text` | No | — | e.g. `chatgpt-for-professionals` |
| `status` | `text` | No | `'active'` | `active` \| `completed` \| `paused` |
| `completion_percentage` | `int` | No | `0` | 0–100. Auto-updated by trigger |
| `enrolled_at` | `timestamptz` | No | `now()` | Enrollment timestamp |
| `last_accessed_at` | `timestamptz` | Yes | `null` | Updated by the progress trigger on lesson complete |
| `completed_at` | `timestamptz` | Yes | `null` | Set by trigger when `completion_percentage` reaches 100 |

**Unique constraint:** `(learner_id, course_slug)` — a learner can only enroll once per course.

---

### `public.lesson_progress`

Tracks completion and watch time for individual lessons.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `progress_id` | `uuid` | No | `uuid_generate_v4()` | Primary key |
| `learner_id` | `uuid` | No | — | FK → `learners(learner_id)` |
| `course_slug` | `text` | No | — | Course identifier |
| `module_number` | `int` | No | — | Module number (1-indexed, ≥ 1) |
| `lesson_number` | `int` | No | — | Lesson number (1-indexed, ≥ 1) |
| `is_completed` | `boolean` | No | `false` | Toggled to `true` when learner marks lesson done |
| `completed_at` | `timestamptz` | Yes | `null` | Timestamp of first completion |
| `watched_seconds` | `int` | No | `0` | Cumulative video watch time in seconds |
| `last_watched_at` | `timestamptz` | Yes | `null` | Updated each time the lesson is played |

**Unique constraint:** `(learner_id, course_slug, module_number, lesson_number)`

---

### `public.quiz_attempts`

Records each quiz submission. Immutable after insert — never updated.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `attempt_id` | `uuid` | No | `uuid_generate_v4()` | Primary key |
| `learner_id` | `uuid` | No | — | FK → `learners(learner_id)` |
| `course_slug` | `text` | No | — | Course the quiz belongs to |
| `answers` | `int[]` | No | — | Array of selected option indexes (0-based). Length = question count |
| `score` | `int` | No | — | Percentage score, 0–100 |
| `passed` | `boolean` | No | — | `true` if `score >= quiz_pass_threshold` from `config_settings` |
| `attempted_at` | `timestamptz` | No | `now()` | Submission timestamp |
| `attempt_number` | `int` | No | `1` | Incremented on repeat attempts |

---

### `public.certificates`

Issued certificates. One row per learner per course. Created when a learner passes the quiz and completes payment.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `certificate_id` | `text` | No | — | Primary key. Format: `BAC-[COURSE_CODE]-[YEAR]-[NNNNN]`. e.g. `BAC-CGP-2025-00001` |
| `learner_id` | `uuid` | No | — | FK → `learners(learner_id)` ON DELETE RESTRICT |
| `course_slug` | `text` | No | — | Course the certificate is for |
| `learner_name` | `text` | No | — | Snapshot of `learners.name` at issuance. Immutable. |
| `course_title` | `text` | No | — | Snapshot of course title at issuance. Immutable. |
| `issued_at` | `timestamptz` | No | `now()` | Certificate issue timestamp |
| `status` | `text` | No | `'pending_payment'` | `pending_payment` \| `issued` \| `revoked` |
| `verification_url` | `text` | No | — | Public URL: `https://barada.in/verify/[certificate_id]` |
| `payment_id` | `text` | Yes | `null` | Razorpay payment ID. Set when payment confirmed. |

**Unique constraint:** `(learner_id, course_slug)` — one certificate per learner per course.
**ON DELETE RESTRICT** on `learner_id` — deleting a learner does not cascade-delete issued certificates (audit record).

---

### `public.admin_users`

Maps learners to admin roles. Not all learners have a row here.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `admin_id` | `uuid` | No | `uuid_generate_v4()` | Primary key |
| `learner_id` | `uuid` | No | — | FK → `learners(learner_id)` ON DELETE CASCADE |
| `role` | `text` | No | — | `super_admin` \| `content_admin` \| `support` |
| `created_at` | `timestamptz` | No | `now()` | When admin role was granted |

**Unique constraint:** `(learner_id)` — one admin role per person.

**To grant admin access:**
```sql
INSERT INTO public.admin_users (learner_id, role)
SELECT learner_id, 'super_admin'
FROM public.learners
WHERE email = 'admin@barada.in';
```

---

### `public.config_settings`

Platform configuration stored as key/value pairs. Admin-editable at runtime without a deployment.

| Column | Type | Description |
|---|---|---|
| `key` | `text` | Primary key. Namespaced by category |
| `value` | `text` | Always stored as text; parse in application code |
| `description` | `text` | Human-readable explanation of the setting |
| `updated_at` | `timestamptz` | Auto-updated by trigger |

**Seeded values:**

| Key | Default value | Description |
|---|---|---|
| `cert_price_free_course_paise` | `29900` | Certificate price in paise (₹299) |
| `cert_price_paid_course_paise` | `0` | Certificate price for paid courses |
| `quiz_pass_threshold` | `60` | Minimum pass score (0–100) |
| `quiz_min_questions` | `5` | Number of questions per quiz |
| `platform_name` | `Barada Academy` | Display name |
| `support_email` | `academy@barada.in` | Support contact |
| `total_lessons_[slug]` | Per course | Total lessons per course (used by progress trigger) |

---

### `public.audit_logs`

Append-only event log. Never updated or deleted.

| Column | Type | Description |
|---|---|---|
| `log_id` | `uuid` | Primary key |
| `actor_id` | `uuid` | ID of the user who performed the action (nullable for system events) |
| `actor_type` | `text` | `admin` \| `learner` \| `system` |
| `action` | `text` | Namespaced action string e.g. `certificate.issued`, `learner.suspended` |
| `target_id` | `text` | ID of the affected entity (certificate_id, learner_id, etc.) |
| `metadata` | `jsonb` | Additional context (old values, IP address, etc.) |
| `created_at` | `timestamptz` | Event timestamp |

---

## 3. Relationships

```
auth.users (1)
    └─── learners (1)                    [trigger: handle_new_user]
              │
              ├─── enrollments (many)     [unique: learner_id + course_slug]
              │        │
              │        └─── lesson_progress (many)  [trigger: update_enrollment_progress]
              │
              ├─── quiz_attempts (many)
              │
              ├─── certificates (many, max 1 per course)
              │
              └─── admin_users (0 or 1)
```

---

## 4. Row Level Security

RLS is enabled on all 8 tables. The default behaviour when RLS is enabled but no policy matches is **DENY** — this is intentional.

### Policy summary

| Table | Who can SELECT | Who can INSERT | Who can UPDATE | Who can DELETE |
|---|---|---|---|---|
| `learners` | Own row; admins: all rows | Own row (system trigger) | Own row | — |
| `enrollments` | Own rows; admins: all rows | Own rows | Own rows | — |
| `lesson_progress` | Own rows | Own rows | Own rows | — |
| `quiz_attempts` | Own rows | Own rows | — | — |
| `certificates` | Own rows; public: issued certs via function | — | Admins | Admins |
| `admin_users` | Admins | — | — | — |
| `config_settings` | Everyone | — | Admins | — |
| `audit_logs` | Admins | System (unrestricted) | — | — |

### `is_admin()` helper function

```sql
create or replace function public.is_admin()
returns boolean
language sql
security definer stable
as $$
  select exists (
    select 1 from public.admin_users
    where learner_id = auth.uid()
  )
$$;
```

This function runs with `SECURITY DEFINER` so it can query `admin_users` even when the calling user's RLS would otherwise block it.

### Certificate verification (security note)

The original implementation had a SELECT policy conflict where authenticated learners could read all issued certificates. This was fixed in migration `004`. Certificate verification now uses the `verify_certificate(id)` function which returns only public fields for a specific certificate and does not expose `learner_id` or payment details to anonymous callers.

---

## 5. Triggers & Functions

### `handle_new_user()` — auto-create learner profile

**Trigger:** `AFTER INSERT ON auth.users FOR EACH ROW`
**What it does:** Reads `raw_user_meta_data->>'full_name'` from the signup payload and inserts a row into `public.learners`. If the name is missing, it falls back to the email username. The `ON CONFLICT DO NOTHING` clause makes the trigger idempotent.

```sql
-- Fires on every new Supabase Auth registration
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### `set_updated_at()` — auto-update timestamp

**Triggers:** `BEFORE UPDATE ON learners`, `BEFORE UPDATE ON config_settings`
**What it does:** Sets `new.updated_at = now()` before the row is written. Ensures `updated_at` is always accurate without requiring the application to set it.

### `update_enrollment_progress()` — recalculate completion percentage

**Trigger:** `AFTER INSERT OR UPDATE ON lesson_progress FOR EACH ROW WHEN (new.is_completed = true)`
**What it does:**
1. Looks up the total lesson count for the course from `config_settings` (`total_lessons_[slug]`)
2. Counts completed lessons for this learner + course
3. Calculates `(completed / total) * 100` capped at 100
4. Updates `enrollments.completion_percentage`, `last_accessed_at`, `status` (sets to `completed` when 100%), and `completed_at`

This keeps enrollment progress in sync without any application-layer calculation.

### `get_learner_stats(learner_id)` — dashboard aggregate

**Type:** SQL function, `SECURITY DEFINER`, `STABLE`
**Returns:** One row with `enrolled_count`, `completed_count`, `certificate_count`, `total_watch_seconds`

Used by the dashboard page to show learner statistics in a single DB round-trip.

### `verify_certificate(certificate_id)` — public certificate verification

**Type:** SQL function, `SECURITY DEFINER`, `STABLE`
**Returns:** `certificate_id`, `learner_name`, `course_title`, `issued_at`, `status` for issued certificates only.
**Access:** Granted to both `anon` and `authenticated` roles.

---

## 6. Indexes

| Index | Table | Column(s) | Purpose |
|---|---|---|---|
| `idx_enrollments_learner` | `enrollments` | `learner_id` | Dashboard: fetch all enrollments for a user |
| `idx_enrollments_course` | `enrollments` | `course_slug` | Admin: how many learners per course |
| `idx_progress_learner_course` | `lesson_progress` | `(learner_id, course_slug)` | Progress trigger + lesson player |
| `idx_quiz_learner_course` | `quiz_attempts` | `(learner_id, course_slug)` | Quiz history lookup |
| `idx_certs_learner` | `certificates` | `learner_id` | Dashboard: learner's certificates |
| `idx_certs_verification` | `certificates` | `certificate_id` | Public verification page lookup |
| `idx_audit_actor` | `audit_logs` | `actor_id` | Admin: events by user |
| `idx_audit_action` | `audit_logs` | `action` | Admin: filter by event type |
| `idx_audit_created` | `audit_logs` | `created_at DESC` | Admin: recent events |

---

## 7. Migrations

All migrations are in `supabase/migrations/` and must be applied in order.

| File | What it does |
|---|---|
| `001_initial_schema.sql` | Creates all 8 tables, indexes, seeds `config_settings` |
| `002_rls_policies.sql` | Enables RLS on all tables, creates all policies + `is_admin()` |
| `003_triggers.sql` | Creates all trigger functions and attaches them to tables |
| `004_fix_certificate_rls.sql` | **Security fix** — resolves SELECT policy conflict on certificates |

### Applying migrations

**Via Supabase dashboard (current method):**
1. Go to Supabase → SQL Editor → New query
2. Paste migration content → Run
3. Verify: no errors, expected rows in affected tables

**Via Supabase CLI (when CLI is configured):**
```bash
supabase db push
```

### Adding a new migration

1. Create a new file: `supabase/migrations/NNN_description.sql`
2. Number sequentially from the last migration
3. Write the SQL — always use `IF NOT EXISTS` / `OR REPLACE` / `ON CONFLICT DO NOTHING` for idempotency
4. Test locally first: `supabase db reset` (destroys and recreates local DB)
5. Apply to production via dashboard or CLI
6. Document in `CHANGELOG.md`

---

## 8. Common Queries

### Get all enrollments for a learner with course info
```sql
SELECT
  e.enrollment_id,
  e.course_slug,
  e.status,
  e.completion_percentage,
  e.enrolled_at,
  e.last_accessed_at
FROM public.enrollments e
WHERE e.learner_id = '<uuid>'
ORDER BY e.last_accessed_at DESC NULLS LAST;
```

### Get lesson completion map for a course
```sql
SELECT
  module_number,
  lesson_number,
  is_completed,
  watched_seconds
FROM public.lesson_progress
WHERE learner_id = '<uuid>'
  AND course_slug = 'chatgpt-for-professionals'
ORDER BY module_number, lesson_number;
```

### Dashboard stats for a learner
```sql
SELECT * FROM public.get_learner_stats('<uuid>');
```

### List all issued certificates (admin)
```sql
SELECT
  c.certificate_id,
  c.learner_name,
  c.course_title,
  c.issued_at,
  l.email
FROM public.certificates c
JOIN public.learners l ON l.learner_id = c.learner_id
WHERE c.status = 'issued'
ORDER BY c.issued_at DESC;
```

### Count enrollments by course
```sql
SELECT
  course_slug,
  COUNT(*) AS total_enrolled,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed
FROM public.enrollments
GROUP BY course_slug
ORDER BY total_enrolled DESC;
```

### Verify a certificate (public)
```sql
SELECT * FROM public.verify_certificate('BAC-CGP-2025-00001');
```
