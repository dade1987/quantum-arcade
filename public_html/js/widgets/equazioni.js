/* ============================================================
   PARTE 0 — EQUAZIONI, FORMULE INVERSE E FUNZIONI
   Che cosa vuol dire «risolvere», e che cosa vuol dire «tornare
   indietro».

   Perché questo livello sta nel corso:

   · nel resto del corso si ricava di continuo un numero da una formula —
     «con n bit scegli fra 2ⁿ», «|α|² + |β|² = 1», «θ = 2π k/N» — e ogni
     volta si dà per scontato che chi legge sappia girare la formula. Chi
     non lo sa non si blocca sul quantistico: si blocca su un passaggio di
     seconda media, e crede di non capire la fisica;

   · e c'è una seconda idea, che vale molto di più: una funzione si può
     percorrere all'indietro solo se non ha mai fatto finire due ingressi
     diversi nello stesso posto. Quella frase è, parola per parola, la
     reversibilità del livello K·6 e l'unitarietà del livello delle
     matrici. Qui la si costruisce con le mani, su macchine di numeri
     interi, prima ancora di parlare di qubit.

   La bilancia non è una metafora scelta a caso: è la cosa da cui le
   equazioni sono nate. «Al-jabr», nel titolo del libro di al-Khwārizmī
   (circa 820), vuol dire «riportare a posto» — spostare un pezzo da un
   piatto all'altro tenendo l'equilibrio. Da lì viene la parola algebra.
   ============================================================ */

import { Stage, COL, bg, dot, text, roundRect, arrow, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud, nearSound } from './basicmath.js';

/* ------------------------------------------------------------
   LOGICA PURA
   ------------------------------------------------------------ */

/* Un'equazione di primo grado, tenuta come due piatti: ogni piatto ha
   un certo numero di scatole (le x) e un certo numero di pesi (i numeri). */
export const EQUAZIONI = [
  { id: 'a', sx: { x: 2, n: 3 }, dx: { x: 0, n: 11 } },   // 2x + 3 = 11  → x = 4
  { id: 'b', sx: { x: 4, n: -2 }, dx: { x: 0, n: 10 } },  // 4x − 2 = 10  → x = 3
  { id: 'c', sx: { x: 3, n: 0 }, dx: { x: 1, n: 8 } },    // 3x = x + 8   → x = 4
  { id: 'd', sx: { x: 2, n: 5 }, dx: { x: 0, n: 9 } },    // 2x + 5 = 9   → x = 2
];

/** La soluzione di sx.x·x + sx.n = dx.x·x + dx.n. Null se non ce n'è una sola. */
export function soluzione(eq) {
  const a = eq.sx.x - eq.dx.x, b = eq.dx.n - eq.sx.n;
  return Math.abs(a) < 1e-12 ? null : b / a;
}

/**
 * Le mosse legali: tutte quelle che si fanno SU TUTTI E DUE I PIATTI.
 * È l'unica regola dell'algebra, e il gioco non ne concede altre.
 */
export const MOSSE = {
  meno1: eq => ({ sx: { x: eq.sx.x, n: eq.sx.n - 1 }, dx: { x: eq.dx.x, n: eq.dx.n - 1 } }),
  piu1: eq => ({ sx: { x: eq.sx.x, n: eq.sx.n + 1 }, dx: { x: eq.dx.x, n: eq.dx.n + 1 } }),
  menoX: eq => ({ sx: { x: eq.sx.x - 1, n: eq.sx.n }, dx: { x: eq.dx.x - 1, n: eq.dx.n } }),
  mezzo: eq => ({ sx: { x: eq.sx.x / 2, n: eq.sx.n / 2 }, dx: { x: eq.dx.x / 2, n: eq.dx.n / 2 } }),
  doppio: eq => ({ sx: { x: eq.sx.x * 2, n: eq.sx.n * 2 }, dx: { x: eq.dx.x * 2, n: eq.dx.n * 2 } }),
};

/** Risolta: a sinistra una sola scatola e niente pesi, a destra solo un numero. */
export const risolta = eq =>
  Math.abs(eq.sx.x - 1) < 1e-9 && Math.abs(eq.sx.n) < 1e-9 && Math.abs(eq.dx.x) < 1e-9;

/* ------------------------------------------------------------
   Le macchine del secondo gioco.

   `indietro` c'è solo per quelle che si possono percorrere all'indietro.
   `scontro` dà due ingressi DIVERSI che finiscono nello stesso posto: è la
   prova, in due numeri, che tornare indietro è impossibile — non difficile,
   impossibile, perché l'informazione su quale dei due fosse non esiste più.
   ------------------------------------------------------------ */
export const MACCHINE_F = [
  { id: 'doppio', nome: () => t('raddoppia'), regola: () => '×2',
    f: x => 2 * x, indietro: y => y / 2, scontro: null },
  { id: 'piu3', nome: () => t('aggiungi 3'), regola: () => '+3',
    f: x => x + 3, indietro: y => y - 3, scontro: null },
  { id: 'segno', nome: () => t('cambia segno'), regola: () => '×(−1)',
    f: x => -x, indietro: y => -y, scontro: null },
  { id: 'quadrato', nome: () => t('eleva al quadrato'), regola: () => 'x²',
    f: x => x * x, indietro: null, scontro: [3, -3] },
  { id: 'zero', nome: () => t('moltiplica per zero'), regola: () => '×0',
    f: () => 0, indietro: null, scontro: [2, 7] },
  { id: 'resto', nome: () => t('resto della divisione per 4'), regola: () => 'mod 4',
    f: x => ((x % 4) + 4) % 4, indietro: null, scontro: [1, 5] },
];

/** Si può tornare indietro? Vero quando nessun ingresso si scontra con un altro. */
export const reversibile = m => m.indietro !== null;

/* ------------------------------------------------------------
   1) LA BILANCIA
   Due piatti in equilibrio. Ogni mossa si fa su tutti e due, e
   l'equilibrio non si rompe mai: è tutta l'algebra, in un gesto.
   ------------------------------------------------------------ */
export function bilanciaLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('La bilancia'),
    subtitle: t('togli e dividi da tutte e due le parti: la bilancia resta in equilibrio'),
  });

  const st = { i: 0, eq: null, mosse: [], risolte: new Set(), vinto: false };
  const nuova = () => { st.eq = JSON.parse(JSON.stringify(EQUAZIONI[st.i])); st.mosse = []; };
  nuova();

  /* Come si scrive un piatto: «2x + 3», «4x − 2», «11». Il meno va scritto
     come meno, non come «+ −»: è il genere di dettaglio che fa sembrare
     difficile una cosa che non lo è. */
  const numero = v => (v % 1 ? v.toFixed(1) : String(v));
  const scrivi = lato => {
    const parteX = lato.x === 1 ? 'x' : lato.x === -1 ? '−x' : numero(lato.x) + 'x';
    if (!lato.x) return numero(lato.n);
    if (!lato.n) return parteX;
    return parteX + (lato.n > 0 ? ' + ' + numero(lato.n) : ' − ' + numero(-lato.n));
  };

  const stage = new Stage(w.body, {
    height: 300,
    draw(ctx, s) {
      bg(ctx, s);
      const fatta = risolta(st.eq);
      const top = hud(ctx, s, {
        goal: t('lascia una sola scatola, da sola'),
        closeness: fatta ? 1 : 1 - Math.min(1, (Math.abs(st.eq.sx.n) + Math.abs(st.eq.dx.x) + Math.abs(st.eq.sx.x - 1)) / 8),
        hit: fatta,
        sub: t('equazioni risolte: :fatte su :totali', { fatte: st.risolte.size, totali: cfg.need }),
      });

      /* La barra della bilancia sta SEMPRE orizzontale: è il punto della
         lezione. Se si inclinasse, il gioco starebbe insegnando il contrario
         di quello che dice il testo. */
      const cx = s.w / 2, cy = top + 40;
      const braccio = Math.min(s.w * 0.36, 210);
      ctx.strokeStyle = '#3a4c73'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx - braccio, cy); ctx.lineTo(cx + braccio, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + 96); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - 26, cy + 96); ctx.lineTo(cx + 26, cy + 96); ctx.stroke();
      text(ctx, '=', cx, cy - 18, { size: 20, align: 'center', color: COL.amber, weight: '800' });

      const piatto = (px, lato, colore) => {
        // il filo che regge il piatto: senza, i piatti sembrano galleggiare
        ctx.strokeStyle = '#3a4c73'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, cy + 34); ctx.stroke();
        roundRect(ctx, px - 74, cy + 34, 148, 8, 4, { fill: '#16233c', stroke: '#3a4c73' });

        /* Le scatole (le x) e i pesi (i numeri), CENTRATI sul piatto: con una
           scatola sola, appoggiarla a sinistra faceva sembrare che la bilancia
           pendesse — cioè l'esatto contrario di quello che il livello dice. */
        const scatole = Math.min(Math.round(Math.abs(lato.x)), 5);
        const largheS = scatole * 27;
        for (let i = 0; i < scatole; i++) {
          const bx = px - largheS / 2 + i * 27;
          roundRect(ctx, bx, cy - 4, 24, 30, 4,
            { fill: 'rgba(34,211,238,.22)', stroke: colore, width: 1.6 });
          text(ctx, 'x', bx + 12, cy + 11, { size: 13, align: 'center', color: colore });
        }
        const pesi = Math.min(Math.round(Math.abs(lato.n)), 12);
        const perRiga = Math.min(pesi, 6), largheP = perRiga * 24;
        for (let i = 0; i < pesi; i++) {
          const rx = px - largheP / 2 + (i % 6) * 24, ry = cy + 46 + Math.floor(i / 6) * 18;
          roundRect(ctx, rx, ry, 20, 14, 3,
            { fill: lato.n < 0 ? 'rgba(251,113,133,.2)' : 'rgba(251,191,36,.2)', stroke: lato.n < 0 ? COL.red : COL.amber });
        }
        if (Math.abs(lato.n) > 12) text(ctx, '…', px + largheP / 2 + 8, cy + 53, { size: 12, color: COL.amber });
        text(ctx, scrivi(lato), px, cy + 92, { size: 15, align: 'center', color: COL.txtBright, max: 150 });
      };
      piatto(cx - braccio * 0.72, st.eq.sx, COL.cyan);
      piatto(cx + braccio * 0.72, st.eq.dx, COL.violet);

      text(ctx, st.mosse.length ? t('mosse: :mosse', { mosse: st.mosse.join(' → ') }) : t('nessuna mossa ancora'),
        14, s.h - 10, { size: 11, color: '#7f8fb3', max: s.w - 28 });
      st.px = cx; st.py = cy;
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const muovi = (nome, etichetta) => { st.eq = MOSSE[nome](st.eq); st.mosse.push(etichetta); sfx.click(); upd(); };
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '−1', onclick: () => muovi('meno1', '−1') },
    { label: '+1', onclick: () => muovi('piu1', '+1') },
    { label: '− x', onclick: () => muovi('menoX', '−x') },
    { label: '÷2', class: 'sm primary', onclick: () => muovi('mezzo', '÷2') },
    { label: '×2', onclick: () => muovi('doppio', '×2') },
    { label: '↺ ' + t('ricomincia'), onclick: () => { nuova(); upd(); } },
    { label: '🎲 ' + t('altra equazione'), onclick: () => { st.i = (st.i + 1) % EQUAZIONI.length; nuova(); upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const fatta = risolta(st.eq);
    const vera = soluzione(EQUAZIONI[st.i]);
    if (fatta && !st.risolte.has(EQUAZIONI[st.i].id)) {
      st.risolte.add(EQUAZIONI[st.i].id);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.risolte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    out.set(
      t('Adesso la bilancia dice: <b>:sinistra = :destra</b>.', { sinistra: scrivi(st.eq.sx), destra: scrivi(st.eq.dx) }) + '\n' +
      (fatta
        ? '<span class="g">✓ ' + t('Risolta: <b>x = :valore</b>. Nota che la x valeva :valore fin dall\'inizio — le mosse non l\'hanno cambiata, l\'hanno solo <b>messa in mostra</b>.', { valore: st.eq.dx.n }) + '</span>'
        : t('La x vale <b>:vera</b> anche adesso: qualunque mossa fatta su tutti e due i piatti lascia la risposta dov\'era. Continua finché a sinistra non resta una scatola sola.', { vera })));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>La regola, tutta:</b> quello che fai a un piatto lo devi fare anche all\'altro. Se lo fai, l\'equilibrio regge e la risposta non cambia; se non lo fai, hai scritto una cosa falsa. La parola <b>algebra</b> viene proprio da qui: nel titolo del libro di al-Khwārizmī, intorno all\'820, «al-jabr» vuol dire «rimettere a posto».'));
  return { state: st };
}

/* ------------------------------------------------------------
   2) LA MACCHINA E IL RITORNO
   Una funzione è una macchina: un numero entra, uno esce. La
   domanda che conta è un'altra: si può risalire a quello entrato?
   ------------------------------------------------------------ */
export function macchinaLab(host, opts = {}) {
  const cfg = Object.assign({ need: 4, onWin: null }, opts);
  const w = widget(host, {
    title: t('La macchina dei numeri'),
    subtitle: t('un numero entra, uno esce: si può risalire a quello entrato?'),
  });

  const st = { m: 0, x: 3, risposte: {}, giuste: new Set(), vinto: false, esito: '' };
  const near = nearSound();

  const stage = new Stage(w.body, {
    height: 300,
    draw(ctx, s) {
      bg(ctx, s);
      const mac = MACCHINE_F[st.m];
      const y = mac.f(st.x);
      const top = hud(ctx, s, {
        goal: t('si può tornare indietro?'),
        closeness: st.giuste.size / cfg.need,
        hit: st.giuste.has(mac.id),
        sub: t('macchine classificate: :fatte su :totali', { fatte: st.giuste.size, totali: cfg.need }),
      });

      /* Ingresso → scatola → uscita, con le misure ricavate dalla larghezza
         vera: a offset fissi, su un telefono stretto «entra» ed «esce»
         finivano fuori dalla tela. */
      const cy = top + 66;
      const larghScatola = Math.min(104, s.w * 0.3);
      const bx = s.w / 2 - larghScatola / 2;
      const colonna = (s.w - larghScatola) / 2;
      const xIn = bx - colonna / 2, xOut = bx + larghScatola + colonna / 2;
      const maxEt = colonna - 14;
      text(ctx, t('entra'), xIn, cy - 26, { size: 11, align: 'center', color: '#7f8fb3', max: maxEt });
      text(ctx, String(st.x), xIn, cy, { size: 22, align: 'center', color: COL.cyan, weight: '800', max: maxEt });
      arrow(ctx, xIn + 18, cy, bx - 8, cy, { color: COL.cyan, width: 2.4 });
      roundRect(ctx, bx, cy - 26, larghScatola, 52, 8, { fill: '#16233c', stroke: COL.violet, width: 2 });
      text(ctx, mac.regola(), bx + larghScatola / 2, cy, { size: 18, align: 'center', color: COL.violet, max: larghScatola - 8 });
      arrow(ctx, bx + larghScatola + 8, cy, xOut - 18, cy, { color: COL.green, width: 2.4 });
      text(ctx, t('esce'), xOut, cy - 26, { size: 11, align: 'center', color: '#7f8fb3', max: maxEt });
      text(ctx, String(y), xOut, cy, { size: 22, align: 'center', color: COL.green, weight: '800', max: maxEt });

      /* Lo scontro: due ingressi diversi disegnati mentre finiscono nello
         stesso posto. È la dimostrazione, non un'opinione. */
      if (mac.scontro) {
        const [a, b] = mac.scontro;
        const yy = cy + 74;
        text(ctx, t('e attenzione:'), 20, yy - 20, { size: 11, color: COL.amber, max: s.w - 40 });
        text(ctx, `${a}`, xIn, yy, { size: 15, align: 'center', color: COL.amber, max: maxEt });
        text(ctx, `${b}`, xIn, yy + 24, { size: 15, align: 'center', color: COL.amber, max: maxEt });
        arrow(ctx, xIn + 16, yy, xOut - 22, yy + 12, { color: COL.amber, width: 1.6, alpha: 0.85 });
        arrow(ctx, xIn + 16, yy + 24, xOut - 22, yy + 12, { color: COL.amber, width: 1.6, alpha: 0.85 });
        text(ctx, `${mac.f(a)}`, xOut, yy + 12, { size: 15, align: 'center', color: COL.amber, max: maxEt });
        text(ctx, t('due numeri diversi, stessa uscita'), s.w / 2, s.h - 12,
          { size: 11.5, align: 'center', color: COL.amber, max: s.w - 28 });
      } else {
        arrow(ctx, xOut - 18, cy + 42, xIn + 18, cy + 42, { color: COL.green, width: 1.8, dash: [5, 4] });
        text(ctx, t('si torna indietro, e si ritrova esattamente il numero di partenza'),
          s.w / 2, s.h - 12, { size: 11.5, align: 'center', color: COL.green, max: s.w - 28 });
      }
      fx.draw(ctx);
      st.px = xOut; st.py = cy;
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sm = choice({
    label: t('La macchina'),
    items: MACCHINE_F.map((m, i) => ({ label: m.nome(), value: i })),
    value: 0,
    onchange: i => { st.m = i; st.esito = ''; upd(); },
  });
  const sx = slider({
    label: t('Il numero che entra'), min: -6, max: 6, step: 1, value: st.x,
    fmt: v => String(v), oninput: v => { st.x = v; upd(); },
  });
  w.body.appendChild(controls(sm.root, sx.root));
  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '8px' } },
    h('button', { class: 'btn sm primary', onclick: () => rispondi(true) }, '↩ ' + t('sì, si torna indietro')),
    h('button', { class: 'btn sm', onclick: () => rispondi(false) }, '⛔ ' + t('no, è persa')),
  ));
  const out = readout('');
  w.body.appendChild(out.root);

  function rispondi(scelta) {
    const mac = MACCHINE_F[st.m];
    if (scelta === reversibile(mac)) {
      st.giuste.add(mac.id);
      st.esito = '<span class="g">✓ ' + (reversibile(mac)
        ? t('Giusto: nessun ingresso finisce dove ne finisce un altro, quindi dall\'uscita si risale sempre.')
        : t('Giusto: ci sono ingressi diversi con la stessa uscita, quindi dall\'uscita non si può sapere da dove si veniva. L\'informazione è persa.')) + '</span>';
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.giuste.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else {
      st.esito = '<span class="a">✗ ' + t('No. Guarda se esistono due numeri diversi che escono uguali: se esistono, indietro non si torna.') + '</span>';
      sfx.err();
    }
    upd();
  }

  function upd() {
    const mac = MACCHINE_F[st.m];
    const y = mac.f(st.x);
    near(st.giuste.size / cfg.need);
    out.set(
      t('Macchina <b>:nome</b>: entra <b>:x</b>, esce <b>:y</b>.', { nome: mac.nome(), x: st.x, y }) + '\n' +
      (reversibile(mac)
        ? t('Prova a tornare indietro: da :y si risale a <b>:x</b>. Funziona per <b>ogni</b> numero, non solo per questo.', { y, x: mac.indietro(y) })
        : t('Da :y non si può risalire: per esempio :a e :b escono <b>tutti e due</b> come :uguale.', { y, a: mac.scontro[0], b: mac.scontro[1], uguale: mac.f(mac.scontro[0]) })) +
      (st.esito ? '\n' + st.esito : ''));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Il ponte con il quantistico:</b> una macchina si può percorrere all\'indietro solo se non fa mai finire due numeri diversi nello stesso posto. Quando succede, l\'informazione non è «difficile da recuperare»: <b>non c\'è più</b>. È esattamente la reversibilità del livello :k, ed è il motivo per cui ogni porta quantistica dev\'essere invertibile — nel livello :m lo vedrai scritto come «unitaria».', { k: nOf('k6-reversibile'), m: nOf('00-matrici') }));
  return { state: st };
}
