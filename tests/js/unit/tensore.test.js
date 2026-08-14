/* Test del livello sul prodotto tensoriale e l'entanglement.
 *
 * Il livello afferma quattro cose, e sono tutte controllabili:
 *
 *  1. il prodotto tensoriale di due qubit dà SEMPRE uno stato separabile
 *     — l'incrocio a00·a11 − a01·a10 è zero, per costruzione;
 *  2. lo stato di Bell NON è separabile, e non per poca pazienza: si
 *     verifica esaurendo tutte le coppie di qubit su una griglia fitta
 *     e mostrando che nessuna ci arriva nemmeno vicino;
 *  3. quando lo stato è separabile, la fattorizzazione trovata lo
 *     ricostruisce davvero — altrimenti il gioco chiederebbe una cosa
 *     che poi non sa fare;
 *  4. la CNOT non è il prodotto tensoriale di due porte da un qubit. È
 *     esattamente per questo che sa creare entanglement: se lo fosse,
 *     lavorerebbe sui due qubit separatamente e non potrebbe legarli. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  tensore, tensoreM, incrocio, separabile, groviglio, norma, normalizza,
  fattorizza, qubitDa, CNOT, applica4, STATI, BERSAGLI_T,
} from '../../../public_html/js/widgets/tensore.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);
const vicinoV = (v, w, tol = 1e-9) => v.forEach((x, i) => vicino(x, w[i], tol));

describe('il prodotto tensoriale', () => {
  test('moltiplica ogni ampiezza con ogni ampiezza, nell\'ordine 00 01 10 11', () => {
    vicinoV(tensore([1, 0], [1, 0]), [1, 0, 0, 0]);
    vicinoV(tensore([1, 0], [0, 1]), [0, 1, 0, 0]);
    vicinoV(tensore([0, 1], [1, 0]), [0, 0, 1, 0]);
    vicinoV(tensore([0, 1], [0, 1]), [0, 0, 0, 1]);
    vicinoV(tensore([2, 3], [5, 7]), [10, 14, 15, 21]);
  });

  test('conserva la normalizzazione: due qubit lunghi 1 danno una coppia lunga 1', () => {
    for (let ga = 0; ga <= 360; ga += 7) {
      for (let gb = 0; gb <= 360; gb += 11) {
        vicino(norma(tensore(qubitDa(ga), qubitDa(gb))), 1, 1e-12);
      }
    }
  });

  test('LA COSA: qualunque prodotto di due qubit ha incrocio ZERO', () => {
    for (let ga = 0; ga <= 360; ga += 3) {
      for (let gb = 0; gb <= 360; gb += 3) {
        const psi = tensore(qubitDa(ga), qubitDa(gb));
        assert.ok(Math.abs(incrocio(psi)) < 1e-12, `${ga}°/${gb}°: incrocio ${incrocio(psi)}`);
        assert.ok(separabile(psi));
        vicino(groviglio(psi), 0, 1e-12);
      }
    }
  });

  test('le dimensioni si moltiplicano, non si sommano', () => {
    assert.equal(tensore([1, 0], [1, 0]).length, 4);
    assert.equal(tensoreM([1, 0, 0, 1], [1, 0, 0, 1]).length, 16);
  });
});

describe('lo stato di Bell non si separa', () => {
  const bell = STATI.find(s => s.id === 'bell').psi;

  test('il suo incrocio vale mezzo, non zero', () => {
    vicino(Math.abs(incrocio(bell)), 0.5, 1e-9);
    assert.ok(!separabile(bell));
    vicino(groviglio(bell), 1, 1e-9);          // massimamente entangled
  });

  test('e nessuna coppia di qubit ci arriva, provandole tutte su una griglia fitta', () => {
    let migliore = Infinity;
    for (let ga = 0; ga < 360; ga += 0.5) {
      const a = qubitDa(ga);
      for (let gb = 0; gb < 360; gb += 0.5) {
        const d = Math.hypot(...tensore(a, qubitDa(gb)).map((v, i) => v - bell[i]));
        if (d < migliore) migliore = d;
      }
    }
    /* il minimo teorico della distanza fra Bell e l'insieme dei prodotti
       è √(2 − √2) ≈ 0.765: se il gioco promettesse che si può fare,
       mentirebbe */
    assert.ok(migliore > 0.7, `qualcuno ci è arrivato a ${migliore}: Bell sarebbe separabile`);
    vicino(migliore, Math.sqrt(2 - Math.SQRT2), 5e-3);
  });

  test('anche l\'altro stato di Bell del gioco è entangled', () => {
    const altro = STATI.find(s => s.id === 'bell-meno').psi;
    assert.ok(!separabile(altro));
    vicino(groviglio(altro), 1, 1e-9);
  });

  test('fattorizza restituisce null quando non si può, invece di inventare', () => {
    assert.equal(fattorizza(bell), null);
    assert.equal(fattorizza(STATI.find(s => s.id === 'bell-meno').psi), null);
  });
});

describe('quando invece si separa, la fattorizzazione è giusta', () => {
  test('sugli stati separabili del gioco, i due qubit trovati ricostruiscono lo stato', () => {
    for (const s of STATI.filter(x => separabile(x.psi))) {
      const f = fattorizza(s.psi);
      assert.ok(f, `${s.id}: separabile ma senza fattorizzazione`);
      vicinoV(tensore(f.a, f.b), s.psi, 1e-9);
    }
  });

  test('e su mille prodotti costruiti a caso, il giro completo torna', () => {
    let seme = 31337;
    const rnd = () => { seme = (seme * 1103515245 + 12345) % 2147483648; return (seme / 2147483648) * 180; };
    for (let i = 0; i < 1000; i++) {
      const psi = tensore(qubitDa(rnd()), qubitDa(rnd()));
      const f = fattorizza(psi);
      assert.ok(f, `stato ${psi} non fattorizzato`);
      vicinoV(tensore(f.a, f.b), psi, 1e-9);
    }
  });

  test('i bersagli del primo gioco stanno dentro la corsa dei cursori', () => {
    for (const b of BERSAGLI_T) {
      assert.ok(b.a >= 0 && b.a <= 90 && b.b >= 0 && b.b <= 90, `bersaglio ${b.id} fuori scala`);
    }
  });
});

describe('la CNOT: la porta che lega', () => {
  test('non è il prodotto tensoriale di nessuna coppia di porte da un qubit', () => {
    /* si prova con una griglia di rotazioni: se la CNOT fosse separabile,
       una di queste combinazioni la riprodurrebbe */
    let seme = 777;
    const rnd = () => { seme = (seme * 1103515245 + 12345) % 2147483648; return (seme / 2147483648) * 4 - 2; };
    let migliore = Infinity;
    for (let i = 0; i < 4000; i++) {
      const A = [rnd(), rnd(), rnd(), rnd()], B = [rnd(), rnd(), rnd(), rnd()];
      const d = Math.hypot(...tensoreM(A, B).map((v, k) => v - CNOT[k]));
      if (d < migliore) migliore = d;
    }
    assert.ok(migliore > 0.3, `una coppia di porte separate ha quasi riprodotto la CNOT (${migliore})`);
  });

  test('e infatti trasforma uno stato separabile in uno entangled', () => {
    /* |+⟩⊗|0⟩ entra separabile ed esce come lo stato di Bell */
    const dentro = tensore(qubitDa(45), qubitDa(0));
    assert.ok(separabile(dentro));
    const fuori = applica4(CNOT, dentro);
    assert.ok(!separabile(fuori), 'la CNOT non ha creato entanglement');
    vicino(groviglio(fuori), 1, 1e-9);
    vicinoV(fuori, [Math.SQRT1_2, 0, 0, Math.SQRT1_2], 1e-9);
  });

  test('ma su |0⟩⊗|0⟩ non fa niente: l\'entanglement serve la sovrapposizione', () => {
    const dentro = tensore(qubitDa(0), qubitDa(0));
    const fuori = applica4(CNOT, dentro);
    assert.ok(separabile(fuori));
    vicinoV(fuori, dentro, 1e-12);
  });

  test('due porte separate NON possono creare entanglement, per quanto si provi', () => {
    const H = [Math.SQRT1_2, Math.SQRT1_2, Math.SQRT1_2, -Math.SQRT1_2];
    const X = [0, 1, 1, 0];
    for (const A of [H, X, [1, 0, 0, 1]]) {
      for (const B of [H, X, [1, 0, 0, 1]]) {
        for (let ga = 0; ga < 180; ga += 15) {
          for (let gb = 0; gb < 180; gb += 15) {
            const fuori = applica4(tensoreM(A, B), tensore(qubitDa(ga), qubitDa(gb)));
            assert.ok(separabile(fuori, 1e-9), 'due porte separate hanno legato i qubit');
          }
        }
      }
    }
  });
});

describe('normalizzazione', () => {
  test('normalizza porta la lunghezza a 1 e lascia stare il vettore nullo', () => {
    vicino(norma(normalizza([3, 4, 0, 0])), 1, 1e-12);
    vicinoV(normalizza([0, 0, 0, 0]), [0, 0, 0, 0]);
  });
});
