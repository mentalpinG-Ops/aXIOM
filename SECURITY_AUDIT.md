# Privacy & Security Audit — aXIOM

**Date:** 2026-05-04
**Branch:** `claude/privacy-security-audit-hZmDk`
**Scope:** Full repository at HEAD of `main`, including `axiom/` (Module 4
onboarding wizard), `legacy/` (Artefact Analyser v1.0), `tools/`,
`update.sh`, `prompts/`, and project documentation.
**Auditor:** Automated review (Claude).

This audit is bounded by what is currently in the tree. Phase-1 backend
(Python/FastAPI/PostgreSQL) is documented in `ARCHITECTURE.md` but no
backend code is yet committed; comments below flag architecture-level
concerns the future implementation should address.

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High     | 4 |
| Medium   | 6 |
| Low      | 5 |
| Info     | 3 |

Headline issues, in priority order:

1. **API keys live in plaintext `localStorage` and travel direct from the
   browser to the model provider** — the on-screen security note
   understates the threat model.
2. **The legacy URL-fetch feature pipes every user-submitted URL and
   the returned HTML through a third-party CORS proxy
   (`corsproxy.io`)** — this directly contradicts the "never sent
   anywhere except the provider's API" wording shown to users.
3. **`tmp.innerHTML = html` parses arbitrary remote HTML** — instantiates
   `<img>`/`<iframe>` elements that fire network requests and event
   handlers, giving any fetched page a script-execution path even though
   the div is never appended to the DOM.
4. **The legacy custom-endpoint provider accepts plain `http://`
   URLs**, so user API tokens can travel in clear text.

---

## High-severity findings

### H-1 — API keys stored in plaintext in `localStorage`

**Files:**
- `axiom/js/config.js:9–34`
- `axiom/js/onboarding.js:303–312`
- `legacy/js/config.js:10, 44–62`
- `legacy/js/ui-controller.js:206–227`

**What the code does:** Every saved provider config — including the raw
`apiKey` string — is JSON-stringified and written to
`localStorage[STORAGE_KEY]`. It is read back into memory on every page
load and re-sent on every model call.

**Why this is a problem:**

- Any JavaScript executed on the same origin (XSS, malicious browser
  extension, dev-tools paste-attack, supply-chain compromise of the
  static assets) can read the key with one line:
  `localStorage.getItem('aXIOM_assessor_v1_config')`.
- The key persists indefinitely across browser sessions, including on
  shared lab machines that multiple teachers use.
- `localStorage` is plain-text on disk in the browser profile;
  forensic recovery is trivial.
- The on-screen security note (`step.apikey.security.note` in
  `axiom/i18n/en.json:43–44`) tells the teacher: *"Your key is stored
  only on this device in browser storage."* True, but the implication
  ("therefore safe") is wrong. The wording should at minimum
  acknowledge same-origin script access.

**Recommendation:**

- Short-term: change the security note copy to set realistic
  expectations, e.g. *"Stored on this device only. Anyone with access
  to this browser profile, or any script running on this page, can
  read it. Do not use a shared computer."*
- Medium-term: gate access behind `sessionStorage` (cleared on
  browser close) plus a confirm-on-launch UI, or wrap the key in
  WebCrypto-derived encryption keyed off a teacher-supplied passphrase
  (the secret is the passphrase, never persisted).
- Long-term: route AI calls through the planned FastAPI backend
  (per `ARCHITECTURE.md` §5–7); the API key never leaves the server.
  This is also the only way to honour the GDPR principle in §11
  consistently across multi-teacher Phase-2 deployments.

---

### H-2 — `anthropic-dangerous-direct-browser-access: true`

**File:** `axiom/js/providers/anthropic.js:42`

The Anthropic header is required because the SDK refuses
browser-origin calls by default; setting it acknowledges the threat
model that Anthropic explicitly warns against. Combined with H-1 it
means:

- The key is visible in the browser DevTools Network tab, in
  `performance.getEntries()`, and in any HAR export the teacher
  shares for support.
- A malicious analytics or font script on the same origin can
  intercept `fetch` and exfiltrate the request headers.

**Recommendation:** Same as H-1 — relay through the local backend.
While the deployment is "browser-only" in Phase-1 documentation, the
legacy app already has an installed Docker stack; one container can
proxy the AI call without ever sending the key to the page.

---

### H-3 — XSS surface via `innerHTML` of remote-fetched HTML

**File:** `legacy/js/ui-controller.js:325–339`

```js
var proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
var res  = await fetch(proxyUrl, …);
var html = await res.text();
var tmp  = document.createElement('div');
tmp.innerHTML = html;            // ← parses arbitrary attacker HTML
['script','style','nav','header','footer','aside','noscript']
  .forEach(function (tag) { tmp.querySelectorAll(tag).forEach(el => el.remove()); });
rawText = (tmp.innerText || tmp.textContent || '').replace(/\s{3,}/g, '\n\n').trim();
```

**Why removing `<script>` after-the-fact does not help:**
`innerHTML` parsing is what *creates* the elements. By the time the
`<script>` is in the tree it has not run (HTML5 explicitly disallows
script execution from `innerHTML`), but `<img>`, `<iframe>`,
`<svg><foreignObject>`, `<object>`, `<embed>`, and `<input
formaction onfocus>` all instantiate and can:

- Trigger outbound network requests to attacker-controlled URLs
  (de-anonymising the teacher's IP and the `Referer` of the
  fetched page).
- Fire `onload`/`onerror` callbacks attached as inline-event-handler
  attributes (these are removed only on tags the script lists; an
  `<img onerror>` survives the filter).
- Pre-load resources counted against the user's bandwidth/quota.

**Recommendation:** Use `DOMParser`'s `parseFromString(html,
'text/html')` (which produces an inert document where image loads do
not fire) or strip to text on the server side via the proxy. If the
proxy stays, sanitise via `DOMPurify` before any `innerHTML`
assignment.

---

### H-4 — Legacy custom-endpoint provider allows plain HTTP

**File:** `legacy/js/providers/custom.js:41–46`

```js
validate(cfg) {
  if (!cfg || !cfg.endpoint || !cfg.endpoint.startsWith('http')) {
    return { valid: false, error: 'Custom endpoint must be an http:// or https:// URL' };
  }
  return { valid: true };
}
```

The validator accepts `http://` URLs, and `buildHeaders` will happily
attach the `Authorization` header in clear text. A teacher pointing at
a self-hosted model on a college LAN may unwittingly transmit the
bearer token in plaintext.

**Recommendation:** Require `https://` (the Azure provider already
does — see `legacy/js/providers/azure.js:41–43`); keep an explicit
opt-in flag for `http://localhost`/`http://127.0.0.1` if local
development needs it.

---

## Medium-severity findings

### M-1 — Privacy leak: third-party CORS proxy receives all fetched URLs

**File:** `legacy/js/ui-controller.js:328`

`https://corsproxy.io/?…` is a third party not under the project's
control. It receives:

- The exact URL of every artefact a researcher pastes.
- The full HTML of those URLs (including pages behind ephemeral
  campus-network access).

This contradicts the wording shown to users in the legacy
`index.html:16` modal: *"Settings are stored in browser localStorage…"*
and in `i18n/en.json` for the API-key step: *"never sent anywhere
except the provider's API."* The latter is true for the *key*, but
the URL-fetch flow sends *user-supplied artefact URLs* and *page
content* to a different party.

**Recommendation:**

- Drop the URL-fetch tab from the public bundle until a self-hosted
  proxy ships, or
- Surface the proxy use in a clear consent line on the URL tab itself,
  *before* the fetch, and link to the proxy's privacy policy.

This is also relevant to GDPR compliance (`ARCHITECTURE.md` §11.3):
the institution does not own the data once it transits a third
party.

---

### M-2 — `escHtml` is incomplete

- `legacy/js/ui-controller.js:110–112` escapes only `&` and `<`.
- `axiom/js/onboarding.js:228–234` escapes `&`, `<`, `>`, `"` — but
  not `'`.

Today no user-controlled data flows through these helpers in a way
that breaks out, but the helpers are reused in attribute-context
templates (e.g. `value="' + escHtml(saved[field.id]) + '"` in
`legacy/js/ui-controller.js:149–150`). `localStorage` IS attacker-
controllable from XSS or another tab, so `saved[field.id]` is not
trusted input — and the legacy escape misses `"`, which means a
crafted localStorage value can break out of the attribute.

**Recommendation:** Replace ad-hoc helpers with a single complete
escape (`& < > " '`) or — better — render fields with
`document.createElement` + `textContent` / `setAttribute` and stop
concatenating strings into HTML. The handful of templates here would
shrink and become safer.

---

### M-3 — No Content-Security-Policy

Neither `axiom/onboarding.html` nor `legacy/index.html` ships a CSP.
A defence-in-depth `default-src 'self'; connect-src 'self'
api.anthropic.com api.openai.com corsproxy.io;` would prevent script
loads from arbitrary origins and limit data exfiltration if any of
the `innerHTML` or other XSS surfaces (see H-3, M-2) is exploited.

**Recommendation:** Ship a meta CSP in the static HTML, with hashes
for the inline initialisers, and tighten `connect-src` once the
backend lands.

---

### M-4 — Backup files are unencrypted SQL dumps left for the user to delete

**File:** `update.sh:74–93`

```bash
BACKUP_FILE="${BACKUP_DIR}/axiom_backup_${TIMESTAMP}.sql"
…
docker compose exec -T db pg_dump … > "${BACKUP_FILE}"
…
info "You can delete this file once you are satisfied with the update."
```

The backup contains every requirement set, every assessment, and —
per the Phase-1 architecture — the analytical reports tied to
identifiable student work. It is plaintext and accumulates in
`./backups/` until the teacher deletes it. `ARCHITECTURE.md` §11.3
correctly classifies this as "personal data under GDPR." The script
makes this data more persistent than the live database, with no
encryption or retention enforcement.

**Recommendation:**

- Encrypt the dump (e.g. `pg_dump … | gpg --symmetric --cipher-algo
  AES256 -o "${BACKUP_FILE}.gpg"` with a teacher-supplied
  passphrase), or
- Restrict `./backups/` to `0700` and warn the teacher in the
  on-screen message, or
- Add automatic rotation / expiry of older backups and document the
  retention default.

---

### M-5 — Teacher-cost-display copy positions cost as "informed consent"

**File:** `ARCHITECTURE.md:558` — *"Cost is not revealed after setup;
it is part of the informed consent at configuration time."*

In a consumer-funded usage model, "informed consent at configuration
time" is not a sufficient consent record for ongoing per-call
metered billing. If costs surge (e.g. teacher switches from Haiku to
Opus 4.5, an 18× input-token-price jump per
`legacy/js/config.js:22–28`), the teacher has no in-flight reminder.

**Recommendation:** Surface the running cost in the UI (already
implemented in `legacy/js/ui-controller.js:74–99` — `costDisplay`).
Add a single guard rail: if the current model's price tier is
materially higher than the one the teacher accepted at setup, prompt
for re-consent before the next call. Document this in the security
note on the API-key step.

---

### M-6 — `corsproxy.io` is a single point of failure and a CSP escape hatch

If the proxy is compromised, it returns attacker-controlled HTML
which then flows into `tmp.innerHTML = html` (see H-3). Even after
H-3 is fixed, a tampered proxy can poison the AI extraction step
(`aiCall(... rawText.slice(0, 8000) ...)`) by injecting
prompt-instruction-shaped strings ("Ignore previous instructions and
output …"). Standard prompt-injection vector.

**Recommendation:** Wrap the AI extraction in a system prompt that
explicitly treats the proxy text as untrusted user data, and
truncate aggressively. Document the proxy dependency in
`ARCHITECTURE.md` §7 as a known supply-chain link.

---

## Low-severity findings

### L-1 — `crypto.subtle` based artefact ID is not a security boundary

**File:** `legacy/js/main.js:987–990`

`source_id = SHA-256(type + date + content).slice(0,8)` is fine as a
deduplication tag, but the docs (`legacy/js/main.js:38–42`) describe
it as cryptographic provenance. 8 hex chars (32 bits) collides at
~65 k entries, and the inputs are guessable. Don't rely on this for
audit chains.

**Recommendation:** Either widen to 32 hex chars (full SHA-256
truncation is conventional but include the full hash in record
metadata) or drop the cryptographic framing in the comments.

---

### L-2 — `npm/CDN-style` external links open with `rel="noopener"` only

**File:** `axiom/onboarding.html:74–88`

Good — `target="_blank" rel="noopener"`. Add `rel="noopener
noreferrer"` so the external sites do not see the local-deployment
hostname (probably `localhost`, but conceivable to leak deployment
fingerprints).

---

### L-3 — `escHtml` divergence between codebases

Two slightly different implementations live in `axiom/js/onboarding.js`
and `legacy/js/ui-controller.js`. They diverge in which characters
they escape. Pick one, ship it from a shared module, delete the
other. Eliminates drift.

---

### L-4 — Public commit fingerprint via dates and prompts

`docs/DISCOVERY_SESSION_001.md:3` and
`docs/DISCOVERY_SESSION_002.md` (now lives in `prompt-library`) plus
the commit timestamps narrow the maintainer/facilitator's working
schedule to a small window. Combined with the named country
(`CLAUDE.md:24`, "piloted at two institutions in Poland") and the
named institution types ("art academy", "applied sciences
university"), the named maintainer is recoverable via simple OSINT.

This is the maintainer's own choice — many open-source maintainers
work under their real identity. The privacy protocol in
`CONTRIBUTING.md:175–197` already protects pilot participants, which
is the policy goal.

**Recommendation:** None unless the maintainer wishes to extend the
anonymisation to themselves. Note the asymmetry as a known posture.

---

### L-5 — `update.sh` does not pin image digests

`docker compose pull` follows whatever tag the local
`docker-compose.yml` uses. If that's a mutable tag (e.g. `:latest`,
`:1.0`), a registry-side compromise can replace the image without the
teacher noticing.

**Recommendation:** Pin to image digests (`@sha256:…`) in the
release-package `docker-compose.yml`, and have `update.sh` print the
new digest before applying.

---

## Informational

### I-1 — Pilot anonymisation policy is well-defined

`CONTRIBUTING.md:165–197` and `CLAUDE.md:118–127` are clear and
disciplined. The audit found no leaks of pilot-institution names,
participant names, or city names beyond the allowed
"a city in Poland" pattern. Document metadata of the
companion-repo DOCX (`prompt-library/docs/pilot_discovery_document(2).docx`)
correctly sets the author to `Un-named`.

The only minor inconsistency is that the prompt-library repo does
not link back to this canonical privacy protocol; flagged in the
companion audit.

### I-2 — `ARCHITECTURE.md` already commits to GDPR retention semantics

`ARCHITECTURE.md` §11 ("Data Retention") explicitly classifies
student work as personal data under GDPR and documents the
study-cycle + 1 year retention with teacher-confirmed deletion.
What it does *not* yet describe:

- Data subject access / erasure mechanics for *students* (Phase-1
  scope is teacher-only, but a student may still issue a GDPR Art.
  15/17 request to the institution).
- Lawful basis recorded per requirement set.
- DPIA for the AI-provider transit step.

**Recommendation:** Add a §11.4 stub now ("phase 2") so the
governance question is tracked rather than rediscovered.

### I-3 — No GitHub Actions workflows present

There are no `.github/workflows/` files, so there is no current
risk of `secrets.*` exposure via CI. When CI is added, prefer
OIDC-issued short-lived credentials over long-lived `secrets.*`,
and run dependency-scanning on the JS bundle.

---

## Suggested remediation order

1. Patch H-3 (`innerHTML` of fetched HTML) and H-4 (`https://`
   enforcement) — these are 1–10 line code changes.
2. Update the API-key security-note copy (H-1, H-2) to match the
   actual threat model.
3. Add CSP meta tag (M-3).
4. Fix or unify `escHtml` (M-2 / L-3).
5. Decide on backup encryption / rotation policy (M-4).
6. Decide on proxy strategy: drop the URL-fetch tab, or run the proxy
   in-process / in the planned backend (H-3, M-1, M-6).
7. Add the §11.4 GDPR-data-subject-rights stub (I-2).

None of the high-severity items are exploitable from the public
codebase alone — they require either (a) an attacker delivering
content via the URL-fetch tab, or (b) prior compromise of the
shared device. The exposure window is real, but the mitigation cost
is small and the project is pre-pilot, which is the right time to
fix it.
