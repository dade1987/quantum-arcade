/* ============================================================
   PROGRESSO DEL GIOCATORE (localStorage)

   Il modello di avanzamento è basato su ricerca didattica:
   · mastery learning (Bloom): si passa avanti quando si è dimostrata
     la padronanza, con tentativi illimitati e senza penalità;
   · retrieval practice / testing effect (Roediger & Karpicke): il quiz
     non serve a "dare il voto" ma a consolidare la memoria;
   · distributed practice + Leitner: le domande già viste tornano a
     distanza crescente nel "Ripasso lampo" della home.
   ============================================================ */

import { TOTAL_XP, rankFor, LEVELS, levelById } from './levels.js';
import { sfx } from './audio.js';

const KEY = 'quantum-arcade:v2';
const DAY = 24 * 3600 * 1000;
/* Ritardi del metodo Leitner, indicizzati per scatola (1…5).
   Scatola 1 = "non l'ho ancora capita": torna subito, nella stessa sessione. */
const BOX_DELAY = [0, 0, 1 * DAY, 3 * DAY, 7 * DAY, 21 * DAY];

const DEFAULT = { xp: 0, lessons: {}, missions: {}, quiz: {}, seen: {}, bank: {}, free: false };

let state = load();
const subs = new Set();

/**
 * Trasforma il contenuto salvato nel browser in uno stato valido.
 * Se il dato è assente, illeggibile o manomesso si riparte da zero:
 * meglio perdere i progressi locali che rompere il gioco.
 * Esportata perché è la parte con più casi limite, e va collaudata da sola.
 */
export function parseState(raw) {
  try {
    if (!raw) return structuredClone(DEFAULT);
    const letto = JSON.parse(raw);
    if (!letto || typeof letto !== 'object' || Array.isArray(letto)) return structuredClone(DEFAULT);
    return Object.assign(structuredClone(DEFAULT), letto);
  } catch {
    return structuredClone(DEFAULT);
  }
}

function load() {
  try { return parseState(localStorage.getItem(KEY)); }
  catch { return structuredClone(DEFAULT); }
}
let pushHook = null;
/** account.js registra qui la funzione che salva sul server. */
export function onSave(fn) { pushHook = fn; }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* modalità privata */ }
  subs.forEach(fn => fn(state));
  pushHook && pushHook();
}

/** Sostituisce lo stato locale con quello arrivato dal server. */
export function importState(serverState, serverXp = 0) {
  state = Object.assign(structuredClone(DEFAULT), serverState || {});
  state.xp = Math.max(state.xp || 0, serverXp || 0);
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { }
  subs.forEach(fn => fn(state));
}

export function getState() { return state; }
export function subscribe(fn) { subs.add(fn); fn(state); return () => subs.delete(fn); }
export function xp() { return state.xp; }
export function totalXp() { return TOTAL_XP; }
export function rank() { return rankFor(state.xp); }

/** XP assegnati una sola volta per chiave. */
export function award(key, amount, label) {
  if (state.seen[key]) return false;
  state.seen[key] = true;
  state.xp += amount;
  save();
  sfx.xp();
  toast(`+${amount} XP${label ? ' · ' + label : ''}`);
  return true;
}

/* ---------------- livelli e padronanza ---------------- */

export function isLessonDone(id) { return !!(state.lessons[id] && state.lessons[id].mastered); }
export const isMastered = isLessonDone;

export function completeLesson(id) {
  const lv = levelById(id);
  if (!lv || isLessonDone(id)) return false;
  state.lessons[id] = { at: Date.now(), mastered: true };
  save();
  award('lesson:' + id, lv.xp, 'livello superato');
  return true;
}

/** Il livello è accessibile? (sempre sì in modalità libera o se non ha prerequisiti) */
export function isUnlocked(id) {
  if (state.free) return true;
  const lv = levelById(id);
  if (!lv || !lv.req) return true;
  return isLessonDone(lv.req);
}

export const freeMode = () => state.free;
export function setFreeMode(v) { state.free = !!v; save(); }

/* ---------------- missioni ---------------- */

export function setMission(lessonId, key, ok = true) {
  const k = lessonId + '/' + key;
  if (ok && !state.missions[k]) { state.missions[k] = Date.now(); save(); return true; }
  return false;
}
export function missionDone(lessonId, key) { return !!state.missions[lessonId + '/' + key]; }

/* ---------------- quiz + ripasso spaziato ---------------- */

/**
 * Registra la risposta a una domanda.
 * La domanda entra nel "mazzo di ripasso" con il metodo Leitner:
 * risposta esatta → scatola successiva (rivedrai la domanda più avanti nel tempo),
 * risposta sbagliata → torna alla scatola 1 (la rivedrai presto).
 */
export function recordQuiz(lessonId, qIndex, correct, meta = null) {
  const k = lessonId + '/' + qIndex;
  const prev = state.quiz[k];
  if (prev === undefined) state.quiz[k] = { ok: !!correct, first: !!correct, tries: 1 };
  else { prev.ok = prev.ok || !!correct; prev.tries++; }

  if (meta) {
    const b = state.bank[k] || { box: 1, lesson: lessonId, qi: qIndex };
    b.q = meta.q; b.options = meta.options; b.correct = meta.correct; b.why = meta.why;
    b.box = correct ? Math.min(5, (b.box || 1) + 1) : 1;
    b.due = Date.now() + BOX_DELAY[b.box];
    b.last = Date.now();
    state.bank[k] = b;
  }
  save();
}
export function quizOk(lessonId, qIndex) { const v = state.quiz[lessonId + '/' + qIndex]; return v ? v.ok : undefined; }
export function quizAnswered(lessonId, qIndex) { return state.quiz[lessonId + '/' + qIndex] !== undefined ? (state.quiz[lessonId + '/' + qIndex].ok) : undefined; }

/** Domande "in scadenza" per il ripasso (interleaving fra livelli diversi). */
export function dueQuestions(limit = 5) {
  const now = Date.now();
  return Object.entries(state.bank)
    .filter(([, b]) => b.q && (b.due || 0) <= now)
    .sort((a, b2) => (a[1].box - b2[1].box) || (a[1].due - b2[1].due))
    .slice(0, limit)
    .map(([k, b]) => ({ key: k, ...b }));
}
export function reviewAnswer(key, correct) {
  const b = state.bank[key];
  if (!b) return;
  b.box = correct ? Math.min(5, b.box + 1) : 1;
  b.due = Date.now() + BOX_DELAY[b.box];
  b.last = Date.now();
  if (correct) { state.xp += 5; }
  save();
}
export const bankSize = () => Object.keys(state.bank).length;

export function resetAll() { state = structuredClone(DEFAULT); save(); }

/* ---------------- toast ---------------- */

let toastEl = null, toastTimer = null;
export function toast(msg) {
  if (typeof document === 'undefined') return;
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  requestAnimationFrame(() => toastEl.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

/* ---------------- barra XP ---------------- */

export function mountXpBar(host) {
  if (!host) return;
  host.innerHTML = `
    <div class="xp-wrap">
      <span class="xp-label" data-rank></span>
      <div class="xp-bar" role="progressbar" aria-label="Punti esperienza"><div class="xp-fill" data-fill></div></div>
      <span class="xp-label" data-xp></span>
    </div>`;
  const fill = host.querySelector('[data-fill]');
  const lab = host.querySelector('[data-xp]');
  const rk = host.querySelector('[data-rank]');
  subscribe(s => {
    const pct = Math.min(100, (s.xp / TOTAL_XP) * 100);
    fill.style.width = pct.toFixed(1) + '%';
    lab.textContent = `${s.xp} XP`;
    rk.textContent = rankFor(s.xp).name;
  });
}
