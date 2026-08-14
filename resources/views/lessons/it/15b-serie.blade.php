@php($description = 'La serie geometrica spiegata giocando: pezzi che si rimpiccioliscono e frecce che si chiudono in cerchio. È la formula che fa nascere il picco della trasformata di Fourier e che regge QFT, stima di fase e Shor.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { serieReale, serieFrecce } from '/js/widgets/serie.js';

const L = renderLesson({
  id: '15b-serie',
  lead: `Fra un livello vedrai la trasformata di Fourier fare una cosa che sembra magia: su tutte le frequenze
         sbagliate la somma viene <b>zero</b>, e su quella giusta salta fuori un <b>picco</b>. Perché zero, e non un
         numero qualunque? La risposta è una formula sola, vecchia di quattro secoli, e si gioca in dieci minuti.
         Impararla adesso vuol dire arrivare alla Fourier sapendo <b>perché</b> funziona, invece di guardarla
         funzionare.`,

  steps: [
    {
      t: 'Pezzi che si rimpiccioliscono',
      html: `<p>Parti da un pezzo lungo <b>1</b>. Poi aggiungi un pezzo che è <b>la metà</b> del precedente. Poi un altro
             che è la metà di quello. E avanti così, per sempre.</p>
             <div class="formula">1 + ½ + ¼ + ⅛ + … = <span class="hl-n">2</span></div>
             <p>Infiniti pezzi, e il totale <b>non arriva mai a 2</b>: ci si avvicina soltanto. Non è un trucco, è quello
             che vedi succedere nel gioco: i pezzi diventano così piccoli così in fretta che il totale sbatte contro un
             muro.</p>
             <div class="callout key">La regola generale, per pezzi che ogni volta si moltiplicano per <b>r</b>
             (con r fra 0 e 1):
             <div class="formula" style="margin:8px 0 0">1 + r + r² + r³ + … = <span class="hl-n">1 / (1 − r)</span></div></div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'pezzi', title: 'Centra due totali', text: 'porta il totale sui bersagli richiesti muovendo frazione e numero di pezzi.', xp: 35 });
        el.appendChild(m.root);
        serieReale(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Il gioco mostra anche l'altra formula, quella per un numero <b>finito</b> di pezzi:</p>
              <div class="formula">1 + r + … + r<sup>n−1</sup> = <span class="hl-n">(1 − rⁿ) / (1 − r)</span></div>
              <p>Vale sempre, non solo per r piccole. Ed è questa — non quella infinita — che fra due passi farà tutto
              il lavoro.</p>`,
    },

    {
      t: 'Gli stessi pezzi, ma girati',
      html: `<p>Adesso il salto. Invece di pezzi che si <b>accorciano</b>, prendiamo frecce che <b>girano</b>: tutte lunghe
             uguale, ognuna ruotata di un passo fisso rispetto alla precedente.</p>
             <p>È esattamente la stessa somma di prima — ogni pezzo si ottiene dal precedente moltiplicandolo sempre per
             la stessa cosa — solo che quella «stessa cosa» adesso è una <b>rotazione</b> invece di una frazione.</p>
             <p>E succede una cosa che vale la pena guardare con calma:</p>
             <ul>
               <li>se il passo è <b>zero</b> (o un giro intero), tutte le frecce puntano nella stessa direzione e si
                   sommano: la somma è lunga quanto il numero di frecce. <b>È il picco.</b></li>
               <li>se il passo è <b>un giro diviso il numero di frecce</b> (o un suo multiplo), la catena si chiude su sé
                   stessa: torni al punto di partenza e la somma è <b>zero esatto</b>.</li>
               <li>per tutti gli altri passi la somma è un numero intermedio, né grande né nullo.</li>
             </ul>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'catena', title: 'Chiudi la catena, poi allineala', text: 'centra 3 obiettivi fra "somma zero" e "somma massima".', xp: 45 });
        el.appendChild(m.root);
        serieFrecce(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<div class="callout key">Guarda bene il caso «somma zero»: le frecce disegnano un <b>poligono chiuso</b>.
              Partire e tornare esattamente al punto di partenza è il motivo per cui la somma è zero <b>esatto</b> e non
              «poco»: non è un'approssimazione, è geometria.</div>`,
    },

    {
      t: 'Ecco da dove nasce il picco',
      html: `<p>Mettiamo insieme i pezzi. La trasformata di Fourier, per ogni frequenza di prova, fa <b>esattamente</b>
             quello che hai appena fatto con il cursore: gira ogni dato di un passo fisso e somma le frecce.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'La domanda', html: 'Chiedo al segnale: «contieni la frequenza k?». Per rispondere, giro il dato numero n di un passo proporzionale a <b>k·n</b> e sommo tutto.' },
          { h: 'Se la frequenza è sbagliata', html: 'Il passo di rotazione è un giro diviso N (o un suo multiplo): la catena si chiude, la somma è <b>zero esatto</b>. Il segnale risponde «no» in modo netto, senza mezze misure.' },
          { h: 'Se la frequenza è quella giusta', html: 'Le rotazioni del segnale e quelle della domanda si <b>annullano a vicenda</b>: il passo diventa zero, tutte le frecce puntano nello stesso verso e si sommano. <b>Nasce il picco.</b>' },
          { h: 'Il conto, per intero', html: 'La somma delle frecce vale <b>|sin(N·Δ/2) / sin(Δ/2)|</b>: è la formula (1 − rⁿ)/(1 − r) del primo gioco, scritta con le rotazioni. Vale N quando Δ = 0, zero quando Δ è un multiplo di un giro diviso N.' },
          { h: 'Perché ci interessa tanto', html: 'Perché è il meccanismo con cui il computer quantistico <b>legge</b> le cose: la QFT fa interferire le ampiezze in modo che tutte le risposte sbagliate si cancellino e resti solo quella giusta. Stessa formula, altro palcoscenico.' },
        ], { doneLabel: 'Chiaro!' });
      },
      after: `<div class="callout ok">Da qui in avanti, ogni volta che vedrai un picco comparire in un grafico di Fourier
              — nella DFT, nella QFT, nella stima di fase, in Shor — saprai che sotto c'è una catena di frecce che si è
              allineata, e tante altre catene che si sono chiuse.</div>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel primo gioco metti la frazione a <b>0,9</b>: dove finisce il muro? E a 0,99? Sai dire perché una
           frazione vicina a 1 rende il totale enorme?</p>
        <p><b>2.</b> Con 8 frecce, quanti passi diversi fra 1° e 359° danno somma zero? Provali:
           <span class="muted">(sono 7, e non è un caso)</span></p>
        <p><b>3.</b> Con 4 frecce e passo 90°, che figura disegna la catena? E con 8 frecce e passo 45°?</p>
        <p class="mb0"><b>4.</b> Da inventore: se le frecce fossero <b>tantissime</b> e il passo piccolissimo, la catena
           che figura disegnerebbe? <span class="muted">(indizio: un cerchio — ed è il motivo per cui l'integrale di
           Fourier assomiglia così tanto alla sua versione discreta)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Quanto fa 1 + ½ + ¼ + ⅛ + … (infiniti pezzi)?', options: ['infinito', '2', '1,5', 'dipende da quanti pezzi prendi'], correct: 1,
      why: 'Con r = ½ la somma infinita vale 1/(1 − ½) = 2. Il totale ci si avvicina sempre di più senza mai superarlo.' },
    { q: 'Otto frecce lunghe 1, ognuna girata di 45° più della precedente. Quanto è lunga la somma?', options: ['8', '4', '0', 'dipende dalla prima freccia'], correct: 2,
      why: '45° è un giro intero diviso 8: la catena si chiude su sé stessa e la somma è zero esatto. È la cancellazione che dà i picchi netti nella trasformata di Fourier.' },
    { q: 'Quando la somma delle frecce è massima?', options: ['quando il passo è 180°', 'quando il passo è zero o un giro intero', 'quando le frecce sono tante', 'quando il passo è casuale'], correct: 1,
      why: 'Con passo nullo tutte le frecce puntano nello stesso verso e si sommano: la lunghezza è pari al numero di frecce. È esattamente ciò che accade alla frequenza giusta.' },
    { q: 'Perché nella trasformata di Fourier le frequenze sbagliate danno zero e non un numero piccolo a caso?', options: ['per via degli arrotondamenti', 'perché la catena di frecce si chiude, e chiudersi è una proprietà esatta', 'perché il segnale è pulito', 'perché si scartano i valori bassi'], correct: 1,
      why: 'Zero non è un\'approssimazione: è geometria. Le frecce a passo costante formano un poligono chiuso, e partire e tornare allo stesso punto significa somma nulla.' },
    { q: 'La formula (1 − rⁿ)/(1 − r) serve…', options: ['solo per le frazioni', 'sia per i pezzi che si accorciano sia per le frecce che girano', 'solo per i numeri interi', 'solo nel quantistico'], correct: 1,
      why: 'È la stessa somma: cambia solo che cosa è r. Una frazione fa rimpicciolire i pezzi, una rotazione li fa girare — e nel secondo caso la formula diventa il nucleo che genera i picchi.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> Sommare tante cose che si moltiplicano sempre per lo stesso numero: se
          quel numero è una frazione, il totale sbatte contro un muro; se è una rotazione, o si accumula tutto o si
          annulla tutto. Adesso la trasformata di Fourier è pronta a essere capita, non solo guardata.</div>`,
});
@endsection
