/* ============================================================
   ESAME FINALE

   Le domande arrivano dal server SENZA le risposte esatte, e la correzione
   la fa il server. È l'unico modo perché l'attestato significhi qualcosa:
   se le soluzioni fossero nel codice della pagina, chiunque potrebbe leggerle.

   Superato l'esame, il server emette l'attestato (PDF + pagina di verifica
   pubblica con codice).
   ============================================================ */

import { widget, h } from '../core/ui.js';
import * as store from '../core/store.js';
import { sfx } from '../core/audio.js';
import { api } from '../core/api.js';
import { isLogged, isVerified, user, openRegister, openAccountPanel } from '../core/account.js';

export function examLab(host, opts = {}) {
  const cfg = Object.assign({ onPass: null }, opts);
  const w = widget(host, { title: '🎓 Esame finale', subtitle: 'domande e correzione lato server' });
  const body = h('div');
  w.body.appendChild(body);

  const st = { questions: [], i: 0, answers: {}, t0: 0, pass: 80 };

  render();

  /* ---------------- schermate ---------------- */

  function render() {
    body.innerHTML = '';

    if (!isLogged()) {
      body.append(
        h('div', { class: 'callout' },
          h('p', { class: 'mb0', html: '<b>Per sostenere l\'esame serve il tuo account.</b> Le domande vengono dal server e la correzione la fa il server: è così che l\'attestato diventa verificabile da chiunque, invece di essere un\'immagine che ognuno può fabbricarsi.' })),
        h('div', { class: 'btn-row' },
          h('button', { class: 'btn primary', onclick: () => openRegister() }, '✏️ Crea account e fai l\'esame')),
      );
      return;
    }

    if (!isVerified()) {
      body.append(
        h('div', { class: 'callout warn' },
          h('p', { class: 'mb0', html: '<b>Manca solo la conferma dell\'email.</b> Ti ho mandato un link quando ti sei registrato: cliccalo e torna qui. Serve perché l\'attestato riporta i tuoi dati e deve essere collegato a un indirizzo reale.' })),
        h('div', { class: 'btn-row' },
          h('button', { class: 'btn primary', onclick: () => openAccountPanel() }, '✉️ Rimanda l\'email di conferma'),
          h('button', { class: 'btn ghost', onclick: () => location.reload() }, '↻ L\'ho confermata, ricarica')),
      );
      return;
    }

    if (!st.questions.length) {
      const start = h('button', { class: 'btn primary' }, '▶ Inizia l\'esame');
      start.addEventListener('click', () => load(start));
      body.append(
        h('p', { class: 'dim', html: `L'esame copre tutto il corso. <b>Nessun limite di tempo</b>, nessuna penalità, puoi rifarlo quante volte vuoi. Durante l'esame non ricevi la correzione: la vedi alla fine, domanda per domanda. Si passa dall'<b>${st.pass}%</b>.` }),
        h('p', { class: 'small muted' }, 'Consiglio: non rileggere il corso adesso. Rispondere a memoria — anche sbagliando — fissa i concetti molto più del ripasso passivo.'),
        h('div', { class: 'btn-row' }, start),
      );
      return;
    }

    if (st.i >= st.questions.length) return void submit();

    const q = st.questions[st.i];
    const opts2 = h('div', { class: 'quiz-opts' });
    q.options.forEach((o, oi) => opts2.appendChild(h('button', {
      class: 'quiz-opt', onclick: () => { st.answers[q.id] = oi; st.i++; sfx.click(); render(); },
    }, o)));

    body.append(
      h('div', { class: 'small muted' }, `domanda ${st.i + 1} di ${st.questions.length}`),
      h('div', { class: 'xp-bar', style: { margin: '6px 0 12px' } },
        h('div', { class: 'xp-fill', style: { width: (st.i / st.questions.length * 100) + '%' } })),
      h('div', { class: 'qt', html: q.q }), opts2,
      st.i > 0 ? h('button', { class: 'btn tiny ghost', style: { marginTop: '10px' }, onclick: () => { st.i--; render(); } }, '← domanda precedente') : null,
    );
  }

  async function load(btn) {
    btn.disabled = true;
    btn.textContent = 'Carico le domande…';
    try {
      const r = await api.examQuestions();
      st.questions = r.questions;
      st.pass = r.pass;
      st.i = 0; st.answers = {}; st.t0 = Date.now();
      render();
    } catch (e) {
      btn.disabled = false;
      btn.textContent = '▶ Inizia l\'esame';
      body.appendChild(h('p', { class: 'form-msg err' }, e.message));
    }
  }

  async function submit() {
    body.innerHTML = '';
    body.appendChild(h('p', { class: 'dim' }, 'Correggo…'));

    let r;
    try {
      r = await api.examSubmit(st.answers, Math.round((Date.now() - st.t0) / 1000));
    } catch (e) {
      body.innerHTML = '';
      body.append(h('p', { class: 'form-msg err' }, e.message),
        h('div', { class: 'btn-row' }, h('button', { class: 'btn', onclick: () => { st.questions = []; render(); } }, '↺ Riprova')));
      return;
    }

    body.innerHTML = '';
    const mins = Math.round((Date.now() - st.t0) / 60000);

    body.append(
      h('h3', { style: { marginTop: 0 } }, r.passed ? '🎉 Esame superato!' : 'Non ancora — ma ci sei vicino'),
      h('p', { class: 'lead', html: `<b>${r.score}/${r.total}</b> risposte esatte (${r.percent}%) in circa ${mins} minuti.` }),
    );

    if (r.passed) {
      sfx.boss();
      store.award('esame:passed', 300, 'esame finale superato');
      cfg.onPass && cfg.onPass(r.percent);

      if (r.certificate) {
        body.append(
          h('div', { class: 'attestato' },
            h('div', { class: 'att-top' }, 'QUANTUM ARCADE'),
            h('div', { class: 'att-sub' }, 'Attestato di completamento del corso'),
            h('div', { class: 'att-name' }, r.certificate.name),
            h('p', { class: 'att-txt', html: `ha completato i 28 livelli di <b>“Informatica quantistica giocando”</b> superando l'esame finale con <b>${r.percent}%</b> di risposte esatte.` }),
            h('div', { class: 'att-row' },
              h('div', {}, h('div', { class: 'att-lab' }, 'Codice'), h('div', { class: 'mono' }, r.certificate.code)),
              h('div', {}, h('div', { class: 'att-lab' }, 'Verifica pubblica'), h('div', {}, h('a', { href: r.certificate.url }, r.certificate.url))),
            ),
            h('div', { class: 'att-note' }, 'Attestato di completamento rilasciato dall\'autore del corso. Non costituisce una certificazione accreditata da un ente terzo.'),
          ),
          h('div', { class: 'btn-row', style: { marginTop: '14px' } },
            h('a', { class: 'btn primary', href: `/attestato/${r.certificate.code}.pdf` }, '⬇️ Scarica il PDF'),
            h('a', { class: 'btn', href: r.certificate.url, target: '_blank' }, '🔎 Pagina di verifica'),
            h('a', { class: 'btn ghost', href: `/api/badge/${r.certificate.code}.json`, target: '_blank' }, '🏅 Open Badge (JSON)'),
          ),
          h('p', { class: 'small muted', style: { marginTop: '10px' } },
            'Il nome sull\'attestato è quello del tuo profilo. Se è sbagliato, correggilo nel pannello account e riscarica il PDF.'),
        );
      }
    } else {
      sfx.err();
    }

    body.append(h('h3', {}, 'Correzione domanda per domanda'));
    r.review.forEach(x => body.appendChild(h('div', { class: 'quiz-q' },
      h('div', { class: 'qt', html: `${x.ok ? '✅' : '❌'} ${x.q}` }),
      h('div', { class: 'quiz-why', html: `<b>Risposta esatta:</b> ${x.correct}${x.ok ? '' : ` · <span style="color:var(--red)">tu avevi risposto: ${x.yours}</span>`} — ${x.why}` }))));

    body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '16px' } },
      h('button', { class: 'btn', onclick: () => { st.questions = []; render(); } }, '↺ Rifai l\'esame')));
  }

  return { state: st };
}
