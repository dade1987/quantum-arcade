@php($description = 'Goniometria spiegata giocando: l\'identità fondamentale come Pitagora sul cerchio, le formule di addizione ricavate dal prodotto di due matrici, la duplicazione come caso particolare — e la scoperta che ogni giro di Grover aggiunge 2θ. Con la storia della parola «seno», nata da un errore di traduzione.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { giostraLab, groverAngoloLab } from '/js/widgets/goniometria.js';

const L = renderLesson({
  id: 'm2-goniometria',
  lead: `Al livello 0·3 seno e coseno sono diventati due ombre di un punto che gira: niente triangoli, niente
         formule da mandare a memoria. Qui si aggiunge l'unica cosa che serve davvero saperci fare, ed è
         <b>girare due volte</b>. Sembra poco; invece da lì escono le formule di addizione, la duplicazione, e
         — con una sorpresa — il motivo per cui l'algoritmo di Grover a un certo punto <b>smette di
         migliorare</b>.`,

  steps: [
    {
      t: 'Un ripasso di trenta secondi, e una formula che già conosci',
      html: `<p>Un punto gira su un cerchio di raggio 1. Il <b>coseno</b> dell'angolo è la sua ombra orizzontale, il
             <b>seno</b> è quella verticale. Tutto qui: sono due numeri fra −1 e 1 che dicono <b>dove sta</b> il
             punto.</p>
             <p>Adesso guarda le due ombre e il raggio: formano un <b>triangolo rettangolo</b> con i cateti lunghi
             cos e sin, e l'ipotenusa lunga 1. Pitagora dice:</p>
             <div class="formula">sin²θ + cos²θ = <span class="hl-n">1</span></div>
             <div class="callout key">Questa si chiama <b>identità fondamentale</b> e ha fama di essere una formula
             da studiare. Non lo è: è <b>Pitagora scritto sul cerchio di raggio 1</b>, e vale per ogni angolo perché
             il raggio non cambia mai.</div>
             <p>E se ti sembra di averla già vista in questo corso, hai ragione: è la stessa riga che al livello 0·9
             diceva <b>«le probabilità fanno 100%»</b>. Le due ampiezze di un qubit sono le due ombre, e la somma
             dei loro quadrati è il raggio al quadrato. Un qubit, visto così, è <b>un punto su un cerchio</b>.</p>`,
    },

    {
      t: 'Due giri fanno un giro solo',
      html: `<p>Domanda che sembra banale: se giro di <b>a</b> e poi di <b>b</b>, dove finisco? A <b>a + b</b>,
             ovviamente. Gli angoli si sommano, lo sa chiunque abbia girato una manopola.</p>
             <p>La domanda vera è un'altra: <b>le ombre, dove finiscono?</b> Cioè, conoscendo cos a, sin a, cos b e
             sin b, quanto valgono cos(a+b) e sin(a+b)? Le ombre <b>non</b> si sommano — e chi scrive
             «cos(a+b) = cos a + cos b» sbaglia in modo spettacolare (prova con a = b = 90°: a sinistra viene −1,
             a destra 0).</p>
             <p>Nel gioco: sposta i due giri e porta la freccia sul bersaglio. Guarda la colonna dei numeri mentre
             lo fai.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'giostra', title: 'Tre bersagli', text: 'centra 3 bersagli sommando i due giri.', xp: 45 });
        el.appendChild(m.root);
        giostraLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>La risposta giusta è questa, e la si chiama <b>formula di addizione</b>:</p>
              <div class="formula">cos(a + b) = cos a · cos b − sin a · sin b</div>
              <div class="formula">sin(a + b) = sin a · cos b + cos a · sin b</div>
              <p>Il gioco l'ha appena verificata sotto i tuoi occhi: la riga «con la formula» e la riga «girando
              davvero» danno lo stesso numero, sempre. Ma <b>verificare non è capire</b>, e questa formula ha una
              provenienza che la rende ovvia.</p>`,
    },

    {
      t: 'Da dove esce: è il prodotto di due matrici, letto ad alta voce',
      html: `<p>Al livello 0·6 hai scoperto che <b>una rotazione è una matrice</b>. E fare due cose una dopo l'altra,
             con le matrici, vuol dire <b>moltiplicarle</b>. Mettiamo insieme le due frasi.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'La matrice che gira di a', html: 'Le due colonne dicono dove finiscono le due frecce di partenza:<br><b>R(a) = [ cos a &nbsp; −sin a ; &nbsp; sin a &nbsp; cos a ]</b>' },
          { h: 'Girare di a e poi di b', html: 'Applicare prima R(a) e poi R(b) è la matrice <b>R(b) · R(a)</b>. Ma girare di a e poi di b è anche, semplicemente, <b>girare di a+b</b>. Quindi <b>R(b) · R(a) = R(a+b)</b>. Due nomi per la stessa macchina.' },
          { h: 'Adesso si svolge il prodotto', html: 'Riga per colonna, come al livello 0·6. La casella in alto a sinistra viene <b>cos b · cos a − sin b · sin a</b>. Quella in basso a sinistra viene <b>sin b · cos a + cos b · sin a</b>.' },
          { h: 'E si legge l\'altra faccia', html: 'Ma quella stessa matrice è R(a+b), e la sua casella in alto a sinistra è per definizione <b>cos(a+b)</b>, quella in basso a sinistra <b>sin(a+b)</b>.' },
          { h: 'Le due letture devono coincidere', html: 'Stessa matrice, stesse caselle. Quindi<br><b>cos(a+b) = cos a cos b − sin a sin b</b><br><b>sin(a+b) = sin a cos b + cos a sin b</b>.<br>Fine: la formula non è caduta dal cielo, è il prodotto di due matrici scritto in italiano.' },
          { h: 'Perché quel segno meno', html: 'È la domanda che tutti si fanno. Viene dal <b>−sin a</b> nella matrice di rotazione, che a sua volta c\'è perché girando in senso antiorario la prima freccia va in su ma la seconda va <b>indietro</b>. Il meno è il prezzo del girare, non un capriccio.' },
        ], { doneLabel: 'Ricavata!' });
      },
      after: `<div class="callout ok"><b>Questo è il modo di ricordarle che non si dimentica:</b> non «coseno coseno
              meno seno seno», ma «<b>due rotazioni di fila sono una rotazione sola</b>». La formula è la
              conseguenza. E se un giorno ti serve e non te la ricordi, moltiplichi due matrici 2×2 e ce l'hai di
              nuovo in un minuto.</div>
              <p>Il caso <b>b = a</b> non è una formula in più, è la stessa con lo stesso numero due volte:</p>
              <div class="formula">sin 2a = 2 · sin a · cos a &nbsp;&nbsp;&nbsp; cos 2a = cos²a − sin²a</div>
              <p class="mb0">Si chiama <b>duplicazione</b>, e fra due passi si scoprirà che è il motore di un
              algoritmo quantistico.</p>`,
    },

    {
      t: 'Da dove viene: una tabella di corde, e un errore di traduzione',
      html: `<p>La goniometria non nasce a scuola: nasce guardando il cielo. Gli astronomi greci avevano bisogno di
             legare gli <b>angoli</b> fra le stelle alle <b>distanze</b> sulla sfera celeste, e per farlo
             costruirono delle tabelle. <b>Ipparco di Nicea</b>, intorno al <b>150 a.C.</b>, compila la prima:
             non di seni, ma di <b>corde</b> — la lunghezza del segmento che unisce i due estremi di un arco.</p>
             <p>Tre secoli dopo <b>Tolomeo</b>, nell'<i>Almagesto</i>, ne pubblica una molto più precisa e, per
             costruirla, dimostra un teorema di geometria che — riscritto in linguaggio moderno — <b>è la formula
             di addizione</b>. Cioè: la formula che hai appena ricavato dalle matrici, Tolomeo la ricavava da un
             quadrilatero inscritto in un cerchio, nel 150 dopo Cristo.</p>
             <div class="callout key"><b>La curiosità che vale il livello: perché si chiama «seno».</b> Gli
             astronomi indiani (Aryabhata, intorno al 500) smettono di tabulare la corda intera e passano alla
             <b>mezza corda</b>, che è quello che oggi chiamiamo seno. In sanscrito la chiamano <i>jyā</i>, che
             vuol dire «corda dell'arco» — la corda di un arco da tiro. Gli arabi la traslitterano in
             <i>jiba</i>, che in arabo non significa niente: è solo un suono, scritto <b>senza vocali</b>, jb.
             <p style="margin:8px 0 0">Nel XII secolo i traduttori europei — <b>Gerardo da Cremona</b> e altri —
             leggono quelle stesse due consonanti come <i>jaib</i>, che in arabo <b>esiste</b> e significa
             «insenatura, piega della veste, seno». E lo traducono in latino con <b>sinus</b>. Da lì: <i>sine</i>,
             <i>seno</i>, <i>Sinus</i>.</p>
             <p class="mb0" style="margin-top:8px">Morale: la parola più usata della trigonometria significa
             «insenatura» per colpa di un testo senza vocali letto male ottocento anni fa. Il concetto era la corda
             di un arco.</p></div>
             <p>Un'ultima curiosità, e stavolta è pratica. Prima dei logaritmi (livello 0·8), gli astronomi usavano
             le formule di addizione per <b>trasformare le moltiplicazioni in somme</b>, girandole così:</p>
             <div class="formula">cos a · cos b = ½ · [ cos(a − b) + cos(a + b) ]</div>
             <p>A sinistra una moltiplicazione fra numeri lunghi; a destra due letture su una tabella e una somma.
             Il metodo si chiamava <b>prostaferesi</b> e lo usavano nell'osservatorio di <b>Tycho Brahe</b>.
             Funzionava così bene che quando Napier pubblicò i logaritmi, nel 1614, li presentò come il modo
             <b>migliore</b> di fare la stessa cosa. Due invenzioni diverse per lo stesso fastidio.</p>`,
    },

    {
      t: 'La sorpresa: Grover è una rotazione, e 2θ è la duplicazione',
      html: `<p>Al livello 11 l'algoritmo di Grover fa una cosa che sembra magia: ripete un giro di «marca e
             rifletti» e la risposta giusta diventa via via più probabile. Poi, a un certo punto, se continui
             <b>peggiora</b>. Con la goniometria in mano quel comportamento smette di essere strano e diventa
             ovvio.</p>
             <p>Ecco il quadro. Metti tutte le risposte sbagliate su un asse e quella giusta sull'altro. Lo stato
             di partenza — la sovrapposizione uniforme — è una freccia <b>quasi tutta dalla parte delle
             sbagliate</b>, inclinata di un angolino θ dato da:</p>
             <div class="formula">sin θ = √(1 / N)</div>
             <p>Su 4 risposte θ vale 30°; su 256 vale circa 3,6°. Poi succede questo:</p>
             <div class="callout key"><b>Ogni giro di Grover ruota la freccia di 2θ.</b> Non l'avvicina «un po'
             di più»: la <b>ruota</b>, sempre dello stesso angolo. Dopo k giri la freccia sta a
             <b>(2k + 1)·θ</b>, e la probabilità di leggere la risposta giusta è il <b>seno al quadrato</b> di
             quell'angolo.</div>
             <p>Provalo: aumenta i giri e guarda la freccia salire verso i 90°. Poi supera i 90° e guarda cosa
             succede alla barra.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'grover', title: 'Centra due elenchi', text: 'trova il numero di giri migliore su 2 elenchi di dimensione diversa.', xp: 55 });
        el.appendChild(m.root);
        groverAngoloLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Tre cose cadono in posto tutte insieme:</p>
              <ul>
                <li><b>perché peggiora.</b> A 90° la freccia punta tutta sulla risposta giusta e la probabilità è 1.
                    Un giro in più la porta a 90° + 2θ, cioè <b>oltre</b>: e il seno, superati i 90°, ricomincia a
                    scendere. Grover non è un algoritmo che «migliora finché lo lasci andare»: è una lancetta che
                    gira, e va fermata al momento giusto;</li>
                <li><b>da dove esce il √N.</b> Devi coprire circa 90° a passi di 2θ, e θ ≈ √(1/N) per N grande.
                    Quindi il numero di passi è circa 90° / (2·√(1/N)) — che è <b>π/4 · √N</b>. Il famoso √N di
                    Grover non è una stima: è una divisione fra angoli;</li>
                <li><b>perché proprio 2θ.</b> Un giro di Grover fa <b>due specchiate</b> (marca, poi rifletti). E
                    due specchiate di fila sono sempre una <b>rotazione del doppio</b> dell'angolo fra i due
                    specchi. È la duplicazione di due passi fa, applicata a due specchi invece che a un angolo.</li>
              </ul>
              <div class="callout ok">Quindi la risposta alla domanda «perché √N e non N?» è: <b>perché è una
              rotazione, e le rotazioni si sommano negli angoli, non nelle probabilità</b>. Se ogni giro aggiungesse
              probabilità invece che angolo, Grover non servirebbe a niente.</div>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel primo gioco metti a = 90° e b = 90°. Quanto viene cos(a+b)? E quanto farebbe
           «cos a + cos b»? <span class="muted">(0 + 0 = 0, ma la risposta giusta è −1: ecco perché le ombre non si
           sommano)</span></p>
        <p><b>2.</b> Ricava sin 2a mettendo b = a nella formula di addizione, a mano, su un foglio. Ti vengono due
           termini uguali? <span class="muted">(sin a cos a + cos a sin a)</span></p>
        <p><b>3.</b> Nel secondo gioco prendi N = 4: quanti giri servono? E la probabilità dopo quel giro?
           <span class="muted">(uno solo, e viene esattamente 100% — è il caso che il livello 11 mostra a mano)</span></p>
        <p><b>4.</b> Sempre nel secondo gioco, passa da N = 16 a N = 256: le risposte sono 16 volte tante. I giri
           quante volte tanti? <span class="muted">(quattro: è √16)</span></p>
        <p class="mb0"><b>5.</b> Da inventore: se ci fossero <b>4 risposte giuste</b> su 256 invece di una, θ
           varrebbe di più o di meno? E i giri necessari? <span class="muted">(sin θ = √(M/N): con M = 4 l'angolo
           raddoppia e i giri si dimezzano — cercare più cose insieme è più facile, non più difficile)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cos\'è, in fondo, l\'identità sin²θ + cos²θ = 1?', options: ['una formula da imparare a memoria', 'il teorema di Pitagora applicato al triangolo delle due ombre su un cerchio di raggio 1', 'una proprietà solo degli angoli notevoli', 'la definizione di seno'], correct: 1,
      why: 'Le due ombre sono i cateti, il raggio è l\'ipotenusa e vale 1. Vale per ogni angolo perché il raggio non cambia. Nel quantistico la stessa riga si chiama «le probabilità fanno 100%».' },
    { q: 'Quanto vale cos(a + b)?', options: ['cos a + cos b', 'cos a · cos b − sin a · sin b', 'cos a · cos b + sin a · sin b', '2 · cos a · cos b'], correct: 1,
      why: 'Le ombre non si sommano. Il modo di non sbagliarsi è ricordare da dove viene: è la casella in alto a sinistra del prodotto delle due matrici di rotazione.' },
    { q: 'Perché le formule di addizione hanno quella forma?', options: ['per convenzione storica', 'perché sono il prodotto di due matrici di rotazione: girare di a e poi di b è girare di a+b', 'perché derivano dai logaritmi', 'perché servono a semplificare i calcoli'], correct: 1,
      why: 'R(b)·R(a) = R(a+b). Svolgendo il prodotto riga per colonna, nelle caselle compaiono già cos a cos b − sin a sin b e sin a cos b + cos a sin b. La formula è quel prodotto letto ad alta voce.' },
    { q: 'Da dove viene la parola «seno»?', options: ['dal latino sinus, «insenatura», per un errore di lettura dell\'arabo jb', 'dal greco «semi»', 'dal nome di un matematico', 'dalla forma della curva'], correct: 0,
      why: 'Il sanscrito jyā («corda dell\'arco») diventa in arabo jiba, scritto senza vocali come jb; i traduttori latini del XII secolo lo leggono jaib, «insenatura», e traducono sinus. Il concetto era la mezza corda di un arco.' },
    { q: 'Di quanto ruota la freccia dello stato a ogni giro di Grover?', options: ['di θ', 'di 2θ, perché un giro sono due specchiate e due specchiate fanno una rotazione doppia', 'di 90° diviso il numero di giri', 'dipende dalla risposta cercata'], correct: 1,
      why: 'Marca e rifletti sono due specchiate, e due specchiate di fila sono una rotazione del doppio dell\'angolo fra i due specchi. Dopo k giri la freccia sta a (2k+1)·θ.' },
    { q: 'Perché continuare a fare giri di Grover, oltre un certo punto, peggiora?', options: ['perché si accumula rumore', 'perché la freccia supera i 90° e il seno ricomincia a scendere', 'perché le risposte sbagliate aumentano', 'non peggiora, migliora sempre'], correct: 1,
      why: 'La probabilità è sin² dell\'angolo. A 90° vale 1; oltre i 90° il seno decresce, quindi la freccia si allontana di nuovo dalla risposta giusta. Grover è una lancetta che gira, e va fermata al momento giusto.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> L'identità fondamentale è Pitagora sul cerchio, le formule di
          addizione sono il prodotto di due matrici letto ad alta voce, la duplicazione è il caso b = a — e con
          quella in mano Grover smette di essere magia: è una freccia che ruota di 2θ per volta e va fermata a 90°.
          In più adesso sai che «seno» vuol dire «insenatura» per colpa di un testo arabo senza vocali.</div>`,
});
@endsection
