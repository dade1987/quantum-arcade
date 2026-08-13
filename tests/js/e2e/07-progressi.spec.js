import { test, expect } from '@playwright/test';

/**
 * IL PROGRESSO NON SI PERDE CAMBIANDO PAGINA.
 *
 * Questo è il collaudo di un guasto vero, e del tipo peggiore: silenzioso.
 * Chi superava il livello 1 e cliccava subito «vai al livello 2» — cioè
 * chiunque, perché quel pulsante compare proprio lì sotto — trovava il livello
 * 2 chiuso, con scritto che prima doveva superare il livello 1. Che aveva
 * appena superato.
 *
 * Il motivo erano due dettagli che da soli non si vedono:
 * · il salvataggio sul server parte con un secondo di ritardo (per non fare
 *   una richiesta a ogni punto guadagnato), e cambiando pagina moriva prima
 *   di partire;
 * · la pagina nuova rileggeva lo stato dal server e ci SOSTITUIVA quello
 *   locale, quindi il livello appena superato non era in ritardo: era perso.
 *
 * Serve un browser vero perché il guasto vive fra due caricamenti di pagina:
 * un test unitario, che di pagine ne ha una sola, non può vederlo.
 *
 * Il livello viene superato chiamando lo store invece di giocare i cinque
 * mini-giochi: qui si collauda la sincronizzazione, non le missioni — quelle
 * le controlla il validatore, livello per livello.
 */

const L1 = '/lezioni/01-qubit.html';
const L2 = '/lezioni/02-bloch.html';

/** Un account nuovo per questo test: quello condiviso ha la modalità libera,
    che aprirebbe i livelli comunque e nasconderebbe proprio ciò che si misura. */
async function iscriviti(page) {
  await page.goto('/');
  await page.locator('#banner-login').click();
  const card = page.locator('.modal-card');
  await expect(card).toBeVisible();
  await card.locator('.field input[type=text]').first().fill('Progressi');
  await card.locator('.field input[type=text]').nth(1).fill('Collaudo');
  await card.locator('input[type=email]').fill(`progressi-${Date.now()}@example.com`);
  await card.locator('input[type=password]').first().fill('quantum123');
  await card.locator('input[type=password]').nth(1).fill('quantum123');
  await card.locator('input[type=checkbox]').check();
  await card.getByRole('button', { name: 'Crea il mio account' }).click();
  await expect(page.getByText('Ci sei!')).toBeVisible({ timeout: 15000 });
}

const stato = page => page.evaluate(async () => {
  const s = await import('/js/core/store.js');
  return { fatto: s.isLessonDone('01-qubit'), xp: s.xp(), sbloccato: s.isUnlocked('02-bloch') };
});

test('il livello superato resta superato anche cambiando pagina subito', async ({ page }) => {
  await iscriviti(page);

  // Un po' di strada fatta e ARRIVATA al server: è la condizione che rendeva
  // distruttiva la rilettura. Con il server ancora vuoto non si rilegge nulla.
  await page.goto(L1);
  await page.waitForTimeout(1500);
  await page.evaluate(async () => {
    const s = await import('/js/core/store.js');
    s.setMission('01-qubit', 'registro', true);
    s.award('mission:01-qubit/registro', 35);
  });
  await page.waitForTimeout(2500);

  await page.evaluate(async () => (await import('/js/core/store.js')).completeLesson('01-qubit'));
  const dopo = await stato(page);
  expect(dopo.fatto).toBe(true);

  // e via, senza aspettare: è il clic sul pulsante che sta lì sotto
  await page.goto(L2);
  await page.waitForTimeout(2500);

  const arrivo = await stato(page);
  expect(arrivo.fatto, 'il livello 1 risulta ancora superato').toBe(true);
  expect(arrivo.sbloccato, 'e il livello 2 è aperto').toBe(true);
  expect(arrivo.xp, 'gli XP non tornano indietro').toBeGreaterThanOrEqual(dopo.xp);
  await expect(page.getByText(/ancora chiuso/i)).toHaveCount(0);

  // e il server si è messo in pari da solo, senza che si debba rigiocare niente
  const server = await page.evaluate(async () => {
    const r = await fetch('/api/progress', { credentials: 'same-origin', headers: { Accept: 'application/json' } });
    return (await r.json()).state.lessons || {};
  });
  expect(server['01-qubit']?.mastered, 'il livello superato è arrivato al server').toBe(true);
});
