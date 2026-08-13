@php($description = 'Complex numbers as arrows: modulus and phase, Euler\'s formula e^{iθ} = cos θ + i·sin θ, and why multiplying by e^{iθ} simply means rotating.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { phasorLab, multiplyLab } from '/js/widgets/phasor.js';

const L = renderLesson({
  id: '08-frecce',
  lead: `At level 7 we saw the limit of + and − signs: only two directions. Now we give amplitudes
         the freedom to point <b>anywhere</b>. The tool is called a <b>complex number</b> and its most feared symbol,
         <b>e^{iθ}</b>, is simply a clock hand.`,

  steps: [
    {
      t: 'The practical problem we are solving',
      html: `
        <p>Let us recap. A quantum amplitude needs <b>two</b> pieces of information:
        <b>how big it is</b> (which decides the probability) and <b>which way it points</b>
        (the <b>phase</b>: the longitude on the Bloch sphere from level 2).</p>
        <p>So far there were only two directions: forwards (+) and backwards (−). But cancelling many possibilities at once
        needs many directions, and it needs convenient arithmetic: adding two amplitudes must stay easy, and so must
        <b>rotating</b> them. The mathematical object that does exactly this is called a <b>complex number</b>.</p>
        <div class="callout warn"><b>Let us dispose of the name straight away.</b> "Imaginary" is an unfortunate historical term, chosen by people
        who found them suspicious. There is nothing fake about them: they are <b>pairs of numbers</b> with a particularly
        clever multiplication rule. If you prefer, call them <b>"arrows"</b> for the whole course: it works just the same.</div>`,
    },

    {
      t: 'A complex number is an arrow on a sheet of paper',
      html: `
        <p>Take a sheet with two axes. We call the horizontal one <b>real</b> and the vertical one <b>imaginary</b>.
        An arrow starting at the origin is described in two equivalent ways:</p>
        <ul>
          <li><b>Coordinates:</b> "go 3 right and 4 up" → written <code>3 + 4i</code>. That <b>i</b> is just a label
              meaning "this piece is vertical".</li>
          <li><b>Length and angle:</b> "length 5, tilted by 53°" → the same arrow, said differently.</li>
        </ul>
        <p>The length is called the <b>modulus</b>, the angle the <b>phase</b> (or argument). The link is Pythagoras:</p>
        <div class="formula">|z| = √(<span class="hl-n">a</span>² + <span class="hl-k">b</span>²)&nbsp;&nbsp;&nbsp;&nbsp;
        with z = <span class="hl-n">a</span> + <span class="hl-k">b</span>i&nbsp;&nbsp;&nbsp;&nbsp;
        (example: |3 + 4i| = √(9+16) = √25 = 5)</div>
        <div class="callout key">So: <b>amplitude = length of the arrow</b>, <b>phase = angle of the arrow</b>.
        One single object carries both pieces of information. That is exactly what we needed.</div>`,
    },

    {
      t: 'e^{iθ}: the arrow of length 1 pointing at angle θ',
      html: `
        <p>Here is the symbol that scares everyone. Let us take it lightly, because it means one thing only:</p>
        <div class="formula" style="font-size:19px">e<sup>iθ</sup> = cos θ + i · sin θ &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="muted" style="font-size:13px">(Euler's formula)</span></div>
        <p>Translated: <b>«the arrow of length 1 pointing at angle θ»</b>. Its shadow on the horizontal axis is
        <b>cos θ</b>, the one on the vertical axis is <b>sin θ</b>. That is all.</p>
        <p>Drag the arrow in the game below and watch the two shadows (yellow and green) move.
        On the right you see the two waves that come out of it: <b>cosine and sine are nothing but the shadows of a spinning dot</b>.</p>`,
      mount: el => {
        phasorLab(el, { theta: Math.PI / 4, spin: 0 });
        formula(el, {
          title: 'e^{iθ} taken apart piece by piece',
          parts: [
            { t: 'e', id: 'e', color: 'amber', name: "Euler's number (2.718…)", say: 'It is just a constant, like π. You do not need to know where it comes from here: it is there for one very handy property, namely that multiplying two exponentials means ADDING the exponents.', ex: 'e^a · e^b = e^(a+b) — that property, applied to angles, becomes "rotating twice = adding the angles".' },
            { t: '^{ i', id: 'i', color: 'violet', name: 'the imaginary unit', say: 'The i means "vertical direction". Its only rule is: i × i = −1. Everything else follows from that single rule, rotations included.', ex: 'Multiplying by i = rotating by 90° anticlockwise. Do it twice and you get −1, that is, a 180° turn: indeed i·i = −1.' },
            { t: 'θ }', id: 'th', color: 'cyan', name: 'the angle', say: 'How far the arrow is rotated, measured in radians (2π = a full turn). It is the PHASE from level 2, that is, the longitude on the Bloch sphere.', ex: 'θ = π/2 (90°) → e^{iπ/2} = i, the arrow pointing up.' },
            { t: '=' },
            { t: 'cos θ', id: 'cos', color: 'amber', name: 'the horizontal shadow', say: 'The projection of the arrow onto the real axis: how far "right" it is.' },
            { t: '+ i ·' },
            { t: 'sin θ', id: 'sin', color: 'green', name: 'the vertical shadow', say: 'The projection onto the imaginary axis: how far "up" it is.' },
          ],
        });
      },
    },

    {
      t: 'The four positions worth memorising',
      html: `
        <p>There are four angles that will come back <b>constantly</b> through the rest of the course (and they are the same ones
        appearing in the 2-qubit QFT). Learning them at a glance will save you hours:</p>
        <table class="table">
          <tr><th>Angle</th><th>e^{iθ} is</th><th>Arrow</th><th>How to read it</th></tr>
          <tr><td class="mono">0°</td><td class="mono">1</td><td style="font-size:20px">→</td><td>right, the starting point</td></tr>
          <tr><td class="mono">90°</td><td class="mono">i</td><td style="font-size:20px">↑</td><td>a quarter turn</td></tr>
          <tr><td class="mono">180°</td><td class="mono">−1</td><td style="font-size:20px">←</td><td>half a turn: <b>the minus sign is a rotation!</b></td></tr>
          <tr><td class="mono">270°</td><td class="mono">−i</td><td style="font-size:20px">↓</td><td>three quarters of a turn</td></tr>
        </table>
        <div class="callout key"><b>An important revelation:</b> the <b>minus sign</b> is not "the opposite", it is
        <b>a rotation of half a turn</b>. That is why at level 7 two opposite amplitudes cancelled:
        one was the other multiplied by −1, that is, turned half a turn.</div>`,
      mount: el => {
        stepper(el, [
          { h: 'Why is i × i = −1?', html: 'Multiplying by <b>i</b> means rotating by 90°. Doing it <b>twice</b> means rotating by 180°, that is, arriving on the opposite side. And "the opposite side of 1" is −1. So i·i = −1. It is not a quirk: it is geometry.' },
          { h: 'And i × i × i × i?', html: 'Four 90° rotations = 360° = a full turn = you are back at <b>1</b>. Indeed i⁴ = 1. The powers of i go round in circles: 1, i, −1, −i, 1, i, −1, −i…' },
          { h: 'What is all this for?', html: 'In the Fourier transform we will multiply the data by e^{-i2πkn/N}. Now you know what that means: <b>rotating every data point by a certain angle</b>. Nothing else.' },
          { h: 'And in the quantum world?', html: 'The "phase gates" (S, T, R) do exactly this to qubit amplitudes: they multiply by e^{iθ}, that is, they <b>rotate the arrow</b> without changing its length. So they do not change the probabilities… but they change everything else.' },
        ]);
      },
    },

    {
      t: 'Multiplying = rotating (the trick that makes it all work)',
      html: `
        <p>One last rule, and it is the one that makes complex numbers <b>indispensable</b>:</p>
        <div class="callout key">When you <b>multiply</b> two arrows: the <b>lengths multiply</b> and the <b>angles add</b>.</div>
        <p>Practical consequence: if you multiply any arrow by e^{iθ} (which has length 1),
        the length <b>does not change</b> and the angle <b>increases by θ</b>. That is: <b>multiplying by e^{iθ} = rotating by θ</b>.</p>
        <p>Drag arrows A and B in the game and check: the pink arrow (the product) always has length |A|·|B| and angle ∠A + ∠B.</p>`,
      mount: el => {
        const m = L.mission({ key: 'rot90', title: 'Rotation to order', text: 'set A to length 1 at angle 0°, and B to length 1 at angle 90°: the product must land exactly on i.', xp: 40 });
        el.appendChild(m.root);
        const lab = multiplyLab(el);
        const check = setInterval(() => {
          const a = lab.state.a, b = lab.state.b;
          const dg = ang => ((ang * 180 / Math.PI) % 360 + 360) % 360;
          const near = (x, y, tol) => Math.abs(x - y) < tol;
          if (near(a.r, 1, .12) && (dg(a.th) < 10 || dg(a.th) > 350) && near(b.r, 1, .12) && near(dg(b.th), 90, 10)) {
            m.complete(); clearInterval(check);
          }
        }, 400);
      },
    },

    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game set the rotation speed to 1 turn/s and watch the two waves on the right.
           Which of the two (cos or sin) is "ahead" of the other? By how many degrees?</p>
        <p><b>2.</b> What number is e^{i·360°}? And e^{i·720°}? What does that tell you about the phase being
           "circular" information?</p>
        <p><b>3.</b> In the multiplication game, keep B at length <b>0.5</b>: what happens to the product arrow
           if you keep rotating A? Picture the path in your head.</p>
        <p class="mb0"><b>4.</b> A real challenge: how would you <b>rotate backwards</b> by θ using a multiplication?
           <span class="muted">(hint: what angle does e^{-iθ} have?)</span> This is the difference between the forward and the inverse transform.</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What is e^{iπ} (that is, e^{i·180°})?',
      options: ['1', 'i', '−1', '0'],
      correct: 2,
      why: 'Half a turn takes the arrow from "right" to "left": e^{iπ} = <b>−1</b>. Written as e^{iπ} + 1 = 0, it is the famous Euler identity, bringing together e, i, π, 1 and 0.' },
    { q: 'What does multiplying by e^{iθ} do geometrically?',
      options: ['It lengthens the arrow by θ', 'It rotates the arrow by θ without changing its length', 'It changes the sign', 'Nothing'],
      correct: 1,
      why: 'e^{iθ} has length 1, so in the product the lengths do not change; the angles, on the other hand, add. It is a <b>pure rotation</b> — the building block of Fourier and of quantum phase gates.' },
    { q: 'Why is a complex number handy for describing a wave?',
      options: ['Because it is more precise', 'Because it keeps amplitude (length) and phase (angle) together', 'Because it removes the phase', 'Because it does the arithmetic by itself'],
      correct: 1,
      why: 'One single object carries both pieces of information needed to describe a wave at a given frequency, and the operations (adding = joining the arrows, multiplying = rotating) become geometric instead of trigonometric.' },
  ],

  outro: `<div class="callout ok"><b>What you take home:</b> complex number = arrow (length + angle);
          <b>e^{iθ} = arrow of length 1 at angle θ</b> = cos θ + i·sin θ; multiplying by e^{iθ} = <b>rotating</b>;
          the minus sign is a 180° rotation. The S, T and P(θ) gates from level 3 now have a precise meaning:
          they rotate the amplitude of |1⟩ by an angle. In the next levels we use this to build real algorithms.</div>`,
});
@endsection
