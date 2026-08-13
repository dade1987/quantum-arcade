@php($description = 'Aritmetica dell\'orologio spiegata giocando: il resto (mod), il massimo comune divisore con il metodo di Euclide, il periodo di a^x mod N e le frazioni continue. La matematica classica che sta dentro l\'algoritmo di Shor.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { clockLab, euclidLab, periodLab } from '/js/widgets/modmath.js';

const L = renderLesson({
  id: '00-orologio',
  lead: `Questo livello insegna tre cose che sai già a metà: <b>contare a giri</b> (come sull'orologio),
         <b>trovare il pezzo che sta esatto in due misure diverse</b> (il massimo comune divisore) e
         <b>accorgersi che un ritmo si ripete</b>. Sono roba delle medie, e sono i tre attrezzi con cui
         si smonta l'algoritmo più famoso del corso — quello che, in teoria, rompe le password di mezzo
         Internet. La parte difficile di Shor è una sola; tutto il resto è qui dentro.`,

  steps: [
    {
      t: 'Contare a giri: il resto',
      html: `<p>Sono le <b>10</b>. Fra <b>5</b> ore che ore saranno? Le <b>3</b>. Non le 15: hai contato oltre la fine
             del quadrante, sei ripassato dal 12 e hai ricominciato.</p>
             <p>Questo modo di contare ha un nome e un simbolo:</p>
             <div class="formula">15 mod 12 = <span class="hl-n">3</span></div>
             <p>«mod» si legge «modulo» e vuol dire una cosa sola: <b>prendi il resto della divisione</b>.
             15 diviso 12 fa 1 con il resto di 3, e il resto è dove si ferma la lancetta.</p>
             <div class="callout key">Un quadrante può avere il numero di ore che vogliamo. Con 7 ore:
             <b>17 mod 7 = 3</b>, perché 17 = 2×7 + 3 — due giri interi, e poi tre passi.</div>
             <p>Nel gioco qui sotto muovi il numero e guarda la spirale: <b>ogni giro disegnato è un giro vero</b>.
             Quando arrivi in fondo, quello che avanza è il resto.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'orologio', title: 'Tre strade, stessa ora', text: 'ferma la lancetta sul bersaglio con 3 numeri diversi.', xp: 30 });
        el.appendChild(m.root);
        clockLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Avrai notato la cosa più importante: sul bersaglio ci arrivi con <b>tanti numeri diversi</b>.
              Con un quadrante da 7, i numeri 3, 10, 17, 24, 31… finiscono tutti nella stessa ora, e distano
              esattamente 7 l'uno dall'altro.</p>
              <div class="callout key">Per l'orologio quei numeri sono <b>la stessa cosa</b>. È l'idea che
              Gauss mise per iscritto nel 1801 e che oggi regge la crittografia: quando lavori «mod N» non
              esistono infiniti numeri, ne esistono solo <b>N</b>.</div>`,
    },

    {
      t: 'Il pavimento di Euclide: il massimo comune divisore',
      html: `<p>Hai una stanza larga <b>48</b> e profonda <b>18</b>, e vuoi pavimentarla con <b>piastrelle quadrate
             tutte uguali</b>, senza tagliarne nemmeno una. Quanto può essere grande la piastrella?</p>
             <p>Il lato più grande possibile è il <b>massimo comune divisore</b> di 48 e 18. Detto senza formule:
             <b>il righello più lungo che sta un numero intero di volte in tutti e due i lati</b>.</p>
             <p>C'è un modo per trovarlo che non richiede di provare i numeri uno per uno, ed è vecchio di circa
             2300 anni — sta negli <i>Elementi</i> di Euclide. Nel gioco lo fai a mano:</p>
             <ol>
               <li>ritaglia dal pavimento il <b>quadrato più grande che ci sta</b>;</li>
               <li>guarda il rettangolo che avanza;</li>
               <li>ricomincia da capo con quello.</li>
             </ol>
             <p>Il lato dell'<b>ultimo</b> quadrato — quello dopo il quale non avanza più niente — è la risposta.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'euclide', title: 'Pavimenta senza tagliare', text: 'porta a termine due pavimenti diversi.', xp: 30 });
        el.appendChild(m.root);
        euclidLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Scritto in numeri, il pavimento 48 × 18 dice questo:</p>
              <div class="formula mono">48 = 2×18 + 12 &nbsp;·&nbsp; 18 = 1×12 + 6 &nbsp;·&nbsp; 12 = 2×6 + <span class="hl-n">0</span></div>
              <p>Appena il resto è zero, il numero che stavi dividendo è il massimo comune divisore: <b>6</b>.</p>
              <div class="callout key"><b>Perché è velocissimo:</b> a ogni passo il numero più grande si accorcia in
              fretta, e nel 1844 Gabriel Lamé dimostrò che i passi non superano mai cinque volte il numero di cifre.
              Su numeri da 600 cifre sono qualche migliaio di operazioni: un battito di ciglia. Tienilo a mente,
              perché fra due passi ci servirà proprio questo: <b>l'ultimo pezzo di Shor è gratis</b>.</div>`,
    },

    {
      t: 'Il ritmo che torna: il periodo',
      html: `<p>Adesso mettiamo insieme le due cose. Prendi un quadrante da <b>15</b> ore, parti dall'<b>1</b> e
             fai sempre la stessa mossa: <b>moltiplica per 7 e prendi il resto</b>.</p>
             <div class="formula mono">1 → 7 → 4 → 13 → <span class="hl-n">1</span> → 7 → 4 → 13 → 1 …</div>
             <p>Dopo <b>4</b> passi sei tornato al punto di partenza, e da lì in poi la sequenza si ripete uguale
             per sempre. Quel numero di passi si chiama <b>periodo</b>, e si scrive <b>r</b>.</p>
             <p>Nel gioco la passeggiata si disegna da sola: ogni moltiplicazione è una corda sul quadrante, e
             quando ripassi dall'1 <b>la figura si chiude</b>. Guarda la stella che viene fuori: quella è il ritmo.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'periodo', title: 'Chiudi due stelle', text: 'trova il periodo per due coppie (N, a) diverse.', xp: 40 });
        el.appendChild(m.root);
        periodLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Due domande che vengono naturali, e hanno risposta:</p>
              <p><b>Si torna sempre all'1?</b> Sì, purché il moltiplicatore non abbia fattori in comune con il
              quadrante — cioè purché il loro massimo comune divisore sia 1. È il teorema di Eulero (1763), ed è il
              motivo per cui il gioco ti lascia scegliere solo certi moltiplicatori: con gli altri la stella non si
              chiuderebbe mai.</p>
              <p><b>E su numeri grandi?</b> Qui casca il mondo. Su un quadrante da 15 il ritmo si vede a occhio;
              su un quadrante con 600 cifre nemmeno tutti i computer del pianeta, messi insieme per anni, riescono
              a trovarlo — perché i passi da provare sono più dei granelli di sabbia dell'universo.</p>
              <div class="callout key"><b>Ed è tutto qui il punto:</b> fattorizzare un numero — spezzarlo nei suoi
              fattori primi, che è quello che protegge le chiavi RSA — è equivalente a trovare questo ritmo. Il
              computer quantistico non prova i passi uno per uno: li mette <b>tutti in sovrapposizione</b> e poi usa
              la trasformata di Fourier per far emergere il ritmo. Il resto — massimo comune divisore compreso — è
              la matematica che hai appena giocato.</div>`,
    },

    {
      t: 'Un ultimo attrezzo: la frazione più semplice',
      html: `<p>Manca un pezzo solo, e conviene vederlo adesso che è facile. Il computer quantistico, alla fine,
             non ti consegna il periodo: ti consegna un <b>numero misurato</b> che gli assomiglia molto. Qualcosa
             come <b>0,3337</b>. Il periodo va ricavato da lì.</p>
             <p>La domanda diventa: <b>qual è la frazione più semplice vicinissima a questo numero?</b> Il metodo
             per rispondere si chiama <b>frazioni continue</b> ed è, di nuovo, Euclide travestito.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Il numero misurato', html: 'La macchina ha misurato <b>0,3337</b>. Sappiamo che è vicino a k/r, dove r è il periodo che cerchiamo — ma non sappiamo né k né r.' },
          { h: 'Primo passo', html: '0,3337 è più piccolo di 1: la parte intera è <b>0</b>. Restiamo con 0,3337 e lo capovolgiamo: <b>1 / 0,3337 ≈ 2,9967</b>.' },
          { h: 'Secondo passo', html: 'La parte intera di 2,9967 è <b>2</b>… ma avanza 0,9967, che è quasi 1. Capovolgiamo ancora: <b>1 / 0,9967 ≈ 1,0033</b>, parte intera <b>1</b>.' },
          { h: 'Si ricompone', html: 'Rimettendo insieme i pezzi (0; 2, 1) si ottiene la frazione <b>1/3</b>. E infatti 1/3 = 0,3333…, che è a un capello da 0,3337.' },
          { h: 'La risposta', html: 'Il denominatore è <b>3</b>: <b>il periodo è r = 3</b>. Ed è questo il salto: da un numero decimale sporco, misurato una volta sola, si torna a un intero esatto.' },
          { h: 'Perché non basta arrotondare', html: 'Perché 0,3337 assomiglia anche a 3337/10000, che è una frazione validissima e completamente inutile. Le frazioni continue cercano la <b>più semplice</b>, cioè quella con il denominatore più piccolo: è l\'unica che può essere un periodo.' },
        ], { doneLabel: 'Chiaro!' });
      },
      after: `<div class="callout ok">Ora hai in mano <b>tutti</b> i pezzi classici dell'algoritmo di Shor: il resto,
              il periodo, le frazioni continue e il massimo comune divisore. Quando ci arriverai, l'unica cosa
              davvero nuova sarà la parte quantistica — che è una sola, e occupa tre righe del circuito.</div>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Su un quadrante da 12, quali numeri fra 0 e 50 finiscono sul <b>7</b>? Che differenza c'è
           fra un numero e il successivo della lista?</p>
        <p><b>2.</b> Nel pavimento di Euclide, prova <b>21 × 13</b>. Che lato ha l'ultima piastrella? Cosa vuol dire
           su quei due numeri? <span class="muted">(indizio: si dice che sono «primi fra loro»)</span></p>
        <p><b>3.</b> Sul quadrante da 15, il moltiplicatore 4 che ritmo dà? E il 14? Uno dei due ha periodo <b>2</b>:
           un periodo così corto aiuta o no, secondo te, chi vuole fattorizzare?</p>
        <p class="mb0"><b>4.</b> Domanda da inventore: perché il gioco non ti lascia scegliere il moltiplicatore
           <b>3</b> su un quadrante da 15? Prova a immaginare cosa succederebbe alla passeggiata.
           <span class="muted">(e se ci arrivi: quel «fallimento» è in realtà una fortuna, perché ti regala
           subito un fattore di 15)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cosa vuol dire «17 mod 5»?', options: ['17 moltiplicato 5', 'il resto della divisione di 17 per 5', '17 elevato a 5', 'la metà di 17'], correct: 1,
      why: '17 = 3×5 + 2, quindi 17 mod 5 = 2. È dove si ferma la lancetta su un quadrante da 5 ore.' },
    { q: 'Su un quadrante da 7, quali di questi numeri finiscono nella stessa ora?', options: ['3 e 5', '4 e 14', '10 e 17', '6 e 8'], correct: 2,
      why: '10 e 17 distano 7, cioè un giro esatto: 10 mod 7 = 3 e 17 mod 7 = 3. I numeri che finiscono nella stessa ora distano sempre un multiplo di N.' },
    { q: 'Nel metodo di Euclide a piastrelle, che cosa rappresenta l\'ultimo quadrato ritagliato?', options: ['il numero più piccolo dei due', 'il massimo comune divisore', 'la metà del rettangolo', 'un numero primo'], correct: 1,
      why: 'Il lato dell\'ultimo quadrato sta un numero intero di volte in entrambi i lati di partenza, ed è il più grande che lo faccia: è la definizione di massimo comune divisore.' },
    { q: 'Che cos\'è il «periodo r» della sequenza 1, 7, 4, 13, 1, 7, 4, 13, …?', options: ['il numero più grande della sequenza', 'quanti passi servono per tornare a 1', 'la somma dei numeri', 'il resto finale'], correct: 1,
      why: 'Dopo 4 passi si ritorna sull\'1 e tutto ricomincia: r = 4. Trovare questo numero è l\'unico punto in cui Shor ha bisogno del computer quantistico.' },
    { q: 'Perché il moltiplicatore deve avere massimo comune divisore 1 con il quadrante?', options: ['per rendere il gioco più difficile', 'altrimenti la passeggiata non torna mai sull\'1', 'per far tornare i conti delle percentuali', 'non è vero, va bene qualunque numero'], correct: 1,
      why: 'Se condividono un fattore, le potenze restano intrappolate nei multipli di quel fattore e non ripassano mai dall\'1: nessun periodo da trovare. In Shor, però, scoprirlo è una fortuna: quel fattore in comune è già un fattore di N.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> Contare a giri, il pavimento di Euclide, il ritmo che torna e la
          frazione più semplice: quattro attrezzi classici, nessuna formula calata dall'alto. Quando arriverai
          all'algoritmo di Shor non dovrai impararli lì, di corsa, insieme a tutto il resto — li riconoscerai.</div>`,
});
@endsection
