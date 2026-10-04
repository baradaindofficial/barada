-- ═══════════════════════════════════════════════════════════════════
-- 008_publish_claude_for_developers.sql
-- Barada Academy — flip claude-for-developers from draft to published,
-- now live course/module/lesson/assessment status, now that BK has
-- approved publishing without further hold (2026-10-04, "do not hold
-- anything. publish all.").
--
-- Scope: only rows belonging to the claude-for-developers course.
-- PURELY a status change -- no content, pricing, or structural change.
-- ═══════════════════════════════════════════════════════════════════

update public.courses
   set status = 'published', published_at = now()
 where slug = 'claude-for-developers';

update public.modules m
   set status = 'published', published_at = now()
  from public.courses c
 where m.course_id = c.course_id and c.slug = 'claude-for-developers';

update public.lessons l
   set status = 'published', published_at = now()
  from public.courses c
 where l.course_id = c.course_id and c.slug = 'claude-for-developers';

update public.assessments a
   set status = 'published', published_at = now()
  from public.courses c
 where a.course_id = c.course_id and c.slug = 'claude-for-developers';
