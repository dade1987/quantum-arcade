/* Test del livello sugli integrali.
 *
 * Quattro affermazioni che il livello fa e che sarebbero gravi se
 * false:
 *
 *  1. i rettangoli ci arrivano davvero, e l'errore scende come 1/n
 *     tagliando ai bordi, come 1/n² tagliando a metà. Il livello lo
 *     dice come se fosse ovvio: qui si misura l'esponente;
 *
 *  2. il teorema fondamentale — la pendenza dell'area accumulata È
 *     la funzione di partenza — controllato punto per punto su
 *     tutte le funzioni del gioco;
 *
 *  3. l'area sotto 1/x da 1 a t è il logaritmo naturale di t. Non
 *     «assomiglia»: è uguale, su cento valori;
 *
 *  4. |ψ|² della particella nella scatola ha area esattamente 1.
 *     Se non l'avesse, il gioco starebbe mostrando una probabilità
 *     che non è una probabilità.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  FUNZIONI, NOMI, areaEsatta, rettangoli, erroreArea, accumulata, pendenzaAccumulata,
} from '../../../public_html/js/widgets/integrali.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);

describe('le funzioni e le loro primitive', () => {
  test('ogni funzione ha formula, primitiva ed estremi sensati', () => {
    for (const nome of NOMI) {
      const g = FUNZIONI[nome];
      assert.equal(typeof g.formula, 'string');
      assert.ok(g.b > g.a, nome);
      assert.ok(Number.isFinite(g.f(g.a)) && Number.isFinite(g.f(g.b)), nome);
    }
  });

  test('la primitiva è davvero una primitiva: la sua derivata è f', () => {
    /* è la condizione che rende lecito calcolare l'area con F(b)−F(a).
       Se una primitiva fosse sbagliata, tutto il livello mentirebbe. */
    for (const nome of NOMI) {
      const g = FUNZIONI[nome];
      for (let i = 1; i < 20; i++) {
        const x = g.a + (i / 20) * (g.b - g.a);
        const derivata = (g.F(x + 1e-6) - g.F(x - 1e-6)) / 2e-6;
        assert.ok(Math.abs(derivata - g.f(x)) < 1e-5, `${nome} in ${x}: ${derivata} ≠ ${g.f(x)}`);
      }
    }
  });

  test('i valori noti a mano tornano', () => {
    vicino(areaEsatta('parabola'), 1 / 3, 1e-12);      // ∫₀¹ x² = 1/3
    vicino(areaEsatta('seno'), 2, 1e-12);              // ∫₀^π sin = 2
    vicino(areaEsatta('reciproca'), 1, 1e-12);         // ∫₁^e 1/x = ln e = 1
    vicino(areaEsatta('scatola'), 1, 1e-12);           // la probabilità totale
  });
});

describe('i rettangoli ci arrivano', () => {
  test('più rettangoli, meno errore — su tutte le funzioni e tutti i tagli', () => {
    for (const nome of NOMI) {
      for (const dove of ['sinistra', 'mezzo', 'destra']) {
        assert.ok(erroreArea(nome, 400, dove) < erroreArea(nome, 10, dove) + 1e-15,
          `${nome}/${dove}: 400 rettangoli non fanno meglio di 10`);
        assert.ok(erroreArea(nome, 20000, dove) < 1e-3, `${nome}/${dove} non converge`);
      }
    }
  });

  test('ai bordi l\'errore scende come 1/n: raddoppiare i rettangoli lo dimezza', () => {
    for (const nome of ['parabola', 'reciproca']) {
      for (const n of [200, 800, 3200]) {
        const rapporto = erroreArea(nome, n, 'sinistra') / erroreArea(nome, 2 * n, 'sinistra');
        assert.ok(Math.abs(rapporto - 2) < 0.05, `${nome} a n=${n}: rapporto ${rapporto}`);
      }
    }
  });

  test('a metà scende come 1/n²: raddoppiare li divide per quattro', () => {
    /* è la differenza fra fare un conto e farlo bene: a parità di
       errore, tagliare a metà costa centinaia di rettangoli in meno */
    for (const nome of ['parabola', 'seno', 'reciproca']) {
      for (const n of [50, 200, 800]) {
        const rapporto = erroreArea(nome, n, 'mezzo') / erroreArea(nome, 2 * n, 'mezzo');
        assert.ok(Math.abs(rapporto - 4) < 0.2, `${nome} a n=${n}: rapporto ${rapporto}`);
      }
    }
  });

  test('e infatti a metà bastano molti meno rettangoli', () => {
    const quanti = (nome, dove, soglia) => { let n = 1; while (erroreArea(nome, n, dove) > soglia && n < 2e5) n++; return n; };
    const bordo = quanti('parabola', 'sinistra', 1e-3);
    const meta = quanti('parabola', 'mezzo', 1e-3);
    assert.ok(bordo > 20 * meta, `bordo ${bordo}, mezzo ${meta}`);
  });

  test('con un rettangolo solo tagliato a metà si becca la parabola per caso, non per bravura', () => {
    /* il punto di mezzo è esatto sulle rette e quasi esatto sulle
       parabole: è la ragione per cui è così più preciso */
    assert.ok(erroreArea('parabola', 1, 'mezzo') < erroreArea('parabola', 1, 'sinistra'));
  });

  test('la somma sinistra e la destra stringono il valore vero fra loro, se la funzione sale', () => {
    /* è il metodo di esaustione di Archimede, ridotto all'osso */
    const vero = areaEsatta('parabola');
    for (const n of [1, 5, 50]) {
      assert.ok(rettangoli('parabola', n, 'sinistra') < vero, `n=${n}`);
      assert.ok(rettangoli('parabola', n, 'destra') > vero, `n=${n}`);
    }
  });
});

describe('il teorema fondamentale del calcolo', () => {
  test('la pendenza dell\'area accumulata è la funzione di partenza, in ogni punto', () => {
    for (const nome of NOMI) {
      const g = FUNZIONI[nome];
      for (let i = 1; i < 40; i++) {
        const x = g.a + (i / 40) * (g.b - g.a);
        assert.ok(Math.abs(pendenzaAccumulata(nome, x) - g.f(x)) < 1e-4,
          `${nome} in ${x}: pendenza ${pendenzaAccumulata(nome, x)} contro f(x) ${g.f(x)}`);
      }
    }
  });

  test('l\'accumulata parte da zero e arriva all\'area totale', () => {
    for (const nome of NOMI) {
      const g = FUNZIONI[nome];
      vicino(accumulata(nome, g.a), 0, 1e-12);
      vicino(accumulata(nome, g.b), areaEsatta(nome), 1e-12);
    }
  });

  test('e non torna mai indietro, perché queste funzioni non vanno sotto zero', () => {
    for (const nome of NOMI) {
      const g = FUNZIONI[nome];
      let prima = -1;
      for (let i = 0; i <= 100; i++) {
        const x = g.a + (i / 100) * (g.b - g.a);
        const acc = accumulata(nome, x);
        assert.ok(acc >= prima - 1e-12, `${nome} torna indietro in ${x}`);
        prima = acc;
      }
    }
  });

  test('e i rettangoli danno la stessa accumulata della primitiva', () => {
    /* le due strade — sommare rettangoli e usare la primitiva —
       devono portare allo stesso posto, altrimenti il teorema che il
       livello racconta non c'è */
    for (const nome of NOMI) {
      const g = FUNZIONI[nome];
      const passo = (g.b - g.a) / 20000;
      let somma = 0;
      for (let k = 0; k < 20000; k++) somma += g.f(g.a + (k + 0.5) * passo) * passo;
      assert.ok(Math.abs(somma - areaEsatta(nome)) < 1e-6, nome);
    }
  });
});

describe('due aree che hanno un nome', () => {
  test('l\'area sotto 1/x da 1 a t È il logaritmo naturale di t', () => {
    /* al livello 0·8 il logaritmo è «l\'esponente che serve». Questa
       è l\'altra definizione, e danno lo stesso numero */
    for (let i = 1; i <= 100; i++) {
      const tt = 1 + i * 0.05;
      const g = FUNZIONI.reciproca;
      const area = g.F(tt) - g.F(1);
      vicino(area, Math.log(tt), 1e-12);
    }
  });

  test('e vale 1 esattamente quando t = e: ecco perché quella base è «naturale»', () => {
    vicino(accumulata('reciproca', Math.E), 1, 1e-12);
  });

  test('|ψ|² della particella nella scatola è una probabilità vera: area 1', () => {
    vicino(areaEsatta('scatola'), 1, 1e-12);
    const g = FUNZIONI.scatola;
    for (let i = 0; i <= 100; i++) {
      const x = i / 100;
      assert.ok(g.f(x) >= -1e-15, `negativa in ${x}: una probabilità non può esserlo`);
    }
  });

  test('ed è massima al centro della scatola, zero alle pareti', () => {
    const g = FUNZIONI.scatola;
    vicino(g.f(0), 0, 1e-12);
    vicino(g.f(1), 0, 1e-12);
    vicino(g.f(0.5), 2, 1e-12);
    for (let i = 1; i < 100; i++) {
      const x = i / 100;
      assert.ok(g.f(x) <= 2 + 1e-12, `sopra il massimo in ${x}`);
    }
  });
});
