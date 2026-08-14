/* ============================================================
   PARTE M — SERIE DI TAYLOR
   Qualunque curva, vista da vicino, è un polinomio.

   Due cose che questo livello mette a posto:

   · e^(iθ) = cos θ + i·sin θ. Al livello M·8 è arrivata come
     limite — la banca con l'interesse immaginario. Qui arriva per
     la seconda strada, quella che ha usato davvero Eulero nel
     1748: si scrivono le tre serie, si guarda dove finiscono i
     termini pari e dove quelli dispari, e la formula si legge sul
     foglio. I test la verificano separando le due metà;

   · «i giri di Grover sono circa (π/4)·√N». Quel «circa» è una
     serie di Taylor troncata al primo termine: per liste grandi
     l'angolo di Grover arcsin(√(1/N)) vale quasi esattamente
     1/√N, e da lì esce il √N che dà il vantaggio quantistico. È
     il punto in cui approssimare non è sciatteria: è il conto.

   E c'è un muro da toccare: la serie di 1/(1−x) funziona solo per
   |x| < 1, e fuori NESSUN numero di termini basta. È il raggio di
   convergenza, e si vede esplodere.
   ============================================================ */

import { Stage, COL, bg, dot, text, roundRect, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud } from './basicmath.js';
import { probabilitaDopo } from './goniometria.js';

const fattoriale = n => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };

/* ------------------------------------------------------------
   LE SERIE
   `termine(k, x)` è il pezzo di grado k. `raggio` è la distanza
   entro cui la serie funziona: Infinity quando funziona sempre.
   ------------------------------------------------------------ */

export const SERIE = {
  seno: {
    formula: 'sin x',
    f: x => Math.sin(x),
    termine: (k, x) => (k % 2 === 0 ? 0 : ((k - 1) / 2 % 2 ? -1 : 1) * x ** k / fattoriale(k)),
    raggio: Infinity,
    da: -7, a: 7,
  },
  coseno: {
    formula: 'cos x',
    f: x => Math.cos(x),
    termine: (k, x) => (k % 2 ? 0 : (k / 2 % 2 ? -1 : 1) * x ** k / fattoriale(k)),
    raggio: Infinity,
    da: -7, a: 7,
  },
  esponenziale: {
    formula: 'eˣ',
    f: x => Math.exp(x),
    termine: (k, x) => x ** k / fattoriale(k),
    raggio: Infinity,
    da: -3, a: 3,
  },
  geometrica: {
    formula: '1/(1−x)',
    f: x => 1 / (1 - x),
    termine: (k, x) => x ** k,
    raggio: 1,
    da: -2, a: 2,
  },
};

export const NOMI = Object.keys(SERIE);

/** La somma dei primi n+1 termini, cioè il polinomio di grado n. */
export function taylor(nome, x, n) {
  const s = SERIE[nome];
  let somma = 0;
  for (let k = 0; k <= n; k++) somma += s.termine(k, x);
  return somma;
}

export const erroreTaylor = (nome, x, n) => Math.abs(taylor(nome, x, n) - SERIE[nome].f(x));

/** Il grado che serve per stare sotto una certa soglia in quel punto. */
export function gradoPerErrore(nome, x, soglia, tetto = 60) {
  for (let n = 0; n <= tetto; n++) if (erroreTaylor(nome, x, n) <= soglia) return n;
  return null;
}

/** L'errore peggiore su tutto il tratto disegnato: quello che conta. */
export function errorePeggiore(nome, n, da, a, passi = 200) {
  let peggio = 0;
  for (let i = 0; i <= passi; i++) {
    const x = da + (i / passi) * (a - da);
    peggio = Math.max(peggio, erroreTaylor(nome, x, n));
  }
  return peggio;
}

/**
 * Il coefficiente di grado k, cioè f⁽ᵏ⁾(0)/k!. Non serve al gioco:
 * serve al test, per controllare che le serie scritte a mano siano
 * davvero quelle di Taylor e non formule copiate a caso.
 */
export const coefficiente = (nome, k) => SERIE[nome].termine(k, 1);

/* ------------------------------------------------------------
   LA FORMULA DI EULERO, PER SERIE
   e^(ix) = somma di (ix)^k/k!. Il termine k-esimo è reale quando k
   è pari e immaginario quando è dispari: separandoli escono cos x
   e sin x. Qui si tiene il conto delle due metà.
   ------------------------------------------------------------ */

export function eulerParziale(x, n) {
  let re = 0, im = 0;
  for (let k = 0; k <= n; k++) {
    const grandezza = x ** k / fattoriale(k);
    /* i^k gira: 1, i, −1, −i, 1, … */
    const giro = k % 4;
    if (giro === 0) re += grandezza;
    else if (giro === 1) im += grandezza;
    else if (giro === 2) re -= grandezza;
    else im -= grandezza;
  }
  return [re, im];
}

/* ------------------------------------------------------------
   I PICCOLI ANGOLI, E IL √N DI GROVER
   ------------------------------------------------------------ */

/** L'angolo di Grover, in radianti: quello vero. */
export const angoloEsatto = N => Math.asin(Math.sqrt(1 / N));

/** Lo stesso angolo, troncato al primo termine di Taylor. */
export const angoloApprossimato = N => 1 / Math.sqrt(N);

/**
 * I giri che davvero conviene fare: si sale finché la probabilità
 * cresce e ci si ferma sulla cima. Non è la stessa cosa del massimo
 * assoluto — più avanti la curva risale e a volte va anche più in
 * alto — ma quei giri costano interrogazioni in più, e un algoritmo
 * si ferma alla prima cima.
 */
export function giriMigliori(N, tetto = 4000) {
  let k = 0;
  while (k < tetto && probabilitaDopo(N, k + 1) > probabilitaDopo(N, k)) k++;
  return k;
}

/** I giri secondo la formula famosa, quella che nasce dall'approssimazione. */
export const giriDallaFormula = N => Math.max(0, Math.round((Math.PI / 4) * Math.sqrt(N) - 0.5));

/* ------------------------------------------------------------
   1) IL POLINOMIO CHE INSEGUE LA CURVA
   ------------------------------------------------------------ */
export function taylorLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('Il polinomio che insegue la curva'),
    subtitle: t('aggiungi termini e guarda quanto lontano riesce a starle dietro'),
  });

  const st = { nome: 'seno', n: 1, fatte: new Set(), vinto: false };
  const SOGLIA = 0.01;

  const stage = new Stage(w.body, {
    height: 300,
    draw(ctx, s) {
      bg(ctx, s);
      const g = SERIE[st.nome];
      const peggio = errorePeggiore(st.nome, st.n, g.da, g.a);
      const preso = peggio < SOGLIA;
      const top = hud(ctx, s, {
        goal: t('errore sotto :s ovunque', { s: SOGLIA }),
        closeness: Math.min(1, SOGLIA / Math.max(peggio, 1e-12)),
        hit: preso,
        sub: t('curve inseguite: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const rect = { x: 16, y: top + 10, w: s.w - 32, h: s.h - top - 58 };
      const alto = 2.6, basso = -2.6;
      const X = x => rect.x + ((x - g.da) / (g.a - g.da)) * rect.w;
      const Y = v => rect.y + rect.h / 2 - (v / (alto - basso)) * rect.h;

      // gli assi
      ctx.strokeStyle = '#31405f'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(rect.x, Y(0)); ctx.lineTo(rect.x + rect.w, Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(0), rect.y); ctx.lineTo(X(0), rect.y + rect.h); ctx.stroke();

      // la zona dove la serie funziona, quando non è tutto il piano
      if (Number.isFinite(g.raggio)) {
        ctx.fillStyle = 'rgba(52,211,153,.08)';
        ctx.fillRect(X(-g.raggio), rect.y, X(g.raggio) - X(-g.raggio), rect.h);
        for (const seg of [-g.raggio, g.raggio]) {
          ctx.strokeStyle = COL.green; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
          ctx.beginPath(); ctx.moveTo(X(seg), rect.y); ctx.lineTo(X(seg), rect.y + rect.h); ctx.stroke();
          ctx.setLineDash([]);
        }
        text(ctx, t('qui dentro funziona'), X(0), rect.y + 12,
          { size: 10.5, align: 'center', color: COL.green, max: X(g.raggio) - X(-g.raggio) - 8 });
      }

      // la curva vera
      ctx.strokeStyle = COL.cyan; ctx.lineWidth = 2.2; ctx.beginPath();
      let staccata = true;
      for (let i = 0; i <= 300; i++) {
        const x = g.da + (i / 300) * (g.a - g.da);
        const v = g.f(x);
        if (!Number.isFinite(v) || Math.abs(v) > 3) { staccata = true; continue; }
        const px = X(x), py = Y(v);
        staccata ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        staccata = false;
      }
      ctx.stroke();

      // il polinomio, che la insegue finché ce la fa
      ctx.strokeStyle = COL.amber; ctx.lineWidth = 2; ctx.beginPath();
      staccata = true;
      for (let i = 0; i <= 300; i++) {
        const x = g.da + (i / 300) * (g.a - g.da);
        const v = taylor(st.nome, x, st.n);
        if (!Number.isFinite(v) || Math.abs(v) > 3) { staccata = true; continue; }
        const px = X(x), py = Y(v);
        staccata ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        staccata = false;
      }
      ctx.stroke();
      dot(ctx, X(0), Y(g.f(0)), 4, COL.pink);

      text(ctx, g.formula, rect.x + 4, rect.y + rect.h - 6, { size: 12, color: COL.cyan, max: 90 });
      text(ctx, t('grado :n · errore peggiore: :e', { n: st.n, e: peggio > 99 ? '∞' : peggio.toFixed(4) }),
        16, s.h - 30, { size: 11.5, color: COL.txt, max: s.w - 32 });
      text(ctx, t('incollato in zero, si stacca allontanandosi'),
        16, s.h - 12, { size: 11, color: COL.dim, max: s.w - 32 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sf = choice({
    items: NOMI.map(k => ({ label: SERIE[k].formula, value: k })),
    value: 'seno',
    onchange: v => { st.nome = v; sfx.click(); upd(); },
  });
  const sn = slider({
    label: t('grado del polinomio'), min: 0, max: 21, step: 1, value: st.n,
    fmt: v => 'x^' + v, oninput: v => { st.n = v; upd(); },
  });
  w.body.appendChild(controls(sf.root, sn.root));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const g = SERIE[st.nome];
    const rif = Number.isFinite(g.raggio) ? 0.5 : 1;
    const peggio = errorePeggiore(st.nome, st.n, g.da, g.a);
    if (peggio < SOGLIA && !st.fatte.has(st.nome)) {
      st.fatte.add(st.nome);
      sfx.ok(); fx.burst(stage.w / 2, stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    const righe = [
      /* il punto di confronto sta dentro il raggio: per 1/(1−x) in
         x = 1 la funzione non vale niente, vale infinito */
      t('Il polinomio di grado <b>:n</b> vale <b>:p</b> in x = :x, dove la funzione vale <b>:v</b>. Sul tratto disegnato l\'errore peggiore è <b>:e</b>.',
        { n: st.n, x: rif, p: taylor(st.nome, rif, st.n).toFixed(5), v: g.f(rif).toFixed(5), e: peggio > 99 ? '∞' : peggio.toFixed(5) }),
      t('Vicino a zero bastano pochi termini; per stare dietro anche lontano ne servono molti di più. È sempre la stessa domanda: non «ci arriva», ma <b>quanto in fretta</b>.'),
    ];
    if (st.nome === 'geometrica') {
      righe.push('<span class="b">' + t('Ma questa ha un muro. Fuori dalla striscia verde — cioè per |x| ≥ 1 — la serie non si avvicina a niente: <b>esplode</b>, e aggiungere termini peggiora. Si chiama <b>raggio di convergenza</b>, e qui vale 1. Provaci: porta il grado al massimo e guarda cosa fa la curva gialla ai bordi.') + '</span>');
    } else if (st.nome === 'seno') {
      righe.push('<span class="a">' + t('Guarda il primo termine: per il seno è <b>x</b>. Vuol dire che per angoli piccoli <b>sin x ≈ x</b>, ed è l\'approssimazione più usata di tutta la fisica. Nel gioco qui sotto è quella che fa comparire il √N di Grover.') + '</span>');
    }
    out.set(righe.join('\n'));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Perché funziona.</b> Il polinomio di Taylor è costruito per <b>copiare</b> la funzione in un punto: stesso valore, stessa pendenza (la derivata del livello :d), stessa curvatura, e così via. Ogni termine in più impone che coincida anche la derivata successiva. Da lì la formula dei coefficienti, f⁽ᵏ⁾(0)/k!, e il fatto che l\'inseguimento parta perfetto in zero e si allenti man mano che ci si allontana.', { d: nOf('21b-variazionale') }));
  return { state: st };
}

/* ------------------------------------------------------------
   2) I PICCOLI ANGOLI E IL √N DI GROVER
   ------------------------------------------------------------ */
export function piccoliAngoliLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('Da sin x ≈ x al √N di Grover'),
    subtitle: t('l\'approssimazione più famosa della fisica, e il numero di giri che ne esce'),
  });

  const st = { esp: 4, fatte: new Set(), vinto: false };   // N = 2^esp

  const stage = new Stage(w.body, {
    height: 310,
    draw(ctx, s) {
      bg(ctx, s);
      const N = 2 ** st.esp;
      const esatto = angoloEsatto(N), approx = angoloApprossimato(N);
      const scarto = Math.abs(esatto - approx) / esatto;
      const veri = giriMigliori(N), formula = giriDallaFormula(N);
      const top = hud(ctx, s, {
        goal: t('scarto sotto l\'1%'),
        closeness: Math.min(1, 0.01 / Math.max(scarto, 1e-9)),
        hit: scarto < 0.01,
        sub: t('prove: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      // il pezzo di sinistra: sin x e x che si separano
      const rect = { x: 16, y: top + 8, w: s.w - 32, h: (s.h - top - 76) };
      const XM = 1.4;
      const X = x => rect.x + (x / XM) * rect.w;
      const Y = v => rect.y + rect.h - (v / XM) * rect.h;
      ctx.strokeStyle = '#31405f'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(rect.x, Y(0)); ctx.lineTo(rect.x + rect.w, Y(0)); ctx.stroke();

      ctx.strokeStyle = COL.amber; ctx.lineWidth = 1.8; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(XM), Y(XM)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = COL.cyan; ctx.lineWidth = 2.2; ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const x = (i / 200) * XM;
        const px = X(x), py = Y(Math.sin(x));
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.stroke();

      // dove sta l'angolo di Grover per questa N
      dot(ctx, X(esatto), Y(Math.sin(esatto)), 5, COL.green);
      dot(ctx, X(approx), Y(approx), 4, COL.pink);
      ctx.strokeStyle = 'rgba(52,211,153,.5)'; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(X(esatto), Y(0)); ctx.lineTo(X(esatto), Y(Math.sin(esatto))); ctx.stroke();
      ctx.setLineDash([]);
      text(ctx, 'x', X(XM) - 22, Y(XM) + 12, { size: 11, color: COL.amber, max: 40 });
      text(ctx, 'sin x', X(XM) - 40, Y(Math.sin(XM)) + 14, { size: 11, color: COL.cyan, max: 60 });

      /* due righe corte invece di una lunga: sul telefono la riga
         unica finiva nei puntini proprio sullo scarto */
      text(ctx, t('N = :n · θ vero :v · θ ≈ :a', { n: N, v: esatto.toFixed(4), a: approx.toFixed(4) }),
        16, s.h - 48, { size: 11.5, color: COL.txt, max: s.w - 32 });
      text(ctx, t('scarto :s% · giri veri :v · formula :f',
        { s: (scarto * 100).toFixed(2), v: veri, f: formula }),
      16, s.h - 30, { size: 12, color: veri === formula ? COL.green : COL.pink, max: s.w - 32 });
      text(ctx, t('più lunga è la lista, più l\'approssimazione è buona'),
        16, s.h - 12, { size: 11, color: COL.dim, max: s.w - 32 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const se = slider({
    label: t('quanto è lunga la lista'), min: 1, max: 20, step: 1, value: st.esp,
    fmt: v => '2^' + v + ' = ' + 2 ** v, oninput: v => { st.esp = v; upd(); },
  });
  w.body.appendChild(controls(se.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🔎 ' + t('lista corta'), class: 'sm', onclick: () => { st.esp = 2; se.value = 2; sfx.click(); upd(); } },
    { label: '📈 ' + t('lista lunga'), class: 'sm primary', onclick: () => { st.esp = 16; se.value = 16; sfx.click(); upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const N = 2 ** st.esp;
    const esatto = angoloEsatto(N), approx = angoloApprossimato(N);
    const scarto = Math.abs(esatto - approx) / esatto;
    const veri = giriMigliori(N), formula = giriDallaFormula(N);
    if (scarto < 0.01 && !st.fatte.has('vicino')) segna('vicino');
    if (scarto > 0.04 && !st.fatte.has('lontano')) segna('lontano');
    out.set([
      t('Con una lista di <b>:n</b> caselle l\'angolo di Grover vale <b>:v</b> radianti. Il primo termine di Taylor dice 1/√N = <b>:a</b>: sbaglia del <b>:s%</b>.',
        { n: N, v: esatto.toFixed(5), a: approx.toFixed(5), s: (scarto * 100).toFixed(2) }),
      t('I giri che davvero danno la probabilità più alta sono <b>:v</b>. La formula famosa (π/4)·√N ne dice <b>:f</b>.',
        { v: veri, f: formula }),
      '<span class="a">' + t('Ecco da dove viene il √N. Servono circa (π/4)/θ giri, e se θ ≈ 1/√N allora i giri sono circa (π/4)·√N. Il vantaggio quantistico più famoso del corso è <b>un\'approssimazione di Taylor troncata al primo termine</b>.') + '</span>',
    ].join('\n'));
    stage.redraw();
  }
  function segna(chiave) {
    st.fatte.add(chiave);
    sfx.ok(); fx.burst(stage.w / 2, stage.h / 2);
    if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
  }
  upd();
  w.setFoot(t('<b>Approssimare qui non è essere sbrigativi: è il conto.</b> Al livello :g hai visto che ogni giro di Grover aggiunge 2θ e che i giri utili sono quelli che portano vicino a 90°. Quel θ è arcsin(√(1/N)), e per liste grandi la serie di Taylor dice che vale 1/√N a meno di un pelo. Da lì, e solo da lì, esce il √N che rende Grover più veloce di qualunque ricerca classica.', { g: nOf('m2-goniometria') }));
  return { state: st };
}
