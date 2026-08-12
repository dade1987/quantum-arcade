/* ============================================================
   WIDGET degli algoritmi: Deutsch–Jozsa, Bernstein–Vazirani, Grover, Simon.
   Tutti costruiti sullo stesso schema in tre mosse:
     1. Hadamard su tutti  → tutte le possibilità insieme
     2. oracolo            → l'informazione entra nelle FASI
     3. Hadamard/diffusore → l'interferenza porta la risposta a galla
   ============================================================ */

import { Stage, COL, bg, text, roundRect, dot, attachFX } from '../core/canvas.js';
import { widget, buttons, slider, controls, readout, h, choice } from '../core/ui.js';
import {
  zeroState, applyGate, GATES, probs, label, sample, phaseOracle,
  groverDiffusion, hadamardAll, clone, functionOracle, extractInput,
  solveMod2, measureRegister,
} from '../core/qsim.js';
import { ampsView, histogram } from './amps.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';

/* ------------------------------------------------------------
   DEUTSCH–JOZSA
   ------------------------------------------------------------ */
export function deutschLab(host, opts = {}) {
  const cfg = Object.assign({ n: 3, onWin: null }, opts);
  const w = widget(host, { title: 'Deutsch–Jozsa', subtitle: t('costante o bilanciata? Una sola domanda.') });
  const n = cfg.n, N = 1 << n;
  const st = { f: null, kind: '', classicalQueries: 0, revealed: false, quantumRun: false };

  function newOracle() {
    const kind = Math.random() < 0.4 ? 'costante' : 'bilanciata';
    let f;
    if (kind === 'costante') { const v = Math.random() < 0.5 ? 0 : 1; f = () => v; }
    else {
      // metà 0 e metà 1, in ordine casuale
      const vals = [...Array(N).keys()].sort(() => Math.random() - 0.5);
      const ones = new Set(vals.slice(0, N / 2));
      f = x => ones.has(x) ? 1 : 0;
    }
    st.f = f; st.kind = kind; st.classicalQueries = 0; st.revealed = false; st.quantumRun = false;
    st.seen = [];
    amps.set(zeroState(n));
    upd();
  }

  const ampHost = h('div'); w.body.appendChild(ampHost);
  const amps = ampsView(ampHost, { height: 165, showProb: true });
  const fx = attachFX(amps.stage);   // scintille, lampi e suono ai traguardi
  const out = readout('');

  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '10px' } },
    h('button', { class: 'btn sm', onclick: () => classicalAsk() }, '🐌 ' + t('chiedi 1 valore (modo classico)')),
    h('button', { class: 'btn sm primary', onclick: () => quantumRun() }, '⚛️ ' + t('chiedi UNA volta (modo quantistico)')),
    h('button', { class: 'btn sm ghost', onclick: newOracle }, '🎲 ' + t('nuova funzione segreta')),
  ));
  w.body.appendChild(out.root);

  function classicalAsk() {
    if (st.classicalQueries >= N) return;
    const x = st.classicalQueries;
    st.seen.push({ x, y: st.f(x) });
    st.classicalQueries++;
    upd();
  }

  function quantumRun() {
    const s = zeroState(n);
    hadamardAll(s, [...Array(n).keys()]);          // 1. tutte le possibilità
    phaseOracle(s, i => st.f(i) === 1);            // 2. l'oracolo mette un meno dove f=1
    hadamardAll(s, [...Array(n).keys()]);          // 3. interferenza
    amps.set(s);
    sfx.measure();
    const p = probs(s);
    st.quantumRun = true;
    st.result = p[0] > 0.99 ? 'costante' : 'bilanciata';
    st.revealed = true;
    if (st.result === st.kind) { fx.win(); sfx.ok(); cfg.onWin && cfg.onWin(); }
    upd();
  }

  function upd() {
    const classicoSicuro = N / 2 + 1;
    /* «costante»/«bilanciata» sono dati, non testo: restano in italiano dentro
       lo stato e si traducono solo al momento di scriverli. */
    const nome = k => k === 'costante' ? t('costante') : t('bilanciata');
    let msg = t('Funzione segreta su <b>:N</b> ingressi (:n qubit).', { N, n }) + '\n';
    if (st.seen && st.seen.length) {
      msg += t('Risposte classiche ottenute: :elenco', { elenco: st.seen.map(s => `f(${s.x})=${s.y}`).join(', ') }) + '\n';
      const vals = new Set(st.seen.map(s => s.y));
      msg += vals.size > 1
        ? '<span class="g">' + t('Con :quante domande hai già la risposta: BILANCIATA (hai visto sia 0 sia 1).', { quante: st.seen.length }) + '</span>\n'
        : t('Finora tutte uguali: potrebbe essere costante, ma per esserne <b>sicuro</b> nel caso peggiore ti servono :quante domande.', { quante: classicoSicuro }) + '\n';
    }
    if (st.quantumRun) {
      msg += '\n<b>' + t('Modo quantistico — una sola interrogazione:') + '</b>\n' +
        t('probabilità di misurare |:zeri⟩ = <b>:percento%</b>', { zeri: '0'.repeat(n), percento: (probs(amps.state)[0] * 100).toFixed(1) }) + '\n' +
        t('→ risposta: :risposta (la funzione era davvero <b>:vera</b>) :esito', {
          risposta: `<span class="${st.result === 'costante' ? 'g' : 'a'}">${nome(st.result).toUpperCase()}</span>`,
          vera: nome(st.kind),
          esito: st.result === st.kind ? '✓' : '✗',
        }) + '\n' +
        t('Regola di lettura: <b>tutto |0…0⟩ → costante</b>; <b>qualsiasi altra cosa → bilanciata</b>.');
    } else {
      msg += '\n' + t('Premi il bottone quantistico: una sola interrogazione basta, sempre.');
    }
    out.set(msg);
  }
  newOracle();
  w.setFoot(t('<b>Il confronto:</b> classicamente, nel caso peggiore, servono <b>:quante</b> domande per esserne certi. Quantisticamente ne basta <b>1</b>. Non perché il computer "provi tutti i casi in parallelo e li legga", ma perché l\'oracolo scrive la risposta nelle <b>fasi</b> e le Hadamard finali fanno cancellare tutto tranne l\'informazione che ci interessa.', { quante: N / 2 + 1 }));
  return { state: st };
}

/* ------------------------------------------------------------
   BERNSTEIN–VAZIRANI
   ------------------------------------------------------------ */
export function bvLab(host, opts = {}) {
  const cfg = Object.assign({ n: 4, onWin: null }, opts);
  const w = widget(host, { title: 'Bernstein–Vazirani', subtitle: t('trova la stringa segreta con UNA domanda') });
  const n = cfg.n, N = 1 << n;
  const st = { s: 0, asked: 0, found: null };

  const parity = (a, b) => { let x = a & b, p = 0; while (x) { p ^= x & 1; x >>= 1; } return p; };
  const newSecret = () => { st.s = 1 + Math.floor(Math.random() * (N - 1)); st.asked = 0; st.found = null; amps.set(zeroState(n)); upd(); };

  const ampHost = h('div'); w.body.appendChild(ampHost);
  const amps = ampsView(ampHost, { height: 165, showProb: true });
  const fx = attachFX(amps.stage);   // scintille, lampi e suono ai traguardi
  const out = readout('');
  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '10px' } },
    h('button', { class: 'btn sm', onclick: () => classicalAsk() }, '🐌 ' + t('chiedi un bit alla volta')),
    h('button', { class: 'btn sm primary', onclick: () => quantumRun() }, '⚛️ ' + t('chiedi UNA volta')),
    h('button', { class: 'btn sm ghost', onclick: newSecret }, '🎲 ' + t('nuovo segreto')),
  ));
  w.body.appendChild(out.root);

  function classicalAsk() { if (st.asked < n) { st.asked++; upd(); } }
  function quantumRun() {
    const s = zeroState(n);
    hadamardAll(s, [...Array(n).keys()]);
    phaseOracle(s, i => parity(i, st.s) === 1);
    hadamardAll(s, [...Array(n).keys()]);
    amps.set(s);
    st.found = sample(s, () => 0.0001);   // deterministico: la probabilità è 1 su s
    if (st.found === st.s) { fx.win(); sfx.ok(); cfg.onWin && cfg.onWin(); }
    upd();
  }
  function upd() {
    const bin = v => v.toString(2).padStart(n, '0');
    let msg = t('La funzione segreta è <b>f(x) = s·x mod 2</b> (quante posizioni hanno 1 in comune, pari o dispari).') + '\n' +
      t('Il segreto <b>s</b> ha :n bit.', { n }) + '\n';
    if (st.asked) msg += t('Classicamente devi chiedere un bit alla volta: f(001), f(010), f(100)… → servono <b>:quante</b> domande. Ne hai fatte <b>:fatte</b>.', { quante: n, fatte: st.asked }) + '\n';
    if (st.found !== null) {
      msg += '\n<b>' + t('Con una sola interrogazione quantistica') + `</b> ` + t('il risultato è:') + ` <span class="g">|${bin(st.found)}⟩</span>\n` +
        t('Il segreto era <b>:segreto</b> → :esito', { segreto: bin(st.s), esito: st.found === st.s ? '<span class="g">' + t('ESATTO') + ' ✓</span>' : '✗' }) + '\n' +
        t('Nota le barre: <b>una sola</b> è alta al 100%. Tutte le altre possibilità si sono cancellate a vicenda.');
    } else msg += '\n' + t('Premi il bottone quantistico e guarda cosa succede alle ampiezze.');
    out.set(msg);
  }
  newSecret();
  w.setFoot(t('Perché funziona: dopo le prime Hadamard ogni possibilità x ha la stessa ampiezza. L\'oracolo mette un <b>meno</b> su quelle con parità dispari: è come "scrivere s nelle fasi". Le Hadamard finali trasformano quel disegno di segni in <b>un unico stato</b>, proprio s. È già un piccolo Fourier.'));
  return { state: st };
}

/* ------------------------------------------------------------
   GROVER
   ------------------------------------------------------------ */
export function groverLab(host, opts = {}) {
  const cfg = Object.assign({ n: 4, onWin: null }, opts);
  const w = widget(host, { title: t('Grover: la ricerca amplificata'), subtitle: t('guarda la barra giusta crescere') });
  const n = cfg.n, N = 1 << n;
  const st = { marked: 5, iter: 0, s: null, best: 0 };
  const optimal = Math.round(Math.PI / 4 * Math.sqrt(N));

  const reset = () => {
    st.s = zeroState(n);
    hadamardAll(st.s, [...Array(n).keys()]);
    st.iter = 0;
    amps.set(st.s, { highlight: st.marked });
    upd();
  };
  const step = () => {
    phaseOracle(st.s, i => i === st.marked);
    groverDiffusion(st.s, [...Array(n).keys()]);
    st.iter++;
    sfx.boost();
    amps.set(st.s, { highlight: st.marked });
    upd();
  };

  const ampHost = h('div'); w.body.appendChild(ampHost);
  const amps = ampsView(ampHost, { height: 185, showProb: true });
  const fx = attachFX(amps.stage);   // scintille, lampi e suono ai traguardi

  const curve = new Stage(w.body, {
    height: 175,
    draw(ctx, s) {
      bg(ctx, s);
      const rect = { x: 34, y: 18, w: s.w - 48, h: s.h - 46 };
      text(ctx, t("probabilità di trovare l'elemento giusto, iterazione per iterazione"), rect.x, 10, { size: 10.5, color: '#7f8fb3' });
      ctx.strokeStyle = COL.axis; ctx.beginPath();
      ctx.moveTo(rect.x, rect.y + rect.h); ctx.lineTo(rect.x + rect.w, rect.y + rect.h);
      ctx.moveTo(rect.x, rect.y); ctx.lineTo(rect.x, rect.y + rect.h); ctx.stroke();
      const maxIt = Math.max(12, optimal * 3);
      const theta = Math.asin(1 / Math.sqrt(N));
      ctx.strokeStyle = COL.violet; ctx.lineWidth = 2; ctx.beginPath();
      for (let i = 0; i <= maxIt; i++) {
        const p = Math.sin((2 * i + 1) * theta) ** 2;
        const X = rect.x + (i / maxIt) * rect.w, Y = rect.y + rect.h - p * rect.h;
        i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
      }
      ctx.stroke();
      // ottimo
      const xo = rect.x + (optimal / maxIt) * rect.w;
      ctx.strokeStyle = COL.green; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(xo, rect.y); ctx.lineTo(xo, rect.y + rect.h); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, t('ottimo ≈ :quante', { quante: optimal }), xo + 5, rect.y + 10, { size: 10.5, color: COL.green });
      // posizione attuale
      const p = probs(st.s)[st.marked];
      const xc = rect.x + (st.iter / maxIt) * rect.w, yc = rect.y + rect.h - p * rect.h;
      dot(ctx, xc, yc, 5, COL.amber);
      text(ctx, `${(p * 100).toFixed(1)}%`, xc + 8, yc - 8, { size: 11, color: COL.amber });
      text(ctx, '100%', 4, rect.y, { size: 9.5, color: '#5b6b90' });
      text(ctx, '0', 12, rect.y + rect.h, { size: 9.5, color: '#5b6b90' });
      text(ctx, t('iterazioni') + ' →', rect.x + rect.w, rect.y + rect.h + 14, { size: 10, align: 'right', color: '#5b6b90' });
    },
  });
  curve.pause();

  const out = readout('');
  const sm = slider({ label: t('Elemento da trovare'), min: 0, max: N - 1, step: 1, value: st.marked, fmt: v => `|${v.toString(2).padStart(n, '0')}⟩`, oninput: v => { st.marked = v; reset(); } });
  w.body.appendChild(controls(sm.root));
  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '10px' } },
    h('button', { class: 'btn sm primary', onclick: step }, '▶ ' + t('una iterazione di Grover')),
    h('button', { class: 'btn sm', onclick: () => { for (let i = 0; i < optimal; i++) step(); } }, '⏩ ' + t("vai all'ottimo (:quante)", { quante: optimal })),
    h('button', { class: 'btn sm', onclick: reset }, '↺ ' + t('ricomincia')),
    h('button', { class: 'btn sm ghost', onclick: () => { for (let i = 0; i < 3; i++) step(); } }, t('+3 iterazioni (guarda cosa succede)')),
  ));
  w.body.appendChild(out.root);

  function upd() {
    const p = probs(st.s)[st.marked];
    st.best = Math.max(st.best, p);
    out.set(
      t('N = <b>:N</b> possibilità, iterazioni fatte: <b>:fatte</b>', { N, fatte: st.iter }) + '\n' +
      t("probabilità di pescare l'elemento giusto: <b>:ora%</b> (all'inizio era :prima%)", { ora: (p * 100).toFixed(1), prima: (100 / N).toFixed(1) }) + '\n' +
      t('numero ottimo di iterazioni ≈ (π/4)·√N = <b>:quante</b>', { quante: optimal }) + '\n' +
      (st.iter > optimal + 1 && p < 0.5
        ? '<span class="a">' + t('Hai superato l\'ottimo: continuando, la probabilità RICALA. Grover non è "più giri = meglio": è una rotazione che, se esageri, ti porta oltre il bersaglio.') + '</span>'
        : (p > 0.9 ? '<span class="g">' + t('Ottimo punto per misurare!') + '</span>' : '')));
    curve.redraw();
    if (p > 0.9 && !st.celebrated) { st.celebrated = true; fx.win(); sfx.boss(); }
    if (p > 0.9) cfg.onWin && cfg.onWin();
  }
  reset();
  w.setFoot(t('<b>Il conto che conta:</b> classicamente, per trovare un elemento fra :N servono in media :medi tentativi. Grover ne usa circa <b>√:N = :radice</b>. Non è esponenziale come Shor: è un guadagno "quadratico", ma vale per <b>qualsiasi</b> ricerca senza struttura.', { N, medi: N / 2, radice: Math.round(Math.sqrt(N)) }));
  return { state: st };
}

/* ------------------------------------------------------------
   SIMON — il periodo nascosto (XOR)

   È il ponte fra Bernstein–Vazirani e Shor: stessa idea (scrivere
   l'informazione nelle fasi e rileggerla con una trasformata), ma
   quello che si cerca non è più una stringa — è un PERIODO.

   Qui il vantaggio quantistico diventa esponenziale per la prima
   volta nel corso, ed è dimostrato: classicamente servono circa
   √(2^n) domande (è il paradosso dei compleanni), quantisticamente
   circa n.
   ------------------------------------------------------------ */
export function simonLab(host, opts = {}) {
  const cfg = Object.assign({ n: 3, onWin: null, onSolved: null }, opts);
  const n = cfg.n, N = 1 << n;
  const w = widget(host, { title: 'Simon', subtitle: t('trova il periodo nascosto s: f(x) = f(x ⊕ s)') });

  const bin = v => v.toString(2).padStart(n, '0');
  const st = {
    s: 0,
    f: [],              // tabella della funzione (nascosta finché non la chiedi)
    viste: new Map(),   // x → f(x), solo quelle già chieste classicamente
    domandeClassiche: 0,
    equazioni: [],      // le y misurate: ognuna dice y·s = 0
    trovatoClassico: null,
    risolto: null,
    ultimaMisura: null,
  };

  /* ---------- la funzione segreta ---------- */
  function nuovoSegreto() {
    st.s = 1 + Math.floor(Math.random() * (N - 1));

    // f due-a-uno: a ogni coppia {x, x⊕s} assegno un valore diverso, mescolato,
    // così dal valore non si può indovinare niente del segreto.
    const valori = [...Array(N).keys()].sort(() => Math.random() - 0.5);
    st.f = new Array(N);
    let k = 0;
    for (let x = 0; x < N; x++) {
      if (st.f[x] !== undefined) continue;
      const v = valori[k++];
      st.f[x] = v; st.f[x ^ st.s] = v;
    }

    st.viste.clear();
    st.domandeClassiche = 0;
    st.equazioni = [];
    st.trovatoClassico = null;
    st.risolto = null;
    st.ultimaMisura = null;
    amps.set(zeroState(n));
    tabella.redraw();
    upd();
  }

  /* ---------- la tabella di f, che si scopre una casella alla volta ---------- */
  const tabHost = h('div');
  w.body.appendChild(tabHost);

  const tabella = new Stage(tabHost, {
    height: 92,
    draw(ctx, s) {
      bg(ctx, s, '#080e1b');
      const margine = 8;
      const larg = (s.w - margine * 2) / N;

      for (let x = 0; x < N; x++) {
        const cx = margine + x * larg;
        const noto = st.viste.has(x);
        const evidenzia = st.trovatoClassico && (x === st.trovatoClassico[0] || x === st.trovatoClassico[1]);

        roundRect(ctx, cx + 2, 26, larg - 4, 44, 7, {
          fill: noto ? (evidenzia ? '#2a1e3f' : '#111c31') : '#0b1424',
          stroke: evidenzia ? COL.pink : (noto ? COL.violet : COL.grid),
          width: evidenzia ? 2 : 1,
        });

        text(ctx, bin(x), cx + larg / 2, 16, { size: 11, align: 'center', color: COL.txt });
        text(ctx, noto ? bin(st.viste.get(x)) : '?', cx + larg / 2, 48, {
          size: noto ? 13 : 16, align: 'center',
          color: noto ? (evidenzia ? COL.pink : COL.txtBright) : COL.axis,
        });
      }

      text(ctx, 'x', margine, 16, { size: 10, color: COL.axis, align: 'right' });
      text(ctx, t("clicca una casella per chiedere f(x) all'oracolo"), s.w / 2, 82,
        { size: 10, align: 'center', color: COL.axis });
    },
    onPointer(e) {
      if (e.type !== 'down') return;
      const margine = 8, larg = (tabella.w - margine * 2) / N;
      const x = Math.floor((e.x - margine) / larg);
      if (x >= 0 && x < N) chiediClassica(x);
    },
  });
  const fxTab = attachFX(tabella);

  /* ---------- le barre delle ampiezze ---------- */
  const ampHost = h('div');
  w.body.appendChild(ampHost);
  const amps = ampsView(ampHost, { height: 165, showProb: true });
  const fx = attachFX(amps.stage);

  const out = readout('');

  w.body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '10px' } },
    h('button', { class: 'btn sm', onclick: () => chiediClassica(Math.floor(Math.random() * N)) },
      '🐌 ' + t('chiedi a caso')),
    h('button', { class: 'btn sm primary', onclick: interrogazioneQuantistica },
      '⚛️ ' + t('interrogazione quantistica')),
    h('button', { class: 'btn sm', onclick: risolvi }, '🧮 ' + t('risolvi il sistema')),
    h('button', { class: 'btn sm ghost', onclick: nuovoSegreto }, '🎲 ' + t('nuovo segreto')),
  ));
  w.body.appendChild(out.root);

  /* ---------- la strada lenta: chiedere finché due valori coincidono ---------- */
  function chiediClassica(x) {
    if (st.viste.has(x)) { sfx.cancel(); return; }

    st.viste.set(x, st.f[x]);
    st.domandeClassiche++;
    sfx.tick();

    for (const [altro, valore] of st.viste) {
      if (altro !== x && valore === st.f[x]) {
        st.trovatoClassico = [altro, x];
        fxTab.win(); sfx.boost();
        break;
      }
    }
    tabella.redraw();
    upd();
  }

  /* ---------- la strada quantistica: una domanda, una equazione ---------- */
  function interrogazioneQuantistica() {
    // 1. tutti gli ingressi insieme
    const pieno = zeroState(2 * n);
    const ingresso = [...Array(n).keys()];
    const uscita = ingresso.map(q => q + n);
    hadamardAll(pieno, ingresso);

    // 2. una sola chiamata all'oracolo, su TUTTI gli x contemporaneamente
    functionOracle(pieno, n, n, x => st.f[x]);

    // 3. misuro l'uscita: non mi dice niente di utile, ma fa collassare
    //    l'ingresso sui due soli x che davano quel risultato
    const letto = measureRegister(pieno, uscita);
    const dentro = extractInput(pieno, n, letto);
    amps.set(clone(dentro));
    sfx.measure();

    // 4. le Hadamard rileggono la differenza fra i due x rimasti
    setTimeout(() => {
      hadamardAll(dentro, ingresso);
      normalizzaSegno(dentro);
      amps.set(clone(dentro));
      const y = sample(dentro);
      st.equazioni.push(y);
      st.ultimaMisura = y;
      sfx.gate();
      upd();
    }, 700);

    upd();
  }

  /**
   * Gira il segno di TUTTE le ampiezze se la prima è negativa.
   *
   * Un segno globale non è osservabile: nessuna misura può distinguere |ψ⟩ da
   * −|ψ⟩, quindi questo non cambia la fisica di una virgola. Serve solo a non
   * mostrare allo studente quattro barre rosse che sembrano un errore quando
   * invece è il risultato giusto: ciò che conta sono i segni RELATIVI.
   */
  function normalizzaSegno(stato) {
    for (let i = 0; i < stato.re.length; i++) {
      if (Math.abs(stato.re[i]) > 1e-9 || Math.abs(stato.im[i]) > 1e-9) {
        if (stato.re[i] < 0) {
          for (let k = 0; k < stato.re.length; k++) { stato.re[k] *= -1; stato.im[k] *= -1; }
        }
        return stato;
      }
    }
    return stato;
  }

  function risolvi() {
    const r = solveMod2(st.equazioni, n);
    if (!r.unica) { sfx.err(); st.risolto = { ...r, fallito: true }; upd(); return; }

    st.risolto = r;
    fx.win(); sfx.boss();
    cfg.onWin && cfg.onWin();
    cfg.onSolved && cfg.onSolved(r.s === st.s);
    upd();
  }

  /* ---------- il pannello che spiega cosa sta succedendo ---------- */
  function upd() {
    const r = solveMod2(st.equazioni, n);
    const servono = n - 1;

    let m = t("L'oracolo nasconde un <b>periodo s</b> di :n bit: <b>f(x) = f(x ⊕ s)</b>, cioè ogni valore esce esattamente <b>due volte</b>.", { n }) + '\n\n';

    m += '<b>🐌 ' + t('Strada classica') + '</b> — ' + t('domande fatte: <b>:fatte</b> su :totali possibili.', { fatte: st.domandeClassiche, totali: N }) + '\n';
    m += st.trovatoClassico
      ? t('Collisione trovata: f(:a) = f(:b) → ', { a: bin(st.trovatoClassico[0]), b: bin(st.trovatoClassico[1]) })
        + `<span class="g">s = ${bin(st.trovatoClassico[0])} ⊕ ${bin(st.trovatoClassico[1])} = ${bin(st.trovatoClassico[0] ^ st.trovatoClassico[1])}</span>\n`
      : t('Serve una <b>collisione</b>: due x diversi con lo stesso f. Con :n bit ne bastano poche, ma con 40 bit servirebbero <b>un milione</b> di domande.', { n }) + '\n';

    m += '\n<b>⚛️ ' + t('Strada quantistica') + '</b> — ' + t('interrogazioni: <b>:quante</b>', { quante: st.equazioni.length }) + '\n';

    if (st.ultimaMisura !== null) {
      m += t('Ultima misura: <b>y = :y</b> → equazione <b>:y · s = 0</b>', { y: bin(st.ultimaMisura) }) + '\n';
    }
    if (st.equazioni.length) {
      m += t('Equazioni raccolte: :elenco', { elenco: st.equazioni.map(bin).join(', ') }) + '\n';
      m += t('Indipendenti: <b>:rango</b> su :servono necessarie — ', { rango: r.rango, servono });
      m += r.rango >= servono
        ? '<span class="g">' + t('bastano: premi "risolvi il sistema"') + '</span>\n'
        : t('possibili segreti ancora in gioco: <b>:quanti</b>', { quanti: r.candidati.length }) + '\n';
    } else {
      m += t("Premi il bottone quantistico: <b>una sola</b> chiamata all'oracolo dà un'equazione su s.") + '\n';
    }

    m += '\n<span class="muted">' + t("Con :n bit il vantaggio non si vede — ed è giusto così: il punto non è quante domande servono <b>adesso</b>, ma <b>come crescono i due numeri</b>. Con 40 bit: classicamente ~1.048.576 domande, quantisticamente ~39. Con 80 bit il computer classico non finisce prima della fine dell'universo.", { n }) + '</span>\n';

    if (st.risolto?.fallito) {
      m += '\n<span class="a">' + t("Con queste equazioni il sistema ha ancora :quante soluzioni: serve un'altra interrogazione.", { quante: st.risolto.candidati.length }) + '</span>';
    } else if (st.risolto) {
      m += '\n<span class="g">' + t('Sistema risolto: s = :s', { s: bin(st.risolto.s) }) + '</span> — '
        + (st.risolto.s === st.s ? t('ed è davvero il periodo nascosto') + ' ✓' : '✗') + '\n'
        + t('Ti sono bastate <b>:quante</b> interrogazioni quantistiche.', { quante: st.equazioni.length });
    }

    out.set(m);
  }

  nuovoSegreto();
  w.setFoot(t("<b>Perché una misura sola dà un'equazione:</b> dopo l'oracolo i due soli ingressi rimasti sono x₀ e x₀⊕s. Le Hadamard finali li fanno interferire, e le y per cui <b>y·s = 1</b> ricevono due contributi opposti che si <b>cancellano</b>. Sopravvivono solo le y con <b>y·s = 0</b>: ogni misura è una riga di un sistema lineare, e con n−1 righe indipendenti il periodo è tuo."));

  return { state: st };
}
