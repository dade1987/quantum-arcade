import { test, expect } from '@playwright/test';
import { LEVELS, slugOf } from '../../../public_html/js/core/levels.js';
import { SPIA, ANALIZZA } from '../../../tools/spia-canvas.mjs';

/**
 * COLLAUDO DELLE SCRITTE DENTRO I MINI-GIOCHI
 *
 * Il collaudo grafico (02-grafica) misura gli elementi HTML: sa dire se un
 * bottone sborda, non se una scritta disegnata dentro un canvas finisce sotto
 * il bordo. E quasi tutto quello che c'è da leggere in un mini-gioco è
 * disegnato dentro il canvas — per il DOM non esiste.
 *
 * Così è passato il difetto che si vedeva a occhio nudo appena si apriva la
 * lezione K·6: la terza riga di bit disegnata mezza fuori dalla tela, con i due
 * conteggi in fondo scritti sopra. Nessun test lo vedeva perché nessun test
 * guardava DENTRO la tela.
 *
 * Qui si intercetta il disegno (la spia è la stessa che usa
 * tools/audit-canvas-text.mjs, così le due misure non possono divergere) e si
 * pretende che, su OGNI livello:
 *
 *   · niente esca dai quattro bordi della tela;
 *   · niente riquadro venga tagliato dal fondo;
 *   · due scritte non si accavallino;
 *   · una barra o una linea non passi sopra a una scritta già disegnata;
 *   · nessuna scritta venga troncata coi puntini;
 *   · nessuna scritta scenda sotto i 9px, che è il limite sotto cui non si
 *     legge più.
 *
 * Perché anche sul telefono: la tela si accorcia da sola quando la finestra è
 * bassa (Stage.resize), e le scene disegnate a distanze fisse dall'alto vanno a
 * sbattere sul fondo. È lì che nascono quasi tutti questi difetti.
 */

const PAGINE = LEVELS.map(l => '/lezioni/' + slugOf(l.id, 'it') + '.html');

test.describe('scritte dentro i mini-giochi', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(SPIA);
  });

  for (const url of PAGINE) {
    test(`niente scritte fuori posto: ${url}`, async ({ page }) => {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);

      // numero le tele: le sovrapposizioni si confrontano dentro una scena sola
      await page.evaluate(() => document.querySelectorAll('canvas').forEach((c, i) => { c.__spiaId = i; }));

      const tele = page.locator('.canvas-host canvas');
      const quante = await tele.count();

      for (let i = 0; i < quante; i++) {
        /* Una scena disegna solo quando è dentro lo schermo: la si porta in
           vista, si svuota il registro e si forza un ridisegno, così si legge
           un fotogramma intero e non pezzi di istanti diversi. */
        await tele.nth(i).scrollIntoViewIfNeeded().catch(() => {});
        await page.evaluate(async () => {
          window.__disegni.length = 0;
          window.dispatchEvent(new Event('resize'));
          await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 140))));
        });
        const esito = await page.evaluate(`(${ANALIZZA.toString()})(${i})`);
        const dove = `${url} · tela ${i + 1} di ${quante}`;

        expect(esito.fuori, `scritte fuori dalla tela — ${dove}`).toEqual([]);
        expect(esito.tagliati, `riquadri tagliati dal fondo — ${dove}`).toEqual([]);
        expect(esito.sovrapposte, `scritte una sopra l'altra — ${dove}`).toEqual([]);
        expect(esito.coperte, `scritte coperte da una barra — ${dove}`).toEqual([]);
        expect(esito.barrate, `scritte attraversate da una linea — ${dove}`).toEqual([]);
        expect(esito.troncate, `scritte troncate coi puntini — ${dove}`).toEqual([]);

        // sotto i 9px non si legge: è il limite che `text()` promette di tenere
        const illeggibili = esito.minuscole.filter(m => parseFloat(/\(([\d.]+)px\)/.exec(m)?.[1]) < 9);
        expect(illeggibili, `scritte sotto i 9px — ${dove}`).toEqual([]);
      }
    });
  }
});
