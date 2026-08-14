/* Test del livello sulla pendenza e sugli algoritmi variazionali.
 *
 * Qui c'è un'affermazione forte, ed è quella che il livello vende: la
 * pendenza di un circuito quantistico non si stima, si MISURA esatta,
 * valutando la stessa energia con il parametro spostato di un quarto di giro
 * (regola dello spostamento). Se questa uguaglianza non reggesse, il livello
 * insegnerebbe una cosa falsa proprio nel punto in cui dice «e questo il
 * classico non sa farlo». */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  pendenza, CURVE, energia, pendenzaEsatta, pendenzaSpostamento, minimoDi, PROBLEMI,
} from '../../../public_html/js/widgets/variazionale.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);

describe('la pendenza', () => {
  test('la pendenza a due punti coincide con quella esatta, su tutte le curve', () => {
    for (const c of CURVE) {
      for (let x = -2.6; x <= 2.6; x += 0.1) vicino(pendenza(c.f, x), c.d(x), 1e-6);
    }
  });

  test('nei minimi dichiarati la pendenza è zero e la curva risale da entrambe le parti', () => {
    for (const c of CURVE) {
      for (const m of c.minimi) {
        vicino(c.d(m), 0, 1e-9);
        assert.ok(c.f(m + 0.1) > c.f(m), `${c.id}: a destra di ${m} non risale`);
        assert.ok(c.f(m - 0.1) > c.f(m), `${c.id}: a sinistra di ${m} non risale`);
      }
    }
  });

  /* La trappola che il gioco fa vedere apposta: pendenza nulla non vuol dire
     «in fondo». Se i massimi dichiarati non fossero massimi veri, il messaggio
     di avviso comparirebbe nel punto sbagliato. */
  test('nei massimi dichiarati la pendenza è zero ma la curva scende da entrambe le parti', () => {
    for (const c of CURVE) {
      for (const m of c.massimi) {
        vicino(c.d(m), 0, 1e-9);
        assert.ok(c.f(m + 0.1) < c.f(m));
        assert.ok(c.f(m - 0.1) < c.f(m));
      }
    }
  });

  test('minimi e massimi dichiarati stanno dentro la parte di curva che si vede', () => {
    for (const c of CURVE) {
      for (const x of [...c.minimi, ...c.massimi]) assert.ok(x > -2.6 && x < 2.6, `${c.id}: ${x} fuori schermo`);
    }
  });

  test('il segno della pendenza dice davvero da che parte si scende', () => {
    for (const c of CURVE) {
      for (const x of [-2, -0.7, 0.3, 1.1, 2.2]) {
        const p = c.d(x);
        if (Math.abs(p) < 1e-6) continue;
        const passo = p > 0 ? -0.05 : 0.05;
        assert.ok(c.f(x + passo) < c.f(x), `${c.id}: in ${x} il verso indicato non scende`);
      }
    }
  });
});

describe('la regola dello spostamento', () => {
  test('spostare di un quarto di giro dà la pendenza ESATTA, non un\'approssimazione', () => {
    for (const { a, b } of PROBLEMI) {
      for (let th = 0; th < 6.28; th += 0.05) {
        vicino(pendenzaSpostamento(a, b, th), pendenzaEsatta(a, b, th), 1e-12);
      }
    }
    // e vale per una coppia qualunque, non solo per quelle del gioco
    for (const [a, b] of [[0.3, -1.7], [2, 0], [0, 1], [-1, -1]]) {
      for (const th of [0, 0.9, 2.2, 3.7, 5.5]) vicino(pendenzaSpostamento(a, b, th), pendenzaEsatta(a, b, th), 1e-12);
    }
  });

  test('la pendenza è zero esattamente dove l\'energia tocca il fondo', () => {
    for (const { a, b } of PROBLEMI) {
      const min = minimoDi(a, b);
      vicino(pendenzaSpostamento(a, b, min.theta), 0, 1e-9);
      vicino(energia(a, b, min.theta), min.valore, 1e-9);
    }
  });

  test('il fondo dichiarato è davvero il più basso di tutta la curva', () => {
    for (const { a, b } of PROBLEMI) {
      const min = minimoDi(a, b);
      for (let th = 0; th < 6.28; th += 0.01) {
        assert.ok(energia(a, b, th) >= min.valore - 1e-12, `energia sotto il minimo dichiarato a θ=${th}`);
      }
    }
  });
});

describe('la discesa arriva in fondo', () => {
  /* La simulazione della discesa senza rumore: da qualunque punto di partenza,
     con il passo che usa il gioco, si arriva al fondo. Se non fosse vero la
     missione sarebbe impossibile da chiudere con il bottone. */
  test('con il passo del gioco si scende fino al minimo, da qualunque partenza', () => {
    for (const { a, b } of PROBLEMI) {
      const min = minimoDi(a, b);
      for (let start = 0; start < 6.28; start += 0.4) {
        let th = start;
        for (let i = 0; i < 60; i++) th -= 0.45 * pendenzaSpostamento(a, b, th);
        assert.ok(energia(a, b, th) - min.valore < 0.02,
          `partendo da ${start.toFixed(2)} si resta a ${(energia(a, b, th) - min.valore).toFixed(4)} dal fondo`);
      }
    }
  });

  test('il rumore di misura scende come 1/√tiri: è il costo vero di ogni misura', () => {
    // la stessa formula usata dal gioco per simulare i tiri
    const sigma = tiri => 1 / Math.sqrt(tiri);
    assert.ok(sigma(50) > sigma(200));
    assert.ok(sigma(200) > sigma(5000));
    vicino(sigma(100) / sigma(10000), 10, 1e-9);   // cento volte i tiri, dieci volte più precisi
  });
});
