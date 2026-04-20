/* providers/azure.js — Azure OpenAI provider plugin
   Artefact Analyser v1.0 — AI-agnostic refactor
   Phase 2 provider — configuration only in phase 1.
   UTF-8. See REFACTORING_NOTES.md for how to add a new provider.
*/

(function () {
  'use strict';

  AXIOM_CONFIG.providers.azure = {
    id: 'azure',
    label: 'Azure OpenAI',
    // Endpoint is constructed from user-supplied fields
    apiUrl: null,

    models: [],  // Azure deployment names are user-defined — no fixed list

    fields: [
      {
        id: 'endpoint',
        label: 'Endpoint URL',
        type: 'url',
        placeholder: 'https://your-resource.openai.azure.com/',
      },
      {
        id: 'apiKey',
        label: 'API Key',
        type: 'password',
        placeholder: 'Azure API key',
      },
      {
        id: 'deploymentName',
        label: 'Deployment Name',
        type: 'text',
        placeholder: 'deployment-name',
        note: 'The name you gave the model deployment in Azure AI Studio.',
      },
    ],

    validate(cfg) {
      if (!cfg || !cfg.endpoint || !cfg.endpoint.startsWith('https://')) {
        return { valid: false, error: 'Azure endpoint must be an https:// URL' };
      }
      if (!cfg.apiKey) {
        return { valid: false, error: 'Azure API key is required' };
      }
      if (!cfg.deploymentName) {
        return { valid: false, error: 'Azure deployment name is required' };
      }
      return { valid: true };
    },

    getEndpoint(cfg) {
      // Azure REST API path: {endpoint}/openai/deployments/{deployment}/chat/completions?api-version=...
      var base = (cfg.endpoint || '').replace(/\/$/, '');
      return base + '/openai/deployments/' + encodeURIComponent(cfg.deploymentName) +
        '/chat/completions?api-version=2024-02-01';
    },

    buildHeaders(cfg) {
      return {
        'Content-Type': 'application/json; charset=UTF-8',
        'api-key': cfg.apiKey,
      };
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

      return {
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

    parseUsage(data) {
      if (!data || !data.usage) return null;
      return {
        inputTokens:  data.usage.prompt_tokens     || 0,
        outputTokens: data.usage.completion_tokens || 0,
      };
    },

    selectModel(cfg) {
      return cfg.deploymentName || '';
    },
  };
}());
