@php($description = 'Change of basis taught by playing: measuring is projecting, the same state is random with one ruler and certain with another, the Hadamard gate is that change of ruler written as a matrix, and in the eigenvector basis a matrix becomes a pure stretch — the shortcut phase estimation is built on.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { cambioBaseLab, diagonaleLab } from '/js/widgets/base.js';

const L = renderLesson({
  id: 'm11-base',
  lead: `There is a sentence that has been coming back since level 1 of this course: «the same state is random if you
         measure it one way and certain if you measure it another». It sounds like a paradox, and it is actually a
         triviality of geometry — the same one by which your height in centimetres and in inches are two different
         numbers for the same person. Here you see it, you touch it, and you find that the <b>Hadamard gate</b> is
         not a mysterious gate: it is literally the change of ruler.`,

  steps: [
    {
      t: 'Two rulers, one single arrow',
      html: `<p>At level M·4 a <b>basis</b> arrived as «a few arrows that reach everything». Let us take that
             seriously: a basis is a <b>ruler</b>, that is, a way of giving coordinates.</p>
             <p>In the plane there are infinitely many orthonormal bases: you just turn both axes together. The
             arrow does not move — what changes are the two numbers you describe it with.</p>
             <div class="callout key"><b>And now the quantum part.</b> Measuring a state means <b>projecting</b> it
             onto the axes of a ruler, and the probability of each outcome is the <b>square</b> of the projection.
             This is the Born rule, and it is all there is.</div>
             <p>In the game: pick a state, turn the ruler and watch the two coloured arrows — they are the
             projections, that is the two possible answers of the measurement. Try to make the measurement
             <b>certain</b>, and then to make it <b>a coin toss</b>.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'base', title: 'Certain and random, with the same arrow', text: 'find a ruler that makes the measurement certain, and one that makes it 50-50.', xp: 55 });
        el.appendChild(m.root);
        cambioBaseLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Here is the point, and it is worth reading twice: <b>the state did not change, the ruler did</b>.
              The very same arrow gives a certain answer with one ruler and a coin toss with another.</p>
              <div class="callout key"><b>From here on «random» has to be said better.</b> There is no such thing as
              «a random state»: there is a state that is <b>oblique to the ruler you are using</b>. The randomness is
              not in the state, it is in the relationship between the state and the question you ask it.</div>
              <p class="mb0">And there is a corollary that explains half this course: put the ruler at 45° to |0⟩ and
              you get 50-50. That is: <b>making a qubit «be in superposition» is turning by 45°</b>. Nothing more
              exotic than that.</p>`,
    },

    {
      t: 'The Hadamard gate, taken apart',
      html: `<p>At this point the H gate from level 3 can be taken apart and looked into. It is this matrix:</p>
             <div class="formula">H = 1/√2 · [ 1 &nbsp; 1 ; &nbsp;1 &nbsp; −1 ]</div>
             <p>and it does exactly one thing: it <b>rewrites the state in the 45° ruler</b>.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'What it does to |0⟩', html: 'It sends it to (1, 1)/√2, that is <b>|+⟩</b>. In the straight ruler that state is 50-50 — there is your «superposition».' },
          { h: 'What it does to |1⟩', html: 'It sends it to (1, −1)/√2, that is <b>|−⟩</b>. This one too is 50-50 along Z, but it is a <b>different</b> state from |+⟩: the sign matters, and it is the phase from level 14.' },
          { h: 'Why applying it twice does nothing', html: 'Because changing ruler and then changing it back the same way brings you home: <b>H·H = identity</b>. That is why in algorithms the H gates always come in pairs, one on the way out and one on the way back.' },
          { h: 'Why the measurement changes anyway', html: 'The whole trick of quantum algorithms is here: <b>they do not change the apparatus\' ruler</b> — that always measures along Z — they turn the state so that, read along Z, it gives the right answer. Deutsch, Bernstein-Vazirani, Grover: all of them do this.' },
          { h: 'The calculation that proves it', html: 'This level\'s tests check that the two numbers H produces, <b>squared</b>, are exactly the probabilities of measuring in the 45° basis computed by projection. The two routes give the same number on every state in the game.' },
          { h: 'An honest detail', html: 'H has determinant <b>−1</b>: it is not a rotation, it is a <b>mirror</b>. It turns the ruler by 45° and then flips the second axis. For probabilities it makes no difference — they are squares — but it is right to know.' },
        ], { doneLabel: 'Now go back!' });
      },
      after: `<div class="callout ok"><b>Take away:</b> a quantum gate does not «make something strange happen to the
              state». It turns the state, or it turns the way you read it. Everything else follows.</div>`,
    },

    {
      t: 'The basis where the machine gets simple',
      html: `<p>Second half of the level, and it is needed for the next one. A <b>matrix</b> too — a machine that
             transforms arrows, as at level 0·6 — can be looked at from different rulers. And its numbers change.</p>
             <div class="formula">same machine, another ruler: <b>A′ = P⁻¹ · A · P</b></div>
             <p>Now the question that makes the level: <b>is there a ruler in which the machine becomes
             simple?</b> Simple means <b>diagonal</b>: no numbers off the diagonal, that is no mixing between the two
             directions. The machine merely stretches the first axis by one number and the second by another.</p>
             <p>In the game: turn the ruler and watch the four numbers on the right. When the two off-diagonal ones
             go to zero — and the green and pink arrows come out <b>straight</b> instead of skewed — you are
             there.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'diagonale', title: 'Two machines tamed', text: 'find the basis that makes them diagonal.', xp: 60 });
        el.appendChild(m.root);
        diagonaleLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>The directions that come out straight have a name you know: they are the <b>eigenvectors</b> of level
              18·b, and the two numbers on the diagonal are the <b>eigenvalues</b>. At level 18·b you found them;
              here you see <b>what they are for</b>.</p>
              <div class="callout key"><b>The gift.</b> In the right basis, applying the machine a thousand times
              means raising <b>two numbers</b> to the thousandth power. Outside that basis it would mean multiplying
              a thousand matrices.
              <p class="mb0" style="margin-top:8px"><b>A<sup>n</sup> = P · D<sup>n</sup> · P⁻¹</b>, and D<sup>n</sup>
              is just the diagonal raised to n.</p></div>
              <p>The tests verify it by comparing the two routes: A to the thirtieth computed by brute force and
              computed with the shortcut give the exact same result, on every machine in the game.</p>
              <div class="callout ok"><b>And here phase estimation becomes clear.</b> At level 19 the circuit applies
              a gate <b>2, 4, 8, 16… times</b>. If it had to do that by multiplying matrices it would be hopeless.
              But in the eigenvector basis that gate is just «multiply by e^(iθ)», and applying it 2^k times becomes
              «multiply by e^(i·2^k·θ)». The whole of Shor's algorithm stands on this.</div>
              <p class="mb0">Two things a change of basis does <b>not</b> touch, and the tests check it: the
              <b>trace</b> (the sum of the diagonal) and the <b>determinant</b>. They are what the machine «is»,
              regardless of who is looking — which is why they turn up in every formula.</p>`,
    },

    {
      t: 'Two theories that were the same, and nobody noticed',
      html: `<p>The history of this level is the finest in quantum mechanics, and it is about changes of basis
             exactly.</p>
             <p>In <b>1925</b> <b>Werner Heisenberg</b>, twenty-three, recovering from hay fever on the island of
             Helgoland, builds a theory of the atom made of <b>tables of numbers</b> that multiply in a strange way —
             the order matters, A·B ≠ B·A. Born and Jordan recognise that those tables are <b>matrices</b>, which
             mathematicians had known for seventy years but physicists did not use. <b>Matrix mechanics</b> is born:
             abstract, algebraic, with no picture at all.</p>
             <p>A few months later, in <b>1926</b>, <b>Erwin Schrödinger</b> publishes a completely different theory:
             no tables, but a <b>wave</b> spreading through space, with a differential equation. It is intuitive, it
             can be drawn, and physicists breathe a sigh of relief.</p>
             <div class="callout warn">The two theories seem to have <b>nothing</b> in common. Heisenberg detests
             Schrödinger's waves («the more I think about it, the more repulsive I find it», he writes to Pauli).
             Schrödinger finds matrix mechanics incomprehensible. And yet they give the <b>same numbers</b> for the
             hydrogen spectrum.</div>
             <p>In <b>March 1926</b> it is Schrödinger himself who shows the link between the two — going as far as
             to write that «from the formal mathematical standpoint one may even say that the two theories are
             identical». The proof, by today's standards, was incomplete; the clean picture arrives with the
             <b>transformation theory</b> of <b>Dirac</b> and <b>Jordan</b> in <b>1927</b>, and then with <b>von
             Neumann</b>'s book of 1932.</p>
             <div class="callout key"><b>And the answer is this level.</b> The two theories are the <b>same theory
             written in two different bases</b>. Heisenberg used the energy basis, where quantities are tables;
             Schrödinger used the position basis, where they become functions. Same state, different rulers. Exactly
             the game you have just played — only with infinitely many dimensions instead of two.</div>
             <p class="mb0">One last note, and it concerns the second game. Turning the axes until the off-diagonal
             numbers vanish is a real method, and it has a name: <b>Carl Gustav Jacob Jacobi</b> published it in
             <b>1846</b>, and for a century it stayed a curiosity because by hand it was torture. Then computers
             arrived and it became one of the most used algorithms in numerical analysis. When you drag that slider
             you are performing, by eye, a <b>Jacobi rotation</b>.</p>`,
    },

    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game set |0⟩ and take the ruler to 45°. What do you get? And at 90°?
           <span class="muted">(50-50 at 45°; at 90° it goes back to certain, but with the two answers
           swapped)</span></p>
        <p><b>2.</b> Set |+⟩ and find <b>two</b> rulers that make it certain.
           <span class="muted">(45° and 135°: they are the same axis, read in the two directions)</span></p>
        <p><b>3.</b> Take the oblique state (20°) and find the ruler that makes it a coin toss.
           <span class="muted">(65°, that is 20° + 45°: the rule is always «45° away from the state»)</span></p>
        <p><b>4.</b> In the second game pick «flatten» and try to guess the right basis <b>before</b> turning.
           <span class="muted">(45°: the matrix is symmetric with equal diagonal entries, so the good axes are the
           two bisectors)</span></p>
        <p class="mb0"><b>5.</b> Inventor mode: in the second game, while you turn the ruler, keep an eye on the sum
           of the two numbers on the diagonal. What do you notice? <span class="muted">(it never changes: it is the
           trace, and it does not depend on the ruler — same for the determinant)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What does measuring a state in a given basis mean?', options: ['changing the state', 'projecting it onto the axes of that basis: the probabilities are the squares of the projections', 'rotating the apparatus', 'multiplying it by a constant'], correct: 1,
      why: 'It is the Born rule. That is why the same state can give a certain answer with one ruler and 50-50 with another: the state did not change, the direction you project onto did.' },
    { q: 'What does |+⟩ give when measured along Z and along X?', options: ['certain in both cases', '50-50 along Z, certain along X', 'random in both cases', 'it depends on the noise'], correct: 1,
      why: 'It is the same arrow: it sits at 45° to the Z axes and on the X axis. «Random» is not a property of the state, it is the relationship between the state and the ruler you use.' },
    { q: 'What is the Hadamard gate, looked at closely?', options: ['a gate that adds noise', 'the matrix that rewrites a state in the 45° ruler: a change of basis', 'a measurement', 'a 90° rotation'], correct: 1,
      why: 'The two numbers it produces, squared, are the probabilities of measuring in the 45° basis. And applying it twice does nothing, because changing ruler and changing it back brings you home.' },
    { q: 'What happens to a matrix in the basis of its eigenvectors?', options: ['it disappears', 'it becomes diagonal: it no longer mixes the directions, it only stretches each one on its own', 'it becomes the identity', 'it doubles'], correct: 1,
      why: 'The eigenvectors are the directions the machine does not skew, and the eigenvalues say how much it stretches them. In that basis the matrix is just a pair of numbers.' },
    { q: 'Why does diagonalisation make phase estimation possible?', options: ['because it saves memory', 'because A^n becomes D^n, that is two numbers raised to n instead of n matrix products', 'because it removes noise', 'because it reduces the number of qubits'], correct: 1,
      why: 'The circuit at level 19 applies a gate 2, 4, 8, 16… times. In the eigenvector basis that gate is «multiply by e^(iθ)», so applying it 2^k times is «multiply by e^(i·2^k·θ)».' },
    { q: 'How are Heisenberg\'s matrix mechanics and Schrödinger\'s wave mechanics related?', options: ['they are rival theories, one of them is wrong', 'they are the same theory written in two different bases', 'one works for atoms, the other for molecules', 'the second one replaced the first'], correct: 1,
      why: 'Heisenberg used the energy basis, Schrödinger the position basis. The link is shown by Schrödinger himself in 1926; the clean picture arrives with the transformation theory of Dirac and Jordan in 1927.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> A change of basis changes nothing about reality and changes every
          number you describe it with. Three things fall out of that: «random» depends on the ruler and not on the
          state, the Hadamard gate is the change of ruler written as a matrix, and in the eigenvector basis a machine
          becomes two numbers — the shortcut that phase estimation and Shor's algorithm stand on. At the next level
          that same shortcut will serve to compute e^(iHt), that is, to make a physical system evolve.</div>`,
});
@endsection
