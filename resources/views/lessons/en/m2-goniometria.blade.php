@php($description = 'Trigonometry learned by playing: the fundamental identity as Pythagoras on the circle, the addition formulas derived from the product of two matrices, the double-angle formula as a special case — and the discovery that every Grover iteration adds 2θ. With the story of the word "sine", born from a mistranslation.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { giostraLab, groverAngoloLab } from '/js/widgets/goniometria.js';

const L = renderLesson({
  id: 'm2-goniometria',
  lead: `At level 0·3 sine and cosine became two shadows of a turning point: no triangles, no formulas to memorise.
         Here we add the one thing you really need to be able to do with them, and that is <b>turning twice</b>. It
         sounds like very little; instead out of it come the addition formulas, the double-angle formula, and — the
         surprise — the reason why Grover's algorithm at a certain point <b>stops improving</b>.`,

  steps: [
    {
      t: 'A thirty-second recap, and a formula you already know',
      html: `<p>A point turns on a circle of radius 1. The <b>cosine</b> of the angle is its horizontal shadow, the
             <b>sine</b> is the vertical one. That is all: two numbers between −1 and 1 saying <b>where the point
             is</b>.</p>
             <p>Now look at the two shadows and the radius: they form a <b>right triangle</b> with legs of length
             cos and sin, and hypotenuse of length 1. Pythagoras says:</p>
             <div class="formula">sin²θ + cos²θ = <span class="hl-n">1</span></div>
             <div class="callout key">This is called the <b>fundamental identity</b> and has a reputation as a
             formula to be studied. It is not: it is <b>Pythagoras written on the unit circle</b>, and it holds for
             every angle because the radius never changes.</div>
             <p>And if you feel you have seen it in this course already, you are right: it is the same line that at
             level 0·9 said <b>"the probabilities make 100%"</b>. A qubit's two amplitudes are the two shadows, and
             the sum of their squares is the radius squared. Seen this way, a qubit is <b>a point on a
             circle</b>.</p>`,
    },

    {
      t: 'Two turns make one turn',
      html: `<p>A question that sounds trivial: if I turn by <b>a</b> and then by <b>b</b>, where do I end up? At
             <b>a + b</b>, obviously. Angles add up, as anyone who has turned a knob knows.</p>
             <p>The real question is another one: <b>where do the shadows end up?</b> That is, knowing cos a, sin a,
             cos b and sin b, what are cos(a+b) and sin(a+b)? The shadows do <b>not</b> add — and anyone writing
             "cos(a+b) = cos a + cos b" is spectacularly wrong (try a = b = 90°: the left side is −1, the right side
             is 0).</p>
             <p>In the game: move the two turns and bring the arrow onto the target. Watch the column of numbers
             while you do.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'giostra', title: 'Three targets', text: 'hit 3 targets by adding the two turns.', xp: 45 });
        el.appendChild(m.root);
        giostraLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>The right answer is this, and it is called the <b>addition formula</b>:</p>
              <div class="formula">cos(a + b) = cos a · cos b − sin a · sin b</div>
              <div class="formula">sin(a + b) = sin a · cos b + cos a · sin b</div>
              <p>The game has just checked it in front of your eyes: the "with the formula" row and the "actually
              turning" row give the same number, always. But <b>checking is not understanding</b>, and this formula
              has an origin that makes it obvious.</p>`,
    },

    {
      t: 'Where it comes from: it is the product of two matrices, read out loud',
      html: `<p>At level 0·6 you discovered that <b>a rotation is a matrix</b>. And doing two things one after the
             other, with matrices, means <b>multiplying them</b>. Put the two sentences together.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'The matrix that turns by a', html: 'Its two columns say where the two starting arrows end up:<br><b>R(a) = [ cos a &nbsp; −sin a ; &nbsp; sin a &nbsp; cos a ]</b>' },
          { h: 'Turning by a and then by b', html: 'Applying R(a) first and then R(b) is the matrix <b>R(b) · R(a)</b>. But turning by a and then by b is also, simply, <b>turning by a+b</b>. So <b>R(b) · R(a) = R(a+b)</b>. Two names for the same machine.' },
          { h: 'Now work out the product', html: 'Row by column, as at level 0·6. The top-left cell comes out <b>cos b · cos a − sin b · sin a</b>. The bottom-left one comes out <b>sin b · cos a + cos b · sin a</b>.' },
          { h: 'And read the other face', html: 'But that same matrix is R(a+b), and its top-left cell is by definition <b>cos(a+b)</b>, its bottom-left one <b>sin(a+b)</b>.' },
          { h: 'The two readings must agree', html: 'Same matrix, same cells. Hence<br><b>cos(a+b) = cos a cos b − sin a sin b</b><br><b>sin(a+b) = sin a cos b + cos a sin b</b>.<br>Done: the formula did not fall from the sky, it is the product of two matrices written out in words.' },
          { h: 'Why that minus sign', html: 'That is the question everybody asks. It comes from the <b>−sin a</b> in the rotation matrix, which in turn is there because turning anticlockwise sends the first arrow up but the second one <b>backwards</b>. The minus is the price of turning, not a whim.' },
        ], { doneLabel: 'Derived!' });
      },
      after: `<div class="callout ok"><b>This is the way of remembering them that does not fade:</b> not "cosine
              cosine minus sine sine", but "<b>two rotations in a row are one rotation</b>". The formula is the
              consequence. And if one day you need it and cannot recall it, you multiply two 2×2 matrices and you
              have it back in a minute.</div>
              <p>The case <b>b = a</b> is not one more formula, it is the same one with the same number twice:</p>
              <div class="formula">sin 2a = 2 · sin a · cos a &nbsp;&nbsp;&nbsp; cos 2a = cos²a − sin²a</div>
              <p class="mb0">It is called the <b>double-angle formula</b>, and two steps from now it turns out to be
              the engine of a quantum algorithm.</p>`,
    },

    {
      t: 'Where it comes from: a table of chords, and a mistranslation',
      html: `<p>Trigonometry is not born at school: it is born looking at the sky. Greek astronomers needed to tie
             the <b>angles</b> between stars to <b>distances</b> on the celestial sphere, and to do that they built
             tables. <b>Hipparchus of Nicaea</b>, around <b>150 BC</b>, compiles the first: not of sines, but of
             <b>chords</b> — the length of the segment joining the two ends of an arc.</p>
             <p>Three centuries later <b>Ptolemy</b>, in the <i>Almagest</i>, publishes a far more precise one and,
             to build it, proves a geometry theorem which — rewritten in modern language — <b>is the addition
             formula</b>. That is: the formula you have just derived from matrices, Ptolemy derived from a
             quadrilateral inscribed in a circle, in AD 150.</p>
             <div class="callout key"><b>The curiosity that is worth the level: why it is called "sine".</b> Indian
             astronomers (Aryabhata, around 500) stop tabulating the whole chord and switch to the <b>half
             chord</b>, which is what we now call the sine. In Sanskrit they call it <i>jyā</i>, meaning
             "bowstring" — the string of an archer's bow. The Arabs transliterate it as <i>jiba</i>, which in Arabic
             means nothing: it is only a sound, written <b>without vowels</b>, jb.
             <p style="margin:8px 0 0">In the twelfth century the European translators — <b>Gerard of Cremona</b>
             and others — read those same two consonants as <i>jaib</i>, which in Arabic <b>does</b> exist and means
             "bay, fold of a garment, bosom". And they render it in Latin as <b>sinus</b>. From there: <i>sine</i>,
             <i>seno</i>, <i>Sinus</i>.</p>
             <p class="mb0" style="margin-top:8px">Moral: the most used word in trigonometry means "bay" because of
             a vowel-less text misread eight hundred years ago. The concept was the string of a bow.</p></div>
             <p>One last curiosity, and this one is practical. Before logarithms (level 0·8), astronomers used the
             addition formulas to <b>turn multiplications into additions</b>, by rearranging them like this:</p>
             <div class="formula">cos a · cos b = ½ · [ cos(a − b) + cos(a + b) ]</div>
             <p>On the left a multiplication between long numbers; on the right two table lookups and one addition.
             The method was called <b>prosthaphaeresis</b> and was used at <b>Tycho Brahe</b>'s observatory. It
             worked so well that when Napier published logarithms, in 1614, he presented them as a <b>better</b> way
             of doing the same thing. Two different inventions for the same nuisance.</p>`,
    },

    {
      t: 'The surprise: Grover is a rotation, and 2θ is the double angle',
      html: `<p>At level 11 Grover's algorithm does something that looks like magic: it repeats a "mark and reflect"
             round and the right answer becomes steadily more likely. Then, at a certain point, if you keep going it
             <b>gets worse</b>. With trigonometry in hand that behaviour stops being strange and becomes
             obvious.</p>
             <p>Here is the picture. Put all the wrong answers on one axis and the right one on the other. The
             starting state — the uniform superposition — is an arrow <b>almost entirely on the wrong side</b>,
             tilted by a tiny angle θ given by:</p>
             <div class="formula">sin θ = √(1 / N)</div>
             <p>On 4 answers θ is 30°; on 256 it is about 3.6°. Then this happens:</p>
             <div class="callout key"><b>Every Grover round rotates the arrow by 2θ.</b> It does not bring it "a bit
             closer": it <b>rotates</b> it, always by the same angle. After k rounds the arrow sits at
             <b>(2k + 1)·θ</b>, and the probability of reading the right answer is the <b>sine squared</b> of that
             angle.</div>
             <p>Try it: raise the number of rounds and watch the arrow climb towards 90°. Then go past 90° and watch
             what happens to the bar.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'grover', title: 'Hit two lists', text: 'find the best number of rounds on 2 lists of different size.', xp: 55 });
        el.appendChild(m.root);
        groverAngoloLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Three things fall into place all at once:</p>
              <ul>
                <li><b>why it gets worse.</b> At 90° the arrow points entirely at the right answer and the
                    probability is 1. One more round takes it to 90° + 2θ, that is <b>past</b> it: and the sine,
                    beyond 90°, starts coming back down. Grover is not an algorithm that "improves as long as you
                    let it run": it is a hand going round, and it has to be stopped at the right moment;</li>
                <li><b>where the √N comes from.</b> You have to cover about 90° in steps of 2θ, and θ ≈ √(1/N) for
                    large N. So the number of steps is about 90° / (2·√(1/N)) — which is <b>π/4 · √N</b>. Grover's
                    famous √N is not an estimate: it is a division between angles;</li>
                <li><b>why exactly 2θ.</b> One Grover round performs <b>two reflections</b> (mark, then reflect).
                    And two reflections in a row are always a <b>rotation by twice</b> the angle between the two
                    mirrors. It is the double-angle formula from two steps ago, applied to two mirrors instead of an
                    angle.</li>
              </ul>
              <div class="callout ok">So the answer to "why √N and not N?" is: <b>because it is a rotation, and
              rotations add up in the angles, not in the probabilities</b>. If each round added probability instead
              of angle, Grover would be worth nothing.</div>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game set a = 90° and b = 90°. What is cos(a+b)? And what would "cos a + cos b"
           give? <span class="muted">(0 + 0 = 0, but the right answer is −1: that is why shadows do not add)</span></p>
        <p><b>2.</b> Derive sin 2a by putting b = a in the addition formula, by hand, on paper. Do you get two equal
           terms? <span class="muted">(sin a cos a + cos a sin a)</span></p>
        <p><b>3.</b> In the second game take N = 4: how many rounds are needed? And the probability after that
           round? <span class="muted">(just one, and it comes out exactly 100% — the case level 11 shows by
           hand)</span></p>
        <p><b>4.</b> Still in the second game, go from N = 16 to N = 256: there are 16 times as many answers. How
           many times as many rounds? <span class="muted">(four: that is √16)</span></p>
        <p class="mb0"><b>5.</b> Inventor's question: if there were <b>4 right answers</b> out of 256 instead of
           one, would θ be bigger or smaller? And the rounds needed? <span class="muted">(sin θ = √(M/N): with M = 4
           the angle doubles and the rounds halve — looking for more things at once is easier, not harder)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What, at bottom, is the identity sin²θ + cos²θ = 1?', options: ['a formula to memorise', 'Pythagoras applied to the triangle of the two shadows on a circle of radius 1', 'a property only of the special angles', 'the definition of sine'], correct: 1,
      why: 'The two shadows are the legs, the radius is the hypotenuse and it equals 1. It holds for every angle because the radius never changes. In the quantum world the same line is called "the probabilities make 100%".' },
    { q: 'What is cos(a + b)?', options: ['cos a + cos b', 'cos a · cos b − sin a · sin b', 'cos a · cos b + sin a · sin b', '2 · cos a · cos b'], correct: 1,
      why: 'Shadows do not add. The way not to get it wrong is to remember where it comes from: it is the top-left cell of the product of the two rotation matrices.' },
    { q: 'Why do the addition formulas have that shape?', options: ['by historical convention', 'because they are the product of two rotation matrices: turning by a and then by b is turning by a+b', 'because they follow from logarithms', 'because they make calculations simpler'], correct: 1,
      why: 'R(b)·R(a) = R(a+b). Working out the product row by column, the cells already contain cos a cos b − sin a sin b and sin a cos b + cos a sin b. The formula is that product read out loud.' },
    { q: 'Where does the word "sine" come from?', options: ['from Latin sinus, "bay", through a misreading of the Arabic jb', 'from Greek "semi"', 'from the name of a mathematician', 'from the shape of the curve'], correct: 0,
      why: 'Sanskrit jyā ("bowstring") becomes jiba in Arabic, written without vowels as jb; twelfth-century Latin translators read it as jaib, "bay", and translate sinus. The concept was the half chord of an arc.' },
    { q: 'By how much does the state arrow rotate at each Grover round?', options: ['by θ', 'by 2θ, because a round is two reflections and two reflections make a double rotation', 'by 90° divided by the number of rounds', 'it depends on the answer being sought'], correct: 1,
      why: 'Mark and reflect are two reflections, and two reflections in a row are a rotation by twice the angle between the two mirrors. After k rounds the arrow sits at (2k+1)·θ.' },
    { q: 'Why does going on with Grover rounds, past a certain point, make things worse?', options: ['because noise accumulates', 'because the arrow goes past 90° and the sine starts coming back down', 'because the wrong answers increase', 'it does not get worse, it always improves'], correct: 1,
      why: 'The probability is sin² of the angle. At 90° it is 1; beyond 90° the sine decreases, so the arrow moves away from the right answer again. Grover is a hand going round, and it has to be stopped at the right moment.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> The fundamental identity is Pythagoras on the circle, the addition
          formulas are the product of two matrices read out loud, the double angle is the case b = a — and with that
          in hand Grover stops being magic: it is an arrow rotating by 2θ a time, to be stopped at 90°. Plus you now
          know that "sine" means "bay" because of a vowel-less Arabic text read wrong.</div>`,
});
@endsection
