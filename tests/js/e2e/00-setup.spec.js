import { test as setup, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

/**
 * Preparazione: crea un account vero passando dall'interfaccia (come farebbe una
 * persona) e salva la sessione su file. I test grafici la riusano, così non
 * devono registrarsi 30 volte e collaudano il sito nello stato reale in cui lo
 * vede un iscritto.
 */

const AUTH = join(dirname(new URL(import.meta.url).pathname), '../.auth/utente.json');

setup('crea account di collaudo e salva la sessione', async ({ page, context }) => {
  mkdirSync(dirname(AUTH), { recursive: true });

  await page.goto('/');
  await page.locator('#banner-login').click();

  const card = page.locator('.modal-card');
  await expect(card).toBeVisible();

  const email = `collaudo-${Date.now()}@example.com`;
  await card.locator('.field input[type=text]').first().fill('Collaudo');
  await card.locator('.field input[type=text]').nth(1).fill('Automatico');
  await card.locator('input[type=email]').fill(email);
  await card.locator('input[type=password]').first().fill('quantum123');
  await card.locator('input[type=password]').nth(1).fill('quantum123');
  await card.locator('input[type=checkbox]').check();
  await card.getByRole('button', { name: 'Crea il mio account' }).click();

  await expect(page.getByText('Ci sei!')).toBeVisible({ timeout: 15000 });

  // modalità libera: l'audit grafico deve poter entrare in tutti i livelli
  await page.evaluate(() => {
    const k = 'quantum-arcade:v2';
    const s = JSON.parse(localStorage.getItem(k) || '{}');
    s.free = true;
    localStorage.setItem(k, JSON.stringify(s));
    localStorage.setItem('quantum-arcade:sound', 'off');
  });

  await context.storageState({ path: AUTH });
  console.log('   account di collaudo:', email);
});
