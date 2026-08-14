@php($description = 'Esponenziali e logaritmi spiegati giocando: quanti bit servono per N casi, quante volte si può dimezzare, e perché «polinomiale nel numero di cifre» è la frase che spiega il vantaggio quantistico di Shor.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { bitLab, dimezzaLab } from '/js/widgets/logaritmi.js';

const L = renderLesson({
  id: '00-logaritmi',
  lead: `«Logaritmo» è una parola che spaventa e nasconde una domanda semplicissima: <b>quante volte devo moltiplicare
         un numero per sé stesso per arrivare lì?</b> Nel corso serve quasi sempre in una forma sola — <b>quanti bit,
         o quanti qubit, servono</b> — ed è la stessa domanda di «quante cifre ha questo numero». Ci sono venti minuti
         di gioco fra te e la frase più importante di tutto il corso: <i>Shor è veloce nel numero di cifre</i>.`,

  steps: [
    {
      t: "L'esponenziale, in una riga: raddoppia e basta",
      html: `<p>Questa parte la sai già dal livello 0·1, quindi solo il richiamo: un interruttore ha due posizioni, due
             interruttori ne hanno quattro, tre ne hanno otto. Ogni interruttore in più <b>raddoppia</b>.</p>
             <div class="formula">con n interruttori scegli fra <span class="hl-n">2ⁿ</span> possibilità</div>
             <p>Il raddoppio è lento all'inizio e disumano dopo: 10 interruttori fanno 1024, 20 fanno più di un milione,
             30 più di un miliardo. È la crescita che il livello K·5 mette in gara con le altre.</p>
             <div class="callout key">Ma la domanda che serve davvero, nella pratica, è quasi sempre <b>quella
             girata</b>: non «2¹⁰ quanto fa», bensì «per mille cose, quanti interruttori mi servono?». Ed è lì che
             entra il logaritmo.</div>`,
    },

    {
      t: 'La domanda girata: il logaritmo',
      html: `<p>Nel gioco scegli quante cose devi distinguere — le 26 lettere, le 52 carte, i 365 giorni — e accendi
             interruttori finché non bastano. Cerca il <b>minimo</b>: quello sotto al quale non ce la fai più.</p>
             <p>Quel minimo <b>è</b> il logaritmo in base 2, arrotondato in su. Non è altro.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'bit', title: 'Il minimo che basta', text: 'trova il numero minimo di interruttori per 3 casi diversi.', xp: 35 });
        el.appendChild(m.root);
        bitLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Guarda lo scalino: per 1000 casi, 9 interruttori coprono 512 e <b>non bastano</b>; 10 coprono 1024 e
              bastano. Ecco perché si arrotonda sempre in su — mezzo interruttore non esiste.</p>
              <div class="formula">2¹⁰ = 1024 &nbsp;⟺&nbsp; log₂(1024) = <span class="hl-n">10</span></div>
              <p>Le due scritture dicono la stessa identica cosa, lette da due parti diverse. Il logaritmo è
              l'operazione che <b>disfa</b> l'elevamento a potenza — come la sottrazione disfa l'addizione e la
              divisione disfa la moltiplicazione (livello 0·7: solo le operazioni che si disfano si possono spostare
              da un piatto all'altro).</p>`,
    },

    {
      t: 'La stessa domanda travestita: quante volte posso dimezzare',
      html: `<p>Adesso una domanda che sembra un'altra cosa: parto da 1000 e continuo a <b>dimezzare</b>. Dopo quanti
             tagli resta uno solo?</p>
             <p>Provaci nel gioco, e poi guarda il numero che ti esce.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'dimezza', title: 'Fino a uno solo', text: 'dimezza fino in fondo e di\' quanti tagli sono serviti, su 2 numeri.', xp: 40 });
        el.appendChild(m.root);
        dimezzaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>È lo stesso numero di prima. Non per caso: sono <b>la stessa domanda</b>.</p>
              <div class="callout key">«Quante volte devo raddoppiare 1 per arrivare a N?» e «quante volte devo
              dimezzare N per arrivare a 1?» hanno per forza la stessa risposta: è la stessa scala percorsa nei due
              versi. Quel numero si chiama <b>log₂N</b>.</div>
              <p>E qui il corso si illumina in tre punti insieme:</p>
              <ul>
                <li>la <b>ricerca binaria</b> (livello K·4) dimezza lo scaffale a ogni domanda: ecco perché le domande
                    sono log₂N e non N;</li>
                <li>la <b>FFT</b> (livello 17) spezza il problema a metà a ogni stadio: gli stadi sono log₂N, e da lì
                    viene il costo N·log N;</li>
                <li><b>n qubit</b> gestiscono 2ⁿ ampiezze: girando la frase, per rappresentare N possibilità servono
                    log₂N qubit. Venti qubit per un milione di casi.</li>
              </ul>`,
    },

    {
      t: 'Il numero di cifre è un logaritmo (e qui casca il mondo)',
      html: `<p>Quante cifre ha un numero? Guarda cosa succede in base 10:</p>
             <table class="table">
               <tr><th>Numero</th><th>Cifre</th></tr>
               <tr><td class="mono">7</td><td class="mono">1</td></tr>
               <tr><td class="mono">1 000</td><td class="mono">4</td></tr>
               <tr><td class="mono">1 000 000</td><td class="mono">7</td></tr>
               <tr><td class="mono">1 000 000 000</td><td class="mono">10</td></tr>
             </table>
             <p>Il numero cresce di mille volte e le cifre aumentano di tre. Le cifre sono <b>il logaritmo</b> del
             numero: crescono pianissimo mentre il numero esplode.</p>
             <div class="callout key">Adesso rileggi la frase che nel livello di Shor sembra tecnica e invece è tutto:
             <p style="margin:8px 0 0"><i>«Shor fattorizza in tempo <b>polinomiale nel numero di cifre</b> di N».</i></p>
             <p class="mb0" style="margin-top:8px">Numero di cifre = log N. Quindi «polinomiale in log N», che è
             <b>infinitamente più veloce</b> di «polinomiale in N». Un numero da 600 cifre è grande come 10⁶⁰⁰, ma di
             cifre ne ha 600: un algoritmo che lavora sulle cifre ha di fronte un problema minuscolo rispetto a uno
             che lavora sul numero.</p></div>`,
      mount: el => {
        stepper(el, [
          { h: 'Il problema', html: 'Fattorizzare N provando i divisori uno per uno costa circa <b>√N</b> tentativi. Con N di 600 cifre, √N ha 300 cifre: più tentativi che atomi nell\'universo osservabile.' },
          { h: 'La misura giusta', html: 'La dimensione vera del problema non è N: è <b>quanto è lungo da scrivere</b>, cioè il numero di cifre, cioè log N. Un computer riceve 600 cifre, non 10⁶⁰⁰ oggetti.' },
          { h: 'Che cosa vuol dire «efficiente»', html: 'Un algoritmo si dice efficiente se il tempo cresce come una <b>potenza del numero di cifre</b> (log N al quadrato, al cubo…). Se invece cresce come √N o come N, è esponenziale <b>nel numero di cifre</b>: raddoppiare le cifre eleva al quadrato il lavoro.' },
          { h: 'Dove sta Shor', html: 'Shor sta nel primo gruppo: circa <b>(log N)³</b> operazioni. Ecco perché un numero da 600 cifre — inattaccabile classicamente — sarebbe alla portata di una macchina quantistica abbastanza grande.' },
          { h: 'E Grover?', html: 'Grover cerca in <b>√N</b> invece che in N: un guadagno reale ma <b>quadratico</b>, non esponenziale. Su un problema con 2ⁿ possibilità, resta 2^(n/2): tanto, ma sempre esponenziale nelle cifre. Da qui la differenza di fama fra i due algoritmi.' },
          { h: 'Il riassunto in una riga', html: 'Il vantaggio quantistico non è «va più veloce»: è <b>cambiare come cresce il tempo al crescere delle cifre</b>. E le cifre sono un logaritmo.' },
        ], { doneLabel: 'Chiaro!' });
      },
    },

    {
      t: 'Due regole che tornano utili',
      html: `<p>Chiudiamo con le due proprietà che si incontrano leggendo, e che sono meno misteriose di quanto
             sembrino.</p>`,
      mount: el => {
        formula(el, {
          title: 'Il logaritmo, pezzo per pezzo',
          parts: [
            { t: 'log(a · b)', id: 'p', color: 'cyan', name: 'il logaritmo di un prodotto', say: 'Il logaritmo trasforma le moltiplicazioni in somme: log(a·b) = log a + log b.', ex: 'log₂(8 · 4) = log₂32 = 5 = 3 + 2 ✓' },
            { t: '=' },
            { t: 'log a + log b', id: 's', color: 'green', name: 'somma dei due logaritmi', say: 'È il motivo per cui prima dei calcolatori si moltiplicava con le tavole logaritmiche e il regolo: sommare è più facile.', ex: 'E in informatica: raddoppiare i dati aggiunge UN passo alla ricerca binaria, non li raddoppia.' },
            { t: '·' },
            { t: 'log(aⁿ)', id: 'e', color: 'amber', name: 'il logaritmo di una potenza', say: 'Un esponente diventa un fattore: log(aⁿ) = n · log a.', ex: 'log₂(2¹⁰) = 10 · log₂2 = 10 · 1 = 10 ✓' },
            { t: '=' },
            { t: 'n · log a', id: 'n', color: 'violet', name: 'esponente che scende', say: 'È la regola che permette di scrivere «la crescita esponenziale, su scala logaritmica, è una retta».', ex: 'Su un grafico logaritmico 2ⁿ diventa una linea dritta: la pendenza è log 2.' },
          ],
        });
      },
      after: `<div class="callout ok">Non c'è bisogno di impararle a memoria: basta ricordare che il logaritmo
              <b>abbassa di un piano</b> tutto quello che tocca — le moltiplicazioni diventano somme, gli esponenti
              diventano fattori. È per questo che serve ogni volta che i numeri diventano ingestibili.</div>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Quanti qubit servono per rappresentare tutte le possibili risposte di un problema con un miliardo
           di casi? <span class="muted">(prova nel gioco: la risposta è 30)</span></p>
        <p><b>2.</b> Se un algoritmo classico impiega N passi e uno quantistico √N, quante volte più veloce è su un
           milione di casi? E su un miliardo? <span class="muted">(la risposta cresce, ed è per questo che Grover conta)</span></p>
        <p><b>3.</b> Un numero RSA da 2048 bit quante cifre decimali ha, all'incirca?
           <span class="muted">(indizio: 2048 · log₁₀2 ≈ 2048 · 0,301)</span></p>
        <p class="mb0"><b>4.</b> Da inventore: se domani si trovasse un algoritmo <b>classico</b> polinomiale nel
           numero di cifre per fattorizzare, che cosa succederebbe al vantaggio di Shor?
           <span class="muted">(non è escluso: nessuno ha mai dimostrato che fattorizzare sia difficile)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cos\'è log₂(1024)?', options: ['1024 diviso 2', 'il numero di volte che devi moltiplicare 2 per sé stesso per arrivare a 1024, cioè 10', '2 elevato a 1024', 'la metà di 1024'], correct: 1,
      why: '2¹⁰ = 1024, quindi log₂(1024) = 10. Le due scritture dicono la stessa cosa lette dai due lati.' },
    { q: 'Quanti bit servono per distinguere 1000 cose?', options: ['9', '10', '100', '1000'], correct: 1,
      why: 'Con 9 bit copri 512 casi: non bastano. Con 10 ne copri 1024: bastano, e sono il minimo. Si arrotonda sempre in su.' },
    { q: 'Quante volte si può dimezzare 1000 prima di scendere a 1?', options: ['3', '10', '100', '500'], correct: 1,
      why: 'Dieci: è lo stesso numero dei bit necessari, perché è la stessa domanda percorsa al contrario. Ed è il motivo per cui la ricerca binaria fa 10 confronti invece di 1000.' },
    { q: 'Perché «polinomiale nel numero di cifre» è così importante?', options: ['perché è più elegante', 'perché il numero di cifre è il logaritmo del numero: cresce pianissimo mentre il numero esplode', 'perché le cifre sono sempre poche', 'perché evita gli arrotondamenti'], correct: 1,
      why: 'Un numero da 600 cifre vale circa 10⁶⁰⁰. Un algoritmo che cresce come una potenza di 600 è trattabile; uno che cresce come 10⁶⁰⁰ non lo è. Tutto il vantaggio di Shor sta in questa differenza.' },
    { q: 'Quanto fa log(a · b)?', options: ['log a · log b', 'log a + log b', 'log a − log b', 'a · log b'], correct: 1,
      why: 'Il logaritmo trasforma i prodotti in somme. È la proprietà che ha reso possibili regoli e tavole logaritmiche, e che rende dritte le curve esponenziali sui grafici logaritmici.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> Un logaritmo è «quante volte devo raddoppiare», che è anche «quante
          volte posso dimezzare», che è anche «quante cifre servono». Con questo in mano, «n qubit per 2ⁿ ampiezze» e
          «polinomiale nel numero di cifre» smettono di essere formule da subire e diventano frasi che dicono qualcosa
          di preciso.</div>`,
});
@endsection
