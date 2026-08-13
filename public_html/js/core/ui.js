/* ============================================================
   MINI TOOLKIT UI — niente framework esterni, solo DOM.
   h()      : mini-hyperscript
   widget() : contenitore standard di un mini-gioco
   slider(), toggle(), choice(), buttons(), readout()
   langButton() : selettore di lingua
   ============================================================ */

import { LOCALE, LOCALES, LOCALE_NAMES, alternates, browserLocales,
  rememberedLocale, rememberLocale, t } from './i18n.js';

export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat(4)) {
    if (c === null || c === undefined || c === false) continue;
    el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  return el;
}

/** Contenitore standard di un widget interattivo. Ritorna {root, body, foot, setFoot}. */
export function widget(host, { title = '', subtitle = '', foot = '' } = {}) {
  const body = h('div', { class: 'widget-body' });
  const footEl = h('div', { class: 'widget-foot' + (foot ? '' : ' hidden'), html: foot });
  const root = h('div', { class: 'widget' },
    (title || subtitle) ? h('div', { class: 'widget-head' },
      h('span', { class: 'wt' }, title),
      subtitle ? h('span', { class: 'ws' }, subtitle) : null,
    ) : null,
    body, footEl,
  );
  host.appendChild(root);
  return {
    root, body, foot: footEl,
    setFoot(htmlStr) { footEl.innerHTML = htmlStr; footEl.classList.toggle('hidden', !htmlStr); },
  };
}

/** Slider etichettato. opts: {label, min, max, step, value, fmt, oninput} */
export function slider({ label, min = 0, max = 1, step = 0.01, value = 0, fmt = v => v.toFixed(2), oninput }) {
  const val = h('span', { class: 'ctrl-val' }, fmt(value));
  const input = h('input', { type: 'range', min, max, step, value });
  const root = h('div', { class: 'ctrl' },
    h('div', { class: 'ctrl-lab' }, h('span', { html: label }), val),
    input,
  );
  input.addEventListener('input', () => {
    const v = parseFloat(input.value);
    val.textContent = fmt(v);
    oninput && oninput(v);
  });
  return {
    root, input,
    get value() { return parseFloat(input.value); },
    set value(v) { input.value = v; val.textContent = fmt(parseFloat(v)); },
    setLabelValue(txt) { val.textContent = txt; },
  };
}

export function toggle({ label, checked = false, onchange }) {
  const input = h('input', { type: 'checkbox', checked });
  input.addEventListener('change', () => onchange && onchange(input.checked));
  const root = h('label', { class: 'check' }, input, h('span', { html: label }));
  return { root, input, get value() { return input.checked; }, set value(v) { input.checked = v; } };
}

/** Gruppo di bottoni radio-like. items: [{label, value}] */
export function choice({ label = '', items, value, onchange }) {
  const btns = [];
  const row = h('div', { class: 'btn-row' });
  let cur = value ?? items[0].value;
  const paint = () => btns.forEach(b => {
    const on = b.dataset.value === String(cur);
    b.className = 'btn sm' + (on ? ' primary' : '');
  });
  for (const it of items) {
    const b = h('button', {
      class: 'btn sm', dataset: { value: String(it.value) },
      onclick: () => { cur = it.value; paint(); onchange && onchange(it.value); },
    }, it.label);
    btns.push(b); row.appendChild(b);
  }
  paint();
  const root = label
    ? h('div', { class: 'ctrl', style: { flex: '1 1 100%' } }, h('div', { class: 'ctrl-lab' }, h('span', { html: label })), row)
    : row;
  return { root, get value() { return cur; }, set value(v) { cur = v; paint(); } };
}

export function buttons(list) {
  return h('div', { class: 'btn-row' },
    list.map(b => h('button', { class: 'btn ' + (b.class || 'sm'), onclick: b.onclick, title: b.title || '' }, b.label)));
}

export function controls(...items) {
  return h('div', { class: 'ctrls' }, items);
}

export function readout(initial = '') {
  const el = h('div', { class: 'readout', html: initial });
  return { root: el, set(htmlStr) { el.innerHTML = htmlStr; } };
}

export function fmt(x, d = 2) {
  if (!isFinite(x)) return '—';
  const v = Math.abs(x) < 5e-4 ? 0 : x;
  return v.toFixed(d);
}

/** Numero complesso in forma leggibile: a+bi */
export function fmtC(re, im, d = 2) {
  const a = fmt(re, d), b = fmt(Math.abs(im), d);
  const sign = im < 0 ? '−' : '+';
  return `${a} ${sign} ${b}i`;
}

/* ---------------- selettore di lingua ---------------- */

/**
 * Il selettore, costruito su tre scelte che hanno una ragione precisa.
 *
 * 1. OGNI LINGUA È SCRITTA NELLA PROPRIA LINGUA — «Español», non «Spagnolo» e
 *    non una bandiera. Chi cerca la propria lingua la cerca com'è scritta a
 *    casa sua, e le bandiere indicano stati, non lingue: quale bandiera
 *    metteresti allo spagnolo, fra i venti paesi che lo parlano? È la
 *    raccomandazione del W3C e del Nielsen Norman Group, ed è anche la
 *    ragione per cui prima non funzionava: «IT EN ES» sono codici ISO, e
 *    chi non li riconosce vede tre etichette senza significato.
 *
 * 2. IL MAPPAMONDO, NON UNA BANDIERA. È l'unico simbolo che il pubblico
 *    associa a «lingua» senza associarlo a un paese, e senza di lui il
 *    bottone non si distingue dagli altri della barra.
 *
 * 3. È UN <details>, NON UN MENU FATTO A MANO. Così funziona con la
 *    tastiera, lo screen reader lo annuncia come un pannello che si apre, e
 *    soprattutto funziona identico nelle pagine statiche (metodo, privacy)
 *    che non caricano nessun modulo: una riga di HTML, zero JavaScript.
 *
 * Gli indirizzi arrivano dai <link rel=alternate> già presenti per i motori
 * di ricerca: calcolarli una seconda volta sarebbe il modo classico di farli
 * divergere. Puntano alla PAGINA CORRENTE — chi legge la QFT in italiano e
 * sceglie English vuole la QFT in inglese, non ricominciare dalla mappa.
 */
export function langButton() {
  const alt = alternates();
  const available = LOCALES.filter(l => l === LOCALE || alt[l]);

  // una lingua sola da offrire non è una scelta: better niente che un menu vuoto
  if (available.length < 2) return h('span', { class: 'lang-none' });

  const menu = h('div', { class: 'lang-menu', role: 'menu' });
  for (const l of available) {
    const current = l === LOCALE;
    menu.appendChild(h(current ? 'span' : 'a', {
      class: 'lang-item' + (current ? ' on' : ''),
      role: 'menuitem',
      href: current ? null : alt[l],
      hreflang: current ? null : l,
      lang: l,
      'aria-current': current ? 'true' : null,
      onclick: current ? null : () => rememberLocale(l),
    }, h('span', { class: 'lang-tick', 'aria-hidden': 'true' }, current ? '✓' : ''), LOCALE_NAMES[l]));
  }

  const box = h('details', { class: 'lang-pick' },
    h('summary', { class: 'lang-now', title: t('Cambia lingua') },
      h('span', { class: 'lang-globe', 'aria-hidden': 'true' }, '🌐'),
      h('span', { class: 'lang-name' }, LOCALE_NAMES[LOCALE]),
      h('span', { class: 'sr-only' }, ' — ' + t('cambia lingua')),
    ),
    menu,
  );

  // rifiniture: senza, il pannello stay aperto finché non si ritocca il bottone,
  // che è il comportamento nudo di <details> e sorprende chi clicca altrove
  box.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !box.open) return;
    box.open = false;
    box.querySelector('summary').focus();
  });
  document.addEventListener('click', e => { if (box.open && !box.contains(e.target)) box.open = false; });

  return box;
}

/**
 * La riga che dice «questo corso c'è anche nella tua lingua».
 *
 * Il problema vero non è cambiare lingua: è SAPERE che si può. Chi arriva da
 * una ricerca in spagnolo e atterra sulla pagina italiana, il più delle volte
 * chiude — non gli viene in mente di cercare un selettore.
 *
 * La tentazione sarebbe spedirlo da solo sulla copia giusta. Non si fa, ed è
 * una raccomandazione esplicita di Google per i siti multilingua: un
 * reindirizzamento automatico impedisce di raggiungere di proposito una certa
 * versione, confonde chi parla più lingue di quelle che ha configurato, e
 * impedisce ai motori di ricerca di vedere le altre copie. Si offre e basta,
 * una volta sola:
 *
 *  · non si mostra se una lingua l'ha già scelta (anche rifiutando questa riga);
 *  · è scritta NELLA lingua che propone — è l'unica che chi legge capisce di sicuro;
 *  · «no grazie» vale come scelta e non si ripresenta più.
 */
export function languageHint() {
  if (rememberedLocale()) return null;                       // ha già deciso: non si insiste

  const alt = alternates();
  const better = browserLocales().find(l => l !== LOCALE && alt[l]);
  if (!better) return null;                                 // il browser è già d'accordo con la pagina

  const go = () => { rememberLocale(better); };
  const bar = h('div', { class: 'lang-hint', lang: better, role: 'region', 'aria-label': LOCALE_NAMES[better] },
    h('span', { class: 'lang-hint-txt' },
      h('span', { 'aria-hidden': 'true' }, '🌐 '),
      OFFERS[better].invite,
    ),
    h('a', { class: 'btn tiny primary', href: alt[better], hreflang: better, onclick: go },
      OFFERS[better].switch),
    h('button', {
      class: 'btn tiny ghost',
      onclick: () => { rememberLocale(LOCALE); bar.remove(); },
    }, OFFERS[better].stay.replace(':lingua', LOCALE_NAMES[LOCALE])),
  );
  return bar;
}

/* Scritte nella lingua PROPOSTA, quindi non passano dal dizionario: t()
   tradurrebbe verso la lingua della pagina, che è esattamente quella che chi
   legge questa riga non capisce. */
const OFFERS = {
  it: { invite: 'Questo corso è disponibile anche in italiano.', switch: 'Passa all\'italiano', stay: 'Resta in :lingua' },
  en: { invite: 'This course is also available in English.', switch: 'Switch to English', stay: 'Stay in :lingua' },
  es: { invite: 'Este curso también está disponible en español.', switch: 'Cambiar a español', stay: 'Seguir en :lingua' },
};

export const TAU = Math.PI * 2;
export const degOf = rad => ((rad * 180 / Math.PI) % 360 + 360) % 360;
