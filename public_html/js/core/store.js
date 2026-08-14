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

import { TOTAL_XP, XP_CORSO, rankFor, nextRank, LEVELS, levelById, isMain } from './levels.js';
import { sfx } from './audio.js';
import { t } from './i18n.js';

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

/**
 * Unisce lo stato arrivato dal server con quello che c'è già qui.
 *
 * UNISCE, non sostituisce, e la differenza è tutto. Prima questa funzione
 * rimpiazzava lo stato locale con quello del server, e siccome il salvataggio
 * parte con un secondo di ritardo, chi superava un livello e cliccava subito
 * «vai al livello successivo» partiva più veloce del salvataggio: la pagina
 * nuova rileggeva dal server uno stato ancora vecchio e ci scriveva sopra
 * quello giusto. Il livello appena superato tornava da fare e il livello dopo
 * restava chiuso — con gli XP che facevano un passo indietro.
 *
 * Le regole sono le stesse che applica il server in PlayerState::mergeState,
 * e valgono in entrambi i versi: gli XP sono il massimo, le voci si sommano,
 * del mazzo di ripasso si tiene la scatola più bassa (cioè la domanda meno
 * consolidata: nel dubbio la si rivede prima). Così unire due volte dà lo
 * stesso risultato di unire una volta sola, e nessuno dei due lati può
 * cancellare il lavoro dell'altro — nemmeno giocando su due dispositivi.
 *
 * Restituisce true se qui c'era qualcosa che il server non aveva: chi chiama
 * lo usa per rimandarglielo subito, invece di aspettare il prossimo punto.
 */
export function importState(serverState, serverXp = 0) {
  const locale = state;
  const remoto = Object.assign(structuredClone(DEFAULT), serverState || {});
  const unito = structuredClone(DEFAULT);
  let daRimandare = false;

  for (const chiave of ['lessons', 'missions', 'quiz', 'seen']) {
    unito[chiave] = Object.assign({}, remoto[chiave], locale[chiave]);
    for (const k of Object.keys(locale[chiave] || {})) if (!(k in (remoto[chiave] || {}))) daRimandare = true;
  }

  unito.bank = Object.assign({}, remoto.bank);
  for (const [k, carta] of Object.entries(locale.bank || {})) {
    const gia = unito.bank[k];
    if (!gia || (carta.box || 1) < (gia.box || 1)) { unito.bank[k] = carta; daRimandare = true; }
  }

  unito.xp = Math.max(locale.xp || 0, remoto.xp || 0, serverXp || 0);
  unito.free = !!(locale.free || remoto.free);
  if (unito.xp > Math.max(remoto.xp || 0, serverXp || 0)) daRimandare = true;

  state = unito;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { }
  subs.forEach(fn => fn(state));
  return daRimandare;
}

export function getState() { return state; }
export function subscribe(fn) { subs.add(fn); fn(state); return () => subs.delete(fn); }
export function xp() { return state.xp; }
export function totalXp() { return TOTAL_XP; }

/**
 * Quanta parte del CORSO è superata, da 0 a 1.
 *
 * Si contano gli XP dei livelli del percorso principale già padroneggiati,
 * sul totale degli XP del percorso principale. Non gli XP guadagnati: quelli
 * salgono anche ripassando, e un punteggio che sale ripassando è giusto (è il
 * ripasso spaziato che va premiato) ma non è un avanzamento — se comandasse
 * lui, la barra arriverebbe in fondo senza che il corso sia finito.
 */
function progressoDi(s) {
  if (!XP_CORSO) return 0;
  const fatti = LEVELS.reduce((tot, l) => tot + (isMain(l) && s.lessons[l.id]?.mastered ? l.xp : 0), 0);
  return Math.min(1, fatti / XP_CORSO);
}
export function progresso() { return progressoDi(state); }
export function rank() { return rankFor(progresso()); }
/** Il grado successivo, o null se si è in cima. */
export function prossimoGrado() { return nextRank(progresso()); }

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
  award('lesson:' + id, lv.xp, t('livello superato'));
  return true;
}

/** Il livello è accessibile? (sempre sì in modalità libera o se non ha prerequisiti) */
export function isUnlocked(id) {
  if (state.free) return true;
  /* Un livello GIÀ SUPERATO non si richiude mai, qualunque cosa succeda alla
     mappa. Serve perché il corso cresce: inserire un livello nuovo in mezzo al
     percorso sposta il prerequisito di quello che segue, e senza questa riga
     chi aveva già superato il livello successivo se lo ritrovava sbarrato —
     con il proprio attestato di padronanza in tasca. */
  if (isLessonDone(id)) return true;
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

/* ---------------- il proprio ritmo ---------------- */

const SETTIMANA = 7 * DAY;

/**
 * Quanto si è fatto negli ultimi sette giorni, e quanto nei sette prima.
 *
 * È un confronto con sé stessi, non con gli altri, ed è una scelta presa
 * sulla ricerca: il riscontro «normativo» — la classifica, cioè il confronto
 * con i pari — fa danni precisi a chi sta sotto, che attribuisce il ritardo
 * alla propria mancanza di capacità e cala nel compito successivo. Il
 * riscontro «autoriferito» — quanto sei andato avanti rispetto a te stesso —
 * sostiene invece gli obiettivi di padronanza, che sono quelli che tengono
 * in piedi l'interesse a distanza di settimane. Le fonti stanno nella pagina
 * del metodo, sezione «Il ritmo, le classifiche e la comunità».
 *
 * Non serve nessun dato nuovo: i livelli hanno già la data in cui sono stati
 * superati, e ogni carta del mazzo di ripasso ha la data dell'ultima volta
 * che è stata rivista. `ora` è un parametro perché il tempo, nei test, deve
 * poter essere deciso.
 */
export function settimana(ora = Date.now()) {
  let livelli = 0, prima = 0, ripassi = 0;
  for (const v of Object.values(state.lessons || {})) {
    if (!v || !v.mastered || !v.at) continue;
    const eta = ora - v.at;
    if (eta < SETTIMANA) livelli++;
    else if (eta < 2 * SETTIMANA) prima++;
  }
  for (const carta of Object.values(state.bank || {})) {
    if (carta && carta.last && ora - carta.last < SETTIMANA) ripassi++;
  }
  return { livelli, prima, ripassi };
}

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
      <div class="xp-bar" role="progressbar" aria-label="${t('Avanzamento del corso')}"><div class="xp-fill" data-fill></div></div>
      <span class="xp-label" data-xp></span>
    </div>`;
  const fill = host.querySelector('[data-fill]');
  const lab = host.querySelector('[data-xp]');
  const rk = host.querySelector('[data-rank]');
  subscribe(s => {
    const pct = progressoDi(s) * 100;
    fill.style.width = pct.toFixed(1) + '%';
    lab.textContent = `${s.xp} XP`;
    rk.textContent = rankFor(progressoDi(s)).name;
  });
}
