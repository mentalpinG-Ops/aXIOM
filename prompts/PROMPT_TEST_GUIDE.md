# Assessment Prompt v1.0 — Standalone Test Guide

For pilot teachers and stakeholders running the prompt in a standard
AI chat interface. No platform installation required.

---

## What you are testing

The Assessment Prompt v1.0 is a system prompt that instructs an AI
(Claude or ChatGPT) to produce a structured analytical assessment of a
student submission against the programme requirements and course criteria
you supply.

The prompt does **not** produce a grade. It produces a structured report
that you — the teacher — read, challenge, and act on.

---

## What you need before you start

1. **Access to an AI chat interface** — Claude (claude.ai) or ChatGPT
   (chat.openai.com). A free account works; a paid account with access
   to a stronger model (Claude Sonnet, GPT-4o) will give better results.

2. **Your programme requirements** — the formal rules for the degree
   programme: learning outcomes, submission format requirements, grading
   criteria categories. A few paragraphs or a bullet list is sufficient.
   You do not need a full regulatory document.

3. **Your course/seminar criteria** — the specific requirements for this
   assignment: the brief, the expected methodology, the evaluation criteria,
   the scope constraints.

4. **A student submission** — a thesis, seminar paper, essay, or report in
   any supported format (DOCX, PDF, TXT). Choose a real submission you know
   well so you can evaluate whether the AI's findings are sound.

---

## Step-by-step instructions

### Step 1 — Choose your prompt variant

Two variants are available:

| Variant | File | When to use |
|---------|------|-------------|
| Full prompt | `ASSESSMENT_PROMPT_v1_0` | Claude Projects, Custom GPTs, or any interface where system instructions are entered separately from the chat |
| Slim prompt | `ASSESSMENT_PROMPT_v1_0_SLIM` | Interfaces with tight system-prompt character limits (≤ 300 characters) |

Start with the full prompt if possible. The slim variant produces less
structured output but covers the same assessment dimensions.

---

### Step 2 — Set up the AI session

**In Claude (claude.ai):**
1. Create a new Project (top-left menu → "New project").
2. Open Project Settings (the gear icon) → "Project instructions".
3. Paste the contents of `ASSESSMENT_PROMPT_v1_0` into the instructions field.
4. Replace the three `{{…}}` variables with your content (see Step 3).
5. Save and return to the chat.

**In ChatGPT (chat.openai.com):**
1. Create a new Custom GPT (top-left menu → "Explore GPTs" → "Create").
2. In the "Configure" tab, paste the prompt into the "Instructions" field.
3. Replace the `{{…}}` variables with your content (see Step 3).
4. Save and return to the chat.

**If you cannot create a Project or Custom GPT:**
1. Open a new chat.
2. Start your first message with the text: `[System instructions:` followed
   by the full prompt content, then `]`. Then on a new line, paste the
   student submission text.
3. This is less reliable than using a project or custom GPT but works for
   a first test.

---

### Step 3 — Fill in the template variables

Before saving the system instructions, replace each `{{…}}` placeholder
with your actual content.

**`{{INSTITUTION_FRAMEWORK}}`**

Replace with the programme requirements. Example:

> Bachelor of Fine Arts — Programme Learning Outcomes: Students will
> demonstrate independent critical and artistic practice; present and
> defend a sustained body of work; situate their practice within relevant
> theoretical and historical contexts. Submission: written thesis (min.
> 8,000 words), submitted anonymously.

Keep it factual and specific. You do not need to include every rule —
focus on the criteria that matter most for this assignment.

**`{{SEMINAR_REQUIREMENTS}}`**

Replace with the assignment brief and evaluation criteria. Example:

> Seminar: Contemporary Art Theory — Research Paper. Topic: student-chosen,
> must engage with at least one theoretical framework covered in the seminar.
> Required: clear research question, theoretical grounding, primary source
> analysis, minimum 15 academic references. Length: 4,000–6,000 words.
> Evaluation criteria: clarity of argument, quality of theoretical engagement,
> critical use of sources, written expression.

**`{{MANUAL_NOTES}}`**

Optional. Use for per-submission notes — context about this student's
situation, instructions to emphasise or de-emphasise specific criteria,
or leniency notes (e.g. resubmission, extension granted). If you have no
special notes for this submission, replace with: `None.`

**`{{OUTPUT_LANGUAGE}}`**

Replace with the language you want the assessment report written in.
Supported: `English` or `Polish`.

**`{{SUBMISSION_ID}}` and `{{GENERATED_AT}}`**

For standalone testing: delete these two lines from the prompt, or replace
with placeholder text such as `TEST-001` and `[date]`. They are populated
automatically by the platform in production use — you do not need them for
testing.

---

### Step 4 — Paste the student submission

In the chat (not the system instructions), paste the full text of the
student submission as your first message. If the interface supports file
upload, you can upload the document directly.

Send the message. The AI will begin the assessment.

---

### Step 5 — Review the output

The full prompt produces output in six sections:

| Section | What it contains |
|---------|-----------------|
| §0 Assessment Configuration | Confirms your setup values and declares known AI limitations |
| §1 Submission Context | Confirms your requirements were received; flags any ambiguities |
| §2 Document Check | Structural and formal check — language, word count, structure elements, formal compliance |
| §3 Core Argument Analysis | What the student is actually arguing — thesis, supporting claims, argument structure |
| §4 Argument Quality Assessment | How well the argument holds together — validity, evidence, reasoning errors |
| §5 Requirements Alignment | Systematic check of every requirement you supplied — met, partially-met, not-met |
| §6 Assessment Report | Human-readable report for you: overall impression, strengths, development areas, unmet requirements, confidence level |

Read §6 first, then check the relevant detail sections.

---

## What to look for during the test

You know the submission. Use that knowledge to evaluate the AI's output:

**Is the thesis identification correct?**
Does §3.1 correctly identify what the student is arguing? If the AI
missed the central claim or misread it, note where and how.

**Are the requirements alignment findings grounded?**
Does §5 cite actual evidence from the submission? Or are the findings
generic? The prompt requires the AI to cite specific sections and brief
quotes — if it does not, that is a reliability signal.

**Is the confidence level honest?**
If the AI gives "high confidence" on a borderline submission, or "low
confidence" on a strong one, note that.

**Is anything false or fabricated?**
The AI is instructed not to invent requirements or evidence. If you find
a finding that cites a requirement you did not supply, or a quote that
does not exist in the submission, note it.

**Is the output language correct?**
If you set `{{OUTPUT_LANGUAGE}}` to Polish, the entire output should be
in Polish.

---

## How to record your feedback

After the test session, record your findings using the template below.
This record feeds into the prompt's development cycle.

```
Test session: [date]
Tester: [role — pilot teacher / stakeholder / other]
Submission type: [thesis / seminar paper / essay / report]
Prompt variant: [full / slim]
AI model used: [Claude Sonnet / GPT-4o / other]

What worked well:
-

What did not work or was wrong:
-

Missing or not covered:
-

Output language correct: [yes / no]
Confidence levels appropriate: [yes / no / mixed — note]
Evidence anchoring (§5): [strong / acceptable / weak / absent]

Overall: would this output be useful in your assessment practice?
[yes / with changes / no — explain]

Other notes:
```

Send feedback to the project contact or open a note in the project
discussion channel.

---

## Known limitations at this stage

- The AI cannot assess visual or non-text content (images, diagrams,
  artwork). If the submission includes visual elements, the AI will flag
  them but cannot evaluate them.
- Assessment quality depends on the accuracy of your requirements.
  Ambiguous or incomplete requirements produce lower-confidence findings.
- The AI cannot detect plagiarism or verify factual claims.
- This is a proof-of-concept prompt, not a validated assessment methodology.
  Your professional judgment is the final authority.

---

*Test guide version: 1.0 | Matches: `ASSESSMENT_PROMPT_v1_0` and `ASSESSMENT_PROMPT_v1_0_SLIM`*
