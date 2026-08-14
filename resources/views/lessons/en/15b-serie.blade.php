@php($description = 'The geometric series learned by playing: pieces that shrink and arrows that close into a circle. It is the formula that makes the Fourier peak appear, and that holds up the QFT, phase estimation and Shor.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { serieReale, serieFrecce } from '/js/widgets/serie.js';

const L = renderLesson({
  id: '15b-serie',
  lead: `One level from now you will watch the Fourier transform do something that looks like magic: at every wrong
         frequency the sum comes out <b>zero</b>, and at the right one a <b>peak</b> jumps out. Why zero, and not some
         random small number? The answer is a single formula, four centuries old, and you can play it in ten minutes.
         Learning it now means arriving at Fourier knowing <b>why</b> it works, instead of watching it work.`,

  steps: [
    {
      t: 'Pieces that keep shrinking',
      html: `<p>Start with a piece of length <b>1</b>. Then add a piece that is <b>half</b> of it. Then another that is
             half of that one. And so on, for ever.</p>
             <div class="formula">1 + ½ + ¼ + ⅛ + … = <span class="hl-n">2</span></div>
             <p>Infinitely many pieces, and the total <b>never reaches 2</b>: it only gets closer. It is not a trick, it
             is what you see happening in the game: the pieces shrink so fast that the total runs into a wall.</p>
             <div class="callout key">The general rule, for pieces that get multiplied by <b>r</b> each time
             (with r between 0 and 1):
             <div class="formula" style="margin:8px 0 0">1 + r + r² + r³ + … = <span class="hl-n">1 / (1 − r)</span></div></div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'pezzi', title: 'Hit two totals', text: 'bring the total onto the requested targets by moving the fraction and the number of pieces.', xp: 35 });
        el.appendChild(m.root);
        serieReale(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>The game also shows the other formula, the one for a <b>finite</b> number of pieces:</p>
              <div class="formula">1 + r + … + r<sup>n−1</sup> = <span class="hl-n">(1 − rⁿ) / (1 − r)</span></div>
              <p>It always holds, not only for small r. And it is this one — not the infinite one — that will do all the
              work two steps from now.</p>`,
    },

    {
      t: 'The same pieces, but turned',
      html: `<p>Now the jump. Instead of pieces that get <b>shorter</b>, take arrows that <b>turn</b>: all the same length,
             each one rotated by a fixed step from the previous one.</p>
             <p>It is exactly the same sum as before — every piece comes from the previous one multiplied by the same
             thing — except that the "same thing" is now a <b>rotation</b> instead of a fraction.</p>
             <p>And something worth watching closely happens:</p>
             <ul>
               <li>if the step is <b>zero</b> (or a whole turn), every arrow points the same way and they all add up: the
                   sum is as long as the number of arrows. <b>That is the peak.</b></li>
               <li>if the step is <b>one turn divided by the number of arrows</b> (or a multiple of it), the chain closes
                   on itself: you come back to the start and the sum is <b>exactly zero</b>.</li>
               <li>for every other step the sum is something in between, neither large nor null.</li>
             </ul>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'catena', title: 'Close the chain, then line it up', text: 'hit 3 goals between "sum zero" and "largest sum".', xp: 45 });
        el.appendChild(m.root);
        serieFrecce(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<div class="callout key">Look carefully at the "sum zero" case: the arrows draw a <b>closed polygon</b>.
              Leaving and coming back to exactly the same point is why the sum is <b>exactly</b> zero and not "small":
              it is not an approximation, it is geometry.</div>`,
    },

    {
      t: 'This is where the peak comes from',
      html: `<p>Let us put the pieces together. For each test frequency, the Fourier transform does <b>exactly</b> what you
             just did with the slider: it turns every data point by a fixed step and adds up the arrows.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'The question', html: 'I ask the signal: "do you contain frequency k?". To answer, I turn data point number n by a step proportional to <b>k·n</b> and add everything up.' },
          { h: 'If the frequency is wrong', html: 'The rotation step is one turn divided by N (or a multiple of it): the chain closes, the sum is <b>exactly zero</b>. The signal answers "no" sharply, with no half measures.' },
          { h: 'If the frequency is the right one', html: 'The signal\'s rotations and the question\'s rotations <b>cancel each other</b>: the step becomes zero, every arrow points the same way and they all add up. <b>The peak is born.</b>' },
          { h: 'The calculation in full', html: 'The sum of the arrows is <b>|sin(N·Δ/2) / sin(Δ/2)|</b>: it is the (1 − rⁿ)/(1 − r) of the first game, written with rotations. It equals N when Δ = 0, and zero when Δ is a multiple of one turn divided by N.' },
          { h: 'Why we care so much', html: 'Because this is the mechanism a quantum computer <b>reads</b> with: the QFT makes the amplitudes interfere so that every wrong answer cancels out and only the right one is left. Same formula, different stage.' },
        ], { doneLabel: 'Got it!' });
      },
      after: `<div class="callout ok">From here on, every time you see a peak appear in a Fourier plot — in the DFT, in the
              QFT, in phase estimation, in Shor — you will know that underneath there is a chain of arrows that lined up,
              and many other chains that closed.</div>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game set the fraction to <b>0.9</b>: where does the wall end up? And at 0.99? Can you say
           why a fraction close to 1 makes the total enormous?</p>
        <p><b>2.</b> With 8 arrows, how many different steps between 1° and 359° give a sum of zero? Try them:
           <span class="muted">(there are 7, and that is no accident)</span></p>
        <p><b>3.</b> With 4 arrows and a step of 90°, what shape does the chain draw? And with 8 arrows and 45°?</p>
        <p class="mb0"><b>4.</b> Inventor's question: if there were <b>very many</b> arrows and a tiny step, what shape
           would the chain draw? <span class="muted">(hint: a circle — and that is why the Fourier integral looks so much
           like its discrete version)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What is 1 + ½ + ¼ + ⅛ + … (infinitely many pieces)?', options: ['infinity', '2', '1.5', 'it depends how many pieces you take'], correct: 1,
      why: 'With r = ½ the infinite sum is 1/(1 − ½) = 2. The total keeps getting closer without ever passing it.' },
    { q: 'Eight arrows of length 1, each turned 45° more than the previous one. How long is the sum?', options: ['8', '4', '0', 'it depends on the first arrow'], correct: 2,
      why: '45° is a whole turn divided by 8: the chain closes on itself and the sum is exactly zero. That cancellation is what gives sharp peaks in the Fourier transform.' },
    { q: 'When is the sum of the arrows largest?', options: ['when the step is 180°', 'when the step is zero or a whole turn', 'when there are many arrows', 'when the step is random'], correct: 1,
      why: 'With a null step all the arrows point the same way and add up: the length equals the number of arrows. That is exactly what happens at the right frequency.' },
    { q: 'Why do wrong frequencies give zero in the Fourier transform, rather than some small random number?', options: ['because of rounding', 'because the chain of arrows closes, and closing is an exact property', 'because the signal is clean', 'because low values are discarded'], correct: 1,
      why: 'Zero is not an approximation: it is geometry. Arrows at a constant step form a closed polygon, and leaving and returning to the same point means a null sum.' },
    { q: 'The formula (1 − rⁿ)/(1 − r) is good for…', options: ['fractions only', 'both shrinking pieces and turning arrows', 'whole numbers only', 'quantum computing only'], correct: 1,
      why: 'It is the same sum: only what r is changes. A fraction makes the pieces shrink, a rotation makes them turn — and in the second case the formula becomes the kernel that produces the peaks.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> Adding up many things that get multiplied by the same number each time: if
          that number is a fraction, the total hits a wall; if it is a rotation, either everything piles up or everything
          cancels. Now the Fourier transform is ready to be understood, not just watched.</div>`,
});
@endsection
