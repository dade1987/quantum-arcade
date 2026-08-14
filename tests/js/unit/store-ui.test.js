/* Test di store, ui e formula: girano su un DOM finto (jsdom), senza browser. */
import { test, describe, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';

let store, ui, formula;

before(async () => {
  const win = new Window({ url: 'http://localhost/' });
  global.window = win;
  global.document = win.document;
  global.localStorage = win.localStorage;
  global.CustomEvent = win.CustomEvent;
  global.Event = win.Event;
  global.requestAnimationFrame = cb => setTimeout(cb, 0);
  global.performance = win.performance;
  // WebAudio non esiste fuori dal browser: lo sostituisco con un finto silenzioso
  // (i suoni veri sono collaudati dai test Playwright, che girano in Chrome).
  const nodoFinto = () => ({
    connect() {}, start() {}, stop() {},
    gain: { value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} },
    frequency: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} },
    Q: { value: 0 }, type: '',
  });
  win.AudioContext = class {
    constructor() { this.state = 'running'; this.currentTime = 0; this.sampleRate = 44100; this.destination = nodoFinto(); }
    createGain() { return nodoFinto(); }
    createOscillator() { return nodoFinto(); }
    createBiquadFilter() { return nodoFinto(); }
    createBufferSource() { return nodoFinto(); }
    createBuffer() { return { getChannelData: () => new Float32Array(16) }; }
    resume() {}
  };
  global.AudioContext = win.AudioContext;

  store = await import('../../../public_html/js/core/store.js');
  ui = await import('../../../public_html/js/core/ui.js');
  formula = await import('../../../public_html/js/core/formula.js');
});

beforeEach(() => { store.resetAll(); });

describe('store: XP e padronanza', () => {
  test('parte da zero', () => {
    assert.equal(store.xp(), 0);
    assert.equal(store.rank().name, 'Curioso');
    assert.ok(store.totalXp() > 3000);
  });

  test('award assegna una sola volta per chiave', () => {
    assert.equal(store.award('k1', 100), true);
    assert.equal(store.award('k1', 100), false, 'la seconda volta non deve pagare');
    assert.equal(store.xp(), 100);
  });

  test('completeLesson segna il livello e paga gli XP una volta sola', () => {
    assert.equal(store.completeLesson('01-qubit'), true);
    assert.ok(store.isLessonDone('01-qubit'));
    assert.equal(store.completeLesson('01-qubit'), false);
    assert.equal(store.completeLesson('inesistente'), false);
  });

  test('isUnlocked segue la catena, e la modalità libera apre tutto', () => {
    assert.ok(store.isUnlocked('01-qubit'), 'il primo livello è sempre aperto');
    assert.ok(!store.isUnlocked('02-bloch'), 'il secondo no, finché non superi il primo');
    store.completeLesson('01-qubit');
    assert.ok(store.isUnlocked('02-bloch'));

    store.resetAll();
    store.setFreeMode(true);
    assert.ok(store.freeMode());
    assert.ok(store.isUnlocked('20-shor'));
    assert.ok(store.isUnlocked('id-che-non-esiste'));
  });

  /* Il corso cresce: un livello nuovo inserito in mezzo sposta il prerequisito
     di quello dopo. Chi quel livello dopo l'aveva già superato non deve
     ritrovarselo sbarrato — sarebbe un progresso cancellato da una modifica
     alla mappa, e per lo studente sarebbe indistinguibile da un bug del salvataggio. */
  test('un livello già superato non si richiude, nemmeno se il prerequisito cambia', () => {
    store.resetAll();
    store.completeLesson('02-bloch');            // superato senza avere fatto il precedente
    assert.ok(store.isUnlocked('02-bloch'), 'un livello superato resta aperto');
    assert.ok(!store.isUnlocked('04-due-qubit'), 'ma non apre di suo tutto il resto del percorso');
  });

  test('le missioni si segnano una volta sola', () => {
    assert.equal(store.setMission('01-qubit', 'm1'), true);
    assert.equal(store.setMission('01-qubit', 'm1'), false);
    assert.ok(store.missionDone('01-qubit', 'm1'));
    assert.ok(!store.missionDone('01-qubit', 'altra'));
    assert.equal(store.setMission('01-qubit', 'm2', false), false, 'ok=false non segna nulla');
  });
});

describe('store: quiz e ripasso spaziato', () => {
  const domanda = { q: 'Quanto fa 2+2?', options: ['3', '4'], correct: 1, why: 'perché sì' };

  test('registra la risposta e la mette nel mazzo di ripasso', () => {
    store.recordQuiz('01-qubit', 0, true, domanda);
    assert.equal(store.quizOk('01-qubit', 0), true);
    assert.equal(store.bankSize(), 1);
  });

  test('sbagliare riporta la domanda alla prima scatola, indovinare la fa salire', () => {
    store.recordQuiz('01-qubit', 0, true, domanda);
    store.recordQuiz('01-qubit', 0, false, domanda);
    const dovute = store.dueQuestions(5);
    assert.equal(dovute.length, 1, 'una domanda sbagliata torna subito disponibile');
    assert.equal(dovute[0].box, 1);
  });

  test('una risposta esatta allontana la domanda nel tempo', () => {
    store.recordQuiz('01-qubit', 1, true, domanda);
    assert.equal(store.dueQuestions(5).length, 0, 'non deve tornare subito');
  });

  test('reviewAnswer aggiorna la scatola e paga 5 XP se giusta', () => {
    store.recordQuiz('01-qubit', 2, false, domanda);
    const chiave = store.dueQuestions(1)[0].key;
    const prima = store.xp();
    store.reviewAnswer(chiave, true);
    assert.equal(store.xp(), prima + 5);
    store.reviewAnswer(chiave, false);
    store.reviewAnswer('chiave-inesistente', true);   // non deve esplodere
  });

  test('quizOk è undefined per una domanda mai vista', () => {
    assert.equal(store.quizOk('01-qubit', 99), undefined);
  });
});

describe('store: sincronizzazione e notifiche', () => {
  test('subscribe riceve subito lo stato e a ogni cambiamento', () => {
    let chiamate = 0;
    const stop = store.subscribe(() => chiamate++);
    assert.equal(chiamate, 1);
    store.award('x', 10);
    assert.equal(chiamate, 2);
    stop();
    store.award('y', 10);
    assert.equal(chiamate, 2, 'dopo stop() non arrivano più notifiche');
  });

  test('importState prende quello che c\'è sul server e tiene l\'XP più alto', () => {
    store.award('a', 50);
    store.importState({ lessons: { '01-qubit': { mastered: true } } }, 500);
    assert.equal(store.xp(), 500);
    assert.ok(store.isLessonDone('01-qubit'));
  });

  /* Il livello superato un attimo prima di cambiare pagina non ha ancora fatto
     in tempo ad arrivare al server. Se rileggerlo lo cancellasse, il livello
     tornerebbe da fare e il successivo resterebbe chiuso: è il bug che teneva
     chiuso il livello 2 a chi aveva appena superato il livello 1. */
  test('importState NON cancella i progressi che il server non ha ancora', () => {
    store.completeLesson('01-qubit');
    const xpPrima = store.xp();
    const daRimandare = store.importState({ lessons: { '00-numeri': { mastered: true } }, xp: 10 }, 10);
    assert.ok(store.isLessonDone('01-qubit'), 'il livello appena superato resta superato');
    assert.ok(store.isLessonDone('00-numeri'), 'e arriva anche quello che c\'era solo sul server');
    assert.equal(store.xp(), xpPrima, 'gli XP non tornano indietro');
    assert.equal(daRimandare, true, 'e il chiamante sa che deve rimandarlo al server');
  });

  test('importState non chiede di rimandare niente se il server è già a posto', () => {
    store.completeLesson('01-qubit');
    const stato = JSON.parse(JSON.stringify(store.getState()));
    assert.equal(store.importState(stato, stato.xp), false);
  });

  test('importState unisce due volte come una volta sola', () => {
    store.completeLesson('01-qubit');
    const server = { lessons: { '00-numeri': { mastered: true } }, xp: 40 };
    store.importState(server, 40);
    const dopoUna = JSON.stringify(store.getState());
    store.importState(server, 40);
    assert.equal(JSON.stringify(store.getState()), dopoUna);
  });

  test('onSave viene richiamato a ogni salvataggio', () => {
    let salvataggi = 0;
    store.onSave(() => salvataggi++);
    store.award('z', 5);
    assert.ok(salvataggi > 0);
    store.onSave(null);
  });

  test('toast crea un avviso visibile e non ne accumula infiniti', () => {
    store.toast('ciao');
    store.toast('di nuovo');
    assert.equal(document.querySelectorAll('.toast').length, 1);
    assert.equal(document.querySelector('.toast').textContent, 'di nuovo');
  });

  test('mountXpBar disegna la barra e la aggiorna', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    store.mountXpBar(host);
    assert.ok(host.querySelector('.xp-fill'));
    store.award('barra', 100);
    assert.ok(host.querySelector('[data-xp]').textContent.includes('XP'));
    store.mountXpBar(null);      // non deve esplodere
  });
});

describe('ui: mini-toolkit', () => {
  test('h costruisce elementi con attributi, stile, eventi e figli', () => {
    let cliccato = false;
    const el = ui.h('div', {
      class: 'x', style: { color: 'red' }, dataset: { k: '1' },
      title: 'ciao', onclick: () => { cliccato = true; },
    }, 'testo', ui.h('span', {}, 'dentro'), null, false, ['array']);
    assert.equal(el.className, 'x');
    assert.equal(el.style.color, 'red');
    assert.equal(el.dataset.k, '1');
    assert.ok(el.textContent.includes('testo') && el.textContent.includes('dentro') && el.textContent.includes('array'));
    el.dispatchEvent(new Event('click'));
    assert.ok(cliccato);
  });

  test('h con html: inserisce markup', () => {
    assert.equal(ui.h('p', { html: '<b>x</b>' }).querySelector('b').textContent, 'x');
  });

  test('h ignora attributi nulli e mette quelli booleani', () => {
    const el = ui.h('input', { disabled: true, hidden: null, other: false });
    assert.ok(el.hasAttribute('disabled'));
    assert.ok(!el.hasAttribute('hidden'));
  });

  test('widget crea intestazione, corpo e piè di pagina aggiornabile', () => {
    const host = document.createElement('div');
    const w = ui.widget(host, { title: 'T', subtitle: 'S' });
    assert.ok(host.querySelector('.widget-head'));
    assert.ok(w.foot.classList.contains('hidden'));
    w.setFoot('ciao');
    assert.ok(!w.foot.classList.contains('hidden'));
    w.setFoot('');
    assert.ok(w.foot.classList.contains('hidden'));
    ui.widget(document.createElement('div'), {});   // senza titolo
  });

  test('slider legge, scrive e notifica', () => {
    let visto = null;
    const s = ui.slider({ label: 'L', min: 0, max: 10, step: 1, value: 5, oninput: v => { visto = v; } });
    assert.equal(s.value, 5);
    s.input.value = '8';
    s.input.dispatchEvent(new Event('input'));
    assert.equal(visto, 8);
    s.value = 2;
    assert.equal(s.value, 2);
    s.setLabelValue('due');
  });

  test('toggle e choice cambiano valore e avvisano', () => {
    let acceso = null;
    const t = ui.toggle({ label: 'T', checked: false, onchange: v => { acceso = v; } });
    t.input.checked = true;
    t.input.dispatchEvent(new Event('change'));
    assert.equal(acceso, true);
    t.value = false;
    assert.equal(t.value, false);

    let scelto = null;
    const c = ui.choice({ label: 'C', items: [{ label: 'a', value: 1 }, { label: 'b', value: 2 }], onchange: v => { scelto = v; } });
    c.root.querySelectorAll('button')[1].dispatchEvent(new Event('click'));
    assert.equal(scelto, 2);
    assert.equal(c.value, 2);
    c.value = 1;
    assert.equal(c.value, 1);
    ui.choice({ items: [{ label: 'x', value: 0 }] });   // senza etichetta
  });

  test('buttons, controls e readout', () => {
    assert.equal(ui.buttons([{ label: 'a', onclick() {} }]).querySelectorAll('button').length, 1);
    assert.ok(ui.controls(ui.h('div')).classList.contains('ctrls'));
    const r = ui.readout('x');
    r.set('<b>y</b>');
    assert.equal(r.root.querySelector('b').textContent, 'y');
  });

  test('fmt e fmtC arrotondano e scrivono il segno giusto', () => {
    assert.equal(ui.fmt(1.015, 2), '1.01');
    assert.equal(ui.fmt(2.5, 0), '3');
    assert.equal(ui.fmt(1e-9), '0.00');
    assert.equal(ui.fmt(Infinity), '—');
    assert.ok(ui.fmtC(1, -2).includes('−'));
    assert.ok(ui.fmtC(1, 2).includes('+'));
    assert.ok(Math.abs(ui.degOf(Math.PI) - 180) < 1e-9);
    assert.ok(Math.abs(ui.TAU - 6.283) < 0.01);
  });
});

describe('formula: la formula esplorabile', () => {
  test('mostra i pezzi, ne spiega uno alla volta e aggiorna i valori', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const f = formula.formula(host, {
      title: 'Prova',
      parts: [
        { t: 'X', id: 'x', name: 'ics', say: 'la incognita', ex: 'X = 3', color: 'amber' },
        { t: '=' },
        { t: 'Y', id: 'y', name: 'ipsilon', say: 'l\'altra' },
      ],
    });
    assert.equal(host.querySelectorAll('.f-tok').length, 2);
    assert.equal(host.querySelectorAll('.f-dec').length, 1);

    host.querySelector('.f-tok').dispatchEvent(new Event('click'));
    assert.ok(host.querySelector('.f-expl').textContent.includes('la incognita'));

    f.setValue('x', '42');
    assert.ok(host.textContent.includes('42'));
    f.setValue('inesistente', 'niente');    // non deve esplodere
    f.select('y');
    assert.ok(host.querySelector('.f-expl').textContent.includes('l\'altra'));
  });

  test('stepper avanza, si ferma alla fine e permette di tornare indietro', () => {
    const host = document.createElement('div');
    const s = formula.stepper(host, [
      { h: 'uno', html: 'primo' }, { h: 'due', html: 'secondo' },
    ]);
    const avanti = host.querySelector('button');
    assert.ok(host.textContent.includes('primo'));
    avanti.dispatchEvent(new Event('click'));
    assert.ok(host.textContent.includes('secondo'));
    avanti.dispatchEvent(new Event('click'));      // ultimo passo: si disabilita
    assert.ok(host.querySelector('button').disabled);
    s.goto(0);
    assert.ok(host.textContent.includes('primo'));
    host.querySelectorAll('.sdot')[1].dispatchEvent(new Event('click'));
    assert.ok(host.textContent.includes('secondo'));
  });
});

describe('audio: la libreria di suoni', () => {
  test('ogni effetto si può invocare senza errori', () => {
    // In Node non c'è WebAudio vero: qui verifico che la libreria non esploda
    // e che il silenziatore funzioni. Il suono reale è collaudato in Chrome
    // dai test Playwright.
    return import('../../../public_html/js/core/audio.js').then(audio => {
      for (const nome of Object.keys(audio.sfx)) {
        assert.doesNotThrow(() => audio.sfx[nome](0.5), 'effetto rotto: ' + nome);
      }
      assert.doesNotThrow(() => audio.playTone(440, 0.1));
      assert.doesNotThrow(() => audio.playTones([{ freq: 440, amp: 1 }, { freq: 0, amp: 0 }], 0.1));
      assert.doesNotThrow(() => audio.blip(true));
      assert.doesNotThrow(() => audio.blip(false));
    });
  });

  test('il silenziatore si ricorda la scelta', async () => {
    const audio = await import('../../../public_html/js/core/audio.js');
    assert.equal(audio.isMuted(), false);
    audio.setMuted(true);
    assert.equal(audio.isMuted(), true);
    assert.equal(localStorage.getItem('quantum-arcade:sound'), 'off');
    audio.sfx.ok();                       // da muto non deve fare nulla né rompersi
    assert.equal(audio.toggleMuted(), false);
    audio.setMuted(false);
  });

  test('il bottone del suono cambia icona quando lo premi', async () => {
    const audio = await import('../../../public_html/js/core/audio.js');
    const b = audio.soundButton();
    const prima = b.textContent;
    b.dispatchEvent(new Event('click'));
    assert.notEqual(b.textContent, prima);
    b.dispatchEvent(new Event('click'));
    assert.equal(b.textContent, prima);
  });

  test('wireSounds si aggancia una volta sola e reagisce ai click', async () => {
    const audio = await import('../../../public_html/js/core/audio.js');
    audio.wireSounds();
    audio.wireSounds();                   // la seconda chiamata è innocua
    const b = document.createElement('button');
    b.className = 'btn';
    document.body.appendChild(b);
    assert.doesNotThrow(() => b.dispatchEvent(new Event('pointerdown', { bubbles: true })));

    const range = document.createElement('input');
    range.type = 'range';
    document.body.appendChild(range);
    assert.doesNotThrow(() => range.dispatchEvent(new Event('input', { bubbles: true })));
  });
});

describe('store: casi limite', () => {
  test('parseState regge dati assenti, illeggibili o manomessi', () => {
    assert.equal(store.parseState(null).xp, 0);
    assert.equal(store.parseState('').xp, 0);
    assert.equal(store.parseState('{ questo non è json').xp, 0);
    assert.equal(store.parseState('[1,2,3]').xp, 0, 'un array non è uno stato valido');
    assert.equal(store.parseState('"testo"').xp, 0);
    assert.equal(store.parseState('null').xp, 0);
    const buono = store.parseState('{"xp":123}');
    assert.equal(buono.xp, 123);
    assert.deepEqual(buono.lessons, {}, 'i campi mancanti vengono riempiti con i valori di partenza');
  });

  test('dueQuestions rispetta il limite richiesto', () => {
    store.resetAll();
    for (let i = 0; i < 8; i++) {
      store.recordQuiz('01-qubit', i, false, { q: 'd' + i, options: ['a', 'b'], correct: 0, why: '' });
    }
    assert.equal(store.dueQuestions(3).length, 3);
    assert.equal(store.dueQuestions(99).length, 8);
  });
});

describe('store: funzioni residue', () => {
  test('getState, isMastered, quizAnswered e resetAll', () => {
    store.resetAll();
    assert.equal(typeof store.getState(), 'object');
    store.completeLesson('01-qubit');
    assert.equal(store.isMastered('01-qubit'), true);
    store.recordQuiz('01-qubit', 0, true, { q: 'x', options: ['a'], correct: 0, why: '' });
    assert.equal(store.quizAnswered('01-qubit', 0), true);
    assert.equal(store.quizAnswered('01-qubit', 5), undefined);
    store.resetAll();
    assert.equal(store.xp(), 0);
    assert.equal(store.isLessonDone('01-qubit'), false);
  });

  test('recordQuiz senza metadati non riempie il mazzo, e il secondo tentativo conta', () => {
    store.resetAll();
    store.recordQuiz('02-bloch', 0, false);
    assert.equal(store.bankSize(), 0);
    store.recordQuiz('02-bloch', 0, true);
    assert.equal(store.quizOk('02-bloch', 0), true, 'basta indovinare una volta');
  });

  test('mountXpBar reagisce agli aggiornamenti successivi', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    store.mountXpBar(host);
    store.award('nuovo-xp', 300, 'prova');
    assert.ok(host.querySelector('[data-rank]').textContent.length > 0);
    assert.ok(parseFloat(host.querySelector('.xp-fill').style.width) > 0);
  });
});
