/* ============================================================
   PARTE 0 — LE EQUAZIONI DI SECONDO GRADO
   La formula non si impara: si costruisce, con un quadrato.

   Perché nel corso servono:

   · il polinomio caratteristico di una matrice 2×2 è un'equazione di
     secondo grado (λ² − traccia·λ + determinante = 0). Gli autovalori del
     livello 18·b sono le sue soluzioni, e il DELTA dice se sono numeri veri
     o fasi complesse: la rotazione che «non ha direzioni ferme» è
     esattamente il caso delta < 0;

   · e c'è la storia più bella della matematica: i numeri immaginari non
     nascono qui, nascono dalle equazioni di TERZO grado, dove per arrivare
     a soluzioni reali bisognava passare per la radice di un numero
     negativo. Cioè: i numeri complessi sono nati come scorciatoia forzata,
     non come capriccio — e trecento anni dopo si sono rivelati il
     linguaggio della meccanica quantistica.

   Il primo gioco fa vedere che cosa SONO le soluzioni (dove la parabola
   taglia l'asse); il secondo costruisce la formula risolutiva con il metodo
   di al-Khwārizmī, che era letteralmente un disegno: un quadrato a cui
   manca un angolo.
   ============================================================ */

import { Stage, COL, bg, grid, dot, text, roundRect, plot, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud, nearSound } from './basicmath.js';

/* ------------------------------------------------------------
   LOGICA PURA
   ------------------------------------------------------------ */

/** Il delta (discriminante): dice quante soluzioni ci sono. */
export const delta = (a, b, c) => b * b - 4 * a * c;

/** Le soluzioni reali: due, una, oppure nessuna. */
export function radici(a, b, c) {
  if (Math.abs(a) < 1e-12) return Math.abs(b) < 1e-12 ? [] : [-c / b];
  const d = delta(a, b, c);
  if (d < -1e-12) return [];
  if (Math.abs(d) < 1e-12) return [-b / (2 * a)];
  const r = Math.sqrt(d);
  return [(-b - r) / (2 * a), (-b + r) / (2 * a)].sort((x, y) => x - y);
}

/** Il vertice della parabola: sta sempre a metà fra le due radici. */
export const vertice = (a, b, c) => {
  const x = -b / (2 * a);
  return { x, y: a * x * x + b * x + c };
};

/**
 * Il completamento del quadrato, passo per passo, per x² + bx = c.
 *
 * È il metodo con cui le equazioni di secondo grado si risolvevano prima che
 * esistesse la formula — e da cui la formula si ricava. Ogni passo è una
 * mossa da bilancia (livello 0·7): si fa su tutti e due i piatti.
 */
export function completamento(b, c) {
  const meta = b / 2;
  const pezzo = meta * meta;
  const dopo = c + pezzo;
  const radice = dopo >= 0 ? Math.sqrt(dopo) : null;
  /* Se il quadrato completo ha area zero il lato è zero: la soluzione è UNA,
     non due uguali — altrimenti il gioco direbbe «due soluzioni» dove la
     parabola tocca la riga in un punto solo. */
  const soluzioni = radice === null ? []
    : radice < 1e-12 ? [-meta]
      : [-meta - radice, -meta + radice];
  return { meta, pezzo, dopo, radice, soluzioni, x: soluzioni.length ? soluzioni[soluzioni.length - 1] : null };
}

/* Le sfide del primo gioco: tre situazioni, tre delta diversi. */
export const SFIDE_P = [
  { id: 'due', nome: () => t('fai tagliare la parabola in DUE punti'), ok: (a, b, c) => radici(a, b, c).length === 2 && delta(a, b, c) > 0.5 },
  { id: 'una', nome: () => t('falla toccare l\'asse in UN punto solo'), ok: (a, b, c) => Math.abs(delta(a, b, c)) < 0.15 },
  { id: 'zero', nome: () => t('fai in modo che non lo tocchi MAI'), ok: (a, b, c) => delta(a, b, c) < -0.5 },
];

/* Le equazioni del secondo gioco: x² + bx = c, con numeri che vengono bene. */
export const QUADRATI = [
  { b: 6, c: 16 },    // x² + 6x = 16 → x = 2
  { b: 10, c: 39 },   // x² + 10x = 39 → x = 3  (è l'esempio di al-Khwārizmī)
  { b: 4, c: 21 },    // x² + 4x = 21 → x = 3
];

/* ------------------------------------------------------------
   1) LA PARABOLA: le soluzioni sono dove taglia l'asse
   ------------------------------------------------------------ */
export function parabolaLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('La parabola e le sue radici'),
    subtitle: t('muovi i tre numeri: le soluzioni sono i punti dove la curva taglia la riga'),
  });

  const st = { a: 1, b: 0, c: -2, sfida: 0, fatte: new Set(), vinto: false };
  const near = nearSound();
  const XMIN = -5, XMAX = 5, YMIN = -6, YMAX = 6;

  const stage = new Stage(w.body, {
    height: 330,
    draw(ctx, s) {
      bg(ctx, s);
      const d = delta(st.a, st.b, st.c);
      const r = radici(st.a, st.b, st.c);
      const sf = SFIDE_P[st.sfida];
      const fatta = sf.ok(st.a, st.b, st.c);
      const top = hud(ctx, s, {
        goal: sf.nome(),
        closeness: fatta ? 1 : 1 - Math.min(1, Math.abs(d) / 12),
        hit: fatta,
        sub: t('situazioni trovate: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const inizio = top + 14;
      const rect = { x: 26, y: inizio, w: s.w - 52, h: s.h - inizio - 34 };
      grid(ctx, rect.x, rect.y, rect.w, rect.h, rect.w / 10, rect.h / 12);
      const X = x => rect.x + ((x - XMIN) / (XMAX - XMIN)) * rect.w;
      const Y = y => rect.y + rect.h - ((y - YMIN) / (YMAX - YMIN)) * rect.h;
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(rect.x, Y(0)); ctx.lineTo(rect.x + rect.w, Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(0), rect.y); ctx.lineTo(X(0), rect.y + rect.h); ctx.stroke();

      ctx.save();
      ctx.beginPath(); ctx.rect(rect.x, rect.y, rect.w, rect.h); ctx.clip();
      plot(ctx, rect, u => {
        const x = XMIN + u * (XMAX - XMIN);
        return st.a * x * x + st.b * x + st.c;
      }, { color: d > 0 ? COL.cyan : d < 0 ? COL.pink : COL.amber, yMin: YMIN, yMax: YMAX, width: 2.6 });
      ctx.restore();

      // le radici, cioè i punti dove la curva incontra la riga
      for (const x of r) {
        dot(ctx, X(x), Y(0), 7, COL.green);
        text(ctx, x.toFixed(2), X(x), Y(0) + 20, { size: 11, align: 'center', color: COL.green, max: 90 });
      }
      const v = vertice(st.a, st.b, st.c);
      dot(ctx, X(v.x), Y(v.y), 4, COL.violet, false);

      text(ctx, t('delta = b² − 4ac = :d', { d: d.toFixed(2) }), 26, s.h - 12,
        { size: 13, color: d > 0 ? COL.cyan : d < 0 ? COL.pink : COL.amber, max: s.w - 52 });
      text(ctx, r.length === 2 ? t('due soluzioni') : r.length === 1 ? t('una soluzione sola') : t('nessuna soluzione reale'),
        s.w - 26, s.h - 12, { size: 12, align: 'right', color: COL.txt, max: s.w / 2 - 26 });
      st.px = X(v.x); st.py = Y(v.y);
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sa = slider({ label: 'a', min: -2, max: 2, step: 0.1, value: st.a, fmt: v => v.toFixed(1), oninput: v => { st.a = Math.abs(v) < 0.1 ? 0.1 : v; upd(); } });
  const sb = slider({ label: 'b', min: -6, max: 6, step: 0.5, value: st.b, fmt: v => v.toFixed(1), oninput: v => { st.b = v; upd(); } });
  const sc = slider({ label: 'c', min: -6, max: 6, step: 0.5, value: st.c, fmt: v => v.toFixed(1), oninput: v => { st.c = v; upd(); } });
  w.body.appendChild(controls(sa.root, sb.root, sc.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🎯 ' + t('altra situazione'), class: 'sm primary', onclick: () => { st.sfida = (st.sfida + 1) % SFIDE_P.length; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const d = delta(st.a, st.b, st.c);
    const r = radici(st.a, st.b, st.c);
    const sf = SFIDE_P[st.sfida];
    const fatta = sf.ok(st.a, st.b, st.c);
    if (fatta && !st.fatte.has(sf.id)) {
      st.fatte.add(sf.id);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else if (!fatta) {
      near(1 - Math.min(1, Math.abs(d) / 12));
    }
    out.set(
      t('Equazione: <b>:a x² + :b x + :c = 0</b>.', { a: st.a.toFixed(1), b: st.b.toFixed(1), c: st.c.toFixed(1) }) + '\n' +
      t('delta = :b² − 4·:a·:c = <b>:d</b>', { a: st.a.toFixed(1), b: st.b.toFixed(1), c: st.c.toFixed(1), d: d.toFixed(2) }) + '\n' +
      (r.length === 2
        ? '<span class="g">' + t('Due soluzioni: x = :x1 e x = :x2. La curva taglia la riga in due punti.', { x1: r[0].toFixed(2), x2: r[1].toFixed(2) }) + '</span>'
        : r.length === 1
          ? '<span class="a">' + t('Una soluzione sola: x = :x. La curva <b>tocca</b> la riga senza attraversarla — il delta è zero.', { x: r[0].toFixed(2) }) + '</span>'
          : '<span class="p">' + t('Nessuna soluzione reale: la curva sta tutta da una parte. Il delta è negativo, e la radice di un numero negativo non è un numero della retta.') + '</span>'));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Il delta in tre parole:</b> è quello che sta sotto la radice, e dice <b>quante volte</b> la parabola incontra la riga: due volte se è positivo, una se è zero, mai se è negativo. Quel «mai» non è un vicolo cieco: è la porta da cui, nel Cinquecento, sono entrati i numeri immaginari.'));
  return { state: st };
}

/* ------------------------------------------------------------
   2) IL QUADRATO A CUI MANCA UN ANGOLO
   Il metodo di al-Khwārizmī: si disegna il quadrato, si vede il
   pezzo che manca, lo si aggiunge a tutti e due i piatti. Da qui
   esce la formula risolutiva — non calata dall'alto, costruita.
   ------------------------------------------------------------ */
export function quadratoLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('Il quadrato a cui manca un angolo'),
    subtitle: t('il metodo di mille anni fa: completa il disegno e la soluzione compare'),
  });

  const st = { i: 0, passo: 0, risolte: new Set(), vinto: false };
  const eq = () => QUADRATI[st.i];

  const stage = new Stage(w.body, {
    height: 330,
    draw(ctx, s) {
      bg(ctx, s);
      const { b, c } = eq();
      const co = completamento(b, c);
      const x = co.x ?? 0;
      const finito = st.passo >= 3;
      const top = hud(ctx, s, {
        goal: t('completa il quadrato'),
        closeness: st.passo / 3,
        hit: finito,
        sub: t('equazioni risolte col disegno: :fatte su :totali', { fatte: st.risolte.size, totali: cfg.need }),
      });

      /* Il disegno: un quadrato x·x, due rettangoli (b/2)·x appoggiati ai due
         lati, e l'angolo mancante (b/2)². Le aree sono in scala. */
      const lato = Math.max(1, x), mezzo = co.meta;
      const totale = lato + mezzo;
      /* Su schermo stretto la colonna dei conti non ci sta accanto al disegno:
         allora il disegno si prende tutta la larghezza e i conti restano nel
         riquadro di testo sotto la tela, dove si leggono meglio comunque. */
      const stretto = s.w < 560;
      const disp = Math.min(s.w - (stretto ? 44 : 200), s.h - top - 60);
      const k = disp / totale;
      /* Il blocco «disegno + conti» sta al centro: su schermo largo la tela è
         molto più larga di quanto serva, e tutto appiccicato a sinistra
         sembrerebbe un errore di impaginazione. */
      const colonna = stretto ? 0 : 220;
      const blocco = totale * k + (colonna ? 22 + colonna : 0);
      const x0 = Math.max(24, Math.round((s.w - blocco) / 2)), y0 = top + 18;

      roundRect(ctx, x0, y0, lato * k, lato * k, 3,
        { fill: 'rgba(34,211,238,.25)', stroke: COL.cyan, width: 2 });
      text(ctx, 'x²', x0 + lato * k / 2, y0 + lato * k / 2, { size: 15, align: 'center', color: COL.cyan });

      if (st.passo >= 1) {
        roundRect(ctx, x0 + lato * k, y0, mezzo * k, lato * k, 3,
          { fill: 'rgba(251,191,36,.22)', stroke: COL.amber });
        roundRect(ctx, x0, y0 + lato * k, lato * k, mezzo * k, 3,
          { fill: 'rgba(251,191,36,.22)', stroke: COL.amber });
        if (mezzo * k > 22) {
          text(ctx, `${mezzo}x`, x0 + lato * k + mezzo * k / 2, y0 + lato * k / 2, { size: 12, align: 'center', color: COL.amber, max: mezzo * k - 4 });
          text(ctx, `${mezzo}x`, x0 + lato * k / 2, y0 + lato * k + mezzo * k / 2, { size: 12, align: 'center', color: COL.amber, max: lato * k - 4 });
        }
      }
      if (st.passo >= 2) {
        roundRect(ctx, x0 + lato * k, y0 + lato * k, mezzo * k, mezzo * k, 3,
          { fill: 'rgba(52,211,153,.3)', stroke: COL.green, width: 2 });
        if (mezzo * k > 26) text(ctx, String(co.pezzo), x0 + lato * k + mezzo * k / 2, y0 + lato * k + mezzo * k / 2, { size: 12, align: 'center', color: COL.green, max: mezzo * k - 4 });
      }
      if (st.passo >= 3) {
        ctx.strokeStyle = COL.green; ctx.lineWidth = 2.5; ctx.setLineDash([6, 4]);
        ctx.strokeRect(x0, y0, totale * k, totale * k);
        ctx.setLineDash([]);
        text(ctx, t('lato = x + :m = :r', { m: mezzo, r: co.radice }), x0 + totale * k / 2, y0 + totale * k + 16,
          { size: 12.5, align: 'center', color: COL.green, max: totale * k + 60 });
      }

      // la riga dei conti, a destra
      const bx = x0 + totale * k + 22, maxCol = s.w - bx - 12;
      if (maxCol > 90) {
        const righe = [
          `x² + ${b}x = ${c}`,
          st.passo >= 1 ? t('metà di :b è :m', { b, m: mezzo }) : '',
          st.passo >= 2 ? `x² + ${b}x + ${co.pezzo} = ${c} + ${co.pezzo}` : '',
          st.passo >= 3 ? `(x + ${mezzo})² = ${co.dopo}` : '',
          st.passo >= 3 ? `x + ${mezzo} = ${co.radice}` : '',
          st.passo >= 3 ? `x = ${co.x}` : '',
        ];
        righe.forEach((r, i) => r && text(ctx, r, bx, top + 24 + i * 22, { size: 12, color: i === 5 ? COL.green : COL.txt, max: maxCol }));
      }
      st.px = x0 + totale * k / 2; st.py = y0 + totale * k / 2;
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const se = choice({
    label: t("L'equazione"),
    items: QUADRATI.map((q, i) => ({ label: `x² + ${q.b}x = ${q.c}`, value: i })),
    value: 0,
    onchange: i => { st.i = i; st.passo = 0; upd(); },
  });
  w.body.appendChild(controls(se.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '➕ ' + t('spezza in due il rettangolo'), onclick: () => { st.passo = Math.max(st.passo, 1); sfx.click(); upd(); } },
    { label: '🟩 ' + t("aggiungi l'angolo mancante"), onclick: () => { if (st.passo >= 1) { st.passo = Math.max(st.passo, 2); sfx.click(); } upd(); } },
    { label: '√ ' + t('prendi la radice'), class: 'sm primary', onclick: () => { if (st.passo >= 2) { st.passo = 3; sfx.ok(); } upd(); } },
    { label: '↺ ' + t('ricomincia'), onclick: () => { st.passo = 0; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const { b, c } = eq();
    const co = completamento(b, c);
    const finito = st.passo >= 3;
    if (finito && !st.risolte.has(`${b}/${c}`)) {
      st.risolte.add(`${b}/${c}`);
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.risolte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    const messaggi = [
      t('Parti da <b>x² + :b x = :c</b>. Il disegno è un quadrato di lato x, e :b x da sistemare intorno.', { b, c }),
      t('I :b nani si mettono in <b>due file uguali da :m</b>, una a destra e una sotto: due rettangoli da :m x. Adesso il disegno è quasi un quadrato grande — ma manca l\'angolo.', { b, m: co.meta }),
      t('L\'angolo che manca è un quadratino <b>:m × :m = :p</b>: la mattonella che avanza. La aggiungi — ma allora, regola della bilancia, la devi aggiungere anche <b>all\'altro piatto</b>: :c + :p = :d.', { m: co.meta, p: co.pezzo, c, d: co.dopo }),
      t('Adesso a sinistra c\'è un quadrato perfetto di lato (x + :m), e vale :d. Quindi <b>x + :m = :r</b>, cioè <b>x = :x</b>.', { m: co.meta, d: co.dopo, r: co.radice, x: co.x }),
    ];
    out.set(messaggi[Math.min(st.passo, 3)] +
      (finito
        ? '\n<span class="g">✓ ' + t('E questa è la formula risolutiva, costruita invece che imparata: la radice, la metà di b, la sottrazione.') + '</span>' +
          /* la catena dei conti sta anche qui, perché sul telefono la colonna
             a fianco del disegno non c'è: sono numeri, non serve tradurli */
          `\n<span class="mono">x² + ${b}x = ${c} → (x + ${co.meta})² = ${co.dopo} → x + ${co.meta} = ${co.radice} → x = ${co.x}</span>`
        : ''));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Questo disegno ha 1200 anni.</b> È il metodo con cui al-Khwārizmī risolveva «un quadrato e dieci radici uguali a trentanove» — cioè x² + 10x = 39, la seconda equazione qui sopra. Non aveva la formula: aveva il disegno. La formula che si impara a scuola è questo disegno scritto con le lettere, e il pezzo sotto la radice è l\'angolo mancante. Nel livello :n ritroverai lo stesso conto sotto un altro nome: il polinomio degli autovalori.', { n: nOf('18b-autovettori') }));
  return { state: st };
}
