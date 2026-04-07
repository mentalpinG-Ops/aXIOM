# ANALYTICAL_COMMITMENTS.md — aXIOM

Last updated: 2026-04-05

This document defines the methodological commitments of the aXIOM engine,
with a focus on cultural-science and qualitative analysis.
It is intended to make the engine's outputs reviewable, contestable, and
epistemically explicit.

---

## 1. Epistemic stance (what the engine can and cannot claim)

- The engine produces **structured analytical support**, not truth.
- All interpretive outputs are **proposals** that require human critique.
- The engine must never present interpretations as objective facts.

---

## 2. Core definitions (minimal)

- **Source text / artefact**: the primary material under analysis.
- **Segment**: a minimal addressable unit (paragraph, sentence, turn, shot
  description, etc.) used to anchor evidence.
- **Claim**: a proposition the engine asserts about the source.
- **Evidence**: a cited segment (or set of segments) that supports a claim.
- **Description (extraction layer)**: what can be pointed to directly in the
  material (e.g., lexical choices, explicit statements, recurring motifs).
- **Interpretation (reading layer)**: a meaning-making move that goes beyond
  extraction (e.g., ideology, presupposition, framing, discourse position).
- **Counter-reading**: a plausible alternative interpretation that challenges
  or limits the main reading.

---

## 3. Non-negotiable output rules

1. **No claim without an evidence anchor**
   - Every claim must include at least one referenced segment.
2. **Separation of layers**
   - The output must clearly separate descriptive findings from interpretive
     readings.
3. **Contestability by default**
   - Where reasonable, the engine should surface at least one counter-reading,
     limitation, or alternative explanation.
4. **Uncertainty is explicit**
   - Confidence/uncertainty markers must be shown, not hidden.

---

## 4. Typical failure modes (and how we handle them)
- **Shallow completeness**: output is structurally valid but analytically empty.
  - Mitigation: require evidence anchors + require rationale + prompt for
    interpretive stakes and counter-reading.
- **Hallucination vs. over-interpretation**: two distinct failure modes
  requiring distinct mitigations — conflating them produces incorrect responses.
  - **Hallucination**: the engine asserts something with no basis in the source
    material (fabricated reference, invented segment).
    — Mitigation: evidence anchor enforcement (rule 1).
  - **Over-interpretation**: the engine correctly identifies something present
    in the material but draws a claim that exceeds what the evidence supports
    (e.g. "significant" when the evidence only shows "present").
    — Mitigation: uncertainty markers (rule 4) + counter-reading requirement
    (rule 3).
  - These are structurally different errors: one is a sourcing failure, the
    other is an inferential overreach. Anchoring evidence alone does not
    prevent overreach.
- **Category drift**: categories change meaning across runs/models.
  - Mitigation: categories are defined here and in the engine schema; prompts
    must conform to the definitions.

---

## 5. What "quality" means in this project

A high-quality output is:
- traceable to the source material,
- explicit about interpretive moves,
- readable by a domain expert,
- open to disagreement and revision.
