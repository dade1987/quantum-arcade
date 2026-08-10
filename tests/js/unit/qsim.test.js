/* Test unitari del simulatore quantistico: ogni funzione pubblica, ogni ramo. */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  zeroState, basisState, fromAmps, clone, normalize, GATES, P, RX, RY, RZ,
  applyGate, swap, phaseIf, probs, label, sample, probQubit1, measureQubit,
  measureRegister, blochVector, opMatrix, applyOp, runCircuit, circuitMatrix,
  qftOps, qftGateCount, hadamardAll, phaseOracle, groverDiffusion,
  gcd, modpow, periodOf, continuedFraction,
  functionOracle, extractInput, solveMod2, parita,
} from '../../../public_html/js/core/qsim.js';

const vicino = (a, b, t = 1e-9) => Math.abs(a - b) < t;

describe('stati', () => {
  test('zeroState parte da |0…0⟩', () => {
    const s = zeroState(3);
    assert.equal(s.re.length, 8);
    assert.equal(s.re[0], 1);
    assert.equal(probs(s)[0], 1);
  });

  test('basisState mette tutta l\'ampiezza dove chiedo', () => {
    const s = basisState(2, 3);
    assert.equal(s.re[3], 1);
  });

  test('fromAmps normalizza e accetta numeri o complessi', () => {
    const s = fromAmps(1, [1, 1]);
    assert.ok(vicino(s.re[0], Math.SQRT1_2));
    const c = fromAmps(1, [{ re: 3 }, { re: 4 }]);
    assert.ok(vicino(c.re[0], 0.6) && vicino(c.re[1], 0.8));
  });

  test('clone è indipendente dall\'originale', () => {
    const a = zeroState(1); const b = clone(a);
    b.re[0] = 0.5;
    assert.equal(a.re[0], 1);
  });

  test('normalize gestisce anche il vettore nullo senza dividere per zero', () => {
    const s = zeroState(1); s.re[0] = 0;
    assert.doesNotThrow(() => normalize(s));
  });

  test('label scrive i bit con gli zeri davanti', () => {
    assert.equal(label(5, 4), '0101');
  });
});

describe('porte a un qubit', () => {
  test('X scambia le ampiezze', () => {
    const s = zeroState(1); applyGate(s, 0, GATES.X.m);
    assert.ok(vicino(probs(s)[1], 1));
  });

  test('ogni porta applicata due volte torna al punto di partenza (o quasi)', () => {
    for (const g of ['X', 'Y', 'Z', 'H']) {
      const s = zeroState(1);
      applyGate(s, 0, GATES[g].m); applyGate(s, 0, GATES[g].m);
      assert.ok(vicino(probs(s)[0], 1), g + ' non è la sua inversa');
    }
  });

  test('S e T ruotano la fase senza toccare le probabilità', () => {
    const s = zeroState(1);
    applyGate(s, 0, GATES.H.m);
    const prima = probs(s)[1];
    applyGate(s, 0, GATES.S.m); applyGate(s, 0, GATES.T.m);
    assert.ok(vicino(probs(s)[1], prima));
  });

  test('S† e T† disfano S e T', () => {
    const s = zeroState(1); applyGate(s, 0, GATES.H.m);
    applyGate(s, 0, GATES.S.m); applyGate(s, 0, GATES.Sdg.m);
    applyGate(s, 0, GATES.T.m); applyGate(s, 0, GATES.Tdg.m);
    assert.ok(vicino(s.im[1], 0));
  });

  test('P, RX, RY, RZ sono matrici valide e reversibili', () => {
    for (const R of [P, RX, RY, RZ]) {
      const s = zeroState(1);
      applyGate(s, 0, GATES.H.m);
      applyGate(s, 0, R(0.7));
      applyGate(s, 0, R(-0.7));
      assert.ok(vicino(probs(s)[0], 0.5, 1e-9));
    }
  });

  test('H·Z·H equivale a X', () => {
    const s = zeroState(1);
    applyGate(s, 0, GATES.H.m); applyGate(s, 0, GATES.Z.m); applyGate(s, 0, GATES.H.m);
    assert.ok(vicino(probs(s)[1], 1));
  });

  test('I non fa niente', () => {
    const s = zeroState(1); applyGate(s, 0, GATES.I.m);
    assert.equal(s.re[0], 1);
  });
});

describe('porte controllate, swap e oracoli', () => {
  test('CNOT non agisce se il controllo è 0', () => {
    const s = zeroState(2);
    applyGate(s, 1, GATES.X.m, [0]);
    assert.ok(vicino(probs(s)[0], 1));
  });

  test('CNOT agisce se il controllo è 1', () => {
    const s = zeroState(2);
    applyGate(s, 0, GATES.X.m);
    applyGate(s, 1, GATES.X.m, [0]);
    assert.ok(vicino(probs(s)[3], 1));
  });

  test('swap scambia i qubit e swap su sé stesso non fa nulla', () => {
    const s = basisState(2, 1);
    swap(s, 0, 1);
    assert.ok(vicino(probs(s)[2], 1));
    swap(s, 0, 0);
    assert.ok(vicino(probs(s)[2], 1));
  });

  test('phaseIf cambia solo la fase degli stati scelti', () => {
    const s = zeroState(1); applyGate(s, 0, GATES.H.m);
    const p = probs(s).slice();
    phaseIf(s, i => i === 1, Math.PI);
    assert.ok(vicino(s.re[1], -Math.SQRT1_2));
    assert.deepEqual(Array.from(probs(s)).map(x => +x.toFixed(9)), Array.from(p).map(x => +x.toFixed(9)));
  });
});

describe('misura', () => {
  test('probQubit1 legge la probabilità del singolo qubit', () => {
    const s = zeroState(2); applyGate(s, 0, GATES.H.m);
    assert.ok(vicino(probQubit1(s, 0), 0.5));
    assert.ok(vicino(probQubit1(s, 1), 0));
  });

  test('measureQubit collassa e il secondo risultato è certo', () => {
    const s = zeroState(1); applyGate(s, 0, GATES.H.m);
    const b1 = measureQubit(s, 0, () => 0.1);
    const b2 = measureQubit(s, 0, () => 0.9);
    assert.equal(b1, b2, 'dopo il collasso il risultato deve ripetersi');
  });

  test('measureRegister ricompone il numero letto', () => {
    const s = basisState(3, 5);           // 101
    assert.equal(measureRegister(s, [0, 1, 2]), 5);
  });

  test('sample rispetta le probabilità agli estremi', () => {
    const s = zeroState(2);
    assert.equal(sample(s, () => 0.999), 0);
  });

  test('sample con rnd = 1 non esce dall\'array', () => {
    const s = zeroState(2);
    assert.ok(sample(s, () => 1) < 4);
  });

  test('sample ricade sull\'ultimo indice se gli arrotondamenti non arrivano a 1', () => {
    // stato con probabilità che sommano appena meno di 1: il ramo di sicurezza
    const s = zeroState(2);
    s.re[0] = 0.5; s.re[3] = 0.5;      // volutamente NON normalizzato
    assert.equal(sample(s, () => 0.999999), 3);
  });
});

describe('sfera di Bloch', () => {
  test('|0⟩ è al polo nord', () => {
    assert.ok(vicino(blochVector(zeroState(1), 0).z, 1));
  });

  test('H|0⟩ punta su +X, S·H|0⟩ su +Y', () => {
    const a = zeroState(1); applyGate(a, 0, GATES.H.m);
    assert.ok(vicino(blochVector(a, 0).x, 1));
    applyGate(a, 0, GATES.S.m);
    assert.ok(vicino(blochVector(a, 0).y, 1));
  });

  test('in uno stato di Bell i singoli qubit hanno freccia nulla', () => {
    const s = zeroState(2);
    applyGate(s, 0, GATES.H.m); applyGate(s, 1, GATES.X.m, [0]);
    assert.ok(vicino(blochVector(s, 0).purity, 0));
  });
});

describe('circuiti', () => {
  test('opMatrix riconosce tutte le porte parametriche', () => {
    for (const g of ['P', 'RX', 'RY', 'RZ']) assert.equal(opMatrix({ g, p: 0.3 }).length, 4);
    assert.equal(opMatrix({ g: 'H' }).length, 4);
  });

  test('opMatrix protesta se la porta non esiste', () => {
    assert.throws(() => opMatrix({ g: 'PIPPO' }), /sconosciuta/);
  });

  test('applyOp gestisce SWAP e MEASURE', () => {
    const s = basisState(2, 1);
    applyOp(s, { g: 'SWAP', t: 0, t2: 1 });
    assert.ok(vicino(probs(s)[2], 1));
    applyOp(s, { g: 'MEASURE', t: 0 });          // non deve rompere nulla
    assert.ok(vicino(probs(s)[2], 1));
  });

  test('runCircuit restituisce uno stato per ogni passo, più quello iniziale', () => {
    const f = runCircuit([{ g: 'H', t: 0 }, { g: 'X', t: 0 }], zeroState(1));
    assert.equal(f.length, 3);
  });

  test('circuitMatrix della QFT coincide con la matrice di Fourier', () => {
    for (const n of [1, 2, 3]) {
      const N = 1 << n;
      const M = circuitMatrix(qftOps(n), n);
      for (let col = 0; col < N; col++) {
        for (let row = 0; row < N; row++) {
          const th = 2 * Math.PI * col * row / N;
          assert.ok(vicino(M[col].re[row], Math.cos(th) / Math.sqrt(N), 1e-9));
          assert.ok(vicino(M[col].im[row], Math.sin(th) / Math.sqrt(N), 1e-9));
        }
      }
    }
  });

  test('qftOps senza swap ne produce di meno, e l\'inversa disfa la diretta', () => {
    assert.ok(qftOps(3, { swaps: false }).length < qftOps(3).length);
    const s = basisState(3, 5);
    for (const op of qftOps(3)) applyOp(s, op);
    for (const op of qftOps(3, { inverse: true })) applyOp(s, op);
    assert.ok(vicino(probs(s)[5], 1, 1e-9));
  });

  test('qftGateCount conta H, rotazioni e swap', () => {
    assert.equal(qftGateCount(10), 60);
  });
});

describe('mattoni degli algoritmi', () => {
  test('hadamardAll mette tutte le possibilità alla pari', () => {
    const s = zeroState(3); hadamardAll(s, [0, 1, 2]);
    for (const p of probs(s)) assert.ok(vicino(p, 1 / 8));
  });

  test('Grover porta l\'elemento marcato oltre il 90% e poi lo fa ricalare', () => {
    const s = zeroState(3); hadamardAll(s, [0, 1, 2]);
    const storia = [];
    for (let i = 0; i < 4; i++) {
      phaseOracle(s, x => x === 5);
      groverDiffusion(s, [0, 1, 2]);
      storia.push(probs(s)[5]);
    }
    assert.ok(storia[1] > 0.9);
    assert.ok(storia[3] < storia[1]);
  });
});

describe('aritmetica per Shor', () => {
  test('gcd', () => {
    assert.equal(gcd(12, 18), 6);
    assert.equal(gcd(7, 1), 1);
  });

  test('modpow anche con esponente 0 e numeri grandi', () => {
    assert.equal(modpow(7, 0, 15), 1);
    assert.equal(modpow(7, 4, 15), 1);
    assert.equal(modpow(2, 10, 1000), 24);
  });

  test('periodOf trova il periodo e si arrende quando non esiste', () => {
    assert.equal(periodOf(7, 15), 4);
    assert.equal(periodOf(2, 15), 4);
    assert.equal(periodOf(3, 15), null, 'MCD(3,15)≠1: nessun periodo');
  });

  test('continuedFraction ricostruisce le frazioni semplici', () => {
    assert.ok(continuedFraction(0.375, 16).conv.some(c => c.p === 3 && c.q === 8));
    assert.ok(continuedFraction(0.5, 8).conv.some(c => c.q === 2));
    assert.ok(continuedFraction(0, 8).conv.length >= 1);
  });
});

/* ------------------------------------------------------------------
   Simon: oracolo a due registri, estrazione e sistema mod 2.
   ------------------------------------------------------------------ */
describe('oracoli a due registri e algebra mod 2', () => {
  const NIN = 3, S = 0b101;
  // funzione due-a-uno con periodo XOR: f(x) = f(x ⊕ s)
  const f = x => Math.min(x, x ^ S);

  test('l\'oracolo scrive f(x) nel secondo registro senza toccare il primo', () => {
    const st = basisState(2 * NIN, 0b011);            // x = 3, y = 0
    functionOracle(st, NIN, NIN, f);
    const atteso = 0b011 | (f(3) << NIN);
    assert.ok(vicino(probs(st)[atteso], 1), 'tutta la probabilità sullo stato |x⟩|f(x)⟩');
  });

  test('applicato due volte torna al punto di partenza (è reversibile)', () => {
    const st = basisState(2 * NIN, 0b010);
    functionOracle(st, NIN, NIN, f);
    functionOracle(st, NIN, NIN, f);
    assert.ok(vicino(probs(st)[0b010], 1), 'y ⊕ f(x) ⊕ f(x) = y');
  });

  test('su una sovrapposizione crea entanglement fra i due registri', () => {
    const st = zeroState(2 * NIN);
    hadamardAll(st, [0, 1, 2]);
    functionOracle(st, NIN, NIN, f);

    // Float64Array.map riconverte a numeri: serve un array vero per accoppiare valore e indice
    const p = Array.from(probs(st));
    // 8 ingressi, ma solo 4 valori distinti di f: ogni coppia x, x⊕s condivide l'uscita
    const vivi = p.map((v, i) => [v, i]).filter(([v]) => v > 1e-9);
    assert.equal(vivi.length, 8);
    for (const [v, i] of vivi) {
      const x = i & 0b111, y = i >> NIN;
      assert.equal(y, f(x), 'ogni ramo ha l\'uscita coerente con il proprio ingresso');
      assert.ok(vicino(v, 1 / 8));
    }
  });

  test('misurata l\'uscita, l\'ingresso resta sui due x che collidono', () => {
    const st = zeroState(2 * NIN);
    hadamardAll(st, [0, 1, 2]);
    functionOracle(st, NIN, NIN, f);
    const letto = measureRegister(st, [3, 4, 5], () => 0.01);

    const dentro = extractInput(st, NIN, letto);
    const p = Array.from(probs(dentro));
    const sopravvissuti = p.map((v, i) => [v, i]).filter(([v]) => v > 1e-9).map(([, i]) => i);

    assert.equal(sopravvissuti.length, 2, 'esattamente due: x0 e x0 ⊕ s');
    assert.equal(sopravvissuti[0] ^ sopravvissuti[1], S, 'la loro differenza XOR È il segreto');
    assert.ok(vicino(p[sopravvissuti[0]], 0.5));
  });

  test('dopo le Hadamard finali sopravvivono solo le y ortogonali a s', () => {
    const st = zeroState(2 * NIN);
    hadamardAll(st, [0, 1, 2]);
    functionOracle(st, NIN, NIN, f);
    const letto = measureRegister(st, [3, 4, 5], () => 0.01);

    const dentro = extractInput(st, NIN, letto);
    hadamardAll(dentro, [0, 1, 2]);

    probs(dentro).forEach((v, y) => {
      if (v > 1e-9) assert.equal(parita(y & S), 0, `y=${y} deve soddisfare y·s = 0`);
    });
  });

  test('extractInput su un valore impossibile non divide per zero', () => {
    const st = zeroState(2 * NIN);
    const vuoto = extractInput(st, NIN, 0b111);
    assert.ok(probs(vuoto).every(v => v === 0));
  });

  test('parita conta i bit a 1', () => {
    assert.equal(parita(0), 0);
    assert.equal(parita(0b1011), 1);
    assert.equal(parita(0b1010), 0);
  });

  test('solveMod2 trova il segreto quando le equazioni bastano', () => {
    // s = 101: servono 2 equazioni indipendenti ortogonali a s
    const r = solveMod2([0b010, 0b111], 3);
    assert.equal(r.s, 0b101);
    assert.ok(r.unica);
    assert.equal(r.rango, 2);
  });

  test('con poche equazioni le soluzioni sono più d\'una (per questo si ripete)', () => {
    const r = solveMod2([0b010], 3);
    assert.ok(!r.unica);
    assert.ok(r.candidati.length > 1);
  });

  test('scarta le equazioni ripetute, nulle e dipendenti', () => {
    const r = solveMod2([0b010, 0b010, 0, 0b111, 0b101], 3);
    assert.equal(r.rango, 2, '0b101 = 0b010 ⊕ 0b111: non aggiunge informazione');
    assert.equal(r.s, 0b101);
  });

  test('senza equazioni nessun bit è vincolato', () => {
    const r = solveMod2([], 3);
    assert.equal(r.rango, 0);
    assert.equal(r.candidati.length, 7, 'tutti i segreti non nulli sono possibili');
  });
});
