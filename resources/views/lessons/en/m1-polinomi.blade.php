@php($description = 'Polynomials and Ruffini\'s rule learned by playing: why integer roots hide only among the divisors of the constant term, why Ruffini\'s relay is also the fastest way to evaluate a polynomial (Horner), and why from the fifth degree on no formula exists — Ruffini, Abel, Galois.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { sospettatiLab, staffettaLab } from '/js/widgets/polinomi.js';

const L = renderLesson({
  id: 'm1-polinomi',
  lead: `At level 0·7b you built the quadratic formula instead of memorising it. One question was left hanging, and
         it is the finest in mathematics: <b>what about the third degree? and the fifth?</b> The answer is a
         surprise — for the third and fourth a formula does exist, and it is a story of duels; from the <b>fifth
         on it does not exist</b>, and not because nobody was clever enough. First, though, we need the tools, and
         there are two: how the roots of a polynomial are found, and the rule that carries the name of
         <b>Paolo Ruffini</b>.`,

  steps: [
    {
      t: 'What factoring is, and why it pays',
      html: `<p>A <b>polynomial</b> is a sum of powers of x with numbers in front: x³ − 7x + 6. Nothing more. Its
             <b>degree</b> is the highest power that appears — 3 here.</p>
             <p><b>Factoring</b> means rewriting it as a <b>product</b>: x³ − 7x + 6 = (x − 1)(x − 2)(x + 3). The two
             forms are worth the same number for every x, but the second says something the first hides:
             <b>when it is zero</b>.</p>
             <div class="callout key">A product is zero if and only if <b>one of its factors</b> is zero. So the
             moment the polynomial is written as a product, the solutions can be read off: 1, 2, −3. Factoring
             <b>turns a hard problem into a reading</b>.</div>
             <p>But how are those factors found? Trying every whole number takes a lifetime. Luckily the candidates
             are very few, and there is a precise reason why.</p>`,
    },

    {
      t: 'The suspects: why the hunt is so short',
      html: `<p>Picture an interrogation. The polynomial is x³ − 7x + 6 and we want a whole number that makes it
             zero. Potential suspects: <b>infinitely many</b>. But almost all of them have an <b>automatic
             alibi</b>, and here is the argument that gives it to them.</p>
             <p>Suppose a whole number <b>r</b> makes it zero: r³ − 7r + 6 = 0. Move the 6 across (the balance from
             level 0·7):</p>
             <div class="formula">r³ − 7r = −6 &nbsp;&nbsp;→&nbsp;&nbsp; r · (r² − 7) = −6</div>
             <p>On the left there is <b>r multiplied by something whole</b>. For the sum to work out, <b>r must
             divide 6 exactly</b>. End of the interrogation: the suspects are only <b>±1, ±2, ±3, ±6</b>. Eight
             numbers instead of infinitely many.</p>
             <div class="callout key">This is the <b>rational root theorem</b>, and it always holds: when the
             coefficient in front of the highest power is 1, <b>every whole root divides the constant term</b>.
             The constant term is the common kitty: whoever does not fit into it exactly was never there.</div>
             <p>In the game, question the suspects one at a time. A guilty one gets <b>peeled off</b> the polynomial,
             which drops a degree; one with an alibi shows you the remainder that clears it. Factor at least two all
             the way down.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'sospettati', title: 'Full interrogation', text: 'factor 2 polynomials as far as they go.', xp: 45 });
        el.appendChild(m.root);
        sospettatiLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Two things the game shows that are worth pinning down:</p>
              <ul>
                <li>every root peeled off <b>drops the degree by one</b>: cubic to quadratic to linear. That is why,
                    once one root is found, the rest becomes easy;</li>
                <li>the third polynomial <b>stops</b>: after peeling off the 2 you are left with x² + 1, which has no
                    whole roots — in fact none at all, since its discriminant is −4. That is not the method failing:
                    it is exactly the "impossible" case from level 0·7b, the one complex numbers were born from.</li>
              </ul>
              <div class="callout warn"><b>Careful with a common trap:</b> "has no whole roots" does not mean "has no
              roots". x² − 2 has no whole roots, but it has ±√2. The suspects theorem finds the <b>rational</b>
              roots: the others exist, and flushing them out takes different tools.</div>`,
    },

    {
      t: 'Ruffini\'s relay (and the saving it makes)',
      html: `<p>How does one "peel off" a root? By dividing: if r is a root, the polynomial is divisible by (x − r).
             Polynomial division can be done in a column like long division of numbers — slow and full of chances to
             slip — or with <b>Ruffini's rule</b>, which is the same thing written on a single line.</p>
             <p>The clearest way to see it is as a <b>relay race</b>:</p>
             <ul>
               <li>the runners are the <b>coefficients</b>, lined up from the highest degree;</li>
               <li>the first sets off with its own number and nothing else;</li>
               <li>every runner takes the baton from the one before, <b>multiplies it by r</b>, adds it to its own
                   coefficient, and passes the result on;</li>
               <li>the last number of the relay is the <b>remainder</b>.</li>
             </ul>
             <div class="callout key">If the remainder is <b>zero</b>, r was a root and the other numbers of the
             relay are the coefficients of what is left. If the remainder is <b>not</b> zero, you have not wasted
             your time: that number is <b>P(r)</b>, the value of the polynomial at r. This is called the
             <b>remainder theorem</b>, and it is two results for the price of one.</div>
             <p>Run the relay at least twice, and watch the multiplication counter at the bottom.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'staffetta', title: 'Carry the baton home', text: 'complete 2 relays.', xp: 50 });
        el.appendChild(m.root);
        staffettaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>That counter is why this rule lives outside school too. Working out x³ − 7x + 6 "literally" means
              doing x·x·x, then x·x, then the multiplications by the coefficients: <b>nine</b> multiplications. The
              relay does <b>three</b>.</p>
              <div class="callout ok"><b>A curiosity that shifts the perspective:</b> this is not a homework
              shortcut. It is <b>Horner's scheme</b>, the fastest known way to evaluate a polynomial at a point, and
              it sits inside maths libraries, graphics cards and pocket calculators. Ruffini publishes it in 1804 to
              divide; Horner in 1819 to evaluate; and it is the same row of numbers. <span class="muted">(and
              Chinese mathematicians were using it back in the 13th century — Qin Jiushao, 1247)</span></div>`,
    },

    {
      t: 'Why the quadratic formula looks like that — and why it stops',
      html: `<p>Now the question left hanging. At level 0·7b the formula came out of a drawing: completing the
             square. The natural question is: <b>what about higher degrees?</b></p>`,
      mount: el => {
        stepper(el, [
          { h: 'Degree 2: complete the square', html: 'The trick is to <b>turn the equation into a perfect square</b>, which a square root knows how to open. Hence the formula: x = [−b ± √(b² − 4ac)] / 2a. Al-Khwārizmī did it with a drawing, in 820.' },
          { h: 'Degree 3: discovered in the 1500s, amid quarrels', html: '<b>Scipione del Ferro</b> (Bologna, ~1515) finds how to solve cubics and tells nobody: at the time a university chair was defended in <b>public challenges</b> fought with problems, and a secret method was a salary.' },
          { h: 'The duel', html: '<b>Niccolò Tartaglia</b> gets there on his own in 1535 and wins a contest in Venice. <b>Gerolamo Cardano</b> talks him into revealing the method, swearing not to publish it — and in <b>1545</b> publishes it in the <i>Ars Magna</i>, crediting him, but publishing it. One of the most poisonous feuds in the history of science follows.' },
          { h: 'Degree 4: right after', html: '<b>Ludovico Ferrari</b>, Cardano\'s pupil, solves the quartic with a similar idea: it reduces to a cubic. The formula exists, it is enormous, and it too is in the <i>Ars Magna</i>.' },
          { h: 'Degree 5: two and a half centuries of silence', html: 'At this point it looks like a matter of time. And instead nobody manages it. For <b>two and a half centuries</b> the best mathematicians in Europe try and fail.' },
          { h: 'Ruffini, 1799: perhaps it cannot be done', html: '<b>Paolo Ruffini</b>, a physician and mathematician in Modena, publishes a proof that a general formula for the fifth degree <b>cannot exist</b>. Almost nobody reads it: it is over 500 pages, and one step is left incomplete.' },
          { h: 'Abel, 1824: proved', html: 'The Norwegian <b>Niels Henrik Abel</b>, aged 21, completes the proof. He has it printed at his own expense, and to fit the money he has he compresses it into <b>six pages</b>. He dies of tuberculosis at 26, poor. The result is now called the <b>Abel–Ruffini theorem</b>.' },
          { h: 'Galois, 1832: WHY is understood', html: '<b>Évariste Galois</b>, French, explains not only that the formula is absent but <b>which</b> equations can be solved with roots and which cannot: it depends on the <b>symmetries</b> of the solutions among themselves. He writes his ideas out the night before a duel, and dies the next day. He was <b>20</b>. <b>Group theory</b> is born there.' },
          { h: 'What it actually means', html: 'Not "we have not found it yet". It means a formula built from +, −, ×, ÷ and roots <b>does not exist</b>, proved. The solutions are there — a degree-5 polynomial has 5 complex roots — but to get them you have to <b>compute</b> them, not write them.' },
        ], { doneLabel: 'What a story!' });
      },
      after: `<div class="callout key">Keep the words <b>groups</b> and <b>symmetries</b> to one side: they were born
              here, from a twenty-year-old trying to understand an equation, and in this course they will come back
              to describe quantum gates. It is one of the sharpest cases of mathematics invented for one reason and
              turning out useful for another, a hundred and fifty years later.</div>`,
    },

    {
      t: 'What all this is for in the quantum part',
      html: `<p>The link is direct and worth seeing in full.</p>
             <p>At level 18·b you look for the <b>still directions</b> of a 2×2 matrix, and you find them by solving
             λ² − (trace)·λ + (determinant) = 0: a quadratic equation. For an <b>n×n</b> matrix that calculation
             becomes a <b>polynomial of degree n</b>, the characteristic polynomial, and its zeros are the
             <b>eigenvalues</b>.</p>
             <div class="callout warn">Put the two together and an awkward fact comes out: for a matrix <b>5×5 or
             bigger</b> the characteristic polynomial has degree ≥ 5, so by Abel–Ruffini <b>no formula exists</b>
             that gives the eigenvalues. Not for some difficult matrix: <b>in general</b>.</div>
             <p>That is why no program "solves" eigenvalues: it <b>chases</b> them, with methods that close in step
             by step. And an interesting quantum system has matrices with millions of rows.</p>
             <div class="callout ok"><b>And here phase estimation (level 19) changes register.</b> It solves no
             polynomial: it prepares the eigenvector, applies the gate doubling each time, and <b>reads</b> the
             eigenvalue off the phase. It steps clean around the problem Abel and Galois had closed. Put that way,
             "measuring an eigenvalue instead of computing it" stops being a technical detail and becomes the
             point.</div>
             <p>A second link, more hidden but just as strong, concerns the <b>relay</b>. Evaluating a polynomial at
             a point costs n multiplications with Horner. The <b>DFT</b> of level 16 is exactly that, repeated:
             take a polynomial and evaluate it at <b>n special points</b> — the n-th roots of unity, that is the
             arrows of level 8 arranged in a circle.</p>
             <div class="formula">DFT = evaluating a polynomial at the n roots of unity</div>
             <p class="mb0">n points × n multiplications = n² operations, which is precisely the cost of the naive
             DFT. And the <b>FFT</b> (level 17) is the trick of splitting that polynomial in two — even and odd
             terms — and reusing half the work. The same "split in half" idea as level K·4, applied to the relay.</p>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game take <b>x³ − 4x² + x + 6</b>: who are the suspects? Question them in order and
           count how many alibis you hit before the first guilty one. <span class="muted">(and note: changing the
           order changes the effort, not the result)</span></p>
        <p><b>2.</b> In the relay pick an r that is <b>not</b> a root and look at the last number. Then work out P(r)
           by hand, literally. Do they match? <span class="muted">(they must: that is the remainder theorem)</span></p>
        <p><b>3.</b> How many multiplications does a degree-7 polynomial cost with the relay? And literally?
           <span class="muted">(7 against 35: the gap grows like the square)</span></p>
        <p><b>4.</b> Why does the suspects theorem not find ±√2 as a root of x² − 2?
           <span class="muted">(re-read the argument: where was it used that r is a whole number?)</span></p>
        <p class="mb0"><b>5.</b> Inventor's question: if no formula exists for the eigenvalues of a 5×5 matrix, how
           does a computer draw you the spectrum of a molecule? <span class="muted">(hint: the same answer that
           makes level 21·b exist — you walk down, you do not solve)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Why is it worth factoring a polynomial into a product?', options: ['because it is shorter to write', 'because a product is zero only if a factor is zero: the solutions can be read off', 'because the degree goes down', 'because it removes negative numbers'], correct: 1,
      why: 'Written as (x−1)(x−2)(x+3), the polynomial declares its roots: 1, 2, −3. The sum form hides them, the product form exposes them.' },
    { q: 'If the constant term is 6 and the leading coefficient is 1, which whole numbers can be roots?', options: ['every whole number', 'only ±1, ±2, ±3, ±6', 'only 1 and 6', 'only even numbers'], correct: 1,
      why: 'Factoring r out of every term containing x leaves the constant term to be shared out: so r has to divide it exactly. From infinitely many candidates down to eight.' },
    { q: 'In Ruffini\'s rule, what is the last number of the row?', options: ['the constant coefficient of the quotient', 'the remainder of the division, which is also P(r)', 'the root you were looking for', 'the degree of the polynomial'], correct: 1,
      why: 'That is the remainder theorem: dividing by (x − r) leaves as remainder exactly the value of the polynomial at r. Zero means r is a root; not zero means you have still evaluated P(r).' },
    { q: 'Why is the Ruffini/Horner relay fast?', options: ['because it skips terms', 'because every coefficient enters with a single multiplication, instead of recomputing all the powers', 'because it uses smaller numbers', 'because it approximates the result'], correct: 1,
      why: 'The result is exact: only the order of the arithmetic changes. A degree-n polynomial costs n multiplications instead of about n²/2 — which is why maths libraries use it.' },
    { q: 'Is there a formula for solving fifth-degree equations?', options: ['yes, but it is too long to write down', 'no, and it is proved that none can exist (Abel–Ruffini)', 'not yet, but people are looking', 'yes, Galois found it'], correct: 1,
      why: 'Ruffini (1799) and Abel (1824) prove that no formula made of operations and roots can give the general solutions from degree 5 on. Galois (1832) explains why, founding group theory in the process. The roots exist: they are computed, not written.' },
    { q: 'What does all this imply for the eigenvalues of a large matrix?', options: ['nothing, eigenvalues can always be had from a formula', 'the characteristic polynomial has degree n: from n=5 on there is no formula, so eigenvalues are chased numerically — or read off with phase estimation', 'it means large matrices have no eigenvalues', 'it means real matrices are needed'], correct: 1,
      why: 'The characteristic polynomial of an n×n matrix has degree n. For n ≥ 5 Abel–Ruffini closes the formula road. Quantum phase estimation sidesteps it: it does not solve the polynomial, it measures the phase.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> The suspects are the divisors of the constant term, Ruffini's relay
          divides and evaluates at once and is the fastest known way to do it, and from the fifth degree on the
          formula does not exist — proved by a physician from Modena, a Norwegian dead at 26 and a Frenchman dead at
          20. Out of that story came groups, which you will meet again among the quantum gates; and from that
          "does not exist" you can see why phase estimation, which <b>measures</b> the eigenvalue, is news.</div>`,
});
@endsection
