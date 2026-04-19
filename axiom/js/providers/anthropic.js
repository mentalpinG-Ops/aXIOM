/* axiom/js/providers/anthropic.js — Anthropic Claude provider plugin
   Module 4 — Academic Assessor
   UTF-8. Phase 1 provider.
*/

(function () {
  'use strict';

  AXIOM_ASSESSOR_CONFIG.providers.anthropic = {
    id:     'anthropic',
    label:  'Anthropic Claude',
    apiUrl: 'https://api.anthropic.com/v1/messages',

    models: [
      { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
      { value: 'claude-3-5-haiku-20241022', label: 'Claude Haiku 3.5' },
      { value: 'claude-opus-4-5',           label: 'Claude Opus 4.5'  },
    ],

    // Models known to pass the full capability probe — probe is skipped for these
    knownCompatible: [
      'claude-sonnet-4-20250514',
      'claude-3-5-haiku-20241022',
      'claude-opus-4-5',
    ],

    validate(cfg) {
      if (!cfg || !cfg.apiKey) {
        return { valid: false, error: 'step.apikey.test.error.empty' };
      }
      if (!cfg.apiKey.startsWith('sk-ant-')) {
        return { valid: false, error: 'step.apikey.test.error.format.anthropic' };
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

    buildTestBody() {
      return {
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 16,
        system: 'Reply only with the single word OK.',
        messages: [{ role: 'user', content: [{ type: 'text', text: 'Ping.' }] }],
      };
    },

    buildProbeBody(test) {
      const bodies = {
        structured: {
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 64,
          system: 'You are a test responder. Reply ONLY with valid JSON matching exactly this schema: {"status":"ok","echo":"<repeat the user word>"}',
          messages: [{ role: 'user', content: [{ type: 'text', text: 'Word: probe' }] }],
        },
        polish: {
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 32,
          system: 'Odpowiedz tylko słowem: POTWIERDZAM',
          messages: [{ role: 'user', content: [{ type: 'text', text: 'Sprawdzenie obsługi języka polskiego: ą ć ę ł ń ó ś ź ż' }] }],
        },
      };
      return bodies[test] || bodies.structured;
    },

    parseResponse(data) {
      return (data.content || []).map(function (b) { return b.text || ''; }).join('');
    },

    isKnownCompatible(cfg) {
      const model = (cfg && cfg.model) || 'claude-sonnet-4-20250514';
      return this.knownCompatible.indexOf(model) !== -1;
    },
  };
}());
