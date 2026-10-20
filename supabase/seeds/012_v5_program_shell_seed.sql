-- ============================================================
-- Seed: V5 Program Shell — AI-Powered Professional Masterclass
-- Written 2026-10-06, per approved blueprint:
--   "V5 Program Shell — Implementation Blueprint, Course 1 Corrected"
-- Pre-seed checks (run live, 2026-10-06):
--   1. courses schema verified against 006_lcms_schema.sql:
--      generation_mode accepts 'hybrid', difficulty accepts
--      Beginner/Intermediate/Advanced, visibility accepts 'private',
--      category is unconstrained text, estimated_hours/is_free/
--      cert_price_paise all valid as used below.
--   2. ai-tools/academy domain confirmed: exactly one row,
--      domain_id = d728eb67-a14f-4339-ae64-b6109375e1e6
--   3. public.programs confirmed: exactly one existing row
--      (Microsoft Copilot Mastery Program, sort_order = 1,
--      published/public) -- sort_order = 2 is free.
--
-- SHELL ONLY. No modules, no lessons, no lesson content.
-- Creates 1 new programs row + 12 new courses rows + 12 new
-- program_courses membership rows. All 12 courses are NEW rows
-- with NEW v5-prefixed slugs -- this does NOT link, modify, or
-- reference any of the 11 existing live courses, including
-- chatgpt-for-professionals (which stays completely untouched,
-- per explicit instruction, because its real duration is 3.5h,
-- not the approved V5 Course 1 duration of 4.0h).
--
-- Every new row is status = 'draft', visibility = 'private'.
-- Combined with the programs/program_courses RLS policies from
-- migration 014 (public read requires the PARENT program to be
-- status='published' AND visibility='public'), none of this is
-- reachable by any public/anon/unauthenticated query until you
-- explicitly flip status on the program row -- and even then,
-- each course row's own status/visibility is a second, independent
-- gate.
--
-- Does not touch: courses, modules, lessons, assessments,
-- enrollments, certificates, certificate_orders, or learners for
-- ANY existing course.
-- ============================================================

do $$
declare
  v_domain_id  uuid := 'd728eb67-a14f-4339-ae64-b6109375e1e6'; -- ai-tools / academy, confirmed live
  v_program_id uuid;
begin

  -- ── Program ──────────────────────────────────────────────────
  insert into public.programs
    (slug, title, subtitle, description, total_hours, course_count,
     status, visibility, sort_order, meta_title, meta_description)
  values (
    'ai-powered-professional-masterclass',
    'AI-Powered Professional Masterclass',
    'A 12-course, 64-hour path from first prompt to AI-powered professional, capped by a graded capstone',
    'The V5 Masterclass: 12 courses across foundations, prompt engineering, everyday and advanced productivity, documents and research, data and business analysis, workplace AI by role, automation, responsible AI, and a final capstone project -- 64 hours total. Shell only; course content is authored separately, course by course.',
    64.0, 12,
    'draft', 'private', 2,
    'AI-Powered Professional Masterclass | Barada Academy',
    'A 12-course, 64-hour AI-powered professional development path, from ChatGPT foundations through a graded capstone project.'
  ) returning program_id into v_program_id;

  -- ── Course shells (12 new rows, no modules/lessons) ─────────────
  insert into public.courses
    (slug, title, category, difficulty, domain_id,
     estimated_hours, status, visibility, sort_order, generation_mode)
  values
    ('v5-ai-chatgpt-foundations',          'AI & ChatGPT Foundations',                  'AI Tools', 'Beginner',     v_domain_id, 4.0, 'draft', 'private', 50, 'hybrid'),
    ('v5-prompt-engineering-mastery',      'Prompt Engineering Mastery',                'AI Tools', 'Beginner',     v_domain_id, 7.0, 'draft', 'private', 51, 'hybrid'),
    ('v5-everyday-productivity',           'Everyday Productivity',                     'AI Tools', 'Beginner',     v_domain_id, 5.0, 'draft', 'private', 52, 'hybrid'),
    ('v5-documents-knowledge-work',        'Documents & Knowledge Work',                'AI Tools', 'Intermediate', v_domain_id, 6.0, 'draft', 'private', 53, 'hybrid'),
    ('v5-data-excel-business-analysis',    'Data, Excel & Business Analysis',           'AI Tools', 'Intermediate', v_domain_id, 6.0, 'draft', 'private', 54, 'hybrid'),
    ('v5-search-deep-research',            'Search & Deep Research',                    'AI Tools', 'Intermediate', v_domain_id, 6.0, 'draft', 'private', 55, 'hybrid'),
    ('v5-professional-workplace-ai',       'Professional & Workplace AI',                'AI Tools', 'Intermediate', v_domain_id, 7.0, 'draft', 'private', 56, 'hybrid'),
    ('v5-personal-productivity-research',  'Personal Productivity & Research',          'AI Tools', 'Intermediate', v_domain_id, 4.0, 'draft', 'private', 57, 'hybrid'),
    ('v5-advanced-workflows-projects',     'Advanced Workflows & Projects',             'AI Tools', 'Intermediate', v_domain_id, 6.0, 'draft', 'private', 58, 'hybrid'),
    ('v5-automation-advanced-ai',          'Automation & Advanced AI',                  'AI Tools', 'Intermediate', v_domain_id, 5.0, 'draft', 'private', 59, 'hybrid'),
    ('v5-safety-accuracy-responsible-ai',  'Safety, Accuracy & Responsible AI',         'AI Tools', 'Advanced',     v_domain_id, 3.0, 'draft', 'private', 60, 'hybrid'),
    ('v5-capstone-ai-powered-professional','Final Capstone — AI-Powered Professional',  'AI Tools', 'Advanced',     v_domain_id, 5.0, 'draft', 'private', 61, 'hybrid');

  -- ── Program membership, sequence 1-12 ───────────────────────────
  insert into public.program_courses (program_id, course_id, sequence_no, is_required)
  select v_program_id, course_id, seq, true
  from (values
    ('v5-ai-chatgpt-foundations', 1),
    ('v5-prompt-engineering-mastery', 2),
    ('v5-everyday-productivity', 3),
    ('v5-documents-knowledge-work', 4),
    ('v5-data-excel-business-analysis', 5),
    ('v5-search-deep-research', 6),
    ('v5-professional-workplace-ai', 7),
    ('v5-personal-productivity-research', 8),
    ('v5-advanced-workflows-projects', 9),
    ('v5-automation-advanced-ai', 10),
    ('v5-safety-accuracy-responsible-ai', 11),
    ('v5-capstone-ai-powered-professional', 12)
  ) as ordering(slug, seq)
  join public.courses c on c.slug = ordering.slug;

end $$;

-- ── Verification (safe to run immediately after) ─────────────────
-- select slug, title, estimated_hours, difficulty, status, visibility, sort_order
--   from public.courses where slug like 'v5-%' order by sort_order;
-- select p.slug, p.total_hours, p.course_count, pc.sequence_no, c.slug
--   from public.programs p
--   join public.program_courses pc on pc.program_id = p.program_id
--   join public.courses c on c.course_id = pc.course_id
--   where p.slug = 'ai-powered-professional-masterclass'
--   order by pc.sequence_no;
-- -- Expect: 12 course rows, 12 program_courses rows, total_hours = 64.0
