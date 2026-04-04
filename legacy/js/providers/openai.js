/* providers/openai.js — OpenAI GPT provider plugin
   Artefact Analyser v1.0 — AI-agnostic refactor
   UTF-8. See REFACTORING_NOTES.md for how to add a new provider.
*/

(function () {
  'use strict';

  AXIOM_CONFIG.providers.openai = {
    id: 'openai',
    label: 'OpenAI GPT',
    apiUrl: 'https://api.openai.com/v1/chat/completions',

    models: [
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4o-mini', label: 'GPT-4o mini' },
    ],

    fields: [
      {
        id: 'apiKey',
        label: 'API Key',
        type: 'password',
        placeholder: 'sk-…',
        note: '<a href="https://platform.openai.com" target="_blank" rel="noopener">platform.openai.com</a>',
      },
      { id: 'model', label: 'Model', type: 'select' },
    ],

    validate(cfg) {
      if (!cfg || !cfg.apiKey || !cfg.apiKey.startsWith('sk-')) {
        return { valid: false, error: 'OpenAI API key must start with sk-' };
      }
      return { valid: true };
    },

    buildHeaders(cfg) {
      return {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + cfg.apiKey,
      };
    },

    /**
     * Converts Anthropic-format userBlocks to OpenAI message content.
     * - text blocks: passed through unchanged
     * - image blocks: converted to image_url format
     * - document blocks: not supported natively — text fallback with notice
     */
    buildBody(systemPrompt, userBlocks, cfg) {
      var content = userBlocks.map(function (block) {
        if (block.type === 'text') {
          return { type: 'text', text: block.text };
        }
        if (block.type === 'image' && block.source) {
          return {
            type: 'image_url',
            image_url: {
              url: 'data:' + block.source.media_type + ';base64,' + block.source.data,
            },
          };
        }
        if (block.type === 'document' && block.source) {
          // OpenAI does not have a native document block type.
          // Return a text notice so the caller receives a meaningful response.
          return {
            type: 'text',
            text: '[Note: direct document upload is not supported for OpenAI via browser API. Use the Paste tab to paste extracted text, or switch to Anthropic Claude for direct file extraction.]',
          };
        }
        return null;
      }).filter(Boolean);

      return {
        model: cfg.model || 'gpt-4o',
        max_tokens: 4000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: content },
        ],
      };
    },

    parseResponse(data) {
      return (data.choices && data.choices[0] && data.choices[0].message &&
        data.choices[0].message.content) || '';
    },

    selectModel(cfg) {
      return cfg.model || 'gpt-4o';
    },
  };
}());
