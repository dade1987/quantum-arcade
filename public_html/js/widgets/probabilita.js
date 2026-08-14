/* ============================================================
   PARTE M — PROBABILITÀ SUL SERIO
   Media, varianza, l'errore che scende come 1/√N, e la
   disuguaglianza di Bell.

   Due cose che nel corso finora sono state date per buone:

   · «l'errore su una media scende come 1/√tiri» (livello 21·b). È il
     motivo per cui un algoritmo variazionale costa così tanto, e qui
     si vede succedere invece di leggerlo;

   · «in modo classico non si supera il 75%, col quantistico si arriva
     all'85%» (livello 4, la sfida delle buste). Quel 75% non è una
     stima: è il massimo su TUTTE le strategie classiche possibili, e
     sono sedici — si contano a mano. E l'85,36% è cos²(22,5°).

   Il secondo gioco è il test CHSH, quello per cui è stato dato il
   Nobel per la fisica 2022.
   ============================================================ */

import { Stage, COL, bg, dot, text, roundRect, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud } from './basicmath.js';

const RAD = g => (g * Math.PI) / 180;
const pc = v => (v * 100).toFixed(1);

/* ------------------------------------------------------------
   LOGICA PURA — media, varianza, errore
   ------------------------------------------------------------ */

export const media = xs => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/** La varianza «della popolazione»: media degli scarti al quadrato. */
export function varianza(xs) {
  if (xs.length < 2) return 0;
  const m = media(xs);
  return media(xs.map(x => (x - m) ** 2));
}
export const deviazione = xs => Math.sqrt(varianza(xs));

/** L'errore atteso sulla media di n misure: σ/√n. La riga che costa cara. */
export const erroreAtteso = (sigma, n) => (n > 0 ? sigma / Math.sqrt(n) : Infinity);

/** Quanti tiri servono per scendere sotto un certo errore. */
export const tiriPerErrore = (sigma, errore) => Math.ceil((sigma / errore) ** 2);

/** Una moneta truccata: vale 1 con probabilità p, 0 altrimenti. */
export const sigmaMoneta = p => Math.sqrt(p * (1 - p));

/* ------------------------------------------------------------
   BAYES — aggiornare quello che si crede
   ------------------------------------------------------------ */

/**
 * La probabilità che una cosa ci sia davvero, dato che il test dice di sì.
 * `base` = quanto è diffusa; `trova` = quanto il test la vede quando c'è;
 * `falsi` = quanto il test dice di sì quando non c'è.
 */
export function bayes(base, trova, falsi) {
  const veri = base * trova;
  const sbagliati = (1 - base) * falsi;
  const totale = veri + sbagliati;
  return totale < 1e-12 ? 0 : veri / totale;
}

/* ------------------------------------------------------------
   IL GIOCO DI BELL (CHSH)
   L'arbitro manda a testa o croce una domanda x ad Anna e una y a
   Bruno, che non possono parlarsi. Devono rispondere a e b con
   a XOR b = x AND y. Le domande sono quattro, equiprobabili.
   ------------------------------------------------------------ */

export const DOMANDE = [[0, 0], [0, 1], [1, 0], [1, 1]];

/** Una strategia classica: cosa risponde Anna per x=0 e x=1, idem Bruno. */
export function vinceClassica(sa, sb) {
  let vinte = 0;
  for (const [x, y] of DOMANDE) if ((sa[x] ^ sb[y]) === (x & y)) vinte++;
  return vinte / DOMANDE.length;
}

/** Tutte le sedici strategie deterministiche, con la loro percentuale. */
export function tutteLeClassiche() {
  const out = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const sa = [i & 1, (i >> 1) & 1], sb = [j & 1, (j >> 1) & 1];
      out.push({ sa, sb, p: vinceClassica(sa, sb) });
    }
  }
  return out;
}

/** Il massimo classico: si conta, non si stima. */
export const massimoClassico = () => Math.max(...tutteLeClassiche().map(s => s.p));

/**
 * La strategia quantistica: Anna misura al suo angolo a seconda di x,
 * Bruno al suo a seconda di y, su una coppia entangled. Per due
 * direzioni che differiscono di δ, i due esiti coincidono con
 * probabilità cos²δ.
 */
export function vinceQuantistica(a, b) {
  let somma = 0;
  for (const [x, y] of DOMANDE) {
    const d = RAD(a[x] - b[y]);
    somma += (x & y) ? Math.sin(d) ** 2 : Math.cos(d) ** 2;
  }
  return somma / DOMANDE.length;
}

/* Gli angoli che raggiungono il massimo: 0, 45 per Anna; 22,5 e −22,5 per Bruno. */
export const ANGOLI_OTTIMI = { a: [0, 45], b: [22.5, -22.5] };
export const massimoQuantistico = () => Math.cos(RAD(22.5)) ** 2;

/* ------------------------------------------------------------
   1) LA MEDIA CHE SI ASSESTA, E QUANTO COSTA
   ------------------------------------------------------------ */
export function mediaLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('La media si assesta, ma piano'),
    subtitle: t('tira, guarda la media avvicinarsi — e guarda quanto costa un decimale in più'),
  });

  const st = { p: 0.7, tiri: [], obiettivo: 0, fatte: new Set(), vinto: false };
  /* due traguardi di precisione: il secondo costa cento volte il primo */
  const TRAGUARDI = [0.05, 0.01];

  const stage = new Stage(w.body, {
    height: 320,
    draw(ctx, s) {
      bg(ctx, s);
      const n = st.tiri.length;
      const m = media(st.tiri);
      const sigma = sigmaMoneta(st.p);
      const atteso = erroreAtteso(sigma, n);
      const soglia = TRAGUARDI[st.obiettivo];
      const preso = n > 0 && atteso <= soglia;
      const top = hud(ctx, s, {
        goal: t('errore atteso sotto :s', { s: soglia }),
        closeness: n ? Math.min(1, soglia / atteso) : 0,
        hit: preso,
        sub: t('traguardi raggiunti: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const rect = { x: 16, y: top + 22, w: s.w - 32, h: s.h - top - 96 };
      const Y = v => rect.y + rect.h - v * rect.h;

      // la riga del valore vero e la banda dell'errore atteso
      if (n > 0) {
        const banda = Math.min(rect.h / 2, atteso * rect.h);
        ctx.fillStyle = 'rgba(52,211,153,.12)';
        ctx.fillRect(rect.x, Y(st.p) - banda, rect.w, 2 * banda);
      }
      ctx.strokeStyle = COL.green; ctx.lineWidth = 1.4; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(rect.x, Y(st.p)); ctx.lineTo(rect.x + rect.w, Y(st.p)); ctx.stroke();
      ctx.setLineDash([]);
      /* l'etichetta sta SOPRA la riga verde e dentro il riquadro: fuori a
         sinistra non ci starebbe, e sul telefono verrebbe tagliata */
      text(ctx, t('valore vero: :p', { p: st.p.toFixed(2) }), rect.x + 4, Y(st.p) - 10,
        { size: 11, color: COL.green, max: rect.w - 8 });

      // la media man mano che i tiri arrivano
      if (n > 1) {
        ctx.strokeStyle = COL.cyan; ctx.lineWidth = 2;
        ctx.beginPath();
        let acc = 0;
        for (let i = 0; i < n; i++) {
          acc += st.tiri[i];
          const x = rect.x + (i / Math.max(1, n - 1)) * rect.w;
          const y = Y(acc / (i + 1));
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
        dot(ctx, rect.x + rect.w, Y(m), 5, COL.cyan);
      }

      text(ctx, t('tiri: :n · media: :m · errore atteso σ/√n: :e',
        { n, m: n ? m.toFixed(4) : '—', e: n ? atteso.toFixed(4) : '—' }),
      16, s.h - 50, { size: 12, color: COL.txt, max: s.w - 32 });
      /* due righe corte invece di una lunga: sul telefono una riga sola
         finirebbe con i puntini proprio sulla parte che spiega il perché */
      text(ctx, t('quadruplicare i tiri dimezza l\'errore'),
        16, s.h - 30, { size: 11, color: COL.dim, max: s.w - 32 });
      text(ctx, t('è il √ che sta nella formula σ/√n'),
        16, s.h - 12, { size: 11, color: COL.dim, max: s.w - 32 });
      st.px = rect.x + rect.w; st.py = Y(m);
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sp = slider({ label: t('la moneta esce 1 con probabilità'), min: 0.1, max: 0.9, step: 0.05, value: st.p, fmt: v => v.toFixed(2), oninput: v => { st.p = v; st.tiri = []; upd(); } });
  w.body.appendChild(controls(sp.root));
  const tira = quanti => { for (let i = 0; i < quanti; i++) st.tiri.push(Math.random() < st.p ? 1 : 0); sfx.click(); upd(); };
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🎲 ' + t('+10 tiri'), class: 'sm primary', onclick: () => tira(10) },
    { label: '🎲 ' + t('+100'), onclick: () => tira(100) },
    { label: '🎲 ' + t('+1000'), onclick: () => tira(1000) },
    { label: '🎯 ' + t('altro traguardo'), onclick: () => { st.obiettivo = (st.obiettivo + 1) % TRAGUARDI.length; upd(); } },
    { label: '↺ ' + t('ricomincia'), onclick: () => { st.tiri = []; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const n = st.tiri.length;
    const sigma = sigmaMoneta(st.p);
    const atteso = erroreAtteso(sigma, n);
    const soglia = TRAGUARDI[st.obiettivo];
    if (n > 0 && atteso <= soglia && !st.fatte.has(st.obiettivo)) {
      st.fatte.add(st.obiettivo);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    out.set(
      t('La moneta vale 1 con probabilità <b>:p</b>. La sua deviazione standard è √(p·(1−p)) = <b>:s</b>.',
        { p: st.p.toFixed(2), s: sigma.toFixed(3) }) + '\n' +
      (n
        ? t('Con <b>:n</b> tiri la media misurata è <b>:m</b> e lo scarto vero dal valore giusto è <b>:d</b>; l\'errore che ti aspettavi era σ/√n = <b>:e</b>.',
          { n, m: media(st.tiri).toFixed(4), d: Math.abs(media(st.tiri) - st.p).toFixed(4), e: atteso.toFixed(4) })
        : t('Non hai ancora tirato niente.')) + '\n' +
      '<span class="a">' + t('Per un errore di :s servono circa <b>:q</b> tiri. Per un decimale in più — cioè dieci volte più preciso — ne servirebbero <b>cento volte tanti</b>.',
        { s: soglia, q: tiriPerErrore(sigma, soglia) }) + '</span>');
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Questa è la riga che al livello :n costa cara.</b> Un computer quantistico non «legge» una probabilità: la stima ripetendo la misura, e l\'errore sulla stima scende come 1/√tiri. Un decimale in più costa cento volte le misure. Non è un difetto delle macchine di oggi: è statistica, e vale anche per le macchine perfette di domani.', { n: nOf('21b-variazionale') }));
  return { state: st };
}

/* ------------------------------------------------------------
   2) IL GIOCO DI BELL — dove il classico si ferma e il quantistico no
   ------------------------------------------------------------ */
export function bellLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    modo: 'classico',
    title: t('Il gioco di Bell'),
    subtitle: t('Anna e Bruno non possono parlarsi: quante domande su quattro riescono a indovinare?'),
  });

  const st = {
    modo: 'classico',
    /* si parte da un accordo pessimo (25%): il 75% è facile da toccare,
       ma va toccato da chi gioca, non trovato già fatto */
    sa: [0, 0], sb: [1, 1],
    /* si parte con tutti gli angoli a zero: così anche il quantistico
       vale 75%, e il giocatore deve trovarli, non trovarseli */
    aa: [0, 0], ab: [0, 0],
    fatte: new Set(), vinto: false,
  };
  const MAXC = massimoClassico();
  const MAXQ = massimoQuantistico();

  const stage = new Stage(w.body, {
    height: 280,
    draw(ctx, s) {
      bg(ctx, s);
      const classico = st.modo === 'classico';
      const p = classico ? vinceClassica(st.sa, st.sb) : vinceQuantistica(st.aa, st.ab);
      const traguardo = classico ? MAXC : MAXC + 0.02;
      const preso = p >= traguardo - 1e-9;
      const top = hud(ctx, s, {
        goal: classico ? t('arriva al massimo classico') : t('supera il muro del 75%'),
        /* col quantistico la barra parte dal muro classico: partendo da
           p/traguardo sembrerebbe quasi vinta già a 75%, che è il punto
           esatto in cui invece non si è ancora fatto niente */
        closeness: classico
          ? Math.min(1, p / traguardo)
          : Math.max(0, Math.min(1, (p - MAXC) / (traguardo - MAXC))),
        hit: preso,
        sub: t('sfide vinte: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      // le quattro domande, una riga per ciascuna
      const y0 = top + 16, rh = 30;
      DOMANDE.forEach(([x, y], i) => {
        const yy = y0 + i * rh;
        const vinta = classico
          ? ((st.sa[x] ^ st.sb[y]) === (x & y))
          : null;
        const pq = classico ? (vinta ? 1 : 0)
          : ((x & y) ? Math.sin(RAD(st.aa[x] - st.ab[y])) ** 2 : Math.cos(RAD(st.aa[x] - st.ab[y])) ** 2);
        roundRect(ctx, 16, yy, s.w - 32, rh - 6, 5, {
          fill: pq > 0.9 ? 'rgba(52,211,153,.12)' : pq < 0.4 ? 'rgba(244,114,182,.10)' : 'rgba(251,191,36,.10)',
          stroke: '#2b3a58',
        });
        /* riga corta: sul telefono «devono rispondere UGUALE» finiva nei
           puntini proprio sulla parola che dice cosa si deve fare */
        text(ctx, t('Anna :x · Bruno :y → risposte :cosa', { x, y, cosa: (x & y) ? t('DIVERSE') : t('UGUALI') }),
          26, yy + 15, { size: 11.5, color: COL.txt, max: s.w * 0.72 - 26 });
        text(ctx, pc(pq) + '%', s.w - 26, yy + 15,
          { size: 12.5, align: 'right', color: pq > 0.9 ? COL.green : pq < 0.4 ? COL.pink : COL.amber, max: 90 });
      });

      // la barra grande con i due muri
      const by = y0 + 4 * rh + 12, bw = s.w - 48, bx = 24;
      roundRect(ctx, bx, by, bw, 20, 8, { stroke: '#2b3a58' });
      roundRect(ctx, bx, by, Math.max(4, bw * p), 20, 8, { fill: p > MAXC + 1e-9 ? COL.violet : COL.blue, alpha: .85 });
      const xc = bx + bw * MAXC, xq = bx + bw * MAXQ;
      for (const [x, col, et] of [[xc, COL.amber, '75%'], [xq, COL.green, '85,4%']]) {
        ctx.strokeStyle = col; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(x, by - 6); ctx.lineTo(x, by + 26); ctx.stroke();
        text(ctx, et, x, by + 40, { size: 10.5, align: 'center', color: col, max: 60 });
      }
      text(ctx, t('vinci il :p% delle volte', { p: pc(p) }), bx, by - 10,
        { size: 13, color: p > MAXC + 1e-9 ? COL.violet : COL.txt, max: bw });
      /* sotto la barra la morale del muro, che cambia con la macchina */
      text(ctx, classico
        ? t('nessun accordo preso prima supera il 75%')
        : t('il tetto quantistico è cos²(22,5°) = 85,4%'),
      16, s.h - 14, { size: 11, color: classico ? COL.amber : COL.green, max: s.w - 32 });
      st.px = bx + bw * p; st.py = by + 10;
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sm = choice({
    items: [
      { label: '💻 ' + t('accordo classico'), value: 'classico' },
      { label: '⚛️ ' + t('coppia entangled'), value: 'quantistico' },
    ],
    value: 'classico',
    onchange: v => { st.modo = v; w.setModo(v); sfx.click(); rifai(); upd(); },
  });
  w.body.appendChild(controls(sm.root));
  const zona = h('div', { style: { marginTop: '8px' } });
  w.body.appendChild(zona);
  const out = readout('');
  w.body.appendChild(out.root);

  function rifai() {
    zona.textContent = '';
    if (st.modo === 'classico') {
      zona.appendChild(buttons([
        { label: t('Anna, se le chiedono 0: risponde :r', { r: st.sa[0] }), class: 'sm', onclick: () => { st.sa[0] ^= 1; rifai(); upd(); } },
        { label: t('Anna, se le chiedono 1: risponde :r', { r: st.sa[1] }), class: 'sm', onclick: () => { st.sa[1] ^= 1; rifai(); upd(); } },
        { label: t('Bruno, se gli chiedono 0: risponde :r', { r: st.sb[0] }), class: 'sm', onclick: () => { st.sb[0] ^= 1; rifai(); upd(); } },
        { label: t('Bruno, se gli chiedono 1: risponde :r', { r: st.sb[1] }), class: 'sm', onclick: () => { st.sb[1] ^= 1; rifai(); upd(); } },
      ]));
    } else {
      const s1 = slider({ label: t('Anna, domanda 0'), min: -90, max: 90, step: 7.5, value: st.aa[0], fmt: v => v + '°', oninput: v => { st.aa[0] = v; upd(); } });
      const s2 = slider({ label: t('Anna, domanda 1'), min: -90, max: 90, step: 7.5, value: st.aa[1], fmt: v => v + '°', oninput: v => { st.aa[1] = v; upd(); } });
      const s3 = slider({ label: t('Bruno, domanda 0'), min: -90, max: 90, step: 7.5, value: st.ab[0], fmt: v => v + '°', oninput: v => { st.ab[0] = v; upd(); } });
      const s4 = slider({ label: t('Bruno, domanda 1'), min: -90, max: 90, step: 7.5, value: st.ab[1], fmt: v => v + '°', oninput: v => { st.ab[1] = v; upd(); } });
      zona.appendChild(controls(s1.root, s2.root, s3.root, s4.root));
    }
  }

  function upd() {
    const classico = st.modo === 'classico';
    const p = classico ? vinceClassica(st.sa, st.sb) : vinceQuantistica(st.aa, st.ab);
    if (classico && p >= MAXC - 1e-9) st.fatte.add('classico');
    if (!classico && p > MAXC + 1e-9) st.fatte.add('quantistico');
    if (st.fatte.size >= cfg.need && !st.vinto) {
      st.vinto = true; sfx.ok(); fx.flash();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      cfg.onWin && cfg.onWin();
    }
    out.set(
      classico
        ? t('Anna e Bruno si sono messi d\'accordo <b>prima</b>, e poi non possono più parlarsi. Con questa strategia vincono il <b>:p%</b> delle volte.', { p: pc(p) }) + '\n' +
          (p >= MAXC - 1e-9
            ? '<span class="g">✓ ' + t('Questo è il massimo. E non è «il massimo che hai trovato»: le strategie possibili sono <b>sedici</b> in tutto, e nessuna supera il 75%. Puoi provarle tutte, ci vogliono due minuti.') + '</span>'
            : '<span class="a">' + t('Si può fare meglio: prova a cambiare una risposta.') + '</span>')
        : t('Anna e Bruno condividono una coppia entangled e misurano ciascuno nella direzione che ha scelto per quella domanda. Vincono il <b>:p%</b>.', { p: pc(p) }) + '\n' +
          (p > MAXC + 1e-9
            ? '<span class="g">✓ ' + t('Sopra il 75%. Nessun accordo preso prima può arrivarci: questo è il punto dell\'esperimento che ha vinto il Nobel 2022. Il massimo possibile è :m%, cioè cos²(22,5°).', { m: pc(MAXQ) }) + '</span>'
            : '<span class="a">' + t('Ancora sotto il muro classico: prova con Anna a 0° e 45°, Bruno a 22,5° e −22,5°.') + '</span>'));
    stage.redraw();
  }
  rifai(); upd();
  w.setFoot(t('<b>Perché questo esperimento conta.</b> Se le risposte fossero già decise in partenza — cioè se ogni particella «portasse con sé» il risultato di ogni misura possibile — allora si ricadrebbe in una delle sedici strategie, e il tetto sarebbe il 75%. Superarlo, in laboratorio, vuol dire che quelle risposte <b>non erano decise prima</b>. È la cosa più vicina a una dimostrazione sperimentale che il mondo non è classico, e vale il Nobel per la fisica 2022. Nel corso l\'hai già incontrata come sfida delle buste, al livello :n.', { n: nOf('04-due-qubit') }));
  return { state: st };
}
