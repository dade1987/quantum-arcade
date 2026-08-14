@php($description = 'Complex numbers learned by playing: multiplying means stretching and turning, from which e^(iθ) follows with no magic, and the n-th roots of unity that add up to zero — the destructive interference the Fourier transform rests on.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { prodottoLab, radiciLab } from '/js/widgets/complessi.js';

const L = renderLesson({
  id: 'm3-complessi',
  lead: `At level 8 the arrows arrived because they were needed: with pluses and minuses alone certain sums did not
         work out. You have used them plenty since. Here we put them in order, and reach the two things the whole
         second half of the course rests on: <b>why e^(iθ) is written that way</b> — which looks like a provocation
         and is in fact the only sensible notation — and the <b>roots of unity</b>, the arrows the Fourier transform
         is made of. By the end you will also know why the DFT's peak is a peak.`,

  steps: [
    {
      t: 'The recap, and the question nobody asks',
      html: `<p>A complex number is <b>an arrow on the plane</b>: two numbers, the horizontal one and the vertical
             one, written a + bi. The <b>i</b> is not a mysterious number: it is the label saying "this second number
             lies along the other direction".</p>
             <p><b>Adding</b> them is easy and you have been doing it for ten levels: tip to tail, like the wave
             arrows. But there is a question nobody usually asks, and it is the one that opens everything up:</p>
             <div class="callout key"><b>What does it mean, geometrically, to <i>multiply</i> two arrows?</b> Adding
             is visible. Multiplying, looking at a + bi, seems like nothing but a bracket to expand. And instead it
             has a precise, and surprisingly simple, meaning.</div>
             <p>In the game move the two arrows and watch the third one, the product. Look for the rule before you
             read it below: <b>watch the lengths, then watch the angles</b>.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'prodotto', title: 'Three targets', text: 'bring the product onto 3 different targets.', xp: 45 });
        el.appendChild(m.root);
        prodottoLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Here is the rule, and it is two lines:</p>
              <div class="formula">the <b>lengths</b> multiply &nbsp;·&nbsp; the <b>angles</b> add</div>
              <p>It is neither a coincidence nor a convention. Expand the product of two arrows of length 1:</p>
              <div class="formula">(cos a + i·sin a) × (cos b + i·sin b)</div>
              <p>The part without i comes out <b>cos a·cos b − sin a·sin b</b>; the part with the i comes out
              <b>sin a·cos b + cos a·sin b</b>. Those are, word for word, the <b>addition formulas</b> from level
              M·2 — that is, cos(a+b) and sin(a+b). The product <b>is</b> the arrow at a+b degrees. It could not have
              been anything else.</p>
              <div class="callout ok"><b>And here imaginary numbers stop being strange.</b> "i² = −1" sounds like an
              arbitrary claim to be accepted. But i is the arrow of length 1 at <b>90°</b>: multiplying by i means
              <b>turning a quarter turn</b>. Doing it twice is turning 180°, which lands on −1. Try it in the game.
              i² = −1 is not an axiom: it is half a turn.</div>`,
    },

    {
      t: 'Why e^(iθ) is written that way, and why it is the right notation',
      html: `<p>Now the step that is usually handed down from above. We have discovered that multiplying two arrows
             of length 1 <b>adds their angles</b>. Let us dwell on that sentence, because it is unusual.</p>
             <p>Which operation do you know that <b>turns sums into products</b>? There is only one, and you have
             known it since level 0·8:</p>
             <div class="formula">x<sup>a</sup> · x<sup>b</sup> = x<sup>a+b</sup></div>
             <p>Exponents add when powers multiply. That is <b>exactly the same behaviour</b> as our arrows: angles
             adding when the arrows multiply. If something behaves like an exponential, the only honest notation is
             the exponential one.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'The starting fact', html: 'The arrow of length 1 at angle θ, multiplied by the one at angle φ, gives the arrow at angle <b>θ + φ</b>. Call it F(θ) for a moment.' },
          { h: 'The property it has', html: '<b>F(θ) · F(φ) = F(θ + φ)</b>. That is: the product of the Fs is the F of the sum.' },
          { h: 'Who else behaves like that', html: 'The exponential, and essentially only it: <b>e^a · e^b = e^(a+b)</b>. The structure is the same, cell for cell.' },
          { h: 'So F is an exponential', html: 'It must be that <b>F(θ) = e^(kθ)</b> for some number k. What remains is to work out which.' },
          { h: 'Which k', html: 'The arrow turns, it does not grow: its length stays 1 always. An exponential with a real k instead blows up or dies away. The only way to have "grows by nothing and turns by one" is to take k <b>imaginary</b>: k = i.' },
          { h: 'The notation', html: '<b>e^(iθ) = cos θ + i·sin θ</b>. This is Euler\'s formula, and in this course you have had it since level 14 as "the arrow turned by θ".' },
          { h: 'Honesty', html: 'What you have just seen is a <b>plausibility argument</b>, not a proof: it says e^(iθ) is the sensible notation, not that it is forced. The real proof goes through Taylor series, and sits in a later Part M level. But the reason that notation exists is entirely here: <b>angles add</b>.' },
          { h: 'Euler\'s gift', html: 'Put θ = 180°, that is π: the arrow lands on −1. So <b>e^(iπ) = −1</b>, usually written <b>e^(iπ) + 1 = 0</b>. Five constants in five symbols. And it is only the elegant way of saying "half a turn takes you to the other side".' },
        ], { doneLabel: 'Now it makes sense!' });
      },
      after: `<div class="callout key"><b>What you take away, in practice:</b> every time you see e^(iθ) in this
              course — in a gate's phase, in the QFT, in phase estimation — you can simply read it as <b>"the arrow
              of length 1 turned by θ"</b>. And multiplying two of those means adding the angles, which is why
              quantum calculations simplify so nicely.</div>`,
    },

    {
      t: 'The roots of unity: n arrows that cancel out',
      html: `<p>A question: which numbers, raised to the <b>n</b>-th power, give 1? With ordinary numbers the answer
             is depressing: one, or at most two (1 and −1). With arrows it becomes beautiful.</p>
             <p>Raising to the n means multiplying by itself n times, which — as we have just discovered — means
             <b>adding the angle n times</b>. For the result to be 1, that is the arrow at 0°, the angle multiplied
             by n has to make <b>a whole number of turns</b>. So:</p>
             <div class="formula">the good angles are 0°, 360/n, 2·360/n, 3·360/n, …</div>
             <p>They are <b>n equally spaced arrows on the circle</b>: the vertices of a regular polygon, with the
             first one on 1. They are called the <b>n-th roots of unity</b>.</p>
             <p>In the game build them and then <b>add them up</b>, tip to tail. Watch where the chain ends.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'radici', title: 'Close three polygons', text: 'add up all the arrows for 3 different values of n.', xp: 55 });
        el.appendChild(m.root);
        radiciLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>The chain <b>comes back exactly to where it started</b>: the sum of all n-th roots of unity is
              <b>zero</b>, for every n greater than 1. And the reason is disarmingly simple: they are arranged in
              perfect balance in every direction, so they cancel one another — like a crowd pulling a rope with
              equal force from all sides.</p>
              <div class="callout ok"><b>That zero is the engine of the Fourier transform.</b> The DFT of level 16
              weights the samples with exactly these arrows. When the frequency you are looking for is <b>not</b>
              there, the weights go round in a circle and add to zero: silence. When it is there, all the arrows
              point the same way and add up: the <b>peak</b>. You had already seen the closing chain at level 15·b;
              now you also know <b>who</b> those arrows are and why there are exactly n of them.</div>
              <p class="mb0">And the QFT (level 18) does the same thing with n = 2<sup>number of qubits</sup> arrows
              all at once, which explains why it is written with powers of 2 and why the phases are e^(2πi·jk/N):
              they are the roots of unity raised to jk.</p>`,
    },

    {
      t: 'Where they come from: three hundred years to make a drawing',
      html: `<p>At level 0·7b you saw them being born: <b>Cardano</b> (1545) and <b>Bombelli</b> (1572), as a forced
             shortcut for solving cubic equations. That is, they are born as <b>a calculation that works</b> and
             that nobody can explain.</p>
             <p>And it stays that way for <b>two and a half centuries</b>. They get used because the sums come out,
             but they are eyed with suspicion — to the point that it is <b>Descartes</b>, in 1637, who calls them
             <i>imaginary</i>, and not as a compliment. Leibniz describes them as "an amphibian between being and
             non-being". Euler, who uses them more than anyone and in <b>1748</b> publishes the very formula
             e^(ix) = cos x + i·sin x, still has no picture for saying <b>where they are</b>.</p>
             <div class="callout key">The drawing you have used in this level — the arrow on the plane — arrives only
             between <b>1799</b> and <b>1806</b>, and three people reach it separately: <b>Caspar Wessel</b>, a
             Norwegian surveyor who drew maps (whose paper stays ignored for a century), <b>Jean-Robert Argand</b>, a
             Paris bookkeeper, and <b>Carl Friedrich Gauss</b>, who in <b>1831</b> gives it the authority it
             needed.</div>
             <p>Gauss writes something worth quoting almost literally: that the obscurity surrounding these numbers
             is to be attributed largely to <b>an ill-adapted terminology</b>, and that if +1, −1 and √−1 had been
             called <b>direct, inverse and lateral</b> units instead of positive, negative and imaginary (or
             "impossible"), <i>"such an obscurity would have been out of the question"</i>. He was right: the problem
             was not the numbers, it was the <b>name</b>. Calling a quarter turn "imaginary" held mathematics up for
             two centuries.</p>
             <div class="callout ok"><b>The moral, and it concerns you as a learner too:</b> for three hundred years
             these numbers were "hard" only because the right drawing was missing. As soon as somebody put them on
             the plane, they became the most natural thing in the world — a stretch and a turn. If a concept feels
             impossible to you, very often it is not the concept: it is the picture that is not there yet.</div>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game set both arrows to length 1 at 90°. Where does the product land? And what
           number is that? <span class="muted">(i × i: two quarter turns make half a turn, that is −1)</span></p>
        <p><b>2.</b> Still in the first game, keep one arrow at length 1 and change only its angle: does the length
           of the product change? <span class="muted">(no: multiplying by an arrow of length 1 only turns — which is
           exactly what a quantum phase does, and indeed it does not change the probabilities)</span></p>
        <p><b>3.</b> In the second game take n = 3 and add only <b>two</b> of the three arrows. Is the sum zero? What
           is it? <span class="muted">(it is not zero: the zero only arrives when they are all there — which is why
           the DFT has to sum over all the samples)</span></p>
        <p><b>4.</b> With n = 4 the four roots are 1, i, −1, −i. Check by hand that i⁴ = 1.
           <span class="muted">(four quarter turns)</span></p>
        <p class="mb0"><b>5.</b> Inventor's question: multiply two n-th roots of unity together. Is the result still
           an n-th root? <span class="muted">(yes, always: the angles add and stay multiples of 360/n. This fact has
           a name — "they form a group" — and it will come back when we talk about the symmetries of quantum
           gates)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What does multiplying two complex numbers mean geometrically?', options: ['adding the lengths and the angles', 'multiplying the lengths and adding the angles', 'multiplying lengths and angles', 'adding the lengths and multiplying the angles'], correct: 1,
      why: 'Expanding (cos a + i sin a)(cos b + i sin b) produces exactly the addition formulas: the result is the arrow at angle a+b. The lengths, on the other hand, multiply together.' },
    { q: 'Why is i² = −1, looking at the arrows?', options: ['it is an axiom to be accepted', 'because i is the arrow at 90°, and turning twice by 90° reaches 180°, that is −1', 'because i is negative', 'because the length doubles'], correct: 1,
      why: 'Multiplying by i is turning a quarter turn. Two quarter turns make half a turn: you land on the negative part of the horizontal axis, that is −1. There is nothing to accept.' },
    { q: 'Why is the arrow turned by θ written as an exponential, e^(iθ)?', options: ['as an abbreviation', 'because multiplying arrows ADDS the angles, which is what powers do: x^a · x^b = x^(a+b)', 'because e is about 2.718', 'because Euler decided so'], correct: 1,
      why: 'The exponential is the operation that turns sums of exponents into products. Arrows of length 1 do the same thing with angles, so the exponential notation is the one that describes their behaviour.' },
    { q: 'What are the n-th roots of unity?', options: ['the divisors of n', 'n arrows of length 1 equally spaced on the circle: raised to the n they all give 1', 'the solutions of x² = n', 'the primes below n'], correct: 1,
      why: 'Raising to the n adds the angle n times: for the result to be 1 the angle has to be a multiple of 360/n. There are n of them, at the vertices of a regular polygon with the first on 1.' },
    { q: 'What is the sum of all n n-th roots of unity (with n > 1)?', options: ['n', '1', '0', 'it depends on n'], correct: 2,
      why: 'They are arranged in perfect balance in every direction, so they cancel out: the tip-to-tail chain returns to its starting point. It is the zero that in the DFT cancels every wrong frequency.' },
    { q: 'What is the link between the roots of unity and the Fourier transform?', options: ['none', 'the DFT weights the samples with exactly those arrows: when the frequency is absent they add to zero, when it is present they line up and make the peak', 'they are only used for the FFT', 'they are used to normalise the results'], correct: 1,
      why: 'The DFT coefficients e^(2πi·jk/N) are the N-th roots of unity raised to jk. The silence on the wrong frequencies is their vanishing sum; the peak is the case where they all point the same way.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> Multiplying is stretching and turning; from there e^(iθ) becomes the
          obvious notation rather than magic, and i² = −1 becomes half a turn. The n-th roots of unity are n equally
          spaced arrows that add to zero — and it is that zero, nothing else, that gives the Fourier transform a peak
          instead of noise. From here on every e^(iθ) in the course reads at a glance.</div>`,
});
@endsection
