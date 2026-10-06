-- ============================================================
-- Publish: Microsoft Copilot Mastery Program (7 courses, 72 lessons)
-- Written 2026-10-06. Flips the 7 Copilot courses, their 18 modules,
-- 72 lessons, and the program row from 'draft' to 'published' --
-- same publish pattern as 004_chatgpt_workplace_power_user_publish.sql
-- and 008_publish_claude_for_developers.sql.
--
-- Run this ONLY after you have reviewed the content from seeds 009
-- and 010 and are ready for it to go live on the public site.
-- Does not touch any other course, module, lesson, or the program
-- row for any other program.
-- ============================================================

update public.lessons set status = 'published'
where course_id in (
  select course_id from public.courses where slug in (
    'microsoft-copilot-ai-foundations',
    'microsoft-copilot-prompt-engineering',
    'microsoft-365-copilot-mastery',
    'copilot-for-business-functions',
    'copilot-automation-and-agentic-ai',
    'copilot-developer-and-enterprise-architecture',
    'copilot-governance-security-and-leadership'
  )
);

update public.modules set status = 'published'
where course_id in (
  select course_id from public.courses where slug in (
    'microsoft-copilot-ai-foundations',
    'microsoft-copilot-prompt-engineering',
    'microsoft-365-copilot-mastery',
    'copilot-for-business-functions',
    'copilot-automation-and-agentic-ai',
    'copilot-developer-and-enterprise-architecture',
    'copilot-governance-security-and-leadership'
  )
);

update public.courses set status = 'published'
where slug in (
  'microsoft-copilot-ai-foundations',
  'microsoft-copilot-prompt-engineering',
  'microsoft-365-copilot-mastery',
  'copilot-for-business-functions',
  'copilot-automation-and-agentic-ai',
  'copilot-developer-and-enterprise-architecture',
  'copilot-governance-security-and-leadership'
);

update public.programs set status = 'published'
where slug = 'microsoft-copilot-mastery';

-- Verification: should return 7 rows, all status = 'published'
-- select slug, status from public.courses where slug like 'microsoft-copilot%' or slug like 'copilot-%' order by sort_order;
-- select slug, status from public.programs where slug = 'microsoft-copilot-mastery';
