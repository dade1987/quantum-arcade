/* ============================================================
   PARTE D — LE FRECCE CHE LA MACCHINA NON GIRA
   Autovettori e autovalori, appena prima di servire.

   Perché sta qui, e non altrove:

   · la stima di fase (il livello successivo) è, parola per parola, «dato uno
     stato che l'operazione lascia uguale a parte una fase, misura quella
     fase». Senza autovettori quella frase è rumore, e il livello si riduce a
     guardare un circuito che fa una magia;

   · è l'ultimo attrezzo che mancava: matrici (0·6), fasi (livello delle
     frecce), Fourier (Parte C). Qui si incastrano;

   · e si vede in due secondi: trascini una freccia, la macchina la gira, e a
     un certo punto — solo per certe direzioni — la freccia trasformata è
     PARALLELA a quella di partenza. Quelle direzioni sono gli autovettori,
     e quanto si è allungata è l'autovalore.

   Il secondo gioco fa il passo che porta dritto alla QPE: su un autovettore,
   una porta quantistica cambia solo la FASE. Contando quante applicazioni
   servono per tornare al punto di partenza si misura quella fase — che è
   esattamente ciò che la stima di fase fa in un colpo solo, in
   sovrapposizione. Ed è lo stesso identico gioco del ritmo che torna del
   livello 0·5: il periodo era là, la fase è qui.
   ============================================================ */

import { Stage, COL, bg, grid, dot, text, roundRect, arrow, circle, makePlane, FX, phaseColor } from '../core/canvas.js';
import { widget, controls, buttons, readout, choice, h, TAU } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { nOf } from '../core/levels.js';
import { hud, nearSound } from './basicmath.js';
import { M, applica } from './matrici.js';

/* ------------------------------------------------------------
   LOGICA PURA
   ------------------------------------------------------------ */

/**
 * Gli autovalori REALI di una matrice 2×2, con le direzioni che li realizzano.
 *
 * λ risolve λ² − T·λ + D = 0, con T = traccia e D = determinante. Se il
 * discriminante è negativo non esiste nessuna freccia reale che la macchina
 * lasci in linea con sé stessa: è il caso della rotazione, ed è il motivo per
 * cui il quantistico ha bisogno dei numeri complessi.
 */
export function autovaloriDi(m) {
  const [[a, b], [c, d]] = m;
  const T = a + d, D = a * d - b * c;
  const delta = T * T - 4 * D;
  if (delta < -1e-12) return [];
  const rad = Math.sqrt(Math.max(0, delta));
  const lambde = delta < 1e-12 ? [T / 2] : [(T + rad) / 2, (T - rad) / 2];
  return lambde.map(l => {
    let v;
    if (Math.abs(b) > 1e-9) v = [b, l - a];
    else if (Math.abs(c) > 1e-9) v = [l - d, c];
    else v = Math.abs(a - l) < 1e-9 ? [1, 0] : [0, 1];
    const n = Math.hypot(v[0], v[1]) || 1;
    return { lambda: l, dir: [v[0] / n, v[1] / n] };
  });
}

/** Quanto due frecce sono fuori allineamento: 0 = perfettamente in linea. */
export function scarto(u, v) {
  const lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1]);
  if (lu < 1e-9 || lv < 1e-9) return 1;
  return Math.abs(u[0] * v[1] - u[1] * v[0]) / (lu * lv);   // |seno| dell'angolo fra le due
}

/** Di quanto si è allungata la freccia lungo sé stessa: l'autovalore. */
export const fattore = (v, w) => (v[0] * w[0] + v[1] * w[1]) / (v[0] * v[0] + v[1] * v[1]);

/**
 * Il magnete: quando l'angolo passa vicino a una direzione ferma, ci si
 * appoggia esattamente.
 *
 * Senza, «in linea» sarebbe una fessura larga un grado in cui si finisce per
 * caso, e la missione diventerebbe una lotteria invece di una scoperta. Con
 * il magnete la freccia fa un piccolo scatto e si incastra: lo scatto è il
 * momento in cui si capisce.
 */
export function magnete(ang, m, presa = 0.06) {
  let migliore = ang, minimo = presa;
  for (const { dir } of autovaloriDi(m)) {
    const base = Math.atan2(dir[1], dir[0]);
    for (const a of [base, base + Math.PI]) {
      const d = Math.abs(Math.atan2(Math.sin(ang - a), Math.cos(ang - a)));
      if (d < minimo) { minimo = d; migliore = a; }
    }
  }
  return migliore;
}

/* Le macchine da esaminare. L'ultima è quella che NON ha autovettori reali:
   serve a far vedere il limite, che è il ponte verso le fasi complesse. */
export const MACCHINE = [
  { id: 'stira', breve: () => t('stira'), nome: () => t('stira in orizzontale, schiaccia in verticale'), m: M(2, 0, 0, 0.5) },
  { id: 'specchio', breve: () => t('specchio Z'), nome: () => t('lo specchio: Z'), m: M(1, 0, 0, -1) },
  { id: 'hadamard', breve: () => t('porta H'), nome: () => t('la porta H'), m: M(Math.SQRT1_2, Math.SQRT1_2, Math.SQRT1_2, -Math.SQRT1_2) },
  { id: 'taglio', breve: () => t('scivolo'), nome: () => t('lo scivolo: una sola direzione ferma'), m: M(1, 1, 0, 1) },
  { id: 'rotazione', breve: () => t('rotazione 90°'), nome: () => t('la rotazione di 90°: nessuna freccia resta in linea'), m: M(0, -1, 1, 0) },
];

/* ------------------------------------------------------------
   1) LA CACCIA: trascina la freccia finché non resta in linea
   ------------------------------------------------------------ */
export function eigenHunt(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t('La caccia alle frecce che non girano'),
    subtitle: t('trascina la freccia: per quasi tutte la macchina cambia direzione. Per qualcuna no.'),
  });

  /* `ang` è l'angolo LIBERO, quello che il dito o i bottoni hanno chiesto;
     `angolo()` è quello mostrato, cioè il libero con il magnete applicato.
     Tenerli separati è indispensabile: se il magnete riscrivesse `ang`, dopo
     il primo aggancio ogni passo successivo ricadrebbe dentro la sua presa e
     la freccia resterebbe incollata lì per sempre. */
  const st = { mac: 0, ang: 0.6, trovati: new Set(), vinto: false, px: 0, py: 0 };
  const near = nearSound();
  const angolo = () => magnete(st.ang, MACCHINE[st.mac].m);
  const dir = () => [Math.cos(angolo()), Math.sin(angolo())];

  const stage = new Stage(w.body, {
    height: 340,
    onPointer(e) {
      if (e.type !== 'down' && !(e.type === 'move' && e.down)) return;
      const P = st.P;
      if (!P) return;
      const p = P.inv(e.x, e.y);
      if (Math.hypot(p.x, p.y) < 0.08) return;
      st.ang = Math.atan2(p.y, p.x);
      upd();
    },
    draw(ctx, s) {
      bg(ctx, s);
      const mac = MACCHINE[st.mac];
      const v = dir(), w2 = applica(mac.m, v);
      const err = scarto(v, w2);
      const inLinea = err < 0.02 && Math.hypot(w2[0], w2[1]) > 1e-6;
      const top = hud(ctx, s, {
        goal: t('trova una direzione ferma'),
        closeness: 1 - Math.min(1, err / 0.6),
        hit: inLinea,
        sub: t(':macchina — trovate :fatte su :totali', { macchina: mac.nome(), fatte: st.trovati.size, totali: cfg.need }),
      });

      const inizio = top + 14;
      const alto = s.h - inizio - 30;
      const scala = Math.min((s.w - 40) / 5.2, alto / 4.4);
      const P = makePlane(s.w / 2, inizio + alto / 2, scala);
      st.P = P;
      grid(ctx, 0, inizio, s.w, alto + 30, scala, scala);
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, P.cy); ctx.lineTo(s.w, P.cy);
      ctx.moveTo(P.cx, inizio); ctx.lineTo(P.cx, s.h);
      ctx.stroke();
      circle(ctx, P.cx, P.cy, scala, { stroke: '#22304d', dash: [4, 5] });

      /* La retta su cui vive la freccia di partenza: se la trasformata ci cade
         sopra, «in linea» smette di essere una parola e diventa una cosa che
         si vede. */
      ctx.strokeStyle = inLinea ? 'rgba(52,211,153,.5)' : 'rgba(148,163,184,.18)';
      ctx.lineWidth = inLinea ? 2 : 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(P.X(-v[0] * 3), P.Y(-v[1] * 3));
      ctx.lineTo(P.X(v[0] * 3), P.Y(v[1] * 3));
      ctx.stroke();
      ctx.setLineDash([]);

      arrow(ctx, P.cx, P.cy, P.X(v[0]), P.Y(v[1]), { color: COL.cyan, width: 3 });
      arrow(ctx, P.cx, P.cy, P.X(w2[0]), P.Y(w2[1]), { color: inLinea ? COL.green : COL.amber, width: 3 });
      dot(ctx, P.X(v[0]), P.Y(v[1]), 6, COL.cyan);
      st.px = P.X(w2[0]); st.py = P.Y(w2[1]);

      text(ctx, t('la tua freccia'), 14, s.h - 26, { size: 11, color: COL.cyan, max: s.w - 28, mono: false });
      text(ctx, t('quella che esce dalla macchina'), 14, s.h - 10, { size: 11, color: inLinea ? COL.green : COL.amber, max: s.w - 28, mono: false });
      if (inLinea) {
        text(ctx, t('IN LINEA! ×:lambda', { lambda: fattore(v, w2).toFixed(2) }),
          s.w - 14, inizio + 12, { size: 13, align: 'right', color: COL.green, max: s.w / 2 });
      }
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sc = choice({
    label: t('La macchina da esaminare'),
    items: MACCHINE.map((m, i) => ({ label: m.breve(), value: i })),
    value: 0,
    onchange: i => { st.mac = i; upd(); },
  });
  w.body.appendChild(controls(sc.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '↻ ' + t('ruota di poco'), onclick: () => { st.ang += 0.05; upd(); } },
    { label: '↺ ' + t('ruota indietro'), onclick: () => { st.ang -= 0.05; upd(); } },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    const mac = MACCHINE[st.mac];
    const v = dir(), w2 = applica(mac.m, v);
    const err = scarto(v, w2);
    const inLinea = err < 0.02 && Math.hypot(w2[0], w2[1]) > 1e-6;
    const chiave = mac.id + ':' + (Math.round(Math.atan2(v[1], v[0]) * 180 / Math.PI + 360) % 180);
    if (inLinea && !st.trovati.has(chiave)) {
      st.trovati.add(chiave);
      sfx.ok();
      fx.burst(st.px, st.py);
      if (st.trovati.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else if (!inLinea) {
      near(1 - Math.min(1, err / 0.6));
    }
    const auto = autovaloriDi(mac.m);
    out.set(
      t('Macchina: <b>:nome</b>. La tua freccia punta a :gradi°.', { nome: mac.nome(), gradi: Math.round((angolo() * 180 / Math.PI + 360) % 360) }) + '\n' +
      (inLinea
        ? '<span class="g">✓ ' + t('In linea! La macchina non ha girato questa freccia: l\'ha solo moltiplicata per <b>:lambda</b>. È un <b>autovettore</b>, e :lambda è il suo <b>autovalore</b>.', { lambda: fattore(v, w2).toFixed(2) }) + '</span>'
        : t('Fuori linea: la freccia in uscita punta da un\'altra parte. Continua a girare.')) + '\n' +
      (auto.length === 0
        ? '<span class="a">' + t('Questa macchina non ha nessuna direzione ferma: gira tutto. Con i soli numeri reali, qui non c\'è niente da trovare.') + '</span>'
        : t('Questa macchina ha :quante direzioni ferme.', { quante: auto.length })));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>I nomi:</b> una freccia che la macchina lascia in linea con sé stessa si chiama <b>autovettore</b>; il numero per cui viene moltiplicata si chiama <b>autovalore</b>. Sono le due parole che aprono il livello :n — e la rotazione, che di autovettori reali non ne ha nessuno, spiega da sola perché nel quantistico gli autovalori sono <b>fasi</b> e non allungamenti.', { n: nOf('19-qpe') }));
  return { state: st };
}

/* ------------------------------------------------------------
   2) LA FASE CHE SI CONTA
   Su un autovettore la porta cambia solo la fase. Contare quante
   applicazioni servono per tornare a casa È misurare la fase.
   ------------------------------------------------------------ */

export const FASI = [
  { gradi: 90, ordine: 4 },
  { gradi: 120, ordine: 3 },
  { gradi: 72, ordine: 5 },
  { gradi: 45, ordine: 8 },
];

/** Quante applicazioni servono perché una rotazione di `gradi` torni a casa. */
export function ordineDi(gradi) {
  let k = 1;
  while (k <= 3600 && Math.abs(((k * gradi) % 360 + 360) % 360) > 1e-9) k++;
  return k;
}

export function phaseHunt(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('La fase che si conta'),
    subtitle: t('la porta non muove lo stato: gli gira solo la freccia della fase'),
    modo: 'quantistico',
  });

  const st = { fase: 0, passi: 0, scelta: 0, risolti: new Set(), vinto: false, esito: '' };
  const gradi = () => FASI[st.scelta].gradi;

  const stage = new Stage(w.body, {
    height: 320,
    draw(ctx, s) {
      bg(ctx, s);
      const tornato = st.passi > 0 && Math.abs(((st.fase % 360) + 360) % 360) < 1e-9;
      const top = hud(ctx, s, {
        goal: t('riporta la freccia a casa'),
        closeness: Math.min(1, st.passi / ordineDi(gradi())),
        hit: tornato,
        sub: t('fasi misurate: :fatte su :totali', { fatte: st.risolti.size, totali: cfg.need }),
      });

      const inizio = top + 14;
      const alto = s.h - inizio - 24;
      const colonna = Math.min(180, s.w * 0.42);
      const sinistra = s.w - colonna - 24;
      const scala = Math.min(sinistra / 2.7, alto / 2.5);
      const P = makePlane(12 + sinistra / 2, inizio + alto / 2, scala);

      circle(ctx, P.cx, P.cy, scala, { stroke: '#2a3a5c', dash: [4, 5] });
      ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(P.X(-1.25), P.cy); ctx.lineTo(P.X(1.25), P.cy);
      ctx.moveTo(P.cx, P.Y(-1.25)); ctx.lineTo(P.cx, P.Y(1.25));
      ctx.stroke();

      // la scia: dove è passata la freccia a ogni applicazione
      for (let i = 0; i <= st.passi; i++) {
        const a = (i * gradi()) * Math.PI / 180;
        dot(ctx, P.X(Math.cos(a)), P.Y(Math.sin(a)), 4, phaseColor(a), false);
      }
      // la casa, cioè il punto di partenza
      dot(ctx, P.X(1), P.Y(0), 5, '#64748b', false);
      text(ctx, t('casa'), P.X(1) + 6, P.Y(0) + 16, { size: 10, color: '#7f8fb3' });

      const a = st.fase * Math.PI / 180;
      arrow(ctx, P.cx, P.cy, P.X(Math.cos(a)), P.Y(Math.sin(a)),
        { color: tornato ? COL.green : COL.violet, width: 3 });

      const bx = s.w - colonna - 6, maxCol = s.w - bx - 8;
      text(ctx, t('applicazioni: :n', { n: st.passi }), bx, inizio + 8, { size: 13, color: COL.txtBright, max: maxCol });
      text(ctx, t('fase totale: :g°', { g: Math.round(((st.fase % 360) + 360) % 360) }), bx, inizio + 30, { size: 12, color: COL.amber, max: maxCol });
      text(ctx, t('probabilità: 100%'), bx, inizio + 52, { size: 11, color: COL.green, max: maxCol });
      text(ctx, t('lo stato non cambia:'), bx, inizio + 78, { size: 11, color: '#8fa0c4', max: maxCol, mono: false });
      text(ctx, t('cambia solo la fase'), bx, inizio + 94, { size: 11, color: '#8fa0c4', max: maxCol, mono: false });
      fx.draw(ctx);
      st.px = P.X(Math.cos(a)); st.py = P.Y(Math.sin(a));
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sc = choice({
    label: t('La porta U (di quanto gira la fase)'),
    items: FASI.map((f, i) => ({ label: f.gradi + '°', value: i })),
    value: 0,
    onchange: i => { st.scelta = i; azzera(); },
  });
  w.body.appendChild(controls(sc.root));
  const risposte = h('div', { class: 'btn-row', style: { marginTop: '8px' } });
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '⚛️ ' + t('applica U'), class: 'sm primary', onclick: passo },
    { label: '↺ ' + t('azzera'), onclick: azzera },
  ])));
  w.body.appendChild(risposte);
  const out = readout('');
  w.body.appendChild(out.root);

  function passo() {
    st.fase += gradi();
    st.passi++;
    sfx.gate();
    upd();
  }
  function azzera() { st.fase = 0; st.passi = 0; st.esito = ''; upd(); }

  function upd() {
    const g = gradi();
    const ordine = ordineDi(g);
    const tornato = st.passi > 0 && ((st.fase % 360) + 360) % 360 < 1e-9;
    risposte.innerHTML = '';
    if (tornato && !st.risolti.has(String(g))) {
      /* Tornato a casa: adesso la domanda vera. Contare i passi è già misurare
         la fase — dirlo ad alta voce è quello che lo fissa. */
      for (const o of [...new Set([ordine, ordine + 1, Math.max(2, ordine - 1), 6])].sort((x, y) => x - y)) {
        risposte.appendChild(h('button', { class: 'btn sm', onclick: () => rispondi(o) },
          t('un giro = :n applicazioni', { n: o })));
      }
    }
    out.set(
      t('Ogni applicazione di U gira la fase di <b>:g°</b>. Applicazioni fatte: <b>:n</b>, fase totale <b>:tot°</b>.',
        { g, n: st.passi, tot: Math.round(((st.fase % 360) + 360) % 360) }) + '\n' +
      (tornato
        ? t('Sei tornato a casa dopo <b>:n</b> applicazioni. Quindi ogni applicazione valeva <b>1/:n di giro</b>: hai misurato la fase contando.', { n: st.passi })
        : t('La probabilità di leggere il risultato non è cambiata di un capello: la fase da sola non si vede. Si vede solo <b>facendola interferire</b> — ed è quello che fa la QFT.')) +
      (st.esito ? '\n' + st.esito : ''));
    stage.redraw();
  }

  function rispondi(n) {
    const ordine = ordineDi(gradi());
    if (n === ordine) {
      st.risolti.add(String(gradi()));
      st.esito = '<span class="g">✓ ' + t('Esatto: :n applicazioni per un giro intero, cioè :g° l\'una. Prova un\'altra porta.', { n: ordine, g: gradi() }) + '</span>';
      sfx.ok(); fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.risolti.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else {
      st.esito = '<span class="a">✗ ' + t('No: conta le applicazioni che hai fatto per tornare a casa.') + '</span>';
      sfx.err();
    }
    upd();
  }

  upd();
  w.setFoot(t('<b>Questa è la stima di fase, fatta a mano.</b> Tu hai contato le applicazioni una per una: sono tante quante il denominatore della frazione di giro. Il livello :n fa la stessa identica cosa <b>in sovrapposizione</b> — applica U una volta, due, quattro, otto in parallelo, e poi con la trasformata di Fourier legge la fase da un picco solo. E se il conteggio ti ricorda il ritmo che tornava sull\'orologio del livello :m, hai visto giusto: è la stessa matematica.', { n: nOf('19-qpe'), m: nOf('00-orologio') }));
  return { state: st };
}
