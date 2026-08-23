-- ============================================================================
-- 009_fix_security_definer_views.sql
-- Barada Digital Platform — Security fix
--
-- Applied directly in Supabase SQL Editor on 2026-08 (dashboard verification
-- session, following ADR-008). Recorded here for version control, matching
-- every other schema change this project. No new tables, no data changes.
--
-- Issue (found by Supabase Advisor, CRITICAL severity):
--   public.asset_download_stats and public.learner_recent_activity
--   (created in 007_sprint43_resources.sql and 008_sprint44_progress.sql)
--   were PostgreSQL views running with the CREATOR's permissions by
--   default, not the querying user's. This allowed them to bypass Row
--   Level Security on the underlying tables (lesson_progress,
--   download_history) — meaning a regular authenticated learner querying
--   these views directly (not through the app's API routes, which
--   happen to filter by learner_id) could potentially see every other
--   learner's progress/activity data or download stats, not just their
--   own.
--
-- Fix: security_invoker = true (PostgreSQL 15+) makes each view run
-- with the QUERYING user's permissions instead, so RLS on the
-- underlying tables is enforced normally, closing the bypass.
--
-- Verified: no application code changes required. The one consumer of
-- learner_recent_activity (app/api/dashboard/recent-learning/route.ts)
-- already filters by learner_id explicitly; admin access continues to
-- work via the existing is_admin() RLS policies on the base tables.
-- ============================================================================

alter view public.asset_download_stats set (security_invoker = true);
alter view public.learner_recent_activity set (security_invoker = true);

-- Verify — should return security_invoker = 'on' for both
select
  c.relname as view_name,
  c.reloptions
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('asset_download_stats', 'learner_recent_activity');
