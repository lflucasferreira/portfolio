/**
 * Normalize growth.html: shared site-nav + collapsible TOC rail + section ids.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const fp = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'growth.html');
let s = fs.readFileSync(fp, 'utf8');

const SITE_NAV_CSS = `
    /* ── Site nav (shared hub pattern) ── */
    .site-nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      height: 60px;
      background: color-mix(in srgb, var(--bg) 85%, transparent);
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(24px) saturate(1.4);
      -webkit-backdrop-filter: blur(24px) saturate(1.4);
    }
    .nav-logo {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text);
      letter-spacing: -0.02em;
      text-decoration: none;
    }
    a.nav-logo:hover { color: var(--text); }
    .nav-logo span { color: var(--accent); }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 2px;
      list-style: none;
    }
    .nav-links a {
      display: block;
      padding: 6px 14px;
      font-size: 0.82rem;
      font-weight: 500;
      color: var(--text-2);
      border-radius: 6px;
      transition: color var(--transition), background var(--transition);
    }
    .nav-links a:hover,
    .nav-links a.is-current {
      color: var(--text);
      background: var(--surface2);
    }
    .nav-links a.is-current { color: var(--accent); }
    .nav-right { display: flex; align-items: center; gap: 8px; }
    @media (max-width: 768px) {
      .site-nav { padding: 0 16px; }
      .nav-links { display: none; }
    }

    /* ── TOC rail ── */
    .page-shell { display: block; }
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
    body.has-toc .wrapper {
      padding-left: 72px;
      transition: padding-left 0.2s ease;
    }
    body.has-toc.toc-open .wrapper { padding-left: 236px; }
    @media (max-width: 720px) {
      body.has-toc .wrapper { padding-left: 64px; }
      body.has-toc.toc-open .wrapper { padding-left: 16px; }
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
      width: 20px; height: 20px; flex-shrink: 0;
      display: grid; place-items: center;
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
      max-width: 860px;
      margin: 0 auto;
      padding: 88px 0 40px;
    }
    .page-banner h1 {
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--text);
      margin: 0 0 16px;
    }
    .page-banner p {
      margin: 0;
      color: var(--text-2);
      font-size: 1rem;
      max-width: 600px;
      line-height: 1.75;
    }
    .page-banner p strong { color: var(--text); }
    .wrapper {
      position: relative;
      z-index: 1;
      max-width: 860px;
      margin: 0 auto;
      padding: 0 24px 100px;
    }
`;

// Replace old nav + page-hero CSS blocks with site nav + keep main/section tweaks
s = s.replace(
  /    \/\* ── Nav ── \*\/\n    nav \{[\s\S]*?\.lang-btn:hover \{ background: var\(--surface2\); color: var\(--text\); \}\n\n    \/\* ── Page hero ── \*\/\n    \.page-hero \{[\s\S]*?\.page-hero p strong \{ color: var\(--text\); \}\n\n    \/\* ── Main ── \*\/\n    main \{ max-width: 860px; margin: 0 auto; padding: 0 24px 100px; \}\n\n    \.section \{ margin-bottom: 80px; \}/,
  SITE_NAV_CSS + `\n    /* ── Sections ── */\n    .section { margin-bottom: 80px; }`
);

if (!s.includes('.site-nav')) {
  console.error('Failed to inject site-nav CSS');
  process.exit(1);
}

// body class
s = s.replace('<body>', '<body class="has-toc">');

const NAV_HTML = `  <!-- ── Nav ── -->
  <nav class="site-nav">
    <a class="nav-logo" href="index.html">Lucas<span> Ferreira</span></a>
    <ul class="nav-links">
      <li><a href="index.html" data-i18n="nav.home">Home</a></li>
      <li><a href="work.html" data-i18n="nav.work">Work</a></li>
      <li><a href="projects.html" data-i18n="nav.projects">Projects</a></li>
      <li><a href="metrics.html" data-i18n="nav.metrics">Metrics</a></li>
      <li><a href="growth.html" class="is-current" data-i18n="nav.growth">Growth</a></li>
      <li><a href="index.html#contact" data-i18n="nav.contact">Contact</a></li>
    </ul>
    <div class="nav-right">
      <button id="lang-btn" class="lang-btn" onclick="toggleLang()" aria-label="Toggle language"><svg viewBox="0 0 28 20" style="height:1em;width:auto;vertical-align:-0.15em;border-radius:2px" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="20" fill="#009b3a"/><path d="M14 2.4 26 10 14 17.6 2 10Z" fill="#ffdf00"/><circle cx="14" cy="10" r="4.3" fill="#002776"/><path d="M10.1 9.1C12.6 8 15.4 8 17.9 10.1" stroke="#fff" stroke-width="0.8" fill="none"/></svg> PT</button>
      <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
        <span class="icon-sun">☀️</span>
        <span class="icon-moon">🌙</span>
      </button>
    </div>
  </nav>
`;

s = s.replace(/  <!-- ── Nav ── -->\n  <nav>[\s\S]*?<\/nav>\n/, NAV_HTML);

const SHELL_OPEN = `  <div class="page-shell">
    <aside class="toc-rail" id="toc-rail" aria-label="Table of contents">
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

  <div class="wrapper">

    <section class="page-banner" id="top">
      <h1 data-i18n="hero.h1">4 years of growth<br/>and what colleagues say</h1>
      <p data-i18n="hero.desc">
        This page consolidates feedback, strengths, and what I'm actively working on, drawn from
        <strong>2022 to 2025</strong> of peer and leadership input. I share it because I believe
        self-awareness and transparency are core to good engineering — and to good QA.
      </p>
    </section>

`;

s = s.replace(
  /  <!-- ── Page hero ── -->\n  <div class="page-hero">[\s\S]*?<\/div>\n\n  <main>\n/,
  SHELL_OPEN
);

s = s.replace(/\n  <\/main>\n\n  <footer>/, `\n  </div><!-- /wrapper -->\n  </div><!-- /page-shell -->\n\n  <footer>`);

// Section ids: convert div.section to section.section with ids
const sectionMap = [
  ['Ratings timeline', 'ratings'],
  ['Leader evaluations', 'leader'],
  ['Strengths', 'strengths'],
  ['Peer quotes', 'quotes'],
  ['Growth areas', 'growth-areas'],
  ['All peer feedback', 'peer'],
  ['Longitudinal analysis', 'longitudinal'],
];

for (const [comment, id] of sectionMap) {
  const re = new RegExp(
    `<!-- ── ${comment.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')} ── -->\\n    <div class="section">`,
    'g'
  );
  s = s.replace(re, `<!-- ── ${comment} ── -->\n    <section class="section" id="${id}">`);
}

// Close section tags: each section was </div> before next comment or before wrapper close.
// The original used </div> to close .section. After changing opening tags, closings that
// were `    </div>` before section comments need to become `    </section>`.
// Safer: replace the closing before each next section comment.
for (let i = 0; i < sectionMap.length; i++) {
  const nextComment = i + 1 < sectionMap.length ? sectionMap[i + 1][0] : null;
  if (nextComment) {
    const re = new RegExp(
      `\\n    </div>\\n\\n    <!-- ── ${nextComment.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')} ── -->`,
      'g'
    );
    s = s.replace(re, `\n    </section>\n\n    <!-- ── ${nextComment} ── -->`);
  }
}
// Last section close before wrapper end
s = s.replace(/\n    <\/div>\n\n  <\/div><!-- \/wrapper -->/, `\n    </section>\n\n  </div><!-- /wrapper -->`);

// i18n nav keys
s = s.replace(
  `'nav.back': '← Back to portfolio',`,
  `'nav.home': 'Home', 'nav.work': 'Work', 'nav.projects': 'Projects', 'nav.metrics': 'Metrics', 'nav.growth': 'Growth', 'nav.contact': 'Contact',
        'toc.label': 'On this page',
        'nav.back': '← Back to portfolio',`
);
s = s.replace(
  `'nav.back': '← Voltar ao portfolio',`,
  `'nav.home': 'Início', 'nav.work': 'Carreira', 'nav.projects': 'Projetos', 'nav.metrics': 'Métricas', 'nav.growth': 'Crescimento', 'nav.contact': 'Contato',
        'toc.label': 'Nesta página',
        'nav.back': '← Voltar ao portfolio',`
);

const TOC_JS = `
  <script>
    (function initPageToc() {
      const root = document.querySelector('.wrapper');
      const tocList = document.getElementById('page-toc-list');
      const rail = document.getElementById('toc-rail');
      const toggle = document.getElementById('toc-rail-toggle');
      if (!root || !tocList || !rail) return;

      const ICONS = {
        ratings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 17V9"/><path d="M12 17v-5"/><path d="M16 17V7"/></svg>',
        leader: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>',
        strengths: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/></svg>',
        quotes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>',
        'growth-areas': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
        peer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        longitudinal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
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
      links.forEach((a) => a.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 720px)').matches) applyOpen(false);
      }));
    })();
  </script>
`;

s = s.replace('</body>', `${TOC_JS}\n</body>`);

fs.writeFileSync(fp, s);

// sanity
const checks = {
  siteNav: s.includes('class="site-nav"'),
  tocRail: s.includes('id="toc-rail"'),
  ratings: s.includes('id="ratings"'),
  growthAreas: s.includes('id="growth-areas"'),
  longitudinal: s.includes('id="longitudinal"'),
  pageBanner: s.includes('page-banner'),
  sectionClose: (s.match(/<\/section>/g) || []).length,
  sectionOpen: (s.match(/<section class="section"/g) || []).length,
};
console.log(checks);
