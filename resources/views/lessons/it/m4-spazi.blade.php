@php($description = 'Spazi vettoriali spiegati giocando: combinazione lineare, base e dimensione toccate con mano, perché in una base ortonormale le coordinate sono le ombre (prodotto scalare), cosa vuol dire davvero «cambiare base di misura» e da dove viene il 2^n che rende impossibile simulare molti qubit.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { baseLab, dimensioneLab } from '/js/widgets/spazi.js';

const L = renderLesson({
  id: 'm4-spazi',
  lead: `La parola <b>base</b> gira per tutto questo corso — base di misura, base computazionale, cambio di base —
         e finora l'hai capita a intuito. Adesso diventa una cosa che si tocca, e con lei arriva la parola
         <b>dimensione</b>: il numero da cui esce il famigerato <b>2<sup>n</sup></b>, cioè il motivo per cui un
         computer normale non ce la fa a simulare cinquanta qubit. Sono due concetti soli, e si vedono entrambi
         muovendo due cursori.`,

  steps: [
    {
      t: 'Che cos\'è uno spazio vettoriale (senza assiomi)',
      html: `<p>Definizione onesta, in una riga: uno <b>spazio vettoriale</b> è un posto pieno di oggetti che sai
             fare due cose sole — <b>sommarli fra loro</b> e <b>allungarli o accorciarli</b> moltiplicandoli per un
             numero. Basta questo.</p>
             <p>Sembra poco, e invece la stessa struttura la ritrovi in posti che non si somigliano per niente:</p>
             <table class="table">
               <tr><th>Gli oggetti</th><th>Sommare vuol dire</th><th>Allungare vuol dire</th></tr>
               <tr><td>frecce sul piano</td><td>punta contro coda</td><td>tirarle più lunghe</td></tr>
               <tr><td>liste di numeri</td><td>sommarle casella per casella</td><td>moltiplicarle tutte per k</td></tr>
               <tr><td>onde e suoni</td><td>sovrapporli</td><td>alzare il volume</td></tr>
               <tr><td><b>stati quantistici</b></td><td><b>la sovrapposizione</b></td><td>cambiare l'ampiezza</td></tr>
             </table>
             <div class="callout key">L'ultima riga è il motivo per cui questo livello esiste. La <b>sovrapposizione
             quantistica</b> non è un fenomeno esotico da accettare: è la <b>somma</b> di uno spazio vettoriale.
             Quando scrivi α|0⟩ + β|1⟩ stai facendo esattamente quello che fai sommando due frecce — e tutte le
             regole che stai per vedere valgono lì tali e quali.</div>
             <p>Il nome tecnico di «allunga e somma» è <b>combinazione lineare</b>. Nel gioco ne fai una a mano.</p>`,
    },

    {
      t: 'Due frecce che bastano per tutto il piano',
      html: `<p>Ti do due frecce e due cursori. Puoi allungare o accorciare ciascuna quanto vuoi, anche al
             contrario, e poi sommarle. Domanda: <b>dove riesci ad arrivare?</b></p>
             <p>Prova con la prima base, poi prova a cambiarla. E soprattutto prova l'ultima, quella chiamata
             «due in linea»: serve a far vedere una cosa che con le parole non si capisce.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'base', title: 'Tre bersagli', text: 'raggiungi 3 bersagli diversi.', xp: 45 });
        el.appendChild(m.root);
        baseLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Il risultato è netto e ha due facce:</p>
              <ul>
                <li>con due frecce <b>non in linea</b> arrivi in <b>qualunque</b> punto del piano. Non «quasi
                    tutti»: tutti, e in un modo solo. Due frecce così si chiamano <b>base</b>, e i due numeri dei
                    cursori sono le <b>coordinate</b> del punto in quella base;</li>
                <li>con due frecce <b>in linea</b> non ci arrivi mai, per quanto insisti: qualunque combinazione
                    resta sulla stessa retta. Metà piano è irraggiungibile.</li>
              </ul>
              <div class="callout warn"><b>Quel muro era voluto</b>, e il gioco te lo dice invece di lasciarti
              girare a vuoto. È il modo più rapido di capire cosa vuol dire <b>indipendenti</b>: due frecce sono
              indipendenti quando la seconda <b>aggiunge una direzione nuova</b> invece di ripetere la prima.</div>
              <p class="mb0">E nota una cosa che si vede cambiando base: <b>lo stesso punto ha coordinate diverse in
              basi diverse</b>. Il punto non si muove — cambia il modo di dargli un nome. Tienilo da parte: fra due
              passi diventa il cuore della misura quantistica.</p>`,
    },

    {
      t: 'Quante ne servono: la dimensione',
      html: `<p>Adesso la domanda che dà il numero. Non «quali frecce», ma <b>quante</b>.</p>
             <p>Nel gioco hai una collezione di frecce e le accendi o le spegni. L'obiettivo è coprire tutto il piano
             usando il <b>minimo</b> numero possibile.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'dimensione', title: 'Il minimo che basta', text: 'trova l\'insieme minimo che copre il piano, su 3 collezioni.', xp: 50 });
        el.appendChild(m.root);
        dimensioneLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Comunque tu scelga le frecce, il conto finisce sempre uguale: <b>ce ne vogliono esattamente
              due</b>. Una non basta (copri solo una retta), tre sono troppe (una si può scrivere con le altre).</p>
              <div class="callout key">Quel numero si chiama <b>dimensione</b>, e la cosa notevole è che <b>non
              dipende dalla base</b>: puoi scegliere gli assi, una base girata, una storta — le coordinate cambiano
              tutte, il numero di frecce necessarie no. È una proprietà dello <b>spazio</b>, non della tua
              scelta.</div>
              <p>Una collezione, però, non ci arriva: quella in cui tutte le frecce stanno sulla stessa retta. Lì la
              dimensione dello spazio che copri è <b>1</b>, e nessuna scelta ti salva. Non è un bug del gioco: è la
              differenza fra «ho tante frecce» e «ho tante <b>direzioni</b>».</p>`,
    },

    {
      t: 'Base ortonormale: quando le coordinate sono le ombre',
      html: `<p>Fra tutte le basi possibili ce n'è una famiglia molto più comoda delle altre: quelle fatte di frecce
             <b>lunghe 1</b> e <b>perpendicolari</b> fra loro. Si chiamano <b>ortonormali</b>, e la comodità è
             questa:</p>
             <div class="callout key">In una base ortonormale, per trovare le coordinate di un punto <b>non devi
             risolvere niente</b>: basta fare il <b>prodotto scalare</b> con ciascuna freccia della base. Cioè —
             livello 0·9 — basta <b>proiettare l'ombra</b>.</div>
             <p>In una base storta invece la scorciatoia non vale e il conto è più lungo: è il motivo per cui in
             meccanica quantistica le basi sono <b>sempre</b> ortonormali.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Il punto di partenza', html: 'Uno stato di un qubit è <b>α|0⟩ + β|1⟩</b>. Guardalo per quello che è: una <b>combinazione lineare</b> di due frecce di base, con coefficienti α e β.' },
          { h: 'La base computazionale', html: '|0⟩ e |1⟩ sono due frecce <b>perpendicolari e lunghe 1</b>: una base ortonormale. Quindi α e β sono semplicemente le due <b>ombre</b> dello stato su quelle direzioni.' },
          { h: 'La regola di Born', html: 'La probabilità di leggere 0 è <b>α²</b>, cioè l\'ombra al quadrato. E siccome vale Pitagora su una base ortonormale, α² + β² è la lunghezza al quadrato dello stato, che è 1: <b>le probabilità fanno 100%</b> per costruzione.' },
          { h: 'L\'altra base', html: 'Le frecce |+⟩ e |−⟩ (la somma e la differenza di |0⟩ e |1⟩, normalizzate) sono <b>un\'altra base ortonormale dello stesso spazio</b>: girata di 45°. Lo stato non cambia; cambiano i due numeri con cui lo descrivi.' },
          { h: 'Che cos\'è misurare', html: 'Misurare vuol dire <b>scegliere una base</b> e chiedere allo stato: «in quale delle tue direzioni di base ti trovo?». Le probabilità sono le ombre al quadrato <i>su quella base</i>.' },
          { h: 'Perché la stessa cosa dà risposte diverse', html: 'Lo stato |+⟩ misurato nella base di |+⟩ e |−⟩ dà <b>sempre</b> «più», con certezza. Lo stesso stato misurato nella base di |0⟩ e |1⟩ dà 50 e 50. Non è cambiato lo stato: è cambiata la <b>domanda</b>. Ed è tutto qui il famoso «dipende da come misuri».' },
        ], { doneLabel: 'Chiaro!' });
      },
      after: `<div class="callout ok"><b>Riassunto in una riga:</b> lo stato è un punto, la base è il sistema di
              coordinate, misurare è chiedere le coordinate. Cambiare base non muove il punto — cambia la
              domanda.</div>`,
    },

    {
      t: 'Il 2 elevato a n, e perché fa paura',
      html: `<p>Ora il conto che decide tutto. Quanto è grande lo spazio in cui vive un registro quantistico?</p>
             <p>Un qubit ha due direzioni di base, |0⟩ e |1⟩: <b>dimensione 2</b>. Due qubit hanno per base |00⟩,
             |01⟩, |10⟩, |11⟩: <b>dimensione 4</b>. Tre qubit: otto. Ogni qubit in più <b>raddoppia</b>:</p>
             <div class="formula">n qubit → dimensione <span class="hl-n">2<sup>n</sup></span> &nbsp;&nbsp;(non 2n)</div>
             <p>Quella distinzione, che sembra un dettaglio di scrittura, è l'intero campo. Con n bit classici hai
             bisogno di <b>n</b> numeri per dire come sta il registro. Con n qubit ne servono <b>2<sup>n</sup></b> —
             uno per ogni ampiezza — perché lo stato è una combinazione lineare di tutte le configurazioni
             insieme.</p>
             <table class="table">
               <tr><th>Qubit</th><th>Numeri da tenere</th><th>Memoria (a 16 byte l'uno)</th></tr>
               <tr><td class="mono">10</td><td class="mono">1 024</td><td>16 KB</td></tr>
               <tr><td class="mono">30</td><td class="mono">1 073 741 824</td><td>~17 GB</td></tr>
               <tr><td class="mono">50</td><td class="mono">~10¹⁵</td><td>~18 000 TB</td></tr>
               <tr><td class="mono">300</td><td class="mono">~10⁹⁰</td><td>più degli atomi dell'universo osservabile</td></tr>
             </table>
             <div class="callout key">Ecco perché il simulatore di questo corso arriva a pochi qubit e non a
             trecento: non è pigrizia del codice, è la <b>dimensione dello spazio</b>. Ed ecco anche perché un
             computer quantistico è interessante — non «perché va veloce», ma perché è un oggetto fisico che
             <b>abita</b> quello spazio senza doverlo scrivere.</div>
             <p class="mb0">E attenzione al malinteso più diffuso: avere 2<sup>n</sup> ampiezze <b>non</b> vuol dire
             poter leggere 2<sup>n</sup> risposte. La misura ne restituisce <b>una sola</b>. Tutto il mestiere degli
             algoritmi quantistici è far interferire quelle ampiezze in modo che la risposta giusta sia quella che
             esce — ed è la stessa cosa che al livello 15·b e M·3 hai visto fare alle radici dell'unità.</p>`,
    },

    {
      t: 'Da dove viene: un professore di liceo e un dizionario di sanscrito',
      html: `<p>L'idea di studiare «cose che si sommano e si allungano» in astratto — senza dire se sono frecce,
             numeri o funzioni — è sorprendentemente recente, e nasce da un libro che <b>non lesse quasi
             nessuno</b>.</p>
             <p>Nel <b>1844</b> <b>Hermann Grassmann</b>, professore di liceo a Stettino, pubblica la <i>Lineale
             Ausdehnungslehre</i> — «teoria dell'estensione lineare» — in cui costruisce, con un'ottantina d'anni
             di anticipo, gran parte dell'algebra lineare moderna: dipendenza, indipendenza, dimensione,
             sottospazi. Il libro è scritto in modo talmente astratto e oscuro che viene <b>ignorato</b>. Grassmann
             non è un professore universitario, non ha una cattedra da cui farsi ascoltare, e i matematici del tempo
             lo trovano illeggibile.</p>
             <div class="callout key"><b>La curiosità:</b> deluso, Grassmann <b>lascia perdere la matematica</b> e si
             mette a studiare sanscrito. Pubblica una traduzione del <i>Rigveda</i> e un <b>dizionario</b> che
             diventa un'opera di riferimento — tanto che riceve una laurea honoris causa <b>per la linguistica</b>,
             non per la matematica. Il suo dizionario del Rigveda è ancora usato oggi. Morì senza sapere che il suo
             libro «illeggibile» stava per diventare il linguaggio della fisica del Novecento.</div>
             <p>A dargli ragione è, fra i primi, un italiano: nel <b>1888</b> <b>Giuseppe Peano</b> pubblica il
             <i>Calcolo geometrico secondo l'Ausdehnungslehre di H. Grassmann</i> e ci infila, quasi di nascosto, la
             <b>prima definizione assiomatica moderna di spazio vettoriale</b>: la lista di regole che ancora oggi si
             trova nei manuali. Anche quella resta poco notata per decenni.</p>
             <p>Il salto al quantistico arriva con <b>David Hilbert</b> e soprattutto con <b>John von Neumann</b>,
             che nel <b>1932</b> riscrive tutta la meccanica quantistica come geometria in uno spazio vettoriale con
             prodotto scalare — quello che oggi si chiama <b>spazio di Hilbert</b>. Da lì in poi «stato» significa
             <b>vettore</b>, «osservabile» significa <b>operatore</b>, e «misura» significa <b>proiezione su una
             base</b>: cioè esattamente le tre cose di questo livello.</p>
             <div class="callout ok"><b>Vale la pena notarlo:</b> Grassmann stava cercando di sistemare la geometria,
             non di descrivere gli atomi. Ottant'anni dopo, il suo linguaggio si è rivelato l'unico adatto a farlo.
             È la stessa storia dei numeri complessi del livello M·3 — e capita così spesso che ha un nome:
             «l'irragionevole efficacia della matematica».</div>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel primo gioco scegli la base «girata di 45°» e raggiungi il bersaglio (2 ; 1). Che numeri ti
           servono? Poi fai lo stesso con la base «gli assi». <span class="muted">(stesso punto, numeri diversi: è
           tutto qui il cambio di base)</span></p>
        <p><b>2.</b> Sempre nel primo gioco, con la base «due in linea», prova a raggiungere un bersaglio qualsiasi.
           Dopo un po' fermati: <b>quale</b> proprietà manca a quelle due frecce?</p>
        <p><b>3.</b> Nel secondo gioco, nella collezione 3, ci sono quattro frecce. Quante coppie diverse formano
           una base? <span class="muted">(non tutte: la 1 e la 2 sono in linea fra loro)</span></p>
        <p><b>4.</b> Se un qubit ha dimensione 2 e due qubit dimensione 4, quanti numeri servono per <b>otto</b>
           qubit? E per <b>venti</b>? <span class="muted">(256 e poco più di un milione)</span></p>
        <p class="mb0"><b>5.</b> Da inventore: le frecce sul piano hanno dimensione 2. Le funzioni — che si sommano
           e si allungano anche loro — che dimensione hanno? <span class="muted">(indizio: quante ne servono per
           costruire tutte le altre? e cosa c'entra la trasformata di Fourier, che scrive un'onda qualsiasi come
           somma di seni e coseni?)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cos\'è, in sostanza, uno spazio vettoriale?', options: ['un insieme di frecce', 'un posto pieno di oggetti che si possono sommare fra loro e allungare moltiplicandoli per un numero', 'un sistema di coordinate', 'lo spazio a tre dimensioni'], correct: 1,
      why: 'Servono solo quelle due operazioni. Per questo la stessa struttura vale per frecce, liste di numeri, onde e stati quantistici — e la sovrapposizione quantistica è semplicemente la somma di uno spazio vettoriale.' },
    { q: 'Quando due frecce del piano formano una base?', options: ['quando sono perpendicolari', 'quando non stanno sulla stessa retta', 'quando sono lunghe 1', 'quando puntano verso destra'], correct: 1,
      why: 'Basta che siano indipendenti, cioè che la seconda aggiunga una direzione nuova. Perpendicolari e lunghe 1 è una condizione più forte (ortonormale), comoda ma non necessaria.' },
    { q: 'Che cos\'è la dimensione di uno spazio?', options: ['il numero di frecce che hai a disposizione', 'il numero minimo di frecce necessarie per raggiungere tutto — e non dipende da quale base scegli', 'la lunghezza della freccia più lunga', 'il numero di coordinate positive'], correct: 1,
      why: 'Meno di così non bastano, di più sono ridondanti. Il numero è una proprietà dello spazio: cambiando base cambiano le coordinate, non quante ne servono.' },
    { q: 'In una base ortonormale, come si trovano le coordinate di un punto?', options: ['risolvendo un sistema', 'facendo il prodotto scalare con ciascuna freccia della base: sono le ombre', 'misurando gli angoli', 'non si possono trovare'], correct: 1,
      why: 'È la comodità che rende ortonormali tutte le basi della meccanica quantistica: le ampiezze sono le proiezioni dello stato sulle direzioni di base, e le probabilità sono quelle ombre al quadrato.' },
    { q: 'Che cosa vuol dire misurare un qubit in una base diversa?', options: ['cambiare lo stato del qubit', 'fargli una domanda diversa: lo stato resta lo stesso, cambiano le coordinate con cui lo descrivi', 'cambiare l\'ordine dei qubit', 'ripetere la misura'], correct: 1,
      why: 'Lo stato è un punto; la base è il sistema di coordinate. |+⟩ misurato nella base di |+⟩ e |−⟩ dà sempre lo stesso risultato; misurato in quella di |0⟩ e |1⟩ dà 50 e 50. Il punto non si è mosso.' },
    { q: 'Qual è la dimensione dello spazio degli stati di n qubit?', options: ['2n', 'n²', '2^n', 'n'], correct: 2,
      why: 'Ogni qubit in più raddoppia il numero di ampiezze da tenere. Con 50 qubit sono circa 10¹⁵ numeri: è il motivo per cui simulare un computer quantistico su uno normale diventa impossibile.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> Base = poche frecce che bastano per tutto; dimensione = quante ne
          servono, e non dipende da quale base scegli; base ortonormale = coordinate che sono ombre, cioè prodotti
          scalari. Con questi tre pezzi «cambiare base di misura» smette di essere una formula e diventa una frase
          in italiano — e il 2<sup>n</sup> smette di essere una minaccia e diventa un conto che sai rifare.</div>`,
});
@endsection
