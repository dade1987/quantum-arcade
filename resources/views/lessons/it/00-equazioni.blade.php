@php($description = 'Equazioni spiegate con la bilancia, formule inverse ricavate passo passo e funzioni come macchine: quando si può tornare indietro e quando l\'informazione è persa. Le basi che reggono reversibilità e porte quantistiche.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { bilanciaLab, macchinaLab } from '/js/widgets/equazioni.js';

const L = renderLesson({
  id: '00-equazioni',
  lead: `Questo livello risponde a due domande che sembrano scolastiche e non lo sono. La prima:
         <b>che cosa vuol dire «risolvere» un'equazione?</b> (risposta: quasi niente di quello che ti hanno detto —
         non si «trova» la x, la si <b>mette in mostra</b>). La seconda: <b>quando si può tornare indietro?</b>
         Quella seconda domanda, giocata su macchine di numeri interi, è la stessa identica cosa che nel quantistico
         si chiama reversibilità — ed è il motivo per cui le porte sono fatte come sono fatte.`,

  steps: [
    {
      t: "Che cos'è un'equazione (e cosa vuol dire risolverla)",
      html: `<p>Comincia dal segno <b>=</b>. Non vuol dire «adesso calcola»: vuol dire <b>queste due cose pesano
             uguale</b>. Un'equazione è una bilancia in equilibrio, e basta.</p>
             <p>In <code>2x + 3 = 11</code> a sinistra ci sono due scatole chiuse — ognuna contiene lo stesso numero,
             che non conosciamo — più tre pesi da uno. A destra ci sono undici pesi. Le due parti stanno in
             equilibrio: <b>è un fatto</b>, non una domanda.</p>
             <div class="callout key">Allora «risolvere» che cosa vuol dire? Vuol dire <b>togliere di mezzo tutto
             quello che sta intorno alla scatola</b>, finché a sinistra non resta una scatola sola. A quel punto
             l'altro piatto ti dice quanto pesa. La x non è cambiata: c'era già, valeva già quel numero. È solo
             diventata visibile.</div>
             <p>E la regola per farlo è una sola:</p>
             <div class="formula">quello che fai a un piatto, <span class="hl-n">devi farlo anche all'altro</span></div>
             <p>Se lo fai, la bilancia resta in equilibrio e la risposta non si sposta. Se non lo fai, hai scritto una
             cosa falsa. Nel gioco la barra non si inclina mai: è quello il punto.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'bilancia', title: 'Metti in mostra la x', text: 'risolvi 3 equazioni tenendo la bilancia in equilibrio.', xp: 35 });
        el.appendChild(m.root);
        bilanciaLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Guarda la riga «la x vale …» mentre giochi: <b>non cambia mai</b>, mossa dopo mossa. È la prova che
              le mosse non risolvono niente — mettono solo in chiaro una cosa che era già vera.</p>
              <div class="callout key">La parola <b>algebra</b> nasce esattamente qui. Viene dal titolo di un libro di
              al-Khwārizmī, intorno all'anno 820: <i>al-jabr</i> vuol dire «rimettere a posto», cioè spostare un pezzo
              da un piatto all'altro senza rompere l'equilibrio. Mille e duecento anni dopo, stai facendo la stessa
              cosa con il mouse.</div>`,
    },

    {
      t: 'Girare una formula: le formule inverse',
      html: `<p>Una formula è una bilancia già scritta. «Girarla» vuol dire usare le stesse mosse per isolare un'altra
             lettera, invece della x.</p>
             <p>Esempio che conosci: l'area di un rettangolo è <code>A = b · h</code>. Se conosci l'area e la base e
             vuoi l'altezza, dividi entrambi i piatti per b, e ottieni <code>h = A / b</code>. Non hai imparato una
             formula nuova: hai fatto <b>una mossa</b> su quella vecchia.</p>
             <p>Adesso le tre formule del corso che ti capiterà di dover girare, smontate una per una:</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Con n bit scegli fra 2ⁿ', html: 'La formula è <b>N = 2ⁿ</b>. Se sai quanti bit hai (n), il numero di possibilità viene da sé. Ma spesso serve il contrario.' },
          { h: 'Girala', html: 'Se sai quante possibilità ti servono (N) e vuoi sapere quanti bit servono, la mossa che «disfa» l\'elevamento a potenza si chiama <b>logaritmo</b>: <b>n = log₂N</b>. Con N = 1024 → n = 10. È il livello successivo, ed è tutto qui.' },
          { h: 'La regola del qubit', html: 'La regola è <b>α² + β² = 1</b> (le due probabilità fanno il 100%). Se conosci α e vuoi β, togli α² da tutti e due i piatti: <b>β² = 1 − α²</b>, e poi la radice: <b>β = √(1 − α²)</b>.' },
          { h: 'Un conto vero', html: 'Con α = 0,6: β² = 1 − 0,36 = 0,64, quindi β = 0,8. Prova a controllare: 0,6² + 0,8² = 0,36 + 0,64 = 1 ✓.' },
          { h: 'La fase di un giro', html: 'Nella trasformata di Fourier ricorre <b>θ = 2π·k/N</b>. Se sai l\'angolo e vuoi sapere a quale k corrisponde, moltiplichi entrambi i piatti per N e dividi per 2π: <b>k = θ·N / (2π)</b>.' },
          { h: 'Il punto', html: 'Sono sempre le stesse tre mosse: <b>aggiungi o togli</b> la stessa cosa a tutti e due, <b>moltiplica o dividi</b> tutti e due, oppure <b>applica a tutti e due</b> la stessa operazione che si può disfare (radice, logaritmo). Nient\'altro.' },
        ], { doneLabel: 'Chiaro!' });
      },
      after: `<div class="callout warn"><b>Una nota che vale un livello:</b> l'ultima mossa funziona solo con
              operazioni <b>che si possono disfare</b>. Elevare al quadrato, per esempio, non si disfa del tutto: da
              β² = 0,64 si ricava β = 0,8 <b>oppure</b> β = −0,8, e quale delle due sia il quadrato non lo sa più.
              Ed è precisamente il tema del prossimo passo.</div>`,
    },

    {
      t: 'Le funzioni sono macchine (e alcune non tornano indietro)',
      html: `<p>Una <b>funzione</b> è una macchina che prende un numero e ne restituisce un altro. Le regole sono due,
             e sono tutte:</p>
             <ul>
               <li>a ogni numero che entra corrisponde <b>una sola</b> uscita (altrimenti non è una macchina, è un dado);</li>
               <li>l'insieme dei numeri che <b>possono</b> entrare si chiama <b>dominio</b>: «÷0» non è ammesso, «√» di
                   un numero negativo nemmeno, finché restiamo sui numeri normali.</li>
             </ul>
             <p>Fin qui è ovvio. La domanda interessante è un'altra, e il gioco è tutto su quella:</p>
             <div class="callout key"><b>Guardando solo l'uscita, si può risalire a che cosa era entrato?</b></div>
             <p>Per certe macchine sì, sempre: se ti dico che l'uscita è 10 e la macchina raddoppia, era entrato 5.
             Per altre no, e non per pigrizia: <b>è impossibile</b>. Se la macchina eleva al quadrato e l'uscita è 9,
             era entrato 3 oppure −3, e nessuna informazione al mondo può dirti quale — perché quell'informazione
             <b>non esiste più</b>.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'macchine', title: 'Chi torna indietro e chi no', text: 'classifica correttamente 4 macchine.', xp: 40 });
        el.appendChild(m.root);
        macchinaLab(el, { need: 4, onWin: () => m.complete() });
      },
      after: `<p>Il criterio che hai usato ha un nome: una macchina si può percorrere all'indietro se e solo se
              <b>non fa mai finire due numeri diversi nello stesso posto</b>. Quando due ingressi si scontrano, da
              quel punto in poi sono indistinguibili.</p>
              <p>E c'è un modo di dirlo che vale la pena tenere: <b>una macchina che perde informazione non si può
              invertire</b>. Non è una limitazione tecnica: è la definizione.</p>`,
    },

    {
      t: 'Perché tutto questo diventa quantistico',
      html: `<p>Adesso mettiamo insieme le due metà del livello, e il risultato è più forte di quanto sembri.</p>
             <p>Le porte logiche di un computer normale — AND, OR — sono macchine <b>senza ritorno</b>: da un AND che
             vale 0 non sai se gli ingressi erano 0 e 0, 0 e 1, o 1 e 0. Tre situazioni diverse, un'uscita sola:
             informazione persa a ogni operazione.</p>
             <p>Le porte quantistiche, invece, <b>devono</b> tornare indietro. Sempre. E la ragione la puoi ricavare
             tu, con una formula girata:</p>`,
      mount: el => {
        formula(el, {
          title: 'La catena, in quattro pezzi',
          parts: [
            { t: 'probabilità = ampiezza²', id: 'p', color: 'cyan', name: 'la regola di Born', say: 'Ogni possibilità ha un\'ampiezza; la probabilità di vederla è il suo quadrato.', ex: 'Ampiezza 0,6 → probabilità 0,36.' },
            { t: '→' },
            { t: 'somma = 1', id: 's', color: 'amber', name: 'le probabilità fanno 100%', say: 'La somma dei quadrati di tutte le ampiezze deve fare 1: qualcosa deve pur succedere.', ex: '0,6² + 0,8² = 1 ✓' },
            { t: '→' },
            { t: 'lunghezza fissa', id: 'l', color: 'green', name: 'la freccia dello stato è lunga 1', say: 'Somma dei quadrati = 1 è Pitagora: la freccia che rappresenta lo stato ha sempre la stessa lunghezza.', ex: 'Nel livello delle matrici è il cerchio da cui la freccia non esce mai.' },
            { t: '→' },
            { t: 'si torna indietro', id: 'r', color: 'violet', name: 'la porta è invertibile', say: 'Una macchina che non schiaccia e non allunga niente non può far finire due stati diversi nello stesso posto: quindi si può sempre percorrere all\'indietro.', ex: 'Ecco perché non esiste una porta quantistica «AND» come quella classica: butterebbe via informazione.' },
          ],
        });
      },
      after: `<div class="callout ok">Questa catena è tutto il ponte fra la matematica delle medie e il quantistico:
              <b>probabilità che fanno 100% → lunghezza che non cambia → macchina che si può invertire</b>. Nel
              livello sulla reversibilità la incontri dal lato dell'informazione, in quello sulle matrici dal lato
              della geometria. È la stessa frase, detta in tre lingue.</div>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nell'equazione <code>3x = x + 8</code> non basta togliere pesi: bisogna togliere <b>una scatola</b>
           da tutti e due i piatti. Perché è una mossa legale?</p>
        <p><b>2.</b> Gira tu questa formula: <code>v = s / t</code>. Ricava <b>t</b>. Quale mossa hai fatto, e su quale
           piatto?</p>
        <p><b>3.</b> La macchina «resto della divisione per 4» manda 1, 5, 9, 13… tutti sullo stesso posto. Dove
           l'hai già vista, questa macchina? <span class="muted">(indizio: l'orologio del livello 0·5)</span></p>
        <p class="mb0"><b>4.</b> Da inventore: la macchina «×0» butta via <b>tutto</b>. Se una porta quantistica
           potesse fare così, che cosa succederebbe alla somma delle probabilità?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cosa significa il segno «=» in un\'equazione?', options: ['adesso calcola il risultato', 'le due parti valgono la stessa cosa', 'la x è a sinistra', 'il numero più grande sta a destra'], correct: 1,
      why: 'È una bilancia in equilibrio: i due lati pesano uguale. Risolvere non cambia questo fatto, lo rende solo leggibile isolando la x.' },
    { q: 'Perché una mossa va fatta su tutti e due i lati?', options: ['per abitudine', 'perché altrimenti l\'uguaglianza smette di essere vera', 'per andare più veloce', 'solo quando ci sono le frazioni'], correct: 1,
      why: 'Togliere peso da un piatto solo sbilancia la bilancia: la nuova scrittura sarebbe falsa, e la risposta non sarebbe più quella di prima.' },
    { q: 'Da A = b · h, come si ricava h?', options: ['h = A · b', 'h = A / b', 'h = A − b', 'h = b / A'], correct: 1,
      why: 'Si divide per b entrambi i lati: a sinistra resta h, a destra A/b. È la stessa mossa della bilancia, applicata a una formula.' },
    { q: 'Quando una macchina (funzione) si può percorrere all\'indietro?', options: ['quando i numeri sono piccoli', 'quando non fa mai finire due ingressi diversi nella stessa uscita', 'quando usa solo somme', 'sempre'], correct: 1,
      why: 'Se due ingressi diversi danno la stessa uscita, dall\'uscita è impossibile sapere da quale si veniva: quell\'informazione non esiste più.' },
    { q: 'Perché ogni porta quantistica deve essere invertibile?', options: ['per convenzione dei fisici', 'perché conserva la lunghezza della freccia di stato, e quindi non può schiacciare due stati diversi nello stesso', 'perché è più veloce', 'perché altrimenti servono più qubit'], correct: 1,
      why: 'Probabilità = ampiezza² e la somma deve fare 1: la freccia dello stato è sempre lunga 1. Una macchina che non cambia le lunghezze non può far collidere due stati, quindi si può sempre invertire.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> Un'equazione è una bilancia, risolverla vuol dire mettere in mostra
          quello che c'era già, girare una formula sono le stesse tre mosse, e una macchina torna indietro solo se non
          perde informazione per strada. L'ultima frase è quella che nel resto del corso si chiamerà, di volta in
          volta, reversibilità o unitarietà.</div>`,
});
@endsection
