/* Test della matematica del livello degli autovettori.
 *
 * Due promesse da mantenere: che le direzioni che il gioco riconosce come
 * «ferme» siano davvero autovettori (e che il numero mostrato sia davvero
 * l'autovalore), e che ogni macchina proposta sia giocabile — cioè che le
 * direzioni da trovare esistano. La rotazione fa eccezione apposta: è lì per
 * far vedere che a volte non esistono, ed è il ponte verso le fasi. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { autovaloriDi, scarto, fattore, magnete, MACCHINE, ordineDi, FASI } from '../../../public_html/js/widgets/autovettori.js';
import { applica, M } from '../../../public_html/js/widgets/matrici.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);

describe('autovalori e autovettori', () => {
  test('una direzione ferma resta davvero in linea con sé stessa', () => {
    for (const mac of MACCHINE) {
      for (const { dir, lambda } of autovaloriDi(mac.m)) {
        const uscita = applica(mac.m, dir);
        vicino(scarto(dir, uscita), 0, 1e-9);
        vicino(fattore(dir, uscita), lambda, 1e-9);
      }
    }
  });

  test('gli autovalori sono le radici di λ² − traccia·λ + determinante', () => {
    for (const mac of MACCHINE) {
      const [[a, b], [c, d]] = mac.m;
      for (const { lambda } of autovaloriDi(mac.m)) {
        vicino(lambda * lambda - (a + d) * lambda + (a * d - b * c), 0, 1e-9);
      }
    }
  });

  test('lo stiramento ha le due direzioni degli assi, con 2 e 0,5', () => {
    const auto = autovaloriDi(M(2, 0, 0, 0.5));
    assert.equal(auto.length, 2);
    vicino(auto[0].lambda, 2); vicino(Math.abs(auto[0].dir[0]), 1);
    vicino(auto[1].lambda, 0.5); vicino(Math.abs(auto[1].dir[1]), 1);
  });

  test('la porta H ha autovalori +1 e −1: ribalta, non allunga', () => {
    const auto = autovaloriDi(MACCHINE.find(m => m.id === 'hadamard').m);
    assert.deepEqual(auto.map(a => Math.round(a.lambda)).sort(), [-1, 1]);
  });

  test('lo scivolo ha una sola direzione ferma, non due', () => {
    assert.equal(autovaloriDi(M(1, 1, 0, 1)).length, 1);
  });

  /* Il caso che il livello usa come ponte: se non c'è nessuna direzione ferma
     reale, l'autovalore non può essere un allungamento — dev'essere una fase.
     È il motivo per cui il quantistico vive sui numeri complessi. */
  test('la rotazione di 90° non ha nessuna direzione ferma reale', () => {
    assert.deepEqual(autovaloriDi(M(0, -1, 1, 0)), []);
  });
});

describe('il magnete: la missione dev\'essere una scoperta, non una lotteria', () => {
  test('vicino a una direzione ferma ci si aggancia esattamente', () => {
    for (const mac of MACCHINE) {
      for (const { dir } of autovaloriDi(mac.m)) {
        const giusto = Math.atan2(dir[1], dir[0]);
        for (const scostamento of [-0.05, -0.02, 0.02, 0.05]) {
          const agganciato = magnete(giusto + scostamento, mac.m);
          const v = [Math.cos(agganciato), Math.sin(agganciato)];
          vicino(scarto(v, applica(mac.m, v)), 0, 1e-9);
        }
      }
    }
  });

  test('lontano da ogni direzione ferma non sposta niente', () => {
    const m = M(2, 0, 0, 0.5);           // direzioni ferme a 0° e 90°
    vicino(magnete(0.7, m), 0.7);        // ~40°: lontano da entrambe
  });

  test('sulla rotazione, che non ha direzioni ferme, il magnete non fa nulla', () => {
    vicino(magnete(1.234, M(0, -1, 1, 0)), 1.234);
  });
});

describe('la fase che si conta', () => {
  test('il numero di applicazioni dichiarato è quello vero', () => {
    for (const f of FASI) assert.equal(ordineDi(f.gradi), f.ordine);
  });

  test('dopo quel numero di applicazioni la fase è un giro intero', () => {
    for (const f of FASI) {
      vicino((f.gradi * f.ordine) % 360, 0, 1e-9);
      // e prima non era mai tornata a casa: altrimenti il conteggio direbbe un'altra cosa
      for (let k = 1; k < f.ordine; k++) assert.ok(((k * f.gradi) % 360) > 1e-9, `${f.gradi}° tornava a casa già a ${k}`);
    }
  });

  test('le fasi proposte danno conteggi diversi fra loro: si impara confrontando', () => {
    assert.equal(new Set(FASI.map(f => f.ordine)).size, FASI.length);
  });
});
