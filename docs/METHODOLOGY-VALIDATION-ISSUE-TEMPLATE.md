# METHODOLOGY-VALIDATION-ISSUE-TEMPLATE.md — aXIOM

**Purpose:** Template for documenting each of the 14 methodology conflict checks (M01–M14).  
**Prerequisite:** `docs/ENGINE-COHERENCE-AUDIT.md` must be completed before any entry is finalised.  
**Process name:** Specification-Assumption Coherence Audit (SACA)

Each methodology is checked against the three foundational traditions established in the engine coherence audit:

1. The engine's cultural-science / qualitative orientation (ANALYTICAL_COMMITMENTS.md)
2. Design Science Research — DSR (Hevner et al. 2004)
3. Phenomenological / interpretivist grounding (Husserl, Schütz, Flick, Bohnsack)

---

## How to Use This Template

1. Copy the template block below for each methodology (M01–M14)
2. Fill in all fields before marking the entry as complete
3. Open a GitHub issue per methodology using the label set defined in `docs/GITHUB_ISSUES_SETUP.md`
4. Link the issue to the conflict matrix (Stage 2 deliverable) when available
5. Do not close a methodology issue until the Resolution Status is set to ✅ RESOLVED or 🔴 REQUIRES MODIFICATION + rationale documented

---

## Template Block

```
## M[NN] — [Methodology Full Name]

**ID:** M[NN]  
**Date:** YYYY-MM-DD  
**Status:** [⚠️ In progress | ✅ Resolved | 🔴 Requires modification]  
**Linked issue:** #[GitHub issue number]

---

### 1. Methodology Profile

**Theoretical lineage:**  
[Name the intellectual tradition this methodology belongs to. Include key founding figures and the broader school/tradition.]

**Key authors and primary texts:**  
- [Author (Year). *Title*. Publisher.]
- [...]

**Current status in the field:**  
[Is this methodology active, contested, declining, or being extended? Note any significant recent developments.]

**Relevance to aXIOM:**  
[Why does this methodology appear in the engine's prompt design? What analytical function does it serve?]

---

### 2. Key Assumptions of This Methodology

List the core epistemological and methodological assumptions that govern this framework. These are the claims that must be true for the methodology to work as stated.

1. [Assumption 1]
2. [Assumption 2]
3. [Assumption 3]
4. [...]

---

### 3. Assumptions in the Prompt-Design Specification

List the assumptions embedded in the engine's prompt design that are relevant to this methodology — how does the engine *operationalise* this methodology's concepts?

1. [Engine assumption 1]
2. [Engine assumption 2]
3. [Engine assumption 3]
4. [...]

---

### 4. Conflict Check

Check each engine assumption against the methodology's assumptions. Identify misalignments.

| Engine assumption | Methodology assumption it references | Conflict? | Notes |
|---|---|---|---|
| [Engine assumption 1] | [Methodology assumption X] | ✅ No / ⚠️ Partial / 🔴 Yes | [Explanation] |
| [Engine assumption 2] | [Methodology assumption Y] | ✅ No / ⚠️ Partial / 🔴 Yes | [Explanation] |
| [...] | [...] | [...] | [...] |

**Summary of conflicts found:**  
[Describe the nature and severity of any conflicts. If none, state "No conflicts found."]

---

### 5. Cross-Check Against Engine Coherence Audit

Check this methodology's core assumptions against the three traditions established in `ENGINE-COHERENCE-AUDIT.md`.

| Dimension | Engine (cultural-science / qualitative) | DSR (Hevner et al. 2004) | Phenomenological / interpretivist | This methodology |
|---|---|---|---|---|
| Ontology | Constructed meaning | Agnostic | Constituted in lived experience | [State position] |
| Epistemology | Positioned interpretation | Utility of artefact | Understanding from within practice | [State position] |
| Validity criterion | *Nachvollziehbarkeit* | Utility | Faithfulness to *Lebenswelt* | [State criterion] |
| Role of analyst | Declared, positioned | Transparent designer | Researcher from within | [State role] |
| Neutrality | Rejected | Not required | Bracketed | [State position] |

**Coherence with engine orientation:** [✅ Coherent | ⚠️ Partial — explain | 🔴 Incoherent — explain]  
**Coherence with DSR:** [✅ Coherent | ⚠️ Partial — explain | 🔴 Incoherent — explain]  
**Coherence with phenomenological grounding:** [✅ Coherent | ⚠️ Partial — explain | 🔴 Incoherent — explain]

---

### 6. Resolution

**Conflicts requiring action:**  
[List any conflicts that require a change to the prompt design, the methodology documentation, or both. If none, state "None."]

**Proposed resolution:**  
[For each conflict: state what change is needed and where (prompt design / documentation / engine schema).]

**Resolution status:**  
[⚠️ In progress | ✅ RESOLVED — no modification required | 🔴 REQUIRES MODIFICATION — see above]

**Notes:**  
[Any additional context, caveats, or links to relevant discussions.]

---

### 7. References

- [Full citation for each source used in this validation entry]
```

---

## Methodology Register

The following 14 methodologies are identified for validation. Update status as each entry is completed.

| ID | Methodology | Status | Issue |
|---|---|---|---|
| M01 | Critical Discourse Analysis (CDA) | ⚠️ In progress | — |
| M02 | [Methodology name] | ⚠️ Pending | — |
| M03 | [Methodology name] | ⚠️ Pending | — |
| M04 | [Methodology name] | ⚠️ Pending | — |
| M05 | [Methodology name] | ⚠️ Pending | — |
| M06 | [Methodology name] | ⚠️ Pending | — |
| M07 | [Methodology name] | ⚠️ Pending | — |
| M08 | [Methodology name] | ⚠️ Pending | — |
| M09 | [Methodology name] | ⚠️ Pending | — |
| M10 | [Methodology name] | ⚠️ Pending | — |
| M11 | [Methodology name] | ⚠️ Pending | — |
| M12 | [Methodology name] | ⚠️ Pending | — |
| M13 | [Methodology name] | ⚠️ Pending | — |
| M14 | [Methodology name] | ⚠️ Pending | — |

---

*Last updated: 2026-04-10*  
*See `docs/ENGINE-COHERENCE-AUDIT.md` for the foundational audit this template depends on.*  
*See `docs/GITHUB_ISSUES_SETUP.md` for GitHub label and issue setup instructions.*
