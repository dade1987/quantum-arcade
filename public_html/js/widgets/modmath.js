/* ============================================================
   PARTE 0 — L'OROLOGIO DEI NUMERI
   Resto (modulo), massimo comune divisore, ritmi che tornano.

   Perché questi tre giochi stanno nel corso, e proprio qui:

   · l'algoritmo di Shor (livello 20) è per metà matematica classica —
     «a^x mod N», «il periodo r», «MCD(a^{r/2} ± 1, N)», le frazioni
     continue. Finora quella metà arrivava tutta insieme nel livello più
     difficile del corso: chi non aveva mai visto un resto doveva impararlo
     mentre gli si spiegava la trasformata di Fourier quantistica;

   · sono cose delle medie (l'orologio, il MCD) o giocabili come tali (il
     ritmo che torna), quindi stanno nella Parte 0, che è facoltativa e
     sempre aperta: chi le sa già le salta senza pagare pegno;

   · e sono cose che si VEDONO. Il resto è una lancetta che fa dei giri,
     il MCD è l'ultima piastrella quadrata che copre il pavimento, il
     periodo è una stella che si chiude. Prima si muove, poi si legge.

   Le funzioni di calcolo (gcd, modpow, periodOf) NON sono riscritte qui:
   sono importate dal simulatore, cioè sono le stesse identiche righe che
   esegue Shor. Se il gioco e l'algoritmo divergessero, il gioco
   insegnerebbe una bugia con la faccia di un esperimento.
   ============================================================ */

import { Stage, COL, bg, circle, dot, text, roundRect, arrow, FX, hsl } from '../core/canvas.js';
import { widget, slider, controls, buttons, readout, choice, h, TAU } from '../core/ui.js';
import { sfx } from '../core/audio.js';
import { t } from '../core/i18n.js';
import { gcd, periodOf } from '../core/qsim.js';
import { nOf } from '../core/levels.js';
import { hud, nearSound } from './basicmath.js';

/* ------------------------------------------------------------
   LOGICA PURA — separata dal disegno perché è quella che i test
   possono controllare, ed è quella che, se sbagliata, insegna
   una cosa falsa.
   ------------------------------------------------------------ */

/** La divisione con resto scritta come la scriverebbe uno a mano: n = q·N + r. */
export function divisione(n, N) {
  const q = Math.floor(n / N);
  return { q, r: n - q * N };
}

/**
 * L'algoritmo di Euclide fatto a piastrelle: da un rettangolo a × b si
 * ritaglia il quadrato più grande possibile, e si ricomincia con quello che
 * avanza. L'ultimo quadrato ha per lato il MCD.
 *
 * Ritorna un taglio per volta (non un passo di divisione per volta) perché è
 * un taglio per volta che si può guardare: `{x, y, s}` in unità del
 * rettangolo di partenza, con l'origine in alto a sinistra.
 */
export function piastrelle(a, b) {
  const tagli = [];
  let x = 0, y = 0, w = a, hh = b;
  // il limite è una rete di sicurezza, non una regola: con interi positivi
  // Euclide finisce sempre, e in pochi passi
  for (let i = 0; i < 500 && w > 0 && hh > 0; i++) {
    const s = Math.min(w, hh);
    tagli.push({ x, y, s });
    if (w >= hh) { x += s; w -= s; } else { y += s; hh -= s; }
  }
  return tagli;
}

/** I numeri fra 2 e N−1 che possono fare da base: quelli senza fattori in comune con N. */
export function basiValide(N) {
  const out = [];
  for (let a = 2; a < N; a++) if (gcd(a, N) === 1) out.push(a);
  return out;
}

/* ------------------------------------------------------------
   Il quadrante, disegnato una volta sola: lo usano due giochi su
   tre, e devono essere lo stesso orologio.
   ------------------------------------------------------------ */
function quadrante(ctx, s, N, top, { evidenzia = [] } = {}) {
  const cx = s.w / 2;
  const aria = 12;   // il cruscotto scrive fin quasi al suo bordo: qui sotto ci vuole spazio
  const cy = top + aria + (s.h - top - aria) / 2;
  const R = Math.max(46, Math.min(s.w / 2 - 54, (s.h - top - aria) / 2 - 22));
  circle(ctx, cx, cy, R, { stroke: COL.axis, fill: '#0b1526' });
  const pos = i => {
    const ang = -Math.PI / 2 + (i / N) * TAU;
    return { x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) };
  };
  for (let i = 0; i < N; i++) {
    const p = pos(i);
    const acceso = evidenzia.includes(i);
    dot(ctx, p.x, p.y, acceso ? 5 : 3, acceso ? COL.amber : '#31446b', false);
    const et = pos(i);
    const fuori = 15;
    const ang = -Math.PI / 2 + (i / N) * TAU;
    text(ctx, String(i), et.x + fuori * Math.cos(ang), et.y + fuori * Math.sin(ang),
      { size: N > 16 ? 9.5 : 11, align: 'center', color: acceso ? COL.amber : '#6b7b9e' });
  }
  return { cx, cy, R, pos };
}

/* ------------------------------------------------------------
   1) L'OROLOGIO: che cos'è il RESTO
   Un numero grande, un orologio con poche ore: dove si ferma la
   lancetta? I giri si vedono, perché sono disegnati come giri.
   ------------------------------------------------------------ */
export function clockLab(host, opts = {}) {
  const cfg = Object.assign({ need: 3, onWin: null }, opts);
  const w = widget(host, {
    title: t("L'orologio dei numeri"),
    subtitle: t('conta oltre la fine del quadrante e guarda dove ti fermi'),
  });

  const st = { N: 7, n: 17, bersaglio: 3, trovati: new Set(), vinto: false };
  const near = nearSound();

  const stage = new Stage(w.body, {
    height: 320,
    draw(ctx, s) {
      bg(ctx, s);
      const { q, r } = divisione(st.n, st.N);
      const centrato = r === st.bersaglio;
      const top = hud(ctx, s, {
        goal: t('porta la lancetta sul :ora', { ora: st.bersaglio }),
        closeness: 1 - Math.min(1, Math.abs(r - st.bersaglio) / st.N),
        hit: centrato,
        sub: t('servono :totali numeri diversi — trovati: :fatti', { fatti: st.trovati.size, totali: cfg.need }),
      });

      const Q = quadrante(ctx, s, st.N, top, { evidenzia: [st.bersaglio] });

      /* La spirale: un giro di quadrante per ogni giro vero. È tutto il gioco
         — «17 mod 7» smette di essere una parola e diventa "due giri e tre
         passi". */
      const giri = Math.max(1, q + 1);
      const rIn = Q.R * 0.42, rOut = Q.R * 0.94;
      ctx.strokeStyle = centrato ? COL.green : COL.cyan;
      ctx.lineWidth = 2.2;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      for (let i = 0; i <= st.n * 12; i++) {
        const u = i / 12;
        const ang = -Math.PI / 2 + (u / st.N) * TAU;
        const rr = rIn + (rOut - rIn) * (giri === 1 ? 1 : Math.min(1, (u / st.N) / giri));
        const x = Q.cx + rr * Math.cos(ang), y = Q.cy + rr * Math.sin(ang);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      /* Il mozzo: una targhetta piena al centro. Senza, il numero grande finisce
         SOPRA i giri della spirale e non si legge più nessuno dei due — e il
         numero grande è proprio la cosa che il gioco deve far leggere. */
      const mw = Math.min(Q.R * 1.7, 150);
      roundRect(ctx, Q.cx - mw / 2, Q.cy - 26, mw, 50, 10, { fill: COL.bg, stroke: '#1b2740', alpha: 0.95 });

      // la lancetta, dal bordo del mozzo al punto di arrivo
      const p = Q.pos(r);
      const ang = -Math.PI / 2 + (r / st.N) * TAU;
      arrow(ctx, Q.cx + (rIn - 5) * Math.cos(ang), Q.cy + (rIn - 5) * Math.sin(ang), p.x, p.y,
        { color: centrato ? COL.green : COL.cyan, width: 2.6 });
      dot(ctx, p.x, p.y, 7, centrato ? COL.green : COL.cyan);
      st.px = p.x; st.py = p.y;   // i coriandoli scoppiano qui, non sulla targhetta

      // il conto, al centro: il numero grande e la sua traduzione in giri
      text(ctx, String(st.n), Q.cx, Q.cy - 12, { size: 26, align: 'center', color: COL.txtBright, weight: '800', max: mw - 12 });
      text(ctx, t(':giri giri + :resto', { giri: q, resto: r }), Q.cx, Q.cy + 14,
        { size: 12, align: 'center', color: COL.amber, max: mw - 12 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sN = choice({
    label: t('Quante ore ha il quadrante'),
    items: [7, 10, 12].map(v => ({ label: String(v), value: v })),
    value: st.N,
    onchange: v => { st.N = v; st.bersaglio = Math.min(st.bersaglio, v - 1); st.trovati.clear(); upd(); },
  });
  const sn = slider({
    label: t('Il numero da contare'), min: 0, max: 48, step: 1, value: st.n,
    fmt: v => String(v), oninput: v => { st.n = v; upd(); },
  });
  w.body.appendChild(controls(sN.root, sn.root));
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    {
      label: '🎯 ' + t('cambia bersaglio'), class: 'sm primary',
      onclick: () => { st.bersaglio = Math.floor(Math.random() * st.N); st.trovati.clear(); upd(); },
    },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function upd() {
    sn.value = st.n;
    const { q, r } = divisione(st.n, st.N);
    const centrato = r === st.bersaglio;
    if (centrato && !st.trovati.has(st.n)) {
      st.trovati.add(st.n);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.trovati.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else if (!centrato) {
      near(1 - Math.min(1, Math.abs(r - st.bersaglio) / st.N));
    }
    out.set(
      t('<b>:numero</b> diviso :ore fa :giri con il resto di <b>:resto</b>.', { numero: st.n, ore: st.N, giri: q, resto: r }) + '\n' +
      `${st.n} = ${q} × ${st.N} + ${r}   →   ${st.n} mod ${st.N} = ${r}` + '\n' +
      (centrato
        ? '<span class="g">✓ ' + t('sul bersaglio! Numeri diversi trovati: :fatti su :totali', { fatti: st.trovati.size, totali: cfg.need }) + '</span>'
        : t('Il bersaglio è <b>:ora</b>: cerca un numero che finisca lì. Ce ne sono infiniti, distanti :ore l\'uno dall\'altro.', { ora: st.bersaglio, ore: st.N })));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Da portarsi dietro:</b> «mod» non è un\'operazione strana, è <b>il resto della divisione</b>. E i numeri che finiscono nella stessa ora — 3, 10, 17, 24 con un quadrante da 7 — per l\'orologio sono <b>la stessa cosa</b>. Nel livello di Shor l\'orologio avrà N ore, con N il numero da fattorizzare.'));
  return { state: st };
}

/* ------------------------------------------------------------
   2) EUCLIDE A PIASTRELLE: il massimo comune divisore
   Un pavimento rettangolare, piastrelle quadrate, nessun taglio.
   Il MCD è il lato dell'ultima piastrella: non è una definizione
   da imparare, è quello che si vede alla fine.
   ------------------------------------------------------------ */
export function euclidLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('Il pavimento di Euclide'),
    subtitle: t('piastrelle quadrate, tutte uguali alla fine: quanto misura il lato?'),
    modo: 'classico',
  });

  const COPPIE = [[48, 18], [35, 15], [40, 24], [21, 13], [36, 27]];
  const st = { a: 48, b: 18, mostrati: 1, risolti: new Set(), vinto: false };

  const stage = new Stage(w.body, {
    height: 300,
    draw(ctx, s) {
      bg(ctx, s);
      const tagli = piastrelle(st.a, st.b);
      const finito = st.mostrati >= tagli.length;
      const mcd = gcd(st.a, st.b);
      const top = hud(ctx, s, {
        goal: t('copri :a × :b con quadrati', { a: st.a, b: st.b }),
        closeness: st.mostrati / tagli.length,
        hit: finito,
        sub: t('sempre il più grande che ci sta — risolti: :fatte su :totali', { fatte: st.risolti.size, totali: cfg.need }),
      });

      /* Il pavimento, in scala e CENTRATO nello spazio che resta. In fondo
         restano riservati 46 pixel: ci vanno la misura del lato lungo e la
         riga del risultato, che appoggiate al pavimento si sovrapponevano. */
      const padX = 22, sotto = 46;
      const dispW = s.w - padX * 2, dispH = s.h - top - 12 - sotto;
      const k = Math.min(dispW / st.a, dispH / st.b);
      const x0 = (s.w - st.a * k) / 2, y0 = top + 12 + (dispH - st.b * k) / 2;
      roundRect(ctx, x0, y0, st.a * k, st.b * k, 3, { stroke: '#3a4c73', width: 2 });

      for (let i = 0; i < Math.min(st.mostrati, tagli.length); i++) {
        const q = tagli[i];
        const ultimo = i === tagli.length - 1;
        roundRect(ctx, x0 + q.x * k, y0 + q.y * k, q.s * k, q.s * k, 2, {
          fill: ultimo && finito ? 'rgba(52,211,153,.4)' : hsl(i, tagli.length),
          stroke: ultimo && finito ? COL.green : 'rgba(255,255,255,.25)',
          width: ultimo && finito ? 3 : 1,
          alpha: ultimo && finito ? 1 : 0.5,
        });
        // i coriandoli scoppiano sull'ultimo quadrato POSATO, non al centro
        st.px = x0 + (q.x + q.s / 2) * k; st.py = y0 + (q.y + q.s / 2) * k;
        if (q.s * k > 22) {
          text(ctx, String(q.s), x0 + (q.x + q.s / 2) * k, y0 + (q.y + q.s / 2) * k,
            { size: Math.min(14, q.s * k / 2.4), align: 'center', color: COL.txtBright, max: q.s * k - 6 });
        }
      }

      text(ctx, `${st.a}`, x0 + st.a * k / 2, y0 + st.b * k + 14, { size: 11, align: 'center', color: '#7f8fb3' });
      text(ctx, `${st.b}`, x0 - 8, y0 + st.b * k / 2, { size: 11, align: 'right', color: '#7f8fb3' });
      if (finito) {
        text(ctx, t('ultimo quadrato: lato :lato = MCD(:a, :b)', { lato: mcd, a: st.a, b: st.b }),
          s.w / 2, s.h - 12, { size: 12.5, align: 'center', color: COL.green, max: s.w - 24 });
      } else {
        text(ctx, t('premi «taglia» e guarda cosa avanza'), s.w / 2, s.h - 12,
          { size: 11.5, align: 'center', color: '#7f8fb3', max: s.w - 24 });
      }
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '✂️ ' + t('taglia un quadrato'), class: 'sm primary', onclick: () => taglia(1) },
    { label: '⏭ ' + t('fino in fondo'), onclick: () => taglia(99) },
    { label: '↺ ' + t('ricomincia'), onclick: () => { st.mostrati = 1; upd(); } },
    {
      label: '🎲 ' + t('altra coppia'),
      onclick: () => {
        const c = COPPIE[Math.floor(Math.random() * COPPIE.length)];
        st.a = c[0]; st.b = c[1]; st.mostrati = 1; upd();
      },
    },
  ])));
  const out = readout('');
  w.body.appendChild(out.root);

  function taglia(quanti) {
    const tagli = piastrelle(st.a, st.b);
    st.mostrati = Math.min(tagli.length, st.mostrati + quanti);
    sfx.tick();
    upd();
  }

  function upd() {
    const tagli = piastrelle(st.a, st.b);
    const finito = st.mostrati >= tagli.length;
    const mcd = gcd(st.a, st.b);
    if (finito && !st.risolti.has(st.a + '×' + st.b)) {
      st.risolti.add(st.a + '×' + st.b);
      sfx.ok();
      fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.risolti.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    }
    const lati = tagli.slice(0, st.mostrati).map(q => q.s).join(' · ');
    out.set(
      t('Pavimento <b>:a × :b</b>. Quadrati posati finora (lato): :lati', { a: st.a, b: st.b, lati: lati || '—' }) + '\n' +
      (finito
        ? '<span class="g">✓ ' + t('L\'ultimo quadrato ha lato <b>:mcd</b>: è il righello più grande che misura per intero sia :a sia :b. Si chiama <b>massimo comune divisore</b>.', { mcd, a: st.a, b: st.b }) + '</span>'
        : t('Avanza sempre un rettangolo più piccolo: è per questo che il metodo finisce presto. Continua.')));
    stage.redraw();
  }
  upd();
  w.setFoot(t('<b>Perché ci servirà:</b> è l\'algoritmo di Euclide, di circa 2300 anni fa, e in Shor è <b>l\'ultimo passo</b>: trovato il periodo, i fattori del numero saltano fuori con due massimi comuni divisori. Su numeri da centinaia di cifre ci mette meno di un battito di ciglia — il collo di bottiglia è tutto altrove.'));
  return { state: st };
}

/* ------------------------------------------------------------
   3) IL RITMO CHE TORNA: il periodo di a^x mod N
   Si moltiplica sempre per lo stesso numero e si gira sul
   quadrante: prima o poi si ripassa dall'1, e la figura si
   chiude. Quel «prima o poi» è il periodo — la cosa che il
   computer quantistico cercherà.
   ------------------------------------------------------------ */
export function periodLab(host, opts = {}) {
  const cfg = Object.assign({ need: 2, onWin: null }, opts);
  const w = widget(host, {
    title: t('Il ritmo che torna'),
    subtitle: t('moltiplica sempre per lo stesso numero: quando ripassi dall\'1?'),
    modo: 'classico',
  });

  const st = { N: 15, a: 7, seq: [1], risolti: new Set(), vinto: false, esito: '' };

  const stage = new Stage(w.body, {
    height: 330,
    draw(ctx, s) {
      bg(ctx, s);
      const chiuso = st.seq.length > 1 && st.seq[st.seq.length - 1] === 1;
      const top = hud(ctx, s, {
        goal: t('torna sull\'1 premendo ×:a', { a: st.a }),
        closeness: Math.min(1, (st.seq.length - 1) / Math.max(2, periodOf(st.a, st.N) || 4)),
        hit: chiuso,
        sub: t('ritmi trovati: :fatti su :totali', { fatti: st.risolti.size, totali: cfg.need }),
      });

      const visitati = [...new Set(st.seq)];
      const Q = quadrante(ctx, s, st.N, top, { evidenzia: visitati });

      // le corde fra un passo e il successivo: la figura che si chiude
      for (let i = 1; i < st.seq.length; i++) {
        const p0 = Q.pos(st.seq[i - 1]), p1 = Q.pos(st.seq[i]);
        ctx.strokeStyle = chiuso ? COL.green : COL.violet;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.35 + 0.65 * (i / st.seq.length);
        ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
        ctx.globalAlpha = 1;
      }
      const ultimo = Q.pos(st.seq[st.seq.length - 1]);
      dot(ctx, ultimo.x, ultimo.y, 7, chiuso ? COL.green : COL.violet);
      st.px = ultimo.x; st.py = ultimo.y;

      /* Anche qui la targhetta: le corde passano dal centro, e senza uno sfondo
         la passeggiata scritta si legge sopra le righe del disegno. */
      const mw = Math.min(Q.R * 1.9, 210);
      roundRect(ctx, Q.cx - mw / 2, Q.cy - 24, mw, 46, 10, { fill: COL.bg, stroke: '#1b2740', alpha: 0.95 });
      text(ctx, st.seq.join(' → '), Q.cx, Q.cy - 8,
        { size: st.seq.length > 8 ? 11 : 13, align: 'center', color: COL.txtBright, max: mw - 12 });
      text(ctx, t('passi fatti: :quanti', { quanti: st.seq.length - 1 }), Q.cx, Q.cy + 14,
        { size: 11.5, align: 'center', color: chiuso ? COL.green : COL.amber, max: mw - 12 });
      fx.draw(ctx);
    },
  });
  const fx = new FX(stage);
  stage.pause();

  const sN = choice({
    label: t('Il quadrante (N)'),
    items: [9, 15, 21].map(v => ({ label: String(v), value: v })),
    value: st.N,
    onchange: v => { st.N = v; st.a = basiValide(v)[0]; rifaiScelte(); azzera(); },
  });
  const rigaA = h('div', { class: 'ctrl', style: { flex: '1 1 100%' } });
  w.body.appendChild(controls(sN.root, rigaA));

  let sa = null;
  function rifaiScelte() {
    rigaA.innerHTML = '';
    sa = choice({
      label: t('Il moltiplicatore (a)'),
      items: basiValide(st.N).slice(0, 6).map(v => ({ label: String(v), value: v })),
      value: st.a,
      onchange: v => { st.a = v; azzera(); },
    });
    rigaA.appendChild(sa.root);
  }
  rifaiScelte();

  const risposte = h('div', { class: 'btn-row', style: { marginTop: '8px' } });
  w.body.appendChild(h('div', { style: { marginTop: '8px' } }, buttons([
    { label: '× ' + t('moltiplica'), class: 'sm primary', onclick: passo },
    { label: '↺ ' + t('azzera'), onclick: azzera },
  ])));
  w.body.appendChild(risposte);
  const out = readout('');
  w.body.appendChild(out.root);

  function passo() {
    if (st.seq.length > 1 && st.seq[st.seq.length - 1] === 1) return;
    const x = (st.seq[st.seq.length - 1] * st.a) % st.N;
    st.seq.push(x);
    sfx.tick();
    upd();
  }
  function azzera() { st.seq = [1]; st.esito = ''; upd(); }

  function upd() {
    const chiuso = st.seq.length > 1 && st.seq[st.seq.length - 1] === 1;
    const vero = st.seq.length - 1;
    risposte.innerHTML = '';
    if (chiuso && !st.risolti.has(st.N + '^' + st.a)) {
      /* La figura si è chiusa: adesso si chiede il numero. Guardare non basta —
         dire quanti passi sono stati è il richiamo attivo che fa restare la
         parola «periodo» attaccata alla cosa. */
      const opzioni = [...new Set([vero, vero + 1, Math.max(2, vero - 1), vero + 2])].sort((x, y) => x - y);
      for (const o of opzioni) {
        risposte.appendChild(h('button', {
          class: 'btn sm', onclick: () => rispondi(o),
        }, t('il periodo è :n', { n: o })));
      }
    }
    out.set(
      t('Quadrante <b>:N</b>, moltiplicatore <b>:a</b>. Passeggiata: :seq', { N: st.N, a: st.a, seq: st.seq.join(' → ') }) + '\n' +
      (chiuso
        ? t('Sei tornato sull\'1 dopo <b>:quanti</b> passi. Quel numero si chiama <b>periodo</b> e si scrive r.', { quanti: vero })
        : t('Ogni passo è «moltiplica per :a e prendi il resto della divisione per :N». Continua finché non ricompare l\'1.', { a: st.a, N: st.N })) +
      (st.esito ? '\n' + st.esito : ''));
    stage.redraw();
  }

  function rispondi(n) {
    const vero = st.seq.length - 1;
    if (n === vero) {
      st.risolti.add(st.N + '^' + st.a);
      st.esito = '<span class="g">✓ ' + t('Esatto: r = :r. Prova ora un\'altra coppia (N, a): il ritmo cambia.', { r: vero }) + '</span>';
      sfx.ok(); fx.burst(st.px ?? stage.w / 2, st.py ?? stage.h / 2);
      if (st.risolti.size >= cfg.need && !st.vinto) { st.vinto = true; fx.flash(); cfg.onWin && cfg.onWin(); }
    } else {
      st.esito = '<span class="a">✗ ' + t('No: conta i passi disegnati, l\'1 di partenza non si conta.') + '</span>';
      sfx.err();
    }
    upd();
  }

  upd();
  /* Il numero del livello di Shor NON si scrive a mano: si chiede a levels.js.
     Basta un livello nuovo inserito prima e la frase manderebbe lo studente
     sul livello sbagliato — è già successo al glossario. */
  w.setFoot(t('<b>Qui c\'è tutto Shor:</b> fattorizzare un numero N si riduce a trovare questo ritmo r. Su un quadrante da 15 lo si vede a occhio; su un N da 600 cifre nemmeno tutti i computer del mondo messi insieme ci arrivano, perché i passi da provare sono troppi. Il computer quantistico non prova i passi uno per uno: li fa <b>tutti insieme</b> e poi usa la trasformata di Fourier per far emergere il ritmo. È il livello :n.', { n: nOf('20-shor') }));
  return { state: st };
}
