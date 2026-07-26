# Course Standards

**Barada Academy — Course Creation & Quality Standards**
Last updated: July 2025

---

## Table of Contents

1. [Philosophy](#1-philosophy)
2. [Course Structure](#2-course-structure)
3. [Lesson Standards](#3-lesson-standards)
4. [Slide Deck Standards](#4-slide-deck-standards)
5. [Quiz & Assessment Standards](#5-quiz--assessment-standards)
6. [Certificate Standards](#6-certificate-standards)
7. [Accessibility Standards](#7-accessibility-standards)
8. [Naming Conventions](#8-naming-conventions)

---

## 1. Philosophy

Every Barada Academy course must meet three criteria:

**Practical.** Every lesson contains at least one thing a learner can do at their job tomorrow. We do not teach theory for its own sake.

**Honest.** We state clearly what a course covers and does not cover. We do not overpromise. Prerequisites are listed accurately.

**Respectful of time.** Lessons are the stated duration — not padded. We earn every minute of a learner's attention.

---

## 2. Course Structure

### Required structure

Every Barada Academy course must contain:

```
Course
├── 4 modules (required)
│   ├── Module 1: Foundations (3–4 lessons)
│   ├── Module 2: Intermediate (4–5 lessons)
│   ├── Module 3: Advanced / Applied (3–4 lessons)
│   └── Module 4: Workflows / Integration (3–4 lessons)
│
├── Total: 13–17 lessons
├── Total duration: 2h 30m – 5h 30m
└── Final quiz: 5 questions, 60% pass threshold
```

### Required course page sections

Every course page (`/academy/courses/[slug]`) must contain:

1. **Course overview** — 2-3 sentences on what the course is and who it's for
2. **Learning outcomes** — 4 bullet points using "You will be able to…" framing
3. **Target audience** — 3 bullet points describing the ideal learner
4. **Prerequisites** — honest list; "none" is a valid answer
5. **Curriculum** — all modules and lessons with duration
6. **Certificate information** — free to learn, ₹299 to certify, what the cert looks like
7. **FAQ** — minimum 4 questions
8. **Preview video** — a 2-minute trailer (once recorded)
9. **Download syllabus** — PDF overview of the course
10. **Enroll button** — "Start Learning Free →"
11. **Related courses** — 2–3 courses from the same category

### Course metadata (in `data/courses.ts`)

```typescript
{
  slug: 'kebab-case-slug',           // unique, URL-safe
  title: 'Course Title',             // < 60 characters
  subtitle: 'One line description',  // < 100 characters
  tagline: 'Marketing hook',         // < 80 characters — used in cards
  category: 'AI Tools',             // see approved categories below
  difficulty: 'Beginner',           // Beginner | Intermediate | Advanced
  icon: '💬',                       // single emoji — used in UI
  themeColor: '#1A7F56',            // hex — used for course card accent
  status: 'active',                 // active | coming_soon
  isFree: true,                     // always true currently
  certPricePaise: 29900,            // 29900 = ₹299
  outcomes: [],                     // 4 items
  targetAudience: [],               // 3 items
  prerequisites: [],                // honest list
  modules: []                       // see module structure below
}
```

### Approved categories

- `AI Tools`
- `AI Advanced`
- `AI Fundamentals`
- `Productivity`
- `Productivity Tools`
- `Career Development`

---

## 3. Lesson Standards

### Duration

| Module | Target lesson duration |
|---|---|
| Module 1 (Foundations) | 8–12 minutes |
| Module 2 (Intermediate) | 12–15 minutes |
| Module 3 (Advanced) | 12–14 minutes |
| Module 4 (Workflows) | 12–14 minutes |

No lesson may exceed 18 minutes. If content requires more time, split into two lessons.

### Lesson structure (required)

Every lesson must follow this structure:

```
1. Hook (30–60 seconds)
   ── A specific workplace problem this lesson solves
   ── Never: "In this lesson, we will cover..."

2. Teaching (80% of duration)
   ── 3–6 key teaching points
   ── Each point: concept → example → practice
   ── Examples must be from real professional contexts

3. Practice exercise (stated at end, < 15 minutes to complete)
   ── One concrete action the learner can take today
   ── Uses the tool or concept taught

4. Close (60 seconds)
   ── 3-point recap
   ── Tease of next lesson
   ── Call to action
```

### What every lesson must include

- [ ] A real workplace example (not a hypothetical)
- [ ] A practice exercise achievable in under 15 minutes
- [ ] At least one prompt, formula, framework, or template the learner can copy
- [ ] A clear link to how this connects to the learner's career

### What lessons must NOT include

- Lengthy theoretical history ("AI was invented in 1956 by…")
- Excessive caveats and disclaimers that slow down learning
- Unverified statistics or unsourced claims
- References to competitor learning platforms
- Any claim that Barada Academy is "the best" or "only" platform

---

## 4. Slide Deck Standards

All slide decks are generated using `pptxgenjs` with the Barada brand template. The following applies to any manual additions or modifications:

### Brand colours

| Use | Colour | Hex |
|---|---|---|
| Primary background (dark slides) | Navy | `#0D183D` |
| Primary accent | Red | `#D11A1A` |
| Secondary accent | Gold | `#D4AF37` |
| Light backgrounds | White | `#FFFFFF` |
| Body text on light | Dark | `#111111` |

### Typography

- **Headings:** Poppins Bold / ExtraBold, 24–36pt
- **Body:** Inter Regular, 14–16pt
- **Labels/captions:** Inter Medium, 10–12pt

### Slide rules

- **One idea per slide.** If you need two sentences on the headline, split the slide.
- **No bullet point lists > 4 items.** If you need more, use two slides.
- **Every slide with a framework must include an example.** Don't define CRAFT without showing CRAFT in action.
- **Speaker notes are required** for every slide — minimum one sentence of guidance.
- **The last slide of every deck is the Certificate slide.** Do not remove it.
- **Avoid text-only slides.** Use icons, diagrams, or examples to break up text.

### Required slides (per deck)

1. Title slide
2. Course overview
3. About the instructor
4. One module overview slide per module (listing all lessons)
5. One content slide per lesson (Lesson 1 minimum)
6. Certificate slide

---

## 5. Quiz & Assessment Standards

### Structure

Each course has one final quiz covering the entire course.

| Item | Standard |
|---|---|
| Number of questions | 5 MCQs |
| Pass threshold | 60% (3 out of 5 correct) |
| Attempts allowed | Unlimited (configurable in `config_settings`) |
| Question types | Multiple choice (4 options each) |

### Question quality standards

Every question must:
- Test application, not memorisation ("What would you do?" not "What does X stand for?")
- Have exactly one unambiguously correct answer
- Have three plausible distractors (not obviously wrong answers)
- Include a written explanation of the correct answer (shown after submission)
- Come from a real professional scenario

### Example of a good question

```
Q: You need ChatGPT to write an email chasing a late vendor delivery.
   Which CRAFT element will have the biggest impact on the output quality?

A. Action — being specific about what you want the email to say
B. Tone — specifying that the email should be professional
C. Context — giving ChatGPT the situation and stakes   ← Correct
D. Format — specifying the email length

Explanation: Context transforms ChatGPT from a generic writer into
a partner that understands the specific situation, urgency, and
relationship dynamics. Without context, the output will be generic.
```

### Example of a bad question

```
Q: What does CRAFT stand for?
A. Create, Review, Analyse, Frame, Test
B. Context, Role, Action, Format, Tone   ← Correct
C. Concept, Rule, Apply, Format, Tone
D. Content, Role, Action, Framework, Template

Explanation: CRAFT = Context, Role, Action, Format, Tone
```
The above tests memorisation, not application.

---

## 6. Certificate Standards

### Certificate ID format

```
BAC-[COURSE_CODE]-[YEAR]-[NNNNN]

Examples:
BAC-CGP-2025-00001   (ChatGPT for Professionals)
BAC-AIL-2025-00042   (Mastery in Artificial Intelligence)
```

### Course codes

| Course | Code |
|---|---|
| ChatGPT for Professionals | CGP |
| Claude AI for Professionals | CAP |
| AI Tools for Professionals | ATP |
| Mastery in Prompt Engineering | MPE |
| Mastery in AI Productivity | MAP |
| Excel with AI | EWA |
| PowerPoint with AI | PWA |
| LinkedIn Profile Optimisation | LPO |
| Resume Building with AI | RBA |
| Mastery in Artificial Intelligence | AIL |

### Certificate eligibility

A certificate can only be issued when ALL of the following are true:
1. `enrollments.completion_percentage = 100` (all lessons marked complete)
2. A `quiz_attempts` row exists with `passed = true` for this course
3. Payment of ₹299 confirmed via Razorpay (status = `'issued'` in `certificates`)

### Certificate content (required fields)

- Learner full name (snapshot from `learners.name` at issuance)
- Course title (snapshot from `data/courses.ts` at issuance)
- Certificate ID
- Issue date
- Barada Academy logo
- Founder signature (or digital signature)
- QR code linking to the verification URL
- Verification URL: `https://barada.in/verify/[certificate_id]`

### Verification

Any person can verify a certificate at `/verify/[certificate_id]`. The page:
- Shows learner name, course title, and issue date
- Shows a "Valid Certificate" or "Certificate Not Found" status
- Never shows the learner's email, payment details, or learner ID

---

## 7. Accessibility Standards

All course content must meet WCAG 2.1 Level AA:

### Video lessons

- [ ] Captions (auto-generated + human-reviewed) on every YouTube video
- [ ] All screen demos narrated — "I am clicking on the Settings menu in the top right"
- [ ] High contrast between presenter and background

### Written content

- [ ] PDF notes use proper heading hierarchy (H1, H2, H3)
- [ ] PDF notes have sufficient colour contrast (4.5:1 ratio minimum)
- [ ] All images in PDFs have alt text
- [ ] Prompt packs are plain text — no complex formatting

### Platform accessibility

- [ ] All interactive elements have `aria-label` or visible label
- [ ] Tab order is logical on all lesson pages
- [ ] Videos can be played without audio (captions available)
- [ ] Video player is keyboard-navigable

---

## 8. Naming Conventions

### Course slugs

```
kebab-case-slug
chatgpt-for-professionals      ✅
ChatGPT_For_Professionals      ❌
chatGPTforProfessionals        ❌
```

### Lesson player URLs

```
/learn/[course-slug]/module-[N]/lesson-[N]

/learn/chatgpt-for-professionals/module-1/lesson-3    ✅
/learn/chatgpt/m1/l3                                  ❌
```

### File names (downloads)

```
[slug]-module-[N].pdf
[slug]-prompt-pack.pdf
[slug]-syllabus.pdf

chatgpt-for-professionals-module-1.pdf    ✅
chatgpt_notes_M1.pdf                      ❌
```

### YouTube video titles

```
[Course Name] — Lesson [N]: [Title] | Barada Academy

ChatGPT for Professionals — Lesson 3: Your First Professional Prompt | Barada Academy
```
