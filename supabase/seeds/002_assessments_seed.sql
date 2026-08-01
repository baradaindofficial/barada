-- ═══════════════════════════════════════════════════════════════════
-- 002_assessments_seed.sql
-- Barada Academy — Course Evaluations
-- 10 assessments × 5 MCQs × 4 options = 200 options
-- Run AFTER 001_courses_seed.sql
-- Paste ONE course block at a time into Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- ── COURSE 1: ChatGPT for Professionals ──────────────────────────
with ass as (
  insert into public.assessments (course_id, title, description, assessment_type, pass_threshold, status, app_id)
  select course_id, 'ChatGPT for Professionals — Course Evaluation',
    'Test your knowledge of ChatGPT for professional use.', 'final_exam', 60, 'published', 'academy'
  from public.courses where slug = 'chatgpt-for-professionals'
  returning assessment_id
),
q1 as (
  insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 1, 'mcq', 'What does GPT stand for in ChatGPT?',
    'GPT stands for Generative Pre-trained Transformer — the neural network architecture powering ChatGPT.', 1, 1 from ass
  returning question_id
),
q2 as (
  insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 2, 'mcq', 'What is the primary purpose of the CRAFT framework in prompt engineering?',
    'CRAFT helps structure prompts with Context, Role, Action, Format and Tone for more reliable AI responses.', 1, 2 from ass
  returning question_id
),
q3 as (
  insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 3, 'mcq', 'Which approach produces the best results when asking ChatGPT for professional writing?',
    'Providing clear context, a defined role and specific requirements gives ChatGPT enough information to produce accurate, relevant output.', 1, 3 from ass
  returning question_id
),
q4 as (
  insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 4, 'mcq', 'What does "temperature" control in ChatGPT settings?',
    'Temperature controls randomness. Higher values produce more creative and varied responses; lower values produce more predictable, focused output.', 1, 4 from ass
  returning question_id
),
q5 as (
  insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 5, 'mcq', 'Which is the most effective way to handle a complex task with ChatGPT?',
    'Breaking complex tasks into sequential, focused prompts gives the model enough focus to produce reliable output at each step.', 1, 5 from ass
  returning question_id
),
o1 as (
  insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'General Purpose Technology', false, 1 from q1
  union all select question_id, 'Generative Pre-trained Transformer', true, 2 from q1
  union all select question_id, 'Global Processing Terminal', false, 3 from q1
  union all select question_id, 'Guided Prompt Technology', false, 4 from q1
),
o2 as (
  insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'To create images with AI', false, 1 from q2
  union all select question_id, 'To structure prompts for better AI responses', true, 2 from q2
  union all select question_id, 'To code with AI assistance', false, 3 from q2
  union all select question_id, 'To train AI models', false, 4 from q2
),
o3 as (
  insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Asking vague one-line questions', false, 1 from q3
  union all select question_id, 'Providing clear context, role and specific requirements', true, 2 from q3
  union all select question_id, 'Using only bullet points', false, 3 from q3
  union all select question_id, 'Copying prompts from the internet', false, 4 from q3
),
o4 as (
  insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'The processing speed of responses', false, 1 from q4
  union all select question_id, 'The length of responses', false, 2 from q4
  union all select question_id, 'The randomness and creativity of responses', true, 3 from q4
  union all select question_id, 'The language of responses', false, 4 from q4
)
insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
select question_id, 'Ask everything in one very long message', false, 1 from q5
union all select question_id, 'Break the task into smaller sequential prompts', true, 2 from q5
union all select question_id, 'Only use bullet points', false, 3 from q5
union all select question_id, 'Ask in multiple languages simultaneously', false, 4 from q5;

-- ── COURSE 2: Claude AI for Professionals ────────────────────────
with ass as (
  insert into public.assessments (course_id, title, description, assessment_type, pass_threshold, status, app_id)
  select course_id, 'Claude AI for Professionals — Course Evaluation',
    'Test your knowledge of Claude AI for professional use.', 'final_exam', 60, 'published', 'academy'
  from public.courses where slug = 'claude-for-professionals'
  returning assessment_id
),
q1 as (
  insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 1, 'mcq', 'Which company created Claude AI?',
    'Claude is created by Anthropic, an AI safety company founded in 2021.', 1, 1 from ass
  returning question_id
),
q2 as (
  insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 2, 'mcq', 'What is Claude''s key strength compared to many other AI models?',
    'Claude excels at long-form reasoning, nuanced analysis and maintaining consistency across very long documents.', 1, 2 from ass
  returning question_id
),
q3 as (
  insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 3, 'mcq', 'What does Constitutional AI mean in the context of Claude?',
    'Constitutional AI is Anthropic''s approach of training AI with a set of explicit principles to guide behaviour toward being helpful, harmless and honest.', 1, 3 from ass
  returning question_id
),
q4 as (
  insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 4, 'mcq', 'When giving Claude a complex document to analyze, what is the best practice?',
    'Providing the document alongside specific questions and a desired output format gives Claude the precise task parameters needed for useful analysis.', 1, 4 from ass
  returning question_id
),
q5 as (
  insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 5, 'mcq', 'What is Claude''s context window advantage for professional work?',
    'Claude can process very large amounts of text in one conversation — making it ideal for analyzing long reports, contracts or research papers.', 1, 5 from ass
  returning question_id
),
o1 as (
  insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'OpenAI', false, 1 from q1
  union all select question_id, 'Google', false, 2 from q1
  union all select question_id, 'Anthropic', true, 3 from q1
  union all select question_id, 'Microsoft', false, 4 from q1
),
o2 as (
  insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Image generation quality', false, 1 from q2
  union all select question_id, 'Long-form reasoning and nuanced analysis', true, 2 from q2
  union all select question_id, 'Real-time internet access', false, 3 from q2
  union all select question_id, 'Video creation capabilities', false, 4 from q2
),
o3 as (
  insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Claude can write legal constitutions', false, 1 from q3
  union all select question_id, 'Training AI with explicit principles to guide behavior', true, 2 from q3
  union all select question_id, 'Claude only works in democratic countries', false, 3 from q3
  union all select question_id, 'A coding architecture framework', false, 4 from q3
),
o4 as (
  insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Upload without any instructions', false, 1 from q4
  union all select question_id, 'Provide the document with specific questions and desired output format', true, 2 from q4
  union all select question_id, 'Ask Claude to read first then ask questions later', false, 3 from q4
  union all select question_id, 'Summarize the document yourself before asking', false, 4 from q4
)
insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
select question_id, 'It can access the internet in real time', false, 1 from q5
union all select question_id, 'It can process very large amounts of text in one conversation', true, 2 from q5
union all select question_id, 'It can generate images and video', false, 3 from q5
union all select question_id, 'It processes requests faster than all other models', false, 4 from q5;

-- ── COURSE 3: AI Tools for Professionals ─────────────────────────
with ass as (
  insert into public.assessments (course_id, title, description, assessment_type, pass_threshold, status, app_id)
  select course_id, 'AI Tools for Professionals — Course Evaluation',
    'Test your knowledge of the AI tools landscape.', 'final_exam', 60, 'published', 'academy'
  from public.courses where slug = 'ai-tools-for-professionals'
  returning assessment_id
),
q1 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 1, 'mcq', 'Which AI tool is best suited for academic and professional research with cited sources?',
    'Perplexity AI is specifically designed for research with real-time web search and source citations.', 1, 1 from ass returning question_id),
q2 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 2, 'mcq', 'What does the term "AI Stack" refer to in professional productivity?',
    'Your AI stack is the specific combination of AI tools you use together to accomplish your professional work.', 1, 2 from ass returning question_id),
q3 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 3, 'mcq', 'What is Notion AI primarily designed for?',
    'Notion AI enhances the Notion knowledge management platform with AI for writing, summarizing and organizing notes.', 1, 3 from ass returning question_id),
q4 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 4, 'mcq', 'Which AI tool is best for generating professional slide decks from a text prompt?',
    'Gamma and Beautiful.ai are purpose-built for AI-generated presentations from natural language input.', 1, 4 from ass returning question_id),
q5 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 5, 'mcq', 'What is the key consideration when choosing between free and paid AI tools?',
    'The right tool depends on your specific use case, required output quality and workflow integration — not price alone.', 1, 5 from ass returning question_id),
o1 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'DALL-E', false, 1 from q1
  union all select question_id, 'Perplexity AI', true, 2 from q1
  union all select question_id, 'Midjourney', false, 3 from q1
  union all select question_id, 'Runway', false, 4 from q1),
o2 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'A type of computer hardware', false, 1 from q2
  union all select question_id, 'The combination of AI tools you use for your work', true, 2 from q2
  union all select question_id, 'A software coding framework', false, 3 from q2
  union all select question_id, 'A social media platform', false, 4 from q2),
o3 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Video and image generation', false, 1 from q3
  union all select question_id, 'Knowledge management and note-taking with AI', true, 2 from q3
  union all select question_id, 'Code debugging and review', false, 3 from q3
  union all select question_id, 'Real-time language translation', false, 4 from q3),
o4 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Stable Diffusion', false, 1 from q4
  union all select question_id, 'Gamma or Beautiful.ai', true, 2 from q4
  union all select question_id, 'GitHub Copilot', false, 3 from q4
  union all select question_id, 'Hugging Face', false, 4 from q4)
insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
select question_id, 'Always choose the free tool', false, 1 from q5
union all select question_id, 'Match the tool to your use case and required output quality', true, 2 from q5
union all select question_id, 'Always choose the most expensive option', false, 3 from q5
union all select question_id, 'Use only one tool for everything', false, 4 from q5;

-- ── COURSE 4: Mastery in Prompt Engineering ───────────────────────
with ass as (
  insert into public.assessments (course_id, title, description, assessment_type, pass_threshold, status, app_id)
  select course_id, 'Mastery in Prompt Engineering — Course Evaluation',
    'Test your mastery of prompt engineering techniques.', 'final_exam', 60, 'published', 'academy'
  from public.courses where slug = 'prompt-engineering-mastery'
  returning assessment_id
),
q1 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 1, 'mcq', 'What is zero-shot prompting?',
    'Zero-shot prompting asks the AI to complete a task without providing any examples — relying entirely on the model''s training.', 1, 1 from ass returning question_id),
q2 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 2, 'mcq', 'What is Chain-of-Thought prompting?',
    'Chain-of-Thought prompting instructs the model to reason step by step before giving a final answer, improving accuracy on complex tasks.', 1, 2 from ass returning question_id),
q3 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 3, 'mcq', 'In few-shot prompting, what are the "shots"?',
    'In few-shot prompting, "shots" are examples provided within the prompt that demonstrate the desired input-output pattern.', 1, 3 from ass returning question_id),
q4 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 4, 'mcq', 'What does "hallucination" mean in the context of AI language models?',
    'Hallucination refers to when an AI model generates confident but factually incorrect or fabricated information.', 1, 4 from ass returning question_id),
q5 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 5, 'mcq', 'Which prompt structure generally produces the most reliable professional output?',
    'Combining Role, Context, Task, Format and Constraints gives the model all the parameters it needs to produce consistently reliable output.', 1, 5 from ass returning question_id),
o1 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Prompting with absolutely no context at all', false, 1 from q1
  union all select question_id, 'Asking AI to complete a task without providing examples', true, 2 from q1
  union all select question_id, 'A prompt that failed to produce a result', false, 3 from q1
  union all select question_id, 'Prompting that takes zero seconds', false, 4 from q1),
o2 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Linking multiple AI tools together in a chain', false, 1 from q2
  union all select question_id, 'Guiding the AI to reason step by step before giving a final answer', true, 2 from q2
  union all select question_id, 'Writing prompts in a numbered list format', false, 3 from q2
  union all select question_id, 'Using multiple AI models simultaneously', false, 4 from q2),
o3 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Random attempts at getting the right answer', false, 1 from q3
  union all select question_id, 'Examples provided in the prompt to guide the AI''s response', true, 2 from q3
  union all select question_id, 'Short one-word prompts', false, 3 from q3
  union all select question_id, 'Separate API calls to different models', false, 4 from q3),
o4 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'The AI creating optical illusions', false, 1 from q4
  union all select question_id, 'When AI generates confident but factually incorrect information', true, 2 from q4
  union all select question_id, 'A type of advanced prompting technique', false, 3 from q4
  union all select question_id, 'The AI running slowly due to overload', false, 4 from q4)
insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
select question_id, 'Just a simple task description', false, 1 from q5
union all select question_id, 'Role + Context + Task + Format + Constraints', true, 2 from q5
union all select question_id, 'A very long paragraph with all information', false, 3 from q5
union all select question_id, 'Multiple unrelated questions in one message', false, 4 from q5;

-- ── COURSE 5: Mastery in AI Productivity ─────────────────────────
with ass as (
  insert into public.assessments (course_id, title, description, assessment_type, pass_threshold, status, app_id)
  select course_id, 'Mastery in AI Productivity — Course Evaluation',
    'Test your knowledge of AI-powered productivity systems.', 'final_exam', 60, 'published', 'academy'
  from public.courses where slug = 'ai-productivity-mastery'
  returning assessment_id
),
q1 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 1, 'mcq', 'What is the recommended first step in implementing AI productivity in your workflow?',
    'Auditing your workflow first identifies where AI can have the greatest impact before you invest in any tools.', 1, 1 from ass returning question_id),
q2 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 2, 'mcq', 'What is a Prompt Template in the context of AI productivity?',
    'A prompt template is a reusable prompt structure with variable placeholders that can be filled in for recurring tasks.', 1, 2 from ass returning question_id),
q3 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 3, 'mcq', 'How should AI be used in professional meetings for the best results?',
    'AI adds value at all three stages: pre-meeting preparation, during-meeting notes, and post-meeting follow-up summaries.', 1, 3 from ass returning question_id),
q4 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 4, 'mcq', 'Which AI technique is most effective for handling large volumes of professional email?',
    'AI can draft, categorize and prioritize emails — dramatically reducing time spent on communication.', 1, 4 from ass returning question_id),
q5 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 5, 'mcq', 'What is the concept of a "Personal AI Operating System"?',
    'A Personal AI OS is a systematic approach to integrating multiple AI tools into a unified, intentional personal workflow.', 1, 5 from ass returning question_id),
o1 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Buy all available AI tools immediately', false, 1 from q1
  union all select question_id, 'Audit your workflow to identify repetitive and time-consuming tasks', true, 2 from q1
  union all select question_id, 'Replace all human work with AI immediately', false, 3 from q1
  union all select question_id, 'Learn to code before using any AI tools', false, 4 from q1),
o2 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'A type of AI model for productivity', false, 1 from q2
  union all select question_id, 'A reusable prompt structure for recurring tasks', true, 2 from q2
  union all select question_id, 'A coding framework', false, 3 from q2
  union all select question_id, 'A Microsoft Word document template', false, 4 from q2),
o3 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Replace all meetings with AI chatbots', false, 1 from q3
  union all select question_id, 'Use AI for preparation, during-meeting notes, and follow-up', true, 2 from q3
  union all select question_id, 'Only use AI to schedule meetings', false, 3 from q3
  union all select question_id, 'Avoid AI in meetings to maintain human connection', false, 4 from q3),
o4 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Deleting all non-essential emails', false, 1 from q4
  union all select question_id, 'Using AI to draft, categorize and prioritize emails', true, 2 from q4
  union all select question_id, 'Forwarding all emails to an AI assistant', false, 3 from q4
  union all select question_id, 'Avoiding email and switching to chat only', false, 4 from q4)
insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
select question_id, 'A new computer operating system powered by AI', false, 1 from q5
union all select question_id, 'A systematic approach to integrating multiple AI tools into a unified personal workflow', true, 2 from q5
union all select question_id, 'An AI-powered smartphone', false, 3 from q5
union all select question_id, 'A type of AI training program', false, 4 from q5;

-- ── COURSE 6: Excel with AI ───────────────────────────────────────
with ass as (
  insert into public.assessments (course_id, title, description, assessment_type, pass_threshold, status, app_id)
  select course_id, 'Excel with AI — Course Evaluation',
    'Test your Excel and AI knowledge.', 'final_exam', 60, 'published', 'academy'
  from public.courses where slug = 'excel-with-ai'
  returning assessment_id
),
q1 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 1, 'mcq', 'What is Microsoft Copilot''s primary function in Excel?',
    'Copilot in Excel assists with data analysis, formula creation and generating insights using natural language commands.', 1, 1 from ass returning question_id),
q2 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 2, 'mcq', 'Which formula combination is most powerful for flexible data lookups in Excel?',
    'INDEX and MATCH together are more flexible than VLOOKUP — they can look in any direction and handle column insertions gracefully.', 1, 2 from ass returning question_id),
q3 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 3, 'mcq', 'What is Power Query used for in Excel?',
    'Power Query is Excel''s data transformation engine for importing, cleaning and shaping data from multiple sources without code.', 1, 3 from ass returning question_id),
q4 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 4, 'mcq', 'How can ChatGPT best assist with Excel work?',
    'ChatGPT excels at explaining formulas in plain language, debugging errors and suggesting approaches — it does not connect to your spreadsheet directly.', 1, 4 from ass returning question_id),
q5 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 5, 'mcq', 'What is a PivotTable primarily used for?',
    'PivotTables allow you to summarize, group and aggregate large datasets to surface patterns and insights quickly.', 1, 5 from ass returning question_id),
o1 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Replacing all Excel formulas permanently', false, 1 from q1
  union all select question_id, 'Assisting with data analysis and formula creation using natural language', true, 2 from q1
  union all select question_id, 'Creating PowerPoint slides from Excel data', false, 3 from q1
  union all select question_id, 'Connecting Excel to external databases automatically', false, 4 from q1),
o2 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'SUM and AVERAGE together', false, 1 from q2
  union all select question_id, 'INDEX and MATCH', true, 2 from q2
  union all select question_id, 'VLOOKUP alone', false, 3 from q2
  union all select question_id, 'IF and THEN statements', false, 4 from q2),
o3 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Creating charts and visualizations', false, 1 from q3
  union all select question_id, 'Importing, transforming and cleaning data from multiple sources', true, 2 from q3
  union all select question_id, 'Writing VBA macros automatically', false, 3 from q3
  union all select question_id, 'Sending email reports from Excel', false, 4 from q3),
o4 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'By replacing Excel with AI entirely', false, 1 from q4
  union all select question_id, 'By explaining formulas, debugging errors and suggesting approaches', true, 2 from q4
  union all select question_id, 'By connecting directly to your spreadsheet', false, 3 from q4
  union all select question_id, 'By generating random sample data', false, 4 from q4)
insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
select question_id, 'Creating presentations from spreadsheet data', false, 1 from q5
union all select question_id, 'Summarizing and analyzing large datasets by grouping and aggregating', true, 2 from q5
union all select question_id, 'Writing complex formulas automatically', false, 3 from q5
union all select question_id, 'Formatting and styling cells', false, 4 from q5;

-- ── COURSE 7: PowerPoint with AI ─────────────────────────────────
with ass as (
  insert into public.assessments (course_id, title, description, assessment_type, pass_threshold, status, app_id)
  select course_id, 'PowerPoint with AI — Course Evaluation',
    'Test your presentation and AI knowledge.', 'final_exam', 60, 'published', 'academy'
  from public.courses where slug = 'powerpoint-with-ai'
  returning assessment_id
),
q1 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 1, 'mcq', 'What does the SCQA framework stand for in presentation storytelling?',
    'SCQA stands for Situation, Complication, Question, Answer — a structured narrative framework for executive presentations.', 1, 1 from ass returning question_id),
q2 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 2, 'mcq', 'Which AI tool can generate a complete slide deck from a text prompt?',
    'Gamma and Beautiful.ai are purpose-built AI presentation tools that create full slide decks from natural language input.', 1, 2 from ass returning question_id),
q3 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 3, 'mcq', 'What is the "one idea per slide" principle?',
    'Each slide should communicate one single clear message — this forces clarity and makes presentations more memorable.', 1, 3 from ass returning question_id),
q4 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 4, 'mcq', 'What does Microsoft Copilot do in PowerPoint?',
    'Copilot in PowerPoint creates slides from prompts, rewrites and refines content, and suggests design improvements.', 1, 4 from ass returning question_id),
q5 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 5, 'mcq', 'What is the primary purpose of speaker notes in a presentation?',
    'Speaker notes provide detailed talking points and context for the presenter — they are not meant to be read aloud to the audience.', 1, 5 from ass returning question_id),
o1 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Slide Color Question Answer', false, 1 from q1
  union all select question_id, 'Situation, Complication, Question, Answer', true, 2 from q1
  union all select question_id, 'Structure, Content, Quality, Assessment', false, 3 from q1
  union all select question_id, 'Summary, Conclusion, Questions, Actions', false, 4 from q1),
o2 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Microsoft Paint AI', false, 1 from q2
  union all select question_id, 'Gamma or Beautiful.ai', true, 2 from q2
  union all select question_id, 'Google Docs AI', false, 3 from q2
  union all select question_id, 'Notepad AI assistant', false, 4 from q2),
o3 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Each slide should contain only one image', false, 1 from q3
  union all select question_id, 'Each slide should communicate one single clear message', true, 2 from q3
  union all select question_id, 'Slides should use only one color throughout', false, 3 from q3
  union all select question_id, 'Each slide should contain exactly one word', false, 4 from q3),
o4 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Generates video content from slides', false, 1 from q4
  union all select question_id, 'Creates slides from prompts, rewrites content and suggests designs', true, 2 from q4
  union all select question_id, 'Replaces all slides with AI-generated images', false, 3 from q4
  union all select question_id, 'Adds animations and transitions automatically', false, 4 from q4)
insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
select question_id, 'To fill empty space on the slides', false, 1 from q5
union all select question_id, 'To provide detailed talking points and context for the presenter', true, 2 from q5
union all select question_id, 'To show the audience additional text', false, 3 from q5
union all select question_id, 'To replace the slides entirely', false, 4 from q5;

-- ── COURSE 8: LinkedIn Profile Optimisation ───────────────────────
with ass as (
  insert into public.assessments (course_id, title, description, assessment_type, pass_threshold, status, app_id)
  select course_id, 'LinkedIn Profile Optimisation — Course Evaluation',
    'Test your LinkedIn knowledge.', 'final_exam', 60, 'published', 'academy'
  from public.courses where slug = 'linkedin-profile-optimisation'
  returning assessment_id
),
q1 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 1, 'mcq', 'Which LinkedIn section has the greatest impact on profile discoverability in search?',
    'The headline is the most visible and indexed section — it appears in search results and is the first thing people read after your name.', 1, 1 from ass returning question_id),
q2 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 2, 'mcq', 'What does the LinkedIn algorithm prioritize in the news feed?',
    'LinkedIn rewards early engagement — posts that receive likes and comments within the first hour are shown to a much wider audience.', 1, 2 from ass returning question_id),
q3 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 3, 'mcq', 'What is the recommended structure for a LinkedIn About section?',
    'A strong About section covers who you are, what you do, who you help, and a call to action — in 3-5 short paragraphs.', 1, 3 from ass returning question_id),
q4 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 4, 'mcq', 'How should keywords be incorporated into a LinkedIn profile?',
    'Keywords placed in the headline, About section and experience descriptions help LinkedIn''s algorithm surface your profile in relevant searches.', 1, 4 from ass returning question_id),
q5 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 5, 'mcq', 'What type of LinkedIn content generates the most professional engagement?',
    'A mix of personal insights, professional lessons and industry perspectives creates a well-rounded thought leadership presence.', 1, 5 from ass returning question_id),
o1 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Interests and groups section', false, 1 from q1
  union all select question_id, 'Headline', true, 2 from q1
  union all select question_id, 'Background photo', false, 3 from q1
  union all select question_id, 'Education section', false, 4 from q1),
o2 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Random content with no pattern', false, 1 from q2
  union all select question_id, 'Content with early engagement — likes and comments within the first hour', true, 2 from q2
  union all select question_id, 'Only paid promotional posts', false, 3 from q2
  union all select question_id, 'The most recent posts regardless of engagement', false, 4 from q2),
o3 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'A single sentence summary', false, 1 from q3
  union all select question_id, '3-5 short paragraphs covering who you are, what you do and who you help', true, 2 from q3
  union all select question_id, 'A full page of detailed text', false, 3 from q3
  union all select question_id, 'Only bullet points with achievements', false, 4 from q3),
o4 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Avoid keywords to keep it sounding natural', false, 1 from q4
  union all select question_id, 'Place keywords strategically in headline, About and experience sections', true, 2 from q4
  union all select question_id, 'Only place keywords in the Skills section', false, 3 from q4
  union all select question_id, 'Repeat keywords as many times as possible everywhere', false, 4 from q4)
insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
select question_id, 'Only sharing job postings and company news', false, 1 from q5
union all select question_id, 'A mix of personal insights, professional lessons and industry perspectives', true, 2 from q5
union all select question_id, 'Daily motivational quotes', false, 3 from q5
union all select question_id, 'Only formal articles with no personal commentary', false, 4 from q5;

-- ── COURSE 9: Resume Building with AI ────────────────────────────
with ass as (
  insert into public.assessments (course_id, title, description, assessment_type, pass_threshold, status, app_id)
  select course_id, 'Resume Building with AI — Course Evaluation',
    'Test your resume and career knowledge.', 'final_exam', 60, 'published', 'academy'
  from public.courses where slug = 'resume-building'
  returning assessment_id
),
q1 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 1, 'mcq', 'What does ATS stand for in the context of job applications?',
    'ATS stands for Applicant Tracking System — software used by companies to filter and rank resumes before human review.', 1, 1 from ass returning question_id),
q2 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 2, 'mcq', 'Which resume format is most ATS-friendly?',
    'A clean single-column format with standard section headings is most reliably parsed by ATS systems without formatting errors.', 1, 2 from ass returning question_id),
q3 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 3, 'mcq', 'What is the most effective way to write achievement bullets on a resume?',
    'The CAR format (Challenge, Action, Result) with quantified outcomes demonstrates clear impact and is what recruiters look for.', 1, 3 from ass returning question_id),
q4 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 4, 'mcq', 'How should a resume be tailored for each job application?',
    'Adjusting keywords, skills and highlighted achievements to match the specific job description significantly improves ATS ranking.', 1, 4 from ass returning question_id),
q5 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 5, 'mcq', 'What is the recommended length for most professional resumes?',
    'One to two pages is the professional standard. One page for under 10 years of experience; two pages maximum for senior professionals.', 1, 5 from ass returning question_id),
o1 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Automated Training System', false, 1 from q1
  union all select question_id, 'Applicant Tracking System', true, 2 from q1
  union all select question_id, 'Advanced Text Scanner', false, 3 from q1
  union all select question_id, 'Application Testing Software', false, 4 from q1),
o2 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Highly designed with graphics and multiple columns', false, 1 from q2
  union all select question_id, 'Clean single-column format with standard section headings', true, 2 from q2
  union all select question_id, 'A PDF with embedded images and charts', false, 3 from q2
  union all select question_id, 'A scanned handwritten document', false, 4 from q2),
o3 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'List all job duties and responsibilities', false, 1 from q3
  union all select question_id, 'Use the CAR format: Challenge, Action, Result with quantified outcomes', true, 2 from q3
  union all select question_id, 'Write in first person narrative style', false, 3 from q3
  union all select question_id, 'Keep each bullet as long and detailed as possible', false, 4 from q3),
o4 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Send exactly the same resume to every job', false, 1 from q4
  union all select question_id, 'Adjust keywords, skills and achievements to match the specific job description', true, 2 from q4
  union all select question_id, 'Only change the company name in the cover letter', false, 3 from q4
  union all select question_id, 'Add more pages of content for each new application', false, 4 from q4)
insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
select question_id, '5 or more pages for senior professionals', false, 1 from q5
union all select question_id, '1-2 pages maximum, one page preferred for under 10 years experience', true, 2 from q5
union all select question_id, 'As long as needed to include everything', false, 3 from q5
union all select question_id, 'Exactly 3 pages for all experience levels', false, 4 from q5;

-- ── COURSE 10: Mastery in Artificial Intelligence ─────────────────
with ass as (
  insert into public.assessments (course_id, title, description, assessment_type, pass_threshold, status, app_id)
  select course_id, 'Mastery in Artificial Intelligence — Course Evaluation',
    'Test your foundational AI knowledge.', 'final_exam', 60, 'published', 'academy'
  from public.courses where slug = 'artificial-intelligence-mastery'
  returning assessment_id
),
q1 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 1, 'mcq', 'What is the key difference between Narrow AI and General AI?',
    'Narrow AI is designed for specific tasks (like image recognition or language translation). General AI — which does not yet exist commercially — could perform any intellectual task.', 1, 1 from ass returning question_id),
q2 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 2, 'mcq', 'What does "supervised learning" mean in machine learning?',
    'Supervised learning trains a model on labeled input-output pairs so it learns to predict correct outputs for new inputs.', 1, 2 from ass returning question_id),
q3 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 3, 'mcq', 'What is a neural network inspired by?',
    'Neural networks are loosely inspired by the structure and function of the human brain, specifically neurons and synaptic connections.', 1, 3 from ass returning question_id),
q4 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 4, 'mcq', 'What does "training data" mean in the context of AI models?',
    'Training data is the dataset used to teach a machine learning model the patterns and relationships it will use to make predictions.', 1, 4 from ass returning question_id),
q5 as (insert into public.assessment_questions (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  select assessment_id, 5, 'mcq', 'What is the primary ethical concern with generative AI in professional contexts?',
    'Misinformation, bias in outputs, intellectual property questions and over-reliance on AI are the key ethical concerns for professional AI use.', 1, 5 from ass returning question_id),
o1 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Narrow AI is cheaper to run than General AI', false, 1 from q1
  union all select question_id, 'Narrow AI is designed for specific tasks while General AI can perform any intellectual task', true, 2 from q1
  union all select question_id, 'Narrow AI is always faster than General AI', false, 3 from q1
  union all select question_id, 'General AI already exists and is widely deployed commercially', false, 4 from q1),
o2 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'A human teacher watches the AI as it learns', false, 1 from q2
  union all select question_id, 'Training a model on labeled input-output pairs so it learns to predict outputs', true, 2 from q2
  union all select question_id, 'The AI only learns when a human is watching it train', false, 3 from q2
  union all select question_id, 'A type of reinforcement learning with rewards', false, 4 from q2),
o3 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'The structure of computer circuits and processors', false, 1 from q3
  union all select question_id, 'The structure and function of the human brain', true, 2 from q3
  union all select question_id, 'Mathematical equations and linear algebra only', false, 3 from q3
  union all select question_id, 'Database architecture and SQL schemas', false, 4 from q3),
o4 as (insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
  select question_id, 'Data used after the model is deployed in production', false, 1 from q4
  union all select question_id, 'The dataset used to teach a machine learning model patterns and relationships', true, 2 from q4
  union all select question_id, 'Random data fed to the model during testing', false, 3 from q4
  union all select question_id, 'Data about the AI model''s training schedule and timeline', false, 4 from q4)
insert into public.assessment_options (question_id, option_text, is_correct, sort_order)
select question_id, 'AI tools are too expensive for most organisations', false, 1 from q5
union all select question_id, 'Misinformation, bias, intellectual property and over-reliance on AI outputs', true, 2 from q5
union all select question_id, 'AI processes information too slowly for professional use', false, 3 from q5
union all select question_id, 'AI cannot be used in any professional context', false, 4 from q5;

-- ── Verify ────────────────────────────────────────────────────────
select
  c.title,
  count(distinct a.assessment_id) as assessments,
  count(distinct q.question_id) as questions,
  count(distinct o.option_id) as options
from public.courses c
left join public.assessments a on a.course_id = c.course_id
left join public.assessment_questions q on q.assessment_id = a.assessment_id
left join public.assessment_options o on o.question_id = q.question_id
group by c.title, c.sort_order
order by c.sort_order;
