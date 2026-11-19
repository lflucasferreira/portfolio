import fs from 'fs';

const f = 'metrics.html';
let s = fs.readFileSync(f, 'utf8');

if (s.includes('initPpiSim')) {
  console.log('already patched');
  process.exit(0);
}

// CSS after metric-scale-item span
const cssNeedle = `    .metric-scale-item span { display: block; font-size: 0.59rem; font-weight: 400; opacity: 0.8; margin-top: 1px; }
    .metric-problems { display: flex; flex-direction: column; gap: 6px; }`;

const cssInsert = `    .metric-scale-item span { display: block; font-size: 0.59rem; font-weight: 400; opacity: 0.8; margin-top: 1px; }

    .ppi-sim { display: flex; flex-direction: column; gap: 12px; }
    .ppi-sim-controls {
      display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
    }
    .ppi-ctrl {
      background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;
      padding: 10px 12px; display: flex; flex-direction: column; gap: 8px;
    }
    .ppi-ctrl-label {
      font-size: 0.68rem; font-family: var(--mono); color: var(--text-3);
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .ppi-ctrl-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .ppi-ctrl-val {
      font-size: 1.25rem; font-weight: 800; font-family: var(--mono); color: var(--text);
      letter-spacing: -0.02em; min-width: 2ch; text-align: center;
    }
    .ppi-btn {
      width: 32px; height: 32px; border-radius: 8px;
      border: 1px solid var(--border); background: var(--surface); color: var(--text);
      font-size: 1.1rem; font-weight: 700; line-height: 1; cursor: pointer;
      display: grid; place-items: center;
      transition: border-color var(--transition), background var(--transition);
    }
    .ppi-btn:hover { border-color: var(--accent); background: rgba(108,140,255,0.08); }
    .ppi-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .ppi-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

    .ppi-live {
      display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between;
      gap: 8px 12px;
    }
    .ppi-live-eq {
      font-family: var(--mono); font-size: 0.78rem; color: var(--text-2);
    }
    .ppi-live-eq strong { color: var(--text); font-size: 0.95rem; }
    .ppi-live-tier {
      font-size: 0.68rem; font-family: var(--mono); font-weight: 600;
      padding: 2px 9px; border-radius: 20px; border: 1px solid transparent;
    }
    .ppi-live-tier.is-poor { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.25); }
    .ppi-live-tier.is-fair { background: rgba(251,191,36,0.1); color: var(--yellow); border-color: rgba(251,191,36,0.25); }
    .ppi-live-tier.is-good { background: rgba(79,114,255,0.1); color: var(--accent); border-color: rgba(79,114,255,0.25); }
    .ppi-live-tier.is-excellent { background: rgba(52,211,153,0.1); color: var(--green); border-color: rgba(52,211,153,0.25); }

    .ppi-scale-track { position: relative; padding-top: 26px; }
    .ppi-scale-arrow {
      position: absolute; top: 0; left: 100%;
      transform: translateX(-50%);
      display: flex; flex-direction: column; align-items: center;
      pointer-events: none; z-index: 2;
      transition: left 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .ppi-scale-arrow-label {
      font-size: 0.68rem; font-family: var(--mono); font-weight: 800;
      color: var(--text); line-height: 1; margin-bottom: 2px;
    }
    .ppi-scale-arrow-head {
      width: 0; height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 9px solid #111;
    }
    .ppi-sim .metric-scale { overflow: hidden; border-radius: 6px; border: 1px solid var(--border); gap: 0; }
    .ppi-sim .metric-scale-item {
      border-radius: 0; opacity: 0.45;
      transition: opacity 0.25s ease, box-shadow 0.25s ease;
    }
    .ppi-sim .metric-scale-item.is-active {
      opacity: 1;
      box-shadow: inset 0 0 0 2px currentColor;
    }
    .ppi-tier-poor { flex: 50 1 0% !important; }
    .ppi-tier-fair { flex: 25 1 0% !important; }
    .ppi-tier-good { flex: 15 1 0% !important; }
    .ppi-tier-excellent { flex: 10 1 0% !important; }

    .metric-card.is-ppi-poor { border-color: rgba(239,68,68,0.45); }
    .metric-card.is-ppi-fair { border-color: rgba(251,191,36,0.5); }
    .metric-card.is-ppi-good { border-color: rgba(79,114,255,0.45); }
    .metric-card.is-ppi-excellent { border-color: rgba(52,211,153,0.45); }

    .ppi-hint {
      font-size: 0.68rem; font-family: var(--mono); color: var(--text-3); line-height: 1.45;
    }

    .metric-problems { display: flex; flex-direction: column; gap: 6px; }`;

if (!s.includes(cssNeedle)) throw new Error('css needle miss');
s = s.replace(cssNeedle, cssInsert);

const htmlOld = `        <!-- PPI -->
        <div class="metric-card">
          <div class="metric-card-top">
            <div class="metric-acronym">PPI</div>
            <div>
              <h3 data-i18n="ppi.title">Ping Pong Index</h3>
              <p class="metric-desc" data-i18n="ppi.desc">Ratio of total bugs to total fix attempts. A value of 1.0 means every bug was fixed correctly on the first try — values below 1.0 reflect ping-pong cycles between dev and QA.</p>
            </div>
          </div>
          <div class="metric-formula">
            <span class="mf-key">PPI</span> = ΣBug / ΣPingPong
            <span class="mf-note">Each bug's PingPong starts at 1 · +1 on every failed fix returned to dev · 1.0 = perfect (one-time fix for all bugs)</span>
          </div>
          <div class="metric-scale">
            <div class="metric-scale-item" style="background:rgba(239,68,68,0.09);color:#ef4444;">Poor<span>&lt;0.50</span></div>
            <div class="metric-scale-item" style="background:rgba(251,191,36,0.09);color:var(--yellow);">Fair<span>0.50–0.74</span></div>
            <div class="metric-scale-item" style="background:rgba(79,114,255,0.1);color:var(--accent);">Good<span>0.75–0.89</span></div>
            <div class="metric-scale-item" style="background:rgba(52,211,153,0.1);color:var(--green);">Excellent<span>0.90–1.00</span></div>
          </div>
          <div class="metric-problems">
            <div class="metric-problem" data-i18n="ppi.p1">Signals bug report clarity — low PPI often means ambiguous descriptions, not just dev errors</div>
            <div class="metric-problem" data-i18n="ppi.p2">A bug with PingPong = 1 is a clean, first-time fix — the ideal baseline for every ticket</div>
            <div class="metric-problem" data-i18n="ppi.p3">Trending toward 1.0 over sprints is concrete evidence that dev–QA alignment is improving</div>
          </div>
          <div class="metric-formula" style="margin-top:12px;background:rgba(52,211,153,0.07);border-color:rgba(52,211,153,0.25);">
            <span class="mf-key" style="color:var(--green);">Mean PPI · Excellent range</span>
            <span class="mf-note">30+ sprints · near-ideal first-time fix rate</span>
          </div>
        </div>`;

const htmlNew = `        <!-- PPI -->
        <div class="metric-card is-ppi-excellent" id="ppi-card">
          <div class="metric-card-top">
            <div class="metric-acronym">PPI</div>
            <div>
              <h3 data-i18n="ppi.title">Ping Pong Index</h3>
              <p class="metric-desc" data-i18n="ppi.desc">Ratio of total bugs to total fix attempts. A value of 1.0 means every bug was fixed correctly on the first try — values below 1.0 reflect ping-pong cycles between dev and QA.</p>
            </div>
          </div>
          <div class="metric-formula">
            <span class="mf-key">PPI</span> = ΣBug / ΣPingPong
            <span class="mf-note" data-i18n="ppi.formula.note">Each bug's PingPong starts at 1 · +1 on every failed fix returned to dev · 1.0 = perfect (one-time fix for all bugs)</span>
          </div>

          <div class="ppi-sim" id="ppi-sim">
            <p class="ppi-hint" data-i18n="ppi.sim.hint">Adjust ΣBug and ΣPingPong (PingPong ≥ Bugs). Extra PingPong = failed fixes sent back to dev.</p>
            <div class="ppi-sim-controls">
              <div class="ppi-ctrl">
                <span class="ppi-ctrl-label" data-i18n="ppi.sim.bugs">ΣBug</span>
                <div class="ppi-ctrl-row">
                  <button type="button" class="ppi-btn" data-ppi="bugs-dec" aria-label="Decrease bugs">−</button>
                  <span class="ppi-ctrl-val" id="ppi-bugs-val">10</span>
                  <button type="button" class="ppi-btn" data-ppi="bugs-inc" aria-label="Increase bugs">+</button>
                </div>
              </div>
              <div class="ppi-ctrl">
                <span class="ppi-ctrl-label" data-i18n="ppi.sim.ping">ΣPingPong</span>
                <div class="ppi-ctrl-row">
                  <button type="button" class="ppi-btn" data-ppi="ping-dec" aria-label="Decrease ping pong">−</button>
                  <span class="ppi-ctrl-val" id="ppi-ping-val">10</span>
                  <button type="button" class="ppi-btn" data-ppi="ping-inc" aria-label="Increase ping pong">+</button>
                </div>
              </div>
            </div>

            <div class="ppi-live">
              <span class="ppi-live-eq">PPI = <span id="ppi-eq-bugs">10</span> / <span id="ppi-eq-ping">10</span> = <strong id="ppi-live-val">1.00</strong></span>
              <span class="ppi-live-tier is-excellent" id="ppi-live-tier">Excellent</span>
            </div>

            <div class="ppi-scale-track">
              <div class="ppi-scale-arrow" id="ppi-scale-arrow" style="left: 100%" aria-hidden="true">
                <span class="ppi-scale-arrow-label" id="ppi-arrow-label">1.00</span>
                <span class="ppi-scale-arrow-head"></span>
              </div>
              <div class="metric-scale" role="img" aria-label="PPI scale 0 to 1">
                <div class="metric-scale-item ppi-tier-poor" data-tier="poor" style="background:rgba(239,68,68,0.09);color:#ef4444;">Poor<span>&lt;0.50</span></div>
                <div class="metric-scale-item ppi-tier-fair" data-tier="fair" style="background:rgba(251,191,36,0.09);color:var(--yellow);">Fair<span>0.50–0.74</span></div>
                <div class="metric-scale-item ppi-tier-good" data-tier="good" style="background:rgba(79,114,255,0.1);color:var(--accent);">Good<span>0.75–0.89</span></div>
                <div class="metric-scale-item ppi-tier-excellent is-active" data-tier="excellent" style="background:rgba(52,211,153,0.1);color:var(--green);">Excellent<span>0.90–1.00</span></div>
              </div>
            </div>
          </div>

          <div class="metric-problems">
            <div class="metric-problem" data-i18n="ppi.p1">Signals bug report clarity — low PPI often means ambiguous descriptions, not just dev errors</div>
            <div class="metric-problem" data-i18n="ppi.p2">A bug with PingPong = 1 is a clean, first-time fix — the ideal baseline for every ticket</div>
            <div class="metric-problem" data-i18n="ppi.p3">Trending toward 1.0 over sprints is concrete evidence that dev–QA alignment is improving</div>
          </div>
          <div class="metric-formula" id="ppi-result-box" style="margin-top:12px;background:rgba(52,211,153,0.07);border-color:rgba(52,211,153,0.25);">
            <span class="mf-key" id="ppi-result-key" style="color:var(--green);">Simulated PPI · Excellent</span>
            <span class="mf-note" data-i18n="ppi.result.note">Demo values — not a client sprint. Mean across 30+ sprints stayed in Excellent.</span>
          </div>
        </div>`;

if (!s.includes(htmlOld)) throw new Error('html miss');
s = s.replace(htmlOld, htmlNew);

// i18n EN
s = s.replace(
  "'ppi.title': 'Ping Pong Index',",
  `'ppi.title': 'Ping Pong Index',
        'ppi.sim.hint': 'Adjust ΣBug and ΣPingPong (PingPong ≥ Bugs). Extra PingPong = failed fixes sent back to dev.',
        'ppi.sim.bugs': 'ΣBug',
        'ppi.sim.ping': 'ΣPingPong',
        'ppi.formula.note': 'Each bug\\'s PingPong starts at 1 · +1 on every failed fix returned to dev · 1.0 = perfect (one-time fix for all bugs)',
        'ppi.result.note': 'Demo values — not a client sprint. Mean across 30+ sprints stayed in Excellent.',
        'ppi.tier.poor': 'Poor', 'ppi.tier.fair': 'Fair', 'ppi.tier.good': 'Good', 'ppi.tier.excellent': 'Excellent',
        'ppi.result.key': 'Simulated PPI · {tier}',`
);

// i18n PT - find ppi.title in PT block
s = s.replace(
  "'ppi.title': 'Ping Pong Index',\n        'ppi.desc': 'Razão entre",
  `'ppi.title': 'Ping Pong Index',
        'ppi.sim.hint': 'Ajuste ΣBug e ΣPingPong (PingPong ≥ Bugs). PingPong extra = falhas devolvidas ao dev.',
        'ppi.sim.bugs': 'ΣBug',
        'ppi.sim.ping': 'ΣPingPong',
        'ppi.formula.note': 'O PingPong de cada bug começa em 1 · +1 a cada falha devolvida ao dev · 1.0 = perfeito (correção na primeira tentativa)',
        'ppi.result.note': 'Valores de demo — não é um sprint de cliente. A média em 30+ sprints ficou em Excellent.',
        'ppi.tier.poor': 'Poor', 'ppi.tier.fair': 'Fair', 'ppi.tier.good': 'Good', 'ppi.tier.excellent': 'Excellent',
        'ppi.result.key': 'PPI simulado · {tier}',
        'ppi.desc': 'Razão entre`
);

// Check if PT ppi.desc starts differently
if (!s.includes("'ppi.sim.hint': 'Ajuste ΣBug")) {
  // try alternate PT string
  const ptIdx = s.lastIndexOf("'ppi.title': 'Ping Pong Index',");
  if (ptIdx > 0 && !s.slice(ptIdx, ptIdx + 400).includes('ppi.sim.hint')) {
    s = s.slice(0, ptIdx) + s.slice(ptIdx).replace(
      "'ppi.title': 'Ping Pong Index',",
      `'ppi.title': 'Ping Pong Index',
        'ppi.sim.hint': 'Ajuste ΣBug e ΣPingPong (PingPong ≥ Bugs). PingPong extra = falhas devolvidas ao dev.',
        'ppi.sim.bugs': 'ΣBug',
        'ppi.sim.ping': 'ΣPingPong',
        'ppi.formula.note': 'O PingPong de cada bug começa em 1 · +1 a cada falha devolvida ao dev · 1.0 = perfeito (correção na primeira tentativa)',
        'ppi.result.note': 'Valores de demo — não é um sprint de cliente. A média em 30+ sprints ficou em Excellent.',
        'ppi.tier.poor': 'Poor', 'ppi.tier.fair': 'Fair', 'ppi.tier.good': 'Good', 'ppi.tier.excellent': 'Excellent',
        'ppi.result.key': 'PPI simulado · {tier}',`
    );
  }
}

const js = `
  <script>
    (function initPpiSim() {
      const card = document.getElementById('ppi-card');
      const root = document.getElementById('ppi-sim');
      if (!card || !root) return;

      let bugs = 10;
      let ping = 10;
      const MIN_BUGS = 1;
      const MAX_BUGS = 40;

      const bugsVal = document.getElementById('ppi-bugs-val');
      const pingVal = document.getElementById('ppi-ping-val');
      const eqBugs = document.getElementById('ppi-eq-bugs');
      const eqPing = document.getElementById('ppi-eq-ping');
      const liveVal = document.getElementById('ppi-live-val');
      const liveTier = document.getElementById('ppi-live-tier');
      const arrow = document.getElementById('ppi-scale-arrow');
      const arrowLabel = document.getElementById('ppi-arrow-label');
      const tiers = [...root.querySelectorAll('.metric-scale-item[data-tier]')];
      const resultKey = document.getElementById('ppi-result-key');
      const resultBox = document.getElementById('ppi-result-box');
      const btnBugsDec = root.querySelector('[data-ppi="bugs-dec"]');
      const btnBugsInc = root.querySelector('[data-ppi="bugs-inc"]');
      const btnPingDec = root.querySelector('[data-ppi="ping-dec"]');
      const btnPingInc = root.querySelector('[data-ppi="ping-inc"]');

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
        const translations = window.__ppiTranslations;
        // read from DOM data-i18n applied strings via fallback map
        const maps = {
          en: TIER_FALLBACK,
          pt: TIER_FALLBACK,
        };
        return (maps[lang()] || TIER_FALLBACK)[key] || key;
      }

      function resultLabel(tier) {
        const templates = {
          en: 'Simulated PPI · ' + tierName(tier),
          pt: 'PPI simulado · ' + tierName(tier),
        };
        return templates[lang()] || templates.en;
      }

      function tierFor(ppi) {
        if (ppi < 0.5) return 'poor';
        if (ppi < 0.75) return 'fair';
        if (ppi < 0.9) return 'good';
        return 'excellent';
      }

      function fmt(n) {
        return (Math.round(n * 100) / 100).toFixed(2);
      }

      function update() {
        if (ping < bugs) ping = bugs;
        const ppi = ping === 0 ? 0 : bugs / ping;
        const clamped = Math.max(0, Math.min(1, ppi));
        const key = tierFor(clamped);
        const colors = TIER_COLORS[key];

        bugsVal.textContent = String(bugs);
        pingVal.textContent = String(ping);
        eqBugs.textContent = String(bugs);
        eqPing.textContent = String(ping);
        liveVal.textContent = fmt(clamped);
        liveTier.textContent = tierName(key);
        liveTier.className = 'ppi-live-tier is-' + key;

        arrow.style.left = (clamped * 100) + '%';
        arrowLabel.textContent = fmt(clamped);

        tiers.forEach((t) => t.classList.toggle('is-active', t.dataset.tier === key));

        card.classList.remove('is-ppi-poor', 'is-ppi-fair', 'is-ppi-good', 'is-ppi-excellent');
        card.classList.add('is-ppi-' + key);

        if (resultKey) {
          resultKey.textContent = resultLabel(key);
          resultKey.style.color = colors.key;
        }
        if (resultBox) {
          resultBox.style.background = colors.bg;
          resultBox.style.borderColor = colors.border;
        }

        btnBugsDec.disabled = bugs <= MIN_BUGS;
        btnBugsInc.disabled = bugs >= MAX_BUGS;
        btnPingDec.disabled = ping <= bugs;
        btnPingInc.disabled = ping >= MAX_BUGS * 3;
      }

      root.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-ppi]');
        if (!btn || btn.disabled) return;
        const action = btn.getAttribute('data-ppi');
        if (action === 'bugs-inc') {
          bugs += 1;
          if (ping < bugs) ping = bugs;
        } else if (action === 'bugs-dec') {
          bugs = Math.max(MIN_BUGS, bugs - 1);
        } else if (action === 'ping-inc') {
          ping += 1;
        } else if (action === 'ping-dec') {
          ping = Math.max(bugs, ping - 1);
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

// verify PT keys
console.log({
  sim: s.includes('initPpiSim'),
  enHint: s.includes('Adjust ΣBug and ΣPingPong'),
  ptHint: s.includes('Ajuste ΣBug e ΣPingPong'),
  html: s.includes('id="ppi-sim"'),
});
