/* Test del livello sul cambio di base.
 *
 * Quattro affermazioni, e tutte e quattro il corso le usa da prima:
 *
 *  1. lo stesso stato può essere «testa o croce» con un righello e
 *     «certo» con un altro. È la frase più ripetuta della
 *     quantistica, e qui è un conto;
 *
 *  2. la porta di Hadamard È il cambio di righello: i numeri che
 *     tira fuori, al quadrato, sono le probabilità di misurare
 *     nella base a 45°;
 *
 *  3. cambiare base non cambia le lunghezze né gli angoli. Se le
 *     cambiasse, le probabilità non farebbero più 1;
 *
 *  4. nella base degli autovettori una matrice diventa diagonale, e
 *     lì A^n si calcola elevando due numeri. Il test confronta il
 *     conto svelto con quello a forza bruta.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  versori, coordinateIn, matriceDiCambio, nellaBase, misuraIn,
  HADAMARD, BASE_Z, BASE_X, angoloDiagonalizzante, fuoriDiagonale,
  autovaloriSimmetrica, potenza, potenzaDiagonalizzando, MACCHINE_S, STATI,
  applica, prodotto, determinante, traccia, unitaria,
} from '../../../public_html/js/widgets/base.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);
const R2 = Math.SQRT1_2;

describe('i righelli e le coordinate', () => {
  test('i due versori sono lunghi 1 e perpendicolari, a qualunque inclinazione', () => {
    for (let g = 0; g < 180; g += 7) {
      const [e1, e2] = versori(g);
      vicino(Math.hypot(...e1), 1, 1e-12);
      vicino(Math.hypot(...e2), 1, 1e-12);
      vicino(e1[0] * e2[0] + e1[1] * e2[1], 0, 1e-12);
    }
  });

  test('col righello dritto le coordinate sono il vettore stesso', () => {
    for (const s of STATI) {
      const c = coordinateIn(BASE_Z, s.v);
      vicino(c[0], s.v[0], 1e-12);
      vicino(c[1], s.v[1], 1e-12);
    }
  });

  test('cambiare righello non cambia la lunghezza', () => {
    /* se la cambiasse, le probabilità non farebbero più 1 e tutta
       la quantistica del corso salterebbe */
    for (const s of STATI) {
      for (let g = 0; g <= 90; g += 5) {
        const c = coordinateIn(g, s.v);
        vicino(Math.hypot(...c), Math.hypot(...s.v), 1e-12);
      }
    }
  });

  test('e non cambia nemmeno gli angoli fra due frecce', () => {
    const scal = (a, b) => a[0] * b[0] + a[1] * b[1];
    for (let g = 0; g <= 90; g += 11) {
      for (const a of STATI) {
        for (const b of STATI) {
          vicino(scal(coordinateIn(g, a.v), coordinateIn(g, b.v)), scal(a.v, b.v), 1e-12);
        }
      }
    }
  });

  test('le probabilità di una misura fanno sempre 1', () => {
    for (const s of STATI) {
      for (let g = 0; g <= 90; g += 5) {
        const [p, q] = misuraIn(g, s.v);
        vicino(p + q, 1, 1e-12);
        assert.ok(p >= -1e-15 && q >= -1e-15);
      }
    }
  });
});

describe('lo stesso stato, certo qui e casuale là', () => {
  test('|+⟩ è testa o croce lungo Z e certo lungo X', () => {
    /* è la frase che il corso ripete dal livello 1, e qui è un conto */
    const piu = [R2, R2];
    const [pz] = misuraIn(BASE_Z, piu);
    const [px] = misuraIn(BASE_X, piu);
    vicino(pz, 0.5, 1e-12);
    vicino(px, 1, 1e-12);
  });

  test('e |0⟩ fa l\'opposto: certo lungo Z, testa o croce lungo X', () => {
    vicino(misuraIn(BASE_Z, [1, 0])[0], 1, 1e-12);
    vicino(misuraIn(BASE_X, [1, 0])[0], 0.5, 1e-12);
  });

  test('per ogni stato esiste un righello che rende la misura certa', () => {
    /* non è un caso fortunato: è il righello allineato allo stato */
    for (const s of STATI) {
      const g = (Math.atan2(s.v[1], s.v[0]) * 180) / Math.PI;
      const [p, q] = misuraIn(g, s.v);
      assert.ok(Math.max(p, q) > 1 - 1e-9, `${s.nome}: al massimo ${Math.max(p, q)}`);
    }
  });

  test('e uno che la rende testa o croce', () => {
    for (const s of STATI) {
      const g = (Math.atan2(s.v[1], s.v[0]) * 180) / Math.PI + 45;
      const [p] = misuraIn(g, s.v);
      assert.ok(Math.abs(p - 0.5) < 1e-9, `${s.nome}: ${p}`);
    }
  });
});

describe('Hadamard È il cambio di righello', () => {
  test('i numeri che tira fuori, al quadrato, sono le probabilità nella base a 45°', () => {
    for (const s of STATI) {
      const dopo = applica(HADAMARD, s.v);
      const n = dopo[0] ** 2 + dopo[1] ** 2;
      const [p, q] = misuraIn(BASE_X, s.v);
      vicino(dopo[0] ** 2 / n, p, 1e-12);
      vicino(dopo[1] ** 2 / n, q, 1e-12);
    }
  });

  test('manda |0⟩ in |+⟩ e |1⟩ in |−⟩', () => {
    const zero = applica(HADAMARD, [1, 0]);
    vicino(zero[0], R2, 1e-12); vicino(zero[1], R2, 1e-12);
    const uno = applica(HADAMARD, [0, 1]);
    vicino(uno[0], R2, 1e-12); vicino(uno[1], -R2, 1e-12);
  });

  test('applicata due volte non fa niente: cambiare righello e ricambiarlo', () => {
    const HH = prodotto(HADAMARD, HADAMARD);
    for (let i = 0; i < 4; i++) vicino(HH[i], [1, 0, 0, 1][i], 1e-12);
  });

  test('è unitaria, e il suo determinante è −1: è uno specchio, non una rotazione', () => {
    assert.ok(unitaria(HADAMARD));
    vicino(determinante(HADAMARD), -1, 1e-12);
  });
});

describe('la base in cui la macchina diventa diagonale', () => {
  test('l\'angolo trovato azzera davvero i numeri fuori diagonale', () => {
    for (const m of MACCHINE_S) {
      const g = angoloDiagonalizzante(m.M);
      assert.ok(fuoriDiagonale(nellaBase(g, m.M)) < 1e-12, `${m.nome}: ${fuoriDiagonale(nellaBase(g, m.M))}`);
    }
  });

  test('e sulla diagonale ci finiscono gli autovalori', () => {
    for (const m of MACCHINE_S) {
      const D = nellaBase(angoloDiagonalizzante(m.M), m.M);
      const attesi = autovaloriSimmetrica(m.M).sort((a, b) => a - b);
      const trovati = [D[0], D[3]].sort((a, b) => a - b);
      vicino(trovati[0], attesi[0], 1e-9);
      vicino(trovati[1], attesi[1], 1e-9);
    }
  });

  test('cambiare base non tocca traccia e determinante', () => {
    /* sono le due cose che una matrice «è», indipendentemente da
       chi la guarda: per questo compaiono in tutte le formule */
    for (const m of MACCHINE_S) {
      for (let g = 0; g <= 90; g += 9) {
        const v = nellaBase(g, m.M);
        vicino(traccia(v), traccia(m.M), 1e-12);
        vicino(determinante(v), determinante(m.M), 1e-12);
      }
    }
  });

  test('la matrice del cambio è unitaria: i righelli non deformano', () => {
    for (let g = 0; g <= 180; g += 13) assert.ok(unitaria(matriceDiCambio(g)));
  });

  test('A^n con la scorciatoia dà lo stesso di A^n a forza bruta', () => {
    /* è il regalo della diagonalizzazione, e il motivo per cui la
       stima di fase può applicare una porta 2^k volte senza morire */
    for (const m of MACCHINE_S) {
      for (const n of [1, 2, 5, 12, 30]) {
        const bruto = potenza(m.M, n);
        const svelto = potenzaDiagonalizzando(m.M, n);
        for (let i = 0; i < 4; i++) {
          const scala = Math.max(1, Math.abs(bruto[i]));
          assert.ok(Math.abs(bruto[i] - svelto[i]) < 1e-6 * scala,
            `${m.nome} alla ${n}: ${bruto[i]} contro ${svelto[i]}`);
        }
      }
    }
  });

  test('e le direzioni della base giusta sono davvero autovettori', () => {
    for (const m of MACCHINE_S) {
      const [e1, e2] = versori(angoloDiagonalizzante(m.M));
      for (const e of [e1, e2]) {
        const fuori = applica(m.M, e);
        /* uscita parallela all'entrata: il prodotto incrociato è zero */
        vicino(fuori[0] * e[1] - fuori[1] * e[0], 0, 1e-9);
      }
    }
  });

  test('una matrice già diagonale non ha bisogno di girare niente', () => {
    vicino(angoloDiagonalizzante([2, 0, 0, 3]), 0, 1e-12);
    vicino(fuoriDiagonale(nellaBase(0, [2, 0, 0, 3])), 0, 1e-12);
  });
});
