# Contributing to Quantum Arcade

Thank you: whether you want to fix a typo or write a whole new level, everything you need is
here. This document is organised around one finding from research on open source:
**people do not walk away from a project because it is hard, but because they cannot work out
where to start and get no answer when they ask.** The [sources are at the
bottom](#why-this-document-is-shaped-like-this).

> **Language.** Everything a contributor reads is in **English**: code, names, comments,
> documentation, commit messages. The *course content* is a different matter — it exists in
> Italian (the original), English and Spanish, and each edition stays in its own language.

---

## Your first contribution, in 5 minutes

```bash
git clone https://github.com/<user>/quantum-arcade.git
cd quantum-arcade

composer install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite && php artisan migrate

npm install          # only needed for the tests
npm start            # → http://127.0.0.1:8010
```

If the site opens and you can register, your environment is fine. **Confirmation emails land in
`storage/logs/laravel.log`** until you configure a real SMTP server: search for `verify?token=`
and paste the link into your browser.

Then:

```bash
npm run test:all     # unit + PHP + end-to-end + validator
```

If it is all green, you can start.

---

## Where to start (pick how much time you have)

| Time | What you can do | Where you touch it |
|---|---|---|
| 10 minutes | Fix a typo, clarify a confusing sentence | `resources/views/lessons/it/*.blade.php` |
| 30 minutes | Add a question to a level's quiz | same file, `quiz:` section |
| 1 hour | Improve an existing mini-game (labels, colours, sounds) | `public_html/js/widgets/*.js` |
| half a day | Write a **new level** | see below |
| 20 minutes | Improve an English or Spanish translation | `resources/views/{lessons,pages}/{en,es}/`, `js/i18n/*.js` |
| 20 minutes | Fix a language name in the picker | `LOCALE_NAMES` in `js/core/i18n.js` — written **in that language itself**, never a flag |
| as long as it takes | Add a **fourth** language | open an issue first: it is 100+ pages, better to talk it through |

Issues labelled **`good first issue`** are picked on purpose: small, self-contained, with the
file already named. If none are free, open an issue and say so: I will prepare one for you.

---

## How the project is put together

```
public_html/          ONLY assets: the game engine in JS, the theme, the images
  js/core/            engine: quantum simulator, DFT, player state, interface
  js/i18n/            the dictionaries: en.js, es.js (the key is the Italian sentence)
  js/widgets/         the mini-games, one or more per level
resources/views/      THE PAGES, as Blade views
  layouts/            the <head> of every page: title, canonical, hreflang. No page rewrites it
  pages/{it,en,es}/   home, method, privacy
  lessons/{it,en,es}/ one view per lesson per language: content ONLY
config/site.php       GENERATED from levels.js (`npm run sync`): routes and <head> come from here
lang/                 en.json, es.json: the same translations for the Laravel side
Modules/              modular Laravel backend: Accounts, Progress, Certificates, Chat
tests/                PHP tests, JS unit tests, Playwright end-to-end tests
tools/                validator, mathematical checks, exam sync, sitemap
```

Two rules hold the whole thing up:

1. **`public_html/js/core/levels.js` is the single source of truth** for the list of levels,
   their order and their prerequisites. If you add a level, start there.
2. **No build step.** The files you edit are the files that go live. No webpack, no Vite,
   no `npm run build`.

---

## Adding a level

1. Add a row to `public_html/js/core/levels.js`. The file path **is not written down**: it is
   derived from the `id`, so one language cannot end up missing a lesson halfway down the list.

   ```js
   { id: '25-my-level', part: 'D', n: 25,
     title: t('Short title'), desc: t('One line that makes you want to open it.'), xp: 120 },
   ```

2. Add the id to the `SLUG` map in the same file, with the name the file will have in the other
   two languages (addresses are translated too: `/en/lessons/`, `/es/lecciones/`).
3. Copy a similar existing lesson (`resources/views/lessons/it/11-grover.blade.php` is a good
   model) and change the `id`, the content and the quiz. Then do the same under `lessons/en/`
   and `lessons/es/`: a published language must have **every** lesson, and the validator stops
   if one is missing. The file is named after the **id**, not the slug: the slug lives in the
   address, which is translated, while the id is what the three languages have in common.
4. The title **is not written**. `layouts/lesson.blade.php` composes it from the level's number
   and title, which live in `levels.js`. That was the whole point: written by hand, the titles
   of 21 lessons out of 28 had stopped matching their page.
5. `npm run sync` regenerates `config/site.php`, which is where the routes come from: without
   it, the new level has no address.
6. `npm run languages` reports which new sentences are missing from the dictionaries
   (`--fix` prepares the keys).
7. `npm run sitemap` regenerates the list of addresses for search engines.
8. `npm run validate` checks that the id matches, that the views exist in every language, that
   none of them writes its own `<head>`, and that the HTML is valid.
9. `npm run test:e2e` checks that the page has no JS errors, does not overflow, and really draws.

**What makes a level good, in this project:**

- you **touch before you read**: the slider comes before the formula;
- every formula has **clickable** symbols (use `formula()` from `js/core/formula.js`);
- there is **one mission** with a verifiable goal, not just text;
- there is a **recall quiz** that explains the *why*, wrong answers included;
- no concept is used before it is introduced: if you need a tool, either an earlier level
  already built it, or you build it there.

The reasoning behind these rules is documented in the *method* page, together with the research
that backs it: [`resources/views/pages/en/method.blade.php`](resources/views/pages/en/method.blade.php).

---

## Adding or changing a mini-game

Widgets live in `public_html/js/widgets/` and all share the same shape:

```js
export function myGame(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, { title: '…', subtitle: '…' });

  const stage = new Stage(w.body, { height: 300, draw(ctx, s) { /* drawing */ } });
  const fx = attachFX(stage);          // sparks and flashes on milestones

  // …controls, logic…

  function milestone() { fx.win(); sfx.ok(); cfg.onWin && cfg.onWin(); }

  return { stage };
}
```

Four things are not negotiable, because they are the difference between a widget and a useless toy:

1. **The goal is written on the screen**, not only in the lesson text.
2. **Continuous feedback**: you must be able to tell you are getting closer *before* you get
   there (colour + sound + number).
3. **Coherent sound**: use the effects already in `js/core/audio.js`, do not add new ones
   without a reason. Every sound must always mean the same thing.
4. **It must work with a finger**: targets of at least 44 px, no hover as the only affordance.

---

## Changing the backend

```bash
php artisan test                       # 118 tests, they must stay green
XDEBUG_MODE=coverage php artisan test --coverage
```

Backend coverage is at **100%** and we would like to keep it there: if you add a branch, add
the test that walks it. This is not pedantry — three real bugs (the PDF looking in the wrong
folder, progress that could not be saved from an empty state, certificate codes with ambiguous
letters) were found exactly that way.

Routes live in `Modules/<Module>/routes/`, the logic in `app/Http/Controllers/`.
If you add a module: `php artisan module:make ModuleName`, then register the namespace in
`composer.json` (`autoload.psr-4`).

---

## Before opening a pull request

```bash
npm run test:all
```

It must all be green. On top of that:

- **one contribution, one pull request**: easier to read, faster to accept;
- **write in English** in code, names, comments and documentation: the content exists in three
  languages, but there is only one codebase and anyone may read it. The *content* of the
  lessons obviously stays in its own language;
- **explain the why** in the pull request, not the what (the what is visible in the diff);
- if you change teaching material, say **on what basis**: classroom experience, a source, a
  student's report. Opinions count, as long as they are declared.

### Commit messages

Simple format, in English:

```
level 11: clearer explanation of the diffuser
widget: the Bloch sphere now rotates with a finger too
backend: the certificate carries the date of birth
```

---

## What happens next

I answer issues and pull requests **within a few days**. If I do not answer, do push: it is not
disinterest, it means it slipped past me. The research on open source is unambiguous here — a
community that does not reply is one of the main reasons newcomers leave — and it would be
silly to fall for that in a project that is about method.

If a pull request is not accepted, I always explain why. A reasoned "no" is useful;
silence never is.

---

## Who takes part

Anyone who contributes substantially is credited in the `README` and, if they want, on the
site's credits page. Interesting pipelines discovered in the **workshop** (level 22) will end
up in a dedicated section under the name of whoever found them.

---

## A note on the exam questions

In the repository you will find `data/exam-bank-sample.js`: those are real but **public**
questions, and they exist so that the site and the tests run locally. The exam that issues the
certificate uses a different bank, which is not in git and cannot be downloaded anywhere —
because an exam whose answers can be read measures nothing.

If you want to propose new questions, open an issue or send them in the pull request by editing
the sample bank: I review them and, if they are good, they go into the real one.

---

## The licence your contribution goes out under

The project is **free but non-commercial**: anyone may read it, modify it, translate it,
install it on their own server and use it in state schools, at university or in a free
after-school club. What you may not do, without a written agreement, is **make money from it**:
resell it, embed it in a paid product, or use it to teach a paid course. The full text is in
[LICENSE](LICENSE):

- **code** → [PolyForm Noncommercial 1.0.0](LICENSE)
- **teaching content** → [CC BY-NC-SA 4.0](LICENSE)

By opening a pull request you accept two things:

1. your contribution goes out **under those same licences** (the standard rule: what comes in
   carries the licence of what goes out);
2. you authorise the author to include it in any **commercial licences** granted on request.

Point 2 looks lopsided and deserves an explanation: without it, a single accepted pull request
would be enough to make any future agreement impossible, including for the person who wrote
everything else. You **keep your copyright**, you stay in the project's history and in the
credits. If the condition does not convince you, say so in the pull request: it is open to
discussion (for example by keeping your contribution in a separate, marked file).

One honest clarification: a non-commercial licence is **not** "open source" under the Open
Source Initiative's definition, because it restricts fields of use. If that is a dealbreaker
for you, better to know before you write code than after.

---

## Why this document is shaped like this

The systematic review by **Steinmacher and colleagues** across 21 studies identifies five
families of barrier for someone arriving at an open source project: finding where to start,
social interaction, code problems, **inadequate documentation** and knowledge gaps. The most
frequent are the difficulty of **finding a suitable task** and **getting no answer** from the
community.

Hence the concrete choices in this file:

| Barrier identified by the research | What I did about it |
|---|---|
| "I do not know where to start" | a table of contributions by available time, `good first issue` issues with the file already named |
| "I cannot get the project running" | five commands to start, with an explicit check that tells you whether it worked |
| "The documentation is old or incomplete" | the validator checks that references in the documents really exist; CI runs it on every PR |
| "Nobody answers me" | an explicit commitment on response times, and a "no" that is always explained |
| "I do not know whether my contribution is right" | one command (`npm run test:all`) tells you before you open the PR |

**Sources**

- Steinmacher, I., Gerosa, M. A., Redmiles, D. — *Barriers Faced by Newcomers to Open Source Projects: A Systematic Review* — [text (PDF)](https://www.ime.usp.br/~gerosa/papers/Steinmacher2014_Chapter_BarriersFacedByNewcomersToOpen.pdf)
- Steinmacher, I. et al. — *A systematic literature review on the barriers faced by newcomers to open source software projects*, Information and Software Technology — [article](https://www.sciencedirect.com/science/article/abs/pii/S0950584914002390)
- Steinmacher, I., Gerosa, M. A., Redmiles, D. — *How to Support Newcomers Onboarding to Open Source Software Projects* — [chapter](https://link.springer.com/chapter/10.1007/978-3-642-55128-4_29)
