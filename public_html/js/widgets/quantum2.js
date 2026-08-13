/* ============================================================
   WIDGET quantistici di raccordo
   1) polaroidLab  : i fotoni e i filtri polaroid (il qubit "fisico")
   2) twoQubitLab  : due qubit, prodotto tensoriale, entanglement
   3) teleportLab  : teletrasporto quantistico passo per passo
   ============================================================ */

import { Stage, COL, bg, text, roundRect, dot, circle, arrow, makePlane, attachFX } from '../core/canvas.js';
import { widget, buttons, slider, controls, readout, h } from '../core/ui.js';
import {
  zeroState, basisState, applyGate, GATES, probs, label, measureQubit, clone,
  blochVector, sample, fromAmps,
} from '../core/qsim.js';
import { ampsView, histogram } from './amps.js';
import { blochSphere } from './bloch.js';
import { str as cstr } from '../core/complex.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';

/* ------------------------------------------------------------
   1) FOTONI E FILTRI POLAROID
   Il qubit fisico più semplice: la polarizzazione della luce.
   Due filtri incrociati bloccano tutto; se ne infili un terzo
   a 45° IN MEZZO, la luce ripassa. Sembra magia, è misura.
   ------------------------------------------------------------ */
export function polaroidLab(host, opts = {}) {
  const cfg = Object.assign({ onDiscover: null }, opts);
  const w = widget(host, { title: t('Fotoni e filtri polaroid'), subtitle: t('l\'esperimento dei tre filtri') });
  const st = { a1: 0, a2: 90, a3: 45, useThird: false, n: 1000 };

  const frac = () => {
    // Legge di Malus: dopo ogni filtro passa cos²(differenza di angolo)
    const d1 = 0.5;                                   // luce non polarizzata: metà passa dal primo filtro
    if (!st.useThird) {
      const c = Math.cos((st.a2 - st.a1) * Math.PI / 180);
      return { steps: [d1, c * c], total: d1 * c * c };
    }
    const c1 = Math.cos((st.a3 - st.a1) * Math.PI / 180);
    const c2 = Math.cos((st.a2 - st.a3) * Math.PI / 180);
    return { steps: [d1, c1 * c1, c2 * c2], total: d1 * c1 * c1 * c2 * c2 };
  };

  const stage = new Stage(w.body, {
    height: 285,
    draw(ctx, s) {
      bg(ctx, s);
      const f = frac();
      const filters = st.useThird ? [st.a1, st.a3, st.a2] : [st.a1, st.a2];
      const n = filters.length;
      const gap = (s.w - 60) / (n + 1);
      const cy = s.h / 2 - 10;
      // fascio
      let intensity = 1;
      let x = 20;
      const drawBeam = (x1, x2, inten, col) => {
        ctx.fillStyle = col; ctx.globalAlpha = Math.max(0.05, inten);
        ctx.fillRect(x1, cy - 16 * Math.max(.15, inten), x2 - x1, 32 * Math.max(.15, inten));
        ctx.globalAlpha = 1;
      };
      filters.forEach((ang, i) => {
        const fx = 40 + gap * (i + 1);
        drawBeam(x, fx - 16, intensity, i === 0 ? '#ffe9a8' : COL.cyan);
        x = fx + 16;
        intensity *= f.steps[i];
        // filtro
        roundRect(ctx, fx - 14, cy - 52, 28, 104, 6, { fill: 'rgba(167,139,250,.13)', stroke: COL.violet });
        const rr = ang * Math.PI / 180;
        for (let k = -3; k <= 3; k++) {
          const ox = k * 7 * Math.cos(rr + Math.PI / 2), oy = k * 7 * Math.sin(rr + Math.PI / 2);
          ctx.strokeStyle = 'rgba(167,139,250,.55)'; ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(fx + ox - 13 * Math.cos(rr), cy + oy + 13 * Math.sin(rr));
          ctx.lineTo(fx + ox + 13 * Math.cos(rr), cy + oy - 13 * Math.sin(rr));
          ctx.stroke();
        }
        text(ctx, `${ang}°`, fx, cy + 66, { size: 11.5, align: 'center', color: COL.violet });
        text(ctx, t('passa :percento%', { percento: (f.steps[i] * 100).toFixed(0) }), fx, cy + 82, { size: 10, align: 'center', color: '#7f8fb3' });
      });
      drawBeam(x, s.w - 16, intensity, COL.green);
      text(ctx, t('sorgente'), 20, cy - 44, { size: 11, color: '#ffe9a8' });
      const tot = f.total;
      text(ctx, tot < 0.005 ? 'BUIO TOTALE' : `passa il ${(tot * 100).toFixed(1)}% della luce`,
        s.w - 16, cy - 44, { size: 13, align: 'right', color: tot < 0.005 ? COL.red : COL.green });
    },
  });
  const fx = attachFX(stage);   // scintille, lampi e suono ai traguardi
  stage.pause();

  const s1 = slider({ label: t('Filtro 1'), min: 0, max: 180, step: 5, value: st.a1, fmt: v => v + '°', oninput: v => { st.a1 = v; upd(); } });
  const s2 = slider({ label: t('Filtro finale'), min: 0, max: 180, step: 5, value: st.a2, fmt: v => v + '°', oninput: v => { st.a2 = v; upd(); } });
  const s3 = slider({ label: t('Filtro in mezzo'), min: 0, max: 180, step: 5, value: st.a3, fmt: v => v + '°', oninput: v => { st.a3 = v; upd(); } });
  w.body.appendChild(controls(s1.root, s2.root, s3.root));
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([
    { label: '➕ ' + t('metti/togli il filtro in mezzo'), class: 'sm primary', onclick: () => { st.useThird = !st.useThird; upd(); } },
    { label: t('filtri incrociati (0° e 90°)'), onclick: () => { st.a1 = 0; st.a2 = 90; s1.value = 0; s2.value = 90; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const f = frac();
    const crossed = Math.abs(((st.a2 - st.a1) % 180 + 180) % 180 - 90) < 1;
    let msg = '<b>' + t('Legge di Malus:') + '</b> ' + t('attraverso un filtro passa cos²(differenza di angolo).') + '\n';
    if (!st.useThird) {
      msg += t('Differenza fra i due filtri: :gradi° → cos²(:gradi°) = <b>:percento%</b>', { gradi: Math.abs(st.a2 - st.a1), percento: (f.steps[1] * 100).toFixed(1) }) + '\n';
      if (crossed) msg += '<span class="p">' + t('Filtri incrociati (90°): non passa NIENTE.') + '</span> ' + t('Prova ad aggiungere un terzo filtro a 45° <b>in mezzo</b>…');
    } else {
      msg += t('1° → 3° (in mezzo): cos²(:gradi°) = :percento%', { gradi: Math.abs(st.a3 - st.a1), percento: (f.steps[1] * 100).toFixed(1) }) + '\n' +
        t('3° → 2°: cos²(:gradi°) = :percento%', { gradi: Math.abs(st.a2 - st.a3), percento: (f.steps[2] * 100).toFixed(1) }) + '\n' +
        '<b>' + t('Totale: :percento%', { percento: (f.total * 100).toFixed(1) }) + '</b>';
      if (crossed && f.total > 0.01) {
        msg += '\n<span class="g">🤯 ' + t('Aggiungendo un filtro la luce passa DI PIÙ, non di meno!') + '</span>\n' +
          t('Un filtro non "seleziona": <b>misura</b>, e la misura <b>riscrive</b> lo stato del fotone. Dopo il filtro a 45° il fotone È a 45°, e da lì ha di nuovo una possibilità di passare a 90°.');
        if (!st.celebrated) { st.celebrated = true; fx.win(); sfx.boss(); }
        cfg.onDiscover && cfg.onDiscover();
      }
    }
    out.set(msg);
    stage.redraw();
  }
  upd();
  w.setFoot(t('Un fotone polarizzato è il <b>qubit fisico</b> più semplice: verticale = |0⟩, orizzontale = |1⟩, e le direzioni oblique sono <b>sovrapposizioni</b>. La probabilità di passare è il <b>quadrato del coseno</b> dell\'angolo: ecco da dove viene "probabilità = ampiezza²".'));
  return { state: st };
}

/* ------------------------------------------------------------
   2) DUE QUBIT: prodotto tensoriale ed entanglement
   ------------------------------------------------------------ */
export function twoQubitLab(host, opts = {}) {
  const cfg = Object.assign({ onEntangle: null }, opts);
  const w = widget(host, { title: t('Due qubit'), subtitle: t('quattro ampiezze, e la sorpresa dell\'entanglement') });
  let st = zeroState(2);
  const hist = { seq: [] };

  const grid = h('div', { class: 'grid-2' });
  const left = h('div'), right = h('div');
  grid.append(left, right); w.body.appendChild(grid);

  const ampHost = h('div'); left.appendChild(ampHost);
  const amps = ampsView(ampHost, { height: 170, showProb: true });
  const fx = attachFX(amps.stage);   // scintille, lampi e suono ai traguardi
  const b0host = h('div'), b1host = h('div');
  const bl = h('div', { class: 'grid-2' }); bl.append(b0host, b1host); right.appendChild(bl);
  const sph0 = blochSphere(b0host, { height: 165, showAngles: false });
  const sph1 = blochSphere(b1host, { height: 165, showAngles: false });

  const gbtn = (lab, fn, title) => h('button', { class: 'btn sm', title, onclick: () => { fn(); hist.seq.push(lab); upd(); } }, lab);
  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '10px' } },
    gbtn('H q0', () => applyGate(st, 0, GATES.H.m)),
    gbtn('H q1', () => applyGate(st, 1, GATES.H.m)),
    gbtn('X q0', () => applyGate(st, 0, GATES.X.m)),
    gbtn('X q1', () => applyGate(st, 1, GATES.X.m)),
    gbtn('Z q0', () => applyGate(st, 0, GATES.Z.m)),
    gbtn('Z q1', () => applyGate(st, 1, GATES.Z.m)),
    gbtn('CNOT q0→q1', () => applyGate(st, 1, GATES.X.m, [0]), 'se q0 è 1, ribalta q1'),
    gbtn('CNOT q1→q0', () => applyGate(st, 0, GATES.X.m, [1])),
    h('button', { class: 'btn sm primary', onclick: () => runShots(200) }, '📏 misura 200 volte'),
    h('button', { class: 'btn sm', onclick: () => { st = zeroState(2); hist.seq = []; hg.reset(2); upd(); } }, '↺ riparti'),
  ));

  const hgHost = h('div'); w.body.appendChild(hgHost);
  const hg = histogram(hgHost, { n: 2, height: 145, title: t('Risultati (q1q0)') });
  const out = readout('');
  w.body.appendChild(out.root);

  function runShots(k) { let last = 0; for (let i = 0; i < k; i++) { last = sample(st); hg.add(last); } sfx.measure(last & 1); }

  function upd() {
    amps.set(st);
    sph0.set(fakeSingle(0)); sph1.set(fakeSingle(1));
    const a = { re: st.re[0], im: st.im[0] }, b = { re: st.re[1], im: st.im[1] };
    const c = { re: st.re[2], im: st.im[2] }, d = { re: st.re[3], im: st.im[3] };
    // separabile ⟺ a·d − b·c = 0
    const detR = a.re * d.re - a.im * d.im - (b.re * c.re - b.im * c.im);
    const detI = a.re * d.im + a.im * d.re - (b.re * c.im + b.im * c.re);
    const det = Math.hypot(detR, detI);
    const ent = det > 1e-6;
    if (ent && !hist.celebrated) { hist.celebrated = true; fx.win(); sfx.boost(); }
    if (ent) cfg.onEntangle && cfg.onEntangle();
    const bv0 = blochVector(st, 0), bv1 = blochVector(st, 1);
    out.set(
      `|ψ⟩ = ${cstr(a)}·|00⟩ + ${cstr(b)}·|01⟩ + ${cstr(c)}·|10⟩ + ${cstr(d)}·|11⟩\n` +
      t('porte: :elenco', { elenco: hist.seq.join(' → ') || '—' }) + '\n' +
      t('test di separabilità |a·d − b·c| = <b>:valore</b> → ', { valore: det.toFixed(3) }) +
      (ent ? '<span class="p">' + t('STATI INTRECCIATI (entangled)') + '</span>' : '<span class="g">' + t('stato separabile: i due qubit sono indipendenti') + '</span>') + '\n' +
      t('lunghezza della freccia di Bloch: q0 = :q0, q1 = :q1', { q0: bv0.purity.toFixed(2), q1: bv1.purity.toFixed(2) }) +
      (ent ? '  ← ' + t('accorciate: presi da soli i qubit non hanno più uno stato definito!') : ''));
  }
  function fakeSingle(q) {
    // stato "visualizzabile" del singolo qubit (ricostruito dal vettore di Bloch)
    const v = blochVector(st, q);
    const s = zeroState(1);
    const th = Math.acos(Math.max(-1, Math.min(1, v.z))) / 2;
    const ph = Math.atan2(v.y, v.x);
    const r = Math.hypot(v.x, v.y, v.z);
    s.re[0] = Math.cos(th) * (0.15 + 0.85 * r) + (1 - r) * 0.0;
    s.re[1] = Math.sin(th) * Math.cos(ph) * (0.15 + 0.85 * r);
    s.im[1] = Math.sin(th) * Math.sin(ph) * (0.15 + 0.85 * r);
    return s;
  }
  upd();
  w.setFoot(t('<b>Prova la ricetta di Bell:</b> premi <b>H q0</b> e poi <b>CNOT q0→q1</b>. Ottieni |00⟩ + |11⟩: quando misuri, i due qubit escono <b>sempre uguali</b>, anche se prima nessuno dei due aveva un valore. Nota che le due sfere di Bloch si accorciano fino a sparire: l\'informazione non è più nei singoli qubit, è <b>nella coppia</b>.'));
  return { get state() { return st; }, update: upd };
}

/* ------------------------------------------------------------
   3) TELETRASPORTO QUANTISTICO
   ------------------------------------------------------------ */
export function teleportLab(host, opts = {}) {
  const cfg = Object.assign({ onDone: null }, opts);
  const w = widget(host, { title: t('Teletrasporto quantistico'), subtitle: t('sposta uno stato senza spostare la particella') });
  const st = { theta: 70, phi: 40, step: 0, bits: [null, null], state: null };

  const steps = [
    t('Partenza: Alice ha il qubit misterioso q0 da mandare. q1 e q2 sono a zero.'),
    t('Si crea la coppia intrecciata fra q1 (Alice) e q2 (Bob): H su q1, poi CNOT q1→q2.'),
    t('Alice "mescola" il suo qubit con la sua metà della coppia: CNOT q0→q1.'),
    t('Alice applica H su q0.'),
    t('Alice MISURA q0 e q1: ottiene due bit classici. Il suo stato originale è ormai distrutto.'),
    t('Alice telefona a Bob e gli detta i due bit. Bob applica le correzioni (X e/o Z) su q2.'),
    t('Fatto: il qubit di Bob è ORA esattamente lo stato di partenza.'),
  ];

  const build = () => {
    const s = zeroState(3);
    // stato da teletrasportare su q0
    const th = st.theta * Math.PI / 180, p = st.phi * Math.PI / 180;
    s.re[0] = Math.cos(th / 2);
    s.re[1] = Math.sin(th / 2) * Math.cos(p);
    s.im[1] = Math.sin(th / 2) * Math.sin(p);
    return s;
  };

  const grid = h('div', { class: 'grid-2' });
  const left = h('div'), right = h('div');
  grid.append(left, right); w.body.appendChild(grid);
  left.appendChild(h('div', { class: 'small dim', html: '<b>' + t('Qubit di partenza (Alice, q0)') + '</b>' }));
  const sphA = blochSphere(left, { height: 210, showAngles: false });
  right.appendChild(h('div', { class: 'small dim', html: '<b>' + t('Qubit di Bob (q2)') + '</b>' }));
  const sphB = blochSphere(right, { height: 210, showAngles: false });
  const fx = attachFX(sphB.stage);   // scintille, lampi e suono ai traguardi

  const sT = slider({ label: t('θ dello stato da mandare'), min: 0, max: 180, step: 5, value: st.theta, fmt: v => v + '°', oninput: v => { st.theta = v; reset(); } });
  const sP = slider({ label: t('φ dello stato da mandare'), min: 0, max: 360, step: 10, value: st.phi, fmt: v => v + '°', oninput: v => { st.phi = v; reset(); } });
  w.body.appendChild(controls(sT.root, sP.root));
  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '10px' } },
    h('button', { class: 'btn sm primary', onclick: () => next() }, '▶ ' + t('passo successivo')),
    h('button', { class: 'btn sm', onclick: reset }, '↺ ' + t('ricomincia')),
  ));
  const out = readout('');
  w.body.appendChild(out.root);

  function reset() {
    st.step = 0; st.bits = [null, null]; st.state = build();
    sphA.set(singleFrom(st.state, 0)); sphB.set(singleFrom(st.state, 2));
    upd();
  }
  function next() {
    const s = st.state;
    switch (st.step) {
      case 0: applyGate(s, 1, GATES.H.m); applyGate(s, 2, GATES.X.m, [1]); break;
      case 1: applyGate(s, 1, GATES.X.m, [0]); break;
      case 2: applyGate(s, 0, GATES.H.m); break;
      case 3: st.bits = [measureQubit(s, 0), measureQubit(s, 1)]; sfx.measure(st.bits[0]); break;
      case 4:
        if (st.bits[1]) applyGate(s, 2, GATES.X.m);
        if (st.bits[0]) applyGate(s, 2, GATES.Z.m);
        break;
      case 5: break;
      default: return;
    }
    st.step = Math.min(steps.length - 1, st.step + 1);
    upd();
  }
  function singleFrom(s, q) {
    const v = blochVector(s, q);
    const one = zeroState(1);
    const th = Math.acos(Math.max(-1, Math.min(1, v.z))) / 2, ph = Math.atan2(v.y, v.x);
    const r = Math.hypot(v.x, v.y, v.z);
    one.re[0] = Math.cos(th) * r; one.re[1] = Math.sin(th) * Math.cos(ph) * r; one.im[1] = Math.sin(th) * Math.sin(ph) * r;
    return one;
  }
  function upd() {
    sphB.set(singleFrom(st.state, 2));
    if (st.step >= 4) sphA.set(singleFrom(st.state, 0));
    const target = build();
    const vT = blochVector(target, 0), vB = blochVector(st.state, 2);
    const dist = Math.hypot(vT.x - vB.x, vT.y - vB.y, vT.z - vB.z);
    const done = st.step >= 5 && dist < 1e-6;
    out.set(
      '<b>' + t('Passo :i/:totali', { i: st.step + 1, totali: steps.length }) + `</b> — ${steps[st.step]}\n` +
      (st.bits[0] !== null ? t('bit classici inviati ad Alice→Bob: <b>:bit</b> (→ correzione: :correzione)', {
        bit: `${st.bits[0]}${st.bits[1]}`,
        correzione: `${st.bits[1] ? 'X ' : ''}${st.bits[0] ? 'Z' : ''}${!st.bits[0] && !st.bits[1] ? t('nessuna') : ''}`,
      }) + '\n' : '') +
      t('differenza fra lo stato di partenza e quello di Bob: <b>:distanza</b>', { distanza: dist.toFixed(4) }) +
      (done ? '  <span class="g">✓ ' + t('TELETRASPORTO RIUSCITO') + '</span>' : ''));
    if (done && !st.celebrated) { st.celebrated = true; fx.win(); sfx.boss(); }
    if (done) cfg.onDone && cfg.onDone();
  }
  reset();
  w.setFoot(t('<b>Attenzione a cosa NON è:</b> nessuna materia si sposta e nessuna informazione viaggia più veloce della luce — servono i due <b>bit classici</b> telefonati a Bob, che viaggiano normalmente. E lo stato di partenza viene <b>distrutto</b> dalla misura: è un trasferimento, non una fotocopia. Il teorema di <b>no-cloning</b> resta salvo.'));
  return { state: st };
}
