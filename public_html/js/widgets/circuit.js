/* ============================================================
   WIDGET: COSTRUTTORE DI CIRCUITI QUANTISTICI
   Scegli una porta dalla tavolozza, clicca sulla griglia, simula.
   Sotto: ampiezze (barre + frecce di fase) e istogramma delle misure.
   ============================================================ */

import { Stage, COL, bg, text, roundRect, dot, circle, arrow, attachFX } from '../core/canvas.js';
import { widget, buttons, h, readout, slider, controls } from '../core/ui.js';
import { zeroState, applyOp, clone, probs, label, sample, GATES, qftOps } from '../core/qsim.js';
import { ampsView, histogram } from './amps.js';
import { str as cstr } from '../core/complex.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';

const PALETTE = [
  { g: 'H', lab: 'H', col: COL.cyan, desc: t('Hadamard: crea sovrapposizione') },
  { g: 'X', lab: 'X', col: COL.pink, desc: t('NOT quantistico') },
  { g: 'Y', lab: 'Y', col: COL.pink, desc: t('rotazione 180° attorno a Y') },
  { g: 'Z', lab: 'Z', col: COL.violet, desc: t('segno meno su |1⟩') },
  { g: 'S', lab: 'S', col: COL.violet, desc: t('fase +90° su |1⟩') },
  { g: 'T', lab: 'T', col: COL.violet, desc: t('fase +45° su |1⟩') },
  { g: 'CNOT', lab: '⊕ CNOT', col: COL.amber, desc: t('NOT controllato: clicca prima il controllo, poi il bersaglio') },
  { g: 'CZ', lab: 'CZ', col: COL.amber, desc: t('Z controllata') },
  { g: 'SWAP', lab: '⇄ SWAP', col: COL.green, desc: t('scambia due qubit') },
];

const PRESETS = {
  bell: { n: 2, name: t('Stato di Bell'), ops: [{ g: 'H', t: 0, c: [] }, { g: 'X', t: 1, c: [0] }] },
  ghz: { n: 3, name: t('GHZ (3 qubit)'), ops: [{ g: 'H', t: 0, c: [] }, { g: 'X', t: 1, c: [0] }, { g: 'X', t: 2, c: [1] }] },
  sup: { n: 3, name: t('Sovrapposizione totale'), ops: [{ g: 'H', t: 0, c: [] }, { g: 'H', t: 1, c: [] }, { g: 'H', t: 2, c: [] }] },
  hh: { n: 1, name: t('H·H = identità'), ops: [{ g: 'H', t: 0, c: [] }, { g: 'H', t: 0, c: [] }] },
  hzh: { n: 1, name: 'H·Z·H = X', ops: [{ g: 'H', t: 0, c: [] }, { g: 'Z', t: 0, c: [] }, { g: 'H', t: 0, c: [] }] },
  qft3: { n: 3, name: t('QFT su 3 qubit'), ops: qftOps(3) },
};

export function circuitLab(host, opts = {}) {
  const cfg = Object.assign({ n: 3, maxCols: 10, preset: null, onChange: null, title: t('Laboratorio dei circuiti'), subtitle: t('scegli una porta, clicca sulla griglia') }, opts);
  const w = widget(host, {
    modo: 'quantistico', title: cfg.title, subtitle: cfg.subtitle });

  const st = {
    n: cfg.n, ops: [], sel: 'H', pending: null, step: -1,
  };
  if (cfg.preset && PRESETS[cfg.preset]) { st.n = PRESETS[cfg.preset].n; st.ops = PRESETS[cfg.preset].ops.map(o => ({ ...o })); }

  /* --- disegno del circuito --- */
  let geom = {};
  const circ = new Stage(w.body, {
    height: 40 + cfg.n * 46 + 30,
    onPointer(e) {
      if (e.type !== 'down') return;
      const { x0, colW, rowH, y0 } = geom;
      const col = Math.floor((e.x - x0) / colW);
      const row = Math.floor((e.y - y0 + rowH / 2) / rowH);
      if (col < 0 || col >= cfg.maxCols || row < 0 || row >= st.n) return;
      place(col, row);
    },
    draw(ctx, s) {
      bg(ctx, s);
      const x0 = 46, y0 = 34, colW = Math.min(52, (s.w - x0 - 16) / cfg.maxCols), rowH = 46;
      geom = { x0, y0, colW, rowH };
      // fili
      for (let q = 0; q < st.n; q++) {
        const y = y0 + q * rowH;
        ctx.strokeStyle = '#2b3b5e'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(x0 - 26, y); ctx.lineTo(x0 + colW * cfg.maxCols, y); ctx.stroke();
        text(ctx, `q${q}`, 12, y, { size: 12, color: COL.txt });
        text(ctx, '|0⟩', 28, y, { size: 11, color: '#6f7fa3' });
      }
      // griglia leggera
      for (let c = 0; c <= cfg.maxCols; c++) {
        ctx.strokeStyle = '#141d33'; ctx.beginPath();
        ctx.moveTo(x0 + c * colW, y0 - rowH / 2 + 6); ctx.lineTo(x0 + c * colW, y0 + (st.n - 1) * rowH + rowH / 2 - 6); ctx.stroke();
      }
      // porte
      st.ops.forEach((op, i) => {
        const c = op.col ?? i;
        const cx = x0 + c * colW + colW / 2;
        const done = st.step >= 0 && i <= st.step;
        const alpha = st.step < 0 || done ? 1 : .32;
        const drawBox = (q, lab, col) => {
          const y = y0 + q * rowH;
          roundRect(ctx, cx - 15, y - 15, 30, 30, 6, { fill: '#111b30', stroke: col, width: 1.6, alpha });
          text(ctx, lab, cx, y, { size: 13, align: 'center', color: col, mono: false, weight: '800' });
        };
        ctx.globalAlpha = alpha;
        if (op.g === 'SWAP') {
          const y1 = y0 + op.t * rowH, y2 = y0 + op.t2 * rowH;
          ctx.strokeStyle = COL.green; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(cx, y1); ctx.lineTo(cx, y2); ctx.stroke();
          [y1, y2].forEach(y => {
            ctx.beginPath(); ctx.moveTo(cx - 7, y - 7); ctx.lineTo(cx + 7, y + 7);
            ctx.moveTo(cx + 7, y - 7); ctx.lineTo(cx - 7, y + 7); ctx.stroke();
          });
        } else {
          if (op.c && op.c.length) {
            const yc = y0 + op.c[0] * rowH, yt = y0 + op.t * rowH;
            ctx.strokeStyle = COL.amber; ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.moveTo(cx, yc); ctx.lineTo(cx, yt); ctx.stroke();
            dot(ctx, cx, yc, 5, COL.amber, false);
            if (op.g === 'X') {
              circle(ctx, cx, yt, 12, { stroke: COL.amber, width: 1.8 });
              ctx.strokeStyle = COL.amber; ctx.beginPath();
              ctx.moveTo(cx - 12, yt); ctx.lineTo(cx + 12, yt); ctx.moveTo(cx, yt - 12); ctx.lineTo(cx, yt + 12); ctx.stroke();
            } else drawBox(op.t, op.g === 'P' ? 'P' : op.g, COL.amber);
          } else {
            const pal = PALETTE.find(p => p.g === op.g);
            drawBox(op.t, op.g === 'P' ? 'P' : op.g, pal ? pal.col : COL.cyan);
          }
        }
        ctx.globalAlpha = 1;
      });
      // controllo in attesa
      if (st.pending) {
        const cx = x0 + st.pending.col * colW + colW / 2, y = y0 + st.pending.row * rowH;
        dot(ctx, cx, y, 6, COL.red);
        text(ctx, t('ora clicca il bersaglio'), cx + 12, y - 18, { size: 10, color: COL.red });
      }
      text(ctx, st.step >= 0 ? t('passo :i/:totali', { i: st.step + 1, totali: st.ops.length }) : t('circuito completo'), s.w - 12, 14, { size: 11, align: 'right', color: COL.amber });
    },
  });
  const fx = attachFX(circ);   // scintille, lampi e suono ai traguardi
  circ.pause();

  /* --- tavolozza --- */
  const palRow = h('div', { class: 'btn-row', style: { marginTop: '10px' } });
  const palBtns = PALETTE.map(p => {
    const b = h('button', { class: 'btn sm', title: p.desc, onclick: () => { st.sel = p.g; st.pending = null; paint(); } }, p.lab);
    palRow.appendChild(b); return b;
  });
  const paint = () => palBtns.forEach((b, i) => b.className = 'btn sm' + (PALETTE[i].g === st.sel ? ' primary' : ''));
  paint();
  w.body.appendChild(palRow);

  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '8px' } },
    h('button', { class: 'btn sm', onclick: () => { st.ops.pop(); update(); } }, '⌫ ' + t('togli ultima')),
    h('button', { class: 'btn sm', onclick: () => { st.ops = []; st.step = -1; update(); } }, '🗑 ' + t('svuota')),
    h('button', { class: 'btn sm primary', onclick: () => shots(200) }, '📏 ' + t('misura 200 volte')),
    h('button', { class: 'btn sm', onclick: () => { hist.reset(st.n); } }, '↺ ' + t('azzera misure')),
    ...Object.entries(PRESETS).map(([k, p]) => h('button', {
      class: 'btn sm ghost', onclick: () => { st.n = Math.max(st.n, p.n); st.ops = p.ops.map(o => ({ ...o })); st.step = -1; rebuild(); },
    }, p.name)),
  ));

  const stepS = slider({
    label: t('Esegui passo per passo'), min: -1, max: 0, step: 1, value: -1,
    fmt: v => v < 0 ? t('tutto') : t('dopo il passo :n', { n: v + 1 }),
    oninput: v => { st.step = v; update(false); },
  });
  w.body.appendChild(controls(stepS.root));

  const ampHost = h('div');
  const histHost = h('div');
  w.body.append(ampHost, histHost);
  const amps = ampsView(ampHost, { height: 165, showProb: true, title: '' });
  const hist = histogram(histHost, { n: st.n, height: 150 });
  const out = readout('');
  w.body.appendChild(out.root);

  function place(col, row) {
    if (st.sel === 'CNOT' || st.sel === 'CZ' || st.sel === 'SWAP') {
      if (!st.pending) { st.pending = { col, row }; circ.redraw(); return; }
      if (st.pending.row === row) { st.pending = null; circ.redraw(); return; }
      const a = st.pending.row, b = row;
      st.pending = null;
      if (st.sel === 'SWAP') st.ops.push({ g: 'SWAP', t: a, t2: b, col });
      else st.ops.push({ g: st.sel === 'CNOT' ? 'X' : 'Z', t: b, c: [a], col });
    } else {
      st.ops.push({ g: st.sel, t: row, c: [], col });
    }
    update();
  }

  function currentState(upTo) {
    const s = zeroState(st.n);
    const lim = upTo === undefined || upTo < 0 ? st.ops.length : upTo + 1;
    for (let i = 0; i < lim; i++) applyOp(s, st.ops[i]);
    return s;
  }

  function shots(k) {
    const s = currentState(st.step);
    let last = 0;
    for (let i = 0; i < k; i++) { last = sample(s); hist.add(last); }
    sfx.measure(last & 1);
  }

  function rebuild() {
    circ._height = 40 + st.n * 46 + 30;
    circ.resize();
    hist.reset(st.n);
    update();
  }

  function update(resetSlider = true) {
    if (resetSlider) {
      stepS.input.max = String(Math.max(0, st.ops.length - 1));
      if (st.step >= st.ops.length) st.step = -1;
      stepS.value = st.step;
    }
    const s = currentState(st.step);
    amps.set(s);
    const p = probs(s);
    const terms = [];
    for (let i = 0; i < p.length; i++) {
      if (p[i] > 1e-6) terms.push(`${cstr({ re: s.re[i], im: s.im[i] })} |${label(i, st.n)}⟩`);
    }
    out.set('<b>' + t('Stato attuale:') + `</b>\n|ψ⟩ = ${terms.join('  +  ') || '—'}\n` +
      t('Porte: :porte · qubit: :qubit', { porte: st.ops.length, qubit: st.n }) + '\n' +
      t('Probabilità più alta: :percento% su |:stato⟩', { percento: (Math.max(...p) * 100).toFixed(1), stato: label(p.indexOf(Math.max(...p)), st.n) }));
    circ.redraw();
    cfg.onChange && cfg.onChange({ ops: st.ops, state: s, n: st.n });
  }
  update();

  w.setFoot(t('Le <b>barre colorate</b> sono le ampiezze: altezza = quanto è grande, colore e freccia = la fase. Due barre uguali ma di colore opposto sono due frecce opposte: se un\'altra porta le fa incontrare, <b>si cancellano</b>.'));
  return { state: st, update, get statevector() { return currentState(st.step); } };
}
