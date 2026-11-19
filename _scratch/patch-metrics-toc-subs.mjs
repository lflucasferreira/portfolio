import fs from 'fs';

const f = 'metrics.html';
let s = fs.readFileSync(f, 'utf8');

if (s.includes('id="task-score"') && s.includes('toc-subsection')) {
  console.log('already patched');
  process.exit(0);
}

// 1) CSS before .page-banner
{
  const needle = '    .page-banner {';
  if (!s.includes(needle)) throw new Error('css needle miss');
  if (!s.includes('.toc-subsection')) {
    s = s.replace(
      needle,
      `    .toc-subsection {
      scroll-margin-top: 40px;
    }
    .toc-rail a.toc-h3 {
      padding-left: 18px;
      min-height: 34px;
    }
    .toc-rail a.toc-h3 .toc-rail-icon { width: 16px; height: 16px; }
    .toc-rail a.toc-h3 .toc-rail-icon svg { width: 14px; height: 14px; }
    .toc-rail a.toc-h3 .toc-rail-text { font-size: 0.72rem; }

    .page-banner {`
    );
  }
}

// 2) looker-block already has id — add toc-subsection class
s = s.replace(
  '<div class="looker-block" id="looker-quality-reports">',
  '<div class="looker-block toc-subsection" id="looker-quality-reports">'
);

// 3) Wrap Task Score: from its h3 until metric-sep (PPI)
{
  const startMark = '      <h3 class="metrics-subtitle" data-i18n="ts.subtitle">Task Score</h3>';
  const endMark = '      <div class="metric-sep">\n        <span data-i18n="metrics.other.label">PPI · SRM · RBD</span>';
  const start = s.indexOf(startMark);
  const end = s.indexOf(endMark);
  if (start < 0) throw new Error('task score start miss');
  if (end < 0) throw new Error('task score end miss');
  if (start >= end) throw new Error('task score order bad');
  const body = s.slice(start, end);
  const wrapped =
    `      <div class="toc-subsection" id="task-score">\n` +
    body +
    `      </div><!-- /task-score -->\n\n`;
  s = s.slice(0, start) + wrapped + s.slice(end);
}

// 4) Wrap PPI · SRM · RBD: from metric-sep through end of metrics-grid (before metrics-advanced)
{
  const startMark = '      <div class="metric-sep">\n        <span data-i18n="metrics.other.label">PPI · SRM · RBD</span>';
  const endMark = '      <!-- Extended metrics · draft subsection -->';
  const start = s.indexOf(startMark);
  const end = s.indexOf(endMark);
  if (start < 0) throw new Error('ppi start miss');
  if (end < 0) throw new Error('ppi end miss');
  const body = s.slice(start, end);
  const wrapped =
    `      <div class="toc-subsection" id="ppi-srm-rbd">\n` +
    body +
    `      </div><!-- /ppi-srm-rbd -->\n\n`;
  s = s.slice(0, start) + wrapped + s.slice(end);
}

// 5) metrics-extended: add toc-subsection class
s = s.replace(
  '<div class="metrics-advanced" id="metrics-extended">',
  '<div class="metrics-advanced toc-subsection" id="metrics-extended">'
);

// 6) TOC JS — same pattern as projects
{
  const start = s.indexOf('      const sectionItems = [...root.querySelectorAll');
  if (start < 0) throw new Error('toc start miss');
  const end = s.indexOf("      }).join('');\n\n      const links =", start);
  if (end < 0) throw new Error('toc end miss');
  const tocNew = `      ICONS['looker-quality-reports'] = ICONS.metrics;
      ICONS['task-score'] = ICONS.metrics;
      ICONS['ppi-srm-rbd'] = ICONS.metrics;
      ICONS['metrics-extended'] = ICONS.metrics;

      const sectionItems = [];
      root.querySelectorAll('section.section[id]').forEach((sec) => {
        const label = sec.querySelector(':scope > .section-label, :scope > .section-title');
        const text = (label?.textContent || sec.id).trim().replace(/\\s+/g, ' ');
        sectionItems.push({ id: sec.id, text, level: 2 });
        sec.querySelectorAll('.toc-subsection[id]').forEach((sub) => {
          const subLabel = sub.querySelector('.metrics-subtitle, .metric-sep span, h3');
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
  s = s.slice(0, start) + tocNew + s.slice(end + "      }).join('');\n".length);
}

fs.writeFileSync(f, s);

const open = (s.match(/<div/g) || []).length;
const close = (s.match(/<\/div>/g) || []).length;
console.log({
  looker: s.includes('looker-block toc-subsection'),
  task: s.includes('id="task-score"'),
  ppi: s.includes('id="ppi-srm-rbd"'),
  ext: s.includes('metrics-advanced toc-subsection'),
  toc: s.includes("ICONS['task-score']"),
  divDelta: open - close,
});
