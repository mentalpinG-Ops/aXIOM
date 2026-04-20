# Engine Architecture

Decision record for the Analysis Engine (Module 1) and its relationship
to the Core Prompt and Module 4 (Academic Assessor).

Status: **active decisions, not yet implemented**
Date: 2026-04-06

---

## 1. "One engine" — what it means

The stakeholder presentation states: "Two phases, one engine."

This refers to **shared infrastructure**, not a shared prompt.

The engine has three layers:

### Layer 1 — Transport (shared)

Document ingestion, AI provider communication, response parsing, storage.
Provider-agnostic, prompt-agnostic. Used by both the Artefact Analyser
and the Academic Assessor.

Responsibilities:
- Accept document input (DOCX, PDF, TXT, RTF, ODT, images)
- Extract content for prompt injection
- Send assembled prompt to AI provider
- Parse and store structured response
- Handle errors, retries, language encoding (UTF-8)

### Layer 2 — Prompt (not shared)

The instruction set sent to the AI. Different use cases require
different prompts.

| Use case | Prompt | Status |
|---|---|---|
| Artefact Analyser (research) | Core Prompt v1.0 | Exists, extracted to `prompts/CORE_PROMPT_v1_0.md` |
| Academic Assessor (Module 4) | Assessment Prompt v1.0 | Exists, extracted to `prompts/ASSESSMENT_PROMPT_v1_0`. Ready for standalone testing. |

The Assessment Prompt is not a subset of the Core Prompt. It is a
separate prompt that is *conceptually informed* by the Core Prompt
but adapted for criteria-based evaluation of student work.

### Layer 3 — Output structure (not shared)

How the AI response is formatted and presented to the user.

| Use case | Output format |
|---|---|
| Artefact Analyser | 10 sections (§0–§9), Zotero-compatible tags, research vocabulary |
| Academic Assessor | Assessment report (~5–6 sections), criteria-based, institutional language |

---

## 2. Core Prompt v1.0 — epistemological status

The Core Prompt is a **Design Science Research artefact**. Its analytical
categories (claim taxonomy, inference types, mode architecture, bias
indicators) emerged from AI-assisted prototyping — not from deductive
derivation from peer-reviewed methodology.

This is methodologically transparent, not methodologically deficient:
DSR evaluates artefacts through use, not through theoretical derivation
(Hevner et al. 2004).

**Current validation:** pilot use with real participants (Discovery
Session 001). Validation is ongoing.

**Academic foundation:** to be developed separately as part of
aXIOM-als-Projekt (Essay, academic collaborator engagement). This does not block
product development (aXIOM-als-Produkt).

---

## 3. Module 4 — environment variables

The Academic Assessor introduces three context layers that the Core
Prompt does not have. These are injected as environment variables
into the Assessment Prompt.

### 3.1 Institutional framework (Studienordnung)

What the study programme formally requires. Relatively stable,
changes rarely.

- Degree type and level (e.g. Bachelor, licencjat)
- Programme learning outcomes
- Formal submission requirements (length, format, language)
- Grading scale and criteria categories

Configured once per institution/programme. Stored in database.

### 3.2 Seminar requirements

What the specific course requires. Changes per semester/instructor.

- Course-specific learning objectives
- Assignment brief or task description
- Required methodologies or frameworks
- Specific evaluation criteria set by the instructor

Configured per course via the setup wizard.

### 3.3 Manual input

Additional instructions from the instructor per assessment.

- Ad-hoc notes ("focus on methodology section",
  "student had extension, evaluate leniently on formatting")
- Emphasis or de-emphasis of specific criteria
- Context the AI cannot see (e.g. student presented orally,
  this is a resubmission)

Entered at upload time, free text.

### 3.4 Output language

The language in which the assessment report is generated.

- Set as `{{OUTPUT_LANGUAGE}}` in the prompt
- Default: determined by institutional framework
- English + Polish at launch, German queued

---

## 4. Module 4 — section selection from Core Prompt

The table below documents which Core Prompt sections are relevant
to Module 4 and what changes are needed.

| Core Prompt section | Module 4 relevance | Action |
|---|---|---|
| §0 Methodological Declaration | Framework and mode are not user-chosen but system-set from environment variables. `analyst_type` always `AI`. Limitations defined once systemwide. | **Rebuild.** Pre-populate from environment variables. |
| §1 Metadata | Bibliographic data is known from upload context, not extracted from document. Circulation/reception context irrelevant for unpublished student work. | **Replace** with institutional metadata from environment variables. |
| §2 Artefact Characterization | Genre always "academic work" — no analytical value. Modality relevant (art/design students submit visual work). Notable absences **highly relevant** (what is missing vs. requirements). Intertextuality relevant (source work quality). | **Selective.** Keep absences + intertextuality. Modality if multimodal input. Drop genre, illocutionary function, implied audience, production context. |
| §3 Claim Extraction | Core function — what does the student actually argue? But 22 claim types are research-grade. Art/design bachelor theses won't use `claim:cat-legal` or `claim:rhet-omission` regularly. | **Keep, reduce taxonomy.** Adapt to academic assessment context. |
| §4 Derived Claims | "Does the conclusion follow from the premises?" is exactly what instructors want. But abductive inference with mandatory competing hypotheses is over-engineered for this context. | **Keep, simplify.** Remove abductive sub-protocol. |
| §4A Argument Stress-Test | 4A-1 (reconstruction) and 4A-2 (validity) highly relevant. 4A-5 (assumptions) relevant. 4A-3 (formal fallacies) over-dimensioned for bachelor theses. 4A-4 (informal fallacies) relevant but reducible. | **Keep, make 4A-3 optional, simplify rest.** |
| §5 Epistemic Status | `internal_consistency` highly relevant. Source grounding relevant. `artefact_integrity`, `informant_reliability`, `misinformation_risk`, `epistemic_effect` irrelevant for student work assessment. | **Strong selection.** Keep consistency + source grounding. Drop rest. |
| §6 Normalization Notes | Minimally relevant. | **Drop or reduce to one line.** |
| §7 Zotero Mapping | Irrelevant. Instructors don't use Zotero for assessments. | **Drop.** Replace with assessment-appropriate output format. |
| §8 ID Strategy | Administrative overhead. ID is auto-generated in Module 4. | **Drop.** |
| §9 Analytical Summary | Highly relevant — but as assessment summary (strengths, weaknesses, criteria alignment), not as research summary. | **Keep, rewrite** for assessment context. |

### Summary

Approximately half the Core Prompt is relevant to Module 4,
but almost nothing can be used unchanged. The Assessment Prompt
is a separate document, conceptually informed by the Core Prompt.

---

## 5. Resolved tensions

This architecture resolves five tensions identified between the
Core Prompt and the project's product assumptions:

| # | Tension | Resolution |
|---|---|---|
| 1 | "Not a fact-checker" vs. fact-critical mode in prompt | Module 4 has no fact-critical mode. Core Prompt keeps it (research use case). |
| 2 | "One engine" implies shared prompt | Clarified: shared infrastructure (Layer 1), separate prompts (Layer 2). |
| 3 | Prompt audience (researchers) vs. product audience (instructors) | Two prompts, two audiences. Core Prompt for researchers. Assessment Prompt for instructors. |
| 4 | Output complexity vs. "paperwork reduction" promise | Assessment output has ~5–6 sections, no Zotero mapping, no ID strategy overhead. |
| 5 | "Standardized English" output vs. Polish-speaking users | `{{OUTPUT_LANGUAGE}}` as environment variable. English + Polish at launch. |

---

## 6. What this document does not cover

- The Assessment Prompt itself — now exists at `prompts/ASSESSMENT_PROMPT_v1_0`. See `prompts/ASSESSMENT_PROMPT_v1_0_DESCRIPTION.md` for section-level documentation.
- Transport layer technical implementation (see `ARCHITECTURE.md`)
- UI/UX of the setup wizard
- Data retention and privacy architecture (see stakeholder presentation)

These are downstream tasks that depend on the decisions recorded here.
