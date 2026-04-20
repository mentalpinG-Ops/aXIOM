# Prompt Governance — mentalpinG-Ops ↔ aXIOM

## Principle

Prompts are developed and tested in **mentalpinG-Ops**.  
Prompts that reach production-ready status are transferred to **aXIOM**.

mentalpinG-Ops is the workshop. aXIOM is the product.

---

## License

Content in **mentalpinG-Ops** is licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

When a prompt transfers to **aXIOM**, it is released under the project licence:
[AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html).

---

## Pipeline

```
mentalpinG-Ops (develop + test) → production-ready → aXIOM (deploy)
```

---

## DFS Conformance

Every prompt in this library must explicitly declare all eight DFS components:
**L1, L2, L3, D1, D2, D3, Interop, Conflicts.**

Prompts that predate this requirement must be retrofitted before transfer.

See `SCHEMA.md` (mentalpinG-Ops) for the full DFS specification.

---

## Production-Ready Criteria

A prompt is production-ready when ALL of the following are true:

1. **Tested** — used in at least one Discovery Session or 1-to-1 user test
2. **Output confirmed** — findings validated by the user (not just plausible)
3. **Scope-compliant** — fits aXIOM IS definition (interpretive, qualitative, humanistic assessment)
4. **Prompt-stable** — no known classification errors or AI-generic output problems flagged as unresolved
5. **DFS-conformant** — all eight DFS components explicitly declared (see DFS Conformance above)

---

## Transfer Process

1. Mark prompt as `status: production-ready` in mentalpinG-Ops
2. Open transfer entry in `PROMPT_TRANSFER_LOG.md` (mentalpinG-Ops)
3. Commit prompt to aXIOM `/prompts/` with commit message:
   ```
   feat(prompts): transfer [prompt-name] from mentalpinG-Ops
   source: mentalpinG-Ops/prompts/[path]
   validated: [session reference]
   ```
4. Add back-reference in mentalpinG-Ops entry: `transferred: [aXIOM commit hash]`

---

## Status Labels (mentalpinG-Ops)

| Status | Meaning |
|--------|---------|
| `draft` | In development, not yet tested |
| `in-test` | Active in Discovery Sessions |
| `production-ready` | Criteria met, ready for transfer |
| `transferred` | Moved to aXIOM, reference committed |
| `deprecated` | Superseded or removed |

---

## What Does NOT Transfer

- Methodological discussion documents
- Session logs and field notes
- Bibliography and academic roots
- Theoretical frameworks (these inform prompts but are not prompts)

These remain in mentalpinG-Ops permanently.

---

## Material Boundaries — Employer and Client Content

Prompts must not be developed from, or incorporate, confidential content belonging
to an employer or client. This includes internal documents, proprietary datasets,
client communications, or any material covered by a non-disclosure obligation.

If a prompt concept originates from professional work, it must be abstracted to a
level that contains no recoverable confidential information before development begins.

---

## Reference

- This file lives in **both repos** and must be kept in sync.
- aXIOM path: `PROMPT_GOVERNANCE.md`
- mentalpinG-Ops path: `PROMPT_GOVERNANCE.md`
- Schema: `SCHEMA.md` (mentalpinG-Ops)
- Docs workflow: `docs/` (aXIOM)
- Contribution guidelines: `CONTRIBUTING.md` (aXIOM)
- AI assistant context: `CLAUDE.md` (aXIOM)
- Copilot instructions: `.github/copilot-instructions.md` (aXIOM)

*Last updated: 2026-04-20*
