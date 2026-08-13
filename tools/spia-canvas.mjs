/* ============================================================================
   LA SPIA SUL DISEGNO — condivisa fra l'audit e il collaudo end-to-end

   Le due funzioni qui dentro vengono serializzate e iniettate dentro la
   pagina, quindi non possono usare niente che stia fuori da loro stesse: si
   leggono come se fossero scritte dentro il browser, perché è lì che girano.

   Stanno in un file solo perché l'audit a mano (tools/audit-canvas-text.mjs) e
   il test automatico (tests/js/e2e/07-canvas.spec.js) devono misurare le
   stesse cose: se divergono, il test passa mentre l'audit trova difetti, e non
   si capisce più a chi credere.
   ============================================================================ */

/** Spia sul disegno: registra scritte, rettangoli pieni e linee tracciate,
    nell'ordine in cui vengono disegnati (l'ordine conta: ciò che viene dopo
    copre ciò che viene prima). */
export const SPIA = () => {
  window.__disegni = [];
  const P = CanvasRenderingContext2D.prototype;

  /* Il motore pulisce la tela all'inizio di ogni fotogramma: la uso come
     confine. Senza, si confrontano scritte di istanti diversi e lo sfondo del
     fotogramma dopo sembra "coprire" il testo di quello prima. */
  const clearRect = P.clearRect;
  P.clearRect = function () {
    try { this.canvas.__frame = (this.canvas.__frame || 0) + 1; } catch { }
    return clearRect.apply(this, arguments);
  };
  const tela = c => ({
    id: c.canvas.__spiaId,
    frame: c.canvas.__frame || 0,
    tela: c.canvas.width / (c.getTransform().a || 1),
    telaAltezza: c.canvas.height / (c.getTransform().d || 1),
  });

  for (const metodo of ['fillText', 'strokeText']) {
    const originale = P[metodo];
    P[metodo] = function (testo, x, y) {
      try {
        window.__disegni.push({
          tipo: 'testo', testo: String(testo), x, y,
          larghezza: this.measureText(testo).width,
          corpo: parseFloat(/(\d+(\.\d+)?)px/.exec(this.font)?.[1]) || 12,
          allinea: this.textAlign, base: this.textBaseline, ...tela(this),
        });
      } catch { /* una scritta non registrata non deve rompere il gioco */ }
      return originale.apply(this, arguments);
    };
  }

  const fillRect = P.fillRect;
  P.fillRect = function (x, y, w, h) {
    try {
      const s = String(this.fillStyle);
      // i riempimenti trasparenti non coprono niente
      const trasparente = /rgba\([^)]*,\s*0?\.\d\)/.test(s) && parseFloat(s.split(',').pop()) < 0.5;
      if (!trasparente && this.globalAlpha > 0.5) {
        window.__disegni.push({ tipo: 'rett', x, y, w, h, colore: s.slice(0, 24), ...tela(this) });
      }
    } catch { }
    return fillRect.apply(this, arguments);
  };

  // le linee: raccolgo i punti del percorso e li registro quando viene tracciato
  const beginPath = P.beginPath, moveTo = P.moveTo, lineTo = P.lineTo, stroke = P.stroke, arcTo = P.arcTo, fill = P.fill;
  P.beginPath = function () { this.__punti = []; return beginPath.apply(this, arguments); };
  P.moveTo = function (x, y) { (this.__punti = this.__punti || []).push([x, y]); return moveTo.apply(this, arguments); };
  P.lineTo = function (x, y) { (this.__punti = this.__punti || []).push([x, y]); return lineTo.apply(this, arguments); };
  P.arcTo = function (x1, y1, x2, y2) {
    (this.__punti = this.__punti || []).push([x1, y1], [x2, y2]);
    return arcTo.apply(this, arguments);
  };
  /* Un riempimento di percorso — per esempio il fondino dietro una scritta,
     che roundRect disegna con arcTo — copre ciò che sta sotto esattamente come
     un fillRect. Senza registrarlo, una linea nascosta dal fondino sembrerebbe
     ancora barrare la scritta. */
  P.fill = function () {
    try {
      const p = this.__punti || [];
      const st = String(this.fillStyle);
      const trasp = /rgba\([^)]*,\s*0?\.\d+\)/.test(st) && parseFloat(st.split(',').pop()) < 0.5;
      if (p.length >= 2 && this.globalAlpha > 0.5 && !trasp) {
        const xs = p.map(q => q[0]), ys = p.map(q => q[1]);
        const x = Math.min(...xs), y = Math.min(...ys);
        window.__disegni.push({ tipo: 'rett', x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y, colore: String(this.fillStyle).slice(0, 24), ...tela(this) });
      }
    } catch { }
    return fill.apply(this, arguments);
  };

  P.stroke = function () {
    try {
      const p = this.__punti || [];
      if (p.length >= 2 && this.globalAlpha > 0.5) {
        for (let i = 1; i < p.length && i < 40; i++) {
          window.__disegni.push({
            tipo: 'linea', x1: p[i - 1][0], y1: p[i - 1][1], x2: p[i][0], y2: p[i][1],
            spessore: this.lineWidth, tratteggio: (this.getLineDash() || []).length > 0, ...tela(this),
          });
        }
      }
    } catch { }
    return stroke.apply(this, arguments);
  };
};

/** Dai disegni registrati ai difetti. */
export const ANALIZZA = (soloTela) => {
  let dis = window.__disegni.filter(d => soloTela === undefined || d.id === soloTela);
  // un fotogramma solo: l'ultimo completo (l'ultimissimo può essere a metà)
  const frames = [...new Set(dis.map(d => d.frame))].sort((a, b) => a - b);
  if (frames.length) {
    const scelto = frames.length > 1 ? frames[frames.length - 2] : frames[0];
    dis = dis.filter(d => d.frame === scelto);
  }
  const scatola = s => {
    let sinistra = s.x;
    if (s.allinea === 'center') sinistra = s.x - s.larghezza / 2;
    else if (s.allinea === 'right' || s.allinea === 'end') sinistra = s.x - s.larghezza;
    let alto = s.y - s.corpo * 0.8, basso = s.y + s.corpo * 0.25;
    if (s.base === 'middle') { alto = s.y - s.corpo * 0.55; basso = s.y + s.corpo * 0.55; }
    else if (s.base === 'top') { alto = s.y; basso = s.y + s.corpo * 1.1; }
    return { ...s, sinistra, destra: sinistra + s.larghezza, alto, basso };
  };
  const testi = dis.map((d, i) => ({ ...d, ordine: i })).filter(d => d.tipo === 'testo' && String(d.testo).trim()).map(scatola);

  /* Fuori dalla tela, in tutte e quattro le direzioni.

     Sopra e sotto contano quanto destra e sinistra, e sono anzi il difetto più
     frequente: la scena viene disegnata a distanze fisse dall'alto, ma
     l'altezza della tela si accorcia da sola quando la finestra è bassa (vedi
     Stage.resize). Quello che avanza non sborda: viene tagliato via, e chi
     gioca vede mezza riga di bit e non sa che sotto ce n'era un'altra. */
  const fuori = [];
  for (const s of testi) {
    if (s.destra > s.tela + 1.5) fuori.push({ testo: s.testo, oltre: Math.round(s.destra - s.tela), lato: 'destra', tela: Math.round(s.tela) });
    else if (s.sinistra < -1.5) fuori.push({ testo: s.testo, oltre: Math.round(-s.sinistra), lato: 'sinistra', tela: Math.round(s.tela) });
    if (s.basso > s.telaAltezza + 1.5) fuori.push({ testo: s.testo, oltre: Math.round(s.basso - s.telaAltezza), lato: 'sotto', tela: Math.round(s.telaAltezza) });
    else if (s.alto < -1.5) fuori.push({ testo: s.testo, oltre: Math.round(-s.alto), lato: 'sopra', tela: Math.round(s.telaAltezza) });
  }

  /* Anche i riquadri tagliati contano: la casella di un bit mezza fuori dalla
     tela non ha scritte dentro che sporgano — il numero sta al centro — ma
     resta un riquadro monco. Si guardano solo i rettangoli grandi abbastanza
     da essere un elemento della scena, non i puntini. */
  const tagliati = [];
  for (const r of dis.filter(d => d.tipo === 'rett')) {
    const ry = Math.min(r.y, r.y + r.h), rY = Math.max(r.y, r.y + r.h);
    if (rY - ry < 12 || Math.abs(r.w) < 12) continue;
    if (rY > r.telaAltezza + 1.5) tagliati.push({ y: Math.round(ry), oltre: Math.round(rY - r.telaAltezza), tela: Math.round(r.telaAltezza) });
    if (tagliati.length > 4) break;
  }

  const sovrapposte = [];
  for (let i = 0; i < testi.length && sovrapposte.length <= 8; i++) {
    for (let j = i + 1; j < testi.length; j++) {
      const a = testi[i], c = testi[j];
      const ox = Math.min(a.destra, c.destra) - Math.max(a.sinistra, c.sinistra);
      const oy = Math.min(a.basso, c.basso) - Math.max(a.alto, c.alto);
      if (ox > 3 && oy > 3) { sovrapposte.push({ a: a.testo, b: c.testo, px: Math.round(ox) }); break; }
    }
  }

  // una barra piena disegnata DOPO una scritta la copre
  const coperte = [];
  for (const r of dis.map((d, i) => ({ ...d, ordine: i })).filter(d => d.tipo === 'rett')) {
    const rx = Math.min(r.x, r.x + r.w), rX = Math.max(r.x, r.x + r.w);
    const ry = Math.min(r.y, r.y + r.h), rY = Math.max(r.y, r.y + r.h);
    if ((rX - rx) < 6 || (rY - ry) < 6) continue;
    for (const t of testi) {
      if (t.ordine > r.ordine) continue;                 // la scritta è sopra: nessun problema
      const ox = Math.min(t.destra, rX) - Math.max(t.sinistra, rx);
      const oy = Math.min(t.basso, rY) - Math.max(t.alto, ry);
      if (ox > 8 && oy > t.corpo * 0.5) {
        coperte.push({ testo: t.testo.slice(0, 34), da: 'barra ' + (r.colore || ''), px: Math.round(ox) });
        break;
      }
    }
    if (coperte.length > 6) break;
  }

  // una linea (spesso un tratteggio) che passa in mezzo a una scritta
  const barrate = [];
  const fondini = dis.map((d, i) => ({ ...d, ordine: i })).filter(d => d.tipo === 'rett');
  const protetta = (t, l) => fondini.some(f => {
    if (f.ordine < l.ordine || f.ordine > t.ordine) return false;
    const fx = Math.min(f.x, f.x + f.w), fX = Math.max(f.x, f.x + f.w);
    const fy = Math.min(f.y, f.y + f.h), fY = Math.max(f.y, f.y + f.h);
    return fx <= t.sinistra + 2 && fX >= t.destra - 2 && fy <= t.alto + 2 && fY >= t.basso - 2;
  });
  /* Quanta parte della scritta attraversa davvero il segmento.
     Prendere il rettangolo di ingombro del segmento sarebbe sbagliato: una
     diagonale che passa lontano dalla scritta ha comunque un ingombro che la
     contiene, e verrebbe segnalata a torto. Si campiona il segmento e si
     guarda quanto di esso cade dentro la scatola del testo. */
  const attraversa = (t, l) => {
    const passi = 48;
    let dentro = 0, primo = null, ultimo = null;
    for (let i = 0; i <= passi; i++) {
      const x = l.x1 + (l.x2 - l.x1) * (i / passi);
      const y = l.y1 + (l.y2 - l.y1) * (i / passi);
      if (x >= t.sinistra && x <= t.destra && y >= t.alto - l.spessore && y <= t.basso + l.spessore) {
        dentro++;
        if (primo === null) primo = x;
        ultimo = x;
      }
    }
    return dentro ? Math.abs(ultimo - primo) : 0;
  };

  for (const l of dis.map((d, i) => ({ ...d, ordine: i })).filter(d => d.tipo === 'linea')) {
    for (const t of testi) {
      if (t.ordine > l.ordine) continue;
      const ox = attraversa(t, l);
      // deve attraversare la scritta, non sfiorarla: almeno metà larghezza
      if (ox > Math.max(12, t.larghezza * 0.5) && !protetta(t, l)) {
        // le coordinate della riga servono a ritrovarla nel codice del widget
        barrate.push({
          testo: t.testo.slice(0, 34), tratteggio: !!l.tratteggio, px: Math.round(ox),
          riga: [l.x1, l.y1, l.x2, l.y2].map(Math.round).join(','),
          scritta: [Math.round(t.sinistra), Math.round(t.alto), Math.round(t.destra), Math.round(t.basso)].join(','),
        });
        break;
      }
    }
    if (barrate.length > 6) break;
  }

  /* Le scritte tagliate coi puntini. `text()` prima rimpicciolisce e poi, se
     ancora non ci sta, tronca: il taglio è silenzioso, e in mezzo al disegno
     nessuno se ne accorge finché non legge «un accor…» al posto di «un accordo
     preso prima». Le scritte lunghe una riga intera non contano: lì il taglio
     è il male minore e il testo per esteso sta comunque sotto la tela. */
  const troncate = [...new Set(testi.filter(s => /…$/.test(s.testo) && s.larghezza < s.tela * 0.5).map(s => s.testo))];

  const minuscole = [...new Set(testi.filter(s => s.corpo < 10).map(s => `${s.testo.slice(0, 16)} (${s.corpo}px)`))];
  return { fuori, tagliati, sovrapposte, coperte, barrate, troncate, minuscole, disegni: dis.length };
};
