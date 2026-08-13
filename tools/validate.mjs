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
   5. coerenza con levels.js: ogni livello ha il suo file IN OGNI LINGUA
      pubblicata e viceversa, l'id dichiarato nella pagina è quello giusto,
      e il numero di livelli scritto nei testi (home, README, attestato)
      è quello vero — in italiano, inglese e spagnolo
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

/* Le lingue del sito. L'italiano è l'originale e vive nella radice; le altre
   in una cartella propria. Una lingua si considera PUBBLICATA quando ha la sua
   home: da quel momento deve avere anche tutte le lezioni, perché mezzo corso
   tradotto è peggio di nessuna traduzione — chi arriva dal terzo livello
   inglese e trova l'italiano pensa che il sito sia rotto. */
const LINGUE = [
  { code: 'it', dir: '', lezioni: 'lezioni', parola: 'trentaquattro', unita: 'livelli' },
  { code: 'en', dir: 'en/', lezioni: 'lessons', parola: 'thirty-four', unita: 'levels' },
  { code: 'es', dir: 'es/', lezioni: 'lecciones', parola: 'treinta y cuatro', unita: 'niveles' },
];

/** La lingua di un file, dedotta dalla cartella in cui sta. */
function linguaDi(percorso) {
  const r = relative(join(ROOT, 'public_html'), percorso);
  const primo = r.split(/[\\/]/)[0];
  return LINGUE.find(l => l.dir === primo + '/') || LINGUE[0];
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

/* ---------- 3b. la t() delle traduzioni non deve essere oscurata ----------
   Il gioco è pieno di matematica, e in matematica `t` è il tempo: `const t = i / N`
   dentro un ciclo di disegno è la cosa più naturale del mondo. Ma nello stesso
   file `t` è anche la funzione che traduce, e una variabile locale la copre
   senza che nessuno se ne accorga — finché qualcuno non apre la pagina in
   spagnolo e trova un errore invece della frase. Meglio scoprirlo qui. */
/* Il sorgente senza commenti né stringhe, con la lunghezza intatta.
   Serve perché le frasi da tradurre parlano proprio di codice — dentro le
   lezioni ci sono `const t = …` scritti come esempio — e senza questo passaggio
   il controllo qui sotto griderebbe al lupo per un pezzo di testo. Le
   posizioni restano quelle originali, così il numero di riga è quello vero. */
function senzaStringhe(src) {
  // ogni carattere rimosso diventa uno spazio: stessa lunghezza, stessi indici
  return src.replace(
    /\/\*[\s\S]*?\*\/|\/\/[^\n]*|'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g,
    m => m.replace(/[^\n]/g, ' '),
  );
}

console.log('\n[3b] La funzione t() non è oscurata da variabili locali');

/* Un'occorrenza di «t» che CREA un nome nuovo, cioè che copre il traduttore.
   Non basta cercare `const t`: la prima versione di questo controllo faceva
   solo quello, e si è lasciata sfuggire `const s = build(), t = transformed()`
   — secondo dichiaratore, stessa riga — che ha rotto il livello 18 in tutte
   e tre le lingue. Le forme sono tre, e vanno cercate tutte. */
function ombreDiT(src) {
  const ombre = [];
  const nota = (indice, come) => ombre.push({ indice, come });

  // 1. dichiarazioni, in qualunque posizione dell'elenco:
  //    const t = …   ·   let a, t;   ·   const s = f(), t = g();
  for (const m of src.matchAll(/\b(?:const|let|var)\s+([\s\S]*?);/g)) {
    const elenco = m[1];
    let profondita = 0, pezzo = '', pezzi = [];
    for (const ch of elenco) {
      if ('([{'.includes(ch)) profondita++;
      else if (')]}'.includes(ch)) profondita--;
      if (ch === ',' && profondita === 0) { pezzi.push(pezzo); pezzo = ''; continue; }
      pezzo += ch;
    }
    pezzi.push(pezzo);
    // il nome è quello che sta prima dell'«=»; se non c'è «=», è il pezzo intero
    if (pezzi.some(p => p.split('=')[0].trim() === 't')) nota(m.index, 'dichiarazione');
  }

  // 2. parametri di funzione: function f(t) · (a, t) => · function (t) {
  for (const m of src.matchAll(/(?:function\s*[\w$]*\s*)\(([^()]*)\)|\(([^()]*)\)\s*=>/g)) {
    const parametri = (m[1] ?? m[2] ?? '').split(',').map(p => p.split('=')[0].trim());
    if (parametri.includes('t')) nota(m.index, 'parametro');
  }

  // 3. la freccia senza parentesi, che è la forma più frequente: .map(t => …)
  for (const m of src.matchAll(/(?:^|[^\w$.])t\s*=>/g)) nota(m.index, 'parametro');

  return ombre;
}

for (const { f, src } of allSources) {
  if (!/import\s*\{[^}]*\bt\b[^}]*\}\s*from\s*['"][^'"]*i18n\.js['"]/.test(src)) continue;
  const ombre = ombreDiT(senzaStringhe(src));
  if (ombre.length) {
    const { indice, come } = ombre[0];
    const riga = src.slice(0, indice).split('\n').length;
    err(rel(f), `usa «t» come ${come} (riga ~${riga}) ma importa anche t() da i18n.js: `
      + 'il nome locale oscura il traduttore. Rinominalo (per esempio in «tempo» o «tok»).');
  } else ok();
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

  const lingua = linguaDi(f);
  for (const [needle, msg] of [
    ['<!doctype html>', 'manca il doctype'],
    [`lang="${lingua.code}"`, `manca lang="${lingua.code}" su <html> (la pagina sta nella cartella della lingua "${lingua.code}")`],
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

/* levels.js e i dizionari letti come TESTO, non importati.
   Importarli richiederebbe un `document` (i18n.js legge <html lang>) e in Node
   non c'è: leggerli a mano costa dieci righe e non obbliga il validatore a
   fingersi un browser. */

/** I livelli come li dichiara levels.js: id, numero mostrato e titolo italiano. */
function livelliDichiarati(src) {
  const fuori = [];
  for (const m of src.matchAll(/\{\s*id:\s*'([\w-]+)',\s*part:\s*'[^']*',\s*n:\s*('([^']*)'|[\d]+)[\s\S]*?title:\s*t\('((?:[^'\\]|\\.)*)'\)/g)) {
    fuori.push({ id: m[1], n: m[3] ?? m[2], title: m[4].replace(/\\(['\\])/g, '$1') });
  }
  return fuori;
}

/** Il dizionario di una lingua, come mappa frase-italiana → traduzione. */
const dizionariInMemoria = {};
function dizionarioDi(codice) {
  if (codice === 'it') return {};
  if (dizionariInMemoria[codice]) return dizionariInMemoria[codice];

  const p = join(ROOT, 'public_html/js/i18n', codice + '.js');
  const mappa = {};
  if (existsSync(p)) {
    // chiavi e valori usano indifferentemente apici singoli o doppi, e il
    // valore può stare sulla riga dopo: la coppia si riconosce dai delimitatori
    const coppia = /(['"])((?:\\.|(?!\1)[^\\])*)\1\s*:\s*\n?\s*(['"])((?:\\.|(?!\3)[^\\])*)\3/g;
    const sciogli = x => x.replace(/\\(['"\\])/g, '$1').replace(/\\n/g, '\n');
    for (const m of readFileSync(p, 'utf8').matchAll(coppia)) mappa[sciogli(m[2])] = sciogli(m[4]);
  }
  return (dizionariInMemoria[codice] = mappa);
}

/* ---------- 5. coerenza con levels.js ---------- */
console.log('\n[5] Coerenza dei livelli');
const levelsSrc = readFileSync(join(ROOT, 'public_html/js/core/levels.js'), 'utf8');

/* Gli id sono gli stessi in tutte le lingue (è la chiave del progresso salvato
   sul server); cambia solo il nome del file, dichiarato nella mappa SLUG. */
const declared = [...levelsSrc.matchAll(/\{\s*id:\s*'([\w-]+)',\s*part:/g)].map(m => m[1]);
const slugMap = {};
{
  const blocco = levelsSrc.match(/const SLUG = \{([\s\S]*?)\n\};/);
  if (!blocco) err('levels.js', 'manca la mappa SLUG: senza, gli indirizzi tradotti non sono verificabili');
  else {
    for (const m of blocco[1].matchAll(/'([\w-]+)':\s*\{([^}]*)\}/g)) {
      const voci = {};
      for (const v of m[2].matchAll(/(\w+):\s*'([^']+)'/g)) voci[v[1]] = v[2];
      slugMap[m[1]] = voci;
    }
  }
}
const slugDi = (id, code) => code === 'it' ? id : (slugMap[id] || {})[code];

/** Percorso su disco della lezione `id` nella lingua `l`. */
const fileLezione = (id, l) => join(ROOT, 'public_html', l.dir + l.lezioni, slugDi(id, l.code) + '.html');

const linguePubblicate = LINGUE.filter(l => existsSync(join(ROOT, 'public_html', l.dir + 'index.html')));
for (const l of linguePubblicate) {
  for (const id of declared) {
    const slug = slugDi(id, l.code);
    if (!slug) { err('levels.js', `il livello ${id} non ha uno slug per la lingua "${l.code}"`); continue; }
    const p = fileLezione(id, l);
    if (!existsSync(p)) { err('levels.js', `il livello ${id} in lingua "${l.code}" punta a ${rel(p)} che non esiste`); continue; }
    const src = readFileSync(p, 'utf8');
    const m = src.match(/renderLesson\(\{\s*\n?\s*id:\s*'([\w-]+)'/);
    if (!m) err(rel(p), 'la pagina non chiama renderLesson con un id');
    else if (m[1] !== id) err(rel(p), `id dichiarato "${m[1]}" ma in levels.js è "${id}"`);
    else ok();
  }
  // e viceversa: un file rimasto lì dopo un riordino non deve passare inosservato
  const cartella = join(ROOT, 'public_html', l.dir + l.lezioni);
  if (!existsSync(cartella)) { err(l.dir + l.lezioni, 'la cartella delle lezioni non esiste'); continue; }
  for (const n of readdirSync(cartella).filter(x => x.endsWith('.html'))) {
    if (!declared.some(id => slugDi(id, l.code) + '.html' === n)) warn(l.dir + l.lezioni + '/' + n, 'file presente ma non elencato in levels.js');
    else ok();
  }
}
console.log(`  → ${declared.length} livelli dichiarati in ${linguePubblicate.length} lingue (${linguePubblicate.map(l => l.code).join(', ')})`);

/* ---------- 5a. il <title> scritto nella pagina è quello che il gioco mostra ----------
   La pagina ha DUE titoli: quello scritto nel <head>, che leggono Google, il
   tutor e la scheda del browser prima che parta il JavaScript, e quello che
   `renderLesson` scrive in document.title appena la pagina si apre.

   Erano diversi in 21 lezioni su 28: la scheda diceva «17 · QFT» e il sito
   «18. QFT», e 01-qubit.html annunciava «8 · Dal numero complesso al qubit»,
   un titolo rimasto dall'ordinamento di due riorganizzazioni fa — mentre la
   lezione, dentro, dice «niente numeri complessi». Chi arriva da una ricerca
   legge un numero, entra e ne trova un altro: è il tipo di incoerenza che
   costa fiducia senza che nessuno segnali mai un bug.

   Da qui in poi la fonte è una sola: levels.js. */
{
  const formato = readFileSync(join(ROOT, 'public_html/js/core/lesson.js'), 'utf8')
    .match(/document\.title\s*=\s*`([^`]*)`/);

  if (!formato) {
    err('js/core/lesson.js', 'non si capisce più come viene composto document.title: il controllo sui <title> non è più affidabile');
  } else if (!/\$\{lv\.n\}\.\s\$\{lv\.title\}/.test(formato[1])) {
    err('js/core/lesson.js', `document.title usa il formato «${formato[1]}», che questo controllo non sa riprodurre: aggiornalo`);
  } else {
    const coda = formato[1].replace(/^\$\{lv\.n\}\.\s\$\{lv\.title\}/, '');   // « — Quantum Arcade»

    for (const l of linguePubblicate) {
      const dizionario = dizionarioDi(l.code);
      for (const lv of livelliDichiarati(levelsSrc)) {
        const p = fileLezione(lv.id, l);
        if (!existsSync(p)) continue;   // già segnalato sopra
        const scritto = (readFileSync(p, 'utf8').match(/<title>([\s\S]*?)<\/title>/) || [])[1];
        const atteso = `${lv.n}. ${dizionario[lv.title] ?? lv.title}${coda}`;
        if (scritto === atteso) ok();
        else err(rel(p), `il <title> dice «${scritto}» ma aprendo la pagina si legge «${atteso}»`);
      }
    }
  }
}

/* ---------- 5b. il numero di livelli scritto a parole nei testi ----------
   Il controllo sopra guarda solo levels.js e i file delle lezioni. Ma il
   conteggio è anche SCRITTO, in una dozzina di punti: meta description, titolo
   della home, README, schermata di premiazione dell'esame e — quello che conta
   davvero — l'attestato e la sua pagina pubblica di verifica.

   Quei numeri erano rimasti a 27 dopo l'aggiunta del livello 12: lo studente si
   ritrovava un PDF che diceva 27 e un sito che diceva 28. Chi verifica
   l'attestato di qualcun altro trova due numeri diversi e smette di fidarsi di
   entrambi, che è esattamente il contrario di quello che serve a un attestato.
   Da qui in poi il numero scritto deve combaciare con LEVELS, ovunque. */
const N_LIVELLI = declared.length;
const A_PAROLE = {
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
/* "levels"/"niveles" compaiono anche in inglese e spagnolo: il conteggio va
   tenuto allineato in tutte e tre le lingue, sennò l'attestato inglese
   promette un numero di livelli che il corso non ha. */
const UNITA = { livelli: 'it', levels: 'en', niveles: 'es' };
const testi = [
  ...htmlFiles,
  ...jsFiles,
  join(ROOT, 'README.md'),
  ...(existsSync(join(ROOT, 'Modules')) ? walk(join(ROOT, 'Modules'), n => n.endsWith('.php')) : []),
].filter(existsSync);

for (const f of testi) {
  const src = readFileSync(f, 'utf8');
  let m;
  const cifre = /(\d+)\s+(livelli|levels|niveles)\b/gi;
  while ((m = cifre.exec(src))) {
    // "livelli" non parla sempre del corso: la lezione sulla FFT dice "log₂8 = 3
    // livelli" di ricorsione. Sotto la decina non è mai un conteggio del corso,
    // e sopra non è mai altro — la soglia separa i due usi senza casi ambigui.
    if (Number(m[1]) < 10) continue;
    if (Number(m[1]) === N_LIVELLI) ok();
    else err(rel(f), `dice "${m[1]} ${m[2]}" ma in levels.js ce ne sono ${N_LIVELLI}`);
  }
  for (const [unita, lingua] of Object.entries(UNITA)) {
    const attesa = A_PAROLE[lingua][N_LIVELLI];
    const parole = new RegExp(`\\b(${Object.values(A_PAROLE[lingua]).join('|')})\\s+${unita}\\b`, 'gi');
    while ((m = parole.exec(src))) {
      if (m[1].toLowerCase() === attesa) ok();
      else err(rel(f), `dice "${m[1]} ${unita}" ma in levels.js ce ne sono ${N_LIVELLI} ("${attesa}")`);
    }
  }
}

/* Il PHP non legge levels.js: si tiene la sua copia del numero in
   Modules/Certificates/config/config.php, ed è quella che finisce stampata
   sull'attestato. Qui si controlla che la copia non sia rimasta indietro. */
const certCfg = join(ROOT, 'Modules/Certificates/config/config.php');
if (existsSync(certCfg)) {
  const m = readFileSync(certCfg, 'utf8').match(/'levels_count'\s*=>\s*(\d+)/);
  if (!m) err(rel(certCfg), "manca 'levels_count': l'attestato non sa quanti livelli ha il corso");
  else if (Number(m[1]) !== N_LIVELLI) err(rel(certCfg), `levels_count = ${m[1]} ma in levels.js ce ne sono ${N_LIVELLI}`);
  else ok();
}

/* ---------- 5c. la sitemap conosce tutte le pagine, in tutte le lingue ----------
   Una pagina che non sta nella sitemap esiste ma non la trova nessuno, e con
   tre copie del sito il conto sale a novanta indirizzi: quello che prima si
   controllava a occhio adesso non si controlla più. Qui si confronta la
   sitemap con i file che ci sono davvero, nei due sensi — pagine dimenticate
   e indirizzi che puntano al vuoto. */
{
  const mappa = join(ROOT, 'public_html/sitemap.xml');

  if (!existsSync(mappa)) {
    err('public_html/sitemap.xml', 'assente: nessun motore di ricerca troverà le pagine tradotte');
  } else {
    const src = readFileSync(mappa, 'utf8');
    const indirizzi = new Set([...src.matchAll(/<loc>https:\/\/quantumarcade\.it\/(.*?)<\/loc>/g)].map(m => m[1]));

    // le pagine vere: tutti gli .html sotto public_html che non sono frammenti
    const attese = new Set();
    for (const l of LINGUE) {
      if (!existsSync(join(ROOT, 'public_html', l.dir, 'index.html'))) continue;   // lingua non pubblicata
      attese.add(l.dir);                                                            // la radice si scrive senza index.html
      for (const f of walk(join(ROOT, 'public_html', l.dir), n => n.endsWith('.html'))) {
        const via = rel(f).replace('public_html/', '');
        if (via.endsWith('index.html')) continue;                                   // già contata come radice
        if (linguaDi(rel(f)).code !== l.code) continue;                             // file di un'altra copia del sito
        attese.add(via);
      }
    }

    for (const via of attese) {
      if (indirizzi.has(via)) ok();
      else err('public_html/sitemap.xml', `non elenca /${via} — esegui \`npm run sitemap\``);
    }
    for (const via of indirizzi) {
      const f = join(ROOT, 'public_html', via === '' || via.endsWith('/') ? via + 'index.html' : via);
      if (existsSync(f)) ok();
      else err('public_html/sitemap.xml', `elenca /${via}, che non esiste`);
    }
  }
}

/* ---------- 5d. i conteggi dei test scritti nella documentazione ----------
   README e CONTRIBUTING annunciano quanti test ci sono. Erano fermi a «102» e
   «84» mentre ne giravano 114 e 118: un numero sbagliato in un file che invita
   a contribuire dice a chi arriva che la documentazione non si aggiorna, ed è
   la prima cosa che gli fa chiudere la pagina.

   Stesso principio del conteggio dei livelli: se è scritto, deve combaciare. */
{
  const conta = (cartella, filtro, regola) =>
    walk(join(ROOT, cartella), filtro).reduce((n, f) => n + (readFileSync(f, 'utf8').match(regola) || []).length, 0);

  const veri = {
    // node:test — un `test('…')` per prova, sempre a inizio riga dentro un describe
    'test del motore del gioco': conta('tests/js/unit', n => n.endsWith('.test.js'), /^\s*test\(/gm),
    'test PHP':                  conta('tests',        n => n.endsWith('Test.php'), /^\s*public function test_/gm),
  };

  const DICHIARAZIONI = [
    { file: 'README.md',       regola: /\((\d+) test\) \+ validatore/,        quale: 'test del motore del gioco' },
    { file: 'README.md',       regola: /# (\d+) test dei moduli Laravel/,      quale: 'test PHP' },
    { file: 'CONTRIBUTING.md', regola: /# (\d+) test, devono restare verdi/,   quale: 'test PHP' },
  ];

  for (const d of DICHIARAZIONI) {
    const p = join(ROOT, d.file);
    if (!existsSync(p)) { warn(d.file, 'assente'); continue; }
    const m = readFileSync(p, 'utf8').match(d.regola);
    if (!m) err(d.file, `non dichiara più quanti ${d.quale} ci sono, o l'ha scritto in un modo che questo controllo non riconosce`);
    else if (Number(m[1]) !== veri[d.quale]) err(d.file, `dice ${m[1]} ${d.quale}, ma ce ne sono ${veri[d.quale]}`);
    else ok();
  }
}

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

/* ---------- 9. refusi ricorrenti dell'italiano ---------- */
console.log('\n[9] Ortografia italiana');
{
  // Solo regole ad alta precisione: in queste pagine convivono prosa, formule e
  // codice, e un controllo che grida al lupo per ogni virgola dentro un array
  // non lo guarderebbe più nessuno. Meglio poche regole di cui fidarsi.
    const REGOLE = [
    // Solo regole ad alta precisione: in queste pagine convivono prosa, formule e
    // codice, e un controllo che grida al lupo per ogni virgola dentro un array
    // non lo guarderebbe più nessuno.
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

  let refusi = 0;
  for (const f of walk(join(ROOT, 'public_html'), n => /\.(html|js|txt)$/.test(n))) {
    // le regole valgono solo per l'italiano: «propio» è un refuso italiano ma
    // «propio» spagnolo è corretto, e i dizionari contengono le frasi tradotte
    if (linguaDi(rel(f)).code !== 'it') continue;
    if (/\/js\/i18n\//.test(rel(f))) continue;
    // i tag si tolgono SENZA metterci uno spazio, sennò nascono finti errori
    const testo = readFileSync(f, 'utf8').replace(/<[^>]*>/g, '').replace(/https?:\/\/\S+/g, ' ');
    for (const [re, spiega] of REGOLE) {
      for (const m of testo.matchAll(re)) {
        const ctx = testo.slice(Math.max(0, m.index - 40), m.index + 50).replace(/\s+/g, ' ');
        warn(rel(f), `«…${ctx}…» → ${spiega}`);
        refusi++;
      }
    }
  }
  if (!refusi) ok();
}

function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }

console.log(`\n${errors === 0 ? '✅' : '❌'}  ${checks} controlli superati · ${errors} errori · ${warnings} avvisi\n`);
process.exit(errors ? 1 : 0);
