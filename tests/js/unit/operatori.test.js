/* Test del livello sugli operatori.
 *
 * Quattro affermazioni forti, tutte controllabili al numero:
 *
 *  1. una matrice unitaria NON cambia la lunghezza di nessuna freccia —
 *     e non «quasi»: su ogni angolo, a 1e-12. È il motivo per cui le
 *     porte quantistiche devono essere unitarie;
 *  2. una matrice hermitiana ha SEMPRE autovalori reali. Se fosse falso
 *     anche in un caso, «l'osservabile dà un numero leggibile» sarebbe
 *     una speranza invece che un teorema;
 *  3. un proiettore applicato due volte è come applicato una volta, e i
 *     due proiettori complementari sommati danno l'identità: sono le
 *     due facce del «misurare due volte dà lo stesso risultato»;
 *  4. le porte che il corso usa (X, Z, H) sono unitarie E hermitiane —
 *     cioè specchiate — e infatti applicate due volte tornano a capo. */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  applica, prodotto, aggiunta, IDENTITA, unitaria, hermitiana, proiettore,
  traccia, determinante, autovalori, fattoreLunghezza,
  proiettoreSu, probabilita, MACCHINE, DIREZIONI,
} from '../../../public_html/js/widgets/operatori.js';

const vicino = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);
const perAngolo = (passo, f) => { for (let g = 0; g < 360; g += passo) f([Math.cos((g * Math.PI) / 180), Math.sin((g * Math.PI) / 180)], g); };

/* un generatore di casi ripetibile: niente Math.random nei test */
let seme = 4242;
const rnd = () => { seme = (seme * 1103515245 + 12345) % 2147483648; return seme / 2147483648 * 4 - 2; };

describe('l\'aggiunto', () => {
  test('ribaltare due volte riporta alla matrice di partenza', () => {
    for (let i = 0; i < 200; i++) {
      const M = [rnd(), rnd(), rnd(), rnd()];
      assert.deepEqual(aggiunta(aggiunta(M)), M);
    }
  });

  test('la proprietà che lo definisce: ⟨Mv, w⟩ = ⟨v, M†w⟩', () => {
    /* è la definizione vera dell'aggiunto, quella che nel caso complesso
       resta identica: qui si controlla che il «ribalta» la soddisfi */
    const punto = (a, b) => a[0] * b[0] + a[1] * b[1];
    for (let i = 0; i < 200; i++) {
      const M = [rnd(), rnd(), rnd(), rnd()];
      const v = [rnd(), rnd()], w = [rnd(), rnd()];
      vicino(punto(applica(M, v), w), punto(v, applica(aggiunta(M), w)), 1e-9);
    }
  });
});

describe('unitaria = non cambia le lunghezze', () => {
  test('le macchine unitarie del gioco lasciano ogni lunghezza intatta', () => {
    for (const m of MACCHINE.filter(x => unitaria(x.m))) {
      perAngolo(1, v => vicino(fattoreLunghezza(m.m, v), 1, 1e-12));
    }
  });

  test('e quelle non unitarie la cambiano davvero, su almeno una freccia', () => {
    for (const m of MACCHINE.filter(x => !unitaria(x.m))) {
      let cambia = false;
      perAngolo(5, v => { if (Math.abs(fattoreLunghezza(m.m, v) - 1) > 1e-6) cambia = true; });
      assert.ok(cambia, `${m.id}: dichiarata non unitaria ma non cambia mai le lunghezze`);
    }
  });

  test('una rotazione di qualunque angolo è unitaria', () => {
    for (let g = 0; g < 360; g += 7) {
      const r = (g * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
      assert.ok(unitaria([c, -s, s, c]), `la rotazione di ${g}° dovrebbe essere unitaria`);
    }
  });

  test('il prodotto di due unitarie è unitario: due porte di fila sono ancora una porta', () => {
    const u = MACCHINE.filter(x => unitaria(x.m)).map(x => x.m);
    for (const A of u) for (const B of u) assert.ok(unitaria(prodotto(A, B), 1e-9));
  });

  test('una unitaria conserva anche gli angoli, non solo le lunghezze', () => {
    const punto = (a, b) => a[0] * b[0] + a[1] * b[1];
    for (const m of MACCHINE.filter(x => unitaria(x.m))) {
      for (let i = 0; i < 100; i++) {
        const v = [rnd(), rnd()], w = [rnd(), rnd()];
        vicino(punto(applica(m.m, v), applica(m.m, w)), punto(v, w), 1e-9);
      }
    }
  });
});

describe('hermitiana = autovalori reali', () => {
  test('su duemila matrici simmetriche a caso il delta non è MAI negativo', () => {
    for (let i = 0; i < 2000; i++) {
      const a = rnd(), b = rnd(), d = rnd();
      const M = [a, b, b, d];
      assert.ok(hermitiana(M));
      const av = autovalori(M);
      assert.ok(av.reali, `matrice ${M}: autovalori non reali`);
      assert.ok(av.delta >= -1e-12, `delta negativo: ${av.delta}`);
    }
  });

  test('e gli autovalori trovati annullano davvero il polinomio caratteristico', () => {
    for (let i = 0; i < 500; i++) {
      const a = rnd(), b = rnd(), d = rnd();
      const M = [a, b, b, d];
      for (const l of autovalori(M).valori) {
        vicino(l * l - traccia(M) * l + determinante(M), 0, 1e-8);
      }
    }
  });

  test('una matrice NON simmetrica può avere autovalori complessi: la rotazione', () => {
    const rot = MACCHINE.find(m => m.id === 'rot').m;
    assert.ok(!hermitiana(rot));
    assert.ok(!autovalori(rot).reali, 'la rotazione di 90° non dovrebbe avere autovalori reali');
  });
});

describe('unitaria E hermitiana insieme: le specchiate', () => {
  test('X, Z e H sono tutte e due, e applicate due volte tornano all\'identità', () => {
    for (const id of ['X', 'Z', 'H']) {
      const M = MACCHINE.find(m => m.id === id).m;
      assert.ok(unitaria(M), `${id} non unitaria`);
      assert.ok(hermitiana(M), `${id} non hermitiana`);
      prodotto(M, M).forEach((x, i) => vicino(x, IDENTITA[i], 1e-9));
    }
  });

  test('i loro autovalori sono +1 e −1: è la firma di una specchiata', () => {
    for (const id of ['X', 'Z', 'H']) {
      const av = autovalori(MACCHINE.find(m => m.id === id).m);
      assert.ok(av.reali);
      vicino(av.valori[0], -1, 1e-9);
      vicino(av.valori[1], 1, 1e-9);
    }
  });
});

describe('il proiettore', () => {
  test('applicarlo due volte è come applicarlo una volta, per ogni direzione', () => {
    for (let g = 0; g < 180; g += 3) {
      const P = proiettoreSu(g);
      assert.ok(proiettore(P), `il proiettore su ${g}° non è idempotente`);
      prodotto(P, P).forEach((x, i) => vicino(x, P[i], 1e-12));
    }
  });

  test('è hermitiano, ma NON unitario: schiaccia, quindi perde lunghezza', () => {
    for (let g = 0; g < 180; g += 15) {
      const P = proiettoreSu(g);
      assert.ok(hermitiana(P));
      assert.ok(!unitaria(P), `il proiettore su ${g}° non dovrebbe essere unitario`);
    }
  });

  test('i due proiettori perpendicolari sommati danno l\'identità', () => {
    for (let g = 0; g < 180; g += 3) {
      const P = proiettoreSu(g), Q = proiettoreSu(g + 90);
      P.forEach((x, i) => vicino(x + Q[i], IDENTITA[i], 1e-12));
    }
  });

  test('e i suoi autovalori sono 0 e 1: «ci sei» oppure «non ci sei»', () => {
    for (let g = 0; g < 180; g += 15) {
      const av = autovalori(proiettoreSu(g));
      vicino(av.valori[0], 0, 1e-9);
      vicino(av.valori[1], 1, 1e-9);
    }
  });
});

describe('le probabilità della misura', () => {
  test('le due ombre al quadrato sommano sempre a 1', () => {
    for (const d of DIREZIONI) {
      perAngolo(1, v => {
        const [a, b] = probabilita(v, d);
        vicino(a + b, 1, 1e-12);
      });
    }
  });

  test('uno stato allineato con la direzione di misura dà certezza', () => {
    for (const d of DIREZIONI) {
      const r = (d * Math.PI) / 180;
      const [a, b] = probabilita([Math.cos(r), Math.sin(r)], d);
      vicino(a, 1, 1e-12);
      vicino(b, 0, 1e-12);
    }
  });

  test('uno stato a 45° dalla direzione dà esattamente 50 e 50', () => {
    for (const d of DIREZIONI) {
      const r = ((d + 45) * Math.PI) / 180;
      const [a, b] = probabilita([Math.cos(r), Math.sin(r)], d);
      vicino(a, 0.5, 1e-12);
      vicino(b, 0.5, 1e-12);
    }
  });

  test('e la probabilità non dipende dalla lunghezza dello stato: conta solo la direzione', () => {
    for (const d of DIREZIONI) {
      for (const L of [0.3, 1, 7]) {
        const r = (37 * Math.PI) / 180;
        const [a] = probabilita([L * Math.cos(r), L * Math.sin(r)], d);
        const [a1] = probabilita([Math.cos(r), Math.sin(r)], d);
        vicino(a, a1, 1e-12);
      }
    }
  });
});
