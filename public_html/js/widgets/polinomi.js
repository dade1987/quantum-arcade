/* ============================================================
   PARTE M — POLINOMI, RUFFINI E LA FORMULA CHE NON ESISTE

   Perché un corso di informatica quantistica passa da qui:

   · gli autovalori di una matrice n×n sono le radici di un polinomio
     di grado n. Al livello 18·b se ne trovano due a mano perché la
     matrice è 2×2; con una matrice grande non si può — e non perché
     nessuno sia stato abbastanza bravo, ma perché dal grado 5 in su
     una formula con le radici NON ESISTE (Ruffini, Abel, Galois).
     È il motivo per cui la stima di fase quantistica è interessante:
     legge un autovalore senza risolvere nessun polinomio;

   · la regola di Ruffini è, riga per riga, il metodo di Horner: il
     modo più veloce che si conosca di calcolare un polinomio in un
     punto. n moltiplicazioni invece di n². Lo usano le schede grafiche;

   · e la DFT del livello 16 è esattamente questo: calcolare un
     polinomio nelle radici n-esime dell'unità. La FFT è il «dividi a
     metà» applicato a quel calcolo.

   I due giochi: il primo restringe la caccia alle radici (i sospettati
   sono solo i divisori del termine noto), il secondo fa correre la
   staffetta di Ruffini e conta le moltiplicazioni risparmiate.
   ============================================================ */

import { Stage, COL, bg, grid, dot, text, roundRect, plot, FX } from '../core/canvas.js';
import { widget, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud } from './basicmath.js';

/** Il meno tipografico: «−7», non «-7». Nei riquadri si legge molto meglio. */
const num = v => String(v).replace('-', '\u2212');

/* ------------------------------------------------------------
   LOGICA PURA
   I polinomi sono array di coefficienti dal grado più alto al più
   basso: [1, 0, -7, 6] è x³ − 7x + 6.
   ------------------------------------------------------------ */

/** Il valore del polinomio in x, con lo schema di Horner: ogni
    coefficiente entra con UNA moltiplicazione sola. */
export function valuta(coef, x) {
  let acc = 0;
  for (const c of coef) acc = acc * x + c;
  return acc;
}

/** Quante moltiplicazioni servono: a forza bruta (x·x·x… per ogni
    termine) contro la staffetta di Horner. */
export const costoBruto = coef => {
  let n = 0;
  for (let i = 0; i < coef.length - 1; i++) n += coef.length - 1 - i; // le potenze
  return n + coef.length - 1;                                          // e i prodotti col coefficiente
};
export const costoHorner = coef => coef.length - 1;

/**
 * La divisione di Ruffini per (x − r), passo per passo.
 * `passi[i]` è quello che il gioco disegna in colonna: il coefficiente
 * che entra, quello che arriva dal corridore precedente, e la somma.
 */
export function ruffini(coef, r) {
  const passi = [];
  let acc = 0;
  for (let i = 0; i < coef.length; i++) {
    const portato = i === 0 ? 0 : acc * r;
    acc = coef[i] + portato;
    passi.push({ coefficiente: coef[i], portato, somma: acc });
  }
  return { quoziente: passi.slice(0, -1).map(p => p.somma), resto: passi[passi.length - 1].somma, passi };
}

/** I divisori positivi di un intero. */
export function divisoriDi(n) {
  const m = Math.abs(Math.round(n));
  if (m === 0) return [];
  const out = [];
  for (let d = 1; d <= m; d++) if (m % d === 0) out.push(d);
  return out;
}

/**
 * I «sospettati»: teorema delle radici razionali, caso monico.
 * Se un numero intero annulla il polinomio, deve dividere il termine
 * noto — perché raccogliendo x da tutti gli altri termini resta
 * proprio quel numero da spartire. Quindi la caccia passa da infiniti
 * candidati a una manciata.
 */
export function candidati(coef) {
  const noto = coef[coef.length - 1];
  const d = divisoriDi(noto);
  return d.flatMap(x => [-x, x]).sort((a, b) => a - b);
}

/** Le radici intere, in ordine. */
export const radiciIntere = coef => candidati(coef).filter(x => Math.abs(valuta(coef, x)) < 1e-9);

/**
 * La scomposizione completa: si sfilano le radici intere una per una,
 * e si restituisce anche quello che resta e non si scompone più.
 */
export function scomponi(coef) {
  const fattori = [];
  let resto = coef.slice();
  let cambiato = true;
  while (cambiato && resto.length > 1) {
    cambiato = false;
    for (const c of candidati(resto)) {
      if (Math.abs(valuta(resto, c)) < 1e-9) {
        fattori.push(c);
        resto = ruffini(resto, c).quoziente;
        cambiato = true;
        break;
      }
    }
  }
  return { fattori, resto };
}

/** Come si scrive un polinomio, senza i termini che non ci sono. */
export function scrivi(coef) {
  const g = coef.length - 1;
  const pezzi = [];
  coef.forEach((c, i) => {
    if (c === 0) return;
    const e = g - i;
    const seg = c < 0 ? '−' : pezzi.length ? '+' : '';
    const val = Math.abs(c);
    const cifra = val === 1 && e > 0 ? '' : String(val);
    const parte = e === 0 ? cifra : e === 1 ? `${cifra}x` : `${cifra}x${['⁰', '¹', '²', '³', '⁴', '⁵', '⁶'][e] || '^' + e}`;
    pezzi.push((seg ? seg + ' ' : '') + parte);
  });
  return pezzi.length ? pezzi.join(' ') : '0';
}

/* Le sfide. L'ultimo di ciascun gruppo lascia in mano un pezzo che non
   si scompone: serve a far vedere che «non si scompone più» è una
   risposta legittima, non un fallimento. */
export const POLINOMI = [
  { coef: [1, 0, -7, 6] },      // (x−1)(x−2)(x+3)
  { coef: [1, -4, 1, 6] },      // (x+1)(x−2)(x−3)
  { coef: [1, -2, 1, -2] },     // (x−2)(x²+1) — il pezzo che resta ha delta < 0
  { coef: [1, 0, -5, 0, 4] },   // (x−1)(x+1)(x−2)(x+2)
];

/* ------------------------------------------------------------
   1) I SOSPETTATI — la caccia alle radici
   ------------------------------------------------------------ */
export function sospettatiLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('I sospettati'),
    subtitle: t('le radici intere si nascondono solo fra i divisori del termine noto: interrogali'),
  });

  const st = { i: 0, corrente: POLINOMI[0].coef.slice(), trovate: [], alibi: {}, finite: new Set(), vinto: false };
  const XMIN = -4, XMAX = 4, YMIN = -14, YMAX = 14;

  const stage = new Stage(w.body, {
    height: 320,
    draw(ctx, s) {
      bg(ctx, s);
      const finito = candidati(st.corrente).every(c => Math.abs(valuta(st.corrente, c)) > 1e-9);
      const top = hud(ctx, s, {
        goal: finito ? t('non si scompone più: fatto') : t('trova le radici e sfilale una per una'),
        closeness: st.trovate.length / Math.max(1, POLINOMI[st.i].coef.length - 1),
        hit: finito,
        sub: t('polinomi scomposti: :fatte su :totali', { fatte: st.finite.size, totali: cfg.need }),
      });

      const inizio = top + 12;
      const rect = { x: 26, y: inizio, w: s.w - 52, h: s.h - inizio - 46 };
      grid(ctx, rect.x, rect.y, rect.w, rect.h, rect.w / 8, rect.h / 7);
      const X = x => rect.x + ((x - XMIN) / (XMAX - XMIN)) * rect.w;
      const Y = y => rect.y + rect.h - ((y - YMIN) / (YMAX - YMIN)) * rect.h;
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(rect.x, Y(0)); ctx.lineTo(rect.x + rect.w, Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(0), rect.y); ctx.lineTo(X(0), rect.y + rect.h); ctx.stroke();

      ctx.save();
      ctx.beginPath(); ctx.rect(rect.x, rect.y, rect.w, rect.h); ctx.clip();
      plot(ctx, rect, u => valuta(st.corrente, XMIN + u * (XMAX - XMIN)), { color: COL.cyan, yMin: YMIN, yMax: YMAX, width: 2.4 });
      ctx.restore();

      /* le radici già sfilate restano marcate: sono i punti in cui la
         curva di PARTENZA toccava lo zero */
      for (const r of st.trovate) if (r >= XMIN && r <= XMAX) {
        dot(ctx, X(r), Y(0), 6, COL.green);
        text(ctx, num(r), X(r), Y(0) + 18, { size: 11, align: 'center', color: COL.green, max: 60 });
      }

      text(ctx, scrivi(st.corrente), 26, s.h - 26, { size: 13, color: COL.cyan, max: s.w - 52 });
      text(ctx, st.trovate.length
        ? t('sfilate finora: :lista', { lista: st.trovate.map(r => `(x ${r < 0 ? '+' : '−'} ${Math.abs(r)})`).join(' ') })
        : t('ancora nessuna radice sfilata'),
      26, s.h - 8, { size: 12, color: st.trovate.length ? COL.green : COL.dim, max: s.w - 52 });
      st.px = X(0); st.py = Y(0);
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sp = choice({
    label: t('Il polinomio'),
    items: POLINOMI.map((p, i) => ({ label: scrivi(p.coef), value: i })),
    value: 0,
    onchange: i => { st.i = i; st.corrente = POLINOMI[i].coef.slice(); st.trovate = []; st.alibi = {}; sospetti(); upd(); },
  });
  w.body.appendChild(controls(sp.root));

  const fila = h('div', { class: 'btn-row', style: { marginTop: '8px', flexWrap: 'wrap' } });
  w.body.appendChild(fila);
  const out = readout('');
  w.body.appendChild(out.root);

  function sospetti() {
    fila.textContent = '';
    const lista = candidati(st.corrente);
    if (!lista.length) return;
    fila.appendChild(buttons(lista.map(c => ({
      label: (st.alibi[c] !== undefined ? '✗ ' : '') + num(c),
      class: st.alibi[c] !== undefined ? 'sm' : 'sm primary',
      onclick: () => interroga(c),
    }))));
  }

  function interroga(c) {
    const r = ruffini(st.corrente, c);
    if (Math.abs(r.resto) < 1e-9) {
      st.trovate.push(c);
      st.corrente = r.quoziente;
      st.alibi = {};
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
    } else {
      st.alibi[c] = r.resto;
      sfx.click();
    }
    sospetti();
    upd();
  }

  function upd() {
    const finito = candidati(st.corrente).every(c => Math.abs(valuta(st.corrente, c)) > 1e-9);
    if (finito && st.trovate.length && !st.finite.has(st.i)) {
      st.finite.add(st.i);
      if (st.finite.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    const pezzi = st.trovate.map(r => `(x ${r < 0 ? '+' : '−'} ${Math.abs(r)})`).join('');
    const ultimoAlibi = Object.entries(st.alibi).slice(-1)[0];
    out.set(
      t('Termine noto <b>:noto</b> → i sospettati sono solo i suoi divisori, col più e col meno: <b>:lista</b>. Tutti gli altri numeri hanno un alibi automatico.',
        { noto: num(st.corrente[st.corrente.length - 1]), lista: candidati(st.corrente).map(num).join(', ') || '—' }) +
      (ultimoAlibi
        ? '\n<span class="p">' + t('x = :c non è una radice: il resto viene :r, non zero. Alibi confermato.', { c: num(ultimoAlibi[0]), r: num(Number(ultimoAlibi[1]).toFixed(0)) }) + '</span>'
        : '') +
      (pezzi ? '\n<span class="g">' + t('Finora: :pezzi · (:resto)', { pezzi, resto: scrivi(st.corrente) }) + '</span>' : '') +
      (finito && st.trovate.length
        ? '\n<span class="a">' + (st.corrente.length > 2
          ? t('Quello che resta non ha radici intere: si ferma qui, ed è una risposta giusta. Guarda il suo delta.')
          : t('Scomposto fino in fondo.')) + '</span>'
        : ''));
    stage.redraw();
  }
  sospetti(); upd();
  w.setFoot(t('<b>Perché i sospettati sono così pochi.</b> Se un intero r annulla il polinomio, raccogliendo r da tutti i termini con la x resta da spartire solo il <b>termine noto</b>: quindi r deve dividerlo esatto. Da infiniti candidati a una manciata — la stessa mossa che al livello :n rende Grover utile: prima si restringe lo spazio di ricerca, poi si cerca.', { n: nOf('11-grover') }));
  return { state: st };
}

/* ------------------------------------------------------------
   2) LA STAFFETTA DI RUFFINI (che è il metodo di Horner)
   ------------------------------------------------------------ */
export function staffettaLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('La staffetta di Ruffini'),
    subtitle: t('ogni corridore riceve il testimone, lo moltiplica per r e lo passa: alla fine esce il valore del polinomio'),
  });

  const st = { i: 0, r: 2, passo: 0, fatte: new Set(), vinto: false };
  const poli = () => POLINOMI[st.i].coef;

  const stage = new Stage(w.body, {
    height: 300,
    draw(ctx, s) {
      bg(ctx, s);
      const coef = poli();
      const { passi, resto } = ruffini(coef, st.r);
      const finito = st.passo >= coef.length;
      const top = hud(ctx, s, {
        goal: t('porta il testimone fino in fondo'),
        closeness: st.passo / coef.length,
        hit: finito,
        sub: t('staffette finite: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const n = coef.length;
      const larghezza = Math.min(96, Math.max(52, (s.w - 80) / n));
      const x0 = Math.max(16, Math.round((s.w - larghezza * n) / 2));
      const y1 = top + 24, y2 = y1 + 40, y3 = y2 + 44;

      text(ctx, t('coefficienti'), x0, y1 - 12, { size: 11, color: COL.dim, max: larghezza * n });
      for (let i = 0; i < n; i++) {
        const cx = x0 + i * larghezza;
        roundRect(ctx, cx + 3, y1, larghezza - 6, 30, 4,
          { fill: 'rgba(34,211,238,.14)', stroke: COL.cyan });
        text(ctx, num(coef[i]), cx + larghezza / 2, y1 + 15, { size: 14, align: 'center', color: COL.cyan, max: larghezza - 10 });

        if (i < st.passo && i > 0) {
          text(ctx, `+${passi[i].portato}`.replace('+-', '−'), cx + larghezza / 2, y2 + 6,
            { size: 12, align: 'center', color: COL.amber, max: larghezza - 8 });
        }
        if (i < st.passo) {
          const ultimo = i === n - 1;
          roundRect(ctx, cx + 3, y3, larghezza - 6, 30, 4,
            { fill: ultimo ? 'rgba(244,114,182,.2)' : 'rgba(52,211,153,.18)', stroke: ultimo ? COL.pink : COL.green, width: ultimo ? 2 : 1 });
          text(ctx, num(passi[i].somma), cx + larghezza / 2, y3 + 15,
            { size: 14, align: 'center', color: ultimo ? COL.pink : COL.green, max: larghezza - 10 });
        }
      }

      text(ctx, t('× :r e passa avanti', { r: num(st.r) }), x0 + larghezza * n - 3, y1 - 12,
        { size: 11, align: 'right', color: COL.amber, max: larghezza * n - 90 });
      text(ctx, t('testimone'), x0, y3 + 46, { size: 11, color: COL.green, max: larghezza * n });

      if (finito) {
        text(ctx, t('P(:r) = :v = il resto della divisione', { r: num(st.r), v: num(resto) }),
          x0, y3 + 66, { size: 12.5, color: COL.pink, max: s.w - x0 - 16 });
        text(ctx, t('moltiplicazioni: :h con la staffetta, :b a forza bruta', { h: costoHorner(coef), b: costoBruto(coef) }),
          x0, y3 + 84, { size: 12, color: COL.dim, max: s.w - x0 - 16 });
      }
      st.px = x0 + larghezza * n / 2; st.py = y3 + 15;
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sp = choice({
    label: t('Il polinomio'),
    items: POLINOMI.map((p, i) => ({ label: scrivi(p.coef), value: i })),
    value: 0,
    onchange: i => { st.i = i; st.passo = 0; upd(); },
  });
  const sr = choice({
    label: t('Il numero r'),
    items: [-3, -2, -1, 1, 2, 3].map(v => ({ label: num(v), value: v })),
    value: 2,
    onchange: v => { st.r = v; st.passo = 0; upd(); },
  });
  w.body.appendChild(controls(sp.root, sr.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🏃 ' + t('passa il testimone'), class: 'sm primary', onclick: () => { if (st.passo < poli().length) { st.passo++; sfx.click(); } upd(); } },
    { label: '⏭ ' + t('fino in fondo'), onclick: () => { st.passo = poli().length; sfx.ok(); upd(); } },
    { label: '↺ ' + t('ricomincia'), onclick: () => { st.passo = 0; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const coef = poli();
    const { resto, passi } = ruffini(coef, st.r);
    const finito = st.passo >= coef.length;
    const chiave = `${st.i}/${st.r}`;
    if (finito && !st.fatte.has(chiave)) {
      st.fatte.add(chiave);
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    const i = Math.max(0, st.passo - 1);
    out.set(
      (st.passo === 0
        ? t('Il primo corridore parte con il coefficiente più alto: non riceve niente da nessuno.')
        : st.passo === 1
          ? t('Testimone: <b>:s</b>. Adesso lo moltiplichi per r = :r e lo passi al corridore dopo.', { s: num(passi[0].somma), r: num(st.r) })
          : t('Il corridore :quale riceve <b>:portato</b> (cioè :prima × :erre), lo somma al suo coefficiente :suo e ottiene <b>:totale</b>.',
            { quale: i + 1, portato: num(passi[i].portato), prima: num(passi[i - 1].somma), erre: num(st.r), suo: num(passi[i].coefficiente), totale: num(passi[i].somma) })) +
      (finito
        ? '\n<span class="g">✓ ' + t('L\'ultimo numero è <b>:v</b>. Se è zero, r è una radice e gli altri numeri sono il polinomio rimasto. Se non è zero, hai comunque appena calcolato P(:r) con :h sole moltiplicazioni invece di :b.',
          { v: num(resto), r: num(st.r), h: costoHorner(coef), b: costoBruto(coef) }) + '</span>'
        : ''));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>La stessa riga di numeri fa due cose.</b> Se il resto è zero hai <b>diviso</b> il polinomio; se non lo è hai <b>calcolato</b> il polinomio in quel punto (teorema del resto). E l\'hai fatto con una moltiplicazione per coefficiente: è lo schema di Horner, il modo più veloce che si conosca. Al livello :n scoprirai che la DFT è proprio questo — calcolare un polinomio in tanti punti — e la FFT è il «dividi a metà» applicato qui dentro.', { n: nOf('16-dft') }));
  return { state: st };
}
