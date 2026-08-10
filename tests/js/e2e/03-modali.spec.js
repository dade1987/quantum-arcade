import { test, expect } from '@playwright/test';

/**
 * Le finestre modali (registrazione e accesso) girano SENZA sessione salvata:
 * è lo stato in cui le vede chi arriva per la prima volta.
 */

test.describe('finestre modali', () => {
  test('la registrazione è allineata, leggibile e non sborda', async ({ page }) => {
    await page.goto('/');
    await page.locator('#banner-login').click();
    const card = page.locator('.modal-card');
    await expect(card).toBeVisible();

    // niente sbordamenti dentro la finestra
    const dentro = await card.evaluate(el => {
      const box = el.getBoundingClientRect();
      const fuori = [];
      el.querySelectorAll('*').forEach(c => {
        const r = c.getBoundingClientRect();
        if (r.width && (r.right > box.right + 1 || r.left < box.left - 1)) {
          fuori.push(c.tagName + '.' + (c.className || ''));
        }
      });
      return fuori;
    });
    expect(dentro, 'elementi che escono dalla finestra').toEqual([]);

    // le due colonne del form devono partire alla stessa altezza, riga per riga
    const disallineati = await card.evaluate(el => {
      const campi = [...el.querySelectorAll('.form-grid .field')];
      const problemi = [];
      for (let i = 0; i + 1 < campi.length; i += 2) {
        const a = campi[i].getBoundingClientRect();
        const b = campi[i + 1].getBoundingClientRect();
        if (Math.abs(a.top - b.top) > 2) problemi.push(`riga ${i / 2 + 1}: scarto ${Math.round(Math.abs(a.top - b.top))}px`);
      }
      return problemi;
    });
    expect(disallineati, 'righe del form disallineate').toEqual([]);

    // la data di nascita deve essere in italiano (giorno/mese/anno), non mm/dd/yyyy
    await expect(card.locator('.birth-row select')).toHaveCount(3);
    await expect(card.locator('.birth-row select').nth(1)).toContainText('mese');
    expect(await card.locator('input[type=date]').count(), 'niente input date, formato non controllabile').toBe(0);

    // la finestra sta nello schermo (o scorre al suo interno)
    const altezza = await card.evaluate(el => ({ h: el.getBoundingClientRect().height, vh: window.innerHeight, scroll: getComputedStyle(el).overflowY }));
    expect(altezza.h <= altezza.vh || altezza.scroll === 'auto', 'la finestra non ci sta e non scorre').toBe(true);
  });

  test('la finestra di accesso funziona e si chiude', async ({ page }) => {
    await page.goto('/');
    await page.locator('#banner-login').click();
    await page.getByRole('button', { name: 'Ho già un account' }).click();
    await expect(page.getByRole('heading', { name: 'Bentornato' })).toBeVisible();
    await page.keyboard.press('Escape').catch(() => {});
    await page.locator('.modal-back').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('.modal-card')).toHaveCount(0);
  });
});
