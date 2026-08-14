/* Test della serie geometrica, il livello che spiega il picco della DFT.
 *
 * Le due affermazioni che il livello fa, e che qui devono risultare vere:
 * infiniti pezzi possono avere un totale finito, e frecce girate di un passo
 * costante si annullano ESATTAMENTE (non "quasi") ogni volta che il passo è un
 * giro diviso il numero di frecce. Se la seconda fosse falsa, la trasformata
 * di Fourier non avrebbe picchi, e mezzo corso non starebbe in piedi. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { sommaPezzo, sommaFormula, sommaInfinita, catenaFrecce, moduloFormula } from '../../../public_html/js/widgets/serie.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);

describe('i pezzi che si rimpiccioliscono', () => {
  test('sommare a mano e usare la formula danno lo stesso numero', () => {
    for (let r = 0.05; r <= 0.95; r += 0.05) {
      for (const n of [1, 2, 5, 10, 20]) vicino(sommaPezzo(r, n), sommaFormula(r, n), 1e-9);
    }
  });

  test('metà più un quarto più un ottavo… non supera mai 2', () => {
    for (const n of [1, 5, 10, 30]) assert.ok(sommaPezzo(0.5, n) < 2);
    vicino(sommaInfinita(0.5), 2);
    /* Oltre la cinquantina di pezzi la differenza è più piccola di quanto un
       numero in virgola mobile sappia rappresentare: il computer scrive 2 tondo.
       Il totale non lo supera comunque, ed è quello che il livello promette. */
    assert.ok(sommaPezzo(0.5, 100) <= 2);
    vicino(sommaPezzo(0.5, 60), 2, 1e-9);
  });

  test('i tre bersagli del gioco sono raggiungibili con la manopola', () => {
    // r = 1 − 1/bersaglio, arrotondato al centesimo che lo slider può dare
    for (const bersaglio of [2, 4, 1.5]) {
      const r = Math.round((1 - 1 / bersaglio) * 100) / 100;
      assert.ok(r >= 0.05 && r <= 0.95, `bersaglio ${bersaglio}: r fuori scala`);
      assert.ok(Math.abs(sommaPezzo(r, 20) - bersaglio) < 0.05,
        `bersaglio ${bersaglio}: con r=${r} e 20 pezzi si arriva a ${sommaPezzo(r, 20)}`);
    }
  });

  test('più la frazione è vicina a 1, più lontano è il muro', () => {
    vicino(sommaInfinita(0.75), 4);
    vicino(sommaInfinita(0.9), 10);
    assert.equal(sommaInfinita(1.2), Infinity);
  });
});

describe('la catena di frecce', () => {
  test('a passo zero le frecce si sommano tutte', () => {
    for (const n of [4, 8, 16]) {
      vicino(catenaFrecce(0, n).modulo, n, 1e-9);
      vicino(moduloFormula(0, n), n, 1e-9);
    }
  });

  /* Il fatto su cui poggia tutta la Parte C: la somma non è «piccola», è zero
     esatto. È il motivo per cui la DFT ha picchi netti e non colline. */
  test('con un passo di un giro diviso n, la catena si chiude: somma zero esatta', () => {
    for (const n of [4, 8, 16]) {
      for (let k = 1; k < n; k++) {
        const passo = 360 * k / n;
        assert.ok(catenaFrecce(passo, n).modulo < 1e-9, `n=${n}, k=${k}: modulo ${catenaFrecce(passo, n).modulo}`);
        assert.ok(moduloFormula(passo, n) < 1e-9);
      }
    }
  });

  test('la formula chiusa e la somma a mano coincidono, passo per passo', () => {
    for (const n of [4, 8, 16]) {
      for (let passo = 0; passo <= 360; passo += 1) {
        vicino(catenaFrecce(passo, n).modulo, moduloFormula(passo, n), 1e-6);
      }
    }
  });

  test('la catena tocca davvero il valore massimo solo a passo nullo o giro intero', () => {
    const n = 8;
    for (let passo = 1; passo < 360; passo++) {
      assert.ok(catenaFrecce(passo, n).modulo < n - 1e-6, `passo ${passo}: somma ${catenaFrecce(passo, n).modulo}`);
    }
    vicino(catenaFrecce(360, n).modulo, n, 1e-6);
  });

  test('gli obiettivi del gioco sono centrabili con lo slider a gradi interi', () => {
    for (const n of [4, 8, 16]) {
      const zeri = [];
      for (let passo = 1; passo < 360; passo++) if (catenaFrecce(passo, n).modulo < 0.2) zeri.push(passo);
      assert.ok(zeri.length >= n - 1, `n=${n}: solo ${zeri.length} passi annullano la somma`);
    }
  });

  test('i punti della catena partono dall\'origine e finiscono sulla somma', () => {
    const cat = catenaFrecce(33, 8);
    assert.deepEqual(cat.punti[0], { x: 0, y: 0 });
    assert.equal(cat.punti.length, 9);
    vicino(cat.punti[8].x, cat.somma.x);
    vicino(cat.punti[8].y, cat.somma.y);
  });
});
