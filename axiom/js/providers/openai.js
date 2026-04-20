/* axiom/js/providers/openai.js — OpenAI GPT provider plugin
   Module 4 — Academic Assessor
   UTF-8. Phase 1 provider.
*/

(function () {
  'use strict';

  AXIOM_ASSESSOR_CONFIG.providers.openai = {
    id:     'openai',
    label:  'OpenAI GPT',
    apiUrl: 'https://api.openai.com/v1/chat/completions',

    models: [
      { value: 'gpt-4o',      label: 'GPT-4o'      },
      { value: 'gpt-4o-mini', label: 'GPT-4o mini' },
    ],

    // Models known to pass the full capability probe — probe is skipped for these
    knownCompatible: [
      'gpt-4o',
      'gpt-4o-mini',
    ],

    validate(cfg) {
      if (!cfg || !cfg.apiKey) {
        return { valid: false, error: 'step.apikey.test.error.empty' };
      }
      if (!cfg.apiKey.startsWith('sk-')) {
        return { valid: false, error: 'step.apikey.test.error.format.openai' };
      }
      return { valid: true };
    },

    buildHeaders(cfg) {
      return {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + cfg.apiKey,
      };
    },

    buildTestBody() {
      return {
        model: 'gpt-4o-mini',
        max_tokens: 16,
        messages: [
          { role: 'system', content: 'Reply only with the single word OK.' },
          { role: 'user',   content: 'Ping.' },
        ],
      };
    },

    buildProbeBody(test) {
      const bodies = {
        structured: {
          model: 'gpt-4o-mini',
          max_tokens: 64,
          messages: [
            {
              role: 'system',
              content: 'You are a test responder. Reply ONLY with valid JSON matching exactly this schema: {"status":"ok","echo":"<repeat the user word>"}',
            },
            { role: 'user', content: 'Word: probe' },
          ],
        },
        polish: {
          model: 'gpt-4o-mini',
          max_tokens: 32,
          messages: [
            { role: 'system', content: 'Odpowiedz tylko słowem: POTWIERDZAM' },
            { role: 'user',   content: 'Sprawdzenie obsługi języka polskiego: ą ć ę ł ń ó ś ź ż' },
          ],
        },
      };
      return bodies[test] || bodies.structured;
    },

    parseResponse(data) {
      const choice = (data.choices || [])[0];
      return (choice && choice.message && choice.message.content) || '';
    },

    isKnownCompatible(cfg) {
      const model = (cfg && cfg.model) || 'gpt-4o-mini';
      return this.knownCompatible.indexOf(model) !== -1;
    },
  };
}());
