/* Test del prodotto scalare e della misura come proiezione.
 *
 * Il livello promette tre cose e le promette in modo verificabile: che le due
 * formule del prodotto scalare (coordinate e coseno) diano lo stesso numero,
 * che «prodotto zero» voglia dire davvero perpendicolari, e che i quadrati
 * delle due ombre facciano SEMPRE 1 — che è la regola di Born, e se fosse
 * falsa il gioco insegnerebbe una fisica sbagliata. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { scalare, lunghezza, distanza, angoloFra, proiezione, baseDi } from '../../../public_html/js/widgets/scalare.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);

describe('il prodotto scalare', () => {
  test('le due formule danno lo stesso numero', () => {
    const coppie = [[[1, 0], [0, 1]], [[1.4, 0.4], [0.6, 1.2]], [[-2, 1], [3, 0.5]], [[2, 2], [2, 2]]];
    for (const [a, b] of coppie) {
      const perCoseno = lunghezza(a) * lunghezza(b) * Math.cos(angoloFra(a, b) * Math.PI / 180);
      vicino(scalare(a, b), perCoseno, 1e-9);
    }
  });

  test('con sé stessa dà il quadrato della lunghezza: è Pitagora', () => {
    for (const v of [[3, 4], [1, 1], [-2, 0.5]]) vicino(scalare(v, v), lunghezza(v) ** 2);
    vicino(lunghezza([3, 4]), 5);
  });

  test('zero vuol dire perpendicolari, e viceversa', () => {
    for (let g = 0; g < 360; g += 7) {
      const a = [Math.cos(g * Math.PI / 180), Math.sin(g * Math.PI / 180)];
      const perp = [-a[1], a[0]];
      vicino(scalare(a, perp), 0, 1e-12);
      vicino(angoloFra(a, perp), 90, 1e-6);
    }
  });

  test('il segno dice il verso: positivo se puntano dalla stessa parte', () => {
    assert.ok(scalare([1, 0], [2, 0.3]) > 0);
    assert.ok(scalare([1, 0], [-2, 0.3]) < 0);
  });

  test('la distanza è la lunghezza della differenza', () => {
    vicino(distanza([0, 0], [3, 4]), 5);
    vicino(distanza([1, 1], [1, 1]), 0);
    // e vale la disuguaglianza triangolare, su una terna qualunque
    const a = [1, 2], b = [-3, 0.5], c = [2, -1];
    assert.ok(distanza(a, c) <= distanza(a, b) + distanza(b, c) + 1e-12);
  });
});

describe('la misura come ombra (regola di Born)', () => {
  test('le due direzioni della base sono lunghe 1 e perpendicolari', () => {
    for (let g = 0; g <= 180; g += 15) {
      const [d0, d1] = baseDi(g);
      vicino(lunghezza(d0), 1);
      vicino(lunghezza(d1), 1);
      vicino(scalare(d0, d1), 0, 1e-12);
    }
  });

  /* Il cuore: comunque si giri lo stato e comunque si giri la base, i quadrati
     delle due ombre fanno 1. È Pitagora, ed è il motivo per cui le probabilità
     quantistiche fanno sempre il 100%. */
  test('i quadrati delle due ombre fanno sempre 1', () => {
    for (let stato = 0; stato < 360; stato += 11) {
      const v = [Math.cos(stato * Math.PI / 180), Math.sin(stato * Math.PI / 180)];
      for (let base = 0; base < 180; base += 13) {
        const [d0, d1] = baseDi(base);
        const a0 = proiezione(v, d0), a1 = proiezione(v, d1);
        vicino(a0 * a0 + a1 * a1, 1, 1e-12);
      }
    }
  });

  test('quando lo stato è allineato con la base, un risultato è certo', () => {
    for (const base of [0, 30, 45, 90]) {
      const [d0] = baseDi(base);
      const a0 = proiezione(d0, d0), a1 = proiezione(d0, baseDi(base)[1]);
      vicino(a0 * a0, 1);
      vicino(a1 * a1, 0, 1e-12);
    }
  });

  test('a 45° dalla base le due probabilità sono esattamente metà e metà', () => {
    const v = [Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)];
    const [d0, d1] = baseDi(0);
    vicino(proiezione(v, d0) ** 2, 0.5, 1e-12);
    vicino(proiezione(v, d1) ** 2, 0.5, 1e-12);
    // e 1/√2 ≈ 0,707 è proprio l'ampiezza che il corso incontra dappertutto
    vicino(proiezione(v, d0), Math.SQRT1_2, 1e-12);
  });

  test('le tre configurazioni chieste dal gioco sono raggiungibili', () => {
    // certezza sul primo risultato, sul secondo, e metà e metà: esistono angoli che le danno
    const prob = (statoG, baseG) => {
      const v = [Math.cos(statoG * Math.PI / 180), Math.sin(statoG * Math.PI / 180)];
      const [d0, d1] = baseDi(baseG);
      return [proiezione(v, d0) ** 2, proiezione(v, d1) ** 2];
    };
    assert.ok(prob(0, 0)[0] > 0.995);
    assert.ok(prob(90, 0)[1] > 0.995);
    assert.ok(Math.abs(prob(45, 0)[0] - 0.5) < 0.01);
  });
});
