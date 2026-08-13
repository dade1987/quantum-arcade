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

/**
 * E si salva TUTTO, non solo i livelli.
 *
 * Il livello superato è la cosa che si nota, perché chiude la strada. Ma
 * quello che il gioco tiene da parte è di più, e ogni pezzo serve a qualcosa
 * di preciso: le missioni fatte (per non rifarle), le domande già risposte
 * (per non ridarle), i premi già assegnati (per non pagare due volte gli
 * stessi XP), il mazzo di ripasso con la scatola di ogni domanda (è il metodo
 * Leitner: la scatola decide fra quanti giorni la rivedi, e persa quella si
 * riparte da capo con il ripasso di tutto), e la modalità libera.
 *
 * Se ne mancasse uno, il danno non si vedrebbe subito — si vedrebbe giorni
 * dopo, sotto forma di ripasso che ricomincia da zero o di XP che tornano.
 * Per questo il controllo si fa da un dispositivo pulito: stessa sessione,
 * niente memoria locale. Quello che torna, torna dal server; quello che non
 * c'è, non c'era.
 */
test('missioni, quiz, ripasso e XP tornano tutti da un dispositivo pulito', async ({ page }) => {
  await iscriviti(page);

  await page.goto(L1);
  await page.waitForTimeout(1500);
  await page.evaluate(async () => {
    const s = await import('/js/core/store.js');
    s.setMission('01-qubit', 'registro', true);
    s.setMission('01-qubit', 'polaroid', true);
    s.award('mission:01-qubit/registro', 35);
    const domanda = { q: 'Quanto vale la probabilità?', options: ['a', 'a²'], correct: 1, why: 'è l\'area' };
    s.recordQuiz('01-qubit', 0, true, domanda);    // giusta → sale di scatola
    s.recordQuiz('01-qubit', 1, false, domanda);   // sbagliata → torna alla prima
    s.award('quiz:01-qubit/0', 15);
    s.completeLesson('01-qubit');
    s.setFreeMode(true);
  });
  await page.waitForTimeout(2500);      // il tempo di arrivare al server
  const prima = await page.evaluate(async () => (await import('/js/core/store.js')).getState());

  // dispositivo pulito: la sessione resta, la memoria locale no
  await page.evaluate(() => localStorage.clear());
  await page.goto(L1);
  await page.waitForTimeout(2500);
  const dopo = await page.evaluate(async () => (await import('/js/core/store.js')).getState());

  expect(dopo.xp, 'gli XP').toBe(prima.xp);
  expect(dopo.lessons, 'i livelli superati').toEqual(prima.lessons);
  expect(dopo.missions, 'le missioni fatte').toEqual(prima.missions);
  expect(dopo.quiz, 'le domande già risposte, con quante volte e se al primo colpo').toEqual(prima.quiz);
  expect(dopo.seen, 'i premi già assegnati (senza, gli XP si prenderebbero due volte)').toEqual(prima.seen);
  expect(dopo.free, 'la modalità libera').toBe(true);

  // il mazzo di ripasso per intero: testo della domanda, opzioni e SCATOLA
  expect(Object.keys(dopo.bank).sort()).toEqual(Object.keys(prima.bank).sort());
  expect(dopo.bank['01-qubit/0'].box, 'la risposta giusta è salita di scatola').toBe(2);
  expect(dopo.bank['01-qubit/1'].box, 'quella sbagliata è tornata alla prima').toBe(1);
  expect(dopo.bank['01-qubit/0'].q, 'e la domanda è tutta lì, non solo il suo esito').toBeTruthy();
  expect(dopo.bank['01-qubit/0'].options).toEqual(prima.bank['01-qubit/0'].options);
});
