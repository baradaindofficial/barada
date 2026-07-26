-- ═══════════════════════════════════════════════════════════════════
-- 002_rls_policies.sql
-- Row Level Security — every table locked down by default
-- ═══════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
alter table public.learners         enable row level security;
alter table public.enrollments      enable row level security;
alter table public.lesson_progress  enable row level security;
alter table public.quiz_attempts    enable row level security;
alter table public.certificates     enable row level security;
alter table public.admin_users      enable row level security;
alter table public.config_settings  enable row level security;
alter table public.audit_logs       enable row level security;

-- ── Helper function: is current user an admin? ────────────────────
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.admin_users
    where learner_id = auth.uid()
  )
$$;

-- ── LEARNERS policies ─────────────────────────────────────────────
create policy "learner: read own profile"
  on public.learners for select
  using (learner_id = auth.uid());

create policy "learner: update own profile"
  on public.learners for update
  using (learner_id = auth.uid())
  with check (learner_id = auth.uid());

create policy "admin: read all learners"
  on public.learners for select
  using (public.is_admin());

create policy "system: insert on signup"
  on public.learners for insert
  with check (learner_id = auth.uid());

-- ── ENROLLMENTS policies ──────────────────────────────────────────
create policy "learner: read own enrollments"
  on public.enrollments for select
  using (learner_id = auth.uid());

create policy "learner: enroll self"
  on public.enrollments for insert
  with check (learner_id = auth.uid());

create policy "learner: update own enrollment"
  on public.enrollments for update
  using (learner_id = auth.uid())
  with check (learner_id = auth.uid());

create policy "admin: read all enrollments"
  on public.enrollments for select
  using (public.is_admin());

-- ── LESSON PROGRESS policies ──────────────────────────────────────
create policy "learner: read own progress"
  on public.lesson_progress for select
  using (learner_id = auth.uid());

create policy "learner: upsert own progress"
  on public.lesson_progress for insert
  with check (learner_id = auth.uid());

create policy "learner: update own progress"
  on public.lesson_progress for update
  using (learner_id = auth.uid());

-- ── QUIZ ATTEMPTS policies ────────────────────────────────────────
create policy "learner: read own quiz attempts"
  on public.quiz_attempts for select
  using (learner_id = auth.uid());

create policy "learner: insert own quiz attempt"
  on public.quiz_attempts for insert
  with check (learner_id = auth.uid());

-- ── CERTIFICATES policies ─────────────────────────────────────────
create policy "learner: read own certificates"
  on public.certificates for select
  using (learner_id = auth.uid());

create policy "public: verify certificate by id"
  on public.certificates for select
  using (status = 'issued');

create policy "admin: manage certificates"
  on public.certificates for all
  using (public.is_admin());

-- ── CONFIG SETTINGS policies ──────────────────────────────────────
create policy "public: read config"
  on public.config_settings for select
  using (true);

create policy "admin: update config"
  on public.config_settings for update
  using (public.is_admin());

-- ── ADMIN USERS policies ──────────────────────────────────────────
create policy "admin: read admin users"
  on public.admin_users for select
  using (public.is_admin());
