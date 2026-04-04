/* ui-controller.js — DOM manipulation and event handling
   Artefact Analyser v1.0 — AI-agnostic refactor
   UTF-8. See REFACTORING_NOTES.md for architecture notes.
*/

(function () {
  'use strict';

  // ── Constants ─────────────────────────────────────────────────────────────────
  var PROXY_FETCH_TIMEOUT_MS = 12000; // ms — CORS proxy fetch timeout

  // ── DOM refs ────────────────────────────────────────────────────────────────
  var $ = function (id) { return document.getElementById(id); };

  var modalOverlay    = $('modalOverlay');
  var providerSelect  = $('providerSelect');
  var providerFields  = $('providerFields');
  var providerNote    = $('providerNote');
  var saveKeyBtn      = $('saveKeyBtn');
  var skipKeyBtn      = $('skipKeyBtn');
  var providerStatus  = $('providerStatus');
  var sourceType      = $('sourceType');
  var idDisplay       = $('idDisplay');
  var hashMethod      = $('hashMethod');
  var charCount       = $('charCount');
  var buildBtn        = $('buildBtn');
  var copyBtn         = $('copyBtn');
  var clearBtn        = $('clearBtn');
  var statusMsg       = $('statusMsg');
  var pasteInput      = $('pasteInput');
  var contentArea     = $('contentArea');
  var promptOut       = $('promptOut');
  var promptLen       = $('promptLen');
  var urlInput        = $('urlInput');
  var fetchBtn        = $('fetchBtn');
  var urlPreview      = $('urlPreview');
  var urlExtracting   = $('urlExtracting');
  var urlMsg          = $('urlMsg');
  var fileInput       = $('fileInput');
  var dropZone        = $('dropZone');
  var fileBadge       = $('fileBadge');
  var fileExtracting  = $('fileExtracting');
  var fileMsg         = $('fileMsg');
  var siRows          = $('siRows');

  // ── State ───────────────────────────────────────────────────────────────────
  var currentID   = '';
  var builtPrompt = '';
  var activeTab   = 'paste';

  // ── Utilities ───────────────────────────────────────────────────────────────
  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function setStatus(msg, type) {
    statusMsg.textContent = msg;
    statusMsg.className = 'status' + (type ? ' ' + type : '');
  }

  // ── Provider modal ──────────────────────────────────────────────────────────

  /**
   * Render provider-specific input fields into #providerFields.
   * Called whenever the provider selector changes.
   */
  function renderProviderFields(providerId) {
    var provider = AXIOM_CONFIG.providers[providerId];
    if (!provider) { providerFields.innerHTML = ''; providerNote.innerHTML = ''; return; }

    var cfg = AXIOM_CONFIG.loadConfig();
    var saved = (cfg.providerConfig || {})[providerId] || {};

    var html = '';
    provider.fields.forEach(function (field) {
      if (field.type === 'select') {
        // Model selector
        var options = (provider.models || []).map(function (m) {
          var sel = (saved[field.id] === m.value) ? ' selected' : '';
          return '<option value="' + escHtml(m.value) + '"' + sel + '>' + escHtml(m.label) + '</option>';
        }).join('');
        html += '<div class="modal-field">'
          + '<label class="modal-label" for="pf_' + field.id + '">' + escHtml(field.label) + '</label>'
          + '<select id="pf_' + field.id + '" data-field="' + field.id + '">' + options + '</select>'
          + '</div>';
      } else {
        var val = escHtml(saved[field.id] || '');
        var placeholder = escHtml(field.placeholder || '');
        html += '<div class="modal-field">'
          + '<label class="modal-label" for="pf_' + field.id + '">' + escHtml(field.label) + '</label>'
          + '<input type="' + field.type + '" id="pf_' + field.id + '" data-field="' + field.id + '"'
          + ' value="' + val + '" placeholder="' + placeholder + '" autocomplete="off" />';
        if (field.note) {
          html += '<div class="modal-note">' + field.note + '</div>';
        }
        html += '</div>';
      }
    });

    providerFields.innerHTML = html;

    // Provider-level note (e.g. link to console)
    var noteMap = {
      anthropic: 'Get your API key at <a href="https://console.anthropic.com" target="_blank" rel="noopener">console.anthropic.com</a>. Your key is never sent anywhere except Anthropic\'s API.',
      openai: 'Get your API key at <a href="https://platform.openai.com" target="_blank" rel="noopener">platform.openai.com</a>. Your key is never sent anywhere except OpenAI\'s API.',
      azure: 'Provide your Azure OpenAI endpoint URL, API key, and deployment name from Azure AI Studio.',
      custom: 'Endpoint must implement the OpenAI-compatible <code>/chat/completions</code> API.',
    };
    providerNote.innerHTML = noteMap[providerId] || '';
  }

  /** Collect current field values from the modal form. */
  function collectModalValues() {
    var values = {};
    providerFields.querySelectorAll('[data-field]').forEach(function (el) {
      values[el.dataset.field] = el.value.trim();
    });
    return values;
  }

  /** Open the provider config modal, pre-populated with saved values. */
  function openModal() {
    var cfg = AXIOM_CONFIG.loadConfig();
    providerSelect.value = cfg.provider || 'anthropic';
    renderProviderFields(cfg.provider || 'anthropic');
    modalOverlay.classList.remove('hidden');
  }

  /** Update the provider status button in the header. */
  function updateProviderStatusBtn() {
    if (AXIOM_CONFIG.isConfigured()) {
      var cfg = AXIOM_CONFIG.loadConfig();
      var provider = AXIOM_CONFIG.providers[cfg.provider];
      providerStatus.textContent = '⚿ ' + (provider ? provider.label : 'Provider') + ' configured';
      providerStatus.className = 'provider-status set';
    } else {
      providerStatus.textContent = '⚿ No provider';
      providerStatus.className = 'provider-status unset';
    }
  }

  // Provider selector change → re-render fields
  providerSelect.addEventListener('change', function () {
    renderProviderFields(providerSelect.value);
  });

  // Save button
  saveKeyBtn.addEventListener('click', function () {
    var selectedProvider = providerSelect.value;
    var provider = AXIOM_CONFIG.providers[selectedProvider];
    if (!provider) { setStatus('Unknown provider selected.', 'error'); return; }

    var fieldValues = collectModalValues();
    var result = provider.validate(fieldValues);
    if (!result.valid) {
      setStatus(result.error, 'error');
      return;
    }

    var cfg = AXIOM_CONFIG.loadConfig();
    cfg.provider = selectedProvider;
    if (!cfg.providerConfig) cfg.providerConfig = {};
    cfg.providerConfig[selectedProvider] = fieldValues;
    AXIOM_CONFIG.saveConfig(cfg);

    modalOverlay.classList.add('hidden');
    updateProviderStatusBtn();
    setStatus('Provider configured and saved.', 'success');
  });

  // Skip button
  skipKeyBtn.addEventListener('click', function () {
    modalOverlay.classList.add('hidden');
    setStatus('Paste mode only — no AI provider configured.', 'warn');
  });

  // Header status button → reopen modal
  providerStatus.addEventListener('click', openModal);

  // Manual button
  document.getElementById('manualBtn').addEventListener('click', downloadManual);

  // ── Tabs ─────────────────────────────────────────────────────────────────────
  document.querySelectorAll('.tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeTab = btn.dataset.tab;
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.tab-pane').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      $('pane-' + activeTab).classList.add('active');
    });
  });

  // ── Source info ──────────────────────────────────────────────────────────────
  function setSI(meta) {
    meta = meta || {};
    siRows.innerHTML = [
      ['title',  meta.title  || '—'],
      ['origin', meta.origin || '—'],
      ['date',   meta.date   || '—'],
      ['source', meta.source || '—'],
    ].map(function (pair) {
      return '<div class="si-row"><span class="si-key">' + pair[0] + '</span>'
        + '<span class="si-val">' + escHtml(pair[1]) + '</span></div>';
    }).join('');
  }

  // ── ID ────────────────────────────────────────────────────────────────────────
  async function updateID(text) {
    if (!text.trim()) {
      idDisplay.textContent = '— no content yet —';
      idDisplay.classList.add('empty');
      buildBtn.disabled = true;
      hashMethod.textContent = '';
      charCount.textContent = '0 chars';
      currentID = '';
      return;
    }
    var type = sourceType.value;
    var date = todayISO();
    var hash = await sha256(type + date + text);
    var h8   = hash.slice(0, 8).toUpperCase();
    currentID = type + '_' + date + '_' + h8;
    idDisplay.textContent = currentID;
    idDisplay.classList.remove('empty');
    hashMethod.textContent = 'SHA-256( type+' + date + '+content ) → ' + h8;
    charCount.textContent  = text.length.toLocaleString() + ' chars';
    buildBtn.disabled = false;
    builtPrompt = '';
    copyBtn.disabled = true;
    promptOut.value = '';
    promptLen.textContent = '—';
  }

  // ── Paste tab ─────────────────────────────────────────────────────────────────
  pasteInput.addEventListener('input', async function () {
    var t = pasteInput.value;
    contentArea.value = t;
    await updateID(t);
    setSI({ title: '(pasted)', source: 'paste' });
  });

  // ── Content area edit re-hashes ───────────────────────────────────────────────
  contentArea.addEventListener('input', async function () {
    if (activeTab !== 'paste') await updateID(contentArea.value);
  });

  sourceType.addEventListener('change', async function () {
    if (contentArea.value.trim()) await updateID(contentArea.value);
  });

  // ── URL fetch ─────────────────────────────────────────────────────────────────
  fetchBtn.addEventListener('click', async function () {
    var url = urlInput.value.trim();
    if (!url) { setStatus('Enter a URL first.', 'error'); return; }
    if (!AXIOM_CONFIG.isConfigured()) {
      setStatus('AI provider required for URL fetch — click ⚿ to configure.', 'error');
      return;
    }

    fetchBtn.disabled = true;
    urlPreview.style.display = 'none';
    urlExtracting.classList.add('visible');
    setStatus('', '');

    try {
      urlMsg.textContent = 'Fetching page via proxy…';
      var rawText = '';
      try {
        var proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
        var res = await fetch(proxyUrl, { signal: AbortSignal.timeout(PROXY_FETCH_TIMEOUT_MS) });
        var html = await res.text();
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        ['script', 'style', 'nav', 'header', 'footer', 'aside', 'noscript'].forEach(function (tag) {
          tmp.querySelectorAll(tag).forEach(function (el) { el.remove(); });
        });
        rawText = (tmp.innerText || tmp.textContent || '').replace(/\s{3,}/g, '\n\n').trim();
      } catch (fetchErr) {
        rawText = '';
      }

      urlMsg.textContent = 'Extracting relevant content with AI…';

      var extracted, meta = {};
      if (rawText.length > 200) {
        extracted = await callAI(
          'You are an artefact extraction assistant. Given raw webpage text, extract analytically relevant content.\n'
          + 'Respond ONLY in this exact format with no markdown fences:\n'
          + 'JSON:\n{"title":"...","origin":"...","date":"...","language":"..."}\nCONTENT:\n'
          + '[main article/document text, arguments, claims — omit nav, ads, footers, cookie notices]',
          [{ type: 'text', text: 'URL: ' + url + '\n\nPAGE TEXT (truncated to 8000 chars):\n' + rawText.slice(0, 8000) }]
        );
      } else {
        extracted = await callAI(
          'You are an artefact extraction assistant. The user wants to analyse content at the given URL.\n'
          + 'Use your knowledge or web search capabilities to retrieve and summarise the content at that URL.\n'
          + 'Respond ONLY in this exact format with no markdown fences:\n'
          + 'JSON:\n{"title":"...","origin":"...","date":"...","language":"..."}\nCONTENT:\n'
          + '[main article/document text, arguments, key claims — as complete as possible]\n'
          + 'NOTE:\n[brief note on how content was retrieved and any limitations]',
          [{ type: 'text', text: 'Please retrieve and extract the analytically relevant content from: ' + url }]
        );
      }

      var jMatch = extracted.match(/JSON:\s*\n([\s\S]*?)\nCONTENT:/);
      var cMatch = extracted.match(/CONTENT:\s*\n([\s\S]*?)(?:\nNOTE:|$)/);
      var nMatch = extracted.match(/NOTE:\s*\n([\s\S]*)/);
      try { if (jMatch) meta = JSON.parse(jMatch[1].trim()); } catch (e) {}
      var content = cMatch ? cMatch[1].trim() : extracted;
      var note    = nMatch ? '\n\n[Extraction note: ' + nMatch[1].trim() + ']' : '';

      urlPreview.value  = content + note;
      contentArea.value = content + note;
      setSI({ title: meta.title || '', origin: meta.origin || '', date: meta.date || '', source: url });
      await updateID(content + note);
      setStatus('Extracted.', 'success');

    } catch (err) {
      setStatus(err.message, 'error');
    } finally {
      urlExtracting.classList.remove('visible');
      urlPreview.style.display = '';
      fetchBtn.disabled = false;
    }
  });

  // ── File upload ───────────────────────────────────────────────────────────────
  dropZone.addEventListener('click', function () { fileInput.click(); });
  dropZone.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', function () {
    dropZone.classList.remove('drag-over');
  });
  dropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function () {
    if (fileInput.files[0]) processFile(fileInput.files[0]);
  });

  async function processFile(file) {
    var ext = file.name.split('.').pop().toLowerCase();
    var allowed = ['pdf', 'docx', 'txt', 'jpg', 'jpeg', 'png'];
    if (!allowed.includes(ext)) { setStatus('Unsupported file type.', 'error'); return; }
    if (ext !== 'txt' && !AXIOM_CONFIG.isConfigured()) {
      setStatus('AI provider required for file extraction — click ⚿ to configure.', 'error');
      return;
    }

    fileBadge.textContent = file.name + ' (' + (file.size / 1024).toFixed(0) + ' KB)';
    dropZone.style.display = 'none';
    fileExtracting.classList.add('visible');
    setStatus('', '');

    try {
      var content = '';
      var meta = { title: file.name, origin: '', date: '', source: file.name };

      if (ext === 'txt') {
        fileMsg.textContent = 'Reading text file…';
        content = await file.text();

      } else if (['jpg', 'jpeg', 'png'].includes(ext)) {
        fileMsg.textContent = 'Extracting image content with AI (OCR)…';
        var imgB64 = await toB64(file);
        var imgMt  = ext === 'png' ? 'image/png' : 'image/jpeg';
        content = await callAI(
          'Extract all text visible in this image via OCR. Then briefly describe any non-text visual elements that would be analytically relevant (layout, charts, design, symbols).\nFormat:\nTEXT CONTENT:\n[all visible text, preserving structure]\nVISUAL DESCRIPTION:\n[description of non-text elements]',
          [
            { type: 'image', source: { type: 'base64', media_type: imgMt, data: imgB64 } },
            { type: 'text', text: 'Extract and describe this image for research analysis.' },
          ]
        );

      } else if (ext === 'pdf') {
        fileMsg.textContent = 'Extracting PDF content with AI…';
        var pdfB64 = await toB64(file);
        var rawPdf = await callAI(
          'Extract the analytically relevant content from this PDF document.\n'
          + 'Respond ONLY in this exact format with no markdown fences:\n'
          + 'JSON:\n{"title":"...","origin":"...","date":"...","language":"..."}\nCONTENT:\n'
          + '[main text, arguments, key claims — preserve structure where analytically significant]',
          [
            { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdfB64 } },
            { type: 'text', text: 'Extract content for research analysis.' },
          ]
        );
        var jMp = rawPdf.match(/JSON:\s*\n([\s\S]*?)\nCONTENT:/);
        var cMp = rawPdf.match(/CONTENT:\s*\n([\s\S]*)/);
        try { if (jMp) { var mp = JSON.parse(jMp[1].trim()); meta = Object.assign(meta, mp); } } catch (e) {}
        content = cMp ? cMp[1].trim() : rawPdf;

      } else if (ext === 'docx') {
        fileMsg.textContent = 'Extracting DOCX content with AI…';
        var docxB64 = await toB64(file);
        var docxMt  = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        var rawDocx = await callAI(
          'Extract the analytically relevant content from this Word document.\n'
          + 'Respond ONLY in this exact format with no markdown fences:\n'
          + 'JSON:\n{"title":"...","origin":"...","date":"...","language":"..."}\nCONTENT:\n'
          + '[main text, arguments, key claims]',
          [
            { type: 'document', source: { type: 'base64', media_type: docxMt, data: docxB64 } },
            { type: 'text', text: 'Extract content for research analysis.' },
          ]
        );
        var jMd = rawDocx.match(/JSON:\s*\n([\s\S]*?)\nCONTENT:/);
        var cMd = rawDocx.match(/CONTENT:\s*\n([\s\S]*)/);
        try { if (jMd) { var md = JSON.parse(jMd[1].trim()); meta = Object.assign(meta, md); } } catch (e) {}
        content = cMd ? cMd[1].trim() : rawDocx;
      }

      contentArea.value = content;
      setSI(meta);
      await updateID(content);
      setStatus('Extracted.', 'success');

    } catch (err) {
      setStatus(err.message, 'error');
    } finally {
      fileExtracting.classList.remove('visible');
      dropZone.style.display = 'flex';
    }
  }

  // ── Build prompt ──────────────────────────────────────────────────────────────
  buildBtn.addEventListener('click', function () {
    var text = contentArea.value.trim();
    if (!text || !currentID) return;
    var val = sourceType.value;
    builtPrompt = PROMPT_TEMPLATE
      .replace(/\{\{ARTEFACT_ID\}\}/g,       currentID)
      .replace(/\{\{GENERATED_AT\}\}/g,      nowUTC())
      .replace(/\{\{ZOTERO_ITEM_TYPE\}\}/g,  stZ(val))
      .replace(/\{\{TYPE_TAG\}\}/g,          stT(val))
      .replace(/\{\{ARTEFACT_CONTENT\}\}/g,  text);
    promptOut.value = builtPrompt;
    promptLen.textContent = builtPrompt.length.toLocaleString() + ' chars';
    copyBtn.disabled = false;
    setStatus('Prompt assembled.', 'success');
  });

  // ── Copy ──────────────────────────────────────────────────────────────────────
  copyBtn.addEventListener('click', async function () {
    if (!builtPrompt) return;
    try {
      await navigator.clipboard.writeText(builtPrompt);
      setStatus('Copied to clipboard.', 'success');
    } catch (e) {
      setStatus('Copy failed — select all in right panel and copy manually.', 'error');
    }
  });

  // ── Clear ─────────────────────────────────────────────────────────────────────
  clearBtn.addEventListener('click', function () {
    pasteInput.value = '';
    urlInput.value = '';
    urlPreview.value = '';
    contentArea.value = '';
    promptOut.value = '';
    fileBadge.textContent = '';
    idDisplay.textContent = '— no content yet —';
    idDisplay.classList.add('empty');
    hashMethod.textContent = '';
    charCount.textContent = '0 chars';
    promptLen.textContent = '—';
    currentID = ''; builtPrompt = '';
    buildBtn.disabled = true; copyBtn.disabled = true;
    setSI({});
    setStatus('', '');
  });

  // ── toB64 helper ──────────────────────────────────────────────────────────────
  function toB64(file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(r.result.split(',')[1]); };
      r.onerror = function () { reject(new Error('File read failed')); };
      r.readAsDataURL(file);
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────────
  // Expose openModal so main.js can call it on page load
  window.AXIOM_UI = {
    openModal: openModal,
    updateProviderStatusBtn: updateProviderStatusBtn,
    setSI: setSI,
    setStatus: setStatus,
  };
}());
