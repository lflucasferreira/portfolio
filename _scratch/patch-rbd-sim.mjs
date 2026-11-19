import fs from 'fs';

const f = 'metrics.html';
let s = fs.readFileSync(f, 'utf8');

if (s.includes('initRbdSim')) {
  console.log('already patched');
  process.exit(0);
}

const cssAdd = `
    .rbd-sim { display: flex; flex-direction: column; gap: 12px; }
    .rbd-sim .metric-scale { overflow: hidden; border-radius: 6px; border: 1px solid var(--border); gap: 0; }
    .rbd-sim .metric-scale-item {
      border-radius: 0; opacity: 0.45;
      transition: opacity 0.25s ease, box-shadow 0.25s ease;
    }
    .rbd-sim .metric-scale-item.is-active {
      opacity: 1;
      box-shadow: inset 0 0 0 2px currentColor;
    }
    .rbd-tier-poor { flex: 70 1 0% !important; }
    .rbd-tier-fair { flex: 15 1 0% !important; }
    .rbd-tier-good { flex: 10 1 0% !important; }
    .rbd-tier-excellent { flex: 5 1 0% !important; }
    .metric-card.is-rbd-poor { border-color: rgba(239,68,68,0.45); }
    .metric-card.is-rbd-fair { border-color: rgba(251,191,36,0.5); }
    .metric-card.is-rbd-good { border-color: rgba(79,114,255,0.45); }
    .metric-card.is-rbd-excellent { border-color: rgba(52,211,153,0.45); }
`;

const cssAnchor = `    .metric-card.is-srm-critical { border-color: rgba(239,68,68,0.45); }`;
if (!s.includes(cssAnchor)) throw new Error('css anchor miss');
s = s.replace(cssAnchor, cssAnchor + '\n' + cssAdd);

const htmlOld = `        <!-- RBD -->
        <div class="metric-card">
          <div class="metric-card-top">
            <div class="metric-acronym">RBD</div>
            <div>
              <h3 data-i18n="rbd.title">Real Bug Detection</h3>
              <p class="metric-desc" data-i18n="rbd.desc">Percentage of reported issues that are genuine defects. Captures the cost of false positives — time spent opening, analyzing, and closing tickets that weren't real bugs.</p>
            </div>
          </div>
          <div class="metric-formula">
            <span class="mf-key">RBD</span> = (ΣBug − NoRealBug) / ΣBug × 100%
            <span class="mf-note">NoRealBug = issues closed as "Invalid" · 100% = every reported ticket was a real defect</span>
          </div>
          <div class="metric-scale">
            <div class="metric-scale-item" style="background:rgba(239,68,68,0.09);color:#ef4444;">Poor<span>&lt;70%</span></div>
            <div class="metric-scale-item" style="background:rgba(251,191,36,0.09);color:var(--yellow);">Fair<span>70–84%</span></div>
            <div class="metric-scale-item" style="background:rgba(79,114,255,0.1);color:var(--accent);">Good<span>85–94%</span></div>
            <div class="metric-scale-item" style="background:rgba(52,211,153,0.1);color:var(--green);">Excellent<span>95–100%</span></div>
          </div>
          <div class="metric-problems">
            <div class="metric-problem" data-i18n="rbd.p1">Reflects QA's grasp of acceptance criteria — low RBD suggests requirements need more precision</div>
            <div class="metric-problem" data-i18n="rbd.p2">Quantifies wasted dev effort: each false positive consumes time to investigate and close</div>
            <div class="metric-problem" data-i18n="rbd.p3">Indicates whether QA has adequate time to test — rushed cycles produce more false positives</div>
          </div>
        </div>`;

const htmlNew = `        <!-- RBD -->
        <div class="metric-card is-rbd-excellent" id="rbd-card">
          <div class="metric-card-top">
            <div class="metric-acronym">RBD</div>
            <div>
              <h3 data-i18n="rbd.title">Real Bug Detection</h3>
              <p class="metric-desc" data-i18n="rbd.desc">Percentage of reported issues that are genuine defects. Captures the cost of false positives — time spent opening, analyzing, and closing tickets that weren't real bugs.</p>
            </div>
          </div>
          <div class="metric-formula">
            <span class="mf-key">RBD</span> = (ΣBug − NoRealBug) / ΣBug × 100%
            <span class="mf-note" data-i18n="rbd.formula.note">NoRealBug = issues closed as "Invalid" · 100% = every reported ticket was a real defect</span>
          </div>

          <div class="rbd-sim" id="rbd-sim">
            <p class="ppi-hint" data-i18n="rbd.sim.hint">NoRealBug ≤ ΣBug. With 0 bugs, NoRealBug stays at 0 (disabled) and RBD is 100% Excellent.</p>

            <div class="ppi-live">
              <span class="ppi-live-eq">RBD = (<span id="rbd-eq-bugs">10</span> − <span id="rbd-eq-invalid">0</span>) / <span id="rbd-eq-den">10</span> = <strong id="rbd-live-val">100%</strong></span>
              <span class="ppi-live-tier is-excellent" id="rbd-live-tier">Excellent</span>
            </div>

            <div class="ppi-scale-track">
              <div class="ppi-scale-arrow" id="rbd-scale-arrow" style="left: 100%" aria-hidden="true">
                <span class="ppi-scale-arrow-label" id="rbd-arrow-label">100%</span>
                <span class="ppi-scale-arrow-head"></span>
              </div>
              <div class="metric-scale" role="img" aria-label="RBD scale 0% to 100%">
                <div class="metric-scale-item rbd-tier-poor" data-tier="poor" style="background:rgba(239,68,68,0.09);color:#ef4444;">Poor<span>&lt;70%</span></div>
                <div class="metric-scale-item rbd-tier-fair" data-tier="fair" style="background:rgba(251,191,36,0.09);color:var(--yellow);">Fair<span>70–84%</span></div>
                <div class="metric-scale-item rbd-tier-good" data-tier="good" style="background:rgba(79,114,255,0.1);color:var(--accent);">Good<span>85–94%</span></div>
                <div class="metric-scale-item rbd-tier-excellent is-active" data-tier="excellent" style="background:rgba(52,211,153,0.1);color:var(--green);">Excellent<span>95–100%</span></div>
              </div>
            </div>

            <div class="ppi-sim-controls">
              <div class="ppi-ctrl">
                <span class="ppi-ctrl-label" data-i18n="rbd.sim.bugs">ΣBug</span>
                <div class="ppi-ctrl-row">
                  <button type="button" class="ppi-btn" data-rbd="bugs-dec" aria-label="Decrease bugs">−</button>
                  <span class="ppi-ctrl-val" id="rbd-bugs-val">10</span>
                  <button type="button" class="ppi-btn" data-rbd="bugs-inc" aria-label="Increase bugs">+</button>
                </div>
              </div>
              <div class="ppi-ctrl">
                <span class="ppi-ctrl-label" data-i18n="rbd.sim.invalid">NoRealBug</span>
                <div class="ppi-ctrl-row">
                  <button type="button" class="ppi-btn" data-rbd="inv-dec" aria-label="Decrease invalid">−</button>
                  <span class="ppi-ctrl-val" id="rbd-inv-val">0</span>
                  <button type="button" class="ppi-btn" data-rbd="inv-inc" aria-label="Increase invalid">+</button>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-problems">
            <div class="metric-problem" data-i18n="rbd.p1">Reflects QA's grasp of acceptance criteria — low RBD suggests requirements need more precision</div>
            <div class="metric-problem" data-i18n="rbd.p2">Quantifies wasted dev effort: each false positive consumes time to investigate and close</div>
            <div class="metric-problem" data-i18n="rbd.p3">Indicates whether QA has adequate time to test — rushed cycles produce more false positives</div>
          </div>
          <div class="metric-formula" id="rbd-result-box" style="margin-top:12px;background:rgba(52,211,153,0.07);border-color:rgba(52,211,153,0.25);">
            <span class="mf-key" id="rbd-result-key" style="color:var(--green);">Simulated RBD · Excellent</span>
            <span class="mf-note" data-i18n="rbd.result.note">Demo values — not a client sprint. Higher % means fewer false positives.</span>
          </div>
        </div>`;

if (!s.includes(htmlOld)) throw new Error('html miss');
s = s.replace(htmlOld, htmlNew);

s = s.replace(
  "'rbd.title': 'Real Bug Detection',\n        'rbd.desc': 'Percentage of reported",
  `'rbd.title': 'Real Bug Detection',
        'rbd.sim.hint': 'NoRealBug ≤ ΣBug. With 0 bugs, NoRealBug stays at 0 (disabled) and RBD is 100% Excellent.',
        'rbd.sim.bugs': 'ΣBug',
        'rbd.sim.invalid': 'NoRealBug',
        'rbd.formula.note': 'NoRealBug = issues closed as "Invalid" · 100% = every reported ticket was a real defect',
        'rbd.result.note': 'Demo values — not a client sprint. Higher % means fewer false positives.',
        'rbd.tier.poor': 'Poor', 'rbd.tier.fair': 'Fair', 'rbd.tier.good': 'Good', 'rbd.tier.excellent': 'Excellent',
        'rbd.desc': 'Percentage of reported`
);

if (!s.includes("'rbd.sim.hint': 'NoRealBug ≤ ΣBug")) {
  // first replace only hit EN; check
}
if (!s.includes("'rbd.sim.hint': 'NoRealBug ≤ ΣBug. With 0")) {
  console.warn('EN hint may have failed');
}

s = s.replace(
  "'rbd.title': 'Real Bug Detection',\n        'rbd.desc': 'Percentual de issues",
  `'rbd.title': 'Real Bug Detection',
        'rbd.sim.hint': 'NoRealBug ≤ ΣBug. Com 0 bugs, NoRealBug fica em 0 (desabilitado) e o RBD é 100% Excellent.',
        'rbd.sim.bugs': 'ΣBug',
        'rbd.sim.invalid': 'NoRealBug',
        'rbd.formula.note': 'NoRealBug = issues fechadas como "Invalid" · 100% = todo ticket reportado era um defeito real',
        'rbd.result.note': 'Valores de demo — não é um sprint de cliente. % maior = menos falsos positivos.',
        'rbd.tier.poor': 'Poor', 'rbd.tier.fair': 'Fair', 'rbd.tier.good': 'Good', 'rbd.tier.excellent': 'Excellent',
        'rbd.desc': 'Percentual de issues`
);

const js = `
  <script>
    (function initRbdSim() {
      const card = document.getElementById('rbd-card');
      const root = document.getElementById('rbd-sim');
      if (!card || !root) return;

      let bugs = 10;
      let invalid = 0;
      const MIN_BUGS = 0;
      const MAX_BUGS = 40;

      const bugsVal = document.getElementById('rbd-bugs-val');
      const invVal = document.getElementById('rbd-inv-val');
      const eqBugs = document.getElementById('rbd-eq-bugs');
      const eqInv = document.getElementById('rbd-eq-invalid');
      const eqDen = document.getElementById('rbd-eq-den');
      const liveVal = document.getElementById('rbd-live-val');
      const liveTier = document.getElementById('rbd-live-tier');
      const arrow = document.getElementById('rbd-scale-arrow');
      const arrowLabel = document.getElementById('rbd-arrow-label');
      const tiers = [...root.querySelectorAll('.metric-scale-item[data-tier]')];
      const resultKey = document.getElementById('rbd-result-key');
      const resultBox = document.getElementById('rbd-result-box');
      const btnBugsDec = root.querySelector('[data-rbd="bugs-dec"]');
      const btnBugsInc = root.querySelector('[data-rbd="bugs-inc"]');
      const btnInvDec = root.querySelector('[data-rbd="inv-dec"]');
      const btnInvInc = root.querySelector('[data-rbd="inv-inc"]');

      const TIER_FALLBACK = { poor: 'Poor', fair: 'Fair', good: 'Good', excellent: 'Excellent' };
      const TIER_COLORS = {
        poor: { key: '#ef4444', bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.25)' },
        fair: { key: 'var(--yellow)', bg: 'rgba(251,191,36,0.07)', border: 'rgba(251,191,36,0.28)' },
        good: { key: 'var(--accent)', bg: 'rgba(79,114,255,0.07)', border: 'rgba(79,114,255,0.25)' },
        excellent: { key: 'var(--green)', bg: 'rgba(52,211,153,0.07)', border: 'rgba(52,211,153,0.25)' },
      };

      function lang() {
        return document.documentElement.getAttribute('data-lang') || 'en';
      }

      function tierName(key) {
        return TIER_FALLBACK[key] || key;
      }

      function tierFor(pct) {
        if (pct < 70) return 'poor';
        if (pct < 85) return 'fair';
        if (pct < 95) return 'good';
        return 'excellent';
      }

      function resultLabel(tier) {
        return lang() === 'pt'
          ? ('RBD simulado · ' + tierName(tier))
          : ('Simulated RBD · ' + tierName(tier));
      }

      function fmtPct(n) {
        return (Math.round(n * 10) / 10).toFixed(n % 1 === 0 ? 0 : 1) + '%';
      }

      function update() {
        if (bugs === 0) {
          invalid = 0;
        } else if (invalid > bugs) {
          invalid = bugs;
        }

        const noBugs = bugs === 0;
        const pct = noBugs ? 100 : ((bugs - invalid) / bugs) * 100;
        const key = tierFor(pct);
        const colors = TIER_COLORS[key];

        bugsVal.textContent = String(bugs);
        invVal.textContent = String(invalid);
        eqBugs.textContent = noBugs ? '—' : String(bugs);
        eqInv.textContent = noBugs ? '—' : String(invalid);
        eqDen.textContent = noBugs ? '—' : String(bugs);
        liveVal.textContent = fmtPct(pct);
        liveTier.textContent = tierName(key);
        liveTier.className = 'ppi-live-tier is-' + key;

        arrow.style.left = Math.max(0, Math.min(100, pct)) + '%';
        arrowLabel.textContent = fmtPct(pct);

        tiers.forEach((t) => t.classList.toggle('is-active', t.dataset.tier === key));

        card.classList.remove('is-rbd-poor', 'is-rbd-fair', 'is-rbd-good', 'is-rbd-excellent');
        card.classList.add('is-rbd-' + key);

        if (resultKey) {
          resultKey.textContent = noBugs
            ? (lang() === 'pt' ? 'RBD · 100% Excellent (0 bugs)' : 'RBD · 100% Excellent (0 bugs)')
            : resultLabel(key);
          resultKey.style.color = colors.key;
        }
        if (resultBox) {
          resultBox.style.background = colors.bg;
          resultBox.style.borderColor = colors.border;
        }

        btnBugsDec.disabled = bugs <= MIN_BUGS;
        btnBugsInc.disabled = bugs >= MAX_BUGS;
        btnInvDec.disabled = noBugs || invalid <= 0;
        btnInvInc.disabled = noBugs || invalid >= bugs;
        invVal.parentElement?.classList.toggle('is-disabled', noBugs);
      }

      root.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-rbd]');
        if (!btn || btn.disabled) return;
        const action = btn.getAttribute('data-rbd');
        if (action === 'bugs-inc') {
          const wasEmpty = bugs === 0;
          bugs = Math.min(MAX_BUGS, bugs + 1);
          if (wasEmpty) invalid = 0;
        } else if (action === 'bugs-dec') {
          bugs = Math.max(MIN_BUGS, bugs - 1);
          if (bugs === 0) invalid = 0;
          else if (invalid > bugs) invalid = bugs;
        } else if (action === 'inv-inc') {
          if (bugs === 0) return;
          invalid = Math.min(bugs, invalid + 1);
        } else if (action === 'inv-dec') {
          if (bugs === 0) return;
          invalid = Math.max(0, invalid - 1);
        }
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
  sim: s.includes('initRbdSim'),
  en: s.includes('NoRealBug ≤ ΣBug. With 0 bugs'),
  pt: s.includes('Com 0 bugs, NoRealBug fica em 0'),
});
