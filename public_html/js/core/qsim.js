/* ============================================================
   SIMULATORE QUANTISTICO (state vector) — didattico ma corretto.

   Convenzione: il qubit q0 è il bit MENO significativo dell'indice.
   Lo stato |q_{n-1} ... q_1 q_0> corrisponde all'indice
   i = q_0·2^0 + q_1·2^1 + ... + q_{n-1}·2^{n-1}.

   Uno stato è { n, re: Float64Array(2^n), im: Float64Array(2^n) }.
   ============================================================ */

import { t } from './i18n.js';

export function zeroState(n) {
  const size = 1 << n;
  const st = { n, re: new Float64Array(size), im: new Float64Array(size) };
  st.re[0] = 1;
  return st;
}

export function basisState(n, index) {
  const st = { n, re: new Float64Array(1 << n), im: new Float64Array(1 << n) };
  st.re[index] = 1;
  return st;
}

export function fromAmps(n, amps) {
  const st = { n, re: new Float64Array(1 << n), im: new Float64Array(1 << n) };
  amps.forEach((a, i) => {
    if (typeof a === 'number') st.re[i] = a;
    else { st.re[i] = a.re || 0; st.im[i] = a.im || 0; }
  });
  return normalize(st);
}

export function clone(st) {
  return { n: st.n, re: Float64Array.from(st.re), im: Float64Array.from(st.im) };
}

export function normalize(st) {
  let s = 0;
  for (let i = 0; i < st.re.length; i++) s += st.re[i] ** 2 + st.im[i] ** 2;
  s = Math.sqrt(s) || 1;
  for (let i = 0; i < st.re.length; i++) { st.re[i] /= s; st.im[i] /= s; }
  return st;
}

/* ---------------- matrici 2×2 ---------------- */
/* U = [[a, b], [c, d]] con elementi {re, im} */

const c = (re, im = 0) => ({ re, im });
const S2 = 1 / Math.SQRT2;

export const GATES = {
  I:  { name: 'I',  m: [c(1), c(0), c(0), c(1)],  desc: t('Non fa nulla (identità).') },
  X:  { name: 'X',  m: [c(0), c(1), c(1), c(0)],  desc: t('NOT quantistico: scambia |0⟩ e |1⟩.') },
  Y:  { name: 'Y',  m: [c(0), c(0, -1), c(0, 1), c(0)], desc: t('Rotazione di 180° attorno all\'asse Y.') },
  Z:  { name: 'Z',  m: [c(1), c(0), c(0), c(-1)], desc: t('Lascia |0⟩, gira di 180° la fase di |1⟩.') },
  H:  { name: 'H',  m: [c(S2), c(S2), c(S2), c(-S2)], desc: t('Hadamard: crea (e disfa) la sovrapposizione.') },
  S:  { name: 'S',  m: [c(1), c(0), c(0), c(0, 1)], desc: t('Ruota la fase di |1⟩ di 90°.') },
  Sdg:{ name: 'S†', m: [c(1), c(0), c(0), c(0, -1)], desc: t('Ruota la fase di |1⟩ di −90°.') },
  T:  { name: 'T',  m: [c(1), c(0), c(0), c(S2, S2)], desc: t('Ruota la fase di |1⟩ di 45°.') },
  Tdg:{ name: 'T†', m: [c(1), c(0), c(0), c(S2, -S2)], desc: t('Ruota la fase di |1⟩ di −45°.') },
};

export const P  = th => [c(1), c(0), c(0), c(Math.cos(th), Math.sin(th))];       // fase e^{iθ} su |1>
export const RX = th => [c(Math.cos(th / 2)), c(0, -Math.sin(th / 2)), c(0, -Math.sin(th / 2)), c(Math.cos(th / 2))];
export const RY = th => [c(Math.cos(th / 2)), c(-Math.sin(th / 2)), c(Math.sin(th / 2)), c(Math.cos(th / 2))];
export const RZ = th => [c(Math.cos(th / 2), -Math.sin(th / 2)), c(0), c(0), c(Math.cos(th / 2), Math.sin(th / 2))];

/* ---------------- applicazione porte ---------------- */

/** Applica U (2×2) al qubit q, opzionalmente solo se tutti i controlli valgono 1. */
export function applyGate(st, q, U, controls = []) {
  const [a, b, cc, d] = U;
  const size = st.re.length;
  const bit = 1 << q;
  const cmask = controls.reduce((m, x) => m | (1 << x), 0);
  for (let i = 0; i < size; i++) {
    if (i & bit) continue;                  // tratto solo le coppie a partire dal membro con q=0
    if ((i & cmask) !== cmask) continue;    // controlli non tutti a 1
    const j = i | bit;
    const r0 = st.re[i], i0 = st.im[i], r1 = st.re[j], i1 = st.im[j];
    st.re[i] = a.re * r0 - a.im * i0 + b.re * r1 - b.im * i1;
    st.im[i] = a.re * i0 + a.im * r0 + b.re * i1 + b.im * r1;
    st.re[j] = cc.re * r0 - cc.im * i0 + d.re * r1 - d.im * i1;
    st.im[j] = cc.re * i0 + cc.im * r0 + d.re * i1 + d.im * r1;
  }
  return st;
}

export function swap(st, q1, q2) {
  if (q1 === q2) return st;
  const b1 = 1 << q1, b2 = 1 << q2;
  for (let i = 0; i < st.re.length; i++) {
    const has1 = !!(i & b1), has2 = !!(i & b2);
    if (has1 && !has2) {
      const j = (i & ~b1) | b2;
      [st.re[i], st.re[j]] = [st.re[j], st.re[i]];
      [st.im[i], st.im[j]] = [st.im[j], st.im[i]];
    }
  }
  return st;
}

/** Fase e^{iθ} applicata solo all'indice/agli indici che soddisfano un predicato (oracoli). */
export function phaseIf(st, pred, theta = Math.PI) {
  const cr = Math.cos(theta), ci = Math.sin(theta);
  for (let i = 0; i < st.re.length; i++) {
    if (!pred(i)) continue;
    const r = st.re[i], im = st.im[i];
    st.re[i] = r * cr - im * ci;
    st.im[i] = r * ci + im * cr;
  }
  return st;
}

/* ---------------- lettura dello stato ---------------- */

export function probs(st) {
  const p = new Float64Array(st.re.length);
  for (let i = 0; i < p.length; i++) p[i] = st.re[i] ** 2 + st.im[i] ** 2;
  return p;
}

export function label(i, n) { return i.toString(2).padStart(n, '0'); }

export function sample(st, rnd = Math.random) {
  const p = probs(st);
  let r = rnd(), acc = 0;
  // Confronto stretto, non `r <= acc`: rnd() vive in [0, 1), quindi con rnd() = 0
  // il confronto largo restituirebbe il primo esito anche se ha probabilità zero
  // — cioè un risultato che quello stato non può dare. Con `<` gli esiti a
  // probabilità nulla non allargano l'intervallo e restano fuori.
  for (let i = 0; i < p.length; i++) { acc += p[i]; if (r < acc) return i; }
  return p.length - 1;
}

/** Probabilità che il qubit q valga 1. */
export function probQubit1(st, q) {
  const bit = 1 << q;
  let s = 0;
  for (let i = 0; i < st.re.length; i++) if (i & bit) s += st.re[i] ** 2 + st.im[i] ** 2;
  return s;
}

/** Misura il qubit q: ritorna il bit ottenuto e fa collassare lo stato. */
export function measureQubit(st, q, rnd = Math.random) {
  const p1 = probQubit1(st, q);
  const bit = rnd() < p1 ? 1 : 0;
  const mask = 1 << q;
  const norm = Math.sqrt(bit ? p1 : 1 - p1) || 1;
  for (let i = 0; i < st.re.length; i++) {
    const on = (i & mask) ? 1 : 0;
    if (on === bit) { st.re[i] /= norm; st.im[i] /= norm; }
    else { st.re[i] = 0; st.im[i] = 0; }
  }
  return bit;
}

/** Misura un registro (elenco di qubit) e ritorna il valore intero letto. */
export function measureRegister(st, qubits, rnd = Math.random) {
  let val = 0;
  qubits.forEach((q, idx) => { if (measureQubit(st, q, rnd)) val |= (1 << idx); });
  return val;
}

/** Vettore di Bloch (x,y,z) del qubit q, tracciando via gli altri. */
export function blochVector(st, q) {
  const bit = 1 << q;
  let x = 0, y = 0, z = 0;
  for (let i = 0; i < st.re.length; i++) {
    if (i & bit) continue;
    const j = i | bit;
    const a = { re: st.re[i], im: st.im[i] };   // componente |0>
    const b = { re: st.re[j], im: st.im[j] };   // componente |1>
    // ρ01 = a·conj(b)  →  x = 2Re, y = 2Im (con segno per convenzione standard)
    x += 2 * (a.re * b.re + a.im * b.im);
    y += 2 * (a.re * b.im - a.im * b.re);
    z += (a.re ** 2 + a.im ** 2) - (b.re ** 2 + b.im ** 2);
  }
  return { x, y, z, purity: Math.hypot(x, y, z) };
}

/* ---------------- circuiti ---------------- */
/*
   Un circuito è una lista di operazioni:
   { g: 'H'|'X'|...|'P'|'RX'|'SWAP', t: qubit target, c: [controlli], p: parametro, note }
*/

export function opMatrix(op) {
  if (op.g === 'P')  return P(op.p);
  if (op.g === 'RX') return RX(op.p);
  if (op.g === 'RY') return RY(op.p);
  if (op.g === 'RZ') return RZ(op.p);
  const g = GATES[op.g];
  if (!g) throw new Error('Porta sconosciuta: ' + op.g);
  return g.m;
}

export function applyOp(st, op) {
  if (op.g === 'SWAP') return swap(st, op.t, op.t2);
  if (op.g === 'MEASURE') return st;    // gestita a parte
  return applyGate(st, op.t, opMatrix(op), op.c || []);
}

/** Esegue il circuito e ritorna gli stati intermedi (per lo scorrimento passo-passo). */
export function runCircuit(ops, st0) {
  const frames = [clone(st0)];
  const st = clone(st0);
  for (const op of ops) { applyOp(st, op); frames.push(clone(st)); }
  return frames;
}

/** Matrice completa del circuito (2^n × 2^n) — usata per verifiche e per la lezione sulla QFT. */
export function circuitMatrix(ops, n) {
  const size = 1 << n;
  const M = [];
  for (let col = 0; col < size; col++) {
    const st = basisState(n, col);
    for (const op of ops) applyOp(st, op);
    M.push({ re: Float64Array.from(st.re), im: Float64Array.from(st.im) });
  }
  return M; // M[col][row] = ampiezza della riga quando l'ingresso è |col>
}

/* ---------------- QFT ---------------- */

/**
 * Circuito della QFT su n qubit (q0 = bit meno significativo).
 * Struttura: per ogni qubit → Hadamard, poi rotazioni di fase controllate
 * dai qubit meno significativi, infine SWAP per rimettere l'ordine.
 */
export function qftOps(n, { swaps = true, inverse = false } = {}) {
  const ops = [];
  for (let j = n - 1; j >= 0; j--) {
    ops.push({ g: 'H', t: j, c: [], note: `H su q${j}` });
    for (let k = j - 1; k >= 0; k--) {
      const angle = Math.PI / Math.pow(2, j - k);
      ops.push({ g: 'P', t: j, c: [k], p: angle, note: `R${j - k + 1} su q${j} controllata da q${k} (${(180 / Math.pow(2, j - k)).toFixed(1)}°)` });
    }
  }
  if (swaps) for (let i = 0; i < Math.floor(n / 2); i++) ops.push({ g: 'SWAP', t: i, t2: n - 1 - i, note: `SWAP q${i} ↔ q${n - 1 - i}` });
  if (inverse) return ops.reverse().map(o => o.g === 'P' ? { ...o, p: -o.p } : o);
  return ops;
}

export const qftGateCount = n => (n * (n + 1)) / 2 + Math.floor(n / 2);

/* ---------------- utilità per gli algoritmi ---------------- */

/** Applica H a tutti i qubit indicati. */
export function hadamardAll(st, qubits) {
  for (const q of qubits) applyGate(st, q, GATES.H.m);
  return st;
}

/** Oracolo a fase: mette un segno meno agli stati marcati (Grover, Deutsch, BV). */
export function phaseOracle(st, isMarked) {
  return phaseIf(st, isMarked, Math.PI);
}

/** Diffusore di Grover sui qubit indicati (riflessione attorno alla media). */
export function groverDiffusion(st, qubits) {
  const mask = qubits.reduce((m, q) => m | (1 << q), 0);
  // media delle ampiezze sui soli indici del registro (gli altri qubit qui non sono usati)
  let mr = 0, mi = 0, cnt = 0;
  for (let i = 0; i < st.re.length; i++) {
    if ((i & ~mask) !== 0) continue;
    mr += st.re[i]; mi += st.im[i]; cnt++;
  }
  mr /= cnt; mi /= cnt;
  for (let i = 0; i < st.re.length; i++) {
    if ((i & ~mask) !== 0) continue;
    st.re[i] = 2 * mr - st.re[i];
    st.im[i] = 2 * mi - st.im[i];
  }
  return st;
}

/* ---------------- oracoli a due registri (Simon, Shor) ---------------- */

/**
 * Oracolo di funzione: |x⟩|y⟩ → |x⟩|y ⊕ f(x)⟩.
 *
 * È l'unico modo di "chiamare una funzione" in modo quantistico: siccome ogni
 * operazione dev'essere reversibile, il risultato non SOSTITUISCE l'ingresso —
 * viene sommato (in XOR) a un secondo registro. Partendo con y = 0 il secondo
 * registro finisce a f(x), e da lì si può tornare indietro.
 *
 * Convenzione dei bit: il registro d'ingresso sono i qubit 0…nIn−1 (i bit bassi
 * dell'indice), quello d'uscita i qubit nIn…nIn+nOut−1 (i bit alti).
 */
export function functionOracle(st, nIn, nOut, f) {
  const maschera = (1 << nIn) - 1;
  const re = new Float64Array(st.re.length);
  const im = new Float64Array(st.im.length);

  for (let i = 0; i < st.re.length; i++) {
    if (st.re[i] === 0 && st.im[i] === 0) continue;
    const x = i & maschera;
    const y = i >> nIn;
    const dest = x | (((y ^ (f(x) & ((1 << nOut) - 1))) & ((1 << nOut) - 1)) << nIn);
    re[dest] += st.re[i];
    im[dest] += st.im[i];
  }

  st.re.set(re);
  st.im.set(im);
  return st;
}

/**
 * Estrae il registro d'ingresso quando quello d'uscita è già stato misurato.
 *
 * Dopo la misura dell'uscita restano in gioco solo gli stati con quel valore:
 * il registro d'ingresso torna a essere uno stato puro di nIn qubit, e questo
 * lo tira fuori (rinormalizzato) così si può disegnarlo e trasformarlo da solo.
 */
export function extractInput(st, nIn, valoreUscita) {
  const fuori = zeroState(nIn);
  const base = valoreUscita << nIn;
  let norma = 0;

  for (let x = 0; x < (1 << nIn); x++) {
    const re = st.re[base | x], im = st.im[base | x];
    fuori.re[x] = re; fuori.im[x] = im;
    norma += re * re + im * im;
  }

  norma = Math.sqrt(norma);
  if (norma > 0) {
    for (let x = 0; x < (1 << nIn); x++) { fuori.re[x] /= norma; fuori.im[x] /= norma; }
  }
  return fuori;
}

/**
 * Risolve un sistema di equazioni y·s = 0 (mod 2) — l'ultimo passo di Simon,
 * che è classico: eliminazione di Gauss con XOR al posto della sottrazione.
 *
 * Ritorna { s, unica } dove `s` è la soluzione non nulla e `unica` dice se ce
 * n'è una sola: con meno di n−1 equazioni indipendenti le soluzioni sono più
 * d'una, ed è esattamente il motivo per cui l'algoritmo va ripetuto.
 */
export function solveMod2(equazioni, n) {
  const righe = [...new Set(equazioni.filter(e => e !== 0))];
  const pivot = [];          // righe ridotte, una per bit pivotale
  const bitPivot = [];

  for (let r of righe) {
    for (let k = 0; k < pivot.length; k++) {
      if (r & (1 << bitPivot[k])) r ^= pivot[k];
    }
    if (r === 0) continue;                       // dipendente dalle precedenti
    let b = 0;
    while (!((r >> b) & 1)) b++;                 // primo bit a 1
    pivot.push(r);
    bitPivot.push(b);
  }

  const rango = pivot.length;
  const candidati = [];

  // n bit, `rango` vincoli indipendenti → 2^(n−rango) soluzioni: con n piccolo
  // le proviamo tutte, che è più chiaro (e più corto) di ricostruire la base.
  for (let s = 1; s < (1 << n); s++) {
    if (righe.every(r => parita(r & s) === 0)) candidati.push(s);
  }

  return { s: candidati[0] ?? null, unica: candidati.length === 1, rango, candidati };
}

/** Parità dei bit a 1 (il prodotto scalare mod 2 si calcola con questa). */
export function parita(v) {
  let p = 0;
  while (v) { p ^= v & 1; v >>= 1; }
  return p;
}

/* ---------------- aritmetica modulare (Shor) ---------------- */

export const gcd = (a, b) => { while (b) { [a, b] = [b, a % b]; } return a; };

export function modpow(base, exp, mod) {
  let r = 1; base %= mod;
  while (exp > 0) {
    if (exp & 1) r = (r * base) % mod;
    base = (base * base) % mod;
    exp >>= 1;
  }
  return r;
}

/** Periodo r di f(x) = a^x mod N (calcolato in modo classico, per confronto). */
export function periodOf(a, N) {
  let x = a % N, r = 1;
  while (x !== 1) { x = (x * a) % N; r++; if (r > N * 2) return null; }
  return r;
}

/** Frazioni continue: approssima x con p/q, q ≤ qmax. Ritorna i convergenti. */
export function continuedFraction(x, qmax) {
  const terms = [];
  const conv = [];
  let v = x, hPrev = 0, h = 1, kPrev = 1, k = 0;
  for (let i = 0; i < 25; i++) {
    const ai = Math.floor(v);
    terms.push(ai);
    const hn = ai * h + hPrev, kn = ai * k + kPrev;
    hPrev = h; h = hn; kPrev = k; k = kn;
    if (k > qmax) break;
    conv.push({ a: ai, p: h, q: k, value: h / k });
    const frac = v - ai;
    if (frac < 1e-9) break;
    v = 1 / frac;
  }
  return { terms, conv };
}
