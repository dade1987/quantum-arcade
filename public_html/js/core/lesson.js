/* ============================================================
   IMPALCATURA DELLE LEZIONI
   Ogni pagina descrive solo i CONTENUTI; qui costruiamo topbar,
   barra XP, passi, missioni, quiz di richiamo, prova di padronanza
   e navigazione.

   Scelte didattiche (vedi metodo.html per le fonti):
   · si gioca PRIMA di leggere la teoria (esplorazione → formalizzazione);
   · il quiz è retrieval practice, con feedback immediato e riprove illimitate;
   · si sblocca il livello successivo solo dimostrando la padronanza,
     sia PRATICA (missioni nel gioco) sia DICHIARATIVA (quiz).
   ============================================================ */

import { LEVELS, PARTS, levelById, neighbours } from './levels.js';
import * as store from './store.js';
import { h, langButton, languageHint } from './ui.js';
import { sfx, wireSounds, soundButton } from './audio.js';
import { initAccount, accountButton, requireAccount } from './account.js';
import { mountTutor } from '../widgets/chat.js';
import { t, ROOT, href } from './i18n.js';

function topbar() {
  const bar = h('header', { class: 'topbar' },
    h('div', { class: 'wrap-wide topbar-in' },
      h('a', { class: 'brand', href: href('home') },
        h('img', { class: 'logo', src: ROOT + 'assets/logo.svg', alt: '', width: 30, height: 30 }),
        h('span', {}, 'Quantum Arcade', h('small', {}, t('informatica quantistica giocando'))),
      ),
      h('span', { class: 'topbar-spacer' }),
      h('div', { id: 'xp-host' }),
      langButton(),
      soundButton(),
      accountButton(),
      h('a', { class: 'btn sm ghost', href: href('home') }, '🗺️ ' + t('Mappa')),
    ));
  document.body.prepend(bar);
  store.mountXpBar(bar.querySelector('#xp-host'));
  wireSounds();
}

/* ---------------- missioni ---------------- */

function missionBlock(lessonId, { key, title, text, xp = 25 }, onDone) {
  const box = h('div', { class: 'mission' + (store.missionDone(lessonId, key) ? ' done' : '') },
    h('div', { class: 'mh' }, '🎯 ' + t('Missione'), h('span', { class: 'muted', style: { fontWeight: '600' } }, `+${xp} XP`)),
    h('div', { html: `<b>${title}</b> — ${text}` }),
    h('div', { class: 'mstat small dim', style: { marginTop: '6px' } },
      store.missionDone(lessonId, key) ? '✓ ' + t('completata') : t('in corso…')),
  );
  return {
    root: box, key,
    complete() {
      if (store.missionDone(lessonId, key)) return;
      store.setMission(lessonId, key, true);
      store.award(`mission:${lessonId}/${key}`, xp, t('missione'));
      sfx.mission();
      box.classList.add('done');
      box.querySelector('.mstat').textContent = '✓ ' + t('completata');
      onDone && onDone();
    },
    done: () => store.missionDone(lessonId, key),
  };
}

/* ---------------- quiz ---------------- */

function quizBlock(lessonId, quiz, onChange) {
  const wrap = h('section', { class: 'panel' },
    h('h2', { class: 'panel-title', style: { marginTop: 0 } }, h('span', { class: 'dot' }), t('Controllo rapido')),
    h('p', { class: 'small muted', style: { marginTop: '-4px' } },
      t('Rispondere a memoria — anche sbagliando — fa imparare più che rileggere. Se sbagli, riprova: non c\'è nessuna penalità.')),
  );

  quiz.forEach((q, qi) => {
    const opts = h('div', { class: 'quiz-opts' });
    const why = h('div', { class: 'quiz-why hidden' });
    const retry = h('button', { class: 'btn tiny hidden', onclick: () => reset() }, '🔄 ' + t('riprova'));

    const buttons = q.options.map((o, oi) => {
      const b = h('button', { class: 'quiz-opt', type: 'button' }, o);
      b.addEventListener('click', () => answer(oi));
      opts.appendChild(b);
      return b;
    });

    function answer(oi) {
      const right = oi === q.correct;
      buttons.forEach((c, ci) => {
        c.disabled = true;
        if (ci === q.correct) c.classList.add('right');
        else if (ci === oi) c.classList.add('wrong');
      });
      why.className = 'quiz-why';
      why.innerHTML = (right ? '✅ ' : '❌ ') + q.why;
      retry.className = right ? 'btn tiny hidden' : 'btn tiny';
      store.recordQuiz(lessonId, qi, right, q);
      right ? sfx.ok() : sfx.err();
      if (right) store.award(`quiz:${lessonId}/${qi}`, 15, t('risposta esatta'));
      onChange && onChange();
    }
    function reset() {
      buttons.forEach(b => { b.disabled = false; b.classList.remove('right', 'wrong'); });
      why.className = 'quiz-why hidden';
      retry.className = 'btn tiny hidden';
    }

    if (store.quizOk(lessonId, qi) === true) {
      buttons.forEach((b, ci) => { b.disabled = true; if (ci === q.correct) b.classList.add('right'); });
      why.className = 'quiz-why'; why.innerHTML = '✅ ' + q.why;
    }

    wrap.appendChild(h('div', { class: 'quiz-q' },
      h('div', { class: 'qt', html: `${qi + 1}. ${q.q}` }), opts, why,
      h('div', { style: { marginTop: '7px' } }, retry)));
  });
  return wrap;
}

/* ---------------- prova di padronanza ---------------- */

function gateBlock(lv, missions, quiz, next) {
  const box = h('section', { class: 'panel', id: 'gate' });
  function render() {
    const mDone = missions.filter(m => m.done()).length;
    const qDone = quiz.filter((_, i) => store.quizOk(lv.id, i) === true).length;
    const ok = mDone === missions.length && qDone === quiz.length;
    const wasDone = store.isLessonDone(lv.id);
    if (ok && !wasDone) { store.completeLesson(lv.id); sfx.levelUp(); }

    box.innerHTML = '';
    box.appendChild(h('h2', { class: 'panel-title', style: { marginTop: 0 } },
      h('span', { class: 'dot' }), ok ? '✅ ' + t('Livello superato') : '🔒 ' + t('Prova di padronanza')));
    box.appendChild(h('p', { class: 'small dim', style: { marginTop: '-4px' },
      html: ok ? t('Hai dimostrato di saperlo <b>fare</b> e di saperlo <b>spiegare</b>. Il livello successivo è sbloccato.')
        : t('Per sbloccare il livello successivo servono due cose: averlo fatto nel gioco e saperlo richiamare a memoria. Nessuna fretta e nessun punteggio negativo.') }));
    const list = h('ul', { style: { margin: '10px 0 0' } });
    if (missions.length) list.appendChild(h('li', { html: `${mDone === missions.length ? '✅' : '⬜'} ` + t('Missioni completate: <b>:fatte/:totali</b>', { fatte: mDone, totali: missions.length }) }));
    if (quiz.length) list.appendChild(h('li', { html: `${qDone === quiz.length ? '✅' : '⬜'} ` + t('Domande risposte correttamente: <b>:fatte/:totali</b>', { fatte: qDone, totali: quiz.length }) }));
    if (!missions.length && !quiz.length) list.appendChild(h('li', { html: '✅ ' + t('Livello di sola lettura: nessuna prova richiesta.') }));
    box.appendChild(list);
    if (ok && next) box.appendChild(h('div', { class: 'btn-row', style: { marginTop: '14px' } },
      h('a', { class: 'btn primary', href: next.slug + '.html' }, '▶ ' + t('Vai al livello :n: :titolo', { n: next.n, titolo: next.title }))));
    if (!ok) box.appendChild(h('p', { class: 'small muted', style: { marginTop: '10px', marginBottom: 0 },
      html: t('Sei bloccato? Torna sul mini-gioco del passo corrispondente: la risposta si vede muovendo i cursori. In alternativa, dalla mappa puoi attivare la <b>modalità libera</b> (per adulti curiosi o per rivedere).') }));
  }
  render();
  return { root: box, render };
}

/* ---------------- pagina completa ---------------- */

/**
 * "Non ho capito" — un tocco, niente da scrivere.
 *
 * Il contributo più prezioso a questo corso è sapere DOVE non si capisce, ma
 * finora per dirlo bisognava aprire una issue su GitHub: cosa che chi si sta
 * perdendo non farà mai. Qui basta un pulsante in fondo a ogni passo.
 *
 * Non costruisce un canale nuovo: apre il tutor con la domanda già scritta.
 * Così la segnalazione finisce nelle conversazioni, che sono esattamente
 * quello che `php artisan chat:report` legge per dire dove il corso non è
 * chiaro. Se il server non c'è, la nota resta almeno in questo browser.
 */
function nonHoCapito(titoloPasso, apriTutor) {
  const b = h('button', { class: 'btn tiny ghost', style: { marginTop: '10px' } }, '🤔 ' + t('non ho capito questo passaggio'));
  b.addEventListener('click', () => {
    try {
      const k = 'quantum-arcade:non-capito';
      const el = JSON.parse(localStorage.getItem(k) || '[]');
      el.push({ passo: titoloPasso, quando: new Date().toISOString() });
      localStorage.setItem(k, JSON.stringify(el.slice(-50)));
    } catch { /* modalità privata: pazienza */ }
    b.textContent = '✓ ' + t('grazie, segnalato');
    b.disabled = true;
    apriTutor && apriTutor(titoloPasso);
  });
  return h('div', {}, b);
}

export function renderLesson(cfg) {
  const lv = levelById(cfg.id);
  if (!lv) throw new Error('Livello non trovato: ' + cfg.id);
  const part = PARTS.find(p => p.id === lv.part);
  const { prev, next } = neighbours(cfg.id);
  document.title = `${lv.n}. ${lv.title} — Quantum Arcade`;
  topbar();

  const app = document.getElementById('app') || document.body.appendChild(h('main', { id: 'app' }));
  app.className = 'wrap';

  // «esiste anche nella tua lingua»: in cima, prima del contenuto, perché più
  // in basso non la leggerebbe chi sta già decidendo se chiudere la pagina
  const hint = languageHint();
  if (hint) app.appendChild(hint);

  // Registro delle missioni: vive qui fuori perché serve sia al montaggio
  // della lezione sia all'oggetto restituito da renderLesson.
  const missions = [];
  let gate = null;
  const api = {
    mission(o) {
      const m = missionBlock(cfg.id, o, () => gate && gate.render());
      missions.push(m);
      return m;
    },
  };

  // L'accesso è richiesto per giocare: i progressi vivono sul server.
  // initAccount() è asincrono, quindi il contenuto viene montato dopo il controllo.
  let tutor = null;
  initAccount().then(() => {
    if (!requireAccount(app, `${lv.n} — ${lv.title}`)) return;
    tutor = mountTutor({ levelId: lv.id, levelTitle: `${lv.n} — ${lv.title}` });
    mountLesson();
  });

  function mountLesson() {

  // livello bloccato → avviso, ma contenuto comunque leggibile in modalità libera
  if (!store.isUnlocked(cfg.id)) {
    const reqLv = levelById(lv.req);
    app.appendChild(h('div', { class: 'panel', style: { marginTop: '28px', borderColor: 'rgba(251,191,36,.5)' } },
      h('h2', { class: 'panel-title', style: { marginTop: 0, color: 'var(--amber)' } }, h('span', { class: 'dot', style: { background: 'var(--amber)' } }), '🔒 ' + t('Livello ancora chiuso')),
      h('p', { html: t('Per aprire questo livello devi prima superare la prova del livello <b>:livello</b>. È così apposta: ogni livello usa gli attrezzi costruiti nel precedente, e saltarli rende tutto più difficile del necessario.', { livello: reqLv ? reqLv.n + ' — ' + reqLv.title : lv.req }) }),
      h('div', { class: 'btn-row' },
        reqLv ? h('a', { class: 'btn primary', href: reqLv.slug + '.html' }, '← ' + t('Vai al livello richiesto')) : null,
        h('a', { class: 'btn ghost', href: href('home') }, '🗺️ ' + t('Mappa')),
        h('button', { class: 'btn ghost', onclick: () => { store.setFreeMode(true); location.reload(); } }, '🔓 ' + t('Modalità libera (adulti/ripasso)')),
      )));
    return;   // livello chiuso: non montiamo il resto
  }

  app.appendChild(h('div', { class: 'lesson-hero' },
    h('nav', { class: 'crumbs', 'aria-label': t('percorso') },
      h('a', { href: href('home') }, t('Mappa')), ' › ', part.title, ' › ', t('Livello :n', { n: lv.n })),
    h('div', { class: 'btn-row', style: { marginBottom: '10px' } },
      h('span', { class: `tag ${part.color}` }, t('Livello :n', { n: lv.n })),
      h('span', { class: 'tag amber' }, `${lv.xp} XP`),
      lv.boss ? h('span', { class: 'tag' }, '☠ BOSS') : null,
    ),
    h('h1', {}, lv.title),
    h('p', { class: 'lead', html: cfg.lead || lv.desc }),
  ));

  cfg.steps.forEach((s, i) => {
    const sec = h('section', { class: 'step', id: 'p' + (i + 1) },
      h('div', { class: 'step-h' }, h('span', { class: 'step-n' }, String(i + 1).padStart(2, '0')), h('h2', {}, s.t)),
    );
    if (s.html) sec.appendChild(h('div', { html: s.html }));
    app.appendChild(sec);
    if (s.mount) {
      const holder = h('div');
      sec.appendChild(holder);
      try { s.mount(holder, api); }
      catch (err) {
        holder.appendChild(h('div', { class: 'callout warn', html: '⚠️ ' + t('Widget non caricato: :errore', { errore: err.message }) }));
        console.error(err);
      }
    }
    if (s.after) sec.appendChild(h('div', { html: s.after }));
    sec.appendChild(nonHoCapito(s.t, titolo => {
      if (!tutor) return;
      tutor.open();
      tutor.ask(t('Non ho capito il passaggio ":titolo". Me lo rispieghi in modo più semplice, senza formule?', { titolo }));
    }));
  });

  if (cfg.outro) app.appendChild(h('div', { class: 'step', html: cfg.outro }));

  const quiz = cfg.quiz || [];
  if (quiz.length) app.appendChild(quizBlock(cfg.id, quiz, () => gate && gate.render()));

  gate = gateBlock(lv, missions, quiz, next);
  app.appendChild(gate.root);

  app.appendChild(h('nav', { class: 'nav-foot' },
    prev ? h('a', { class: 'btn ghost', href: prev.slug + '.html' }, '← ' + prev.title)
      : h('a', { class: 'btn ghost', href: href('home') }, '← ' + t('Mappa')),
    h('a', { class: 'btn ghost', href: href('metodo') }, '🔬 ' + t('Come è fatto questo corso')),
    next ? h('a', { class: 'btn primary', href: next.slug + '.html' }, next.title + ' →')
      : h('a', { class: 'btn primary', href: href('home') }, t('Torna alla mappa') + ' →'),
  ));

  } // fine mountLesson

  return { app, mission: (o) => api.mission(o) };
}

export { store, LEVELS };
