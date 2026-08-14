/* Test del livello sulle serie di Taylor.
 *
 * Tre affermazioni che il livello fa, e che il corso userà dopo:
 *
 *  1. le serie scritte a mano nel widget sono DAVVERO quelle di
 *     Taylor. Non si controlla guardandole: si confronta ogni
 *     coefficiente con f⁽ᵏ⁾(0)/k! calcolata a parte;
 *
 *  2. e^(ix) = cos x + i·sin x esce separando i termini pari dai
 *     dispari della serie dell'esponenziale. È la seconda
 *     dimostrazione della formula di Eulero — la prima, per
 *     limite, sta al livello M·8;
 *
 *  3. il √N di Grover nasce da sin x ≈ x. Qui si confronta la
 *     formula (π/4)·√N con il numero di giri che davvero
 *     massimizza la probabilità, contato a mano — e si scopre che
 *     per liste corte NON coincidono.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  SERIE, NOMI, taylor, erroreTaylor, gradoPerErrore, errorePeggiore, coefficiente,
  eulerParziale, angoloEsatto, angoloApprossimato, giriMigliori, giriDallaFormula,
} from '../../../public_html/js/widgets/taylor.js';
import { probabilitaDopo } from '../../../public_html/js/widgets/goniometria.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);

describe('le serie sono quelle di Taylor, non formule copiate', () => {
  test('il resto si comporta come il primo termine trascurato', () => {
    /* questa È la definizione di polinomio di Taylor: troncato al
       grado n, l'errore vicino a zero vale il termine successivo.
       Si controlla contro la funzione vera, senza derivate numeriche
       — che su 1/(1−x) sarebbero inaffidabili, perché le sue
       derivate crescono come k!. */
    const x = 0.005;
    for (const nome of NOMI) {
      for (let n = 0; n <= 6; n++) {
        const prossimo = Math.abs(coefficiente(nome, n + 1)) * x ** (n + 1);
        if (prossimo < 1e-13) continue;      // termine assente, o sotto il rumore dei double
        const resto = erroreTaylor(nome, x, n);
        assert.ok(Math.abs(resto - prossimo) < 0.03 * prossimo,
          `${nome}, grado ${n}: resto ${resto}, primo termine trascurato ${prossimo}`);
      }
    }
  });

  test('il seno ha solo potenze dispari, il coseno solo pari', () => {
    for (let k = 0; k <= 12; k++) {
      if (k % 2 === 0) vicino(coefficiente('seno', k), 0, 1e-15);
      else vicino(coefficiente('coseno', k), 0, 1e-15);
    }
  });

  test('i primi coefficienti sono quelli scritti sui libri', () => {
    vicino(coefficiente('seno', 1), 1);
    vicino(coefficiente('seno', 3), -1 / 6);
    vicino(coefficiente('seno', 5), 1 / 120);
    vicino(coefficiente('coseno', 0), 1);
    vicino(coefficiente('coseno', 2), -0.5);
    vicino(coefficiente('esponenziale', 3), 1 / 6);
    for (let k = 0; k <= 8; k++) vicino(coefficiente('geometrica', k), 1);
  });
});

describe('il polinomio insegue la curva', () => {
  test('in zero è sempre esatto, a qualunque grado', () => {
    for (const nome of NOMI) {
      for (const n of [0, 1, 5, 12]) vicino(taylor(nome, 0, n), SERIE[nome].f(0), 1e-12);
    }
  });

  test('aggiungendo termini l\'errore scende, dentro il raggio', () => {
    for (const nome of NOMI) {
      const x = Number.isFinite(SERIE[nome].raggio) ? 0.5 : 1.5;
      let prima = Infinity;
      for (const n of [2, 6, 10, 16, 24]) {
        const e = erroreTaylor(nome, x, n);
        assert.ok(e <= prima + 1e-12, `${nome} in ${x}: a grado ${n} l'errore sale`);
        prima = e;
      }
      assert.ok(prima < 1e-6, `${nome}: a grado 24 l'errore è ancora ${prima}`);
    }
  });

  test('più ci si allontana da zero, più alto è il grado che serve', () => {
    let prima = -1;
    for (const x of [0.5, 1, 2, 4, 6]) {
      const g = gradoPerErrore('seno', x, 1e-4);
      assert.ok(g !== null && g >= prima, `in ${x} serve grado ${g}, prima ${prima}`);
      prima = g;
    }
  });

  test('i gradi che il livello promette bastano davvero', () => {
    /* il testo dice: il seno si copre col grado 19, l'esponenziale
       col 10. Se un giorno cambiassero, il collaudo lo direbbe */
    assert.ok(errorePeggiore('seno', 19, -7, 7) < 0.01);
    assert.ok(errorePeggiore('seno', 17, -7, 7) > 0.01);
    assert.ok(errorePeggiore('esponenziale', 10, -3, 3) < 0.01);
  });
});

describe('il muro: il raggio di convergenza', () => {
  test('per 1/(1−x) la serie funziona dentro |x| < 1', () => {
    for (const x of [-0.9, -0.5, 0.3, 0.9]) {
      assert.ok(erroreTaylor('geometrica', x, 200) < 1e-6, `in ${x}`);
    }
  });

  test('e FUORI non c\'è grado che tenga: esplode', () => {
    /* è il muro del gioco: aggiungere termini peggiora, sempre */
    for (const x of [1.2, 1.5, -2]) {
      let prima = 0;
      for (const n of [10, 20, 40]) {
        const e = erroreTaylor('geometrica', x, n);
        assert.ok(e > prima, `in ${x}: a grado ${n} l'errore non cresce`);
        prima = e;
      }
      assert.ok(prima > 100, `in ${x}: a grado 40 l'errore è solo ${prima}`);
    }
  });

  test('e le altre tre non hanno nessun muro: funzionano ovunque', () => {
    for (const nome of ['seno', 'coseno', 'esponenziale']) {
      assert.equal(SERIE[nome].raggio, Infinity);
      assert.ok(erroreTaylor(nome, 12, 60) < 1e-6, `${nome} in 12`);
    }
  });
});

describe('la formula di Eulero, per serie', () => {
  test('i termini pari fanno cos x, i dispari sin x', () => {
    for (const x of [0, 0.3, 1, 2, Math.PI, -1.7]) {
      const [re, im] = eulerParziale(x, 40);
      assert.ok(Math.abs(re - Math.cos(x)) < 1e-9, `parte reale in ${x}: ${re}`);
      assert.ok(Math.abs(im - Math.sin(x)) < 1e-9, `parte immaginaria in ${x}: ${im}`);
    }
  });

  test('e le due metà sono proprio le serie di seno e coseno', () => {
    /* non basta che il totale torni: il livello dice che la parte
       reale È la serie del coseno, e qui si controlla termine a
       termine invece di crederci */
    for (const x of [0.7, 2.2]) {
      for (const n of [4, 8, 16]) {
        const [re, im] = eulerParziale(x, n);
        vicino(re, taylor('coseno', x, n), 1e-12);
        vicino(im, taylor('seno', x, n), 1e-12);
      }
    }
  });

  test('mezzo giro dà −1: e^(iπ) + 1 = 0, per la seconda volta nel corso', () => {
    const [re, im] = eulerParziale(Math.PI, 40);
    assert.ok(Math.abs(re + 1) < 1e-9, `parte reale ${re}`);
    assert.ok(Math.abs(im) < 1e-9, `parte immaginaria ${im}`);
  });
});

describe('il √N di Grover nasce da sin x ≈ x', () => {
  test('l\'angolo approssimato si avvicina a quello vero al crescere della lista', () => {
    let prima = 1;
    for (const N of [4, 16, 256, 4096, 65536]) {
      const scarto = Math.abs(angoloEsatto(N) - angoloApprossimato(N)) / angoloEsatto(N);
      assert.ok(scarto < prima, `N=${N}: lo scarto non scende`);
      prima = scarto;
    }
    assert.ok(prima < 1e-4, `su liste enormi lo scarto resta ${prima}`);
  });

  test('e lo scarto scende come 1/N: è il secondo termine della serie', () => {
    /* arcsin(u) = u + u³/6 + …, e con u = 1/√N il secondo termine
       è 1/(6·N^1,5): rispetto al primo pesa 1/(6N) */
    for (const N of [100, 1000, 10000]) {
      const scarto = Math.abs(angoloEsatto(N) - angoloApprossimato(N)) / angoloEsatto(N);
      assert.ok(Math.abs(scarto * 6 * N - 1) < 0.1, `N=${N}: ${scarto * 6 * N}`);
    }
  });

  test('i giri contati a mano sono la prima cima della curva', () => {
    /* la probabilità di Grover oscilla (livello M·8): più avanti
       risale, e a volte va anche più in alto. Ma quei giri costano
       interrogazioni, quindi la cima che conta è la prima. */
    for (const N of [4, 16, 64, 256, 1024]) {
      const k = giriMigliori(N);
      const p = probabilitaDopo(N, k);
      for (let j = 0; j <= k; j++) {
        assert.ok(probabilitaDopo(N, j) <= p + 1e-12, `N=${N}: ${j} giri fanno meglio di ${k}`);
      }
      assert.ok(probabilitaDopo(N, k + 1) <= p + 1e-12, `N=${N}: dopo la cima si risale subito`);
      assert.ok(p > 0.5, `N=${N}: alla prima cima la probabilità è solo ${p}`);
    }
  });

  test('su liste grandi la formula (π/4)·√N azzecca il numero di giri', () => {
    for (const N of [256, 1024, 4096, 65536]) {
      assert.equal(giriDallaFormula(N), giriMigliori(N), `N=${N}`);
    }
  });

  test('ma non sempre: ogni tanto il conto arrotondato scivola di un giro', () => {
    /* l'approssimazione non è gratis. Su duemila lunghezze di lista
       la formula sbaglia una dozzina di volte, e la prima è la lista
       da due caselle: il caso in cui sin x ≈ x sbaglia del 10%. */
    const sbagliate = [];
    for (let N = 2; N <= 2000; N++) if (giriDallaFormula(N) !== giriMigliori(N)) sbagliate.push(N);
    assert.ok(sbagliate.length >= 5 && sbagliate.length <= 40,
      `sbagliate ${sbagliate.length}: ${sbagliate.slice(0, 20)}`);
    assert.ok(sbagliate.includes(2), 'sulla lista da due caselle dovrebbe sbagliare');
  });

  test('e quando sbaglia, sbaglia sempre di un giro solo', () => {
    for (let N = 2; N <= 2000; N++) {
      assert.ok(Math.abs(giriDallaFormula(N) - giriMigliori(N)) <= 1, `N=${N}`);
    }
  });

  test('e la probabilità che si perde sbagliando di un giro è piccola', () => {
    /* è il motivo per cui la formula si usa lo stesso: costa poco */
    for (let N = 2; N <= 2000; N++) {
      if (giriDallaFormula(N) === giriMigliori(N)) continue;
      const persa = probabilitaDopo(N, giriMigliori(N)) - probabilitaDopo(N, giriDallaFormula(N));
      assert.ok(persa < 0.35, `N=${N}: si perde ${persa}`);
    }
  });
});
