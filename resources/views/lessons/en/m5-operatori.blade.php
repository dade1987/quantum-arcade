@php($description = 'Operators learned by playing: unitary means "does not change lengths" (gates), Hermitian means "real eigenvalues" (observables), projector means "doing it again changes nothing" (measurement). With the adjoint explained for what it is and collapse as idempotence.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { operatoreLab, proiettoreLab } from '/js/widgets/operatori.js';

const L = renderLesson({
  id: 'm5-operatori',
  lead: `Open a quantum mechanics book and three words repeat on every page: <b>unitary</b>, <b>Hermitian</b>,
         <b>projector</b>. They look like three technicalities to swallow. They are in fact three very different ways
         a machine can treat arrows — and in twenty minutes you build all three with four knobs, discovering along
         the way why a quantum gate <b>cannot</b> be made at random and why measuring again never changes the
         answer.`,

  steps: [
    {
      t: 'First word: the adjoint (and it is not what it looks like)',
      html: `<p>At level 0·6 a matrix is the <b>machine that transforms arrows</b>. Before classifying them we need
             one tool, and it has an ugly name: the <b>adjoint</b>, written with a dagger — M†.</p>
             <p>The recipe is simple: you <b>flip the matrix about its diagonal</b> (top right goes to bottom left
             and vice versa). With complex numbers there is one extra step: you <b>turn each arrow round</b> — that
             is, take the conjugate. In this level we work with real numbers, so "adjoint" simply means "flipped",
             and the two technical names you will meet are <i>orthogonal</i> (for unitary) and <i>symmetric</i> (for
             Hermitian).</p>
             <div class="callout key">But the real definition of the adjoint is not the recipe: it is <b>what it is
             for</b>. The adjoint is the machine that "moves M to the other side" inside a dot product:
             <p class="mb0" style="margin-top:8px"><b>⟨M v , w⟩ = ⟨v , M† w⟩</b></p>
             <p class="mb0" style="margin-top:8px">That is: transforming the first arrow with M and then casting the
             shadow gives the same number as leaving the first arrow alone and transforming the second with M†. It
             is the only thing you have to remember, and it is the one that survives with complex numbers too.</p></div>`,
    },

    {
      t: 'The three families, built by hand',
      html: `<p>Now the four knobs. Move them and watch the three labels at the bottom light up. The drawing helps:
             the grey dots are <b>arrows of length 1</b> arranged in a circle, and the coloured ones are where they
             end up after the machine.</p>
             <div class="callout key">Look for these three things, in this order:
             <ul style="margin:8px 0 0">
               <li>a machine where the ring of dots <b>stays a circle</b>: that is <b>unitary</b>;</li>
               <li>one where the matrix <b>equals its own flip</b>: that is <b>Hermitian</b>;</li>
               <li>one that is <b>both at once</b> — and when you find it, look at what it does.</li>
             </ul></div>
             <p>The ready-made machines at the top are gates you already know: starting there is the quickest
             way.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'famiglie', title: 'All three families', text: 'build a unitary, a Hermitian, and one that is both.', xp: 55 });
        el.appendChild(m.root);
        operatoreLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Here is what you have just discovered, translated into quantum terms:</p>
              <table class="table">
                <tr><th>Family</th><th>The rule</th><th>What it is, in the course</th></tr>
                <tr><td><b>unitary</b></td><td>M†M = I<br>changes neither lengths nor angles</td><td>a <b>gate</b></td></tr>
                <tr><td><b>Hermitian</b></td><td>M† = M<br>always real eigenvalues</td><td>an <b>observable</b></td></tr>
                <tr><td><b>projector</b></td><td>P·P = P<br>redoing it changes nothing</td><td>a <b>measurement</b></td></tr>
              </table>
              <p>And the two things the game shows that words alone cannot convey:</p>
              <ul>
                <li><b>the rotation has no real eigenvalues.</b> Its discriminant is negative — the "impossible" case
                    from level 0·7b — and indeed no arrow stays still. That is why quantum phases are complex
                    numbers: there was no alternative;</li>
                <li><b>X, Z and H are unitary <i>and</i> Hermitian at once.</b> That means they are
                    <b>reflections</b>: their eigenvalues are +1 and −1, and applying them twice returns you exactly
                    where you started. Try it: that is why such a pair cancels inside a circuit.</li>
              </ul>`,
    },

    {
      t: 'Why a gate MUST be unitary',
      html: `<p>This is not a convention: it is a constraint, and it has two independent reasons that lead to the
             same place.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Reason 1: the probabilities', html: 'The state\'s length squared is the sum of the probabilities, and it must always be <b>1</b>. If a gate stretched an arrow even slightly, after ten gates the probabilities would add to 3 — and a 300% probability means nothing.' },
          { h: 'Reason 2: you can go back', html: 'A unitary machine always has an inverse, and it is its adjoint: <b>U† undoes U</b>. So every quantum circuit can be <b>run backwards</b>. That is the reversibility of level K·6, and it is not a luxury: the physics underneath (Schrödinger\'s equation) is reversible, so the gates must be too.' },
          { h: 'What it rules out', html: 'There is nothing among the gates that <b>erases</b>. The classical AND throws information away — from 1 and 0 comes 0, and you no longer know where you came from. A quantum gate cannot do that: which is why at level K·6 logical addition has to be rewritten reversibly before it can be brought here.' },
          { h: 'And the angles too', html: 'A unitary preserves the dot product, not just lengths. So two <b>perpendicular states stay perpendicular</b>: two answers distinguishable with certainty stay distinguishable. A gate cannot "blur" two possibilities.' },
          { h: 'The practical consequence', html: 'When at level 22 you invent an algorithm of your own, you cannot write any matrix you like: it has to be unitary. That is the constraint that makes the craft hard — and interesting.' },
        ], { doneLabel: 'Makes sense!' });
      },
    },

    {
      t: 'Why an observable MUST be Hermitian',
      html: `<p>Here the argument is even shorter, and it fits in one sentence: <b>the numbers you read on an
             instrument are real numbers</b>. There is no voltmeter that reads 3 + 2i.</p>
             <p>In quantum mechanics the value that comes out of a measurement is an <b>eigenvalue</b> of the
             operator representing the quantity (level 18·b). So we need a family of matrices whose eigenvalues are
             <b>guaranteed real</b>, always, not by luck.</p>
             <div class="callout key">And that family is exactly the <b>Hermitian</b> one. The test checks it on two
             thousand random symmetric matrices: the characteristic polynomial's discriminant is never negative, not
             once. It is not a tendency: it is a theorem.</div>
             <p>There is more, and it completes the picture: the <b>eigenvectors</b> of a Hermitian matrix with
             distinct eigenvalues are automatically <b>perpendicular</b> to one another. That is: they form an
             orthonormal basis (level M·4). Putting the two together:</p>
             <div class="callout ok"><b>An observable is: a set of perpendicular directions, with a real number
             written on each.</b> The directions are the possible outcomes, the numbers are the values you read.
             That is all "observable" means — and it is called the <b>spectral theorem</b>.</div>
             <p class="mb0">From here you can also read why certain pairs of quantities cannot be measured together:
             if two observables have <b>different eigenvector bases</b>, asking one means projecting onto one basis,
             and asking the other means projecting onto another. The two questions cannot be put in the same
             language. That is the origin of the uncertainty principle, and it is geometry.</p>`,
    },

    {
      t: 'The projector: why re-reading does not change the answer',
      html: `<p>The third family is the one that explains <b>collapse</b>, which is usually presented as a mysterious
             postulate.</p>
             <p>A <b>projector</b> is the machine that flattens every arrow onto one direction: the shadow of level
             0·9, made into a matrix. Its property fits in three symbols:</p>
             <div class="formula">P · P = <span class="hl-n">P</span></div>
             <p>Applying it twice is like applying it once. Which makes sense: once an arrow is already flattened
             onto the line, flattening it again does not move it.</p>
             <p>In the game: pick a measurement direction, set the state, press "measure" — and then measure
             again.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'proiettore', title: 'Read it, then read it again', text: 'measure twice in a row on 2 different directions.', xp: 50 });
        el.appendChild(m.root);
        proiettoreLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>The first result comes out at random, with the probabilities given by the shadows squared. The
              second one does <b>not</b>: it is already decided, and it equals the first. Always.</p>
              <div class="callout key"><b>Collapse is not an extra hypothesis.</b> It is the physical face of
              P·P = P. Saying "once measured, the state is that one" and saying "applying the projector twice is
              like applying it once" are the same sentence in two languages.</div>
              <p>And the other property the game shows at the bottom: the two projectors onto perpendicular
              directions, <b>added together, give the identity</b>. Translated: the possible outcomes cover all
              cases, and the probabilities make 100%. That too, which looked like an imposition, is a property of
              matrices.</p>
              <div class="callout warn"><b>Honesty about what the game does:</b> collapse here is simulated with a
              random number, as you would observe on a real machine by repeating the experiment. The game takes no
              position on <i>why</i> nature behaves this way — that is an open question of interpretation — but on
              <i>how</i> it behaves, and how it is written down.</div>`,
    },

    {
      t: 'Where it comes from: someone who kept failing exams',
      html: `<p><b>Charles Hermite</b>, French, proves in <b>1855</b> that matrices equal to their own
             flipped-and-conjugated version <b>always have real eigenvalues</b> — the same property real symmetric
             matrices had. We call them Hermitian for that. This is <b>seventy years before</b> anybody needs it to
             describe an atom.</p>
             <div class="callout key"><b>The curiosity, and it is for anyone who feels slow:</b> Hermite was a
             <b>disastrous</b> student at examinations. He entered the École Polytechnique with a score near the
             bottom of the list, and after <b>a single year</b> the school would not let him continue: his right
             leg, which he had walked badly on since birth, ruled out the military commission the Polytechnique
             prepared its students for, and that was enough. He was offered readmission on heavy conditions; he
             refused, and left <b>with no degree</b>. It took him years to piece an academic career back together,
             sitting exams he kept doing badly at. Meanwhile he was writing letters to Jacobi containing results his
             examiners would not have been able to assess.</div>
             <p>Then the career: he proves that <b>e is transcendental</b> (1873) — that is, it is not the solution
             of any polynomial equation with whole-number coefficients, closing a problem open for centuries — and
             opens the road to the same result for π, which Lindemann completes nine years later. And he ends up a
             professor at that very École Polytechnique that had sent him away, and at the Sorbonne.</p>
             <p>The rest of the story you know from level M·4: <b>Hilbert</b> tidies up spaces with a dot product,
             and <b>von Neumann</b> in <b>1932</b> writes the book that translates all of quantum mechanics into
             this language. It is he who settles, definitively, the dictionary you now hold:</p>
             <table class="table">
               <tr><th>Physics</th><th>Mathematics</th></tr>
               <tr><td>state</td><td>vector of length 1</td></tr>
               <tr><td>evolution, gate</td><td><b>unitary</b> operator</td></tr>
               <tr><td>observable quantity</td><td><b>Hermitian</b> operator</td></tr>
               <tr><td>value you read</td><td><b>eigenvalue</b> (real)</td></tr>
               <tr><td>measurement, collapse</td><td><b>projector</b> (P·P = P)</td></tr>
             </table>
             <div class="callout ok">It is worth pausing on that table. It is not a rough translation: it is
             <b>exact</b>, and it is why quantum mechanics, hard as it is to imagine, is easy to <b>compute</b>. All
             the strangeness sits in the left-hand column; the right-hand one is matrices, and you have been turning
             matrices for ten levels.</div>`,
    },

    {
      t: '💡 Try it yourself',
      html: `<div class="callout think">
        <p><b>1.</b> In the first game load the <b>H</b> gate: is it unitary? Hermitian? What eigenvalues does it
           have? And what happens if you apply it twice? <span class="muted">(+1 and −1, and H·H = identity: it is a
           reflection)</span></p>
        <p><b>2.</b> Load "stretch" (2 and 0.5): why can it not be a quantum gate?
           <span class="muted">(look at what it does to the ring of dots)</span></p>
        <p><b>3.</b> Load the <b>rotation</b>: why does the panel say "complex eigenvalues"? Think back to the
           discriminant of level 0·7b. <span class="muted">(trace 0, determinant 1 → λ² + 1 = 0)</span></p>
        <p><b>4.</b> In the second game put the state at 45° and measure in direction 0°: what probabilities come
           out? Now measure in direction 45°: and now? <span class="muted">(50/50 against certainty: same state,
           different question — level M·4)</span></p>
        <p class="mb0"><b>5.</b> Inventor's question: a projector is Hermitian but <b>not</b> unitary. What does that
           say about whether measurement is reversible? <span class="muted">(it is not: flattening loses
           information, and it is the only point in all of quantum mechanics where that happens)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'What is the adjoint of a matrix, in one line?', options: ['its inverse', 'the machine that moves M to the other side of a dot product: ⟨Mv, w⟩ = ⟨v, M†w⟩', 'the matrix multiplied by −1', 'the matrix of its eigenvalues'], correct: 1,
      why: 'The recipe (flip, and with complex numbers conjugate) is only how you compute it. The definition is that property, and it is the only thing worth remembering.' },
    { q: 'Why must a quantum gate be unitary?', options: ['by convention', 'because it must not change lengths (the probabilities stay 100%) and it must be reversible', 'because it is faster that way', 'because otherwise it has no eigenvalues'], correct: 1,
      why: 'Two independent reasons leading to the same constraint: the probabilities must keep summing to 1, and the underlying physics is reversible — the inverse of a unitary is its adjoint.' },
    { q: 'Why must an observable be Hermitian?', options: ['for aesthetic symmetry', 'because its eigenvalues are guaranteed real, and a value read on an instrument is a real number', 'because it is easier to compute', 'because it preserves lengths'], correct: 1,
      why: 'The value coming out of a measurement is an eigenvalue. Hermitian matrices are exactly those that always have real ones — and on top of that their eigenvectors are perpendicular, so they form a measurement basis.' },
    { q: 'What does P·P = P mean?', options: ['that P is the identity', 'that applying the projector twice is like applying it once: measuring again gives the same result', 'that P is invertible', 'that P has no eigenvalues'], correct: 1,
      why: 'An arrow already flattened onto the line does not move if you flatten it again. That is idempotence, and quantum collapse is its physical face.' },
    { q: 'The gates X, Z and H are unitary and also Hermitian. What follows?', options: ['that they do nothing', 'that they are reflections: eigenvalues +1 and −1, and applied twice they return to the identity', 'that they have complex eigenvalues', 'that they are not invertible'], correct: 1,
      why: 'Unitary says the inverse is the adjoint; Hermitian says the adjoint is itself. So it is its own inverse: applying it twice does nothing. Inside a circuit such a pair cancels.' },
    { q: 'Why can two observables with different eigenvectors not be measured together?', options: ['because the instruments interfere', 'because measuring means projecting onto a basis, and the two questions use different bases', 'because one of the two is not Hermitian', 'because the measurement takes too long'], correct: 1,
      why: 'Every observable carries its own eigenvector basis. Asking one means projecting onto that basis; asking the other, onto a different one. That is the geometric origin of the uncertainty principle.' },
  ],

  outro: `<div class="callout ok"><b>Done.</b> Unitary = does not change lengths, so it is a gate. Hermitian = real
          eigenvalues on perpendicular directions, so it is an observable. Projector = redoing it changes nothing, so
          it is a measurement. Three families of matrices, three words of physics — and collapse, which looked like a
          mystery, is the line P·P = P.</div>`,
});
@endsection
