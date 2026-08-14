@php($description = 'Integrali spiegati giocando: l\'area come limite di rettangoli (e perché tagliarli a metà fa scendere l\'errore come 1/n² invece che 1/n), il teorema fondamentale del calcolo visto con tachimetro e contachilometri, il logaritmo come area sotto 1/x, e la probabilità che fa 1 per la particella in una scatola.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { areaLab, teoremaLab } from '/js/widgets/integrali.js';

const L = renderLesson({
  id: 'm9-integrali',
  lead: `Al livello 21·b hai giocato con la <b>derivata</b>: quanto una cosa cambia. Qui c'è l'altra metà
         dell'analisi, che fa la domanda opposta: <b>se so quanto una cosa cambia in ogni istante, quanto è
         cambiata in tutto?</b> La risposta è un'area, si calcola a colpi di rettangoli — cioè con un limite,
         quello del livello M·8 — e poi arriva il colpo di scena: c'è una scorciatoia che rende inutili i
         rettangoli, ed è il teorema più importante che vedrai in questo corso.`,

  steps: [
    {
      t: 'L\'area a colpi di rettangoli',
      html: `<p>Il problema è vecchio: <b>quanta area c'è sotto una curva?</b> Sotto una retta è facile, è un
             triangolo. Sotto una parabola no.</p>
             <p>L'idea che funziona è ruvida e geniale: se non so misurare la roba curva, la copro di
             <b>rettangoli</b>, che so misurare. Ne metto n, ognuno largo (b−a)/n, alto quanto la curva. Sommo. Poi
             ne metto di più.</p>
             <div class="callout key">Questo è di nuovo il gioco del livello M·8: la somma dei rettangoli è una
             <b>successione</b>, e l'area è il numero a cui tende. «L'integrale esiste» vuol dire esattamente
             «quella successione ha un limite».</div>
             <p>Nel gioco c'è una cosa in più da provare, e non è un dettaglio: dove tagli il rettangolo. Al bordo
             sinistro, al destro, o <b>al punto di mezzo</b>. Prova tutte e tre con lo stesso numero di
             rettangoli.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'area', title: 'Due aree precise', text: 'porta l\'errore sotto 0,001 su due funzioni diverse.', xp: 50 });
        el.appendChild(m.root);
        areaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Se hai provato i tre tagli avrai visto una differenza enorme. Ai bordi l'errore scende come
              <b>1/n</b>: raddoppi i rettangoli, dimezzi l'errore. Al punto di mezzo scende come <b>1/n²</b>:
              raddoppi i rettangoli e l'errore si divide per <b>quattro</b>.</p>
              <div class="callout key"><b>Perché il punto di mezzo è così più bravo.</b> Tagliando al bordo, il
              rettangolo sbaglia sempre nello stesso verso: se la curva sale, resta tutto sotto. Tagliando a metà,
              sopra il punto di mezzo la curva sta sopra il rettangolo e sotto ci sta sotto: i due errori si
              <b>mangiano a vicenda</b>. Quel che resta è molto meno.</div>
              <p>Nei test di questo livello l'esponente non è raccontato: è misurato. Si raddoppiano i rettangoli
              e si guarda per quanto viene diviso l'errore — 2 al bordo, 4 a metà — su tre funzioni diverse.</p>
              <p class="mb0">E c'è un'ultima cosa da vedere: prendi la somma sinistra e quella destra su una
              funzione che sale. La prima sta <b>sempre sotto</b> il valore vero, la seconda <b>sempre sopra</b>.
              Il vero è incastrato in mezzo, e stringendo i rettangoli le due si avvicinano fino a schiacciarlo.
              Questo è il <b>metodo di esaustione</b> di Archimede, e ha 2200 anni.</p>`,
    },

    {
      t: 'Il colpo di scena: non serve nessun rettangolo',
      html: `<p>Adesso la cosa che cambia tutto, e che vale la pena presentare nell'ordine giusto — perché quando
             la si vede arrivare fa un certo effetto.</p>
             <p>Immagina di essere in macchina. Ci sono due strumenti sul cruscotto:</p>
             <ul>
               <li>il <b>tachimetro</b>, che dice quanto vai veloce <b>adesso</b>;</li>
               <li>il <b>contachilometri</b>, che dice quanta strada hai fatto <b>in tutto</b>.</li>
             </ul>
             <p>La strada fatta è l'<b>area sotto la curva della velocità</b>: se vai a 100 km/h per mezz'ora fai
             50 km, che è l'area di un rettangolo alto 100 e largo 0,5. Se la velocità cambia, l'area è sotto una
             curva — ed è un integrale.</p>
             <div class="callout key">Adesso la domanda al contrario: guardando solo il <b>contachilometri</b>,
             puoi sapere che cosa segna il tachimetro? Sì: è la <b>velocità con cui cambia</b> il contachilometri,
             cioè la sua pendenza. Che è la derivata del livello 21·b.</div>
             <p>Nel gioco i due strumenti stanno uno sopra l'altro. Sposta il cursore e guarda il numero giallo:
             l'altezza della curva di sopra e la pendenza della tangente di sotto sono <b>lo stesso numero</b>, in
             ogni punto.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'teorema', title: 'Il punto più ripido e quello piatto', text: 'trova dove la strada cresce più in fretta, e dove è ferma.', xp: 55 });
        el.appendChild(m.root);
        teoremaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<div class="formula">se A(t) è l'area accumulata fino a t, allora <b>A′(t) = f(t)</b></div>
              <p>Questo è il <b>teorema fondamentale del calcolo</b>, e il nome non è esagerato. Dice che
              <b>derivare e integrare sono operazioni inverse</b>, come moltiplicare e dividere. E dà la
              scorciatoia:</p>
              <div class="formula">area da a a b = <b>F(b) − F(a)</b>, con F una funzione la cui derivata è f</div>
              <p>Cioè: non contare rettangoli. Trova una funzione che derivata dia quella di partenza — si chiama
              <b>primitiva</b> — e guarda di quanto è cresciuta fra i due estremi. L'area sotto x² da 0 a 1 è
              1³/3 − 0³/3 = <b>1/3</b>, e non hai sommato niente.</p>
              <div class="callout ok"><b>Il conto che i rettangoli facevano in diecimila passi, la primitiva lo fa
              in due sottrazioni.</b> Ed è per questo che al liceo si passano mesi a imparare a trovare primitive:
              sono la chiave che apre tutte le aree.</div>`,
    },

    {
      t: 'Due aree che hanno già un nome',
      html: `<p>Due integrali che in questo corso valgono più degli altri, perché sono cose che hai già visto
             arrivare da un'altra strada.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Il logaritmo, di nuovo', html: 'Al livello 0·8 il logaritmo è arrivato come «l\'esponente che serve»: log₂ 8 = 3 perché 2³ = 8. C\'è un altro modo di definirlo, e passa da un\'area.' },
          { h: 'L\'area sotto 1/x', html: 'Prendi la curva <b>1/x</b> e misura l\'area da 1 fino a t. Quel numero <b>è</b> ln t, il logaritmo naturale. Non ci assomiglia: è uguale, e i test di questo livello lo verificano su cento valori di t.' },
          { h: 'Perché e è «naturale»', html: 'Quell\'area vale esattamente <b>1</b> quando t = <b>e</b> = 2,718… Ecco perché quella base si chiama naturale: è il punto in cui l\'area sotto 1/x fa uno. Nel gioco puoi verificarlo: scegli 1/x e guarda il valore vero.' },
          { h: 'La probabilità che fa 1', html: 'Nel corso hai ripetuto mille volte che «la somma dei quadrati delle ampiezze fa 1». Quello vale quando le possibilità sono contabili. Se una particella può stare in <b>qualunque punto</b> di un segmento, la somma diventa un <b>integrale</b>.' },
          { h: 'La particella nella scatola', html: 'La quarta curva del gioco è <b>2·sin²(πx)</b>: è |ψ|² dello stato più basso di una particella chiusa in una scatola fra 0 e 1. Dice dove è probabile trovarla: mai contro le pareti, massimo al centro.' },
          { h: 'E la sua area fa esattamente 1', html: 'Non per fortuna: quel 2 davanti c\'è <b>apposta</b>. Senza, l\'area farebbe 1/2 e la funzione non descriverebbe nessuna probabilità. Si chiama <b>normalizzazione</b>, ed è la prima cosa che si fa a una funzione d\'onda appena la si scrive.' },
          { h: 'Il valore atteso', html: 'Anche la media del livello M·7 diventa un integrale: invece di sommare valore × probabilità su ogni caso, si integra x·|ψ(x)|² su tutto il segmento. Per la particella nella scatola viene 1/2, cioè il centro — che è dove uno se l\'aspetta.' },
        ], { doneLabel: 'Ora torna!' });
      },
      after: `<div class="callout ok"><b>Da portarsi via:</b> l'integrale non è un attrezzo in più, è il modo in cui
              «sommare tante cose piccole» smette di essere un discorso e diventa un numero. Ogni volta che in
              fisica si legge «la probabilità totale è 1» o «l'energia media vale», sotto c'è uno di questi.</div>`,
    },

    {
      t: 'Duemila anni per una S allungata',
      html: `<p><b>Archimede</b>, nel III secolo a.C., calcola l'area di un segmento di parabola e trova che è
             <b>4/3</b> di quella del triangolo inscritto. Ci arriva sommando infiniti triangoli sempre più
             piccoli e stringendo il risultato fra due valori: il <b>metodo di esaustione</b>, che è quello che
             hai appena giocato con i rettangoli. Gli mancava solo la parola «limite» — e gli sarebbe servita, ma
             non c'era.</p>
             <p>Passano 1800 anni. Nel <b>1635</b> <b>Bonaventura Cavalieri</b>, gesuato milanese e allievo di
             Galileo, pubblica la <i>Geometria degli indivisibili</i>: immagina una superficie come fatta di
             infinite linee messe una accanto all'altra, e un solido come fatto di infinite superfici. È un modo
             di ragionare che fa storcere il naso ai puristi già allora — le linee hanno spessore zero, come fanno
             a fare un'area? — ma i conti tornano, e il suo principio si insegna ancora oggi.</p>
             <div class="callout key"><b>Il 29 ottobre 1675</b> <b>Leibniz</b>, in un manoscritto che non pubblicherà,
             scrive per la prima volta il simbolo <b>∫</b>. Non è un ghirigoro: è una <b>S allungata</b>, l'iniziale
             di <i>summa</i>. Prima scriveva <i>omn.</i>, per <i>omnia</i>, «tutti». Quel segno dice, letteralmente,
             «somma di tutti i pezzettini» — e da 350 anni sta lì a ricordare che un integrale è una somma.</div>
             <p>Newton e Leibniz, ciascuno per conto suo, capiscono anche il pezzo grosso: che quella somma è
             l'inversa della derivata. È il teorema che hai appena giocato. Ne segue una delle liti più velenose
             della storia della scienza su chi sia arrivato prima — con la Royal Society che nomina una commissione
             d'inchiesta il cui rapporto, si scoprirà, era stato scritto da Newton in persona.</p>
             <p class="mb0">Manca ancora la definizione pulita, e arriva con l'Ottocento della pignoleria: nel
             <b>1854</b> <b>Bernhard Riemann</b>, nella dissertazione per diventare docente a Gottinga, scrive per
             la prima volta che cosa vuol dire <b>esattamente</b> che una funzione «ha un integrale» — con le somme
             di rettangoli, il limite, e la condizione perché quel limite esista. Duemila anni dopo Archimede, e
             centottanta dopo la S di Leibniz.</p>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel primo gioco metti 10 rettangoli su x² e prova i tre tagli. Quale errore è più piccolo, e
           di quanto? <span class="muted">(al centro è quasi sessanta volte più preciso)</span></p>
        <p><b>2.</b> Sempre su x², quanti rettangoli servono per un errore sotto 0,001 tagliando al bordo? E
           tagliando a metà? <span class="muted">(500 contro 10)</span></p>
        <p><b>3.</b> Scegli 1/x e guarda il valore vero dell'area da 1 a e. <span class="muted">(fa 1: è ln e, ed è
           il motivo per cui e è la base «naturale»)</span></p>
        <p><b>4.</b> Nel secondo gioco scegli 2·sin²(πx) e porta il cursore al 50%. Quanto segna il contachilometri?
           <span class="muted">(0,5: metà della probabilità sta nella metà sinistra della scatola, come dev'essere
           per simmetria)</span></p>
        <p class="mb0"><b>5.</b> Da inventore: nel secondo gioco scegli sin x e porta il cursore al 100%. La
           tangente diventa piatta o ripida? <span class="muted">(piatta: alla fine sin π = 0, la velocità è zero e
           il contachilometri smette di salire — anche se ha già fatto 2 di strada)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cos\'è, in una riga, l\'integrale di una funzione?', options: ['la sua pendenza', 'l\'area sotto la sua curva, cioè il limite delle somme di rettangoli sempre più stretti', 'il suo valore massimo', 'la sua inversa'], correct: 1,
      why: 'È una somma di infiniti pezzi piccoli, e «somma di infiniti pezzi» ha senso solo come limite — quello del livello M·8. Il simbolo ∫ è una S allungata proprio per «summa».' },
    { q: 'Perché tagliare i rettangoli al punto di mezzo è tanto più preciso?', options: ['perché i rettangoli sono più larghi', 'perché sopra il punto di mezzo la curva sta sopra il rettangolo e sotto ci sta sotto: i due errori si compensano', 'perché il calcolo è più veloce', 'non è più preciso, è solo più elegante'], correct: 1,
      why: 'Al bordo l\'errore va sempre nello stesso verso e scende come 1/n; a metà si cancella in gran parte e scende come 1/n². Raddoppiando i rettangoli l\'errore si divide per quattro invece che per due.' },
    { q: 'Che cosa dice il teorema fondamentale del calcolo?', options: ['che ogni funzione ha un\'area', 'che la derivata dell\'area accumulata è la funzione di partenza: derivare e integrare sono operazioni inverse', 'che l\'area è sempre positiva', 'che i rettangoli bastano sempre'], correct: 1,
      why: 'È il tachimetro e il contachilometri: la strada cresce alla velocità che segna il tachimetro. Da lì la scorciatoia F(b) − F(a), che rende inutile contare rettangoli.' },
    { q: 'L\'area sotto 1/x da 1 a t che cos\'è?', options: ['una funzione senza nome', 'il logaritmo naturale di t', 'la radice di t', 't al quadrato'], correct: 1,
      why: 'È l\'altra definizione del logaritmo, e coincide con quella del livello 0·8. Vale 1 esattamente quando t = e — ecco perché quella base si chiama naturale.' },
    { q: 'Perché la curva 2·sin²(πx) ha quel 2 davanti?', options: ['per farla più alta', 'perché senza, l\'area farebbe 1/2 e non sarebbe una probabilità: la probabilità totale deve fare 1', 'per rendere il conto più difficile', 'per convenzione storica'], correct: 1,
      why: 'Si chiama normalizzazione ed è la prima cosa che si fa a una funzione d\'onda. È la versione continua di «la somma dei quadrati delle ampiezze fa 1», con l\'integrale al posto della somma.' },
    { q: 'Chi ha scritto per primo il simbolo ∫, e perché ha quella forma?', options: ['Newton, ed è una I di «infinito»', 'Leibniz nel 1675, ed è una S allungata per «summa»', 'Archimede, ed è una spirale', 'Riemann, ed è una R stilizzata'], correct: 1,
      why: 'Prima Leibniz scriveva omn. per omnia, «tutti». Il segno dice letteralmente «somma di tutti i pezzettini», e da 350 anni ricorda che cos\'è davvero un integrale.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> L'integrale è la somma dei pezzettini, e come ogni somma infinita
          esiste solo come limite. I rettangoli la calcolano, ma il teorema fondamentale la regala: derivare e
          integrare sono l'una l'inversa dell'altra, quindi basta una primitiva e due sottrazioni. E lungo la strada
          sono cadute due cose che il corso usava da un pezzo: il logaritmo è un'area, e «la probabilità totale fa
          1» è un integrale che si può calcolare a mano.</div>`,
});
@endsection
