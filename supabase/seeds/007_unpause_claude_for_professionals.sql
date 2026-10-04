-- ═══════════════════════════════════════════════════════════════════
-- 007_unpause_claude_for_professionals.sql
-- Barada Academy — lift the enrollment pause on claude-for-professionals
-- now that it has real lesson content (see 005_claude_for_professionals_content.sql).
--
-- PREREQUISITE -- run this only after BOTH of the following are true:
--   1. Migration 012_course_enrollment_pause.sql has been applied (it adds
--      the enrollment_paused / enrollment_paused_reason columns and pauses
--      10 courses, including claude-for-professionals, for missing content).
--   2. 005_claude_for_professionals_content.sql has been applied and you
--      are satisfied with the content.
--
-- If 012 has not been applied yet, this is a no-op (the columns won't
-- exist) -- it will simply error with "column does not exist" rather than
-- doing anything unsafe, but run it in the right order regardless.
--
-- This does NOT touch any of the other 9 paused courses -- each should be
-- unpaused individually, once each one's content is actually verified complete.
-- ═══════════════════════════════════════════════════════════════════

update public.courses
   set enrollment_paused = false,
       enrollment_paused_reason = null
 where slug = 'claude-for-professionals';
