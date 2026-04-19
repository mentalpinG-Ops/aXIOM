# PRIVACY_CLEANUP.md — Anonymisation Audit Log

This file records every privacy-related replacement made to public files in
the aXIOM repository. It is maintained in accordance with the organisation's
pilot sensitivity policy and research ethics requirements.

Each entry records: the file, a description of the original text, the
replacement, and the reason.

For the overarching policy see the **Privacy and anonymisation protocol**
section in `CONTRIBUTING.md`.

---

## Cleanup pass — 2026-04-19

### 1. FEEDBACK.md — city name removed

| Field | Value |
|---|---|
| File | `FEEDBACK.md` |
| Original | `Pilot (Discovery Session 001, Wałbrzych)` |
| Replacement | `Pilot (Discovery Session 001, a city in Poland)` |
| Reason | Wałbrzych is a specific city that narrows the likely institution to a small set of higher education providers. Removing it prevents indirect identification of Institution B. |

---

### 2. docs/BIBLIOGRAPHY.md — staff name removed

| Field | Value |
|---|---|
| File | `docs/BIBLIOGRAPHY.md` |
| Original | `Candidate literature to be identified as part of Essay No 1 and Błocian engagement.` |
| Replacement | `Candidate literature to be identified as part of Essay No 1 and academic collaborator engagement.` |
| Reason | "Błocian" is the surname of an academic collaborator. Naming individuals in public documentation violates the organisation's privacy policy and research ethics commitment. |

---

### 3. docs/ENGINE_ARCHITECTURE.md — staff name removed

| Field | Value |
|---|---|
| File | `docs/ENGINE_ARCHITECTURE.md` |
| Original | `aXIOM-als-Projekt (Essay, Błocian engagement).` |
| Replacement | `aXIOM-als-Projekt (Essay, academic collaborator engagement).` |
| Reason | Same individual as entry 2. All instances of the collaborator's name are replaced with the role label "academic collaborator". |

---

### 4. docs/METHODOLOGY.md — institution name removed

| Field | Value |
|---|---|
| File | `docs/METHODOLOGY.md` |
| Original | `Academic contact at UWR Institute of Philosophy identified as potential validator` |
| Replacement | `Academic contact at a partner university identified as potential validator` |
| Reason | "UWR" (Uniwersytet Wrocławski) is a named institution. Referencing it in public documentation would link the project to a specific university, violating the pilot sensitivity policy. |

---

### 5. ARCHITECTURE.md — institution names removed (open questions table)

| Field | Value |
|---|---|
| File | `ARCHITECTURE.md` |
| Original | `(SGH 2024, Koźmiński 2025)` |
| Replacement | `(Polish HEI 2024, Polish HEI 2025)` |
| Reason | "SGH" (Szkoła Główna Handlowa) and "Koźmiński" (Akademia Leona Koźmińskiego) are named Polish higher education institutions. These were cited as evidence for the note on AI policy formalisation. Replacing them with the generic label "Polish HEI" preserves the factual claim without naming specific institutions. |

---

### 6. ARCHITECTURE.md — institution names removed (decision log)

| Field | Value |
|---|---|
| File | `ARCHITECTURE.md` |
| Original | `(SGH 2024, Koźmiński 2025)` in the decision log entry for "Institutional AI policy added to open questions" |
| Replacement | `(Polish HEI 2024, Polish HEI 2025)` |
| Reason | Same institutions and same rationale as entry 5. Second occurrence in the Appendix B decision log. |

---

### 7. docs/DISCOVERY_SESSION_001.md — partial city name removed

| Field | Value |
|---|---|
| File | `docs/DISCOVERY_SESSION_001.md` |
| Original | `**Location:** Wr` |
| Replacement | `**Location:** a city in Poland` |
| Reason | "Wr" is a partial truncation of "Wrocław". Even in truncated form it identifies the city with high probability. Replaced with a generic placeholder consistent with the policy. |

---

## Legacy references note

The following categories of legacy references cannot practically be scrubbed
from the repository's git history:

- Commit messages from before this anonymisation pass
- Closed or archived GitHub issues and PRs

No action is taken on these historical records. This audit log documents the
point from which the anonymisation policy is applied to all tracked file
content going forward. Future contributors must follow the **Privacy and
anonymisation protocol** in `CONTRIBUTING.md` for all new work.

---

*Audit log compiled: 2026-04-19. Maintained by project maintainers.*
