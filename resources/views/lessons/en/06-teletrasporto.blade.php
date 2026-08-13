@php($description = 'Why an unknown quantum state cannot be copied, how quantum teleportation moves it anyway, and how dense coding fits two classical bits into one qubit.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { confronto } from '/js/core/confronto.js';
import { teleportLab } from '/js/widgets/quantum2.js';

const L = renderLesson({
  id: '06-teletrasporto',
  lead: `Three famous results, all consequences of what you already know: <b>you cannot copy a qubit</b>,
         <b>you can move it</b> (teleportation) and <b>you can post two bits inside a single qubit</b> (dense coding).
         No magic: just entanglement and measurement.`,

  steps: [
    {
      t: 'Classical first: copying is free, which is why you never think about it',
      html: `<p>Copy a file, forward a message, hit Ctrl-C: you have duplicated information without touching the
             original, at no cost and with no limit. It is so obvious that it does not even feel like a property
             — and yet it is <b>the</b> property half of computing rests on: backups, caches, the repetition code
             of level K·6, the very fact that you can read a bit without using it up.</p>
             <p>A bit can be copied because reading it <b>does not change it</b>: you look at the voltage on the
             wire, see that it is high, write it down somewhere else. Done.</p>
             <p>With a qubit that sequence — "look… see… write down" — is exactly what cannot be done. And it is
             not a technological limit waiting to be overcome: it is a <b>theorem</b>.</p>` +
             confronto({
               titolo: 'Copying a bit, copying a qubit',
               livello: 'k1-bit',
               vaiA: 'Review what a bit is (level K·1)',
               classico: {
                 titolo: 'A bit can be copied',
                 html: `<p>Reading does not alter. Copying is free, unlimited and perfect.</p>
                        <p class="mb0">Consequences: backups, redundancy, error correction by repetition, and the
                        fact that wiretapping a line <b>leaves no trace</b>.</p>`,
               },
               quantistico: {
                 titolo: 'A qubit cannot',
                 html: `<p><b>No-cloning theorem</b> (Wootters and Zurek, 1982): no operation exists that
                        duplicates an unknown quantum state.</p>
                        <p class="mb0">Consequences: no qubit backups, much harder error correction — but also
                        quantum cryptography, where <b>eavesdropping shows up</b> because it leaves a mark.</p>`,
               },
               numeri: [
                 { cosa: 'copies of an unknown state', classico: 'unlimited', quantistico: 'zero' },
                 { cosa: 'moving it elsewhere', classico: 'copy and delete', quantistico: 'teleportation: 2 classical bits + 1 entangled pair' },
                 { cosa: 'eavesdropping', classico: 'invisible', quantistico: 'detectable' },
               ],
               verdetto: `<b>The same prohibition creates the problem and the gift.</b> Not being able to copy
                          makes protecting qubits from errors hard (level 21), and at the same time makes possible
                          a communication line where spying cannot happen without being caught.`,
             }),
    },
    {
      t: 'The no-cloning theorem',
      html: `<p>A reasonable question: if a qubit is fragile, why not make a backup copy of it?</p>
             <p><b>You cannot.</b> And the proof is so simple it fits in five lines.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Assumption', html: 'Suppose there exists a quantum photocopier <b>C</b> that, given any state |ψ⟩ and a blank sheet |0⟩, produces two copies: <code>C(|ψ⟩|0⟩) = |ψ⟩|ψ⟩</code>.' },
          { h: 'Test 1', html: 'It works on |0⟩: <code>C(|0⟩|0⟩) = |0⟩|0⟩</code> ✓' },
          { h: 'Test 2', html: 'It works on |1⟩: <code>C(|1⟩|0⟩) = |1⟩|1⟩</code> ✓' },
          { h: 'Test 3 — the trap', html: 'Let us try on |+⟩ = (|0⟩+|1⟩)/√2.<br>Since every quantum gate is <b>linear</b> (it acts on each piece separately and then adds), the machine has to give:<br><code>(|0⟩|0⟩ + |1⟩|1⟩)/√2</code>' },
          { h: 'But we wanted…', html: '<code>|+⟩|+⟩ = (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2</code>, which has <b>four</b> terms.<br>The two results are <b>different</b>: the first is a Bell state (entangled), the second is not.' },
          { h: 'Conclusion', html: 'The universal photocopier <b>cannot exist</b>. You can copy the two basis states, but not superpositions. This is the <b>no-cloning theorem</b> (Wootters and Zurek, 1982).' },
          { h: 'Practical consequences', html: '• No backup of a quantum state → quantum error correction has to be much cleverer (level 21).<br>• An eavesdropper cannot copy the qubits of a communication without leaving a trace → this is the basis of <b>quantum cryptography</b> (QKD).' },
        ], { doneLabel: 'Proof understood!' });
      },
    },
    {
      t: 'If I cannot copy it… can I at least move it?',
      html: `<p>Yes. It is called <b>quantum teleportation</b> and it has been demonstrated in the lab thousands of times
             (between buildings, over fibre, and even to satellites).</p>
             <p>The recipe uses three qubits:</p>
             <ul>
               <li><b>q0</b>: the mystery qubit Alice wants to send (she herself does not know what it contains!);</li>
               <li><b>q1</b> and <b>q2</b>: an <b>entangled</b> pair prepared beforehand; q1 stays with Alice, q2 goes to Bob.</li>
             </ul>
             <p>Press "next step" and follow the commentary under the chart.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'teleport', title: 'Teleport a state', text: 'run all the steps and bring the difference between the starting qubit and Bob\'s down to zero.', xp: 55 });
        el.appendChild(m.root);
        teleportLab(el, { onDone: () => m.complete() });
      },
      after: `<div class="callout warn"><b>The three things not to misread:</b>
              <ol style="margin:8px 0 0">
                <li><b>No matter travels:</b> Bob's qubit was already there. It gets <i>reconfigured</i>, not shipped.</li>
                <li><b>It is not instantaneous:</b> it takes <b>2 classical bits</b> that Alice has to send normally
                    (phone, fibre, carrier pigeon). Without them, Bob has only noise. No information faster than light.</li>
                <li><b>The original dies:</b> Alice's measurement destroys the starting state. It is a <b>transfer</b>,
                    not a copy — and so no-cloning stands.</li>
              </ol></div>`,
    },
    {
      t: 'Dense coding: two bits inside one qubit',
      html: `<p>The reverse trick, discovered by Bennett and Wiesner. Alice and Bob share an entangled pair in advance.
             Then Alice, acting <b>only on her own qubit</b>, can send Bob <b>two classical bits</b> by shipping him
             <b>a single qubit</b>.</p>
             <table class="table">
               <tr><th>Bits to send</th><th>What Alice applies to her qubit</th><th>Resulting Bell state</th></tr>
               <tr><td class="mono">00</td><td>nothing (I)</td><td class="mono">(|00⟩ + |11⟩)/√2</td></tr>
               <tr><td class="mono">01</td><td>X</td><td class="mono">(|10⟩ + |01⟩)/√2</td></tr>
               <tr><td class="mono">10</td><td>Z</td><td class="mono">(|00⟩ − |11⟩)/√2</td></tr>
               <tr><td class="mono">11</td><td>Z then X</td><td class="mono">(|10⟩ − |01⟩)/√2</td></tr>
             </table>
             <p>The four resulting states are <b>perfectly distinguishable</b> by Bob (who holds both qubits once he has
             received Alice's): he applies CNOT and H and reads two clean bits.</p>
             <div class="callout"><b>The honest balance sheet:</b> this is not "free information". The entangled pair has to be distributed
             <i>beforehand</i>, and that costs. But it is the proof that entanglement is a genuine <b>resource</b>,
             something you can spend — exactly like bandwidth or memory.</div>
             <p class="dim small">A note for the curious: teleportation and dense coding are two sides of the same coin.
             In the first you spend 1 entangled pair + 2 classical bits to send 1 qubit. In the second you spend 1 entangled pair
             + 1 qubit to send 2 classical bits.</p>`,
    },
    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> In teleportation, what does Bob see <b>before</b> receiving the two classical bits?
           <span class="muted">(a completely random state: no information, otherwise relativity would be violated)</span></p>
        <p><b>2.</b> Try teleporting a state with θ = 0 (that is, |0⟩): does it work? Is it an interesting case or a trivial one?</p>
        <p><b>3.</b> If Alice slips up and applies the X correction when she should have applied Z, what does Bob receive?</p>
        <p class="mb0"><b>4.</b> A cryptographer's question: if an eavesdropper tries to read the qubits in transit,
           what happens to the state? And how do Alice and Bob notice? <i>(That is exactly the BB84 protocol.)</i></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'The no-cloning theorem says that…',
      options: ['you cannot measure a qubit', 'there is no machine that copies an unknown quantum state', 'you cannot create entangled states', 'qubits are lost after one second'], correct: 1,
      why: 'The linearity of quantum operations makes a universal photocopier impossible: it would work on the basis states but get every superposition wrong.' },
    { q: 'In quantum teleportation, what travels from Alice to Bob?',
      options: ['the physical qubit', 'two classical bits, over an ordinary channel', 'nothing', 'an entangled photon'], correct: 1,
      why: 'Bob\'s qubit is already there (entangled). Alice only needs two classical bits to tell him which correction to apply: that is why the speed of light is not exceeded.' },
    { q: 'After teleportation, Alice\'s original state…',
      options: ['stays identical', 'is destroyed by the measurement', 'becomes entangled with Bob', 'doubles'], correct: 1,
      why: 'It is a transfer, not a copy: Alice\'s measurement destroys the original. That is why no-cloning is not violated.' },
    { q: 'Dense coding lets you…',
      options: ['send 2 classical bits using 1 qubit and an already shared entangled pair', 'copy a qubit', 'compress files', 'measure two qubits together'], correct: 0,
      why: 'Entanglement shared in advance is a resource you can "spend" to double the capacity of a quantum channel.' },
  ],

  outro: `<div class="callout ok"><b>Part A complete!</b> You know what a qubit is, how it is measured, how it is manipulated,
          what entanglement is and what can (and cannot) be done. In Part B we raise the bar:
          amplitudes pointing in any direction, and the first algorithms that genuinely beat a classical computer.</div>`,
});
@endsection
