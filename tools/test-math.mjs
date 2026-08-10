/* Verifica numerica dei moduli matematici (nessun DOM richiesto).
   Uso: node tools/test-math.mjs                                        */

import { dft, fft, fromArray, magnitudes, costs } from '../js/core/dsp.js';
import {
  zeroState, basisState, applyGate, GATES, probs, qftOps, circuitMatrix,
  blochVector, groverDiffusion, phaseOracle, hadamardAll, modpow, periodOf,
  continuedFraction, gcd, clone, runCircuit,
} from '../js/core/qsim.js';

let pass = 0, fail = 0;
const near = (a, b, tol = 1e-9) => Math.abs(a - b) < tol;
function ok(cond, msg) { cond ? (pass++, console.log('  ✓ ' + msg)) : (fail++, console.log('  ✗ ' + msg)); }

console.log('\n[1] DFT vs FFT');
{
  const x = fromArray([1, 0, 1, 0, 3, -2, 0.5, 1]);
  const A = dft(x), B = fft(x);
  let maxd = 0;
  for (let i = 0; i < 8; i++) maxd = Math.max(maxd, Math.abs(A.re[i] - B.re[i]), Math.abs(A.im[i] - B.im[i]));
  ok(maxd < 1e-9, 'DFT diretta e FFT radix-2 coincidono (err ' + maxd.toExponential(1) + ')');

  const y = fromArray([1, 0, 1, 0]);
  const Y = dft(y);
  ok(near(Y.re[0], 2) && near(Y.im[0], 0), 'DFT([1,0,1,0]) k=0 → 2');
  ok(near(magnitudes(Y)[1], 0), 'k=1 → 0 (cancellazione)');
  ok(near(Y.re[2], 2), 'k=2 → 2 (periodo 2 rilevato)');
  ok(near(magnitudes(Y)[3], 0), 'k=3 → 0');
}

console.log('\n[2] Porte a 1 qubit');
{
  const st = zeroState(1);
  applyGate(st, 0, GATES.H.m);
  const p = probs(st);
  ok(near(p[0], 0.5) && near(p[1], 0.5), 'H|0⟩ → 50/50');
  const b = blochVector(st, 0);
  ok(near(b.x, 1) && near(b.y, 0) && near(b.z, 0), 'H|0⟩ punta su +X della sfera di Bloch');
  applyGate(st, 0, GATES.H.m);
  ok(near(probs(st)[0], 1), 'H·H = identità (interferenza distruttiva su |1⟩)');

  const s2 = zeroState(1);
  applyGate(s2, 0, GATES.H.m); applyGate(s2, 0, GATES.S.m);
  const b2 = blochVector(s2, 0);
  ok(near(b2.y, 1, 1e-9), 'S·H|0⟩ punta su +Y');
}

console.log('\n[3] CNOT ed entanglement (stato di Bell)');
{
  const st = zeroState(2);
  applyGate(st, 0, GATES.H.m);
  applyGate(st, 1, GATES.X.m, [0]);      // CNOT: controllo q0, target q1
  const p = probs(st);
  ok(near(p[0], 0.5) && near(p[3], 0.5) && near(p[1], 0) && near(p[2], 0), '|00⟩+|11⟩ (solo 00 e 11)');
  const b = blochVector(st, 0);
  ok(near(b.purity, 0), 'ogni qubit da solo è massimamente indeterminato (Bloch nullo)');
}

console.log('\n[4] QFT: il circuito riproduce la matrice di Fourier');
{
  for (const n of [1, 2, 3, 4]) {
    const N = 1 << n;
    const M = circuitMatrix(qftOps(n), n);
    let maxd = 0;
    for (let col = 0; col < N; col++) {
      for (let row = 0; row < N; row++) {
        const th = 2 * Math.PI * col * row / N;
        const er = Math.cos(th) / Math.sqrt(N), ei = Math.sin(th) / Math.sqrt(N);
        maxd = Math.max(maxd, Math.abs(M[col].re[row] - er), Math.abs(M[col].im[row] - ei));
      }
    }
    ok(maxd < 1e-9, `n=${n}: circuito == (1/√N)·e^{+2πi·jk/N}  (err ${maxd.toExponential(1)})`);
  }
}

console.log('\n[5] QFT su |01⟩ con 2 qubit → [1, i, −1, −i]/2');
{
  const st = basisState(2, 1);
  const frames = runCircuit(qftOps(2), st);
  const out = frames[frames.length - 1];
  const exp = [[1, 0], [0, 1], [-1, 0], [0, -1]].map(([r, i]) => [r / 2, i / 2]);
  let good = true;
  for (let i = 0; i < 4; i++) good = good && near(out.re[i], exp[i][0], 1e-9) && near(out.im[i], exp[i][1], 1e-9);
  ok(good, 'ampiezze = ½[1, i, −1, −i] (le quattro frecce a 0°, 90°, 180°, 270°)');
}

console.log('\n[6] QFT inversa');
{
  const n = 3;
  const st = basisState(n, 5);
  const f1 = runCircuit(qftOps(n), st);
  const back = runCircuit(qftOps(n, { inverse: true }), f1[f1.length - 1]);
  const out = back[back.length - 1];
  ok(near(out.re[5], 1, 1e-9), 'QFT† ∘ QFT = identità');
}

console.log('\n[7] Grover su 3 qubit (N=8, elemento marcato = 5)');
{
  const n = 3, marked = 5;
  const st = zeroState(n);
  hadamardAll(st, [0, 1, 2]);
  const hist = [probs(st)[marked]];
  for (let it = 0; it < 3; it++) {
    phaseOracle(st, i => i === marked);
    groverDiffusion(st, [0, 1, 2]);
    hist.push(probs(st)[marked]);
  }
  ok(near(hist[0], 0.125, 1e-9), 'partenza: 1/8 = 12.5%');
  ok(hist[1] > 0.75 && hist[2] > 0.9, `dopo 2 iterazioni ≈ ${(hist[2] * 100).toFixed(1)}%`);
  ok(hist[3] < hist[2], 'alla terza iterazione ricomincia a calare (overshoot)');
}

console.log('\n[8] Aritmetica per Shor');
{
  ok(modpow(7, 4, 15) === 1, '7^4 mod 15 = 1');
  ok(periodOf(7, 15) === 4, 'periodo di 7 mod 15 = 4');
  ok(periodOf(2, 15) === 4, 'periodo di 2 mod 15 = 4');
  ok(periodOf(4, 15) === 2, 'periodo di 4 mod 15 = 2');
  const g1 = gcd(modpow(7, 2, 15) - 1, 15), g2 = gcd(modpow(7, 2, 15) + 1, 15);
  ok((g1 === 3 && g2 === 5) || (g1 === 5 && g2 === 3), 'MCD(7^2∓1, 15) → 3 e 5');
  const cf = continuedFraction(0.375, 16);
  ok(cf.conv.some(c => c.p === 3 && c.q === 8), 'frazioni continue: 0.375 → 3/8');
}

console.log('\n[9] Costi');
{
  const c = costs(1024);
  ok(c.dftMul === 1048576, 'DFT su 1024 punti: ~1.048.576 moltiplicazioni');
  ok(c.fftMul === 5120, 'FFT: 5.120 farfalle');
  ok(c.qftGates === 60, 'QFT (10 qubit): 55 porte + 5 SWAP = 60');
}

console.log(`\n${fail === 0 ? '✅' : '❌'}  ${pass} test superati, ${fail} falliti\n`);
process.exit(fail ? 1 : 0);
