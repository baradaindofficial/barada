-- ═══════════════════════════════════════════════════════════════════
-- 001_initial_schema.sql
-- Barada Academy — Complete database schema
-- Apply via: supabase db push  OR  supabase migration up
-- ═══════════════════════════════════════════════════════════════════

-- ── Enable required extensions ────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ── LEARNERS ──────────────────────────────────────────────────────
-- Links to auth.users (Supabase managed auth table)
create table if not exists public.learners (
  learner_id    uuid primary key references auth.users(id) on delete cascade,
  name          text not null,
  email         text not null unique,
  avatar_url    text,
  bio           text,
  profession    text,
  linkedin_url  text,
  status        text not null default 'active'
                check (status in ('active', 'suspended', 'pending_verification')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.learners is 'Learner profiles — one row per registered user';

-- ── ENROLLMENTS ───────────────────────────────────────────────────
create table if not exists public.enrollments (
  enrollment_id         uuid primary key default uuid_generate_v4(),
  learner_id            uuid not null references public.learners(learner_id) on delete cascade,
  course_slug           text not null,
  status                text not null default 'active'
                        check (status in ('active', 'completed', 'paused')),
  completion_percentage int not null default 0
                        check (completion_percentage between 0 and 100),
  enrolled_at           timestamptz not null default now(),
  last_accessed_at      timestamptz,
  completed_at          timestamptz,
  unique (learner_id, course_slug)
);

create index idx_enrollments_learner on public.enrollments(learner_id);
create index idx_enrollments_course  on public.enrollments(course_slug);

-- ── LESSON PROGRESS ───────────────────────────────────────────────
create table if not exists public.lesson_progress (
  progress_id      uuid primary key default uuid_generate_v4(),
  learner_id       uuid not null references public.learners(learner_id) on delete cascade,
  course_slug      text not null,
  module_number    int not null check (module_number > 0),
  lesson_number    int not null check (lesson_number > 0),
  is_completed     boolean not null default false,
  completed_at     timestamptz,
  watched_seconds  int not null default 0 check (watched_seconds >= 0),
  last_watched_at  timestamptz,
  unique (learner_id, course_slug, module_number, lesson_number)
);

create index idx_progress_learner_course on public.lesson_progress(learner_id, course_slug);

-- ── QUIZ ATTEMPTS ─────────────────────────────────────────────────
create table if not exists public.quiz_attempts (
  attempt_id     uuid primary key default uuid_generate_v4(),
  learner_id     uuid not null references public.learners(learner_id) on delete cascade,
  course_slug    text not null,
  answers        int[] not null,
  score          int not null check (score between 0 and 100),
  passed         boolean not null,
  attempted_at   timestamptz not null default now(),
  attempt_number int not null default 1
);

create index idx_quiz_learner_course on public.quiz_attempts(learner_id, course_slug);

-- ── CERTIFICATES ──────────────────────────────────────────────────
create table if not exists public.certificates (
  certificate_id   text primary key,  -- e.g. BAC-CGP-2025-00001
  learner_id       uuid not null references public.learners(learner_id) on delete restrict,
  course_slug      text not null,
  learner_name     text not null,     -- snapshot at issuance
  course_title     text not null,     -- snapshot at issuance
  issued_at        timestamptz not null default now(),
  status           text not null default 'pending_payment'
                   check (status in ('pending_payment', 'issued', 'revoked')),
  verification_url text not null,
  payment_id       text,              -- Razorpay payment ID
  unique (learner_id, course_slug)
);

create index idx_certs_learner on public.certificates(learner_id);
create index idx_certs_verification on public.certificates(certificate_id);

-- ── ADMIN USERS ───────────────────────────────────────────────────
create table if not exists public.admin_users (
  admin_id    uuid primary key default uuid_generate_v4(),
  learner_id  uuid not null references public.learners(learner_id) on delete cascade,
  role        text not null check (role in ('super_admin', 'content_admin', 'support')),
  created_at  timestamptz not null default now(),
  unique (learner_id)
);

-- ── CONFIG SETTINGS ───────────────────────────────────────────────
-- Configurable values (pricing, etc.) — admin-editable, not hardcoded
create table if not exists public.config_settings (
  key          text primary key,
  value        text not null,
  description  text not null default '',
  updated_at   timestamptz not null default now()
);

-- Seed default configuration values
insert into public.config_settings (key, value, description) values
  ('cert_price_free_course_paise', '29900',   'Certificate price for free courses, in paise (29900 = ₹299)'),
  ('cert_price_paid_course_paise', '0',       'Certificate price for paid courses (0 = included)'),
  ('quiz_pass_threshold',          '60',      'Minimum quiz score to pass (0–100)'),
  ('quiz_min_questions',           '5',       'Number of quiz questions per exam'),
  ('platform_name',                'Barada Academy', 'Platform display name'),
  ('support_email',                'academy@barada.in', 'Support email address')
on conflict (key) do nothing;

-- ── AUDIT LOG ─────────────────────────────────────────────────────
create table if not exists public.audit_logs (
  log_id      uuid primary key default uuid_generate_v4(),
  actor_id    uuid,
  actor_type  text not null check (actor_type in ('admin', 'learner', 'system')),
  action      text not null,
  target_id   text,
  metadata    jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

create index idx_audit_actor    on public.audit_logs(actor_id);
create index idx_audit_action   on public.audit_logs(action);
create index idx_audit_created  on public.audit_logs(created_at desc);
