import { test, expect } from '@playwright/test';
import { LEVELS, slugOf } from '../../../public_html/js/core/levels.js';

/**
 * I LINK, e i tag che non devono vedersi.
 *
 * Due guasti sono arrivati fino agli occhi di chi gioca, e nessuno dei due
 * fa rumore: non c'è un errore in console, non c'è una richiesta fallita —
 * c'è solo un bottone che porta altrove e una frase con dentro «<b>».
 *
 *  1. href('metodo') invece di href('method'): il bottone «Come è fatto
 *     questo corso», in fondo a OGNI lezione, portava alla mappa in tutte e
 *     tre le lingue. Un 200, non un 404: nessun controllo di stato lo vede.
 *  2. l.file usato nudo come href. È relativo, e la home inglese si raggiunge
 *     sia come /en/ sia come /en (l'.htaccess toglie la barra finale con un
 *     301: la seconda è la forma in cui ci si ritrova davvero). Da /en le
 *     carte della mappa e il bottone «Continua» puntavano a /lessons/…, 404.
 *
 * Quindi qui non si controlla solo che i link rispondano: si controlla anche
 * DOVE vanno quelli che hanno un dovere preciso, e si aprono le home nelle
 * due forme, con e senza barra finale.
 */

const LINGUE = [
  { code: 'it', radice: '/', lezioni: 'lezioni', metodo: '/metodo.html', privacy: '/privacy.html' },
  { code: 'en', radice: '/en/', lezioni: 'lessons', metodo: '/en/method.html', privacy: '/en/privacy.html' },
  { code: 'es', radice: '/es/', lezioni: 'lecciones', metodo: '/es/metodo.html', privacy: '/es/privacidad.html' },
];

/* Un livello per lingua è abbastanza per i controlli sui link: le pagine sono
   costruite tutte dalla stessa funzione, e la lista intera la gira già
   l'audit grafico. Il primo livello, però, si controlla in tutte le lingue. */
const LIVELLO = '01-qubit';

/** Tutti i link interni della pagina, già risolti in indirizzi assoluti. */
async function linkInterni(page) {
  const base = new URL(page.url()).origin;
  const link = await page.evaluate(() => [...document.querySelectorAll('a[href]')]
    .map(a => ({ href: a.href, testo: (a.textContent || '').trim().slice(0, 60), classe: a.className })));
  return link
    .filter(l => l.href.startsWith(base) && !l.href.includes('#'))
    .map(l => ({ ...l, via: new URL(l.href).pathname }));
}

/** Le frasi in cui si leggerebbero i tag invece di vederli applicati. */
async function tagScritti(page) {
  return page.evaluate(() => {
    const fuori = [];
    const cammino = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let nodo;
    while ((nodo = cammino.nextNode())) {
      const padre = nodo.parentElement;
      if (!padre) continue;
      // dentro <code> e <pre> il markup scritto è il contenuto, non un guasto
      if (padre.closest('code, pre, script, style, textarea')) continue;
      if (/<\/?(b|i|code|br|span|em|strong|p|ul|ol|li|div|a|h[1-6]|small)\b[^>]*>/i.test(nodo.nodeValue)) {
        fuori.push(nodo.nodeValue.trim().slice(0, 120));
      }
    }
    return fuori;
  });
}

for (const l of LINGUE) {
  const lezione = `${l.radice}${l.lezioni}/${slugOf(LIVELLO, l.code)}.html`;

  test(`${l.code}: nessun link rotto sulla home`, async ({ page, request }) => {
    await page.goto(l.radice);
    const link = await linkInterni(page);
    expect(link.length).toBeGreaterThan(5);

    for (const { via, testo } of link) {
      const r = await request.get(via);
      expect(r.status(), `«${testo}» → ${via}`).toBeLessThan(400);
    }
  });

  test(`${l.code}: nessun link rotto in fondo a una lezione`, async ({ page, request }) => {
    await page.goto(lezione);
    const link = await linkInterni(page);

    for (const { via, testo } of link) {
      const r = await request.get(via);
      expect(r.status(), `«${testo}» → ${via}`).toBeLessThan(400);
    }
  });

  /*
   * Il guasto numero 2, riprodotto: la home SENZA barra finale. È l'indirizzo
   * su cui atterra chiunque, perché è quello che l'.htaccess impone con un
   * 301, ed è quello in cui i link relativi cambiano significato.
   */
  test(`${l.code}: i bottoni della mappa funzionano anche senza barra finale`, async ({ page, request }) => {
    const senzaBarra = l.radice === '/' ? '/' : l.radice.replace(/\/$/, '');
    await page.goto(senzaBarra);

    const continua = page.locator('#continue');
    await expect(continua).toBeVisible();
    const via = new URL(await continua.evaluate(a => a.href)).pathname;
    expect(via, 'il bottone «Continua» deve puntare dentro la cartella delle lezioni')
      .toContain(`/${l.lezioni}/`);
    expect((await request.get(via)).status()).toBe(200);

    const carte = await page.locator('a.level').evaluateAll(as => as.map(a => a.href));
    expect(carte.length).toBeGreaterThan(0);
    for (const carta of carte) {
      const p = new URL(carta).pathname;
      expect(p, 'carta della mappa fuori dalla cartella delle lezioni').toContain(`/${l.lezioni}/`);
      expect((await request.get(p)).status(), p).toBe(200);
    }
  });

  test(`${l.code}: nessun tag HTML scritto in chiaro nel testo`, async ({ page }) => {
    for (const via of [l.radice, lezione, l.metodo, l.privacy]) {
      await page.goto(via);
      expect(await tagScritti(page), `tag visibili in ${via}`).toEqual([]);
    }
  });
}

/* La sitemap è l'elenco che i motori seguono: un indirizzo morto lì dentro
   è un link rotto pubblicato apposta. */
test('ogni indirizzo della sitemap risponde', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const indirizzi = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname);
  expect(indirizzi.length).toBeGreaterThan(LEVELS.length);

  for (const via of indirizzi) {
    expect((await request.get(via)).status(), via).toBeLessThan(400);
  }
});
