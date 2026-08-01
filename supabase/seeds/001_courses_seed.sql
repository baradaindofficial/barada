-- ═══════════════════════════════════════════════════════════════════
-- 001_courses_seed.sql
-- Barada Academy — Seed 10 flagship courses to DB
-- Migrates from data/courses.ts to courses/modules/lessons tables
-- Run AFTER migration 006_lcms_schema.sql
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. ChatGPT for Professionals ─────────────────────────────────
with c1 as (
  insert into public.courses
    (slug, title, subtitle, category, difficulty, icon, theme_color,
     cert_price_paise, is_free, sort_order, status, visibility,
     domain_id, outcomes, target_audience, estimated_hours)
  values (
    'chatgpt-for-professionals',
    'ChatGPT for Professionals',
    'Master AI-powered communication, writing, and analysis',
    'AI Tools', 'Beginner', '💬', '#1A7F56',
    29900, true, 1, 'published', 'public',
    (select domain_id from public.domains where slug = 'ai-tools' and app_id = 'academy'),
    array['Use ChatGPT for professional writing','Build effective prompts','Automate repetitive tasks','Integrate AI into daily workflows'],
    array['Working professionals','Business analysts','Marketing professionals'],
    3.5
  ) returning course_id
),
m1 as (
  insert into public.modules (course_id, module_number, title, description, status)
  select course_id, 1, 'Foundations of ChatGPT', 'Understanding ChatGPT and getting started', 'published' from c1
  returning module_id, course_id
),
m2 as (
  insert into public.modules (course_id, module_number, title, description, status)
  select course_id, 2, 'Writing & Communication', 'Professional writing powered by AI', 'published' from c1
  returning module_id, course_id
),
m3 as (
  insert into public.modules (course_id, module_number, title, description, status)
  select course_id, 3, 'Research & Analysis', 'Research, summarisation and data analysis', 'published' from c1
  returning module_id, course_id
),
m4 as (
  insert into public.modules (course_id, module_number, title, description, status)
  select course_id, 4, 'Advanced Workflows', 'Automation and advanced professional use cases', 'published' from c1
  returning module_id, course_id
),
l1 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status, is_free_preview)
  select m1.module_id, m1.course_id, 1, 'What is ChatGPT and How Does it Work?', 'published', true from m1
),
l2 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status)
  select m1.module_id, m1.course_id, 2, 'Your First Professional Prompt', 'published' from m1
),
l3 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status)
  select m1.module_id, m1.course_id, 3, 'The CRAFT Framework for Prompts', 'published' from m1
),
l4 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status)
  select m1.module_id, m1.course_id, 4, 'Roles, Context and Instructions', 'published' from m1
),
l5 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status)
  select m2.module_id, m2.course_id, 5, 'Writing Professional Emails', 'published' from m2
),
l6 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status)
  select m2.module_id, m2.course_id, 6, 'Reports and Presentations', 'published' from m2
),
l7 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status)
  select m2.module_id, m2.course_id, 7, 'Proposals and Business Documents', 'published' from m2
),
l8 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status)
  select m2.module_id, m2.course_id, 8, 'Communication at Scale', 'published' from m2
),
l9 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status)
  select m2.module_id, m2.course_id, 9, 'Editing and Proofreading with AI', 'published' from m2
),
l10 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status)
  select m3.module_id, m3.course_id, 10, 'Research and Fact-Finding', 'published' from m3
),
l11 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status)
  select m3.module_id, m3.course_id, 11, 'Summarising Long Documents', 'published' from m3
),
l12 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status)
  select m3.module_id, m3.course_id, 12, 'Data Analysis and Interpretation', 'published' from m3
),
l13 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status)
  select m3.module_id, m3.course_id, 13, 'Competitive Analysis', 'published' from m3
),
l14 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status)
  select m4.module_id, m4.course_id, 14, 'Building Repeatable Workflows', 'published' from m4
),
l15 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status)
  select m4.module_id, m4.course_id, 15, 'ChatGPT for Meetings and Follow-ups', 'published' from m4
),
l16 as (
  insert into public.lessons (module_id, course_id, lesson_number, title, status)
  select m4.module_id, m4.course_id, 16, 'Building a Personal AI Toolkit', 'published' from m4
)
insert into public.lessons (module_id, course_id, lesson_number, title, status)
select m4.module_id, m4.course_id, 17, 'Your 30-Day AI Action Plan', 'published' from m4;

-- ── 2. Claude AI for Professionals ───────────────────────────────
with c2 as (
  insert into public.courses
    (slug, title, subtitle, category, difficulty, icon, theme_color,
     cert_price_paise, is_free, sort_order, status, visibility, domain_id, estimated_hours)
  values (
    'claude-for-professionals',
    'Claude AI for Professionals',
    'Harness Anthropic Claude for deep analysis and professional writing',
    'AI Tools', 'Beginner', '✳️', '#CC7740',
    29900, true, 2, 'published', 'public',
    (select domain_id from public.domains where slug = 'ai-tools' and app_id = 'academy'),
    2.8
  ) returning course_id
),
m1 as (
  insert into public.modules (course_id, module_number, title, status)
  select course_id, 1, 'Getting Started with Claude', 'published' from c2 returning module_id, course_id
),
m2 as (
  insert into public.modules (course_id, module_number, title, status)
  select course_id, 2, 'Core Skills', 'published' from c2 returning module_id, course_id
),
m3 as (
  insert into public.modules (course_id, module_number, title, status)
  select course_id, 3, 'Advanced Usage', 'published' from c2 returning module_id, course_id
),
m4 as (
  insert into public.modules (course_id, module_number, title, status)
  select course_id, 4, 'Professional Integration', 'published' from c2 returning module_id, course_id
)
insert into public.lessons (module_id, course_id, lesson_number, title, status, is_free_preview)
select m1.module_id, m1.course_id, 1, 'What Makes Claude Different', 'published', true from m1
union all select m1.module_id, m1.course_id, 2, 'Claude vs ChatGPT — When to Use What', 'published', false from m1
union all select m1.module_id, m1.course_id, 3, 'Your First Claude Conversation', 'published', false from m1
union all select m1.module_id, m1.course_id, 4, 'Structuring Long Prompts', 'published', false from m1
union all select m2.module_id, m2.course_id, 5, 'Deep Document Analysis', 'published', false from m2
union all select m2.module_id, m2.course_id, 6, 'Complex Research Tasks', 'published', false from m2
union all select m2.module_id, m2.course_id, 7, 'Writing with Nuance', 'published', false from m2
union all select m3.module_id, m3.course_id, 8, 'Multi-Step Reasoning', 'published', false from m3
union all select m3.module_id, m3.course_id, 9, 'Code and Data Tasks', 'published', false from m3
union all select m3.module_id, m3.course_id, 10, 'Ethical AI Use at Work', 'published', false from m3
union all select m4.module_id, m4.course_id, 11, 'Claude in Your Workflow', 'published', false from m4
union all select m4.module_id, m4.course_id, 12, 'Building AI-Augmented Processes', 'published', false from m4
union all select m4.module_id, m4.course_id, 13, 'Your Claude Toolkit', 'published', false from m4;

-- ── 3. AI Tools for Professionals ────────────────────────────────
with c3 as (
  insert into public.courses
    (slug, title, subtitle, category, difficulty, icon, theme_color,
     cert_price_paise, is_free, sort_order, status, visibility, domain_id, estimated_hours)
  values (
    'ai-tools-for-professionals',
    'AI Tools for Professionals',
    'The complete landscape of AI tools for professional productivity',
    'AI Tools', 'Beginner', '🛠️', '#4A3BE8',
    29900, true, 3, 'published', 'public',
    (select domain_id from public.domains where slug = 'ai-tools' and app_id = 'academy'),
    3.2
  ) returning course_id
),
m1 as (insert into public.modules (course_id, module_number, title, status) select course_id, 1, 'The AI Tools Landscape', 'published' from c3 returning module_id, course_id),
m2 as (insert into public.modules (course_id, module_number, title, status) select course_id, 2, 'Writing and Communication Tools', 'published' from c3 returning module_id, course_id),
m3 as (insert into public.modules (course_id, module_number, title, status) select course_id, 3, 'Research and Analysis Tools', 'published' from c3 returning module_id, course_id),
m4 as (insert into public.modules (course_id, module_number, title, status) select course_id, 4, 'Workflow Integration', 'published' from c3 returning module_id, course_id)
insert into public.lessons (module_id, course_id, lesson_number, title, status, is_free_preview)
select m1.module_id, m1.course_id, 1, 'Mapping the AI Tools Universe', 'published', true from m1
union all select m1.module_id, m1.course_id, 2, 'Choosing the Right Tool', 'published', false from m1
union all select m1.module_id, m1.course_id, 3, 'Free vs Paid — What You Need', 'published', false from m1
union all select m1.module_id, m1.course_id, 4, 'Building Your AI Stack', 'published', false from m1
union all select m2.module_id, m2.course_id, 5, 'ChatGPT, Claude and Gemini', 'published', false from m2
union all select m2.module_id, m2.course_id, 6, 'Grammarly and Writing Assistants', 'published', false from m2
union all select m2.module_id, m2.course_id, 7, 'AI for Presentations', 'published', false from m2
union all select m3.module_id, m3.course_id, 8, 'Perplexity for Research', 'published', false from m3
union all select m3.module_id, m3.course_id, 9, 'Notion AI and Knowledge Management', 'published', false from m3
union all select m3.module_id, m3.course_id, 10, 'Data and Spreadsheet AI', 'published', false from m3
union all select m4.module_id, m4.course_id, 11, 'Zapier and Automation Tools', 'published', false from m4
union all select m4.module_id, m4.course_id, 12, 'AI for Meetings', 'published', false from m4
union all select m4.module_id, m4.course_id, 13, 'Your Personal AI Ecosystem', 'published', false from m4
union all select m4.module_id, m4.course_id, 14, 'Staying Current with AI', 'published', false from m4;

-- ── 4. Mastery in Prompt Engineering ─────────────────────────────
with c4 as (
  insert into public.courses
    (slug, title, subtitle, category, difficulty, icon, theme_color,
     cert_price_paise, is_free, sort_order, status, visibility, domain_id, estimated_hours)
  values (
    'prompt-engineering-mastery',
    'Mastery in Prompt Engineering',
    'The science and art of communicating with AI models',
    'AI Advanced', 'Intermediate', '🧠', '#D11A1A',
    29900, true, 4, 'published', 'public',
    (select domain_id from public.domains where slug = 'ai-fundamentals' and app_id = 'academy'),
    4.0
  ) returning course_id
),
m1 as (insert into public.modules (course_id, module_number, title, status) select course_id, 1, 'Prompt Engineering Foundations', 'published' from c4 returning module_id, course_id),
m2 as (insert into public.modules (course_id, module_number, title, status) select course_id, 2, 'Advanced Techniques', 'published' from c4 returning module_id, course_id),
m3 as (insert into public.modules (course_id, module_number, title, status) select course_id, 3, 'Frameworks and Systems', 'published' from c4 returning module_id, course_id),
m4 as (insert into public.modules (course_id, module_number, title, status) select course_id, 4, 'Mastery Applications', 'published' from c4 returning module_id, course_id)
insert into public.lessons (module_id, course_id, lesson_number, title, status, is_free_preview)
select m1.module_id, m1.course_id, 1, 'What is Prompt Engineering?', 'published', true from m1
union all select m1.module_id, m1.course_id, 2, 'How LLMs Process Text', 'published', false from m1
union all select m1.module_id, m1.course_id, 3, 'The Anatomy of a Great Prompt', 'published', false from m1
union all select m1.module_id, m1.course_id, 4, 'Zero-Shot vs Few-Shot Prompting', 'published', false from m1
union all select m2.module_id, m2.course_id, 5, 'Chain-of-Thought Prompting', 'published', false from m2
union all select m2.module_id, m2.course_id, 6, 'Role and Persona Prompting', 'published', false from m2
union all select m2.module_id, m2.course_id, 7, 'Iterative Refinement', 'published', false from m2
union all select m2.module_id, m2.course_id, 8, 'Output Formatting Control', 'published', false from m2
union all select m3.module_id, m3.course_id, 9, 'The CRAFT Framework', 'published', false from m3
union all select m3.module_id, m3.course_id, 10, 'The RICE Framework', 'published', false from m3
union all select m3.module_id, m3.course_id, 11, 'Building a Prompt Library', 'published', false from m3
union all select m3.module_id, m3.course_id, 12, 'Prompt Templates for Work', 'published', false from m3
union all select m4.module_id, m4.course_id, 13, 'Prompt Engineering for Analysis', 'published', false from m4
union all select m4.module_id, m4.course_id, 14, 'Prompt Engineering for Writing', 'published', false from m4
union all select m4.module_id, m4.course_id, 15, 'Prompt Engineering for Code', 'published', false from m4
union all select m4.module_id, m4.course_id, 16, 'Building Your Prompt Mastery System', 'published', false from m4;

-- ── 5. Mastery in AI Productivity ────────────────────────────────
with c5 as (
  insert into public.courses
    (slug, title, subtitle, category, difficulty, icon, theme_color,
     cert_price_paise, is_free, sort_order, status, visibility, domain_id, estimated_hours)
  values (
    'ai-productivity-mastery',
    'Mastery in AI Productivity',
    'Transform your professional output with AI-powered productivity systems',
    'Productivity', 'Beginner', '⚡', '#0D7340',
    29900, true, 5, 'published', 'public',
    (select domain_id from public.domains where slug = 'productivity' and app_id = 'academy'),
    3.5
  ) returning course_id
),
m1 as (insert into public.modules (course_id, module_number, title, status) select course_id, 1, 'AI Productivity Foundations', 'published' from c5 returning module_id, course_id),
m2 as (insert into public.modules (course_id, module_number, title, status) select course_id, 2, 'Time and Task Management', 'published' from c5 returning module_id, course_id),
m3 as (insert into public.modules (course_id, module_number, title, status) select course_id, 3, 'Communication Productivity', 'published' from c5 returning module_id, course_id),
m4 as (insert into public.modules (course_id, module_number, title, status) select course_id, 4, 'Building Your AI System', 'published' from c5 returning module_id, course_id)
insert into public.lessons (module_id, course_id, lesson_number, title, status, is_free_preview)
select m1.module_id, m1.course_id, 1, 'The AI Productivity Mindset', 'published', true from m1
union all select m1.module_id, m1.course_id, 2, 'Auditing Your Current Workflow', 'published', false from m1
union all select m1.module_id, m1.course_id, 3, 'Identifying AI Opportunities', 'published', false from m1
union all select m1.module_id, m1.course_id, 4, 'Your AI Productivity Stack', 'published', false from m1
union all select m2.module_id, m2.course_id, 5, 'AI for Planning and Prioritisation', 'published', false from m2
union all select m2.module_id, m2.course_id, 6, 'AI-Powered Task Management', 'published', false from m2
union all select m2.module_id, m2.course_id, 7, 'Deep Work with AI', 'published', false from m2
union all select m2.module_id, m2.course_id, 8, 'Meeting Productivity with AI', 'published', false from m2
union all select m3.module_id, m3.course_id, 9, 'Email at 10x Speed', 'published', false from m3
union all select m3.module_id, m3.course_id, 10, 'AI for Reporting', 'published', false from m3
union all select m3.module_id, m3.course_id, 11, 'Stakeholder Communication', 'published', false from m3
union all select m4.module_id, m4.course_id, 12, 'Building Repeatable AI Workflows', 'published', false from m4
union all select m4.module_id, m4.course_id, 13, 'Your Personal AI Operating System', 'published', false from m4
union all select m4.module_id, m4.course_id, 14, 'Measuring Your AI Productivity Gains', 'published', false from m4
union all select m4.module_id, m4.course_id, 15, '90-Day AI Productivity Plan', 'published', false from m4;

-- ── 6. Excel with AI ─────────────────────────────────────────────
with c6 as (
  insert into public.courses
    (slug, title, subtitle, category, difficulty, icon, theme_color,
     cert_price_paise, is_free, sort_order, status, visibility, domain_id, estimated_hours)
  values (
    'excel-with-ai',
    'Excel with AI',
    'Supercharge your Excel skills with AI-powered formulas and automation',
    'Productivity Tools', 'Beginner', '📊', '#1D6F42',
    29900, true, 6, 'published', 'public',
    (select domain_id from public.domains where slug = 'productivity' and app_id = 'academy'),
    3.2
  ) returning course_id
),
m1 as (insert into public.modules (course_id, module_number, title, status) select course_id, 1, 'Excel AI Foundations', 'published' from c6 returning module_id, course_id),
m2 as (insert into public.modules (course_id, module_number, title, status) select course_id, 2, 'AI-Powered Formulas', 'published' from c6 returning module_id, course_id),
m3 as (insert into public.modules (course_id, module_number, title, status) select course_id, 3, 'Data Analysis with AI', 'published' from c6 returning module_id, course_id),
m4 as (insert into public.modules (course_id, module_number, title, status) select course_id, 4, 'Automation and Workflows', 'published' from c6 returning module_id, course_id)
insert into public.lessons (module_id, course_id, lesson_number, title, status, is_free_preview)
select m1.module_id, m1.course_id, 1, 'AI Tools for Excel Users', 'published', true from m1
union all select m1.module_id, m1.course_id, 2, 'Copilot in Excel', 'published', false from m1
union all select m1.module_id, m1.course_id, 3, 'Using ChatGPT for Excel Help', 'published', false from m1
union all select m1.module_id, m1.course_id, 4, 'Setting Up Your AI Excel Workflow', 'published', false from m1
union all select m2.module_id, m2.course_id, 5, 'Writing Formulas with AI', 'published', false from m2
union all select m2.module_id, m2.course_id, 6, 'VLOOKUP, INDEX-MATCH with AI', 'published', false from m2
union all select m2.module_id, m2.course_id, 7, 'Complex Nested Formulas', 'published', false from m2
union all select m3.module_id, m3.course_id, 8, 'Data Cleaning with AI', 'published', false from m3
union all select m3.module_id, m3.course_id, 9, 'PivotTables and AI Analysis', 'published', false from m3
union all select m3.module_id, m3.course_id, 10, 'Charts and Visualisation', 'published', false from m3
union all select m4.module_id, m4.course_id, 11, 'Macros and VBA with AI', 'published', false from m4
union all select m4.module_id, m4.course_id, 12, 'Power Query with AI', 'published', false from m4
union all select m4.module_id, m4.course_id, 13, 'Building Dashboards', 'published', false from m4
union all select m4.module_id, m4.course_id, 14, 'Your Excel AI Masterclass', 'published', false from m4;

-- ── 7. PowerPoint with AI ─────────────────────────────────────────
with c7 as (
  insert into public.courses
    (slug, title, subtitle, category, difficulty, icon, theme_color,
     cert_price_paise, is_free, sort_order, status, visibility, domain_id, estimated_hours)
  values (
    'powerpoint-with-ai',
    'PowerPoint with AI',
    'Create compelling presentations faster with AI assistance',
    'Productivity Tools', 'Beginner', '📽️', '#B7472A',
    29900, true, 7, 'published', 'public',
    (select domain_id from public.domains where slug = 'productivity' and app_id = 'academy'),
    2.8
  ) returning course_id
),
m1 as (insert into public.modules (course_id, module_number, title, status) select course_id, 1, 'AI Presentation Foundations', 'published' from c7 returning module_id, course_id),
m2 as (insert into public.modules (course_id, module_number, title, status) select course_id, 2, 'Structure and Storytelling', 'published' from c7 returning module_id, course_id),
m3 as (insert into public.modules (course_id, module_number, title, status) select course_id, 3, 'Design with AI', 'published' from c7 returning module_id, course_id),
m4 as (insert into public.modules (course_id, module_number, title, status) select course_id, 4, 'Delivery and Refinement', 'published' from c7 returning module_id, course_id)
insert into public.lessons (module_id, course_id, lesson_number, title, status, is_free_preview)
select m1.module_id, m1.course_id, 1, 'AI Tools for Presentations', 'published', true from m1
union all select m1.module_id, m1.course_id, 2, 'Copilot in PowerPoint', 'published', false from m1
union all select m1.module_id, m1.course_id, 3, 'Using ChatGPT for Slide Content', 'published', false from m1
union all select m2.module_id, m2.course_id, 4, 'The SCQA Framework', 'published', false from m2
union all select m2.module_id, m2.course_id, 5, 'Structuring Executive Decks', 'published', false from m2
union all select m2.module_id, m2.course_id, 6, 'Data Storytelling', 'published', false from m2
union all select m3.module_id, m3.course_id, 7, 'AI-Powered Design Tools', 'published', false from m3
union all select m3.module_id, m3.course_id, 8, 'Brand-Consistent Slides', 'published', false from m3
union all select m3.module_id, m3.course_id, 9, 'Images and Icons with AI', 'published', false from m3
union all select m4.module_id, m4.course_id, 10, 'Speaker Notes with AI', 'published', false from m4
union all select m4.module_id, m4.course_id, 11, 'Rehearsal and Refinement', 'published', false from m4
union all select m4.module_id, m4.course_id, 12, 'Repurposing Decks with AI', 'published', false from m4
union all select m4.module_id, m4.course_id, 13, 'Your Presentation AI System', 'published', false from m4;

-- ── 8. LinkedIn Profile Optimisation ─────────────────────────────
with c8 as (
  insert into public.courses
    (slug, title, subtitle, category, difficulty, icon, theme_color,
     cert_price_paise, is_free, sort_order, status, visibility, domain_id, estimated_hours)
  values (
    'linkedin-profile-optimisation',
    'LinkedIn Profile Optimisation',
    'Build a magnetic LinkedIn presence that attracts opportunities',
    'Career Development', 'Beginner', '💼', '#0077B5',
    29900, true, 8, 'published', 'public',
    (select domain_id from public.domains where slug = 'career-development' and app_id = 'academy'),
    2.5
  ) returning course_id
),
m1 as (insert into public.modules (course_id, module_number, title, status) select course_id, 1, 'LinkedIn Strategy', 'published' from c8 returning module_id, course_id),
m2 as (insert into public.modules (course_id, module_number, title, status) select course_id, 2, 'Profile Optimisation', 'published' from c8 returning module_id, course_id),
m3 as (insert into public.modules (course_id, module_number, title, status) select course_id, 3, 'Content and Engagement', 'published' from c8 returning module_id, course_id),
m4 as (insert into public.modules (course_id, module_number, title, status) select course_id, 4, 'Networking and Opportunities', 'published' from c8 returning module_id, course_id)
insert into public.lessons (module_id, course_id, lesson_number, title, status, is_free_preview)
select m1.module_id, m1.course_id, 1, 'LinkedIn in 2025 — What Actually Works', 'published', true from m1
union all select m1.module_id, m1.course_id, 2, 'Defining Your LinkedIn Goal', 'published', false from m1
union all select m1.module_id, m1.course_id, 3, 'Understanding the LinkedIn Algorithm', 'published', false from m1
union all select m2.module_id, m2.course_id, 4, 'Your Headline — The Most Important Line', 'published', false from m2
union all select m2.module_id, m2.course_id, 5, 'Writing an About Section That Converts', 'published', false from m2
union all select m2.module_id, m2.course_id, 6, 'Experience Section with AI', 'published', false from m2
union all select m2.module_id, m2.course_id, 7, 'Skills, Endorsements and Keywords', 'published', false from m2
union all select m3.module_id, m3.course_id, 8, 'Creating Your First LinkedIn Post', 'published', false from m3
union all select m3.module_id, m3.course_id, 9, 'Content Types That Get Engagement', 'published', false from m3
union all select m3.module_id, m3.course_id, 10, 'Using AI to Write LinkedIn Content', 'published', false from m3
union all select m4.module_id, m4.course_id, 11, 'Strategic Networking', 'published', false from m4
union all select m4.module_id, m4.course_id, 12, 'Inbound Opportunities', 'published', false from m4
union all select m4.module_id, m4.course_id, 13, 'Your 30-Day LinkedIn Action Plan', 'published', false from m4;

-- ── 9. Resume Building with AI ────────────────────────────────────
with c9 as (
  insert into public.courses
    (slug, title, subtitle, category, difficulty, icon, theme_color,
     cert_price_paise, is_free, sort_order, status, visibility, domain_id, estimated_hours)
  values (
    'resume-building',
    'Resume Building with AI',
    'Create an ATS-optimised resume that gets interviews',
    'Career Development', 'Beginner', '📄', '#0D183D',
    29900, true, 9, 'published', 'public',
    (select domain_id from public.domains where slug = 'career-development' and app_id = 'academy'),
    2.5
  ) returning course_id
),
m1 as (insert into public.modules (course_id, module_number, title, status) select course_id, 1, 'Resume Strategy', 'published' from c9 returning module_id, course_id),
m2 as (insert into public.modules (course_id, module_number, title, status) select course_id, 2, 'Writing Your Resume', 'published' from c9 returning module_id, course_id),
m3 as (insert into public.modules (course_id, module_number, title, status) select course_id, 3, 'ATS Optimisation', 'published' from c9 returning module_id, course_id),
m4 as (insert into public.modules (course_id, module_number, title, status) select course_id, 4, 'Finalising and Applying', 'published' from c9 returning module_id, course_id)
insert into public.lessons (module_id, course_id, lesson_number, title, status, is_free_preview)
select m1.module_id, m1.course_id, 1, 'What Recruiters Look For in 2025', 'published', true from m1
union all select m1.module_id, m1.course_id, 2, 'Resume Formats That Work', 'published', false from m1
union all select m1.module_id, m1.course_id, 3, 'Targeting Your Resume to a Role', 'published', false from m1
union all select m2.module_id, m2.course_id, 4, 'Professional Summary with AI', 'published', false from m2
union all select m2.module_id, m2.course_id, 5, 'Writing Achievement Bullets', 'published', false from m2
union all select m2.module_id, m2.course_id, 6, 'Skills Section Strategy', 'published', false from m2
union all select m2.module_id, m2.course_id, 7, 'Education and Certifications', 'published', false from m2
union all select m3.module_id, m3.course_id, 8, 'Understanding ATS Systems', 'published', false from m3
union all select m3.module_id, m3.course_id, 9, 'Keyword Optimisation with AI', 'published', false from m3
union all select m3.module_id, m3.course_id, 10, 'Testing Your Resume with AI', 'published', false from m3
union all select m4.module_id, m4.course_id, 11, 'Cover Letters with AI', 'published', false from m4
union all select m4.module_id, m4.course_id, 12, 'Application Strategy', 'published', false from m4
union all select m4.module_id, m4.course_id, 13, 'Interview Preparation', 'published', false from m4;

-- ── 10. Mastery in Artificial Intelligence ────────────────────────
with c10 as (
  insert into public.courses
    (slug, title, subtitle, category, difficulty, icon, theme_color,
     cert_price_paise, is_free, sort_order, status, visibility, domain_id, estimated_hours)
  values (
    'artificial-intelligence-mastery',
    'Mastery in Artificial Intelligence',
    'Deep understanding of AI — from foundational concepts to real-world application',
    'AI Fundamentals', 'Intermediate', '🤖', '#6B21A8',
    29900, true, 10, 'published', 'public',
    (select domain_id from public.domains where slug = 'ai-fundamentals' and app_id = 'academy'),
    5.5
  ) returning course_id
),
m1 as (insert into public.modules (course_id, module_number, title, status) select course_id, 1, 'AI Foundations', 'published' from c10 returning module_id, course_id),
m2 as (insert into public.modules (course_id, module_number, title, status) select course_id, 2, 'Machine Learning Essentials', 'published' from c10 returning module_id, course_id),
m3 as (insert into public.modules (course_id, module_number, title, status) select course_id, 3, 'Generative AI Deep Dive', 'published' from c10 returning module_id, course_id),
m4 as (insert into public.modules (course_id, module_number, title, status) select course_id, 4, 'AI Strategy and Implementation', 'published' from c10 returning module_id, course_id)
insert into public.lessons (module_id, course_id, lesson_number, title, status, is_free_preview)
select m1.module_id, m1.course_id, 1, 'What is Artificial Intelligence?', 'published', true from m1
union all select m1.module_id, m1.course_id, 2, 'A Brief History of AI', 'published', false from m1
union all select m1.module_id, m1.course_id, 3, 'Types of AI Systems', 'published', false from m1
union all select m1.module_id, m1.course_id, 4, 'AI in Industry Today', 'published', false from m1
union all select m1.module_id, m1.course_id, 5, 'Ethics and Responsible AI', 'published', false from m1
union all select m2.module_id, m2.course_id, 6, 'What is Machine Learning?', 'published', false from m2
union all select m2.module_id, m2.course_id, 7, 'Supervised and Unsupervised Learning', 'published', false from m2
union all select m2.module_id, m2.course_id, 8, 'Neural Networks Explained Simply', 'published', false from m2
union all select m2.module_id, m2.course_id, 9, 'Deep Learning in Practice', 'published', false from m2
union all select m3.module_id, m3.course_id, 10, 'What are Large Language Models?', 'published', false from m3
union all select m3.module_id, m3.course_id, 11, 'How ChatGPT Works Under the Hood', 'published', false from m3
union all select m3.module_id, m3.course_id, 12, 'Image and Multimodal AI', 'published', false from m3
union all select m3.module_id, m3.course_id, 13, 'The Future of Generative AI', 'published', false from m3
union all select m4.module_id, m4.course_id, 14, 'AI Strategy for Organisations', 'published', false from m4
union all select m4.module_id, m4.course_id, 15, 'Building an AI Roadmap', 'published', false from m4
union all select m4.module_id, m4.course_id, 16, 'AI Risk and Governance', 'published', false from m4
union all select m4.module_id, m4.course_id, 17, 'Becoming an AI-First Professional', 'published', false from m4;

-- ── Verify seed ───────────────────────────────────────────────────
select
  c.title,
  count(distinct m.module_id) as modules,
  count(distinct l.lesson_id) as lessons
from public.courses c
left join public.modules m on m.course_id = c.course_id
left join public.lessons l on l.course_id = c.course_id
group by c.title, c.sort_order
order by c.sort_order;
