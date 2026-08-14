@php($description = 'Clock arithmetic played, not preached: the remainder (mod), the greatest common divisor with Euclid\'s method, the period of a^x mod N and continued fractions. The classical maths that sits inside Shor\'s algorithm.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { clockLab, euclidLab, periodLab } from '/js/widgets/modmath.js';

const L = renderLesson({
  id: '00-orologio',
  lead: `This level teaches three things you already half know: <b>counting in laps</b> (like a clock),
         <b>finding the piece that fits exactly into two different lengths</b> (the greatest common divisor) and
         <b>noticing that a rhythm repeats</b>. Middle-school stuff — and the three tools that take apart the most
         famous algorithm in this course, the one that in theory breaks the passwords of half the Internet. Shor has
         exactly one hard part; everything else is in here.`,

  steps: [
    {
      t: 'Counting in laps: the remainder',
      html: `<p>It is <b>10</b> o'clock. What time will it be in <b>5</b> hours? <b>3</b> o'clock. Not 15: you counted
             past the end of the dial, went by the 12 and started again.</p>
             <p>This way of counting has a name and a symbol:</p>
             <div class="formula">15 mod 12 = <span class="hl-n">3</span></div>
             <p>"mod" is short for "modulo" and means exactly one thing: <b>take the remainder of the division</b>.
             15 divided by 12 is 1 remainder 3, and the remainder is where the hand stops.</p>
             <div class="callout key">A dial can have as many hours as we like. With 7 hours:
             <b>17 mod 7 = 3</b>, because 17 = 2×7 + 3 — two whole laps, then three steps.</div>
             <p>In the game below, move the number and watch the spiral: <b>every lap drawn is a real lap</b>.
             What is left over when you get there is the remainder.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'orologio', title: 'Three roads, same hour', text: 'stop the hand on the target with 3 different numbers.', xp: 30 });
        el.appendChild(m.root);
        clockLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>You will have noticed the important part: you can reach the target with <b>many different numbers</b>.
              On a 7-hour dial, 3, 10, 17, 24, 31… all land on the same hour, exactly 7 apart.</p>
              <div class="callout key">As far as the clock is concerned those numbers are <b>the same thing</b>. This is
              the idea Gauss wrote down in 1801, and it is what cryptography stands on today: when you work "mod N"
              there are not infinitely many numbers, there are exactly <b>N</b>.</div>`,
    },

    {
      t: "Euclid's floor: the greatest common divisor",
      html: `<p>You have a room <b>48</b> wide and <b>18</b> deep, and you want to tile it with <b>identical square
             tiles</b>, without cutting a single one. How big can the tile be?</p>
             <p>The largest possible side is the <b>greatest common divisor</b> of 48 and 18. Without the formula:
             <b>the longest ruler that fits a whole number of times into both sides</b>.</p>
             <p>There is a way to find it that does not involve trying numbers one by one, and it is about 2300 years
             old — it is in Euclid's <i>Elements</i>. In the game you do it by hand:</p>
             <ol>
               <li>cut out the <b>largest square that fits</b>;</li>
               <li>look at the rectangle left over;</li>
               <li>start again with that one.</li>
             </ol>
             <p>The side of the <b>last</b> square — the one after which nothing is left — is the answer.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'euclide', title: 'Tile it without cutting', text: 'finish two different floors.', xp: 30 });
        el.appendChild(m.root);
        euclidLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Written in numbers, the 48 × 18 floor says this:</p>
              <div class="formula mono">48 = 2×18 + 12 &nbsp;·&nbsp; 18 = 1×12 + 6 &nbsp;·&nbsp; 12 = 2×6 + <span class="hl-n">0</span></div>
              <p>As soon as the remainder is zero, the number you were dividing by is the greatest common divisor: <b>6</b>.</p>
              <div class="callout key"><b>Why it is so fast:</b> at every step the larger number shrinks quickly, and in
              1844 Gabriel Lamé proved the steps never exceed five times the number of digits. On 600-digit numbers that
              is a few thousand operations: the blink of an eye. Keep it in mind, because two steps from now it is
              exactly what matters: <b>the last piece of Shor is free</b>.</div>`,
    },

    {
      t: 'The rhythm that comes back: the period',
      html: `<p>Now let us put the two together. Take a <b>15</b>-hour dial, start at <b>1</b> and always make the same
             move: <b>multiply by 7 and take the remainder</b>.</p>
             <div class="formula mono">1 → 7 → 4 → 13 → <span class="hl-n">1</span> → 7 → 4 → 13 → 1 …</div>
             <p>After <b>4</b> steps you are back where you started, and from there the sequence repeats identically
             for ever. That number of steps is called the <b>period</b>, written <b>r</b>.</p>
             <p>In the game the walk draws itself: every multiplication is a chord across the dial, and when you pass
             the 1 again <b>the figure closes</b>. Look at the star that comes out: that is the rhythm.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'periodo', title: 'Close two stars', text: 'find the period for two different (N, a) pairs.', xp: 40 });
        el.appendChild(m.root);
        periodLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Two questions come naturally, and both have answers:</p>
              <p><b>Do you always get back to 1?</b> Yes, as long as the multiplier shares no factor with the dial —
              that is, as long as their greatest common divisor is 1. This is Euler's theorem (1763), and it is why the
              game only lets you pick certain multipliers: with the others the star would never close.</p>
              <p><b>And on big numbers?</b> This is where it all falls apart. On a 15-hour dial you can see the rhythm
              by eye; on a dial with 600 digits not even every computer on the planet, running for years, can find it —
              the steps to try outnumber the grains of sand in the universe.</p>
              <div class="callout key"><b>And that is the whole point:</b> factoring a number — splitting it into its
              prime factors, which is what protects RSA keys — is equivalent to finding this rhythm. A quantum computer
              does not try the steps one by one: it puts them <b>all in superposition</b> and then uses the Fourier
              transform to make the rhythm surface. The rest — greatest common divisor included — is the maths you have
              just played.</div>`,
    },

    {
      t: 'One last tool: the simplest fraction',
      html: `<p>One piece is missing, and it is worth seeing now, while it is easy. At the end, the quantum computer
             does not hand you the period: it hands you a <b>measured number</b> that looks a lot like it. Something
             like <b>0.3337</b>. The period has to be recovered from that.</p>
             <p>So the question becomes: <b>what is the simplest fraction very close to this number?</b> The method that
             answers it is called <b>continued fractions</b> and is, once again, Euclid in disguise.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'The measured number', html: 'The machine measured <b>0.3337</b>. We know it is close to k/r, where r is the period we want — but we know neither k nor r.' },
          { h: 'First step', html: '0.3337 is smaller than 1: the integer part is <b>0</b>. We keep 0.3337 and flip it over: <b>1 / 0.3337 ≈ 2.9967</b>.' },
          { h: 'Second step', html: 'The integer part of 2.9967 is <b>2</b>… but 0.9967 is left over, which is almost 1. Flip again: <b>1 / 0.9967 ≈ 1.0033</b>, integer part <b>1</b>.' },
          { h: 'Putting it back together', html: 'Reassembling the pieces (0; 2, 1) gives the fraction <b>1/3</b>. And indeed 1/3 = 0.3333…, a hair away from 0.3337.' },
          { h: 'The answer', html: 'The denominator is <b>3</b>: <b>the period is r = 3</b>. That is the leap: from one dirty decimal, measured once, back to an exact integer.' },
          { h: 'Why rounding is not enough', html: 'Because 0.3337 also looks like 3337/10000, a perfectly valid and completely useless fraction. Continued fractions look for the <b>simplest</b> one, the one with the smallest denominator: it is the only one that can be a period.' },
        ], { doneLabel: 'Got it!' });
      },
      after: `<div class="callout ok">You now hold <b>all</b> the classical pieces of Shor's algorithm: the remainder,
              the period, continued fractions and the greatest common divisor. When you get there, the only genuinely
              new thing will be the quantum part — and it is one thing, taking up three lines of the circuit.</div>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> On a 12-hour dial, which numbers between 0 and 50 land on <b>7</b>? What is the gap between one
           number in that list and the next?</p>
        <p><b>2.</b> In Euclid's floor, try <b>21 × 13</b>. What side does the last tile have? What does that say about
           those two numbers? <span class="muted">(hint: they are called "coprime")</span></p>
        <p><b>3.</b> On the 15-hour dial, what rhythm does multiplier 4 give? And 14? One of the two has period <b>2</b>:
           does such a short period help or hurt someone trying to factor?</p>
        <p class="mb0"><b>4.</b> Inventor's question: why does the game not let you pick multiplier <b>3</b> on a 15-hour
           dial? Try to imagine what would happen to the walk.
           <span class="muted">(and if you get there: that "failure" is actually a stroke of luck, because it hands you
           a factor of 15 straight away)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What does "17 mod 5" mean?', options: ['17 multiplied by 5', 'the remainder of dividing 17 by 5', '17 to the power of 5', 'half of 17'], correct: 1,
      why: '17 = 3×5 + 2, so 17 mod 5 = 2. It is where the hand stops on a 5-hour dial.' },
    { q: 'On a 7-hour dial, which of these land on the same hour?', options: ['3 and 5', '4 and 14', '10 and 17', '6 and 8'], correct: 2,
      why: '10 and 17 are 7 apart, one exact lap: 10 mod 7 = 3 and 17 mod 7 = 3. Numbers landing on the same hour are always a multiple of N apart.' },
    { q: "In Euclid's tiling method, what does the last square cut out represent?", options: ['the smaller of the two numbers', 'the greatest common divisor', 'half the rectangle', 'a prime number'], correct: 1,
      why: 'The side of the last square fits a whole number of times into both starting sides, and it is the largest that does: that is the definition of greatest common divisor.' },
    { q: 'What is the "period r" of the sequence 1, 7, 4, 13, 1, 7, 4, 13, …?', options: ['the largest number in the sequence', 'how many steps it takes to get back to 1', 'the sum of the numbers', 'the final remainder'], correct: 1,
      why: 'After 4 steps you are back on 1 and everything restarts: r = 4. Finding this number is the only point where Shor needs a quantum computer.' },
    { q: 'Why must the multiplier have greatest common divisor 1 with the dial?', options: ['to make the game harder', 'otherwise the walk never returns to 1', 'to make the percentages add up', 'it need not: any number works'], correct: 1,
      why: 'If they share a factor, the powers stay trapped in the multiples of that factor and never pass through 1: no period to find. In Shor, though, discovering this is lucky: that shared factor is already a factor of N.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> Counting in laps, Euclid's floor, the rhythm that comes back and the
          simplest fraction: four classical tools, no formula handed down from above. When you reach Shor's algorithm
          you will not have to learn them there, in a hurry, along with everything else — you will recognise them.</div>`,
});
@endsection
