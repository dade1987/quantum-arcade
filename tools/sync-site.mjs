/* ============================================================
   GENERATES config/site.php FROM THE GAME'S OWN SOURCE OF TRUTH.

     node tools/sync-site.mjs           rewrites the file
     node tools/sync-site.mjs --check   only checks it is up to date

   WHY THIS EXISTS

   Since the pages became Blade views, the server has to know things the
   browser already knew: which locales exist, what each one calls its
   lessons folder, and the slug and title of every level in every language.

   Those facts have exactly one home — public_html/js/core/levels.js — and
   they are going to stay there, because that is the file the game itself
   reads. Writing them a second time by hand in PHP would give the two
   copies a chance to disagree, and this project has already paid for that
   once: the level count printed on the certificate said 27 while the site
   said 28.

   So the PHP copy is generated, exactly like the exam question bank
   (tools/sync-exam.mjs), and `npm run validate` refuses to pass if it has
   fallen behind.
   ============================================================ */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const TARGET = join(ROOT, 'config/site.php');
const CHECK = process.argv.includes('--check');

const { LEVELS, slugOf } = await import(pathToFileURL(join(ROOT, 'public_html/js/core/levels.js')).href);
const { LOCALES, LOCALE_NAMES, LOCALE_TAGS } = await import(pathToFileURL(join(ROOT, 'public_html/js/core/i18n.js')).href);

/** A locale's dictionary, as a plain map. Italian is the identity. */
function dictionary(code) {
  if (code === 'it') return {};
  const path = join(ROOT, 'public_html/js/i18n', code + '.js');
  if (!existsSync(path)) return {};

  // keys and values use single or double quotes indifferently, and the value
  // may sit on the next line: the pair is recognised by its delimiters
  const pair = /(['"])((?:\\.|(?!\1)[^\\])*)\1\s*:\s*\n?\s*(['"])((?:\\.|(?!\3)[^\\])*)\3/g;
  const unescape = s => s.replace(/\\(['"\\])/g, '$1').replace(/\\n/g, '\n');
  const out = {};
  for (const m of readFileSync(path, 'utf8').matchAll(pair)) out[unescape(m[2])] = unescape(m[4]);
  return out;
}

/* The folder each locale calls its lessons, and the file name of every fixed
   page. Read from i18n.js rather than repeated here, for the same reason as
   everything else in this file. */
const i18nSource = readFileSync(join(ROOT, 'public_html/js/core/i18n.js'), 'utf8');

function objectLiteral(name) {
  const block = i18nSource.match(new RegExp(`${name}\\s*=\\s*\\{([^}]*)\\}`));
  if (!block) throw new Error(`i18n.js no longer declares ${name}: sync-site cannot generate the routes`);
  const out = {};
  for (const m of block[1].matchAll(/(\w+):\s*'([^']*)'/g)) out[m[1]] = m[2];
  return out;
}

const lessonDirs = objectLiteral('const LESSON_DIRS');
const pages = {};
{
  const block = i18nSource.match(/const PAGES = \{([\s\S]*?)\n\};/);
  if (!block) throw new Error('i18n.js no longer declares PAGES: sync-site cannot generate the routes');
  for (const m of block[1].matchAll(/(\w+):\s*\{([^}]*)\}/g)) {
    const perLocale = {};
    for (const v of m[2].matchAll(/(\w+):\s*'([^']*)'/g)) perLocale[v[1]] = v[2];
    pages[m[1]] = perLocale;
  }
}

/* ---------- writing the PHP ---------- */

const q = s => "'" + String(s).replaceAll('\\', '\\\\').replaceAll("'", "\\'") + "'";
const indent = n => ' '.repeat(n);

function phpArray(value, depth = 1) {
  if (Array.isArray(value)) {
    const items = value.map(v => `${indent(depth * 4)}${phpArray(v, depth + 1)},`);
    return `[\n${items.join('\n')}\n${indent((depth - 1) * 4)}]`;
  }
  if (value && typeof value === 'object') {
    const items = Object.entries(value).map(([k, v]) => `${indent(depth * 4)}${q(k)} => ${phpArray(v, depth + 1)},`);
    return `[\n${items.join('\n')}\n${indent((depth - 1) * 4)}]`;
  }
  return typeof value === 'number' ? String(value) : q(value);
}

const dictionaries = Object.fromEntries(LOCALES.map(c => [c, dictionary(c)]));
const translate = (code, phrase) => dictionaries[code][phrase] ?? phrase;

const locales = Object.fromEntries(LOCALES.map(code => [code, {
  name: LOCALE_NAMES[code],
  tag: LOCALE_TAGS[code],
  prefix: code === 'it' ? '' : code + '/',
  lessons: lessonDirs[code],
  pages: Object.fromEntries(Object.entries(pages).map(([k, v]) => [k, v[code]])),
}]));

const levels = LEVELS.map(level => ({
  id: level.id,
  n: String(level.n),
  part: level.part,
  xp: level.xp,
  slug: Object.fromEntries(LOCALES.map(c => [c, slugOf(level.id, c)])),
  title: Object.fromEntries(LOCALES.map(c => [c, translate(c, level.title)])),
  description: Object.fromEntries(LOCALES.map(c => [c, translate(c, level.desc)])),
}));

const php = `<?php

/*
 * GENERATED AUTOMATICALLY by tools/sync-site.mjs — do not edit by hand.
 * Source: public_html/js/core/levels.js and public_html/js/core/i18n.js
 *
 * The routes, the <head> of every page and the sitemap are all built from
 * here, so that a level renamed in one place cannot keep its old name in
 * another. Run \`npm run sync\` after touching levels.js.
 */

return ${phpArray({ locales, levels })};
`;

const current = existsSync(TARGET) ? readFileSync(TARGET, 'utf8') : '';

if (CHECK) {
  if (current === php) {
    console.log(`✅ config/site.php up to date: ${LEVELS.length} levels × ${LOCALES.length} locales`);
  } else {
    console.error('❌ config/site.php no longer matches levels.js: run `npm run sync`');
    process.exit(1);
  }
} else {
  writeFileSync(TARGET, php);
  console.log(`✅ ${LEVELS.length} levels × ${LOCALES.length} locales → config/site.php${current === php ? ' (already up to date)' : ''}`);
}
