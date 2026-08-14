/* ============================================================
   PARTE D — LA PENDENZA E GLI ALGORITMI VARIAZIONALI
   La derivata, e il quantistico che si usa davvero oggi.

   Perché questo livello esiste:

   · gli algoritmi del corso — Grover, Shor, la stima di fase — vogliono
     macchine grandi e pulite, che nel 2020 non esistono. Quello che gira
     OGGI sull'hardware vero è un'altra famiglia: i metodi variazionali
     (VQE, QAOA), in cui il computer quantistico misura e un computer
     normale gira le manopole per far scendere un numero;

   · «far scendere un numero girando una manopola» è la derivata: la
     pendenza dice da che parte scendere, e dove la pendenza è zero ci si
     ferma. È matematica del liceo, e qui si gioca senza formule;

   · e c'è un pezzo che è quantistico per davvero, non un prestito dal
     classico: la <b>regola dello spostamento</b> (parameter-shift). La
     pendenza non si stima con un incremento piccolo — si MISURA esatta,
     valutando lo stesso circuito con il parametro spostato di un quarto di
     giro. È una cosa che il classico non può fare, e si vede in un numero.

   Il rumore c'è ed è dichiarato: con pochi tiri la pendenza misurata balla,
   e la discesa balla con lei. È il motivo per cui i metodi variazionali
   sono difficili nella pratica, e nasconderlo sarebbe una bugia.
   ============================================================ */

import { Stage, COL, bg, grid, dot, text, roundRect, arrow, plot, FX } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud, nearSound } from './basicmath.js';

/* ------------------------------------------------------------
   LOGICA PURA
   ------------------------------------------------------------ */

/** La pendenza misurata come farebbe una persona: due punti vicini. */
export function pendenza(f, x, h = 1e-5) {
  return (f(x + h) - f(x - h)) / (2 * h);
}

/* Le curve del primo gioco. `d` è la pendenza esatta, scritta a mano per
   avere un termine di paragone indipendente da quella numerica. */
export const CURVE = [
  {
    id: 'valle', nome: () => t('la valle'),
    f: x => x * x - 1, d: x => 2 * x,
    minimi: [0], massimi: [],
  },
  {
    id: 'doppia', nome: () => t('la valle doppia'),
    f: x => 0.25 * x * x * x * x - x * x, d: x => x * x * x - 2 * x,
    minimi: [-Math.SQRT2, Math.SQRT2], massimi: [0],
  },
  {
    id: 'onda', nome: () => t("l'onda"),
    f: x => Math.sin(x * 1.2), d: x => 1.2 * Math.cos(x * 1.2),
    minimi: [-Math.PI / 2 / 1.2], massimi: [Math.PI / 2 / 1.2],
  },
];

/**
 * L'energia di un qubit con una manopola sola: E(θ) = a·cos θ + b·sin θ.
 *
 * È il valore medio di H = a·Z + b·X sullo stato che la manopola prepara.
 * Non è un esempio inventato: è il VQE più piccolo che esista, e ha la
 * proprietà comoda di avere un minimo che si sa calcolare a mano.
 */
export const energia = (a, b, theta) => a * Math.cos(theta) + b * Math.sin(theta);

/** La pendenza esatta di quella curva. */
export const pendenzaEsatta = (a, b, theta) => -a * Math.sin(theta) + b * Math.cos(theta);

/**
 * LA REGOLA DELLO SPOSTAMENTO (parameter-shift rule).
 *
 * La pendenza si ottiene valutando la STESSA energia con il parametro
 * spostato di un quarto di giro avanti e indietro, e dividendo per due. Non è
 * un'approssimazione con h piccolo: è esatta, e si calcola misurando — che è
 * l'unica cosa che un computer quantistico sappia fare.
 */
export const pendenzaSpostamento = (a, b, theta) =>
  (energia(a, b, theta + Math.PI / 2) - energia(a, b, theta - Math.PI / 2)) / 2;

/** Dove sta il fondo, e quanto vale. */
export function minimoDi(a, b) {
  return { theta: Math.atan2(b, a) + Math.PI, valore: -Math.hypot(a, b) };
}

/* I due «problemi» del secondo gioco: due Hamiltoniane, due minimi diversi. */
export const PROBLEMI = [
  { id: 'zx', a: 1, b: 0.5, nome: () => t('H = Z + 0,5·X') },
  { id: 'xz', a: -0.4, b: 1, nome: () => t('H = −0,4·Z + X') },
];

/* ------------------------------------------------------------
   1) LA PENDENZA
   Trascina il punto sulla curva: la retta si inclina, e dove la
   curva è piatta la pendenza è zero. Ma zero non vuol dire fondo.
   ------------------------------------------------------------ */
export function pendenzaLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('La pendenza'),
    subtitle: t('muovi il punto: la retta che lo tocca dice da che parte si scende'),
  });

  const st = { curva: 0, x: 1.4, trovati: new Set(), vinto: false, esito: '' };
  const near = nearSound();
  const XMIN = -2.6, XMAX = 2.6, YMIN = -1.6, YMAX = 1.6;

  const stage = new Stage(w.body, {
    height: 320,
    onPointer(e) {
      if (e.type !== 'down' && !(e.type === 'move' && e.down)) return;
      const r = st.rect;
      if (!r) return;
      const u = Math.min(1, Math.max(0, (e.x - r.x) / r.w));
      st.x = XMIN + u * (XMAX - XMIN);
      upd();
    },
    draw(ctx, s) {
      bg(ctx, s);
      const c = CURVE[st.curva];
      const p = c.d(st.x);
      const piatto = Math.abs(p) < 0.05;
      const top = hud(ctx, s, {
        goal: t('pendenza a zero, in fondo'),
        closeness: 1 - Math.min(1, Math.abs(p) / 2),
        hit: piatto,
        sub: t(':curva — valli trovate: :fatte su :totali', { curva: c.nome(), fatte: st.trovati.size, totali: cfg.need }),
      });

      const rect = { x: 26, y: top + 16, w: s.w - 52, h: s.h - top - 52 };
      st.rect = rect;
      grid(ctx, rect.x, rect.y, rect.w, rect.h, rect.w / 8, rect.h / 6);
      const X = x => rect.x + ((x - XMIN) / (XMAX - XMIN)) * rect.w;
      const Y = y => rect.y + rect.h - ((y - YMIN) / (YMAX - YMIN)) * rect.h;
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(rect.x, Y(0)); ctx.lineTo(rect.x + rect.w, Y(0)); ctx.stroke();

      /* La curva si ritaglia dentro il riquadro: le braccia della parabola
         escono dall'alto, e senza ritaglio finivano a scrivere sopra il
         cruscotto. */
      ctx.save();
      ctx.beginPath(); ctx.rect(rect.x, rect.y, rect.w, rect.h); ctx.clip();
      plot(ctx, rect, u => c.f(XMIN + u * (XMAX - XMIN)), { color: COL.cyan, yMin: YMIN, yMax: YMAX, width: 2.4 });

      // la retta che tocca la curva nel punto: è la pendenza, disegnata
      const y0 = c.f(st.x);
      ctx.restore();
      const dx = 0.9;
      ctx.strokeStyle = piatto ? COL.green : COL.amber;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(X(st.x - dx), Y(y0 - p * dx));
      ctx.lineTo(X(st.x + dx), Y(y0 + p * dx));
      ctx.stroke();
      dot(ctx, X(st.x), Y(y0), 6, piatto ? COL.green : COL.cyan);
      st.px = X(st.x); st.py = Y(y0);

      // la freccia che dice da che parte si scende
      if (!piatto) {
        const verso = p > 0 ? -1 : 1;
        arrow(ctx, X(st.x), Y(y0) + 20, X(st.x + verso * 0.55), Y(y0) + 20,
          { color: COL.violet, width: 2, head: 7 });
        text(ctx, t('si scende di qua'), X(st.x + verso * 0.55), Y(y0) + 34,
          { size: 10.5, align: 'center', color: COL.violet, max: 130, saltaSeTronca: true });
      }

      text(ctx, t('pendenza: :p', { p: p.toFixed(2) }), 26, s.h - 12,
        { size: 13, color: piatto ? COL.green : COL.amber, max: s.w - 52 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sc = choice({
    label: t('La curva'),
    items: CURVE.map((c, i) => ({ label: c.nome(), value: i })),
    value: 0,
    onchange: i => { st.curva = i; st.esito = ''; upd(); },
  });
  const sx = slider({
    label: t('Dove sei sulla curva'), min: XMIN, max: XMAX, step: 0.01, value: st.x,
    fmt: v => v.toFixed(2), oninput: v => { st.x = v; upd(); },
  });
  w.body.appendChild(controls(sc.root, sx.root));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    sx.value = st.x;
    const c = CURVE[st.curva];
    const p = c.d(st.x);
    const piatto = Math.abs(p) < 0.05;
    const inMinimo = piatto && c.minimi.some(m => Math.abs(st.x - m) < 0.2);
    const inMassimo = piatto && c.massimi.some(m => Math.abs(st.x - m) < 0.2);
    const chiave = c.id + ':' + (inMinimo ? Math.round(st.x) : '');
    if (inMinimo && !st.trovati.has(chiave)) {
      st.trovati.add(chiave);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.trovati.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else if (!piatto) {
      near(1 - Math.min(1, Math.abs(p) / 2));
    }
    out.set(
      t('Curva: <b>:curva</b>. Sei in x = <b>:x</b>, l\'altezza è <b>:y</b>.', { curva: c.nome(), x: st.x.toFixed(2), y: c.f(st.x).toFixed(2) }) + '\n' +
      t('Pendenza della retta che tocca la curva: <b>:p</b>. Misurata a mano con due punti vicini: <b>:num</b>.',
        { p: p.toFixed(3), num: pendenza(c.f, st.x).toFixed(3) }) + '\n' +
      (inMinimo
        ? '<span class="g">✓ ' + t('Pendenza zero e curva che risale da tutte e due le parti: sei <b>in fondo a una valle</b>. È quello che cerca un algoritmo variazionale.') + '</span>'
        : inMassimo
          ? '<span class="a">' + t('Pendenza zero, ma sei <b>in cima</b>: da qui si scende da entrambe le parti. Pendenza nulla non vuol dire minimo — è la trappola numero uno di questi metodi.') + '</span>'
          : t('Il segno dice il verso: pendenza positiva → si scende andando a sinistra; negativa → a destra.')));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Il nome:</b> questa pendenza si chiama <b>derivata</b>. Serve a una cosa sola, ma fondamentale: se vuoi far scendere un numero, la derivata ti dice da che parte muoverti e quando fermarti. È il motore di tutto l\'apprendimento automatico — e, come vedrai fra un attimo, anche del quantistico che gira oggi sulle macchine vere.'));
  return { state: st };
}

/* ------------------------------------------------------------
   2) LA DISCESA VARIAZIONALE (VQE)
   Una manopola, un'energia da abbassare, e la pendenza misurata
   con la regola dello spostamento. Con il rumore dei tiri, perché
   è così che va davvero.
   ------------------------------------------------------------ */
export function vqeLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('La discesa variazionale'),
    subtitle: t('il computer quantistico misura, quello normale gira la manopola'),
    modo: 'quantistico',
  });

  const st = { prob: 0, theta: 0.7, tiri: 200, passi: 0, risolti: new Set(), vinto: false, misura: null };
  const near = nearSound();

  const stage = new Stage(w.body, {
    height: 330,
    draw(ctx, s) {
      bg(ctx, s);
      const pr = PROBLEMI[st.prob];
      const E = energia(pr.a, pr.b, st.theta);
      const min = minimoDi(pr.a, pr.b);
      const centrato = E - min.valore < 0.02;
      const top = hud(ctx, s, {
        goal: t('abbassa l\'energia'),
        closeness: 1 - Math.min(1, (E - min.valore) / (2 * Math.hypot(pr.a, pr.b))),
        hit: centrato,
        sub: t(':problema — minimi raggiunti: :fatti su :totali', { problema: pr.nome(), fatti: st.risolti.size, totali: cfg.need }),
      });

      const rect = { x: 30, y: top + 16, w: s.w - 56, h: s.h - top - 54 };
      const LIM = Math.hypot(pr.a, pr.b) * 1.2;
      grid(ctx, rect.x, rect.y, rect.w, rect.h, rect.w / 8, rect.h / 4);
      const X = th => rect.x + (th / (2 * Math.PI)) * rect.w;
      const Y = e => rect.y + rect.h - ((e + LIM) / (2 * LIM)) * rect.h;

      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(rect.x, Y(0)); ctx.lineTo(rect.x + rect.w, Y(0)); ctx.stroke();
      plot(ctx, rect, u => energia(pr.a, pr.b, u * 2 * Math.PI), { color: COL.cyan, yMin: -LIM, yMax: LIM, width: 2.4 });

      // il fondo vero, che il computer quantistico non conosce ma noi sì
      const thMin = ((min.theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      ctx.strokeStyle = 'rgba(52,211,153,.45)'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(rect.x, Y(min.valore)); ctx.lineTo(rect.x + rect.w, Y(min.valore)); ctx.stroke();
      ctx.setLineDash([]);
      text(ctx, t('il fondo: :e', { e: min.valore.toFixed(2) }), rect.x + 4, Y(min.valore) - 10,
        { size: 10.5, color: COL.green, max: rect.w / 2 });
      dot(ctx, X(thMin), Y(min.valore), 4, 'rgba(52,211,153,.6)', false);

      // dove sei, e la pendenza misurata
      const th = ((st.theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const p = pendenzaEsatta(pr.a, pr.b, st.theta);
      const thA = Math.max(0, th - 0.55), thB = Math.min(2 * Math.PI, th + 0.55);
      ctx.strokeStyle = centrato ? COL.green : COL.amber; ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(X(thA), Y(E + p * (thA - th)));
      ctx.lineTo(X(thB), Y(E + p * (thB - th)));
      ctx.stroke();
      dot(ctx, X(th), Y(E), 6, centrato ? COL.green : COL.violet);
      st.px = X(th); st.py = Y(E);

      text(ctx, t('energia: :e', { e: E.toFixed(3) }), 30, s.h - 30,
        { size: 13, color: centrato ? COL.green : COL.violet, max: s.w - 60 });
      text(ctx, st.misura === null
        ? t('chiedila alla macchina: «misura la pendenza»')
        : t('pendenza misurata con :tiri tiri: :p (esatta: :vera)', { tiri: st.tiri, p: st.misura.toFixed(3), vera: p.toFixed(3) }),
      30, s.h - 12, { size: 11, color: '#8fa0c4', max: s.w - 60 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sp = choice({
    label: t('Il problema da risolvere'),
    items: PROBLEMI.map((p, i) => ({ label: p.nome(), value: i })),
    value: 0,
    onchange: i => { st.prob = i; st.misura = null; st.passi = 0; upd(); },
  });
  const sth = slider({
    label: t('La manopola del circuito (θ)'), min: 0, max: 6.28, step: 0.01, value: st.theta,
    fmt: v => (v * 180 / Math.PI).toFixed(0) + '°', oninput: v => { st.theta = v; st.misura = null; upd(); },
  });
  const sti = choice({
    label: t('Quanti tiri per ogni misura'),
    items: [50, 200, 5000].map(v => ({ label: String(v), value: v })),
    value: st.tiri,
    onchange: v => { st.tiri = v; st.misura = null; upd(); },
  });
  w.body.appendChild(controls(sp.root, sth.root, sti.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '📐 ' + t('misura la pendenza'), class: 'sm primary', onclick: misuraPendenza },
    { label: '⬇ ' + t('scendi di un passo'), onclick: () => passo(1) },
    { label: '⏬ ' + t('scendi finché puoi'), onclick: () => passo(12) },
    { label: '🎲 ' + t('riparti da un punto a caso'), onclick: () => { st.theta = Math.random() * 6.28; st.misura = null; st.passi = 0; sth.value = st.theta; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  /* Il rumore della misura: con N tiri l'errore su un valore medio scende
     come 1/√N. Non è una decorazione — è il costo vero di ogni algoritmo
     variazionale, ed è il motivo per cui la discesa a volte va storta. */
  const rumore = () => {
    const u = Math.max(1e-9, Math.random()), v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) / Math.sqrt(st.tiri);
  };

  function misuraPendenza() {
    const pr = PROBLEMI[st.prob];
    st.misura = pendenzaSpostamento(pr.a, pr.b, st.theta) + rumore();
    sfx.measure();
    upd();
  }

  function passo(quanti) {
    const pr = PROBLEMI[st.prob];
    for (let i = 0; i < quanti; i++) {
      const g = pendenzaSpostamento(pr.a, pr.b, st.theta) + rumore();
      st.theta -= 0.45 * g;
      st.passi++;
    }
    st.theta = ((st.theta % 6.28) + 6.28) % 6.28;
    st.misura = pendenzaSpostamento(pr.a, pr.b, st.theta) + rumore();
    sth.value = st.theta;
    sfx.gate();
    upd();
  }

  function upd() {
    const pr = PROBLEMI[st.prob];
    const E = energia(pr.a, pr.b, st.theta);
    const min = minimoDi(pr.a, pr.b);
    const centrato = E - min.valore < 0.02;
    if (centrato && !st.risolti.has(pr.id)) {
      st.risolti.add(pr.id);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.risolti.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else if (!centrato) {
      near(1 - Math.min(1, (E - min.valore) / (2 * Math.hypot(pr.a, pr.b))));
    }
    out.set(
      t('Manopola a <b>:g°</b> → energia <b>:e</b>. Il fondo vale <b>:min</b>. Passi di discesa fatti: <b>:passi</b>.',
        { g: (st.theta * 180 / Math.PI).toFixed(0), e: E.toFixed(3), min: min.valore.toFixed(3), passi: st.passi }) + '\n' +
      t('La pendenza si misura <b>senza derivate approssimate</b>: si valuta la stessa energia con la manopola spostata di un quarto di giro avanti e indietro, e si divide per due. Qui: <b>:spost</b>, che è esattamente la pendenza vera.',
        { spost: pendenzaSpostamento(pr.a, pr.b, st.theta).toFixed(3) }) + '\n' +
      (centrato
        ? '<span class="g">✓ ' + t('Sei in fondo. Questo numero è la risposta che il VQE cerca: la minima energia raggiungibile con quel circuito.') + '</span>'
        : t('Scendi: la pendenza dice da che parte. Con pochi tiri la misura balla, e i passi ballano con lei.')));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Questo è il quantistico che gira oggi.</b> Nessuna macchina al mondo esegue ancora Shor su numeri veri, ma i metodi variazionali girano da anni su processori rumorosi: il quantistico prepara lo stato e misura, il classico gira le manopole. Il rumore lo hai visto: con pochi tiri la pendenza balla. E la parte che il classico non sa fare è proprio quella misura — lo stesso mestiere della stima di fase del livello :n, ma con un obiettivo diverso: non leggere un numero nascosto, bensì <b>abbassarne</b> uno.', { n: nOf('19-qpe') }));
  return { state: st };
}
