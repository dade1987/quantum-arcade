/* Test dell'officina del NAND (livello K·2).
 *
 * Qui non si collauda il disegno: si collaudano le ricette che il gioco INSEGNA.
 * L'esercizio si può risolvere a tentativi, quindi un aiuto sbagliato — un filo
 * scritto male, una firma promessa che non viene — non se ne accorgerebbe
 * nessuno: chi legge penserebbe di aver capito male lui. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  CASI, valoriNand, firmeNand, porteCollegate, RICETTE_NAND, PARTENZA_NAND, PORTE, firma,
} from '../../../public_html/js/widgets/classic.js';

/** Monta i fili di una ricetta e ritorna [in1, in2, uscita]. */
function montaggio(ricetta) {
  const in1 = ['A', 'A', 'A', 'A'], in2 = ['A', 'A', 'A', 'A'];
  for (const p of ricetta.passi) { in1[p.gate - 1] = p.in[0]; in2[p.gate - 1] = p.in[1]; }
  return [in1, in2, 'G' + ricetta.passi[ricetta.passi.length - 1].gate];
}

describe('la rete di quattro NAND', () => {
  test('un NAND da solo è NAND, e i quattro casi sono in ordine 00 01 10 11', () => {
    const [f1] = firmeNand(['A', 'A', 'A', 'A'], ['B', 'A', 'A', 'A']);
    assert.equal(f1, '1110');
    assert.equal(f1, firma(PORTE.NAND));
    assert.deepEqual(CASI, [[0, 0], [0, 1], [1, 0], [1, 1]]);
  });

  test('la firma è la stessa porta provata nei quattro casi, non quattro uscite', () => {
    const in1 = ['A', 'A', 'A', 'A'], in2 = ['B', 'A', 'A', 'A'];
    const perCaso = CASI.map(([a, b]) => valoriNand(in1, in2, a, b)[0]);
    assert.equal(perCaso.join(''), firmeNand(in1, in2)[0]);
  });

  test('un filo che va all\'indietro non ha valore: al suo posto c\'è un punto', () => {
    // G1 pesca da G2, che viene dopo: in un circuito quel filo non esisterebbe
    const f = firmeNand(['G2', 'A', 'A', 'A'], ['B', 'B', 'A', 'A']);
    assert.equal(f[0], '····');
    assert.equal(f[1], '1110');            // G2 invece è un NAND regolare
  });

  test('all\'uscita arrivano solo le porte collegate, risalendo i fili', () => {
    const in1 = ['A', 'G1', 'A', 'A'], in2 = ['B', 'G1', 'A', 'A'];
    assert.deepEqual([...porteCollegate(in1, in2, 'G2')].sort(), [0, 1]);
    assert.deepEqual([...porteCollegate(in1, in2, 'G4')], [3]);
  });

  test('un anello fra due porte non manda in loop il conteggio', () => {
    const in1 = ['G2', 'G1', 'A', 'A'], in2 = ['G2', 'G1', 'A', 'A'];
    assert.deepEqual([...porteCollegate(in1, in2, 'G1')].sort(), [0, 1]);
  });
});

describe('le ricette insegnate dal gioco', () => {
  for (const [nome, ricetta] of Object.entries(RICETTE_NAND)) {
    test(`${nome}: montata come dice l'aiuto, dà davvero ${ricetta.firma}`, () => {
      const [in1, in2, uscita] = montaggio(ricetta);
      const firme = firmeNand(in1, in2);
      assert.equal(firme[Number(uscita[1]) - 1], ricetta.firma);
    });

    test(`${nome}: ogni passo promette la firma che poi esce davvero`, () => {
      const [in1, in2] = montaggio(ricetta);
      const firme = firmeNand(in1, in2);
      for (const p of ricetta.passi) {
        assert.equal(firme[p.gate - 1], p.firma,
          `il passo su G${p.gate} promette ${p.firma}`);
      }
    });

    test(`${nome}: usa solo porte già montate, mai una che viene dopo`, () => {
      for (const p of ricetta.passi) {
        for (const filo of p.in) {
          if (filo[0] !== 'G') continue;
          assert.ok(Number(filo[1]) < p.gate, `G${p.gate} non può pescare da ${filo}`);
        }
      }
    });
  }

  test('le firme dei bersagli sono quelle delle porte vere', () => {
    assert.equal(RICETTE_NAND.AND.firma, firma(PORTE.AND));
    assert.equal(RICETTE_NAND.OR.firma, firma(PORTE.OR));
    assert.equal(RICETTE_NAND.XOR.firma, firma(PORTE.XOR));
    assert.equal(RICETTE_NAND['NOT A'].firma, firma(a => PORTE.NOT(a)));
  });

  test('la rete di partenza non è già la risposta di nessun bersaglio', () => {
    // altrimenti il gioco si dichiara vinto prima che l'utente tocchi qualcosa,
    // e chi legge «FATTO!» senza aver fatto niente non impara niente
    const { in1, in2, uscita } = PARTENZA_NAND;
    const partenza = firmeNand(in1, in2)[Number(uscita[1]) - 1];
    for (const [nome, ricetta] of Object.entries(RICETTE_NAND)) {
      assert.notEqual(partenza, ricetta.firma, `si parte già con ${nome} montata`);
    }
  });

  test('nessuna ricetta spreca porte: AND ne usa 2, OR 3, XOR 4', () => {
    assert.equal(RICETTE_NAND['NOT A'].passi.length, 1);
    assert.equal(RICETTE_NAND.AND.passi.length, 2);
    assert.equal(RICETTE_NAND.OR.passi.length, 3);
    assert.equal(RICETTE_NAND.XOR.passi.length, 4);
  });
});
