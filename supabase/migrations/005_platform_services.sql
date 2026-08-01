-- ═══════════════════════════════════════════════════════════════════
-- 005_platform_services.sql
-- Barada Digital Platform — Core Platform Services
-- ADR-006: Platform Orchestrator
-- ADR-007: Event-Driven Architecture
-- ADR-008: Modular AI Factory
-- ADR-009: Observability Tables
-- Run AFTER 004_fix_certificate_rls.sql
-- Run BEFORE 006_lcms_schema.sql
-- Applied: August 2026
-- ═══════════════════════════════════════════════════════════════════

-- ── Platform schema ───────────────────────────────────────────────
create schema if not exists platform;

-- ── Application registry ──────────────────────────────────────────
create table if not exists platform.applications (
  app_id          text primary key,
  display_name    text not null,
  description     text,
  base_path       text not null,
  status          text not null default 'reserved'
                  check (status in ('active','beta','reserved','deprecated')),
  launched_at     timestamptz,
  sort_order      int not null default 0
);

INSERT INTO platform.applications VALUES
  ('academy',       'Barada Academy',      'AI and professional learning platform',         '/academy',        'active',   '2025-01-01', 1),
  ('knowledge',     'Barada Knowledge',    'Articles, research, templates, tools hub',      '/resources',      'active',   '2025-01-01', 2),
  ('community',     'Barada Community',    'Events, webinars, newsletter, Discord',          '/community',      'active',   '2025-01-01', 3),
  ('partnerschaft', 'Partnerschaft',       'B2B lean mediation platform',                   '/partnerschaft',  'active',   '2025-01-01', 4),
  ('technology',    'Barada Technology',   'AI products and technology platforms',           '/technology',     'reserved', null,         5),
  ('consulting',    'Barada Consulting',   'Corporate transformation advisory',              '/consulting',     'reserved', null,         6),
  ('ayushman',      'Ayushman',            'Social impact and autism awareness',             '/ayushman',       'reserved', null,         7),
  ('platform',      'Barada Platform',     'Internal: admin, AI factory, analytics',         '/platform',       'active',   '2025-01-01', 99);

-- ── Storage providers ─────────────────────────────────────────────
create table if not exists platform.storage_providers (
  provider_id      text primary key,
  display_name     text not null,
  provider_type    text not null
                   check (provider_type in ('video_host','file_store','document','cdn','ai_output')),
  url_pattern      text,
  requires_auth    boolean not null default false,
  is_active        boolean not null default true,
  config           jsonb not null default '{}'
);

insert into platform.storage_providers values
  ('youtube',  'YouTube',          'video_host',  'https://www.youtube.com/embed/{ref}',                               false, true, '{}'),
  ('supabase', 'Supabase Storage', 'file_store',  '{project_url}/storage/v1/object/public/{bucket}/{ref}',            false, true, '{}'),
  ('github',   'GitHub',           'file_store',  'https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{ref}',  true,  true, '{}'),
  ('r2',       'Cloudflare R2',    'cdn',         'https://{account_id}.r2.cloudflarestorage.com/{ref}',              true,  false,'{}'),
  ('s3',       'AWS S3',           'file_store',  'https://{bucket}.s3.{region}.amazonaws.com/{ref}',                 true,  false,'{}'),
  ('gdrive',   'Google Drive',     'document',    'https://drive.google.com/file/d/{ref}/view',                        true,  false,'{}'),
  ('external', 'External URL',     'file_store',  '{ref}',                                                             false, true, '{}')
on conflict do nothing;

-- ── ADR-007: Event log ────────────────────────────────────────────
create table if not exists platform.events (
  event_id         uuid primary key default uuid_generate_v4(),
  event_type       text not null,
  app_id           text references platform.applications(app_id),
  tenant_id        uuid,
  actor_id         uuid,
  actor_type       text default 'learner'
                   check (actor_type in ('learner','admin','system','ai_factory')),
  entity_type      text,
  entity_id        uuid,
  payload          jsonb not null default '{}',
  metadata         jsonb not null default '{}',
  correlation_id   uuid,
  published_at     timestamptz not null default now()
);

create index idx_events_type        on platform.events(event_type);
create index idx_events_app         on platform.events(app_id);
create index idx_events_actor       on platform.events(actor_id);
create index idx_events_entity      on platform.events(entity_type, entity_id);
create index idx_events_correlation on platform.events(correlation_id);
create index idx_events_published   on platform.events(published_at desc);

alter table platform.events enable row level security;
create policy "system: insert events" on platform.events for insert with check (true);
create policy "admin: read events"    on platform.events for select using (public.is_admin());

-- ── ADR-006: Orchestrator ─────────────────────────────────────────
create table if not exists platform.workflows (
  workflow_id      text primary key,
  display_name     text not null,
  description      text,
  trigger_event    text,
  step_definitions jsonb not null default '[]',
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

insert into platform.workflows (workflow_id, display_name, description, trigger_event, step_definitions) values
  ('content.publish',     'Publish Content',     'Validate → version → index → notify',             'platform.content.approved',   '[]'),
  ('ai.generate_course',  'Generate Course',     'Brief → factory → review gate → publish',          null,                          '[]'),
  ('learner.onboard',     'Learner Onboarding',  'Register → welcome email → analytics → recommend', 'auth.learner.registered',     '[]'),
  ('certificate.issue',   'Issue Certificate',   'Verify → generate PDF → email → audit',            'commerce.payment.succeeded',  '[]'),
  ('search.index',        'Index for Search',    'Extract → tsvector → upsert search_index',         'platform.content.published',  '[]')
on conflict do nothing;

create table if not exists platform.workflow_runs (
  run_id           uuid primary key default uuid_generate_v4(),
  workflow_id      text not null references platform.workflows(workflow_id),
  app_id           text references platform.applications(app_id),
  status           text not null default 'running'
                   check (status in ('running','completed','failed','cancelled','waiting')),
  trigger_event_id uuid references platform.events(event_id),
  trigger_payload  jsonb not null default '{}',
  context          jsonb not null default '{}',
  current_step     int not null default 0,
  total_steps      int,
  error_message    text,
  triggered_by     uuid,
  started_at       timestamptz not null default now(),
  completed_at     timestamptz,
  created_at       timestamptz not null default now()
);

create table if not exists platform.workflow_step_runs (
  step_run_id      uuid primary key default uuid_generate_v4(),
  run_id           uuid not null references platform.workflow_runs(run_id) on delete cascade,
  step_number      int not null,
  step_name        text not null,
  status           text not null default 'pending'
                   check (status in ('pending','running','completed','failed','skipped')),
  input            jsonb not null default '{}',
  output           jsonb not null default '{}',
  error_message    text,
  duration_ms      int,
  started_at       timestamptz,
  completed_at     timestamptz
);

create index idx_workflow_runs_workflow on platform.workflow_runs(workflow_id);
create index idx_workflow_runs_status   on platform.workflow_runs(status);
create index idx_step_runs_run          on platform.workflow_step_runs(run_id);

alter table platform.workflow_runs      enable row level security;
alter table platform.workflow_step_runs enable row level security;
create policy "admin: manage workflows" on platform.workflow_runs      for all using (public.is_admin());
create policy "system: insert runs"     on platform.workflow_runs      for insert with check (true);
create policy "admin: read step runs"   on platform.workflow_step_runs for all using (public.is_admin());

-- ── ADR-008: Modular AI Factory ───────────────────────────────────
create table if not exists platform.ai_factories (
  factory_id       text primary key,
  display_name     text not null,
  description      text,
  app_ids          text[],
  input_schema     jsonb not null default '{}',
  output_types     text[],
  default_model    text,
  avg_cost_tokens  int,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

insert into platform.ai_factories
  (factory_id, display_name, app_ids, output_types, default_model, is_active)
values
  ('course',        'Course Factory',         array['academy'],                        array['course'],         'claude-sonnet-4-6', true),
  ('video',         'Video Factory',          array['academy'],                        array['script'],         'claude-sonnet-4-6', true),
  ('voice',         'Voice Factory',          array['academy'],                        array['audio'],          'claude-sonnet-4-6', false),
  ('presentation',  'Presentation Factory',   array['academy','consulting'],           array['ppt'],            'claude-sonnet-4-6', true),
  ('assessment',    'Assessment Factory',     array['academy'],                        array['assessment'],     'claude-sonnet-4-6', true),
  ('certificate',   'Certificate Factory',    array['academy','platform'],             array['pdf'],            'claude-sonnet-4-6', false),
  ('marketing',     'Marketing Factory',      array['academy','knowledge','community'],array['social','email'], 'claude-sonnet-4-6', true),
  ('document',      'Document Factory',       array['consulting','partnerschaft'],      array['pdf'],            'claude-sonnet-4-6', false),
  ('email',         'Email Factory',          array['academy','community'],            array['email'],          'claude-sonnet-4-6', true),
  ('social',        'Social Media Factory',   array['academy','knowledge'],            array['social'],         'claude-sonnet-4-6', true),
  ('resume',        'Resume Factory',         array['academy'],                        array['pdf'],            'claude-sonnet-4-6', false),
  ('interview',     'Interview Factory',      array['academy'],                        array['assessment'],     'claude-sonnet-4-6', false),
  ('knowledge_base','Knowledge Base Factory', array['platform'],                       array['knowledge_item'], 'claude-sonnet-4-6', false),
  ('analytics',     'Analytics Factory',      array['platform'],                       array['report'],         'claude-sonnet-4-6', false),
  ('seo',           'SEO Factory',            array['academy','knowledge'],            array['meta'],           'claude-sonnet-4-6', true),
  ('content',       'Content Factory',        array['knowledge'],                      array['knowledge_item'], 'claude-sonnet-4-6', false),
  ('image',         'Image Factory',          array['academy','knowledge'],            array['image'],          'claude-sonnet-4-6', false),
  ('proposal',      'Proposal Factory',       array['consulting'],                     array['pdf'],            'claude-sonnet-4-6', false),
  ('website',       'Website Factory',        array['platform'],                       array['code'],           'claude-sonnet-4-6', false)
on conflict do nothing;

create table if not exists platform.ai_prompts (
  prompt_id        uuid primary key default uuid_generate_v4(),
  factory_id       text not null references platform.ai_factories(factory_id),
  version          int not null default 1,
  name             text not null,
  description      text,
  system_prompt    text not null,
  user_prompt_template text not null,
  variables        text[],
  model            text,
  temperature      numeric(3,2) default 0.7,
  max_tokens       int default 4000,
  is_active        boolean not null default false,
  is_default       boolean not null default false,
  performance_notes text,
  authored_by      uuid references public.learners(learner_id),
  activated_at     timestamptz,
  created_at       timestamptz not null default now(),
  unique (factory_id, version)
);

create table if not exists platform.ai_jobs (
  job_id           uuid primary key default uuid_generate_v4(),
  factory_id       text not null references platform.ai_factories(factory_id),
  prompt_id        uuid references platform.ai_prompts(prompt_id),
  app_id           text not null references platform.applications(app_id),
  workflow_run_id  uuid references platform.workflow_runs(run_id),
  status           text not null default 'queued'
                   check (status in ('queued','running','completed','failed','cancelled','pending_review')),
  priority         int not null default 5,
  model            text,
  input_params     jsonb not null default '{}',
  raw_output       text,
  parsed_output    jsonb,
  output_entity_type text,
  output_entity_id   uuid,
  tokens_input     int,
  tokens_output    int,
  cost_usd_micro   bigint,
  duration_ms      int,
  retry_count      int not null default 0,
  max_retries      int not null default 3,
  error_message    text,
  triggered_by     uuid references public.learners(learner_id),
  reviewed_by      uuid references public.learners(learner_id),
  approved_by      uuid references public.learners(learner_id),
  approved_at      timestamptz,
  queued_at        timestamptz not null default now(),
  started_at       timestamptz,
  completed_at     timestamptz
);

create table if not exists platform.ai_job_steps (
  step_id          uuid primary key default uuid_generate_v4(),
  job_id           uuid not null references platform.ai_jobs(job_id) on delete cascade,
  step_number      int not null,
  step_name        text not null,
  model_call       jsonb,
  model_response   text,
  tokens_used      int,
  duration_ms      int,
  status           text not null default 'pending',
  error_message    text,
  created_at       timestamptz not null default now()
);

create index idx_ai_jobs_factory  on platform.ai_jobs(factory_id);
create index idx_ai_jobs_app      on platform.ai_jobs(app_id);
create index idx_ai_jobs_status   on platform.ai_jobs(status);
create index idx_ai_job_steps_job on platform.ai_job_steps(job_id);
create index idx_prompts_factory  on platform.ai_prompts(factory_id);

alter table platform.ai_factories enable row level security;
alter table platform.ai_prompts   enable row level security;
alter table platform.ai_jobs      enable row level security;
alter table platform.ai_job_steps enable row level security;

create policy "public: read factories"  on platform.ai_factories for select using (is_active = true);
create policy "admin: manage factories" on platform.ai_factories for all using (public.is_admin());
create policy "admin: manage prompts"   on platform.ai_prompts   for all using (public.is_admin());
create policy "admin: manage ai jobs"   on platform.ai_jobs      for all using (public.is_admin());
create policy "system: insert ai jobs"  on platform.ai_jobs      for insert with check (true);

-- ── ADR-009: Observability ────────────────────────────────────────
create table if not exists platform.logs (
  log_id           uuid primary key default uuid_generate_v4(),
  app_id           text references platform.applications(app_id),
  level            text not null default 'info'
                   check (level in ('debug','info','warn','error','fatal')),
  message          text not null,
  context          jsonb not null default '{}',
  request_id       uuid,
  user_id          uuid,
  route            text,
  duration_ms      int,
  logged_at        timestamptz not null default now()
);

create table if not exists platform.metrics (
  metric_id        uuid primary key default uuid_generate_v4(),
  app_id           text references platform.applications(app_id),
  metric_name      text not null,
  metric_value     numeric not null,
  unit             text,
  dimensions       jsonb not null default '{}',
  recorded_at      timestamptz not null default now()
);

create table if not exists platform.health_checks (
  check_id         uuid primary key default uuid_generate_v4(),
  service          text not null,
  status           text not null check (status in ('healthy','degraded','down')),
  response_time_ms int,
  details          jsonb not null default '{}',
  checked_at       timestamptz not null default now()
);

create table if not exists platform.error_events (
  error_id         uuid primary key default uuid_generate_v4(),
  app_id           text references platform.applications(app_id),
  error_type       text not null,
  error_code       text,
  message          text not null,
  stack_trace      text,
  context          jsonb not null default '{}',
  request_id       uuid,
  user_id          uuid,
  route            text,
  severity         text not null default 'error'
                   check (severity in ('low','medium','high','critical')),
  is_resolved      boolean not null default false,
  resolved_at      timestamptz,
  resolved_by      uuid,
  occurred_at      timestamptz not null default now()
);

create index idx_logs_app       on platform.logs(app_id);
create index idx_logs_level     on platform.logs(level);
create index idx_logs_time      on platform.logs(logged_at desc);
create index idx_metrics_name   on platform.metrics(metric_name);
create index idx_metrics_app    on platform.metrics(app_id);
create index idx_metrics_time   on platform.metrics(recorded_at desc);
create index idx_health_service on platform.health_checks(service);
create index idx_health_time    on platform.health_checks(checked_at desc);
create index idx_errors_app     on platform.error_events(app_id);
create index idx_errors_severity on platform.error_events(severity);
create index idx_errors_time    on platform.error_events(occurred_at desc);

alter table platform.logs          enable row level security;
alter table platform.metrics       enable row level security;
alter table platform.health_checks enable row level security;
alter table platform.error_events  enable row level security;

create policy "admin: read logs"       on platform.logs          for select using (public.is_admin());
create policy "system: insert logs"    on platform.logs          for insert with check (true);
create policy "admin: read metrics"    on platform.metrics       for select using (public.is_admin());
create policy "system: insert metrics" on platform.metrics       for insert with check (true);
create policy "admin: read health"     on platform.health_checks for select using (public.is_admin());
create policy "system: insert health"  on platform.health_checks for insert with check (true);
create policy "admin: manage errors"   on platform.error_events  for all using (public.is_admin());
create policy "system: insert errors"  on platform.error_events  for insert with check (true);

-- ── Integrations registry ─────────────────────────────────────────
create table if not exists platform.integrations (
  integration_id   text primary key,
  display_name     text not null,
  category         text not null
                   check (category in (
                     'payment','email','analytics','video','storage',
                     'ai_model','crm','hrms','lms_export','social','sms','other'
                   )),
  homepage_url     text,
  docs_url         text,
  is_active        boolean not null default true,
  config_schema    jsonb not null default '{}',
  created_at       timestamptz not null default now()
);

insert into platform.integrations
  (integration_id, display_name, category, homepage_url, is_active)
values
  ('razorpay',   'Razorpay',            'payment',   'https://razorpay.com',          true),
  ('resend',     'Resend',              'email',     'https://resend.com',            true),
  ('ga4',        'Google Analytics 4',  'analytics', 'https://analytics.google.com',  true),
  ('clarity',    'Microsoft Clarity',   'analytics', 'https://clarity.microsoft.com', true),
  ('youtube',    'YouTube',             'video',     'https://youtube.com',           true),
  ('supabase',   'Supabase',            'storage',   'https://supabase.com',          true),
  ('claude',     'Anthropic Claude',    'ai_model',  'https://anthropic.com',         true),
  ('elevenlabs', 'ElevenLabs',          'ai_model',  'https://elevenlabs.io',         false),
  ('r2',         'Cloudflare R2',       'storage',   'https://cloudflare.com',        false)
on conflict do nothing;

create table if not exists platform.integration_configs (
  config_id        uuid primary key default uuid_generate_v4(),
  integration_id   text not null references platform.integrations(integration_id),
  app_id           text not null references platform.applications(app_id),
  tenant_id        uuid,
  config           jsonb not null default '{}',
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (integration_id, app_id)
);

alter table platform.integrations        enable row level security;
alter table platform.integration_configs enable row level security;
create policy "public: read integrations" on platform.integrations        for select using (true);
create policy "admin: manage int configs" on platform.integration_configs for all using (public.is_admin());

-- ── Search index ──────────────────────────────────────────────────
create table if not exists platform.search_index (
  index_id         uuid primary key default uuid_generate_v4(),
  app_id           text not null references platform.applications(app_id),
  entity_type      text not null,
  entity_id        uuid not null,
  entity_slug      text,
  title            text not null,
  description      text,
  body             text,
  tags             text[],
  category         text,
  search_vector    tsvector,
  is_public        boolean not null default true,
  status           text not null,
  language_code    text not null default 'en-IN',
  indexed_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_search_app    on platform.search_index(app_id);
create index idx_search_entity on platform.search_index(entity_type, entity_id);
create index idx_search_vector on platform.search_index using gin(search_vector);

create or replace function platform.update_search_vector()
returns trigger language plpgsql as $$
begin
  new.search_vector := to_tsvector('english',
    coalesce(new.title, '') || ' ' ||
    coalesce(new.description, '') || ' ' ||
    coalesce(new.body, '') || ' ' ||
    coalesce(array_to_string(new.tags, ' '), '')
  );
  return new;
end;
$$;

create trigger search_vector_update
  before insert or update on platform.search_index
  for each row execute procedure platform.update_search_vector();

alter table platform.search_index enable row level security;
create policy "public: read public index"  on platform.search_index for select using (is_public = true);
create policy "admin: manage search index" on platform.search_index for all using (public.is_admin());
create policy "system: insert search"      on platform.search_index for insert with check (true);
