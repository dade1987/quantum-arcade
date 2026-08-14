@php($description = 'Autovettori e autovalori spiegati giocando: le frecce che una trasformazione non gira, e perché su quelle frecce una porta quantistica cambia solo la fase. Il livello che rende leggibile la stima di fase.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { eigenHunt, phaseHunt } from '/js/widgets/autovettori.js';

const L = renderLesson({
  id: '18b-autovettori',
  lead: `Il livello successivo si chiama <b>stima di fase</b> e comincia così: «dato uno stato che l'operazione lascia
         uguale a parte una fase, misura quella fase». È una frase che si può leggere due volte senza capirci niente —
         a meno di sapere che cos'è quello stato. Si chiama <b>autovettore</b>, in venti minuti lo si trova con le mani,
         e da lì in poi la stima di fase smette di essere magia e diventa una procedura ovvia.`,

  steps: [
    {
      t: 'Le frecce che la macchina non gira',
      html: `<p>Riprendi la macchina delle matrici: prende una freccia, ne restituisce un'altra. Quasi sempre la freccia
             che esce <b>punta da un'altra parte</b> rispetto a quella che entra.</p>
             <p>Ma non sempre. Per certe direzioni — poche, speciali — la freccia che esce è <b>sulla stessa retta</b> di
             quella che entra: magari più lunga, magari più corta, magari girata al contrario, ma <b>in linea</b>.</p>
             <div class="callout key">Una freccia così si chiama <b>autovettore</b> della macchina. Il numero per cui
             viene moltiplicata si chiama <b>autovalore</b>. Sono solo due nomi lunghi per una cosa che adesso vedi.</div>
             <p>Nel gioco: trascina la freccia azzurra e guarda quella arancione, che è la sua trasformata. Quando le due
             sono in linea il gioco lo dice — e ti dice anche di quanto la freccia si è allungata.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'caccia', title: 'A caccia di direzioni ferme', text: 'trova 3 direzioni che restano in linea, su macchine diverse.', xp: 45 });
        el.appendChild(m.root);
        eigenHunt(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Tre cose che il gioco fa scoprire, e che valgono per qualunque macchina:</p>
              <ul>
                <li>lo <b>stiramento</b> ha due direzioni ferme (gli assi), con autovalori 2 e 0,5;</li>
                <li>la <b>porta H</b> ne ha due, con autovalori <b>+1 e −1</b>: non allunga niente, ribalta soltanto;</li>
                <li>lo <b>scivolo</b> ne ha una sola. Non è un difetto del gioco: certe macchine sono fatte così.</li>
              </ul>
              <div class="callout warn"><b>E poi c'è la rotazione</b>, che di direzioni ferme non ne ha <b>nessuna</b>:
              gira tutto, senza eccezioni. Se ti sembra un vicolo cieco, tieni il pensiero: fra due passi diventa la
              chiave di tutto.</div>`,
    },

    {
      t: 'Perché ci interessa: le porte sono macchine',
      html: `<p>Una porta quantistica è una matrice unitaria, e le matrici unitarie hanno una proprietà comoda: <b>non
             allungano e non accorciano niente</b>. Quindi i loro autovalori non possono essere 2 o 0,5 — dovrebbero
             essere per forza numeri di lunghezza 1.</p>
             <p>Con i soli numeri reali gli unici candidati sarebbero <b>+1</b> e <b>−1</b>. E infatti la porta Z e la
             porta H hanno esattamente quelli. Ma la rotazione ci ha appena fatto vedere che le trasformazioni con
             autovalori reali non bastano.</p>
             <div class="callout key">La via d'uscita la conosci già dalla Parte B: i numeri di lunghezza 1 non sono
             due, sono <b>tutto un cerchio</b> — sono le <b>fasi</b> e^{iθ}. Ecco il punto di arrivo:
             <p class="mb0" style="margin-top:8px"><b>Su un autovettore, una porta quantistica non cambia lo stato:
             gli moltiplica una fase.</b></p></div>
             <p>Che è, parola per parola, la frase con cui comincia il livello successivo — solo che adesso sai cosa
             vuol dire.</p>`,
    },

    {
      t: 'La fase si misura contando',
      html: `<p>Prendiamo una porta U che, sul suo autovettore, gira la fase di <b>90°</b> ogni volta che la applichi.
             Applicala quattro volte: 90 + 90 + 90 + 90 = 360, cioè un giro intero. Sei tornato a casa.</p>
             <p>Il conto si può fare al contrario, ed è la parte interessante: <b>se conto quante applicazioni servono
             per tornare a casa, ho misurato la fase</b>. Quattro applicazioni → un quarto di giro → 90°.</p>
             <div class="callout key">Nota una cosa mentre giochi: le <b>probabilità non cambiano mai</b>. La fase da
             sola è invisibile a una misura. Si vede solo facendola <b>interferire</b>, ed è esattamente il mestiere
             della trasformata di Fourier.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'fase', title: 'Misura due fasi contando', text: 'porta la freccia a casa e dì quante applicazioni servono, per 2 porte diverse.', xp: 55 });
        el.appendChild(m.root);
        phaseHunt(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Se questo conteggio ti ha ricordato qualcosa, hai ragione: è lo stesso gioco del <b>ritmo che torna</b>
              dell'orologio modulare (livello 0·5). Lì contavi i passi per ritornare all'1, qui conti le applicazioni per
              tornare a casa. È la stessa matematica — e non è un caso che Shor usi tutti e due.</p>`,
    },

    {
      t: 'Dal conteggio alla stima di fase',
      html: `<p>Contare a mano ha un difetto: <b>costa un'applicazione per volta</b>. Con una fase piccola — un
             millesimo di giro — servirebbero mille applicazioni e mille misure. Il computer quantistico fa lo stesso
             lavoro in un altro modo:</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Passo 1', html: 'Si prepara il registro di lettura in <b>sovrapposizione</b> di tutti i numeri: 0, 1, 2, 3, … (bastano le porte H, una per qubit).' },
          { h: 'Passo 2', html: 'Si applica U <b>una volta</b> controllata dal primo qubit, <b>due</b> volte dal secondo, <b>quattro</b> dal terzo, e così via: raddoppiando, con pochi qubit si arriva a moltissime applicazioni.' },
          { h: 'Passo 3', html: 'Grazie al <b>phase kickback</b>, la fase dell\'autovettore finisce scritta nel registro di lettura: ogni numero x si ritrova moltiplicato per la fase ripetuta x volte. È un <b>pettine di fasi</b> che gira sempre allo stesso ritmo.' },
          { h: 'Passo 4', html: 'Un pettine che gira a ritmo costante è precisamente ciò che la <b>trasformata di Fourier</b> sa leggere: la QFT inversa lo trasforma in un <b>picco</b> su un numero solo.' },
          { h: 'Passo 5', html: 'Si misura, ed esce quel numero: è la fase, scritta in binario. Il conteggio che tu hai fatto una applicazione per volta, la macchina lo fa <b>tutto insieme</b>.' },
          { h: 'E Shor?', html: 'Shor è questa procedura applicata alla moltiplicazione modulare: la «fase» da leggere è 1/r, e r è il periodo dell\'orologio. Ecco perché quel livello e questo sono lo stesso livello, visto da due parti.' },
        ], { doneLabel: 'Chiaro!' });
      },
      after: `<div class="callout ok">Con questo in mano, il livello successivo si legge come una ricetta: preparare
              l'autovettore, applicare U raddoppiando, leggere con la Fourier inversa. Nessuna magia, nessun passaggio
              da prendere per buono.</div>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel primo gioco, prova la <b>porta H</b>: le due direzioni ferme non stanno sugli assi. A che angolo
           stanno, più o meno? <span class="muted">(indizio: a metà strada fra l'asse orizzontale e la diagonale)</span></p>
        <p><b>2.</b> Un autovalore <b>negativo</b> che cosa vuol dire, guardando le due frecce? E perché una porta
           quantistica può permetterselo senza rompere le probabilità?</p>
        <p><b>3.</b> Nel secondo gioco scegli 72°: quante applicazioni per tornare a casa? E se la porta girasse di 1°?
           Quante misure servirebbero a contarle a mano?</p>
        <p class="mb0"><b>4.</b> Da inventore: se una porta lascia <b>ogni</b> freccia in linea con sé stessa, che
           matrice è? <span class="muted">(e che utilità ha in un circuito?)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cos\'è un autovettore di una trasformazione?', options: ['la freccia più lunga', 'una freccia che la trasformazione lascia in linea con sé stessa', 'la prima colonna della matrice', 'una freccia di lunghezza 1'], correct: 1,
      why: 'La trasformazione può allungarla, accorciarla o ribaltarla, ma non le cambia direzione: resta sulla stessa retta. Il fattore di moltiplicazione è l\'autovalore.' },
    { q: 'Perché gli autovalori di una porta quantistica hanno modulo 1?', options: ['per convenzione', 'perché una porta è unitaria e non cambia le lunghezze', 'perché sono sempre numeri interi', 'perché la misura li normalizza'], correct: 1,
      why: 'Se un autovalore fosse 2, quella freccia raddoppierebbe e le probabilità supererebbero il 100%. Con modulo 1 l\'unico effetto possibile è una rotazione della fase.' },
    { q: 'Applicando una porta al suo autovettore, che cosa cambia?', options: ['lo stato diventa un altro stato', 'solo la fase', 'la probabilità di leggere 0', 'il numero di qubit'], correct: 1,
      why: 'Lo stato resta lo stesso a meno di un fattore di fase: è per questo che le probabilità misurate non cambiano di nulla, e serve la Fourier per far emergere quella fase.' },
    { q: 'Se una porta U gira la fase di 72° a ogni applicazione, dopo quante applicazioni si torna al punto di partenza?', options: ['3', '4', '5', '8'], correct: 2,
      why: '72 × 5 = 360, cioè un giro intero. Contare quelle applicazioni equivale a misurare la fase: 1/5 di giro.' },
    { q: 'Perché la rotazione di 90° non ha autovettori reali?', options: ['perché è troppo veloce', 'perché gira ogni freccia, senza eccezioni: gli autovalori sono fasi complesse', 'perché la sua matrice non è quadrata', 'perché non è unitaria'], correct: 1,
      why: 'Nessuna freccia reale resta in linea. I suoi autovalori sono ±i: numeri di lunghezza 1 ma complessi. È esattamente il motivo per cui il quantistico vive sui numeri complessi.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> Autovettore = la freccia che la macchina non gira. Autovalore = di quanto
          la moltiplica. Su una porta quantistica quell'autovalore è una <b>fase</b>, e contare quante applicazioni
          riportano a casa è già una misura di quella fase. Il prossimo livello lo fa in un colpo solo.</div>`,
});
@endsection
