/* axiom/js/config.js — aXIOM Academic Assessor configuration management
   Module 4 — Academic Assessor
   UTF-8.
*/

const AXIOM_ASSESSOR_CONFIG = (function () {
  'use strict';

  const STORAGE_KEY         = 'aXIOM_assessor_v1_config';
  const ONBOARDING_KEY      = 'aXIOM_assessor_v1_onboarding_complete';
  const PROBE_RESULT_KEY    = 'aXIOM_assessor_v1_probe_result';

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

  /** Check whether the onboarding wizard has been completed. */
  function isOnboardingComplete() {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  }

  /** Mark the onboarding wizard as complete. */
  function markOnboardingComplete() {
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (e) {
      // Storage write failure — silently ignore
    }
  }

  /** Save the capability probe result for display in the main app. */
  function saveProbeResult(result) {
    try {
      localStorage.setItem(PROBE_RESULT_KEY, JSON.stringify(result));
    } catch (e) {}
  }

  /** Load the most recent capability probe result. */
  function loadProbeResult() {
    try {
      const raw = localStorage.getItem(PROBE_RESULT_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  return {
    providers,
    STORAGE_KEY,
    loadConfig,
    saveConfig,
    isConfigured,
    isOnboardingComplete,
    markOnboardingComplete,
    saveProbeResult,
    loadProbeResult,
  };
}());
