/* ============================================================
   PARTE M — SUCCESSIONI E LIMITI
   Cosa vuol dire davvero «tende a», e da dove esce e.

   Due cose che il corso usa da tempo senza averle mai definite:

   · «l'errore scende come 1/√n», appena visto al livello M·7. Il
     numero di tiri che serve per stare sotto un certo errore NON è
     un contorno della storia: è esattamente la definizione di
     limite. Qui il conto di M·7 diventa la regola del gioco, e la
     funzione che lo calcola è la stessa — importata, non riscritta;

   · «e^(iθ) è la freccia girata di θ» (livelli 14 e M·3). Lì si
     giustifica dicendo che moltiplicando le frecce gli angoli si
     sommano, e quindi si comporta come una potenza. Vero, ma non
     è una dimostrazione. La dimostrazione è un limite: e^x è quello
     che diventa un capitale con interesse x capitalizzato infinite
     volte, e se l'interesse è immaginario il capitale non cresce —
     gira. Quel «gira» è |e^(iθ)| = 1.

   E una che il corso dice e che qui si vede: la probabilità di
   Grover NON tende a 1. Oscilla. Continuare a girare peggiora.
   ============================================================ */

import { Stage, COL, bg, dot, text, roundRect, circle, arrow, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud } from './basicmath.js';
import { tiriPerErrore } from './probabilita.js';
import { probabilitaDopo } from './goniometria.js';

/* l'elenco di Grover su cui si guarda oscillare la probabilità */
export const CASELLE_GROVER = 16;

/* ------------------------------------------------------------
   LOGICA PURA — le successioni
   Ognuna è una funzione da n (che parte da 1) al suo termine, più
   il valore a cui tende. `limite: null` vuol dire «non tende a
   niente», ed è il caso interessante.
   ------------------------------------------------------------ */

export const SUCCESSIONI = {
  radice: {
    formula: '1/√n',
    f: n => 1 / Math.sqrt(n),
    limite: 0,
  },
  alterna: {
    formula: '(−1)ⁿ/n',
    f: n => (n % 2 ? -1 : 1) / n,
    limite: 0,
  },
  mezzi: {
    formula: '1 + 1/2ⁿ',
    f: n => 1 + 2 ** -n,
    limite: 1,
  },
  bandiera: {
    formula: '(−1)ⁿ',
    f: n => (n % 2 ? -1 : 1),
    limite: null,
  },
  grover: {
    formula: 'Grover su 16 caselle',
    f: n => probabilitaDopo(CASELLE_GROVER, n),
    limite: null,
  },
};

export const NOMI = Object.keys(SUCCESSIONI);

/** I primi `quanti` termini, da n = 1 in poi. */
export function termini(nome, quanti) {
  const { f } = SUCCESSIONI[nome];
  return Array.from({ length: quanti }, (_, i) => f(i + 1));
}

/** Quanto dista il termine n-esimo dal valore a cui la successione tende. */
export function distanza(nome, n) {
  const s = SUCCESSIONI[nome];
  if (s.limite === null) return Infinity;
  return Math.abs(s.f(n) - s.limite);
}

/**
 * Gli indici che da `da` in poi escono dal corridoio ±eps attorno al
 * limite. Se la lista è vuota, quel `da` vince la sfida.
 *
 * «Dentro» qui vuol dire distanza ≤ eps, bordo compreso. Sui libri si
 * trova più spesso <, ma siccome la definizione chiede che valga per
 * OGNI corridoio le due versioni dicono la stessa cosa — e con ≤ l'N
 * di questo gioco viene esattamente il numero di tiri del livello
 * M·7, che è il punto.
 */
export function fuori(nome, eps, da, fino) {
  const out = [];
  for (let n = da; n <= fino; n++) if (!(distanza(nome, n) <= eps)) out.push(n);
  return out;
}

/**
 * Il più piccolo N che vince: da N in poi si resta dentro ±eps, per
 * sempre. `null` se non esiste — ed è il caso che insegna di più.
 *
 * Il controllo «per sempre» non si può fare a mano su infiniti
 * termini: qui si sfrutta che per queste successioni la distanza dal
 * limite è, da un certo punto in poi, decrescente. Il tetto serve
 * solo a fermarsi quando un limite non c'è.
 */
const MEMO = new Map();
export function minimoN(nome, eps, tetto = 1e5) {
  const chiave = nome + '|' + eps + '|' + tetto;
  if (MEMO.has(chiave)) return MEMO.get(chiave);
  const risposta = cercaN(nome, eps, tetto);
  MEMO.set(chiave, risposta);
  return risposta;
}
function cercaN(nome, eps, tetto) {
  if (SUCCESSIONI[nome].limite === null) return null;
  for (let n = 1; n <= tetto; n++) {
    if (distanza(nome, n) <= eps && fuori(nome, eps, n, Math.min(tetto, n + 50)).length === 0) return n;
  }
  return null;
}

export const converge = nome => SUCCESSIONI[nome].limite !== null;

/* ------------------------------------------------------------
   LA BANCA DI BERNOULLI — da dove esce e
   Un capitale di 1 con interesse x, spezzato in n rate: ogni rata
   moltiplica per (1 + x/n), e le rate sono n.
   ------------------------------------------------------------ */

export const capitale = (x, n) => (1 + x / n) ** n;

/** L'errore rispetto al valore vero e^x: serve a dire quanto manca. */
export const erroreCapitale = (x, n) => Math.abs(capitale(x, n) - Math.exp(x));

/**
 * La stessa banca, ma con interesse IMMAGINARIO: ogni rata
 * moltiplica per (1 + iθ/n). Il capitale diventa una freccia, e la
 * freccia gira invece di allungarsi.
 */
export function passiImmaginari(theta, n) {
  const passi = [[1, 0]];
  const dr = 1, di = theta / n;
  for (let k = 0; k < n; k++) {
    const [a, b] = passi[k];
    passi.push([a * dr - b * di, a * di + b * dr]);
  }
  return passi;
}

export const capitaleImmaginario = (theta, n) => passiImmaginari(theta, n)[n];

/** Quanto la freccia si allontana dal punto giusto sul cerchio. */
export function erroreImmaginario(theta, n) {
  const [a, b] = capitaleImmaginario(theta, n);
  return Math.hypot(a - Math.cos(theta), b - Math.sin(theta));
}

/** La lunghezza della freccia: dovrebbe essere 1, e non lo è mai del tutto. */
export const lunghezzaImmaginaria = (theta, n) => (1 + (theta / n) ** 2) ** (n / 2);

/* ------------------------------------------------------------
   1) IL GIOCO DELL'ε — «da qui in poi non esco più»
   ------------------------------------------------------------ */
export function corridoioLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('Il gioco del corridoio'),
    subtitle: t('io stringo il corridoio, tu dimmi da che punto in poi la successione non esce più'),
  });

  const EPS = [0.2, 0.05, 0.01];
  const st = { nome: 'radice', eps: 0, N: 1, fatte: new Set(), vinto: false };
  const FINESTRA = 60;          // quanti termini si vedono sul grafico

  const stage = new Stage(w.body, {
    height: 300,
    draw(ctx, s) {
      bg(ctx, s);
      const succ = SUCCESSIONI[st.nome];
      const eps = EPS[st.eps];
      const scappati = fuori(st.nome, eps, st.N, st.N + 400);
      const preso = converge(st.nome) && scappati.length === 0;
      const top = hud(ctx, s, {
        goal: t('resta nel corridoio ±:e', { e: eps }),
        closeness: Math.min(1, 1 / (1 + scappati.length)),
        hit: preso,
        sub: t('corridoi vinti: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const rect = { x: 16, y: top + 10, w: s.w - 32, h: s.h - top - 62 };
      const valori = termini(st.nome, FINESTRA);
      /* la scala verticale si adatta a quello che c'è davvero da vedere:
         con una scala fissa l'oscillazione di Grover si schiacciava in una
         striscia e sembrava rumore invece che il punto del gioco */
      let basso = Math.min(...valori), alto = Math.max(...valori);
      if (converge(st.nome)) {
        basso = Math.min(basso, succ.limite - eps);
        alto = Math.max(alto, succ.limite + eps);
      }
      const margine = Math.max((alto - basso) * 0.12, 0.02);
      basso -= margine; alto += margine;
      const Y = v => rect.y + rect.h - ((v - basso) / (alto - basso)) * rect.h;
      const X = n => rect.x + ((n - 1) / (FINESTRA - 1)) * rect.w;

      // il corridoio ±eps: si vede stringersi quando la sfida sale
      if (converge(st.nome)) {
        const L = succ.limite;
        ctx.fillStyle = 'rgba(52,211,153,.13)';
        ctx.fillRect(rect.x, Y(L + eps), rect.w, Math.max(2, Y(L - eps) - Y(L + eps)));
        ctx.strokeStyle = COL.green; ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(rect.x, Y(L)); ctx.lineTo(rect.x + rect.w, Y(L)); ctx.stroke();
        ctx.setLineDash([]);
        text(ctx, t('limite :L', { L: succ.limite }), rect.x + 3, Y(L) - 9,
          { size: 10.5, color: COL.green, max: rect.w - 6 });
      }

      // la riga verticale del «da qui in poi»
      const xN = X(Math.min(st.N, FINESTRA));
      ctx.strokeStyle = COL.violet; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(xN, rect.y); ctx.lineTo(xN, rect.y + rect.h); ctx.stroke();
      text(ctx, 'N = ' + st.N, Math.min(xN + 5, rect.x + rect.w - 60), rect.y + 10,
        { size: 11, color: COL.violet, max: 70 });

      // la spezzata che unisce i termini: senza, l'oscillazione non si legge
      ctx.strokeStyle = 'rgba(125,211,252,.28)'; ctx.lineWidth = 1.2;
      ctx.beginPath();
      valori.forEach((v, i) => { const px = X(i + 1), py = Y(v); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
      ctx.stroke();

      // i termini: prima di N grigi, dopo verdi se stanno dentro
      for (let n = 1; n <= FINESTRA; n++) {
        const dopo = n >= st.N;
        const colore = !converge(st.nome) ? (dopo ? COL.violet : '#4a5878')
          : !dopo ? '#4a5878'
            : distanza(st.nome, n) <= eps ? COL.green : COL.pink;
        dot(ctx, X(n), Y(valori[n - 1]), dopo ? 3.4 : 2.4, colore);
      }

      text(ctx, succ.formula, rect.x + 3, rect.y + rect.h + 14,
        { size: 12, color: COL.cyan, max: rect.w - 6 });
      /* prima si guarda se un limite c'è: dire «escono ancora 401 termini»
         di una successione che non tende a niente è vero e fuorviante */
      text(ctx, !converge(st.nome)
        ? t('questa non tende a niente')
        : scappati.length
          ? t('da N in poi escono ancora :q termini', { q: scappati.length })
          : t('da N in poi non esce più nessuno'),
      rect.x + 3, rect.y + rect.h + 32,
      { size: 11, color: !converge(st.nome) ? COL.violet : scappati.length ? COL.pink : COL.green, max: rect.w - 6 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const scelta = choice({
    items: NOMI.map(k => ({ label: SUCCESSIONI[k].formula, value: k })),
    value: 'radice',
    onchange: v => { st.nome = v; st.N = 1; sN.value = 1; sfx.click(); upd(); },
  });
  const sN = slider({
    label: t('da qui in poi'), min: 1, max: FINESTRA, step: 1, value: 1,
    fmt: v => 'N = ' + v, oninput: v => { st.N = v; upd(); },
  });
  w.body.appendChild(controls(scelta.root, sN.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🔎 ' + t('il più piccolo N che vince'), class: 'sm primary', onclick: () => {
      const m = minimoN(st.nome, EPS[st.eps]);
      if (m === null || m > FINESTRA) { sfx.err(); upd(m); return; }
      st.N = m; sN.value = m; sfx.ok(); upd();
    } },
    { label: '📏 ' + t('stringi il corridoio'), onclick: () => { st.eps = (st.eps + 1) % EPS.length; sfx.click(); upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd(nonTrovato = false) {
    const eps = EPS[st.eps];
    const scappati = fuori(st.nome, eps, st.N, st.N + 400);
    if (converge(st.nome) && scappati.length === 0 && !st.fatte.has(st.eps)) {
      st.fatte.add(st.eps);
      sfx.ok(); fx.burst(stage.w / 2, stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    const righe = [
      t('La sfida è questa: io scelgo un corridoio largo <b>±:e</b> attorno al limite, tu trovi un <b>N</b> tale che da lì in poi la successione ci resti dentro <b>per sempre</b>. Se ci riesci per ogni corridoio, per quanto stretto, allora quella successione <b>tende</b> a quel numero. Questa è la definizione, tutta qui.', { e: eps }),
    ];
    if (!converge(st.nome)) {
      righe.push('<span class="b">' + t('Questa non ha limite: qualunque N scegli, più avanti la successione torna a scappare. Non è che «non lo hai trovato»: non c\'è.') + '</span>');
    } else if (scappati.length) {
      const m = minimoN(st.nome, eps);
      righe.push(m !== null && m > FINESTRA
        ? '<span class="b">' + t('Qui l\'N esiste, ma è <b>:m</b>: fuori da questo grafico. Non è un difetto del gioco — è che questa successione ci mette troppo. Con un corridoio così stretto serve una successione che scenda più in fretta.', { m }) + '</span>'
        : '<span class="a">' + t('Da N = :n in poi escono ancora :q termini. Sposta N più a destra.', { n: st.N, q: scappati.length }) + '</span>');
    } else {
      const m = minimoN(st.nome, eps);
      righe.push('<span class="ok">' + t('✓ Da N = :n in poi la successione non esce più. Il minimo che bastava era <b>:m</b>.', { n: st.N, m }) + '</span>');
    }
    if (nonTrovato) righe.push('<span class="b">' + t('Nella finestra che si vede non c\'è: o la successione non tende a niente, o il corridoio è così stretto che N finisce fuori dal grafico.') + '</span>');
    out.set(righe.join('\n'));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Questo gioco lo hai già giocato al livello :n.</b> Lì la domanda era «quanti tiri servono per stare sotto un certo errore», e la risposta era (σ/errore)². Ecco: quel numero È l\'N di questo gioco, per la successione 1/√n. La definizione di limite non è un formalismo da matematici — è la stessa domanda che si fa chi deve decidere quante volte far girare un circuito.', { n: nOf('m7-probabilita') }));
  return { state: st };
}

/* ------------------------------------------------------------
   2) LA BANCA DI BERNOULLI — e, e poi l'interesse immaginario
   ------------------------------------------------------------ */
export function bancaLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('La banca di Bernoulli'),
    subtitle: t('interesse del 100% spezzato in n rate: dove va a finire il capitale?'),
  });

  const st = { modo: 'vero', n: 1, theta: 90, fatte: new Set(), vinto: false };
  const RADIANTI = g => (g * Math.PI) / 180;

  const stage = new Stage(w.body, {
    height: 300,
    draw(ctx, s) {
      bg(ctx, s);
      const vero = st.modo === 'vero';
      const err = vero ? erroreCapitale(1, st.n) : erroreImmaginario(RADIANTI(st.theta), st.n);
      const soglia = vero ? 0.01 : 0.02;
      const preso = err < soglia;
      const top = hud(ctx, s, {
        goal: vero ? t('arriva a e a meno di :s', { s: soglia }) : t('porta la freccia sul cerchio'),
        closeness: Math.min(1, soglia / Math.max(err, 1e-9)),
        hit: preso,
        sub: t('prove riuscite: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      if (vero) disegnaVero(ctx, s, top);
      else disegnaImmaginario(ctx, s, top);
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  /* il capitale che sale verso e, rata dopo rata */
  function disegnaVero(ctx, s, top) {
    const rect = { x: 40, y: top + 16, w: s.w - 56, h: s.h - top - 74 };
    const yMin = 1.9, yMax = 2.85;
    const Y = v => rect.y + rect.h - (v - yMin) / (yMax - yMin) * rect.h;
    const X = k => rect.x + (Math.log(k) / Math.log(200)) * rect.w;

    // la riga di e, il tetto che non si tocca mai
    ctx.strokeStyle = COL.amber; ctx.lineWidth = 1.4; ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(rect.x, Y(Math.E)); ctx.lineTo(rect.x + rect.w, Y(Math.E)); ctx.stroke();
    ctx.setLineDash([]);
    text(ctx, 'e = 2,7182818', rect.x + 4, Y(Math.E) - 10, { size: 11, color: COL.amber, max: rect.w - 8 });

    ctx.strokeStyle = COL.cyan; ctx.lineWidth = 2; ctx.beginPath();
    for (let k = 1; k <= 200; k++) {
      const px = X(k), py = Y(capitale(1, k));
      k === 1 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    dot(ctx, X(Math.min(st.n, 200)), Y(capitale(1, st.n)), 5, COL.cyan);

    text(ctx, t('rate: :n · capitale: :c', { n: st.n, c: capitale(1, st.n).toFixed(5) }),
      16, s.h - 34, { size: 12, color: COL.txt, max: s.w - 32 });
    text(ctx, t('più rate, più il capitale sale — ma non supera mai e'),
      16, s.h - 14, { size: 11, color: COL.dim, max: s.w - 32 });
  }

  /* la freccia che invece di allungarsi gira */
  function disegnaImmaginario(ctx, s, top) {
    const th = RADIANTI(st.theta);
    const passi = passiImmaginari(th, st.n);
    /* con poche rate la spezzata esce parecchio dal cerchio — con una
       rata sola e mezzo giro il capitale è lungo 3,3 — quindi la scala
       si prende dal passo più lungo, non dal cerchio */
    const fuoriMax = Math.max(1.05, ...passi.map(([a, b]) => Math.hypot(a, b)));
    const spazio = Math.min((s.h - top - 80) / 2, s.w / 2 - 24);
    const scala = spazio / fuoriMax;
    const cx = s.w / 2, cy = top + 26 + spazio;
    const P = ([a, b]) => [cx + a * scala, cy - b * scala];

    circle(ctx, cx, cy, scala, { stroke: '#3a4a6d', dash: [4, 4] });
    dot(ctx, cx, cy, 2, '#3a4a6d');

    // la spezzata delle rate: ogni pezzo è un passo di (1 + iθ/n)
    ctx.strokeStyle = COL.violet; ctx.lineWidth = 1.6; ctx.beginPath();
    passi.forEach((z, k) => { const [px, py] = P(z); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
    ctx.stroke();
    passi.forEach(z => { const [px, py] = P(z); dot(ctx, px, py, 2.2, COL.violet); });

    // dove si dovrebbe arrivare, e dove si arriva
    const [gx, gy] = P([Math.cos(th), Math.sin(th)]);
    circle(ctx, gx, gy, 7, { stroke: COL.green, width: 2 });
    const [ax, ay] = P(passi[st.n]);
    arrow(ctx, cx, cy, ax, ay, { color: COL.cyan, width: 2 });

    text(ctx, t('il cerchio dove il capitale non cresce'), 16, top + 14,
      { size: 10.5, color: '#7f8fb3', max: s.w - 32 });
    const [a, b] = passi[st.n];
    text(ctx, t('rate: :n · capitale: :a + :b i · lunghezza: :l',
      { n: st.n, a: a.toFixed(3), b: b.toFixed(3), l: Math.hypot(a, b).toFixed(4) }),
    16, s.h - 32, { size: 11.5, color: COL.txt, max: s.w - 32 });
    text(ctx, t('l\'interesse immaginario non fa crescere il capitale: lo fa girare'),
      16, s.h - 13, { size: 11, color: COL.dim, max: s.w - 32 });
  }

  const sm = choice({
    items: [
      { label: '💰 ' + t('interesse vero'), value: 'vero' },
      { label: '🌀 ' + t('interesse immaginario'), value: 'immaginario' },
    ],
    value: 'vero',
    onchange: v => { st.modo = v; sfx.click(); rifai(); upd(); },
  });
  w.body.appendChild(controls(sm.root));
  const zona = h('div');
  w.body.appendChild(zona);
  const out = readout('');
  w.body.appendChild(out.root);

  function rifai() {
    zona.textContent = '';
    const sn = slider({
      label: t('in quante rate'), min: 1, max: 200, step: 1, value: st.n,
      fmt: v => v + '×', oninput: v => { st.n = v; upd(); },
    });
    if (st.modo === 'vero') { zona.appendChild(controls(sn.root)); return; }
    const sth = slider({
      label: t('interesse immaginario θ'), min: 15, max: 180, step: 15, value: st.theta,
      fmt: v => v + '°', oninput: v => { st.theta = v; upd(); },
    });
    zona.appendChild(controls(sn.root, sth.root));
  }
  rifai();

  function upd() {
    const vero = st.modo === 'vero';
    const th = RADIANTI(st.theta);
    const err = vero ? erroreCapitale(1, st.n) : erroreImmaginario(th, st.n);
    const soglia = vero ? 0.01 : 0.02;
    const chiave = vero ? 'vero' : 'immaginario';
    if (err < soglia && !st.fatte.has(chiave)) {
      st.fatte.add(chiave);
      sfx.ok(); fx.burst(stage.w / 2, stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    if (vero) {
      out.set(
        t('Metti 1 in banca al 100% di interesse. Pagato in una volta sola diventa 2. Spezzato in <b>:n</b> rate diventa (1 + 1/:n)^:n = <b>:c</b>: ogni rata è più piccola, ma frutta anche lei.',
          { n: st.n, c: capitale(1, st.n).toFixed(5) }) + '\n' +
        t('Più si spezza, più si guadagna — ma sempre meno. Il capitale non scappa: si ferma a <b>e = 2,718281…</b>, e ne dista ancora :d.',
          { d: erroreCapitale(1, st.n).toFixed(5) }) + '\n' +
        '<span class="a">' + t('Questo è un limite, ed è il primo numero della storia definito così: non «quanto fa», ma «dove va a finire».') + '</span>');
    } else {
      const [a, b] = capitaleImmaginario(th, st.n);
      out.set(
        t('Stessa banca, ma l\'interesse è <b>i·θ</b>: immaginario. Ogni rata moltiplica per (1 + iθ/n), e moltiplicare per un numero complesso vuol dire <b>allungare e girare</b> — solo che qui l\'allungamento è quasi zero e il giro no.') + '\n' +
        t('Con <b>:n</b> rate il capitale è <b>:a + :b i</b>, lungo <b>:l</b>. Il punto giusto sul cerchio è (cos θ, sin θ), e ne dista :d.',
          { n: st.n, a: a.toFixed(3), b: b.toFixed(3), l: Math.hypot(a, b).toFixed(4), d: erroreImmaginario(th, st.n).toFixed(4) }) + '\n' +
        '<span class="ok">' + t('Ecco perché e^(iθ) è la freccia girata di θ e non un\'altra cosa: è l\'unico posto dove quel limite può andare a finire.') + '</span>');
    }
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Serve davvero, e non solo per essere pignoli.</b> Al livello :n si scrive e^(iθ) per «freccia girata di θ», e la giustificazione era che moltiplicando le frecce gli angoli si sommano. Quella è una somiglianza; questo è il conto. E lo stesso limite, con al posto di iθ una matrice, è il modo in cui un computer quantistico simula un sistema fisico: si spezza il tempo in n pezzetti e si applica n volte una porta quasi-identità.', { n: nOf('m3-complessi') }));
  return { state: st };
}

/* tiriPerErrore arriva da M·7: la formula del corridoio per 1/√n è
   la stessa che lì dice quanti tiri servono. Riesportarla serve a
   dire, nei test, che è proprio la stessa e non una copia. */
export { tiriPerErrore };
