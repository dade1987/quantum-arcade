@php($description = 'The derivative explained as a slope and put to work: variational algorithms (VQE, QAOA), the quantum computing that actually runs today on noisy hardware. With the parameter-shift rule and the cost of shots.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { pendenzaLab, vqeLab } from '/js/widgets/variazionale.js';

const L = renderLesson({
  id: '21b-variazionale',
  lead: `There is something this course has not said yet: the algorithms you have learned — Grover, phase estimation,
         Shor — need large, clean machines, and those <b>do not exist today</b>. What runs right now, on real and noisy
         quantum processors, is a different family. They work like this: the quantum computer measures a number, an
         ordinary computer turns a knob to bring that number down, and you repeat. The tool for turning the knob the
         right way is called the <b>derivative</b>, and it is simpler than its reputation.`,

  steps: [
    {
      t: 'The slope: which way is down',
      html: `<p>Imagine standing on a hill at night, wanting to get down to the valley. You cannot see the landscape, but
             you can feel with your feet <b>how steep the ground is</b> where you stand. That is enough: take a step the
             way it goes down, and start again.</p>
             <p>That "how steep" has a precise name: it is the <b>slope</b> of the curve at the point you are on — the
             tilt of the straight line that touches the curve there.</p>
             <div class="callout key">Two facts, and that is all you need:
             <ul style="margin:8px 0 0">
               <li>the <b>sign</b> gives the direction: positive slope → down is to the left; negative → to the right;</li>
               <li>where the slope is <b>zero</b>, the ground is flat: you have arrived.</li>
             </ul></div>
             <p>In the game, move the point and watch the line tilt. Look for the bottom — but mind the trap.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'pendenza', title: 'Find two valley floors', text: 'bring the slope to zero at the bottom of two different valleys.', xp: 40 });
        el.appendChild(m.root);
        pendenzaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>You will have found the trap: on the "double valley" and on the wave there is a point where the slope is
              zero but you are <b>at the top</b>, not at the bottom. And there is a worse one: the double valley has
              <b>two</b> bottoms, and whoever walks down blindfolded ends up in the nearer one, not necessarily the
              lower one.</p>
              <div class="callout warn"><b>Keep it in mind:</b> "slope zero" only means "I have stopped here". That it is
              the lowest point of all is nobody's guarantee. It is problem number one for the algorithms you are about to
              see — and for all of machine learning too.</div>
              <p class="mb0">The technical name for the slope is the <b>derivative</b>. Now let us put it to work.</p>`,
    },

    {
      t: 'The quantum computing that runs today: VQE',
      html: `<p>Here is the scheme, and it is surprisingly simple:</p>
             <ol>
               <li>you build a quantum circuit with <b>knobs</b> (adjustable rotation angles);</li>
               <li>the quantum computer prepares the state and <b>measures</b> a number — usually the <b>energy</b> of a
                   molecule or the cost of a candidate solution;</li>
               <li>an ordinary computer looks at that number, works out which way is down and <b>turns the knobs</b>;</li>
               <li>repeat until the number stops going down.</li>
             </ol>
             <p>It is called <b>VQE</b> (Variational Quantum Eigensolver) when the number to lower is a molecule's energy,
             and <b>QAOA</b> when it is the cost of an optimisation problem. The structure is the same.</p>
             <div class="callout key">In the game you have one knob and one energy to bring down. Try by hand first, then
             let the algorithm walk down. And above all: <b>change the number of shots</b> and watch what happens to the
             measured slope.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'vqe', title: 'Touch the bottom twice', text: 'reach the minimum on 2 different problems.', xp: 60 });
        el.appendChild(m.root);
        vqeLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>With 50 shots the measured slope jumps about and the descent zigzags; with 5000 it is steady, but each
              step costs a hundred times as much. That is not a flaw in the game: <b>it is the problem</b>. The error on a
              measured average falls as 1/√(shots), so one more decimal digit costs a hundred times the measurements.</p>`,
    },

    {
      t: 'The part a classical computer cannot do',
      html: `<p>So far you could fairly object: if the ordinary computer does the walking down, what does the quantum one
             contribute? Two things, and the second is elegant.</p>
             <p>First: it <b>prepares and measures a state</b> an ordinary computer could not even write down — that is
             the whole point of superposition, with its exponentially many amplitudes.</p>
             <p>The second is about the slope itself. On an ordinary computer the derivative of a measured function is
             estimated roughly: you evaluate at two very close points and take the difference — and with noisy data that
             is a disaster, because the difference between two nearly equal numbers is nearly all noise. On quantum
             circuits there is a better road:</p>`,
      mount: el => {
        stepper(el, [
          { h: 'The question', html: 'I want the slope of the energy with respect to the knob θ, and the only thing I can do is <b>measure the energy</b> for a given θ.' },
          { h: 'The classical trick (and why it is not enough)', html: 'I measure at θ and at θ+0.001 and take the difference divided by 0.001. But the two measurements carry a noise far larger than the difference I am after: the result is almost pure noise.' },
          { h: 'The parameter-shift rule', html: 'On parametric circuits something special holds: the exact slope is<br><b>[ E(θ + a quarter turn) − E(θ − a quarter turn) ] / 2</b>.' },
          { h: 'Why it is better', html: 'It is not an approximation: it is <b>exact</b>. And the two points are <b>far apart</b>, so the difference is large compared with the noise. The game writes it out: the parameter-shift number matches the true slope, every time.' },
          { h: 'Where it comes from', html: 'From the fact that the energy, as a rotation knob turns, is always a combination of sine and cosine: such a function is pinned down by a few points, and its derivative follows exactly from two values 90° apart.' },
          { h: 'In practice', html: 'It is the recipe every quantum machine learning library uses today to train circuits: the <b>parameter-shift rule</b>, Mitarai and co-workers (2018), Schuld and co-workers (2019).' },
        ], { doneLabel: 'Got it!' });
      },
      after: `<div class="callout ok"><b>The honest picture, today:</b> no machine in the world runs Shor on real numbers,
              and variational methods on noisy hardware have not yet been shown to beat the best classical algorithms on
              the same molecules. But they are what you can <b>actually run now</b>, and they are the field where people
              are learning to live with noise. Worth knowing, and worth saying without overselling.</div>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> In the "double valley", start from the right and walk down. Then start from the left. Do you end up in
           the same bottom? What does that say about an algorithm that starts from a random point?</p>
        <p><b>2.</b> In the second game set <b>50 shots</b> and press "walk down as far as you can" several times: is the
           final point always the same? And with 5000?</p>
        <p><b>3.</b> Look at the two numbers underneath: the slope measured with the parameter-shift rule and the true one.
           How many shots does it take before they really agree?</p>
        <p class="mb0"><b>4.</b> Inventor's question: with one knob you can find the bottom by eye. With <b>a hundred</b>
           knobs (as in real VQEs) you can no longer look at the curve: you can only feel the slope underfoot. What
           problems do you think appear? <span class="muted">(hint: if the landscape goes flat almost everywhere, the slope
           no longer says which way to go — it is called a "barren plateau")</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What does the slope (derivative) of a curve at a point tell you?', options: ['how high the curve is', 'how much and in which direction the curve rises or falls there', 'where the minimum is', 'how often the curve crosses zero'], correct: 1,
      why: 'It is the tilt of the line touching the curve at that point: the sign gives the direction, the value gives the steepness. It tells you which way to move to go down.' },
    { q: 'Does a zero slope always mean "I am at the lowest point"?', options: ['yes, always', 'no: it can be a peak, or just some valley floor and not the lowest one', 'only if the curve is a parabola', 'only with more than one knob'], correct: 1,
      why: 'At a peak the slope is zero just as at a bottom. And there can be several bottoms: walking down from a random point lands you in the nearest one, not the best one.' },
    { q: 'In a variational algorithm, who does what?', options: ['the quantum computer does everything', 'the quantum one prepares and measures, the classical one turns the knobs', 'the classical computer does everything', 'they alternate at random'], correct: 1,
      why: 'It is a two-part loop: the quantum machine prepares the state and measures a number, the classical one uses the slope to update the parameters. Hence the name "hybrid".' },
    { q: 'What is the parameter-shift rule?', options: ['a way of reducing noise', 'a way of getting the EXACT slope by evaluating the energy with the knob shifted a quarter turn', 'an error-correction technique', 'a method for shortening circuits'], correct: 1,
      why: 'The difference between E(θ + 90°) and E(θ − 90°), divided by two, is exactly the derivative. Two evaluations far apart, so far more robust to noise than a tiny increment.' },
    { q: 'Why does the number of shots matter so much?', options: ['it drains the battery', 'because the error on a measured average falls as 1/√shots: one more digit costs a hundred times the measurements', 'it cools the chip', 'it changes the true result'], correct: 1,
      why: 'The measured average is statistical: with few shots it jumps about, and the descent jumps with it. It is the hidden cost that makes variational methods hard on today\'s hardware.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> The derivative is the slope, the slope says which way is down, and today's
          quantum computing uses it exactly like that: prepare, measure, turn the knob, repeat. With the parameter-shift
          rule making the slope exact rather than estimated, and the shot noise reminding you what every number costs.
          Now you can head to the workshop and invent your own algorithms knowing also <b>what actually runs</b>.</div>`,
});
@endsection
