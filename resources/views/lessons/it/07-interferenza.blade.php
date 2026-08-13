@php($description = 'L\'interferenza quantistica spiegata senza formule difficili: le ampiezze si sommano come contributi con il segno, e quelle opposte si cancellano. Il meccanismo unico di ogni algoritmo quantistico.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { circuitLab } from '/js/widgets/circuit.js';
import { manyArrows } from '/js/widgets/twowaves.js';

const L = renderLesson({
  id: '07-interferenza',
  lead: `Hai già visto l'interferenza in azione (due H che riportano il qubit a zero). Adesso la guardiamo in faccia,
         perché è <b>l'unico</b> meccanismo che rende utile un computer quantistico. Tutto il resto è contorno.`,

  steps: [
    {
      t: 'Più strade per arrivare allo stesso risultato',
      html: `<p>Ecco la regola completa del calcolo quantistico, in due righe:</p>
             <div class="callout key">
               <b>1.</b> Se un risultato si può ottenere in <b>più modi diversi</b>, si <b>sommano le ampiezze</b> di tutti quei modi.<br>
               <b>2.</b> Solo <b>alla fine</b>, quando misuri, si eleva al quadrato per ottenere la probabilità.
             </div>
             <p>Sembra un dettaglio da nulla. Non lo è. Nel mondo classico si sommano <b>le probabilità</b>
             (numeri sempre positivi) e quindi più strade = più probabilità. Nel mondo quantistico si sommano
             <b>le ampiezze</b>, che possono avere segno opposto e quindi <b>annullarsi</b>.</p>
             <table class="table">
               <tr><th>Situazione</th><th>Mondo classico</th><th>Mondo quantistico</th></tr>
               <tr><td>due strade, ognuna al 50%</td><td>0,5 + 0,5 = <b>100%</b></td><td>ampiezze +0,7 e +0,7 → somma 1,4 → prob. 100%… <span class="muted">(troppo!)</span></td></tr>
               <tr><td>due strade con segno opposto</td><td>non esiste</td><td>ampiezze +0,7 e −0,7 → somma <b>0</b> → prob. <b>0%</b></td></tr>
             </table>
             <p class="dim small">(Il "troppo" della prima riga si sistema da solo: le porte quantistiche sono fatte in modo
             che il totale resti sempre 100%. È la regola di unitarietà del livello 3.)</p>
             <div class="callout"><b>Nomi da sapere:</b> quando le ampiezze si sommano e il risultato diventa più probabile
             si parla di <b>interferenza costruttiva</b>; quando si cancellano, di <b>interferenza distruttiva</b>.</div>`,
    },
    {
      t: 'Il conto completo di H · H (fatto una volta per tutte)',
      html: `<p>Rifacciamo il calcolo del livello 1, ma stavolta contando le <b>strade</b>. Partiamo da |0⟩ e applichiamo H due volte.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Le strade possibili', html: 'Dopo la prima H il qubit è "sia 0 sia 1". Dopo la seconda, per arrivare al risultato finale <b>1</b> ci sono <b>due strade</b>:<br>• strada A: 0 → 0 → 1<br>• strada B: 0 → 1 → 1' },
          { h: 'Ampiezza della strada A', html: 'H|0⟩ dà ampiezza <b>+1/√2</b> allo 0. Poi da 0 la seconda H dà <b>+1/√2</b> all\'1.<br>Ampiezza della strada = (+1/√2) × (+1/√2) = <b>+1/2</b>.' },
          { h: 'Ampiezza della strada B', html: 'H|0⟩ dà ampiezza <b>+1/√2</b> all\'1. Poi da 1 la seconda H dà <b>−1/√2</b> all\'1 (è la riga con il meno!).<br>Ampiezza della strada = (+1/√2) × (−1/√2) = <b>−1/2</b>.' },
          { h: 'Si sommano', html: '(+1/2) + (−1/2) = <b>0</b>.<br>Probabilità di leggere 1 = 0² = <b>0%</b>. Quel risultato non uscirà <b>mai</b>.' },
          { h: 'E il risultato 0?', html: 'Le due strade danno (+1/√2)(+1/√2) = +1/2 e (+1/√2)(+1/√2) = +1/2 → somma <b>1</b> → probabilità <b>100%</b>.<br>Ecco perché H·H|0⟩ = |0⟩ sempre.' },
          { h: 'La morale', html: 'Un computer quantistico non "prova tutte le strade e sceglie la migliore". <b>Percorre tutte le strade contemporaneamente e fa in modo che quelle sbagliate si cancellino a vicenda.</b> Se ti ricordi solo una frase di questo corso, che sia questa.' },
        ], { doneLabel: 'Il conto torna!' });
      },
      after: `<p>Verificalo con le tue mani: nel laboratorio qui sotto carica il preset <b>H·H = identità</b>,
              poi usa il cursore «esegui passo per passo» per vedere le ampiezze prima e dopo.
              Poi prova <b>H·Z·H</b>: cambiando <i>un solo segno</i> in mezzo, il risultato finale si ribalta completamente.</p>`,
    },
    {
      t: 'Provalo sul simulatore',
      html: `<p>Metti alla prova le due situazioni. Suggerimento: guarda il <b>colore</b> delle barre — barre di colore opposto
             sono ampiezze di segno opposto, cioè candidate a cancellarsi alla prossima porta.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'hzh', title: 'Ribalta il risultato', text: 'costruisci H → Z → H su q0 e ottieni |1⟩ al 100%.', xp: 45 });
        el.appendChild(m.root);
        circuitLab(el, {
          n: 1, maxCols: 6, preset: 'hh',
          title: 'Banco di prova dell\'interferenza', subtitle: '1 qubit, poche porte, molta sostanza',
          onChange: ({ ops, state }) => {
            const seq = ops.map(o => o.g).join(',');
            const p1 = state.re[1] ** 2 + state.im[1] ** 2;
            if (seq === 'H,Z,H' && p1 > 0.99) m.complete();
          },
        });
      },
    },
    {
      t: 'Quando due segni non bastano più',
      html: `<p>Finora le ampiezze sono state solo <b>positive o negative</b>: due sole direzioni, avanti e indietro.
             Con due sole direzioni si possono fare due cose: sommare (+ e +) o cancellare (+ e −).</p>
             <p>Ma immagina di avere <b>otto</b> possibilità e di volerne cancellare sette lasciandone in piedi una sola.
             Con soli due segni non ce la fai: ti servono ampiezze che puntino in <b>tante direzioni diverse</b>,
             così da poter <b>chiudere il cerchio</b> e sommare a zero.</p>
             <p>Gioca con il disordine qui sotto: con frecce tutte uguali la somma è enorme, con frecce sparse è zero.
             Le "direzioni" sono i gradi del livello 0·2.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'cancella', title: 'Fai sparire tutto', text: 'porta il disordine a 360° con almeno 20 frecce e ottieni una somma vicina a zero.', xp: 40 });
        el.appendChild(m.root);
        manyArrows(el, { onChange: ({ n, mag }) => { if (n >= 20 && mag < n * 0.25) m.complete(); } });
      },
      after: `<div class="callout key"><b>Ecco perché al prossimo livello arrivano i numeri complessi.</b>
              Non per fare i difficili: perché servono <b>frecce che puntano in qualsiasi direzione</b>,
              e i numeri complessi sono esattamente il modo comodo di scriverle. Tutto quello che imparerai
              al livello 8 serve a questo scopo preciso.</div>`,
    },
    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel simulatore prova <b>H → X → H</b> su un qubit. Che risultato ti aspetti? Verifica.
           <span class="muted">(esce |0⟩: X sull'equatore fa un altro tipo di giro)</span></p>
        <p><b>2.</b> Con 3 frecce, quali direzioni le fanno cancellare esattamente? <span class="muted">(0°, 120°, 240°)</span></p>
        <p><b>3.</b> Se un algoritmo deve far uscire <b>una</b> risposta fra 8, quante ampiezze deve cancellare?
           E che aspetto avrà l'istogramma finale?</p>
        <p class="mb0"><b>4.</b> Domanda da tenere in tasca fino al livello 11 (Grover): esiste un modo di fare le cancellazioni
           <b>a poco a poco</b> invece che tutte in un colpo?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Nel calcolo quantistico, quando un risultato si può ottenere in due modi diversi…',
      options: ['si sommano le probabilità', 'si sommano le ampiezze, e solo alla fine si eleva al quadrato', 'si prende la più grande', 'si moltiplicano le probabilità'], correct: 1,
      why: 'È la regola fondamentale. Sommare le ampiezze prima del quadrato è ciò che permette la cancellazione: sommando probabilità (sempre positive) non si potrebbe mai ottenere zero.' },
    { q: 'Due ampiezze +0,5 e −0,5 che si incontrano danno una probabilità di…',
      options: ['50%', '25%', '0%', '100%'], correct: 2,
      why: 'Somma = 0, quadrato = 0. Quel risultato non si osserva mai: interferenza distruttiva.' },
    { q: 'Perché H·H riporta il qubit esattamente a |0⟩?',
      options: ['perché H è casuale', 'perché le due strade verso |1⟩ hanno ampiezze opposte e si cancellano', 'perché H misura il qubit', 'per convenzione'], correct: 1,
      why: 'Le strade verso |1⟩ valgono +1/2 e −1/2: somma zero. Quelle verso |0⟩ valgono +1/2 e +1/2: somma 1.' },
    { q: 'Perché serviranno ampiezze "a freccia" invece che solo positive/negative?',
      options: ['per fare i conti più in fretta', 'per poter cancellare molte possibilità in modo controllato, non solo a coppie', 'perché i qubit sono complicati', 'per rappresentare più di 2 qubit'], correct: 1,
      why: 'Con due soli segni si possono solo sommare o cancellare coppie. Con frecce in tante direzioni si possono far chiudere il cerchio a molte ampiezze insieme: è il meccanismo della QFT.' },
  ],

  outro: `<div class="callout ok"><b>Cosa ti porti a casa:</b> le ampiezze si <b>sommano</b>, poi si eleva al quadrato;
          ampiezze opposte si cancellano; un algoritmo quantistico è una <b>regia delle cancellazioni</b>.
          Prossimo livello: diamo alle ampiezze la libertà di puntare ovunque.</div>`,
});
@endsection
