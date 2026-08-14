/* Test del livello su base e dimensione.
 *
 * Le affermazioni che il livello fa, e che qui si controllano:
 *
 *  1. due frecce non in linea raggiungono DAVVERO qualunque punto del
 *     piano — non «quasi tutti»: si verifica ricostruendo migliaia di
 *     bersagli a partire dalle coordinate calcolate;
 *  2. due frecce in linea non ne raggiungono nessuno fuori dalla retta:
 *     il muro del gioco è un muro vero, e il gioco lo dice invece di
 *     lasciar girare a vuoto;
 *  3. la dimensione non dipende dalla base: qualunque base si usi, i
 *     numeri cambiano ma il punto ricostruito è lo stesso;
 *  4. in una base ortonormale le coordinate sono i prodotti scalari —
 *     cioè le «ombre» del livello 0·9. È il ponte con la regola di Born. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  combina, incrocio, dipendenti, rango, eBase, coordinate,
  perProdottoScalare, ortonormale, dimensioneQubit,
  BASI, BERSAGLI_B, COLLEZIONI,
} from '../../../public_html/js/widgets/spazi.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);
const vicinoV = (v, w, tol = 1e-9) => { vicino(v[0], w[0], tol); vicino(v[1], w[1], tol); };

describe('indipendenza e rango', () => {
  test('due frecce in linea sono dipendenti, due no', () => {
    assert.ok(dipendenti([1, 1], [2, 2]));
    assert.ok(dipendenti([1, 1], [-3, -3]));
    assert.ok(dipendenti([1, 1], [0, 0]));       // la freccia nulla è in linea con tutto
    assert.ok(!dipendenti([1, 0], [0, 1]));
    assert.ok(!dipendenti([1, 1], [1, -1]));
  });

  test('il rango conta le direzioni, non le frecce', () => {
    assert.equal(rango([]), 0);
    assert.equal(rango([[0, 0]]), 0);
    assert.equal(rango([[1, 2]]), 1);
    assert.equal(rango([[1, 1], [2, 2], [-5, -5]]), 1);
    assert.equal(rango([[1, 0], [0, 1]]), 2);
    assert.equal(rango([[1, 0], [2, 0], [0, 1], [1, 2]]), 2);
  });

  test('le basi dichiarate sono basi, tranne quella che deve fallire', () => {
    for (const b of BASI) {
      if (b.id === 'finta') assert.ok(!eBase(b.v), 'la base «finta» non dovrebbe essere una base');
      else assert.ok(eBase(b.v), `${b.id} dovrebbe essere una base`);
    }
  });
});

describe('con una base ci si arriva sempre', () => {
  test('le coordinate calcolate ricostruiscono il bersaglio, su tutte le basi vere', () => {
    for (const b of BASI.filter(x => eBase(x.v))) {
      for (let x = -3; x <= 3; x += 0.25) {
        for (let y = -3; y <= 3; y += 0.25) {
          const c = coordinate(b.v, [x, y]);
          assert.ok(c, `${b.id}: coordinate mancanti`);
          vicinoV(combina(b.v, c), [x, y], 1e-9);
        }
      }
    }
  });

  test('i bersagli del gioco sono raggiungibili entro la corsa dei cursori (±3)', () => {
    for (const b of BASI.filter(x => eBase(x.v))) {
      for (const bersaglio of BERSAGLI_B) {
        const c = coordinate(b.v, bersaglio);
        assert.ok(Math.abs(c[0]) <= 3 + 1e-9 && Math.abs(c[1]) <= 3 + 1e-9,
          `${b.id} → (${bersaglio}): servono ${c[0].toFixed(2)} e ${c[1].toFixed(2)}, fuori dai cursori`);
      }
    }
  });

  test('e la stessa freccia ha coordinate DIVERSE in basi diverse: cambia il nome, non il punto', () => {
    const punto = [2, 1];
    const lette = BASI.filter(x => eBase(x.v)).map(b => coordinate(b.v, punto));
    for (const c of lette) vicinoV(combina(BASI.filter(x => eBase(x.v))[lette.indexOf(c)].v, c), punto, 1e-9);
    // almeno due letture devono essere diverse fra loro, altrimenti la frase è vuota
    const diverse = lette.some(c => Math.abs(c[0] - lette[0][0]) > 1e-6 || Math.abs(c[1] - lette[0][1]) > 1e-6);
    assert.ok(diverse, 'tutte le basi danno le stesse coordinate: il livello direbbe una cosa falsa');
  });
});

describe('senza una base, il muro è un muro', () => {
  test('con due frecce in linea si resta sulla retta, comunque si allunghino', () => {
    const finta = BASI.find(b => b.id === 'finta').v;
    assert.equal(coordinate(finta, [2, 1]), null);
    for (let a = -5; a <= 5; a += 0.5) {
      for (let c = -5; c <= 5; c += 0.5) {
        const p = combina(finta, [a, c]);
        vicino(p[0], p[1], 1e-9);          // resta sempre sulla retta y = x
      }
    }
  });

  test('nessuno dei bersagli del gioco sta su quella retta: il muro non è aggirabile per caso', () => {
    for (const b of BERSAGLI_B) assert.ok(Math.abs(b[0] - b[1]) > 1e-9, `il bersaglio (${b}) sarebbe raggiungibile`);
  });
});

describe('base ortonormale: le coordinate sono le ombre', () => {
  test('gli assi e la base girata sono ortonormali, la storta no', () => {
    assert.ok(ortonormale(BASI[0].v));
    assert.ok(ortonormale(BASI[1].v));
    assert.ok(!ortonormale(BASI[2].v));
  });

  test('su una base ortonormale il prodotto scalare dà le stesse coordinate del conto generale', () => {
    for (const b of [BASI[0].v, BASI[1].v]) {
      for (let x = -3; x <= 3; x += 0.5) {
        for (let y = -3; y <= 3; y += 0.5) {
          vicinoV(perProdottoScalare(b, [x, y]), coordinate(b, [x, y]), 1e-9);
        }
      }
    }
  });

  test('e su una base NON ortonormale i due conti divergono: la scorciatoia non vale sempre', () => {
    const storta = BASI[2].v;
    const p = [2, 1];
    const a = perProdottoScalare(storta, p), b = coordinate(storta, p);
    assert.ok(Math.abs(a[0] - b[0]) > 1e-6 || Math.abs(a[1] - b[1]) > 1e-6);
  });

  test('su base ortonormale vale Pitagora: la somma dei quadrati delle coordinate è la lunghezza²', () => {
    for (const b of [BASI[0].v, BASI[1].v]) {
      for (let x = -3; x <= 3; x += 0.5) {
        for (let y = -3; y <= 3; y += 0.5) {
          const c = coordinate(b, [x, y]);
          vicino(c[0] ** 2 + c[1] ** 2, x * x + y * y, 1e-9);
        }
      }
    }
  });
});

describe('le collezioni del secondo gioco', () => {
  test('ognuna si comporta come la lezione promette', () => {
    const [dueBuone, inLinea, quattro] = COLLEZIONI;
    assert.equal(rango(dueBuone.v), 2);
    assert.equal(rango(inLinea.v), 1, 'la collezione «tutte in linea» dovrebbe coprire solo una retta');
    assert.equal(rango(quattro.v), 2);
  });

  test('in ogni collezione con rango 2 esiste una coppia che basta da sola', () => {
    for (const c of COLLEZIONI.filter(x => rango(x.v) === 2)) {
      let trovata = false;
      for (let i = 0; i < c.v.length && !trovata; i++) {
        for (let j = i + 1; j < c.v.length && !trovata; j++) {
          if (eBase([c.v[i], c.v[j]])) trovata = true;
        }
      }
      assert.ok(trovata, `${c.id}: la missione non si può vincere`);
    }
  });

  test('nella collezione tutta in linea NESSUNA coppia è una base: il gioco non promette l\'impossibile', () => {
    const c = COLLEZIONI.find(x => x.id === 'tutte-in-linea').v;
    for (let i = 0; i < c.length; i++) {
      for (let j = i + 1; j < c.length; j++) assert.ok(!eBase([c[i], c[j]]));
    }
  });
});

describe('la dimensione di n qubit', () => {
  test('è 2^n, non 2n — ed è la frase su cui poggia tutto il corso', () => {
    assert.equal(dimensioneQubit(1), 2);
    assert.equal(dimensioneQubit(2), 4);
    assert.equal(dimensioneQubit(10), 1024);
    assert.equal(dimensioneQubit(50), 2 ** 50);
    for (let n = 3; n <= 20; n++) assert.ok(dimensioneQubit(n) > 2 * n, `n=${n}: 2^n non supera 2n`);
  });

  test('ogni qubit in più RADDOPPIA la dimensione', () => {
    for (let n = 0; n < 30; n++) assert.equal(dimensioneQubit(n + 1), 2 * dimensioneQubit(n));
  });
});
