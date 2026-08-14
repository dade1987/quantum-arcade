@php($description = 'Integrals taught by playing: area as a limit of rectangles (and why cutting them at the midpoint makes the error fall like 1/n² instead of 1/n), the fundamental theorem of calculus seen with a speedometer and an odometer, the logarithm as the area under 1/x, and the probability that adds up to 1 for a particle in a box.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { areaLab, teoremaLab } from '/js/widgets/integrali.js';

const L = renderLesson({
  id: 'm9-integrali',
  lead: `At level 21·b you played with the <b>derivative</b>: how much something changes. Here is the other half of
         analysis, which asks the opposite question: <b>if I know how much something changes at every instant, how
         much has it changed in total?</b> The answer is an area, it is computed with rectangles — that is, with a
         limit, the one from level M·8 — and then comes the twist: there is a shortcut that makes the rectangles
         unnecessary, and it is the most important theorem you will meet in this course.`,

  steps: [
    {
      t: 'Area, one rectangle at a time',
      html: `<p>The problem is old: <b>how much area is there under a curve?</b> Under a straight line it is easy,
             it is a triangle. Under a parabola it is not.</p>
             <p>The idea that works is crude and brilliant: if I cannot measure curved stuff, I cover it with
             <b>rectangles</b>, which I can measure. I put down n of them, each (b−a)/n wide, as tall as the curve.
             I add them up. Then I put down more.</p>
             <div class="callout key">This is the level M·8 game again: the sum of the rectangles is a
             <b>sequence</b>, and the area is the number it tends to. «The integral exists» means exactly «that
             sequence has a limit».</div>
             <p>In the game there is one more thing to try, and it is not a detail: where you cut the rectangle. At
             the left edge, at the right one, or <b>at the midpoint</b>. Try all three with the same number of
             rectangles.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'area', title: 'Two accurate areas', text: 'get the error below 0.001 on two different functions.', xp: 50 });
        el.appendChild(m.root);
        areaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>If you tried the three cuts you will have seen an enormous difference. At the edges the error falls
              like <b>1/n</b>: double the rectangles, halve the error. At the midpoint it falls like <b>1/n²</b>:
              double the rectangles and the error is divided by <b>four</b>.</p>
              <div class="callout key"><b>Why the midpoint is so much better.</b> Cutting at the edge, the rectangle
              always errs in the same direction: if the curve rises, it stays entirely below. Cutting in the middle,
              above the midpoint the curve is above the rectangle and below it is under: the two errors <b>eat each
              other</b>. What is left is far less.</div>
              <p>In this level's tests the exponent is not told, it is measured. The rectangles are doubled and we
              check what the error gets divided by — 2 at the edge, 4 at the midpoint — on three different
              functions.</p>
              <p class="mb0">And there is one last thing to see: take the left sum and the right sum on a rising
              function. The first is <b>always below</b> the true value, the second <b>always above</b>. The truth is
              trapped in between, and as the rectangles narrow the two close in and squeeze it. This is Archimedes'
              <b>method of exhaustion</b>, and it is 2,200 years old.</p>`,
    },

    {
      t: 'The twist: you do not need a single rectangle',
      html: `<p>Now the thing that changes everything, and which is worth presenting in the right order — because
             seeing it coming has a certain effect.</p>
             <p>Imagine you are in a car. There are two instruments on the dashboard:</p>
             <ul>
               <li>the <b>speedometer</b>, which says how fast you are going <b>right now</b>;</li>
               <li>the <b>odometer</b>, which says how far you have gone <b>in total</b>.</li>
             </ul>
             <p>The distance covered is the <b>area under the speed curve</b>: if you go at 100 km/h for half an
             hour you cover 50 km, which is the area of a rectangle 100 tall and 0.5 wide. If the speed changes, the
             area is under a curve — and that is an integral.</p>
             <div class="callout key">Now the question the other way round: looking only at the <b>odometer</b>, can
             you tell what the speedometer reads? Yes: it is the <b>rate at which the odometer changes</b>, that is
             its slope. Which is the derivative from level 21·b.</div>
             <p>In the game the two instruments sit one above the other. Move the cursor and watch the yellow
             number: the height of the upper curve and the slope of the tangent below are <b>the same number</b>, at
             every point.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'teorema', title: 'The steepest point and the flat one', text: 'find where the distance grows fastest, and where it stops.', xp: 55 });
        el.appendChild(m.root);
        teoremaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<div class="formula">if A(t) is the area accumulated up to t, then <b>A′(t) = f(t)</b></div>
              <p>This is the <b>fundamental theorem of calculus</b>, and the name is not an exaggeration. It says
              that <b>differentiating and integrating are inverse operations</b>, like multiplying and dividing. And
              it gives the shortcut:</p>
              <div class="formula">area from a to b = <b>F(b) − F(a)</b>, with F a function whose derivative is f</div>
              <p>That is: do not count rectangles. Find a function whose derivative gives the original one — it is
              called an <b>antiderivative</b> — and look at how much it has grown between the two ends. The area
              under x² from 0 to 1 is 1³/3 − 0³/3 = <b>1/3</b>, and you added nothing up.</p>
              <div class="callout ok"><b>The calculation the rectangles did in ten thousand steps, the antiderivative
              does in two subtractions.</b> Which is why school spends months on finding antiderivatives: they are
              the key that opens every area.</div>`,
    },

    {
      t: 'Two areas that already have a name',
      html: `<p>Two integrals that matter more than the others in this course, because they are things you have
             already met coming from a different direction.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'The logarithm, again', html: 'At level 0·8 the logarithm arrived as «the exponent you need»: log₂ 8 = 3 because 2³ = 8. There is another way to define it, and it goes through an area.' },
          { h: 'The area under 1/x', html: 'Take the curve <b>1/x</b> and measure the area from 1 up to t. That number <b>is</b> ln t, the natural logarithm. It does not resemble it: it is equal, and this level\'s tests check it on a hundred values of t.' },
          { h: 'Why e is «natural»', html: 'That area is exactly <b>1</b> when t = <b>e</b> = 2.718… That is why that base is called natural: it is the point where the area under 1/x makes one. You can check it in the game: pick 1/x and look at the true value.' },
          { h: 'The probability that adds up to 1', html: 'In this course you have repeated a thousand times that «the squares of the amplitudes add up to 1». That holds when the possibilities are countable. If a particle can be at <b>any point</b> of a segment, the sum becomes an <b>integral</b>.' },
          { h: 'The particle in a box', html: 'The fourth curve in the game is <b>2·sin²(πx)</b>: it is |ψ|² of the lowest state of a particle shut in a box between 0 and 1. It says where it is likely to be found: never against the walls, most likely in the middle.' },
          { h: 'And its area is exactly 1', html: 'Not by luck: that 2 in front is there <b>on purpose</b>. Without it the area would be 1/2 and the function would describe no probability at all. It is called <b>normalisation</b>, and it is the first thing done to a wave function as soon as it is written down.' },
          { h: 'The expected value', html: 'The mean from level M·7 becomes an integral too: instead of summing value × probability over every case, you integrate x·|ψ(x)|² over the whole segment. For the particle in a box it comes out 1/2, the centre — which is where you would expect it.' },
        ], { doneLabel: 'Now go back!' });
      },
      after: `<div class="callout ok"><b>Take away:</b> the integral is not one more tool, it is how «adding up lots
              of small things» stops being a manner of speaking and becomes a number. Every time physics says «the
              total probability is 1» or «the average energy is», one of these is underneath.</div>`,
    },

    {
      t: 'Two thousand years for one long S',
      html: `<p><b>Archimedes</b>, in the 3rd century BC, computes the area of a parabolic segment and finds it is
             <b>4/3</b> of the inscribed triangle. He gets there by adding up infinitely many ever smaller triangles
             and squeezing the result between two values: the <b>method of exhaustion</b>, which is exactly what you
             just played with rectangles. All he lacked was the word «limit» — and he would have needed it, but it
             did not exist.</p>
             <p>1,800 years go by. In <b>1635</b> <b>Bonaventura Cavalieri</b>, a Jesuat friar from Milan and a pupil
             of Galileo, publishes his <i>Geometry of Indivisibles</i>: he imagines a surface as made of infinitely
             many lines set side by side, and a solid as made of infinitely many surfaces. It is a way of reasoning
             that made purists wince even then — lines have zero thickness, how can they make an area? — but the
             results are right, and his principle is still taught today.</p>
             <div class="callout key"><b>On 29 October 1675</b> <b>Leibniz</b>, in a manuscript he would never
             publish, writes the symbol <b>∫</b> for the first time. It is not a squiggle: it is a <b>long S</b>, the
             initial of <i>summa</i>. Before that he wrote <i>omn.</i>, for <i>omnia</i>, «all». That sign says,
             literally, «sum of all the little pieces» — and for 350 years it has been sitting there reminding us
             that an integral is a sum.</div>
             <p>Newton and Leibniz, each on his own, also grasp the big piece: that this sum is the inverse of the
             derivative. It is the theorem you just played. What follows is one of the most poisonous priority
             disputes in the history of science — with the Royal Society appointing a committee of inquiry whose
             report, it later emerged, had been written by Newton himself.</p>
             <p class="mb0">The clean definition is still missing, and it arrives with the fussy nineteenth century:
             in <b>1854</b> <b>Bernhard Riemann</b>, in the dissertation for his teaching qualification at Göttingen,
             writes for the first time what it means <b>exactly</b> for a function to «have an integral» — with sums
             of rectangles, the limit, and the condition for that limit to exist. Two thousand years after
             Archimedes, and a hundred and eighty after Leibniz's S.</p>`,
    },

    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game put 10 rectangles on x² and try the three cuts. Which error is smallest, and
           by how much? <span class="muted">(the midpoint is nearly sixty times more accurate)</span></p>
        <p><b>2.</b> Still on x², how many rectangles do you need for an error below 0.001 cutting at the edge? And
           cutting at the midpoint? <span class="muted">(500 against 10)</span></p>
        <p><b>3.</b> Pick 1/x and look at the true value of the area from 1 to e. <span class="muted">(it is 1: that
           is ln e, and it is why e is the «natural» base)</span></p>
        <p><b>4.</b> In the second game pick 2·sin²(πx) and move the cursor to 50%. What does the odometer read?
           <span class="muted">(0.5: half the probability is in the left half of the box, as symmetry demands)</span></p>
        <p class="mb0"><b>5.</b> Inventor mode: in the second game pick sin x and move the cursor to 100%. Does the
           tangent go flat or steep? <span class="muted">(flat: at the end sin π = 0, the speed is zero and the
           odometer stops rising — even though it has already covered 2)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What is an integral, in one line?', options: ['its slope', 'the area under its curve, that is the limit of sums of ever narrower rectangles', 'its maximum value', 'its inverse'], correct: 1,
      why: 'It is a sum of infinitely many small pieces, and «sum of infinitely many pieces» only makes sense as a limit — the one from level M·8. The symbol ∫ is a long S precisely for «summa».' },
    { q: 'Why is cutting the rectangles at the midpoint so much more accurate?', options: ['because the rectangles are wider', 'because above the midpoint the curve is above the rectangle and below it is under: the two errors cancel', 'because the calculation is faster', 'it is not more accurate, only more elegant'], correct: 1,
      why: 'At the edge the error always goes the same way and falls like 1/n; at the midpoint it largely cancels and falls like 1/n². Doubling the rectangles divides the error by four instead of two.' },
    { q: 'What does the fundamental theorem of calculus say?', options: ['that every function has an area', 'that the derivative of the accumulated area is the original function: differentiating and integrating are inverse operations', 'that the area is always positive', 'that rectangles are always enough'], correct: 1,
      why: 'It is the speedometer and the odometer: the distance grows at the speed the speedometer reads. From there comes the shortcut F(b) − F(a), which makes counting rectangles unnecessary.' },
    { q: 'What is the area under 1/x from 1 to t?', options: ['a function with no name', 'the natural logarithm of t', 'the square root of t', 't squared'], correct: 1,
      why: 'It is the other definition of the logarithm, and it agrees with the one from level 0·8. It equals 1 exactly when t = e — which is why that base is called natural.' },
    { q: 'Why does the curve 2·sin²(πx) have that 2 in front?', options: ['to make it taller', 'because without it the area would be 1/2 and it would not be a probability: the total probability must be 1', 'to make the calculation harder', 'by historical convention'], correct: 1,
      why: 'It is called normalisation and it is the first thing done to a wave function. It is the continuous version of «the squares of the amplitudes add up to 1», with an integral in place of the sum.' },
    { q: 'Who first wrote the symbol ∫, and why does it have that shape?', options: ['Newton, and it is an I for «infinity»', 'Leibniz in 1675, and it is a long S for «summa»', 'Archimedes, and it is a spiral', 'Riemann, and it is a stylised R'], correct: 1,
      why: 'Before that, Leibniz wrote omn. for omnia, «all». The sign says literally «sum of all the little pieces», and for 350 years it has been reminding us what an integral really is.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> The integral is the sum of the little pieces, and like every infinite
          sum it only exists as a limit. Rectangles compute it, but the fundamental theorem gives it away:
          differentiating and integrating are inverses, so an antiderivative and two subtractions are enough. And
          along the way two things the course had been using for a while fell into place: the logarithm is an area,
          and «the total probability is 1» is an integral you can work out by hand.</div>`,
});
@endsection
