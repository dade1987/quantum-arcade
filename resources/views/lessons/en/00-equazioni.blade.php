@php($description = 'Equations explained with a balance scale, inverse formulas derived step by step, and functions as machines: when you can go back and when the information is gone. The basics behind reversibility and quantum gates.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { bilanciaLab, macchinaLab } from '/js/widgets/equazioni.js';

const L = renderLesson({
  id: '00-equazioni',
  lead: `This level answers two questions that look like schoolwork and are not. First: <b>what does "solving" an
         equation actually mean?</b> (answer: almost nothing you were told — you do not "find" x, you <b>bring it into
         view</b>). Second: <b>when can you go back?</b> That second question, played on machines made of whole
         numbers, is exactly the same thing the quantum world calls reversibility — and it is why gates are built the
         way they are.`,

  steps: [
    {
      t: 'What an equation is (and what solving it means)',
      html: `<p>Start with the <b>=</b> sign. It does not mean "now calculate": it means <b>these two things weigh the
             same</b>. An equation is a balance scale in equilibrium, and that is all.</p>
             <p>In <code>2x + 3 = 11</code> the left pan holds two closed boxes — each containing the same unknown
             number — plus three one-kilo weights. The right pan holds eleven weights. The two sides balance:
             <b>that is a fact</b>, not a question.</p>
             <div class="callout key">So what does "solving" mean? It means <b>clearing away everything sitting around
             the box</b>, until a single box is left on the left. At that point the other pan tells you what it
             weighs. The x has not changed: it was already there, already worth that number. It just became
             visible.</div>
             <p>And there is exactly one rule for doing it:</p>
             <div class="formula">whatever you do to one pan, <span class="hl-n">you must do to the other</span></div>
             <p>Do that, and the scale stays balanced and the answer does not move. Fail to do it, and you have written
             something false. In the game the beam never tilts: that is the whole point.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'bilancia', title: 'Bring the x into view', text: 'solve 3 equations keeping the scale balanced.', xp: 35 });
        el.appendChild(m.root);
        bilanciaLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Watch the "x is worth …" line as you play: it <b>never changes</b>, move after move. That is the proof
              that the moves solve nothing — they only make plain something that was already true.</p>
              <div class="callout key">The word <b>algebra</b> is born right here. It comes from the title of a book by
              al-Khwārizmī, around the year 820: <i>al-jabr</i> means "restoring", that is, moving a piece from one pan
              to the other without breaking the balance. Twelve centuries later, you are doing the same thing with a
              mouse.</div>`,
    },

    {
      t: 'Turning a formula around: inverse formulas',
      html: `<p>A formula is a scale someone already wrote down. "Turning it around" means using the same moves to
             isolate a different letter instead of x.</p>
             <p>An example you know: the area of a rectangle is <code>A = b · h</code>. If you know the area and the
             base and want the height, divide both pans by b and you get <code>h = A / b</code>. You have not learned a
             new formula: you made <b>one move</b> on the old one.</p>
             <p>Now the three formulas from this course you will need to turn around, taken apart one at a time:</p>`,
      mount: el => {
        stepper(el, [
          { h: 'With n bits you pick from 2ⁿ', html: 'The formula is <b>N = 2ⁿ</b>. If you know how many bits you have (n), the number of possibilities follows. But you often need the other direction.' },
          { h: 'Turn it around', html: 'If you know how many possibilities you need (N) and want to know how many bits that takes, the move that "undoes" raising to a power is called the <b>logarithm</b>: <b>n = log₂N</b>. With N = 1024 → n = 10. That is the next level, and that is all it is.' },
          { h: "The qubit's rule", html: 'The rule is <b>α² + β² = 1</b> (the two probabilities make 100%). If you know α and want β, take α² off both pans: <b>β² = 1 − α²</b>, then the square root: <b>β = √(1 − α²)</b>.' },
          { h: 'A real calculation', html: 'With α = 0.6: β² = 1 − 0.36 = 0.64, so β = 0.8. Check it: 0.6² + 0.8² = 0.36 + 0.64 = 1 ✓.' },
          { h: 'The phase of a turn', html: 'In the Fourier transform <b>θ = 2π·k/N</b> keeps coming up. If you know the angle and want the matching k, multiply both pans by N and divide by 2π: <b>k = θ·N / (2π)</b>.' },
          { h: 'The point', html: 'It is always the same three moves: <b>add or subtract</b> the same thing on both sides, <b>multiply or divide</b> both sides, or <b>apply to both sides</b> the same operation — provided it can be undone (root, logarithm). Nothing else.' },
        ], { doneLabel: 'Got it!' });
      },
      after: `<div class="callout warn"><b>A note worth a whole level:</b> that last move only works with operations
              <b>that can be undone</b>. Squaring, for instance, cannot be fully undone: from β² = 0.64 you get β = 0.8
              <b>or</b> β = −0.8, and which one it was is no longer known. Which is precisely the next step.</div>`,
    },

    {
      t: 'Functions are machines (and some do not go back)',
      html: `<p>A <b>function</b> is a machine that takes a number and returns another. There are two rules, and that is
             all of them:</p>
             <ul>
               <li>every number that goes in has <b>exactly one</b> output (otherwise it is not a machine, it is a die);</li>
               <li>the set of numbers that <b>may</b> go in is called the <b>domain</b>: "÷0" is not allowed, nor is the
                   square root of a negative number, as long as we stay on ordinary numbers.</li>
             </ul>
             <p>So far, obvious. The interesting question is another one, and the game is all about it:</p>
             <div class="callout key"><b>Looking at the output alone, can you work out what went in?</b></div>
             <p>For some machines, always: if I tell you the output is 10 and the machine doubles, 5 went in. For others,
             no — and not out of laziness: <b>it is impossible</b>. If the machine squares and the output is 9, either 3
             or −3 went in, and no information in the world can tell you which, because that information <b>no longer
             exists</b>.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'macchine', title: 'Who goes back and who does not', text: 'classify 4 machines correctly.', xp: 40 });
        el.appendChild(m.root);
        macchinaLab(el, { need: 4, onWin: () => m.complete() });
      },
      after: `<p>The criterion you have been using has a name: a machine can be run backwards if and only if it
              <b>never sends two different numbers to the same place</b>. When two inputs collide, from that point on
              they are indistinguishable.</p>
              <p>And there is a way of putting it worth keeping: <b>a machine that loses information cannot be
              inverted</b>. That is not a technical limitation: it is the definition.</p>`,
    },

    {
      t: 'Why all of this turns quantum',
      html: `<p>Now let us put the two halves of the level together, and the result is stronger than it looks.</p>
             <p>The logic gates of an ordinary computer — AND, OR — are machines with <b>no way back</b>: from an AND
             that reads 0 you cannot tell whether the inputs were 0 and 0, 0 and 1, or 1 and 0. Three different
             situations, one output: information lost at every operation.</p>
             <p>Quantum gates, by contrast, <b>must</b> go back. Always. And you can derive the reason yourself, with one
             formula turned around:</p>`,
      mount: el => {
        formula(el, {
          title: 'The chain, in four pieces',
          parts: [
            { t: 'probability = amplitude²', id: 'p', color: 'cyan', name: "Born's rule", say: 'Every possibility has an amplitude; the probability of seeing it is the square of that.', ex: 'Amplitude 0.6 → probability 0.36.' },
            { t: '→' },
            { t: 'sum = 1', id: 's', color: 'amber', name: 'the probabilities make 100%', say: 'The squares of all the amplitudes must add to 1: something has to happen.', ex: '0.6² + 0.8² = 1 ✓' },
            { t: '→' },
            { t: 'fixed length', id: 'l', color: 'green', name: 'the state arrow is 1 long', say: 'Sum of squares = 1 is Pythagoras: the arrow representing the state always has the same length.', ex: 'In the matrix level it is the circle the arrow never leaves.' },
            { t: '→' },
            { t: 'it goes back', id: 'r', color: 'violet', name: 'the gate is invertible', say: 'A machine that squashes nothing and stretches nothing cannot send two different states to the same place: so it can always be run backwards.', ex: 'That is why there is no quantum "AND" gate like the classical one: it would throw information away.' },
          ],
        });
      },
      after: `<div class="callout ok">This chain is the whole bridge between middle-school maths and quantum computing:
              <b>probabilities that make 100% → a length that never changes → a machine that can be inverted</b>. In the
              reversibility level you meet it from the information side, in the matrix level from the geometry side. It
              is the same sentence in three languages.</div>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> In the equation <code>3x = x + 8</code> removing weights is not enough: you have to remove <b>a
           box</b> from both pans. Why is that a legal move?</p>
        <p><b>2.</b> Turn this formula around yourself: <code>v = s / t</code>. Get <b>t</b>. Which move did you make,
           and on which pan?</p>
        <p><b>3.</b> The "remainder of division by 4" machine sends 1, 5, 9, 13… all to the same place. Where have you
           seen this machine before? <span class="muted">(hint: the clock in level 0·5)</span></p>
        <p class="mb0"><b>4.</b> Inventor's question: the "×0" machine throws <b>everything</b> away. If a quantum gate
           could do that, what would happen to the sum of the probabilities?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What does the "=" sign mean in an equation?', options: ['now compute the result', 'the two sides are worth the same', 'x is on the left', 'the bigger number is on the right'], correct: 1,
      why: 'It is a balance in equilibrium: the two sides weigh the same. Solving does not change that fact, it only makes it readable by isolating x.' },
    { q: 'Why must a move be made on both sides?', options: ['out of habit', 'because otherwise the equality stops being true', 'to go faster', 'only when there are fractions'], correct: 1,
      why: 'Taking weight off one pan only unbalances the scale: the new line would be false, and the answer would no longer be the one you started with.' },
    { q: 'From A = b · h, how do you get h?', options: ['h = A · b', 'h = A / b', 'h = A − b', 'h = b / A'], correct: 1,
      why: 'Divide both sides by b: on the left h is left, on the right A/b. It is the same balance move, applied to a formula.' },
    { q: 'When can a machine (function) be run backwards?', options: ['when the numbers are small', 'when it never sends two different inputs to the same output', 'when it only uses additions', 'always'], correct: 1,
      why: 'If two different inputs give the same output, from the output it is impossible to know which one you came from: that information no longer exists.' },
    { q: 'Why must every quantum gate be invertible?', options: ['by convention among physicists', 'because it preserves the length of the state arrow, so it cannot squash two different states into one', 'because it is faster', 'because otherwise you need more qubits'], correct: 1,
      why: 'Probability = amplitude² and the sum must be 1: the state arrow is always 1 long. A machine that does not change lengths cannot make two states collide, so it can always be inverted.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> An equation is a balance, solving it means bringing into view what was
          already there, turning a formula around is the same three moves, and a machine only goes back if it loses no
          information on the way. That last sentence is what the rest of the course will call, by turns, reversibility
          or unitarity.</div>`,
});
@endsection
