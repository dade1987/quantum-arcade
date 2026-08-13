@php($description = 'Amplitude, frequency and phase of a wave — plus the period, T = 1/f — explained with sliders and sound: the basis for understanding the Fourier transform and then the QFT.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { waveLab, clockWave } from '/js/widgets/wave.js';

const L = renderLesson({
  id: '13-onde',
  lead: `Change of scenery, but for a precise reason. To get to the <b>QFT</b> and to <b>Shor</b> we are missing one tool:
         being able to recognise the <b>periodicities</b> hidden inside a list of numbers. That tool is called
         the Fourier transform, and to build it we need three words: <b>amplitude</b>, <b>period</b>, <b>frequency</b>.
         Good news: you have already seen all of them, in the dot going round the circle in level 0·3.`,

  steps: [
    {
      t: 'A wave is a thing that repeats',
      html: `
        <p><b>Why do we need waves in a quantum course?</b> Because the amplitudes of a quantum state,
        lined up in a row, form a list of numbers — and the question we care about for Shor is:
        <i>"how often does this list repeat?"</i>. That is exactly the question Fourier answers,
        and Fourier thinks in terms of waves.</p>
        <p>Think of a swing: up, down, up, down. Think of a heartbeat. Think of a loudspeaker
        pushing the air back and forth. All these things make <b>always the same movement</b>, and they repeat it.</p>
        <p>The simplest way to draw a thing that repeats is this: take a dot, make it <b>go round in a circle</b>
        at constant speed, and then draw <b>only its height</b> as time goes by. Out comes a smooth curve
        that rises and falls forever: we call it a <b>sinusoid</b> (or wave).</p>
        <div class="callout key"><b>The golden rule:</b> one <b>full turn</b> of the dot = <b>one cycle</b> of the wave.
        Everything we say afterwards is just a more precise way of saying this sentence.</div>`,
      mount: el => clockWave(el, { f: 1 }),
    },

    {
      t: 'The three knobs of every wave',
      html: `
        <p>A simple wave is controlled by <b>three knobs only</b>. By changing those three, you get any
        sinusoid that exists in the world:</p>
        <ul>
          <li><b>Amplitude (A)</b> — how tall it is. In sound it is the <b>volume</b>.</li>
          <li><b>Frequency (f)</b> — how many complete cycles it makes in one second. In sound it is how <b>high or low</b> it is.
              It is measured in <b>Hertz (Hz)</b>: 3 Hz means "3 cycles per second".</li>
          <li><b>Phase (φ)</b> — how far it is <b>shifted forwards or backwards</b>. It is the only one of the three that at first sight
              looks useless… and yet in the rest of the course it will be the most important of them all.</li>
        </ul>
        <p>Move the sliders below. Watch what happens to the coloured labels <b>inside</b> the graph:
        the yellow arrow is A, the green bracket is the period, the violet arrow is the phase shift.</p>`,
      mount: el => {
        waveLab(el, { A: 1, f: 1, phi: 0 });
        formula(el, {
          title: 'The wave formula — touch every piece',
          parts: [
            { t: 'y(t)', id: 'y', color: 'cyan', name: 'the height of the wave', say: 'How much the wave is worth at instant t. It is the number you would read on an instrument at that precise moment.', ex: 'If y(0.25) = 0.7, it means that after a quarter of a second the wave is at a height of 0.7.' },
            { t: '=' },
            { t: 'A', id: 'A', color: 'amber', name: 'amplitude', say: 'The maximum the wave manages to reach. It multiplies everything: if you double A, the wave becomes twice as tall (in sound: double volume).', ex: 'A = 0.5 → the wave swings between −0.5 and +0.5.' },
            { t: '·' },
            { t: 'cos', id: 'cos', color: 'green', name: 'the "repeating" shape', say: 'The cosine is the machine that turns an angle into a height between −1 and +1, repeating itself every turn. It is the shadow of the spinning dot.', ex: 'cos(0°) = 1 (at the top), cos(90°) = 0 (halfway), cos(180°) = −1 (at the bottom).' },
            { t: '(' },
            { t: '2π f t', id: 'ft', color: 'violet', name: 'the angle reached at time t', say: 'Here is the heart: 2π is a full turn (360°). Multiplied by f (turns per second) and by t (seconds elapsed) it gives the total angle travelled by the dot.', ex: 'f = 2 Hz and t = 0.5 s → 2π·2·0.5 = 2π = exactly one turn: we are back at the starting point.' },
            { t: '+' },
            { t: 'φ', id: 'phi', color: 'pink', name: 'initial phase', say: 'From which point on the circle the dot starts at t = 0. It shifts the whole wave forwards or backwards without changing its shape.', ex: 'φ = 90° → the wave starts halfway up instead of at the top.' },
            { t: ')' },
          ],
        });
      },
    },

    {
      t: 'Period and frequency: two ways of saying the same thing',
      html: `
        <p>The <b>period T</b> is how much time goes by before the wave starts over identically. The <b>frequency f</b> is how many
        cycles fit into one second. They are the same information, turned around:</p>
        <div class="formula">T = <span class="hl-n">1</span> / f &nbsp;&nbsp;&nbsp;&nbsp; and &nbsp;&nbsp;&nbsp;&nbsp; f = <span class="hl-n">1</span> / T</div>
        <table class="table">
          <tr><th>Frequency f</th><th>Period T</th><th>How it sounds / looks</th></tr>
          <tr><td class="mono">1 Hz</td><td class="mono">1 s</td><td>one cycle per second, very slow (visible to the naked eye)</td></tr>
          <tr><td class="mono">4 Hz</td><td class="mono">0.25 s</td><td>four cycles per second (a fast beat)</td></tr>
          <tr><td class="mono">110 Hz</td><td class="mono">0.0091 s</td><td>a low note (the A of a bass)</td></tr>
          <tr><td class="mono">1000 Hz</td><td class="mono">0.001 s</td><td>a shrill whistle</td></tr>
        </table>
        <div class="callout"><b>Trick to remember it:</b> the <b>shorter</b> the period, the more cycles fit into one second,
        so the <b>higher</b> the frequency. Short ↔ high. Always the other way round.</div>`,
      mount: el => {
        stepper(el, [
          { h: 'Question 1', html: 'A wave has frequency <b>f = 5 Hz</b>. How long does one cycle last?<br><span class="muted">Think: 5 cycles in one second, so each one lasts…</span>' },
          { h: 'Answer 1', html: 'T = 1/5 = <b>0.2 seconds</b>. Five pieces of 0.2 s make exactly 1 second. ✔' },
          { h: 'Question 2', html: 'A wave repeats its drawing every <b>T = 0.01 s</b>. What is the frequency?' },
          { h: 'Answer 2', html: 'f = 1/0.01 = <b>100 Hz</b>. A hundred repetitions in one second.' },
          { h: 'Question 3', html: 'If I <b>double the frequency</b>, what happens to the period?' },
          { h: 'Answer 3', html: 'It is <b>halved</b>. They are inversely proportional: if one goes up, the other goes down by the same factor. They are the same coin seen from its two faces.' },
        ], { doneLabel: 'Clear!' });
      },
    },

    {
      t: 'Mission: trace the mystery wave',
      html: `<p>Now it is your turn. Below there is a <span style="color:var(--pink)"><b>pink dashed</b></span> wave:
             that is the target. Move your three knobs until your cyan wave lands right on top of it.</p>
             <p class="dim small">Practical hint: first sort out the <b>amplitude</b> (how tall it is),
             then the <b>frequency</b> (count how many cycles there are in 2 seconds), and only at the end the <b>phase</b>
             (shift it until the two peaks coincide).</p>`,
      mount: (el) => {
        const m = L.mission({ key: 'match', title: 'Overlap the waves', text: 'bring your wave exactly on top of the pink one.', xp: 40 });
        el.appendChild(m.root);
        waveLab(el, {
          A: 0.4, f: 3, phi: 0,
          target: { A: 1.1, f: 1.5, phi: 60 },
          title: 'Challenge: trace the target', subtitle: 'amplitude, frequency, phase',
          onMatch: () => m.complete(),
        });
      },
    },

    {
      t: '💡 Try it yourself (no written answers)',
      html: `
        <div class="callout think">
          <p><b>1.</b> Set the amplitude to zero. What frequency does the wave have now? Does the question even make sense?</p>
          <p><b>2.</b> Take the frequency to the minimum and then to the maximum while holding down the 🔊 button.
             At what point do you stop "hearing the single beats" and start hearing a <b>note</b>?</p>
          <p><b>3.</b> Shift the phase by 360°. What changes in the graph? And why, in your opinion, are 360° and 0°
             the same thing while 180° is not?</p>
          <p class="mb0"><b>4.</b> A real sound (a voice) is not a single sinusoid. How, in your opinion, could one
             build a complicated shape having only these round waves available? <i>(That is the question of level 15.)</i></p>
        </div>`,
    },
  ],

  quiz: [
    {
      q: 'A wave has period T = 0.25 seconds. What is its frequency?',
      options: ['0.25 Hz', '4 Hz', '25 Hz', 'It depends on the amplitude'],
      correct: 1,
      why: 'f = 1/T = 1/0.25 = <b>4 Hz</b>. Four pieces of 0.25 s fit into one second. The amplitude has nothing to do with it: it is an independent knob.',
    },
    {
      q: 'If I increase only the amplitude of a sound, what changes?',
      options: ['It gets higher-pitched', 'It gets louder', 'It gets faster', 'Its phase changes'],
      correct: 1,
      why: 'Amplitude is the <b>volume</b>. High/low pitch is the frequency. Phase is the shift in time, and on its own it cannot be heard at all.',
    },
    {
      q: 'Two waves have the same amplitude and the same frequency, but one is shifted with respect to the other. What tells them apart?',
      options: ['The period', 'The phase', 'The volume', 'Nothing, they are identical'],
      correct: 1,
      why: 'It is exactly the <b>phase</b>: same shape, same rhythm, but they start at different moments of the cycle. Level 14 is entirely devoted to it.',
    },
  ],

  outro: `<div class="callout ok"><b>What you take home:</b> a wave = something that repeats; it is controlled with
          <b>amplitude</b> (how tall it is), <b>frequency</b> (how many cycles per second, in Hz) and <b>phase</b> (how far it is shifted);
          period and frequency are linked by <b>T = 1/f</b>. In the next level: the phase of waves — which is the same thing as the phase of qubits, seen from another angle.</div>`,
});
@endsection
