-- ============================================================
-- Seed: Microsoft Copilot Mastery -- 7-course program
-- Written 2026-10-06, at BK's request, as a new, standalone
-- Microsoft Copilot course program for Barada Academy, built
-- from BK's own prior Copilot handbook conversation (71-chapter
-- structure) as topical/structural reference only. All lesson
-- prose below is original, written fresh for this course -- none
-- of it is copied from Copilot's own generated handbook text.
--
-- This is seven wholly new, additive course rows. It does not
-- modify any existing course, module, lesson, assessment,
-- payment, certificate, authentication, or learner-identity data,
-- and does not touch the ChatGPT or Claude course families.
-- Inserted as status = 'draft' throughout (course/modules/lessons),
-- generation_mode = 'hybrid' -- same convention as every other
-- AI-assisted course seed in this repo (003, 006). Needs your
-- review and a status flip to 'published' before any of it is
-- live, same as any other draft course.
--
-- Covers, across the 7 courses:
--   1. Microsoft Copilot: AI Foundations
--   2. Microsoft Copilot: Prompt Engineering Excellence
--   3. Microsoft 365 Copilot Mastery
--   4. Copilot for Business Functions
--   5. Copilot: Automation and Agentic AI
--   6. Copilot for Developers and Enterprise Architecture
--   7. Copilot: Governance, Security, and AI Leadership
-- ============================================================

do $$
declare
  v_domain_id  uuid;
  v_course_id  uuid;
  v_module_id  uuid;
begin

  select domain_id into v_domain_id
    from public.domains where slug = 'ai-tools' and app_id = 'academy';

  -- ============================================================
  -- Course: Microsoft Copilot: AI Foundations  (slug: microsoft-copilot-ai-foundations)
  -- ============================================================
  insert into public.courses
    (slug, title, subtitle, description, category, difficulty, icon, theme_color,
     sort_order, status, visibility, domain_id, outcomes, target_audience,
     prerequisites, skills_covered, estimated_hours, generation_mode)
  values (
    'microsoft-copilot-ai-foundations',
    'Microsoft Copilot: AI Foundations',
    'Understand how generative AI actually works before you rely on it daily',
    'A grounding in what Microsoft Copilot is, how large language models work under the hood, and where Copilot fits across Microsoft''s product line, so later courses build on real understanding rather than button-pushing.',
    'AI Tools', 'Beginner', '🧠', '#1A7F56',
    20, 'draft', 'public',
    v_domain_id,
    array['Explain what generative AI is and is not','Describe how large language models produce their answers','Identify hallucination and grounding, and why both matter','Navigate the Microsoft Copilot product family with confidence'],
    array['Students','Office professionals','Managers new to AI tools'],
    array['No prior Microsoft Copilot experience required for this course'],
    array['Explain what generative AI is and is not','Describe how large language models produce their answers','Identify hallucination and grounding, and why both matter','Navigate the Microsoft Copilot product family with confidence'],
    2.0, 'hybrid'
  ) returning course_id into v_course_id;

  -- ---- Module 1: Understanding Artificial Intelligence ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 1, 'Understanding Artificial Intelligence',
    'From the history of automation to how today''s AI models actually learn and predict.',
    array['Place generative AI in the arc of past productivity shifts','Define generative AI in contrast to traditional software and narrow AI','Describe supervised, unsupervised, and reinforcement learning at a conceptual level'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'The Evolution of Human Productivity',
    'Every major productivity shift has changed what a single person can accomplish in a day, without changing what a person fundamentally is. The move from farm to factory multiplied physical output. The.',
    'Every major productivity shift has changed what a single person can accomplish in a day, without changing what a person fundamentally is. The move from farm to factory multiplied physical output. The move from factory to office multiplied coordination and record-keeping. The personal computer and internet multiplied access to information and to other people. Generative AI is the next multiplier, and it works on a different lever than the ones before it: it multiplies the speed of thinking-adjacent work — drafting, summarising, comparing, explaining — rather than the speed of typing or searching.

This matters because it changes what a day''s work looks like, not what work is for. A tool like Copilot does not decide what matters, what is true, or what a business should do about either. It drafts, suggests, and accelerates. The judgement, the accountability, and the final decision stay with the person using it. Treat Copilot as a fast, tireless assistant who has read a great deal and forgotten none of it, but who has no stake in the outcome and no lived experience of your business — because that is exactly what it is.

The practical takeaway for this course: every later lesson teaches a capability. This first one sets the frame you should hold while using all of them — AI accelerates the work, you remain responsible for the result.',
    array['Place generative AI in the arc of past productivity shifts','Describe the human-plus-AI partnership model','Recognise that AI augments judgement rather than replacing it'],
    array['Past productivity tools multiplied physical or informational output; generative AI multiplies thinking-adjacent output','Copilot drafts and accelerates — it does not decide or take accountability','The human-plus-AI model keeps judgement and final sign-off with the person','This framing should carry through every subsequent lesson in the course'],
    'Write two sentences describing one task in your own job where speed of drafting is the bottleneck, versus one task where judgement is the bottleneck. Notice which one Copilot can actually help with.',
    true, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'What Generative AI Actually Is',
    'Traditional software follows rules a programmer wrote in advance: if this input, then this output. Generative AI works differently. A large language model (LLM) is trained on enormous amounts of text.',
    'Traditional software follows rules a programmer wrote in advance: if this input, then this output. Generative AI works differently. A large language model (LLM) is trained on enormous amounts of text and learns statistical patterns in how language is used — which words, ideas, and structures tend to follow which others. When you give it a prompt, it is not looking up a stored answer; it is generating, word by word, the continuation that its training makes most probable given everything you have told it.

This is why the same prompt can produce slightly different answers each time, and why the quality of what you get depends heavily on the quality and specificity of what you ask. It is also why these models can sound confident while being wrong: fluency and accuracy are two different things the model does not inherently distinguish between.

Microsoft Copilot sits on top of models like this, but adds structure around them: it can ground answers in real documents, follow enterprise permissions, and connect to live systems rather than relying purely on what the underlying model learned during training. Understanding the base model''s behaviour is what lets you use Copilot''s added structure well, instead of fighting against the model''s natural tendencies.',
    array['Define generative AI in contrast to traditional software and narrow AI','Explain, at a plain-language level, what a large language model does','Distinguish AI capability from AI reliability'],
    array['LLMs generate the statistically likely continuation of your prompt, they do not retrieve stored answers','Output varies run to run; prompt quality and specificity materially affect output quality','Fluent and confident is not the same as correct','Copilot adds grounding, permissions, and live-system connections on top of the base model'],
    'Ask Copilot the same factual question about your industry twice, with identical wording. Compare the two answers and note exactly what differs.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Machine Learning in Plain Terms',
    'Machine learning is the umbrella term for systems that improve at a task from data and experience rather than from explicit, hand-written rules. There are three broad flavours worth knowing.',
    'Machine learning is the umbrella term for systems that improve at a task from data and experience rather than from explicit, hand-written rules. There are three broad flavours worth knowing. Supervised learning trains a model on labelled examples — input paired with the correct output — until it can predict the output for new, unseen inputs. Unsupervised learning finds structure and patterns in unlabelled data, such as grouping similar documents together without being told the groups in advance. Reinforcement learning improves behaviour through trial, feedback, and reward, which is part of how chat-style models like the one behind Copilot are refined to be more helpful and less harmful after their initial training.

The single most important fact to carry forward from this lesson: a model''s behaviour is a reflection of its training data and training process, not an independent judgement. If the data a model learned from was incomplete, biased, or outdated in a particular area, the model''s answers in that area will inherit those gaps — confidently, and without flagging the gap to you.

This is precisely why business-critical answers from Copilot should be checked against a real source, especially for anything involving current facts, specific numbers, names, dates, or anything outside common, well-documented knowledge.',
    array['Describe supervised, unsupervised, and reinforcement learning at a conceptual level','Explain why training data quality determines model behaviour','Connect these concepts to why Copilot sometimes gets things wrong'],
    array['Supervised learning: trained on labelled input-output pairs','Unsupervised learning: finds structure in unlabelled data','Reinforcement learning: improves behaviour through feedback and reward','Model behaviour reflects its training data — gaps in training become gaps in answers, without warning'],
    'Pick one fact Copilot stated confidently in a past conversation with you. Spend two minutes verifying it against a primary source and note whether it held up.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 2: Language Models and the Copilot Ecosystem ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 2, 'Language Models and the Copilot Ecosystem',
    'How large language models actually process language, and how Microsoft has built a family of Copilot products around them.',
    array['Define tokens and context windows in practical terms','Define hallucination precisely, not as a vague catch-all for ''wrong answer''','Distinguish Copilot Chat from Microsoft 365 Copilot'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Tokens, Context, and Why Length Matters',
    'Language models do not read text the way you do. They break it into tokens — chunks roughly the size of a short word or word-fragment — and process those tokens as numbers. Every model has a context.',
    'Language models do not read text the way you do. They break it into tokens — chunks roughly the size of a short word or word-fragment — and process those tokens as numbers. Every model has a context window: the maximum number of tokens, across your prompt, any attached documents, and the conversation history, that it can consider at once. Once you exceed that window, the model loses visibility into the earliest parts of the conversation or document, even though you can still see them on screen.

This has two practical consequences inside Copilot. First, very long back-and-forth chats can drift — the model may lose track of an instruction you gave early on, because it has effectively fallen outside the window. When that happens, restating your key constraint is more reliable than assuming it still remembers. Second, when you hand Copilot a long document to summarise or analyse, how well it handles the whole document depends on that document''s length relative to the context window — which is one reason asking for a summary of a specific section, rather than an entire lengthy report at once, often produces a more faithful result.

None of this is a flaw to work around nervously — it is simply how the technology functions, and knowing it changes how you structure a long working session.',
    array['Define tokens and context windows in practical terms','Explain why very long conversations or documents can degrade output quality','Apply this understanding to structure prompts and documents more effectively'],
    array['Tokens are the chunks of text a model actually processes, not whole words or sentences','The context window is the model''s working memory limit across prompt, documents, and history','Long conversations can cause the model to lose track of earlier instructions','Breaking long documents into sections often produces more faithful analysis than one giant request'],
    'In your next long Copilot conversation, restate your original goal in one sentence after about 15 exchanges, and compare the response quality before and after.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Hallucination and Grounding',
    'A hallucination, in AI terminology, is a plausible-sounding statement the model generates that is not actually true and is not supported by any real source — a fabricated citation, an invented.',
    'A hallucination, in AI terminology, is a plausible-sounding statement the model generates that is not actually true and is not supported by any real source — a fabricated citation, an invented statistic, a confidently described feature that does not exist. It happens because the model is built to generate fluent, probable continuations of text, not to look up facts in a database. Left to its own training knowledge, it will sometimes fill a gap with something that sounds right instead of saying ''I don''t know.''

Grounding is the fix for this, and it is the core idea behind how Microsoft 365 Copilot differs from a plain chatbot. A grounded answer is tied to a specific, real source — a document in your SharePoint, an email in your mailbox, a live web search result — that Copilot retrieves and reasons over, rather than relying purely on patterns memorised during training. Grounded answers are far more reliable because they are anchored to something checkable, and well-designed Copilot experiences will often cite the specific source they drew from.

The working habit to build: when Copilot''s answer cites a specific document, email, or search result, your job is to spot-check that the citation says what Copilot claims it says. When an answer has no citation and concerns a specific fact, number, or name, treat it as a draft hypothesis to verify, not a finished fact.',
    array['Define hallucination precisely, not as a vague catch-all for ''wrong answer''','Explain what grounding is and how it reduces hallucination','Build a personal habit for verifying ungrounded claims'],
    array['Hallucination: a fluent but fabricated or unsupported statement','Grounding: tying an answer to a real, retrievable source instead of memorised patterns alone','Microsoft 365 Copilot''s advantage over a plain chatbot is largely its grounding in your actual data','Cited answers should be spot-checked; uncited factual claims should be treated as unverified'],
    'Find one answer Copilot gave you that included a citation to a document or search result. Open that source and confirm it actually supports the claim made.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'The Microsoft Copilot Product Map',
    '''Copilot'' is not one product — it is a family, and knowing which member you are using changes what to expect from it. Copilot Chat is the general-purpose conversational assistant: a secure baseline.',
    '''Copilot'' is not one product — it is a family, and knowing which member you are using changes what to expect from it. Copilot Chat is the general-purpose conversational assistant: a secure baseline AI chat experience available broadly across Microsoft''s ecosystem, useful for drafting, explaining, brainstorming, and general question-answering. Microsoft 365 Copilot builds on that same foundation but adds deep integration with your organisation''s own data through Microsoft Graph — your documents, emails, meetings, and chats — and is embedded directly inside Word, Excel, PowerPoint, Outlook, and Teams, where it can act on the file or message you currently have open.

Beyond those two, there is a wider family built for specific audiences: GitHub Copilot assists developers directly inside their code editor; Security Copilot assists security teams with investigation and response; and Copilot Studio is not a chat assistant at all but a low-code platform for building and deploying custom AI agents connected to an organisation''s own systems and data, which this program covers in depth later.

For most of the lessons ahead, you will be working with Copilot Chat and Microsoft 365 Copilot. Knowing the difference matters practically: if you need an answer grounded in a specific company document, the Microsoft 365-integrated experience inside that document''s app is usually the better starting point than a general chat window.',
    array['Distinguish Copilot Chat from Microsoft 365 Copilot','Identify where GitHub Copilot, Security Copilot, and Copilot Studio fit','Choose the right entry point for a given task'],
    array['Copilot Chat: general-purpose conversational assistant, broadly available','Microsoft 365 Copilot: adds Microsoft Graph grounding and in-app embedding across Word, Excel, PowerPoint, Outlook, Teams','GitHub Copilot, Security Copilot: audience-specific variants for developers and security teams','Copilot Studio: a platform for building custom agents, not a chat assistant itself'],
    'List the three Microsoft 365 apps you use most. For each, note one task where asking Copilot inside that specific app would likely beat asking a general chat window.',
    false, 'draft', 'hybrid'
  );

  -- ============================================================
  -- Course: Microsoft Copilot: Prompt Engineering Excellence  (slug: microsoft-copilot-prompt-engineering)
  -- ============================================================
  insert into public.courses
    (slug, title, subtitle, description, category, difficulty, icon, theme_color,
     sort_order, status, visibility, domain_id, outcomes, target_audience,
     prerequisites, skills_covered, estimated_hours, generation_mode)
  values (
    'microsoft-copilot-prompt-engineering',
    'Microsoft Copilot: Prompt Engineering Excellence',
    'Structured frameworks for getting reliably better answers out of Copilot',
    'A practical course in prompt engineering using four proven frameworks, plus the advanced techniques — chain-of-thought, prompt chaining — that separate casual users from power users.',
    'AI Tools', 'Beginner', '✍️', '#1A7F56',
    21, 'draft', 'public',
    v_domain_id,
    array['Apply RTF, RTCF, CARE, and RACE prompting frameworks appropriately','Write prompts that specify role, task, context, and format explicitly','Use chain-of-thought prompting for complex reasoning tasks','Chain multiple prompts together to complete multi-step work'],
    array['Knowledge workers','Managers','Anyone who uses Copilot regularly'],
    array['No prior Microsoft Copilot experience required for this course'],
    array['Apply RTF, RTCF, CARE, and RACE prompting frameworks appropriately','Write prompts that specify role, task, context, and format explicitly','Use chain-of-thought prompting for complex reasoning tasks','Chain multiple prompts together to complete multi-step work'],
    2.5, 'hybrid'
  ) returning course_id into v_course_id;

  -- ---- Module 1: Prompt Engineering Foundations ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 1, 'Prompt Engineering Foundations',
    'Why most disappointing Copilot answers are actually prompting problems, and the first two frameworks that fix that.',
    array['Diagnose under-specification as the root cause of most weak Copilot answers','Apply Role, Task, Format as a fast three-part prompt structure','Add Context as the fourth element that RTF lacks'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Why Most Bad Answers Are Prompting Problems',
    'When a Copilot answer disappoints, the instinctive reaction is to blame the AI. In practice, the far more common cause is under-specification: the prompt did not tell Copilot enough to produce a.',
    'When a Copilot answer disappoints, the instinctive reaction is to blame the AI. In practice, the far more common cause is under-specification: the prompt did not tell Copilot enough to produce a specific, useful answer, so it produced a generic, plausible-sounding one instead. Ask ''write a status update'' and you will get a bland template. Ask it with a defined role, audience, specific project facts, and a target length, and you get something close to usable on the first try.

A complete prompt generally specifies four things, even if briefly: who the AI should act as, what exactly it needs to do, what information it should ground its answer in, and what shape the output should take. This course spends its first two modules on frameworks that make all four easy to remember and apply quickly, because the goal is not to write long prompts — it is to write complete ones.

The frameworks that follow are not competing systems to memorise all at once. They are the same four underlying elements, packaged into different mnemonics suited to different situations. By the end of this course you will reach for whichever one fits fastest.',
    array['Diagnose under-specification as the root cause of most weak Copilot answers','Understand the anatomy of a complete prompt','Build the habit of specifying before asking'],
    array['Under-specification, not model limitation, explains most disappointing answers','A complete prompt specifies role, task, context, and format','Specificity, not length, is what makes a prompt effective','The frameworks ahead are variations on the same four elements'],
    'Take a one-line prompt you used recently and rewrite it to explicitly state a role, the exact task, relevant context, and the output format you wanted.',
    true, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'The RTF Framework',
    'RTF is the simplest of the frameworks in this course, and often the fastest to reach for on everyday tasks. Role tells Copilot what perspective or expertise to adopt — ''act as an experienced.',
    'RTF is the simplest of the frameworks in this course, and often the fastest to reach for on everyday tasks. Role tells Copilot what perspective or expertise to adopt — ''act as an experienced procurement negotiator'' changes the tone and substance of the output compared to no role at all. Task states precisely what you want done, using an action verb and a clear object: not ''help with this email'' but ''rewrite this email to be more concise and firmer in tone.'' Format specifies the shape of the answer: a bullet list, a three-paragraph memo, a table with named columns, a maximum word count.

RTF works best for self-contained tasks where the necessary information is either already obvious from the conversation or short enough to include inline. For a quick rewrite, a short explanation, or a simple draft, three clear instructions are usually all you need, and adding more structure than that just slows you down.

Where RTF falls short is on tasks that depend on background information Copilot would otherwise have to guess — your company''s specific situation, a document''s actual content, constraints that are not obvious from the task alone. That gap is exactly what the next lesson''s framework, RTCF, adds a fourth element to solve.',
    array['Apply Role, Task, Format as a fast three-part prompt structure','Recognise when RTF is sufficient versus when more context is needed','Practice RTF on a real work task'],
    array['Role: the perspective or expertise Copilot should adopt','Task: a precise instruction with an action verb and clear object','Format: the explicit shape of the output you want back','RTF suits quick, self-contained tasks; it has no slot for background context'],
    'Using RTF, ask Copilot to rewrite a paragraph from a recent email you sent, specifying a role, the exact task, and a format (e.g., ''no more than 60 words'').',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'The RTCF Framework',
    'RTCF takes the same Role, Task, and Format from the previous lesson and inserts Context between Task and Format — the background information Copilot needs to produce an answer specific to your actual.',
    'RTCF takes the same Role, Task, and Format from the previous lesson and inserts Context between Task and Format — the background information Copilot needs to produce an answer specific to your actual situation rather than a generic one. Context might be a pasted paragraph from a report, three bullet points about a client''s situation, or a sentence naming a constraint (''our budget is fixed, timeline is not''). The test for whether something belongs in Context is simple: would Copilot''s answer plausibly change if it knew this fact? If yes, include it; if the answer would be identical either way, leave it out.

This last point matters because more context is not automatically better. Irrelevant context dilutes the prompt and, in long documents, can push genuinely important details further from where the model is paying closest attention. Good context is curated, not exhaustive — the two or three facts that actually change what a good answer looks like.

RTCF is the framework to default to for most substantive business writing: it is complete without being heavy, and the explicit context slot forces you to articulate, before you even hit send, exactly what makes this particular request different from a generic one.',
    array['Add Context as the fourth element that RTF lacks','Decide what context is actually relevant versus what is noise','Apply RTCF to a task that depends on background information'],
    array['RTCF = Role, Task, Context, Format — RTF with background information added','Include context only if it would plausibly change the answer','Irrelevant context dilutes a prompt rather than improving it','RTCF is a strong default for substantive business writing'],
    'Write an RTCF prompt asking Copilot to draft a message to a colleague, including two specific context facts that would genuinely change what a good message says.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 2: Advanced Prompting Frameworks ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 2, 'Advanced Prompting Frameworks',
    'Two more frameworks for specific situations, plus the reasoning and chaining techniques that handle genuinely complex work.',
    array['Apply Context, Action, Result, Example as an outcome-first structure','Apply Role, Action, Context, Expectation as an outcome-oriented structure','Apply zero-shot, few-shot, and chain-of-thought prompting appropriately','Break a complex task into a sequence of smaller prompts'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'The CARE Framework',
    'CARE — Context, Action, Result, Example — leads with context rather than role, and adds a fourth element the earlier frameworks lack: a concrete example of the kind of output you want. Context sets.',
    'CARE — Context, Action, Result, Example — leads with context rather than role, and adds a fourth element the earlier frameworks lack: a concrete example of the kind of output you want. Context sets the scene, Action is the instruction, Result states the outcome you are aiming for (not just the task, but why it matters — ''so the client feels reassured, not alarmed''), and Example gives Copilot a real model to pattern-match against.

The Example element is CARE''s real strength. Describing a tone in words — ''professional but warm'' — is inherently fuzzy, and different people read that phrase differently. Pasting in one paragraph of writing that actually sounds the way you want is unambiguous: the model has something concrete to match rather than an adjective to interpret. This is especially valuable for recurring tasks like a particular report format or a house writing style.

Use CARE whenever you have, or can quickly produce, a genuine example of the output you want — a past email that landed well, a report section in the right style, a previous summary at the right level of detail. Without an example on hand, RTCF is usually the more efficient choice.',
    array['Apply Context, Action, Result, Example as an outcome-first structure','Use a worked example to anchor Copilot''s output style','Choose CARE over RTCF when a specific output model exists'],
    array['CARE = Context, Action, Result, Example','Result states the purpose behind the task, not just the task itself','A concrete writing example removes ambiguity that adjectives like ''professional'' leave open','CARE shines for recurring, style-sensitive writing tasks'],
    'Find one past email or document you were happy with. Use it as the Example in a CARE prompt asking Copilot to draft something new in the same style.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'The RACE Framework',
    'RACE — Role, Action, Context, Expectation — looks similar to RTCF at first glance, but the final element does different work. Format, in the earlier frameworks, specifies shape: a table, a bullet.',
    'RACE — Role, Action, Context, Expectation — looks similar to RTCF at first glance, but the final element does different work. Format, in the earlier frameworks, specifies shape: a table, a bullet list, a word count. Expectation specifies a quality bar or success condition: ''a board member with no technical background should understand this in one read,'' or ''this should survive a legal review without changes.'' Format controls what the output looks like; Expectation controls what the output has to achieve.

This distinction matters on tasks where the shape is obvious but the bar is not. A one-page executive summary is a familiar shape; what makes one good enough to actually send to your CEO is a judgement call that Expectation lets you state explicitly instead of leaving implicit. Stating the bar up front also gives Copilot a way to self-check: a well-grounded model can flag when a draft likely falls short of a stated expectation, rather than you discovering the gap after the fact.

RACE and RTCF overlap enough that picking between them is mostly a matter of which question you find yourself asking: ''what should this look like?'' points to Format and RTCF; ''what does this need to accomplish?'' points to Expectation and RACE.',
    array['Apply Role, Action, Context, Expectation as an outcome-oriented structure','Distinguish Expectation from Format','Choose RACE for tasks with a specific quality bar to hit'],
    array['RACE = Role, Action, Context, Expectation','Expectation specifies a quality bar or success condition, not a visual shape','Stating the bar explicitly lets Copilot self-check against it','Choose RACE when the output''s shape is obvious but the required standard is not'],
    'Write a RACE prompt for a document you need to produce this week, stating an explicit Expectation — who will judge it and what ''good enough'' means to them.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Advanced Prompt Engineering Techniques',
    'Beyond the four structural frameworks, a handful of techniques change how Copilot arrives at an answer rather than what information goes into the prompt. Zero-shot prompting is simply asking.',
    'Beyond the four structural frameworks, a handful of techniques change how Copilot arrives at an answer rather than what information goes into the prompt. Zero-shot prompting is simply asking directly, with no examples — fine for familiar, well-defined tasks. Few-shot prompting supplies one or more worked examples before the real request, which sharply improves consistency on tasks with a specific pattern, such as classifying support tickets into fixed categories.

Chain-of-thought prompting asks the model to reason step by step before giving a final answer — for example, ''walk through the trade-offs of each option, then recommend one.'' For tasks involving analysis, comparison, or multi-step logic, this reliably produces better-reasoned results than asking for the conclusion directly, because it forces the model to work through intermediate steps rather than jumping straight to a plausible-sounding answer. It also gives you, the reader, visibility into the reasoning so you can catch a flawed step before trusting the conclusion.

These techniques are not alternatives to RTCF or CARE — they are additions. A prompt can have a Role, Context, and Format, and also instruct the model to reason step by step before concluding. Combine them freely based on what the task actually needs.',
    array['Apply zero-shot, few-shot, and chain-of-thought prompting appropriately','Recognise when a task needs step-by-step reasoning instead of a direct answer','Combine techniques inside a single framework-based prompt'],
    array['Zero-shot: direct request, no examples — fine for familiar tasks','Few-shot: worked examples included, improves consistency on patterned tasks','Chain-of-thought: explicit step-by-step reasoning before the final answer','These techniques combine with, rather than replace, the structural frameworks'],
    'Take a decision you are currently weighing. Ask Copilot to reason through it step by step before recommending an option, and check whether you agree with each intermediate step.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Prompt Chaining and Agent-Style Thinking',
    'Some tasks are too large and too multi-step for a single prompt to handle well, however well-framed. Prompt chaining solves this by breaking the task into a sequence of smaller prompts, where each.',
    'Some tasks are too large and too multi-step for a single prompt to handle well, however well-framed. Prompt chaining solves this by breaking the task into a sequence of smaller prompts, where each step''s output deliberately becomes the next step''s input. Drafting a client proposal, for instance, works better as research the client''s situation, then outline the proposal structure, then draft each section against that outline, then review the whole draft against the original brief — four prompts, each focused and checkable, rather than one prompt asking for a finished proposal in a single pass.

The advantage is not just better output. Chaining gives you a natural checkpoint after every step, where you can correct course before the error compounds into the next stage. A flawed outline caught early is a thirty-second fix; a flawed outline discovered only after the full proposal is drafted means redoing most of the work.

This is also your first contact with how AI agents think, which this program covers in depth in its automation and agents course. An agent is, in essence, a system that runs a chain like this on its own — planning steps, executing them, and checking results — with a human defining the goal and the guardrails rather than typing every prompt by hand.',
    array['Break a complex task into a sequence of smaller prompts','Use the output of one prompt as the input to the next','Understand how this connects to the agent concepts covered later in the program'],
    array['Break large, multi-step tasks into a sequence of smaller, focused prompts','Each step''s output deliberately feeds into the next step''s input','Chaining creates natural checkpoints that catch errors before they compound','Agents automate this same chaining pattern with less manual prompting'],
    'Pick one task you would normally ask Copilot to do in a single prompt. Break it into three sequential prompts instead, and compare the result to your usual single-prompt approach.',
    false, 'draft', 'hybrid'
  );

  -- ============================================================
  -- Course: Microsoft 365 Copilot Mastery  (slug: microsoft-365-copilot-mastery)
  -- ============================================================
  insert into public.courses
    (slug, title, subtitle, description, category, difficulty, icon, theme_color,
     sort_order, status, visibility, domain_id, outcomes, target_audience,
     prerequisites, skills_covered, estimated_hours, generation_mode)
  values (
    'microsoft-365-copilot-mastery',
    'Microsoft 365 Copilot Mastery',
    'Copilot inside Word, Excel, PowerPoint, Outlook, Teams, and the apps around them',
    'App-by-app practical mastery of Microsoft 365 Copilot, covering what it does well in each app, where it needs supervision, and how the apps work together through Copilot Chat and enterprise search.',
    'Productivity & Tools', 'Beginner', '💼', '#0D7340',
    22, 'draft', 'public',
    v_domain_id,
    array['Use Copilot effectively inside Word, Excel, PowerPoint, Outlook, and Teams','Know which app''s Copilot to reach for a given task','Use OneNote, SharePoint, and OneDrive Copilot for knowledge work','Combine individual apps into one integrated, Copilot-assisted workflow'],
    array['Office professionals','Managers','Administrative staff'],
    array['No prior Microsoft Copilot experience required for this course'],
    array['Use Copilot effectively inside Word, Excel, PowerPoint, Outlook, and Teams','Know which app''s Copilot to reach for a given task','Use OneNote, SharePoint, and OneDrive Copilot for knowledge work','Combine individual apps into one integrated, Copilot-assisted workflow'],
    3.0, 'hybrid'
  ) returning course_id into v_course_id;

  -- ---- Module 1: Core Office Apps ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 1, 'Core Office Apps',
    'Copilot inside the five applications most people use every day.',
    array['Use Copilot to draft, restructure, and tighten documents in Word','Use Copilot for formula generation, data cleaning, and trend analysis in Excel','Generate a first-draft presentation structure from a document or outline','Use Copilot for email drafting, prioritisation, and meeting preparation','Use Copilot for meeting recaps and action item extraction'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Word Copilot Mastery',
    'Inside Word, Copilot can draft a document from a short brief, rewrite a selected passage in a different tone or length, summarise a long document into key points, and restructure disorganised notes.',
    'Inside Word, Copilot can draft a document from a short brief, rewrite a selected passage in a different tone or length, summarise a long document into key points, and restructure disorganised notes into a coherent report. The highest-value use is rarely ''write this whole document for me from nothing'' — it is drafting a strong first pass you then shape, or fixing a specific, well-defined problem in an existing draft: ''make this section more concise,'' ''rewrite this for a non-technical audience.''

The RTCF framework from the prompt engineering course applies directly: specify the document''s purpose and audience as Context, state the exact edit as Task, and give a Format constraint like a page limit or heading structure. Selecting the specific text you want changed, rather than describing it in words, also sharply improves accuracy — Copilot acts on what is selected with far more precision than on a description of where to find it.

Word Copilot is reliably strong at structure, tone, and clarity. It is not reliably strong at facts, figures, and claims specific to your business — those need the same verification habit from the foundations course applied before a document goes out the door.',
    array['Use Copilot to draft, restructure, and tighten documents in Word','Apply earlier prompting frameworks inside a document-editing context','Recognise where Word Copilot needs a human edit pass'],
    array['Best use: strong first drafts and well-defined edits, not whole documents from nothing','RTCF applies directly: purpose/audience as context, the edit as task, constraints as format','Selecting text beats describing it when asking for a specific change','Structure and tone are reliable; facts and figures still need human verification'],
    'Take a document you need to revise. Select one weak paragraph and ask Copilot to rewrite it for a stated audience and length, then compare it to a version where you only describe the paragraph in words.',
    true, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Excel Copilot Mastery',
    'In Excel, Copilot''s core strength is translating a plain-language description of what you want into a working formula or analysis step — ''show me month-over-month change as a percentage,'' ''flag any.',
    'In Excel, Copilot''s core strength is translating a plain-language description of what you want into a working formula or analysis step — ''show me month-over-month change as a percentage,'' ''flag any row where cost exceeds budget by more than ten percent.'' This removes the need to remember exact formula syntax for less common functions, and it is especially useful for identifying trends, anomalies, and patterns across a dataset that would take a long time to spot by eye.

The practical risk is specific to spreadsheets: a formula that returns a plausible-looking number is not the same as a formula that is doing what you actually meant. A single wrong cell reference or an off-by-one range error produces a number that looks completely normal and can go unnoticed for a long time, especially once it feeds into a chart or a report further downstream.

Treat every Copilot-generated formula the way you would treat a formula written by a colleague you trust but have not worked with before: check it against two or three rows you can verify by hand before applying it to the whole dataset, especially for anything that will inform a business decision.',
    array['Use Copilot for formula generation, data cleaning, and trend analysis in Excel','Describe data problems in plain language to get usable formulas','Verify Copilot-generated formulas before relying on them'],
    array['Describe the desired outcome in plain language rather than recalling exact formula syntax','Strong for trend-spotting and anomaly detection across large datasets','A plausible-looking number is not proof a formula is correct','Spot-check generated formulas against a few hand-verifiable rows before trusting them at scale'],
    'Ask Copilot in Excel to write a formula for a calculation you currently do manually. Verify its result against three rows you calculate by hand before using it on the full sheet.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'PowerPoint Copilot Mastery',
    'PowerPoint Copilot''s most reliable use is converting an existing document, outline, or set of notes into a draft slide structure — title suggestions, slide breaks, and bullet content pulled from.',
    'PowerPoint Copilot''s most reliable use is converting an existing document, outline, or set of notes into a draft slide structure — title suggestions, slide breaks, and bullet content pulled from source material you provide. This saves the blank-page problem entirely: rather than starting from an empty deck, you start from a structured first pass you then edit for your specific audience and occasion.

Beyond structure, Copilot can also help with narrative flow — asking it to review a draft deck for whether the story makes logical sense slide to slide, or whether a particular section needs a clearer transition, often catches weaknesses a solo author misses from being too close to the material. This works best as a distinct review step, separate from the initial drafting.

What still needs a human pass: the actual visual design judgement, and the comprehension test of standing in front of the deck and asking ''would this land with this specific audience?'' Copilot can produce clean, functional slides quickly; whether the argument is compelling to the people in the room is still your call to make.',
    array['Generate a first-draft presentation structure from a document or outline','Use Copilot to improve storytelling flow across slides','Apply a design and content review pass before presenting'],
    array['Strongest use: converting existing content into a first-draft slide structure','A separate review pass for narrative flow catches weaknesses the author is too close to see','Visual design judgement and audience fit remain a human responsibility','Treat the Copilot draft as a structured starting point, not a finished deck'],
    'Take a document or set of notes and ask Copilot to turn it into a draft slide outline. Then ask it separately to review the flow for logical gaps between slides.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Outlook Copilot Mastery',
    'Inside Outlook, Copilot can draft replies grounded in the actual thread it is replying to, summarise a long email chain into the key decisions and open questions, help triage an overflowing inbox by.',
    'Inside Outlook, Copilot can draft replies grounded in the actual thread it is replying to, summarise a long email chain into the key decisions and open questions, help triage an overflowing inbox by surfacing what needs action soonest, and prepare you for a meeting by pulling relevant recent correspondence with the people attending. Because it is grounded in your actual mailbox through Microsoft Graph, drafted replies can reference specific points raised earlier in the thread rather than responding generically.

The tone-matching capability is genuinely useful and also exactly where attention is needed: a draft that reads as professionally warm to Copilot might not match how you actually want to sound to this specific person, especially in a sensitive or high-stakes exchange. Treat every Copilot-drafted email, without exception, as a draft to read fully before sending — not because the drafts are usually bad, but because email is effectively irreversible once sent, and a few seconds of reading is cheap insurance against an expensive mistake.

Meeting preparation is an underused strength: asking Copilot to summarise your recent correspondence with specific attendees before a call takes a few seconds and regularly surfaces context worth remembering before you walk in.',
    array['Use Copilot for email drafting, prioritisation, and meeting preparation','Draft replies that match the tone and content of the original thread','Apply a final read before sending anything Copilot drafted'],
    array['Drafted replies are grounded in the actual email thread, not generic templates','Strong for inbox triage, thread summarisation, and pre-meeting context pulls','Tone-matching is useful but not infallible, especially for sensitive exchanges','Read every drafted email in full before sending — email is effectively irreversible'],
    'Before your next meeting, ask Copilot to summarise your recent email exchanges with the attendees. Note one piece of context it surfaced that you had forgotten.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    5, 'Teams Copilot Mastery',
    'Teams Copilot''s standout capability is meeting intelligence: with transcription enabled, it can produce a structured recap of a meeting — what was discussed, what was decided, and who owns what.',
    'Teams Copilot''s standout capability is meeting intelligence: with transcription enabled, it can produce a structured recap of a meeting — what was discussed, what was decided, and who owns what follow-up — and answer specific questions about a meeting you missed or joined late, such as ''what did we decide about the launch date?'' This alone can save meaningful time for anyone who sits in back-to-back meetings or needs to catch up after missing one.

The practical caution is specific to action items: Copilot extracts what it understood as a commitment from the conversation, but conversational speech is often vague about who exactly owns a task and by when. ''We should look into that'' might become an action item assigned to someone who was actually just thinking out loud. Treat the extracted action list as a strong starting draft for the actual meeting owner to confirm, not as the authoritative record on its own.

Beyond recaps, Copilot in Teams chat can also help draft messages and summarise long channel threads, extending the same grounding and tone-matching behaviour covered for Outlook into the chat context.',
    array['Use Copilot for meeting recaps and action item extraction','Catch up on a missed meeting efficiently using Copilot','Verify extracted action items against the actual discussion'],
    array['Meeting recap and ''what did I miss'' queries are Teams Copilot''s standout use case','Extracted action items should be confirmed by the meeting owner, not taken as final','Vague conversational commitments can be misattributed when turned into a task list','Chat summarisation and drafting extend the same grounding behaviour from Outlook'],
    'After your next meeting, review Copilot''s extracted action items against your own notes and correct any owner or deadline it got wrong.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 2: Knowledge and Collaboration Tools ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 2, 'Knowledge and Collaboration Tools',
    'OneNote, SharePoint, OneDrive, Copilot Chat, and how to work across all of Microsoft 365 as one integrated system.',
    array['Use Copilot to organise and extract value from scattered notes','Use Copilot for enterprise search across SharePoint document libraries','Use Copilot to search and summarise personal and shared files in OneDrive','Use Copilot Chat as a general-purpose assistant distinct from app-embedded Copilot','Combine multiple apps'' Copilot capabilities into one end-to-end workflow'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'OneNote Copilot Mastery',
    'OneNote tends to accumulate scattered, unstructured notes — meeting jottings, research fragments, half-formed ideas — faster than most people organise them. Copilot''s value here is turning that raw.',
    'OneNote tends to accumulate scattered, unstructured notes — meeting jottings, research fragments, half-formed ideas — faster than most people organise them. Copilot''s value here is turning that raw material into something usable on demand: asking it to pull together everything you have noted about a specific project, summarise a messy page of research notes into key findings, or convert a page of meeting notes into a clean action list.

This works best as a retrieval and synthesis tool rather than a note-taking replacement. The habit worth building is capturing quickly and messily during the actual meeting or research session — speed over neatness — and then using Copilot afterward to impose structure, rather than trying to write clean notes in real time while also paying attention to the conversation.

Because OneNote content can also be surfaced through Microsoft 365 Copilot''s broader search grounding, well-captured notes become retrievable later even through other apps, not just within OneNote itself — one more reason capturing consistently pays off beyond the immediate task.',
    array['Use Copilot to organise and extract value from scattered notes','Turn meeting and research notes into structured outputs','Build a lightweight personal knowledge capture habit'],
    array['Copilot excels at turning scattered notes into structured summaries on demand','Capture quickly and messily in the moment; use Copilot to impose structure afterward','Works as synthesis and retrieval, not as a replacement for the habit of taking notes','Well-captured OneNote content becomes retrievable through broader Microsoft 365 search'],
    'Pick a messy OneNote page of notes from a past meeting or research session. Ask Copilot to turn it into a one-paragraph summary plus a clean action list.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'SharePoint Copilot Mastery',
    'SharePoint is where much of an organisation''s institutional knowledge actually lives — policies, past project documentation, templates, team wikis. Copilot''s integration here turns that sprawling.',
    'SharePoint is where much of an organisation''s institutional knowledge actually lives — policies, past project documentation, templates, team wikis. Copilot''s integration here turns that sprawling library into something you can query directly: ''what''s our current policy on expense approvals,'' ''find the most recent version of the vendor onboarding checklist,'' without manually hunting through folder structures.

A detail worth understanding precisely because it affects what you will and will not see: Copilot respects the same permissions you already have. It will never surface a document you would not otherwise have access to, which is a deliberate and important security design, but it also means a ''Copilot couldn''t find that'' result sometimes means the document is access-restricted to you specifically, not that it does not exist.

This permission-aware retrieval is the same underlying mechanism this program''s automation and agents course later builds on for enterprise knowledge agents — a properly configured SharePoint-grounded Copilot experience is, in miniature, exactly what a company-wide knowledge assistant needs to work correctly and safely.',
    array['Use Copilot for enterprise search across SharePoint document libraries','Understand how permissions affect what Copilot can retrieve for you','Apply document grounding to answer questions about company knowledge'],
    array['SharePoint Copilot turns institutional document libraries into directly queryable knowledge','Retrieval always respects existing permissions — it never surfaces documents you cannot access','A failed search result may mean access restriction, not absence of the document','Permission-aware retrieval is the same foundation enterprise knowledge agents build on later'],
    'Ask Copilot a question about a company policy or process you believe is documented in SharePoint. If it cannot find an answer, check manually whether the gap is access or absence.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'OneDrive Copilot Mastery',
    'OneDrive grounding works similarly to SharePoint but centres on your personal and directly shared files rather than team-wide libraries: ''summarise the proposal I was working on last week,'' ''find the.',
    'OneDrive grounding works similarly to SharePoint but centres on your personal and directly shared files rather than team-wide libraries: ''summarise the proposal I was working on last week,'' ''find the spreadsheet someone shared with me about Q3 budget.'' For anyone juggling a large personal file collection, this removes a real amount of manual searching and remembering of exact file names or folder locations.

A practical use worth building into a regular habit is document triage: when a colleague shares a long file with you, asking Copilot for a quick summary before deciding whether it needs your full attention now or can wait saves the all-or-nothing choice between reading everything immediately or ignoring it entirely.

The distinction from SharePoint matters for expectations: SharePoint grounding reaches team and organisational content governed by site-level permissions, while OneDrive grounding is centred on your own personal space and what has been shared directly with you. Knowing which one to reach for — or asking a question broad enough that Copilot searches both — saves a failed search.',
    array['Use Copilot to search and summarise personal and shared files in OneDrive','Distinguish OneDrive''s personal-file grounding from SharePoint''s team-wide grounding','Apply file-level summarisation to speed up document triage'],
    array['OneDrive grounding centres on personal and directly shared files, not team-wide libraries','Quick summarisation on receipt is an effective document triage habit','SharePoint and OneDrive grounding are related but scoped differently','A broad enough question lets Copilot search across both where appropriate'],
    'Next time a colleague shares a long document with you, ask Copilot to summarise it in three sentences before deciding how much time it deserves right now.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Copilot Chat Mastery',
    'Copilot Chat is the standalone conversational entry point — useful when a task is not tied to a specific document or app, such as brainstorming, researching a general topic, explaining a concept, or.',
    'Copilot Chat is the standalone conversational entry point — useful when a task is not tied to a specific document or app, such as brainstorming, researching a general topic, explaining a concept, or drafting something from scratch with no existing file to ground it in. It is the most flexible member of the Copilot family precisely because it is not anchored to any one piece of content.

The practical decision rule from earlier in this course still applies here directly: if the task concerns a specific document, email, or meeting, the in-app Copilot embedded where that content lives will usually produce a better-grounded answer, because it has direct access to that content without you needing to paste it in. Reach for Copilot Chat when the task is genuinely general, or when you are still figuring out what you even need before committing to a specific document or app.

Everything from the prompt engineering course — RTCF, CARE, RACE, chain-of-thought reasoning — applies in Copilot Chat exactly as taught, since it is the same underlying capability without the app-specific grounding layered on top.',
    array['Use Copilot Chat as a general-purpose assistant distinct from app-embedded Copilot','Know when to use Copilot Chat versus an in-app Copilot experience','Apply earlier prompting frameworks in an open-ended chat context'],
    array['Copilot Chat is the flexible, general-purpose entry point not tied to a specific app or file','In-app Copilot usually wins for tasks tied to a specific document, email, or meeting','Use Copilot Chat for genuinely general tasks or early-stage thinking','All prompting frameworks from earlier in the program apply directly here'],
    'Think of one task this week that is not tied to a specific document. Work through it entirely in Copilot Chat using the RTCF framework.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    5, 'Integrated Workplace Productivity',
    'The real productivity gain from Microsoft 365 Copilot rarely comes from mastering one app in isolation — it comes from chaining the app-specific strengths covered in this module into one workflow. A.',
    'The real productivity gain from Microsoft 365 Copilot rarely comes from mastering one app in isolation — it comes from chaining the app-specific strengths covered in this module into one workflow. A realistic weekly example: Teams Copilot recaps Monday''s planning meeting, Outlook Copilot drafts follow-up emails grounded in that recap, Word Copilot turns the agreed plan into a one-page brief, and PowerPoint Copilot converts that brief into a short update deck for Friday''s review — four apps, each doing what it does best, connected by content flowing from one to the next.

Designing a workflow like this deliberately, rather than improvising app by app each time, is what separates someone who uses Copilot occasionally from someone who has genuinely restructured their work around it. Write down your own repeating weekly pattern — meetings, follow-ups, reports you produce regularly — and map which app''s Copilot handles which step.

The one discipline that does not disappear at any step in a chain like this: a human checkpoint at each handoff. A recap feeding a wrong fact into a follow-up email, which then feeds into a brief, which then feeds into a deck, compounds a small error across four documents instead of catching it once.',
    array['Combine multiple apps'' Copilot capabilities into one end-to-end workflow','Design a repeatable personal workflow using Copilot across apps','Recognise where handoffs between apps need a manual check'],
    array['The biggest productivity gain comes from chaining apps, not mastering one in isolation','Map a repeating weekly work pattern to specific Copilot capabilities deliberately','A human checkpoint at each handoff prevents a small error from compounding across documents','This chaining is the same underlying discipline as the prompt-chaining lesson earlier in the program'],
    'Map one of your own recurring weekly workflows across at least three Microsoft 365 apps, noting which Copilot capability handles each step and where you will manually check the handoff.',
    false, 'draft', 'hybrid'
  );

  -- ============================================================
  -- Course: Copilot for Business Functions  (slug: copilot-for-business-functions)
  -- ============================================================
  insert into public.courses
    (slug, title, subtitle, description, category, difficulty, icon, theme_color,
     sort_order, status, visibility, domain_id, outcomes, target_audience,
     prerequisites, skills_covered, estimated_hours, generation_mode)
  values (
    'copilot-for-business-functions',
    'Copilot for Business Functions',
    'Role-specific playbooks for executives, managers, and every core business function',
    'A function-by-function tour of how Copilot applies to the work of executives, managers, HR, finance, procurement, sales, marketing, customer support, and retail operations, closing with a cross-functional transformation project.',
    'AI Tools', 'Intermediate', '💼', '#0D183D',
    23, 'draft', 'public',
    v_domain_id,
    array['Apply Copilot to the specific demands of at least one core business function','Translate general prompting skill into function-specific use cases','Identify where AI assistance helps and where domain judgement must lead','Scope a cross-functional AI-assisted process improvement'],
    array['Managers','Business function specialists','Team leads'],
    array['No prior Microsoft Copilot experience required for this course'],
    array['Apply Copilot to the specific demands of at least one core business function','Translate general prompting skill into function-specific use cases','Identify where AI assistance helps and where domain judgement must lead','Scope a cross-functional AI-assisted process improvement'],
    3.5, 'hybrid'
  ) returning course_id into v_course_id;

  -- ---- Module 1: Leadership and Management ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 1, 'Leadership and Management',
    'Copilot for the people who set direction and run teams.',
    array['Use Copilot for briefing synthesis and decision support at executive speed','Apply Copilot to performance review drafting and team planning','Use Copilot for status reporting and risk identification'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Copilot for Executives',
    'Executive work runs on synthesis under time pressure — turning a stack of reports, emails, and meeting notes into a clear picture before a decision. Copilot''s grounding across Outlook, Teams, and.',
    'Executive work runs on synthesis under time pressure — turning a stack of reports, emails, and meeting notes into a clear picture before a decision. Copilot''s grounding across Outlook, Teams, and SharePoint makes it well suited to exactly this: ''summarise everything relevant to this decision from the last two weeks,'' ''draft talking points for the board on this topic,'' ''lay out the trade-offs between these two options.''

The chain-of-thought technique from the prompt engineering course earns its keep here specifically: asking Copilot to work through a scenario''s trade-offs explicitly, rather than jump to a recommendation, surfaces the reasoning you need to evaluate, not just a conclusion to accept or reject. A recommendation with visible reasoning is something you can actually interrogate.

The judgement that does not transfer to AI: organisational context the model was never told, political realities inside the specific company, and the accountability for the final call. Copilot can sharpen the thinking that goes into an executive decision. It cannot make the decision, and treating its output as a recommendation to be challenged, not a verdict to be accepted, is the correct posture at this level of stakes.',
    array['Use Copilot for briefing synthesis and decision support at executive speed','Apply chain-of-thought prompting to scenario and trade-off analysis','Maintain appropriate scepticism on strategic recommendations'],
    array['Strongest use: synthesis of scattered information into a clear picture under time pressure','Chain-of-thought prompting surfaces interrogable reasoning, not just a conclusion','Organisational and political context the model was never told cannot be assumed present','Treat output as a challengeable recommendation, never an accepted verdict'],
    'Take a decision you are currently weighing. Ask Copilot to lay out the trade-offs step by step, then identify one piece of context it could not have known that changes your read of its recommendation.',
    true, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Copilot for Managers',
    'Manager-level work that benefits most from Copilot tends to be structured but time-consuming: drafting a first pass of a performance review grounded in documented accomplishments and feedback.',
    'Manager-level work that benefits most from Copilot tends to be structured but time-consuming: drafting a first pass of a performance review grounded in documented accomplishments and feedback, building a team capacity plan against known project demands, or preparing talking points for a difficult but necessary conversation.

Performance reviews deserve particular care. Copilot can draft fluent, well-organised language from bullet points you provide, which saves real time on the writing itself. What it cannot do is actually judge a person''s performance — that assessment has to come from you, based on direct observation and context the AI does not have, with Copilot used purely to help express the judgement you have already formed, not to form it for you.

Capacity planning is a cleaner fit: feeding Copilot known project timelines, team size, and existing commitments to surface scheduling conflicts or capacity gaps is the kind of structured, data-grounded reasoning where AI assistance adds real speed with low risk, since the underlying facts, not a judgement call, drive the answer.',
    array['Apply Copilot to performance review drafting and team planning','Use Copilot for workforce and capacity planning scenarios','Preserve the human judgement performance decisions require'],
    array['Draft, don''t delegate, performance review language — the judgement must remain yours','Capacity planning is a strong, lower-risk fit given known facts and timelines','Copilot expresses a judgement you have already formed; it does not form the judgement','Difficult-conversation preparation benefits from the chain-of-thought technique'],
    'Draft bullet points capturing your genuine assessment of one team member''s recent work, then ask Copilot to turn those bullets into a structured review paragraph — checking the result still reflects your actual judgement.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Copilot for Project Managers',
    'Project management generates a constant stream of status updates, risk logs, and stakeholder communications — exactly the kind of recurring, structured writing Copilot handles well once grounded in.',
    'Project management generates a constant stream of status updates, risk logs, and stakeholder communications — exactly the kind of recurring, structured writing Copilot handles well once grounded in your actual project documentation and meeting history. Asking for a status report drafted from this week''s meeting recaps and task updates, or a plain-language summary of project risk for a non-technical stakeholder, both fit squarely within its strengths.

Teams Copilot''s meeting-recap capability from the earlier module becomes especially valuable here: a project manager sitting through multiple status meetings a day can use recaps to maintain an accurate running record without manually re-transcribing every discussion, freeing attention for actually managing the risks and blockers those meetings surface.

The caution from the Teams lesson applies with extra weight in project management: extracted action items and ownership assignments are a draft, not a system of record. A misattributed task owner in a project plan has real downstream consequences, so the actual project tracker should always reflect a human-confirmed record, not an AI-extracted one left unchecked.',
    array['Use Copilot for status reporting and risk identification','Apply meeting-recap integration to project tracking','Maintain accurate ownership and deadline records independent of AI extraction'],
    array['Status reporting and risk summarisation for stakeholders are strong, recurring use cases','Meeting recaps reduce manual transcription load across multiple status meetings','Extracted action items and owners must be human-confirmed before entering the project tracker','AI assistance speeds up communication; it does not replace the project record of truth'],
    'Draft this week''s status report using Copilot grounded in your actual meeting recaps, then compare its extracted action items against your project tracker for any mismatches.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 2: Core Business Functions ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 2, 'Core Business Functions',
    'HR, Finance, Procurement, Sales, and Marketing.',
    array['Use Copilot for job description drafting and interview preparation','Use Copilot for budget narrative drafting and variance explanation','Use Copilot for RFP drafting, vendor evaluation summaries, and spend analysis','Use Copilot for opportunity research and proposal drafting','Use Copilot for campaign ideation and content drafting'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Copilot for Human Resources',
    'HR work involves a high volume of structured, repeatable writing — job descriptions, interview question sets, onboarding materials, training plan outlines — where Copilot can produce strong first.',
    'HR work involves a high volume of structured, repeatable writing — job descriptions, interview question sets, onboarding materials, training plan outlines — where Copilot can produce strong first drafts quickly, especially when grounded in a past example of the kind of document the organisation already uses, following the CARE framework''s example-driven approach.

HR carries a distinct risk profile that deserves explicit attention: outputs touching hiring, evaluation, or any decision about a specific person''s employment sit closer to regulatory and fairness scrutiny than most other business writing. A generated interview question set or job description should be reviewed not just for quality but for compliance with employment law and your organisation''s own equity standards — AI-generated language can unintentionally introduce biased framing or requirements that are not actually job-relevant, and it will not flag this itself.

Training plan development is comparatively lower-risk and a strong fit: Copilot can structure a multi-week training outline from a set of learning objectives, which you then refine for your organisation''s specific context and delivery constraints.',
    array['Use Copilot for job description drafting and interview preparation','Apply Copilot to training plan development','Recognise fairness and compliance risks specific to HR use cases'],
    array['Strong for first drafts of job descriptions, interview questions, and training outlines','Hiring and evaluation outputs carry fairness and compliance risk that needs explicit human review','AI-generated language will not flag its own biased or non-job-relevant framing','Training plan structuring is a comparatively lower-risk, strong-fit use case'],
    'Draft a job description or interview question set with Copilot, then review it specifically for language that may not be strictly job-relevant before it goes further.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Copilot for Finance',
    'Finance work combines the Excel-based analysis covered earlier in this program with narrative writing — explaining a budget variance in plain language for a non-finance audience, drafting the.',
    'Finance work combines the Excel-based analysis covered earlier in this program with narrative writing — explaining a budget variance in plain language for a non-finance audience, drafting the commentary section of a financial report, or building a quick what-if forecast scenario. Copilot handles the narrative layer well once given the underlying numbers as context, turning a data table into a readable explanation of what changed and why.

The verification discipline from the Excel lesson applies here with the highest stakes in the entire program: a wrong number in a financial narrative, repeated confidently in a report that reaches decision-makers, is a materially different kind of error than a wrong word choice in an email. Every figure Copilot cites in financial writing should trace back to a source you can independently confirm, with no exceptions for numbers that ''look about right.''

What-if forecasting is a genuinely strong use case precisely because it is explicitly hypothetical: asking Copilot to model several growth-rate scenarios side by side is fast, low-risk exploration, since the output is clearly framed as a scenario rather than a reported fact.',
    array['Use Copilot for budget narrative drafting and variance explanation','Apply Excel Copilot skills to financial forecasting scenarios','Maintain independent verification of every generated figure'],
    array['Copilot writes strong narrative explanations once given verified underlying numbers','Financial-report figures must trace to an independently confirmable source, always','What-if scenario modelling is a strong, genuinely low-risk use case','Treat generated commentary as explanation of your numbers, not a source of new ones'],
    'Draft a one-paragraph variance explanation using Copilot grounded in your actual budget data, then independently trace every figure in the output back to its source.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Copilot for Procurement',
    'Procurement work spans structured documentation — RFPs, vendor scorecards, contract summaries — and judgement-heavy work like negotiation strategy and supplier risk assessment, both of which benefit.',
    'Procurement work spans structured documentation — RFPs, vendor scorecards, contract summaries — and judgement-heavy work like negotiation strategy and supplier risk assessment, both of which benefit from different sides of what this program has taught so far. RFP and vendor evaluation templates are a strong CARE-framework fit: provide a past well-regarded RFP as the example, and Copilot can draft a new one against your current requirements quickly.

Negotiation preparation is where chain-of-thought prompting earns its place: asking Copilot to work through a vendor''s likely position, your own BATNA, and possible concession sequences step by step produces a far more useful prep document than asking directly for ''negotiation tips.'' This mirrors the executive-level decision support pattern from earlier in this course, applied to a procurement-specific scenario.

Spend analysis across large supplier datasets benefits from the same Excel Copilot techniques covered earlier — trend detection, anomaly flagging — applied to spend and contract data specifically. As with finance, any number feeding into an actual negotiating position or spend commitment needs independent verification before you rely on it in the room.',
    array['Use Copilot for RFP drafting, vendor evaluation summaries, and spend analysis','Apply negotiation preparation techniques using chain-of-thought prompting','Maintain procurement policy and conflict-of-interest discipline'],
    array['RFP and vendor-evaluation drafting is a strong fit using the CARE framework with a real example','Chain-of-thought prompting produces usable negotiation prep, not generic tips','Spend analysis reuses the Excel Copilot trend and anomaly techniques from earlier in the program','Any figure feeding a negotiating position needs independent verification before use'],
    'Use chain-of-thought prompting to prepare for an upcoming vendor conversation: ask Copilot to reason through the vendor''s likely position, your BATNA, and a concession sequence.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Copilot for Sales',
    'Sales work rewards speed and personalisation in roughly equal measure, and Copilot helps with both: researching a prospect''s public information before a call, drafting a proposal grounded in a past.',
    'Sales work rewards speed and personalisation in roughly equal measure, and Copilot helps with both: researching a prospect''s public information before a call, drafting a proposal grounded in a past winning proposal as a CARE-framework example, and writing follow-up emails grounded in the actual conversation history from Outlook, the same grounded-reply capability covered in the Outlook lesson.

The genuine risk in sales use is authenticity drift at scale: it is tempting to use AI drafting to personalise outreach to a much larger list than before, but a prospect who senses a formulaic AI-generated message, even a competently written one, often reacts worse than to an honest, shorter, more generic one. The speed Copilot provides should go toward making genuinely relevant outreach to fewer, better-targeted prospects, not toward mass-personalising outreach to everyone.

Opportunity research benefits from the same verification discipline as every other lesson in this course: a confidently stated ''fact'' about a prospect company should be checked before it appears in a conversation with that prospect, where being wrong costs credibility in the room.',
    array['Use Copilot for opportunity research and proposal drafting','Apply grounded email drafting to sales follow-up','Balance personalisation speed against authenticity'],
    array['Proposal and follow-up drafting both benefit from grounding in real past examples and real threads','Scaling AI-personalised outreach to more prospects often backfires versus fewer, better-targeted messages','Prospects can sense formulaic AI output even when it is well-written','Prospect research claims should be verified before use in an actual sales conversation'],
    'Draft a follow-up email to a real prospect grounded in your actual email thread, then read it back and ask whether it reads as genuinely specific to that person or as a template.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    5, 'Copilot for Marketing',
    'Marketing work spans ideation, drafting, and analysis, and Copilot contributes differently to each. For ideation — campaign angles, headline options, content calendar themes — its value is breadth.',
    'Marketing work spans ideation, drafting, and analysis, and Copilot contributes differently to each. For ideation — campaign angles, headline options, content calendar themes — its value is breadth: generating a wide set of directions quickly for you to narrow down, rather than producing one polished answer immediately.

For drafting actual marketing copy, brand voice consistency is the central challenge, and the CARE framework''s example element is the direct answer: feeding Copilot genuine examples of your brand''s existing, approved copy as the Example anchors its output to your actual voice far more reliably than describing that voice in adjectives. Without a real example, generated copy tends to drift toward generic marketing language that could belong to any brand.

Competitive and market analysis is a strong research-synthesis use case, consistent with the general pattern throughout this course: Copilot accelerates gathering and organising publicly available information, while the actual strategic read on what that information means for your positioning remains a judgement call that depends on context the AI was never given.',
    array['Use Copilot for campaign ideation and content drafting','Apply Copilot to competitive and market analysis','Maintain brand voice consistency using the CARE framework'],
    array['Ideation benefits from breadth — many quick directions to narrow down, not one final answer','Brand voice consistency depends on feeding Copilot real examples via the CARE framework','Without a genuine example, generated copy drifts toward generic, brand-agnostic language','Strategic interpretation of competitive research remains a human judgement call'],
    'Draft a piece of marketing copy using a genuine example of your brand''s existing approved copy as the CARE framework''s Example, then compare it to a version drafted without that example.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 3: Customer-Facing and Transformation ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 3, 'Customer-Facing and Transformation',
    'Customer support, retail operations, and bringing it all together across functions.',
    array['Use Copilot for response drafting and knowledge base search','Use Copilot for store performance analysis and KPI tracking','Identify a manual, cross-functional process suitable for AI-assisted redesign','Consolidate the function-specific techniques covered across this course'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Copilot for Customer Support',
    'Customer support work is high-volume and repetitive in structure even when each case differs in detail, which makes it a strong fit for Copilot: drafting a response grounded in the specific ticket.',
    'Customer support work is high-volume and repetitive in structure even when each case differs in detail, which makes it a strong fit for Copilot: drafting a response grounded in the specific ticket and relevant knowledge base articles, summarising a long or multi-agent ticket history for a clean handoff to another team member, and surfacing the right internal documentation for an unfamiliar issue quickly.

Accuracy discipline matters more here than in almost any other function in this course, because the output goes directly to an external customer with no internal review layer in most high-volume support environments. A hallucinated product capability or an incorrect policy statement reaching a customer is not a private drafting error — it is a promise the company now has to either honour or walk back. Grounding every drafted response explicitly in a specific, current knowledge base article, rather than the model''s general training knowledge, is the control that keeps this risk manageable.

Ticket summarisation for internal handoffs carries much lower stakes, since the audience is another team member who can ask follow-up questions, making it one of the safest and highest-value entry points for support teams adopting Copilot.',
    array['Use Copilot for response drafting and knowledge base search','Apply ticket summarisation for faster handoffs','Maintain accuracy discipline for customer-facing claims'],
    array['Response drafting should be grounded in specific, current knowledge base articles, not general knowledge','Customer-facing hallucinations become promises the company must honour or walk back','Ticket summarisation for internal handoffs is a safe, high-value starting use case','External-facing output deserves the highest accuracy discipline in this entire course'],
    'Draft a response to a real support scenario using Copilot grounded explicitly in a specific knowledge base article, then verify every factual claim against that article before it would be sent.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Copilot for Retail Operations',
    'Retail operations generates constant structured data — store-level sales, footfall, conversion rates, field team visit reports — and Copilot''s combined strength in Excel analysis and narrative.',
    'Retail operations generates constant structured data — store-level sales, footfall, conversion rates, field team visit reports — and Copilot''s combined strength in Excel analysis and narrative writing applies directly: identifying underperforming stores against a defined benchmark, turning raw KPI tables into a readable weekly performance narrative for regional leadership, and summarising field team visit notes into a consistent audit format.

Market coverage and field reporting benefit particularly from the OneNote and SharePoint techniques covered earlier: field teams often capture notes quickly and messily on the ground, and Copilot''s synthesis capability turns that raw material into the structured report regional management actually needs, without requiring field staff to spend their limited time formatting rather than observing.

As with finance, every number that reaches a performance review or a resourcing decision needs independent verification against the source system. Retail KPI data in particular often has known quirks — a store temporarily closed for renovation, a data feed delay — that an AI summarising the raw numbers has no way to know about unless you tell it.',
    array['Use Copilot for store performance analysis and KPI tracking','Apply field team and market coverage reporting with AI assistance','Combine Excel and narrative Copilot skills for retail audit automation'],
    array['Combines Excel analysis and narrative drafting for store performance reporting','Field team notes captured quickly on the ground become structured reports through Copilot synthesis','Retail KPI data often has known quirks the model cannot infer — context must be supplied','Numbers feeding performance or resourcing decisions still need source-system verification'],
    'Turn a set of raw store performance numbers into a short narrative update using Copilot, explicitly flagging any known data quirks (closures, delays) in your prompt before asking for the summary.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Cross-Functional Business Transformation',
    'Every function covered in this course so far has been treated mostly in isolation. Real business processes rarely are — a vendor onboarding, for instance, touches procurement, finance, legal, and.',
    'Every function covered in this course so far has been treated mostly in isolation. Real business processes rarely are — a vendor onboarding, for instance, touches procurement, finance, legal, and operations in sequence, with each function''s output becoming the next function''s input, exactly the chaining pattern from the prompt engineering course, just at organisational scale.

Identifying a good candidate process for this kind of redesign means looking for three things: it is manual and repeatable today, it crosses at least two functional handoffs, and the information needed at each step already exists somewhere Copilot can be grounded in — a shared SharePoint site, a common set of documents, a defined approval chain. A process that depends heavily on undocumented tribal knowledge is a poor first candidate no matter how manual it is.

This lesson''s capstone exercise is the bridge to this program''s automation course, which covers how to turn a mapped, multi-step process like this into an actual Power Automate workflow or Copilot Studio agent rather than a set of prompts you run by hand each time. Here, the goal is simply to map the process and its handoffs clearly enough that automating it later becomes a mechanical step, not a fresh discovery exercise.',
    array['Identify a manual, cross-functional process suitable for AI-assisted redesign','Apply prompt chaining across multiple functions'' handoff points','Scope a transformation project with realistic human checkpoints'],
    array['Cross-functional processes apply the prompt-chaining pattern at organisational scale','Good redesign candidates are manual, repeatable, cross-functional, and already documented somewhere','Processes relying on undocumented tribal knowledge are poor first candidates','Clear process mapping here becomes the direct input to automation work covered later in the program'],
    'Map one cross-functional process in your organisation end to end, noting every handoff point and where the needed information currently lives.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Professional Excellence: Review and Certification Readiness',
    'This closing lesson is a deliberate pause rather than new material. Across eleven chapters, this course has applied the same core techniques from earlier in the program — RTCF and CARE framing.',
    'This closing lesson is a deliberate pause rather than new material. Across eleven chapters, this course has applied the same core techniques from earlier in the program — RTCF and CARE framing, chain-of-thought reasoning, grounded retrieval, verification discipline — to eleven different business functions. The pattern that should be clear by now: the underlying skill does not change function to function, but where the risk concentrates does. HR concentrates risk in fairness and compliance; finance and retail concentrate it in figures reaching a decision; customer support concentrates it in claims reaching an external party with no review layer.

Before moving to the next course, it is worth honestly assessing which function''s chapter actually applies to your own role, and re-reading that one chapter closely rather than treating all eleven as equally relevant to practise. Depth in the one or two functions you actually work in matters more than shallow familiarity with all of them.

This course''s assessment, covered separately, checks exactly this: not whether you can recite each function''s use cases, but whether you can correctly identify where the risk concentrates in a given scenario and respond with the appropriate verification discipline.',
    array['Consolidate the function-specific techniques covered across this course','Self-assess readiness against the course''s stated outcomes','Identify which function-specific chapter to revisit before assessment'],
    array['The same core techniques apply across functions; what changes is where risk concentrates','HR risk concentrates in fairness/compliance, finance/retail in figures, support in external claims','Depth in your own function matters more than shallow familiarity with all eleven','Assessment focuses on recognising risk concentration and applying the right verification response'],
    'Identify the one chapter in this course most relevant to your actual role and re-read it once more, specifically noting its verification discipline before moving to the next course.',
    false, 'draft', 'hybrid'
  );

  -- ============================================================
  -- Course: Copilot: Automation and Agentic AI  (slug: copilot-automation-and-agentic-ai)
  -- ============================================================
  insert into public.courses
    (slug, title, subtitle, description, category, difficulty, icon, theme_color,
     sort_order, status, visibility, domain_id, outcomes, target_audience,
     prerequisites, skills_covered, estimated_hours, generation_mode)
  values (
    'copilot-automation-and-agentic-ai',
    'Copilot: Automation and Agentic AI',
    'From automated flows to custom agents that act on your behalf',
    'Moves beyond conversational Copilot into automation and agent-building: Power Automate fundamentals, designing and publishing custom agents in Copilot Studio, and the orchestration and governance questions that come with running agents at enterprise scale.',
    'AI Tools', 'Intermediate', '🤖', '#5C2D91',
    24, 'draft', 'public',
    v_domain_id,
    array['Build and troubleshoot a basic automated flow in Power Automate','Design a custom agent topic in Copilot Studio from trigger to action','Connect an agent to real data sources and business actions','Evaluate multi-agent orchestration and governance trade-offs before scaling'],
    array['Power users','Business analysts','IT and automation teams'],
    array['No prior Microsoft Copilot experience required for this course'],
    array['Build and troubleshoot a basic automated flow in Power Automate','Design a custom agent topic in Copilot Studio from trigger to action','Connect an agent to real data sources and business actions','Evaluate multi-agent orchestration and governance trade-offs before scaling'],
    3.5, 'hybrid'
  ) returning course_id into v_course_id;

  -- ---- Module 1: Automation Foundations ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 1, 'Automation Foundations',
    'What automation means inside the Copilot ecosystem, and how to build your first flow.',
    array['Distinguish conversational Copilot assistance from automated, trigger-based workflows','Explain the trigger-condition-action structure of a Power Automate flow','Create a simple automated flow from a trigger template','Explain what a connector is and how it authenticates to a target system','Configure a multi-branch condition using switch logic'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Understanding Automation in the Copilot Ecosystem',
    'Everything covered so far has been reactive: you ask, Copilot answers. Automation flips that relationship — a flow runs when something happens, whether or not anyone is watching. An email arriving, a.',
    'Everything covered so far has been reactive: you ask, Copilot answers. Automation flips that relationship — a flow runs when something happens, whether or not anyone is watching. An email arriving, a file landing in a folder, a form being submitted, a scheduled time of day: each can trigger a sequence of steps that runs unattended. This is the difference between asking Copilot to draft a status update and having a flow that assembles and sends that update automatically every Friday afternoon.

Microsoft''s automation stack has three layers that matter for this course. Power Automate handles trigger-and-action workflows across hundreds of connectors — the plumbing. Copilot Studio builds conversational agents that can call those same actions in response to natural language, not just a fixed trigger. And Copilot itself, inside Microsoft 365 apps, increasingly offers ''automate this'' shortcuts that quietly generate a Power Automate flow behind a familiar conversational request, so the line between the layers is already blurring for end users.

Not every repetitive task deserves automation. The best candidates share three traits: the trigger condition is unambiguous (a specific event, not a judgement call), the steps are stable rather than constantly changing, and the cost of an occasional wrong run is low. A task that requires nuanced human judgement at every step is a poor automation candidate no matter how repetitive it feels — automate the mechanical parts around that judgement instead.',
    array['Distinguish conversational Copilot assistance from automated, trigger-based workflows','Identify the Microsoft automation stack and where each piece fits','Recognise which repetitive tasks are good automation candidates'],
    array['Automation is trigger-based and unattended; conversational Copilot is reactive and attended','Power Automate (workflows), Copilot Studio (agents), and in-app Copilot shortcuts form one stack','Good candidates: unambiguous triggers, stable steps, low cost of an occasional wrong run','Automate the mechanical steps around a judgement call, not the judgement call itself'],
    'List three repetitive tasks in your own work. For each, score it against the three automation-candidate traits and decide which one is worth automating first.',
    true, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Power Automate Fundamentals for Copilot Users',
    'Every Power Automate flow follows the same grammar: a trigger starts it, optional conditions branch it, and one or more actions carry it out. ''When a new email arrives with attachment (trigger), if.',
    'Every Power Automate flow follows the same grammar: a trigger starts it, optional conditions branch it, and one or more actions carry it out. ''When a new email arrives with attachment (trigger), if the sender is on a known vendor list (condition), save the attachment to a SharePoint folder and notify the finance channel (actions)'' is a complete flow description in one sentence, and that sentence-level thinking is the right way to plan any flow before opening the builder.

Three flow types cover most business needs. Automated flows run on a trigger event, exactly as above. Scheduled flows run on a timer regardless of any external event — a nightly data pull, a weekly report. Instant flows run when a person manually starts them, often from a button in Teams or a mobile app, which suits tasks that need automation''s consistency but a human''s decision about when to run.

The Power Automate interface organises a flow as a vertical sequence of cards, each representing one trigger or action, with its own configurable inputs drawn from the previous step''s outputs. Opening an existing flow and reading it top to bottom — what triggers it, what data flows between cards, where it branches — is the fastest way to learn the tool, faster than building one from a blank canvas on day one.',
    array['Explain the trigger-condition-action structure of a Power Automate flow','Identify the main flow types and when each applies','Navigate the Power Automate interface to inspect an existing flow'],
    array['Every flow follows trigger → condition → action, and that sentence should exist before you build','Automated flows react to events, scheduled flows run on a timer, instant flows run on demand','The builder represents a flow as a vertical sequence of cards with connected inputs/outputs','Reading an existing flow top to bottom is the fastest way to learn the tool''s logic'],
    'Find one existing flow in your organisation''s Power Automate environment (or a template in the gallery) and write out its trigger, conditions, and actions in one plain-language sentence.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Building Your First Automated Flow',
    'The fastest path to a working first flow is starting from a template rather than a blank canvas. Power Automate''s template gallery has hundreds of pre-built starting points — ''notify me when I.',
    'The fastest path to a working first flow is starting from a template rather than a blank canvas. Power Automate''s template gallery has hundreds of pre-built starting points — ''notify me when I receive an email from my boss,'' ''save Teams message attachments to SharePoint'' — that already have the trigger and basic actions wired up, leaving you to adjust the specific conditions and recipients rather than assemble the structure from nothing.

A practical first build: a flow triggered by a new item in a SharePoint list, with a condition checking a status field, and an action that posts a Teams channel message when the condition is met. Configuring the condition is usually the trickiest part for newcomers — it requires picking the exact field from the dynamic content list (the outputs of the trigger step) rather than typing a value by hand, since the flow needs a live reference to the data, not a static guess at what it might contain.

Every flow run is logged in its run history, showing each step''s inputs, outputs, and success or failure status. When a flow does not behave as expected, the run history is the first and usually only place you need to look: a failed step shows the exact error and the data it received, which almost always points directly at a misconfigured condition or a missing permission rather than a mysterious platform fault.',
    array['Create a simple automated flow from a trigger template','Configure a condition and a notification action','Test and troubleshoot a flow run using the run history'],
    array['Start from a template rather than a blank canvas for your first several flows','Conditions should reference dynamic content from prior steps, not typed-in static values','Run history logs every step''s inputs, outputs, and success/failure for every run','Most flow failures trace to a misconfigured condition or a missing connector permission'],
    'Build a flow from a template that notifies you in Teams when a condition is met on a SharePoint list or email trigger. Run it once and read the run history for that execution.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Connecting Copilot to Business Applications',
    'A connector is Power Automate''s bridge to a specific application or service — SharePoint, Outlook, Salesforce, SAP, a SQL database, hundreds more — handling the authentication and API translation so.',
    'A connector is Power Automate''s bridge to a specific application or service — SharePoint, Outlook, Salesforce, SAP, a SQL database, hundreds more — handling the authentication and API translation so a flow can read from or write to that system without anyone writing integration code. Connecting a flow to a new application for the first time usually means signing in once to establish a connection, which the flow then reuses for every subsequent run.

Connectors split into standard (included in standard Microsoft 365 licensing — SharePoint, Outlook, Teams, Excel) and premium (requiring additional Power Automate licensing — Salesforce, SAP, most third-party line-of-business systems, and some advanced Microsoft connectors). Checking a connector''s licensing tier before building a flow around it avoids the common disappointment of a finished flow that cannot actually run in production without a license purchase.

The genuinely powerful pattern is cross-application flows: a new record in a CRM triggers a flow that creates a project folder in SharePoint, adds a task in Planner, and posts a summary to a Teams channel — three applications updated consistently from one event, with no manual re-entry of the same information three times. This is where automation''s time savings compound fastest, because manual cross-application busywork is exactly what humans are worst at doing reliably.',
    array['Explain what a connector is and how it authenticates to a target system','Identify premium versus standard connectors and the licensing implication','Plan a flow that moves data between two different business applications'],
    array['A connector handles authentication and API translation to a specific target application','Standard connectors are included in M365 licensing; premium connectors need additional licensing','Check a connector''s licensing tier before building production flows around it','Cross-application flows eliminate manual re-entry of the same data across systems'],
    'Identify two business applications your team uses that currently require manual data re-entry between them. Check whether connectors exist for both and sketch the flow that would link them.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    5, 'Automation Triggers, Conditions, and Approvals',
    'Real flows rarely need just one yes/no condition. A switch action evaluates a single value against several possible cases — an expense category, a ticket priority, a request type — and routes the.',
    'Real flows rarely need just one yes/no condition. A switch action evaluates a single value against several possible cases — an expense category, a ticket priority, a request type — and routes the flow down a different branch for each, which is both easier to read and easier to maintain than nesting several if/else conditions inside each other.

Approvals are Power Automate''s built-in mechanism for inserting a human checkpoint into an otherwise automated flow. An approval action pauses the flow, sends a request to a named approver (in Teams, email, or a mobile app), and only continues once that person responds approve or reject — turning ''the AI decided'' into ''the AI prepared the decision and a named person authorised it,'' which matters enormously for anything with financial, legal, or reputational consequence.

The judgement call is where to put that checkpoint. A flow that files an expense report under a threshold can run fully autonomously; one above a threshold, or touching a sensitive data category, should pause for approval. The general principle from earlier in this course applies again here: automate the mechanical steps, keep a human in the loop for the decision that carries real consequence, and make that handoff explicit in the flow design rather than leaving it to chance.',
    array['Configure a multi-branch condition using switch logic','Add a human approval step to a flow for higher-stakes actions','Decide when a flow should pause for a human versus run fully autonomously'],
    array['Switch actions route a flow down multiple branches from one value, clearer than nested conditions','An approval action pauses a flow and requires a named person''s explicit approve/reject','Approvals convert ''the AI decided'' into ''the AI prepared, a named person authorised''','Set approval thresholds deliberately based on financial, legal, or reputational stakes'],
    'Take the cross-application flow you sketched in the previous lesson. Identify the point in it, if any, where a human approval step belongs, and state the threshold that should trigger it.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 2: Copilot Studio and Agent Design ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 2, 'Copilot Studio and Agent Design',
    'Building conversational agents that go beyond fixed flows to handle open-ended requests.',
    array['Explain how a Copilot Studio agent differs from a Power Automate flow','Write effective trigger phrases that generalise beyond their exact wording','Add a knowledge source to ground an agent''s answers in real content','Use the test pane to validate topics before publishing'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Introduction to Copilot Studio',
    'A Power Automate flow runs a fixed sequence once triggered. A Copilot Studio agent instead holds a conversation: it interprets what a person is asking in natural language, figures out which of its.',
    'A Power Automate flow runs a fixed sequence once triggered. A Copilot Studio agent instead holds a conversation: it interprets what a person is asking in natural language, figures out which of its configured capabilities applies, asks clarifying questions when information is missing, and then calls the relevant action — which might itself be a Power Automate flow running behind the scenes. The agent is the conversational front end; flows and connectors remain the plumbing underneath.

Three building blocks define an agent. Topics are the distinct things it can help with — ''check order status,'' ''reset a password,'' ''book a meeting room'' — each with its own trigger phrases and conversation logic. Entities are the pieces of information the agent needs to extract from what someone says — an order number, a date, a room name. Actions are what the agent actually does once it has enough information — typically a call out to a flow, a connector, or a knowledge source.

Agents earn their complexity on problems that are frequent, conversational, and vary in phrasing but not in underlying structure: the hundredth person asking about order status phrases it differently every time, but the underlying need and the correct response pattern are identical. A fixed flow handles the single, well-defined trigger; an agent handles the many ways people actually ask for that same thing.',
    array['Explain how a Copilot Studio agent differs from a Power Automate flow','Identify the core building blocks of an agent: topics, entities, and actions','Recognise the kinds of problems agents solve better than flows or chat alone'],
    array['An agent interprets open-ended natural language; a flow runs a fixed, triggered sequence','Topics define what the agent can help with; entities are the data it extracts; actions are what it does','Agent actions typically call out to the same flows and connectors used in Power Automate','Agents suit frequent, conversational requests with varied phrasing but consistent underlying structure'],
    'Pick a question your team answers repeatedly in Teams or email, phrased differently each time. Write out the topic name, two likely trigger phrases, and the entity the agent would need to extract.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Designing Conversational Topics and Triggers',
    'Trigger phrases teach an agent what a topic sounds like, not a literal script it waits to hear verbatim — the underlying language model generalises from the examples you give to cover similar.',
    'Trigger phrases teach an agent what a topic sounds like, not a literal script it waits to hear verbatim — the underlying language model generalises from the examples you give to cover similar phrasing it has never seen. Giving five to ten varied examples per topic, covering different levels of formality and different ways people naturally phrase the same need, produces far better coverage than one or two carefully worded ''ideal'' phrases.

A well-structured topic conversation moves from recognising the intent, to collecting any missing required information through clarifying questions, to confirming that information back before acting on it. An agent that books a meeting room without ever confirming the date and room it understood is an agent that will occasionally book the wrong one silently — a brief confirmation step costs one extra conversational turn and prevents a much more annoying correction later.

Topic overlap is the most common source of a confusing agent: two topics with similar trigger phrases compete for the same user utterance, and the agent picks unpredictably between them. The fix is either to merge genuinely overlapping topics into one with internal branching, or to sharpen each topic''s trigger phrases to emphasise what makes it distinct, then testing with ambiguous phrasing deliberately to confirm the agent now resolves it consistently.',
    array['Write effective trigger phrases that generalise beyond their exact wording','Structure a topic''s conversation flow including clarifying questions','Identify and resolve overlap between similar topics'],
    array['Trigger phrases teach a pattern for the model to generalise from, not a literal script','Provide five to ten varied example phrases per topic rather than one or two exact ones','Structure topics to recognise intent, collect missing information, then confirm before acting','Resolve topic overlap by merging similar topics or sharpening distinguishing trigger phrases'],
    'Draft eight varied trigger phrases for one topic from the previous lesson, ranging from formal to casual phrasing, and add a confirmation step before the action in the conversation flow.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Connecting Agents to Data and Actions',
    'An agent with no connected data can only generate plausible-sounding answers from its underlying model — useful for general conversation, risky for anything requiring accuracy. Adding a knowledge.',
    'An agent with no connected data can only generate plausible-sounding answers from its underlying model — useful for general conversation, risky for anything requiring accuracy. Adding a knowledge source — a SharePoint site, a set of documents, a public website, a structured database — lets the agent ground its answers in that specific content instead, the same grounding principle from the hallucination lesson earlier in this course applied at the agent-building level.

Connecting an action means wiring a topic to an underlying Power Automate flow: the entities the agent collected from the conversation (an order number, a date) map to the flow''s input parameters, the flow runs, and its output maps back into what the agent says next. This is the exact point where the conversational layer and the automation layer from the previous module meet — everything learned about building reliable flows applies directly to the actions an agent calls.

A well-designed agent usually mixes both modes deliberately: generative responses for open-ended questions where some flexibility is fine, and strict action-based responses for anything transactional or factual, where the agent should retrieve or act rather than generate. Being explicit in the design about which topics are which prevents an agent from generating a confident-sounding but fabricated answer to a question it should instead have looked up.',
    array['Add a knowledge source to ground an agent''s answers in real content','Connect a topic''s action to a Power Automate flow with input and output mapping','Distinguish generative answers from action-based answers within one agent'],
    array['An ungrounded agent generates plausible answers from its base model, with real hallucination risk','Knowledge sources ground agent answers in specific documents, sites, or databases','Actions map conversation entities to flow inputs, and flow outputs back into the response','Deliberately separate generative topics from strict action-based or retrieval-based topics'],
    'For the topic you have been designing, decide explicitly whether it should be generative, knowledge-grounded, or action-based, and justify that choice in one sentence.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Testing and Publishing Custom Agents',
    'Copilot Studio''s built-in test pane runs the agent in a sandboxed conversation as you build, showing exactly which topic triggered, which entities it extracted, and what action ran — the single most.',
    'Copilot Studio''s built-in test pane runs the agent in a sandboxed conversation as you build, showing exactly which topic triggered, which entities it extracted, and what action ran — the single most important habit in agent building is testing after every meaningful change rather than building several topics blind and testing everything at once, since isolating which change broke what becomes far harder the longer testing is deferred.

Adversarial testing — deliberately trying to confuse the agent — surfaces the failure modes real users will eventually find anyway: ambiguous phrasing that triggers the wrong topic, missing entities the agent fails to ask for cleanly, and requests slightly outside what any topic covers that should produce a graceful ''I can''t help with that, but here''s who can'' rather than a confident wrong answer. Budgeting real testing time for exactly these edge cases, not just the happy path, is what separates a demo-quality agent from a production one.

Publishing makes the agent live and available through its configured channels — Teams, a website widget, Microsoft 365 Copilot itself as a plugin-style extension, or a direct link. Each channel has its own authentication and access considerations, and an agent published without first restricting its audience appropriately can end up answering questions, or taking actions, for people who were never meant to reach it.',
    array['Use the test pane to validate topics before publishing','Identify common failure modes surfaced by adversarial testing','Describe the publishing and channel-deployment process for a finished agent'],
    array['Test after every meaningful change using the sandboxed test pane, not at the end of a long build','Adversarial testing surfaces ambiguous triggers and out-of-scope requests before real users do','A good agent fails gracefully on out-of-scope requests rather than generating a wrong answer','Publishing makes an agent live on its configured channels; each channel needs its own access review'],
    'Run five adversarial test phrases against the agent you have been designing, including one clearly out-of-scope request, and note how it responded to each.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 3: Enterprise Agents at Scale ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 3, 'Enterprise Agents at Scale',
    'The orchestration, governance, and leadership questions that arise once agents move from pilot to production.',
    array['Explain why complex enterprise problems often need multiple cooperating agents','Identify the governance questions specific to agents that take action, not just answer questions','Identify the right metrics for a conversational agent versus a transactional one','Identify the organisational, not just technical, barriers to scaling agents'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Multi-Agent Orchestration Concepts',
    'A single agent handling every possible request becomes unwieldy past a certain point — too many topics competing for the same trigger phrases, too much unrelated knowledge diluting any one answer''s.',
    'A single agent handling every possible request becomes unwieldy past a certain point — too many topics competing for the same trigger phrases, too much unrelated knowledge diluting any one answer''s grounding. The emerging pattern instead is multiple specialist agents, each narrowly focused on one domain (HR policy, IT support, finance queries), coordinated by an orchestrator agent that routes a request to the right specialist and relays the answer back.

This mirrors how a well-run organisation already works: a generalist front desk routes questions to the right department rather than one person trying to know everything. The orchestrator''s job is narrow by design — recognise what kind of request this is and hand it off correctly — which keeps it simple and reliable even as the number of specialist agents behind it grows.

The hard part is context: when a specialist hands a conversation back to the orchestrator, or to another specialist, what does the next agent know about what already happened? Losing context at a hand-off forces the user to repeat themselves, which undoes much of the convenience multi-agent design was meant to deliver. Designing explicit context-passing between agents, not assuming it happens automatically, is the difference between a multi-agent system that feels seamless and one that feels broken.',
    array['Explain why complex enterprise problems often need multiple cooperating agents','Distinguish orchestrator agents from specialist agents','Identify the hand-off and context-sharing challenges in multi-agent systems'],
    array['Multiple narrow specialist agents scale better than one agent trying to cover every domain','An orchestrator agent routes requests to the right specialist, mirroring a front-desk function','Context loss at hand-offs forces users to repeat themselves and breaks the experience','Design explicit context-passing between agents rather than assuming it happens by default'],
    'Sketch an orchestrator-plus-specialist structure for three agent domains relevant to your organisation, and note one context-sharing risk at each hand-off point.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Governance for Autonomous Agents',
    'A chatbot that only answers questions carries limited downside from a wrong answer. An agent that can also take action — send an email, update a record, approve a request, trigger a payment — carries.',
    'A chatbot that only answers questions carries limited downside from a wrong answer. An agent that can also take action — send an email, update a record, approve a request, trigger a payment — carries a different and larger category of risk, because a wrong action has consequences a wrong sentence does not. Governance for agents has to address both: is the answer accurate, and is the agent authorised to take this specific action at all.

Least-privilege access — giving an agent only the permissions its narrowest legitimate use case requires, never broad standing access ''in case it''s useful'' — limits the damage from a misconfigured topic or an adversarial prompt that tries to manipulate the agent into an action outside its intended scope. An agent that can only read from a system, when writing was never actually required, cannot cause a write-related incident no matter how it is manipulated.

Every agent-initiated action should leave an audit trail as rigorous as a human-initiated one — who (or which agent) did what, when, on whose behalf, and based on what input. This is not optional governance overhead; it is the only way to investigate an incident after the fact, demonstrate compliance to an auditor, and build the organisational trust that determines whether agents get expanded responsibility or get rolled back after one unexplainable incident.',
    array['Identify the governance questions specific to agents that take action, not just answer questions','Apply least-privilege thinking to agent permissions','Design an audit trail for agent-initiated actions'],
    array['Action-taking agents carry a different risk category than question-answering agents','Grant least-privilege permissions scoped to the narrowest legitimate use case','A misconfigured or manipulated agent with minimal permissions causes minimal damage','Every agent-initiated action needs an audit trail as rigorous as a human-initiated one'],
    'List the permissions a production version of your practice agent would need. For each, state the narrowest scope that still lets it do its job.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Measuring Agent Performance and ROI',
    'Usage metrics — conversations started, topics triggered, active users — show whether an agent is being used. They do not show whether it is actually helping, which is a separate and more important.',
    'Usage metrics — conversations started, topics triggered, active users — show whether an agent is being used. They do not show whether it is actually helping, which is a separate and more important question. An agent with high usage but a high escalation-to-human rate may be popular precisely because it reliably fails to resolve anything, generating work rather than saving it.

Outcome metrics close that gap: resolution rate without human escalation, time saved per resolved request compared to the manual process it replaced, and user satisfaction specific to the resolved cases, not overall interaction volume. A transactional agent (book a room, check a status) should be measured mostly on successful completion rate; a more conversational, advisory agent needs a softer but still real measure of whether it actually changed what the user did next.

A credible ROI case compares the fully loaded cost of the manual process being replaced — staff time, error-correction overhead, delay cost — against the agent''s build, licensing, and maintenance cost, over a realistic time horizon that includes the inevitable ongoing tuning an agent needs after launch. Agents that look impressive in a demo but were never measured against this comparison are the most common reason enterprise agent pilots fail to secure the budget to scale.',
    array['Identify the right metrics for a conversational agent versus a transactional one','Distinguish usage metrics from outcome metrics','Build a simple business case comparing agent cost to manual-process cost'],
    array['Usage metrics show adoption; outcome metrics show whether the agent actually helps','High usage with high human-escalation rates can indicate a failing, not a successful, agent','Measure transactional agents on completion rate, advisory agents on behavioural change','Compare fully loaded manual-process cost against build, licensing, and ongoing tuning cost'],
    'Define one usage metric and one outcome metric for the agent concept you have been designing, and state the manual-process cost it would need to beat.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Scaling Agent Adoption Across the Enterprise',
    'A technically sound agent still fails to scale when the organisational groundwork is missing: no clear owner once IT hands it off, no process for routing the edge cases it cannot resolve, and no.',
    'A technically sound agent still fails to scale when the organisational groundwork is missing: no clear owner once IT hands it off, no process for routing the edge cases it cannot resolve, and no communication to the people whose workflow it is meant to change about why it exists and how to use it. These are organisational problems with no code fix, and they sink more agent pilots than any model limitation does.

A disciplined pilot-to-production path helps: launch to a small, willing group first, instrument it from day one with the usage and outcome metrics from the previous lesson, fix the specific failure patterns that surface, and only then expand the audience — rather than building for the full enterprise rollout from the start and discovering the failure patterns at a scale where they are expensive and visible.

An agent is not a one-time build. Underlying systems change, policies change, the phrasing people naturally use shifts over time, and every one of those drifts the agent''s accuracy downward unless someone owns ongoing review of its conversation logs, retraining of its trigger phrases, and updates to its connected actions. Budgeting for that ongoing ownership, not just the initial build, is the single clearest signal of whether an organisation is actually ready to run agents at scale.',
    array['Identify the organisational, not just technical, barriers to scaling agents','Apply a pilot-to-production playbook for agent rollout','Describe the ongoing maintenance an agent requires after launch'],
    array['Organisational gaps — ownership, escalation routing, communication — sink more pilots than model limits','Launch small, instrument from day one, fix failure patterns, then expand the audience','Agents drift in accuracy over time as systems, policy, and phrasing change around them','Ongoing ownership — log review, retraining, action updates — is the real sign of scale-readiness'],
    'Name a specific person or role in your organisation who would own an agent after launch. If you cannot name one, that is the gap to raise before proposing a pilot.',
    false, 'draft', 'hybrid'
  );

  -- ============================================================
  -- Course: Copilot for Developers and Enterprise Architecture  (slug: copilot-developer-and-enterprise-architecture)
  -- ============================================================
  insert into public.courses
    (slug, title, subtitle, description, category, difficulty, icon, theme_color,
     sort_order, status, visibility, domain_id, outcomes, target_audience,
     prerequisites, skills_covered, estimated_hours, generation_mode)
  values (
    'copilot-developer-and-enterprise-architecture',
    'Copilot for Developers and Enterprise Architecture',
    'GitHub Copilot, Azure AI Foundry, and the architecture decisions behind enterprise-scale AI',
    'Covers Copilot''s developer-facing tools, the Azure AI platform underneath Microsoft''s AI products, and the enterprise architecture, identity, and security decisions that determine whether an organisation''s AI systems scale safely.',
    'AI Tools', 'Advanced', '🏗', '#004578',
    25, 'draft', 'public',
    v_domain_id,
    array['Use GitHub Copilot effectively inside common development workflows','Explain the role of Azure AI Foundry and Azure OpenAI Service in Microsoft''s AI stack','Describe how enterprise data and identity integrate with Copilot through Microsoft Graph','Evaluate enterprise AI infrastructure decisions against security and scale requirements'],
    array['Developers','Solution architects','IT and platform leads'],
    array['No prior Microsoft Copilot experience required for this course'],
    array['Use GitHub Copilot effectively inside common development workflows','Explain the role of Azure AI Foundry and Azure OpenAI Service in Microsoft''s AI stack','Describe how enterprise data and identity integrate with Copilot through Microsoft Graph','Evaluate enterprise AI infrastructure decisions against security and scale requirements'],
    3.5, 'hybrid'
  ) returning course_id into v_course_id;

  -- ---- Module 1: Developer Productivity ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 1, 'Developer Productivity',
    'Copilot inside the tools developers already use every day.',
    array['Explain how GitHub Copilot generates code suggestions from context','Configure Copilot settings and keybindings in a common IDE','Use Copilot to draft test cases and identify untested edge cases'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'GitHub Copilot for Developers',
    'GitHub Copilot reads the open file, related files in the project, and the code written so far to predict a plausible continuation — the same underlying principle as any generative model, applied to.',
    'GitHub Copilot reads the open file, related files in the project, and the code written so far to predict a plausible continuation — the same underlying principle as any generative model, applied to code instead of prose. Suggestions appear inline as grey ''ghost text'' that a developer accepts with a keystroke or ignores by continuing to type, which keeps it out of the way rather than interrupting the normal flow of writing code.

Copilot Chat is a different mode of the same underlying tool: a conversational panel inside the editor for asking questions about the codebase, requesting an explanation of an unfamiliar function, or asking for a specific piece of code to be generated or modified with more context than autocomplete alone provides. The two modes suit different moments — autocomplete for the next few lines while deep in flow, chat for a question that needs explanation or a larger, deliberate change.

Accepting a suggestion is not the same as trusting it. Generated code can be subtly wrong, use a deprecated API, or introduce a security issue that compiles cleanly and looks reasonable at a glance — exactly the kind of error that is easy to miss under the normal pressure to ship quickly. Treating every accepted suggestion as a first draft that still needs the same review a colleague''s pull request would get is the discipline that keeps Copilot a productivity gain rather than a quiet source of defects.',
    array['Explain how GitHub Copilot generates code suggestions from context','Distinguish Copilot''s autocomplete mode from Copilot Chat','Apply good practice for reviewing AI-suggested code before accepting it'],
    array['Copilot predicts code continuations from open-file and project context, like autocomplete','Copilot Chat is a conversational mode for questions, explanations, and larger deliberate changes','Accepted suggestions can be subtly wrong, deprecated, or insecure while looking reasonable','Review AI-suggested code with the same rigor as a colleague''s pull request'],
    'In your editor, accept one non-trivial Copilot suggestion and review it line by line as if it were a colleague''s pull request before keeping it.',
    true, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Copilot in Visual Studio and VS Code',
    'Both Visual Studio and VS Code expose the same underlying Copilot engine through IDE-specific extensions, with settings controlling suggestion behaviour (inline suggestions on or off, suggestion.',
    'Both Visual Studio and VS Code expose the same underlying Copilot engine through IDE-specific extensions, with settings controlling suggestion behaviour (inline suggestions on or off, suggestion delay, which languages are enabled) and keybindings for accepting, rejecting, or cycling through alternative suggestions — worth a few minutes of setup, since the default keybindings do not suit every typing habit.

Copilot Chat supports slash commands that shortcut common requests: /explain for an explanation of selected code, /fix for a suggested correction to a highlighted error, /tests to generate test cases for a function. These are faster and more reliable than typing the equivalent request in plain language every time, because they trigger a purpose-built prompt behind the scenes tuned for exactly that task.

Suggestion quality depends heavily on what context the tool can see. Having related files open in other tabs, using clear and consistent naming conventions, and writing a short comment describing intent before a complex function all give Copilot more to work from, producing suggestions that fit the actual codebase''s patterns rather than generic, textbook-style code that technically works but does not match how the rest of the project is written.',
    array['Configure Copilot settings and keybindings in a common IDE','Use slash commands and context references in Copilot Chat','Apply workspace-level context to improve suggestion relevance'],
    array['Visual Studio and VS Code share the same Copilot engine through IDE-specific extensions','Slash commands (/explain, /fix, /tests) trigger purpose-built prompts faster than plain language','Suggestion relevance depends on visible context: open related files, naming, intent comments','A short comment describing intent before a complex function improves what Copilot suggests'],
    'Use the /explain or /tests slash command on one function in a real project and evaluate whether the result matches your codebase''s actual conventions.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'AI-Assisted Code Review and Testing',
    'Generating a first pass of test cases is one of Copilot''s most reliably useful applications: given a function, it can propose test cases covering the obvious inputs quickly, and prompting it.',
    'Generating a first pass of test cases is one of Copilot''s most reliably useful applications: given a function, it can propose test cases covering the obvious inputs quickly, and prompting it specifically for edge cases — empty input, boundary values, unexpected types — often surfaces gaps a developer moving quickly would not think to test, precisely because the model has seen enormous numbers of similar functions and the bugs that commonly hide in their edge cases.

For pull request review, Copilot can summarise what a large diff actually changes in plain language, flag patterns that look like common mistakes, and check whether a change is consistent with the rest of the codebase''s conventions — useful as a fast first pass before a human reviewer spends their attention, especially on a large or unfamiliar diff where getting oriented is itself the slow part.

What this does not replace is judgement about whether a change is the right change at all — whether it solves the actual problem, fits the architecture, and makes the right trade-offs for this specific system. AI review is strong at catching mechanical issues and summarising scope; it has no reliable opinion on whether the underlying design decision was correct, which is exactly the part a human reviewer with context on the system still needs to own.',
    array['Use Copilot to draft test cases and identify untested edge cases','Apply Copilot to summarise and review a pull request','Recognise where AI code review complements rather than replaces human review'],
    array['Prompting specifically for edge cases surfaces test gaps a quick review would miss','Copilot can summarise a large diff and flag conventions before a human review pass','AI review is a fast first pass, not a substitute for judgement about the underlying design','Mechanical issues and scope summaries are AI''s strength; architectural correctness is not'],
    'Ask Copilot to generate edge-case tests for a function you wrote recently, then identify one edge case it suggested that you had not already considered.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 2: Azure AI Foundations ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 2, 'Azure AI Foundations',
    'The Azure platform layer that underlies Copilot and enterprise generative AI applications.',
    array['Explain the role of Azure AI Foundry as Microsoft''s unified AI development platform','Explain what Azure OpenAI Service provides on top of the underlying models','Distinguish prompt engineering from fine-tuning as approaches to customising a model','Identify Azure''s built-in tools for evaluating AI application safety and quality'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Introduction to Azure AI Foundry',
    'Azure AI Foundry is Microsoft''s platform for building, evaluating, and deploying custom AI applications and models at a lower level than Copilot Studio — the audience is developers and data.',
    'Azure AI Foundry is Microsoft''s platform for building, evaluating, and deploying custom AI applications and models at a lower level than Copilot Studio — the audience is developers and data scientists building bespoke AI solutions, not business users configuring a conversational agent through a largely no-code interface. Where Copilot Studio asks ''what should this agent do,'' Foundry asks ''which model, with what data, evaluated against what metric.''

Foundry brings together model selection (including Azure OpenAI Service models alongside open-source and partner models), prompt engineering and testing tools, evaluation frameworks for measuring an application''s accuracy and safety before launch, and deployment tooling for putting a finished solution into production with proper monitoring. It is the place an organisation goes when its AI need is specific enough that Copilot Studio''s templates and pre-built topics do not fit.

The practical distinction for a learner moving between this course''s earlier material and Foundry: Copilot Studio agents are built for conversational, action-oriented business scenarios on a largely configured platform; Foundry projects are built for custom AI capability that needs real engineering — a recommendation engine, a document-classification pipeline, a bespoke application embedding a model directly. Many enterprise AI strategies end up using both, for different parts of the problem.',
    array['Explain the role of Azure AI Foundry as Microsoft''s unified AI development platform','Identify the kinds of projects Foundry is built to support','Distinguish Foundry''s role from Copilot Studio''s role in the Microsoft AI stack'],
    array['Azure AI Foundry is Microsoft''s platform for building and deploying custom AI applications','Foundry targets developers and data scientists; Copilot Studio targets business users','Foundry includes model selection, prompt testing, evaluation, and deployment tooling','Organisations often use Copilot Studio for business agents and Foundry for custom AI capability'],
    'Describe one AI use case in your organisation that would fit Copilot Studio and one that would need Azure AI Foundry''s custom-engineering approach, and explain the difference.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Azure OpenAI Service Fundamentals',
    'Azure OpenAI Service makes OpenAI''s models available through Microsoft''s Azure cloud, with the enterprise-grade security, regional data residency, and compliance certifications that come from being.',
    'Azure OpenAI Service makes OpenAI''s models available through Microsoft''s Azure cloud, with the enterprise-grade security, regional data residency, and compliance certifications that come from being deployed inside an organisation''s own Azure environment rather than called directly from a third-party endpoint. For many regulated organisations, this distinction — same underlying model capability, Azure''s compliance wrapper around it — is what makes using these models possible at all.

The service adds private networking options, role-based access control integrated with the same Azure Active Directory identities already governing the rest of an organisation''s systems, content filtering configurable to an organisation''s own risk tolerance, and contractual data-handling commitments (prompts and completions are not used to train OpenAI''s models) that matter enormously for legal and compliance sign-off.

In practice, a developer calls an Azure OpenAI model through a REST API or SDK much like any other Azure service: authenticate, specify the deployed model, send a prompt, receive a completion. The building-block simplicity of that call is exactly what lets Foundry, Copilot Studio actions, and custom enterprise applications all sit on top of the same underlying service, each adding its own layer of workflow, conversation design, or business logic above it.',
    array['Explain what Azure OpenAI Service provides on top of the underlying models','Identify the enterprise security and compliance features it adds','Describe how an application calls an Azure OpenAI model via API'],
    array['Azure OpenAI Service deploys OpenAI models inside Azure''s enterprise security and compliance envelope','It adds private networking, Azure AD-integrated access control, and configurable content filtering','Microsoft''s contractual terms exclude customer prompts and completions from model training','Applications call the service through a standard REST API or SDK, like any other Azure service'],
    'Identify one compliance or data-residency requirement in your organisation that would influence a choice between a direct API and an Azure-hosted model deployment.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Building Custom AI Models with Azure AI',
    'Most organisations customising AI behaviour should start with prompt engineering — carefully designed instructions and examples given to an existing model at the time of each request — because it.',
    'Most organisations customising AI behaviour should start with prompt engineering — carefully designed instructions and examples given to an existing model at the time of each request — because it requires no retraining, costs nothing extra per use beyond the base model call, and can be iterated on in minutes. Fine-tuning, which actually retrains a model''s weights on an organisation''s own example data, is a heavier investment reserved for cases where prompt engineering genuinely cannot achieve the needed consistency or style.

Retrieval-augmented generation (RAG) is usually the better answer to ''the model doesn''t know our specific information'' than fine-tuning: rather than retraining the model on company documents, RAG retrieves the relevant documents at the moment of the request and includes them directly in the prompt, so the model answers from content it can see right now rather than from something baked into its weights that goes stale the moment the underlying documents change. This is the same grounding principle from Copilot''s own hallucination lesson, implemented at the platform level.

A genuinely custom model build is justified when the task is narrow, high-volume, and distinct enough that a general-purpose model with good prompting and RAG still underperforms — common in specialised domains like certain scientific or legal classification tasks. For the overwhelming majority of business AI applications, including most of what this course covers, a well-grounded, well-prompted existing model is both cheaper and more maintainable than a custom one.',
    array['Distinguish prompt engineering from fine-tuning as approaches to customising a model','Explain retrieval-augmented generation as a grounding technique','Identify when a custom model build is justified over configuring an existing one'],
    array['Prompt engineering customises behaviour without retraining; fine-tuning retrains model weights','Start with prompt engineering; reserve fine-tuning for cases it genuinely cannot solve','RAG retrieves relevant documents at request time rather than baking knowledge into weights','Custom model builds are justified only for narrow, high-volume tasks general models underperform on'],
    'Take one business problem you have considered ''needs custom AI'' and evaluate whether prompt engineering plus RAG against existing documents could solve it instead.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Responsible AI Tooling in Azure',
    'Azure AI Foundry includes built-in evaluation tools that test an application''s responses against metrics like groundedness (does the answer actually follow from the retrieved content), relevance.',
    'Azure AI Foundry includes built-in evaluation tools that test an application''s responses against metrics like groundedness (does the answer actually follow from the retrieved content), relevance, coherence, and safety categories such as harmful content or jailbreak resistance — turning ''does this feel okay in a few manual tests'' into a measured, repeatable evaluation that can be rerun after every change to the prompt, model, or retrieval configuration.

Content filtering sits in front of both the input a user sends and the output a model returns, screening for categories like violence, hate speech, self-harm content, and sexual content, with severity thresholds an organisation can tune to its own risk tolerance and use case — a children''s education application and an internal security research tool reasonably set very different thresholds for the same underlying filter.

None of this tooling makes a launch decision automatically. It produces metrics and flagged cases that a responsible team reviews against its own bar for acceptable risk, informed by who will use the application, what happens when it is wrong, and how visible a failure would be. The tooling''s real value is making that review possible at all, with concrete evidence, rather than leaving a launch decision to intuition and a handful of manual test conversations.',
    array['Identify Azure''s built-in tools for evaluating AI application safety and quality','Explain content filtering and its configurable severity levels','Describe how evaluation metrics guide a go/no-go launch decision'],
    array['Foundry''s evaluation tools measure groundedness, relevance, coherence, and safety categories','Evaluations are repeatable and rerun after changes to prompt, model, or retrieval configuration','Content filtering screens both input and output, with tunable severity thresholds','Evaluation tooling informs, but does not replace, a team''s own risk-based launch decision'],
    'List the safety categories most relevant to an AI application you can imagine for your organisation, and state which severity threshold each should use and why.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 3: Enterprise AI Systems ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 3, 'Enterprise AI Systems',
    'Architecture, identity, security, and scale decisions for running AI across an enterprise.',
    array['Identify the layers of an enterprise AI architecture from data to user experience','Explain Microsoft Graph''s role as the connective layer behind Copilot''s enterprise grounding','Explain the role of Microsoft Entra ID (Azure AD) in securing AI application access','Identify the capacity and cost-management considerations of scaling AI usage','Synthesise the architecture, identity, security, and scale principles from this module'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Enterprise Architecture for AI Adoption',
    'A mature enterprise AI architecture separates cleanly into layers: a data layer (where information actually lives and how it is governed), a model layer (which AI capability is being called and how).',
    'A mature enterprise AI architecture separates cleanly into layers: a data layer (where information actually lives and how it is governed), a model layer (which AI capability is being called and how), an orchestration layer (the business logic connecting data to model to action, often the flows and agents from earlier modules), and an experience layer (how a person or system actually interacts with the result). Keeping these layers distinct, rather than tightly coupling a specific user interface directly to a specific model version, is what lets any one layer change without rebuilding everything above it.

The most common anti-pattern is building directly against one vendor''s model inside a business application''s core logic, without an abstraction layer in between. When a better or cheaper model becomes available, or a compliance requirement forces a change of provider, every application built this way has to be individually rewritten rather than simply repointed at a new model behind an unchanged interface.

A second common anti-pattern is treating each department''s AI pilot as fully independent, with its own data access patterns and its own security review, rather than building shared platform capability (a common RAG pipeline, a shared evaluation framework, common identity integration) that every department''s pilot can draw on. The difference compounds quickly: shared infrastructure gets more secure and more capable with each use; duplicated one-off builds each carry their own, separately managed risk.',
    array['Identify the layers of an enterprise AI architecture from data to user experience','Explain why a scalable AI architecture separates these layers cleanly','Apply architectural thinking to avoid common enterprise AI anti-patterns'],
    array['Separate data, model, orchestration, and experience layers so any one can change independently','Avoid coupling business logic directly to one vendor''s model without an abstraction layer','Avoid treating each department''s AI pilot as fully independent of shared platform capability','Shared infrastructure compounds in security and capability; duplicated one-off builds do not'],
    'Sketch the four architecture layers for one AI use case in your organisation and identify which, if any, are currently tightly coupled together.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Integrating Copilot with Enterprise Data (Microsoft Graph)',
    'Microsoft Graph is the unified API that exposes a user''s and an organisation''s Microsoft 365 data — emails, documents, calendar, Teams messages, organisational relationships — in one consistent.',
    'Microsoft Graph is the unified API that exposes a user''s and an organisation''s Microsoft 365 data — emails, documents, calendar, Teams messages, organisational relationships — in one consistent interface. When Copilot answers a question grounded in ''everything relevant from the last two weeks,'' it is Microsoft Graph underneath doing the retrieval across that whole surface, which is why Copilot''s enterprise grounding feels so different from a chatbot with no connection to an organisation''s actual content.

Crucially, Graph-grounded Copilot answers respect the exact same permissions the underlying content already has. Copilot cannot surface a document a user does not have access to, cannot read an email in someone else''s inbox, and cannot bypass an existing sharing restriction — it inherits the permission model rather than creating a new one, which is the architectural fact that makes enterprise-wide Copilot deployment possible without granting it any new, separately managed access.

The prerequisite this shifts, rather than removes, is the organisation''s existing data governance: if permissions on SharePoint sites, Teams channels, or shared mailboxes were already overly broad before Copilot existed, Copilot will now surface that overly broad access more visibly and more quickly than a human manually searching ever would have. Cleaning up permission sprawl becomes a genuine Copilot-readiness task, not a separate IT housekeeping project that can be indefinitely deferred.',
    array['Explain Microsoft Graph''s role as the connective layer behind Copilot''s enterprise grounding','Identify the permission model that governs what Copilot can see per user','Recognise the data governance prerequisites for safe Graph-grounded Copilot use'],
    array['Microsoft Graph is the unified API exposing M365 data that grounds Copilot''s enterprise answers','Copilot inherits existing content permissions exactly; it creates no new access of its own','Overly broad existing permissions become more visible, more quickly, once Copilot is deployed','Permission cleanup is a genuine Copilot-readiness prerequisite, not optional IT housekeeping'],
    'Identify one SharePoint site or shared resource in your organisation where you suspect permissions may be broader than intended, and note it as a pre-Copilot cleanup item.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Identity, Access, and Data Security for AI Systems',
    'Microsoft Entra ID (formerly Azure Active Directory) is the identity backbone that every layer of this course''s AI stack ultimately depends on: it is what lets Azure OpenAI Service know which.',
    'Microsoft Entra ID (formerly Azure Active Directory) is the identity backbone that every layer of this course''s AI stack ultimately depends on: it is what lets Azure OpenAI Service know which application is calling it, what lets Copilot Studio agents authenticate to the flows and connectors they call, and what lets Graph-grounded Copilot answers respect per-user permissions. No AI system in the Microsoft ecosystem operates meaningfully outside this identity layer.

Conditional access policies extend identity into context-aware security: requiring multi-factor authentication for access to a sensitive AI application from an unmanaged device, or blocking access entirely from outside approved geographic regions for a tool that touches regulated data. Applying the same conditional access discipline already used for other sensitive enterprise systems to new AI tools, rather than treating them as a separate, lighter-touch category, closes an otherwise easy gap.

Generative AI introduces a specific data loss prevention concern beyond traditional document sharing: a user pasting sensitive information into a prompt, or an agent''s response surfacing content it was grounded in, are both new paths by which sensitive data can leave its intended boundary. Microsoft Purview''s data loss prevention policies extend to Copilot interactions specifically for this reason, and treating prompt and response content as a DLP surface, not just files and emails, is now a baseline expectation.',
    array['Explain the role of Microsoft Entra ID (Azure AD) in securing AI application access','Apply conditional access thinking to AI application scenarios','Identify the data loss prevention considerations specific to generative AI'],
    array['Microsoft Entra ID is the identity backbone underlying every layer of the Microsoft AI stack','Apply conditional access (MFA, device, location) to AI applications as to any sensitive system','Prompts and AI responses are a new data loss prevention surface, not just files and emails','Microsoft Purview DLP policies now extend specifically to Copilot interactions'],
    'Identify one conditional access policy already applied to a sensitive system in your organisation and state whether it currently also covers your AI tools.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Scaling AI Infrastructure in the Enterprise',
    'AI model usage at enterprise scale introduces capacity planning questions that do not exist at pilot scale: will the chosen model deployment handle peak concurrent usage, what happens to response.',
    'AI model usage at enterprise scale introduces capacity planning questions that do not exist at pilot scale: will the chosen model deployment handle peak concurrent usage, what happens to response latency under load, and what is the actual cost trajectory as usage grows from a hundred users to ten thousand. Answering these with real measurement during a pilot, rather than assumption, avoids an unpleasant surprise at the exact moment a rollout succeeds and usage spikes.

Azure OpenAI Service offers both consumption-based pricing (pay per token used, simple to start with, but variable and harder to forecast at scale) and provisioned throughput units (reserved capacity at a predictable cost, better for consistent high-volume production workloads). The right choice depends on usage pattern predictability, and many organisations start consumption-based during a pilot and move to provisioned throughput once usage patterns are well understood.

Production AI systems need the same monitoring discipline as any other production system — latency, error rates, and cost tracked continuously — plus AI-specific monitoring: tracking response quality drift, unusual spikes in content filter triggers (which can indicate either an attack or a genuine new use case the system was not designed for), and usage patterns that suggest the deployed model or RAG configuration needs updating as the underlying business content it draws on changes.',
    array['Identify the capacity and cost-management considerations of scaling AI usage','Explain the trade-offs between provisioned throughput and consumption-based pricing','Apply monitoring practices appropriate to a production AI system'],
    array['Measure capacity, latency under load, and cost trajectory during a pilot, not after scale-up','Consumption-based pricing suits pilots; provisioned throughput suits predictable high-volume production','Production AI systems need standard monitoring (latency, errors, cost) plus AI-specific monitoring','Track quality drift and content-filter trigger spikes as signals the system needs updating'],
    'For an AI pilot you know of, identify whether its usage pattern is predictable enough yet to justify provisioned throughput, or whether consumption-based pricing still fits better.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    5, 'Enterprise AI System Design: Review and Case Study',
    'Consider a realistic design: a retail organisation deploys a Copilot Studio agent for store managers, grounded via Microsoft Graph in internal policy documents and a Power Automate flow that checks.',
    'Consider a realistic design: a retail organisation deploys a Copilot Studio agent for store managers, grounded via Microsoft Graph in internal policy documents and a Power Automate flow that checks live inventory through a line-of-business connector, authenticated through Entra ID with conditional access requiring a managed device, and monitored through Azure AI Foundry''s evaluation tooling before launch. Each module in this course maps to one decision in that design, and the design is only as strong as its weakest layer.

A reviewer applying this module''s principles would check: are the architecture layers cleanly separated (could the inventory connector be swapped without rebuilding the agent), does the identity and conditional access setup match the sensitivity of the data involved, is there an audit trail for every inventory-affecting action the agent can trigger, and was capacity planned against realistic peak usage (store managers checking inventory at shift change, all at once) rather than average usage.

The weakest decisions in real enterprise AI designs are rarely the model choice — most capable models perform acceptably on well-scoped tasks. They are almost always governance gaps: permissions that were already too broad before the agent existed, no named owner for ongoing maintenance, or a launch decision made on a demo rather than a measured evaluation. Carrying that lesson forward is the real outcome of this module, more than any specific Azure feature.',
    array['Synthesise the architecture, identity, security, and scale principles from this module','Apply them to evaluate a realistic enterprise AI system design','Identify the strongest and weakest decisions in a given design, with justification'],
    array['A design is only as strong as its weakest architecture, identity, security, or scale layer','Check layer separation, identity/conditional access fit, audit trails, and realistic capacity planning','Model choice is rarely the weakest link in real enterprise AI designs','Governance gaps — permissions, ownership, demo-based launch decisions — are the recurring failure point'],
    'Using the retail case study''s four checks, evaluate a real or planned AI system in your own organisation and identify its single weakest layer.',
    false, 'draft', 'hybrid'
  );

  -- ============================================================
  -- Course: Copilot: Governance, Security, and AI Leadership  (slug: copilot-governance-security-and-leadership)
  -- ============================================================
  insert into public.courses
    (slug, title, subtitle, description, category, difficulty, icon, theme_color,
     sort_order, status, visibility, domain_id, outcomes, target_audience,
     prerequisites, skills_covered, estimated_hours, generation_mode)
  values (
    'copilot-governance-security-and-leadership',
    'Copilot: Governance, Security, and AI Leadership',
    'Responsible AI, compliance, and leading an organisation through AI-enabled change',
    'The capstone course: responsible AI principles, governance frameworks, security and compliance for AI deployment, and the adoption, change management, and leadership skills required to run AI transformation well, closing with a capstone roadmap exercise.',
    'AI Tools', 'Advanced', '🏛', '#A4262C',
    26, 'draft', 'public',
    v_domain_id,
    array['Apply responsible AI principles to real deployment decisions','Identify the security and compliance considerations specific to AI systems','Lead an AI adoption effort using a structured change management approach','Produce a roadmap for an organisation''s own Copilot and agentic AI adoption'],
    array['Leaders','Compliance and risk professionals','AI programme owners'],
    array['No prior Microsoft Copilot experience required for this course'],
    array['Apply responsible AI principles to real deployment decisions','Identify the security and compliance considerations specific to AI systems','Lead an AI adoption effort using a structured change management approach','Produce a roadmap for an organisation''s own Copilot and agentic AI adoption'],
    3.5, 'hybrid'
  ) returning course_id into v_course_id;

  -- ---- Module 1: Responsible AI and Governance ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 1, 'Responsible AI and Governance',
    'The principles and frameworks that keep AI deployment accountable.',
    array['Identify Microsoft''s core responsible AI principles','Explain the purpose of an organisational AI governance framework','Explain how bias can enter an AI system through training data or deployment context','Explain Microsoft Purview''s role in classifying and protecting data used by AI systems'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Principles of Responsible AI',
    'Microsoft organises its responsible AI commitments around principles that recur across this entire course in different forms: fairness (does the system treat different groups equitably), reliability.',
    'Microsoft organises its responsible AI commitments around principles that recur across this entire course in different forms: fairness (does the system treat different groups equitably), reliability and safety (does it perform consistently and fail safely), privacy and security (is data protected appropriately), inclusiveness (does it work for people with different abilities and backgrounds), transparency (can people understand how and why it produced a given output), and accountability (is there a clear owner responsible for its behaviour).

None of these are satisfied once and then forgotten. A model updated by its provider, a new population of users the system was not originally tested against, or a new connected data source can each quietly undermine a principle that was genuinely satisfied at launch — which is why responsible AI is organised as an ongoing practice with periodic review, not a one-time certification exercise that, once passed, never needs revisiting.

Applying the principles concretely means asking specific questions of a specific system: has this agent''s accuracy been checked across different user groups, not just the group that built and tested it; what happens when it fails, and does it fail safely or silently; can a user ask why it gave a particular answer and get a real response; and if something goes wrong, who is actually accountable. A system that cannot answer these questions concretely is not yet ready for responsible deployment, regardless of how capable its underlying model is.',
    array['Identify Microsoft''s core responsible AI principles','Explain why these principles require ongoing practice, not a one-time checklist','Apply the principles to evaluate a specific AI use case'],
    array['Core principles: fairness, reliability/safety, privacy/security, inclusiveness, transparency, accountability','These principles require ongoing review, not a one-time launch checklist','Models, user populations, and data sources can each quietly undermine a satisfied principle later','Apply the principles as concrete, specific questions to a specific system, not abstractly'],
    'Pick one AI system (Copilot, an agent, or any AI tool) you use regularly and answer the four concrete questions — tested across groups, fails safely, explainable, accountable owner — for it honestly.',
    true, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'AI Governance Frameworks and Policy',
    'An AI governance framework is the set of policies, review processes, and decision rights that determine how an organisation evaluates, approves, and oversees its use of AI systems — the.',
    'An AI governance framework is the set of policies, review processes, and decision rights that determine how an organisation evaluates, approves, and oversees its use of AI systems — the organisational equivalent of the technical governance (permissions, audit trails) covered in the previous course, applied to decisions rather than to data access alone.

A usable AI policy needs to be concrete enough to actually guide a decision: which use cases require formal review before launch and which do not, who has authority to approve a new AI deployment, what data classifications are permitted or prohibited as inputs to which kinds of AI systems, and what the escalation path is when something goes wrong. A policy that states only broad principles without these specifics gets read once and then ignored the first time someone needs an actual answer.

Centralised governance routes every AI decision through one body — strong consistency, but often too slow for an organisation moving quickly on multiple fronts. Federated governance sets central policy and risk thresholds, then delegates approval authority for lower-risk use cases to business units themselves — faster, but only as safe as the central thresholds are clear and the business units are equipped to apply them correctly. Most organisations scaling AI past the pilot stage move toward some federated model out of necessity, which makes clear, specific policy even more important than it would be under pure centralisation.',
    array['Explain the purpose of an organisational AI governance framework','Identify the core components a usable AI policy needs','Distinguish centralised from federated governance models'],
    array['An AI governance framework sets policy, review processes, and decision rights for AI use','A usable policy specifies review triggers, approval authority, data rules, and escalation paths','Centralised governance is consistent but slow; federated governance is faster but needs clear central thresholds','Most organisations move toward federated governance as AI use scales past the pilot stage'],
    'Check whether your organisation''s AI policy, if one exists, specifies who can approve a new AI use case. If it does not say, that is the first gap to flag.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Bias, Fairness, and Transparency in AI Systems',
    'Bias in an AI system rarely comes from a single obvious cause. It can enter through training data that underrepresents certain groups, through a RAG knowledge base that happens to contain more.',
    'Bias in an AI system rarely comes from a single obvious cause. It can enter through training data that underrepresents certain groups, through a RAG knowledge base that happens to contain more documentation relevant to one team or region than another, or through phrasing patterns in trigger examples that work better for some writing styles than others — meaning fairness testing has to examine the whole system, not just the base model''s published fairness benchmarks.

A practical fairness test for a deployed application: run the same underlying request through different phrasings, dialects, and user-group-relevant contexts, and compare resolution rates and answer quality across them. A customer-service agent that resolves requests fluently in formal, native-speaker English but struggles with the exact same request phrased less formally or by a non-native speaker is failing a fairness test — even though no single line of its design looks discriminatory in isolation.

Transparency, in practice, means a user should always be able to tell when they are interacting with AI rather than a person, understand at a basic level why a given answer was produced (ideally with a reference to the source it was grounded in, not just a bare assertion), and know how to reach a human when the AI''s answer is not good enough. These are modest, achievable commitments, and skipping them is one of the fastest ways to erode the trust an AI deployment needs to succeed long-term.',
    array['Explain how bias can enter an AI system through training data or deployment context','Identify practical steps for testing an application''s fairness across user groups','Apply transparency practices that help users appropriately calibrate trust'],
    array['Bias can enter through training data, an unbalanced knowledge base, or narrow trigger-phrase examples','Test fairness by comparing resolution quality across phrasings, dialects, and user-group contexts','Transparency means clear AI disclosure, explainable answers, and an accessible human escalation path','Skipping basic transparency commitments erodes the trust an AI deployment needs to succeed'],
    'Test one AI system you use by rephrasing the same request informally or in simpler language, and compare the quality of the two responses.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Microsoft Purview and Data Governance for AI',
    'Microsoft Purview provides the data classification, sensitivity labelling, and data loss prevention capability that underlies safe AI deployment across the Microsoft ecosystem. Sensitivity labels.',
    'Microsoft Purview provides the data classification, sensitivity labelling, and data loss prevention capability that underlies safe AI deployment across the Microsoft ecosystem. Sensitivity labels applied to documents and emails (confidential, highly confidential, public) travel with that content, and Copilot respects those labels exactly as it respects sharing permissions — a highly confidential document correctly labelled will not casually surface in an answer to a user who should not see it, which only works if the labelling was done accurately in the first place.

This is precisely why data governance has to come before AI rollout, not after. An organisation with inconsistent or absent sensitivity labelling discovers the gap only when Copilot surfaces something it should not have — at which point the problem looks like an AI failure, when the actual root cause is a data governance gap that existed long before any AI tool arrived and would have caused the same exposure through ordinary search or sharing eventually.

Purview''s auditing and insider risk management capabilities extend to AI interactions specifically, logging what was asked, what was surfaced, and by whom — the same audit trail principle from the agent governance lesson, applied at the platform level across every Copilot interaction in the tenant, not just agent-initiated actions. Reviewing these logs periodically, not only after an incident, is the governance habit that catches a labelling gap before it becomes a real exposure.',
    array['Explain Microsoft Purview''s role in classifying and protecting data used by AI systems','Identify how sensitivity labels affect what Copilot can surface','Apply data governance thinking before, not after, an AI rollout'],
    array['Purview provides the data classification and sensitivity labelling that underlies safe Copilot use','Copilot respects sensitivity labels exactly as it respects sharing permissions','Inconsistent labelling surfaces as an apparent AI failure, but the root cause is a governance gap','Purview''s auditing extends to AI interactions tenant-wide; review logs periodically, not just post-incident'],
    'Check whether sensitivity labelling is consistently applied in one content area of your organisation (a SharePoint site or shared mailbox) before assuming it is Copilot-ready.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 2: Security and Compliance ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 2, 'Security and Compliance',
    'The specific security risks and compliance obligations that come with deploying AI.',
    array['Identify prompt injection as a distinct AI-specific security risk','Identify the major regulatory frameworks relevant to enterprise AI deployment'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'AI Security Risks and Mitigations',
    'Prompt injection is the AI-specific security risk with no direct precedent in traditional software security: an attacker embeds instructions inside content the AI system processes — a document, an.',
    'Prompt injection is the AI-specific security risk with no direct precedent in traditional software security: an attacker embeds instructions inside content the AI system processes — a document, an email, a web page an agent retrieves — hoping the model follows those embedded instructions instead of the legitimate user''s actual request. A grounded agent that retrieves an external document is exposed to this risk by design, since the whole point of grounding is processing content the system did not author itself.

Mitigations are layered rather than singular: instructing models explicitly to treat retrieved content as data, not instructions (the same principle this very course applies to its own browser-automation guidance); content filtering on inputs and outputs; restricting what actions an agent can take without human approval, so even a successful injection has limited blast radius; and monitoring for unusual action patterns that might indicate a manipulated agent. No single mitigation is sufficient alone, which is exactly why defence in depth matters more for AI systems than for many traditional software risks.

Data exfiltration risk looks different for generative AI than for traditional systems too: a user pasting confidential information into a public, non-enterprise AI tool is a direct exfiltration path with no technical breach required at all, and an enterprise-grounded agent with overly broad data access could in principle be manipulated into surfacing content to someone who should not see it. Both point back to the same underlying controls — least privilege, DLP coverage of AI interactions, and clear policy on approved AI tools — covered across this module.',
    array['Identify prompt injection as a distinct AI-specific security risk','Explain data exfiltration risks specific to generative AI systems','Apply layered mitigations appropriate to an organisation''s risk tolerance'],
    array['Prompt injection embeds malicious instructions in content an AI system retrieves and processes','Mitigate injection in layers: treat retrieved content as data, filter content, limit agent actions, monitor','No single mitigation is sufficient alone; defence in depth matters especially for AI systems','Exfiltration risk includes users pasting data into unapproved tools, not only technical breaches'],
    'Identify one AI tool at your organisation that retrieves external or user-supplied content, and name one layered mitigation currently in place or missing for prompt injection.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Compliance Considerations for AI Deployment',
    'Enterprise AI deployment increasingly intersects with regulation beyond general data protection law: the EU AI Act introduces risk-tiered obligations specifically for AI systems, sector-specific.',
    'Enterprise AI deployment increasingly intersects with regulation beyond general data protection law: the EU AI Act introduces risk-tiered obligations specifically for AI systems, sector-specific regulation (financial services, healthcare) often has its own AI-relevant requirements layered on top of general rules, and data residency and cross-border transfer rules affect where an AI system''s underlying data and processing can legally occur. Which of these actually apply depends heavily on sector, geography, and what the system actually does — a factual question each organisation needs its own legal and compliance function to answer, not a general template.

A compliance review of an AI system typically wants documentation covering what data the system processes and on what legal basis, what the evaluation results showed before launch (the same evaluation tooling from the Azure AI Foundry lesson), what human oversight exists and at what points, and what happens when the system is wrong — concrete evidence, not assurances, because that is what a regulator or auditor will eventually ask to see.

A practical compliance-readiness checklist before launch: has legal and compliance reviewed the specific use case (not just ''AI'' generically), is the data processing basis documented, have evaluation results been recorded and retained, is there a human escalation path for the specific risk category this system touches, and is there a named owner accountable after launch. A system that cannot check every item is not yet ready for production in a regulated context, however well it performs technically.',
    array['Identify the major regulatory frameworks relevant to enterprise AI deployment','Explain the documentation an AI system typically needs for a compliance review','Apply a compliance-readiness checklist to a planned AI deployment'],
    array['Relevant frameworks vary by sector and geography: AI-specific regulation, sector rules, data residency','Compliance reviews want documented data basis, evaluation results, human oversight, and failure handling','Legal basis for data processing must be documented per use case, not assumed from a general policy','A named, accountable owner after launch is a standard item on a compliance-readiness checklist'],
    'Apply the five-item compliance-readiness checklist to a real or planned AI deployment you know of, and identify which items, if any, are not yet satisfied.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 3: Enterprise Adoption and Leadership ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 3, 'Enterprise Adoption and Leadership',
    'Leading AI transformation: strategy, change management, value measurement, and the capstone roadmap.',
    array['Identify the components of a realistic organisational AI adoption strategy','Identify the specific sources of resistance to AI adoption in a workforce','Apply a structured framework for measuring AI''s business value beyond usage statistics','Identify the leadership skills that matter most when a team''s work changes due to AI','Identify the realistic near-term trajectory of agentic AI in enterprise work','Synthesise the full course into a concrete adoption roadmap for a real organisation'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Building an AI Adoption Strategy',
    'A realistic AI adoption strategy names specific use cases, not a general ambition to ''adopt AI'' — the difference between a strategy a team can actually execute against and a slogan that generates.',
    'A realistic AI adoption strategy names specific use cases, not a general ambition to ''adopt AI'' — the difference between a strategy a team can actually execute against and a slogan that generates activity without direction. It should also name the governance, security, and measurement foundations from earlier in this course as explicit prerequisites, not afterthoughts bolted on once something has already gone wrong.

Prioritising among candidate use cases works well on two axes: expected value (time saved, revenue influenced, risk reduced) and feasibility (data readiness, technical complexity, organisational appetite for the change). High-value, high-feasibility use cases go first — they build credibility and organisational AI literacy quickly. High-value, low-feasibility use cases are worth planning for but not promising as an early win; low-value use cases, however feasible, are usually a distraction regardless of how easy they look.

The most common strategic mistake is sequencing by what is technically easiest rather than what is organisationally meaningful — shipping several low-value pilots that generate impressive-looking activity but no real business case, then struggling to justify budget for the harder, higher-value work that was deferred. A strategy that is explicit about value first, feasibility second, resists this trap better than one organised purely around what seemed easy to build.',
    array['Identify the components of a realistic organisational AI adoption strategy','Apply a use-case prioritisation framework based on value and feasibility','Avoid common strategic mistakes in sequencing AI adoption'],
    array['Name specific use cases and explicit governance/security/measurement prerequisites, not a general ambition','Prioritise on value and feasibility together; sequence high-value, high-feasibility use cases first','Plan for high-value, low-feasibility use cases rather than promising them as early wins','Sequencing by ease alone produces impressive activity without a real business case'],
    'List three AI use cases under consideration in your organisation and plot each on a value-versus-feasibility grid to see which should genuinely go first.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'Change Management for AI Transformation',
    'Resistance to AI adoption rarely comes from a single source. Some of it is genuine job security concern, some is scepticism earned from a previous technology rollout that was oversold and.',
    'Resistance to AI adoption rarely comes from a single source. Some of it is genuine job security concern, some is scepticism earned from a previous technology rollout that was oversold and underdelivered, and some is a reasonable, well-founded worry about being held accountable for an AI-assisted decision the person did not fully understand or control. Treating all resistance as simple reluctance to change misses that much of it is a rational response to real, unaddressed risk.

A structured approach borrows directly from established change management practice: build a case for change that is honest about both the benefit and the disruption, involve the people whose work will change in the design rather than only in the announcement, pilot with willing early adopters whose success becomes visible proof rather than an abstract promise, and provide real training rather than a single announcement email and a link to documentation.

Communication that builds trust is specific and honest: what will change, what will not, what happens to the time this frees up, and what the organisation will do if the AI tool gets something wrong. Communication that erodes trust promises painless transformation with no real change to anyone''s role, or goes silent on exactly the questions people are actually asking — and people notice the silence faster than any announcement, filling the gap with worse assumptions than the honest answer would have been.',
    array['Identify the specific sources of resistance to AI adoption in a workforce','Apply a structured change management approach to an AI rollout','Distinguish communication that builds trust from communication that erodes it'],
    array['Resistance often reflects rational, unaddressed risk — job security, past overselling, accountability worry','Build the case honestly, involve affected people in design, pilot visibly, train properly','Trust-building communication is specific about what changes, what doesn''t, and what happens if it fails','Silence on the questions people are actually asking erodes trust faster than an honest answer'],
    'Identify the most likely source of resistance to an AI rollout you are planning or aware of, and draft one honest sentence addressing it directly.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Measuring Business Value from AI Investment',
    'Measuring AI''s business value well means going beyond the usage and outcome metrics from the earlier agent-measurement lesson to a genuine business case: hard savings (measurable time or cost.',
    'Measuring AI''s business value well means going beyond the usage and outcome metrics from the earlier agent-measurement lesson to a genuine business case: hard savings (measurable time or cost reduction, directly attributable to the AI tool, net of its own cost), and soft benefits (improved employee experience, faster onboarding, better decision quality) that matter but resist precise quantification and should be reported honestly as directional evidence, not forced into a false-precision number.

Attribution is the hardest part: when a team gets faster at a task after AI tooling arrives alongside other changes (new training, a process redesign, seasonal variation), isolating the AI tool''s specific contribution requires either a controlled comparison (a pilot group versus a similar non-pilot group) or, at minimum, honest acknowledgement that the measured improvement is not cleanly attributable to the AI tool alone.

Value rarely appears immediately. There is typically an adoption curve (people learning to use the tool well), a tuning period (the organisation adjusting prompts, flows, and agent design based on real usage), and only then a mature, measurable steady state. Setting the expectation for this timeline upfront, rather than measuring at week two and declaring the investment a disappointment, is what separates a credible business case from one that sets itself up to fail by its own impatient measurement schedule.',
    array['Apply a structured framework for measuring AI''s business value beyond usage statistics','Distinguish hard savings from soft, harder-to-quantify benefits','Build a realistic timeline for AI value to materialise after rollout'],
    array['Report hard savings precisely and soft benefits honestly as directional evidence, not false precision','Use a controlled comparison where possible to isolate AI''s specific contribution from other changes','Expect an adoption curve and a tuning period before a mature, measurable steady state','Measuring too early, before the tuning period, risks declaring a real investment a false disappointment'],
    'For an AI tool you have access to, estimate which phase it is currently in — adoption, tuning, or mature steady state — and what that implies for when to measure its value.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Leading AI-Enabled Teams',
    'Leading a team through AI-driven change asks for a specific combination of skills: enough technical literacy to have a credible conversation about what the tools can and cannot do (exactly what this.',
    'Leading a team through AI-driven change asks for a specific combination of skills: enough technical literacy to have a credible conversation about what the tools can and cannot do (exactly what this course has built), genuine care for what happens to team members whose tasks are being automated, and the judgement to redesign roles around what AI absorbs rather than either resisting the change wholesale or pretending nothing about the role needs to change.

Role redesign is more productive than role elimination as the default frame: when AI absorbs a mechanical task — first-draft writing, routine data lookup, basic triage — the role usually shifts toward the judgement-heavy work around that task (reviewing and improving the draft, acting on what the lookup revealed, handling the triage cases that needed a human) rather than disappearing outright. Naming that shift explicitly, with the team, is both more honest and more motivating than treating the change as unspoken until headcount decisions make it undeniable.

The single most valuable thing a leader models for a team adopting AI tools is their own visible, consistent scepticism of AI output — checking a Copilot-drafted recommendation before acting on it, asking where an agent''s answer came from, treating a generated first draft as a draft. A team that sees its leader treat AI output uncritically will do the same, and the quality and trust problems that follow are a leadership failure before they are a technology failure.',
    array['Identify the leadership skills that matter most when a team''s work changes due to AI','Apply role-redesign thinking as AI absorbs specific tasks','Model the critical evaluation of AI output that a team should learn from its leader'],
    array['Leading AI-enabled teams needs technical literacy, genuine care for affected people, and redesign judgement','Default to role redesign around judgement-heavy work, not role elimination, as AI absorbs tasks','Name the role shift explicitly with the team rather than leaving it unspoken','A leader''s visible scepticism of AI output is the strongest model a team will actually follow'],
    'Identify one task on your team that AI has started to absorb, and describe how the surrounding role should be redesigned around the judgement work that remains.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    5, 'The Future of Work with AI Agents',
    'The realistic near-term trajectory, grounded in what this course has actually covered rather than speculation, is more agents handling more of the structured, judgement-light work covered across.',
    'The realistic near-term trajectory, grounded in what this course has actually covered rather than speculation, is more agents handling more of the structured, judgement-light work covered across these seven courses — triage, retrieval, first-draft generation, routine approvals under a threshold — while the judgement-heavy work (strategic decisions, accountability for outcomes, the context no model has access to) stays squarely with people, for reasons this course has returned to repeatedly: models do not have accountability, organisational context, or the ability to be genuinely responsible for a consequence.

Grounded forecasting distinguishes between what is already working in production today (everything in this course), what is in active, credible development (more capable multi-agent orchestration, better grounding, lower-friction agent building), and what remains genuinely speculative (fully autonomous enterprise decision-making with no human checkpoint). Confusing these three categories, in either direction, produces either paralysing fear or reckless overconfidence — neither useful for an actual adoption decision.

Advising others well means resisting both the hype that promises AI will handle everything soon, and the dismissal that insists none of it matters yet. The honest, evidence-based position from everything covered in this course: the capability is real, it is already changing specific kinds of work today, it has real limits and real risks that need managing deliberately, and the organisations that will do well with it are the ones treating it as exactly that — a powerful, specific, governed capability, not a miracle and not a fad.',
    array['Identify the realistic near-term trajectory of agentic AI in enterprise work','Distinguish grounded forecasting from hype in discussing AI''s future impact','Apply a balanced, evidence-based view when advising others on AI''s trajectory'],
    array['Agents will absorb more structured, judgement-light work; accountability-bearing decisions stay with people','Distinguish what works in production today from active development from genuine speculation','Confusing those categories produces either paralysing fear or reckless overconfidence','The balanced position: real capability, real limits, needs deliberate governance — neither miracle nor fad'],
    'Write one paragraph you could actually say to a sceptical colleague or a hyped-up one, grounded only in what this course has covered, not speculation either way.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    6, 'Capstone: Your Enterprise Copilot Roadmap',
    'This capstone asks for one deliverable: a Copilot and agentic AI adoption roadmap for your own organisation (or one you know well), specific enough that a real decision-maker could act on it. It.',
    'This capstone asks for one deliverable: a Copilot and agentic AI adoption roadmap for your own organisation (or one you know well), specific enough that a real decision-maker could act on it. It should draw on every course in this program — foundational understanding of what the tools are, prompting skill, the specific product and business-function applications, automation and agent-building, developer and architecture considerations, and the governance, security, and leadership material in this final course.

A strong roadmap names two to four specific use cases prioritised by value and feasibility (from the adoption strategy lesson), states the governance prerequisites that must be in place before each one launches (data permission cleanup, policy decisions, identity and security review), includes a realistic timeline that accounts for the adoption and tuning curve rather than assuming instant value, and names who owns each use case after launch — every element is something this course has given you a specific lesson to draw on, not an abstraction to invent from scratch.

The test of a good capstone roadmap is whether it survives contact with a sceptical reviewer: does it acknowledge real risks and name real mitigations, rather than presenting AI adoption as costless and inevitable; does it name specific people and specific decisions, rather than staying at the level of ''we should explore AI''; and does it reflect genuine judgement about this specific organisation''s readiness, rather than a generic template that could apply to any company. That specificity, more than any individual technique from this course, is what separates a roadmap that gets funded from one that gets filed away.',
    array['Synthesise the full course into a concrete adoption roadmap for a real organisation','Apply prioritisation, governance, and change management together in one plan','Produce a roadmap specific enough to actually present to a decision-maker'],
    array['The roadmap should draw on every course: fundamentals, prompting, applications, automation, architecture, governance','Name two to four prioritised use cases with explicit governance prerequisites and a realistic timeline','Name a specific owner for each use case after launch, not a general department','Specificity about real risks, real decisions, and this organisation''s actual readiness is what gets a roadmap funded'],
    'Write your capstone roadmap: two to four prioritised use cases, their governance prerequisites, a realistic timeline, and a named owner for each, for your own organisation.',
    false, 'draft', 'hybrid'
  );

end $$;
