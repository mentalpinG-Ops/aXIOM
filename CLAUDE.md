# CLAUDE.md — aXIOM Project Context

This file provides context for Claude Code working on the aXIOM codebase.
Read this before touching any file.

---

## What this project is

aXIOM is an AI-assisted academic assessment platform. It helps teachers
evaluate whether student work meets the specific requirements of their
university department.

The platform has a parent-child architecture: a shared engine (Module 1)
powers two applications — a Research Analyser (Modules 2 and 3, deferred)
and an Academic Assessor (Module 4, primary build target).

The Academic Assessor is being piloted at two institutions in Poland.

---

## Non-negotiable stack

Do not suggest alternatives to these. They are decided and committed.

- Backend: Python + FastAPI
- Database: PostgreSQL
- Frontend: Plain HTML + CSS + JavaScript (no frameworks)
- Containerisation: Docker + Docker Compose
- Deployment: Docker application (not SaaS in phase 1)

---

## Standing requirements

These apply to every file, every component, every change.

### UTF-8
UTF-8 is mandatory across the entire stack. This is non-negotiable because
the application handles Polish and German text throughout.

Every new component must satisfy this checklist before it is considered done:
- Database initialised with explicit UTF-8 encoding
- PostgreSQL collation configured for Polish and German text columns
- Docker container locale set to UTF-8 (Dockerfile)
- FastAPI responses declare charset=utf-8 in Content-Type header
- File input pipeline preserves encoding through every processing step
- Filenames with diacritics handled correctly in upload and storage
- Log files configured for UTF-8 output
- Translation JSON files saved as UTF-8 without BOM
- AI API calls encode request body as UTF-8
- All prompt templates declare expected input and output language explicitly

### No hardcoded infrastructure assumptions
The architecture must support both local deployment and future SaaS from
day one. No hardcoded server addresses, ports, or environment-specific paths
outside of configuration files.

### No framework dependencies in the frontend
The frontend is plain HTML + CSS + JavaScript. Do not introduce React, Vue,
Angular, or any other JS framework. Do not introduce npm or a build step.

### No Zotero dependency in the Academic Assessor
Zotero integration belongs exclusively to the Research Analyser (Modules 2
and 3). Module 4 has no Zotero dependency of any kind.

### Database queries must be multi-tenancy ready
Write all queries scoped correctly for future row-level security. Do not
assume a single tenant even in phase 1.

### Authentication must be abstracted
Do not hardcode any authentication provider. Phase 1 uses API keys only.
Azure OpenAI and other providers are deferred to phase 2.

### All UI strings in translation files
Never hardcode user-facing text in the UI. Every string goes in the
translation JSON file. English is the master language. Polish ships with
v1.0. German ships with v1.1.

---

## AI provider abstraction

The Academic Assessor (Module 4) supports multiple AI providers.
Phase 1 supports Anthropic Claude and OpenAI GPT via API key.

All prompt templates must be written for model-agnostic use. No
Claude-specific prompting techniques in the aXIOM assessment prompts.

The Research Analyser (Modules 2 and 3) is Anthropic-native. This
distinction is intentional and must be preserved.

---

## File formats — student work

Supported: DOCX, PDF (text layer only), TXT, RTF, ODT
Explicitly excluded: Pages (.pages), scanned PDFs, image-only files

Unsupported formats must produce a plain-language error message explaining
what format to request from the student. No crashes, no technical errors
exposed to the teacher.

---

## Error handling principles

- Maximum 3 retries on any AI output failure
- After 3 retries: graceful failure with plain-language message to teacher
- No cryptic technical errors ever exposed to the teacher
- Raw model output preserved on malformed output so teacher can inspect it
- Confidence indicators included in every report section

---

## Pilot sensitivity

The two pilot institutions must not be named in any public-facing file,
commit message, or documentation. Refer to them as Institution A (art
academy) and Institution B (applied sciences university).

---

## Key documents

- `ARCHITECTURE.md` — full architecture and decision log (source of truth)
- `docs/` — supporting documents including pilot discovery protocol

---

## What is deferred (do not build these in phase 1)

- SaaS hosted version
- Azure OpenAI and self-hosted model authentication
- PDF and DOCX report export
- Multi-tenant admin layer
- Student-facing output
- Modules 2 and 3 (Research Analyser) full build
- German language support (v1.1, not v1.0)
```

---

**Step 3 — Commit the file**

Scroll down to "Commit changes". Set the commit message to:
```
Add CLAUDE.md — Claude Code context file
