/* config.js — Provider configuration schema and localStorage management
   Artefact Analyser v1.0 — AI-agnostic refactor
   UTF-8. See REFACTORING_NOTES.md for architecture notes.
*/

// Global namespace
const AXIOM_CONFIG = (function () {
  'use strict';

  const STORAGE_KEY = 'aXIOM_artefact_analyser_v1_config';

  // Provider registry — populated by provider scripts loaded after this file
  const providers = {};

  /**
   * Per-model API pricing in USD per million tokens.
   * Prices are estimates and subject to provider changes.
   * Models not listed here will have no cost estimate shown.
   */
  const MODEL_PRICING = {
    // Anthropic Claude
    'claude-sonnet-4-20250514':  { input:  3.00, output: 15.00 },
    'claude-3-5-haiku-20241022': { input:  0.80, output:  4.00 },
    'claude-opus-4-5':           { input: 15.00, output: 75.00 },
    // OpenAI GPT
    'gpt-4o':      { input: 2.50, output: 10.00 },
    'gpt-4o-mini': { input: 0.15, output:  0.60 },
  };

  /**
   * Estimate cost in USD for a single AI call.
   * Returns null when no pricing data is available for the model.
   * @param {string} modelId
   * @param {number} inputTokens
   * @param {number} outputTokens
   * @returns {number|null}
   */
  function estimateCost(modelId, inputTokens, outputTokens) {
    var pricing = MODEL_PRICING[modelId];
    if (!pricing) return null;
    return (inputTokens * pricing.input + outputTokens * pricing.output) / 1e6;
  }

  /** Load persisted config from localStorage. Returns a plain object. */
  function loadConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // Corrupt storage — return default
    }
    return { provider: 'anthropic', providerConfig: {} };
  }

  /** Persist config to localStorage. */
  function saveConfig(cfg) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch (e) {
      // Storage write failure — silently ignore (private browsing etc.)
    }
  }

  /**
   * Check whether a provider is fully configured (has required fields).
   * Returns true if a provider is selected and its validate() passes.
   */
  function isConfigured() {
    const cfg = loadConfig();
    const provider = providers[cfg.provider];
    if (!provider) return false;
    const providerCfg = (cfg.providerConfig || {})[cfg.provider] || {};
    return provider.validate(providerCfg).valid;
  }

  return { providers, STORAGE_KEY, loadConfig, saveConfig, isConfigured, estimateCost };
}());
