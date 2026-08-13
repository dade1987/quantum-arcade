/* ============================================================================
   AUDIT DI GIOCABILITÀ — computer, Android, iPhone

   Apre ogni livello su sei formati di schermo e controlla le cose che
   rendono un mini-gioco ingiocabile invece che solo brutto:

     · errori JavaScript;
     · sbordamenti e scroll orizzontale;
     · canvas rimasti bianchi;
     · il gioco risponde al dito (non solo al mouse);
     · il gioco entra nello schermo senza dover scorrere;
     · bersagli da toccare più piccoli di 44px (linea guida WCAG 2.5.5);
     · testo sotto i 12px;
     · comandi che finiscono fuori dallo schermo.

   Uso:  node tools/audit-giocabilita.mjs [base-url]
   Scrive il rapporto in tests/giocabilita.json
   (fuori da tests/report, che Playwright svuota a ogni corsa)
   ============================================================================ */
import { chromium, webkit } from '@playwright/test';
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const RADICE = join(dirname(new URL(import.meta.url).pathname), '..');
const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const PAGINE = ['/', '/metodo.html',
  ...LEVELS.map(l => '/lezioni/' + slugOf(l.id, 'it') + '.html')];

const IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';

// Gli iPhone girano su WebKit, cioè il motore vero di Safari: emulare un
// iPhone dentro Chrome non trova i difetti che si vedono solo su iOS.
const DISPOSITIVI = [
  { nome: 'computer',          motore: 'chromium', viewport: { width: 1366, height: 900 }, dpr: 1,     tocco: false },
  { nome: 'android-grande',    motore: 'chromium', viewport: { width: 412, height: 915 },  dpr: 2.625, tocco: true, ua: ANDROID },
  { nome: 'android-piccolo',   motore: 'chromium', viewport: { width: 360, height: 640 },  dpr: 2,     tocco: true, ua: ANDROID },
  { nome: 'iphone-13',         motore: 'webkit',   viewport: { width: 390, height: 844 },  dpr: 3,     tocco: true, ua: IOS },
  { nome: 'iphone-se',         motore: 'webkit',   viewport: { width: 375, height: 667 },  dpr: 2,     tocco: true, ua: IOS },
  { nome: 'iphone-orizzontale',motore: 'webkit',   viewport: { width: 844, height: 390 },  dpr: 3,     tocco: true, ua: IOS },
];

/* ---------- controlli eseguiti dentro la pagina ---------- */

const CONTROLLI = () => ({

  /** Niente deve sporgere oltre il bordo destro. */
  sbordamenti() {
    const largh = document.documentElement.clientWidth;
    const fuori = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      let scorrevole = false;
      for (let p = el; p && p !== document.body; p = p.parentElement) {
        const s = getComputedStyle(p);
        if (s.position === 'fixed' || s.overflowX === 'auto' || s.overflowX === 'scroll') { scorrevole = true; break; }
      }
      if (scorrevole) continue;
      if (r.right > largh + 2) fuori.push(`${el.tagName.toLowerCase()}.${String(el.className || '').split(' ')[0]} (${Math.round(r.right)}px)`);
      if (fuori.length > 3) break;
    }
    return { scrollOrizzontale: document.documentElement.scrollWidth > largh + 2, fuori };
  },

  /** Un canvas vuoto ha pochissimi colori diversi. */
  canvasVuoti() {
    const vuoti = [];
    document.querySelectorAll('canvas').forEach((c, i) => {
      if (!c.width || !c.height) return;
      const m = document.createElement('canvas');
      m.width = 60; m.height = 40;
      const x = m.getContext('2d');
      x.drawImage(c, 0, 0, 60, 40);
      const d = x.getImageData(0, 0, 60, 40).data;
      const col = new Set();
      for (let k = 0; k < d.length; k += 4) col.add(`${d[k] >> 3},${d[k + 1] >> 3},${d[k + 2] >> 3}`);
      if (col.size < 5) vuoti.push(i);
    });
    return vuoti;
  },

  /** Bersagli da toccare troppo piccoli (WCAG 2.5.5: 44×44).
      I collegamenti dentro una frase sono esclusi: la linea guida li esenta
      esplicitamente, e ingrossarli spezzerebbe il testo. */
  bersagliPiccoli() {
    const piccoli = [];
    const sel = 'button, a, input[type=range], input[type=checkbox], input[type=radio], select, .btn, .chip, .tab';
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const st = getComputedStyle(el);
      if (st.display === 'none') continue;
      if (el.tagName === 'A' && st.display === 'inline') continue;   // link dentro una frase: esentati dalla linea guida
      if (r.width < 44 || r.height < 44) {
        piccoli.push(`${el.tagName.toLowerCase()}.${String(el.className || '').split(' ')[0]}"${(el.textContent || '').trim().slice(0, 14)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
      }
      if (piccoli.length > 5) break;
    }
    return piccoli;
  },

  /** Testo troppo piccolo per un telefono. */
  testoPiccolo() {
    const p = new Set();
    for (const el of document.querySelectorAll('body *')) {
      if (!el.textContent || !el.textContent.trim()) continue;
      if (el.children.length) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs && fs < 12) p.add(`${el.tagName.toLowerCase()}.${String(el.className || '').split(' ')[0]} ${fs}px`);
      if (p.size > 4) break;
    }
    return [...p];
  },

  /** Il primo mini-gioco entra nello schermo, o bisogna scorrere per vederlo tutto? */
  giocoNelloSchermo() {
    const c = document.querySelector('.canvas-host canvas, canvas');
    if (!c) return null;
    const r = c.getBoundingClientRect();
    return {
      altezza: Math.round(r.height),
      schermo: window.innerHeight,
      piuAltoDelloSchermo: r.height > window.innerHeight,
      larghezzaOk: r.width <= document.documentElement.clientWidth + 2,
    };
  },
});

/** Impronta grezza del canvas: serve a capire se il disegno è cambiato. */
const IMPRONTA = () => {
  const c = document.querySelector('.canvas-host canvas, canvas');
  if (!c || !c.width) return null;
  const m = document.createElement('canvas');
  m.width = 40; m.height = 26;
  const x = m.getContext('2d');
  x.drawImage(c, 0, 0, 40, 26);
  const d = x.getImageData(0, 0, 40, 26).data;
  let h = 0;
  for (let k = 0; k < d.length; k += 4) h = (h * 31 + d[k] + d[k + 1] * 3 + d[k + 2] * 7) >>> 0;
  return h;
};

/* ---------- esecuzione ---------- */

const motori = {
  chromium: await chromium.launch({ executablePath: CHROME }),
  webkit: await webkit.launch(),
};
const rapporto = [];

for (const dev of DISPOSITIVI) {
  const ctx = await motori[dev.motore].newContext({
    viewport: dev.viewport,
    deviceScaleFactor: dev.dpr,
    isMobile: dev.tocco,
    hasTouch: dev.tocco,
    userAgent: dev.ua,
    locale: 'it-IT',
  });
  // tutti i livelli aperti e audio spento, come fa il collaudo esistente
  await ctx.addInitScript(() => {
    localStorage.setItem('quantum-arcade:v2', JSON.stringify({ free: true }));
    localStorage.setItem('quantum-arcade:sound', 'off');
  });

  for (const url of PAGINE) {
    const pg = await ctx.newPage();
    const errori = [];
    // il 404 di /api è atteso quando il gioco gira senza Laravel: non è un difetto
    const vero = t => !/404|Failed to load resource/.test(t);
    pg.on('pageerror', e => { if (vero(e.message)) errori.push(e.message.slice(0, 120)); });
    pg.on('console', m => { if (m.type() === 'error' && vero(m.text())) errori.push(m.text().slice(0, 120)); });

    try {
      await pg.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await pg.waitForTimeout(400);

      // scorro tutta la pagina: i mini-giochi disegnano quando entrano nello schermo
      await pg.evaluate(async () => {
        const passo = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += passo) {
          window.scrollTo(0, y);
          await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        }
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 300));
      });

      const fn = CONTROLLI.toString();
      const risultati = await pg.evaluate(`(() => { const c = (${fn})(); return {
        sbordamenti: c.sbordamenti(),
        canvasVuoti: c.canvasVuoti(),
        bersagliPiccoli: c.bersagliPiccoli(),
        testoPiccolo: c.testoPiccolo(),
        gioco: c.giocoNelloSchermo(),
      }; })()`);

      /* Il gioco risponde al dito?
         Non basta guardare se il disegno cambia: molti mini-giochi sono già
         animati da soli, e cambierebbe comunque. Il segnale pulito è che il
         motore grafico chiama preventDefault() su touchstart/mousedown, cioè
         "questo evento lo gestisco io": se l'evento torna non annullato,
         quel canvas non sta ascoltando il dito.
         Poi, come conferma, un trascinamento vero e il disegno che cambia. */
      const tocco = { canvasProvati: 0, sordi: [], disegnoCambiato: null };
      const canvasGioco = pg.locator('.canvas-host canvas');
      const quanti = await canvasGioco.count();
      for (let i = 0; i < quanti; i++) {
        const c = canvasGioco.nth(i);
        await c.scrollIntoViewIfNeeded().catch(() => {});
        await pg.waitForTimeout(120);
        const gestito = await c.evaluate((el, conTocco) => {
          const r = el.getBoundingClientRect();
          const x = r.left + r.width / 2, y = r.top + r.height / 2;
          if (conTocco) {
            try {
              const t = new Touch({ identifier: 1, target: el, clientX: x, clientY: y });
              const e = new TouchEvent('touchstart', { bubbles: true, cancelable: true, touches: [t], changedTouches: [t] });
              return !el.dispatchEvent(e);          // false da dispatchEvent = preventDefault chiamato
            } catch { /* motore senza costruttore Touch: provo col puntatore */ }
          }
          const e = new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: x, clientY: y });
          return !el.dispatchEvent(e);
        }, dev.tocco);
        tocco.canvasProvati++;
        if (!gestito) tocco.sordi.push(i);
      }
      if (quanti) {
        const c = canvasGioco.first();
        await c.scrollIntoViewIfNeeded().catch(() => {});
        await pg.waitForTimeout(150);
        const prima = await pg.evaluate(`(${IMPRONTA.toString()})()`);
        const box = await c.boundingBox();
        if (box) {
          const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
          if (dev.tocco) await pg.touchscreen.tap(cx, cy).catch(() => {});
          else {
            await pg.mouse.move(cx, cy);
            await pg.mouse.down();
            await pg.mouse.move(cx + 40, cy + 25, { steps: 6 });
            await pg.mouse.up();
          }
          await pg.waitForTimeout(350);
          const dopo = await pg.evaluate(`(${IMPRONTA.toString()})()`);
          tocco.disegnoCambiato = prima !== null && dopo !== null ? prima !== dopo : null;
        }
      }
      const rispondeAlTocco = tocco.canvasProvati ? tocco.sordi.length === 0 : null;

      rapporto.push({ dispositivo: dev.nome, url, errori, ...risultati, rispondeAlTocco, tocco });
    } catch (e) {
      rapporto.push({ dispositivo: dev.nome, url, errori: ['CARICAMENTO: ' + e.message.slice(0, 100)] });
    }
    await pg.close();
  }
  await ctx.close();
  console.error(`✓ ${dev.nome}`);
}

await Promise.all(Object.values(motori).map(b => b.close()));

writeFileSync(join(RADICE, 'tests/giocabilita.json'), JSON.stringify(rapporto, null, 1));
console.error(`\nrapporto: tests/giocabilita.json (${rapporto.length} combinazioni)`);
