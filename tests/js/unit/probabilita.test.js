/* Test del livello sulla probabilità.
 *
 * Tre affermazioni che il livello fa e che sarebbero gravi se false:
 *
 *  1. l'errore sulla media scende come 1/√n — la riga che al livello
 *     21·b decide il costo di un algoritmo variazionale;
 *  2. NESSUNA strategia classica del gioco di Bell supera il 75%. Non
 *     «nessuna di quelle che ho provato»: si enumerano tutte e sedici;
 *  3. la strategia quantistica arriva a cos²(22,5°) ≈ 85,36% e non oltre
 *     — il limite di Tsirelson. Se il gioco lasciasse arrivare al 100%
 *     starebbe insegnando che l'entanglement permette di comunicare, che
 *     è falso. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  media, varianza, deviazione, erroreAtteso, tiriPerErrore, sigmaMoneta,
  bayes, DOMANDE, vinceClassica, tutteLeClassiche, massimoClassico,
  vinceQuantistica, ANGOLI_OTTIMI, massimoQuantistico,
} from '../../../public_html/js/widgets/probabilita.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);

describe('media e varianza', () => {
  test('i conti di base tornano su casi noti', () => {
    vicino(media([1, 2, 3, 4]), 2.5);
    vicino(varianza([2, 2, 2, 2]), 0);
    vicino(varianza([0, 1]), 0.25);
    vicino(deviazione([0, 1]), 0.5);
  });

  test('la deviazione di una moneta è √(p(1−p)), massima a p = 0,5', () => {
    vicino(sigmaMoneta(0.5), 0.5);
    vicino(sigmaMoneta(1), 0);
    vicino(sigmaMoneta(0), 0);
    for (let p = 0.05; p < 1; p += 0.05) assert.ok(sigmaMoneta(p) <= sigmaMoneta(0.5) + 1e-12);
  });

  test('e coincide con la deviazione calcolata sui tiri veri, su tanti tiri', () => {
    /* generatore ripetibile: i test non usano Math.random */
    let seme = 20240;
    const rnd = () => { seme = (seme * 1103515245 + 12345) % 2147483648; return seme / 2147483648; };
    for (const p of [0.2, 0.5, 0.8]) {
      const tiri = Array.from({ length: 40000 }, () => (rnd() < p ? 1 : 0));
      assert.ok(Math.abs(deviazione(tiri) - sigmaMoneta(p)) < 0.02, `p=${p}`);
      assert.ok(Math.abs(media(tiri) - p) < 0.02, `p=${p}: media ${media(tiri)}`);
    }
  });
});

describe('l\'errore che scende come 1/√n', () => {
  test('quadruplicare i tiri dimezza l\'errore atteso', () => {
    for (const s of [0.1, 0.5, 1]) {
      for (const n of [10, 100, 1000]) {
        vicino(erroreAtteso(s, 4 * n), erroreAtteso(s, n) / 2, 1e-12);
      }
    }
  });

  test('un decimale in più costa cento volte i tiri', () => {
    const s = 0.5;
    assert.equal(tiriPerErrore(s, 0.01) / tiriPerErrore(s, 0.1), 100);
    assert.equal(tiriPerErrore(s, 0.001) / tiriPerErrore(s, 0.01), 100);
  });

  test('e il numero di tiri promesso basta davvero', () => {
    for (const s of [0.3, 0.5]) {
      for (const e of [0.05, 0.01, 0.005]) {
        const n = tiriPerErrore(s, e);
        assert.ok(erroreAtteso(s, n) <= e + 1e-12, `σ=${s}, e=${e}: ${n} tiri non bastano`);
        assert.ok(erroreAtteso(s, n - 1) > e - 1e-12, `σ=${s}, e=${e}: ${n} tiri sono più del minimo`);
      }
    }
  });
});

describe('Bayes: il test quasi perfetto su una cosa rara', () => {
  test('il caso classico che rompe l\'intuizione', () => {
    /* una cosa che riguarda una persona su mille, un test che la trova
       sempre e sbaglia solo il 5% delle volte: chi risulta positivo ha
       comunque meno del 2% di probabilità di averla davvero */
    const p = bayes(0.001, 1, 0.05);
    assert.ok(p < 0.02, `viene ${p}, dovrebbe essere sotto il 2%`);
    assert.ok(p > 0.019, `viene ${p}, dovrebbe essere circa 1,96%`);
  });

  test('se la cosa è diffusa, lo stesso test diventa affidabile', () => {
    assert.ok(bayes(0.5, 1, 0.05) > 0.95);
  });

  test('casi limite: certezza e impossibilità', () => {
    vicino(bayes(1, 1, 0.05), 1);
    vicino(bayes(0, 1, 0.05), 0);
  });

  test('un test che dice sempre sì non aggiunge niente: resta la base', () => {
    for (const base of [0.01, 0.3, 0.9]) vicino(bayes(base, 1, 1), base, 1e-12);
  });
});

describe('il gioco di Bell: il muro classico', () => {
  test('le strategie deterministiche sono sedici', () => {
    assert.equal(tutteLeClassiche().length, 16);
  });

  test('NESSUNA supera il 75% — enumerate tutte, non campionate', () => {
    for (const s of tutteLeClassiche()) {
      assert.ok(s.p <= 0.75 + 1e-12, `la strategia ${s.sa}/${s.sb} vince il ${s.p}`);
    }
    vicino(massimoClassico(), 0.75);
  });

  test('le sedici si spaccano in due metà esatte: otto vincono il 75%, otto il 25%', () => {
    /* non è una curiosità: ribaltare la sola risposta di Anna cambia
       l'esito di TUTTE e quattro le domande, quindi le strategie vanno
       a coppie «una buona, una pessima». Il tetto del 75% è quindi
       facile da toccare — e impossibile da superare. */
    const alMassimo = tutteLeClassiche().filter(s => Math.abs(s.p - 0.75) < 1e-12);
    const alMinimo = tutteLeClassiche().filter(s => Math.abs(s.p - 0.25) < 1e-12);
    assert.equal(alMassimo.length, 8);
    assert.equal(alMinimo.length, 8);
    assert.equal(alMassimo.length + alMinimo.length, 16, 'esistono strategie con un altro punteggio');
  });

  test('nemmeno mescolando le strategie a caso si supera il 75%', () => {
    /* una strategia probabilistica è una media di quelle deterministiche:
       la media di numeri tutti ≤ 0,75 non può superare 0,75, e qui lo si
       verifica su mille miscugli a caso */
    let seme = 909;
    const rnd = () => { seme = (seme * 1103515245 + 12345) % 2147483648; return seme / 2147483648; };
    const tutte = tutteLeClassiche();
    for (let k = 0; k < 1000; k++) {
      const pesi = tutte.map(() => rnd());
      const tot = pesi.reduce((a, b) => a + b, 0);
      const p = tutte.reduce((acc, s, i) => acc + (pesi[i] / tot) * s.p, 0);
      assert.ok(p <= 0.75 + 1e-12, `miscuglio da ${p}`);
    }
  });
});

describe('il gioco di Bell: la strategia quantistica', () => {
  test('gli angoli ottimali danno esattamente cos²(22,5°)', () => {
    vicino(vinceQuantistica(ANGOLI_OTTIMI.a, ANGOLI_OTTIMI.b), massimoQuantistico(), 1e-12);
    vicino(massimoQuantistico(), 0.5 + Math.SQRT2 / 4, 1e-12);   // ≈ 0,853553
  });

  test('e quel valore supera davvero il muro classico', () => {
    assert.ok(massimoQuantistico() > 0.75 + 0.1, 'il vantaggio quantistico dovrebbe essere netto');
  });

  test('LIMITE DI TSIRELSON: nessuna scelta di angoli arriva al 100%', () => {
    /* si spazza tutta la griglia degli angoli: se il gioco lasciasse
       vincere sempre, insegnerebbe che l'entanglement fa comunicare */
    let massimo = 0;
    for (let a0 = -90; a0 < 90; a0 += 3) {
      for (let a1 = -90; a1 < 90; a1 += 3) {
        for (let b0 = -90; b0 < 90; b0 += 3) {
          for (let b1 = -90; b1 < 90; b1 += 3) {
            const p = vinceQuantistica([a0, a1], [b0, b1]);
            if (p > massimo) massimo = p;
          }
        }
      }
    }
    assert.ok(massimo <= massimoQuantistico() + 1e-9, `trovato ${massimo}, oltre il limite`);
    assert.ok(massimo > massimoQuantistico() - 1e-3, `il massimo trovato (${massimo}) non raggiunge il limite`);
  });

  test('con tutti gli angoli uguali si vince il 75%: la coppia entangled da sola non basta', () => {
    /* misurare nella stessa direzione dà sempre lo stesso esito: è come
       la strategia classica «rispondiamo sempre uguale», e infatti vale
       esattamente quanto quella */
    for (const g of [0, 30, 45, 90]) vicino(vinceQuantistica([g, g], [g, g]), 0.75, 1e-12);
  });

  test('le quattro domande sono quattro e coprono tutti i casi', () => {
    assert.equal(DOMANDE.length, 4);
    assert.equal(new Set(DOMANDE.map(d => d.join(''))).size, 4);
    assert.equal(DOMANDE.filter(([x, y]) => (x & y) === 1).length, 1);   // solo (1,1) chiede «diverso»
  });

  test('la strategia classica «rispondiamo sempre 0» vince il 75%: è il caso da battere', () => {
    vicino(vinceClassica([0, 0], [0, 0]), 0.75, 1e-12);
  });
});
