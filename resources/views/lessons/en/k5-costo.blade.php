@php($description = 'Computational complexity explained by playing: log N, N, N log N, N squared and 2 to the N side by side, with real computing times. The yardstick for what quantum advantage means.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { confronto } from '/js/core/confronto.js';
import { costLab } from '/js/widgets/classic2.js';

const L = renderLesson({
  id: 'k5-costo',
  lead: `"Fast" means nothing unless you say <b>compared to what</b>. In computer science an algorithm is judged
         like this: when the problem doubles, how much does the work grow? Does it double too? Does it go up by
         one? Times four? To the square of the universe? There are five possible answers, and the whole
         difference between a solved problem and an impossible one is which of the five you get.`,

  steps: [
    {
      t: 'The five curves, and what living inside them feels like',
      html: `<table class="table">
               <tr><th>Cost</th><th>Name</th><th>If N doubles…</th><th>Example</th></tr>
               <tr><td class="mono">log N</td><td>logarithmic</td><td>+1 operation</td><td>binary search (K·4)</td></tr>
               <tr><td class="mono">√N</td><td>root</td><td>×1.41</td><td>Grover (level 11)</td></tr>
               <tr><td class="mono">N</td><td>linear</td><td>×2</td><td>reading a list</td></tr>
               <tr><td class="mono">N·log N</td><td>near linear</td><td>slightly more than ×2</td><td>sorting, FFT (level 17)</td></tr>
               <tr><td class="mono">N²</td><td>quadratic</td><td>×4</td><td>comparing all with all, DFT (level 16)</td></tr>
               <tr><td class="mono">2ⁿ</td><td>exponential</td><td>×2 for <b>every extra bit</b></td><td>trying all keys</td></tr>
             </table>
             <p>The table reads in ten seconds but you do not <b>feel</b> it. To feel it you need to turn
             operations into <b>time</b>. Move the slider and watch the six curves — the vertical scale is
             logarithmic, otherwise the last one would leave the screen at N = 30 already.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'costo', title: 'The exponential wall', text: 'find the first N for which 2^N passes one year of computing.', xp: 40 });
        el.appendChild(m.root);
        costLab(el, { onWin: () => m.complete() });
      },
      after: `<div class="callout key"><b>The number to remember is 55.</b> A computer doing a billion operations
              per second takes less than a second for 2³⁰, an hour for 2⁴², <b>more than a year</b> for 2⁵⁵ and
              more than the age of the universe for 2¹⁰⁰. It is not about buying a better machine: doubling the
              computer's power buys you <b>one bit</b>. One.</div>`,
    },
    {
      t: 'Why constants do not count (and when they do)',
      html: `<p>Saying an algorithm "costs N²" throws away a lot: the exact number of operations, the processor
             speed, whether the code is well written. That is on purpose. You write <b>O(N²)</b> and read it as
             "grows like N²".</p>
             <p>The reason is in the graph: an N² algorithm written terribly on a 1990 computer still beats a
             2ⁿ algorithm written beautifully on a supercomputer, as soon as N gets big enough. The <b>shape</b>
             of the curve always wins over the constant, sooner or later.</p>
             <div class="callout warn"><b>But "sooner or later" can be very far away.</b> It is the classic mistake
             of reading only the theory: there are algorithms with constants so enormous that they are unusable
             despite a better curve. And this applies <b>precisely to quantum</b>: an operation on qubits today is
             millions of times slower and more fragile than an operation on bits. A quadratic advantage like
             Grover's, with those constants, in many practical cases does not show up at all — while an
             exponential advantage like Shor's sweeps any constant away.</div>`,
    },
    {
      t: 'The vocabulary you need to read the headlines',
      html: `<ul>
               <li><b>P</b> — problems that can be <b>solved</b> in polynomial time (N, N², N³…). The land of
                   "it can be done".</li>
               <li><b>NP</b> — problems whose solution, <b>if somebody hands it to you</b>, can be checked in
                   polynomial time. A solved sudoku is verified in a minute; solving it is another story.</li>
               <li><b>P = NP?</b> — the million-dollar question: is solving always as easy as checking? Almost
                   nobody believes so, nobody can prove it.</li>
               <li><b>NP-complete</b> — the hardest of the NP class, all equivalent to each other (travelling
                   salesman, knapsack, graph colouring…). Solve one quickly and you solve them all.</li>
               <li><b>BQP</b> — the problems a <b>quantum</b> computer solves in polynomial time.</li>
             </ul>
             <div class="callout key"><b>The sentence that is worth the whole level:</b> it is not known whether
             BQP contains the NP-complete problems, and <b>almost every expert thinks it does not</b>. Factoring
             — the thing Shor solves — is <b>not</b> NP-complete: it is a special case with a hidden structure
             (a periodicity) that the quantum machine can exploit. When you read "quantum computers will solve
             the impossible problems", know that it is almost always false: they will quickly solve <b>some</b>
             problems that have the right structure.</div>`,
      after: confronto({
        titolo: 'The catalogue of quantum advantages, for what they are worth',
        livello: '20-shor',
        vaiA: 'Go to Shor (level 20)',
        classico: {
          titolo: 'What it costs today',
          html: `<ul class="mb0">
                   <li>Search without structure: <b>N</b></li>
                   <li>Fourier transform: <b>N·log N</b> (FFT)</li>
                   <li>Factoring a number of n binary digits: <b>about 2^(n^⅓)</b> — practically exponential</li>
                   <li>Simulating 50 quantum particles: <b>2⁵⁰ numbers</b>, impossible</li>
                 </ul>`,
        },
        quantistico: {
          titolo: 'What it would cost',
          html: `<ul class="mb0">
                   <li>Grover: <b>√N</b> — a <b>quadratic</b> gain</li>
                   <li>QFT: <b>log²N</b> gates — but the result cannot be read out in full (level 18)</li>
                   <li>Shor: <b>about n³</b> — an <b>exponential</b> gain, and that is the big one</li>
                   <li>Quantum simulation: <b>polynomial</b> — the original reason Feynman proposed the whole
                       thing, in 1981</li>
                 </ul>`,
        },
        numeri: [
          { cosa: 'AES-128 key (brute force)', classico: '2¹²⁸', quantistico: '2⁶⁴ (Grover)' },
          { cosa: 'RSA-2048 (factoring)', classico: 'billions of years', quantistico: 'hours, on a machine that does not exist yet' },
          { cosa: 'travelling salesman', classico: 'exponential', quantistico: 'exponential (no known gain)' },
        ],
        verdetto: `<b>Three rows, three different verdicts.</b> A quadratic advantage is offset by doubling the
                   keys; an exponential one rebuilds the world's cryptography; and for most hard problems <b>no</b>
                   advantage is known at all. Anyone telling you about quantum computing in a single line is
                   telling you a fairy tale.`,
      }),
    },
    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> With the slider at N = 40: how many operations does an N² algorithm do, and how many does a 2ⁿ one? How many times more?</p>
        <p><b>2.</b> A computer 1000 times faster moves the 2ⁿ wall by how many bits? <span class="muted">(1000 ≈ 2¹⁰: ten bits. Ten.)</span></p>
        <p><b>3.</b> If Grover takes 2¹²⁸ down to 2⁶⁴, what does it do to 2²⁵⁶? Why is the post-quantum recommendation "double the key"?</p>
        <p class="mb0"><b>4.</b> Inventor's question: which of the six curves describes "looking a word up in a paper dictionary"? And "comparing every photo with every other photo"?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'An O(2ⁿ) algorithm: what happens when you add ONE bit to the problem?',
      options: ['the work grows by 1', 'the work doubles', 'the work squares', 'nothing changes'], correct: 1,
      why: 'Every bit doubles it. That is why buying a twice-as-fast computer buys you a single bit.' },
    { q: 'Why are multiplicative constants ignored?',
      options: ['because they cannot be computed', 'because as N grows the shape of the curve dominates anyway', 'out of laziness', 'because all computers are the same'], correct: 1,
      why: 'The curve wins sooner or later. But "sooner or later" can be far: on real quantum hardware the constants matter a lot.' },
    { q: 'Is factoring, the thing Shor solves, an NP-complete problem?',
      options: ['yes, the hardest of all', 'no: it is a special case with a hidden periodic structure', 'yes, but only for large numbers', 'the question makes no sense'], correct: 1,
      why: 'It is not NP-complete. The quantum machine exploits it because there is a periodicity to find, not because it "solves hard problems".' },
    { q: 'Grover\'s gain is…',
      options: ['exponential', 'quadratic', 'logarithmic', 'nil'], correct: 1,
      why: 'From N to √N: it halves the exponent. That is why doubling symmetric key lengths is enough.' },
  ],

  outro: `<div class="callout ok"><b>What you take home:</b> the cost of an algorithm is measured by how it grows,
          not by how fast it is today; polynomial and exponential are two different worlds; and quantum
          advantages come in two clearly distinct kinds, quadratic and exponential, with incomparable
          consequences. Next level: the last thing to know about classical computing, the one that explains why
          the quantum machine is built the way it is.</div>`,
});
@endsection
