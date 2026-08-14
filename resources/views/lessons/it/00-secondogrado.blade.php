@php($description = 'Equazioni di secondo grado spiegate giocando: il delta come «quante volte la parabola incontra la riga», la formula risolutiva costruita con il metodo di al-Khwārizmī invece che imparata a memoria, e il delta negativo che nel Cinquecento ha aperto la porta ai numeri immaginari.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { parabolaLab, quadratoLab } from '/js/widgets/secondogrado.js';

const L = renderLesson({
  id: '00-secondogrado',
  lead: `La formula risolutiva delle equazioni di secondo grado è probabilmente la cosa più imparata a memoria di
         tutta la scuola — e una delle meno capite. Qui non te la chiedo a memoria: te la faccio <b>costruire</b>,
         con un disegno che ha 1200 anni. Alla fine saprai anche perché in questo corso serve: il numero sotto la
         radice è la stessa cosa che, al livello <b>18·b</b>, decide se una porta quantistica ha direzioni ferme oppure
         soltanto fasi che girano.`,

  steps: [
    {
      t: 'Che cos\'è una «soluzione», visto da fuori',
      html: `<p>Un\'equazione di primo grado (livello 0·7) è una bilancia: 2x + 3 = 11, sposti, dividi, viene x = 4.
             Nel secondo grado compare la <b>x moltiplicata per sé stessa</b> — x², un\'area — e la bilancia da sola
             non basta più: non puoi «spostare dall\'altra parte» una x che è dentro un quadrato.</p>
             <p>Prima di risolvere, però, guardiamo <b>che cosa stiamo cercando</b>. Scrivi ax² + bx + c e disegna il
             risultato per ogni x: viene una curva a U, la <b>parabola</b>. Le soluzioni dell\'equazione
             ax² + bx + c = <b>0</b> sono i punti dove quella curva vale zero, cioè dove <b>incontra la riga</b>.</p>
             <div class="callout key">Detto così sparisce il mistero delle «equazioni impossibili»: una curva a U può
             incontrare una riga <b>due volte</b>, <b>una volta sola</b> (se la sfiora), oppure <b>mai</b>, se se ne
             sta tutta sopra o tutta sotto. Tre casi, non uno strano.</div>
             <p>Nel gioco muovi i tre numeri e cerca di ottenerli tutti e tre. Tieni d\'occhio il numero in basso a
             sinistra mentre lo fai.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'parabola', title: 'I tre casi, tutti e tre', text: 'ottieni due soluzioni, poi una sola, poi nessuna.', xp: 40 });
        el.appendChild(m.root);
        parabolaLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Il numero che cambiava colore in basso è <b>b² − 4ac</b>, e ha un nome famoso: il <b>delta</b>
              (o discriminante, perché «discrimina» fra i tre casi). Non è una formula da ricordare: è il conto che
              dice <b>quante volte</b> la curva incontra la riga.</p>
              <table class="table">
                <tr><th>Delta</th><th>La curva</th><th>Soluzioni</th></tr>
                <tr><td class="mono">&gt; 0</td><td>taglia la riga in due punti</td><td class="mono">2</td></tr>
                <tr><td class="mono">= 0</td><td>la tocca e risale</td><td class="mono">1</td></tr>
                <tr><td class="mono">&lt; 0</td><td>non la incontra mai</td><td class="mono">0</td></tr>
              </table>
              <p class="mb0">Resta la domanda vera: <b>da dove salta fuori</b> quel b² − 4ac? Non è caduto dal cielo.
              È un pezzo di un disegno, e adesso lo costruiamo.</p>`,
    },

    {
      t: 'I dieci nani e la mattonella che avanza',
      html: `<p>Prendiamo un\'equazione scritta come la scrivevano mille anni fa, senza segni meno:</p>
             <div class="formula">x² + 10x = 39</div>
             <p>e leggiamola come un <b>problema di pavimenti</b>. C\'è un cortile <b>quadrato</b> di lato x — quindi
             di area x² — e accanto ci sono <b>10 nani</b>, ognuno largo un passo e lungo quanto il cortile: dieci
             strisce di area x l\'una. Cortile più nani fanno 39 piastrelle in tutto. Quanto è largo il cortile?</p>
             <div class="callout key"><b>La mossa, e sono i nani a suggerirla:</b> in fila da una parte sola i dieci
             nani fanno un rettangolo lungo e storto. Ma se si <b>dividono in due file uguali da cinque</b> — cinque
             a destra del cortile e cinque sotto — il disegno diventa quasi un quadrato grande. Quasi: <b>manca
             l\'angolo</b>.</div>
             <p>E l\'angolo che manca è un quadratino 5 × 5, cioè <b>25 piastrelle</b>. Aggiungilo — ma allora,
             regola della bilancia del livello 0·7, va aggiunto <b>anche all\'altro piatto</b>: 39 + 25 = 64.</p>
             <p>Adesso a sinistra c\'è un quadrato perfetto di area 64, quindi il suo lato è 8. E quel lato è
             «x più cinque». Quindi x = 3. <b>Senza formula.</b></p>
             <p>Nel gioco fai i tre passi con i bottoni e guarda il disegno completarsi. Falli su almeno due
             equazioni: quello che devi vedere non sono i numeri, è che <b>è sempre lo stesso disegno</b>.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'quadrato', title: 'Completa il quadrato', text: 'porta a termine il disegno su 2 equazioni diverse.', xp: 55 });
        el.appendChild(m.root);
        quadratoLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Tieni a mente due cose sole, e sono entrambe nel disegno:</p>
              <ul>
                <li>i nani si <b>dividono in due file uguali</b> → da b viene fuori <b>b/2</b>;</li>
                <li>la <b>mattonella dell\'angolo</b> è quadrata → il pezzo da aggiungere è <b>(b/2)²</b>.</li>
              </ul>
              <div class="callout warn">Questo non è un trucco per ricordare la formula: è <b>la</b> dimostrazione
              della formula. Se togli i nani, il passaggio «si aggiunge (b/2)² a tutti e due i membri» resta una
              mossa arbitraria da mandare a memoria. Con i nani è l\'unica cosa sensata da fare.</div>`,
    },

    {
      t: 'Le stesse mosse, con le lettere: ecco la formula',
      html: `<p>Adesso rifacciamo <b>esattamente</b> quei passi su ax² + bx + c = 0, con le lettere al posto dei
             numeri. Non c\'è nessuna idea nuova da qui in avanti: solo gli stessi gesti, scritti in generale.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Primo: togliamo di mezzo la a', html: 'Il disegno vuole un cortile di lato x, non «a cortili». Quindi si divide tutto per a: <b>x² + (b/a)x + c/a = 0</b>. È lecito perché a non è zero — se lo fosse, non sarebbe di secondo grado.' },
          { h: 'Secondo: il termine noto dall\'altra parte', html: 'Come nella bilancia: <b>x² + (b/a)x = −c/a</b>. A sinistra sono rimasti il cortile e i nani, a destra le piastrelle contate.' },
          { h: 'Terzo: i nani in due file', html: 'Metà di b/a è <b>b/(2a)</b>. Due rettangoli uguali, uno per lato.' },
          { h: 'Quarto: la mattonella dell\'angolo', html: 'È quadrata, di lato b/(2a): vale <b>b²/(4a²)</b>. Si aggiunge a tutti e due i piatti: <b>(x + b/2a)² = b²/(4a²) − c/a</b>.' },
          { h: 'Quinto: si mettono insieme i pezzi a destra', html: 'Con lo stesso denominatore: b²/(4a²) − c/a = <b>(b² − 4ac) / (4a²)</b>. Ecco <b>da dove nasce il delta</b>: è l\'area della mattonella dell\'angolo meno quello che c\'era già. Se viene negativa, il quadrato non si può completare — e infatti la parabola non tocca la riga.' },
          { h: 'Sesto: si prende la radice', html: 'Il lato del quadrato: <b>x + b/(2a) = ±√(b² − 4ac) / (2a)</b>. Il <b>±</b> c\'è perché un quadrato di area nota si può fare con un lato o con il suo opposto: sono le due soluzioni.' },
          { h: 'Settimo: si sposta b/(2a)', html: 'Ultima mossa da bilancia, e la formula è finita:<br><b>x = [ −b ± √(b² − 4ac) ] / (2a)</b>.' },
          { h: 'Rileggi che cosa hai in mano', html: 'Non una filastrocca: <b>−b/2a</b> sono i nani divisi in due file (ed è anche il punto più basso della parabola, il vertice), la <b>radice</b> è il lato del quadrato completato, il <b>delta</b> è quanto ci voleva per completarlo.' },
        ], { doneLabel: 'Costruita!' });
      },
      after: `<p>Guarda la formula pezzo per pezzo: ogni sua parte ha un posto nel disegno.</p>`,
    },

    {
      t: 'La formula smontata',
      html: `<p>Tocca i pezzi qui sotto: sono gli stessi quattro elementi del cortile.</p>`,
      mount: el => {
        formula(el, {
          title: 'x = [ −b ± √(b² − 4ac) ] / 2a',
          parts: [
            { t: '−b / 2a', id: 'v', color: 'cyan', name: 'i nani in due file', say: 'È metà di b, col segno cambiato: il centro di tutto. Nel disegno è il lato che si aggiunge al cortile; sulla parabola è la x del vertice, il punto più basso.', ex: 'Le due soluzioni stanno sempre a uguale distanza da qui: una a sinistra e una a destra.' },
            { t: '±' },
            { t: '√(b² − 4ac) / 2a', id: 'r', color: 'green', name: 'quanto ci si sposta', say: 'È il lato del quadrato completato: dice di quanto ci si allontana dal centro per arrivare alle due soluzioni.', ex: 'Se vale zero, le due soluzioni coincidono: la parabola tocca la riga senza attraversarla.' },
            { t: '·' },
            { t: 'b² − 4ac', id: 'd', color: 'amber', name: 'il delta: la mattonella meno quel che c\'era', say: 'È quello che sta sotto la radice, e decide tutto: positivo → due soluzioni, zero → una, negativo → nessuna sulla retta dei numeri.', ex: 'Nel gioco è il numero che cambiava colore in basso a sinistra.' },
            { t: '·' },
            { t: '2a', id: 'a', color: 'violet', name: 'la divisione iniziale', say: 'Viene dal primissimo passo, quello in cui si è diviso tutto per a per avere un cortile solo.', ex: 'Quando a = 1 sparisce quasi del tutto: x = −b/2 ± √(b²/4 − c). È il caso del gioco.' },
          ],
        });
      },
      after: `<div class="callout ok">Prova a rifare il conto di prima con la formula: a = 1, b = 10, c = −39.
              Delta = 100 + 156 = 256, radice 16, x = (−10 ± 16)/2 → <b>3</b> e <b>−13</b>. Il disegno dava 3.
              La formula dà anche l\'altra soluzione, quella negativa: al-Khwārizmī l\'avrebbe scartata, perché
              un cortile di lato −13 non esiste. Non è una svista sua: i numeri negativi, in Europa, sarebbero
              stati accettati come soluzioni solo secoli dopo.</div>`,
    },

    {
      t: 'Da dove viene: al-jabr, e la porta lasciata aperta',
      html: `<p>Intorno all\'<b>820</b>, a Baghdad, <b>Muḥammad ibn Mūsā al-Khwārizmī</b> scrive un libro il cui titolo
             contiene la parola <i>al-jabr</i> — «ricomporre», rimettere insieme quello che è stato spezzato. Da
             <i>al-jabr</i> viene <b>algebra</b>; dal suo nome latinizzato, <i>Algoritmi</i>, viene <b>algoritmo</b>.
             Due parole che usi tutti i giorni, dallo stesso autore.</p>
             <p>Nel libro non c\'è nessuna formula: non esistevano ancora né i simboli né i numeri negativi. C\'è un
             <b>elenco di casi</b> scritti a parole — e uno di questi è, letteralmente, <i>«un quadrato e dieci radici
             uguali a trentanove»</i>: proprio l\'equazione del gioco. E la soluzione è <b>il disegno</b> che hai
             completato: il quadrato, le due strisce, l\'angolo che manca.</p>
             <div class="callout key">Vale la pena di dirlo chiaro: quello che a scuola sembra il punto d\'arrivo —
             la formula — è in realtà l\'<b>abbreviazione</b> di un ragionamento geometrico. Prima veniva il disegno,
             la formula è arrivata dopo, quando qualcuno ha inventato le lettere per riassumerlo.</div>
             <p>C\'è però un caso che il disegno non sa fare: quando <b>manca troppo</b> e il quadrato non si può
             completare. Delta negativo, radice di un numero negativo, «non esiste». Per settecento anni la risposta
             è stata: non esiste e basta.</p>
             <p>Poi, nel <b>Cinquecento</b> in Italia, succede una cosa strana — e non con le equazioni di secondo
             grado, ma con quelle di <b>terzo</b>. <b>Gerolamo Cardano</b> (1545) pubblica la formula per risolverle,
             e ci si accorge che in certi casi, per arrivare a soluzioni <b>perfettamente normali</b> — numeri interi,
             visibili a occhio — la formula obbliga a passare <b>attraverso</b> la radice di un numero negativo. Non
             per capriccio: non c\'è altra strada.</p>
             <p><b>Rafael Bombelli</b>, ingegnere idraulico bolognese, nel <b>1572</b> fa il passo che serviva: prende
             sul serio quei numeri, stabilisce come si sommano e si moltiplicano, e mostra che a fine conto le parti
             «impossibili» si cancellano e resta il numero giusto. Li chiama <i>«quantità silvestri»</i> — roba
             selvatica, espressione che riprende da Cardano — e inventa i nomi per lavorarci: <i>«più di meno»</i>
             e <i>«meno di meno»</i>, che sono i nostri +i e −i. Il nome «immaginari» arriverà dopo, da Descartes,
             ed era un insulto.</p>
             <div class="callout ok"><b>Il punto che riguarda questo corso:</b> i numeri complessi non sono nati come
             un\'astrazione elegante. Sono nati come una <b>scorciatoia obbligata</b>, tenendo il naso turato, per
             risolvere problemi concreti con risposte concrete. Trecento anni dopo si è scoperto che sono il
             linguaggio in cui è scritta la meccanica quantistica. Quel «non esiste» del delta negativo, insomma,
             non era un vicolo cieco: era una porta.</div>`,
    },

    {
      t: 'A che serve tutto questo nel quantistico',
      html: `<p>Sembra lontanissimo, e invece il secondo grado si ripresenta al livello <b>18·b</b> nel modo più diretto
             possibile. Lì cerchi le <b>direzioni ferme</b> di una macchina 2×2: le frecce che la matrice non gira,
             ma allunga o accorcia soltanto.</p>
             <p>Trovarle vuol dire risolvere questa equazione, che si chiama <b>polinomio caratteristico</b>:</p>
             <div class="formula">λ² − (traccia)·λ + (determinante) = 0</div>
             <p>dove la traccia è la somma dei due numeri sulla diagonale e il determinante è quello del livello 0·6.
             È un\'equazione di secondo grado in λ, e le sue soluzioni sono gli <b>autovalori</b>.</p>
             <div class="callout key">Quindi il delta di questa equazione dice, con esattezza:
             <ul style="margin:8px 0 0">
               <li><b>delta &gt; 0</b> → due direzioni ferme distinte. È la porta H, con autovalori +1 e −1;</li>
               <li><b>delta = 0</b> → una sola. È la macchina «taglio» del gioco, che infatti ne ha una;</li>
               <li><b>delta &lt; 0</b> → <b>nessuna</b> direzione ferma reale. È la <b>rotazione</b>: gira tutto,
                   nessuna freccia resta in linea. I suoi autovalori sono <b>fasi complesse</b>.</li>
             </ul></div>
             <p>Quel terzo caso è esattamente il punto in cui, al livello <b>18·b</b>, il corso dice «e qui servono i numeri
             complessi». Adesso sai che non è una scelta di comodo: è lo <b>stesso</b> delta negativo di
             al-Khwārizmī, la stessa porta lasciata aperta da Bombelli — e stavolta ci si passa attraverso per
             descrivere una porta quantistica che fa girare le fasi.</p>
             <p class="mb0">Un secondo uso, più nascosto: le <b>probabilità</b> in meccanica quantistica sono
             ampiezze al quadrato (livello 0·9). Ogni volta che imponi «le probabilità sommano a 1» stai scrivendo
             un\'equazione di secondo grado nelle ampiezze — ed è il motivo per cui gli stati di un qubit stanno su
             una <b>sfera</b> e non su una retta.</p>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel primo gioco tieni fermi b e c e muovi solo <b>a</b> fino a farlo diventare negativo: la U si
           capovolge. Il numero di soluzioni cambia? E il delta?
           <span class="muted">(guarda la formula del delta: la a compare in un prodotto)</span></p>
        <p><b>2.</b> Risolvi a mano <b>x² + 6x = 16</b> col metodo dei nani: sei nani, due file da quanti? La
           mattonella quanto vale? E il totale a destra? <span class="muted">(poi controlla col gioco)</span></p>
        <p><b>3.</b> Un\'equazione ha soluzioni 2 e 5. Quanto valgono b e c, se a = 1?
           <span class="muted">(indizio: (x − 2)(x − 5) svolto; e nota che b è −somma e c è ·prodotto: è il conto
           che ritroverai come traccia e determinante)</span></p>
        <p><b>4.</b> Perché la parabola è <b>simmetrica</b> rispetto al vertice? <span class="muted">(rileggi la
           formula: le due soluzioni sono «il centro ± la stessa quantità»)</span></p>
        <p class="mb0"><b>5.</b> Da inventore: la porta <b>H</b> ha matrice con traccia 0 e determinante −1. Scrivi il
           suo polinomio caratteristico e risolvilo. <span class="muted">(viene λ² − 1 = 0: e sono proprio i +1 e −1
           che troverai al livello <b>18·b</b>)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cosa sono le soluzioni di ax² + bx + c = 0, guardando la parabola?', options: ['il punto più basso della curva', 'i punti dove la curva incontra la riga dello zero', 'la larghezza della curva', 'i punti dove la curva è più ripida'], correct: 1,
      why: 'L\'equazione chiede «per quali x questa espressione vale zero»: sono esattamente i punti in cui la curva attraversa (o sfiora) l\'asse orizzontale. Da lì i tre casi possibili: due, uno, nessuno.' },
    { q: 'Il delta vale −7. Quante soluzioni reali ci sono?', options: ['due', 'una', 'nessuna', 'dipende dal segno di a'], correct: 2,
      why: 'Delta negativo vuol dire che il quadrato non si può completare: la parabola sta tutta da una parte e non incontra mai la riga. Le soluzioni esistono, ma sono numeri complessi.' },
    { q: 'Nella storia dei nani, perché si dividono in DUE file uguali?', options: ['per simmetria estetica', 'perché così le due strisce si appoggiano ai due lati del cortile e il disegno diventa quasi un quadrato', 'perché i nani sono sempre in numero pari', 'per rendere il conto più veloce'], correct: 1,
      why: 'È la mossa che genera il b/2 della formula: una striscia sola resterebbe un rettangolo storto, due strisce uguali su due lati fanno un quadrato a cui manca solo l\'angolo.' },
    { q: 'E la mattonella che avanza nell\'angolo, che cosa diventa nella formula?', options: ['il termine noto c', 'il (b/2)² che si aggiunge a tutti e due i membri — cioè il pezzo da cui nasce il delta', 'il denominatore 2a', 'il segno ±'], correct: 1,
      why: 'L\'angolo mancante è un quadratino di lato b/2, quindi di area (b/2)². Aggiungerlo a entrambi i membri è il passaggio che completa il quadrato, e il confronto con quello che c\'era già dà b² − 4ac.' },
    { q: 'Da dove nascono storicamente i numeri immaginari?', options: ['dalle equazioni di secondo grado con delta negativo', 'dalle equazioni di TERZO grado, dove per arrivare a soluzioni reali bisogna passare per la radice di un numero negativo', 'dalla meccanica quantistica', 'dalla geometria di al-Khwārizmī'], correct: 1,
      why: 'Col secondo grado si poteva dire «non esiste» e chiudere lì. Con il terzo grado (Cardano 1545, Bombelli 1572) il passaggio per i numeri immaginari era obbligato anche quando la risposta finale era un intero: da lì non si è più tornati indietro.' },
    { q: 'Perché il secondo grado serve nel calcolo quantistico?', options: ['non serve, è solo cultura generale', 'perché gli autovalori di una matrice 2×2 sono le soluzioni di un\'equazione di secondo grado, e il suo delta dice se ci sono direzioni ferme o solo fasi', 'perché le porte quantistiche sono parabole', 'perché serve a normalizzare i qubit'], correct: 1,
      why: 'Il polinomio caratteristico λ² − traccia·λ + determinante = 0 è di secondo grado. Delta positivo → due direzioni ferme (come la porta H); delta negativo → nessuna direzione ferma reale, autovalori complessi: è il caso della rotazione.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> Il delta è «quante volte la curva incontra la riga», la formula è
          un cortile quadrato con dieci nani schierati in due file e una mattonella nell\'angolo, e il caso
          «impossibile» è la porta da cui sono entrati i numeri complessi. Tre cose che a scuola arrivano separate,
          e che qui sono lo stesso disegno guardato da tre lati.</div>`,
});
@endsection
