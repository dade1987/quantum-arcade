@php($description = 'Esame finale di Quantum Arcade: domande a risposta multipla su onde, qubit, porte, entanglement, algoritmi, QFT e Shor, corrette dal server. Dall\'80% si genera l\'attestato di completamento del corso.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { examLab } from '/js/widgets/exam.js';

const L = renderLesson({
  id: '24-esame',
  lead: `Ultimo livello. Domande su tutto il percorso, mescolate a caso e corrette dal server.
         Nessun tempo limite, nessuna penalità, tentativi illimitati: l'obiettivo non è darti un voto,
         è farti <b>ripescare a memoria</b> ogni concetto almeno una volta — che è, secondo la ricerca,
         il modo più efficace per fissarlo.`,

  steps: [
    {
      t: 'Prima di cominciare',
      html: `<p>Consigli pratici, testati:</p>
             <ul>
               <li><b>Non rileggere il corso adesso.</b> Prova a rispondere a memoria: sbagliare e poi leggere la correzione
                   fissa il concetto molto meglio del ripasso passivo.</li>
               <li>Se una domanda ti blocca, rispondi comunque: alla fine avrai la correzione completa, domanda per domanda.</li>
               <li>Se vai sotto l'80%, guarda quali argomenti hai sbagliato, rigioca <b>quei</b> livelli e rifai l'esame.
                   Non è una bocciatura: è la diagnosi.</li>
             </ul>`,
    },
    {
      t: 'Esame',
      html: ``,
      mount: (el, api) => {
        const m = api.mission({ key: 'esame', title: 'Supera l\'esame', text: 'raggiungi almeno l\'80% di risposte corrette.', xp: 120 });
        el.appendChild(m.root);
        examLab(el, { pass: 0.8, onPass: () => m.complete() });
      },
    },
    {
      t: 'Sull\'attestato: cosa è e cosa non è',
      html: `<div class="callout warn"><b>Trasparenza totale, perché conta.</b>
             L'attestato che generi qui è un <b>attestato di completamento del corso</b>, rilasciato dall'autore
             (Davide Cavallini) e verificabile tramite il codice che riporta. <b>Non</b> è una certificazione rilasciata
             da un ente accreditato: dichiararlo sarebbe falso e ti metterebbe in difficoltà il giorno in cui qualcuno
             lo verificasse.</div>
             <p><b>Quindi a cosa serve davvero?</b> A dimostrare, in modo concreto e verificabile, che hai completato un
             percorso strutturato di 28 livelli su un argomento tecnico non banale. In un colloquio, in un CV o su LinkedIn
             vale come <b>prova di iniziativa e di curiosità</b>: metticelo, ma descrivilo per quello che è.</p>
             <h3>Se ti serve un titolo formalmente riconosciuto</h3>
             <p>Le strade vere sono queste, e sono indipendenti da questo sito:</p>
             <ul>
               <li><b>Certificazione IBM su Qiskit</b> — esame a pagamento con badge digitale rilasciato da IBM.
                   È il riferimento più diffuso nel settore.</li>
               <li><b>Corsi universitari online con certificato</b> (edX, Coursera) rilasciati da atenei accreditati.</li>
               <li><b>Master e corsi di perfezionamento</b> di università italiane su quantum computing.</li>
             </ul>
             <p class="dim small">Nota tecnica per chi è curioso: un attestato "riconosciuto" richiede un <b>ente terzo
             accreditato</b> che si assuma la responsabilità della valutazione (per la certificazione delle persone lo
             standard di riferimento è la ISO/IEC 17024, con accreditamento in Italia da parte di Accredia).
             È un percorso possibile ma lungo e costoso, e finché non è concluso nessun sito serio può dichiararlo.</p>`,
    },
    {
      t: 'E adesso?',
      html: `<div class="callout ok"><b>Se sei arrivato qui, sai davvero come funziona l'informatica quantistica.</b>
             Non "hai sentito parlare di": sai perché un qubit non è una moneta, cosa fa una porta, perché serve
             l'interferenza, come si costruisce una QFT e come Shor arriva ai fattori.</div>
             <p>Tre modi per non fermarti:</p>
             <ol>
               <li><b>Torna all'officina (livello 22)</b> e prova a battere i tuoi record. È l'unico livello senza fondo.</li>
               <li><b>Scrivi il tuo primo circuito in Qiskit</b>: dopo questo corso è quasi solo questione di sintassi.</li>
               <li><b>Spiegalo a qualcuno.</b> È il test definitivo: se riesci a far capire l'interferenza a un amico
                   usando le frecce, il concetto è tuo per sempre.</li>
             </ol>
             <p class="dim">E se trovi errori, passaggi poco chiari o hai idee per nuovi livelli: scrivimi.
             Questo corso è pensato per crescere con chi lo usa.</p>`,
    },
  ],

  quiz: [],

  outro: '',
});
@endsection
