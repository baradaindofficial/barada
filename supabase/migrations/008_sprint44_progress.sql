-- ============================================================================
-- 008_sprint44_progress.sql
-- Barada Digital Platform — Learning Experience & Progress Tracking
-- Sprint 4.4: course_progress, lesson_progress, learning_streaks,
--             achievements, user_achievements, learning_sessions
-- Prisma is NOT used — this platform uses Supabase SQL migrations (ADR-001)
-- Bookmarks reused from 007 (no separate CourseBookmark table)
-- Run AFTER 007_sprint43_resources.sql
-- Designed so Sprint 5 (certificates) needs no additional structural changes
-- ============================================================================

-- ── COURSE PROGRESS ─────────────────────────────────────────────────────
-- One row per learner per course. Aggregate completion state + resume point.
create table if not exists public.course_progress (
  progress_id             uuid primary key default uuid_generate_v4(),
  learner_id              uuid not null references public.learners(learner_id) on delete cascade,
  course_id               uuid not null references public.courses(course_id) on delete cascade,
  app_id                  text not null default 'academy' references platform.applications(app_id),
  status                  text not null default 'not_started'
                          check (status in ('not_started','in_progress','completed')),
  completion_percentage   numeric(5,2) not null default 0
                          check (completion_percentage >= 0 and completion_percentage <= 100),
  lessons_completed       integer not null default 0,
  lessons_total           integer not null default 0,
  time_spent_seconds      integer not null default 0,
  last_accessed_lesson_id uuid references public.lessons(lesson_id),
  last_accessed_at        timestamptz,
  started_at              timestamptz,
  completed_at            timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  unique (learner_id, course_id)
);

create index idx_course_progress_learner        on public.course_progress(learner_id);
create index idx_course_progress_course         on public.course_progress(course_id);
create index idx_course_progress_status         on public.course_progress(status);
create index idx_course_progress_learner_status on public.course_progress(learner_id, status);
create index idx_course_progress_recent         on public.course_progress(learner_id, last_accessed_at desc);

alter table public.course_progress enable row level security;

create policy "learner: manage own course progress"
  on public.course_progress for all
  using (learner_id = auth.uid())
  with check (learner_id = auth.uid());

create policy "admin: read all course progress"
  on public.course_progress for select
  using (public.is_admin());

-- ── LESSON PROGRESS ─────────────────────────────────────────────────────
-- One row per learner per lesson. Tracks per-content-type completion + resume.
create table if not exists public.lesson_progress (
  progress_id             uuid primary key default uuid_generate_v4(),
  learner_id              uuid not null references public.learners(learner_id) on delete cascade,
  lesson_id               uuid not null references public.lessons(lesson_id) on delete cascade,
  course_id               uuid not null references public.courses(course_id) on delete cascade,
  app_id                  text not null default 'academy' references platform.applications(app_id),
  status                  text not null default 'not_started'
                          check (status in ('not_started','in_progress','completed')),
  video_completed         boolean not null default false,
  reading_completed       boolean not null default false,
  quiz_completed          boolean not null default false,
  resume_position_seconds integer not null default 0,
  time_spent_seconds      integer not null default 0,
  started_at              timestamptz,
  completed_at            timestamptz,
  last_accessed_at        timestamptz not null default now(),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  unique (learner_id, lesson_id)
);

create index idx_lesson_progress_learner        on public.lesson_progress(learner_id);
create index idx_lesson_progress_lesson         on public.lesson_progress(lesson_id);
create index idx_lesson_progress_course         on public.lesson_progress(course_id);
create index idx_lesson_progress_status         on public.lesson_progress(status);
create index idx_lesson_progress_learner_course on public.lesson_progress(learner_id, course_id);
create index idx_lesson_progress_recent         on public.lesson_progress(learner_id, last_accessed_at desc);

alter table public.lesson_progress enable row level security;

create policy "learner: manage own lesson progress"
  on public.lesson_progress for all
  using (learner_id = auth.uid())
  with check (learner_id = auth.uid());

create policy "admin: read all lesson progress"
  on public.lesson_progress for select
  using (public.is_admin());

-- ── LEARNING STREAKS ─────────────────────────────────────────────────────
-- One row per learner. WRITE via service role only (server-computed) —
-- learners can read their own streak but cannot forge it via direct API call.
create table if not exists public.learning_streaks (
  streak_id            uuid primary key default uuid_generate_v4(),
  learner_id           uuid not null unique references public.learners(learner_id) on delete cascade,
  app_id               text not null default 'academy' references platform.applications(app_id),
  current_streak_days  integer not null default 0,
  longest_streak_days  integer not null default 0,
  last_activity_date   date,
  streak_started_at    date,
  updated_at           timestamptz not null default now()
);

create index idx_streaks_learner on public.learning_streaks(learner_id);

alter table public.learning_streaks enable row level security;

create policy "learner: read own streak"
  on public.learning_streaks for select
  using (learner_id = auth.uid());

create policy "admin: manage streaks"
  on public.learning_streaks for all
  using (public.is_admin());

-- No learner insert/update policy — writes happen via service role
-- from the server-side streak calculation service only.

-- ── ACHIEVEMENTS (catalog) ──────────────────────────────────────────────
-- Static badge definitions. Readable by all authenticated learners.
create table if not exists public.achievements (
  achievement_id  uuid primary key default uuid_generate_v4(),
  code            text not null unique,
  app_id          text not null default 'academy' references platform.applications(app_id),
  title           text not null,
  description     text,
  icon            text,
  criteria        jsonb,
  sort_order      integer not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

create index idx_achievements_app on public.achievements(app_id);
create index idx_achievements_active on public.achievements(is_active);

alter table public.achievements enable row level security;

create policy "authenticated: read active achievements"
  on public.achievements for select
  using (is_active = true);

create policy "admin: manage achievements"
  on public.achievements for all
  using (public.is_admin());

insert into public.achievements (code, title, description, icon, criteria, sort_order) values
  ('first_lesson',       'First Lesson',       'Complete your first lesson',                    'GraduationCap', '{"type":"lesson_count","threshold":1}', 1),
  ('first_course',       'First Course',       'Complete your first course',                     'Trophy',        '{"type":"course_count","threshold":1}', 2),
  ('streak_7',           '7-Day Streak',       'Learn for 7 days in a row',                       'Flame',         '{"type":"streak_days","threshold":7}', 3),
  ('streak_30',          '30-Day Streak',      'Learn for 30 days in a row',                      'Flame',         '{"type":"streak_days","threshold":30}', 4),
  ('lessons_100',        '100 Lessons',        'Complete 100 lessons',                            'BookOpen',      '{"type":"lesson_count","threshold":100}', 5),
  ('assessment_master',  'Assessment Master',  'Score 90% or higher on 5 evaluations',            'Award',         '{"type":"high_scores","threshold":5,"min_score":90}', 6),
  ('course_completion',  'Course Completion',  'Complete 5 courses',                              'CheckCircle',   '{"type":"course_count","threshold":5}', 7),
  ('top_learner',        'Top Learner',        'Reach the top 10% of learning time this month',   'Star',          '{"type":"percentile","threshold":90}', 8)
on conflict (code) do nothing;

-- ── USER ACHIEVEMENTS (earned) ──────────────────────────────────────────
-- WRITE via service role only — same reasoning as learning_streaks.
create table if not exists public.user_achievements (
  user_achievement_id  uuid primary key default uuid_generate_v4(),
  learner_id           uuid not null references public.learners(learner_id) on delete cascade,
  achievement_id       uuid not null references public.achievements(achievement_id) on delete cascade,
  app_id               text not null default 'academy' references platform.applications(app_id),
  earned_at            timestamptz not null default now(),
  metadata             jsonb,
  unique (learner_id, achievement_id)
);

create index idx_user_achievements_learner on public.user_achievements(learner_id);
create index idx_user_achievements_earned  on public.user_achievements(learner_id, earned_at desc);

alter table public.user_achievements enable row level security;

create policy "learner: read own achievements"
  on public.user_achievements for select
  using (learner_id = auth.uid());

create policy "admin: manage user achievements"
  on public.user_achievements for all
  using (public.is_admin());

-- ── LEARNING SESSIONS ────────────────────────────────────────────────────
-- Session-level tracking for analytics: time spent, drop-off, velocity.
create table if not exists public.learning_sessions (
  session_id         uuid primary key default uuid_generate_v4(),
  learner_id         uuid not null references public.learners(learner_id) on delete cascade,
  app_id             text not null default 'academy' references platform.applications(app_id),
  course_id          uuid references public.courses(course_id),
  lesson_id          uuid references public.lessons(lesson_id),
  session_start      timestamptz not null default now(),
  session_end        timestamptz,
  duration_seconds   integer,
  device_type        text,
  created_at         timestamptz not null default now()
);

create index idx_sessions_learner       on public.learning_sessions(learner_id);
create index idx_sessions_course        on public.learning_sessions(course_id);
create index idx_sessions_learner_start on public.learning_sessions(learner_id, session_start desc);

alter table public.learning_sessions enable row level security;

create policy "learner: manage own sessions"
  on public.learning_sessions for all
  using (learner_id = auth.uid())
  with check (learner_id = auth.uid());

create policy "admin: read all sessions"
  on public.learning_sessions for select
  using (public.is_admin());

-- ── EXTEND BOOKMARKS ─────────────────────────────────────────────────────
-- No CHECK constraint existed on entity_type in 007 — adding one now for
-- data integrity, covering all entity types the frontend needs.
alter table public.bookmarks
  add constraint bookmarks_entity_type_check
  check (entity_type in ('course','lesson','resource','article','video','asset','knowledge_item'));

-- ── DASHBOARD PERFORMANCE VIEW ──────────────────────────────────────────
-- Backs GET /dashboard/recent-learning without repeated joins in API code.
create or replace view public.learner_recent_activity as
select
  lp.learner_id,
  lp.lesson_id,
  l.title             as lesson_title,
  lp.course_id,
  c.title              as course_title,
  lp.status,
  lp.resume_position_seconds,
  lp.last_accessed_at
from public.lesson_progress lp
join public.lessons l on l.lesson_id = lp.lesson_id
join public.courses c on c.course_id = lp.course_id
order by lp.last_accessed_at desc;

-- ── Verify ────────────────────────────────────────────────────────────
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'course_progress', 'lesson_progress', 'learning_streaks',
    'achievements', 'user_achievements', 'learning_sessions'
  )
order by table_name;
