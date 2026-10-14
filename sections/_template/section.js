/* =====================================================================
   Ameristar section: _template
   ---------------------------------------------------------------------
   Copy this folder to /sections/<your-name>/ and change NAME below.

   Content resolution (the "hybrid" rule):
     1. If the host <div> has data-content="<url>", fetch that JSON.
        This is the live/AEM mode — the JSON lives in the DAM.
     2. Otherwise fetch ./content.json next to this script.
        This is the design-time mode — copy lives in the repo.

   Constraints (do not break these — they are what keep this embeddable):
     - Vanilla JS, no build step, no framework.
     - All CSS scoped under .ams-<NAME>. No global selectors.
     - No font loading here. The AEM page already has Open Sans / Archivo.
     - Escape every string that comes from content.json (see esc()).
   ===================================================================== */
(function () {
  'use strict';

  var NAME = '_template';            // <-- must match the folder name
  var ROOT = '.ams-' + NAME;

  // ------------------------------------------------------------------
  // CSS — scoped to the section root. Uses OneCMS theme tokens.
  // ------------------------------------------------------------------
  var CSS = [
    ROOT + '{',
    '  --ams-action:#006495; --ams-active:#034b70; --ams-accent:#00a0d0;',
    '  --ams-ink:#1d1d1d; --ams-muted:#5a5a5a; --ams-line:#e3e3e3; --ams-bg:#fff;',
    '  font-family:"Open Sans",system-ui,sans-serif; color:var(--ams-ink);',
    '  box-sizing:border-box; margin:0 auto; max-width:1200px; padding:40px 16px;',
    '}',
    ROOT + ' *{box-sizing:inherit}',
    ROOT + ' .ams-h2{font-family:"Archivo","Open Sans",sans-serif;font-weight:700;',
    '  font-size:clamp(1.5rem,3vw,2rem);line-height:1.15;margin:0 0 12px;color:var(--ams-active)}',
    ROOT + ' .ams-body{font-size:1.0625rem;line-height:1.6;color:var(--ams-muted);margin:0;max-width:65ch}'
  ].join('\n');

  // ------------------------------------------------------------------
  // Render — pure function of (root, data). Called by the loader AND by
  // the editor (live preview), so keep it side-effect free.
  // ------------------------------------------------------------------
  function render(root, data) {
    data = data || {};
    root.innerHTML =
      '<h2 class="ams-h2">' + esc(data.headline) + '</h2>' +
      '<p class="ams-body">' + esc(data.body) + '</p>';
  }

  // ------------------------------------------------------------------
  // Shared plumbing below. You normally don't need to edit this.
  // ------------------------------------------------------------------
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function ensureCss() {
    var id = 'ams-css-' + NAME;
    if (document.getElementById(id)) return;
    var s = document.createElement('style');
    s.id = id;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  var SCRIPT_BASE = (function () {
    var s = document.currentScript;
    return s && s.src ? s.src.replace(/[^\/]*$/, '') : './';
  })();

  function mount(root) {
    ensureCss();
    root.classList.add('ams-section', 'ams-' + NAME);
    var url = root.getAttribute('data-content') || (SCRIPT_BASE + 'content.json');
    return fetch(url, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status + ' ' + url); return r.json(); })
      .then(function (data) { render(root, data); root.setAttribute('data-ams-source', url); })
      .catch(function (err) {
        root.innerHTML = '';
        if (window.console) console.warn('[ams:' + NAME + '] content failed:', err);
      });
  }

  function boot() {
    var nodes = document.querySelectorAll('[data-ameristar-section="' + NAME + '"]:not([data-ams-mounted])');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute('data-ams-mounted', '1');
      mount(nodes[i]);
    }
  }

  window.AmeristarSections = window.AmeristarSections || {};
  window.AmeristarSections[NAME] = { render: render, mount: mount, ensureCss: ensureCss };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
