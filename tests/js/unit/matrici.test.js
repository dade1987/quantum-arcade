/* Test della matematica del livello 0·6 (le matrici come macchine).
 *
 * Il livello promette due cose precise: che le colonne della matrice sono i
 * posti dove finiscono le due frecce di base, e che X, Z, H non cambiano mai
 * la lunghezza. Se una delle due fosse falsa nel codice, il gioco resterebbe
 * bello e insegnerebbe l'opposto di quello che c'è scritto sotto. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { M, applica, componi, lunghezza, unitaria, PORTE, SFIDE, PUZZLE } from '../../../public_html/js/widgets/matrici.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);
const vicini = (u, v, tol = 1e-9) => u.forEach((x, i) => vicino(x, v[i], tol));

describe('la macchina: matrice per freccia', () => {
  test("l'identità lascia ogni freccia dov'è", () => {
    const I = M(1, 0, 0, 1);
    for (const v of [[1, 0], [0, 1], [0.3, -1.7], [2, 2]]) vicini(applica(I, v), v);
  });

  test('le colonne sono i posti dove finiscono le due frecce di base', () => {
    const m = M(2, -1, 0.5, 3);
    vicini(applica(m, [1, 0]), [m[0][0], m[1][0]]);   // prima colonna
    vicini(applica(m, [0, 1]), [m[0][1], m[1][1]]);   // seconda colonna
  });

  /* La frase del gioco: «sapendo dove finiscono le due frecce di base, sai
     dove finisce qualunque altra freccia». Qui viene controllata davvero. */
  test('da dove finiscono le due frecce di base si ricava ogni altra freccia', () => {
    const m = M(0.7, -1.2, 1.5, 0.4);
    const c1 = applica(m, [1, 0]), c2 = applica(m, [0, 1]);
    for (const [x, y] of [[3, 2], [-1, 0.5], [0, 0], [1.4, -2.6]]) {
      vicini(applica(m, [x, y]), [c1[0] * x + c2[0] * y, c1[1] * x + c2[1] * y], 1e-12);
    }
  });
});

describe('due macchine di fila', () => {
  test('comporre le matrici dà lo stesso risultato di applicarle una dopo l\'altra', () => {
    const A = M(0, 1, 1, 0), B = M(1, 0, 0, -1);
    for (const v of [[1, 0], [0, 1], [0.6, -0.8]]) {
      vicini(applica(componi(A, B), v), applica(A, applica(B, v)));
    }
  });

  test("l'ordine conta: X·Z non è Z·X", () => {
    const xz = componi(PORTE.X, PORTE.Z), zx = componi(PORTE.Z, PORTE.X);
    assert.notDeepEqual(xz, zx);
    // e la differenza è proprio un segno: sono l'una l'opposta dell'altra
    xz.forEach((r, i) => r.forEach((x, j) => vicino(x, -zx[i][j])));
  });

  test('H·Z·H = X: la scoperta che il puzzle fa fare a mano', () => {
    const hzh = componi(PORTE.H, componi(PORTE.Z, PORTE.H));
    hzh.forEach((r, i) => r.forEach((x, j) => vicino(x, PORTE.X[i][j], 1e-12)));
  });

  test('H applicata due volte riporta allo stato di partenza', () => {
    const hh = componi(PORTE.H, PORTE.H);
    hh.forEach((r, i) => r.forEach((x, j) => vicino(x, i === j ? 1 : 0, 1e-12)));
  });
});

describe('unitarie: le macchine che non cambiano le lunghezze', () => {
  test('X, Z e H sono unitarie', () => {
    for (const [nome, m] of Object.entries(PORTE)) assert.ok(unitaria(m), `${nome} non risulta unitaria`);
  });

  test('una macchina che raddoppia non è unitaria', () => {
    assert.ok(!unitaria(M(2, 0, 0, 2)));
    assert.ok(!unitaria(M(1, 0, 0, 0)));       // schiaccia tutto su una riga
    assert.ok(!unitaria(M(1, 1, 0, 1)));       // colonne non perpendicolari
  });

  /* La promessa del cerchio: qualunque porta si prema, la freccia dello stato
     resta lunga 1, quindi le probabilità continuano a fare 100%. */
  test('applicando le porte in qualunque ordine la lunghezza resta 1', () => {
    const nomi = Object.keys(PORTE);
    for (const a of nomi) for (const b of nomi) for (const c of nomi) {
      let v = [1, 0];
      for (const n of [a, b, c]) v = applica(PORTE[n], v);
      vicino(lunghezza(v), 1, 1e-12);
      vicino(v[0] * v[0] + v[1] * v[1], 1, 1e-12);   // le due probabilità fanno 100%
    }
  });
});

describe('le sfide e i puzzle sono davvero risolvibili', () => {
  test('ogni sfida delle manopole si centra con valori che le manopole possono dare', () => {
    for (const s of SFIDE) {
      for (const v of [...s.e1, ...s.e2]) {
        assert.ok(v >= -2 && v <= 2, `${s.id}: la manopola non arriva a ${v}`);
        vicino(Math.round(v * 10) / 10, v);   // passo dello slider: 0,1
      }
    }
  });

  test('ogni puzzle si risolve con al più tre porte', () => {
    const nomi = Object.keys(PORTE);
    for (const pz of PUZZLE) {
      let trovata = null;
      const cerca = (v, mosse) => {
        if (trovata) return;
        if (Math.hypot(v[0] - pz.mira[0], v[1] - pz.mira[1]) < 0.02) { trovata = mosse; return; }
        if (mosse.length === 3) return;
        for (const n of nomi) cerca(applica(PORTE[n], v), [...mosse, n]);
      };
      cerca([1, 0], []);
      assert.ok(trovata, `il puzzle "${pz.id}" non è risolvibile in tre mosse`);
    }
  });
});
