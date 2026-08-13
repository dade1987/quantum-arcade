/* ============================================================
   PARTE K — mini-giochi del COMPUTER CLASSICO (2 di 2)
   ricerca · costo degli algoritmi · reversibilità · oracoli
   classici · codice a ripetizione

   Questi cinque servono soprattutto DOPO: sono il metro con cui si
   misureranno Grover (livello 11), Deutsch–Jozsa (9), Bernstein–Vazirani
   (10), la correzione d'errore quantistica (21) e l'idea stessa di
   «vantaggio». Un numero da solo — «√N invece di N» — non dice niente a
   chi non ha mai contato i propri tentativi con le dita: la ricerca sul
   confronto fra casi (Gentner et al., 2003) dice che il confronto funziona
   quando i due termini sono ESPERIENZE, non due formule appaiate.
   ============================================================ */

import { Stage, COL, bg, text, roundRect, dot, arrow, FX } from '../core/canvas.js';
import { widget, buttons, readout, choice, slider, controls, h } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t, num } from '../core/i18n.js';
import { hudK, bitBox } from './classic.js';

const dentro = (r, x, y) => r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

/* ============================================================
   5) CERCARE — lista disordinata contro lista ordinata
   ============================================================ */

export function searchRace(host, opts = {}) {
  const cfg = Object.assign({ n: 16, onWin: null }, opts);
  const w = widget(host, {
    modo: 'classico',
    title: t('La caccia nello scaffale'),
    subtitle: t('apri le scatole finché non trovi il numero — e conta quante ne apri'),
  });

  const N = cfg.n;
  const st = {
    modo: 'disordinata', valori: [], aperte: new Set(), cercato: 0,
    trovato: false, mosse: 0, record: {}, vinte: new Set(), rects: [],
    lo: 0, hi: N - 1,       // la finestra ancora possibile, in modalità ordinata
  };

  function nuova() {
    const insieme = new Set();
    while (insieme.size < N) insieme.add(1 + Math.floor(Math.random() * 99));
    st.valori = [...insieme];
    if (st.modo === 'ordinata') st.valori.sort((a, b) => a - b);
    st.cercato = st.valori[Math.floor(Math.random() * N)];
    st.aperte = new Set(); st.trovato = false; st.mosse = 0;
    st.lo = 0; st.hi = N - 1;
    upd();
  }

  const ottimoBinario = Math.ceil(Math.log2(N + 1));

  const stage = new Stage(w.body, {
    height: 250,
    draw(ctx, s) {
      bg(ctx, s);
      const ordinata = st.modo === 'ordinata';
      const top = hudK(ctx, s, {
        goal: t('trova il numero :numero', { numero: st.cercato }),
        closeness: st.trovato ? 1 : Math.min(0.95, st.aperte.size / N),
        hit: st.trovato,
        sub: ordinata
          ? t('lo scaffale è ORDINATO: ogni scatola aperta ti dice anche da che parte continuare')
          : t('lo scaffale è in disordine: una scatola aperta dice solo sé stessa'),
      });

      /* In fondo ci sono due scritte: il conteggio delle scatole aperte e la
         riga che dice quante ne servirebbero. Affiancate hanno bisogno di uno
         schermo largo; su un telefono la seconda veniva troncata a metà, e
         allora va a capo — e la griglia le lascia la riga in più. */
      const piedeDoppio = s.w < 560;
      const piede = piedeDoppio ? 52 : 34;

      const perRiga = Math.min(N, Math.max(4, Math.floor((s.w - 24) / 62)));
      const righe = Math.ceil(N / perRiga);
      const bw = Math.min(58, (s.w - 24 - (perRiga - 1) * 6) / perRiga);
      const bh = Math.min(46, (s.h - top - piede - 10) / righe - 6);
      const x0 = (s.w - (perRiga * bw + (perRiga - 1) * 6)) / 2;
      /* Su schermo largo le sedici scatole stanno su una riga sola e lasciano
         mezzo widget vuoto: centrarle verticalmente evita che il gioco sembri
         finito a metà. */
      const altezzaGriglia = righe * bh + (righe - 1) * 6;
      const y0 = top + Math.max(10, (s.h - top - piede - altezzaGriglia) / 2);

      st.rects = st.valori.map((v, i) => {
        const rq = Math.floor(i / perRiga), cq = i % perRiga;
        const x = x0 + cq * (bw + 6), y = y0 + rq * (bh + 6);
        const aperta = st.aperte.has(i);
        const giusta = aperta && v === st.cercato;
        /* Fuori finestra = la ricerca binaria l'ha già esclusa. Mostrarlo
           spento è la cosa che fa "vedere" il dimezzamento, che altrimenti
           resta un discorso. */
        const esclusa = ordinata && (i < st.lo || i > st.hi);
        roundRect(ctx, x, y, bw, bh, 7, {
          fill: giusta ? 'rgba(52,211,153,.22)' : aperta ? 'rgba(255,255,255,.05)' : 'rgba(34,211,238,.07)',
          stroke: giusta ? COL.green : aperta ? '#3a4c73' : (esclusa ? '#1c2740' : COL.cyan),
          alpha: esclusa && !aperta ? 0.35 : 1,
        });
        text(ctx, aperta ? String(v) : '?', x + bw / 2, y + bh / 2, {
          size: aperta ? 15 : 17, align: 'center',
          color: giusta ? COL.green : aperta ? '#7f8fb3' : '#4c5f8a', weight: '800',
        });
        return { x, y, w: bw, h: bh, i };
      });

      text(ctx, t('scatole aperte: :n', { n: st.mosse }), 14, s.h - 12, { size: 12, color: st.mosse > ottimoBinario && ordinata ? COL.amber : COL.cyan });
      text(ctx, ordinata
        ? t('con il dimezzamento bastano :n aperture, sempre', { n: ottimoBinario })
        : t('in media servono :n aperture, e nel caso peggiore :max', { n: Math.round(N / 2), max: N }),
        piedeDoppio ? 14 : s.w - 14, piedeDoppio ? s.h - 32 : s.h - 12,
        { size: 11, align: piedeDoppio ? 'left' : 'right', color: '#7f8fb3', max: piedeDoppio ? s.w - 28 : s.w - 160 });
      fx.draw(ctx);
    },
    onPointer(e) {
      if (e.type !== 'down' || st.trovato) return;
      const r = st.rects.find(x => dentro(x, e.x, e.y));
      if (!r || st.aperte.has(r.i)) return;
      apri(r.i);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  function apri(i) {
    st.aperte.add(i); st.mosse++;
    const v = st.valori[i];
    if (v === st.cercato) {
      st.trovato = true;
      sfx.ok(); fx.burst(stage.w / 2, stage.h / 2); fx.flash();
      const chiave = st.modo;
      if (st.record[chiave] === undefined || st.mosse < st.record[chiave]) st.record[chiave] = st.mosse;
      /* La missione chiede di vincere in ENTRAMBE le modalità, e in quella
         ordinata entro il numero ottimo: senza il vincolo si vince anche
         aprendo a caso, e la lezione — che il metodo conta più della fortuna —
         non arriva. */
      if (st.modo === 'disordinata') st.vinte.add('disordinata');
      else if (st.mosse <= ottimoBinario) st.vinte.add('ordinata');
      if (st.vinte.size === 2) cfg.onWin && cfg.onWin(st.mosse);
    } else {
      sfx.tick();
      if (st.modo === 'ordinata') {
        if (v < st.cercato) st.lo = Math.max(st.lo, i + 1);
        else st.hi = Math.min(st.hi, i - 1);
      }
    }
    upd();
  }

  const out = readout('');
  const modo = choice({
    items: [
      { label: '🗃️ ' + t('scaffale in disordine'), value: 'disordinata' },
      { label: '📚 ' + t('scaffale ordinato'), value: 'ordinata' },
    ],
    value: 'disordinata',
    onchange: v => { st.modo = v; nuova(); },
  });
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, modo.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '🎲 ' + t('nuova partita'), class: 'sm primary', onclick: nuova },
  ])));
  w.body.appendChild(out.root);

  function upd() {
    const ordinata = st.modo === 'ordinata';
    const rimaste = ordinata ? Math.max(0, st.hi - st.lo + 1) : N - st.aperte.size;
    out.set(
      (ordinata
        ? t('Ogni apertura ti dice «più grande» o «più piccolo», quindi puoi buttare via <b>metà</b> scaffale ogni volta: :n scatole → log₂(:n) ≈ <b>:passi aperture</b>.', { n: N, passi: ottimoBinario })
        : t('Nessun indizio: l\'unica strategia è provare. Su :n scatole, in media <b>:media</b> aperture, nel caso peggiore <b>:n</b>.', { n: N, media: Math.round(N / 2) }))
      + '\n' + t('Scatole ancora possibili: <b>:rimaste</b> · aperture usate: <b>:mosse</b>', { rimaste, mosse: st.mosse })
      + '\n' + t('Record — disordine: <b>:a</b> · ordinato: <b>:b</b>',
        { a: st.record.disordinata ?? '—', b: st.record.ordinata ?? '—' })
      + (st.trovato ? '\n<span class="g">🎯 ' + t('trovato in :n aperture!', { n: st.mosse }) + '</span>' : ''));
    stage.redraw();
  }
  nuova();

  w.setFoot(t('<b>Da ricordare per il livello 11:</b> se la lista è ordinata, dimezzare porta a log N ed è imbattibile. Se è in <b>disordine</b> — e senza struttura da sfruttare — il classico non può fare meglio di N/2 tentativi. Grover, su quello stesso scaffale disordinato, ne farà circa <b>√N</b>: su 10.000 scatole, 100 aperture invece di 5.000.'));
  return { state: st };
}

/* ============================================================
   6) IL COSTO DI UN ALGORITMO — le curve di crescita
   ============================================================ */

export function costLab(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, {
    modo: 'classico',
    title: t('La gara delle crescite'),
    subtitle: t('quante operazioni servono, al crescere del problema'),
  });

  /* Un miliardo di operazioni al secondo: il conto della serva per un computer
     normale. Serve solo a trasformare "operazioni" in "tempo", che è l'unica
     unità in cui un numero enorme fa davvero impressione. */
  const AL_SECONDO = 1e9;
  const ANNO = 3.156e7;
  const ETA_UNIVERSO = 1.38e10 * ANNO;

  const CURVE = [
    { id: 'log', nome: 'log₂ N', fn: n => Math.log2(n + 1), colore: COL.green },
    { id: 'sqrt', nome: '√N', fn: n => Math.sqrt(n), colore: COL.cyan },
    { id: 'lin', nome: 'N', fn: n => n, colore: COL.amber },
    { id: 'nlogn', nome: 'N·log₂ N', fn: n => n * Math.log2(n + 1), colore: COL.violet },
    { id: 'quad', nome: 'N²', fn: n => n * n, colore: COL.pink },
    { id: 'exp', nome: '2^N', fn: n => 2 ** n, colore: COL.red },
  ];

  const st = { n: 20, trovato: false };

  /** Un tempo in secondi, detto come lo direbbe una persona. */
  function tempo(sec) {
    if (sec < 1e-6) return t('meno di un microsecondo');
    if (sec < 1) return (sec * 1000).toFixed(sec < 0.01 ? 3 : 1) + ' ' + t('millisecondi');
    if (sec < 90) return sec.toFixed(1) + ' ' + t('secondi');
    if (sec < 5400) return (sec / 60).toFixed(1) + ' ' + t('minuti');
    if (sec < 172800) return (sec / 3600).toFixed(1) + ' ' + t('ore');
    if (sec < ANNO) return (sec / 86400).toFixed(1) + ' ' + t('giorni');
    if (sec < ETA_UNIVERSO) return num(Math.round(sec / ANNO)) + ' ' + t('anni');
    return t(':volte volte l\'età dell\'universo', { volte: num(Math.round(sec / ETA_UNIVERSO)) });
  }

  const stage = new Stage(w.body, {
    height: 300,
    draw(ctx, s) {
      bg(ctx, s);
      const ops = 2 ** st.n;
      const top = hudK(ctx, s, {
        goal: t('trova il primo N per cui 2^N supera un anno di calcolo'),
        closeness: Math.min(1, st.n / 55), hit: st.trovato,
        sub: t('un miliardo di operazioni al secondo, che è un computer normale'),
      });

      const rect = { x: 46, y: top + 14, w: s.w - 66, h: s.h - top - 54 };
      roundRect(ctx, rect.x, rect.y, rect.w, rect.h, 8, { stroke: '#1c2740' });

      /* Scala verticale LOGARITMICA. Con una scala normale tutte le curve
         tranne 2^N sarebbero schiacciate sull'asse, e il gioco mostrerebbe
         una riga piatta e una verticale: due bugie invece di sei curve. */
      const yMax = Math.log10(2 ** 64);
      const py = v => rect.y + rect.h - (Math.log10(Math.max(1, v)) / yMax) * rect.h;
      const px = n => rect.x + (n / 64) * rect.w;

      /* Le tacche si fermano dove finisce la scala: disegnarne anche una sola
         oltre yMax vuol dire scriverne l'etichetta sopra il bordo, cioè in
         mezzo al titolo del gioco. */
      for (let e = 0; e <= Math.floor(yMax); e += 5) {
        const y = py(10 ** e);
        ctx.strokeStyle = '#141f36'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(rect.x, y); ctx.lineTo(rect.x + rect.w, y); ctx.stroke();
        text(ctx, e ? '10^' + e : '1', rect.x - 6, y, { size: 9.5, align: 'right', color: '#5b6b90' });
      }

      CURVE.forEach(c => {
        ctx.strokeStyle = c.colore; ctx.lineWidth = 2.2; ctx.globalAlpha = .95;
        ctx.beginPath();
        for (let n = 1; n <= 64; n += 0.5) {
          const x = px(n), y = py(c.fn(n));
          n === 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke(); ctx.globalAlpha = 1;
      });

      /* Le etichette si scostano l'una dall'altra: a destra del grafico quattro
         curve su sei arrivano quasi alla stessa altezza, e sovrapposte non se ne
         legge nessuna. Si parte dal basso e si spinge in su quel che serve. */
      const etichette = CURVE.map(c => ({ c, y: py(c.fn(64)) })).sort((a, b) => b.y - a.y);
      let limite = Infinity;
      for (const e of etichette) {
        e.y = Math.min(e.y, limite - 12);
        limite = e.y;
        text(ctx, e.c.nome, rect.x + rect.w - 6, Math.max(rect.y + 8, e.y),
          { size: 10.5, align: 'right', color: e.c.colore });
      }

      // la riga verticale del N scelto, e i pallini sulle curve
      const x = px(st.n);
      ctx.strokeStyle = COL.amber; ctx.lineWidth = 1.4; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(x, rect.y); ctx.lineTo(x, rect.y + rect.h); ctx.stroke(); ctx.setLineDash([]);
      CURVE.forEach(c => dot(ctx, x, py(c.fn(st.n)), 3.5, c.colore, false));
      text(ctx, 'N = ' + st.n, x, rect.y + rect.h + 16, { size: 11, align: 'center', color: COL.amber });

      // la soglia "un anno"
      const yAnno = py(ANNO * AL_SECONDO);
      ctx.strokeStyle = COL.red; ctx.lineWidth = 1.2; ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(rect.x, yAnno); ctx.lineTo(rect.x + rect.w, yAnno); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, t('un anno di calcolo'), rect.x + 8, yAnno - 9, { size: 10, color: COL.red });
      text(ctx, num(Math.round(ops)) + ' ' + t('operazioni con 2^N'), s.w - 14, s.h - 12,
        { size: 11, align: 'right', color: '#7f8fb3', max: s.w - 40 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const out = readout('');
  const sN = slider({
    label: t('dimensione del problema <b>N</b>'), min: 1, max: 64, step: 1, value: st.n,
    fmt: v => String(v), oninput: v => { st.n = v; upd(); },
  });
  w.body.appendChild(controls(sN.root));
  w.body.appendChild(out.root);

  function upd() {
    const n = st.n;
    const righe = CURVE.map(c => {
      const ops = c.fn(n);
      return `<b>${c.nome}</b> = ${ops < 1e6 ? num(Math.round(ops)) : ops.toExponential(2)} → ${tempo(ops / AL_SECONDO)}`;
    });
    const supera = 2 ** n / AL_SECONDO > ANNO;
    out.set(righe.join('\n')
      + (supera && !st.trovato && 2 ** (n - 1) / AL_SECONDO <= ANNO
        ? '\n<span class="g">🎯 ' + t('eccolo: da N = :n in poi la forza bruta non è più un\'opzione.', { n }) + '</span>' : ''));
    stage.redraw();
    if (supera && 2 ** (n - 1) / AL_SECONDO <= ANNO && !st.trovato) {
      st.trovato = true; sfx.ok(); fx.flash();
      cfg.onWin && cfg.onWin(n);
    }
  }
  upd();

  w.setFoot(t('<b>La riga che spiega tutto il corso:</b> passare da N² a N·log N è una buona ottimizzazione. Passare da N a √N (Grover) è un bel guadagno. Passare da <b>2^N a N³</b> — da esponenziale a polinomiale, che è quello che fa Shor sulla fattorizzazione — non è una ottimizzazione: è la differenza fra «impossibile per sempre» e «fatto stasera».'));
  return { state: st };
}

/* ============================================================
   7) REVERSIBILITÀ — l'informazione che si butta via
   ============================================================ */

export function reversibleLab(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, {
    modo: 'classico',
    title: t('Avanti e indietro'),
    subtitle: t('la porta AND perde la strada di casa, Toffoli no'),
  });

  /* Le tre porte reversibili classiche, tutte su tre bit. Sono le stesse tre
     che al livello 3 e 4 ricompaiono come X, CNOT e Toffoli quantistiche: qui
     agiscono su bit veri, lì su ampiezze. Vederle prima così toglie metà del
     mistero dopo. */
  const PORTE = [
    { id: 'X0', nome: 'NOT su a', fn: b => [b[0] ^ 1, b[1], b[2]] },
    { id: 'X1', nome: 'NOT su b', fn: b => [b[0], b[1] ^ 1, b[2]] },
    { id: 'CN01', nome: 'CNOT a→b', fn: b => [b[0], b[1] ^ b[0], b[2]] },
    { id: 'CN12', nome: 'CNOT b→c', fn: b => [b[0], b[1], b[2] ^ b[1]] },
    { id: 'TOF', nome: 'Toffoli ab→c', fn: b => [b[0], b[1], b[2] ^ (b[0] & b[1])] },
  ];

  const st = { partenza: [1, 0, 1], bits: [1, 0, 1], storia: [], vinte: 0, andA: 0, andB: 0 };

  function nuovaSfida() {
    st.partenza = [Math.random() < .5 ? 1 : 0, Math.random() < .5 ? 1 : 0, Math.random() < .5 ? 1 : 0];
    st.bits = st.partenza.slice();
    st.storia = [];
    // tre porte a caso, applicate dal computer: sta al giocatore disfarle
    for (let i = 0; i < 3; i++) {
      const p = PORTE[Math.floor(Math.random() * PORTE.length)];
      st.bits = p.fn(st.bits);
      st.storia.push(p.id);
    }
    st.mosseGiocatore = 0;
    upd();
  }

  const stage = new Stage(w.body, {
    /* Tre righe da 52 con lo spazio per l'HUD sopra e i due conteggi sotto:
       chiedere 250 significava disegnare la terza riga sul fondo della tela,
       sopra i conteggi e mezza tagliata via. */
    height: 288,
    draw(ctx, s) {
      bg(ctx, s);
      const uguali = st.bits.filter((b, i) => b === st.partenza[i]).length;
      const tornato = uguali === 3 && st.mosseGiocatore > 0;
      const top = hudK(ctx, s, {
        goal: t('riporta i tre bit a com\'erano all\'inizio'),
        closeness: uguali / 3, hit: tornato,
        sub: t('nessuna porta qui butta via niente: si torna indietro ripercorrendo la strada'),
      });

      /* Le caselle si misurano su quello che resta, non a numero fisso: su uno
         schermo basso la tela si accorcia da sola (Stage.resize) e con misure
         fisse la terza riga finirebbe di nuovo fuori. */
      const y = top + 26, gap = 14, piede = 26;
      const bh = Math.max(28, Math.min(52, (s.h - piede - y - 2 * gap) / 3));
      const bw = bh;
      const x0 = 24;
      const etichette = ['a', 'b', 'c'];
      st.partenza.forEach((b, i) => {
        bitBox(ctx, x0, y + i * (bh + gap), bw, bh, b, { label: i === 0 ? t('partenza') : '' });
        text(ctx, etichette[i], x0 - 12, y + i * (bh + gap) + bh / 2, { size: 12, align: 'right', color: '#7f8fb3' });
      });
      const x1 = Math.min(s.w - bw - 24, x0 + bw + 150);
      st.bits.forEach((b, i) => {
        const yy = y + i * (bh + gap);
        arrow(ctx, x0 + bw + 8, yy + bh / 2, x1 - 8, yy + bh / 2,
          { color: b === st.partenza[i] ? COL.green : COL.amber, width: 1.8, head: 7 });
        bitBox(ctx, x1, yy, bw, bh, b, { label: i === 0 ? t('adesso') : '' , colore: b === st.partenza[i] ? COL.green : COL.amber });
      });
      text(ctx, t('porte applicate da te: :n', { n: st.mosseGiocatore || 0 }), 14, s.h - 12,
        { size: 11, color: '#7f8fb3', max: s.w / 2 - 20 });
      text(ctx, t('rimesse a posto: :n', { n: st.vinte }), s.w - 14, s.h - 12,
        { size: 11, align: 'right', color: '#7f8fb3', max: s.w / 2 - 20 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const out = readout('');
  w.body.appendChild(h('div', { style: { marginTop: '10px' } }, buttons(
    PORTE.map(p => ({ label: p.nome, onclick: () => applica(p) })),
  )));
  w.body.appendChild(h('div', { style: { marginTop: '6px' } }, buttons([
    { label: '🎲 ' + t('nuova sfida'), class: 'sm primary', onclick: nuovaSfida },
    { label: '👀 ' + t('come si torna indietro?'), onclick: () => { st.suggerimento = true; upd(); } },
  ])));
  w.body.appendChild(out.root);

  function applica(p) {
    st.bits = p.fn(st.bits);
    st.mosseGiocatore = (st.mosseGiocatore || 0) + 1;
    sfx.gate();
    upd();
  }

  function upd() {
    const tornato = st.bits.every((b, i) => b === st.partenza[i]) && st.mosseGiocatore > 0;
    out.set(
      t('Queste cinque porte sono <b>reversibili</b>: da come esce si risale a com\'era entrato, sempre. Basta rifare le stesse porte <b>in ordine inverso</b> — e ognuna di queste è l\'inversa di sé stessa.')
      + (st.suggerimento ? '\n' + t('Suggerimento: il computer ha applicato <b>:elenco</b>. Rifalle dall\'ultima alla prima.', { elenco: st.storia.map(id => PORTE.find(p => p.id === id).nome).join(' → ') }) : '')
      + '\n' + t('Confronta con <b>AND</b>: da un\'uscita 0 non si risale agli ingressi (potevano essere 00, 01 o 10). Quel bit è <b>perso</b>, e per la fisica «perso» significa <b>scaldato</b>: cancellare un bit costa almeno kT·ln2 ≈ 3·10⁻²¹ joule (Landauer, 1961; misurato in laboratorio da Bérut et al., 2012).')
      + (tornato ? '\n<span class="g">✓ ' + t('tornato al punto di partenza in :n mosse.', { n: st.mosseGiocatore }) + '</span>' : ''));
    stage.redraw();
    if (tornato && !st.giaVinta) {
      st.giaVinta = true; st.vinte++;
      sfx.ok(); fx.burst(stage.w / 2, stage.h / 2); fx.flash();
      if (st.vinte >= 2) cfg.onWin && cfg.onWin(st.vinte);
    } else if (!tornato) st.giaVinta = false;
  }
  nuovaSfida();

  w.setFoot(t('<b>Il ponte:</b> le porte quantistiche sono <b>tutte</b> reversibili, senza eccezioni — è una conseguenza delle regole della fisica, non una scelta di ingegneria. Per questo un computer quantistico non può usare AND così com\'è: deve usare Toffoli, che l\'AND se lo tiene in un bit in più invece di buttarlo via.'));
  return { state: st };
}

/* ============================================================
   8) L'ORACOLO CLASSICO — quante domande servono, contate
   ============================================================ */

/**
 * Due giochi in uno, perché il conto è lo stesso e cambia solo la domanda:
 *
 *   modo 'deutsch'   la scatola nasconde f su 1 bit: costante o bilanciata?
 *                    → servono 2 domande, sempre. (livello 9)
 *   modo 'bernstein' la scatola nasconde una stringa segreta s di n bit e
 *                    risponde s·x. → servono n domande. (livello 10)
 *
 * Non è un doppione del livello 9: è il PRIMA. Chi ha contato le proprie
 * domande a mano legge «una interrogazione sola» come un risultato; chi non
 * l'ha fatto lo legge come una frase.
 */
export function oracoloClassico(host, opts = {}) {
  const cfg = Object.assign({ modo: 'deutsch', bits: 4, onWin: null }, opts);
  const w = widget(host, {
    modo: 'classico',
    title: cfg.modo === 'deutsch' ? t('La scatola: costante o bilanciata?') : t('La scatola con la stringa segreta'),
    subtitle: t('ogni interrogazione conta — e si vede'),
  });

  const N = cfg.modo === 'deutsch' ? 1 : cfg.bits;
  const st = { x: new Array(N).fill(0), segreto: null, tipo: '', domande: 0, risposte: [], vinte: 0, esito: '', rects: [] };

  function nuova() {
    if (cfg.modo === 'deutsch') {
      /* Le quattro funzioni possibili su un bit: due costanti, due bilanciate. */
      st.tipo = Math.random() < .5 ? 'costante' : 'bilanciata';
      const k = Math.random() < .5;
      st.segreto = st.tipo === 'costante' ? (k ? () => 1 : () => 0) : (k ? x => x : x => x ^ 1);
    } else {
      const s = Array.from({ length: N }, () => Math.random() < .5 ? 1 : 0);
      st.segretoBits = s;
      st.segreto = x => x.reduce((acc, b, i) => acc ^ (b & s[i]), 0);
    }
    st.x = new Array(N).fill(0); st.domande = 0; st.risposte = []; st.esito = '';
    upd();
  }

  const stage = new Stage(w.body, {
    height: 240,
    draw(ctx, s) {
      bg(ctx, s);
      const massimo = cfg.modo === 'deutsch' ? 2 : N;
      const top = hudK(ctx, s, {
        goal: cfg.modo === 'deutsch'
          ? t('scopri se la funzione nella scatola è costante o bilanciata')
          : t('scopri la stringa segreta di :n bit', { n: N }),
        closeness: Math.min(1, st.domande / massimo), hit: !!st.esito,
        sub: t('domande fatte: :n — classicamente ne servono :max', { n: st.domande, max: massimo }),
      });

      const bw = Math.min(52, (s.w - 200) / N - 6), bh = 52;
      const x0 = 22, y = top + 34;
      /* «la tua domanda x» sta sopra TUTTA la fila, non sopra la prima
         casella: dentro la larghezza di una casella sola veniva tagliata a
         «la tua dom…» perfino sul computer. */
      text(ctx, t('la tua domanda x'), x0, y - 11,
        { size: 10.5, color: '#7f8fb3', max: N * (bw + 6) + 40 });
      st.rects = st.x.map((b, i) => Object.assign(
        bitBox(ctx, x0 + i * (bw + 6), y, bw, bh, b),
        { i },
      ));

      const gx = x0 + N * (bw + 6) + 26, gw = Math.min(120, s.w - gx - 40);
      roundRect(ctx, gx, y - 10, gw, bh + 20, 12, { fill: 'rgba(167,139,250,.10)', stroke: COL.violet, width: 2 });
      text(ctx, 'f( x )', gx + gw / 2, y + bh / 2, { size: 20, align: 'center', color: COL.violet, weight: '800', max: gw - 10 });
      text(ctx, '?', gx + gw / 2, y - 22, { size: 12, align: 'center', color: '#7f8fb3' });

      // le risposte già ottenute, come uno scontrino
      const rx = 22;
      st.risposte.slice(-6).forEach((r, i) => {
        text(ctx, `f(${r.x}) = ${r.y}`, rx + (i % 3) * 120, y + bh + 34 + Math.floor(i / 3) * 22,
          { size: 12.5, color: COL.cyan });
      });
      if (st.esito) text(ctx, st.esito, s.w / 2, s.h - 14, { size: 12.5, align: 'center', color: COL.amber, mono: false, max: s.w - 24 });
      fx.draw(ctx);
    },
    onPointer(e) {
      if (e.type !== 'down') return;
      const r = st.rects.find(x => dentro(x, e.x, e.y));
      if (!r) return;
      st.x[r.i] ^= 1; sfx.click(); upd();
    },
  });
  const fx = new FX(stage);
  stage.pause();

  function interroga() {
    const y = cfg.modo === 'deutsch' ? st.segreto(st.x[0]) : st.segreto(st.x);
    st.domande++;
    st.risposte.push({ x: st.x.join(''), y });
    sfx.tick();
    upd();
  }

  function dichiara(risposta) {
    let giusto;
    if (cfg.modo === 'deutsch') giusto = risposta === st.tipo;
    else giusto = risposta === st.segretoBits.join('');
    if (giusto) {
      st.vinte++;
      st.esito = t('✓ giusto, con :n domande.', { n: st.domande });
      sfx.ok(); fx.burst(stage.w / 2, stage.h / 2); fx.flash();
      if (st.vinte >= 2) cfg.onWin && cfg.onWin(st.domande);
      nuova();
      st.esito = t('✓ giusto! Un\'altra scatola ti aspetta.');
    } else {
      st.esito = t('✗ no. Non hai ancora abbastanza informazione: chiedi ancora.');
      sfx.err();
    }
    upd();
  }

  const out = readout('');
  const azioni = h('div', { class: 'btn-row', style: { marginTop: '10px' } });
  azioni.appendChild(h('button', { class: 'btn sm primary', onclick: interroga }, '❓ ' + t('interroga la scatola')));
  if (cfg.modo === 'deutsch') {
    azioni.appendChild(h('button', { class: 'btn sm', onclick: () => dichiara('costante') }, t('è costante')));
    azioni.appendChild(h('button', { class: 'btn sm', onclick: () => dichiara('bilanciata') }, t('è bilanciata')));
  } else {
    azioni.appendChild(h('button', { class: 'btn sm', onclick: () => dichiara(st.x.join('')) }, t('il segreto è la stringa che ho impostato')));
  }
  azioni.appendChild(h('button', { class: 'btn sm ghost', onclick: nuova }, '🎲 ' + t('nuova scatola')));
  w.body.appendChild(azioni);
  w.body.appendChild(out.root);

  function upd() {
    out.set(cfg.modo === 'deutsch'
      ? t('La scatola nasconde una funzione da 1 bit a 1 bit. <b>Costante</b> vuol dire che risponde sempre uguale; <b>bilanciata</b> che risponde 0 a un ingresso e 1 all\'altro.')
        + '\n' + t('Con una domanda sola non puoi mai deciderlo: qualunque risposta è compatibile con tutte e due i casi. Servono <b>2 domande su 2 ingressi possibili</b>.')
      : t('La scatola nasconde :n bit segreti e risponde con il «prodotto» della tua domanda con il segreto (somma dei bit in comune, modulo 2).', { n: N })
        + '\n' + t('La strategia migliore è chiedere 1000…, 0100…, 0010… — un bit per volta. <b>:n domande per :n bit</b>: una a testa, non si scappa.', { n: N }));
    stage.redraw();
  }
  nuova();

  w.setFoot(cfg.modo === 'deutsch'
    ? t('<b>Segnati il numero: 2.</b> Con n bit invece di 1, il classico ha bisogno nel caso peggiore di <b>2ⁿ⁻¹+1</b> domande. Al livello 9 il computer quantistico ne farà <b>una</b>, e non perché è più veloce: perché fa una domanda diversa.')
    : t('<b>Segnati il numero: :n.</b> Una domanda per ogni bit del segreto, ed è dimostrato che meglio non si può fare classicamente. Al livello 10 Bernstein–Vazirani tirerà fuori tutta la stringa con <b>una sola</b> interrogazione.', { n: N }));
  return { state: st };
}

/* ============================================================
   9) CORREZIONE D'ERRORE CLASSICA — il codice a ripetizione
   ============================================================ */

export function ripetizioneLab(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, {
    modo: 'classico',
    title: t('Il codice a ripetizione'),
    subtitle: t('dire la stessa cosa tre volte, e votare a maggioranza'),
  });

  const st = { p: 0.15, inviati: 0, erroriNudi: 0, erroriProtetti: 0, ultimo: null, provato: false };

  function invia(quanti = 1) {
    for (let i = 0; i < quanti; i++) {
      const bit = Math.random() < .5 ? 1 : 0;
      const nudo = Math.random() < st.p ? bit ^ 1 : bit;
      const tre = [0, 1, 2].map(() => Math.random() < st.p ? bit ^ 1 : bit);
      const voto = tre.reduce((a, b) => a + b, 0) >= 2 ? 1 : 0;
      if (nudo !== bit) st.erroriNudi++;
      if (voto !== bit) st.erroriProtetti++;
      st.inviati++;
      st.ultimo = { bit, nudo, tre, voto };
    }
    st.provato = true;
    sfx.tick();
    upd();
    if (st.inviati >= 200 && cfg.onWin) cfg.onWin(st.inviati);
  }

  const stage = new Stage(w.body, {
    height: 220,
    draw(ctx, s) {
      bg(ctx, s);
      const teorico = 3 * st.p * st.p - 2 * st.p ** 3;
      const top = hudK(ctx, s, {
        goal: t('manda almeno 200 bit e guarda le due percentuali separarsi'),
        closeness: Math.min(1, st.inviati / 200), hit: st.inviati >= 200,
        sub: t('con rumore basso, ripetere conviene; con rumore alto, peggiora'),
      });

      const u = st.ultimo;
      if (u) {
        const y = top + 30, bw = 46, bh = 46;
        text(ctx, t('bit da mandare'), 22, y - 12, { size: 10.5, color: '#7f8fb3' });
        bitBox(ctx, 22, y, bw, bh, u.bit);
        text(ctx, t('senza codice'), 130, y - 12, { size: 10.5, color: '#7f8fb3' });
        bitBox(ctx, 130, y, bw, bh, u.nudo, { colore: u.nudo === u.bit ? COL.green : COL.red });
        text(ctx, t('in tre copie'), 240, y - 12, { size: 10.5, color: '#7f8fb3' });
        u.tre.forEach((b, i) => bitBox(ctx, 240 + i * (bw + 6), y, bw, bh, b, { colore: b === u.bit ? COL.green : COL.red }));
        const xv = 240 + 3 * (bw + 6) + 20;
        if (xv + bw < s.w - 10) {
          text(ctx, t('voto'), xv, y - 12, { size: 10.5, color: '#7f8fb3' });
          bitBox(ctx, xv, y, bw, bh, u.voto, { colore: u.voto === u.bit ? COL.green : COL.red });
        }
      }

      const yb = s.h - 58;
      /* Etichetta, barra e percentuale si dividono la larghezza che c'è, non
         quella di uno schermo grande: con le colonne fisse, su un telefono la
         percentuale finiva schiacciata contro il bordo e si leggeva «15.…» —
         cioè proprio il numero che il gioco serve a guardare. */
      const barra = (etichetta, valore, colore, off) => {
        const xEt = 22;
        const wEt = Math.min(150, s.w * 0.42);
        const x0 = xEt + wEt + 8;
        const wVal = 52;
        const bw2 = Math.max(40, Math.min(260, s.w - x0 - wVal - 14));
        text(ctx, etichetta, xEt, yb + off, { size: 11, color: '#9dabc9', max: wEt });
        roundRect(ctx, x0, yb + off - 7, bw2, 14, 4, { stroke: '#22304d' });
        roundRect(ctx, x0, yb + off - 7, Math.max(2, bw2 * Math.min(1, valore * 3)), 14, 4, { fill: colore, alpha: .8 });
        text(ctx, (valore * 100).toFixed(1) + '%', x0 + bw2 + 6, yb + off, { size: 11, color: colore, max: wVal });
      };
      barra(t('errori senza codice'), st.inviati ? st.erroriNudi / st.inviati : st.p, COL.red, 0);
      barra(t('errori con le tre copie'), st.inviati ? st.erroriProtetti / st.inviati : teorico, COL.green, 24);
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const out = readout('');
  const sP = slider({
    label: t('probabilità che un bit si rovesci <b>p</b>'), min: 0.01, max: 0.6, step: 0.01, value: st.p,
    fmt: v => (v * 100).toFixed(0) + '%',
    oninput: v => { st.p = v; st.inviati = 0; st.erroriNudi = 0; st.erroriProtetti = 0; upd(); },
  });
  w.body.appendChild(controls(sP.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '📨 ' + t('manda 1 bit'), onclick: () => invia(1) },
    { label: '📮 ' + t('manda 100 bit'), class: 'sm primary', onclick: () => invia(100) },
    { label: '↺ ' + t('azzera il conteggio'), onclick: () => { st.inviati = 0; st.erroriNudi = 0; st.erroriProtetti = 0; upd(); } },
  ])));
  w.body.appendChild(out.root);

  function upd() {
    const p = st.p, teorico = 3 * p * p - 2 * p ** 3;
    out.set(
      t('Senza codice sbagli con probabilità <b>p = :p%</b>. Con tre copie sbagli solo se si rovesciano <b>due o tre</b> copie: 3p² − 2p³ = <b>:teorico%</b>.',
        { p: (p * 100).toFixed(0), teorico: (teorico * 100).toFixed(2) })
      + '\n' + t('Bit mandati: <b>:n</b> · errori senza codice: <b>:a</b> · errori con le copie: <b>:b</b>',
        { n: st.inviati, a: st.erroriNudi, b: st.erroriProtetti })
      + '\n' + (p < 0.5
        ? t('Sotto p = 50% ripetere <b>conviene</b>, e più copie metti meglio va: è la soglia sotto cui la correzione d\'errore funziona.')
        : t('Sopra p = 50% ripetere <b>peggiora</b> le cose: la maggioranza vota per l\'errore. Anche il quantistico ha la sua soglia, ed è il motivo per cui il livello 21 esiste.')));
    stage.redraw();
  }
  upd();

  w.setFoot(t('<b>Perché il quantistico non può copiare questo trucco così com\'è:</b> ripetere vuol dire <b>copiare</b>, e un qubit non si può copiare (teorema di no-cloning, livello 6). E poi qui l\'errore è uno solo — il bit si rovescia — mentre un qubit può sbagliare anche di <b>fase</b>. Il codice di Shor a 9 qubit risolve tutti e due i problemi in una volta.'));
  return { state: st };
}
