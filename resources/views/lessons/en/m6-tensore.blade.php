@php($description = 'Tensor product and entanglement learned by playing: why two qubits make four amplitudes and not four arbitrary numbers, the honest definition of entangled ("it cannot be written as two separate things") and the one-line calculation that detects it: a00·a11 − a01·a10.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { tensoreLab, groviglioLab } from '/js/widgets/tensore.js';

const L = renderLesson({
  id: 'm6-tensore',
  lead: `At level M·4 you discovered <b>that</b> n qubits live in a space of dimension 2<sup>n</sup>. Here you see
         <b>how</b>: there is an operation that puts two registers together, and it does not add the dimensions — it
         <b>multiplies</b> them. Out of that operation, in three lines of arithmetic, also comes the honest
         definition of the most abused word in physics: <b>entangled</b>. Which does not mean "the two qubits talk
         to each other at a distance". It means something far more precise, and you will detect it with a
         multiplication.`,

  steps: [
    {
      t: 'How two registers are put together',
      html: `<p>You have two qubits. The first is described by two amplitudes, the second likewise. Question: how
             many numbers describe the <b>pair</b>?</p>
             <p>The classical answer would be "two plus two, four numbers in two lists". The quantum one is
             different, and it is the root of everything: the pair has <b>four amplitudes in a single list</b>, one
             for each possible configuration — |00⟩, |01⟩, |10⟩, |11⟩ — and each is obtained by
             <b>multiplying</b>:</p>
             <div class="formula">(a₀ , a₁) ⊗ (b₀ , b₁) = (a₀b₀ , a₀b₁ , a₁b₀ , a₁b₁)</div>
             <p>The symbol ⊗ is called the <b>tensor product</b>. The rule is entirely there: <b>every amplitude
             times every amplitude</b>.</p>
             <div class="callout key">And here is the calculation that explains 2<sup>n</sup>. Dimensions do not add,
             they multiply: 2 × 2 = 4, then 4 × 2 = 8, then 16, 32… Every added qubit <b>doubles</b>, whereas two
             classical n-bit registers simply make 2n. Level M·4 gave you the number; this is the machine that
             produces it.</div>
             <p>In the game move the two qubits and watch the four bars at the bottom: they are always the products
             of the two groups above.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'tensore', title: 'Three pairs', text: 'build 3 different pairs.', xp: 45 });
        el.appendChild(m.root);
        tensoreLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Notice the green line at the bottom of the game: the number <b>a₀₀·a₁₁ − a₀₁·a₁₀</b> stays
              <b>zero</b>, always, for any pair you build. It is not a coincidence, and it is easy to see why: with
              a₀₀ = a₀b₀ and a₁₁ = a₁b₁, the first product is a₀a₁b₀b₁ — and the second, a₀₁·a₁₀ = a₀b₁ · a₁b₀, is
              exactly the same thing. They cancel.</p>
              <div class="callout key">Keep hold of that number: this course calls it the <b>cross</b>, and you have
              met it at level M·4, where it said whether two arrows were independent. Here it will say something
              else, and that something will be the point.</div>`,
    },

    {
      t: 'The question that turns everything around',
      html: `<p>Now the decisive step, and it is worth posing it as a question before answering.</p>
             <p>The tensor product takes two qubits and produces four amplitudes. But do <b>all</b> quadruples of
             four amplitudes arise this way? That is: <b>given a two-qubit state, can you always say "the first is
             like this and the second like that"?</b></p>
             <div class="callout warn">Pause before reading on. Count the degrees of freedom: two separate qubits are
             <b>two</b> numbers (one angle each). A normalised quadruple of amplitudes has <b>three</b>. Three
             parameters do not fit into two: states that are not products <b>must</b> exist.</div>
             <p>And they do. The most famous one is this, and you have already met it in this course at level 4:</p>
             <div class="formula">|00⟩ + |11⟩ &nbsp;(divided by √2)</div>
             <p>That is: the amplitudes are (0.707 ; 0 ; 0 ; 0.707). In the game that follows, try to rebuild it by
             moving the two qubits. <b>Try properly</b>, then read the box.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'groviglio', title: 'Separate them (or prove you cannot)', text: 'correctly classify 3 states.', xp: 60 });
        el.appendChild(m.root);
        groviglioLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>You did not manage it, and it is not your fault: <b>it is impossible</b>. Here is the proof, four
              lines long and entirely followable:</p>`,
    },

    {
      t: 'Why it is impossible, proved',
      html: `<p>Suppose the Bell state could be written as a product, that is, suppose there were two qubits
             (a₀, a₁) and (b₀, b₁) whose product gives (0.707 ; 0 ; 0 ; 0.707). Let us see where that leads.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'The four conditions', html: 'The tensor product tells us it would have to hold that: <b>a₀b₀ = 0.707</b>, <b>a₀b₁ = 0</b>, <b>a₁b₀ = 0</b>, <b>a₁b₁ = 0.707</b>.' },
          { h: 'The first deduction', html: 'From <b>a₀b₀ = 0.707</b> it follows that neither a₀ nor b₀ is zero. From <b>a₁b₁ = 0.707</b> it follows that neither a₁ nor b₁ is zero. So <b>all four</b> numbers are non-zero.' },
          { h: 'The contradiction', html: 'But the second condition says <b>a₀b₁ = 0</b>: a product of two non-zero numbers that ought to be zero. Impossible. Done.' },
          { h: 'What we have proved', html: 'Not that "we did not manage it": that <b>there exists no</b> pair of qubits whose product gives the Bell state. It is a proof by contradiction, short and final.' },
          { h: 'The one-line test', html: 'The same argument, condensed: a state (a₀₀, a₀₁, a₁₀, a₁₁) separates <b>if and only if</b> a₀₀·a₁₁ − a₀₁·a₁₀ = 0. For Bell that comes out 0.5, not zero — and it is the number you see in the game\'s bar.' },
          { h: 'And how entangled it is', html: 'The absolute value of that number, doubled, runs from 0 (separable) to 1 (maximally entangled). It is called <b>concurrence</b>. The Bell state scores exactly 1: you cannot do more.' },
        ], { doneLabel: 'Proved!' });
      },
      after: `<div class="callout ok"><b>Here is the definition worth taking away:</b>
              <p class="mb0" style="margin-top:8px"><b>Entangled = the pair's state does not split into a state of
              the first and a state of the second.</b></p>
              <p class="mb0" style="margin-top:8px">Not "the two qubits communicate". Not "they influence each other
              at a distance". Not "one knows what the other is doing". Simply: <b>there is no way of describing them
              separately</b>, because the complete description exists only for the whole pair.</p></div>
              <p>And the physical consequence usually told as a mystery becomes almost obvious: if the state is
              (|00⟩ + |11⟩)/√2 and you measure the first qubit getting 0, the only surviving term is |00⟩ — so the
              second will give 0 too. Not because the first "warned" the second: because there never was a separate
              description to warn.</p>`,
    },

    {
      t: 'Who makes entanglement: the CNOT',
      html: `<p>One last practical question: if entangled states cannot be written as products, <b>how are they
             manufactured?</b></p>
             <p>Not with two separate gates. That can be proved too: applying one gate to the first qubit and another
             to the second means applying the <b>tensor product of the two matrices</b>, and a product of separate
             matrices sends separable states to separable states. Always. This level's tests check it across
             hundreds of combinations.</p>
             <div class="callout key">What is needed is a gate that is <b>not</b> a tensor product — one that treats
             the two qubits <b>together</b> rather than one at a time. The simplest is the <b>CNOT</b> from level 4:
             "if the first is 1, flip the second". That sentence cannot be split into two separate sentences, and
             that is precisely why it works.</div>
             <p>The Bell-state recipe you executed at level 4 now reads in full:</p>
             <ol>
               <li>start from |0⟩⊗|0⟩ — separable, cross zero;</li>
               <li>an <b>H</b> on the first qubit: it becomes (|0⟩+|1⟩)/√2 ⊗ |0⟩ — still separable, H is a
                   single-qubit gate;</li>
               <li>a <b>CNOT</b>: and the cross goes from 0 to 0.5. <b>There</b> is where entanglement is born.</li>
             </ol>
             <p class="mb0">Note step 2: superposition alone is <b>not enough</b>. You need superposition <i>and
             then</i> a two-qubit gate. On |0⟩⊗|0⟩ the CNOT does nothing — try it in your head, and the tests confirm
             it.</p>`,
    },

    {
      t: 'Where it comes from: a word invented for a letter',
      html: `<p>The word is born in a single year, <b>1935</b>, and it is a crowded year.</p>
             <p>In the spring <b>Einstein, Podolsky and Rosen</b> publish the paper now known as <b>EPR</b>: they
             take two particles prepared together and show that, according to quantum mechanics, measuring one
             immediately determines what you will get from the other. Their conclusion is not "how wonderful": it is
             that the theory must be <b>incomplete</b>, because reality cannot possibly work that way.</p>
             <p>A few months later <b>Erwin Schrödinger</b> replies with a long paper — the one where the famous cat
             also appears — and in doing so he <b>coins the word</b>. In German he writes <i>Verschränkung</i>,
             meaning "interlacing, the folding of the arms". And since he also writes an English version, he
             translates it himself: <b>entanglement</b>.</p>
             <div class="callout key">The sentence he introduces it with has stuck, and it is stronger than the way
             it is usually quoted: entanglement is not <i>one</i> trait but <b>the</b> characteristic trait of
             quantum mechanics, the one that enforces its entire departure from classical lines of thought. And he
             describes it exactly as you have seen it here: when two systems interact, <b>their wave functions can
             no longer be separated</b>.</div>
             <p>For thirty years the matter stays philosophical: EPR says "the theory is incomplete", Bohr says no,
             and there is no way to decide by experiment. Then in <b>1964</b> <b>John Bell</b> does the thing nobody
             expected: he turns the dispute into a <b>numerical inequality</b> that can be measured in a laboratory.
             From the 1980s on, experiments violate it, every time — and the <b>2022 Nobel Prize in Physics</b> goes
             to <b>Aspect, Clauser and Zeilinger</b> precisely for having done it beyond challenge.</p>
             <div class="callout ok"><b>A curiosity about the word "tensor".</b> It has nothing to do with quantum
             physics: it comes from the Latin <i>tendere</i>, and it was introduced at the end of the nineteenth
             century (<b>Woldemar Voigt</b>) to describe the <b>tensions inside a material</b> — how much a piece of
             metal pulls in each direction. Tensor calculus as a general tool is built by two Italians,
             <b>Gregorio Ricci-Curbastro</b> and his pupil <b>Tullio Levi-Civita</b>, between 1890 and 1900.
             Einstein will use it for general relativity, and quantum physicists for putting registers together.
             Once again: a tool built for one problem turning out decisive for another.</div>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game set both qubits to 45°: what four amplitudes come out? And the cross?
           <span class="muted">(0.5 each, and the cross is zero: 0.25 − 0.25)</span></p>
        <p><b>2.</b> In the second game, on state 3, find the two angles that rebuild it. It works with 30° and 60°:
           try to see why by looking at the numbers.</p>
        <p><b>3.</b> On state 4 (0 ; 0.707 ; 0.707 ; 0), redo the proof by contradiction yourself: which of the four
           conditions clashes? <span class="muted">(this time it is a₀b₀ = 0 and a₁b₁ = 0 that cannot hold alongside
           the other two)</span></p>
        <p><b>4.</b> If n qubits have 2<sup>n</sup> amplitudes, how many do <b>three</b> qubits need? Write the list
           of configurations. <span class="muted">(eight: 000, 001, 010, 011, 100, 101, 110, 111)</span></p>
        <p class="mb0"><b>5.</b> Inventor's question: if entanglement is only created by two-qubit gates, how many
           CNOTs does it take <b>at minimum</b> to bind n qubits together? <span class="muted">(hint: think of a
           chain — and this number really matters when designing a circuit for a real machine, where not every pair
           of qubits is physically connected)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'How do the amplitudes of two qubits combine to describe the pair?', options: ['they add', 'every amplitude multiplies every amplitude: (a₀,a₁) ⊗ (b₀,b₁) = (a₀b₀, a₀b₁, a₁b₀, a₁b₁)', 'they are lined up one after the other', 'you take the average'], correct: 1,
      why: 'That is the tensor product, and the consequence is that dimensions multiply instead of adding: 2 × 2 = 4. Hence the 2^n for n qubits.' },
    { q: 'What does it mean that a two-qubit state is "entangled"?', options: ['that the two qubits exchange signals', 'that the pair\'s state CANNOT be written as "the first is like this and the second like that"', 'that the two qubits have the same amplitude', 'that the measurement is random'], correct: 1,
      why: 'It is an impossibility of factorisation, not a communication. The complete description exists only for the whole pair: there is no separate description of the two pieces.' },
    { q: 'How do you detect entanglement with a single calculation?', options: ['by adding the amplitudes', 'by computing a₀₀·a₁₁ − a₀₁·a₁₀: if it is not zero, the state is entangled', 'by seeing which amplitude is biggest', 'by counting how many amplitudes are zero'], correct: 1,
      why: 'It is the same "cross" that at level M·4 said whether two arrows were independent. For a tensor product it is always zero; if it is not zero, no such product exists.' },
    { q: 'Why can the state (|00⟩ + |11⟩)/√2 not be separated?', options: ['because the amplitudes are irrational', 'because it would need a₀, a₁, b₀, b₁ all non-zero and at the same time a₀b₁ = 0: two incompatible conditions', 'because it is not normalised', 'because it has two terms instead of one'], correct: 1,
      why: 'The amplitudes of |00⟩ and |11⟩ force all four numbers to be non-zero; but the amplitudes of |01⟩ and |10⟩ demand that some products be zero. Contradiction: no pair of qubits gives that state.' },
    { q: 'Can two separate gates, one per qubit, create entanglement?', options: ['yes, if they are strong enough', 'no: their effect is a tensor product, which sends separable states to separable states', 'yes, if applied many times', 'only if they are unitary'], correct: 1,
      why: 'You need a gate that treats the two qubits together, like the CNOT: "if the first is 1, flip the second" is a sentence that cannot be split into two separate ones.' },
    { q: 'Who coined the word "entanglement", and when?', options: ['Einstein, in 1905', 'Schrödinger in 1935, translating the German Verschränkung', 'Bell, in 1964', 'Bohr, in the 1920s'], correct: 1,
      why: 'Schrödinger introduces it while replying to the EPR paper, in the same work where the cat appears. He called it the characteristic trait of quantum mechanics, the one that enforces the departure from classical thinking.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> The tensor product multiplies dimensions instead of adding them, and
          that is where 2<sup>n</sup> comes from. A product always has cross zero; so any state with a non-zero cross
          <b>is not a product</b> — and that is what "entangled" means, proved in four lines rather than narrated.
          And the gate that switches that cross on is the CNOT.</div>`,
});
@endsection
