@php($description = 'Serie di Taylor spiegate giocando: il polinomio che insegue la curva e si stacca allontanandosi, il raggio di convergenza toccato con mano, la formula di Eulero letta separando i termini pari dai dispari — e la scoperta che il √N di Grover è sin x ≈ x, cioè una serie troncata al primo termine.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { taylorLab, piccoliAngoliLab } from '/js/widgets/taylor.js';

const L = renderLesson({
  id: 'm10-taylor',
  lead: `Un computer non sa calcolare <b>sin x</b>. Sa fare somme e moltiplicazioni, e basta. Eppure quando batti
         «sin 1» ti risponde in un microsecondo. Come fa? Fa una somma: <b>x − x³/6 + x⁵/120 − …</b> Questa è una
         serie di Taylor, ed è il trucco per cui qualunque curva si può sostituire con un <b>polinomio</b>, purché
         non ci si allontani troppo. Alla fine del livello scoprirai che il √N di Grover — il vantaggio quantistico
         più famoso del corso — non è altro che questa serie <b>fermata al primo termine</b>.`,

  steps: [
    {
      t: 'Il polinomio che insegue la curva',
      html: `<p>L'idea è questa. Prendo una curva e un punto — diciamo x = 0 — e provo a costruire un polinomio che
             le somigli <b>lì</b>. Non ovunque: lì.</p>
             <ul>
               <li>Grado 0: un polinomio costante, che almeno passi per lo stesso punto.</li>
               <li>Grado 1: gli chiedo anche la <b>stessa pendenza</b> — cioè la stessa derivata del livello 21·b.
                   È la retta tangente.</li>
               <li>Grado 2: anche la stessa <b>curvatura</b>. Grado 3: anche come cambia la curvatura. E così via.</li>
             </ul>
             <div class="callout key">Ogni termine in più impone che coincida <b>una derivata in più</b>. Da questa
             richiesta esce da sola la formula dei coefficienti:
             <p class="mb0" style="margin-top:8px">il termine di grado k vale <b>f⁽ᵏ⁾(0) / k!</b></p></div>
             <p>Nel gioco: scegli una curva, alza il grado e guarda il polinomio giallo inseguire quella azzurra.
             Comincia dal seno.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'taylor', title: 'Due curve inseguite', text: 'porta l\'errore sotto 0,01 su tutto il tratto, per due curve diverse.', xp: 55 });
        el.appendChild(m.root);
        taylorLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Il comportamento è sempre lo stesso, e vale la pena dirlo a parole: <b>il polinomio parte incollato
              in zero e si stacca allontanandosi</b>. Ogni termine in più sposta il punto di distacco più in là, ma
              non lo elimina.</p>
              <div class="callout key"><b>La cosa da portarsi via.</b> «Una serie converge» non è la domanda utile.
              La domanda utile — come sempre da tre livelli a questa parte — è <b>quanto in fretta</b>. Per coprire
              il seno da −7 a 7 con un errore sotto 0,01 serve il grado <b>19</b>. Per coprirlo solo vicino a zero
              basta il grado 3.</div>
              <p class="mb0">Guarda anche il primo termine del seno: è <b>x</b>. Vuol dire che per angoli piccoli
              <b>sin x ≈ x</b>. Tienilo lì, fra due paragrafi diventa il cuore del livello.</p>`,
    },

    {
      t: 'Il muro: dove la serie smette di funzionare',
      html: `<p>Adesso scegli l'ultima curva, <b>1/(1−x)</b>, e porta il grado al massimo. Guarda i bordi.</p>
             <p>La sua serie è la più semplice di tutte: <b>1 + x + x² + x³ + …</b> — è la serie geometrica del
             livello 15·b. E dentro la striscia verde funziona benissimo. Fuori <b>esplode</b>: aggiungere termini
             non migliora niente, peggiora.</p>
             <div class="callout warn"><b>Non è un difetto del gioco.</b> Con x = 2 la serie diventa
             1 + 2 + 4 + 8 + 16 + … che cresce senza fermarsi mai, mentre 1/(1−2) vale semplicemente −1. Nessun
             numero di termini può portare una somma che esplode a fare −1.</div>
             <p>Quella striscia si chiama <b>raggio di convergenza</b>, e qui vale 1. Ogni serie ne ha uno: per il
             seno, il coseno e l'esponenziale è infinito — funzionano ovunque — per questa è 1.</p>
             <div class="callout key"><b>Perché proprio 1?</b> Perché in x = 1 la funzione <b>esplode davvero</b>:
             1/(1−1) è una divisione per zero. Una serie di potenze non può passare oltre un punto in cui la
             funzione impazzisce, nemmeno da lontano. La sua portata è la distanza dal guaio più vicino.</p></div>
             <p class="mb0">I test di questo livello lo verificano nel modo più diretto: fuori dal raggio si
             controlla che l'errore <b>cresca</b> aumentando il grado, e che a grado 40 sia sopra 100.</p>`,
    },

    {
      t: 'La formula di Eulero, letta sul foglio',
      html: `<p>Al livello M·8 hai dimostrato che e^(iθ) = cos θ + i·sin θ con un limite: la banca che paga
             interessi immaginari. Ecco la seconda dimostrazione, ed è quella che fece davvero Eulero nel 1748.
             Serve solo saper scrivere tre serie e guardarle.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Le tre serie', html: '<b>eˣ</b> = 1 + x + x²/2! + x³/3! + x⁴/4! + …<br><b>cos x</b> = 1 − x²/2! + x⁴/4! − …<br><b>sin x</b> = x − x³/3! + x⁵/5! − …' },
          { h: 'Guarda i gradi', html: 'Il coseno usa <b>solo le potenze pari</b>. Il seno <b>solo le dispari</b>. L\'esponenziale le usa <b>tutte</b>. Sembra una curiosità: è la chiave.' },
          { h: 'Metti ix al posto di x', html: 'Nella serie dell\'esponenziale scrivi ix. Il termine di grado k diventa (ix)^k/k! = i^k · x^k/k!. E i^k gira in tondo: <b>1, i, −1, −i, 1, i, …</b>' },
          { h: 'Separa', html: 'I termini di grado <b>pari</b> hanno i^k = ±1: sono <b>reali</b>. Quelli di grado <b>dispari</b> hanno i^k = ±i: sono <b>immaginari</b>. La serie si spacca in due metà che non si mescolano.' },
          { h: 'Leggi le due metà', html: 'La metà reale è 1 − x²/2! + x⁴/4! − … cioè <b>esattamente cos x</b>. La metà immaginaria è i·(x − x³/3! + x⁵/5! − …) cioè <b>i·sin x</b>.' },
          { h: 'La formula', html: '<b>e^(ix) = cos x + i·sin x</b>. Non c\'è nessun passaggio nascosto: sono le stesse cifre, riordinate. Ed è per questo che quella formula, quando la si vede la prima volta, sembra un miracolo e poi sembra ovvia.' },
          { h: 'Nel test', html: 'Il test di questo livello non si limita a controllare il totale: verifica che la <b>metà pari</b> della serie di e^(ix) coincida termine per termine con la serie del coseno, e la metà dispari con quella del seno.' },
        ], { doneLabel: 'Ora torna!' });
      },
      after: `<div class="callout ok"><b>Due dimostrazioni indipendenti della stessa formula.</b> Al livello M·8 per
              limite, qui per serie. Non è ridondanza: sono due modi di vedere la stessa cosa, e chi ne ha visti due
              non la dimentica più.</div>`,
    },

    {
      t: 'E adesso il colpo: il √N di Grover è una serie troncata',
      html: `<p>Qui arriva il pezzo che rende questo livello non facoltativo nello spirito, anche se lo è nei fatti.</p>
             <p>Al livello M·2 hai visto che ogni giro di Grover ruota la freccia di <b>2θ</b>, dove</p>
             <div class="formula">θ = arcsin(√(1/N))</div>
             <p>e che i giri utili sono quelli che portano la freccia vicino a 90°, cioè circa <b>(π/4)/θ</b>. Fin
             qui è esatto. Adesso guarda che cosa succede quando N è grande.</p>
             <div class="callout key">La serie di Taylor dell'arcoseno comincia con <b>arcsin(u) = u + u³/6 + …</b>
             Con u = 1/√N, il secondo termine è mille volte più piccolo del primo già per liste di poche centinaia
             di caselle. Quindi <b>θ ≈ 1/√N</b>, e i giri diventano <b>(π/4)·√N</b>.</div>
             <p>Ecco da dove viene il √N. Non è una legge della natura scritta a parte: è
             <b>un'approssimazione di Taylor fermata al primo termine</b>.</p>
             <p>Nel gioco: sposta la lunghezza della lista e guarda le due curve — sin x e la retta x — separarsi
             quando l'angolo cresce, e sovrapporsi quando è piccolo. E confronta i giri che davvero funzionano con
             quelli che dice la formula.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'piccoli', title: 'Dove l\'approssimazione tiene e dove no', text: 'trova una lista in cui lo scarto è sotto l\'1%, e una in cui supera il 4%.', xp: 60 });
        el.appendChild(m.root);
        piccoliAngoliLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Su una lista da un milione di caselle lo scarto fra l'angolo vero e la sua approssimazione è
              <b>meno di un decimillesimo</b>. Su una lista da quattro caselle è il <b>4,5%</b>, e su una da due il
              <b>10%</b>.</p>
              <div class="callout key"><b>E il numero di giri?</b> Regge quasi sempre, perché va arrotondato a un
              intero e l'arrotondamento perdona. I test lo controllano su <b>duemila</b> lunghezze di lista
              confrontando la formula (π/4)·√N con il numero di giri che davvero porta più in alto la probabilità:
              coincidono quasi sempre, sbagliano <b>una dozzina di volte</b>, e quando sbagliano è sempre di
              <b>un giro solo</b>.</div>
              <p class="mb0">Questo è il modo onesto di raccontare un'approssimazione: non «è uguale», ma «sbaglia
              di questo, e ti costa quello». La prima lista su cui la formula scivola è quella da <b>due
              caselle</b> — esattamente il caso in cui sin x ≈ x sbaglia del 10%.</p>`,
    },

    {
      t: 'Seicento anni, e un nome sbagliato',
      html: `<p>La storia di queste serie è un caso da manuale di come i nomi in matematica raccontino la geografia
             più della cronologia.</p>
             <p>Intorno al <b>1400</b>, in Kerala, nel sud dell'India, <b>Mādhava di Sangamagrāma</b> scrive le
             serie del <b>seno</b>, del <b>coseno</b> e dell'<b>arcotangente</b>. Con quest'ultima calcola π a
             <b>tredici cifre decimali</b>. Fonda una scuola — la scuola del Kerala — che continua a lavorarci per
             due secoli.</p>
             <div class="callout key">Sono le stesse serie che il gioco disegna. Newton le ritrova nel <b>1669</b>,
             James Gregory ritrova quella dell'arcotangente nel <b>1671</b>, Leibniz nel <b>1673</b> — e infatti
             quella serie oggi si chiama «serie di Gregory». Duecentocinquanta, trecento anni dopo.</div>
             <p><b>Brook Taylor</b>, inglese, enuncia il teorema generale nel <b>1712</b> e lo pubblica nel
             <b>1715</b> nel <i>Methodus incrementorum directa et inversa</i>. Il libro passa quasi inosservato:
             solo nel <b>1772</b> <b>Lagrange</b> lo definisce «il principio fondamentale del calcolo
             differenziale», e da lì il nome resta.</p>
             <p><b>Eulero</b>, nel <b>1748</b>, usa le serie con una disinvoltura che oggi farebbe rabbrividire —
             le somma, le riordina, le moltiplica come fossero polinomi finiti — e ci tira fuori
             e^(ix) = cos x + i·sin x. Aveva ragione, ma il permesso di fare quelle mosse arriverà solo un secolo
             dopo, con la pignoleria dell'Ottocento che hai incontrato al livello M·8.</p>
             <div class="callout warn"><b>Un ultimo avvertimento, e non è teorico.</b> Nell'Ottocento
             <b>Cauchy</b> trova una funzione a cui succede una cosa sgradevole: tutte le sue derivate in zero
             valgono zero, quindi la sua serie di Taylor è <b>tutta zeri</b> — eppure la funzione non è zero. La
             serie converge benissimo, e converge alla cosa sbagliata. È il motivo per cui «esiste la serie» e «la
             serie ricostruisce la funzione» sono due affermazioni diverse, e la seconda va dimostrata.</div>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel primo gioco, sul seno, sali di grado uno alla volta: 1, 3, 5, 7. Che cosa succede ai gradi
           pari? <span class="muted">(niente: il seno ha solo potenze dispari, e i termini pari valgono zero)</span></p>
        <p><b>2.</b> Sempre sul seno, con grado 3, fin dove la copia regge a occhio?
           <span class="muted">(circa fino a x = 1, cioè 57°: è il motivo per cui «angolo piccolo» in fisica vuol
           dire più o meno fino a lì)</span></p>
        <p><b>3.</b> Scegli 1/(1−x) e prova x = 2 mentalmente: quanto fa la funzione, e quanto fa la somma
           1+2+4+8+…? <span class="muted">(−1 contro infinito: ecco perché fuori dal raggio non c'è speranza)</span></p>
        <p><b>4.</b> Nel secondo gioco porta la lista a 2^20. Quanti giri servono, e quanto ci metterebbe una
           ricerca normale? <span class="muted">(804 giri contro mezzo milione di tentativi in media)</span></p>
        <p class="mb0"><b>5.</b> Da inventore: nel secondo gioco scendi a liste corte e guarda quando i «giri
           migliori» e la formula si separano. <span class="muted">(sulla lista da 2: la formula dice 1 giro, la
           cima vera è a 0 — l'unico caso in cui l'approssimazione costa davvero qualcosa)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cos\'è il polinomio di Taylor di una funzione in un punto?', options: ['una funzione che le somiglia dappertutto', 'il polinomio che in quel punto ha lo stesso valore, la stessa pendenza, la stessa curvatura, e così via', 'la sua derivata', 'la retta che la taglia in due punti'], correct: 1,
      why: 'Ogni termine in più impone che coincida una derivata in più, e da quella richiesta esce la formula dei coefficienti f⁽ᵏ⁾(0)/k!. Per questo la copia è perfetta nel punto e peggiora allontanandosi.' },
    { q: 'Perché la serie di 1/(1−x) non funziona per x = 2?', options: ['perché 2 è troppo grande', 'perché la somma 1+2+4+8+… esplode, mentre la funzione vale −1: fuori dal raggio di convergenza nessun numero di termini basta', 'perché mancano i termini dispari', 'perché il computer non ce la fa'], correct: 1,
      why: 'Il raggio di convergenza è 1, ed è la distanza dal punto in cui la funzione impazzisce davvero: x = 1, dove si divide per zero. Una serie di potenze non riesce a scavalcare quel guaio.' },
    { q: 'Come si legge la formula di Eulero dalle serie?', options: ['si sommano cos e sin', 'si mette ix nella serie di eˣ: i termini pari restano reali e fanno cos x, i dispari diventano immaginari e fanno i·sin x', 'si deriva due volte', 'si usa il teorema di Pitagora'], correct: 1,
      why: 'i^k gira in tondo — 1, i, −1, −i — quindi la serie si spacca in due metà che non si mescolano, e le due metà sono esattamente le serie di coseno e seno. È la dimostrazione di Eulero del 1748.' },
    { q: 'Da dove viene il √N nel numero di giri di Grover?', options: ['da una legge della fisica quantistica', 'da sin x ≈ x: l\'angolo arcsin(√(1/N)) vale circa 1/√N, e i giri sono circa (π/4)/θ', 'dal numero di qubit', 'dalla trasformata di Fourier'], correct: 1,
      why: 'È una serie di Taylor fermata al primo termine. Il vantaggio quantistico più famoso del corso nasce dall\'approssimazione più comune della fisica.' },
    { q: 'Quanto è affidabile la formula (π/4)·√N per il numero di giri?', options: ['sempre esatta', 'quasi sempre giusta: su duemila lunghezze di lista sbaglia una dozzina di volte, e sempre di un giro solo', 'sbagliata quasi sempre', 'giusta solo per liste piccole'], correct: 1,
      why: 'L\'arrotondamento a un intero perdona quasi tutto l\'errore dell\'approssimazione. La prima lista su cui scivola è quella da due caselle, dove sin x ≈ x sbaglia del 10%.' },
    { q: 'Chi ha scritto per primo le serie di seno e coseno?', options: ['Brook Taylor nel 1715', 'Mādhava di Sangamagrāma in Kerala, intorno al 1400 — due secoli e mezzo prima che Newton le ritrovasse', 'Eulero nel 1748', 'Newton nel 1669'], correct: 1,
      why: 'Con la serie dell\'arcotangente Mādhava calcolò π a tredici cifre decimali. Newton le ritrovò nel 1669 e Gregory nel 1671: quella serie oggi porta il nome di Gregory.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> Qualunque curva, vista da vicino, è un polinomio — e ogni termine in
          più allarga il «vicino». Da qui escono tre cose: il modo in cui un computer calcola davvero il seno, la
          seconda dimostrazione della formula di Eulero (la prima, per limite, era al livello M·8) e il √N di Grover,
          che è la serie dell'arcoseno fermata al primo termine. E un'avvertenza: ogni serie ha un raggio, e fuori di
          lì aggiungere termini peggiora.</div>`,
});
@endsection
