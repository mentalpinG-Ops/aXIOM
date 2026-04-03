# COMMS.md
## aXIOM — Communication Strategy

This document captures communication strategy decisions for the aXIOM project.
It is fed by `FEEDBACK.md` (communication-track items) and informs how the project
is presented to non-technical audiences including pilot institution faculty,
department heads, and institutional stakeholders.

---

## Core Communication Challenge

Existing repository documents (README, ARCHITECTURE.md) are written for a technical
collaborator or future developer. They do not explain the tool to non-technical audiences.
A stakeholder-facing explainer is needed as a distinct document.

---

## Core Positioning Principle

aXIOM manages analytical overhead in the analysis phase of the academic
work cycle — it does not replace human synthesis. The teacher reads,
challenges, and decides. The tool carries the paperwork load.

This principle must be stated explicitly in every stakeholder-facing
communication. It is the primary defence against all three known
misreadings below.

---

## Known Misreadings to Address

When presenting aXIOM to academic stakeholders, three default mental models interfere
with accurate understanding. These must be addressed proactively — ideally before
the tool is described positively.

### aXIOM is not a fact-checker
People's default mental model for "AI + academic text" is verification: checking whether
claims in a student's work are true. aXIOM does not do this. It evaluates the quality
and completeness of student work against assessment criteria — a fundamentally different
operation.

### aXIOM is not a plagiarism detector
In Polish academic institutions, the dominant reference point for software that analyses
student work is Antiplagiat. aXIOM is not in this category. Antiplagiat asks: *"Is this
work original?"* aXIOM asks: *"How well does this work meet the assessment criteria?"*
Different question, different input, different output, different role for the teacher.

### aXIOM does not automate the teacher's job
The tool does not produce grades or decisions. It produces structured analytical support
that the teacher evaluates, interprets, and acts on. The teacher remains the decision-maker
at every step. The tool's purpose is to reduce the cognitive overhead of systematic
criteria-checking, not to replace professional judgment.

---

## Anticipated Objections

### "AI causes people to unlearn thinking"
This objection will surface in presentations, particularly at institutions where critical
judgment is central to professional identity (e.g. art academies). It reflects a
legitimate concern about AI dependency and deskilling.

**How to respond:** aXIOM is designed with this concern in mind. The tool does not
produce conclusions — it produces structured prompts for teacher reflection. The teacher
must still read the work, apply judgment, and make the assessment decision. The tool
systematises the checklist; it does not replace the thinking. Acknowledge the concern as
valid in general, then show how the design addresses it specifically.

---

## Proof of Concept Framing

The current analytical engine — and the single-file HTML tool it derives from — should
be presented explicitly as a **proof of concept**, not a fully developed scientific
methodology.

**Why this framing is correct:**
- The underlying analytical methods (discourse analysis, narrative analysis, logical
  analysis, semiotic analysis) are implemented via AI prompting, not via validated
  scholarly methodology. There is a genuine risk that the tool simulates a scientific
  approach rather than constituting one.
- No engagement with existing literature on automated assessment, AI in education,
  or rubric validity has been undertaken at this stage.
- The tool has not been validated through peer review or empirical study.

**Why this framing is strategically sound:**
- A proof of concept is not attacked for lacking peer-reviewed foundations — it is
  evaluated on whether it demonstrates a viable direction.
- It sets honest expectations with pilot institutions.
- It opens rather than closes the conversation about validity and rigour.
- It creates a clear and credible narrative arc: PoC → pilot evidence → grounded
  methodology.

**Long-term legitimisation path (horizon item):**
Formal academic grounding through study in a relevant discipline (e.g. Cultural Science)
would provide the scholarly standing to properly ground the analytical framework.
This is a long-term consideration, not a current commitment.

---

## Documents Needed

| Document | Audience | Purpose | Status |
|----------|----------|---------|--------|
| Stakeholder explainer | Faculty, department heads | What aXIOM is and is not — non-technical | Not yet created |
| Pilot one-pager | Pilot institution contacts | Project overview for in-person meetings | Not yet created |

---

*Last updated: 2026-04-03*
*Fed by: FEEDBACK.md items FB-001, FB-002, FB-003*
