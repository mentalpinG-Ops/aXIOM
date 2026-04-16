# Prompt Governance — mentalpinG-Ops ↔ aXIOM

## Principle

Prompts are developed and tested in **mentalpinG-Ops**.  
Prompts that reach production-ready status are transferred to **aXIOM**.

mentalpinG-Ops is the workshop. aXIOM is the product.

---

## Pipeline

```
mentalpinG-Ops (develop + test) → production-ready → aXIOM (deploy)
```

---

## Production-Ready Criteria

A prompt is production-ready when ALL of the following are true:

1. **Tested** — used in at least one Discovery Session or 1-to-1 user test
2. **Output confirmed** — findings validated by the user (not just plausible)
3. **Scope-compliant** — fits aXIOM IS definition (interpretive, qualitative, humanistic assessment)
4. **Prompt-stable** — no known classification errors or AI-generic output problems flagged as unresolved

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

## Reference

- This file lives in **both repos** and must be kept in sync.
- aXIOM path: `PROMPT_GOVERNANCE.md`
- mentalpinG-Ops path: `PROMPT_GOVERNANCE.md`

*Last updated: 2026-04-17*
