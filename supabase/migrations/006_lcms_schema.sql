-- ═══════════════════════════════════════════════════════════════════
-- 006_lcms_schema.sql
-- Barada Digital Platform — Learning Content Management System
-- Domains, Assets, Courses, Modules, Lessons, Assessments,
-- Knowledge Items, Content Versions, Learner Analytics
-- Run AFTER 005_platform_services.sql
-- Applied: August 2026
-- ═══════════════════════════════════════════════════════════════════

-- ── Domains ───────────────────────────────────────────────────────
create table if not exists public.domains (
  domain_id        uuid primary key default uuid_generate_v4(),
  app_id           text not null references platform.applications(app_id),
  tenant_id        uuid,
  slug             text not null,
  name             text not null,
  description      text,
  tagline          text,
  icon             text,
  theme_color      text default '#E31E24',
  target_audience  text[],
  prerequisites    text[],
  sort_order       int not null default 0,
  status           text not null default 'draft'
                   check (status in ('draft','published','archived')),
  meta_title       text,
  meta_description text,
  owned_by         uuid references public.learners(learner_id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (app_id, slug)
);

create index idx_domains_app    on public.domains(app_id);
create index idx_domains_status on public.domains(status);

insert into public.domains (app_id, slug, name, description, theme_color, sort_order, status) values
  ('academy', 'ai-tools',           'AI Tools Mastery',     'Master the most powerful AI tools for professional use.',         '#1A7F56', 1, 'published'),
  ('academy', 'career-development', 'Career Development',   'LinkedIn, resume, interviews — the skills that advance careers.', '#0D183D', 2, 'published'),
  ('academy', 'ai-fundamentals',    'AI Fundamentals',      'Deep understanding of AI — from principles to practice.',          '#6B21A8', 3, 'published'),
  ('academy', 'productivity',       'Productivity & Tools', 'Excel, PowerPoint, and office tools powered by AI.',               '#0D7340', 4, 'published'),
  ('knowledge','articles',          'Articles',             'Professional insights and analysis.',                               '#0D183D', 1, 'published'),
  ('knowledge','research',          'Research',             'Industry research and data.',                                       '#374151', 2, 'published'),
  ('knowledge','templates',         'Templates',            'Ready-to-use professional templates.',                              '#0D7340', 3, 'published')
on conflict do nothing;

alter table public.domains enable row level security;
create policy "public: read published domains" on public.domains for select using (status = 'published');
create policy "admin: manage domains"          on public.domains for all using (public.is_admin());
create trigger set_domains_updated_at before update on public.domains
  for each row execute procedure public.set_updated_at();

-- ── Assets service ────────────────────────────────────────────────
create table if not exists public.assets (
  asset_id           uuid primary key default uuid_generate_v4(),
  app_id             text not null references platform.applications(app_id),
  tenant_id          uuid,
  asset_type         text not null
                     check (asset_type in (
                       'video','audio','transcript','pdf','ppt','prompt_pack',
                       'assignment','image','thumbnail','og_image','banner',
                       'download','script','subtitle','template_file',
                       'research_paper','whitepaper','case_study_doc','other'
                     )),
  title              text not null,
  description        text,
  content_text       text,
  provider_id        text not null default 'external'
                     references platform.storage_providers(provider_id),
  provider_ref       text,
  provider_config    jsonb not null default '{}',
  resolved_url       text,
  cdn_url            text,
  file_size_bytes    bigint,
  mime_type          text,
  duration_seconds   int,
  width_px           int,
  height_px          int,
  language_code      text not null default 'en-IN',
  has_captions       boolean not null default false,
  alt_text           text,
  aria_label         text,
  status             text not null default 'draft'
                     check (status in ('draft','review','approved','published','deprecated','archived')),
  is_downloadable    boolean not null default false,
  content_version    int not null default 1,
  meta_title         text,
  meta_description   text,
  generation_mode    text not null default 'human'
                     check (generation_mode in ('human','ai','hybrid')),
  job_id             uuid references platform.ai_jobs(job_id),
  factory_type       text,
  authored_by        uuid references public.learners(learner_id),
  reviewed_by        uuid references public.learners(learner_id),
  reviewed_at        timestamptz,
  approved_by        uuid references public.learners(learner_id),
  approved_at        timestamptz,
  published_by       uuid references public.learners(learner_id),
  published_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index idx_assets_app      on public.assets(app_id);
create index idx_assets_type     on public.assets(asset_type);
create index idx_assets_status   on public.assets(status);
create index idx_assets_provider on public.assets(provider_id);

create table if not exists public.asset_attachments (
  attachment_id    uuid primary key default uuid_generate_v4(),
  asset_id         uuid not null references public.assets(asset_id) on delete cascade,
  entity_type      text not null,
  entity_id        uuid not null,
  role             text not null default 'supplementary'
                   check (role in ('primary','supplementary','thumbnail','og_image','download')),
  sort_order       int not null default 0,
  created_at       timestamptz not null default now()
);

create index idx_attachments_entity on public.asset_attachments(entity_type, entity_id);
create index idx_attachments_asset  on public.asset_attachments(asset_id);

alter table public.assets            enable row level security;
alter table public.asset_attachments enable row level security;

create policy "public: read published assets"
  on public.assets for select using (status = 'published');
create policy "admin: manage assets"
  on public.assets for all using (public.is_admin());
create policy "admin: manage attachments"
  on public.asset_attachments for all using (public.is_admin());
create policy "public: read attachments for published assets"
  on public.asset_attachments for select
  using (exists (
    select 1 from public.assets a
    where a.asset_id = asset_attachments.asset_id and a.status = 'published'
  ));

create trigger set_assets_updated_at before update on public.assets
  for each row execute procedure public.set_updated_at();

-- ── Courses ───────────────────────────────────────────────────────
create table if not exists public.courses (
  course_id          uuid primary key default uuid_generate_v4(),
  app_id             text not null default 'academy' references platform.applications(app_id),
  domain_id          uuid references public.domains(domain_id),
  tenant_id          uuid,
  slug               text not null unique,
  title              text not null,
  subtitle           text,
  tagline            text,
  description        text,
  long_description   text,
  category           text not null,
  difficulty         text not null default 'Beginner'
                     check (difficulty in ('Beginner','Intermediate','Advanced','Expert')),
  icon               text,
  theme_color        text default '#E31E24',
  is_free            boolean not null default true,
  cert_price_paise   int not null default 29900,
  target_audience    text[],
  prerequisites      text[],
  outcomes           text[],
  skills_covered     text[],
  estimated_hours    numeric(4,1),
  status             text not null default 'draft'
                     check (status in ('draft','review','approved','published','deprecated','archived')),
  visibility         text not null default 'public'
                     check (visibility in ('public','authenticated','enrolled','private')),
  sort_order         int not null default 0,
  is_featured        boolean not null default false,
  content_version    int not null default 1,
  locale             text not null default 'en-IN',
  available_locales  text[] default array['en-IN'],
  has_captions       boolean not null default false,
  has_audio          boolean not null default false,
  has_transcript     boolean not null default false,
  meta_title         text,
  meta_description   text,
  schema_json        jsonb,
  generation_mode    text not null default 'human'
                     check (generation_mode in ('human','ai','hybrid')),
  job_id             uuid references platform.ai_jobs(job_id),
  script_brief       text,
  authored_by        uuid references public.learners(learner_id),
  reviewed_by        uuid references public.learners(learner_id),
  reviewed_at        timestamptz,
  approved_by        uuid references public.learners(learner_id),
  approved_at        timestamptz,
  published_by       uuid references public.learners(learner_id),
  published_at       timestamptz,
  deprecated_at      timestamptz,
  deprecated_reason  text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index idx_courses_slug     on public.courses(slug);
create index idx_courses_domain   on public.courses(domain_id);
create index idx_courses_status   on public.courses(status);
create index idx_courses_category on public.courses(category);

alter table public.courses enable row level security;
create policy "public: read published courses"
  on public.courses for select using (status = 'published');
create policy "admin: manage courses"
  on public.courses for all using (public.is_admin());
create trigger set_courses_updated_at before update on public.courses
  for each row execute procedure public.set_updated_at();

-- ── Modules ───────────────────────────────────────────────────────
create table if not exists public.modules (
  module_id          uuid primary key default uuid_generate_v4(),
  course_id          uuid not null references public.courses(course_id) on delete cascade,
  module_number      int not null check (module_number > 0),
  title              text not null,
  description        text,
  objectives         text[],
  sort_order         int not null default 0,
  status             text not null default 'draft'
                     check (status in ('draft','review','approved','published','deprecated','archived')),
  content_version    int not null default 1,
  locale             text not null default 'en-IN',
  generation_mode    text not null default 'human'
                     check (generation_mode in ('human','ai','hybrid')),
  job_id             uuid references platform.ai_jobs(job_id),
  authored_by        uuid references public.learners(learner_id),
  reviewed_by        uuid references public.learners(learner_id),
  approved_by        uuid references public.learners(learner_id),
  published_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (course_id, module_number)
);

create index idx_modules_course on public.modules(course_id);
create index idx_modules_status on public.modules(status);

alter table public.modules enable row level security;
create policy "public: read published modules"
  on public.modules for select using (status = 'published');
create policy "admin: manage modules"
  on public.modules for all using (public.is_admin());
create trigger set_modules_updated_at before update on public.modules
  for each row execute procedure public.set_updated_at();

-- ── Lessons ───────────────────────────────────────────────────────
create table if not exists public.lessons (
  lesson_id          uuid primary key default uuid_generate_v4(),
  module_id          uuid not null references public.modules(module_id) on delete cascade,
  course_id          uuid not null references public.courses(course_id) on delete cascade,
  lesson_number      int not null check (lesson_number > 0),
  title              text not null,
  description        text,
  body               text,
  duration_seconds   int,
  sort_order         int not null default 0,
  status             text not null default 'draft'
                     check (status in ('draft','review','approved','published','deprecated','archived')),
  is_free_preview    boolean not null default false,
  content_version    int not null default 1,
  objectives         text[],
  key_points         text[],
  practice_task      text,
  instructor_notes   text,
  script_status      text not null default 'none'
                     check (script_status in ('none','drafted','reviewed','approved','recorded','published')),
  script_asset_id    uuid,
  locale             text not null default 'en-IN',
  has_captions       boolean not null default false,
  has_audio          boolean not null default false,
  generation_mode    text not null default 'human'
                     check (generation_mode in ('human','ai','hybrid')),
  job_id             uuid references platform.ai_jobs(job_id),
  authored_by        uuid references public.learners(learner_id),
  reviewed_by        uuid references public.learners(learner_id),
  reviewed_at        timestamptz,
  approved_by        uuid references public.learners(learner_id),
  approved_at        timestamptz,
  published_by       uuid references public.learners(learner_id),
  published_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (course_id, module_id, lesson_number)
);

create index idx_lessons_module on public.lessons(module_id);
create index idx_lessons_course on public.lessons(course_id);
create index idx_lessons_status on public.lessons(status);

alter table public.lessons enable row level security;
create policy "public: free preview lessons"
  on public.lessons for select
  using (status = 'published' and is_free_preview = true);
create policy "learner: enrolled course lessons"
  on public.lessons for select
  using (
    status = 'published' and
    exists (
      select 1 from public.enrollments e
      where e.learner_id = auth.uid()
        and e.course_slug = lessons.course_id::text
    )
  );
create policy "admin: manage lessons"
  on public.lessons for all using (public.is_admin());
create trigger set_lessons_updated_at before update on public.lessons
  for each row execute procedure public.set_updated_at();

-- ── Assessments ───────────────────────────────────────────────────
create table if not exists public.assessments (
  assessment_id      uuid primary key default uuid_generate_v4(),
  app_id             text not null default 'academy',
  course_id          uuid references public.courses(course_id),
  lesson_id          uuid references public.lessons(lesson_id),
  module_id          uuid references public.modules(module_id),
  title              text not null,
  description        text,
  assessment_type    text not null default 'final_exam'
                     check (assessment_type in ('lesson_check','module_quiz','final_exam','practice','survey')),
  pass_threshold     int not null default 60,
  max_attempts       int,
  time_limit_seconds int,
  randomise_questions boolean not null default false,
  randomise_options   boolean not null default false,
  show_correct_after  text not null default 'immediately'
                      check (show_correct_after in ('immediately','after_pass','never')),
  status             text not null default 'draft'
                     check (status in ('draft','published','archived')),
  generation_mode    text not null default 'human'
                     check (generation_mode in ('human','ai','hybrid')),
  job_id             uuid references platform.ai_jobs(job_id),
  authored_by        uuid references public.learners(learner_id),
  published_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table if not exists public.assessment_questions (
  question_id        uuid primary key default uuid_generate_v4(),
  assessment_id      uuid not null references public.assessments(assessment_id) on delete cascade,
  question_number    int not null,
  question_type      text not null
                     check (question_type in (
                       'mcq','multi_select','true_false','fill_blank',
                       'short_answer','ordering','matching','code'
                     )),
  question_text      text not null,
  explanation        text,
  hint               text,
  points             int not null default 1,
  difficulty         text default 'medium'
                     check (difficulty in ('easy','medium','hard')),
  tags               text[],
  sort_order         int not null default 0,
  generation_mode    text not null default 'human'
                     check (generation_mode in ('human','ai','hybrid')),
  job_id             uuid references platform.ai_jobs(job_id),
  created_at         timestamptz not null default now()
);

create table if not exists public.assessment_options (
  option_id          uuid primary key default uuid_generate_v4(),
  question_id        uuid not null references public.assessment_questions(question_id) on delete cascade,
  option_text        text not null,
  is_correct         boolean not null default false,
  sort_order         int not null default 0,
  match_target       text,
  explanation        text
);

create table if not exists public.assessment_attempts (
  attempt_id         uuid primary key default uuid_generate_v4(),
  assessment_id      uuid not null references public.assessments(assessment_id),
  learner_id         uuid not null references public.learners(learner_id),
  course_id          uuid references public.courses(course_id),
  attempt_number     int not null default 1,
  status             text not null default 'in_progress'
                     check (status in ('in_progress','submitted','graded','abandoned')),
  score              int check (score between 0 and 100),
  points_earned      int,
  points_possible    int,
  passed             boolean,
  time_taken_seconds int,
  answers            jsonb not null default '{}',
  feedback           text,
  attempted_at       timestamptz not null default now(),
  submitted_at       timestamptz,
  graded_at          timestamptz,
  graded_by          uuid
);

create index idx_assessments_course   on public.assessments(course_id);
create index idx_questions_assessment on public.assessment_questions(assessment_id);
create index idx_options_question     on public.assessment_options(question_id);
create index idx_attempts_learner     on public.assessment_attempts(learner_id);
create index idx_attempts_assessment  on public.assessment_attempts(assessment_id);

alter table public.assessments           enable row level security;
alter table public.assessment_questions  enable row level security;
alter table public.assessment_options    enable row level security;
alter table public.assessment_attempts   enable row level security;

create policy "public: read published assessments"
  on public.assessments for select using (status = 'published');
create policy "admin: manage assessments"
  on public.assessments for all using (public.is_admin());
create policy "public: read questions"
  on public.assessment_questions for select
  using (exists (
    select 1 from public.assessments a
    where a.assessment_id = assessment_questions.assessment_id and a.status = 'published'
  ));
create policy "admin: manage questions"
  on public.assessment_questions for all using (public.is_admin());
create policy "public: read options"
  on public.assessment_options for select
  using (exists (
    select 1 from public.assessment_questions q
    join public.assessments a on a.assessment_id = q.assessment_id
    where q.question_id = assessment_options.question_id and a.status = 'published'
  ));
create policy "admin: manage options"
  on public.assessment_options for all using (public.is_admin());
create policy "learner: own attempts"
  on public.assessment_attempts for select using (learner_id = auth.uid());
create policy "learner: insert attempt"
  on public.assessment_attempts for insert with check (learner_id = auth.uid());
create policy "admin: manage attempts"
  on public.assessment_attempts for all using (public.is_admin());

-- ── Knowledge Items ───────────────────────────────────────────────
create table if not exists public.knowledge_items (
  item_id            uuid primary key default uuid_generate_v4(),
  app_id             text not null default 'knowledge' references platform.applications(app_id),
  domain_id          uuid references public.domains(domain_id),
  tenant_id          uuid,
  item_type          text not null
                     check (item_type in (
                       'article','template','research','whitepaper','case_study',
                       'tool_review','prompt','download','webinar','event'
                     )),
  slug               text not null,
  title              text not null,
  subtitle           text,
  description        text,
  body               text,
  excerpt            text,
  tags               text[],
  author_name        text,
  read_time_minutes  int,
  status             text not null default 'draft'
                     check (status in ('draft','review','approved','published','deprecated','archived')),
  visibility         text not null default 'public'
                     check (visibility in ('public','authenticated','subscribers')),
  is_featured        boolean not null default false,
  is_free            boolean not null default true,
  sort_order         int not null default 0,
  content_version    int not null default 1,
  locale             text not null default 'en-IN',
  meta_title         text,
  meta_description   text,
  generation_mode    text not null default 'human'
                     check (generation_mode in ('human','ai','hybrid')),
  job_id             uuid references platform.ai_jobs(job_id),
  authored_by        uuid references public.learners(learner_id),
  reviewed_by        uuid references public.learners(learner_id),
  reviewed_at        timestamptz,
  approved_by        uuid references public.learners(learner_id),
  published_by       uuid references public.learners(learner_id),
  published_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (app_id, slug)
);

create index idx_knowledge_app    on public.knowledge_items(app_id);
create index idx_knowledge_type   on public.knowledge_items(item_type);
create index idx_knowledge_status on public.knowledge_items(status);
create index idx_knowledge_domain on public.knowledge_items(domain_id);

alter table public.knowledge_items enable row level security;
create policy "public: read published knowledge"
  on public.knowledge_items for select using (status = 'published');
create policy "admin: manage knowledge"
  on public.knowledge_items for all using (public.is_admin());
create trigger set_knowledge_updated_at before update on public.knowledge_items
  for each row execute procedure public.set_updated_at();

-- ── Content Versions ──────────────────────────────────────────────
create table if not exists public.content_versions (
  version_id       uuid primary key default uuid_generate_v4(),
  app_id           text not null references platform.applications(app_id),
  entity_type      text not null,
  entity_id        uuid not null,
  version_number   int not null,
  status_at_version text not null,
  snapshot         jsonb not null,
  change_summary   text,
  change_type      text not null default 'update'
                   check (change_type in ('create','update','publish','deprecate','archive','restore')),
  generation_mode  text not null default 'human'
                   check (generation_mode in ('human','ai','hybrid')),
  job_id           uuid references platform.ai_jobs(job_id),
  authored_by      uuid references public.learners(learner_id),
  reviewed_by      uuid references public.learners(learner_id),
  approved_by      uuid references public.learners(learner_id),
  published_by     uuid references public.learners(learner_id),
  created_at       timestamptz not null default now()
);

create index if not exists idx_versions_entity on public.content_versions(entity_type, entity_id);
create index if not exists idx_versions_app    on public.content_versions(app_id);
create unique index if not exists idx_versions_unique
  on public.content_versions(entity_type, entity_id, version_number);

alter table public.content_versions enable row level security;
create policy "admin: read content versions"
  on public.content_versions for select using (public.is_admin());
create policy "system: insert versions"
  on public.content_versions for insert with check (true);

-- ── Learner Analytics ─────────────────────────────────────────────
create table if not exists public.learner_analytics (
  analytics_id            uuid primary key default uuid_generate_v4(),
  learner_id              uuid not null references public.learners(learner_id) on delete cascade,
  total_watch_seconds     bigint not null default 0,
  total_lessons_completed int not null default 0,
  current_streak_days     int not null default 0,
  longest_streak_days     int not null default 0,
  last_activity_date      date,
  avg_lesson_duration_s   int,
  lessons_this_week       int not null default 0,
  lessons_this_month      int not null default 0,
  preferred_time_of_day   text,
  preferred_learning_days text[],
  recommended_course_ids  uuid[],
  updated_at              timestamptz not null default now(),
  unique (learner_id)
);

alter table public.learner_analytics enable row level security;
create policy "learner: own analytics"
  on public.learner_analytics for select using (learner_id = auth.uid());
create policy "system: manage analytics"
  on public.learner_analytics for all using (public.is_admin());

-- ── Backward compatibility ────────────────────────────────────────
alter table public.enrollments
  add column if not exists course_id uuid references public.courses(course_id);
alter table public.lesson_progress
  add column if not exists course_id uuid references public.courses(course_id),
  add column if not exists lesson_id uuid references public.lessons(lesson_id);
alter table public.certificates
  add column if not exists course_id uuid references public.courses(course_id);

create index if not exists idx_enrollments_course_uuid on public.enrollments(course_id);
create index if not exists idx_progress_lesson_uuid    on public.lesson_progress(lesson_id);
