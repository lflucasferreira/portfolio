import fs from 'fs';

const f = 'metrics.html';
let s = fs.readFileSync(f, 'utf8');

if (s.includes('initSrmSim')) {
  console.log('already patched');
  process.exit(0);
}

const cssAdd = `
    .srm-sim { display: flex; flex-direction: column; gap: 12px; }
    .srm-sim .metric-scale { overflow: hidden; border-radius: 6px; border: 1px solid var(--border); gap: 0; }
    .srm-sim .metric-scale-item {
      border-radius: 0; opacity: 0.45;
      transition: opacity 0.25s ease, box-shadow 0.25s ease;
    }
    .srm-sim .metric-scale-item.is-active {
      opacity: 1;
      box-shadow: inset 0 0 0 2px currentColor;
    }
    .srm-tier-ideal { flex: 1 1 0% !important; }
    .srm-tier-acceptable { flex: 2 1 0% !important; }
    .srm-tier-warning { flex: 3 1 0% !important; }
    .srm-tier-critical { flex: 3 1 0% !important; }
    .metric-card.is-srm-ideal { border-color: rgba(52,211,153,0.45); }
    .metric-card.is-srm-acceptable { border-color: rgba(79,114,255,0.45); }
    .metric-card.is-srm-warning { border-color: rgba(251,191,36,0.5); }
    .metric-card.is-srm-critical { border-color: rgba(239,68,68,0.45); }
    .ppi-live-tier.is-ideal { background: rgba(52,211,153,0.1); color: var(--green); border-color: rgba(52,211,153,0.25); }
    .ppi-live-tier.is-acceptable { background: rgba(79,114,255,0.1); color: var(--accent); border-color: rgba(79,114,255,0.25); }
    .ppi-live-tier.is-warning { background: rgba(251,191,36,0.1); color: var(--yellow); border-color: rgba(251,191,36,0.25); }
    .ppi-live-tier.is-critical { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.25); }
`;

const cssAnchor = `    .ppi-hint {
      font-size: 0.68rem; font-family: var(--mono); color: var(--text-3); line-height: 1.45;
    }

    .metric-problems { display: flex; flex-direction: column; gap: 6px; }`;

if (!s.includes(cssAnchor)) throw new Error('css anchor miss');
s = s.replace(cssAnchor, `    .ppi-hint {
      font-size: 0.68rem; font-family: var(--mono); color: var(--text-3); line-height: 1.45;
    }
${cssAdd}
    .metric-problems { display: flex; flex-direction: column; gap: 6px; }`);

const htmlOld = `        <!-- SRM -->
        <div class="metric-card">
          <div class="metric-card-top">
            <div class="metric-acronym">SRM</div>
            <div>
              <h3 data-i18n="srm.title">Simple Rejection Metric</h3>
              <p class="metric-desc" data-i18n="srm.desc">Count of tasks returned to dev before testing even begins — because too many acceptance criteria were unimplemented. A raw count per sprint; lower is better, 0 is the goal.</p>
            </div>
          </div>
          <div class="metric-formula">
            <span class="mf-key">SRM</span> = tasks rejected before testing begins (count per sprint)
            <span class="mf-note">Rejection requires a formal comment listing missing ACs · tracked per developer and per sprint</span>
          </div>
          <div class="metric-scale">
            <div class="metric-scale-item" style="background:rgba(52,211,153,0.1);color:var(--green);">Ideal<span>0</span></div>
            <div class="metric-scale-item" style="background:rgba(79,114,255,0.1);color:var(--accent);">Acceptable<span>1–2</span></div>
            <div class="metric-scale-item" style="background:rgba(251,191,36,0.09);color:var(--yellow);">Warning<span>3–5</span></div>
            <div class="metric-scale-item" style="background:rgba(239,68,68,0.09);color:#ef4444;">Critical<span>&gt;5</span></div>
          </div>
          <div class="metric-problems">
            <div class="metric-problem" data-i18n="srm.p1">Forces AC alignment before work reaches QA — eliminating wasted test cycles at the source</div>
            <div class="metric-problem" data-i18n="srm.p2">Per-developer tracking identifies who needs clearer requirements or stricter pre-QA checklists</div>
            <div class="metric-problem" data-i18n="srm.p3">Consistently hitting 0 for multiple sprints is the strongest signal of a mature dev–QA handoff</div>
          </div>
        </div>`;

const htmlNew = `        <!-- SRM -->
        <div class="metric-card is-srm-ideal" id="srm-card">
          <div class="metric-card-top">
            <div class="metric-acronym">SRM</div>
            <div>
              <h3 data-i18n="srm.title">Simple Rejection Metric</h3>
              <p class="metric-desc" data-i18n="srm.desc">Count of tasks returned to dev before testing even begins — because too many acceptance criteria were unimplemented. A raw count per sprint; lower is better, 0 is the goal.</p>
            </div>
          </div>
          <div class="metric-formula">
            <span class="mf-key">SRM</span> = tasks rejected before testing begins (count per sprint)
            <span class="mf-note" data-i18n="srm.formula.note">Rejection requires a formal comment listing missing ACs · tracked per developer and per sprint</span>
          </div>

          <div class="srm-sim" id="srm-sim">
            <p class="ppi-hint" data-i18n="srm.sim.hint">Adjust rejected-task count for the sprint. 0 is Ideal · lower is better.</p>

            <div class="ppi-live">
              <span class="ppi-live-eq">SRM = <strong id="srm-live-val">0</strong> <span data-i18n="srm.sim.unit">rejected tasks</span></span>
              <span class="ppi-live-tier is-ideal" id="srm-live-tier">Ideal</span>
            </div>

            <div class="ppi-scale-track">
              <div class="ppi-scale-arrow" id="srm-scale-arrow" style="left: 0%" aria-hidden="true">
                <span class="ppi-scale-arrow-label" id="srm-arrow-label">0</span>
                <span class="ppi-scale-arrow-head"></span>
              </div>
              <div class="metric-scale" role="img" aria-label="SRM scale 0 to 8+">
                <div class="metric-scale-item srm-tier-ideal is-active" data-tier="ideal" style="background:rgba(52,211,153,0.1);color:var(--green);">Ideal<span>0</span></div>
                <div class="metric-scale-item srm-tier-acceptable" data-tier="acceptable" style="background:rgba(79,114,255,0.1);color:var(--accent);">Acceptable<span>1–2</span></div>
                <div class="metric-scale-item srm-tier-warning" data-tier="warning" style="background:rgba(251,191,36,0.09);color:var(--yellow);">Warning<span>3–5</span></div>
                <div class="metric-scale-item srm-tier-critical" data-tier="critical" style="background:rgba(239,68,68,0.09);color:#ef4444;">Critical<span>&gt;5</span></div>
              </div>
            </div>

            <div class="ppi-sim-controls" style="grid-template-columns: 1fr;">
              <div class="ppi-ctrl">
                <span class="ppi-ctrl-label" data-i18n="srm.sim.count">Rejected tasks / sprint</span>
                <div class="ppi-ctrl-row">
                  <button type="button" class="ppi-btn" data-srm="dec" aria-label="Decrease rejections">−</button>
                  <span class="ppi-ctrl-val" id="srm-count-val">0</span>
                  <button type="button" class="ppi-btn" data-srm="inc" aria-label="Increase rejections">+</button>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-problems">
            <div class="metric-problem" data-i18n="srm.p1">Forces AC alignment before work reaches QA — eliminating wasted test cycles at the source</div>
            <div class="metric-problem" data-i18n="srm.p2">Per-developer tracking identifies who needs clearer requirements or stricter pre-QA checklists</div>
            <div class="metric-problem" data-i18n="srm.p3">Consistently hitting 0 for multiple sprints is the strongest signal of a mature dev–QA handoff</div>
          </div>
          <div class="metric-formula" id="srm-result-box" style="margin-top:12px;background:rgba(52,211,153,0.07);border-color:rgba(52,211,153,0.25);">
            <span class="mf-key" id="srm-result-key" style="color:var(--green);">Simulated SRM · Ideal</span>
            <span class="mf-note" data-i18n="srm.result.note">Demo count — not a client sprint. Goal is sustained 0.</span>
          </div>
        </div>`;

if (!s.includes(htmlOld)) throw new Error('html miss');
s = s.replace(htmlOld, htmlNew);

s = s.replace(
  "'srm.title': 'Simple Rejection Metric',\n        'srm.desc': 'Count of tasks",
  `'srm.title': 'Simple Rejection Metric',
        'srm.sim.hint': 'Adjust rejected-task count for the sprint. 0 is Ideal · lower is better.',
        'srm.sim.count': 'Rejected tasks / sprint',
        'srm.sim.unit': 'rejected tasks',
        'srm.formula.note': 'Rejection requires a formal comment listing missing ACs · tracked per developer and per sprint',
        'srm.result.note': 'Demo count — not a client sprint. Goal is sustained 0.',
        'srm.tier.ideal': 'Ideal', 'srm.tier.acceptable': 'Acceptable', 'srm.tier.warning': 'Warning', 'srm.tier.critical': 'Critical',
        'srm.desc': 'Count of tasks`
);

// PT block
if (!s.includes("'srm.sim.hint': 'Ajuste")) {
  s = s.replace(
    "'srm.title': 'Simple Rejection Metric',\n        'srm.desc': 'Contagem de tarefas",
    `'srm.title': 'Simple Rejection Metric',
        'srm.sim.hint': 'Ajuste a contagem de tarefas rejeitadas no sprint. 0 é Ideal · quanto menor, melhor.',
        'srm.sim.count': 'Tarefas rejeitadas / sprint',
        'srm.sim.unit': 'tarefas rejeitadas',
        'srm.formula.note': 'A rejeição exige comentário formal listando ACs faltantes · rastreado por desenvolvedor e por sprint',
        'srm.result.note': 'Contagem de demo — não é um sprint de cliente. A meta é sustentar 0.',
        'srm.tier.ideal': 'Ideal', 'srm.tier.acceptable': 'Acceptable', 'srm.tier.warning': 'Warning', 'srm.tier.critical': 'Critical',
        'srm.desc': 'Contagem de tarefas`
  );
}

const js = `
  <script>
    (function initSrmSim() {
      const card = document.getElementById('srm-card');
      const root = document.getElementById('srm-sim');
      if (!card || !root) return;

      let count = 0;
      const MIN = 0;
      const MAX = 12;
      const SCALE_MAX = 8;

      const countVal = document.getElementById('srm-count-val');
      const liveVal = document.getElementById('srm-live-val');
      const liveTier = document.getElementById('srm-live-tier');
      const arrow = document.getElementById('srm-scale-arrow');
      const arrowLabel = document.getElementById('srm-arrow-label');
      const tiers = [...root.querySelectorAll('.metric-scale-item[data-tier]')];
      const resultKey = document.getElementById('srm-result-key');
      const resultBox = document.getElementById('srm-result-box');
      const btnDec = root.querySelector('[data-srm="dec"]');
      const btnInc = root.querySelector('[data-srm="inc"]');

      const TIER_COLORS = {
        ideal: { key: 'var(--green)', bg: 'rgba(52,211,153,0.07)', border: 'rgba(52,211,153,0.25)' },
        acceptable: { key: 'var(--accent)', bg: 'rgba(79,114,255,0.07)', border: 'rgba(79,114,255,0.25)' },
        warning: { key: 'var(--yellow)', bg: 'rgba(251,191,36,0.07)', border: 'rgba(251,191,36,0.28)' },
        critical: { key: '#ef4444', bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.25)' },
      };
      const TIER_NAME = {
        en: { ideal: 'Ideal', acceptable: 'Acceptable', warning: 'Warning', critical: 'Critical' },
        pt: { ideal: 'Ideal', acceptable: 'Acceptable', warning: 'Warning', critical: 'Critical' },
      };

      function lang() {
        return document.documentElement.getAttribute('data-lang') || 'en';
      }

      function tierFor(n) {
        if (n <= 0) return 'ideal';
        if (n <= 2) return 'acceptable';
        if (n <= 5) return 'warning';
        return 'critical';
      }

      function tierName(key) {
        return (TIER_NAME[lang()] || TIER_NAME.en)[key] || key;
      }

      function resultLabel(tier) {
        return lang() === 'pt'
          ? ('SRM simulado · ' + tierName(tier))
          : ('Simulated SRM · ' + tierName(tier));
      }

      function update() {
        const key = tierFor(count);
        const colors = TIER_COLORS[key];
        const arrowPct = (Math.min(count, SCALE_MAX) / SCALE_MAX) * 100;

        countVal.textContent = String(count);
        liveVal.textContent = String(count);
        liveTier.textContent = tierName(key);
        liveTier.className = 'ppi-live-tier is-' + key;

        arrow.style.left = arrowPct + '%';
        arrowLabel.textContent = String(count);

        tiers.forEach((t) => t.classList.toggle('is-active', t.dataset.tier === key));

        card.classList.remove('is-srm-ideal', 'is-srm-acceptable', 'is-srm-warning', 'is-srm-critical');
        card.classList.add('is-srm-' + key);

        if (resultKey) {
          resultKey.textContent = resultLabel(key);
          resultKey.style.color = colors.key;
        }
        if (resultBox) {
          resultBox.style.background = colors.bg;
          resultBox.style.borderColor = colors.border;
        }

        btnDec.disabled = count <= MIN;
        btnInc.disabled = count >= MAX;
      }

      root.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-srm]');
        if (!btn || btn.disabled) return;
        const action = btn.getAttribute('data-srm');
        if (action === 'inc') count = Math.min(MAX, count + 1);
        else if (action === 'dec') count = Math.max(MIN, count - 1);
        update();
      });

      document.addEventListener('portfolio:i18n', update);
      update();
    })();
  </script>
`;

s = s.replace('</body>', js + '\n</body>');
fs.writeFileSync(f, s);
console.log({
  sim: s.includes('initSrmSim'),
  en: s.includes('Adjust rejected-task count'),
  pt: s.includes('Ajuste a contagem de tarefas rejeitadas'),
});
