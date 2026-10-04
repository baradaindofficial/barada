-- ═══════════════════════════════════════════════════════════════════
-- 012_course_enrollment_pause.sql
-- Barada Academy — Reversible containment: pause new enrolments and new
-- certificate purchases for courses confirmed to have missing lesson
-- content (BK-approved, 2026-10-03).
--
-- PURELY ADDITIVE. Does not touch: existing enrollments, lesson_progress,
-- quiz_attempts, assessment_attempts, certificates, certificate_orders,
-- or courses.status (courses stay visible/published -- only new
-- enrolment and new certificate purchase are gated, enforced in
-- app/api/enrollment/route.ts and app/api/certificates/create-order/route.ts).
--
-- ROLLBACK: run the single UPDATE at the bottom of this file with
-- enrollment_paused = false (or drop the two columns). No data loss
-- either way -- this migration creates no new rows and deletes nothing.
-- ═══════════════════════════════════════════════════════════════════

alter table public.courses
  add column if not exists enrollment_paused        boolean not null default false,
  add column if not exists enrollment_paused_reason  text;

comment on column public.courses.enrollment_paused is
  'True blocks new enrolments (app/api/enrollment) and new certificate
   purchases (app/api/certificates/create-order) for this course. Existing
   enrollments, progress, payments and certificates are untouched. Course
   remains visible/published -- this is an enrollment/purchase gate only.';

-- ── Pause the 10 courses confirmed (2026-10-03 audit) to have lesson
--    rows with titles only -- no body/objectives/key_points/practice_task
--    on any lesson. "chatgpt-workplace-power-user" is NOT included: all
--    40 of its lessons have real, verified content. ─────────────────
update public.courses
   set enrollment_paused = true,
       enrollment_paused_reason = 'Content being completed — new enrolments temporarily paused.'
 where slug in (
   'chatgpt-for-professionals',
   'claude-for-professionals',
   'ai-tools-for-professionals',
   'prompt-engineering-mastery',
   'ai-productivity-mastery',
   'excel-with-ai',
   'powerpoint-with-ai',
   'linkedin-profile-optimisation',
   'resume-building',
   'artificial-intelligence-mastery'
 );

-- ── ROLLBACK (run this instead to undo, do not run both) ────────────
-- update public.courses set enrollment_paused = false, enrollment_paused_reason = null
--  where slug in (
--    'chatgpt-for-professionals','claude-for-professionals','ai-tools-for-professionals',
--    'prompt-engineering-mastery','ai-productivity-mastery','excel-with-ai',
--    'powerpoint-with-ai','linkedin-profile-optimisation','resume-building',
--    'artificial-intelligence-mastery'
--  );
