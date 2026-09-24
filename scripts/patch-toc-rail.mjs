/**
 * Replace sticky TOC with a fixed collapsible icon rail on deep pages.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = ['work.html', 'projects.html', 'metrics.html', 'index.html'];

const NEW_CSS = `    /* ── TOC rail (fixed, collapsible) ── */
    .page-shell { display: block; }
    .page-toc-mobile { display: none !important; }

    .toc-rail {
      position: fixed;
      top: 64px;
      left: 0;
      bottom: 0;
      z-index: 60;
      width: 56px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 10px 8px 16px;
      background: var(--surface);
      border-right: 1px solid var(--border);
      transition: width 0.2s ease;
      overflow: hidden;
    }
    .toc-rail.is-open { width: 220px; }

    body.has-toc .wrapper,
    body.has-toc .page-shell > .wrapper {
      padding-left: 72px;
      transition: padding-left 0.2s ease;
    }
    body.has-toc.toc-open .wrapper,
    body.has-toc.toc-open .page-shell > .wrapper {
      padding-left: 236px;
    }
    @media (max-width: 720px) {
      body.has-toc .wrapper,
      body.has-toc .page-shell > .wrapper { padding-left: 64px; }
      body.has-toc.toc-open .wrapper,
      body.has-toc.toc-open .page-shell > .wrapper { padding-left: 16px; }
      .toc-rail.is-open {
        width: min(240px, 78vw);
        box-shadow: 12px 0 40px rgba(0,0,0,0.28);
      }
    }

    .toc-rail-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      height: 40px;
      margin-bottom: 8px;
      padding: 0 10px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--surface2);
      color: var(--text-2);
      cursor: pointer;
      flex-shrink: 0;
    }
    .toc-rail.is-open .toc-rail-toggle { justify-content: flex-start; }
    .toc-rail-toggle:hover { border-color: var(--accent); color: var(--accent); }
    .toc-rail-toggle svg { width: 18px; height: 18px; flex-shrink: 0; }
    .toc-rail-toggle-label {
      display: none;
      font-size: 0.72rem;
      font-family: var(--mono);
      white-space: nowrap;
    }
    .toc-rail.is-open .toc-rail-toggle-label { display: inline; }

    .toc-rail-nav { flex: 1; overflow: auto; min-height: 0; }
    .toc-rail ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
    .toc-rail a {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 40px;
      padding: 0 10px;
      border-radius: 10px;
      color: var(--text-3);
      text-decoration: none;
      border: 1px solid transparent;
    }
    .toc-rail a:hover {
      color: var(--text);
      background: var(--surface2);
      border-color: var(--border);
    }
    .toc-rail a.is-active {
      color: var(--accent);
      background: rgba(108,140,255,0.1);
      border-color: rgba(108,140,255,0.28);
    }
    .toc-rail-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      display: grid;
      place-items: center;
    }
    .toc-rail-icon svg { width: 18px; height: 18px; }
    .toc-rail-text {
      display: none;
      font-size: 0.78rem;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .toc-rail.is-open .toc-rail-text { display: block; }

    .page-banner {
      padding: 100px 0 28px;
    }
    .page-banner h1 {
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      margin: 8px 0 10px;
      letter-spacing: -0.02em;
    }
    .page-banner p {
      margin: 0;
      max-width: 52ch;
      color: var(--text-2);
      font-size: 0.95rem;
      line-height: 1.55;
    }
    .hub-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-top: 8px;
    }
    @media (max-width: 720px) {
      .hub-grid { grid-template-columns: 1fr; }
    }
    .hub-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 22px 22px 20px;
      border-radius: 14px;
      border: 1px solid var(--border);
      background: var(--surface);
      text-decoration: none;
      color: inherit;
      transition: border-color var(--transition), transform var(--transition), box-shadow var(--transition);
      min-height: 140px;
    }
    .hub-card:hover {
      border-color: var(--accent);
      transform: translateY(-2px);
      box-shadow: 0 12px 36px var(--glow);
    }
    .hub-card-kicker {
      font-size: 0.68rem;
      font-family: var(--mono);
      color: var(--accent);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .hub-card h3 {
      margin: 0;
      font-size: 1.05rem;
      color: var(--text);
    }
    .hub-card p {
      margin: 0;
      flex: 1;
      font-size: 0.84rem;
      line-height: 1.55;
      color: var(--text-2);
    }
    .hub-card-cta {
      font-size: 0.78rem;
      font-family: var(--mono);
      color: var(--accent);
    }
`;

const NEW_ASIDE = `    <aside class="toc-rail" id="toc-rail" aria-label="Table of contents">
      <button type="button" class="toc-rail-toggle" id="toc-rail-toggle" aria-expanded="false" aria-controls="page-toc-list" title="Toggle menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <line x1="4" y1="7" x2="20" y2="7"/>
          <line x1="4" y1="12" x2="20" y2="12"/>
          <line x1="4" y1="17" x2="20" y2="17"/>
        </svg>
        <span class="toc-rail-toggle-label" data-i18n="toc.label">On this page</span>
      </button>
      <nav class="toc-rail-nav">
        <ul id="page-toc-list"></ul>
      </nav>
    </aside>
`;

const NEW_JS = `
  <script>
    (function initPageToc() {
      const root = document.querySelector('.wrapper');
      const tocList = document.getElementById('page-toc-list');
      const rail = document.getElementById('toc-rail');
      const toggle = document.getElementById('toc-rail-toggle');
      if (!root || !tocList || !rail) return;

      const ICONS = {
        top: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
        experience: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
        recommendations: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>',
        achievements: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 6h2a3 3 0 0 1 0 6h-2"/><path d="M7 6H5a3 3 0 0 0 0 6h2"/></svg>',
        projects: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
        opensource: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/></svg>',
        metrics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 17V9"/><path d="M12 17v-5"/><path d="M16 17V7"/></svg>',
        severity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 16H3L12 3z"/><path d="M12 9v5"/><path d="M12 17h.01"/></svg>',
        priority: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v18"/><path d="M5 5h11l-2 3 2 3H5"/></svg>',
      };
      const FALLBACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/></svg>';

      const sectionItems = [...root.querySelectorAll('section.section[id]')].map((sec) => {
        const label = sec.querySelector('.section-label, .section-title');
        const text = (label?.textContent || sec.id).trim().replace(/\\s+/g, ' ');
        return { id: sec.id, text };
      });

      tocList.innerHTML = sectionItems.map(({ id, text }) => {
        const icon = ICONS[id] || FALLBACK;
        return \`<li><a href="#\${id}" title="\${text.replace(/"/g, '&quot;')}"><span class="toc-rail-icon" aria-hidden="true">\${icon}</span><span class="toc-rail-text">\${text}</span></a></li>\`;
      }).join('');

      const links = [...tocList.querySelectorAll('a')];
      const map = new Map(sectionItems.map((it) => [it.id, document.getElementById(it.id)]).filter(([, el]) => el));

      function setActive(id) {
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
      }

      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      }, { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] });
      map.forEach((el) => observer.observe(el));

      const KEY = 'portfolio-toc-open';
      function applyOpen(open) {
        rail.classList.toggle('is-open', open);
        document.body.classList.toggle('toc-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        try { localStorage.setItem(KEY, open ? '1' : '0'); } catch (_) {}
      }

      const saved = (() => { try { return localStorage.getItem(KEY); } catch (_) { return null; } })();
      applyOpen(saved === '1');

      toggle.addEventListener('click', () => applyOpen(!rail.classList.contains('is-open')));

      // On small screens, auto-collapse after navigating
      links.forEach((a) => a.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 720px)').matches) applyOpen(false);
      }));
    })();
  </script>
`;

const OLD_CSS_RE = /    \/\* ── Page TOC \(deep pages\) ── \*\/[\s\S]*?\.hub-card-cta \{\n      font-size: 0\.78rem;\n      font-family: var\(--mono\);\n      color: var\(--accent\);\n    }\n/;

const OLD_ASIDE_RE = /    <aside class="page-toc"[\s\S]*?<div class="page-toc-mobile">[\s\S]*?<\/div>\n\n/;

const OLD_JS_RE = /\n  <script>\n    \(function initPageToc\(\) \{[\s\S]*?\}\)\(\);\n  <\/script>\n/;

for (const file of files) {
  const fp = path.join(root, file);
  let s = fs.readFileSync(fp, 'utf8');
  if (!OLD_CSS_RE.test(s)) {
    console.warn('CSS block miss', file);
  } else {
    s = s.replace(OLD_CSS_RE, NEW_CSS);
  }

  if (file !== 'index.html') {
    if (!OLD_ASIDE_RE.test(s)) console.warn('aside miss', file);
    else s = s.replace(OLD_ASIDE_RE, NEW_ASIDE + '\n');

    // Drop page-shell grid wrapper complexity: keep page-shell but content flow is fine
    if (!OLD_JS_RE.test(s)) console.warn('js miss', file);
    else s = s.replace(OLD_JS_RE, NEW_JS);
  }

  fs.writeFileSync(fp, s);
  console.log('updated', file);
}
