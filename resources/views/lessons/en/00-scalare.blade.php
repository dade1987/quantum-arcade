@php($description = 'The dot product explained as "how alike two arrows are": the two formulas, orthogonality as distinguishability, and quantum measurement as a projection. With the story of Gibbs, Heaviside and Dirac\'s notation.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { scalareLab, ombraLab } from '/js/widgets/scalare.js';

const L = renderLesson({
  id: '00-scalare',
  lead: `One symbol shows up in the quantum literature more than any other: <b>⟨φ|ψ⟩</b>. It looks like a hieroglyph and
         it is in fact something you can already judge by eye: <b>how much two arrows point the same way</b>. A single
         number. Out of that number come, with nothing added, orthogonality, length, the distance between two states
         and — the big one — <b>the rule for computing quantum probabilities</b>.`,

  steps: [
    {
      t: 'One number for "how well they agree"',
      html: `<p>Take two arrows. You would like a number telling you whether they point the same way, whether they are
             perpendicular, or whether they point opposite ways. That number exists, it is called the <b>dot product</b>,
             and it is computed like this:</p>
             <div class="formula">a · b = a<sub>x</sub>·b<sub>x</sub> + a<sub>y</sub>·b<sub>y</sub></div>
             <p>Multiply the coordinates pairwise and add. That is all. And the result says exactly what we wanted:</p>
             <ul>
               <li><b>large and positive</b> → the arrows roughly point the same way;</li>
               <li><b>zero</b> → they are <b>perpendicular</b>: not alike at all;</li>
               <li><b>negative</b> → they point opposite ways.</li>
             </ul>
             <p>In the game, drag the two tips and watch the number move. Hunt for the zero: that is the case that
             matters.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'scalare', title: 'Zero, maximum, negative', text: 'hit the 3 challenges by moving the two arrows.', xp: 40 });
        el.appendChild(m.root);
        scalareLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>The game also shows the other face of the same number:</p>
              <div class="formula">a · b = |a| · |b| · cos(angle between them)</div>
              <p>The two formulas <b>always</b> give the same result: the first is quick to compute, the second is easy
              to understand. And it explains why zero lands at 90°: the cosine of 90° is zero (level 0·3, the turning
              point: at the top, the horizontal shadow is nil).</p>
              <div class="callout key"><b>A bit of history.</b> This notation is not ancient: it comes from the 1880s,
              when <b>Josiah Willard Gibbs</b> and <b>Oliver Heaviside</b> took Hamilton's quaternion product — an
              unwieldy object — and split it into two more useful pieces: one returning a number (this one, the
              <i>scalar</i> product) and one returning an arrow (the vector product). The vector calculus taught today
              is that cut, made to get the equations of electromagnetism to work.</div>`,
    },

    {
      t: 'The shadow: how much of an arrow goes in a given direction',
      html: `<p>There is a way of reading the dot product worth more than the formula. Take a direction (an arrow of
             <b>length 1</b>) and ask: <b>how much of my arrow goes that way?</b></p>
             <p>The answer is its <b>shadow</b> on that direction — and the shadow is exactly the dot product with that
             direction.</p>
             <div class="callout key">It is the same shadow as in level 0·3: sine and cosine were the two shadows of a
             turning point, on the wall and on the floor. Now they have a general name: <b>projection</b>.</div>
             <p>Two immediate consequences, worth pausing on:</p>
             <ul>
               <li>the shadow of an arrow <b>on itself</b> is its length: hence <b>|a|² = a · a</b>, which is Pythagoras
                   written another way;</li>
               <li>the <b>distance</b> between two arrows is the length of their difference — how far apart the tips are.
                   In the quantum world it says how alike two states are.</li>
             </ul>`,
      mount: el => {
        stepper(el, [
          { h: 'The question', html: 'I have the arrow (3, 4) and the horizontal direction (1, 0). How much of my arrow goes horizontally?' },
          { h: 'The calculation', html: '(3, 4) · (1, 0) = 3·1 + 4·0 = <b>3</b>. That is the x coordinate — which means: coordinates <b>already are</b> shadows, on the two basis directions.' },
          { h: 'The length', html: '(3, 4) · (3, 4) = 9 + 16 = 25, and the length is √25 = <b>5</b>. The dot product of an arrow with itself gives the square of its length: Pythagoras, written with a dot.' },
          { h: 'The distance', html: 'Between (3, 4) and (0, 4) the difference is (3, 0), of length <b>3</b>. Distance = length of the difference: the same tool again.' },
          { h: 'Why we will need it', html: 'In the quantum world the <b>amplitude</b> of a result is the shadow of the state on the direction of that result, and the <b>fidelity</b> between two states (how alike they are) is their dot product squared.' },
        ], { doneLabel: 'Got it!' });
      },
    },

    {
      t: 'Quantum measurement is a shadow (and its rule is Pythagoras)',
      html: `<p>Now the big piece. A quantum state is an arrow of <b>length 1</b>. Measuring it means choosing <b>two
             perpendicular directions</b> — one per possible result — and looking at the two shadows of the state on
             them.</p>
             <ul>
               <li>the two shadows are the <b>amplitudes</b>;</li>
               <li>their <b>squares</b> are the probabilities of the two results;</li>
               <li>and the two squares always add to <b>1</b>, because the directions are perpendicular and Pythagoras
                   holds.</li>
             </ul>
             <div class="callout key">Read that last line again: <b>"the probabilities always make 100%" is not an
             imposed rule, it is the theorem of Pythagoras</b>. In the game you can turn the state and turn the basis as
             much as you like: that sum does not budge.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'ombra', title: 'Certain, certain, fifty-fifty', text: 'hit the 3 configurations by turning the state and the basis.', xp: 50 });
        el.appendChild(m.root);
        ombraLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>And now the sentence that keeps coming back in this course: <b>|0⟩ and |1⟩ are orthogonal</b>. It means
              their dot product is zero, that is, they are <b>not alike at all</b>, that is, they can be told apart
              <b>with certainty</b>: if the state sits exactly on one of the two directions, its shadow on the other is
              nil and that result never comes out.</p>
              <p>Two states that are <b>not</b> orthogonal, on the other hand, cannot be told apart with certainty by a
              single measurement. That is a limit of physics, not of technology — and it is why quantum cryptography
              works: an eavesdropper has to guess the basis, and guessing wrong leaves traces.</p>
              <div class="callout key"><b>A bit of history.</b> The symbol ⟨φ|ψ⟩ was invented by <b>Paul Dirac</b> in
              1939: he took the English word <i>bracket</i> and cut it in two, <i>bra</i> ⟨φ| and <i>ket</i> |ψ⟩. A pun
              that became the standard notation of physics, for the best of reasons: that symbol <b>is</b> the dot
              product, and it reminds whoever writes it that a question lives inside — "how much does this state look
              like that one?".</div>`,
    },

    {
      t: 'The summary in a single formula',
      html: ``,
      mount: el => {
        formula(el, {
          title: 'The dot product and its four jobs',
          hint: 'Touch the pieces: it is always the same calculation, under four names.',
          parts: [
            { t: 'a · b', id: 'p', color: 'cyan', name: 'how alike they are', say: 'One number: large if they point together, zero if perpendicular, negative if opposite.', ex: '(1,0) · (0,1) = 0 → perpendicular.' },
            { t: '|a|² = a · a', id: 'l', color: 'green', name: 'the length', say: 'The dot product of an arrow with itself is the square of its length. That is Pythagoras.', ex: '(3,4) · (3,4) = 25 → length 5.' },
            { t: 'shadow = ψ · d', id: 'o', color: 'amber', name: 'the amplitude', say: 'With d a direction of length 1: how much of the state goes that way. In the quantum world it is called the amplitude.', ex: 'State at 45°, horizontal direction → shadow 0.707.' },
            { t: 'shadow² = probability', id: 'b', color: 'pink', name: "Born's rule", say: 'The probability of that result is the shadow squared. And the squares add to 1 by Pythagoras.', ex: '0.707² = 0.5 → 50%.' },
          ],
        });
      },
      after: `<div class="callout ok">Four things that looked different — likeness, length, amplitude, probability — are
              the same calculation seen from four sides. When you meet ⟨φ|ψ⟩ you will know exactly what you are
              reading.</div>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game, lengthen one of the arrows without turning it: does the dot product change? Does
           the angle? <span class="muted">(the product does, the angle does not: they are two different pieces of
           information)</span></p>
        <p><b>2.</b> Two arrows of length 1 with dot product 0.5: what angle is between them?
           <span class="muted">(hint: the cosine of what is 0.5?)</span></p>
        <p><b>3.</b> In the second game set the basis to 45° and the state to 0°: what probabilities come out? And where
           have you seen that number before? <span class="muted">(0.707² = 0.5: that is the H gate)</span></p>
        <p class="mb0"><b>4.</b> Inventor's question: if two quantum states are <b>not</b> orthogonal, no measurement can
           tell them apart with certainty. Try to explain to yourself why by looking at the shadows — and then think
           about what that means for someone trying to spy on a quantum transmission.</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What does the dot product of two arrows tell you?', options: ['their total length', 'how much they point the same way', 'the area between them', 'their sum'], correct: 1,
      why: 'A single number: large and positive if they go together, zero if perpendicular, negative if opposite. You compute it by multiplying the coordinates pairwise and adding.' },
    { q: 'What is the dot product of (1, 0) and (0, 1)?', options: ['1', '0', '2', '−1'], correct: 1,
      why: '1·0 + 0·1 = 0. Zero means perpendicular: in the quantum world that is the condition that makes two states tellable apart with certainty.' },
    { q: 'What is the amplitude of a result, geometrically?', options: ['the length of the state', 'the shadow (projection) of the state on the direction of that result', 'the angle of the state', 'the distance from the origin'], correct: 1,
      why: 'It is the dot product of the state with the direction of the result: how much of the state goes that way. The probability is that shadow squared.' },
    { q: 'Why do the probabilities of a measurement always add to 100%?', options: ['by convention', 'because the basis directions are perpendicular and Pythagoras holds', 'because they are normalised afterwards', 'because the state is complex'], correct: 1,
      why: 'The state is 1 long and the two directions are perpendicular: the sum of the squared shadows is the square of the length, that is 1. Not an imposed rule — geometry.' },
    { q: 'Can two NON-orthogonal states be told apart with certainty by one measurement?', options: ['yes, always', 'no, never with certainty', 'only if they are 1 long', 'only with more qubits'], correct: 1,
      why: 'If they are not perpendicular, each has a non-zero shadow on the other\'s direction too: any measurement can be wrong. It is a physical limit, and it is the basis of quantum cryptography.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> One number saying how alike two arrows are, and out of it: length,
          distance, amplitude, probability. Next time you read ⟨φ|ψ⟩ you will not see a hieroglyph, you will see a
          shadow.</div>`,
});
@endsection
