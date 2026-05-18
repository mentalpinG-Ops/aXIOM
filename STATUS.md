# Status

**As of 2026-05-18.**

## Current scope

aXIOM has two tracks. As of 2026-05-18 they are formally decoupled.

- **aXIOM-as-Project (active):** epistemic/creative undertaking +
  DFS (Declarative Frame Schema) as load-bearing methodological IP.
- **aXIOM-as-Product (deferred):** software platform (Module 4
  Academic Assessor, legacy Artefact Analyser v1.0) and the
  institutional pilot stack.

## Active track

- DFS methodology development.
- Conceptual and theoretical work (see `docs/METHODOLOGY.md`,
  `docs/ANALYTICAL_COMMITMENTS.md`).
- Prompt artefacts in `prompts/` (frozen at current state; further
  prompt evolution happens upstream — see `PROMPT_GOVERNANCE.md`
  header note).

## Deferred track

- Phase-1 backend (Python + FastAPI + PostgreSQL).
- Module 4 onboarding wizard in `axiom/`.
- Artefact Analyser v1.0 PoC in `legacy/`.
- Institutional pilot at the two Polish HEIs (deferred 2026-05-12,
  full track deferred 2026-05-18).
- Security findings in `SECURITY_AUDIT.md` (accepted-not-remediated
  while the track is deferred).

## Reactivation conditions

The deferred track resumes if **either** of the following holds:

- (a) DFS-track-internal deployment need emerges.
- (b) External stakeholder request makes pilot/tool deployment
  load-bearing again.

No timeline. No commitment.

## Notes on unamended files

`FEEDBACK.md` (external feedback intake) and `THEMENLOG.md`
(append-only log) are left without status header notes by design.
Adding a retroactive note to an intake log would signal "ignored";
adding one to an append-only log would break its convention. Future
entries in either file may reference this scope-cut.

## Pointers

- `HISTORY.md` — conceptual evolution timeline.
- `CHANGELOG.md` — versioned changes.
- `SECURITY_AUDIT.md` — outstanding findings (deferred).
