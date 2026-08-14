/* ============================================================
   PARTE M — GONIOMETRIA: LE FORMULE DI ADDIZIONE

   Al livello 0·3 seno e coseno sono le due ombre di un punto che gira.
   Qui si aggiunge l'unica cosa che serve davvero saperci fare: che cosa
   succede quando si gira DUE VOLTE.

   Perché il corso ci passa:

   · due porte di rotazione una dopo l'altra fanno una rotazione sola, e
     gli angoli si sommano. Le formule di addizione sono esattamente il
     conto che lo dimostra — e si leggono riga per riga dal prodotto
     delle due matrici del livello 0·6;

   · l'identità fondamentale sin²+cos² = 1 è Pitagora sul cerchio di
     raggio 1, ed è la stessa riga che nel quantistico si chiama «le
     probabilità fanno 100%» (livello 0·9);

   · e la formula di DUPLICAZIONE è, letteralmente, il motore di Grover:
     ogni giro dell'algoritmo aggiunge 2θ all'angolo dello stato. Il
     «perché a un certo punto peggiora» del livello 11 è tutto lì.
   ============================================================ */

import { Stage, COL, bg, dot, text, roundRect, arrow, circle, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h, TAU } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud, nearSound } from './basicmath.js';

const RAD = g => (g * Math.PI) / 180;
const GRA = r => (r * 180) / Math.PI;

/* ------------------------------------------------------------
   LOGICA PURA
   ------------------------------------------------------------ */

/** L'identità fondamentale, calcolata invece che dichiarata. */
export const pitagora = gradi => Math.cos(RAD(gradi)) ** 2 + Math.sin(RAD(gradi)) ** 2;

/**
 * Le formule di addizione, calcolate nei due modi:
 * «con la formula» e «girando davvero di a+b». Devono coincidere sempre,
 * ed è questo il punto del primo gioco.
 */
export function addizione(a, b) {
  const ca = Math.cos(RAD(a)), sa = Math.sin(RAD(a));
  const cb = Math.cos(RAD(b)), sb = Math.sin(RAD(b));
  return {
    cosFormula: ca * cb - sa * sb,
    sinFormula: sa * cb + ca * sb,
    cosDiretto: Math.cos(RAD(a + b)),
    sinDiretto: Math.sin(RAD(a + b)),
  };
}

/** La duplicazione: il caso b = a delle formule di addizione. Niente di nuovo. */
export function duplicazione(a) {
  const c = Math.cos(RAD(a)), s = Math.sin(RAD(a));
  return { sin2: 2 * s * c, cos2: c * c - s * s, cosAlt: 1 - 2 * s * s };
}

/* Gli angoli notevoli, quelli che tornano in tutto il corso. */
export const NOTEVOLI = [0, 30, 45, 60, 90, 120, 135, 150, 180];

/* I bersagli del primo gioco: angoli che si ottengono sommandone due. */
export const BERSAGLI = [75, 105, 150, 210];

/* ------------------------------------------------------------
   GROVER COME ROTAZIONE
   Lo stato parte a un angolo θ dall'asse «risposte sbagliate» e ogni
   giro dell'algoritmo lo fa avanzare di 2θ. Sono le stesse formule.
   ------------------------------------------------------------ */

/** L'angolo di partenza: sin θ = √(M/N), con M risposte giuste su N. */
export const angoloDiGrover = (N, M = 1) => GRA(Math.asin(Math.sqrt(M / N)));

/** Dopo k giri lo stato sta a (2k+1)·θ. */
export const angoloDopo = (N, k, M = 1) => (2 * k + 1) * angoloDiGrover(N, M);

/** La probabilità di leggere la risposta giusta: il seno al quadrato. */
export const probabilitaDopo = (N, k, M = 1) => Math.sin(RAD(angoloDopo(N, k, M))) ** 2;

/** Il numero di giri che porta più vicino a 90°: π/4·√(N/M), arrotondato. */
export const giriOttimali = (N, M = 1) => Math.max(0, Math.round((Math.PI / 4) * Math.sqrt(N / M) - 0.5));

/* Le sfide del secondo gioco: elenchi di dimensioni diverse. */
export const ELENCHI = [
  { N: 4 }, { N: 16 }, { N: 64 }, { N: 256 },
];

/* ------------------------------------------------------------
   1) LA GIOSTRA — girare due volte è girare una volta sola
   ------------------------------------------------------------ */
export function giostraLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('La giostra: due giri fanno un giro solo'),
    subtitle: t('gira di a, poi di b: dove finisci? e che numeri ci sono dietro?'),
  });

  const st = { a: 30, b: 45, sfida: 0, fatte: new Set(), vinto: false };
  const near = nearSound();

  const stage = new Stage(w.body, {
    height: 340,
    draw(ctx, s) {
      bg(ctx, s);
      const bersaglio = BERSAGLI[st.sfida];
      const somma = st.a + st.b;
      const scarto = Math.abs(somma - bersaglio);
      const preso = scarto < 0.5;
      const top = hud(ctx, s, {
        goal: t('arriva esattamente a :b° sommando i due giri', { b: bersaglio }),
        closeness: 1 - Math.min(1, scarto / 90),
        hit: preso,
        sub: t('bersagli presi: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const zona = { y: top + 10, h: s.h - top - 44 };
      const R = Math.min(zona.h / 2 - 8, s.w / 2 - 120, 120);
      const cx = Math.max(R + 20, Math.min(s.w / 2, s.w - R - 150));
      const cy = zona.y + zona.h / 2;

      circle(ctx, cx, cy, R, { stroke: '#22304d', width: 1.4 });
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - R - 10, cy); ctx.lineTo(cx + R + 10, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - R - 10); ctx.lineTo(cx, cy + R + 10); ctx.stroke();

      const P = ang => [cx + R * Math.cos(RAD(ang)), cy - R * Math.sin(RAD(ang))];

      // il bersaglio
      const [bx, by] = P(bersaglio);
      dot(ctx, bx, by, 9, preso ? COL.green : '#2b6b52', false);
      text(ctx, `${bersaglio}°`, bx, by - 16, { size: 11, align: 'center', color: preso ? COL.green : COL.dim, max: 70 });

      // primo giro
      arrow(ctx, cx, cy, ...P(st.a), { color: COL.cyan, width: 2.4 });
      // secondo giro, che riparte da dove è arrivato il primo
      arrow(ctx, cx, cy, ...P(somma), { color: COL.violet, width: 2.8 });

      // le due ombre del punto finale: seno e coseno
      const [px, py] = P(somma);
      ctx.setLineDash([3, 3]); ctx.strokeStyle = COL.amber; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, py); ctx.stroke();
      ctx.setLineDash([]);
      dot(ctx, px, py, 5, COL.violet);

      // la colonna dei numeri, se c'è spazio
      const colx = cx + R + 18, maxCol = s.w - colx - 12;
      if (maxCol > 110) {
        const v = addizione(st.a, st.b);
        const righe = [
          [t('a = :a°', { a: st.a }), COL.cyan],
          [t('b = :b°', { b: st.b }), COL.violet],
          [t('a + b = :s°', { s: somma }), COL.txt],
          ['', null],
          [`cos = ${v.cosFormula.toFixed(3)}`, COL.amber],
          [`sin = ${v.sinFormula.toFixed(3)}`, COL.amber],
          [t('sin² + cos² = :p', { p: pitagora(somma).toFixed(3) }), COL.green],
        ];
        righe.forEach(([r, c], i) => r && text(ctx, r, colx, zona.y + 16 + i * 21, { size: 12, color: c, max: maxCol }));
      }

      text(ctx, t('il giro azzurro poi quello viola finiscono dove finisce un giro solo di :s°', { s: somma }),
        16, s.h - 12, { size: 11.5, color: COL.dim, max: s.w - 32 });
      st.px = px; st.py = py;
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sa = slider({ label: 'a°', min: 0, max: 180, step: 15, value: st.a, fmt: v => v + '°', oninput: v => { st.a = v; upd(); } });
  const sb = slider({ label: 'b°', min: 0, max: 180, step: 15, value: st.b, fmt: v => v + '°', oninput: v => { st.b = v; upd(); } });
  w.body.appendChild(controls(sa.root, sb.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🎯 ' + t('altro bersaglio'), class: 'sm primary', onclick: () => { st.sfida = (st.sfida + 1) % BERSAGLI.length; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const bersaglio = BERSAGLI[st.sfida];
    const somma = st.a + st.b;
    const preso = Math.abs(somma - bersaglio) < 0.5;
    const v = addizione(st.a, st.b);
    if (preso && !st.fatte.has(bersaglio)) {
      st.fatte.add(bersaglio);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else if (!preso) near(1 - Math.min(1, Math.abs(somma - bersaglio) / 90));
    out.set(
      t('Giro di <b>:a°</b>, poi di <b>:b°</b>: finisci a <b>:s°</b>.', { a: st.a, b: st.b, s: somma }) + '\n' +
      t('Con la formula: cos(a+b) = cos a · cos b − sin a · sin b = <b>:f</b>.', { f: v.cosFormula.toFixed(4) }) + '\n' +
      t('Girando davvero di :s°: cos = <b>:d</b>.', { s: somma, d: v.cosDiretto.toFixed(4) }) + '\n' +
      '<span class="g">' + t('Stesso numero. Non è una coincidenza: la formula dice soltanto che due giri sono un giro solo.') + '</span>');
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Da dove esce la formula.</b> Al livello :n hai visto che una rotazione è una matrice. Fare due rotazioni è <b>moltiplicare le due matrici</b>: svolgi il prodotto riga per colonna e nelle caselle compaiono, già scritte, cos a·cos b − sin a·sin b e sin a·cos b + cos a·sin b. Le formule di addizione non sono da imparare: sono il prodotto di due matrici letto ad alta voce.', { n: nOf('00-matrici') }));
  return { state: st };
}

/* ------------------------------------------------------------
   2) GROVER È UNA ROTAZIONE — e la duplicazione è il suo motore
   ------------------------------------------------------------ */
export function groverAngoloLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('Grover visto come un angolo che cresce'),
    subtitle: t('ogni giro aggiunge 2θ: arriva più vicino che puoi a 90°, e prova a superarlo'),
    modo: 'quantistico',
  });

  const st = { i: 1, k: 0, fatte: new Set(), vinto: false };
  const N = () => ELENCHI[st.i].N;

  const stage = new Stage(w.body, {
    height: 330,
    draw(ctx, s) {
      bg(ctx, s);
      const n = N();
      const theta = angoloDiGrover(n);
      const ang = angoloDopo(n, st.k);
      const p = probabilitaDopo(n, st.k);
      const ottimo = giriOttimali(n);
      const top = hud(ctx, s, {
        goal: t('porta la freccia il più vicino possibile a 90°'),
        closeness: p,
        hit: st.k === ottimo,
        sub: t('elenchi centrati: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const zona = { y: top + 10, h: s.h - top - 58 };
      const R = Math.min(zona.h - 20, s.w / 2 - 60, 180);
      /* Il disegno deve contenere anche gli angoli OLTRE i 90°: è lì che sta
         la lezione («continuare a girare peggiora»), e una freccia tagliata
         dal bordo la racconterebbe male. Da qui il margine a sinistra. */
      const OLTRE = 125;
      const margine = Math.ceil(R * Math.abs(Math.cos(RAD(OLTRE)))) + 14;
      const larghezzaBarra = Math.min(110, s.w - margine - R - 60);
      const blocco = margine + R + (larghezzaBarra > 44 ? 34 + larghezzaBarra : 0);
      const cx = Math.max(margine, Math.round((s.w - blocco) / 2) + margine);
      const cy = zona.y + zona.h - 10;

      // il quarto di giro: orizzontale = risposte sbagliate, verticale = giusta
      ctx.strokeStyle = '#22304d'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, 0); ctx.stroke();
      // e il pezzo oltre i 90°, marcato: è la zona in cui si peggiora
      ctx.strokeStyle = 'rgba(244,114,182,.35)'; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.arc(cx, cy, R, -RAD(OLTRE), -Math.PI / 2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R + 14, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - R - 14); ctx.stroke();
      text(ctx, t('sbagliate'), cx + R + 10, cy + 16, { size: 10.5, align: 'right', color: COL.dim, max: R });
      text(ctx, t('giusta'), cx + 6, cy - R - 18, { size: 10.5, color: COL.green, max: 120 });

      // la storia dei giri fatti, in trasparenza
      for (let j = 0; j <= st.k; j++) {
        const a = angoloDopo(n, j);
        const ax = cx + R * Math.cos(RAD(a)), ay = cy - R * Math.sin(RAD(a));
        if (j < st.k) {
          ctx.globalAlpha = 0.28;
          arrow(ctx, cx, cy, ax, ay, { color: COL.violet, width: 1.6 });
          ctx.globalAlpha = 1;
        }
      }
      const px = cx + R * Math.cos(RAD(ang)), py = cy - R * Math.sin(RAD(ang));
      arrow(ctx, cx, cy, px, py, { color: ang > 90 ? COL.pink : COL.violet, width: 3 });
      dot(ctx, px, py, 5, ang > 90 ? COL.pink : COL.violet);

      // la barra della probabilità
      const bx = cx + R + 34, bw = larghezzaBarra;
      if (bw > 50) {
        const bh = R;
        roundRect(ctx, bx, cy - bh, bw, bh, 6, { stroke: '#22304d' });
        roundRect(ctx, bx, cy - bh * p, bw, bh * p, 6, { fill: COL.green, alpha: .8 });
        text(ctx, `${(p * 100).toFixed(1)}%`, bx + bw / 2, cy - bh - 12, { size: 13, align: 'center', color: COL.green, max: bw + 20 });
        text(ctx, t('probabilità'), bx + bw / 2, cy + 16, { size: 10.5, align: 'center', color: COL.dim, max: bw + 20 });
      }

      text(ctx, t('θ = :t° · giri fatti: :k · angolo = (2·:k+1)·θ = :a°', { t: theta.toFixed(1), k: st.k, a: ang.toFixed(1) }),
        16, s.h - 30, { size: 12, color: COL.txt, max: s.w - 32 });
      text(ctx, ang > 90
        ? t('hai superato i 90°: da qui in poi la probabilità SCENDE')
        : t('il numero di giri che centra meglio è :o', { o: ottimo }),
      16, s.h - 12, { size: 11.5, color: ang > 90 ? COL.pink : COL.dim, max: s.w - 32 });
      st.px = px; st.py = py;
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const se = choice({
    label: t('Quante risposte in tutto'),
    items: ELENCHI.map((e, i) => ({ label: String(e.N), value: i })),
    value: 1,
    onchange: i => { st.i = i; st.k = 0; upd(); },
  });
  w.body.appendChild(controls(se.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🔁 ' + t('un giro di Grover'), class: 'sm primary', onclick: () => { st.k++; sfx.click(); upd(); } },
    { label: '↺ ' + t('ricomincia'), onclick: () => { st.k = 0; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const n = N();
    const theta = angoloDiGrover(n);
    const p = probabilitaDopo(n, st.k);
    const ottimo = giriOttimali(n);
    if (st.k === ottimo && !st.fatte.has(n)) {
      st.fatte.add(n);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    out.set(
      t('Su <b>:n</b> risposte, all\'inizio la freccia sta a θ = <b>:t°</b> dall\'asse delle sbagliate: sin θ = √(1/:n).', { n, t: theta.toFixed(2) }) + '\n' +
      t('Dopo <b>:k</b> giri l\'angolo è (2·:k+1)·θ = <b>:a°</b>, e la probabilità di leggere la risposta giusta è sin² di quell\'angolo = <b>:p%</b>.',
        { k: st.k, a: angoloDopo(n, st.k).toFixed(1), p: (p * 100).toFixed(1) }) + '\n' +
      (angoloDopo(n, st.k) > 90
        ? '<span class="p">' + t('Oltre i 90° la freccia si allontana di nuovo: continuare a girare PEGGIORA le cose. È il difetto che nessuna ricerca classica ha.') + '</span>'
        : st.k === ottimo
          ? '<span class="g">' + t('Questo è il punto migliore: :o giri, cioè circa π/4·√:n. Ecco da dove esce il √N di Grover.', { o: ottimo, n }) + '</span>'
          : '<span class="a">' + t('Ancora lontano dai 90°: prova un altro giro.') + '</span>'));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Perché 2θ e non θ.</b> Un giro di Grover fa due specchiate, e due specchiate di fila sono <b>una rotazione del doppio dell\'angolo fra i due specchi</b>. Quindi ogni giro somma 2θ — ed è la formula di duplicazione applicata al livello :n. Il √N non è una scelta: è il numero di volte che ci sta 2θ dentro 90°.', { n: nOf('11-grover') }));
  return { state: st };
}
