/* ============================================================
   PARTE 0 — ESPONENZIALI E LOGARITMI
   «Quante cifre servono» è tutto quello che un logaritmo dice.

   Perché il corso ne ha bisogno, e perché qui:

   · «con n bit scegli fra 2ⁿ» compare fin dal primo livello del computer
     classico, ma la domanda che serve davvero è quella girata: dati N casi,
     QUANTI bit servono? Quella domanda ha un nome, ed è logaritmo;

   · e c'è una frase che senza logaritmi non si può nemmeno leggere:
     «Shor è polinomiale nel NUMERO DI CIFRE di N». Il numero di cifre di un
     numero è il suo logaritmo — quindi quella frase dice «polinomiale in
     log N», che è tutt'altra cosa da «polinomiale in N». È esattamente lì
     che sta il vantaggio quantistico, e chi non ha i logaritmi lo legge
     senza vederlo;

   · i due giochi fanno la stessa domanda in due modi che sembrano diversi —
     quanti bit servono per N casi, e quante volte posso dimezzare N prima di
     arrivare a 1 — e si scopre che la risposta è lo stesso numero. Quel
     numero è log₂N, e a quel punto la parola non fa più paura.
   ============================================================ */

import { Stage, COL, bg, dot, text, roundRect, arrow, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t, num } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud, nearSound } from './basicmath.js';

/* ------------------------------------------------------------
   LOGICA PURA
   ------------------------------------------------------------ */

/** Quante possibilità coprono n interruttori: 2ⁿ. */
export const possibilita = n => Math.pow(2, n);

/**
 * Quanti bit servono per distinguere N casi.
 *
 * È il logaritmo in base 2 arrotondato in su: con 9 bit si arriva a 512, che
 * per 1000 casi non basta; con 10 si arriva a 1024, e allora sì. Il gioco fa
 * scoprire proprio questo scalino.
 */
export const bitNecessari = N => (N <= 1 ? 0 : Math.ceil(Math.log2(N)));

/** Quante volte si può dimezzare N prima di scendere sotto 1. */
export function dimezzamenti(N) {
  let n = 0, x = N;
  while (x > 1 && n < 200) { x /= 2; n++; }
  return n;
}

/** Quante cifre ha un numero, in base 10. */
export const cifre = N => String(Math.floor(Math.abs(N))).length;

/* I casi del primo gioco: numeri che si incontrano davvero. */
export const CASI = [
  { id: 'alfabeto', N: 26, nome: () => t("le lettere dell'alfabeto inglese") },
  { id: 'carte', N: 52, nome: () => t('le carte di un mazzo') },
  { id: 'giorni', N: 365, nome: () => t("i giorni dell'anno") },
  { id: 'mille', N: 1000, nome: () => t('mille numeri') },
  { id: 'milione', N: 1000000, nome: () => t('un milione di numeri') },
];

/* ------------------------------------------------------------
   1) QUANTI INTERRUTTORI SERVONO
   La domanda girata: non «2⁵ quanto fa», ma «per 26 lettere,
   quanti interruttori?». La risposta è un logaritmo, e si trova
   accendendo interruttori finché non bastano.
   ------------------------------------------------------------ */
export function bitLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('Quanti interruttori servono'),
    subtitle: t('non «quanto fa 2⁵», ma «per 26 lettere quanti bit?»: la domanda girata'),
  });

  const st = { caso: 0, n: 3, risolti: new Set(), vinto: false };
  const near = nearSound();

  const stage = new Stage(w.body, {
    height: 300,
    draw(ctx, s) {
      bg(ctx, s);
      const caso = CASI[st.caso];
      const copre = possibilita(st.n);
      const serve = bitNecessari(caso.N);
      const giusto = st.n === serve;
      const top = hud(ctx, s, {
        goal: t('il minimo che basta'),
        closeness: giusto ? 1 : 1 - Math.min(1, Math.abs(st.n - serve) / 8),
        hit: giusto,
        sub: t(':caso (:quanti casi) — risolti :fatti su :totali', { caso: caso.nome(), quanti: num(caso.N), fatti: st.risolti.size, totali: cfg.need }),
      });

      // gli interruttori, uno per bit: quello che si accende è il numero n
      const y = top + 34;
      const larg = Math.min(30, (s.w - 40) / 21);
      const x0 = (s.w - larg * 20) / 2;
      for (let i = 0; i < 20; i++) {
        const acceso = i < st.n;
        roundRect(ctx, x0 + i * larg, y, larg - 4, 26, 4, {
          fill: acceso ? 'rgba(34,211,238,.3)' : '#141f36',
          stroke: acceso ? COL.cyan : '#2b3b5e',
        });
      }
      text(ctx, t(':n interruttori', { n: st.n }), s.w / 2, y + 44, { size: 13, align: 'center', color: COL.cyan, max: s.w - 40 });

      /* Le due barre a confronto: quanto copro e quanto mi serve coprire.
         Il messaggio è tutto qui — non «2¹⁰ = 1024», ma «1024 basta e 512 no». */
      const by = y + 74, bh = 22, bw = s.w - 60;
      const scala = Math.max(copre, caso.N) * 1.05;
      roundRect(ctx, 30, by, bw * Math.min(1, copre / scala), bh, 5,
        { fill: copre >= caso.N ? 'rgba(52,211,153,.35)' : 'rgba(251,113,133,.3)', stroke: copre >= caso.N ? COL.green : COL.red });
      text(ctx, t('copri :quanti casi', { quanti: num(copre) }), 34, by + bh / 2,
        { size: 11.5, color: COL.txtBright, max: bw - 12 });
      roundRect(ctx, 30, by + bh + 8, bw * Math.min(1, caso.N / scala), bh, 5,
        { fill: 'rgba(251,191,36,.25)', stroke: COL.amber });
      text(ctx, t('te ne servono :quanti', { quanti: num(caso.N) }), 34, by + bh * 1.5 + 8,
        { size: 11.5, color: COL.txtBright, max: bw - 12 });

      text(ctx, giusto
        ? t('✓ :n è il minimo: con :meno non basterebbe', { n: st.n, meno: st.n - 1 })
        : copre >= caso.N
          ? t('bastano, ma ne stai usando più del necessario')
          : t('non bastano: ne servono di più'),
      s.w / 2, s.h - 14, { size: 12.5, align: 'center', color: giusto ? COL.green : COL.amber, max: s.w - 30 });
      st.px = s.w / 2; st.py = by;
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sc = choice({
    label: t('Quante cose devi distinguere'),
    items: CASI.map((c, i) => ({ label: num(c.N), value: i })),
    value: 0,
    onchange: i => { st.caso = i; upd(); },
  });
  const sn = slider({
    label: t('Interruttori accesi'), min: 0, max: 20, step: 1, value: st.n,
    fmt: v => String(v), oninput: v => { st.n = v; upd(); },
  });
  w.body.appendChild(controls(sc.root, sn.root));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const caso = CASI[st.caso];
    const serve = bitNecessari(caso.N);
    const giusto = st.n === serve;
    if (giusto && !st.risolti.has(caso.id)) {
      st.risolti.add(caso.id);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.risolti.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else if (!giusto) {
      near(1 - Math.min(1, Math.abs(st.n - serve) / 8));
    }
    out.set(
      t('Con <b>:n</b> interruttori copri <b>:copre</b> casi. Te ne servono <b>:servono</b>.',
        { n: st.n, copre: num(possibilita(st.n)), servono: num(caso.N) }) + '\n' +
      (giusto
        ? '<span class="g">✓ ' + t('Il minimo è <b>:serve</b>. Questo numero si chiama <b>logaritmo in base 2</b> di :N, arrotondato in su: log₂(:N) ≈ :esatto.', { serve, N: num(caso.N), esatto: Math.log2(caso.N).toFixed(2) }) + '</span>'
        : t('Cerca il <b>minimo</b> numero di interruttori che basta: uno in meno non deve farcela.')));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Che cos\'è un logaritmo, detto una volta per tutte:</b> è la risposta alla domanda «a quale potenza devo elevare?». Se 2¹⁰ = 1024, allora log₂(1024) = 10. Nel corso serve quasi sempre in questa forma: <b>quanti bit (o quanti qubit) servono per N casi</b>.'));
  return { state: st };
}

/* ------------------------------------------------------------
   2) QUANTE VOLTE POSSO DIMEZZARE
   La stessa domanda travestita: si dimezza finché resta 1, e il
   numero di dimezzamenti È lo stesso numero di prima.
   ------------------------------------------------------------ */
export function dimezzaLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('Quante volte posso dimezzare'),
    subtitle: t('dimezza finché non resta uno solo: quante volte ci riesci?'),
    modo: 'classico',
  });

  const NUMERI = [64, 1000, 4096, 100];
  const st = { i: 0, tagli: 0, risolti: new Set(), vinto: false, esito: '' };
  const valore = () => NUMERI[st.i] / Math.pow(2, st.tagli);

  const stage = new Stage(w.body, {
    height: 300,
    draw(ctx, s) {
      bg(ctx, s);
      const N = NUMERI[st.i];
      const v = valore();
      const finito = v <= 1;
      const top = hud(ctx, s, {
        goal: t('arriva a uno solo'),
        closeness: Math.min(1, st.tagli / Math.max(1, dimezzamenti(N))),
        hit: finito,
        sub: t('numeri finiti: :fatti su :totali', { fatti: st.risolti.size, totali: cfg.need }),
      });

      /* Le barre: ogni dimezzamento è una barra lunga la metà. Diventano
         invisibili in fretta, ed è proprio quello il punto: bastano dieci
         tagli per passare da mille a uno. */
      const x0 = 24, bw = s.w - 48;
      let y = top + 22;
      const totali = Math.min(st.tagli + 1, 14);
      for (let i = 0; i < totali; i++) {
        const val = N / Math.pow(2, i);
        const larg = Math.max(2, bw * (val / N));
        roundRect(ctx, x0, y, larg, 13, 3, {
          fill: i === st.tagli ? 'rgba(52,211,153,.4)' : 'rgba(34,211,238,.22)',
          stroke: i === st.tagli ? COL.green : '#2b3b5e',
        });
        if (larg > 52) text(ctx, num(Math.round(val * 100) / 100), x0 + 6, y + 6.5, { size: 10.5, color: COL.txtBright, max: larg - 10 });
        else text(ctx, num(Math.round(val * 100) / 100), x0 + larg + 6, y + 6.5, { size: 10.5, color: '#8fa0c4', max: 90 });
        y += 17;
      }

      text(ctx, t('dimezzamenti fatti: :n', { n: st.tagli }), 24, s.h - 30,
        { size: 13, color: finito ? COL.green : COL.amber, max: s.w - 48 });
      text(ctx, finito
        ? t('da :N a 1 in :n dimezzamenti', { N: num(N), n: st.tagli })
        : t('resta :v', { v: num(Math.round(v * 100) / 100) }),
      24, s.h - 12, { size: 11.5, color: '#8fa0c4', max: s.w - 48 });
      st.px = x0 + 40; st.py = top + 22 + st.tagli * 17;
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sn = choice({
    label: t('Il numero di partenza'),
    items: NUMERI.map((v, i) => ({ label: num(v), value: i })),
    value: 0,
    onchange: i => { st.i = i; st.tagli = 0; st.esito = ''; upd(); },
  });
  w.body.appendChild(controls(sn.root));
  const risposte = h('div', { class: 'btn-row', style: { marginTop: '8px' } });
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '✂️ ' + t('dimezza'), class: 'sm primary', onclick: () => { st.tagli++; sfx.tick(); upd(); } },
    { label: '↺ ' + t('ricomincia'), onclick: () => { st.tagli = 0; st.esito = ''; upd(); } },
  ])));
  w.body.appendChild(risposte);
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const N = NUMERI[st.i];
    const v = valore();
    const finito = v <= 1;
    const vero = dimezzamenti(N);
    risposte.innerHTML = '';
    if (finito && !st.risolti.has(String(N))) {
      /* Arrivati a uno, si chiede il numero: dirlo ad alta voce è quello che
         lega il gesto («ho dimezzato dieci volte») alla parola («log₂1000»). */
      for (const o of [...new Set([vero, vero + 1, Math.max(1, vero - 1), vero + 2])].sort((a, b) => a - b)) {
        risposte.appendChild(h('button', { class: 'btn sm', onclick: () => rispondi(o) },
          t('ci vogliono :n dimezzamenti', { n: o })));
      }
    }
    out.set(
      t('Parti da <b>:N</b>. Dopo <b>:n</b> dimezzamenti resta <b>:v</b>.',
        { N: num(N), n: st.tagli, v: num(Math.round(v * 100) / 100) }) + '\n' +
      (finito
        ? t('Ci sono voluti <b>:n</b> dimezzamenti. E ora guarda: <b>:n</b> è anche il numero di interruttori che servirebbero per :N casi. Non è una coincidenza: è lo stesso logaritmo.', { n: vero, N: num(N) })
        : t('Ogni taglio dimezza. Da mille a uno bastano dieci tagli: è questo che rende la ricerca binaria così veloce.')) +
      (st.esito ? '\n' + st.esito : ''));
    stage.redraw();
  }

  function rispondi(n) {
    const N = NUMERI[st.i];
    const vero = dimezzamenti(N);
    if (n === vero) {
      st.risolti.add(String(N));
      st.esito = '<span class="g">✓ ' + t('Esatto: log₂(:N) arrotondato in su fa :n.', { N: num(N), n: vero }) + '</span>';
      sfx.ok(); fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.risolti.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else {
      st.esito = '<span class="a">✗ ' + t('No: conta le barre disegnate, quella di partenza esclusa.') + '</span>';
      sfx.err();
    }
    upd();
  }

  upd();
  w.setFoot(t('<b>Perché è la stessa cosa:</b> dimezzare fino a 1 e chiedersi quanti bit servono sono due modi di fare la stessa domanda — «quante volte ci sta il 2 dentro N, moltiplicandolo per sé stesso?». La risposta è log₂N in tutti e due i casi. E questo numero è dappertutto: i confronti della ricerca binaria (livello :k), gli stadi della FFT (livello :f), e il numero di qubit che servono per rappresentare N possibilità.', { k: nOf('k4-ricerca'), f: nOf('17-fft') }));
  return { state: st };
}
