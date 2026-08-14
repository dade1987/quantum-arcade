/* ============================================================
   PARTE M — I NUMERI COMPLESSI PER BENE
   Forma polare, e^(iθ), e le radici dell'unità.

   Al livello 8 le frecce arrivano perché servono: il segno non basta.
   Qui si mette in ordine quello che si è già usato a mano, e si arriva
   ai due fatti su cui poggia tutta la seconda metà del corso:

   · MOLTIPLICARE DUE NUMERI COMPLESSI VUOL DIRE MOLTIPLICARE LE
     LUNGHEZZE E SOMMARE GLI ANGOLI. E non è una regola nuova: svolgendo
     il prodotto compaiono, riga per riga, le formule di addizione del
     livello M·2. Da qui la scrittura e^(iθ), perché l'unica operazione
     che trasforma somme di esponenti in prodotti è l'esponenziale;

   · LE RADICI n-ESIME DELL'UNITÀ sono n punti equidistanti sul cerchio,
     e la loro SOMMA FA ZERO. Quelle n frecce sono esattamente gli ω^(jk)
     della DFT (livello 16), e quello zero è l'interferenza distruttiva
     che cancella tutto tranne il picco.

   I due giochi: il primo fa vedere il prodotto nei due modi (coordinate
   e polare) e che danno lo stesso punto; il secondo costruisce il
   poligono delle radici e chiude la catena delle frecce sullo zero.
   ============================================================ */

import { Stage, COL, bg, dot, text, arrow, circle, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud, nearSound } from './basicmath.js';

/** Tre decimali, ma senza «−0.000»: uno zero con il segno confonde e basta. */
const tre = v => (Math.abs(v) < 5e-4 ? 0 : v).toFixed(3);
const due = v => (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);

const RAD = g => (g * Math.PI) / 180;
const GRA = r => ((r * 180) / Math.PI + 360) % 360;

/* ------------------------------------------------------------
   LOGICA PURA
   Un numero complesso è { re, im }. Niente librerie: il conto è corto
   e vederlo scritto è metà della lezione.
   ------------------------------------------------------------ */

/** Da coordinate a «quanto è lungo e di quanto è girato». */
export const polare = ({ re, im }) => ({ r: Math.hypot(re, im), gradi: GRA(Math.atan2(im, re)) });

/** E ritorno. */
export const rettangolare = (r, gradi) => ({ re: r * Math.cos(RAD(gradi)), im: r * Math.sin(RAD(gradi)) });

/** Il prodotto, svolto come si svolge una parentesi: (a+bi)(c+di). */
export const moltiplica = (z, w) => ({
  re: z.re * w.re - z.im * w.im,
  im: z.re * w.im + z.im * w.re,
});

/** La somma: punta contro coda, come le frecce del livello 8. */
export const somma = (z, w) => ({ re: z.re + w.re, im: z.im + w.im });

/** La potenza k-esima, moltiplicando k volte. */
export function potenza(z, k) {
  let out = { re: 1, im: 0 };
  for (let i = 0; i < k; i++) out = moltiplica(out, z);
  return out;
}

/**
 * Le n radici n-esime dell'unità: gli n numeri che elevati alla n danno 1.
 * Sono n punti equidistanti sul cerchio di raggio 1, il primo in 1.
 */
export const radiciUnita = n =>
  Array.from({ length: n }, (_, k) => ({ ...rettangolare(1, (360 * k) / n), k, gradi: (360 * k) / n }));

/** La somma di tutte: zero, per ogni n maggiore di 1. È il cuore della DFT. */
export const sommaRadici = n => radiciUnita(n).reduce(somma, { re: 0, im: 0 });

/* I bersagli del primo gioco: punti da raggiungere moltiplicando. */
export const BERSAGLI_Z = [
  { r: 2, gradi: 90 },
  { r: 4, gradi: 180 },
  { r: 1, gradi: 270 },
];

/* Quante radici, nel secondo gioco. */
export const QUANTE = [2, 3, 4, 6, 8];

/* ------------------------------------------------------------
   1) MOLTIPLICARE È GIRARE E ALLUNGARE
   ------------------------------------------------------------ */
export function prodottoLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('Moltiplicare due frecce'),
    subtitle: t('le lunghezze si moltiplicano, gli angoli si sommano: guardalo succedere'),
  });

  const st = { r1: 1.5, g1: 30, r2: 1.5, g2: 60, sfida: 0, fatte: new Set(), vinto: false };
  const near = nearSound();

  const stage = new Stage(w.body, {
    height: 330,
    draw(ctx, s) {
      bg(ctx, s);
      const z = rettangolare(st.r1, st.g1);
      const v = rettangolare(st.r2, st.g2);
      const p = moltiplica(z, v);
      const pp = polare(p);
      const b = BERSAGLI_Z[st.sfida];
      const scarto = Math.hypot(p.re - rettangolare(b.r, b.gradi).re, p.im - rettangolare(b.r, b.gradi).im);
      const preso = scarto < 0.12;
      const top = hud(ctx, s, {
        goal: t('fai finire il prodotto sul bersaglio (lungo :r, girato di :g°)', { r: b.r, g: b.gradi }),
        closeness: 1 - Math.min(1, scarto / 4),
        hit: preso,
        sub: t('bersagli presi: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const zona = { y: top + 8, h: s.h - top - 56 };
      const R = Math.min(zona.h / 2 - 6, 130);
      /* La colonna dei numeri ci sta solo su schermo largo. Quando c'è,
         disegno e colonna stanno al centro come un blocco unico; quando non
         c'è, il disegno si prende tutto il centro da solo. */
      const larghezzaCol = 210;
      const colonna = s.w > 2 * R + 40 + larghezzaCol;
      const cx = colonna
        ? Math.round((s.w - (2 * R + 14 + larghezzaCol)) / 2) + R
        : Math.round(s.w / 2);
      const cy = zona.y + zona.h / 2;
      /* La scala si adatta a quello che c'è da vedere: con frecce corte il
         disegno resta grande, e quando il prodotto si allunga il campo si
         apre. Il cerchio di raggio 1 resta disegnato, quindi il metro è
         sempre leggibile a occhio. */
      const K = R / (Math.max(1.4, b.r, Math.min(polare(p).r, 5)) * 1.18);

      circle(ctx, cx, cy, K, { stroke: '#22304d', width: 1 });
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();

      const P = ({ re, im }) => [cx + re * K, cy - im * K];

      const bp = rettangolare(b.r, b.gradi);
      dot(ctx, ...P(bp), 9, preso ? COL.green : '#2b6b52', false);

      arrow(ctx, cx, cy, ...P(z), { color: COL.cyan, width: 2.2 });
      arrow(ctx, cx, cy, ...P(v), { color: COL.amber, width: 2.2 });
      arrow(ctx, cx, cy, ...P(p), { color: COL.violet, width: 3 });
      dot(ctx, ...P(p), 5, COL.violet);

      const colx = cx + R + 14, maxCol = s.w - colx - 12;
      if (colonna && maxCol > 190) {
        const righe = [
          [t('freccia 1: lunga :r, a :g°', { r: st.r1.toFixed(1), g: st.g1 }), COL.cyan],
          [t('freccia 2: lunga :r, a :g°', { r: st.r2.toFixed(1), g: st.g2 }), COL.amber],
          ['', null],
          [t('prodotto: lungo :r, a :g°', { r: pp.r.toFixed(2), g: pp.gradi.toFixed(0) }), COL.violet],
          [t(':a × :b = :c', { a: st.r1.toFixed(1), b: st.r2.toFixed(1), c: (st.r1 * st.r2).toFixed(2) }), COL.green],
          [t(':a° + :b° = :c°', { a: st.g1, b: st.g2, c: (st.g1 + st.g2) % 360 }), COL.green],
        ];
        righe.forEach(([r, c], i) => r && text(ctx, r, colx, zona.y + 14 + i * 21, { size: 12, color: c, max: maxCol }));
      }

      /* Il conto in coordinate su DUE righe: su telefono una riga sola
         verrebbe troncata coi puntini, e un conto troncato non è un conto. */
      text(ctx, t('in coordinate: (:a + :b i) × (:c + :d i)',
        { a: due(z.re), b: due(z.im), c: due(v.re), d: due(v.im) }),
      16, s.h - 28, { size: 11.5, color: COL.dim, max: s.w - 32 });
      text(ctx, t('= :e + :f i', { e: due(p.re), f: due(p.im) }),
        16, s.h - 10, { size: 11.5, color: COL.violet, max: s.w - 32 });
      st.px = P(p)[0]; st.py = P(p)[1];
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const s1 = slider({ label: t('lunghezza 1'), min: 0.5, max: 2.5, step: 0.1, value: st.r1, fmt: v => v.toFixed(1), oninput: v => { st.r1 = v; upd(); } });
  const a1 = slider({ label: t('angolo 1'), min: 0, max: 345, step: 15, value: st.g1, fmt: v => v + '°', oninput: v => { st.g1 = v; upd(); } });
  const s2 = slider({ label: t('lunghezza 2'), min: 0.5, max: 2.5, step: 0.1, value: st.r2, fmt: v => v.toFixed(1), oninput: v => { st.r2 = v; upd(); } });
  const a2 = slider({ label: t('angolo 2'), min: 0, max: 345, step: 15, value: st.g2, fmt: v => v + '°', oninput: v => { st.g2 = v; upd(); } });
  w.body.appendChild(controls(s1.root, a1.root, s2.root, a2.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🎯 ' + t('altro bersaglio'), class: 'sm primary', onclick: () => { st.sfida = (st.sfida + 1) % BERSAGLI_Z.length; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const z = rettangolare(st.r1, st.g1);
    const v = rettangolare(st.r2, st.g2);
    const p = moltiplica(z, v);
    const pp = polare(p);
    const b = BERSAGLI_Z[st.sfida];
    const bp = rettangolare(b.r, b.gradi);
    const scarto = Math.hypot(p.re - bp.re, p.im - bp.im);
    const preso = scarto < 0.12;
    if (preso && !st.fatte.has(st.sfida)) {
      st.fatte.add(st.sfida);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else if (!preso) near(1 - Math.min(1, scarto / 4));
    out.set(
      t('Lunghezze: :a × :b = <b>:c</b>. Angoli: :d° + :e° = <b>:f°</b>.',
        { a: st.r1.toFixed(1), b: st.r2.toFixed(1), c: (st.r1 * st.r2).toFixed(2), d: st.g1, e: st.g2, f: (st.g1 + st.g2) % 360 }) + '\n' +
      t('E il prodotto calcolato in coordinate viene lungo <b>:r</b> e girato di <b>:g°</b>: gli stessi due numeri.',
        { r: pp.r.toFixed(2), g: pp.gradi.toFixed(0) }) + '\n' +
      '<span class="g">' + t('Moltiplicare non è «fare più grande»: è <b>allungare e girare</b>. Con lunghezza 1 resta solo il girare — ed è quello che fa una fase quantistica.') + '</span>');
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Perché gli angoli si sommano.</b> Svolgi il prodotto di due frecce di lunghezza 1: (cos a + i·sin a)(cos b + i·sin b). La parte senza i viene cos a·cos b − sin a·sin b, quella con la i viene sin a·cos b + cos a·sin b. Sono <b>esattamente</b> le formule di addizione del livello :n: cioè cos(a+b) e sin(a+b). Il prodotto è la freccia a a+b gradi, e non poteva essere altro.', { n: nOf('m2-goniometria') }));
  return { state: st };
}

/* ------------------------------------------------------------
   2) LE RADICI DELL'UNITÀ — il poligono che si chiude sullo zero
   ------------------------------------------------------------ */
export function radiciLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('Le radici dell\'unità: n frecce che si annullano'),
    subtitle: t('gli n numeri che elevati alla n danno 1 — e la loro somma'),
  });

  const st = { i: 2, mostra: 0, fatte: new Set(), vinto: false };
  const N = () => QUANTE[st.i];

  const stage = new Stage(w.body, {
    height: 330,
    draw(ctx, s) {
      bg(ctx, s);
      const n = N();
      const rad = radiciUnita(n);
      const quante = Math.min(st.mostra, n);
      const parziale = rad.slice(0, quante).reduce(somma, { re: 0, im: 0 });
      const chiusa = quante === n;
      const top = hud(ctx, s, {
        goal: t('somma tutte le :n frecce e guarda dove arrivi', { n }),
        closeness: quante / n,
        hit: chiusa,
        sub: t('poligoni chiusi: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const zona = { y: top + 8, h: s.h - top - 40 };
      const R = Math.min(zona.h / 2 - 24, 120);   // il −24 è lo spazio per le etichette ω^k
      /* due disegni affiancati quando c'è spazio: il poligono a sinistra,
         la catena delle frecce a destra. Su telefono solo il poligono. */
      const doppio = s.w > 620;
      const cx1 = doppio ? Math.round(s.w / 4) : Math.round(s.w / 2);
      const cy = zona.y + zona.h / 2;
      const K = R;

      circle(ctx, cx1, cy, K, { stroke: '#22304d', width: 1.2 });
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx1 - K - 8, cy); ctx.lineTo(cx1 + K + 8, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx1, cy - K - 8); ctx.lineTo(cx1, cy + K + 8); ctx.stroke();

      rad.forEach((z, k) => {
        const x = cx1 + z.re * K, y = cy - z.im * K;
        const acceso = k < quante;
        if (acceso) arrow(ctx, cx1, cy, x, y, { color: COL.violet, width: 2 });
        dot(ctx, x, y, acceso ? 6 : 4, acceso ? COL.violet : '#3a4a6b');
        if (n <= 8) text(ctx, k === 0 ? '1' : `ω${['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷'][k] || ''}`,
          cx1 + z.re * (K + 17), cy - z.im * (K + 17), { size: 11, align: 'center', color: acceso ? COL.violet : COL.dim, max: 46 });
      });

      // la catena: le stesse frecce messe punta contro coda
      if (doppio) {
        const cx2 = Math.round((s.w * 3) / 4);
        const Kc = Math.min(K, 92);
        let px = cx2 - Kc / 2, py = cy;
        text(ctx, t('punta contro coda'), cx2, zona.y + 6, { size: 11, align: 'center', color: COL.dim, max: s.w / 2 - 20 });
        for (let k = 0; k < quante; k++) {
          const nx = px + rad[k].re * Kc, ny = py - rad[k].im * Kc;
          arrow(ctx, px, py, nx, ny, { color: COL.amber, width: 2 });
          px = nx; py = ny;
        }
        dot(ctx, px, py, 6, chiusa ? COL.green : COL.pink);
        if (chiusa) text(ctx, t('torna al punto di partenza: somma = 0'), cx2, cy + Kc + 26,
          { size: 11.5, align: 'center', color: COL.green, max: s.w / 2 - 20 });
      }

      text(ctx, t('somma delle prime :q: (:a ; :b)', { q: quante, a: tre(parziale.re), b: tre(parziale.im) }),
        16, s.h - 12, { size: 12, color: chiusa ? COL.green : COL.txt, max: s.w - 32 });
      st.px = cx1; st.py = cy;
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sn = choice({
    label: t('Quante radici'),
    items: QUANTE.map((q, i) => ({ label: String(q), value: i })),
    value: 2,
    onchange: i => { st.i = i; st.mostra = 0; upd(); },
  });
  w.body.appendChild(controls(sn.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '➕ ' + t('aggiungi una freccia'), class: 'sm primary', onclick: () => { st.mostra = Math.min(N(), st.mostra + 1); sfx.click(); upd(); } },
    { label: '⏭ ' + t('tutte insieme'), onclick: () => { st.mostra = N(); sfx.ok(); upd(); } },
    { label: '↺ ' + t('ricomincia'), onclick: () => { st.mostra = 0; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const n = N();
    const rad = radiciUnita(n);
    const quante = Math.min(st.mostra, n);
    const parziale = rad.slice(0, quante).reduce(somma, { re: 0, im: 0 });
    const chiusa = quante === n;
    if (chiusa && !st.fatte.has(n)) {
      st.fatte.add(n);
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    out.set(
      t('Le <b>:n</b> radici stanno a :p° una dall\'altra: sono i vertici di un poligono regolare, il primo in 1.', { n, p: (360 / n).toFixed(0) }) + '\n' +
      t('Sommate le prime :q, sei arrivato a (<b>:a</b> ; <b>:b</b>).', { q: quante, a: tre(parziale.re), b: tre(parziale.im) }) +
      (chiusa
        ? '\n<span class="g">✓ ' + t('Zero. Le :n frecce si annullano fra loro: puntano in tutte le direzioni in modo perfettamente bilanciato, e la catena si chiude.', { n }) + '</span>'
        : '\n<span class="a">' + t('Aggiungine ancora: la catena non si è ancora chiusa.') + '</span>'));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Questo zero è l\'interferenza distruttiva.</b> Le n radici dell\'unità sono le stesse frecce che la DFT del livello :dft usa per pesare i campioni, e il fatto che sommate facciano zero è il motivo per cui tutte le frequenze sbagliate si cancellano e resta solo il picco. La stessa catena che si chiude l\'hai già vista al livello :serie: qui sai anche <b>chi sono</b> quelle frecce.', { dft: nOf('16-dft'), serie: nOf('15b-serie') }));
  return { state: st };
}
