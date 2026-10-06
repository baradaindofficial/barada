-- ============================================================
-- Migration 014: programs schema
-- V5 Phase 1 — bundle existing courses into a named program
-- CTO approved: 2026-10-06 (Phase 1 scope only — programs +
-- program_courses. Certification tiers, capstone/viva, and any
-- tier-certificate payment schema are explicitly deferred and
-- are NOT part of this migration.)
-- ============================================================
-- Purpose: let a set of courses be grouped and ordered under a
-- single named program (e.g. "ChatGPT Masterclass V5", 12
-- courses / 64 hours) without touching any existing table.
--
-- Does NOT modify courses, modules, lessons, enrollments,
-- certificates, or certificate_orders in any way. Does NOT move
-- or reclassify any existing course/module/lesson records —
-- chatgpt-for-professionals and every other course keep their
-- current rows, status, and routes exactly as they are today.
--
-- Fully additive and fully reversible: see the rollback block
-- at the end of this file (commented out — run manually if
-- ever needed).
-- ============================================================

-- -- PROGRAMS ---------------------------------------------------------
create table if not exists public.programs (
  program_id        uuid primary key default uuid_generate_v4(),
  slug              text not null unique,
  title             text not null,
  subtitle          text,
  description       text,

  -- Declared, not computed. The V5 program is defined as a fixed
  -- 64-hour / 12-course program by design decision, not derived from
  -- the current sum of (possibly draft/incomplete) member courses'
  -- estimated_hours. Admin sets/updates this directly.
  total_hours       numeric(5,1),
  course_count      int,

  status            text not null default 'draft'
                     check (status in ('draft','review','approved','published','deprecated','archived')),
  visibility        text not null default 'public'
                     check (visibility in ('public','authenticated','enrolled','private')),
  sort_order        int not null default 0,

  meta_title        text,
  meta_description  text,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.programs is
  'A named, ordered bundle of courses (e.g. the V5 12-course / 64-hour program). Purely additive — no existing table references this table. total_hours and course_count are admin-declared values, not trigger-maintained; they do not auto-recompute from program_courses.';

create index if not exists idx_programs_status on public.programs(status);
create index if not exists idx_programs_slug   on public.programs(slug);

-- -- updated_at TRIGGER (reuses existing shared function from 006) --
create trigger set_programs_updated_at
  before update on public.programs
  for each row execute procedure public.set_updated_at();

-- -- PROGRAM_COURSES ----------------------------------------------------
create table if not exists public.program_courses (
  program_id   uuid not null references public.programs(program_id) on delete cascade,
  course_id    uuid not null references public.courses(course_id) on delete restrict,
  sequence_no  int not null check (sequence_no > 0),
  is_required  boolean not null default true,

  primary key (program_id, course_id),
  unique (program_id, sequence_no)
);

comment on table public.program_courses is
  'Ordered membership of a course inside a program. on delete restrict on course_id: a course cannot be deleted while it still belongs to a program — it must be removed from program_courses first. Inserting a row here does not change anything on the referenced courses row.';

create index if not exists idx_program_courses_course on public.program_courses(course_id);

-- -- ROW LEVEL SECURITY -------------------------------------------------
alter table public.programs enable row level security;
alter table public.program_courses enable row level security;

-- programs: public can read published+public programs; admins read/write everything
create policy "public: read published programs"
  on public.programs for select
  using (status = 'published' and visibility = 'public');

create policy "admin: manage programs"
  on public.programs for all
  using (public.is_admin());

-- program_courses: readable wherever the parent program is publicly readable
create policy "public: read program_courses of published programs"
  on public.program_courses for select
  using (
    exists (
      select 1 from public.programs p
      where p.program_id = program_courses.program_id
        and p.status = 'published'
        and p.visibility = 'public'
    )
  );

create policy "admin: manage program_courses"
  on public.program_courses for all
  using (public.is_admin());

-- ============================================================
-- ROLLBACK (manual — not executed by this migration)
-- ============================================================
-- drop trigger if exists set_programs_updated_at on public.programs;
-- drop table if exists public.program_courses;
-- drop table if exists public.programs;
-- ============================================================
