# aXIOM

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

**Module 4 — Academic Assessment**
Helps academic teachers assess whether student work meets the specific
requirements of their department. Requirements are configured once and
reused across multiple submissions. Produces a structured assessment
report for the teacher.

---

## Current Status
Validation Focus (Culture-Science Foundations)
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
| `CLAUDE.md` | AI assistant project context |
| `COMMS.md` | Communication strategy for stakeholder-facing materials |
| `FEEDBACK.md` | Feedback intake log — routes items to project or comms tracks |
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
| `pilot_discovery_document.docx` | User testing protocol for pilot sessions |

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
