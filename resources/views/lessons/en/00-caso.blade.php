@php($description = 'Probability with coins and dice: the law of large numbers, independent events, and why every quantum measurement needs thousands of shots.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { diceLab } from '/js/widgets/basicmath.js';

const L = renderLesson({
  id: '00-caso',
  lead: `Coins and dice: we learn how to say how likely something is to happen, and why chance, over many tosses, becomes predictable.`,

  steps: [
    {
      t: 'Probability = how many times out of how many',
      html: `<p>You toss a coin: two possibilities, heads or tails. Neither is favoured, so each has probability
             <b>1 in 2</b> = 1/2 = 0.5 = <b>50%</b> (the three notations from level 0·1!).</p>
             <p>You roll a die: six faces, each <b>1 in 6</b> ≈ 0.167 ≈ <b>16.7%</b>.</p>
             <div class="callout key"><b>A rule that always holds:</b> adding up the probabilities of all the possibilities
             must give <b>1</b> (that is, 100%). If you get more or less, you have forgotten a case or counted one twice.</div>
             <p><b>But watch out for the most common misunderstanding:</b> "50%" does not mean that in 10 tosses you get exactly
             5 heads. It means that <b>the more tosses you make</b>, the closer the proportion gets to a half. Try it:</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'lanci', title: 'A thousand tosses', text: 'make at least 1000 tosses and watch the bars settle onto the theoretical line.', xp: 30 });
        el.appendChild(m.root);
        diceLab(el, { onWin: () => m.complete() });
      },
      after: `<p class="dim small">This phenomenon is called the <b>law of large numbers</b>: chance, over large numbers,
              becomes incredibly predictable. It is why casinos never go bust.</p>`,
    },
    {
      t: 'A bit of easy arithmetic',
      html: `<p><b>Probability of two things together (independent):</b> you <b>multiply</b>.<br>
             Two heads in a row: 1/2 × 1/2 = 1/4 = 25%.<br>
             Three heads in a row: 1/2 × 1/2 × 1/2 = 1/8 = 12.5%. <span class="muted">(there are the powers of 2 again!)</span></p>
             <p><b>Probability of "this or that" (different cases):</b> you <b>add</b>.<br>
             With a die, "a 1 or a 6 comes up" = 1/6 + 1/6 = 2/6 = 33.3%.</p>
             <div class="callout">With 3 coins the possible results are HHH, HHT, HTH, HTT, THH, THT, TTH, TTT (H = heads, T = tails): that is <b>8 = 2³</b>.
             Every extra coin doubles the results.</div>`,
    },
    {
      t: '💡 Your turn',
      html: `<div class="callout think">
        <p><b>1.</b> With the die, how many rolls does it take for all the bars to sit within 1% of the theoretical line? Try it.</p>
        <p><b>2.</b> If you toss 10 coins, what is the probability that they all come up heads? <span class="muted">(1/2^10 = 1/1024)</span></p>
        <p class="mb0"><b>3.</b> A friend says: "five tails in a row have come up, now heads is more likely". Are they right?
           <span class="muted">(no: the coin has no memory — that is the "gambler's fallacy")</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Tossing a coin 10 times, do you always get exactly 5 heads?',
      options: ['yes, always', 'no, but the more tosses you make the closer the proportion gets to a half', 'no, tails always comes up more', 'it depends on the coin'], correct: 1,
      why: 'That is the law of large numbers: over few tosses the percentages swing, over many they settle.' },
    { q: 'Probability of three heads in a row?',
      options: ['1/2', '1/6', '1/8', '3/2'], correct: 2,
      why: 'Independent events: you multiply. 1/2 × 1/2 × 1/2 = 1/8 = 12.5%.' },
    { q: 'The probabilities of all possible results add up to…',
      options: ['0', '1 (that is, 100%)', 'it depends', 'the number of results'], correct: 1,
      why: 'Something has to happen: the sum is always 1.' },
  ],

  outro: `<div class="callout ok"><b>Done!</b> You can work out the probabilities of coins and dice. In the next level:
          the <b>clock of numbers</b>, that is counting in rounds like the hours on a clock.</div>`,
});
@endsection
