# CONTRIBUTING.md — aXIOM Contribution Guidelines

Thank you for your interest in contributing to aXIOM. Please read these
guidelines before opening an issue or submitting a pull request.

---

## Technology stack

The following stack is decided and committed. Do not propose alternatives.

- **Backend:** Python + FastAPI
- **Database:** PostgreSQL
- **Frontend:** Plain HTML + CSS + JavaScript (no frameworks)
- **Containerisation:** Docker + Docker Compose
- **Deployment:** Docker application (not SaaS in phase 1)

---

## Coding standards

### UTF-8 everywhere

UTF-8 is mandatory across the entire stack. The application handles Polish
and German text throughout, so encoding must never be an afterthought.

Every new component must satisfy this checklist before it is considered done:

- Database initialised with explicit UTF-8 encoding
- PostgreSQL collation configured for Polish and German text columns
- Docker container locale set to UTF-8 (Dockerfile)
- FastAPI responses declare `charset=utf-8` in `Content-Type` header
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

### No frontend framework dependencies

The frontend is plain HTML + CSS + JavaScript. Do not introduce React, Vue,
Angular, or any other JS framework. Do not introduce npm or a build step.

### No Zotero dependency in the Academic Assessor

Zotero integration belongs exclusively to the Research Analyser (Modules 2
and 3). Module 4 has no Zotero dependency of any kind.

### Multi-tenancy-ready database queries

Write all queries scoped correctly for future row-level security. Do not
assume a single tenant even in phase 1.

### Abstracted authentication

Do not hardcode any authentication provider. Phase 1 uses API keys only.
Azure OpenAI and other providers are deferred to phase 2.

### All UI strings in translation files

Never hardcode user-facing text in the UI. Every string goes in the
translation JSON file. English is the master language. Polish ships with
v1.0. German ships with v1.1.

---

## Translation workflow

### Adding new strings

1. Write the English string in `legacy/i18n/en.json` (and in the corresponding
   application i18n file when Module 4 files are created).
2. Add the same key with an empty string value (`""`) to every language file
   that already exists (e.g. `pl.json`). This marks the string as awaiting
   translation without blocking English usage.
3. Run `python tools/check_translations.py` to confirm the new key appears
   as ✏️ (in progress) and not ⬜ (missing).

### Translating strings

1. Translate the English value into the target language.
2. Replace the empty string in the language file with the translated text.
3. Run `python tools/check_translations.py --lang LANG` to verify the string
   moves from ✏️ to ✅ in the report.

### Checking translation status

```
# Show status for all language files
python tools/check_translations.py

# Show status for Polish only
python tools/check_translations.py --lang pl

# Show all strings including already-translated ones
python tools/check_translations.py --verbose

# Exit with code 1 if any strings are incomplete (useful in CI)
python tools/check_translations.py --strict
```

The authoritative per-string status is always produced by the script.
The high-level group table in ARCHITECTURE.md Appendix A is updated by
hand when a group reaches a milestone (all strings in the group translated
and reviewed).

### Language file locations

| File | Language | Ships with |
|------|----------|------------|
| `legacy/i18n/en.json` | English (master) | v1.0 |
| `legacy/i18n/pl.json` | Polish | v1.0 |
| `legacy/i18n/de.json` | German | v1.1 — create when German translation begins |

---

## AI provider guidelines

All prompt templates must be written for model-agnostic use. Do not use
provider-specific prompting techniques in the aXIOM assessment prompts.

The Academic Assessor (Module 4) supports Anthropic Claude and OpenAI GPT
via API key. The Research Analyser (Modules 2 and 3) is Anthropic-native —
this distinction is intentional and must be preserved.

---

## File format support

Supported student-work formats: DOCX, PDF (text layer only), TXT, RTF, ODT

Explicitly excluded: Pages (`.pages`), scanned PDFs, image-only files

Unsupported formats must produce a plain-language error message. No crashes
or technical errors should ever be exposed to the teacher.

---

## Error handling

- Maximum 3 retries on any AI output failure
- After 3 retries: graceful failure with plain-language message to teacher
- No cryptic technical errors ever exposed to the teacher
- Raw model output preserved on malformed output so the teacher can inspect it
- Confidence indicators included in every report section

---

## File naming conventions

- Root-level documentation: `SCREAMING_SNAKE_CASE.md`
- `docs/` folder Markdown files: `SCREAMING_SNAKE_CASE.md`
- JavaScript files: `kebab-case.js`
- Provider files: `lowercase.js`

---

## Pilot sensitivity

The two pilot institutions must not be named in any commit message,
issue, pull request, or documentation. Refer to them as:

- **Institution A** — art academy
- **Institution B** — applied sciences university

---

## Privacy and anonymisation protocol

Never include the following in any public file, commit message, issue, or PR:

- Real institution names (universities, academies, schools)
- Real names of academic staff, collaborators, or pilot participants
- City or country identifiers that could identify a specific institution
- Any other information that could de-anonymise a pilot participant or stakeholder

When referencing institutions use the pseudonyms above. When referencing academic
contacts or collaborators use neutral role labels such as "academic collaborator",
"pilot participant", or "validator". When referencing pilot locations use generic
terms such as "a city in Poland".

Every privacy-related replacement made to public files must be logged in
`PRIVACY_CLEANUP.md` at the repository root. Each entry must record:

- The file path and line reference
- The original text (or a description of it)
- The replacement text
- The reason for the replacement

Run a privacy scan before opening any PR that touches documentation:
```
grep -rn "UWR\|SGH\|Koźmiński\|Wałbrzych\|Błocian" --include="*.md" --include="*.html" --include="*.js" --include="*.py" .
```
If the scan returns any results, anonymise them before merging.

---

## What is deferred (do not build in phase 1)

- SaaS hosted version
- Azure OpenAI and self-hosted model authentication
- PDF and DOCX report export
- Multi-tenant admin layer
- Student-facing output
- Modules 2 and 3 (Research Analyser) full build
- German language support (v1.1, not v1.0)

---

## Key documents

- `ARCHITECTURE.md` — full architecture and decision log (source of truth)
- `CLAUDE.md` — AI assistant context file
- `docs/` — supporting documents including pilot discovery protocol
