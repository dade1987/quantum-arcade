@php($description = 'A creative sandbox: assemble quantum pipelines out of blocks (Hadamard, oracle, QFT, diffuser), take on challenges with secret functions and try to solve them with as few queries as possible.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { officina } from '/js/widgets/officina.js';

const L = renderLesson({
  id: '22-officina',
  lead: `So far you have <b>retraced</b> algorithms invented by others. Now it is your turn: here there is no solution written
         anywhere. You have blocks, you have challenges with a secret function inside, and a counter that measures
         how clever you have been. <b>This level is not "finished": it is improved.</b>`,

  steps: [
    {
      t: "The inventor's palette",
      html: `<p>Every quantum algorithm you have seen is made of the same four beats:</p>
             <div class="formula" style="font-size:15px">
               <span class="hl-n">put everything into play</span> → <span class="hl-k">write the information into the phases</span>
               → <span class="hl-N">make it interfere</span> → <span class="hl-x">measure</span>
             </div>
             <table class="table">
               <tr><th>Block</th><th>What it does</th><th>Where you saw it</th></tr>
               <tr><td><b>H on all</b></td><td>all the possibilities with the same amplitude</td><td>levels 3, 9, 10, 11</td></tr>
               <tr><td><b>❓ ORACLE</b></td><td>the only thing that "knows" the answer. <b>Every use counts as one question</b></td><td>levels 9, 10, 11</td></tr>
               <tr><td><b>📢 Diffuser</b></td><td>reflects about the average: it amplifies what the oracle has marked</td><td>level 11 (Grover)</td></tr>
               <tr><td><b>QFT / QFT†</b></td><td>turns periodicity into peaks (and vice versa)</td><td>levels 18, 19, 20</td></tr>
               <tr><td><b>− on |0…0⟩</b> and <b>X on all</b></td><td>bricks for building different diffusers</td><td>—</td></tr>
             </table>
             <div class="callout key"><b>The rule of the game:</b> the winner is whoever solves the challenge with <b>the fewest
             oracle queries</b>. It does not matter how many gates you use: what matters is how many times you ask. It is exactly the criterion by which
             algorithms are measured in real research (<i>query complexity</i>).</div>`,
    },
    {
      t: 'The workshop',
      html: `<p>Choose a challenge, build the pipeline, press <b>LAUNCH</b>, look at the histogram and try to give the answer.
             If you get it wrong nothing happens: change the pipeline and try again.</p>
             <p><b>The four challenges</b> (and your minimum target):</p>
             <ul>
               <li><b>Constant or balanced?</b> — target: <b>1 query</b>.</li>
               <li><b>The secret string</b> — target: <b>1 query</b>.</li>
               <li><b>Find the needle</b> — target: <b>2 queries</b> with N = 8 (optimal Grover).</li>
               <li><b>Find the period</b> — target: <b>1 query</b> + the right transform.</li>
             </ul>`,
      mount: (el, api) => {
        const m1 = api.mission({ key: 'solve1', title: 'First victory', text: 'solve any challenge.', xp: 60 });
        const m2 = api.mission({ key: 'solve-eff', title: 'With a single question', text: 'solve a challenge using ONE single oracle query.', xp: 90 });
        el.append(m1.root, m2.root);
        officina(el, {
          n: 3,
          onSolve: ({ queries }) => { m1.complete(); if (queries <= 1) m2.complete(); },
        });
      },
      after: `<div class="callout"><b>If the bars are all equal after the launch</b>, it means that you have put everything into play
              and queried the oracle, but you have not made anything <b>interfere</b>: the measurement will give you a random result.
              The third beat is missing. Try adding H on all (or a QFT) <b>after</b> the oracle.</div>`,
    },
    {
      t: 'How a quantum algorithm really gets invented',
      html: `<p>There is no recipe, but there is a <b>method</b> that researchers genuinely use. Try it in here:</p>
             <ol>
               <li><b>Ask yourself what structure the problem has.</b> Periodic? Linear? No structure at all?
                   Without structure the most you can get is Grover (√N): that is proven.</li>
               <li><b>Find a way of writing that structure into the phases.</b> That is the role of the oracle:
                   it turns "which x do I care about" into "which x have a different sign".</li>
               <li><b>Find the transformation that makes that structure visible.</b>
                   Hadamard if the structure is linear (Bernstein–Vazirani), QFT if it is periodic (Shor),
                   a diffuser if it is a single marked element (Grover).</li>
               <li><b>Count the queries and the depth.</b> If your algorithm uses 1000 gates to save
                   one question, on real hardware you have lost.</li>
               <li><b>Try to beat it classically.</b> Half the announced "quantum advantages" have fallen this way.
                   If you cannot beat it, maybe you have something.</li>
             </ol>
             <div class="callout think"><b>Open challenges to try in here</b> (none of them has a solution written on the site):
             <ol style="margin:8px 0 0">
               <li>In the <b>period</b> challenge, the QFT after the oracle works. But do you really need <b>the whole</b> QFT,
                   or is something simpler enough when r is a power of 2?</li>
               <li>In the <b>needle</b> challenge: what happens if you apply <b>two</b> oracles in a row with no diffuser in between?
                   And if you put the diffuser <b>before</b> the oracle?</li>
               <li>Can you build a pipeline that solves <b>two different challenges</b> without modification?</li>
               <li>Design a pipeline that, instead of giving the certain answer, gives it with 70% probability
                   but using <b>fewer</b> queries. Is that an acceptable trade-off? When?</li>
               <li>Invent a <b>fifth challenge</b> you would like to exist, and ask yourself which block you are missing
                   in order to solve it. That missing block is, very probably, a new algorithm.</li>
             </ol></div>`,
    },
    {
      t: 'Your notebook',
      html: `<p>Algorithms do not come out right first time. Keep track of what you have tried — even just on paper —
             with three columns: <b>pipeline</b>, <b>queries used</b>, <b>what I observed</b>.
             The "what I observed" is the column that counts: that is where the patterns show up.</p>
             <div class="callout ok"><b>A piece of advice from someone who programs:</b> when a pipeline does something unexpected,
             <b>do not delete it</b>. First understand <i>why</i> it did that. Half of scientific discoveries have
             started with a "strange, that was not supposed to happen".</div>
             <p class="dim small">If you find something interesting, write to me about it: the best player pipelines
             will end up in a dedicated section of this site, with the name of whoever found them.</p>`,
    },
  ],

  quiz: [
    { q: 'What is the structure common to all the quantum algorithms seen in the course?',
      options: ['measure → gate → measure', 'superposition → oracle (phases) → interference → measurement', 'copy → compare → choose', 'entanglement → teleportation'], correct: 1,
      why: 'Only the third beat changes: Hadamard for linear structures, QFT for periodic structures, a diffuser for a marked element.' },
    { q: 'If after the oracle all the probabilities stay equal, what is missing?',
      options: ['more qubits', 'a transformation that makes the amplitudes interfere', 'more queries', 'nothing, it is fine as it is'], correct: 1,
      why: 'The oracle writes into the phases, which are invisible to the measurement. Without an interference step (H, QFT, diffuser) the result is random.' },
    { q: 'For a problem with no structure at all, the maximum achievable quantum advantage is…',
      options: ['exponential', 'quadratic (Grover)', 'none', 'infinite'], correct: 1,
      why: 'It is a proven limit: with no structure to exploit, not even a quantum computer can do better than about √N queries.' },
  ],

  outro: `<div class="callout ok"><b>There is no "completed" for this level, and that is fine.</b>
          Come back here every time you get an idea. Two stages are left: the <b>glossary</b> with the complete map
          of the whole journey, and the <b>final exam</b> with the certificate.</div>`,
});
@endsection
