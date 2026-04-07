# aXIOM — ARCHITECTURE.md

Living Architecture Document — Version 0.1 | Last updated: 2026-04-07

---

> This document captures all architecture decisions made to date. Decided items are closed and committed. Open items are explicitly marked as pending. Deferred items are recorded for future phases. This document must be updated at the end of every planning session.

## 0. Platform architecture

<img src="docs/architecture_diagram.svg" alt="aXIOM platform architecture" width="100%">
---

## 1. Platform Overview

The platform consists of four modules organised into two applications sharing one common engine.

### 1.1 The Four Modules

| Module | Name | Status |
|--------|------|--------|
| 1 | The Engine | In scope — phase 1 |
| 2 | Philosophical Text Analysis | Active — delivered via Artefact Analyser v1.0 |
| 3 | Cultural Artefact Analysis | Active — delivered via Artefact Analyser v1.0 |
| 4 | aXIOM | In scope — phase 1 |

### 1.2 The Two Applications

**Application A — Research Analyser**
Modules 2 and 3. Researcher-facing. Philosophical text analysis and cultural artefact analysis. Zotero integration. Currently delivered as Artefact Analyser v1.0 — a single-file HTML tool in active informal use. Full platform build follows Module 4.

**Application B — aXIOM**
Module 4. Teacher-facing. Rubric-based student work evaluation against institutional requirements. No Zotero dependency. Primary build target for phase 1.

aXIOM manages analytical overhead in the analysis phase of the academic work cycle — it does not replace human synthesis. The teacher reads, challenges, and decides. The tool carries the paperwork load.

### 1.3 The Engine
Shared infrastructure underneath both applications. Input pipeline, 
content extraction, SHA-256 ID system, AI provider communication, 
response parsing, and structured output generation. Packaged as a 
shared Python library. No AI provider assumption. No user accounts. 
No Zotero dependency.

Analytical schema, claim taxonomy, and inference logic belong to the 
prompt layer — not the engine. Each application uses its own prompt: 
the Research Analyser uses the Core Prompt (see `prompts/`), aXIOM 
uses a separate Assessment Prompt informed by institutional context. 
See `docs/ENGINE_ARCHITECTURE.md` for the three-layer separation 
(transport / prompt / output) and section selection decisions.

---

## 2. aXIOM — Scope and Workflows

### 2.1 Primary User
The teacher. Sole user and recipient of all output in phase 1.

### 2.2 Three Workflows

**Workflow 1 — Formative checkpoint**
Teacher assesses student work during the course and receives structured feedback plus improvement recommendations.

**Workflow 2 — Thesis evaluation**
Higher stakes assessment feeding into a grading decision.

**Workflow 3 — Compliance audit**
Retrospective evaluation of finished, graded work against departmental or institutional requirements.

### 2.3 Compliance Standard — Two Layers

| Layer | Source | Configured by |
|-------|--------|---------------|
| Programme requirements | Institution/department programme regulations | Teacher (phase 1) → Admin/supervisor (phase 2) |
| Teacher criteria | Individual academic judgment within programme requirements | Teacher |
| AI use policy | Institution/department AI use regulations for students | Not yet in wizard scope — see §14 Open Questions |

National law is a background assumption. The institution is trusted to have produced programme requirements compliant with national law. The tool does not monitor legal compliance.

### 2.4 Phase Structure

**Phase 1 — Teacher-managed, deployable**
Single teacher per installation. Teacher inputs and owns all configuration. Report is for teacher's eyes only. Printing supported. No sharing or export beyond print.

**Phase 2 — Institution-managed (deferred)**
Admin/supervisor owns programme requirements configuration. Multiple teachers share institutional standard. Teacher-mediated student feedback added. Direct student output explicitly excluded until phase 2 is designed carefully.

---

## 3. Requirement Configuration

### 3.1 Model
Hybrid. Two layers:

**Layer 1 — Structured wizard (mandatory)**
A step-by-step guided form covering fields that every assessment requires. The engine relies on these directly for assessment logic.

**Layer 2 — Free text extension**
Anything Layer 1 does not capture. Written by the teacher in natural language. Treated as supplementary context by the engine — informs assessment but is not parsed into discrete checks.

### 3.2 Wizard Structure (Layer 1)
Steps flow in this order:

1. Assignment context (type, level, who it is for)
2. Programme requirements (institutional fixed layer)
3. Teacher criteria (interpretive layer within programme requirements)
4. Free text extension (Layer 2 — anything not covered above)
5. Review and confirm (teacher sees complete requirement set, can return to any step before saving)

Specific fields within each step: **OPEN — see to-do list.**

### 3.3 Three Operations on Requirement Sets

| Operation | Description | Versioning behaviour |
|-----------|-------------|----------------------|
| Create | Full wizard, empty fields | Saves as version 1 |
| Correct | Jump to relevant step, change what is wrong | Saves as version 2 of same set. Previous assessments flagged for review |
| Branch | Duplicate existing set, full wizard prepopulated, modify as needed | Saves as new independent requirement set. Previous assessments untouched |

Version history is maintained. Every assessment record is linked to the specific version of the requirement set it was run against.

---

## 4. Structured Output — Parsing and Failure Handling

### 4.1 The Pipeline
Raw model output
→ Validation layer
→ Retry logic (max 3 attempts)
→ Confidence scoring
→ Report assembly
→ Teacher review

### 4.2 Three Failure Modes and Their Solutions

| Failure mode | Description | Solution |
|--------------|-------------|----------|
| Incomplete output | Model stops mid-assessment, fields missing | Retry with continuation prompt. After 3 retries: graceful failure message to teacher |
| Malformed output | Structure wrong, cannot be parsed | Validation layer catches it, retry with explicit format instruction. Raw output preserved so teacher can see what model produced |
| Shallow output | Structurally complete but analytically empty | Cannot be caught automatically. Transparency in report: confidence indicators per section, raw evidence cited from student text visible to teacher |

---

### 4.3 Retry Limit
Maximum 3 retries across all failure types. After 3 retries the assessment fails gracefully with a plain-language error message. No cryptic technical errors exposed to the teacher.

---

## 5. Technology Stack

### 5.1 Decisions

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Backend | Python + FastAPI | Best AI-assistant support, readable, strong document processing libraries |
| Database | PostgreSQL | Reliable, Unicode-native, row-level security for phase 2 multi-tenancy |
| Frontend | Plain HTML + CSS + JavaScript | No framework overhead, close to existing HTML tool in spirit, maintainable solo |
| Containerisation | Docker + Docker Compose | Single command deployment, platform-independent, one-file stack definition |
| Package | Deployable container | Distributed as software, not a hosted service (phase 1) |

### 5.2 Development Environment
Ubuntu desktop (local). Docker Compose runs the full stack locally. PostgreSQL runs in a container alongside the application. Browser points to localhost for the frontend.

### 5.3 Platform Support
Linux (Ubuntu) — primary development environment. Mac (Intel and Apple Silicon) — must be explicitly tested before pilot. Windows (WSL2) — supported via Docker Desktop. All platforms supported via Docker — no platform-specific code.

---

## 6. Deployment Model

### 6.1 Phase 1 — Deployable Application
Distributed as a Docker Compose package. Institution or teacher installs Docker, runs one command, opens browser. No server infrastructure managed by the project. No hosted service. No ongoing operational responsibility.

### 6.2 Phase 2 — SaaS (deferred)
Hosted version added alongside deployable version. Teachers who cannot install Docker use the hosted version. Institutions requiring data sovereignty use their own deployment. Architecture is designed to support both from day one without requiring a rebuild.

### 6.3 Architecture Discipline for SaaS Readiness
The following must be true from the first line of code to keep the SaaS path open:
- No hardcoded infrastructure assumptions
- Database queries scoped correctly for future multi-tenancy
- Authentication abstracted, not hardcoded to one provider
- All text strings in translation files, never hardcoded in UI

---

## 7. AI Provider Abstraction Layer

### 7.1 Scope
Both applications support multiple AI providers. The engine itself has no AI provider assumption. Provider abstraction is implemented at the application layer in both the Research Analyser and aXIOM.

The Research Analyser (modules 2 and 3) uses the same provider abstraction pattern as aXIOM. This is consistent with the legacy Artefact Analyser v1.0, which already implements multi-provider support (Anthropic, OpenAI, Azure OpenAI, custom endpoints). The rebuild preserves this.

### 7.2 Phase 1 Supported Configurations

| Provider | Authentication | Priority |
|----------|---------------|----------|
| Anthropic Claude | API key | Primary — day one |
| OpenAI GPT | API key | Day one — same pattern as Anthropic |
| Azure OpenAI | Endpoint URL + API key + deployment name | Phase 2 |
| Self-hosted local models | Configurable endpoint, no auth | Phase 2 — named candidates for Polish pilot context: Bielik and Plum (Polish-language LLMs, locally installable, no internet dependency; relevant for institutions with data sovereignty requirements) |

### 7.3 Capability Probe
Runs at setup against any unlisted or custom AI endpoint. Tests:
- Structured output compliance (can the model return parseable schema output?)
- Instruction following fidelity (does it activate correct fields per mode?)
- Response length (does it truncate before completing the schema?)
- Image input support (does it handle embedded visual content?)
- Polish and German language handling (separate test documents per language)

**Probe outcomes:**

| Result | Meaning | Action |
|--------|---------|--------|
| Green | Full compliance | Proceed normally |
| Yellow | Partial compliance — known limitations | Flag degraded capabilities in UI, proceed with warnings |
| Red | Structural compliance failure | Cannot proceed — clear plain-language explanation to administrator |

Known-compatible model configurations skip the full probe and receive immediate green.

### 7.4 Visual Content Handling
**Option B (default):** Extract text and embedded images from student submissions. Pass both to AI model for complete assessment.

**Option C (automatic fallback):** If model fails image capability check in probe, switch to text-only extraction. Flag clearly in every report that visual content was present but not assessed. Teacher sees warning at setup. Particularly relevant for Institution A (art academy) where visual content in student work is the norm.

### 7.5 Prompt Template Design
All prompt templates written for model-agnostic use. No provider-specific prompting techniques in either application's prompts. Templates must produce consistent structured output across supported providers.

---

## 8. Multilingual Architecture

### 8.1 Language Settings
Three independent settings, each configurable separately:

| Setting | Description |
|---------|-------------|
| UI language | Language the teacher navigates the application in |
| Input language | Language the student work is written in |
| Output language | Language the assessment report is produced in |

### 8.2 Languages

| Language | Status | Notes |
|----------|--------|-------|
| English | Ships with v1.0 | Master language — source of truth for all strings |
| Polish | Ships with v1.0 | AI-translated, human reviewed |
| German | Ships with v1.1 | AI-translated, human reviewed |
| Additional languages | N-language architecture — add translation file, no code changes | Future |

### 8.3 Translation Discipline
English is written and finalised first. Translation runs only on stable English content. A translation status table is maintained in this document (see Appendix A). All translation files are JSON with explicit UTF-8 encoding.

### 8.4 Capability Probe — Language Testing
The probe tests the configured AI model in both Polish and German using native academic text — not translations of English test documents. Each test document contains all language-specific diacritics deliberately.

---

## 9. UTF-8 Compliance

UTF-8 is a standing requirement across every component. The following checklist applies to every new component added to the stack.

### 9.1 UTF-8 Compliance Checklist
- [ ] Database initialised with explicit UTF-8 encoding
- [ ] PostgreSQL collation configured for Polish and German text columns
- [ ] Docker container locale set to UTF-8 (Dockerfile)
- [ ] .gitattributes enforces UTF-8 without BOM for all text files
- [ ] FastAPI responses declare charset=utf-8 in Content-Type header
- [ ] File input pipeline preserves encoding through every processing step
- [ ] Filenames with diacritics handled correctly in upload and storage
- [ ] Log files configured for UTF-8 output
- [ ] Translation JSON files saved as UTF-8 without BOM
- [ ] AI API calls encode request body as UTF-8
- [ ] All prompt templates declare expected input and output language explicitly
- [ ] Capability probe test documents contain all Polish diacritics (ą ć ę ł ń ó ś ź ż) and German umlauts (ä ö ü ß)

---

## 10. Student Work File Formats

### 10.1 Supported Formats (Phase 1)

| Format | Notes |
|--------|-------|
| DOCX | Primary format — must work perfectly |
| PDF | Text-layer PDFs only. Scanned PDFs not supported |
| TXT | Edge case — trivial to support |
| RTF | Relevant for Mac users (TextEdit default) and older systems |
| ODT | Relevant for LibreOffice users — common in European academic institutions |

### 10.2 Explicitly Excluded (Phase 1)
Pages (.pages), scanned PDFs, handwritten work, standalone image files (JPG, PNG).

### 10.3 Unsupported Format Handling
Graceful failure with a plain-language message explaining the format is not supported and what format to request from the student instead. No crashes, no cryptic errors.

---

## 11. Data Retention

### 11.1 Retention Period
Study cycle length plus one year. Configured at setup by the teacher. Applies to all document types including thesis work.

### 11.2 Deletion Behaviour
Automatic flagging when records reach expiry date. Teacher receives notification and confirms deletion — records are not deleted silently. Teacher can manually delete any record at any time before expiry.

### 11.3 Rationale
Student work is personal data under GDPR. The institution owns the data in a locally deployed installation. The tool provides explicit retention and deletion controls so the institution can meet its own data governance obligations.

---

## 12. Report Output

### 12.1 Phase 1
On-screen report displayed in the browser. Print stylesheet included from day one — designed alongside the screen report, not retrofitted. Print via browser (Ctrl+P) produces a clean, well-formatted output suitable for physical filing.

### 12.2 Print Stylesheet Requirements
- Hides navigation, buttons, and UI chrome
- Page breaks at section boundaries, never mid-finding
- Black and white friendly — no colour-dependent meaning
- Polish and German characters render correctly (handled by browser)
- Typography clear at print resolution

### 12.3 Phase 2 (deferred)
PDF export, DOCX export, direct sharing with examination boards.

### 12.4 Report Structure
**OPEN — see to-do list.**

---

## 13. Pilot Programme

### 13.1 Target Institutions
- Institution A — Academy of Fine Arts (Poland)
- Institution B — University of Applied Sciences (Poland)

### 13.2 Pilot Approach
**Phase 1 pilot:** One identified teacher. Observed live session. Tool used independently without facilitation guidance. Facilitator observes and takes notes using the Pilot Discovery Document.

**Phase 2 pilot:** Wider group of testers using the tool independently and submitting self-reported feedback using the same document.

### 13.3 Pilot Discovery Document
Separate document. Filed in repository as `docs/pilot_discovery_document.docx`. Covers pre-session baseline, setup observation (with focus on API key friction), first use observation, debrief questions, and facilitator summary. Designed to work for both observed and self-reported sessions.

### 13.4 Known Friction Points
API key setup is a confirmed friction point from prior observation. The setup wizard must treat API key configuration as a first-class onboarding problem — dedicated wizard step, inline guidance, visible test confirmation, plain-language error messages, cost estimate display.

1:1 onboarding required. Group format insufficient for tool introduction. Individual sessions needed. The tool's utility is embedded in individual professional practice — access to the Lebenswelt of the individual assessor requires a 1:1 setting.

---

## 14. Open Questions (To-Do List)

| Item | Description | Depends on |
|------|-------------|------------|
| Wizard Layer 1 fields | Specific fields within each wizard step | Further design session |
| Report structure and sections | What the assessment report contains and how it is organised | Further design session |
| Print stylesheet design | Detailed design of print output | Report structure decision |
| Cost visibility | Whether and how to show token usage and estimated cost per assessment run | Further design session |
| Update mechanism | How teachers update their installation without losing data | Further design session |
| Onboarding flow design | Full setup experience beyond the capability probe | Pilot feedback |
| Connection between modules 3 and 4 | How cultural artefact analysis output (module 3) relates to aXIOM assessment (module 4) | Deferred until module 3 is in scope |
| Translation status tracking | Per-string translation status for Polish and German | Translation work begins |
| Student-facing variant | Self-check tool for students before submission | Roadmap — deferred, not v1.0 scope |
| Institutional AI policy field in wizard | Should the wizard include a field for the teacher to declare the institution's current AI use policy for students? Polish institutions are only beginning to formalise these policies (SGH 2024, Koźmiński 2025). Without this field, Workflow 3 (compliance audit) may miss a layer of the institutional compliance standard. | Further design session |

---

## 15. Deferred Items (Phase 2)

- Admin/supervisor institutional configuration layer
- Multi-tenant data isolation and row-level security
- Student-facing feedback (teacher-mediated)
- Student self-check variant (roadmap)
- SaaS hosted version
- Azure OpenAI and self-hosted model authentication
- PDF and DOCX report export
- Direct sharing with examination boards
- Zotero integration (modules 2 and 3 only)
- Research Analyser full platform build (Modules 2 and 3 — currently active as Artefact Analyser v1.0)

---

## Appendix A — Translation Status

| String group | English | Polish | German |
|--------------|---------|--------|--------|
| UI navigation | ⬜ Pending | ⬜ Pending | ⬜ Pending |
| Wizard steps | ⬜ Pending | ⬜ Pending | ⬜ Pending |
| Error messages | ⬜ Pending | ⬜ Pending | ⬜ Pending |
| Report output | ⬜ Pending | ⬜ Pending | ⬜ Pending |
| Capability probe messages | ⬜ Pending | ⬜ Pending | ⬜ Pending |
| Onboarding and setup | ⬜ Pending | ⬜ Pending | ⬜ Pending |

Status key: ⬜ Pending — ✏️ In progress — 👁 In review — ✅ Approved

---

## Appendix B — Decision Log

| Decision | Date | Rationale |
|----------|------|-----------|
| Two applications, one engine | 2026-03-27 | Research Analyser and aXIOM have different user types, different integration needs, and different deployment requirements |
| Deployable before SaaS | 2026-03-27 | Product is in validation phase — deployable gets real user feedback faster with less infrastructure commitment and no GDPR liability |
| Python + FastAPI backend | 2026-03-27 | Best AI-assistant support for solo non-coder builder, readable, strong document processing ecosystem |
| Plain HTML frontend | 2026-03-27 | No framework overhead, maintainable solo, close to existing tool in spirit |
| Hybrid requirement configuration | 2026-03-27 | Structured fields give engine reliability; free text extension preserves flexibility for requirements that don't fit predefined fields |
| 3 retry maximum | 2026-03-27 | Balances transient error recovery against API cost and time waste on genuinely broken configurations |
| English and Polish day one | 2026-03-27 | Primary pilot institutions are Polish. German follows as third language |
| N-language architecture | 2026-03-27 | Adding a language later should require only a translation file, not code changes |
| UTF-8 standing requirement | 2026-03-27 | Polish and German diacritics touch every layer of the stack — discipline from day one prevents silent corruption |
| AI abstraction in both applications | 2026-03-27 | Both Research Analyser and aXIOM support multiple AI providers. The engine has no provider assumption. Legacy Artefact Analyser v1.0 already implements multi-provider abstraction — the rebuild preserves this. Earlier documentation stated Modules 2–3 were Anthropic-native; this was incorrect and is superseded by this entry. |
| Phase 1 auth: API key only | 2026-03-27 | Target institutions are small, teacher-deployed — no enterprise auth needed in phase 1 |
| Supported formats: DOCX, PDF, TXT, RTF, ODT | 2026-03-27 | Covers typed work across Windows, Mac, and Linux academic environments. Scanned/handwritten excluded |
| Visual content: Option B with Option C fallback | 2026-03-27 | Institution A is an art academy — visual content in student work is the norm. Option C fallback ensures graceful degradation when model lacks image capability |
| Retention: study cycle + 1 year | 2026-03-27 | Aligns with European academic records practice. Teacher confirms deletion — no silent removal |
| Report: on-screen with print stylesheet | 2026-03-27 | Print covers physical filing needs. PDF/DOCX export deferred to phase 2 |
| Research Analyser reframed as active | 2026-04-03 | Discovery session (Institution A) surfaced strong interest in artefact/text analysis over Module 4. Artefact Analyser v1.0 confirmed as active informal delivery vehicle for Modules 2 and 3. "Deferred" status removed. Full platform build follows Module 4. |
| Core positioning principle adopted | 2026-04-03 | aXIOM manages analytical overhead in the analysis phase of the academic work cycle — it does not replace human synthesis. Added to ARCHITECTURE.md, CLAUDE.md, and COMMS.md as a non-negotiable framing principle. |
| 1:1 onboarding required | 2026-04-03 | Group format insufficient for tool introduction. Individual sessions needed. Group dynamics suppress individual sense-making; access to the Lebenswelt of the individual assessor requires a 1:1 setting. |
| Student-facing variant deferred | 2026-04-03 | Identified as potential extension — added to roadmap. Not v1.0 scope. |
| Institutional AI policy added to open questions | 2026-04-07 | Polish academic institutions are only beginning to formalise AI use policies for students (SGH 2024, Koźmiński 2025). Wizard Layer 1 currently has no field for this. Workflow 3 (compliance audit) may miss this layer. Added to §14 for design decision. |
| Bielik and Plum named as local LLM candidates | 2026-04-07 | Polish-language locally installable models relevant for pilot institutions with data sovereignty requirements. Added as named examples under self-hosted local models (Phase 2 slot). |

Last updated: 2026-04-07
