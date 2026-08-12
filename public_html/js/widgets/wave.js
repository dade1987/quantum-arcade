/* ============================================================
   WIDGET: LABORATORIO DELL'ONDA
   Sliders per ampiezza / frequenza / fase, con tutte le grandezze
   disegnate SOPRA la curva: A, periodo T, sfasamento.
   Opzionale: onda bersaglio da ricalcare (missione).
   ============================================================ */

import { Stage, COL, bg, grid, plot, dot, text, arrow, circle, roundRect, attachFX } from '../core/canvas.js';
import { widget, slider, controls, buttons, h, readout } from '../core/ui.js';
import { sfx, playTone  } from '../core/audio.js';
import { t } from '../core/i18n.js';

export function waveLab(host, opts = {}) {
  const cfg = Object.assign({
    A: 1, f: 1, phi: 0, tMax: 2,
    showPeriod: true, showPhase: true, sound: true, animate: true,
    target: null,            // {A, f, phi} da ricalcare
    tol: { A: 0.08, f: 0.12, phi: 12 },
    onChange: null, onMatch: null,
    title: t('Laboratorio dell\'onda'), subtitle: t('muovi i cursori e guarda cosa cambia'),
  }, opts);

  const w = widget(host, { title: cfg.title, subtitle: cfg.subtitle });
  const state = { A: cfg.A, f: cfg.f, phi: cfg.phi, matched: false };
  const y = (tempo, s = state) => s.A * Math.cos(2 * Math.PI * s.f * tempo + s.phi * Math.PI / 180);

  const stage = new Stage(w.body, {
    height: 300,
    draw(ctx, s) {
      bg(ctx, s);
      const L = 52, R = 14, T = 16, B = 34;
      const rect = { x: L, y: T, w: s.w - L - R, h: s.h - T - B };
      const yMax = 1.75;
      const px = tempo => rect.x + (tempo / cfg.tMax) * rect.w;
      const py = v => rect.y + rect.h / 2 - (v / yMax) * (rect.h / 2);

      grid(ctx, rect.x, rect.y, rect.w, rect.h, rect.w / (cfg.tMax * 4), rect.h / 7);

      // assi
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rect.x, py(0)); ctx.lineTo(rect.x + rect.w, py(0));
      ctx.moveTo(rect.x, rect.y); ctx.lineTo(rect.x, rect.y + rect.h);
      ctx.stroke();
      for (let tempo = 0; tempo <= cfg.tMax + 1e-6; tempo += 0.5) {
        text(ctx, tempo.toFixed(1) + 's', px(tempo), rect.y + rect.h + 13, { size: 10, align: 'center', color: '#5b6b90' });
      }
      text(ctx, '+1', L - 8, py(1), { size: 10, align: 'right', color: '#5b6b90' });
      text(ctx, '0', L - 8, py(0), { size: 10, align: 'right', color: '#5b6b90' });
      text(ctx, '−1', L - 8, py(-1), { size: 10, align: 'right', color: '#5b6b90' });
      text(ctx, t('tempo') + ' →', rect.x + rect.w, rect.y + rect.h + 26, { size: 10, align: 'right', color: '#5b6b90' });

      // onda bersaglio
      if (cfg.target) {
        plot(ctx, rect, u => y(u * cfg.tMax, cfg.target), { color: COL.pink, width: 2, dash: [6, 5], alpha: .85, yMin: -yMax, yMax });
        text(ctx, t('bersaglio'), rect.x + 8, rect.y + 12, { size: 11, color: COL.pink });
      }

      // onda dell'utente
      plot(ctx, rect, u => y(u * cfg.tMax), { color: COL.cyan, width: 2.6, glow: true, yMin: -yMax, yMax });

      // ampiezza: doppia freccia sul primo massimo
      const tPeak = ((-state.phi * Math.PI / 180) / (2 * Math.PI * state.f) + 1e9 / state.f) % (1 / state.f);
      const xA = px(Math.min(tPeak, cfg.tMax * 0.9));
      arrow(ctx, xA, py(0), xA, py(state.A), { color: COL.amber, width: 1.6, head: 7 });
      arrow(ctx, xA, py(state.A), xA, py(0), { color: COL.amber, width: 1.6, head: 7 });
      /* La scritta dell'ampiezza si disegna alla fine (vedi in fondo): le
         tratteggiate del periodo, che vengono dopo, le passavano sopra. */

      const scriviAmpiezza = () => {
        const etA = `A = ${state.A.toFixed(2)}`;
        roundRect(ctx, xA + 9, py(state.A) + 4, 62, 17, 4, { fill: 'rgba(8,14,27,.9)' });
        text(ctx, etA, xA + 13, py(state.A) + 13, { size: 11, color: COL.amber, max: 56 });
      };

      // periodo: tra due massimi consecutivi
      if (cfg.showPeriod) {
        const T = 1 / state.f;
        let x1 = px(tPeak), x2 = px(tPeak + T);
        if (x2 > rect.x + rect.w) { x1 = px(Math.max(0, tPeak - T)); x2 = px(Math.max(0, tPeak - T) + T); }
        const yb = py(-1.42);
        arrow(ctx, x1, yb, x2, yb, { color: COL.green, width: 1.6, head: 7 });
        arrow(ctx, x2, yb, x1, yb, { color: COL.green, width: 1.6, head: 7 });
        ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(52,211,153,.45)'; ctx.beginPath();
        ctx.moveTo(x1, py(state.A)); ctx.lineTo(x1, yb); ctx.moveTo(x2, py(state.A)); ctx.lineTo(x2, yb); ctx.stroke(); ctx.setLineDash([]);
        text(ctx, `T = 1/f = ${T.toFixed(2)} s`, (x1 + x2) / 2, yb - 11, { size: 11, align: 'center', color: COL.green });
      }

      // fase: quanto è spostata l'onda rispetto a φ = 0
      if (cfg.showPhase && Math.abs(state.phi) > 0.5) {
        const x0 = px(0), xs = px(tPeak);
        const yl = py(1.5);
        arrow(ctx, x0, yl, xs, yl, { color: COL.violet, width: 1.5, head: 6 });
        text(ctx, t('sfasamento') + ` φ = ${state.phi.toFixed(0)}°`, x0 + 6, yl - 10, { size: 11, color: COL.violet });
      }

      // pallino animato
      if (cfg.animate) {
        const tt = (s.t * 0.45) % cfg.tMax;
        dot(ctx, px(tt), py(y(tt)), 5, COL.cyan);
      }

      scriviAmpiezza();   // per ultima: così niente le passa sopra
    },
  });
  const fx = attachFX(stage);   // scintille, lampi e suono ai traguardi

  const out = readout('');
  const sA = slider({ label: t('Ampiezza <b>A</b> — quanto è "alta" l\'onda'), min: 0.1, max: 1.5, step: 0.01, value: state.A, fmt: v => v.toFixed(2), oninput: v => { state.A = v; upd(); } });
  const sF = slider({ label: t('Frequenza <b>f</b> — quanti cicli al secondo'), min: 0.25, max: 6, step: 0.05, value: state.f, fmt: v => v.toFixed(2) + ' Hz', oninput: v => { state.f = v; upd(); } });
  const sP = slider({ label: t('Fase <b>φ</b> — di quanto è spostata'), min: -180, max: 180, step: 1, value: state.phi, fmt: v => v.toFixed(0) + '°', oninput: v => { state.phi = v; upd(); } });

  const row = controls(sA.root, sF.root, sP.root);
  w.body.appendChild(row);
  const btns = buttons([
    cfg.sound ? { label: '🔊 ' + t('Ascolta questa frequenza'), onclick: () => playTone(Math.min(2000, Math.max(80, state.f * 110)), 1.0) } : null,
    { label: '⏯ ' + t('Pausa/Play'), onclick: () => stage.toggle() },
  ].filter(Boolean));
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, btns));
  w.body.appendChild(out.root);

  function upd() {
    const T = 1 / state.f;
    let extra = '';
    if (cfg.target) {
      const dA = Math.abs(state.A - cfg.target.A);
      const dF = Math.abs(state.f - cfg.target.f);
      let dP = Math.abs(((state.phi - cfg.target.phi + 540) % 360) - 180);
      const okA = dA <= cfg.tol.A, okF = dF <= cfg.tol.f, okP = dP <= cfg.tol.phi;
      const segno = ok => ok ? '<span class="g">✓</span>' : '<span class="a">✗</span>';
      extra = '\n' + t('<b>Bersaglio:</b> ampiezza :a · frequenza :f · fase :p', { a: segno(okA), f: segno(okF), p: segno(okP) });
      if (okA && okF && okP && !state.matched) { state.matched = true; fx.win(); sfx.ok(); cfg.onMatch && cfg.onMatch(); extra += '  <span class="g">— ' + t('PERFETTO!') + '</span>'; }
    }
    out.set(
      `<b>y(t) = A · cos(2π · f · t + φ)</b>\n` +
      `y(t) = <span class="a">${state.A.toFixed(2)}</span> · cos(2π · <span class="c">${state.f.toFixed(2)}</span> · t <span class="p">${state.phi >= 0 ? '+' : '−'} ${Math.abs(state.phi).toFixed(0)}°</span>)\n` +
      t('periodo T = 1/f = <span class="g">:T s</span>  ·  in :durata s ci stanno :cicli cicli', { T: T.toFixed(3), durata: cfg.tMax, cicli: (state.f * cfg.tMax).toFixed(2) }) + extra);
    stage.redraw();
    cfg.onChange && cfg.onChange({ ...state });
  }
  upd();

  return { stage, state, update: upd, set(p) { Object.assign(state, p); sA.value = state.A; sF.value = state.f; sP.value = state.phi; upd(); } };
}

/* ------------------------------------------------------------
   WIDGET: frequenza ↔ periodo, versione "orologio"
   Un punto gira su un cerchio: un giro completo = un periodo.
   ------------------------------------------------------------ */

export function clockWave(host, opts = {}) {
  const cfg = Object.assign({ f: 1, title: t('Il giro completo = un periodo'), subtitle: t('il pallino gira, l\'onda esce a destra') }, opts);
  const w = widget(host, { title: cfg.title, subtitle: cfg.subtitle });
  const st = { f: cfg.f };

  const stage = new Stage(w.body, {
    height: 280,
    draw(ctx, s) {
      bg(ctx, s);
      const R = Math.min(92, s.h / 2 - 22);
      const cx = 20 + R, cy = s.h / 2;
      const theta = 2 * Math.PI * st.f * s.t;

      circle(ctx, cx, cy, R, { stroke: '#2a3a5c', dash: [4, 5] });
      ctx.strokeStyle = COL.axis; ctx.beginPath();
      ctx.moveTo(cx - R - 8, cy); ctx.lineTo(cx + R + 8, cy);
      ctx.moveTo(cx, cy - R - 8); ctx.lineTo(cx, cy + R + 8); ctx.stroke();

      const hx = cx + R * Math.cos(theta), hy = cy - R * Math.sin(theta);
      arrow(ctx, cx, cy, hx, hy, { color: COL.cyan, width: 2.6 });
      dot(ctx, hx, hy, 5, COL.cyan);

      // arco dell'angolo percorso
      ctx.strokeStyle = COL.amber; ctx.lineWidth = 2; ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, -((theta) % (2 * Math.PI)), true); ctx.stroke();
      text(ctx, `${(((theta * 180 / Math.PI) % 360)).toFixed(0)}°`, cx + 32, cy - 14, { size: 11, color: COL.amber });

      // onda a destra: l'altezza del pallino nel tempo
      const x0 = cx + R + 34, wD = s.w - x0 - 12;
      const span = 3 / st.f;      // 3 periodi visibili
      grid(ctx, x0, cy - R, wD, 2 * R, wD / 6, R / 2);
      ctx.strokeStyle = COL.axis; ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x0 + wD, cy); ctx.stroke();
      ctx.strokeStyle = COL.cyan; ctx.lineWidth = 2.2; ctx.beginPath();
      for (let i = 0; i <= 240; i++) {
        const u = i / 240;
        const tt = s.t - u * span;
        const v = Math.sin(2 * Math.PI * st.f * tt);
        const X = x0 + u * wD, Y = cy - v * R;
        i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
      }
      ctx.stroke();
      // linea che collega il pallino all'inizio dell'onda
      ctx.strokeStyle = 'rgba(34,211,238,.35)'; ctx.setLineDash([3, 4]); ctx.beginPath();
      ctx.moveTo(hx, hy); ctx.lineTo(x0, cy - Math.sin(theta) * R); ctx.stroke(); ctx.setLineDash([]);
      dot(ctx, x0, cy - Math.sin(theta) * R, 4.5, COL.cyan);
      text(ctx, `f = ${st.f.toFixed(2)} Hz → T = ${(1 / st.f).toFixed(2)} s`, x0 + wD, cy - R - 6, { size: 11, align: 'right', color: COL.green });
      text(ctx, t('altezza del pallino, disegnata nel tempo'), x0, cy + R + 14, { size: 10.5, color: '#5b6b90' });
    },
  });
  const fx = attachFX(stage);   // scintille, lampi e suono ai traguardi

  const sf = slider({ label: t('Velocità di rotazione <b>f</b>'), min: 0.15, max: 3, step: 0.05, value: st.f, fmt: v => v.toFixed(2) + ' ' + t('giri/s'), oninput: v => { st.f = v; } });
  w.body.appendChild(controls(sf.root));
  w.setFoot(t('Un <b>giro completo</b> del pallino = <b>un ciclo</b> dell\'onda. Se il pallino fa 2 giri al secondo, l\'onda ha frequenza 2 Hz e periodo ½ secondo. Frequenza e periodo sono la stessa informazione, letta in due modi: <b>T = 1/f</b>.'));
  return { stage, state: st };
}
