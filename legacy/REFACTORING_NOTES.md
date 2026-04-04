# Artefact Analyser v1.0 — Refactoring Notes

## Summary

The original `artefact_analyser_v1_0.html` was a monolithic single-file application hardcoded to Anthropic Claude. This refactor makes the tool **AI-provider-agnostic** per `ARCHITECTURE.md § 7`, and modularises the codebase into maintainable files.

The original file is preserved unchanged at `artefact_analyser_v1_0.html` for reference.

---

## New File Structure

```
legacy/
├── index.html                  ← Entry point (replaces monolithic HTML)
├── css/
│   └── styles.css              ← All styling (extracted from HTML)
├── js/
│   ├── config.js               ← Provider registry and localStorage management
│   ├── api-abstraction.js      ← Unified callAI() dispatch function
│   ├── ui-controller.js        ← DOM events, modal, tabs, file handling
│   ├── main.js                 ← PROMPT_TEMPLATE, STM, utilities, init
│   ├── manual.js               ← Embedded DOCX manual (base64)
│   └── providers/
│       ├── anthropic.js        ← Anthropic Claude provider
│       ├── openai.js           ← OpenAI GPT provider
│       ├── azure.js            ← Azure OpenAI provider (phase 2)
│       └── custom.js           ← Custom endpoint provider (phase 2)
├── i18n/
│   └── en.json                 ← All user-facing strings (English master)
├── REFACTORING_NOTES.md        ← This file
└── artefact_analyser_v1_0.html ← Original monolithic file (preserved)
```

---

## Provider Architecture

### Interface Contract

Every provider plugin in `js/providers/` must expose the following interface on the `AXIOM_CONFIG.providers` registry:

```javascript
AXIOM_CONFIG.providers.myProvider = {
  id:       'myProvider',           // unique string key
  label:    'My Provider Name',     // display name in the modal
  apiUrl:   'https://...',          // static endpoint (or null if dynamic)
  models:   [                       // for the model selector; empty = no selector
    { value: 'model-id', label: 'Display Name' },
  ],
  fields: [                         // fields to show in the config modal
    {
      id:          'apiKey',        // key in providerConfig object
      label:       'API Key',       // label shown to user
      type:        'password',      // input type: text | password | url | select
      placeholder: 'sk-...',        // placeholder text
      note:        'optional HTML hint shown below the input',
    },
    { id: 'model', label: 'Model', type: 'select' },  // renders provider.models
  ],

  validate(cfg):        // { valid: bool, error: string } — called before saving and before API call
  buildHeaders(cfg):    // returns headers object for the fetch() call
  buildBody(systemPrompt, userBlocks, cfg):  // returns the parsed JSON body object
  parseResponse(data):  // extracts text string from the provider's response JSON
  selectModel(cfg):     // returns the active model identifier string

  // Optional — only needed if the endpoint URL is dynamic (e.g. Azure):
  getEndpoint(cfg):     // returns the full URL string
};
```

### Canonical User Block Format

Internally the application uses the **Anthropic-compatible** block format. Providers are responsible for converting this to their own wire format in `buildBody()`:

| Block type | Internal format |
|------------|-----------------|
| Text | `{ type: 'text', text: '...' }` |
| Image | `{ type: 'image', source: { type: 'base64', media_type: 'image/png', data: '...' } }` |
| Document | `{ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: '...' } }` |

OpenAI converts images to `image_url` format. It does not support direct document upload — the OpenAI provider returns an explanatory text block in that case. Azure and Custom providers follow the OpenAI conversion path.

---

## Adding a New Provider

1. Create `js/providers/myprovider.js` implementing the interface above.
2. Add a `<script src="js/providers/myprovider.js"></script>` tag in `index.html` after the existing provider scripts.
3. Add a `<option value="myprovider">My Provider</option>` in the `#providerSelect` dropdown in `index.html`.
4. Add provider-specific notes to the `noteMap` object in `js/ui-controller.js`.
5. Add any new UI strings to `i18n/en.json`.

No other files need changing.

### Minimal provider example

```javascript
// js/providers/myprovider.js
(function () {
  'use strict';

  AXIOM_CONFIG.providers.myprovider = {
    id:     'myprovider',
    label:  'My Provider',
    apiUrl: 'https://api.myprovider.example/v1/chat',
    models: [{ value: 'model-v1', label: 'Model V1' }],
    fields: [
      { id: 'apiKey', label: 'API Key', type: 'password', placeholder: 'key-...' },
      { id: 'model',  label: 'Model',   type: 'select' },
    ],

    validate(cfg) {
      if (!cfg || !cfg.apiKey) return { valid: false, error: 'API key required' };
      return { valid: true };
    },

    buildHeaders(cfg) {
      return {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-API-Key': cfg.apiKey,
      };
    },

    buildBody(systemPrompt, userBlocks, cfg) {
      return {
        model: cfg.model || 'model-v1',
        system: systemPrompt,
        messages: [{ role: 'user', content: userBlocks.map(b => b.text || '').join('\n') }],
      };
    },

    parseResponse(data) {
      return data.output || '';
    },

    selectModel(cfg) {
      return cfg.model || 'model-v1';
    },
  };
}());
```

---

## Configuration Storage

Provider settings are persisted to `localStorage` under the key:

```
aXIOM_artefact_analyser_v1_config
```

### Storage schema

```json
{
  "provider": "anthropic",
  "providerConfig": {
    "anthropic": {
      "apiKey": "sk-ant-...",
      "model": "claude-sonnet-4-20250514"
    },
    "openai": {
      "apiKey": "sk-...",
      "model": "gpt-4o"
    },
    "azure": {
      "endpoint": "https://your-resource.openai.azure.com/",
      "apiKey": "...",
      "deploymentName": "my-deployment"
    },
    "custom": {
      "endpoint": "https://...",
      "model": "llama-3",
      "authHeader": "Bearer ..."
    }
  }
}
```

Settings for each provider are stored independently. Switching provider and switching back restores the previously saved configuration for that provider.

---

## Backward Compatibility

- **PROMPT_TEMPLATE**: Identical to the original — not modified.
- **Artefact ID algorithm**: SHA-256(source_type + date + content), first 8 hex chars — unchanged.
- **STM (source type map)**: Identical to the original.
- **Anthropic API call**: Identical wire format — `buildBody()` in `anthropic.js` produces the same request body as the original `claude()` function.
- **Existing Anthropic key flow**: Entering an `sk-ant-` key in the new modal works identically to the original.

---

## UTF-8 Compliance

- `index.html`: `<meta charset="UTF-8">` in `<head>`.
- All JS files: UTF-8 encoded, no BOM.
- `i18n/en.json`: UTF-8 encoded, no BOM.
- API calls: `Content-Type: application/json; charset=UTF-8` header in all providers.
- Polish diacritics (ą ć ę ł ń ó ś ź ż) and German umlauts (ä ö ü ß) handled correctly by browser via UTF-8 throughout.

---

## Migration from Monolithic HTML

The original `artefact_analyser_v1_0.html` continues to work as before. To migrate to the modular version:

1. Open `legacy/index.html` via a local web server (required for multi-file loads).
2. The provider config modal opens automatically if no config is found in localStorage.
3. Enter your Anthropic API key — the same key and workflow as the original.
4. All other functionality is identical.

To run locally without a server, use any of:
- Python: `python3 -m http.server 8080` in the `legacy/` directory
- Node.js: `npx serve legacy/`
- VS Code: Live Server extension
- Docker: The project's existing Docker Compose setup

---

## Security Notes

### CORS Proxy for URL Fetch

The URL fetch tab uses `corsproxy.io` as a third-party CORS proxy to retrieve web pages before passing their text to the AI provider. This is inherited from the original monolithic file.

**Implication:** The full content of any fetched URL passes through the proxy operator's infrastructure before reaching your AI provider. This is acceptable for public web content in a research context, but should not be used to fetch private or authenticated URLs.

**Production alternative:** Replace `corsproxy.io` with a self-hosted CORS proxy (e.g. `cors-anywhere` running in the Docker Compose stack). This removes the third-party dependency entirely. The proxy URL is constructed in `ui-controller.js` — change the one line that builds `proxyUrl` to point to your local proxy.

---

## Phase 2 Providers

`azure.js` and `custom.js` are included and fully functional in terms of configuration and wire format. They are not yet tested against live endpoints. Phase 2 testing will validate:
- Azure OpenAI endpoint construction and authentication
- Custom endpoint OpenAI-compatible API compliance
- Capability probe results for non-default providers
