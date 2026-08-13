/* ============================================================
   TRANSLATION STATUS

     node tools/languages.mjs          lists what is missing
     node tools/languages.mjs --fix    appends the missing keys to the
                                    dictionaries, with the Italian text and a
                                    TODO marker, to be translated by hand

   It compares the t('…') calls found in the game's code against what is in
   public_html/js/i18n/<locale>.js, and does the same for the PHP keys in
   lang/<locale>.json.

   The point is not to have a counter: it is that a new sentence added to the
   game in Italian — which happens with every new level — does not stay
   invisible until somebody happens to open the Spanish page.
   ============================================================ */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const LOCALES = ['en', 'es'];
const FIX = process.argv.includes('--fix');

function walk(dir, filter, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name.startsWith('.') || name === 'node_modules' || name === 'vendor') continue;
    if (statSync(p).isDirectory()) walk(p, filter, out);
    else if (filter(name)) out.push(p);
  }
  return out;
}

/* ---------- keys used in the game ---------- */

/* Calls to t() with a string literal: the normal case. The ones built at
   runtime (`.map(x => t(x))`) cannot be listed statically, so they are
   declared here by hand. */
const EXTRA = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

function jsKeys() {
  const keys = new Set(EXTRA);
  for (const f of walk(join(ROOT, 'public_html/js'), n => n.endsWith('.js'))) {
    if (f.includes('/i18n/') || f.endsWith('core/i18n.js')) continue;   // the dictionaries and the engine do not count
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/(?<![\w.])t\(\s*'((?:[^'\\]|\\.)*)'/g)) keys.add(unescapeLiteral(m[1]));
    for (const m of src.matchAll(/(?<![\w.])t\(\s*"((?:[^"\\]|\\.)*)"/g)) keys.add(unescapeLiteral(m[1]));
  }
  return keys;
}

/** Turns a JS string literal back into the text the runtime actually sees. */
function unescapeLiteral(raw) {
  return raw.replace(/\\(['"\\])/g, '$1').replace(/\\n/g, '\n');
}

/* ---------- translated keys ---------- */

async function dictionary(locale) {
  const p = join(ROOT, 'public_html/js/i18n', locale + '.js');
  if (!existsSync(p)) return null;
  return (await import(p)).default;
}

/* ---------- PHP keys (lang/*.json, Laravel style) ---------- */

function phpKeys() {
  const keys = new Set();
  const sources = [
    ...walk(join(ROOT, 'Modules'), n => n.endsWith('.php')),
    ...walk(join(ROOT, 'app'), n => n.endsWith('.php')),
    ...walk(join(ROOT, 'resources'), n => n.endsWith('.php')),
  ];
  for (const f of sources) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/__\(\s*'((?:[^'\\]|\\.)*)'/g)) keys.add(m[1].replace(/\\(['\\])/g, '$1'));
    for (const m of src.matchAll(/__\(\s*"((?:[^"\\$]|\\.)*)"/g)) keys.add(m[1].replace(/\\(["\\])/g, '$1'));
  }
  return keys;
}

/* ---------- report ---------- */

let missingTotal = 0;

function report(title, used, translated, onMissing) {
  const missing = [...used].filter(k => !(k in translated)).sort();
  const orphans = Object.keys(translated).filter(k => !used.has(k)).sort();
  const done = used.size - missing.length;
  const pct = used.size ? Math.round((done / used.size) * 100) : 100;
  console.log(`\n  ${missing.length ? '✗' : '✓'} ${title}: ${done}/${used.size} (${pct}%)`);
  for (const k of missing.slice(0, 12)) console.log(`      missing  ${shorten(k)}`);
  if (missing.length > 12) console.log(`      …and ${missing.length - 12} more`);
  for (const k of orphans.slice(0, 6)) console.log(`      unused  ${shorten(k)}`);
  if (orphans.length > 6) console.log(`      …and ${orphans.length - 6} more unused`);
  missingTotal += missing.length;
  if (missing.length && FIX) onMissing(missing);
}

const shorten = s => (s.length > 66 ? s.slice(0, 63).replace(/\s+\S*$/, '') + '…' : s);
const sorted = o => Object.fromEntries(Object.keys(o).sort().map(k => [k, o[k]]));

/* JS */
const usedInJs = jsKeys();
for (const locale of LOCALES) {
  const dict = await dictionary(locale);
  if (!dict) { console.log(`\n  ✗ js/${locale}: dictionary missing`); missingTotal++; continue; }
  report(`js/i18n/${locale}.js`, usedInJs, dict, missing => {
    const p = join(ROOT, 'public_html/js/i18n', locale + '.js');
    const src = readFileSync(p, 'utf8');
    const lines = missing.map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(k)},   // TODO translate`).join('\n');
    writeFileSync(p, src.replace(/\n\};\s*$/, `\n\n  /* ---------------- TODO ---------------- */\n${lines}\n};\n`));
    console.log(`      → ${missing.length} keys added for translation in ${relative(ROOT, p)}`);
  });
}

/* PHP */
const usedInPhp = phpKeys();
for (const locale of LOCALES) {
  const p = join(ROOT, 'lang', locale + '.json');
  const dict = existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null;
  if (!dict) { console.log(`\n  ✗ lang/${locale}.json: missing`); missingTotal++; continue; }
  report(`lang/${locale}.json`, usedInPhp, dict, missing => {
    for (const k of missing) dict[k] = k;
    writeFileSync(p, JSON.stringify(sorted(dict), null, 2) + '\n');
    console.log(`      → ${missing.length} keys added for translation in lang/${locale}.json`);
  });
}

console.log(`\n${missingTotal === 0 ? '✅  every language is in step' : `❌  ${missingTotal} translations missing`}\n`);
process.exit(missingTotal && !FIX ? 1 : 0);
