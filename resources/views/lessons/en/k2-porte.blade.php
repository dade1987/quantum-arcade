@php($description = 'AND, OR, NOT, XOR and NAND explained by playing: truth tables, the universal gate, and counting the questions you must ask a black box. Classical gates before quantum gates.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { confronto } from '/js/core/confronto.js';
import { logicLab, nandForge } from '/js/widgets/classic.js';

const L = renderLesson({
  id: 'k2-porte',
  lead: `Bits on their own do nothing: they just sit there. Computing starts when something <b>transforms</b>
         them. That something is called a <b>logic gate</b>, a piece of circuit that takes one or two bits and
         produces a new one. There is a handful of them, you learn them in ten minutes, and everything your
         phone can do is built out of them.`,

  steps: [
    {
      t: 'The five words of all computing',
      html: `<p>A gate is fully described by its <b>truth table</b>: what comes out, for every combination of
             what goes in. Four rows, and there is nothing else to know.</p>
             <table class="table">
               <tr><th>A</th><th>B</th><th>AND<br><span class="muted">both</span></th><th>OR<br><span class="muted">at least one</span></th><th>XOR<br><span class="muted">exactly one</span></th><th>NAND<br><span class="muted">not both</span></th></tr>
               <tr><td class="mono">0</td><td class="mono">0</td><td class="mono">0</td><td class="mono">0</td><td class="mono">0</td><td class="mono">1</td></tr>
               <tr><td class="mono">0</td><td class="mono">1</td><td class="mono">0</td><td class="mono">1</td><td class="mono">1</td><td class="mono">1</td></tr>
               <tr><td class="mono">1</td><td class="mono">0</td><td class="mono">0</td><td class="mono">1</td><td class="mono">1</td><td class="mono">1</td></tr>
               <tr><td class="mono">1</td><td class="mono">1</td><td class="mono">1</td><td class="mono">1</td><td class="mono">0</td><td class="mono">0</td></tr>
             </table>
             <p>The sixth is <b>NOT</b>, which has a single input and flips it: 0 becomes 1 and 1 becomes 0.</p>
             <div class="callout key"><b>XOR is the one to watch.</b> It means "one yes and the other no", and it
             is the same thing as "add, and throw away the carry": 1 + 1 = 10, keep the 0. At level K·3 we will
             build addition out of it, and at level 4 you will find that the quantum gate <b>CNOT</b> does
             exactly an XOR — only, it does it without destroying anything.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'porte', title: 'The mystery gate', text: 'switch to "mystery gate" and identify two boxes, counting the questions you need.', xp: 30 });
        el.appendChild(m.root);
        logicLab(el, { sfide: 2, onWin: () => m.complete() });
      },
      after: `<div class="callout"><b>Did you count the questions?</b> To be <b>certain</b> which gate is inside
              the box you must try all four input combinations: the box answers one question at a time, and no
              strategy lets you skip the last try. That number — <b>4 questions for 2 input bits</b>, that is
              2ⁿ questions for n bits — is the wall a classical computer hits every time it has to work out
              what a function looks like. At levels 9 and 10 you will see two quantum algorithms climb over it.</div>`,
    },
    {
      t: 'One gate is enough for all the others',
      html: `<p>Here is a surprising fact you can check by hand: <b>NAND</b> alone is enough. With NANDs only you
             can build NOT, AND, OR, XOR — and therefore any circuit, and therefore any program. NAND is called
             a <b>universal</b> gate.</p>
             <p>The recipes are short:</p>
             <ul>
               <li><b>NOT A</b> = NAND(A, A) — put the same wire into both inputs</li>
               <li><b>AND</b> = NOT(NAND(A, B)) — a NAND, then a NAND acting as a NOT</li>
               <li><b>OR</b> = NAND(NOT A, NOT B) — this is De Morgan's law</li>
               <li><b>XOR</b> = four NANDs, and it is the piece you need in order to add</li>
             </ul>
             <div class="callout warn"><b>Before you build, the thing that confuses everybody.</b> In the
             workshop below every gate is summed up by <b>four digits</b> — <span class="mono">0001</span>,
             say. Those are not four outputs: the inputs are still <b>two</b>, A and B, and <b>one single
             bit</b> comes out of each gate. The four digits are that same gate <b>tried four times</b>, once
             per possible combination of A and B — <span class="mono">00</span>, <span class="mono">01</span>,
             <span class="mono">10</span>, <span class="mono">11</span>: it is the truth table above, written
             on a single line. In the workshop A and B are real switches: flip them and watch which of the four
             columns you are trying right now.</div>
             <p><b>How to read the workshop.</b> You get four NAND gates, called
             <span class="mono">G1 G2 G3 G4</span> — the <b>G</b> is for <i>gate</i>. For each one you choose
             where its two inputs come from: from A, from B, or from the output of an <b>earlier</b> gate
             (backwards is not allowed: in a real circuit that wire would have nothing to carry yet). The
             <b>network output</b> is the last choice to make, and it says which of the four gates you read at
             the end: the bit coming out of that one is the result of the whole network, and any gate that does
             not reach it counts for nothing.</p>
             <p>Then build: choose where each wire comes from. Every box tells you where it takes its two
             inputs from, which bit comes out of it <i>right now</i>, and its full table, so you can check the
             chain one piece at a time instead of guessing. If you would rather follow the recipe, the
             <b>"show me the steps"</b> button reveals it one step at a time, and each step says which number
             must come out: if that is not what you get, the mistake is right there.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'nand', title: 'NAND workshop', text: 'build NOT, AND and OR using NAND gates only.', xp: 45 });
        el.appendChild(m.root);
        nandForge(el, { onWin: () => m.complete() });
      },
      after: confronto({
        titolo: 'Classical gates and quantum gates',
        livello: '03-porte',
        vaiA: 'Go to the quantum gates (level 3)',
        classico: {
          titolo: 'A logic gate',
          html: `<p>Takes <b>two bits</b> and returns <b>one</b>. A bit disappears at every gate: 00, 01 and 10 all
                 give 0, and looking at the output you no longer know where you came from.</p>
                 <p>There is a universal set: <b>NAND</b> alone is enough for everything.</p>`,
        },
        quantistico: {
          titolo: 'A quantum gate',
          html: `<p>Takes n qubits and returns <b>n</b>: nothing is lost, and every gate can be <b>run backwards</b>.
                 It is not a style choice — physics does not allow anything else (level K·6).</p>
                 <p>Universal sets exist here too (H, T and CNOT, for instance), and for the same reason: a few
                 bricks, combined, make all the rest.</p>`,
        },
        numeri: [
          { cosa: 'bits/qubits in and out', classico: '2 → 1', quantistico: 'n → n' },
          { cosa: 'can you run it backwards?', classico: 'no (except NOT)', quantistico: 'always' },
          { cosa: 'universal set', classico: '{ NAND }', quantistico: '{ H, T, CNOT }' },
        ],
        verdetto: `<b>The difference is not power, it is conservation.</b> A classical gate may throw information
                   away; a quantum gate never may. Out of that constraint — which looks like a limitation —
                   comes everything the quantum machine can do extra.`,
      }),
    },
    {
      t: 'From gates to a computer, in three steps',
      html: `<p>It looks like a huge jump, and instead it is a short ladder:</p>
             <ol>
               <li><b>Gates → functions.</b> Any truth table, however large, can be built out of AND, OR and NOT
                   (write one line of circuit for every row of the table that gives 1).</li>
               <li><b>Functions → memory.</b> Two NANDs wired in a loop hold their own state: that is a
                   <b>latch</b>, the grandfather of RAM. Memory is not a different component: it is a circuit
                   looking at its own tail.</li>
               <li><b>Memory + functions → processor.</b> A block that can add and compare (the ALU), registers
                   to hold the numbers, and a counter saying which instruction is next.</li>
             </ol>
             <div class="callout warn"><b>The point almost everyone skips:</b> a computer does not "understand"
             anything and does not try paths. It pushes current through a net of switches, one configuration at
             a time, billions of times a second. When at level 9 you read "the quantum computer evaluates the
             function on all inputs at once", remember this line: what changes is not the speed of the switches,
             it is what flows in the wires.</div>`,
    },
    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> In the game, which gate behaves like "the two inputs are <b>different</b>"? And which like "they are the same"?</p>
        <p><b>2.</b> Try NAND(A, A) in the workshop: which gate comes out? Why?</p>
        <p><b>3.</b> With the mystery gate: if after three questions you got 1, 1, 1, which gates are still possible?</p>
        <p class="mb0"><b>4.</b> Inventor's question: XOR has a curious property — applied twice with the same B, it gives A back unchanged. Can you think what that is good for? <span class="muted">(it is the simplest encryption there is, and it is also why the quantum CNOT is reversible)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'The XOR gate gives 1 when…',
      options: ['both inputs are 1', 'the inputs are different from each other', 'at least one input is 1', 'both are 0'], correct: 1,
      why: 'XOR = "one yes and the other no". It is also binary addition without the carry.' },
    { q: 'What does it mean that NAND is a universal gate?',
      options: ['that it is the fastest', 'that with NANDs only you can build any other gate', 'that it is the only reversible one', 'that it draws less current'], correct: 1,
      why: 'NOT, AND, OR and XOR can all be built out of NANDs alone: therefore any circuit at all.' },
    { q: 'At minimum, how many tries do you need to know for sure which 2-input gate is hidden in a black box?',
      options: ['1', '2', '4', 'depends on luck'], correct: 2,
      why: 'All four input combinations: the box answers one question at a time.' },
    { q: 'Why can a classical AND gate not be used as it is in a quantum circuit?',
      options: ['it is too slow', 'it throws information away and is not reversible', 'it needs too much current', 'it works on bits and not on numbers'], correct: 1,
      why: 'From a 0 output you cannot get back to the inputs. Quantum gates must be reversible: you use Toffoli (level K·6).' },
  ],

  outro: `<div class="callout ok"><b>What you take home:</b> classical computing is a net of switches transforming
          bits, one piece at a time, throwing information away at every step.
          Next level: let us put these gates together and make them do the most elementary thing there is —
          an addition.</div>`,
});
@endsection
