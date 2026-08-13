/* ============================================================
   ESERCIZI APPAIATI — la stessa plancia, due macchine

   Quattro giochi con un interruttore che cambia mondo: prima si prova a
   fare la cosa con un computer normale, poi con uno quantistico. Stessi
   comandi, stesso disegno, stessa missione: cambia il meccanismo, e basta.

   PERCHÉ SONO FATTI COSÌ

   · Prima si prova, poi si spiega. Lasciare che uno tenti con gli attrezzi
     che ha — e sbatta contro il muro — rende la soluzione che arriva dopo
     molto più solida di quanto non faccia riceverla per prima (Kapur,
     «productive failure»). Qui il muro è letterale: in modo classico certe
     missioni NON si possono vincere, e il gioco lo dice invece di lasciare
     il giocatore a girare a vuoto.
   · Due casi ALLINEATI. Il confronto insegna quando i due termini si
     somigliano quasi del tutto e differiscono in un punto solo, perché è
     quel punto che il cervello isola (Gentner, «structure mapping»). Da qui
     la regola che ho seguito: stesso schermo, stessi bottoni, stessa
     missione — se una cosa cambia fra i due modi, è perché è LA cosa.
   · Il modo si vede sempre, in tre canali: colore (blu/viola), icona e
     parola scritta sull'intestazione del gioco. Mai il colore da solo.

   Ogni gioco vale una missione sola, che si completa solo dopo aver giocato
   TUTTI E DUE i modi: il confronto è il contenuto, non un extra.
   ============================================================ */

import { Stage, COL, bg, text, roundRect, circle, dot, arrow, FX } from '../core/canvas.js';
import { widget, buttons, readout, choice, slider, controls, h, fmt } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t, num } from '../core/i18n.js';
import { zeroState, applyGate, GATES, probs, measureRegister, label } from '../core/qsim.js';

const dentro = (r, x, y) => r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

/** L'interruttore fra i due mondi, uguale in tutti e quattro i giochi. */
function selettoreModo(w, st, onchange) {
  return choice({
    items: [
      { label: '💻 ' + t('con un computer normale'), value: 'classico' },
      { label: '⚛️ ' + t('con uno quantistico'), value: 'quantistico' },
    ],
    value: st.modo,
    onchange: v => { st.modo = v; w.setModo(v); sfx.click(); onchange(v); },
  });
}

/** Intestazione dentro il canvas: obiettivo + barra, con il colore del modo. */
function hudCoppia(ctx, s, { goal = '', sub = '', closeness = 0, hit = false, modo = 'classico' }) {
  const tinta = modo === 'quantistico' ? COL.violet : COL.blue;
  roundRect(ctx, 8, 6, s.w - 16, 34, 9, {
    fill: hit ? 'rgba(52,211,153,.16)' : (modo === 'quantistico' ? 'rgba(167,139,250,.08)' : 'rgba(96,165,250,.08)'),
    stroke: hit ? COL.green : tinta,
  });
  const bw = Math.min(150, s.w * 0.28);
  const bx = s.w - bw - 18;
  text(ctx, hit ? '✓ ' + t('FATTO!') : '🎯 ' + goal, 18, 23,
    { size: 13, color: hit ? COL.green : COL.amber, mono: false, weight: '800', max: bx - 30 });
  roundRect(ctx, bx, 15, bw, 10, 5, { stroke: '#22304d' });
  roundRect(ctx, bx, 15, Math.max(2, bw * Math.min(1, hit ? 1 : closeness)), 10, 5,
    { fill: hit ? COL.green : tinta, alpha: .85 });
  if (sub) text(ctx, sub, 18, 48, { size: 11, color: '#7f8fb3', max: s.w - 36 });
  return 46;
}

/* ============================================================
   1) IL REGISTRO — tre caselle, due macchine   (livello 1)
   ============================================================ */

export function registroCoppia(host, opts = {}) {
  const cfg = Object.assign({ n: 3, onWin: null }, opts);
  const n = cfg.n, N = 2 ** n;

  const w = widget(host, {
    modo: 'classico',
    title: t('Lo stesso registro, due macchine'),
    subtitle: t('tre caselle: prova a leggerle con l\'una e con l\'altra'),
  });

  const st = {
    modo: 'classico',
    bits: new Array(n).fill(0),      // il registro classico: una configurazione
    q: zeroState(n),                 // il registro quantistico: 2ⁿ ampiezze
    circuito: [],                    // le porte messe finora, per poterle rifare
    pienePreparate: 1,               // quante ampiezze accende il circuito
    ultima: null,                    // l'ultimo valore letto
    letture: [],                     // istogramma delle letture fatte
    fatto: { classico: false, quantistico: false },
    rects: [],
  };

  /* Rieseguire il circuito da capo prima di ogni misura NON è una scorciatoia
     per far tornare i conti: è esattamente quello che fa una macchina vera.
     Un computer quantistico non «rilegge» uno stato — la prima lettura lo
     distrugge — quindi prepara, misura, butta via e ricomincia, migliaia di
     volte. L'istogramma che si vede qui è la stessa cosa che si vede in
     laboratorio, e senza questo passaggio il gioco insegnerebbe che dopo il
     collasso si può continuare a leggere: cioè il contrario del vero. */
  function preparaCircuito() {
    st.q = zeroState(n);
    for (const g of st.circuito) applyGate(st.q, g.i, GATES[g.nome].m);
    st.pienePreparate = probs(st.q).filter(p => p > 1e-9).length;
  }

  const valore = () => st.bits.reduce((a, b) => a * 2 + b, 0);

  /* Le barre: in classico c'è UNA colonna piena (la configurazione presente),
     in quantistico ce ne sono fino a 2ⁿ (le ampiezze). È lo stesso disegno,
     ed è per questo che la differenza salta agli occhi senza spiegazioni. */
  function altezze() {
    if (st.modo === 'classico') return Array.from({ length: N }, (_, i) => i === valore() ? 1 : 0);
    return probs(st.q);
  }

  const stage = new Stage(w.body, {
    height: 300,
    draw(ctx, s) {
      bg(ctx, s);
      const classico = st.modo === 'classico';
      const piene = altezze().filter(p => p > 1e-9).length;
      const top = hudCoppia(ctx, s, {
        modo: st.modo,
        goal: classico
          ? t('leggi il registro 5 volte: esce sempre lo stesso?')
          : t('metti tutte e :n le caselle in sovrapposizione, poi leggi 20 volte', { n }),
        sub: classico
          ? t('un registro classico contiene UNA configurazione: le altre :quante non esistono da nessuna parte', { quante: N - 1 })
          : t('un registro quantistico porta :quante ampiezze insieme — ma la lettura ne restituisce una sola', { quante: N }),
        closeness: classico ? Math.min(1, st.letture.length / 5) : (st.pienePreparate / N + Math.min(1, st.letture.length / 20)) / 2,
        hit: st.fatto[st.modo],
      });

      // le caselle in alto
      const bw = Math.min(64, (s.w - 40) / n - 8), bh = 46;
      const x0 = (s.w - (n * bw + (n - 1) * 8)) / 2, y0 = top + 26;
      st.rects = Array.from({ length: n }, (_, i) => {
        const x = x0 + i * (bw + 8);
        const acceso = classico ? st.bits[i] === 1 : null;
        roundRect(ctx, x, y0, bw, bh, 8, {
          fill: acceso ? 'rgba(52,211,153,.2)' : (classico ? 'rgba(255,255,255,.03)' : 'rgba(167,139,250,.12)'),
          stroke: classico ? (acceso ? COL.green : '#32405f') : COL.violet,
          width: 1.6,
        });
        text(ctx, classico ? String(st.bits[i]) : '?', x + bw / 2, y0 + bh / 2,
          { size: 22, align: 'center', weight: '800', color: classico ? (acceso ? COL.green : '#5b6b90') : COL.violet });
        text(ctx, (classico ? t('bit') : t('qubit')) + ' ' + i, x + bw / 2, y0 - 10,
          { size: 10, align: 'center', color: '#7f8fb3', max: bw + 8 });
        return { x, y: y0, w: bw, h: bh, i };
      });

      // le 2ⁿ colonne
      const gy = y0 + bh + 30, gh = s.h - gy - (st.letture.length ? 74 : 46);
      const cw = (s.w - 44) / N;
      const alt = altezze();
      for (let i = 0; i < N; i++) {
        const x = 22 + i * cw, hcol = Math.max(1, alt[i] * gh);
        roundRect(ctx, x + 3, gy + gh - hcol, cw - 6, hcol, 3, {
          fill: classico ? COL.blue : COL.violet, alpha: alt[i] > 1e-9 ? .85 : .12,
        });
        text(ctx, label(i, n), x + cw / 2, gy + gh + 12,
          { size: cw > 42 ? 10.5 : 9, align: 'center', color: alt[i] > 1e-9 ? '#9dabc9' : '#3d4a68' });
      }
      ctx.strokeStyle = '#22304d'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(22, gy + gh); ctx.lineTo(s.w - 22, gy + gh); ctx.stroke();
      text(ctx, classico ? t('dove sta il registro adesso') : t('probabilità di ogni risultato'),
        22, gy - 8, { size: 10.5, color: '#7f8fb3' });

      // l'istogramma delle letture, se ce ne sono
      if (st.letture.length) {
        const conteggio = {};
        st.letture.forEach(v => { conteggio[v] = (conteggio[v] || 0) + 1; });
        const diversi = Object.keys(conteggio).length;
        text(ctx, t('letture: :n — valori diversi usciti: :diversi', { n: st.letture.length, diversi }),
          22, s.h - 12, { size: 11, color: diversi > 1 ? COL.violet : COL.blue });
        const massimo = Math.max(...Object.values(conteggio));
        for (let i = 0; i < N; i++) {
          const c = conteggio[label(i, n)] || 0;
          if (!c) continue;
          const x = 22 + i * cw, hb = 4 + 14 * (c / massimo);
          roundRect(ctx, x + 3, gy + gh + 20, cw - 6, hb, 2, { fill: COL.amber, alpha: .85 });
          if (cw > 34) text(ctx, String(c), x + cw / 2, gy + gh + 20 + hb + 8,
            { size: 9.5, align: 'center', color: COL.amber });
        }
      }
      fx.draw(ctx);
    },
    onPointer(e) {
      if (e.type !== 'down' || st.modo !== 'classico') return;
      const r = st.rects.find(x => dentro(x, e.x, e.y));
      if (!r) return;
      st.bits[r.i] ^= 1; sfx.click(); upd();
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const out = readout('');
  const azioniClassiche = h('div', { class: 'btn-row', style: { marginTop: '10px' } }, buttons([
    { label: '🔀 ' + t('rovescia un bit a caso'), onclick: () => { st.bits[Math.floor(Math.random() * n)] ^= 1; sfx.click(); upd(); } },
    { label: '👁️ ' + t('leggi il registro'), class: 'sm primary', onclick: leggi },
    { label: '↺ ' + t('azzera'), onclick: reset },
  ]));
  const azioniQuantistiche = h('div', { class: 'btn-row hidden', style: { marginTop: '10px' } },
    buttons(Array.from({ length: n }, (_, i) => ({ label: `H su ${i}`, onclick: () => porta('H', i) }))
      .concat(Array.from({ length: n }, (_, i) => ({ label: `X su ${i}`, onclick: () => porta('X', i) })))
      .concat([
        { label: '👁️ ' + t('misura'), class: 'sm primary', onclick: leggi },
        { label: '↺ ' + t('azzera'), onclick: reset },
      ])));

  function porta(nome, i) {
    st.circuito.push({ nome, i });
    preparaCircuito();
    st.ultima = null;
    sfx.gate(); upd();
  }

  function leggi() {
    if (st.modo === 'classico') {
      st.letture.push(label(valore(), n));
      sfx.measure(0);
    } else {
      // prepara → misura: una «passata» completa di macchina, come in laboratorio
      preparaCircuito();
      const v = measureRegister(st.q, Array.from({ length: n }, (_, i) => i));
      st.ultima = v;
      st.letture.push(label(v, n));
      sfx.measure(v & 1);
    }
    upd();
  }

  function reset() {
    st.bits = new Array(n).fill(0);
    st.circuito = []; st.ultima = null; st.letture = [];
    preparaCircuito();
    upd();
  }

  const sel = selettoreModo(w, st, () => { st.letture = []; aggiornaComandi(); upd(); });
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, sel.root));
  w.body.appendChild(azioniClassiche);
  w.body.appendChild(azioniQuantistiche);
  w.body.appendChild(out.root);

  function aggiornaComandi() {
    azioniClassiche.classList.toggle('hidden', st.modo !== 'classico');
    azioniQuantistiche.classList.toggle('hidden', st.modo !== 'quantistico');
  }

  function upd() {
    const classico = st.modo === 'classico';
    const alt = altezze();
    const piene = alt.filter(p => p > 1e-9).length;
    const diversi = new Set(st.letture).size;

    if (classico && st.letture.length >= 5 && diversi === 1) st.fatto.classico = true;
    if (!classico && st.pienePreparate === N && st.letture.length >= 20) st.fatto.quantistico = true;

    out.set(classico
      ? t('Il registro contiene <b>:valore</b> e nient\'altro. Le altre :quante configurazioni sono possibili, non presenti: nessuno le sta calcolando.',
        { valore: label(valore(), n), quante: N - 1 })
        + '\n' + t('Leggerlo non lo cambia: puoi leggerlo mille volte e trovare mille volte lo stesso numero. Letture fatte: <b>:n</b>, valori diversi usciti: <b>:diversi</b>.',
          { n: st.letture.length, diversi })
      : t('Il circuito che hai montato accende <b>:piene ampiezze</b> su :totale. Con una H per qubit diventano tutte e :totale, ognuna con probabilità :p%.',
        { piene: st.pienePreparate, totale: N, p: (100 / N).toFixed(1) })
        + '\n' + (st.ultima === null
          ? t('La misura ne restituirà <b>una sola</b>, a caso — e quella che esce è tutto quello che ti resta.')
          : t('L\'ultima misura ha fatto <b>collassare</b> lo stato su :valore: le altre ampiezze sono sparite. Premi ancora e il circuito riparte da capo, come su una macchina vera.',
            { valore: label(st.ultima, n) }))
        + '\n' + t('Letture fatte: <b>:n</b>, valori diversi usciti: <b>:diversi</b>.', { n: st.letture.length, diversi })
      + (st.fatto[st.modo] ? '\n<span class="g">✓ ' + t('fatto in questo modo.') + '</span>' : ''));

    stage.redraw();
    if (st.fatto.classico && st.fatto.quantistico && !st.vinto) {
      st.vinto = true; sfx.ok(); fx.burst(stage.w / 2, stage.h / 2); fx.flash();
      cfg.onWin && cfg.onWin();
    }
  }
  aggiornaComandi(); upd();

  w.setFoot(t('<b>Quello che hai appena visto:</b> le barre sono lo stesso disegno nei due modi, e sono l\'unica cosa che cambia. Una sola colonna piena contro :totale colonne insieme — ma la lettura, in tutti e due i casi, ti restituisce <b>una riga di :n cifre</b>. Il mestiere dell\'informatica quantistica è far sì che la riga che esce sia quella che serve.', { totale: N, n }));
  return { state: st };
}

/* ============================================================
   2) SALTI CONTRO ROTAZIONI — le porte   (livello 3)
   ============================================================ */

export function porteCoppia(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, {
    modo: 'classico',
    title: t('Salti contro rotazioni'),
    subtitle: t('la stessa lancetta, e cosa le si può fare'),
  });

  /* La lancetta è l'angolo θ dello stato: 0° = |0⟩, 180° = |1⟩, 90° = metà e
     metà. Un bit classico può stare solo ai due estremi — non c'è niente in
     mezzo da rappresentare — e una porta classica può solo saltare fra i due.
     Un qubit ci passa attraverso, e questo è tutto il livello in un disegno. */
  const st = {
    modo: 'classico', theta: 0, obiettivo: 90,
    mosse: [], fatto: { classico: false, quantistico: false }, tentativiClassici: 0,
  };

  const stage = new Stage(w.body, {
    height: 280,
    draw(ctx, s) {
      bg(ctx, s);
      const classico = st.modo === 'classico';
      const vicino = 1 - Math.min(1, Math.abs(st.theta - st.obiettivo) / 180);
      const centrato = Math.abs(st.theta - st.obiettivo) < 0.5;
      const top = hudCoppia(ctx, s, {
        modo: st.modo,
        goal: t('porta la lancetta a :gradi°', { gradi: st.obiettivo }),
        sub: classico
          ? t('con un bit hai una porta sola che muove: NOT, e salta da un estremo all\'altro')
          : t('con un qubit ogni porta è una rotazione: H fa un quarto di giro, X mezzo'),
        closeness: vicino, hit: centrato,
      });

      const cx = s.w / 2, cy = Math.min(s.h - 54, top + 30 + (s.h - top - 70) / 2);
      const R = Math.min(96, (s.h - top - 80) / 2, s.w / 3);

      /* Mezzo cerchio, non uno intero: la lancetta vive fra |0⟩ (in alto) e
         |1⟩ (in basso) passando per |+⟩ (a destra), e disegnare anche la metà
         che non si usa fa sembrare che ci sia dell'altro da raggiungere. */
      ctx.strokeStyle = '#22304d'; ctx.lineWidth = 1; ctx.setLineDash([4, 5]);
      ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, Math.PI / 2); ctx.stroke(); ctx.setLineDash([]);
      const punto = a => [cx + R * Math.sin(a * Math.PI / 180), cy - R * Math.cos(a * Math.PI / 180)];
      for (const [a, et] of [[0, '|0⟩'], [180, '|1⟩'], [90, '|+⟩']]) {
        const [x, y] = punto(a);
        const permesso = classico ? a !== 90 : true;
        dot(ctx, x, y, 5, permesso ? '#5b6b90' : '#2b3b5e', false);
        text(ctx, et, x + (a === 180 ? 0 : a === 0 ? 0 : 16), y + (a === 0 ? -16 : a === 180 ? 18 : 0),
          { size: 12, align: a === 90 ? 'left' : 'center', color: permesso ? '#9dabc9' : '#3d4a68' });
      }
      // il bersaglio
      const [bx, by] = punto(st.obiettivo);
      circle(ctx, bx, by, 12, { stroke: COL.amber, dash: [3, 3] });

      // la lancetta
      const [px, py] = punto(st.theta);
      arrow(ctx, cx, cy, px, py, { color: centrato ? COL.green : (classico ? COL.blue : COL.violet), width: 3, head: 11 });
      dot(ctx, cx, cy, 4, '#5b6b90', false);
      // θ va nella metà vuota, a sinistra: sotto sbatteva contro |1⟩ e contro
      // la riga delle probabilità
      text(ctx, `θ = ${st.theta.toFixed(0)}°`, cx - 18, cy, { size: 14, align: 'right', color: COL.amber });

      // le probabilità che ne discendono
      const p1 = Math.sin(st.theta * Math.PI / 360) ** 2;
      text(ctx, t('probabilità di leggere 0: :p0%  ·  di leggere 1: :p1%',
        { p0: ((1 - p1) * 100).toFixed(0), p1: (p1 * 100).toFixed(0) }),
        cx, s.h - 14, { size: 11.5, align: 'center', color: '#7f8fb3', max: s.w - 24 });

      if (classico && st.tentativiClassici >= 3 && !centrato) {
        text(ctx, t('nessuna porta classica arriva a metà: un bit è 0 oppure 1'),
          cx, top + 22, { size: 12, align: 'center', color: COL.red, mono: false, max: s.w - 40 });
      }
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const out = readout('');
  const rigaC = h('div', { class: 'btn-row', style: { marginTop: '10px' } }, buttons([
    { label: 'NOT', onclick: () => muovi(180, 'NOT') },
    { label: t('lascia stare (identità)'), onclick: () => muovi(0, 'ID') },
  ]));
  const rigaQ = h('div', { class: 'btn-row hidden', style: { marginTop: '10px' } }, buttons([
    { label: 'X', onclick: () => muovi(180, 'X') },
    { label: 'H', onclick: () => hadamard() },
    { label: 'Z', onclick: () => muovi(0, 'Z') },
    { label: '↻ +45°', onclick: () => muovi(45, 'R45') },
    { label: '↺ −45°', onclick: () => muovi(-45, 'R−45') },
  ]));
  const comuni = h('div', { class: 'btn-row', style: { marginTop: '6px' } }, buttons([
    { label: '↺ ' + t('riparti da |0⟩'), onclick: () => { st.theta = 0; st.mosse = []; upd(); } },
  ]));

  function muovi(delta, nome) {
    if (st.modo === 'classico') {
      st.tentativiClassici++;
      /* NOT è l'unica porta classica che muove, e muove di 180°: si finisce
         sempre su un estremo, mai in mezzo. Il gioco lo lascia scoprire
         provando, invece di dirlo e basta. */
      st.theta = nome === 'NOT' ? (st.theta === 0 ? 180 : 0) : st.theta;
    } else {
      st.theta = ((st.theta + delta) % 360 + 360) % 360;
      if (st.theta > 180) st.theta = 360 - st.theta;   // la lancetta vive su mezzo giro
    }
    st.mosse.push(nome); sfx.gate(); upd();
  }
  /* H porta |0⟩ in |+⟩ e |+⟩ in |0⟩: sulla lancetta è il quarto di giro che
     un bit non sa fare, ed è il motivo per cui H·H riporta al punto di
     partenza mentre due mescolate di una moneta no. */
  function hadamard() {
    st.theta = st.theta === 0 ? 90 : st.theta === 90 ? 0 : st.theta === 180 ? 90 : (st.theta + 90) % 180;
    st.mosse.push('H'); sfx.gate(); upd();
  }

  const sel = selettoreModo(w, st, () => {
    st.theta = 0; st.mosse = []; st.tentativiClassici = 0;
    rigaC.classList.toggle('hidden', st.modo !== 'classico');
    rigaQ.classList.toggle('hidden', st.modo !== 'quantistico');
    upd();
  });
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, sel.root));
  w.body.appendChild(rigaC); w.body.appendChild(rigaQ); w.body.appendChild(comuni);
  w.body.appendChild(out.root);

  function upd() {
    const classico = st.modo === 'classico';
    const centrato = Math.abs(st.theta - st.obiettivo) < 0.5;
    if (centrato && !classico) st.fatto.quantistico = true;
    if (classico && st.tentativiClassici >= 3) st.fatto.classico = true;   // il muro è la lezione

    out.set(classico
      ? t('Con un bit ci sono <b>due sole posizioni</b>: 0 e 1. L\'unica porta che muove è NOT, e ti sbatte da una all\'altra.')
        + '\n' + t('Il bersaglio a 90° <b>non è raggiungibile</b>, e non perché manchi la porta giusta: non esiste niente da mettere lì. Un bit «mezzo acceso» non è uno stato, è un guasto.')
      : t('Con un qubit la lancetta si muove con continuità: <b>H</b> è il quarto di giro che manda |0⟩ in |+⟩, X è mezzo giro, e le rotazioni fanno il resto.')
        + '\n' + t('A 90° le due probabilità sono 50% e 50%. Sembra una moneta — e invece <b>applica H un\'altra volta</b> e torni esattamente a |0⟩: una moneta mescolata due volte resta casuale, questa no.')
      + '\n' + t('Mosse: :elenco', { elenco: st.mosse.length ? st.mosse.join(' → ') : '—' })
      + (st.fatto[st.modo] ? '\n<span class="g">✓ ' + (classico
        ? t('hai toccato il muro: è quello il punto.')
        : t('centrato, e classicamente era impossibile.')) + '</span>' : ''));

    stage.redraw();
    if (st.fatto.classico && st.fatto.quantistico && !st.vinto) {
      st.vinto = true; sfx.ok(); fx.burst(stage.w / 2, stage.h / 2); fx.flash();
      cfg.onWin && cfg.onWin();
    }
  }
  upd();

  w.setFoot(t('<b>La differenza, detta bene:</b> una porta classica è una <b>tabella</b> (a ogni ingresso il suo uscita) e i valori possibili sono due. Una porta quantistica è una <b>rotazione</b>, e fra 0 e 1 c\'è tutto un giro di posizioni intermedie. Le rotazioni si compongono e si disfano — ed è per questo che H·Z·H fa esattamente X.'));
  return { state: st };
}

/* ============================================================
   3) LA SFIDA DELLE BUSTE — correlazioni   (livello 4)
   ============================================================ */

/**
 * Il gioco CHSH, ridotto all'osso e giocato davvero.
 *
 * Un arbitro manda una domanda (0 o 1) ad Alice e una a Bob, che sono lontani
 * e non possono parlarsi. Ognuno risponde 0 o 1. La coppia VINCE il turno se
 *      risposta_A XOR risposta_B  =  domanda_A AND domanda_B.
 *
 * · con qualunque accordo preso prima (le «buste») si vince al massimo il
 *   75% dei turni: è un conto che si fa a mano su quattro casi;
 * · con una coppia entangled misurata negli angoli giusti si arriva a
 *   cos²(π/8) ≈ 85,4%, ed è la disuguaglianza di Bell violata — Nobel 2022.
 *
 * Le percentuali non sono inventate: il turno quantistico si estrae con la
 * probabilità che dà la meccanica quantistica per quegli angoli.
 */
export const CHSH_QUANTISTICO = Math.cos(Math.PI / 8) ** 2;   // ≈ 0.8536

/** Le strategie classiche selezionabili: risposta = f(domanda). */
export const STRATEGIE = {
  sempre0: { a: () => 0, b: () => 0 },
  sempre1: { a: () => 1, b: () => 1 },
  copia: { a: x => x, b: y => y },
  opposte: { a: x => x, b: y => y ^ 1 },
};

/** Un turno classico con la strategia scelta. Ritorna true se la coppia vince. */
export function turnoClassico(strategia, x, y) {
  const s = STRATEGIE[strategia];
  return ((s.a(x) ^ s.b(y)) === (x & y));
}

export function bellCoppia(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, {
    modo: 'classico',
    title: t('La sfida delle due buste'),
    subtitle: t('Alice e Bob, lontani, senza potersi parlare'),
  });

  const st = {
    modo: 'classico', strategia: 'sempre0',
    turni: 0, vinti: 0, ultimo: null,
    record: { classico: 0, quantistico: 0 },
    fatto: { classico: false, quantistico: false },
  };

  function gioca(quanti = 1) {
    for (let i = 0; i < quanti; i++) {
      const x = Math.random() < .5 ? 1 : 0, y = Math.random() < .5 ? 1 : 0;
      let vinto;
      if (st.modo === 'classico') vinto = turnoClassico(st.strategia, x, y);
      else vinto = Math.random() < CHSH_QUANTISTICO;
      st.turni++; if (vinto) st.vinti++;
      st.ultimo = { x, y, vinto };
    }
    const perc = st.vinti / st.turni;
    st.record[st.modo] = Math.max(st.record[st.modo], perc);
    if (st.turni >= 200) {
      if (st.modo === 'classico') st.fatto.classico = true;
      else if (perc > 0.78) st.fatto.quantistico = true;
    }
    sfx.tick();
    upd();
  }

  const stage = new Stage(w.body, {
    height: 250,
    draw(ctx, s) {
      bg(ctx, s);
      const classico = st.modo === 'classico';
      const perc = st.turni ? st.vinti / st.turni : 0;
      const top = hudCoppia(ctx, s, {
        modo: st.modo,
        goal: classico ? t('gioca 200 turni: quanto riesci a vincere?') : t('gioca 200 turni e supera il 78%'),
        sub: classico
          ? t('l\'accordo si prende PRIMA di partire: dopo, Alice e Bob non comunicano più')
          : t('stessa sfida, ma Alice e Bob condividono una coppia entangled')
          ,
        closeness: Math.min(1, st.turni / 200), hit: st.fatto[st.modo],
      });

      // i due laboratori
      const y = top + 26, bw = Math.min(150, s.w / 2 - 60), bh = 76;
      const disegnaLab = (x, nome, domanda) => {
        roundRect(ctx, x, y, bw, bh, 10, {
          fill: classico ? 'rgba(96,165,250,.08)' : 'rgba(167,139,250,.10)',
          stroke: classico ? COL.blue : COL.violet,
        });
        text(ctx, nome, x + bw / 2, y + 18, { size: 13, align: 'center', color: '#9dabc9', weight: '800' });
        text(ctx, domanda === null ? '—' : t('domanda: :d', { d: domanda }), x + bw / 2, y + 42,
          { size: 12, align: 'center', color: COL.amber, max: bw - 12 });
      };
      disegnaLab(24, 'Alice', st.ultimo ? st.ultimo.x : null);
      disegnaLab(s.w - 24 - bw, 'Bob', st.ultimo ? st.ultimo.y : null);

      // il legame fra i due
      const cx1 = 24 + bw, cx2 = s.w - 24 - bw, my = y + bh / 2;
      ctx.strokeStyle = classico ? '#2b3b5e' : COL.violet;
      ctx.lineWidth = classico ? 1.4 : 2.2;
      ctx.setLineDash(classico ? [5, 5] : []);
      ctx.beginPath(); ctx.moveTo(cx1 + 6, my); ctx.lineTo(cx2 - 6, my); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, classico ? t('un accordo preso prima') : t('una coppia entangled'),
        (cx1 + cx2) / 2, my - 12, { size: 10.5, align: 'center', color: classico ? '#5b6b90' : COL.violet, max: cx2 - cx1 - 20 });

      // la percentuale, grande
      const yb = y + bh + 34;
      const perc100 = (perc * 100).toFixed(1);
      text(ctx, st.turni ? perc100 + '%' : '—', s.w / 2, yb + 8,
        { size: 30, align: 'center', weight: '800', color: perc > 0.78 ? COL.green : (classico ? COL.blue : COL.violet) });
      text(ctx, t('turni vinti su :n giocati', { n: st.turni }), s.w / 2, yb + 34,
        { size: 11, align: 'center', color: '#7f8fb3' });

      // le due soglie
      const bx = 40, bw2 = s.w - 80, by = s.h - 34;
      roundRect(ctx, bx, by, bw2, 8, 4, { stroke: '#22304d' });
      roundRect(ctx, bx, by, Math.max(2, bw2 * perc), 8, 4, { fill: perc > 0.78 ? COL.green : (classico ? COL.blue : COL.violet), alpha: .85 });
      for (const [v, et, col, sopra] of [
        [0.75, t('muro classico 75%'), COL.blue, true],
        [CHSH_QUANTISTICO, t('quantistico 85%'), COL.violet, false],
      ]) {
        const x = bx + bw2 * v;
        ctx.strokeStyle = col; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(x, by - 5); ctx.lineTo(x, by + 13); ctx.stroke();
        text(ctx, et, Math.min(x, s.w - 60), sopra ? by - 13 : by + 22,
          { size: 9.5, align: 'center', color: col, max: 130 });
      }
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const out = readout('');
  const scelta = choice({
    label: t('accordo di Alice e Bob (deciso prima di separarsi)'),
    items: [
      { label: t('rispondiamo sempre 0'), value: 'sempre0' },
      { label: t('rispondiamo sempre 1'), value: 'sempre1' },
      { label: t('rispondiamo la nostra domanda'), value: 'copia' },
      { label: t('io la domanda, lui il contrario'), value: 'opposte' },
    ],
    value: 'sempre0',
    onchange: v => { st.strategia = v; azzera(); },
  });
  function azzera() { st.turni = 0; st.vinti = 0; st.ultimo = null; upd(); }

  const sel = selettoreModo(w, st, () => {
    scelta.root.classList.toggle('hidden', st.modo !== 'classico');
    azzera();
  });
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, sel.root));
  w.body.appendChild(scelta.root);
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '▶ ' + t('un turno'), onclick: () => gioca(1) },
    { label: '⏩ ' + t('100 turni'), class: 'sm primary', onclick: () => gioca(100) },
    { label: '⏭️ ' + t('200 turni'), onclick: () => gioca(200) },
    { label: '↺ ' + t('azzera'), onclick: azzera },
  ])));
  w.body.appendChild(out.root);

  function upd() {
    const classico = st.modo === 'classico';
    out.set(
      t('<b>La regola del turno:</b> l\'arbitro manda una domanda (0 o 1) a ciascuno. La coppia vince se <code>rispostaA XOR rispostaB = domandaA AND domandaB</code>.')
      + '\n' + (classico
        ? t('Qualunque accordo preso prima è una tabella fissa: su quattro coppie di domande possibili, nessuna tabella ne indovina più di <b>tre</b>. Il muro è <b>75%</b>, e non lo si scavalca nemmeno tirando a sorte.')
        : t('Con una coppia entangled misurata negli angoli giusti la probabilità di vincere un turno è cos²(π/8) = <b>85,4%</b>. Non è una strategia più furba: è che le risposte <b>non esistevano</b> prima della misura.'))
      + '\n' + t('Record — con le buste: <b>:a%</b> · con l\'entanglement: <b>:b%</b>',
        { a: (st.record.classico * 100).toFixed(1), b: (st.record.quantistico * 100).toFixed(1) })
      + (st.fatto.classico && st.fatto.quantistico
        ? '\n<span class="g">✓ ' + t('hai misurato la differenza con le tue mani: è quella che ha vinto il Nobel nel 2022.') + '</span>' : ''));
    stage.redraw();
    if (st.fatto.classico && st.fatto.quantistico && !st.vinto) {
      st.vinto = true; sfx.ok(); fx.burst(stage.w / 2, stage.h / 2); fx.flash();
      cfg.onWin && cfg.onWin();
    }
  }
  upd();

  w.setFoot(t('<b>Perché questo conta più di «sono correlati»:</b> anche due buste sigillate sono correlate, e infatti arrivano al 75%. Il punto è il <b>sorpasso</b>: nessun accordo preso prima — nessuna informazione nascosta nelle particelle alla partenza — può superare quel muro. L\'esperimento è stato fatto davvero, sempre più a prova di scappatoia, e il muro è stato superato: Aspect, Clauser e Zeilinger, Nobel 2022.'));
  return { state: st };
}

/* ============================================================
   4) DUE STRADE — probabilità contro ampiezze   (livello 7)
   ============================================================ */

export function stradeCoppia(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, {
    modo: 'classico',
    title: t('Due strade per lo stesso posto'),
    subtitle: t('apri la seconda strada e guarda il rivelatore'),
  });

  const st = {
    modo: 'classico',
    a: 0.7, b: 0.7,            // in classico sono probabilità, in quantistico ampiezze
    aperta2: true,
    tentativiClassici: 0,
    fatto: { classico: false, quantistico: false },
  };

  /** Quanto arriva al rivelatore, con la regola del mondo in cui siamo. */
  const arrivo = () => {
    if (st.modo === 'classico') return Math.min(1, st.a + (st.aperta2 ? st.b : 0));
    const somma = st.a + (st.aperta2 ? st.b : 0);
    return Math.min(1, somma * somma);
  };

  const stage = new Stage(w.body, {
    height: 280,
    draw(ctx, s) {
      bg(ctx, s);
      const classico = st.modo === 'classico';
      const p = arrivo();
      const spento = p < 0.005 && st.aperta2;
      const top = hudCoppia(ctx, s, {
        modo: st.modo,
        goal: classico
          ? t('prova a SPEGNERE il rivelatore aprendo la seconda strada')
          : t('spegni il rivelatore tenendo aperte tutte e due le strade'),
        sub: classico
          ? t('in classico ogni strada porta una probabilità, e le probabilità si sommano')
          : t('in quantistico ogni strada porta un\'ampiezza, che può essere negativa'),
        closeness: classico ? Math.min(1, st.tentativiClassici / 4) : 1 - Math.min(1, p * 3),
        hit: st.fatto[st.modo],
      });

      const sx = 40, dx = s.w - 60, my = top + (s.h - top - 60) / 2;
      const alt = Math.min(58, (s.h - top - 90) / 2);

      // sorgente e rivelatore
      dot(ctx, sx, my, 8, COL.amber);
      text(ctx, t('sorgente'), sx, my + 24, { size: 10.5, align: 'center', color: '#7f8fb3' });
      roundRect(ctx, dx - 6, my - 26, 30, 52, 6, {
        fill: spento ? 'rgba(96,165,250,.06)' : `rgba(251,191,36,${0.15 + 0.6 * p})`,
        stroke: spento ? COL.blue : COL.amber, width: 2,
      });
      text(ctx, t('rivelatore'), dx + 9, my + 40, { size: 10.5, align: 'center', color: '#7f8fb3' });

      // le due strade
      const strada = (valore, su, attiva) => {
        const ym = my + (su ? -alt : alt);
        const col = !attiva ? '#22304d' : valore < 0 ? COL.pink : (classico ? COL.blue : COL.violet);
        ctx.strokeStyle = col; ctx.lineWidth = attiva ? 2 + Math.abs(valore) * 2.5 : 1.2;
        ctx.setLineDash(attiva ? [] : [4, 5]);
        ctx.beginPath();
        ctx.moveTo(sx + 10, my);
        ctx.bezierCurveTo(sx + 70, ym, dx - 70, ym, dx - 8, my);
        ctx.stroke(); ctx.setLineDash([]);
        const et = classico
          ? t('probabilità :v', { v: fmt(Math.abs(valore), 2) })
          : t('ampiezza :v', { v: (valore < 0 ? '−' : '+') + fmt(Math.abs(valore), 2) });
        text(ctx, attiva ? et : t('strada chiusa'), (sx + dx) / 2, ym + (su ? -14 : 16),
          { size: 11.5, align: 'center', color: attiva ? col : '#5b6b90', max: s.w - 120 });
      };
      strada(st.a, true, true);
      strada(st.b, false, st.aperta2);

      // il conto, scritto
      const somma = st.a + (st.aperta2 ? st.b : 0);
      text(ctx, classico
        ? t('arriva :a + :b = :tot', { a: fmt(st.a, 2), b: st.aperta2 ? fmt(st.b, 2) : '0', tot: fmt(Math.min(1, somma), 2) })
        : t('(:a :segno :b)² = :tot', {
          a: fmt(st.a, 2), segno: !st.aperta2 ? '+ 0' : (st.b < 0 ? '−' : '+'),
          b: st.aperta2 ? fmt(Math.abs(st.b), 2) : '', tot: fmt(arrivo(), 2),
        }),
        s.w / 2, s.h - 34, { size: 14, align: 'center', color: spento ? COL.green : COL.amber, max: s.w - 30 });
      text(ctx, t('al rivelatore arriva il :p%', { p: (p * 100).toFixed(0) }),
        s.w / 2, s.h - 13, { size: 12, align: 'center', color: '#9dabc9' });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const out = readout('');
  const sA = slider({
    label: t('strada di sopra'), min: 0, max: 1, step: 0.01, value: st.a,
    fmt: v => fmt(v, 2), oninput: v => { st.a = v; upd(); },
  });
  const sB = slider({
    label: t('strada di sotto'), min: -1, max: 1, step: 0.01, value: st.b,
    fmt: v => fmt(v, 2), oninput: v => { st.b = v; st.tentativiClassici++; upd(); },
  });
  const chiudi = h('div', { class: 'btn-row', style: { marginTop: '8px' } }, buttons([
    { label: '🚧 ' + t('apri/chiudi la seconda strada'), onclick: () => { st.aperta2 = !st.aperta2; st.tentativiClassici++; sfx.click(); upd(); } },
  ]));

  const sel = selettoreModo(w, st, () => {
    /* Passando al quantistico la seconda strada può diventare negativa: il
       cursore cambia significato, e il minimo con lui. In classico una
       probabilità negativa non esiste, e il gioco non deve nemmeno lasciarla
       provare. */
    sB.input.min = st.modo === 'classico' ? 0 : -1;
    if (st.modo === 'classico' && st.b < 0) { st.b = Math.abs(st.b); sB.value = st.b; }
    st.tentativiClassici = 0;
    upd();
  });
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, sel.root));
  w.body.appendChild(controls(sA.root, sB.root));
  w.body.appendChild(chiudi);
  w.body.appendChild(out.root);

  function upd() {
    const classico = st.modo === 'classico';
    const p = arrivo();
    if (classico && st.tentativiClassici >= 4) st.fatto.classico = true;
    if (!classico && st.aperta2 && p < 0.005) st.fatto.quantistico = true;

    out.set(classico
      ? t('Le probabilità sono numeri fra 0 e 1 e si <b>sommano</b>. Aprire una strada in più non può far arrivare <b>meno</b> roba: al massimo la seconda strada porta zero.')
        + '\n' + t('Prova quanto vuoi: con due strade aperte il rivelatore non si spegne mai. Non è un limite del gioco, è come funziona la probabilità.')
      : t('Le ampiezze si sommano <b>prima</b> di diventare probabilità, e possono essere <b>negative</b>. Metti la seconda strada a −:a e guarda cosa succede: (:a − :a)² = <b>0</b>.',
        { a: fmt(st.a, 2) })
        + '\n' + t('Due strade aperte, e non arriva niente. Chiudine una — <b>una qualsiasi</b> — e il rivelatore si riaccende. È l\'interferenza distruttiva, ed è il motore di ogni algoritmo di questo corso.')
      + (st.fatto[st.modo] ? '\n<span class="g">✓ ' + (classico
        ? t('confermato: in classico non si spegne.')
        : t('spento, con tutte e due le strade aperte.')) + '</span>' : ''));
    stage.redraw();
    if (st.fatto.classico && st.fatto.quantistico && !st.vinto) {
      st.vinto = true; sfx.cancel(); fx.burst(stage.w / 2, stage.h / 2); fx.flash();
      cfg.onWin && cfg.onWin();
    }
  }
  upd();

  w.setFoot(t('<b>Questa è la differenza, ed è una sola:</b> un computer classico che «prova tante strade» somma probabilità, e sommare roba positiva fa sempre crescere il totale. Un computer quantistico somma ampiezze, che hanno un segno — e le strade sbagliate possono cancellarsi a vicenda prima che tu guardi. Tutto il resto del corso è imparare a scegliere i segni.'));
  return { state: st };
}
