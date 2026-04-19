/* api-abstraction.js — Unified AI API interface
   Dispatches callAI() to whichever provider is currently configured.
   UTF-8. See REFACTORING_NOTES.md for architecture notes.
*/

/**
 * Call the configured AI provider with a system prompt and user content blocks.
 *
 * userBlocks uses the Anthropic-compatible block format as the internal canonical:
 *   { type: 'text', text: '...' }
 *   { type: 'image', source: { type: 'base64', media_type: 'image/png', data: '...' } }
 *   { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: '...' } }
 *
 * Each provider plugin is responsible for converting this format to its own wire format.
 *
 * @param {string} systemPrompt
 * @param {Array}  userBlocks
 * @returns {Promise<{text: string, usage: {inputTokens: number, outputTokens: number}|null, model: string}>}
 * @throws {Error} on provider misconfiguration or API failure
 */
async function callAI(systemPrompt, userBlocks) {
  var cfg = AXIOM_CONFIG.loadConfig();
  var providerId = cfg.provider || 'anthropic';
  var provider = AXIOM_CONFIG.providers[providerId];

  if (!provider) {
    throw new Error('Unknown provider: ' + providerId + ' — click ⚿ to configure.');
  }

  var providerCfg = (cfg.providerConfig || {})[providerId] || {};
  var validation = provider.validate(providerCfg);
  if (!validation.valid) {
    throw new Error((validation.error || 'Provider not configured') + ' — click ⚿ to configure.');
  }

  var url = (typeof provider.getEndpoint === 'function')
    ? provider.getEndpoint(providerCfg)
    : provider.apiUrl;

  var resp = await fetch(url, {
    method: 'POST',
    headers: provider.buildHeaders(providerCfg),
    body: JSON.stringify(provider.buildBody(systemPrompt, userBlocks, providerCfg)),
  });

  if (!resp.ok) {
    var err = await resp.json().catch(function () { return {}; });
    throw new Error((err.error && err.error.message) || 'API error ' + resp.status);
  }

  var data = await resp.json();
  var modelId = (typeof provider.selectModel === 'function')
    ? provider.selectModel(providerCfg)
    : '';

  return {
    text:  provider.parseResponse(data),
    usage: (typeof provider.parseUsage === 'function') ? provider.parseUsage(data) : null,
    model: modelId,
  };
}
