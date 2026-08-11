/* ============================================================
   WIDGET: QUANTO COSTA? (DFT vs FFT vs QFT)
   + l'idea "dividi e conquista" disegnata come albero.
   ============================================================ */

import { Stage, COL, bg, text, roundRect, dot, arrow, attachFX } from '../core/canvas.js';
import { widget, slider, controls, readout, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { costs } from '../core/dsp.js';

export function costLab(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, { title: 'Quanto costa?', subtitle: 'sposta il cursore: quante operazioni servono' });
  const st = { n: 4, won: false };

  const stage = new Stage(w.body, {
    height: 275,
    draw(ctx, s) {
      bg(ctx, s);
      const N = 1 << st.n;
      const c = costs(N);
      const items = [
        { lab: 'DFT diretta (la formula)', val: c.dftMul, col: COL.red, note: 'N × N' },
        { lab: 'FFT (algoritmo classico veloce)', val: c.fftMul, col: COL.amber, note: '(N/2)·log₂N' },
        { lab: 'QFT (porte del circuito quantistico)', val: c.qftGates, col: COL.green, note: 'n(n+1)/2 + swap' },
      ];
      const maxLog = Math.log10(Math.max(...items.map(i => i.val)) + 10);
      text(ctx, `N = 2^${st.n} = ${N.toLocaleString('it-IT')} numeri  (cioè ${st.n} qubit)`, 12, 18, { size: 13, color: COL.txt, max: s.w - 24 });
      items.forEach((it, i) => {
        const y = 46 + i * (s.w < 430 ? 70 : 62);
        const bw = (Math.log10(it.val + 10) / maxLog) * (s.w - 220);
        roundRect(ctx, 12, y, s.w - 24, 50, 8, { fill: '#0d1526', stroke: '#1a2440' });
        roundRect(ctx, 20, y + 22, Math.max(3, bw), 18, 5, { fill: it.col, alpha: .85 });
        /* Il nome dell'algoritmo e la sua formula stavano sulla stessa riga,
           uno a sinistra e una a destra, senza sapere l'uno dell'altra: su
           schermo stretto si incontravano in mezzo. Ora la formula si prende
           lo spazio che le serve e il nome usa quello che resta; sotto una
           certa larghezza la formula va sulla riga di sotto. */
        const largaNota = ctx.measureText(it.note).width + 30;
        const stretta = s.w < 430;
        if (stretta) {
          text(ctx, it.lab, 20, y + 12, { size: 11.5, color: COL.txt, max: s.w - 46 });
          text(ctx, it.note, 20, y + 46, { size: 10.5, color: '#5b6b90', max: s.w - 46 });
        } else {
          text(ctx, it.lab, 20, y + 12, { size: 11.5, color: COL.txt, max: s.w - 40 - largaNota });
          text(ctx, it.note, s.w - 30, y + 12, { size: 10.5, align: 'right', color: '#5b6b90' });
        }
        text(ctx, it.val.toLocaleString('it-IT'), 28 + Math.max(3, bw), y + 32, { size: 12, color: it.col });
      });
    },
  });
  const fx = attachFX(stage);   // scintille, lampi e suono ai traguardi
  stage.pause();

  const out = readout('');
  const s = slider({
    label: 'Numero di qubit <b>n</b>  (N = 2^n campioni/ampiezze)', min: 1, max: 20, step: 1, value: st.n,
    fmt: v => `n=${v} → N=${(1 << v).toLocaleString('it-IT')}`,
    oninput: v => { st.n = v; upd(); },
  });
  w.body.appendChild(controls(s.root));
  w.body.appendChild(out.root);

  function upd() {
    const N = 1 << st.n, c = costs(N);
    out.set(
      `Con <b>${N.toLocaleString('it-IT')}</b> valori:\n` +
      `  DFT diretta : <span class="p">${c.dftMul.toLocaleString('it-IT')}</span> moltiplicazioni\n` +
      `  FFT         : <span class="a">${Math.round(c.fftMul).toLocaleString('it-IT')}</span> "farfalle"  → ${Math.round(c.ratio).toLocaleString('it-IT')}× più veloce della DFT\n` +
      `  QFT         : <span class="g">${c.qftGates}</span> porte quantistiche\n\n` +
      `<b>ATTENZIONE al trucco:</b> la FFT ti restituisce <b>tutti</b> i ${N.toLocaleString('it-IT')} numeri, e li puoi leggere.\n` +
      `La QFT trasforma ${N.toLocaleString('it-IT')} ampiezze con ${c.qftGates} porte, ma quando misuri ottieni <b>un solo</b> risultato.\n` +
      `Serve quindi a far <b>interferire</b> le ampiezze, non a stampare la lista.`);
    stage.redraw();
    if (st.n >= 16 && !st.won) { st.won = true; fx.win(); sfx.ok(); cfg.onWin && cfg.onWin(); }
  }
  upd();
  return { stage };
}

/* ------------------------------------------------------------
   Dividi e conquista: perché la FFT è veloce
   ------------------------------------------------------------ */

export function butterflyLab(host) {
  const w = widget(host, { title: 'Dividi e conquista', subtitle: 'come la FFT taglia il lavoro a metà, ogni volta' });
  const st = { level: 0 };
  const N = 8;

  const stage = new Stage(w.body, {
    height: 285,
    draw(ctx, s) {
      bg(ctx, s);
      const levels = [[[0, 1, 2, 3, 4, 5, 6, 7]]];
      for (let l = 0; l < 3; l++) {
        const next = [];
        for (const g of levels[l]) {
          next.push(g.filter((_, i) => i % 2 === 0));
          next.push(g.filter((_, i) => i % 2 === 1));
        }
        levels.push(next);
      }
      const show = Math.min(st.level, 3);
      const rowH = (s.h - 40) / 4;
      for (let l = 0; l <= show; l++) {
        const groups = levels[l];
        const y = 26 + l * rowH;
        let x = 14;
        const totalCells = N + groups.length * 0.6;
        const cw = (s.w - 28) / totalCells;
        groups.forEach((g, gi) => {
          const gw = g.length * cw;
          roundRect(ctx, x, y, gw, rowH - 16, 6, { stroke: gi % 2 ? 'rgba(251,191,36,.5)' : 'rgba(34,211,238,.5)', fill: gi % 2 ? 'rgba(251,191,36,.07)' : 'rgba(34,211,238,.07)' });
          g.forEach((v, i) => text(ctx, String(v), x + cw * (i + .5), y + (rowH - 16) / 2, { size: 11, align: 'center', color: gi % 2 ? COL.amber : COL.cyan }));
          x += gw + cw * 0.6;
        });
        const label = l === 0 ? '1 problema da 8' : `${groups.length} problemi da ${8 / groups.length}`;
        text(ctx, label, s.w - 14, y + 4, { size: 10.5, align: 'right', color: '#5b6b90' });
      }
      text(ctx, 'ogni riga: indici pari a sinistra, dispari a destra', 14, 14, { size: 11, color: COL.txt });
    },
  });
  const fx = attachFX(stage);   // scintille, lampi e suono ai traguardi
  stage.pause();

  const s = slider({ label: 'Quante volte dividiamo', min: 0, max: 3, step: 1, value: 0, fmt: v => v + ' divisioni', oninput: v => { st.level = v; stage.redraw(); } });
  w.body.appendChild(controls(s.root));
  w.setFoot('Una DFT su 8 punti costa 8×8 = 64 moltiplicazioni. Ma una DFT su 8 punti si può scrivere usando <b>due</b> DFT su 4 punti (pari e dispari) più 8 combinazioni finali. Ripetendo il trucco fino in fondo: <b>log₂8 = 3 livelli</b> × 8 = 24 operazioni invece di 64. Più N cresce, più il risparmio esplode.');
  return { stage };
}
