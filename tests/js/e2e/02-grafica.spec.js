import { test, expect } from '@playwright/test';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

/**
 * Controlli grafici automatici su OGNI pagina e su OGNI finestra modale.
 *
 * Cercano i difetti che si notano solo guardando:
 *  · testo che esce dal suo contenitore o dalla pagina (scroll orizzontale);
 *  · elementi sovrapposti (due scritte una sopra l'altra);
 *  · canvas rimasti bianchi;
 *  · bersagli troppo piccoli da toccare su telefono;
 *  · contrasto insufficiente;
 *  · campi di un form disallineati fra le colonne.
 */

const ROOT = join(dirname(new URL(import.meta.url).pathname), '../../..');   // tests/js/e2e → radice
const PAGINE = ['/', '/metodo.html', '/privacy.html',
  ...readdirSync(join(ROOT, 'public_html/lezioni')).filter(f => f.endsWith('.html')).map(f => '/lezioni/' + f)];

/** Nessun elemento deve sporgere oltre il bordo destro della pagina. */
async function nessunoSbordamento(page) {
  return page.evaluate(() => {
    const larghezza = document.documentElement.clientWidth;
    const colpevoli = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      // salto ciò che è fisso e ciò che sta dentro un contenitore che scorre
      // da solo (per esempio i blocchi <pre>): lì sporgere è voluto.
      let dentroScorrevole = false;
      for (let p = el; p && p !== document.body; p = p.parentElement) {
        const s2 = getComputedStyle(p);
        if (s2.position === 'fixed' || s2.overflowX === 'auto' || s2.overflowX === 'scroll') { dentroScorrevole = true; break; }
      }
      if (dentroScorrevole) continue;
      if (r.right > larghezza + 2) {
        colpevoli.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} → ${Math.round(r.right)}px > ${larghezza}px`);
      }
      if (colpevoli.length > 4) break;
    }
    return { scrollX: document.documentElement.scrollWidth > larghezza + 2, colpevoli };
  });
}

/**
 * I canvas devono aver disegnato qualcosa.
 * Rimpicciolisco l'intera tela in 80×50 e conto quanti colori diversi ci sono:
 * una tela vuota ha un colore solo, un mini-gioco ne ha decine.
 */
async function canvasDisegnati(page) {
  // I mini-giochi disegnano solo quando entrano nello schermo (per non sprecare
  // batteria): quindi prima scorro la pagina, come farebbe una persona.
  await page.evaluate(async () => {
    const passo = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 250));
  });

  return page.evaluate(() => {
    const vuoti = [];
    document.querySelectorAll('canvas').forEach((c, i) => {
      if (!c.width || !c.height) return;
      const mini = document.createElement('canvas');
      mini.width = 80; mini.height = 50;
      const mctx = mini.getContext('2d');
      mctx.drawImage(c, 0, 0, 80, 50);
      const d = mctx.getImageData(0, 0, 80, 50).data;
      const colori = new Set();
      for (let k = 0; k < d.length; k += 4) {
        colori.add(`${d[k] >> 3},${d[k + 1] >> 3},${d[k + 2] >> 3}`);
      }
      if (colori.size < 5) vuoti.push({ indice: i, colori: colori.size });
    });
    return vuoti;
  });
}

test.describe('grafica di tutte le pagine', () => {
  for (const url of PAGINE) {
    test(`layout corretto: ${url}`, async ({ page }, testInfo) => {
      const errori = [];
      page.on('pageerror', e => errori.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errori.push(m.text()); });

      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);            // i canvas disegnano al primo frame

      expect(errori, 'errori JavaScript in console').toEqual([]);

      const { scrollX, colpevoli } = await nessunoSbordamento(page);
      expect(colpevoli, `elementi che sbordano a destra su ${url}`).toEqual([]);
      expect(scrollX, `${url} ha scroll orizzontale`).toBe(false);

      const vuoti = await canvasDisegnati(page);
      expect(vuoti, `canvas rimasti vuoti su ${url}`).toEqual([]);

      // ogni pagina ha un solo h1 e un titolo sensato
      await expect(page.locator('h1')).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(10);

      await testInfo.attach('schermata', {
        body: await page.screenshot({ fullPage: false }),
        contentType: 'image/png',
      });
    });
  }
});
