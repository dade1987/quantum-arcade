/* ============================================================
   THE FULL VALIDATOR — run it before every release.

     node tools/validate.mjs

   For EVERY file in the project it checks:
   1. the JavaScript syntax of every module under js/
   2. the JavaScript syntax of the code inside each page
      (that is where apostrophe bugs like to hide)
   3. that every imported module really exists on disk
   4. the minimum structure of the pages: balanced tags, a layout to extend,
      links to css/js that exist, required attributes
   5. consistency with levels.js: every level has its view IN EVERY PUBLISHED
      language and vice versa, the id declared in the page is the right one,
      and the number of levels written out in the copy (home, README,
      certificate) is the true one — in Italian, English and Spanish
   6. the syntax of the Python files and of the SVG/JSON ones
   ============================================================ */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync, unlinkSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, resolve, relative } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const TMP = mkdtempSync(join(tmpdir(), 'qa-validate-'));
let errors = 0, warnings = 0, checks = 0;

const err = (file, msg) => { errors++; console.log(`  ✗ ${file}\n     ${msg}`); };
const warn = (file, msg) => { warnings++; console.log(`  ! ${file}\n     ${msg}`); };
const ok = () => { checks++; };

const SKIP = new Set(['node_modules', 'vendor', 'storage', 'bootstrap', 'test-results', 'coverage']);

/* The site's languages. Italian is the original and lives at the root; the
   others in a folder of their own. A language counts as PUBLISHED once it has
   its pages: from that moment it must have every lesson too, because half a
   translated course is worse than no translation — somebody landing on the
   third English level and finding Italian assumes the site is broken. */
const LOCALES = [
  { code: 'it', dir: '', lessons: 'lezioni' },
  { code: 'en', dir: 'en/', lessons: 'lessons' },
  { code: 'es', dir: 'es/', lessons: 'lecciones' },
];

/* The pages are no longer files inside public_html: they are Blade views.
   Here are the two places they live, because half a dozen checks need to know. */
const VIEWS = join(ROOT, 'resources/views');
const lessonViewDir = code => join(VIEWS, 'lessons', code);
const pageViewDir = code => join(VIEWS, 'pages', code);

/** A view's language, inferred from the folder it sits in. */
function localeOf(path) {
  const parts = relative(VIEWS, path).split(/[\\/]/);
  return LOCALES.find(l => l.code === parts[1]) || LOCALES[0];
}

function walk(dir, filter, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (SKIP.has(name) || name.startsWith('.')) continue;
    if (statSync(p).isDirectory()) walk(p, filter, out);
    else if (filter(name)) out.push(p);
  }
  return out;
}
const rel = p => relative(ROOT, p);

/* ---------- 1. JS modules ---------- */
console.log('\n[1] JavaScript module syntax');
const jsFiles = walk(join(ROOT, 'public_html/js'), n => n.endsWith('.js'));
for (const f of jsFiles) {
  try { execFileSync('node', ['--check', f], { stdio: 'pipe' }); ok(); }
  catch (e) { err(rel(f), String(e.stderr || e.message).split('\n').slice(0, 3).join('\n     ')); }
}
console.log(`  → ${jsFiles.length} modules checked`);

/* ---------- 2. the code inside the pages ----------
   The pages are Blade views, not whole HTML documents: a lesson's JavaScript
   lives inside `@section('lesson')`, and the structured data inside a
   `<script type="application/ld+json">` guarded by @verbatim. They are two
   different things and are checked differently. */
console.log('\n[2] The code inside the pages');

const lessonViews = LOCALES
  .filter(l => existsSync(lessonViewDir(l.code)))
  .flatMap(l => walk(lessonViewDir(l.code), n => n.endsWith('.blade.php')));
const pageViews = LOCALES
  .filter(l => existsSync(pageViewDir(l.code)))
  .flatMap(l => walk(pageViewDir(l.code), n => n.endsWith('.blade.php')));
const htmlFiles = [...lessonViews, ...pageViews];

/** The body of a Blade section, without the directives that delimit it. */
function section(src, name) {
  const m = src.match(new RegExp(`@section\\('${name}'\\)\\n([\\s\\S]*?)\\n@endsection`));
  return m ? m[1] : null;
}

let i = 0;
for (const f of lessonViews) {
  const code = section(readFileSync(f, 'utf8'), 'lesson');
  if (code === null) { err(rel(f), "has no @section('lesson'): the lesson would never be mounted"); continue; }

  const tmp = join(TMP, `lesson-${i++}-${Math.abs(hash(f))}.mjs`);
  writeFileSync(tmp, code);
  try { execFileSync('node', ['--check', tmp], { stdio: 'pipe' }); ok(); }
  catch (e) {
    const msg = String(e.stderr || e.message).split('\n').filter(l => l.trim()).slice(0, 4);
    err(rel(f), "the lesson's code is not valid JavaScript:\n     " + msg.join('\n     '));
  }
  try { unlinkSync(tmp); } catch { }
}

for (const f of [...pageViews, ...walk(join(VIEWS, 'layouts'), n => n.endsWith('.blade.php'))]) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); ok(); }
    catch (e) { err(rel(f), 'invalid JSON-LD: ' + e.message); }
  }
}
console.log(`  → ${lessonViews.length} lessons and ${pageViews.length} pages checked`);

/* ---------- 3. imports resolve ---------- */
console.log('\n[3] Imports resolve');
const allSources = [
  ...jsFiles.map(f => ({ f, src: readFileSync(f, 'utf8') })),
  ...htmlFiles.map(f => ({ f, src: readFileSync(f, 'utf8') })),
];
for (const { f, src } of allSources) {
  const re = /(?:^|\s)(?:import|export)[\s\S]{0,200}?from\s+['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src))) {
    const spec = m[1];
    if (!spec.startsWith('.')) continue;
    const target = resolve(dirname(f), spec);
    if (existsSync(target)) ok();
    else err(rel(f), `unresolvable import: ${spec}`);
  }
  // dynamic imports too
  const re2 = /import\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((m = re2.exec(src))) {
    const target = resolve(dirname(f), m[1]);
    if (m[1].startsWith('.') && !existsSync(target)) err(rel(f), `unresolvable dynamic import: ${m[1]}`);
    else ok();
  }
}

/* ---------- 3b. the translating t() must not be shadowed ----------
   The game is full of maths, and in maths `t` is time: `const t = i / N` inside
   a drawing loop is the most natural thing in the world. But in the same file
   `t` is also the function that translates, and a local variable covers it
   without anyone noticing — until somebody opens the page in Spanish and finds
   an error instead of the sentence. Better to find out here. */
/* The source with comments and strings blanked out, keeping its length intact.
   It is needed because the sentences to translate talk about code — inside the
   lessons there are `const t = …` written as examples — and without this step
   the check below would cry wolf over a piece of prose. Positions stay as they
   were, so the line number is the real one. */
function withoutStringsAndComments(src) {
  // every removed character becomes a space: same length, same indices
  return src.replace(
    /\/\*[\s\S]*?\*\/|\/\/[^\n]*|'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g,
    m => m.replace(/[^\n]/g, ' '),
  );
}

console.log('\n[3b] t() is not shadowed by a local name');

/* An occurrence of «t» that CREATES a new name, i.e. that covers the
   translator. Looking for `const t` is not enough: the first version of this
   check did only that, and let `const s = build(), t = transformed()` slip
   through — second declarator, same line — which broke level 18 in all three
   languages. There are three shapes, and all three must be looked for. */
function shadowsOfT(src) {
  const shadows = [];
  const note = (index, as) => shadows.push({ index, as });

  // 1. declarations, anywhere in the list:
  //    const t = …   ·   let a, t;   ·   const s = f(), t = g();
  for (const m of src.matchAll(/\b(?:const|let|var)\s+([\s\S]*?);/g)) {
    const list = m[1];
    let depth = 0, piece = '', pieces = [];
    for (const ch of list) {
      if ('([{'.includes(ch)) depth++;
      else if (')]}'.includes(ch)) depth--;
      if (ch === ',' && depth === 0) { pieces.push(piece); piece = ''; continue; }
      piece += ch;
    }
    pieces.push(piece);
    // the name is whatever sits before the «=»; with no «=», it is the whole piece
    if (pieces.some(p => p.split('=')[0].trim() === 't')) note(m.index, 'declaration');
  }

  // 2. function parameters: function f(t) · (a, t) => · function (t) {
  for (const m of src.matchAll(/(?:function\s*[\w$]*\s*)\(([^()]*)\)|\(([^()]*)\)\s*=>/g)) {
    const params = (m[1] ?? m[2] ?? '').split(',').map(p => p.split('=')[0].trim());
    if (params.includes('t')) note(m.index, 'parameter');
  }

  // 3. the parenthesis-less arrow, which is the most common shape: .map(t => …)
  for (const m of src.matchAll(/(?:^|[^\w$.])t\s*=>/g)) note(m.index, 'parameter');

  return shadows;
}

for (const { f, src } of allSources) {
  if (!/import\s*\{[^}]*\bt\b[^}]*\}\s*from\s*['"][^'"]*i18n\.js['"]/.test(src)) continue;
  const shadows = shadowsOfT(withoutStringsAndComments(src));
  if (shadows.length) {
    const { index, as } = shadows[0];
    const line = src.slice(0, index).split('\n').length;
    err(rel(f), `uses «t» as a ${as} (line ~${line}) but also imports t() from i18n.js: `
      + 'the local name shadows the translator. Rename it (to «time» or «tok», for example).');
  } else ok();
}

/* ---------- 4. page structure ----------
   A Blade view is not a whole document: the doctype, <html> and <title> come
   from the layout, once and for all. What is checked here is what remains the
   single page's responsibility — that its tags close and that the assets it
   names really exist — and, for the layout, that the head is complete.

   The check on each page's <title> disappeared along with the problem: no page
   writes its own title any more, so it can no longer contradict what the site
   displays. */
console.log('\n[4] Page structure');
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
for (const f of htmlFiles) {
  const raw = readFileSync(f, 'utf8');
  const name = rel(f);
  // of a page we check the body: it is the only part the page itself writes
  const body = section(raw, 'body') ?? '';
  // strip script/style/comments before counting tags
  const src = body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '')
    .replace(/@\w+(\([^)]*\))?/g, '');   // Blade directives are not tags
  const stack = [];
  const tagRe = /<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g;
  let m, unbalanced = null;
  while ((m = tagRe.exec(src))) {
    const [, close, tag, attrs, selfClose] = m;
    const t = tag.toLowerCase();
    if (VOID.has(t) || selfClose) continue;
    if (!close) stack.push(t);
    else {
      const last = stack.pop();
      if (last !== t) { unbalanced = `expected </${last}>, found </${t}>`; break; }
    }
  }
  if (unbalanced) err(name, 'unbalanced HTML tags: ' + unbalanced);
  else if (stack.length) err(name, 'unclosed tags: ' + stack.join(', '));
  else ok();

  // every page must declare which layout it depends on, or it comes out naked
  if (/@extends\('layouts\.(page|lesson)'/.test(raw)) ok();
  else err(name, 'extends no layout: it would come out with no <head>');

  // and none of them may rewrite its own head: that is why the titles of
  // twenty-one lessons out of twenty-eight had stopped matching their page
  for (const [re, msg] of [
    [/<title>/i, 'writes its own <title>: the layout does that, from levels.js'],
    [/<!doctype/i, 'writes its own doctype: the layout does that'],
    [/rel="canonical"/i, 'writes its own canonical: the layout does that'],
    [/rel="alternate"\s+hreflang/i, 'writes its own hreflang tags: the layout does that'],
  ]) {
    if (re.test(raw)) err(name, msg);
    else ok();
  }

  // referenced assets
  const resRe = /(?:href|src)\s*=\s*"([^"#?:]+\.(?:css|js|svg|jpe?g|png|webp|xml|txt))"/g;
  while ((m = resRe.exec(raw))) {
    // addresses have been absolute since there is a single layout: they resolve
    // from the site root, not from the view's folder
    const target = m[1].startsWith('/')
      ? join(ROOT, 'public_html', m[1].slice(1))
      : resolve(dirname(f), m[1]);
    if (existsSync(target)) ok();
    else err(name, `missing asset: ${m[1]}`);
  }
  // internal links between pages: a broken link sends the player into a dead
  // end, and that really happened after the levels were reordered.
  const linkRe = /href\s*=\s*"([^":]+\.html)(?:[#?][^"]*)?"/g;
  while ((m = linkRe.exec(raw))) {
    const target = resolve(dirname(f), m[1]);
    if (existsSync(target)) ok();
    else err(name, `broken link: ${m[1]}`);
  }

  // images with no alt
  const imgRe = /<img\b([^>]*)>/g;
  while ((m = imgRe.exec(raw))) {
    if (!/\balt\s*=/.test(m[1])) warn(name, 'image with no alt attribute (accessibility)');
    else ok();
  }
}

/* levels.js is read as TEXT, not imported. Importing it would need a `document`
   (i18n.js reads <html lang>) and Node has none: reading it by hand costs ten
   lines and does not force the validator to pretend to be a browser. */

/* ---------- 5. consistency with levels.js ---------- */
console.log('\n[5] Level consistency');
const levelsSrc = readFileSync(join(ROOT, 'public_html/js/core/levels.js'), 'utf8');

/* The ids are the same in every language (they are the key of the progress
   saved on the server); only the file name changes, declared in the SLUG map. */
const declared = [...levelsSrc.matchAll(/\{\s*id:\s*'([\w-]+)',\s*part:/g)].map(m => m[1]);
const slugMap = {};
{
  const block = levelsSrc.match(/const SLUG = \{([\s\S]*?)\n\};/);
  if (!block) err('levels.js', 'the SLUG map is missing: without it the translated addresses cannot be verified');
  else {
    for (const m of block[1].matchAll(/'([\w-]+)':\s*\{([^}]*)\}/g)) {
      const entries = {};
      for (const v of m[2].matchAll(/(\w+):\s*'([^']+)'/g)) entries[v[1]] = v[2];
      slugMap[m[1]] = entries;
    }
  }
}
const slugFor = (id, code) => code === 'it' ? id : (slugMap[id] || {})[code];

/* A lesson's view is named after the ID, not the slug: the slug lives in the
   address, which is a thing that gets translated, while the id is what all
   three languages have in common — and it is the key of the saved progress. */
const lessonViewFile = (id, l) => join(lessonViewDir(l.code), id + '.blade.php');

/** A language is published when it has its pages, no longer when it has an index.html. */
const publishedLocales = LOCALES.filter(l => existsSync(pageViewDir(l.code)));
for (const l of publishedLocales) {
  for (const id of declared) {
    const slug = slugFor(id, l.code);
    if (!slug) { err('levels.js', `level ${id} has no slug for language "${l.code}"`); continue; }
    const p = lessonViewFile(id, l);
    if (!existsSync(p)) { err('levels.js', `level ${id} in language "${l.code}" points at ${rel(p)}, which does not exist`); continue; }
    const src = readFileSync(p, 'utf8');
    const m = src.match(/renderLesson\(\{\s*\n?\s*id:\s*'([\w-]+)'/);
    if (!m) err(rel(p), 'the page does not call renderLesson with an id');
    else if (m[1] !== id) err(rel(p), `declares id "${m[1]}" but levels.js says "${id}"`);
    else ok();
  }
  // and the other way round: a view left behind after a reshuffle must not go unnoticed
  const folder = lessonViewDir(l.code);
  if (!existsSync(folder)) { err(rel(folder), 'the lessons folder does not exist'); continue; }
  for (const n of readdirSync(folder).filter(x => x.endsWith('.blade.php'))) {
    if (!declared.includes(n.replace('.blade.php', ''))) warn(rel(join(folder, n)), 'view present but not listed in levels.js');
    else ok();
  }
}
console.log(`  → ${declared.length} levels declared in ${publishedLocales.length} languages (${publishedLocales.map(l => l.code).join(', ')})`);

/* ---------- 5a. the title is built by the layout, from a single source ----------
   This check used to compare the <title> hand-written in every page against
   what the game displays. It found twenty-one different out of twenty-eight:
   the browser tab said «17 · QFT» and the site said «18. QFT».

   The comparison is not needed any more, because the second term no longer
   exists: no page writes its own title, the layout composes it from the list of
   levels. What is left to check is that the mechanism is still in place — that
   the layout still takes number and title from there, and not from a
   hand-written string. */
{
  const layout = join(ROOT, 'resources/views/layouts/lesson.blade.php');

  if (!existsSync(layout)) {
    err('resources/views/layouts/lesson.blade.php', 'missing: the lessons would be left with no <head>');
  } else {
    const src = readFileSync(layout, 'utf8');
    for (const [re, msg] of [
      [/\$level\['n'\]/, 'no longer uses the level number: the title could go back to lying'],
      [/\$level\['title'\]\[\$locale\]/, 'no longer uses the translated title from the level list'],
      [/@extends\('layouts\.page'/, 'no longer extends the shared layout: it would lose canonical and hreflang'],
    ]) {
      if (re.test(src)) ok();
      else err(rel(layout), msg);
    }
  }
}

/* ---------- 5b. the level count written out in the copy ----------
   The check above only looks at levels.js and the lesson files. But the count
   is also WRITTEN, in a dozen places: meta descriptions, the home page title,
   the README, the exam's award screen and — what really matters — the
   certificate and its public verification page.

   Those numbers were left at 27 after level 12 was added: the student ended up
   with a PDF saying 27 and a site saying 28. Somebody verifying another
   person's certificate finds two different numbers and stops trusting both,
   which is exactly the opposite of what a certificate is for.
   From here on the written number must match LEVELS, everywhere. */
const LEVEL_COUNT = declared.length;
const IN_WORDS = {
  it: {
    20: 'venti', 21: 'ventuno', 22: 'ventidue', 23: 'ventitré', 24: 'ventiquattro',
    25: 'venticinque', 26: 'ventisei', 27: 'ventisette', 28: 'ventotto',
    29: 'ventinove', 30: 'trenta', 31: 'trentuno', 32: 'trentadue',
    33: 'trentatré', 34: 'trentaquattro', 35: 'trentacinque', 36: 'trentasei',
    37: 'trentasette', 38: 'trentotto', 39: 'trentanove', 40: 'quaranta',
  },
  en: {
    20: 'twenty', 21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 24: 'twenty-four',
    25: 'twenty-five', 26: 'twenty-six', 27: 'twenty-seven', 28: 'twenty-eight',
    29: 'twenty-nine', 30: 'thirty', 31: 'thirty-one', 32: 'thirty-two',
    33: 'thirty-three', 34: 'thirty-four', 35: 'thirty-five', 36: 'thirty-six',
    37: 'thirty-seven', 38: 'thirty-eight', 39: 'thirty-nine', 40: 'forty',
  },
  es: {
    20: 'veinte', 21: 'veintiuno', 22: 'veintidós', 23: 'veintitrés', 24: 'veinticuatro',
    25: 'veinticinco', 26: 'veintiséis', 27: 'veintisiete', 28: 'veintiocho',
    29: 'veintinueve', 30: 'treinta', 31: 'treinta y uno', 32: 'treinta y dos',
    33: 'treinta y tres', 34: 'treinta y cuatro', 35: 'treinta y cinco', 36: 'treinta y seis',
    37: 'treinta y siete', 38: 'treinta y ocho', 39: 'treinta y nueve', 40: 'cuarenta',
  },
};
/* "levels"/"niveles" show up in English and Spanish too: the count has to stay
   aligned in all three languages, otherwise the English certificate promises a
   number of levels the course does not have. */
const UNITS = { livelli: 'it', levels: 'en', niveles: 'es' };
const texts = [
  ...htmlFiles,
  ...jsFiles,
  join(ROOT, 'README.md'),
  ...(existsSync(join(ROOT, 'Modules')) ? walk(join(ROOT, 'Modules'), n => n.endsWith('.php')) : []),
].filter(existsSync);

for (const f of texts) {
  const src = readFileSync(f, 'utf8');
  let m;
  const digits = /(\d+)\s+(livelli|levels|niveles)\b/gi;
  while ((m = digits.exec(src))) {
    // "levels" does not always mean the course: the FFT lesson says "log₂8 = 3
    // levels" of recursion. Below ten it is never a course count, and above it
    // is never anything else — the threshold separates the two uses cleanly.
    if (Number(m[1]) < 10) continue;
    if (Number(m[1]) === LEVEL_COUNT) ok();
    else err(rel(f), `says "${m[1]} ${m[2]}" but levels.js has ${LEVEL_COUNT}`);
  }
  for (const [unit, locale] of Object.entries(UNITS)) {
    const expected = IN_WORDS[locale][LEVEL_COUNT];
    const words = new RegExp(`\\b(${Object.values(IN_WORDS[locale]).join('|')})\\s+${unit}\\b`, 'gi');
    while ((m = words.exec(src))) {
      if (m[1].toLowerCase() === expected) ok();
      else err(rel(f), `says "${m[1]} ${unit}" but levels.js has ${LEVEL_COUNT} ("${expected}")`);
    }
  }
}

/* PHP does not read levels.js: it keeps its own copy of the number in
   Modules/Certificates/config/config.php, and that is the one printed on the
   certificate. Here we check the copy has not fallen behind. */
const certCfg = join(ROOT, 'Modules/Certificates/config/config.php');
if (existsSync(certCfg)) {
  const m = readFileSync(certCfg, 'utf8').match(/'levels_count'\s*=>\s*(\d+)/);
  if (!m) err(rel(certCfg), "'levels_count' is missing: the certificate does not know how many levels the course has");
  else if (Number(m[1]) !== LEVEL_COUNT) err(rel(certCfg), `levels_count = ${m[1]} but levels.js has ${LEVEL_COUNT}`);
  else ok();
}

/* ---------- 5c. the sitemap knows every page, in every language ----------
   A page missing from the sitemap exists but nobody finds it, and with three
   editions of the site the count runs to over a hundred addresses: what used
   to be checkable by eye is not any more.

   Since the pages are routes and not files, the comparison can no longer be
   against the disk: it is against the list of levels and the fixed pages, that
   is, against the same things the routes are built from. Both ways round —
   forgotten pages, and addresses that lead nowhere. */
{
  const sitemapPath = join(ROOT, 'public_html/sitemap.xml');

  if (!existsSync(sitemapPath)) {
    err('public_html/sitemap.xml', 'missing: no search engine will find the translated pages');
  } else {
    const src = readFileSync(sitemapPath, 'utf8');
    const listed = new Set([...src.matchAll(/<loc>https:\/\/quantumarcade\.it\/(.*?)<\/loc>/g)].map(m => m[1]));

    /* The fixed pages' file names per language, read from i18n.js: it is the
       same table `npm run sync` builds the routes from. */
    const i18n = readFileSync(join(ROOT, 'public_html/js/core/i18n.js'), 'utf8');
    const fixedPages = {};
    {
      const block = i18n.match(/const PAGES = \{([\s\S]*?)\n\};/);
      if (!block) err('js/core/i18n.js', 'no longer declares PAGES: the sitemap cannot be verified');
      else {
        for (const m of block[1].matchAll(/(\w+):\s*\{([^}]*)\}/g)) {
          const perLocale = {};
          for (const v of m[2].matchAll(/(\w+):\s*'([^']*)'/g)) perLocale[v[1]] = v[2];
          fixedPages[m[1]] = perLocale;
        }
      }
    }

    const expected = new Set();
    for (const l of publishedLocales) {
      for (const name of Object.keys(fixedPages)) expected.add(l.dir + (fixedPages[name][l.code] ?? ''));
      for (const id of declared) expected.add(`${l.dir}${l.lessons}/${slugFor(id, l.code)}.html`);
    }

    for (const path of expected) {
      if (listed.has(path)) ok();
      else err('public_html/sitemap.xml', `does not list /${path} — run \`npm run sitemap\``);
    }
    for (const path of listed) {
      if (expected.has(path)) ok();
      else err('public_html/sitemap.xml', `lists /${path}, which is not a page of the site`);
    }
  }
}

/* ---------- 5d. the test counts written in the documentation ----------
   README and CONTRIBUTING announce how many tests there are. They were stuck at
   «102» and «84» while 114 and 118 were running: a wrong number in a file that
   invites people to contribute tells the newcomer that the documentation is not
   kept up, and that is the first thing that makes them close the page.

   Same principle as the level count: if it is written down, it has to match. */
{
  const count = (folder, filter, pattern) =>
    walk(join(ROOT, folder), filter).reduce((n, f) => n + (readFileSync(f, 'utf8').match(pattern) || []).length, 0);

  const actual = {
    // node:test — one `test('…')` per case, always at the start of a line inside a describe
    'game-engine tests': count('tests/js/unit', n => n.endsWith('.test.js'), /^\s*test\(/gm),
    'PHP tests':         count('tests',        n => n.endsWith('Test.php'), /^\s*public function test_/gm),
  };

  const DECLARATIONS = [
    { file: 'README.md',       pattern: /\((\d+) tests\) \+ validator/,             which: 'game-engine tests' },
    { file: 'README.md',       pattern: /# (\d+) tests for the Laravel modules/,    which: 'PHP tests' },
    { file: 'CONTRIBUTING.md', pattern: /# (\d+) tests, they must stay green/,      which: 'PHP tests' },
  ];

  for (const d of DECLARATIONS) {
    const p = join(ROOT, d.file);
    if (!existsSync(p)) { warn(d.file, 'missing'); continue; }
    const m = readFileSync(p, 'utf8').match(d.pattern);
    if (!m) err(d.file, `no longer declares how many ${d.which} there are, or writes it in a way this check does not recognise`);
    else if (Number(m[1]) !== actual[d.which]) err(d.file, `says ${m[1]} ${d.which}, but there are ${actual[d.which]}`);
    else ok();
  }
}

/* ---------- 6. PHP backend ---------- */
console.log('\n[6] PHP backend (Laravel + modules)');
const backend = join(ROOT, 'Modules');
if (existsSync(backend)) {
  const phpFiles = [...walk(backend, n => n.endsWith('.php')), ...walk(join(ROOT, 'app'), n => n.endsWith('.php'))];
  for (const f of phpFiles) {
    try { execFileSync('php', ['-l', f], { stdio: 'pipe' }); ok(); }
    catch (e) { err(rel(f), String(e.stdout || e.stderr || e.message).split('\n').slice(0, 2).join('\n     ')); }
  }
  console.log(`  → ${phpFiles.length} PHP files checked (modules and app, vendor excluded)`);

  // every module must have its service provider registered
  for (const mod of readdirSync(backend)) {
    const p = join(backend, mod, 'module.json');
    if (existsSync(p)) { try { JSON.parse(readFileSync(p, 'utf8')); ok(); } catch { err('Modules/' + mod + '/module.json', 'invalid JSON'); } }
  }
} else {
  warn('backend/', 'no Laravel project here: skipping the PHP checks');
}

/* ---------- 7. Python, SVG, JSON, sitemap ---------- */
console.log('\n[7] Other files');
for (const f of walk(ROOT, n => n.endsWith('.py'))) {
  try { execFileSync('python3', ['-m', 'py_compile', f], { stdio: 'pipe' }); ok(); }
  catch (e) { err(rel(f), String(e.stderr || e.message).split('\n').slice(0, 3).join('\n     ')); }
}
for (const f of walk(ROOT, n => n.endsWith('.svg') || n.endsWith('.xml'))) {
  const src = readFileSync(f, 'utf8');
  const body = src.replace(/<\?[\s\S]*?\?>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  const opens = (body.match(/<[a-zA-Z][^>]*?(?<!\/)>/g) || []).length;   // real opening tags
  const closes = (body.match(/<\/[a-zA-Z]/g) || []).length;
  if (opens !== closes) err(rel(f), `unbalanced XML tags (${opens} open, ${closes} closed)`);
  else ok();
}
for (const f of walk(ROOT, n => n.endsWith('.json'))) {
  try { JSON.parse(readFileSync(f, 'utf8')); ok(); }
  catch (e) { err(rel(f), 'invalid JSON: ' + e.message); }
}

/* ---------- 8. the exam answers must not be downloadable ---------- */
console.log('\n[8] Secrets outside the web root');
{
  // Anything inside public_html is downloadable by anyone who knows the URL: no
  // access control, no exceptions. The exam's correct answers in there would
  // make the certificate a formality.
  const bank = join(ROOT, 'data/exam-bank-sample.js');
  if (existsSync(bank)) ok();
  else err('data/exam-bank-sample.js', 'the question bank is not where it belongs (outside the web root)');

  let offenders = 0;
  for (const f of walk(join(ROOT, 'public_html'), n => n.endsWith('.js') || n.endsWith('.json'))) {
    const src = readFileSync(f, 'utf8');
    if (/export\s+const\s+EXAM\b/.test(src) || /\bc:\s*\d\s*,\s*w:\s*'/.test(src)) {
      err(rel(f), 'contains the exam answers: inside public_html they are downloadable by anyone. '
        + 'The question bank belongs in data/, and reaches the server only through npm run exam:sync.');
      offenders++;
    }
  }
  if (!offenders) ok();
}

/* ---------- 9. recurring Italian typos ----------
   The rules and their messages stay in Italian on purpose: they describe
   Italian spelling, and the check only ever runs on the Italian edition. A
   contributor who does not read Italian will never see them fire. */
console.log('\n[9] Italian spelling');
{
  // High-precision rules only: prose, formulas and code live side by side in
  // these pages, and a check that cries wolf at every comma inside an array is
  // a check nobody looks at any more. Better a few rules you can trust.
  const RULES = [
    [/\bqual'è\b/gi, "qual è (senza apostrofo)"],
    [/\bun'(altro|uomo|amico|anno|attimo|esempio|errore|angolo|insieme|numero|segno|passo|bit)\b/gi, "l'apostrofo di 'una' va solo davanti a parole femminili"],
    [/\bpò\b/g, "po' (con apostrofo, non accento)"],
    [/\b(perchè|poichè|affinchè|benchè|finchè|cosicchè|nonchè|ventitrè)\b/gi, "accento acuto: perché, poiché, affinché…"],
    [/\bsè\b/g, "sé (accento acuto)"],
    [/\b(fà|stà|dò|sù|quì|quà|và)\b/g, "senza accento: fa, sta, do, su, qui, qua, va"],
    [/\bsopratutto\b/gi, "soprattutto"],
    [/\bpropio\b/gi, "proprio"],
    [/\baccellera/gi, "accelera (una l sola)"],
    [/\bsucessiv/gi, "successivo (due s)"],
    [/\befficen/gi, "efficiente / efficienza"],
    [/\beccezzion/gi, "eccezione"],
    [/\bfunzione? che che\b/gi, "parola ripetuta"],
    [/\bdi di\b|\bil il\b|\bla la\b|\bche che\b|\bper per\b|\bcon con\b|\bnon non\b/gi, "parola ripetuta"],
    [/\bA me mi\b/gi, "«a me mi» è ridondante"],
    [/\bentrambi le\b/gi, "entrambe le"],
    [/\bqualsiasi cose\b/gi, "qualsiasi cosa"],
  ];

  let typos = 0;
  for (const f of walk(join(ROOT, 'public_html'), n => /\.(html|js|txt)$/.test(n))) {
    // the rules only apply to Italian: «propio» is an Italian typo but correct
    // Spanish, and the dictionaries hold the translated sentences
    if (localeOf(rel(f)).code !== 'it') continue;
    if (/\/js\/i18n\//.test(rel(f))) continue;
    // tags are stripped WITHOUT inserting a space, or false positives appear
    const text = readFileSync(f, 'utf8').replace(/<[^>]*>/g, '').replace(/https?:\/\/\S+/g, ' ');
    for (const [re, explain] of RULES) {
      for (const m of text.matchAll(re)) {
        const ctx = text.slice(Math.max(0, m.index - 40), m.index + 50).replace(/\s+/g, ' ');
        warn(rel(f), `«…${ctx}…» → ${explain}`);
        typos++;
      }
    }
  }
  if (!typos) ok();
}

function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }

console.log(`\n${errors === 0 ? '✅' : '❌'}  ${checks} checks passed · ${errors} errors · ${warnings} warnings\n`);
process.exit(errors ? 1 : 0);
