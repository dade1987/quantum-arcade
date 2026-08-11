/* ============================================================
   IL CUORE: QFT, periodicità → picchi, stima di fase, Shor.
   ============================================================ */

import { Stage, COL, bg, text, roundRect, dot, arrow, circle, makePlane, phaseColor, attachFX } from '../core/canvas.js';
import { widget, buttons, slider, controls, readout, h, choice } from '../core/ui.js';
import {
  zeroState, basisState, applyOp, clone, probs, label, qftOps, qftGateCount,
  modpow, periodOf, gcd, continuedFraction, sample,
} from '../core/qsim.js';
import { ampsView } from './amps.js';
import { sfx } from '../core/audio.js';
import { fromArray, dft } from '../core/dsp.js';
import { str as cstr } from '../core/complex.js';

/* ------------------------------------------------------------
   1) QFT passo per passo
   ------------------------------------------------------------ */
export function qftLab(host, opts = {}) {
  const cfg = Object.assign({ n: 3, x: 1, onWin: null }, opts);
  const w = widget(host, { title: 'La QFT, porta per porta', subtitle: 'guarda le fasi disporsi a ventaglio' });
  const st = { n: cfg.n, x: cfg.x, step: -1 };
  let ops = qftOps(st.n);

  const ampHost = h('div'); w.body.appendChild(ampHost);
  const amps = ampsView(ampHost, { height: 190, showProb: false });
  const fx = attachFX(amps.stage);   // scintille, lampi e suono ai traguardi
  const out = readout('');

  const sx = slider({
    label: 'Stato di partenza |x⟩', min: 0, max: (1 << st.n) - 1, step: 1, value: st.x,
    fmt: v => `|${v.toString(2).padStart(st.n, '0')}⟩  (x = ${v})`,
    oninput: v => { st.x = v; upd(); },
  });
  const ss = slider({
    label: 'Porte applicate', min: -1, max: 0, step: 1, value: -1,
    fmt: v => v < 0 ? 'nessuna (stato di partenza)' : `dopo la porta ${v + 1} di ${ops.length}`,
    oninput: v => { st.step = v; upd(); },
  });
  w.body.appendChild(controls(sx.root, ss.root));

  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '10px' } },
    h('button', { class: 'btn sm', onclick: () => setN(2) }, '2 qubit'),
    h('button', { class: 'btn sm', onclick: () => setN(3) }, '3 qubit'),
    h('button', { class: 'btn sm', onclick: () => setN(4) }, '4 qubit'),
    h('button', { class: 'btn sm primary', onclick: () => { st.step = ops.length - 1; ss.value = st.step; upd(); } }, '⏩ circuito completo'),
    h('button', { class: 'btn sm ghost', onclick: () => { st.step = -1; ss.value = -1; upd(); } }, '↺ da capo'),
  ));
  w.body.appendChild(out.root);

  function setN(n) {
    st.n = n; ops = qftOps(n);
    st.x = Math.min(st.x, (1 << n) - 1);
    sx.input.max = String((1 << n) - 1); sx.value = st.x;
    ss.input.max = String(ops.length - 1);
    st.step = -1; ss.value = -1;
    upd();
  }

  function state() {
    const s = basisState(st.n, st.x);
    const lim = st.step < 0 ? 0 : st.step + 1;
    for (let i = 0; i < lim; i++) applyOp(s, ops[i]);
    return s;
  }

  function upd() {
    ss.input.max = String(ops.length - 1);
    const s = state();
    amps.set(s);
    const N = 1 << st.n;
    // confronto con la DFT classica del vettore di partenza
    const vec = new Array(N).fill(0); vec[st.x] = 1;
    const X = dft(fromArray(vec), { sign: +1, norm: 'sqrt' });
    let cmp = '';
    if (st.step === ops.length - 1) {
      let maxd = 0;
      for (let i = 0; i < N; i++) maxd = Math.max(maxd, Math.abs(s.re[i] - X.re[i]), Math.abs(s.im[i] - X.im[i]));
      cmp = `\n<b>Verifica:</b> il circuito ha prodotto esattamente la trasformata di Fourier del vettore di partenza ` +
        `(differenza massima ${maxd.toExponential(1)}). <span class="g">Stessa matematica del livello 6, fatta con ${ops.length} porte.</span>`;
    }
    const nextOp = st.step + 1 < ops.length ? ops[st.step + 1] : null;
    const terms = [];
    for (let i = 0; i < N && N <= 8; i++) {
      if (Math.hypot(s.re[i], s.im[i]) > 1e-9) terms.push(`${cstr({ re: s.re[i], im: s.im[i] })}·|${label(i, st.n)}⟩`);
    }
    out.set(
      `<b>Porte totali del circuito:</b> ${ops.length} (${qftGateCount(st.n)} per n=${st.n}) — la DFT classica su ${N} numeri ne farebbe ${N * N}.\n` +
      (st.step >= 0 ? `<b>Appena applicata:</b> ${ops[st.step].note || ops[st.step].g}\n` : '<b>Stato di partenza:</b> una sola barra alta, tutto il resto a zero.\n') +
      (nextOp ? `<b>Prossima porta:</b> ${nextOp.note || nextOp.g}\n` : '<b>Circuito finito.</b>\n') +
      (terms.length ? `|ψ⟩ = ${terms.join(' + ')}\n` : '') + cmp);
    if (st.step === ops.length - 1) { if (!st.celebrated) { st.celebrated = true; fx.win(); sfx.ok(); } cfg.onWin && cfg.onWin(); }
  }
  setN(cfg.n);
  w.setFoot('Osserva: si parte da <b>una</b> barra sola e si finisce con <b>tutte le barre uguali</b> ma con <b>fasi diverse</b> (colori diversi). L\'informazione non è sparita: è passata dalla <b>posizione</b> alla <b>fase</b>. Questa frase è tutta la QFT.');
  return { state: st, update: upd };
}

/* ------------------------------------------------------------
   2) PERIODICITÀ → PICCHI (il motivo per cui Shor funziona)
   ------------------------------------------------------------ */
export function qftPeriodLab(host, opts = {}) {
  const cfg = Object.assign({ n: 4, onWin: null }, opts);
  const w = widget(host, { title: 'Periodicità dentro, picchi fuori', subtitle: 'il trucco che usa Shor' });
  const n = cfg.n, N = 1 << n;
  const st = { r: 4, off: 0 };

  const build = () => {
    const s = zeroState(n);
    let cnt = 0;
    for (let x = st.off; x < N; x += st.r) cnt++;
    for (let x = st.off; x < N; x += st.r) s.re[x] = 1 / Math.sqrt(cnt);
    return s;
  };
  const transformed = () => {
    const s = build();
    const out2 = clone(s);
    for (const op of qftOps(n)) applyOp(out2, op);
    return out2;
  };

  const inHost = h('div'), outHost = h('div');
  w.body.append(h('div', { class: 'small dim', html: '<b>PRIMA</b> — lo stato "a pettine": ampiezze diverse da zero ogni r posizioni' }), inHost,
    h('div', { class: 'small dim', style: { marginTop: '8px' }, html: '<b>DOPO la QFT</b> — restano solo i multipli di N/r' }), outHost);
  const a1 = ampsView(inHost, { height: 140, showProb: false });
  const a2 = ampsView(outHost, { height: 150, showProb: true });
  const fx = attachFX(a2.stage);   // scintille, lampi e suono ai traguardi

  const sr = slider({ label: 'Periodo <b>r</b>', min: 2, max: 8, step: 1, value: st.r, fmt: v => 'r = ' + v, oninput: v => { st.r = v; upd(); } });
  const so = slider({ label: 'Sfasamento iniziale', min: 0, max: 7, step: 1, value: st.off, fmt: v => 'parte da ' + v, oninput: v => { st.off = v; upd(); } });
  w.body.appendChild(controls(sr.root, so.root));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const s = build(), t = transformed();
    a1.set(s); a2.set(t);
    const p = probs(t);
    const peaks = [];
    for (let i = 0; i < N; i++) if (p[i] > 0.05) peaks.push({ i, p: p[i] });
    out.set(
      `Stato di partenza: ampiezze diverse da zero in ${Array.from({ length: N }, (_, i) => i).filter(i => i >= st.off && (i - st.off) % st.r === 0).join(', ')}\n` +
      `<b>Dopo la QFT i picchi sono in:</b> ${peaks.map(x => x.i).join(', ')}\n` +
      `N/r = ${N}/${st.r} = <b>${(N / st.r).toFixed(2)}</b> → i picchi cadono sui <b>multipli di N/r</b>.\n` +
      `<span class="g">Fondamentale:</span> se sposti lo "sfasamento iniziale", i picchi <b>NON si muovono</b>. ` +
      `Le probabilità dipendono solo dal <b>periodo</b>, non da dove comincia. Ecco perché Shor può misurare il secondo registro ` +
      `senza rovinare tutto: qualunque cosa esca, la periodicità resta leggibile.`);
    if (peaks.length >= 2) { if (!st.celebrated) { st.celebrated = true; fx.win(); sfx.boost(); } cfg.onWin && cfg.onWin(); }
  }
  upd();
  w.setFoot('<b>Da provare:</b> metti r = 4 e muovi lo sfasamento da 0 a 3. Le barre in alto si spostano tutte… e quelle in basso restano identiche. Questa è l\'invarianza che rende utilizzabile il risultato di una misura casuale.');
  return { state: st };
}

/* ------------------------------------------------------------
   3) QUANTUM PHASE ESTIMATION
   ------------------------------------------------------------ */
export function qpeLab(host, opts = {}) {
  const cfg = Object.assign({ t: 4, onWin: null }, opts);
  const w = widget(host, { title: 'Stima di fase (QPE)', subtitle: 'leggere una fase nascosta come numero binario' });
  const st = { phi: 0.375, t: cfg.t };

  const dist = () => {
    const M = 1 << st.t;
    const p = new Float64Array(M);
    for (let y = 0; y < M; y++) {
      let re = 0, im = 0;
      for (let k = 0; k < M; k++) {
        const th = 2 * Math.PI * k * (st.phi - y / M);
        re += Math.cos(th); im += Math.sin(th);
      }
      p[y] = (re * re + im * im) / (M * M);
    }
    return p;
  };

  const stage = new Stage(w.body, {
    height: 245,
    draw(ctx, s) {
      bg(ctx, s);
      const M = 1 << st.t, p = dist();
      const rect = { x: 20, y: 26, w: s.w - 34, h: s.h - 62 };
      const cw = rect.w / M;
      text(ctx, `probabilità di leggere ciascun numero y (con ${st.t} qubit di lettura)`, rect.x, 12, { size: 11, color: COL.txt });
      const best = p.indexOf(Math.max(...p));
      for (let y = 0; y < M; y++) {
        const hgt = p[y] * rect.h;
        roundRect(ctx, rect.x + cw * y + 1.5, rect.y + rect.h - hgt, cw - 3, Math.max(1, hgt), 3,
          { fill: y === best ? COL.green : COL.violet, alpha: y === best ? 1 : .6 });
        if (cw > 22) text(ctx, y.toString(2).padStart(st.t, '0'), rect.x + cw * (y + .5), rect.y + rect.h + 12, { size: 9, align: 'center', color: '#6f7fa3' });
      }
      const xTrue = rect.x + st.phi * rect.w;
      ctx.strokeStyle = COL.amber; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(xTrue, rect.y); ctx.lineTo(xTrue, rect.y + rect.h); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, `fase vera φ = ${st.phi.toFixed(4)}`, xTrue + 5, rect.y + 10, { size: 11, color: COL.amber });
      text(ctx, `miglior lettura: ${best}/${M} = ${(best / M).toFixed(4)} (${(p[best] * 100).toFixed(1)}%)`, rect.x, s.h - 8, { size: 11.5, color: COL.green });
    },
  });
  const fx = attachFX(stage);   // scintille, lampi e suono ai traguardi
  stage.pause();

  const sp = slider({ label: 'Fase nascosta <b>φ</b> (da 0 a 1)', min: 0, max: 0.999, step: 0.001, value: st.phi, fmt: v => v.toFixed(3), oninput: v => { st.phi = v; upd(); } });
  const stt = slider({ label: 'Qubit di lettura <b>t</b>', min: 2, max: 7, step: 1, value: st.t, fmt: v => `${v} qubit → ${1 << v} valori`, oninput: v => { st.t = v; upd(); } });
  w.body.appendChild(controls(sp.root, stt.root));
  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '10px' } },
    h('button', { class: 'btn sm', onclick: () => { st.phi = 0.5; sp.value = .5; upd(); } }, 'φ = 1/2 (esatta)'),
    h('button', { class: 'btn sm', onclick: () => { st.phi = 0.25; sp.value = .25; upd(); } }, 'φ = 1/4 (esatta)'),
    h('button', { class: 'btn sm', onclick: () => { st.phi = 1 / 3; sp.value = 1 / 3; upd(); } }, 'φ = 1/3 (NON esatta)'),
  ));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const M = 1 << st.t, p = dist();
    const best = p.indexOf(Math.max(...p));
    const exact = Math.abs(st.phi * M - Math.round(st.phi * M)) < 1e-9;
    out.set(
      `Stiamo cercando di leggere una fase <b>φ = ${st.phi.toFixed(4)}</b> scrivendola in binario con ${st.t} cifre.\n` +
      `Miglior risultato: <b>${best.toString(2).padStart(st.t, '0')}</b> = ${best}/${M} = <b>${(best / M).toFixed(4)}</b>` +
      `  (probabilità ${(p[best] * 100).toFixed(1)}%)\n` +
      (exact
        ? '<span class="g">φ è esattamente rappresentabile con questi qubit: il risultato esce con probabilità 100%.</span>'
        : `<span class="a">φ non è rappresentabile esattamente: la probabilità si sparpaglia sui valori vicini (ma resta concentrata: almeno ${(4 / (Math.PI * Math.PI) * 100).toFixed(0)}% sul valore più vicino).</span>`) +
      `\nAggiungere un qubit di lettura <b>raddoppia la precisione</b>: da ${(1 / M).toFixed(4)} a ${(1 / (2 * M)).toFixed(4)}.`);
    stage.redraw();
    if (st.t >= 5) { if (!st.celebrated) { st.celebrated = true; fx.win(); sfx.ok(); } cfg.onWin && cfg.onWin(); }
  }
  upd();
  w.setFoot('La QPE è la QFT <b>al contrario</b>: invece di trasformare posizioni in fasi, prende un\'informazione già scritta nelle fasi (con rotazioni controllate) e la riporta in una posizione <b>leggibile con una misura</b>. È il motore di Shor e di mezza chimica quantistica.');
  return { state: st };
}

/* ------------------------------------------------------------
   4) SHOR — dal periodo ai fattori
   ------------------------------------------------------------ */
export function shorLab(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, { title: 'Officina di Shor', subtitle: 'fattorizza un numero con le tue mani' });
  const st = { N: 15, a: 7, t: 6, measured: null, r: null, factors: null };

  const validA = () => { const l = []; for (let a = 2; a < st.N; a++) if (gcd(a, st.N) === 1) l.push(a); return l; };

  /* tabella di a^x mod N */
  const table = new Stage(w.body, {
    height: 155,
    draw(ctx, s) {
      bg(ctx, s);
      const cols = Math.min(16, 24);
      const cw = (s.w - 24) / cols;
      text(ctx, `f(x) = ${st.a}^x mod ${st.N}  — guarda quando ricomincia da 1`, 12, 14, { size: 11.5, color: COL.txt });
      const r = periodOf(st.a, st.N);
      for (let x = 0; x < cols; x++) {
        const v = modpow(st.a, x, st.N);
        const cx = 12 + cw * x;
        const isStart = r && x % r === 0;
        roundRect(ctx, cx + 2, 30, cw - 4, 40, 5, {
          fill: isStart ? 'rgba(52,211,153,.22)' : '#111b30',
          stroke: isStart ? COL.green : '#22304d',
        });
        text(ctx, String(v), cx + cw / 2, 50, { size: 13, align: 'center', color: isStart ? COL.green : COL.txt });
        // colonne strette: si alternano le etichette invece di sovrapporle
        if (cw > 30) text(ctx, 'x=' + x, cx + cw / 2, 82, { size: 9.5, align: 'center', color: '#6f7fa3', max: cw });
        else if (cw > 15 && x % 2 === 0) text(ctx, String(x), cx + cw / 2, 82, { size: 9.5, align: 'center', color: '#6f7fa3', max: cw });
      }
      if (r) {
        text(ctx, `il valore 1 ritorna ogni ${r} passi → PERIODO r = ${r}`, 12, 108, { size: 12, color: COL.green });
      }
    },
  });
  table.pause();

  /* distribuzione dopo la QFT */
  const chart = new Stage(w.body, {
    height: 215,
    draw(ctx, s) {
      bg(ctx, s);
      const M = 1 << st.t;
      const r = periodOf(st.a, st.N) || 1;
      const p = shorDist(M, r);
      const rect = { x: 18, y: 26, w: s.w - 32, h: s.h - 58 };
      text(ctx, `dopo la QFT sul registro di lettura (${st.t} qubit → ${M} valori)`, rect.x, 12, { size: 11, color: COL.txt });
      const maxP = Math.max(...p);
      const cw = rect.w / M;
      for (let y = 0; y < M; y++) {
        const hgt = (p[y] / maxP) * rect.h;
        const isPeak = p[y] > maxP * 0.5;
        roundRect(ctx, rect.x + cw * y, rect.y + rect.h - hgt, Math.max(1, cw - 1), Math.max(1, hgt), 2,
          { fill: st.measured === y ? COL.amber : (isPeak ? COL.green : COL.violet), alpha: isPeak ? 1 : .55 });
      }
      // multipli di M/r
      for (let k = 0; k < r; k++) {
        const x = rect.x + (k * M / r) * cw;
        text(ctx, `${k}·${(M / r).toFixed(0)}`, x, rect.y + rect.h + 12, { size: 9.5, align: 'center', color: '#6f7fa3' });
      }
      if (st.measured !== null) {
        const x = rect.x + (st.measured + .5) * cw;
        text(ctx, `hai misurato y = ${st.measured}`, x, rect.y + 12, { size: 11, align: 'center', color: COL.amber });
      }
      text(ctx, `i picchi cadono sui multipli di M/r = ${M}/${r} = ${(M / r).toFixed(2)}`, rect.x, s.h - 8, { size: 11, color: COL.green });
    },
  });
  const fx = attachFX(chart);   // scintille, lampi e suono ai traguardi
  chart.pause();

  function shorDist(M, r) {
    // stato "a pettine" con periodo r e sfasamento casuale, poi |QFT|²
    const p = new Float64Array(M);
    const cnt = Math.floor((M - 1) / r) + 1;
    for (let y = 0; y < M; y++) {
      let re = 0, im = 0;
      for (let j = 0; j < cnt; j++) {
        const th = 2 * Math.PI * (j * r) * y / M;
        re += Math.cos(th); im += Math.sin(th);
      }
      p[y] = (re * re + im * im) / (cnt * cnt * M) * cnt;
    }
    const s = p.reduce((a, b) => a + b, 0) || 1;
    for (let y = 0; y < M; y++) p[y] /= s;
    return p;
  }

  const out = readout('');
  const sN = choice({
    label: 'Numero da fattorizzare <b>N</b>', value: 15,
    items: [{ label: '15', value: 15 }, { label: '21', value: 21 }, { label: '33', value: 33 }, { label: '35', value: 35 }],
    onchange: v => { st.N = v; st.a = validA()[0]; st.measured = null; st.r = null; st.factors = null; upd(); },
  });
  w.body.appendChild(sN.root);
  const aRow = h('div', { class: 'btn-row', style: { marginTop: '8px' } });
  w.body.appendChild(aRow);
  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '10px' } },
    h('button', { class: 'btn sm primary', onclick: () => measure() }, '📏 misura il registro (come farebbe il computer quantistico)'),
    h('button', { class: 'btn sm', onclick: () => { st.measured = null; st.r = null; st.factors = null; upd(); } }, '↺ ricomincia'),
  ));
  w.body.appendChild(out.root);

  function measure() {
    const M = 1 << st.t, r = periodOf(st.a, st.N) || 1;
    const p = shorDist(M, r);
    let acc = 0, rnd = Math.random(), y = M - 1;
    for (let i = 0; i < M; i++) { acc += p[i]; if (rnd <= acc) { y = i; break; } }
    st.measured = y;
    sfx.measure(y & 1);
    // frazioni continue: y/M ≈ k/r
    const cf = continuedFraction(y / M, st.N);
    let cand = null;
    for (const c of cf.conv) if (c.q > 1 && c.q < st.N && modpow(st.a, c.q, st.N) === 1) { cand = c.q; break; }
    st.r = cand;
    if (cand && cand % 2 === 0) {
      const h1 = modpow(st.a, cand / 2, st.N);
      const f1 = gcd(h1 - 1, st.N), f2 = gcd(h1 + 1, st.N);
      st.factors = [f1, f2].filter(f => f > 1 && f < st.N);
      if (st.factors.length) { fx.win(); sfx.boss(); cfg.onWin && cfg.onWin(); }
    } else st.factors = null;
    upd();
  }

  function upd() {
    aRow.innerHTML = '';
    validA().slice(0, 12).forEach(a => aRow.appendChild(h('button', {
      class: 'btn sm' + (a === st.a ? ' primary' : ''),
      onclick: () => { st.a = a; st.measured = null; st.r = null; st.factors = null; upd(); },
    }, 'a = ' + a)));

    const M = 1 << st.t, rTrue = periodOf(st.a, st.N);
    let msg =
      `<b>Passo 1 (classico).</b> Scegli a = ${st.a}. Controlla che MCD(${st.a}, ${st.N}) = ${gcd(st.a, st.N)} = 1 ✓ ` +
      `(se fosse diverso da 1 avresti già trovato un fattore per fortuna!)\n` +
      `<b>Passo 2 (quantistico).</b> Si calcola ${st.a}^x mod ${st.N} in sovrapposizione su tutti gli x, si misura il secondo registro ` +
      `e si applica la QFT al primo: le probabilità si concentrano sui multipli di M/r.\n`;
    if (st.measured !== null) {
      msg += `<b>Passo 3 (misura).</b> È uscito <b>y = ${st.measured}</b> → y/M = ${st.measured}/${M} = <b>${(st.measured / M).toFixed(4)}</b>\n` +
        `<b>Passo 4 (classico).</b> Le frazioni continue cercano la frazione semplice più vicina a ${(st.measured / M).toFixed(4)}: `;
      if (st.r) {
        msg += `denominatore <b>r = ${st.r}</b> ${st.r === rTrue ? '<span class="g">(giusto!)</span>' : ''}\n`;
        if (st.r % 2) msg += `<span class="a">r è dispari: questo tentativo non serve. Rimisura (capita, è normale).</span>`;
        else if (st.factors && st.factors.length) {
          const h1 = modpow(st.a, st.r / 2, st.N);
          msg += `<b>Passo 5.</b> ${st.a}^(${st.r}/2) mod ${st.N} = ${h1}\n` +
            `MCD(${h1}−1, ${st.N}) = ${gcd(h1 - 1, st.N)} · MCD(${h1}+1, ${st.N}) = ${gcd(h1 + 1, st.N)}\n` +
            `<span class="g">🎉 ${st.N} = ${st.factors.join(' × ')}${st.factors.reduce((a, b) => a * b, 1) === st.N ? '' : ' (fattore trovato)'}</span>`;
        } else msg += `<span class="a">questo r non porta a fattori utili: rimisura.</span>`;
      } else msg += `<span class="a">nessun denominatore utile (y = 0 capita spesso e non dice nulla). Rimisura.</span>`;
    } else {
      msg += `Il periodo vero è r = ${rTrue} (qui lo sappiamo perché stiamo simulando: il computer quantistico NON lo sa).\n` +
        `Premi «misura» e ricava r dal risultato.`;
    }
    out.set(msg);
    table.redraw(); chart.redraw();
  }
  upd();
  w.setFoot('<b>Perché serve la parte quantistica:</b> trovare il periodo di a^x mod N classicamente costa tempo esponenziale nel numero di cifre di N. La QFT lo trasforma in picchi misurabili con un numero di operazioni polinomiale. Tutto il resto di Shor (MCD, frazioni continue) è matematica classica dell\'Ottocento.');
  return { state: st };
}
