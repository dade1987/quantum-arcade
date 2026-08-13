/* ============================================================
   CONFRONTO CLASSICO ⇄ QUANTISTICO

   Un blocco solo, con la stessa forma in tutte le lezioni: a sinistra come
   si fa con un computer normale, a destra cosa cambia con quello quantistico,
   sotto la riga che dice quanto vale la differenza.

   PERCHÉ SEMPRE LA STESSA FORMA, E PERCHÉ AFFIANCATE

   · Confrontare due casi CONCRETI messi vicini fa emergere il principio che
     hanno in comune molto meglio che spiegare il principio e poi darne un
     esempio: è il risultato classico sull'apprendimento per confronto
     (Gentner, Loewenstein & Thompson 2003; Alfieri, Nokes-Malach & Schunn
     2013), e vale in particolare quando i due casi si somigliano quasi del
     tutto e differiscono in un punto solo — che è esattamente il rapporto
     fra bit e qubit, fra ricerca lineare e Grover, fra DFT e QFT.
   · Affiancate, non una sotto l'altra: leggere la seconda tenendo a mente la
     prima è carico cognitivo speso in memoria invece che in ragionamento
     (effetto della «attenzione divisa», Sweller, Ayres & Kalyuga 2011). Con
     le colonne accostate il confronto lo fanno gli occhi.
   · Il numero in fondo c'è sempre, ed è sempre lo stesso tipo di numero
     (quante operazioni, quante domande, quanti stati): un termine di paragone
     che non cambia unità di misura da un livello all'altro è ciò che permette
     di accorgersi che Grover e Shor non fanno la stessa cosa.
   · Il blocco sta all'INIZIO della lezione, prima della parte quantistica.
     Chi non sa cosa costa il problema in classico non ha modo di capire se
     quello che sta per leggere è un miracolo o una curiosità.

   Ritorna una stringa di HTML invece di montare nodi: così una lezione può
   usarlo dentro `html:` come qualunque altro testo, e resta leggibile in
   fondo alla pagina che la scrive.
   ============================================================ */

import { t } from './i18n.js';
import { slugOf, levelById } from './levels.js';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * @param {object} cfg
 * @param {string}  cfg.titolo      intestazione del blocco (facoltativa)
 * @param {object}  cfg.classico    {titolo, html}
 * @param {object}  cfg.quantistico {titolo, html}
 * @param {Array}   cfg.numeri      [{cosa, classico, quantistico}] — la riga dei conti
 * @param {string}  cfg.verdetto    la frase finale: quanto vale la differenza
 * @param {string}  cfg.livello     id del livello della Parte K da cui ripassare
 * @param {string}  cfg.vaiA        testo del collegamento al livello (facoltativo)
 * @returns {string} HTML
 */
export function confronto(cfg) {
  const c = cfg.classico || {};
  const q = cfg.quantistico || {};

  const numeri = (cfg.numeri || []).map(n => `
    <tr>
      <td>${n.cosa}</td>
      <td class="mono" style="color:var(--blue)">${n.classico}</td>
      <td class="mono" style="color:var(--violet)">${n.quantistico}</td>
    </tr>`).join('');

  const tabella = numeri ? `
    <table class="table" style="margin:0">
      <tr>
        <th>${t('quanto costa')}</th>
        <th style="color:var(--blue)">${t('computer normale')}</th>
        <th style="color:var(--violet)">${t('computer quantistico')}</th>
      </tr>
      ${numeri}
    </table>` : '';

  /* Il rimando al livello classico è un invito, non un cancello: chi il bit lo
     sa già tira dritto, chi non lo sa sa dove andare nel momento esatto in cui
     si accorge di non saperlo — che è l'unico momento in cui ci va davvero. */
  let ripasso = '';
  if (cfg.livello) {
    const lv = levelById(cfg.livello);
    if (lv) {
      ripasso = ` <a href="${esc(slugOf(cfg.livello))}.html">${esc(cfg.vaiA || t('Ripassa il livello :n — :titolo', { n: lv.n, titolo: lv.title }))} →</a>`;
    }
  }

  return `<div class="vs">
    <div class="vs-head">⇄ ${esc(cfg.titolo || t('Prima in classico, poi in quantistico'))}</div>
    <div class="vs-cols">
      <div class="vs-col vs-c">
        <h4>💻 ${esc(c.titolo || t('Come si fa con un computer normale'))}</h4>
        ${c.html || ''}
      </div>
      <div class="vs-col vs-q">
        <h4>⚛️ ${esc(q.titolo || t('Cosa cambia con quello quantistico'))}</h4>
        ${q.html || ''}
      </div>
    </div>
    ${tabella}
    ${cfg.verdetto ? `<div class="vs-foot">🎯 ${cfg.verdetto}${ripasso}</div>` : (ripasso ? `<div class="vs-foot">${ripasso}</div>` : '')}
  </div>`;
}

/**
 * La variante corta: due colonne di una riga ciascuna, senza tabella.
 * Serve nei livelli dove il confronto è una battuta, non un capitolo.
 */
export function confrontoBreve(classico, quantistico, verdetto = '') {
  return confronto({ classico: { html: `<p>${classico}</p>` }, quantistico: { html: `<p>${quantistico}</p>` }, verdetto });
}
