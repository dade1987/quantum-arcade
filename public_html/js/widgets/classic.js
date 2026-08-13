/* ============================================================
   PARTE K — mini-giochi del COMPUTER CLASSICO (1 di 2)
   bit e binario · porte logiche · costruire con NAND · la somma

   PERCHÉ QUESTI GIOCHI ESISTONO

   «Quantistico» non è una cosa: è una DIFFERENZA. E una differenza non si
   può vedere se manca il termine di paragone. Chi non ha mai visto un bit
   fisico — un interruttore, con dentro un numero e basta — non ha modo di
   accorgersi di che cosa sia strano in un qubit: gli manca lo sfondo su cui
   si stacca la figura.

   Quindi qui si gioca prima al computer normale, con gli stessi mini-giochi
   e lo stesso metodo del resto del corso, e ogni gioco finisce con la riga
   che dice cosa cambierà. È il modo in cui la ricerca sull'apprendimento
   comparativo dice di introdurre un concetto nuovo: prima due casi concreti
   messi vicini, poi il principio astratto (Alfieri, Nokes-Malach & Schunn,
   2013; Gentner, Loewenstein & Thompson, 2003). Il contrario — la
   definizione prima, gli esempi dopo — è il modo in cui si insegna di solito
   ed è anche il modo in cui si dimentica di solito.
   ============================================================ */

import { Stage, COL, bg, text, roundRect, circle, dot, arrow, FX, proximityBar } from '../core/canvas.js';
import { widget, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t, num } from '../core/i18n.js';

/* ------------------------------------------------------------
   HUD comune ai giochi della Parte K: obiettivo grande in alto,
   barra di vicinanza a destra. Stesso schema della Parte 0, così
   chi arriva da lì non deve imparare una seconda interfaccia.
   ------------------------------------------------------------ */
export function hudK(ctx, s, { goal = '', closeness = 0, hit = false, sub = '' }) {
  roundRect(ctx, 8, 6, s.w - 16, 34, 9, {
    fill: hit ? 'rgba(52,211,153,.16)' : 'rgba(255,255,255,.035)',
    stroke: hit ? COL.green : '#22304d',
  });
  const bw = Math.min(180, s.w * 0.32);
  const barraX = s.w - bw - 18;
  text(ctx, hit ? '✓ ' + t('FATTO!') : '🎯 ' + goal, 18, 23,
    { size: 13, color: hit ? COL.green : COL.amber, mono: false, weight: '800', max: barraX - 28 });
  proximityBar(ctx, barraX, 15, bw, 10, hit ? 1 : closeness);
  if (sub) text(ctx, sub, 18, 48, { size: 11, color: '#7f8fb3', max: s.w - 36 });
  return 46;
}

/** Disegna un bit come interruttore quadrato. Ritorna il rettangolo, per i clic. */
export function bitBox(ctx, x, y, w, hgt, on, { label = '', sotto = '', colore = null } = {}) {
  const col = colore || (on ? COL.green : '#32405f');
  roundRect(ctx, x, y, w, hgt, 8, {
    fill: on ? 'rgba(52,211,153,.20)' : 'rgba(255,255,255,.03)',
    stroke: col, width: on ? 2 : 1.2,
  });
  text(ctx, on ? '1' : '0', x + w / 2, y + hgt / 2, {
    size: Math.min(26, hgt * 0.5), align: 'center', color: on ? COL.green : '#5b6b90', weight: '800',
  });
  if (label) text(ctx, label, x + w / 2, y - 11, { size: 10.5, align: 'center', color: '#7f8fb3', max: w + 10 });
  if (sotto) text(ctx, sotto, x + w / 2, y + hgt + 13, { size: 10.5, align: 'center', color: COL.amber, max: w + 10 });
  return { x, y, w, h: hgt };
}

const dentro = (r, x, y) => r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

/** Il valore decimale di un elenco di bit scritto dal più pesante al più leggero. */
export const valoreDi = bits => bits.reduce((acc, b) => acc * 2 + (b ? 1 : 0), 0);

/** Il numero `v` in binario su `n` cifre, come elenco di 0/1. */
export const inBinario = (v, n) => Array.from({ length: n }, (_, i) => (v >> (n - 1 - i)) & 1);

/* ============================================================
   1) IL BIT — interruttori, potenze di 2, byte
   ============================================================ */

export function bitLab(host, opts = {}) {
  const cfg = Object.assign({ bits: 8, need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('La macchina a interruttori'),
    subtitle: t('accendi i bit finché il numero non è quello giusto'),
  });

  const N = cfg.bits;
  const st = { bits: new Array(N).fill(0), target: 0, fatti: 0, rects: [], vinto: false };

  /* I bersagli non sono a caso: 5 è "101" e si fa a mente, 64 è una potenza di
     due esatta (un solo interruttore), 65 mostra che una potenza + 1 accende due
     interruttori lontani, 255 accende tutto. Quattro casi che insieme raccontano
     la regola, invece di quattro numeri qualunque. */
  const BERSAGLI = [5, 12, 64, 65, 100, 255, 37, 128];
  const nuovo = () => {
    let v;
    do { v = BERSAGLI[Math.floor(Math.random() * BERSAGLI.length)]; } while (v === st.target);
    st.target = v; st.bits = new Array(N).fill(0); st.vinto = false; upd();
  };

  const stage = new Stage(w.body, {
    height: 250,
    draw(ctx, s) {
      bg(ctx, s);
      const v = valoreDi(st.bits);
      const hit = v === st.target;
      const top = hudK(ctx, s, {
        goal: t('accendi gli interruttori per fare :numero', { numero: st.target }),
        closeness: 1 - Math.min(1, Math.abs(v - st.target) / 255),
        hit,
        sub: t('ogni interruttore vale il doppio di quello alla sua destra — tocca per accenderlo'),
      });

      const marg = 16;
      const bw = Math.min(56, (s.w - marg * 2 - (N - 1) * 6) / N);
      const larghezza = N * bw + (N - 1) * 6;
      const x0 = (s.w - larghezza) / 2;
      const y0 = top + 30;
      const bh = Math.min(64, s.h - y0 - 76);

      st.rects = st.bits.map((b, i) => bitBox(ctx, x0 + i * (bw + 6), y0, bw, bh, b, {
        label: String(2 ** (N - 1 - i)),
        sotto: b ? '+' + 2 ** (N - 1 - i) : '',
      }));

      // la somma, scritta come la scriverebbe un bambino: 64 + 8 + 4 + 1 = 77
      const pezzi = st.bits.map((b, i) => b ? 2 ** (N - 1 - i) : 0).filter(Boolean);
      const somma = pezzi.length ? pezzi.join(' + ') + ' = ' + v : t('tutto spento = 0');
      text(ctx, somma, s.w / 2, y0 + bh + 40, {
        size: 15, align: 'center', color: hit ? COL.green : COL.cyan, weight: '800', max: s.w - 24,
      });
      text(ctx, t('centrati: :fatti/:totali', { fatti: st.fatti, totali: cfg.need }),
        s.w - 14, s.h - 12, { size: 11, align: 'right', color: '#7f8fb3' });
      fx.draw(ctx);
    },
    onPointer(e) {
      if (e.type !== 'down') return;
      const i = st.rects.findIndex(r => dentro(r, e.x, e.y));
      if (i < 0) return;
      st.bits[i] = st.bits[i] ? 0 : 1;
      sfx.click();
      upd();
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const out = readout('');
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([
    { label: '🎲 ' + t('nuovo numero'), class: 'sm primary', onclick: nuovo },
    { label: '␀ ' + t('spegni tutto'), onclick: () => { st.bits = new Array(N).fill(0); upd(); } },
    { label: '＋1', onclick: () => { st.bits = inBinario((valoreDi(st.bits) + 1) % 2 ** N, N); sfx.tick(); upd(); } },
  ])));
  w.body.appendChild(out.root);

  function upd() {
    const v = valoreDi(st.bits);
    const hit = v === st.target;
    /* Il carattere ASCII c'è perché è la prova che «i bit non sono numeri»:
       gli stessi otto interruttori sono 65, oppure la lettera A, a seconda di
       cosa ha deciso il programma che li legge. */
    const car = v >= 32 && v < 127 ? String.fromCharCode(v) : null;
    out.set(
      t('Binario: <b>:bin</b>  ·  decimale: <b>:dec</b>  ·  esadecimale: <b>:hex</b>',
        { bin: st.bits.join(''), dec: v, hex: '0x' + v.toString(16).toUpperCase().padStart(2, '0') }) +
      (car ? '\n' + t('Se questi 8 bit fossero testo, sarebbero il carattere «<b>:carattere</b>».', { carattere: car }) : '') +
      '\n' + t('Con :n interruttori i numeri diversi possibili sono 2^:n = <b>:totale</b>. Ma tu, in questo momento, ne stai tenendo <b>uno solo</b>.',
        { n: N, totale: num(2 ** N) }) +
      (hit ? '\n<span class="g">🎯 ' + t('centrato!') + '</span>' : ''));
    stage.redraw();
    if (hit && !st.vinto) {
      st.vinto = true; st.fatti++; sfx.ok();
      fx.burst(stage.w / 2, stage.h / 2); fx.flash();
      if (st.fatti >= cfg.need) cfg.onWin && cfg.onWin(st.fatti);
    }
  }
  nuovo();

  w.setFoot(t('<b>Tienilo da parte:</b> con 8 bit ci sono 256 configurazioni possibili, e il computer ne tiene <b>una</b>. Fra qualche livello vedrai 8 <i>qubit</i> che tengono tutte e 256 le ampiezze <b>insieme</b> — ed è lì che comincia la storia, non prima.'));
  return { state: st };
}

/* ============================================================
   2) LE PORTE LOGICHE — tabelle di verità e porta misteriosa
   ============================================================ */

/** Le porte a due ingressi che si incontrano ovunque, più il NOT. */
export const PORTE = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  XOR: (a, b) => a ^ b,
  NAND: (a, b) => (a & b) ^ 1,
  NOR: (a, b) => (a | b) ^ 1,
  NOT: a => a ^ 1,
};

/** La tabella di verità di una porta a due ingressi, come stringa di 4 cifre. */
export const firma = fn => [[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => fn(a, b)).join('');

export function logicLab(host, opts = {}) {
  const cfg = Object.assign({ onWin: null, sfide: 3 }, opts);
  const w = widget(host, {
    title: t('Il banco delle porte logiche'),
    subtitle: t('accendi gli ingressi e guarda cosa esce'),
  });

  const NOMI = ['AND', 'OR', 'XOR', 'NAND', 'NOR'];
  const st = {
    a: 0, b: 0, porta: 'AND',
    viste: new Set(),          // righe della tabella già esplorate, per la missione
    modo: 'banco',             // 'banco' | 'sfida'
    segreta: 'AND', domande: 0, indovinate: 0, esito: '',
    completo: false, rects: [],
  };

  const stage = new Stage(w.body, {
    height: 280,
    draw(ctx, s) {
      bg(ctx, s);
      const sfida = st.modo === 'sfida';
      const nome = sfida ? '???' : st.porta;
      const fn = PORTE[sfida ? st.segreta : st.porta];
      const uscita = fn(st.a, st.b);

      const top = sfida
        ? hudK(ctx, s, {
          goal: t('scopri quale porta è nascosta nella scatola'),
          closeness: Math.min(1, st.domande / 4), hit: !!st.esito,
          sub: t('domande fatte alla scatola: :n — poi dichiara la porta qui sotto', { n: st.domande }),
        })
        : hudK(ctx, s, {
          goal: t('esplora tutte e 4 le righe della tabella di :porta', { porta: st.porta }),
          closeness: st.viste.size / 4, hit: st.viste.size >= 4,
          sub: t('tocca gli ingressi A e B per cambiarli'),
        });

      const y = top + 46;
      const bw = 46, bh = 46;
      const xIn = 24;
      st.rects = [
        Object.assign(bitBox(ctx, xIn, y, bw, bh, st.a, { label: 'A' }), { chi: 'a' }),
        Object.assign(bitBox(ctx, xIn, y + bh + 22, bw, bh, st.b, { label: 'B' }), { chi: 'b' }),
      ];

      // il corpo della porta
      const gx = xIn + bw + 54, gw = Math.min(150, s.w - gx - 130), gh = bh * 2 + 22;
      roundRect(ctx, gx, y, gw, gh, 12, {
        fill: sfida ? 'rgba(167,139,250,.10)' : 'rgba(34,211,238,.08)',
        stroke: sfida ? COL.violet : COL.cyan, width: 2,
      });
      text(ctx, nome, gx + gw / 2, y + gh / 2, {
        size: 26, align: 'center', color: sfida ? COL.violet : COL.cyan, weight: '800', max: gw - 12,
      });

      // i fili
      const filo = (y0, on) => arrow(ctx, xIn + bw + 4, y0, gx - 4, y + gh / 2,
        { color: on ? COL.green : '#32405f', width: on ? 2.6 : 1.4, head: 7 });
      filo(y + bh / 2, st.a);
      filo(y + bh + 22 + bh / 2, st.b);
      arrow(ctx, gx + gw + 4, y + gh / 2, gx + gw + 44, y + gh / 2,
        { color: uscita ? COL.green : '#32405f', width: uscita ? 2.6 : 1.4, head: 7 });
      bitBox(ctx, gx + gw + 50, y + gh / 2 - bh / 2, bw, bh, uscita, { label: t('uscita') });

      // la tabella di verità, a destra
      const tx = gx + gw + 50 + bw + 26;
      if (s.w - tx > 108) {
        text(ctx, t('tabella di verità'), tx, y - 12, { size: 10.5, color: '#7f8fb3' });
        [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(([a, b], i) => {
          const ry = y + i * 26;
          const corrente = a === st.a && b === st.b;
          const vista = st.viste.has(a + '' + b) || !sfida;
          roundRect(ctx, tx, ry, 96, 23, 5, {
            fill: corrente ? 'rgba(251,191,36,.16)' : 'transparent',
            stroke: corrente ? COL.amber : '#22304d',
          });
          const mostra = sfida ? (vista ? fn(a, b) : '?') : fn(a, b);
          text(ctx, `${a}  ${b}`, tx + 10, ry + 12, { size: 12.5, color: '#9dabc9' });
          text(ctx, '→', tx + 48, ry + 12, { size: 11, color: '#5b6b90' });
          text(ctx, String(mostra), tx + 78, ry + 12,
            { size: 14, color: mostra === 1 ? COL.green : (mostra === '?' ? '#5b6b90' : '#7f8fb3'), weight: '800' });
        });
      }
      if (st.esito) text(ctx, st.esito, s.w / 2, s.h - 14, { size: 12.5, align: 'center', color: COL.amber, mono: false, max: s.w - 24 });
      fx.draw(ctx);
    },
    onPointer(e) {
      if (e.type !== 'down') return;
      const r = st.rects.find(x => dentro(x, e.x, e.y));
      if (!r) return;
      st[r.chi] ^= 1;
      sfx.click();
      registra();
      upd();
    },
  });
  const fx = new FX(stage);
  stage.pause();

  /* In modalità sfida ogni cambio di ingresso è una DOMANDA alla scatola: è la
     stessa contabilità che al livello 9 si farà sull'oracolo quantistico, e
     contarla qui — dove la scatola è banale — è quello che dopo rende leggibile
     la frase «Deutsch risolve il problema con una interrogazione sola». */
  function registra() {
    const chiave = st.a + '' + st.b;
    if (st.modo === 'sfida') {
      if (!st.viste.has(chiave)) { st.viste.add(chiave); st.domande++; }
    } else st.viste.add(chiave);
  }

  const out = readout('');
  const sceltaPorta = choice({
    label: t('porta al banco'),
    items: NOMI.map(n => ({ label: n, value: n })),
    value: 'AND',
    onchange: v => { st.porta = v; st.viste = new Set([st.a + '' + st.b]); upd(); },
  });
  const rigaSfida = h('div', { class: 'btn-row', style: { marginTop: '8px' } },
    NOMI.map(n => h('button', { class: 'btn sm', onclick: () => dichiara(n) }, t('è :porta', { porta: n }))));
  rigaSfida.classList.add('hidden');

  const modo = choice({
    items: [{ label: '🔧 ' + t('banco libero'), value: 'banco' }, { label: '🎁 ' + t('porta misteriosa'), value: 'sfida' }],
    value: 'banco',
    onchange: v => {
      st.modo = v; st.esito = ''; st.viste = new Set(); st.domande = 0;
      st.segreta = NOMI[Math.floor(Math.random() * NOMI.length)];
      sceltaPorta.root.classList.toggle('hidden', v === 'sfida');
      rigaSfida.classList.toggle('hidden', v === 'banco');
      upd();
    },
  });

  function dichiara(n) {
    const giusto = firma(PORTE[n]) === firma(PORTE[st.segreta]);
    if (giusto) {
      st.indovinate++;
      st.esito = t('✓ era :porta, trovata con :n domande', { porta: st.segreta, n: st.domande });
      sfx.ok(); fx.burst(stage.w / 2, stage.h / 2); fx.flash();
      if (st.indovinate >= cfg.sfide) cfg.onWin && cfg.onWin(st.indovinate);
      st.segreta = NOMI[Math.floor(Math.random() * NOMI.length)];
      st.viste = new Set(); st.domande = 0;
    } else {
      st.esito = t('✗ no: la tabella non torna. Guarda meglio le righe che hai già chiesto.');
      sfx.err();
    }
    upd();
  }

  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, modo.root, sceltaPorta.root, rigaSfida));
  w.body.appendChild(out.root);

  function upd() {
    const sfida = st.modo === 'sfida';
    const fn = PORTE[sfida ? st.segreta : st.porta];
    out.set(sfida
      ? t('Righe già chieste alla scatola: <b>:viste su 4</b>. Per essere <b>certo</b> di quale porta è, quante te ne servono?', { viste: st.viste.size })
        + '\n' + t('Indovinate: <b>:fatte/:totali</b>', { fatte: st.indovinate, totali: cfg.sfide })
      : t('<b>:porta</b>(:a, :b) = <b>:uscita</b>  ·  la sua tabella di verità per intero è <b>:firma</b>',
        { porta: st.porta, a: st.a, b: st.b, uscita: fn(st.a, st.b), firma: firma(fn) })
      + '\n' + t('Righe esplorate: <b>:viste/4</b>', { viste: st.viste.size }));
    stage.redraw();
    if (!sfida && st.viste.size >= 4 && !st.completo) {
      st.completo = true; sfx.ok(); fx.flash();
    }
  }
  registra(); upd();

  w.setFoot(t('<b>Da notare:</b> per essere sicuro di quale porta c\'è nella scatola devi provare <b>tutte e quattro</b> le combinazioni. La scatola risponde a una domanda per volta, e non c\'è furbizia che tenga. Al livello 9 la stessa scatola, interrogata da un computer quantistico, risponderà a <b>tutte le combinazioni in una volta sola</b>.'));
  return { state: st };
}

/* ============================================================
   3) COSTRUIRE CON UN SOLO TIPO DI PORTA (NAND)
   ============================================================ */

export function nandForge(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, {
    title: t('L\'officina del NAND'),
    subtitle: t('una porta sola, e ci costruisci tutte le altre'),
  });

  const BERSAGLI = [
    { nome: 'NOT A', firma: '1100', aiuto: t('un NAND con lo stesso filo in tutti e due gli ingressi') },
    { nome: 'AND', firma: '0001', aiuto: t('NAND, e poi un NAND che fa da NOT') },
    { nome: 'OR', firma: '0111', aiuto: t('nega A, nega B, e poi mettili in NAND (è De Morgan)') },
    { nome: 'XOR', firma: '0110', aiuto: t('quattro NAND: è il pezzo che il livello K·3 userà per sommare') },
  ];
  const SORGENTI = ['A', 'B', 'G1', 'G2', 'G3', 'G4'];

  const st = {
    bersaglio: 0,
    in1: ['A', 'A', 'A', 'A'], in2: ['A', 'A', 'A', 'A'],
    uscita: 'G1',
    fatti: new Set(),
  };

  /** Valuta la rete per un ingresso (a, b). Ritorna null se un filo è "in avanti". */
  function valuta(a, b) {
    const g = [null, null, null, null];
    const leggi = (nome, indiceGate) => {
      if (nome === 'A') return a;
      if (nome === 'B') return b;
      const k = Number(nome[1]) - 1;
      if (k >= indiceGate) return null;      // un NAND non può usare sé stesso né uno che viene dopo
      return g[k];
    };
    for (let i = 0; i < 4; i++) {
      const x = leggi(st.in1[i], i), y = leggi(st.in2[i], i);
      g[i] = (x === null || y === null) ? null : ((x & y) ^ 1);
    }
    return g[Number(st.uscita[1]) - 1];
  }

  const firmaRete = () => [[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => {
    const v = valuta(a, b);
    return v === null ? '·' : v;
  }).join('');

  const stage = new Stage(w.body, {
    height: 230,
    draw(ctx, s) {
      bg(ctx, s);
      const bers = BERSAGLI[st.bersaglio];
      const mia = firmaRete();
      const uguali = mia.split('').filter((c, i) => c === bers.firma[i]).length;
      const hit = mia === bers.firma;
      const top = hudK(ctx, s, {
        goal: t('costruisci :porta usando solo NAND', { porta: bers.nome }),
        closeness: uguali / 4, hit,
        sub: bers.aiuto,
      });

      // le quattro scatole NAND, in fila
      const bw = Math.min(112, (s.w - 40) / 4 - 8), bh = 58;
      const x0 = (s.w - (bw * 4 + 24)) / 2, y = top + 26;
      for (let i = 0; i < 4; i++) {
        const usata = st.uscita === 'G' + (i + 1) ||
          [st.in1, st.in2].some(arr => arr.some((v, k) => v === 'G' + (i + 1) && k > i));
        const x = x0 + i * (bw + 8);
        roundRect(ctx, x, y, bw, bh, 9, {
          fill: usata ? 'rgba(34,211,238,.09)' : 'rgba(255,255,255,.03)',
          stroke: st.uscita === 'G' + (i + 1) ? COL.amber : (usata ? COL.cyan : '#22304d'),
          width: st.uscita === 'G' + (i + 1) ? 2 : 1.2,
        });
        text(ctx, 'NAND', x + bw / 2, y + 18, { size: 12, align: 'center', color: '#9dabc9', weight: '800' });
        text(ctx, `${st.in1[i]} · ${st.in2[i]}`, x + bw / 2, y + 38, { size: 12.5, align: 'center', color: COL.cyan });
        text(ctx, 'G' + (i + 1), x + bw / 2, y - 10, { size: 10.5, align: 'center', color: '#7f8fb3' });
      }

      // le due tabelle, affiancate: la tua e quella richiesta
      const ty = y + bh + 24;
      const cella = 30;
      const tx = (s.w - cella * 4 - 92) / 2 + 92;
      text(ctx, t('la tua'), tx - 12, ty + 12, { size: 11, align: 'right', color: '#7f8fb3' });
      text(ctx, bers.nome, tx - 12, ty + 42, { size: 11, align: 'right', color: COL.amber, max: 88 });
      for (let i = 0; i < 4; i++) {
        const bene = mia[i] === bers.firma[i];
        roundRect(ctx, tx + i * cella, ty, cella - 4, 24, 5,
          { stroke: bene ? COL.green : '#3a4c73', fill: bene ? 'rgba(52,211,153,.14)' : 'transparent' });
        text(ctx, mia[i], tx + i * cella + (cella - 4) / 2, ty + 12, { size: 13, align: 'center', color: bene ? COL.green : COL.red, weight: '800' });
        roundRect(ctx, tx + i * cella, ty + 30, cella - 4, 24, 5, { stroke: '#3a4c73' });
        text(ctx, bers.firma[i], tx + i * cella + (cella - 4) / 2, ty + 42, { size: 13, align: 'center', color: COL.amber, weight: '800' });
        text(ctx, ['00', '01', '10', '11'][i], tx + i * cella + (cella - 4) / 2, ty + 68, { size: 10, align: 'center', color: '#5b6b90' });
      }
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  /* I collegamenti si scelgono da menù a tendina e non trascinando i fili:
     il trascinamento su telefono è una lotteria, e qui il contenuto da imparare
     è «chi è collegato a chi», non la manualità. */
  function menu(etichetta, valore, onchange, indiceGate) {
    const sel = h('select', { class: 'sel', onchange: e => { onchange(e.target.value); aggiorna(); } },
      SORGENTI.map(sr => h('option', {
        value: sr, selected: sr === valore || null,
        disabled: sr[0] === 'G' && Number(sr[1]) - 1 >= indiceGate ? true : null,
      }, sr)));
    return h('label', { class: 'sel-wrap' }, h('span', {}, etichetta), sel);
  }

  const griglia = h('div', { class: 'sel-grid' });
  function costruisciMenu() {
    griglia.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      griglia.appendChild(h('div', { class: 'sel-row' },
        h('b', {}, 'G' + (i + 1)),
        menu(t('ingresso 1'), st.in1[i], v => { st.in1[i] = v; }, i),
        menu(t('ingresso 2'), st.in2[i], v => { st.in2[i] = v; }, i),
      ));
    }
    griglia.appendChild(h('div', { class: 'sel-row' },
      h('b', {}, '⇒'),
      h('label', { class: 'sel-wrap' }, h('span', {}, t('uscita della rete')),
        h('select', {
          class: 'sel', onchange: e => { st.uscita = e.target.value; aggiorna(); },
        }, ['G1', 'G2', 'G3', 'G4'].map(g => h('option', { value: g, selected: g === st.uscita || null }, g)))),
    ));
  }
  costruisciMenu();
  w.body.appendChild(griglia);

  const out = readout('');
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons(
    BERSAGLI.map((b, i) => ({
      label: (st.fatti.has(b.nome) ? '✓ ' : '') + b.nome,
      onclick: () => { st.bersaglio = i; aggiorna(); },
    })),
  )));
  w.body.appendChild(out.root);

  function aggiorna() {
    const bers = BERSAGLI[st.bersaglio];
    const mia = firmaRete();
    const hit = mia === bers.firma;
    if (hit && !st.fatti.has(bers.nome)) {
      st.fatti.add(bers.nome);
      sfx.ok(); fx.burst(stage.w / 2, stage.h / 2); fx.flash();
      /* Le prime tre bastano: XOR è il bonus, e legarci la missione vorrebbe
         dire fermare qui chi ha già capito il punto. */
      if (['NOT A', 'AND', 'OR'].every(n => st.fatti.has(n))) cfg.onWin && cfg.onWin(st.fatti.size);
    }
    out.set(t('La tua rete fa <b>:mia</b>, il bersaglio è <b>:bersaglio</b>.', { mia, bersaglio: bers.firma })
      + '\n' + t('Costruite finora: <b>:elenco</b>', { elenco: st.fatti.size ? [...st.fatti].join(', ') : '—' })
      + (hit ? '\n<span class="g">✓ ' + t('è esattamente :porta, fatta di soli NAND.', { porta: bers.nome }) + '</span>' : ''));
    stage.redraw();
  }
  aggiorna();

  w.setFoot(t('<b>Perché conta:</b> un tipo solo di porta basta per costruire qualunque calcolo — si dice che il NAND è <b>universale</b>. Anche il computer quantistico ha i suoi insiemi universali di porte, e ci si arriva con lo stesso ragionamento: pochi mattoni, combinati, fanno tutto il resto.'));
  return { state: st };
}

/* ============================================================
   4) LA SOMMA IN BINARIO — riporti fatti a mano
   ============================================================ */

export function adderLab(host, opts = {}) {
  const cfg = Object.assign({ bits: 4, need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('Il sommatore a :n bit', { n: cfg.bits }),
    subtitle: t('metti tu i riporti, come si fa in colonna'),
  });

  const N = cfg.bits;
  const st = { a: [], b: [], riporti: [], somma: [], fatti: 0, esito: '', rects: [] };

  function nuova() {
    const va = 1 + Math.floor(Math.random() * (2 ** N - 2));
    const vb = 1 + Math.floor(Math.random() * (2 ** N - 1 - va));
    st.a = inBinario(va, N); st.b = inBinario(vb, N);
    st.riporti = new Array(N + 1).fill(0);   // riporti[i] entra nella colonna i
    st.somma = new Array(N + 1).fill(0);     // una cifra in più: il traboccamento
    st.esito = '';
    upd();
  }

  /** La soluzione giusta, per il confronto. */
  function corretta() {
    const rip = new Array(N + 1).fill(0), som = new Array(N + 1).fill(0);
    for (let i = N - 1; i >= 0; i--) {
      const tot = st.a[i] + st.b[i] + rip[i + 1];
      som[i + 1] = tot & 1;
      rip[i] = tot > 1 ? 1 : 0;
    }
    som[0] = rip[0];
    return { rip, som };
  }

  const stage = new Stage(w.body, {
    height: 260,
    draw(ctx, s) {
      bg(ctx, s);
      const sol = corretta();
      const giusti = st.somma.filter((v, i) => v === sol.som[i]).length + st.riporti.filter((v, i) => v === sol.rip[i]).length;
      const hit = st.somma.every((v, i) => v === sol.som[i]) && st.riporti.every((v, i) => v === sol.rip[i]);
      const top = hudK(ctx, s, {
        goal: t('somma :a + :b in binario', { a: valoreDi(st.a), b: valoreDi(st.b) }),
        closeness: giusti / (2 * (N + 1)), hit,
        sub: t('tocca le caselle blu per metterci 0 o 1 — parti da destra, come in prima elementare'),
      });

      const cella = Math.min(46, (s.w - 120) / (N + 1));
      const x0 = s.w - 20 - cella * (N + 1);
      const y = top + 16;
      const riga = (etichetta, valori, colore, chi, offset = 0) => {
        text(ctx, etichetta, x0 - 12, y + offset + cella / 2, { size: 11, align: 'right', color: '#7f8fb3', max: 100 });
        return valori.map((v, i) => {
          const x = x0 + i * cella;
          const cliccabile = chi !== null;
          const bene = chi === 'somma' ? v === sol.som[i] : chi === 'riporti' ? v === sol.rip[i] : true;
          roundRect(ctx, x + 2, y + offset + 2, cella - 4, cella - 4, 6, {
            fill: cliccabile ? (bene ? 'rgba(52,211,153,.14)' : 'rgba(34,211,238,.08)') : 'transparent',
            stroke: cliccabile ? (bene ? COL.green : COL.cyan) : '#22304d',
          });
          text(ctx, String(v), x + cella / 2, y + offset + cella / 2,
            { size: 17, align: 'center', color: colore, weight: '800' });
          return chi ? { x, y: y + offset, w: cella, h: cella, chi, i } : null;
        }).filter(Boolean);
      };

      st.rects = [];
      st.rects.push(...riga(t('riporto'), st.riporti, COL.pink, 'riporti', 0));
      riga('A = ' + valoreDi(st.a), ['', ...st.a], COL.cyan, null, cella);
      riga('B = ' + valoreDi(st.b), ['', ...st.b], COL.violet, null, cella * 2);
      // la riga della somma sta sotto il tratto
      ctx.strokeStyle = '#3a4c73'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x0, y + cella * 3 + 3); ctx.lineTo(x0 + cella * (N + 1), y + cella * 3 + 3); ctx.stroke();
      st.rects.push(...riga(t('somma'), st.somma, COL.amber, 'somma', cella * 3 + 8));

      text(ctx, t('sommate giuste: :fatte/:totali', { fatte: st.fatti, totali: cfg.need }),
        14, s.h - 12, { size: 11, color: '#7f8fb3' });
      if (st.esito) text(ctx, st.esito, s.w - 14, s.h - 12, { size: 12, align: 'right', color: COL.amber, mono: false, max: s.w - 180 });
      fx.draw(ctx);
    },
    onPointer(e) {
      if (e.type !== 'down') return;
      const r = st.rects.find(x => dentro(x, e.x, e.y));
      if (!r) return;
      st[r.chi][r.i] ^= 1;
      sfx.click();
      upd();
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const out = readout('');
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([
    { label: '🎲 ' + t('nuova somma'), class: 'sm primary', onclick: nuova },
    { label: '👀 ' + t('mostrami la soluzione'), onclick: () => { const s = corretta(); st.riporti = s.rip.slice(); st.somma = s.som.slice(); st.esito = t('(soluzione mostrata: questa non conta)'); st.mostrata = true; upd(); } },
  ])));
  w.body.appendChild(out.root);

  function upd() {
    const sol = corretta();
    const hit = st.somma.every((v, i) => v === sol.som[i]) && st.riporti.every((v, i) => v === sol.rip[i]);
    out.set(
      t('In decimale: <b>:a + :b = :tot</b>. In binario le colonne si fanno una per volta, da destra: se la colonna fa 2, scrivi 0 e <b>porti 1</b>.',
        { a: valoreDi(st.a), b: valoreDi(st.b), tot: valoreDi(st.a) + valoreDi(st.b) })
      + '\n' + t('Ogni colonna è due porte: <b>somma = A XOR B</b>, <b>riporto = A AND B</b>. Sono le stesse porte del livello K·2.')
      + (hit ? '\n<span class="g">✓ ' + t('colonne tutte giuste.') + '</span>' : ''));
    stage.redraw();
    if (hit && !st.vinta) {
      st.vinta = true;
      if (!st.mostrata) {
        st.fatti++; sfx.ok(); fx.burst(stage.w / 2, stage.h / 2); fx.flash();
        if (st.fatti >= cfg.need) cfg.onWin && cfg.onWin(st.fatti);
      }
    } else if (!hit) { st.vinta = false; st.mostrata = false; }
  }
  nuova();

  w.setFoot(t('<b>Il punto da tenere:</b> il riporto passa da una colonna alla successiva, quindi le colonne vanno fatte <b>in ordine</b>. È una catena, e una catena non si accorcia mettendo più processori. Il sommatore quantistico ha lo stesso problema — e in più deve essere <b>reversibile</b>, cosa che il livello K·6 spiega.'));
  return { state: st };
}
