/* ============================================================
   CLIENT API — parla con il backend Laravel che sta sullo stesso dominio.

   Tutto passa da qui, così il resto del gioco non sa nulla di rete:
   se il server non risponde (per esempio stai aprendo i file in locale
   senza PHP), le funzioni falliscono in modo pulito e il gioco lo segnala
   invece di rompersi.
   ============================================================ */

const BASE = '/api';

let csrfReady = false;

/** Laravel protegge le POST con il cookie XSRF: lo chiediamo una volta sola. */
async function ensureCsrf() {
  if (csrfReady) return;
  try { await fetch('/sanctum/csrf-cookie', { credentials: 'same-origin' }); } catch { /* opzionale */ }
  csrfReady = true;
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

async function call(method, path, body = null) {
  if (method !== 'GET') await ensureCsrf();

  const headers = { 'Accept': 'application/json' };
  if (body) headers['Content-Type'] = 'application/json';
  const t = xsrfToken();
  if (t) headers['X-XSRF-TOKEN'] = t;

  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      credentials: 'same-origin',
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Server non raggiungibile', 0, null);
  }

  let data = null;
  try { data = await res.json(); } catch { /* risposta vuota */ }

  if (!res.ok) {
    const msg = data?.message
      || (data?.errors ? Object.values(data.errors).flat()[0] : null)
      || `Errore ${res.status}`;
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
