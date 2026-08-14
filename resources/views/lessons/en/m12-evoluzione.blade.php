@php($description = 'The matrix exponential taught by playing: e^M as a Taylor series with a matrix inside, the eigenvector shortcut, the Schrödinger equation as imaginary compound interest — and the Trotter formula, the actual cost calculation for simulating a molecule on a quantum computer.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { esponenzialeLab, trotterLab } from '/js/widgets/evoluzione.js';

const L = renderLesson({
  id: 'm12-evoluzione',
  lead: `This is the level where Part M closes on itself. The question is: <b>how do you work out where a physical
         system will be one second from now?</b> The answer is a single formula — <b>e<sup>−iHt</sup></b> — that
         contains three things you have already built: the Taylor series (M·10) says what raising e to a matrix
         means, the eigenvectors (M·11) say how to compute it without summing anything, and the limit (M·8) says
         why, when the energy is made of pieces that quarrel with each other, you have to slice up time.`,

  steps: [
    {
      t: 'What e to the power of a matrix means',
      html: `<p>It sounds like a meaningless question: e is a number, a matrix is a table. What could raising one to
             the other possibly mean?</p>
             <p>The answer is simple to the point of being anticlimactic: <b>you use the same series as level
             M·10</b>.</p>
             <div class="formula">e<sup>x</sup> = 1 + x + x²/2! + x³/3! + …<br>e<sup>M</sup> = I + M + M²/2! + M³/3! + …</div>
             <p>Powers of a matrix are doable (it is just multiplying it by itself), dividing by a number is doable,
             adding two matrices is doable. So the sum makes sense — and it always converges, for any matrix,
             because the factorials in the denominator beat everything.</p>
             <div class="callout key">There is no magic to grasp: <b>e<sup>M</sup> is a definition</b>, and the
             definition is that sum. Everything else is a clever way of computing it.</div>
             <p>In the game: pick a generator, raise the number of terms and watch the yellow path — that is the sum
             being built, one term at a time — close in on the green circle, which is the true result.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'esponenziale', title: 'Two exponentials built by hand', text: 'bring the series within 0.001 of the result, on two different generators.', xp: 55 });
        el.appendChild(m.root);
        esponenzialeLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Two things to notice while you play.</p>
              <p><b>The first:</b> with the «gira» generator the yellow path starts off straight and then curls up
              until it lands on the circle. That is no accident — that antisymmetric matrix generates a
              <b>rotation</b>, and the series is rebuilding sine and cosine exactly as at level M·10.</p>
              <p><b>The second:</b> raise the time to 6 and see how many terms are needed. The series always works,
              but <b>slowly</b> when the matrix is big — it is the «how fast» question of level M·8 again. Which is
              why nobody actually computes a matrix exponential by summing the series.</p>
              <div class="callout key"><b>How it is really computed.</b> With the shortcut from level M·11: in the
              eigenvector basis the matrix is diagonal, and the exponential of a diagonal matrix is <b>just
              e^(eigenvalue) on each direction</b>. No sums at all.
              <p class="mb0" style="margin-top:8px"><b>e<sup>M</sup> = P · e<sup>D</sup> · P⁻¹</b></p></div>
              <p class="mb0">And there is an identity that always holds, shown in the game's panel:
              <b>det(e<sup>M</sup>) = e<sup>trace(M)</sup></b>. Trace and determinant were the two things that at
              level M·11 did not change with the ruler; here you find they are also tied to each other. If the trace
              is zero the determinant is 1 — the transformation does not change areas, and in quantum mechanics that
              means the probabilities keep adding up to 1.</p>`,
    },

    {
      t: 'The Schrödinger equation, which is compound interest',
      html: `<p>Now the reason this thing exists. In 1926 Schrödinger writes the equation that governs every quantum
             system:</p>
             <div class="formula">i·ℏ · dψ/dt = H·ψ</div>
             <p>It looks frightening written that way. Look at it with level M·8's eyes and it becomes familiar.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Drop the constants', html: 'Writing it as <b>dψ/dt = −i·H·ψ</b> leaves one single thing: <b>the rate at which the state changes is proportional to the state itself</b>. The constant of proportionality is −iH.' },
          { h: 'Where you have seen it', html: 'It is the same shape as compound interest: «how much it grows» is proportional to «how much there is». Capital at interest r grows as dC/dt = r·C, and the solution is C(t) = C₀·e^(rt).' },
          { h: 'So the solution is', html: '<b>ψ(t) = e^(−iHt)·ψ(0)</b>. Identical, with −iH in place of r. Except r was a number and −iH is a matrix: hence this level.' },
          { h: 'And the interest is imaginary', html: 'Remember the bank from level M·8? With imaginary interest the capital <b>does not grow, it goes round</b>. That is why a quantum state neither explodes nor fades: its length stays 1, and it rotates. The probabilities keep adding to 1 for the same reason |e^(iθ)| = 1.' },
          { h: 'The states that do not change', html: 'If ψ is an <b>eigenvector</b> of H with eigenvalue E, then e^(−iHt)ψ = e^(−iEt)·ψ: the state only picks up a phase and stays itself. They are called <b>stationary states</b>, and they are the energy levels of the atom.' },
          { h: 'And the ones that oscillate', html: 'A <b>superposition</b> of two stationary states with different energies does change: the two phases turn at different speeds, and the difference shows up as an oscillation. The frequency is proportional to the <b>energy difference</b> — and that is exactly the colour of the light that atom emits.' },
          { h: 'The link with this course', html: 'Every quantum gate in this course is an e^(−iHt) for some H and some t: you switch on a field for a precise time, and the state rotates by what is needed. «Applying a gate» in a laboratory means <b>waiting the right amount of time</b>.' },
        ], { doneLabel: 'Now go back!' });
      },
      after: `<div class="callout ok"><b>Take away:</b> the Schrödinger equation does not say «what happens», it says
              <b>how fast things change</b>. To find out what happens you have to integrate it — and integrating that
              equation means computing a matrix exponential.</div>`,
    },

    {
      t: 'When the pieces quarrel: the Trotter formula',
      html: `<p>Last piece, and it is the one that decides whether a quantum computer is good for anything.</p>
             <p>The energy of a real system is never a single matrix: it is a <b>sum of pieces</b>. Kinetic energy
             plus potential energy; the interaction between the first and second atom, plus the one between the
             second and the third. So <b>H = A + B</b>.</p>
             <p>You would like to write e<sup>A+B</sup> = e<sup>A</sup>·e<sup>B</sup>, as you do with numbers.
             <b>And you cannot.</b></p>
             <div class="callout warn">With numbers that rule holds because a·b = b·a. With matrices the order
             matters: in general <b>AB ≠ BA</b>. The difference AB − BA is called the <b>commutator</b>, and when it
             is not zero the rule breaks.</div>
             <p>But that is not the end of it, and here comes the idea. If I slice time into <b>n little pieces</b>
             and alternate half a piece of A and half of B, the error becomes small — and the more pieces I use, the
             smaller it gets.</p>
             <div class="formula">e<sup>A+B</sup> ≈ (e<sup>A/n</sup> · e<sup>B/n</sup>)<sup>n</sup></div>
             <p>In the game: the purple path is the sliced one, the green circle is where you were supposed to end
             up. Raise the pieces and watch the gap close.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'trotter', title: 'Two successful simulations', text: 'get close to the target on a short time and on a long one.', xp: 65 });
        el.appendChild(m.root);
        trotterLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>You will have seen two things, and they are <b>the</b> calculation of this level.</p>
              <div class="callout key"><b>1. The error falls like 1/n.</b> Double the pieces, halve the error. That
              is not an observation: the tests measure it by comparing the error at n and at 2n, and the ratio comes
              out 2.</div>
              <div class="callout key"><b>2. The longer the time you want to simulate, the more pieces you need</b>,
              in proportion. For the same relative accuracy, three times the time asks for more than twice the
              pieces.</div>
              <p>Now translate: <b>every piece is a group of gates to run</b>. So the number of gates — that is the
              cost, that is the running time, that is how much noise piles up — grows with the time you simulate and
              with the accuracy you want. This is called the <b>Trotter-Suzuki decomposition</b>, and it is how
              quantum chemistry is done on a real machine.</p>
              <div class="callout ok"><b>And this is where the quantum advantage is sturdier than anywhere else.</b>
              To simulate n quantum particles a normal computer has to hold 2ⁿ numbers (level M·4): at fifty
              particles that does not fit in the memory of the planet. A quantum computer uses n of them, as qubits,
              and only pays the bill for the slices. It is not a clever speed-up like Grover: it is the difference
              between «impossible» and «expensive».</div>
              <p class="mb0">One last note on the commutator, because it is more famous than it looks. That same
              quantity AB − BA, applied to position and momentum, gives Heisenberg's <b>uncertainty principle</b>. It
              is not a limitation of the instruments: it is that two matrices which do not commute have no common
              basis in which both are diagonal — and without that basis there is no ruler that answers both
              questions with certainty. It is level M·11, read backwards.</p>`,
    },

    {
      t: 'A physicist who wanted a computer, in 1981',
      html: `<p>In <b>May 1981</b>, at MIT, a conference is held on the physics of computation. <b>Richard
             Feynman</b> gives the keynote, published the following year under the title <i>Simulating Physics with
             Computers</i>.</p>
             <p>The argument is the one you have just worked through. To simulate a quantum system of n particles you
             need <b>2ⁿ</b> numbers, and that number doubles with every particle added. It is not a matter of faster
             computers: it is an amount of information that does not fit.</p>
             <div class="callout key">Feynman's conclusion became a famous line: «<b>Nature isn't classical, dammit,
             and if you want to make a simulation of nature, you'd better make it quantum mechanical, and by golly
             it's a wonderful problem, because it doesn't look so easy.</b>»</div>
             <p>The idea is simple and it flips the table: if a quantum system is hard to simulate with a classical
             machine, <b>let us use another quantum system as the machine</b>. There is no algorithm in that talk:
             there is a proposal.</p>
             <p>It took years to become something concrete. <b>David Deutsch</b>, in <b>1985</b>, defines what a
             quantum Turing machine is — level 9 of this course carries his name. <b>Seth Lloyd</b>, in <b>1996</b>,
             shows how a physical system is actually simulated on a quantum computer, and it is exactly the recipe
             of the second game: slice time into pieces and apply the pieces of the energy in turn.</p>
             <p class="mb0">It is worth noticing the order of things. <b>Shor arrives in 1994</b> and takes all the
             headlines, but simulation — proposed by Feynman and made concrete by Lloyd — came first and is the
             application most people bet on today. Breaking RSA is spectacular; understanding how a molecule works is
             useful.</p>`,
    },

    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game set «gira» with time ×6 and count how many terms it takes to reach 0.001. Then
           do it again at time ×1. <span class="muted">(20 against 6: the bigger the matrix, the slower the
           series)</span></p>
        <p><b>2.</b> Set «stira» and look at the determinant in the panel. Why is it always 1?
           <span class="muted">(because that matrix has zero trace, and det(e^M) = e^(trace): it stretches one way
           exactly as much as it squeezes the other)</span></p>
        <p><b>3.</b> In the second game leave the pieces at 1 and see where the purple path ends up.
           <span class="muted">(miles away: with a single piece you are saying e^(A+B) = e^A·e^B, which is
           false)</span></p>
        <p><b>4.</b> Find the number of pieces needed at time ×1, then at time ×3.
           <span class="muted">(94 against 348: it grows in proportion to the time, and that is the cost calculation
           of a simulation)</span></p>
        <p class="mb0"><b>5.</b> Inventor mode: if A and B did commute, how many pieces would you need?
           <span class="muted">(one: with no commutator the formula e^(A+B) = e^A·e^B is exact, and the tests check
           it on two stretches that commute)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What does e to the power of a matrix mean?', options: ['it is meaningless', 'the same Taylor series as eˣ, with the matrix in place of the number: I + M + M²/2! + …', 'the determinant of M', 'the matrix with its entries exponentiated'], correct: 1,
      why: 'It is a definition, and it always converges because the factorials in the denominator beat any matrix. Careful with the last option: you do NOT exponentiate the entries one by one.' },
    { q: 'How do you compute e^M without summing the series?', options: ['you cannot', 'in the eigenvector basis: there the matrix is diagonal and you just take e^(eigenvalue) on each direction', 'with the determinant', 'by multiplying M by itself'], correct: 1,
      why: 'It is the level M·11 shortcut: e^M = P·e^D·P⁻¹. The series says what it means, diagonalisation says how it is done.' },
    { q: 'What is the relationship between the Schrödinger equation and compound interest?', options: ['none', 'they have the same shape: the rate of change is proportional to what is there, so the solution is an exponential', 'they are both linear', 'they both use complex numbers'], correct: 1,
      why: 'dC/dt = r·C gives C(t) = C₀e^(rt); dψ/dt = −iHψ gives ψ(t) = e^(−iHt)ψ(0). And the imaginary interest of level M·8 explains why the state turns instead of growing.' },
    { q: 'Why is e^(A+B) not always e^A·e^B?', options: ['because matrices are big', 'because in general AB ≠ BA: the difference is called the commutator', 'because the sum of matrices is undefined', 'because e is not an integer'], correct: 1,
      why: 'With numbers the rule holds because a·b = b·a. If the commutator AB − BA is not zero, the rule breaks — and that same commutator gives the uncertainty principle.' },
    { q: 'What does the Trotter formula say?', options: ['that matrices always commute', 'that by slicing time into n pieces and alternating the two parts, the error falls like 1/n', 'that the exponential cannot be computed', 'that you need more qubits'], correct: 1,
      why: 'It is how a quantum computer simulates a physical system: it cannot apply e^(−iHt) in one go, but it can apply the pieces in turn. More slices, more gates, less error.' },
    { q: 'Why is simulating physics considered the sturdiest application of quantum computers?', options: ['because it is easier than Shor', 'because a normal computer needs 2ⁿ numbers for n particles, and at a few dozen that no longer fits in any memory', 'because it needs no error correction', 'because Feynman said so'], correct: 1,
      why: 'It is the difference between «expensive» and «impossible», not a clever speed-up. Feynman proposed it in 1981, and Seth Lloyd showed how to do it in 1996.' },
  ],

  outro: `<div class="callout ok"><b>Done, and Part M closes on itself.</b> e^(matrix) is the Taylor series of level
          M·10 with a table inside; it is computed with the eigenvectors of level M·11; it solves the Schrödinger
          equation, which has the shape of the compound interest of level M·8 — with imaginary interest, which is why
          the state turns instead of growing. And when the energy is made of pieces that do not commute you slice up
          time, you pay in gates, and you simulate a molecule. It is the application that gave birth to the very idea
          of a quantum computer, thirteen years before Shor.</div>`,
});
@endsection
