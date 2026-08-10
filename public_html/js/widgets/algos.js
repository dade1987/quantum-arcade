/* ============================================================
   WIDGET degli algoritmi: Deutsch–Jozsa, Bernstein–Vazirani, Grover.
   Tutti costruiti sullo stesso schema in tre mosse:
     1. Hadamard su tutti  → tutte le possibilità insieme
     2. oracolo            → l'informazione entra nelle FASI
     3. Hadamard/diffusore → l'interferenza porta la risposta a galla
   ============================================================ */

import { Stage, COL, bg, text, roundRect, dot, attachFX } from '../core/canvas.js';
import { widget, buttons, slider, controls, readout, h, choice } from '../core/ui.js';
import {
  zeroState, applyGate, GATES, probs, label, sample, phaseOracle,
  groverDiffusion, hadamardAll, clone,
} from '../core/qsim.js';
import { ampsView, histogram } from './amps.js';
import { sfx } from '../core/audio.js';

/* ------------------------------------------------------------
   DEUTSCH–JOZSA
   ------------------------------------------------------------ */
export function deutschLab(host, opts = {}) {
  const cfg = Object.assign({ n: 3, onWin: null }, opts);
  const w = widget(host, { title: 'Deutsch–Jozsa', subtitle: 'costante o bilanciata? Una sola domanda.' });
  const n = cfg.n, N = 1 << n;
  const st = { f: null, kind: '', classicalQueries: 0, revealed: false, quantumRun: false };

  function newOracle() {
    const kind = Math.random() < 0.4 ? 'costante' : 'bilanciata';
    let f;
    if (kind === 'costante') { const v = Math.random() < 0.5 ? 0 : 1; f = () => v; }
    else {
      // metà 0 e metà 1, in ordine casuale
      const vals = [...Array(N).keys()].sort(() => Math.random() - 0.5);
      const ones = new Set(vals.slice(0, N / 2));
      f = x => ones.has(x) ? 1 : 0;
    }
    st.f = f; st.kind = kind; st.classicalQueries = 0; st.revealed = false; st.quantumRun = false;
    st.seen = [];
    amps.set(zeroState(n));
    upd();
  }

  const ampHost = h('div'); w.body.appendChild(ampHost);
  const amps = ampsView(ampHost, { height: 165, showProb: true });
  const fx = attachFX(amps.stage);   // scintille, lampi e suono ai traguardi
  const out = readout('');

  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '10px' } },
    h('button', { class: 'btn sm', onclick: () => classicalAsk() }, '🐌 chiedi 1 valore (modo classico)'),
    h('button', { class: 'btn sm primary', onclick: () => quantumRun() }, '⚛️ chiedi UNA volta (modo quantistico)'),
    h('button', { class: 'btn sm ghost', onclick: newOracle }, '🎲 nuova funzione segreta'),
  ));
  w.body.appendChild(out.root);

  function classicalAsk() {
    if (st.classicalQueries >= N) return;
    const x = st.classicalQueries;
    st.seen.push({ x, y: st.f(x) });
    st.classicalQueries++;
    upd();
  }

  function quantumRun() {
    const s = zeroState(n);
    hadamardAll(s, [...Array(n).keys()]);          // 1. tutte le possibilità
    phaseOracle(s, i => st.f(i) === 1);            // 2. l'oracolo mette un meno dove f=1
    hadamardAll(s, [...Array(n).keys()]);          // 3. interferenza
    amps.set(s);
    sfx.measure();
    const p = probs(s);
    st.quantumRun = true;
    st.result = p[0] > 0.99 ? 'costante' : 'bilanciata';
    st.revealed = true;
    if (st.result === st.kind) { fx.win(); sfx.ok(); cfg.onWin && cfg.onWin(); }
    upd();
  }

  function upd() {
    const classicoSicuro = N / 2 + 1;
    let msg = `Funzione segreta su <b>${N}</b> ingressi (${n} qubit).\n`;
    if (st.seen && st.seen.length) {
      msg += `Risposte classiche ottenute: ${st.seen.map(s => `f(${s.x})=${s.y}`).join(', ')}\n`;
      const vals = new Set(st.seen.map(s => s.y));
      msg += vals.size > 1
        ? `<span class="g">Con ${st.seen.length} domande hai già la risposta: BILANCIATA (hai visto sia 0 sia 1).</span>\n`
        : `Finora tutte uguali: potrebbe essere costante, ma per esserne <b>sicuro</b> nel caso peggiore ti servono ${classicoSicuro} domande.\n`;
    }
    if (st.quantumRun) {
      msg += `\n<b>Modo quantistico — una sola interrogazione:</b>\n` +
        `probabilità di misurare |${'0'.repeat(n)}⟩ = <b>${(probs(amps.state)[0] * 100).toFixed(1)}%</b>\n` +
        `→ risposta: <span class="${st.result === 'costante' ? 'g' : 'a'}">${st.result.toUpperCase()}</span>` +
        ` (la funzione era davvero <b>${st.kind}</b>) ${st.result === st.kind ? '✓' : '✗'}\n` +
        `Regola di lettura: <b>tutto |0…0⟩ → costante</b>; <b>qualsiasi altra cosa → bilanciata</b>.`;
    } else {
      msg += `\nPremi il bottone quantistico: una sola interrogazione basta, sempre.`;
    }
    out.set(msg);
  }
  newOracle();
  w.setFoot(`<b>Il confronto:</b> classicamente, nel caso peggiore, servono <b>${N / 2 + 1}</b> domande per esserne certi. Quantisticamente ne basta <b>1</b>. Non perché il computer "provi tutti i casi in parallelo e li legga", ma perché l'oracolo scrive la risposta nelle <b>fasi</b> e le Hadamard finali fanno cancellare tutto tranne l'informazione che ci interessa.`);
  return { state: st };
}

/* ------------------------------------------------------------
   BERNSTEIN–VAZIRANI
   ------------------------------------------------------------ */
export function bvLab(host, opts = {}) {
  const cfg = Object.assign({ n: 4, onWin: null }, opts);
  const w = widget(host, { title: 'Bernstein–Vazirani', subtitle: 'trova la stringa segreta con UNA domanda' });
  const n = cfg.n, N = 1 << n;
  const st = { s: 0, asked: 0, found: null };

  const parity = (a, b) => { let x = a & b, p = 0; while (x) { p ^= x & 1; x >>= 1; } return p; };
  const newSecret = () => { st.s = 1 + Math.floor(Math.random() * (N - 1)); st.asked = 0; st.found = null; amps.set(zeroState(n)); upd(); };

  const ampHost = h('div'); w.body.appendChild(ampHost);
  const amps = ampsView(ampHost, { height: 165, showProb: true });
  const fx = attachFX(amps.stage);   // scintille, lampi e suono ai traguardi
  const out = readout('');
  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '10px' } },
    h('button', { class: 'btn sm', onclick: () => classicalAsk() }, '🐌 chiedi un bit alla volta'),
    h('button', { class: 'btn sm primary', onclick: () => quantumRun() }, '⚛️ chiedi UNA volta'),
    h('button', { class: 'btn sm ghost', onclick: newSecret }, '🎲 nuovo segreto'),
  ));
  w.body.appendChild(out.root);

  function classicalAsk() { if (st.asked < n) { st.asked++; upd(); } }
  function quantumRun() {
    const s = zeroState(n);
    hadamardAll(s, [...Array(n).keys()]);
    phaseOracle(s, i => parity(i, st.s) === 1);
    hadamardAll(s, [...Array(n).keys()]);
    amps.set(s);
    st.found = sample(s, () => 0.0001);   // deterministico: la probabilità è 1 su s
    if (st.found === st.s) { fx.win(); sfx.ok(); cfg.onWin && cfg.onWin(); }
    upd();
  }
  function upd() {
    const bin = v => v.toString(2).padStart(n, '0');
    let msg = `La funzione segreta è <b>f(x) = s·x mod 2</b> (quante posizioni hanno 1 in comune, pari o dispari).\n` +
      `Il segreto <b>s</b> ha ${n} bit.\n`;
    if (st.asked) msg += `Classicamente devi chiedere un bit alla volta: f(001), f(010), f(100)… → servono <b>${n}</b> domande. Ne hai fatte <b>${st.asked}</b>.\n`;
    if (st.found !== null) {
      msg += `\n<b>Con una sola interrogazione quantistica</b> il risultato è: <span class="g">|${bin(st.found)}⟩</span>\n` +
        `Il segreto era <b>${bin(st.s)}</b> → ${st.found === st.s ? '<span class="g">ESATTO ✓</span>' : '✗'}\n` +
        `Nota le barre: <b>una sola</b> è alta al 100%. Tutte le altre possibilità si sono cancellate a vicenda.`;
    } else msg += `\nPremi il bottone quantistico e guarda cosa succede alle ampiezze.`;
    out.set(msg);
  }
  newSecret();
  w.setFoot('Perché funziona: dopo le prime Hadamard ogni possibilità x ha la stessa ampiezza. L\'oracolo mette un <b>meno</b> su quelle con parità dispari: è come "scrivere s nelle fasi". Le Hadamard finali trasformano quel disegno di segni in <b>un unico stato</b>, proprio s. È già un piccolo Fourier.');
  return { state: st };
}

/* ------------------------------------------------------------
   GROVER
   ------------------------------------------------------------ */
export function groverLab(host, opts = {}) {
  const cfg = Object.assign({ n: 4, onWin: null }, opts);
  const w = widget(host, { title: 'Grover: la ricerca amplificata', subtitle: 'guarda la barra giusta crescere' });
  const n = cfg.n, N = 1 << n;
  const st = { marked: 5, iter: 0, s: null, best: 0 };
  const optimal = Math.round(Math.PI / 4 * Math.sqrt(N));

  const reset = () => {
    st.s = zeroState(n);
    hadamardAll(st.s, [...Array(n).keys()]);
    st.iter = 0;
    amps.set(st.s, { highlight: st.marked });
    upd();
  };
  const step = () => {
    phaseOracle(st.s, i => i === st.marked);
    groverDiffusion(st.s, [...Array(n).keys()]);
    st.iter++;
    sfx.boost();
    amps.set(st.s, { highlight: st.marked });
    upd();
  };

  const ampHost = h('div'); w.body.appendChild(ampHost);
  const amps = ampsView(ampHost, { height: 185, showProb: true });
  const fx = attachFX(amps.stage);   // scintille, lampi e suono ai traguardi

  const curve = new Stage(w.body, {
    height: 175,
    draw(ctx, s) {
      bg(ctx, s);
      const rect = { x: 34, y: 18, w: s.w - 48, h: s.h - 46 };
      text(ctx, 'probabilità di trovare l\'elemento giusto, iterazione per iterazione', rect.x, 10, { size: 10.5, color: '#7f8fb3' });
      ctx.strokeStyle = COL.axis; ctx.beginPath();
      ctx.moveTo(rect.x, rect.y + rect.h); ctx.lineTo(rect.x + rect.w, rect.y + rect.h);
      ctx.moveTo(rect.x, rect.y); ctx.lineTo(rect.x, rect.y + rect.h); ctx.stroke();
      const maxIt = Math.max(12, optimal * 3);
      const theta = Math.asin(1 / Math.sqrt(N));
      ctx.strokeStyle = COL.violet; ctx.lineWidth = 2; ctx.beginPath();
      for (let i = 0; i <= maxIt; i++) {
        const p = Math.sin((2 * i + 1) * theta) ** 2;
        const X = rect.x + (i / maxIt) * rect.w, Y = rect.y + rect.h - p * rect.h;
        i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
      }
      ctx.stroke();
      // ottimo
      const xo = rect.x + (optimal / maxIt) * rect.w;
      ctx.strokeStyle = COL.green; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(xo, rect.y); ctx.lineTo(xo, rect.y + rect.h); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, `ottimo ≈ ${optimal}`, xo + 5, rect.y + 10, { size: 10.5, color: COL.green });
      // posizione attuale
      const p = probs(st.s)[st.marked];
      const xc = rect.x + (st.iter / maxIt) * rect.w, yc = rect.y + rect.h - p * rect.h;
      dot(ctx, xc, yc, 5, COL.amber);
      text(ctx, `${(p * 100).toFixed(1)}%`, xc + 8, yc - 8, { size: 11, color: COL.amber });
      text(ctx, '100%', 4, rect.y, { size: 9.5, color: '#5b6b90' });
      text(ctx, '0', 12, rect.y + rect.h, { size: 9.5, color: '#5b6b90' });
      text(ctx, 'iterazioni →', rect.x + rect.w, rect.y + rect.h + 14, { size: 10, align: 'right', color: '#5b6b90' });
    },
  });
  curve.pause();

  const out = readout('');
  const sm = slider({ label: 'Elemento da trovare', min: 0, max: N - 1, step: 1, value: st.marked, fmt: v => `|${v.toString(2).padStart(n, '0')}⟩`, oninput: v => { st.marked = v; reset(); } });
  w.body.appendChild(controls(sm.root));
  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '10px' } },
    h('button', { class: 'btn sm primary', onclick: step }, '▶ una iterazione di Grover'),
    h('button', { class: 'btn sm', onclick: () => { for (let i = 0; i < optimal; i++) step(); } }, `⏩ vai all'ottimo (${optimal})`),
    h('button', { class: 'btn sm', onclick: reset }, '↺ ricomincia'),
    h('button', { class: 'btn sm ghost', onclick: () => { for (let i = 0; i < 3; i++) step(); } }, '+3 iterazioni (guarda cosa succede)'),
  ));
  w.body.appendChild(out.root);

  function upd() {
    const p = probs(st.s)[st.marked];
    st.best = Math.max(st.best, p);
    out.set(
      `N = <b>${N}</b> possibilità, iterazioni fatte: <b>${st.iter}</b>\n` +
      `probabilità di pescare l'elemento giusto: <b>${(p * 100).toFixed(1)}%</b> (all'inizio era ${(100 / N).toFixed(1)}%)\n` +
      `numero ottimo di iterazioni ≈ (π/4)·√N = <b>${optimal}</b>\n` +
      (st.iter > optimal + 1 && p < 0.5
        ? '<span class="a">Hai superato l\'ottimo: continuando, la probabilità RICALA. Grover non è "più giri = meglio": è una rotazione che, se esageri, ti porta oltre il bersaglio.</span>'
        : (p > 0.9 ? '<span class="g">Ottimo punto per misurare!</span>' : '')));
    curve.redraw();
    if (p > 0.9 && !st.celebrated) { st.celebrated = true; fx.win(); sfx.boss(); }
    if (p > 0.9) cfg.onWin && cfg.onWin();
  }
  reset();
  w.setFoot(`<b>Il conto che conta:</b> classicamente, per trovare un elemento fra ${N} servono in media ${N / 2} tentativi. Grover ne usa circa <b>√${N} = ${Math.round(Math.sqrt(N))}</b>. Non è esponenziale come Shor: è un guadagno "quadratico", ma vale per <b>qualsiasi</b> ricerca senza struttura.`);
  return { state: st };
}
