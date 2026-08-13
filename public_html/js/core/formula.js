/* ============================================================
   FORMULA ESPLORABILE
   Una formula matematica scritta come sequenza di "pezzi" cliccabili.
   Tocchi un pezzo → ti spiega a parole cosa fa, con esempio numerico.
   Serve a mantenere la promessa: nessun simbolo resta misterioso.
   ============================================================ */

import { h } from './ui.js';
import { t } from './i18n.js';

/**
 * @param {HTMLElement} host
 * @param {object} cfg
 *   title  : titolo sopra la formula
 *   parts  : [{t:'testo', id?, color?, name?, say?, ex?}]  (senza id = solo decorazione)
 *   hint   : testo iniziale del pannello
 */
export function formula(host, { title = '', parts, hint = t('Tocca un pezzo della formula per capire cosa fa.') } = {}) {
  const expl = h('div', { class: 'f-expl', html: `<span class="muted">${hint}</span>` });
  const row = h('div', { class: 'f-row' });
  const toks = new Map();

  parts.forEach((p, i) => {
    if (!p.id) { row.appendChild(h('span', { class: 'f-dec', html: p.t })); return; }
    const el = h('button', {
      class: 'f-tok c-' + (p.color || 'cyan'),
      onclick: () => select(p.id),
    }, h('span', { class: 'f-t', html: p.t }), p.val !== undefined ? h('span', { class: 'f-v', html: p.val }) : null);
    toks.set(p.id, { el, def: p });
    row.appendChild(el);
  });

  function select(id) {
    for (const [k, v] of toks) v.el.classList.toggle('on', k === id);
    const d = toks.get(id).def;
    expl.innerHTML = `<div class="f-name">${d.t} &nbsp;<span>${d.name || ''}</span></div>
      <div class="f-say">${d.say || ''}</div>` + (d.ex ? `<div class="f-ex">${d.ex}</div>` : '');
    host.dispatchEvent(new CustomEvent('formula-select', { detail: id, bubbles: true }));
  }

  const root = h('div', { class: 'f-box' },
    title ? h('div', { class: 'f-title', html: title }) : null,
    row, expl,
  );
  host.appendChild(root);

  return {
    root, select,
    /** aggiorna il valore numerico mostrato accanto a un simbolo */
    setValue(id, txt) {
      const tok = toks.get(id); if (!tok) return;
      let v = tok.el.querySelector('.f-v');
      if (!v) { v = h('span', { class: 'f-v' }); tok.el.appendChild(v); }
      v.innerHTML = txt;
    },
  };
}

/**
 * Sequenza "passo passo": mostra un blocco alla volta con il bottone Avanti.
 * steps: [{h: 'titolo', html: '...'}]
 */
export function stepper(host, steps, { doneLabel = t('Fatto!') } = {}) {
  let i = 0;
  const box = h('div', { class: 'stepper' });
  const body = h('div', { class: 'stepper-body' });
  const bar = h('div', { class: 'stepper-bar' });
  const btn = h('button', { class: 'btn sm primary', onclick: () => next() }, t('Avanti') + ' →');
  const counter = h('span', { class: 'muted small' });
  box.append(bar, body, h('div', { class: 'btn-row', style: { marginTop: '10px' } }, btn, counter));

  function render() {
    const s = steps[i];
    body.innerHTML = `<div class="stepper-h">${s.h || ''}</div><div>${s.html}</div>`;
    counter.textContent = t('passo :i di :totali', { i: i + 1, totali: steps.length });
    bar.innerHTML = '';
    steps.forEach((_, k) => bar.appendChild(h('span', { class: 'sdot' + (k <= i ? ' on' : ''), onclick: () => { i = k; render(); } })));
    btn.textContent = i === steps.length - 1 ? doneLabel : t('Avanti') + ' →';
    btn.disabled = false;
  }
  function next() {
    if (i < steps.length - 1) { i++; render(); }
    else { btn.disabled = true; btn.textContent = '✓ ' + doneLabel; }
  }
  render();
  host.appendChild(box);
  return { root: box, goto(k) { i = k; render(); } };
}
