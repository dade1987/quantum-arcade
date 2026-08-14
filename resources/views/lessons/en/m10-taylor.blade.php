@php($description = 'Taylor series taught by playing: the polynomial that chases the curve and peels away as you move off, the radius of convergence you can touch, Euler\'s formula read straight off the page by separating even from odd terms — and the discovery that Grover\'s √N is sin x ≈ x, a series stopped at the first term.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { taylorLab, piccoliAngoliLab } from '/js/widgets/taylor.js';

const L = renderLesson({
  id: 'm10-taylor',
  lead: `A computer cannot compute <b>sin x</b>. It can add and multiply, and that is all. And yet when you type
         «sin 1» it answers in a microsecond. How? It does a sum: <b>x − x³/6 + x⁵/120 − …</b> This is a Taylor
         series, and it is the trick by which any curve can be replaced with a <b>polynomial</b>, as long as you do
         not stray too far. By the end of this level you will find that Grover's √N — the most famous quantum
         advantage in this course — is nothing but this series <b>stopped at the first term</b>.`,

  steps: [
    {
      t: 'The polynomial that chases the curve',
      html: `<p>The idea is this. Take a curve and a point — say x = 0 — and try to build a polynomial that
             resembles it <b>there</b>. Not everywhere: there.</p>
             <ul>
               <li>Degree 0: a constant polynomial, at least passing through the same point.</li>
               <li>Degree 1: I also demand the <b>same slope</b> — that is, the same derivative as level 21·b. It is
                   the tangent line.</li>
               <li>Degree 2: the same <b>curvature</b> too. Degree 3: also how the curvature changes. And so on.</li>
             </ul>
             <div class="callout key">Each extra term forces <b>one more derivative</b> to match. From that demand
             the formula for the coefficients falls out on its own:
             <p class="mb0" style="margin-top:8px">the term of degree k is <b>f⁽ᵏ⁾(0) / k!</b></p></div>
             <p>In the game: pick a curve, raise the degree and watch the yellow polynomial chase the blue one.
             Start with the sine.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'taylor', title: 'Two curves chased down', text: 'get the error below 0.01 across the whole stretch, on two different curves.', xp: 55 });
        el.appendChild(m.root);
        taylorLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>The behaviour is always the same, and it is worth saying out loud: <b>the polynomial starts glued at
              zero and peels away as you move off</b>. Each extra term pushes the peeling point further out, but it
              never removes it.</p>
              <div class="callout key"><b>The thing to take away.</b> «The series converges» is not the useful
              question. The useful question — as it has been for three levels now — is <b>how fast</b>. To cover the
              sine from −7 to 7 with an error below 0.01 you need degree <b>19</b>. To cover it near zero only,
              degree 3 is enough.</div>
              <p class="mb0">Look also at the first term of the sine: it is <b>x</b>. That means for small angles
              <b>sin x ≈ x</b>. Keep it in mind — two sections from now it becomes the heart of the level.</p>`,
    },

    {
      t: 'The wall: where the series stops working',
      html: `<p>Now pick the last curve, <b>1/(1−x)</b>, and push the degree to the maximum. Watch the edges.</p>
             <p>Its series is the simplest of all: <b>1 + x + x² + x³ + …</b> — it is the geometric series from level
             15·b. Inside the green strip it works beautifully. Outside it <b>explodes</b>: adding terms does not
             improve anything, it makes it worse.</p>
             <div class="callout warn"><b>This is not a flaw in the game.</b> With x = 2 the series becomes
             1 + 2 + 4 + 8 + 16 + … which grows without ever stopping, while 1/(1−2) is simply −1. No number of terms
             can make an exploding sum come out at −1.</div>
             <p>That strip is called the <b>radius of convergence</b>, and here it is 1. Every series has one: for
             sine, cosine and the exponential it is infinite — they work everywhere — for this one it is 1.</p>
             <div class="callout key"><b>Why exactly 1?</b> Because at x = 1 the function <b>really does blow up</b>:
             1/(1−1) is a division by zero. A power series cannot get past a point where the function goes mad, not
             even from a distance. Its reach is the distance to the nearest trouble.</div>
             <p class="mb0">This level's tests check it in the most direct way: outside the radius we verify that the
             error <b>grows</b> as the degree rises, and that at degree 40 it is above 100.</p>`,
    },

    {
      t: 'Euler\'s formula, read straight off the page',
      html: `<p>At level M·8 you proved e^(iθ) = cos θ + i·sin θ with a limit: the bank that pays imaginary
             interest. Here is the second proof, and it is the one Euler actually gave in 1748. All it takes is
             writing down three series and looking at them.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'The three series', html: '<b>eˣ</b> = 1 + x + x²/2! + x³/3! + x⁴/4! + …<br><b>cos x</b> = 1 − x²/2! + x⁴/4! − …<br><b>sin x</b> = x − x³/3! + x⁵/5! − …' },
          { h: 'Look at the degrees', html: 'The cosine uses <b>only even powers</b>. The sine <b>only odd ones</b>. The exponential uses them <b>all</b>. It looks like a curiosity: it is the key.' },
          { h: 'Put ix in place of x', html: 'In the exponential series write ix. The term of degree k becomes (ix)^k/k! = i^k · x^k/k!. And i^k goes round in a circle: <b>1, i, −1, −i, 1, i, …</b>' },
          { h: 'Separate', html: 'The <b>even</b> degree terms have i^k = ±1: they are <b>real</b>. The <b>odd</b> ones have i^k = ±i: they are <b>imaginary</b>. The series splits into two halves that never mix.' },
          { h: 'Read the two halves', html: 'The real half is 1 − x²/2! + x⁴/4! − … that is <b>exactly cos x</b>. The imaginary half is i·(x − x³/3! + x⁵/5! − …) that is <b>i·sin x</b>.' },
          { h: 'The formula', html: '<b>e^(ix) = cos x + i·sin x</b>. There is no hidden step: it is the same digits, reordered. And that is why that formula looks like a miracle the first time you see it, and obvious afterwards.' },
          { h: 'In the tests', html: 'This level\'s test does not merely check the total: it verifies that the <b>even half</b> of the series of e^(ix) matches the cosine series term by term, and the odd half the sine series.' },
        ], { doneLabel: 'Now go back!' });
      },
      after: `<div class="callout ok"><b>Two independent proofs of the same formula.</b> At level M·8 by a limit,
              here by a series. That is not redundancy: they are two ways of seeing the same thing, and once you
              have seen two you never forget it.</div>`,
    },

    {
      t: 'And now the punch: Grover\'s √N is a truncated series',
      html: `<p>Here comes the piece that makes this level non-optional in spirit, even if it is optional in
             fact.</p>
             <p>At level M·2 you saw that every Grover turn rotates the arrow by <b>2θ</b>, where</p>
             <div class="formula">θ = arcsin(√(1/N))</div>
             <p>and that the useful turns are the ones that bring the arrow near 90°, that is about <b>(π/4)/θ</b>.
             So far this is exact. Now watch what happens when N is large.</p>
             <div class="callout key">The Taylor series of the arcsine starts with <b>arcsin(u) = u + u³/6 + …</b>
             With u = 1/√N, the second term is a thousand times smaller than the first already for lists of a few
             hundred boxes. So <b>θ ≈ 1/√N</b>, and the turns become <b>(π/4)·√N</b>.</div>
             <p>That is where the √N comes from. It is not a law of nature written down separately: it is
             <b>a Taylor approximation stopped at the first term</b>.</p>
             <p>In the game: move the list length and watch the two curves — sin x and the line x — separate as the
             angle grows, and lie on top of each other when it is small. And compare the turns that actually work
             with the ones the formula predicts.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'piccoli', title: 'Where the approximation holds and where it does not', text: 'find a list where the gap is below 1%, and one where it goes above 4%.', xp: 60 });
        el.appendChild(m.root);
        piccoliAngoliLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>On a list of a million boxes the gap between the true angle and its approximation is <b>less than a
              ten-thousandth</b>. On a list of four boxes it is <b>4.5%</b>, and on a list of two it is
              <b>10%</b>.</p>
              <div class="callout key"><b>And the number of turns?</b> It holds up almost always, because it gets
              rounded to a whole number and rounding forgives. The tests check it on <b>two thousand</b> list
              lengths, comparing the formula (π/4)·√N with the number of turns that really takes the probability
              highest: they agree nearly always, they disagree <b>about a dozen times</b>, and when they do it is
              always by <b>a single turn</b>.</div>
              <p class="mb0">This is the honest way to present an approximation: not «it is equal», but «it is off by
              this much, and it costs you that». The first list where the formula slips is the one with <b>two
              boxes</b> — exactly the case where sin x ≈ x is off by 10%.</p>`,
    },

    {
      t: 'Six hundred years, and the wrong name',
      html: `<p>The history of these series is a textbook case of how names in mathematics record geography rather
             than chronology.</p>
             <p>Around <b>1400</b>, in Kerala, in southern India, <b>Mādhava of Sangamagrāma</b> writes down the
             series for <b>sine</b>, <b>cosine</b> and <b>arctangent</b>. With the last one he computes π to
             <b>thirteen decimal places</b>. He founds a school — the Kerala school — which keeps working on it for
             two centuries.</p>
             <div class="callout key">They are the same series the game draws. Newton rediscovers them in
             <b>1669</b>, James Gregory rediscovers the arctangent one in <b>1671</b>, Leibniz in <b>1673</b> — and
             indeed that series is called «Gregory's series» today. Two hundred and fifty, three hundred years
             later.</div>
             <p><b>Brook Taylor</b>, English, states the general theorem in <b>1712</b> and publishes it in
             <b>1715</b> in <i>Methodus incrementorum directa et inversa</i>. The book goes almost unnoticed: only in
             <b>1772</b> does <b>Lagrange</b> call it «the basic principle of differential calculus», and from then
             on the name sticks.</p>
             <p><b>Euler</b>, in <b>1748</b>, uses series with an abandon that would make anyone shudder today — he
             sums them, reorders them, multiplies them as if they were finite polynomials — and pulls
             e^(ix) = cos x + i·sin x out of them. He was right, but permission to make those moves would only
             arrive a century later, with the nineteenth-century fussiness you met at level M·8.</p>
             <div class="callout warn"><b>One last warning, and it is not theoretical.</b> In the nineteenth century
             <b>Cauchy</b> found a function to which something unpleasant happens: all of its derivatives at zero are
             zero, so its Taylor series is <b>all zeros</b> — and yet the function is not zero. The series converges
             beautifully, and converges to the wrong thing. That is why «the series exists» and «the series rebuilds
             the function» are two different statements, and the second has to be proved.</div>`,
    },

    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game, on the sine, raise the degree one at a time: 1, 3, 5, 7. What happens at even
           degrees? <span class="muted">(nothing: the sine has only odd powers, and the even terms are zero)</span></p>
        <p><b>2.</b> Still on the sine, at degree 3, how far does the copy hold by eye?
           <span class="muted">(to about x = 1, that is 57°: which is why «small angle» in physics means roughly up
           to there)</span></p>
        <p><b>3.</b> Pick 1/(1−x) and try x = 2 in your head: what is the function, and what is the sum
           1+2+4+8+…? <span class="muted">(−1 against infinity: that is why outside the radius there is no
           hope)</span></p>
        <p><b>4.</b> In the second game take the list to 2^20. How many turns are needed, and how long would an
           ordinary search take? <span class="muted">(804 turns against half a million tries on average)</span></p>
        <p class="mb0"><b>5.</b> Inventor mode: in the second game go down to short lists and see when the «best
           turns» and the formula part ways. <span class="muted">(on the list of 2: the formula says 1 turn, the real
           peak is at 0 — the only case where the approximation genuinely costs something)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What is the Taylor polynomial of a function at a point?', options: ['a function that resembles it everywhere', 'the polynomial that at that point has the same value, the same slope, the same curvature, and so on', 'its derivative', 'the line that cuts it in two points'], correct: 1,
      why: 'Each extra term forces one more derivative to match, and out of that demand comes the coefficient formula f⁽ᵏ⁾(0)/k!. That is why the copy is perfect at the point and gets worse as you move away.' },
    { q: 'Why does the series for 1/(1−x) not work at x = 2?', options: ['because 2 is too big', 'because the sum 1+2+4+8+… explodes while the function is −1: outside the radius of convergence no number of terms is enough', 'because the odd terms are missing', 'because the computer cannot manage it'], correct: 1,
      why: 'The radius of convergence is 1, and it is the distance to the point where the function really goes mad: x = 1, a division by zero. A power series cannot get past that trouble.' },
    { q: 'How do you read Euler\'s formula off the series?', options: ['you add cos and sin', 'you put ix into the series for eˣ: the even terms stay real and make cos x, the odd ones become imaginary and make i·sin x', 'you differentiate twice', 'you use Pythagoras'], correct: 1,
      why: 'i^k goes round in a circle — 1, i, −1, −i — so the series splits into two halves that never mix, and those halves are exactly the cosine and sine series. It is Euler\'s 1748 proof.' },
    { q: 'Where does the √N in Grover\'s number of turns come from?', options: ['from a law of quantum physics', 'from sin x ≈ x: the angle arcsin(√(1/N)) is about 1/√N, and the turns are about (π/4)/θ', 'from the number of qubits', 'from the Fourier transform'], correct: 1,
      why: 'It is a Taylor series stopped at the first term. The most famous quantum advantage in this course comes out of the most common approximation in physics.' },
    { q: 'How reliable is the formula (π/4)·√N for the number of turns?', options: ['always exact', 'nearly always right: over two thousand list lengths it is wrong about a dozen times, and always by a single turn', 'wrong nearly always', 'right only for small lists'], correct: 1,
      why: 'Rounding to a whole number forgives almost all of the approximation error. The first list where it slips is the one with two boxes, where sin x ≈ x is off by 10%.' },
    { q: 'Who first wrote down the series for sine and cosine?', options: ['Brook Taylor in 1715', 'Mādhava of Sangamagrāma in Kerala, around 1400 — two and a half centuries before Newton rediscovered them', 'Euler in 1748', 'Newton in 1669'], correct: 1,
      why: 'With the arctangent series Mādhava computed π to thirteen decimal places. Newton rediscovered them in 1669 and Gregory in 1671: that series carries Gregory\'s name today.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> Any curve, seen from close up, is a polynomial — and each extra term
          widens the «close up». Three things come out of this: how a computer actually computes the sine, the second
          proof of Euler's formula (the first, by a limit, was at level M·8) and Grover's √N, which is the arcsine
          series stopped at the first term. Plus a warning: every series has a radius, and outside it adding terms
          makes things worse.</div>`,
});
@endsection
