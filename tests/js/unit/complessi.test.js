/* Test del livello sui numeri complessi.
 *
 * Le due affermazioni forti del livello, controllate al numero:
 *
 *  1. moltiplicare due numeri complessi moltiplica le lunghezze e SOMMA
 *     gli angoli. Non «più o meno»: esattamente, e su tutta una griglia
 *     di casi. È la frase da cui poi si giustifica la scrittura e^(iθ);
 *
 *  2. le n radici n-esime dell'unità sommate danno ZERO, per ogni n > 1.
 *     Quello zero è l'interferenza distruttiva che nella DFT cancella
 *     tutte le frequenze sbagliate: se non fosse esatto, il picco del
 *     livello 16 sarebbe un'approssimazione fortunata. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  polare, rettangolare, moltiplica, somma, potenza,
  radiciUnita, sommaRadici, BERSAGLI_Z, QUANTE,
} from '../../../public_html/js/widgets/complessi.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);
const vicinoZ = (z, w, tol = 1e-9) => { vicino(z.re, w.re, tol); vicino(z.im, w.im, tol); };

describe('andare e tornare fra coordinate e forma polare', () => {
  test('polare e rettangolare si disfano a vicenda', () => {
    for (let r = 0.5; r <= 3; r += 0.25) {
      for (let g = 0; g < 360; g += 7) {
        const z = rettangolare(r, g);
        const p = polare(z);
        vicino(p.r, r, 1e-9);
        vicino(Math.cos((p.gradi * Math.PI) / 180), Math.cos((g * Math.PI) / 180), 1e-9);
        vicino(Math.sin((p.gradi * Math.PI) / 180), Math.sin((g * Math.PI) / 180), 1e-9);
      }
    }
  });
});

describe('moltiplicare è allungare e girare', () => {
  test('le lunghezze si moltiplicano, su tutta la griglia', () => {
    for (let r1 = 0.5; r1 <= 2.5; r1 += 0.5) {
      for (let r2 = 0.5; r2 <= 2.5; r2 += 0.5) {
        for (let g1 = 0; g1 < 360; g1 += 30) {
          for (let g2 = 0; g2 < 360; g2 += 30) {
            const p = moltiplica(rettangolare(r1, g1), rettangolare(r2, g2));
            vicino(polare(p).r, r1 * r2, 1e-9);
          }
        }
      }
    }
  });

  test('gli angoli si sommano, su tutta la griglia', () => {
    for (let g1 = 0; g1 < 360; g1 += 15) {
      for (let g2 = 0; g2 < 360; g2 += 15) {
        const p = moltiplica(rettangolare(1, g1), rettangolare(1, g2));
        const atteso = (g1 + g2) % 360;
        const trovato = polare(p).gradi;
        const scarto = Math.min(Math.abs(trovato - atteso), 360 - Math.abs(trovato - atteso));
        assert.ok(scarto < 1e-7, `${g1}° + ${g2}°: trovato ${trovato}°, atteso ${atteso}°`);
      }
    }
  });

  test('il prodotto svolto in coordinate È la formula di addizione', () => {
    /* (cos a + i sin a)(cos b + i sin b): la parte senza i deve venire
       cos(a+b), quella con la i deve venire sin(a+b). È il conto su cui
       poggia tutta la lezione. */
    for (let a = 0; a < 360; a += 11) {
      for (let b = 0; b < 360; b += 13) {
        const p = moltiplica(rettangolare(1, a), rettangolare(1, b));
        vicino(p.re, Math.cos(((a + b) * Math.PI) / 180), 1e-12);
        vicino(p.im, Math.sin(((a + b) * Math.PI) / 180), 1e-12);
      }
    }
  });

  test('moltiplicare per i gira di 90° e non allunga niente', () => {
    const i = { re: 0, im: 1 };
    for (let g = 0; g < 360; g += 15) {
      const z = rettangolare(1, g);
      vicinoZ(moltiplica(z, i), rettangolare(1, (g + 90) % 360), 1e-12);
    }
    vicinoZ(moltiplica(i, i), { re: -1, im: 0 }, 1e-12);   // i² = −1, dalla geometria
  });

  test('i bersagli del primo gioco sono raggiungibili con i cursori', () => {
    for (const b of BERSAGLI_Z) {
      let trovato = false;
      for (let r1 = 0.5; r1 <= 2.5 + 1e-9 && !trovato; r1 += 0.1) {
        for (let r2 = 0.5; r2 <= 2.5 + 1e-9 && !trovato; r2 += 0.1) {
          if (Math.abs(r1 * r2 - b.r) > 0.05) continue;
          for (let g1 = 0; g1 < 360 && !trovato; g1 += 15) {
            for (let g2 = 0; g2 < 360 && !trovato; g2 += 15) {
              if ((g1 + g2) % 360 === b.gradi) trovato = true;
            }
          }
        }
      }
      assert.ok(trovato, `il bersaglio (${b.r}, ${b.gradi}°) non è raggiungibile`);
    }
  });
});

describe('le radici dell\'unità', () => {
  test('ognuna, elevata alla n, dà davvero 1', () => {
    for (const n of [2, 3, 4, 5, 6, 7, 8, 12]) {
      for (const z of radiciUnita(n)) vicinoZ(potenza(z, n), { re: 1, im: 0 }, 1e-9);
    }
  });

  test('sono n, distinte, e stanno tutte sul cerchio di raggio 1', () => {
    for (const n of QUANTE) {
      const rad = radiciUnita(n);
      assert.equal(rad.length, n);
      for (const z of rad) vicino(Math.hypot(z.re, z.im), 1, 1e-12);
      const viste = new Set(rad.map(z => `${z.re.toFixed(9)}/${z.im.toFixed(9)}`));
      assert.equal(viste.size, n, `n=${n}: due radici coincidono`);
    }
  });

  test('sono equidistanti: fra una e la successiva ci sono sempre 360/n gradi', () => {
    for (const n of QUANTE) {
      const rad = radiciUnita(n);
      for (let k = 1; k < n; k++) vicino(rad[k].gradi - rad[k - 1].gradi, 360 / n, 1e-9);
    }
  });

  test('LA COSA: sommate fanno zero, per ogni n da 2 a 64', () => {
    for (let n = 2; n <= 64; n++) {
      const s = sommaRadici(n);
      assert.ok(Math.hypot(s.re, s.im) < 1e-12, `n=${n}: la somma vale ${s.re}, ${s.im}`);
    }
  });

  test('con n = 1 la somma NON è zero: è 1, e va bene così', () => {
    vicinoZ(sommaRadici(1), { re: 1, im: 0 }, 1e-12);
  });

  test('la somma parziale invece non è zero: lo zero arriva solo alla fine', () => {
    for (const n of [3, 4, 6, 8]) {
      const rad = radiciUnita(n);
      for (let q = 1; q < n; q++) {
        const p = rad.slice(0, q).reduce(somma, { re: 0, im: 0 });
        assert.ok(Math.hypot(p.re, p.im) > 1e-6, `n=${n}: già a ${q} frecce la somma è zero`);
      }
    }
  });

  test('con n = 2 le radici sono 1 e −1, con n = 4 sono 1, i, −1, −i', () => {
    const due = radiciUnita(2);
    vicinoZ(due[0], { re: 1, im: 0 }, 1e-12);
    vicinoZ(due[1], { re: -1, im: 0 }, 1e-12);
    const quattro = radiciUnita(4);
    vicinoZ(quattro[1], { re: 0, im: 1 }, 1e-12);
    vicinoZ(quattro[2], { re: -1, im: 0 }, 1e-12);
    vicinoZ(quattro[3], { re: 0, im: -1 }, 1e-12);
  });

  test('sono chiuse per prodotto: due radici moltiplicate danno ancora una radice', () => {
    /* è il fatto che al livello sui gruppi diventerà «formano un gruppo»:
       qui basta vedere che il prodotto non esce mai dall'insieme */
    for (const n of QUANTE) {
      const rad = radiciUnita(n);
      for (const z of rad) {
        for (const w of rad) {
          const p = moltiplica(z, w);
          const dentro = rad.some(u => Math.hypot(u.re - p.re, u.im - p.im) < 1e-9);
          assert.ok(dentro, `n=${n}: il prodotto è uscito dall'insieme`);
        }
      }
    }
  });
});
