@php($description = 'What a qubit really is, with no complex numbers: signed amplitudes, Dirac notation, the Born rule, photons and polaroid filters, and the real difference between a qubit and a loaded coin.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { qubitBuilder, coinVsQubit, hadamardMap, probabilitaQuadrato } from '/js/widgets/qubit.js';
import { confronto } from '/js/core/confronto.js';
import { registroCoppia } from '/js/widgets/coppie.js';
import { polaroidLab } from '/js/widgets/quantum2.js';

const L = renderLesson({
  id: '01-qubit',
  lead: `We start with the big one: <b>what a qubit actually is</b>. No waves, no complex numbers, no heavy
         formulas: percentages and signed numbers from Part 0 are enough. By the end of this level you will
         already know the real difference between a qubit and a loaded coin — which is the thing almost nobody
         manages to explain.`,

  steps: [
    {
      t: 'Classical first: a bit is a switch, and that is all',
      html: `<p>The yardstick, in one line: a <b>bit</b> is a box holding <b>0 or 1</b>. Not "a bit of both",
             not "30% on". If you look at the transistor holding it, you find it in one of the two states —
             even while nobody is watching.</p>
             <p>And with <b>n</b> bits? The possible configurations are 2ⁿ, but the computer holds <b>exactly
             one</b> at a time. With 300 switches the configurations would outnumber the atoms in the universe,
             and you would still be using one of them.</p>
             <p>Before reading any further, try it: below is the same three-cell register, with a switch that
             changes machine. Read it five times as a normal computer, then move to the quantum one, put all
             three cells in superposition and read it twenty times. The difference is not in the explanation,
             it is in the bars.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'registro', title: 'The same register, two machines', text: 'read the classical register 5 times, then put the quantum one in superposition and measure it 20 times.', xp: 35 });
        el.appendChild(m.root);
        registroCoppia(el, { n: 3, onWin: () => m.complete() });
      },
      after: `<p>Keep that sentence in your hand while you read the rest of this level: it is the only thing
             about to change, and that is why it changes everything.</p>` +
             confronto({
               titolo: 'Bit and qubit, line by line',
               livello: 'k1-bit',
               vaiA: 'Play with real bits (level K·1)',
               classico: {
                 titolo: 'The bit',
                 html: `<ul class="mb0">
                          <li>holds <b>0 or 1</b></li>
                          <li>looking at it <b>does not change it</b></li>
                          <li>can be <b>copied</b> as much as you like</li>
                          <li>n bits = <b>one</b> number out of 2ⁿ</li>
                        </ul>`,
               },
               quantistico: {
                 titolo: 'The qubit',
                 html: `<ul class="mb0">
                          <li>holds <b>two numbers</b> (the amplitudes), which may be negative</li>
                          <li>looking at it <b>rewrites</b> it: measurement collapses the state</li>
                          <li><b>cannot</b> be copied (level 6)</li>
                          <li>n qubits = <b>2ⁿ amplitudes together</b>, but you read n digits</li>
                        </ul>`,
               },
               verdetto: `<b>The line that matters is the first one:</b> an amplitude can be <b>negative</b>, a
                          probability cannot. And it is only because they can be negative that two possibilities
                          manage to <b>cancel out</b>. Without that cancellation a qubit would be an expensive
                          loaded coin.`,
             }),
    },
    {
      t: 'A bit that can be a bit of both',
      html: `<p>An ordinary <b>bit</b> is a box holding <b>0 or 1</b>. Full stop. It is like a light bulb:
             on or off.</p>
             <p>A <b>qubit</b> is a different box: until you look at it, it holds <b>two numbers</b>,
             one for each possible outcome. They are called <b>amplitudes</b>:</p>
             <pre><code>classical bit:   0        or        1

qubit:      [ amplitude of 0 , amplitude of 1 ]
             e.g.  [   0.6    ,     0.8      ]</code></pre>
             <p>When you <b>measure</b> it, the qubit gives you back 0 or 1 (never "0.6"): the number that comes out is random,
             and the probability is obtained by <b>squaring</b> the amplitude — exactly the square from level 0·1.</p>
             <div class="formula">probability of reading 0 = (0.6)² = <span class="hl-n">36%</span>
             &nbsp;&nbsp;&nbsp;&nbsp; probability of reading 1 = (0.8)² = <span class="hl-k">64%</span>
             &nbsp;&nbsp;&nbsp;→&nbsp; total <b>100%</b> ✓</div>
             <div class="callout key"><b>The thing that changes everything:</b> an amplitude can be <b>negative</b>.
             A probability cannot — there is no such thing as "−30% probability" — but an amplitude can.
             And two equal and opposite amplitudes, when they meet, <b>cancel out</b>:
             <code>+0.7 and −0.7 make 0</code>. That is the only difference between a qubit and a coin,
             and all of quantum computing grows out of it.</div>
             <p class="dim small">Further on (level 8) we will discover that an amplitude, in general, is not just
             "positive or negative": it is an <b>arrow</b> that can point in any direction. But for the first seven levels
             a + or − sign is more than enough.</p>`,
    },
    {
      t: 'The physical qubit: a photon and a pair of sunglasses',
      html: `<p>Before the maths, a real object. The easiest qubit to picture is the <b>polarisation
             of a photon</b>: the direction along which its electric field oscillates.</p>
             <ul>
               <li>photon polarised <b>vertically</b> → we call it <b>|0⟩</b></li>
               <li>photon polarised <b>horizontally</b> → we call it <b>|1⟩</b></li>
               <li>photon polarised <b>at 45°</b> → it is a <b>superposition</b> of the two</li>
             </ul>
             <p>A polaroid filter (the sunglasses kind) only lets through light polarised along a certain
             direction. If the photon is "slanted" with respect to the filter, it gets through <b>with a certain probability</b>:</p>
             <div class="formula">probability of passing = cos²(angle between photon and filter) &nbsp;&nbsp;<span class="muted">(Malus's law)</span></div>
             <p>Do you recognise the cosine from level 0·3 and the square from level 0·1? That is where the rule
             "probability = amplitude²" comes from, physically: the amplitude is the <b>cosine of the angle</b>, the probability is its square.</p>
             <p><b>Now the experiment that drives everyone mad.</b> Put two crossed filters (0° and 90°): nothing gets through,
             total darkness. Then <b>slip a third filter at 45° in between the two</b>. Common sense says even less
             light should get through. Instead the light <b>comes back</b>. Try it:</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'polaroid', title: 'The three-filter paradox', text: 'put two crossed filters (0° and 90°), then add the middle one at 45° and get the light through again.', xp: 40 });
        el.appendChild(m.root);
        polaroidLab(el, { onDiscover: () => m.complete() });
      },
      after: `<div class="callout key"><b>What it teaches us:</b> a filter does not <i>select</i> the photons that were already right.
              The filter <b>measures</b>, and the measurement <b>rewrites</b> the state: after the 45° filter, the photon <b>is</b> at 45°,
              and from there it again has a 50% chance of getting through at 90°. Measurement in quantum physics is not
              "looking without touching": it is an operation that changes the system.</div>`,
    },
    {
      t: 'Why probability comes from squaring',
      html: `<p>Before writing any formula, let us watch the thing happen. The number that
             describes an outcome — how much that outcome "weighs" — is here the <b>side of a square</b>.
             The probability of getting it is the <b>area</b>.</p>
             <p>Move the side and watch the area: it grows much faster. Halve the side and the area
             becomes a quarter, not a half. There is nothing to memorise here, only something to watch.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'quadrato', title: 'The square of probability', text: 'hit three different areas by moving the side.', xp: 25 });
        el.appendChild(m.root);
        probabilitaQuadrato(el, { need: 3, onWin: () => m.complete() });
      },
    },
    {
      t: 'How you write a state: Dirac notation',
      html: `<p>Physicists write states between two funny symbols: <b>|</b> and <b>⟩</b>. It is called a <i>ket</i> and it is
             just a box that says "this is a state". <code>|0⟩</code> reads "ket zero".</p>
             <p>A general qubit state is written like this:</p>`,
      mount: el => {
        formula(el, {
          title: 'The state of a qubit — touch each piece',
          parts: [
            { t: '|ψ⟩', id: 'psi', color: 'cyan', name: 'the qubit state', say: 'ψ (psi) is just the name we give the state, like calling an unknown "x". The bars |…⟩ say "there is a quantum state in here".' },
            { t: '=' },
            { t: 'a', id: 'a', color: 'green', name: 'amplitude of outcome 0', say: 'A number: for now positive or negative (at level 8 it will become an arrow that can point anywhere). Its SQUARE is the probability of measuring 0.', ex: 'a = 0.707 → probability of 0 = 0.707² = 0.5 = 50%.' },
            { t: '|0⟩', id: 'k0', color: 'green', name: 'the outcome "zero"', say: 'The label of the first possibility. For the photon: vertical polarisation.' },
            { t: '+' },
            { t: 'b', id: 'b', color: 'amber', name: 'amplitude of outcome 1', say: 'The amplitude of the other outcome. It can be negative: −0.707 gives the same probability as +0.707, but it is a DIFFERENT state.', ex: 'a = 0.707 and b = −0.707 → 50% and 50%, exactly as with b = +0.707… but the two behave in opposite ways once you apply an H gate.' },
            { t: '|1⟩', id: 'k1', color: 'amber', name: 'the outcome "one"', say: 'The second possibility. For the photon: horizontal polarisation.' },
            { t: '  with  ' },
            { t: '|a|² + |b|² = 1', id: 'norm', color: 'violet', name: 'the normalisation rule', say: 'The probabilities have to add up to 1 (level 0·4!). This constrains the lengths of the two arrows: if one grows, the other shrinks.', ex: 'a = 0.6 and b = 0.8 → 0.36 + 0.64 = 1 ✓' },
          ],
        });
      },
      after: `<div class="callout"><b>The Born rule</b> (the link between maths and reality):
              the probability of getting a certain outcome is the <b>square of the length</b> of its arrow.
              <code>P(0) = |a|²</code>, <code>P(1) = |b|²</code>. Nothing else is needed to predict any quantum experiment.</div>`,
    },
    {
      t: 'Build your own qubit (and find the invisible knob)',
      html: `<p>In the game: <b>θ</b> decides how much |1⟩ there is (that is, the "split" of the probabilities),
             <b>φ</b> is the <b>phase</b> of the second arrow.</p>
             <p><b>Compulsory experiment:</b> hold θ still and move <b>only φ</b>. Look at the histogram of the measurements:
             <b>nothing changes</b>. The probabilities are identical. And yet the state is different — and the right-hand arrow turns.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'meta', title: 'Fifty-fifty', text: 'bring the qubit to exactly 50% and 50% (hint: θ = 90°) and measure it 100 times.', xp: 35 });
        el.appendChild(m.root);
        qubitBuilder(el);
        let done = false;
        el.addEventListener('click', () => {
          if (done) return;
          const t = el.querySelector('input[type=range]');
          if (t && Math.abs(parseFloat(t.value) - 90) < 3) { done = true; m.complete(); }
        });
      },
      after: `<div class="callout warn"><b>The phase is invisible to a single measurement.</b> That is why so many people convince
              themselves that a qubit is "just a loaded coin": if you only look at the percentages, that is exactly how it looks.
              The next step takes that idea apart for good.</div>`,
    },
    {
      t: 'The acid test: coin versus qubit',
      html: `<p>Let us run the decisive experiment. On one side a <b>coin</b> shuffled twice.
             On the other a <b>qubit</b> to which we apply the <b>H</b> (Hadamard) gate twice — the operation
             that "shuffles" a qubit into a 50/50 superposition.</p>
             <p>If the qubit were a coin, after two shuffles it should stay random. Watch what happens:</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'hh', title: 'The plot twist', text: 'run the experiment and watch the qubit come back to 0 every time.', xp: 45 });
        el.appendChild(m.root);
        coinVsQubit(el, { onDiscover: () => m.complete() });
      },
      after: `<p>Why? Because H does not produce "0 or 1 at 50%": it produces <b>two arrows</b>. And the second H makes them
              <b>meet</b>. On the outcome |1⟩ two equal and <b>opposite</b> contributions arrive (one with +, one with −)
              and they <b>cancel</b>: <b>destructive interference</b>. We will study it properly at level 7, but you have just seen it work.</p>`,
    },
    {
      t: 'The four lines of the H gate (learn them, they keep coming back)',
      html: `<p>Hadamard does exactly this, and there is nothing else to know:</p>
             <div class="formula">
               H|0⟩ = (|0⟩ + |1⟩)/√2 &nbsp;&nbsp;&nbsp;&nbsp; H|1⟩ = (|0⟩ <span class="hl-x">−</span> |1⟩)/√2
             </div>
             <p>The only difference between the two lines is that <b>minus</b>. And you have known what a minus is since level 0·1:
             <b>«the other way round»</b>. All of quantum interference comes out of that single sign.</p>`,
      mount: el => {
        hadamardMap(el);
        stepper(el, [
          { h: 'Let us work out H·H|0⟩', html: 'Start from |0⟩. First H: we get <code>(|0⟩ + |1⟩)/√2</code>.' },
          { h: 'Second H, piece by piece', html: 'Apply H to each piece:<br><code>H|0⟩ = (|0⟩ + |1⟩)/√2</code><br><code>H|1⟩ = (|0⟩ − |1⟩)/√2</code>' },
          { h: 'Add them up', html: '<code>(1/√2)[(|0⟩+|1⟩)/√2 + (|0⟩−|1⟩)/√2]</code> = <code>(1/2)[|0⟩ + |1⟩ + |0⟩ − |1⟩]</code>' },
          { h: 'Look at the |1⟩ terms', html: '<code>+|1⟩</code> and <code>−|1⟩</code>: they <b>cancel</b>. Two |0⟩ over 2 are left, that is <code>|0⟩</code>.' },
          { h: 'Result', html: '<b>H·H|0⟩ = |0⟩</b> with probability 100%. No coin behaves like this. A qubit does, because its "probabilities" carry a <b>sign</b>.' },
        ], { doneLabel: 'I get the minus!' });
      },
    },
    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> In the builder, find two different values of φ that give <b>exactly</b> the same probabilities.
           How many are there? <span class="muted">(infinitely many: the phase does not show in a single measurement)</span></p>
        <p><b>2.</b> In the polaroid game, with filters at 0° and 90° and one at 30° in between: does more or less light get through than with 45°?
           Try predicting it before you move the slider.</p>
        <p><b>3.</b> If |a| = 0.6, what is |b|? <span class="muted">(0.8: because 0.36 + 0.64 = 1)</span></p>
        <p class="mb0"><b>4.</b> The question that opens the rest of the course: if the phase does not show up when you measure,
           <b>what is it for</b>? <i>(Short answer: to decide what will cancel. Long answer: levels 14 to 19.)</i></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'If the amplitude of |1⟩ is 0.6, what is the probability of measuring 1?',
      options: ['60%', '36%', '80%', '6%'], correct: 1,
      why: 'Born rule: probability = |amplitude|² = 0.6² = 0.36 = <b>36%</b>. It is the single most common mistake of all: the amplitude is NOT the probability.' },
    { q: 'Two states with the same probabilities but a different phase are…',
      options: ['identical', 'different, and the difference shows up when you apply further gates', 'impossible', 'always entangled'], correct: 1,
      why: 'A single measurement cannot tell them apart, but a later gate (H, for instance) sends them to different outcomes: the phase decides what will cancel.' },
    { q: 'Why do two Hadamards in a row bring the qubit back to |0⟩?',
      options: ['because H is random', 'because the contributions to |1⟩ arrive with opposite signs and cancel', 'because H measures the qubit', 'because |1⟩ is unstable'], correct: 1,
      why: 'Destructive interference: +|1⟩ and −|1⟩ annihilate, while the two contributions to |0⟩ add up. With a coin this could never happen.' },
    { q: 'In the three-polaroid experiment, adding a 45° filter between two crossed ones…',
      options: ['blocks even more light', 'lets the light through again, because measurement rewrites the state', 'changes nothing', 'only works with a laser'], correct: 1,
      why: 'The filter does not select: it measures. After the 45° filter the photon <b>is</b> at 45°, so it again has a 50% chance of crossing the 90° filter.' },
  ],

  outro: `<div class="callout ok"><b>What you take home:</b> a qubit = two arrows (complex amplitudes);
          probability = length²; the phase does not show in one measurement but it decides future interference;
          measurement <b>changes</b> the state. Next level: a way to see all of this at a glance,
          the <b>Bloch sphere</b>.</div>`,
});
@endsection
