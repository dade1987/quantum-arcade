/* ============================================================
   MINI TOOLKIT UI — niente framework esterni, solo DOM.
   h()      : mini-hyperscript
   widget() : contenitore standard di un mini-gioco
   slider(), toggle(), choice(), buttons(), readout()
   ============================================================ */

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

export const TAU = Math.PI * 2;
export const degOf = rad => ((rad * 180 / Math.PI) % 360 + 360) % 360;
