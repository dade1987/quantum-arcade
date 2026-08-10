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
    if (r.state && Object.keys(r.state).length) store.importState(r.state, r.xp);
  } catch { /* riproveremo al prossimo salvataggio */ }
}

let pushTimer = null;
export function schedulePush() {
  if (!current) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    try { await api.syncProgress(store.xp(), store.getState()); } catch { /* riproverà */ }
  }, 1200);
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

/** Data di nascita con tre menù: formato italiano su qualunque browser e lingua. */
function birthPicker() {
  const opt = (v, t) => h('option', { value: v }, t);
  const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
    'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  const anno = new Date().getFullYear();

  const d = h('select', {}, opt('', 'giorno'), ...Array.from({ length: 31 }, (_, i) => opt(i + 1, i + 1)));
  const m = h('select', {}, opt('', 'mese'), ...MESI.map((x, i) => opt(i + 1, x)));
  const y = h('select', {}, opt('', 'anno'), ...Array.from({ length: 90 }, (_, i) => opt(anno - 5 - i, anno - 5 - i)));

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
  const btn = h('button', { class: 'btn primary' }, 'Crea il mio account');

  const m = modal([
    h('h3', { style: { marginTop: 0 } }, 'Crea il tuo account'),
    h('p', { class: 'dim small' },
      'Nome e cognome servono perché finiscono sull\'attestato finale, che è verificabile pubblicamente. ' +
      'Nient\'altro ti verrà chiesto.'),
    h('div', { class: 'form-grid' },
      field('Nome *', first),
      field('Cognome *', last),
      field('Data di nascita', birth.root, 'facoltativa: distingue gli omonimi sull\'attestato'),
      field('Email *', email, 'ti mando un link per confermarla'),
      field('Password *', pass, 'almeno 8 caratteri, con lettere e numeri'),
      field('Ripeti password *', pass2),
    ),
    h('label', { class: 'check', style: { marginTop: '10px' } }, privacy,
      h('span', { html: 'Ho letto l\'<a href="/privacy.html" target="_blank">informativa privacy</a> e accetto il trattamento dei dati per l\'accesso al corso e l\'emissione dell\'attestato.' })),
    msg,
    h('div', { class: 'btn-row', style: { marginTop: '14px' } }, btn,
      h('button', { class: 'btn ghost', onclick: () => { m.close(); openLogin(); } }, 'Ho già un account')),
  ]);

  btn.addEventListener('click', async () => {
    msg.className = 'form-msg';
    if (!first.value.trim() || !last.value.trim()) return showError(msg, 'Nome e cognome sono obbligatori: senza, l\'attestato non si può emettere.');
    if (!email.value.trim()) return showError(msg, 'Serve la tua email.');
    if (pass.value.length < 8) return showError(msg, 'La password deve avere almeno 8 caratteri.');
    if (pass.value !== pass2.value) return showError(msg, 'Le due password non coincidono.');
    if (!privacy.checked) return showError(msg, 'Devi accettare l\'informativa privacy.');

    btn.disabled = true;
    msg.className = 'form-msg';
    msg.textContent = 'Creo l\'account…';

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
        h('h3', { style: { marginTop: 0 } }, '🎉 Ci sei!'),
        h('p', { class: 'dim', html: `Account creato per <b>${r.user.name}</b>. Ti ho mandato un'email a <b>${r.user.email}</b>: confermala quando vuoi — serve per l'attestato, non per giocare.` }),
        h('div', { class: 'btn-row' }, h('button', { class: 'btn primary', onclick: () => { m.close(); location.reload(); } }, '▶ Comincia a giocare')),
      ]);
    } catch (e) {
      btn.disabled = false;
      showError(msg, e instanceof ApiError && e.status === 0
        ? 'Il server non risponde: se stai aprendo i file in locale senza PHP, l\'account non è disponibile.'
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
  const btn = h('button', { class: 'btn primary' }, 'Entra');
  if (message) { msg.className = 'form-msg'; msg.textContent = message; }

  const m = modal([
    h('h3', { style: { marginTop: 0 } }, 'Bentornato'),
    h('div', { class: 'form-grid one' }, field('Email', email), field('Password', pass)),
    msg,
    h('div', { class: 'btn-row', style: { marginTop: '14px' } }, btn,
      h('button', { class: 'btn ghost', onclick: () => { m.close(); openRegister({ email: email.value }); } }, 'Non ho un account')),
    h('p', { class: 'small muted', style: { marginTop: '10px' } },
      h('a', { href: '#', onclick: async e => {
        e.preventDefault();
        if (!email.value.trim()) return showError(msg, 'Scrivi prima la tua email, poi ti mando il link.');
        try {
          const r = await api.magicLink(email.value.trim());
          msg.className = 'form-msg ok'; msg.textContent = r.message;
        } catch (err) { showError(msg, err.message); }
      } }, 'Password dimenticata? Ti mando un link di accesso')),
  ]);

  const submit = async () => {
    msg.className = 'form-msg';
    if (!email.value.trim() || !pass.value) return showError(msg, 'Servono email e password.');
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
  if (a === 'ok') store.toast('Email confermata: adesso puoi anche ottenere l\'attestato.');
  if (a === 'scaduto') openLogin('Quel link era scaduto o già usato. Accedi con la password, oppure fattene mandare un altro.');
}

/* ---------------- pannello account ---------------- */

export function accountButton() {
  const b = h('button', { class: 'btn sm' }, '👤 Entra');
  const paint = () => {
    if (offline) { b.textContent = '💾 solo locale'; b.title = 'Backend non raggiungibile: i progressi restano in questo browser'; return; }
    b.textContent = current ? '👤 ' + (current.first_name || current.name || 'Account') : '👤 Entra';
    b.className = 'btn sm' + (current && !current.verified ? ' warn-dot' : '');
    b.title = current && !current.verified ? 'Email da confermare' : '';
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
    h('h3', { style: { marginTop: 0 } }, 'Il tuo account'),
    h('p', { class: 'dim small' }, current.email + (current.verified ? ' · email confermata ✓' : ' · email da confermare')),
    ...(current.verified ? [] : [h('div', { class: 'callout warn', style: { margin: '10px 0' } },
      h('span', { html: '<b>Conferma l\'email</b> per poter sostenere l\'esame e ottenere l\'attestato. ' }),
      h('button', {
        class: 'btn tiny', onclick: async ev => {
          ev.target.disabled = true;
          try { const r = await api.resendVerify(); msg.className = 'form-msg ok'; msg.textContent = r.message; }
          catch (e) { showError(msg, e.message); }
        },
      }, '✉️ Rimanda l\'email'))]),
    h('div', { class: 'form-grid' }, field('Nome', first), field('Cognome', last), field('Data di nascita', birth.root)),
    msg,
    h('div', { class: 'btn-row', style: { marginTop: '12px' } },
      h('button', {
        class: 'btn sm primary', onclick: async () => {
          try {
            const r = await api.updateProfile({ first_name: first.value.trim(), last_name: last.value.trim(), birth_date: birth.value });
            current = r.user; notify();
            msg.className = 'form-msg ok'; msg.textContent = 'Dati aggiornati.';
          } catch (e) { showError(msg, e.message); }
        },
      }, 'Salva i dati'),
      h('button', { class: 'btn sm', onclick: async () => { await api.logout(); location.reload(); } }, 'Esci'),
      h('button', {
        class: 'btn sm ghost', onclick: async () => {
          if (!confirm('Elimino account, progressi, attestato e conversazioni con il tutor. È definitivo. Procedo?')) return;
          await api.deleteAccount();
          store.resetAll();
          location.href = '/';
        },
      }, '🗑 Elimina tutto'),
      h('button', { class: 'btn sm ghost', onclick: () => m.close() }, 'Chiudi'),
    ),
    h('p', { class: 'small muted', style: { marginTop: '10px' } },
      'XP attuali: ' + store.xp() + ' · i progressi vengono salvati sul server automaticamente.'),
  ]);
  return m;
}

/* ---------------- barriera sui livelli ---------------- */

export function requireAccount(app, levelTitle = '') {
  if (current || offline) return true;

  app.appendChild(h('div', { class: 'panel', style: { marginTop: '28px', borderColor: 'rgba(34,211,238,.5)' } },
    h('h2', { class: 'panel-title', style: { marginTop: 0 } }, h('span', { class: 'dot' }), '👤 Serve il tuo account'),
    h('p', { html: `Per giocare <b>${levelTitle}</b> devi essere registrato. Non è per raccogliere dati: è perché i progressi si salvano <b>sul server</b> e l'attestato finale riporta nome, cognome e un codice che chiunque può verificare.` }),
    h('ul', {},
      h('li', { html: '<b>Ti servono 30 secondi:</b> nome, cognome, email e password.' }),
      h('li', { html: '<b>I progressi ti seguono</b> su computer, tablet e telefono.' }),
      h('li', { html: '<b>Zero pubblicità, zero profilazione.</b> Puoi cancellare tutto con un click.' }),
    ),
    h('div', { class: 'btn-row', style: { marginTop: '14px' } },
      h('button', { class: 'btn primary', onclick: () => openRegister() }, '✏️ Crea account (gratis)'),
      h('button', { class: 'btn', onclick: () => openLogin() }, 'Ho già un account'),
      h('a', { class: 'btn ghost', href: '/privacy.html' }, 'Come tratto i dati'),
    ),
  ));
  return false;
}
