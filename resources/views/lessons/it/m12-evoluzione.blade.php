@php($description = 'L\'esponenziale di matrice spiegato giocando: e^M come serie di Taylor con una matrice dentro, la scorciatoia degli autovettori, l\'equazione di Schrödinger come interesse composto immaginario — e la formula di Trotter, cioè il conto vero di quanto costa simulare una molecola su un computer quantistico.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { esponenzialeLab, trotterLab } from '/js/widgets/evoluzione.js';

const L = renderLesson({
  id: 'm12-evoluzione',
  lead: `Questo è il livello in cui la Parte M si chiude su sé stessa. La domanda è: <b>come si calcola dove sarà un
         sistema fisico fra un secondo?</b> La risposta è una formula sola — <b>e<sup>−iHt</sup></b> — che contiene
         tre cose che hai già costruito: la serie di Taylor (M·10) dice che cosa vuol dire elevare e a una matrice,
         gli autovettori (M·11) dicono come calcolarlo senza sommare niente, e il limite (M·8) dice perché, quando
         l'energia è fatta di pezzi che litigano fra loro, bisogna spezzare il tempo.`,

  steps: [
    {
      t: 'Che cosa vuol dire e elevato a una matrice',
      html: `<p>Sembra una domanda senza senso: e è un numero, la matrice è una tabella. Che cosa vorrebbe dire
             elevare uno all'altra?</p>
             <p>La risposta è semplice fino a essere deludente: <b>si usa la stessa serie del livello M·10</b>.</p>
             <div class="formula">e<sup>x</sup> = 1 + x + x²/2! + x³/3! + …<br>e<sup>M</sup> = I + M + M²/2! + M³/3! + …</div>
             <p>Le potenze di una matrice si sanno fare (è solo moltiplicarla per sé stessa), dividere per un numero
             si sa fare, sommare due matrici si sa fare. Quindi la somma ha senso — e converge sempre, per qualunque
             matrice, perché i fattoriali al denominatore vincono su tutto.</p>
             <div class="callout key">Non c'è nessuna magia da capire: <b>e<sup>M</sup> è una definizione</b>, e la
             definizione è quella somma. Tutto il resto sono modi furbi di calcolarla.</div>
             <p>Nel gioco: scegli un generatore, alza il numero di termini e guarda la strada gialla — è la somma
             che si costruisce, un termine alla volta — avvicinarsi al cerchio verde, che è il risultato vero.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'esponenziale', title: 'Due esponenziali costruiti a mano', text: 'porta la serie a meno di 0,001 dal risultato, su due generatori diversi.', xp: 55 });
        el.appendChild(m.root);
        esponenzialeLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Due cose da notare mentre giochi.</p>
              <p><b>La prima:</b> con il generatore «gira», la strada gialla parte dritta e poi si arrotola fino a
              cadere sul cerchio. Non è un caso — quella matrice antisimmetrica genera una <b>rotazione</b>, e la
              serie sta ricostruendo il seno e il coseno esattamente come al livello M·10.</p>
              <p><b>La seconda:</b> alza il tempo a 6 e guarda quanti termini servono. La serie funziona sempre, ma
              <b>lentamente</b> quando la matrice è grande — è di nuovo la domanda «quanto in fretta» del livello
              M·8. Ed è il motivo per cui nessuno calcola davvero un esponenziale di matrice sommando la serie.</p>
              <div class="callout key"><b>Come si calcola per davvero.</b> Con la scorciatoia del livello M·11:
              nella base degli autovettori la matrice è diagonale, e l'esponenziale di una matrice diagonale è
              <b>solo e^(autovalore) su ciascuna direzione</b>. Zero somme.
              <p class="mb0" style="margin-top:8px"><b>e<sup>M</sup> = P · e<sup>D</sup> · P⁻¹</b></p></div>
              <p class="mb0">E c'è un'identità che vale sempre e che il gioco mostra nel riquadro:
              <b>det(e<sup>M</sup>) = e<sup>traccia(M)</sup></b>. Traccia e determinante erano le due cose che al
              livello M·11 non cambiavano col righello; qui si scopre che sono anche legate fra loro. Se la traccia
              è zero il determinante viene 1 — cioè la trasformazione non cambia le aree, e in quantistica vuol dire
              che le probabilità continuano a fare 1.</p>`,
    },

    {
      t: 'L\'equazione di Schrödinger, che è un interesse composto',
      html: `<p>Adesso il motivo per cui questa cosa esiste. Nel 1926 Schrödinger scrive l'equazione che governa
             ogni sistema quantistico:</p>
             <div class="formula">i·ℏ · dψ/dt = H·ψ</div>
             <p>Fa paura scritta così. Guardala con gli occhi del livello M·8 e diventa familiare.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Togli le costanti', html: 'Scrivendola come <b>dψ/dt = −i·H·ψ</b> resta una sola cosa: <b>la velocità con cui lo stato cambia è proporzionale allo stato stesso</b>. Il fattore di proporzionalità è −iH.' },
          { h: 'Dove l\'hai già vista', html: 'È la stessa forma dell\'interesse composto: «quanto cresce» è proporzionale a «quanto c\'è». Un capitale con interesse r cresce come dC/dt = r·C, e la soluzione è C(t) = C₀·e^(rt).' },
          { h: 'Quindi la soluzione è', html: '<b>ψ(t) = e^(−iHt)·ψ(0)</b>. Identica, con −iH al posto di r. Solo che r era un numero e −iH è una matrice: da qui il livello.' },
          { h: 'E l\'interesse è immaginario', html: 'Ricordi la banca del livello M·8? Con interesse immaginario il capitale <b>non cresce, gira</b>. Ecco perché uno stato quantistico non esplode e non svanisce: la sua lunghezza resta 1, e ruota. Le probabilità continuano a fare 1 per lo stesso motivo per cui |e^(iθ)| = 1.' },
          { h: 'Gli stati che non cambiano', html: 'Se ψ è un <b>autovettore</b> di H con autovalore E, allora e^(−iHt)ψ = e^(−iEt)·ψ: lo stato prende solo una fase e resta sé stesso. Si chiamano <b>stati stazionari</b>, e sono i livelli di energia dell\'atomo.' },
          { h: 'E quelli che oscillano', html: 'Una <b>sovrapposizione</b> di due stati stazionari con energie diverse invece cambia: le due fasi girano a velocità diverse, e la differenza si vede come un\'oscillazione. La frequenza è proporzionale alla <b>differenza di energia</b> — ed è esattamente il colore della luce che quell\'atomo emette.' },
          { h: 'Il collegamento con il corso', html: 'Ogni porta quantistica del corso è un e^(−iHt) per qualche H e qualche t: si accende un campo per un tempo preciso, e lo stato ruota di quello che serve. «Applicare una porta» in laboratorio vuol dire <b>aspettare il tempo giusto</b>.' },
        ], { doneLabel: 'Ora torna!' });
      },
      after: `<div class="callout ok"><b>Da portarsi via:</b> l'equazione di Schrödinger non dice «che cosa succede»,
              dice <b>a che velocità cambia</b>. Per sapere che cosa succede bisogna integrarla — e integrare quella
              equazione vuol dire calcolare un esponenziale di matrice.</div>`,
    },

    {
      t: 'Quando i pezzi litigano: la formula di Trotter',
      html: `<p>Ultimo pezzo, ed è quello che decide se un computer quantistico serve a qualcosa.</p>
             <p>L'energia di un sistema vero non è mai una matrice sola: è una <b>somma di pezzi</b>. L'energia
             cinetica più quella potenziale; l'interazione fra il primo e il secondo atomo, più quella fra il
             secondo e il terzo. Quindi <b>H = A + B</b>.</p>
             <p>Verrebbe voglia di scrivere e<sup>A+B</sup> = e<sup>A</sup>·e<sup>B</sup>, come si fa con i numeri.
             <b>E invece no.</b></p>
             <div class="callout warn">Con i numeri quella regola vale perché a·b = b·a. Con le matrici l'ordine
             conta: in generale <b>AB ≠ BA</b>. La differenza AB − BA si chiama <b>commutatore</b>, e quando non è
             zero la formula salta.</div>
             <p>Ma non è finita, e qui arriva l'idea. Se spezzo il tempo in <b>n pezzetti</b> e alterno mezzo pezzo
             di A e mezzo di B, l'errore diventa piccolo — e più pezzetti metto, più piccolo diventa.</p>
             <div class="formula">e<sup>A+B</sup> ≈ (e<sup>A/n</sup> · e<sup>B/n</sup>)<sup>n</sup></div>
             <p>Nel gioco: il cammino viola è quello spezzato, il cerchio verde è dove si doveva arrivare. Alza i
             pezzetti e guarda la distanza chiudersi.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'trotter', title: 'Due simulazioni riuscite', text: 'arriva vicino al bersaglio su un tempo corto e su uno lungo.', xp: 65 });
        el.appendChild(m.root);
        trotterLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Avrai visto due cose, e sono <b>il</b> conto di questo livello.</p>
              <div class="callout key"><b>1. L'errore scende come 1/n.</b> Raddoppi i pezzetti, dimezzi l'errore.
              Non è un'osservazione: i test lo misurano confrontando l'errore a n e a 2n, e il rapporto viene 2.</div>
              <div class="callout key"><b>2. Più tempo vuoi simulare, più pezzetti servono</b>, in proporzione. Per
              la stessa precisione relativa, un tempo tre volte più lungo chiede più del doppio dei pezzetti.</div>
              <p>Adesso traduci: <b>ogni pezzetto è un gruppo di porte da eseguire</b>. Quindi il numero di porte —
              cioè il costo, cioè il tempo di calcolo, cioè quanto rumore si accumula — cresce con il tempo da
              simulare e con la precisione che vuoi. Questo si chiama <b>decomposizione di Trotter-Suzuki</b>, ed è
              il modo in cui si fa chimica quantistica su una macchina vera.</p>
              <div class="callout ok"><b>Ed è qui che il vantaggio quantistico è più solido che altrove.</b> Per
              simulare n particelle quantistiche un computer normale deve tenere 2ⁿ numeri (livello M·4): a
              cinquanta particelle non ci sta nella memoria del pianeta. Un computer quantistico ne usa n, di qubit,
              e paga solo il conto dei pezzetti. Non è un'accelerazione furba come Grover: è la differenza fra
              «impossibile» e «costoso».</div>
              <p class="mb0">Un'ultima nota sul commutatore, perché è più famoso di quanto sembri. La stessa
              quantità AB − BA, applicata a posizione e quantità di moto, dà il <b>principio di indeterminazione</b>
              di Heisenberg. Non è una limitazione degli strumenti: è che due matrici che non commutano non hanno
              una base comune in cui sono entrambe diagonali — e senza quella base non esiste un righello che
              risponda con certezza a tutte e due le domande. È il livello M·11, letto al contrario.</p>`,
    },

    {
      t: 'Un fisico che voleva un computer, nel 1981',
      html: `<p>Nel <b>maggio 1981</b>, al MIT, si tiene una conferenza sulla fisica del calcolo. <b>Richard
             Feynman</b> tiene la relazione di apertura, che verrà pubblicata l'anno dopo con il titolo
             <i>Simulating Physics with Computers</i>.</p>
             <p>Il ragionamento è quello che hai appena fatto. Per simulare un sistema quantistico di n particelle
             servono <b>2ⁿ</b> numeri, e quel numero raddoppia a ogni particella aggiunta. Non è una questione di
             computer più veloci: è la quantità di informazione che non ci sta.</p>
             <div class="callout key">La conclusione di Feynman è una frase diventata famosa: «<b>La natura non è
             classica, accidenti, e se volete fare una simulazione della natura fareste meglio a farla quantistica —
             e per la miseria, è un bel problema, perché non sembra così facile.</b>»</div>
             <p>L'idea è semplice e rovescia il tavolo: se un sistema quantistico è difficile da simulare con una
             macchina classica, <b>usiamo un altro sistema quantistico come macchina</b>. Non c'è nessun algoritmo,
             in quel discorso: c'è una proposta.</p>
             <p>Ci vollero anni perché diventasse qualcosa di concreto. <b>David Deutsch</b>, nel <b>1985</b>,
             definisce che cos'è una macchina di Turing quantistica — il livello 9 di questo corso porta il suo
             nome. <b>Seth Lloyd</b>, nel <b>1996</b>, mostra come si simula davvero un sistema fisico su un
             computer quantistico, ed è esattamente la ricetta del secondo gioco: si spezza il tempo in pezzetti e
             si applicano i pezzi dell'energia a turno.</p>
             <p class="mb0">Vale la pena notare l'ordine delle cose. <b>Shor arriva nel 1994</b> e prende tutti i
             titoli, ma la simulazione — quella proposta da Feynman e resa concreta da Lloyd — è nata prima ed è
             l'applicazione su cui quasi tutti oggi scommettono di più. Rompere RSA è spettacolare; capire come
             funziona una molecola è utile.</p>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel primo gioco metti «gira» con tempo ×6 e conta quanti termini servono per arrivare a 0,001.
           Poi rifallo con tempo ×1. <span class="muted">(20 contro 6: più grande è la matrice, più lenta è la serie)</span></p>
        <p><b>2.</b> Metti «stira» e guarda il determinante nel riquadro. Perché viene sempre 1?
           <span class="muted">(perché quella matrice ha traccia zero, e det(e^M) = e^(traccia): allunga da una
           parte esattamente quanto stringe dall'altra)</span></p>
        <p><b>3.</b> Nel secondo gioco lascia i pezzetti a 1 e guarda dove finisce il cammino viola.
           <span class="muted">(lontanissimo: con un pezzetto solo stai dicendo e^(A+B) = e^A·e^B, che è
           falso)</span></p>
        <p><b>4.</b> Trova il numero di pezzetti che serve a tempo ×1, poi quello a tempo ×3.
           <span class="muted">(94 contro 348: cresce in proporzione al tempo, ed è il conto del costo di una
           simulazione)</span></p>
        <p class="mb0"><b>5.</b> Da inventore: se A e B commutassero, quanti pezzetti servirebbero?
           <span class="muted">(uno: senza commutatore la formula e^(A+B) = e^A·e^B è esatta, e i test lo
           verificano su due stirature che commutano)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cosa vuol dire e elevato a una matrice?', options: ['non ha senso', 'la stessa serie di Taylor di eˣ, con la matrice al posto del numero: I + M + M²/2! + …', 'il determinante di M', 'la matrice con gli elementi esponenziati'], correct: 1,
      why: 'È una definizione, e converge sempre perché i fattoriali al denominatore vincono su qualunque matrice. Attenzione all\'ultima risposta: NON si esponenziano gli elementi uno per uno.' },
    { q: 'Come si calcola e^M senza sommare la serie?', options: ['non si può', 'nella base degli autovettori: lì la matrice è diagonale e basta fare e^(autovalore) su ciascuna direzione', 'con il determinante', 'moltiplicando M per sé stessa'], correct: 1,
      why: 'È la scorciatoia del livello M·11: e^M = P·e^D·P⁻¹. La serie dice cosa significa, la diagonalizzazione dice come si fa.' },
    { q: 'Che rapporto c\'è fra l\'equazione di Schrödinger e l\'interesse composto?', options: ['nessuno', 'hanno la stessa forma: la velocità di cambiamento è proporzionale a quello che c\'è, quindi la soluzione è un esponenziale', 'sono entrambe lineari', 'usano entrambe i numeri complessi'], correct: 1,
      why: 'dC/dt = r·C dà C(t) = C₀e^(rt); dψ/dt = −iHψ dà ψ(t) = e^(−iHt)ψ(0). E l\'interesse immaginario del livello M·8 spiega perché lo stato gira invece di crescere.' },
    { q: 'Perché e^(A+B) non è sempre e^A·e^B?', options: ['perché le matrici sono grandi', 'perché in generale AB ≠ BA: la differenza si chiama commutatore', 'perché la somma di matrici non è definita', 'perché e non è un numero intero'], correct: 1,
      why: 'Con i numeri la regola vale perché a·b = b·a. Se il commutatore AB − BA non è zero, quella regola salta — e il commutatore è la stessa quantità che dà il principio di indeterminazione.' },
    { q: 'Che cosa dice la formula di Trotter?', options: ['che le matrici commutano sempre', 'che spezzando il tempo in n pezzetti e alternando i due pezzi, l\'errore scende come 1/n', 'che l\'esponenziale non si può calcolare', 'che servono più qubit'], correct: 1,
      why: 'È il modo in cui un computer quantistico simula un sistema fisico: non sa applicare e^(−iHt) in un colpo, ma sa applicare i pezzi a turno. Più pezzetti, più porte, meno errore.' },
    { q: 'Perché simulare la fisica è considerata l\'applicazione più solida dei computer quantistici?', options: ['perché è più facile di Shor', 'perché un computer normale ha bisogno di 2ⁿ numeri per n particelle, e a poche decine non ci sta più in nessuna memoria', 'perché non serve correzione d\'errore', 'perché lo ha detto Feynman'], correct: 1,
      why: 'È la differenza fra «costoso» e «impossibile», non un\'accelerazione furba. Lo propose Feynman nel 1981, e Seth Lloyd mostrò come farlo davvero nel 1996.' },
  ],

  outro: `<div class="callout ok"><b>Fatto, e la Parte M si chiude su sé stessa.</b> e^(matrice) è la serie di Taylor
          del livello M·10 con una tabella dentro; si calcola con gli autovettori del livello M·11; risolve
          l'equazione di Schrödinger, che ha la forma dell'interesse composto del livello M·8 — con l'interesse
          immaginario, per questo lo stato gira invece di crescere. E quando l'energia è fatta di pezzi che non
          commutano si spezza il tempo, si paga in porte, e si simula una molecola. È l'applicazione che ha fatto
          nascere l'idea stessa del computer quantistico, tredici anni prima di Shor.</div>`,
});
@endsection
