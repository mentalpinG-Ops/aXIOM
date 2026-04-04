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

  return { providers, STORAGE_KEY, loadConfig, saveConfig, isConfigured };
}());
