@php($description = 'The single mechanism behind every quantum algorithm: amplitudes are added before squaring, so opposite routes can cancel each other out.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { circuitLab } from '/js/widgets/circuit.js';
import { manyArrows } from '/js/widgets/twowaves.js';

const L = renderLesson({
  id: '07-interferenza',
  lead: `You have already seen interference in action (two H gates bringing the qubit back to zero). Now we look it in the face,
         because it is the <b>only</b> mechanism that makes a quantum computer useful. Everything else is trimming.`,

  steps: [
    {
      t: 'Several routes to the same result',
      html: `<p>Here is the complete rule of quantum computation, in two lines:</p>
             <div class="callout key">
               <b>1.</b> If a result can be reached in <b>several different ways</b>, you <b>add the amplitudes</b> of all those ways.<br>
               <b>2.</b> Only <b>at the end</b>, when you measure, do you square to get the probability.
             </div>
             <p>It sounds like a trivial detail. It is not. In the classical world you add <b>probabilities</b>
             (always positive numbers), so more routes = more probability. In the quantum world you add
             <b>amplitudes</b>, which can have opposite signs and therefore <b>cancel out</b>.</p>
             <table class="table">
               <tr><th>Situation</th><th>Classical world</th><th>Quantum world</th></tr>
               <tr><td>two routes, each at 50%</td><td>0.5 + 0.5 = <b>100%</b></td><td>amplitudes +0.7 and +0.7 → sum 1.4 → prob. 100%… <span class="muted">(too much!)</span></td></tr>
               <tr><td>two routes with opposite signs</td><td>does not exist</td><td>amplitudes +0.7 and −0.7 → sum <b>0</b> → prob. <b>0%</b></td></tr>
             </table>
             <p class="dim small">(The "too much" in the first row sorts itself out: quantum gates are built so that
             the total always stays 100%. That is the unitarity rule from level 3.)</p>
             <div class="callout"><b>Names to know:</b> when amplitudes add up and the result becomes more likely
             it is called <b>constructive interference</b>; when they cancel, <b>destructive interference</b>.</div>`,
    },
    {
      t: 'The full H · H calculation (done once and for all)',
      html: `<p>Let us redo the level-1 calculation, but this time counting the <b>routes</b>. Start from |0⟩ and apply H twice.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'The possible routes', html: 'After the first H the qubit is "both 0 and 1". After the second, to reach the final result <b>1</b> there are <b>two routes</b>:<br>• route A: 0 → 0 → 1<br>• route B: 0 → 1 → 1' },
          { h: 'Amplitude of route A', html: 'H|0⟩ gives amplitude <b>+1/√2</b> to 0. Then from 0 the second H gives <b>+1/√2</b> to 1.<br>Route amplitude = (+1/√2) × (+1/√2) = <b>+1/2</b>.' },
          { h: 'Amplitude of route B', html: 'H|0⟩ gives amplitude <b>+1/√2</b> to 1. Then from 1 the second H gives <b>−1/√2</b> to 1 (the line with the minus!).<br>Route amplitude = (+1/√2) × (−1/√2) = <b>−1/2</b>.' },
          { h: 'They add up', html: '(+1/2) + (−1/2) = <b>0</b>.<br>Probability of reading 1 = 0² = <b>0%</b>. That result will <b>never</b> come out.' },
          { h: 'And the result 0?', html: 'The two routes give (+1/√2)(+1/√2) = +1/2 and (+1/√2)(+1/√2) = +1/2 → sum <b>1</b> → probability <b>100%</b>.<br>That is why H·H|0⟩ = |0⟩ every time.' },
          { h: 'The moral', html: 'A quantum computer does not "try every route and pick the best". <b>It travels every route at once and arranges for the wrong ones to cancel each other out.</b> If you remember one sentence from this course, make it this one.' },
        ], { doneLabel: 'The sum works out!' });
      },
      after: `<p>Check it with your own hands: in the lab below load the <b>H·H = identity</b> preset,
              then use the "run step by step" slider to see the amplitudes before and after.
              Then try <b>H·Z·H</b>: change <i>one single sign</i> in the middle and the final result flips completely.</p>`,
    },
    {
      t: 'Try it on the simulator',
      html: `<p>Put both situations to the test. A tip: look at the <b>colour</b> of the bars — bars of opposite colour
             are amplitudes of opposite sign, that is, candidates to cancel at the next gate.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'hzh', title: 'Flip the result', text: 'build H → Z → H on q0 and get |1⟩ at 100%.', xp: 45 });
        el.appendChild(m.root);
        circuitLab(el, {
          n: 1, maxCols: 6, preset: 'hh',
          title: 'Interference test bench', subtitle: '1 qubit, few gates, plenty of substance',
          onChange: ({ ops, state }) => {
            const seq = ops.map(o => o.g).join(',');
            const p1 = state.re[1] ** 2 + state.im[1] ** 2;
            if (seq === 'H,Z,H' && p1 > 0.99) m.complete();
          },
        });
      },
    },
    {
      t: 'When two signs are no longer enough',
      html: `<p>So far the amplitudes have only been <b>positive or negative</b>: two directions only, forwards and backwards.
             With only two directions you can do two things: add up (+ and +) or cancel (+ and −).</p>
             <p>But imagine having <b>eight</b> possibilities and wanting to cancel seven of them, leaving just one standing.
             With only two signs you cannot: you need amplitudes pointing in <b>many different directions</b>,
             so that they can <b>close the circle</b> and add up to zero.</p>
             <p>Play with the disorder below: with all arrows equal the sum is enormous, with scattered arrows it is zero.
             The "directions" are the degrees from level 0·2.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'cancella', title: 'Make it all vanish', text: 'take the disorder to 360° with at least 20 arrows and get a sum close to zero.', xp: 40 });
        el.appendChild(m.root);
        manyArrows(el, { onChange: ({ n, mag }) => { if (n >= 20 && mag < n * 0.25) m.complete(); } });
      },
      after: `<div class="callout key"><b>This is why complex numbers arrive at the next level.</b>
              Not to show off: because we need <b>arrows that point in any direction</b>,
              and complex numbers are exactly the handy way of writing them. Everything you learn
              at level 8 serves this precise purpose.</div>`,
    },
    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> In the simulator try <b>H → X → H</b> on one qubit. What result do you expect? Check.
           <span class="muted">(|0⟩ comes out: X on the equator makes a different kind of turn)</span></p>
        <p><b>2.</b> With 3 arrows, which directions make them cancel exactly? <span class="muted">(0°, 120°, 240°)</span></p>
        <p><b>3.</b> If an algorithm has to produce <b>one</b> answer out of 8, how many amplitudes must it cancel?
           And what will the final histogram look like?</p>
        <p class="mb0"><b>4.</b> A question to keep in your pocket until level 11 (Grover): is there a way of doing the cancellations
           <b>little by little</b> instead of all at once?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'In quantum computation, when a result can be reached in two different ways…',
      options: ['you add the probabilities', 'you add the amplitudes, and only at the end do you square', 'you take the larger one', 'you multiply the probabilities'], correct: 1,
      why: 'That is the fundamental rule. Adding amplitudes before squaring is what allows cancellation: adding probabilities (always positive) could never give zero.' },
    { q: 'Two amplitudes +0.5 and −0.5 meeting give a probability of…',
      options: ['50%', '25%', '0%', '100%'], correct: 2,
      why: 'Sum = 0, square = 0. That result is never observed: destructive interference.' },
    { q: 'Why does H·H bring the qubit back exactly to |0⟩?',
      options: ['because H is random', 'because the two routes to |1⟩ have opposite amplitudes and cancel', 'because H measures the qubit', 'by convention'], correct: 1,
      why: 'The routes to |1⟩ are +1/2 and −1/2: sum zero. Those to |0⟩ are +1/2 and +1/2: sum 1.' },
    { q: 'Why will we need "arrow" amplitudes instead of just positive/negative ones?',
      options: ['to do the arithmetic faster', 'to be able to cancel many possibilities in a controlled way, not just in pairs', 'because qubits are complicated', 'to represent more than 2 qubits'], correct: 1,
      why: 'With only two signs you can only add or cancel pairs. With arrows in many directions you can make many amplitudes close the circle together: that is the QFT mechanism.' },
  ],

  outro: `<div class="callout ok"><b>What you take home:</b> amplitudes are <b>added</b>, then squared;
          opposite amplitudes cancel; a quantum algorithm is a <b>direction of cancellations</b>.
          Next level: we give amplitudes the freedom to point anywhere.</div>`,
});
@endsection
