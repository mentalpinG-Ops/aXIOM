# Assessment Prompt v1.0 — Section Description

Reference document for `ASSESSMENT_PROMPT_v1_0`.
Describes what each section of the assessment schema does, in plain language.

---

## How the prompt works overall

The Assessment Prompt instructs an AI to take a student submission — a
thesis, seminar paper, essay, or report — and produce a structured
assessment record against stated institutional and course requirements.

The output is not a grade. It is a structured analytical report that
the teacher reads, challenges, and acts on. The AI carries the paperwork
load; the teacher exercises professional judgment.

**The prompt's central design principle is requirements-driven assessment:**
every finding in §§3–5 must be grounded in evidence from the submission
and anchored to a stated requirement from the institutional framework or
seminar criteria. The AI cannot invent requirements, and it cannot invent
evidence.

The prompt operates in interpretive mode only. It evaluates logical and
evidential quality — does the argument hold together, does the evidence
support the claims — not truth value. aXIOM is not a fact-checker.

Four environment variables carry the assessment context:
- `{{INSTITUTION_FRAMEWORK}}` — what the programme formally requires
- `{{SEMINAR_REQUIREMENTS}}` — what the course specifically requires
- `{{MANUAL_NOTES}}` — per-submission instructions from the teacher
- `{{OUTPUT_LANGUAGE}}` — language of the assessment report

Two variables are pre-computed and injected by the application:
- `{{SUBMISSION_ID}}` — SHA-256-derived unique identifier
- `{{GENERATED_AT}}` — UTC timestamp at prompt assembly

---

## Header block

**What it does:** Confirms pre-computed metadata and environment
variable values before the AI begins assessment.

`SUBMISSION_ID` is a content-addressable unique identifier derived from
institution, course, student, date, and content. The AI is instructed to
use it verbatim as an audit anchor throughout the output.

The header also triggers the environment variable validation check:
if `{{INSTITUTION_FRAMEWORK}}` or `{{SEMINAR_REQUIREMENTS}}` is missing,
the AI halts immediately. Assessment cannot proceed without these.

---

## §0 — Assessment Configuration

**What it does:** Declares the assessment context as a pre-set block,
not as a user or AI choice.

Unlike the Core Prompt's §0 (where the analyst declares their own
stance), §0 here is populated from system values. The AI confirms
values it has been given, does not choose them.

Key fixed values:
- **analytical_framework** — always "criteria-based academic assessment"
- **assessment_mode** — always "interpretive"
  (fact-critical mode is explicitly excluded from Module 4)
- **analyst_type** — always AI
- **output_language** — from `{{OUTPUT_LANGUAGE}}`

Four known system-level limitations are declared verbatim (L1–L4).
These are not AI-generated assessments of this submission — they are
standing constraints that apply to every assessment the prompt produces:
- L1: AI findings require teacher review
- L2: AI cannot assess originality or detect plagiarism
- L3: Visual content may not be assessable in text-only mode
- L4: Assessment quality depends on the accuracy of the requirements
  provided — incomplete requirements produce lower-confidence findings

---

## §1 — Submission Context

**What it does:** Confirms the assessment configuration from environment
variables and surfaces any issues before analysis begins.

This section is populated from `{{INSTITUTION_FRAMEWORK}}`,
`{{SEMINAR_REQUIREMENTS}}`, and `{{MANUAL_NOTES}}` — not from the
submitted document.

The AI is asked to:
1. Confirm each variable has been received
2. Summarise in 1–3 sentences what each requires
3. Flag any requirement that is ambiguous, internally conflicting, or
   in conflict with the other layer

**Why this matters:** Ambiguous or conflicting requirements are the
most common cause of low-confidence assessments. Surfacing them in §1
before any analysis begins gives the teacher a chance to reconfigure
before reading a report built on shaky foundations.

**Manual notes** (`{{MANUAL_NOTES}}`) are confirmed and summarised
here, with explicit note of which §5 requirements they affect. Manual
notes can affect framing but cannot override programme requirements.
If they conflict with programme requirements, the conflict is flagged —
not resolved by the AI.

---

## §2 — Document Check

**What it does:** Performs a structural and formal check of the
submission before content analysis begins. Observation only — no
evaluation.

Three sub-sections:

**2.1 Basic identification:** Language, document type, word count, and
modality (text-only or multimodal). Each is cross-referenced against
stated requirements where applicable. Modality is flagged because
Institution A (art academy) commonly receives submissions that integrate
visual work — the AI flags non-text elements for the teacher even if
it cannot fully assess them.

**2.2 Structural elements check:** A standardised checklist of academic
structure elements (abstract, introduction, theoretical framework,
methodology, analysis, discussion, conclusion, reference list,
appendices). For each: present, absent, present-but-underdeveloped, or
not-required-by-brief. Brief notes added only where the status requires
explanation.

**2.3 Formal compliance check:** Requirements-anchored check of formal
requirements (length, format, citation style, language, anonymisation).
Each finding is anchored to a specific requirement from §1 (programme
or seminar).

**2.4 Notable gaps vs requirements:** What is conspicuously absent
relative to stated requirements? Each gap is given a gap_id (G1, G2…),
described, classified by severity (structural, content, or formal),
and anchored to the specific requirement that makes the absence notable.
These gaps are flagged here for observation; they are evaluated in §5.

---

## §3 — Core Argument Analysis

**What it does:** Identifies and articulates the student's core
argument. This is the most important analytical section — it establishes
what the submission is actually arguing before the requirements
alignment check begins.

**Why this section exists:** Requirements alignment (§5) is only
meaningful if the prompt first identifies what the student is actually
arguing. Without §3, §5 becomes a checklist exercise that misses
the intellectual substance of the work.

**3.1 Thesis identification:** Is there a clear central argument?
Where is it stated? Three statuses: yes (clear thesis), unclear
(something that functions as a thesis but is not clearly stated), or
no (no identifiable thesis). Confidence mandatory.

**3.2 Supporting claims:** The major claims that build the argument.
Simplified taxonomy for academic work (compared to the Core Prompt's
22 claim types):
- **thesis-support** — claims that directly support the central argument
- **methodological** — claims about how the study was conducted
- **descriptive** — factual or contextual claims
- **conclusion** — claims about what the work demonstrates

For each: evidence basis (cited source, original analysis, empirical
data, assumed, or unclear), connection to thesis (strong, weak, unclear,
absent), and confidence level.

**3.3 Argument structure summary:** 2–4 sentences on whether the
argumentative chain holds together. Specifically: are supporting
claims additive (they build the argument) or redundant (they repeat
the same point)?

---

## §4 — Argument Quality Assessment

**What it does:** Assesses the quality of the argument and supporting
reasoning. Does the argument hold together? Is the evidence adequate?
Are there significant reasoning errors?

This section is a simplified version of the Core Prompt's §4 + §4A
combined. The abductive inference sub-protocol and formal fallacy
taxonomy have been removed — they are appropriate for research analysis,
not for bachelor and master thesis assessment.

**4.1 Argument reconstruction:** The argument in standard form
(premises → conclusion). Implicit premises are flagged. This is a
prerequisite for the validity check in 4.2.

**4.2 Logical validity:** Does the conclusion follow from the premises
(validity)? Are the premises well-supported within the submission
(soundness)? Specific reasoning gaps are listed — not as a hunt for
errors, but as honest documentation of where the argumentative chain
breaks.

**4.3 Evidential support:** Three dimensions: quantity (sufficient,
insufficient, or excessive-but-superficial), quality (appropriate-for-level,
below-expectations, above-expectations), and integration (are sources
cited in support of specific claims, or listed without integration?).
Specific citation issues are listed.

**4.4 Informal reasoning errors:** Assessed only if present — the AI
is explicitly instructed not to search for fallacies that are not there.
A reduced taxonomy appropriate for academic work: overgeneralisation,
unsupported-causal-claim, appeal-to-authority, straw-man,
false-equivalence, circular-reasoning. Each is anchored to a specific
passage and classified by severity (minor, significant, structural).

**4.5 Assumption check:** Significant assumptions the argument depends
on but does not defend. Each is classified as load-bearing or
peripheral, and as defended, partially defended, or undefended.

---

## §5 — Requirements Alignment

**What it does:** Systematically evaluates the submission against every
stated requirement from §1. This is the core of the assessment — the
section that directly serves the teacher's grading decision.

Two sub-sections mirror the two layers of requirements:

**5.1 Programme requirements alignment** — against
`{{INSTITUTION_FRAMEWORK}}`. Each requirement from the programme
regulations is evaluated individually. Four possible statuses:
met, partially-met, not-met, not-assessable.

**5.2 Seminar requirements alignment** — against
`{{SEMINAR_REQUIREMENTS}}`. Same structure as 5.1.

For every finding in both sub-sections, the AI must:
1. Quote or paraphrase the requirement precisely
2. State a status
3. Cite evidence from the submission (section reference + brief quote)
4. Declare a confidence level
5. Add a note if the finding is borderline or has nuance the teacher
   should know

This evidence-anchoring discipline is the prompt's key quality
mechanism. Assessment without evidence is opinion; assessment with
cited evidence is a finding.

**5.3 Alignment summary:** Counts (met, partially-met, not-met,
not-assessable), list of critical gaps (requirements assessed as
not-met that are likely load-bearing for the grade decision), and
an overall confidence level for the section.

---

## §6 — Assessment Report

**What it does:** Synthesises the findings from §§2–5 into a structured
report written for the teacher. This is the human-readable output —
the section the teacher reads first.

Written in `{{OUTPUT_LANGUAGE}}`. Tone: direct professional language,
as from a well-informed colleague. Not a system log.

**6.1 Overall impression:** 1–2 sentences. The holistic judgment of
the submission — what an experienced teacher would say to a colleague.
Specific and confident where the evidence allows it.

**6.2 Strengths:** Up to 5 genuine strengths with evidence. The AI is
explicitly instructed not to inflate this list — if there are fewer
than 5 genuine strengths, list fewer.

**6.3 Areas for development:** Significant shortfalls, each with
evidence and a concrete indication of what adequate development would
look like. Not a list of generic academic advice — specific findings
from this submission.

**6.4 Unmet requirements:** All requirements from §5 assessed as
not-met, listed explicitly. If all requirements are met or
partially-met, this section states so.

**6.5 Assessment confidence:** Overall confidence level (high, medium,
low) with a 2–3 sentence rationale. Explicitly lists what could not be
assessed (unassessable elements) and why.

---

## CONSTRAINTS block

**What it does:** Sets global rules that apply across the entire prompt.

Eight constraints:
1. Write in `{{OUTPUT_LANGUAGE}}`
2. Do not produce a grade or recommendation — the teacher decides
3. Do not speculate beyond what is in the submission and requirements
4. Preserve genuine ambiguity — flag it, do not resolve it
5. Do not reproduce lengthy student text verbatim — cite by reference
6. Confidence indicators are mandatory throughout §§3–5
7. Manual notes cannot override programme requirements
8. If a required variable is missing: halt assessment and flag it

---

## Relationship to Core Prompt v1.0

The Assessment Prompt is conceptually informed by, but not derived
from, the Core Prompt v1.0. The two prompts serve different purposes,
different user types, and different analytical contexts.

| Dimension | Core Prompt v1.0 | Assessment Prompt v1.0 |
|---|---|---|
| Purpose | Research artefact analysis | Criteria-based student work evaluation |
| User | Researcher | Teacher / instructor |
| Mode | Fact-critical, interpretive, philosophical, mixed | Interpretive only |
| Claim taxonomy | 22 types across 5 families | 4 types (thesis-support, methodological, descriptive, conclusion) |
| Requirements | None — analyst-defined | Injected via environment variables |
| Output format | 10 sections, Zotero-compatible tags | 6 sections, assessment report |
| Zotero integration | Yes — §7 maps to Zotero | No — not relevant for assessment |
| Grade/recommendation | Not applicable | Explicitly excluded |
| Output language | Standardised English | Configurable via `{{OUTPUT_LANGUAGE}}` |

Core Prompt sections dropped or replaced in Assessment Prompt:
- §0 Methodological Declaration → replaced by pre-populated §0 Assessment Configuration
- §1 Metadata (bibliographic) → replaced by §1 Submission Context (from environment variables)
- §2 Artefact Characterization (full) → reduced to §2 Document Check
- §4 Derived Claims (abductive sub-protocol) → removed
- §4A-3 Formal Fallacy Detection → removed (over-dimensioned for bachelor level)
- §5 Epistemic Status (informant reliability, misinformation risk, epistemic effect) → removed
- §6 Normalization Notes → removed
- §7 Zotero Mapping → replaced by §6 Assessment Report
- §8 ID Strategy → removed
- §9 Analytical Summary → restructured as §6 Assessment Report

Core Prompt sections adapted and retained:
- §3 Claim Extraction → §3 Core Argument Analysis (simplified taxonomy)
- §4A-1 Argument Reconstruction → §4.1 Argument reconstruction
- §4A-2 Premise–Conclusion Validity → §4.2 Logical validity
- §4A-4 Informal Fallacy Detection → §4.4 Informal reasoning errors (simplified)
- §4A-5 Assumption Stress-Test → §4.5 Assumption check
- §5 Internal consistency → §4.3 Evidential support
- §5 Source grounding → §4.3 Evidential support (source_integration field)
