/* ============================================================
   VISUALIZZATORE DI AMPIEZZE (riusato in mezzo corso)
   Ogni stato di base ha una barra (lunghezza = |ampiezza|) e una
   freccia (angolo = fase). È la stessa idea delle frecce di Fourier.
   ============================================================ */

import { Stage, COL, bg, arrow, circle, text, roundRect, phaseColor, dot } from '../core/canvas.js';
import { probs, label } from '../core/qsim.js';
import { t } from '../core/i18n.js';

/** Disegna le ampiezze dentro un rettangolo di un canvas già esistente. */
export function drawAmps(ctx, rect, st, opts = {}) {
  const {
    highlight = -1, showArrows = true, showProb = false, title = '',
    maxAmp = null, labelMode = 'bin',
  } = opts;
  const N = st.re.length;
  const n = st.n ?? Math.log2(N);
  const pad = 4;
  const cellW = rect.w / N;
  const barW = Math.max(4, Math.min(46, cellW - 8));
  const maxA = maxAmp || Math.max(0.0001, ...Array.from({ length: N }, (_, i) => Math.hypot(st.re[i], st.im[i])));
  const arrowsH = showArrows && cellW > 22 ? Math.min(34, cellW * 0.8) : 0;
  const labelH = 16;
  const baseY = rect.y + rect.h - labelH;
  const topY = rect.y + arrowsH + (title ? 14 : 0);
  const barMaxH = baseY - topY;

  if (title) text(ctx, title, rect.x, rect.y + 6, { size: 11, color: COL.txt });

  // linea di base
  ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(rect.x, baseY + .5); ctx.lineTo(rect.x + rect.w, baseY + .5); ctx.stroke();

  for (let i = 0; i < N; i++) {
    const a = st.re[i], b = st.im[i];
    const mag = Math.hypot(a, b);
    const ph = Math.atan2(b, a);
    const cx = rect.x + cellW * (i + 0.5);
    const hgt = (mag / maxA) * barMaxH;
    const col = mag < 1e-6 ? '#243149' : phaseColor(ph);

    if (highlight === i) roundRect(ctx, cx - cellW / 2 + 1, rect.y, cellW - 2, rect.h, 6, { fill: 'rgba(251,191,36,.10)', stroke: 'rgba(251,191,36,.45)' });

    roundRect(ctx, cx - barW / 2, baseY - hgt, barW, Math.max(1.5, hgt), 3, { fill: col, alpha: .92 });
    if (showProb && mag > 0.02) {
      text(ctx, (mag * mag * 100).toFixed(0) + '%', cx, baseY - hgt - 8, { size: 9.5, align: 'center', color: COL.txt });
    }

    if (arrowsH > 2) {
      const r = arrowsH / 2 - 3;
      const ay = rect.y + arrowsH / 2 + (title ? 12 : 0);
      circle(ctx, cx, ay, r, { stroke: '#26344f' });
      if (mag > 1e-6) arrow(ctx, cx, ay, cx + r * Math.cos(ph), ay - r * Math.sin(ph), { color: col, width: 1.8, head: 5 });
      else dot(ctx, cx, ay, 1.6, '#2b3a58', false);
    }

    if (cellW > 15) {
      const lab = labelMode === 'dec' ? String(i) : '|' + label(i, n) + '⟩';
      text(ctx, lab, cx, baseY + 9, { size: Math.min(11, cellW / 3.4), align: 'center', color: highlight === i ? COL.amber : '#6f7fa3' });
    }
  }
}

/** Widget autonomo: pannello di ampiezze aggiornabile con .set(state). */
export function ampsView(host, opts = {}) {
  const cfg = Object.assign({ height: 150, showArrows: true, showProb: true, title: '', highlight: -1 }, opts);
  let st = cfg.state;
  const stage = new Stage(host, {
    height: cfg.height,
    draw(ctx, s) {
      bg(ctx, s, '#080e1b');
      if (!st) return;
      drawAmps(ctx, { x: 8, y: 6, w: s.w - 16, h: s.h - 10 }, st, cfg);
    },
  });
  stage.pause();
  return {
    stage,
    set(newState, extra = {}) { st = newState; Object.assign(cfg, extra); stage.redraw(); },
    get state() { return st; },
  };
}

/** Legenda dei colori-fase (0°=rosso, 90°=verde-giallo, 180°=ciano, 270°=viola). */
export function phaseLegend(host) {
  const s = new Stage(host, {
    height: 46,
    draw(ctx, stg) {
      bg(ctx, stg, '#080e1b');
      const w = stg.w - 120, x0 = 100;
      for (let i = 0; i < w; i++) {
        ctx.fillStyle = phaseColor((i / w) * Math.PI * 2);
        ctx.fillRect(x0 + i, 12, 1, 14);
      }
      text(ctx, t('fase') + ' →', 10, 19, { size: 11, color: COL.txt });
      ['0°', '90°', '180°', '270°', '360°'].forEach((l, i) => {
        text(ctx, l, x0 + (w * i) / 4, 36, { size: 10, align: 'center', color: '#6f7fa3' });
      });
    },
  });
  s.pause();
  return s;
}

/** Istogramma di misure ripetute (shots). counts: array di interi. */
export function histogram(host, opts = {}) {
  const cfg = Object.assign({ height: 160, n: 2, title: t('Risultati delle misure') }, opts);
  let counts = new Array(1 << cfg.n).fill(0);
  const stage = new Stage(host, {
    height: cfg.height,
    draw(ctx, s) {
      bg(ctx, s, '#080e1b');
      const total = counts.reduce((a, b) => a + b, 0) || 1;
      const N = counts.length;
      const rect = { x: 10, y: 20, w: s.w - 20, h: s.h - 46 };
      const cw = rect.w / N;
      text(ctx, cfg.title + ' — ' + t(':quante misure', { quante: total }), rect.x, 10, { size: 11, color: COL.txt });
      ctx.strokeStyle = COL.axis; ctx.beginPath();
      ctx.moveTo(rect.x, rect.y + rect.h + .5); ctx.lineTo(rect.x + rect.w, rect.y + rect.h + .5); ctx.stroke();
      const maxC = Math.max(1, ...counts);
      for (let i = 0; i < N; i++) {
        const hgt = (counts[i] / maxC) * rect.h;
        const x = rect.x + cw * i + 3;
        roundRect(ctx, x, rect.y + rect.h - hgt, cw - 6, Math.max(1, hgt), 3, { fill: counts[i] ? COL.cyan : '#243149', alpha: .9 });
        if (cw > 26) text(ctx, `${((counts[i] / total) * 100).toFixed(0)}%`, x + (cw - 6) / 2, rect.y + rect.h - hgt - 7, { size: 9.5, align: 'center', color: COL.txt });
        if (cw > 15) text(ctx, '|' + i.toString(2).padStart(cfg.n, '0') + '⟩', x + (cw - 6) / 2, rect.y + rect.h + 12, { size: Math.min(11, cw / 3.4), align: 'center', color: '#6f7fa3' });
      }
    },
  });
  stage.pause();
  return {
    stage,
    add(i) { counts[i]++; stage.redraw(); },
    reset(n = cfg.n) { cfg.n = n; counts = new Array(1 << n).fill(0); stage.redraw(); },
    get counts() { return counts; },
  };
}
