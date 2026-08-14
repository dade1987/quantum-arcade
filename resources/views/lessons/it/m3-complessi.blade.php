@php($description = 'Numeri complessi spiegati giocando: moltiplicare vuol dire allungare e girare, da lì la scrittura e^(iθ) senza magia, e le radici n-esime dell\'unità che sommate fanno zero — cioè l\'interferenza distruttiva su cui poggia la trasformata di Fourier.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { prodottoLab, radiciLab } from '/js/widgets/complessi.js';

const L = renderLesson({
  id: 'm3-complessi',
  lead: `Al livello 8 le frecce sono arrivate perché servivano: con i soli più e meno certi conti non tornavano.
         Da allora le hai usate parecchio. Qui si mettono in ordine, e si arriva alle due cose su cui poggia tutta
         la seconda metà del corso: <b>perché si scrive e^(iθ)</b> — che sembra una provocazione e invece è
         l'unica scrittura sensata — e le <b>radici dell'unità</b>, cioè le frecce con cui è fatta la trasformata
         di Fourier. Alla fine saprai anche perché il picco della DFT è un picco.`,

  steps: [
    {
      t: 'Il ripasso, e la domanda che nessuno fa',
      html: `<p>Un numero complesso è <b>una freccia sul piano</b>: due numeri, quello orizzontale e quello
             verticale, scritti a + bi. La <b>i</b> non è un numero misterioso: è l'etichetta che dice «questo
             secondo numero sta sull'altra direzione».</p>
             <p><b>Sommarli</b> è facile e lo fai da dieci livelli: punta contro coda, come le frecce delle onde.
             Ma c'è una domanda che di solito nessuno fa, ed è quella che apre tutto:</p>
             <div class="callout key"><b>Che cosa vuol dire, geometricamente, <i>moltiplicare</i> due frecce?</b>
             Sommare si vede. Moltiplicare, a guardare a + bi, sembra solo una parentesi da svolgere. E invece ha un
             significato preciso, e sorprendentemente semplice.</div>
             <p>Nel gioco muovi le due frecce e guarda la terza, il prodotto. Cerca la regola prima di leggerla
             sotto: <b>guarda le lunghezze, poi guarda gli angoli</b>.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'prodotto', title: 'Tre bersagli', text: 'porta il prodotto su 3 bersagli diversi.', xp: 45 });
        el.appendChild(m.root);
        prodottoLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Ecco la regola, e sono due righe:</p>
              <div class="formula">le <b>lunghezze</b> si moltiplicano &nbsp;·&nbsp; gli <b>angoli</b> si sommano</div>
              <p>Non è una coincidenza né una convenzione. Svolgi il prodotto di due frecce lunghe 1:</p>
              <div class="formula">(cos a + i·sin a) × (cos b + i·sin b)</div>
              <p>La parte senza i viene <b>cos a·cos b − sin a·sin b</b>; la parte con la i viene
              <b>sin a·cos b + cos a·sin b</b>. Sono, parola per parola, le <b>formule di addizione</b> del livello
              M·2 — cioè cos(a+b) e sin(a+b). Il prodotto <b>è</b> la freccia a a+b gradi. Non poteva essere
              altro.</p>
              <div class="callout ok"><b>E qui i numeri immaginari smettono di essere strani.</b> «i² = −1» sembra
              un'affermazione arbitraria da accettare. Ma i è la freccia lunga 1 a <b>90°</b>: moltiplicare per i
              vuol dire <b>girare di un quarto di giro</b>. Farlo due volte è girare di 180°, cioè finire su −1.
              Provalo nel gioco. i² = −1 non è un assioma: è mezzo giro.</div>`,
    },

    {
      t: 'Perché si scrive e^(iθ), e perché è la scrittura giusta',
      html: `<p>Adesso il passaggio che di solito viene calato dall'alto. Abbiamo scoperto che moltiplicare due
             frecce di lunghezza 1 <b>somma i loro angoli</b>. Fermiamoci un attimo su questa frase, perché è
             insolita.</p>
             <p>Quale operazione conosci che <b>trasforma somme in prodotti</b>? Ne esiste una sola, e la conosci dal
             livello 0·8:</p>
             <div class="formula">x<sup>a</sup> · x<sup>b</sup> = x<sup>a+b</sup></div>
             <p>Gli esponenti si sommano quando le potenze si moltiplicano. È <b>lo stesso identico
             comportamento</b> delle nostre frecce: angoli che si sommano quando le frecce si moltiplicano. Se una
             cosa si comporta come un esponenziale, l'unica scrittura onesta è quella esponenziale.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Il fatto di partenza', html: 'La freccia lunga 1 all\'angolo θ, moltiplicata per quella all\'angolo φ, dà la freccia all\'angolo <b>θ + φ</b>. Chiamiamola per un attimo F(θ).' },
          { h: 'La proprietà che ha', html: '<b>F(θ) · F(φ) = F(θ + φ)</b>. Cioè: il prodotto delle F è la F della somma.' },
          { h: 'Chi altro si comporta così', html: 'L\'esponenziale, e sostanzialmente solo lui: <b>e^a · e^b = e^(a+b)</b>. La struttura è la stessa, casella per casella.' },
          { h: 'Quindi F è un esponenziale', html: 'Deve valere <b>F(θ) = e^(kθ)</b> per qualche numero k. Resta da capire quale.' },
          { h: 'Quale k', html: 'La freccia gira, non cresce: la sua lunghezza resta 1 sempre. Un esponenziale con k reale invece esplode o si spegne. L\'unico modo di avere «cresce di zero e gira di uno» è prendere k <b>immaginario</b>: k = i.' },
          { h: 'La scrittura', html: '<b>e^(iθ) = cos θ + i·sin θ</b>. Questa è la formula di Eulero, e in questo corso la trovi già dal livello 14 come «la freccia girata di θ».' },
          { h: 'Onestà', html: 'Quello che hai appena visto è un <b>argomento di plausibilità</b>, non una dimostrazione: dice che e^(iθ) è la scrittura sensata, non che è obbligata. La dimostrazione vera si fa con le serie di Taylor, e sta in un livello più avanti della Parte M. Ma il motivo per cui quella scrittura esiste è tutto qui: <b>gli angoli si sommano</b>.' },
          { h: 'Il regalo di Eulero', html: 'Metti θ = 180°, cioè π: la freccia finisce su −1. Quindi <b>e^(iπ) = −1</b>, che di solito si scrive <b>e^(iπ) + 1 = 0</b>. Cinque costanti in cinque simboli. Ed è solo il modo elegante di dire «mezzo giro ti porta dall\'altra parte».' },
        ], { doneLabel: 'Adesso ha senso!' });
      },
      after: `<div class="callout key"><b>Cosa ti porti via, in pratica:</b> ogni volta che in questo corso vedi
              e^(iθ) — nella fase di una porta, nella QFT, nella stima di fase — puoi leggerlo semplicemente come
              <b>«la freccia lunga 1 girata di θ»</b>. E moltiplicare due di quelle scritture vuol dire sommare gli
              angoli, che è la ragione per cui i conti quantistici si semplificano così bene.</div>`,
    },

    {
      t: 'Le radici dell\'unità: n frecce che si annullano',
      html: `<p>Domanda: quali numeri, elevati alla <b>n</b>, danno 1? Coi numeri normali la risposta è deprimente:
             uno, o al massimo due (1 e −1). Con le frecce diventa bellissima.</p>
             <p>Elevare alla n vuol dire moltiplicare per sé stesso n volte, cioè — l'abbiamo appena scoperto —
             <b>sommare l'angolo n volte</b>. Perché il risultato sia 1, cioè la freccia a 0°, l'angolo moltiplicato
             per n deve fare <b>un numero intero di giri</b>. Quindi:</p>
             <div class="formula">gli angoli buoni sono 0°, 360/n, 2·360/n, 3·360/n, …</div>
             <p>Sono <b>n frecce equidistanti sul cerchio</b>: i vertici di un poligono regolare, con la prima
             sull'1. Si chiamano <b>radici n-esime dell'unità</b>.</p>
             <p>Nel gioco costruiscile e poi <b>sommale</b>, punta contro coda. Guarda dove finisce la catena.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'radici', title: 'Chiudi tre poligoni', text: 'somma tutte le frecce su 3 valori di n diversi.', xp: 55 });
        el.appendChild(m.root);
        radiciLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>La catena <b>torna esattamente al punto di partenza</b>: la somma di tutte le radici n-esime
              dell'unità è <b>zero</b>, per ogni n maggiore di 1. E il motivo è di una semplicità disarmante: sono
              disposte in modo perfettamente bilanciato in tutte le direzioni, quindi si annullano a vicenda —
              come tante persone che tirano una corda con la stessa forza da tutti i lati.</p>
              <div class="callout ok"><b>Questo zero è il motore della trasformata di Fourier.</b> La DFT del
              livello 16 pesa i campioni proprio con queste frecce. Quando la frequenza che stai cercando
              <b>non</b> c'è, i pesi girano in tondo e si sommano a zero: silenzio. Quando c'è, tutte le frecce
              puntano nella stessa direzione e si sommano fra loro: il <b>picco</b>. La catena che si chiude l'avevi
              già vista al livello 15·b; adesso sai anche <b>chi sono</b> quelle frecce e perché sono esattamente
              n.</div>
              <p class="mb0">E la QFT (livello 18) fa la stessa cosa con n = 2<sup>numero di qubit</sup> frecce
              tutte insieme, il che spiega perché si scrive con le potenze di 2 e perché le fasi sono e^(2πi·jk/N):
              sono le radici dell'unità elevate a jk.</p>`,
    },

    {
      t: 'Da dove vengono: trecento anni per fare un disegno',
      html: `<p>Al livello 0·7b hai visto come nascono: <b>Cardano</b> (1545) e <b>Bombelli</b> (1572), come
             scorciatoia obbligata per risolvere le equazioni di terzo grado. Nascono cioè come <b>un conto che
             funziona</b> e che nessuno sa spiegare.</p>
             <p>E resta così per <b>duecentocinquant'anni</b>. Li si usa perché tornano i conti, ma sono guardati
             con sospetto — al punto che è <b>Descartes</b>, nel 1637, a chiamarli <i>immaginari</i>, e non come
             complimento. Leibniz li definisce «un anfibio fra l'essere e il non essere». Eulero, che li usa più di
             chiunque altro e nel <b>1748</b> pubblica proprio la formula e^(ix) = cos x + i·sin x, non ha ancora
             un'immagine per dire <b>dove stanno</b>.</p>
             <div class="callout key">Il disegno che hai usato in questo livello — la freccia sul piano — arriva solo
             fra il <b>1799</b> e il <b>1806</b>, e ci arrivano tre persone separatamente: <b>Caspar Wessel</b>, un
             agrimensore norvegese che disegnava mappe (e la cui memoria resta ignorata per un secolo),
             <b>Jean-Robert Argand</b>, un libraio parigino, e <b>Carl Friedrich Gauss</b>, che nel <b>1831</b> gli
             dà l'autorevolezza che serviva.</div>
             <p>Gauss scrive una cosa che vale la pena riportare quasi alla lettera: che l'oscurità intorno a
             questi numeri va attribuita in gran parte a <b>una terminologia mal scelta</b>, e che se +1, −1 e √−1
             fossero stati chiamati unità <b>diretta, inversa e laterale</b> invece che positiva, negativa e
             immaginaria (o «impossibile»), <i>«di una simile oscurità non si sarebbe potuto parlare»</i>. Aveva
             ragione: il problema non erano i numeri, era il <b>nome</b>. Chiamare «immaginario» un quarto di giro
             ha rallentato la matematica di due secoli.</p>
             <div class="callout ok"><b>La morale, e riguarda anche te che stai imparando:</b> per trecento anni
             questi numeri sono stati «difficili» solo perché mancava il disegno giusto. Appena qualcuno li ha messi
             sul piano, sono diventati la cosa più naturale del mondo — un allungamento e una rotazione. Se un
             concetto ti sembra impossibile, molto spesso non è il concetto: è il disegno che non c'è ancora.</div>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel primo gioco metti tutte e due le frecce lunghe 1 e a 90°. Dove finisce il prodotto? E che
           numero è? <span class="muted">(i × i: due quarti di giro fanno mezzo giro, cioè −1)</span></p>
        <p><b>2.</b> Sempre nel primo gioco, tieni una freccia lunga 1 e cambia solo il suo angolo: la lunghezza del
           prodotto cambia? <span class="muted">(no: moltiplicare per una freccia lunga 1 gira soltanto — ed è
           esattamente quello che fa una fase quantistica, che infatti non cambia le probabilità)</span></p>
        <p><b>3.</b> Nel secondo gioco prendi n = 3 e somma solo <b>due</b> delle tre frecce. La somma è zero? E
           quanto vale? <span class="muted">(non è zero: lo zero arriva solo quando ci sono tutte — ed è per questo
           che nella DFT serve sommare su tutti i campioni)</span></p>
        <p><b>4.</b> Con n = 4 le quattro radici sono 1, i, −1, −i. Verifica a mano che i⁴ = 1.
           <span class="muted">(quattro quarti di giro)</span></p>
        <p class="mb0"><b>5.</b> Da inventore: moltiplica due radici n-esime dell'unità fra loro. Il risultato è
           ancora una radice n-esima? <span class="muted">(sì, sempre: gli angoli si sommano e restano multipli di
           360/n. Questo fatto ha un nome — «formano un gruppo» — e tornerà quando parleremo delle simmetrie delle
           porte quantistiche)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cosa vuol dire, geometricamente, moltiplicare due numeri complessi?', options: ['sommare le lunghezze e gli angoli', 'moltiplicare le lunghezze e sommare gli angoli', 'moltiplicare lunghezze e angoli', 'sommare le lunghezze e moltiplicare gli angoli'], correct: 1,
      why: 'Svolgendo (cos a + i sin a)(cos b + i sin b) compaiono esattamente le formule di addizione: il risultato è la freccia all\'angolo a+b. Le lunghezze, invece, si moltiplicano fra loro.' },
    { q: 'Perché i² = −1, guardando le frecce?', options: ['è un assioma da accettare', 'perché i è la freccia a 90°, e girare due volte di 90° porta a 180°, cioè su −1', 'perché i è negativo', 'perché la lunghezza raddoppia'], correct: 1,
      why: 'Moltiplicare per i è girare di un quarto di giro. Due quarti di giro fanno mezzo giro: si finisce sulla parte negativa dell\'asse orizzontale, cioè su −1. Non c\'è niente da accettare.' },
    { q: 'Perché la freccia girata di θ si scrive proprio come un esponenziale, e^(iθ)?', options: ['per abbreviare', 'perché moltiplicando le frecce gli angoli si SOMMANO, ed è il comportamento delle potenze: x^a · x^b = x^(a+b)', 'perché e vale circa 2,718', 'perché lo ha deciso Eulero'], correct: 1,
      why: 'L\'esponenziale è l\'operazione che trasforma somme di esponenti in prodotti. Le frecce di lunghezza 1 fanno la stessa cosa con gli angoli, quindi la scrittura esponenziale è quella che descrive il loro comportamento.' },
    { q: 'Che cosa sono le radici n-esime dell\'unità?', options: ['i divisori di n', 'n frecce di lunghezza 1 equidistanti sul cerchio: elevate alla n danno tutte 1', 'le soluzioni di x² = n', 'i numeri primi minori di n'], correct: 1,
      why: 'Elevare alla n somma l\'angolo n volte: perché il risultato sia 1 l\'angolo deve essere un multiplo di 360/n. Ne escono n, ai vertici di un poligono regolare con la prima sull\'1.' },
    { q: 'Quanto fa la somma di tutte le n radici n-esime dell\'unità (con n > 1)?', options: ['n', '1', '0', 'dipende da n'], correct: 2,
      why: 'Sono disposte in modo perfettamente bilanciato in tutte le direzioni, quindi si annullano a vicenda: la catena punta-coda torna al punto di partenza. È lo zero che nella DFT cancella tutte le frequenze sbagliate.' },
    { q: 'Che legame c\'è fra le radici dell\'unità e la trasformata di Fourier?', options: ['nessuno', 'la DFT pesa i campioni proprio con quelle frecce: quando la frequenza non c\'è si sommano a zero, quando c\'è si allineano e fanno il picco', 'servono solo per la FFT', 'servono a normalizzare i risultati'], correct: 1,
      why: 'I coefficienti e^(2πi·jk/N) della DFT sono le radici N-esime dell\'unità elevate a jk. Il silenzio sulle frequenze sbagliate è la loro somma nulla; il picco è il caso in cui puntano tutte nella stessa direzione.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> Moltiplicare è allungare e girare; da lì e^(iθ) diventa la scrittura
          ovvia invece di una magia, e i² = −1 diventa mezzo giro. Le radici n-esime dell'unità sono n frecce
          equidistanti che sommate fanno zero — ed è quello zero, non altro, il motivo per cui la trasformata di
          Fourier ha un picco e non un rumore. Da qui in poi ogni e^(iθ) del corso si legge a colpo d'occhio.</div>`,
});
@endsection
