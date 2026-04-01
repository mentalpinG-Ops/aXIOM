# aXIOM
aXIOM is an AI-assisted analysis platform for academic research and 
teaching. It is built around four modules that share a common engine.
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
## Proof of Concept
The `legacy/` folder contains the original proof of concept — the 
**Artefact Analyser (v1.0)** — from which the aXIOM architecture was 
derived. It is a self-contained single-file HTML application with no 
external runtime dependencies. Preserved as a working reference, not 
active development code.
---
## Current Status
Early development. Architecture defined. Pilot programme in preparation 
with selected academic institutions in Poland.
Modules 2 and 3 are in active personal use as a single-file HTML tool. 
Module 4 is the primary build target for phase 1.
---
## Repository Contents
| File / Folder | Description |
|---------------|-------------|
| ARCHITECTURE.md | Full architecture and decision log |
| docs/ | Supporting documents |
| docs/pilot_discovery_document.docx | User testing protocol for pilot sessions |
| legacy/ | Original proof-of-concept HTML tool (Artefact Analyser v1.0) |
---
## Built With
- Python + FastAPI
- PostgreSQL
- Plain HTML / CSS / JavaScript
- Docker
---
## Status Notes
This repository is in active early development. 
Architecture decisions are documented in ARCHITECTURE.md. 
Open questions and deferred items are listed there.
---
*aXIOM — 2026*

**Commit message:**
```
Update README: add legacy/ folder and proof-of-concept section
