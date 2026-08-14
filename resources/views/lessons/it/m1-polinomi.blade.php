@php($description = 'Polinomi e regola di Ruffini spiegati giocando: perché le radici intere si nascondono solo fra i divisori del termine noto, perché la staffetta di Ruffini è anche il modo più veloce di calcolare un polinomio (Horner), e perché dal quinto grado in poi una formula risolutiva non esiste — Ruffini, Abel, Galois.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { sospettatiLab, staffettaLab } from '/js/widgets/polinomi.js';

const L = renderLesson({
  id: 'm1-polinomi',
  lead: `Al livello 0·7b hai costruito la formula del secondo grado invece di impararla. Restava una domanda in
         sospeso, ed è la più bella della matematica: <b>e per il terzo grado? e per il quinto?</b> La risposta è
         sorprendente — per il terzo e il quarto una formula c'è, ed è una storia di duelli; dal <b>quinto in poi
         non esiste</b>, e non perché nessuno sia stato abbastanza bravo. Prima però servono gli attrezzi, e sono
         due: come si trovano le radici di un polinomio, e la regola che porta il nome di <b>Paolo Ruffini</b>.`,

  steps: [
    {
      t: 'Che cos\'è scomporre, e perché conviene',
      html: `<p>Un <b>polinomio</b> è una somma di potenze di x con dei numeri davanti: x³ − 7x + 6. Niente di più.
             Il <b>grado</b> è la potenza più alta che compare — qui 3.</p>
             <p><b>Scomporre</b> vuol dire riscriverlo come un <b>prodotto</b>: x³ − 7x + 6 = (x − 1)(x − 2)(x + 3).
             Le due scritture valgono lo stesso numero per ogni x, ma la seconda dice una cosa che la prima
             nasconde: <b>quando fa zero</b>.</p>
             <div class="callout key">Un prodotto fa zero se e solo se <b>uno dei fattori</b> fa zero. Quindi appena
             il polinomio è scritto come prodotto, le soluzioni si leggono a occhio: 1, 2, −3. Scomporre è
             <b>trasformare un problema difficile in una lettura</b>.</div>
             <p>Ma come si trovano quei fattori? A tentativi fra tutti i numeri interi ci si mette una vita. Per
             fortuna i candidati sono pochissimi, e c'è un motivo preciso.</p>`,
    },

    {
      t: 'I sospettati: perché la caccia è cortissima',
      html: `<p>Immagina un interrogatorio. Il polinomio è x³ − 7x + 6 e cerchiamo un numero intero che lo annulli.
             Sospettati potenziali: <b>infiniti</b>. Ma quasi tutti hanno un <b>alibi automatico</b>, e questo è il
             ragionamento che glielo dà.</p>
             <p>Supponiamo che un intero <b>r</b> annulli il polinomio: r³ − 7r + 6 = 0. Porto il 6 dall'altra parte
             (la bilancia del livello 0·7):</p>
             <div class="formula">r³ − 7r = −6 &nbsp;&nbsp;→&nbsp;&nbsp; r · (r² − 7) = −6</div>
             <p>A sinistra c'è <b>r moltiplicato per qualcosa di intero</b>. Perché il conto torni, <b>r deve
             dividere 6 esatto</b>. Fine dell'interrogatorio: i sospettati sono soltanto <b>±1, ±2, ±3, ±6</b>.
             Otto numeri invece di infiniti.</p>
             <div class="callout key">Questo si chiama <b>teorema delle radici razionali</b> e vale sempre: quando il
             coefficiente davanti alla potenza più alta è 1, <b>ogni radice intera divide il termine noto</b>.
             Il termine noto è la cassa comune: chi non ci entra esatto, non c'era.</div>
             <p>Nel gioco interroga i sospettati uno per uno. Chi è colpevole viene <b>sfilato</b> dal polinomio, che
             cala di grado; chi ha l'alibi ti mostra il resto che lo scagiona. Scomponine almeno due fino in fondo.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'sospettati', title: 'Interrogatorio completo', text: 'scomponi 2 polinomi fino a dove si può.', xp: 45 });
        el.appendChild(m.root);
        sospettatiLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Due cose che il gioco fa vedere e che vale la pena fissare:</p>
              <ul>
                <li>ogni radice sfilata <b>abbassa il grado di uno</b>: da cubico a quadratico a lineare. È il motivo
                    per cui, trovata una radice, il resto diventa facile;</li>
                <li>il terzo polinomio si <b>ferma</b>: dopo aver sfilato il 2 resta x² + 1, che non ha radici intere
                    — anzi, non ne ha proprio, perché il suo delta è −4. Non è un fallimento del metodo: è
                    esattamente il caso «impossibile» del livello 0·7b, quello da cui sono nati i numeri complessi.</li>
              </ul>
              <div class="callout warn"><b>Attenzione a una trappola comune:</b> «non ha radici intere» non vuol dire
              «non ha radici». x² − 2 non ha radici intere, ma ha ±√2. Il teorema dei sospettati trova le radici
              <b>razionali</b>: le altre esistono, e per stanarle servono altri attrezzi.</div>`,
    },

    {
      t: 'La staffetta di Ruffini (e il conto che ci guadagna)',
      html: `<p>Come si «sfila» una radice? Con una divisione: se r è radice, il polinomio è divisibile per (x − r).
             La divisione fra polinomi si può fare in colonna come quella fra numeri — lunga e piena di occasioni per
             sbagliare — oppure con la <b>regola di Ruffini</b>, che è la stessa cosa scritta in una riga sola.</p>
             <p>Il modo più chiaro di vederla è come una <b>staffetta</b>:</p>
             <ul>
               <li>i corridori sono i <b>coefficienti</b>, in fila dal grado più alto;</li>
               <li>il primo parte con il suo numero e basta;</li>
               <li>ogni corridore prende il testimone di quello prima, lo <b>moltiplica per r</b>, lo somma al proprio
                   coefficiente, e passa il risultato avanti;</li>
               <li>l'ultimo numero della staffetta è il <b>resto</b>.</li>
             </ul>
             <div class="callout key">Se il resto è <b>zero</b>, r era una radice e gli altri numeri della staffetta
             sono i coefficienti del polinomio rimasto. Se il resto <b>non</b> è zero, non hai perso il tempo: quel
             numero è <b>P(r)</b>, il valore del polinomio in r. Si chiama <b>teorema del resto</b>, ed è due
             risultati al prezzo di uno.</div>
             <p>Fai correre la staffetta almeno due volte, e guarda il contatore delle moltiplicazioni in fondo.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'staffetta', title: 'Porta il testimone in fondo', text: 'completa 2 staffette.', xp: 50 });
        el.appendChild(m.root);
        staffettaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Quel contatore è il motivo per cui questa regola vive anche fuori dalla scuola. Calcolare
              x³ − 7x + 6 «alla lettera» vuol dire fare x·x·x, poi x·x, poi le moltiplicazioni per i coefficienti:
              <b>nove</b> moltiplicazioni. La staffetta ne fa <b>tre</b>.</p>
              <div class="callout ok"><b>Curiosità che sposta la prospettiva:</b> questa non è una scorciatoia da
              compiti in classe. È lo <b>schema di Horner</b>, il modo più veloce che si conosca di calcolare un
              polinomio in un punto, e sta dentro le librerie matematiche, le schede grafiche e i calcolatori
              tascabili. Ruffini lo pubblica nel 1804 per dividere; Horner nel 1819 per calcolare; ed è la stessa
              riga di numeri. <span class="muted">(e i matematici cinesi lo usavano già nel XIII secolo — Qin
              Jiushao, 1247)</span></div>`,
    },

    {
      t: 'Perché la formula del secondo grado è fatta così — e perché si ferma',
      html: `<p>Adesso la domanda rimasta in sospeso. Al livello 0·7b la formula è uscita da un disegno: completare
             il quadrato. La domanda naturale è: <b>e per i gradi più alti?</b></p>`,
      mount: el => {
        stepper(el, [
          { h: 'Grado 2: si completa il quadrato', html: 'Il trucco è <b>trasformare l\'equazione in un quadrato perfetto</b>, che si sa aprire con una radice. Da lì la formula: x = [−b ± √(b² − 4ac)] / 2a. Al-Khwārizmī lo faceva con un disegno, nell\'820.' },
          { h: 'Grado 3: si scopre nel Cinquecento, litigando', html: '<b>Scipione del Ferro</b> (Bologna, ~1515) trova come risolvere le cubiche e non lo dice a nessuno: all\'epoca la cattedra si difendeva con le <b>sfide pubbliche</b> a colpi di problemi, e un metodo segreto era uno stipendio.' },
          { h: 'Il duello', html: '<b>Niccolò Tartaglia</b> ci arriva da solo nel 1535 e vince una sfida a Venezia. <b>Gerolamo Cardano</b> lo convince a rivelargli il metodo giurando di non pubblicarlo — e nel <b>1545</b> lo pubblica nell\'<i>Ars Magna</i>, citandolo, ma pubblicandolo. Ne segue una delle liti più velenose della storia della scienza.' },
          { h: 'Grado 4: subito dopo', html: '<b>Ludovico Ferrari</b>, allievo di Cardano, risolve il quarto grado con un\'idea simile: si riconduce a una cubica. La formula esiste, è enorme, e sta anch\'essa nell\'<i>Ars Magna</i>.' },
          { h: 'Grado 5: duecentocinquant\'anni di silenzio', html: 'A questo punto sembra questione di tempo. E invece nessuno ci riesce. Per <b>due secoli e mezzo</b> i migliori matematici d\'Europa provano e falliscono.' },
          { h: 'Ruffini, 1799: forse non si può', html: '<b>Paolo Ruffini</b>, medico e matematico a Modena, pubblica una dimostrazione che una formula generale per il quinto grado <b>non può esistere</b>. Quasi nessuno la legge: sono oltre 500 pagine, e c\'è un passaggio lasciato incompleto.' },
          { h: 'Abel, 1824: si dimostra', html: 'Il norvegese <b>Niels Henrik Abel</b>, a 21 anni, completa la dimostrazione. Se la stampa da solo, e per farla stare nei soldi che ha la comprime in <b>sei pagine</b>. Muore di tubercolosi a 26 anni, povero. Il risultato oggi si chiama <b>teorema di Abel–Ruffini</b>.' },
          { h: 'Galois, 1832: si capisce PERCHÉ', html: '<b>Évariste Galois</b>, francese, spiega non solo che la formula non c\'è ma <b>quali</b> equazioni si possono risolvere con le radici e quali no: dipende dalle <b>simmetrie</b> delle soluzioni fra loro. Scrive le sue idee la notte prima di un duello, e il giorno dopo muore. Aveva <b>20 anni</b>. Da lì nasce la <b>teoria dei gruppi</b>.' },
          { h: 'Che cosa vuol dire davvero', html: 'Non «non l\'abbiamo ancora trovata». Vuol dire che una formula fatta di +, −, ×, ÷ e radici <b>non esiste</b>, dimostrato. Le soluzioni ci sono — un polinomio di grado 5 ha 5 radici complesse — ma per averle bisogna <b>calcolarle</b>, non scriverle.' },
        ], { doneLabel: 'Che storia!' });
      },
      after: `<div class="callout key">Tieni da parte la parola <b>gruppi</b> e la parola <b>simmetrie</b>: sono
              nate qui, da un ragazzo di vent'anni che cercava di capire un'equazione, e in questo corso torneranno
              per descrivere le porte quantistiche. È uno dei casi più netti di matematica inventata per un motivo e
              utile per un altro, centocinquant'anni dopo.</div>`,
    },

    {
      t: 'A che serve tutto questo nel quantistico',
      html: `<p>Il collegamento è diretto e vale la pena vederlo per intero.</p>
             <p>Al livello 18·b si cercano le <b>direzioni ferme</b> di una matrice 2×2, e si trovano risolvendo
             λ² − (traccia)·λ + (determinante) = 0: un'equazione di secondo grado. Per una matrice <b>n×n</b> quel
             conto diventa un <b>polinomio di grado n</b>, il polinomio caratteristico, e i suoi zeri sono gli
             <b>autovalori</b>.</p>
             <div class="callout warn">Metti insieme le due cose e viene fuori un fatto scomodo: per una matrice
             <b>5×5 o più grande</b> il polinomio caratteristico ha grado ≥ 5, quindi per Abel–Ruffini <b>non
             esiste alcuna formula</b> che dia gli autovalori. Non per una matrice difficile: <b>in generale</b>.</div>
             <p>Ecco perché nessun programma «risolve» gli autovalori: li <b>insegue</b>, con metodi che si avvicinano
             passo dopo passo. E un sistema quantistico interessante ha matrici con milioni di righe.</p>
             <div class="callout ok"><b>E qui la stima di fase (livello 19) cambia registro.</b> Non risolve nessun
             polinomio: prepara l'autovettore, applica la porta raddoppiando, e <b>legge</b> l'autovalore dalla fase.
             Salta completamente il problema che Abel e Galois avevano chiuso. Detta così, «misurare un autovalore
             invece di calcolarlo» smette di essere un dettaglio tecnico e diventa il punto.</div>
             <p>Un secondo collegamento, più nascosto ma altrettanto forte, riguarda la <b>staffetta</b>. Calcolare
             un polinomio in un punto costa n moltiplicazioni con Horner. La <b>DFT</b> del livello 16 è esattamente
             questo, ripetuto: prendere un polinomio e calcolarlo in <b>n punti speciali</b> — le radici n-esime
             dell'unità, cioè le frecce del livello 8 disposte in cerchio.</p>
             <div class="formula">DFT = calcolare un polinomio nelle n radici dell'unità</div>
             <p class="mb0">n punti × n moltiplicazioni = n² operazioni, che è proprio il costo della DFT ingenua. E
             la <b>FFT</b> (livello 17) è il trucco di spezzare quel polinomio in due — termini pari e dispari — e
             riusare metà del lavoro. La stessa idea del «dividi a metà» del livello K·4, applicata alla staffetta.</p>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel primo gioco prendi <b>x³ − 4x² + x + 6</b>: quali sono i sospettati? Interrogali in ordine e
           conta quanti alibi trovi prima del primo colpevole. <span class="muted">(e nota: cambiando ordine cambia
           la fatica, non il risultato)</span></p>
        <p><b>2.</b> Nella staffetta scegli un r che <b>non</b> è radice e guarda l'ultimo numero. Poi calcola P(r) a
           mano, alla lettera. Vengono uguali? <span class="muted">(devono: è il teorema del resto)</span></p>
        <p><b>3.</b> Un polinomio di grado 7 costa quante moltiplicazioni con la staffetta? E alla lettera?
           <span class="muted">(7 contro 35: il divario cresce come il quadrato)</span></p>
        <p><b>4.</b> Perché il teorema dei sospettati non trova ±√2 come radice di x² − 2?
           <span class="muted">(rileggi il ragionamento: dove si è usato che r è intero?)</span></p>
        <p class="mb0"><b>5.</b> Da inventore: se per una matrice 5×5 non esiste una formula per gli autovalori, come
           fa un computer a disegnarti lo spettro di una molecola? <span class="muted">(indizio: la stessa risposta
           per cui esiste il livello 21·b — si scende, non si risolve)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Perché conviene scomporre un polinomio in un prodotto?', options: ['perché è più corto da scrivere', 'perché un prodotto fa zero solo se un fattore fa zero: le soluzioni si leggono a occhio', 'perché il grado diminuisce', 'perché elimina i numeri negativi'], correct: 1,
      why: 'Scritto come (x−1)(x−2)(x+3), il polinomio dichiara le sue radici: 1, 2, −3. La forma somma le nasconde, la forma prodotto le espone.' },
    { q: 'Se il termine noto è 6 e il coefficiente di grado massimo è 1, quali interi possono essere radici?', options: ['tutti i numeri interi', 'solo ±1, ±2, ±3, ±6', 'solo 1 e 6', 'solo i numeri pari'], correct: 1,
      why: 'Raccogliendo r da tutti i termini con la x, resta il termine noto da spartire: quindi r deve dividerlo esatto. Da infiniti candidati a otto.' },
    { q: 'Nella regola di Ruffini, che cos\'è l\'ultimo numero della riga?', options: ['il coefficiente di grado zero del quoziente', 'il resto della divisione, che è anche P(r)', 'la radice cercata', 'il grado del polinomio'], correct: 1,
      why: 'È il teorema del resto: dividere per (x − r) lascia come resto esattamente il valore del polinomio in r. Se viene zero, r è una radice; se non viene zero, hai comunque calcolato P(r).' },
    { q: 'Perché la staffetta di Ruffini/Horner è veloce?', options: ['perché salta dei termini', 'perché ogni coefficiente entra con una sola moltiplicazione, invece di ricalcolare tutte le potenze', 'perché usa numeri più piccoli', 'perché approssima il risultato'], correct: 1,
      why: 'Il risultato è esatto: cambia solo l\'ordine dei conti. Un polinomio di grado n costa n moltiplicazioni invece di circa n²/2 — ed è il motivo per cui lo usano le librerie matematiche.' },
    { q: 'Esiste una formula risolutiva per le equazioni di quinto grado?', options: ['sì, ma è troppo lunga da scrivere', 'no, ed è dimostrato che non può esistere (Abel–Ruffini)', 'non ancora, ma si cerca', 'sì, l\'ha trovata Galois'], correct: 1,
      why: 'Ruffini (1799) e Abel (1824) dimostrano che nessuna formula fatta di operazioni e radici può dare le soluzioni generali dal grado 5 in su. Galois (1832) spiega perché, e fondando la teoria dei gruppi. Le radici esistono: si calcolano, non si scrivono.' },
    { q: 'Che conseguenza ha tutto questo sugli autovalori di una matrice grande?', options: ['nessuna, gli autovalori sono sempre calcolabili con una formula', 'il polinomio caratteristico ha grado n: da n=5 in su non c\'è formula, quindi gli autovalori si inseguono numericamente — o si leggono con la stima di fase', 'significa che le matrici grandi non hanno autovalori', 'significa che servono matrici reali'], correct: 1,
      why: 'Il polinomio caratteristico di una matrice n×n ha grado n. Per n ≥ 5 Abel–Ruffini chiude la strada della formula. La stima di fase quantistica aggira il problema: non risolve il polinomio, misura la fase.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> I sospettati sono i divisori del termine noto, la staffetta di Ruffini
          divide e calcola insieme ed è il modo più veloce che si conosca, e dal quinto grado in poi la formula non
          esiste — dimostrato da un medico modenese, da un norvegese morto a 26 anni e da un francese morto a 20.
          Da quella storia sono usciti i gruppi, che ritroverai fra le porte quantistiche; e da quel «non esiste»
          si capisce perché la stima di fase, che l'autovalore lo <b>misura</b>, sia una notizia.</div>`,
});
@endsection
