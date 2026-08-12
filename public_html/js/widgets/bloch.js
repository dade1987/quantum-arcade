/* ============================================================
   WIDGET: SFERA DI BLOCH
   Un qubit = una freccia dentro una palla. Nord = |0⟩, Sud = |1⟩.
   Trascina per girare la palla. I bottoni applicano le porte.
   ============================================================ */

import { Stage, COL, bg, arrow, circle, dot, text, roundRect } from '../core/canvas.js';
import { widget, buttons, controls, slider, readout, h } from '../core/ui.js';
import { zeroState, applyGate, GATES, RZ, RX, RY, P, blochVector, probs, measureQubit } from '../core/qsim.js';
import { str as cstr } from '../core/complex.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';

/** Renderer riutilizzabile: ritorna {stage, set(state), view} */
export function blochSphere(host, opts = {}) {
  const cfg = Object.assign({ height: 300, labels: true, showAngles: true }, opts);
  const view = { yaw: -0.6, pitch: 0.45, drag: null };
  let st = opts.state || zeroState(1);
  let target = blochVector(st, 0);
  let shown = { ...target };

  const proj = (v, cx, cy, R) => {
    const ca = Math.cos(view.yaw), sa = Math.sin(view.yaw);
    const x1 = v.x * ca - v.y * sa, y1 = v.x * sa + v.y * ca, z1 = v.z;
    const cb = Math.cos(view.pitch), sb = Math.sin(view.pitch);
    return {
      x: cx + x1 * R,
      y: cy - (z1 * cb - y1 * sb) * R,
      d: y1 * cb + z1 * sb,          // profondità: >0 davanti
    };
  };

  const stage = new Stage(host, {
    height: cfg.height,
    onPointer(e) {
      if (e.type === 'down') view.drag = { x: e.x, y: e.y, yaw: view.yaw, pitch: view.pitch };
      else if (e.type === 'up') view.drag = null;
      else if (view.drag && e.down) {
        view.yaw = view.drag.yaw + (e.x - view.drag.x) * 0.01;
        view.pitch = Math.max(-1.35, Math.min(1.35, view.drag.pitch + (e.y - view.drag.y) * 0.01));
      }
    },
    draw(ctx, s) {
      bg(ctx, s);
      /* Le righe di lettura (θ, φ, lunghezza) stanno in alto a sinistra. La
         palla era centrata sull'intera tela, quindi su uno schermo stretto il
         polo |0⟩ finiva proprio sopra la riga della fase. Ora la palla si
         centra nello spazio che resta sotto l'intestazione. */
      const cima = cfg.showAngles ? 56 : 10;
      const R = Math.min(s.w, s.h - cima) / 2 - 34;
      const cx = s.w / 2, cy = cima + (s.h - cima) / 2;

      // interpolazione morbida verso lo stato nuovo
      shown.x += (target.x - shown.x) * 0.18;
      shown.y += (target.y - shown.y) * 0.18;
      shown.z += (target.z - shown.z) * 0.18;

      circle(ctx, cx, cy, R, { stroke: '#22304d', fill: 'rgba(20,32,58,.45)' });

      // paralleli e meridiani
      const ring = (fn, col, dash) => {
        ctx.strokeStyle = col; ctx.lineWidth = 1; if (dash) ctx.setLineDash(dash);
        ctx.beginPath();
        for (let i = 0; i <= 90; i++) {
          const ang = (i / 90) * Math.PI * 2;
          const p = proj(fn(ang), cx, cy, R);
          i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
        }
        ctx.stroke(); ctx.setLineDash([]);
      };
      ring(a => ({ x: Math.cos(a), y: Math.sin(a), z: 0 }), '#2c3c60');           // equatore
      ring(a => ({ x: Math.cos(a), y: 0, z: Math.sin(a) }), '#233150', [3, 4]);
      ring(a => ({ x: 0, y: Math.cos(a), z: Math.sin(a) }), '#233150', [3, 4]);
      for (const zz of [-0.5, 0.5]) {
        const r = Math.sqrt(1 - zz * zz);
        ring(a => ({ x: r * Math.cos(a), y: r * Math.sin(a), z: zz }), '#1d2942', [2, 5]);
      }

      // assi
      const axes = [
        { v: { x: 0, y: 0, z: 1 }, l: '|0⟩', c: COL.green },
        { v: { x: 0, y: 0, z: -1 }, l: '|1⟩', c: COL.red },
        { v: { x: 1, y: 0, z: 0 }, l: '|+⟩', c: COL.cyan },
        { v: { x: -1, y: 0, z: 0 }, l: '|−⟩', c: '#3f8fa8' },
        { v: { x: 0, y: 1, z: 0 }, l: '|i⟩', c: COL.violet },
        { v: { x: 0, y: -1, z: 0 }, l: '|−i⟩', c: '#7a68b8' },
      ];
      for (const a of axes) {
        const p = proj(a.v, cx, cy, R);
        ctx.strokeStyle = '#2b3b5e'; ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.setLineDash([]);
        if (cfg.labels) {
          const pl = proj({ x: a.v.x * 1.19, y: a.v.y * 1.19, z: a.v.z * 1.19 }, cx, cy, R);
          text(ctx, a.l, pl.x, pl.y, { size: 11.5, align: 'center', color: a.c });
        }
      }

      // vettore di stato
      const p = proj(shown, cx, cy, R);
      const len = Math.hypot(shown.x, shown.y, shown.z);
      // ombra sull'equatore
      const sh = proj({ x: shown.x, y: shown.y, z: 0 }, cx, cy, R);
      ctx.strokeStyle = 'rgba(244,114,182,.28)'; ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(sh.x, sh.y); ctx.moveTo(cx, cy); ctx.lineTo(sh.x, sh.y); ctx.stroke(); ctx.setLineDash([]);
      arrow(ctx, cx, cy, p.x, p.y, { color: len < 0.02 ? '#5b6b90' : COL.pink, width: 3.4, head: 11 });
      dot(ctx, p.x, p.y, 5, COL.pink);

      if (cfg.showAngles) {
        const th = Math.acos(Math.max(-1, Math.min(1, shown.z / (len || 1)))) * 180 / Math.PI;
        const ph = ((Math.atan2(shown.y, shown.x) * 180 / Math.PI) % 360 + 360) % 360;
        const stretto = s.w < 430;
        text(ctx, `θ = ${th.toFixed(0)}°  ` + t('(quanto è "giù")'), 10, 16, { size: 11, color: COL.txt, max: s.w - 20 });
        text(ctx, `φ = ${ph.toFixed(0)}°  ` + (stretto ? t('(la FASE)') : t("(la FASE, giro sull'equatore)")),
          10, 32, { size: 11, color: COL.violet, max: s.w - 20 });
        if (len < 0.98) text(ctx, stretto ? t('lunghezza :quanto < 1 → intrecciato', { quanto: len.toFixed(2) }) : t('lunghezza :quanto < 1 → qubit intrecciato con altri', { quanto: len.toFixed(2) }),
          10, 48, { size: 10.5, color: COL.amber, max: s.w - 20 });
      }
      text(ctx, t('trascina per girare la palla'), s.w - 10, s.h - 8, { size: 10, align: 'right', color: '#4a5877', max: s.w - 20 });
    },
  });

  return {
    stage, view,
    set(newState) { st = newState; target = blochVector(st, 0); stage.redraw(); },
    snap() { shown = { ...target }; },
  };
}

/* ------------------------------------------------------------
   Playground completo su 1 qubit
   ------------------------------------------------------------ */

export function blochLab(host, opts = {}) {
  const cfg = Object.assign({
    gates: ['X', 'Y', 'Z', 'H', 'S', 'Sdg', 'T', 'Tdg'],
    showRotations: true, onChange: null, target: null,
    title: t('Il tuo qubit'), subtitle: t('applica le porte e guarda la freccia muoversi'),
  }, opts);
  const w = widget(host, { title: cfg.title, subtitle: cfg.subtitle });
  let st = zeroState(1);
  const history = [];

  const grid = h('div', { class: 'grid-2' });
  const left = h('div'), right = h('div');
  grid.append(left, right);
  w.body.appendChild(grid);

  const sphere = blochSphere(left, { height: 290 });
  const out = readout('');
  right.appendChild(h('div', { class: 'btn-row', style: { marginBottom: '10px' } },
    cfg.gates.map(g => h('button', {
      class: 'btn sm', title: GATES[g].desc,
      onclick: () => apply(GATES[g].m, GATES[g].name),
    }, GATES[g].name))));

  if (cfg.showRotations) {
    const sRz = slider({ label: t('Rotazione di fase <b>P(θ)</b> — gira sull\'equatore'), min: 0, max: 360, step: 5, value: 0, fmt: v => v + '°', oninput: () => { } });
    const bRz = h('button', { class: 'btn sm violet', onclick: () => apply(P(sRz.value * Math.PI / 180), `P(${sRz.value}°)`) }, t('applica P(θ)'));
    const sRy = slider({ label: t('Rotazione <b>RY(θ)</b> — spinge verso il basso'), min: 0, max: 360, step: 5, value: 90, fmt: v => v + '°', oninput: () => { } });
    const bRy = h('button', { class: 'btn sm violet', onclick: () => apply(RY(sRy.value * Math.PI / 180), `RY(${sRy.value}°)`) }, t('applica RY(θ)'));
    right.appendChild(controls(sRz.root, bRz));
    right.appendChild(controls(sRy.root, bRy));
  }

  right.appendChild(h('div', { class: 'btn-row', style: { marginTop: '10px' } },
    h('button', { class: 'btn sm primary', onclick: () => measure() }, '📏 ' + t('MISURA')),
    h('button', { class: 'btn sm', onclick: () => { st = zeroState(1); history.length = 0; upd(); } }, '↺ ' + t('riparti da |0⟩')),
  ));
  right.appendChild(out.root);

  function apply(U, name) {
    applyGate(st, 0, U);
    sfx.gate();
    history.push(name);
    upd();
  }
  function measure() {
    const p1 = probs(st)[1];
    const bit = measureQubit(st, 0);
    sfx.measure(bit);
    history.push(t('MISURA') + '→' + bit);
    upd(t('Hai misurato <b>:bit</b> (probabilità era :p). Lo stato è <b>collassato</b> su |:bit⟩: la sovrapposizione è persa.', { bit, p: (bit ? p1 : 1 - p1).toFixed(2) }));
  }
  function upd(extra = '') {
    sphere.set(st);
    const a = { re: st.re[0], im: st.im[0] }, b = { re: st.re[1], im: st.im[1] };
    const p = probs(st);
    out.set(
      `<b>|ψ⟩ = ${cstr(a)}·|0⟩ + ${cstr(b)}·|1⟩</b>\n` +
      t('probabilità di leggere 0: <span class="g">:p0%</span>   ·   di leggere 1: <span class="a">:p1%</span>', { p0: (p[0] * 100).toFixed(1), p1: (p[1] * 100).toFixed(1) }) + '\n' +
      t('(regola: probabilità = |ampiezza|², cioè lunghezza della freccia al quadrato)') + '\n' +
      t('porte applicate: :elenco', { elenco: history.length ? history.join(' → ') : '— ' + t('nessuna') + ' —' }) +
      (extra ? '\n\n' + extra : ''));
    cfg.onChange && cfg.onChange(st, history);
  }
  upd();
  w.setFoot(t('<b>Nota fondamentale:</b> due stati possono avere le <b>stesse probabilità</b> ma <b>fase diversa</b> (stessa altezza sulla sfera, punto diverso sull\'equatore). Le probabilità non li distinguono, ma un\'altra porta H sì: è lì che vive tutta la potenza quantistica.'));
  return { sphere, get state() { return st; }, apply, reset: () => { st = zeroState(1); history.length = 0; upd(); }, update: upd };
}
