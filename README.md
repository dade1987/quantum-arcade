<div align="center">

<img src="public_html/assets/logo.svg" width="110" alt="Quantum Arcade">

# Quantum Arcade

**Learn quantum computing by playing. From zero, all the way to Shor's algorithm.**

**In Italian, English and Spanish.** &nbsp;·&nbsp; [🇮🇹 italiano](https://quantumarcade.it/) &nbsp;·&nbsp; [🇬🇧 English](https://quantumarcade.it/en/) &nbsp;·&nbsp; [🇪🇸 español](https://quantumarcade.it/es/)

[![CI](https://github.com/dade1987/quantum-arcade/actions/workflows/ci.yml/badge.svg)](https://github.com/dade1987/quantum-arcade/actions/workflows/ci.yml)
[![Backend coverage](https://img.shields.io/badge/backend%20coverage-100%25-success)](docs/BACKEND.md)
[![Frontend coverage](https://img.shields.io/badge/frontend%20coverage-100%25%20lines-success)](tests/js/unit)
[![Code](https://img.shields.io/badge/code-PolyForm%20Noncommercial%201.0.0-blue)](LICENSE)
[![Content](https://img.shields.io/badge/content-CC%20BY--NC--SA%204.0-blue)](LICENSE)

[How to contribute](CONTRIBUTING.md) · [The method and its sources](resources/views/pages/en/method.blade.php) · [Architecture](docs/BACKEND.md)

</div>

---

34 interactive levels starting from **middle-school maths**, passing through the
**classical computer** (bits, logic gates, binary addition, search, complexity, reversibility)
and arriving at the **quantum Fourier transform**, **phase estimation** and **Shor's
algorithm**. Every concept has a mini-game: you move first, you understand second. Underneath
sits a state-vector quantum simulator written from scratch and checked by the tests: the QFT
circuit reproduces the Fourier matrix **exactly**.

Every quantum level opens with a **side-by-side comparison**: how you would do the same thing
with an ordinary computer, what changes with a quantum one, and the number that says how much
the difference is worth. Because "quantum" is not a thing: it is a difference, and a difference
is only visible when you have something to compare it against.

Where the comparison is worth a round rather than a paragraph, both modes live **inside the
same mini-game**, with a switch that changes machine: same screen, same buttons, same mission —
only the mechanism changes. And in classical mode some missions **cannot be won**: the wall is
the lesson.

| | |
|---|---|
| **Who it is for** | Anyone from the end of middle school up. No physics or computing background needed. |
| **How long** | 10–20 minutes per level. A long afternoon for the whole path. |
| **How you progress** | By demonstrating mastery: a hands-on mission **and** a recall quiz. |
| **What is at the end** | A workshop where you invent your own algorithms, and an exam with a verifiable certificate. |
| **In which languages** | Italian (original), English and Spanish: three complete editions, exam and certificate included. |
| **How you switch language** | From the 🌐 at the top, on every page. You stay where you are, and each language is written in its own language. |

It is **a single Laravel project**: the game lives in `public_html/`, the APIs and the dynamic
pages are handled by the modules. One domain, one deploy, no build step.

---

## Running it locally

```bash
composer install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite && php artisan migrate

npm install          # only for the tests (Playwright)
npm start            # → http://127.0.0.1:8010
```

With `MAIL_MAILER=log` the confirmation emails land in `storage/logs/laravel.log`:
handy for trying registration without configuring a mail server.

---

## Layout

```
public_html/               DOCUMENT ROOT (name imposed by Hostinger) — assets and front controller only
  index.php                Laravel's front controller
  css/style.css            the single theme
  js/core/                 the game engine
    levels.js              level order and prerequisites (source of truth)
    qsim.js                quantum simulator (amplitudes, gates, measurement, QFT)
    dsp.js                 DFT / FFT / winding
    store.js               XP, mastery, review (Leitner)
    account.js  api.js     registration, session, synchronisation
    canvas.js  audio.js    2D graphics engine + arcade sounds
    lesson.js  ui.js  formula.js
    i18n.js                page language, t(), addresses of the other editions
    confronto.js           the "classical ⇄ quantum" block that opens the lessons
    glossario.js           the course's terms (source of truth: the panel, the tap-to-define
                           definitions and the level 23 table all read from here)
  js/i18n/en.js  es.js     the dictionaries: the Italian sentence is the key
  js/widgets/              the mini-games (one or more per level)
    classic.js  classic2.js  the classical-computer ones: switches, logic gates, adder,
                           search, growth curves, reversible gates, classical oracle,
                           repetition code
    coppie.js              the paired exercises: the same board with a switch that moves
                           from the ordinary computer to the quantum one
                           (register, gates, Bell challenge, two roads)

lang/en.json  lang/es.json  the same translations for the Laravel side (__())

resources/views/           THE PAGES. One view per page per language, one layout for all
  layouts/page.blade.php   the <head> of every page: title, canonical, hreflang, structured data
  layouts/lesson.blade.php a lesson's title and description, taken from levels.js
  partials/                the language picker, in one place
  pages/{it,en,es}/        home, method, privacy
  lessons/{it,en,es}/      the 34 levels, named after the ID (the slug lives in the address)

config/site.php            GENERATED from levels.js with `npm run sync`: languages, levels,
                           slugs, titles. This is where the routes and the <head> come from

data/exam-bank-sample.js   public question bank (for contributors)
                           the real exam lives in exam-bank-private.js, which is NOT in git

Modules/                   nwidart modules
  Accounts/                registration, email confirmation, sign-in, profile
  Progress/                progress saved on the server
  Certificates/            server-side exam marking, PDF certificate, public verification
  Chat/                    AI tutor (Neuron AI, RAG over the site's content, local embeddings)

tests/
  Feature/Modules/         PHP tests for the four modules (100% coverage)
  js/unit/                 game-engine tests (100% of lines)
  js/e2e/                  Playwright: user journey + visual audit
tools/                     validator, mathematical checks, exam sync
docs/BACKEND.md            architecture and going live on Hostinger
```

---

## Testing

```bash
npm test                 # game engine (140 tests) + validator + language status
npm run test:coverage    # frontend coverage
npm run test:php         # 118 tests for the Laravel modules
npm run test:php:coverage
npm run test:e2e         # Playwright: user journey, visual audit of every page, the three languages
npm run test:cross  # compares the simulator against QuantumSim (an independent implementation)
npm run test:all         # everything
```

Where it stands: **frontend 100% of lines · backend 100%**. The two counts above are not
decorative: `npm run validate` compares them with the tests that actually exist and stops if
somebody adds a test without updating them — exactly what already happened with the number of
levels printed on the certificate.

The validator (`npm run validate`) checks JS syntax, the inline scripts inside the pages,
resolvable imports, balanced HTML tags, missing assets, consistency with `levels.js`, and PHP,
JSON and SVG syntax. Run it before every release.

Across the three languages it also checks that none of them falls behind: a published language
must have **every** lesson, the number of levels spelled out in words must match in all three,
and the sitemap must list every page of every edition. `npm run languages` compares the
sentences used in the code against the dictionaries and fails if one is missing — so a new
sentence added in Italian does not stay invisible until somebody happens to open the Spanish
page.

---

## Maintenance

| When | Command |
|---|---|
| You changed the levels | `php artisan chat:ingest` (realigns the tutor) |
| You added or renamed pages | `npm run sitemap` |
| You added sentences to translate | `npm run languages` (`--fix` prepares the missing keys) |
| You changed the exam (`data/exam-bank-*.js`) | `npm run exam:sync` |
| You want to know where the course is unclear | `php artisan chat:report` |
| Before releasing | `npm run test:all` |
| On the server, after every upload | `bash tools/deploy.sh` |
| To know whether the server is healthy | `php artisan site:check --production` |

---

## Going live (Hostinger, a single domain)

On Hostinger the web root is already `public_html`: you upload the project into the home
directory and it works.

```bash
cp .env.example .env && nano .env     # once only
php artisan key:generate
bash tools/deploy.sh            # dependencies, migrations, caches, tutor index, checks
```

The script's last step is `php artisan site:check --production`, which verifies one by one the
things you would otherwise hear about from your users — a `.env` downloadable from the web,
`APP_DEBUG` left on, SMTP not configured, the PDF pointed at the wrong folder — and for each
one says **how to fix it**.

Full instructions, environment variables and cron: [docs/BACKEND.md](docs/BACKEND.md).

---

## Contributing

The project is open: corrections, new levels, translations, better mini-games.
**[CONTRIBUTING.md](CONTRIBUTING.md)** explains where to start based on how much time you have —
ten minutes for a typo, half a day for a whole level — and is built around the barriers that
research has measured for newcomers to open source projects.

The most valuable contribution is not code: it is **telling me where it does not make sense**.
There is an issue template for exactly that.

Before opening a pull request: `npm run test:all`.

- [Code of conduct](CODE_OF_CONDUCT.md) — in short: people arrive here not knowing things, and
  making someone feel stupid works against the point of the project.
- [Security](SECURITY.md) — vulnerabilities are reported privately.

## Licence — free, but not commercial

The project is open: you can read it, study it, modify it, translate it, install it on your own
server and use it in state schools. What you cannot do, without an agreement, is **make money
from it**: resell it or teach it on a paid course.

| | Licence | In practice |
|---|---|---|
| **Code** (PHP, JS, CSS, tests) | [PolyForm Noncommercial 1.0.0](LICENSE) | use it and modify it for any non-commercial purpose |
| **Teaching content** (text, quizzes, glossary) | [CC BY-NC-SA 4.0](LICENSE) | reuse it with attribution, not for profit, under the same licence |
| **The author's photograph** | all rights reserved | not reusable outside this project |

**State schools, research and non-profits: always free.** State and state-recognised schools,
universities, libraries, public bodies, non-profit associations, free after-school clubs and
anyone studying on their own may use it without asking for anything.

**Paid training: an agreement is needed.** Private academies, vocational training bodies,
corporate courses, bootcamps and paid tutoring are commercial uses — not forbidden, but to be
agreed. This holds even when what is sold is the teaching rather than the material: if the
student pays, it goes through an agreement. It is usually a formality:
[get in touch](https://calendly.com/davidecavallini1987/meeting).

**By contributing** you accept that your contribution goes out under these same licences and
that the author may include it in any commercial licences: without that, a single contribution
would block the project forever. The detail, and the reasoning, are in point 5 of
[LICENSE](LICENSE).

> A note for those who know the definitions: a non-commercial licence is **not** "open source"
> under the Open Source Initiative, because it restricts fields of use. It is a deliberate
> choice: the code stays readable, modifiable and improvable by anyone, but the work does not
> end up resold by someone else.

## Acknowledgements

**Francesco Sisini** — for [QuantumSim](https://github.com/francescosisini/QuantumSim), his quantum circuit
simulator in C, which here serves as an **independent implementation** to check this project's simulator
against: three hundred randomly generated circuits, two programs written by different people in different
languages, maximum discrepancy on the order of 10⁻¹⁵. I thank him for freely allowing its use, and above all
because **it is from his books that I started learning this subject**.

> QuantumSim is released under the GNU GPL v3 and is **not included in this project**: `npm run test:cross`
> downloads it into `.quantumsim/` (outside git), compiles it and queries it. It remains a test-bench tool,
> not a dependency of the site.

## Credits

Content and code by **Davide Cavallini** — [YouTube](https://www.youtube.com/@informaticacavallini)
· [LinkedIn](https://www.linkedin.com/in/davidecavallini/)
· [Red Hot Cyber](https://www.redhotcyber.com/post/author/davide-cavallini/)

The scientific sources the teaching method is built on are listed, one by one, in the *method*
page: [`resources/views/pages/en/method.blade.php`](resources/views/pages/en/method.blade.php).
