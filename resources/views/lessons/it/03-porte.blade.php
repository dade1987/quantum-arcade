@php($description = 'Le porte quantistiche a un qubit spiegate come rotazioni: X, Y, Z, H, S, T e le rotazioni di fase. Matrici, reversibilità e perché non esiste il \'cancella\'.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { blochLab } from '/js/widgets/bloch.js';
import { formula, stepper } from '/js/core/formula.js';

const L = renderLesson({
  id: '03-porte',
  lead: `Le "porte" quantistiche sono le operazioni che puoi fare su un qubit. Buona notizia: sono <b>tutte rotazioni</b>
         della freccia sulla sfera. Nessuna crea o distrugge informazione — e questo, come vedremo, non è un dettaglio.`,

  steps: [
    {
      t: 'Il catalogo, con la traduzione in italiano',
      html: `<table class="table">
               <tr><th>Porta</th><th>Cosa fa allo stato</th><th>Sulla sfera</th><th>A cosa serve</th></tr>
               <tr><td class="mono"><b>X</b></td><td>scambia |0⟩ e |1⟩</td><td>ribalta nord↔sud (rotazione di 180° attorno a X)</td><td>è il NOT classico</td></tr>
               <tr><td class="mono"><b>Z</b></td><td>lascia |0⟩, mette − su |1⟩</td><td>gira di 180° lungo l'equatore</td><td>segna una possibilità senza cambiarne la probabilità</td></tr>
               <tr><td class="mono"><b>Y</b></td><td>X e Z insieme (con una i)</td><td>rotazione di 180° attorno a Y</td><td>meno usata a mano, comodissima in teoria</td></tr>
               <tr><td class="mono"><b>H</b></td><td>crea/disfa la sovrapposizione</td><td>porta il polo sull'equatore e viceversa</td><td><b>la porta più importante di tutte</b></td></tr>
               <tr><td class="mono"><b>S</b></td><td>fase +90° su |1⟩</td><td>quarto di giro sull'equatore</td><td>controllo fine della fase</td></tr>
               <tr><td class="mono"><b>T</b></td><td>fase +45° su |1⟩</td><td>ottavo di giro</td><td>serve per l'universalità (vedi sotto)</td></tr>
               <tr><td class="mono"><b>P(θ)</b></td><td>fase θ su |1⟩</td><td>rotazione di θ sull'equatore</td><td>è il mattone della <b>QFT</b>!</td></tr>
             </table>
             <p>Provale tutte: guarda dove finisce la freccia e leggi lo stato che compare sotto.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'porte', title: 'Il giro delle porte', text: 'partendo da |0⟩, riesci a portare il qubit esattamente su |1⟩ usando SOLO H, Z e H? (poi guarda le probabilità)', xp: 40 });
        el.appendChild(m.root);
        blochLab(el, {
          onChange: (s, hist) => {
            const last3 = hist.slice(-3).join(',');
            if (last3 === 'H,Z,H' && (s.re[1] ** 2 + s.im[1] ** 2) > 0.99) m.complete();
          },
        });
      },
      after: `<div class="callout key"><b>La scoperta più bella di questo livello:</b> <code>H · Z · H = X</code>.
              Cioè: una rotazione di <b>fase</b> (che da sola non cambia nessuna probabilità!), messa in mezzo a due Hadamard,
              diventa un <b>NOT completo</b>. È il meccanismo che sta dietro a <b>tutti</b> gli algoritmi quantistici:
              scrivi l'informazione nelle fasi, poi usi H per trasformarla in qualcosa di <b>misurabile</b>.</div>`,
    },
    {
      t: 'Le porte come matrici (facile, promesso)',
      html: `<p>Una porta è una tabellina 2×2 che dice: "il nuovo |0⟩ si ottiene così, il nuovo |1⟩ così".
             Applicarla significa fare due moltiplicazioni e due somme. Nient'altro.</p>
             <pre><code>stato:   [ a ]        porta X: [ 0  1 ]        risultato: [ b ]
         [ b ]                 [ 1  0 ]                   [ a ]     ← scambiati!

porta Z: [ 1   0 ]   →  [ a ]        porta H: (1/√2)[ 1   1 ]  →  (1/√2)[ a+b ]
         [ 0  −1 ]      [−b ]                        [ 1  −1 ]           [ a−b ]</code></pre>
             <p>Guarda l'ultima: <b>a+b</b> e <b>a−b</b>. Ecco perché H è la porta dell'interferenza: <b>somma</b> e
             <b>sottrae</b> le due ampiezze. Se a e b sono uguali, a−b fa <b>zero</b>: una possibilità sparisce.</p>`,
      mount: el => {
        formula(el, {
          title: 'Perché le porte devono essere "unitarie"',
          hint: 'Tocca i pezzi: c\'è un motivo profondo per cui non tutte le tabelline 2×2 sono porte valide.',
          parts: [
            { t: 'U', id: 'U', color: 'cyan', name: 'la porta', say: 'La tabellina che descrive l\'operazione. Deve conservare la lunghezza totale del vettore di stato.' },
            { t: '† ', id: 'dag', color: 'violet', name: 'la "trasposta coniugata"', say: 'Si legge "U dagger". È la porta specchiata e con le fasi ribaltate: in pratica, la porta che DISFA U.' },
            { t: 'U = I', id: 'I', color: 'green', name: 'identità', say: 'Applicare U e poi U† deve riportare tutto com\'era. Questo garantisce due cose fondamentali: le probabilità continuano a sommare a 1, e ogni operazione è REVERSIBILE.', ex: 'H·H = I, X·X = I, S·S† = I. Prova nel gioco: applica due volte la stessa porta e torni al punto di partenza.' },
          ],
        });
      },
      after: `<div class="callout warn"><b>Conseguenza enorme:</b> nel calcolo quantistico <b>non esiste il "cancella"</b>.
              La porta AND classica prende due bit e ne restituisce uno: butta via informazione, e non si può tornare indietro.
              Una porta quantistica invece è sempre <b>reversibile</b>. È lo stesso principio dei
              <b>calcolatori reversibili</b> studiati da Fredkin e Toffoli negli anni '80: computare senza distruggere
              informazione (e in teoria senza dissipare energia).</div>`,
    },
    {
      t: 'Quante porte servono per fare tutto?',
      html: `<p>Nel classico bastano poche porte (per esempio NAND) per costruire qualunque circuito: si dice che sono
             un insieme <b>universale</b>. Nel quantistico vale una cosa analoga:</p>
             <div class="callout key"><b>{ H, T, CNOT }</b> è un insieme universale: con queste tre porte si può approssimare
             <b>qualunque</b> operazione quantistica con la precisione che si vuole.</div>
             <p>Perché proprio T (45°) e non solo S (90°)? Perché con angoli "comodi" (multipli di 90°) si ottiene solo un
             insieme limitato di stati, che un computer classico riesce a simulare in fretta (teorema di Gottesman–Knill).
             La T "spezza la griglia" ed è ciò che rende il calcolo quantistico difficile da imitare classicamente.
             Nei computer reali la T è anche la porta <b>più costosa</b> da realizzare con la correzione d'errore:
             i progettisti contano proprio quante T servono ("T-count").</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Verifica 1', html: 'Nel gioco: applica <b>X</b> due volte partendo da |0⟩. Dove finisci? <br><b>|0⟩.</b> X·X = identità.' },
          { h: 'Verifica 2', html: 'Applica <b>S</b> quattro volte. Ogni S gira di 90°, quindi 4×90° = 360°: torni al punto di partenza. <b>S⁴ = I.</b>' },
          { h: 'Verifica 3', html: 'Applica <b>T</b> otto volte: 8×45° = 360°. <b>T⁸ = I.</b> E due T fanno una S (45+45 = 90).' },
          { h: 'Verifica 4 (la più importante)', html: 'Applica <b>H</b>, poi <b>Z</b>, poi <b>H</b> partendo da |0⟩: finisci su <b>|1⟩</b>. Una porta di sola fase è diventata un NOT: <b>H·Z·H = X</b>.' },
          { h: 'Morale', html: 'Le porte di fase da sole "non fanno niente di visibile". Ma <b>in mezzo</b> a due Hadamard diventano operazioni concrete. Ogni algoritmo che vedrai è costruito su questo sandwich: <b>H → qualcosa sulle fasi → H</b>.' },
        ], { doneLabel: 'Verificato!' });
      },
    },
    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Trova due sequenze <b>diverse</b> di porte che portino |0⟩ nello stesso identico stato.
           <span class="muted">(esempio: H·H·H = H)</span></p>
        <p><b>2.</b> Quante T di fila servono per ottenere una Z? E per tornare all'identità?</p>
        <p><b>3.</b> Usando solo H e P(θ), riesci a raggiungere <b>qualsiasi</b> punto della sfera? Prova a portare la freccia
           in un punto "a caso" scelto da te.</p>
        <p class="mb0"><b>4.</b> Domanda da inventore (te la ritroverai al livello 22, l'officina): se un algoritmo deve far
           <b>sparire</b> le risposte sbagliate, che porta useresti per marcarle e quale per farle interferire?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Quanto fa H·Z·H?',
      options: ['Z', 'X', 'identità', 'una misura'], correct: 1,
      why: 'Una rotazione di fase messa fra due Hadamard diventa un NOT completo. È il modello di ogni algoritmo quantistico: fase → interferenza → risultato misurabile.' },
    { q: 'Perché tutte le porte quantistiche sono reversibili?',
      options: ['per comodità di calcolo', 'perché devono conservare la probabilità totale (sono unitarie)', 'perché sono lente', 'non è vero: la misura è una porta'], correct: 1,
      why: 'Unitarietà: U†U = I. Conserva la somma delle probabilità e rende ogni operazione invertibile. La <b>misura</b> infatti non è una porta: è l\'unica operazione irreversibile.' },
    { q: 'Un insieme universale di porte quantistiche è…',
      options: ['{X, Z}', '{H, T, CNOT}', '{misura, H}', '{S, Z}'], correct: 1,
      why: 'Con Hadamard, T e CNOT si approssima qualunque operazione. Con sole porte "a 90°" si resta nel gruppo di Clifford, simulabile efficientemente in modo classico.' },
    { q: 'La porta P(θ) applicata a un qubit sull\'equatore…',
      options: ['cambia le probabilità di misura', 'ruota la fase senza cambiare le probabilità', 'misura il qubit', 'crea entanglement'], correct: 1,
      why: 'Sposta la longitudine, non la latitudine. Ma quella fase deciderà cosa si somma e cosa si cancella alla prossima Hadamard — ed è esattamente il mattone della QFT.' },
  ],

  outro: `<div class="callout ok"><b>Cosa ti porti a casa:</b> ogni porta è una rotazione; H crea e disfa sovrapposizioni;
          le porte di fase muovono la longitudine; tutto è reversibile tranne la misura; <b>H·Z·H = X</b> è lo schema
          di ogni algoritmo. Ora aggiungiamo il secondo qubit — e arriva l'entanglement.</div>`,
});
@endsection
