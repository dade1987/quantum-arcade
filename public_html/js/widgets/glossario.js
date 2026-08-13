/* ============================================================
   GLOSSARIO SEMPRE A PORTATA — pannello, termini nel testo, tabella A–Z.

   PERCHÉ (le fonti stanno in metodo.html, sezione 18):

   · Una parola non capita non rimanda il problema: lo moltiplica. Chi legge
     "l'oracolo scrive nelle fasi" senza sapere cosa sia un oracolo deve
     tenere in memoria la frase E cercare la parola: è esattamente il
     «split-attention effect» del carico cognitivo (Sweller; Ayres & Sweller).
     La cura è la CONTIGUITÀ (Mayer): la definizione deve comparire dove sta
     la parola, non in una pagina da raggiungere.

   · «Recognition rather than recall» (Nielsen, euristica 6): il glossario è
     un bottone sempre presente e una scorciatoia sempre valida (G), non una
     cosa da ricordarsi che esiste al livello 23.

   · Le glosse aiutano comprensione e memoria del lessico solo se sono
     brevi e a un gesto di distanza (Nation; Ko): da qui la bolla con due
     righe e il rimando al livello dove il termine è spiegato per davvero.

   · «Expertise reversal effect» (Kalyuga): a chi già sa, l'aiuto ridondante
     fa danno. Quindi i termini si marcano una volta sola per pagina — la
     prima — e l'evidenziazione si spegne con un interruttore, che resta
     spento anche nelle pagine successive.

   Il pannello NON è modale: si legge la lezione con il glossario aperto di
   fianco. Bloccare la pagina per mostrare una definizione sarebbe come
   chiudere il libro per aprire il vocabolario.
   ============================================================ */

import { h } from '../core/ui.js';
import { t } from '../core/i18n.js';
import { sfx } from '../core/audio.js';
import { levelById } from '../core/levels.js';
import {
  VOCI, voceById, cercaVoci, livelliDellaVoce, hrefLivello, formeDaCollegare, piatto,
} from '../core/glossario.js';

const PREF = 'quantum-arcade:glossario';
const CERCATI = 'quantum-arcade:glossario-cercati';

/* Dove NON si marcano i termini: formule, codice, mini-giochi, tabelle,
   bottoni e titoli. Nel codice una parola è un simbolo, non una parola; in un
   mini-gioco il testo lo riscrive il gioco stesso a ogni frame e un <button>
   dentro un <button> non è cliccabile da nessuno. */
const SALTA = [
  'pre', 'code', 'kbd', 'samp', 'a', 'button', 'canvas', 'svg', 'table',
  'input', 'textarea', 'select', 'label', 'h1', 'h2', 'h3',
  '.widget', '.tag', '.crumbs', '.topbar', '.quiz-opts', '.formula', '.readout',
  '.gloss', '.gloss-t', '.no-gloss', '.mission', '.attestato',
].join(',');

/* ---------------- preferenze ---------------- */

function pref() {
  try { return JSON.parse(localStorage.getItem(PREF) || '{}') || {}; }
  catch { return {}; }
}
function setPref(patch) {
  const p = Object.assign(pref(), patch);
  try { localStorage.setItem(PREF, JSON.stringify(p)); } catch { /* modalità privata */ }
  return p;
}
/** L'evidenziazione nel testo è attiva salvo che qualcuno l'abbia spenta. */
export const evidenziaAttiva = () => pref().evidenzia !== false;

/* Quali parole vengono cercate è l'informazione più utile che questo corso
   possa raccogliere su se stesso: dice dove il testo dà per scontato un
   termine. Resta nel browser, come le segnalazioni "non ho capito". */
function annota(id) {
  try {
    const el = JSON.parse(localStorage.getItem(CERCATI) || '[]');
    el.push({ voce: id, quando: new Date().toISOString() });
    localStorage.setItem(CERCATI, JSON.stringify(el.slice(-80)));
  } catch { /* modalità privata: pazienza */ }
}

/* ---------------- pannello ---------------- */

let pannello = null;   // istanza unica per pagina

/**
 * Crea (una volta sola) il pannello del glossario e restituisce i comandi.
 * Chiamarlo più volte è gratis: la seconda volta ritorna quello che c'è già.
 */
export function montaGlossario() {
  if (pannello) return pannello;

  const cerca = h('input', {
    type: 'search', class: 'gloss-cerca', autocomplete: 'off',
    placeholder: t('cerca un termine, o il numero di un livello…'),
    'aria-label': t('Cerca nel glossario'),
  });
  const conta = h('div', { class: 'gloss-conta small muted' });
  const elenco = h('div', { class: 'gloss-elenco' });

  const evid = h('input', { type: 'checkbox', checked: evidenziaAttiva() });
  evid.addEventListener('change', () => {
    setPref({ evidenzia: evid.checked });
    if (evid.checked) { collegaTermini(ultimeRadici); return; }
    document.querySelectorAll('.gloss-t').forEach(b => b.replaceWith(document.createTextNode(b.textContent)));
    // I nodi di testo tornati vicini si riuniscono: senza, riaccendere
    // l'evidenziazione non troverebbe più le parole spezzate a metà.
    ultimeRadici.forEach(r => r.normalize());
    chiudiBolla();
  });

  const lv23 = levelById('23-glossario');
  const chiudi = h('button', { class: 'btn tiny ghost', title: t('chiudi (Esc)'), onclick: () => apri(false) }, '✕');

  const scatola = h('aside', {
    class: 'gloss-panel', role: 'dialog', 'aria-label': t('Glossario'), 'aria-modal': 'false', tabindex: '-1',
  },
    h('div', { class: 'gloss-head' },
      h('b', {}, '📖 ' + t('Glossario')),
      h('span', { class: 'muted small gloss-hint' }, t('sempre qui · tasto G')),
      h('span', { style: { flex: 1 } }),
      chiudi,
    ),
    h('div', { class: 'gloss-top' }, cerca, conta),
    elenco,
    h('div', { class: 'gloss-foot' },
      h('label', { class: 'check' }, evid, h('span', {}, t('evidenzia i termini nel testo'))),
      lv23 ? h('a', { class: 'btn tiny', href: hrefLivello(lv23) }, t('mappa completa →')) : null,
    ),
  );

  /* Su schermo piccolo il pannello copre la pagina: lì un velo che si tocca
     per chiudere è l'unico modo per uscirne senza cercare la ✕. Su schermo
     largo il velo è spento dal CSS, perché il pannello non copre niente. */
  const velo = h('div', { class: 'gloss-velo', onclick: () => apri(false) });
  const radice = h('div', { id: 'qa-gloss', class: 'gloss' }, velo, scatola);
  document.body.appendChild(radice);

  let aperto = false, tornaA = null, evidenziato = null;

  function disegna() {
    const trovate = cercaVoci(cerca.value);
    elenco.innerHTML = '';
    conta.textContent = trovate.length === VOCI.length
      ? t(':quanti termini', { quanti: VOCI.length })
      : t(':trovati di :totale', { trovati: trovate.length, totale: VOCI.length });

    if (!trovate.length) {
      elenco.appendChild(h('p', { class: 'dim small', style: { padding: '4px 2px' } },
        t('Nessun termine con questa parola. Prova con una parola più corta, o chiedi al tutor 🎓.')));
      return;
    }
    for (const v of trovate) elenco.appendChild(vociItem(v));
    if (evidenziato) {
      const el = elenco.querySelector(`[data-voce="${evidenziato}"]`);
      if (el) { el.classList.add('viva'); el.scrollIntoView({ block: 'center' }); }
    }
  }

  cerca.addEventListener('input', () => { evidenziato = null; disegna(); });

  function apri(vero = true, id = null) {
    aperto = vero;
    radice.classList.toggle('aperto', aperto);
    // su schermo largo la pagina si stringe invece di finire sotto il pannello
    document.body.classList.toggle('gloss-spinto', aperto);
    if (aperto) {
      tornaA = document.activeElement;
      evidenziato = id;
      if (id) { cerca.value = ''; annota(id); }
      disegna();
      // Con un termine già scelto il fuoco va sul pannello, non sulla casella
      // di ricerca: chi ha appena toccato una parola non vuole riscriverla,
      // ma deve poter uscire con Esc e leggere con lo screen reader.
      if (id) scatola.focus(); else cerca.focus();
      sfx.click();
    } else if (tornaA && tornaA.focus) {
      tornaA.focus();
      tornaA = null;
    }
    return aperto;
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && aperto) { e.preventDefault(); apri(false); return; }
    if (e.key !== 'g' && e.key !== 'G') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const a = document.activeElement;
    if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable)) return;
    e.preventDefault();
    apri(!aperto);
  });

  pannello = {
    apri: (id = null) => apri(true, id),
    chiudi: () => apri(false),
    alterna: () => apri(!aperto),
    get aperto() { return aperto; },
  };
  return pannello;
}

/** Una voce dentro il pannello: termine, livelli in cui vive, definizione. */
function vociItem(v) {
  return h('article', { class: 'gloss-voce', dataset: { voce: v.id } },
    h('h3', {},
      h('span', { html: v.voce }),
      ...livelliDellaVoce(v).map(l => h('a', { class: 'tag', href: hrefLivello(l), title: l.title }, t('liv. :n', { n: l.n }))),
    ),
    h('p', { class: 'dim', html: v.def }),
  );
}

/* ---------------- bottone della barra in alto ---------------- */

export function bottoneGlossario() {
  return h('button', {
    class: 'btn sm ghost', title: t('Glossario — si apre anche col tasto G'),
    onclick: () => montaGlossario().alterna(),
  }, '📖 ' + t('Glossario'));
}

/* ---------------- termini dentro il testo ---------------- */

/* L'ultimo testo su cui si è lavorato, per poter rifare il giro quando si
   riaccende l'interruttore senza dover indovinare quale pezzo di pagina era. */
let ultimeRadici = [];

/**
 * Marca la PRIMA occorrenza di ogni termine nel testo dato.
 * Accetta un elemento o un elenco di elementi, e li tratta come un testo
 * unico: una lezione è fatta di passi separati, ma per chi legge è una pagina
 * sola, e marcare "ampiezza" otto volte non insegna niente più di una.
 * Ritorna quanti termini ha marcato (serve ai collaudi).
 */
export function collegaTermini(radici) {
  const elenco = (Array.isArray(radici) ? radici : [radici]).filter(Boolean);
  if (!elenco.length) return 0;
  ultimeRadici = elenco;
  if (!evidenziaAttiva()) return 0;

  const forme = formeDaCollegare();
  const fatti = new Set();

  // I nodi si raccolgono prima di toccarli: modificare il DOM mentre lo si
  // percorre è il modo classico di saltarne metà.
  const nodi = [];
  for (const radice of elenco) {
    const cammino = document.createTreeWalker(radice, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (!n.parentElement || n.parentElement.closest(SALTA)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    for (let n = cammino.nextNode(); n; n = cammino.nextNode()) nodi.push(n);
  }

  for (const nodo of nodi) {
    let resto = nodo;
    for (;;) {
      const trovato = primaOccorrenza(resto.nodeValue, forme, fatti);
      if (!trovato) break;
      const parola = resto.splitText(trovato.i);
      const coda = parola.splitText(trovato.len);
      parola.parentNode.replaceChild(chipTermine(trovato.id, parola.nodeValue), parola);
      fatti.add(trovato.id);
      resto = coda;
    }
  }
  return fatti.size;
}

/**
 * La prima forma che compare nel testo, fra quelle non ancora marcate.
 * A pari posizione vince la più lunga, così "trasformata di Fourier
 * quantistica" non viene mangiata da "trasformata di Fourier discreta".
 */
function primaOccorrenza(testo, forme, fatti) {
  const piano = piatto(testo);
  // Togliere gli accenti può cambiare la lunghezza (lettere fuori dal latino):
  // se gli indici non combaciano più, meglio lasciare stare questo pezzo di
  // testo che marcare la parola sbagliata.
  if (piano.length !== testo.length) return null;

  let esito = null;
  for (const f of forme) {
    if (fatti.has(f.id)) continue;
    const ago = piatto(f.forma);
    for (let da = 0; ;) {
      const i = piano.indexOf(ago, da);
      if (i === -1) break;
      if (confine(piano, i, ago.length)) {
        if (!esito || i < esito.i || (i === esito.i && ago.length > esito.len)) esito = { i, len: ago.length, id: f.id };
        break;
      }
      da = i + 1;
    }
  }
  return esito;
}

/** La parola trovata è una parola intera e non un pezzo di un'altra? */
function confine(testo, i, len) {
  const lettera = c => c !== undefined && /[\p{L}\p{N}]/u.test(c);
  return !lettera(testo[i - 1]) && !lettera(testo[i + len]);
}

function chipTermine(id, testo) {
  const b = h('button', {
    type: 'button', class: 'gloss-t', dataset: { voce: id },
    'aria-expanded': 'false',
    title: t('cosa vuol dire — tocca per la definizione'),
  }, testo);
  b.addEventListener('click', () => mostraBolla(b, id));
  return b;
}

/* ---------------- bolla di definizione ---------------- */

let bolla = null, ancora = null;

function creaBolla() {
  if (bolla) return bolla;
  bolla = h('div', { class: 'gloss-bolla', role: 'dialog' });
  document.body.appendChild(bolla);
  document.addEventListener('click', e => {
    if (!bolla.classList.contains('viva')) return;
    if (bolla.contains(e.target) || (ancora && ancora.contains(e.target))) return;
    chiudiBolla();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') chiudiBolla(); });
  window.addEventListener('resize', chiudiBolla);
  return bolla;
}

function chiudiBolla() {
  if (!bolla) return;
  bolla.classList.remove('viva');
  if (ancora) { ancora.setAttribute('aria-expanded', 'false'); ancora = null; }
}

function mostraBolla(chip, id) {
  const v = voceById(id);
  if (!v) return;
  if (ancora === chip && bolla && bolla.classList.contains('viva')) { chiudiBolla(); return; }

  const b = creaBolla();
  annota(id);
  b.innerHTML = '';
  b.setAttribute('aria-label', piatto(v.voce));
  b.appendChild(h('div', { class: 'gloss-bolla-h' },
    h('b', { html: v.voce }),
    ...livelliDellaVoce(v).map(l => h('a', { class: 'tag', href: hrefLivello(l), title: l.title }, t('liv. :n', { n: l.n }))),
  ));
  b.appendChild(h('p', { class: 'dim', html: v.def }));
  b.appendChild(h('div', { class: 'btn-row' },
    h('button', { class: 'btn tiny', onclick: () => { chiudiBolla(); montaGlossario().apri(id); } }, '📖 ' + t('tutto il glossario')),
    h('button', { class: 'btn tiny ghost', onclick: chiudiBolla }, t('chiudi')),
  ));

  ancora = chip;
  chip.setAttribute('aria-expanded', 'true');
  b.classList.add('viva');

  // Posizione: sotto la parola se c'è spazio, sopra se no, e mai fuori dai
  // bordi laterali — su telefono la parola può stare a filo dello schermo.
  const larghezza = Math.min(340, document.documentElement.clientWidth - 24);
  b.style.width = larghezza + 'px';
  const r = chip.getBoundingClientRect();
  const alta = b.offsetHeight;
  const sotto = r.bottom + alta + 14 < window.innerHeight;
  const x = Math.min(Math.max(12, r.left), document.documentElement.clientWidth - larghezza - 12);
  const y = sotto ? r.bottom + window.scrollY + 8 : Math.max(4, r.top + window.scrollY - alta - 8);
  b.style.left = Math.round(x) + 'px';
  b.style.top = Math.round(y) + 'px';
  sfx.click();
}

/* ---------------- tabella A–Z (livello 23) ---------------- */

/**
 * La tabella completa, generata dalle stesse voci del pannello.
 * Prima era scritta a mano tre volte, una per lingua: la copia inglese e
 * quella spagnola erano già andate fuori sincrono di due righe.
 */
export function tabellaGlossario() {
  const tab = h('table', { class: 'table' },
    h('tr', {},
      h('th', { style: { width: '26%' } }, t('Termine')),
      h('th', {}, t('Che cosa significa (in italiano vero)')),
      h('th', { style: { width: '12%' } }, t('Livello')),
    ),
    ...VOCI.map(v => h('tr', { id: 'voce-' + v.id },
      h('td', {}, h('b', { html: v.voce })),
      h('td', { html: v.def }),
      h('td', {},
        ...livelliDellaVoce(v).map((l, i) => h('span', {},
          i ? ', ' : '', h('a', { href: hrefLivello(l), title: l.title }, String(l.n)))),
      ),
    )),
  );
  return h('div', { class: 'no-gloss' }, tab);
}
