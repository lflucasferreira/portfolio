import fs from 'fs';

const f = 'metrics.html';
let s = fs.readFileSync(f, 'utf8');

if (s.includes('initTaskScoreSim')) {
  console.log('already patched');
  process.exit(0);
}

const cssOld = `    .ts-scale {
      display: flex; gap: 0; margin-bottom: 40px; border-radius: var(--radius-sm);
      overflow: hidden; border: 1px solid var(--border);
    }
    .ts-scale-tier {
      flex: 1; text-align: center; padding: 11px 8px;
      font-size: 0.76rem; font-family: var(--mono); font-weight: 700;
    }
    .ts-scale-tier .ts-range { display: block; font-size: 0.64rem; font-weight: 400; opacity: 0.75; margin-top: 2px; }
    .ts-tier-poor    { background: rgba(239,68,68,0.09); color: #ef4444; border-right: 1px solid var(--border); }
    .ts-tier-fair    { background: rgba(251,191,36,0.09); color: var(--yellow); border-right: 1px solid var(--border); }
    .ts-tier-good    { background: rgba(79,114,255,0.09); color: var(--accent); border-right: 1px solid var(--border); }
    .ts-tier-excellent { background: rgba(52,211,153,0.09); color: var(--green); }

    .ts-criteria {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 48px;
    }
    .ts-criterion {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 16px 18px; display: flex; flex-direction: column; gap: 6px;
      transition: border-color var(--transition);
    }
    .ts-criterion:hover { border-color: var(--border2); }
    .ts-points {
      font-size: 0.7rem; font-family: var(--mono); font-weight: 700; color: var(--green);
      background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2);
      border-radius: 20px; padding: 2px 10px; align-self: flex-start;
    }
    .ts-criterion h4 { font-size: 0.875rem; font-weight: 600; color: var(--text); }
    .ts-criterion p  { font-size: 0.78rem; color: var(--text-2); line-height: 1.5; }`;

const cssNew = `    .ts-scale-wrap { margin-bottom: 28px; }
    .ts-scale-meta {
      display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between;
      gap: 10px 16px; margin-bottom: 12px;
    }
    .ts-sim-hint { font-size: 0.78rem; color: var(--text-3); font-family: var(--mono); }
    .ts-live-score {
      font-size: 0.95rem; font-family: var(--mono); font-weight: 700; color: var(--text);
      letter-spacing: -0.02em;
    }
    .ts-live-score .ts-live-max { font-weight: 400; color: var(--text-3); font-size: 0.78rem; }
    .ts-live-tier {
      display: inline-block; margin-left: 6px; padding: 2px 9px; border-radius: 20px;
      font-size: 0.68rem; font-weight: 600; border: 1px solid transparent;
    }
    .ts-live-tier.is-poor { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.25); }
    .ts-live-tier.is-fair { background: rgba(251,191,36,0.1); color: var(--yellow); border-color: rgba(251,191,36,0.25); }
    .ts-live-tier.is-good { background: rgba(79,114,255,0.1); color: var(--accent); border-color: rgba(79,114,255,0.25); }
    .ts-live-tier.is-excellent { background: rgba(52,211,153,0.1); color: var(--green); border-color: rgba(52,211,153,0.25); }

    .ts-scale-track { position: relative; padding-top: 28px; }
    .ts-scale-arrow {
      position: absolute; top: 0; left: 100%;
      transform: translateX(-50%);
      display: flex; flex-direction: column; align-items: center;
      pointer-events: none; z-index: 2;
      transition: left 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .ts-scale-arrow-label {
      font-size: 0.7rem; font-family: var(--mono); font-weight: 800;
      color: var(--text); line-height: 1; margin-bottom: 2px;
    }
    .ts-scale-arrow-head {
      width: 0; height: 0;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top: 10px solid #111;
    }

    .ts-scale {
      display: flex; gap: 0; border-radius: var(--radius-sm);
      overflow: hidden; border: 1px solid var(--border);
    }
    .ts-scale-tier {
      text-align: center; padding: 11px 8px;
      font-size: 0.76rem; font-family: var(--mono); font-weight: 700;
      opacity: 0.45; transition: opacity 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
    }
    .ts-scale-tier.is-active {
      opacity: 1;
      box-shadow: inset 0 0 0 2px currentColor;
      filter: saturate(1.15);
    }
    .ts-scale-tier .ts-range { display: block; font-size: 0.64rem; font-weight: 400; opacity: 0.75; margin-top: 2px; }
    .ts-tier-poor    { flex: 16 1 0%; background: rgba(239,68,68,0.09); color: #ef4444; border-right: 1px solid var(--border); }
    .ts-tier-fair    { flex: 5 1 0%; background: rgba(251,191,36,0.09); color: var(--yellow); border-right: 1px solid var(--border); }
    .ts-tier-good    { flex: 5 1 0%; background: rgba(79,114,255,0.09); color: var(--accent); border-right: 1px solid var(--border); }
    .ts-tier-excellent { flex: 4 1 0%; background: rgba(52,211,153,0.09); color: var(--green); }

    .ts-criteria {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 48px;
    }
    .ts-criterion {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 16px 18px; display: flex; flex-direction: column; gap: 6px;
      transition: border-color var(--transition), opacity var(--transition), background var(--transition);
      cursor: pointer; text-align: left; font: inherit; color: inherit; width: 100%;
      position: relative;
    }
    .ts-criterion:hover { border-color: var(--border2); }
    .ts-criterion:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .ts-criterion.is-on {
      border-color: rgba(52,211,153,0.45);
      background: linear-gradient(180deg, rgba(52,211,153,0.06) 0%, var(--surface) 48%);
    }
    .ts-criterion.is-off {
      opacity: 0.48;
      border-style: dashed;
    }
    .ts-criterion.is-off .ts-points {
      color: var(--text-3);
      background: var(--surface2);
      border-color: var(--border);
    }
    .ts-criterion-check {
      position: absolute; top: 12px; right: 12px;
      width: 18px; height: 18px; border-radius: 50%;
      border: 1.5px solid var(--border2);
      display: grid; place-items: center;
      font-size: 0.65rem; line-height: 1; color: transparent;
      transition: background var(--transition), border-color var(--transition), color var(--transition);
    }
    .ts-criterion.is-on .ts-criterion-check {
      background: var(--green); border-color: var(--green); color: #0b0f19;
    }
    .ts-points {
      font-size: 0.7rem; font-family: var(--mono); font-weight: 700; color: var(--green);
      background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2);
      border-radius: 20px; padding: 2px 10px; align-self: flex-start;
    }
    .ts-criterion h4 { font-size: 0.875rem; font-weight: 600; color: var(--text); padding-right: 22px; }
    .ts-criterion p  { font-size: 0.78rem; color: var(--text-2); line-height: 1.5; }
    .ts-inline-link {
      color: var(--accent); text-decoration: underline; text-underline-offset: 2px; cursor: pointer;
    }`;

if (!s.includes(cssOld)) throw new Error('css block miss');
s = s.replace(cssOld, cssNew);

const htmlOld = `      <div class="ts-scale">
        <div class="ts-scale-tier ts-tier-poor">Poor<span class="ts-range">0 – 15</span></div>
        <div class="ts-scale-tier ts-tier-fair">Fair<span class="ts-range">16 – 20</span></div>
        <div class="ts-scale-tier ts-tier-good">Good<span class="ts-range">21 – 25</span></div>
        <div class="ts-scale-tier ts-tier-excellent">Excellent<span class="ts-range">26 – 30</span></div>
      </div>

      <div class="ts-criteria">
        <div class="ts-criterion">
          <span class="ts-points">+5 pts</span>
          <h4 data-i18n="ts.c1.h">Deploy in SIT</h4>
          <p data-i18n="ts.c1.p">Task was deployed to the SIT environment before QA review begins</p>
        </div>
        <div class="ts-criterion">
          <span class="ts-points">+5 pts</span>
          <h4 data-i18n="ts.c2.h">Pipeline passed</h4>
          <p data-i18n="ts.c2.p">All automated pipeline checks passed before QA handoff</p>
        </div>
        <div class="ts-criterion">
          <span class="ts-points">+5 pts</span>
          <h4 data-i18n="ts.c3.h">QA review performed</h4>
          <p data-i18n="ts.c3.p">A formal QA review session was conducted on the task</p>
        </div>
        <div class="ts-criterion">
          <span class="ts-points">+5 pts</span>
          <h4 data-i18n="ts.c4.h">No major bugs</h4>
          <p data-i18n="ts.c4.p">Zero <a href="#severity">Blocker, Critical, or Major</a> severity bugs found</p>
        </div>
        <div class="ts-criterion">
          <span class="ts-points">+5 pts</span>
          <h4 data-i18n="ts.c5.h">No Simple Rejection</h4>
          <p data-i18n="ts.c5.p">Task not immediately rejected for not being ready to test</p>
        </div>
        <div class="ts-criterion">
          <span class="ts-points">+5 / +3 / 0</span>
          <h4 data-i18n="ts.c6.h">Bugs reported</h4>
          <p data-i18n="ts.c6.p">0 bugs = +5 · ≤2 bugs = +3 · ≥3 bugs = 0</p>
        </div>
      </div>`;

const htmlNew = `      <div class="ts-scale-wrap" id="ts-simulator">
        <div class="ts-scale-meta">
          <span class="ts-sim-hint" data-i18n="ts.sim.hint">Click the criteria to simulate a task score</span>
          <span class="ts-live-score">
            <span id="ts-live-val">30</span><span class="ts-live-max">/30</span>
            <span class="ts-live-tier is-excellent" id="ts-live-tier">Excellent</span>
          </span>
        </div>
        <div class="ts-scale-track">
          <div class="ts-scale-arrow" id="ts-scale-arrow" style="left: 100%" aria-hidden="true">
            <span class="ts-scale-arrow-label" id="ts-arrow-label">30</span>
            <span class="ts-scale-arrow-head"></span>
          </div>
          <div class="ts-scale" role="img" aria-label="Task Score scale 0 to 30">
            <div class="ts-scale-tier ts-tier-poor" data-tier="poor" data-min="0" data-max="15">Poor<span class="ts-range">0 – 15</span></div>
            <div class="ts-scale-tier ts-tier-fair" data-tier="fair" data-min="16" data-max="20">Fair<span class="ts-range">16 – 20</span></div>
            <div class="ts-scale-tier ts-tier-good" data-tier="good" data-min="21" data-max="25">Good<span class="ts-range">21 – 25</span></div>
            <div class="ts-scale-tier ts-tier-excellent is-active" data-tier="excellent" data-min="26" data-max="30">Excellent<span class="ts-range">26 – 30</span></div>
          </div>
        </div>
      </div>

      <div class="ts-criteria" id="ts-criteria">
        <button type="button" class="ts-criterion is-on" data-pts="5" data-key="sit" aria-pressed="true">
          <span class="ts-criterion-check" aria-hidden="true">✓</span>
          <span class="ts-points">+5 pts</span>
          <h4 data-i18n="ts.c1.h">Deploy in SIT</h4>
          <p data-i18n="ts.c1.p">Task was deployed to the SIT environment before QA review begins</p>
        </button>
        <button type="button" class="ts-criterion is-on" data-pts="5" data-key="pipeline" aria-pressed="true">
          <span class="ts-criterion-check" aria-hidden="true">✓</span>
          <span class="ts-points">+5 pts</span>
          <h4 data-i18n="ts.c2.h">Pipeline passed</h4>
          <p data-i18n="ts.c2.p">All automated pipeline checks passed before QA handoff</p>
        </button>
        <button type="button" class="ts-criterion is-on" data-pts="5" data-key="qa" aria-pressed="true">
          <span class="ts-criterion-check" aria-hidden="true">✓</span>
          <span class="ts-points">+5 pts</span>
          <h4 data-i18n="ts.c3.h">QA review performed</h4>
          <p data-i18n="ts.c3.p">A formal QA review session was conducted on the task</p>
        </button>
        <button type="button" class="ts-criterion is-on" data-pts="5" data-key="major" aria-pressed="true">
          <span class="ts-criterion-check" aria-hidden="true">✓</span>
          <span class="ts-points">+5 pts</span>
          <h4 data-i18n="ts.c4.h">No major bugs</h4>
          <p data-i18n="ts.c4.p">Zero <span class="ts-inline-link" data-href="#severity" role="link" tabindex="0">Blocker, Critical, or Major</span> severity bugs found</p>
        </button>
        <button type="button" class="ts-criterion is-on" data-pts="5" data-key="srm" aria-pressed="true">
          <span class="ts-criterion-check" aria-hidden="true">✓</span>
          <span class="ts-points">+5 pts</span>
          <h4 data-i18n="ts.c5.h">No Simple Rejection</h4>
          <p data-i18n="ts.c5.p">Task not immediately rejected for not being ready to test</p>
        </button>
        <button type="button" class="ts-criterion is-on" data-pts="5" data-key="bugs" aria-pressed="true" title="Click to cycle +5 / +3 / 0">
          <span class="ts-criterion-check" aria-hidden="true">✓</span>
          <span class="ts-points" data-pts-label>+5 pts</span>
          <h4 data-i18n="ts.c6.h">Bugs reported</h4>
          <p data-i18n="ts.c6.p">0 bugs = +5 · ≤2 bugs = +3 · ≥3 bugs = 0</p>
        </button>
      </div>`;

if (!s.includes(htmlOld)) throw new Error('html block miss');
s = s.replace(htmlOld, htmlNew);

s = s.replace(
  "'ts.subtitle': 'Task Score',",
  "'ts.subtitle': 'Task Score',\n        'ts.sim.hint': 'Click the criteria to simulate a task score',\n        'ts.tier.poor': 'Poor', 'ts.tier.fair': 'Fair', 'ts.tier.good': 'Good', 'ts.tier.excellent': 'Excellent',"
);
s = s.replace(
  "'ts.subtitle': 'Task Score',\n        'ts.intro': 'No Q4 2024",
  "'ts.subtitle': 'Task Score',\n        'ts.sim.hint': 'Clique nos critérios para simular um Task Score',\n        'ts.tier.poor': 'Poor', 'ts.tier.fair': 'Fair', 'ts.tier.good': 'Good', 'ts.tier.excellent': 'Excellent',\n        'ts.intro': 'No Q4 2024"
);

const js = `  <script>
    (function initTaskScoreSim() {
      const root = document.getElementById('ts-simulator');
      const criteria = document.getElementById('ts-criteria');
      if (!root || !criteria) return;

      const arrow = document.getElementById('ts-scale-arrow');
      const arrowLabel = document.getElementById('ts-arrow-label');
      const liveVal = document.getElementById('ts-live-val');
      const liveTier = document.getElementById('ts-live-tier');
      const tiers = [...root.querySelectorAll('.ts-scale-tier')];
      const cards = [...criteria.querySelectorAll('.ts-criterion')];
      const MAX = 30;
      const BUG_CYCLE = [5, 3, 0];

      function dict() {
        return window.__i18nDict || {};
      }

      function tierName(key) {
        return dict()['ts.tier.' + key] || ({ poor: 'Poor', fair: 'Fair', good: 'Good', excellent: 'Excellent' }[key]);
      }

      function tierFor(score) {
        if (score <= 15) return 'poor';
        if (score <= 20) return 'fair';
        if (score <= 25) return 'good';
        return 'excellent';
      }

      function ptsOf(card) {
        if (card.dataset.key === 'bugs') return Number(card.dataset.pts) || 0;
        return card.classList.contains('is-on') ? (Number(card.dataset.pts) || 0) : 0;
      }

      function syncBugsLabel(card) {
        const pts = Number(card.dataset.pts) || 0;
        const label = card.querySelector('[data-pts-label], .ts-points');
        if (label) label.textContent = pts === 0 ? '0 pts' : ('+' + pts + ' pts');
        const on = pts > 0;
        card.classList.toggle('is-on', on);
        card.classList.toggle('is-off', !on);
        card.setAttribute('aria-pressed', on ? 'true' : 'false');
      }

      function update() {
        let score = 0;
        cards.forEach((card) => { score += ptsOf(card); });
        score = Math.max(0, Math.min(MAX, score));

        arrow.style.left = ((score / MAX) * 100) + '%';
        arrowLabel.textContent = String(score);
        liveVal.textContent = String(score);

        const key = tierFor(score);
        liveTier.textContent = tierName(key);
        liveTier.className = 'ts-live-tier is-' + key;
        tiers.forEach((t) => t.classList.toggle('is-active', t.dataset.tier === key));
      }

      cards.forEach((card) => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('[data-href], a')) return;

          if (card.dataset.key === 'bugs') {
            const cur = Number(card.dataset.pts);
            const idx = BUG_CYCLE.indexOf(cur);
            const next = BUG_CYCLE[(idx + 1) % BUG_CYCLE.length];
            card.dataset.pts = String(next);
            syncBugsLabel(card);
          } else {
            const on = !card.classList.contains('is-on');
            card.classList.toggle('is-on', on);
            card.classList.toggle('is-off', !on);
            card.setAttribute('aria-pressed', on ? 'true' : 'false');
            const label = card.querySelector('.ts-points');
            const base = Number(card.dataset.pts) || 5;
            if (label) label.textContent = on ? ('+' + base + ' pts') : '0 pts';
          }
          update();
        });
      });

      criteria.querySelectorAll('[data-href]').forEach((el) => {
        const go = (e) => {
          e.stopPropagation();
          e.preventDefault();
          const href = el.getAttribute('data-href');
          if (href) location.hash = href.replace(/^#/, '');
        };
        el.addEventListener('click', go);
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') go(e);
        });
      });

      document.addEventListener('portfolio:i18n', update);
      update();
    })();
  </script>
`;

if (!s.includes('</body>')) throw new Error('body end miss');
s = s.replace('</body>', js + '\n</body>');

fs.writeFileSync(f, s);
console.log({
  sim: s.includes('initTaskScoreSim'),
  arrow: s.includes('ts-scale-arrow'),
  hintEn: s.includes('Click the criteria to simulate'),
  hintPt: s.includes('Clique nos critérios'),
});
