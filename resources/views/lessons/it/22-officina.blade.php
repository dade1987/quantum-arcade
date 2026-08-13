@php($description = 'Sandbox creativa: monta pipeline quantistiche con blocchi (Hadamard, oracolo, QFT, diffusore), affronta sfide con funzioni segrete e cerca di risolverle con meno interrogazioni possibili.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { officina } from '/js/widgets/officina.js';

const L = renderLesson({
  id: '22-officina',
  lead: `Fin qui hai <b>ripercorso</b> algoritmi inventati da altri. Adesso tocca a te: qui non c'è una soluzione scritta
         da nessuna parte. Hai dei blocchi, hai delle sfide con dentro una funzione segreta, e un contatore che misura
         quanto sei stato furbo. <b>Questo livello non si "finisce": si migliora.</b>`,

  steps: [
    {
      t: 'La tavolozza dell\'inventore',
      html: `<p>Ogni algoritmo quantistico che hai visto è fatto degli stessi quattro tempi:</p>
             <div class="formula" style="font-size:15px">
               <span class="hl-n">metti tutto in gioco</span> → <span class="hl-k">scrivi l'informazione nelle fasi</span>
               → <span class="hl-N">fai interferire</span> → <span class="hl-x">misura</span>
             </div>
             <table class="table">
               <tr><th>Blocco</th><th>Cosa fa</th><th>Dove l'hai visto</th></tr>
               <tr><td><b>H su tutti</b></td><td>tutte le possibilità con la stessa ampiezza</td><td>livelli 3, 9, 10, 11</td></tr>
               <tr><td><b>❓ ORACOLO</b></td><td>l'unica cosa che "sa" la risposta. <b>Ogni uso conta come una domanda</b></td><td>livelli 9, 10, 11</td></tr>
               <tr><td><b>📢 Diffusore</b></td><td>riflette attorno alla media: amplifica ciò che l'oracolo ha marcato</td><td>livello 11 (Grover)</td></tr>
               <tr><td><b>QFT / QFT†</b></td><td>trasforma periodicità in picchi (e viceversa)</td><td>livelli 18, 19, 20</td></tr>
               <tr><td><b>− su |0…0⟩</b> e <b>X su tutti</b></td><td>mattoni per costruire diffusori diversi</td><td>—</td></tr>
             </table>
             <div class="callout key"><b>Regola del gioco:</b> vince chi risolve la sfida con <b>meno interrogazioni
             dell'oracolo</b>. Non conta quante porte usi: conta quante volte chiedi. È esattamente il criterio con cui
             si misurano gli algoritmi nella ricerca vera (<i>query complexity</i>).</div>`,
    },
    {
      t: 'L\'officina',
      html: `<p>Scegli una sfida, costruisci la pipeline, premi <b>LANCIA</b>, guarda l'istogramma e prova a dare la risposta.
             Se sbagli non succede niente: cambia pipeline e riprova.</p>
             <p><b>Le quattro sfide</b> (e il tuo obiettivo minimo):</p>
             <ul>
               <li><b>Costante o bilanciata?</b> — obiettivo: <b>1 interrogazione</b>.</li>
               <li><b>La stringa segreta</b> — obiettivo: <b>1 interrogazione</b>.</li>
               <li><b>Trova l'ago</b> — obiettivo: <b>2 interrogazioni</b> con N = 8 (Grover ottimale).</li>
               <li><b>Trova il periodo</b> — obiettivo: <b>1 interrogazione</b> + la trasformata giusta.</li>
             </ul>`,
      mount: (el, api) => {
        const m1 = api.mission({ key: 'solve1', title: 'Prima vittoria', text: 'risolvi una sfida qualsiasi.', xp: 60 });
        const m2 = api.mission({ key: 'solve-eff', title: 'Con una sola domanda', text: 'risolvi una sfida usando UNA sola interrogazione dell\'oracolo.', xp: 90 });
        el.append(m1.root, m2.root);
        officina(el, {
          n: 3,
          onSolve: ({ queries }) => { m1.complete(); if (queries <= 1) m2.complete(); },
        });
      },
      after: `<div class="callout"><b>Se le barre sono tutte uguali dopo il lancio</b>, vuol dire che hai messo tutto in gioco
              e hai interrogato l'oracolo, ma non hai fatto <b>interferire</b> niente: la misura ti darà un risultato a caso.
              Manca il terzo tempo. Prova ad aggiungere H su tutti (o una QFT) <b>dopo</b> l'oracolo.</div>`,
    },
    {
      t: 'Come si inventa davvero un algoritmo quantistico',
      html: `<p>Non esiste una ricetta, ma esiste un <b>metodo</b> che i ricercatori usano davvero. Provalo qui dentro:</p>
             <ol>
               <li><b>Chiediti che struttura ha il problema.</b> Periodica? Lineare? Nessuna struttura?
                   Senza struttura il massimo ottenibile è Grover (√N): è dimostrato.</li>
               <li><b>Trova un modo di scrivere quella struttura nelle fasi.</b> È il ruolo dell'oracolo:
                   trasforma "quale x mi interessa" in "quali x hanno un segno diverso".</li>
               <li><b>Trova la trasformazione che rende quella struttura visibile.</b>
                   Hadamard se la struttura è lineare (Bernstein–Vazirani), QFT se è periodica (Shor),
                   diffusore se è un singolo elemento marcato (Grover).</li>
               <li><b>Conta le interrogazioni e la profondità.</b> Se il tuo algoritmo usa 1000 porte per risparmiare
                   una domanda, su hardware reale hai perso.</li>
               <li><b>Cerca di batterlo classicamente.</b> Metà dei "vantaggi quantistici" annunciati sono caduti così.
                   Se non riesci a batterlo, forse hai qualcosa.</li>
             </ol>
             <div class="callout think"><b>Sfide aperte da provare qui dentro</b> (nessuna ha una soluzione scritta nel sito):
             <ol style="margin:8px 0 0">
               <li>Nella sfida <b>periodo</b>, la QFT dopo l'oracolo funziona. Ma serve davvero <b>tutta</b> la QFT,
                   o basta qualcosa di più semplice quando r è una potenza di 2?</li>
               <li>Nella sfida <b>ago</b>: cosa succede se applichi <b>due</b> oracoli di fila senza diffusore in mezzo?
                   E se metti il diffusore <b>prima</b> dell'oracolo?</li>
               <li>Riesci a costruire una pipeline che risolva <b>due sfide diverse</b> senza modifiche?</li>
               <li>Progetta una pipeline che, invece di dare la risposta certa, la dia con il 70% di probabilità
                   ma usando <b>meno</b> interrogazioni. È un compromesso accettabile? Quando?</li>
               <li>Inventa una <b>quinta sfida</b> che ti piacerebbe che esistesse, e chiediti quale blocco ti manca
                   per risolverla. Quel blocco mancante è, molto probabilmente, un algoritmo nuovo.</li>
             </ol></div>`,
    },
    {
      t: 'Il tuo taccuino',
      html: `<p>Gli algoritmi non nascono al primo colpo. Tieni traccia di cosa hai provato — anche solo su carta —
             con tre colonne: <b>pipeline</b>, <b>interrogazioni usate</b>, <b>cosa ho osservato</b>.
             Il "cosa ho osservato" è la colonna che conta: è lì che si vedono i pattern.</p>
             <div class="callout ok"><b>Un consiglio da chi programma:</b> quando una pipeline fa qualcosa di inaspettato,
             <b>non cancellarla</b>. Prima capisci <i>perché</i> ha fatto quello. Metà delle scoperte scientifiche sono
             cominciate con un "strano, non doveva succedere".</div>
             <p class="dim small">Se trovi qualcosa di interessante, scrivimelo: le pipeline migliori dei giocatori
             finiranno in una sezione dedicata di questo sito, con il nome di chi le ha trovate.</p>`,
    },
  ],

  quiz: [
    { q: 'Qual è la struttura comune a tutti gli algoritmi quantistici visti nel corso?',
      options: ['misura → porta → misura', 'sovrapposizione → oracolo (fasi) → interferenza → misura', 'copia → confronto → scelta', 'entanglement → teletrasporto'], correct: 1,
      why: 'Cambia solo il terzo tempo: Hadamard per strutture lineari, QFT per strutture periodiche, diffusore per un elemento marcato.' },
    { q: 'Se dopo l\'oracolo tutte le probabilità restano uguali, cosa manca?',
      options: ['più qubit', 'una trasformazione che faccia interferire le ampiezze', 'più interrogazioni', 'niente, va bene così'], correct: 1,
      why: 'L\'oracolo scrive nelle fasi, che sono invisibili alla misura. Senza un passo di interferenza (H, QFT, diffusore) il risultato è casuale.' },
    { q: 'Per un problema senza nessuna struttura, il massimo vantaggio quantistico ottenibile è…',
      options: ['esponenziale', 'quadratico (Grover)', 'nessuno', 'infinito'], correct: 1,
      why: 'È un limite dimostrato: senza struttura da sfruttare, nemmeno un computer quantistico può fare meglio di circa √N interrogazioni.' },
  ],

  outro: `<div class="callout ok"><b>Non c'è un "completato" per questo livello, e va bene così.</b>
          Torna qui ogni volta che ti viene un'idea. Restano due tappe: il <b>glossario</b> con la mappa completa
          di tutto il percorso, e l'<b>esame finale</b> con l'attestato.</div>`,
});
@endsection
