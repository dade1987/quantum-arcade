/* Test del livello sull'esponenziale di matrice.
 *
 * Quattro affermazioni, e ognuna regge un pezzo del corso:
 *
 *  1. e^M calcolato per serie (livello M·10) e calcolato
 *     diagonalizzando (livello M·11) danno lo stesso risultato.
 *     Se non lo dessero, una delle due strade sarebbe sbagliata;
 *
 *  2. un generatore antisimmetrico produce una rotazione: lunghezze
 *     conservate, determinante 1. In quantistica vuol dire che le
 *     probabilità continuano a fare 1;
 *
 *  3. det(e^M) = e^(traccia di M), sempre. È l'identità che lega
 *     due cose che il livello M·11 ha appena dichiarato invarianti;
 *
 *  4. se due pezzi di energia non commutano, e^(A+B) ≠ e^A·e^B, ma
 *     spezzando il tempo in n pezzetti l'errore scende come 1/n — e
 *     i pezzetti che servono crescono col tempo da simulare. È il
 *     conto del costo di una simulazione quantistica.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  espSerie, espEsatta, erroreSerie, antisimmetrica, simmetrica,
  commutatore, commutano, trotter, erroreTrotter,
  PEZZO_A, PEZZO_B, GENERATORI,
} from '../../../public_html/js/widgets/evoluzione.js';
import { applica, prodotto, determinante, traccia } from '../../../public_html/js/widgets/operatori.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);
const scala = (M, k) => M.map(x => x * k);
const piu = (A, B) => A.map((x, i) => x + B[i]);
const IDENT = [1, 0, 0, 1];

describe('le due strade per e^M portano allo stesso posto', () => {
  test('la serie converge alla forma chiusa, su tutti i generatori e tempi', () => {
    for (const g of GENERATORI) {
      for (const t of [0.5, 1, 3, 6]) {
        assert.ok(erroreSerie(scala(g.M, t), 40) < 1e-9,
          `${g.id} a t=${t}: ${erroreSerie(scala(g.M, t), 40)}`);
      }
    }
  });

  test('e più termini si mettono, meno si sbaglia', () => {
    for (const g of GENERATORI) {
      const M = scala(g.M, 4);
      let prima = Infinity;
      for (const k of [8, 12, 16, 20, 30]) {
        const e = erroreSerie(M, k);
        assert.ok(e <= prima, `${g.id}: a ${k} termini l'errore sale`);
        prima = e;
      }
    }
  });

  test('e^0 è l\'identità, con zero termini o con mille', () => {
    for (const k of [0, 1, 20]) {
      const E = espSerie([0, 0, 0, 0], k);
      for (let i = 0; i < 4; i++) vicino(E[i], IDENT[i], 1e-15);
    }
  });

  test('e^M · e^(−M) = identità: l\'evoluzione si può sempre disfare', () => {
    /* è la reversibilità del livello K·6, scritta per il tempo */
    for (const g of GENERATORI) {
      const M = scala(g.M, 1.7);
      const p = prodotto(espEsatta(M), espEsatta(scala(M, -1)));
      for (let i = 0; i < 4; i++) vicino(p[i], IDENT[i], 1e-9);
    }
  });

  test('e^(A+B) = e^A · e^B quando i due commutano', () => {
    /* il caso facile: due stirature lungo gli stessi assi */
    const A = [0.4, 0, 0, -0.3], B = [1.1, 0, 0, 0.2];
    assert.ok(commutano(A, B));
    const insieme = espEsatta(piu(A, B));
    const separato = prodotto(espEsatta(A), espEsatta(B));
    for (let i = 0; i < 4; i++) vicino(insieme[i], separato[i], 1e-9);
  });
});

describe('che cosa fa l\'esponenziale alla freccia', () => {
  test('un generatore antisimmetrico dà una rotazione: la lunghezza non cambia', () => {
    const gira = GENERATORI.find(g => g.id === 'gira').M;
    assert.ok(antisimmetrica(gira));
    for (const t of [0.3, 1, 2.5, 7]) {
      const E = espEsatta(scala(gira, t));
      vicino(determinante(E), 1, 1e-12);
      for (const v of [[1, 0], [0.6, -0.8], [0, 1]]) {
        vicino(Math.hypot(...applica(E, v)), Math.hypot(...v), 1e-12);
      }
    }
  });

  test('e girare di t e poi di s è come girare di t+s', () => {
    const gira = GENERATORI.find(g => g.id === 'gira').M;
    const p = prodotto(espEsatta(scala(gira, 1.2)), espEsatta(scala(gira, 0.7)));
    const q = espEsatta(scala(gira, 1.9));
    for (let i = 0; i < 4; i++) vicino(p[i], q[i], 1e-9);
  });

  test('det(e^M) = e^(traccia di M), su ogni generatore', () => {
    /* traccia e determinante non dipendono dalla base (livello M·11):
       questa identità lega le due cose, e vale sempre */
    for (const g of GENERATORI) {
      for (const t of [0.4, 1, 2.2]) {
        const M = scala(g.M, t);
        vicino(determinante(espEsatta(M)), Math.exp(traccia(M)), 1e-9);
      }
    }
  });

  test('gli autovettori restano fermi: prendono solo un fattore', () => {
    /* è il motivo per cui gli stati stazionari sono stazionari */
    const stira = GENERATORI.find(g => g.id === 'stira').M;
    const E = espEsatta(scala(stira, 2));
    for (const [v, atteso] of [[[1, 0], Math.exp(1)], [[0, 1], Math.exp(-1)]]) {
      const fuori = applica(E, v);
      vicino(fuori[0], v[0] * atteso, 1e-9);
      vicino(fuori[1], v[1] * atteso, 1e-9);
    }
  });
});

describe('Trotter: quando i pezzi non vanno d\'accordo', () => {
  test('i due pezzi del gioco non commutano davvero', () => {
    assert.ok(!commutano(PEZZO_A, PEZZO_B));
    assert.ok(Math.max(...commutatore(PEZZO_A, PEZZO_B).map(Math.abs)) > 1);
  });

  test('e infatti spezzare in due sbaglia parecchio', () => {
    assert.ok(erroreTrotter(PEZZO_A, PEZZO_B, 1) > 1);
  });

  test('l\'errore scende come 1/n: raddoppiare i pezzetti lo dimezza', () => {
    for (const n of [40, 80, 160]) {
      const rapporto = erroreTrotter(PEZZO_A, PEZZO_B, n) / erroreTrotter(PEZZO_A, PEZZO_B, 2 * n);
      assert.ok(Math.abs(rapporto - 2) < 0.1, `n=${n}: rapporto ${rapporto}`);
    }
  });

  test('con abbastanza pezzetti ci si arriva, sempre', () => {
    /* e i pezzetti che servono crescono col tempo: a t = 3 con
       ventimila pezzetti si sta a 5·10⁻⁴, a t = 0,5 con gli stessi
       si sta cinquanta volte meglio */
    for (const t of [0.5, 1, 2, 3]) {
      const A = scala(PEZZO_A, t), B = scala(PEZZO_B, t);
      assert.ok(erroreTrotter(A, B, 20000) < 1e-3, `t=${t}`);
    }
  });

  test('più tempo da simulare, più pezzetti servono — in proporzione', () => {
    /* è il conto del costo: simulare il doppio del tempo con la
       stessa precisione relativa costa il doppio delle porte */
    const quanti = t => {
      const A = scala(PEZZO_A, t), B = scala(PEZZO_B, t);
      let n = 1;
      while (erroreTrotter(A, B, n) > 0.01 * t && n < 5000) n++;
      return n;
    };
    const uno = quanti(1), tre = quanti(3);
    assert.ok(tre > 2 * uno, `t=1 chiede ${uno} pezzetti, t=3 ne chiede ${tre}`);
    assert.ok(tre < 5 * uno, `crescita troppo brusca: ${uno} → ${tre}`);
  });

  test('e il cammino spezzato finisce comunque su una freccia sensata', () => {
    /* il prodotto di esponenziali resta invertibile: nessun pezzetto
       distrugge informazione */
    for (const n of [1, 5, 50]) {
      assert.ok(Math.abs(determinante(trotter(PEZZO_A, PEZZO_B, n))) > 1e-6);
    }
  });

  test('se i due pezzi commutano, un pezzetto solo basta', () => {
    const A = [0.4, 0, 0, -0.3], B = [1.1, 0, 0, 0.2];
    assert.ok(erroreTrotter(A, B, 1) < 1e-9);
  });
});

describe('le etichette dei generatori dicono il vero', () => {
  test('«gira» è antisimmetrico, «stira» e «storto» sono simmetrici', () => {
    assert.ok(antisimmetrica(GENERATORI[0].M));
    assert.ok(simmetrica(GENERATORI[1].M));
    assert.ok(simmetrica(GENERATORI[2].M));
  });

  test('«stira» ha traccia zero: allunga da una parte quanto stringe dall\'altra', () => {
    vicino(traccia(GENERATORI[1].M), 0, 1e-12);
    vicino(determinante(espEsatta(GENERATORI[1].M)), 1, 1e-12);
  });
});
