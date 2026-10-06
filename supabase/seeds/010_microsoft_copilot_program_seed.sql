-- ============================================================
-- Seed: Microsoft Copilot Mastery Program
-- Written 2026-10-06. Groups the 7 new Microsoft Copilot courses
-- (seed 009) under one program, using the programs/program_courses
-- tables added in migration 014_programs_schema.sql.
--
-- This does not modify courses, modules, lessons, enrollments,
-- certificates, or certificate_orders. It only inserts into
-- programs and program_courses. Inserted as status = 'draft' --
-- flip to 'published' together with (or after) publishing the
-- underlying 7 courses themselves.
--
-- total_hours and course_count are admin-declared (per the
-- explicit decision in the Phase 1 blueprint / migration 014 --
-- no sync trigger), set here to the sum of the 7 courses'
-- estimated_hours as drafted: 21.5 hours.
-- ============================================================

do $$
declare
  v_program_id uuid;
begin

  insert into public.programs
    (slug, title, subtitle, description, total_hours, course_count,
     status, visibility, sort_order, meta_title, meta_description)
  values (
    'microsoft-copilot-mastery',
    'Microsoft Copilot Mastery Program',
    'From first principles to enterprise-scale agentic AI, across 7 courses',
    'A 7-course program covering Microsoft Copilot end to end: AI and prompting foundations, Microsoft 365 Copilot across every core app, Copilot for specific business functions, automation and custom agent building in Copilot Studio, developer and Azure AI Foundry architecture, and the governance, security, and leadership skills to run Copilot adoption well -- closing with a capstone adoption roadmap.',
    21.5, 7,
    'draft', 'public', 1,
    'Microsoft Copilot Mastery Program | Barada Academy',
    'A complete 7-course Microsoft Copilot program -- foundations, prompting, Microsoft 365 apps, business functions, automation and agents, developer architecture, and governance and leadership.'
  ) returning program_id into v_program_id;

  insert into public.program_courses (program_id, course_id, sequence_no, is_required)
  select v_program_id, course_id, seq, true
  from (values
    ('microsoft-copilot-ai-foundations', 1),
    ('microsoft-copilot-prompt-engineering', 2),
    ('microsoft-365-copilot-mastery', 3),
    ('copilot-for-business-functions', 4),
    ('copilot-automation-and-agentic-ai', 5),
    ('copilot-developer-and-enterprise-architecture', 6),
    ('copilot-governance-security-and-leadership', 7)
  ) as ordering(slug, seq)
  join public.courses c on c.slug = ordering.slug;

end $$;
