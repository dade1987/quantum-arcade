/* ============================================================
   PARTE M — L'ESPONENZIALE DI UNA MATRICE
   e^(matrice): come si fa evolvere un sistema fisico.

   Questo livello è il punto in cui tre pezzi della Parte M si
   incastrano:

   · la serie di Taylor (M·10) dice CHE COSA vuol dire e^(matrice):
     la stessa somma 1 + x + x²/2! + … con una matrice al posto di
     x. Non c'è nient'altro da capire, e nel gioco si vede la somma
     avvicinarsi al risultato vero termine dopo termine;

   · la diagonalizzazione (M·11) dice COME si calcola senza sommare
     niente: nella base degli autovettori l'esponenziale è solo
     e^(autovalore) su ciascuna direzione;

   · il limite (M·8) dice perché la formula di Trotter funziona.
     Quando l'energia è fatta di due pezzi che NON commutano —
     cioè che danno risultati diversi a seconda dell'ordine — non
     si può spezzare l'esponenziale in due. Si può però spezzarlo
     in n pezzetti e sbagliare sempre meno, ed è esattamente quello
     che fa un computer quantistico quando simula una molecola.

   Tutto reale e 2×2 per poterlo disegnare: la freccia gira nel
   piano invece che sulla sfera di Bloch. I conti sono gli stessi.
   ============================================================ */

import { Stage, COL, bg, dot, text, roundRect, arrow, circle, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud } from './basicmath.js';
import { applica, prodotto, determinante, traccia } from './operatori.js';
import { angoloDiagonalizzante, matriceDiCambio, nellaBase } from './base.js';

const IDENT = [1, 0, 0, 1];
const somma = (A, B) => A.map((x, i) => x + B[i]);
const perNumero = (A, k) => A.map(x => x * k);

/* ------------------------------------------------------------
   e^(matrice), PER SERIE
   La definizione, presa di peso dal livello M·10: si sommano i
   termini M^k/k!, solo che M è una matrice.
   ------------------------------------------------------------ */

export function espSerie(M, termini) {
  let out = IDENT.slice(), pezzo = IDENT.slice();
  for (let k = 1; k <= termini; k++) {
    pezzo = perNumero(prodotto(pezzo, M), 1 / k);
    out = somma(out, pezzo);
  }
  return out;
}

/* ------------------------------------------------------------
   e^(matrice), IN FORMA CHIUSA
   Due casi, e sono i due che servono: una matrice antisimmetrica
   genera una rotazione, una simmetrica si diagonalizza. In
   entrambi non si somma niente — e il test confronta questa
   strada con la serie.
   ------------------------------------------------------------ */

export const antisimmetrica = M => Math.abs(M[0]) < 1e-12 && Math.abs(M[3]) < 1e-12
  && Math.abs(M[1] + M[2]) < 1e-12;
export const simmetrica = M => Math.abs(M[1] - M[2]) < 1e-12;

export function espEsatta(M) {
  if (antisimmetrica(M)) {
    /* [[0,−w],[w,0]] genera la rotazione di w radianti */
    const w = M[2];
    return [Math.cos(w), -Math.sin(w), Math.sin(w), Math.cos(w)];
  }
  if (simmetrica(M)) {
    const g = angoloDiagonalizzante(M);
    const P = matriceDiCambio(g);
    const D = nellaBase(g, M);
    const E = [Math.exp(D[0]), 0, 0, Math.exp(D[3])];
    return prodotto(P, prodotto(E, [P[0], P[2], P[1], P[3]]));
  }
  /* per tutto il resto la serie, spinta lontano, è la definizione */
  return espSerie(M, 60);
}

export function erroreSerie(M, termini) {
  const a = espSerie(M, termini), b = espEsatta(M);
  return Math.max(...a.map((x, i) => Math.abs(x - b[i])));
}

/* ------------------------------------------------------------
   IL COMMUTATORE E LA FORMULA DI TROTTER
   ------------------------------------------------------------ */

/** AB − BA: dice di quanto conta l'ordine. Zero = non conta. */
export const commutatore = (A, B) => somma(prodotto(A, B), perNumero(prodotto(B, A), -1));

export const commutano = (A, B, tol = 1e-9) => commutatore(A, B).every(x => Math.abs(x) < tol);

/** e^(A/n)·e^(B/n), ripetuto n volte: la ricetta di Trotter. */
export function trotter(A, B, n) {
  const passo = prodotto(espEsatta(perNumero(A, 1 / n)), espEsatta(perNumero(B, 1 / n)));
  let out = IDENT.slice();
  for (let k = 0; k < n; k++) out = prodotto(out, passo);
  return out;
}

export function erroreTrotter(A, B, n) {
  const vero = espEsatta(somma(A, B));
  const finto = trotter(A, B, n);
  return Math.max(...vero.map((x, i) => Math.abs(x - finto[i])));
}

/* i due pezzi di energia del gioco: una rotazione e una stiratura,
   che non commutano — come non commutano i pezzi veri di un
   hamiltoniano di molecola */
export const PEZZO_A = [0, -1, 1, 0];          // gira
export const PEZZO_B = [0.6, 0.9, 0.9, -0.6];  // stira lungo una diagonale

export const GENERATORI = [
  { id: 'gira', M: [0, -1, 1, 0] },
  { id: 'stira', M: [0.5, 0, 0, -0.5] },
  { id: 'storto', M: [0.2, 0.7, 0.7, 0.2] },
];

/* ------------------------------------------------------------
   1) e^(matrice) COSTRUITO A MANO, TERMINE PER TERMINE
   ------------------------------------------------------------ */
export function esponenzialeLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('e elevato a una matrice'),
    subtitle: t('la stessa serie del livello M·10, con una matrice al posto del numero'),
  });

  const st = { gen: 0, tempo: 1, termini: 1, fatte: new Set(), vinto: false };
  const SOGLIA = 0.001;

  const stage = new Stage(w.body, {
    height: 320,
    draw(ctx, s) {
      bg(ctx, s);
      const M = perNumero(GENERATORI[st.gen].M, st.tempo);
      const err = erroreSerie(M, st.termini);
      const preso = err < SOGLIA;
      const top = hud(ctx, s, {
        goal: t('serie a meno di :s', { s: SOGLIA }),
        closeness: Math.min(1, SOGLIA / Math.max(err, 1e-15)),
        hit: preso,
        sub: t('generatori domati: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const partenza = [1, 0];
      /* la scala si adatta alla strada che la serie percorre, ma con
         un tetto: con pochi termini le somme parziali schizzano
         lontanissimo, e senza tetto il cerchio bersaglio diventerebbe
         un puntino */
      const tappe = Array.from({ length: st.termini + 1 },
        (_, k) => applica(espSerie(perNumero(GENERATORI[st.gen].M, st.tempo), k), partenza));
      const largo = Math.min(3, Math.max(1.2, ...tappe.map(z => Math.hypot(...z))));
      const spazio = Math.min((s.h - top - 74) / 2, s.w / 2 - 24);
      const R = spazio / largo;
      const cx = s.w / 2, cy = top + 8 + spazio;
      const P = ([a, b]) => [cx + a * R, cy - b * R];
      circle(ctx, cx, cy, R, { stroke: '#2b3a58', dash: [4, 4] });
      const vero = applica(espEsatta(M), partenza);
      const finto = applica(espSerie(M, st.termini), partenza);

      /* la strada che la serie percorre, termine dopo termine */
      ctx.save();
      ctx.beginPath(); ctx.rect(0, top, s.w, s.h - top - 56); ctx.clip();
      ctx.strokeStyle = 'rgba(251,191,36,.45)'; ctx.lineWidth = 1.2; ctx.beginPath();
      tappe.forEach((z, k) => { const [px, py] = P(z); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
      ctx.stroke();
      tappe.forEach(z => { const [px, py] = P(z); dot(ctx, px, py, 2.2, COL.amber); });
      ctx.restore();

      const [vx, vy] = P(vero);
      circle(ctx, vx, vy, 8, { stroke: COL.green, width: 2 });
      arrow(ctx, cx, cy, ...P(finto), { color: COL.amber, width: 2.4 });
      arrow(ctx, cx, cy, ...P(partenza), { color: '#4a5878', width: 1.6, dash: [4, 3] });

      text(ctx, t('termini: :k · errore: :e', { k: st.termini, e: err < 1e-9 ? '0' : err.toFixed(6) }),
        16, s.h - 46, { size: 11.5, color: preso ? COL.green : COL.txt, max: s.w - 32 });
      text(ctx, t('la strada gialla è la somma che si costruisce'),
        16, s.h - 28, { size: 11, color: COL.dim, max: s.w - 32 });
      text(ctx, t('il cerchio verde è dove si deve arrivare'),
        16, s.h - 10, { size: 11, color: COL.dim, max: s.w - 32 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sg = choice({
    items: [
      { label: t('gira'), value: '0' },
      { label: t('stira'), value: '1' },
      { label: t('storto'), value: '2' },
    ],
    value: '0',
    onchange: v => { st.gen = Number(v); sfx.click(); upd(); },
  });
  const stt = slider({
    label: t('per quanto tempo'), min: 0.5, max: 6, step: 0.5, value: 1,
    fmt: v => '×' + v, oninput: v => { st.tempo = v; upd(); },
  });
  const sk = slider({
    label: t('quanti termini della serie'), min: 0, max: 24, step: 1, value: 1,
    fmt: v => v + '', oninput: v => { st.termini = v; upd(); },
  });
  w.body.appendChild(controls(sg.root, stt.root, sk.root));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const M = perNumero(GENERATORI[st.gen].M, st.tempo);
    const err = erroreSerie(M, st.termini);
    if (err < SOGLIA && !st.fatte.has(st.gen)) {
      st.fatte.add(st.gen);
      sfx.ok(); fx.burst(stage.w / 2, stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    const E = espEsatta(M);
    out.set([
      t('e^M vuol dire <b>I + M + M²/2! + M³/3! + …</b>, esattamente la serie del livello :n con una matrice al posto del numero. Con <b>:k</b> termini sbagli di <b>:e</b>.',
        { n: nOf('m10-taylor'), k: st.termini, e: err < 1e-9 ? '0' : err.toFixed(6) }),
      t('Il risultato vero è la matrice [ :a &nbsp;:b ; :c &nbsp;:d ], e si calcola <b>senza sommare niente</b>: nella base degli autovettori (livello :m) basta fare e^(autovalore) su ciascuna direzione.',
        { a: E[0].toFixed(3), b: E[1].toFixed(3), c: E[2].toFixed(3), d: E[3].toFixed(3), m: nOf('m11-base') }),
      '<span class="a">' + t('E c\'è un fatto che vale sempre: <b>det(e^M) = e^(traccia di M)</b>. Qui la traccia è :t e il determinante viene :s. Se la traccia è zero il determinante è 1 — cioè la trasformazione non cambia le aree, e in quantistica vuol dire che le probabilità continuano a fare 1.',
        { t: traccia(M).toFixed(3), s: determinante(E).toFixed(4) }) + '</span>',
    ].join('\n'));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>A che serve.</b> Un sistema fisico che parte da uno stato ψ e ha energia H si trova, dopo un tempo t, nello stato <b>e^(−iHt)·ψ</b>. È la soluzione dell\'equazione di Schrödinger, ed è un esponenziale di matrice — cioè questa cosa qui. Nel gioco è tutto reale per poterlo disegnare: la freccia gira nel piano invece che sulla sfera di Bloch del livello :b, ma la formula è la stessa.', { b: nOf('02-bloch') }));
  return { state: st };
}

/* ------------------------------------------------------------
   2) TROTTER — spezzare il tempo quando i pezzi non commutano
   ------------------------------------------------------------ */
export function trotterLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('Spezzare il tempo: la formula di Trotter'),
    subtitle: t('due pezzi di energia che non vanno d\'accordo, e come si fa lo stesso'),
  });

  const st = { n: 1, tempo: 1, fatte: new Set(), vinto: false };
  /* la soglia cresce col tempo: chiedere la stessa precisione su un
     tempo tre volte più lungo vorrebbe dire tre volte i pezzetti, ed
     è proprio il conto che il livello vuole far vedere */
  const soglia = () => 0.01 * st.tempo;

  const stage = new Stage(w.body, {
    height: 320,
    draw(ctx, s) {
      bg(ctx, s);
      const A = perNumero(PEZZO_A, st.tempo), B = perNumero(PEZZO_B, st.tempo);
      const err = erroreTrotter(A, B, st.n);
      const preso = err < soglia();
      const top = hud(ctx, s, {
        goal: t('avvicinati a meno di :s', { s: soglia().toFixed(3) }),
        closeness: Math.min(1, soglia() / Math.max(err, 1e-12)),
        hit: preso,
        sub: t('prove riuscite: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const partenza = [1, 0];
      const vero = applica(espEsatta(somma(A, B)), partenza);
      /* la scala si prende dal bersaglio: con la stiratura dentro,
         la freccia finisce ben fuori dal cerchio unitario */
      const largo = Math.max(1.2, Math.hypot(...vero) * 1.15);
      const spazio = Math.min((s.h - top - 74) / 2, s.w / 2 - 24);
      const scala = spazio / largo;
      const cx = s.w / 2, cy = top + 8 + spazio;
      const P = ([a, b]) => [cx + a * scala, cy - b * scala];
      circle(ctx, cx, cy, scala, { stroke: '#2b3a58', dash: [4, 4] });

      /* il cammino a zig-zag: mezzo passo con A, mezzo con B, n volte */
      const passoA = espEsatta(perNumero(A, 1 / st.n));
      const passoB = espEsatta(perNumero(B, 1 / st.n));
      let v = partenza.slice();
      ctx.strokeStyle = 'rgba(167,139,250,.6)'; ctx.lineWidth = 1.4; ctx.beginPath();
      let [px, py] = P(v); ctx.moveTo(px, py);
      for (let k = 0; k < st.n; k++) {
        v = applica(passoA, v); [px, py] = P(v); ctx.lineTo(px, py);
        v = applica(passoB, v); [px, py] = P(v); ctx.lineTo(px, py);
      }
      ctx.stroke();

      const [gx, gy] = P(vero);
      circle(ctx, gx, gy, 8, { stroke: COL.green, width: 2 });
      arrow(ctx, cx, cy, ...P(v), { color: COL.violet, width: 2.4 });
      arrow(ctx, cx, cy, ...P(partenza), { color: '#4a5878', width: 1.6, dash: [4, 3] });

      text(ctx, t('pezzetti: :n · errore: :e', { n: st.n, e: err.toFixed(5) }),
        16, s.h - 46, { size: 11.5, color: preso ? COL.green : COL.txt, max: s.w - 32 });
      text(ctx, t('viola: spezzato · verde: bersaglio'),
        16, s.h - 28, { size: 11, color: COL.dim, max: s.w - 32 });
      text(ctx, t('raddoppiare i pezzetti dimezza l\'errore'),
        16, s.h - 10, { size: 11, color: COL.dim, max: s.w - 32 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sn = slider({
    label: t('in quanti pezzetti spezzo il tempo'), min: 1, max: 400, step: 1, value: 1,
    fmt: v => v + '×', oninput: v => { st.n = v; upd(); },
  });
  const stt = slider({
    label: t('per quanto tempo'), min: 0.5, max: 3, step: 0.5, value: 1,
    fmt: v => '×' + v, oninput: v => { st.tempo = v; upd(); },
  });
  w.body.appendChild(controls(sn.root, stt.root));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const A = perNumero(PEZZO_A, st.tempo), B = perNumero(PEZZO_B, st.tempo);
    const err = erroreTrotter(A, B, st.n);
    const chiave = st.tempo <= 1 ? 'corto' : 'lungo';
    if (err < soglia() && !st.fatte.has(chiave)) {
      st.fatte.add(chiave);
      sfx.ok(); fx.burst(stage.w / 2, stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    const c = commutatore(A, B);
    out.set([
      t('L\'energia è fatta di due pezzi, A e B. Vorresti scrivere e^(A+B) = e^A·e^B, come si fa con i numeri. <b>Non si può</b>: qui il commutatore AB − BA vale :c, cioè l\'ordine conta.',
        { c: Math.max(...c.map(Math.abs)).toFixed(3) }),
      t('Con <b>:n</b> pezzetti il cammino spezzato finisce a <b>:e</b> dal punto giusto. Raddoppia i pezzetti e guarda l\'errore: si dimezza.',
        { n: st.n, e: err.toFixed(5) }),
      '<span class="a">' + t('Questo è letteralmente quello che fa un computer quantistico quando simula una molecola: non sa applicare e^(−iHt) in un colpo, ma sa applicare i pezzi uno alla volta. Più pezzetti, più porte da eseguire, meno errore. È il prezzo, ed è tutto qui.') + '</span>',
    ].join('\n'));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Perché non si può spezzare e basta.</b> Con i numeri e^(a+b) = e^a·e^b sempre, perché a·b = b·a. Con le matrici no: se AB ≠ BA quella regola salta, e la differenza si chiama <b>commutatore</b>. Il commutatore è la stessa cosa che al livello :i rende impossibile misurare due grandezze insieme — il principio di indeterminazione è una disuguaglianza sul commutatore. Qui lo vedi come uno scarto fra due frecce.', { i: nOf('02-bloch') }));
  return { state: st };
}
