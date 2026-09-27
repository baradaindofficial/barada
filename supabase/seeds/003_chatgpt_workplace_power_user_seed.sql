-- ============================================================
-- Seed: ChatGPT: From Beginner to Workplace Power User
-- CTO-approved content build
-- Generated: 2026-09-27
--
-- Course, modules, lessons, assessment, and all 20 evaluation
-- questions are inserted as status = 'draft' (courses/modules/
-- lessons/assessment) or 'draft' where applicable, generation_mode
-- = 'hybrid'. Nothing here is published. This is a wholly new,
-- additive course row (slug 'chatgpt-workplace-power-user') and
-- does not modify any existing course, module, lesson, assessment,
-- payment, certificate, authentication, or learner-identity data.
--
-- assessments.questions_per_attempt = 5 activates server-side
-- random 5-of-20 sampling per attempt (migration 011).
-- ============================================================

do $$
declare
  v_domain_id     uuid;
  v_course_id     uuid;
  v_module_id     uuid;
  v_assessment_id uuid;
  v_question_id   uuid;
begin

  select domain_id into v_domain_id
    from public.domains where slug = 'ai-tools' and app_id = 'academy';

  insert into public.courses
    (slug, title, subtitle, description, category, difficulty, icon, theme_color,
     cert_price_paise, is_free, sort_order, status, visibility,
     domain_id, outcomes, target_audience, prerequisites, skills_covered,
     estimated_hours, generation_mode)
  values (
    'chatgpt-workplace-power-user',
    'ChatGPT: From Beginner to Workplace Power User',
    'A structured, hands-on course from first prompt to confident everyday professional use',
    'A 10-module, 40-lesson course that takes a working professional from a first ChatGPT prompt to confident, reliable, everyday workplace use -- covering prompt engineering, professional writing, learning workflows, document and data analysis, research verification, and responsible AI use, capped by a hands-on personal-workflow capstone.',
    'AI Tools', 'Beginner', '🚀', '#1A7F56',
    29900, true, 11, 'draft', 'public',
    v_domain_id,
    array['Write clear, well-structured prompts that reliably get useful results','Apply core prompt engineering techniques: zero-shot, few-shot, role and structured prompting','Use ChatGPT for everyday professional writing, summarizing, and communication tasks','Build multi-step, decomposed workflows for larger or ambiguous tasks','Analyze uploaded documents, spreadsheets, and images with appropriate verification','Apply a calibrated-trust approach to research and fact-checking with AI assistance','Recognize where AI assistance fits a professional workflow and where human judgment must stay central','Apply responsible AI use practices, including organizational and data-sensitivity considerations'],
    array['Working professionals new to ChatGPT','Team members who want to move from casual use to reliable, everyday workplace use','Anyone who wants a structured, practical grounding rather than scattered tips'],
    array['No prior AI experience required','Basic familiarity with everyday office software'],
    array['Prompt engineering','Professional writing with AI','Task decomposition','Document and data analysis','AI-assisted research and verification','Responsible AI use'],
    10.0, 'hybrid'
  ) returning course_id into v_course_id;

  -- ---- Module 1: Understanding ChatGPT ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (v_course_id, 1, 'Understanding ChatGPT', 'What ChatGPT is, how to think about it as a tool, and where its real value and real limits lie.', array['Explain, in plain language, what ChatGPT is and what kind of system produces its answers.','Describe ChatGPT''s capabilities and limits without over- or under-estimating either.','List the core categories of tasks ChatGPT handles well for a typical professional.'], 'draft', 'hybrid')
  returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'What Is ChatGPT?',
    'ChatGPT is a conversational AI assistant built by OpenAI. You type a message, it responds in natural language, and the conversation continues — more like messaging a very well-read colleague than searching a database. This lesson builds the mental model you''ll use for the rest of the course.',
    'ChatGPT is powered by a type of AI model called a large language model (LLM). In simple terms, it has been
trained on enormous amounts of text and learned the statistical patterns of how language is used — which words,
ideas and structures tend to follow which others. When you send it a message, it generates a response one piece
at a time, predicting what would plausibly come next given everything in the conversation so far.

That''s a different mechanism from a search engine. A search engine finds and ranks existing pages that already
contain an answer. ChatGPT generates responses from the model itself and whatever context is available to it in the
conversation — and, depending on the feature and configuration in use, that context can also include uploaded files,
project context, web results, connected sources and other tools (several of these are covered later in this course).
This distinction matters because it explains both ChatGPT''s biggest strength — flexible, tailored, conversational
output — and its biggest limitation: it can generate fluent, confident-sounding text that is nonetheless wrong.

### Where this shows up at work
People use ChatGPT for drafting and rewriting text, summarising documents, brainstorming, explaining unfamiliar
concepts, working through spreadsheets and data, planning projects, and — depending on your plan, region or
workspace — generating images, browsing the web, or working with uploaded files directly in the conversation.
You''ll build hands-on skill with most of these over the course.

### A simple way to think about it
Treat ChatGPT less like a calculator (which is always right within its domain) and more like a very fast, very
well-read junior colleague: broadly knowledgeable, quick, and tireless, but someone whose work you still review
before it goes out the door. That habit of reviewing is the single most important skill this course teaches.',
    array['Explain, in plain language, what ChatGPT is and what kind of system produces its answers.','Describe the difference between a conversation with ChatGPT and a web search.','Identify the everyday tasks ChatGPT is commonly used for in a workplace.'],
    array['ChatGPT generates language by predicting likely next words, based on patterns learned from large amounts of text.','It is not a search engine: it composes a response from the model and whatever context is available to it, which — depending on the feature and configuration — can include files, project context, web results, connected sources and other tools.','Its output can be fluent and confident while still being wrong — review, don''t assume.','Feature availability (web search, image generation, file uploads and more) can vary by plan, region or workspace.'],
    'Open ChatGPT and ask it two things: first, "What are you good at, and what should I be careful about when I use you?" Then ask it a question about something you already know well. Compare its answer against your own knowledge and note one thing it got right and one thing it oversimplified or missed.',
    true, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'How to Think About AI Assistants',
    'New tools attract two opposite reactions: blind trust and blanket dismissal. Neither serves you well with ChatGPT. This lesson gives you a working mental model — closer to "capable but unverified assistant" than either "oracle" or "toy".',
    'It helps to separate what ChatGPT is reliably good at from what it merely sounds good at.

It is reliably strong at: rephrasing and restructuring text, explaining concepts in different ways until one clicks,
generating first drafts and options quickly, spotting structural issues in your own writing, and doing rote,
mechanical transformations of text or data you give it directly.

It is unreliable at: precise facts it wasn''t given directly (dates, statistics, quotes, obscure specifics), anything
requiring true real-world judgement about consequences it cannot observe, and — without a verification step — telling
you when it doesn''t actually know something. A model that isn''t sure will often still produce a fluent-sounding
answer rather than a clear "I don''t know."

### A three-question checklist
Before you rely on an AI-generated answer for something that matters, ask yourself: (1) Did I give it all the facts
it needed, or is it filling gaps with a guess? (2) Is this the kind of claim it could plausibly get wrong with total
confidence — a date, a number, a quote, a policy detail? (3) What''s the cost if it''s wrong, and have I checked
accordingly? For a first-draft email, the cost of an error is low and a quick read-through is enough. For a client
proposal with numbers in it, the cost is high and every figure needs an independent check.

This isn''t about distrust for its own sake — it''s about calibrating your trust to the stakes, the same way you would
with information from a colleague you don''t yet know well.',
    array['Describe ChatGPT''s capabilities and limits without over- or under-estimating either.','Explain why treating ChatGPT as infallible or as useless are both mistakes.','Apply a simple mental checklist before trusting AI output for a work task.'],
    array['ChatGPT is strong at language tasks: drafting, rephrasing, explaining, structuring.','It is weak at precise, unverified facts and can state them with unwarranted confidence.','Match your verification effort to the real-world cost of being wrong.','Calibrated trust, not blind trust or blanket dismissal, is the professional habit this course builds.'],
    'Think of a real task you did this week. Write one sentence on what you would have trusted ChatGPT to do unsupervised, and one sentence on what you would still have checked yourself, and why.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'What ChatGPT Can Do',
    'This lesson is a practical tour of what''s actually on offer — the categories of work you''ll build real skill in across the rest of this course.',
    'Across a typical working week, people use ChatGPT for a recurring set of tasks:

- Drafting and rewriting: emails, messages, reports, proposals, social posts, and turning rough notes into a
  polished document.
- Explaining and teaching: breaking down an unfamiliar concept, a legal clause, or a technical term into plain
  language at whatever depth you need.
- Analysing and summarising: condensing a long document, pulling out key points from meeting notes, or comparing
  two options side by side.
- Brainstorming and structuring: generating a first list of ideas, an outline, or a framework to organise your own
  thinking, which you then edit and refine.
- Working with files and data: where available on your plan, uploading documents, spreadsheets or images directly
  into the conversation for ChatGPT to read, analyse or transform (covered in depth in Module 8).
- Finding current information: where available, using built-in web search or Deep Research to pull in and cite
  up-to-date sources rather than relying only on its training (covered in Module 9).

### What "workplace power user" means
It doesn''t mean using every feature. It means knowing which of these categories map onto your actual work, building
a reliable prompting habit for each one, and knowing when to stop trusting the output and start checking it
yourself. That''s the specific skill this course is built to teach.',
    array['List the core categories of tasks ChatGPT handles well for a typical professional.','Recognise which of these categories are most relevant to your own role.'],
    array['Drafting, explaining, analysing, brainstorming, file/data work and current-information lookup are the core categories.','Not every feature is relevant to every role — the skill is knowing which ones matter for your work.','File uploads, web search and Deep Research availability can vary by plan, region or workspace.'],
    'From the six categories above, pick the two most relevant to your current role. For each, write down one specific task from the last month where that category would have saved you real time.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'What ChatGPT Cannot Guarantee',
    'This is the lesson that makes everything else in the course safe to use. Understanding ChatGPT''s real limits isn''t a caveat bolted onto the training — it''s the foundation the rest of the course is built on.',
    'ChatGPT cannot guarantee factual accuracy — full stop. That includes when it is drawing only on its own
training, and it still includes when it is using available context, uploaded files, web results, connected sources,
or other tools: any of those inputs can be incomplete, outdated, or misread, and the model can still generate a
plausible-sounding but incorrect statement — a fabricated citation, an invented statistic, a wrong date stated with
total confidence — commonly called a "hallucination." This happens because the model is built to produce fluent,
statistically likely text; using a tool such as web search, a file, or a connected source changes what the model has
in front of it, but it does not turn the answer into a guarantee — it only changes where an error could enter.

### What this means in practice
Fluency is not the same as accuracy. A confidently written paragraph with the wrong figures reads exactly like a
confidently written paragraph with the right ones — there is no built-in "uncertainty tone" you can listen for, and
that stays true whether or not a tool was used to help produce the answer. This is precisely why Module 9 of this
course is dedicated to verification, and why the responsible-use guidance throughout this course keeps returning to
the same point: verification should be proportional to the stakes — a quick internal note needs a lighter check than
a figure that will go into a report, a client deliverable, or a decision, but nothing is exempt from checking
entirely just because a tool assisted in producing it.

ChatGPT also cannot guarantee that it understands your organisation''s specific context, unwritten conventions, or
the real-world consequences of a decision the way a human colleague with that context would. It has no memory of
your company''s history unless you''ve told it, or — where available — you''ve built that context into a Project or
Custom GPT (Module 10).

None of this makes ChatGPT less useful. It means the professional skill isn''t "trust ChatGPT" or "don''t trust
ChatGPT" — it''s knowing which parts of its output need your judgement and which don''t, every single time.',
    array['Identify the categories of output ChatGPT cannot be relied on to get right without verification.','Explain what a hallucination is and why it happens.','Describe why fluent output is not the same as verified output.'],
    array['A hallucination is fluent, confident-sounding output that is factually wrong.','Fluency and accuracy are independent — you cannot detect an error by tone alone, whether or not a tool assisted the answer.','Accuracy is never guaranteed, even when ChatGPT is using context, files, web results, connected sources, or other tools — those change what it has to work with, not whether it can be wrong.','ChatGPT has no memory of your organisation''s specific context unless you provide it or build it in.','Verification should be proportional to the stakes — check more where being wrong would cost more.'],
    'Ask ChatGPT a factual question about a niche topic you know well but that''s unlikely to be widely documented (a specific detail about your own organisation, town, or field). Note whether it gives a correct answer, a plausible-sounding wrong answer, or honestly says it isn''t sure.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 2: Getting Better Results ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (v_course_id, 2, 'Getting Better Results', 'The building blocks of a prompt that actually gets you a useful answer.', array['Identify the components that make a prompt effective: objective, context, constraints and format.','Distinguish between a topic and an objective in a prompt.','Identify what background information ChatGPT needs that it cannot infer.'], 'draft', 'hybrid')
  returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Anatomy of a Good Prompt',
    'Most disappointing ChatGPT answers trace back to a vague prompt, not a weak model. This lesson breaks a good prompt into its parts so you can build one deliberately instead of guessing.',
    'A prompt that reliably gets you a useful answer usually contains four things, even if only a sentence or
two each:

- Objective: what you actually want as the end result — not the topic, the outcome. "Summarise this" is a topic.
  "Give me a 5-bullet summary a busy VP can read in 30 seconds" is an objective.
- Context: the background information ChatGPT needs but doesn''t have — who the audience is, what''s already been
  tried, what constraints already exist, what the document or situation actually is.
- Constraints: length, tone, format, things to avoid, deadlines, audience sensitivities — the boundaries the output
  has to respect.
- Format: how you want the answer structured — a table, a numbered list, plain prose, an email with a subject line.

### Weak vs strong, side by side
Weak: "Write about our new product." Strong: "Write a 150-word internal announcement about our new expense-tracking
app, for a general staff audience who haven''t heard of it before, in a friendly but professional tone, ending with
a one-line call to action to try it this week."

The strong version isn''t longer because more words impress ChatGPT — it''s longer because it actually contains the
information a human writer would also need before drafting the same announcement. That''s the real test for any
prompt: would a competent colleague, given only this prompt and nothing else, produce roughly what you want?',
    array['Identify the components that make a prompt effective: objective, context, constraints and format.','Rewrite a vague prompt into a specific one using these components.'],
    array['A strong prompt has an objective, context, constraints and a format.','State the outcome you want, not just the topic.','Test: would a competent colleague produce what you want from this prompt alone?'],
    'Take a task you''d genuinely ask ChatGPT to do this week. Write the lazy one-line version first, then rewrite it with an explicit objective, context, constraints and format. Run both and compare the outputs.',
    true, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Define the Objective',
    'Of the four components from the last lesson, the objective does the most work. This lesson focuses on it alone, because it''s the one people skip most often.',
    '"Write me a project update" is a topic. It tells ChatGPT what the text is about but not what the text is
*for*. Compare it to: "Write a project update for my manager that reassures her the delay is under control, without
minimising it — she needs to trust the new timeline." Same topic, completely different, more useful output, because
now ChatGPT knows the purpose the text has to serve.

### Ask yourself: what happens after they read this?
A useful trick is to think one step past the document itself. Not "what am I writing" but "what do I want the
reader to think, feel, or do after reading it." An email exists to get a reply, a decision, or an action. A report
exists to inform a decision someone else will make. A social post exists to get attention or trust. Once you can
name that downstream effect, fold it into the prompt directly — "so that my manager feels reassured," "so the team
knows exactly what to do next," "so a first-time reader understands without prior context."

This single habit — stating the purpose, not just the subject — fixes more mediocre ChatGPT output than any other
single change you can make to how you prompt.',
    array['Distinguish between a topic and an objective in a prompt.','Write objectives that specify the purpose and audience of the output.'],
    array['A topic says what the text covers; an objective says what it needs to achieve.','Think one step past the document: what should the reader do or feel afterward?','State that purpose explicitly in the prompt — don''t assume ChatGPT can infer it.'],
    'Pick three things you need to write this week (an email, a message, a note). For each, write one sentence answering: "what do I want the reader to think, feel, or do after reading this?" Use that sentence as the objective in your next prompt for each.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Add Context',
    'Context is the information gap between what''s in your head and what''s in the prompt. This lesson is about closing that gap without writing an essay every time.',
    'ChatGPT only knows what''s in the current conversation (plus, where available, anything you''ve added via
Memory or a Project — Module 10) and whatever general knowledge it was trained on. It doesn''t know your company''s
internal shorthand, the history behind a decision, or what "the usual format" means at your organisation, unless
you tell it.

### What to include, briefly
- Who''s involved and their role in this: "this is for my director, who prefers short and blunt."
- What''s already happened: "we already tried X and it didn''t work, so don''t suggest it again."
- Any non-obvious constraint: "we can''t mention pricing yet — it hasn''t been approved."
- The type of document or situation, if it isn''t obvious from your instruction alone.

### The balance to strike
Context should be the minimum ChatGPT needs to avoid a wrong guess — not everything you know about the situation.
A good gut-check: if you handed this prompt, with no other conversation, to a smart new hire on their first day,
would they have enough to do the task correctly? If yes, you''ve probably included enough. If they''d have to guess
at something important, that''s the missing context to add.',
    array['Identify what background information ChatGPT needs that it cannot infer.','Provide context efficiently without over-explaining.'],
    array['ChatGPT only knows what''s in the conversation, plus general training knowledge (and Memory/Projects where available).','Include who''s involved, what''s already been tried, and any non-obvious constraints.','Test: would a smart new hire, given only this prompt, do the task correctly?'],
    'Take a prompt you''ve used before that gave a disappointing result. Identify one piece of context you assumed ChatGPT would know but never actually stated. Add it and re-run the prompt.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Constraints and Output Format',
    'Even a well-aimed prompt can come back in the wrong shape — too long, too casual, or as prose when you needed a table. This lesson closes that gap.',
    'Constraints tell ChatGPT the boundaries the output must respect. The most common ones professionals use:

- Length: "under 100 words," "one page," "three bullet points."
- Tone: "formal," "warm but professional," "direct, no fluff."
- What to avoid: "no jargon," "don''t mention the budget," "avoid exclamation marks."
- Audience level: "assume no technical background," "written for a board of directors."

Format is a specific, powerful type of constraint: telling ChatGPT exactly how to structure the response. "Give me
this as a table with columns for Option, Pros, Cons, and Recommendation" produces something immediately usable. A
wall of prose covering the same information takes far longer to extract value from.

### Why this matters more than it seems
Two prompts with identical content but different format instructions can save or cost you fifteen minutes of
reformatting. Getting into the habit of specifying format up front — table, numbered steps, email with subject
line, short paragraphs versus bullets — is one of the highest-leverage, lowest-effort habits in this course.',
    array['Specify length, tone and structural constraints explicitly in a prompt.','Request a specific output format and understand why it improves usability.'],
    array['Constraints (length, tone, what to avoid, audience level) shape the output to fit its real use.','Format instructions (table, list, email) are a high-leverage, low-effort way to save editing time.','Specify format up front rather than reformatting the answer yourself afterward.'],
    'Ask ChatGPT to compare three options for something you''re actually deciding (a tool, a vendor, an approach) with no format instruction. Then ask the same question again, this time specifying a table with named columns. Compare how usable each response is.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 3: Prompt Engineering Fundamentals ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (v_course_id, 3, 'Prompt Engineering Fundamentals', 'Core prompting techniques — zero-shot, few-shot, roles and structure — that professionals use every day.', array['Define zero-shot prompting and identify when it''s sufficient.','Define few-shot prompting and explain why examples improve consistency.','Explain how assigning a role or perspective changes ChatGPT''s output.'], 'draft', 'hybrid')
  returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Zero-Shot Prompting',
    'Zero-shot prompting means asking for something directly, with no examples of the desired output included. It''s the default mode most people already use — this lesson makes it deliberate.',
    '"Zero-shot" simply means you give ChatGPT an instruction and no worked examples of what a correct answer
looks like — you rely on the instruction alone, combined with the model''s general training. Everything in Module 2
(objective, context, constraints, format) is really "how to do zero-shot prompting well."

### When zero-shot is enough
Zero-shot works well for common, well-understood tasks: drafting a standard email, summarising a document,
explaining a concept, brainstorming a list. The task is common enough that "write a polite follow-up email
requesting a status update" doesn''t need an example — ChatGPT has seen countless follow-up emails in training and
can produce a reasonable one from the instruction alone.

### When it starts to break down
Zero-shot struggles when your desired output has a specific, non-obvious shape: a particular report format your
company always uses, an unusual tone, a very specific structure that isn''t the "default" way to write that kind of
document. In those cases, an instruction alone leaves too much to guesswork — ChatGPT fills the gap with the most
statistically common version of that document type, which may not match what you actually need. That''s exactly the
gap few-shot prompting (next lesson) closes.',
    array['Define zero-shot prompting and identify when it''s sufficient.','Write a clear zero-shot prompt for a straightforward task.'],
    array['Zero-shot prompting means instructing without providing example output.','It works well for common, well-understood tasks with no unusual format requirements.','It struggles when your desired output has a specific shape that isn''t the ''default'' version of that document.'],
    'Write a zero-shot prompt for a task you do regularly (a status update, a meeting summary format, a type of message). Note one place where the output didn''t match a specific expectation you had but never actually stated in the prompt.',
    true, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Few-Shot Prompting',
    'When an instruction alone isn''t getting you the exact shape of output you need, showing ChatGPT one or two examples usually fixes it immediately. This is few-shot prompting.',
    'Few-shot prompting means including a small number of example inputs and outputs in your prompt before
asking for a new one, in the same pattern. Instead of describing the format you want in words, you show it.

### A simple example
Suppose your team has a specific way of logging customer feedback: a one-line summary, a sentiment tag, and a
suggested action. Rather than describing this format in a paragraph, you could write: "Here are two examples of how
we log feedback: [example 1] ... [example 2] ... Now log this new piece of feedback in the same format: [new
feedback text]." ChatGPT will pick up the pattern — length, tone, structure — far more reliably than from a
description alone, because it''s matching a concrete pattern rather than interpreting an abstract instruction.

### How many examples, and how to choose them
Two or three good examples is usually enough — more rarely helps and adds length. Choose examples that are
representative of the range of real cases, not just the easiest one. If your real feedback ranges from glowing to
furious, include one of each, so the pattern ChatGPT learns covers the actual variation it will need to handle.

Few-shot prompting is one of the most reliable ways to get a consistent, repeatable output format from ChatGPT
across many uses of the same task — which makes it especially valuable for anything you do often.',
    array['Define few-shot prompting and explain why examples improve consistency.','Construct a few-shot prompt using 2-3 examples of the desired output.'],
    array['Few-shot prompting shows examples of the desired input-output pattern instead of only describing it.','Two to three representative examples are usually enough.','It''s especially valuable for tasks you repeat often and need a consistent format for.'],
    'Pick a recurring task where you have a specific format in mind (a status report line, a ticket summary, a social caption style). Write a few-shot prompt with two examples, then ask ChatGPT to continue the pattern with a new input.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Role and Perspective Prompting',
    'Telling ChatGPT to respond "as" a particular role — an editor, a skeptical reviewer, a specific kind of expert — can sharpen its output. This lesson covers how, and where the technique has limits.',
    'Asking ChatGPT to adopt a role — "act as a strict copy editor," "respond as a procurement director "
reviewing this proposal for risk," "critique this like a skeptical investor" — shifts the angle and tone of its
response toward that perspective. It''s a lightweight way of telling the model which lens to apply without having
to spell out every criterion that lens implies.

### Where it genuinely helps
Role prompting is most useful for review and critique tasks: "review this email as a customer who''s already
frustrated" surfaces different problems than a neutral read-through would. It''s also useful for calibrating tone —
"explain this as if to a smart 12-year-old" versus "as if to a board of directors" produces meaningfully different
language.

### Where it''s oversold
A role label is not a substitute for real context. "Act as a senior procurement expert" doesn''t give ChatGPT any
information it didn''t already have — it''s a style cue, not a knowledge upgrade. If you need accurate, specific
procurement guidance, the actual details of your situation matter far more than the role framing. Use role
prompting to shape tone and angle, and use context (Lesson 2.3) to supply the substance.',
    array['Explain how assigning a role or perspective changes ChatGPT''s output.','Use role prompting appropriately, without over-relying on it as a substitute for context.'],
    array['Role prompting shifts tone and angle by asking ChatGPT to respond from a specified perspective.','It''s most useful for review, critique, and calibrating tone for a specific audience.','A role label adds no real knowledge — pair it with genuine context, not instead of it.'],
    'Take a draft you''ve already written. Ask ChatGPT to critique it once with no role assigned, then again as "a skeptical reader looking for reasons to say no." Compare what each pass catches.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Structured Prompting',
    'For longer or more complex requests, laying your prompt out with clear labelled sections — rather than one dense paragraph — makes it far easier for ChatGPT (and you) to track every requirement.',
    'As a prompt accumulates objective, context, constraints and format all at once, it can turn into a dense
paragraph that''s easy to write sloppily and easy for details to get lost in. Structured prompting solves this by
laying the same information out under clear labels:

Goal: [what you want]
Context: [background it needs]
Constraints: [length, tone, things to avoid]
Format: [how the answer should be structured]

This isn''t a different technique from what you''ve already learned in Module 2 — it''s the same four components,
made visually explicit so nothing gets buried in a run-on sentence.

### When it''s worth the extra structure
For a quick one-line request, structure is overkill. For anything with multiple requirements — a report with a
specific format, several constraints, and a defined audience — labelled sections reduce the chance that ChatGPT (or
you, reviewing your own prompt) misses one of them. It also makes prompts easy to reuse: once you have a good
structured prompt for a recurring task, you can save it and just swap out the details each time.',
    array['Use labelled sections (e.g. Goal, Context, Constraints) to organise a complex prompt.','Recognise when a task is complex enough to benefit from explicit structure.'],
    array['Structured prompting lays Goal, Context, Constraints and Format out as labelled sections.','It reduces the chance of a requirement getting lost in a dense paragraph.','It''s most valuable for complex, multi-requirement or frequently reused prompts.'],
    'Take the most complex prompt you''ve written so far in this course and rewrite it using labelled Goal / Context / Constraints / Format sections. Note whether restructuring it surfaced a requirement you''d stated unclearly the first time.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 4: Advanced Prompting ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (v_course_id, 4, 'Advanced Prompting', 'Breaking down harder problems, and using ChatGPT to challenge and improve your own thinking.', array['Break a large, vague request into smaller sub-tasks ChatGPT can handle reliably','Get ChatGPT to state the assumptions behind an answer instead of hiding them','Request multiple distinct options instead of accepting the first answer as the only one'], 'draft', 'hybrid')
  returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Task Decomposition',
    'Large requests fail more often than small ones. Ask for an entire business plan in one prompt and you get a shallow, generic document; ask for the same plan one section at a time, reviewing each before moving on, and the quality rises sharply. Task decomposition is the skill of splitting a big goal into an ordered sequence of smaller prompts.',
    '### Why decomposition works

A single large prompt forces the model to guess your priorities, structure, and depth all at once, with no chance for you to correct course until the whole thing is done. Decomposition gives you a checkpoint after every step. If step 2 goes off track, you fix it before step 3 builds on a bad foundation.

It also plays to the model''s strengths. ChatGPT is generally more reliable on a well-defined sub-task ("write the risk section of this plan, given this context") than on an open-ended one ("write a business plan").

### A simple decomposition pattern

1. State the end goal in one sentence, so the model understands the destination even while working on a piece.
2. List the pieces you''ll need, in the order you''ll need them.
3. Ask for the first piece only, with any context it depends on.
4. Review, adjust, then feed the accepted output back in as context for the next piece.

For example, instead of "write a marketing plan for my new product," you might decompose into: audience definition → positioning statement → channel strategy → a 90-day content calendar. Each piece is a separate exchange, and each one can reference what was agreed in the previous step.

### When decomposition is overkill

Not everything needs this treatment. A single well-scoped paragraph, a quick rewrite, or a factual question rarely benefits from being split up — decomposition adds overhead and is worth that cost mainly when the task is genuinely large, has interdependent parts, or where getting an early piece wrong would waste a lot of downstream effort.

### Common failure mode

Decomposing a task but then pasting all the sub-prompts into one message defeats the purpose — you lose the checkpoints. The value comes from reviewing after each step, not just from splitting the text.',
    array['Break a large, vague request into smaller sub-tasks ChatGPT can handle reliably','Sequence sub-tasks so each step''s output feeds the next'],
    array['Split large, multi-part requests into an ordered sequence of smaller prompts','Review and correct each piece before it becomes context for the next','Reserve decomposition for genuinely large or interdependent tasks, not everything'],
    'Take a task you''d normally ask ChatGPT to do in one shot (a report, a lesson plan, a proposal). Write out a 3-5 step decomposition for it — just the list of pieces, in order, on paper. Then run only the first step as a prompt and evaluate whether the output was better scoped than what you''d expect from asking for everything at once.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Ask for Assumptions',
    'When a prompt is underspecified, ChatGPT still produces an answer — it just fills the gaps with assumptions you never see. Asking it to state those assumptions turns invisible guesses into a visible, checkable list.',
    '### The hidden-assumption problem

Ask "how should I price this product?" and the model will quietly assume a market, a customer segment, a cost structure, and a business stage, then answer as if those assumptions were facts you''d already agreed on. If your actual situation differs, the advice can be confidently wrong in ways that are hard to spot, because the assumptions were never written down.

### The fix: ask explicitly

Add a line like "list the assumptions you''re making before you answer" or "what would need to be true for this advice to apply?" This does two things: it forces the model to surface the gaps in your prompt, and it gives you a short list to check against reality before you act on the rest of the answer.

A useful variant: ask for assumptions first, in a separate turn, before asking for the full answer. This lets you correct wrong assumptions before the model builds a whole response on top of them — cheaper to fix a wrong premise than to redo a finished draft.

### What good assumption-surfacing looks like

A useful assumptions list is specific and falsifiable — "assumes you are selling B2B, not B2C," "assumes a 3-6 month runway," "assumes your competitors are priced between $20-$50" — not vague hedges like "results may vary" or "this depends on your situation," which tell you nothing you can check.

### Where this matters most

This technique earns its keep most on advice with real stakes — pricing, hiring, legal or financial framing, technical architecture decisions — where an unstated wrong assumption could send you down an expensive wrong path. For low-stakes creative or exploratory prompts, it''s often unnecessary friction.',
    array['Get ChatGPT to state the assumptions behind an answer instead of hiding them','Use stated assumptions to catch mismatches with your actual situation early'],
    array['Underspecified prompts get answered anyway — with invisible assumptions filled in','Asking for assumptions explicitly surfaces them so you can check and correct them','Most valuable for higher-stakes advice; often unnecessary for low-stakes prompts'],
    'Pick a question you''d ask ChatGPT for advice on (career, business, technical decision). Ask it twice: once for a direct answer, once prefaced with ''list your assumptions before answering, then give the answer.'' Compare the two — which assumptions in the second version would have changed the first answer if you''d corrected them?',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Ask for Alternatives',
    'ChatGPT''s first answer is one reasonable path through the problem, not necessarily the best one for you. Asking for two or three genuinely different alternatives — with their trade-offs — turns a single suggestion into a real decision.',
    '### Why the first answer isn''t automatically the best one

A single response reflects one way of framing the problem. There are usually other reasonable framings that trade off differently — cheaper but slower, simpler but less flexible, faster to ship but harder to maintain. If you only ever see the first answer, you never get to compare.

### How to ask well

"Give me three different approaches to this, with the trade-offs of each" works better than "are there other ways to do this?" because it commits the model to producing genuinely distinct options rather than minor variations of the same idea. You can also constrain the axis of variation: "give me a cheap option, a fast option, and a high-quality option" forces three answers that differ on a dimension you actually care about.

### Evaluating the alternatives

Once you have several options, ask the model to lay out the trade-offs explicitly rather than picking a winner for you — "compare these on cost, speed, and risk" gives you a table you can reason about. Reserve "which would you recommend and why" for after you understand the trade-offs yourself, and treat the recommendation as one more input, not the final word — you know constraints (budget, risk tolerance, team skills) that the model doesn''t.

### Watch for shallow variation

Sometimes a request for alternatives returns three options that are really the same idea with different wording. If that happens, ask again with an explicit axis of difference ("vary these by cost," "vary these by how much manual work is required") to force real distinctions.',
    array['Request multiple distinct options instead of accepting the first answer as the only one','Evaluate trade-offs across options rather than optimizing a single path'],
    array['The first answer is one path through the problem, not necessarily the best for you','Ask for alternatives explicitly, ideally along an axis you specify (cost, speed, risk)','Get the trade-offs laid out before asking for a recommendation, and weigh it against constraints only you know'],
    'Take a decision you''re currently facing (a tool choice, a process design, a piece of content). Ask ChatGPT for three genuinely different approaches with trade-offs, on an axis that matters to you (cost, speed, risk, effort). Check whether the three options are actually distinct or just reworded — if they''re too similar, re-prompt with an explicit axis.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Critique and Improvement',
    'A first draft — whether ChatGPT''s or your own — is rarely the best version. Asking for a targeted critique, then a revision based on that critique, consistently produces stronger output than asking for a ''better'' version directly.',
    '### Why critique-then-revise beats ''make it better''

"Make this better" is vague enough that the model may change things that were already fine, or miss the actual weak points. A structured critique pass — "what are the three weakest parts of this, and why" — surfaces specific, actionable problems first. Only then do you ask for a revision, targeted at those specific issues.

### A two-step loop

1. Ask for a critique against explicit criteria: clarity, accuracy, structure, persuasiveness, whatever matters for this piece. Request specifics, not general impressions — "point to the sentence or section" beats "the tone could be stronger."
2. Feed the critique back and ask for a revision that addresses each point. Then, if the stakes justify it, run the critique step again on the revision — diminishing returns set in quickly, so two or three rounds is usually enough.

### Self-critique has limits

Asking ChatGPT to critique its own output is useful but not infallible — the same blind spots that produced the first draft can also miss it during critique. Where possible, pair self-critique with an outside check: a colleague''s read, a fact-check against a primary source, or your own domain judgment, especially for anything with real consequences.

### Applying this to your own work, not just ChatGPT''s

This loop works just as well on something you wrote yourself. Paste in a draft and ask for a critique against specific criteria — this is often more useful than asking ChatGPT to write something from scratch, because you keep authorship and judgment while getting a structured second opinion on weak points you might not see in your own writing.',
    array['Use ChatGPT to critique its own or your existing work before treating it as final','Run a structured improve-then-verify loop instead of accepting a first draft'],
    array['A targeted critique pass, then a revision, beats a vague ''make it better'' request','Ask critique questions against explicit criteria and demand specifics, not general impressions','Self-critique has blind spots — pair it with an outside check for high-stakes work'],
    'Take a piece of writing you''ve produced recently (an email, a post, a document section — yours or ChatGPT''s). Ask for a critique against three specific criteria you choose. Then ask for a revision addressing only those points. Compare the revision to the original and decide whether a second critique-revise round would add enough value to be worth it.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 5: Writing & Communication ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (v_course_id, 5, 'Writing & Communication', 'Using ChatGPT for the writing tasks that fill a working week: emails, reports, decks and edits.', array['Use ChatGPT to produce a first draft of common workplace documents efficiently','Rewrite the same content for different audiences and registers','Produce accurate summaries at different lengths and levels of detail'], 'draft', 'hybrid')
  returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Drafting and Editing Documents',
    'Most professional writing — emails, memos, status updates, proposals — follows familiar patterns. ChatGPT is well suited to producing a solid first draft of this kind of writing quickly, freeing your time for the judgment calls: what to say, to whom, and how much detail is warranted.',
    '### Getting a usable first draft

Give the model the purpose of the document, the audience, the key points you need included, and the tone (formal, friendly, urgent). A prompt like "draft a status update email to my manager, covering: project is on track, one risk around vendor delay, need a decision on budget by Friday; keep it under 150 words, professional but not stiff" will usually produce something close to usable on the first try.

The more specific you are about what must be included, the less editing you''ll do afterward. Vague prompts produce generic drafts that require more rework, not less.

### Editing in place instead of regenerating

Once you have a draft, the efficient move is usually to edit it in place rather than asking for a whole new version. "Keep this as is, but tighten the second paragraph" or "make the closing line more direct" gets you a targeted change without risking new issues in parts that were already fine. Regenerating the whole document from scratch each time you want one change wastes both your time and the model''s context on parts that didn''t need to change.

### Matching tone and register

Workplace writing has different registers — a message to your manager, a note to a direct report, and an external client email all call for different tones even when the content is similar. State the audience and relationship explicitly ("this is going to my skip-level, who I don''t know well") so the draft matches the register you actually need.

### Where human judgment stays essential

ChatGPT doesn''t know your organization''s politics, your manager''s preferences, or what was said in the meeting last week that didn''t make it into your prompt. Use it for structure and phrasing, but review every draft for accuracy and appropriateness before sending — a fluent-sounding email with a wrong number or an insensitive line is still a costly mistake.',
    array['Use ChatGPT to produce a first draft of common workplace documents efficiently','Apply an edit-in-place workflow rather than regenerating from scratch each time'],
    array['Specific prompts (purpose, audience, key points, tone) produce drafts that need less rework','Edit in place for targeted changes rather than regenerating the whole document','Always review for accuracy, tone-fit, and organizational context the model doesn''t have'],
    'Draft a real email or document you actually need to send this week. Give ChatGPT the purpose, audience, key points, and tone. Review the draft, then make at least one targeted edit-in-place request rather than regenerating the whole thing. Note how much editing was needed versus writing it yourself from scratch.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Adjusting Tone and Audience',
    'The same core message often needs to reach different audiences in different registers — a technical update simplified for executives, a formal notice softened for a long-time client, a casual note firmed up for a first-time contact. ChatGPT can adapt tone quickly once you describe the target audience clearly.',
    '### Tone is about audience, not just adjectives

A request like "make this more professional" is a start, but "professional" means different things depending on who''s reading. It''s more effective to describe the audience and the relationship: "rewrite this for a client I''ve worked with for years, who prefers directness over formality" gives the model something concrete to calibrate against, rather than an abstract label.

### Useful tone dimensions to specify

Beyond formal/casual, consider naming: how much background knowledge the reader has (so technical detail can be added or stripped), how much urgency to convey, whether warmth or brevity matters more, and whether the relationship is new or established. Naming two or three of these gets a far more accurate rewrite than a single tone word.

### Simplifying for a different audience

A common workplace task is taking something technical or detailed and producing an executive-friendly version. Ask explicitly for what to cut ("assume no technical background, focus on business impact, three sentences maximum") rather than just "simplify this" — otherwise the model may guess wrong about what to keep.

### Checking the result actually shifted

After a tone rewrite, read it as the target audience would. A rewrite that just swaps a few words but keeps the same structure and length hasn''t really changed register — ask for a more substantial rewrite if the first pass feels superficial.',
    array['Rewrite the same content for different audiences and registers','Recognize when a tone request needs more than one adjective to be useful'],
    array['Describe the audience and relationship, not just a tone adjective','Specify dimensions like background knowledge, urgency, and warmth vs. brevity','A real tone shift changes structure and content choices, not just word substitutions'],
    'Take one message and produce three versions: one for a senior executive with no context, one for a peer who knows the background, and one for an external client. For each, specify the audience and at least two tone dimensions beyond formal/casual. Compare how much the three versions actually differ.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Summarizing Long Content',
    'Summarizing long documents, meeting transcripts, or email threads is one of ChatGPT''s most immediately useful capabilities for busy professionals — but summaries can quietly drop or distort important details, so knowing how to prompt for and check them matters.',
    '### Specifying the summary you actually need

"Summarize this" is underspecified. State the length (three bullet points, one paragraph, half a page), the audience, and what to prioritize — decisions made, action items, risks, numbers, whatever matters for your purpose. A meeting summary for someone who wasn''t there needs different content than one for a participant checking their own action items.

### Layered summaries

For long or complex material, ask for a layered summary: a one-line headline, a short paragraph, and a longer detailed version. This lets the reader (often you, later) choose how deep to go without re-summarizing from scratch each time.

### The verification step

A summary is a lossy compression, and the model can occasionally drop a caveat, invert a conclusion, or miss a number. For anything you''ll act on or forward to others — meeting notes with commitments, a summary you''ll cite in a decision — spot-check the summary against the source, especially any numbers, names, dates, or decisions. This matters more as source length grows, since more material means more that could be dropped or mischaracterized.

### Summarizing across multiple sources

When summarizing several documents or a long thread, ask the model to note where sources agree or disagree rather than blending everything into one flat account — disagreement between sources is often the most useful thing to surface, and it''s easy to lose in an overly smoothed summary.',
    array['Produce accurate summaries at different lengths and levels of detail','Verify a summary against the source before relying on it'],
    array['Specify length, audience, and priority (decisions, action items, risks) rather than a bare ''summarize''','Layered summaries (headline, paragraph, detail) serve different reading needs from one request','Spot-check summaries against the source before acting on or forwarding them, especially numbers and commitments'],
    'Take a long email thread, document, or meeting transcript you have access to. Ask for three summary lengths: one line, one paragraph, and a detailed version with action items. Spot-check the detailed version''s action items and any numbers against the original source.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Presentations and Talking Points',
    'Turning a pile of notes, data, or a document into a clear presentation outline or a set of talking points is a structuring task ChatGPT handles well — it''s less reliable at judging what will actually land with a live audience.',
    '### From raw material to outline

Give the model your source material (notes, a report, key data points) along with the audience, the time available, and the core message you want the audience to leave with. Ask for a slide-by-slide or section-by-section outline with one key point per section — resist the temptation to cram, since a presentation with too many points per slide is harder to deliver and to follow.

### Talking points versus a script

Talking points (short phrases or bullet points that prompt you to speak naturally) are usually more useful than a full script, which tends to produce stiffer, less natural delivery when read aloud. Ask explicitly for talking points, not a script, unless you specifically need word-for-word phrasing (a legal disclaimer, a precise quote).

### Anticipating questions

A useful addition: ask the model to list likely questions the audience might ask, given the content and audience type. This isn''t a substitute for knowing your material, but it''s a fast way to surface a question you hadn''t considered before you''re standing in front of the room.

### What stays human

Reading the room, adjusting pace and energy live, knowing which point will land with this particular audience, and handling questions in real time are all things ChatGPT cannot do for you. Use it to structure and tighten the content beforehand; the delivery is yours.',
    array['Structure a presentation outline or talking points from raw content or notes','Distinguish what ChatGPT is good at here (structure, clarity) from what needs human judgment (delivery, audience read)'],
    array['Give source material, audience, time available, and the core takeaway to get a usable outline','Ask for talking points rather than a full script for more natural delivery','Use it to anticipate likely questions, but delivery and reading the room remain your job'],
    'Take notes or a document you have for an upcoming presentation or update. Ask ChatGPT to turn it into a section-by-section outline with one key point per section, given your audience and time limit. Then ask for talking points (not a script) for one section, and a list of three likely audience questions.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 6: Learning With ChatGPT ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (v_course_id, 6, 'Learning With ChatGPT', 'Turning ChatGPT into a genuinely useful study partner and tutor.', array['Get explanations calibrated to your existing background instead of generic textbook answers','Use ChatGPT as a practice partner for skills like writing, argumentation, or a new language','Turn a broad learning goal into a structured, time-bound plan'], 'draft', 'hybrid')
  returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Explaining Unfamiliar Concepts',
    'ChatGPT can explain almost any concept, but a generic explanation aimed at ''someone'' rarely fits your actual starting point. Telling it what you already know — and don''t — turns a flat explanation into one that meets you where you are.',
    '### Anchor the explanation to your background

Instead of "explain machine learning," try "explain machine learning to someone who understands basic statistics and has written some Excel formulas, but has never coded." The model calibrates vocabulary, analogies, and depth to that starting point, which usually produces a far more useful answer than a generic one aimed at no one in particular.

### Use analogies deliberately

Asking for an explanation "using an analogy from [a domain you know well]" — cooking, sports, your own industry — often makes an abstract concept click faster than a literal technical explanation. If the first analogy doesn''t land, ask for a different one; a second attempt from a different angle sometimes succeeds where the first didn''t.

### Drilling into the specific gap

When an explanation still doesn''t fully land, resist asking for the whole thing again. Instead, name the specific part that''s unclear: "I followed everything except how X leads to Y — can you slow down just that step?" This is far more efficient than restarting from scratch, and it''s a habit worth building for any explanation, not just ChatGPT''s.

### Checking your own understanding

A good check after any explanation: try to restate the concept in your own words and ask the model to point out what you got wrong or oversimplified. This surfaces gaps that "yes, I understand" glosses over, and it''s a genuinely useful way to learn, not just a formality.',
    array['Get explanations calibrated to your existing background instead of generic textbook answers','Use follow-up questions to drill into the specific part you don''t understand'],
    array['State your existing background so the explanation is calibrated, not generic','Ask for analogies from a domain you know, and try a second one if the first doesn''t land','When stuck, name the specific gap rather than asking for the whole explanation again'],
    'Pick a concept you''ve been meaning to understand better (in your field or outside it). Ask for an explanation calibrated to your specific background, not a generic one. Then restate it in your own words and ask ChatGPT to correct any part you got wrong or oversimplified.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Practicing Skills With Feedback',
    'Beyond explaining concepts, ChatGPT can act as a practice partner — generating exercises, playing a role in a simulated conversation, or reviewing your attempt at something and telling you specifically what to improve.',
    '### Generating practice material

Ask for practice exercises at your level: "give me five intermediate-level negotiation scenarios I can practice responding to" or "quiz me on these five concepts, one question at a time." Specify difficulty and format so the practice actually matches where you are, not where a generic course would assume you are.

### Role-play and simulated conversation

For skills that involve interaction — a difficult conversation, a sales pitch, an interview, a new language — ask ChatGPT to play the other role. "Play a skeptical stakeholder in a budget negotiation; push back on my proposal realistically" gives you a low-stakes place to practice before the real conversation. Ask it to stay in character and resist being too easy on you, since an overly agreeable practice partner doesn''t build the skill you need.

### Getting feedback that''s actually useful

Generic feedback ("good job, keep practicing") doesn''t help you improve. Ask for something more specific: "what are the two weakest parts of my response, and what would a stronger version have done differently?" Specific, critical feedback — even when it stings a little — is what actually moves a skill forward.

### Knowing the limits of a practice partner

ChatGPT doesn''t replace real practice with real stakes and real people, and its read of what would land with a specific person or audience is a simulation, not a guarantee. Use it to build confidence and reps for the easier 80% of a skill, and still seek real feedback (a mentor, a colleague, a native speaker) for the parts where accuracy against real human response matters most.',
    array['Use ChatGPT as a practice partner for skills like writing, argumentation, or a new language','Get specific, actionable feedback instead of generic encouragement'],
    array['Ask for practice material and role-play scenarios matched to your actual level','Push the model to stay realistic and not go easy on you during practice','Request specific, critical feedback rather than generic encouragement'],
    'Pick a skill you want to practice (a hard conversation, a pitch, a new language). Ask ChatGPT to role-play the other side realistically, have the exchange, then ask for specific feedback on what to improve — not just encouragement.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Building a Study or Reading Plan',
    'A vague goal like ''learn more about data analysis'' rarely turns into consistent action on its own. ChatGPT can turn a broad learning goal into a concrete plan with milestones — but the plan is only useful if you shape it around your real constraints, not a generic ideal learner.',
    '### From goal to plan

Give the model your goal, your current level, the time you can realistically commit (per week, not per day, tends to be more honest), and your timeline. Ask for a plan broken into phases with clear milestones — "beginner phase: X, Y, Z by week 3; intermediate phase: ..." — rather than a flat, undifferentiated list of resources.

### Matching the plan to your actual pace

A first draft of a study plan often assumes more time or faster progress than is realistic. Push back explicitly: "this assumes 10 hours a week — I have 3. Rework it." A plan you''ll actually follow beats an ambitious one you''ll abandon in week two.

### Building in checkpoints, not just content

Ask the plan to include periodic check-in points where you test yourself or review progress, not just a list of things to read or do. A plan with built-in checkpoints (a quiz, a small project, a self-assessment question) catches drift early, before weeks of study go in a direction that isn''t working.

### Treat the plan as a draft, not a contract

Revisit and adjust the plan as you actually progress — some topics will take longer than expected, others shorter. Ask ChatGPT to help you revise the plan when your real pace diverges from the original, rather than trying to force reality to match a plan generated before you''d actually started.',
    array['Turn a broad learning goal into a structured, time-bound plan','Adjust a generated plan to fit your actual pace and constraints'],
    array['State your real weekly time commitment, not an aspirational one, for a plan you''ll actually follow','Ask for phases with milestones and checkpoints, not a flat list of resources','Treat the plan as adjustable — revise it as your real pace diverges from the first draft'],
    'Pick something you''ve been meaning to learn. Give ChatGPT your goal, current level, realistic weekly time commitment, and timeline. Ask for a phased plan with milestones and at least two checkpoints. Review it critically — does it actually fit your real available time, or does it need to be scaled back?',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Recognizing When You''re Being Misled',
    'When you''re learning something new from ChatGPT, you''re often not yet equipped to spot a wrong answer — that''s exactly the situation where an error can quietly become part of your mental model. This lesson focuses that risk specifically on learning contexts, building on the calibrated-trust habits introduced earlier in the course.',
    '### Why learning contexts are especially risky

When you already know a subject, you can often catch a wrong answer immediately. When you''re learning it for the first time, you have no internal check — a fluent, confidently-worded wrong explanation can lodge itself as fact simply because you had nothing to compare it against. This is the single biggest risk of using ChatGPT as a learning tool, and it''s worth taking seriously rather than assuming fluency implies correctness.

### Practical habits while learning something new

Cross-check foundational claims — definitions, key facts, widely-cited figures — against at least one authoritative source (a textbook, a reputable reference, a domain expert) before they become part of your working knowledge. This matters most for the building-block concepts everything else depends on; an error early in a learning sequence compounds as you build on it.

### Asking the model to flag its own uncertainty

You can ask directly: "which parts of this explanation are well-established, and which are more debated or uncertain?" This doesn''t guarantee accuracy, but it prompts the model to distinguish consensus material from contested or less certain territory, which is useful context you wouldn''t otherwise have.

### Building the verification habit long-term

The goal isn''t to distrust every answer — that would make the tool useless. It''s to build a habit of extra scrutiny specifically for foundational or high-stakes claims, especially early in learning a new subject, while treating well-established, easily cross-checked material with ordinary confidence.',
    array['Notice the difference between confident phrasing and actual accuracy','Apply verification habits specifically to the learning context, where errors compound'],
    array['Learning something new removes your ability to catch a confident wrong answer — treat this as the biggest risk of AI-assisted learning','Cross-check foundational, building-block claims against authoritative sources before relying on them','Ask the model to distinguish well-established material from debated or uncertain claims'],
    'Think of a subject you''re currently learning, partly through ChatGPT. Pick one foundational claim it gave you and cross-check it against an authoritative source (a textbook, a reputable website, an expert). Note whether it held up, and reflect on how you''d have caught it if it hadn''t.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 7: Professional Workflows ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (v_course_id, 7, 'Professional Workflows', 'Applying everything so far to procurement, marketing, operations and management workflows.', array['Turn raw meeting notes or a transcript into a clean set of action items and owners','Use ChatGPT to turn a known process into clear, structured documentation','Turn raw data or analysis into a stakeholder-ready narrative summary'], 'draft', 'hybrid')
  returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Meeting Notes to Action Items',
    'Meeting notes are often messy — a mix of discussion, tangents, and decisions buried in the middle of a sentence. ChatGPT is well suited to pulling structured action items out of that mess, provided you check the output against what was actually agreed.',
    '### From raw notes to structured output

Paste in your raw notes or transcript and ask for output in a specific structure: decisions made, action items with owners and due dates (where stated), and open questions still unresolved. Asking for these as three separate categories, rather than one flat list, makes the output far more usable than a generic summary.

### Handling missing information honestly

Notes often don''t state an owner or a due date explicitly. Ask the model to mark these as "owner not specified" or "no date given" rather than guessing — a guessed owner that turns out wrong is worse than an honest gap you can fill in yourself from memory.

### Verifying against what was actually said

Because action items drive real work, spot-check them against the source notes, especially anything with a deadline or a commitment attached to a specific person. A misattributed action item can cause real confusion or wasted work if it goes out to the team unverified.

### Turning this into a repeatable workflow

If you run this after every meeting, save the prompt structure you land on (categories, format, what to flag as missing) so you''re not reinventing it each time — consistency in structure makes the output more useful for tracking action items across meetings over time.',
    array['Turn raw meeting notes or a transcript into a clean set of action items and owners','Verify that extracted action items match what was actually agreed'],
    array['Ask for decisions, action items, and open questions as separate structured categories','Have missing owners or dates flagged explicitly rather than guessed','Verify extracted action items against the source before circulating them'],
    'Take notes from a recent meeting (yours or a template example). Ask ChatGPT to extract decisions, action items with owners/dates, and open questions as three separate lists, flagging anything with a missing owner or date rather than guessing. Check the action items against your memory of what was actually agreed.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Drafting Process Documentation',
    'Writing down a process you already know well is tedious precisely because you know it too well to see what needs explaining. ChatGPT can help structure that knowledge into documentation, provided you supply the actual steps rather than letting it guess a generic process.',
    '### Start from your actual steps, not a template

The most reliable way to get accurate documentation is to describe your actual process — step by step, in whatever rough form is fastest for you (a voice-to-text ramble, a bullet list, screenshots described in words) — and ask the model to structure and clarify it. Asking it to write a process "for onboarding a new client" from scratch, with no input from you, risks a generic process that doesn''t match how your team actually works.

### Structuring for the reader who doesn''t know the process yet

Ask explicitly for documentation written for someone doing this for the first time: numbered steps, a note of any prerequisites, and a callout for steps that are easy to get wrong. Someone who knows the process well (you) often skips obvious-to-you details that a newcomer needs.

### Keeping it accurate over time

Documentation goes stale as the real process evolves. When you use ChatGPT to update existing documentation, give it the current version plus what changed, and ask for a targeted update rather than a full rewrite — this preserves accurate parts and reduces the risk of the rewrite silently altering something that was still correct.

### Review before publishing

Because documentation is often followed literally by someone unfamiliar with the process, review the full draft against the real process yourself (or have a colleague who does the process daily review it) before it goes into a shared wiki or handbook — an inaccurate step in official documentation can cause real errors downstream.',
    array['Use ChatGPT to turn a known process into clear, structured documentation','Keep documentation accurate by grounding it in your actual steps, not assumptions'],
    array['Supply your actual steps rather than letting the model guess a generic process','Ask for documentation aimed at a first-time reader, with prerequisites and common pitfalls called out','Review the final draft against the real process before publishing it as official documentation'],
    'Pick a process you know well but haven''t documented. Describe the actual steps to ChatGPT in rough form, then ask it to structure this into clear numbered documentation for a first-time reader, including prerequisites and common mistakes. Review the result against what you actually do.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Data Summaries for Stakeholders',
    'Numbers alone rarely persuade — stakeholders need the story the numbers tell, in language suited to their role. ChatGPT can help translate data into a narrative summary quickly, but it''s on you to make sure the narrative doesn''t outrun what the data actually shows.',
    '### From numbers to narrative

Give the model the key figures, what changed and by how much, and the audience (executive, peer, technical team). Ask for a narrative summary that leads with the headline finding, not a re-listing of every number — "revenue grew 12% quarter over quarter, driven mainly by X" reads better and lands faster than a table restated in prose.

### Guarding against overstatement

A risk specific to this task: the model may phrase a correlation as causation, or a small sample result as a firm trend, simply because confident language reads better. Explicitly instruct it to hedge appropriately — "note if a finding is based on a small sample or if causation isn''t established" — and review the summary yourself for claims the data doesn''t actually support before it goes to stakeholders.

### Tailoring depth to the audience

An executive summary should lead with implications and recommendations; a summary for the analytics team can go deeper into methodology and caveats. Specify this explicitly rather than sending the same summary to both audiences, since what a technical reviewer needs (methodology, confidence intervals) can overwhelm an executive audience and vice versa.

### Keeping the underlying numbers close at hand

Always keep the narrative summary paired with (or linked to) the underlying data, so a stakeholder who wants to verify a claim can trace it back to the source numbers rather than taking the narrative on faith alone.',
    array['Turn raw data or analysis into a stakeholder-ready narrative summary','Avoid overstating conclusions the underlying data doesn''t fully support'],
    array['Lead the narrative with the headline finding, not a re-listing of every number','Explicitly instruct the model to hedge appropriately and avoid overstating causation or trend strength','Tailor depth to the audience, and always keep the narrative traceable back to the source data'],
    'Take a dataset or set of figures you have (real or from a project). Ask ChatGPT for an executive-level narrative summary leading with the headline finding, then review it specifically for any claim that overstates what the data supports (causation from correlation, a trend from a small sample).',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Cross-Functional Communication',
    'Communicating across functions — engineering to sales, finance to operations, legal to everyone — means translating specialized language without losing what actually matters. ChatGPT can help bridge that gap quickly, provided you keep an eye on accuracy as things get simplified.',
    '### Naming both sides of the gap

State clearly what function the content originates from and what function it''s going to: "this is a technical architecture doc; rewrite it for a sales team so they can explain the product''s capabilities to a customer, no engineering background assumed." Naming both sides explicitly produces a much more targeted translation than a generic "simplify this" request.

### What to preserve versus what to cut

Ask explicitly what must be preserved even in a simplified version — usually the practical implications (what the audience can and can''t do, claim, or promise) — versus what can be safely cut (implementation detail the target audience doesn''t need). This prevents a translation that''s easy to read but has quietly dropped something the target audience actually needed to know.

### Watching for accuracy loss in simplification

The most common failure in cross-functional translation is a simplification that becomes technically wrong — a caveat dropped, a "usually" turned into an "always." Have someone from the source function (or your own knowledge of it) review the simplified version before it''s used externally or relied on by the other team, particularly for anything a customer-facing team might repeat to a customer.

### Building shared vocabulary over time

If you do this translation repeatedly between the same two functions, ask ChatGPT to help build a running glossary of terms with plain-language equivalents — this compounds in value and speeds up every future translation between those two groups.',
    array['Translate technical or specialized content for an audience outside that function','Preserve accuracy while simplifying across a functional or disciplinary gap'],
    array['Name both the source and target function explicitly for a more accurate translation','Specify what practical implications must be preserved even as detail is cut','Have the simplified version checked by someone from the source function before it''s relied on elsewhere'],
    'Take a piece of specialized content from your own function (or a hypothetical one) and ask ChatGPT to translate it for a named different function, specifying what must be preserved versus what can be cut. Review the result for any caveat or nuance that got lost in simplification.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 8: Files, Data & Multimodal Work ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (v_course_id, 8, 'Files, Data & Multimodal Work', 'Working with documents, spreadsheets and images, and getting structured, multistep output.', array['Get accurate, grounded answers when asking ChatGPT questions about an uploaded file','Use ChatGPT to explore and summarize spreadsheet data effectively','Use image understanding and generation effectively for common workplace tasks'], 'draft', 'hybrid')
  returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Working With Uploaded Documents',
    'Uploading a document and asking questions about it is one of the most common workplace uses of ChatGPT — reviewing a contract, digesting a long report, pulling specific figures from a spreadsheet. It''s also a place where the model can quietly conflate what''s actually in the file with what it expects to be there.',
    '### Asking questions that stay grounded in the file

Ask specifically for the file''s content, not general knowledge: "quote the exact clause in this document that covers X" or "what does this document say about Y — quote the relevant line" pushes the model to ground its answer in the actual text rather than a plausible-sounding general answer. If an answer doesn''t include a quote or specific reference when you asked for one, treat that as a signal to double-check.

### Where this breaks down

Very long documents, documents with complex tables, or documents with content spread across many pages are where accuracy risk rises — the model may summarize approximately rather than precisely, especially for numbers buried in tables. For anything with financial, legal, or contractual weight, verify key figures and clauses yourself directly in the source rather than relying solely on the extracted answer.

### Asking for structured extraction

For tasks like pulling every deadline, every dollar figure, or every named party out of a document, ask for the output as a structured list ("list every date mentioned, in order, with the surrounding context") rather than a prose summary — structured extraction is easier to spot-check line by line against the source than a paragraph is.

### Multiple documents at once

When comparing or synthesizing across several uploaded documents, ask the model to attribute each point to its source document explicitly ("per Document A... whereas Document B states...") so you can trace any claim back to which file it came from, rather than getting a blended summary that obscures which document said what.',
    array['Get accurate, grounded answers when asking ChatGPT questions about an uploaded file','Recognize the limits of document-based question answering, especially on long or complex files'],
    array['Ask for quotes or specific references to keep answers grounded in the actual document','Verify figures and clauses yourself directly in the source for anything with real stakes','For multi-document comparisons, ask for explicit source attribution per point'],
    'Upload a document you have (a report, a contract, a long email thread) and ask a specific question that requires a quote or exact reference. Verify the quote against the actual document. Then ask for a structured extraction of one type of detail (dates, figures, names) and spot-check three entries against the source.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Analyzing Spreadsheets and Data',
    'ChatGPT can analyze uploaded spreadsheets — summarizing trends, calculating figures, spotting outliers — sometimes surfaced as a distinct Data Analysis feature depending on your plan, region, or workspace. But calculation accuracy on data work deserves the same scrutiny as any other high-stakes output, since a wrong sum or a misread column can look just as confident as a correct one.',
    '### Getting useful analysis from a spreadsheet

State what you actually want to know, not just "analyze this" — "what''s the month-over-month trend in column C, and are there any outliers?" produces a focused, checkable answer. Ask for the specific rows or values behind any conclusion ("which months were the outliers, and by how much") so you have something concrete to verify against the raw data.

### Verifying calculations

Where a specific number matters — a total, an average, a percentage change — recheck it independently, especially for anything that will inform a decision or go into a report. A spreadsheet''s own formula, or a quick manual check on a subset of rows, is a fast way to confirm the model read and calculated correctly rather than approximated.

### Handling messy or ambiguous data

Real spreadsheets have merged cells, inconsistent formatting, missing values, and multiple sheets. Flag known quirks up front ("column D has some blank rows meaning zero, not missing data") rather than letting the model guess how to interpret them — an unstated assumption about how to handle blanks or duplicates can quietly skew an entire analysis.

### When to move to a proper tool

For genuinely large datasets, complex multi-sheet models, or analysis that needs to be reproducible and auditable, treat ChatGPT''s spreadsheet analysis as an exploratory first pass — useful for spotting patterns and generating hypotheses quickly — and move to a dedicated data tool or your organization''s approved analytics pipeline for the final, decision-grade analysis.',
    array['Use ChatGPT to explore and summarize spreadsheet data effectively','Verify calculated results rather than trusting a stated number at face value'],
    array['Ask specific, checkable questions rather than a generic ''analyze this''','Independently verify any calculated figure that matters before relying on it','Flag known data quirks explicitly, and treat this as an exploratory first pass for large or high-stakes datasets'],
    'Upload a spreadsheet you have and ask a specific analytical question (a trend, an outlier, a calculated total). Independently verify one calculated figure against the raw data or a formula. Note any data quirks (blanks, merged cells) you should have flagged up front but didn''t.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Working With Images',
    'ChatGPT''s multimodal features — describing or analyzing an uploaded image, or generating a new one — can support workplace tasks from reviewing a screenshot to producing a quick visual concept, where available on your plan.',
    '### Analyzing uploaded images

Uploading a screenshot, a chart, a photo of a whiteboard, or a scanned document and asking questions about it works well for many common tasks — reading text from an image, describing a chart''s trend, or extracting a whiteboard''s bullet points into typed text. As with documents, ask for specifics ("what does the chart''s Y-axis label say, and what''s the value at the peak?") rather than a vague description, and verify anything with real stakes (a number on a chart, text in a scanned document) directly against the image yourself.

### Generating images

Image generation, where available depending on your plan, region, or workspace, can produce quick visual concepts — a mockup idea, an illustrative graphic, a rough visual for a deck. Be specific about style, composition, and purpose in your prompt, and treat the first result as a starting point for iteration rather than a final asset, especially for anything customer-facing.

### Rights, accuracy, and appropriate use

Generated images may carry usage restrictions depending on your organization''s plan and terms, and are not reliable for depicting specific real people, exact brand logos, or precise technical diagrams (a generated "org chart" or "architecture diagram" should not be trusted as accurate — use a proper diagramming tool for anything that needs to be correct, not just plausible-looking). Check your organization''s guidelines before using a generated image in any external or official material.

### A note on availability

Multimodal features vary by plan, region, and workspace configuration, and capabilities available today may change. If a feature described here isn''t available to you, that reflects your specific configuration rather than a universal limitation — check your plan''s current feature list rather than assuming based on this lesson alone.',
    array['Use image understanding and generation effectively for common workplace tasks','Recognize where availability, accuracy, and usage rights vary by plan and region'],
    array['Ask specific questions about uploaded images and verify anything with real stakes directly','Treat generated images as a starting point, not a final asset, especially for anything precise or customer-facing','Multimodal feature availability varies by plan, region, and workspace — check your own configuration rather than assuming'],
    'If you have image features available, upload a chart or screenshot and ask a specific question about its content, then verify the answer against the image yourself. If image generation is available, generate a simple illustrative graphic for a real need you have, and evaluate whether it''s usable as-is or needs further iteration.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Combining Files, Data, and Text in One Workflow',
    'Real workplace tasks rarely involve just one file or one type of content — a single project might involve a contract, a spreadsheet of figures, and a summary email all feeding into one deliverable. This lesson ties together the document, data, and image skills from this module into a combined workflow.',
    '### Sequencing a multi-source task

Break a combined task into stages, similar to the decomposition approach from earlier in the course: extract what you need from each source separately first (key clauses from the contract, key figures from the spreadsheet, key points from the email thread), confirm each extraction is accurate, and only then ask for the combined deliverable that synthesizes across all of them. Asking for the synthesis in one shot, with all sources dropped in at once, makes it much harder to catch which source an error came from.

### Keeping source attribution as complexity grows

As you combine more sources, explicitly ask the model to attribute each claim in the final output to its source ("per the contract... per the Q3 figures... per the client''s email...") so that if something looks wrong later, you know exactly which source to go back and check, rather than having to re-verify everything from scratch.

### A worked pattern

For example: reviewing a vendor proposal might mean (1) extracting key terms from the contract PDF, (2) pulling relevant cost figures from a spreadsheet, (3) summarizing the vendor''s pitch email, then (4) asking for a combined one-page risk-and-recommendation summary that references all three, with attribution. Each stage is checkable on its own before it becomes an input to the next.

### Recognizing when to stop chaining and verify

The longer a chain of AI-assisted steps gets, the more an early small error can compound into a larger one by the final output. For any deliverable with real consequences, build in an explicit verification stage at the end — a final read-through against all original sources — before treating the combined output as ready to use or share.',
    array['Chain document, data, and text work into a single coherent workflow','Keep track of which claims trace back to which source as the workflow gets more complex'],
    array['Extract and verify from each source separately before asking for a combined synthesis','Ask for explicit source attribution per claim as the workflow spans more sources','Build in a final verification stage against all originals for any multi-source deliverable with real consequences'],
    'Identify a real task you have that spans at least two file types (a document plus a spreadsheet, or a document plus an email thread). Break it into extraction stages, verify each stage, then ask for a combined summary with explicit source attribution for each claim. Do a final read-through against the originals before considering it done.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 9: Research & Verification ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (v_course_id, 9, 'Research & Verification', 'Knowing what ChatGPT can and can''t know, using web search and Deep Research, and verifying what it tells you.', array['Use ChatGPT effectively as a starting point for research, not an endpoint','Apply a practical process for checking claims that matter before relying on them','Recognize common patterns of bias or blind spot in AI-generated content'], 'draft', 'hybrid')
  returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Using ChatGPT for Research Without Being Misled',
    'ChatGPT can accelerate research by orienting you quickly to a topic, surfacing angles you hadn''t considered, and drafting a starting structure — but it is not a search engine or a database, and treating its answers as verified facts is the single most common research mistake people make with it.',
    '### What it''s good for in research

Fast orientation to an unfamiliar topic, generating a list of sub-questions to investigate, drafting a structure for a research document before you''ve gathered sources, and helping you think through a topic conversationally are all strong uses. It''s often fastest at the "what should I even be asking" stage of research, before you''ve gathered any sources.

### What it''s not good for

Treating any specific factual claim, statistic, date, or citation as verified without checking is the core risk. The model can state a wrong fact as confidently as a right one, and its knowledge has a training cutoff plus gaps and errors like any large but imperfect source. It should never be your only source for something you''ll publish, present as fact, or make a decision on.

### A workable split

Use ChatGPT for structure, framing, and generating questions to chase; use primary sources, search, and domain literature for the actual facts, figures, and citations that go into the final work. When it does state a specific fact, treat it as a lead to verify, not a citation to use directly — go find the actual primary source before repeating the claim as fact.

### Deep Research, where available

Some plans, regions, or workspaces offer a Deep Research capability (or a similarly named feature) that goes further than a normal conversational answer — it can work through multiple sources over several minutes and return a longer, cited research report on a topic. Where available, this can be a strong way to compile a first-pass literature scan or landscape overview before you dig in yourself. It still fits the same workable split above: treat a Deep Research report as a structured starting point with leads to verify, not a finished, citation-ready deliverable — check its sources the same way you''d check any other specific factual claim.

### Building the habit

Before finalizing anything based partly on ChatGPT-assisted research, run through it once specifically hunting for unverified factual claims — this is a different pass than checking for clarity or structure, and it''s the pass most people skip under time pressure, which is exactly when it matters most.',
    array['Use ChatGPT effectively as a starting point for research, not an endpoint','Distinguish claims that need external verification from those that don''t'],
    array['Use it for orientation, structure, and question generation — not as a source of verified facts','Treat any specific factual claim as a lead to verify, never a citation to use directly','Where available, a Deep Research feature can compile a useful first-pass report, but its citations still need checking','Do a dedicated fact-check pass before finalizing any research-based work'],
    'Pick a topic you need to research (real or practice). Use ChatGPT to generate a list of sub-questions and a draft structure — using a Deep Research feature for this if it''s available on your account. Then pick two specific factual claims it made along the way and verify each against a primary or authoritative source, noting whether they held up.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Fact-Checking and Source Triangulation',
    'Fact-checking doesn''t require distrust of everything — it requires a habit of applying more scrutiny where the stakes are higher and the claim is more central to your conclusion. This lesson builds a concrete, repeatable process.',
    '### A practical fact-checking process

1. Identify the claims that actually matter for your conclusion — not every sentence needs checking, but the load-bearing ones do.
2. For each, find at least one independent, authoritative source that states the same thing.
3. For anything with real consequences (a number in a report, a claim in a public post, a decision input), find a second independent source — a single source, even a reputable one, can be wrong or outdated.
4. Note where sources disagree rather than picking whichever one confirms what you expected to find.

### What counts as independent

Two sources that both cite the same original study or report aren''t independent triangulation — they''re the same claim repeated. Look for sources that reached the claim through separate means (different studies, different original reporting, official primary data) for genuine triangulation.

### Using ChatGPT inside the fact-checking process itself

You can ask ChatGPT to help identify what kind of source would be authoritative for a given claim ("what''s the primary source for this kind of statistic?") or to help you phrase a search to find one — this is a legitimate and efficient use, distinct from asking it to confirm the fact itself, which is not verification.

### Calibrating effort to stakes

A casual internal note doesn''t need the same rigor as a public-facing claim, a client deliverable, or something that will inform a real financial or strategic decision. Decide your verification bar based on what happens if the claim turns out to be wrong, not by applying one fixed process to everything regardless of stakes.',
    array['Apply a practical process for checking claims that matter before relying on them','Use triangulation across independent sources rather than a single confirming source'],
    array['Focus verification effort on the load-bearing claims, not every sentence','Triangulate across genuinely independent sources, not two sources citing the same origin','Calibrate verification rigor to the real-world stakes of being wrong'],
    'Take a claim you plan to use in real work (a statistic, a trend, an industry fact). Find two independent authoritative sources for it — not two sources citing the same original — and note whether they agree. If you can''t find two independent sources, treat that as a signal to soften the claim or drop it.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Identifying Bias and Gaps in AI Output',
    'AI output reflects patterns in its training data and default behaviors that can skew toward certain perspectives, examples, or framings without flagging that skew. Recognizing common patterns helps you catch gaps a first read might miss.',
    '### Common patterns worth watching for

Default examples and framings can skew toward whichever contexts are best represented in training data — often reflecting dominant markets, languages, or industry practices, which may not match your specific context (a different country''s regulations, a smaller industry, a non-English-speaking market). A recommendation phrased as universal best practice may really be "best practice in the most commonly represented context," which isn''t always yours.

### Asking for what''s missing

A direct and effective technique: ask "what perspective, context, or consideration might this be missing?" or "how might this look different in [your specific context — a region, an industry, a company size]?" This surfaces gaps you might not think to ask about otherwise, since the model won''t volunteer its own blind spots unprompted.

### Watching for false balance and false certainty

The model can also err in the other direction — presenting a settled question as more contested than it is, or a genuinely contested question as more settled than it is, particularly on topics where training data itself contains disagreement. Where a topic is genuinely important to get right, check whether independent expert consensus exists rather than taking the model''s framing of "how contested this is" at face value.

### Building this into your default process

Rather than treating this as an occasional check, build a habit of asking for the counter-perspective or missing context as a normal part of using AI output for anything that will inform a decision or go external — it costs one extra prompt and often surfaces something genuinely useful.',
    array['Recognize common patterns of bias or blind spot in AI-generated content','Actively prompt for missing perspectives rather than assuming a first answer is complete'],
    array['AI defaults can skew toward the most-represented contexts in training data, not necessarily yours','Explicitly ask what''s missing or how it would differ for your specific context','Watch for both false balance and false certainty on genuinely contested or settled topics'],
    'Take a piece of AI-generated advice or content you have (recommendation, analysis, plan). Ask explicitly what context or perspective it might be missing, and whether it would look different for your specific situation (region, industry, scale). Note what came up that you wouldn''t have caught otherwise.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Building a Personal Verification Habit',
    'This lesson closes out the research and verification module by consolidating what''s been covered into a personal habit you can carry forward — because the value of everything in this module depends on actually applying it consistently, not just having read it once.',
    '### Pulling the threads together

Across this module: use ChatGPT for structure and orientation, not as a source of verified fact; verify load-bearing claims through independent, authoritative sources; watch for bias and gaps by actively asking what''s missing; and calibrate how much scrutiny you apply based on real-world stakes. None of these require distrusting every output — they require knowing which situations call for extra care.

### A personal checklist worth keeping

A simple practical checklist: before relying on AI output for something that matters, ask yourself — what''s the cost if this is wrong? Have I verified the load-bearing claims independently? Have I asked what perspective or context might be missing? Am I treating a fluent answer as a correct one without checking? Running through even a short version of this consistently, for the outputs that actually matter, is what separates safe use from risky use.

### Where this habit matters most in your own work

Reflect on the specific parts of your own work where AI-assisted output has the highest stakes — client-facing claims, numbers in reports, anything published externally, decisions with real cost if wrong — and make the verification habit non-negotiable specifically there, even if you''re more relaxed elsewhere.

### Carrying this forward

This habit is the throughline of the entire course, not just this module — every workflow covered earlier (drafting, summarizing, analyzing data, research) benefits from the same calibrated trust. As you move into more advanced and higher-stakes uses in the rest of this course, keep applying it by default rather than as an afterthought.',
    array['Consolidate the course''s verification principles into a personal, repeatable checklist','Apply calibrated trust as a lasting habit rather than a one-time lesson'],
    array['Calibrated trust means knowing which situations need extra scrutiny, not distrusting everything equally','A short, personal, consistently-applied checklist beats an elaborate process you only use occasionally','Apply this habit as a default across every AI-assisted workflow, not just research tasks'],
    'Write your own short personal verification checklist (4-6 items) based on this module, tailored to the specific kinds of AI-assisted work you actually do. Identify the one or two areas of your work where you''ll commit to applying it every time, without exception.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 10: Advanced & Responsible ChatGPT Use ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (v_course_id, 10, 'Advanced & Responsible ChatGPT Use', 'Projects, Memory, Voice, Custom GPTs, and using all of this responsibly — capped by a hands-on capstone.', array['Distinguish Custom Instructions, Memory, and Projects as three separate features, not three names for the same thing','Identify where AI assistance fits naturally into your actual daily workflow','Understand common organizational policies around AI tool use and why they exist'], 'draft', 'hybrid')
  returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Custom Instructions, Memory & Projects',
    'Repeating the same background — your role, your preferences, your writing style, an ongoing piece of work — at the start of every conversation is inefficient. Depending on your plan, region, or workspace, ChatGPT may offer three distinct ways to avoid that: Custom Instructions, Memory, and Projects. They solve related problems but work differently, and using the right one for a given situation matters more than treating them as interchangeable.',
    '### Custom Instructions

Custom Instructions are explicit guidance you write yourself, once, about how you want ChatGPT to respond — your role, your preferred tone, formatting preferences, things to always or never do ("I''m a procurement professional; keep responses concise and cite credible sources; avoid generic advice"). They apply broadly across your conversations where enabled, and they only contain what you deliberately typed in — nothing is inferred or added on your behalf.

### Memory

Memory, where available and enabled in your settings, is different: it''s relevant information ChatGPT may retain from your conversations over time — a fact you mentioned, a preference that came up naturally — and draw on later for personalization, without you having to restate it. Unlike Custom Instructions, memory can accumulate gradually from what you say rather than only from an explicit instruction you wrote, and exactly what gets retained and how it''s used depends on your account''s settings and the feature''s current behavior. Memory is not simply "Custom Instructions that persist automatically" — it''s a separate mechanism with its own settings, and you can typically review or clear what''s been retained.

### Projects

Projects, where available, are a different feature again: an organized workspace for a related set of chats, files, and instructions tied to one ongoing objective — for example, everything related to a specific client engagement, a quarterly report cycle, or a course you''re building. Within a Project, you can keep reference files, project-specific instructions, and a history of related conversations together, rather than scattered across separate, disconnected chats. This is the right tool when you''re working on one substantial thing over time with recurring context, rather than wanting a general standing preference (Custom Instructions) or letting useful facts accumulate naturally across everything (Memory).

### Choosing between them

A rough guide: use Custom Instructions for standing preferences that apply everywhere ("always write in this tone"); use Memory (where available) for the natural accumulation of useful personal or professional context over time, with less manual setup; use Projects (where available) when you have one bounded body of ongoing work with its own files and context that deserves its own space. The three can be used together — they''re not mutually exclusive — but knowing which one you''re actually reaching for avoids the confusion of expecting one to behave like another.

### Trade-offs worth understanding

All three carry a privacy dimension: information you provide through any of them becomes available in future conversations that draw on it, so treat what you put into Custom Instructions, what accumulates in Memory, and what you upload into a Project the way you''d treat information stored in any workplace tool — appropriate for the context, not sensitive personal or confidential business information unless your organization''s policy explicitly permits it. Review and update Custom Instructions periodically so stale guidance doesn''t skew outputs, and check what Memory has retained from time to time rather than assuming it''s still accurate.

### Availability varies

None of these three features is universally available, and each can differ by plan, region, or workspace configuration; capabilities available today may also change over time. If a feature described here isn''t available to you, check your account''s current settings rather than assuming a universal capability — do not assume this lesson describes what every user has access to.',
    array['Distinguish Custom Instructions, Memory, and Projects as three separate features, not three names for the same thing','Use each one, where available, for the situation it actually fits','Understand the trade-offs and privacy implications of persistent context in any of the three'],
    array['Custom Instructions are explicit guidance you write; Memory is information ChatGPT may retain and use for personalization, subject to availability and settings; Projects are an organized workspace for one ongoing objective''s chats, files, and instructions','Memory is not just ''Custom Instructions that persist'' — it''s a separate mechanism with its own settings and behavior','Use the one that fits the situation: standing preference, accumulating context, or a bounded body of ongoing work','Treat information in any of the three with the same privacy care as any workplace tool, and check your organization''s policy'],
    'Check which of Custom Instructions, Memory, and Projects are available on your account. For each one that is, note what it''s currently doing (or set it up if it''s empty) using your actual role, preferences, and one piece of ongoing work. For any that aren''t available, write one sentence on which of the three would be most useful to you and why, as a reference for when it becomes available.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Integrating ChatGPT Into Daily Workflows',
    'The techniques in this course only pay off if they become part of how you actually work, not a separate tool you remember to use occasionally. This lesson is about deliberately integrating AI assistance into your real daily workflow — and being equally deliberate about where it shouldn''t sit.',
    '### Mapping your own workflow

Rather than looking for generic use cases, look at your actual week: which recurring tasks involve drafting, summarizing, structuring, or researching? Status updates, meeting follow-ups, first-draft documents, and research orientation are common candidates across most professional roles — but the specific list is yours to identify, not a generic template.

### Building repeatable prompts

For tasks you do repeatedly, save the prompt structure that worked well rather than reconstructing it from scratch each time — this course''s techniques (specifying audience, format, constraints) compound in value once you''ve found a version that reliably works for a specific recurring task.

### Voice, where available

Depending on your plan and platform, ChatGPT may offer a voice mode — you speak your prompt and hear a spoken response back. This can fit naturally into moments where typing isn''t practical: commuting, walking, or thinking out loud through a problem before you sit down to write it up properly. Treat a voice exchange the same as any typed one for accuracy purposes — the same review habits from this course apply regardless of which mode you used to get the answer.

### Custom GPTs, where available

Some plans let you, or your organization, build a Custom GPT — a saved, pre-configured version of ChatGPT with its own standing instructions and, sometimes, its own reference files or connected tools, built around one specific repeated task (a particular report format, a specific review checklist, a team''s standard process). If your organization has published Custom GPTs for common tasks, it''s worth checking whether one already fits before building a workflow from scratch. And if you notice yourself repeating the same custom instructions and reference material across many separate conversations, that repetition is usually a sign a Custom GPT — where available — would save real time.

### Where AI assistance should not sit

Judgment calls with real stakes — a final hiring decision, a legal or compliance determination, a commitment you''re making on someone else''s behalf, anything requiring accountability that can''t be delegated — should stay clearly in human hands, with AI assistance limited to preparing information and options, not making the call. This isn''t about distrust of the tool; it''s about where responsibility and judgment genuinely need to sit.

### Reviewing your own integration over time

Periodically review which AI-assisted workflows are actually saving you time and producing good results, versus which have become a habit without real payoff — not every task benefits equally, and the balance is worth revisiting as both the tools and your own work evolve.',
    array['Identify where AI assistance fits naturally into your actual daily workflow','Avoid over-relying on AI for judgment calls that should stay human'],
    array['Identify integration points from your actual recurring tasks, not a generic list','Save and reuse prompt structures that work well for repeated tasks','Where available, voice mode and Custom GPTs are additional ways to fit AI assistance into a real workflow — not different accuracy standards','Keep real judgment calls and accountability in human hands, with AI limited to preparing options'],
    'Map out your actual work week and identify three recurring tasks where the techniques from this course would genuinely help. For one of them, write and save a reusable prompt template you can reach for next time that task comes up. If voice mode or Custom GPTs are available on your account, try one of them once for a real task. Separately, name one type of decision in your role that should stay entirely human regardless of AI assistance.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Team and Organizational Considerations',
    'Using ChatGPT well as an individual is only part of the picture in a workplace — how you use it also intersects with your organization''s policies, your colleagues'' expectations, and your organization''s data and confidentiality obligations.',
    '### Why organizations have AI use policies

Policies around what data can be entered into AI tools, which use cases are approved, and how AI-assisted output should be disclosed exist for real reasons: confidentiality obligations to clients, data protection regulations, intellectual property concerns, and accuracy risk in externally-facing material. Treat these policies as informed guardrails, not arbitrary obstacles, and check your own organization''s current policy rather than assuming based on general practice.

### Confidentiality in shared or team settings

Be deliberate about what you paste into any AI tool — client data, unreleased financial figures, personal information about colleagues or candidates, and proprietary strategic information generally should not go into a general-purpose AI tool unless your organization has explicitly approved that specific use and tool for that specific kind of data.

### Disclosure and attribution norms

Different teams and organizations have different expectations about disclosing AI assistance in work product — some require it, some don''t, and norms are still evolving across industries. When in doubt, err toward transparency about where AI materially shaped a piece of work, particularly for anything that goes external or informs a significant decision.

### Contributing to good team norms

If your team doesn''t yet have clear guidance on AI tool use, you can contribute constructively — sharing what''s worked well, flagging where you''ve seen risk (an inaccurate output nearly used, a data-sharing question), and helping establish practical norms rather than either ignoring the question or over-restricting genuinely useful workflows.',
    array['Understand common organizational policies around AI tool use and why they exist','Apply responsible-use judgment when AI-assisted work affects colleagues or the organization'],
    array['Organizational AI policies exist for real reasons — confidentiality, data protection, accuracy risk — check your own org''s current policy','Be deliberate about what data goes into a general-purpose AI tool, especially client or confidential information','Contribute constructively to team norms around AI use and disclosure rather than assuming or ignoring the question'],
    'Find (or ask about) your organization''s current policy on AI tool use, particularly around what data can be entered and any disclosure requirements. Identify one place in your own recent AI-assisted work where you should double check you were following it, and one suggestion you could constructively offer your team based on what you''ve learned in this course.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Responsible AI Use and Your Personal Workflow',
    'This final lesson closes the course by bringing every thread together: the prompting techniques, the verification habits, the workflow integration, and the responsible-use judgment covered across all ten modules. The capstone exercise below asks you to build and document your own personal AI workflow, using what you''ve learned.',
    '### The throughline of this course

Good AI use is not a single trick — it''s a combination of skills working together: framing a clear, well-scoped prompt; iterating and decomposing complex tasks; verifying claims that matter before relying on them; adapting the tool to your actual workflow rather than a generic one; and exercising judgment about where responsibility must stay human. Each module built one piece of this; this lesson is where they come together.

### Human judgment stays central

Across every module, one principle recurs: ChatGPT is a capable assistant, not a decision-maker or a source of unverified truth. The teaching philosophy behind this course has been human defines the goal, AI assists with drafting and structuring, human reviews the result, AI helps improve it, human validates accuracy, and human makes the final decision. This loop — not a one-shot prompt-and-accept pattern — is what responsible, effective AI use actually looks like in practice.

### Responsible use as an ongoing practice

Responsible use isn''t a one-time checklist you complete and move past — it''s an ongoing practice of calibrated trust, verification proportional to stakes, and honest awareness of the tool''s limits alongside its genuine strengths. As AI tools continue to change, the specific features will evolve, but this underlying practice will remain the skill that matters.

### Closing the course

The capstone below asks you to put this into practice: build and document a real, personal AI-assisted workflow, using the specific techniques from this course, with explicit attention to verification and responsible use. This is the practical demonstration that you can apply what the course has covered — not to a hypothetical scenario, but to your own actual work.',
    array['Synthesize the course''s responsible-use principles into a coherent personal practice','Apply the full course — prompting, verification, workflow integration, responsible use — to a real, personal AI workflow'],
    array['Responsible, effective AI use combines prompting skill, verification habits, workflow fit, and judgment about where humans must stay in control','The course''s teaching loop — human defines, AI assists, human reviews, AI improves, human validates, human decides — is the practical model to carry forward','The capstone is a real, personal application of the full course, not a hypothetical exercise'],
    'BUILD YOUR PERSONAL AI WORKFLOW — FINAL CAPSTONE PROJECT

Design and document one complete, real AI-assisted workflow that you will actually use in your work or life. Your submission should include all of the following:

1. Workflow name and goal — what recurring task this workflow solves and why it matters to you.
2. Context and constraints — your role, audience, and any real constraints (time, data sensitivity, organizational policy) that shape the workflow.
3. Step-by-step workflow — the ordered sequence of prompts/steps you''ll actually follow, including any decomposition of a larger task into smaller pieces.
4. Sample prompts — the actual prompt text for at least two key steps, written specifically (not generic placeholders), applying the prompting techniques from Modules 2-4.
5. Verification plan — which outputs in this workflow need independent verification, what you''ll check them against, and why (referencing Module 9''s principles).
6. Tone/audience adaptation — how the workflow adapts output for different audiences, if applicable (referencing Module 5).
7. Responsible use considerations — what data this workflow involves, any organizational policy considerations, and any disclosure norms that apply (referencing Module 10, Lesson 3).
8. A worked example — run the workflow once on a real (or realistic) input and show the actual output at each major step.
9. What you''d do differently — one thing you''d change about the workflow after running it once, and why.
10. Reflection question 1: Which single technique from this course changed your approach to using ChatGPT the most, and why?
11. Reflection question 2: Where in this workflow could confident-but-wrong AI output cause the most damage if you skipped verification — and how does your workflow guard against that specifically?

Submit your completed workflow document as your capstone for this course.',
    false, 'draft', 'hybrid'
  );

  -- ---- Final evaluation: 20-question bank, 5 sampled per attempt ----
  insert into public.assessments
    (course_id, title, description, assessment_type, pass_threshold, max_attempts,
     time_limit_seconds, questions_per_attempt, status, generation_mode)
  values (
    v_course_id,
    'Final Evaluation: ChatGPT Workplace Power User',
    'Server-selects 5 random questions from a 20-question bank for each attempt (see migration 011).',
    'final_exam', 60, null, 900, 5, 'draft', 'hybrid'
  ) returning assessment_id into v_assessment_id;

  -- Question 1 (module 1, easy)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 1, 'mcq',
    'A colleague says ChatGPT ''knows everything and is always right, since it sounds so confident.'' Which statement best corrects this view?',
    'Module 1 establishes that fluency and confidence in ChatGPT''s phrasing are not reliable indicators of accuracy — outputs should be evaluated on their merits, not their tone.',
    'easy', array['module-1']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'ChatGPT is a search engine that only returns verified facts', false, 1),
    (v_question_id, 'ChatGPT can produce fluent, confident-sounding text that is sometimes factually wrong, so claims should be checked', true, 2),
    (v_question_id, 'ChatGPT only makes mistakes on very technical topics', false, 3),
    (v_question_id, 'Confidence in phrasing is a reliable signal of accuracy', false, 4);

  -- Question 2 (module 2, medium)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 2, 'mcq',
    'You ask ChatGPT to ''write a proposal'' and get a generic, shallow result. What is the most effective single change to your prompt?',
    'Module 2 teaches that vague prompts produce generic output; specifying objective, audience, context, and constraints produces a usable first draft.',
    'medium', array['module-2']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'Add the word ''please'' to be more polite', false, 1),
    (v_question_id, 'Repeat the same prompt three times', false, 2),
    (v_question_id, 'Specify the objective, audience, context, and constraints (format, length, tone)', true, 3),
    (v_question_id, 'Ask it to try again without changing anything', false, 4);

  -- Question 3 (module 3, medium)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 3, 'mcq',
    'You want ChatGPT to write in a very specific style without providing any examples in your prompt. What technique are you using, and what is its main limitation?',
    'Module 3 covers zero-shot prompting (asking directly with no examples) and notes its main limitation is less precision compared to giving the model concrete examples to anchor its output.',
    'medium', array['module-3']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'Zero-shot prompting; results may be less precisely matched to your intent without examples', true, 1),
    (v_question_id, 'Role prompting; it always outperforms other techniques', false, 2),
    (v_question_id, 'Few-shot prompting; it requires no setup at all', false, 3),
    (v_question_id, 'Structured prompting; it guarantees factual accuracy', false, 4);

  -- Question 4 (module 4, hard)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 4, 'mcq',
    'A large, vague request to ChatGPT (''write our full annual strategy'') tends to produce weak output. What does the course recommend as the most effective fix?',
    'Module 4 (Task Decomposition) recommends splitting large or interdependent tasks into ordered sub-tasks with review checkpoints between them, rather than one large undifferentiated request.',
    'hard', array['module-4']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'Ask for the entire strategy again in one very long prompt', false, 1),
    (v_question_id, 'Reduce the request to a single sentence with no detail', false, 2),
    (v_question_id, 'Skip planning and ask ChatGPT to guess your priorities', false, 3),
    (v_question_id, 'Break the task into an ordered sequence of smaller sub-tasks, reviewing each before the next', true, 4);

  -- Question 5 (module 5, easy)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 5, 'mcq',
    'You need to send the same core update to your manager and to an external client. What does the course recommend?',
    'Module 5 (Adjusting Tone and Audience) recommends describing the audience and relationship concretely rather than relying on a vague tone label, so the rewrite is properly calibrated.',
    'easy', array['module-5']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'Send the exact same message to both, since the content is identical', false, 1),
    (v_question_id, 'Describe the audience and relationship explicitly and ask for tone/register adapted to each', true, 2),
    (v_question_id, 'Only mention that you want it ''more professional'' with no other detail', false, 3),
    (v_question_id, 'Avoid using ChatGPT for anything audience-specific', false, 4);

  -- Question 6 (module 6, medium)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 6, 'mcq',
    'You''re learning a new subject using ChatGPT and want to reduce the risk of absorbing a wrong explanation as fact. What is the most important habit to apply?',
    'Module 6 (Recognizing When You''re Being Misled) explains that learning something new removes your ability to catch a wrong answer, making cross-checking foundational claims especially important.',
    'medium', array['module-6']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'Cross-check foundational, building-block claims against an authoritative source before relying on them', true, 1),
    (v_question_id, 'Accept every explanation at face value since fluent phrasing implies correctness', false, 2),
    (v_question_id, 'Avoid asking any follow-up questions to keep things simple', false, 3),
    (v_question_id, 'Only trust explanations that use technical jargon', false, 4);

  -- Question 7 (module 7, medium)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 7, 'mcq',
    'While extracting action items from messy meeting notes, ChatGPT cannot determine who owns a particular task from the notes provided. What is the best practice?',
    'Module 7 (Meeting Notes to Action Items) recommends flagging missing information honestly rather than guessing, since a wrong guessed owner is worse than an honest, visible gap.',
    'medium', array['module-7']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'Guess a plausible owner so the list looks complete', false, 1),
    (v_question_id, 'Omit the action item entirely from the list', false, 2),
    (v_question_id, 'Assign it to yourself by default', false, 3),
    (v_question_id, 'Have it explicitly mark the item as ''owner not specified'' rather than guessing', true, 4);

  -- Question 8 (module 8, medium)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 8, 'mcq',
    'You upload a long contract and ask ChatGPT whether it includes a specific clause. What should you specifically ask for to keep the answer grounded in the actual document?',
    'Module 8 (Working With Uploaded Documents) recommends asking for quotes or specific references so answers stay grounded in the actual file rather than a plausible-sounding general answer.',
    'medium', array['module-8']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'A general summary of contracts in that industry', false, 1),
    (v_question_id, 'The model''s opinion on whether the clause is fair', false, 2),
    (v_question_id, 'An exact quote or specific reference from the document, not just a paraphrase', true, 3),
    (v_question_id, 'A completely different, unrelated document for comparison', false, 4);

  -- Question 9 (module 9, easy)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 9, 'mcq',
    'You''re using ChatGPT to research an unfamiliar topic for a report. What is the recommended way to treat specific factual claims (statistics, dates, citations) it provides?',
    'Module 9 (Using ChatGPT for Research Without Being Misled) teaches that specific claims should be treated as leads to verify, never as ready-to-use citations.',
    'easy', array['module-9']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'Treat them as leads to verify against a primary or authoritative source before using them as fact', true, 1),
    (v_question_id, 'Use them directly as citations in your final report', false, 2),
    (v_question_id, 'Ignore all factual claims from ChatGPT entirely', false, 3),
    (v_question_id, 'Assume they are correct because the model sounds confident', false, 4);

  -- Question 10 (module 10, medium)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 10, 'mcq',
    'A colleague says Custom Instructions, Memory, and Projects are all just different names for the same ChatGPT feature. Which response correctly distinguishes them?',
    'Module 10 (Custom Instructions, Memory & Projects) distinguishes all three: Custom Instructions are explicit guidance you provide yourself, Memory is retained information used for personalization subject to availability and settings (not simply ''Custom Instructions that persist''), and Projects is an organized workspace for related chats, files, and instructions tied to one ongoing objective.',
    'medium', array['module-10']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'They''re right — Memory is simply Custom Instructions that persist automatically across conversations', false, 1),
    (v_question_id, 'Only Projects is a real feature; Custom Instructions and Memory don''t actually exist as separate settings', false, 2),
    (v_question_id, 'Custom Instructions and Memory are the same feature, but Projects is unrelated to either of them', false, 3),
    (v_question_id, 'They''re three distinct features: Custom Instructions are explicit guidance you write, Memory is information ChatGPT may retain and use for personalization (subject to availability and settings), and Projects is an organized workspace for one ongoing objective''s chats, files, and instructions', true, 4);

  -- Question 11 (module 3, hard)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 11, 'mcq',
    'You give ChatGPT two example email replies in your desired style before asking it to draft a third. Which technique is this, and why might it help here?',
    'Module 3 defines few-shot prompting as supplying examples so the model can infer the specific pattern or style you want, often more precisely than a description alone.',
    'hard', array['module-3']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'Zero-shot prompting; it works because no examples are needed', false, 1),
    (v_question_id, 'Few-shot prompting; it helps the model infer your specific tone and pattern from concrete examples', true, 2),
    (v_question_id, 'Chain-of-thought prompting; it always improves grammar', false, 3),
    (v_question_id, 'Role prompting; it requires assigning the model a persona', false, 4);

  -- Question 12 (module 4, medium)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 12, 'mcq',
    'Before accepting ChatGPT''s advice on a pricing decision, you ask it to list the assumptions behind its answer. Why is this a good practice?',
    'Module 4 (Ask for Assumptions) explains that underspecified prompts get invisibly filled in with assumptions; asking for them explicitly turns invisible guesses into a checkable list.',
    'medium', array['module-4']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'It guarantees the advice is now completely correct', false, 1),
    (v_question_id, 'It replaces the need to specify context in your original prompt', false, 2),
    (v_question_id, 'It surfaces the hidden assumptions filled in for an underspecified prompt, so you can check them against your real situation', true, 3),
    (v_question_id, 'It has no real benefit and only adds an extra step', false, 4);

  -- Question 13 (module 5, medium)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 13, 'mcq',
    'You ask ChatGPT to summarize a long meeting transcript and plan to forward the summary with listed action items. What should you do before forwarding it?',
    'Module 5 (Summarizing Long Content) stresses that summaries are lossy and can drop or distort details, so anything you''ll act on or forward should be spot-checked against the source first.',
    'medium', array['module-5']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'Spot-check the action items, especially owners, dates, and any numbers, against the actual transcript', true, 1),
    (v_question_id, 'Forward it immediately since summaries are always accurate', false, 2),
    (v_question_id, 'Delete the action items section entirely to be safe', false, 3),
    (v_question_id, 'Ask for a shorter summary and skip verification', false, 4);

  -- Question 14 (module 6, easy)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 14, 'mcq',
    'When using ChatGPT as a practice partner for a difficult conversation, what feedback style does the course recommend requesting?',
    'Module 6 (Practicing Skills With Feedback) recommends asking for specific, critical feedback rather than generic encouragement, since vague praise doesn''t help a skill improve.',
    'easy', array['module-6']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'Generic encouragement like ''good job, keep practicing''', false, 1),
    (v_question_id, 'No feedback at all, just repeated practice', false, 2),
    (v_question_id, 'Feedback only on grammar and spelling', false, 3),
    (v_question_id, 'Specific, critical feedback naming the weakest parts of your response and what a stronger version would do differently', true, 4);

  -- Question 15 (module 7, hard)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 15, 'mcq',
    'You''re using ChatGPT to write a stakeholder-facing summary of quarterly data showing a correlation between two metrics. What is the key risk to guard against?',
    'Module 7 (Data Summaries for Stakeholders) warns that confident narrative phrasing can overstate what data supports, such as implying causation from correlation — this should be checked and hedged appropriately.',
    'hard', array['module-7']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'The summary being too short for executives to read', false, 1),
    (v_question_id, 'The narrative overstating the finding, such as phrasing a correlation as causation or a small-sample result as a firm trend', true, 2),
    (v_question_id, 'The summary including too many caveats and hedges', false, 3),
    (v_question_id, 'The data not being formatted as a table', false, 4);

  -- Question 16 (module 8, hard)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 16, 'mcq',
    'You ask ChatGPT to calculate a total from an uploaded spreadsheet for a report. What is the recommended verification step?',
    'Module 8 (Analyzing Spreadsheets and Data) stresses independently verifying any calculated figure that matters, since calculation accuracy deserves the same scrutiny as any other high-stakes output.',
    'hard', array['module-8']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'Trust the number since spreadsheet analysis is always exact', false, 1),
    (v_question_id, 'Round the number to make any small errors irrelevant', false, 2),
    (v_question_id, 'Independently verify the calculated figure against the raw data or a formula, especially since it will inform a decision', true, 3),
    (v_question_id, 'Skip verification for numbers under a certain size', false, 4);

  -- Question 17 (module 9, hard)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 17, 'mcq',
    'Two sources both restate a statistic, and you discover they both cite the very same original study. Does this count as triangulation?',
    'Module 9 (Fact-Checking and Source Triangulation) explains that genuine triangulation requires independent sources reaching a claim through separate means, not multiple restatements of one original source.',
    'hard', array['module-9']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'No, because they are not independent — they trace back to the same original claim rather than confirming it through separate means', true, 1),
    (v_question_id, 'Yes, because there are two sources that agree', false, 2),
    (v_question_id, 'Yes, but only if both sources are websites', false, 3),
    (v_question_id, 'No, because triangulation requires exactly three sources, never two', false, 4);

  -- Question 18 (module 10, hard)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 18, 'mcq',
    'Your team has no formal policy yet on what kinds of data can be pasted into ChatGPT. Which response best reflects the course''s guidance on organizational considerations?',
    'Module 10 (Team and Organizational Considerations) advises being deliberate about data shared with AI tools absent explicit approval, and contributing constructively to establishing team norms rather than ignoring the question.',
    'hard', array['module-10']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'Continue pasting any data you find useful, since no policy exists yet', false, 1),
    (v_question_id, 'Avoid using ChatGPT at all until a formal policy is written', false, 2),
    (v_question_id, 'Be deliberate about what you share, avoid client or confidential data by default, and constructively help establish practical team norms', true, 3),
    (v_question_id, 'Assume all data is safe to share since ChatGPT is a widely used tool', false, 4);

  -- Question 19 (module 1, medium)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 19, 'mcq',
    'A new team member asks how to think about ChatGPT''s role on the team. Which framing matches the course''s teaching philosophy?',
    'Module 1 (and reinforced through the course) frames AI as an assistant within a human-led loop: define, assist, review, improve, validate, decide — never a replacement for human judgment and accountability.',
    'medium', array['module-1']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'AI should make the final decision so humans can focus elsewhere', false, 1),
    (v_question_id, 'AI output should be used unreviewed to save time', false, 2),
    (v_question_id, 'Humans should avoid AI assistance entirely to protect their skills', false, 3),
    (v_question_id, 'Human defines the goal, AI assists, human reviews and validates, and the human makes the final decision', true, 4);

  -- Question 20 (module 2, easy)
  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, difficulty, tags)
  values (
    v_assessment_id, 20, 'mcq',
    'Which of the following best describes why adding context (background, prior decisions, constraints) to a prompt improves the result?',
    'Module 2 explains that context narrows the gap between what the model assumes and your real situation, directly improving relevance and accuracy of the response.',
    'easy', array['module-2']
  ) returning question_id into v_question_id;

  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'It makes the response longer, which is always better', false, 1),
    (v_question_id, 'It reduces the number of assumptions ChatGPT has to guess, so the output better fits your actual situation', true, 2),
    (v_question_id, 'It has no measurable effect on output quality', false, 3),
    (v_question_id, 'It only matters for creative writing tasks', false, 4);

end $$;
