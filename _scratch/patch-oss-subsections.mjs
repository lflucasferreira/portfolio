import fs from 'fs';

const f = 'projects.html';
let s = fs.readFileSync(f, 'utf8');

if (s.includes('id="oss-testflow"')) {
  console.log('already patched');
  process.exit(0);
}

// 1) CSS
const cssNeedle = '    .page-banner {';
const cssInsert = `    .oss-subsection {
      margin-top: 36px;
      scroll-margin-top: 40px;
    }
    .oss-subsection:first-of-type { margin-top: 8px; }
    .oss-subsection-title {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text);
      margin: 0 0 18px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border);
    }
    .toc-rail a.toc-h3 {
      padding-left: 18px;
      min-height: 34px;
    }
    .toc-rail a.toc-h3 .toc-rail-icon { width: 16px; height: 16px; }
    .toc-rail a.toc-h3 .toc-rail-icon svg { width: 14px; height: 14px; }
    .toc-rail a.toc-h3 .toc-rail-text { font-size: 0.72rem; }

    .page-banner {`;
if (!s.includes(cssNeedle)) throw new Error('css needle miss');
s = s.replace(cssNeedle, cssInsert);

// 2) Open TestFlow subsection before ecosystem (first occurrence after opensource)
{
  const ossStart = s.indexOf('id="opensource"');
  const eco = '<div class="oss-ecosystem">';
  const idx = s.indexOf(eco, ossStart);
  if (idx < 0) throw new Error('ecosystem miss');
  const openSub = `      <div class="oss-subsection" id="oss-testflow">
        <h3 class="oss-subsection-title" data-i18n="oss.testflow.section">TestFlow</h3>

      <div class="oss-ecosystem">`;
  s = s.slice(0, idx) + openSub + s.slice(idx + eco.length);
}

// 3) Split before qametrics: close grid + testflow, open qametrics
{
  const marker = `        <!-- qametrics — UFRPE undergrad thesis -->
        <div class="oss-card oss-card-featured oss-card-featured--qametrics">`;
  const idx = s.indexOf(marker);
  if (idx < 0) throw new Error('qametrics marker miss');
  // walk back to find the blank line after previous card's closing </div>
  // Replace: stay inside grid until selenium ends, then close grid+testflow
  const before = s.slice(idx - 20, idx);
  if (!before.includes('</div>')) throw new Error('unexpected before qametrics: ' + JSON.stringify(before));
  const replacement = `      </div><!-- /oss-grid testflow -->

      </div><!-- /oss-testflow -->

      <div class="oss-subsection" id="oss-qametrics">
        <h3 class="oss-subsection-title" data-i18n="oss.qametrics.section">QA Metrics · TCC</h3>

        <!-- qametrics — UFRPE undergrad thesis -->
        <div class="oss-card oss-card-featured oss-card-featured--qametrics">`;
  s = s.slice(0, idx) + replacement + s.slice(idx + marker.length);
}

// 4) After qametrics card, close subsection (was closing oss-grid)
{
  const marker = `      </div>

      <!-- GitHub widgets -->`;
  const idx = s.indexOf(marker, s.indexOf('id="oss-qametrics"'));
  if (idx < 0) throw new Error('github widgets miss');
  const replacement = `      </div><!-- /oss-qametrics -->

      <!-- GitHub widgets -->`;
  s = s.slice(0, idx) + replacement + s.slice(idx + marker.length);
}

// 5) i18n
s = s.replace(
  "'oss.label': 'Open Source', 'oss.title': 'GitHub Projects',",
  "'oss.label': 'Open Source', 'oss.title': 'GitHub Projects',\n        'oss.testflow.section': 'TestFlow',\n        'oss.qametrics.section': 'QA Metrics · TCC',"
);
s = s.replace(
  "'oss.label': 'Open Source', 'oss.title': 'Projetos no GitHub',",
  "'oss.label': 'Open Source', 'oss.title': 'Projetos no GitHub',\n        'oss.testflow.section': 'TestFlow',\n        'oss.qametrics.section': 'QA Metrics · TCC',"
);

// 6) TOC: include subsections
{
  const start = s.indexOf('      const sectionItems = [...root.querySelectorAll');
  if (start < 0) throw new Error('toc start miss');
  const end = s.indexOf('      }).join(\'\');\n\n      const links =', start);
  if (end < 0) throw new Error('toc end miss');
  const tocNew = `      ICONS['oss-testflow'] = ICONS.opensource;
      ICONS['oss-qametrics'] = ICONS.metrics;

      const sectionItems = [];
      root.querySelectorAll('section.section[id]').forEach((sec) => {
        const label = sec.querySelector(':scope > .section-label, :scope > .section-title');
        const text = (label?.textContent || sec.id).trim().replace(/\\s+/g, ' ');
        sectionItems.push({ id: sec.id, text, level: 2 });
        sec.querySelectorAll('.oss-subsection[id]').forEach((sub) => {
          const subLabel = sub.querySelector('.oss-subsection-title, h3');
          const subText = (subLabel?.textContent || sub.id).trim().replace(/\\s+/g, ' ');
          sectionItems.push({ id: sub.id, text: subText, level: 3 });
        });
      });

      tocList.innerHTML = sectionItems.map(({ id, text, level }) => {
        const icon = ICONS[id] || FALLBACK;
        const cls = level === 3 ? ' class="toc-h3"' : '';
        return \`<li><a\${cls} href="#\${id}" title="\${text.replace(/"/g, '&quot;')}"><span class="toc-rail-icon" aria-hidden="true">\${icon}</span><span class="toc-rail-text">\${text}</span></a></li>\`;
      }).join('');
`;
  s = s.slice(0, start) + tocNew + s.slice(end + '      }).join(\'\');\n'.length);
}

fs.writeFileSync(f, s);

const open = (s.match(/<div/g) || []).length;
const close = (s.match(/<\/div>/g) || []).length;
console.log({
  testflow: s.includes('id="oss-testflow"'),
  qametrics: s.includes('id="oss-qametrics"'),
  toc: s.includes("ICONS['oss-testflow']"),
  i18n: s.includes('oss.testflow.section'),
  divDelta: open - close,
});
