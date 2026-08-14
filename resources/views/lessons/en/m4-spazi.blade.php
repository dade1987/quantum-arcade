@php($description = 'Vector spaces learned by playing: linear combination, basis and dimension handled directly, why in an orthonormal basis the coordinates are the shadows (dot product), what "changing measurement basis" really means, and where the 2^n that makes simulating many qubits impossible comes from.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { baseLab, dimensioneLab } from '/js/widgets/spazi.js';

const L = renderLesson({
  id: 'm4-spazi',
  lead: `The word <b>basis</b> runs through this whole course — measurement basis, computational basis, change of
         basis — and so far you have grasped it by instinct. Now it becomes something you can handle, and with it
         comes the word <b>dimension</b>: the number the notorious <b>2<sup>n</sup></b> comes out of, that is, the
         reason an ordinary computer cannot simulate fifty qubits. Two concepts only, and you can see both of them
         by moving two sliders.`,

  steps: [
    {
      t: 'What a vector space is (without axioms)',
      html: `<p>An honest definition, in one line: a <b>vector space</b> is a place full of objects you can do just
             two things with — <b>add them together</b> and <b>stretch or shrink them</b> by multiplying by a
             number. That is all.</p>
             <p>It sounds like very little, and instead you find the same structure in places that have nothing in
             common:</p>
             <table class="table">
               <tr><th>The objects</th><th>Adding means</th><th>Stretching means</th></tr>
               <tr><td>arrows on the plane</td><td>tip to tail</td><td>pulling them longer</td></tr>
               <tr><td>lists of numbers</td><td>adding them slot by slot</td><td>multiplying them all by k</td></tr>
               <tr><td>waves and sounds</td><td>overlaying them</td><td>turning the volume up</td></tr>
               <tr><td><b>quantum states</b></td><td><b>superposition</b></td><td>changing the amplitude</td></tr>
             </table>
             <div class="callout key">That last row is why this level exists. <b>Quantum superposition</b> is not an
             exotic phenomenon to be accepted: it is the <b>addition</b> of a vector space. When you write
             α|0⟩ + β|1⟩ you are doing exactly what you do when you add two arrows — and every rule you are about to
             see holds there unchanged.</div>
             <p>The technical name for "stretch and add" is <b>linear combination</b>. In the game you make one by
             hand.</p>`,
    },

    {
      t: 'Two arrows that are enough for the whole plane',
      html: `<p>I give you two arrows and two sliders. You can stretch or shrink each as much as you like, even
             backwards, and then add them. Question: <b>where can you get to?</b></p>
             <p>Try the first basis, then try changing it. And above all try the last one, the one called "two in
             line": it is there to show something words cannot.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'base', title: 'Three targets', text: 'reach 3 different targets.', xp: 45 });
        el.appendChild(m.root);
        baseLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>The result is sharp and has two faces:</p>
              <ul>
                <li>with two arrows <b>not in line</b> you reach <b>any</b> point of the plane. Not "almost all":
                    all of them, and in exactly one way. Two arrows like that are called a <b>basis</b>, and the two
                    slider numbers are the point's <b>coordinates</b> in that basis;</li>
                <li>with two arrows <b>in line</b> you never get there, however hard you try: any combination stays
                    on the same straight line. Half the plane is unreachable.</li>
              </ul>
              <div class="callout warn"><b>That wall was deliberate</b>, and the game tells you so rather than
              letting you spin. It is the quickest way to grasp what <b>independent</b> means: two arrows are
              independent when the second one <b>adds a new direction</b> instead of repeating the first.</div>
              <p class="mb0">And notice something that shows up when you change basis: <b>the same point has
              different coordinates in different bases</b>. The point does not move — the way of naming it changes.
              Keep that aside: two steps from now it becomes the heart of quantum measurement.</p>`,
    },

    {
      t: 'How many are needed: dimension',
      html: `<p>Now the question that gives you the number. Not "which arrows", but <b>how many</b>.</p>
             <p>In the game you have a collection of arrows and you switch them on and off. The goal is to cover the
             whole plane using the <b>smallest</b> possible number.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'dimensione', title: 'The minimum that suffices', text: 'find the minimal set that covers the plane, on 3 collections.', xp: 50 });
        el.appendChild(m.root);
        dimensioneLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>However you pick the arrows, the count always ends the same way: <b>exactly two are needed</b>. One
              is not enough (you only cover a line), three are too many (one can be written using the others).</p>
              <div class="callout key">That number is called the <b>dimension</b>, and the remarkable thing is that
              it <b>does not depend on the basis</b>: you can choose the axes, a rotated basis, a skewed one — the
              coordinates all change, the number of arrows needed does not. It is a property of the <b>space</b>,
              not of your choice.</div>
              <p>One collection, though, never gets there: the one where all the arrows lie on the same line. There
              the dimension of the space you cover is <b>1</b>, and no choice saves you. That is not a bug in the
              game: it is the difference between "I have many arrows" and "I have many <b>directions</b>".</p>`,
    },

    {
      t: 'Orthonormal basis: when the coordinates are the shadows',
      html: `<p>Among all possible bases there is one family far more convenient than the rest: those made of arrows
             of <b>length 1</b> that are <b>perpendicular</b> to each other. They are called <b>orthonormal</b>, and
             the convenience is this:</p>
             <div class="callout key">In an orthonormal basis, to find a point's coordinates you <b>do not have to
             solve anything</b>: you just take the <b>dot product</b> with each basis arrow. That is — level 0·9 —
             you just <b>cast the shadow</b>.</div>
             <p>In a skewed basis the shortcut does not hold and the calculation is longer: which is why in quantum
             mechanics the bases are <b>always</b> orthonormal.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'The starting point', html: 'A qubit state is <b>α|0⟩ + β|1⟩</b>. Look at it for what it is: a <b>linear combination</b> of two basis arrows, with coefficients α and β.' },
          { h: 'The computational basis', html: '|0⟩ and |1⟩ are two arrows that are <b>perpendicular and of length 1</b>: an orthonormal basis. So α and β are simply the state\'s two <b>shadows</b> on those directions.' },
          { h: 'Born\'s rule', html: 'The probability of reading 0 is <b>α²</b>, the shadow squared. And since Pythagoras holds in an orthonormal basis, α² + β² is the state\'s length squared, which is 1: <b>the probabilities make 100%</b> by construction.' },
          { h: 'The other basis', html: 'The arrows |+⟩ and |−⟩ (the sum and the difference of |0⟩ and |1⟩, normalised) are <b>another orthonormal basis of the same space</b>: turned by 45°. The state does not change; the two numbers describing it do.' },
          { h: 'What measuring is', html: 'Measuring means <b>choosing a basis</b> and asking the state: "in which of your basis directions do I find you?". The probabilities are the shadows squared <i>in that basis</i>.' },
          { h: 'Why the same thing gives different answers', html: 'The state |+⟩ measured in the basis of |+⟩ and |−⟩ gives "plus" <b>always</b>, with certainty. The same state measured in the basis of |0⟩ and |1⟩ gives 50 and 50. The state has not changed: the <b>question</b> has. And that is the whole of the famous "it depends how you measure".' },
        ], { doneLabel: 'Got it!' });
      },
      after: `<div class="callout ok"><b>Summary in one line:</b> the state is a point, the basis is the coordinate
              system, measuring is asking for the coordinates. Changing basis does not move the point — it changes
              the question.</div>`,
    },

    {
      t: 'The two to the n, and why it is frightening',
      html: `<p>Now the count that decides everything. How big is the space a quantum register lives in?</p>
             <p>One qubit has two basis directions, |0⟩ and |1⟩: <b>dimension 2</b>. Two qubits have |00⟩, |01⟩,
             |10⟩, |11⟩ as a basis: <b>dimension 4</b>. Three qubits: eight. Every extra qubit <b>doubles</b> it:</p>
             <div class="formula">n qubits → dimension <span class="hl-n">2<sup>n</sup></span> &nbsp;&nbsp;(not 2n)</div>
             <p>That distinction, which looks like a notational detail, is the entire field. With n classical bits
             you need <b>n</b> numbers to say how the register stands. With n qubits you need <b>2<sup>n</sup></b> —
             one per amplitude — because the state is a linear combination of all the configurations at once.</p>
             <table class="table">
               <tr><th>Qubits</th><th>Numbers to hold</th><th>Memory (at 16 bytes each)</th></tr>
               <tr><td class="mono">10</td><td class="mono">1,024</td><td>16 KB</td></tr>
               <tr><td class="mono">30</td><td class="mono">1,073,741,824</td><td>~17 GB</td></tr>
               <tr><td class="mono">50</td><td class="mono">~10¹⁵</td><td>~18,000 TB</td></tr>
               <tr><td class="mono">300</td><td class="mono">~10⁹⁰</td><td>more than the atoms in the observable universe</td></tr>
             </table>
             <div class="callout key">This is why this course's simulator reaches a few qubits and not three hundred:
             it is not lazy code, it is the <b>dimension of the space</b>. And it is also why a quantum computer is
             interesting — not "because it is fast", but because it is a physical object that <b>inhabits</b> that
             space without having to write it down.</div>
             <p class="mb0">And beware of the commonest misunderstanding: having 2<sup>n</sup> amplitudes does
             <b>not</b> mean you can read 2<sup>n</sup> answers. A measurement returns <b>one</b>. The whole craft of
             quantum algorithms is making those amplitudes interfere so that the right answer is the one that comes
             out — which is exactly what you saw the roots of unity doing at levels 15·b and M·3.</p>`,
    },

    {
      t: 'Where it comes from: a schoolteacher and a Sanskrit dictionary',
      html: `<p>The idea of studying "things that add and stretch" in the abstract — without saying whether they are
             arrows, numbers or functions — is surprisingly recent, and comes from a book <b>almost nobody
             read</b>.</p>
             <p>In <b>1844</b> <b>Hermann Grassmann</b>, a secondary-school teacher in Stettin, publishes the
             <i>Lineale Ausdehnungslehre</i> — "theory of linear extension" — in which he builds, some eighty years
             early, much of modern linear algebra: dependence, independence, dimension, subspaces. The book is
             written so abstractly and obscurely that it is <b>ignored</b>. Grassmann is not a university professor,
             he has no chair to be heard from, and the mathematicians of his time find him unreadable.</p>
             <div class="callout key"><b>The curiosity:</b> disappointed, Grassmann <b>gives up mathematics</b> and
             takes up Sanskrit. He publishes a translation of the <i>Rigveda</i> and a <b>dictionary</b> that becomes
             a standard reference — so much so that he receives an honorary doctorate <b>for linguistics</b>, not for
             mathematics. His Rigveda dictionary is still in use today. He died without knowing that his "unreadable"
             book was about to become the language of twentieth-century physics.</div>
             <p>Among the first to prove him right is an Italian: in <b>1888</b> <b>Giuseppe Peano</b> publishes the
             <i>Calcolo geometrico secondo l'Ausdehnungslehre di H. Grassmann</i> and slips into it, almost quietly,
             the <b>first modern axiomatic definition of a vector space</b>: the list of rules still found in
             textbooks today. That too goes largely unnoticed for decades.</p>
             <p>The jump to the quantum comes with <b>David Hilbert</b> and above all with <b>John von Neumann</b>,
             who in <b>1932</b> rewrites the whole of quantum mechanics as geometry in a vector space with a dot
             product — what is now called a <b>Hilbert space</b>. From then on "state" means <b>vector</b>,
             "observable" means <b>operator</b>, and "measurement" means <b>projection onto a basis</b>: that is,
             exactly the three things in this level.</p>
             <div class="callout ok"><b>Worth noting:</b> Grassmann was trying to tidy up geometry, not to describe
             atoms. Eighty years later, his language turned out to be the only one fit for the job. It is the same
             story as the complex numbers of level M·3 — and it happens so often that it has a name: "the
             unreasonable effectiveness of mathematics".</div>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game pick the "turned by 45°" basis and reach the target (2 ; 1). What numbers do
           you need? Then do the same with the "axes" basis. <span class="muted">(same point, different numbers:
           that is the whole of changing basis)</span></p>
        <p><b>2.</b> Still in the first game, with the "two in line" basis, try reaching any target at all. After a
           while, stop: <b>which</b> property do those two arrows lack?</p>
        <p><b>3.</b> In the second game, collection 3 has four arrows. How many different pairs form a basis?
           <span class="muted">(not all of them: 1 and 2 are in line with each other)</span></p>
        <p><b>4.</b> If one qubit has dimension 2 and two qubits dimension 4, how many numbers do <b>eight</b>
           qubits need? And <b>twenty</b>? <span class="muted">(256 and a little over a million)</span></p>
        <p class="mb0"><b>5.</b> Inventor's question: arrows on the plane have dimension 2. Functions — which also
           add and stretch — what dimension do they have? <span class="muted">(hint: how many do you need to build
           all the others? and what does the Fourier transform, which writes any wave as a sum of sines and cosines,
           have to do with it?)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What is a vector space, in substance?', options: ['a set of arrows', 'a place full of objects that can be added together and stretched by multiplying by a number', 'a coordinate system', 'three-dimensional space'], correct: 1,
      why: 'Only those two operations are needed. That is why the same structure applies to arrows, lists of numbers, waves and quantum states — and quantum superposition is simply the addition of a vector space.' },
    { q: 'When do two arrows in the plane form a basis?', options: ['when they are perpendicular', 'when they do not lie on the same line', 'when they have length 1', 'when they point right'], correct: 1,
      why: 'It is enough that they be independent, that is, that the second one add a new direction. Perpendicular and of length 1 is a stronger condition (orthonormal), convenient but not necessary.' },
    { q: 'What is the dimension of a space?', options: ['the number of arrows you happen to have', 'the smallest number of arrows needed to reach everything — and it does not depend on which basis you pick', 'the length of the longest arrow', 'the number of positive coordinates'], correct: 1,
      why: 'Fewer are not enough, more are redundant. The number is a property of the space: changing basis changes the coordinates, not how many are needed.' },
    { q: 'In an orthonormal basis, how do you find a point\'s coordinates?', options: ['by solving a system', 'by taking the dot product with each basis arrow: they are the shadows', 'by measuring the angles', 'you cannot find them'], correct: 1,
      why: 'That convenience is what makes every basis in quantum mechanics orthonormal: the amplitudes are the state\'s projections on the basis directions, and the probabilities are those shadows squared.' },
    { q: 'What does measuring a qubit in a different basis mean?', options: ['changing the qubit\'s state', 'asking it a different question: the state stays the same, the coordinates describing it change', 'changing the order of the qubits', 'repeating the measurement'], correct: 1,
      why: 'The state is a point; the basis is the coordinate system. |+⟩ measured in the basis of |+⟩ and |−⟩ always gives the same result; measured in that of |0⟩ and |1⟩ it gives 50 and 50. The point has not moved.' },
    { q: 'What is the dimension of the state space of n qubits?', options: ['2n', 'n²', '2^n', 'n'], correct: 2,
      why: 'Every extra qubit doubles the number of amplitudes to hold. With 50 qubits that is about 10¹⁵ numbers: which is why simulating a quantum computer on an ordinary one becomes impossible.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> Basis = a few arrows that suffice for everything; dimension = how many
          are needed, and it does not depend on which basis you pick; orthonormal basis = coordinates that are
          shadows, that is, dot products. With those three pieces "changing measurement basis" stops being a formula
          and becomes a plain sentence — and 2<sup>n</sup> stops being a threat and becomes a calculation you can
          redo yourself.</div>`,
});
@endsection
