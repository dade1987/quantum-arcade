/* ============================================================
   LANGUAGES — Italian, English, Spanish.

   This works like Laravel's JSON translations: the KEY is the Italian
   sentence, the one already written in the source. Concrete benefits:

   · Italian needs no dictionary at all (it is the identity), so the
     original site pays nothing — no extra file to download, no key to
     invent;
   · a missing translation degrades to Italian, not to `home.cta.play`:
     the reader gets a real sentence, not a fragment of code;
   · the text stays readable where it sits, which is why the rest of the
     project avoids indirection.

   The locale comes from <html lang>, and the path back to the site root
   from <html data-root> — both explicit, so a page that moves folder
   cannot break its links silently.

   THE SERVER READS THIS FILE TOO. Since the pages became Blade views,
   Laravel needs the same facts (which locales exist, what each calls its
   lessons folder, what the fixed pages are named). It does not repeat
   them: `npm run sync` generates config/site.php from here, and the
   validator refuses to pass if the copy has fallen behind.
   ============================================================ */

/* Hand-written static imports: the validator resolves them on disk, and
   the browser downloads only the dictionary it actually needs. */
const DICTIONARIES = {
  en: () => import('../i18n/en.js'),
  es: () => import('../i18n/es.js'),
};

export const LOCALES = ['it', 'en', 'es'];

/** The name of each language in that language, for the picker. */
export const LOCALE_NAMES = { it: 'Italiano', en: 'English', es: 'Español' };

/** Full tag, for hreflang attributes and for the API. */
export const LOCALE_TAGS = { it: 'it-IT', en: 'en', es: 'es' };

/** The folder each locale calls its lessons. Read by tools/sync-site.mjs. */
export const LESSON_DIRS = { it: 'lezioni', en: 'lessons', es: 'lecciones' };

/* The fixed pages change name along with the language: a Spanish address
   that reads "privacidad.html" is fine, one that reads "privacy" is not. */
const PAGES = {
  home: { it: '', en: '', es: '' },
  method: { it: 'metodo.html', en: 'method.html', es: 'metodo.html' },
  privacy: { it: 'privacy.html', en: 'privacy.html', es: 'privacidad.html' },
};

/** I nomi validi delle pagine fisse. Il validatore li rilegge da qui. */
export const PAGINE = Object.keys(PAGES);

const html = typeof document !== 'undefined' ? document.documentElement : null;

function detect() {
  const l = (html && html.getAttribute('lang') || 'it').slice(0, 2).toLowerCase();
  return LOCALES.includes(l) ? l : 'it';
}

export const LOCALE = detect();

/** Folder prefix of the current locale: '' for Italian, 'en/' and 'es/' for the rest. */
export const PREFIX = LOCALE === 'it' ? '' : LOCALE + '/';

/** Path from the current page back to the root of the site. */
export const ROOT = (html && html.getAttribute('data-root')) || '';

/** The lessons folder of the current locale. */
export const LESSON_DIR = LESSON_DIRS[LOCALE];

let DICT = {};
if (LOCALE !== 'it' && DICTIONARIES[LOCALE]) {
  try { DICT = (await DICTIONARIES[LOCALE]()).default || {}; }
  catch { /* dictionary missing: we stay in Italian, which beats nothing */ }
}

/**
 * Translates, filling in Laravel-style placeholders (`:name`).
 *
 *   t('Livello :n superato', { n: 3 })
 */
export function t(phrase, params = null) {
  let out = Object.prototype.hasOwnProperty.call(DICT, phrase) ? DICT[phrase] : phrase;
  if (params) {
    for (const [k, v] of Object.entries(params)) out = out.split(':' + k).join(String(v));
  }
  return out;
}

/** A number written the way the current language writes it (thousands separators). */
export function num(n) {
  try { return Number(n).toLocaleString(LOCALE_TAGS[LOCALE] || 'it-IT'); }
  catch { return String(n); }
}

/* ---------------- the language the reader chose ---------------- */

/* Why remember it: the site exists in three languages and someone arriving
   from a search may land on the wrong one. Remembering the choice is there
   to avoid asking again — and above all to avoid asking after they have
   already answered.

   What we deliberately do NOT do: move anybody to another language on our
   own. Google advises against it explicitly, and so does the usability
   research — someone who asks for a page in one language and receives
   another does not understand what happened, and often cannot find the way
   back. We offer, we do not decide: see languageHint() in ui.js. */
const LOCALE_KEY = 'qa:lingua';

/** Records that this language is a deliberate choice, not an accident. */
export function rememberLocale(code) {
  try { localStorage.setItem(LOCALE_KEY, code); } catch { /* private browsing: never mind */ }
}

/** The language chosen in the past, if a choice was ever made. */
export function rememberedLocale() {
  try {
    const l = localStorage.getItem(LOCALE_KEY);
    return LOCALES.includes(l) ? l : null;
  } catch { return null; }
}

/**
 * The languages the browser says it prefers, in order, keeping only the
 * ones this site actually speaks.
 *
 * `navigator.languages` is already sorted by preference: it is the same
 * information as the Accept-Language header, which is what the reader
 * configured once and expects to be honoured.
 */
export function browserLocales() {
  if (typeof navigator === 'undefined') return [];
  const declared = navigator.languages?.length ? navigator.languages : [navigator.language];
  const seen = new Set();
  return (declared || [])
    .map(x => String(x || '').slice(0, 2).toLowerCase())
    .filter(x => LOCALES.includes(x) && !seen.has(x) && seen.add(x));
}

/* ---------------- addresses ---------------- */

/**
 * Address of a fixed page, valid from the page you are on.
 *
 * An unknown name is an error and says so. It used to fall back to the home
 * page, and that silence cost a broken button on every single lesson: the
 * call said href('metodo') — the Italian word — while the page here is
 * called 'method', so «Come è fatto questo corso» quietly pointed at the map
 * in all three languages, and no test could tell the difference between a
 * link to the home page and a link that MEANT to go to the home page.
 */
export function href(page, locale = LOCALE) {
  const entry = PAGES[page];
  if (!entry) throw new Error(`href(): pagina sconosciuta "${page}" (valide: ${PAGINE.join(', ')})`);
  const prefix = locale === 'it' ? '' : locale + '/';
  return ROOT + prefix + (entry[locale] ?? entry.it);
}

/** The home page of the current locale. */
export const homeHref = () => href('home');

/**
 * Language picker: the same page in the other two languages.
 *
 * The addresses come from the page itself — the hreflang links are already
 * there for the search engines, and reusing them avoids computing the same
 * thing twice in two different ways, which is the classic way of letting
 * them drift apart.
 */
export function alternates() {
  const out = {};
  if (typeof document === 'undefined') return out;
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(l => {
    const lang = l.getAttribute('hreflang').slice(0, 2);
    if (!LOCALES.includes(lang)) return;
    /* The <link> tags carry the absolute address, because that is what search
       engines require. The picker, though, has to work locally and in preview
       too: we keep only the path, so it stays on whichever host you are
       reading from. */
    try { out[lang] = new URL(l.getAttribute('href'), location.href).pathname; }
    catch { out[lang] = l.getAttribute('href'); }
  });
  return out;
}
