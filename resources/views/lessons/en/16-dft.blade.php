@php($description = 'The discrete Fourier transform (DFT) taken apart symbol by symbol, with the rotating arrows that add up or cancel out.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { dftLab, windingLab } from '/js/widgets/dftlab.js';

const L = renderLesson({
  id: '16-dft',
  lead: `Here we are: the formula that scares half the internet. By the end of this level you will read it the way you read
         your grandmother's recipe, because you will have <b>moved every one of its pieces with your own hands</b>.`,

  steps: [
    {
      t: 'The problem, said in plain English',
      html: `
        <p>A computer does not see a continuous curve: it sees a <b>list of numbers</b>, the <b>samples</b>.
        For example the list of 4 numbers:</p>
        <pre><code>x = [ 1 , 0 , 1 , 0 ]
      n=0 n=1 n=2 n=3</code></pre>
        <p>The question is always the same: <b>which periodicities are inside this list?</b>
        Looking at it by eye you can see it repeats every 2 positions. The DFT (Discrete Fourier Transform)
        is the tool that <b>discovers it on its own</b>, and does so for all the possible periodicities in one shot.</p>
        <div class="callout"><b>A note on the name:</b> "discrete" only means that it works on a finite list of numbers
        instead of on a continuous curve. Nothing deeper than that.</div>`,
    },

    {
      t: 'The formula. Right now. No beating about the bush',
      html: `
        <div class="formula" style="font-size:20px">
          <span class="hl-x">X(k)</span> = Σ<sub>n=0</sub><sup>N−1</sup> <span class="hl-n">x(n)</span> · e<sup>−i·2π·<span class="hl-k">k</span>·<span class="hl-n">n</span>/<span class="hl-N">N</span></sup>
        </div>
        <p>Touch every piece below: each one has a concrete meaning and a numerical example.
        Then, underneath, there is the game where <b>you see that very same formula spinning</b>.</p>`,
      mount: el => {
        formula(el, {
          title: 'The DFT taken apart — touch every symbol',
          hint: 'No symbol stays mysterious: touch them all, one by one.',
          parts: [
            { t: 'X(k)', id: 'X', color: 'pink', name: 'the result for frequency k', say: 'A complex number, that is, an arrow. Its LENGTH says how much that frequency is present in the signal; its ANGLE says with which phase.', ex: 'If |X(2)| is large and |X(1)| ≈ 0, the signal has a periodicity matching k=2 and not k=1.' },
            { t: '=' },
            { t: 'Σ', id: 'S', color: 'green', name: 'add up all the pieces', say: 'Add up what follows for n = 0, 1, 2, …, N−1. That is: take each sample, do its share of the computation, and throw everything into a single total.', ex: 'With N = 4: X(k) = (piece of n=0) + (piece of n=1) + (piece of n=2) + (piece of n=3).' },
            { t: 'x(n)', id: 'x', color: 'cyan', name: 'sample number n', say: 'Your raw datum: the value measured at instant n. In the game it is the height of the little bar you drag.', ex: 'x = [1, 0, 1, 0] → x(0)=1, x(1)=0, x(2)=1, x(3)=0.' },
            { t: '·' },
            { t: 'e^{−i·2π', id: 'e', color: 'violet', name: 'the rotating arrow', say: 'The arrow of length 1 at the indicated angle (level 8!). The MINUS sign means we rotate clockwise. Multiplying x(n) by this arrow means: take the datum and ROTATE it.', ex: 'e^{−i·2π·(1/4)} = e^{−i·90°} = −i, that is "rotate by a quarter turn clockwise".' },
            { t: 'k', id: 'k', color: 'amber', name: 'the frequency you are testing', say: 'k is the question: "is there a periodicity that makes exactly k cycles inside the window?". By changing k you change the SPEED at which the arrows turn.', ex: 'k=0 → no rotation (all the arrows stay still, and the sum is the average). k=1 → one full turn spread over all the samples. k=2 → two turns.' },
            { t: '·' },
            { t: 'n', id: 'n', color: 'cyan', name: 'the number of the sample', say: 'It acts as "time". The further along the list a sample is, the more it gets rotated. This is what turns the rotation into an orderly sweep.', ex: 'For k=1 and N=4: n=0 rotates by 0°, n=1 by 90°, n=2 by 180°, n=3 by 270°.' },
            { t: '/', id: 'div' , color: 'green', name: 'divided by', say: 'The division by N spreads the turns over all the samples: it makes exactly k full turns come out when you reach the end of the list.' },
            { t: 'N}', id: 'N', color: 'green', name: 'how many samples you have', say: 'The length of the list. It also determines HOW MANY frequencies you can test: exactly N, that is k = 0, 1, …, N−1. No more: with few data you cannot tell infinitely many frequencies apart.', ex: 'N = 8 samples → 8 testable frequencies, from k=0 to k=7.' },
          ],
        });
      },
      after: `<div class="callout key"><b>Full translation into plain English:</b><br>
              "For every frequency k: take each datum, <b>rotate it</b> by an angle that grows as you move along
              the list, and <b>add up</b> all the arrows you get. If the sum is long, that frequency is there. If it is short, it is not."
              <br>That is it. There is nothing else inside that formula.</div>`,
    },

    {
      t: 'The game: watch the arrows really spin',
      html: `
        <p>Here is the formula in motion. On the left there are your data <b>x(n)</b> (drag the little bars with the mouse!).
        In the middle the <b>N rotated arrows</b> joined head to tail: the pink one is the sum, that is X(k).
        Below, the <b>spectrum</b>: the length of X(k) for every k (clickable).</p>
        <p><b>What to try, in order:</b></p>
        <ol>
          <li>Leave the preset <code>1 0 1 0…</code> and set <b>k = 0</b>: no rotation, the arrows all point right, big sum.</li>
          <li>Set <b>k = 1</b>: the arrows spread out and close back on themselves → sum ≈ 0. <b>That frequency is not there.</b></li>
          <li>Set <b>k = 4</b> (with N=8): all the arrows of the even samples point right… big sum.
              <b>Periodicity found!</b></li>
          <li>Press "add the arrows one at a time" to see the total build up step by step.</li>
        </ol>`,
      mount: el => {
        const m = L.mission({ key: 'trovak', title: 'Find the periodicity', text: 'load the "period 4" preset and find a k where the sum goes above 1.5 (a tall bar in the spectrum).', xp: 60 });
        el.appendChild(m.root);
        dftLab(el, {
          N: 8, preset: 'alternato', k: 0,
          onChange: s => {
            const isP4 = s.x.every((v, i) => Math.abs(v - (i % 4 === 0 ? 1 : 0)) < 0.01);
            if (isP4 && s.mag > 1.5) m.complete();
          },
        });
      },
    },

    {
      t: 'Let us do the sum by hand: x = [1, 0, 1, 0]',
      html: `<p>Now the real computation, all written out, with N = 4. It is here to convince you that the game does not cheat.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'k = 0 (no rotation)', html: `The angles are all 0°, so every arrow points right:<br>
            <code>X(0) = 1·(→) + 0·(→) + 1·(→) + 0·(→) = 2</code><br>
            <b>|X(0)| = 2.</b> The value for k = 0 is always the <b>sum of the data</b> (that is, up to a factor N, their average).` },
          { h: 'k = 1 (one turn spread over 4 samples)', html: `The angles are 0°, −90°, −180°, −270°:<br>
            <code>X(1) = 1·(→) + 0·(↓) + 1·(←) + 0·(↑) = (+1) + (−1) = 0</code><br>
            <b>|X(1)| = 0.</b> The two non-zero arrows are opposite: <b>perfect cancellation</b>.` },
          { h: 'k = 2 (two turns)', html: `The angles are 0°, −180°, −360°, −540°, that is →, ←, →, ←:<br>
            <code>X(2) = 1·(→) + 0·(←) + 1·(→) + 0·(←) = 2</code><br>
            <b>|X(2)| = 2.</b> There is the periodicity: the signal repeats <b>every 2 samples</b>, and k=2 means exactly
            "2 cycles inside a window of 4".` },
          { h: 'k = 3', html: `<code>X(3) = 1·(→) + 0 + 1·(←) + 0 = 0</code><br>
            <b>|X(3)| = 0.</b> Just like k=1.` },
          { h: 'Final result', html: `Spectrum = <b>[2, 0, 2, 0]</b>.<br>
            The signal <code>[1,0,1,0]</code> in time becomes <code>[2,0,2,0]</code> in frequencies:
            "there is a constant component and one at two cycles, and nothing else". <br>
            <b>We have changed point of view, we have not lost information</b>: from these 4 numbers you can go back exactly.` },
          { h: 'Try it in the game', html: `In the widget above, set the 4 values (or use the alternating preset with N=8, which gives the same pattern
            doubled) and compare the spectrum with the numbers we have just computed. <b>They match.</b>` },
        ], { doneLabel: 'Sum done!' });
      },
    },

    {
      t: 'The "wound up" version: the same thing, even more visual',
      html: `
        <p>There is a second way of looking at the transform, which for many people makes the final penny drop.</p>
        <p>Take the signal and <b>wind it around a circle</b>: instead of unrolling it in time, you wrap it
        at a certain speed. Then look at where the <b>centre of mass</b> of the resulting figure is
        (imagine it made of wire: where would you put your finger to balance it?).</p>
        <ul>
          <li><b>Wrong</b> winding speed → the heavy pieces end up scattered all around → the centre of mass is
              near the origin → that frequency is not there.</li>
          <li><b>Right</b> speed → all the peaks of the signal end up <b>on the same side</b> → the centre of mass
              shoots away → that frequency is there.</li>
        </ul>
        <p>In the game: press "sweep every frequency" and watch the <b>peaks</b> appear below, exactly
        at the frequencies contained in the signal.</p>`,
      mount: el => windingLab(el, { freqs: [2, 5] }),
    },

    {
      t: 'The things that confuse everybody (and the answer)',
      html: `
        <h3>What does k mean exactly?</h3>
        <p>It is not "k Hz". It is <b>"k complete cycles in the window of N samples"</b>. To convert into Hz you need to know
        how often you sampled: if you take <code>fs</code> samples per second, then
        <b>frequency in Hz = k · fs / N</b>.</p>
        <h3>Why is the spectrum "mirrored"?</h3>
        <p>If the data are real numbers, you will notice that |X(k)| and |X(N−k)| are equal. It is not a bug: k and N−k are
        <b>the same rotation speed, in the opposite direction</b> — like saying "3 turns forwards" and "3 turns backwards".
        That is why, on real data, half the spectrum is redundant.</p>
        <h3>Why is there a minus sign in the exponent?</h3>
        <p>Pure convention: in the <b>forward</b> transform you rotate clockwise, in the <b>inverse</b> one anticlockwise
        (plus sign) and you divide by N. Some textbooks — and the quantum QFT! — use the <b>plus</b> sign for the forward one.
        It does not change the substance: only the direction of rotation changes, hence the sign of the phases.</p>
        <div class="callout"><b>Reconstruction (inverse transform):</b> <br>
        <code>x(n) = (1/N) · Σ_k X(k) · e^{+i·2π·k·n/N}</code><br>
        That is: put back together all the waves with their amplitudes and phases. It is the <b>synthesis</b> of level 15, written properly.</div>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> Set all the samples equal to 1 (the "all the same" preset). What spectrum comes out? Why are all the other bars zero?</p>
        <p><b>2.</b> Set a single sample to 1 and all the others to 0 (the "a single spike" preset). Look at the spectrum:
           it is <b>flat</b>. What does "an impulse contains all the frequencies" mean? Try explaining it with the arrows.</p>
        <p><b>3.</b> Take the "3 cycles" preset and move <b>a single</b> sample. How many bars of the spectrum change?
           <span class="muted">(uncomfortable answer: practically all of them — every sample takes part in every frequency)</span></p>
        <p class="mb0"><b>4.</b> Creative challenge: can you build, by dragging the little bars, a signal whose spectrum has
           <b>two</b> equal peaks and nothing else? And one that has a single peak at k=1?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'In the DFT formula, what exactly does e^{−i·2πkn/N} do?',
      options: ['It amplifies the sample', 'It rotates the sample by an angle that depends on k and n', 'It removes the noise', 'It computes the average'],
      correct: 1,
      why: 'It is the arrow of length 1 at the angle −2πkn/N: multiplying by it <b>rotates</b> the sample, without changing its length. The whole DFT is "rotate and add".' },
    { q: 'X(0) (that is, k = 0) corresponds to…',
      options: ['the highest frequency', 'the sum of all the samples (the constant component)', 'always zero', 'the initial phase'],
      correct: 1,
      why: 'With k = 0 all the angles are zero: no rotation, so the data are added up just as they are. It is the "DC" component, the average value of the signal multiplied by N.' },
    { q: 'The signal [1,0,1,0] has spectrum [2,0,2,0]. Why is |X(1)| = 0?',
      options: ['Because the signal is too short', 'Because the arrows of the two non-zero samples turn out opposite and cancel out', 'Because k=1 does not exist', 'Because the sum of the data is 2'],
      correct: 1,
      why: 'With k=1 and N=4, sample n=0 does not rotate (arrow →) and sample n=2 rotates by 180° (arrow ←). One plus one in opposite directions makes <b>zero</b>: perfect destructive interference.' },
    { q: 'With N = 8 samples, how many different frequencies can you test?',
      options: ['infinitely many', '8 (from k=0 to k=7)', '4', 'it depends on the amplitude'],
      correct: 1,
      why: 'Exactly N. With 8 numbers going in, 8 complex numbers come out: no information created, none lost — only changed in shape.' },
  ],

  outro: `<div class="callout ok"><b>What you take home:</b> the DFT is <b>"rotate and add"</b> repeated for every frequency k.
          Aligned arrows give a peak (frequency present), scattered ones give zero (absent).
          From now on, every time you see <code>e^{±i2πkn/N}</code> — even inside a quantum circuit —
          you will know how to read it at a glance.</div>`,
});
@endsection
