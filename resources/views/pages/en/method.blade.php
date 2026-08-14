@extends('layouts.page', [
    'title' => 'The method — how Quantum Arcade is built (and on which research)',
    'description' => 'The teaching, interface and accessibility choices behind Quantum Arcade explained one by one, with the research that backs them: mastery learning, retrieval practice, spaced repetition, interactive simulations, cognitive load, WCAG.',
    'robots' => 'index, follow',
])

@push('head')
@verbatim
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The Quantum Arcade method: learning quantum computing by playing, according to the research",
  "inLanguage": "en",
  "author": { "@type": "Person", "name": "Davide Cavallini", "url": "https://www.linkedin.com/in/davidecavallini/" },
  "about": ["game-based learning", "mastery learning", "retrieval practice", "spaced repetition", "quantum computing"]
}
</script>
@endverbatim
@endpush

@section('body')
<header class="topbar">
  <div class="wrap-wide topbar-in">
    <a class="brand" href="{{ \App\Support\Site::page('home', $locale) }}"><img class="logo" src="/assets/logo.svg" alt="" width="30" height="30"><span>Quantum Arcade<small>quantum computing by playing</small></span></a>
    <span class="topbar-spacer"></span>
    @include('partials.language-picker')
    <a class="btn sm ghost" href="{{ \App\Support\Site::page('home', $locale) }}">🗺️ Map</a>
  </div>
</header>

<main class="wrap">

<div class="lesson-hero">
  <nav class="crumbs"><a href="{{ \App\Support\Site::page('home', $locale) }}">Map</a> › The method</nav>
  <h1>How this course is built</h1>
  <p class="lead">Every choice — from playing before reading, to how levels unlock, down to the colour
  of the buttons — comes from a specific strand of research. Here they are, listed openly, so you can argue with them.</p>
</div>

<div class="tldr">
  <b>In two lines:</b> you learn by doing (interactive simulations), you consolidate by recalling from memory (quizzes),
  you remember over time (spaced review), you move on only after showing you understood (mastery learning),
  and the interface is designed to <b>remove</b> cognitive load, not to add it.
  Below you will find <b>every</b> choice, including the ones about level order, sound, mandatory registration
  and the way the commercial text on this site is written — with the sources at the bottom.
</div>

<h2>1. Why a video game and not a video</h2>
<p>The meta-analysis by <b>Wouters and colleagues (2013)</b> over 77 studies (more than 5,500 participants) finds that "serious games"
produce better learning than traditional instruction (d ≈ 0.29) and above all better <b>retention</b>
(d ≈ 0.36). But with one decisive detail: they work <b>better when the game is accompanied by other instruction</b>
and when the experience is spread over several sessions.</p>
<p><b>What we take from it here:</b> no level is "just a game". Every mini-game is followed (or preceded) by a written
explanation, a formula taken apart and a worked numerical example. And that is why the Flash review exists:
to push towards several sessions instead of one marathon.</p>

<h2>2. Why you touch before you read</h2>
<p>The interactive simulations of the <b>PhET</b> project (University of Colorado Boulder) show conceptual gains
equal to or better than those obtained with real lab apparatus, and they produce more productive discussion.
The <b>productive failure</b> line of research (Kapur) further shows that <i>attempting</i> a problem before receiving
the explanation — even failing — leads to deeper conceptual understanding than being handed the rule up front.</p>
<p><b>What we take from it here:</b> in almost every level the slider comes before the formula. First you see the arrows
cancel, then we tell you it is called destructive interference.</p>

<h2>3. Why there are quizzes (and why they do not give grades)</h2>
<p>The <b>testing effect</b> (Roediger &amp; Karpicke) is one of the most solid results in cognitive psychology:
recalling a piece of information from memory strengthens it far more than re-reading it for the same amount of time. Reviews
of study techniques put <b>practice testing</b> and <b>distributed practice</b> at the top for effectiveness.</p>
<p><b>What we take from it here:</b> the quizzes are low-stakes, with immediate feedback explaining <i>why</i>,
endlessly retryable and with no negative marking. Getting it wrong is part of the method: a question you missed comes back
sooner in the review, one you got right comes back later (<b>Leitner</b> box system: 1 day → 3 → 7 → 21 → 60).</p>

<h2>4. Why levels only unlock through mastery</h2>
<p>In <b>mastery learning</b> (Bloom) the student moves on once they have shown mastery of the current unit,
with variable time and attempts instead of fixed ones. The measured effects are among the most consistent in
individualised instruction, especially for those starting further behind.</p>
<div class="callout key"><b>Our unlock rule (deliberately doubled):</b>
<ul style="margin:8px 0 0">
  <li><b>practical check</b> — the mission inside the mini-game: you show you can <i>do</i> it;</li>
  <li><b>recall check</b> — the level's questions, all answered correctly at least once: you show you can <i>explain</i> it.</li>
</ul>
<p style="margin:8px 0 0">The first alone could be brute-forced with random attempts; the second alone can be guessed.
Together they are a reliable signal. Anyone who wants to roam free anyway (an adult revising, a teacher preparing
a lesson) can switch on <b>free mode</b> from the home page.</p></div>

<h2>5. Why the interface is so bare</h2>
<p><b>Cognitive load theory</b> (Sweller) and the principles of <b>multimedia learning</b> (Mayer) prescribe
some very concrete things, applied here to the letter:</p>
<table class="table">
  <tr><th>Principle</th><th>How it is applied in Quantum Arcade</th></tr>
  <tr><td><b>Coherence</b> — cut the superfluous</td><td>no decorative animation, no stock photos, no popups: the screen holds only what the concept needs</td></tr>
  <tr><td><b>Signalling</b> — highlight what matters</td><td>consistent colours across the whole course: amplitude = yellow, phase = violet, result = pink, "present" = green, "absent" = red</td></tr>
  <tr><td><b>Spatial contiguity</b></td><td>numbers are written <i>inside</i> the chart, next to the object they describe, not in a distant legend</td></tr>
  <tr><td><b>Segmenting</b></td><td>hard passages come in steps ("Next →"), paced by the reader</td></tr>
  <tr><td><b>Pre-training</b></td><td>terms are defined <i>before</i> they are used in a formula: that is what Part 0 is for</td></tr>
  <tr><td><b>Conversational style</b></td><td>we address you directly and use ordinary words: the "personalisation effect" shows it helps comprehension</td></tr>
</table>

<h2>6. Colours, contrast, accessibility</h2>
<ul>
  <li><b>Dark theme with high-contrast text</b> and line width capped at ~75 characters: two parameters that
      bear directly on reading fatigue.</li>
  <li><b>No information carried by colour alone</b>: every state also has a symbol or a label (✓, ✗, 🔒),
      a WCAG requirement for colour-blind readers.</li>
  <li><b>Touch targets</b> of at least 44 px, <b>visible focus</b> for keyboard navigation,
      support for <code>prefers-reduced-motion</code> for those who find animation uncomfortable.</li>
  <li><b>Immediate feedback</b> on every action (under 100 ms): sliders update the drawing as you move them,
      not on release. That is the threshold beyond which an interface stops feeling like "yours".</li>
</ul>

<h2>7. Motivation: why XP and levels, but no leaderboards</h2>
<p><b>Self-determination theory</b> (Deci &amp; Ryan) identifies three drivers: competence, autonomy, relatedness.
Meta-analyses on gamification show positive but <b>fragile</b> effects: points and badges work when they signal
<i>competence gained</i>, and can backfire if they become the only reason to play or if they create
social-comparison pressure.</p>
<p><b>What we take from it here:</b> XP arrives only for things genuinely done (mission passed, question recalled),
the ranks describe a skill ("Lord of the arrows", "Period hunter") and <b>there is no leaderboard at all</b>,
nor a running timer. Autonomy is protected by free mode and by the ability to replay any level.</p>

<h2>8. And the last level?</h2>
<p>Research on STEM learning distinguishes between <i>being able to apply</i> and <i>being able to transfer</i>.
Transfer is only trained on <b>ill-defined</b> problems, where there is no procedure to repeat.
That is why the last level is an open workshop: goals to reach, blocks at your disposal,
no solution written down anywhere, and a counter of "how many times you queried the oracle"
that pushes you to look for a smarter route.</p>


<h2>9. Why the qubit arrives at level 1 and Fourier only at 13</h2>
<p>The first version of this course followed the "logical" order: waves → Fourier → qubit. Impeccable on paper,
wrong in practice: seven levels of maths before seeing the object you came here for.</p>
<p>The current order follows two well-established principles:</p>
<ul>
  <li><b>Spiral curriculum</b> (Bruner, 1960): a concept is met more than once, first in simple form and then in
      full. Amplitudes appear at level 1 as numbers <b>with a sign</b> (+ and −), which is enough to understand
      interference and H·H; they become <b>complex arrows</b> at level 8, when two signs are no longer enough.
      Returning to the same concepts after a gap is also <b>distributed practice</b>: two benefits from one choice.</li>
  <li><b>Just-in-time</b>: a tool is introduced where it is needed, not before. Waves and the Fourier transform arrive
      at levels 13–17, right before the QFT, once the question "how do I find a hidden periodicity?"
      has already occurred to the player — at level 12, with Simon's algorithm, you discover you can only find
      periods "in XOR", and for real ones you need waves. Introducing them seven levels earlier meant
      answering a question that had not been born yet.</li>
</ul>
<div class="callout key"><b>A rule I set myself:</b> no tool may be introduced more than one level
before the point where it is needed, and every concept must come back at least twice.</div>

<h2>10. Why the classical computer comes first (and stays optional)</h2>
<p>"Quantum" is not a thing: it is a <b>difference</b>. And a difference is only visible if you know what it is
being compared with. Someone who has never got clear on what a bit is has no way of noticing what is strange about
a qubit: they are missing the background the figure stands out against. Nearly every wrong sentence in
circulation — "it tries every path at once", "it is infinitely faster" — comes from exactly there.</p>
<p>Hence two choices that hold each other up:</p>
<ul>
  <li>a <b>Part K</b> of six levels on the normal computer (bits, logic gates, addition with carries, searching,
      the cost of algorithms, reversibility and Landauer's principle), played with the same mini-games as the
      rest of the course;</li>
  <li>a <b>comparison block</b> opening every quantum level where a comparison genuinely exists: on the left how
      it is done on a normal computer, on the right what changes, underneath the number that says how much the
      difference is worth. Where the comparison is worth a game rather than a paragraph — searching before
      Grover, the oracle queried by hand before Deutsch–Jozsa, the repetition code before quantum error
      correction — the classical mini-game is played right there.</li>
</ul>
<p>Why it is built <b>this way</b> and not as an opening theory chapter:</p>
<ul>
  <li><b>Comparing two concrete cases surfaces the principle</b> better than stating the principle and then
      giving an example (Gentner, Loewenstein &amp; Thompson, 2003; Alfieri, Nokes-Malach &amp; Schunn, 2013).
      It works especially when the two cases are nearly identical and differ in <b>one point only</b>: which is
      exactly the relationship between bit and qubit, between linear search and Grover, between DFT and QFT.</li>
  <li><b>The two columns sit side by side</b>, not one below the other: reading the second while holding the
      first in mind is cognitive load spent on memory instead of reasoning (the split-attention effect, Sweller,
      Ayres &amp; Kalyuga). With the columns adjacent, the eyes do the comparing.</li>
  <li><b>The number at the bottom is always the same kind of number</b> (how many operations, how many queries,
      how many states): a yardstick that does not change units from one level to the next is what lets you notice
      that Grover and Shor <b>are not doing the same thing</b> — one is a quadratic gain, the other exponential.</li>
  <li><b>Part K is optional</b>, like Part 0, and sits outside the prerequisite chain. Anyone who already knows
      how a computer works walks straight past; anyone with a gap comes back to it the moment the gap starts to
      hurt — which is the moment you actually learn, not two weeks earlier "because it is on the syllabus".
      Every comparison block carries a link to the matching classical level, so the door is always open and never
      a toll gate.</li>
</ul>
<div class="callout key"><b>Intended side effect:</b> anyone who finishes Part K has also properly learned
classical computing — binary, gates, complexity, reversibility — which is useful in itself, and not merely the
preamble to something else.</div>

<div class="callout key" style="margin-top:18px"><b>What it looks like in practice, level by level.</b>
Where the comparison is worth a game rather than a paragraph, the two modes live inside <b>the same mini-game</b>,
with a switch that changes machine: same screen, same buttons, same mission. Only the mechanism changes.
This happens at level 1 (the same three-cell register: one full column against eight), at level 3 (the same hand:
jumps against rotations), at level 4 (the envelope challenge, where classical stops at 75% and entanglement
reaches 85%) and at level 7 (two routes, where probabilities add and amplitudes cancel).</div>
<p>Three details of those four games are deliberate and worth declaring:</p>
<ul>
  <li><b>You try first, the explanation comes second</b>, and in classical mode some missions <b>cannot be won</b>.
      Hitting the wall with the tools you have makes the following solution far more solid than receiving it
      first: that is Kapur's <i>productive failure</i>, already cited at point 2. The game does say when a wall
      is a wall, rather than leaving you spinning: failing is useful, failing without knowing it is not.</li>
  <li><b>The two cases are aligned</b>: if something changes between the modes, it is because it is <b>the</b>
      thing. That is the condition that makes comparison work (Gentner, <i>structure mapping</i>): the mind
      isolates the difference only when everything else matches.</li>
  <li><b>The mode of computation is always visible</b>, on every mini-game in the course: blue "normal computer",
      violet "quantum computer", with an icon and a written word next to the colour — never colour alone, as at
      point 6. Part 0 and the wave labs carry no badge, because maths is neither one nor the other.</li>
</ul>

<h2>11. Sound: information, not decoration</h2>
<p>An arcade without sound is not an arcade, but noise for the sake of noise violates Mayer's <b>coherence
principle</b> (anything that does not serve the concept steals attention). The compromise applied here:</p>
<ul>
  <li>each <b>type of event has its own timbre</b>, always the same: click, XP, mission, quantum measurement,
      constructive interference, destructive interference, level fanfare. After a few minutes you recognise
      what happened <b>without looking</b>: sound becomes a second information channel;</li>
  <li><b>short</b> sounds (under 350 ms) at low volume, generated live with WebAudio: no file to download,
      it works on a slow connection too;</li>
  <li>a mistake <b>does not punish</b>: two descending notes, not a buzzer. Punitive feedback raises performance
      anxiety and reduces willingness to try again, which is exactly what a mastery-based course needs;</li>
  <li>you can <b>turn it all off</b> and the choice is remembered. No sound starts before an interaction,
      as browser rules also require.</li>
</ul>

<h2>12. "Wow effect": immediate, specific feedback</h2>
<p>In the first version, the Part 0 mini-games did not tell you whether you were doing well. Research on feedback
(Hattie &amp; Timperley; Shute) is clear on one point: feedback works when it is <b>immediate</b>, <b>specific</b>
and about the <b>task</b>, not the person. Hence three additions, now present in <b>all</b> the games:</p>
<ul>
  <li><b>The goal always written at the top</b>, in its own band: you do not have to remember what you were asked.</li>
  <li><b>A "how close are you" bar</b> going from red to amber to green, with a tone that rises as
      you approach: colour + sound + text, three channels for the same information (also useful to anyone who
      struggles with colours).</li>
  <li><b>Visible celebration</b> at the finish line — sparks, flash, sound — because the moment you understood
      has to be unmistakable. It is the one "decorative" concession, and it lasts half a second.</li>
</ul>

<h2>13. Why an account is mandatory (and why I do not like it)</h2>
<p>Asking for registration is friction, and friction loses people: it would be more convenient for everyone to run
everything in the browser. Two reasons make it the right choice anyway:</p>
<ul>
  <li><b>progress must not die with the cache.</b> A 28-level course is done across several sessions and often on several
      devices: losing everything to a browser clean-up is the stupidest way to drop out;</li>
  <li><b>the certificate has to be worth something.</b> The exam questions come from the server <b>without</b> the correct answers
      and grading happens on the server: if the state lived in the browser, anyone could award themselves 100%
      with two lines in the console, and the certificate would be worthless paper.</li>
</ul>
<p>In exchange: only the data that is genuinely needed (first name, last name, email — date of birth is optional and serves to
tell apart people with the same name), no profiling, no advertising, total deletion in one click.
It is all written in the <a href="{{ \App\Support\Site::page('privacy', $locale) }}">privacy notice</a>.</p>

<h2>14. The AI tutor that refuses to give you the solution</h2>
<p>The tutor answers only from the content of this site (RAG) and, by design, <b>does not provide mission
solutions</b>: it gives a hint and points you at the right slider. It is an uncomfortable choice but one supported by the research on
<b>desirable difficulties</b> (Bjork): the effort of getting there yourself is precisely what produces durable
learning. An obliging tutor would make everything look easier and leave less behind.</p>
<p>Every answer cites the level and links to it: the tutor's goal is to <b>put you back inside the game</b>,
not to replace it. And if a question finds no answer in the content, it says so instead of making things up.</p>

<h2>15. How do I know the simulator is not lying</h2>
<p>A course that teaches with a simulator has a basic problem: if the simulator is wrong, it teaches the error —
and teaches it convincingly, because it shows it. The project's tests check the properties you would
expect (gates stay unitary, the QFT reproduces the Fourier matrix <i>exactly</i>, probabilities
sum to one). But those tests are written by me, on the same reasoning the simulator is written on:
if the error is in the reasoning, the tests confirm it instead of catching it.</p>
<p>That is why the simulator is compared against an <b>independent implementation</b>:
<a href="https://github.com/francescosisini/QuantumSim" target="_blank" rel="noopener">QuantumSim</a>, written in C
by <b>Francesco Sisini</b>. Three hundred randomly generated circuits — up to 4 qubits, with Hadamard, Pauli, S, T, T†,
phase rotations, CNOT, CZ and Toffoli — are run through both simulators and the amplitudes compared one
by one. Different languages, different authors, code written without knowing each other: <b>the largest gap is of the order
of 10⁻¹⁵</b>, that is, the limit of the computer's number precision. An error common to both, at that point,
is very unlikely.</p>
<p class="dim small">QuantumSim is released under the GNU GPL v3 and is <b>not included in this site</b>: it is
downloaded and compiled only when the check is run (<code>npm run test:cross</code>), like a bench tool.
Thanks to Francesco Sisini for letting me use it — and above all because it is from
<b>his books</b> that I started learning this subject.</p>

<h2>16. The site's copy: which persuasion techniques I use, declared</h2>
<p>This site also has a professional purpose: making me known as someone who builds AI systems and teaches.
I think it is only fair to declare which levers I am pulling, so you can weigh them:</p>
<table class="table">
  <tr><th>Technique</th><th>Reference research</th><th>How I use it here</th></tr>
  <tr><td><b>Goal-gradient effect</b></td><td>Kivetz, Urminsky &amp; Zheng (2006)</td>
      <td>visible XP bar and levels: motivation grows the closer the finish line gets</td></tr>
  <tr><td><b>Endowed progress</b></td><td>Nunes &amp; Drèze (2006)</td>
      <td>Part 0 is already "path covered" for anyone who knows the basics: you start from a bar that is not empty</td></tr>
  <tr><td><b>Social proof</b></td><td>Cialdini</td>
      <td><b>real</b> numbers: 8 organisations I have taught at, 37 levels, over 300 automated tests. No made-up "10,000 happy students"</td></tr>
  <tr><td><b>Reciprocity</b></td><td>Cialdini</td>
      <td>the full course is free and stays free: the contact request comes afterwards, and only if it was useful to you</td></tr>
  <tr><td><b>Friction reduction</b></td><td>Fogg's model (B = MAP)</td>
      <td>one main action per section and a calendar to book, instead of a long form</td></tr>
</table>
<div class="callout warn"><b>What I do NOT do, on purpose:</b> no fake countdowns, no invented
"scarcity", no inflated numbers, no promise of an accredited certification I do not have.
Persuasion techniques applied to a false claim are not marketing: they are a con,
and on a site that teaches how to tell true from merely plausible they would also be ridiculous.</div>

<h2>17. How it is written for search engines and for AIs</h2>
<p>Half of today's searches end up inside an AI-generated answer instead of a list of links.
The guidance emerging from research on <i>Generative Engine Optimization</i> is consistent with writing well:</p>
<ul>
  <li><b>structured data</b> (JSON-LD: Course, Person, FAQPage) so a machine can tell what this resource is,
      who wrote it and what it teaches;</li>
  <li><b>self-contained, quotable statements</b>: every important answer sits in a paragraph that stands on its own,
      without needing the surrounding context;</li>
  <li>an <a href="/llms.txt">llms.txt</a> file with the project's verifiable facts, for anyone indexing with language models;</li>
  <li><b>trust signals</b>: author in the open, linked sources, update date, and explicit admission
      of the limits (the certificate is not accredited).</li>
</ul>
<p class="dim small">Note: the same research shows that the content cited by AIs is the <b>structured and verifiable</b> kind.
Another way of saying that writing honestly and writing to be found, for once, coincide.</p>

<h2>18. The three languages, and how you move between them</h2>
<p>The course exists in full in Italian, English and Spanish: not a translated summary, three complete editions —
exam and certificate included. The addresses are translated too (<code>/en/lessons/</code>, <code>/es/lecciones/</code>),
because a page in Spanish living in a folder called "lezioni" is a half-translated page, and it shows.</p>
<p>The selector at the top follows four rules, and none of them is about looks:</p>
<ul>
  <li><b>Every language is written in its own language</b> — «Español», not «Spanish». People look for their own
      language the way it is written at home, not translated into a language they may not read. It is the
      recommendation of the W3C and of the Nielsen Norman Group, and it is also why the first version did not
      work: it said «IT EN ES», and ISO codes are mute labels to anyone who has never seen them.</li>
  <li><b>No flags.</b> A flag stands for a state, not a language: which one would you put on Spanish, out of the
      twenty countries that speak it? In their place a globe, the one symbol the public associates with
      "language" without associating it with a country.</li>
  <li><b>You change language without losing your place.</b> Someone reading the QFT in Italian who picks English
      wants the QFT in English, not to start over from the map. The addresses of the other versions are the same
      <code>hreflang</code> links the page already declares for search engines: computing them a second time
      would be the classic way of letting them drift apart.</li>
  <li><b>If your browser speaks another language I say so, but I do not move you.</b> A single line appears —
      written <i>in</i> the language it offers, otherwise it cannot be read — with two buttons: switch, or stay.
      Then it never asks again. Automatic redirection is explicitly discouraged by Google for multilingual sites:
      it stops you reaching a particular version on purpose, it confuses people who speak more languages than
      their browser is configured for, and it hides the other copies from search engines.</li>
</ul>
<div class="callout key">The rule underneath all four: <b>offer, do not decide</b>. The reader knows which language
they want to read in better than their browser does.</div>

<h2>19. The glossary that stays open while you read</h2>
<p>For a while the glossary was the <b>last</b> page of the course. Wrong: the word that blocks your reading is not
waiting at the end, you meet it at level 4 — and a word you do not understand does not postpone the problem, it
<b>multiplies</b> it, because every sentence after that uses it as if it were clear.</p>
<p>The glossary now sits at the top of every page and stays open <i>while</i> you read. The specific choices come
from five research findings, not from a visual fashion:</p>
<table class="table">
  <tr><th>Finding</th><th>How it is applied</th></tr>
  <tr><td><b>Split-attention effect</b> (Ayres &amp; Sweller): holding a sentence in mind while hunting for a
      definition elsewhere spends the very working memory the concept needed</td>
      <td>the panel opens <i>beside</i> the text and, when the screen allows it, <b>pushes</b> the page instead of
      covering it: you never change page and never lose your place</td></tr>
  <tr><td><b>Spatial contiguity</b> (Mayer): the explanation belongs next to the thing explained</td>
      <td>terms are marked inside the text and the definition appears <b>next to the word</b>, in two lines, with the
      number of the level that explains it properly</td></tr>
  <tr><td><b>Recognition rather than recall</b> (Nielsen, 6th heuristic): you should not have to remember that a
      feature exists</td>
      <td>the 📖 button is in the top bar of <b>every</b> page of the course — map, lessons and this one — and the shortcut (<b>G</b>) is the
      same across the whole site</td></tr>
  <tr><td><b>Glosses</b> (Nation; Yun's meta-analysis of hypertext glosses): short definitions one gesture away help
      comprehension and vocabulary retention; long ones interrupt reading</td>
      <td>two lines, never a wall of text, and the search box also accepts a level number
      ("what was that thing in 12?")</td></tr>
  <tr><td><b>Expertise reversal effect</b> (Kalyuga et al.): the help a beginner needs <b>gets in the way</b> of
      someone who already knows</td>
      <td>each term is marked <b>once per page</b>, the first time; and the highlighting has an off switch that stays
      off on the pages after it</td></tr>
</table>
<p>The panel is deliberately <b>not modal</b>: it does not block the lesson and does not demand to be closed before
you can carry on. Blocking the page to show a definition would be like shutting the book to open the dictionary.
Below 1100 px of width there is no room for two columns: there it does cover the text, and a tap outside closes it.</p>
<p class="dim small">A useful side effect: the terms now live in a <b>single file</b> (<code>js/core/glossario.js</code>),
so the level 23 table, the panel and the tap-for-definition bubbles can no longer say three different things —
which had already started happening between the Italian version and the translations.</p>

<h2>Sources</h2>
<p class="dim small">Listed in the order they appear in the text. Where there is no link it is because the reference
is a book or a classic paper that is easy to find: I prefer citing it that way rather than linking a copy
of dubious provenance.</p>
<ul class="src">
  <li>Wouters, P., van Nimwegen, C., van Oostendorp, H., van der Spek, E. (2013). <i>A meta-analysis of the cognitive and motivational effects of serious games</i>. Journal of Educational Psychology, 105(2), 249–265. — <a href="https://eric.ed.gov/?id=EJ1008015" target="_blank" rel="noopener">ERIC record</a></li>
  <li>Clark, D. B., Tanner-Smith, E. E., Killingsworth, S. S. (2016). <i>Digital Games, Design, and Learning: A Systematic Review and Meta-Analysis</i>. Review of Educational Research, 86(1), 79–122. — <a href="https://journals.sagepub.com/doi/10.3102/0034654315582065" target="_blank" rel="noopener">paper</a></li>
  <li>Sailer, M., Homner, L. (2020). <i>The Gamification of Learning: a Meta-analysis</i>. Educational Psychology Review. — <a href="https://link.springer.com/article/10.1007/s10648-019-09498-w" target="_blank" rel="noopener">paper</a></li>
  <li>Perkins, K. et al. <i>PhET: Interactive Simulations for Teaching and Learning Physics</i>. The Physics Teacher, 44(1), 18–23. — <a href="https://pubs.aip.org/aapt/pte/article/44/1/18/274167/PhET-Interactive-Simulations-for-Teaching-and" target="_blank" rel="noopener">paper</a></li>
  <li>Kapur, M. <i>Productive Failure</i>. — <a href="https://boldscience.org/wp-content/uploads/2025/04/Productive-Failure.pdf" target="_blank" rel="noopener">accessible summary (PDF)</a></li>
  <li>Roediger, H. L., Karpicke, J. D. — on the <i>testing effect</i> and the forward effect of recall: <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3983480/" target="_blank" rel="noopener">Retrieval practice enhances new learning (PMC)</a></li>
  <li>Systematic review on <i>spaced learning, interleaving and retrieval practice</i> (2023), Journal of the American College of Radiology. — <a href="https://www.jacr.org/article/S1546-1440(23)00646-4/fulltext" target="_blank" rel="noopener">paper</a></li>
  <li>Accessible summary on recall + spaced practice: <a href="https://evidencebased.education/resource/retrieval-and-spaced-practice-study-strategies-that-must-be-combined/" target="_blank" rel="noopener">Evidence Based Education</a></li>
  <li>Bjork, R. A. — <i>Desirable Difficulties in Theory and Practice</i>: why what makes learning harder in the moment makes it more solid over time. — <a href="https://www.researchgate.net/publication/347931447_Desirable_Difficulties_in_Theory_and_Practice" target="_blank" rel="noopener">text</a></li>
  <li>Kivetz, R., Urminsky, O., Zheng, Y. (2006). <i>The Goal-Gradient Hypothesis Resurrected</i>. Journal of Marketing Research. — <a href="https://business.columbia.edu/insights/chazen-global-insights/goal-gradient-hypothesis-resurrected" target="_blank" rel="noopener">Columbia Business School summary</a></li>
  <li>Nunes, J. C., Drèze, X. (2006). <i>The Endowed Progress Effect: How Artificial Advancement Increases Effort</i>. Journal of Consumer Research. — <a href="https://www.researchgate.net/publication/23547282_The_Endowed_Progress_Effect_How_Artificial_Advancement_Increases_Effort" target="_blank" rel="noopener">text</a></li>
  <li>Sisini, F. — <i>QuantumSim</i>, a quantum circuit simulator in C, and the popular books by the same author from which my path into this subject began. — <a href="https://github.com/francescosisini/QuantumSim" target="_blank" rel="noopener">repository</a></li>
  <li>Gentner, D., Loewenstein, J., Thompson, L. (2003). <i>Learning and Transfer: A General Role for Analogical Encoding</i>. Journal of Educational Psychology — comparing two concrete cases surfaces the shared principle better than studying them one at a time. — <a href="https://groups.psych.northwestern.edu/gentner/papers/GentnerLoewensteinThompson03.pdf" target="_blank" rel="noopener">PDF</a></li>
  <li>Alfieri, L., Nokes-Malach, T. J., Schunn, C. D. (2013). <i>Learning Through Case Comparisons: A Meta-Analytic Review</i>. Educational Psychologist, 48(2), 87–113. — <a href="https://www.tandfonline.com/doi/abs/10.1080/00461520.2013.775712" target="_blank" rel="noopener">article</a></li>
  <li>Landauer, R. (1961), <i>Irreversibility and Heat Generation in the Computing Process</i>, and Bérut, A. et al. (2012), <i>Experimental verification of Landauer's principle</i>, Nature 483, 187–189 — the thermodynamic cost of erasing a bit, predicted and then measured. — <a href="https://www.nature.com/articles/nature10872" target="_blank" rel="noopener">article in Nature</a></li>
  <li>Bruner, J. S. (1960). <i>The Process of Education</i> — the spiral curriculum: returning to the same concepts at ever deeper levels.</li>
  <li>Sweller, J. — cognitive load theory; Mayer, R. E. — principles of multimedia learning (coherence, signalling, contiguity, segmenting, pre-training, conversational style).</li>
  <li>Hattie, J., Timperley, H. (2007). <i>The Power of Feedback</i>; Shute, V. (2008). <i>Focus on Formative Feedback</i> — feedback works if it is immediate, specific and task-related.</li>
  <li>Deci, E. L., Ryan, R. M. — self-determination theory: competence, autonomy, relatedness.</li>
  <li>Cialdini, R. B. — <i>Influence</i>: reciprocity, social proof, authority. Used here only on verifiable claims.</li>
  <li>On <i>Generative Engine Optimization</i>: <a href="https://backlinko.com/generative-engine-optimization-geo" target="_blank" rel="noopener">overview of practices</a> and <a href="https://arxiv.org/pdf/2606.12439" target="_blank" rel="noopener">position paper on the risks (arXiv)</a></li>
  <li>WCAG 2.2 (W3C) for contrast, touch targets, visible focus and information never carried by colour alone. — <a href="https://www.w3.org/WAI/WCAG22/quickref/" target="_blank" rel="noopener">quick reference</a></li>
  <li>Ayres, P., Sweller, J. — <i>The Split-Attention Principle in Multimedia Learning</i>, in <i>The Cambridge Handbook of Multimedia Learning</i>: why holding a sentence and a definition apart costs working memory.</li>
  <li>Kalyuga, S., Ayres, P., Chandler, P., Sweller, J. (2003). <i>The Expertise Reversal Effect</i>. Educational Psychologist, 38(1), 23–31 — help that serves the beginner hinders the expert.</li>
  <li>Nielsen, J. — <i>10 Usability Heuristics for User Interface Design</i>, in particular the sixth ("recognition rather than recall"). — <a href="https://www.nngroup.com/articles/ten-usability-heuristics/" target="_blank" rel="noopener">text</a></li>
  <li>Nation, I. S. P. (2001). <i>Learning Vocabulary in Another Language</i>. Cambridge University Press — on the role of glosses.</li>
  <li>Yun, J. (2011). <i>The effects of hypertext glosses on L2 vocabulary acquisition: a meta-analysis</i>. Computer Assisted Language Learning, 24(1), 39–58.</li>
</ul>

<div class="callout"><b>Intellectual honesty:</b> none of these studies is about <i>this</i> course in particular, and effect sizes
in education are averages, not guarantees. If you notice something is not working — a level that is too steep, a game that is unclear —
that is useful data: write and tell me.</div>

<nav class="nav-foot">
  <a class="btn ghost" href="{{ \App\Support\Site::page('home', $locale) }}">← Back to the map</a>
  <a class="btn primary" href="{{ \App\Support\Site::lessonPath('01-qubit', $locale) }}">▶ Start playing</a>
</nav>

<p class="muted small" style="text-align:center;margin-top:18px">
  The whole project is public on
  <a class="dim" href="https://github.com/dade1987/quantum-arcade" target="_blank" rel="noopener">GitHub</a>
  under a <a class="dim" href="https://github.com/dade1987/quantum-arcade/blob/main/LICENSE" target="_blank" rel="noopener">free non-commercial licence</a>:
  studying it, modifying it and using it in state education is always allowed; paid training needs an agreement.
  If you find an error in these pages, <a class="dim" href="https://github.com/dade1987/quantum-arcade/issues" target="_blank" rel="noopener">report it</a>.
</p>

</main>
@endsection

@push('scripts')
{{-- Il glossario vale anche qui: chi legge come è fatto il corso incontra gli
     stessi termini, e non deve andarseli a cercare in un'altra pagina. --}}
<script type="module">
import { bottoneGlossario, montaGlossario } from '/js/widgets/glossario.js';
const barra = document.querySelector('.topbar-in');
const mappa = barra.querySelector('.btn');
barra.insertBefore(bottoneGlossario(), mappa);
montaGlossario();
</script>
@endpush
