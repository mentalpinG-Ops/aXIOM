# GitHub Issues Setup — aXIOM
## Label Definitions and Initial Issues

This document records the label set to be created in the GitHub repository,
and the initial issues to be opened from the first FEEDBACK.md triage.

Use this as a reference when setting up the project board.

---

## Label Set

Create the following labels in the repository (Settings → Labels):

### By nature
| Label | Colour (hex) | Description |
|-------|-------------|-------------|
| `project` | #0075ca | Affects what gets built |
| `communication` | #e4e669 | Affects how the project is presented |

### By area
| Label | Colour (hex) | Description |
|-------|-------------|-------------|
| `architecture` | #d93f0b | ARCHITECTURE.md or structural decisions |
| `methodology` | #5319e7 | Analytical engine, schema, PoC framing |
| `ux` | #0e8a16 | Teacher-facing friction points |
| `deployment` | #1d76db | Docker, installation, technical setup |
| `pilot` | #f9d0c4 | Specific to pilot institutions or discovery sessions |
| `localisation` | #fef2c0 | Language, terminology, cultural context |

### By status
| Label | Colour (hex) | Description |
|-------|-------------|-------------|
| `triage` | #cccccc | Entered, not yet evaluated |
| `accepted` | #0e8a16 | Routed and actioned |
| `rejected` | #b60205 | Evaluated, not relevant |
| `deferred` | #bfd4f2 | Relevant but not for current phase |

### By priority
| Label | Colour (hex) | Description |
|-------|-------------|-------------|
| `blocking` | #b60205 | Must resolve before next milestone |
| `non-blocking` | #cccccc | Can proceed without it |

---

## Initial Issues to Open

The following issues are derived from FEEDBACK.md items marked as routed to GitHub.

---

### Issue 1 — Add stakeholder-facing explainer document
**From:** FB-002
**Labels:** `project` · `communication` · `non-blocking`

**Description:**
The repository currently has no document designed to explain aXIOM to a non-technical
audience. Attempts to explain the project using ARCHITECTURE.md and README.md revealed
three recurring misreadings: fact-checker, plagiarism detector, and job-automation tool.

A stakeholder-facing explainer is needed that leads with what aXIOM is not before
explaining what it is. Target audience: faculty, department heads, pilot institution contacts.

**Acceptance criteria:**
- Document exists in repository (suggested: `docs/EXPLAINER.md` or equivalent)
- Addresses the three known misreadings explicitly
- Uses no technical jargon
- Can be read in under 3 minutes

---

### Issue 2 — Position analytical engine as proof of concept in ARCHITECTURE.md
**From:** FB-003
**Labels:** `project` · `methodology` · `architecture` · `non-blocking`

**Description:**
ARCHITECTURE.md does not currently distinguish between the technical architecture
(which is deliberately designed) and the analytical methodology (which is at proof-of-concept
stage). This risks implying more scholarly rigour than currently exists.

A section or explicit note should be added to ARCHITECTURE.md stating that the analytical
engine's methodology — including the approach to discourse analysis, narrative analysis,
logical analysis, and semiotic analysis — is at proof-of-concept stage and has not been
validated against existing literature on automated assessment or rubric validity.

**Acceptance criteria:**
- ARCHITECTURE.md includes an explicit PoC framing for the analytical methodology
- The framing is honest and does not undersell the technical architecture
- The note acknowledges the long-term path toward grounded methodology

---

### Issue 3 — Replace "Studienordnung" with "programme requirements"
**From:** FB-005
**Labels:** `project` · `architecture` · `localisation` · `non-blocking`

**Description:**
The term "Studienordnung" is used throughout ARCHITECTURE.md to describe the
institutional regulations layer. This is a German-tradition academic governance term
that does not map precisely to Polish equivalents (regulamin studiów) and carries
connotations that may not apply to the pilot institutions.

Replace all instances of "Studienordnung" with the neutral term "programme requirements".
Add a note that the specific regulatory terminology varies by institution and country
and will be confirmed during pilot discovery sessions.

**Acceptance criteria:**
- "Studienordnung" does not appear in ARCHITECTURE.md
- "Programme requirements" is used consistently as the neutral term
- A localisation note explains that exact terminology will be confirmed per institution

---

*Last updated: 2026-04-10*  
*See FEEDBACK.md for full item context.*

---

## Methodology Validation Issues (M01–M14)

The following section documents how to use the methodology validation issue template for tracking the 14 Specification-Assumption Coherence Audits (SACA) across the methodological frameworks embedded in the engine.

### Prerequisites

Before opening any M01–M14 issue, ensure the following are complete:

1. `docs/ENGINE-COHERENCE-AUDIT.md` — the foundational audit establishing epistemological coherence between the engine's cultural-science orientation, DSR, and phenomenological grounding (✅ complete)
2. Familiarise yourself with `docs/METHODOLOGY-VALIDATION-ISSUE-TEMPLATE.md` — the template and protocol for each methodology check

### Label for M01–M14 Issues

Use the existing `methodology` label (hex `#5319e7`) for all M01–M14 issues.

Add additional labels as appropriate:

| Condition | Label to add |
|---|---|
| Conflict found that blocks prompt use | `blocking` |
| Conflict found but does not block current work | `non-blocking` |
| Conflict identified, resolution deferred | `deferred` |
| Issue entered but not yet triaged | `triage` |

### Issue Naming Convention

Name each issue using the following format:

```
SACA — M[NN]: [Methodology Full Name]
```

Examples:
- `SACA — M01: Critical Discourse Analysis (CDA)`
- `SACA — M02: [Methodology Full Name]`

### Issue Body

Copy the template block from `docs/METHODOLOGY-VALIDATION-ISSUE-TEMPLATE.md` and fill in all fields. Do not open an issue with empty fields — complete at least sections 1 (profile) and 2 (methodology assumptions) before opening.

### Sequencing

Open issues in order M01 → M14. M01 (Critical Discourse Analysis) is the first triage test case and should be completed before opening M02.

### Tracking

The methodology register table in `docs/METHODOLOGY-VALIDATION-ISSUE-TEMPLATE.md` is the canonical tracking list. Update it with the GitHub issue number when each issue is opened.
