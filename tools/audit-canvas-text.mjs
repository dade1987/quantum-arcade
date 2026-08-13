/* ============================================================================
   AUDIT DEI TESTI DISEGNATI DENTRO I CANVAS

   Il collaudo grafico esistente misura gli elementi HTML. Ma nei mini-giochi
   quasi tutte le scritte sono disegnate dentro il canvas con fillText: per il
   DOM non esistono, quindi nessuna misura su getBoundingClientRect può
   accorgersi che una scritta esce dal bordo o che due si sovrappongono.

   Qui si intercetta fillText/strokeText, si registra dove finisce ogni scritta
   e poi si controlla:

     · testo che sborda dal canvas (tagliato a destra o a sinistra);
     · testo che si sovrappone a un'altra scritta;
     · testo troppo piccolo per essere letto su un telefono.

   Per avere un fotogramma coerente, e non scritte di istanti diversi
   dell'animazione, prima di leggere si svuota il registro e si forza un
   ridisegno di tutte le scene (un evento resize le marca "sporche").

   Uso:  node tools/audit-canvas-text.mjs [base-url]
   ============================================================================ */
import { chromium, webkit } from '@playwright/test';
import { readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const RADICE = join(dirname(new URL(import.meta.url).pathname), '..');
const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const PAGINE = LEVELS.map(l => '/lezioni/' + slugOf(l.id, 'it') + '.html');

const IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

const DISPOSITIVI = [
  { nome: 'android-piccolo', motore: 'chromium', viewport: { width: 360, height: 640 }, dpr: 2, tocco: true },
  { nome: 'iphone-se',       motore: 'webkit',   viewport: { width: 375, height: 667 }, dpr: 2, tocco: true, ua: IOS },
  { nome: 'iphone-13',       motore: 'webkit',   viewport: { width: 390, height: 844 }, dpr: 3, tocco: true, ua: IOS },
  { nome: 'computer',        motore: 'chromium', viewport: { width: 1366, height: 900 }, dpr: 1, tocco: false },
];

/** Spia sul disegno: registra scritte, rettangoli pieni e linee tracciate,
    nell'ordine in cui vengono disegnati (l'ordine conta: ciò che viene dopo
    copre ciò che viene prima). */
const SPIA = () => {
  window.__disegni = [];
  const P = CanvasRenderingContext2D.prototype;

  /* Il motore pulisce la tela all'inizio di ogni fotogramma: la uso come
     confine. Senza, si confrontano scritte di istanti diversi e lo sfondo del
     fotogramma dopo sembra "coprire" il testo di quello prima. */
  const clearRect = P.clearRect;
  P.clearRect = function () {
    try { this.canvas.__frame = (this.canvas.__frame || 0) + 1; } catch { }
    return clearRect.apply(this, arguments);
  };
  const tela = c => ({
    id: c.canvas.__spiaId,
    frame: c.canvas.__frame || 0,
    tela: c.canvas.width / (c.getTransform().a || 1),
    telaAltezza: c.canvas.height / (c.getTransform().d || 1),
  });

  for (const metodo of ['fillText', 'strokeText']) {
    const originale = P[metodo];
    P[metodo] = function (testo, x, y) {
      try {
        window.__disegni.push({
          tipo: 'testo', testo: String(testo), x, y,
          larghezza: this.measureText(testo).width,
          corpo: parseFloat(/(\d+(\.\d+)?)px/.exec(this.font)?.[1]) || 12,
          allinea: this.textAlign, base: this.textBaseline, ...tela(this),
        });
      } catch { /* una scritta non registrata non deve rompere il gioco */ }
      return originale.apply(this, arguments);
    };
  }

  const fillRect = P.fillRect;
  P.fillRect = function (x, y, w, h) {
    try {
      const s = String(this.fillStyle);
      // i riempimenti trasparenti non coprono niente
      const trasparente = /rgba\([^)]*,\s*0?\.\d\)/.test(s) && parseFloat(s.split(',').pop()) < 0.5;
      if (!trasparente && this.globalAlpha > 0.5) {
        window.__disegni.push({ tipo: 'rett', x, y, w, h, colore: s.slice(0, 24), ...tela(this) });
      }
    } catch { }
    return fillRect.apply(this, arguments);
  };

  // le linee: raccolgo i punti del percorso e li registro quando viene tracciato
  const beginPath = P.beginPath, moveTo = P.moveTo, lineTo = P.lineTo, stroke = P.stroke, arcTo = P.arcTo, fill = P.fill;
  P.beginPath = function () { this.__punti = []; return beginPath.apply(this, arguments); };
  P.moveTo = function (x, y) { (this.__punti = this.__punti || []).push([x, y]); return moveTo.apply(this, arguments); };
  P.lineTo = function (x, y) { (this.__punti = this.__punti || []).push([x, y]); return lineTo.apply(this, arguments); };
  P.arcTo = function (x1, y1, x2, y2) {
    (this.__punti = this.__punti || []).push([x1, y1], [x2, y2]);
    return arcTo.apply(this, arguments);
  };
  /* Un riempimento di percorso — per esempio il fondino dietro una scritta,
     che roundRect disegna con arcTo — copre ciò che sta sotto esattamente come
     un fillRect. Senza registrarlo, una linea nascosta dal fondino sembrerebbe
     ancora barrare la scritta. */
  P.fill = function () {
    try {
      const p = this.__punti || [];
      const st = String(this.fillStyle);
      const trasp = /rgba\([^)]*,\s*0?\.\d+\)/.test(st) && parseFloat(st.split(',').pop()) < 0.5;
      if (p.length >= 2 && this.globalAlpha > 0.5 && !trasp) {
        const xs = p.map(q => q[0]), ys = p.map(q => q[1]);
        const x = Math.min(...xs), y = Math.min(...ys);
        window.__disegni.push({ tipo: 'rett', x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y, colore: String(this.fillStyle).slice(0, 24), ...tela(this) });
      }
    } catch { }
    return fill.apply(this, arguments);
  };

  P.stroke = function () {
    try {
      const p = this.__punti || [];
      if (p.length >= 2 && this.globalAlpha > 0.5) {
        for (let i = 1; i < p.length && i < 40; i++) {
          window.__disegni.push({
            tipo: 'linea', x1: p[i - 1][0], y1: p[i - 1][1], x2: p[i][0], y2: p[i][1],
            spessore: this.lineWidth, tratteggio: (this.getLineDash() || []).length > 0, ...tela(this),
          });
        }
      }
    } catch { }
    return stroke.apply(this, arguments);
  };
};

/** Dai disegni registrati ai difetti. */
const ANALIZZA = (soloTela) => {
  let dis = window.__disegni.filter(d => soloTela === undefined || d.id === soloTela);
  // un fotogramma solo: l'ultimo completo (l'ultimissimo può essere a metà)
  const frames = [...new Set(dis.map(d => d.frame))].sort((a, b) => a - b);
  if (frames.length) {
    const scelto = frames.length > 1 ? frames[frames.length - 2] : frames[0];
    dis = dis.filter(d => d.frame === scelto);
  }
  const scatola = s => {
    let sinistra = s.x;
    if (s.allinea === 'center') sinistra = s.x - s.larghezza / 2;
    else if (s.allinea === 'right' || s.allinea === 'end') sinistra = s.x - s.larghezza;
    let alto = s.y - s.corpo * 0.8, basso = s.y + s.corpo * 0.25;
    if (s.base === 'middle') { alto = s.y - s.corpo * 0.55; basso = s.y + s.corpo * 0.55; }
    else if (s.base === 'top') { alto = s.y; basso = s.y + s.corpo * 1.1; }
    return { ...s, sinistra, destra: sinistra + s.larghezza, alto, basso };
  };
  const testi = dis.map((d, i) => ({ ...d, ordine: i })).filter(d => d.tipo === 'testo' && String(d.testo).trim()).map(scatola);

  const fuori = [];
  for (const s of testi) {
    if (s.destra > s.tela + 1.5) fuori.push({ testo: s.testo, oltre: Math.round(s.destra - s.tela), lato: 'destra', tela: Math.round(s.tela) });
    else if (s.sinistra < -1.5) fuori.push({ testo: s.testo, oltre: Math.round(-s.sinistra), lato: 'sinistra', tela: Math.round(s.tela) });
  }

  const sovrapposte = [];
  for (let i = 0; i < testi.length && sovrapposte.length <= 8; i++) {
    for (let j = i + 1; j < testi.length; j++) {
      const a = testi[i], c = testi[j];
      const ox = Math.min(a.destra, c.destra) - Math.max(a.sinistra, c.sinistra);
      const oy = Math.min(a.basso, c.basso) - Math.max(a.alto, c.alto);
      if (ox > 3 && oy > 3) { sovrapposte.push({ a: a.testo, b: c.testo, px: Math.round(ox) }); break; }
    }
  }

  // una barra piena disegnata DOPO una scritta la copre
  const coperte = [];
  for (const r of dis.map((d, i) => ({ ...d, ordine: i })).filter(d => d.tipo === 'rett')) {
    const rx = Math.min(r.x, r.x + r.w), rX = Math.max(r.x, r.x + r.w);
    const ry = Math.min(r.y, r.y + r.h), rY = Math.max(r.y, r.y + r.h);
    if ((rX - rx) < 6 || (rY - ry) < 6) continue;
    for (const t of testi) {
      if (t.ordine > r.ordine) continue;                 // la scritta è sopra: nessun problema
      const ox = Math.min(t.destra, rX) - Math.max(t.sinistra, rx);
      const oy = Math.min(t.basso, rY) - Math.max(t.alto, ry);
      if (ox > 8 && oy > t.corpo * 0.5) {
        coperte.push({ testo: t.testo.slice(0, 34), da: 'barra ' + (r.colore || ''), px: Math.round(ox) });
        break;
      }
    }
    if (coperte.length > 6) break;
  }

  // una linea (spesso un tratteggio) che passa in mezzo a una scritta
  const barrate = [];
  const fondini = dis.map((d, i) => ({ ...d, ordine: i })).filter(d => d.tipo === 'rett');
  const protetta = (t, l) => fondini.some(f => {
    if (f.ordine < l.ordine || f.ordine > t.ordine) return false;
    const fx = Math.min(f.x, f.x + f.w), fX = Math.max(f.x, f.x + f.w);
    const fy = Math.min(f.y, f.y + f.h), fY = Math.max(f.y, f.y + f.h);
    return fx <= t.sinistra + 2 && fX >= t.destra - 2 && fy <= t.alto + 2 && fY >= t.basso - 2;
  });
  /* Quanta parte della scritta attraversa davvero il segmento.
     Prendere il rettangolo di ingombro del segmento sarebbe sbagliato: una
     diagonale che passa lontano dalla scritta ha comunque un ingombro che la
     contiene, e verrebbe segnalata a torto. Si campiona il segmento e si
     guarda quanto di esso cade dentro la scatola del testo. */
  const attraversa = (t, l) => {
    const passi = 48;
    let dentro = 0, primo = null, ultimo = null;
    for (let i = 0; i <= passi; i++) {
      const x = l.x1 + (l.x2 - l.x1) * (i / passi);
      const y = l.y1 + (l.y2 - l.y1) * (i / passi);
      if (x >= t.sinistra && x <= t.destra && y >= t.alto - l.spessore && y <= t.basso + l.spessore) {
        dentro++;
        if (primo === null) primo = x;
        ultimo = x;
      }
    }
    return dentro ? Math.abs(ultimo - primo) : 0;
  };

  for (const l of dis.map((d, i) => ({ ...d, ordine: i })).filter(d => d.tipo === 'linea')) {
    for (const t of testi) {
      if (t.ordine > l.ordine) continue;
      const ox = attraversa(t, l);
      // deve attraversare la scritta, non sfiorarla: almeno metà larghezza
      if (ox > Math.max(12, t.larghezza * 0.5) && !protetta(t, l)) {
        barrate.push({ testo: t.testo.slice(0, 34), tratteggio: !!l.tratteggio, px: Math.round(ox) });
        break;
      }
    }
    if (barrate.length > 6) break;
  }

  const minuscole = [...new Set(testi.filter(s => s.corpo < 10).map(s => `${s.testo.slice(0, 16)} (${s.corpo}px)`))];
  return { fuori, sovrapposte, coperte, barrate, minuscole, disegni: dis.length };
};

const motori = { chromium: await chromium.launch({ executablePath: CHROME }), webkit: await webkit.launch() };
const rapporto = [];

for (const dev of DISPOSITIVI) {
  const ctx = await motori[dev.motore].newContext({
    viewport: dev.viewport, deviceScaleFactor: dev.dpr,
    isMobile: dev.tocco, hasTouch: dev.tocco, userAgent: dev.ua, locale: 'it-IT',
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('quantum-arcade:v2', JSON.stringify({ free: true }));
    localStorage.setItem('quantum-arcade:sound', 'off');
  });
  await ctx.addInitScript(SPIA);

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
      const esito = { fuori: [], sovrapposte: [], coperte: [], barrate: [], minuscole: [], disegni: 0 };
      for (let i = 0; i < quante; i++) {
        await tele.nth(i).scrollIntoViewIfNeeded().catch(() => {});
        await pg.evaluate(async () => {
          window.__disegni.length = 0;
          window.dispatchEvent(new Event('resize'));
          await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 140))));
        });
        const parziale = await pg.evaluate(`(${ANALIZZA.toString()})(${i})`);
        for (const k of ['fuori', 'sovrapposte', 'coperte', 'barrate', 'minuscole']) esito[k].push(...parziale[k]);
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
