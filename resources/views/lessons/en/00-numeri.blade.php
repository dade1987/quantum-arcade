@php($description = 'Negative numbers, doubles and halves, fractions and percentages, powers of 2 and square roots: the maths basics for quantum computing, explained by playing.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { numberLine, percentLab, squareRootLab, powersLab } from '/js/widgets/basicmath.js';

const L = renderLesson({
  id: '00-numeri',
  lead: `Four games on the basics: negative numbers, fractions and percentages, squares and roots, powers of 2.
         You will need them for the whole rest of the course.`,

  steps: [
    {
      t: 'Numbers above and below zero',
      html: `<p>The <b>number line</b> has zero in the middle: positive numbers on the right, <b>negative</b> ones on the left.</p>
             <p><b>Example:</b> a thermometer. +5° and −5° are both 5 degrees away from zero, but on opposite sides.</p>
             <p>Multiplying by <b>−1</b> changes the side but not the distance from zero: 3 → −3, −7 → 7.</p>
             <p>In the game you have five moves: +1, −1, ×2 (double), ÷2 (half), ×(−1) (change side).
             Reach the target in as few moves as possible.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'linea', title: 'Target practice', text: 'reach a target on the number line.', xp: 20 });
        el.appendChild(m.root);
        numberLine(el, { onWin: () => m.complete() });
      },
    },
    {
      t: 'From 3/4 to 0.75 to 75%',
      html: `<p>A <b>fraction</b> like 3/4 means: split into 4 equal parts and take 3 of them.</p>
             <p><b>From fraction to decimal:</b> do the division. 3/4 = 3 ÷ 4 = 0.75.<br>
             <i>Example:</i> 3 euros shared among 4 people is 0.75 € each, that is 75 cents.</p>
             <p><b>From decimal to percentage:</b> multiply by 100. 0.75 × 100 = 75 → <b>75%</b>.<br>
             "Percent" means "per hundred": 75% = 75 parts out of 100.</p>
             <p><i>Example:</i> a pizza cut into 4 slices. You eat 3: 3/4 = 0.75 = 75% of the pizza.</p>
             <table class="table">
               <tr><th>Fraction</th><th>Decimal</th><th>Percentage</th><th>In words</th></tr>
               <tr><td class="mono">1/2</td><td class="mono">0.5</td><td class="mono">50%</td><td>half</td></tr>
               <tr><td class="mono">1/4</td><td class="mono">0.25</td><td class="mono">25%</td><td>a quarter</td></tr>
               <tr><td class="mono">3/4</td><td class="mono">0.75</td><td class="mono">75%</td><td>three quarters</td></tr>
               <tr><td class="mono">1/1</td><td class="mono">1</td><td class="mono">100%</td><td>all of it</td></tr>
             </table>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'perc', title: 'The precise pastry chef', text: 'hit two different targets with the slider.', xp: 20 });
        el.appendChild(m.root);
        percentLab(el, { onWin: () => m.complete() });
      },
    },
    {
      t: 'Square and square root',
      html: `<p><b>Squaring</b> a number means multiplying it by itself: 3² = 3 × 3 = 9.</p>
             <p>The <b>square root</b> does the opposite: you look for the number that, multiplied by itself, gives the one you started with.</p>
             <p><b>How to work it out: by trial and error.</b></p>
             <ul>
               <li>√16: 3 × 3 = 9 is too little, 4 × 4 = 16 is right → <b>√16 = 4</b>.</li>
               <li>√20: 4 × 4 = 16 is too little, 5 × 5 = 25 is too much, so it is between 4 and 5. Try 4.5 × 4.5 = 20.25: almost. √20 ≈ 4.47.</li>
               <li>On a calculator, just press the <b>√</b> key.</li>
             </ul>
             <p><i>Example:</i> a square room of 16 m² has sides 4 m long, because 4 × 4 = 16.</p>
             <div class="callout warn"><p><b>Why 0.5 × 0.5 is 0.25.</b> Multiplying by 0.5 means <b>taking half</b>.
             So 0.5 × 0.5 = half of 0.5 = <b>0.25</b>.</p>
             <ul>
               <li><i>Pizza:</i> half of half a pizza = a quarter of a pizza.</li>
               <li><i>Money:</i> half of 50 cents = 25 cents.</li>
             </ul>
             <p>In general, multiplying by a number smaller than 1 means taking only part of something, so the result gets smaller.</p>
             <p><b>How to do the sum:</b> multiply without the decimal points (5 × 5 = 25). Then count the digits after the point
             in the two numbers (1 + 1 = 2) and put 2 in the result too: <b>0.25</b>.<br>
             <i>Another example:</i> 0.3 × 0.3 → 3 × 3 = 9 → two digits after the point → <b>0.09</b>.</p></div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'radice', title: 'The right side', text: 'find the side that produces a given area (that is, compute a square root).', xp: 25 });
        el.appendChild(m.root);
        squareRootLab(el, { onWin: () => m.complete() });
      },
    },
    {
      t: 'The powers of 2',
      html: `<p><b>2^n</b> means: multiply 2 by itself n times. 2³ = 2 × 2 × 2 = 8.</p>
             <p>Every time n goes up by 1, you multiply by 2 one more time, so the result doubles:</p>
             <table class="table">
               <tr><th>n</th><td class="mono">1</td><td class="mono">2</td><td class="mono">3</td><td class="mono">4</td><td class="mono">5</td><td class="mono">6</td><td class="mono">7</td><td class="mono">8</td><td class="mono">9</td><td class="mono">10</td></tr>
               <tr><th>2^n</th><td class="mono">2</td><td class="mono">4</td><td class="mono">8</td><td class="mono">16</td><td class="mono">32</td><td class="mono">64</td><td class="mono">128</td><td class="mono">256</td><td class="mono">512</td><td class="mono"><b>1,024</b></td></tr>
             </table>
             <p><b>n = 10 → about a thousand:</b> 10 doublings take you to 1,024, which is about 1,000.</p>
             <p><b>n = 20 → about a million:</b> 10 more doublings multiply by 1,024 again, which is about 1,000.
             So 1,000 × 1,000 = <b>1,000,000</b>. The exact value is 1,048,576.</p>
             <p><i>Example:</i> the chessboard legend. 1 grain of rice on the first square, 2 on the second, 4 on the third,
             doubling every time. By the 64th square you would need more grains than exist on Earth.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'pow', title: 'All the way to a million', text: 'take the slider to n = 20 and look at how many values that becomes.', xp: 20 });
        el.appendChild(m.root);
        powersLab(el, { onWin: () => m.complete() });
      },
    },
    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> In the number line game: starting from 1, what is the smallest number of moves to reach −8?</p>
        <p><b>2.</b> What is the side of a square with area 0.49? And with area 1?</p>
        <p><b>3.</b> How many times do you have to double 1 to go past 1,000? And to go past 1,000,000?</p>
        <p class="mb0"><b>4.</b> Is 0.3 × 0.3 bigger or smaller than 0.3?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What is 0.5 × 0.5?', options: ['1', '0.25', '0.5', '2.5'], correct: 1,
      why: 'Multiplying by 0.5 means taking half: half of 0.5 is 0.25.' },
    { q: 'Which percentage is 3/4?', options: ['34%', '43%', '75%', '30%'], correct: 2,
      why: '3 ÷ 4 = 0.75, and 0.75 × 100 = 75, that is 75 out of 100 = 75%.' },
    { q: 'What is 2⁵?', options: ['10', '25', '32', '64'], correct: 2,
      why: '2 × 2 × 2 × 2 × 2 = 32.' },
    { q: 'What does multiplying a number by −1 do?', options: ['halves it', 'cancels it', 'sends it to the opposite side of zero', 'squares it'], correct: 2,
      why: 'It changes the side, not the distance from zero: 5 becomes −5.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> In the next level: <b>coordinates</b> (where a point is)
          and <b>degrees</b> (how far something is turned).</div>`,
});
@endsection
