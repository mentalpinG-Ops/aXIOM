/* axiom/js/onboarding.js — aXIOM onboarding wizard logic
   Module 4 — Academic Assessor
   Five-step setup wizard: Welcome → Provider → API Key → Probe → Ready
   UTF-8.
*/

(function () {
  'use strict';

  // ── i18n ─────────────────────────────────────────────────────────────────────

  var _strings = {};

  /**
   * Load locale strings from the i18n JSON file.
   * Detects browser language, falls back to English.
   */
  async function loadStrings() {
    var lang = (navigator.language || 'en').slice(0, 2).toLowerCase();
    var supported = ['en', 'pl'];
    if (supported.indexOf(lang) === -1) lang = 'en';
    try {
      var resp = await fetch('i18n/' + lang + '.json');
      if (!resp.ok) throw new Error('Not found');
      _strings = await resp.json();
    } catch (e) {
      // Fall back to English if locale file missing
      try {
        var resp2 = await fetch('i18n/en.json');
        _strings = await resp2.json();
      } catch (e2) {
        _strings = {};
      }
    }
  }

  /**
   * Translate a key, substituting {placeholder} tokens with values.
   * Returns the key itself if no translation found (never exposes missing keys silently).
   */
  function t(key, vars) {
    var str = _strings[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
      });
    }
    return str;
  }

  /**
   * Apply translations to all elements with [data-i18n] attributes.
   * Supports data-i18n-html for innerHTML (for strings with links/markup).
   */
  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
  }

  // ── State ─────────────────────────────────────────────────────────────────────

  var state = {
    currentStep:    1,
    totalSteps:     5,
    selectedProvider: 'anthropic',
    testPassed:     false,
    probeResult:    null,   // 'pass' | 'warn' | 'fail' | 'skip'
  };

  // ── DOM refs ─────────────────────────────────────────────────────────────────

  var $ = function (id) { return document.getElementById(id); };

  var progressBar  = $('progressBar');
  var progressText = $('progressText');
  var stepEls      = {};

  function initStepRefs() {
    for (var i = 1; i <= state.totalSteps; i++) {
      stepEls[i] = $('step' + i);
    }
  }

  // ── Navigation ────────────────────────────────────────────────────────────────

  function showStep(n) {
    state.currentStep = n;

    // Update progress
    var pct = Math.round(((n - 1) / (state.totalSteps - 1)) * 100);
    progressBar.style.width = pct + '%';
    progressBar.setAttribute('aria-valuenow', pct);
    progressText.textContent = t('onboarding.progress', { current: n, total: state.totalSteps });

    // Show/hide step panels
    for (var i = 1; i <= state.totalSteps; i++) {
      if (stepEls[i]) stepEls[i].classList.toggle('hidden', i !== n);
    }

    // Step-specific on-show logic
    if (n === 3) onShowApiKeyStep();
    if (n === 4) onShowProbeStep();
    if (n === 5) onShowReadyStep();

    window.scrollTo(0, 0);
  }

  function nextStep() { showStep(state.currentStep + 1); }
  function prevStep() { showStep(state.currentStep - 1); }

  // ── Step 1: Welcome ───────────────────────────────────────────────────────────

  function initStep1() {
    $('btnWelcomeCta').addEventListener('click', nextStep);
  }

  // ── Step 2: Provider selection ────────────────────────────────────────────────

  function initStep2() {
    document.querySelectorAll('.provider-card').forEach(function (card) {
      card.addEventListener('click', function () {
        document.querySelectorAll('.provider-card').forEach(function (c) {
          c.classList.remove('selected');
          c.setAttribute('aria-pressed', 'false');
        });
        card.classList.add('selected');
        card.setAttribute('aria-pressed', 'true');
        state.selectedProvider = card.dataset.provider;
      });
    });

    $('btnProviderCta').addEventListener('click', function () {
      state.testPassed = false;
      nextStep();
    });

    $('btnProviderBack').addEventListener('click', prevStep);
  }

  // ── Step 3: API Key ───────────────────────────────────────────────────────────

  var apiKeyInput  = null;
  var modelSelect  = null;
  var testBtn      = null;
  var testResult   = null;
  var apiKeyCta    = null;

  function onShowApiKeyStep() {
    var provider = AXIOM_ASSESSOR_CONFIG.providers[state.selectedProvider];

    // Update heading
    $('apikeyTitle').textContent = t('step.apikey.title.' + state.selectedProvider);

    // Render provider-specific instructions
    var instHtml = '<ol class="instructions-list">'
      + '<li>' + t('step.apikey.instructions.' + state.selectedProvider + '.step1') + '</li>'
      + '<li>' + t('step.apikey.instructions.' + state.selectedProvider + '.step2') + '</li>'
      + '<li>' + t('step.apikey.instructions.' + state.selectedProvider + '.step3') + '</li>'
      + '<li>' + t('step.apikey.instructions.' + state.selectedProvider + '.step4') + '</li>'
      + '</ol>';
    $('apikeyInstructions').innerHTML = instHtml;

    // API key input
    apiKeyInput = $('apikeyInput');
    apiKeyInput.placeholder = t('step.apikey.field.placeholder.' + state.selectedProvider);

    // Restore saved key if any
    var cfg = AXIOM_ASSESSOR_CONFIG.loadConfig();
    var saved = ((cfg.providerConfig || {})[state.selectedProvider]) || {};
    if (saved.apiKey) apiKeyInput.value = saved.apiKey;

    // Model selector
    var modelContainer = $('apikeyModelContainer');
    if (provider && provider.models && provider.models.length > 0) {
      var optHtml = provider.models.map(function (m) {
        var sel = (saved.model === m.value) ? ' selected' : '';
        return '<option value="' + escHtml(m.value) + '"' + sel + '>' + escHtml(m.label) + '</option>';
      }).join('');
      modelContainer.innerHTML = '<div class="form-group">'
        + '<label class="field-label" for="apikeyModel">' + t('step.apikey.model.label') + '</label>'
        + '<select id="apikeyModel">' + optHtml + '</select>'
        + '</div>';
      modelSelect = $('apikeyModel');
    } else {
      modelContainer.innerHTML = '';
      modelSelect = null;
    }

    // Security note
    $('apikeySecurityNote').textContent = t('step.apikey.security.note', { provider: provider ? provider.label : '' });

    // Reset test state
    testResult  = $('apikeyTestResult');
    testBtn     = $('apikeyTestBtn');
    apiKeyCta   = $('apikeyCtaBtn');

    testResult.textContent = '';
    testResult.className = 'test-result';
    testBtn.textContent = t('step.apikey.test.button');
    testBtn.disabled = false;
    apiKeyCta.disabled = !state.testPassed;
  }

  function initStep3() {
    $('apikeyShowToggle').addEventListener('click', function () {
      var inp = $('apikeyInput');
      var isPassword = inp.type === 'password';
      inp.type = isPassword ? 'text' : 'password';
      this.textContent = t(isPassword ? 'step.apikey.field.hide' : 'step.apikey.field.show');
    });

    $('apikeyTestBtn').addEventListener('click', runConnectionTest);
    $('apikeyCtaBtn').addEventListener('click', function () {
      if (!state.testPassed) return;
      saveApiKey();
      nextStep();
    });
    $('btnApiKeyBack').addEventListener('click', prevStep);
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function runConnectionTest() {
    var provider = AXIOM_ASSESSOR_CONFIG.providers[state.selectedProvider];
    var key = $('apikeyInput').value.trim();

    testResult = $('apikeyTestResult');
    testBtn    = $('apikeyTestBtn');
    apiKeyCta  = $('apikeyCtaBtn');

    // Client-side validation first
    if (!key) {
      showTestResult('error', t('step.apikey.test.error.empty'));
      return;
    }
    var validation = provider.validate({ apiKey: key });
    if (!validation.valid) {
      showTestResult('error', t(validation.error));
      return;
    }

    // Start loading state
    testBtn.disabled = true;
    testBtn.textContent = t('step.apikey.test.testing');
    testResult.textContent = '';
    testResult.className = 'test-result';

    try {
      var resp = await fetch(provider.apiUrl, {
        method: 'POST',
        headers: provider.buildHeaders({ apiKey: key }),
        body: JSON.stringify(provider.buildTestBody()),
      });

      if (resp.status === 401 || resp.status === 403) {
        showTestResult('error', t('step.apikey.test.error.auth', { provider: provider.label }));
        return;
      }
      if (resp.status === 429) {
        showTestResult('error', t('step.apikey.test.error.rate'));
        return;
      }
      if (!resp.ok) {
        var errData = await resp.json().catch(function () { return {}; });
        var errMsg = (errData.error && errData.error.message) || '';
        showTestResult('error', t('step.apikey.test.error.unknown') + (errMsg ? ' (' + errMsg + ')' : ''));
        return;
      }

      // Success
      state.testPassed = true;
      showTestResult('success', t('step.apikey.test.success'));
      apiKeyCta.disabled = false;

    } catch (e) {
      // Network error
      showTestResult('error', t('step.apikey.test.error.network', { provider: provider.label }));
    } finally {
      testBtn.disabled = false;
      testBtn.textContent = t('step.apikey.test.button');
    }
  }

  function showTestResult(type, message) {
    var el = $('apikeyTestResult');
    el.textContent = message;
    el.className = 'test-result ' + type;
  }

  function saveApiKey() {
    var key   = $('apikeyInput').value.trim();
    var model = modelSelect ? modelSelect.value : null;
    var cfg   = AXIOM_ASSESSOR_CONFIG.loadConfig();
    cfg.provider = state.selectedProvider;
    if (!cfg.providerConfig) cfg.providerConfig = {};
    cfg.providerConfig[state.selectedProvider] = { apiKey: key };
    if (model) cfg.providerConfig[state.selectedProvider].model = model;
    AXIOM_ASSESSOR_CONFIG.saveConfig(cfg);
  }

  // ── Step 4: Capability Probe ──────────────────────────────────────────────────

  async function onShowProbeStep() {
    var cfg         = AXIOM_ASSESSOR_CONFIG.loadConfig();
    var providerCfg = (cfg.providerConfig || {})[state.selectedProvider] || {};
    var provider    = AXIOM_ASSESSOR_CONFIG.providers[state.selectedProvider];
    var isKnown     = provider && typeof provider.isKnownCompatible === 'function'
                      ? provider.isKnownCompatible(providerCfg)
                      : false;

    resetProbeChecks();

    if (isKnown) {
      await runKnownCompatibleFlow();
    } else {
      await runFullProbe(providerCfg);
    }
  }

  function resetProbeChecks() {
    setCheckStatus('probeCheckConnection', 'running');
    setCheckStatus('probeCheckStructured',  'running');
    setCheckStatus('probeCheckPolish',      'running');
    $('probeFeedback').textContent = '';
    $('probeFeedback').className = 'probe-feedback';
    $('probeCtaBtn').className = 'btn-primary hidden';
    $('probeCtaBtn').textContent = '';
  }

  async function runKnownCompatibleFlow() {
    // Known-compatible model: skip full probe, mark all as skipped
    await delay(400);
    setCheckStatus('probeCheckConnection', 'skip');
    await delay(200);
    setCheckStatus('probeCheckStructured',  'skip');
    await delay(200);
    setCheckStatus('probeCheckPolish',      'skip');

    state.probeResult = 'pass';
    AXIOM_ASSESSOR_CONFIG.saveProbeResult({ status: 'pass', model: getSelectedModel() });
    showProbeCta('pass');
  }

  async function runFullProbe(providerCfg) {
    var provider = AXIOM_ASSESSOR_CONFIG.providers[state.selectedProvider];
    var key      = providerCfg.apiKey;

    // Check 1: Connection (already tested — mark pass)
    await delay(300);
    setCheckStatus('probeCheckConnection', 'pass');

    // Check 2: Structured output
    var structuredPass = false;
    try {
      var resp2 = await fetch(provider.apiUrl, {
        method: 'POST',
        headers: provider.buildHeaders({ apiKey: key }),
        body: JSON.stringify(provider.buildProbeBody('structured')),
      });
      if (resp2.ok) {
        var data2 = await resp2.json();
        var text2 = provider.parseResponse(data2);
        var parsed = JSON.parse(text2.trim());
        structuredPass = (parsed && parsed.status === 'ok' && typeof parsed.echo === 'string');
      }
    } catch (e) {
      structuredPass = false;
    }
    setCheckStatus('probeCheckStructured', structuredPass ? 'pass' : 'warn');
    await delay(300);

    // Check 3: Polish language
    var polishPass = false;
    try {
      var resp3 = await fetch(provider.apiUrl, {
        method: 'POST',
        headers: provider.buildHeaders({ apiKey: key }),
        body: JSON.stringify(provider.buildProbeBody('polish')),
      });
      if (resp3.ok) {
        var data3 = await resp3.json();
        var text3 = provider.parseResponse(data3);
        polishPass = text3.toLowerCase().indexOf('potwierdzam') !== -1;
      }
    } catch (e) {
      polishPass = false;
    }
    setCheckStatus('probeCheckPolish', polishPass ? 'pass' : 'warn');
    await delay(300);

    // Determine overall result
    var overallResult;
    if (structuredPass && polishPass) {
      overallResult = 'pass';
    } else {
      overallResult = 'warn';
      var warnMsgs = [];
      if (!structuredPass) warnMsgs.push(t('step.probe.warn.structured'));
      if (!polishPass)     warnMsgs.push(t('step.probe.warn.polish'));
      $('probeFeedback').innerHTML = warnMsgs.map(function (m) {
        return '<p>' + escHtml(m) + '</p>';
      }).join('');
      $('probeFeedback').className = 'probe-feedback warn';
    }

    state.probeResult = overallResult;
    AXIOM_ASSESSOR_CONFIG.saveProbeResult({ status: overallResult, model: getSelectedModel() });
    showProbeCta(overallResult);
  }

  function getSelectedModel() {
    var cfg = AXIOM_ASSESSOR_CONFIG.loadConfig();
    return ((cfg.providerConfig || {})[state.selectedProvider] || {}).model || '';
  }

  function setCheckStatus(elId, status) {
    var el = $(elId);
    if (!el) return;
    var statusEl = el.querySelector('.check-status');
    if (!statusEl) return;

    var labels = {
      running: t('step.probe.status.running'),
      pass:    t('step.probe.status.pass'),
      skip:    t('step.probe.status.skip'),
      warn:    t('step.probe.status.warn'),
      fail:    t('step.probe.status.fail'),
    };
    var icons = { running: '…', pass: '✓', skip: '✓', warn: '⚠', fail: '✗' };

    statusEl.textContent = icons[status] + ' ' + (labels[status] || status);
    el.className = 'probe-check ' + status;
  }

  function showProbeCta(result) {
    var btn = $('probeCtaBtn');
    btn.classList.remove('hidden');
    if (result === 'pass' || result === 'skip') {
      btn.textContent  = t('step.probe.cta.pass');
      btn.className    = 'btn-primary';
      btn.onclick      = nextStep;
    } else if (result === 'warn') {
      btn.textContent  = t('step.probe.cta.warn');
      btn.className    = 'btn-primary warn';
      btn.onclick      = nextStep;
    } else {
      btn.textContent  = t('step.probe.cta.fail');
      btn.className    = 'btn-secondary';
      btn.onclick      = function () { showStep(3); };
    }
  }

  function delay(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function initStep4() {
    $('btnProbeBack').addEventListener('click', prevStep);
  }

  // ── Step 5: Ready ─────────────────────────────────────────────────────────────

  function onShowReadyStep() {
    var provider = AXIOM_ASSESSOR_CONFIG.providers[state.selectedProvider];
    var cfg      = AXIOM_ASSESSOR_CONFIG.loadConfig();
    var model    = getSelectedModel();
    var modelLabel = '';

    if (provider) {
      var found = (provider.models || []).filter(function (m) { return m.value === model; })[0];
      modelLabel = found ? found.label : model;
    }

    $('readySummaryProvider').textContent = t('step.ready.summary.provider', {
      provider: provider ? provider.label : state.selectedProvider,
    });
    $('readySummaryModel').textContent = t('step.ready.summary.model', {
      model: modelLabel || model,
    });

    var probeLabel = state.probeResult === 'warn'
      ? t('step.ready.probe.warn')
      : t('step.ready.probe.pass');
    $('readySummaryProbe').textContent = t('step.ready.summary.probe', { result: probeLabel });

    AXIOM_ASSESSOR_CONFIG.markOnboardingComplete();
  }

  function initStep5() {
    $('btnReadyCta').addEventListener('click', function () {
      // Navigate to the main aXIOM application
      window.location.href = 'index.html';
    });
  }

  // ── Skip ──────────────────────────────────────────────────────────────────────

  function initSkip() {
    var skipBtn = $('btnSkip');
    if (!skipBtn) return;
    var pendingConfirm = false;

    skipBtn.addEventListener('click', function () {
      if (!pendingConfirm) {
        // First click: change button to confirm state
        pendingConfirm = true;
        skipBtn.textContent = t('nav.skip.confirm');
        skipBtn.style.color = 'var(--warn)';

        // Auto-reset after 4 seconds if no action
        setTimeout(function () {
          if (pendingConfirm) {
            pendingConfirm = false;
            skipBtn.textContent = t('nav.skip');
            skipBtn.style.color = '';
          }
        }, 4000);
      } else {
        // Second click: confirmed — mark complete and launch
        AXIOM_ASSESSOR_CONFIG.markOnboardingComplete();
        window.location.href = 'index.html';
      }
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────────

  async function init() {
    await loadStrings();
    applyTranslations();

    initStepRefs();
    initStep1();
    initStep2();
    initStep3();
    initStep4();
    initStep5();
    initSkip();

    // If already configured, resume from the right point
    if (AXIOM_ASSESSOR_CONFIG.isOnboardingComplete()) {
      window.location.href = 'index.html';
      return;
    }

    showStep(1);
  }

  document.addEventListener('DOMContentLoaded', init);
}());
