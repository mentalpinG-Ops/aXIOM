# aXIOM

> **Status note (2026-05-18):** This repository is preserved as a
> **public vitrine** of the aXIOM project at the 2026-05-18
> scope-cut. No further commits are planned here. The active
> methodology track continues outside this repository.
>
> For the current active/deferred track split see
> [`STATUS.md`](./STATUS.md). The content below the *Historical
> README content* line predates the scope-cut and is preserved as
> historical record.

## About this repository

This is a public snapshot of the **aXIOM** project at the time of its
2026-05-18 scope-cut. aXIOM is a methodological project organised
around the **Declarative Frame Schema (DFS)** — an apparatus for
AI-assisted analysis of cultural and textual artefacts.

The repository archives the **product/pilot branch** of the project:

- an early HTML proof-of-concept (`legacy/` — *Artefact Analyser v1.0*),
- an institutional onboarding wizard for an Academic Assessor module
  (`axiom/`),
- supporting architecture, methodology, and discovery documents
  (`docs/`),
- corresponding governance files (`CONTRIBUTING.md`,
  `PROMPT_GOVERNANCE.md`, `SECURITY_AUDIT.md`, etc.).

This branch is **deferred**. The repository receives no further
commits.

The **methodology track** — DFS development, conceptual work,
academic contact lines — continues outside this repository. If the
deferred product/pilot branch ever reactivates, work would resume in
a separate repository.

## Key files for visitors

| File | What it tells you |
|---|---|
| [`STATUS.md`](./STATUS.md) | Current active/deferred track split, reactivation conditions, vitrine intent. |
| [`HISTORY.md`](./HISTORY.md) | Conceptual evolution timeline from Q1-2026 to the scope-cut. |
| [`CHANGELOG.md`](./CHANGELOG.md) | Structural and scope-level changes. |
| [`docs/METHODOLOGY.md`](./docs/METHODOLOGY.md) | Analytical methodology snapshot. |
| [`docs/ANALYTICAL_COMMITMENTS.md`](./docs/ANALYTICAL_COMMITMENTS.md) | Epistemic output commitments. |
| [`docs/README.md`](./docs/README.md) | Per-file track index for `docs/`. |
| [`SECURITY_AUDIT.md`](./SECURITY_AUDIT.md) | Privacy/security audit (findings deferred). |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Architecture document (pre-scope-cut). |

---

## Historical README content

The content below predates the 2026-05-18 scope-cut and is preserved
verbatim as historical record. It describes the project as it was
framed before the methodology track and the product/pilot track were
formally decoupled. Treat it as a snapshot of the original framing,
not as a current description.

aXIOM is an AI-assisted analysis platform for academic research and
teaching. It is built around four modules that share a common analytical
engine.

The teacher reads, challenges, and decides. The tool carries the
analytical overhead.

---

## Modules

**Module 1 — The Engine**
The shared analytical core. Handles content extraction, structured
analysis, claim taxonomy, and inference logic. Used by all other modules.

**Module 2 — Philosophical Text Analysis**
Analyses philosophical texts for argument structure, presuppositions,
conceptual distinctions, and internal coherence. Designed for researchers
in philosophy and applied social science.

**Module 3 — Cultural Artefact Analysis**
Analyses cultural artefacts — film, media, political speech, visual
material — using semiotic, ideological, and discourse analysis frameworks.
Supports Zotero-based research workflows.

**Module 4 — Academic Assessor**
Helps academic teachers assess whether student work meets the specific
requirements of their department. Requirements are configured once and
reused across multiple submissions. Produces a structured assessment
report for the teacher.

---

## Current Status

### Validation Focus (Culture-Science Foundations)

This project is currently in a validation phase. The primary goal is not reach,
but analytical usefulness and methodological integrity.

#### What the engine is designed to provide

- **Evidence-linked findings**: every analytical claim must be traceable to
  specific passages or segments in the source material.
- **Separation of layers**: the engine distinguishes between
  **extraction/description** (what is in the text) and **interpretation**
  (a reading of what it means).
- **Uncertainty is explicit**: outputs include confidence/uncertainty markers
  and make room for alternative readings where reasonable.

#### What it is not

- It is **not** an objective grader or a truth machine.
- It does **not** replace human interpretation. The human researcher/teacher
  remains responsible for critique and synthesis.

#### Feedback sought (high value)

If you have domain experience in cultural studies, discourse analysis, semiotics,
or qualitative research methods, feedback is most useful on:

- Whether the proposed categories and output structure support scholarly review
  and disagreement (counter-readings), rather than hiding it.
- Whether the tool's separation between description and interpretation is clear
  enough to prevent methodological misuse.

**Phase: Architecture + Proof of Concept**

- Architecture defined. No application code written yet.
- Modules 2 and 3 are in active personal use via the original
  single-file HTML tool (see `legacy/`).
- Module 4 is the primary build target for phase 1.
- Pilot programme in preparation with academic institutions in Poland.

---

## Proof of Concept

The `legacy/` folder contains the original proof of concept — the
**Artefact Analyser** — a single-file HTML tool implementing the
analytical engine via AI prompting. It is functional and in active use,
but does not constitute a validated scientific methodology. See
[METHODOLOGY.md](docs/METHODOLOGY.md) for discussion of this boundary.

---

## Repository Contents

| File / Folder | Description |
| --- | --- |
| `ARCHITECTURE.md` | System architecture and decision log |
| `CLAUDE.md` | Anthropic Claude Code project context |
| `COMMS.md` | Communication strategy for stakeholder-facing materials |
| `CONTRIBUTING.md` | Contribution guidelines and coding standards |
| `FEEDBACK.md` | Feedback intake log — routes items to project or comms tracks |
| `.github/copilot-instructions.md` | GitHub Copilot project context |
| `legacy/` | Original proof of concept (Artefact Analyser v1.0) |
| `docs/` | Supporting documents (see below) |

### docs/

| File | Description |
| --- | --- |
| `BIBLIOGRAPHY.md` | Reference literature |
| `DISCOVERY_PROTOCOL.md` | Protocol for pilot discovery sessions |
| `DISCOVERY_SESSION_001.md` | Notes from first discovery session |
| `GITHUB_ISSUES_SETUP.md` | Issue label and workflow conventions |
| `METHODOLOGY.md` | Analytical methodology and its current limitations |
| `ANALYTICAL_COMMITMENTS.md` | Epistemic/analytical output commitments |


---

## Planned Stack

- Python + FastAPI
- PostgreSQL
- Plain HTML / CSS / JavaScript
- Docker

No application code has been written yet. These are architectural
decisions documented in [ARCHITECTURE.md](ARCHITECTURE.md).

---

*aXIOM — 2026*
