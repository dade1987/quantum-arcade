/* ============================================================
   PARTE 0 — mini-giochi di matematica di base
   Pensati per chi ha finito le medie: niente formule calate
   dall'alto, si impara muovendo cose e vedendo cosa succede.
   ============================================================ */

import { Stage, COL, bg, grid, arrow, circle, dot, text, roundRect, makePlane, FX, proximityBar } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, h, choice } from '../core/ui.js';
import { sfx } from '../core/audio.js';

/* ------------------------------------------------------------
   HUD comune a tutti i mini-giochi della Parte 0:
   in alto l'OBIETTIVO scritto grande, e una barra che dice
   "quanto sei vicino". Colore + suono + scritta: tre canali
   per la stessa informazione, così è impossibile non capire.
   ------------------------------------------------------------ */
function hud(ctx, s, { goal = '', closeness = 0, hit = false, sub = '' }) {
  roundRect(ctx, 8, 6, s.w - 16, hit ? 34 : 34, 9, {
    fill: hit ? 'rgba(52,211,153,.16)' : 'rgba(255,255,255,.035)',
    stroke: hit ? COL.green : '#22304d',
  });
  // la barra sta a destra: l'obiettivo si ferma prima, invece di finirci sotto
  const bw = Math.min(180, s.w * 0.32);
  const barraX = s.w - bw - 18;
  text(ctx, hit ? '✓ CENTRATO!' : '🎯 ' + goal, 18, 23,
    { size: 13, color: hit ? COL.green : COL.amber, mono: false, weight: '800', max: barraX - 18 - 10 });
  proximityBar(ctx, barraX, 15, bw, 10, hit ? 1 : closeness);
  if (sub) text(ctx, sub, 18, 48, { size: 11, color: '#7f8fb3', max: s.w - 36 });
  return 46;
}

/** suono di prossimità con anti-spam */
function nearSound() {
  let last = 0, lastC = -1;
  return c => {
    const now = performance.now();
    if (now - last < 130 || Math.abs(c - lastC) < 0.03) return;
    last = now; lastC = c; sfx.near(c);
  };
}

/* ------------------------------------------------------------
   1) LINEA DEI NUMERI — negativi, doppi, metà
   ------------------------------------------------------------ */
export function numberLine(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, { title: 'La linea dei numeri', subtitle: 'raggiungi il bersaglio in poche mosse' });
  const st = { pos: 1, target: 8, moves: 0, hist: [] };
  const newTarget = () => {
    const cands = [8, -4, 6, -6, 12, -8, 3, -3, 10];
    st.target = cands[Math.floor(Math.random() * cands.length)];
    st.pos = 1; st.moves = 0; st.hist = []; upd();
  };

  const near = nearSound();
  const stage = new Stage(w.body, {
    height: 200,
    draw(ctx, s) {
      bg(ctx, s);
      const dist = Math.abs(st.pos - st.target);
      const hudH = hud(ctx, s, { goal: `porta il razzo su ${st.target}`, closeness: 1 - Math.min(1, dist / 14), hit: dist < 1e-9,
                    sub: 'usa i bottoni: +1, −1, doppio, metà, cambia segno' });
      const y = s.h / 2 + 18;
      const L = 30, R = s.w - 30;
      const X = v => L + ((v + 14) / 28) * (R - L);
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
      for (let v = -14; v <= 14; v++) {
        const big = v % 5 === 0;
        ctx.strokeStyle = v === 0 ? COL.txt : '#2b3b5e'; ctx.lineWidth = v === 0 ? 2 : 1;
        ctx.beginPath(); ctx.moveTo(X(v), y - (big ? 9 : 5)); ctx.lineTo(X(v), y + (big ? 9 : 5)); ctx.stroke();
        if (big) text(ctx, String(v), X(v), y + 22, { size: 11, align: 'center', color: v < 0 ? COL.red : '#7f8fb3' });
      }
      /* Le due scritte di orientamento stavano sopra la linea, alla stessa
         altezza del bersaglio: su uno schermo stretto il bersaglio ci finiva
         sopra. Ora stanno appoggiate ai due estremi, subito sotto l'HUD, dove
         non passa nient'altro. */
      const yEtichette = hudH + 13;
      text(ctx, 'negativi ←', L, yEtichette, { size: 11, align: 'left', color: COL.red, max: s.w / 2 - L - 6 });
      text(ctx, '→ positivi', R, yEtichette, { size: 11, align: 'right', color: COL.green, max: s.w / 2 - 36 });
      // bersaglio
      roundRect(ctx, X(st.target) - 13, y - 40, 26, 20, 5, { fill: 'rgba(251,191,36,.2)', stroke: COL.amber });
      text(ctx, String(st.target), X(st.target), y - 30, { size: 12, align: 'center', color: COL.amber });
      text(ctx, 'bersaglio', X(st.target), y - 48, { size: 10, align: 'center', color: COL.amber });
      // razzo
      const hit = Math.abs(st.pos - st.target) < 1e-9;
      dot(ctx, X(st.pos), y, 9, hit ? COL.green : COL.cyan);
      text(ctx, st.pos.toString(), X(st.pos), y + 40, { size: 13, align: 'center', color: hit ? COL.green : COL.cyan });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const out = readout('');
  const move = (fn, label) => { st.pos = fn(st.pos); st.moves++; st.hist.push(label); upd(); };
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([
    { label: '+1', onclick: () => move(v => v + 1, '+1') },
    { label: '−1', onclick: () => move(v => v - 1, '−1') },
    { label: '×2 (doppio)', onclick: () => move(v => v * 2, '×2') },
    { label: '÷2 (metà)', onclick: () => move(v => v / 2, '÷2') },
    { label: '× (−1) cambia segno', onclick: () => move(v => -v, '×(−1)') },
    { label: '🎲 nuovo bersaglio', class: 'sm primary', onclick: newTarget },
  ])));
  w.body.appendChild(out.root);

  function upd() {
    const hit = Math.abs(st.pos - st.target) < 1e-9;
    out.set(`Sei su <b>${st.pos}</b>, il bersaglio è <b>${st.target}</b>. Mosse: ${st.moves}\n` +
      `Percorso: ${st.hist.length ? st.hist.join(' → ') : '—'}` +
      (hit ? `\n<span class="g">🎯 CENTRATO in ${st.moves} mosse!</span>` : ''));
    stage.redraw();
    if (hit && st.moves > 0 && !st.won) {
      st.won = true; sfx.ok();
      fx.burst(stage.w / 2, stage.h / 2 + 18); fx.flash();
      cfg.onWin && cfg.onWin(st.moves);
    } else if (!hit) { st.won = false; near(1 - Math.min(1, Math.abs(st.pos - st.target) / 14)); }
  }
  upd();
  w.setFoot('<b>Da notare:</b> "×2" è un salto che raddoppia la distanza da zero, "÷2" la dimezza, "×(−1)" ti ribalta dall\'altra parte. Fra poco useremo le stesse tre mosse su una <b>freccia</b> invece che su un punto: raddoppiarla, dimezzarla, girarla dall\'altra parte.');
  return { state: st };
}

/* ------------------------------------------------------------
   2) FRAZIONI, DECIMALI, PERCENTUALI: la stessa cosa in 3 lingue
   ------------------------------------------------------------ */
export function percentLab(host, opts = {}) {
  const cfg = Object.assign({ onWin: null, need: 3 }, opts);
  const w = widget(host, { title: 'Frazioni = decimali = percentuali', subtitle: 'riempi il bicchiere fino alla riga!' });

  const GOALS = [
    { v: 0.5,  lab: '1/2', say: 'metà bicchiere' },
    { v: 0.25, lab: '1/4', say: 'un quarto' },
    { v: 0.75, lab: '3/4', say: 'tre quarti' },
    { v: 0.2,  lab: '1/5', say: 'un quinto' },
    { v: 0.1,  lab: '1/10', say: 'un decimo' },
  ];
  const st = { v: 0.35, gi: 0, hits: 0, hit: false, done: new Set() };
  const near = nearSound();

  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const frac = v => { const num = Math.round(v * 100), g = gcd(num, 100) || 1; return `${num / g}/${100 / g}`; };

  const stage = new Stage(w.body, {
    height: 300,
    draw(ctx, s) {
      bg(ctx, s);
      const goal = GOALS[st.gi];
      const closeness = 1 - Math.min(1, Math.abs(st.v - goal.v) / 0.5);
      const top = hud(ctx, s, {
        goal: `riempi fino a ${goal.lab}  (${goal.say})`,
        closeness, hit: st.hit,
        sub: 'muovi il cursore qui sotto — la riga tratteggiata è il bersaglio',
      });

      // ---- il bicchiere (metafora concreta) ----
      const gw = 96, gh = s.h - top - 40, gx = 26, gy = top + 6;
      roundRect(ctx, gx, gy, gw, gh, 10, { stroke: '#3a4c73', fill: '#0c1424', width: 2 });
      const fillH = gh * st.v;
      roundRect(ctx, gx + 4, gy + gh - fillH, gw - 8, Math.max(2, fillH - 4), 8,
        { fill: st.hit ? COL.green : COL.cyan, alpha: .85 });
      // tacche in quarti
      for (let i = 1; i < 4; i++) {
        const yy = gy + gh - gh * (i / 4);
        ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.beginPath();
        ctx.moveTo(gx, yy); ctx.lineTo(gx + gw, yy); ctx.stroke();
        text(ctx, `${i}/4`, gx + gw + 6, yy, { size: 9.5, color: '#5b6b90' });
      }
      // riga del bersaglio
      const ty = gy + gh - gh * goal.v;
      ctx.strokeStyle = COL.amber; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(gx - 8, ty); ctx.lineTo(gx + gw + 8, ty); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, goal.lab, gx - 12, ty, { size: 12, align: 'right', color: COL.amber });

      // ---- la torta ----
      const R = Math.min(64, (s.h - top) / 2 - 24), cx = gx + gw + 100, cy = gy + gh / 2;
      circle(ctx, cx, cy, R, { stroke: '#2b3b5e', fill: '#111c33' });
      ctx.fillStyle = st.hit ? COL.green : COL.cyan; ctx.globalAlpha = .8;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + st.v * Math.PI * 2); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
      circle(ctx, cx, cy, R, { stroke: '#3a4c73' });
      // spicchio bersaglio
      ctx.strokeStyle = COL.amber; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(-Math.PI / 2 + goal.v * Math.PI * 2), cy + R * Math.sin(-Math.PI / 2 + goal.v * Math.PI * 2));
      ctx.stroke(); ctx.setLineDash([]);

      // ---- i tre modi di scriverlo, grandi ----
      const tx = cx + R + 34;
      if (s.w > 520) {
        text(ctx, `${(st.v * 100).toFixed(0)}%`, tx, cy - 34, { size: 30, color: st.hit ? COL.green : COL.cyan, weight: '800' });
        text(ctx, `= ${st.v.toFixed(2)}`, tx, cy + 4, { size: 17, color: COL.amber });
        text(ctx, `= ${frac(st.v)}`, tx, cy + 30, { size: 17, color: COL.violet });
        text(ctx, 'percentuale · decimale · frazione', tx, cy + 56, { size: 10.5, color: '#5b6b90' });
      }
      text(ctx, `centrati: ${st.hits}/${cfg.need}`, s.w - 14, s.h - 12, { size: 11, align: 'right', color: '#7f8fb3' });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const s1 = slider({
    label: 'Quanto riempi', min: 0, max: 1, step: .01, value: st.v,
    fmt: v => (v * 100).toFixed(0) + '%', oninput: v => { st.v = v; upd(); },
  });
  w.body.appendChild(controls(s1.root));
  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '10px' } },
    ...GOALS.map((g, i) => h('button', { class: 'btn sm', onclick: () => { st.gi = i; st.hit = false; upd(); } }, 'obiettivo ' + g.lab)),
  ));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const goal = GOALS[st.gi];
    const d = Math.abs(st.v - goal.v);
    const closeness = 1 - Math.min(1, d / 0.5);
    const wasHit = st.hit;
    st.hit = d < 0.011;
    if (!st.hit) near(closeness);
    if (st.hit && !wasHit) {
      sfx.ok();
      fx.burst(stage.w * 0.25, stage.h * 0.55, { color: null });
      fx.flash();
      if (!st.done.has(st.gi)) { st.done.add(st.gi); st.hits++; }
      if (st.hits >= cfg.need) cfg.onWin && cfg.onWin();
    }
    out.set(
      `Adesso il bicchiere è pieno per <b>${(st.v * 100).toFixed(0)}%</b> = <b>${st.v.toFixed(2)}</b> = <b>${frac(st.v)}</b>\n` +
      `Sono tre modi di scrivere <b>la stessa quantità</b>: "per cento" vuol dire letteralmente "ogni 100".\n` +
      (st.hit ? '<span class="g">✓ Perfetto! Prova un altro obiettivo.</span>'
              : `Obiettivo: <b>${goal.lab}</b> (${goal.say}) → ${(goal.v * 100).toFixed(0)}%. ` +
                (st.v < goal.v ? 'Sei <b>sotto</b>: alza il cursore.' : 'Sei <b>sopra</b>: abbassa il cursore.')));
    stage.redraw();
  }
  upd();
  w.setFoot('Nel resto del corso le probabilità appariranno come <b>percentuale</b> (50%) o come <b>numero fra 0 e 1</b> (0,5): ormai sai che sono la stessa cosa.');
  return { state: st };
}

/* ------------------------------------------------------------
   3) QUADRATO E RADICE — serve per "probabilità = ampiezza²"
   ------------------------------------------------------------ */
export function squareRootLab(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, { title: 'Quadrato e radice quadrata', subtitle: 'il lato e l\'area di un quadrato' });
  const st = { x: 0.7, hits: 0, asked: null, won: false };

  const near = nearSound();
  const stage = new Stage(w.body, {
    height: 270,
    draw(ctx, s) {
      bg(ctx, s);
      const need = st.asked !== null && st.asked !== undefined ? Math.sqrt(st.asked) : null;
      hud(ctx, s, {
        goal: need ? `trova il lato che dà area ${st.asked}` : 'muovi il lato e guarda l\'area',
        closeness: need ? 1 - Math.min(1, Math.abs(st.x - need) / 0.6) : 0,
        hit: need ? Math.abs(st.x - need) < 0.02 : false,
        sub: 'area = lato × lato · il lato è la "radice quadrata" dell\'area',
      });
      const size = 130, x0 = 26, y0 = s.h - 26;
      roundRect(ctx, x0, y0 - size, size, size, 4, { stroke: '#2b3b5e' });
      const side = st.x * size;
      roundRect(ctx, x0, y0 - side, side, side, 4, { fill: COL.cyan, alpha: .35, stroke: COL.cyan });
      arrow(ctx, x0, y0 + 12, x0 + side, y0 + 12, { color: COL.amber, width: 1.6, head: 6 });
      text(ctx, `lato = ${st.x.toFixed(2)}`, x0 + side / 2, y0 + 22, { size: 11, align: 'center', color: COL.amber });
      text(ctx, `area = ${(st.x * st.x).toFixed(3)}`, x0 + side / 2, y0 - side / 2, { size: 12, align: 'center', color: COL.txt });
      const tx = x0 + size + 34;
      text(ctx, 'lato × lato = area', tx, 40, { size: 13, color: COL.txt });
      text(ctx, `${st.x.toFixed(2)} × ${st.x.toFixed(2)} = ${(st.x * st.x).toFixed(3)}`, tx, 62, { size: 14, color: COL.cyan });
      text(ctx, 'e al contrario:', tx, 96, { size: 13, color: COL.txt });
      text(ctx, `√${(st.x * st.x).toFixed(3)} = ${st.x.toFixed(2)}`, tx, 118, { size: 14, color: COL.green });
      text(ctx, 'la radice quadrata è la domanda:', tx, 150, { size: 11, color: '#7f8fb3' });
      text(ctx, '"che lato serve per avere questa area?"', tx, 166, { size: 11, color: '#7f8fb3' });
      if (st.x < 1) text(ctx, '⚠ se il lato è minore di 1, l\'area è ANCORA PIÙ PICCOLA', tx, 196, { size: 11, color: COL.amber });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();
  const s1 = slider({ label: 'Lato del quadrato', min: 0.05, max: 1, step: .01, value: st.x, oninput: v => { st.x = v; upd(); } });
  w.body.appendChild(controls(s1.root));
  const out = readout('');
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([
    { label: 'area = 0,25 → che lato?', onclick: () => ask(0.25) },
    { label: 'area = 0,5 → che lato?', onclick: () => ask(0.5) },
    { label: 'area = 0,01 → che lato?', onclick: () => ask(0.01) },
  ])));
  w.body.appendChild(out.root);
  function ask(a) { st.asked = a; st.won = false; upd(); }
  function upd() {
    let msg = `Lato <b>${st.x.toFixed(2)}</b> → area <b>${(st.x * st.x).toFixed(3)}</b>\n`;
    if (st.asked !== null && st.asked !== undefined) {
      const asked = st.asked;
      const need = Math.sqrt(asked);
      const ok = Math.abs(st.x - need) < 0.02;
      msg += `Cerchi il lato che dà area ${asked}: la risposta è √${asked} = <b>${need.toFixed(2)}</b>. ` +
        (ok ? '<span class="g">✓ ci sei!</span>' : 'Muovi il cursore fin lì.');
      if (ok && !st.won) {
        st.won = true; st.hits++; sfx.ok();
        fx.burst(90, stage.h - 80); fx.flash();
        cfg.onWin && cfg.onWin();
      } else if (!ok) { st.won = false; near(1 - Math.min(1, Math.abs(st.x - need) / 0.6)); }
    }
    out.set(msg);
    stage.redraw();
  }
  upd();
  w.setFoot('<b>Perché ci servirà:</b> nel quantistico ogni possibilità ha una "freccia" (l\'ampiezza) e la probabilità di vederla è <b>l\'area del suo quadrato</b>. Ampiezza 0,7 → probabilità 0,49 ≈ 50%. Ampiezza 1/√2 ≈ 0,71 → probabilità esattamente 0,5.');
  return { state: st };
}

/* ------------------------------------------------------------
   4) POTENZE DI 2 — la crescita che ci frega tutti
   ------------------------------------------------------------ */
export function powersLab(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, { title: 'Raddoppia, raddoppia, raddoppia…', subtitle: 'le potenze di 2 (e perché i qubit sono speciali)' });
  const st = { n: 3, won: false };
  const stage = new Stage(w.body, {
    height: 220,
    draw(ctx, s) {
      bg(ctx, s);
      const N = Math.pow(2, st.n);
      text(ctx, `2 moltiplicato per sé stesso ${st.n} volte:`, 14, 20, { size: 12, color: COL.txt });
      const chain = Array.from({ length: st.n }, () => '2').join(' × ') || '1';
      text(ctx, `${chain} = ${N.toLocaleString('it-IT')}`, 14, 44, { size: 15, color: COL.cyan });
      text(ctx, `si scrive 2^${st.n}`, 14, 66, { size: 12, color: COL.amber });
      // puntini
      const maxDots = 256;
      const shown = Math.min(N, maxDots);
      const cols = 32, r = 4.2;
      for (let i = 0; i < shown; i++) {
        const cx2 = 18 + (i % cols) * 11, cy2 = 96 + Math.floor(i / cols) * 11;
        dot(ctx, cx2, cy2, r, `hsl(${(i / Math.max(1, shown)) * 300}, 85%, 62%)`, false);
      }
      if (N > maxDots) text(ctx, `… e altri ${(N - maxDots).toLocaleString('it-IT')} (non ci stanno nello schermo)`, 18, 196, { size: 11, color: COL.amber });
      text(ctx, `${st.n} qubit → ${N.toLocaleString('it-IT')} possibilità contemporanee`, 14, s.h - 8, { size: 12, color: COL.green });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();
  const s1 = slider({ label: 'Quante volte raddoppi (n)', min: 0, max: 20, step: 1, value: st.n, fmt: v => `n = ${v} → 2^${v} = ${Math.pow(2, v).toLocaleString('it-IT')}`, oninput: v => { st.n = v; upd(); } });
  w.body.appendChild(controls(s1.root));
  const out = readout('');
  w.body.appendChild(out.root);
  function upd() {
    const N = Math.pow(2, st.n);
    out.set(
      `<b>2^${st.n} = ${N.toLocaleString('it-IT')}</b>\n` +
      `Un chicco di riso sulla prima casella, due sulla seconda, quattro sulla terza…\n` +
      `alla casella ${st.n + 1} ce ne sono già ${N.toLocaleString('it-IT')}.\n` +
      (st.n >= 10 ? '<span class="a">Ecco perché "raddoppiare ogni volta" fa numeri assurdi in fretta.</span>' : '') +
      (st.n >= 20 ? '\n<span class="g">Con 20 qubit un computer quantistico maneggia più di un milione di ampiezze insieme.</span>' : ''));
    stage.redraw();
    if (st.n >= 20 && !st.won) { st.won = true; sfx.ok(); fx.burst(stage.w / 2, stage.h / 2); fx.flash(); cfg.onWin && cfg.onWin(); }
  }
  upd();
  w.setFoot('Con <b>n bit</b> classici puoi rappresentare uno solo di 2^n valori alla volta. Con <b>n qubit</b> lo stato è descritto da <b>tutte</b> le 2^n ampiezze insieme. Questa singola riga è il motivo per cui l\'informatica quantistica esiste.');
  return { state: st };
}

/* ------------------------------------------------------------
   5) GRIGLIA E COORDINATE — battaglia navale
   ------------------------------------------------------------ */
export function gridLab(host, opts = {}) {
  const cfg = Object.assign({ onWin: null, need: 3 }, opts);
  const w = widget(host, { title: 'Coordinate: (x, y)', subtitle: 'colpisci il bersaglio' });
  const near = nearSound();
  const st = { tx: 3, ty: 2, x: 0, y: 0, hits: 0, shots: [] };
  const newT = () => {
    st.tx = Math.floor(Math.random() * 11) - 5;
    st.ty = Math.floor(Math.random() * 11) - 5;
    st.shots = []; upd();
  };

  const stage = new Stage(w.body, {
    height: 340,
    onPointer(e) {
      if (e.type !== 'down') return;
      const P = plane(stage);
      const p = P.inv(e.x, e.y);
      sx.value = Math.round(p.x); sy.value = Math.round(p.y);
      st.x = Math.round(p.x); st.y = Math.round(p.y);
      upd();
    },
    draw(ctx, s) {
      bg(ctx, s);
      const d = Math.hypot(st.tx - st.x, st.ty - st.y);
      hud(ctx, s, { goal: `trova il bersaglio nascosto — colpiti ${st.hits}/${cfg.need}`,
                    closeness: 1 - Math.min(1, d / 12), hit: st.x === st.tx && st.y === st.ty,
                    sub: 'clicca sulla griglia o usa i cursori, poi premi SPARA' });
      const P = plane(s);
      // griglia
      for (let v = -6; v <= 6; v++) {
        ctx.strokeStyle = v === 0 ? '#3d5080' : '#1b2540'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(P.X(v), P.Y(-6)); ctx.lineTo(P.X(v), P.Y(6)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(P.X(-6), P.Y(v)); ctx.lineTo(P.X(6), P.Y(v)); ctx.stroke();
        if (v !== 0) {
          text(ctx, String(v), P.X(v), P.Y(0) + 12, { size: 9.5, align: 'center', color: '#5b6b90' });
          text(ctx, String(v), P.X(0) - 12, P.Y(v), { size: 9.5, align: 'center', color: '#5b6b90' });
        }
      }
      text(ctx, 'x →', P.X(6) - 4, P.Y(0) - 10, { size: 11, align: 'right', color: COL.cyan });
      text(ctx, 'y ↑', P.X(0) + 14, P.Y(6) + 8, { size: 11, color: COL.violet });
      // tiri passati
      st.shots.forEach(sh => dot(ctx, P.X(sh.x), P.Y(sh.y), 4, sh.hit ? COL.green : '#4a5877', false));
      // bersaglio (visibile solo se colpito)
      const hit = st.x === st.tx && st.y === st.ty;
      if (hit) {
        circle(ctx, P.X(st.tx), P.Y(st.ty), 12, { stroke: COL.green, width: 2 });
        text(ctx, '🎯', P.X(st.tx), P.Y(st.ty) - 20, { size: 14, align: 'center', color: COL.green });
      }
      // il tuo punto
      arrow(ctx, P.X(0), P.Y(0), P.X(st.x), P.Y(st.y), { color: COL.amber, width: 2, head: 8, alpha: .8 });
      dot(ctx, P.X(st.x), P.Y(st.y), 6, COL.amber);
      text(ctx, `(${st.x}, ${st.y})`, P.X(st.x) + 10, P.Y(st.y) - 10, { size: 12, color: COL.amber });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();
  function plane(s) { const u = Math.min(s.w, s.h - 40) / 13.5; return makePlane(s.w / 2, s.h / 2 + 18, u); }

  const sx = slider({ label: 'x (destra/sinistra)', min: -6, max: 6, step: 1, value: 0, fmt: v => String(v), oninput: v => { st.x = v; upd(); } });
  const sy = slider({ label: 'y (su/giù)', min: -6, max: 6, step: 1, value: 0, fmt: v => String(v), oninput: v => { st.y = v; upd(); } });
  w.body.appendChild(controls(sx.root, sy.root));
  const out = readout('');
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([
    { label: '🎯 SPARA!', class: 'sm primary', onclick: () => fire() },
    { label: '🎲 nuovo bersaglio', onclick: newT },
  ])));
  w.body.appendChild(out.root);

  function fire() {
    const hit = st.x === st.tx && st.y === st.ty;
    st.shots.push({ x: st.x, y: st.y, hit });
    hit ? sfx.ok() : sfx.err();
    if (!hit) near(1 - Math.min(1, Math.hypot(st.tx - st.x, st.ty - st.y) / 12));
    if (hit) { st.hits++; if (st.hits >= cfg.need) cfg.onWin && cfg.onWin(); newTargetSoon(); }
    upd(hit);
  }
  function newTargetSoon() { setTimeout(newT, 1200); }
  function upd(justHit) {
    const dx = st.tx - st.x, dy = st.ty - st.y;
    let hint = '';
    if (justHit) hint = `<span class="g">🎯 COLPITO! (${st.hits}/${cfg.need})</span>`;
    else hint = `Indizio: il bersaglio è ${dx === 0 ? 'sulla tua colonna' : (dx > 0 ? `${dx} passi a DESTRA` : `${-dx} passi a SINISTRA`)}` +
      ` e ${dy === 0 ? 'sulla tua riga' : (dy > 0 ? `${dy} passi in SU` : `${-dy} passi in GIÙ`)}.`;
    out.set(`Il tuo punto: <b>x = ${st.x}</b>, <b>y = ${st.y}</b>\n` +
      `Si scrive così: <b>(${st.x}, ${st.y})</b> — prima sempre la x (orizzontale), poi la y (verticale).\n${hint}`);
    stage.redraw();
  }
  upd();
  w.setFoot('Una coppia di numeri (x, y) individua <b>un punto</b> sul piano, oppure — che è lo stesso — <b>una freccia</b> che parte dal centro. Fra due livelli chiameremo quella stessa freccia "numero complesso": x sarà la parte reale e y quella immaginaria.');
  return { state: st };
}

/* ------------------------------------------------------------
   6) ANGOLI E GRADI — il goniometro
   ------------------------------------------------------------ */
export function angleLab(host, opts = {}) {
  const cfg = Object.assign({ onWin: null, need: 3 }, opts);
  const w = widget(host, { title: 'Angoli: il giro completo è 360°', subtitle: 'porta la lancetta dove ti chiedo' });
  const st = { a: 0, target: 90, hits: 0, won: false };
  const targets = [90, 180, 270, 45, 135, 360];

  const near = nearSound();
  const stage = new Stage(w.body, {
    height: 300,
    onPointer(e) {
      if (!e.down) return;
      const cx = stage.w / 2, cy = stage.h / 2 + 24;
      const ang = Math.atan2(cy - e.y, e.x - cx) * 180 / Math.PI;
      st.a = Math.round(((ang % 360) + 360) % 360 / 5) * 5;
      s1.value = st.a; upd();
    },
    draw(ctx, s) {
      bg(ctx, s);
      const dd = Math.abs(((st.a - st.target % 360) % 360 + 540) % 360 - 180);
      hud(ctx, s, { goal: `porta la lancetta a ${st.target}°`, closeness: 1 - Math.min(1, (180 - dd) / 180 === 0 ? 1 : dd / 180), hit: st.a === (st.target % 360),
                    sub: 'trascina la lancetta o usa il cursore · un giro intero = 360°' });
      const R = Math.min(s.w, s.h - 40) / 2 - 34;
      const cx = s.w / 2, cy = s.h / 2 + 24;
      circle(ctx, cx, cy, R, { stroke: '#2b3b5e', fill: '#0d1524' });
      for (let a = 0; a < 360; a += 15) {
        const big = a % 45 === 0;
        const r1 = R - (big ? 12 : 6), rr = Math.PI * a / 180;
        ctx.strokeStyle = big ? '#4a5f8f' : '#26344f'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx + r1 * Math.cos(rr), cy - r1 * Math.sin(rr));
        ctx.lineTo(cx + R * Math.cos(rr), cy - R * Math.sin(rr)); ctx.stroke();
        if (big) text(ctx, a + '°', cx + (R + 14) * Math.cos(rr), cy - (R + 14) * Math.sin(rr), { size: 10, align: 'center', color: '#6f7fa3' });
      }
      // settore percorso
      ctx.fillStyle = 'rgba(34,211,238,.15)';
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * .55, 0, -st.a * Math.PI / 180, true); ctx.closePath(); ctx.fill();
      const rr = Math.PI * st.a / 180;
      arrow(ctx, cx, cy, cx + R * Math.cos(rr), cy - R * Math.sin(rr), { color: COL.cyan, width: 3, head: 10 });
      arrow(ctx, cx, cy, cx + R * .8, cy, { color: '#3d5080', width: 1.6, head: 6 });
      const tr = Math.PI * st.target / 180;
      arrow(ctx, cx, cy, cx + R * Math.cos(tr), cy - R * Math.sin(tr), { color: COL.amber, width: 2, head: 8, dash: [5, 4], alpha: .8 });
      text(ctx, `${st.a}°`, cx, cy + R + 26, { size: 15, align: 'center', color: COL.cyan });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const s1 = slider({ label: 'Angolo', min: 0, max: 360, step: 5, value: 0, fmt: v => v + '°', oninput: v => { st.a = v; upd(); } });
  w.body.appendChild(controls(s1.root));
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons(
    targets.map(t => ({ label: `vai a ${t}°`, onclick: () => { st.target = t; upd(); } })))));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const ok = st.a === (st.target % 360);
    if (ok && !st.won) {
      st.won = true; st.hits++; sfx.ok();
      fx.burst(stage.w / 2, stage.h / 2 + 24); fx.flash();
      if (st.hits >= cfg.need) cfg.onWin && cfg.onWin();
    } else if (!ok) {
      st.won = false;
      const d = Math.abs(((st.a - st.target) % 360 + 540) % 360 - 180);
      near(1 - d / 180);
    }
    const frac = st.a / 360;
    out.set(
      `Sei a <b>${st.a}°</b> = <b>${(frac).toFixed(3)}</b> di giro completo` +
      (st.a === 90 ? ' (un quarto di giro)' : st.a === 180 ? ' (mezzo giro)' : st.a === 270 ? ' (tre quarti)' : st.a === 0 ? ' (punto di partenza)' : '') + '\n' +
      `Un giro intero = <b>360°</b>. Mezzo giro = 180°. Un quarto = 90°.\n` +
      (ok ? '<span class="g">✓ Sei sul bersaglio!</span>' : `Porta la lancetta su ${st.target}°.`));
    stage.redraw();
  }
  upd();
  w.setFoot('<b>Perché ci serve:</b> nel corso, "fase" vorrà dire esattamente questo — <b>a che punto del giro sei</b>. E 360° sarà sempre uguale a 0°, perché dopo un giro completo sei tornato al punto di partenza.');
  return { state: st };
}

/* ------------------------------------------------------------
   7) IL CASO — monete e dadi, la probabilità che si stabilizza
   ------------------------------------------------------------ */
export function diceLab(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, { title: 'Lancia e conta', subtitle: 'la probabilità si vede solo con tanti lanci' });
  const st = { faces: 2, counts: [0, 0], total: 0, won: false };
  const setFaces = f => { st.faces = f; st.counts = new Array(f).fill(0); st.total = 0; upd(); };

  const stage = new Stage(w.body, {
    height: 230,
    draw(ctx, s) {
      bg(ctx, s);
      const N = st.faces;
      const rect = { x: 16, y: 30, w: s.w - 32, h: s.h - 72 };
      const cw = rect.w / N;
      const teor = 1 / N;
      // su schermo stretto la stessa cosa detta più corta, invece che troncata
      const stretto = s.w < 420;
      text(ctx, stretto
        ? `${st.total} lanci — tratteggio = teoria (${(teor * 100).toFixed(1)}%)`
        : `${st.total} lanci — la riga tratteggiata è la probabilità teorica (${(teor * 100).toFixed(1)}%)`,
        16, 16, { size: 11.5, color: COL.txt, max: s.w - 32 });
      /* Fondo scala: con il dado (1/6) moltiplicare per 2.2 andava bene, ma con
         la moneta (1/2) la riga teorica finiva al 110% dell'altezza, cioè fuori
         dal grafico e in mezzo alla didascalia. Ora il fondo scala si adatta,
         e la riga teorica cade sempre dentro il riquadro. */
      const fondo = Math.min(1, Math.max(0.62, teor * 2.2));
      const yDi = pr => rect.y + rect.h - Math.min(1, pr / fondo) * rect.h;
      const yT = yDi(teor);
      ctx.strokeStyle = COL.amber; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(rect.x, yT); ctx.lineTo(rect.x + rect.w, yT); ctx.stroke(); ctx.setLineDash([]);
      for (let i = 0; i < N; i++) {
        const p = st.total ? st.counts[i] / st.total : 0;
        const hgt = rect.y + rect.h - yDi(p);
        const x = rect.x + cw * i + 5;
        roundRect(ctx, x, rect.y + rect.h - hgt, cw - 10, Math.max(1, hgt), 4, { fill: COL.cyan, alpha: .85 });
        text(ctx, st.total ? (p * 100).toFixed(1) + '%' : '', x + (cw - 10) / 2, rect.y + rect.h - hgt - 8, { size: 10, align: 'center', color: COL.txt });
        const lab = N === 2 ? (i === 0 ? 'TESTA' : 'CROCE') : String(i + 1);
        text(ctx, lab, x + (cw - 10) / 2, rect.y + rect.h + 14, { size: 11, align: 'center', color: '#7f8fb3' });
        text(ctx, String(st.counts[i]), x + (cw - 10) / 2, rect.y + rect.h + 28, { size: 10, align: 'center', color: '#5b6b90' });
      }
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const roll = k => {
    for (let i = 0; i < k; i++) { st.counts[Math.floor(Math.random() * st.faces)]++; st.total++; }
    upd();
  };
  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '10px' } },
    h('button', { class: 'btn sm', onclick: () => setFaces(2) }, '🪙 moneta (2 facce)'),
    h('button', { class: 'btn sm', onclick: () => setFaces(6) }, '🎲 dado (6 facce)'),
    h('button', { class: 'btn sm primary', onclick: () => roll(1) }, 'lancia 1'),
    h('button', { class: 'btn sm primary', onclick: () => roll(10) }, 'lancia 10'),
    h('button', { class: 'btn sm primary', onclick: () => roll(1000) }, 'lancia 1000'),
    h('button', { class: 'btn sm', onclick: () => setFaces(st.faces) }, '↺ azzera'),
  ));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const teor = 100 / st.faces;
    const errs = st.counts.map(c => Math.abs((st.total ? c / st.total : 0) * 100 - teor));
    const maxErr = Math.max(...errs);
    out.set(
      `Probabilità teorica di ogni faccia: <b>1/${st.faces}</b> = ${teor.toFixed(1)}%\n` +
      `Dopo <b>${st.total}</b> lanci, lo scostamento massimo dalla teoria è <b>${st.total ? maxErr.toFixed(1) : '—'}%</b>\n` +
      (st.total >= 1000 && maxErr < 5
        ? '<span class="g">Vedi? Con tanti lanci le percentuali si sistemano da sole. Si chiama legge dei grandi numeri.</span>'
        : 'Fai altri lanci e guarda le barre avvicinarsi alla riga tratteggiata.'));
    stage.redraw();
    if (st.total >= 1000 && !st.won) { st.won = true; sfx.ok(); fx.burst(stage.w / 2, stage.h / 2); fx.flash(); cfg.onWin && cfg.onWin(); }
  }
  upd();
  w.setFoot('<b>Attenzione al tranello:</b> con pochi lanci le percentuali ballano parecchio. Nel corso misureremo i qubit centinaia di volte proprio per questo: una misura sola non dice quasi nulla, tante misure disegnano la forma della probabilità.');
  return { state: st };
}

/* ------------------------------------------------------------
   8) SENO E COSENO SENZA TRIANGOLI
   Un punto gira su un cerchio di raggio 1:
   la sua ALTEZZA è il seno, la sua OMBRA orizzontale è il coseno.
   ------------------------------------------------------------ */
export function sinCosLab(host, opts = {}) {
  const cfg = Object.assign({ onWin: null, need: 3 }, opts);
  const w = widget(host, { title: 'Seno e coseno: le due ombre', subtitle: 'trascina il punto sul cerchio' });
  const st = { a: 40, quiz: null, hits: 0, won: false };
  const near = nearSound();

  /* layout a bande, così i testi non si sovrappongono mai:
     [0..46] HUD · [46..h-58] disegno · [h-58..h] valori   */
  const geo = s => {
    const top = 50, bot = s.h - 58;
    const boxH = bot - top;
    const R = Math.min(s.w * 0.24, boxH / 2 - 14);
    return { top, bot, R, cx: 26 + R, cy: top + boxH / 2 };
  };

  const stage = new Stage(w.body, {
    height: 340,
    onPointer(e) {
      if (!e.down) return;
      const g = geo(stage);
      const ang = Math.atan2(g.cy - e.y, e.x - g.cx) * 180 / Math.PI;
      st.a = Math.round((((ang % 360) + 360) % 360) / 5) * 5;
      s1.value = st.a; upd();
    },
    draw(ctx, s) {
      bg(ctx, s);
      hud(ctx, s, {
        goal: st.quiz ? `porta il punto a ${st.quiz.a}° e leggi il ${st.quiz.which}` : 'trascina il punto sul cerchio',
        closeness: st.quiz ? 1 - Math.min(1, Math.abs(((st.a - st.quiz.a) % 360 + 540) % 360 - 180) / 180) : 0,
        hit: st.quiz ? st.a === st.quiz.a : false,
      });

      const g = geo(s);
      const rad = st.a * Math.PI / 180;
      const px = g.cx + g.R * Math.cos(rad), py = g.cy - g.R * Math.sin(rad);

      circle(ctx, g.cx, g.cy, g.R, { stroke: '#2b3b5e', dash: [4, 5] });
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(g.cx - g.R - 10, g.cy); ctx.lineTo(g.cx + g.R + 10, g.cy);
      ctx.moveTo(g.cx, g.cy - g.R - 10); ctx.lineTo(g.cx, g.cy + g.R + 10); ctx.stroke();

      ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(255,255,255,.22)';
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, g.cy); ctx.moveTo(px, py); ctx.lineTo(g.cx, py); ctx.stroke();
      ctx.setLineDash([]);
      arrow(ctx, g.cx, g.cy, px, g.cy, { color: COL.amber, width: 4, head: 9 });
      arrow(ctx, g.cx, g.cy, g.cx, py, { color: COL.green, width: 4, head: 9 });
      arrow(ctx, g.cx, g.cy, px, py, { color: COL.cyan, width: 2.4, head: 9 });
      dot(ctx, px, py, 6, COL.cyan);
      text(ctx, `${st.a}°`, g.cx, g.cy + g.R + 22, { size: 13, align: 'center', color: COL.cyan });

      // onda a destra (solo se c'è spazio davvero)
      const x0 = g.cx + g.R + 46, wD = s.w - x0 - 16;
      if (wD > 160) {
        ctx.strokeStyle = '#1b2540'; ctx.beginPath(); ctx.moveTo(x0, g.cy); ctx.lineTo(x0 + wD, g.cy); ctx.stroke();
        ctx.strokeStyle = COL.green; ctx.lineWidth = 2; ctx.beginPath();
        for (let i = 0; i <= 200; i++) {
          const aa = (i / 200) * 360;
          const X = x0 + (i / 200) * wD, Y = g.cy - Math.sin(aa * Math.PI / 180) * g.R;
          i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
        }
        ctx.stroke();
        const cx2 = x0 + (st.a / 360) * wD;
        dot(ctx, cx2, g.cy - Math.sin(rad) * g.R, 5, COL.green);
        ctx.strokeStyle = 'rgba(52,211,153,.3)'; ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.moveTo(g.cx, py); ctx.lineTo(cx2, g.cy - Math.sin(rad) * g.R); ctx.stroke(); ctx.setLineDash([]);
        text(ctx, 'l\'altezza disegnata mentre l\'angolo cresce = un\'ONDA', x0, g.top + 4, { size: 10.5, color: '#6f7fa3' });
        ['0°', '90°', '180°', '270°', '360°'].forEach((l, i) =>
          text(ctx, l, x0 + (wD * i) / 4, g.bot - 4, { size: 9.5, align: 'center', color: '#5b6b90' }));
      }

      // banda dei valori, sempre in fondo e su una riga sola
      roundRect(ctx, 8, s.h - 50, s.w - 16, 42, 8, { fill: 'rgba(255,255,255,.03)', stroke: '#1a2440' });
      const cw = (s.w - 32) / 3;
      // ogni voce resta dentro la sua colonna, se no su schermo stretto i
      // valori a 14px si scavalcano fra loro
      const col = cw - 10;
      const corto = col < 105;
      text(ctx, corto ? 'ombra orizz.' : 'ombra orizzontale', 18, s.h - 36, { size: 10, color: '#7f8fb3', max: col });
      text(ctx, `coseno = ${Math.cos(rad).toFixed(2)}`, 18, s.h - 20, { size: 14, color: COL.amber, max: col });
      text(ctx, 'altezza', 18 + cw, s.h - 36, { size: 10, color: '#7f8fb3', max: col });
      text(ctx, `seno = ${Math.sin(rad).toFixed(2)}`, 18 + cw, s.h - 20, { size: 14, color: COL.green, max: col });
      text(ctx, corto ? 'raggio' : 'raggio del cerchio', 18 + 2 * cw, s.h - 36, { size: 10, color: '#7f8fb3', max: col });
      text(ctx, '= 1 (sempre)', 18 + 2 * cw, s.h - 20, { size: 14, color: COL.cyan, max: col });

      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const s1 = slider({ label: 'Angolo', min: 0, max: 360, step: 5, value: st.a, fmt: v => v + '°', oninput: v => { st.a = v; upd(); } });
  w.body.appendChild(controls(s1.root));
  const out = readout('');
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([
    { label: '0°', onclick: () => set(0) }, { label: '90°', onclick: () => set(90) },
    { label: '180°', onclick: () => set(180) }, { label: '270°', onclick: () => set(270) },
    { label: '🎯 mettimi alla prova', class: 'sm primary', onclick: () => quiz() },
  ])));
  w.body.appendChild(out.root);

  function set(a) { st.a = a; s1.value = a; upd(); }
  function quiz() {
    const angs = [0, 90, 180, 270, 45, 60, 30];
    const which = Math.random() < 0.5 ? 'coseno' : 'seno';
    st.quiz = { a: angs[Math.floor(Math.random() * angs.length)], which };
    upd();
  }
  function upd() {
    const rad = st.a * Math.PI / 180;
    let msg = `A <b>${st.a}°</b>:  coseno = <span class="a">${Math.cos(rad).toFixed(3)}</span>   ·   seno = <span class="g">${Math.sin(rad).toFixed(3)}</span>\n` +
      `Il coseno è quanto sei spostato a <b>destra</b>, il seno quanto sei <b>in alto</b>. Entrambi stanno sempre fra −1 e +1.`;
    if (st.quiz) {
      const target = st.quiz.which === 'seno' ? Math.sin(st.quiz.a * Math.PI / 180) : Math.cos(st.quiz.a * Math.PI / 180);
      const mine = st.quiz.which === 'seno' ? Math.sin(rad) : Math.cos(rad);
      const ok = st.a === st.quiz.a;
      msg += `\n\n🎯 <b>Prova:</b> porta il punto a <b>${st.quiz.a}°</b> e guarda quanto vale il <b>${st.quiz.which}</b>.` +
        (ok ? ` <span class="g">Risposta: ${target.toFixed(2)} ✓</span>` : ` (adesso sei a ${st.a}°, dove il ${st.quiz.which} vale ${mine.toFixed(2)})`);
      if (ok) {
        st.hits++; st.quiz = null; sfx.ok();
        const g = geo(stage); fx.burst(g.cx, g.cy); fx.flash();
        if (st.hits >= cfg.need) cfg.onWin && cfg.onWin();
      } else near(1 - Math.min(1, Math.abs(((st.a - st.quiz.a) % 360 + 540) % 360 - 180) / 180));
    }
    out.set(msg);
    stage.redraw();
  }
  upd();
  w.setFoot('<b>Da qui nasce tutto:</b> se il punto continua a girare, la sua altezza disegna un\'<b>onda</b> (il seno) e la sua ombra ne disegna un\'altra (il coseno), identica ma <b>spostata di 90°</b>. Questa è la definizione di onda che useremo nel livello 1.');
  return { state: st };
}
