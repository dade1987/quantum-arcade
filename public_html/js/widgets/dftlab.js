/* ============================================================
   WIDGET PRINCIPALE DELLA PARTE A: LA DFT SMONTATA
   - a sinistra i campioni x(n) (li trascini col mouse)
   - al centro le N frecce ruotate, attaccate testa-coda
   - in basso lo spettro |X(k)|
   Cambi k → cambi la velocità di rotazione → vedi se le frecce
   si allineano (frequenza presente) o si cancellano (assente).
   ============================================================ */

import { sfx } from '../core/audio.js';
import { Stage, COL, bg, grid, arrow, circle, dot, text, roundRect, makePlane, hsl, attachFX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, h, choice } from '../core/ui.js';
import { fromArray, dft, dftTerms, magnitudes } from '../core/dsp.js';

const PRESETS = {
  'alternato': { label: '1 0 1 0 …', gen: N => Array.from({ length: N }, (_, i) => i % 2 === 0 ? 1 : 0) },
  'costante': { label: 'tutto uguale', gen: N => Array.from({ length: N }, () => 1) },
  'impulso': { label: 'un solo colpo', gen: N => Array.from({ length: N }, (_, i) => i === 0 ? 1 : 0) },
  'coseno1': { label: '1 ciclo', gen: N => Array.from({ length: N }, (_, i) => Math.cos(2 * Math.PI * i / N)) },
  'coseno3': { label: '3 cicli', gen: N => Array.from({ length: N }, (_, i) => Math.cos(2 * Math.PI * 3 * i / N)) },
  'periodo4': { label: 'periodo 4', gen: N => Array.from({ length: N }, (_, i) => (i % 4 === 0 ? 1 : 0)) },
  'casuale': { label: '🎲 a caso', gen: N => Array.from({ length: N }, () => Math.round((Math.random() * 2 - 1) * 10) / 10) },
};

export function dftLab(host, opts = {}) {
  const cfg = Object.assign({
    N: 8, preset: 'alternato', k: 1, title: 'La macchina di Fourier',
    subtitle: 'trascina i campioni, cambia k, guarda le frecce',
    onChange: null, showMission: false,
  }, opts);

  const w = widget(host, { title: cfg.title, subtitle: cfg.subtitle });
  const N = cfg.N;
  const st = {
    x: PRESETS[cfg.preset].gen(N),
    k: cfg.k, anim: false, prog: N, drag: false,
  };

  const sig = () => fromArray(st.x);
  let rects = {};

  function layout(s) {
    const wide = s.w >= 660;
    if (wide) {
      const topH = s.h - 122;
      return {
        samples: { x: 8, y: 8, w: s.w * 0.44 - 12, h: topH },
        plane: { x: s.w * 0.44 + 4, y: 8, w: s.w * 0.56 - 12, h: topH },
        spec: { x: 8, y: s.h - 110, w: s.w - 16, h: 100 },
      };
    }
    return {
      samples: { x: 8, y: 8, w: s.w - 16, h: 96 },
      plane: { x: 8, y: 110, w: s.w - 16, h: s.h - 110 - 118 },
      spec: { x: 8, y: s.h - 106, w: s.w - 16, h: 98 },
    };
  }

  const stage = new Stage(w.body, {
    height: 520,
    onPointer(e) {
      const R = rects;
      if (!R.samples) return;
      const inR = (r) => e.x >= r.x && e.x <= r.x + r.w && e.y >= r.y && e.y <= r.y + r.h;
      if (e.type === 'down' && inR(R.spec)) {
        const i = Math.floor(((e.x - R.spec.x) / R.spec.w) * N);
        if (i >= 0 && i < N) { st.k = i; sK.value = i; upd(); }
        return;
      }
      if (e.type === 'down' && inR(R.samples)) st.drag = true;
      if (e.type === 'up') st.drag = false;
      if (st.drag && inR(R.samples)) {
        const i = Math.floor(((e.x - R.samples.x) / R.samples.w) * N);
        if (i >= 0 && i < N) {
          const mid = R.samples.y + R.samples.h / 2;
          const v = Math.max(-1.5, Math.min(1.5, ((mid - e.y) / (R.samples.h / 2)) * 1.5));
          st.x[i] = Math.round(v * 20) / 20;
          upd();
        }
      }
    },
    draw(ctx, s) {
      bg(ctx, s);
      rects = layout(s);
      drawSamples(ctx, rects.samples);
      drawPlane(ctx, rects.plane);
      drawSpectrum(ctx, rects.spec);
      if (st.anim) {
        st.prog += 0.045;
        if (st.prog > N + 1.6) st.prog = 0;
      }
    },
  });
  const fx = attachFX(stage);   // scintille, lampi e suono ai traguardi

  function drawSamples(ctx, r) {
    roundRect(ctx, r.x, r.y, r.w, r.h, 8, { stroke: '#1a2440' });
    text(ctx, 'x(n) — i tuoi dati (trascinali!)', r.x + 8, r.y + 12, { size: 11, color: COL.txt, max: r.w - 16 });
    const mid = r.y + r.h / 2;
    const cw = r.w / N;
    ctx.strokeStyle = COL.axis; ctx.beginPath(); ctx.moveTo(r.x + 4, mid); ctx.lineTo(r.x + r.w - 4, mid); ctx.stroke();
    for (let i = 0; i < N; i++) {
      const cx = r.x + cw * (i + .5);
      const hgt = (st.x[i] / 1.5) * (r.h / 2 - 14);
      const col = hsl(i, N);
      roundRect(ctx, cx - Math.min(15, cw / 2 - 3), mid - Math.max(0, hgt), Math.min(30, cw - 6), Math.abs(hgt) || 1.5, 3, { fill: col, alpha: .85 });
      dot(ctx, cx, mid - hgt, 4, col, false);
      // il valore non sale mai fin sopra il titolo del riquadro
      const yVal = Math.max(r.y + 26, mid - hgt + (hgt >= 0 ? -12 : 12));
      text(ctx, st.x[i].toFixed(2), cx, yVal, { size: 9.5, align: 'center', color: COL.txt });
      if (cw > 26) text(ctx, 'n=' + i, cx, r.y + r.h - 8, { size: 9.5, align: 'center', color: '#6f7fa3', max: cw });
      else if (cw > 15 && i % 4 === 0) text(ctx, String(i), cx, r.y + r.h - 8, { size: 9.5, align: 'center', color: '#6f7fa3', max: cw * 2 });
    }
  }

  function drawPlane(ctx, r) {
    roundRect(ctx, r.x, r.y, r.w, r.h, 8, { stroke: '#1a2440' });
    const { terms, cum, total } = dftTerms(sig(), st.k);
    const maxR = Math.max(1e-6, Math.abs(total.re), Math.abs(total.im),
      ...cum.map(c => Math.hypot(c.re, c.im)), ...terms.map(t => Math.hypot(t.re, t.im)));
    const R = Math.min(r.w, r.h) / 2 - 26;
    const P = makePlane(r.x + r.w / 2, r.y + r.h / 2 + 4, R / (maxR * 1.06));

    // assi
    ctx.strokeStyle = '#243250'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(P.cx - R - 6, P.cy); ctx.lineTo(P.cx + R + 6, P.cy);
    ctx.moveTo(P.cx, P.cy - R - 6); ctx.lineTo(P.cx, P.cy + R + 6); ctx.stroke();
    circle(ctx, P.cx, P.cy, P.scale, { stroke: '#22304d', dash: [3, 5] });
    text(ctx, `frecce ruotate a velocità k = ${st.k}`, r.x + 8, r.y + 12, { size: 11, color: COL.txt });

    const upTo = st.anim ? Math.min(N, Math.floor(st.prog)) : N;
    // catena testa-coda
    let px = P.cx, py = P.cy;
    for (let n = 0; n < upTo; n++) {
      const t = terms[n];
      const nx = P.X(cum[n].re), ny = P.Y(cum[n].im);
      arrow(ctx, px, py, nx, ny, { color: hsl(n, N), width: 2.2, head: 7, alpha: .95 });
      px = nx; py = ny;
    }
    if (upTo === N) {
      arrow(ctx, P.cx, P.cy, P.X(total.re), P.Y(total.im), { color: COL.pink, width: 3.6, head: 12 });
      const mag = Math.hypot(total.re, total.im);
      const etX = `X(${st.k}) = ${mag.toFixed(2)}`;
      const larghX = 12 + etX.length * 7;
      // la punta della freccia può stare vicino al bordo: il fondino e la
      // scritta rientrano invece di uscire dalla tela
      const exX = Math.min(P.X(total.re) + 4, r.x + r.w - larghX - 6);
      roundRect(ctx, exX, P.Y(total.im) - 19, larghX, 17, 4, { fill: 'rgba(8,14,27,.82)' });
      text(ctx, etX, exX + 4, P.Y(total.im) - 10, { size: 12, color: COL.pink, max: larghX - 8 });
    }
    // posizioni dell'orologio: dove punta e^{-i2πkn/N}
    /* I numeri stanno attorno all'orologio: quando k è alto due indici finiscono
       nella stessa posizione angolare e le cifre si sovrappongono. Si tiene il
       primo che occupa quel punto. */
    const presi = [];
    for (let n = 0; n < N; n++) {
      const th = -2 * Math.PI * st.k * n / N;
      const cx2 = P.cx + Math.cos(th) * (R + 14), cy2 = P.cy - Math.sin(th) * (R + 14);
      if (presi.some(q => Math.hypot(q[0] - cx2, q[1] - cy2) < 13)) continue;
      presi.push([cx2, cy2]);
      text(ctx, String(n), cx2, cy2, { size: 9.5, align: 'center', color: n < upTo ? hsl(n, N) : '#39466a' });
    }
    if (st.anim) text(ctx, `sto sommando la freccia n = ${Math.min(N - 1, Math.floor(st.prog))}`, r.x + 8, r.y + r.h - 8, { size: 10.5, color: COL.amber });
  }

  function drawSpectrum(ctx, r) {
    roundRect(ctx, r.x, r.y, r.w, r.h, 8, { stroke: '#1a2440' });
    const X = dft(sig());
    const m = magnitudes(X);
    const maxM = Math.max(1e-6, ...m);
    const cw = r.w / N;
    text(ctx, '|X(k)| — quanto c\'è di ogni frequenza (clicca una barra)', r.x + 8, r.y + 11, { size: 11, color: COL.txt });
    const base = r.y + r.h - 16;
    for (let k = 0; k < N; k++) {
      const cx = r.x + cw * (k + .5);
      const hgt = (m[k] / maxM) * (r.h - 34);
      const sel = k === st.k;
      roundRect(ctx, cx - Math.min(17, cw / 2 - 3), base - hgt, Math.min(34, cw - 6), Math.max(1.5, hgt), 3,
        { fill: sel ? COL.amber : COL.violet, alpha: sel ? 1 : .55 });
      // se le colonne sono strette le etichette si toccherebbero: se ne
      // scrive una ogni due, più sempre quella selezionata
      if (cw > 26 || sel || (cw > 15 && k % 4 === 0)) {
        text(ctx, (cw > 26 ? 'k=' : '') + k, cx, base + 9, { size: 9.5, align: 'center', color: sel ? COL.amber : '#6f7fa3', max: cw });
      }
      if (m[k] > maxM * 0.02) text(ctx, m[k].toFixed(1), cx, Math.max(r.y + 26, base - hgt - 7), { size: 9, align: 'center', color: '#8fa0c4', max: cw * 1.6 });
    }
  }

  const out = readout('');
  const sK = slider({
    label: 'Frequenza da testare <b>k</b> (cicli sull\'intera finestra)', min: 0, max: N - 1, step: 1, value: st.k,
    fmt: v => 'k = ' + v, oninput: v => { st.k = v; upd(); },
  });
  w.body.appendChild(controls(sK.root));
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([
    { label: '▶ somma le frecce una alla volta', onclick: () => { st.anim = !st.anim; st.prog = 0; } },
    ...Object.entries(PRESETS).map(([k2, p]) => ({ label: p.label, onclick: () => { st.x = p.gen(N); upd(); } })),
  ])));
  w.body.appendChild(out.root);

  function upd() {
    const { terms, total } = dftTerms(sig(), st.k);
    const mag = Math.hypot(total.re, total.im);
    const ph = Math.atan2(total.im, total.re) * 180 / Math.PI;
    let lines = terms.map((t, n) => {
      const ang = ((-360 * st.k * n / N) % 360 + 360) % 360;
      return `  n=${n}: x=${st.x[n].toFixed(2)} ruotato di ${ang.toFixed(0)}° → (${t.re.toFixed(2)}, ${t.im.toFixed(2)}i)`;
    }).join('\n');
    out.set(
      `<b>X(${st.k}) = Σ x(n) · e^(−i·2π·${st.k}·n/${N})</b>\n${lines}\n` +
      `  <b>somma =</b> <span class="p">${total.re.toFixed(2)} ${total.im < 0 ? '−' : '+'} ${Math.abs(total.im).toFixed(2)}i</span>` +
      `   → lunghezza <span class="a">${mag.toFixed(2)}</span>, fase ${((ph % 360) + 360) % 360 | 0}°\n` +
      (mag < 0.35 ? '  <span class="c">Le frecce si sono cancellate: questa frequenza NON c\'è.</span>'
        : '  <span class="g">Le frecce si sono allineate: questa frequenza C\'È.</span>'));
    stage.redraw();
    cfg.onChange && cfg.onChange({ x: st.x.slice(), k: st.k, mag });
  }
  upd();
  return { stage, state: st, update: upd, setSamples(arr) { st.x = arr.slice(); upd(); } };
}

/* ------------------------------------------------------------
   WIDGET: avvolgimento continuo (intuizione "3Blue1Brown")
   Il segnale viene arrotolato attorno a un cerchio a velocità f:
   quando f coincide con una frequenza del segnale, il centro di
   massa schizza lontano dall'origine.
   ------------------------------------------------------------ */

export function windingLab(host, opts = {}) {
  const cfg = Object.assign({ freqs: [2, 5], title: 'Arrotola il segnale attorno al cerchio', subtitle: 'e guarda il centro di massa' }, opts);
  const w = widget(host, { title: cfg.title, subtitle: cfg.subtitle });
  const st = { f: 1, sweep: false };
  const sigFn = t => cfg.freqs.reduce((s, fr) => s + Math.cos(2 * Math.PI * fr * t), 0) / cfg.freqs.length + 1.15;

  const stage = new Stage(w.body, {
    height: 370,
    draw(ctx, s) {
      bg(ctx, s);
      if (st.sweep) { st.f += 0.006; if (st.f > 8) st.f = 0.2; sF.value = st.f; }
      const wide = s.w >= 620;
      const wRect = wide ? { x: 8, y: 8, w: s.w * 0.42, h: s.h - 90 } : { x: 8, y: 8, w: s.w - 16, h: 84 };
      const cRect = wide ? { x: s.w * 0.44, y: 8, w: s.w * 0.56 - 12, h: s.h - 90 } : { x: 8, y: 96, w: s.w - 16, h: s.h - 96 - 86 };
      const gRect = { x: 8, y: s.h - 78, w: s.w - 16, h: 70 };

      // segnale
      roundRect(ctx, wRect.x, wRect.y, wRect.w, wRect.h, 8, { stroke: '#1a2440' });
      text(ctx, `segnale: ${cfg.freqs.join(' Hz + ')} Hz`, wRect.x + 8, wRect.y + 12, { size: 11, color: COL.txt });
      ctx.strokeStyle = COL.cyan; ctx.lineWidth = 2; ctx.beginPath();
      for (let i = 0; i <= 300; i++) {
        const t = i / 300, X = wRect.x + t * wRect.w, Y = wRect.y + wRect.h - (sigFn(t) / 2.4) * (wRect.h - 26) - 8;
        i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
      }
      ctx.stroke();

      // avvolgimento
      roundRect(ctx, cRect.x, cRect.y, cRect.w, cRect.h, 8, { stroke: '#1a2440' });
      const R = Math.min(cRect.w, cRect.h) / 2 - 22;
      const P = makePlane(cRect.x + cRect.w / 2, cRect.y + cRect.h / 2, R / 2.3);
      ctx.strokeStyle = '#243250'; ctx.beginPath();
      ctx.moveTo(P.cx - R, P.cy); ctx.lineTo(P.cx + R, P.cy);
      ctx.moveTo(P.cx, P.cy - R); ctx.lineTo(P.cx, P.cy + R); ctx.stroke();
      let sr = 0, si = 0;
      ctx.strokeStyle = COL.amber; ctx.lineWidth = 1.6; ctx.globalAlpha = .9; ctx.beginPath();
      const M = 460;
      for (let i = 0; i < M; i++) {
        const t = i / M, v = sigFn(t), th = -2 * Math.PI * st.f * t;
        const x = v * Math.cos(th), y = v * Math.sin(th);
        sr += x; si += y;
        const X = P.X(x), Y = P.Y(y);
        i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
      }
      ctx.stroke(); ctx.globalAlpha = 1;
      sr /= M; si /= M;
      arrow(ctx, P.cx, P.cy, P.X(sr), P.Y(si), { color: COL.pink, width: 3, head: 10 });
      dot(ctx, P.X(sr), P.Y(si), 5, COL.pink);
      text(ctx, `f = ${st.f.toFixed(2)} Hz`, cRect.x + 8, cRect.y + 12, { size: 11.5, color: COL.txt });
      text(ctx, `centro di massa = ${Math.hypot(sr, si).toFixed(3)}`, cRect.x + 8, cRect.y + 28, { size: 11, color: COL.pink });

      // grafico dello "spettro" continuo
      roundRect(ctx, gRect.x, gRect.y, gRect.w, gRect.h, 8, { stroke: '#1a2440' });
      text(ctx, 'quanto vale il centro di massa al variare di f →', gRect.x + 8, gRect.y + 11, { size: 10.5, color: '#6f7fa3' });
      ctx.strokeStyle = COL.green; ctx.lineWidth = 1.8; ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const f = 0.2 + (i / 200) * 7.8;
        let ar = 0, ai = 0;
        for (let j = 0; j < 160; j++) { const t = j / 160, v = sigFn(t), th = -2 * Math.PI * f * t; ar += v * Math.cos(th); ai += v * Math.sin(th); }
        const mag = Math.hypot(ar / 160, ai / 160);
        const X = gRect.x + (i / 200) * gRect.w, Y = gRect.y + gRect.h - 6 - mag * (gRect.h - 22) * 1.7;
        i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
      }
      ctx.stroke();
      const fx = gRect.x + ((st.f - 0.2) / 7.8) * gRect.w;
      ctx.strokeStyle = COL.pink; ctx.setLineDash([3, 4]); ctx.beginPath();
      ctx.moveTo(fx, gRect.y + 4); ctx.lineTo(fx, gRect.y + gRect.h - 4); ctx.stroke(); ctx.setLineDash([]);
    },
  });
  const fx = attachFX(stage);   // scintille, lampi e suono ai traguardi

  const sF = slider({ label: 'Velocità di avvolgimento <b>f</b>', min: 0.2, max: 8, step: .02, value: st.f, fmt: v => v.toFixed(2) + ' Hz', oninput: v => { st.f = v; st.sweep = false; } });
  w.body.appendChild(controls(sF.root));
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([
    { label: '▶ scansiona tutte le frequenze', onclick: () => { st.sweep = !st.sweep; } },
  ])));
  w.setFoot(`Quando la velocità di avvolgimento <b>coincide con una frequenza contenuta nel segnale</b> (qui ${cfg.freqs.join(' Hz e ')} Hz), i "picchi" del segnale finiscono sempre dalla stessa parte del cerchio e il centro di massa scappa via dall'origine. È esattamente ciò che calcola la formula della trasformata.`);
  return { stage, state: st };
}
