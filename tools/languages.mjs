/* ============================================================
   STATO DELLE TRADUZIONI

     node tools/languages.mjs          elenca cosa manca
     node tools/languages.mjs --fix    aggiunge le chiavi mancanti in fondo
                                    ai dizionari, con il testo italiano e un
                                    marcatore TODO, da tradurre a mano

   Confronta le chiamate a t('…') presenti nel codice del gioco con quello
   che c'è in public_html/js/i18n/<lingua>.js, e fa lo stesso per le chiavi
   PHP di lang/<lingua>.json.

   Il punto non è avere un contatore: è che una frase nuova aggiunta al gioco
   in italiano — cosa che succede a ogni livello nuovo — non resti invisibile
   finché qualcuno non apre per caso la pagina in spagnolo.
   ============================================================ */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const LINGUE = ['en', 'es'];
const FIX = process.argv.includes('--fix');

function walk(dir, filtro, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name.startsWith('.') || name === 'node_modules' || name === 'vendor') continue;
    if (statSync(p).isDirectory()) walk(p, filtro, out);
    else if (filtro(name)) out.push(p);
  }
  return out;
}

/* ---------- chiavi usate nel gioco ---------- */

/* Le chiamate a t() con una stringa letterale: il caso normale. Quelle
   costruite a runtime (`.map(x => t(x))`) non sono elencabili staticamente,
   quindi vanno dichiarate qui sotto a mano. */
const EXTRA = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

function chiaviJs() {
  const chiavi = new Set(EXTRA);
  for (const f of walk(join(ROOT, 'public_html/js'), n => n.endsWith('.js'))) {
    if (f.includes('/i18n/') || f.endsWith('core/i18n.js')) continue;   // i dizionari e il motore non contano
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/(?<![\w.])t\(\s*'((?:[^'\\]|\\.)*)'/g)) chiavi.add(sciogli(m[1]));
    for (const m of src.matchAll(/(?<![\w.])t\(\s*"((?:[^"\\]|\\.)*)"/g)) chiavi.add(sciogli(m[1]));
  }
  return chiavi;
}

/** Riporta una stringa letterale JS al testo che il runtime vede davvero. */
function sciogli(grezzo) {
  return grezzo.replace(/\\(['"\\])/g, '$1').replace(/\\n/g, '\n');
}

/* ---------- chiavi tradotte ---------- */

async function dizionario(lingua) {
  const p = join(ROOT, 'public_html/js/i18n', lingua + '.js');
  if (!existsSync(p)) return null;
  return (await import(p)).default;
}

/* ---------- chiavi PHP (lang/*.json, stile Laravel) ---------- */

function chiaviPhp() {
  const chiavi = new Set();
  const sorgenti = [
    ...walk(join(ROOT, 'Modules'), n => n.endsWith('.php')),
    ...walk(join(ROOT, 'app'), n => n.endsWith('.php')),
    ...walk(join(ROOT, 'resources'), n => n.endsWith('.php')),
  ];
  for (const f of sorgenti) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/__\(\s*'((?:[^'\\]|\\.)*)'/g)) chiavi.add(m[1].replace(/\\(['\\])/g, '$1'));
    for (const m of src.matchAll(/__\(\s*"((?:[^"\\$]|\\.)*)"/g)) chiavi.add(m[1].replace(/\\(["\\])/g, '$1'));
  }
  return chiavi;
}

/* ---------- rapporto ---------- */

let mancanti = 0;

function rapporto(titolo, usate, tradotte, quandoManca) {
  const assenti = [...usate].filter(k => !(k in tradotte)).sort();
  const orfane = Object.keys(tradotte).filter(k => !usate.has(k)).sort();
  const fatte = usate.size - assenti.length;
  const pct = usate.size ? Math.round((fatte / usate.size) * 100) : 100;
  console.log(`\n  ${assenti.length ? '✗' : '✓'} ${titolo}: ${fatte}/${usate.size} (${pct}%)`);
  for (const k of assenti.slice(0, 12)) console.log(`      manca  ${abbrevia(k)}`);
  if (assenti.length > 12) console.log(`      …e altre ${assenti.length - 12}`);
  for (const k of orfane.slice(0, 6)) console.log(`      inutilizzata  ${abbrevia(k)}`);
  if (orfane.length > 6) console.log(`      …e altre ${orfane.length - 6} inutilizzate`);
  mancanti += assenti.length;
  if (assenti.length && FIX) quandoManca(assenti);
}

const abbrevia = s => (s.length > 66 ? s.slice(0, 63).replace(/\s+\S*$/, '') + '…' : s);
const ordinato = o => Object.fromEntries(Object.keys(o).sort().map(k => [k, o[k]]));

/* JS */
const usateJs = chiaviJs();
for (const lingua of LINGUE) {
  const dict = await dizionario(lingua);
  if (!dict) { console.log(`\n  ✗ js/${lingua}: dizionario assente`); mancanti++; continue; }
  rapporto(`js/i18n/${lingua}.js`, usateJs, dict, assenti => {
    const p = join(ROOT, 'public_html/js/i18n', lingua + '.js');
    const src = readFileSync(p, 'utf8');
    const righe = assenti.map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(k)},   // TODO tradurre`).join('\n');
    writeFileSync(p, src.replace(/\n\};\s*$/, `\n\n  /* ---------------- TODO ---------------- */\n${righe}\n};\n`));
    console.log(`      → ${assenti.length} chiavi aggiunte da tradurre in ${relative(ROOT, p)}`);
  });
}

/* PHP */
const usatePhp = chiaviPhp();
for (const lingua of LINGUE) {
  const p = join(ROOT, 'lang', lingua + '.json');
  const dict = existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null;
  if (!dict) { console.log(`\n  ✗ lang/${lingua}.json: assente`); mancanti++; continue; }
  rapporto(`lang/${lingua}.json`, usatePhp, dict, assenti => {
    for (const k of assenti) dict[k] = k;
    writeFileSync(p, JSON.stringify(ordinato(dict), null, 2) + '\n');
    console.log(`      → ${assenti.length} chiavi aggiunte da tradurre in lang/${lingua}.json`);
  });
}

console.log(`\n${mancanti === 0 ? '✅  tutte le lingue sono allineate' : `❌  ${mancanti} traduzioni mancanti`}\n`);
process.exit(mancanti && !FIX ? 1 : 0);
