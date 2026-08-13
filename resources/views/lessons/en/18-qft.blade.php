@php($description = 'The quantum Fourier transform (QFT) explained step by step: from the circuit with Hadamards and controlled phase rotations to the comparison with the classical DFT, with a verified simulator.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { qftLab, qftPeriodLab } from '/js/widgets/qft.js';

const L = renderLesson({
  id: '18-qft',
  lead: `Here we are. We take the DFT of level 16 and apply it <b>not</b> to recorded data,
         but to the <b>amplitudes of a quantum state</b>. The result is the QFT: same mathematics, different hardware,
         enormous consequences.`,

  steps: [
    {
      t: 'Same formula, different numbers',
      html: `<p>Let us put the two things side by side. Note that <b>only the first column changes</b>:</p>
             <table class="table">
               <tr><th>Classical Fourier (DFT)</th><th>Quantum Fourier (QFT)</th></tr>
               <tr><td>works on N numbers stored in memory</td><td>works on the 2^n <b>amplitudes</b> of n qubits</td></tr>
               <tr><td><code>X(k) = Σ x(n)·e^{−2πikn/N}</code></td><td><code>|k⟩ ← Σ amplitude(n)·e^{+2πikn/N}/√N</code></td></tr>
               <tr><td>costs N² (or N·log N with the FFT)</td><td>costs about <b>n²/2 gates</b></td></tr>
               <tr><td>you read <b>all</b> N results</td><td>you read <b>a single</b> result, at random, by measuring</td></tr>
               <tr><td>it is for analysing signals</td><td>it is for making things <b>interfere</b> and revealing <b>periodicities</b></td></tr>
             </table>
             <div class="callout key"><b>The sentence to keep:</b> the QFT takes the information that sits in the
             <b>position</b> of the amplitudes and moves it into their <b>phase</b> — and vice versa.
             It does not "compute Fourier faster": it <b>reorganises</b> the state so that, afterwards, a measurement
             reveals something that was previously invisible.</div>`,
    },
    {
      t: 'The example with 2 qubits, all written out',
      html: `<p>Let us take the state <b>|01⟩</b>, that is amplitudes <code>[0, 1, 0, 0]</code>. The QFT turns it into
             something proportional to:</p>
             <div class="formula">½ · [ <span class="hl-n">1</span> , <span class="hl-k">i</span> , <span class="hl-N">−1</span> , <span class="hl-x">−i</span> ]
             &nbsp;&nbsp;→&nbsp;&nbsp; four arrows at <b>0°, 90°, 180°, 270°</b>: → ↑ ← ↓</div>
             <p>Look at what has happened:</p>
             <ul>
               <li><b>Before:</b> one single tall bar. The information was <b>in the position</b> ("I am in state 01").</li>
               <li><b>After:</b> four <b>all equal</b> bars (25% probability each), but with <b>four different phases</b>.
                   The information has moved <b>into the phases</b>.</li>
             </ul>
             <p>If you measured now, you would get a random result out of four: it <b>looks</b> as if everything has been lost.
             It has not: those phases are exactly what is needed to make the wrong answers cancel out
             at the next step of the algorithm. <b>The QFT is never the last step of a useful algorithm.</b></p>
             <p class="dim small">(Depending on the sign convention chosen in the formula, you might find
             <code>[1, −i, −1, i]</code> written instead. Only the direction of rotation changes: the substance is identical.)</p>`,
    },
    {
      t: 'The circuit: three ingredients and no more',
      html: `<p>The QFT is built with gates you already know:</p>
             <ol>
               <li><b>Hadamard</b> on one qubit — it brings the two possibilities into play (level 3);</li>
               <li><b>Controlled phase rotations</b> <code>CP(π/2^k)</code> — they rotate the phase <i>only if</i> the other qubit is 1
                   (level 8 for the rotation, level 4 for the control);</li>
               <li>final <b>SWAPs</b> — because the circuit produces the qubits in reversed order.</li>
             </ol>
             <p>Move the "gates applied" slider and watch the bars transform one gate at a time.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'qft', title: 'Run the QFT', text: 'take the circuit all the way to the end and check that it matches the classical DFT.', xp: 70 });
        el.appendChild(m.root);
        qftLab(el, { n: 3, x: 1, onWin: () => m.complete() });
      },
      after: `<div class="callout"><b>Why exactly those rotations?</b> Because the phase that qubit j needs
              depends on <b>all</b> the less significant bits, each with a halved weight: the first contributes 180°,
              the second 90°, the third 45°… It is exactly the way a binary number "weighs" its digits.
              The controlled rotations are the quantum translation of that weighing.</div>`,
    },
    {
      t: 'The gate count (where the advantage lies)',
      html: ``,
      mount: el => {
        formula(el, {
          title: 'How many gates are needed for n qubits',
          hint: 'Touch the pieces to see where the count comes from.',
          parts: [
            { t: 'n', id: 'n', color: 'cyan', name: 'number of qubits', say: 'On every qubit goes one Hadamard: n gates in total.' },
            { t: '+' },
            { t: 'n(n−1)/2', id: 'rot', color: 'violet', name: 'controlled rotations', say: 'The first qubit gets n−1 of them, the second n−2, and so on: it is the sum 1+2+…+(n−1).', ex: 'n = 10 → 45 controlled rotations.' },
            { t: '+' },
            { t: 'n/2', id: 'sw', color: 'green', name: 'final SWAPs', say: 'They put the qubits back in the right order. They are often avoided altogether, simply by reading the qubits backwards.' },
            { t: '≈' },
            { t: 'n²/2', id: 'tot', color: 'amber', name: 'total', say: 'It grows like the SQUARE of the number of qubits, while the number of transformed amplitudes grows like 2^n. It is a ridiculously slow growth compared with what it handles.', ex: 'n = 20 qubits → 1,048,576 amplitudes transformed with about 210 gates.' },
          ],
        });
      },
      after: `<div class="callout warn"><b>And here is the trap, again (but now you are equipped to see it).</b>
              With 210 gates you touch a million amplitudes. But <b>you cannot read them</b>: the measurement returns just one,
              chosen at random. You have not "computed the FFT of a million numbers in 210 steps": you have <b>reorganised</b>
              a million amplitudes so that a certain <b>global property</b> becomes very probable.
              Which property? The next step shows it.</div>`,
    },
    {
      t: 'The thing the QFT exists for: periodicity → peaks',
      html: `<p>Let us prepare a "comb" state: amplitudes that are non-zero <b>every r positions</b>
             (exactly what Shor's algorithm will produce). Then we apply the QFT.</p>
             <p>The result is the reason this whole construction exists:</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'periodo', title: 'From comb to peaks', text: 'try at least two different periods and watch where the peaks end up.', xp: 60 });
        el.appendChild(m.root);
        qftPeriodLab(el, { n: 4, onWin: () => m.complete() });
      },
      after: `<div class="callout key"><b>The two golden properties:</b>
              <ol style="margin:8px 0 0">
                <li>period <b>r</b> in the starting state → peaks on the <b>multiples of N/r</b> after the QFT.
                    By measuring a peak and doing a little arithmetic, <b>you get r</b>.</li>
                <li>the <b>initial offset</b> of the comb (where it starts from) <b>does not move the peaks</b>.
                    That is an enormous stroke of luck: it means you can measure something random halfway through the algorithm
                    without ruining the useful information.</li>
              </ol></div>`,
    },
    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> Apply the QFT to the state |000⟩ (all zeros): what do you get? <span class="muted">(the uniform superposition: the QFT of a "constant" is a single peak, and vice versa)</span></p>
        <p><b>2.</b> And to the state |100⟩? Look at the drawing of the phases: how many times does it "turn" as you scroll through the bars?</p>
        <p><b>3.</b> In the comb game, try r = 3 with N = 16: the peaks no longer land on whole numbers.
           What happens to the bars? <span class="muted">(they broaden — that is why Shor needs continued fractions)</span></p>
        <p class="mb0"><b>4.</b> As an inventor: what other "global" property of a state would you like to turn into a peak?
           If you find a unitary transformation that does it, you have a new algorithm.</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What does the QFT do to the information contained in a state?',
      options: ['it deletes it', 'it moves it from the position of the amplitudes into their phases (and vice versa)', 'it copies it', 'it measures it'], correct: 1,
      why: 'From |01⟩ (a single bar) you go to four equal bars with four different phases: the information is all there, but written somewhere else.' },
    { q: 'Which gates make up the QFT circuit?',
      options: ['only CNOT', 'Hadamard, controlled phase rotations and SWAP', 'only measurements', 'X and Y'], correct: 1,
      why: 'One H per qubit, then phase rotations controlled by the less significant qubits, and finally the SWAPs to restore the order.' },
    { q: 'How many gates are needed for the QFT on n qubits?',
      options: ['2^n', 'about n²/2', 'n·log n', 'always 10'], correct: 1,
      why: 'n Hadamards + n(n−1)/2 rotations + the SWAPs: with 20 qubits about 210 gates are enough for a million amplitudes.' },
    { q: 'If a state has period r, after the QFT the peaks are found…',
      options: ['on the multiples of r', 'on the multiples of N/r', 'always at 0', 'at random'], correct: 1,
      why: 'Small period → widely spaced peaks, large period → closely spaced peaks. It is the inverse relationship between period and frequency of level 13.' },
    { q: 'Why is the QFT not useful for computing the spectrum of an audio file?',
      options: ['because it is imprecise', 'because measuring reads a single result, not the whole spectrum', 'because it is slow', 'because it only works on 2 qubits'], correct: 1,
      why: 'It transforms all the amplitudes with very few gates, but the measurement returns just one: it is for organising interference, not for producing readable lists of numbers.' },
  ],

  outro: `<div class="callout ok"><b>What you take home:</b> the QFT is the DFT applied to amplitudes;
          it costs n²/2 gates; it moves information between position and phase; it turns <b>periodicity</b> into <b>probability peaks</b>.
          Next level: using it backwards to read a hidden phase — the last piece before Shor.</div>`,
});
@endsection
