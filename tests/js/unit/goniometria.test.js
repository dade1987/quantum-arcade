/* Test del livello di goniometria.
 *
 * Il livello afferma tre cose forti, e sono tutte controllabili:
 *
 *  1. le formule di addizione danno lo STESSO numero del girare davvero
 *     di a+b — se così non fosse, la frase «due giri sono un giro solo»
 *     sarebbe solo bella;
 *  2. la duplicazione è il caso b = a, non una formula in più;
 *  3. il conto di Grover come rotazione (angolo (2k+1)θ, probabilità
 *     sin² di quell'angolo, ottimo a π/4·√N) è coerente: in particolare
 *     su N = 4 basta UN giro e la probabilità è esattamente 1. Quello è
 *     il caso che il livello 11 mostra, e qui si verifica al numero. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  pitagora, addizione, duplicazione, NOTEVOLI, BERSAGLI,
  angoloDiGrover, angoloDopo, probabilitaDopo, giriOttimali, ELENCHI,
} from '../../../public_html/js/widgets/goniometria.js';

const vicino = (a, b, tol = 1e-12) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);

describe('l\'identità fondamentale', () => {
  test('sin² + cos² fa 1 su qualunque angolo, non solo su quelli notevoli', () => {
    for (let g = -720; g <= 720; g += 0.5) vicino(pitagora(g), 1, 1e-12);
  });
});

describe('le formule di addizione', () => {
  test('formula e giro diretto danno lo stesso numero, su tutta la griglia', () => {
    for (let a = -360; a <= 360; a += 5) {
      for (let b = -360; b <= 360; b += 5) {
        const v = addizione(a, b);
        vicino(v.cosFormula, v.cosDiretto, 1e-12);
        vicino(v.sinFormula, v.sinDiretto, 1e-12);
      }
    }
  });

  test('i casi che la lezione cita vengono i numeri giusti', () => {
    // 30 + 45 = 75
    const v = addizione(30, 45);
    vicino(v.cosFormula, Math.cos(Math.PI * 75 / 180), 1e-12);
    // 45 + 45 = 90: il coseno deve annullarsi
    vicino(addizione(45, 45).cosFormula, 0, 1e-12);
    // 60 + 120 = 180: il seno si annulla, il coseno vale −1
    vicino(addizione(60, 120).sinFormula, 0, 1e-12);
    vicino(addizione(60, 120).cosFormula, -1, 1e-12);
  });

  test('sommare zero non cambia niente, e l\'ordine non conta', () => {
    for (const g of NOTEVOLI) {
      vicino(addizione(g, 0).cosFormula, Math.cos(Math.PI * g / 180), 1e-12);
      vicino(addizione(g, 40).cosFormula, addizione(40, g).cosFormula, 1e-12);
    }
  });
});

describe('la duplicazione è solo il caso b = a', () => {
  test('sin 2a e cos 2a coincidono con la formula di addizione con b = a', () => {
    for (let a = -180; a <= 180; a += 1) {
      const d = duplicazione(a), s = addizione(a, a);
      vicino(d.sin2, s.sinFormula, 1e-12);
      vicino(d.cos2, s.cosFormula, 1e-12);
    }
  });

  test('le due scritture di cos 2a sono la stessa cosa', () => {
    for (let a = -180; a <= 180; a += 1) vicino(duplicazione(a).cos2, duplicazione(a).cosAlt, 1e-12);
  });
});

describe('i bersagli del primo gioco si possono davvero centrare', () => {
  test('ogni bersaglio è somma di due angoli fra quelli dei cursori (passo 15°, 0–180)', () => {
    for (const b of BERSAGLI) {
      let trovato = false;
      for (let a = 0; a <= 180 && !trovato; a += 15) {
        for (let c = 0; c <= 180 && !trovato; c += 15) if (a + c === b) trovato = true;
      }
      assert.ok(trovato, `il bersaglio ${b}° non è raggiungibile con i cursori`);
    }
  });
});

describe('Grover come rotazione', () => {
  test('su 4 risposte un solo giro porta al 100%: è il caso del livello 11', () => {
    vicino(angoloDiGrover(4), 30, 1e-12);
    assert.equal(giriOttimali(4), 1);
    vicino(angoloDopo(4, 1), 90, 1e-12);
    vicino(probabilitaDopo(4, 1), 1, 1e-12);
  });

  test('la probabilità è sin² dell\'angolo, e all\'inizio vale esattamente 1/N', () => {
    for (const { N } of ELENCHI) vicino(probabilitaDopo(N, 0), 1 / N, 1e-12);
  });

  test('il numero di giri consigliato è quello che porta più vicino a 90°', () => {
    for (const { N } of ELENCHI) {
      const k = giriOttimali(N);
      const mio = Math.abs(90 - angoloDopo(N, k));
      for (const altro of [k - 1, k + 1]) {
        if (altro < 0) continue;
        assert.ok(mio <= Math.abs(90 - angoloDopo(N, altro)) + 1e-9,
          `N=${N}: ${altro} giri centrano meglio di ${k}`);
      }
    }
  });

  test('oltre l\'ottimo la probabilità SCENDE: è la cosa che il gioco deve far vedere', () => {
    for (const { N } of ELENCHI) {
      const k = giriOttimali(N);
      assert.ok(probabilitaDopo(N, k + 1) < probabilitaDopo(N, k) + 1e-12,
        `N=${N}: continuare a girare non peggiora, e invece dovrebbe`);
    }
  });

  test('i giri consigliati crescono come √N, non come N', () => {
    /* è la promessa del livello 11: passando da 16 a 256 risposte (16 volte
       tante) i giri devono quadruplicare, non moltiplicarsi per 16 */
    const g16 = giriOttimali(16), g256 = giriOttimali(256);
    assert.ok(g256 / g16 > 3.2 && g256 / g16 < 4.8, `rapporto ${g256 / g16}, atteso ~4`);
    for (const N of [64, 256, 1024, 4096]) {
      const atteso = (Math.PI / 4) * Math.sqrt(N);
      assert.ok(Math.abs(giriOttimali(N) - atteso) <= 1, `N=${N}: ${giriOttimali(N)} lontano da ${atteso.toFixed(1)}`);
    }
  });
});
