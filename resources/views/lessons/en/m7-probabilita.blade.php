@php($description = 'Probability learned by playing: mean and variance, the error that falls as 1/√n (and why one more decimal digit costs a hundred times the measurements), Bayes with the near-perfect test for a rare disease, and the Bell test — the 2022 Nobel one — with the 75% wall counted by hand.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { mediaLab, bellLab } from '/js/widgets/probabilita.js';

const L = renderLesson({
  id: 'm7-probabilita',
  lead: `At level 0·4 probability arrived as "throw and count". Here it becomes a tool, and it serves two things you
         have so far had to take on trust: <b>why every extra decimal digit costs a hundred times the
         measurements</b> — the line that makes variational algorithms expensive — and <b>why the 75% of the
         envelope challenge is a wall and not an estimate</b>. That wall can be counted by hand: there are sixteen
         possible strategies. And breaking it in a laboratory earned the 2022 Nobel Prize in Physics.`,

  steps: [
    {
      t: 'Mean, spread, and the law that binds them',
      html: `<p>A <b>random variable</b> is just a number you do not know in advance: the outcome of a throw, the
             reading of a qubit. Two things are said about it:</p>
             <ul>
               <li>the <b>mean</b> (or expected value): where the centre is, that is, what it averages to if you
                   repeat many times;</li>
               <li>the <b>standard deviation</b> σ: how much the values scatter around that centre. You compute it
                   by averaging the <b>squared deviations</b> — the variance — and then taking the root, to get back
                   to the original units.</li>
             </ul>
             <p>For a coin worth 1 with probability p and 0 otherwise, the standard deviation is
             <b>√(p·(1−p))</b>, largest at p = 0.5: the most uncertain situation is the one where the two faces are
             even.</p>
             <div class="callout key">And now the formula that decides everything. If you estimate the mean from
             <b>n</b> measurements, the error you should expect on the estimate is:
             <p class="mb0" style="margin-top:8px"><b>error ≈ σ / √n</b></p></div>
             <p>In the game: throw, watch the blue mean curve close in on the green line, and keep an eye on the
             green band — that is the error you expect. Then try to get below both targets.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'media', title: 'Two precision targets', text: 'get below both error thresholds.', xp: 45 });
        el.appendChild(m.root);
        mediaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>You will have felt the effort. Going from an error of 0.05 to one of 0.01 does not cost five times
              the throws: it costs <b>twenty-five</b>. And for one more decimal digit — from 0.01 to 0.001 — it takes
              <b>a hundred times</b> as many.</p>
              <div class="callout warn"><b>The root in the denominator is bad news, and it does not go away.</b> It
              is not a limitation of today's machines nor a flaw in the simulator: it is statistics. It holds for
              opinion polls, for physics experiments and for tomorrow's quantum computers, which will be perfect and
              will have exactly this problem.</div>
              <p class="mb0">That is why at level 21·b, setting 50 shots instead of 5000, the VQE descent zigzags:
              the measured slope is an average, and an average from few shots is noise. What was a sentence there,
              you can now compute yourself.</p>`,
    },

    {
      t: 'Bayes: when a near-perfect test is not enough',
      html: `<p>Second tool, and it is needed every time you read a noisy result — that is, always, on a real quantum
             machine. The question is: <b>I have a clue, how much should I change my mind?</b></p>
             <p>The case that breaks everybody's intuition is this one. Something affects <b>one person in a
             thousand</b>. There is a test that, when the thing is there, <b>always</b> finds it; and when it is not
             there, it is wrong only <b>5%</b> of the time. The test says yes. How likely is it that the thing is
             really there?</p>
             <div class="callout warn">Answer <b>before</b> reading on. Almost everyone says "95%", and so do most
             doctors when the question has been put to them in controlled studies.</div>`,
      mount: el => {
        stepper(el, [
          { h: 'Do not think in percentages: count people', html: 'Take <b>100,000 people</b>. The thing affects one in a thousand, so <b>100</b> of them have it.' },
          { h: 'The true positives', html: 'The test finds them all: <b>100 correct positives</b>.' },
          { h: 'The false positives', html: 'That leaves 99,900 people who do not have it. The test is wrong on 5% of them: <b>4,995 wrong positives</b>.' },
          { h: 'The calculation', html: 'Total positives are 100 + 4,995 = <b>5,095</b>. Of these, the true ones are 100. So the probability that someone who tested positive really has it is 100 / 5,095 ≈ <b>2%</b>.' },
          { h: 'Why intuition fails', html: 'Because we look only at how good the test is and forget <b>how rare the thing is</b>. If something is very rare, the few errors across a huge pile of healthy people bury the true positives. It is called <b>base rate neglect</b>.' },
          { h: 'The formula', html: 'This is <b>Bayes\' theorem</b>: true probability = (how many have it AND test positive) divided by (all the positives). Nothing more.' },
          { h: 'What it is for here', html: 'On a quantum machine every reading is noisy. When an error detector says "there is an error", how much you should believe it depends on <b>how frequent errors are</b> — exactly as above. The error correction of level 21 is, underneath, a Bayesian argument repeated millions of times a second.' },
        ], { doneLabel: 'Now it adds up!' });
      },
      after: `<div class="callout ok"><b>To take away:</b> a clue does not give you the answer, it tells you <b>how
              far to shift</b> what you believed. And the shift always depends on two things: how reliable the clue
              is, and how plausible the thing was <b>beforehand</b>.</div>`,
    },

    {
      t: 'The Bell game: where the classical hits a wall',
      html: `<p>Now the most important experiment in twentieth-century physics, reduced to a game you can play by
             hand.</p>
             <p>The rules. <b>Anna</b> and <b>Bruno</b> are in separate rooms and <b>cannot communicate</b>. A referee
             tosses a coin for each and hands each of them a question, 0 or 1. Each must answer 0 or 1. They win
             if:</p>
             <div class="formula">the two answers are <b>the same</b> — except when <b>both</b> questions are 1, and then they must be <b>different</b></div>
             <p>They can agree <b>beforehand</b> as much as they like. The four questions come up equally often. How
             many do they win?</p>
             <div class="callout key">In the game, the switch at the top changes the world: on the left Anna and
             Bruno have only an <b>agreement made beforehand</b>; on the right they share an <b>entangled pair</b>
             and choose which direction to measure it in. Same rules, same board.</div>
             <p>Start with the classical side: try as many combinations as you like and see where you stop.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'bell', title: 'The wall, and then past it', text: 'reach the classical maximum, then beat it with entanglement.', xp: 70 });
        el.appendChild(m.root);
        bellLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Classically you stop at <b>75%</b>. And here comes the part that makes this experiment different
              from every other: that 75% is <b>not an estimate</b>, it is a finite count you can check yourself.</p>
              <div class="callout key"><b>The proof, in full.</b> If Anna and Bruno cannot talk, Anna's answer
              depends only on <b>her</b> question: so her strategy is "what I answer if asked 0" and "what I answer
              if asked 1". Two binary choices: <b>four</b> possible strategies. The same for Bruno. In all
              <b>4 × 4 = 16</b> strategies, and that is <b>all</b> of them.
              <p class="mb0" style="margin-top:8px">Try them: eight win 3 questions out of 4, the other eight win
              one out of 4. None reaches four out of four. Nor does randomising help, because a random strategy is
              an <b>average</b> of these sixteen, and an average of numbers all ≤ 75% cannot exceed 75%.</p></div>
              <p>Now switch to the right. With an entangled pair and the right directions — Anna at 0° and 45°,
              Bruno at 22.5° and −22.5° — you reach <b>85.4%</b>. Which is exactly <b>cos²(22.5°)</b>: not a magic
              number, the cosine squared of an angle, the one from level M·2.</p>`,
    },

    {
      t: 'What it really proves, and what it does not',
      html: `<p>This step needs care, because it is the point where popular accounts usually get something
             wrong.</p>
             <div class="callout key"><b>What it proves.</b> If the answers were <b>already decided</b> before the
             measurement — that is, if each particle carried a slip of paper with the result of every possible
             measurement written on it — then Anna and Bruno would be using one of the sixteen strategies, and the
             ceiling would be 75%. Beating it in a laboratory means <b>those slips are not there</b>. The answers
             were not decided in advance.</div>
             <div class="callout warn"><b>What it does NOT prove.</b> It does not prove that the two qubits send
             each other signals, and it does not allow sending any. Look at Anna's answers alone: they are 0 and 1
             at random, half and half, <b>whatever Bruno does</b>. Anna cannot notice a thing. The strangeness lies
             only in the <b>correlation between the two lists</b>, and seeing it requires comparing them — which
             requires talking, at the speed of light like everybody else. <b>Entanglement does not transmit
             information.</b></div>
             <p>There is a ceiling on the other side too, and the game respects it: not even quantum mechanics
             reaches 100%. The maximum is precisely cos²(22.5°) ≈ 85.36%, and it is called <b>Tsirelson's
             bound</b>. This level's tests verify it by sweeping the whole grid of angles: if the game let you
             always win, it would be teaching that entanglement allows communication — which is false.</p>
             <div class="callout ok"><b>The one-line summary:</b> the world is not classical, but it is not magic
             either. It sits exactly between 75% and 85.4%.</div>`,
    },

    {
      t: 'Where it comes from: a paper written in spare time',
      html: `<p>In <b>1935</b> Einstein, Podolsky and Rosen raise the problem (level M·6): quantum mechanics, they
             say, must be incomplete, because otherwise reality would not be "local". Bohr replies. And there the
             matter rests for <b>thirty years</b>, because it looks like a question of philosophy: nobody can
             imagine an experiment that would decide who is right.</p>
             <p>Then comes <b>John Stewart Bell</b>, from Northern Ireland. His day job is accelerator physics at
             <b>CERN</b> — he designs magnets, he works on particle beams. He regards the foundations of quantum
             mechanics as a personal interest, and works on them outside office hours, during a sabbatical year. In
             <b>1964</b> he publishes a six-page paper in a journal that had just been founded and would fold after
             a few issues.</p>
             <div class="callout key">In those six pages is the thing nobody had seen: the dispute is not
             philosophical, it is <b>numerical</b>. If the answers are decided beforehand, then a certain combination
             of correlations cannot exceed a certain number. Quantum mechanics says it does exceed it. <b>Just
             measure it.</b></div>
             <p>It took years before anybody actually did. <b>John Clauser</b> in 1972 (with Stuart Freedman),
             <b>Alain Aspect</b> in 1982 with experiments that changed the directions <b>while</b> the photons were
             already in flight, <b>Anton Zeilinger</b> in the 1990s and 2000s closing the last loopholes. The result
             is always the same: the classical limit is <b>exceeded</b>. In <b>2022</b> the three receive the
             <b>Nobel Prize in Physics</b>.</p>
             <p class="mb0">Bell did not see it: he died in 1990, aged 62. He used to say he hoped to be proved
             wrong — the "uncomfortable" result seemed to him too strange to be the last word. It was not: he won,
             against his own hopes.</p>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game set the coin to 0.5 (the most uncertain case) and then to 0.9. With the same
           number of throws, which gives the more precise estimate? <span class="muted">(σ = √(p(1−p)) is smaller
           when p is near the extremes)</span></p>
        <p><b>2.</b> How many throws does an error of 0.001 on a fair coin take? <span class="muted">(σ = 0.5, so
           (0.5/0.001)² = 250,000)</span></p>
        <p><b>3.</b> Redo the Bayes calculation with a different prevalence: if the thing affects one person in ten
           instead of one in a thousand, what is the probability after a positive test?
           <span class="muted">(about 69%: same quality of test, a world of difference)</span></p>
        <p><b>4.</b> In the Bell game, on the classical side, find <b>two</b> different strategies that both reach
           75%. Then count how many there are in all. <span class="muted">(eight out of sixteen)</span></p>
        <p class="mb0"><b>5.</b> Inventor's question: on the quantum side set all four angles equal. What percentage
           comes out? <span class="muted">(75%: the entangled pair alone is not enough, you need <b>different</b>
           directions — entanglement is the raw material, the choice of measurements is the recipe)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'If you make n measurements, how does the error on the mean fall?', options: ['as 1/n', 'as σ/√n', 'as σ·n', 'it does not fall'], correct: 1,
      why: 'Halving the error takes four times the measurements; one more decimal digit, a hundred times. That is why variational algorithms are expensive — and it holds for perfect machines too.' },
    { q: 'A test always finds something that affects one person in a thousand, and gives false positives 5% of the time. You test positive: how likely is it that you have it?', options: ['about 95%', 'about 2%', 'about 50%', 'about 5%'], correct: 1,
      why: 'Out of 100,000 people: 100 true positives against 4,995 false ones. 100 out of 5,095 is about 2%. When something is rare, the few errors across very many healthy people bury the true positives.' },
    { q: 'In the Bell game, how many classical strategies are there in all?', options: ['infinitely many', 'sixteen, because each of the two must decide what to answer to two questions', 'four', 'two'], correct: 1,
      why: 'Anna\'s answer depends only on her question: four possible strategies. The same for Bruno. Four times four is sixteen — and they can all be tried by hand.' },
    { q: 'Why is 75% a wall and not an estimate?', options: ['because it is the average of many trials', 'because it can be checked across all sixteen possible strategies, and none does better', 'because quantum mechanics says so', 'because the game is rigged'], correct: 1,
      why: 'It is a finite, exhaustive count. Nor does randomising help, because an average of numbers all ≤ 75% cannot exceed 75%.' },
    { q: 'Beating 75% with an entangled pair proves that...', options: ['the two qubits send each other signals', 'the answers were not already decided before the measurement', 'information travels faster than light', 'quantum mechanics is incomplete'], correct: 1,
      why: 'If each particle carried the result of every possible measurement, you would fall back into one of the sixteen strategies and the ceiling would be 75%. Beating it rules out that description — but it does not let you transmit anything: Anna\'s answers, on their own, stay random.' },
    { q: 'Can entanglement get you to 100%?', options: ['yes, with the right angles', 'no: the maximum is cos²(22.5°) ≈ 85.4%, Tsirelson\'s bound', 'yes, but only with more than two qubits', 'it depends on the noise'], correct: 1,
      why: 'There is a ceiling on the quantum side too. Without it, entanglement would allow communication — which it does not: each side\'s answers, taken alone, are random whatever the other does.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> The error on a mean falls as 1/√n, and that root is the calculation
          that makes every quantum algorithm expensive today. Bayes tells you how far to shift what you believed, and
          reminds you that a near-perfect test for a very rare thing is not enough. And the Bell game puts a number
          under the sentence "the world is not classical": sixteen strategies, a ceiling at 75%, and an entangled
          pair reaching 85.4%. No magic — but nothing classical either.</div>`,
});
@endsection
