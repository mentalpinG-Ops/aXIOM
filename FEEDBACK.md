# FEEDBACK.md
## aXIOM — Feedback Intake Log

This document is the intake point for all feedback received about the aXIOM project —
from discussions, pilot observations, self-reflection, and analytical tools.

Each item is evaluated and routed to one or both of two tracks:
- **Project** → GitHub Issue created (label: `project` + area label)
- **Communication** → Entry added to `COMMS.md`

Items are marked as `filed` once routed, or `rejected` if evaluated as not relevant.

---

## How to Add an Entry

Copy the template below, assign the next available ID, and set status to `triage`.

```
### FB-XXX — [Short title]
- **Date:** YYYY-MM-DD
- **Source:** [self / discussion / pilot / artefact-analyser / other]
- **Status:** triage
- **Nature:** [project / communication / both]
- **Summary:** [One or two sentences describing the feedback]
- **Action:** [Leave blank until triaged]
- **Routed to:** [GitHub Issue #XX / COMMS.md / both — leave blank until filed]
```

---

## Label Reference (GitHub Issues)

### By nature
`project` · `communication`

### By area
`architecture` · `methodology` · `ux` · `deployment` · `pilot` · `localisation`

### By status
`triage` · `accepted` · `rejected` · `deferred`

### By priority
`blocking` · `non-blocking`

---

## Log

---

### FB-001 — AI deskilling objection
- **Date:** 2026-03-29
- **Source:** Discussion (external, sceptic of AI use)
- **Status:** filed
- **Nature:** communication
- **Summary:** Interlocutor argued that AI use causes people to unlearn thinking. This objection is likely to surface in stakeholder presentations, particularly at institutions where critical judgment is central to professional identity (e.g. art academies).
- **Action:** Incorporate into stakeholder communication framing. Anticipate and address proactively in presentations.
- **Routed to:** COMMS.md

---

### FB-002 — Tool identity confusion
- **Date:** 2026-03-29
- **Source:** Self-observation (attempts to explain project using GitHub documents)
- **Status:** filed
- **Nature:** both
- **Summary:** Existing repository documents fail to explain the tool to non-technical audiences. Three specific confusions identified: (1) tool confused with a fact-checker; (2) tool confused with plagiarism detection software (Antiplagiat); (3) assumption that the tool automates the teacher's job. All three reflect a detection/verification/automation mental model that aXIOM does not fit.
- **Action (communication):** Create stakeholder-facing explainer that leads with what the tool is not before explaining what it is.
- **Action (project):** Repository is missing a non-technical audience document. To be tracked as a GitHub Issue.
- **Routed to:** COMMS.md + GitHub Issue

---

### FB-003 — Scholarly isolation / analytical validity
- **Date:** 2026-03-30
- **Source:** Artefact Analyser output (SOFTWARE_20260329_99B864C2) + self
- **Status:** filed
- **Nature:** both
- **Summary:** The Artefact Analyser identified that the project has no engagement with existing literature on automated assessment, AI in education, or rubric validity. On reflection, the purely AI-based approach to the underlying analytical methods (discourse analysis, narrative analysis, logical analysis, semiotic analysis) risks simulating a scientific approach rather than constituting one.
- **Action (communication):** Present the current state (HTML prompt generator) explicitly as a proof of concept, not a fully developed scientific approach. This framing is honest, defensible, and creates a clear narrative arc toward future grounding.
- **Action (project):** ARCHITECTURE.md must explicitly position the analytical engine's methodology as proof-of-concept stage. Long-term path: potential academic grounding through formal study (e.g. Cultural Science).
- **Routed to:** COMMS.md + GitHub Issue

---

### FB-004 — Capability probe scope
- **Date:** 2026-03-30
- **Source:** Artefact Analyser output (SOFTWARE_20260329_99B864C2)
- **Status:** rejected
- **Nature:** —
- **Summary:** The Artefact Analyser noted that the capability probe tests formal output compliance (can the model produce parseable structured output?) but not analytical quality (is the output sound?). This conflates model compatibility with model adequacy.
- **Action:** None. The PoC framing established in FB-003 absorbs this finding. The probe's limited scope is appropriate at proof-of-concept stage and does not need to be addressed separately.
- **Routed to:** —

---

### FB-005 — Studienordnung terminology
- **Date:** 2026-03-30
- **Source:** Artefact Analyser output (SOFTWARE_20260329_99B864C2)
- **Status:** filed
- **Nature:** project
- **Summary:** The term "Studienordnung" is used throughout ARCHITECTURE.md to describe the institutional regulations layer. This is a German-tradition academic governance term that does not map precisely to Polish equivalents (regulamin studiów) and implies a specificity that is not warranted at this stage.
- **Action:** Replace "Studienordnung" throughout ARCHITECTURE.md with the neutral term "programme requirements". Add a note that the specific regulatory terminology varies by institution and country and will be confirmed during pilot discovery.
- **Routed to:** GitHub Issue

---

### FB-006 — Group format insufficient for tool introduction
- **Date:** 2026-04-01
- **Source:** Pilot (Discovery Session 001, a city in Poland)
- **Status:** filed
- **Nature:** both
- **Summary:** Group discussion format surfaced collective orientations but
  suppressed individual sense-making. The tool's utility is embedded in
  individual professional practice. Access to the Lebenswelt of the
  individual assessor requires a 1:1 setting (Schütz: first-order
  constructs only accessible at the level of individual experience).
- **Action (project):** All future discovery sessions to be conducted 1:1.
  Update DISCOVERY_PROTOCOL.md accordingly.
- **Action (communication):** Onboarding framing must address individual
  utility, not group or institutional benefit.
- **Routed to:** ARCHITECTURE.md (Section 13.4) + DISCOVERY_PROTOCOL.md

---

### FB-007 — Platform differentiation / core value proposition
- **Date:** 2026-04-08
- **Source:** Self-reflection (webinar attendance)
- **Status:** in-progress
- **Nature:** both
- **Priority:** blocking
- **Summary:** The AA-Schema prompt is the genuine innovation; it can be replicated in any AI provider's project/agent feature with system instructions. Platform layer (Module 4, deployment, wizard UI) lacks validated user need. Critical question: what does aXIOM deliver that a Claude Project with the same prompt cannot?
- **Candidate answers:** (1) Aggregation over time—patterns across semester, criteria drift detection; (2) Institutional control—data residency, GDPR, audit trail; (3) Nothing yet—platform may be premature.
- **Action:** Test prompt standalone with real user before building further platform infrastructure. Defer Module 4 build pending validation.
- **Progress:** Assessment Prompt v1.0 written and committed to `prompts/ASSESSMENT_PROMPT_v1_0`. Companion description at `prompts/ASSESSMENT_PROMPT_v1_0_DESCRIPTION.md`. Prompt is ready for standalone testing in any AI provider's chat interface (Claude, ChatGPT) without platform infrastructure. Next step: run prompt against a real student submission with a pilot teacher.
- **Routed to:** Pilot teacher (Institution A or B) — standalone test session required

---

*Last updated: 2026-04-11*