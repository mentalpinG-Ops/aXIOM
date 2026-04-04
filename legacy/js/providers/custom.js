/* providers/custom.js — Custom endpoint provider plugin
   Artefact Analyser v1.0 — AI-agnostic refactor
   Phase 2 provider — for self-hosted or non-standard endpoints.
   Assumes an OpenAI-compatible chat completions API.
   UTF-8. See REFACTORING_NOTES.md for how to add a new provider.
*/

(function () {
  'use strict';

  AXIOM_CONFIG.providers.custom = {
    id: 'custom',
    label: 'Custom Endpoint',
    apiUrl: null,

    models: [],

    fields: [
      {
        id: 'endpoint',
        label: 'Endpoint URL',
        type: 'url',
        placeholder: 'https://your-endpoint/v1/chat/completions',
        note: 'Must be an OpenAI-compatible /chat/completions endpoint.',
      },
      {
        id: 'model',
        label: 'Model Name',
        type: 'text',
        placeholder: 'model-name (optional)',
      },
      {
        id: 'authHeader',
        label: 'Auth Header (optional)',
        type: 'text',
        placeholder: 'Bearer your-token',
        note: 'Full Authorization header value. Leave blank for unauthenticated endpoints.',
      },
    ],

    validate(cfg) {
      if (!cfg || !cfg.endpoint || !cfg.endpoint.startsWith('http')) {
        return { valid: false, error: 'Custom endpoint must be an http:// or https:// URL' };
      }
      return { valid: true };
    },

    getEndpoint(cfg) {
      return cfg.endpoint || '';
    },

    buildHeaders(cfg) {
      var headers = { 'Content-Type': 'application/json; charset=UTF-8' };
      if (cfg.authHeader) {
        headers['Authorization'] = cfg.authHeader;
      }
      return headers;
    },

    buildBody(systemPrompt, userBlocks, cfg) {
      var content = userBlocks.map(function (block) {
        if (block.type === 'text') return { type: 'text', text: block.text };
        if (block.type === 'image' && block.source) {
          return {
            type: 'image_url',
            image_url: {
              url: 'data:' + block.source.media_type + ';base64,' + block.source.data,
            },
          };
        }
        return null;
      }).filter(Boolean);

      var body = {
        max_tokens: 4000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: content },
        ],
      };
      if (cfg.model) body.model = cfg.model;
      return body;
    },

    parseResponse(data) {
      return (data.choices && data.choices[0] && data.choices[0].message &&
        data.choices[0].message.content) || '';
    },

    selectModel(cfg) {
      return cfg.model || 'custom';
    },
  };
}());
