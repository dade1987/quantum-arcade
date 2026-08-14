/* Test del livello sui limiti.
 *
 * Il livello fa quattro affermazioni forti. Qui si controllano tutte
 * e quattro con i numeri, perché tre di queste il corso le usava già
 * da prima senza averle mai verificate:
 *
 *  1. l'N del gioco del corridoio per 1/√n È il numero di tiri del
 *     livello M·7. Non «gli somiglia»: è lo stesso numero, e la
 *     funzione che lo calcola è importata da lì;
 *
 *  2. la probabilità di Grover NON tende a 1. Se tendesse, il
 *     livello 11 direbbe una cosa falsa quando dice che continuare a
 *     girare peggiora;
 *
 *  3. (1 + 1/n)^n sale sempre e non supera mai e. È il modo in cui e
 *     è stato definito la prima volta, nel 1683;
 *
 *  4. (1 + iθ/n)^n finisce su cos θ + i·sin θ. È la dimostrazione
 *     che il corso, ai livelli 14 e M·3, aveva solo promesso.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  SUCCESSIONI, NOMI, termini, distanza, fuori, minimoN, converge,
  capitale, erroreCapitale, passiImmaginari, capitaleImmaginario,
  erroreImmaginario, lunghezzaImmaginaria, CASELLE_GROVER, tiriPerErrore,
} from '../../../public_html/js/widgets/limiti.js';
import { giriOttimali, probabilitaDopo } from '../../../public_html/js/widgets/goniometria.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);

describe('le successioni sono quelle dichiarate', () => {
  test('ognuna ha formula, funzione e limite (o il dichiarato «nessuno»)', () => {
    for (const nome of NOMI) {
      const s = SUCCESSIONI[nome];
      assert.equal(typeof s.formula, 'string');
      assert.equal(typeof s.f, 'function');
      assert.ok(s.limite === null || Number.isFinite(s.limite), nome);
      assert.ok(Number.isFinite(s.f(1)) && Number.isFinite(s.f(1000)), nome);
    }
  });

  test('chi dichiara un limite ci arriva davvero', () => {
    for (const nome of NOMI.filter(converge)) {
      /* cento milioni di termini e non uno di meno: a un milione la
         più lenta di tutte, 1/√n, è ancora a 0,001 esatti */
      assert.ok(distanza(nome, 10 ** 8) < 1e-3, `${nome} non si avvicina al limite dichiarato`);
    }
  });

  test('chi non lo dichiara continua a scappare, per sempre', () => {
    /* non basta che oscilli all'inizio: si controlla che anche
       lontanissimo esca ancora dal corridoio */
    for (const nome of NOMI.filter(n => !converge(n))) {
      assert.equal(minimoN(nome, 0.1), null, nome);
      const valori = termini(nome, 4000).slice(2000);
      const min = Math.min(...valori), max = Math.max(...valori);
      assert.ok(max - min > 0.5, `${nome} smette di oscillare: ${min}..${max}`);
    }
  });
});

describe('il gioco del corridoio', () => {
  test('l\'N di 1/√n È il numero di tiri del livello M·7', () => {
    /* questa è la riga per cui esiste il livello: la definizione di
       limite e il conto sul costo di una misura sono la stessa cosa */
    for (const eps of [0.2, 0.1, 0.05, 0.02, 0.01]) {
      assert.equal(minimoN('radice', eps), tiriPerErrore(1, eps), `eps=${eps}`);
    }
  });

  test('e vale la formula chiusa: N = ⌈1/ε²⌉', () => {
    for (const eps of [0.3, 0.25, 0.07, 0.01]) {
      assert.equal(minimoN('radice', eps), Math.ceil(1 / eps ** 2), `eps=${eps}`);
    }
  });

  test('l\'N trovato vince davvero, e quello prima no', () => {
    for (const nome of NOMI.filter(converge)) {
      for (const eps of [0.2, 0.05, 0.01]) {
        const N = minimoN(nome, eps);
        assert.ok(N !== null, `${nome} a ${eps}`);
        assert.equal(fuori(nome, eps, N, N + 5000).length, 0, `${nome}: da ${N} qualcuno esce ancora`);
        if (N > 1) assert.ok(fuori(nome, eps, N - 1, N - 1).length === 1, `${nome}: ${N} non è il minimo`);
      }
    }
  });

  test('stringere il corridoio non fa mai scendere l\'N', () => {
    for (const nome of NOMI.filter(converge)) {
      let prima = 0;
      for (const eps of [0.2, 0.1, 0.05, 0.02, 0.01]) {
        const N = minimoN(nome, eps);
        assert.ok(N >= prima, `${nome}: a ${eps} serve un N più piccolo di prima`);
        prima = N;
      }
    }
  });

  test('1/√n è LENTA: a parità di corridoio chiede molti più termini delle altre', () => {
    /* è il motivo per cui una misura quantistica costa: non è che la
       media non converga, è che converge come una lumaca */
    assert.ok(minimoN('radice', 0.01) > 50 * minimoN('alterna', 0.01));
    assert.ok(minimoN('alterna', 0.01) > 10 * minimoN('mezzi', 0.01));
  });

  test('per (−1)ⁿ nessun N vince, per quanto in là si guardi', () => {
    assert.equal(minimoN('bandiera', 0.9), null);
    for (const da of [1, 10, 1000]) assert.ok(fuori('bandiera', 0.9, da, da + 10).length > 0);
  });
});

describe('Grover non tende a niente: oscilla', () => {
  test('la successione del gioco è proprio quella del livello di Grover', () => {
    for (const n of [1, 2, 3, 7]) {
      vicino(SUCCESSIONI.grover.f(n), probabilitaDopo(CASELLE_GROVER, n), 1e-12);
    }
  });

  test('il massimo sta al giro ottimale, e dopo si torna a scendere', () => {
    const k = giriOttimali(CASELLE_GROVER);
    const p = SUCCESSIONI.grover.f(k);
    assert.ok(p > 0.95, `al giro ottimale la probabilità è ${p}`);
    assert.ok(SUCCESSIONI.grover.f(k + 3) < p - 0.3, 'continuare a girare dovrebbe peggiorare parecchio');
  });

  test('non converge a 1: torna sempre giù, anche dopo mille giri', () => {
    const tardi = termini('grover', 2000).slice(1000);
    assert.ok(Math.min(...tardi) < 0.1, 'dovrebbe tornare vicino a zero');
    assert.ok(Math.max(...tardi) > 0.9, 'e risalire vicino a uno');
    assert.equal(minimoN('grover', 0.05), null);
  });
});

describe('la banca di Bernoulli: da dove esce e', () => {
  test('il capitale sale sempre, rata dopo rata', () => {
    for (let n = 1; n < 500; n++) {
      assert.ok(capitale(1, n + 1) > capitale(1, n), `scende fra ${n} e ${n + 1}`);
    }
  });

  test('e non supera mai e — nemmeno con un milione di rate', () => {
    for (const n of [1, 2, 12, 365, 1e4, 1e6]) assert.ok(capitale(1, n) < Math.E, `n=${n}`);
  });

  test('sta fra 2 e 3, che è come Bernoulli lo aveva incastrato nel 1683', () => {
    for (const n of [1, 2, 10, 1000, 1e6]) {
      const c = capitale(1, n);
      assert.ok(c >= 2 && c < 3, `n=${n}: ${c}`);
    }
  });

  test('ci arriva, e l\'errore si dimezza al raddoppiare delle rate', () => {
    vicino(capitale(1, 1e7), Math.E, 1e-6);
    for (const n of [100, 1000, 10000]) {
      const rapporto = erroreCapitale(1, n) / erroreCapitale(1, 2 * n);
      assert.ok(Math.abs(rapporto - 2) < 0.05, `n=${n}: il rapporto è ${rapporto}`);
    }
  });

  test('con un interesse qualunque x si finisce su e^x', () => {
    for (const x of [-1, 0.5, 1, 2, 3]) {
      assert.ok(Math.abs(capitale(x, 1e6) - Math.exp(x)) < 1e-3, `x=${x}`);
    }
  });
});

describe('l\'interesse immaginario: la dimostrazione di e^(iθ)', () => {
  test('i passi sono n più quello di partenza, e si parte da 1', () => {
    const passi = passiImmaginari(1, 7);
    assert.equal(passi.length, 8);
    assert.deepEqual(passi[0], [1, 0]);
  });

  test('il capitale finisce su cos θ + i·sin θ', () => {
    for (const g of [15, 45, 90, 180]) {
      const th = (g * Math.PI) / 180;
      const [a, b] = capitaleImmaginario(th, 2e6);
      assert.ok(Math.abs(a - Math.cos(th)) < 1e-5, `${g}°: parte reale ${a} invece di ${Math.cos(th)}`);
      assert.ok(Math.abs(b - Math.sin(th)) < 1e-5, `${g}°: parte immaginaria ${b} invece di ${Math.sin(th)}`);
    }
  });

  test('l\'errore scende come 1/n: raddoppiare le rate lo dimezza', () => {
    const th = Math.PI / 2;
    for (const n of [200, 2000, 20000]) {
      const rapporto = erroreImmaginario(th, n) / erroreImmaginario(th, 2 * n);
      assert.ok(Math.abs(rapporto - 2) < 0.05, `n=${n}: rapporto ${rapporto}`);
    }
  });

  test('il capitale NON cresce: la lunghezza tende a 1 restando sempre sopra', () => {
    /* è la frase che tutta la storiella deve reggere: con un
       interesse immaginario i soldi non aumentano, girano */
    const th = Math.PI / 2;
    for (const n of [1, 10, 100, 10000]) {
      const l = lunghezzaImmaginaria(th, n);
      assert.ok(l > 1, `n=${n}: lunghezza ${l}`);
      const [a, b] = capitaleImmaginario(th, n);
      vicino(Math.hypot(a, b), l, 1e-9);
    }
    assert.ok(lunghezzaImmaginaria(th, 1e6) < 1.0000021);
  });

  test('e per un giro intero si torna esattamente al punto di partenza', () => {
    const [a, b] = capitaleImmaginario(2 * Math.PI, 4e6);
    assert.ok(Math.abs(a - 1) < 1e-4, `parte reale ${a}`);
    assert.ok(Math.abs(b) < 1e-4, `parte immaginaria ${b}`);
  });

  test('mezzo giro dà −1: e^(iπ) + 1 = 0, il regalo di Eulero', () => {
    const [a, b] = capitaleImmaginario(Math.PI, 4e6);
    assert.ok(Math.abs(a + 1) < 1e-4, `parte reale ${a}`);
    assert.ok(Math.abs(b) < 1e-4, `parte immaginaria ${b}`);
  });

  test('più largo è il giro, più rate servono per la stessa precisione', () => {
    /* la stessa regola per cui simulare un sistema fisico per un
       tempo doppio costa il doppio dei pezzetti */
    const rate = th => { let n = 1; while (erroreImmaginario(th, n) > 0.02) n++; return n; };
    const piccolo = rate(Math.PI / 4), grande = rate(Math.PI);
    assert.ok(grande > 3 * piccolo, `${piccolo} contro ${grande}`);
  });
});
