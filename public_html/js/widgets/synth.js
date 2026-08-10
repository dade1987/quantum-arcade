/* ============================================================
   WIDGET: SINTESI — ogni segnale è una somma di onde semplici
   1) synthLab : ricostruisci il segnale misterioso muovendo le
      ampiezze delle singole frequenze (è Fourier "al contrario").
   2) squareLab: quante onde servono per fare un'onda quadra?
   ============================================================ */

import { Stage, COL, bg, grid, text, roundRect, dot, attachFX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, h } from '../core/ui.js';
import { sfx, playTones  } from '../core/audio.js';

export function synthLab(host, opts = {}) {
  const cfg = Object.assign({ nComp: 5, onSolve: null, tol: 0.10 }, opts);
  const w = widget(host, { title: 'Ricostruisci il segnale', subtitle: 'quanto c\'è di ogni frequenza?' });

  const K = cfg.nComp;                       // frequenze 1,2,...,K Hz
  const mine = new Array(K).fill(0);
  let target = randomTarget();
  let solved = false;

  function randomTarget() {
    const t = new Array(K).fill(0);
    const howMany = 2 + Math.floor(Math.random() * 2);
    const idx = [...Array(K).keys()].sort(() => Math.random() - 0.5).slice(0, howMany);
    idx.forEach(i => { t[i] = Math.round((0.3 + Math.random() * 0.7) * 10) / 10; });
    return t;
  }
  const evalSig = (amps, t) => amps.reduce((s, a, i) => s + a * Math.cos(2 * Math.PI * (i + 1) * t), 0);
  const err = () => {
    let e = 0;
    for (let i = 0; i < 200; i++) { const t = i / 200; e += (evalSig(mine, t) - evalSig(target, t)) ** 2; }
    return Math.sqrt(e / 200);
  };

  const stage = new Stage(w.body, {
    height: 330,
    draw(ctx, s) {
      bg(ctx, s);
      const specW = 132;
      const L = 30, R = 16 + specW, T = 12, B = 22;
      const rect = { x: L, y: T, w: s.w - L - R, h: s.h - T - B };
      const yMax = 2.6;
      const py = v => rect.y + rect.h / 2 - (v / yMax) * (rect.h / 2);
      grid(ctx, rect.x, rect.y, rect.w, rect.h, rect.w / 8, rect.h / 6);
      ctx.strokeStyle = COL.axis; ctx.beginPath(); ctx.moveTo(rect.x, py(0)); ctx.lineTo(rect.x + rect.w, py(0)); ctx.stroke();

      // componenti singole, tenui
      mine.forEach((a, i) => {
        if (Math.abs(a) < 0.02) return;
        ctx.strokeStyle = `hsl(${(i / K) * 300}, 80%, 60%)`; ctx.globalAlpha = .28; ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let j = 0; j <= 260; j++) { const t = j / 260; const X = rect.x + t * rect.w, Y = py(a * Math.cos(2 * Math.PI * (i + 1) * t)); j ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
        ctx.stroke(); ctx.globalAlpha = 1;
      });
      const curve = (amps, col, lw, dash) => {
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash);
        ctx.beginPath();
        for (let j = 0; j <= 320; j++) { const t = j / 320; const X = rect.x + t * rect.w, Y = py(evalSig(amps, t)); j ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
        ctx.stroke(); ctx.restore();
      };
      curve(target, COL.pink, 2.4, [6, 5]);
      curve(mine, COL.cyan, 2.8);
      text(ctx, 'misterioso', rect.x + 6, rect.y + 10, { size: 11, color: COL.pink });
      text(ctx, 'il tuo', rect.x + 82, rect.y + 10, { size: 11, color: COL.cyan });

      // spettro a destra: le "ricette" a confronto
      const sx = s.w - specW + 4, sw = specW - 16;
      text(ctx, 'RICETTA', sx, 14, { size: 10.5, color: COL.txt });
      const rowH = (s.h - 40) / K;
      for (let i = 0; i < K; i++) {
        const yy = 24 + i * rowH;
        text(ctx, `${i + 1}Hz`, sx, yy + rowH / 2, { size: 10, color: '#6f7fa3' });
        const bx = sx + 30, bw = sw - 30;
        roundRect(ctx, bx, yy + 3, bw, rowH - 12, 4, { fill: '#121c33' });
        roundRect(ctx, bx, yy + 3, bw * (target[i] / 1), (rowH - 12) / 2 - 1, 3, { fill: COL.pink, alpha: .8 });
        roundRect(ctx, bx, yy + 3 + (rowH - 12) / 2 + 1, bw * (mine[i] / 1), (rowH - 12) / 2 - 1, 3, { fill: COL.cyan, alpha: .9 });
      }
      const e = err();
      text(ctx, `errore ${e.toFixed(3)}`, sx, s.h - 8, { size: 11, color: e < cfg.tol ? COL.green : COL.amber });
    },
  });
  const fx = attachFX(stage);   // scintille, lampi e suono ai traguardi
  stage.pause();

  const out = readout('');
  const sl = [];
  const row = h('div', { class: 'ctrls' });
  for (let i = 0; i < K; i++) {
    const s = slider({
      label: `quanto di <b>${i + 1} Hz</b>`, min: 0, max: 1, step: .05, value: 0,
      oninput: v => { mine[i] = v; upd(); },
    });
    sl.push(s); row.appendChild(s.root);
  }
  w.body.appendChild(row);
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([
    { label: '🔊 il tuo', onclick: () => playTones(mine.map((a, i) => ({ freq: 220 * (i + 1), amp: a }))) },
    { label: '🔊 il misterioso', onclick: () => playTones(target.map((a, i) => ({ freq: 220 * (i + 1), amp: a }))) },
    { label: '🎲 nuovo segnale', onclick: () => { target = randomTarget(); solved = false; upd(); } },
    { label: '👁 soluzione', onclick: () => { target.forEach((v, i) => { mine[i] = v; sl[i].value = v; }); upd(); } },
  ])));
  w.body.appendChild(out.root);

  function upd() {
    const e = err();
    let msg = `Il tuo segnale = ` + mine.map((a, i) => `<span class="c">${a.toFixed(2)}</span>·cos(2π·${i + 1}·t)`).join(' + ');
    msg += `\nErrore rispetto al misterioso: <b>${e.toFixed(3)}</b> ` + (e < cfg.tol ? '<span class="g">— CENTRATO! Hai trovato la ricetta.</span>' : '(scendi sotto ' + cfg.tol + ')');
    out.set(msg);
    if (e < cfg.tol && !solved) { solved = true; fx.win(); sfx.ok(); cfg.onSolve && cfg.onSolve(); }
    stage.redraw();
  }
  upd();
  w.setFoot('Questa è <b>la sintesi</b>: costruire un segnale sommando onde. La <b>trasformata di Fourier</b> fa il lavoro inverso: guarda il segnale e ti dice da sola quanto vale ogni cursore.');
  return { stage, get amps() { return mine.slice(); }, get target() { return target.slice(); } };
}

/* ------------------------------------------------------------
   Onda quadra: sommando abbastanza sinusoidi si ottiene uno spigolo
   ------------------------------------------------------------ */

export function squareLab(host) {
  const w = widget(host, { title: 'Quante onde servono per fare uno spigolo?', subtitle: 'la serie di Fourier dell\'onda quadra' });
  const st = { n: 1 };
  const partial = (t, n) => {
    let v = 0;
    for (let k = 1; k <= n; k += 2) v += (4 / (Math.PI * k)) * Math.sin(2 * Math.PI * k * t);
    return v;
  };
  const stage = new Stage(w.body, {
    height: 270,
    draw(ctx, s) {
      bg(ctx, s);
      const L = 26, R = 12, T = 12, B = 22;
      const rect = { x: L, y: T, w: s.w - L - R, h: s.h - T - B };
      const py = v => rect.y + rect.h / 2 - (v / 1.7) * (rect.h / 2);
      grid(ctx, rect.x, rect.y, rect.w, rect.h, rect.w / 8, rect.h / 6);
      ctx.strokeStyle = COL.axis; ctx.beginPath(); ctx.moveTo(rect.x, py(0)); ctx.lineTo(rect.x + rect.w, py(0)); ctx.stroke();
      // quadra ideale
      ctx.strokeStyle = COL.pink; ctx.lineWidth = 2; ctx.setLineDash([6, 5]); ctx.beginPath();
      for (let j = 0; j <= 400; j++) { const t = (j / 400) * 2; const X = rect.x + (t / 2) * rect.w, Y = py(Math.sin(2 * Math.PI * t) >= 0 ? 1 : -1); j ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
      ctx.stroke(); ctx.setLineDash([]);
      // singole armoniche
      for (let k = 1; k <= st.n; k += 2) {
        ctx.strokeStyle = `hsl(${(k * 40) % 360}, 80%, 60%)`; ctx.globalAlpha = .22; ctx.lineWidth = 1.3; ctx.beginPath();
        for (let j = 0; j <= 300; j++) { const t = (j / 300) * 2; const X = rect.x + (t / 2) * rect.w, Y = py((4 / (Math.PI * k)) * Math.sin(2 * Math.PI * k * t)); j ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
        ctx.stroke(); ctx.globalAlpha = 1;
      }
      // somma parziale
      ctx.strokeStyle = COL.cyan; ctx.lineWidth = 2.8; ctx.beginPath();
      for (let j = 0; j <= 600; j++) { const t = (j / 600) * 2; const X = rect.x + (t / 2) * rect.w, Y = py(partial(t, st.n)); j ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
      ctx.stroke();
      const used = Math.ceil(st.n / 2);
      text(ctx, `${used} onde sommate (armoniche dispari fino a ${st.n})`, rect.x + 6, rect.y + 11, { size: 11.5, color: COL.cyan });
    },
  });
  const fx = attachFX(stage);   // scintille, lampi e suono ai traguardi
  stage.pause();
  const s = slider({ label: 'Armoniche usate', min: 1, max: 41, step: 2, value: 1, fmt: v => Math.ceil(v / 2) + ' onde', oninput: v => { st.n = v; stage.redraw(); } });
  w.body.appendChild(controls(s.root));
  w.setFoot('Anche una forma con gli <b>spigoli</b> si ottiene sommando onde tonde. Servono infinite onde per farla perfetta, ma con 10 ci siamo quasi. Formula: onda quadra = (4/π)·[sin(2πt) + ⅓sin(6πt) + ⅕sin(10πt) + …]');
  return { stage };
}
