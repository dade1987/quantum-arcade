/* Test del glossario: le voci, la ricerca e la marcatura dei termini nel testo.

   La parte delicata è la marcatura: tocca il DOM di una lezione già scritta, e
   un errore lì non si vede come un errore — si vede come una lezione con le
   parole spezzate a metà. Quindi qui si collauda sul DOM finto (happy-dom) e si
   verifica soprattutto che NON tocchi ciò che non deve. */

import { test, describe, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';

let G, W;

before(async () => {
  const win = new Window({ url: 'http://localhost/lezioni/07-interferenza.html' });
  global.window = win;
  global.document = win.document;
  global.localStorage = win.localStorage;
  global.NodeFilter = win.NodeFilter;
  global.Node = win.Node;
  global.requestAnimationFrame = cb => setTimeout(cb, 0);
  document.documentElement.setAttribute('lang', 'it');
  document.documentElement.setAttribute('data-root', '../');

  G = await import('../../../public_html/js/core/glossario.js');
  // il widget importa audio.js: qui basta che non suoni niente
  win.AudioContext = class { constructor() { this.state = 'suspended'; } resume() {} };
  global.AudioContext = win.AudioContext;
  W = await import('../../../public_html/js/widgets/glossario.js');
});

beforeEach(() => { localStorage.clear(); });

describe('voci del glossario', () => {
  test('ci sono, hanno tutte i campi che servono e id unici', () => {
    assert.ok(G.VOCI.length >= 30);
    const id = new Set();
    for (const v of G.VOCI) {
      assert.ok(v.id && !id.has(v.id), 'id mancante o doppio: ' + v.id);
      id.add(v.id);
      assert.ok(v.voce && v.voce.trim(), 'voce vuota: ' + v.id);
      assert.ok(v.def && v.def.length > 15, 'definizione troppo corta: ' + v.id);
      assert.ok(Array.isArray(v.liv) && v.liv.length, 'livelli mancanti: ' + v.id);
    }
  });

  /* I livelli si citano per ID e non per numero, e questo test è il motivo:
     i numeri scritti a mano erano rimasti indietro di uno dopo l'inserimento
     del livello 12, e nessuno se ne era accorto perché «18» è un numero
     plausibile. Un id sbagliato, invece, non risolve — e qui si vede. */
  test('ogni voce rimanda a livelli che esistono davvero', () => {
    for (const v of G.VOCI) {
      const liv = G.livelliDellaVoce(v);
      assert.equal(liv.length, v.liv.length, 'id di livello inesistente in ' + v.id + ': ' + v.liv.join(', '));
      for (const l of liv) assert.ok(G.hrefLivello(l).endsWith('.html'));
    }
  });

  test('i termini della QFT e della QPE puntano ai livelli giusti', () => {
    const nDi = id => G.livelliDellaVoce(G.voceById(id)).map(l => String(l.n));
    assert.deepEqual(nDi('qft'), ['18']);
    assert.deepEqual(nDi('qpe'), ['19']);
    assert.deepEqual(nDi('autostato'), ['19']);
    assert.deepEqual(nDi('shor'), ['20']);
    assert.deepEqual(nDi('decoerenza'), ['21']);
  });

  test('voceById trova e non inventa', () => {
    assert.equal(G.voceById('qubit').voce, 'Qubit');
    assert.equal(G.voceById('non-esiste'), null);
  });
});

describe('ricerca', () => {
  test('senza testo restituisce tutto', () => {
    assert.equal(G.cercaVoci('').length, G.VOCI.length);
    assert.equal(G.cercaVoci(null).length, G.VOCI.length);
  });

  test('trova per termine, ignorando maiuscole e accenti', () => {
    assert.ok(G.cercaVoci('QUBIT').some(v => v.id === 'qubit'));
    assert.ok(G.cercaVoci('periodicita').some(v => v.id === 'periodo'));
  });

  test('trova per definizione e per numero di livello', () => {
    const fourier = G.cercaVoci('Fourier').map(v => v.id);
    assert.ok(fourier.includes('dft') && fourier.includes('qft'), 'cercando Fourier: ' + fourier);
    const liv7 = G.cercaVoci('7');
    assert.ok(liv7.some(v => v.id === 'interferenza'));
    assert.ok(!liv7.some(v => v.id === 'qubit'), 'il livello 1 non è il livello 7');
  });

  test('una parola inventata non trova niente', () => {
    assert.equal(G.cercaVoci('zxqwk').length, 0);
  });
});

describe('forme da riconoscere nel testo', () => {
  test('sono ordinate dalla più lunga, senza doppioni e senza sigle di due lettere', () => {
    const forme = G.formeDaCollegare();
    const viste = new Set();
    let prec = Infinity;
    for (const f of forme) {
      assert.ok(f.forma.length >= 3, 'forma troppo corta: ' + f.forma);
      assert.ok(f.forma.length <= prec, 'non ordinate per lunghezza');
      prec = f.forma.length;
      const k = G.piatto(f.forma);
      assert.ok(!viste.has(k), 'forma doppia: ' + f.forma);
      viste.add(k);
    }
  });

  test('le parentesi di chiarimento non entrano nella forma cercata', () => {
    const forme = G.formeDaCollegare();
    assert.ok(!forme.some(f => f.forma.includes('(')));
    assert.ok(forme.some(f => f.forma === 'sfera di Bloch'));
  });
});

describe('marcatura dei termini nel testo', () => {
  const monta = html => {
    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
    return div;
  };

  test('marca la parola, una volta sola, e non cambia il testo', () => {
    const div = monta('<p>Il qubit ha due ampiezze. Un altro qubit ne ha altre due.</p>');
    const quanti = W.collegaTermini(div);
    assert.ok(quanti >= 2);
    assert.equal(div.querySelectorAll('.gloss-t').length, 2, 'un termine, una marcatura');
    assert.equal(div.textContent, 'Il qubit ha due ampiezze. Un altro qubit ne ha altre due.');
    assert.equal(div.querySelector('.gloss-t').dataset.voce, 'qubit');
  });

  test('più pezzi di testo contano come una pagina sola', () => {
    const a = monta('<p>Il qubit è la base.</p>');
    const b = monta('<p>Anche qui si parla di qubit.</p>');
    W.collegaTermini([a, b]);
    assert.equal(a.querySelectorAll('.gloss-t').length, 1);
    assert.equal(b.querySelectorAll('.gloss-t').length, 0, 'già marcato nel primo pezzo');
  });

  test('non tocca una parola dentro un\'altra parola', () => {
    const div = monta('<p>Superqubitesco non è una parola.</p>');
    W.collegaTermini(div);
    assert.equal(div.querySelectorAll('.gloss-t').length, 0);
  });

  test('sta fuori da codice, formule, tabelle, titoli e bottoni', () => {
    const div = monta(`
      <h2>Il qubit</h2>
      <pre><code>qubit = 0</code></pre>
      <table class="table"><tr><td>qubit</td></tr></table>
      <button>qubit</button>
      <a href="#">qubit</a>
      <div class="widget"><p>qubit</p></div>
      <div class="no-gloss"><p>qubit</p></div>`);
    assert.equal(W.collegaTermini(div), 0);
    assert.equal(div.querySelectorAll('.gloss-t').length, 0);
  });

  test('la forma più lunga vince su quella più corta', () => {
    const div = monta('<p>Parliamo della trasformata di Fourier quantistica, non di altro.</p>');
    W.collegaTermini(div);
    const chip = div.querySelector('.gloss-t');
    assert.equal(chip.dataset.voce, 'qft');
    assert.equal(chip.textContent, 'trasformata di Fourier quantistica');
  });

  test('con l\'evidenziazione spenta non marca niente', () => {
    localStorage.setItem('quantum-arcade:glossario', JSON.stringify({ evidenzia: false }));
    const div = monta('<p>Un qubit e le sue ampiezze.</p>');
    assert.equal(W.collegaTermini(div), 0);
    assert.equal(div.querySelectorAll('.gloss-t').length, 0);
    assert.equal(W.evidenziaAttiva(), false);
  });

  test('senza testo da marcare non si arrabbia', () => {
    assert.equal(W.collegaTermini(null), 0);
    assert.equal(W.collegaTermini([]), 0);
  });
});

describe('tabella del livello 23', () => {
  test('ha una riga per voce più l\'intestazione, e i livelli sono collegamenti', () => {
    const tab = W.tabellaGlossario();
    const righe = tab.querySelectorAll('tr');
    assert.equal(righe.length, G.VOCI.length + 1);
    assert.ok(tab.querySelectorAll('a').length >= G.VOCI.length);
    // la tabella non deve essere marcata a sua volta: sono definizioni, non prosa
    assert.ok(tab.classList.contains('no-gloss'));
  });
});
