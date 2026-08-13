/* ============================================================
   WIDGET: LA FRECCIA CHE GIRA  —  e^{iθ} = cos θ + i sin θ
   Trascina la freccia sul cerchio: vedi in diretta la proiezione
   orizzontale (coseno) e verticale (seno) che generano l'onda.
   ============================================================ */

import { Stage, COL, bg, grid, arrow, circle, dot, text, makePlane, complexAxes, roundRect } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, h, toggle } from '../core/ui.js';
import { t } from '../core/i18n.js';

export function phasorLab(host, opts = {}) {
  const cfg = Object.assign({
    theta: Math.PI / 4, spin: 0, showWave: true,
    title: t('La freccia che gira'), subtitle: t('trascinala col mouse!'),
  }, opts);
  const w = widget(host, { title: cfg.title, subtitle: cfg.subtitle });
  const st = { theta: cfg.theta, spin: cfg.spin, trail: [] };

  /* Sotto il cerchio ci vanno due righe — «cos θ = …» e «sin θ = …» — e stanno
     a 18 e 32 pixel dal bordo del cerchio. Il raggio deve lasciarle dentro la
     tela: su un telefono girato in orizzontale la tela si accorcia (Stage la
     tiene dentro la finestra) e con un raggio scelto a occhio la riga del seno
     finiva scritta fuori. */
  const raggio = altezza => Math.min(105, altezza / 2 - 44);

  const stage = new Stage(w.body, {
    height: 330,
    onPointer(e) {
      if (!e.down) return;
      const R = raggio(stage.h);
      const cx = 20 + R, cy = stage.h / 2;
      const dx = e.x - cx, dy = cy - e.y;
      if (Math.hypot(dx, dy) < R * 1.6) { st.theta = Math.atan2(dy, dx); st.spin = 0; sSpin.value = 0; upd(); }
    },
    draw(ctx, s) {
      bg(ctx, s);
      if (st.spin) st.theta += st.spin * 0.016 * 2 * Math.PI;
      const R = raggio(s.h);
      const P = makePlane(20 + R, s.h / 2, R);
      complexAxes(ctx, P, { r: 1 });

      const th = st.theta;
      const hx = P.X(Math.cos(th)), hy = P.Y(Math.sin(th));

      // proiezioni
      ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(255,255,255,.22)';
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx, P.cy); ctx.moveTo(hx, hy); ctx.lineTo(P.cx, hy); ctx.stroke();
      ctx.setLineDash([]);
      arrow(ctx, P.cx, P.cy, hx, P.cy, { color: COL.amber, width: 3.4, head: 8, alpha: .95 });   // coseno
      arrow(ctx, P.cx, P.cy, P.cx, hy, { color: COL.green, width: 3.4, head: 8, alpha: .95 });   // seno
      arrow(ctx, P.cx, P.cy, hx, hy, { color: COL.cyan, width: 2.8, head: 10 });
      dot(ctx, hx, hy, 5, COL.cyan);

      // arco dell'angolo
      ctx.strokeStyle = COL.violet; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(P.cx, P.cy, 28, 0, -th, th > 0 ? true : false); ctx.stroke();
      const dg = ((th * 180 / Math.PI) % 360 + 360) % 360;
      text(ctx, `θ = ${dg.toFixed(0)}°`, P.cx + 34, P.cy - 16, { size: 11.5, color: COL.violet });
      text(ctx, `cos θ = ${Math.cos(th).toFixed(2)}`, P.cx - R, P.cy + R + 18, { size: 11, color: COL.amber });
      text(ctx, `sin θ = ${Math.sin(th).toFixed(2)}`, P.cx - R, P.cy + R + 32, { size: 11, color: COL.green });

      // marcatori dei quattro punti chiave
      [[0, '1'], [Math.PI / 2, 'i'], [Math.PI, '−1'], [-Math.PI / 2, '−i']].forEach(([a, l]) => {
        dot(ctx, P.X(Math.cos(a)), P.Y(Math.sin(a)), 2.6, '#4d5f86', false);
        // il marcatore a sinistra (−1) usciva di qualche pixel: si tiene dentro
        const mx = Math.max(12, Math.min(s.w - 12, P.X(1.16 * Math.cos(a))));
        text(ctx, l, mx, P.Y(1.16 * Math.sin(a)), { size: 11, align: 'center', color: '#7185ab' });
      });

      if (!cfg.showWave) return;

      // onda generata: la proiezione nel tempo
      const x0 = P.cx + R + 42, wD = s.w - x0 - 14, cy = s.h / 2;
      const cycles = 2;
      grid(ctx, x0, cy - R, wD, 2 * R, wD / (cycles * 4), R / 2);
      ctx.strokeStyle = COL.axis; ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x0 + wD, cy); ctx.stroke();
      for (const [fn, col, lab] of [[Math.cos, COL.amber, t('parte reale = cos')], [Math.sin, COL.green, t('parte immaginaria = sin')]]) {
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.globalAlpha = .95; ctx.beginPath();
        for (let i = 0; i <= 260; i++) {
          const u = i / 260, a = th + u * cycles * 2 * Math.PI;
          const X = x0 + u * wD, Y = cy - fn(a) * R;
          i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
        }
        ctx.stroke(); ctx.globalAlpha = 1;
      }
      dot(ctx, x0, cy - Math.cos(th) * R, 4.5, COL.amber);
      dot(ctx, x0, cy - Math.sin(th) * R, 4.5, COL.green);
      text(ctx, t('la freccia gira → escono le due onde'), x0, cy - R - 8, { size: 10.5, color: '#5b6b90', saltaSeTronca: true });
      text(ctx, 'cos', x0 + wD - 2, cy - R + 10, { size: 10.5, align: 'right', color: COL.amber });
      text(ctx, 'sin', x0 + wD - 2, cy - R + 24, { size: 10.5, align: 'right', color: COL.green });
    },
  });

  const out = readout('');
  const sTh = slider({ label: t('Angolo <b>θ</b>'), min: -180, max: 180, step: 1, value: st.theta * 180 / Math.PI, fmt: v => v.toFixed(0) + '°', oninput: v => { st.theta = v * Math.PI / 180; st.spin = 0; sSpin.value = 0; upd(); } });
  const sSpin = slider({ label: t('Velocità di rotazione <b>ω</b>'), min: 0, max: 1.2, step: 0.02, value: st.spin, fmt: v => v.toFixed(2) + ' ' + t('giri/s'), oninput: v => { st.spin = v; } });
  w.body.appendChild(controls(sTh.root, sSpin.root));
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([
    { label: 'θ = 0° → 1', onclick: () => set(0) },
    { label: 'θ = 90° → i', onclick: () => set(90) },
    { label: 'θ = 180° → −1', onclick: () => set(180) },
    { label: 'θ = 270° → −i', onclick: () => set(-90) },
  ])));
  w.body.appendChild(out.root);

  function set(deg) { st.theta = deg * Math.PI / 180; st.spin = 0; sSpin.value = 0; sTh.value = deg; upd(); }
  function upd() {
    const th = st.theta, dg = ((th * 180 / Math.PI) % 360 + 360) % 360;
    out.set(
      `<b>e^{iθ}</b> = cos θ + i·sin θ\n` +
      `θ = <span class="p">${dg.toFixed(0)}°</span> = ${(dg / 180).toFixed(3)}π rad\n` +
      `e^{iθ} = <span class="a">${Math.cos(th).toFixed(3)}</span> + <span class="g">${Math.sin(th).toFixed(3)}</span>i   ` + t('(lunghezza sempre = 1)'));
    stage.redraw();
    cfg.onChange && cfg.onChange(st.theta);
  }
  upd();
  w.setFoot(t('<b>Da ricordare:</b> e^{iθ} non è un numero "strano", è solo <b>la freccia lunga 1 che punta all\'angolo θ</b>. La sua ombra orizzontale è il coseno, quella verticale è il seno.'));
  return { stage, state: st, set, update: upd };
}

/* ------------------------------------------------------------
   WIDGET: moltiplicare due complessi = SOMMARE gli angoli
   (è il motivo per cui le rotazioni si fanno moltiplicando)
   ------------------------------------------------------------ */

export function multiplyLab(host, opts = {}) {
  const w = widget(host, { title: t('Moltiplicare frecce = sommare angoli'), subtitle: t('trascina A e B') });
  const st = { a: { r: 1, th: 0.5 }, b: { r: 1, th: 0.9 }, drag: null };

  const stage = new Stage(w.body, {
    height: 320,
    onPointer(e) {
      const R = Math.min(110, stage.h / 2 - 24);
      const P = makePlane(stage.w / 2, stage.h / 2, R / 1.6);
      const p = P.inv(e.x, e.y);
      if (e.type === 'down') {
        const dA = Math.hypot(p.x - st.a.r * Math.cos(st.a.th), p.y - st.a.r * Math.sin(st.a.th));
        const dB = Math.hypot(p.x - st.b.r * Math.cos(st.b.th), p.y - st.b.r * Math.sin(st.b.th));
        st.drag = dA < dB ? (dA < .4 ? 'a' : null) : (dB < .4 ? 'b' : null);
      }
      if (e.type === 'up') st.drag = null;
      if (st.drag && e.down) {
        const o = st[st.drag];
        o.r = Math.min(1.6, Math.max(0.15, Math.hypot(p.x, p.y)));
        o.th = Math.atan2(p.y, p.x);
        upd();
      }
    },
    draw(ctx, s) {
      bg(ctx, s);
      const R = Math.min(110, s.h / 2 - 24);
      const P = makePlane(s.w / 2, s.h / 2, R / 1.6);
      complexAxes(ctx, P, { r: 1 });
      const A = st.a, B = st.b;
      const Cr = A.r * B.r, Cth = A.th + B.th;
      const dr = (o, col, lab) => {
        const x = P.X(o.r * Math.cos(o.th)), y = P.Y(o.r * Math.sin(o.th));
        arrow(ctx, P.cx, P.cy, x, y, { color: col, width: 2.6 });
        dot(ctx, x, y, 5, col);
        // la lettera segue la punta della freccia, che può capitare ovunque:
        // un fondino la stacca da assi ed etichette che ci passano dietro
        roundRect(ctx, x + 4, y - 18, 10 + lab.length * 8, 16, 4, { fill: 'rgba(8,14,27,.8)' });
        text(ctx, lab, x + 8, y - 10, { size: 12, color: col, max: 8 + lab.length * 8 });
      };
      dr(A, COL.cyan, 'A');
      dr(B, COL.amber, 'B');
      dr({ r: Cr, th: Cth }, COL.pink, 'A×B');
      const deg = ang => ((ang * 180 / Math.PI) % 360 + 360) % 360;
      text(ctx, `|A| = ${A.r.toFixed(2)}   ∠A = ${deg(A.th).toFixed(0)}°`, 12, 18, { size: 11.5, color: COL.cyan });
      text(ctx, `|B| = ${B.r.toFixed(2)}   ∠B = ${deg(B.th).toFixed(0)}°`, 12, 34, { size: 11.5, color: COL.amber });
      text(ctx, `|A×B| = ${A.r.toFixed(2)}×${B.r.toFixed(2)} = ${Cr.toFixed(2)}`, 12, 54, { size: 11.5, color: COL.pink });
      text(ctx, `∠(A×B) = ${deg(A.th).toFixed(0)}° + ${deg(B.th).toFixed(0)}° = ${deg(Cth).toFixed(0)}°`, 12, 70, { size: 11.5, color: COL.pink });
    },
  });
  stage.pause();
  const out = readout('');
  function upd() {
    const A = st.a, B = st.b;
    const ar = A.r * Math.cos(A.th), ai = A.r * Math.sin(A.th);
    const br = B.r * Math.cos(B.th), bi = B.r * Math.sin(B.th);
    out.set(t('Conto "a mano":') + ` (${ar.toFixed(2)} + ${ai.toFixed(2)}i) × (${br.toFixed(2)} + ${bi.toFixed(2)}i) = ` +
      `<span class="p">${(ar * br - ai * bi).toFixed(2)} + ${(ar * bi + ai * br).toFixed(2)}i</span>\n` +
      t('Conto "con le frecce": lunghezze <b>si moltiplicano</b>, angoli <b>si sommano</b>. Stesso risultato, molto meno fatica.'));
    stage.redraw();
  }
  upd();
  w.body.appendChild(out.root);
  w.setFoot(t('Se |B| = 1 (freccia lunga 1, cioè e^{iθ}), moltiplicare per B <b>non cambia la lunghezza di A: la fa solo ruotare</b>. Ecco perché tutta Fourier — e tutte le porte di fase quantistiche — sono moltiplicazioni per e^{iθ}.'));
  return { stage, state: st };
}
