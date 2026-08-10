/* ============================================================
   VALIDATORE COMPLETO — da lanciare prima di ogni pubblicazione.

     node tools/validate.mjs

   Controlla, per OGNI file del progetto:
   1. sintassi JavaScript di tutti i moduli in js/
   2. sintassi JavaScript degli script inline dentro ogni .html
      (è lì che si annidano gli errori da apostrofo)
   3. che ogni modulo importato esista davvero su disco
   4. struttura minima dell'HTML: tag bilanciati, head completo,
      link a css/js esistenti, attributi obbligatori
   5. coerenza con levels.js: ogni livello ha il suo file e viceversa,
      e l'id dichiarato nella pagina è quello giusto
   6. sintassi dei file Python e degli SVG/JSON
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

/* ---------- 1. moduli JS ---------- */
console.log('\n[1] Sintassi dei moduli JavaScript');
const jsFiles = walk(join(ROOT, 'public_html/js'), n => n.endsWith('.js'));
for (const f of jsFiles) {
  try { execFileSync('node', ['--check', f], { stdio: 'pipe' }); ok(); }
  catch (e) { err(rel(f), String(e.stderr || e.message).split('\n').slice(0, 3).join('\n     ')); }
}
console.log(`  → ${jsFiles.length} moduli controllati`);

/* ---------- 2. script inline nelle pagine ---------- */
console.log('\n[2] Sintassi degli script inline nelle pagine HTML');
const htmlFiles = walk(join(ROOT, 'public_html'), n => n.endsWith('.html'));
for (const f of htmlFiles) {
  const src = readFileSync(f, 'utf8');
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;
  let m, i = 0;
  while ((m = re.exec(src))) {
    const attrs = m[1], code = m[2];
    if (/\bsrc\s*=/.test(attrs)) continue;              // script esterno: già controllato al punto 1
    if (/type\s*=\s*["']application\/ld\+json["']/.test(attrs)) {
      try { JSON.parse(code); ok(); }
      catch (e) { err(rel(f), 'JSON-LD non valido: ' + e.message); }
      continue;
    }
    const tmp = join(TMP, `inline-${i++}-${Math.abs(hash(f))}.mjs`);
    writeFileSync(tmp, code);
    try { execFileSync('node', ['--check', tmp], { stdio: 'pipe' }); ok(); }
    catch (e) {
      const msg = String(e.stderr || e.message).split('\n').filter(l => l.trim()).slice(0, 4);
      // riporta la riga reale nel file HTML
      const lineInScript = (msg.find(l => /:\d+$/.test(l.trim())) || '').match(/:(\d+)$/);
      const offset = src.slice(0, m.index).split('\n').length;
      err(rel(f), `script inline non valido (riga HTML ≈ ${offset + (lineInScript ? +lineInScript[1] : 0)}):\n     ` + msg.join('\n     '));
    }
    try { unlinkSync(tmp); } catch { }
  }
}
console.log(`  → ${htmlFiles.length} pagine controllate`);

/* ---------- 3. import esistenti ---------- */
console.log('\n[3] Import risolvibili');
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
    else err(rel(f), `import non risolvibile: ${spec}`);
  }
  // anche gli import dinamici
  const re2 = /import\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((m = re2.exec(src))) {
    const target = resolve(dirname(f), m[1]);
    if (m[1].startsWith('.') && !existsSync(target)) err(rel(f), `import dinamico non risolvibile: ${m[1]}`);
    else ok();
  }
}

/* ---------- 4. struttura HTML ---------- */
console.log('\n[4] Struttura delle pagine HTML');
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
for (const f of htmlFiles) {
  const raw = readFileSync(f, 'utf8');
  const name = rel(f);
  // togli script/style/commenti prima di contare i tag
  const src = raw.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '');
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
      if (last !== t) { unbalanced = `atteso </${last}>, trovato </${t}>`; break; }
    }
  }
  if (unbalanced) err(name, 'tag HTML sbilanciati: ' + unbalanced);
  else if (stack.length) err(name, 'tag non chiusi: ' + stack.join(', '));
  else ok();

  for (const [needle, msg] of [
    ['<!doctype html>', 'manca il doctype'],
    ['lang="it"', 'manca lang="it" su <html>'],
    ['<meta charset="utf-8">', 'manca il charset'],
    ['name="viewport"', 'manca il meta viewport'],
    ['<title>', 'manca il title'],
  ]) {
    if (raw.toLowerCase().includes(needle.toLowerCase())) ok();
    else warn(name, msg);
  }
  if (!/name="description"/.test(raw)) warn(name, 'manca la meta description (SEO/GEO)');

  // risorse referenziate
  const resRe = /(?:href|src)\s*=\s*"([^"#?:]+\.(?:css|js|svg|jpe?g|png|webp|xml|txt))"/g;
  while ((m = resRe.exec(raw))) {
    const target = resolve(dirname(f), m[1]);
    if (existsSync(target)) ok();
    else err(name, `risorsa mancante: ${m[1]}`);
  }
  // collegamenti interni fra pagine: un link rotto manda il giocatore in un
  // vicolo cieco, ed è successo davvero dopo un riordino dei livelli.
  const linkRe = /href\s*=\s*"([^":]+\.html)(?:[#?][^"]*)?"/g;
  while ((m = linkRe.exec(raw))) {
    const target = resolve(dirname(f), m[1]);
    if (existsSync(target)) ok();
    else err(name, `collegamento rotto: ${m[1]}`);
  }

  // immagini senza alt
  const imgRe = /<img\b([^>]*)>/g;
  while ((m = imgRe.exec(raw))) {
    if (!/\balt\s*=/.test(m[1])) warn(name, 'immagine senza attributo alt (accessibilità)');
    else ok();
  }
}

/* ---------- 5. coerenza con levels.js ---------- */
console.log('\n[5] Coerenza dei livelli');
const levelsSrc = readFileSync(join(ROOT, 'public_html/js/core/levels.js'), 'utf8');
const declared = [...levelsSrc.matchAll(/\{\s*id:\s*'([\w-]+)',[\s\S]{0,200}?file:\s*'([^']+)'/g)]
  .map(m => ({ id: m[1], file: m[2] }));
for (const lv of declared) {
  const p = join(ROOT, 'public_html', lv.file);
  if (!existsSync(p)) { err('levels.js', `il livello ${lv.id} punta a ${lv.file} che non esiste`); continue; }
  const src = readFileSync(p, 'utf8');
  const m = src.match(/renderLesson\(\{\s*\n?\s*id:\s*'([\w-]+)'/);
  if (!m) err(rel(p), 'la pagina non chiama renderLesson con un id');
  else if (m[1] !== lv.id) err(rel(p), `id dichiarato "${m[1]}" ma in levels.js è "${lv.id}"`);
  else ok();
}
const lessonFiles = readdirSync(join(ROOT, 'public_html/lezioni')).filter(n => n.endsWith('.html'));
for (const n of lessonFiles) {
  if (!declared.some(l => l.file === 'lezioni/' + n)) warn('lezioni/' + n, 'file presente ma non elencato in levels.js');
  else ok();
}
console.log(`  → ${declared.length} livelli dichiarati, ${lessonFiles.length} file presenti`);

/* ---------- 6. Backend PHP ---------- */
console.log('\n[6] Backend PHP (Laravel + moduli)');
const backend = join(ROOT, 'Modules');
if (existsSync(backend)) {
  const phpFiles = [...walk(backend, n => n.endsWith('.php')), ...walk(join(ROOT, 'app'), n => n.endsWith('.php'))];
  for (const f of phpFiles) {
    try { execFileSync('php', ['-l', f], { stdio: 'pipe' }); ok(); }
    catch (e) { err(rel(f), String(e.stdout || e.stderr || e.message).split('\n').slice(0, 2).join('\n     ')); }
  }
  console.log(`  → ${phpFiles.length} file PHP controllati (moduli e app, vendor escluso)`);

  // ogni modulo deve avere il suo service provider registrato
  for (const mod of readdirSync(backend)) {
    const p = join(backend, mod, 'module.json');
    if (existsSync(p)) { try { JSON.parse(readFileSync(p, 'utf8')); ok(); } catch { err('Modules/' + mod + '/module.json', 'JSON non valido'); } }
  }
} else {
  warn('backend/', 'progetto Laravel non presente: salto i controlli PHP');
}

/* ---------- 7. Python, SVG, JSON, sitemap ---------- */
console.log('\n[7] Altri file');
for (const f of walk(ROOT, n => n.endsWith('.py'))) {
  try { execFileSync('python3', ['-m', 'py_compile', f], { stdio: 'pipe' }); ok(); }
  catch (e) { err(rel(f), String(e.stderr || e.message).split('\n').slice(0, 3).join('\n     ')); }
}
for (const f of walk(ROOT, n => n.endsWith('.svg') || n.endsWith('.xml'))) {
  const src = readFileSync(f, 'utf8');
  const body = src.replace(/<\?[\s\S]*?\?>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  const opens = (body.match(/<[a-zA-Z][^>]*?(?<!\/)>/g) || []).length;   // tag di apertura veri
  const closes = (body.match(/<\/[a-zA-Z]/g) || []).length;
  if (opens !== closes) err(rel(f), `tag XML sbilanciati (${opens} aperti, ${closes} chiusi)`);
  else ok();
}
for (const f of walk(ROOT, n => n.endsWith('.json'))) {
  try { JSON.parse(readFileSync(f, 'utf8')); ok(); }
  catch (e) { err(rel(f), 'JSON non valido: ' + e.message); }
}

/* ---------- 8. le soluzioni dell'esame non devono essere scaricabili ---------- */
console.log('\n[8] Segreti fuori dalla radice web');
{
  // Tutto ciò che sta dentro public_html è scaricabile da chiunque conosca
  // l'URL: nessun controllo di accesso, nessuna eccezione. Le risposte esatte
  // dell'esame lì dentro renderebbero l'attestato una formalità.
  const banca = join(ROOT, 'dati/banca-esame-esempio.js');
  if (existsSync(banca)) ok();
  else err('dati/banca-esame-esempio.js', 'la banca domande non è al suo posto (fuori dalla radice web)');

  let colpevoli = 0;
  for (const f of walk(join(ROOT, 'public_html'), n => n.endsWith('.js') || n.endsWith('.json'))) {
    const src = readFileSync(f, 'utf8');
    if (/export\s+const\s+EXAM\b/.test(src) || /\bc:\s*\d\s*,\s*w:\s*'/.test(src)) {
      err(rel(f), 'contiene le soluzioni dell\'esame: dentro public_html sono scaricabili da chiunque. '
        + 'La banca domande va in dati/, e sul server ci arriva solo tramite npm run exam:sync.');
      colpevoli++;
    }
  }
  if (!colpevoli) ok();
}

function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }

console.log(`\n${errors === 0 ? '✅' : '❌'}  ${checks} controlli superati · ${errors} errori · ${warnings} avvisi\n`);
process.exit(errors ? 1 : 0);
