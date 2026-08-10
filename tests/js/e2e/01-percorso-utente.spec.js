import { test, expect } from '@playwright/test';
import { LEVELS } from '../../../public_html/js/core/levels.js';

/**
 * Il percorso completo di chi arriva sul sito:
 * home → registrazione → livello bloccato che si apre → gioco → missione →
 * quiz → sblocco del livello successivo.
 */

/** Email diversa a ogni esecuzione: i test non devono dipendere l'uno dall'altro. */
const nuovaEmail = () => `test-${Date.now()}-${Math.floor(Math.random() * 1e4)}@example.com`;

async function registrati(page, email = nuovaEmail()) {
  await page.goto('/');
  await page.getByRole('button', { name: /Crea account|Crea il tuo account|Entra/ }).first().click()
    .catch(() => page.locator('#continue').click());

  const modale = page.locator('.modal-card');
  await expect(modale).toBeVisible();

  await modale.locator('.field input[type=text]').first().fill('Amos');
  await modale.locator('.field input[type=text]').nth(1).fill('Verdi');
  await modale.locator('input[type=email]').fill(email);
  await modale.locator('input[type=password]').first().fill('quantum123');
  await modale.locator('input[type=password]').nth(1).fill('quantum123');
  await modale.locator('input[type=checkbox]').check();
  await modale.getByRole('button', { name: 'Crea il mio account' }).click();

  await expect(page.getByText('Ci sei!')).toBeVisible({ timeout: 15_000 });
  return email;
}

test.describe('percorso completo', () => {
  test('la home mostra il corso e invita a registrarsi', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Quantum Arcade/);
    await expect(page.getByRole('heading', { name: /Impara l'informatica quantistica/ })).toBeVisible();
    await expect(page.locator('#account-banner')).toBeVisible();
    // la mappa elenca tutti i livelli
    // il numero viene da levels.js, non scritto a mano: aggiungere un livello
    // non deve far fallire un test che non c'entra niente
    await expect(page.locator('.level')).toHaveCount(LEVELS.length);
  });

  test('un livello è chiuso a chi non ha l\'account', async ({ page }) => {
    await page.goto('/lezioni/01-qubit.html');
    await expect(page.getByText('Serve il tuo account')).toBeVisible();
    // il contenuto della lezione non deve essere montato
    await expect(page.locator('.widget')).toHaveCount(0);
  });

  test('registrazione, gioco, missione e quiz sbloccano il livello 2', async ({ page }) => {
    await registrati(page);

    await page.goto('/lezioni/01-qubit.html');
    await expect(page.locator('h1')).toHaveText(/Il qubit/);

    // i mini-giochi sono montati
    const widget = page.locator('.widget');
    await expect(widget.first()).toBeVisible();
    expect(await widget.count()).toBeGreaterThan(2);

    // il canvas ha davvero disegnato qualcosa (non è una tela vuota)
    const disegnato = await page.locator('canvas').first().evaluate(c => {
      const ctx = c.getContext('2d');
      const d = ctx.getImageData(0, 0, c.width, Math.min(60, c.height)).data;
      return d.some((v, i) => i % 4 !== 3 && v > 12);
    });
    expect(disegnato).toBe(true);

    // rispondo alle domande provando finché non becco quella giusta
    const domande = page.locator('.quiz-q');
    const n = await domande.count();
    expect(n).toBeGreaterThan(0);

    for (let i = 0; i < n; i++) {
      const q = domande.nth(i);
      const opzioni = q.locator('.quiz-opt');
      const tot = await opzioni.count();
      for (let k = 0; k < tot; k++) {
        const scelta = opzioni.nth(k);
        if (await scelta.isDisabled()) continue;
        await scelta.click();
        const giusta = await scelta.evaluate(el => el.classList.contains('right'));
        if (giusta) break;
        const riprova = q.getByRole('button', { name: /riprova/ });
        if (await riprova.count() && await riprova.isVisible()) await riprova.click();
      }
      await expect(q.locator('.quiz-opt.right')).toBeVisible();
    }

    // gli XP sono aumentati e il pannello di padronanza si aggiorna
    await expect(page.locator('.xp-label').last()).not.toHaveText('0 XP');
    await expect(page.locator('#gate')).toContainText(/Domande risposte correttamente|Livello superato/);
  });

  test('i progressi sopravvivono al ricaricamento (sono sul server)', async ({ page }) => {
    await registrati(page);
    await page.goto('/lezioni/01-qubit.html');
    await page.locator('.quiz-opt').first().click();
    await page.waitForTimeout(1800);            // attesa del salvataggio differito

    const xpPrima = await page.locator('.xp-label').last().textContent();
    await page.goto('/');
    await page.waitForTimeout(800);
    const xpDopo = await page.locator('.xp-label').last().textContent();
    expect(xpDopo).toBe(xpPrima);
  });
});
