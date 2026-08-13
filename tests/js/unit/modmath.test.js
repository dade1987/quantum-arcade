/* Test dei tre mini-giochi dell'orologio modulare (livello 0·5).
 *
 * Qui non si collauda il disegno: si collauda che il gioco dica il VERO.
 * Sono conti che lo studente rifà a mano sul quadrante — se il gioco
 * sbagliasse un resto o un massimo comune divisore, insegnerebbe una cosa
 * falsa con l'autorevolezza di un esperimento, ed è il tipo di errore che
 * nessuno segnala perché nessuno immagina di doverlo verificare. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { divisione, piastrelle, basiValide } from '../../../public_html/js/widgets/modmath.js';
import { gcd, periodOf } from '../../../public_html/js/core/qsim.js';

describe("l'orologio: la divisione con resto", () => {
  test('17 su un quadrante da 7 fa due giri e tre passi', () => {
    assert.deepEqual(divisione(17, 7), { q: 2, r: 3 });
  });

  test('un multiplo esatto torna sullo zero senza avanzi', () => {
    assert.deepEqual(divisione(48, 12), { q: 4, r: 0 });
  });

  test('un numero più piccolo del quadrante non fa nemmeno un giro', () => {
    assert.deepEqual(divisione(5, 7), { q: 0, r: 5 });
  });

  /* La proprietà che il gioco mostra scritta sotto la lancetta: n = q·N + r,
     con il resto sempre dentro il quadrante. Vale per ogni numero che lo
     slider può produrre, non solo per i tre esempi qui sopra. */
  test('per ogni numero dello slider vale n = q·N + r, con 0 ≤ r < N', () => {
    for (const N of [7, 10, 12]) {
      for (let n = 0; n <= 48; n++) {
        const { q, r } = divisione(n, N);
        assert.equal(q * N + r, n);
        assert.ok(r >= 0 && r < N, `resto fuori dal quadrante: ${n} mod ${N} = ${r}`);
      }
    }
  });

  test('i numeri che finiscono nella stessa ora distano esattamente N', () => {
    const N = 7;
    const stessaOra = [];
    for (let n = 0; n <= 48; n++) if (divisione(n, N).r === 3) stessaOra.push(n);
    assert.deepEqual(stessaOra, [3, 10, 17, 24, 31, 38, 45]);
  });
});

describe('il pavimento di Euclide', () => {
  test("l'ultimo quadrato posato ha per lato il massimo comune divisore", () => {
    for (let a = 1; a <= 60; a++) {
      for (let b = 1; b <= 60; b++) {
        const tagli = piastrelle(a, b);
        assert.equal(tagli[tagli.length - 1].s, gcd(a, b), `MCD(${a}, ${b})`);
      }
    }
  });

  test('i quadrati coprono il pavimento per intero, senza buchi né sovrapposizioni', () => {
    for (const [a, b] of [[48, 18], [35, 15], [40, 24], [21, 13], [36, 27]]) {
      const tagli = piastrelle(a, b);
      const area = tagli.reduce((s, q) => s + q.s * q.s, 0);
      assert.equal(area, a * b, `area coperta di ${a}×${b}`);
      for (const q of tagli) {
        assert.ok(q.x >= 0 && q.y >= 0 && q.x + q.s <= a && q.y + q.s <= b,
          `quadrato fuori dal pavimento in ${a}×${b}`);
      }
    }
  });

  test('ogni quadrato è largo quanto il lato corto di quello che resta: mai più grande', () => {
    const tagli = piastrelle(48, 18);
    assert.deepEqual(tagli.map(q => q.s), [18, 18, 12, 6, 6]);
    // 48 = 2×18 + 12 · 18 = 1×12 + 6 · 12 = 2×6 → MCD = 6
    assert.equal(gcd(48, 18), 6);
  });

  test('le coppie proposte dal gioco finiscono in pochi tagli: si guardano tutte', () => {
    for (const [a, b] of [[48, 18], [35, 15], [40, 24], [21, 13], [36, 27]]) {
      assert.ok(piastrelle(a, b).length <= 12, `${a}×${b} richiede troppi tagli per essere giocabile`);
    }
  });
});

describe('il ritmo che torna: il periodo di a^x mod N', () => {
  test('come moltiplicatori si offrono solo numeri senza fattori in comune con N', () => {
    assert.deepEqual(basiValide(15), [2, 4, 7, 8, 11, 13, 14]);
    for (const N of [9, 15, 21]) {
      for (const a of basiValide(N)) assert.equal(gcd(a, N), 1);
    }
  });

  /* È la ragione per cui la scelta è ristretta: con un moltiplicatore che
     divide N la passeggiata non ripassa MAI dall'1, il disegno non si chiude
     e la missione resterebbe impossibile. */
  test("con quei moltiplicatori la passeggiata torna sempre sull'1, in al più N passi", () => {
    for (const N of [9, 15, 21]) {
      for (const a of basiValide(N)) {
        const r = periodOf(a, N);
        assert.ok(r !== null && r >= 1 && r <= N, `periodo di ${a}^x mod ${N}`);
        let x = 1;
        for (let i = 0; i < r; i++) x = (x * a) % N;
        assert.equal(x, 1, `${a}^${r} mod ${N} dovrebbe tornare 1`);
      }
    }
  });

  test('i primi sei moltiplicatori offerti bastano per due ritmi diversi fra loro', () => {
    for (const N of [9, 15, 21]) {
      const periodi = new Set(basiValide(N).slice(0, 6).map(a => periodOf(a, N)));
      assert.ok(periodi.size >= 2, `su N = ${N} il gioco offre un solo ritmo`);
    }
  });

  test("il ritmo di 7 su un quadrante da 15 è 4: è l'esempio del livello di Shor", () => {
    assert.equal(periodOf(7, 15), 4);
  });
});
