@php($description = '2×2 matrices explained without algebra: a machine that takes an arrow and gives back another one. Columns as destinations, the product as composition, and the discovery that X, Z and H are unitary matrices.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { matrixLab, gatePuzzle } from '/js/widgets/matrici.js';

const L = renderLesson({
  id: '00-matrici',
  lead: `"Matrix" is a word that scares people and should not: a 2×2 matrix is <b>a table of four numbers</b>, and it
         does exactly one thing — <b>it takes an arrow and gives back another arrow</b>. From here on, every quantum
         gate in this course will be one of those tables. Learning them now, by playing, costs twenty minutes; meeting
         them for the first time inside the quantum Fourier transform costs a great deal more.`,

  steps: [
    {
      t: 'A machine that moves arrows',
      html: `<p>Picture a machine with <b>four knobs</b>. You feed it an arrow and out comes another arrow: maybe longer,
             maybe turned, maybe flipped.</p>
             <p>To know <b>everything</b> about this machine you do not need to try it with infinitely many arrows. Two
             tries are enough:</p>
             <ul>
               <li>where the <b>red</b> arrow ends up — the one that goes one step right: <b>(1, 0)</b>;</li>
               <li>where the <b>green</b> arrow ends up — the one that goes one step up: <b>(0, 1)</b>.</li>
             </ul>
             <p>Why? Because every other arrow is made of those two. The arrow (3, 2) is "three steps right and two up":
             if you know where the steps end up, you know where it ends up.</p>
             <div class="callout key">In the game below, the dashed arrows say <b>where they have to land</b>. Turn the
             knobs until the solid arrows sit on top of them. Watch the blue quadrilateral too: you are not moving two
             arrows, you are moving <b>the whole plane</b>.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'manopole', title: 'Three machines to order', text: 'hit 3 different challenges by turning the knobs.', xp: 35 });
        el.appendChild(m.root);
        matrixLab(el, { need: 3, onWin: () => m.complete() });
      },
    },

    {
      t: 'The columns are the destinations',
      html: `<p>Now look at the four numbers you turned, written as a table:</p>
             <div class="formula">[ <span class="hl-n">a</span> &nbsp; <span class="hl-N">b</span> ]<br>
                                  [ <span class="hl-n">c</span> &nbsp; <span class="hl-N">d</span> ]</div>
             <p>The <b>first column</b> (a, c) is exactly where the red arrow lands. The <b>second column</b> (b, d) is
             where the green one lands. It is not a rule to memorise: it is what you just watched happen on screen.</p>
             <p>And the calculation for any arrow follows by itself:</p>`,
      mount: el => {
        formula(el, {
          title: 'Matrix times arrow, piece by piece',
          parts: [
            { t: '[a b; c d]', id: 'm', color: 'cyan', name: 'the machine', say: 'The four numbers: the first column says where (1,0) lands, the second where (0,1) lands.', ex: 'For the X gate: [0 1; 1 0] — red ends up at the top, green on the right: they swap.' },
            { t: '·' },
            { t: '(x, y)', id: 'v', color: 'amber', name: 'the incoming arrow', say: 'x steps right and y steps up.', ex: '(3, 2) means three red steps plus two green ones.' },
            { t: '=' },
            { t: '(a·x + b·y', id: 'r1', color: 'green', name: 'the first coordinate of the result', say: 'How far you move horizontally: the red contribution plus the green one.', ex: 'With [2 0; 0 3] and (3, 2): 2·3 + 0·2 = 6.' },
            { t: ',' },
            { t: 'c·x + d·y)', id: 'r2', color: 'pink', name: 'the second coordinate of the result', say: 'How far you move vertically, by the same reasoning.', ex: 'With [2 0; 0 3] and (3, 2): 0·3 + 3·2 = 6.' },
          ],
        });
      },
      after: `<div class="callout key">Two machines in a row still make a single machine, and its table is called the
              <b>product</b> of the two. Mind the order: shirt then jacket is not jacket then shirt. Mathematicians say
              the product is <b>not commutative</b>, and in the next game you get to feel it.</div>`,
    },

    {
      t: 'Quantum gates are matrices',
      html: `<p>Here are the three gates you will meet throughout the course, written as they really are:</p>
             <table class="table">
               <tr><th>Gate</th><th>Table</th><th>What it does</th></tr>
               <tr><td class="mono">X</td><td class="mono">[0 1 ; 1 0]</td><td>swaps |0⟩ and |1⟩: the quantum NOT</td></tr>
               <tr><td class="mono">Z</td><td class="mono">[1 0 ; 0 −1]</td><td>leaves |0⟩ alone and flips the sign of |1⟩</td></tr>
               <tr><td class="mono">H</td><td class="mono">[0.71 &nbsp;0.71 ; 0.71 &nbsp;−0.71]</td><td>creates the fifty-fifty superposition — that 0.71 is 1/√2</td></tr>
             </table>
             <p>For now, the state of a qubit is an arrow made of two numbers: <b>how much |0⟩ weighs</b> and <b>how much
             |1⟩ weighs</b>. Applying a gate means running that arrow through the machine.</p>
             <div class="callout key">The game has a <b>dashed circle</b>. Press as many gates as you like, in any order:
             <b>the tip of the arrow never leaves the circle</b>. Keep an eye on it, because it is the most important
             thing in this level.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'puzzle', title: 'Two targets, three gates', text: 'solve 2 puzzles by combining X, Z and H.', xp: 45 });
        el.appendChild(m.root);
        gatePuzzle(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>If you solved the first puzzle with <b>H, then Z, then H</b>, you have just discovered on your own
              something true and famous: those three gates in a row do exactly what X does.</p>
              <div class="formula">H · Z · H = X</div>
              <p>It is not a textbook trick: it is the product of three tables giving a fourth table. And it comes back
              all through the course, because it is the standard way of turning a "sign change" into an "answer change".</p>`,
    },

    {
      t: 'Why the length never changes',
      html: `<p>Machines that <b>neither stretch nor shrink anything</b> have a name: they are called <b>unitary</b>.
             X, Z and H are; a machine that doubles everything is not.</p>
             <p>The knobs game writes it underneath: try setting <span class="mono">a = 2</span> and watch the message
             change. And now the point:</p>`,
      mount: el => {
        stepper(el, [
          { h: 'The starting fact', html: 'The probability of reading a result is the <b>square</b> of its amplitude (level 0·1: 0.71² ≈ 0.5).' },
          { h: 'The probabilities add up', html: 'The probabilities of all results must come to <b>100%</b>. Always. A qubit giving 40% and 30% would mean nothing at all.' },
          { h: 'What that means for the arrow', html: 'Sum of squares = 1 is Pythagoras: it means the state arrow is <b>exactly 1 long</b>. That is why it sits on the circle in the game.' },
          { h: 'The conclusion', html: 'A gate may turn the arrow, flip it, mix it — but it <b>cannot change its length</b>, or the probabilities would stop adding to 100%. That is why every quantum gate is unitary.' },
          { h: 'A free consequence', html: 'A machine that squashes nothing can always be <b>run backwards</b>: no information was lost. That is the reversibility of level K·6, reached from another direction.' },
        ], { doneLabel: 'Got it!' });
      },
      after: `<div class="callout ok">From now on "quantum gate" and "2×2 unitary matrix" are the same thing to you, and
              the circle in the game is the reason why. It is the definition you will find in any book — except that you
              got there by pressing buttons.</div>`,
    },

    {
      t: 'Where it comes from',
      html: `<p>Matrices are younger than they look. Tables of numbers had been in use for centuries — in China, in the
             <i>Jiuzhang Suanshu</i>, linear systems were solved by lining coefficients up in columns two thousand
             years ago — but the idea that <b>the table is an object in its own right</b>, with a multiplication of
             its own, arrives in <b>1858</b> with Arthur Cayley and his <i>Memoir on the Theory of Matrices</i>.</p>
             <p>The part that matters to us is <b>why</b> he defined the product that way, with that rows-times-columns
             dance that looks arbitrary: because he wanted the product of two tables to be the table of the
             <b>composed transformation</b>. That is: first one machine, then the other. Matrix multiplication is not
             an invented rule, it is what that requirement forces.</p>
             <div class="callout key">And the sequel is the better story. In <b>1925</b> Werner Heisenberg built his
             quantum mechanics out of tables of numbers that multiplied in a strange way: swap the order and the result
             changed. He did not know the object already had a name. It was <b>Max Born</b> who recognised it — "that
             is a matrix" — and who wrote the tidy version with Pascual Jordan. The non-commutativity that looked like
             a problem to Heisenberg was the signature of the new physics: it is the same "X·Z ≠ Z·X" you have just
             seen in the game.</div>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> In the knobs game, which table <b>squashes everything onto the horizontal axis</b>? Is it unitary?
           What would happen to a qubit's probabilities?</p>
        <p><b>2.</b> Apply <b>X then Z</b>, then start over with <b>Z then X</b>. Does the arrow end up in the same place?
           <span class="muted">(answer: almost — a sign changes, and in the quantum world that sign shows up loud and clear)</span></p>
        <p><b>3.</b> Press <b>H twice</b> in a row starting from |0⟩. Where do you get back to? Can you say what H·H is?</p>
        <p class="mb0"><b>4.</b> Inventor's question: is the 90° rotation you built in the first game unitary? If so it could
           be a real quantum gate — and it is: in this course it is called a rotation, and you will meet it on the Bloch
           sphere.</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What do the two columns of a 2×2 matrix tell you?', options: ['two random numbers', 'where the two basis arrows land', 'the length of the arrow', 'the probability of the result'], correct: 1,
      why: 'The first column is where (1, 0) lands, the second where (0, 1) lands. Knowing those two destinations tells you where any arrow lands.' },
    { q: 'The matrix [0 1 ; 1 0] applied to the arrow (1, 0) gives…', options: ['(1, 0)', '(0, 1)', '(1, 1)', '(0, 0)'], correct: 1,
      why: 'The first column is (0, 1): the arrow that pointed right ends up pointing up. This is the X gate, the quantum NOT.' },
    { q: 'Why must every quantum gate be unitary?', options: ['tradition', 'otherwise the probabilities would no longer add to 100%', 'to run faster', 'to save qubits'], correct: 1,
      why: 'Probability is the square of the amplitude: if the arrow length changed, the probabilities would stop adding to 1. Unitary means exactly "does not change lengths".' },
    { q: 'Two gates applied one after the other…', options: ['cannot be combined', 'amount to a single matrix, their product', 'always cancel out', 'double the length'], correct: 1,
      why: 'Composing two machines still gives a machine: its table is the product of the two, and the order matters.' },
    { q: 'What does H · Z · H do?', options: ['nothing, it is the identity', 'the same as the X gate', 'doubles the amplitude', 'measures the qubit'], correct: 1,
      why: 'It is the result you discover while playing the puzzle: those three gates in a row give exactly the X matrix. Turning a sign change into an answer change is a move that comes back in every algorithm.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> A matrix is a machine, the columns are the destinations, the product means
          "one after the other", and unitary means "does not change lengths". With those four facts in your pocket, the
          gates in this course stop being symbols to remember and become tables you can read.</div>`,
});
@endsection
