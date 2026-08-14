/* ============================================================
   PARTE M — SPAZI VETTORIALI: BASE E DIMENSIONE

   La parola «base» compare in tutto il corso — base di misura, cambio
   di base, base computazionale — e fin qui è stata usata a intuito.
   Qui diventa una cosa che si tocca.

   Le tre idee, in ordine:

   · COMBINAZIONE LINEARE: da poche frecce, allungandole e sommandole,
     se ne costruiscono infinite altre;

   · BASE: il minimo insieme che le raggiunge TUTTE. E DIMENSIONE: quante
     ne servono — un numero che non cambia da una base all'altra;

   · CAMBIARE BASE È CAMBIARE DOMANDA. Lo stato non si muove: cambiano
     le coordinate con cui lo descrivi. È esattamente ciò che succede
     misurando un qubit in Z oppure in X.

   E il conto che spaventa: n qubit vivono in uno spazio di dimensione
   2^n. Non «2n». È l'unica ragione per cui simulare un computer
   quantistico costa così tanto.
   ============================================================ */

import { Stage, COL, bg, grid, dot, text, arrow, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud, nearSound } from './basicmath.js';

const uno = v => (Math.abs(v) < 5e-3 ? 0 : v).toFixed(1);

/* ------------------------------------------------------------
   LOGICA PURA
   Un vettore è [x, y]. Due dimensioni bastano per capire tutto, e si
   disegnano.
   ------------------------------------------------------------ */

/** La combinazione lineare: allunga ciascuna freccia e sommale. */
export const combina = (vettori, coef) =>
  vettori.reduce((acc, v, i) => [acc[0] + v[0] * coef[i], acc[1] + v[1] * coef[i]], [0, 0]);

/** Il «prodotto vettoriale» in due dimensioni: zero se le frecce sono in linea. */
export const incrocio = (v, w) => v[0] * w[1] - v[1] * w[0];

/** Due frecce sono dipendenti se stanno sulla stessa retta (o una è nulla). */
export const dipendenti = (v, w) => Math.abs(incrocio(v, w)) < 1e-9;

/**
 * Il rango: quante direzioni indipendenti coprono davvero queste frecce.
 * 0 = solo l'origine, 1 = una retta, 2 = tutto il piano.
 */
export function rango(vettori) {
  const vivi = vettori.filter(v => Math.hypot(v[0], v[1]) > 1e-9);
  if (!vivi.length) return 0;
  for (let i = 0; i < vivi.length; i++) {
    for (let j = i + 1; j < vivi.length; j++) if (!dipendenti(vivi[i], vivi[j])) return 2;
  }
  return 1;
}

/** È una base del piano? Serve che siano esattamente due e indipendenti. */
export const eBase = vettori => vettori.length === 2 && rango(vettori) === 2;

/**
 * Le coordinate di un vettore IN UNA BASE: i due numeri con cui ricostruirlo.
 * Restituisce null se la base non è una base — e allora il bersaglio, in
 * generale, non si raggiunge.
 */
export function coordinate(base, bersaglio) {
  const [v, w] = base;
  const det = incrocio(v, w);
  if (Math.abs(det) < 1e-9) return null;
  return [
    incrocio(bersaglio, w) / det,
    incrocio(v, bersaglio) / det,
  ];
}

/** In una base ORTONORMALE le coordinate sono semplicemente i prodotti scalari. */
export const perProdottoScalare = (base, bersaglio) =>
  base.map(v => v[0] * bersaglio[0] + v[1] * bersaglio[1]);

/** Ortonormale: frecce lunghe 1 e perpendicolari fra loro. */
export const ortonormale = base =>
  base.every(v => Math.abs(Math.hypot(v[0], v[1]) - 1) < 1e-9) &&
  Math.abs(base[0][0] * base[1][0] + base[0][1] * base[1][1]) < 1e-9;

/** La dimensione dello spazio di n qubit: 2^n ampiezze, non 2n. */
export const dimensioneQubit = n => 2 ** n;

/* Le basi del primo gioco. L'ultima NON è una base, ed è il punto. */
const R2 = Math.SQRT1_2;
export const BASI = [
  { id: 'assi', v: [[1, 0], [0, 1]] },
  { id: 'girata', v: [[R2, R2], [-R2, R2]] },
  { id: 'storta', v: [[1, 0], [1, 1]] },
  { id: 'finta', v: [[1, 1], [2, 2]] },      // due frecce in linea: non è una base
];

/* I bersagli da raggiungere. */
export const BERSAGLI_B = [[2, 1], [-1, 2], [0, -2]];

/* Le collezioni del secondo gioco: quante frecce bastano davvero. */
export const COLLEZIONI = [
  { id: 'due-buone', v: [[2, 0], [0, 2], [1, 1]] },
  { id: 'tutte-in-linea', v: [[1, 1], [2, 2], [-1, -1]] },
  { id: 'quattro', v: [[1, 0], [2, 0], [0, 1], [1, 2]] },
];

/* ------------------------------------------------------------
   1) COSTRUIRE UN VETTORE DA UNA BASE
   ------------------------------------------------------------ */
export function baseLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('Costruire una freccia da altre due'),
    subtitle: t('allunga le due frecce della base e sommale: ci arrivi sempre?'),
  });

  const st = { b: 0, a: 1, c: 1, sfida: 0, fatte: new Set(), vinto: false };
  const near = nearSound();
  const base = () => BASI[st.b].v;

  const stage = new Stage(w.body, {
    height: 330,
    draw(ctx, s) {
      bg(ctx, s);
      const bersaglio = BERSAGLI_B[st.sfida];
      const p = combina(base(), [st.a, st.c]);
      const scarto = Math.hypot(p[0] - bersaglio[0], p[1] - bersaglio[1]);
      const preso = scarto < 0.12;
      const valida = eBase(base());
      const top = hud(ctx, s, {
        goal: t('arriva sul bersaglio (:x ; :y)', { x: bersaglio[0], y: bersaglio[1] }),
        closeness: 1 - Math.min(1, scarto / 4),
        hit: preso,
        sub: t('bersagli raggiunti: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const zona = { y: top + 8, h: s.h - top - 42 };
      const R = Math.min(zona.h / 2 - 6, 128);
      const larghezzaCol = 200;
      const colonna = s.w > 2 * R + 40 + larghezzaCol;
      const cx = colonna ? Math.round((s.w - (2 * R + 14 + larghezzaCol)) / 2) + R : Math.round(s.w / 2);
      const cy = zona.y + zona.h / 2;
      const K = R / 3.2;

      grid(ctx, cx - R, cy - R, 2 * R, 2 * R, K, K);
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();

      const P = v => [cx + v[0] * K, cy - v[1] * K];

      /* Se la base è finta, tutto quello che si può costruire sta su una
         retta: disegnarla è il modo più diretto di far vedere il muro. */
      if (!valida) {
        const d = base().find(v => Math.hypot(v[0], v[1]) > 1e-9) || [1, 0];
        const L = Math.hypot(d[0], d[1]);
        ctx.strokeStyle = 'rgba(244,114,182,.5)'; ctx.lineWidth = 2; ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(cx - (d[0] / L) * R, cy + (d[1] / L) * R);
        ctx.lineTo(cx + (d[0] / L) * R, cy - (d[1] / L) * R);
        ctx.stroke(); ctx.setLineDash([]);
      }

      dot(ctx, ...P(bersaglio), 9, preso ? COL.green : '#2b6b52', false);

      // le due frecce della base, allungate dai cursori
      const [v1, v2] = base();
      const s1 = [v1[0] * st.a, v1[1] * st.a];
      const s2 = [v2[0] * st.c, v2[1] * st.c];
      arrow(ctx, cx, cy, ...P(v1), { color: '#3d5c8a', width: 1.6 });
      arrow(ctx, cx, cy, ...P(v2), { color: '#3d5c8a', width: 1.6 });
      arrow(ctx, cx, cy, ...P(s1), { color: COL.cyan, width: 2.4 });
      // la seconda parte dalla punta della prima: la somma si vede
      arrow(ctx, ...P(s1), ...P(p), { color: COL.amber, width: 2.4 });
      arrow(ctx, cx, cy, ...P(p), { color: COL.violet, width: 3 });
      dot(ctx, ...P(p), 5, COL.violet);

      const colx = cx + R + 14, maxCol = s.w - colx - 12;
      if (colonna && maxCol > 180) {
        const righe = [
          [t('prima freccia × :a', { a: uno(st.a) }), COL.cyan],
          [t('seconda freccia × :c', { c: uno(st.c) }), COL.amber],
          ['', null],
          [t('arrivi in (:x ; :y)', { x: uno(p[0]), y: uno(p[1]) }), COL.violet],
          [valida ? t('è una base: ci arrivi sempre') : t('NON è una base'), valida ? COL.green : COL.pink],
        ];
        righe.forEach(([r, c], i) => r && text(ctx, r, colx, zona.y + 16 + i * 22, { size: 12, color: c, max: maxCol }));
      }

      text(ctx, valida
        ? t('due frecce non in linea bastano per tutto il piano')
        : t('le due frecce sono in linea: si raggiunge solo la retta tratteggiata'),
      16, s.h - 12, { size: 11.5, color: valida ? COL.dim : COL.pink, max: s.w - 32 });
      st.px = P(p)[0]; st.py = P(p)[1];
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sb = choice({
    label: t('La base'),
    items: [
      { label: t('gli assi'), value: 0 },
      { label: t('girata di 45°'), value: 1 },
      { label: t('storta'), value: 2 },
      { label: t('due in linea'), value: 3 },
    ],
    value: 0,
    onchange: i => { st.b = i; upd(); },
  });
  w.body.appendChild(controls(sb.root));
  const sa = slider({ label: t('quanto della prima'), min: -3, max: 3, step: 0.1, value: st.a, fmt: uno, oninput: v => { st.a = v; upd(); } });
  const sc = slider({ label: t('quanto della seconda'), min: -3, max: 3, step: 0.1, value: st.c, fmt: uno, oninput: v => { st.c = v; upd(); } });
  w.body.appendChild(controls(sa.root, sc.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🎯 ' + t('altro bersaglio'), class: 'sm primary', onclick: () => { st.sfida = (st.sfida + 1) % BERSAGLI_B.length; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const bersaglio = BERSAGLI_B[st.sfida];
    const p = combina(base(), [st.a, st.c]);
    const scarto = Math.hypot(p[0] - bersaglio[0], p[1] - bersaglio[1]);
    const preso = scarto < 0.12;
    const valida = eBase(base());
    const giuste = valida ? coordinate(base(), bersaglio) : null;
    if (preso && !st.fatte.has(st.sfida)) {
      st.fatte.add(st.sfida);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else if (!preso) near(1 - Math.min(1, scarto / 4));
    out.set(
      t('Stai costruendo <b>:a</b> volte la prima freccia più <b>:c</b> volte la seconda, e arrivi in (<b>:x</b> ; <b>:y</b>).',
        { a: uno(st.a), c: uno(st.c), x: uno(p[0]), y: uno(p[1]) }) + '\n' +
      (valida
        ? t('Questa è una <b>base</b>: le due frecce non stanno in linea, quindi con i due cursori si arriva in <b>qualunque</b> punto del piano. Per questo bersaglio i numeri giusti sono :a e :c.',
          { a: giuste[0].toFixed(2), c: giuste[1].toFixed(2) })
        : '<span class="p">' + t('Queste due frecce stanno <b>sulla stessa retta</b>: allungale come vuoi, la somma resterà sempre su quella retta. Non è un tuo errore ed è inutile insistere — non è una base, e metà del piano è irraggiungibile.') + '</span>') +
      (preso ? '\n<span class="g">✓ ' + t('Centrato.') + '</span>' : ''));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Due parole che adesso hai in mano.</b> Le due frecce che bastano si chiamano <b>base</b>; il loro numero — qui due — si chiama <b>dimensione</b>, ed è lo stesso qualunque base tu scelga. I due numeri dei cursori sono le <b>coordinate</b> del punto <i>in quella base</i>: cambiando base cambiano i numeri, ma il punto resta dov\'è. È esattamente ciò che succede quando al livello :n misuri lo stesso qubit in due basi diverse.', { n: nOf('00-scalare') }));
  return { state: st };
}

/* ------------------------------------------------------------
   2) QUANTE NE SERVONO DAVVERO — rango e dimensione
   ------------------------------------------------------------ */
export function dimensioneLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('Quante frecce servono davvero'),
    subtitle: t('accendi e spegni le frecce: quali insiemi coprono tutto il piano?'),
  });

  const st = { i: 0, accese: [true, false, false, false], fatte: new Set(), vinto: false };
  const coll = () => COLLEZIONI[st.i].v;
  const scelte = () => coll().filter((_, k) => st.accese[k]);

  const stage = new Stage(w.body, {
    height: 320,
    draw(ctx, s) {
      bg(ctx, s);
      const sel = scelte();
      const r = rango(sel);
      const minima = r === 2 && sel.length === 2;
      const top = hud(ctx, s, {
        goal: t('copri tutto il piano con il <b>minimo</b> numero di frecce'),
        closeness: r / 2,
        hit: minima,
        sub: t('insiemi minimi trovati: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const zona = { y: top + 8, h: s.h - top - 46 };
      const R = Math.min(zona.h / 2 - 6, 120);
      const cx = Math.round(s.w / 2), cy = zona.y + zona.h / 2;
      const K = R / 2.6;

      // quello che si raggiunge: niente, una retta, tutto
      if (r === 2) {
        ctx.fillStyle = 'rgba(52,211,153,.10)';
        ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      } else if (r === 1) {
        const d = sel.find(v => Math.hypot(v[0], v[1]) > 1e-9);
        const L = Math.hypot(d[0], d[1]);
        ctx.strokeStyle = 'rgba(251,191,36,.6)'; ctx.lineWidth = 3; ctx.setLineDash([7, 5]);
        ctx.beginPath();
        ctx.moveTo(cx - (d[0] / L) * R, cy + (d[1] / L) * R);
        ctx.lineTo(cx + (d[0] / L) * R, cy - (d[1] / L) * R);
        ctx.stroke(); ctx.setLineDash([]);
      }

      grid(ctx, cx - R, cy - R, 2 * R, 2 * R, K, K);
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();

      coll().forEach((v, k) => {
        const acceso = st.accese[k];
        arrow(ctx, cx, cy, cx + v[0] * K, cy - v[1] * K,
          { color: acceso ? COL.cyan : '#33425f', width: acceso ? 2.6 : 1.4 });
        text(ctx, String(k + 1), cx + v[0] * K * 1.16, cy - v[1] * K * 1.16,
          { size: 11, align: 'center', color: acceso ? COL.cyan : COL.dim, max: 40 });
      });

      text(ctx, r === 2 ? t('raggiungi TUTTO il piano') : r === 1 ? t('raggiungi solo una retta') : t('non raggiungi niente'),
        16, s.h - 30, { size: 12.5, color: r === 2 ? COL.green : r === 1 ? COL.amber : COL.pink, max: s.w - 32 });
      text(ctx, t('frecce accese: :q · direzioni indipendenti: :r', { q: sel.length, r }),
        16, s.h - 12, { size: 11.5, color: COL.dim, max: s.w - 32 });
      st.px = cx; st.py = cy;
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sc = choice({
    label: t('La collezione'),
    items: COLLEZIONI.map((c, i) => ({ label: t('collezione :n', { n: i + 1 }), value: i })),
    value: 0,
    onchange: i => { st.i = i; st.accese = coll().map((_, k) => k === 0); rifai(); upd(); },
  });
  w.body.appendChild(controls(sc.root));
  const fila = h('div', { class: 'btn-row', style: { marginTop: '8px', flexWrap: 'wrap' } });
  w.body.appendChild(fila);
  const out = readout('');
  w.body.appendChild(out.root);

  function rifai() {
    fila.textContent = '';
    fila.appendChild(buttons(coll().map((v, k) => ({
      label: (st.accese[k] ? '● ' : '○ ') + t('freccia :n', { n: k + 1 }),
      class: st.accese[k] ? 'sm primary' : 'sm',
      onclick: () => { st.accese[k] = !st.accese[k]; sfx.click(); rifai(); upd(); },
    }))));
  }

  function upd() {
    const sel = scelte();
    const r = rango(sel);
    const minima = r === 2 && sel.length === 2;
    if (minima && !st.fatte.has(st.i)) {
      st.fatte.add(st.i);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    out.set(
      t('Frecce accese: <b>:q</b>. Direzioni indipendenti: <b>:r</b>.', { q: sel.length, r }) + '\n' +
      (r === 0 ? '<span class="p">' + t('Senza frecce non si va da nessuna parte.') + '</span>'
        : r === 1 ? '<span class="a">' + t('Tutte le frecce accese stanno sulla stessa retta: sommandole e allungandole resti sempre lì. Una direzione sola.') + '</span>'
          : sel.length === 2 ? '<span class="g">✓ ' + t('Due frecce, due direzioni: questa è una <b>base</b>, ed è il minimo possibile. La <b>dimensione</b> del piano è 2.') + '</span>'
            : '<span class="a">' + t('Copri tutto il piano, ma con :q frecce: una è di troppo, si può scrivere usando le altre. Spegnine una.', { q: sel.length }) + '</span>'));
    stage.redraw();
  }
  rifai(); upd();
  w.setFoot(t('<b>Il numero che non cambia mai.</b> Comunque scegli le frecce, per coprire il piano ce ne vogliono <b>esattamente due</b>: meno non bastano, di più sono ridondanti. Quel numero è la <b>dimensione</b>, e non dipende dalla base. Un qubit vive in dimensione 2 (le ampiezze di 0 e 1); due qubit in dimensione 4; <b>n qubit in dimensione 2^n</b> — non 2n. È tutta lì la ragione per cui, da qualche decina di qubit in su, simulare il registro su un computer normale diventa impossibile.'));
  return { state: st };
}
