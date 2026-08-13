/* ============================================================================
   ACCOUNT DI COLLAUDO PER GLI AUDIT

   I livelli non si aprono più senza account: la pagina della lezione, senza
   sessione, mostra «serve il tuo account» e i mini-giochi non vengono montati
   affatto. Un audit che non si registra quindi non guarda nessun gioco — trova
   zero difetti e sembra che vada tutto bene.

   Qui si crea un account vero passando dalle stesse API del gioco, dentro il
   contesto del browser che sta per fare l'audit: il cookie di sessione resta
   nel contesto, e tutte le pagine aperte dopo sono già dentro.
   ============================================================================ */

/**
 * Registra un account nel contesto dato e accende la modalità libera.
 * @param {import('@playwright/test').BrowserContext} ctx
 * @param {string} base indirizzo del sito (per esempio http://127.0.0.1:8099)
 * @returns {Promise<{ok: boolean, email: string, stato: number, dettaglio: string}>}
 */
export async function accountDiCollaudo(ctx, base) {
  const email = `audit-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;
  const pg = await ctx.newPage();
  try {
    await pg.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const esito = await pg.evaluate(async (dati) => {
      // stesso giro che fa js/core/api.js: prima il cookie XSRF, poi la POST
      await fetch('/api/csrf', { credentials: 'same-origin', headers: { Accept: 'application/json' } });
      const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': m ? decodeURIComponent(m[1]) : '',
        },
        body: JSON.stringify(dati),
      });
      return { stato: r.status, dettaglio: (await r.text()).slice(0, 200) };
    }, {
      first_name: 'Collaudo',
      last_name: 'Grafico',
      email,
      password: 'quantum123',
      password_confirmation: 'quantum123',
      privacy: true,
    });
    return { ok: esito.stato === 201, email, ...esito };
  } catch (e) {
    return { ok: false, email, stato: 0, dettaglio: e.message.slice(0, 200) };
  } finally {
    await pg.close();
  }
}
