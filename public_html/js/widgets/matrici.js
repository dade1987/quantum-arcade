/* ============================================================
   PARTE 0 — LA MACCHINA CHE TRASFORMA LE FRECCE
   Matrici 2×2, viste come quello che sono davvero: una macchina
   che prende una freccia e ne restituisce un'altra.

   Perché sta nel corso, e perché nella Parte 0:

   · da qui in avanti «porta quantistica» vuol dire matrice. Nel corso le
     porte arrivano come rotazioni — scelta giusta per cominciare — ma
     dalla QFT in poi (e in tutta la letteratura vera) sono matrici, e chi
     non le ha mai viste si ferma lì;

   · una matrice 2×2 è una tabella di quattro numeri: si può giocare senza
     sapere niente di algebra lineare, esattamente come si gioca con seno e
     coseno senza sapere niente di trigonometria;

   · e l'idea centrale si VEDE in tre secondi: le due colonne della matrice
     sono i due posti dove finiscono le due frecce di base. Tutto il resto
     — il prodotto, la composizione, l'unitarietà — discende da lì.

   Le ampiezze restano REALI (positive e negative), come nella Parte A: qui
   non servono i numeri complessi, e infilarli adesso costerebbe un livello
   di fatica per zero comprensione in più.
   ============================================================ */

import { Stage, COL, bg, grid, dot, text, roundRect, arrow, circle, makePlane, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud, nearSound } from './basicmath.js';

/* ------------------------------------------------------------
   LOGICA PURA — la matematica del livello, isolata dal disegno
   perché è quella che i test possono controllare.
   ------------------------------------------------------------ */

/** Una matrice 2×2 è quattro numeri: [[a, b], [c, d]]. */
export const M = (a, b, c, d) => [[a, b], [c, d]];

/** La macchina in funzione: matrice per freccia. */
export function applica(m, v) {
  return [m[0][0] * v[0] + m[0][1] * v[1], m[1][0] * v[0] + m[1][1] * v[1]];
}

/** Due macchine di fila: prima B, poi A. L'ordine conta, ed è questo. */
export function componi(A, B) {
  return M(
    A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1],
    A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1],
  );
}

/** La lunghezza di una freccia (Pitagora). */
export const lunghezza = v => Math.hypot(v[0], v[1]);

/**
 * Una macchina è «unitaria» se non cambia MAI la lunghezza di nessuna freccia.
 * Con numeri reali basta controllare le due colonne: lunghe 1 e perpendicolari.
 * È la proprietà che nel quantistico tiene le probabilità a 100%.
 */
export function unitaria(m, tol = 1e-6) {
  const c1 = [m[0][0], m[1][0]], c2 = [m[0][1], m[1][1]];
  const prodotto = c1[0] * c2[0] + c1[1] * c2[1];
  return Math.abs(lunghezza(c1) - 1) < tol && Math.abs(lunghezza(c2) - 1) < tol && Math.abs(prodotto) < tol;
}

const R2 = Math.SQRT1_2;   // 1/√2 ≈ 0,707: il numero del corso

/** Le tre porte del corso, scritte come matrici. */
export const PORTE = {
  X: M(0, 1, 1, 0),
  Z: M(1, 0, 0, -1),
  H: M(R2, R2, R2, -R2),
};

/* ------------------------------------------------------------
   1) LA MACCHINA A QUATTRO MANOPOLE
   Due frecce di base, quattro manopole, e la scoperta che le
   colonne della matrice SONO le destinazioni delle due frecce.
   ------------------------------------------------------------ */

/* Le sfide: ogni sfida dice solo dove devono finire le due frecce di base.
   Non si chiede «scrivi la matrice»: si chiede un risultato, e la matrice
   viene fuori da sola — che è il verso giusto in cui si impara. */
export const SFIDE = [
  { id: 'scambia', nome: () => t('scambia le due frecce'), e1: [0, 1], e2: [1, 0] },
  { id: 'gira', nome: () => t('gira tutto di 90° in senso antiorario'), e1: [0, 1], e2: [-1, 0] },
  { id: 'specchia', nome: () => t('lascia ferma la rossa e ribalta la verde'), e1: [1, 0], e2: [0, -1] },
  { id: 'raddoppia', nome: () => t('raddoppia la lunghezza di tutte e due'), e1: [2, 0], e2: [0, 2] },
];

export function matrixLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('La macchina a quattro manopole'),
    subtitle: t('gira le manopole e guarda dove finiscono le due frecce'),
  });

  const st = { m: M(1, 0, 0, 1), sfida: 0, risolte: new Set(), vinto: false };
  const near = nearSound();
  const e1 = [1, 0], e2 = [0, 1];

  /* Quanto sei vicino: la somma delle due distanze, normalizzata. Serve alla
     barra del cruscotto e al suono, che salgono insieme mentre ti avvicini. */
  const errore = () => {
    const s = SFIDE[st.sfida];
    const a = applica(st.m, e1), b = applica(st.m, e2);
    return Math.hypot(a[0] - s.e1[0], a[1] - s.e1[1]) + Math.hypot(b[0] - s.e2[0], b[1] - s.e2[1]);
  };

  const stage = new Stage(w.body, {
    height: 340,
    draw(ctx, s) {
      bg(ctx, s);
      const sf = SFIDE[st.sfida];
      const err = errore();
      const centrato = err < 0.12;
      const top = hud(ctx, s, {
        goal: sf.nome(),
        closeness: 1 - Math.min(1, err / 3),
        hit: centrato,
        sub: t('sfide risolte: :fatte su :totali', { fatte: st.risolte.size, totali: cfg.need }),
      });

      /* Il piano: si vede da −2,4 a +2,4 in verticale, che è quanto basta a
         contenere il bersaglio più lontano (la sfida «raddoppia»). La scala la
         detta l'altezza, che è sempre il lato stretto. */
      /* Il disegno comincia SOTTO la riga di servizio del cruscotto: la prima
         riga della griglia, partendo da `top`, passava esattamente sopra la
         scritta «sfide risolte» e la cancellava. */
      const inizio = top + 14;
      const alto = s.h - inizio - 30;
      const scala = Math.min((s.w - 40) / 5.6, alto / 4.8);
      const P = makePlane(s.w / 2, inizio + alto / 2, scala);
      grid(ctx, 0, inizio, s.w, alto + 30, scala, scala);
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, P.cy); ctx.lineTo(s.w, P.cy);
      ctx.moveTo(P.cx, inizio); ctx.lineTo(P.cx, s.h);
      ctx.stroke();
      // le tacche: senza, «lungo 1» e «lungo 2» sono indistinguibili
      for (const u of [-2, -1, 1, 2]) {
        ctx.beginPath();
        ctx.moveTo(P.X(u), P.cy - 4); ctx.lineTo(P.X(u), P.cy + 4);
        ctx.moveTo(P.cx - 4, P.Y(u)); ctx.lineTo(P.cx + 4, P.Y(u));
        ctx.stroke();
        text(ctx, String(u), P.X(u), P.cy + 14, { size: 10, align: 'center', color: '#59688c' });
        text(ctx, String(u), P.cx - 8, P.Y(u), { size: 10, align: 'right', color: '#59688c' });
      }

      const v1 = applica(st.m, e1), v2 = applica(st.m, e2);

      // il quadrato unitario deformato: la macchina non sposta due frecce,
      // sposta TUTTO il piano, e questo è il modo di farlo vedere
      ctx.beginPath();
      ctx.moveTo(P.X(0), P.Y(0));
      ctx.lineTo(P.X(v1[0]), P.Y(v1[1]));
      ctx.lineTo(P.X(v1[0] + v2[0]), P.Y(v1[1] + v2[1]));
      ctx.lineTo(P.X(v2[0]), P.Y(v2[1]));
      ctx.closePath();
      ctx.fillStyle = centrato ? 'rgba(52,211,153,.16)' : 'rgba(34,211,238,.10)';
      ctx.fill();

      // i bersagli, tratteggiati
      arrow(ctx, P.cx, P.cy, P.X(sf.e1[0]), P.Y(sf.e1[1]), { color: COL.red, width: 1.6, dash: [5, 4], alpha: 0.75 });
      arrow(ctx, P.cx, P.cy, P.X(sf.e2[0]), P.Y(sf.e2[1]), { color: COL.green, width: 1.6, dash: [5, 4], alpha: 0.75 });

      // le frecce vere
      arrow(ctx, P.cx, P.cy, P.X(v1[0]), P.Y(v1[1]), { color: COL.red, width: 3 });
      arrow(ctx, P.cx, P.cy, P.X(v2[0]), P.Y(v2[1]), { color: COL.green, width: 3 });
      dot(ctx, P.X(v1[0]), P.Y(v1[1]), 5, COL.red);
      dot(ctx, P.X(v2[0]), P.Y(v2[1]), 5, COL.green);
      st.px = P.X(v1[0]); st.py = P.Y(v1[1]);

      /* La legenda sta in fondo, non in alto: in alto ci scrive il cruscotto,
         e due righe di testo sovrapposte non le legge nessuno. */
      text(ctx, t('rossa: dove finisce (1, 0)'), 14, s.h - 26, { size: 11, color: COL.red, max: s.w - 28, mono: false });
      text(ctx, t('verde: dove finisce (0, 1)'), 14, s.h - 10, { size: 11, color: COL.green, max: s.w - 28, mono: false });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const manopola = (etichetta, riga, col) => slider({
    label: etichetta, min: -2, max: 2, step: 0.1, value: st.m[riga][col],
    fmt: v => v.toFixed(1),
    oninput: v => { st.m[riga][col] = v; upd(); },
  });
  const sa = manopola('a', 0, 0), sb = manopola('b', 0, 1);
  const sc = manopola('c', 1, 0), sd = manopola('d', 1, 1);
  w.body.appendChild(controls(sa.root, sb.root, sc.root, sd.root));

  const scrivi = m => {
    st.m = m.map(r => r.slice());
    sa.value = m[0][0]; sb.value = m[0][1]; sc.value = m[1][0]; sd.value = m[1][1];
    upd();
  };
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: t('identità'), onclick: () => scrivi(M(1, 0, 0, 1)) },
    { label: '↔ ' + t('scambia (X)'), onclick: () => scrivi(PORTE.X) },
    { label: '⇅ ' + t('ribalta (Z)'), onclick: () => scrivi(PORTE.Z) },
    { label: '🎯 ' + t('altra sfida'), class: 'sm primary', onclick: () => { st.sfida = (st.sfida + 1) % SFIDE.length; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const sf = SFIDE[st.sfida];
    const err = errore();
    const centrato = err < 0.12;
    if (centrato && !st.risolte.has(sf.id)) {
      st.risolte.add(sf.id);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.risolte.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else if (!centrato) {
      near(1 - Math.min(1, err / 3));
    }
    const v1 = applica(st.m, [1, 0]), v2 = applica(st.m, [0, 1]);
    out.set(
      t('La macchina, scritta come tabella:') + '\n' +
      `[ ${st.m[0][0].toFixed(1)}  ${st.m[0][1].toFixed(1)} ]\n[ ${st.m[1][0].toFixed(1)}  ${st.m[1][1].toFixed(1)} ]\n` +
      t('La freccia rossa (1, 0) finisce in (<b>:x</b>, <b>:y</b>) — che è la <b>prima colonna</b>.', { x: v1[0].toFixed(1), y: v1[1].toFixed(1) }) + '\n' +
      t('La freccia verde (0, 1) finisce in (<b>:x</b>, <b>:y</b>) — che è la <b>seconda colonna</b>.', { x: v2[0].toFixed(1), y: v2[1].toFixed(1) }) + '\n' +
      (unitaria(st.m, 0.05)
        ? '<span class="c">' + t('Questa macchina non cambia le lunghezze: nel quantistico sarebbe una porta valida.') + '</span>\n'
        : t('Questa macchina allunga o accorcia le frecce: nel quantistico non sarebbe una porta valida.') + '\n') +
      (centrato
        ? '<span class="g">✓ ' + t('sfida risolta! Premi «altra sfida» per la prossima.') + '</span>'
        : t('Obiettivo: :sfida. Le frecce tratteggiate dicono dove devono arrivare.', { sfida: sf.nome() })));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>La regola sta tutta qui:</b> le due colonne della matrice sono i due posti dove finiscono le frecce di base. Sapendo quelli, sai dove finisce <b>qualunque</b> altra freccia — perché ogni freccia è una somma delle due di base. Non c\'è altro da sapere su cosa fa una matrice.'));
  return { state: st };
}

/* ------------------------------------------------------------
   2) IL PUZZLE DELLE PORTE
   Le stesse matrici, applicate a un qubit. Tre bottoni, un
   bersaglio, e una freccia che non esce mai dal cerchio: è
   l'unitarietà, vista invece che enunciata.
   ------------------------------------------------------------ */

export const PUZZLE = [
  { id: 'uno', mira: [0, 1], nome: () => t('porta lo stato da |0⟩ a |1⟩') },
  { id: 'meta', mira: [R2, R2], nome: () => t('arriva alla sovrapposizione (0,71 · 0,71)') },
  { id: 'meno', mira: [R2, -R2], nome: () => t('arriva alla sovrapposizione con il meno (0,71 · −0,71)') },
];

export function gatePuzzle(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('Il puzzle delle porte'),
    subtitle: t('tre matrici, un bersaglio: quale sequenza ci arriva?'),
    modo: 'quantistico',
  });

  const st = { v: [1, 0], mosse: [], puzzle: 0, risolti: new Set(), vinto: false };

  const stage = new Stage(w.body, {
    height: 330,
    draw(ctx, s) {
      bg(ctx, s);
      const pz = PUZZLE[st.puzzle];
      const dist = Math.hypot(st.v[0] - pz.mira[0], st.v[1] - pz.mira[1]);
      const centrato = dist < 0.02;
      const top = hud(ctx, s, {
        goal: pz.nome(),
        closeness: 1 - Math.min(1, dist / 2),
        hit: centrato,
        sub: t('puzzle risolti: :fatti su :totali', { fatti: st.risolti.size, totali: cfg.need }),
      });

      /* Due colonne: a sinistra il cerchio, a destra i numeri. La larghezza
         della colonna dei numeri si decide PRIMA, e il cerchio prende quello
         che resta: al contrario, su un telefono le scritte finivano sopra il
         disegno. */
      const alto = s.h - top - 12;
      const colonna = Math.min(170, s.w * 0.42);
      const sinistra = s.w - colonna - 24;
      const scala = Math.min(sinistra / 2.9, alto / 2.6);
      const P = makePlane(12 + sinistra / 2, top + alto / 2, scala);

      /* Il cerchio: la freccia dello stato ci sta sopra SEMPRE, qualunque
         bottone si prema. È l'unitarietà, e si vede senza spiegarla. */
      circle(ctx, P.cx, P.cy, scala, { stroke: '#2a3a5c', dash: [4, 5] });
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(P.X(-1.35), P.cy); ctx.lineTo(P.X(1.35), P.cy);
      ctx.moveTo(P.cx, P.Y(-1.35)); ctx.lineTo(P.cx, P.Y(1.35));
      ctx.stroke();
      text(ctx, '|0⟩', P.X(1.2), P.cy + 16, { size: 11, color: '#6b7b9e' });
      text(ctx, '|1⟩', P.cx + 8, P.Y(1.2), { size: 11, color: '#6b7b9e' });

      arrow(ctx, P.cx, P.cy, P.X(pz.mira[0]), P.Y(pz.mira[1]), { color: COL.amber, width: 1.8, dash: [5, 4], alpha: 0.8 });
      arrow(ctx, P.cx, P.cy, P.X(st.v[0]), P.Y(st.v[1]), { color: centrato ? COL.green : COL.violet, width: 3 });
      dot(ctx, P.X(st.v[0]), P.Y(st.v[1]), 6, centrato ? COL.green : COL.violet);
      st.px = P.X(st.v[0]); st.py = P.Y(st.v[1]);

      // a destra: le due ampiezze e le due probabilità, in barre
      const bx = s.w - colonna - 6, bw = colonna;
      const maxCol = s.w - bx - 8;   // oltre questa larghezza si scrive fuori dalla tela
      const righe = [
        { et: t('ampiezza di |0⟩'), v: st.v[0], col: COL.cyan },
        { et: t('ampiezza di |1⟩'), v: st.v[1], col: COL.pink },
      ];
      righe.forEach((r, i) => {
        const y = top + 22 + i * 54;
        text(ctx, r.et, bx, y, { size: 11, color: '#8fa0c4', max: maxCol, mono: false });
        const mezzo = bx + bw / 2;
        roundRect(ctx, bx, y + 10, bw, 12, 6, { fill: '#131f38', stroke: '#22304d' });
        const l = Math.abs(r.v) * (bw / 2);
        roundRect(ctx, r.v >= 0 ? mezzo : mezzo - l, y + 10, Math.max(2, l), 12, 6, { fill: r.col, alpha: 0.9 });
        text(ctx, r.v.toFixed(3), bx, y + 34, { size: 12, color: r.col, max: maxCol });
      });
      const p0 = st.v[0] * st.v[0], p1 = st.v[1] * st.v[1];
      text(ctx, t('probabilità: :zero% e :uno%', { zero: Math.round(p0 * 100), uno: Math.round(p1 * 100) }),
        bx, top + 140, { size: 11.5, color: COL.amber, max: maxCol });
      text(ctx, t('somma: :tot% — sempre', { tot: Math.round((p0 + p1) * 100) }),
        bx, top + 158, { size: 11.5, color: COL.green, max: maxCol });
      text(ctx, t('mosse: :mosse', { mosse: st.mosse.join(' → ') || '—' }),
        bx, top + 182, { size: 11, color: '#8fa0c4', max: maxCol });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: 'X', class: 'sm primary', onclick: () => porta('X') },
    { label: 'Z', class: 'sm primary', onclick: () => porta('Z') },
    { label: 'H', class: 'sm primary', onclick: () => porta('H') },
    { label: '↺ ' + t('riparti da |0⟩'), onclick: azzera },
    { label: '🎯 ' + t('altro puzzle'), onclick: () => { st.puzzle = (st.puzzle + 1) % PUZZLE.length; azzera(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function porta(nome) {
    st.v = applica(PORTE[nome], st.v);
    st.mosse.push(nome);
    sfx.gate();
    upd();
  }
  function azzera() { st.v = [1, 0]; st.mosse = []; upd(); }

  function upd() {
    const pz = PUZZLE[st.puzzle];
    const dist = Math.hypot(st.v[0] - pz.mira[0], st.v[1] - pz.mira[1]);
    const centrato = dist < 0.02;
    if (centrato && !st.risolti.has(pz.id)) {
      st.risolti.add(pz.id);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.risolti.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    /* «Hai rifatto la X con altre porte»: non si controlla la sequenza scritta
       a mano, si moltiplicano davvero le matrici usate e si guarda se il
       risultato È la X. Così vale per qualunque strada equivalente, anche una
       che non avevo previsto io. */
    const composta = st.mosse.reduce((acc, nome) => componi(PORTE[nome], acc), M(1, 0, 0, 1));
    const uguali = (A, B) => A.every((r, i) => r.every((x, j) => Math.abs(x - B[i][j]) < 1e-9));
    const scoperta = centrato && st.mosse.length > 1 && uguali(composta, PORTE.X)
      ? '\n<span class="a">' + t('E hai appena dimostrato che <b>:mosse fanno la stessa cosa della X</b>: più macchine di fila sono una macchina sola.', { mosse: st.mosse.join('·') }) + '</span>'
      : '';
    out.set(
      t('Stato: (<b>:zero</b> · <b>:uno</b>). Lunghezza della freccia: <b>:lung</b>.', {
        zero: st.v[0].toFixed(3), uno: st.v[1].toFixed(3), lung: lunghezza(st.v).toFixed(3),
      }) + '\n' +
      (centrato
        ? '<span class="g">✓ ' + t('bersaglio centrato in :n mosse: :mosse', { n: st.mosse.length, mosse: st.mosse.join(' → ') }) + '</span>' + scoperta
        : t('Obiettivo: :puzzle. Prova una porta e guarda dove va la freccia — la lunghezza non cambia mai.', { puzzle: pz.nome() })));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Perché la freccia resta sul cerchio:</b> X, Z e H sono matrici <b>unitarie</b>, cioè macchine che non allungano e non accorciano niente. Siccome la probabilità è il quadrato dell\'ampiezza, una freccia sempre lunga 1 vuol dire probabilità che fanno sempre 100%. È la ragione per cui non esiste una porta quantistica che «perde» un pezzo di stato — e la ritroverai al livello :n.', { n: nOf('03-porte') }));
  return { state: st };
}
