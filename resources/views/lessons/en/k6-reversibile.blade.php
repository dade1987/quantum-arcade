@php($description = 'Why the AND gate throws information away, why erasing a bit releases heat (Landauer\'s principle), what the Toffoli gate is and why every quantum gate is reversible.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { confronto } from '/js/core/confronto.js';
import { reversibleLab } from '/js/widgets/classic2.js';

const L = renderLesson({
  id: 'k6-reversibile',
  lead: `This is the hinge level. So far we have seen a computer that <b>throws information away</b> at every
         step — so normal that nobody notices. Now let us look at what throwing it away costs, and what happens
         to a computer that is <b>forbidden</b> to do it. Because that machine, without knowing it, is already
         half a quantum computer.`,

  steps: [
    {
      t: 'The AND gate does not know where it came from',
      html: `<p>Read the AND table backwards. I tell you the output is <b>0</b>: what were the inputs?</p>
             <div class="formula">AND(0,0) = 0 &nbsp;&nbsp; AND(0,1) = 0 &nbsp;&nbsp; AND(1,0) = 0 &nbsp;&nbsp;
             AND(1,1) = <span class="hl-k">1</span></div>
             <p>There is no way to know: three different inputs give the same output. That information is not
             "hidden", it is <b>lost</b>: two bits went in, one came out, and the other one no longer exists
             anywhere.</p>
             <div class="callout key"><b>A gate is called reversible</b> when the output always lets you work out
             the input. You already know one: <b>NOT</b>. And <b>XOR</b> too, if you keep one of the two inputs:
             from (A, A XOR B) you can recover B. All the others — AND, OR, NAND — throw things away.</div>`,
    },
    {
      t: 'Erasing a bit releases heat. Really — it has been measured',
      html: `<p>In 1961 Rolf Landauer, at IBM, proved something that sounds like philosophy and is in fact
             thermodynamics: <b>erasing one bit of information releases heat</b>. At least</p>
             <div class="formula">E = k<sub>B</sub> · T · ln 2 &nbsp;&nbsp;≈&nbsp;&nbsp; 3 · 10⁻²¹ joules
             &nbsp;<span class="muted">(at room temperature)</span></div>
             <p>The argument in one line: before erasing, the bit could be in 2 states; afterwards, in 1. The
             possible states have halved, so the entropy of the information has gone down — and since total
             entropy cannot go down, that difference has to come out somewhere. It comes out as heat, into the
             environment.</p>
             <p>This is not a figure of speech: in 2012 the group of Bérut and Lutz <b>measured</b> it in the lab,
             with a single particle in an optical trap, finding exactly that value.</p>
             <div class="callout"><b>How much is it in practice?</b> Very little: a today's processor wastes about
             a million times more energy than that minimum, for entirely different engineering reasons.
             Landauer's limit is not what makes your laptop hot. But it is a <b>limit of principle</b>, and its
             theoretical consequence is enormous: a computation that erases nothing could, in principle,
             <b>cost no energy at all</b>.</div>`,
    },
    {
      t: 'Toffoli: the AND that throws nothing away',
      html: `<p>Charles Bennett (1973) asked the next question: can everything be computed without ever erasing?
             The answer is yes, at the price of keeping a few extra bits. The gate that does it is the
             <b>Toffoli gate</b>, or CCNOT: three bits in, three bits out.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'The rule', html: 'Toffoli looks at the first two bits (<b>a</b> and <b>b</b>): it leaves them alone. The third one (<b>c</b>) it flips <b>only if a and b are both 1</b>.<br><code>(a, b, c) → (a, b, c XOR (a AND b))</code>' },
          { h: 'Where the AND is', html: 'Set <b>c = 0</b> at the start. On the way out the third bit becomes <code>0 XOR (a AND b)</code>, that is, <b>exactly a AND b</b>.<br>You have computed the AND — and kept a and b as well.' },
          { h: 'Why it is reversible', html: 'Apply Toffoli <b>twice</b>: the second one flips the same bit back, and you are where you started. Toffoli is its own inverse.<br>From (a, b, c\') you can always get back to (a, b, c).' },
          { h: 'The price', html: 'Extra bits — they are called <b>ancillas</b>, "servants". The computation throws nothing away, but the rubbish piles up somewhere instead of disappearing.' },
          { h: 'Bennett\'s trick', html: 'The rubbish is cleaned up without erasing it: copy the result onto a fresh bit, then <b>run the whole computation backwards</b>. The ancillas return to zero by themselves and only the result is left. It is called <i>uncomputation</i>, and real quantum algorithms use it constantly.' },
          { h: 'Universal too', html: 'With Toffoli gates alone (plus some constant bits) any circuit can be built: it is <b>universal</b> for reversible classical computing, the way NAND was for ordinary computing.' },
        ], { doneLabel: 'Got Toffoli!' });
      },
      after: `<p>In the step below there are five reversible gates — the same ones you will meet at levels 3 and 4
              in quantum form. The computer applies three of them at random, and you have to put the bits back
              the way they were. There is nothing to guess: just walk the road backwards.</p>`,
    },
    {
      t: 'Try it: go back',
      html: `<p>Every gate here is its own inverse, so "undo" simply means <b>reapply</b> the same gates in reverse
             order. If you get lost, the button tells you which ones were used.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'reverse', title: 'Reverse gear', text: 'bring the bits back to the starting point twice.', xp: 45 });
        el.appendChild(m.root);
        reversibleLab(el, { onWin: () => m.complete() });
      },
      after: confronto({
        titolo: 'Classical, reversible and quantum computers',
        livello: '03-porte',
        vaiA: 'Go to the quantum gates (level 3)',
        classico: {
          titolo: 'Classical computer',
          html: `<p>Gates <b>may</b> throw information away, and nearly all of them do. Every erased bit costs at
                 least kT·ln2 of heat.</p>
                 <p class="mb0">Reversible <b>is possible</b> (Toffoli, Fredkin), but nobody bothers: the real
                 consumption is elsewhere.</p>`,
        },
        quantistico: {
          titolo: 'Quantum computer',
          html: `<p>Gates <b>must</b> be reversible: no exceptions. It is not a design choice, it is how an isolated
                 quantum system evolves (the word is <b>unitary</b>).</p>
                 <p class="mb0">The only irreversible operation allowed is <b>measurement</b> — and that is exactly
                 why measurement destroys the superposition.</p>`,
        },
        numeri: [
          { cosa: 'AND of two bits', classico: '1 gate, 1 bit lost', quantistico: '1 Toffoli, 1 extra bit' },
          { cosa: 'can you go back?', classico: 'no', quantistico: 'always, except measurement' },
          { cosa: 'minimum heat per erased bit', classico: 'kT·ln2', quantistico: 'zero, until you measure' },
        ],
        verdetto: `<b>This is why you are already halfway there.</b> A quantum circuit is, first of all, a
                   <b>reversible</b> circuit: the gates you have just used — NOT, CNOT, Toffoli — are literally
                   the same ones you will find at levels 3 and 4. The only thing quantum adds is that the bits,
                   besides being 0 or 1, can be <b>two things at once with a sign</b>. That thing is called an
                   amplitude, and from there the real course begins.`,
      }),
    },
    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> Which of these are reversible: NOT, AND, XOR (keeping one input), OR, CNOT?</p>
        <p><b>2.</b> Toffoli with c = 1 at the start: what does it compute on the third bit? <span class="muted">(NAND: 1 XOR (a AND b))</span></p>
        <p><b>3.</b> If erasing one bit costs 3·10⁻²¹ J, what does erasing a gigabyte cost at minimum? <span class="muted">(about 2.4·10⁻¹¹ J: tiny, but not zero)</span></p>
        <p class="mb0"><b>4.</b> Inventor's question: why is quantum <b>measurement</b> the only irreversible operation allowed? What would happen if it were reversible too? <span class="muted">(this is one of the serious open questions in physics: look up "measurement problem")</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Why is the AND gate not reversible?',
      options: ['it is slow', 'because three different inputs give the same output 0', 'because it uses two bits', 'because it heats up too much'], correct: 1,
      why: 'From a 0 output you cannot get back: it could have been 00, 01 or 10. That information is lost.' },
    { q: 'Landauer\'s principle says that…',
      options: ['computers cannot exceed 5 GHz', 'erasing one bit releases at least kT·ln2 of heat', 'information cannot be copied', 'every gate consumes one joule'], correct: 1,
      why: 'It was measured in the lab in 2012. Computing without erasing could, in principle, cost zero.' },
    { q: 'The Toffoli gate, applied twice in a row, …',
      options: ['zeroes every bit', 'brings the bits back to the starting point', 'doubles the result', 'is undefined'], correct: 1,
      why: 'It is its own inverse: the second XOR undoes the first. Which is why it can undo a computation.' },
    { q: 'Why is every quantum gate reversible?',
      options: ['to save energy', 'because the evolution of an isolated quantum system is unitary, and physics allows nothing else', 'a convention among physicists', 'to make circuits shorter'], correct: 1,
      why: 'It is a physical constraint, not a choice. The only exception allowed is measurement — and that is exactly what destroys superposition.' },
  ],

  outro: `<div class="callout ok"><b>End of Part K.</b> You now have the full yardstick: you know what a bit is,
          what gates do, how addition works, what searching costs, how the cost of an algorithm is measured and
          why a circuit can be forced to forget nothing. From here on exactly one thing changes — and it changes
          everything: the boxes stop holding 0 <i>or</i> 1 and start holding <b>two signed numbers</b>.
          Have fun at level 1.</div>`,
});
@endsection
