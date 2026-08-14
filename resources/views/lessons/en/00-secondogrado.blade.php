@php($description = 'Quadratic equations learned by playing: the discriminant as "how many times the parabola meets the line", the quadratic formula built with al-Khwārizmī\'s method instead of memorised, and the negative discriminant that opened the door to imaginary numbers in the sixteenth century.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { parabolaLab, quadratoLab } from '/js/widgets/secondogrado.js';

const L = renderLesson({
  id: '00-secondogrado',
  lead: `The quadratic formula is probably the most memorised thing in all of school — and one of the least
         understood. Here I am not going to ask you to recall it: I am going to have you <b>build</b> it, with a
         drawing that is 1200 years old. By the end you will also know why this course needs it: the number under
         the square root is the very same thing that, at level <b>18·b</b>, decides whether a quantum gate has still
         directions or only phases that turn.`,

  steps: [
    {
      t: 'What a "solution" is, seen from outside',
      html: `<p>A first-degree equation (level 0·7) is a balance: 2x + 3 = 11, you move things across, you divide,
             out comes x = 4. In the second degree the <b>x multiplied by itself</b> appears — x², an area — and the
             balance alone is no longer enough: you cannot "move to the other side" an x that sits inside a square.</p>
             <p>Before solving, though, let us look at <b>what we are actually after</b>. Write ax² + bx + c and plot
             the result for every x: you get a U-shaped curve, the <b>parabola</b>. The solutions of
             ax² + bx + c = <b>0</b> are the points where that curve is worth zero — that is, where it <b>meets the
             line</b>.</p>
             <div class="callout key">Put that way, the mystery of "impossible equations" evaporates: a U-shaped
             curve can meet a line <b>twice</b>, <b>once</b> (if it just grazes it), or <b>never</b>, if it stays
             entirely above or entirely below. Three cases, not one weird one.</div>
             <p>In the game move the three numbers and try to obtain all three. Keep an eye on the number at the
             bottom left while you do.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'parabola', title: 'All three cases', text: 'get two solutions, then one, then none.', xp: 40 });
        el.appendChild(m.root);
        parabolaLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>The number changing colour down there is <b>b² − 4ac</b>, and it has a famous name: the
              <b>discriminant</b> (it "discriminates" between the three cases). It is not a formula to remember:
              it is the calculation that says <b>how many times</b> the curve meets the line.</p>
              <table class="table">
                <tr><th>Discriminant</th><th>The curve</th><th>Solutions</th></tr>
                <tr><td class="mono">&gt; 0</td><td>cuts the line at two points</td><td class="mono">2</td></tr>
                <tr><td class="mono">= 0</td><td>touches it and goes back up</td><td class="mono">1</td></tr>
                <tr><td class="mono">&lt; 0</td><td>never meets it</td><td class="mono">0</td></tr>
              </table>
              <p class="mb0">The real question remains: <b>where does</b> that b² − 4ac come from? It did not fall
              out of the sky. It is a piece of a drawing, and we are about to build it.</p>`,
    },

    {
      t: 'The ten dwarfs and the leftover tile',
      html: `<p>Take an equation written the way it was written a thousand years ago, with no minus signs:</p>
             <div class="formula">x² + 10x = 39</div>
             <p>and read it as a <b>paving problem</b>. There is a <b>square</b> courtyard of side x — so of area x² —
             and next to it stand <b>10 dwarfs</b>, each one pace wide and as long as the courtyard: ten strips of
             area x each. Courtyard plus dwarfs make 39 tiles in total. How wide is the courtyard?</p>
             <div class="callout key"><b>The move, and it is the dwarfs who suggest it:</b> lined up on one side
             only, the ten dwarfs make a long lopsided rectangle. But if they <b>split into two equal rows of
             five</b> — five to the right of the courtyard and five below it — the drawing becomes almost a big
             square. Almost: <b>the corner is missing</b>.</div>
             <p>And the missing corner is a little 5 × 5 square, that is <b>25 tiles</b>. Add it — but then, by the
             balance rule of level 0·7, it has to be added <b>to the other pan too</b>: 39 + 25 = 64.</p>
             <p>Now on the left there is a perfect square of area 64, so its side is 8. And that side is
             "x plus five". So x = 3. <b>With no formula.</b></p>
             <p>In the game take the three steps with the buttons and watch the drawing complete itself. Do it on at
             least two equations: what you need to see is not the numbers, it is that <b>it is always the same
             drawing</b>.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'quadrato', title: 'Complete the square', text: 'finish the drawing on 2 different equations.', xp: 55 });
        el.appendChild(m.root);
        quadratoLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Keep just two things in mind, and both are in the drawing:</p>
              <ul>
                <li>the dwarfs <b>split into two equal rows</b> → out of b comes <b>b/2</b>;</li>
                <li>the <b>corner tile</b> is square → the piece to add is <b>(b/2)²</b>.</li>
              </ul>
              <div class="callout warn">This is not a trick for remembering the formula: it is <b>the</b> proof of
              the formula. Take the dwarfs away and the step "add (b/2)² to both sides" goes back to being an
              arbitrary move to be memorised. With the dwarfs it is the only sensible thing to do.</div>`,
    },

    {
      t: 'The same moves, with letters: there is the formula',
      html: `<p>Now let us redo <b>exactly</b> those steps on ax² + bx + c = 0, with letters instead of numbers.
             There is no new idea from here on: only the same gestures, written in general.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'First: get the a out of the way', html: 'The drawing wants a courtyard of side x, not "a courtyards". So divide everything by a: <b>x² + (b/a)x + c/a = 0</b>. It is allowed because a is not zero — if it were, this would not be a quadratic.' },
          { h: 'Second: the constant term to the other side', html: 'As on the balance: <b>x² + (b/a)x = −c/a</b>. On the left the courtyard and the dwarfs are left, on the right the counted tiles.' },
          { h: 'Third: the dwarfs into two rows', html: 'Half of b/a is <b>b/(2a)</b>. Two equal rectangles, one per side.' },
          { h: 'Fourth: the corner tile', html: 'It is square, of side b/(2a): it is worth <b>b²/(4a²)</b>. It is added to both pans: <b>(x + b/2a)² = b²/(4a²) − c/a</b>.' },
          { h: 'Fifth: put the right-hand pieces together', html: 'Over a common denominator: b²/(4a²) − c/a = <b>(b² − 4ac) / (4a²)</b>. There is <b>where the discriminant is born</b>: it is the area of the corner tile minus what was already there. If it comes out negative, the square cannot be completed — and indeed the parabola does not touch the line.' },
          { h: 'Sixth: take the square root', html: 'The side of the square: <b>x + b/(2a) = ±√(b² − 4ac) / (2a)</b>. The <b>±</b> is there because a square of known area can be made with one side or with its opposite: those are the two solutions.' },
          { h: 'Seventh: move b/(2a) across', html: 'One last balance move, and the formula is done:<br><b>x = [ −b ± √(b² − 4ac) ] / (2a)</b>.' },
          { h: 'Re-read what you are holding', html: 'Not a nursery rhyme: <b>−b/2a</b> is the dwarfs split into two rows (and it is also the lowest point of the parabola, the vertex), the <b>square root</b> is the side of the completed square, the <b>discriminant</b> is how much was needed to complete it.' },
        ], { doneLabel: 'Built!' });
      },
      after: `<p>Look at the formula piece by piece: every part of it has a place in the drawing.</p>`,
    },

    {
      t: 'The formula taken apart',
      html: `<p>Touch the pieces below: they are the same four elements of the courtyard.</p>`,
      mount: el => {
        formula(el, {
          title: 'x = [ −b ± √(b² − 4ac) ] / 2a',
          parts: [
            { t: '−b / 2a', id: 'v', color: 'cyan', name: 'the dwarfs in two rows', say: 'It is half of b with the sign flipped: the centre of everything. In the drawing it is the side added to the courtyard; on the parabola it is the x of the vertex, the lowest point.', ex: 'The two solutions always sit at equal distance from here: one left, one right.' },
            { t: '±' },
            { t: '√(b² − 4ac) / 2a', id: 'r', color: 'green', name: 'how far you step', say: 'It is the side of the completed square: it says how far you move away from the centre to reach the two solutions.', ex: 'If it is zero, the two solutions coincide: the parabola touches the line without crossing it.' },
            { t: '·' },
            { t: 'b² − 4ac', id: 'd', color: 'amber', name: 'the discriminant: the tile minus what was there', say: 'It is what sits under the root, and it decides everything: positive → two solutions, zero → one, negative → none on the number line.', ex: 'In the game it is the number that changed colour at the bottom left.' },
            { t: '·' },
            { t: '2a', id: 'a', color: 'violet', name: 'the opening division', say: 'It comes from the very first step, the one where everything was divided by a to have a single courtyard.', ex: 'When a = 1 it almost vanishes: x = −b/2 ± √(b²/4 − c). That is the case in the game.' },
          ],
        });
      },
      after: `<div class="callout ok">Try redoing the earlier calculation with the formula: a = 1, b = 10, c = −39.
              Discriminant = 100 + 156 = 256, root 16, x = (−10 ± 16)/2 → <b>3</b> and <b>−13</b>. The drawing gave 3.
              The formula also gives the other solution, the negative one: al-Khwārizmī would have discarded it,
              because a courtyard of side −13 does not exist. That is not an oversight of his: negative numbers, in
              Europe, would be accepted as solutions only centuries later.</div>`,
    },

    {
      t: 'Where it comes from: al-jabr, and the door left open',
      html: `<p>Around <b>820</b>, in Baghdad, <b>Muḥammad ibn Mūsā al-Khwārizmī</b> writes a book whose title
             contains the word <i>al-jabr</i> — "restoring", putting back together what has been broken apart. From
             <i>al-jabr</i> comes <b>algebra</b>; from his Latinised name, <i>Algoritmi</i>, comes <b>algorithm</b>.
             Two words you use every day, from the same author.</p>
             <p>There is no formula in the book: neither symbols nor negative numbers existed yet. There is a
             <b>list of cases</b> written out in words — and one of them is, literally, <i>"a square and ten roots
             equal to thirty-nine"</i>: precisely the equation in the game. And the solution is <b>the drawing</b>
             you completed: the square, the two strips, the missing corner.</p>
             <div class="callout key">It is worth saying plainly: what at school looks like the destination — the
             formula — is really the <b>abbreviation</b> of a geometric argument. The drawing came first; the formula
             arrived later, when somebody invented letters to summarise it.</div>
             <p>There is one case the drawing cannot handle, though: when <b>too much is missing</b> and the square
             cannot be completed. Negative discriminant, square root of a negative number, "does not exist". For
             seven hundred years the answer was: it does not exist, full stop.</p>
             <p>Then, in <b>sixteenth-century</b> Italy, something odd happens — and not with quadratics, but with
             <b>cubics</b>. <b>Gerolamo Cardano</b> (1545) publishes the formula for solving them, and it turns out
             that in certain cases, to arrive at <b>perfectly ordinary</b> solutions — whole numbers, visible by eye
             — the formula forces you to pass <b>through</b> the square root of a negative number. Not out of whim:
             there is no other road.</p>
             <p><b>Rafael Bombelli</b>, a hydraulic engineer from Bologna, takes the needed step in <b>1572</b>: he
             takes those numbers seriously, sets down how they add and multiply, and shows that by the end of the
             calculation the "impossible" parts cancel and the right number is left. He calls them <i>"wild quantities"</i>
             (<i>quantità silvestri</i>, an expression he takes over from Cardano) and invents names to work with
             them: <i>"plus of minus"</i> and <i>"minus of minus"</i>, which are our +i and −i. The name
             "imaginary" comes later, from Descartes, and it was an insult.</p>
             <div class="callout ok"><b>The point that concerns this course:</b> complex numbers were not born as an
             elegant abstraction. They were born as a <b>forced shortcut</b>, taken while holding one's nose, to
             solve concrete problems with concrete answers. Three hundred years later it turned out they are the
             language quantum mechanics is written in. That "does not exist" of the negative discriminant, in short,
             was not a dead end: it was a door.</div>`,
    },

    {
      t: 'What all this is for in the quantum part',
      html: `<p>It sounds very far away, and instead the second degree shows up again at level <b>18·b</b> in the
             most direct way possible. There you look for the <b>still directions</b> of a 2×2 machine: the arrows
             the matrix does not turn, but only stretches or shrinks.</p>
             <p>Finding them means solving this equation, which is called the <b>characteristic polynomial</b>:</p>
             <div class="formula">λ² − (trace)·λ + (determinant) = 0</div>
             <p>where the trace is the sum of the two numbers on the diagonal and the determinant is the one from
             level 0·6. It is a quadratic equation in λ, and its solutions are the <b>eigenvalues</b>.</p>
             <div class="callout key">So the discriminant of this equation says, exactly:
             <ul style="margin:8px 0 0">
               <li><b>discriminant &gt; 0</b> → two distinct still directions. That is the H gate, with eigenvalues
                   +1 and −1;</li>
               <li><b>discriminant = 0</b> → only one. That is the "shear" machine in the game, which indeed has
                   one;</li>
               <li><b>discriminant &lt; 0</b> → <b>no</b> real still direction. That is the <b>rotation</b>: it turns
                   everything, no arrow stays in line. Its eigenvalues are <b>complex phases</b>.</li>
             </ul></div>
             <p>That third case is exactly the point where, at level <b>18·b</b>, the course says "and here complex
             numbers are needed". Now you know it is not a convenience: it is the <b>same</b> negative discriminant
             of al-Khwārizmī, the same door left open by Bombelli — and this time you walk through it to describe a
             quantum gate that turns phases.</p>
             <p class="mb0">A second, more hidden use: <b>probabilities</b> in quantum mechanics are amplitudes
             squared (level 0·9). Every time you impose "the probabilities add up to 1" you are writing a quadratic
             equation in the amplitudes — and that is why the states of a qubit live on a <b>sphere</b> and not on a
             line.</p>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game hold b and c still and move only <b>a</b> until it goes negative: the U flips
           over. Does the number of solutions change? And the discriminant?
           <span class="muted">(look at the discriminant's formula: a appears inside a product)</span></p>
        <p><b>2.</b> Solve <b>x² + 6x = 16</b> by hand with the dwarfs method: six dwarfs, two rows of how many? How
           much is the tile worth? And the total on the right? <span class="muted">(then check with the game)</span></p>
        <p><b>3.</b> An equation has solutions 2 and 5. What are b and c, if a = 1?
           <span class="muted">(hint: expand (x − 2)(x − 5); and notice that b is −sum and c is ·product: it is the
           same calculation you will meet again as trace and determinant)</span></p>
        <p><b>4.</b> Why is the parabola <b>symmetric</b> about the vertex? <span class="muted">(re-read the formula:
           the two solutions are "the centre ± the same quantity")</span></p>
        <p class="mb0"><b>5.</b> Inventor's question: the <b>H</b> gate has a matrix with trace 0 and determinant −1.
           Write its characteristic polynomial and solve it. <span class="muted">(you get λ² − 1 = 0: and those are
           exactly the +1 and −1 you will find at level 18·b)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What are the solutions of ax² + bx + c = 0, looking at the parabola?', options: ['the lowest point of the curve', 'the points where the curve meets the zero line', 'the width of the curve', 'the points where the curve is steepest'], correct: 1,
      why: 'The equation asks "for which x is this expression zero": exactly the points where the curve crosses (or grazes) the horizontal axis. Hence the three possible cases: two, one, none.' },
    { q: 'The discriminant is −7. How many real solutions are there?', options: ['two', 'one', 'none', 'it depends on the sign of a'], correct: 2,
      why: 'A negative discriminant means the square cannot be completed: the parabola stays entirely on one side and never meets the line. The solutions exist, but they are complex numbers.' },
    { q: 'In the dwarfs story, why do they split into TWO equal rows?', options: ['for visual symmetry', 'because that way the two strips lean on the two sides of the courtyard and the drawing becomes almost a square', 'because dwarfs always come in even numbers', 'to make the arithmetic faster'], correct: 1,
      why: 'That is the move that produces the b/2 of the formula: a single strip would stay a lopsided rectangle, two equal strips on two sides make a square with only the corner missing.' },
    { q: 'And the leftover tile in the corner — what does it become in the formula?', options: ['the constant term c', 'the (b/2)² added to both sides — that is, the piece the discriminant is born from', 'the denominator 2a', 'the ± sign'], correct: 1,
      why: 'The missing corner is a little square of side b/2, so of area (b/2)². Adding it to both sides is the step that completes the square, and comparing it with what was already there gives b² − 4ac.' },
    { q: 'Where do imaginary numbers historically come from?', options: ['from quadratic equations with a negative discriminant', 'from CUBIC equations, where reaching real solutions requires passing through the square root of a negative number', 'from quantum mechanics', 'from al-Khwārizmī\'s geometry'], correct: 1,
      why: 'With the second degree you could say "does not exist" and close the matter. With the third degree (Cardano 1545, Bombelli 1572) the passage through imaginary numbers was forced even when the final answer was a whole number: from there nobody went back.' },
    { q: 'Why does the second degree matter in quantum computing?', options: ['it does not, it is just general culture', 'because the eigenvalues of a 2×2 matrix are the solutions of a quadratic equation, and its discriminant says whether there are still directions or only phases', 'because quantum gates are parabolas', 'because it is needed to normalise qubits'], correct: 1,
      why: 'The characteristic polynomial λ² − trace·λ + determinant = 0 is a quadratic. Positive discriminant → two still directions (like the H gate); negative → no real still direction, complex eigenvalues: that is the rotation case.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> The discriminant is "how many times the curve meets the line", the
          formula is a square courtyard with ten dwarfs lined up in two rows and a tile in the corner, and the
          "impossible" case is the door complex numbers came in through. Three things that arrive separately at
          school, and that here are the same drawing seen from three sides.</div>`,
});
@endsection
