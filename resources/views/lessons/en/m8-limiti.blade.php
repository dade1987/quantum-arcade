@php($description = 'Sequences and limits taught by playing: the corridor game (Weierstrass\' definition in disguise), why «how many shots do I need» was already a limit, Bernoulli\'s bank where e comes from — and the bank that pays imaginary interest, which is the proof of e^(iθ) = cos θ + i·sin θ.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { corridoioLab, bancaLab } from '/js/widgets/limiti.js';

const L = renderLesson({
  id: 'm8-limiti',
  lead: `This is the most used word in all of analysis, and almost always explained badly: «the sequence <b>tends</b>
         to zero». Tends how? Does it get there or not? Here the answer arrives as a game — because the real
         definition <b>is</b> a game, with two players and one move each. And then you discover something: you have
         already played that game at level M·7, when you asked «how many shots do I need to stay under a given
         error». Same question, same number.`,

  steps: [
    {
      t: 'The corridor game: the definition, without formulas',
      html: `<p>A <b>sequence</b> is an infinite queue of numbers, one for each n: a₁, a₂, a₃, … For example 1/√n,
             which goes 1 · 0.707 · 0.577 · 0.5 … You can see it going down towards zero. But «you can see it» is
             not a definition, and for two centuries nobody managed to write one that held up.</p>
             <p>The one that worked is this, and it is a game between two players:</p>
             <div class="callout key">
               <p><b>I</b> pick a corridor: a strip <b>±ε</b> wide around the number L.</p>
               <p><b>You</b> must answer with an <b>N</b>: from there on the sequence stays inside the corridor, and
                  <b>never</b> leaves it again.</p>
               <p class="mb0">If you have an answer for <b>every</b> corridor, however narrow I make it, then the
                  sequence <b>tends</b> to L. Otherwise it does not.</p>
             </div>
             <p>Notice the shape of it: it never says «it gets there». It only says that, as close as you like,
             sooner or later it settles in and stays. The sequence 1 + 1/2ⁿ is never equal to 1 — and yet it tends
             to 1, because for any corridor around 1 you can answer with an N.</p>
             <p>Play. Start with the wide corridor, then tighten it — and watch what happens to N.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'corridoio', title: 'Three corridors, ever narrower', text: 'find an N that wins all three.', xp: 50 });
        el.appendChild(m.root);
        corridoioLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>If you tried to win the narrowest corridor while staying on 1/√n, you hit a wall: the N exists, but
              it is <b>10,000</b> and it does not fit on the chart. With 1 + 1/2ⁿ, <b>7</b> is enough.</p>
              <div class="callout key"><b>Here is the thing the game teaches and the formulas hide.</b> «Tends to
              zero» is not a single property: there is an abyss between tending to it <b>fast</b> and tending to it
              slowly. Both sequences tend to zero; one takes seven terms, the other ten thousand.</div>
              <p>And the two that tend to nothing? With <b>(−1)ⁿ</b> it is obvious: it bounces between −1 and 1
              forever. But look at the fifth one, <b>Grover on 16 boxes</b>: that is the probability of finding the
              right box after n turns, the same curve as level 11. It rises, almost touches 1 at the third turn —
              and then <b>falls back down to almost zero</b>. That one does not tend to anything either.</p>
              <div class="callout warn"><b>This is why Grover has a number of turns and not «more turns is
              better».</b> It is the only algorithm in the course where insisting makes things <b>worse</b>, and
              now you have the words to say it precisely: that sequence does not converge, it oscillates.</div>`,
    },

    {
      t: 'Achilles and the tortoise, or the first time anyone tried',
      html: `<p>The problem is 2,500 years old, and in the form <b>Zeno of Elea</b> posed it, it sounded like a
             proof that motion is impossible.</p>
             <p>Achilles runs ten times faster than the tortoise, which starts 100 metres ahead. When Achilles
             reaches 100, the tortoise is at 110. When he reaches 110, she is at 111. And so on, <b>forever</b>:
             every time he reaches where she was, she has moved on a little. So — Zeno concluded — he never catches
             her.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Where the trick is', html: 'Not in the numbers: those steps really are infinite. The trick is in the last word: «never». Zeno is assuming that infinitely many steps take an infinite amount of time. That is exactly what needs checking, not assuming.' },
          { h: 'Count the time, not the steps', html: 'If Achilles runs at 10 m/s, the first stretch costs him <b>10 s</b>. The second (10 metres) costs <b>1 s</b>. The third (1 metre) <b>0.1 s</b>. Each stretch lasts a tenth of the one before.' },
          { h: 'The sum', html: 'Total time is 10 + 1 + 0.1 + 0.01 + … This is a <b>geometric series</b> with ratio 1/10, the one from level 15·b. Its sum is not infinite: it is <b>11.111… = 100/9</b> seconds.' },
          { h: 'The answer to Zeno', html: 'He catches her after <b>11.11 seconds</b>, at 111.11 metres. Infinitely many steps, in a finite time. There is no paradox: there was only an infinite sum, and nobody before knew it could add up to a number.' },
          { h: 'What this has to do with the corridor', html: 'The partial sums — 10 · 11 · 11.1 · 11.11 — are a <b>sequence</b>. And it tends to 100/9 in the precise sense of the game: whatever corridor you put around 100/9, from some step on the sums are inside it.' },
          { h: 'Why we care, in this course', html: 'Because the <b>Fourier transform</b> is made of sums of arrows, the geometric series is the engine that makes them cancel or add up (level 15·b), and every time you write «=» between an infinite sum and a number, this game is behind it.' },
        ], { doneLabel: 'Now go back!' });
      },
      after: `<div class="callout ok"><b>Take away:</b> «infinitely many pieces» does not mean «infinite total». If
              the pieces shrink fast enough, the sum is a number — and that number is a limit.</div>`,
    },

    {
      t: 'Bernoulli\'s bank: where e really comes from',
      html: `<p>In <b>1683</b> Jakob Bernoulli asks himself an accountant's question, not a philosopher's. Put 1 in
             the bank at <b>100% interest</b> per year.</p>
             <ul>
               <li>Paid all at the end: you end up with <b>2</b>.</li>
               <li>Paid in <b>two instalments</b> of 50%: 1 → 1.5 → 2.25. Better, because the first half of the
                   interest earns interest too.</li>
               <li>Paid in <b>twelve</b> monthly instalments: 2.613. In <b>365</b> daily ones: 2.7146.</li>
             </ul>
             <div class="formula">capital with n instalments = (1 + 1/n)<sup>n</sup></div>
             <p>The more you split it, the more you earn. The real question is: <b>up to where?</b> If the
             instalments become infinite, does the capital explode or does it stop?</p>
             <p>In the game, raise the instalments and watch the blue curve. Then — and this is the part to see —
             change the kind of interest.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'banca', title: 'Two banks', text: 'get close to e, then bring the arrow onto the circle.', xp: 55 });
        el.appendChild(m.root);
        bancaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>It does not explode: it stops at <b>2.718281828…</b>, that is <b>e</b>. Bernoulli could not compute
              it, but he proved with Newton's binomial that it had to lie <b>between 2 and 3</b>. And it is the
              first number in history defined that way: not by a calculation that ends, but by a <b>where it ends
              up</b>.</p>
              <div class="callout key"><b>Now the second bank, the absurd one.</b> Same story, but the interest is
              <b>imaginary</b>: i·θ. Each instalment multiplies by (1 + iθ/n), and multiplying by a complex number
              means <b>stretch and turn</b> (level M·3).
              <p class="mb0" style="margin-top:8px">Except that here the stretching part is almost zero — the arrow
              1 + iθ/n is √(1 + θ²/n²) long, barely more than 1 — while the turning part is not. Result: <b>the
              capital does not grow, it goes round</b>. With infinitely many instalments it ends up exactly on the
              circle of radius 1, at the point (cos θ, sin θ).</p></div>
              <div class="formula">lim<sub>n→∞</sub> (1 + iθ/n)<sup>n</sup> = cos θ + i·sin θ = e<sup>iθ</sup></div>
              <p>At levels 14 and M·3 Euler's formula arrived like this: «multiplying arrows adds the angles, and
              powers do the same thing, so we write it as an exponential». True, and a good intuition — but it is a
              <b>resemblance</b>, not a proof. The proof is the line above, and it is a limit. <b>e<sup>iθ</sup> is
              an arrow turned by θ because that is where that limit goes, and there is nowhere else it could
              go.</b></p>
              <p class="mb0">There is also a detail the game points out by itself: the bigger θ is, the more
              instalments you need for the same precision. Keep it in mind for the next section.</p>`,
    },

    {
      t: 'What all this is for, in here',
      html: `<p>Three debts this level settles, in order of size.</p>
             <div class="callout key"><b>1. The cost of every measurement.</b> At level M·7 the question was: how
             many shots to estimate a probability with error ε? Answer (σ/ε)². Well: that <b>is</b> the N of the
             corridor game, for the sequence σ/√n. It does not resemble it — it is the same number, and in this
             level's tests the two calculations are compared directly. When you say «the error tends to zero» you
             are saying something true and useless; the useful thing is <b>how fast</b>, and it is slow.</div>
             <div class="callout key"><b>2. Euler's formula, proved.</b> The one above. From here on, every time
             e<sup>iθ</sup> shows up in the course — in phases, in the QFT, in the eigenvalues of phase estimation —
             you know where it comes from.</div>
             <div class="callout key"><b>3. How you simulate a physical system.</b> This is a preview, but it is
             worth seeing now that you have the bank in mind. A physical system evolves according to
             e<sup>iHt</sup>, where H is a matrix (the energy) and t is time. A quantum computer cannot apply that
             thing in one go: it can only apply simple gates. So it does <b>exactly what the bank does</b>:</div>
             <div class="formula">e<sup>iHt</sup> ≈ (1 + iHt/n)<sup>n</sup>, with n large</div>
             <p>it splits time into n little pieces and applies n times a gate that is almost the identity. It is
             called <b>Trotter decomposition</b>, and it is how quantum chemistry is done on a real machine. And the
             detail from before becomes the cost calculation: <b>the longer the time to simulate, the more pieces
             you need</b> for the same precision. In the game you saw it with θ; there it is with t.</p>
             <div class="callout ok">Three wildly different things — how many times to repeat a measurement, why
             e<sup>iθ</sup> turns, how you simulate a molecule — and underneath there is <b>the same
             limit</b>.</div>`,
    },

    {
      t: 'Two centuries without knowing what a limit is',
      html: `<p>The historical part of this topic is embarrassing, and it is worth telling properly: it makes clear
             that the rigorous definition never arrives <b>first</b>, it arrives afterwards, once the calculations
             have already worked for generations.</p>
             <p><b>Archimedes</b>, in the 3rd century BC, computes areas and volumes with the <b>method of
             exhaustion</b>: he inscribes polygons with more and more sides and squeezes the result between two
             values. It is a limit in everything but the name, and all he lacked was permission to say «and now I
             go to infinity».</p>
             <p><b>Newton</b> and <b>Leibniz</b>, in the seventeenth century, invent calculus and build modern
             physics on top of it. They talk about «evanescent» quantities and infinitesimals: numbers smaller than
             any number but not zero. It works beautifully and it does not hold together. Bishop <b>Berkeley</b>, in
             1734, mocks them mercilessly by calling them «ghosts of departed quantities» — and he is right.</p>
             <p><b>Bernoulli</b>, as you saw, defines e with a limit in 1683: it is the first time a number is
             defined by a process instead of by a calculation. <b>Euler</b> gives it its name and in 1748 publishes
             e<sup>ix</sup> = cos x + i·sin x, using infinite series with an abandon that today would get anyone
             failed — and getting it wrong almost never.</p>
             <div class="callout key"><b>The definition you have just played arrives only in the nineteenth
             century.</b> <b>Bolzano</b> writes it first in <b>1817</b>, but publishes in a practically unknown
             journal and nobody reads him. <b>Cauchy</b>, in 1821-1823, introduces the symbols ε and δ but keeps
             reasoning with infinitesimals. And it is <b>Weierstrass</b>, in his Berlin lectures around <b>1861</b>,
             who gives it its definitive form: the one with two players, the corridor and the N.</div>
             <p class="mb0">Do the arithmetic: from Newton's calculus to the definition of a limit, <b>almost two
             centuries</b> go by. In the meantime the orbits of the planets had already been computed. If you had
             the feeling that the corridor game was mathematicians' fussiness, know that plenty of people thought so
             too — until it was discovered that without that fussiness certain series give different results
             depending on the order you add them in, and then the matter became serious.</p>`,
    },

    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> In the corridor game, with ε = 0.05: what is N for 1/√n? And for (−1)ⁿ/n?
           <span class="muted">(400 against 20: the first is twenty times slower)</span></p>
        <p><b>2.</b> Check the formula in your head: for 1/√n, when does 1/√n go below ε?
           <span class="muted">(when n ≥ 1/ε². With ε = 0.01 that is 10,000, and it is the same calculation as level
           M·7)</span></p>
        <p><b>3.</b> In the real bank, how many instalments to get within 0.01 of e?
           <span class="muted">(135: here too the error falls like 1/n, so one more decimal digit costs ten times the
           instalments)</span></p>
        <p><b>4.</b> In the imaginary bank set θ = 180°. Where should the arrow end up?
           <span class="muted">(on −1: it is e^(iπ) = −1, Euler's gift from level M·3 — and now you have proved
           it)</span></p>
        <p class="mb0"><b>5.</b> Inventor mode: with θ = 180° try to get the error below 0.02 by raising the
           instalments to the maximum. Can you? <span class="muted">(no: the game goes up to 200 instalments and you
           would need 250. The turn is twice as wide and the instalments are needed in proportion — it is exactly
           the cost of the Trotter decomposition)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What does it mean that a sequence «tends to L»?', options: ['that sooner or later it is exactly L', 'that for every corridor ±ε around L there is an N from which on the sequence stays inside', 'that it gets closer and closer without ever stopping', 'that its terms become small'], correct: 1,
      why: 'It never says «it gets there»: 1 + 1/2ⁿ is never equal to 1, and yet it tends to 1. The definition is the game: you tighten the corridor, I find the N, for every possible corridor.' },
    { q: 'For the sequence 1/√n, what is the N that wins the corridor ±ε?', options: ['1/ε', '1/ε², which is the same number of shots as level M·7', '√ε', 'it does not exist'], correct: 1,
      why: '1/√n ≤ ε when n ≥ 1/ε². It is the same calculation that at level M·7 says how many shots you need to estimate a probability with that error: the definition of a limit and the cost of a measurement are the same thing.' },
    { q: 'Does Grover\'s probability tend to 1 as the number of turns grows?', options: ['yes, closer and closer to 1', 'no: it oscillates, and after the optimal turn it goes back down', 'yes, but only with many qubits', 'it tends to 1/2'], correct: 1,
      why: 'It is a sequence that does not converge. That is why Grover has a precise number of turns: carrying on makes things worse, and this is the right word for it.' },
    { q: 'Where does the number e come from?', options: ['from the length of a circle', 'from the limit of (1 + 1/n)ⁿ, that is from 100% interest split into infinitely many instalments', 'from a square root', 'Euler picked it at random'], correct: 1,
      why: 'Jakob Bernoulli, 1683, compound interest problem. It is the first number in history defined by a limit instead of by a calculation that ends, and he only managed to trap it between 2 and 3.' },
    { q: 'Why is e^(iθ) an arrow of length 1?', options: ['by convention', 'because the limit of (1 + iθ/n)ⁿ has length (1 + θ²/n²)^(n/2), which tends to 1: imaginary interest does not grow the capital, it turns it', 'because θ is an angle', 'because i is √(−1)'], correct: 1,
      why: 'Each instalment multiplies by 1 + iθ/n, which is barely longer than 1 and turns a little. Raised to the n, the turns add up and the stretches vanish: you end up exactly on the circle, at (cos θ, sin θ).' },
    { q: 'What has Bernoulli\'s bank got to do with simulating a molecule?', options: ['nothing, it is just a story', 'e^(iHt) is computed as (1 + iHt/n)ⁿ: time is split into n little pieces, like the instalments. It is the Trotter decomposition', 'because you need money to build quantum computers', 'because molecules grow exponentially'], correct: 1,
      why: 'A quantum machine can only apply simple gates, not e^(iHt) in one go. It splits it into n almost-identity steps, exactly like the instalments — and the longer the time to simulate, the more steps you need.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> «Tends to» is now a game with precise rules: you tighten the corridor,
          I find the N. Out of it fall three things the course had been using on credit: how many shots a measurement
          takes (it is the N of 1/√n), why e<sup>iθ</sup> turns instead of growing (it is the bank with imaginary
          interest) and how you simulate a physical system by splitting time into little pieces. Plus a bonus: next
          time somebody says «it tends to zero», you can ask <b>how fast</b> — which is always the question that
          matters.</div>`,
});
@endsection
