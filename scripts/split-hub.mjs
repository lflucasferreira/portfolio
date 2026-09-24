/**
 * One-shot (re-runnable) split of index.html into hub + topic pages.
 * Reads current index.html, writes: index.html (slim), work.html, projects.html, metrics.html
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'index.html');

const html = fs.readFileSync(indexPath, 'utf8');

function extractBetween(src, startMarker, endMarker) {
  const start = src.indexOf(startMarker);
  if (start < 0) throw new Error(`Missing start: ${startMarker}`);
  const end = endMarker ? src.indexOf(endMarker, start + startMarker.length) : src.length;
  if (endMarker && end < 0) throw new Error(`Missing end: ${endMarker}`);
  return src.slice(start, endMarker ? end : undefined);
}

const headMatch = html.match(/^[\s\S]*?<\/head>/);
if (!headMatch) throw new Error('No </head>');
let head = headMatch[0];

const afterHead = html.slice(headMatch[0].length);
const footerStart = afterHead.indexOf('<footer>');
const wrapperClose = afterHead.lastIndexOf('</div><!-- /wrapper -->');
if (footerStart < 0 || wrapperClose < 0) throw new Error('footer/wrapper markers missing');

const bodyOpen = extractBetween(afterHead, '<body>', '  <div class="wrapper">');
const preWrapper = bodyOpen; // includes bg-mesh + nav, ends before wrapper
const fromWrapper = afterHead.slice(afterHead.indexOf('  <div class="wrapper">'));
const wrapperInner = fromWrapper.slice(
  '  <div class="wrapper">'.length,
  fromWrapper.indexOf('  </div><!-- /wrapper -->')
);
const postWrapper = afterHead.slice(afterHead.indexOf('  </div><!-- /wrapper -->') + '  </div><!-- /wrapper -->'.length);

const sections = {
  hero: extractBetween(wrapperInner, '    <!-- ── Hero ── -->', '    <!-- ── About ── -->'),
  about: extractBetween(wrapperInner, '    <!-- ── About ── -->', '    <!-- ── Skills ── -->'),
  skills: extractBetween(wrapperInner, '    <!-- ── Skills ── -->', '    <!-- ── Experience ── -->'),
  experience: extractBetween(wrapperInner, '    <!-- ── Experience ── -->', '    <!-- ── Recommendations ── -->'),
  recommendations: extractBetween(wrapperInner, '    <!-- ── Recommendations ── -->', '    <!-- ── Projects ── -->'),
  projects: extractBetween(wrapperInner, '    <!-- ── Projects ── -->', '    <!-- ── Open Source ── -->'),
  opensource: extractBetween(wrapperInner, '    <!-- ── Open Source ── -->', '    <!-- ── Task Score ── -->'),
  metrics: extractBetween(wrapperInner, '    <!-- ── Task Score ── -->', '    <!-- ── Bug severity ── -->'),
  severity: extractBetween(wrapperInner, '    <!-- ── Bug severity ── -->', '    <!-- ── Bug priority ── -->'),
  priority: extractBetween(wrapperInner, '    <!-- ── Bug priority ── -->', '    <!-- ── Achievements ── -->'),
  achievements: extractBetween(wrapperInner, '    <!-- ── Achievements ── -->', '    <!-- ── Education ── -->'),
  education: extractBetween(wrapperInner, '    <!-- ── Education ── -->', '    <!-- ── Contact ── -->'),
  contact: extractBetween(wrapperInner, '    <!-- ── Contact ── -->', null).replace(/\s*$/, '\n'),
};

const TOC_CSS = `
    /* ── Page TOC (deep pages) ── */
    .page-shell { display: block; }
    .page-toc {
      display: none;
    }
    @media (min-width: 1100px) {
      body.has-toc .page-shell {
        display: grid;
        grid-template-columns: 220px minmax(0, 1fr);
        gap: 32px;
        align-items: start;
        max-width: 1180px;
        margin: 0 auto;
        padding: 0 24px;
      }
      body.has-toc .page-shell > .wrapper {
        max-width: none;
        margin: 0;
        padding-left: 0;
        padding-right: 0;
      }
      .page-toc {
        display: block;
        position: sticky;
        top: 88px;
        max-height: calc(100vh - 112px);
        overflow: auto;
        padding: 16px 12px 16px 0;
        border-right: 1px solid var(--border);
      }
      .page-toc-label {
        font-size: 0.68rem;
        font-family: var(--mono);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-3);
        margin: 0 0 12px;
      }
      .page-toc ul { list-style: none; margin: 0; padding: 0; }
      .page-toc li { margin: 0 0 2px; }
      .page-toc a {
        display: block;
        font-size: 0.78rem;
        line-height: 1.35;
        color: var(--text-3);
        text-decoration: none;
        padding: 6px 10px;
        border-radius: 6px;
        border-left: 2px solid transparent;
      }
      .page-toc a:hover { color: var(--text); background: var(--surface2); }
      .page-toc a.is-active {
        color: var(--accent);
        border-left-color: var(--accent);
        background: rgba(108,140,255,0.08);
      }
      .page-toc a.toc-h3 { padding-left: 20px; font-size: 0.72rem; }
    }
    .page-toc-mobile {
      display: none;
    }
    @media (max-width: 1099px) {
      .page-toc-mobile {
        display: block;
        position: sticky;
        top: 64px;
        z-index: 40;
        margin: 0 0 16px;
      }
      .page-toc-mobile details {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 8px 12px;
      }
      .page-toc-mobile summary {
        cursor: pointer;
        font-size: 0.78rem;
        font-family: var(--mono);
        color: var(--text-2);
        list-style: none;
      }
      .page-toc-mobile summary::-webkit-details-marker { display: none; }
      .page-toc-mobile ul { list-style: none; margin: 10px 0 4px; padding: 0; }
      .page-toc-mobile a {
        display: block;
        padding: 6px 4px;
        font-size: 0.78rem;
        color: var(--text-2);
        text-decoration: none;
      }
    }
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

if (!head.includes('/* ── Page TOC (deep pages) ── */')) {
  head = head.replace('  </style>', `${TOC_CSS}\n  </style>`);
}

const NAV = `  <!-- ── Nav ── -->
  <nav class="site-nav">
    <a class="nav-logo" href="index.html" style="text-decoration:none;color:inherit;">Lucas<span> Ferreira</span></a>
    <ul class="nav-links">
      <li><a href="index.html" data-i18n="nav.home">Home</a></li>
      <li><a href="work.html" data-i18n="nav.work">Work</a></li>
      <li><a href="projects.html" data-i18n="nav.projects">Projects</a></li>
      <li><a href="metrics.html" data-i18n="nav.metrics">Metrics</a></li>
      <li><a href="growth.html" data-i18n="nav.growth">Growth</a></li>
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

function replaceNav(pre) {
  return pre.replace(/  <!-- ── Nav ── -->[\s\S]*?<\/nav>\n/, NAV);
}

const TOC_JS = `
  <script>
    (function initPageToc() {
      const root = document.querySelector('.wrapper');
      const tocList = document.getElementById('page-toc-list');
      const tocMobile = document.getElementById('page-toc-mobile-list');
      if (!root || !tocList) return;

      const headings = [...root.querySelectorAll('h2.section-title, h3.metrics-subtitle, h3[data-i18n], .oss-featured-title, .project-card h3')];
      const seen = new Set();
      const items = [];

      headings.forEach((h) => {
        let id = h.id;
        if (!id) {
          const section = h.closest('section.section, .oss-influx-block, .looker-block, .project-card, .metrics-advanced');
          id = section?.id || '';
        }
        if (!id || seen.has(id)) return;
        seen.add(id);
        const text = (h.textContent || '').trim().replace(/\\s+/g, ' ');
        if (!text) return;
        const level = h.tagName === 'H2' ? 2 : 3;
        items.push({ id, text, level });
      });

      // Prefer section-level TOC: section labels + h2
      const sectionItems = [...root.querySelectorAll('section.section[id]')].map((sec) => {
        const label = sec.querySelector('.section-label, .section-title');
        const text = (label?.textContent || sec.id).trim().replace(/\\s+/g, ' ');
        return { id: sec.id, text, level: 2 };
      });

      const finalItems = sectionItems.length ? sectionItems : items;
      const html = finalItems.map(({ id, text, level }) =>
        \`<li><a class="\${level === 3 ? 'toc-h3' : ''}" href="#\${id}">\${text}</a></li>\`
      ).join('');
      tocList.innerHTML = html;
      if (tocMobile) tocMobile.innerHTML = html;

      const links = [...document.querySelectorAll('.page-toc a, .page-toc-mobile a')];
      const map = new Map(finalItems.map((it) => [it.id, document.getElementById(it.id)]).filter(([, el]) => el));

      function setActive(id) {
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
      }

      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      }, { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] });

      map.forEach((el) => observer.observe(el));
    })();
  </script>
`;

function patchTranslations(scripts) {
  // Expand nav keys in both en and pt blocks
  let out = scripts;
  out = out.replace(
    "'nav.about': 'About', 'nav.skills': 'Skills', 'nav.experience': 'Experience',\n        'nav.projects': 'Projects', 'nav.education': 'Education', 'nav.contact': 'Contact', 'nav.slides': 'Slides',",
    "'nav.home': 'Home', 'nav.work': 'Work', 'nav.projects': 'Projects', 'nav.metrics': 'Metrics', 'nav.growth': 'Growth',\n        'nav.about': 'About', 'nav.skills': 'Skills', 'nav.experience': 'Experience',\n        'nav.education': 'Education', 'nav.contact': 'Contact', 'nav.slides': 'Slides',\n        'hub.label': 'Explore', 'hub.title': 'Where to dig deeper',\n        'hub.work.k': 'Career', 'hub.work.h': 'Work & recommendations', 'hub.work.p': 'Questrade · CI&T · full experience bullets, peer recommendations, and recognitions.', 'hub.work.cta': 'Open work →',\n        'hub.proj.k': 'Delivery', 'hub.proj.h': 'Projects & open source', 'hub.proj.p': 'CLP framework, API/Newman CI, k6, TestFlow ecosystem, and qametrics architecture.', 'hub.proj.cta': 'Open projects →',\n        'hub.met.k': 'Quality', 'hub.met.h': 'QA metrics & taxonomies', 'hub.met.p': 'Looker Quality Reports, PPI/SRM/RBD/Task Score, pyramid, severity and priority.', 'hub.met.cta': 'Open metrics →',\n        'hub.grow.k': 'Growth', 'hub.grow.h': 'Performance & growth', 'hub.grow.p': 'Four-year ratings, peer feedback, strengths, and active development areas.', 'hub.grow.cta': 'Open growth →',\n        'page.work.title': 'Work', 'page.work.desc': 'Experience, recommendations, and achievements.',\n        'page.projects.title': 'Projects & open source', 'page.projects.desc': 'Notable delivery and public GitHub work.',\n        'page.metrics.title': 'QA metrics', 'page.metrics.desc': 'Custom metrics, Looker reports, and bug taxonomies.',\n        'toc.label': 'On this page',"
  );
  out = out.replace(
    /'nav\.about': 'Sobre'[\s\S]*?'nav\.slides': 'Slides',/,
    `'nav.home': 'Início', 'nav.work': 'Carreira', 'nav.projects': 'Projetos', 'nav.metrics': 'Métricas', 'nav.growth': 'Crescimento',
        'nav.about': 'Sobre', 'nav.skills': 'Skills', 'nav.experience': 'Experiência',
        'nav.education': 'Formação', 'nav.contact': 'Contato', 'nav.slides': 'Slides',
        'hub.label': 'Explorar', 'hub.title': 'Para ir mais fundo',
        'hub.work.k': 'Carreira', 'hub.work.h': 'Trabalho e recomendações', 'hub.work.p': 'Questrade · CI&T · bullets completos, recomendações e reconhecimentos.', 'hub.work.cta': 'Abrir carreira →',
        'hub.proj.k': 'Entrega', 'hub.proj.h': 'Projetos e open source', 'hub.proj.p': 'Framework CLP, CI Newman, k6, ecossistema TestFlow e arquitetura qametrics.', 'hub.proj.cta': 'Abrir projetos →',
        'hub.met.k': 'Qualidade', 'hub.met.h': 'Métricas e taxonomias', 'hub.met.p': 'Looker Quality Reports, PPI/SRM/RBD/Task Score, pirâmide, severidade e prioridade.', 'hub.met.cta': 'Abrir métricas →',
        'hub.grow.k': 'Crescimento', 'hub.grow.h': 'Performance e crescimento', 'hub.grow.p': 'Quatro anos de ratings, feedback de peers, forças e áreas em desenvolvimento.', 'hub.grow.cta': 'Abrir crescimento →',
        'page.work.title': 'Carreira', 'page.work.desc': 'Experiência, recomendações e conquistas.',
        'page.projects.title': 'Projetos e open source', 'page.projects.desc': 'Entregas notáveis e trabalho público no GitHub.',
        'page.metrics.title': 'Métricas de QA', 'page.metrics.desc': 'Métricas customizadas, Looker e taxonomias de bugs.',
        'toc.label': 'Nesta página',`
  );

  // Fix cross-page anchors inside translation strings
  out = out.replace(/href="#proj-observability"/g, 'href="projects.html#proj-observability"');
  out = out.replace(/href="#job-questrade"/g, 'href="work.html#job-questrade"');
  out = out.replace(/href="#job-cit"/g, 'href="work.html#job-cit"');
  out = out.replace(/href="#opensource"/g, 'href="projects.html#opensource"');
  out = out.replace(/href="#metrics"/g, 'href="metrics.html#metrics"');
  out = out.replace(
    /Severidade ≠ Prioridade\.<\/strong>[\s\S]*?href="#priority"/,
    (m) => m.replace('href="#priority"', 'href="metrics.html#priority"')
  );

  return out;
}

let scripts = patchTranslations(postWrapper);

// Guard already exists in renderTpiBar for missing pyramid

const HUB = `
    <!-- ── Hub destinations ── -->
    <section class="section" id="explore">
      <div class="section-label" data-i18n="hub.label">Explore</div>
      <h2 class="section-title" data-i18n="hub.title">Where to dig deeper</h2>
      <div class="hub-grid">
        <a class="hub-card" href="work.html">
          <span class="hub-card-kicker" data-i18n="hub.work.k">Career</span>
          <h3 data-i18n="hub.work.h">Work &amp; recommendations</h3>
          <p data-i18n="hub.work.p">Questrade · CI&amp;T · full experience bullets, peer recommendations, and recognitions.</p>
          <span class="hub-card-cta" data-i18n="hub.work.cta">Open work →</span>
        </a>
        <a class="hub-card" href="projects.html">
          <span class="hub-card-kicker" data-i18n="hub.proj.k">Delivery</span>
          <h3 data-i18n="hub.proj.h">Projects &amp; open source</h3>
          <p data-i18n="hub.proj.p">CLP framework, API/Newman CI, k6, TestFlow ecosystem, and qametrics architecture.</p>
          <span class="hub-card-cta" data-i18n="hub.proj.cta">Open projects →</span>
        </a>
        <a class="hub-card" href="metrics.html">
          <span class="hub-card-kicker" data-i18n="hub.met.k">Quality</span>
          <h3 data-i18n="hub.met.h">QA metrics &amp; taxonomies</h3>
          <p data-i18n="hub.met.p">Looker Quality Reports, PPI/SRM/RBD/Task Score, pyramid, severity and priority.</p>
          <span class="hub-card-cta" data-i18n="hub.met.cta">Open metrics →</span>
        </a>
        <a class="hub-card" href="growth.html">
          <span class="hub-card-kicker" data-i18n="hub.grow.k">Growth</span>
          <h3 data-i18n="hub.grow.h">Performance &amp; growth</h3>
          <p data-i18n="hub.grow.p">Four-year ratings, peer feedback, strengths, and active development areas.</p>
          <span class="hub-card-cta" data-i18n="hub.grow.cta">Open growth →</span>
        </a>
      </div>
    </section>
`;

function pageBanner(titleKey, titleFallback, descKey, descFallback) {
  return `
    <section class="page-banner" id="top">
      <div class="section-label" data-i18n="${titleKey}">${titleFallback}</div>
      <h1 data-i18n="${titleKey}">${titleFallback}</h1>
      <p data-i18n="${descKey}">${descFallback}</p>
    </section>
`;
}

function tocChrome() {
  return `
    <aside class="page-toc" aria-label="Table of contents">
      <p class="page-toc-label" data-i18n="toc.label">On this page</p>
      <ul id="page-toc-list"></ul>
    </aside>
    <div class="page-toc-mobile">
      <details>
        <summary data-i18n="toc.label">On this page</summary>
        <ul id="page-toc-mobile-list"></ul>
      </details>
    </div>
`;
}

function buildPage({ title, description, bodyClass, sectionsHtml, includeModals }) {
  const pre = replaceNav(preWrapper.replace('<body>', `<body class="${bodyClass}">`));
  // Strip old nav from preWrapper - replaceNav handles it; also remove duplicate body if any
  let bodyStart = pre;
  if (!bodyStart.includes('class="has-toc"') && bodyClass.includes('has-toc')) {
    bodyStart = bodyStart.replace('<body class="has-toc">', '<body class="has-toc">');
  }

  const shellOpen = bodyClass.includes('has-toc')
    ? `  <div class="page-shell">\n${tocChrome()}\n  <div class="wrapper">\n`
    : `  <div class="wrapper">\n`;
  const shellClose = bodyClass.includes('has-toc')
    ? `  </div><!-- /wrapper -->\n  </div><!-- /page-shell -->\n`
    : `  </div><!-- /wrapper -->\n`;

  // Drop modals from scripts if not needed
  let pageScripts = scripts;
  if (!includeModals) {
    pageScripts = pageScripts
      .replace(/<!-- TCC PDF reader modal -->[\s\S]*?<!-- Dashboard preview modal -->/, '<!-- Dashboard preview modal -->')
      .replace(/<!-- Dashboard preview modal -->[\s\S]*?<script>\s*\(function \(\) \{[\s\S]*?<\/script>\s*<\/body>\s*<\/html>\s*$/, '</body>\n</html>\n');
    // If the regex ate too much, fall back carefully — rebuild from footer onwards without modals
  }

  // Safer modal strip: keep footer + first translation script; strip modal HTML + last modal script only for non-projects
  if (!includeModals) {
    const footerIdx = scripts.indexOf('<footer>');
    const firstScript = scripts.indexOf('<script>', footerIdx);
    const secondScript = scripts.indexOf('<script>', firstScript + 1);
    // Keep footer + i18n script + oss copy script (2nd) but remove modal HTML and final modal script
    const footerAndCore = scripts.slice(footerIdx);
    // Remove pdf-modal and dash-modal blocks
    let cleaned = footerAndCore
      .replace(/<!-- TCC PDF reader modal -->[\s\S]*?<\/div>\s*<!-- Dashboard preview modal -->/, '<!-- Dashboard preview modal -->')
      .replace(/<!-- Dashboard preview modal -->[\s\S]*?<\/div>\s*(?=<script>)/, '')
      .replace(/<script>\s*\(function \(\) \{\s*const PDF_SRC[\s\S]*?<\/script>\s*(?=<\/body>)/, '');
    pageScripts = cleaned;
  } else {
    pageScripts = scripts.slice(scripts.indexOf('<footer>'));
  }

  if (bodyClass.includes('has-toc')) {
    pageScripts = pageScripts.replace('</body>', `${TOC_JS}\n</body>`);
  }

  const pageHead = head
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`);

  return `${pageHead}
${bodyStart.trimEnd()}

${shellOpen}${sectionsHtml}${shellClose}
${pageScripts}`;
}

// Fix remaining HTML (non-i18n) cross-links in section bodies
function fixLinks(s) {
  return s
    .replace(/href="#proj-observability"/g, 'href="projects.html#proj-observability"')
    .replace(/href="#job-questrade"/g, 'href="work.html#job-questrade"')
    .replace(/href="#job-cit"/g, 'href="work.html#job-cit"')
    .replace(/href="#opensource"/g, 'href="projects.html#opensource"')
    .replace(/href="#qametrics-influx-sonar"/g, 'href="projects.html#qametrics-influx-sonar"')
    .replace(/href="#metrics"/g, 'href="metrics.html#metrics"');
}

const indexBody = [
  sections.hero,
  sections.about,
  sections.skills,
  HUB,
  sections.education,
  sections.contact,
].join('\n');

const indexHtml = buildPage({
  title: 'Lucas Ferreira — Senior QA Engineer',
  description: 'Senior QA Engineer with 10+ years in test automation, fintech, KYC/AML compliance, Cypress, Playwright, k6, and CI/CD.',
  bodyClass: '',
  sectionsHtml: fixLinks(indexBody),
  includeModals: false,
}).replace('<body class="">', '<body>');

// Fix nav logo / hub — index should use #contact for contact when on same page
const indexFinal = indexHtml
  .replace('href="index.html#contact"', 'href="#contact"')
  .replace('<a href="index.html" data-i18n="nav.home">Home</a>', '<a href="#top" data-i18n="nav.home">Home</a>');

const workHtml = buildPage({
  title: 'Work — Lucas Ferreira',
  description: 'Experience, peer recommendations, and achievements.',
  bodyClass: 'has-toc',
  sectionsHtml: fixLinks(
    pageBanner('page.work.title', 'Work', 'page.work.desc', 'Experience, recommendations, and achievements.') +
      sections.experience +
      sections.recommendations +
      sections.achievements
  ),
  includeModals: false,
});

const projectsHtml = buildPage({
  title: 'Projects & Open Source — Lucas Ferreira',
  description: 'Notable projects and open-source TestFlow / qametrics work.',
  bodyClass: 'has-toc',
  sectionsHtml: fixLinks(
    pageBanner('page.projects.title', 'Projects & open source', 'page.projects.desc', 'Notable delivery and public GitHub work.') +
      sections.projects +
      sections.opensource
  ),
  includeModals: true,
});

const metricsHtml = buildPage({
  title: 'QA Metrics — Lucas Ferreira',
  description: 'Custom QA metrics, Looker Quality Reports, severity and priority taxonomies.',
  bodyClass: 'has-toc',
  sectionsHtml: fixLinks(
    pageBanner('page.metrics.title', 'QA metrics', 'page.metrics.desc', 'Custom metrics, Looker reports, and bug taxonomies.') +
      sections.metrics +
      sections.severity +
      sections.priority
  ),
  includeModals: false,
});

// Renumber section labels lightly on hub? keep as-is for less churn.

fs.writeFileSync(path.join(root, 'index.html'), indexFinal);
fs.writeFileSync(path.join(root, 'work.html'), workHtml);
fs.writeFileSync(path.join(root, 'projects.html'), projectsHtml);
fs.writeFileSync(path.join(root, 'metrics.html'), metricsHtml);

console.log('Wrote index.html, work.html, projects.html, metrics.html');
console.log({
  index: fs.statSync(path.join(root, 'index.html')).size,
  work: fs.statSync(path.join(root, 'work.html')).size,
  projects: fs.statSync(path.join(root, 'projects.html')).size,
  metrics: fs.statSync(path.join(root, 'metrics.html')).size,
});
