/* Test del livello su esponenziali e logaritmi.
 *
 * La cosa che il livello promette, e che qui si controlla numero per numero:
 * «quanti bit servono per N casi» e «quante volte posso dimezzare N» sono lo
 * stesso numero. Se non lo fossero, la scoperta centrale del livello sarebbe
 * una bella frase e basta. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { possibilita, bitNecessari, dimezzamenti, cifre, CASI } from '../../../public_html/js/widgets/logaritmi.js';

describe('esponenziale: quante possibilità', () => {
  test('n interruttori coprono 2ⁿ casi', () => {
    assert.equal(possibilita(0), 1);
    assert.equal(possibilita(1), 2);
    assert.equal(possibilita(8), 256);
    assert.equal(possibilita(10), 1024);
    assert.equal(possibilita(20), 1048576);
  });

  test('ogni interruttore in più raddoppia, non aggiunge', () => {
    for (let n = 0; n < 20; n++) assert.equal(possibilita(n + 1), 2 * possibilita(n));
  });
});

describe('logaritmo: quanti bit servono', () => {
  test('il numero trovato basta, e uno in meno no', () => {
    for (const N of [2, 3, 26, 52, 100, 365, 1000, 4096, 1000000]) {
      const n = bitNecessari(N);
      assert.ok(possibilita(n) >= N, `${N}: ${n} bit non bastano`);
      assert.ok(possibilita(n - 1) < N, `${N}: bastavano ${n - 1} bit`);
    }
  });

  test('sulle potenze di due il conto è esatto, senza arrotondamenti', () => {
    for (let n = 1; n <= 16; n++) assert.equal(bitNecessari(possibilita(n)), n);
  });

  test('i casi proposti dal gioco danno i numeri che la lezione cita', () => {
    const atteso = { alfabeto: 5, carte: 6, giorni: 9, mille: 10, milione: 20 };
    for (const c of CASI) assert.equal(bitNecessari(c.N), atteso[c.id], `${c.id}`);
  });
});

describe('la scoperta del livello: sono lo stesso numero', () => {
  /* Il cuore del livello. Vale per ogni numero fino a diecimila, non solo per
     i quattro che il gioco propone. */
  test('dimezzare fino a 1 e contare i bit danno lo stesso risultato', () => {
    for (let N = 2; N <= 10000; N++) {
      assert.equal(dimezzamenti(N), bitNecessari(N), `su N = ${N} i due conti divergono`);
    }
  });

  test('e coincidono anche con il logaritmo in base 2 arrotondato in su', () => {
    for (const N of [3, 7, 64, 100, 999, 1000, 1024, 4096]) {
      assert.equal(dimezzamenti(N), Math.ceil(Math.log2(N)));
    }
  });

  test('dimezzare un numero già piccolo non serve', () => {
    assert.equal(dimezzamenti(1), 0);
    assert.equal(bitNecessari(1), 0);
  });
});

describe('le cifre di un numero sono il suo logaritmo in base 10', () => {
  test('il conto delle cifre torna', () => {
    assert.equal(cifre(7), 1);
    assert.equal(cifre(1000), 4);
    assert.equal(cifre(123456), 6);
  });

  /* La frase che regge tutto il livello di Shor: «polinomiale nel numero di
     cifre». Il numero di cifre è log₁₀N + 1 arrotondato in giù — cioè cresce
     pianissimo mentre N esplode. */
  test('le cifre crescono come il logaritmo, non come il numero', () => {
    for (const N of [10, 1000, 1000000, 1000000000]) {
      assert.equal(cifre(N), Math.floor(Math.log10(N)) + 1);
    }
    // mille volte più grande, solo tre cifre in più
    assert.equal(cifre(1000000) - cifre(1000), 3);
  });
});
