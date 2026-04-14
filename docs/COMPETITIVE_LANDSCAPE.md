aXIOM Competitive Landscape

**Version:** 0.1 
**Last updated:** 2026-04-14  
**Maintained by:** X1

---

## Summary Finding

The specific niche of aXIOM — AI-assisted interpretive judgment support for humanities
assessment, schema-driven, with traceability (Nachvollziehbarkeit) as the core design
principle — is unoccupied. The market splits into two groups that both miss this niche:
automated graders (replace teacher judgment) and research/analysis tools (no assessment
context). No existing product implements structured support for the teacher's interpretive
reasoning in specialist humanities programmes.

---

## Cluster 1 — Direct Competitors (same market, different philosophy)

### Rubric AI (`rubricai.app`)
- IB-specific (TOK, Extended Essay); fully automated essay grading
- Claims 95%+ alignment with human graders; teacher reviews output
- **Distance from aXIOM:** Maximum counterposition — replaces teacher judgment,
  no interpretive schema, no traceability, no humanities epistemics

### CoGrader (`cograder.com`)
- Rubric-based grading platform for written assignments; AI suggests, teacher finalises
- Multilingual; writing mechanics focus
- **Distance from aXIOM:** Same gesture (teacher retains control), but: generic rubrics,
  no interpretive context, no humanities-specific design, no semester-level aggregation

### RubiSCoT (arxiv.org, 2025)
- DSR-grounded framework for AI-assisted thesis assessment; chain-of-thought prompting
  with rubric-based scoring; piloted with institutional stakeholders
- Research framework only — no running product
- **Distance from aXIOM:** Cross-disciplinary (not humanities-specific); no semester
  tracking; no traceability architecture; no product

---

## Cluster 2 — Analysis Tools (not assessment)

### Discourse Analyzer (`discourseanalyzer.com`)
- SaaS covering CDA, SFL, visual semiotics, multimodality
- Target: researchers and academics, not faculty assessing student work
- **Distance from aXIOM:** Research tool; no pedagogical use case; no schema

### DATS — Discourse Analysis Tool Suite (University of Hamburg, open source)
- AI-powered multi-modal platform; text, image, audio, video; qualitative + quantitative
- Target: qualitative researchers in Digital Humanities
- **Distance from aXIOM:** Research infrastructure; no assessment context; no schema;
  significant institutional setup required

### Semiotic Engine (`yeschat.ai`)
- GPT wrapper with Peirce/Saussure framing; freeform semiotic analysis
- **Distance from aXIOM:** No schema, no pedagogical context, no traceability;
  functions as epistemological counterpoint to aXIOM's approach
  (see also: space-bacon/Semiotic-Analysis-Tool in THEMENLOG.md)

---

## Cluster 3 — Academic Discourse (no product; positioning references)

These publications name the problem aXIOM addresses and are directly usable in grant
applications and methodological framing:

**Boud et al. (2025)** — *"The wicked problem of AI and assessment"*, Assessment &
Evaluation in Higher Education
> Argues that institutions need structures supporting educator professional judgment
> rather than uniform AI policies. Positions teacher judgment as irreplaceable —
> precisely what aXIOM is designed to support.

**PMC study on AI-augmented reflexive thematic analysis (2024)**
> Establishes that AI's value in qualitative methodology lies in supporting deeper
> interpretive analysis, not in objectification. Without this capacity, AI has no role
> in reflexive qualitative work.

---

## Strategic Implications

| Dimension | Market | aXIOM |
|---|---|---|
| Teacher judgment | Replaced or marginalised | Supported and made traceable |
| Schema | Generic or absent | Discipline-specific, claim-anchored |
| Context | Writing mechanics / STEM / IB | Humanities interpretation |
| Aggregation | Per-assignment | Semester-level (planned) |
| Geography | Anglophone / global | CEE / Polish-German UTF-8 native |

**Grant use:** Cluster 3 publications establish the research problem;
aXIOM is the only tool-level answer currently in development.

**Pilot documentation** (Discovery Session 001 and 1:1 onboarding records) serves as
proof of institutional testing in the absence of commercial comparators.
```

---

**Commit-Nachricht:** `docs: add COMPETITIVE_LANDSCAPE.md — open-access market scan 2026-04`

**Wo:** Repo-Root, neue Datei. GitHub Browser → *Add file* → *Create new file*.