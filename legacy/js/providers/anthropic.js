/* providers/anthropic.js — Anthropic Claude provider plugin
   Artefact Analyser v1.0 — AI-agnostic refactor
   UTF-8. See REFACTORING_NOTES.md for how to add a new provider.
*/

(function () {
  'use strict';

  AXIOM_CONFIG.providers.anthropic = {
    id: 'anthropic',
    label: 'Anthropic Claude',
    apiUrl: 'https://api.anthropic.com/v1/messages',

    models: [
      { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
      { value: 'claude-3-5-haiku-20241022', label: 'Claude Haiku 3.5' },
      { value: 'claude-opus-4-5', label: 'Claude Opus 4.5' },
    ],

    fields: [
      {
        id: 'apiKey',
        label: 'API Key',
        type: 'password',
        placeholder: 'sk-ant-…',
        note: '<a href="https://console.anthropic.com" target="_blank" rel="noopener">console.anthropic.com</a>',
      },
      { id: 'model', label: 'Model', type: 'select' },
    ],

    validate(cfg) {
      if (!cfg || !cfg.apiKey || !cfg.apiKey.startsWith('sk-ant-')) {
        return { valid: false, error: 'Anthropic API key must start with sk-ant-' };
      }
      return { valid: true };
    },

    buildHeaders(cfg) {
      return {
        'Content-Type': 'application/json; charset=UTF-8',
        'x-api-key': cfg.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      };
    },

    /**
     * userBlocks uses the Anthropic native format:
     *   { type:'text', text:'...' }
     *   { type:'image', source:{ type:'base64', media_type: mt, data: b64 }}
     *   { type:'document', source:{ type:'base64', media_type:'application/pdf', data: b64 }}
     */
    buildBody(systemPrompt, userBlocks, cfg) {
      return {
        model: cfg.model || 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userBlocks }],
      };
    },

    parseResponse(data) {
      return data.content.map(function (b) { return b.text || ''; }).join('');
    },

    parseUsage(data) {
      if (!data || !data.usage) return null;
      return {
        inputTokens:  data.usage.input_tokens  || 0,
        outputTokens: data.usage.output_tokens || 0,
      };
    },

    selectModel(cfg) {
      return cfg.model || 'claude-sonnet-4-20250514';
    },
  };
}());
