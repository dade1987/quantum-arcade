/* ============================================================
   PARTE M — OPERATORI: UNITARI, HERMITIANI, PROIETTORI

   Al livello 0·6 una matrice è «la macchina che trasforma le frecce».
   Qui si scopre che di macchine ce ne sono tre famiglie speciali, e che
   sono esattamente le tre parole della meccanica quantistica:

   · UNITARIA — non cambia le lunghezze. Sono le PORTE: devono esserlo,
     altrimenti le probabilità non farebbero più 100% e il circuito non
     sarebbe reversibile (livello K·6);

   · HERMITIANA — è uguale al proprio aggiunto. Sono le OSSERVABILI: i
     loro autovalori sono numeri REALI, ed è il minimo che si possa
     chiedere a una cosa che va letta su uno strumento;

   · PROIETTORE — applicarlo due volte è come applicarlo una volta. È la
     MISURA: se rileggi, ritrovi lo stesso risultato.

   SEMPLIFICAZIONE DICHIARATA: qui si lavora con matrici di numeri reali,
   dove «aggiunto» vuol dire semplicemente «ribaltata attorno alla
   diagonale». Coi numeri complessi si ribalta E si gira ogni freccia
   (coniugato): la sostanza non cambia, e la lezione lo dice apertamente
   invece di far finta che i due casi siano identici.
   ============================================================ */

import { Stage, COL, bg, grid, dot, text, roundRect, arrow, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud } from './basicmath.js';

const due = v => (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);

/* ------------------------------------------------------------
   LOGICA PURA
   Una matrice 2×2 è [a, b, c, d]: prima riga a b, seconda riga c d.
   ------------------------------------------------------------ */

export const applica = (M, v) => [M[0] * v[0] + M[1] * v[1], M[2] * v[0] + M[3] * v[1]];
export const prodotto = (M, N) => [
  M[0] * N[0] + M[1] * N[2], M[0] * N[1] + M[1] * N[3],
  M[2] * N[0] + M[3] * N[2], M[2] * N[1] + M[3] * N[3],
];

/** L'aggiunto, nel caso reale: la matrice ribaltata attorno alla diagonale. */
export const aggiunta = M => [M[0], M[2], M[1], M[3]];

export const IDENTITA = [1, 0, 0, 1];
const vicinoA = (M, N, tol = 1e-6) => M.every((x, i) => Math.abs(x - N[i]) < tol);

/** Unitaria (nel reale: ortogonale): l'aggiunto la disfa. */
export const unitaria = (M, tol = 1e-6) => vicinoA(prodotto(aggiunta(M), M), IDENTITA, tol);

/** Hermitiana (nel reale: simmetrica): è uguale al proprio aggiunto. */
export const hermitiana = (M, tol = 1e-6) => vicinoA(M, aggiunta(M), tol);

/** Proiettore: applicarlo due volte è come applicarlo una volta. */
export const proiettore = (M, tol = 1e-6) => vicinoA(prodotto(M, M), M, tol);

export const traccia = M => M[0] + M[3];
export const determinante = M => M[0] * M[3] - M[1] * M[2];

/**
 * Gli autovalori: le radici di λ² − traccia·λ + determinante = 0.
 * È l'equazione di secondo grado del livello 0·7b, e il suo delta dice
 * se gli autovalori sono numeri veri o fasi che girano.
 */
export function autovalori(M) {
  const tr = traccia(M), de = determinante(M);
  const delta = tr * tr - 4 * de;
  if (delta < -1e-12) return { reali: false, valori: [], delta };
  const r = Math.sqrt(Math.max(0, delta));
  return { reali: true, valori: [(tr - r) / 2, (tr + r) / 2].sort((a, b) => a - b), delta };
}

/** Quanto la macchina cambia la lunghezza di una freccia. */
export const fattoreLunghezza = (M, v) => {
  const L = Math.hypot(v[0], v[1]);
  if (L < 1e-12) return 1;
  const w = applica(M, v);
  return Math.hypot(w[0], w[1]) / L;
};

/** Il proiettore sulla direzione data (angolo in gradi): schiaccia tutto su quella retta. */
export function proiettoreSu(gradi) {
  const r = (gradi * Math.PI) / 180;
  const c = Math.cos(r), s = Math.sin(r);
  return [c * c, c * s, c * s, s * s];
}

/** Le due probabilità di misurare lungo una direzione e la sua perpendicolare. */
export function probabilita(v, gradi) {
  const L2 = v[0] * v[0] + v[1] * v[1];
  if (L2 < 1e-12) return [0, 0];
  const p = applica(proiettoreSu(gradi), v);
  const q = applica(proiettoreSu(gradi + 90), v);
  return [(p[0] * p[0] + p[1] * p[1]) / L2, (q[0] * q[0] + q[1] * q[1]) / L2];
}

/* Le macchine pronte del primo gioco: sono le porte che il corso già usa. */
const R2 = Math.SQRT1_2;
export const MACCHINE = [
  { id: 'X', m: [0, 1, 1, 0] },
  { id: 'Z', m: [1, 0, 0, -1] },
  { id: 'H', m: [R2, R2, R2, -R2] },
  { id: 'rot', m: [0, -1, 1, 0] },
  { id: 'stira', m: [2, 0, 0, 0.5] },
  { id: 'proiettore', m: [1, 0, 0, 0] },
];

/* Le direzioni di misura del secondo gioco. */
export const DIREZIONI = [0, 45, 90, 30];

/* ------------------------------------------------------------
   1) LE TRE FAMIGLIE — costruiscile con le manopole
   ------------------------------------------------------------ */
export function operatoreLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('Che razza di macchina è?'),
    subtitle: t('quattro manopole, tre etichette: conserva le lunghezze? è uguale al suo aggiunto? si può rifare?'),
  });

  const st = { m: [1, 0, 0, 1], fatte: new Set(), vinto: false };

  const stage = new Stage(w.body, {
    height: 340,
    draw(ctx, s) {
      bg(ctx, s);
      const M = st.m;
      const u = unitaria(M), he = hermitiana(M), pr = proiettore(M);
      const av = autovalori(M);
      const quante = st.fatte.size;
      const top = hud(ctx, s, {
        goal: t('costruisci una unitaria, una hermitiana e una che sia tutte e due'),
        closeness: quante / cfg.need,
        hit: quante >= cfg.need,
        sub: t('famiglie trovate: :fatte su :totali', { fatte: quante, totali: cfg.need }),
      });

      const zona = { y: top + 8, h: s.h - top - 62 };
      const R = Math.min(zona.h / 2 - 4, 112);
      const larghezzaCol = 196;
      const colonna = s.w > 2 * R + 46 + larghezzaCol;
      const cx = colonna ? Math.round((s.w - (2 * R + 16 + larghezzaCol)) / 2) + R : Math.round(s.w / 2);
      const cy = zona.y + zona.h / 2;
      const K = R / 2.6;

      grid(ctx, cx - R, cy - R, 2 * R, 2 * R, K, K);
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();

      /* Un mazzo di frecce di lunghezza 1: se la macchina è unitaria, quelle
         trasformate restano tutte sul cerchio. Se no, si deforma. */
      for (let g = 0; g < 360; g += 15) {
        const r = (g * Math.PI) / 180;
        const v = [Math.cos(r), Math.sin(r)];
        const t2 = applica(M, v);
        dot(ctx, cx + v[0] * K, cy - v[1] * K, 2.4, '#33425f');
        dot(ctx, cx + t2[0] * K, cy - t2[1] * K, 3.4, u ? COL.green : COL.violet);
      }
      const prova = [1, 0.4];
      arrow(ctx, cx, cy, cx + prova[0] * K, cy - prova[1] * K, { color: COL.cyan, width: 2 });
      const dopo = applica(M, prova);
      arrow(ctx, cx, cy, cx + dopo[0] * K, cy - dopo[1] * K, { color: COL.amber, width: 2.4 });

      if (colonna) {
        const colx = cx + R + 16, maxCol = s.w - colx - 12;
        const righe = [
          [u ? t('✓ unitaria: non cambia le lunghezze') : t('✗ non unitaria: le lunghezze cambiano'), u ? COL.green : COL.dim],
          [he ? t('✓ hermitiana: uguale al suo aggiunto') : t('✗ non hermitiana'), he ? COL.green : COL.dim],
          [pr ? t('✓ proiettore: rifarlo non cambia niente') : '', pr ? COL.amber : null],
          ['', null],
          [av.reali ? t('autovalori: :a e :b', { a: due(av.valori[0]), b: due(av.valori[1]) }) : t('autovalori complessi (delta < 0)'),
            av.reali ? COL.cyan : COL.pink],
        ];
        righe.forEach(([r, c], i) => r && text(ctx, r, colx, zona.y + 16 + i * 22, { size: 11.5, color: c, max: maxCol }));
      }

      // le tre etichette, sempre visibili anche su telefono
      const etichette = [
        [t('unitaria'), u], [t('hermitiana'), he], [t('proiettore'), pr],
      ];
      const bw = Math.min(112, (s.w - 40) / 3 - 6);
      etichette.forEach(([nome, acceso], i) => {
        const x = 16 + i * (bw + 8);
        roundRect(ctx, x, s.h - 46, bw, 24, 6, {
          fill: acceso ? 'rgba(52,211,153,.18)' : 'rgba(255,255,255,.03)',
          stroke: acceso ? COL.green : '#2b3a58',
        });
        text(ctx, (acceso ? '✓ ' : '· ') + nome, x + bw / 2, s.h - 34,
          { size: 11, align: 'center', color: acceso ? COL.green : COL.dim, max: bw - 8 });
      });
      text(ctx, t('i pallini grigi sono le frecce di partenza, quelli colorati dove finiscono'),
        16, s.h - 10, { size: 11, color: COL.dim, max: s.w - 32 });
      st.px = cx; st.py = cy;
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sp = choice({
    label: t('Macchine pronte'),
    items: [
      { label: 'X', value: 0 }, { label: 'Z', value: 1 }, { label: 'H', value: 2 },
      { label: t('rotazione'), value: 3 }, { label: t('stira'), value: 4 }, { label: t('schiaccia'), value: 5 },
    ],
    value: 0,
    onchange: i => { st.m = MACCHINE[i].m.slice(); sincronizza(); upd(); },
  });
  w.body.appendChild(controls(sp.root));
  const cursori = [0, 1, 2, 3].map(i => slider({
    label: ['a', 'b', 'c', 'd'][i], min: -2, max: 2, step: 0.05, value: st.m[i], fmt: due,
    oninput: v => { st.m[i] = v; upd(); },
  }));
  w.body.appendChild(controls(...cursori.map(c => c.root)));
  const out = readout('');
  w.body.appendChild(out.root);

  /* I cursori vanno riallineati quando si carica una macchina pronta,
     altrimenti mostrano ancora i numeri di prima e il primo tocco
     riporterebbe la matrice indietro senza dire niente. */
  function sincronizza() { cursori.forEach((c, i) => { c.value = st.m[i]; }); }

  function upd() {
    const M = st.m;
    const u = unitaria(M), he = hermitiana(M), pr = proiettore(M);
    const av = autovalori(M);
    const prima = st.fatte.size;
    if (u) st.fatte.add('unitaria');
    if (he) st.fatte.add('hermitiana');
    if (u && he) st.fatte.add('tutte-e-due');
    if (st.fatte.size > prima) {
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    out.set(
      t('Traccia :t, determinante :d.', { t: due(traccia(M)), d: due(determinante(M)) }) + '\n' +
      (av.reali
        ? t('Autovalori <b>:a</b> e <b>:b</b>: numeri veri, quindi ci sono direzioni ferme.', { a: due(av.valori[0]), b: due(av.valori[1]) })
        : '<span class="p">' + t('Autovalori complessi: nessuna direzione resta ferma — è una rotazione.') + '</span>') + '\n' +
      (u && he ? '<span class="g">✓ ' + t('Unitaria <b>e</b> hermitiana insieme: è una specchiata. Applicandola due volte torni al punto di partenza — come le porte X, Z e H.') + '</span>'
        : u ? '<span class="g">✓ ' + t('Unitaria: nessuna freccia cambia lunghezza. Una porta quantistica deve essere così, altrimenti le probabilità non farebbero più 100%.') + '</span>'
          : he ? '<span class="g">✓ ' + t('Hermitiana: uguale al suo aggiunto, e i suoi autovalori sono sempre numeri reali. È la forma di un\'osservabile.') + '</span>'
            : pr ? '<span class="a">' + t('Proiettore: schiaccia tutto su una retta, e rifarlo non cambia più niente. È la forma di una misura.') + '</span>'
              : '<span class="a">' + t('Per ora non è di nessuna delle tre famiglie: continua a girare le manopole.') + '</span>'));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Le tre parole della meccanica quantistica.</b> Una <b>porta</b> è una macchina unitaria: non cambia le lunghezze, quindi le probabilità restano 100% e il circuito si può rifare al contrario (livello :k). Un\'<b>osservabile</b> è una macchina hermitiana: i suoi autovalori sono reali, cioè numeri che si possono leggere su uno strumento. Una <b>misura</b> è un proiettore. Tre famiglie di matrici, tre concetti — e li hai appena costruiti con quattro manopole.', { k: nOf('k6-reversibile') }));
  return { state: st };
}

/* ------------------------------------------------------------
   2) IL PROIETTORE — misurare, e rimisurare
   ------------------------------------------------------------ */
export function proiettoreLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('Misurare è proiettare'),
    subtitle: t('lo stato si schiaccia sulla direzione che esce — e se rileggi, trovi lo stesso'),
    modo: 'quantistico',
  });

  const st = { g: 0, stato: 55, esito: null, letture: [], fatte: new Set(), vinto: false };

  const stage = new Stage(w.body, {
    height: 320,
    draw(ctx, s) {
      bg(ctx, s);
      const v = [Math.cos((st.stato * Math.PI) / 180), Math.sin((st.stato * Math.PI) / 180)];
      const [p0, p1] = probabilita(v, DIREZIONI[st.g]);
      const stabile = st.letture.length >= 2 && st.letture.every(x => x === st.letture[0]);
      const top = hud(ctx, s, {
        goal: t('misura, poi rimisura: cambia qualcosa?'),
        closeness: Math.min(1, st.letture.length / 2),
        hit: stabile,
        sub: t('basi provate: :fatte su :totali', { fatte: st.fatte.size, totali: cfg.need }),
      });

      const zona = { y: top + 8, h: s.h - top - 52 };
      const R = Math.min(zona.h / 2 - 4, 118);
      const cx = Math.round(s.w / 2), cy = zona.y + zona.h / 2;
      const dir = DIREZIONI[st.g];
      const rad = (dir * Math.PI) / 180;

      // le due direzioni di misura
      for (const [ang, col] of [[rad, COL.green], [rad + Math.PI / 2, COL.pink]]) {
        ctx.strokeStyle = col; ctx.globalAlpha = .4; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(cx - Math.cos(ang) * R, cy + Math.sin(ang) * R);
        ctx.lineTo(cx + Math.cos(ang) * R, cy - Math.sin(ang) * R);
        ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      }

      const K = R * 0.86;
      if (st.esito === null) {
        // lo stato intero, con le due ombre
        const pv = applica(proiettoreSu(dir), v);
        const qv = applica(proiettoreSu(dir + 90), v);
        arrow(ctx, cx, cy, cx + pv[0] * K, cy - pv[1] * K, { color: COL.green, width: 2.2 });
        arrow(ctx, cx, cy, cx + qv[0] * K, cy - qv[1] * K, { color: COL.pink, width: 2.2 });
        arrow(ctx, cx, cy, cx + v[0] * K, cy - v[1] * K, { color: COL.violet, width: 3 });
      } else {
        // dopo la misura resta solo una delle due: lo stato è collassato
        const d = st.esito === 0 ? rad : rad + Math.PI / 2;
        const col = st.esito === 0 ? COL.green : COL.pink;
        ctx.globalAlpha = .25;
        arrow(ctx, cx, cy, cx + v[0] * K, cy - v[1] * K, { color: COL.violet, width: 2 });
        ctx.globalAlpha = 1;
        arrow(ctx, cx, cy, cx + Math.cos(d) * K, cy - Math.sin(d) * K, { color: col, width: 3.4 });
      }

      text(ctx, t('probabilità: :a% sulla verde, :b% sulla rosa', { a: (p0 * 100).toFixed(0), b: (p1 * 100).toFixed(0) }),
        16, s.h - 34, { size: 12, color: COL.txt, max: s.w - 32 });
      text(ctx, st.letture.length
        ? t('letture: :l', { l: st.letture.map(x => x === 0 ? t('verde') : t('rosa')).join(' · ') })
        : t('nessuna lettura ancora'),
      16, s.h - 14, { size: 11.5, color: stabile ? COL.green : COL.dim, max: s.w - 32 });
      st.px = cx; st.py = cy;
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sg = choice({
    label: t('Direzione di misura'),
    items: DIREZIONI.map((d, i) => ({ label: d + '°', value: i })),
    value: 0,
    onchange: i => { st.g = i; st.esito = null; st.letture = []; upd(); },
  });
  w.body.appendChild(controls(sg.root));
  const ss = slider({ label: t('lo stato, a quanti gradi'), min: 0, max: 180, step: 5, value: st.stato, fmt: v => v + '°', oninput: v => { st.stato = v; st.esito = null; st.letture = []; upd(); } });
  w.body.appendChild(controls(ss.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '👁 ' + t('misura'), class: 'sm primary', onclick: () => misura() },
    { label: '↺ ' + t('rimetti lo stato com\'era'), onclick: () => { st.esito = null; st.letture = []; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function misura() {
    const v = [Math.cos((st.stato * Math.PI) / 180), Math.sin((st.stato * Math.PI) / 180)];
    const [p0] = probabilita(v, DIREZIONI[st.g]);
    /* La prima misura è casuale, pesata dalle ombre al quadrato. Le
       successive NO: lo stato è già collassato, e un proiettore applicato
       due volte non cambia più niente. È il punto del gioco. */
    if (st.esito === null) st.esito = Math.random() < p0 ? 0 : 1;
    st.letture.push(st.esito);
    sfx.click();
    upd();
  }

  function upd() {
    const v = [Math.cos((st.stato * Math.PI) / 180), Math.sin((st.stato * Math.PI) / 180)];
    const [p0, p1] = probabilita(v, DIREZIONI[st.g]);
    const P = proiettoreSu(DIREZIONI[st.g]);
    const stabile = st.letture.length >= 2 && st.letture.every(x => x === st.letture[0]);
    if (stabile && !st.fatte.has(st.g)) {
      st.fatte.add(st.g);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.fatte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    out.set(
      t('Lo stato è a <b>:s°</b>, la direzione di misura a <b>:d°</b>. Le due ombre al quadrato fanno <b>:a%</b> e <b>:b%</b> — e sommano a 100.',
        { s: st.stato, d: DIREZIONI[st.g], a: (p0 * 100).toFixed(1), b: (p1 * 100).toFixed(1) }) + '\n' +
      (st.esito === null
        ? t('Premi «misura»: il risultato esce a caso, con quelle probabilità.')
        : t('È uscito <b>:e</b>, e lo stato si è schiacciato su quella direzione. Adesso rimisura: la probabilità è diventata 100% da quella parte.',
          { e: st.esito === 0 ? t('verde') : t('rosa') })) +
      (stabile ? '\n<span class="g">✓ ' + t('Letto :q volte, sempre lo stesso. Non è fortuna: il proiettore applicato due volte dà lo stesso risultato della prima — P·P = P, e i numeri lo confermano: :n.',
        { q: st.letture.length, n: prodotto(P, P).map(due).join(' ') + ' contro ' + P.map(due).join(' ') }) + '</span>' : ''));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Perché rileggere non cambia la risposta.</b> Un proiettore ha una proprietà che si scrive in tre simboli — <b>P·P = P</b> — e vuol dire «applicarlo due volte è come applicarlo una volta». Nel mondo quantistico è la frase «una volta misurato, lo stato è quello»: il collasso non è un\'ipotesi in più, è la faccia fisica dell\'idempotenza. E le due probabilità che sommano a 100 sono l\'altra proprietà: i due proiettori messi insieme fanno l\'identità.'));
  return { state: st };
}
