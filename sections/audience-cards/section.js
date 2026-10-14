/* =====================================================================
   Ameristar section: audience-cards
   Four-path audience router (homeowner / contractor / architect / distributor).

   Content: data-content="<DAM json url>" on the host div, else ./content.json.
   Vanilla JS, no build step, CSS scoped to .ams-audience-cards.
   ===================================================================== */
(function () {
  'use strict';

  var NAME = 'audience-cards';
  var ROOT = '.ams-' + NAME;

  var CSS = [
    ROOT + '{',
    '  --ams-action:#006495; --ams-active:#034b70; --ams-accent:#00a0d0;',
    '  --ams-ink:#1d1d1d; --ams-muted:#5a5a5a; --ams-line:#dfe3e6; --ams-bg:#fff; --ams-tint:#f3f7f9;',
    '  font-family:"Open Sans",system-ui,sans-serif; color:var(--ams-ink);',
    '  box-sizing:border-box; margin:0 auto; max-width:1200px; padding:32px 16px;',
    '}',
    ROOT + ' *{box-sizing:inherit}',
    ROOT + ' .ams-head{max-width:72ch;margin:0 0 22px}',
    ROOT + ' .ams-eyebrow{display:inline-block;font-size:.75rem;font-weight:600;letter-spacing:.12em;',
    '  text-transform:uppercase;color:var(--ams-action);margin:0 0 10px}',
    ROOT + ' .ams-h2{font-family:"Archivo","Open Sans",sans-serif;font-weight:700;',
    '  font-size:clamp(1.6rem,3.2vw,2.25rem);line-height:1.12;margin:0 0 12px;color:var(--ams-active)}',
    ROOT + ' .ams-intro{font-size:1.0625rem;line-height:1.6;color:var(--ams-muted);margin:0}',
    ROOT + ' .ams-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;list-style:none;margin:0;padding:0}',
    ROOT + ' .ams-card{position:relative;display:flex;flex-direction:column;min-height:100%;',
    '  background:var(--ams-bg);border:1px solid var(--ams-line);border-radius:6px;padding:26px 22px 22px;',
    '  text-decoration:none;color:inherit;transition:border-color .18s,box-shadow .18s,transform .18s}',
    ROOT + ' .ams-card::before{content:"";position:absolute;left:0;right:0;top:0;height:4px;',
    '  background:var(--ams-accent);border-radius:6px 6px 0 0;opacity:0;transition:opacity .18s}',
    ROOT + ' .ams-card:hover,' + ROOT + ' .ams-card:focus-visible{border-color:var(--ams-action);',
    '  box-shadow:0 10px 28px rgba(3,75,112,.12);transform:translateY(-2px);outline:none}',
    ROOT + ' .ams-card:hover::before,' + ROOT + ' .ams-card:focus-visible::before{opacity:1}',
    ROOT + ' .ams-card:focus-visible{box-shadow:0 0 0 3px rgba(0,160,208,.45)}',
    ROOT + ' .ams-icon{width:44px;height:44px;border-radius:50%;background:var(--ams-tint);',
    '  display:grid;place-items:center;margin:0 0 16px;color:var(--ams-action)}',
    ROOT + ' .ams-icon svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
    ROOT + ' .ams-h3{font-family:"Archivo","Open Sans",sans-serif;font-weight:700;font-size:1.2rem;line-height:1.2;margin:0 0 8px;color:var(--ams-active)}',
    ROOT + ' .ams-text{font-size:.95rem;line-height:1.55;color:var(--ams-muted);margin:0 0 18px;flex:1}',
    ROOT + ' .ams-cta{display:inline-flex;align-items:center;gap:6px;font-weight:600;font-size:.95rem;color:var(--ams-action)}',
    ROOT + ' .ams-cta svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .18s}',
    ROOT + ' .ams-card:hover .ams-cta svg{transform:translateX(3px)}',
    /* Fixed-frame contract: below 980px the cards swipe sideways instead of stacking,
       so the section height stays ~constant and the AEM iframe never needs to grow. */
    '@media (max-width:980px){',
    ROOT + ' .ams-grid{display:flex;gap:14px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;',
    '  -webkit-overflow-scrolling:touch;scrollbar-width:none;padding:2px 2px 6px;margin:0 -16px;padding-left:16px;padding-right:16px}',
    ROOT + ' .ams-grid::-webkit-scrollbar{display:none}',
    ROOT + ' .ams-grid>li{flex:0 0 min(300px,78vw);scroll-snap-align:start}',
    ROOT + ' .ams-card:hover,' + ROOT + ' .ams-card:focus-visible{transform:none}',
    ROOT + ' .ams-intro{font-size:1rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}',
    '}',
    '@media (max-width:560px){' + ROOT + '{padding:24px 16px}' + ROOT + ' .ams-head{margin-bottom:16px}' + ROOT + ' .ams-text{font-size:.9rem}}',
    '@media (prefers-reduced-motion:reduce){' + ROOT + ' .ams-card,' + ROOT + ' .ams-cta svg{transition:none}}'
  ].join('\n');

  var ICONS = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg>',
    hammer: '<svg viewBox="0 0 24 24"><path d="m14 7 3-3 4 4-3 3"/><path d="M12.5 8.5 4 17l3 3 8.5-8.5"/><path d="m14 7 3 3"/></svg>',
    blueprint: '<svg viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M3.5 9.5h17M8.5 9.5v10M12 13.5h5M12 16.5h5"/></svg>',
    truck: '<svg viewBox="0 0 24 24"><path d="M3 6.5h11v9H3zM14 10h4l3 3v2.5h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3.5 5 6.5v5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9v-5z"/><path d="m9 12 2 2 4-4"/></svg>'
  };
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function render(root, data) {
    data = data || {};
    var cards = Array.isArray(data.cards) ? data.cards : [];
    var html = '';

    if (data.eyebrow || data.headline || data.intro) {
      html += '<div class="ams-head">';
      if (data.eyebrow)  html += '<p class="ams-eyebrow">' + esc(data.eyebrow) + '</p>';
      if (data.headline) html += '<h2 class="ams-h2">' + esc(data.headline) + '</h2>';
      if (data.intro)    html += '<p class="ams-intro">' + esc(data.intro) + '</p>';
      html += '</div>';
    }

    html += '<ul class="ams-grid">';
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i] || {};
      var icon = ICONS[c.icon] || '';
      html += '<li>' +
        '<a class="ams-card" href="' + esc(c.href || '#') + '">' +
          (icon ? '<span class="ams-icon" aria-hidden="true">' + icon + '</span>' : '') +
          '<h3 class="ams-h3">' + esc(c.title) + '</h3>' +
          '<p class="ams-text">' + esc(c.body) + '</p>' +
          '<span class="ams-cta">' + esc(c.cta || 'Learn more') + ARROW + '</span>' +
        '</a>' +
      '</li>';
    }
    html += '</ul>';

    root.innerHTML = html;
  }

  // ---- shared plumbing ------------------------------------------------
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function ensureCss() {
    var id = 'ams-css-' + NAME;
    if (document.getElementById(id)) return;
    var s = document.createElement('style'); s.id = id; s.textContent = CSS;
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
      .catch(function (err) { root.innerHTML = ''; if (window.console) console.warn('[ams:' + NAME + '] content failed:', err); });
  }
  function boot() {
    var nodes = document.querySelectorAll('[data-ameristar-section="' + NAME + '"]:not([data-ams-mounted])');
    for (var i = 0; i < nodes.length; i++) { nodes[i].setAttribute('data-ams-mounted', '1'); mount(nodes[i]); }
  }
  window.AmeristarSections = window.AmeristarSections || {};
  window.AmeristarSections[NAME] = { render: render, mount: mount, ensureCss: ensureCss };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
