/* Test del livello sulle equazioni di secondo grado.
 *
 * Il livello promette due cose, e sono entrambe verificabili con dei numeri:
 *
 *  1. il DELTA dice quante soluzioni ci sono — non «di solito», sempre;
 *  2. il quadrato a cui manca un angolo (al-Khwārizmī) non è un disegnino
 *     suggestivo: dà ESATTAMENTE le stesse soluzioni della formula.
 *
 * Se il punto 2 fosse falso anche solo su un caso, il gioco starebbe
 * insegnando una scorciatoia sbagliata con l'aria di una dimostrazione. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { delta, radici, vertice, completamento, SFIDE_P, QUADRATI } from '../../../public_html/js/widgets/secondogrado.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);

describe('il delta conta le soluzioni', () => {
  test('positivo → due, zero → una, negativo → nessuna', () => {
    assert.equal(radici(1, 0, -4).length, 2);   // delta = 16
    assert.equal(radici(1, -2, 1).length, 1);   // delta = 0, x = 1 doppia
    assert.equal(radici(1, 0, 1).length, 0);    // delta = -4
  });

  test('su mille equazioni a caso il segno del delta e il numero di radici combaciano', () => {
    let seme = 12345;
    const rnd = () => { seme = (seme * 1103515245 + 12345) % 2147483648; return seme / 2147483648; };
    for (let i = 0; i < 1000; i++) {
      const a = (rnd() - 0.5) * 8 || 1, b = (rnd() - 0.5) * 20, c = (rnd() - 0.5) * 20;
      const d = delta(a, b, c);
      const atteso = d > 1e-9 ? 2 : d < -1e-9 ? 0 : 1;
      assert.equal(radici(a, b, c).length, atteso, `a=${a} b=${b} c=${c} delta=${d}`);
    }
  });

  test('le radici trovate annullano davvero il polinomio', () => {
    for (const [a, b, c] of [[1, 0, -4], [2, -7, 3], [-1, 5, -6], [0.5, 2, -6], [3, 12, 12]]) {
      for (const x of radici(a, b, c)) vicino(a * x * x + b * x + c, 0, 1e-9);
    }
  });

  test('primo grado travestito: se a è zero resta una sola soluzione', () => {
    assert.deepEqual(radici(0, 2, -6), [3]);
    assert.deepEqual(radici(0, 0, 5), []);
  });
});

describe('il vertice sta a metà fra le due radici', () => {
  test('la media delle radici è la x del vertice', () => {
    for (const [a, b, c] of [[1, -6, 8], [2, 4, -6], [-1, 2, 3], [0.5, -3, 2.5]]) {
      const r = radici(a, b, c);
      assert.equal(r.length, 2);
      vicino(vertice(a, b, c).x, (r[0] + r[1]) / 2);
    }
  });

  test('quando il delta è zero il vertice È la radice: la parabola tocca e basta', () => {
    for (const [a, b] of [[1, -4], [3, 6], [-2, 8]]) {
      const c = (b * b) / (4 * a);           // delta = 0 per costruzione
      const r = radici(a, b, c);
      assert.equal(r.length, 1);
      vicino(vertice(a, b, c).y, 0);
      vicino(vertice(a, b, c).x, r[0]);
    }
  });
});

describe('il quadrato a cui manca un angolo', () => {
  test('i pezzi del disegno sono quelli che la lezione dice', () => {
    const co = completamento(10, 39);        // l'equazione di al-Khwārizmī
    assert.equal(co.meta, 5);                // i dieci nani in due file da cinque
    assert.equal(co.pezzo, 25);              // la mattonella dell'angolo, 5×5
    assert.equal(co.dopo, 64);               // 39 + 25, aggiunto a tutti e due i piatti
    assert.equal(co.radice, 8);              // il lato del quadrato completo
    assert.deepEqual(co.soluzioni, [-13, 3]);
  });

  test('il disegno dà le STESSE soluzioni della formula, su tutte le equazioni del gioco', () => {
    for (const { b, c } of QUADRATI) {
      const dal_disegno = completamento(b, c).soluzioni;
      const dalla_formula = radici(1, b, -c);          // x² + bx = c → x² + bx − c = 0
      assert.equal(dal_disegno.length, dalla_formula.length);
      dal_disegno.forEach((x, i) => vicino(x, dalla_formula[i]));
    }
  });

  test('e coincidono anche fuori dalle equazioni scelte, comprese quelle senza soluzione', () => {
    for (let b = -12; b <= 12; b += 0.5) {
      for (let c = -20; c <= 40; c += 0.5) {
        const dal_disegno = completamento(b, c).soluzioni;
        const dalla_formula = radici(1, b, -c);
        assert.equal(dal_disegno.length, dalla_formula.length, `b=${b} c=${c}`);
        dal_disegno.forEach((x, i) => vicino(x, dalla_formula[i], 1e-8));
      }
    }
  });

  test('quando manca troppo per completare il quadrato non c\'è soluzione, e il delta lo conferma', () => {
    const co = completamento(4, -10);        // x² + 4x = −10
    assert.equal(co.soluzioni.length, 0);
    assert.ok(delta(1, 4, 10) < 0);
  });

  test('le tre equazioni proposte hanno una soluzione intera: i conti sul lato restano leggibili', () => {
    for (const { b, c } of QUADRATI) {
      const co = completamento(b, c);
      assert.ok(Number.isInteger(co.meta), `b=${b}: metà non intera`);
      assert.ok(Number.isInteger(co.radice), `b=${b} c=${c}: radice non intera`);
      assert.ok(co.soluzioni.every(Number.isInteger), `b=${b} c=${c}: soluzioni non intere`);
    }
  });
});

describe('le sfide del primo gioco sono tutte raggiungibili', () => {
  test('per ognuna esiste una terna (a,b,c) fra quelle dei cursori che la soddisfa', () => {
    const trovate = new Set();
    for (let a = -2; a <= 2; a += 0.1) {
      if (Math.abs(a) < 0.1) continue;
      for (let b = -6; b <= 6; b += 0.5) {
        for (let c = -6; c <= 6; c += 0.5) {
          for (const s of SFIDE_P) if (s.ok(a, b, c)) trovate.add(s.id);
        }
      }
    }
    for (const s of SFIDE_P) assert.ok(trovate.has(s.id), `sfida «${s.id}» impossibile da vincere`);
  });

  test('le tre sfide si escludono a vicenda: nessuna terna ne vince due insieme', () => {
    for (let a = -2; a <= 2; a += 0.25) {
      if (Math.abs(a) < 0.1) continue;
      for (let b = -6; b <= 6; b += 0.5) {
        for (let c = -6; c <= 6; c += 0.5) {
          const vinte = SFIDE_P.filter(s => s.ok(a, b, c)).length;
          assert.ok(vinte <= 1, `a=${a} b=${b} c=${c} vince ${vinte} sfide`);
        }
      }
    }
  });
});
