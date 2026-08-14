@php($description = 'La derivata spiegata come pendenza e messa al lavoro: gli algoritmi variazionali (VQE, QAOA), cioè il quantistico che gira davvero oggi sull\'hardware rumoroso. Con la regola dello spostamento e il rumore dei tiri.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { pendenzaLab, vqeLab } from '/js/widgets/variazionale.js';

const L = renderLesson({
  id: '21b-variazionale',
  lead: `C'è una cosa che questo corso, fin qui, non ha ancora detto: gli algoritmi che hai imparato — Grover, la stima
         di fase, Shor — hanno bisogno di macchine grandi e pulite, che <b>oggi non esistono</b>. Quello che gira
         adesso, sui processori quantistici veri e rumorosi, è un'altra famiglia di algoritmi. Funzionano così: il
         computer quantistico misura un numero, un computer normale gira una manopola per farlo scendere, e si ripete.
         L'attrezzo che serve a girare la manopola nel verso giusto si chiama <b>derivata</b>, ed è più semplice della
         sua fama.`,

  steps: [
    {
      t: 'La pendenza: da che parte si scende',
      html: `<p>Immagina di essere su una collina, di notte, e di voler scendere a valle. Non vedi il paesaggio, ma puoi
             sentire con i piedi <b>quanto è inclinato il terreno</b> dove sei. Tanto basta: fai un passo nel verso in
             cui scende, e ricomincia.</p>
             <p>Quel «quanto è inclinato» ha un nome preciso: è la <b>pendenza</b> della curva nel punto in cui sei —
             cioè l'inclinazione della retta che tocca la curva lì.</p>
             <div class="callout key">Due fatti, e sono tutto quello che serve:
             <ul style="margin:8px 0 0">
               <li>il <b>segno</b> dice il verso: pendenza positiva → si scende a sinistra; negativa → a destra;</li>
               <li>dove la pendenza è <b>zero</b>, il terreno è piatto: sei arrivato.</li>
             </ul></div>
             <p>Nel gioco muovi il punto e guarda la retta inclinarsi. Cerca il fondo — ma occhio alla trappola.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'pendenza', title: 'Trova due fondovalle', text: 'porta la pendenza a zero in fondo a due valli diverse.', xp: 40 });
        el.appendChild(m.root);
        pendenzaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>La trappola l'avrai trovata: sulla «valle doppia» e sull'onda c'è un punto in cui la pendenza è zero
              ma sei <b>in cima</b>, non in fondo. E ce n'è un'altra, peggiore: nella valle doppia ci sono <b>due</b>
              fondi, e chi scende a occhi chiusi finisce in quello più vicino, non necessariamente nel più basso.</p>
              <div class="callout warn"><b>Tienila a mente:</b> «pendenza zero» vuol dire soltanto «qui sono fermo».
              Che sia il punto più basso di tutti, nessuno lo garantisce. È il problema numero uno degli algoritmi
              che stai per vedere — e anche di tutto l'apprendimento automatico.</div>
              <p class="mb0">Il nome tecnico della pendenza è <b>derivata</b>. Adesso la mettiamo al lavoro.</p>`,
    },

    {
      t: 'Il quantistico che gira oggi: VQE',
      html: `<p>Ecco lo schema, ed è sorprendentemente semplice:</p>
             <ol>
               <li>si costruisce un circuito quantistico con delle <b>manopole</b> (angoli di rotazione regolabili);</li>
               <li>il computer quantistico prepara lo stato e <b>misura</b> un numero — di solito l'<b>energia</b> di una
                   molecola o il costo di una soluzione;</li>
               <li>un computer normale guarda quel numero, calcola da che parte scendere e <b>gira le manopole</b>;</li>
               <li>si ripete finché il numero non smette di scendere.</li>
             </ol>
             <p>Si chiama <b>VQE</b> (Variational Quantum Eigensolver) quando il numero da abbassare è l'energia di una
             molecola, e <b>QAOA</b> quando è il costo di un problema di ottimizzazione. La struttura è la stessa.</p>
             <div class="callout key">Nel gioco hai una manopola sola e un'energia da abbassare. Prova prima a mano, poi
             lascia scendere l'algoritmo. E soprattutto: <b>cambia il numero di tiri</b> e guarda cosa succede alla
             pendenza misurata.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'vqe', title: 'Tocca il fondo due volte', text: 'raggiungi il minimo su 2 problemi diversi.', xp: 60 });
        el.appendChild(m.root);
        vqeLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Con 50 tiri la pendenza misurata balla parecchio e la discesa procede a zig-zag; con 5000 tiri è
              stabile, ma ogni passo costa cento volte tanto. Non è un difetto del gioco: <b>è il problema</b>. L'errore
              su una media misurata scende come 1/√(tiri), quindi per una cifra decimale in più servono cento volte le
              misure.</p>`,
    },

    {
      t: 'La parte che il classico non sa fare',
      html: `<p>Fin qui potresti obiettare, giustamente: se il computer normale fa la discesa, cosa ci mette di suo
             quello quantistico? Due cose, e la seconda è elegante.</p>
             <p>La prima: <b>prepara e misura uno stato</b> che un computer normale non saprebbe rappresentare — è tutto
             il senso della sovrapposizione, con le sue esponenziali ampiezze.</p>
             <p>La seconda riguarda proprio la pendenza. Su un computer normale la derivata di una funzione misurata si
             stima «alla buona»: si valuta in due punti vicinissimi e si fa la differenza — e con dati rumorosi è un
             disastro, perché la differenza fra due numeri quasi uguali è quasi solo rumore. Sui circuiti quantistici
             esiste una strada migliore:</p>`,
      mount: el => {
        stepper(el, [
          { h: 'La domanda', html: 'Voglio la pendenza dell\'energia rispetto alla manopola θ, e l\'unica cosa che so fare è <b>misurare l\'energia</b> per un dato θ.' },
          { h: 'Il trucco classico (e perché non basta)', html: 'Misuro in θ e in θ+0,001 e faccio la differenza divisa per 0,001. Ma le due misure hanno un rumore molto più grande della differenza che cerco: il risultato è quasi solo rumore.' },
          { h: 'La regola dello spostamento', html: 'Sui circuiti parametrici vale una cosa speciale: la pendenza esatta è<br><b>[ E(θ + un quarto di giro) − E(θ − un quarto di giro) ] / 2</b>.' },
          { h: 'Perché è meglio', html: 'Non è un\'approssimazione: è <b>esatta</b>. E i due punti sono <b>lontani</b>, quindi la differenza è grande rispetto al rumore. Nel gioco lo vedi scritto: il numero della regola dello spostamento coincide con la pendenza vera, sempre.' },
          { h: 'Da dove viene', html: 'Dal fatto che l\'energia, al variare di una manopola di rotazione, è sempre una combinazione di seno e coseno: una funzione così è determinata da pochi punti, e la sua derivata si ricava esattamente da due valori spostati di 90°.' },
          { h: 'In pratica', html: 'È la ricetta che usano oggi tutte le librerie di quantum machine learning per allenare circuiti: <b>parameter-shift rule</b>, Mitarai e collaboratori (2018), Schuld e collaboratori (2019).' },
        ], { doneLabel: 'Chiaro!' });
      },
      after: `<div class="callout ok"><b>Il quadro onesto, oggi:</b> nessuna macchina al mondo esegue Shor su numeri
              veri, e i metodi variazionali su hardware rumoroso non hanno ancora dimostrato di battere i migliori
              algoritmi classici sulle stesse molecole. Ma sono quello che si può <b>far girare adesso</b>, e sono il
              campo dove si sta imparando a convivere con il rumore. Vale la pena saperlo, e vale la pena dirlo senza
              esagerare.</div>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nella «valle doppia», parti da destra e scendi. Poi parti da sinistra. Finisci nello stesso fondo?
           Che cosa dice questo su un algoritmo che parte da un punto a caso?</p>
        <p><b>2.</b> Nel secondo gioco metti <b>50 tiri</b> e premi «scendi finché puoi» più volte: il punto finale è
           sempre lo stesso? E con 5000?</p>
        <p><b>3.</b> Guarda i due numeri sotto: la pendenza misurata con la regola dello spostamento e quella vera.
           Con quanti tiri cominciano a coincidere davvero?</p>
        <p class="mb0"><b>4.</b> Da inventore: con una manopola sola il fondo si trova a occhio. Con <b>cento</b>
           manopole (come nei VQE veri) non si può più guardare la curva: si può solo sentire la pendenza sotto i piedi.
           Secondo te che problemi nascono? <span class="muted">(indizio: se il paesaggio diventa piatto quasi ovunque,
           la pendenza non dice più da che parte andare — si chiama «altopiano sterile»)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cosa dice la pendenza (derivata) di una curva in un punto?', options: ['quanto è alta la curva', 'quanto e da che parte la curva sale o scende lì', 'dove sta il minimo', 'quante volte la curva tocca lo zero'], correct: 1,
      why: 'È l\'inclinazione della retta che tocca la curva in quel punto: il segno dà il verso, il valore dà la ripidità. Serve a sapere da che parte muoversi per scendere.' },
    { q: 'Pendenza zero significa sempre «sono nel punto più basso»?', options: ['sì, sempre', 'no: può essere una cima o un fondovalle qualunque, non per forza il più basso', 'solo se la curva è una parabola', 'solo con più di una manopola'], correct: 1,
      why: 'In cima la pendenza è zero come in fondo. E anche fra i fondi ce ne può essere più di uno: chi scende da un punto a caso finisce nel più vicino, non nel migliore.' },
    { q: 'In un algoritmo variazionale, chi fa che cosa?', options: ['tutto il computer quantistico', 'il quantistico prepara e misura, il classico gira le manopole', 'tutto il computer classico', 'si alternano a caso'], correct: 1,
      why: 'È un ciclo a due: la macchina quantistica prepara lo stato e misura un numero, quella classica usa la pendenza per aggiornare i parametri. Da qui il nome «ibridi».' },
    { q: 'Che cos\'è la regola dello spostamento (parameter-shift)?', options: ['un modo per ridurre il rumore', 'un modo per ottenere la pendenza ESATTA valutando l\'energia con la manopola spostata di un quarto di giro', 'una tecnica di correzione degli errori', 'un metodo per accorciare i circuiti'], correct: 1,
      why: 'La differenza fra E(θ + 90°) ed E(θ − 90°), divisa per due, è esattamente la derivata. Due valutazioni lontane fra loro, quindi molto più robuste al rumore di un incremento piccolo.' },
    { q: 'Perché il numero di tiri conta così tanto?', options: ['perché consuma batteria', 'perché l\'errore su una media misurata scende come 1/√tiri: per una cifra in più servono cento volte le misure', 'perché serve a raffreddare il chip', 'perché cambia il risultato vero'], correct: 1,
      why: 'La media misurata è statistica: con pochi tiri balla, e la discesa balla con lei. È il costo nascosto che rende difficili i metodi variazionali sull\'hardware di oggi.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> La derivata è la pendenza, la pendenza dice da che parte scendere, e il
          quantistico di oggi la usa così: prepara, misura, gira la manopola, ripeti. Con la regola dello spostamento
          che rende la pendenza esatta invece che stimata, e il rumore dei tiri che ricorda quanto costa ogni numero.
          Adesso puoi andare in officina a inventare algoritmi tuoi sapendo anche <b>che cosa gira davvero</b>.</div>`,
});
@endsection
