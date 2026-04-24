# aXIOM Methodology

**Version:** 0.1 (Draft)  
**Last updated:** 2026-04-24  
**Status:** Methodological foundation — requires academic validation before publication

---

## Epistemological Position

aXIOM occupies a **hybrid methodological position** combining two research traditions:

### Design Science Research (DSR)

**Core principle:** Knowledge is produced by building artefacts that solve real problems. The artefact itself — not just the description of it — constitutes the scholarly contribution.

**For aXIOM:** The aXIOM Academic Assessor (Module 4) is the research output. Its construction, evaluation, and refinement generate design knowledge about AI-assisted academic assessment.

**Framework:** Hevner et al. (2004) — artefact as contribution, utility as validity criterion

### Phenomenological / Interpretivist Research

**Core principle:** Before designing interventions, understand the practice from within. The *Lebenswelt* (lived experience) of faculty members — how they actually think about and conduct assessment — is the ground truth for design.

**For aXIOM:** The Discovery Phase should not be treated as informal user research — it must be conducted as empirical research with explicit epistemological grounding. The requirement schema should emerge from this work rather than being imposed a priori.

**Tradition:** Husserl (Lebenswelt), Schütz (interpretive sociology), qualitative methods (Flick, Bohnsack)

---

## The Combination: Interpretively Grounded DSR

> **DSR** tells us: building the artefact is the contribution  
> **Phenomenology** tells us: the artefact must be grounded in lived practice

This is not unusual in human-centred computing and participatory design research. It resolves a specific problem for aXIOM: DSR alone cannot justify *why* a schema-based approach is the right intervention. Phenomenological grounding supplies that justification.

---

## Nachvollziehbarkeit as Core Concept

**German term:** *Nachvollziehbarkeit* — auditability, traceability of reasoning  
**English approximation:** Transparent reasoning, intersubjective verifiability

### The Productive Tension

aXIOM uses a **structured, schema-driven** approach (which appears positivist) to support **interpretive, judgement-based** assessment (which is fundamentally anti-positivist).

This is not a contradiction — it is the core contribution. The schema does not replace faculty judgement. It makes judgement **traceable and intersubjectively discussable**.

### Why This Matters

In qualitative and cultural research, *Nachvollziehbarkeit* is a quality criterion — can another researcher follow your reasoning? Can you trace claims back to evidence? aXIOM applies this principle to academic assessment by making the reasoning process explicit and reviewable.

---

## Discovery Phase Methodology

### Current Status: Underdetermined

The pilot discovery sessions are planned but not yet defined as formal research. Three options exist, each with different epistemological commitments:

#### Option A — Informal User Research

Observe and interview faculty pragmatically, report findings descriptively. Low overhead, fast. Cannot claim empirical grounding in a defensible academic sense.

#### Option B — Structured Qualitative Fieldwork

Formal qualitative study with defined protocol:

- *Leitfadeninterview* (semi-structured interviews) with faculty  
- *Gruppendiskussion* (focus group) for collective norm elicitation  
- *Teilnehmende Beobachtung* (participant observation) of assessment situations

Analysis: qualitative content analysis, thematic analysis, or documentary method.

**Result:** Schema is empirically grounded. Discovery phase publishable as standalone study. Requires ethics approval and methodological expertise.

#### Option C — Participatory Design

Faculty as co-designers, not research subjects. Schema emerges from design workshops, card sorting, think-aloud protocols. Aligned with participatory design tradition.

### Decision Status

**Not yet committed.** The choice depends on:

- Publication target venues  
- Available methodological expertise  
- Institutional requirements at pilot sites  
- Timeline constraints

**Immediate requirement:** Before pilot sessions begin, define a protocol with explicit methodological rationale.

---

## Three Underdetermined Questions

Three methodological questions were identified as requiring resolution before academic publication. Current status:

0. **Engine coherence** — ✅ Resolved. The analytical engine’s cultural-studies orientation has been audited for coherence with the interpretively grounded DSR framework (see `docs/ENGINE-COHERENCE-AUDIT.md`).
1. **Epistemological position** — ✅ Resolved. Interpretively grounded DSR (see above).
2. **Discovery Phase status** — ⚠️ Open. Three options exist, not yet chosen (see above).
3. **Validation logic** — ⚠️ Open. How will we know the tool "works"? Not technically — methodologically. What counts as evidence of validity in a PoC framing?

   **Candidate answer (not yet closed):** *Nachvollziehbarkeit* — traceable, intersubjectively verifiable reasoning — is the natural validity criterion for interpretively grounded DSR and is a plausible evaluation target for a PoC.

---

## Relationship to the Analytical Engine

### Components (terminology)

- **Analytical engine**: the existing schema-driven assessment engine (proof-of-concept) whose orientation has been audited for coherence.
- **Artefact Analyser**: the module that applies the schema to a target artefact and produces a traceable assessment.
- **Module 4 — aXIOM Academic Assessor**: the academic-assessment instantiation that inherits the schema and reasoning structure from the Artefact Analyser.

The schema used by the Artefact Analyser (inherited by aXIOM Module 4) already has an implicit *cultural studies* orientation:

- §0 Methodological Declaration — explicit positioning of analytical stance  
- Interpretive/philosophical mode distinction  
- Claim taxonomy recognising non-empirical knowledge types

**Current status:** These are operational but not theoretically articulated for the academic assessment context. The methodological tradition they belong to has not been explicitly named.

**Implication:** The analytical engine is a **proof of concept**, not a validated scientific methodology. This framing absorbs the "scholarly isolation" finding (no comparable tools exist) without over-claiming.

**Alignment requirement:** ✅ RESOLVED. The engine's cultural studies orientation has been audited for coherence with the interpretively grounded DSR framework.

---

## Bibliography

See: `docs/BIBLIOGRAPHY.md` (living document, updated after each brainstorming session)

Key references:

- **DSR:** Hevner et al. (2004)
- **Phenomenology:** Husserl (1936/1970), Schütz (1932/1967)
- **Qualitative methods:** Flick (2014), Bohnsack (2014), Mayring (2015)
- **Participatory design:** Sanders & Stappers (2008)

All entries flagged for verification status. Unverified entries require DOI/library confirmation before use.

---

## Academic Validation Path

**Current status:** This methodology is a working hypothesis, not a validated framework.

**Validation required before:**

- Formal academic publication  
- Grant applications  
- Institutional legitimisation

**Validation method:** Stress-test with domain expert in cultural studies methods or design science research (academic contact).  
Target: epistemological coherence, publication venue fit, institutional reception.

### Three-Stage Validation Sequence

The academic validation process is structured in three sequential stages. Each stage is a prerequisite for the next.

**Stage 1 — Engine coherence audit** ✅ COMPLETE  
Does the engine's cultural-science and qualitative orientation align with the interpretively grounded DSR framework and phenomenological grounding?  
→ Deliverable: `docs/ENGINE-COHERENCE-AUDIT.md`  
→ Finding: The three traditions are coherent and complementary. No architectural modification required.

**Stage 2 — Methodology validation framework** ⚠️ NEXT  
Can each of the 14 methodological frameworks (M01–M14) cohere with both the engine AND the epistemological position?  
→ Deliverable: Completed entries in `docs/METHODOLOGY-VALIDATION-ISSUE-TEMPLATE.md` and linked GitHub issues (one per methodology)  
→ Process: Specification-Assumption Coherence Audit (SACA) — see issue template for protocol

**Stage 3 — Conflict matrix for M01–M14** ⚠️ PENDING  
Document conflicts found in each methodology's assumptions vs. the prompt-design specification.  
→ Deliverable: Conflict matrix summarising all 14 methodology checks, resolutions, and outstanding modifications  
→ Prerequisite: All 14 Stage 2 entries complete

---

**Notes:**

- This document is a living artefact — expect updates as pilot sessions proceed
- Methodological decisions should be documented in session log
- Academic contact at a partner university identified as potential validator for philosophical/cultural studies framing
