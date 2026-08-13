@php($description = 'Quantum gates as rotations: X, Z, Y, H, S, T and P(θ), why they must be unitary and reversible, and why H·Z·H = X is the template of every algorithm.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { blochLab } from '/js/widgets/bloch.js';
import { formula, stepper } from '/js/core/formula.js';

const L = renderLesson({
  id: '03-porte',
  lead: `Quantum "gates" are the operations you can perform on a qubit. Good news: they are <b>all rotations</b>
         of the arrow on the sphere. None of them creates or destroys information — and that, as we will see, is not a detail.`,

  steps: [
    {
      t: 'The catalogue, in plain words',
      html: `<table class="table">
               <tr><th>Gate</th><th>What it does to the state</th><th>On the sphere</th><th>What it is for</th></tr>
               <tr><td class="mono"><b>X</b></td><td>swaps |0⟩ and |1⟩</td><td>flips north↔south (180° rotation about X)</td><td>it is the classical NOT</td></tr>
               <tr><td class="mono"><b>Z</b></td><td>leaves |0⟩, puts − on |1⟩</td><td>turns 180° along the equator</td><td>marks a possibility without changing its probability</td></tr>
               <tr><td class="mono"><b>Y</b></td><td>X and Z together (with an i)</td><td>180° rotation about Y</td><td>less used by hand, very handy in theory</td></tr>
               <tr><td class="mono"><b>H</b></td><td>creates/undoes superposition</td><td>takes a pole to the equator and back</td><td><b>the single most important gate</b></td></tr>
               <tr><td class="mono"><b>S</b></td><td>+90° phase on |1⟩</td><td>a quarter turn on the equator</td><td>fine phase control</td></tr>
               <tr><td class="mono"><b>T</b></td><td>+45° phase on |1⟩</td><td>an eighth of a turn</td><td>needed for universality (see below)</td></tr>
               <tr><td class="mono"><b>P(θ)</b></td><td>phase θ on |1⟩</td><td>rotation of θ on the equator</td><td>it is the building block of the <b>QFT</b>!</td></tr>
             </table>
             <p>Try them all: watch where the arrow ends up and read the state that appears underneath.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'porte', title: 'A tour of the gates', text: 'starting from |0⟩, can you take the qubit exactly to |1⟩ using ONLY H, Z and H? (then look at the probabilities)', xp: 40 });
        el.appendChild(m.root);
        blochLab(el, {
          onChange: (s, hist) => {
            const last3 = hist.slice(-3).join(',');
            if (last3 === 'H,Z,H' && (s.re[1] ** 2 + s.im[1] ** 2) > 0.99) m.complete();
          },
        });
      },
      after: `<div class="callout key"><b>The nicest discovery in this level:</b> <code>H · Z · H = X</code>.
              That is: a <b>phase</b> rotation (which on its own changes no probability at all!), sandwiched between two Hadamards,
              becomes a <b>full NOT</b>. It is the mechanism behind <b>every</b> quantum algorithm:
              you write the information into the phases, then use H to turn it into something <b>measurable</b>.</div>`,
    },
    {
      t: 'Gates as matrices (easy, I promise)',
      html: `<p>A gate is a little 2×2 table saying: "the new |0⟩ is obtained like this, the new |1⟩ like that".
             Applying it means doing two multiplications and two additions. Nothing else.</p>
             <pre><code>state:   [ a ]        gate X:  [ 0  1 ]        result:    [ b ]
         [ b ]                 [ 1  0 ]                   [ a ]     ← swapped!

gate Z:  [ 1   0 ]   →  [ a ]        gate H:  (1/√2)[ 1   1 ]  →  (1/√2)[ a+b ]
         [ 0  −1 ]      [−b ]                        [ 1  −1 ]           [ a−b ]</code></pre>
             <p>Look at the last one: <b>a+b</b> and <b>a−b</b>. That is why H is the gate of interference: it <b>adds</b> and
             <b>subtracts</b> the two amplitudes. If a and b are equal, a−b is <b>zero</b>: a possibility disappears.</p>`,
      mount: el => {
        formula(el, {
          title: 'Why gates have to be "unitary"',
          hint: 'Touch the pieces: there is a deep reason why not every 2×2 table is a valid gate.',
          parts: [
            { t: 'U', id: 'U', color: 'cyan', name: 'the gate', say: 'The little table describing the operation. It must preserve the total length of the state vector.' },
            { t: '† ', id: 'dag', color: 'violet', name: 'the "conjugate transpose"', say: 'Read "U dagger". It is the gate mirrored with its phases flipped: in practice, the gate that UNDOES U.' },
            { t: 'U = I', id: 'I', color: 'green', name: 'identity', say: 'Applying U and then U† has to bring everything back as it was. That guarantees two fundamental things: probabilities still add up to 1, and every operation is REVERSIBLE.', ex: 'H·H = I, X·X = I, S·S† = I. Try it in the game: apply the same gate twice and you return to the start.' },
          ],
        });
      },
      after: `<div class="callout warn"><b>An enormous consequence:</b> in quantum computing <b>there is no "delete"</b>.
              The classical AND gate takes two bits and returns one: it throws information away, and you cannot go back.
              A quantum gate, by contrast, is always <b>reversible</b>. It is the same principle as the
              <b>reversible computers</b> studied by Fredkin and Toffoli in the 1980s: computing without destroying
              information (and, in theory, without dissipating energy).</div>`,
    },
    {
      t: 'How many gates does it take to do everything?',
      html: `<p>Classically a handful of gates (NAND, for instance) is enough to build any circuit: they are said to be
             a <b>universal</b> set. In the quantum world something similar holds:</p>
             <div class="callout key"><b>{ H, T, CNOT }</b> is a universal set: with these three gates you can approximate
             <b>any</b> quantum operation to whatever precision you like.</div>
             <p>Why T (45°) and not just S (90°)? Because "convenient" angles (multiples of 90°) only give you a
             limited set of states, which a classical computer can simulate quickly (the Gottesman–Knill theorem).
             T "breaks the grid" and is what makes quantum computation hard to imitate classically.
             In real computers T is also the <b>most expensive</b> gate to build with error correction:
             designers literally count how many T's a circuit needs ("T-count").</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Check 1', html: 'In the game: apply <b>X</b> twice starting from |0⟩. Where do you end up? <br><b>|0⟩.</b> X·X = identity.' },
          { h: 'Check 2', html: 'Apply <b>S</b> four times. Each S turns by 90°, so 4×90° = 360°: back to the start. <b>S⁴ = I.</b>' },
          { h: 'Check 3', html: 'Apply <b>T</b> eight times: 8×45° = 360°. <b>T⁸ = I.</b> And two T\'s make an S (45+45 = 90).' },
          { h: 'Check 4 (the important one)', html: 'Apply <b>H</b>, then <b>Z</b>, then <b>H</b> starting from |0⟩: you land on <b>|1⟩</b>. A pure phase gate has become a NOT: <b>H·Z·H = X</b>.' },
          { h: 'The moral', html: 'Phase gates on their own "do nothing visible". But <b>sandwiched</b> between two Hadamards they become concrete operations. Every algorithm you will see is built on that sandwich: <b>H → something to the phases → H</b>.' },
        ], { doneLabel: 'Checked!' });
      },
    },
    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> Find two <b>different</b> gate sequences taking |0⟩ to the exact same state.
           <span class="muted">(example: H·H·H = H)</span></p>
        <p><b>2.</b> How many T's in a row make a Z? And how many to get back to the identity?</p>
        <p><b>3.</b> Using only H and P(θ), can you reach <b>any</b> point on the sphere? Try taking the arrow
           to a point you pick "at random".</p>
        <p class="mb0"><b>4.</b> An inventor's question (you will meet it again at level 22, the workshop): if an algorithm has to make
           the wrong answers <b>vanish</b>, which gate would you use to mark them and which to make them interfere?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What is H·Z·H?',
      options: ['Z', 'X', 'the identity', 'a measurement'], correct: 1,
      why: 'A phase rotation sandwiched between two Hadamards becomes a full NOT. It is the template of every quantum algorithm: phase → interference → measurable result.' },
    { q: 'Why are all quantum gates reversible?',
      options: ['for computational convenience', 'because they have to preserve total probability (they are unitary)', 'because they are slow', 'that is false: measurement is a gate'], correct: 1,
      why: 'Unitarity: U†U = I. It preserves the sum of the probabilities and makes every operation invertible. <b>Measurement</b> is in fact not a gate: it is the one irreversible operation.' },
    { q: 'A universal set of quantum gates is…',
      options: ['{X, Z}', '{H, T, CNOT}', '{measurement, H}', '{S, Z}'], correct: 1,
      why: 'With Hadamard, T and CNOT you can approximate any operation. With only "90°" gates you stay in the Clifford group, which is efficiently simulable classically.' },
    { q: 'The P(θ) gate applied to a qubit on the equator…',
      options: ['changes the measurement probabilities', 'rotates the phase without changing the probabilities', 'measures the qubit', 'creates entanglement'], correct: 1,
      why: 'It moves the longitude, not the latitude. But that phase will decide what adds up and what cancels at the next Hadamard — and it is precisely the building block of the QFT.' },
  ],

  outro: `<div class="callout ok"><b>What you take home:</b> every gate is a rotation; H creates and undoes superpositions;
          phase gates move the longitude; everything is reversible except measurement; <b>H·Z·H = X</b> is the template
          of every algorithm. Now we add the second qubit — and entanglement arrives.</div>`,
});
@endsection
