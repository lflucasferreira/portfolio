import fs from 'fs';

const f = new URL('../metrics.html', import.meta.url);
let s = fs.readFileSync(f, 'utf8');

if (s.includes('id="metrics-catalog"')) {
  console.log('catalog already present');
} else {
  // ── CSS ──
  const cssInsert = `
    .metrics-catalog {
      margin-top: 28px; padding: 28px 24px 20px;
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    }
    .metrics-catalog-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
    }
    @media (max-width: 820px) {
      .metrics-catalog-grid { grid-template-columns: 1fr; }
    }
    .metric-study-card {
      background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm);
      padding: 18px 16px; display: flex; flex-direction: column; gap: 10px;
      transition: border-color var(--transition);
    }
    .metric-study-card:hover { border-color: var(--border2); }
    .metric-study-top { display: flex; align-items: flex-start; gap: 12px; }
    .metric-study-badge {
      margin-left: auto; flex-shrink: 0;
      font-size: 0.62rem; font-family: var(--mono); font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.05em;
      color: var(--accent); background: var(--glow);
      border: 1px solid rgba(108,140,255,0.25); border-radius: 20px;
      padding: 3px 8px; white-space: nowrap;
    }
    .metric-study-card .metric-acronym { padding: 6px 10px; font-size: 0.88rem; }
    .metric-study-card h3 { font-size: 0.88rem; font-weight: 700; color: var(--text); margin: 0 0 4px; }
    .metric-study-card .metric-desc { font-size: 0.76rem; color: var(--text-2); line-height: 1.5; margin: 0; }
    .metric-study-formula {
      background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
      padding: 8px 12px; font-family: var(--mono); font-size: 0.72rem; color: var(--text-2); line-height: 1.55;
    }
    .metric-study-formula .mf-key { color: var(--accent); font-weight: 600; }
    .metric-study-formula .mf-note { display: block; margin-top: 3px; font-size: 0.64rem; color: var(--text-3); }
    .metric-study-scale { display: flex; gap: 2px; }
    .metric-study-scale .metric-scale-item {
      flex: 1; text-align: center; padding: 5px 3px; border-radius: 4px;
      font-size: 0.6rem; font-family: var(--mono); font-weight: 600;
    }
    .metric-study-scale .metric-scale-item span {
      display: block; font-size: 0.54rem; font-weight: 400; opacity: 0.8; margin-top: 1px;
    }
    .metric-study-rel {
      font-size: 0.66rem; font-family: var(--mono); color: var(--text-3); line-height: 1.45;
    }
    .metric-study-rel strong { color: var(--text-2); font-weight: 600; }
    .metrics-catalog-group { margin-bottom: 22px; }
    .metrics-catalog-group:last-child { margin-bottom: 8px; }
    [data-theme="dark"] .metric-study-card { background: var(--surface3); border-color: var(--border2); }
    [data-theme="dark"] .metric-study-formula { background: var(--surface2); }
`;

  const cssNeedle = `    #test-pyramid {
      margin-top: 32px;
    }`;
  if (!s.includes(cssNeedle)) throw new Error('css needle missing');
  s = s.replace(cssNeedle, cssNeedle + cssInsert);

  function card({ id, acronym, titleKey, title, descKey, desc, formula, noteKey, note, bands, relKey, rel }) {
    const scale = bands.map(([name, range, bg, color]) =>
      `<div class="metric-scale-item" style="background:${bg};color:${color};">${name}<span>${range}</span></div>`
    ).join('');
    return `
          <article class="metric-study-card" id="study-${id}">
            <div class="metric-study-top">
              <div class="metric-acronym">${acronym}</div>
              <div style="min-width:0;flex:1;">
                <h3 data-i18n="${titleKey}">${title}</h3>
                <p class="metric-desc" data-i18n="${descKey}">${desc}</p>
              </div>
              <span class="metric-study-badge" data-i18n="metrics.cat.badge">In study</span>
            </div>
            <div class="metric-study-formula">
              <span class="mf-key">${acronym}</span> ${formula}
              <span class="mf-note" data-i18n="${noteKey}">${note}</span>
            </div>
            <div class="metric-study-scale" role="img" aria-label="${acronym} scale">${scale}</div>
            <p class="metric-study-rel" data-i18n="${relKey}"><strong>Related:</strong> ${rel}</p>
          </article>`;
  }

  const poor = ['Poor', 'rgba(239,68,68,0.09)', '#ef4444'];
  const fair = ['Fair', 'rgba(251,191,36,0.09)', 'var(--yellow)'];
  const good = ['Good', 'rgba(79,114,255,0.1)', 'var(--accent)'];
  const excel = ['Excellent', 'rgba(52,211,153,0.1)', 'var(--green)'];
  const ideal = ['Ideal', 'rgba(52,211,153,0.1)', 'var(--green)'];
  const ok = ['Acceptable', 'rgba(79,114,255,0.1)', 'var(--accent)'];
  const warn = ['Warning', 'rgba(251,191,36,0.09)', 'var(--yellow)'];
  const crit = ['Critical', 'rgba(239,68,68,0.09)', '#ef4444'];

  function b4(a, b, c, d) {
    return [
      [poor[0], a, poor[1], poor[2]],
      [fair[0], b, fair[1], fair[2]],
      [good[0], c, good[1], good[2]],
      [excel[0], d, excel[1], excel[2]],
    ];
  }
  function b4down(a, b, c, d) {
    return [
      [ideal[0], a, ideal[1], ideal[2]],
      [ok[0], b, ok[1], ok[2]],
      [warn[0], c, warn[1], warn[2]],
      [crit[0], d, crit[1], crit[2]],
    ];
  }

  const groups = [
    {
      titleKey: 'metrics.cat.g1.title', title: 'Handoff & prevention',
      introKey: 'metrics.cat.g1.intro',
      intro: 'Signals that explain SRM and Task Score: readiness before QA starts, not only defects after.',
      cards: [
        card({
          id: 'acr', acronym: 'ACR',
          titleKey: 'metrics.cat.acr.title', title: 'AC Clarity Rate',
          descKey: 'metrics.cat.acr.desc',
          desc: 'Share of stories whose acceptance criteria are testable before kickoff. Low ACR usually precedes Simple Rejects.',
          formula: '= ΣStoriesWithTestableAC / ΣStoriesCommitted × 100%',
          noteKey: 'metrics.cat.acr.note',
          note: 'Testable AC = given/when/then or equivalent checkable outcomes · Source: Jira + refinement checklist',
          bands: b4('<70%', '70-84%', '85-<95%', '95-100%'),
          relKey: 'metrics.cat.acr.rel', rel: 'Explains SRM; pair with Task Score refinement gates',
        }),
        card({
          id: 'dof', acronym: 'DOF',
          titleKey: 'metrics.cat.dof.title', title: 'Definition of Done Failures',
          descKey: 'metrics.cat.dof.desc',
          desc: 'Count of tasks that failed Definition of Done at QA intake in the sprint. Binary complement to Task Score.',
          formula: '= ΣTasksFailedDoD (per sprint)',
          noteKey: 'metrics.cat.dof.note',
          note: 'Failed DoD = missing evidence, tests, or AC coverage at handoff · Source: Jira workflow + checklist',
          bands: b4down('0', '1-2', '3-5', '>5'),
          relKey: 'metrics.cat.dof.rel', rel: 'Sibling of SRM and Task Score criteria 1-5',
        }),
        card({
          id: 'bcr', acronym: 'BCR',
          titleKey: 'metrics.cat.bcr.title', title: 'Blocked Cycle Ratio',
          descKey: 'metrics.cat.bcr.desc',
          desc: 'Share of cycle time spent blocked waiting on AC, environment, or test data. Turns delay into a root-cause signal.',
          formula: '= ΣBlockedDays / ΣCycleDays × 100%',
          noteKey: 'metrics.cat.bcr.note',
          note: 'Blocked = waiting AC, env, data, or dependency · Source: Jira time-in-status',
          bands: b4down('<10%', '10-19%', '20-34%', '≥35%'),
          relKey: 'metrics.cat.bcr.rel', rel: 'Pairs with TTQR; explains slow handoffs without blaming QA capacity',
        }),
      ],
    },
    {
      titleKey: 'metrics.cat.g2.title', title: 'Defect cycle',
      introKey: 'metrics.cat.g2.intro',
      intro: 'Complements PPI and RBD: reopen quality, resolve speed by severity, and ticket noise.',
      cards: [
        card({
          id: 'ttr', acronym: 'TTR',
          titleKey: 'metrics.cat.ttr.title', title: 'Time to Resolve',
          descKey: 'metrics.cat.ttr.desc',
          desc: 'Median time from bug opened to closed, sliced by severity. Links the severity taxonomy to delivery speed.',
          formula: '= median(ClosedAt − OpenedAt) by severity',
          noteKey: 'metrics.cat.ttr.note',
          note: 'Track Blocker/Critical separately from Minor/Low · Source: Jira · Target bands are for Critical+',
          bands: b4down('<1d', '1-2d', '3-5d', '>5d'),
          relKey: 'metrics.cat.ttr.rel', rel: 'Uses severity ladder; pairs with PPI when fixes bounce',
        }),
        card({
          id: 'ror', acronym: 'ROR',
          titleKey: 'metrics.cat.ror.title', title: 'Reopen Rate',
          descKey: 'metrics.cat.ror.desc',
          desc: 'Bugs reopened after close divided by bugs closed. PPI counts ping-pong while open; ROR catches premature closes.',
          formula: '= ΣReopened / ΣClosed × 100%',
          noteKey: 'metrics.cat.ror.note',
          note: 'Reopened = status returns to open/reopened after Done · Source: Jira transitions',
          bands: b4down('<5%', '5-9%', '10-19%', '≥20%'),
          relKey: 'metrics.cat.ror.rel', rel: 'Natural mirror of PPI; same Jira bug set',
        }),
        card({
          id: 'dir', acronym: 'DIR',
          titleKey: 'metrics.cat.dir.title', title: 'Duplicate / Invalid Ratio',
          descKey: 'metrics.cat.dir.desc',
          desc: 'Noise tickets (invalid + duplicate) over all reported bugs. RBD focuses on real defects; DIR isolates ticket waste.',
          formula: '= (ΣInvalid + ΣDuplicate) / ΣBug × 100%',
          noteKey: 'metrics.cat.dir.note',
          note: 'Invalid + Duplicate resolutions only · Source: Jira resolution field',
          bands: b4down('<5%', '5-9%', '10-19%', '≥20%'),
          relKey: 'metrics.cat.dir.rel', rel: 'Splits RBD noise into actionable ticket hygiene',
        }),
      ],
    },
    {
      titleKey: 'metrics.cat.g3.title', title: 'Automation & CI',
      introKey: 'metrics.cat.g3.intro',
      intro: 'Raises Flakiness and TPI from sparklines to formulable signals: ROI, signal quality, recovery, and coverage lag.',
      cards: [
        card({
          id: 'arr', acronym: 'ARR',
          titleKey: 'metrics.cat.arr.title', title: 'Automation ROI Ratio',
          descKey: 'metrics.cat.arr.desc',
          desc: 'Hours saved by automation versus hours spent maintaining the suite. Makes the qametrics story measurable per sprint.',
          formula: '= HoursSaved / HoursMaintained',
          noteKey: 'metrics.cat.arr.note',
          note: 'Saved = manual cycles avoided · Maintained = authoring + flake fixes · Source: Sheets + CI timing',
          bands: b4('<1.0', '1.0-1.9', '2.0-3.9', '≥4.0'),
          relKey: 'metrics.cat.arr.rel', rel: 'Narrative link to qametrics (1-3h/sprint to minutes)',
        }),
        card({
          id: 'sfr', acronym: 'SFR',
          titleKey: 'metrics.cat.sfr.title', title: 'Signal-to-Flake Ratio',
          descKey: 'metrics.cat.sfr.desc',
          desc: 'Real failures divided by real failures plus flakes. More actionable than flake% alone when deciding to trust CI.',
          formula: '= ΣRealFails / (ΣRealFails + ΣFlakes)',
          noteKey: 'metrics.cat.sfr.note',
          note: 'Flake = failed then passed on retry without code change · Source: Cypress Cloud / CI',
          bands: b4('<0.70', '0.70-0.84', '0.85-0.94', '≥0.95'),
          relKey: 'metrics.cat.sfr.rel', rel: 'Upgrades the Flakiness study card into a decision metric',
        }),
        card({
          id: 'mttg', acronym: 'MTTG',
          titleKey: 'metrics.cat.mttg.title', title: 'Mean Time to Green',
          descKey: 'metrics.cat.mttg.desc',
          desc: 'Average wall time from a red CI run to the next green on the same pipeline. Cost of an unstable suite.',
          formula: '= mean(GreenAt − RedAt)',
          noteKey: 'metrics.cat.mttg.note',
          note: 'Per primary QA pipeline (E2E/API) · Source: GitHub Actions / Cypress Cloud',
          bands: b4down('<30m', '30-89m', '1.5-4h', '>4h'),
          relKey: 'metrics.cat.mttg.rel', rel: 'Pairs with SFR; shows operational cost of flake',
        }),
        card({
          id: 'clr', acronym: 'CLR',
          titleKey: 'metrics.cat.clr.title', title: 'Coverage Lag Rate',
          descKey: 'metrics.cat.clr.desc',
          desc: 'Share of stories that shipped code without a new automated test in the same sprint. Shift-left without vanity coverage%.',
          formula: '= ΣStoriesWithoutNewTest / ΣStoriesWithCode × 100%',
          noteKey: 'metrics.cat.clr.note',
          note: 'Exclude pure docs/config · Source: Jira + PR test file diff',
          bands: b4down('<10%', '10-24%', '25-39%', '≥40%'),
          relKey: 'metrics.cat.clr.rel', rel: 'Complements TPI; pressures same-sprint automation',
        }),
      ],
    },
    {
      titleKey: 'metrics.cat.g4.title', title: 'Release & risk',
      introKey: 'metrics.cat.g4.intro',
      intro: 'Go/no-go and post-release cost: readiness composite, hotfix load, and change without test evidence.',
      cards: [
        card({
          id: 'rri', acronym: 'RRI',
          titleKey: 'metrics.cat.rri.title', title: 'Release Readiness Index',
          descKey: 'metrics.cat.rri.desc',
          desc: 'Composite 0-100 score from escapes, open Blocker/Critical, flake, and SRM. A numeric go/no-go aligned to senior QA ownership.',
          formula: '= weighted(DER, OpenSev, SFR, SRM) → 0-100',
          noteKey: 'metrics.cat.rri.note',
          note: 'Weights tuned per product risk · Source: Jira + CI + DER sheet',
          bands: b4('<60', '60-74', '75-89', '90-100'),
          relKey: 'metrics.cat.rri.rel', rel: 'Rolls up DER, Flakiness, SRM, severity into one gate',
        }),
        card({
          id: 'hfr', acronym: 'HFR',
          titleKey: 'metrics.cat.hfr.title', title: 'Hotfix Frequency',
          descKey: 'metrics.cat.hfr.desc',
          desc: 'Hotfixes divided by planned releases in the period. Complements DER with operational cost after escape.',
          formula: '= ΣHotfixes / ΣPlannedReleases',
          noteKey: 'metrics.cat.hfr.note',
          note: 'Hotfix = unplanned prod fix train · Source: release calendar + Jira',
          bands: b4down('0', '≤0.25', '0.26-0.50', '>0.50'),
          relKey: 'metrics.cat.hfr.rel', rel: 'Pairs with DER; shows blast radius after escape',
        }),
        card({
          id: 'crv', acronym: 'CRV',
          titleKey: 'metrics.cat.crv.title', title: 'Change Risk Violations',
          descKey: 'metrics.cat.crv.desc',
          desc: 'Deploys (or CRs) that changed in-scope code without linked test evidence. Closes the loop on post-deploy verification.',
          formula: '= ΣDeploysWithoutEvidence / ΣDeploys × 100%',
          noteKey: 'metrics.cat.crv.note',
          note: 'Evidence = automated run or signed manual pack on changed scope · Source: CR + CI artifacts',
          bands: b4down('0%', '1-5%', '6-14%', '≥15%'),
          relKey: 'metrics.cat.crv.rel', rel: 'Formalizes CR verification / go-no-go discipline',
        }),
      ],
    },
    {
      titleKey: 'metrics.cat.g5.title', title: 'Regulated domain',
      introKey: 'metrics.cat.g5.intro',
      intro: 'KYC/CLP-specific signals that generic escape rate cannot tell: compliance escapes and IDV/MFA gate reliability.',
      cards: [
        card({
          id: 'cde', acronym: 'CDE',
          titleKey: 'metrics.cat.cde.title', title: 'Compliance Defect Escape',
          descKey: 'metrics.cat.cde.desc',
          desc: 'PROD escapes limited to regulated flows (KYC, tax, MFA, IDV). DER for the compliance slice only.',
          formula: '= ΣComplianceEscapes / ΣComplianceChanges × 100%',
          noteKey: 'metrics.cat.cde.note',
          note: 'Tag bugs with compliance=true · Source: Jira labels + release notes',
          bands: b4down('0%', '≤2%', '3-5%', '>5%'),
          relKey: 'metrics.cat.cde.rel', rel: 'Domain-specific DER for KYC/CLP storytelling',
        }),
        card({
          id: 'igr', acronym: 'IGR',
          titleKey: 'metrics.cat.igr.title', title: 'IDV / Gate Reliability',
          descKey: 'metrics.cat.igr.desc',
          desc: 'Correct approve/reject outcomes for IDV and MFA gates in SIT versus expected fixtures (Mitek, TOTP, document paths).',
          formula: '= ΣCorrectGateOutcomes / ΣGateAttempts × 100%',
          noteKey: 'metrics.cat.igr.note',
          note: 'Includes selfie/doc approve+reject and MFA success/fail paths · Source: SIT runs + device lab',
          bands: b4('<95%', '95-<98%', '98-<99.5%', '≥99.5%'),
          relKey: 'metrics.cat.igr.rel', rel: 'Unique mobile+compliance metric from Mitek/MFA work',
        }),
      ],
    },
  ];

  let html = `
      <!-- Candidate metrics catalog · below current study sparklines -->
      <div class="metrics-catalog toc-subsection" id="metrics-catalog">
        <div class="metric-sep" style="margin-top:0">
          <span data-i18n="metrics.cat.label">Candidate metrics catalog</span>
        </div>

        <div class="metrics-adv-study">
          <span class="metrics-adv-study-icon" aria-hidden="true">🧪</span>
          <p data-i18n="metrics.cat.study">Catalog of <strong>candidate metrics</strong> I want to define next (formula, bands, Jira/CI source). Not instrumented yet; each card is a design brief so the PPI · SRM · RBD pattern can expand without inventing vanity KPIs.</p>
        </div>
`;

  for (const g of groups) {
    html += `
        <div class="metrics-catalog-group">
          <h3 class="metrics-subtitle" data-i18n="${g.titleKey}">${g.title}</h3>
          <p class="metrics-adv-intro" data-i18n="${g.introKey}">${g.intro}</p>
          <div class="metrics-catalog-grid">
${g.cards.join('\n')}
          </div>
        </div>`;
  }

  html += `
        <p class="metrics-trends-note" data-i18n="metrics.cat.note">Catalog only · bands are draft proposals until collected on real sprints</p>
      </div><!-- /metrics-catalog -->
`;

  const insertNeedle = `      </div><!-- /metrics-extended -->

      <!-- Test pyramid · independent subsection -->`;
  if (!s.includes(insertNeedle)) throw new Error('insert needle missing');
  s = s.replace(insertNeedle, `      </div><!-- /metrics-extended -->
${html}
      <!-- Test pyramid · independent subsection -->`);

  // TOC icon
  if (!s.includes("ICONS['metrics-catalog']")) {
    s = s.replace(
      "ICONS['metrics-extended'] = ICONS.metrics;",
      "ICONS['metrics-extended'] = ICONS.metrics;\n      ICONS['metrics-catalog'] = ICONS.metrics;"
    );
  }

  // i18n EN
  const enBlock = `        'metrics.cat.label': 'Candidate metrics catalog',
        'metrics.cat.badge': 'In study',
        'metrics.cat.study': 'Catalog of <strong>candidate metrics</strong> I want to define next (formula, bands, Jira/CI source). Not instrumented yet; each card is a design brief so the PPI · SRM · RBD pattern can expand without inventing vanity KPIs.',
        'metrics.cat.note': 'Catalog only · bands are draft proposals until collected on real sprints',
        'metrics.cat.g1.title': 'Handoff & prevention',
        'metrics.cat.g1.intro': 'Signals that explain SRM and Task Score: readiness before QA starts, not only defects after.',
        'metrics.cat.g2.title': 'Defect cycle',
        'metrics.cat.g2.intro': 'Complements PPI and RBD: reopen quality, resolve speed by severity, and ticket noise.',
        'metrics.cat.g3.title': 'Automation & CI',
        'metrics.cat.g3.intro': 'Raises Flakiness and TPI from sparklines to formulable signals: ROI, signal quality, recovery, and coverage lag.',
        'metrics.cat.g4.title': 'Release & risk',
        'metrics.cat.g4.intro': 'Go/no-go and post-release cost: readiness composite, hotfix load, and change without test evidence.',
        'metrics.cat.g5.title': 'Regulated domain',
        'metrics.cat.g5.intro': 'KYC/CLP-specific signals that generic escape rate cannot tell: compliance escapes and IDV/MFA gate reliability.',
        'metrics.cat.acr.title': 'AC Clarity Rate',
        'metrics.cat.acr.desc': 'Share of stories whose acceptance criteria are testable before kickoff. Low ACR usually precedes Simple Rejects.',
        'metrics.cat.acr.note': 'Testable AC = given/when/then or equivalent checkable outcomes · Source: Jira + refinement checklist',
        'metrics.cat.acr.rel': '<strong>Related:</strong> Explains SRM; pair with Task Score refinement gates',
        'metrics.cat.dof.title': 'Definition of Done Failures',
        'metrics.cat.dof.desc': 'Count of tasks that failed Definition of Done at QA intake in the sprint. Binary complement to Task Score.',
        'metrics.cat.dof.note': 'Failed DoD = missing evidence, tests, or AC coverage at handoff · Source: Jira workflow + checklist',
        'metrics.cat.dof.rel': '<strong>Related:</strong> Sibling of SRM and Task Score criteria 1-5',
        'metrics.cat.bcr.title': 'Blocked Cycle Ratio',
        'metrics.cat.bcr.desc': 'Share of cycle time spent blocked waiting on AC, environment, or test data. Turns delay into a root-cause signal.',
        'metrics.cat.bcr.note': 'Blocked = waiting AC, env, data, or dependency · Source: Jira time-in-status',
        'metrics.cat.bcr.rel': '<strong>Related:</strong> Pairs with TTQR; explains slow handoffs without blaming QA capacity',
        'metrics.cat.ttr.title': 'Time to Resolve',
        'metrics.cat.ttr.desc': 'Median time from bug opened to closed, sliced by severity. Links the severity taxonomy to delivery speed.',
        'metrics.cat.ttr.note': 'Track Blocker/Critical separately from Minor/Low · Source: Jira · Target bands are for Critical+',
        'metrics.cat.ttr.rel': '<strong>Related:</strong> Uses severity ladder; pairs with PPI when fixes bounce',
        'metrics.cat.ror.title': 'Reopen Rate',
        'metrics.cat.ror.desc': 'Bugs reopened after close divided by bugs closed. PPI counts ping-pong while open; ROR catches premature closes.',
        'metrics.cat.ror.note': 'Reopened = status returns to open/reopened after Done · Source: Jira transitions',
        'metrics.cat.ror.rel': '<strong>Related:</strong> Natural mirror of PPI; same Jira bug set',
        'metrics.cat.dir.title': 'Duplicate / Invalid Ratio',
        'metrics.cat.dir.desc': 'Noise tickets (invalid + duplicate) over all reported bugs. RBD focuses on real defects; DIR isolates ticket waste.',
        'metrics.cat.dir.note': 'Invalid + Duplicate resolutions only · Source: Jira resolution field',
        'metrics.cat.dir.rel': '<strong>Related:</strong> Splits RBD noise into actionable ticket hygiene',
        'metrics.cat.arr.title': 'Automation ROI Ratio',
        'metrics.cat.arr.desc': 'Hours saved by automation versus hours spent maintaining the suite. Makes the qametrics story measurable per sprint.',
        'metrics.cat.arr.note': 'Saved = manual cycles avoided · Maintained = authoring + flake fixes · Source: Sheets + CI timing',
        'metrics.cat.arr.rel': '<strong>Related:</strong> Narrative link to qametrics (1-3h/sprint to minutes)',
        'metrics.cat.sfr.title': 'Signal-to-Flake Ratio',
        'metrics.cat.sfr.desc': 'Real failures divided by real failures plus flakes. More actionable than flake% alone when deciding to trust CI.',
        'metrics.cat.sfr.note': 'Flake = failed then passed on retry without code change · Source: Cypress Cloud / CI',
        'metrics.cat.sfr.rel': '<strong>Related:</strong> Upgrades the Flakiness study card into a decision metric',
        'metrics.cat.mttg.title': 'Mean Time to Green',
        'metrics.cat.mttg.desc': 'Average wall time from a red CI run to the next green on the same pipeline. Cost of an unstable suite.',
        'metrics.cat.mttg.note': 'Per primary QA pipeline (E2E/API) · Source: GitHub Actions / Cypress Cloud',
        'metrics.cat.mttg.rel': '<strong>Related:</strong> Pairs with SFR; shows operational cost of flake',
        'metrics.cat.clr.title': 'Coverage Lag Rate',
        'metrics.cat.clr.desc': 'Share of stories that shipped code without a new automated test in the same sprint. Shift-left without vanity coverage%.',
        'metrics.cat.clr.note': 'Exclude pure docs/config · Source: Jira + PR test file diff',
        'metrics.cat.clr.rel': '<strong>Related:</strong> Complements TPI; pressures same-sprint automation',
        'metrics.cat.rri.title': 'Release Readiness Index',
        'metrics.cat.rri.desc': 'Composite 0-100 score from escapes, open Blocker/Critical, flake, and SRM. A numeric go/no-go aligned to senior QA ownership.',
        'metrics.cat.rri.note': 'Weights tuned per product risk · Source: Jira + CI + DER sheet',
        'metrics.cat.rri.rel': '<strong>Related:</strong> Rolls up DER, Flakiness, SRM, severity into one gate',
        'metrics.cat.hfr.title': 'Hotfix Frequency',
        'metrics.cat.hfr.desc': 'Hotfixes divided by planned releases in the period. Complements DER with operational cost after escape.',
        'metrics.cat.hfr.note': 'Hotfix = unplanned prod fix train · Source: release calendar + Jira',
        'metrics.cat.hfr.rel': '<strong>Related:</strong> Pairs with DER; shows blast radius after escape',
        'metrics.cat.crv.title': 'Change Risk Violations',
        'metrics.cat.crv.desc': 'Deploys (or CRs) that changed in-scope code without linked test evidence. Closes the loop on post-deploy verification.',
        'metrics.cat.crv.note': 'Evidence = automated run or signed manual pack on changed scope · Source: CR + CI artifacts',
        'metrics.cat.crv.rel': '<strong>Related:</strong> Formalizes CR verification / go-no-go discipline',
        'metrics.cat.cde.title': 'Compliance Defect Escape',
        'metrics.cat.cde.desc': 'PROD escapes limited to regulated flows (KYC, tax, MFA, IDV). DER for the compliance slice only.',
        'metrics.cat.cde.note': 'Tag bugs with compliance=true · Source: Jira labels + release notes',
        'metrics.cat.cde.rel': '<strong>Related:</strong> Domain-specific DER for KYC/CLP storytelling',
        'metrics.cat.igr.title': 'IDV / Gate Reliability',
        'metrics.cat.igr.desc': 'Correct approve/reject outcomes for IDV and MFA gates in SIT versus expected fixtures (Mitek, TOTP, document paths).',
        'metrics.cat.igr.note': 'Includes selfie/doc approve+reject and MFA success/fail paths · Source: SIT runs + device lab',
        'metrics.cat.igr.rel': '<strong>Related:</strong> Unique mobile+compliance metric from Mitek/MFA work',
`;

  const enNeedle = `        'metrics.adv.note': 'Study metrics · illustrative trends for portfolio exploration',
        'metrics.pyramid.title': 'Test pyramid',`;
  if (!s.includes(enNeedle)) throw new Error('en needle missing');
  s = s.replace(enNeedle, enBlock + `        'metrics.pyramid.title': 'Test pyramid',`);

  const ptBlock = `        'metrics.cat.label': 'Catálogo de métricas candidatas',
        'metrics.cat.badge': 'Em estudo',
        'metrics.cat.study': 'Catálogo de <strong>métricas candidatas</strong> que quero definir a seguir (fórmula, faixas, fonte Jira/CI). Ainda sem instrumentação; cada card é um brief de design para expandir o padrão PPI · SRM · RBD sem inventar KPI de vaidade.',
        'metrics.cat.note': 'Somente catálogo · faixas são propostas até coletar em sprints reais',
        'metrics.cat.g1.title': 'Handoff e prevenção',
        'metrics.cat.g1.intro': 'Sinais que explicam SRM e Task Score: prontidão antes do QA começar, não só defeitos depois.',
        'metrics.cat.g2.title': 'Ciclo de defeito',
        'metrics.cat.g2.intro': 'Complementa PPI e RBD: qualidade de reopen, velocidade de resolução por severidade e ruído de ticket.',
        'metrics.cat.g3.title': 'Automação e CI',
        'metrics.cat.g3.intro': 'Eleva Flakiness e TPI de sparklines a sinais com fórmula: ROI, qualidade do sinal, recuperação e lag de cobertura.',
        'metrics.cat.g4.title': 'Release e risco',
        'metrics.cat.g4.intro': 'Go/no-go e custo pós-release: índice de readiness, carga de hotfix e mudança sem evidência de teste.',
        'metrics.cat.g5.title': 'Domínio regulado',
        'metrics.cat.g5.intro': 'Sinais KYC/CLP que escape genérico não conta: escapes de compliance e confiabilidade de gates IDV/MFA.',
        'metrics.cat.acr.title': 'AC Clarity Rate',
        'metrics.cat.acr.desc': 'Proporção de stories com critérios de aceite testáveis antes do kickoff. ACR baixo costuma anteceder Simple Rejects.',
        'metrics.cat.acr.note': 'AC testável = given/when/then ou resultado verificável · Fonte: Jira + checklist de refinement',
        'metrics.cat.acr.rel': '<strong>Relacionado:</strong> Explica SRM; combinar com gates de refinement do Task Score',
        'metrics.cat.dof.title': 'Definition of Done Failures',
        'metrics.cat.dof.desc': 'Contagem de tasks que falharam Definition of Done na entrada do QA no sprint. Complemento binário ao Task Score.',
        'metrics.cat.dof.note': 'DoD falho = falta evidência, testes ou cobertura de AC no handoff · Fonte: workflow Jira + checklist',
        'metrics.cat.dof.rel': '<strong>Relacionado:</strong> Irmão de SRM e critérios 1-5 do Task Score',
        'metrics.cat.bcr.title': 'Blocked Cycle Ratio',
        'metrics.cat.bcr.desc': 'Parcela do cycle time gasta bloqueada à espera de AC, ambiente ou massa de teste. Transforma atraso em causa-raiz.',
        'metrics.cat.bcr.note': 'Blocked = esperando AC, env, dados ou dependência · Fonte: time-in-status no Jira',
        'metrics.cat.bcr.rel': '<strong>Relacionado:</strong> Combina com TTQR; explica handoff lento sem culpar capacidade de QA',
        'metrics.cat.ttr.title': 'Time to Resolve',
        'metrics.cat.ttr.desc': 'Mediana de tempo entre abertura e fechamento do bug, fatiada por severidade. Liga a taxonomia de severidade à velocidade de entrega.',
        'metrics.cat.ttr.note': 'Acompanhar Blocker/Critical separado de Minor/Low · Fonte: Jira · Faixas-alvo para Critical+',
        'metrics.cat.ttr.rel': '<strong>Relacionado:</strong> Usa a escada de severidade; combina com PPI quando o fix volta',
        'metrics.cat.ror.title': 'Reopen Rate',
        'metrics.cat.ror.desc': 'Bugs reabertos após close divididos pelos bugs fechados. PPI conta ping-pong em aberto; ROR pega close prematuro.',
        'metrics.cat.ror.note': 'Reopened = status volta a open/reopened após Done · Fonte: transições Jira',
        'metrics.cat.ror.rel': '<strong>Relacionado:</strong> Espelho natural do PPI; mesmo conjunto de bugs no Jira',
        'metrics.cat.dir.title': 'Duplicate / Invalid Ratio',
        'metrics.cat.dir.desc': 'Tickets de ruído (invalid + duplicate) sobre todos os bugs reportados. RBD foca defeito real; DIR isola desperdício de ticket.',
        'metrics.cat.dir.note': 'Somente resoluções Invalid + Duplicate · Fonte: campo resolution no Jira',
        'metrics.cat.dir.rel': '<strong>Relacionado:</strong> Separa o ruído do RBD em higiene acionável de ticket',
        'metrics.cat.arr.title': 'Automation ROI Ratio',
        'metrics.cat.arr.desc': 'Horas economizadas pela automação versus horas gastas mantendo a suite. Torna a história do qametrics mensurável por sprint.',
        'metrics.cat.arr.note': 'Saved = ciclos manuais evitados · Maintained = escrita + correção de flake · Fonte: Sheets + timing de CI',
        'metrics.cat.arr.rel': '<strong>Relacionado:</strong> Elo narrativo com qametrics (1-3h/sprint para minutos)',
        'metrics.cat.sfr.title': 'Signal-to-Flake Ratio',
        'metrics.cat.sfr.desc': 'Falhas reais divididas por falhas reais mais flakes. Mais acionável que flake% sozinho na hora de confiar na CI.',
        'metrics.cat.sfr.note': 'Flake = falhou e passou no retry sem mudança de código · Fonte: Cypress Cloud / CI',
        'metrics.cat.sfr.rel': '<strong>Relacionado:</strong> Eleva o card de Flakiness a métrica de decisão',
        'metrics.cat.mttg.title': 'Mean Time to Green',
        'metrics.cat.mttg.desc': 'Tempo médio de parede de um run vermelho até o próximo verde na mesma pipeline. Custo de uma suite instável.',
        'metrics.cat.mttg.note': 'Por pipeline principal de QA (E2E/API) · Fonte: GitHub Actions / Cypress Cloud',
        'metrics.cat.mttg.rel': '<strong>Relacionado:</strong> Combina com SFR; mostra custo operacional do flake',
        'metrics.cat.clr.title': 'Coverage Lag Rate',
        'metrics.cat.clr.desc': 'Parcela de stories que subiram código sem teste automatizado novo na mesma sprint. Shift-left sem coverage% de vaidade.',
        'metrics.cat.clr.note': 'Excluir docs/config puros · Fonte: Jira + diff de arquivos de teste no PR',
        'metrics.cat.clr.rel': '<strong>Relacionado:</strong> Complementa TPI; pressiona automação na mesma sprint',
        'metrics.cat.rri.title': 'Release Readiness Index',
        'metrics.cat.rri.desc': 'Score composto 0-100 a partir de escapes, Blocker/Critical abertos, flake e SRM. Go/no-go numérico alinhado a ownership de QA sênior.',
        'metrics.cat.rri.note': 'Pesos ajustados ao risco do produto · Fonte: Jira + CI + planilha DER',
        'metrics.cat.rri.rel': '<strong>Relacionado:</strong> Consolida DER, Flakiness, SRM e severidade num gate',
        'metrics.cat.hfr.title': 'Hotfix Frequency',
        'metrics.cat.hfr.desc': 'Hotfixes divididos pelos releases planejados no período. Complementa DER com custo operacional após escape.',
        'metrics.cat.hfr.note': 'Hotfix = trem de correção não planejado em prod · Fonte: calendário de release + Jira',
        'metrics.cat.hfr.rel': '<strong>Relacionado:</strong> Combina com DER; mostra blast radius após escape',
        'metrics.cat.crv.title': 'Change Risk Violations',
        'metrics.cat.crv.desc': 'Deploys (ou CRs) que mudaram código no escopo sem evidência de teste ligada. Fecha o loop da verificação pós-deploy.',
        'metrics.cat.crv.note': 'Evidência = run automatizado ou pacote manual assinado no escopo alterado · Fonte: CR + artefatos de CI',
        'metrics.cat.crv.rel': '<strong>Relacionado:</strong> Formaliza disciplina de CR verification / go-no-go',
        'metrics.cat.cde.title': 'Compliance Defect Escape',
        'metrics.cat.cde.desc': 'Escapes de PROD limitados a fluxos regulados (KYC, tax, MFA, IDV). DER só da fatia de compliance.',
        'metrics.cat.cde.note': 'Tagar bugs com compliance=true · Fonte: labels Jira + release notes',
        'metrics.cat.cde.rel': '<strong>Relacionado:</strong> DER de domínio para storytelling KYC/CLP',
        'metrics.cat.igr.title': 'IDV / Gate Reliability',
        'metrics.cat.igr.desc': 'Taxa de approve/reject corretos em gates de IDV e MFA no SIT versus fixtures esperadas (Mitek, TOTP, documentos).',
        'metrics.cat.igr.note': 'Inclui selfie/doc approve+reject e caminhos MFA sucesso/falha · Fonte: runs SIT + lab de devices',
        'metrics.cat.igr.rel': '<strong>Relacionado:</strong> Métrica única mobile+compliance do trabalho Mitek/MFA',
`;

  const ptNeedle = `        'metrics.adv.note': 'Métricas em estudo · tendências ilustrativas para exploração no portfolio',
        'metrics.pyramid.title': 'Pirâmide de testes',`;
  if (!s.includes(ptNeedle)) throw new Error('pt needle missing');
  s = s.replace(ptNeedle, ptBlock + `        'metrics.pyramid.title': 'Pirâmide de testes',`);

  console.log('catalog inserted', (s.match(/metric-study-card/g) || []).length, 'cards');
}

// ── Pyramid as card (subsection still independent) ──
const pyramidBare = `      <div class="toc-subsection" id="test-pyramid">
        <div class="metric-sep" style="margin-top:0">
          <span data-i18n="metrics.pyramid.title">Test pyramid</span>
        </div>`;

const pyramidCard = `      <div class="metrics-pyramid-section toc-subsection" id="test-pyramid">
        <div class="metric-sep" style="margin-top:0">
          <span data-i18n="metrics.pyramid.title">Test pyramid</span>
        </div>`;

if (s.includes(pyramidBare)) {
  s = s.replace(pyramidBare, pyramidCard);
  console.log('pyramid wrapped as card section');
} else if (s.includes('metrics-pyramid-section toc-subsection')) {
  console.log('pyramid already card section');
} else {
  console.log('WARN: pyramid wrapper not found');
}

// CSS for pyramid card shell
if (!s.includes('.metrics-pyramid-section')) {
  const cssNeedle2 = `    #test-pyramid {
      margin-top: 32px;
    }`;
  const pyramidCss = `
    #test-pyramid.metrics-pyramid-section,
    .metrics-pyramid-section {
      margin-top: 28px; padding: 28px 24px 24px;
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    }
    .metrics-pyramid-section .pyramid-card {
      background: var(--surface2);
    }
`;
  if (!s.includes(cssNeedle2)) throw new Error('pyramid css needle missing');
  s = s.replace(cssNeedle2, cssNeedle2 + pyramidCss);
  console.log('pyramid card css added');
}

fs.writeFileSync(f, s);
console.log('done');
