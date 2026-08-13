/* ============================================================
   ACCOUNT — registrazione, conferma email, accesso, sincronizzazione.

   Perché serve registrarsi per giocare:
   · i progressi si salvano sul server, quindi ti seguono su ogni dispositivo
     e non si perdono svuotando la cache;
   · i livelli si sbloccano dimostrando la padronanza: se lo stato vivesse solo
     nel browser, chiunque potrebbe modificarlo con due click;
   · l'attestato finale riporta nome, cognome e un codice verificabile da chiunque:
     senza dati anagrafici veri non ha alcun valore.

   Dati richiesti: nome, cognome, data di nascita (facoltativa ma consigliata
   per distinguere gli omonimi), email e password. Nient'altro.
   ============================================================ */

import { api, ApiError } from './api.js';
import { h } from './ui.js';
import * as store from './store.js';
import { t, href } from './i18n.js';

let current = null;
let checked = false;
let offline = false;
const listeners = new Set();

export const user = () => current;
export const isLogged = () => !!current;
export const isVerified = () => !!current?.verified;
export const isOffline = () => offline;
export function onAuthChange(fn) { listeners.add(fn); fn(current); return () => listeners.delete(fn); }
const notify = () => listeners.forEach(fn => fn(current));

/* ---------------- avvio ---------------- */

export async function initAccount() {
  if (checked) return current;
  checked = true;
  store.onSave(schedulePush);

  try {
    const r = await api.me();
    current = r.authenticated ? r.user : null;
  } catch (e) {
    // Backend assente o rotto: irraggiungibile (0), non installato (404, come
    // su un host statico) o in errore (5xx). In tutti e tre i casi registrarsi
    // è comunque impossibile, quindi il gioco prosegue in locale invece di
    // sbarrare i livelli a chi non può fare niente per sbloccarli.
    if (e.status === 0 || e.status === 404 || e.status >= 500) offline = true;
    current = null;
  }

  if (current) await pullProgress();
  notify();
  handleReturnFromEmail();
  return current;
}

/* ---------------- sincronizzazione ---------------- */

async function pullProgress() {
  try {
    const r = await api.getProgress();
    // Unisce, non sostituisce (vedi store.importState). Se qui c'era qualcosa
    // che il server non aveva — un livello superato un attimo prima di cambiare
    // pagina — glielo si rimanda subito, senza aspettare il prossimo punto.
    if (r.state && Object.keys(r.state).length && store.importState(r.state, r.xp)) pushNow();
  } catch { /* riproveremo al prossimo salvataggio */ }
}

/* Il salvataggio è a scatto ritardato: chi gioca guadagna punti a raffica
   (una missione ne fa scattare due o tre di fila) e mandarne uno per punto
   sarebbe una richiesta ogni mezzo secondo. Il ritardo però ha un prezzo, ed
   è quello che ha rotto il gioco: il momento in cui si guadagna di più — si
   supera il livello — è anche quello in cui si cambia pagina più in fretta,
   perché il pulsante «vai al livello successivo» è lì sotto. Un secondo di
   ritardo bastava a perdere tutto.

   Per questo il ritardo ha adesso due valvole di sfogo: `flushPush()`, che
   manda subito quello che c'è in attesa, e i due eventi qui sotto, che la
   chiamano quando la pagina sta per sparire. */
let pushTimer = null;
let inAttesa = false;

async function pushNow(keepalive = false) {
  if (!current) return;
  clearTimeout(pushTimer);
  pushTimer = null;
  inAttesa = false;
  try { await api.syncProgress(store.xp(), store.getState(), keepalive); } catch { /* riproverà */ }
}

export function schedulePush() {
  if (!current) return;
  inAttesa = true;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => pushNow(), 1200);
}

/** Manda subito il salvataggio in attesa, se c'è. */
export function flushPush() {
  if (inAttesa) pushNow(true);
}

/* «pagehide» copre il cambio pagina e la chiusura della scheda; il passaggio a
   nascosta copre il telefono che va in stand-by o cambia app, che è l'altro
   modo in cui una partita finisce senza preavviso. Su iOS «unload» non arriva
   affatto, quindi non lo si usa. */
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flushPush);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushPush(); });
}

/* ---------------- pezzi di interfaccia ---------------- */

function modal(nodes) {
  const box = h('div', { class: 'modal-card' }, nodes);
  const back = h('div', { class: 'modal-back', onclick: e => { if (e.target === back) back.remove(); } }, box);
  document.body.appendChild(back);
  return {
    close: () => back.remove(),
    box,
    set(children) { box.innerHTML = ''; box.append(...[].concat(children)); },
  };
}

const field = (label, input, hint = '') => h('label', { class: 'field' },
  h('span', { class: 'field-lab', html: label }), input,
  h('span', { class: 'field-hint', html: hint || '&nbsp;' }));   // sempre presente: tiene le righe allineate

/** Data di nascita con tre menù: stesso ordine e stessa resa su qualunque browser e lingua. */
function birthPicker() {
  const opt = (v, etichetta) => h('option', { value: v }, etichetta);
  const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
    'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'].map(x => t(x));
  const anno = new Date().getFullYear();

  const d = h('select', { 'aria-label': t('giorno') }, opt('', t('giorno')), ...Array.from({ length: 31 }, (_, i) => opt(i + 1, i + 1)));
  const m = h('select', { 'aria-label': t('mese') }, opt('', t('mese')), ...MESI.map((x, i) => opt(i + 1, x)));
  const y = h('select', { 'aria-label': t('anno') }, opt('', t('anno')), ...Array.from({ length: 90 }, (_, i) => opt(anno - 5 - i, anno - 5 - i)));

  const root = h('div', { class: 'birth-row' }, d, m, y);
  return {
    root,
    get value() {
      if (!d.value || !m.value || !y.value) return null;
      return `${y.value}-${String(m.value).padStart(2, '0')}-${String(d.value).padStart(2, '0')}`;
    },
    set value(v) {
      if (!v) return;
      const [yy, mm, dd] = v.split('-');
      y.value = +yy; m.value = +mm; d.value = +dd;
    },
  };
}

const errorBox = () => h('div', { class: 'form-msg' });

function showError(el, message) {
  el.className = 'form-msg err';
  el.textContent = message;
}

/* ---------------- registrazione ---------------- */

export function openRegister(prefill = {}) {
  const first = h('input', { type: 'text', autocomplete: 'given-name', value: prefill.first || '' });
  const last = h('input', { type: 'text', autocomplete: 'family-name', value: prefill.last || '' });
  const birth = birthPicker();
  const email = h('input', { type: 'email', autocomplete: 'email', value: prefill.email || '' });
  const pass = h('input', { type: 'password', autocomplete: 'new-password' });
  const pass2 = h('input', { type: 'password', autocomplete: 'new-password' });
  const privacy = h('input', { type: 'checkbox' });
  const msg = errorBox();
  const btn = h('button', { class: 'btn primary' }, t('Crea il mio account'));

  const m = modal([
    h('h3', { style: { marginTop: 0 } }, t('Crea il tuo account')),
    h('p', { class: 'dim small' },
      t('Nome e cognome servono perché finiscono sull\'attestato finale, che è verificabile pubblicamente. Nient\'altro ti verrà chiesto.')),
    h('div', { class: 'form-grid' },
      field(t('Nome *'), first),
      field(t('Cognome *'), last),
      field(t('Data di nascita'), birth.root, t('facoltativa: distingue gli omonimi sull\'attestato')),
      field(t('Email *'), email, t('ti mando un link per confermarla')),
      field(t('Password *'), pass, t('almeno 8 caratteri, con lettere e numeri')),
      field(t('Ripeti password *'), pass2),
    ),
    h('label', { class: 'check', style: { marginTop: '10px' } }, privacy,
      h('span', { html: t('Ho letto l\'<a href=":privacy" target="_blank">informativa privacy</a> e accetto il trattamento dei dati per l\'accesso al corso e l\'emissione dell\'attestato.', { privacy: href('privacy') }) })),
    msg,
    h('div', { class: 'btn-row', style: { marginTop: '14px' } }, btn,
      h('button', { class: 'btn ghost', onclick: () => { m.close(); openLogin(); } }, t('Ho già un account'))),
  ]);

  btn.addEventListener('click', async () => {
    msg.className = 'form-msg';
    if (!first.value.trim() || !last.value.trim()) return showError(msg, t('Nome e cognome sono obbligatori: senza, l\'attestato non si può emettere.'));
    if (!email.value.trim()) return showError(msg, t('Serve la tua email.'));
    if (pass.value.length < 8) return showError(msg, t('La password deve avere almeno 8 caratteri.'));
    if (pass.value !== pass2.value) return showError(msg, t('Le due password non coincidono.'));
    if (!privacy.checked) return showError(msg, t('Devi accettare l\'informativa privacy.'));

    btn.disabled = true;
    msg.className = 'form-msg';
    msg.textContent = t('Creo l\'account…');

    try {
      const r = await api.register({
        first_name: first.value.trim(),
        last_name: last.value.trim(),
        birth_date: birth.value,
        email: email.value.trim(),
        password: pass.value,
        password_confirmation: pass2.value,
        privacy: true,
      });
      current = r.user;
      notify();
      schedulePush();
      m.set([
        h('h3', { style: { marginTop: 0 } }, '🎉 ' + t('Ci sei!')),
        h('p', { class: 'dim', html: t('Account creato per <b>:nome</b>. Ti ho mandato un\'email a <b>:email</b>: confermala quando vuoi — serve per l\'attestato, non per giocare.', { nome: r.user.name, email: r.user.email }) }),
        h('div', { class: 'btn-row' }, h('button', { class: 'btn primary', onclick: () => { m.close(); location.reload(); } }, '▶ ' + t('Comincia a giocare'))),
      ]);
    } catch (e) {
      btn.disabled = false;
      showError(msg, e instanceof ApiError && e.status === 0
        ? t('Il server non risponde: se stai aprendo i file in locale senza PHP, l\'account non è disponibile.')
        : e.message);
    }
  });

  setTimeout(() => first.focus(), 50);
  return m;
}

/* ---------------- accesso ---------------- */

export function openLogin(message = '') {
  const email = h('input', { type: 'email', autocomplete: 'email' });
  const pass = h('input', { type: 'password', autocomplete: 'current-password' });
  const msg = errorBox();
  const btn = h('button', { class: 'btn primary' }, t('Entra'));
  if (message) { msg.className = 'form-msg'; msg.textContent = message; }

  const m = modal([
    h('h3', { style: { marginTop: 0 } }, t('Bentornato')),
    h('div', { class: 'form-grid one' }, field(t('Email'), email), field(t('Password'), pass)),
    msg,
    h('div', { class: 'btn-row', style: { marginTop: '14px' } }, btn,
      h('button', { class: 'btn ghost', onclick: () => { m.close(); openRegister({ email: email.value }); } }, t('Non ho un account'))),
    h('p', { class: 'small muted', style: { marginTop: '10px' } },
      h('a', { href: '#', onclick: async e => {
        e.preventDefault();
        if (!email.value.trim()) return showError(msg, t('Scrivi prima la tua email, poi ti mando il link.'));
        try {
          const r = await api.magicLink(email.value.trim());
          msg.className = 'form-msg ok'; msg.textContent = r.message;
        } catch (err) { showError(msg, err.message); }
      } }, t('Password dimenticata? Ti mando un link di accesso'))),
  ]);

  const submit = async () => {
    msg.className = 'form-msg';
    if (!email.value.trim() || !pass.value) return showError(msg, t('Servono email e password.'));
    btn.disabled = true;
    try {
      const r = await api.login(email.value.trim(), pass.value);
      current = r.user;
      notify();
      await pullProgress();
      m.close();
      location.reload();
    } catch (e) {
      btn.disabled = false;
      showError(msg, e.message);
    }
  };
  btn.addEventListener('click', submit);
  pass.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

  setTimeout(() => email.focus(), 50);
  return m;
}

/* ---------------- ritorno dall'email ---------------- */

function handleReturnFromEmail() {
  const p = new URLSearchParams(location.search);
  const a = p.get('auth');
  if (!a) return;
  history.replaceState({}, '', location.pathname);
  if (a === 'ok') store.toast(t('Email confermata: adesso puoi anche ottenere l\'attestato.'));
  if (a === 'scaduto') openLogin(t('Quel link era scaduto o già usato. Accedi con la password, oppure fattene mandare un altro.'));
}

/* ---------------- pannello account ---------------- */

export function accountButton() {
  const b = h('button', { class: 'btn sm' }, '👤 ' + t('Entra'));
  const paint = () => {
    if (offline) { b.textContent = '💾 ' + t('solo locale'); b.title = t('Backend non raggiungibile: i progressi restano in questo browser'); return; }
    b.textContent = current ? '👤 ' + (current.first_name || current.name || t('Account')) : '👤 ' + t('Entra');
    b.className = 'btn sm' + (current && !current.verified ? ' warn-dot' : '');
    b.title = current && !current.verified ? t('Email da confermare') : '';
  };
  b.addEventListener('click', () => current ? openAccountPanel() : openRegister());
  onAuthChange(paint);
  return b;
}

export function openAccountPanel() {
  const first = h('input', { type: 'text', value: current.first_name || '' });
  const last = h('input', { type: 'text', value: current.last_name || '' });
  const birth = birthPicker();
  birth.value = current.birth_date;
  const msg = errorBox();

  const m = modal([
    h('h3', { style: { marginTop: 0 } }, t('Il tuo account')),
    h('p', { class: 'dim small' }, current.email + (current.verified ? ' · ' + t('email confermata') + ' ✓' : ' · ' + t('email da confermare'))),
    ...(current.verified ? [] : [h('div', { class: 'callout warn', style: { margin: '10px 0' } },
      h('span', { html: t('<b>Conferma l\'email</b> per poter sostenere l\'esame e ottenere l\'attestato.') + ' ' }),
      h('button', {
        class: 'btn tiny', onclick: async ev => {
          ev.target.disabled = true;
          try { const r = await api.resendVerify(); msg.className = 'form-msg ok'; msg.textContent = r.message; }
          catch (e) { showError(msg, e.message); }
        },
      }, '✉️ ' + t('Rimanda l\'email')))]),
    h('div', { class: 'form-grid' }, field(t('Nome'), first), field(t('Cognome'), last), field(t('Data di nascita'), birth.root)),
    msg,
    h('div', { class: 'btn-row', style: { marginTop: '12px' } },
      h('button', {
        class: 'btn sm primary', onclick: async () => {
          try {
            const r = await api.updateProfile({ first_name: first.value.trim(), last_name: last.value.trim(), birth_date: birth.value });
            current = r.user; notify();
            msg.className = 'form-msg ok'; msg.textContent = t('Dati aggiornati.');
          } catch (e) { showError(msg, e.message); }
        },
      }, t('Salva i dati')),
      h('button', { class: 'btn sm', onclick: async () => { await api.logout(); location.reload(); } }, t('Esci')),
      h('button', {
        class: 'btn sm ghost', onclick: async () => {
          if (!confirm(t('Elimino account, progressi, attestato e conversazioni con il tutor. È definitivo. Procedo?'))) return;
          await api.deleteAccount();
          store.resetAll();
          location.href = '/';
        },
      }, '🗑 ' + t('Elimina tutto')),
      h('button', { class: 'btn sm ghost', onclick: () => m.close() }, t('Chiudi')),
    ),
    h('p', { class: 'small muted', style: { marginTop: '10px' } },
      t('XP attuali: :xp · i progressi vengono salvati sul server automaticamente.', { xp: store.xp() })),
  ]);
  return m;
}

/* ---------------- barriera sui livelli ---------------- */

export function requireAccount(app, levelTitle = '') {
  if (current || offline) return true;

  app.appendChild(h('div', { class: 'panel', style: { marginTop: '28px', borderColor: 'rgba(34,211,238,.5)' } },
    h('h2', { class: 'panel-title', style: { marginTop: 0 } }, h('span', { class: 'dot' }), '👤 ' + t('Serve il tuo account')),
    h('p', { html: t('Per giocare <b>:livello</b> devi essere registrato. Non è per raccogliere dati: è perché i progressi si salvano <b>sul server</b> e l\'attestato finale riporta nome, cognome e un codice che chiunque può verificare.', { livello: levelTitle }) }),
    h('ul', {},
      h('li', { html: t('<b>Ti servono 30 secondi:</b> nome, cognome, email e password.') }),
      h('li', { html: t('<b>I progressi ti seguono</b> su computer, tablet e telefono.') }),
      h('li', { html: t('<b>Zero pubblicità, zero profilazione.</b> Puoi cancellare tutto con un click.') }),
    ),
    h('div', { class: 'btn-row', style: { marginTop: '14px' } },
      h('button', { class: 'btn primary', onclick: () => openRegister() }, '✏️ ' + t('Crea account (gratis)')),
      h('button', { class: 'btn', onclick: () => openLogin() }, t('Ho già un account')),
      h('a', { class: 'btn ghost', href: href('privacy') }, t('Come tratto i dati')),
    ),
  ));
  return false;
}
