/* Home: mappa dei livelli, blocchi di padronanza, ripasso spaziato. */

import { LEVELS, PARTS, TOTAL_XP, rankFor, levelById, isMain, lessonHref } from './core/levels.js';
import * as store from './core/store.js';
import { h, langButton, languageHint } from './core/ui.js';
import { sfx, wireSounds, soundButton } from './core/audio.js';
import { initAccount, accountButton, isLogged, isOffline, openRegister } from './core/account.js';
import { mountTutor } from './widgets/chat.js';
import { bottoneGlossario, montaGlossario, collegaTermini } from './widgets/glossario.js';
import { t } from './core/i18n.js';

store.mountXpBar(document.getElementById('xp-host'));
wireSounds();
document.getElementById('xp-host').after(soundButton());
document.getElementById('xp-host').after(accountButton());
/* Il glossario è raggiungibile già dalla home: è un riferimento, non un
   premio di fine corso. */
document.getElementById('xp-host').after(bottoneGlossario());
document.getElementById('xp-host').after(langButton());

// «esiste anche nella tua lingua»: in cima al contenuto, dove si guarda
const hint = languageHint();
if (hint) document.querySelector('main.wrap')?.prepend(hint);

// Account: i progressi vivono sul server, quindi la prima cosa è capire chi sei.
initAccount().then(() => {
  renderMap(); renderStatus(); renderReview();
  mountTutor({});
  /* Anche qui le parole difficili sono spiegabili al tocco: chi legge la home
     incontra "entanglement" e "QFT" prima di aver giocato un solo livello. */
  montaGlossario();
  collegaTermini(document.querySelector('main.wrap'));
  const apri = document.getElementById('apri-glossario');
  if (apri) apri.addEventListener('click', e => { e.preventDefault(); montaGlossario().apri(); });

  // Chi non è ancora entrato vede il banner dell'account, ma il bottone
  // principale continua a portare al gioco: la Parte 0 e il livello 1 sono
  // aperti a tutti, e chiedere di registrarsi prima di aver fatto vedere
  // qualcosa è il modo più veloce di far chiudere la pagina. La registrazione
  // resta a un clic, nel banner qui sotto.
  if (!isLogged() && !isOffline()) {
    const banner = document.getElementById('account-banner');
    if (banner) banner.classList.remove('hidden');
    const bl = document.getElementById('banner-login');
    if (bl) bl.addEventListener('click', e => { e.preventDefault(); openRegister(); });
  }
});

/* ---------------- mappa ---------------- */

const map = document.getElementById('map');

function renderMap() {
  map.innerHTML = '';
  PARTS.forEach(p => {
    const lv = LEVELS.filter(l => l.part === p.id);
    const doneCount = lv.filter(l => store.isLessonDone(l.id)).length;
    map.appendChild(h('div', { class: 'part-head' },
      h('div', { class: 'num', style: { color: `var(--${p.color})`, borderColor: `var(--${p.color})` } }, p.id),
      h('div', {},
        h('h2', {}, p.title),
        h('div', { class: 'sub' }, `${p.sub} · ` + t(':fatti/:totali superati', { fatti: doneCount, totali: lv.length })),
      ),
    ));
    const grid = h('div', { class: 'levels' });
    lv.forEach(l => {
      const done = store.isLessonDone(l.id);
      const open = store.isUnlocked(l.id);
      const req = l.req ? levelById(l.req) : null;
      const card = h(open ? 'a' : 'div', {
        class: 'level' + (done ? ' done' : '') + (l.boss ? ' boss' : '') + (open ? '' : ' locked'),
        href: open ? lessonHref(l) : null,
        title: open ? '' : t('Si apre superando il livello :n', { n: req ? req.n : '' }),
      },
        h('div', { class: 'lv-n' }, t('LIVELLO :n', { n: l.n })),
        h('div', { class: 'lv-t' }, l.title),
        h('div', { class: 'lv-d' }, l.desc),
        h('div', { class: 'lv-f' },
          h('span', { class: `tag ${open ? p.color : ''}` }, done ? '✓ ' + t('superato') : (open ? (l.boss ? '☠ BOSS' : t('gioca')) : '🔒 ' + t('chiuso'))),
          h('span', { class: 'lv-xp' }, `${l.xp} XP`),
        ),
      );
      grid.appendChild(card);
    });
    map.appendChild(grid);
  });
}
renderMap();

/* ---------------- riga di stato + continua ---------------- */

function renderStatus() {
  const st = store.getState();
  const done = LEVELS.filter(l => store.isLessonDone(l.id)).length;
  document.getElementById('progress-line').innerHTML =
    t('Sei <b>:grado</b> · :xp XP · :fatti/:totali livelli superati', { grado: rankFor(st.xp).name, xp: st.xp, fatti: done, totali: LEVELS.length }) +
    (done === 0 ? t(' — si comincia quando vuoi.') : '');
  /* "Continua" punta sempre al percorso principale: le parti facoltative si
     scelgono, non si subiscono, e chi torna dopo una settimana vuole riprendere
     da dove si era fermato, non dal primo livello di ripasso che non ha fatto. */
  const main = LEVELS.filter(isMain);
  const first = main.find(l => !store.isLessonDone(l.id) && store.isUnlocked(l.id)) || main[0];
  const cont = document.getElementById('continue');
  cont.href = lessonHref(first);
  cont.textContent = (done ? '▶ ' + t('Continua — livello :n: :titolo', { n: first.n, titolo: first.title }) : '▶ ' + t('Inizia dal livello 1'));
}
renderStatus();

/* ---------------- impostazioni ---------------- */

const freeChk = document.getElementById('freemode');
freeChk.checked = store.freeMode();
freeChk.addEventListener('change', () => { store.setFreeMode(freeChk.checked); renderMap(); renderStatus(); });

document.getElementById('reset').addEventListener('click', () => {
  if (confirm(t('Azzerare tutti i progressi (XP, livelli, quiz, ripasso)?'))) { store.resetAll(); location.reload(); }
});

/* ---------------- ripasso lampo (Leitner) ---------------- */

const rev = document.getElementById('ripasso');
function renderReview() {
  const due = store.dueQuestions(5);
  rev.innerHTML = '';
  if (!store.bankSize()) {
    rev.appendChild(h('p', { class: 'dim mb0', html: t('Qui compariranno le domande dei livelli che hai già giocato, riproposte <b>a distanza di giorni</b>: è il modo più efficace, secondo la ricerca, per non dimenticarle. Gioca un livello e torna qui.') }));
    return;
  }
  if (!due.length) {
    rev.appendChild(h('p', { class: 'dim mb0', html: '✅ ' + t('Nessuna domanda in scadenza. Hai <b>:quante</b> domande nel mazzo: torna fra qualche giorno e te le riproporrò al momento giusto.', { quante: store.bankSize() }) }));
    return;
  }
  let i = 0;
  const box = h('div');
  rev.appendChild(box);
  const step = () => {
    if (i >= due.length) {
      box.innerHTML = '<p class="dim mb0">✅ ' + t('Ripasso finito. Ottimo lavoro: ogni richiamo a memoria rende il ricordo più solido.') + '</p>';
      renderStatus();
      return;
    }
    const q = due[i];
    box.innerHTML = '';
    const lvl = levelById(q.lesson);
    const opts = h('div', { class: 'quiz-opts' });
    const why = h('div', { class: 'quiz-why hidden' });
    q.options.forEach((o, oi) => {
      const b = h('button', { class: 'quiz-opt', type: 'button' }, o);
      b.addEventListener('click', () => {
        const right = oi === q.correct;
        [...opts.children].forEach((c, ci) => {
          c.disabled = true;
          if (ci === q.correct) c.classList.add('right');
          else if (ci === oi) c.classList.add('wrong');
        });
        why.className = 'quiz-why';
        why.innerHTML = (right ? '✅ ' : '❌ ') + q.why + (right ? ' <span class="muted">(+5 XP)</span>' : '');
        right ? sfx.ok() : sfx.err();
        store.reviewAnswer(q.key, right);
        setTimeout(() => { i++; step(); }, right ? 1400 : 4200);
      });
      opts.appendChild(b);
    });
    box.append(
      h('div', { class: 'small muted', style: { marginBottom: '6px' } }, t('domanda :i di :totali · dal livello :livello', { i: i + 1, totali: due.length, livello: lvl ? lvl.n : '?' })),
      h('div', { class: 'qt', html: q.q }), opts, why);
  };
  step();
}
renderReview();
