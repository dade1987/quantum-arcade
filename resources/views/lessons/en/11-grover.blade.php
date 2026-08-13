@php($description = 'Unstructured search in √N attempts: the phase oracle, the diffuser that reflects about the mean, the optimal number of iterations and why overshooting hurts.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { groverLab } from '/js/widgets/algos.js';

const L = renderLesson({
  id: '11-grover',
  lead: `The most general problem there is: <b>finding a needle in a haystack</b> with no clue at all.
         Classically you have to look through half the haystack. Grover (1996) manages it by looking at its <b>square root</b>.
         And the nice part is that you can watch it happen, bar by bar.`,

  steps: [
    {
      t: 'The problem and the classical limit',
      html: `<p>You have N possibilities. Only one is the right one, and the only way to recognise it is to try it
             (the oracle says only <b>yes/no</b>, it gives no hints).</p>
             <ul>
               <li><b>Classical:</b> on average you try N/2 times, in the worst case N. There is nothing better: with no structure,
                   there is nothing to exploit.</li>
               <li><b>Grover:</b> about <b>√N</b> attempts. With N = 1,000,000 → a thousand attempts instead of half a million.</li>
             </ul>
             <div class="callout"><b>It is not a miracle, it is a "quadratic" gain.</b> It does not turn an impossible problem
             into an easy one (that is Shor's job, in very particular cases). But it works for <b>any</b> unstructured search,
             and it is proven that <b>you cannot do better than this</b> even quantumly (the Bennett–Bernstein–Brassard–Vazirani bound).</div>`,
    },
    {
      t: 'The two moves that repeat',
      html: `<p>Grover starts from all possibilities equal (one H per qubit) and then repeats two moves:</p>
             <table class="table">
               <tr><th>Move</th><th>What it does</th><th>How you see it</th></tr>
               <tr><td><b>1. Oracle</b></td><td>puts a minus sign <b>only</b> on the right amplitude</td><td>one bar changes colour (phase), not height</td></tr>
               <tr><td><b>2. Diffuser</b></td><td>reflects every amplitude <b>about their mean</b></td><td>the bar "below the mean" shoots up, the others drop a little</td></tr>
             </table>
             <p>The diffuser is the clever part. Here is why it works, in one line:</p>
             <div class="callout key">After the oracle, the right amplitude is <b>negative</b> and all the others positive.
             The <b>mean</b> therefore stays slightly positive. "Reflecting about the mean" means:
             <code>new = 2·mean − old</code>. For the negative amplitude that is a <b>huge jump upwards</b>;
             for the others, a small step back.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'grover', title: 'Find the needle', text: 'take the probability of the marked element above 90%.', xp: 60 });
        el.appendChild(m.root);
        groverLab(el, { n: 4, onWin: () => m.complete() });
      },
    },
    {
      t: 'The sum step by step (N = 4, so you can do it by hand)',
      html: `<p>With 2 qubits there are 4 possibilities. Say the right one is |11⟩.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Start', html: 'After the Hadamards every amplitude is <b>0.5</b> (because 0.5² = 0.25 = 1/4).<br><code>[0.5 · 0.5 · 0.5 · 0.5]</code> — probability 25% each.' },
          { h: 'Oracle', html: 'Minus sign on the right one:<br><code>[0.5 · 0.5 · 0.5 · −0.5]</code><br>The probabilities are still all 25%: so far <b>we have learned nothing measurable</b>.' },
          { h: 'Mean', html: 'mean = (0.5 + 0.5 + 0.5 − 0.5)/4 = <b>0.25</b>' },
          { h: 'Reflection: new = 2·mean − old', html: 'For the three wrong ones: 2(0.25) − 0.5 = <b>0</b><br>For the right one: 2(0.25) − (−0.5) = <b>1</b><br>Result: <code>[0 · 0 · 0 · 1]</code>' },
          { h: 'Result with N = 4', html: 'Probability of the right result: 1² = <b>100%</b>. One single iteration, certain answer!<br>(That is a lucky case: for N = 4 the optimal number of iterations is exactly 1.)' },
          { h: 'And in general?', html: 'Every iteration rotates the state by a fixed angle towards the answer. The optimum is<br><b>(π/4)·√N</b> iterations.<br>With N = 16 → 3 iterations; with N = 1,000,000 → about 785.' },
          { h: 'The trap', html: 'If you keep going <b>past</b> the optimum, the rotation continues and <b>overshoots</b> the target: the probability <b>drops again</b>. In the game press "+3 iterations" after reaching the maximum and watch the curve come down. That is why with Grover you have to know <b>when to stop</b>.' },
        ], { doneLabel: 'Sum done!' });
      },
    },
    {
      t: 'What it is really for',
      html: `<p>Grover is generic, so it applies wherever there is a "brute force" search:</p>
             <ul>
               <li><b>Cybersecurity:</b> a 128-bit symmetric key would take 2¹²⁸ classical attempts
                   and "only" 2⁶⁴ with Grover. That is why the post-quantum recommendation is simple:
                   <b>double the key length</b> (AES-256 instead of AES-128) and the problem is solved.
                   Very different from the RSA case, which Shor demolishes (level 20).</li>
               <li><b>Optimisation and search in unindexed databases</b>, with the practical caveat that loading the data
                   into the quantum computer can cost more than the gain.</li>
               <li>As a <b>subroutine</b> inside larger algorithms (quantum counting, minimum finding…).</li>
             </ul>
             <div class="callout warn"><b>The awkward question:</b> if the oracle has to "recognise" the right answer,
             do we not already know it? No: recognising a solution is easy, <b>finding</b> it is hard.
             It is the same difference as between solving a sudoku and checking that a solved sudoku is correct —
             and half of theoretical computer science rests on that difference.</div>`,
    },
    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> With N = 16, how many iterations does it take? Check that the curve peaks where the formula says.</p>
        <p><b>2.</b> What happens if you apply the oracle <b>without</b> the diffuser, ten times in a row? Why?</p>
        <p><b>3.</b> And if there were <b>two</b> right elements instead of one? Does the optimal number of iterations change?
           <span class="muted">(yes: it becomes (π/4)·√(N/2))</span></p>
        <p class="mb0"><b>4.</b> As an inventor: the diffuser reflects about the mean. Can you imagine
           a different operation that amplifies <b>two</b> different answers unequally?
           <i>(That is the research branch of generalised "amplitude amplification".)</i></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'How many iterations does Grover need on N elements?',
      options: ['about N', 'about √N', 'about log N', 'always 1'], correct: 1,
      why: 'About (π/4)·√N. With a million elements: about 785 iterations instead of 500,000 attempts.' },
    { q: 'What does the diffuser do?',
      options: ['it measures the state', 'it reflects the amplitudes about their mean', 'it copies the right qubit', 'it adds a qubit'], correct: 1,
      why: 'new = 2·mean − old. The amplitude made negative by the oracle becomes very large; the others drop slightly.' },
    { q: 'What happens if you do too many iterations?',
      options: ['the probability keeps rising', 'the probability drops again', 'the circuit jams', 'entanglement is lost'], correct: 1,
      why: 'It is a rotation: past the target you start coming back. You have to stop at the optimal number.' },
    { q: 'Which countermeasure is enough against Grover in symmetric cryptography?',
      options: ['changing algorithm', 'doubling the key length', 'nothing, it is irreparable', 'using RSA'], correct: 1,
      why: 'Grover halves the exponent: AES-256 offers against a quantum attacker the same security AES-128 offers against a classical one.' },
  ],

  outro: `<div class="callout ok"><b>What you take home:</b> when there is no structure to exploit,
          the best you can do is amplify: √N attempts instead of N. It is a real gain but a
          <b>quadratic</b> one — and it is not enough for the big prize.
          Next level: what if there were a structure, but one <b>hidden in a repetition</b>?
          There the gain becomes exponential.</div>`,
});
@endsection
