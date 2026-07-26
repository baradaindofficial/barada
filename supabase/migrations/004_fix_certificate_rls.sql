-- ═══════════════════════════════════════════════════════════════════
-- 004_fix_certificate_rls.sql
-- SECURITY FIX: Resolve certificate SELECT policy conflict
--
-- PROBLEM: The original 002 migration created two overlapping SELECT
-- policies on public.certificates:
--   1. "learner: read own certificates"  → learner_id = auth.uid()
--   2. "public: verify certificate by id" → status = 'issued'
--
-- PostgreSQL ORs multiple permissive policies. This means any
-- authenticated learner satisfied policy #1 and could then use
-- policy #2's broader condition to read ALL issued certificates
-- belonging to other learners — a data privacy violation.
--
-- FIX: Drop both conflicting policies and replace with:
--   1. A single tight learner policy (own records only)
--   2. A separate public function for certificate verification
--      that takes a certificate_id argument, avoiding table-level SELECT
-- ═══════════════════════════════════════════════════════════════════

-- Drop the conflicting policies
drop policy if exists "learner: read own certificates"    on public.certificates;
drop policy if exists "public: verify certificate by id"  on public.certificates;

-- Policy 1: Learners can only read their own certificate rows
create policy "learner: read own certificates"
  on public.certificates for select
  using (learner_id = auth.uid());

-- Policy 2: Public certificate verification via a SECURITY DEFINER function.
-- This avoids giving unauthenticated callers table-level SELECT.
-- The function returns only safe public fields for a specific certificate_id.
create or replace function public.verify_certificate(p_certificate_id text)
returns table (
  certificate_id   text,
  learner_name     text,
  course_title     text,
  issued_at        timestamptz,
  status           text
)
language sql
security definer
stable
as $$
  select
    certificate_id,
    learner_name,
    course_title,
    issued_at,
    status
  from public.certificates
  where certificate_id = p_certificate_id
    and status = 'issued';
$$;

-- Revoke direct execute from anon/authenticated — only call via API
revoke execute on function public.verify_certificate(text) from anon;
grant  execute on function public.verify_certificate(text) to authenticated;
grant  execute on function public.verify_certificate(text) to anon;

comment on function public.verify_certificate is
  'Public certificate verification — returns only safe fields for issued certificates. '
  'Does not expose learner_id or payment details.';
