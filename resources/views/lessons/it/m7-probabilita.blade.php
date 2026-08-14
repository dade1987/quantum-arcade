@php($description = 'Probabilità spiegata giocando: media e varianza, l\'errore che scende come 1/√n (e perché un decimale in più costa cento volte le misure), il teorema di Bayes con il test quasi perfetto su una malattia rara, e il test di Bell — quello del Nobel per la fisica 2022 — con il muro del 75% contato a mano.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { mediaLab, bellLab } from '/js/widgets/probabilita.js';

const L = renderLesson({
  id: 'm7-probabilita',
  lead: `Al livello 0·4 la probabilità è arrivata come «lancia e conta». Qui diventa uno strumento, e serve a due
         cose che nel corso finora hai dovuto prendere per buone: <b>perché ogni decimale in più costa cento volte
         le misure</b> — la riga che rende cari gli algoritmi variazionali — e <b>perché il 75% della sfida delle
         buste è un muro e non una stima</b>. Quel muro si conta a mano: le strategie possibili sono sedici. E
         superarlo, in laboratorio, è valso il Nobel per la fisica del 2022.`,

  steps: [
    {
      t: 'Media, scarto, e la legge che li tiene insieme',
      html: `<p>Una <b>variabile aleatoria</b> è solo un numero che non sai in anticipo: il risultato di un lancio,
             la lettura di un qubit. Di lei si dicono due cose:</p>
             <ul>
               <li>la <b>media</b> (o valore atteso): dove sta il centro, cioè quanto viene in media se ripeti
                   tante volte;</li>
               <li>la <b>deviazione standard</b> σ: quanto i valori si sparpagliano attorno a quel centro. Si
                   calcola facendo la media degli <b>scarti al quadrato</b> — la varianza — e poi la radice, per
                   tornare nell'unità di misura di partenza.</li>
             </ul>
             <p>Per una moneta che vale 1 con probabilità p e 0 altrimenti, la deviazione standard è
             <b>√(p·(1−p))</b>, ed è massima a p = 0,5: la situazione più incerta possibile è quella in cui le due
             facce sono pari.</p>
             <div class="callout key">E adesso la formula che decide tutto. Se stimi la media facendo <b>n</b>
             misure, l'errore che ti aspetti sulla stima è:
             <p class="mb0" style="margin-top:8px"><b>errore ≈ σ / √n</b></p></div>
             <p>Nel gioco: tira, guarda la curva blu della media avvicinarsi alla riga verde, e tieni d'occhio la
             banda verde — è l'errore che ti aspetti. Poi prova a scendere sotto i due traguardi.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'media', title: 'Due traguardi di precisione', text: 'scendi sotto entrambe le soglie di errore.', xp: 45 });
        el.appendChild(m.root);
        mediaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Avrai notato la fatica. Passare da un errore di 0,05 a uno di 0,01 non costa cinque volte i tiri:
              ne costa <b>venticinque</b>. E per un decimale in più — da 0,01 a 0,001 — ce ne vogliono <b>cento
              volte</b> tanti.</p>
              <div class="callout warn"><b>La radice al denominatore è una brutta notizia, e non se ne va.</b> Non è
              un limite delle macchine di oggi né un difetto del simulatore: è statistica. Vale per i sondaggi, per
              gli esperimenti di fisica e per i computer quantistici di domani, che saranno perfetti e avranno
              esattamente questo problema.</div>
              <p class="mb0">Ecco perché al livello 21·b, mettendo 50 tiri invece di 5000, la discesa del VQE
              zigzaga: la pendenza misurata è una media, e una media con pochi tiri è rumore. Il conto che lì era una
              frase, adesso lo sai rifare.</p>`,
    },

    {
      t: 'Bayes: quando un test quasi perfetto non basta',
      html: `<p>Secondo attrezzo, e serve ogni volta che si legge un risultato rumoroso — cioè sempre, su una
             macchina quantistica reale. La domanda è: <b>ho un indizio, quanto devo cambiare idea?</b></p>
             <p>Il caso che rompe l'intuizione a tutti è questo. Una cosa riguarda <b>una persona su mille</b>. C'è
             un test che, quando la cosa c'è, la trova <b>sempre</b>; e quando non c'è, sbaglia solo il <b>5%</b>
             delle volte. Il test dice sì. Quanto è probabile che la cosa ci sia davvero?</p>
             <div class="callout warn">Rispondi <b>prima</b> di leggere oltre. Quasi tutti dicono «il 95%», e anche
             la maggior parte dei medici a cui è stata posta la domanda in studi controllati.</div>`,
      mount: el => {
        stepper(el, [
          { h: 'Non ragionare in percentuali: conta le persone', html: 'Prendi <b>100.000 persone</b>. La cosa riguarda una su mille, quindi ce l\'hanno in <b>100</b>.' },
          { h: 'I veri positivi', html: 'Il test le trova tutte: <b>100 positivi giusti</b>.' },
          { h: 'I falsi positivi', html: 'Restano 99.900 persone che non ce l\'hanno. Il test sbaglia sul 5% di loro: <b>4.995 positivi sbagliati</b>.' },
          { h: 'Il conto', html: 'I positivi totali sono 100 + 4.995 = <b>5.095</b>. Di questi, quelli veri sono 100. Quindi la probabilità che uno che è risultato positivo ce l\'abbia davvero è 100 / 5.095 ≈ <b>2%</b>.' },
          { h: 'Perché l\'intuizione sbaglia', html: 'Perché si guarda solo alla bravura del test e si dimentica <b>quanto la cosa è rara</b>. Se una cosa è rarissima, i pochi errori su un mucchio enorme di sani seppelliscono i veri positivi. Si chiama <b>errore di base</b>.' },
          { h: 'La formula', html: 'È il <b>teorema di Bayes</b>: probabilità vera = (quanti ce l\'hanno E risultano positivi) diviso (tutti i positivi). Niente di più.' },
          { h: 'A che serve qui', html: 'Su una macchina quantistica ogni lettura è rumorosa. Quando un rivelatore di errore dice «c\'è un errore», quanto devi crederci dipende da <b>quanto gli errori sono frequenti</b> — esattamente come sopra. La correzione d\'errore del livello 21 è, sotto sotto, un ragionamento bayesiano ripetuto milioni di volte al secondo.' },
        ], { doneLabel: 'Ora torna!' });
      },
      after: `<div class="callout ok"><b>Da portarsi via:</b> un indizio non ti dà la risposta, ti dice <b>di quanto
              spostare</b> quello che credevi. E lo spostamento dipende sempre da due cose: quanto è affidabile
              l'indizio, e quanto la cosa era plausibile <b>prima</b>.</div>`,
    },

    {
      t: 'Il gioco di Bell: dove il classico sbatte',
      html: `<p>Adesso l'esperimento più importante della fisica del Novecento, ridotto a un gioco che si può
             giocare a mano.</p>
             <p>Le regole. <b>Anna</b> e <b>Bruno</b> sono in due stanze separate e <b>non possono comunicare</b>.
             Un arbitro tira una monetina per ciascuno e consegna a ognuno una domanda, 0 oppure 1. Ognuno deve
             rispondere 0 o 1. Vincono se:</p>
             <div class="formula">le due risposte sono <b>uguali</b> — tranne quando <b>entrambe</b> le domande sono 1, e allora devono essere <b>diverse</b></div>
             <p>Possono accordarsi <b>prima</b> quanto vogliono. Le quattro domande escono con la stessa
             probabilità. Quante ne vincono?</p>
             <div class="callout key">Nel gioco, l'interruttore in cima cambia il mondo: a sinistra Anna e Bruno
             hanno solo un <b>accordo preso prima</b>; a destra condividono una <b>coppia entangled</b> e scelgono
             in che direzione misurarla. Stesse regole, stesso tabellone.</div>
             <p>Comincia dal classico: prova tutte le combinazioni che vuoi e guarda dove ti fermi.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'bell', title: 'Il muro, e poi oltre', text: 'tocca il massimo classico, poi superalo con l\'entanglement.', xp: 70 });
        el.appendChild(m.root);
        bellLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Classicamente ti fermi al <b>75%</b>. E qui viene la parte che rende questo esperimento diverso da
              tutti gli altri: quel 75% <b>non è una stima</b>, è un conto finito che puoi verificare tu.</p>
              <div class="callout key"><b>La dimostrazione, per intero.</b> Se Anna e Bruno non possono parlarsi, la
              risposta di Anna dipende solo dalla <b>sua</b> domanda: quindi la sua strategia è «cosa rispondo se mi
              chiedono 0» e «cosa rispondo se mi chiedono 1». Sono due scelte binarie: <b>quattro</b> strategie
              possibili. Lo stesso per Bruno. In tutto <b>4 × 4 = 16</b> strategie, e sono <b>tutte</b>.
              <p class="mb0" style="margin-top:8px">Provale: otto vincono 3 domande su 4, le altre otto ne vincono
              una su 4. Nessuna arriva a quattro su quattro. E nemmeno tirando a caso si migliora, perché una
              strategia casuale è una <b>media</b> di queste sedici, e la media di numeri tutti ≤ 75% non può
              superare il 75%.</p></div>
              <p>Adesso passa a destra. Con una coppia entangled e le direzioni giuste — Anna a 0° e 45°, Bruno a
              22,5° e −22,5° — si arriva a <b>85,4%</b>. Che è esattamente <b>cos²(22,5°)</b>: non un numero magico,
              il coseno al quadrato di un angolo, quello del livello M·2.</p>`,
    },

    {
      t: 'Che cosa dimostra davvero, e che cosa no',
      html: `<p>Questo passaggio va fatto con cura, perché è il punto in cui la divulgazione racconta di solito
             qualcosa di sbagliato.</p>
             <div class="callout key"><b>Che cosa dimostra.</b> Se le risposte fossero <b>già decise</b> prima della
             misura — cioè se ogni particella portasse con sé un foglietto con scritto il risultato di ogni misura
             possibile — allora Anna e Bruno starebbero usando una delle sedici strategie, e il tetto sarebbe il
             75%. Superarlo in laboratorio significa che <b>quei foglietti non ci sono</b>. Le risposte non erano
             decise prima.</div>
             <div class="callout warn"><b>Che cosa NON dimostra.</b> Non dimostra che i due qubit si mandino
             segnali, e non permette di mandarne. Guarda le risposte di Anna da sole: sono 0 e 1 a caso, metà e
             metà, <b>qualunque cosa faccia Bruno</b>. Anna non può accorgersi di niente. La stranezza sta solo
             nella <b>correlazione fra le due liste</b>, e per vederla bisogna metterle a confronto — cosa che
             richiede di parlarsi, alla velocità della luce come tutti. <b>L'entanglement non trasmette
             informazione.</b></div>
             <p>C'è anche un tetto dall'altra parte, e il gioco lo rispetta: nemmeno con la meccanica quantistica si
             arriva al 100%. Il massimo è proprio cos²(22,5°) ≈ 85,36%, e si chiama <b>limite di Tsirelson</b>. I
             test di questo livello lo verificano spazzando tutta la griglia degli angoli: se il gioco lasciasse
             vincere sempre, starebbe insegnando che l'entanglement permette di comunicare — che è falso.</p>
             <div class="callout ok"><b>Il riassunto in una riga:</b> il mondo non è classico, ma non è nemmeno
             magico. Sta esattamente fra il 75% e l'85,4%.</div>`,
    },

    {
      t: 'Da dove viene: un articolo scritto nel tempo libero',
      html: `<p>Nel <b>1935</b> Einstein, Podolsky e Rosen sollevano il problema (livello M·6): la meccanica
             quantistica, dicono, dev'essere incompleta, perché altrimenti la realtà non sarebbe «locale». Bohr
             risponde. E lì la faccenda si ferma per <b>trent'anni</b>, perché sembra una questione di filosofia:
             nessuno sa immaginare un esperimento che decida chi ha ragione.</p>
             <p>Poi arriva <b>John Stewart Bell</b>, nordirlandese. Di mestiere fa il fisico degli acceleratori al
             <b>CERN</b> — progetta magneti, si occupa di fasci di particelle. La questione dei fondamenti della
             quantistica la considera un interesse personale, e ci lavora fuori dall'orario, durante un anno
             sabbatico. Nel <b>1964</b> pubblica un articolo di sei pagine su una rivista appena nata e destinata a
             chiudere dopo pochi numeri.</p>
             <div class="callout key">In quelle sei pagine c'è la cosa che nessuno aveva visto: la disputa non è
             filosofica, è <b>numerica</b>. Se le risposte sono decise prima, allora una certa combinazione di
             correlazioni non può superare un certo numero. La meccanica quantistica dice che lo supera. <b>Basta
             misurarlo.</b></div>
             <p>Ci vollero anni perché qualcuno lo facesse davvero. <b>John Clauser</b> nel 1972 (con Stuart
             Freedman), <b>Alain Aspect</b> nel 1982 con esperimenti che cambiavano le direzioni <b>mentre</b> i
             fotoni erano già in volo, <b>Anton Zeilinger</b> negli anni Novanta e Duemila chiudendo le ultime
             scappatoie. Il risultato è sempre lo stesso: il limite classico viene <b>superato</b>. Nel <b>2022</b>
             i tre ricevono il <b>Nobel per la fisica</b>.</p>
             <p class="mb0">Bell non lo vide: morì nel 1990, a 62 anni. Aveva l'abitudine di dire che sperava di
             essere smentito — che il risultato «scomodo» gli sembrava troppo strano per essere l'ultima parola. Non
             lo è stato: ha vinto lui, contro le sue stesse speranze.</p>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel primo gioco metti la moneta a 0,5 (il caso più incerto) e poi a 0,9. Con lo stesso numero di
           tiri, quale dei due dà una stima più precisa? <span class="muted">(σ = √(p(1−p)) è più piccola quando p è
           vicino agli estremi)</span></p>
        <p><b>2.</b> Quanti tiri servono per un errore di 0,001 su una moneta equa? <span class="muted">(σ = 0,5,
           quindi (0,5/0,001)² = 250.000)</span></p>
        <p><b>3.</b> Rifai il conto di Bayes cambiando la diffusione: se la cosa riguarda una persona su dieci invece
           che una su mille, quanto vale la probabilità dopo un test positivo?
           <span class="muted">(circa il 69%: la stessa bravura del test, un mondo di differenza)</span></p>
        <p><b>4.</b> Nel gioco di Bell, in modo classico, trova <b>due</b> strategie diverse che arrivano entrambe al
           75%. Poi conta quante ce ne sono in tutto. <span class="muted">(otto su sedici)</span></p>
        <p class="mb0"><b>5.</b> Da inventore: in modo quantistico metti tutti e quattro gli angoli uguali. Che
           percentuale viene? <span class="muted">(75%: la coppia entangled da sola non basta, servono direzioni
           <b>diverse</b> — l'entanglement è la materia prima, la scelta delle misure è la ricetta)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Se fai n misure, come scende l\'errore sulla media?', options: ['come 1/n', 'come σ/√n', 'come σ·n', 'non scende'], correct: 1,
      why: 'Per dimezzare l\'errore servono quattro volte le misure; per un decimale in più, cento volte. È il motivo per cui gli algoritmi variazionali costano tanto — e vale anche per macchine perfette.' },
    { q: 'Un test trova sempre una cosa che riguarda una persona su mille, e dà falso positivo il 5% delle volte. Sei positivo: quanto è probabile che tu ce l\'abbia?', options: ['circa il 95%', 'circa il 2%', 'circa il 50%', 'circa il 5%'], correct: 1,
      why: 'Su 100.000 persone: 100 veri positivi contro 4.995 falsi. 100 su 5.095 fa circa il 2%. Quando una cosa è rara, i pochi errori su tantissimi sani seppelliscono i veri positivi.' },
    { q: 'Nel gioco di Bell, quante strategie classiche esistono in tutto?', options: ['infinite', 'sedici, perché ciascuno dei due deve decidere cosa rispondere a due domande', 'quattro', 'due'], correct: 1,
      why: 'La risposta di Anna dipende solo dalla sua domanda: quattro strategie possibili. Lo stesso per Bruno. Quattro per quattro fa sedici — e si possono provare tutte a mano.' },
    { q: 'Perché il 75% è un muro e non una stima?', options: ['perché è la media di molte prove', 'perché si può verificare su tutte e sedici le strategie possibili, e nessuna fa meglio', 'perché lo dice la meccanica quantistica', 'perché il gioco è truccato'], correct: 1,
      why: 'È un conto finito ed esauriente. E nemmeno mescolando le strategie a caso si migliora, perché una media di numeri tutti ≤ 75% non può superare il 75%.' },
    { q: 'Superare il 75% con una coppia entangled dimostra che...', options: ['i due qubit si mandano segnali', 'le risposte non erano già decise prima della misura', 'l\'informazione viaggia più veloce della luce', 'la meccanica quantistica è incompleta'], correct: 1,
      why: 'Se ogni particella portasse con sé il risultato di ogni misura possibile, si ricadrebbe in una delle sedici strategie e il tetto sarebbe il 75%. Superarlo esclude quella descrizione — ma non permette di trasmettere niente: le risposte di Anna, da sole, restano casuali.' },
    { q: 'Con l\'entanglement si può arrivare al 100%?', options: ['sì, con gli angoli giusti', 'no: il massimo è cos²(22,5°) ≈ 85,4%, il limite di Tsirelson', 'sì, ma solo con più di due qubit', 'dipende dal rumore'], correct: 1,
      why: 'C\'è un tetto anche dalla parte quantistica. Se non ci fosse, l\'entanglement permetterebbe di comunicare — cosa che non fa: le risposte di ciascuno, prese da sole, sono casuali qualunque cosa faccia l\'altro.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> L'errore su una media scende come 1/√n, e quel √ è il conto che rende
          cari tutti gli algoritmi quantistici di oggi. Bayes dice di quanto spostare quello che credevi, e ricorda
          che un test quasi perfetto su una cosa rarissima non basta. E il gioco di Bell mette un numero sotto la
          frase «il mondo non è classico»: sedici strategie, tetto al 75%, e una coppia entangled che arriva
          all'85,4%. Niente magia — ma nemmeno niente di classico.</div>`,
});
@endsection
