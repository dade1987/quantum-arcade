@php($description = 'Due qubit, prodotto tensoriale, porta CNOT, stati di Bell ed entanglement spiegati con un simulatore interattivo: perché il tutto sa più delle parti.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { twoQubitLab } from '/js/widgets/quantum2.js';
import { confronto } from '/js/core/confronto.js';
import { bellCoppia } from '/js/widgets/coppie.js';
import { stepper, formula } from '/js/core/formula.js';

const L = renderLesson({
  id: '04-due-qubit',
  lead: `Con un qubit avevamo 2 ampiezze. Con due qubit ne abbiamo <b>4</b>, con tre <b>8</b>, con n qubit <b>2^n</b>
         (le potenze di 2 del livello 0·1!). E soprattutto: compare un fenomeno che nel mondo classico non esiste,
         l'<b>entanglement</b>.`,

  steps: [
    {
      t: 'Prima, in classico: due bit, e le correlazioni che si possono fare',
      html: `<p>Due bit classici hanno quattro configurazioni: 00, 01, 10, 11. Il computer ne tiene <b>una</b>.
             Fin qui niente di nuovo.</p>
             <p>Ma i due bit possono essere <b>correlati</b>, e questo si fa anche classicamente. Metti due
             biglietti uguali in due buste — o tutti e due «0», o tutti e due «1» — mescola, e manda una busta
             a Roma e una a Sydney. Chi apre a Roma sa immediatamente cosa c'è a Sydney. Non c'è niente di
             misterioso: <b>l'informazione era già nella busta</b> da quando è partita.</p>
             <p>E quello che le buste <b>non</b> sanno fare si può misurare, adesso, con un gioco. Alice e Bob
             sono lontani e ricevono una domanda a testa; vincono il turno se le loro risposte stanno in un certo
             rapporto con le domande. Con qualunque accordo preso prima di separarsi non si supera il <b>75%</b>
             dei turni vinti — provale tutte. Con una coppia entangled si arriva all'<b>85%</b>.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'bell', title: 'Il sorpasso del 75%', text: 'gioca 100 turni con le buste, poi 100 con l\'entanglement e supera il 78%.', xp: 45 });
        el.appendChild(m.root);
        bellCoppia(el, { onWin: () => m.complete() });
      },
      after: `<p>Quel sorpasso è l'esperimento che ha vinto il Nobel per la fisica nel 2022. Da qui in avanti,
             quando fra poco leggerai «i due qubit entangled danno sempre lo stesso risultato», saprai che
             <b>non</b> è quella la parte sorprendente: le buste fanno già così.</p>` +
             confronto({
               titolo: 'Correlazione classica e entanglement',
               livello: 'k1-bit',
               vaiA: 'Ripassa i bit (livello K·1)',
               classico: {
                 titolo: 'Due buste sigillate',
                 html: `<p>Il contenuto è deciso <b>alla partenza</b>. Aprire una busta ti dice l'altra, ma non
                        cambia niente: stai solo leggendo una cosa già scritta.</p>
                        <p class="mb0">Le correlazioni classiche rispettano un limite preciso (le
                        <b>disuguaglianze di Bell</b>): certe combinazioni di misure non superano mai il 75%
                        di accordo.</p>`,
               },
               quantistico: {
                 titolo: 'Due qubit entangled',
                 html: `<p>Il contenuto <b>non è deciso</b> prima della misura — e non è ignoranza nostra, è
                        dimostrato sperimentalmente.</p>
                        <p class="mb0">Le stesse combinazioni di misure arrivano all'<b>85%</b> di accordo. È il
                        numero che ha vinto il Nobel per la fisica nel 2022, ed è il modo in cui si distingue,
                        in laboratorio, una busta da un entanglement.</p>`,
               },
               numeri: [
                 { cosa: 'configurazioni possibili', classico: '4', quantistico: '4 ampiezze insieme' },
                 { cosa: 'stato deciso prima della misura', classico: 'sì', quantistico: 'no' },
                 { cosa: 'accordo massimo nel test di Bell', classico: '75%', quantistico: '~85% (misurato)' },
               ],
               verdetto: `<b>«Correlati» non basta a spiegare l'entanglement — le buste sono correlate.</b> Quello
                          che le buste non possono fare è superare il 75%, e i qubit lo fanno. Da lì in avanti
                          nessuna spiegazione «classica ma nascosta» regge più.`,
             }),
    },
    {
      t: 'Due qubit = quattro possibilità',
      html: `<p>Se hai due monete, i risultati possibili sono quattro: TT, TC, CT, CC. Con due qubit è uguale,
             solo che ogni possibilità ha la sua <b>freccia</b>:</p>
             <div class="formula">|ψ⟩ = <span class="hl-n">a</span>|00⟩ + <span class="hl-k">b</span>|01⟩ + <span class="hl-N">c</span>|10⟩ + <span class="hl-x">d</span>|11⟩
             &nbsp;&nbsp; con &nbsp; |a|²+|b|²+|c|²+|d|² = 1</div>
             <p class="dim small">Convenzione usata in tutto il corso: nella scrittura |q₁q₀⟩ il qubit <b>q0</b> è quello
             più a destra. Quindi |10⟩ significa "q1 vale 1, q0 vale 0".</p>
             <p>Se i due qubit sono indipendenti, le quattro ampiezze si ottengono <b>moltiplicando</b> quelle dei singoli
             (si chiama <b>prodotto tensoriale</b>, ma è solo "tutte le combinazioni"):</p>
             <pre><code>qubit A = a₀|0⟩ + a₁|1⟩        qubit B = b₀|0⟩ + b₁|1⟩

insieme:  a₀b₀|00⟩ + a₀b₁|01⟩ + a₁b₀|10⟩ + a₁b₁|11⟩
          └── ogni combinazione: probabilità che accada A e accada B ──┘</code></pre>
             <p>Esattamente come "probabilità di due cose insieme = si moltiplicano" del livello 0·4. Nessuna novità… ancora.</p>`,
    },
    {
      t: 'La porta CNOT: la prima porta a due qubit',
      html: `<p>CNOT ("NOT controllato") guarda un qubit (il <b>controllo</b>) e, <b>solo se vale 1</b>, ribalta l'altro
             (il <b>bersaglio</b>). In tabella:</p>
             <table class="table">
               <tr><th>prima</th><th>dopo</th><th>cosa è successo</th></tr>
               <tr><td class="mono">|00⟩</td><td class="mono">|00⟩</td><td>controllo 0 → non tocca niente</td></tr>
               <tr><td class="mono">|01⟩</td><td class="mono">|11⟩</td><td>controllo 1 → ribalta il bersaglio</td></tr>
               <tr><td class="mono">|10⟩</td><td class="mono">|10⟩</td><td>controllo 0 → niente</td></tr>
               <tr><td class="mono">|11⟩</td><td class="mono">|01⟩</td><td>controllo 1 → ribalta</td></tr>
             </table>
             <p class="dim small">(qui il controllo è q0, il bersaglio q1)</p>
             <div class="callout"><b>Nota da informatico:</b> CNOT è <b>reversibile</b> — applicandola due volte torni al punto
             di partenza — e può fare da "copia" per i bit classici (se il bersaglio parte da 0, si ritrova uguale al controllo).
             Questa è la porta con cui Fredkin e Toffoli mostravano che si può calcolare senza distruggere informazione.
             <b>Ma attenzione:</b> copia i <i>bit</i>, non gli <i>stati quantistici</i>. Su una sovrapposizione fa
             tutt'altro — e proprio quel "tutt'altro" è l'entanglement.</div>`,
    },
    {
      t: 'La ricetta di Bell: H + CNOT',
      html: `<p>Adesso il momento clou. Nel gioco premi in sequenza <b>H q0</b> e poi <b>CNOT q0→q1</b>.
             Guarda le barre delle ampiezze e le due sfere di Bloch.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'bell', title: 'Crea uno stato di Bell', text: 'premi H q0 e poi CNOT q0→q1: il test di separabilità deve segnalare "intrecciati".', xp: 50 });
        el.appendChild(m.root);
        twoQubitLab(el, { onEntangle: () => m.complete() });
      },
      after: `<div class="callout key"><b>Cosa è successo:</b> lo stato è <code>(|00⟩ + |11⟩)/√2</code>.
              Solo due possibilità: <b>entrambi 0</b> o <b>entrambi 1</b>, al 50%. Mai 01, mai 10.<br><br>
              E le due sfere di Bloch si sono <b>accorciate fino a sparire</b>: presi da soli, i due qubit non hanno
              più nessuno stato definito. <b>L'informazione non sta nelle parti: sta nella relazione fra le parti.</b>
              Questo è l'entanglement.</div>`,
    },
    {
      t: 'Come si riconosce l\'entanglement (il conto vero)',
      html: `<p>Uno stato a due qubit è <b>separabile</b> (= i due qubit sono indipendenti) se e solo se si può scrivere
             come prodotto di due stati singoli. C'è un test velocissimo:</p>
             <div class="formula">a·d − b·c = 0 &nbsp;→&nbsp; separabile &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
             a·d − b·c ≠ 0 &nbsp;→&nbsp; <span class="hl-x">ENTANGLED</span></div>`,
      mount: el => {
        stepper(el, [
          { h: 'Esempio 1', html: 'Stato <code>(|00⟩ + |01⟩)/√2</code> → a = b = 1/√2, c = d = 0.<br>a·d − b·c = 0 − 0 = <b>0</b> → separabile. Infatti è "q1 sta a 0, q0 è in sovrapposizione": due qubit indipendenti.' },
          { h: 'Esempio 2 (Bell)', html: 'Stato <code>(|00⟩ + |11⟩)/√2</code> → a = d = 1/√2, b = c = 0.<br>a·d − b·c = 1/2 − 0 = <b>1/2 ≠ 0</b> → <b>ENTANGLED</b>.' },
          { h: 'Perché il test funziona', html: 'Se lo stato fosse un prodotto, avresti a = a₀b₀, b = a₀b₁, c = a₁b₀, d = a₁b₁. Facendo a·d otterresti a₀b₀a₁b₁, e facendo b·c otterresti a₀b₁a₁b₀: gli stessi quattro fattori! La differenza sarebbe per forza zero.' },
          { h: 'La conseguenza fisica', html: 'Se lo stato è entangled, misurando <b>un solo</b> qubit ottieni un risultato casuale, ma <b>determini istantaneamente</b> anche l\'altro. Non importa quanto siano lontani.' },
          { h: 'Il limite (importante!)', html: 'Questo NON permette di trasmettere informazione più veloce della luce: chi sta dall\'altra parte vede solo risultati casuali. Se ne accorge solo <b>confrontando i risultati</b>, e per confrontarli serve una telefonata normale. Ci torniamo al livello 6.' },
        ], { doneLabel: 'Test capito!' });
      },
    },
    {
      t: 'Perché l\'entanglement è la vera risorsa',
      html: `<p>Contiamo i numeri necessari per descrivere lo stato:</p>
             <table class="table">
               <tr><th>Sistema</th><th>Descrizione classica</th><th>Descrizione quantistica</th></tr>
               <tr><td>2 qubit separabili</td><td>2 + 2 numeri</td><td>2 + 2 numeri: basta descriverli uno per uno</td></tr>
               <tr><td>2 qubit entangled</td><td>—</td><td><b>4 numeri</b>: non c'è modo di scomporre</td></tr>
               <tr><td>50 qubit entangled</td><td>—</td><td><b>2⁵⁰ ≈ 10¹⁵ numeri</b></td></tr>
             </table>
             <div class="callout key">Ecco perché simulare un computer quantistico su un computer normale diventa
             impossibile in fretta: già a 50 qubit dovresti tenere in memoria un milione di miliardi di numeri complessi.
             <b>Non è la sovrapposizione da sola a rendere difficile il calcolo classico: è l'entanglement.</b>
             (Uno stato senza entanglement, per quanto in sovrapposizione, si simula benissimo su un portatile.)</div>
             <p class="dim">Curiosità storica: fu proprio questa impossibilità a far dire a Richard Feynman, nel 1981,
             una frase che ha fondato il settore: «La natura non è classica, accidenti, e se volete simularla vi conviene
             farla quantistica».</p>`,
    },
    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Crea lo stato di Bell, poi misura 200 volte: quante volte esce 01 o 10? <span class="muted">(zero — sempre)</span></p>
        <p><b>2.</b> Prova <b>H q0</b> e <b>H q1</b> (senza CNOT): il test dice separabile o entangled? Perché,
           se sono in sovrapposizione tutti e due?</p>
        <p><b>3.</b> Dopo aver creato Bell, applica <b>Z q0</b>: le probabilità cambiano? E lo stato?
           <span class="muted">(diventa (|00⟩ − |11⟩)/√2: un altro stato di Bell, invisibile alle probabilità)</span></p>
        <p class="mb0"><b>4.</b> Riesci a "disfare" l'entanglement e tornare a |00⟩? <span class="muted">(sì: CNOT poi H — le porte sono reversibili!)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Con 4 qubit, quante ampiezze descrivono lo stato?',
      options: ['4', '8', '16', '32'], correct: 2,
      why: '2⁴ = 16. Ogni qubit aggiunto raddoppia il numero di ampiezze.' },
    { q: 'Lo stato (|00⟩ + |11⟩)/√2 misurato dà…',
      options: ['sempre 00', '00 o 11, al 50%, mai 01 o 10', 'i quattro risultati equiprobabili', '01 o 10'], correct: 1,
      why: 'Le ampiezze di 01 e 10 sono zero: quei risultati non escono mai. I due qubit sono perfettamente correlati.' },
    { q: 'Cosa fa la CNOT quando il controllo è in sovrapposizione?',
      options: ['ribalta a metà il bersaglio', 'crea entanglement fra i due qubit', 'misura il controllo', 'non fa nulla'], correct: 1,
      why: 'Su un controllo in sovrapposizione la CNOT lega i due qubit: il risultato non si può più scomporre in due stati separati.' },
    { q: 'Perché simulare 50 qubit entangled su un PC è impraticabile?',
      options: ['perché i qubit sono veloci', 'perché servirebbero 2⁵⁰ numeri complessi in memoria', 'perché la misura è casuale', 'perché mancano le librerie'], correct: 1,
      why: 'Circa 10¹⁵ ampiezze: petabyte di memoria solo per scrivere lo stato. È l\'osservazione di Feynman che ha dato il via al calcolo quantistico.' },
  ],

  outro: `<div class="callout ok"><b>Cosa ti porti a casa:</b> n qubit = 2^n ampiezze; la CNOT lega i qubit;
          uno stato entangled non si può descrivere qubit per qubit; l'entanglement — non la sola sovrapposizione —
          è ciò che rende il calcolo quantistico difficile da imitare. Ora vediamo cosa <b>puoi</b> e cosa <b>non puoi</b>
          farci: no-cloning e teletrasporto.</div>`,
});
@endsection
