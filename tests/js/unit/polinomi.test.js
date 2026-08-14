/* Test del livello su polinomi e Ruffini.
 *
 * Tre cose che il livello afferma e che qui si controllano numero per
 * numero, perché se una fosse falsa il gioco insegnerebbe un errore con
 * l'aria della dimostrazione:
 *
 *  1. la staffetta di Ruffini calcola DAVVERO il polinomio nel punto
 *     (teorema del resto), non una cosa che gli somiglia;
 *  2. il quoziente che esce dalla staffetta, rimoltiplicato, ridà il
 *     polinomio di partenza;
 *  3. i «sospettati» bastano: nessuna radice intera sta fuori dai
 *     divisori del termine noto. Se ne sfuggisse una, il gioco
 *     direbbe «non si scompone più» a un polinomio scomponibile. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  valuta, ruffini, divisoriDi, candidati, radiciIntere, scomponi, scrivi,
  costoHorner, costoBruto, POLINOMI,
} from '../../../public_html/js/widgets/polinomi.js';

/* Il polinomio calcolato «come a scuola»: potenza per potenza. Serve da
   secondo parere indipendente dallo schema di Horner. */
const allaLettera = (coef, x) => coef.reduce((s, c, i) => s + c * Math.pow(x, coef.length - 1 - i), 0);

describe('valutare un polinomio', () => {
  test('la staffetta dà lo stesso numero del calcolo termine per termine', () => {
    for (const { coef } of POLINOMI) {
      for (let x = -6; x <= 6; x += 0.25) {
        assert.ok(Math.abs(valuta(coef, x) - allaLettera(coef, x)) < 1e-9, `${scrivi(coef)} in ${x}`);
      }
    }
  });

  test('la staffetta costa meno della forza bruta, e il conto è quello dichiarato', () => {
    for (const { coef } of POLINOMI) {
      assert.equal(costoHorner(coef), coef.length - 1);
      assert.ok(costoBruto(coef) > costoHorner(coef), `${scrivi(coef)}: nessun risparmio`);
    }
    // grado 3: 3 moltiplicazioni contro 9
    assert.equal(costoHorner([1, 0, -7, 6]), 3);
    assert.equal(costoBruto([1, 0, -7, 6]), 9);
  });
});

describe('la divisione di Ruffini', () => {
  test('il resto è il valore del polinomio in r (teorema del resto)', () => {
    for (const { coef } of POLINOMI) {
      for (const r of [-3, -2, -1, 0, 1, 2, 3]) {
        assert.ok(Math.abs(ruffini(coef, r).resto - valuta(coef, r)) < 1e-9, `${scrivi(coef)}, r=${r}`);
      }
    }
  });

  test('quoziente × (x − r) + resto ridà il polinomio di partenza', () => {
    for (const { coef } of POLINOMI) {
      for (const r of [-3, -1, 1, 2, 5]) {
        const { quoziente, resto } = ruffini(coef, r);
        /* ricostruisco: Q(x)·(x − r) + resto, valutato in tanti punti */
        for (let x = -4; x <= 4; x += 0.5) {
          const ric = valuta(quoziente, x) * (x - r) + resto;
          assert.ok(Math.abs(ric - valuta(coef, x)) < 1e-9, `${scrivi(coef)}, r=${r}, x=${x}`);
        }
      }
    }
  });

  test('i passi mostrati dal gioco sono coerenti fra loro', () => {
    const { passi } = ruffini([1, -4, 1, 6], 3);
    assert.equal(passi[0].portato, 0);
    for (let i = 1; i < passi.length; i++) {
      assert.equal(passi[i].portato, passi[i - 1].somma * 3);
      assert.equal(passi[i].somma, passi[i].coefficiente + passi[i].portato);
    }
  });
});

describe('i sospettati: il teorema delle radici razionali', () => {
  test('i divisori sono quelli giusti', () => {
    assert.deepEqual(divisoriDi(6), [1, 2, 3, 6]);
    assert.deepEqual(divisoriDi(-4), [1, 2, 4]);
    assert.deepEqual(divisoriDi(1), [1]);
    assert.deepEqual(divisoriDi(0), []);
  });

  test('nessuna radice intera sfugge alla lista dei sospettati', () => {
    for (const { coef } of POLINOMI) {
      const sospetti = new Set(candidati(coef));
      for (let x = -60; x <= 60; x++) {
        if (Math.abs(valuta(coef, x)) < 1e-9) {
          assert.ok(sospetti.has(x), `${scrivi(coef)}: la radice ${x} non era fra i sospettati`);
        }
      }
    }
  });

  test('e vale anche su mille polinomi costruiti a caso da radici intere', () => {
    let seme = 987;
    const rnd = (a, b) => { seme = (seme * 1103515245 + 12345) % 2147483648; return a + Math.floor((seme / 2147483648) * (b - a + 1)); };
    for (let prova = 0; prova < 1000; prova++) {
      const radici = [rnd(-5, 5), rnd(-5, 5), rnd(-5, 5)];
      let coef = [1];
      for (const r of radici) {
        const next = new Array(coef.length + 1).fill(0);
        coef.forEach((c, i) => { next[i] += c; next[i + 1] -= c * r; });
        coef = next;
      }
      if (coef[coef.length - 1] === 0) continue;      // radice 0: il termine noto sparisce
      const sospetti = new Set(candidati(coef));
      for (const r of radici) assert.ok(sospetti.has(r), `${scrivi(coef)}: manca ${r}`);
    }
  });
});

describe('la scomposizione', () => {
  test('i fattori trovati sono radici vere, e il resto non ne ha più', () => {
    for (const { coef } of POLINOMI) {
      const { fattori, resto } = scomponi(coef);
      for (const f of fattori) assert.ok(Math.abs(valuta(coef, f)) < 1e-9, `${f} non è radice di ${scrivi(coef)}`);
      assert.equal(radiciIntere(resto).length, 0, `${scrivi(resto)} ha ancora radici intere`);
    }
  });

  test('rimoltiplicando i fattori si torna al polinomio di partenza', () => {
    for (const { coef } of POLINOMI) {
      const { fattori, resto } = scomponi(coef);
      for (let x = -4; x <= 4; x += 0.5) {
        const prodotto = fattori.reduce((p, f) => p * (x - f), valuta(resto, x));
        assert.ok(Math.abs(prodotto - valuta(coef, x)) < 1e-9, `${scrivi(coef)} in ${x}`);
      }
    }
  });

  test('il terzo polinomio si ferma su un pezzo con delta negativo: è il caso che la lezione mostra', () => {
    const { fattori, resto } = scomponi([1, -2, 1, -2]);   // (x−2)(x²+1)
    assert.deepEqual(fattori, [2]);
    assert.deepEqual(resto, [1, 0, 1]);                    // x² + 1
    const [a, b, c] = resto;
    assert.ok(b * b - 4 * a * c < 0, 'il pezzo rimasto dovrebbe avere delta negativo');
  });

  test('il quarto si scompone fino in fondo: quattro radici, niente resto oltre il numero', () => {
    const { fattori, resto } = scomponi([1, 0, -5, 0, 4]);
    assert.deepEqual(fattori.slice().sort((x, y) => x - y), [-2, -1, 1, 2]);
    assert.deepEqual(resto, [1]);
  });
});

describe('come si scrive un polinomio', () => {
  test('i termini che non ci sono non si scrivono, e gli 1 non si ripetono', () => {
    assert.equal(scrivi([1, 0, -7, 6]), 'x³ − 7x + 6');
    assert.equal(scrivi([1, -4, 1, 6]), 'x³ − 4x² + x + 6');
    assert.equal(scrivi([1, 0, 1]), 'x² + 1');
    assert.equal(scrivi([3]), '3');
    assert.equal(scrivi([0]), '0');
  });
});
