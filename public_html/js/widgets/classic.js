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
    modo: 'classico',
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
    modo: 'classico',
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

/** I quattro casi possibili di due ingressi, sempre in quest'ordine. */
export const CASI = [[0, 0], [0, 1], [1, 0], [1, 1]];

/** Il bit che esce da ogni NAND per UN caso solo: gli ingressi valgono a e b.
 *
 *  Gli ingressi della rete restano due, A e B, e ogni filo porta UN bit: è la
 *  cosa che si perde di vista guardando le tabelle a quattro cifre, e quindi è
 *  anche quello che il gioco fa vedere acceso, un caso per volta.
 *
 *  Un NAND che pesca da sé stesso o da uno che viene dopo non ha un valore:
 *  al suo posto c'è null, perché in un circuito quel filo non esisterebbe. */
export function valoriNand(in1, in2, a, b) {
  const v = [null, null, null, null];
  const leggi = (nome, indiceGate) => {
    if (nome === 'A') return a;
    if (nome === 'B') return b;
    const k = Number(nome[1]) - 1;
    return k >= indiceGate ? null : v[k];    // né sé stesso né uno che viene dopo
  };
  for (let i = 0; i < 4; i++) {
    const x = leggi(in1[i], i), y = leggi(in2[i], i);
    v[i] = (x === null || y === null) ? null : ((x & y) ^ 1);
  }
  return v;
}

/** La tabella di verità di ogni singolo NAND, come stringa di 4 cifre.
 *
 *  Le quattro cifre NON sono quattro uscite: sono la stessa uscita, provata nei
 *  quattro casi di A e B. È il riassunto della porta — quattro esperimenti messi
 *  in fila — ed è pura apposta: il gioco la usa per far vedere cosa esce da OGNI
 *  porta e non solo dall'ultima, il collaudo per verificare che le ricette
 *  insegnate qui dentro producano davvero quello che promettono. */
export function firmeNand(in1, in2) {
  const casi = CASI.map(([a, b]) => valoriNand(in1, in2, a, b));
  return [0, 1, 2, 3].map(i => casi.map(v => v[i] === null ? '·' : v[i]).join(''));
}

/** Le porte che l'uscita usa davvero, risalendo i fili all'indietro. */
export function porteCollegate(in1, in2, uscita) {
  const set = new Set();
  const risali = nome => {
    if (nome[0] !== 'G') return;
    const k = Number(nome[1]) - 1;
    if (set.has(k)) return;                  // il visitato ferma anche gli anelli
    set.add(k);
    risali(in1[k]); risali(in2[k]);
  };
  risali(uscita);
  return set;
}

/* Una tabella di verità che vale la pena chiamare per nome. Serve a leggere la
   rete un pezzo per volta: se G1 fa 1110 quello è un NAND, se G2 fa 0001 quello
   è già l'AND, e il ragionamento si chiude prima di guardare il bersaglio. */
const NOMI_DI_FIRMA = {
  '0000': '0 fisso', '1111': '1 fisso',
  '0001': 'AND', '0111': 'OR', '0110': 'XOR',
  '1110': 'NAND', '1000': 'NOR', '1001': 'XNOR',
  '1100': 'NOT A', '1010': 'NOT B', '0011': 'A', '0101': 'B',
};

/* Le ricette, scritte come dati e non come prosa, per due motivi: il gioco ne
   ricava i passi da svelare uno per volta, e il collaudo verifica che montando
   quei fili esca davvero la firma promessa. Un aiuto sbagliato in un esercizio
   che si risolve a tentativi non se ne accorgerebbe nessuno. */
export const RICETTE_NAND = {
  'NOT A': {
    firma: '1100',
    passi: [
      { gate: 1, in: ['A', 'A'], firma: '1100', motivo: t('lo stesso filo nei due ingressi: «non (A e A)» è «non A».') },
    ],
  },
  AND: {
    firma: '0001',
    passi: [
      { gate: 1, in: ['A', 'B'], firma: '1110', motivo: t('un NAND è l\'AND rovesciato: 1110 è 0001 con gli 0 e gli 1 scambiati.') },
      { gate: 2, in: ['G1', 'G1'], firma: '0001', motivo: t('un NAND con lo stesso filo due volte fa da NOT: rovescia G1 e resta l\'AND.') },
    ],
  },
  OR: {
    firma: '0111',
    passi: [
      { gate: 1, in: ['A', 'A'], firma: '1100', motivo: t('questo è NOT A.') },
      { gate: 2, in: ['B', 'B'], firma: '1010', motivo: t('e questo è NOT B.') },
      { gate: 3, in: ['G1', 'G2'], firma: '0111', motivo: t('De Morgan: «non (non A e non B)» è «A oppure B».') },
    ],
  },
  XOR: {
    firma: '0110',
    passi: [
      { gate: 1, in: ['A', 'B'], firma: '1110', motivo: t('il NAND di partenza: vale 0 solo quando A e B sono tutti e due 1.') },
      { gate: 2, in: ['A', 'G1'], firma: '1101', motivo: t('vale 0 solo nel caso A=1, B=0.') },
      { gate: 3, in: ['B', 'G1'], firma: '1011', motivo: t('vale 0 solo nel caso opposto, A=0, B=1.') },
      { gate: 4, in: ['G2', 'G3'], firma: '0110', motivo: t('il NAND dei due: dà 1 esattamente quando A e B sono diversi.') },
    ],
  },
};

/* La rete di partenza NON deve essere già la soluzione di un bersaglio. Con
   tutti i fili su A, G1 era NAND(A,A) = NOT A: il gioco si dichiarava vinto da
   solo prima che l'utente toccasse qualcosa, che è il modo migliore per non
   capire cosa si è fatto. Si parte dal NAND liscio, A·B, che è la porta di casa
   e non è nessuno dei bersagli. Esportata perché il collaudo lo verifichi. */
export const PARTENZA_NAND = { in1: ['A', 'A', 'A', 'A'], in2: ['B', 'A', 'A', 'A'], uscita: 'G1' };

export function nandForge(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, {
    modo: 'classico',
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
    in1: [...PARTENZA_NAND.in1], in2: [...PARTENZA_NAND.in2],
    uscita: PARTENZA_NAND.uscita,
    a: 0, b: 0,                // il caso acceso adesso: gli ingressi sono due, e basta
    fatti: new Set(),
    passi: 0,                  // quanti passi della ricetta sono già stati svelati
    rects: [],
  };

  const firme = () => firmeNand(st.in1, st.in2);
  const firmaRete = () => firme()[Number(st.uscita[1]) - 1];
  const valori = () => valoriNand(st.in1, st.in2, st.a, st.b);
  const collegate = () => porteCollegate(st.in1, st.in2, st.uscita);
  const ricetta = () => RICETTE_NAND[BERSAGLI[st.bersaglio].nome];
  const caso = () => st.a * 2 + st.b;        // qual è la colonna accesa, fra 00 01 10 11

  const stage = new Stage(w.body, {
    height: 324,
    draw(ctx, s) {
      bg(ctx, s);
      const bers = BERSAGLI[st.bersaglio];
      const f = firme();
      const v = valori();
      const mia = firmaRete();
      const usate = collegate();
      const uguali = mia.split('').filter((c, i) => c === bers.firma[i]).length;
      const hit = mia === bers.firma;
      const top = hudK(ctx, s, {
        goal: t('costruisci :porta usando solo NAND', { porta: bers.nome }),
        closeness: uguali / 4, hit,
        sub: bers.aiuto,
      });

      /* Gli ingressi, come interruttori veri. Servono a rispondere alla domanda
         che si fanno tutti: «se ho solo A e B, perché escono quattro bit?».
         Ne esce uno: gli interruttori stanno lì per far vedere che cambiando il
         caso cambia quel bit, e che le quattro cifre sono le quattro prove. */
      const iy = top + 22;   // sotto il suggerimento dell'HUD, che sta a 48
      st.rects = [
        Object.assign(bitBox(ctx, 16, iy, 40, 40, st.a, { label: 'A' }), { chi: 'a' }),
        Object.assign(bitBox(ctx, 64, iy, 40, 40, st.b, { label: 'B' }), { chi: 'b' }),
      ];
      text(ctx, t('gli ingressi sono due — tocca per cambiarli'), 116, iy + 12,
        { size: 11, color: '#9dabc9', max: s.w - 130 });
      text(ctx, t('adesso stai provando il caso :caso, la colonna :caso qui sotto', { caso: `${st.a}${st.b}` }),
        116, iy + 30, { size: 11, color: COL.amber, max: s.w - 130 });

      /* Le quattro scatole NAND, in fila. Ognuna dice tre cose: da dove prende i
         suoi due ingressi, che bit ne esce adesso, e la sua tabella di verità
         completa. È la differenza fra un esercizio che si risolve a tentativi e
         uno che si ragiona: la catena si segue un pezzo per volta. */
      const bw = Math.min(112, (s.w - 40) / 4 - 8), bh = 70;
      const x0 = (s.w - (bw * 4 + 24)) / 2, y = iy + 70;
      for (let i = 0; i < 4; i++) {
        const usata = usate.has(i);
        const finale = st.uscita === 'G' + (i + 1);
        const x = x0 + i * (bw + 8);
        roundRect(ctx, x, y, bw, bh, 9, {
          fill: usata ? 'rgba(34,211,238,.09)' : 'rgba(255,255,255,.03)',
          stroke: finale ? COL.amber : (usata ? COL.cyan : '#22304d'),
          width: finale ? 2 : 1.2,
          alpha: usata ? 1 : 0.55,
        });
        text(ctx, 'NAND', x + bw / 2, y + 13, { size: 11, align: 'center', color: '#9dabc9', weight: '800' });
        text(ctx, `${st.in1[i]} · ${st.in2[i]}`, x + bw / 2, y + 30, { size: 12, align: 'center', color: usata ? COL.cyan : '#5b6b90', max: bw - 8 });
        text(ctx, v[i] === null ? '—' : String(v[i]), x + bw / 2, y + 53, {
          size: 20, align: 'center', weight: '800',
          color: v[i] === null ? COL.red : (v[i] ? COL.green : '#5b6b90'),
        });
        text(ctx, 'G' + (i + 1) + (finale ? ' ⇒ ' + t('uscita') : ''), x + bw / 2, y - 10,
          { size: 10.5, align: 'center', color: finale ? COL.amber : '#7f8fb3', max: bw + 24 });
        text(ctx, usata ? f[i] : t('scollegata'), x + bw / 2, y + bh + 11,
          { size: 10.5, align: 'center', color: usata ? '#9dabc9' : '#5b6b90', max: bw + 8 });
      }

      // le due tabelle, affiancate: la tua e quella richiesta
      const ty = y + bh + 30;
      const cella = 30;
      const tx = (s.w - cella * 4 - 92) / 2 + 92;
      text(ctx, t('la tua'), tx - 12, ty + 12, { size: 11, align: 'right', color: '#7f8fb3' });
      text(ctx, bers.nome, tx - 12, ty + 42, { size: 11, align: 'right', color: COL.amber, max: 88 });
      for (let i = 0; i < 4; i++) {
        const bene = mia[i] === bers.firma[i];
        // la colonna del caso acceso: è il ponte fra l'interruttore e la tabella
        if (i === caso()) {
          roundRect(ctx, tx + i * cella - 4, ty - 5, cella + 3, 82, 7, { stroke: COL.amber, alpha: 0.55 });
        }
        roundRect(ctx, tx + i * cella, ty, cella - 4, 24, 5,
          { stroke: bene ? COL.green : '#3a4c73', fill: bene ? 'rgba(52,211,153,.14)' : 'transparent' });
        text(ctx, mia[i], tx + i * cella + (cella - 4) / 2, ty + 12, { size: 13, align: 'center', color: bene ? COL.green : COL.red, weight: '800' });
        roundRect(ctx, tx + i * cella, ty + 30, cella - 4, 24, 5, { stroke: '#3a4c73' });
        text(ctx, bers.firma[i], tx + i * cella + (cella - 4) / 2, ty + 42, { size: 13, align: 'center', color: COL.amber, weight: '800' });
        text(ctx, CASI[i].join(''), tx + i * cella + (cella - 4) / 2, ty + 68, { size: 10, align: 'center', color: i === caso() ? COL.amber : '#5b6b90' });
      }
      text(ctx, 'A B', tx - 12, ty + 68, { size: 10, align: 'right', color: '#5b6b90' });
      fx.draw(ctx);
    },
    onPointer(e) {
      if (e.type !== 'down') return;
      const r = st.rects.find(x => dentro(x, e.x, e.y));
      if (!r) return;
      st[r.chi] = st[r.chi] ? 0 : 1;
      sfx.click();
      aggiorna();
    },
  });
  const fx = new FX(stage);
  stage.pause();

  /* I collegamenti si scelgono da menù a tendina e non trascinando i fili:
     il trascinamento su telefono è una lotteria, e qui il contenuto da imparare
     è «chi è collegato a chi», non la manualità. */
  const menuIn1 = [], menuIn2 = [];
  function menu(etichetta, elenco, valore, onchange, indiceGate) {
    const sel = h('select', { class: 'sel', onchange: e => { onchange(e.target.value); aggiorna(); } },
      elenco.map(sr => h('option', {
        value: sr, selected: sr === valore || null,
        disabled: indiceGate != null && sr[0] === 'G' && Number(sr[1]) - 1 >= indiceGate ? true : null,
      }, sr)));
    return { sel, root: h('label', { class: 'sel-wrap' }, h('span', {}, etichetta), sel) };
  }

  /* Il gergo, detto una volta e in chiaro. «G1» non vuol dire niente a chi non
     l'ha mai visto, e un esercizio che dà per scontato il proprio alfabeto si
     può solo risolvere a tentativi. */
  w.body.appendChild(h('div', { class: 'readout' },
    h('div', { html: t('<b>G1, G2, G3, G4</b> sono le quattro porte NAND che hai a disposizione — <b>G</b> sta per <i>gate</i>, porta. Per ognuna scegli da dove arrivano i suoi due ingressi: da A, da B, oppure dall\'uscita di una porta precedente.') }),
    h('div', { style: { marginTop: '6px' }, html: t('<b>Uscita della rete</b> dice quale di quelle quattro porte leggi alla fine: il bit che esce da lei è il risultato di tutta la rete. Le altre porte, se non arrivano fin lì, non contano niente.') }),
  ));

  const griglia = h('div', { class: 'sel-grid' });
  for (let i = 0; i < 4; i++) {
    const m1 = menu(t('ingresso 1'), SORGENTI, st.in1[i], v => { st.in1[i] = v; }, i);
    const m2 = menu(t('ingresso 2'), SORGENTI, st.in2[i], v => { st.in2[i] = v; }, i);
    menuIn1.push(m1.sel); menuIn2.push(m2.sel);
    griglia.appendChild(h('div', { class: 'sel-row' }, h('b', {}, 'G' + (i + 1)), m1.root, m2.root));
  }
  const menuUscita = menu(t('uscita della rete'), ['G1', 'G2', 'G3', 'G4'], st.uscita, v => { st.uscita = v; }, null);
  griglia.appendChild(h('div', { class: 'sel-row' }, h('b', {}, '⇒'), menuUscita.root));
  w.body.appendChild(griglia);

  /* La catena, scritta in chiaro: G1 fa questo, G2 fa quest'altro, e l'uscita
     è quella. Senza questa riga l'unico modo di sapere se hai fatto giusto è
     guardare se il semaforo è verde — cioè fidarsi, non capire. */
  const catena = readout('');
  const out = readout('');
  const fileBottoni = h('div', { style: { marginTop: '10px' } });
  const btnPassi = h('button', {
    class: 'btn sm', onclick: () => {
      st.passi = st.passi > ricetta().passi.length ? 0 : st.passi + 1;
      aggiorna();
    },
  }, '');
  const btnAzzera = h('button', {
    class: 'btn sm', onclick: () => {
      st.in1 = [...PARTENZA_NAND.in1]; st.in2 = [...PARTENZA_NAND.in2];
      st.uscita = PARTENZA_NAND.uscita; st.passi = 0; aggiorna();
    },
  }, t('azzera la rete'));
  const guida = readout('');
  w.body.appendChild(fileBottoni);
  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '8px' } }, btnPassi, btnAzzera));
  w.body.appendChild(guida.root);
  w.body.appendChild(catena.root);
  w.body.appendChild(out.root);

  /** La rete letta un pezzo per volta: cosa entra, cosa esce adesso, e la
   *  tabella completa di ogni porta. Le due colonne stanno insieme apposta —
   *  la prima è il bit vero che scorre nel filo con questi A e B, la seconda è
   *  lo stesso filo provato in tutti e quattro i casi. */
  function catenaHtml() {
    const f = firme(), v = valori(), usate = collegate(), righe = [];
    righe.push(t('con A=:a e B=:b (colonna :caso):', { a: st.a, b: st.b, caso: `${st.a}${st.b}` }));
    for (let i = 0; i < 4; i++) {
      if (!usate.has(i)) continue;
      /* Un NAND con lo stesso filo in tutti e due gli ingressi è un NOT, e
         chiamarlo NAND qui nasconderebbe proprio il passaggio da capire. */
      const espr = st.in1[i] === st.in2[i] ? `NOT(${st.in1[i]})` : `NAND(${st.in1[i]},${st.in2[i]})`;
      const nome = NOMI_DI_FIRMA[f[i]] || '';
      righe.push((st.uscita === 'G' + (i + 1) ? '⇒ ' : '  ') + `G${i + 1} = ${espr}`.padEnd(17)
        + ' → <b>' + (v[i] === null ? '—' : v[i]) + '</b>'
        + '   <span class="c">' + f[i] + '</span>' + (nome ? ' <span class="a">' + nome + '</span>' : ''));
    }
    const fuori = [0, 1, 2, 3].filter(i => !usate.has(i)).map(i => 'G' + (i + 1));
    if (fuori.length) {
      righe.push(t('(:elenco non arrivano all\'uscita: non contano)', { elenco: fuori.join(', ') }));
    }
    righe.push(t('La colonna azzurra è la stessa porta provata in tutti e quattro i casi: <b>un</b> bit alla volta, quattro volte.'));
    return righe.join('\n');
  }

  /** I passi della ricetta, svelati uno per volta e da montare a mano. */
  function guidaHtml() {
    if (!st.passi) return '';
    const bers = BERSAGLI[st.bersaglio];
    const ric = ricetta();
    const righe = ric.passi.slice(0, st.passi).map((p, k) => t(
      '<b>:passo.</b> G:gate: ingresso 1 = <b>:uno</b>, ingresso 2 = <b>:due</b> — :motivo Controlla G:gate: deve fare <b>:firma</b>.',
      { passo: k + 1, gate: p.gate, uno: p.in[0], due: p.in[1], motivo: p.motivo, firma: p.firma },
    ));
    if (st.passi > ric.passi.length) {
      righe.push(t('<b>:passo.</b> Uscita della rete = <b>G:gate</b>. Ecco :porta con :quante porte, e ogni passo si vede da solo nella catena qui sotto.', {
        passo: ric.passi.length + 1,
        gate: ric.passi[ric.passi.length - 1].gate,
        porta: bers.nome,
        quante: ric.passi.length,
      }));
    }
    return righe.join('\n');
  }

  function aggiorna() {
    const bers = BERSAGLI[st.bersaglio];
    const ric = ricetta();
    const mia = firmaRete();
    const hit = mia === bers.firma;
    const usate = collegate().size;
    /* Il primo giro serve solo a disegnare: una porta «costruita» senza che
       nessuno abbia toccato niente non ha insegnato niente a nessuno. */
    if (hit && montato && !st.fatti.has(bers.nome)) {
      st.fatti.add(bers.nome);
      sfx.ok(); fx.burst(stage.w / 2, stage.h / 2); fx.flash();
      /* Le prime tre bastano: XOR è il bonus, e legarci la missione vorrebbe
         dire fermare qui chi ha già capito il punto. */
      if (['NOT A', 'AND', 'OR'].every(n => st.fatti.has(n))) cfg.onWin && cfg.onWin(st.fatti.size);
    }

    // i menù seguono lo stato, perché «azzera» lo cambia senza toccarli
    for (let i = 0; i < 4; i++) { menuIn1[i].value = st.in1[i]; menuIn2[i].value = st.in2[i]; }
    menuUscita.sel.value = st.uscita;

    fileBottoni.innerHTML = '';
    fileBottoni.appendChild(buttons(BERSAGLI.map((b, i) => ({
      label: (st.fatti.has(b.nome) ? '✓ ' : '') + b.nome,
      onclick: () => { st.bersaglio = i; st.passi = 0; aggiorna(); },
    }))));
    btnPassi.textContent = st.passi === 0
      ? t('👣 fammi vedere i passi')
      : (st.passi > ric.passi.length
        ? t('nascondi i passi')
        : t('passo successivo (:passo di :quanti)', { passo: st.passi + 1, quanti: ric.passi.length + 1 }));

    guida.set(guidaHtml());
    guida.root.classList.toggle('hidden', !st.passi);
    catena.set(catenaHtml());
    const bitOra = valori()[Number(st.uscita[1]) - 1];
    out.set(t('Adesso dalla rete esce <b>un</b> bit solo: :bit. Le quattro cifre qui sotto sono le quattro risposte, una per ogni caso di A e B.', {
      bit: bitOra === null ? t('nessuno, un filo va all\'indietro') : bitOra,
    })
      + '\n' + t('La tua rete fa <b>:mia</b>, il bersaglio è <b>:bersaglio</b>.', { mia, bersaglio: bers.firma })
      + '\n' + t('Costruite finora: <b>:elenco</b>', { elenco: st.fatti.size ? [...st.fatti].join(', ') : '—' })
      + (hit
        ? '\n<span class="g">✓ ' + t('è esattamente :porta, fatta di soli NAND.', { porta: bers.nome }) + '</span>'
          /* Vincere con porte in più non è un errore — è il momento buono per
             far notare che si può fare con meno, che è metà del mestiere. */
          + (usate > ric.passi.length
            ? '\n' + t('Hai usato :usate porte: lo stesso risultato si ottiene con :minimo. Guarda la catena: qualche porta rifà un lavoro già fatto (due NOT di fila si annullano).', { usate, minimo: ric.passi.length })
            : '\n' + t('E con :minimo porte, che è il minimo per questa ricetta.', { minimo: ric.passi.length }))
        : ''));
    stage.redraw();
  }
  let montato = false;
  aggiorna();
  montato = true;

  w.setFoot(t('<b>Perché conta:</b> un tipo solo di porta basta per costruire qualunque calcolo — si dice che il NAND è <b>universale</b>. Anche il computer quantistico ha i suoi insiemi universali di porte, e ci si arriva con lo stesso ragionamento: pochi mattoni, combinati, fanno tutto il resto.'));
  return { state: st };
}

/* ============================================================
   4) LA SOMMA IN BINARIO — riporti fatti a mano
   ============================================================ */

export function adderLab(host, opts = {}) {
  const cfg = Object.assign({ bits: 4, need: 2, onWin: null }, opts);
  const w = widget(host, {
    modo: 'classico',
    title: t('Il sommatore a :n bit', { n: cfg.bits }),
    subtitle: t('metti tu i riporti, come si fa in colonna'),
  });

  const N = cfg.bits;
  /* `toccate` esiste per un motivo didattico preciso: le caselle partono da 0,
     e diverse caselle giuste valgono 0. Colorare di verde tutto ciò che
     combacia significherebbe regalare metà soluzione appena si apre il gioco —
     resterebbe da "riempire i buchi" invece che da fare il conto. Una casella
     dice se è giusta solo dopo che il giocatore l'ha toccata. */
  const st = { a: [], b: [], riporti: [], somma: [], toccate: new Set(), fatti: 0, esito: '', rects: [] };

  function nuova() {
    const va = 1 + Math.floor(Math.random() * (2 ** N - 2));
    const vb = 1 + Math.floor(Math.random() * (2 ** N - 1 - va));
    st.a = inBinario(va, N); st.b = inBinario(vb, N);
    st.riporti = new Array(N + 1).fill(0);   // riporti[i] entra nella colonna i
    st.somma = new Array(N + 1).fill(0);     // una cifra in più: il traboccamento
    st.toccate = new Set();
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
      /* Il blocco è "etichette + colonne": si centra tutto insieme, altrimenti
         su schermo largo la somma finisce appiccicata al bordo destro con mezzo
         widget vuoto accanto. */
      const etichette = 104;
      const x0 = Math.max(etichette, (s.w - (etichette + cella * (N + 1))) / 2 + etichette);
      const y = top + 16;
      const riga = (etichetta, valori, colore, chi, offset = 0) => {
        text(ctx, etichetta, x0 - 12, y + offset + cella / 2, { size: 11, align: 'right', color: '#7f8fb3', max: 100 });
        return valori.map((v, i) => {
          const x = x0 + i * cella;
          const cliccabile = chi !== null;
          const giusta = chi === 'somma' ? v === sol.som[i] : chi === 'riporti' ? v === sol.rip[i] : true;
          const bene = giusta && (!cliccabile || st.toccate.has(chi + i));
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
      st.toccate.add(r.chi + r.i);
      sfx.click();
      upd();
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const out = readout('');
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons([
    { label: '🎲 ' + t('nuova somma'), class: 'sm primary', onclick: nuova },
    { label: '👀 ' + t('mostrami la soluzione'), onclick: () => { const s = corretta(); st.riporti = s.rip.slice(); st.somma = s.som.slice(); st.toccate = new Set([...s.rip.map((_, i) => 'riporti' + i), ...s.som.map((_, i) => 'somma' + i)]); st.esito = t('(soluzione mostrata: questa non conta)'); st.mostrata = true; upd(); } },
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
