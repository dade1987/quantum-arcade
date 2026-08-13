/* Gli INDIRIZZI del sito: le funzioni che scrivono gli href dei bottoni.
 *
 * Sono poche righe di codice, e sono esattamente le righe che hanno prodotto
 * i bottoni rotti che si vedevano online:
 *
 *  · href('metodo') — una pagina che nel dizionario si chiama 'method':
 *    la chiave sbagliata non dava errore, ricadeva sulla home, e il bottone
 *    «Come è fatto questo corso» in fondo a ogni lezione portava alla mappa
 *    in tutte e tre le lingue;
 *  · l.file usato nudo come href — è un indirizzo RELATIVO («lessons/x.html»),
 *    e la home inglese si raggiunge sia come /en/ sia come /en (l'.htaccess
 *    toglie la barra finale con un 301, quindi è la seconda la forma in cui
 *    ci si ritrova davvero). Da /en quel link diventa /lessons/x.html, cioè
 *    404: tutte le carte della mappa e il bottone «Continua» rotti per chi
 *    non gioca in italiano.
 *
 * Qui si collauda l'indirizzo prodotto, lingua per lingua, perché è la cosa
 * che il lettore clicca — non la funzione che lo compone.
 *
 * Una lingua per processo: la lingua di i18n.js si legge da <html lang> una
 * volta sola, quando il modulo viene caricato, e levels.js si porta dietro
 * QUELLA copia. Ricaricarlo con una query diversa darebbe due i18n distinti
 * — uno per il test e uno dentro levels.js — cioè un test che misura una
 * situazione che nel browser non esiste.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '../../..');

/** Carica i moduli in un processo suo, con la pagina già in quella lingua. */
function indirizziDi(locale, url = 'http://localhost/') {
  const script = `
    import { Window } from 'happy-dom';
    const win = new Window({ url: ${JSON.stringify(url)} });
    global.window = win;
    global.document = win.document;
    global.localStorage = win.localStorage;
    win.document.documentElement.setAttribute('lang', ${JSON.stringify(locale)});
    win.document.documentElement.setAttribute('data-root', '/');

    const i18n = await import('./public_html/js/core/i18n.js');
    const levels = await import('./public_html/js/core/levels.js');

    const pagine = {};
    for (const p of i18n.PAGINE) pagine[p] = i18n.href(p);
    let sconosciuta = null;
    try { i18n.href('metodo'); } catch (e) { sconosciuta = e.message; }

    console.log(JSON.stringify({
      locale: i18n.LOCALE,
      chiavi: i18n.PAGINE,
      pagine,
      sconosciuta,
      lezioni: levels.LEVELS.map(l => ({ id: l.id, href: levels.lessonHref(l) })),
    }));
  `;
  const out = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
    cwd: RADICE, encoding: 'utf8',
  });
  return JSON.parse(out.trim().split('\n').pop());
}

const LINGUE = [
  { code: 'it', method: '/metodo.html', privacy: '/privacy.html', home: '/', cartella: 'lezioni' },
  { code: 'en', method: '/en/method.html', privacy: '/en/privacy.html', home: '/en/', cartella: 'lessons' },
  { code: 'es', method: '/es/metodo.html', privacy: '/es/privacidad.html', home: '/es/', cartella: 'lecciones' },
];

describe('href(): le pagine fisse', () => {
  for (const l of LINGUE) {
    test(`${l.code}: home, metodo e privacy hanno ciascuno il proprio indirizzo`, () => {
      const r = indirizziDi(l.code);
      assert.equal(r.locale, l.code, 'la pagina non è stata letta nella lingua giusta');
      assert.equal(r.pagine.home, l.home);
      assert.equal(r.pagine.method, l.method);
      assert.equal(r.pagine.privacy, l.privacy);
    });

    test(`${l.code}: il metodo NON è la home (era il bottone rotto)`, () => {
      const r = indirizziDi(l.code);
      assert.notEqual(r.pagine.method, r.pagine.home);
    });
  }

  test('una pagina che non esiste si vede: non si finisce zitti sulla home', () => {
    const r = indirizziDi('it');
    assert.match(String(r.sconosciuta), /metodo/,
      'href() con una chiave inventata deve protestare, non ricadere sulla home');
  });

  test('PAGINE elenca le chiavi valide, così il validatore può controllarle', () => {
    const r = indirizziDi('it');
    assert.deepEqual([...r.chiavi].sort(), ['home', 'method', 'privacy']);
  });
});

describe('lessonHref(): le carte della mappa e il bottone «Continua»', () => {
  for (const l of LINGUE) {
    test(`${l.code}: ogni livello ha un indirizzo che parte dalla radice`, () => {
      const r = indirizziDi(l.code);
      assert.ok(r.lezioni.length > 30, 'i livelli non sono stati caricati');
      for (const lv of r.lezioni) {
        assert.match(lv.href, /^\/[^/]/, `${lv.id}: indirizzo relativo o malformato (${lv.href})`);
        assert.ok(lv.href.includes(`/${l.cartella}/`), `${lv.id}: cartella sbagliata (${lv.href})`);
        assert.ok(lv.href.endsWith('.html'), `${lv.id}: ${lv.href}`);
      }
    });

    test(`${l.code}: la barra finale nell'indirizzo della pagina non sposta i bottoni`, () => {
      const base = l.code === 'it' ? '' : l.code;
      const conBarra = indirizziDi(l.code, `http://localhost/${base}${base ? '/' : ''}`);
      const senzaBarra = indirizziDi(l.code, `http://localhost/${base}`);
      assert.deepEqual(senzaBarra.lezioni, conBarra.lezioni,
        'la barra finale non deve cambiare dove porta il bottone');
      assert.deepEqual(senzaBarra.pagine, conBarra.pagine);
    });
  }
});
