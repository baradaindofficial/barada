-- ═══════════════════════════════════════════════════════════════════
-- 007_sprint43_resources.sql
-- Barada Digital Platform — Learning Resources
-- Sprint 4.3: download_history, bookmarks
-- Note: resources use existing public.assets + public.asset_attachments
-- Prisma is NOT used — this platform uses Supabase SQL migrations (ADR-001)
-- Run AFTER 006_lcms_schema.sql
-- ═══════════════════════════════════════════════════════════════════

-- ── DOWNLOAD HISTORY ──────────────────────────────────────────────
-- Tracks every resource download by learner for analytics.
-- Platform-wide: works for any app, any entity type.
create table if not exists public.download_history (
  download_id      uuid primary key default uuid_generate_v4(),
  asset_id         uuid not null references public.assets(asset_id),
  learner_id       uuid not null references public.learners(learner_id) on delete cascade,
  app_id           text not null default 'academy' references platform.applications(app_id),
  entity_type      text,           -- 'lesson' | 'course' | 'knowledge_item' etc.
  entity_id        uuid,           -- which entity the resource was downloaded from
  ip_hash          text,           -- hashed IP for fraud detection, not stored raw
  user_agent       text,           -- browser/device for analytics
  download_source  text default 'direct'
                   check (download_source in ('direct','lesson','dashboard','search')),
  downloaded_at    timestamptz not null default now()
);

create index idx_downloads_asset    on public.download_history(asset_id);
create index idx_downloads_learner  on public.download_history(learner_id);
create index idx_downloads_entity   on public.download_history(entity_type, entity_id);
create index idx_downloads_at       on public.download_history(downloaded_at desc);
create index idx_downloads_app      on public.download_history(app_id);

alter table public.download_history enable row level security;

create policy "learner: own download history"
  on public.download_history for select
  using (learner_id = auth.uid());

create policy "learner: insert download"
  on public.download_history for insert
  with check (learner_id = auth.uid());

create policy "admin: manage downloads"
  on public.download_history for all
  using (public.is_admin());

-- ── BOOKMARKS ─────────────────────────────────────────────────────
-- Learner bookmarks on any platform entity.
-- Platform-wide: lessons, articles, knowledge items, etc.
create table if not exists public.bookmarks (
  bookmark_id      uuid primary key default uuid_generate_v4(),
  learner_id       uuid not null references public.learners(learner_id) on delete cascade,
  app_id           text not null default 'academy' references platform.applications(app_id),
  entity_type      text not null,   -- 'lesson' | 'asset' | 'course' | 'knowledge_item'
  entity_id        uuid not null,
  entity_title     text,            -- cached title for quick display without joins
  entity_url       text,            -- cached URL for navigation
  notes            text,            -- optional learner note on the bookmark
  created_at       timestamptz not null default now(),
  unique (learner_id, entity_type, entity_id)
);

create index idx_bookmarks_learner on public.bookmarks(learner_id);
create index idx_bookmarks_entity  on public.bookmarks(entity_type, entity_id);
create index idx_bookmarks_app     on public.bookmarks(app_id);

alter table public.bookmarks enable row level security;

create policy "learner: own bookmarks"
  on public.bookmarks for all
  using (learner_id = auth.uid());

create policy "admin: read bookmarks"
  on public.bookmarks for select
  using (public.is_admin());

-- ── ASSET DOWNLOAD ANALYTICS VIEW ────────────────────────────────
-- Convenience view for download analytics.
-- Avoids repeated joins in API routes.
create or replace view public.asset_download_stats as
select
  a.asset_id,
  a.title,
  a.asset_type,
  a.app_id,
  count(dh.download_id) as total_downloads,
  count(distinct dh.learner_id) as unique_learners,
  max(dh.downloaded_at) as last_downloaded_at
from public.assets a
left join public.download_history dh on dh.asset_id = a.asset_id
group by a.asset_id, a.title, a.asset_type, a.app_id;

-- ── Verify ────────────────────────────────────────────────────────
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('download_history', 'bookmarks')
order by table_name;
