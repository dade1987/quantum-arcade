/* ============================================================
   PARTE M — CAMBIO DI BASE E DIAGONALIZZAZIONE
   Lo stesso vettore, letto con due righelli diversi.

   Al livello M·4 la base è arrivata come «poche frecce che
   raggiungono tutto». Qui si fa il passo che serve alla
   quantistica: la stessa freccia si può leggere in DUE basi, e i
   numeri cambiano anche se la freccia non si muove. Da lì:

   · misurare vuol dire proiettare sulle direzioni di una base. Uno
     stato che in una base è «testa o croce» in un'altra è
     «sicuro»: |+⟩ è 50 e 50 lungo Z e certo lungo X. Non è un
     modo di dire — qui è un conto, e il test lo verifica;

   · la porta di Hadamard NON è una porta misteriosa: è il cambio
     di base fra Z e X, scritto come matrice;

   · una matrice, nella base giusta, diventa una pura stiratura.
     Quella base è fatta dagli autovettori del livello 18·b, e in
     quella base calcolare A^n costa n moltiplicazioni di numeri
     invece che di matrici. È il motivo per cui la stima di fase
     funziona, ed è quello che al prossimo livello permetterà di
     calcolare e^(iHt).

   Tutto qui è 2×2 perché si deve poter disegnare. Le formule sono
   le stesse a 4×4, a 8×8 e a 2ⁿ×2ⁿ: smette di funzionare il
   disegno, non la matematica.
   ============================================================ */

import { Stage, COL, bg, dot, text, roundRect, arrow, circle, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud } from './basicmath.js';
import { applica, prodotto, aggiunta, determinante, traccia, unitaria } from './operatori.js';

const RAD = g => (g * Math.PI) / 180;
const R2 = Math.SQRT1_2;

/* ------------------------------------------------------------
   BASI E COORDINATE
   Una base ortonormale del piano è data da un angolo: il primo
   versore sta a quell'angolo, il secondo a 90° più in là.
   ------------------------------------------------------------ */

export const versori = gradi => [
  [Math.cos(RAD(gradi)), Math.sin(RAD(gradi))],
  [-Math.sin(RAD(gradi)), Math.cos(RAD(gradi))],
];

/** Le componenti di v nella base data: due prodotti scalari. */
export function coordinateIn(gradi, v) {
  const [e1, e2] = versori(gradi);
  return [v[0] * e1[0] + v[1] * e1[1], v[0] * e2[0] + v[1] * e2[1]];
}

/** La matrice che porta le coordinate nella base DENTRO quelle standard. */
export const matriceDiCambio = gradi => {
  const [e1, e2] = versori(gradi);
  return [e1[0], e2[0], e1[1], e2[1]];        // i versori come colonne
};

/** La stessa matrice, vista da chi usa l'altra base: P⁻¹ A P. */
export function nellaBase(gradi, M) {
  const P = matriceDiCambio(gradi);
  return prodotto(aggiunta(P), prodotto(M, P));   // P è ortogonale: P⁻¹ = Pᵀ
}

/** Le probabilità di misurare lungo le due direzioni della base. */
export function misuraIn(gradi, stato) {
  const [a, b] = coordinateIn(gradi, stato);
  const n = a * a + b * b;
  return n < 1e-12 ? [0, 0] : [a * a / n, b * b / n];
}

/* le due basi che il corso usa di continuo */
export const BASE_Z = 0;
export const BASE_X = 45;

/** La porta di Hadamard: la matrice che scambia le due basi. */
export const HADAMARD = [R2, R2, R2, -R2];

/* ------------------------------------------------------------
   DIAGONALIZZAZIONE
   Per una matrice simmetrica 2×2 gli autovettori sono ortogonali:
   basta trovare l'angolo giusto e la matrice diventa diagonale.
   ------------------------------------------------------------ */

/** L'angolo della base che diagonalizza una matrice simmetrica. */
export function angoloDiagonalizzante(M) {
  const [a, b, , d] = M;
  if (Math.abs(b) < 1e-12) return 0;
  return (Math.atan2(2 * b, a - d) * 90) / Math.PI;   // mezzo arcotangente, in gradi
}

/** Quanto una matrice è lontana dall'essere diagonale. */
export const fuoriDiagonale = M => Math.abs(M[1]) + Math.abs(M[2]);

/** Gli autovalori di una simmetrica 2×2: sempre reali. */
export function autovaloriSimmetrica(M) {
  const t2 = traccia(M), d = determinante(M);
  const dis = Math.sqrt(Math.max(0, t2 * t2 - 4 * d));
  return [(t2 + dis) / 2, (t2 - dis) / 2];
}

/** A^n fatto a forza bruta: n prodotti di matrici. */
export function potenza(M, n) {
  let out = [1, 0, 0, 1];
  for (let k = 0; k < n; k++) out = prodotto(out, M);
  return out;
}

/**
 * A^n fatto nella base giusta: si elevano DUE numeri, non matrici.
 * È la scorciatoia che rende possibile la stima di fase.
 */
export function potenzaDiagonalizzando(M, n) {
  const g = angoloDiagonalizzante(M);
  const P = matriceDiCambio(g);
  const D = nellaBase(g, M);
  const Dn = [D[0] ** n, 0, 0, D[3] ** n];
  return prodotto(P, prodotto(Dn, aggiunta(P)));
}

/* le macchine simmetriche del gioco: tutte diagonalizzabili */
export const MACCHINE_S = [
  { id: 'stira', M: [1.4, 0.6, 0.6, 0.9] },
  { id: 'specchio', M: [0.2, 1, 1, 0.2] },
  { id: 'schiaccia', M: [1, 0.8, 0.8, 1] },
];

export const STATI = [
  { nome: '|0⟩', v: [1, 0] },
  { nome: '|1⟩', v: [0, 1] },
  { nome: '|+⟩', v: [R2, R2] },
  { nome: '20°', v: [Math.cos(RAD(20)), Math.sin(RAD(20))] },
];

/* ------------------------------------------------------------
   1) LO STESSO VETTORE, DUE RIGHELLI
   ------------------------------------------------------------ */
export function cambioBaseLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('Due righelli, una freccia sola'),
    subtitle: t('la freccia non si muove: cambia chi la misura'),
  });

  const st = { stato: 2, gradi: 0, fatte: new Set(), vinto: false };

  const stage = new Stage(w.body, {
    height: 320,
    draw(ctx, s) {
      bg(ctx, s);
      const v = STATI[st.stato].v;
      const [p1, p2] = misuraIn(st.gradi, v);
      const certo = Math.max(p1, p2) > 0.99;
      const top = hud(ctx, s, {
        goal: t('rendi certa la misura'),
        closeness: Math.max(p1, p2),
        hit: certo,
        sub: t('scoperte: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const R = Math.min((s.h - top - 66) / 2, s.w / 2 - 20);
      const cx = s.w / 2, cy = top + 8 + R;
      const P = ([a, b]) => [cx + a * R, cy - b * R];

      circle(ctx, cx, cy, R, { stroke: '#2b3a58', dash: [4, 4] });

      // il righello: i due assi della base scelta
      const [e1, e2] = versori(st.gradi);
      for (const [e, col] of [[e1, COL.green], [e2, COL.pink]]) {
        const [x1, y1] = P([e[0] * 1.15, e[1] * 1.15]);
        const [x0, y0] = P([-e[0] * 1.15, -e[1] * 1.15]);
        ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.55;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // le proiezioni: è quello che fa la misura
      const [c1, c2] = coordinateIn(st.gradi, v);
      const [vx, vy] = P(v);
      for (const [c, e, col] of [[c1, e1, COL.green], [c2, e2, COL.pink]]) {
        const [px, py] = P([e[0] * c, e[1] * c]);
        ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(px, py); ctx.stroke();
        ctx.setLineDash([]);
        arrow(ctx, cx, cy, px, py, { color: col, width: 2 });
      }
      arrow(ctx, cx, cy, vx, vy, { color: COL.cyan, width: 2.6 });
      dot(ctx, vx, vy, 4, COL.cyan);

      text(ctx, STATI[st.stato].nome, 16, top + 14, { size: 13, color: COL.cyan, max: 110 });
      text(ctx, t('coordinate: :a e :b', { a: c1.toFixed(3), b: c2.toFixed(3) }),
        16, s.h - 46, { size: 11.5, color: COL.txt, max: s.w - 32 });
      text(ctx, t('probabilità: :p% e :q%', { p: (p1 * 100).toFixed(1), q: (p2 * 100).toFixed(1) }),
        16, s.h - 28, { size: 12, color: certo ? COL.green : COL.amber, max: s.w - 32 });
      text(ctx, t('misurare = proiettare sugli assi del righello'),
        16, s.h - 10, { size: 11, color: COL.dim, max: s.w - 32 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const ss = choice({
    items: [
      { label: '|0⟩', value: '0' }, { label: '|1⟩', value: '1' },
      { label: '|+⟩', value: '2' }, { label: t('obliquo'), value: '3' },
    ],
    value: '2',
    onchange: v => { st.stato = Number(v); sfx.click(); upd(); },
  });
  const sg = slider({
    label: t('inclinazione del righello'), min: 0, max: 90, step: 5, value: 0,
    fmt: v => v + '°', oninput: v => { st.gradi = v; upd(); },
  });
  w.body.appendChild(controls(ss.root, sg.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '📏 ' + t('righello Z (0°)'), class: 'sm', onclick: () => { st.gradi = 0; sg.value = 0; sfx.click(); upd(); } },
    { label: '📐 ' + t('righello X (45°)'), class: 'sm primary', onclick: () => { st.gradi = 45; sg.value = 45; sfx.click(); upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const v = STATI[st.stato].v;
    const [p1, p2] = misuraIn(st.gradi, v);
    const massimo = Math.max(p1, p2);
    if (massimo > 0.99 && !st.fatte.has('certa')) segna('certa');
    if (Math.abs(p1 - 0.5) < 0.02 && !st.fatte.has('meta')) segna('meta');
    const [c1, c2] = coordinateIn(st.gradi, v);
    const righe = [
      t('La freccia è sempre la stessa. Con il righello a <b>:g°</b> le sue coordinate sono <b>:a</b> e <b>:b</b>, e misurando esce la prima direzione il <b>:p%</b> delle volte.',
        { g: st.gradi, a: c1.toFixed(3), b: c2.toFixed(3), p: (p1 * 100).toFixed(1) }),
      t('Le probabilità sono i <b>quadrati</b> delle coordinate: è la regola di Born, ed è il motivo per cui in questo corso si somma sempre il quadrato delle ampiezze.'),
    ];
    if (massimo > 0.99) {
      righe.push('<span class="ok">' + t('Qui la misura è <b>certa</b>: la freccia è esattamente su un asse del righello, e l\'altro asse riceve zero. Nessun caso, nessuna moneta.') + '</span>');
    } else if (Math.abs(p1 - 0.5) < 0.02) {
      righe.push('<span class="b">' + t('Qui la misura è <b>testa o croce</b>: 50 e 50. Ed è la stessa freccia di prima — non è cambiato lo stato, è cambiato il righello.') + '</span>');
    }
    out.set(righe.join('\n'));
    stage.redraw();
  }
  function segna(chiave) {
    st.fatte.add(chiave);
    sfx.ok(); fx.burst(stage.w / 2, stage.h / 2);
    if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
  }
  upd();
  w.setFoot(t('<b>La porta di Hadamard è questo, e nient\'altro.</b> Al livello :h arriva come «la porta che mette in sovrapposizione». Guardala qui: è la macchina che riscrive uno stato nel righello a 45°. I due numeri che ne escono, al quadrato, sono esattamente le due probabilità che vedi nel gioco — e i test lo verificano su ogni stato. Per questo manda |0⟩ in una cosa che lungo Z è 50 e 50, e per questo applicandola due volte si torna al punto di partenza: cambiare righello e ricambiarlo non fa niente.', { h: nOf('03-porte') }));
  return { state: st };
}

/* ------------------------------------------------------------
   2) LA BASE IN CUI LA MACCHINA È SOLO UNA STIRATURA
   ------------------------------------------------------------ */
export function diagonaleLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('La base in cui la macchina si semplifica'),
    subtitle: t('gira il righello finché la matrice non ha più angoli storti'),
  });

  const st = { macchina: 0, gradi: 0, fatte: new Set(), vinto: false };

  const stage = new Stage(w.body, {
    height: 330,
    draw(ctx, s) {
      bg(ctx, s);
      const M = MACCHINE_S[st.macchina].M;
      const vista = nellaBase(st.gradi, M);
      const storto = fuoriDiagonale(vista);
      const pulita = storto < 0.03;
      const top = hud(ctx, s, {
        goal: t('azzera i numeri fuori diagonale'),
        closeness: Math.min(1, 0.03 / Math.max(storto, 1e-9)),
        hit: pulita,
        sub: t('macchine domate: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const R = Math.min((s.h - top - 96) / 2, s.w / 3);
      const cx = s.w * 0.32, cy = top + 8 + R;
      const P = ([a, b]) => [cx + a * R * 0.55, cy - b * R * 0.55];

      circle(ctx, cx, cy, R * 0.55, { stroke: '#2b3a58', dash: [4, 4] });

      // che cosa fa la macchina alle direzioni del righello
      const [e1, e2] = versori(st.gradi);
      for (const [e, col] of [[e1, COL.green], [e2, COL.pink]]) {
        const fuori = applica(M, e);
        const [ax, ay] = P(e);
        const [bx, by] = P(fuori);
        ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ax, ay); ctx.stroke();
        ctx.globalAlpha = 1;
        arrow(ctx, cx, cy, bx, by, { color: col, width: 2.2 });
        /* quando l'uscita è allineata con l'entrata, la macchina su
           quella direzione è solo una stiratura: è un autovettore */
        const allineato = Math.abs(fuori[0] * e[1] - fuori[1] * e[0]) < 0.02;
        if (allineato) dot(ctx, bx, by, 5, col);
      }

      // la matrice vista da quel righello
      const bx0 = s.w * 0.62, by0 = top + 26;
      const celle = [[vista[0], 0, 0], [vista[1], 1, 0], [vista[2], 0, 1], [vista[3], 1, 1]];
      for (const [val, col, rig] of celle) {
        const diag = col === rig;
        const x = bx0 + col * 62, y = by0 + rig * 40;
        roundRect(ctx, x, y, 56, 34, 6, {
          fill: diag ? 'rgba(52,211,153,.14)' : Math.abs(val) < 0.02 ? 'rgba(52,211,153,.14)' : 'rgba(244,114,182,.14)',
          stroke: '#2b3a58',
        });
        text(ctx, val.toFixed(2), x + 28, y + 18,
          { size: 12, align: 'center', color: diag ? COL.green : Math.abs(val) < 0.02 ? COL.green : COL.pink, max: 52 });
      }
      text(ctx, t('vista dal righello'), bx0, by0 - 12,
        { size: 10.5, color: '#7f8fb3', max: s.w - bx0 - 16 });

      text(ctx, t('righello a :g° · fuori diagonale: :f', { g: st.gradi, f: storto.toFixed(3) }),
        16, s.h - 30, { size: 11.5, color: pulita ? COL.green : COL.txt, max: s.w - 32 });
      text(ctx, t('frecce dritte = solo una stiratura'),
        16, s.h - 12, { size: 11, color: COL.dim, max: s.w - 32 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sm = choice({
    /* le etichette sono scritte a mano perché t() vuole una frase
       letterale: è la stessa convenzione degli altri mini-giochi */
    items: [
      { label: t('stira e taglia'), value: '0' },
      { label: t('specchio storto'), value: '1' },
      { label: t('schiaccia'), value: '2' },
    ],
    value: '0',
    onchange: v => { st.macchina = Number(v); sfx.click(); upd(); },
  });
  const sg = slider({
    label: t('inclinazione del righello'), min: 0, max: 90, step: 0.5, value: 0,
    fmt: v => v + '°', oninput: v => { st.gradi = v; upd(); },
  });
  w.body.appendChild(controls(sm.root, sg.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🎯 ' + t('portami nella base giusta'), class: 'sm primary', onclick: () => {
      const g = ((angoloDiagonalizzante(MACCHINE_S[st.macchina].M) % 180) + 180) % 180;
      st.gradi = Math.round((g > 90 ? g - 90 : g) * 2) / 2;
      sg.value = st.gradi; sfx.ok(); upd();
    } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const M = MACCHINE_S[st.macchina].M;
    const vista = nellaBase(st.gradi, M);
    const storto = fuoriDiagonale(vista);
    if (storto < 0.03 && !st.fatte.has(String(st.macchina))) {
      st.fatte.add(String(st.macchina));
      sfx.ok(); fx.burst(stage.w / 2, stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    const [l1, l2] = autovaloriSimmetrica(M);
    const righe = [
      t('Con il righello a <b>:g°</b> la stessa macchina si scrive con i numeri qui a destra. Fuori dalla diagonale c\'è <b>:f</b>: è quanto la macchina «mescola» le due direzioni.',
        { g: st.gradi, f: storto.toFixed(3) }),
    ];
    if (storto < 0.03) {
      righe.push('<span class="ok">' + t('Trovata. In questa base la macchina non mescola più niente: <b>allunga la prima direzione di :a e la seconda di :b</b>, e basta. Quei due numeri sono gli <b>autovalori</b>, e quelle due direzioni gli <b>autovettori</b> del livello :n.',
        { a: l1.toFixed(3), b: l2.toFixed(3), n: nOf('18b-autovettori') }) + '</span>');
      righe.push('<span class="a">' + t('E adesso il regalo: in questa base applicare la macchina <b>mille volte</b> vuol dire elevare due numeri alla millesima. Fuori da questa base vorrebbe dire moltiplicare mille matrici. È la scorciatoia su cui è costruita la stima di fase.') + '</span>');
    } else {
      righe.push('<span class="a">' + t('Gira il righello: c\'è un\'inclinazione in cui i due numeri fuori diagonale diventano zero. Le frecce verde e rosa te lo dicono — quando escono dritte invece che storte, ci sei.'));
    }
    out.set(righe.join('\n'));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Perché questa è la cosa più utile del livello.</b> Una matrice generica è difficile da capire: mescola tutto con tutto. Ma se esiste una base in cui diventa diagonale, in quella base è solo «moltiplica per un numero, ciascuno per conto suo». Elevare a potenza, calcolare e^(matrice), applicare mille volte: tutto diventa un conto su singoli numeri. Al livello :n hai trovato gli autovettori; qui hai visto <b>a che servono</b>.', { n: nOf('18b-autovettori') }));
  return { state: st };
}

/* riesportati per i test: la verifica che tutto questo valga anche
   per le matrici vere del corso, non solo per quelle del gioco */
export { applica, prodotto, aggiunta, determinante, traccia, unitaria };
