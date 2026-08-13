/* ============================================================
   GENERA public_html/sitemap.xml

     node tools/sitemap.mjs          riscrive la sitemap
     node tools/sitemap.mjs --check  controlla e basta (esce 1 se è vecchia)

   PERCHÉ È GENERATA E NON SCRITTA A MANO

   Con una lingua sola erano trenta righe e si aggiornavano a occhio. Con tre
   lingue sono novanta, e ognuna porta con sé i link alle altre due versioni
   (`xhtml:link rel="alternate"`), che è il modo in cui si dice a Google
   «queste tre pagine sono la stessa cosa in tre lingue» invece di lasciargliele
   trattare come contenuto duplicato.

   Novanta righe con tre rimandi incrociati ciascuna non si tengono allineate a
   mano: la fonte di verità è l'elenco LEVELS di public_html/js/core/levels.js,
   lo stesso da cui il gioco costruisce la mappa. Se nasce un livello, la
   sitemap lo sa senza che nessuno se ne debba ricordare.
   ============================================================ */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const SITO = 'https://quantumarcade.it/';
const DEST = join(ROOT, 'public_html/sitemap.xml');
const CHECK = process.argv.includes('--check');

/* Le tre copie del sito. `dir` è il prefisso nell'indirizzo, `lezioni` la
   cartella delle lezioni: cambiano entrambe, perché anche gli indirizzi sono
   tradotti (una pagina in spagnolo che vive in /lezioni/ è una pagina mezza
   tradotta, e si vede). */
const LINGUE = [
  { code: 'it', dir: '',    lezioni: 'lezioni',   metodo: 'metodo.html', privacy: 'privacy.html' },
  { code: 'en', dir: 'en/', lezioni: 'lessons',   metodo: 'method.html', privacy: 'privacy.html' },
  { code: 'es', dir: 'es/', lezioni: 'lecciones', metodo: 'metodo.html', privacy: 'privacidad.html' },
];

const { LEVELS, slugOf } = await import(pathToFileURL(join(ROOT, 'public_html/js/core/levels.js')).href);

/** La data di oggi in formato ISO, o quella già scritta nella sitemap se non cambia niente. */
function oggi() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Tutte le pagine del sito, ognuna con il suo indirizzo nelle tre lingue.
 *
 * @returns {Array<{priorita: string, url: Record<string, string>}>}
 */
function pagine() {
  const url = (l, nome) => SITO + l.dir + nome;
  const perLingua = fn => Object.fromEntries(LINGUE.map(l => [l.code, fn(l)]));

  const elenco = [
    { priorita: '1.0', url: perLingua(l => url(l, '')) },
    { priorita: '0.8', url: perLingua(l => url(l, l.metodo)) },
  ];

  for (const lv of LEVELS) {
    elenco.push({
      priorita: '0.8',
      url: perLingua(l => url(l, `${l.lezioni}/${slugOf(lv.id, l.code)}.html`)),
    });
  }

  // la privacy è ultima e conta poco per la ricerca, ma deve essere indicizzabile:
  // un'informativa che i motori non trovano è un'informativa che nessuno legge
  elenco.push({ priorita: '0.3', url: perLingua(l => url(l, l.privacy)) });

  return elenco;
}

/** Solo le lingue davvero pubblicate: una pagina promessa e assente è peggio di una pagina assente. */
function pubblicate() {
  return LINGUE.filter(l => existsSync(join(ROOT, 'public_html', l.dir, 'index.html')));
}

function costruisci(data) {
  const lingue = pubblicate();
  const righe = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- GENERATO da tools/sitemap.mjs (npm run sitemap) — non modificare a mano. -->',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  for (const p of pagine()) {
    for (const l of lingue) {
      righe.push('  <url>');
      righe.push(`    <loc>${p.url[l.code]}</loc>`);
      // ogni pagina elenca sé stessa e le sorelle: è la forma che Google
      // pretende, e l'italiano fa anche da x-default per chi non combacia
      for (const alt of lingue) {
        righe.push(`    <xhtml:link rel="alternate" hreflang="${alt.code}" href="${p.url[alt.code]}"/>`);
      }
      righe.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${p.url.it}"/>`);
      righe.push(`    <lastmod>${data}</lastmod>`);
      righe.push('    <changefreq>monthly</changefreq>');
      righe.push(`    <priority>${p.priorita}</priority>`);
      righe.push('  </url>');
    }
  }

  righe.push('</urlset>', '');

  return righe.join('\n');
}

/* La data non è un contenuto: se cambiassimo solo quella a ogni esecuzione,
   ogni `npm run sitemap` sporcherebbe il diff senza dire niente di nuovo.
   Quindi si riusa quella già scritta, a meno che qualcosa sia davvero cambiato. */
const vecchia = existsSync(DEST) ? readFileSync(DEST, 'utf8') : '';
const dataVecchia = (vecchia.match(/<lastmod>([\d-]+)<\/lastmod>/) || [])[1];
const invariata = dataVecchia && costruisci(dataVecchia) === vecchia;
const nuova = invariata ? vecchia : costruisci(oggi());

const lingue = pubblicate().map(l => l.code).join(', ');
const quante = (nuova.match(/<loc>/g) || []).length;

if (CHECK) {
  if (invariata) {
    console.log(`✅ sitemap aggiornata: ${quante} indirizzi (${lingue})`);
  } else {
    console.error('❌ sitemap.xml non è allineata ai livelli: esegui `npm run sitemap`');
    process.exit(1);
  }
} else {
  writeFileSync(DEST, nuova);
  console.log(`✅ ${quante} indirizzi in ${lingue} → public_html/sitemap.xml${invariata ? ' (già aggiornata)' : ''}`);
}
