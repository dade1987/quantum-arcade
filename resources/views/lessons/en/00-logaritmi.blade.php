@php($description = 'Exponentials and logarithms learned by playing: how many bits for N cases, how many times you can halve, and why "polynomial in the number of digits" is the sentence that explains Shor\'s quantum advantage.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { bitLab, dimezzaLab } from '/js/widgets/logaritmi.js';

const L = renderLesson({
  id: '00-logaritmi',
  lead: `"Logarithm" is a scary word hiding a very simple question: <b>how many times do I multiply a number by itself
         to get there?</b> In this course it almost always shows up in one shape — <b>how many bits, or how many
         qubits, do I need</b> — and that is the same question as "how many digits does this number have". Twenty
         minutes of play stand between you and the most important sentence in the whole course:
         <i>Shor is fast in the number of digits</i>.`,

  steps: [
    {
      t: 'The exponential, in one line: it just doubles',
      html: `<p>You already know this part from level 0·1, so just a reminder: one switch has two positions, two
             switches have four, three have eight. Every extra switch <b>doubles</b>.</p>
             <div class="formula">with n switches you pick from <span class="hl-n">2ⁿ</span> possibilities</div>
             <p>Doubling is slow at first and inhuman afterwards: 10 switches make 1024, 20 make over a million, 30 make
             over a billion. It is the growth level K·5 puts in a race against the others.</p>
             <div class="callout key">But in practice the question you actually need is almost always <b>the other way
             round</b>: not "what is 2¹⁰", but "for a thousand things, how many switches do I need?". And that is where
             the logarithm comes in.</div>`,
    },

    {
      t: 'The question turned around: the logarithm',
      html: `<p>In the game you choose how many things you must tell apart — the 26 letters, the 52 cards, the 365 days —
             and switch on switches until they are enough. Look for the <b>minimum</b>: the one below which you no longer
             make it.</p>
             <p>That minimum <b>is</b> the base-2 logarithm, rounded up. Nothing more.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'bit', title: 'The minimum that does it', text: 'find the minimum number of switches for 3 different cases.', xp: 35 });
        el.appendChild(m.root);
        bitLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Look at the step: for 1000 cases, 9 switches cover 512 and are <b>not enough</b>; 10 cover 1024 and are.
              That is why you always round up — half a switch does not exist.</p>
              <div class="formula">2¹⁰ = 1024 &nbsp;⟺&nbsp; log₂(1024) = <span class="hl-n">10</span></div>
              <p>The two lines say exactly the same thing, read from two sides. The logarithm is the operation that
              <b>undoes</b> raising to a power — as subtraction undoes addition and division undoes multiplication
              (level 0·7: only operations that can be undone may be moved from one pan to the other).</p>`,
    },

    {
      t: 'The same question in disguise: how many times can I halve',
      html: `<p>Now a question that looks like a different one: I start from 1000 and keep <b>halving</b>. After how many
             cuts is one left?</p>
             <p>Try it in the game, then look at the number that comes out.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'dimezza', title: 'Down to one', text: 'halve all the way and say how many cuts it took, on 2 numbers.', xp: 40 });
        el.appendChild(m.root);
        dimezzaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>It is the same number as before. Not by chance: they are <b>the same question</b>.</p>
              <div class="callout key">"How many times must I double 1 to reach N?" and "how many times must I halve N
              to reach 1?" necessarily have the same answer: it is the same ladder walked in both directions. That
              number is called <b>log₂N</b>.</div>
              <p>And here three parts of the course light up at once:</p>
              <ul>
                <li><b>binary search</b> (level K·4) halves the shelf with every question: that is why the questions
                    number log₂N and not N;</li>
                <li>the <b>FFT</b> (level 17) splits the problem in half at every stage: the stages number log₂N, and
                    that is where the N·log N cost comes from;</li>
                <li><b>n qubits</b> handle 2ⁿ amplitudes: turned around, representing N possibilities takes log₂N
                    qubits. Twenty qubits for a million cases.</li>
              </ul>`,
    },

    {
      t: 'The number of digits is a logarithm (and here everything hinges)',
      html: `<p>How many digits does a number have? Look at what happens in base 10:</p>
             <table class="table">
               <tr><th>Number</th><th>Digits</th></tr>
               <tr><td class="mono">7</td><td class="mono">1</td></tr>
               <tr><td class="mono">1 000</td><td class="mono">4</td></tr>
               <tr><td class="mono">1 000 000</td><td class="mono">7</td></tr>
               <tr><td class="mono">1 000 000 000</td><td class="mono">10</td></tr>
             </table>
             <p>The number grows a thousandfold and the digits go up by three. The digits are <b>the logarithm</b> of the
             number: they grow at a crawl while the number explodes.</p>
             <div class="callout key">Now re-read the sentence that sounds technical in the Shor level and is in fact
             everything:
             <p style="margin:8px 0 0"><i>"Shor factors in time <b>polynomial in the number of digits</b> of N".</i></p>
             <p class="mb0" style="margin-top:8px">Number of digits = log N. So "polynomial in log N", which is
             <b>vastly faster</b> than "polynomial in N". A 600-digit number is as big as 10⁶⁰⁰, but it has 600 digits:
             an algorithm working on the digits faces a tiny problem compared with one working on the number.</p></div>`,
      mount: el => {
        stepper(el, [
          { h: 'The problem', html: 'Factoring N by trying divisors one at a time costs about <b>√N</b> attempts. With N of 600 digits, √N has 300 digits: more attempts than there are atoms in the observable universe.' },
          { h: 'The right measure', html: 'The real size of the problem is not N: it is <b>how long it is to write down</b>, that is the number of digits, that is log N. A computer receives 600 digits, not 10⁶⁰⁰ objects.' },
          { h: 'What "efficient" means', html: 'An algorithm counts as efficient if the time grows like a <b>power of the number of digits</b> (log N squared, cubed…). If instead it grows like √N or like N, it is exponential <b>in the number of digits</b>: doubling the digits squares the work.' },
          { h: 'Where Shor sits', html: 'Shor sits in the first group: about <b>(log N)³</b> operations. That is why a 600-digit number — untouchable classically — would be within reach of a large enough quantum machine.' },
          { h: 'And Grover?', html: 'Grover searches in <b>√N</b> instead of N: a real gain, but a <b>quadratic</b> one, not exponential. On a problem with 2ⁿ possibilities it stays 2^(n/2): a lot, but still exponential in the digits. Hence the difference in fame between the two algorithms.' },
          { h: 'The one-line summary', html: 'Quantum advantage is not "it goes faster": it is <b>changing how the time grows as the digits grow</b>. And the digits are a logarithm.' },
        ], { doneLabel: 'Got it!' });
      },
    },

    {
      t: 'Two rules worth having',
      html: `<p>Let us close with the two properties you meet while reading, which are less mysterious than they look.</p>`,
      mount: el => {
        formula(el, {
          title: 'The logarithm, piece by piece',
          parts: [
            { t: 'log(a · b)', id: 'p', color: 'cyan', name: 'the logarithm of a product', say: 'The logarithm turns multiplications into sums: log(a·b) = log a + log b.', ex: 'log₂(8 · 4) = log₂32 = 5 = 3 + 2 ✓' },
            { t: '=' },
            { t: 'log a + log b', id: 's', color: 'green', name: 'the sum of the two logarithms', say: 'It is why, before calculators, people multiplied with log tables and slide rules: adding is easier.', ex: 'And in computing: doubling the data adds ONE step to a binary search, it does not double it.' },
            { t: '·' },
            { t: 'log(aⁿ)', id: 'e', color: 'amber', name: 'the logarithm of a power', say: 'An exponent becomes a factor: log(aⁿ) = n · log a.', ex: 'log₂(2¹⁰) = 10 · log₂2 = 10 · 1 = 10 ✓' },
            { t: '=' },
            { t: 'n · log a', id: 'n', color: 'violet', name: 'the exponent comes down', say: 'This is the rule that lets you say "exponential growth is a straight line on a logarithmic scale".', ex: 'On a log plot 2ⁿ becomes a straight line: its slope is log 2.' },
          ],
        });
      },
      after: `<div class="callout ok">No need to memorise them: just remember that the logarithm <b>takes everything
              down one floor</b> — multiplications become sums, exponents become factors. That is why it turns up
              whenever the numbers get out of hand.</div>`,
    },

    {
      t: 'Where it comes from',
      html: `<p>Logarithms were not born in a maths lesson: they were born out of a <b>problem of drudgery</b>. In the
             sixteenth century astronomers spent days multiplying eight- and ten-digit numbers — planetary positions,
             sea routes — and every multiplication by hand is a chance to get it wrong.</p>
             <p><b>John Napier</b>, in Scotland, worked on it for twenty years and published the first tables in
             <b>1614</b>. The idea was exactly the one you saw in the last step: if every number is written as a
             <b>power</b>, multiplying two numbers becomes <b>adding</b> their exponents. And adding is something you
             can do without slipping.</p>
             <p>Three years later <b>Henry Briggs</b> travelled to meet him and together they settled on base 10, which
             makes the tables convenient with decimal digits. From there come the slide rule, a century of navigation
             and — once computers arrived — the standard way of measuring what an algorithm costs.</p>
             <div class="callout key">Laplace is said to have remarked that logarithms, "by shortening the labours,
             doubled the life of the astronomer". Which is what a logarithm does here too: it takes a growth that
             explodes and brings it back to a scale a person can look at.</div>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> How many qubits do you need to represent every possible answer to a problem with a billion cases?
           <span class="muted">(try it in the game: the answer is 30)</span></p>
        <p><b>2.</b> If a classical algorithm takes N steps and a quantum one √N, how many times faster is it on a
           million cases? And on a billion? <span class="muted">(the answer keeps growing, and that is why Grover
           matters)</span></p>
        <p><b>3.</b> Roughly how many decimal digits does a 2048-bit RSA number have?
           <span class="muted">(hint: 2048 · log₁₀2 ≈ 2048 · 0.301)</span></p>
        <p class="mb0"><b>4.</b> Inventor's question: if tomorrow someone found a <b>classical</b> algorithm polynomial
           in the number of digits for factoring, what would happen to Shor's advantage?
           <span class="muted">(it is not ruled out: nobody has ever proved that factoring is hard)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What is log₂(1024)?', options: ['1024 divided by 2', 'the number of times you multiply 2 by itself to reach 1024, that is 10', '2 to the power of 1024', 'half of 1024'], correct: 1,
      why: '2¹⁰ = 1024, so log₂(1024) = 10. The two lines say the same thing read from either side.' },
    { q: 'How many bits do you need to tell 1000 things apart?', options: ['9', '10', '100', '1000'], correct: 1,
      why: 'With 9 bits you cover 512 cases: not enough. With 10 you cover 1024: enough, and it is the minimum. You always round up.' },
    { q: 'How many times can you halve 1000 before getting down to 1?', options: ['3', '10', '100', '500'], correct: 1,
      why: 'Ten: the same number as the bits needed, because it is the same question walked backwards. And it is why binary search makes 10 comparisons instead of 1000.' },
    { q: 'Why does "polynomial in the number of digits" matter so much?', options: ['it is more elegant', 'because the number of digits is the logarithm of the number: it grows at a crawl while the number explodes', 'because digits are always few', 'because it avoids rounding'], correct: 1,
      why: 'A 600-digit number is about 10⁶⁰⁰. An algorithm growing like a power of 600 is tractable; one growing like 10⁶⁰⁰ is not. All of Shor\'s advantage lives in that difference.' },
    { q: 'What is log(a · b)?', options: ['log a · log b', 'log a + log b', 'log a − log b', 'a · log b'], correct: 1,
      why: 'The logarithm turns products into sums. It is the property that made slide rules and log tables possible, and that straightens exponential curves on logarithmic plots.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> A logarithm is "how many times must I double", which is also "how many
          times can I halve", which is also "how many digits do I need". With that in hand, "n qubits for 2ⁿ amplitudes"
          and "polynomial in the number of digits" stop being formulas to endure and become sentences that say something
          precise.</div>`,
});
@endsection
