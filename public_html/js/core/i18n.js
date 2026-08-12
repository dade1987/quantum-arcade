/* ============================================================
   LINGUE — italiano, inglese, spagnolo.

   Funziona come le traduzioni JSON di Laravel: la CHIAVE è la frase
   italiana, quella che si legge già nel codice. Vantaggi concreti:

   · l'italiano non ha bisogno di dizionario (è l'identità), quindi il
     sito originale non paga niente — né un file in più da scaricare,
     né una chiave da inventare;
   · una traduzione che manca degrada in italiano, non in `home.cta.play`:
     l'utente legge una frase vera, non un pezzo di codice;
   · il testo resta leggibile dove sta, che è il motivo per cui il resto
     del progetto evita l'indirezione.

   La lingua si legge da <html lang>, e il percorso della radice del sito
   da <html data-root> — esplicito, così una pagina spostata di cartella
   non rompe i link in modo silenzioso.
   ============================================================ */

/* Import statici scritti a mano: il validatore li risolve su disco, e il
   browser scarica solo il dizionario che serve davvero. */
const DIZIONARI = {
  en: () => import('../i18n/en.js'),
  es: () => import('../i18n/es.js'),
};

export const LOCALES = ['it', 'en', 'es'];

/** Nome della lingua nella lingua stessa (per il selettore). */
export const LOCALE_NAMES = { it: 'Italiano', en: 'English', es: 'Español' };

/** Codice completo, per gli attributi hreflang e per l'API. */
export const LOCALE_TAGS = { it: 'it-IT', en: 'en', es: 'es' };

const html = typeof document !== 'undefined' ? document.documentElement : null;

function detect() {
  const l = (html && html.getAttribute('lang') || 'it').slice(0, 2).toLowerCase();
  return LOCALES.includes(l) ? l : 'it';
}

export const LOCALE = detect();

/** Prefisso di cartella della lingua: '' per l'italiano, 'en/' e 'es/' per le altre. */
export const PREFIX = LOCALE === 'it' ? '' : LOCALE + '/';

/** Percorso relativo dalla pagina corrente alla radice di public_html. */
export const ROOT = (html && html.getAttribute('data-root')) || '';

let DICT = {};
if (LOCALE !== 'it' && DIZIONARI[LOCALE]) {
  try { DICT = (await DIZIONARI[LOCALE]()).default || {}; }
  catch { /* dizionario assente: si resta in italiano, che è meglio di niente */ }
}

/**
 * Traduce, sostituendo i segnaposto in stile Laravel (`:nome`).
 *
 *   t('Livello :n superato', { n: 3 })
 */
export function t(frase, params = null) {
  let out = Object.prototype.hasOwnProperty.call(DICT, frase) ? DICT[frase] : frase;
  if (params) {
    for (const [k, v] of Object.entries(params)) out = out.split(':' + k).join(String(v));
  }
  return out;
}

/** Numero scritto come lo scrive la lingua corrente (separatori delle migliaia). */
export function num(n) {
  try { return Number(n).toLocaleString(LOCALE_TAGS[LOCALE] || 'it-IT'); }
  catch { return String(n); }
}

/* ---------------- indirizzi ---------------- */

/* Le pagine fisse cambiano nome insieme alla lingua: un indirizzo in
   spagnolo che dice "metodo.html" va bene, uno che dice "lezioni" no. */
const PAGINE = {
  home: { it: 'index.html', en: 'index.html', es: 'index.html' },
  metodo: { it: 'metodo.html', en: 'method.html', es: 'metodo.html' },
  privacy: { it: 'privacy.html', en: 'privacy.html', es: 'privacidad.html' },
};

/** Cartella delle lezioni, per lingua. */
export const LESSON_DIR = { it: 'lezioni', en: 'lessons', es: 'lecciones' }[LOCALE];

/** Indirizzo di una pagina fissa, valido dalla pagina corrente. */
export function href(pagina, locale = LOCALE) {
  const nome = (PAGINE[pagina] || PAGINE.home)[locale] || PAGINE.home[locale];
  const prefisso = locale === 'it' ? '' : locale + '/';
  return ROOT + prefisso + nome;
}

/** La home della lingua corrente. */
export const homeHref = () => href('home');

/**
 * Selettore di lingua: la stessa pagina nelle altre due lingue.
 *
 * `alternates` arriva dalla pagina (i link hreflang sono già lì per il
 * motore di ricerca: riusarli evita di calcolarli due volte in modi
 * diversi, che è il modo classico di farli divergere).
 */
export function alternates() {
  const out = {};
  if (typeof document === 'undefined') return out;
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(l => {
    const lang = l.getAttribute('hreflang').slice(0, 2);
    if (LOCALES.includes(lang)) out[lang] = l.getAttribute('href');
  });
  return out;
}
