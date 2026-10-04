-- ============================================================
-- Seed: Claude for Developers — Building with the API
-- Written 2026-10-04, at BK's request for an additional Claude
-- program alongside "Claude AI for Professionals".
--
-- This is a wholly new, additive course row (slug
-- 'claude-for-developers') and does not modify any existing course,
-- module, lesson, assessment, payment, certificate, authentication,
-- or learner-identity data. Inserted as status = 'draft' throughout
-- (course/modules/lessons/assessment), generation_mode = 'hybrid' --
-- same convention as supabase/seeds/003 (the ChatGPT flagship course)
-- and this session's Claude AI for Professionals content pass. Needs
-- your review and a status flip to 'published' before it's live,
-- same as any other draft course.
--
-- Technical claims in the lesson bodies (tool use, prompt caching,
-- extended thinking, vision, streaming) were checked against
-- platform.claude.com's current docs on 2026-10-04 rather than
-- written from memory. Specific pricing multipliers and exact model
-- name strings are deliberately NOT quoted in the lesson text, since
-- those change over time -- lessons point learners to
-- platform.claude.com/docs for current figures instead, so the
-- content doesn't go stale.
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
    'claude-for-developers',
    'Claude for Developers: Building with the API',
    'Go from your first API call to a working tool-using agent, built on Claude the right way',
    'A 4-module, 12-lesson course for developers and technical builders who want to use the Claude API directly -- covering the Messages API and system prompts, tool use (function calling), vision and document input, prompt caching, extended thinking, a basic agent loop, Claude Code, and the error-handling, evaluation and safety practices that separate a demo from something you''d actually ship.',
    'AI Advanced', 'Intermediate', '🔌', '#0E7C86',
    29900, true, 12, 'draft', 'public',
    v_domain_id,
    array['Make a working Claude API call and structure a multi-turn conversation correctly','Design an effective system prompt and explain how it differs from a user message','Give Claude tools (function calling) and handle the full tool-use request/response loop','Send images and documents to Claude and get structured, useful output back','Use prompt caching to cut cost and latency on repeated or long-context requests','Use extended thinking appropriately for problems that benefit from visible step-by-step reasoning','Build a simple agent loop that calls tools repeatedly until a task is done','Handle errors, rate limits and retries the way a production integration should','Write a small evaluation set to test whether a prompt change actually helped','Apply Anthropic''s safety and responsible-deployment guidance to your own integration'],
    array['Software developers and engineers adding Claude to a product or internal tool','Technical professionals comfortable reading code (Python or JavaScript) who want to go beyond Claude.ai','Anyone who has completed Claude AI for Professionals and wants to build, not just use'],
    array['Comfortable reading and writing basic code (Python or JavaScript)','An Anthropic API key (a free account can be created to follow along)','Claude AI for Professionals is a helpful but not required prior course'],
    array['The Claude Messages API','System prompts and multi-turn conversation design','Tool use / function calling','Vision and document input','Prompt caching','Extended thinking','Basic agent design','Production error handling','Prompt evaluation','Responsible AI deployment'],
    6.5, 'hybrid'
  ) returning course_id into v_course_id;

  -- ---- Module 1: Getting Started with the API ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 1, 'Getting Started with the API',
    'Making your first call, understanding the pieces of a request, and designing a proper system prompt.',
    array['Make a successful Claude API call and read the response.','Explain the difference between a system prompt and a user message.','Hold a correct multi-turn conversation by managing message history yourself.'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    1, 'Your First API Call',
    'Everything in this course builds on one basic shape: a request to the Messages API, and a response back. This lesson gets that working end to end.',
    'Using Claude through Claude.ai and using Claude through the API are two different things built on the same model. The API is how you put Claude inside your own product, script, or internal tool -- and the basic unit of interaction is the Messages API.

### The shape of a request
A Messages API call needs, at minimum: which model to use, a maximum number of tokens to generate, and a list of messages (each with a role -- "user" or "assistant" -- and content). You send that as a request using Anthropic''s official SDK for your language (Python and TypeScript/JavaScript are both officially supported, with community SDKs for other languages), or as a raw HTTP request if you prefer.

### Reading the response
The response comes back with the generated content, a stop reason (why the model stopped generating -- it finished naturally, hit the max token limit, was stopped by a tool call, or a few other reasons covered later in this course), and token-usage counts for both the input and output. That usage data matters from day one: it''s how you''ll understand and control cost as you build.

### A minimal working example
In Python, using Anthropic''s official SDK, a basic call looks like:

```python
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from the environment

response = client.messages.create(
    model="claude-sonnet-5",  # check platform.claude.com/docs for the current model lineup
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explain what a Messages API is, in two sentences."}
    ]
)
print(response.content)
```

### Keep your API key out of your code
Store your API key as an environment variable, never hard-coded in a file you might commit to version control or share. This matters more than it might seem -- a leaked API key is billed to you and can be used by anyone who finds it. This is covered in more depth in Module 4; start the habit now.',
    array['Make a working call to the Claude Messages API using an official SDK.','Identify the required parts of a request: model, max_tokens, and messages.','Read the stop_reason and token-usage data in a response.'],
    array['The Messages API is the basic building block for every integration in this course.','A request needs a model, a max_tokens limit, and a list of role-tagged messages.','The response includes a stop_reason and token-usage counts -- both matter for cost control.','Never hard-code an API key in source code; use an environment variable.'],
    'Create a free Anthropic API account if you don''t have one, install the official SDK for your preferred language, and make one successful call asking Claude to explain something in exactly two sentences. Print the full response object, not just the text, and identify the stop_reason and token counts in it.',
    true, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    2, 'System Prompts and Message Design',
    'A system prompt shapes how Claude behaves for the whole conversation. Getting it right is one of the highest-leverage things you''ll do as a developer building with Claude.',
    'The system prompt is a separate field from your messages, and it plays a different role: it sets persistent context and instructions for the whole conversation, rather than being one turn within it.

### What belongs in a system prompt
Put here: who Claude should act as for this application, what it should and shouldn''t do, formatting expectations for its responses, and any stable background context the whole conversation needs (your product''s terminology, a persona, output constraints). What doesn''t belong here: the user''s actual question or request -- that goes in the messages array as a user turn, not folded into the system prompt.

### A concrete example
A customer-support bot''s system prompt might read: "You are a support assistant for [Product]. Answer only questions about [Product]''s features and troubleshooting. If asked about something unrelated, politely redirect. Keep responses under 150 words unless the user asks for more detail. If you don''t know the answer, say so and offer to escalate to a human." That''s specific, behavioral, and stable across every conversation this bot has -- exactly what belongs in a system prompt.

### Managing multi-turn conversations
The API itself is stateless -- it doesn''t remember previous calls for you. To hold a multi-turn conversation, your application appends each new user message and each Claude response to a growing messages array, and sends the whole history with every request. This is a common point of confusion for developers new to the API: "memory" is something your application manages, not something the API provides automatically.

### A practical pattern
Keep your system prompt in its own version-controlled file or constant, separate from your application logic, and treat changes to it with the same care as a code change -- test before and after, since a small wording change can shift behavior more than you''d expect.',
    array['Explain what belongs in a system prompt versus a user message.','Write a specific, behavioral system prompt for a given use case.','Correctly manage multi-turn conversation history, since the API itself is stateless.'],
    array['The system prompt sets persistent, stable instructions -- not the user''s actual request.','A good system prompt is specific and behavioral, not vague.','The API is stateless: your application must resend the growing message history for multi-turn context.','Treat system prompt changes like code changes -- test before and after.'],
    'Write a system prompt for a use case relevant to your own work (a support bot, an internal tool, a writing assistant). Make one API call using it, then have a second, follow-up turn by correctly appending both messages to the array and sending the full history again.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    3, 'Streaming Responses',
    'For anything user-facing, streaming is usually the right default. This lesson covers why, and how the API delivers it.',
    'Without streaming, your application waits for Claude to generate the entire response before it receives anything -- which can mean a user stares at a blank screen for several seconds on a long response. Streaming changes that.

### What streaming actually does
With streaming enabled, the API sends the response back as a series of small events as they''re generated, rather than one block at the end. Your application can start displaying text as it arrives -- the same experience you''re used to from Claude.ai itself, where the response appears progressively rather than all at once.

### When to use it
For any user-facing, interactive feature -- a chat interface, a live writing assistant, anything where a person is watching and waiting -- streaming substantially improves perceived responsiveness, even though the total generation time is roughly the same. For backend, non-interactive tasks (batch-processing a thousand documents overnight, for instance), streaming usually isn''t worth the added implementation complexity, since nobody''s watching it arrive.

### The basic shape, conceptually
Official SDKs provide a streaming helper that yields events as they arrive -- typically text deltas (small chunks of generated text) plus a final event once the response is complete. Your application listens for these events and appends each chunk to what''s displayed, rather than requesting the whole response and waiting.

### A common mistake to avoid
Don''t reach for streaming by default for every integration without thinking about whether anyone''s actually watching in real time. It adds real implementation complexity -- handling partial, incomplete JSON if you''re also using structured output, managing connection drops mid-stream -- that isn''t worth paying for in a backend job nobody''s watching.',
    array['Explain what streaming does differently from a standard (non-streaming) API response.','Identify when streaming is worth the added implementation complexity, and when it isn''t.','Describe the basic event-based shape of a streamed response.'],
    array['Streaming delivers the response progressively, as small events, instead of one block at the end.','It meaningfully improves perceived responsiveness for interactive, user-facing features.','For non-interactive backend tasks, streaming''s added complexity usually isn''t worth it.','Streaming adds real complexity -- partial data handling, dropped connections -- so use it deliberately, not by default.'],
    'Take the API call you made in Lesson 1 and modify it to use your SDK''s streaming mode instead. Print each chunk as it arrives rather than waiting for the full response, and notice the difference in how it feels.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 2: Building Real Features ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 2, 'Building Real Features',
    'The three capabilities that turn a simple chatbot into something genuinely useful: tools, vision and documents, and caching for cost control.',
    array['Give Claude tools and correctly handle the full request/response loop.','Send images and documents to Claude and extract structured, usable information.','Apply prompt caching to a request with stable, repeated content.'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    4, 'Tool Use and Function Calling',
    'Tool use is what lets Claude actually do things -- look up real data, call an internal API, run a calculation -- instead of only generating text. This is the single most important capability for building real applications.',
    'Tool use (also called function calling) lets you give Claude a set of tools it can choose to call, each with a name, a description, and an input schema describing the parameters it needs. Claude decides, based on the conversation, whether and when to use one.

### The request/response loop
When Claude decides to use a tool, it always takes at least two round trips. First, you send a request with your tools included; if Claude decides a tool is needed, the response comes back with stop_reason "tool_use" and a block describing which tool and what input. Your application then actually runs that tool -- calls your real API, queries your real database, whatever the tool represents -- and sends the result back to Claude as a new message. Claude then uses that result to generate its actual answer to the user.

### Writing a good tool definition
The description you write for each tool matters enormously -- it''s what Claude uses to decide whether and how to call it, the same way a clear docstring helps a human developer use a function correctly. A vague description ("looks up stuff") leads to Claude calling it at the wrong times or with wrong parameters; a precise one ("get_weather: returns current weather conditions for a specific city; requires a city name and optional state/country for disambiguation") gets reliable results.

### Client tools versus server tools
Tools you define and execute yourself (your own API calls, your own database) are client tools. Anthropic also offers some built-in server tools that Claude can call directly without your application executing anything -- these vary over time, so check platform.claude.com/docs for what''s currently available rather than assuming.

### Controlling whether Claude uses tools
You can let Claude decide freely whether to use a tool, force it to use one specific tool, or force it to use some tool (any of them) rather than respond in plain text -- useful when you want a guaranteed structured action rather than a conversational reply.',
    array['Explain the multi-turn request/response loop that tool use requires.','Write a tool definition with a clear name, description, and input schema.','Distinguish client tools (you execute) from server tools (Anthropic executes).'],
    array['Tool use requires at least two API calls: one to get the tool request, one to return the result.','A clear, precise tool description is what makes Claude call it correctly -- treat it like a good function docstring.','Client tools are ones you execute yourself; server tools are built-in and executed by Anthropic.','tool_choice lets you control whether Claude decides freely, must use a specific tool, or must use some tool.'],
    'Define one simple tool relevant to something you''d actually build (a lookup, a calculation, a status check). Write its name, description, and input schema. Send a request that should trigger it, handle the tool_use response by returning a made-up result, and confirm Claude uses that result in its final answer.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    5, 'Vision: Images and Documents',
    'Claude can take images and documents directly as input, not just text. This lesson covers how to send them and what to ask for.',
    'Beyond plain text, the Messages API accepts image and document content blocks directly in a message -- meaning Claude can look at a screenshot, a scanned form, a chart, or a PDF, and reason about what it sees alongside your text instructions.

### Sending an image
An image is sent as a content block alongside your text, either as base64-encoded data or (depending on what your SDK and account support) a URL. A single message can combine text and one or more images -- useful for "compare these two screenshots" or "what''s different between image 1 and image 2" style tasks, not just single-image description.

### Sending documents (including PDFs)
For PDFs specifically, Claude can process the document directly -- reading both the text and the visual layout, including tables, charts, and figures a plain text-extraction tool would miss or mangle. This is genuinely useful for the kind of messy, real-world documents (scanned forms, reports with embedded charts) that are hard to handle with text extraction alone.

### Asking the right kind of question
As with document analysis in Claude.ai itself, specific questions beat vague ones: "extract the total and due date from this invoice as JSON" gets a more useful, reliable result than "what''s in this document?" If you need the output in a specific structure for your application to parse, say so explicitly and show the exact shape you want.

### Practical limits to know
There are limits on image size/resolution and on document length (page count) that affect what Claude can process in a single request -- these specifics change over time, so check platform.claude.com/docs for current limits before building something that assumes a particular ceiling.',
    array['Send an image to Claude as part of a message and get a response based on its content.','Send a PDF document and extract specific information from it, including non-text elements like tables or charts.','Ask vision/document questions specifically enough to get structured, reliable output.'],
    array['Images and documents are sent as content blocks alongside text in a message.','Claude can read a PDF''s visual layout -- tables, charts, figures -- not just extracted text.','Specific questions ("extract X as JSON") get more reliable results than vague ones ("what''s in this?").','Size and length limits exist and change over time -- check current docs before assuming a ceiling.'],
    'Take a real document with at least one table or chart (an invoice, a report page, a scanned form). Send it to Claude with a specific extraction request, asking for the output in a structured format (e.g. JSON) your own code could parse.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    6, 'Prompt Caching for Cost and Speed',
    'If your application sends the same long system prompt, document, or tool definitions on every request, prompt caching is close to a free win on both cost and latency.',
    'Prompt caching lets the API reuse a previously-processed prefix of your prompt instead of reprocessing it from scratch on every request -- which matters a great deal once you have a large, stable system prompt, a long reference document, or a big set of tool definitions that doesn''t change between calls.

### Where it pays off most
The clearest wins are: a long, mostly-static system prompt sent on every request; a large reference document (a style guide, a product manual, a legal template) that stays the same across many conversations; and a substantial set of tool definitions that doesn''t change call to call. Caching any of these means Claude doesn''t reprocess that content from scratch every single time -- meaningfully cutting both cost and time-to-first-token on every request after the first.

### How you mark something for caching
You mark a point in your request as a cache breakpoint, and the API handles the rest -- checking whether that prefix was recently cached, reusing it if so, and caching it fresh if not. There''s a minimum content length below which caching isn''t worth it (very short content won''t benefit), and a cached entry has a limited lifetime before it expires and needs to be re-cached -- check platform.claude.com/docs for the current minimums and cache lifetimes, since these are the kind of specifics that get tuned over time.

### What doesn''t belong in a cached section
Anything that changes on every single request -- the user''s actual message, a timestamp, a per-request ID -- shouldn''t be inside your cached prefix, since a cache only helps when the content is actually identical across calls. Structure your request so the stable part (system prompt, reference document, tools) comes first and is marked for caching, and the per-request part (the user''s message) comes after, unmarked.

### A realistic mental model
Think of it like a warm cache in any backend system you''ve built: the first call pays a bit more to populate the cache, and every call after that -- as long as it''s within the cache''s lifetime -- is substantially cheaper and faster, because the expensive, repeated part doesn''t need to be redone.',
    array['Identify which parts of a typical request (system prompt, documents, tools) are good caching candidates.','Explain the difference between a cache "write" and a cache "hit" conceptually.','Structure a request so stable, cacheable content is separated from per-request content.'],
    array['Prompt caching reuses a previously-processed prefix instead of reprocessing it every request.','Best candidates: large static system prompts, long reference documents, stable tool definitions.','Content that changes every request shouldn''t be inside a cached section.','First request pays slightly more (a cache write); subsequent requests within the cache lifetime are cheaper and faster.'],
    'Look at a request you''ve built in this course that includes a system prompt or document. Identify which part is stable across calls and which part changes every time. Sketch (in comments or a short writeup, no need to run it) how you''d mark the stable part as a cache breakpoint.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 3: Agents and Extended Reasoning ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 3, 'Agents and Extended Reasoning',
    'Using extended thinking for genuinely hard problems, chaining tool calls into a basic agent loop, and a look at Claude Code as a working example.',
    array['Decide when extended thinking is worth using for a given task.','Build a basic agent loop that calls tools repeatedly until a task is complete.','Explain what Claude Code is and how it illustrates agentic tool use in practice.'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    7, 'Extended Thinking for Hard Problems',
    'For genuinely difficult problems -- multi-step logic, careful planning, tricky code -- extended thinking lets Claude reason through the problem more thoroughly before answering.',
    'Extended thinking is a mode where Claude generates visible, step-by-step reasoning before producing its final answer, for problems that benefit from working through the logic carefully rather than answering immediately.

### When it genuinely helps
Extended thinking tends to help most on problems with real logical depth: multi-step math or logic problems, intricate planning tasks, debugging subtle code issues, or any case where you''d want a sharp human colleague to visibly "think out loud" before committing to an answer rather than responding instantly. It''s not a universal upgrade -- for simple, direct questions, it adds latency and cost without meaningfully improving the answer.

### What you get back
With extended thinking enabled, the response includes the reasoning itself as a distinct part of the output, separate from the final answer. This is genuinely useful for your own debugging and trust-building during development -- you can see where Claude''s reasoning went right or wrong -- though most end-user-facing applications show only the final answer, not the full reasoning trace, to the person using the product.

### Deciding when to turn it on
A practical rule: reach for extended thinking when a task has multiple interdependent steps, requires weighing several factors against each other, or is the kind of problem where a rushed first instinct is often wrong. For straightforward lookups, simple rewrites, or classification tasks, standard (non-extended) responses are faster, cheaper, and just as accurate.

### A note on cost and latency
Extended thinking uses more tokens and more time than a standard response, proportional to how much reasoning the problem actually needs. Budget for this deliberately in latency-sensitive applications -- it''s the right tool for some tasks in your application and the wrong one for others, not a blanket setting to turn on everywhere.',
    array['Explain what extended thinking does differently from a standard response.','Identify the kinds of tasks that genuinely benefit from extended thinking.','Weigh the latency/cost trade-off of extended thinking against task complexity.'],
    array['Extended thinking produces visible, step-by-step reasoning before the final answer.','It helps most on genuinely multi-step, logic-heavy, or planning-heavy tasks.','The reasoning trace is useful for your own development and debugging, less often shown to end users.','It costs more time and tokens -- use it deliberately for tasks that need it, not as a default.'],
    'Pick one task you''ve tried earlier in this course that involves some logical complexity (a multi-step calculation, a planning task). Run it once with a standard request and once with extended thinking enabled, and compare the two outputs.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    8, 'Building a Simple Agent Loop',
    'An "agent" is really just tool use, looped: Claude keeps calling tools and reasoning about results until the task is actually done. This lesson builds the simplest version of that loop.',
    'Everything you need for a basic agent is already covered: tool use from Lesson 4, and a conversation that keeps going rather than stopping after one tool call. An agent loop is that combination, repeated until the task is complete.

### The basic loop
Send a request with your tools. If the response has stop_reason "tool_use", execute the requested tool, append both Claude''s tool-use message and your tool result to the conversation, and send the whole thing back. Repeat this until Claude responds with a normal text answer instead of another tool call -- that''s your signal the task is done. In code, this is usually a simple loop: keep calling the API and executing tools until stop_reason is no longer "tool_use".

### Giving the agent room to actually finish
A common early mistake is giving an agent only one tool call''s worth of budget, then being surprised it can''t complete a task that genuinely needs three or four steps -- look something up, use that result to look up something else, then compute a final answer. Let the loop run until the task is actually done (with a sensible upper limit on iterations, covered next), rather than assuming one call will be enough.

### Setting a sensible stopping point
Always cap the number of iterations your loop will run before giving up and surfacing an error -- an agent that gets stuck in an unproductive loop (repeatedly calling the same tool, or oscillating between two tools without progress) should fail gracefully and visibly, not run indefinitely or silently. A simple iteration counter with a reasonable maximum (start around 5-10 for most tasks, tune based on what you''re building) is enough for a first version.

### Where this goes next
This simple loop is the conceptual core of every more sophisticated agent framework you''ll encounter -- they add retry logic, parallel tool calls, more structured planning, and error recovery on top of exactly this pattern. Understanding the basic loop first means you''ll understand what any framework is actually doing underneath, rather than treating it as a black box.',
    array['Build a loop that executes tools and continues the conversation until the task is complete.','Explain why an agent needs the ability to make several tool calls in sequence, not just one.','Set a sensible maximum-iteration limit so an agent fails gracefully rather than looping indefinitely.'],
    array['An agent loop repeats tool use until Claude responds with a final answer instead of another tool call.','Give the loop room to make several sequential tool calls for tasks that genuinely need them.','Always cap the number of iterations so a stuck agent fails visibly rather than looping forever.','This basic loop is the conceptual core underneath more sophisticated agent frameworks.'],
    'Using the tool you defined in Lesson 4''s practice task (or a new simple one), build a loop that keeps calling the API and executing tool requests until Claude returns a normal text answer. Add an iteration cap and test what happens when you deliberately set it too low.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    9, 'Claude Code and Developer Tooling',
    'Claude Code is Anthropic''s own agentic coding tool, and it''s a genuinely useful worked example of everything this module just covered -- tool use and an agent loop, applied to real software development.',
    'Claude Code is Anthropic''s command-line and IDE-integrated tool that lets Claude read your codebase, make edits, run commands, and iterate -- an agent, in the sense covered in the last lesson, purpose-built for software development work.

### Why it''s worth studying, even if you won''t build something identical
Claude Code is a production example of the exact pattern from Lesson 8: Claude decides it needs to read a file, inspect a test result, or run a command (tool calls), executes them, sees the results, and continues -- looped until the coding task is done. Spending time using it, and noticing how it asks for confirmation before certain actions, how it reports what it''s doing, and how it recovers when something fails, is a genuinely useful way to see agent design decisions made well, in a tool you can actually use today.

### Getting started with it
Claude Code is installed as a command-line tool (an npm package, for those familiar with Node.js tooling) and run from within a project directory, where it can read the surrounding code for context. It supports both an interactive terminal session and more autonomous, task-based use, depending on how much oversight you want for a given piece of work.

### What it illustrates about safe agent design
Claude Code''s permission model -- asking before certain classes of action, keeping a visible log of what it did and why -- is worth studying as a pattern for your own agents, not just as a feature of this particular tool. Any agent you build that takes real-world actions (modifying files, calling external APIs, spending money) benefits from the same instincts: confirm before anything hard to undo, keep a visible trail, and give the person using it an easy way to see and stop what''s happening.

### Where to go deeper
This lesson is deliberately a conceptual overview, not a full tutorial -- Claude Code has its own complete documentation, and the best way to actually learn it is to install it and use it on a real small project. Check platform.claude.com''s Claude Code documentation for current setup instructions and capabilities.',
    array['Explain what Claude Code is and how it applies the agent-loop pattern to software development.','Identify the permission/confirmation patterns Claude Code uses and why they matter for safe agent design.','Know where to find current setup instructions for trying Claude Code on a real project.'],
    array['Claude Code is Anthropic''s agentic coding tool -- a production example of the Lesson 8 agent-loop pattern.','It reads code, makes edits, runs commands, and iterates, looped until a coding task is complete.','Its permission model (confirm before hard-to-undo actions, visible action log) is a pattern worth reusing in your own agents.','This lesson is a conceptual overview -- the real learning happens by installing and using it on a real project.'],
    'If you have a coding environment available, install Claude Code and try it on one small, real task in an existing project (fixing a small bug, adding a simple function). Pay attention to when it asks for confirmation before acting, and note one design choice you''d want to borrow for an agent of your own.',
    false, 'draft', 'hybrid'
  );

  -- ---- Module 4: Shipping Responsibly ----
  insert into public.modules (course_id, module_number, title, description, objectives, status, generation_mode)
  values (
    v_course_id, 4, 'Shipping Responsibly',
    'The practices that separate a working demo from something you''d actually put in front of real users: error handling, evaluation, and safety.',
    array['Handle API errors, rate limits, and retries the way a production integration should.','Write a small evaluation set to test whether a prompt or system change actually helped.','Apply Anthropic''s safety and responsible-deployment guidance to your own integration.'],
    'draft', 'hybrid'
  ) returning module_id into v_module_id;

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    10, 'Error Handling, Rate Limits, and Retries',
    'Every demo works on the happy path. A production integration also has to handle the request that fails, times out, or gets rate-limited -- gracefully, not with a crash.',
    'Anything calling an external API in production will eventually hit an error -- a rate limit, a timeout, a malformed request, a transient service issue. The difference between a demo and something shippable is how it handles that moment.

### The error categories worth planning for
Broadly: rate-limit errors (you''ve sent requests faster than your account''s limit allows), authentication errors (a bad or expired API key -- should never happen in production if your key management is solid, but worth handling anyway), request errors (something wrong with what you sent, like exceeding a token limit), and transient server-side errors (temporary issues on Anthropic''s end, which are the ones worth automatically retrying). Treat these differently: retrying an authentication error endlessly wastes time on something that won''t fix itself, while a transient error often resolves on retry.

### Retries with backoff
For the errors worth retrying, use exponential backoff -- wait a short time before the first retry, then progressively longer before each subsequent one, rather than retrying immediately and repeatedly, which can make a rate-limit situation worse rather than better. Most official SDKs include built-in retry handling you can configure rather than needing to write this yourself.

### Designing for graceful degradation
Decide, for your specific application, what should happen when a call ultimately fails after retries: show the user a clear, honest error rather than a generic crash; fall back to cached or default content if that''s appropriate for your use case; or queue the request for a later retry if the task isn''t time-sensitive. The wrong answer is almost always a silent failure the user can''t make sense of.

### Rate limits are a design input, not just an error to catch
If your application''s expected usage is anywhere near your account''s rate limits, that''s a capacity-planning question to think through before launch, not just an error-handling question -- check platform.claude.com/docs for current limits and how to request an increase if your use case needs one.',
    array['Distinguish the main categories of API errors and how each should be handled differently.','Implement retries with exponential backoff for transient errors.','Design a graceful degradation path for when a call ultimately fails.'],
    array['Not all errors should be retried the same way -- rate limits and transient errors differ from bad requests or auth failures.','Exponential backoff avoids making a rate-limit situation worse with immediate, repeated retries.','Most official SDKs include configurable built-in retry handling.','Design an explicit, honest fallback for when a call ultimately fails -- never a silent crash.'],
    'Take any API call you''ve built in this course and add explicit error handling: catch at least two different error categories, apply exponential backoff for the retryable one, and define what the user sees if the call ultimately fails.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    11, 'Evaluating and Testing Your Prompts',
    'When you change a prompt, how do you know if you made it better or worse? This lesson covers building a small, honest evaluation set instead of guessing from a handful of manual tries.',
    'Prompt changes are easy to make and deceptively hard to judge well by eye -- a prompt that looks better on the three examples you happened to try can easily be worse on the cases you didn''t think to check.

### Start with a small, real test set
Collect 10-20 real or realistic examples of the kind of input your application will actually see, covering typical cases and a few deliberately tricky edge cases. This doesn''t need to be elaborate -- a spreadsheet or a simple JSON file with inputs and what you''d consider a good output is enough to start.

### Define what "good" means, concretely
For tasks with a clearly right or wrong answer (data extraction, classification), you can often check correctness automatically by comparing output to an expected answer. For more open-ended tasks (writing quality, tone), you''ll need a rubric -- specific, written criteria you (or, for scale, Claude itself) can judge consistently against, rather than a vague "does this feel right?" gut check.

### Run your test set before and after a change
Before changing a prompt or system message, run your full test set and record the results as a baseline. After the change, run it again and compare -- not just "did it get better on average" but specifically "did anything that used to work now fail?" A change that improves the average while silently breaking a case that used to work is a regression, not an improvement, and an eyeball comparison on a couple of examples won''t catch it.

### Keep this lightweight, especially early on
This doesn''t need to be a heavyweight testing framework from day one -- a simple script that loops through your test cases, calls the API, and prints a pass/fail or score for each is enough to start catching regressions. Build it out further as your application and its prompts get more complex, not before.',
    array['Build a small test set of realistic inputs for a given task.','Define concrete, checkable criteria for what counts as a good output.','Compare before-and-after results on a full test set rather than judging a prompt change by eye.'],
    array['A prompt change that looks better on a few manual examples can regress on cases you didn''t check.','A test set of 10-20 realistic examples, including edge cases, is enough to start.','Define concrete criteria ("good") for open-ended tasks instead of a vague gut check.','Run your full test set before and after a change, and watch for regressions, not just average improvement.'],
    'Build a test set of 10 realistic inputs for one task from this course. Define, in writing, what counts as a good output for each. Run them through your current prompt, then make one deliberate change and run them again, checking specifically for anything that got worse.',
    false, 'draft', 'hybrid'
  );

  insert into public.lessons
    (module_id, course_id, lesson_number, title, description, body, objectives, key_points, practice_task, is_free_preview, status, generation_mode)
  values (
    v_module_id, v_course_id,
    12, 'Safety, Guardrails, and Responsible Deployment',
    'The closing lesson: the practices that keep an application you''ve built genuinely safe to put in front of real users, not just functionally working.',
    'Everything in this course has been about making Claude do useful things reliably. This last lesson is about the layer on top of that: making sure what you''ve built behaves well when a real, unpredictable user is on the other end.

### Know Anthropic''s usage policies, and build to them
Anthropic publishes usage policies covering what Claude should and shouldn''t be used for. Read them before shipping anything that handles real user input, and make sure your system prompt and application design are consistent with them -- this isn''t just a compliance checkbox, it reflects genuinely important considerations about what a deployed AI system should and shouldn''t do.

### Guardrails beyond the model itself
Don''t rely solely on Claude''s own judgment for everything -- add application-level checks appropriate to your use case: input validation before a request reaches Claude, output checks before a response reaches a user (especially for anything that will be acted on automatically, like a tool call with real-world effects), and rate limiting or abuse detection on your own application layer, separate from Anthropic''s own API rate limits.

### Human oversight for consequential actions
For anything your application does that''s hard to undo or has real consequences -- sending an email on someone''s behalf, modifying a record, spending money, anything a tool call might trigger -- build in a human confirmation step rather than letting an agent act fully autonomously, especially early in a product''s life before you''ve built confidence in how it behaves across a wide range of real inputs. This is the same instinct Claude Code''s permission model reflected in the previous lesson, applied to whatever you''re building.

### Treat this as ongoing, not a launch-day checklist
Responsible deployment isn''t something you finish once before launch -- it''s monitoring how your application actually behaves on real traffic, watching for the unexpected inputs and edge cases that no evaluation set fully anticipates, and being willing to add a guardrail or walk back a capability if real-world use reveals a problem your testing didn''t catch.

### Closing thought for this course
You now have the full technical picture: calls, system prompts, tools, vision, caching, extended thinking, a basic agent loop, error handling, evaluation, and safety. The thing that separates a strong integration from a mediocre one usually isn''t a missing technical feature -- it''s the care taken in exactly the areas this last module covered.',
    array['Identify Anthropic''s usage policies as a design input, not just a compliance afterthought.','Apply application-level guardrails (input validation, output checks, rate limiting) independent of the model itself.','Design human-confirmation steps for consequential, hard-to-undo actions.'],
    array['Read and build to Anthropic''s usage policies before shipping anything handling real user input.','Add application-level guardrails -- don''t rely solely on the model''s own judgment.','Build human confirmation into any action that''s hard to undo or has real consequences.','Responsible deployment is ongoing monitoring, not a one-time launch checklist.'],
    'Review the system prompt and tool definitions from something you built earlier in this course. Identify one consequential or hard-to-undo action it could take, and design a human-confirmation step for it. Note one application-level guardrail (beyond what Claude itself does) you''d add before shipping it for real.',
    false, 'draft', 'hybrid'
  );

  -- ---- Final evaluation ----
  insert into public.assessments
    (course_id, title, description, assessment_type, pass_threshold, status, app_id)
  values (
    v_course_id, 'Claude for Developers — Course Evaluation',
    'Test your knowledge of building with the Claude API.', 'final_exam', 60, 'draft', 'academy'
  ) returning assessment_id into v_assessment_id;

  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  values (
    v_assessment_id, 1, 'mcq',
    'Why is the Claude API described as "stateless" between calls?',
    'Module 1 covers that the API does not remember previous calls on its own -- your application must resend the growing message history with every request to maintain a multi-turn conversation.',
    1, 1
  ) returning question_id into v_question_id;
  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'It only accepts one message per conversation ever', false, 1),
    (v_question_id, 'It does not remember prior calls -- your application must resend message history each time', true, 2),
    (v_question_id, 'It requires a database to function at all', false, 3),
    (v_question_id, 'It automatically forgets the system prompt after one turn', false, 4);

  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  values (
    v_assessment_id, 2, 'mcq',
    'When Claude decides to use a tool you''ve defined, what does the API response contain?',
    'Module 2 covers that the response comes back with stop_reason "tool_use" and a block naming the tool and its input -- your application then executes it and returns the result in a follow-up message.',
    1, 2
  ) returning question_id into v_question_id;
  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'The final answer, with the tool already executed automatically', false, 1),
    (v_question_id, 'An error, since tools cannot be used mid-conversation', false, 2),
    (v_question_id, 'A stop_reason of "tool_use" plus the tool name and input to execute yourself', true, 3),
    (v_question_id, 'A request to upgrade your API plan', false, 4);

  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  values (
    v_assessment_id, 3, 'mcq',
    'What kind of content is the best candidate for prompt caching?',
    'Module 2 covers that stable, repeated content -- a large system prompt, a reference document, tool definitions -- benefits most, while content that changes every request does not.',
    1, 3
  ) returning question_id into v_question_id;
  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'The user''s specific question, since it''s the most important part', false, 1),
    (v_question_id, 'A timestamp included in every request', false, 2),
    (v_question_id, 'A large, stable system prompt or reference document reused across many requests', true, 3),
    (v_question_id, 'Random data, to test the cache mechanism', false, 4);

  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  values (
    v_assessment_id, 4, 'mcq',
    'What should an agent loop do when it hits its maximum iteration limit without completing the task?',
    'Module 3 covers that an agent should fail gracefully and visibly when stuck, rather than looping indefinitely or failing silently.',
    1, 4
  ) returning question_id into v_question_id;
  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'Keep looping indefinitely until it eventually succeeds', false, 1),
    (v_question_id, 'Fail silently and return an empty response', false, 2),
    (v_question_id, 'Stop and surface a clear, visible error rather than looping or failing silently', true, 3),
    (v_question_id, 'Restart the whole conversation from scratch automatically', false, 4);

  insert into public.assessment_questions
    (assessment_id, question_number, question_type, question_text, explanation, points, sort_order)
  values (
    v_assessment_id, 5, 'mcq',
    'What is the recommended way to retry a request after a transient, server-side API error?',
    'Module 4 covers exponential backoff -- waiting progressively longer between retries -- rather than immediate, repeated retries, which can worsen a rate-limit situation.',
    1, 5
  ) returning question_id into v_question_id;
  insert into public.assessment_options (question_id, option_text, is_correct, sort_order) values
    (v_question_id, 'Retry immediately and repeatedly until it succeeds', false, 1),
    (v_question_id, 'Use exponential backoff -- wait progressively longer between retries', true, 2),
    (v_question_id, 'Never retry; always surface the error to the user immediately', false, 3),
    (v_question_id, 'Switch to a different API provider automatically', false, 4);

end $$;
