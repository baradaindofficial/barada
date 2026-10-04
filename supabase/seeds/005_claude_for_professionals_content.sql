-- ============================================================
-- Seed: Claude AI for Professionals — real lesson content
-- Written 2026-10-04, at BK's request ("this is your program").
--
-- This course (slug 'claude-for-professionals') already exists with
-- 4 modules and 13 published lessons (titles only, no body) from
-- supabase/seeds/001_courses_seed.sql, and already has a published
-- 5-question assessment from supabase/seeds/002_assessments_seed.sql.
-- This migration is PURELY ADDITIVE in effect: it only UPDATEs the
-- description/outcomes/etc. on the existing course row, the existing
-- 4 module rows, and the existing 13 lesson rows, matched by slug /
-- module_number / lesson_number. It inserts no new rows, deletes
-- nothing, and does not touch the existing assessment.
--
-- Run this once, after confirming (select count(*) from public.lessons
-- l join public.courses c on c.course_id = l.course_id where c.slug =
-- 'claude-for-professionals') returns 13, as a sanity check that the
-- course still has exactly the rows this migration expects.
-- ============================================================

-- ── Course-level ──────────────────────────────────────────────────
update public.courses set
  description = 'A 4-module, 13-lesson course that takes a working professional from a first Claude conversation to confident daily use — covering what makes Claude different, how to work with long documents and research, writing with real nuance, multi-step reasoning, and folding Claude into an actual weekly workflow.',
  outcomes = array[
    'Explain what makes Claude distinct from other AI assistants, and choose it deliberately for the tasks it suits best',
    'Hold a first Claude conversation with confidence, including uploading and discussing a real document',
    'Structure long, detailed prompts that make full use of Claude''s context window',
    'Use Claude for deep document analysis, complex research synthesis, and nuanced professional writing',
    'Apply multi-step reasoning techniques for problems too large for a single prompt',
    'Use Claude responsibly for code and data tasks, with appropriate verification',
    'Recognize the ethical considerations of everyday AI use at work',
    'Integrate Claude into a real weekly workflow, not just occasional one-off use'
  ],
  target_audience = array[
    'Working professionals who want an AI assistant for serious reading, writing, and analysis work',
    'Anyone already using ChatGPT casually who wants to understand when Claude is the better tool',
    'People who regularly work with long documents, reports, or research'
  ],
  prerequisites = array[
    'No prior AI experience required',
    'A free or paid Claude.ai account (the course works with either)'
  ],
  skills_covered = array[
    'Prompting for long-context, document-heavy work',
    'Professional writing and editing with Claude',
    'Research synthesis and verification',
    'Multi-step reasoning for complex tasks',
    'Responsible, everyday AI use at work'
  ],
  generation_mode = 'hybrid'
where slug = 'claude-for-professionals';

-- ── Module 1: Getting Started with Claude ────────────────────────
update public.modules m set
  description = 'What Claude actually is, how it differs from other assistants you may have used, and how to have a genuinely useful first conversation with it.',
  objectives = array[
    'Explain what makes Claude distinct, in plain language.',
    'Decide, for a given task, whether Claude or another AI tool is the better fit.',
    'Hold a first Claude conversation, including sharing a document, with confidence.'
  ],
  generation_mode = 'hybrid'
from public.courses c
where m.course_id = c.course_id and c.slug = 'claude-for-professionals' and m.module_number = 1;

-- ── Module 2: Core Skills ─────────────────────────────────────────
update public.modules m set
  description = 'The three things most professionals actually use Claude for day to day: reading and analyzing documents, researching a question properly, and writing with real nuance.',
  objectives = array[
    'Use Claude to analyze a long or complex document and extract exactly what you need.',
    'Run a multi-source research task through Claude without losing track of what''s verified and what isn''t.',
    'Get writing out of Claude that sounds considered, not generic.'
  ],
  generation_mode = 'hybrid'
from public.courses c
where m.course_id = c.course_id and c.slug = 'claude-for-professionals' and m.module_number = 2;

-- ── Module 3: Advanced Usage ──────────────────────────────────────
update public.modules m set
  description = 'Moving past single-question prompting into multi-step reasoning, careful use of Claude for code and data work, and the ethical considerations that come with heavier everyday use.',
  objectives = array[
    'Break a complex problem into steps Claude can reason through reliably.',
    'Use Claude for code and data tasks with the right amount of verification.',
    'Apply a clear-eyed view of what responsible AI use looks like at work.'
  ],
  generation_mode = 'hybrid'
from public.courses c
where m.course_id = c.course_id and c.slug = 'claude-for-professionals' and m.module_number = 3;

-- ── Module 4: Professional Integration ────────────────────────────
update public.modules m set
  description = 'Taking everything from the first three modules and turning it into a real, repeatable part of your working week — not a tool you open occasionally and forget.',
  objectives = array[
    'Identify two or three recurring tasks in your own role where Claude genuinely saves time.',
    'Design a small AI-augmented process around one of those tasks.',
    'Leave the course with a personal Claude toolkit you''ll actually keep using.'
  ],
  generation_mode = 'hybrid'
from public.courses c
where m.course_id = c.course_id and c.slug = 'claude-for-professionals' and m.module_number = 4;

-- ════════════════════════════════════════════════════════════════
-- LESSONS
-- ════════════════════════════════════════════════════════════════

-- Module 1, Lesson 1 — What Makes Claude Different
update public.lessons l set
  description = 'Claude is an AI assistant built by Anthropic, with a particular emphasis on careful reasoning, long-document handling, and being genuinely useful without being reckless. This lesson sets the mental model the rest of the course builds on.',
  body = 'Claude is built by Anthropic, a company whose founders left OpenAI specifically to focus on AI safety research. That origin shows up in how Claude behaves, not just in marketing copy: Claude is trained to be helpful, honest, and careful about its own limits — it will tell you when it''s unsure, decline tasks it judges harmful, and generally reason through a problem rather than pattern-match to a plausible-sounding answer.

For a working professional, three things tend to matter most in practice.

### A genuinely large context window
Claude can hold very long documents — a full contract, a 100-page report, a sprawling email thread — in a single conversation and reason across all of it at once, not just the last few paragraphs. This is the single biggest practical difference most people notice: you can paste in something long and ask real questions about the whole thing, not a summary of a summary.

### Careful, show-its-work reasoning
Claude tends to work through problems step by step rather than jumping straight to an answer, especially on anything that benefits from structured thinking — comparing options, checking its own logic, flagging where it''s making an assumption. For analysis and decision-support work, that habit of reasoning out loud is often more valuable than speed.

### A deliberate approach to its own limits
Claude is trained to decline requests it judges unsafe or inappropriate, and to say "I''m not sure" rather than bluff. This isn''t a limitation to work around — it''s the same habit of calibrated honesty you''d want from a sharp human colleague, and it''s worth noticing rather than fighting.

None of this means Claude is "better" in some absolute sense — it means Claude is built around a specific set of trade-offs that happen to suit long-document, high-stakes professional work particularly well. The next lesson gets concrete about when that matters and when it doesn''t.',
  objectives = array[
    'Describe what Anthropic built Claude to prioritize, in plain language.',
    'Identify Claude''s large context window as its most practically useful difference for document-heavy work.',
    'Recognize Claude''s tendency to reason step-by-step and acknowledge uncertainty as a deliberate design choice, not a weakness.'
  ],
  key_points = array[
    'Claude is built by Anthropic, with a founding emphasis on AI safety and careful reasoning.',
    'Its large context window lets you work with genuinely long documents in one conversation.',
    'Claude tends to reason step-by-step and flag its own uncertainty rather than bluff.',
    'These are deliberate trade-offs suited to long-document, high-stakes professional work.'
  ],
  practice_task = 'Open Claude.ai and ask it: "What are you particularly good at, and where should I be careful relying on you?" Read its answer critically — does it match what this lesson described, or does it surprise you? Note one thing you want to test for yourself.'
from public.courses c
where l.course_id = c.course_id and c.slug = 'claude-for-professionals' and l.lesson_number = 1;

-- Module 1, Lesson 2 — Claude vs ChatGPT — When to Use What
update public.lessons l set
  description = 'Most professionals end up with access to more than one AI assistant. This lesson gives you a practical way to decide which one to reach for, instead of defaulting to whichever tab is already open.',
  body = 'If you''ve used ChatGPT before, the honest answer to "which one should I use?" is: both, for different things, and it''s worth being deliberate about which.

### Reach for Claude when the task is long, careful, or document-heavy
Deep analysis of a long document, drafting something where tone and precision matter, multi-step reasoning you want to be able to follow and check, or any task where you''d rather the assistant say "I''m not sure" than guess confidently — these play to Claude''s particular strengths. If you''re going to paste in a long contract, report, or dataset and ask nuanced questions about it, Claude is usually the stronger starting point.

### Reach for other tools when you need something Claude doesn''t specialize in
Real-time web browsing for fast-changing information, image generation, or a huge existing library of third-party plugins and integrations might point you elsewhere, depending on what''s available in your workspace. This course won''t tell you to abandon other tools — it''ll teach you to use Claude well for what it''s genuinely strong at.

### A simple decision habit
Before you open an AI tool out of habit, ask yourself: is this task long or document-heavy? Does it need careful, checkable reasoning? Is precision in tone and wording important? A "yes" to any of those is a good signal to reach for Claude specifically, rather than whatever''s already open.

This isn''t about brand loyalty — it''s about matching the tool to the job, the same way you''d pick a spreadsheet over a word processor for numbers. The rest of this course assumes you''ve made that choice deliberately for the tasks ahead.',
  objectives = array[
    'List the kinds of tasks where Claude''s strengths (long context, careful reasoning, nuanced writing) give it a practical edge.',
    'Recognize when a different tool might be a better fit for a given task.',
    'Apply a simple decision habit before defaulting to whichever AI tool is already open.'
  ],
  key_points = array[
    'Claude is particularly strong for long, document-heavy, or nuance-sensitive tasks.',
    'No single AI tool is best at everything — matching the tool to the task is the professional habit worth building.',
    'A quick self-check (long? document-heavy? needs careful reasoning?) is a fast way to decide.'
  ],
  practice_task = 'Think of the last three times you used an AI assistant for work. For each one, would Claude''s strengths (long context, careful step-by-step reasoning, nuanced writing) have made a real difference, or would any tool have done the job equally well? Write one sentence per task.'
from public.courses c
where l.course_id = c.course_id and c.slug = 'claude-for-professionals' and l.lesson_number = 2;

-- Module 1, Lesson 3 — Your First Claude Conversation
update public.lessons l set
  description = 'A hands-on walkthrough of starting a real conversation with Claude — including uploading a document — so the rest of the course builds on something you''ve actually done, not just read about.',
  body = 'The fastest way to understand Claude is to use it on something real. This lesson is deliberately hands-on.

### Starting simply
Open Claude.ai and start with something low-stakes but real: a question you''d genuinely like answered, or a short piece of writing you''d like feedback on. Notice how the conversation feels — Claude will often ask a clarifying question if your request is ambiguous, rather than guessing silently and running with it. That''s worth noticing: it''s a habit, not an accident.

### Uploading a document
Try attaching a real document — a report, an email thread you''ve saved, a policy document, anything you have on hand that''s a page or more long. Ask Claude a specific question about it: not "summarize this" (though that works too) but something sharper, like "what are the three weakest arguments in this document, and why?" or "what would a skeptical reader object to here?" Specific questions get specific, useful answers; vague requests get generic ones.

### Projects, if your workspace has them
If your Claude.ai plan includes Projects, they''re worth knowing about early: a Project lets you keep a set of documents and context together across many conversations, instead of re-uploading the same files every time. For anyone doing recurring work — the same report format every month, the same client context every week — this is one of the more genuinely time-saving features in Claude.ai, and it''s worth setting one up as you work through this course.

### What "good" looks like in a first conversation
You''ll know you''re using Claude well when you''re having something closer to a working conversation than issuing a single command — asking a follow-up, pushing back on an answer, asking it to try a different angle. That back-and-forth is where the real value shows up, and it''s the pattern the rest of this course builds on.',
  objectives = array[
    'Start a real Claude conversation and notice its clarifying-question behavior.',
    'Upload a document and ask a specific, sharp question about it rather than a vague one.',
    'Recognize what a Project is for and when it''s worth setting one up.'
  ],
  key_points = array[
    'Claude often asks a clarifying question on an ambiguous request rather than silently guessing.',
    'Specific questions about an uploaded document get far more useful answers than vague ones.',
    'Projects (where available) keep context together across conversations for recurring work.',
    'Treat it as a working conversation, not a single command — follow-ups are where the value shows up.'
  ],
  practice_task = 'Upload a real document you have on hand (a report, a long email thread, anything a page or more) to a new Claude conversation. Ask it one sharp, specific question about the document — not a generic summary request. Then ask one follow-up based on its answer.'
from public.courses c
where l.course_id = c.course_id and c.slug = 'claude-for-professionals' and l.lesson_number = 3;

-- Module 1, Lesson 4 — Structuring Long Prompts
update public.lessons l set
  description = 'Claude''s large context window is only an advantage if you know how to structure a long, detailed prompt so it actually lands. This lesson covers the practical structure that works.',
  body = 'A short, vague prompt gets a short, vague answer from any AI assistant. Claude''s particular strength — handling long, detailed input well — means it rewards a bit more structure than you might be used to.

### The four-part structure that works
For anything beyond a quick question, try giving Claude: (1) context — what is this for, and who''s it for; (2) the material itself — the document, data, or background Claude needs; (3) the specific task — what you actually want done, stated precisely; (4) the format — how you want the answer shaped (a table, a short memo, bullet points, a specific length).

For example, instead of "review this proposal," try: "I''m sending this proposal to a cautious client who''s pushed back on cost before [context]. Here''s the proposal: [material]. Identify the three places a cost-sensitive reader is most likely to object, and suggest a one-line rebuttal for each [task]. Keep it to a short bulleted list I can glance at before the call [format]."

### Why this matters more with Claude specifically
Because Claude can hold a lot of context at once, it''s tempting to just paste in everything and hope. That works better than with shorter-context tools, but it still produces a noticeably weaker answer than giving Claude the same material plus a clear, specific task. The context window removes a technical limit — it doesn''t remove the value of being precise about what you actually want.

### A habit worth building
When a Claude response feels generic, the fix is almost always to go back and add one of the four parts you skipped — usually context or format. Treat a disappointing answer as a prompt-structure problem to debug, not a reason to give up on the tool.',
  objectives = array[
    'Apply a four-part structure (context, material, task, format) to a long prompt.',
    'Explain why Claude''s large context window rewards precision rather than replacing the need for it.',
    'Diagnose a generic Claude response as a missing prompt element, and fix it.'
  ],
  key_points = array[
    'A long prompt works best with four parts: context, material, specific task, and desired format.',
    'A large context window means you can include more material — it doesn''t mean vague requests work better.',
    'A generic answer is usually a sign one of the four parts (often context or format) was left out.'
  ],
  practice_task = 'Take a request you''d normally phrase in one vague sentence (e.g. "review this" or "help me with this email"). Rewrite it using the four-part structure: context, material, specific task, format. Run both versions through Claude and compare the two answers.'
from public.courses c
where l.course_id = c.course_id and c.slug = 'claude-for-professionals' and l.lesson_number = 4;

-- Module 2, Lesson 5 — Deep Document Analysis
update public.lessons l set
  description = 'The single most common professional use of Claude: being handed a long document and asked real, specific questions about it. This lesson covers how to do that well.',
  body = 'Document analysis is where Claude''s large context window stops being a technical spec and starts being a genuine time-saver — but only if you ask the right kind of questions.

### Go beyond "summarize"
A summary is the easiest thing to ask for and often the least useful. Once Claude has the document, push further: "What are the unstated assumptions behind this argument?" "Where does this report contradict itself?" "If I were a lawyer looking for risk, what would I flag?" "Compare the Q2 and Q3 sections — what changed, and does the document explain why?" These questions get you to insight, not just compression.

### Ask Claude to quote, not just paraphrase
For anything you''ll rely on, ask Claude to quote the exact passage supporting a claim it makes about the document — "quote the specific sentence that supports this" — rather than accepting a paraphrase. This gives you something checkable, and it''s a habit that catches the rare case where Claude has slightly misread the material.

### Working with multiple documents
If you''re comparing several documents — two vendor proposals, a policy before and after revision — upload them together and ask Claude to analyze them against each other directly, rather than summarizing each one separately and comparing the summaries yourself. Claude holding both documents in the same context is exactly the scenario the large context window is built for.

### The verification habit that matters most here
Document analysis is also where the "fluent but wrong" risk from earlier in this course is most live — a confidently-stated claim about a 60-page document is harder to spot-check than a claim about something short. Spend thirty seconds verifying anything that will inform a real decision, especially numbers, dates, and anything quoted as fact rather than clearly marked as Claude''s own interpretation.',
  objectives = array[
    'Ask analytical questions of a document that go beyond a basic summary.',
    'Request quoted evidence for claims Claude makes about a document, not just paraphrase.',
    'Analyze multiple documents against each other in a single conversation rather than comparing separate summaries.'
  ],
  key_points = array[
    'A plain summary is the least valuable thing to ask for — push toward assumptions, contradictions, and comparisons instead.',
    'Asking Claude to quote the supporting passage makes its claims checkable.',
    'Upload related documents together so Claude can compare them directly.',
    'Verify anything that will inform a real decision — the stakes of being wrong are higher with long documents, not lower.'
  ],
  practice_task = 'Take a real document you need to actually understand (a report, a proposal, a policy). Ask Claude three questions that go beyond summarizing: one about an assumption or weakness, one asking it to quote evidence for a specific claim, and one comparing two sections or parts of the document.'
from public.courses c
where l.course_id = c.course_id and c.slug = 'claude-for-professionals' and l.lesson_number = 5;

-- Module 2, Lesson 6 — Complex Research Tasks
update public.lessons l set
  description = 'Using Claude for research that pulls together multiple sources or angles, without losing track of what''s actually verified.',
  body = 'Research tasks tend to go wrong in a specific way: you ask a broad question, get a fluent and plausible-sounding answer, and it''s only later — if ever — that you discover a key claim was slightly off. This lesson is about avoiding that.

### Break a broad research question into sub-questions
Instead of "tell me about the market for X," decompose it yourself first: who are the main players, what''s the recent trend, what are the two or three competing viewpoints on where this is headed, what would change your mind about each. Feed Claude the sub-questions one at a time, or clearly labeled together. You''ll get sharper, more checkable answers than from one broad request.

### Ask Claude to flag its own confidence
You can directly ask: "which of these claims are you confident about, and which are you less sure of or reconstructing from general knowledge rather than a specific source?" Claude will generally answer this honestly when asked directly, even though it won''t always volunteer the distinction unprompted. Make a habit of asking.

### Separate synthesis from fact-checking
Let Claude do what it''s genuinely good at — synthesizing a coherent view across a complex topic, structuring an argument, surfacing a pattern you might have missed — and treat specific, checkable facts (dates, figures, named sources, direct quotes) as things you verify independently before they go in front of a client, your manager, or the public. This division of labor is the core of using AI well for research: Claude for structure and synthesis, you for the facts that matter.

### Document availability depends on your workspace
Whether Claude can browse the live web, and what external sources it can check in real time, depends on your specific plan and workspace configuration. Don''t assume — check what''s actually available to you, and treat anything without a visible source as Claude''s own synthesis rather than a verified citation.',
  objectives = array[
    'Decompose a broad research question into specific sub-questions before asking Claude.',
    'Ask Claude directly to flag which claims it''s confident about versus reconstructing from general knowledge.',
    'Separate the parts of research Claude handles well (synthesis, structure) from the parts that need independent verification (specific facts).'
  ],
  key_points = array[
    'A broad research question decomposed into sub-questions gets sharper, more checkable answers.',
    'Asking Claude directly about its own confidence level usually gets an honest answer.',
    'Use Claude for synthesis and structure; verify specific facts, figures, and quotes independently.',
    'Real-time web access varies by plan and workspace — don''t assume it''s available.'
  ],
  practice_task = 'Pick a research question relevant to your work. Write three specific sub-questions instead of one broad one. Ask Claude all three, then ask a follow-up: "which parts of your answer are you most and least confident about?"'
from public.courses c
where l.course_id = c.course_id and c.slug = 'claude-for-professionals' and l.lesson_number = 6;

-- Module 2, Lesson 7 — Writing with Nuance
update public.lessons l set
  description = 'Getting Claude to produce writing that sounds considered and specific to your situation, instead of generic AI-flavored prose.',
  body = 'The most common complaint about AI-assisted writing is that it sounds like AI wrote it — generic, over-hedged, oddly cheerful. This is almost always fixable, and it''s rarely about the tool.

### Give Claude your actual voice, not just a topic
Paste in a few paragraphs you''ve written yourself and ask Claude to match that voice, rather than starting from a blank instruction like "write a professional email." The difference between "write a follow-up email" and "write a follow-up email in the voice of these three examples I''ve pasted in" is enormous.

### Name what you don''t want, not just what you do
"Make it sound confident but not arrogant, direct but not blunt" is more useful than "make it sound good" — Claude can act on specific, even contrasting, constraints far better than vague positive instructions. If generic AI writing has a particular tic that bothers you (excessive hedging, too many exclamation points, a certain stock phrase), say so explicitly and ask Claude to avoid it.

### Iterate instead of accepting the first draft
Treat the first response as a draft, not a final answer. "Cut this by a third," "that opening line is too formal, try three alternatives," "this paragraph buries the actual ask — move it up" — this kind of specific, iterative feedback is where writing quality actually comes from, with Claude or with a human editor.

### Where nuance matters most
Nuance matters most in exactly the situations where generic writing does the most damage: a difficult message to a client, a piece of feedback to a direct report, anything where tone carries as much meaning as content. These are worth the extra round of iteration — and worth reading over yourself before sending, the same way you would a human-drafted message.',
  objectives = array[
    'Provide Claude with examples of your own writing voice rather than a bare topic instruction.',
    'Give specific, even contrasting, tone constraints rather than vague positive instructions.',
    'Iterate on a first draft with specific feedback rather than accepting or rejecting it wholesale.'
  ],
  key_points = array[
    'Pasting in examples of your own voice produces far better results than a topic alone.',
    'Specific, even contrasting constraints ("confident but not arrogant") work better than vague ones ("sound good").',
    'Treat the first response as a draft and iterate with specific feedback.',
    'High-stakes, tone-sensitive writing deserves extra iteration and a final human read-through.'
  ],
  practice_task = 'Paste two or three paragraphs you''ve written yourself into Claude and ask it to draft something new (an email, a short memo) in that same voice. Then give it one specific piece of iterative feedback on the result, the way you would to a colleague.'
from public.courses c
where l.course_id = c.course_id and c.slug = 'claude-for-professionals' and l.lesson_number = 7;

-- Module 3, Lesson 8 — Multi-Step Reasoning
update public.lessons l set
  description = 'Using Claude for problems too large or interdependent for a single prompt, by breaking them into a reasoned sequence of steps.',
  body = 'Some problems don''t fit in a single question-and-answer exchange — they have interdependent parts, where the right approach to step two depends on how step one turns out. This lesson is about handling those well.

### Ask Claude to plan before it executes
For a genuinely complex task, start with: "before you do this, lay out the steps you''d take and why, and check with me before proceeding." This surfaces Claude''s plan for review — you can catch a wrong assumption or a missing step before any work is actually done, rather than after.

### Work through the plan step by step, not all at once
Once you''ve agreed on a plan, work through it one piece at a time rather than asking Claude to do everything in one shot. This keeps each step checkable, lets you redirect if something looks off, and tends to produce a noticeably more reliable result than one enormous request — the same way a human would rather tackle a complex project in reviewed stages than all at once blind.

### Ask Claude to show its reasoning on judgment calls
Where a step involves a genuine judgment call — which option to recommend, how to weigh competing priorities — ask Claude to show its reasoning, not just its conclusion: "walk through how you''d weigh these three factors before giving a recommendation." This makes the reasoning auditable, and it often surfaces a consideration you hadn''t thought of, or reveals where Claude is making an assumption you''d actually disagree with.

### Recognize when to step back in yourself
Multi-step reasoning with Claude works best as a genuine collaboration — you set the direction and catch problems at each checkpoint, Claude does the heavy lifting of working through each step. The moment you notice you''re rubber-stamping each step without really reading it, that''s the signal to slow down and re-engage.',
  objectives = array[
    'Ask Claude to propose a plan before executing a complex, multi-part task.',
    'Work through a complex task in reviewed stages rather than one large request.',
    'Request visible reasoning on judgment calls, not just a conclusion.'
  ],
  key_points = array[
    'Asking Claude to plan first, before executing, surfaces problems early and keeps you in control.',
    'Working through a complex task step by step produces more reliable results than one large request.',
    'Asking Claude to show its reasoning on judgment calls makes its recommendations auditable.',
    'If you notice you''re rubber-stamping steps without reading them, slow down and re-engage.'
  ],
  practice_task = 'Pick a multi-part task from your own work (planning an event, structuring a report, evaluating options). Ask Claude to propose a step-by-step plan first and wait for your go-ahead before starting. Review the plan critically before approving it.'
from public.courses c
where l.course_id = c.course_id and c.slug = 'claude-for-professionals' and l.lesson_number = 8;

-- Module 3, Lesson 9 — Code and Data Tasks
update public.lessons l set
  description = 'Using Claude for code and data work — from a quick spreadsheet formula to a small script — with the right amount of verification for a non-developer audience.',
  body = 'You don''t need to be a programmer to get real value from Claude on code and data tasks — but the verification habit matters more here than almost anywhere else, because a wrong formula or script can fail silently.

### Spreadsheet formulas and simple scripts
Claude is genuinely strong at writing a spreadsheet formula from a plain-language description ("I need a formula that flags any row where the date is more than 30 days old and the status isn''t ''closed''"), or a short script to do something repetitive — renaming a batch of files, reformatting a CSV, pulling specific data out of a messy export. Describe the task and the shape of your data clearly, and ask Claude to explain what the formula or script does in plain language alongside the code itself.

### Always test on a copy first
Before running any Claude-generated formula or script on real data, test it on a small copy or sample. This is non-negotiable, not optional caution — a formula that looks right can have an off-by-one error or an edge case that only shows up on data slightly different from what you tested. The cost of testing first is minutes; the cost of a silent data error is often much higher.

### Ask Claude to explain, not just produce
For anything you''ll reuse or hand to someone else, ask Claude to explain each part of the formula or script in plain language, not just hand you the code. This serves two purposes: it''s a second check (does the explanation actually match what the code does?), and it means you can maintain or adapt it yourself later without starting from scratch.

### Know where your own judgment still has to apply
Claude can write correct code for a well-specified task, but it can''t know your organization''s specific data quirks, naming conventions, or the one weird exception that always trips up automated processing. Mention those explicitly, and double-check output against a case you already know the right answer to.',
  objectives = array[
    'Describe a code or spreadsheet task clearly enough for Claude to produce a correct first attempt.',
    'Test any Claude-generated formula or script on a small sample before using it on real data.',
    'Ask Claude to explain generated code in plain language as both a check and a learning aid.'
  ],
  key_points = array[
    'Claude can write spreadsheet formulas and simple scripts from plain-language descriptions.',
    'Always test on a small copy or sample before running on real data — this is not optional.',
    'Asking for a plain-language explanation alongside code is a useful second check.',
    'Mention your organization''s specific data quirks explicitly — Claude can''t know them unprompted.'
  ],
  practice_task = 'Think of a repetitive spreadsheet or data task you do manually. Describe it to Claude in plain language and ask for a formula or short script, plus a plain-language explanation of how it works. Test it on a small sample of your real data before trusting the result.'
from public.courses c
where l.course_id = c.course_id and c.slug = 'claude-for-professionals' and l.lesson_number = 9;

-- Module 3, Lesson 10 — Ethical AI Use at Work
update public.lessons l set
  description = 'The practical ethical considerations of using Claude regularly at work — data sensitivity, disclosure, and where human judgment has to stay central.',
  body = 'Using AI well at work isn''t only a skills question — it''s also a judgment question, and most of the real issues are practical rather than abstract.

### Be deliberate about what you share
Before pasting something into any AI conversation, ask: would I be comfortable with this leaving my organization''s systems? Client-confidential information, personal data about colleagues or customers, and anything covered by a specific confidentiality agreement deserve real caution — check your organization''s actual policy on AI tools rather than assuming, since this varies widely by employer and by the specific data-handling terms of whatever plan or workspace you''re using.

### Disclosure is often simpler than it feels
Many workplaces are still developing norms around disclosing AI use, which can make it feel awkward. A reasonable default: be straightforwardly honest if asked, and lean toward disclosure for anything where the AI did substantive work — drafting, analysis, a first pass — rather than treating AI assistance as something to hide. Passing off AI-generated work as entirely your own, without having reviewed and taken ownership of it, is the kind of shortcut that tends to backfire.

### Keep human judgment where it belongs
Claude can draft a difficult message, analyze a tricky situation, or lay out options — but a decision that affects someone''s job, a judgment call with real consequences for a person, or anything requiring accountability you can''t delegate, should stay a human decision that you''ve made, informed by Claude''s input rather than handed to it. Use Claude to think something through more thoroughly, not to avoid being the one who decided.

### A simple test
Before relying on AI-assisted output for something important, ask: have I reviewed this closely enough that I''d be comfortable defending it as my own judgment? If the honest answer is no, that''s the signal to slow down, not a reason to avoid AI tools altogether.',
  objectives = array[
    'Apply a simple before-you-share test for data sensitivity when using Claude.',
    'Describe a reasonable default approach to disclosing AI assistance at work.',
    'Identify the kinds of decisions that should stay human, even when Claude helped think them through.'
  ],
  key_points = array[
    'Check your organization''s actual AI-use policy before sharing sensitive or confidential information.',
    'Lean toward disclosing substantive AI assistance rather than hiding it.',
    'Decisions with real consequences for a person should remain human decisions, informed by AI input.',
    'A simple test: would you be comfortable defending AI-assisted output as your own reviewed judgment?'
  ],
  practice_task = 'Think of one recurring task where you use (or could use) Claude. Write one sentence on what you would and wouldn''t share with it for that task, and one sentence on how you''d disclose the AI assistance if asked.'
from public.courses c
where l.course_id = c.course_id and c.slug = 'claude-for-professionals' and l.lesson_number = 10;

-- Module 4, Lesson 11 — Claude in Your Workflow
update public.lessons l set
  description = 'Moving from occasional use to a real, repeatable part of your working week — identifying the recurring tasks where Claude genuinely earns its place.',
  body = 'The gap between "I''ve tried Claude a few times" and "Claude is part of how I actually work" usually comes down to one thing: finding the two or three recurring tasks where it makes a real, repeatable difference, rather than reaching for it randomly.

### Look for recurring, not one-off, tasks
The best candidates for a real workflow habit are things you do regularly — a weekly status report, a recurring type of client email, a monthly data cleanup, meeting notes you turn into action items every week. A one-off task might be worth a single conversation; a recurring task is worth building an actual repeatable process around, including a saved prompt template or a Project set up specifically for it.

### Build a short list, honestly
Go through a typical week and note where you spend time on something that''s mostly mechanical, or that follows a similar pattern each time. Not everything belongs on this list — anything requiring judgment specific to each individual situation is a weaker candidate than something with a repeatable shape. Aim for two or three strong candidates rather than trying to automate everything at once.

### Start with the task that has the clearest "before and after"
Pick the task where you can most clearly describe what manual work looked like and what the Claude-assisted version looks like. Getting one workflow genuinely working — not just tried once, but actually used for several weeks — teaches you more about integrating AI into real work than trying five things superficially.

### This sets up the rest of the module
The next lesson is about actually building one of these into a small, repeatable process. Come into it with your two or three candidate tasks already identified.',
  objectives = array[
    'Identify two or three recurring tasks in your own role as strong candidates for Claude integration.',
    'Distinguish recurring, pattern-shaped tasks from one-off tasks requiring fresh judgment each time.',
    'Select one candidate task with the clearest before-and-after to build into a real workflow.'
  ],
  key_points = array[
    'Recurring tasks with a repeatable shape are better candidates for a real workflow habit than one-off tasks.',
    'Build a short, honest list of two or three candidates rather than trying to automate everything.',
    'Start with the task where the before-and-after is clearest.',
    'Using one workflow genuinely, for weeks, teaches more than trying several superficially.'
  ],
  practice_task = 'Go through a typical week of your work and list every task that follows a similar, repeatable pattern. Narrow it to your top two or three candidates for building a real Claude-assisted workflow, and pick the one with the clearest before-and-after to focus on next.'
from public.courses c
where l.course_id = c.course_id and c.slug = 'claude-for-professionals' and l.lesson_number = 11;

-- Module 4, Lesson 12 — Building AI-Augmented Processes
update public.lessons l set
  description = 'Turning the one task you picked in the last lesson into an actual small process — a saved prompt, a Project, and a repeatable sequence of steps.',
  body = 'This lesson is hands-on: take the task you identified in the last lesson and actually build it into a small, repeatable process this week.

### Write the prompt once, properly, and save it
Using the four-part structure from Module 1 (context, material, task, format), write a prompt template for your chosen task — one you can reuse with only the specific details changing each time. Save it somewhere you''ll actually find it again: a Project''s custom instructions if you have one set up, a note, a document you keep open. A good reusable prompt, built once carefully, saves far more time over a month than ten quick improvised ones.

### Set up a Project if the task is recurring and has stable context
If your task involves the same kind of background material each time — the same report template, the same client context, the same style guide — a Project is worth the ten minutes it takes to set up. You''ll stop re-explaining the same context every single time, which is where a surprising amount of wasted time in ad-hoc AI use actually comes from.

### Define your own review step
Decide, explicitly, what you''ll check before using Claude''s output for this specific task — is it the numbers, the tone, a specific factual claim, all of it? Build that check into the process itself, not as an afterthought. A process without a defined review step is how small errors eventually become real problems.

### Run it for real, this week
Don''t just design this process — use it on the actual next occurrence of this task before the course ends. A workflow you''ve built but never run isn''t actually a workflow yet.',
  objectives = array[
    'Write a reusable prompt template using the four-part structure for a chosen recurring task.',
    'Set up a Project for tasks with stable, recurring background context, where available.',
    'Define an explicit review step as part of the process, not an afterthought.'
  ],
  key_points = array[
    'A carefully written, reusable prompt template saves more time over a month than many quick improvised ones.',
    'A Project is worth setting up for tasks with the same recurring background context.',
    'An explicit review step, defined up front, is what keeps a process reliable.',
    'Run the new process on a real occurrence of the task before considering it built.'
  ],
  practice_task = 'Build the process: write and save a reusable prompt template for your chosen task, set up a Project if it fits, define exactly what you''ll check in the output, and run it on the next real occurrence of that task this week.'
from public.courses c
where l.course_id = c.course_id and c.slug = 'claude-for-professionals' and l.lesson_number = 12;

-- Module 4, Lesson 13 — Your Claude Toolkit
update public.lessons l set
  description = 'A short closing lesson that pulls the course together into a personal reference, and points toward where to go next.',
  body = 'You started this course deciding whether Claude was worth learning deliberately rather than using casually. By now you''ve had a real first conversation, analyzed a real document, written with your own voice, reasoned through a multi-step problem, and built one actual recurring process. That''s the foundation — the rest is practice.

### Your personal reference, in one place
Keep these close at hand: the four-part prompt structure (context, material, task, format) from Module 1; the habit of asking Claude to quote evidence rather than accepting paraphrase, from document analysis; the habit of asking for a plan before execution, from multi-step reasoning; and the before-you-share test for sensitive data, from the ethics lesson. These four habits cover most of what separates confident, reliable Claude use from occasional, disappointing use.

### What tends to happen next
Most people who get this far naturally start noticing more places Claude could help — and that''s the right instinct, as long as you keep applying the same verification habits to new situations rather than assuming familiarity means it''s safe to skip them. A new kind of task deserves the same care you gave your first one.

### If you work with code, data pipelines, or want to build something
This course focused on Claude.ai for everyday professional work. If your role involves writing software, working with APIs, or building tools that use Claude programmatically, that''s a different (and genuinely interesting) set of skills — covered in Barada Academy''s companion course for developers, where available in the catalogue.

### Last word
The single habit worth carrying forward above all others: treat Claude as a capable collaborator whose work you review, not an oracle whose answers you accept. Everything else in this course was really in service of that one idea.',
  objectives = array[
    'Recall the four core habits built across the course as a quick personal reference.',
    'Apply the same verification habits to new tasks as Claude use becomes more routine.',
    'Identify where to go next, depending on whether your work involves building with Claude programmatically.'
  ],
  key_points = array[
    'The four core habits: structured prompts, asking for quoted evidence, asking for a plan before execution, and the before-you-share test.',
    'New tasks deserve the same verification care as your first ones, not less.',
    'Developers and technical builders have a separate path into working with Claude programmatically.',
    'The core idea underlying the whole course: a capable collaborator to review, not an oracle to accept.'
  ],
  practice_task = 'Write your own one-page "Claude toolkit": your four-part prompt template, the two or three recurring tasks you''ve now built workflows for, and one thing you want to try next. Keep it somewhere you''ll actually look at again.'
from public.courses c
where l.course_id = c.course_id and c.slug = 'claude-for-professionals' and l.lesson_number = 13;
