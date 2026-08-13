@php($description = 'L\'algoritmo di Bernstein-Vazirani spiegato giocando: trovare una stringa segreta di n bit con una sola interrogazione invece di n.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { confronto } from '/js/core/confronto.js';
import { bvLab } from '/js/widgets/algos.js';
import { oracoloClassico } from '/js/widgets/classic2.js';

const L = renderLesson({
  id: '10-bernstein',
  lead: `Stesso schema del livello 9, problema più concreto: c'è una <b>stringa segreta</b> e devi indovinarla.
         Classicamente serve una domanda per ogni bit. Quantisticamente: <b>una sola, sempre</b>.`,

  steps: [
    {
      t: 'Prima, in classico: una domanda per ogni bit',
      html: `<p>La scatola nasconde una stringa segreta e risponde alle tue domande con un solo bit: la somma
             (modulo 2) dei bit che la tua domanda e il segreto hanno in comune.</p>
             <p>Gioca prima classicamente. La strategia migliore è ovvia una volta vista: chiedi
             <code>1000</code>, e la risposta <b>è</b> il primo bit del segreto; poi <code>0100</code> per il
             secondo, e così via. Un bit di segreto per ogni domanda — e non si può fare di meglio, perché
             ogni risposta è un bit solo e i bit da scoprire sono n.</p>`,
      mount: el => { oracoloClassico(el, { modo: 'bernstein', bits: 4 }); },
      after: confronto({
        titolo: 'Quattro bit segreti: quattro domande, o una?',
        livello: 'k4-ricerca',
        vaiA: 'Ripassa il costo di una ricerca (K·4)',
        classico: {
          titolo: 'Un bit alla volta',
          html: `<p>Ogni interrogazione restituisce <b>un bit</b> di informazione. Il segreto ne contiene
                 <b>n</b>. Quindi servono <b>n interrogazioni</b>, e questo è un limite dimostrato — non un
                 difetto della strategia.</p>
                 <p class="mb0">Con un segreto di 128 bit: 128 domande.</p>`,
        },
        quantistico: {
          titolo: 'Tutti i bit in un colpo',
          html: `<p>Bernstein–Vazirani interroga l'oracolo con tutti gli ingressi in sovrapposizione: la risposta
                 finisce nelle <b>fasi</b>, e uno strato di Hadamard la riporta a essere un numero leggibile.</p>
                 <p class="mb0">Misuri una volta sola e leggi <b>l'intera stringa</b>, con probabilità 100%.
                 Con un segreto di 128 bit: <b>1</b> domanda.</p>`,
        },
        numeri: [
          { cosa: 'segreto di 4 bit (il gioco qui sopra)', classico: '4 domande', quantistico: '1' },
          { cosa: 'segreto di 128 bit', classico: '128 domande', quantistico: '1' },
          { cosa: 'probabilità di sbagliare', classico: '0', quantistico: '0' },
        ],
        verdetto: `<b>Qui il vantaggio è lineare (n → 1), non esponenziale come in Simon o Shor.</b> Ma è il
                   primo caso in cui la risposta esce <b>completa e certa</b>, e non solo "di che tipo era la
                   funzione": vale la pena guardare bene come, perché è lo schema di tutto il resto.`,
      }),
    },
    {
      t: 'Il problema del segreto',
      html: `<p>C'è una stringa segreta <b>s</b> di n bit (per esempio <code>1011</code>). L'oracolo non te la dice,
             ma risponde a questa domanda: dato un ingresso x, <b>quanti bit hanno in comune s e x</b>… ma solo
             se sono <b>pari o dispari</b>.</p>
             <div class="formula">f(x) = s · x mod 2 &nbsp;&nbsp;<span class="muted">(somma dei bit in comune, tenuta pari/dispari)</span></div>
             <p>Esempio con s = <code>1011</code>:</p>
             <pre><code>x = 0001 →  bit in comune: 1     → dispari → f = 1
x = 0110 →  bit in comune: 1     → dispari → f = 1
x = 1010 →  bit in comune: 2     → pari    → f = 0</code></pre>
             <p><b>Strategia classica:</b> chiedi <code>0001</code> e scopri l'ultimo bit di s. Poi <code>0010</code> e scopri
             il penultimo. E così via: <b>n domande</b> per n bit. Non si può fare di meglio classicamente,
             nemmeno con la fortuna: ogni risposta è un solo bit di informazione.</p>`,
    },
    {
      t: 'La soluzione quantistica: una domanda',
      html: `<p>Le tre mosse sono le stesse del livello 9 — <b>H, oracolo, H</b> — ma il risultato è molto più bello:
             invece di un sì/no, esce <b>la stringa segreta per intero</b>.</p>
             <p>Guarda le barre: dopo la seconda Hadamard <b>una sola</b> è alta al 100%, e la sua etichetta <b>è</b> il segreto.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'bv', title: 'Ruba il segreto', text: 'trova la stringa segreta con l\'interrogazione quantistica.', xp: 55 });
        el.appendChild(m.root);
        bvLab(el, { n: 4, onWin: () => m.complete() });
      },
    },
    {
      t: 'Perché esce proprio s (e non un\'altra cosa)',
      html: `<p>Il conto è più semplice di quanto sembri, e vale la pena farlo perché è <b>lo stesso conto della QFT</b>
             in versione ridotta.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Dopo la prima H', html: 'Tutte le 2^n possibilità con la stessa ampiezza. Chiamiamola "griglia piatta".' },
          { h: 'Dopo l\'oracolo', html: 'Ogni possibilità x prende il segno (−1)^(s·x). Il risultato è una <b>scacchiera di segni</b>, e il disegno di quella scacchiera dipende <b>soltanto</b> da s. In pratica: <b>s è stato scritto nelle fasi</b>.' },
          { h: 'Cosa fa la seconda H', html: 'La Hadamard su n qubit trasforma ogni stato |y⟩ in una combinazione con segni (−1)^(x·y). Sommando su tutte le x, l\'ampiezza dello stato |y⟩ diventa proporzionale a<br><code>Σ_x (−1)^(s·x + x·y)</code>' },
          { h: 'La cancellazione', html: 'Se <b>y ≠ s</b>, gli esponenti sono metà pari e metà dispari: metà +1 e metà −1 → somma <b>zero</b>. Interferenza distruttiva perfetta.<br>Se <b>y = s</b>, gli esponenti si annullano fra loro (s·x + x·s è sempre pari) → tutti +1 → somma <b>massima</b>.' },
          { h: 'Risultato', html: 'Ampiezza 1 su |s⟩, zero su tutto il resto. Misuri una volta e leggi <b>s</b>. Nessuna ripetizione, nessuna probabilità di errore.' },
          { h: 'Il collegamento con il seguito', html: 'Questa è già una <b>trasformata di Fourier</b>, nella sua versione più semplice (quella su ±1, detta trasformata di Hadamard–Walsh). Al livello 18 faremo la stessa cosa con frecce che puntano in <b>tutte</b> le direzioni invece che solo + e −: quella sarà la QFT.' },
        ], { doneLabel: 'Chiarissimo!' });
      },
    },
    {
      t: 'Perché questo conta più di Deutsch–Jozsa',
      html: `<p>Deutsch–Jozsa si batte facilmente con un algoritmo classico <b>probabilistico</b> (poche domande a caso
             e sei quasi sicuro). Bernstein–Vazirani no: anche accettando una piccola probabilità di errore,
             classicamente servono <b>dell'ordine di n</b> domande, perché ogni risposta contiene un solo bit di informazione.</p>
             <div class="callout key">Bernstein–Vazirani è quindi il primo esempio di vantaggio quantistico <b>solido</b>:
             n domande contro 1, anche contro il miglior algoritmo classico randomizzato.
             Il salto è "solo" lineare, ma è reale — e la tecnica (scrivere un'intera stringa nelle fasi e leggerla con
             una trasformata) è esattamente quella che, applicata alle <b>periodicità</b>, porterà a Simon e a Shor.</div>
             <p class="dim small">Nota di sicurezza informatica: no, questo non "rompe le password". L'oracolo qui è una
             funzione matematica molto speciale con una struttura lineare. Le funzioni usate in crittografia sono progettate
             apposta per non avere strutture di questo tipo.</p>`,
    },
    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel gioco, quante domande classiche servono per un segreto di 4 bit? E per uno di 64 bit?</p>
        <p><b>2.</b> Se il segreto fosse <code>0000</code>, cosa risponderebbe l'oracolo a qualunque domanda?
           E il metodo quantistico funzionerebbe lo stesso?</p>
        <p><b>3.</b> Prova a spiegare a parole tue perché tutte le barre tranne una si cancellano.</p>
        <p class="mb0"><b>4.</b> Domanda da inventore: e se l'oracolo, invece di nascondere una stringa, nascondesse
           una <b>periodicità</b> ("f(x) = f(x + r) per un certo r")? Che cosa dovresti mettere al posto delle Hadamard finali?
           <i>(Se rispondi "una trasformata di Fourier", hai appena inventato metà dell'algoritmo di Shor.)</i></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Quante interrogazioni servono classicamente per trovare una stringa segreta di n bit?',
      options: ['1', 'n', 'log n', '2^n'], correct: 1,
      why: 'Ogni risposta vale un bit di informazione: servono n domande, una per bit. Quantisticamente ne basta una.' },
    { q: 'Dopo la seconda Hadamard, lo stato di Bernstein–Vazirani è…',
      options: ['una sovrapposizione uniforme', 'esattamente |s⟩ con probabilità 100%', 'entangled', 'casuale'], correct: 1,
      why: 'Tutte le altre ampiezze si cancellano per interferenza distruttiva: resta solo la stringa segreta.' },
    { q: 'Che cosa fa l\'oracolo in questo algoritmo?',
      options: ['rivela s direttamente', 'scrive s nel disegno dei segni (le fasi)', 'misura i qubit', 'crea entanglement'], correct: 1,
      why: 'Il segno (−1)^(s·x) dipende da s: il segreto viene "disegnato" nelle fasi, invisibile alle probabilità ma leggibile dall\'interferenza.' },
    { q: 'La trasformata realizzata da n Hadamard in parallelo si chiama…',
      options: ['trasformata di Fourier quantistica', 'trasformata di Hadamard–Walsh', 'trasformata di Laplace', 'diffusione di Grover'], correct: 1,
      why: 'È la versione "solo + e −" della trasformata di Fourier. La QFT (livello 18) è la stessa idea con fasi in tutte le direzioni.' },
  ],

  outro: `<div class="callout ok"><b>Cosa ti porti a casa:</b> si può scrivere un'<b>intera stringa</b> nelle fasi e
          rileggerla con una trasformata; n domande → 1. Prossimo livello: e se invece di una struttura nascosta
          dovessimo cercare <b>un ago in un pagliaio senza struttura</b>?</div>`,
});
@endsection
