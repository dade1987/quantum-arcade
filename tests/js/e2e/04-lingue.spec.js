import { test, expect } from '@playwright/test';
import { LEVELS, slugOf } from '../../../public_html/js/core/levels.js';

/**
 * Le tre edizioni del sito: italiano nella radice, inglese in /en/,
 * spagnolo in /es/.
 *
 * Il guasto da cui difendersi non è "manca una traduzione" — quello lo trova
 * già `npm run languages` senza aprire un browser. È il guasto che si vede solo
 * girando le pagine davvero: una lezione che esiste in tre lingue ma il cui
 * cambio-lingua porta a un 404, un dizionario che non si carica e lascia
 * l'interfaccia mezza italiana in mezzo a una pagina inglese, un link
 * relativo che dalla sottocartella punta un livello troppo su.
 */

const LINGUE = [
  { code: 'it', radice: '/',    lezioni: 'lezioni'   },
  { code: 'en', radice: '/en/', lezioni: 'lessons'   },
  { code: 'es', radice: '/es/', lezioni: 'lecciones' },
];

/** L'indirizzo di una lezione nella lingua indicata. */
const viaDi = (l, id) => `${l.radice}${l.lezioni}/${slugOf(id, l.code)}.html`;

/**
 * Nessun elemento deve sporgere oltre il bordo destro.
 *
 * È lo stesso controllo dell'audit grafico, ripetuto qui perché quello gira
 * solo sulle pagine italiane: lo spagnolo è mediamente più lungo del 20% e la
 * barra in alto ha un elemento in più (il selettore di lingua), quindi è
 * proprio nelle altre due edizioni che il testo può uscire dallo schermo.
 */
async function sbordamenti(page) {
  return page.evaluate(() => {
    const larghezza = document.documentElement.clientWidth;
    const colpevoli = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      let dentroScorrevole = false;
      for (let p = el; p && p !== document.body; p = p.parentElement) {
        const s = getComputedStyle(p);
        if (s.position === 'fixed' || s.overflowX === 'auto' || s.overflowX === 'scroll') { dentroScorrevole = true; break; }
      }
      if (dentroScorrevole) continue;
      if (r.right > larghezza + 2) colpevoli.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`);
      if (colpevoli.length > 4) break;
    }
    return { scrollX: document.documentElement.scrollWidth > larghezza + 2, colpevoli };
  });
}

test.describe('le tre lingue', () => {
  for (const l of LINGUE) {
    test(`la home in ${l.code} si apre, è marcata ${l.code} ed elenca tutti i livelli`, async ({ page }) => {
      const errori = [];
      page.on('pageerror', e => errori.push(e.message));

      await page.goto(l.radice);

      await expect(page.locator('html')).toHaveAttribute('lang', l.code);
      await expect(page).toHaveTitle(/Quantum Arcade/);
      // il numero di livelli viene da levels.js: la mappa non può perderne per strada
      await expect(page.locator('.level')).toHaveCount(LEVELS.length);
      expect(errori, 'nessun errore JavaScript').toEqual([]);
    });
  }

  test('ogni lezione esiste in tutte e tre le lingue', async ({ request }) => {
    // 90 richieste secche: non aprono il browser, servono solo a dire
    // "questo indirizzo risponde". È il controllo che l'utente farebbe
    // cliccando in giro, fatto in tre secondi invece che in mezz'ora.
    const rotte = [];
    for (const lv of LEVELS) {
      for (const l of LINGUE) {
        const via = viaDi(l, lv.id);
        const r = await request.get(via);
        if (r.status() !== 200) rotte.push(`${via} → ${r.status()}`);
      }
    }
    expect(rotte, 'lezioni irraggiungibili').toEqual([]);
  });

  test('il cambio lingua porta alla stessa lezione, non alla home', async ({ page }) => {
    // andata e ritorno passando per tutte e tre: se un hreflang è sbagliato,
    // si finisce da un'altra parte e il giro non si chiude
    await page.goto(viaDi(LINGUE[0], '07-interferenza'));

    for (const [da, verso] of [[0, 1], [1, 2], [2, 0]]) {
      await page.locator('.lang-pick > summary').click();
      await page.locator(`a.lang-item[hreflang="${LINGUE[verso].code}"]`).first().click();
      await expect(page.locator('html')).toHaveAttribute('lang', LINGUE[verso].code);
      expect(new URL(page.url()).pathname).toBe(viaDi(LINGUE[verso], '07-interferenza'));
    }

    expect(new URL(page.url()).pathname).toBe(viaDi(LINGUE[0], '07-interferenza'));
  });

  test('le pagine statiche hanno il selettore e i suoi link funzionano', async ({ page }) => {
    // metodo e privacy non hanno il motore del gioco: il selettore è scritto
    // nell'HTML, quindi i suoi percorsi relativi non li controlla nessuno
    // a meno di seguirli
    for (const via of ['/metodo.html', '/privacy.html', '/en/method.html', '/en/privacy.html',
      '/es/metodo.html', '/es/privacidad.html']) {
      await page.goto(via);

      const attesa = via.startsWith('/en/') ? 'English' : via.startsWith('/es/') ? 'Español' : 'Italiano';
      await expect(page.locator('.lang-item.on')).toHaveText('✓' + attesa);
      // il bottone dice già in che lingua sei, senza aprirlo
      await expect(page.locator('.lang-now .lang-name')).toHaveText(attesa);

      for (const href of await page.locator('a.lang-item').evaluateAll(a => a.map(x => x.getAttribute('href')))) {
        const r = await page.request.get(new URL(href, page.url()).href);
        expect(r.status(), `${via} → ${href}`).toBe(200);
      }
    }
  });

  test("l'interfaccia del gioco è tradotta, non solo il testo della lezione", async ({ page }) => {
    // Il testo della lezione sta scritto nell'HTML; tutto il resto — la
    // schermata che chiede l'account, il nome del livello, i comandi — lo
    // costruisce il JS leggendo il dizionario. Sono due strade diverse, e la
    // seconda può rompersi da sola lasciando pezzi italiani in mezzo a una
    // pagina inglese: è esattamente quello che vede chi arriva da fuori,
    // perché senza account la lezione non si apre.
    // il testo com'è scritto nel dizionario: sullo schermo lo si vede tutto
    // maiuscolo, ma quello lo fa il CSS e il DOM non lo sa
    const parole = {
      it: { invito: 'Serve il tuo account', titolo: 'Il qubit'  },
      en: { invito: 'You need an account',  titolo: 'The qubit' },
      es: { invito: 'Hace falta tu cuenta', titolo: 'El cúbit'  },
    };

    for (const l of LINGUE) {
      await page.goto(viaDi(l, '01-qubit'));

      const app = page.locator('#app');
      await expect(app).toContainText(parole[l.code].invito);
      // il nome del livello arriva da levels.js: prova che anche i dati sono tradotti
      await expect(app).toContainText(parole[l.code].titolo);

      // e nessun residuo delle altre due lingue
      for (const altra of LINGUE.filter(x => x.code !== l.code)) {
        await expect(app).not.toContainText(parole[altra.code].invito);
      }
    }
  });

  test('il backend risponde nella lingua di chi chiede', async ({ page }) => {
    // la pagina di verifica di un attestato è servita da Laravel, non dal sito
    // statico: è il posto dove si vede se l'Accept-Language del browser arriva
    // fino in fondo, e se il ?lang di un link condiviso lo scavalca
    await page.goto('/verifica/QA-FALSO1');
    await expect(page.locator('h1')).toHaveText('Verifica attestato');

    await page.goto('/verifica/QA-FALSO1?lang=en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('h1')).toHaveText('Verify certificate');

    await page.goto('/verifica/QA-FALSO1?lang=es');
    await expect(page.locator('h1')).toHaveText('Verificar certificado');

    // e da lì si torna al corso nella lingua giusta, non alla radice italiana
    await expect(page.locator('.topbar a.btn').last()).toHaveAttribute('href', '/es/');
  });

  test('niente testo fuori dallo schermo, nemmeno su telefono', async ({ page }) => {
    // le pagine più fitte: la barra con il selettore, una tabella larga,
    // la home con la mappa dei livelli
    const pagine = LINGUE.flatMap(l => [l.radice, viaDi(l, '17-fft'), viaDi(l, '21-rumore')]);

    for (const misura of [{ width: 1366, height: 900 }, { width: 360, height: 740 }]) {
      await page.setViewportSize(misura);

      for (const via of pagine) {
        await page.goto(via, { waitUntil: 'networkidle' });
        const { scrollX, colpevoli } = await sbordamenti(page);
        expect(colpevoli, `${via} a ${misura.width}px`).toEqual([]);
        expect(scrollX, `${via} a ${misura.width}px scorre in orizzontale`).toBe(false);
      }
    }
  });

  /* ---------------- il selettore ---------------- */

  test('il selettore si apre e si chiude anche solo con la tastiera', async ({ page }) => {
    // è un <details>: la tastiera deve bastare, senza che noi scriviamo un menu a mano
    await page.goto('/');
    const bottone = page.locator('.lang-pick > summary');

    await bottone.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.lang-menu')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('.lang-menu')).toBeHidden();
    await expect(bottone).toBeFocused();
  });

  test('si chiude cliccando fuori', async ({ page }) => {
    await page.goto('/');
    await page.locator('.lang-pick > summary').click();
    await expect(page.locator('.lang-menu')).toBeVisible();

    await page.locator('h1').first().click();
    await expect(page.locator('.lang-menu')).toBeHidden();
  });

  test('ogni lingua è scritta nella propria lingua, e nessuna bandiera', async ({ page }) => {
    // il punto di tutto il selettore: chi cerca la propria lingua la cerca
    // com'è scritta a casa sua. Le sigle ISO non le riconosce chi non le ha mai viste,
    // e una bandiera indicherebbe uno stato — lo spagnolo ne avrebbe venti.
    await page.goto('/');
    await page.locator('.lang-pick > summary').click();

    const voci = await page.locator('.lang-item').allInnerTexts();
    expect(voci.map(v => v.replace(/[✓\s]/g, ''))).toEqual(['Italiano', 'English', 'Español']);

    const testo = (await page.locator('.lang-pick').innerText()) + (await page.locator('.lang-pick').innerHTML());
    expect(testo, 'niente bandiere nel selettore').not.toMatch(/\uD83C[\uDDE6-\uDDFF]/);

    // e ogni voce dichiara la propria lingua, per chi legge con lo screen reader
    for (const l of LINGUE) {
      await expect(page.locator(`.lang-item[lang="${l.code}"]`)).toHaveCount(1);
    }
  });
});

/* ---------------- «c'è anche nella tua lingua» ----------------
   Un contesto a parte perché serve un browser configurato in un'altra lingua:
   è esattamente la situazione di chi arriva da una ricerca in spagnolo e
   atterra sulla pagina italiana. */
test.describe('suggerimento della lingua', () => {
  test.use({ locale: 'es-ES' });

  test('lo propone senza spostare nessuno', async ({ page }) => {
    await page.goto('/');

    // primo: NON si viene reindirizzati. Google lo sconsiglia e chi cerca
    // di proposito la versione italiana deve poterla leggere.
    expect(new URL(page.url()).pathname).toBe('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'it');

    // secondo: l'offerta è scritta nella lingua che propone, se no non si legge
    const barra = page.locator('.lang-hint');
    await expect(barra).toBeVisible();
    await expect(barra).toHaveAttribute('lang', 'es');
    await expect(barra).toContainText('también está disponible en español');
    await expect(barra.locator('a')).toHaveAttribute('href', '/es/');
  });

  test('«resta» vale come scelta e non si ripresenta più', async ({ page }) => {
    await page.goto('/');
    await page.locator('.lang-hint button').click();
    await expect(page.locator('.lang-hint')).toHaveCount(0);

    await page.reload();
    await expect(page.locator('.lang-hint')).toHaveCount(0);
  });

  test('anche scegliere dal selettore vale come scelta', async ({ page }) => {
    await page.goto('/');
    await page.locator('.lang-pick > summary').click();
    await page.locator('a.lang-item[hreflang="es"]').click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'es');

    // tornando sulla pagina italiana non deve più chiedere niente
    await page.goto('/');
    await expect(page.locator('.lang-hint')).toHaveCount(0);
  });

  test('non compare a chi è già nella lingua che preferisce', async ({ page }) => {
    await page.goto('/es/');
    await expect(page.locator('.lang-hint')).toHaveCount(0);
  });

  test('compare anche dentro una lezione, non solo sulla mappa', async ({ page }) => {
    // la home e le lezioni lo montano da due punti diversi del codice, e senza
    // account la lezione prende una terza strada ancora (la schermata che
    // chiede di registrarsi): è lì che chi arriva da una ricerca atterra
    await page.goto('/lezioni/11-grover.html');

    const barra = page.locator('.lang-hint');
    await expect(barra).toBeVisible();
    await expect(barra.locator('a')).toHaveAttribute('href', '/es/lecciones/11-grover.html');
  });
});
