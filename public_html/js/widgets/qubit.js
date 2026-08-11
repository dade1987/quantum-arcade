/* ============================================================
   WIDGET: BIT vs QUBIT
   1) qubitBuilder : costruisci lo stato con due manopole (θ e φ),
      guarda ampiezze, probabilità e misure ripetute.
   2) coinVsQubit  : l'esperimento decisivo. Due monete lanciate due
      volte restano 50/50; due Hadamard tornano a 0 sempre.
      Differenza = interferenza.
   ============================================================ */

import { Stage, COL, bg, arrow, circle, dot, text, roundRect, makePlane, attachFX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, h } from '../core/ui.js';
import { zeroState, applyGate, GATES, probs, measureQubit, clone } from '../core/qsim.js';
import { blochSphere } from './bloch.js';
import { histogram } from './amps.js';
import { sfx } from '../core/audio.js';

export function qubitBuilder(host, opts = {}) {
  const w = widget(host, { title: 'Costruisci il tuo qubit', subtitle: 'due manopole: quanto |1⟩ e quale fase' });
  const st = { theta: 60, phi: 0 };
  const mk = () => {
    const t = st.theta * Math.PI / 180, p = st.phi * Math.PI / 180;
    const s = zeroState(1);
    s.re[0] = Math.cos(t / 2); s.im[0] = 0;
    s.re[1] = Math.sin(t / 2) * Math.cos(p); s.im[1] = Math.sin(t / 2) * Math.sin(p);
    return s;
  };

  const grid = h('div', { class: 'grid-2' });
  const left = h('div'), right = h('div');
  grid.append(left, right); w.body.appendChild(grid);
  const sphere = blochSphere(left, { height: 270 });

  const ampStage = new Stage(right, {
    height: 200,
    draw(ctx, s) {
      bg(ctx, s);
      const cur = mk();
      const R = Math.min(s.w / 2 - 30, s.h / 2 - 34);
      [[0, '|0⟩', COL.green], [1, '|1⟩', COL.amber]].forEach(([i, lab, col]) => {
        const P = makePlane(s.w * (i ? 0.74 : 0.26), s.h / 2 + 4, R);
        circle(ctx, P.cx, P.cy, R, { stroke: '#22304d', dash: [3, 5] });
        ctx.strokeStyle = '#243250'; ctx.beginPath();
        ctx.moveTo(P.cx - R, P.cy); ctx.lineTo(P.cx + R, P.cy);
        ctx.moveTo(P.cx, P.cy - R); ctx.lineTo(P.cx, P.cy + R); ctx.stroke();
        const re = cur.re[i], im = cur.im[i];
        arrow(ctx, P.cx, P.cy, P.X(re), P.Y(im), { color: col, width: 3, head: 10 });
        const mag = Math.hypot(re, im);
        text(ctx, `ampiezza di ${lab}`, P.cx, 16, { size: 11.5, align: 'center', color: col });
        text(ctx, `${re.toFixed(2)} ${im < 0 ? '−' : '+'} ${Math.abs(im).toFixed(2)}i`, P.cx, s.h - 26, { size: 11, align: 'center', color: COL.txt });
        text(ctx, `|·|² = ${(mag * mag * 100).toFixed(1)}%`, P.cx, s.h - 10, { size: 11, align: 'center', color: '#8fa0c4' });
      });
    },
  });
  const fx = attachFX(ampStage);   // scintille, lampi e suono ai traguardi
  ampStage.pause();

  const hist = histogram(right, { n: 1, height: 130, title: 'Misure' });
  const out = readout('');
  const sT = slider({ label: 'θ — <b>quanto |1⟩</b> c\'è', min: 0, max: 180, step: 1, value: st.theta, fmt: v => v + '°', oninput: v => { st.theta = v; upd(); } });
  const sP = slider({ label: 'φ — <b>la fase</b> (non cambia le probabilità!)', min: 0, max: 360, step: 5, value: st.phi, fmt: v => v + '°', oninput: v => { st.phi = v; upd(); } });
  w.body.appendChild(controls(sT.root, sP.root));
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([
    { label: '📏 misura 1 volta', onclick: () => shots(1) },
    { label: '📏 misura 100 volte', onclick: () => shots(100) },
    { label: '↺ azzera istogramma', onclick: () => hist.reset(1) },
  ])));
  w.body.appendChild(out.root);

  function shots(k) {
    let last = 0;
    for (let i = 0; i < k; i++) { const s = mk(); last = measureQubit(s, 0); hist.add(last); }
    sfx.measure(last);
  }
  function upd() {
    const cur = mk(); const p = probs(cur);
    sphere.set(cur); ampStage.redraw();
    out.set(
      `<b>|ψ⟩ = cos(θ/2)·|0⟩ + e^{iφ}·sin(θ/2)·|1⟩</b>\n` +
      `   = <span class="g">${Math.cos(st.theta * Math.PI / 360).toFixed(3)}</span>·|0⟩ + <span class="a">${Math.sin(st.theta * Math.PI / 360).toFixed(3)}·e^{i·${st.phi}°}</span>·|1⟩\n` +
      `probabilità: 0 → <span class="g">${(p[0] * 100).toFixed(1)}%</span>, 1 → <span class="a">${(p[1] * 100).toFixed(1)}%</span>  ` +
      `(somma sempre 100%: ${(p[0] + p[1]).toFixed(3)})\n` +
      `<b>Prova:</b> muovi solo φ. Le probabilità NON cambiano… ma lo stato sì. Quella differenza invisibile è ciò che la prossima porta userà.`);
  }
  upd();
  return { update: upd };
}

/* ------------------------------------------------------------
   L'esperimento che dimostra che un qubit ≠ moneta truccata
   ------------------------------------------------------------ */

export function coinVsQubit(host, opts = {}) {
  const cfg = Object.assign({ onDiscover: null }, opts);
  const w = widget(host, { title: 'Moneta contro qubit', subtitle: 'due "lanci" a testa: chi torna a casa?' });
  const grid = h('div', { class: 'grid-2' });
  const left = h('div'), right = h('div');
  grid.append(left, right); w.body.appendChild(grid);

  left.appendChild(h('div', { class: 'small dim', html: '<b>🪙 MONETA CLASSICA</b> — la mescoli due volte' }));
  const hc = histogram(left, { n: 1, height: 150, title: 'moneta: mescola, mescola, guarda' });
  right.appendChild(h('div', { class: 'small dim', html: '<b>⚛️ QUBIT</b> — applichi H due volte' }));
  const hq = histogram(right, { n: 1, height: 150, title: 'qubit: H, H, misura' });
  const fx = attachFX(hq.stage);   // scintille, lampi e suono ai traguardi

  const out = readout('');
  let done = false;
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([
    { label: '▶ prova 200 volte entrambi', class: 'sm primary', onclick: () => run(200) },
    { label: '↺ azzera', onclick: () => { hc.reset(1); hq.reset(1); } },
  ])));
  w.body.appendChild(out.root);

  function run(k) {
    for (let i = 0; i < k; i++) {
      // moneta: due mescolate casuali → resta casuale
      let bit = 0;
      bit = Math.random() < 0.5 ? 0 : 1;
      bit = Math.random() < 0.5 ? 0 : 1;
      hc.add(bit);
      // qubit: H poi H → torna esattamente |0>
      const s = zeroState(1);
      applyGate(s, 0, GATES.H.m);
      applyGate(s, 0, GATES.H.m);
      hq.add(measureQubit(s, 0));
    }
    const c = hc.counts, q = hq.counts;
    out.set(
      `MONETA: 0 → ${c[0]} volte, 1 → ${c[1]} volte  (resta 50/50: il caso non si "disfa")\n` +
      `QUBIT : 0 → <span class="g">${q[0]}</span> volte, 1 → <span class="g">${q[1]}</span> volte  (torna SEMPRE a 0!)\n\n` +
      `<b>Perché?</b> Dopo la prima H il qubit non è "0 oppure 1 con il 50%": è <b>entrambi con due ampiezze</b>.\n` +
      `La seconda H fa incontrare quelle ampiezze: sul risultato |1⟩ una arriva <b>+</b> e l'altra <b>−</b>, e si cancellano.\n` +
      `Questo è il <b>colpo di scena</b>: le probabilità classiche non si cancellano mai, le ampiezze sì.`);
    if (!done) { done = true; fx.win(); sfx.boss(); cfg.onDiscover && cfg.onDiscover(); }
  }
  w.setFoot('Se un qubit fosse solo "una moneta nascosta", mescolare due volte lo lascerebbe casuale. Invece torna esattamente al punto di partenza: la prova che dentro c\'è qualcosa che <b>si può cancellare</b>, cioè un\'onda.');
  return {};
}

/* ------------------------------------------------------------
   Mini-simulatore visivo di H su |0⟩ e |1⟩ (le due strade)
   ------------------------------------------------------------ */

export function hadamardMap(host) {
  const w = widget(host, { title: 'Cosa fa esattamente H', subtitle: 'le quattro regole, disegnate' });
  const stage = new Stage(w.body, {
    // impilati servono due riquadri per riga: più alto, se no la nota in
    // fondo finisce sopra l'ultimo
    height: window.innerWidth < 430 ? 300 : 250,
    draw(ctx, s) {
      bg(ctx, s);
      const rows = [
        { inp: '|0⟩', out: ['+1/√2 · |0⟩', '+1/√2 · |1⟩'], sign: [1, 1] },
        { inp: '|1⟩', out: ['+1/√2 · |0⟩', '−1/√2 · |1⟩'], sign: [1, -1] },
      ];
      /* La tabella era disegnata a coordinate fisse: i due riquadri partivano a
         130 e 320 px ed erano larghi 175, cioè servivano quasi 500 px. Su un
         telefono la tela ne ha 300 e la metà destra finiva fuori. Ora la
         larghezza è calcolata, e sotto una certa soglia i due risultati si
         impilano invece di stare affiancati. */
      const etichetta = 92;
      const impila = s.w < 430;
      const boxW = impila ? s.w - etichetta - 24 : Math.min(175, (s.w - etichetta - 30) / 2);
      const passoRiga = impila ? 118 : 100;
      rows.forEach((r, i) => {
        const y = 26 + i * passoRiga;
        text(ctx, 'H ' + r.inp + '  =', 16, y + 26, { size: 15, color: COL.txt, max: etichetta - 20 });
        r.out.forEach((o, j) => {
          const x = impila ? etichetta : etichetta + j * (boxW + 12);
          const yb = impila ? y + j * 56 : y;
          roundRect(ctx, x, yb, boxW, 52, 8, { fill: r.sign[j] > 0 ? 'rgba(52,211,153,.10)' : 'rgba(251,113,133,.10)', stroke: r.sign[j] > 0 ? 'rgba(52,211,153,.5)' : 'rgba(251,113,133,.5)' });
          text(ctx, o, x + 12, yb + 20, { size: 13, color: r.sign[j] > 0 ? COL.green : COL.red, max: boxW - 24 });
          const ax = x + boxW - 35, ay = yb + 30;
          arrow(ctx, ax - 16, ay, ax + 16 * r.sign[j], ay, { color: r.sign[j] > 0 ? COL.green : COL.red, width: 2.4 });
          text(ctx, r.sign[j] > 0 ? 'freccia →' : 'freccia ←', x + 12, yb + 40, { size: 10.5, color: '#8fa0c4', max: boxW - 60 });
        });
      });
      text(ctx, s.w < 430
        ? 'La differenza è quel MENO: da lì nasce l\'interferenza.'
        : 'L\'unica differenza fra le due righe è quel MENO. Tutta l\'interferenza quantistica nasce da lì.',
        16, s.h - 16, { size: 11.5, color: COL.amber, max: s.w - 32 });
    },
  });
  stage.pause();
  return { stage };
}

/* ------------------------------------------------------------
   IL QUADRATO DELLA PROBABILITÀ

   "probabilità = |ampiezza|²" è il punto in cui, provando il corso, una
   persona si è fermata dicendo "per me è arabo". Il problema non era la
   difficoltà del concetto: era che il simbolo arrivava prima del fenomeno.

   Qui il quadrato lo si vede. Il lato è l'ampiezza, e la probabilità è
   l'AREA. Trascini il lato, l'area cresce più in fretta del lato, e la
   percentuale segue l'area. Nessuno ti dice "elevalo al quadrato": lo
   guardi succedere. Il nome della cosa arriva alla fine, come didascalia.
   ------------------------------------------------------------ */
export function probabilitaQuadrato(host, opts = {}) {
  const cfg = Object.assign({ onWin: null, need: 3 }, opts);
  const w = widget(host, {
    title: 'Perché si eleva al quadrato',
    subtitle: 'il lato è l\'ampiezza, l\'area è la probabilità',
  });
  const st = { a: 0.8, centrati: 0, fatti: new Set(), bersaglio: 0.5 };
  const BERSAGLI = [0.5, 0.25, 0.09, 0.64];

  const stage = new Stage(w.body, {
    height: 260,
    draw(ctx, s) {
      bg(ctx, s);
      const p = st.a * st.a;
      const vicino = Math.abs(p - st.bersaglio) < 0.02;

      text(ctx, vicino ? '✓ CENTRATO!' : `🎯 fai diventare l'area ${Math.round(st.bersaglio * 100)}%`,
        16, 18, { size: 13, weight: '800', mono: false, color: vicino ? COL.green : COL.amber, max: s.w - 32 });

      // il quadrato: lato = ampiezza, area = probabilità
      const lato = Math.min(s.h - 92, s.w * 0.42);
      const x0 = 20, y0 = 40;
      roundRect(ctx, x0, y0, lato, lato, 4, { stroke: '#2b3b5e' });
      const l = lato * st.a;
      roundRect(ctx, x0, y0 + lato - l, l, l, 3, { fill: 'rgba(34,211,238,.30)', stroke: COL.cyan });

      // il lato, misurato
      ctx.strokeStyle = COL.amber; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x0, y0 + lato + 12); ctx.lineTo(x0 + l, y0 + lato + 12); ctx.stroke();
      text(ctx, `lato = ${st.a.toFixed(2)}`, x0, y0 + lato + 28, { size: 11.5, color: COL.amber, max: lato });

      // la lettura, a destra del quadrato
      const rx = x0 + lato + 18;
      const spazio = s.w - rx - 14;
      text(ctx, 'AREA', rx, y0 + 16, { size: 11, color: '#7f8fb3', max: spazio });
      text(ctx, `${(p * 100).toFixed(0)}%`, rx, y0 + 44, { size: 26, weight: '800', color: COL.cyan, max: spazio });
      text(ctx, 'è la probabilità', rx, y0 + 66, { size: 11, color: '#7f8fb3', max: spazio });
      text(ctx, `${st.a.toFixed(2)} × ${st.a.toFixed(2)}`, rx, y0 + 92, { size: 13, color: COL.txt, max: spazio });
      text(ctx, `= ${p.toFixed(2)}`, rx, y0 + 112, { size: 13, color: COL.cyan, max: spazio });

      text(ctx, s.w < 430 ? 'dimezza il lato: l\'area diventa un quarto' : 'dimezza il lato e l\'area diventa un quarto, non la metà',
        16, s.h - 12, { size: 11, color: '#6f7fa3', max: s.w - 32 });
    },
  });

  const out = readout('');
  const sl = slider({
    label: 'Lunghezza del lato (l\'ampiezza)', min: 0, max: 1, step: 0.01, value: st.a,
    fmt: v => (+v).toFixed(2),
    oninput: v => { st.a = +v; upd(); },
  });
  w.body.appendChild(sl.root);
  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '8px' } },
    BERSAGLI.map(b => h('button', {
      class: 'btn sm', onclick: () => { st.bersaglio = b; upd(); },
    }, `obiettivo ${Math.round(b * 100)}%`))));
  w.body.appendChild(out.root);

  function upd() {
    const p = st.a * st.a;
    const vicino = Math.abs(p - st.bersaglio) < 0.02;
    out.set(`Lato <b>${st.a.toFixed(2)}</b> → area <b>${(p * 100).toFixed(1)}%</b>\n` +
      `Il lato è cresciuto di poco, l'area di molto: è questo che vuol dire "al quadrato".` +
      (vicino ? `\n<span class="g">🎯 centrato!</span>` : ''));
    stage.redraw();
    if (vicino && !st.fatti.has(st.bersaglio)) {
      st.fatti.add(st.bersaglio); sfx.ok();
      if (st.fatti.size >= cfg.need) cfg.onWin && cfg.onWin(st.fatti.size);
    }
  }
  upd();
  w.setFoot('<b>Adesso il nome:</b> quello che hai appena mosso si chiama <b>ampiezza</b>, e l\'area del quadrato — cioè l\'ampiezza moltiplicata per sé stessa — è la <b>probabilità</b> di ottenere quel risultato quando misuri. Si scrive <code>|ampiezza|²</code>: sono le stesse tre cose che hai davanti, scritte corte.');
  return { state: st };
}
