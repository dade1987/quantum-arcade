import { test, expect } from '@playwright/test';
import { slugOf } from '../../../public_html/js/core/levels.js';

/**
 * I link DENTRO una lezione, cioè quelli che un ospite non vede mai.
 *
 * Senza account la lezione non si monta: al suo posto c'è il riquadro «Serve
 * il tuo account». Quindi la barra di navigazione in fondo e il riquadro
 * «Livello superato» — i due punti in cui si erano rotte le cose — restano
 * invisibili a qualunque controllo fatto da fuori. Questo file gira con la
 * sessione salvata da 00-setup, che è l'unico modo per guardarli.
 *
 * Cosa si guarda:
 *  · «Come è fatto questo corso» deve portare al metodo. Portava alla mappa,
 *    in tutte e tre le lingue, perché href('metodo') non era un nome valido
 *    e ricadeva in silenzio sulla home: risponde 200, quindi nessun controllo
 *    sugli stati HTTP lo avrebbe mai visto;
 *  · nel riquadro «Livello superato» il grassetto dev'essere grassetto. Per
 *    mesi lì si è letto «Hai dimostrato di saperlo <b>fare</b>», perché la
 *    frase era passata a h() come figlio invece che come { html: … }.
 */

const LINGUE = [
  { code: 'it', radice: '/', lezioni: 'lezioni', metodo: '/metodo.html' },
  { code: 'en', radice: '/en/', lezioni: 'lessons', metodo: '/en/method.html' },
  { code: 'es', radice: '/es/', lezioni: 'lecciones', metodo: '/es/metodo.html' },
];

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
  const lezione = `${l.radice}${l.lezioni}/${slugOf('01-qubit', l.code)}.html`;

  test(`${l.code}: «Come è fatto questo corso» porta al metodo, non alla mappa`, async ({ page }) => {
    await page.goto(lezione);

    const barra = page.locator('.nav-foot');
    await expect(barra).toBeVisible();

    const indirizzi = await barra.locator('a').evaluateAll(as => as.map(a => a.href));
    const vie = indirizzi.map(x => new URL(x).pathname);

    expect(vie, 'la barra in fondo deve contenere il link al metodo').toContain(l.metodo);
  });

  test(`${l.code}: precedente e successivo restano nella cartella delle lezioni`, async ({ page, request }) => {
    await page.goto(lezione);
    // in inglese e spagnolo la pagina si finisce di disegnare dopo aver
    // scaricato il dizionario: senza questa attesa si guarda una pagina a metà
    await expect(page.locator('.nav-foot')).toBeVisible();

    const vie = (await page.locator('.nav-foot a').evaluateAll(as => as.map(a => a.href)))
      .map(x => new URL(x).pathname);
    expect(vie.length).toBeGreaterThanOrEqual(3);

    for (const via of vie) {
      expect((await request.get(via)).status(), via).toBe(200);
    }
    // almeno uno dei due vicini: la lezione 1 ha sempre un successivo
    expect(vie.some(v => v.includes(`/${l.lezioni}/`)), `nessun vicino in /${l.lezioni}/: ${vie}`).toBe(true);
  });
}

/*
 * Il riquadro «Livello superato» si vede solo a livello finito: qui il
 * livello si dà per superato a tavolino, così il riquadro si apre davvero.
 */
test('il riquadro «Livello superato» mostra il grassetto, non i tag', async ({ page }) => {
  const id = 'k1-bit';
  await page.addInitScript(([chiave, livello]) => {
    const stato = JSON.parse(localStorage.getItem(chiave) || '{}');
    stato.free = true;
    stato.lessons = { ...(stato.lessons || {}), [livello]: { at: Date.now(), mastered: true } };
    stato.quiz = { ...(stato.quiz || {}) };
    stato.missions = { ...(stato.missions || {}) };
    for (let i = 0; i < 20; i++) stato.quiz[`${livello}/${i}`] = { ok: true, first: true, tries: 1 };
    localStorage.setItem(chiave, JSON.stringify(stato));
  }, ['quantum-arcade:v2', id]);

  await page.goto(`/lezioni/${id}.html`);

  const gate = page.locator('#gate');
  await expect(gate).toBeVisible();

  expect(await tagScritti(page), 'tag scritti dentro la pagina del livello').toEqual([]);
  await expect(gate.locator('b').first()).toBeVisible();
});
