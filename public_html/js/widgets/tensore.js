/* ============================================================
   PARTE M — IL PRODOTTO TENSORIALE E L'ENTANGLEMENT

   Al livello M·4 si è visto CHE n qubit vivono in dimensione 2^n. Qui
   si vede COME: l'operazione che mette insieme due registri non somma
   le dimensioni, le MOLTIPLICA.

   E da lì arriva la definizione onesta di entanglement, che di solito
   viene data a parole:

     uno stato di due qubit è ENTANGLED quando NON si può scrivere
     come «questo qubit sta così E quell'altro sta così».

   Non è una proprietà misteriosa: è una <b>impossibilità di
   fattorizzazione</b>, e ha perfino un test in una riga. Per uno stato
   (a00, a01, a10, a11) si calcola

        a00·a11 − a01·a10

   e se non è zero lo stato è entangled. Quel conto è lo stesso
   «incrocio» che al livello M·4 diceva se due frecce erano
   indipendenti: la stessa riga di algebra, due significati.
   ============================================================ */

import { Stage, COL, bg, dot, text, roundRect, arrow, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud, nearSound } from './basicmath.js';

const due = v => (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
const RAD = g => (g * Math.PI) / 180;

/* ------------------------------------------------------------
   LOGICA PURA
   Un qubit è [a0, a1]; una coppia è [a00, a01, a10, a11].
   Numeri reali: bastano per tutto quello che questo livello dice.
   ------------------------------------------------------------ */

/** Il prodotto tensoriale: ogni ampiezza per ogni ampiezza. */
export const tensore = (a, b) => [a[0] * b[0], a[0] * b[1], a[1] * b[0], a[1] * b[1]];

/** Lo stesso per le macchine: due porte separate su due qubit. */
export function tensoreM(A, B) {
  const out = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      out.push(A[(r >> 1) * 2 + (c >> 1)] * B[(r & 1) * 2 + (c & 1)]);
    }
  }
  return out;
}

/** Il numero che decide tutto: se non è zero, lo stato non si separa. */
export const incrocio = psi => psi[0] * psi[3] - psi[1] * psi[2];

/** Separabile = si può scrivere come «questo qubit così, quello così». */
export const separabile = (psi, tol = 1e-6) => Math.abs(incrocio(psi)) < tol;

/**
 * Quanto è entangled, da 0 a 1. Per uno stato puro di due qubit a
 * coefficienti reali e normalizzato è due volte il valore assoluto
 * dell'incrocio: si chiama concorrenza.
 */
export const groviglio = psi => Math.min(1, 2 * Math.abs(incrocio(psi)) / Math.max(1e-12, norma(psi) ** 2));

export const norma = psi => Math.hypot(...psi);
export const normalizza = psi => { const n = norma(psi); return n < 1e-12 ? psi.slice() : psi.map(x => x / n); };

/**
 * Se lo stato è separabile, restituisce i due qubit che lo compongono.
 * Se non lo è, restituisce null — e quel null è il contenuto del livello.
 */
export function fattorizza(psi, tol = 1e-6) {
  if (!separabile(psi, tol)) return null;
  /* Lo stato, scritto per righe, è [a0·b , a1·b]: le due righe sono la
     STESSA freccia b, allungata di a0 e di a1. Quindi si prende la riga
     più lunga (per non dividere per quasi zero), la si normalizza — ed
     è b, segno compreso — e poi a si legge con due prodotti scalari. */
  const righe = [[psi[0], psi[1]], [psi[2], psi[3]]];
  const lunga = Math.hypot(...righe[0]) >= Math.hypot(...righe[1]) ? righe[0] : righe[1];
  if (Math.hypot(...lunga) < 1e-12) return null;
  const b = normalizza(lunga);
  const a = righe.map(r => r[0] * b[0] + r[1] * b[1]);
  return { a, b };
}

/** Un qubit dall'angolo: cos per |0⟩, sin per |1⟩. */
export const qubitDa = gradi => [Math.cos(RAD(gradi)), Math.sin(RAD(gradi))];

const R2 = Math.SQRT1_2;

/* La CNOT, che è la porta che l'entanglement lo CREA. */
export const CNOT = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 0, 1,
  0, 0, 1, 0,
];

export const applica4 = (M, v) =>
  [0, 1, 2, 3].map(r => M[r * 4] * v[0] + M[r * 4 + 1] * v[1] + M[r * 4 + 2] * v[2] + M[r * 4 + 3] * v[3]);

/* Gli stati da classificare nel secondo gioco. */
export const STATI = [
  { id: 'prodotto-facile', psi: [0.5, 0.5, 0.5, 0.5] },            // |+⟩⊗|+⟩
  { id: 'bell', psi: [R2, 0, 0, R2] },                             // il gatto: non si separa
  { id: 'prodotto-storto', psi: tensore(qubitDa(30), qubitDa(60)) },
  { id: 'bell-meno', psi: [0, R2, R2, 0] },                        // nemmeno questo
];

/* Le coppie da costruire nel primo gioco. */
export const BERSAGLI_T = [
  { id: 'zero-zero', a: 0, b: 0 },
  { id: 'piu-piu', a: 45, b: 45 },
  { id: 'zero-uno', a: 0, b: 90 },
];

/* ------------------------------------------------------------
   1) MOLTIPLICARE DUE REGISTRI
   ------------------------------------------------------------ */
export function tensoreLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('Due qubit fanno quattro ampiezze'),
    subtitle: t('ogni ampiezza del primo per ogni ampiezza del secondo: le dimensioni si moltiplicano'),
    modo: 'quantistico',
  });

  const st = { ga: 30, gb: 60, sfida: 0, fatte: new Set(), vinto: false };
  const near = nearSound();
  const ETICHETTE = ['00', '01', '10', '11'];

  const stage = new Stage(w.body, {
    height: 330,
    draw(ctx, s) {
      bg(ctx, s);
      const a = qubitDa(st.ga), b = qubitDa(st.gb);
      const psi = tensore(a, b);
      const bers = BERSAGLI_T[st.sfida];
      const scarto = Math.max(Math.abs(((st.ga - bers.a + 540) % 360) - 180) - 180, 0) === 0
        ? Math.hypot(st.ga - bers.a, st.gb - bers.b) : 999;
      const preso = Math.abs(st.ga - bers.a) < 3 && Math.abs(st.gb - bers.b) < 3;
      const top = hud(ctx, s, {
        goal: t('costruisci la coppia :a° e :b°', { a: bers.a, b: bers.b }),
        closeness: 1 - Math.min(1, scarto / 120),
        hit: preso,
        sub: t('coppie costruite: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const y0 = top + 14;
      /* i due qubit di partenza, come due coppie di barrette */
      const bw = Math.min(54, (s.w - 80) / 6);
      const gruppo = (x, amp, nomi, col, titolo) => {
        text(ctx, titolo, x, y0 - 2, { size: 11, color: COL.dim, max: bw * 2 + 10 });
        amp.forEach((v, i) => {
          const h0 = 54 * Math.abs(v);
          roundRect(ctx, x + i * (bw + 6), y0 + 8 + (54 - h0), bw, Math.max(2, h0), 3,
            { fill: v < 0 ? 'rgba(244,114,182,.55)' : 'rgba(34,211,238,.55)', stroke: col });
          text(ctx, nomi[i], x + i * (bw + 6) + bw / 2, y0 + 78, { size: 11, align: 'center', color: COL.dim, max: bw });
          text(ctx, due(v), x + i * (bw + 6) + bw / 2, y0 + 94, { size: 10.5, align: 'center', color: col, max: bw });
        });
      };
      gruppo(20, a, ['0', '1'], COL.cyan, t('primo qubit'));
      gruppo(20 + 2 * (bw + 6) + 34, b, ['0', '1'], COL.amber, t('secondo qubit'));

      text(ctx, '⊗', 20 + 2 * (bw + 6) + 14, y0 + 44, { size: 20, align: 'center', color: COL.violet, max: 30 });

      // le quattro ampiezze del prodotto
      const yq = y0 + 118;
      const bw2 = Math.min(60, (s.w - 60) / 4 - 8);
      const x0 = (s.w - (4 * bw2 + 3 * 8)) / 2;
      text(ctx, t('la coppia: quattro ampiezze'), 20, yq - 4, { size: 11, color: COL.dim, max: s.w - 40 });
      psi.forEach((v, i) => {
        const h0 = 62 * Math.abs(v);
        const x = x0 + i * (bw2 + 8);
        roundRect(ctx, x, yq + 10 + (62 - h0), bw2, Math.max(2, h0), 3,
          { fill: v < 0 ? 'rgba(244,114,182,.5)' : 'rgba(167,139,250,.5)', stroke: COL.violet });
        text(ctx, '|' + ETICHETTE[i] + '⟩', x + bw2 / 2, yq + 86, { size: 11, align: 'center', color: COL.dim, max: bw2 });
        text(ctx, due(v), x + bw2 / 2, yq + 102, { size: 10.5, align: 'center', color: COL.violet, max: bw2 });
      });

      text(ctx, t('incrocio a00·a11 − a01·a10 = :i → separabile per costruzione', { i: due(incrocio(psi)) }),
        16, s.h - 12, { size: 11.5, color: COL.green, max: s.w - 32 });
      st.px = s.w / 2; st.py = yq + 40;
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sa = slider({ label: t('primo qubit'), min: 0, max: 90, step: 5, value: st.ga, fmt: v => v + '°', oninput: v => { st.ga = v; upd(); } });
  const sb = slider({ label: t('secondo qubit'), min: 0, max: 90, step: 5, value: st.gb, fmt: v => v + '°', oninput: v => { st.gb = v; upd(); } });
  w.body.appendChild(controls(sa.root, sb.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🎯 ' + t('altra coppia'), class: 'sm primary', onclick: () => { st.sfida = (st.sfida + 1) % BERSAGLI_T.length; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const a = qubitDa(st.ga), b = qubitDa(st.gb);
    const psi = tensore(a, b);
    const bers = BERSAGLI_T[st.sfida];
    const preso = Math.abs(st.ga - bers.a) < 3 && Math.abs(st.gb - bers.b) < 3;
    if (preso && !st.fatte.has(st.sfida)) {
      st.fatte.add(st.sfida);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else if (!preso) near(1 - Math.min(1, Math.hypot(st.ga - bers.a, st.gb - bers.b) / 120));
    out.set(
      t('Primo qubit (<b>:a0</b> ; <b>:a1</b>), secondo (<b>:b0</b> ; <b>:b1</b>).',
        { a0: due(a[0]), a1: due(a[1]), b0: due(b[0]), b1: due(b[1]) }) + '\n' +
      t('La coppia: |00⟩ = :p00, |01⟩ = :p01, |10⟩ = :p10, |11⟩ = :p11 — ognuna è un prodotto delle due di sopra.',
        { p00: due(psi[0]), p01: due(psi[1]), p10: due(psi[2]), p11: due(psi[3]) }) + '\n' +
      '<span class="g">' + t('Due numeri più due numeri non fanno quattro numeri qualsiasi: ne fanno solo quelli che si ottengono moltiplicando. Ed è per questo che esistono stati di due qubit che <b>non</b> si possono scrivere così.') + '</span>');
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Da dove viene davvero il 2^n.</b> Il livello :m diceva che n qubit vivono in dimensione 2^n; qui vedi il meccanismo. Mettere insieme due registri non somma le dimensioni: le <b>moltiplica</b>, perché ogni ampiezza dell\'uno va accoppiata con ogni ampiezza dell\'altro. 2 × 2 = 4, poi 4 × 2 = 8, e così via — mentre due registri classici da n bit ne fanno semplicemente 2n.', { m: nOf('m4-spazi') }));
  return { state: st };
}

/* ------------------------------------------------------------
   2) PROVA A SEPARARLO — e scopri quando non si può
   ------------------------------------------------------------ */
export function groviglioLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('Prova a separarlo'),
    subtitle: t('cerca i due qubit che ricostruiscono lo stato — e guarda quando è impossibile'),
    modo: 'quantistico',
  });

  const st = { i: 0, ga: 45, gb: 45, classificati: new Set(), vinto: false };
  const bersaglio = () => STATI[st.i].psi;
  const ETICHETTE = ['00', '01', '10', '11'];

  const stage = new Stage(w.body, {
    height: 300,
    draw(ctx, s) {
      bg(ctx, s);
      const obiettivo = bersaglio();
      const mio = tensore(qubitDa(st.ga), qubitDa(st.gb));
      const scarto = Math.hypot(...obiettivo.map((v, i) => v - mio[i]));
      const inc = incrocio(obiettivo);
      const sep = separabile(obiettivo, 1e-6);
      const fatto = sep ? scarto < 0.06 : st.classificati.has(st.i);
      const top = hud(ctx, s, {
        goal: sep ? t('trova i due qubit che lo ricostruiscono') : t('provaci: poi dichiara che è impossibile'),
        closeness: sep ? 1 - Math.min(1, scarto / 1.4) : (st.classificati.has(st.i) ? 1 : 0.35),
        hit: fatto,
        sub: t('stati classificati: :fatte su :totali', { fatte: st.classificati.size, totali: cfg.need }),
      });

      const yq = top + 26;
      const bw = Math.min(62, (s.w - 60) / 4 - 10);
      const x0 = (s.w - (4 * bw + 3 * 10)) / 2;
      text(ctx, t('lo stato da separare (viola) e il tuo tentativo (azzurro)'), 16, yq - 4,
        { size: 11, color: COL.dim, max: s.w - 32 });
      for (let i = 0; i < 4; i++) {
        const x = x0 + i * (bw + 10);
        const ho = 70 * Math.abs(obiettivo[i]);
        const hm = 70 * Math.abs(mio[i]);
        roundRect(ctx, x, yq + 12 + (70 - ho), bw, Math.max(2, ho), 3,
          { fill: 'rgba(167,139,250,.45)', stroke: COL.violet });
        roundRect(ctx, x + bw * 0.28, yq + 12 + (70 - hm), bw * 0.44, Math.max(2, hm), 3,
          { fill: 'rgba(34,211,238,.75)', stroke: COL.cyan });
        text(ctx, '|' + ETICHETTE[i] + '⟩', x + bw / 2, yq + 98, { size: 11, align: 'center', color: COL.dim, max: bw });
        text(ctx, due(obiettivo[i]), x + bw / 2, yq + 114, { size: 10.5, align: 'center', color: COL.violet, max: bw });
      }

      // la barra dell'incrocio: il numero che decide
      const by = yq + 138, bwid = Math.min(240, s.w - 60);
      const bx = (s.w - bwid) / 2;
      roundRect(ctx, bx, by, bwid, 12, 6, { stroke: '#2b3a58' });
      roundRect(ctx, bx, by, Math.max(3, bwid * Math.min(1, groviglio(obiettivo))), 12, 6,
        { fill: sep ? COL.green : COL.pink, alpha: .85 });
      text(ctx, sep ? t('incrocio = 0 → separabile') : t('incrocio = :i → NON separabile', { i: due(inc) }),
        s.w / 2, by + 30, { size: 12.5, align: 'center', color: sep ? COL.green : COL.pink, max: s.w - 40 });
      text(ctx, t('scarto dal bersaglio: :s', { s: scarto.toFixed(3) }),
        s.w / 2, by + 48, { size: 11, align: 'center', color: COL.dim, max: s.w - 40 });
      st.px = s.w / 2; st.py = yq + 50;
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const si = choice({
    label: t('Lo stato'),
    items: STATI.map((x, i) => ({ label: t('stato :n', { n: i + 1 }), value: i })),
    value: 0,
    onchange: i => { st.i = i; upd(); },
  });
  w.body.appendChild(controls(si.root));
  const sa = slider({ label: t('primo qubit'), min: 0, max: 180, step: 5, value: st.ga, fmt: v => v + '°', oninput: v => { st.ga = v; upd(); } });
  const sb = slider({ label: t('secondo qubit'), min: 0, max: 180, step: 5, value: st.gb, fmt: v => v + '°', oninput: v => { st.gb = v; upd(); } });
  w.body.appendChild(controls(sa.root, sb.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🚫 ' + t('dichiaro: è impossibile'), class: 'sm primary', onclick: () => dichiara() },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function dichiara() {
    if (separabile(bersaglio(), 1e-6)) { sfx.err ? sfx.err() : sfx.click(); st.sbagliata = true; }
    else { st.sbagliata = false; st.classificati.add(st.i); sfx.ok(); fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2); }
    upd();
  }

  function upd() {
    const obiettivo = bersaglio();
    const mio = tensore(qubitDa(st.ga), qubitDa(st.gb));
    const scarto = Math.hypot(...obiettivo.map((v, i) => v - mio[i]));
    const sep = separabile(obiettivo, 1e-6);
    if (sep && scarto < 0.06) st.classificati.add(st.i);
    if (st.classificati.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    const f = fattorizza(obiettivo);
    out.set(
      t('Incrocio a00·a11 − a01·a10 = <b>:i</b>.', { i: due(incrocio(obiettivo)) }) + '\n' +
      (sep
        ? t('È <b>separabile</b>: esistono due qubit che lo ricostruiscono, ed è la coppia (:a0 ; :a1) con (:b0 ; :b1). Muovi i cursori finché le barrette azzurre non coprono quelle viola.',
          { a0: due(f.a[0]), a1: due(f.a[1]), b0: due(f.b[0]), b1: due(f.b[1]) })
        : '<span class="p">' + t('È <b>entangled</b>: nessuna coppia di qubit lo ricostruisce, e non è una questione di pazienza. Guarda: servirebbe a00·a11 ≠ 0 e insieme a01·a10 = 0 con a01 e a10 che non sono entrambi nulli — cioè due cose che non possono valere insieme. Premi «dichiaro: è impossibile».') + '</span>') +
      (st.sbagliata ? '\n<span class="a">' + t('Questo però si separa: cercalo ancora, i cursori bastano.') + '</span>' : '') +
      (sep && scarto < 0.06 ? '\n<span class="g">✓ ' + t('Ricostruito.') + '</span>' : ''));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Entangled vuol dire «non si scrive come due cose separate».</b> Non «i due qubit comunicano», non «si influenzano a distanza»: vuol dire che lo stato della coppia <b>non si spezza</b> in uno stato del primo e uno del secondo. E si riconosce con un conto solo, a00·a11 − a01·a10 — la stessa riga che al livello :m diceva se due frecce erano indipendenti. La porta che quel numero lo rende diverso da zero è la CNOT del livello :c.', { m: nOf('m4-spazi'), c: nOf('04-due-qubit') }));
  return { state: st };
}
