/* ============================================================
   PARTE 0 — QUANTO DUE FRECCE SI SOMIGLIANO
   Prodotto scalare, lunghezze, distanze — e la misura quantistica
   che è, letteralmente, un'ombra.

   Perché serve, e perché prima del qubit:

   · «⟨ψ|φ⟩» è il simbolo più frequente di tutta la letteratura quantistica,
     e non è altro che il prodotto scalare di due frecce: un numero solo, che
     dice quanto le due vanno nella stessa direzione;

   · «|0⟩ e |1⟩ sono ortogonali» è la ragione per cui sono distinguibili con
     certezza. Ortogonali vuol dire prodotto scalare ZERO, cioè «non si
     somigliano per niente»: e questo si vede muovendo due frecce;

   · l'ampiezza di un risultato è la <b>proiezione</b> dello stato sulla
     direzione di quel risultato — l'ombra, esattamente come nel livello del
     seno e del coseno. La probabilità è quell'ombra al quadrato, e la somma
     dei due quadrati fa 1 per il teorema di Pitagora. La regola di Born, in
     una figura.

   Le frecce qui restano REALI: bastano a costruire tutta l'idea, e i numeri
   complessi arriveranno con le fasi senza dover rifare niente.
   ============================================================ */

import { Stage, COL, bg, grid, dot, text, roundRect, arrow, circle, makePlane, FX } from '../core/canvas.js';
import { widget, controls, buttons, readout, choice, h, TAU } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud, nearSound } from './basicmath.js';

/* ------------------------------------------------------------
   LOGICA PURA
   ------------------------------------------------------------ */

/** Il prodotto scalare: si moltiplicano le coordinate a due a due e si somma. */
export const scalare = (a, b) => a[0] * b[0] + a[1] * b[1];

/** La lunghezza di una freccia. È la radice del prodotto scalare con sé stessa. */
export const lunghezza = v => Math.sqrt(scalare(v, v));

/** La distanza fra due frecce: la lunghezza della differenza. */
export const distanza = (a, b) => lunghezza([a[0] - b[0], a[1] - b[1]]);

/** L'angolo fra due frecce, in gradi. Serve solo a scriverlo: il gioco usa il prodotto. */
export function angoloFra(a, b) {
  const l = lunghezza(a) * lunghezza(b);
  if (l < 1e-12) return 0;
  return Math.acos(Math.max(-1, Math.min(1, scalare(a, b) / l))) * 180 / Math.PI;
}

/**
 * L'ombra di v sulla direzione dir (che deve essere lunga 1): quanto di v va
 * in quella direzione. È la stessa ombra del livello del seno e del coseno, e
 * nel quantistico si chiama ampiezza.
 */
export const proiezione = (v, dir) => scalare(v, dir);

/** Una base di misura: due direzioni perpendicolari, ruotate insieme. */
export const baseDi = gradi => {
  const a = gradi * Math.PI / 180;
  return [[Math.cos(a), Math.sin(a)], [-Math.sin(a), Math.cos(a)]];
};

/* Le sfide del primo gioco: tre modi di stare, tre numeri diversi. */
export const SFIDE_S = [
  { id: 'zero', nome: () => t('fai venire il prodotto ZERO'), ok: p => Math.abs(p) < 0.06 },
  { id: 'max', nome: () => t('fallo più grande che puoi'), ok: (p, a, b) => p > lunghezza(a) * lunghezza(b) - 0.06 },
  { id: 'neg', nome: () => t('fallo diventare negativo'), ok: p => p < -0.5 },
];

/* ------------------------------------------------------------
   1) DUE FRECCE E UN NUMERO SOLO
   Si trascinano le punte; il numero in basso dice quanto le due
   frecce vanno d'accordo. Zero = perpendicolari.
   ------------------------------------------------------------ */
export function scalareLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('Quanto due frecce vanno d\'accordo'),
    subtitle: t('trascina le punte: un numero solo dice quanto puntano nella stessa direzione'),
  });

  const st = { a: [1.4, 0.4], b: [0.6, 1.2], sfida: 0, fatte: new Set(), vinto: false, tira: null };
  const near = nearSound();

  const stage = new Stage(w.body, {
    height: 330,
    onPointer(e) {
      const P = st.P;
      if (!P) return;
      if (e.type === 'up') { st.tira = null; return; }
      const p = P.inv(e.x, e.y);
      if (e.type === 'down') {
        const da = Math.hypot(p.x - st.a[0], p.y - st.a[1]);
        const db = Math.hypot(p.x - st.b[0], p.y - st.b[1]);
        st.tira = da < db ? 'a' : 'b';
      }
      if (!st.tira) return;
      const v = [Math.max(-2.4, Math.min(2.4, p.x)), Math.max(-2.4, Math.min(2.4, p.y))];
      if (lunghezza(v) > 0.25) st[st.tira] = v;
      upd();
    },
    draw(ctx, s) {
      bg(ctx, s);
      const p = scalare(st.a, st.b);
      const sf = SFIDE_S[st.sfida];
      const fatta = sf.ok(p, st.a, st.b);
      const top = hud(ctx, s, {
        goal: sf.nome(),
        closeness: sf.id === 'zero' ? 1 - Math.min(1, Math.abs(p) / 2)
          : sf.id === 'max' ? Math.max(0, p) / Math.max(1e-9, lunghezza(st.a) * lunghezza(st.b))
            : Math.max(0, -p) / 2,
        hit: fatta,
        sub: t('sfide riuscite: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const inizio = top + 14;
      const alto = s.h - inizio - 34;
      const scala = Math.min((s.w - 40) / 5.4, alto / 5);
      const P = makePlane(s.w / 2, inizio + alto / 2, scala);
      st.P = P;
      grid(ctx, 0, inizio, s.w, alto + 34, scala, scala);
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, P.cy); ctx.lineTo(s.w, P.cy);
      ctx.moveTo(P.cx, inizio); ctx.lineTo(P.cx, s.h);
      ctx.stroke();

      /* L'ombra di a sulla direzione di b: è il prodotto scalare fatto vedere.
         Quando è nulla, le due frecce sono perpendicolari e l'ombra sparisce. */
      const lb = lunghezza(st.b) || 1;
      const dir = [st.b[0] / lb, st.b[1] / lb];
      const om = proiezione(st.a, dir);
      ctx.strokeStyle = 'rgba(148,163,184,.5)'; ctx.lineWidth = 1.4; ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(P.X(st.a[0]), P.Y(st.a[1]));
      ctx.lineTo(P.X(om * dir[0]), P.Y(om * dir[1]));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = fatta ? COL.green : COL.amber; ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(P.cx, P.cy);
      ctx.lineTo(P.X(om * dir[0]), P.Y(om * dir[1]));
      ctx.stroke();

      arrow(ctx, P.cx, P.cy, P.X(st.a[0]), P.Y(st.a[1]), { color: COL.cyan, width: 3 });
      arrow(ctx, P.cx, P.cy, P.X(st.b[0]), P.Y(st.b[1]), { color: COL.violet, width: 3 });
      dot(ctx, P.X(st.a[0]), P.Y(st.a[1]), 7, COL.cyan);
      dot(ctx, P.X(st.b[0]), P.Y(st.b[1]), 7, COL.violet);
      st.px = P.X(st.a[0]); st.py = P.Y(st.a[1]);

      text(ctx, t('prodotto scalare: :p', { p: p.toFixed(2) }), 14, s.h - 28,
        { size: 14, color: fatta ? COL.green : COL.amber, max: s.w - 28 });
      text(ctx, t('angolo fra le due: :g°  ·  ombra: :om', { g: angoloFra(st.a, st.b).toFixed(0), om: om.toFixed(2) }),
        14, s.h - 10, { size: 11, color: '#8fa0c4', max: s.w - 28 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🎯 ' + t('altra sfida'), class: 'sm primary', onclick: () => { st.sfida = (st.sfida + 1) % SFIDE_S.length; upd(); } },
    { label: '⟂ ' + t('mettile perpendicolari'), onclick: () => { const l = lunghezza(st.a); st.b = [-st.a[1], st.a[0]].map(x => x * (lunghezza(st.b) / l)); upd(); } },
    { label: '↺ ' + t('rimettile come erano'), onclick: () => { st.a = [1.4, 0.4]; st.b = [0.6, 1.2]; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const p = scalare(st.a, st.b);
    const sf = SFIDE_S[st.sfida];
    const fatta = sf.ok(p, st.a, st.b);
    if (fatta && !st.fatte.has(sf.id)) {
      st.fatte.add(sf.id);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    const la = lunghezza(st.a), lb = lunghezza(st.b);
    out.set(
      t('Freccia azzurra (:ax · :ay), lunga :la. Freccia viola (:bx · :by), lunga :lb.',
        { ax: st.a[0].toFixed(2), ay: st.a[1].toFixed(2), la: la.toFixed(2), bx: st.b[0].toFixed(2), by: st.b[1].toFixed(2), lb: lb.toFixed(2) }) + '\n' +
      `${st.a[0].toFixed(2)}·${st.b[0].toFixed(2)} + ${st.a[1].toFixed(2)}·${st.b[1].toFixed(2)} = ${p.toFixed(2)}` + '\n' +
      t('Stesso numero anche così: :la × :lb × cos(:g°) = :p — le due formule sono la stessa cosa.',
        { la: la.toFixed(2), lb: lb.toFixed(2), g: angoloFra(st.a, st.b).toFixed(0), p: (la * lb * Math.cos(angoloFra(st.a, st.b) * Math.PI / 180)).toFixed(2) }) + '\n' +
      (Math.abs(p) < 0.06
        ? '<span class="g">' + t('Zero: le due frecce sono <b>perpendicolari</b>. Non si somigliano per niente — nel quantistico è la condizione che rende due stati distinguibili con certezza.') + '</span>'
        : p > 0
          ? t('Positivo: puntano <b>più o meno dalla stessa parte</b>.')
          : t('Negativo: puntano <b>in versi opposti</b>.')));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Le due formule sono una sola.</b> «Moltiplica le coordinate e somma» e «lunghezza × lunghezza × coseno dell\'angolo» danno sempre lo stesso numero: la prima si calcola, la seconda si capisce. E il caso che conta è quello di mezzo: <b>prodotto zero = perpendicolari</b>.'));
  return { state: st };
}

/* ------------------------------------------------------------
   2) LA MISURA È UN'OMBRA
   Uno stato lungo 1, una base di misura che si può girare, e le
   due ombre: sono le ampiezze, e i loro quadrati fanno sempre 1.
   ------------------------------------------------------------ */
export function ombraLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('La misura è un\'ombra'),
    subtitle: t('gira la base e guarda le due ombre: sono le ampiezze'),
    modo: 'quantistico',
  });

  /* Le tre configurazioni da centrare: certezza su un risultato, certezza
     sull'altro, e il perfetto cinquanta e cinquanta. */
  const SFIDE = [
    { id: 'certo0', nome: () => t('rendi il primo risultato certo (100%)'), ok: p => p[0] > 0.995 },
    { id: 'certo1', nome: () => t('rendi certo il secondo risultato'), ok: p => p[1] > 0.995 },
    { id: 'meta', nome: () => t('portalo a metà e metà'), ok: p => Math.abs(p[0] - 0.5) < 0.01 },
  ];

  const st = { statoG: 35, baseG: 0, sfida: 0, fatte: new Set(), vinto: false };
  const near = nearSound();
  const stato = () => [Math.cos(st.statoG * Math.PI / 180), Math.sin(st.statoG * Math.PI / 180)];
  const probabilita = () => {
    const [d0, d1] = baseDi(st.baseG), v = stato();
    const a0 = proiezione(v, d0), a1 = proiezione(v, d1);
    return [a0 * a0, a1 * a1, a0, a1];
  };

  const stage = new Stage(w.body, {
    height: 340,
    onPointer(e) {
      if (e.type !== 'down' && !(e.type === 'move' && e.down)) return;
      const P = st.P;
      if (!P) return;
      const p = P.inv(e.x, e.y);
      if (Math.hypot(p.x, p.y) < 0.1) return;
      st.statoG = Math.atan2(p.y, p.x) * 180 / Math.PI;
      upd();
    },
    draw(ctx, s) {
      bg(ctx, s);
      const [p0, p1, a0, a1] = probabilita();
      const sf = SFIDE[st.sfida];
      const fatta = sf.ok([p0, p1]);
      const top = hud(ctx, s, {
        goal: sf.nome(),
        closeness: sf.id === 'meta' ? 1 - Math.min(1, Math.abs(p0 - 0.5) * 3) : Math.max(p0, p1),
        hit: fatta,
        sub: t('configurazioni centrate: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const inizio = top + 14;
      const alto = s.h - inizio - 30;
      const colonna = Math.min(170, s.w * 0.4);
      const sinistra = s.w - colonna - 24;
      const scala = Math.min(sinistra / 2.7, alto / 2.5);
      const P = makePlane(12 + sinistra / 2, inizio + alto / 2, scala);
      st.P = P;

      circle(ctx, P.cx, P.cy, scala, { stroke: '#2a3a5c', dash: [4, 5] });
      const [d0, d1] = baseDi(st.baseG);
      // la base di misura: due direzioni perpendicolari, lunghe quanto il cerchio
      for (const [d, col, et] of [[d0, COL.amber, '0'], [d1, COL.pink, '1']]) {
        ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.moveTo(P.X(-d[0] * 1.25), P.Y(-d[1] * 1.25));
        ctx.lineTo(P.X(d[0] * 1.25), P.Y(d[1] * 1.25));
        ctx.stroke();
        ctx.globalAlpha = 1;
        text(ctx, et, P.X(d[0] * 1.36), P.Y(d[1] * 1.36), { size: 12, align: 'center', color: col });
      }

      const v = stato();
      // le due ombre, disegnate spesse sulle due direzioni
      for (const [d, a, col] of [[d0, a0, COL.amber], [d1, a1, COL.pink]]) {
        ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.globalAlpha = 0.75;
        ctx.beginPath(); ctx.moveTo(P.cx, P.cy); ctx.lineTo(P.X(a * d[0]), P.Y(a * d[1])); ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(148,163,184,.45)'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.moveTo(P.X(v[0]), P.Y(v[1])); ctx.lineTo(P.X(a * d[0]), P.Y(a * d[1])); ctx.stroke();
        ctx.setLineDash([]);
      }
      arrow(ctx, P.cx, P.cy, P.X(v[0]), P.Y(v[1]), { color: fatta ? COL.green : COL.cyan, width: 3.2 });
      dot(ctx, P.X(v[0]), P.Y(v[1]), 6, fatta ? COL.green : COL.cyan);
      st.px = P.X(v[0]); st.py = P.Y(v[1]);

      const bx = s.w - colonna - 6, maxCol = s.w - bx - 8;
      text(ctx, t('ombra su 0: :a', { a: a0.toFixed(3) }), bx, inizio + 10, { size: 12, color: COL.amber, max: maxCol });
      text(ctx, t('al quadrato: :p%', { p: (p0 * 100).toFixed(1) }), bx, inizio + 28, { size: 12, color: COL.amber, max: maxCol });
      text(ctx, t('ombra su 1: :a', { a: a1.toFixed(3) }), bx, inizio + 54, { size: 12, color: COL.pink, max: maxCol });
      text(ctx, t('al quadrato: :p%', { p: (p1 * 100).toFixed(1) }), bx, inizio + 72, { size: 12, color: COL.pink, max: maxCol });
      text(ctx, t('somma: :tot%', { tot: ((p0 + p1) * 100).toFixed(1) }), bx, inizio + 100, { size: 12.5, color: COL.green, max: maxCol });
      text(ctx, t('sempre 100, comunque giri'), bx, inizio + 118, { size: 10.5, color: '#7f8fb3', max: maxCol, mono: false });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sb = choice({
    label: t('Come è girata la base di misura'),
    items: [0, 30, 45, 60, 90].map(v => ({ label: v + '°', value: v })),
    value: 0,
    onchange: v => { st.baseG = v; upd(); },
  });
  w.body.appendChild(controls(sb.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🎯 ' + t('altra configurazione'), class: 'sm primary', onclick: () => { st.sfida = (st.sfida + 1) % SFIDE.length; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const [p0, p1, a0, a1] = probabilita();
    const sf = SFIDE[st.sfida];
    const fatta = sf.ok([p0, p1]);
    if (fatta && !st.fatte.has(sf.id)) {
      st.fatte.add(sf.id);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else if (!fatta) {
      near(sf.id === 'meta' ? 1 - Math.min(1, Math.abs(p0 - 0.5) * 3) : Math.max(p0, p1));
    }
    out.set(
      t('Lo stato punta a <b>:g°</b>; la base di misura è girata di <b>:b°</b>.', { g: ((st.statoG % 360) + 360) % 360, b: st.baseG }) + '\n' +
      t('Ombre (le <b>ampiezze</b>): :a0 e :a1. Quadrati (le <b>probabilità</b>): :p0% e :p1%. Somma: <b>:tot%</b>.',
        { a0: a0.toFixed(3), a1: a1.toFixed(3), p0: (p0 * 100).toFixed(1), p1: (p1 * 100).toFixed(1), tot: ((p0 + p1) * 100).toFixed(1) }) + '\n' +
      (fatta
        ? '<span class="g">✓ ' + t('Centrato. Nota che la somma dei quadrati non si è mossa: è Pitagora, e nel quantistico si chiama «le probabilità fanno 100%».') + '</span>'
        : t('Trascina la freccia dello stato, oppure gira la base: le ombre cambiano, la loro somma di quadrati no.')));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Questa figura è la regola di Born.</b> L\'ampiezza di un risultato è l\'<b>ombra</b> dello stato sulla direzione di quel risultato — cioè il prodotto scalare — e la probabilità è quell\'ombra al quadrato. Le due direzioni sono perpendicolari, quindi vale Pitagora e i quadrati fanno sempre 1. Girare la base è cambiare <b>domanda</b>: è la base di misura del livello :n.', { n: nOf('02-bloch') }));
  return { state: st };
}
