-- ============================================================
-- Migration 011: evaluation_question_sampling
-- CTO approved: 2026-09-27
-- ============================================================
-- Purpose: enable genuine server-side "N random questions per
-- attempt from a larger question bank" for an assessment, with
-- the selected subset persisted per-attempt so submission can be
-- graded and re-verified against exactly what the learner was
-- shown (never the full bank, never a client-supplied set).
--
-- Fully additive and backward compatible:
--   - assessments.questions_per_attempt defaults to NULL, which
--     preserves the existing full-bank behavior for every
--     assessment seeded before this migration (nothing changes
--     for them).
--   - assessment_attempts.selected_question_ids defaults to NULL
--     for the same reason — existing attempts/rows are untouched.
-- No existing table, column, or row is altered in a breaking way.
-- ============================================================

alter table public.assessments
  add column if not exists questions_per_attempt int;

comment on column public.assessments.questions_per_attempt is
  'When set and less than this assessment''s total question count, each attempt shows this many randomly-selected, server-persisted questions instead of the full bank. NULL (default) preserves the original full-bank behavior.';

alter table public.assessment_attempts
  add column if not exists selected_question_ids uuid[];

comment on column public.assessment_attempts.selected_question_ids is
  'The server-selected subset of assessment_questions.question_id shown to the learner for this specific attempt, when the parent assessment uses questions_per_attempt sampling. NULL for attempts against a full-bank (non-sampled) assessment, or for legacy attempts predating this migration.';

-- Defensive lifecycle guarantee (CTO lifecycle review, 2026-09-27):
-- a learner can have at most one 'in_progress' sampled attempt per
-- assessment at a time. This is what stops a page refresh, a duplicate
-- request, or two open tabs from silently piling up abandoned attempts
-- or re-randomizing the question set out from under an in-flight one;
-- the API layer already checks for and resumes an existing in_progress
-- attempt before inserting, and this index closes the remaining race
-- between that check and the insert.
--
-- Zero impact on existing data: the legacy (full-bank) submit path
-- never creates an 'in_progress' row at all — it inserts directly as
-- 'graded' at submission — so no assessment predating this migration
-- can ever have a row this index applies to.
create unique index if not exists uq_assessment_attempts_in_progress
  on public.assessment_attempts (assessment_id, learner_id)
  where status = 'in_progress';
