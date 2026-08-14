/* Test del livello su equazioni, formule inverse e funzioni.
 *
 * Le due promesse del livello sono verificabili, e vengono verificate qui:
 * (1) le mosse della bilancia non cambiano MAI la risposta — se la cambiassero
 * il gioco insegnerebbe l'opposto dell'algebra; (2) le macchine dichiarate
 * «senza ritorno» hanno davvero due ingressi diversi con la stessa uscita,
 * cioè l'informazione è persa davvero e non per modo di dire. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  EQUAZIONI, MOSSE, soluzione, risolta, MACCHINE_F, reversibile,
} from '../../../public_html/js/widgets/equazioni.js';

const copia = eq => JSON.parse(JSON.stringify(eq));

describe('la bilancia: le mosse non cambiano la risposta', () => {
  test('ogni mossa, su ogni equazione, lascia la soluzione dov\'era', () => {
    for (const eq of EQUAZIONI) {
      const attesa = soluzione(eq);
      for (const [nome, mossa] of Object.entries(MOSSE)) {
        let stato = copia(eq);
        // dieci mosse di fila della stessa specie: la risposta non deve muoversi
        for (let i = 0; i < 10; i++) {
          stato = mossa(stato);
          const dopo = soluzione(stato);
          if (dopo === null) continue;   // «0 = 0»: vera per ogni x, non è un errore
          assert.ok(Math.abs(dopo - attesa) < 1e-9,
            `${eq.id}: dopo ${i + 1} mosse "${nome}" la soluzione è ${dopo} invece di ${attesa}`);
        }
      }
    }
  });

  test('mescolando mosse a caso la risposta resta la stessa', () => {
    const nomi = Object.keys(MOSSE);
    for (const eq of EQUAZIONI) {
      const attesa = soluzione(eq);
      let stato = copia(eq);
      // sequenza fissa (niente caso: un test deve dare lo stesso esito ogni volta)
      for (let i = 0; i < 30; i++) {
        stato = MOSSE[nomi[(i * 7 + eq.id.charCodeAt(0)) % nomi.length]](stato);
        const dopo = soluzione(stato);
        if (dopo !== null) assert.ok(Math.abs(dopo - attesa) < 1e-9, `${eq.id}: soluzione scivolata a ${dopo}`);
      }
    }
  });

  /* Se un'equazione non fosse risolvibile con i bottoni che il gioco offre, la
     missione resterebbe aperta per sempre — e con lei il livello. */
  test('ogni equazione si risolve con le mosse offerte, in pochi passi', () => {
    for (const eq of EQUAZIONI) {
      let coda = [[copia(eq), 0]];
      const visti = new Set();
      let passi = null;
      while (coda.length && passi === null) {
        const [stato, n] = coda.shift();
        if (risolta(stato)) { passi = n; break; }
        if (n >= 6) continue;
        for (const mossa of Object.values(MOSSE)) {
          const nuovo = mossa(stato);
          if (Math.abs(nuovo.sx.x) > 12 || Math.abs(nuovo.dx.n) > 40) continue;
          const chiave = JSON.stringify(nuovo);
          if (visti.has(chiave)) continue;
          visti.add(chiave);
          coda.push([nuovo, n + 1]);
        }
      }
      assert.ok(passi !== null && passi <= 6, `l'equazione ${eq.id} non si chiude con i bottoni del gioco`);
    }
  });

  test('«risolta» vuol dire davvero una scatola sola, e il numero giusto', () => {
    for (const eq of EQUAZIONI) {
      const finale = { sx: { x: 1, n: 0 }, dx: { x: 0, n: soluzione(eq) } };
      assert.ok(risolta(finale));
      assert.ok(!risolta(eq), `${eq.id} risulta già risolta in partenza`);
      assert.equal(soluzione(finale), soluzione(eq));
    }
  });
});

describe('le macchine: si torna indietro o no', () => {
  test('le macchine reversibili ritrovano sempre il numero di partenza', () => {
    for (const m of MACCHINE_F.filter(reversibile)) {
      for (let x = -6; x <= 6; x++) {
        assert.ok(Math.abs(m.indietro(m.f(x)) - x) < 1e-9, `${m.id} non torna indietro da ${x}`);
      }
    }
  });

  test('le macchine reversibili non fanno mai finire due numeri nello stesso posto', () => {
    for (const m of MACCHINE_F.filter(reversibile)) {
      const usciti = new Map();
      for (let x = -20; x <= 20; x++) {
        const y = m.f(x);
        assert.ok(!usciti.has(y), `${m.id}: ${usciti.get(y)} e ${x} escono uguali (${y})`);
        usciti.set(y, x);
      }
    }
  });

  /* Il contrario, che è la parte che insegna: le macchine senza ritorno devono
     esibire lo scontro, e lo scontro dichiarato dev'essere vero. */
  test('le macchine senza ritorno mostrano due ingressi diversi con la stessa uscita', () => {
    for (const m of MACCHINE_F.filter(x => !reversibile(x))) {
      assert.ok(Array.isArray(m.scontro), `${m.id} non dichiara nessuno scontro`);
      const [a, b] = m.scontro;
      assert.notEqual(a, b);
      assert.equal(m.f(a), m.f(b), `${m.id}: ${a} e ${b} non escono uguali`);
    }
  });

  test('il gioco offre abbastanza macchine di tutti e due i tipi per la missione', () => {
    assert.ok(MACCHINE_F.filter(reversibile).length >= 2);
    assert.ok(MACCHINE_F.filter(m => !reversibile(m)).length >= 2);
  });
});
