/* ============================================================
   TUTOR AI — la bolla in basso a destra.

   Risponde solo con quello che c'è nel sito (RAG lato server, Neuron AI)
   e per progetto NON dà le soluzioni delle missioni: dà indizi.
   Il motivo è didattico: se qualcuno ti dà la risposta, il livello lo hai
   guardato, non giocato.
   ============================================================ */

import { h } from '../core/ui.js';
import { api } from '../core/api.js';
import { sfx } from '../core/audio.js';

const SESSION_KEY = 'quantum-arcade:chat-session';

function sessionId() {
  let id = null;
  try { id = localStorage.getItem(SESSION_KEY); } catch { }
  if (!id) {
    id = 'S' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    try { localStorage.setItem(SESSION_KEY, id); } catch { }
  }
  return id;
}

export function mountTutor({ levelId = null, levelTitle = '' } = {}) {
  if (document.getElementById('qa-tutor')) return;

  const log = h('div', { class: 'tutor-log' });
  const input = h('textarea', { class: 'tutor-input', rows: 1, placeholder: 'Chiedimi qualsiasi cosa sul corso…' });
  const send = h('button', { class: 'btn sm primary', title: 'Invia' }, '➤');
  const panel = h('div', { class: 'tutor-panel', role: 'dialog', 'aria-label': 'Tutor di Quantum Arcade' },
    h('div', { class: 'tutor-head' },
      h('span', {}, '🎓 Tutor'),
      h('span', { class: 'muted small' }, levelTitle ? 'stai giocando: ' + levelTitle : 'chiedi pure'),
      h('span', { style: { flex: 1 } }),
      h('button', { class: 'btn tiny ghost', onclick: () => toggle(false) }, '✕'),
    ),
    log,
    h('div', { class: 'tutor-foot' }, input, send),
  );

  const bubble = h('button', { class: 'tutor-bubble', title: 'Chiedi al tutor', onclick: () => toggle() }, '🎓');
  const root = h('div', { id: 'qa-tutor' }, panel, bubble);
  document.body.appendChild(root);

  let open = false;
  function toggle(force) {
    open = force === undefined ? !open : force;
    root.classList.toggle('open', open);
    if (open) {
      input.focus();
      if (!log.children.length) welcome();
    }
  }

  function bubbleMsg(role, content, extra = null) {
    const el = h('div', { class: 'tutor-msg ' + role });
    el.innerHTML = role === 'bot' ? linkify(content) : escapeHtml(content);
    if (extra) el.appendChild(extra);
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function welcome() {
    bubbleMsg('bot',
      'Ciao! Sono il tutor di Quantum Arcade. Rispondo usando i contenuti del corso e ti dico sempre in quale livello ' +
      'trovi la spiegazione completa.\n\nUna regola: se mi chiedi la soluzione di una missione ti do un **indizio**, non la risposta. ' +
      'Serve a te, fidati.');
    const quick = h('div', { class: 'tutor-quick' },
      ...[
        'Cos\'è un qubit, in due righe?',
        'Perché due H riportano il qubit a zero?',
        'A cosa serve davvero la QFT?',
        levelId ? 'Sono bloccato in questo livello' : 'Da dove comincio?',
      ].map(q => h('button', { class: 'btn tiny', onclick: () => ask(q) }, q)));
    log.appendChild(quick);
  }

  async function ask(text) {
    const msg = (text ?? input.value).trim();
    if (!msg) return;
    input.value = '';
    bubbleMsg('me', msg);
    sfx.click();

    const thinking = bubbleMsg('bot typing', 'sto cercando nel corso…');

    try {
      const r = await api.chat(msg, sessionId(), levelId);
      thinking.remove();
      const el = bubbleMsg('bot', r.answer);

      if (r.sources?.length) {
        el.appendChild(h('div', { class: 'tutor-src' },
          ...r.sources.map(s => h('a', { class: 'btn tiny', href: s }, '📖 ' + s.replace('/lezioni/', '').replace('.html', '')))));
      }
      if (r.message_id) {
        el.appendChild(h('div', { class: 'tutor-rate' },
          h('span', { class: 'muted' }, 'ti è servito?'),
          h('button', { class: 'btn tiny', onclick: ev => rate(ev, r.message_id, 1) }, '👍'),
          h('button', { class: 'btn tiny', onclick: ev => rate(ev, r.message_id, -1) }, '👎'),
        ));
      }
      sfx.ok();
    } catch (e) {
      thinking.remove();
      bubbleMsg('bot',
        e.status === 0
          ? 'Non riesco a raggiungere il server: se stai giocando in locale senza PHP, il tutor è spento. Il resto del gioco funziona lo stesso.'
          : (e.status === 503 ? 'Il tutor non è ancora configurato su questo server.' : e.message));
      sfx.err();
    }
  }

  async function rate(ev, id, value) {
    const row = ev.target.parentElement;
    row.innerHTML = '<span class="muted">grazie: mi aiuta a migliorare il corso</span>';
    try { await api.chatFeedback(id, value); } catch { }
  }

  send.addEventListener('click', () => ask());
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); }
  });

  return { open: () => toggle(true), ask };
}

/* --- utilità --- */

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Grassetti in stile markdown + link ai livelli, il resto resta testo. */
function linkify(s) {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/(\/lezioni\/[\w\-]+\.html)/g, '<a href="$1">$1</a>')
    .replace(/\n/g, '<br>');
}
