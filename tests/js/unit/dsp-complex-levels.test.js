/* Test unitari di: numeri complessi, DSP (DFT/FFT), mappa dei livelli. */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import * as C from '../../../public_html/js/core/complex.js';
import {
  signal, fromArray, N_of, dft, dftTerms, fft, magnitudes, phases,
  synth, sampleFn, winding, costs,
} from '../../../public_html/js/core/dsp.js';
import { LEVELS, PARTS, TOTAL_XP, levelById, neighbours, rankFor, RANKS } from '../../../public_html/js/core/levels.js';

const vicino = (a, b, t = 1e-9) => Math.abs(a - b) < t;

describe('numeri complessi', () => {
  test('somma e sottrazione', () => {
    assert.deepEqual(C.add(C.C(1, 2), C.C(3, 4)), { re: 4, im: 6 });
    assert.deepEqual(C.sub(C.C(3, 4), C.C(1, 2)), { re: 2, im: 2 });
  });

  test('moltiplicare somma gli angoli e moltiplica i moduli', () => {
    const z = C.mul(C.polar(2, 0.3), C.polar(3, 0.4));
    assert.ok(vicino(C.abs(z), 6));
    assert.ok(vicino(C.arg(z), 0.7));
  });

  test('i·i = −1', () => {
    const z = C.mul(C.C(0, 1), C.C(0, 1));
    assert.ok(vicino(z.re, -1) && vicino(z.im, 0));
  });

  test('scale, conj, abs2, eq', () => {
    assert.deepEqual(C.scale(C.C(1, 2), 3), { re: 3, im: 6 });
    assert.deepEqual(C.conj(C.C(1, 2)), { re: 1, im: -2 });
    assert.equal(C.abs2(C.C(3, 4)), 25);
    assert.ok(C.eq(C.C(1, 1), C.C(1, 1)));
    assert.ok(!C.eq(C.C(1, 1), C.C(1, 2)));
  });

  test('expi disegna il cerchio unitario', () => {
    assert.ok(vicino(C.abs(C.expi(1.234)), 1));
    assert.ok(vicino(C.expi(Math.PI).re, -1));
  });

  test('str scrive i casi speciali in modo leggibile', () => {
    assert.equal(C.str(C.C(1, 0)), '1.00');
    assert.equal(C.str(C.C(0, 1)), 'i');
    assert.equal(C.str(C.C(0, -1)), '−i');
    assert.ok(C.str(C.C(1, 2)).includes('+'));
    assert.ok(C.str(C.C(1, -2)).includes('−'));
    assert.equal(C.str(C.C(0, 2)), '2.00i');
  });

  test('deg riporta sempre un angolo fra 0 e 360', () => {
    assert.ok(vicino(C.deg(C.C(0, 1)), 90));
    assert.ok(vicino(C.deg(C.C(0, -1)), 270));
  });
});

describe('DFT e FFT', () => {
  test('signal crea vettori vuoti della lunghezza giusta', () => {
    assert.equal(N_of(signal(8)), 8);
  });

  test('fromArray accetta numeri e complessi', () => {
    const s = fromArray([1, { re: 2, im: 3 }]);
    assert.equal(s.re[1], 2); assert.equal(s.im[1], 3);
  });

  test('DFT di [1,0,1,0] dà [2,0,2,0]', () => {
    const X = dft(fromArray([1, 0, 1, 0]));
    const m = magnitudes(X);
    assert.ok(vicino(m[0], 2) && vicino(m[1], 0) && vicino(m[2], 2) && vicino(m[3], 0));
  });

  test('le normalizzazioni cambiano solo la scala', () => {
    const x = fromArray([1, 2, 3, 4]);
    assert.ok(vicino(dft(x, { norm: 'n' }).re[0], dft(x).re[0] / 4));
    assert.ok(vicino(dft(x, { norm: 'sqrt' }).re[0], dft(x).re[0] / 2));
  });

  test('DFT e FFT danno lo stesso risultato', () => {
    const x = fromArray([1, 0, 1, 0, 3, -2, 0.5, 1]);
    const a = dft(x), b = fft(x);
    for (let i = 0; i < 8; i++) {
      assert.ok(vicino(a.re[i], b.re[i], 1e-9));
      assert.ok(vicino(a.im[i], b.im[i], 1e-9));
    }
  });

  test('la FFT rifiuta lunghezze che non sono potenze di 2', () => {
    assert.throws(() => fft(fromArray([1, 2, 3])), /potenza di 2/);
  });

  test('dftTerms espone i singoli contributi e la somma', () => {
    const r = dftTerms(fromArray([1, 0, 1, 0]), 2);
    assert.equal(r.terms.length, 4);
    assert.equal(r.cum.length, 4);
    assert.ok(vicino(r.total.re, 2));
  });

  test('phases restituisce un angolo per ogni frequenza', () => {
    assert.equal(phases(dft(fromArray([1, 2, 3, 4]))).length, 4);
  });

  test('synth somma le sinusoidi richieste', () => {
    assert.ok(vicino(synth([{ amp: 2, freq: 1, phase: 0 }], 0), 2));
  });

  test('sampleFn campiona una funzione continua', () => {
    const s = sampleFn(t => t, 4);
    assert.ok(vicino(s.re[2], 0.5));
  });

  test('winding sposta il centro di massa quando la frequenza è quella giusta', () => {
    const f = t => Math.cos(2 * Math.PI * 3 * t) + 1.2;
    const giusta = winding(f, 3, 400).center;
    const sbagliata = winding(f, 1.7, 400).center;
    assert.ok(Math.hypot(giusta.re, giusta.im) > Math.hypot(sbagliata.re, sbagliata.im));
    assert.equal(winding(f, 3, 10).pts.length, 10);
  });

  test('dft con segno positivo è la trasformata inversa (a meno di 1/N)', () => {
    const x = fromArray([1, 2, 3, 4]);
    const X = dft(x, { sign: -1 });
    const back = dft(X, { sign: +1, norm: 'n' });
    for (let i = 0; i < 4; i++) assert.ok(vicino(back.re[i], x.re[i], 1e-9));
  });

  test('fft accetta anche il segno positivo', () => {
    const x = fromArray([1, 0, 0, 0]);
    assert.ok(vicino(fft(x, { sign: +1 }).re[2], 1));
  });

  test('dftTerms con segno positivo gira nel verso opposto', () => {
    const a = dftTerms(fromArray([0, 1, 0, 0]), 1, { sign: -1 }).terms[1];
    const b = dftTerms(fromArray([0, 1, 0, 0]), 1, { sign: +1 }).terms[1];
    assert.ok(vicino(a.im, -b.im));
  });

  test('costs confronta DFT, FFT e QFT', () => {
    const c = costs(1024);
    assert.equal(c.dftMul, 1048576);
    assert.equal(c.fftMul, 5120);
    assert.equal(c.qftGates, 60);
    assert.ok(c.ratio > 200);
  });
});

describe('mappa dei livelli', () => {
  test('34 livelli in 6 parti, tutti con file e XP', () => {
    assert.equal(LEVELS.length, 34);
    assert.equal(PARTS.length, 6);
    for (const l of LEVELS) {
      assert.ok(l.id && l.file && l.title && l.desc, 'livello incompleto: ' + l.id);
      assert.ok(l.xp > 0);
      assert.ok(PARTS.some(p => p.id === l.part), 'parte inesistente in ' + l.id);
    }
  });

  test('gli id sono unici e i file pure', () => {
    assert.equal(new Set(LEVELS.map(l => l.id)).size, 34);
    assert.equal(new Set(LEVELS.map(l => l.file)).size, 34);
  });

  test('la catena dei prerequisiti non ha buchi né anelli', () => {
    for (const l of LEVELS) {
      if (!l.req) continue;
      assert.ok(levelById(l.req), l.id + ' richiede un livello inesistente');
      assert.notEqual(l.req, l.id, l.id + ' richiede sé stesso');
    }
    // le parti facoltative (0 e K) e il primo livello sono sempre aperti
    assert.ok(LEVELS.filter(l => l.part === '0').every(l => !l.req));
    assert.ok(LEVELS.filter(l => l.part === 'K').every(l => !l.req && l.open));
  });

  test('la Parte K non entra nella catena del percorso principale', () => {
    // il livello 1 deve restare aperto a tutti: inserire la parte classica in
    // mezzo non deve richiudere i livelli a chi era già a metà corso
    assert.ok(!levelById('01-qubit').req);
    assert.equal(levelById('02-bloch').req, '01-qubit');
    assert.equal(LEVELS.filter(l => l.part === 'K').length, 6);
  });

  test('neighbours restituisce precedente e successivo, e null agli estremi', () => {
    assert.equal(neighbours(LEVELS[0].id).prev, null);
    assert.equal(neighbours(LEVELS.at(-1).id).next, null);
    assert.equal(neighbours(LEVELS[1].id).prev.id, LEVELS[0].id);
    assert.equal(neighbours('inesistente').prev, null);
  });

  test('levelById trova o restituisce null', () => {
    assert.equal(levelById('01-qubit').n, 1);
    assert.equal(levelById('boh'), null);
  });

  test('TOTAL_XP è la somma degli XP dei livelli', () => {
    assert.equal(TOTAL_XP, LEVELS.reduce((s, l) => s + l.xp, 0));
  });

  test('rankFor sale con gli XP e non scende mai', () => {
    assert.equal(rankFor(0).name, RANKS[0].name);
    assert.equal(rankFor(-5).name, RANKS[0].name);
    assert.equal(rankFor(99999).name, RANKS.at(-1).name);
    let prima = -1;
    for (const r of RANKS) { assert.ok(r.xp > prima); prima = r.xp; }
  });
});
