/* ============================================================================
   AUDIT DEI TESTI DISEGNATI DENTRO I CANVAS

   Il collaudo grafico esistente misura gli elementi HTML. Ma nei mini-giochi
   quasi tutte le scritte sono disegnate dentro il canvas con fillText: per il
   DOM non esistono, quindi nessuna misura su getBoundingClientRect può
   accorgersi che una scritta esce dal bordo o che due si sovrappongono.

   Qui si intercetta fillText/strokeText, si registra dove finisce ogni scritta
   e poi si controlla:

     · testo che esce dalla tela, da tutti e quattro i lati;
     · riquadri tagliati dal bordo di sotto;
     · testo che si sovrappone a un'altra scritta, o che una barra copre;
     · testo attraversato da una linea;
     · testo troncato coi puntini perché non ci stava;
     · testo troppo piccolo per essere letto su un telefono.

   Per avere un fotogramma coerente, e non scritte di istanti diversi
   dell'animazione, prima di leggere si svuota il registro e si forza un
   ridisegno di tutte le scene (un evento resize le marca "sporche").

   Uso:  node tools/audit-canvas-text.mjs [base-url]
   ============================================================================ */
import { chromium, webkit } from '@playwright/test';
import { existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { LEVELS, slugOf } from '../public_html/js/core/levels.js';
import { accountDiCollaudo } from './sessione-collaudo.mjs';
import { SPIA, ANALIZZA } from './spia-canvas.mjs';

const RADICE = join(dirname(new URL(import.meta.url).pathname), '..');
const BASE = process.argv[2] || 'http://127.0.0.1:8099';
/* Se il percorso indicato non esiste, si lascia scegliere a Playwright il
   browser che ha installato: così l'audit gira anche su una macchina che non
   ha esattamente questa versione di Chromium. */
const CHROME = [process.env.CHROME_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome']
  .find(p => p && existsSync(p));

const PAGINE = LEVELS.map(l => '/lezioni/' + slugOf(l.id, 'it') + '.html');

const IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

/* Il telefono girato in orizzontale non è un capriccio: è lo schermo più basso
   che esista, e Stage accorcia la tela per farcela stare nella finestra. È lì
   che una scena disegnata a distanze fisse dall'alto va a sbattere sul fondo.
   Sta su Chromium e non solo su WebKit apposta: gira anche dove Safari non è
   installato. */
const DISPOSITIVI = [
  { nome: 'android-piccolo',    motore: 'chromium', viewport: { width: 360, height: 640 }, dpr: 2, tocco: true },
  { nome: 'android-orizzontale', motore: 'chromium', viewport: { width: 740, height: 360 }, dpr: 2, tocco: true },
  { nome: 'iphone-se',          motore: 'webkit',   viewport: { width: 375, height: 667 }, dpr: 2, tocco: true, ua: IOS },
  { nome: 'iphone-13',          motore: 'webkit',   viewport: { width: 390, height: 844 }, dpr: 3, tocco: true, ua: IOS },
  { nome: 'computer',           motore: 'chromium', viewport: { width: 1366, height: 900 }, dpr: 1, tocco: false },
];


/* Un motore che non è installato non deve far fallire tutto l'audit: si
   segnala e si va avanti con gli altri, così chi ha solo Chromium vede
   comunque i difetti che Chromium trova. */
const motori = {};
for (const [nome, tipo] of [['chromium', chromium], ['webkit', webkit]]) {
  try {
    motori[nome] = await tipo.launch(nome === 'chromium' && CHROME ? { executablePath: CHROME } : {});
  } catch (e) {
    console.error(`⚠ motore ${nome} non disponibile: ${e.message.split('\n')[0]}`);
  }
}
if (!Object.keys(motori).length) { console.error('nessun browser disponibile'); process.exit(1); }
const rapporto = [];

for (const dev of DISPOSITIVI) {
  if (!motori[dev.motore]) { rapporto.push({ dispositivo: dev.nome, saltato: `motore ${dev.motore} non installato` }); continue; }
  const ctx = await motori[dev.motore].newContext({
    viewport: dev.viewport, deviceScaleFactor: dev.dpr,
    isMobile: dev.tocco, hasTouch: dev.tocco, userAgent: dev.ua, locale: 'it-IT',
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('quantum-arcade:v2', JSON.stringify({ free: true }));
    localStorage.setItem('quantum-arcade:sound', 'off');
  });
  await ctx.addInitScript(SPIA);

  /* Senza account la lezione non monta i mini-giochi: l'audit guarderebbe
     pagine vuote e non troverebbe niente. */
  const conto = await accountDiCollaudo(ctx, BASE);
  if (!conto.ok) console.error(`⚠ ${dev.nome}: account di collaudo non creato (${conto.stato}) ${conto.dettaglio}`);

  for (const url of PAGINE) {
    const pg = await ctx.newPage();
    try {
      await pg.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await pg.waitForTimeout(500);

      // numero ogni canvas, così le sovrapposizioni si confrontano dentro la stessa scena
      await pg.evaluate(() => document.querySelectorAll('canvas').forEach((c, i) => { c.__spiaId = i; }));

      /* Una scena disegna solo quando è dentro lo schermo: quindi si va canvas
         per canvas, lo si porta in vista, si svuota il registro e si forza un
         ridisegno. Così si legge un fotogramma coerente di quella scena, e non
         pezzi di istanti diversi dell'animazione. */
      const tele = pg.locator('.canvas-host canvas');
      const quante = await tele.count();
      const esito = { fuori: [], tagliati: [], sovrapposte: [], coperte: [], barrate: [], troncate: [], minuscole: [], disegni: 0 };
      for (let i = 0; i < quante; i++) {
        await tele.nth(i).scrollIntoViewIfNeeded().catch(() => {});
        await pg.evaluate(async () => {
          window.__disegni.length = 0;
          window.dispatchEvent(new Event('resize'));
          await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 140))));
        });
        const parziale = await pg.evaluate(`(${ANALIZZA.toString()})(${i})`);
        for (const k of ['fuori', 'tagliati', 'sovrapposte', 'coperte', 'barrate', 'troncate', 'minuscole']) esito[k].push(...parziale[k]);
        esito.disegni += parziale.disegni;
      }
      rapporto.push({ dispositivo: dev.nome, url, tele: quante, ...esito });
    } catch (e) {
      rapporto.push({ dispositivo: dev.nome, url, errore: e.message.slice(0, 90) });
    }
    await pg.close();
  }
  await ctx.close();
  console.error(`✓ ${dev.nome}`);
}

await Promise.all(Object.values(motori).map(b => b.close()));
writeFileSync(join(RADICE, 'tests/testi-canvas.json'), JSON.stringify(rapporto, null, 1));
console.error(`\nrapporto: tests/testi-canvas.json`);
