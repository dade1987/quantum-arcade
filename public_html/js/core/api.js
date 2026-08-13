/* ============================================================
   CLIENT API — parla con il backend Laravel che sta sullo stesso dominio.

   Tutto passa da qui, così il resto del gioco non sa nulla di rete:
   se il server non risponde (per esempio stai aprendo i file in locale
   senza PHP), le funzioni falliscono in modo pulito e il gioco lo segnala
   invece di rompersi.

   Ogni richiesta porta con sé la lingua della pagina (Accept-Language): i
   messaggi di errore, l'email di conferma e l'attestato tornano nella lingua
   in cui si sta giocando, senza che il chiamante debba ricordarsene.
   ============================================================ */

import { t, LOCALE, LOCALE_TAGS } from './i18n.js';

const BASE = '/api';

let csrfReady = false;

/**
 * Laravel protegge le scritture con il cookie XSRF: qui ce lo facciamo dare.
 *
 * L'indirizzo è nostro (routes/api.php). Prima era /sanctum/csrf-cookie, che
 * è di Laravel Sanctum: qui non è installato, quindi rispondeva 404 — e
 * siccome l'errore veniva ingoiato di proposito, il token non arrivava mai.
 * Finiva bene lo stesso finché la pagina era appena stata caricata, perché il
 * cookie lo mette anche la pagina; ma il token scade con la sessione, cioè
 * dopo due ore, e chi gioca sta sulla stessa pagina anche più a lungo.
 *
 * `forza` serve dopo un 419: quel token lì è da buttare, non da riusare.
 */
async function ensureCsrf(forza = false) {
  if (csrfReady && !forza) return;
  try {
    await fetch(BASE + '/csrf', { credentials: 'same-origin', headers: { Accept: 'application/json' } });
    csrfReady = true;
  } catch {
    /* server irraggiungibile: la richiesta vera dirà com'è andata davvero,
       e non serve marcare il token come ottenuto quando non lo è */
  }
}

function xsrfToken() {
  const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function call(method, path, body = null, riprovaConcessa = true) {
  if (method !== 'GET') await ensureCsrf();

  const headers = { 'Accept': 'application/json', 'Accept-Language': LOCALE_TAGS[LOCALE] || LOCALE };
  if (body) headers['Content-Type'] = 'application/json';
  const token = xsrfToken();
  if (token) headers['X-XSRF-TOKEN'] = token;

  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      credentials: 'same-origin',
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(t('Server non raggiungibile'), 0, null);
  }

  /*
   * 419 = token CSRF scaduto o non più valido. Non è un errore di chi gioca
   * ed è invisibile: la partita continua, ma niente si salva più. Il token
   * scaduto NON viene rinnovato dalla risposta che lo rifiuta, quindi senza
   * questo giro l'unico rimedio sarebbe ricaricare la pagina — e l'esame
   * finale, che è un POST solo, si perderebbe per intero.
   *
   * Una volta sola: se il secondo tentativo torna 419 il problema è un altro
   * e va detto, non ritentato in eterno.
   */
  if (res.status === 419 && riprovaConcessa) {
    await ensureCsrf(true);
    return call(method, path, body, false);
  }

  let data = null;
  try { data = await res.json(); } catch { /* risposta vuota */ }

  if (!res.ok) {
    const msg = data?.message
      || (data?.errors ? Object.values(data.errors).flat()[0] : null)
      || t('Errore :codice', { codice: res.status });
    throw new ApiError(msg, res.status, data);
  }
  return data;
}

export const api = {
  /* --- account --- */
  me:            ()      => call('GET', '/auth/me'),
  register:      (d)     => call('POST', '/auth/register', d),
  login:         (email, password) => call('POST', '/auth/login', { email, password }),
  magicLink:     (email) => call('POST', '/auth/magic', { email }),
  resendVerify:  ()      => call('POST', '/auth/resend'),
  updateProfile: (d)     => call('POST', '/auth/profile', d),
  updatePassword:(d)     => call('POST', '/auth/password', d),
  logout:        ()      => call('POST', '/auth/logout'),
  deleteAccount: ()      => call('DELETE', '/auth/me'),

  /* --- progressi --- */
  getProgress:   ()               => call('GET', '/progress'),
  syncProgress:  (xp, state)      => call('PUT', '/progress', { xp, state }),
  levelEvent:    (levelId, event) => call('POST', '/progress/event', { level_id: levelId, event }),

  /* --- esame --- */
  examQuestions: ()               => call('GET', '/exam/questions'),
  examSubmit:    (answers, secs)  => call('POST', '/exam/submit', { answers, seconds: secs }),

  /* --- tutor --- */
  chat:          (message, sessionId, levelId) => call('POST', '/chat', { message, session_id: sessionId, level_id: levelId }),
  chatFeedback:  (messageId, rating)           => call('POST', '/chat/feedback', { message_id: messageId, rating }),
};

/** Il backend è raggiungibile? (serve a distinguere "offline" da "non loggato") */
export async function serverAvailable() {
  try { await api.me(); return true; } catch (e) { return e.status !== 0; }
}
