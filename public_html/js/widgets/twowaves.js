/* ============================================================
   WIDGET: DUE ONDE CHE SI SOMMANO (interferenza)
   Sopra: le due onde e la loro somma.
   Sotto: le due frecce messe testa-coda e la freccia risultante.
   Missione tipica: farle cancellare del tutto.
   ============================================================ */

import { Stage, COL, bg, grid, arrow, circle, dot, text, makePlane, roundRect, attachFX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';

export function twoWaves(host, opts = {}) {
  const cfg = Object.assign({
    A1: 1, p1: 0, A2: 1, p2: 0, f: 1, f2: null, lockFreq: true,
    onChange: null, title: t('Due onde, una somma'), subtitle: t('cosa succede se le sposti?'),
  }, opts);
  const w = widget(host, { title: cfg.title, subtitle: cfg.subtitle });
  const st = { A1: cfg.A1, p1: cfg.p1, A2: cfg.A2, p2: cfg.p2, f: cfg.f, f2: cfg.f2 ?? cfg.f };

  const y1 = tempo => st.A1 * Math.cos(2 * Math.PI * st.f * tempo + st.p1 * Math.PI / 180);
  const y2 = tempo => st.A2 * Math.cos(2 * Math.PI * st.f2 * tempo + st.p2 * Math.PI / 180);

  const waves = new Stage(w.body, {
    height: 250,
    draw(ctx, s) {
      bg(ctx, s);
      const L = 34, R = 12, T = 12, B = 24;
      const rect = { x: L, y: T, w: s.w - L - R, h: s.h - T - B };
      const yMax = 2.4;
      const px = tempo => rect.x + (tempo / 2) * rect.w;
      const py = v => rect.y + rect.h / 2 - (v / yMax) * (rect.h / 2);
      grid(ctx, rect.x, rect.y, rect.w, rect.h, rect.w / 8, rect.h / 6);
      ctx.strokeStyle = COL.axis; ctx.beginPath(); ctx.moveTo(rect.x, py(0)); ctx.lineTo(rect.x + rect.w, py(0)); ctx.stroke();

      const curve = (fn, col, lw, alpha = 1, dash = null) => {
        ctx.save(); ctx.globalAlpha = alpha; if (dash) ctx.setLineDash(dash);
        ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
        for (let i = 0; i <= 320; i++) { const tempo = (i / 320) * 2; const X = px(tempo), Y = py(fn(tempo)); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
        ctx.stroke(); ctx.restore();
      };
      curve(y1, COL.cyan, 2, .9, [5, 4]);
      curve(y2, COL.amber, 2, .9, [5, 4]);
      curve(tempo => y1(tempo) + y2(tempo), COL.pink, 3.2, 1);

      text(ctx, t('onda A'), rect.x + 6, rect.y + 10, { size: 11, color: COL.cyan });
      text(ctx, t('onda B'), rect.x + 62, rect.y + 10, { size: 11, color: COL.amber });
      text(ctx, 'A + B', rect.x + 120, rect.y + 10, { size: 11, color: COL.pink });
      text(ctx, t('tempo') + ' →', rect.x + rect.w, rect.y + rect.h + 15, { size: 10, align: 'right', color: '#5b6b90' });
    },
  });
  waves.pause();

  const phas = new Stage(w.body, {
    height: 235,
    draw(ctx, s) {
      bg(ctx, s);
      const R = Math.min(78, s.h / 2 - 18);
      const P = makePlane(s.w * 0.28, s.h / 2, R);
      circle(ctx, P.cx, P.cy, R * 2, { stroke: '#1b2540' });
      ctx.strokeStyle = COL.axis; ctx.beginPath();
      ctx.moveTo(P.cx - R * 2.1, P.cy); ctx.lineTo(P.cx + R * 2.1, P.cy);
      ctx.moveTo(P.cx, P.cy - R * 2.1); ctx.lineTo(P.cx, P.cy + R * 2.1); ctx.stroke();

      const a1 = st.p1 * Math.PI / 180, a2 = st.p2 * Math.PI / 180;
      const v1 = { x: st.A1 * Math.cos(a1), y: st.A1 * Math.sin(a1) };
      const v2 = { x: st.A2 * Math.cos(a2), y: st.A2 * Math.sin(a2) };
      const sum = { x: v1.x + v2.x, y: v1.y + v2.y };

      arrow(ctx, P.cx, P.cy, P.X(v1.x), P.Y(v1.y), { color: COL.cyan, width: 2.6 });
      arrow(ctx, P.X(v1.x), P.Y(v1.y), P.X(sum.x), P.Y(sum.y), { color: COL.amber, width: 2.6 });
      arrow(ctx, P.cx, P.cy, P.X(sum.x), P.Y(sum.y), { color: COL.pink, width: 3.4, head: 11 });
      text(ctx, 'A', P.X(v1.x / 2) + 8, P.Y(v1.y / 2), { size: 12, color: COL.cyan });
      // la lettera resta nella metà sinistra: a destra ci sono le letture
      text(ctx, 'B', Math.min(P.X((v1.x + sum.x) / 2) + 8, s.w * 0.52), P.Y((v1.y + sum.y) / 2), { size: 12, color: COL.amber });

      const mag = Math.hypot(sum.x, sum.y);
      // barra "quanto è grande la somma"
      // si lascia posto al numero in fondo alla barra, se no finisce fuori
      const bx = s.w * 0.56, bw = s.w - bx - 58;
      text(ctx, t('ampiezza della somma'), bx, 26, { size: 11.5, color: COL.txt, max: s.w - bx - 12 });
      roundRect(ctx, bx, 36, bw, 20, 6, { fill: '#131f38', stroke: COL.line });
      const frac = Math.min(1, mag / (st.A1 + st.A2 || 1));
      roundRect(ctx, bx, 36, Math.max(2, bw * frac), 20, 6, { fill: mag < 0.06 ? COL.red : (frac > .92 ? COL.green : COL.pink) });
      text(ctx, mag.toFixed(2), bx + bw + 6, 46, { size: 12, color: COL.txt, max: s.w - (bx + bw) - 10 });

      const diff = (((st.p2 - st.p1) % 360) + 360) % 360;
      let verdict, col;
      if (mag < 0.06) { verdict = t('INTERFERENZA DISTRUTTIVA — si annullano!'); col = COL.red; }
      else if (frac > 0.95) { verdict = t('INTERFERENZA COSTRUTTIVA — si sommano!'); col = COL.green; }
      else { verdict = t('interferenza parziale'); col = COL.amber; }
      const colonna = s.w - bx - 12;
      text(ctx, verdict, bx, 76, { max: colonna, size: 12, color: col });
      /* Su una colonna stretta «differenza di fase = 180°» veniva troncata
         proprio dove c'è il numero: allora etichetta e valore vanno su due
         righe, e quello che segue scala di conseguenza. */
      let y = 96;
      if (colonna < 170) {
        text(ctx, t('differenza di fase'), bx, y, { max: colonna, size: 10.5, color: '#7f8fb3' });
        y += 16;
        text(ctx, `${diff.toFixed(0)}°`, bx, y, { max: colonna, size: 13, color: COL.violet });
      } else {
        text(ctx, t('differenza di fase') + ` = ${diff.toFixed(0)}°`, bx, y, { max: colonna, size: 11.5, color: COL.violet });
      }
      y += 18;
      text(ctx, t('(0° = in fase · 180° = in opposizione)'), bx, y, { max: colonna, size: 10.5, color: '#5b6b90', saltaSeTronca: true });
      if (st.f !== st.f2) text(ctx, t('frequenze diverse: le frecce girano a velocità diverse'), bx, y + 20, { max: colonna, size: 10.5, color: '#5b6b90' });
    },
  });
  const fx = attachFX(phas);   // scintille, lampi e suono ai traguardi
  phas.pause();

  const out = readout('');
  const sA1 = slider({ label: t('Ampiezza <b>A</b>'), min: 0, max: 1.4, step: .01, value: st.A1, oninput: v => { st.A1 = v; upd(); } });
  const sP1 = slider({ label: t('Fase <b>A</b>'), min: -180, max: 180, step: 1, value: st.p1, fmt: v => v + '°', oninput: v => { st.p1 = v; upd(); } });
  const sA2 = slider({ label: t('Ampiezza <b>B</b>'), min: 0, max: 1.4, step: .01, value: st.A2, oninput: v => { st.A2 = v; upd(); } });
  const sP2 = slider({ label: t('Fase <b>B</b>'), min: -180, max: 180, step: 1, value: st.p2, fmt: v => v + '°', oninput: v => { st.p2 = v; upd(); } });
  w.body.appendChild(controls(sA1.root, sP1.root, sA2.root, sP2.root));

  if (!cfg.lockFreq) {
    const sF1 = slider({ label: t('Frequenza <b>A</b>'), min: .5, max: 4, step: .1, value: st.f, fmt: v => v.toFixed(1) + ' Hz', oninput: v => { st.f = v; upd(); } });
    const sF2 = slider({ label: t('Frequenza <b>B</b>'), min: .5, max: 4, step: .1, value: st.f2, fmt: v => v.toFixed(1) + ' Hz', oninput: v => { st.f2 = v; upd(); } });
    w.body.appendChild(controls(sF1.root, sF2.root));
  }

  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([
    { label: t('In fase (0°)'), onclick: () => { sP1.value = 0; sP2.value = 0; st.p1 = 0; st.p2 = 0; upd(); } },
    { label: t('Opposte (180°)'), onclick: () => { sP1.value = 0; sP2.value = 180; st.p1 = 0; st.p2 = 180; upd(); } },
    { label: t('A 90°'), onclick: () => { sP1.value = 0; sP2.value = 90; st.p1 = 0; st.p2 = 90; upd(); } },
  ])));
  w.body.appendChild(out.root);

  function upd() {
    const a1 = st.p1 * Math.PI / 180, a2 = st.p2 * Math.PI / 180;
    const sx = st.A1 * Math.cos(a1) + st.A2 * Math.cos(a2);
    const sy = st.A1 * Math.sin(a1) + st.A2 * Math.sin(a2);
    const mag = Math.hypot(sx, sy);
    out.set(t('Somma delle due frecce: lunghezza <span class="p">:lunghezza</span>, angolo :angolo°', { lunghezza: mag.toFixed(3), angolo: (((Math.atan2(sy, sx) * 180 / Math.PI) % 360 + 360) % 360).toFixed(0) }) + '\n' +
      t('Massimo possibile: :max (in fase) · Minimo possibile: :min (in opposizione)', { max: (st.A1 + st.A2).toFixed(2), min: Math.abs(st.A1 - st.A2).toFixed(2) }));
    waves.redraw(); phas.redraw();
    if (mag < 0.06 && st.lastMag !== 'zero') { sfx.cancel(); st.lastMag = 'zero'; }
    else if (mag > (st.A1 + st.A2) * 0.95 && st.lastMag !== 'max') { sfx.boost(); st.lastMag = 'max'; }
    else if (mag >= 0.06 && mag <= (st.A1 + st.A2) * 0.95) st.lastMag = null;
    cfg.onChange && cfg.onChange({ ...st, mag });
  }
  upd();
  return { state: st, update: upd };
}

/* ------------------------------------------------------------
   WIDGET: TANTE FRECCE
   Se molte frecce puntano a caso, la somma è quasi zero.
   Se puntano tutte uguali, la somma è enorme. È tutta qui
   la differenza fra "frequenza assente" e "frequenza presente".
   ------------------------------------------------------------ */

export function manyArrows(host, opts = {}) {
  const cfg = Object.assign({ onChange: null }, opts);
  const w = widget(host, { title: t('Tante frecce insieme'), subtitle: t('ordine = somma grande, disordine = zero') });
  const st = { n: 13, spread: 180, seed: 1 };
  let angles = [];
  const gen = () => {
    angles = [];
    let s = st.seed * 9301;
    for (let i = 0; i < st.n; i++) {
      s = (s * 9301 + 49297) % 233280;
      angles.push(((s / 233280) - 0.5) * st.spread * Math.PI / 180);
    }
  };
  gen();

  const stage = new Stage(w.body, {
    height: 285,
    draw(ctx, s) {
      bg(ctx, s);
      const R = Math.min(s.w / 2, s.h) / 2 - 16;
      const P = makePlane(s.w * 0.5, s.h / 2, R / Math.max(2, st.n * 0.55));
      let px = P.cx, py = P.cy, sx = 0, sy = 0;
      angles.forEach((a, i) => {
        sx += Math.cos(a); sy += Math.sin(a);
        const nx = P.X(sx), ny = P.Y(sy);
        arrow(ctx, px, py, nx, ny, { color: `hsl(${(i / st.n) * 320}, 85%, 62%)`, width: 2, head: 6, alpha: .9 });
        px = nx; py = ny;
      });
      arrow(ctx, P.cx, P.cy, P.X(sx), P.Y(sy), { color: COL.pink, width: 3.4, head: 11 });
      const mag = Math.hypot(sx, sy);
      text(ctx, t(':quante frecce, ognuna lunga 1', { quante: st.n }), 12, 18, { size: 11.5, color: COL.txt });
      text(ctx, t('somma = :somma  (massimo possibile: :max)', { somma: mag.toFixed(2), max: st.n }), 12, 36, { size: 12, color: mag < st.n * 0.25 ? COL.red : COL.green });
      text(ctx, mag < st.n * 0.25 ? t('CANCELLAZIONE') : (mag > st.n * 0.9 ? t('ALLINEAMENTO PERFETTO') : t('somma parziale')), 12, 56, { size: 12, color: mag < st.n * 0.25 ? COL.red : COL.amber });
      if (cfg.onChange) cfg.onChange({ n: st.n, spread: st.spread, mag });
    },
  });
  const fx = attachFX(stage);   // scintille, lampi e suono ai traguardi
  stage.pause();
  const sN = slider({ label: t('Quante frecce'), min: 2, max: 40, step: 1, value: st.n, fmt: v => v + '', oninput: v => { st.n = v; gen(); stage.redraw(); } });
  const sS = slider({ label: t('Disordine (0° = tutte uguali)'), min: 0, max: 360, step: 5, value: st.spread, fmt: v => v + '°', oninput: v => { st.spread = v; gen(); stage.redraw(); } });
  w.body.appendChild(controls(sN.root, sS.root));
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([{ label: '🎲 ' + t('rimescola'), onclick: () => { st.seed++; gen(); stage.redraw(); } }])));
  w.setFoot(t('Metti il disordine a <b>0°</b>: la somma vale esattamente quanto il numero di frecce. Portalo a <b>360°</b>: la somma crolla vicino a zero, per quanto siano tante. Questo semplice fatto è il motore della trasformata di Fourier <b>e</b> di ogni algoritmo quantistico.'));
  return { stage };
}
