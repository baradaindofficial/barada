-- ============================================================
-- Publish: ChatGPT: From Beginner to Workplace Power User
-- CTO-approved — 2026-09-27
--
-- Run this ONLY AFTER 003_chatgpt_workplace_power_user_seed.sql
-- has been applied and verified. This flips the course, its 10
-- modules, its 40 lessons, and its assessment from 'draft' to
-- 'published'. It touches only rows belonging to the course with
-- slug 'chatgpt-workplace-power-user' — no other course, module,
-- lesson, or assessment is affected.
--
-- Does not touch payment, certificate, authentication, or
-- learner-identity data, and does not alter schema.
-- ============================================================

do $$
declare
  v_course_id uuid;
begin
  select course_id into v_course_id
    from public.courses
    where slug = 'chatgpt-workplace-power-user';

  if v_course_id is null then
    raise exception 'Course chatgpt-workplace-power-user not found — run 003_chatgpt_workplace_power_user_seed.sql first';
  end if;

  update public.courses
     set status = 'published', published_at = now()
   where course_id = v_course_id;

  update public.modules
     set status = 'published'
   where course_id = v_course_id;

  update public.lessons
     set status = 'published', published_at = now()
   where course_id = v_course_id;

  update public.assessments
     set status = 'published', published_at = now()
   where course_id = v_course_id;

end $$;
