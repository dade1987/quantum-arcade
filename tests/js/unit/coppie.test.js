/* Test della logica degli esercizi appaiati classico → quantistico.
 *
 * Qui non si collauda il disegno: si collaudano i due numeri su cui poggia
 * l'intero confronto del livello 4 — il muro classico del 75% e il sorpasso
 * quantistico dell'85% — perché se quelli sono sbagliati il gioco insegna una
 * cosa falsa con la faccia di un esperimento. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { CHSH_QUANTISTICO, STRATEGIE, turnoClassico } from '../../../public_html/js/widgets/coppie.js';

const DOMANDE = [[0, 0], [0, 1], [1, 0], [1, 1]];

describe('la sfida delle buste (CHSH)', () => {
  test('nessun accordo classico vince più di 3 turni su 4', () => {
    for (const nome of Object.keys(STRATEGIE)) {
      const vinti = DOMANDE.filter(([x, y]) => turnoClassico(nome, x, y)).length;
      assert.ok(vinti <= 3, `la strategia "${nome}" ne vincerebbe ${vinti}/4`);
    }
  });

  test('le strategie migliori arrivano esattamente a 3 su 4, cioè al 75%', () => {
    const migliori = Object.keys(STRATEGIE)
      .map(n => DOMANDE.filter(([x, y]) => turnoClassico(n, x, y)).length)
      .filter(v => v === 3);
    assert.ok(migliori.length >= 1, 'nessuna strategia raggiunge il muro del 75%');
  });

  /* La verifica esaustiva: TUTTE le strategie deterministiche possibili sono
     16 (quattro risposte possibili per Alice × quattro per Bob), e nessuna
     supera 3/4. È il conto che dimostra il muro, fatto per intero invece che
     sulle quattro scelte offerte dall'interfaccia. */
  test('nessuna delle 16 strategie deterministiche possibili supera il 75%', () => {
    const funzioni = [() => 0, () => 1, x => x, x => x ^ 1];
    let massimo = 0;
    for (const fa of funzioni) {
      for (const fb of funzioni) {
        const vinti = DOMANDE.filter(([x, y]) => (fa(x) ^ fb(y)) === (x & y)).length;
        massimo = Math.max(massimo, vinti);
      }
    }
    assert.equal(massimo, 3);
  });

  test('il valore quantistico è cos²(π/8) e supera il muro classico', () => {
    assert.ok(Math.abs(CHSH_QUANTISTICO - 0.853553) < 1e-5);
    assert.ok(CHSH_QUANTISTICO > 0.75);
    // ma non arriva a 1: nemmeno la meccanica quantistica vince sempre
    assert.ok(CHSH_QUANTISTICO < 1);
  });
});

describe('due strade: probabilità contro ampiezze', () => {
  /* Le stesse due formule del gioco, isolate: sommare probabilità non può
     mai far calare il totale, sommare ampiezze sì. */
  const classico = (a, b) => Math.min(1, a + b);
  const quantistico = (a, b) => Math.min(1, (a + b) ** 2);

  test('in classico aprire una strada in più non fa mai calare il risultato', () => {
    for (let a = 0; a <= 1.0001; a += 0.1) {
      for (let b = 0; b <= 1.0001; b += 0.1) {
        assert.ok(classico(a, b) >= classico(a, 0) - 1e-12);
      }
    }
  });

  test('in quantistico due ampiezze opposte si cancellano', () => {
    assert.equal(quantistico(0.7, -0.7), 0);
    assert.ok(quantistico(0.7, 0) > 0);
    // e chiudere una strada RIACCENDE il rivelatore: è il cuore del livello 7
    assert.ok(quantistico(0.7, 0) > quantistico(0.7, -0.7));
  });

  test('con lo stesso segno invece si rinforzano', () => {
    assert.ok(quantistico(0.5, 0.5) > quantistico(0.5, 0));
  });
});
