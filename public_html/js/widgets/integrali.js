/* ============================================================
   PARTE M — INTEGRALI
   L'area sotto una curva, e il teorema che la lega alla derivata.

   Tre debiti che questo livello salda:

   · al livello M·8 si è visto che una somma di infiniti pezzi può
     fare un numero. L'integrale è quella stessa somma, fatta di
     rettangoli sempre più stretti: si vede l'errore scendere, e si
     scopre che scegliere BENE l'altezza del rettangolo (il punto di
     mezzo invece del bordo) fa scendere l'errore come 1/n² invece
     che come 1/n;

   · «la probabilità totale fa 1» è una frase ripetuta da tutto il
     corso. Su una variabile continua quella frase è un integrale,
     e qui si calcola: la funzione |ψ|² della particella in una
     scatola ha area esattamente 1;

   · al livello 0·8 il logaritmo è arrivato come «l'esponente che
     serve». C'è un altro modo di definirlo, e qui si vede: ln t è
     l'area sotto 1/x da 1 a t. Non ci somiglia — è uguale, e il
     test lo verifica su cento valori.

   Il secondo gioco è il teorema fondamentale del calcolo, quello che
   dice che derivare e integrare sono l'una l'inversa dell'altra. Si
   guarda con un tachimetro e un contachilometri: l'altezza della
   curva di sopra è la pendenza della curva di sotto.
   ============================================================ */

import { Stage, COL, bg, dot, text, roundRect, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud } from './basicmath.js';

/* ------------------------------------------------------------
   LE FUNZIONI DA INTEGRARE
   Ognuna con la sua primitiva scritta a mano: serve per sapere il
   valore vero, quello a cui i rettangoli devono avvicinarsi.
   ------------------------------------------------------------ */

export const FUNZIONI = {
  parabola: {
    formula: 'x²',
    f: x => x * x,
    F: x => x ** 3 / 3,
    a: 0, b: 1,
  },
  seno: {
    formula: 'sin x',
    f: x => Math.sin(x),
    F: x => -Math.cos(x),
    a: 0, b: Math.PI,
  },
  reciproca: {
    formula: '1/x',
    f: x => 1 / x,
    F: x => Math.log(x),
    a: 1, b: Math.E,
  },
  scatola: {
    /* |ψ|² della particella nella scatola: 2·sin²(πx) su [0,1].
       L'area è 1 perché deve esserlo: è una probabilità. */
    formula: '2·sin²(πx)',
    f: x => 2 * Math.sin(Math.PI * x) ** 2,
    F: x => x - Math.sin(2 * Math.PI * x) / (2 * Math.PI),
    a: 0, b: 1,
  },
};

export const NOMI = Object.keys(FUNZIONI);

/** Il valore vero dell'area, dalla primitiva. */
export const areaEsatta = nome => {
  const g = FUNZIONI[nome];
  return g.F(g.b) - g.F(g.a);
};

/**
 * La somma dei rettangoli: `dove` dice a che altezza tagliarli —
 * al bordo sinistro, al destro, o al punto di mezzo. La scelta
 * sembra un dettaglio e non lo è: cambia la velocità con cui
 * l'errore scende.
 */
export function rettangoli(nome, n, dove = 'mezzo') {
  const g = FUNZIONI[nome];
  const passo = (g.b - g.a) / n;
  const sposta = dove === 'sinistra' ? 0 : dove === 'destra' ? 1 : 0.5;
  let somma = 0;
  for (let k = 0; k < n; k++) somma += g.f(g.a + (k + sposta) * passo);
  return somma * passo;
}

export const erroreArea = (nome, n, dove = 'mezzo') => Math.abs(rettangoli(nome, n, dove) - areaEsatta(nome));

/** L'area accumulata da a fino a t: la funzione «contachilometri». */
export function accumulata(nome, t2) {
  const g = FUNZIONI[nome];
  return g.F(t2) - g.F(g.a);
}

/**
 * La pendenza della funzione accumulata, calcolata con il rapporto
 * incrementale del livello 21·b. Il teorema fondamentale dice che
 * viene f(t), e il test lo verifica invece di crederci.
 */
export function pendenzaAccumulata(nome, t2, h2 = 1e-5) {
  return (accumulata(nome, t2 + h2) - accumulata(nome, t2 - h2)) / (2 * h2);
}

/* ------------------------------------------------------------
   1) L'AREA COME LIMITE DI RETTANGOLI
   ------------------------------------------------------------ */
export function areaLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('L\'area a colpi di rettangoli'),
    subtitle: t('più rettangoli, meno errore — e conta anche dove li tagli'),
  });

  const st = { nome: 'parabola', n: 4, dove: 'sinistra', fatte: new Set(), vinto: false };
  const SOGLIA = 0.001;

  const stage = new Stage(w.body, {
    height: 300,
    draw(ctx, s) {
      bg(ctx, s);
      const g = FUNZIONI[st.nome];
      const stima = rettangoli(st.nome, st.n, st.dove);
      const vero = areaEsatta(st.nome);
      const err = Math.abs(stima - vero);
      const top = hud(ctx, s, {
        goal: t('errore sotto :s', { s: SOGLIA }),
        closeness: Math.min(1, SOGLIA / Math.max(err, 1e-12)),
        hit: err < SOGLIA,
        sub: t('funzioni sistemate: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const rect = { x: 30, y: top + 12, w: s.w - 46, h: s.h - top - 62 };
      const campioni = Array.from({ length: 201 }, (_, i) => g.f(g.a + (i / 200) * (g.b - g.a)));
      const alto = Math.max(...campioni) * 1.12;
      const basso = Math.min(0, Math.min(...campioni));
      const X = x => rect.x + ((x - g.a) / (g.b - g.a)) * rect.w;
      const Y = v => rect.y + rect.h - ((v - basso) / (alto - basso)) * rect.h;

      // i rettangoli: pieni dove stanno sotto la curva
      const passo = (g.b - g.a) / st.n;
      const sposta = st.dove === 'sinistra' ? 0 : st.dove === 'destra' ? 1 : 0.5;
      for (let k = 0; k < st.n; k++) {
        const x0 = g.a + k * passo;
        const alt = g.f(x0 + sposta * passo);
        const px = X(x0), pw = Math.max(1, X(x0 + passo) - px);
        ctx.fillStyle = 'rgba(96,165,250,.20)';
        ctx.fillRect(px, Y(alt), pw, Y(0) - Y(alt));
        ctx.strokeStyle = 'rgba(96,165,250,.55)'; ctx.lineWidth = 1;
        ctx.strokeRect(px, Y(alt), pw, Y(0) - Y(alt));
      }

      // la curva vera, sopra i rettangoli
      ctx.strokeStyle = COL.cyan; ctx.lineWidth = 2; ctx.beginPath();
      campioni.forEach((v, i) => {
        const px = X(g.a + (i / 200) * (g.b - g.a)), py = Y(v);
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      });
      ctx.stroke();

      // l'asse, che è il pavimento dei rettangoli
      ctx.strokeStyle = '#3a4a6d'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(rect.x, Y(0)); ctx.lineTo(rect.x + rect.w, Y(0)); ctx.stroke();

      text(ctx, g.formula, rect.x + 4, rect.y + 10, { size: 12, color: COL.cyan, max: 120 });
      text(ctx, t('stima: :s · vera: :v · errore: :e',
        { s: stima.toFixed(5), v: vero.toFixed(5), e: err.toFixed(5) }),
      16, s.h - 32, { size: 11.5, color: COL.txt, max: s.w - 32 });
      text(ctx, t('tagliare a metà conviene: 1/n² invece di 1/n'),
        16, s.h - 13, { size: 11, color: COL.dim, max: s.w - 32 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sf = choice({
    items: NOMI.map(k => ({ label: FUNZIONI[k].formula, value: k })),
    value: 'parabola',
    onchange: v => { st.nome = v; sfx.click(); upd(); },
  });
  const sd = choice({
    items: [
      { label: t('bordo sinistro'), value: 'sinistra' },
      { label: t('punto di mezzo'), value: 'mezzo' },
      { label: t('bordo destro'), value: 'destra' },
    ],
    value: 'sinistra',
    onchange: v => { st.dove = v; sfx.click(); upd(); },
  });
  const sn = slider({
    label: t('quanti rettangoli'), min: 1, max: 200, step: 1, value: st.n,
    fmt: v => v + '', oninput: v => { st.n = v; upd(); },
  });
  w.body.appendChild(controls(sf.root, sd.root, sn.root));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const err = erroreArea(st.nome, st.n, st.dove);
    if (err < SOGLIA && !st.fatte.has(st.nome)) {
      st.fatte.add(st.nome);
      sfx.ok(); fx.burst(stage.w / 2, stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    const daiBordi = erroreArea(st.nome, st.n, 'sinistra');
    const daMetà = erroreArea(st.nome, st.n, 'mezzo');
    const righe = [
      t('Con <b>:n</b> rettangoli la stima è <b>:s</b>. Il valore vero è <b>:v</b>, quindi sbagli di <b>:e</b>.',
        { n: st.n, s: rettangoli(st.nome, st.n, st.dove).toFixed(5), v: areaEsatta(st.nome).toFixed(5), e: err.toFixed(5) }),
      t('Con lo stesso numero di rettangoli, tagliati al bordo l\'errore è :b, tagliati a metà è :m. Non è una furbizia da poco: al bordo l\'errore scende come 1/n, a metà come 1/n².',
        { b: daiBordi.toFixed(5), m: daMetà.toFixed(5) }),
    ];
    if (st.nome === 'reciproca') {
      righe.push('<span class="a">' + t('E questa area ha un nome che conosci: l\'area sotto 1/x da 1 a t <b>è</b> il logaritmo naturale di t. Da 1 a e fa esattamente 1 — ecco perché quel numero è la base «naturale».') + '</span>');
    } else if (st.nome === 'scatola') {
      righe.push('<span class="ok">' + t('Questa curva è |ψ|² di una particella chiusa in una scatola: dice dove è probabile trovarla. La sua area fa <b>1</b>, e non per caso — la probabilità totale deve fare 1. È la stessa condizione che nel corso hai visto come «la somma dei quadrati delle ampiezze fa 1», scritta per una cosa continua.') + '</span>');
    }
    out.set(righe.join('\n'));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Questo è il gioco del corridoio del livello :n, in un altro vestito.</b> «L\'integrale è il limite delle somme di rettangoli» vuol dire: qualunque errore mi chiedi, io ti trovo un numero di rettangoli che sta sotto. E come al solito la domanda utile non è «ci arriva?» ma «quanto in fretta?»: tagliare a metà invece che al bordo fa risparmiare, a parità di errore, centinaia di rettangoli.', { n: nOf('m8-limiti') }));
  return { state: st };
}

/* ------------------------------------------------------------
   2) IL TEOREMA FONDAMENTALE — tachimetro e contachilometri
   ------------------------------------------------------------ */
export function teoremaLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('Tachimetro e contachilometri'),
    subtitle: t('la curva di sopra è la velocità, quella di sotto la strada fatta: guarda come sono legate'),
  });

  const st = { nome: 'scatola', t: 0.5, fatte: new Set(), vinto: false };

  const stage = new Stage(w.body, {
    height: 330,
    draw(ctx, s) {
      bg(ctx, s);
      const g = FUNZIONI[st.nome];
      const tt = g.a + st.t * (g.b - g.a);
      const v = g.f(tt);
      const pend = pendenzaAccumulata(st.nome, tt);
      const top = hud(ctx, s, {
        goal: t('trova dove la strada è più ripida'),
        closeness: v / Math.max(...Array.from({ length: 201 }, (_, i) => g.f(g.a + (i / 200) * (g.b - g.a)))),
        hit: st.fatte.has('ripida'),
        sub: t('scoperte: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const larg = s.w - 46;
      const su = { x: 30, y: top + 8, w: larg, h: (s.h - top - 70) * 0.46 };
      const giu = { x: 30, y: su.y + su.h + 26, w: larg, h: (s.h - top - 70) * 0.46 };
      const X = x => su.x + ((x - g.a) / (g.b - g.a)) * larg;

      // pannello di sopra: la velocità, con l'area già percorsa in ombra
      const campioni = Array.from({ length: 201 }, (_, i) => g.f(g.a + (i / 200) * (g.b - g.a)));
      const altoS = Math.max(...campioni) * 1.15, bassoS = Math.min(0, ...campioni);
      const Ys = y => su.y + su.h - ((y - bassoS) / (altoS - bassoS)) * su.h;
      ctx.fillStyle = 'rgba(96,165,250,.18)';
      ctx.beginPath(); ctx.moveTo(X(g.a), Ys(0));
      for (let i = 0; i <= 200; i++) {
        const x = g.a + (i / 200) * (tt - g.a);
        ctx.lineTo(X(x), Ys(g.f(x)));
      }
      ctx.lineTo(X(tt), Ys(0)); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = COL.cyan; ctx.lineWidth = 2; ctx.beginPath();
      campioni.forEach((y, i) => {
        const px = X(g.a + (i / 200) * (g.b - g.a)), py = Ys(y);
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      });
      ctx.stroke();
      dot(ctx, X(tt), Ys(v), 4.5, COL.cyan);
      text(ctx, t('velocità: :v', { v: v.toFixed(3) }), su.x + 4, su.y + 10,
        { size: 11, color: COL.cyan, max: larg - 8 });

      // pannello di sotto: la strada fatta, con la tangente
      const totale = areaEsatta(st.nome);
      const altoG = Math.max(totale, 1e-6) * 1.15;
      const Yg = y => giu.y + giu.h - (y / altoG) * giu.h;
      ctx.strokeStyle = COL.violet; ctx.lineWidth = 2; ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const x = g.a + (i / 200) * (g.b - g.a);
        const px = X(x), py = Yg(accumulata(st.nome, x));
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.stroke();
      const sAcc = accumulata(st.nome, tt);
      // la tangente: la sua pendenza È l'altezza del pannello di sopra
      const dx = (g.b - g.a) * 0.18;
      ctx.strokeStyle = COL.amber; ctx.lineWidth = 1.8; ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(X(tt - dx), Yg(sAcc - pend * dx));
      ctx.lineTo(X(tt + dx), Yg(sAcc + pend * dx));
      ctx.stroke(); ctx.setLineDash([]);
      dot(ctx, X(tt), Yg(sAcc), 4.5, COL.violet);
      text(ctx, t('strada: :s · pendenza: :p', { s: sAcc.toFixed(3), p: pend.toFixed(3) }),
        giu.x + 4, giu.y + 10, { size: 11, color: COL.violet, max: larg - 8 });

      // la riga verticale che tiene insieme i due pannelli
      ctx.strokeStyle = 'rgba(251,191,36,.5)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(X(tt), su.y); ctx.lineTo(X(tt), giu.y + giu.h); ctx.stroke();
      ctx.setLineDash([]);

      text(ctx, t('altezza sopra :v = pendenza sotto :p', { v: v.toFixed(3), p: pend.toFixed(3) }),
        16, s.h - 30, { size: 12, color: COL.amber, max: s.w - 32 });
      text(ctx, t('è il teorema fondamentale, e vale in ogni punto'),
        16, s.h - 12, { size: 11, color: COL.dim, max: s.w - 32 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sf = choice({
    items: NOMI.map(k => ({ label: FUNZIONI[k].formula, value: k })),
    value: 'scatola',
    onchange: v => { st.nome = v; sfx.click(); upd(); },
  });
  const stt = slider({
    label: t('fin dove sei arrivato'), min: 0, max: 1, step: 0.01, value: st.t,
    fmt: v => (v * 100).toFixed(0) + '%', oninput: v => { st.t = v; upd(); },
  });
  w.body.appendChild(controls(sf.root, stt.root));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const g = FUNZIONI[st.nome];
    const tt = g.a + st.t * (g.b - g.a);
    const v = g.f(tt);
    const massimo = Math.max(...Array.from({ length: 401 }, (_, i) => g.f(g.a + (i / 400) * (g.b - g.a))));
    const minimo = Math.min(...Array.from({ length: 401 }, (_, i) => g.f(g.a + (i / 400) * (g.b - g.a))));
    if (v > massimo - 0.02 * (massimo - minimo) && !st.fatte.has('ripida')) segna('ripida');
    if (v < minimo + 0.02 * (massimo - minimo) && !st.fatte.has('piatta')) segna('piatta');
    out.set([
      t('Sei arrivato a <b>:t</b>. Lì il tachimetro segna <b>:v</b>, e il contachilometri <b>:s</b>.',
        { t: tt.toFixed(3), v: v.toFixed(3), s: accumulata(st.nome, tt).toFixed(3) }),
      t('La tangente gialla alla curva di sotto ha pendenza <b>:p</b>. Confrontala con la velocità: sono lo stesso numero, e lo sono <b>in ogni punto</b>.',
        { p: pendenzaAccumulata(st.nome, tt).toFixed(3) }),
      '<span class="a">' + t('Detto in parole: la strada fatta cresce alla velocità che segna il tachimetro. Detto in formule: la derivata dell\'area è la funzione di partenza. È il <b>teorema fondamentale del calcolo</b>, e lega le due metà dell\'analisi.') + '</span>',
    ].join('\n'));
    stage.redraw();
  }
  function segna(chiave) {
    st.fatte.add(chiave);
    sfx.ok(); fx.burst(stage.w / 2, stage.h / 2);
    if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
  }
  upd();
  w.setFoot(t('<b>Le due metà dell\'analisi sono una cosa sola.</b> La derivata (livello :d) misura quanto una cosa cambia; l\'integrale somma i cambiamenti e ricostruisce la cosa. Per questo si può calcolare un\'area senza contare un solo rettangolo: basta trovare una funzione la cui derivata sia quella di partenza, e guardare quanto è cresciuta agli estremi.', { d: nOf('21b-variazionale') }));
  return { state: st };
}
