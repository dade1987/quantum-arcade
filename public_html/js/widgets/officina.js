/* ============================================================
   OFFICINA DEGLI ALGORITMI — la sandbox creativa finale.
   Monti una pipeline di blocchi quantistici, la lanci su una sfida
   con una funzione segreta, misuri e provi a dare la risposta.
   Il punteggio premia chi usa MENO interrogazioni dell'oracolo.
   ============================================================ */

import { Stage, COL, bg, text, roundRect, dot, attachFX } from '../core/canvas.js';
import { widget, buttons, slider, controls, readout, h, choice } from '../core/ui.js';
import {
  zeroState, applyGate, applyOp, GATES, probs, label, sample, phaseOracle,
  groverDiffusion, hadamardAll, qftOps, clone,
} from '../core/qsim.js';
import { ampsView, histogram } from './amps.js';
import { sfx } from '../core/audio.js';

const BEST_KEY = 'quantum-arcade:officina-best';

const BLOCKS = {
  H:     { lab: 'H su tutti',        col: COL.cyan,   desc: 'Mette tutte le possibilità in gioco con la stessa ampiezza.' },
  ORACLE:{ lab: '❓ ORACOLO',         col: COL.amber,  desc: 'Interroga la funzione segreta: mette l\'informazione nelle fasi. Ogni uso costa 1 query!' },
  QFT:   { lab: 'QFT',                col: COL.violet, desc: 'Trasformata di Fourier quantistica: trasforma periodicità in picchi.' },
  IQFT:  { lab: 'QFT†',               col: COL.violet, desc: 'QFT inversa.' },
  DIFF:  { lab: '📢 Diffusore',       col: COL.green,  desc: 'Riflessione attorno alla media: amplifica ciò che l\'oracolo ha marcato.' },
  PH0:   { lab: '− su |0…0⟩',         col: COL.pink,   desc: 'Cambia segno solo allo stato tutto-zero.' },
  X:     { lab: 'X su tutti',         col: COL.pink,   desc: 'Ribalta tutti i qubit.' },
};

export function officina(host, opts = {}) {
  const cfg = Object.assign({ n: 3, onSolve: null }, opts);
  const w = widget(host, { title: '🛠️ Officina degli algoritmi', subtitle: 'monta, lancia, indovina, migliora' });
  const n = cfg.n, N = 1 << n;

  const st = {
    challenge: 'grover', pipe: ['H', 'ORACLE', 'DIFF'], secret: null, queries: 0,
    state: null, answered: null, shots: 0, best: loadBest(),
  };

  function loadBest() { try { return JSON.parse(localStorage.getItem(BEST_KEY) || '{}'); } catch { return {}; } }
  function saveBest(ch, q) {
    const b = loadBest();
    if (b[ch] === undefined || q < b[ch]) { b[ch] = q; localStorage.setItem(BEST_KEY, JSON.stringify(b)); }
    st.best = loadBest();
  }

  /* ---------- sfide ---------- */
  const CHALLENGES = {
    dj: {
      name: 'Costante o bilanciata?',
      brief: `C'è una funzione segreta f che dà 0 o 1 per ognuno degli ${N} ingressi. O è <b>costante</b> (sempre lo stesso valore) o è <b>bilanciata</b> (metà 0 e metà 1). Scopri quale.`,
      classical: `${N / 2 + 1} interrogazioni nel caso peggiore`,
      newSecret() {
        const kind = Math.random() < .5 ? 'cost' : 'bal';
        if (kind === 'cost') { const v = Math.random() < .5 ? 0 : 1; return { kind, f: () => v }; }
        const ones = new Set([...Array(N).keys()].sort(() => Math.random() - .5).slice(0, N / 2));
        return { kind, f: x => ones.has(x) ? 1 : 0 };
      },
      oracle(s, sec) { phaseOracle(s, i => sec.f(i) === 1); },
      answers: () => [{ label: 'è COSTANTE', value: 'cost' }, { label: 'è BILANCIATA', value: 'bal' }],
      check: (ans, sec) => ans === sec.kind,
      reveal: sec => `era <b>${sec.kind === 'cost' ? 'costante' : 'bilanciata'}</b>`,
    },
    bv: {
      name: 'La stringa segreta',
      brief: `C'è una stringa segreta <b>s</b> di ${n} bit. La funzione risponde f(x) = s·x mod 2 (parità dei bit in comune). Trova s.`,
      classical: `${n} interrogazioni`,
      newSecret() { return { s: 1 + Math.floor(Math.random() * (N - 1)) }; },
      oracle(s, sec) { phaseOracle(s, i => { let x = i & sec.s, p = 0; while (x) { p ^= x & 1; x >>= 1; } return p === 1; }); },
      answers: () => Array.from({ length: N }, (_, i) => ({ label: i.toString(2).padStart(n, '0'), value: i })),
      check: (ans, sec) => ans === sec.s,
      reveal: sec => `era <b>${sec.s.toString(2).padStart(n, '0')}</b>`,
    },
    grover: {
      name: 'Trova l\'ago nel pagliaio',
      brief: `Uno solo degli ${N} stati è quello "giusto". L'oracolo sa dirti soltanto <b>sì/no</b> (mettendo un segno meno). Trovalo.`,
      classical: `${N / 2} tentativi in media, ${N} nel caso peggiore`,
      newSecret() { return { m: Math.floor(Math.random() * N) }; },
      oracle(s, sec) { phaseOracle(s, i => i === sec.m); },
      answers: () => Array.from({ length: N }, (_, i) => ({ label: '|' + i.toString(2).padStart(n, '0') + '⟩', value: i })),
      check: (ans, sec) => ans === sec.m,
      reveal: sec => `era <b>|${sec.m.toString(2).padStart(n, '0')}⟩</b>`,
    },
    periodo: {
      name: 'Trova il periodo',
      brief: `L'oracolo "periodico" lascia in gioco solo gli stati x che stanno su una griglia con passo <b>r</b> (più uno sfasamento casuale). Trova r.`,
      classical: 'devi provare i valori uno per uno',
      newSecret() { const rs = [2, 4]; const r = rs[Math.floor(Math.random() * rs.length)]; return { r, off: Math.floor(Math.random() * r) }; },
      oracle(s, sec) {
        for (let i = 0; i < N; i++) if ((i - sec.off + N) % sec.r !== 0) { s.re[i] = 0; s.im[i] = 0; }
        let nrm = 0; for (let i = 0; i < N; i++) nrm += s.re[i] ** 2 + s.im[i] ** 2;
        nrm = Math.sqrt(nrm) || 1;
        for (let i = 0; i < N; i++) { s.re[i] /= nrm; s.im[i] /= nrm; }
      },
      answers: () => [2, 3, 4, 5, 6, 8].map(r => ({ label: 'r = ' + r, value: r })),
      check: (ans, sec) => ans === sec.r,
      reveal: sec => `era <b>r = ${sec.r}</b> (con partenza da ${sec.off})`,
    },
  };

  /* ---------- interfaccia ---------- */
  const briefBox = h('div', { class: 'callout key' });
  w.body.appendChild(briefBox);

  const chSel = choice({
    label: 'Sfida', value: 'grover',
    items: Object.entries(CHALLENGES).map(([k, c]) => ({ label: c.name, value: k })),
    onchange: k => { st.challenge = k; reset(true); },
  });
  w.body.appendChild(chSel.root);

  const pipeStage = new Stage(w.body, {
    height: 104,
    onPointer(e) {
      if (e.type !== 'down') return;
      const bw = 118, x0 = 12;
      const i = Math.floor((e.x - x0) / bw);
      if (i >= 0 && i < st.pipe.length && e.y > 20 && e.y < 70) { st.pipe.splice(i, 1); draw(); }
    },
    draw(ctx, s) {
      bg(ctx, s);
      text(ctx, 'la tua pipeline (clicca un blocco per toglierlo) — poi premi LANCIA', 12, 12, { size: 11, color: COL.txt });
      const bw = 118, x0 = 12;
      st.pipe.forEach((b, i) => {
        const B = BLOCKS[b];
        roundRect(ctx, x0 + i * bw, 22, bw - 10, 46, 8, { fill: 'rgba(255,255,255,.03)', stroke: B.col, width: 1.6 });
        text(ctx, B.lab, x0 + i * bw + (bw - 10) / 2, 45, { size: 12, align: 'center', color: B.col, mono: false, weight: '700' });
        if (i < st.pipe.length - 1) text(ctx, '→', x0 + (i + 1) * bw - 7, 45, { size: 13, align: 'center', color: '#4a5877' });
      });
      if (!st.pipe.length) text(ctx, '(vuota — aggiungi blocchi qui sotto)', 14, 45, { size: 12, color: '#5b6b90' });
      text(ctx, '📏 MISURA', x0 + st.pipe.length * bw + 8, 45, { size: 12, color: '#6f7fa3', mono: false });
    },
  });
  const fx = attachFX(pipeStage);   // scintille, lampi e suono ai traguardi
  pipeStage.pause();
  const draw = () => pipeStage.redraw();

  const addRow = h('div', { class: 'btn-row', style: { marginTop: '10px' } });
  Object.entries(BLOCKS).forEach(([k, b]) => addRow.appendChild(
    h('button', { class: 'btn sm', title: b.desc, onclick: () => { if (st.pipe.length < 8) { st.pipe.push(k); draw(); } } }, '+ ' + b.lab)));
  w.body.appendChild(addRow);

  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '8px' } },
    h('button', { class: 'btn primary', onclick: run }, '🚀 LANCIA'),
    h('button', { class: 'btn sm', onclick: () => { st.pipe = []; draw(); } }, '🗑 svuota pipeline'),
    h('button', { class: 'btn sm ghost', onclick: () => reset(true) }, '🎲 nuova funzione segreta'),
    h('button', { class: 'btn sm ghost', onclick: () => { st.pipe = ['H', 'ORACLE', 'DIFF']; draw(); } }, '💡 suggerimento: H → oracolo → diffusore'),
  ));

  const ampHost = h('div'), histHost = h('div');
  w.body.append(ampHost, histHost);
  const amps = ampsView(ampHost, { height: 170, showProb: true });
  const hist = histogram(histHost, { n, height: 150, title: 'Misure (200 tiri)' });

  const ansRow = h('div', { class: 'btn-row', style: { marginTop: '10px' } });
  w.body.appendChild(h('div', {}, h('div', { class: 'small dim', html: '<b>La tua risposta:</b>' }), ansRow));
  const out = readout('');
  w.body.appendChild(out.root);

  /* ---------- logica ---------- */
  function reset(newSecret) {
    const C = CHALLENGES[st.challenge];
    if (newSecret || !st.secret) st.secret = C.newSecret();
    st.queries = 0; st.answered = null; st.state = zeroState(n);
    amps.set(st.state); hist.reset(n);
    briefBox.innerHTML = `<b>${C.name}.</b> ${C.brief}<br><span class="muted">Un computer classico se la caverebbe con: ${C.classical}.</span>`;
    renderAnswers();
    upd();
  }

  function renderAnswers() {
    const C = CHALLENGES[st.challenge];
    ansRow.innerHTML = '';
    C.answers().forEach(a => ansRow.appendChild(h('button', {
      class: 'btn sm', onclick: () => answer(a.value),
    }, a.label)));
  }

  function run() {
    const C = CHALLENGES[st.challenge];
    const s = zeroState(n);
    let q = 0;
    for (const b of st.pipe) {
      if (b === 'H') hadamardAll(s, [...Array(n).keys()]);
      else if (b === 'X') [...Array(n).keys()].forEach(i => applyGate(s, i, GATES.X.m));
      else if (b === 'ORACLE') { C.oracle(s, st.secret); q++; }
      else if (b === 'QFT') for (const op of qftOps(n)) applyOp(s, op);
      else if (b === 'IQFT') for (const op of qftOps(n, { inverse: true })) applyOp(s, op);
      else if (b === 'DIFF') groverDiffusion(s, [...Array(n).keys()]);
      else if (b === 'PH0') phaseOracle(s, i => i === 0);
    }
    st.queries = q; st.state = s;
    amps.set(s);
    hist.reset(n);
    for (let i = 0; i < 200; i++) hist.add(sample(s));
    st.shots = 200;
    upd();
  }

  function answer(v) {
    const C = CHALLENGES[st.challenge];
    const ok = C.check(v, st.secret);
    st.answered = { v, ok };
    ok ? sfx.boss() : sfx.err();
    if (ok) {
      saveBest(st.challenge, st.queries);
      fx.win();
      cfg.onSolve && cfg.onSolve({ challenge: st.challenge, queries: st.queries });
    }
    upd();
  }

  function upd() {
    const C = CHALLENGES[st.challenge];
    const p = st.state ? probs(st.state) : null;
    const top = p ? p.indexOf(Math.max(...p)) : -1;
    let msg =
      `Interrogazioni dell'oracolo usate: <b>${st.queries}</b>` +
      (st.best[st.challenge] !== undefined ? `  ·  tuo record per questa sfida: <b>${st.best[st.challenge]}</b>` : '') + '\n';
    if (p) {
      msg += `Risultato più probabile: <b>|${label(top, n)}⟩</b> con ${(p[top] * 100).toFixed(1)}%\n`;
      const flat = Math.max(...p) < 1.5 / N;
      if (flat) msg += `<span class="a">Le probabilità sono tutte uguali: così la misura non ti dice niente. Serve un blocco che faccia INTERFERIRE le ampiezze dopo l'oracolo.</span>\n`;
    }
    if (st.answered) {
      msg += st.answered.ok
        ? `<span class="g">✅ RISPOSTA GIUSTA con ${st.queries} interrogazioni!</span> (${C.reveal(st.secret)})\n` +
        `Adesso la domanda vera: <b>riesci a farcela con meno?</b> Cambia pipeline e riprova.`
        : `<span class="p">❌ Risposta sbagliata</span> — ${C.reveal(st.secret)}. Guarda l'istogramma: cosa avresti dovuto leggere?`;
    } else if (p) msg += `Leggi l'istogramma e prova a dare la risposta qui sopra.`;
    out.set(msg);
    draw();
  }

  reset(true);
  w.setFoot('<b>Regola d\'oro dell\'officina:</b> ogni algoritmo quantistico utile ha la stessa forma — <b>metti tutto in gioco</b> (H), <b>scrivi l\'informazione nelle fasi</b> (oracolo), <b>fai interferire</b> (diffusore, QFT), <b>misura</b>. Quello che cambia è solo il terzo passo. Se inventi un terzo passo nuovo, hai inventato un algoritmo.');
  return { state: st };
}
