@php($description = 'Operatori spiegati giocando: unitaria vuol dire «non cambia le lunghezze» (le porte), hermitiana vuol dire «autovalori reali» (le osservabili), proiettore vuol dire «rifarlo non cambia niente» (la misura). Con l\'aggiunto spiegato per quello che è e il collasso come idempotenza.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { operatoreLab, proiettoreLab } from '/js/widgets/operatori.js';

const L = renderLesson({
  id: 'm5-operatori',
  lead: `Se apri un libro di meccanica quantistica trovi tre parole ripetute a ogni pagina: <b>unitario</b>,
         <b>hermitiano</b>, <b>proiettore</b>. Sembrano tre tecnicismi da mandare giù. Sono invece tre modi
         diversissimi in cui una macchina può trattare le frecce — e in venti minuti li costruisci tutti e tre con
         quattro manopole, scoprendo per strada perché una porta quantistica <b>non può</b> essere fatta a caso e
         perché rimisurare non cambia mai la risposta.`,

  steps: [
    {
      t: 'Prima parola: l\'aggiunto (e non è quello che sembra)',
      html: `<p>Al livello 0·6 una matrice è la <b>macchina che trasforma le frecce</b>. Prima di classificarle serve
             un attrezzo solo, e ha un nome brutto: l'<b>aggiunto</b>, che si scrive con una crocetta — M†.</p>
             <p>La ricetta è semplice: si <b>ribalta la matrice attorno alla diagonale</b> (la casella in alto a
             destra va in basso a sinistra e viceversa). Con i numeri complessi si fa una cosa in più: si
             <b>gira ogni freccia</b> — cioè si prende il coniugato. In questo livello lavoriamo con numeri reali,
             quindi «aggiunto» vuol dire soltanto «ribaltata», e i due nomi tecnici che incontrerai sono
             <i>ortogonale</i> (per unitaria) e <i>simmetrica</i> (per hermitiana).</p>
             <div class="callout key">Ma la definizione vera dell'aggiunto non è la ricetta: è <b>a che serve</b>.
             L'aggiunto è la macchina che «sposta M dall'altra parte» dentro un prodotto scalare:
             <p class="mb0" style="margin-top:8px"><b>⟨M v , w⟩ = ⟨v , M† w⟩</b></p>
             <p class="mb0" style="margin-top:8px">Cioè: trasformare la prima freccia con M e poi fare l'ombra dà lo
             stesso numero che lasciare la prima freccia com'è e trasformare la seconda con M†. È l'unica cosa che
             devi ricordare, ed è quella che sopravvive anche coi numeri complessi.</p></div>`,
    },

    {
      t: 'Le tre famiglie, costruite a mano',
      html: `<p>Adesso le quattro manopole. Muovile e guarda le tre etichette in basso accendersi. Il disegno aiuta:
             i pallini grigi sono <b>frecce di lunghezza 1</b> disposte in cerchio, e quelli colorati sono dove
             finiscono dopo la macchina.</p>
             <div class="callout key">Cerca queste tre cose, in quest'ordine:
             <ul style="margin:8px 0 0">
               <li>una macchina in cui il cerchio dei pallini <b>resta un cerchio</b>: è <b>unitaria</b>;</li>
               <li>una in cui la matrice è <b>uguale alla sua ribaltata</b>: è <b>hermitiana</b>;</li>
               <li>una che sia <b>tutte e due insieme</b> — e quando la trovi, guarda che cosa fa.</li>
             </ul></div>
             <p>Le macchine pronte in cima sono le porte che già conosci: partire da lì è il modo più rapido.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'famiglie', title: 'Tutte e tre le famiglie', text: 'costruisci una unitaria, una hermitiana e una che sia entrambe.', xp: 55 });
        el.appendChild(m.root);
        operatoreLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Ecco che cosa hai appena scoperto, tradotto in quantistico:</p>
              <table class="table">
                <tr><th>Famiglia</th><th>La regola</th><th>Che cosa è, nel corso</th></tr>
                <tr><td><b>unitaria</b></td><td>M†M = I<br>non cambia lunghezze né angoli</td><td>una <b>porta</b></td></tr>
                <tr><td><b>hermitiana</b></td><td>M† = M<br>autovalori sempre reali</td><td>un'<b>osservabile</b></td></tr>
                <tr><td><b>proiettore</b></td><td>P·P = P<br>rifarlo non cambia niente</td><td>una <b>misura</b></td></tr>
              </table>
              <p>E le due cose che il gioco fa vedere e che le parole da sole non trasmettono:</p>
              <ul>
                <li><b>la rotazione non ha autovalori reali.</b> Il suo delta è negativo — è il caso «impossibile»
                    del livello 0·7b — e infatti nessuna freccia resta ferma. Ecco perché le fasi quantistiche sono
                    numeri complessi: non c'era alternativa;</li>
                <li><b>X, Z e H sono unitarie <i>e</i> hermitiane insieme.</b> Vuol dire che sono <b>specchiate</b>:
                    i loro autovalori sono +1 e −1, e applicandole due volte si torna esattamente al punto di
                    partenza. Provalo: è il motivo per cui in un circuito quella coppia si cancella.</li>
              </ul>`,
    },

    {
      t: 'Perché una porta DEVE essere unitaria',
      html: `<p>Questa non è una convenzione: è una costrizione, e ha due motivi indipendenti che portano allo stesso
             posto.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Motivo 1: le probabilità', html: 'La lunghezza al quadrato dello stato è la somma delle probabilità, e deve fare <b>1</b> sempre. Se una porta allungasse anche di poco una freccia, dopo dieci porte le probabilità sommerebbero a 3 — e una probabilità del 300% non vuol dire niente.' },
          { h: 'Motivo 2: si torna indietro', html: 'Una macchina unitaria ha sempre l\'inversa, ed è il suo aggiunto: <b>U† disfa U</b>. Quindi ogni circuito quantistico si può <b>rileggere al contrario</b>. È la reversibilità del livello K·6, e non è un lusso: la fisica sotto (l\'equazione di Schrödinger) è reversibile, quindi le porte lo devono essere.' },
          { h: 'Cosa esclude', html: 'Fra le porte non c\'è niente che <b>cancelli</b>. Il classico AND butta via informazione — da 1 e 0 esce 0, e non sai più da dove venivi. Una porta quantistica non può farlo: per questo al livello K·6 la somma logica va riscritta in modo reversibile prima di poterla portare qui.' },
          { h: 'E anche gli angoli', html: 'Una unitaria conserva il prodotto scalare, non solo le lunghezze. Quindi due stati <b>perpendicolari restano perpendicolari</b>: due risposte distinguibili con certezza restano distinguibili. Una porta non può «confondere» due possibilità.' },
          { h: 'La conseguenza pratica', html: 'Quando al livello 22 inventi un tuo algoritmo, non puoi scrivere una matrice qualsiasi: deve essere unitaria. È il vincolo che rende il mestiere difficile — e interessante.' },
        ], { doneLabel: 'Ha senso!' });
      },
    },

    {
      t: 'Perché un\'osservabile DEVE essere hermitiana',
      html: `<p>Qui il ragionamento è ancora più corto, e sta in una frase: <b>i numeri che leggi su uno strumento
             sono numeri reali</b>. Non esiste un voltmetro che segni 3 + 2i.</p>
             <p>Nella meccanica quantistica il valore che esce da una misura è un <b>autovalore</b> dell'operatore
             che rappresenta la grandezza (livello 18·b). Quindi serve una famiglia di matrici i cui autovalori
             siano <b>garantiti reali</b>, sempre, non per fortuna.</p>
             <div class="callout key">E quella famiglia è esattamente quella delle <b>hermitiane</b>. Il test lo
             verifica su duemila matrici simmetriche prese a caso: il delta del polinomio caratteristico non è mai
             negativo, nemmeno una volta. Non è una tendenza: è un teorema.</div>
             <p>C'è di più, e completa il quadro: gli <b>autovettori</b> di una matrice hermitiana con autovalori
             diversi sono automaticamente <b>perpendicolari</b> fra loro. Cioè: formano una base ortonormale
             (livello M·4). Mettendo insieme le due cose:</p>
             <div class="callout ok"><b>Un'osservabile è: un insieme di direzioni perpendicolari, con un numero
             reale scritto su ciascuna.</b> Le direzioni sono i risultati possibili, i numeri sono i valori che
             leggi. Questo è tutto quello che «osservabile» significa — e si chiama <b>teorema spettrale</b>.</div>
             <p class="mb0">Da qui si legge anche perché certe coppie di grandezze non si possono misurare insieme:
             se due osservabili hanno <b>basi di autovettori diverse</b>, chiedere l'una vuol dire proiettare in una
             base, e chiedere l'altra vuol dire proiettare in un'altra. Le due domande non si possono fare nella
             stessa lingua. È l'origine del principio di indeterminazione, ed è geometria.</p>`,
    },

    {
      t: 'Il proiettore: perché rileggere non cambia la risposta',
      html: `<p>La terza famiglia è quella che spiega il <b>collasso</b>, che di solito viene presentato come un
             postulato misterioso.</p>
             <p>Un <b>proiettore</b> è la macchina che schiaccia ogni freccia su una direzione: l'ombra del livello
             0·9, fatta matrice. La sua proprietà è tutta in tre simboli:</p>
             <div class="formula">P · P = <span class="hl-n">P</span></div>
             <p>Applicarlo due volte è come applicarlo una volta. Ha senso: una volta che una freccia è già
             schiacciata sulla retta, schiacciarla di nuovo non la muove.</p>
             <p>Nel gioco: scegli una direzione di misura, sistema lo stato, premi «misura» — e poi rimisura.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'proiettore', title: 'Rileggi e riguarda', text: 'misura due volte di fila su 2 direzioni diverse.', xp: 50 });
        el.appendChild(m.root);
        proiettoreLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Il primo risultato esce a caso, con le probabilità date dalle ombre al quadrato. Il secondo
              <b>no</b>: è già deciso, ed è uguale al primo. Sempre.</p>
              <div class="callout key"><b>Il collasso non è un\'ipotesi in più.</b> È la faccia fisica di P·P = P.
              Dire «una volta misurato, lo stato è quello» e dire «applicare il proiettore due volte è come
              applicarlo una volta» sono la stessa frase, scritta in due lingue.</div>
              <p>E l'altra proprietà che il gioco mostra in fondo: i due proiettori sulle direzioni perpendicolari,
              <b>sommati, danno l'identità</b>. Tradotto: i risultati possibili coprono tutti i casi, e le
              probabilità fanno 100%. Anche quella, che sembrava un'imposizione, è una proprietà di matrici.</p>
              <div class="callout warn"><b>Onestà su cosa fa il gioco:</b> qui il collasso è simulato con un numero
              a caso, come su una macchina vera si osserverebbe ripetendo l\'esperimento. Il gioco non prende
              posizione su <i>perché</i> la natura si comporti così — è una questione aperta di interpretazione — ma
              su <i>come</i> si comporta, e su come si scrive.</div>`,
    },

    {
      t: 'Da dove viene: uno che non passava gli esami',
      html: `<p><b>Charles Hermite</b>, francese, dimostra nel <b>1855</b> che le matrici uguali alla propria
             ribaltata-e-coniugata hanno <b>sempre autovalori reali</b> — la stessa proprietà che avevano le
             simmetriche a coefficienti reali. Le chiamiamo hermitiane per questo. Siamo <b>settant'anni prima</b>
             che a qualcuno serva per descrivere un atomo.</p>
             <div class="callout key"><b>La curiosità, e vale per chiunque si senta lento:</b> Hermite fu uno
             studente <b>disastroso</b> agli esami. Entrò all'École Polytechnique con un punteggio quasi in fondo
             alla lista, e dopo <b>un anno solo</b> la scuola non gli permise di continuare: la gamba destra, con
             cui camminava male dalla nascita, gli impediva di prendere il brevetto militare a cui il Polytechnique
             preparava, e questo bastò. Gli offrirono di rientrare a condizioni pesanti; rifiutò, e se ne andò
             <b>senza titolo</b>. Ci mise anni a rimettere insieme i pezzi di una carriera accademica, dando esami
             che continuava a passare male. Nel frattempo scriveva a Jacobi lettere con risultati che i suoi
             esaminatori non sarebbero stati in grado di valutare.</div>
             <p>Poi la carriera: dimostra che <b>e è trascendente</b> (1873) — cioè che non è soluzione di nessuna
             equazione polinomiale a coefficienti interi, il che chiude un problema aperto da secoli — e apre la
             strada alla dimostrazione dello stesso per π, che Lindemann completerà nove anni dopo. E finisce
             professore proprio in quell'École Polytechnique che lo aveva mandato via, e alla Sorbona.</p>
             <p>Il resto della storia lo conosci dal livello M·4: <b>Hilbert</b> mette in ordine gli spazi con
             prodotto scalare, e <b>von Neumann</b> nel <b>1932</b> scrive il libro che traduce tutta la meccanica
             quantistica in questo linguaggio. È lui a stabilire, in modo definitivo, il dizionario che hai in mano
             adesso:</p>
             <table class="table">
               <tr><th>Fisica</th><th>Matematica</th></tr>
               <tr><td>stato</td><td>vettore di lunghezza 1</td></tr>
               <tr><td>evoluzione, porta</td><td>operatore <b>unitario</b></td></tr>
               <tr><td>grandezza osservabile</td><td>operatore <b>hermitiano</b></td></tr>
               <tr><td>valore che leggi</td><td><b>autovalore</b> (reale)</td></tr>
               <tr><td>misura, collasso</td><td><b>proiettore</b> (P·P = P)</td></tr>
             </table>
             <div class="callout ok">Vale la pena fermarsi un attimo su questa tabella. Non è una traduzione
             approssimativa: è <b>esatta</b>, ed è il motivo per cui la meccanica quantistica, che è difficile da
             immaginare, è invece facile da <b>calcolare</b>. Tutta la stranezza sta nella colonna di sinistra;
             quella di destra sono matrici, e le matrici le sai far girare da dieci livelli.</div>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel primo gioco carica la porta <b>H</b>: è unitaria? hermitiana? Che autovalori ha? E che
           succede se la applichi due volte? <span class="muted">(+1 e −1, e H·H = identità: è una specchiata)</span></p>
        <p><b>2.</b> Carica «stira» (2 e 0.5): perché non può essere una porta quantistica?
           <span class="muted">(guarda cosa fa al cerchio dei pallini)</span></p>
        <p><b>3.</b> Carica la <b>rotazione</b>: perché il riquadro dice «autovalori complessi»? Ripensa al delta del
           livello 0·7b. <span class="muted">(traccia 0, determinante 1 → λ² + 1 = 0)</span></p>
        <p><b>4.</b> Nel secondo gioco metti lo stato a 45° e misura nella direzione 0°: che probabilità escono?
           Adesso misura nella direzione 45°: e adesso? <span class="muted">(50/50 contro certezza: è lo stesso
           stato, cambia la domanda — livello M·4)</span></p>
        <p class="mb0"><b>5.</b> Da inventore: un proiettore è hermitiano ma <b>non</b> unitario. Che cosa dice
           questo sul fatto che la misura sia reversibile? <span class="muted">(non lo è: schiacciando si perde
           informazione, ed è l'unico punto di tutta la meccanica quantistica in cui questo succede)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cos\'è l\'aggiunto di una matrice, in una riga?', options: ['la sua inversa', 'la macchina che sposta M dall\'altra parte di un prodotto scalare: ⟨Mv, w⟩ = ⟨v, M†w⟩', 'la matrice moltiplicata per −1', 'la matrice dei suoi autovalori'], correct: 1,
      why: 'La ricetta (ribalta, e coi complessi coniuga) è solo il modo di calcolarlo. La definizione è quella proprietà, ed è l\'unica cosa che serve ricordare.' },
    { q: 'Perché una porta quantistica deve essere unitaria?', options: ['per convenzione', 'perché non deve cambiare le lunghezze (le probabilità restano 100%) e deve essere reversibile', 'perché così è più veloce', 'perché altrimenti non ha autovalori'], correct: 1,
      why: 'Due motivi indipendenti che portano allo stesso vincolo: la somma delle probabilità deve restare 1, e l\'evoluzione fisica sotto è reversibile — l\'inversa di una unitaria è il suo aggiunto.' },
    { q: 'Perché un\'osservabile deve essere hermitiana?', options: ['per simmetria estetica', 'perché i suoi autovalori sono garantiti reali, e un valore letto su uno strumento è un numero reale', 'perché è più facile da calcolare', 'perché conserva le lunghezze'], correct: 1,
      why: 'Il valore che esce da una misura è un autovalore. Le matrici hermitiane sono esattamente quelle che li hanno sempre reali — e in più i loro autovettori sono perpendicolari, cioè formano una base di misura.' },
    { q: 'Che cosa vuol dire P·P = P?', options: ['che P è l\'identità', 'che applicare il proiettore due volte è come applicarlo una volta: rimisurare dà lo stesso risultato', 'che P è invertibile', 'che P non ha autovalori'], correct: 1,
      why: 'Una freccia già schiacciata sulla retta non si muove se la schiacci di nuovo. È l\'idempotenza, e il collasso quantistico è la sua faccia fisica.' },
    { q: 'Le porte X, Z e H sono unitarie e anche hermitiane. Che cosa comporta?', options: ['che non fanno niente', 'che sono specchiate: autovalori +1 e −1, e applicate due volte tornano all\'identità', 'che hanno autovalori complessi', 'che non sono invertibili'], correct: 1,
      why: 'Unitaria dice che l\'inversa è l\'aggiunto; hermitiana dice che l\'aggiunto è lei stessa. Quindi è l\'inversa di sé stessa: applicarla due volte non fa niente. In un circuito quella coppia si cancella.' },
    { q: 'Perché due osservabili con autovettori diversi non si possono misurare insieme?', options: ['perché gli strumenti si disturbano', 'perché misurare vuol dire proiettare su una base, e le due domande usano basi diverse', 'perché una delle due non è hermitiana', 'perché il tempo di misura è troppo lungo'], correct: 1,
      why: 'Ogni osservabile porta con sé la propria base di autovettori. Chiedere l\'una significa proiettare in quella base; chiedere l\'altra, in un\'altra. È l\'origine geometrica del principio di indeterminazione.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> Unitaria = non cambia le lunghezze, quindi è una porta. Hermitiana =
          autovalori reali su direzioni perpendicolari, quindi è un'osservabile. Proiettore = rifarlo non cambia
          niente, quindi è una misura. Tre famiglie di matrici, tre parole della fisica — e il collasso, che sembrava
          un mistero, è la riga P·P = P.</div>`,
});
@endsection
