@php($description = 'Eigenvectors and eigenvalues learned by playing: the arrows a transformation does not turn, and why on those arrows a quantum gate changes only the phase. The level that makes phase estimation readable.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { eigenHunt, phaseHunt } from '/js/widgets/autovettori.js';

const L = renderLesson({
  id: '18b-autovettori',
  lead: `The next level is called <b>phase estimation</b> and it starts like this: "given a state that the operation
         leaves unchanged apart from a phase, measure that phase". You can read that sentence twice and get nothing
         out of it — unless you know what that state is. It is called an <b>eigenvector</b>, you can find one with your
         hands in twenty minutes, and from then on phase estimation stops being magic and becomes an obvious recipe.`,

  steps: [
    {
      t: 'The arrows the machine does not turn',
      html: `<p>Pick up the matrix machine again: it takes an arrow, it gives back another one. Almost always the arrow
             that comes out <b>points somewhere else</b> than the one that went in.</p>
             <p>But not always. For certain directions — few, special ones — the arrow that comes out lies <b>on the same
             line</b> as the one that went in: maybe longer, maybe shorter, maybe flipped around, but <b>in line</b>.</p>
             <div class="callout key">Such an arrow is called an <b>eigenvector</b> of the machine. The number it gets
             multiplied by is called the <b>eigenvalue</b>. They are just two long names for something you can now see.</div>
             <p>In the game: drag the blue arrow and watch the orange one, which is its transform. When the two are in
             line the game says so — and tells you by how much the arrow was stretched.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'caccia', title: 'Hunting for still directions', text: 'find 3 directions that stay in line, on different machines.', xp: 45 });
        el.appendChild(m.root);
        eigenHunt(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Three things the game brings out, true for any machine:</p>
              <ul>
                <li>the <b>stretch</b> has two still directions (the axes), with eigenvalues 2 and 0.5;</li>
                <li>the <b>H gate</b> has two, with eigenvalues <b>+1 and −1</b>: it stretches nothing, it only flips;</li>
                <li>the <b>shear</b> has just one. That is not a bug in the game: some machines are simply like that.</li>
              </ul>
              <div class="callout warn"><b>And then there is the rotation</b>, which has <b>no</b> still direction at all:
              it turns everything, no exceptions. If that feels like a dead end, hold the thought: two steps from now it
              becomes the key to everything.</div>`,
    },

    {
      t: 'Why we care: gates are machines',
      html: `<p>A quantum gate is a unitary matrix, and unitary matrices have a handy property: <b>they neither stretch
             nor shrink anything</b>. So their eigenvalues cannot be 2 or 0.5 — they have to be numbers of length 1.</p>
             <p>With real numbers alone the only candidates would be <b>+1</b> and <b>−1</b>. And indeed the Z gate and the
             H gate have exactly those. But the rotation has just shown us that transformations with real eigenvalues are
             not enough.</p>
             <div class="callout key">You already know the way out from Part B: the numbers of length 1 are not two, they
             are <b>a whole circle</b> — they are the <b>phases</b> e^{iθ}. Here is where we land:
             <p class="mb0" style="margin-top:8px"><b>On an eigenvector, a quantum gate does not change the state: it
             multiplies it by a phase.</b></p></div>
             <p>Which is, word for word, the sentence the next level starts with — except that now you know what it means.</p>`,
    },

    {
      t: 'A phase is measured by counting',
      html: `<p>Take a gate U that, on its eigenvector, turns the phase by <b>90°</b> every time you apply it. Apply it
             four times: 90 + 90 + 90 + 90 = 360, a full turn. You are back home.</p>
             <p>The calculation also runs backwards, and that is the interesting part: <b>if I count how many applications
             it takes to get home, I have measured the phase</b>. Four applications → a quarter turn → 90°.</p>
             <div class="callout key">Notice one thing as you play: the <b>probabilities never change</b>. A phase on its
             own is invisible to a measurement. It only shows up when you make it <b>interfere</b> — which is precisely
             the Fourier transform's job.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'fase', title: 'Measure two phases by counting', text: 'bring the arrow home and say how many applications it takes, for 2 different gates.', xp: 55 });
        el.appendChild(m.root);
        phaseHunt(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>If that counting reminded you of something, you are right: it is the same game as the <b>rhythm that comes
              back</b> in the modular clock (level 0·5). There you counted steps to return to 1, here you count applications
              to get home. It is the same mathematics — and it is no accident that Shor uses both.</p>`,
    },

    {
      t: 'From counting to phase estimation',
      html: `<p>Counting by hand has one flaw: <b>it costs one application at a time</b>. With a small phase — a thousandth
             of a turn — you would need a thousand applications and a thousand measurements. A quantum computer does the
             same job another way:</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Step 1', html: 'The reading register is prepared in a <b>superposition</b> of all the numbers: 0, 1, 2, 3, … (H gates are enough, one per qubit).' },
          { h: 'Step 2', html: 'U is applied <b>once</b> controlled by the first qubit, <b>twice</b> by the second, <b>four</b> times by the third, and so on: doubling, a few qubits reach a great many applications.' },
          { h: 'Step 3', html: 'Thanks to <b>phase kickback</b>, the eigenvector\'s phase ends up written into the reading register: every number x comes back multiplied by the phase repeated x times. It is a <b>comb of phases</b> turning at a constant rhythm.' },
          { h: 'Step 4', html: 'A comb turning at a constant rhythm is exactly what the <b>Fourier transform</b> knows how to read: the inverse QFT turns it into a <b>peak</b> on a single number.' },
          { h: 'Step 5', html: 'You measure, and out comes that number: the phase, written in binary. The counting you did one application at a time, the machine does <b>all at once</b>.' },
          { h: 'And Shor?', html: 'Shor is this procedure applied to modular multiplication: the "phase" to be read is 1/r, and r is the period of the clock. That is why that level and this one are the same level, seen from two sides.' },
        ], { doneLabel: 'Got it!' });
      },
      after: `<div class="callout ok">With this in hand, the next level reads like a recipe: prepare the eigenvector, apply
              U doubling each time, read it off with the inverse Fourier transform. No magic, no step to take on trust.</div>`,
    },

    {
      t: 'Where it comes from',
      html: `<p>The word gives away its origin: <b>"eigen-"</b> is not Greek, it is the German <b><i>eigen</i></b>,
             meaning "own, characteristic". <i>Eigenwert</i> is "own value": the value belonging to that transformation
             and no other. The term spread through <b>David Hilbert</b>, around 1904, while he was working on integral
             equations — and English kept the German half untranslated, which is why "eigenvalue" explains nothing to
             anyone, while "the machine's own direction" would say it all.</p>
             <p>But the moment this mathematics turned into physics has a precise date: <b>1926</b>. Erwin Schrödinger
             published a series of papers titled <i>Quantisierung als Eigenwertproblem</i> — <b>"quantisation as an
             eigenvalue problem"</b>. The title is already the thesis: the energy levels of an atom, those discrete
             values nobody could explain, are the <b>eigenvalues</b> of an equation.</p>
             <div class="callout key">That is why energy is "quantised", stepped rather than continuous: not out of some
             whim of nature, but because <b>a transformation has only so many directions of its own</b>, and they are as
             many as they are. The very thing you just found by dragging an arrow until it stayed in line.</div>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game, try the <b>H gate</b>: its two still directions are not on the axes. Roughly what
           angle are they at? <span class="muted">(hint: halfway between the horizontal axis and the diagonal)</span></p>
        <p><b>2.</b> What does a <b>negative</b> eigenvalue mean, looking at the two arrows? And why can a quantum gate
           afford one without breaking the probabilities?</p>
        <p><b>3.</b> In the second game pick 72°: how many applications to get home? And if the gate turned by 1°? How many
           measurements would counting by hand take?</p>
        <p class="mb0"><b>4.</b> Inventor's question: if a gate leaves <b>every</b> arrow in line with itself, which matrix
           is it? <span class="muted">(and what use is it in a circuit?)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What is an eigenvector of a transformation?', options: ['the longest arrow', 'an arrow the transformation leaves in line with itself', 'the first column of the matrix', 'an arrow of length 1'], correct: 1,
      why: 'The transformation may stretch it, shrink it or flip it, but it does not change its direction: it stays on the same line. The multiplying factor is the eigenvalue.' },
    { q: 'Why do the eigenvalues of a quantum gate have magnitude 1?', options: ['by convention', 'because a gate is unitary and does not change lengths', 'because they are always whole numbers', 'because measurement normalises them'], correct: 1,
      why: 'If an eigenvalue were 2, that arrow would double and the probabilities would exceed 100%. With magnitude 1 the only possible effect is a rotation of the phase.' },
    { q: 'Applying a gate to its eigenvector, what changes?', options: ['the state becomes a different state', 'only the phase', 'the probability of reading 0', 'the number of qubits'], correct: 1,
      why: 'The state stays the same up to a phase factor: that is why the measured probabilities do not change at all, and why the Fourier transform is needed to bring that phase out.' },
    { q: 'If a gate U turns the phase by 72° each time, after how many applications are you back to the start?', options: ['3', '4', '5', '8'], correct: 2,
      why: '72 × 5 = 360, a full turn. Counting those applications amounts to measuring the phase: one fifth of a turn.' },
    { q: 'Why does the 90° rotation have no real eigenvectors?', options: ['because it is too fast', 'because it turns every arrow with no exceptions: its eigenvalues are complex phases', 'because its matrix is not square', 'because it is not unitary'], correct: 1,
      why: 'No real arrow stays in line. Its eigenvalues are ±i: numbers of length 1 but complex. That is exactly why quantum mechanics lives on complex numbers.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> Eigenvector = the arrow the machine does not turn. Eigenvalue = how much it
          multiplies it by. On a quantum gate that eigenvalue is a <b>phase</b>, and counting how many applications bring
          you home is already a measurement of it. The next level does it in one shot.</div>`,
});
@endsection
