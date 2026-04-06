# Core Prompt v1.0 — Section Description

Reference document for `CORE_PROMPT_v1_0.md`.
Describes what each section of the analytical schema does, in plain language.

---

## How the prompt works overall

The prompt instructs an AI to take any source material — a news article, a philosophical text, a propaganda poster, a dataset, a transcript — and produce a structured analytical record. The output is not a summary. It is a decomposition of the artefact into claims, inferences, evaluations, and metadata, formatted for import into Zotero (a reference management tool).

The prompt's central design principle is **mode-conditional field activation**: depending on which analytical mode the analyst declares at the start (fact-critical, interpretive, or philosophical), certain fields activate, suppress, or change their meaning. This prevents structurally valid but analytically wrong output — for example, assessing a poem for "misinformation risk."

Every section generates **tags** using a `prefix:value` format. These tags accumulate across sections and are collected in §7 for Zotero import. They function as a searchable analytical vocabulary.

---

## Header block

**What it does:** Injects pre-computed metadata into the prompt before the AI sees it.

Four placeholder variables are filled in by the application before the prompt reaches the AI:

| Variable | Source | Purpose |
|---|---|---|
| `{{ARTEFACT_ID}}` | SHA-256 hash of source type + date + content (first 8 hex chars) | Content-addressable unique identifier |
| `{{GENERATED_AT}}` | UTC timestamp at prompt assembly | Audit trail |
| `{{ZOTERO_ITEM_TYPE}}` | Mapped from user's source type selection | Zotero compatibility |
| `{{TYPE_TAG}}` | Same mapping, tag format | Tagging |

The AI is instructed to use these values verbatim — it must not generate, modify, or reinterpret them.

---

## §0 — Methodological Declaration

**What it does:** Forces the analyst (human or AI) to declare their analytical stance before any analysis begins.

**Why it exists:** There is no neutral analysis. Every analytical act operates from a framework and a mode. §0 makes this explicit so that downstream fields can adapt accordingly.

**Fields:**

- **analytical_framework** — The interpretive lens being applied (e.g. discourse analysis, semiotics, source criticism). The prompt explicitly prohibits defaulting to "neutral."
- **analytical_mode** — The epistemological register. This is the prompt's central switch:
  - *fact-critical* — Is this accurate? Activates misinformation assessment, corroboration checks.
  - *interpretive* — What does this mean and do? Replaces accuracy checks with epistemic effect analysis.
  - *philosophical* — Is this coherent and what does it presuppose? Activates conceptual claim types and makes assumption stress-testing the primary operation.
  - *mixed* — Two or more modes apply to different parts of the artefact.
- **analyst_type** and **analyst_id** — Who is performing the analysis (human, AI, or both), with identification.
- **known_analyst_limitations** — Standing constraints of the analyst as an epistemic agent (e.g. language gaps, domain knowledge limits, cultural distance). These are general, not artefact-specific — artefact-specific consequences go in §5.

---

## §1 — Metadata

**What it does:** Records bibliographic and contextual information about the artefact.

**Fields include:** title, date, origin, language, related entities (persons, organizations, events, locations).

**Two fields deserve special attention:**

- **circulation_context** — How and where the artefact was originally distributed. Production-side only. Covers channels, intended audience at point of release.
- **reception_context** — What happened after distribution. Three dimensions:
  - *reception_history* — How was it received initially, and has that changed over time?
  - *instrumentalization* — Has it been repurposed by actors other than the original producers?
  - *canonical_status* — Has it become canonical, marginal, suppressed, or contested within a field?

The prompt treats absence of reception data as analytically meaningful — it must be stated, not left blank.

---

## §2 — Artefact Characterization

**What it does:** Describes what the artefact is and how it works, before any claim extraction begins.

**Key fields:**

- **genre** — What kind of thing is this (news report, propaganda, op-ed, policy document, etc.)?
- **modality_structure** — Is the artefact unimodal (text only) or multimodal (text + image, audio + visual, etc.)? If multimodal, each modality gets an ID (M1, M2…) used later in §3 to trace which claims come from which modality. The prompt also asks how the modalities relate to each other (reinforcing, contradicting, ironic, etc.).
- **primary_illocutionary_function** — What is this artefact trying to do? Assert, persuade, instruct, classify, commemorate, conceal, mobilize.
- **implied_audience** — Three sub-fields: who the artefact constructs as its reader, what competencies it presupposes, and who it implicitly excludes.
- **production_context** — What institutional, material, and ideological conditions shaped this artefact at the moment of creation.
- **notable_absences** — What is conspicuously not said or shown. Each absence gets an ID (NA1, NA2…) and is flagged as load-bearing or not. Load-bearing absences are forwarded to §3 for claim extraction as rhetorical omissions.
- **intertextuality** — How the artefact positions itself relative to other texts, traditions, or discourses. Eight relation types are defined, from explicit citation to silent presupposition to occlusion. Relations that require inference are logged here but developed in §4.

---

## §3 — Claim Extraction

**What it does:** Decomposes the artefact into individual, atomic claims.

Each claim is extracted as something the artefact asserts — not something the analyst believes to be true. The prompt enforces a strict separation between artefact content and analyst interpretation.

**For each claim, the prompt requires:**

- **claim_id** — Sequential (C1, C2…).
- **claim_text** — The claim in standardized English.
- **claim_type** — Classified into five families:
  - *Descriptive* — Factual, biographical, institutional, statistical, causal.
  - *Normative* — Evaluative, prescriptive, classificatory.
  - *Rhetorical* — Framing, analogy, appeal, omission (only if flagged as load-bearing in §2).
  - *Categorical/Administrative* — Legal, bureaucratic, taxonomic, loaded terms.
  - *Conceptual* — Definitions, distinctions, propositions, frameworks. These are assessed for coherence, not factual accuracy. Primary category in philosophical mode.
- **surface_form** — How the claim manifests: explicit statement, implication, visual, numerical, omission, juxtaposition, or various cross-modal forms (reinforcement, contradiction, displacement, irony).
- **modality_source** — For multimodal artefacts: which modality (M-id) the claim comes from, or "cross-modal" if it arises from the relation between modalities.
- **confidence_in_extraction** — High, medium, or low, with mandatory one-sentence justification.
- **verifiability** — Whether the claim is empirically checkable, historically checkable, structurally assessable, not verifiable, or in a contested domain.

---

## §4 — Derived Claims (Inferences)

**What it does:** Records what the analyst infers from the extracted claims. These are the analyst's own analytical moves, clearly separated from what the artefact itself says.

**Inference types include:** causal, intentional, structural, contextual, evaluative, network, historical, and **abductive** — inference to the best explanation. Abductive inference is the primary operative type in interpretive and philosophical modes and has four mandatory subfields: what is being observed, the proposed hypothesis, at least one competing hypothesis (mandatory, not optional), and the explanatory warrant.

**alternative_interpretations** — Addresses the artefact as a whole: what would a reader from a different framework make of it? This is a hermeneutic question about interpretive plurality.

### §4A — Argument Validity Stress-Test

**What it does:** Applies formal logic and argumentation analysis to artefacts that make or imply arguments.

Five sub-sections:

1. **4A-1 Argument Reconstruction** — Extracts the argument(s) in standard form (premises → conclusion). Implicit premises are flagged.
2. **4A-2 Premise–Conclusion Validity** — Does the conclusion follow from the premises (logical form)? Are the premises themselves well-supported (soundness)?
3. **4A-3 Formal Fallacy Detection** — Checks for structural invalidity (affirming the consequent, circular reasoning, etc.).
4. **4A-4 Informal Fallacy Detection** — Identifies discrete, locatable manipulative moves (straw man, ad hominem, false dilemma, etc.). Each must be pinpointed to a specific claim or argument. Systemic patterns are noted but developed in §5 instead.
5. **4A-5 Assumption Stress-Test** — Identifies assumptions the argument depends on but does not defend. For each: is it load-bearing? What happens to the conclusion if the assumption is denied?

If the artefact has no argumentative structure, §4A is skipped with an explicit statement.

---

## §5 — Epistemic Status Assessment

**What it does:** Evaluates the artefact's overall epistemic quality. This is where the mode-conditional logic is most visible.

**Fields:**

- **artefact_integrity** — Is it authentic, correctly attributed, unaltered? Universal across all modes.
- **informant_reliability** — Mode-conditional:
  - *fact-critical*: Does this source accurately report external states of affairs?
  - *interpretive/philosophical*: Field is suppressed — not the right question for these artefact types.
- **internal_consistency** — Is the artefact consistent with itself? The meaning of "consistency" shifts by mode: factual contradiction (fact-critical), modal tension (interpretive), or conceptual incoherence (philosophical).
- **corroboration_status / interpretive_grounding** — Mode-conditional:
  - *fact-critical*: Were claims checked against independent sources? What did that find?
  - *interpretive/philosophical*: Is the interpretation adequately grounded textually and positioned relative to existing scholarship?
- **bias_indicators** — Systemic patterns across the whole artefact (selection bias, framing bias, omission, false equivalence, loaded language, institutional interest). Cross-references individual fallacies from §4A where applicable.
- **misinformation_risk / epistemic_effect** — Mode-conditional:
  - *fact-critical*: Is this artefact likely to produce false beliefs?
  - *interpretive/philosophical*: What does this artefact do to the epistemic field? Two dimensions: closure (does it foreclose or open inquiry?) and power (does it naturalise, contest, or ignore power relations?).
- **limitations_of_this_analysis** — What this specific analysis could not do. Cross-references analyst limitations from §0 but states the concrete consequence for this particular analysis.

---

## §6 — Normalization Notes

**What it does:** Standardizes dates, locations, loaded terms, and units across the analysis.

Short section. Dates go to ISO 8601, locations use contemporary names with historical names in brackets, loaded terms are preserved verbatim but flagged, units are converted to contemporary equivalents with originals in brackets.

---

## §7 — Zotero Mapping

**What it does:** Collects all tags generated across §§0–6 into a single deduplicated list and maps the artefact to Zotero fields.

This section enforces **mutual exclusivity rules** for mode-conditional tag pairs: for example, `corroboration:` tags fire only in fact-critical mode, while `grounding:textual:` and `grounding:scholarly:` tags fire only in interpretive/philosophical modes. In mixed mode, both sides can fire but must be scoped to their respective sections.

The section also maps standard Zotero fields: Item Type, Title, Author/Creator, Date, Archive/Source/URL, Language, Tags, and Extra (which carries the source_id, analyst_id, analysis_date, loaded terms, and version numbers).

---

## §8 — ID Strategy

**What it does:** Documents how the artefact ID was used.

Administrative section. Confirms the pre-computed ID was used verbatim, explains the source type prefix rationale, and flags any ambiguities in ID components.

---

## §9 — Analytical Summary

**What it does:** Produces a 150-word plain-language summary of the entire analysis.

This is the human-readable entry point for the dataset record. It must stand alone — no schema terminology, no tag syntax, no bullet points, no references to numbered sections.

**Requirements vary by mode:**
- *fact-critical*: State misinformation risk level and the single strongest reason.
- *interpretive*: State epistemic effect (closure + power) and significance.
- *philosophical*: State argument validity and the most consequential assumption stress-test finding.

---

## CONSTRAINTS block

**What it does:** Sets global rules that apply across all sections.

Six constraints: do not speculate beyond evidence; do not reproduce harmful content outside analytically necessary quotation; separate artefact content from analyst interpretation; preserve genuine ambiguity; identify intertextual relations; tags must reflect what was actually found, not what was expected.

---

## INPUT ARTEFACT

**What it does:** Marks the injection point for the actual artefact content.

The `{{ARTEFACT_CONTENT}}` placeholder is replaced with whatever the user pasted, uploaded, or fetched. Everything above this point is instruction; everything below is the material to be analysed.
