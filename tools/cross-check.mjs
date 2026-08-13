/* ============================================================================
   VERIFICA INCROCIATA CON QuantumSim

   I test matematici del progetto controllano che il simulatore rispetti le
   proprietà che ci si aspetta (unitarietà, la QFT che riproduce la matrice di
   Fourier, e così via). Ma controllano il nostro codice con il nostro
   ragionamento: se l'errore sta nel ragionamento, i test lo confermano invece
   di trovarlo.

   Qui il confronto è con un'implementazione indipendente: QuantumSim, scritto
   in C da Francesco Sisini. Stesso circuito, due programmi diversi, due
   linguaggi diversi, due autori diversi. Se le ampiezze coincidono fino alla
   dodicesima cifra su centinaia di circuiti generati a caso, un errore comune
   a entrambi diventa molto improbabile.

     QuantumSim — https://github.com/francescosisini/QuantumSim
     di Francesco Sisini, rilasciato con licenza GNU GPL v3.

   IMPORTANTE — licenze: QuantumSim NON viene incluso nel sito e non viene
   ridistribuito. Questo strumento lo scarica in una cartella ignorata da git
   (.quantumsim/), lo compila, lo interroga e basta: resta un attrezzo da
   banco di prova. Il sito continua a non contenere codice GPL.

   Uso:  node tools/cross-check.mjs [numero di circuiti]
   ============================================================================ */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { zeroState, applyGate, GATES, P } from '../public_html/js/core/qsim.js';

const RADICE = join(dirname(new URL(import.meta.url).pathname), '..');
const CACHE = join(RADICE, '.quantumsim');
const SORGENTI = join(CACHE, 'src');
const ESEGUIBILE = join(CACHE, 'ponte');
const QUANTI = Number(process.argv[2] || 300);

/* ---------- 1. procurarsi il riferimento ---------- */

if (!existsSync(SORGENTI)) {
  console.log('→ scarico QuantumSim (serve una volta sola)');
  mkdirSync(CACHE, { recursive: true });
  const r = spawnSync('git', ['clone', '--depth', '1', 'https://github.com/francescosisini/QuantumSim.git', CACHE], { stdio: 'inherit' });
  if (r.status !== 0) {
    console.error('\n✗ non sono riuscito a scaricare QuantumSim.');
    console.error('  La verifica incrociata ha bisogno di rete la prima volta.');
    process.exit(1);
  }
}

console.log('→ compilo il ponte');
try {
  execFileSync('gcc', ['-O2', '-o', ESEGUIBILE,
    join(RADICE, 'tools/reference/ponte-quantumsim.c'),
    join(SORGENTI, 'quantum_sim.c'),
    '-I', SORGENTI, '-lm'], { stdio: 'pipe' });
} catch (e) {
  console.error('✗ compilazione fallita:', e.stderr?.toString().slice(0, 400) || e.message);
  process.exit(1);
}

/* ---------- 2. circuiti a caso, ma riproducibili ---------- */

/** Generatore deterministico: la stessa sequenza a ogni esecuzione. */
function caso(seme) {
  let s = seme >>> 0;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;  s >>>= 0;
    return s / 4294967296;
  };
}

const PORTE_1 = ['H', 'X', 'Y', 'Z', 'S', 'T', 'Tdg'];
const NOME_C = { Tdg: 'TDG' };   // QuantumSim la chiama così

function circuito(rnd) {
  const n = 2 + Math.floor(rnd() * 3);          // da 2 a 4 qubit
  const passi = 3 + Math.floor(rnd() * 12);
  const ops = [];
  for (let i = 0; i < passi; i++) {
    const q = Math.floor(rnd() * n);
    const tipo = rnd();
    if (tipo < 0.55) ops.push([PORTE_1[Math.floor(rnd() * PORTE_1.length)], q]);
    else if (tipo < 0.7) ops.push(['P', q, Math.round(rnd() * 6283) / 1000]);
    else if (tipo < 0.88) {
      let c = Math.floor(rnd() * n);
      if (c === q) c = (q + 1) % n;
      ops.push([rnd() < 0.5 ? 'CNOT' : 'CZ', c, q]);
    } else if (n >= 3) {
      const [c1, c2, t] = [0, 1, 2].map(k => (q + k) % n);
      ops.push(['CCX', c1, c2, t]);
    } else ops.push(['H', q]);
  }
  return { n, ops };
}

/* ---------- 3. lo stesso circuito, i due simulatori ---------- */

function nostro({ n, ops }) {
  const st = zeroState(n);
  for (const [g, ...a] of ops) {
    if (g === 'P') applyGate(st, a[0], P(a[1]));
    else if (g === 'CNOT') applyGate(st, a[1], GATES.X.m, [a[0]]);
    else if (g === 'CZ') applyGate(st, a[1], GATES.Z.m, [a[0]]);
    else if (g === 'CCX') applyGate(st, a[2], GATES.X.m, [a[0], a[1]]);
    else applyGate(st, a[0], GATES[g].m);
  }
  return st;
}

function riferimento({ n, ops }) {
  const input = n + '\n' + ops.map(o => [NOME_C[o[0]] || o[0], ...o.slice(1)].join(' ')).join('\n') + '\nEND\n';
  const out = execFileSync(ESEGUIBILE, { input, encoding: 'utf8' });
  return out.trim().split('\n').map(r => r.trim().split(/\s+/).map(Number));
}

/* ---------- 4. confronto ---------- */

const TOLLERANZA = 1e-12;
let peggiore = 0, peggioreCirc = null, falliti = 0;
const rnd = caso(20260811);

for (let i = 0; i < QUANTI; i++) {
  const c = circuito(rnd);
  const a = nostro(c);
  const b = riferimento(c);
  let scarto = 0;
  for (let k = 0; k < b.length; k++) {
    scarto = Math.max(scarto, Math.abs(a.re[k] - b[k][0]), Math.abs(a.im[k] - b[k][1]));
  }
  if (scarto > peggiore) { peggiore = scarto; peggioreCirc = c; }
  if (scarto > TOLLERANZA) {
    falliti++;
    if (falliti <= 3) {
      console.error(`\n✗ divergenza ${scarto.toExponential(2)} su ${c.n} qubit:`);
      console.error('  ' + c.ops.map(o => o.join(' ')).join(' · '));
    }
  }
}

console.log(`\n${falliti ? '✗' : '✅'}  ${QUANTI} circuiti confrontati con QuantumSim`);
console.log(`   scarto massimo: ${peggiore.toExponential(2)}  (tolleranza ${TOLLERANZA.toExponential(0)})`);
if (falliti) {
  console.log(`   circuiti divergenti: ${falliti}`);
  process.exit(1);
}
console.log('   grazie a Francesco Sisini per QuantumSim e per i libri da cui è cominciato tutto.');
