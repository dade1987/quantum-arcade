/* ============================================================
   PARTE C — QUANDO TANTE COSE SI SOMMANO (E QUANDO SI CANCELLANO)
   La serie geometrica, appena prima della DFT.

   Il livello della DFT mostra le frecce che girano e il picco che nasce, e
   funziona: si vede. Ma «si vede» non è «si capisce», e la domanda che resta
   in gola è sempre la stessa — perché su tutte le frequenze sbagliate la
   somma viene ZERO, e non un numero qualunque?

   La risposta è una sola riga di matematica di quattro secoli fa: sommare
   tante cose che si moltiplicano ogni volta per lo stesso numero. Se quel
   numero è 1, si accumulano tutte. Se è una rotazione, si dispongono in
   cerchio e il cerchio si chiude: somma zero, esattamente zero.

   Due giochi, la stessa formula:
   · con numeri veri: mezzo + un quarto + un ottavo… che non superano mai il 2;
   · con le frecce: la catena che si chiude, e il picco che compare solo
     quando il passo è nullo.

   Qui non c'è niente di quantistico: è l'attrezzo classico che rende
   leggibile tutto quello che viene dopo (DFT, QFT, stima di fase).
   ============================================================ */

import { Stage, COL, bg, grid, dot, text, roundRect, arrow, makePlane, FX, hsl } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud, nearSound } from './basicmath.js';

/* ------------------------------------------------------------
   LOGICA PURA
   ------------------------------------------------------------ */

/** La somma 1 + r + r² + … + r^(n−1), sommata pezzo per pezzo. */
export function sommaPezzo(r, n) {
  let s = 0, x = 1;
  for (let i = 0; i < n; i++) { s += x; x *= r; }
  return s;
}

/** La stessa somma con la formula chiusa: (1 − rⁿ)/(1 − r). */
export function sommaFormula(r, n) {
  return Math.abs(1 - r) < 1e-12 ? n : (1 - Math.pow(r, n)) / (1 - r);
}

/** Dove va a finire la somma se i pezzi non finiscono mai (solo per |r| < 1). */
export const sommaInfinita = r => (Math.abs(r) < 1 ? 1 / (1 - r) : Infinity);

/**
 * La stessa somma, ma con le frecce: n frecce lunghe 1, ognuna girata di
 * `passo` gradi più della precedente. È la serie geometrica con ragione
 * complessa, cioè il cuore della trasformata di Fourier.
 */
export function catenaFrecce(passoGradi, n) {
  const punti = [{ x: 0, y: 0 }];
  let x = 0, y = 0;
  for (let k = 0; k < n; k++) {
    const a = (k * passoGradi) * Math.PI / 180;
    x += Math.cos(a); y += Math.sin(a);
    punti.push({ x, y });
  }
  return { punti, somma: { x, y }, modulo: Math.hypot(x, y) };
}

/**
 * Il modulo della stessa somma, con la formula chiusa (nucleo di Dirichlet):
 * |sin(n·Δ/2) / sin(Δ/2)|. Vale n quando Δ è un giro intero, zero quando Δ è
 * un multiplo esatto di un giro diviso n. È la formula che fa il picco.
 */
export function moduloFormula(passoGradi, n) {
  const d = passoGradi * Math.PI / 180;
  const sotto = Math.sin(d / 2);
  if (Math.abs(sotto) < 1e-12) return n;
  return Math.abs(Math.sin(n * d / 2) / sotto);
}

/* ------------------------------------------------------------
   1) I PEZZI CHE SI RIMPICCIOLISCONO
   Mezzo, un quarto, un ottavo… quanto fa in tutto? Non infinito.
   ------------------------------------------------------------ */
export function serieReale(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('I pezzi che si rimpiccioliscono'),
    subtitle: t('ogni pezzo è una frazione del precedente: dove si ferma il totale?'),
  });

  const BERSAGLI = [2, 4, 1.5];
  const st = { r: 0.5, n: 6, bers: 0, centrati: new Set(), vinto: false };
  const near = nearSound();

  const stage = new Stage(w.body, {
    height: 280,
    draw(ctx, s) {
      bg(ctx, s);
      const tot = sommaPezzo(st.r, st.n);
      const bers = BERSAGLI[st.bers];
      const centrato = Math.abs(tot - bers) < 0.05;
      const top = hud(ctx, s, {
        goal: t('porta il totale a :bersaglio', { bersaglio: String(bers).replace('.', ',') }),
        closeness: 1 - Math.min(1, Math.abs(tot - bers) / 2),
        hit: centrato,
        sub: t('totali centrati: :fatti su :totali', { fatti: st.centrati.size, totali: cfg.need }),
      });

      /* I pezzi, uno di fila all'altro: si vede a occhio che il totale non
         scappa via, perché ogni pezzo è una frazione di quello prima. */
      const inizio = top + 20;
      const x0 = 24, larghezza = s.w - 48;
      const scala = larghezza / 5;             // il righello arriva a 5
      const y = inizio + 46;
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, y + 34); ctx.lineTo(x0 + 5 * scala, y + 34); ctx.stroke();
      for (let u = 0; u <= 5; u++) {
        ctx.beginPath(); ctx.moveTo(x0 + u * scala, y + 30); ctx.lineTo(x0 + u * scala, y + 38); ctx.stroke();
        text(ctx, String(u), x0 + u * scala, y + 50, { size: 10, align: 'center', color: '#59688c' });
      }

      let acc = 0, pezzo = 1;
      for (let i = 0; i < st.n; i++) {
        const larg = Math.max(1, pezzo * scala);
        roundRect(ctx, x0 + acc * scala, y, larg, 26, 3, {
          fill: hsl(i, st.n), stroke: 'rgba(255,255,255,.25)', alpha: 0.55,
        });
        if (larg > 26) text(ctx, pezzo.toFixed(2), x0 + acc * scala + larg / 2, y + 13, { size: 11, align: 'center', color: COL.txtBright, max: larg - 4 });
        acc += pezzo; pezzo *= st.r;
      }

      // il muro: dove finirebbe il totale se i pezzi non finissero mai
      const limite = sommaInfinita(st.r);
      if (isFinite(limite) && limite <= 5) {
        ctx.strokeStyle = COL.violet; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(x0 + limite * scala, y - 12); ctx.lineTo(x0 + limite * scala, y + 30); ctx.stroke();
        ctx.setLineDash([]);
        text(ctx, t('il muro: :limite', { limite: limite.toFixed(2) }), x0 + limite * scala, y - 20,
          { size: 11, align: 'center', color: COL.violet, max: 120 });
      }
      // il bersaglio
      ctx.strokeStyle = COL.amber; ctx.lineWidth = 2; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(x0 + bers * scala, y + 26); ctx.lineTo(x0 + bers * scala, y + 60); ctx.stroke();
      ctx.setLineDash([]);
      text(ctx, '🎯', x0 + bers * scala, y + 70, { size: 12, align: 'center', color: COL.amber });

      text(ctx, t('totale: :tot', { tot: tot.toFixed(3) }), 24, s.h - 14,
        { size: 14, color: centrato ? COL.green : COL.cyan, max: s.w - 48 });
      st.px = x0 + Math.min(5, tot) * scala; st.py = y + 13;
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sr = slider({
    label: t('Ogni pezzo è questa frazione del precedente'), min: 0.05, max: 0.95, step: 0.01, value: st.r,
    fmt: v => v.toFixed(2), oninput: v => { st.r = v; upd(); },
  });
  const sn = slider({
    label: t('Quanti pezzi'), min: 1, max: 20, step: 1, value: st.n,
    fmt: v => String(v), oninput: v => { st.n = v; upd(); },
  });
  w.body.appendChild(controls(sr.root, sn.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: t('metà ogni volta'), onclick: () => { sr.value = 0.5; st.r = 0.5; upd(); } },
    { label: '🎯 ' + t('altro bersaglio'), class: 'sm primary', onclick: () => { st.bers = (st.bers + 1) % BERSAGLI.length; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const tot = sommaPezzo(st.r, st.n);
    const bers = BERSAGLI[st.bers];
    const centrato = Math.abs(tot - bers) < 0.05;
    if (centrato && !st.centrati.has(String(bers))) {
      st.centrati.add(String(bers));
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.centrati.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else if (!centrato) {
      near(1 - Math.min(1, Math.abs(tot - bers) / 2));
    }
    const limite = sommaInfinita(st.r);
    out.set(
      t('Somma dei primi :n pezzi: <b>:tot</b>.', { n: st.n, tot: tot.toFixed(3) }) + '\n' +
      t('Con la formula: (1 − :r^:n) / (1 − :r) = <b>:formula</b> — stesso numero, senza sommare a mano.',
        { r: st.r.toFixed(2), n: st.n, formula: sommaFormula(st.r, st.n).toFixed(3) }) + '\n' +
      t('Se i pezzi non finissero mai: <b>:limite</b>. Il totale non supera mai quel muro, per quanti pezzi aggiungi.',
        { limite: limite.toFixed(3) }) +
      (centrato ? '\n<span class="g">✓ ' + t('bersaglio centrato!') + '</span>' : ''));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Il fatto sorprendente:</b> infiniti pezzi, totale finito. Mezzo più un quarto più un ottavo… non arriva mai a 2, ci si avvicina e basta. La formula che lo dice — <b>(1 − rⁿ)/(1 − r)</b> — è la stessa che fra un attimo farà nascere il picco della trasformata di Fourier: cambia solo che al posto di una frazione ci sarà una <b>rotazione</b>.'));
  return { state: st };
}

/* ------------------------------------------------------------
   2) LA CATENA DI FRECCE
   Stessa somma, ma ogni pezzo è girato di un passo fisso. O si
   accumulano tutte, o si chiudono in cerchio e fanno zero.
   ------------------------------------------------------------ */
export function serieFrecce(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('La catena di frecce'),
    subtitle: t('stessa somma, ma ogni pezzo è girato di un passo fisso'),
  });

  const st = { passo: 25, n: 8, obiettivo: 'zero', fatti: new Set(), vinto: false };
  const near = nearSound();

  const stage = new Stage(w.body, {
    height: 330,
    draw(ctx, s) {
      bg(ctx, s);
      const cat = catenaFrecce(st.passo, st.n);
      const zero = cat.modulo < 0.2;
      const pieno = cat.modulo > st.n * 0.95;
      const centrato = st.obiettivo === 'zero' ? zero : pieno;
      const top = hud(ctx, s, {
        goal: st.obiettivo === 'zero' ? t('fai sparire la somma') : t('fai la somma più grande possibile'),
        closeness: st.obiettivo === 'zero' ? 1 - Math.min(1, cat.modulo / st.n) : cat.modulo / st.n,
        hit: centrato,
        sub: t('obiettivi centrati: :fatti su :totali', { fatti: st.fatti.size, totali: cfg.need }),
      });

      const inizio = top + 14;
      const alto = s.h - inizio - 26;
      /* La scala si adatta alla figura: una catena chiusa sta dentro un
         cerchietto, una allineata è lunga quanto il numero di frecce. Con una
         scala fissa uno dei due casi si vedrebbe grande come una moneta. */
      const raggio = Math.max(1.6, ...cat.punti.map(q => Math.hypot(q.x, q.y)));
      const scala = Math.min((s.w - 50) / (2.5 * raggio), alto / (2.3 * raggio));
      const P = makePlane(s.w / 2, inizio + alto / 2, scala);
      grid(ctx, 0, inizio, s.w, alto + 26, scala, scala);

      // la catena, freccia dopo freccia
      for (let i = 0; i < st.n; i++) {
        const a = cat.punti[i], b = cat.punti[i + 1];
        arrow(ctx, P.X(a.x), P.Y(a.y), P.X(b.x), P.Y(b.y),
          { color: hsl(i, st.n), width: 2, head: 6, alpha: 0.9 });
      }
      // la somma: dal primo punto all'ultimo
      arrow(ctx, P.cx, P.cy, P.X(cat.somma.x), P.Y(cat.somma.y),
        { color: centrato ? COL.green : COL.amber, width: 3.4 });
      dot(ctx, P.cx, P.cy, 4, '#64748b', false);
      st.px = P.X(cat.somma.x); st.py = P.Y(cat.somma.y);

      /* Una riga sola: su un telefono le due scritte, una a sinistra e una a
         destra, si incontravano in mezzo e si scrivevano addosso. */
      text(ctx, t('lunghezza della somma: :mod su :n', { mod: cat.modulo.toFixed(2), n: st.n }), 14, s.h - 10,
        { size: 12, color: centrato ? COL.green : COL.amber, max: s.w - 28 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sp = slider({
    label: t('Di quanto gira ogni freccia in più (gradi)'), min: 0, max: 360, step: 1, value: st.passo,
    fmt: v => v + '°', oninput: v => { st.passo = v; upd(); },
  });
  const sn = choice({
    label: t('Quante frecce'),
    items: [4, 8, 16].map(v => ({ label: String(v), value: v })),
    value: st.n,
    onchange: v => { st.n = v; upd(); },
  });
  w.body.appendChild(controls(sp.root, sn.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🎯 ' + t('cambia obiettivo'), class: 'sm primary',
      onclick: () => { st.obiettivo = st.obiettivo === 'zero' ? 'max' : 'zero'; upd(); } },
    { label: t('un giro diviso il numero di frecce'),
      onclick: () => { st.passo = Math.round(360 / st.n); sp.value = st.passo; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const cat = catenaFrecce(st.passo, st.n);
    const zero = cat.modulo < 0.2;
    const pieno = cat.modulo > st.n * 0.95;
    const centrato = st.obiettivo === 'zero' ? zero : pieno;
    const chiave = st.obiettivo + ':' + st.n + ':' + Math.round(st.passo);
    if (centrato && !st.fatti.has(chiave)) {
      st.fatti.add(chiave);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.fatti.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else if (!centrato) {
      near(st.obiettivo === 'zero' ? 1 - Math.min(1, cat.modulo / st.n) : cat.modulo / st.n);
    }
    out.set(
      t('Passo <b>:passo°</b>, <b>:n</b> frecce. Lunghezza della somma: <b>:mod</b> (su :n possibili).',
        { passo: st.passo, n: st.n, mod: cat.modulo.toFixed(2) }) + '\n' +
      t('Con la formula: |sin(:n·Δ/2) / sin(Δ/2)| = <b>:formula</b>.', { n: st.n, formula: moduloFormula(st.passo, st.n).toFixed(2) }) + '\n' +
      (zero
        ? '<span class="g">' + t('La catena si è chiusa: le frecce fanno un giro esatto e si annullano a vicenda. Somma zero — non "piccola": zero.') + '</span>'
        : pieno
          ? '<span class="c">' + t('Passo nullo (o un giro intero): tutte le frecce puntano nello stesso verso e si sommano tutte. È il picco.') + '</span>'
          : t('Le frecce puntano un po\' ovunque: la somma è un numero qualunque, né grande né nullo.')));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Questa è la trasformata di Fourier, in una frase.</b> Per ogni frequenza di prova, la DFT gira i dati di un passo fisso e li somma: se il passo è sbagliato, la catena si chiude e viene zero; se è quello giusto, il passo è nullo, le frecce si allineano e nasce il <b>picco</b>. Il livello :n lo fa sui dati veri — ma il motivo per cui funziona è quello che hai appena mosso con il cursore.', { n: nOf('16-dft') }));
  return { state: st };
}
