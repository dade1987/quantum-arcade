/* Il CLIENT delle API: cosa fa quando il token CSRF non va più bene.
 *
 * È il punto in cui «ogni tanto perde la sessione» smetteva di essere un
 * modo di dire. Il token CSRF scade insieme alla sessione, cioè dopo due ore;
 * chi gioca sta sulla stessa pagina anche più a lungo. Da quel momento ogni
 * salvataggio dei progressi tornava 419, e un token scaduto NON viene
 * rinnovato dalla risposta che lo rifiuta: senza ricaricare la pagina non se
 * ne usciva più. L'esame finale, che è un solo POST, si perdeva per intero.
 *
 * Qui si collauda il rimedio: davanti a un 419 il client si prende un token
 * nuovo e rimanda la richiesta, una volta sola.
 */

import { test, describe, beforeEach, before } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';

let api, ApiError;
let chiamate;          // registro di tutto quello che il client chiede
let cookieToken;       // il valore attualmente nel cookie XSRF-TOKEN
let rispostaPost;      // cosa risponde il server alla POST di turno

before(async () => {
  const win = new Window({ url: 'http://localhost/' });
  global.window = win;
  global.document = win.document;
  global.localStorage = win.localStorage;
  win.document.documentElement.setAttribute('lang', 'it');
  win.document.documentElement.setAttribute('data-root', '/');

  global.fetch = async (url, opts = {}) => {
    chiamate.push({ url: String(url), method: opts.method || 'GET', headers: opts.headers || {} });

    // la rotta del token: risponde 204 e mette in tasca un cookie nuovo
    if (String(url).endsWith('/csrf')) {
      cookieToken = 'token-fresco';
      document.cookie = `XSRF-TOKEN=${cookieToken}`;
      return new Response(null, { status: 204 });
    }

    if ((opts.method || 'GET') !== 'GET') {
      const esito = rispostaPost.shift() ?? { status: 200, body: { ok: true } };
      return new Response(esito.body ? JSON.stringify(esito.body) : null,
        { status: esito.status, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  ({ api, ApiError } = await import('../../../public_html/js/core/api.js'));
});

beforeEach(() => {
  chiamate = [];
  rispostaPost = [];
  cookieToken = 'token-in-tasca';
  document.cookie = `XSRF-TOKEN=${cookieToken}`;
});

describe('token CSRF', () => {
  test('la rotta chiesta esiste davvero: /api/csrf, non quella di Sanctum', async () => {
    rispostaPost = [{ status: 200, body: { ok: true } }];
    await api.levelEvent('01-qubit', 'start');

    const perIlToken = chiamate.filter(c => /csrf/.test(c.url));
    assert.equal(perIlToken.length, 1, 'il token va chiesto prima della prima POST');
    assert.equal(perIlToken[0].url, '/api/csrf');
    assert.ok(!chiamate.some(c => c.url.includes('sanctum')), 'sanctum qui non esiste: darebbe 404');
  });

  test('il token che il browser ha in tasca viaggia nell\'intestazione', async () => {
    rispostaPost = [{ status: 200, body: { ok: true } }];
    await api.levelEvent('01-qubit', 'start');

    const post = chiamate.find(c => c.method === 'POST');
    assert.equal(post.headers['X-XSRF-TOKEN'], 'token-in-tasca');
  });

  test('davanti a un 419 riprende un token e rimanda la richiesta', async () => {
    rispostaPost = [
      { status: 419, body: { message: 'CSRF token mismatch.' } },
      { status: 200, body: { ok: true, salvato: true } },
    ];

    const r = await api.syncProgress(120, { lessons: {} });

    assert.deepEqual(r, { ok: true, salvato: true }, 'il salvataggio deve andare a buon fine');
    const scritture = chiamate.filter(c => c.method === 'PUT');
    assert.equal(scritture.length, 2, 'la richiesta va rimandata una volta');
    assert.ok(chiamate.filter(c => /csrf/.test(c.url)).length >= 1, 'e prima va rinnovato il token');
    assert.equal(scritture[0].headers['X-XSRF-TOKEN'], 'token-in-tasca');
    assert.equal(scritture[1].headers['X-XSRF-TOKEN'], 'token-fresco', 'il secondo tentativo deve usare il token nuovo');
  });

  test('se il 419 si ripete non ci si incarta: un solo nuovo tentativo', async () => {
    rispostaPost = [
      { status: 419, body: { message: 'CSRF token mismatch.' } },
      { status: 419, body: { message: 'CSRF token mismatch.' } },
      { status: 200, body: { ok: true } },
    ];

    await assert.rejects(() => api.syncProgress(120, {}), e => e instanceof ApiError && e.status === 419);
    assert.equal(chiamate.filter(c => c.method === 'PUT').length, 2);
  });

  test('un errore che non è di token non fa ritentare niente', async () => {
    rispostaPost = [{ status: 422, body: { message: 'Dati non validi' } }];

    await assert.rejects(() => api.syncProgress(1, {}), e => e.status === 422 && /non validi/.test(e.message));
    assert.equal(chiamate.filter(c => c.method === 'PUT').length, 1);
  });

  test('se la rotta del token non risponde, la POST si tenta lo stesso', async () => {
    const vera = global.fetch;
    global.fetch = async (url, opts) => {
      if (String(url).endsWith('/csrf')) { chiamate.push({ url: String(url), method: 'GET', headers: {} }); throw new TypeError('offline'); }
      return vera(url, opts);
    };
    rispostaPost = [{ status: 200, body: { ok: true } }];

    const r = await api.levelEvent('01-qubit', 'start');
    assert.deepEqual(r, { ok: true });
    global.fetch = vera;
  });
});
