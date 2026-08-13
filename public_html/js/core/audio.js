/* ============================================================
   MOTORE AUDIO ARCADE — tutto sintetizzato con WebAudio,
   nessun file da scaricare, funziona anche offline.

   Criteri di design (letteratura su feedback multimodale e
   principio di coerenza di Mayer):
   · suoni BREVI (< 350 ms) e non invadenti;
   · un timbro DIVERSO per ogni tipo di evento, sempre lo stesso
     per lo stesso evento → diventa informazione, non decorazione;
   · l'errore non "punisce" (niente buzzer aggressivo): informa;
   · nessuna musica di sottofondo, che ruberebbe attenzione;
   · si può spegnere tutto, e la scelta viene ricordata.
   ============================================================ */

import { t } from './i18n.js';

const KEY = 'quantum-arcade:sound';
let ctx = null, master = null;
let muted = (() => { try { return localStorage.getItem(KEY) === 'off'; } catch { return false; } })();

function ac() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function isMuted() { return muted; }
export function setMuted(v) {
  muted = !!v;
  try { localStorage.setItem(KEY, muted ? 'off' : 'on'); } catch { }
  if (master) master.gain.value = muted ? 0 : 0.5;
  return muted;
}
export function toggleMuted() { return setMuted(!muted); }

/** Nota singola con inviluppo. */
function tone({ f = 440, f2 = null, type = 'sine', dur = 0.12, vol = 0.25, delay = 0, attack = 0.006 }) {
  if (muted) return;
  const a = ac(), t0 = a.currentTime + delay;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t0);
  if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(master);
  o.start(t0); o.stop(t0 + dur + 0.02);
}

/** Rumore filtrato: per i "click" secchi e il collasso della misura. */
function noise({ dur = 0.12, vol = 0.15, freq = 1200, q = 1, delay = 0, sweepTo = null }) {
  if (muted) return;
  const a = ac(), t0 = a.currentTime + delay;
  const n = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, n, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = a.createBufferSource(); src.buffer = buf;
  const f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.setValueAtTime(freq, t0); f.Q.value = q;
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(Math.max(60, sweepTo), t0 + dur);
  const g = a.createGain(); g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f); f.connect(g); g.connect(master);
  src.start(t0); src.stop(t0 + dur);
}

const NOTE = { C: 261.63, D: 293.66, E: 329.63, G: 392.0, A: 440.0, C2: 523.25, E2: 659.25, G2: 783.99, C3: 1046.5 };

/* ---------------- la libreria di effetti ---------------- */

export const sfx = {
  /** click generico su un bottone */
  click() { tone({ f: 620, f2: 520, type: 'square', dur: 0.045, vol: 0.06 }); },

  /** cursore mosso (molto discreto, si può ripetere spesso) */
  tick() { tone({ f: 1400, type: 'sine', dur: 0.02, vol: 0.025 }); },

  /** risposta giusta / obiettivo raggiunto */
  ok() {
    tone({ f: NOTE.E2, type: 'triangle', dur: 0.11, vol: 0.2 });
    tone({ f: NOTE.G2, type: 'triangle', dur: 0.14, vol: 0.18, delay: 0.07 });
  },

  /** risposta sbagliata: informa, non sgrida */
  err() {
    tone({ f: 320, f2: 240, type: 'sine', dur: 0.16, vol: 0.16 });
    tone({ f: 240, f2: 200, type: 'sine', dur: 0.18, vol: 0.10, delay: 0.05 });
  },

  /** XP guadagnati: monetina arcade */
  xp() {
    tone({ f: NOTE.C3, type: 'square', dur: 0.05, vol: 0.10 });
    tone({ f: NOTE.G2 * 2, type: 'square', dur: 0.09, vol: 0.09, delay: 0.05 });
  },

  /** missione completata: arpeggio breve */
  mission() {
    [NOTE.C2, NOTE.E2, NOTE.G2].forEach((f, i) => tone({ f, type: 'triangle', dur: 0.12, vol: 0.16, delay: i * 0.06 }));
  },

  /** livello superato / prossimo sbloccato: fanfara */
  levelUp() {
    [NOTE.C2, NOTE.E2, NOTE.G2, NOTE.C3].forEach((f, i) => tone({ f, type: 'triangle', dur: 0.2, vol: 0.2, delay: i * 0.09 }));
    noise({ dur: 0.35, vol: 0.05, freq: 3000, sweepTo: 800, delay: 0.1 });
  },

  /** misura quantistica: il collasso — rumore che precipita su una nota netta */
  measure(bit = 0) {
    noise({ dur: 0.14, vol: 0.12, freq: 3200, sweepTo: 400, q: 0.8 });
    tone({ f: bit ? 330 : 494, type: 'sine', dur: 0.16, vol: 0.18, delay: 0.09 });
  },

  /** porta applicata a un qubit */
  gate() { tone({ f: 880, f2: 990, type: 'triangle', dur: 0.06, vol: 0.09 }); },

  /** interferenza distruttiva: due note che si annullano in un soffio */
  cancel() {
    tone({ f: 500, type: 'sine', dur: 0.18, vol: 0.14 });
    tone({ f: 502, type: 'sine', dur: 0.18, vol: 0.14 });
    noise({ dur: 0.2, vol: 0.06, freq: 700, sweepTo: 150, delay: 0.1 });
  },

  /** interferenza costruttiva: le due note si sommano e crescono */
  boost() {
    tone({ f: 440, f2: 660, type: 'triangle', dur: 0.22, vol: 0.16 });
    tone({ f: 660, f2: 880, type: 'sine', dur: 0.22, vol: 0.12, delay: 0.04 });
  },

  /** boss / esame superato */
  boss() {
    [NOTE.C2, NOTE.G2, NOTE.E2, NOTE.C3, NOTE.G2 * 2].forEach((f, i) =>
      tone({ f, type: 'sawtooth', dur: 0.26, vol: 0.14, delay: i * 0.12 }));
  },

  /** feedback continuo di "quanto sei vicino": più sei vicino, più il tono è alto */
  near(closeness) {
    const c = Math.max(0, Math.min(1, closeness));
    tone({ f: 300 + c * c * 900, type: 'sine', dur: 0.05, vol: 0.03 + c * 0.05 });
  },

  /** qualcosa si è sbloccato */
  unlock() {
    tone({ f: NOTE.G2, type: 'sine', dur: 0.14, vol: 0.15 });
    tone({ f: NOTE.C3, type: 'sine', dur: 0.22, vol: 0.15, delay: 0.1 });
  },
};

/* ---------------- suoni "didattici" (le frequenze vere) ---------------- */

/** Accordo di componenti [{freq, amp}] — serve nei livelli sulle onde. */
export function playTones(comps, dur = 1.1) {
  if (muted) return;
  const a = ac();
  const bus = a.createGain(); bus.connect(master);
  const total = comps.reduce((s, c) => s + Math.abs(c.amp), 0) || 1;
  bus.gain.setValueAtTime(0, a.currentTime);
  bus.gain.linearRampToValueAtTime(0.5, a.currentTime + 0.03);
  bus.gain.setValueAtTime(0.5, a.currentTime + dur - 0.12);
  bus.gain.linearRampToValueAtTime(0, a.currentTime + dur);
  for (const c of comps) {
    if (!c.freq || Math.abs(c.amp) < 1e-3) continue;
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = c.freq;
    g.gain.value = Math.abs(c.amp) / total;
    o.connect(g); g.connect(bus);
    o.start(); o.stop(a.currentTime + dur);
  }
}
export const playTone = (freq, dur = 1.0) => playTones([{ freq, amp: 1 }], dur);

/** Retrocompatibilità: usato dai widget già scritti. */
export const blip = (ok = true) => (ok ? sfx.ok() : sfx.err());

/* ---------------- collegamento automatico all'interfaccia ---------------- */

let wired = false;
/** Aggiunge i suoni a bottoni e cursori di tutta la pagina + il tasto di mute. */
export function wireSounds() {
  if (wired || typeof document === 'undefined') return;
  wired = true;

  document.addEventListener('pointerdown', e => {
    const b = e.target.closest('button, .btn');
    if (!b || b.disabled) return;
    if (b.classList.contains('quiz-opt')) return;      // gestito da lesson.js con ok/err
    sfx.click();
  }, { passive: true });

  let lastTick = 0;
  document.addEventListener('input', e => {
    if (e.target.type !== 'range') return;
    const now = performance.now();
    if (now - lastTick > 55) { lastTick = now; sfx.tick(); }
  }, { passive: true });
}

/** Bottone di accensione/spegnimento audio da mettere nella topbar. */
export function soundButton() {
  const b = document.createElement('button');
  b.className = 'btn sm ghost';
  b.title = t('Attiva/disattiva i suoni');
  b.setAttribute('aria-label', t('Attiva o disattiva i suoni'));
  const paint = () => { b.textContent = muted ? '🔇' : '🔊'; };
  paint();
  b.addEventListener('click', () => { setMuted(!muted); paint(); if (!muted) sfx.unlock(); });
  return b;
}
