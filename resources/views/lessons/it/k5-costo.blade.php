@php($description = 'Complessità computazionale spiegata giocando: log N, N, N log N, N quadro e 2 alla N a confronto, con i tempi veri di calcolo. Il metro per capire cosa significa vantaggio quantistico.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { confronto } from '/js/core/confronto.js';
import { costLab } from '/js/widgets/classic2.js';

const L = renderLesson({
  id: 'k5-costo',
  lead: `«Veloce» non vuol dire niente, se non si dice <b>rispetto a cosa</b>. In informatica un algoritmo
         si giudica così: quando il problema raddoppia, il lavoro quanto cresce? Raddoppia anche lui?
         Cresce di uno solo? Si moltiplica per quattro? Va al quadrato dell'universo?
         Sono cinque risposte possibili, e tutta la differenza fra un problema risolto e uno impossibile
         sta in quale delle cinque ti tocca.`,

  steps: [
    {
      t: 'Le cinque curve, e cosa vuol dire viverci dentro',
      html: `<table class="table">
               <tr><th>Costo</th><th>Nome</th><th>Se N raddoppia…</th><th>Esempio</th></tr>
               <tr><td class="mono">log N</td><td>logaritmico</td><td>+1 operazione</td><td>ricerca binaria (K·4)</td></tr>
               <tr><td class="mono">√N</td><td>radice</td><td>×1,41</td><td>Grover (livello 11)</td></tr>
               <tr><td class="mono">N</td><td>lineare</td><td>×2</td><td>leggere una lista</td></tr>
               <tr><td class="mono">N·log N</td><td>quasi lineare</td><td>poco più di ×2</td><td>ordinare, FFT (livello 17)</td></tr>
               <tr><td class="mono">N²</td><td>quadratico</td><td>×4</td><td>confrontare tutti con tutti, DFT (livello 16)</td></tr>
               <tr><td class="mono">2ⁿ</td><td>esponenziale</td><td>×2 per <b>ogni bit in più</b></td><td>provare tutte le chiavi</td></tr>
             </table>
             <p>La tabella si legge in dieci secondi ma non si <b>sente</b>. Per sentirla serve trasformare le
             operazioni in <b>tempo</b>. Muovi il cursore e guarda cosa succede alle sei curve — la scala
             verticale è logaritmica, altrimenti l'ultima uscirebbe dallo schermo già a N = 30.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'costo', title: 'Il muro esponenziale', text: 'trova il primo N per cui 2^N supera un anno di calcolo.', xp: 40 });
        el.appendChild(m.root);
        costLab(el, { onWin: () => m.complete() });
      },
      after: `<div class="callout key"><b>Il numero da ricordare è 55.</b> Un computer che fa un miliardo di
              operazioni al secondo impiega meno di un secondo per 2³⁰, un'ora per 2⁴², <b>più di un anno</b>
              per 2⁵⁵ e più dell'età dell'universo per 2¹⁰⁰. Non è una questione di comprare una macchina
              migliore: raddoppiare la potenza del computer ti fa guadagnare <b>un bit</b>. Uno.</div>`,
    },
    {
      t: 'Perché le costanti non contano (e quando invece contano)',
      html: `<p>Quando si dice che un algoritmo «costa N²» si sta buttando via un sacco di roba: il numero
             esatto di operazioni, la velocità del processore, se il codice è scritto bene. È voluto.
             Si scrive <b>O(N²)</b> e si legge «cresce come N²».</p>
             <p>Il motivo è nel grafico: un algoritmo N² scritto malissimo su un computer del 1990 batte
             comunque un algoritmo 2ⁿ scritto benissimo su un supercomputer, non appena N diventa grande
             abbastanza. La <b>forma</b> della curva vince sempre sulla costante, prima o poi.</p>
             <div class="callout warn"><b>Ma «prima o poi» può essere lontanissimo.</b> È l'errore classico di
             chi legge solo la teoria: esistono algoritmi con costanti così enormi da essere inutilizzabili
             nonostante una curva migliore. E vale <b>proprio per il quantistico</b>: un'operazione su qubit
             oggi è milioni di volte più lenta e più fragile di un'operazione su bit. Un vantaggio quadratico
             come quello di Grover, con quelle costanti, in molti casi pratici non si vede nemmeno —
             mentre un vantaggio esponenziale come quello di Shor spazza via qualunque costante.</div>`,
    },
    {
      t: 'Il vocabolario che serve per capire i titoli dei giornali',
      html: `<ul>
               <li><b>P</b> — i problemi che si <b>risolvono</b> in tempo polinomiale (N, N², N³…). Il regno
                   del "si può fare".</li>
               <li><b>NP</b> — i problemi la cui soluzione, <b>se qualcuno te la dà</b>, si controlla in tempo
                   polinomiale. Un sudoku risolto si verifica in un minuto; risolverlo è un'altra storia.</li>
               <li><b>P = NP?</b> — la domanda da un milione di dollari: risolvere è sempre facile quanto
                   verificare? Quasi nessuno crede di sì, nessuno sa dimostrarlo.</li>
               <li><b>NP-completi</b> — i più duri della classe NP, tutti equivalenti fra loro (commesso
                   viaggiatore, zaino, colorazione di grafi…). Se ne risolvi uno in fretta, li risolvi tutti.</li>
               <li><b>BQP</b> — i problemi risolvibili in tempo polinomiale da un computer <b>quantistico</b>.</li>
             </ul>
             <div class="callout key"><b>La frase che vale tutto il livello:</b> non si sa se BQP contenga i
             problemi NP-completi, e <b>quasi tutti gli esperti pensano di no</b>. La fattorizzazione — quella
             che Shor risolve — <b>non è</b> NP-completa: è un caso speciale, con una struttura nascosta
             (una periodicità) che il quantistico sa sfruttare. Quando leggi «i computer quantistici
             risolveranno i problemi impossibili», sappi che quasi sempre è falso: risolveranno in fretta
             <b>alcuni</b> problemi con la struttura giusta.</div>`,
      after: confronto({
        titolo: 'Il catalogo dei vantaggi quantistici, per quello che valgono',
        livello: '20-shor',
        vaiA: 'Vai a Shor (livello 20)',
        classico: {
          titolo: 'Cosa costa oggi',
          html: `<ul class="mb0">
                   <li>Ricerca senza struttura: <b>N</b></li>
                   <li>Trasformata di Fourier: <b>N·log N</b> (FFT)</li>
                   <li>Fattorizzare un numero di n cifre binarie: <b>circa 2^(n^⅓)</b> — praticamente esponenziale</li>
                   <li>Simulare 50 particelle quantistiche: <b>2⁵⁰ numeri</b>, impossibile</li>
                 </ul>`,
        },
        quantistico: {
          titolo: 'Cosa costerebbe',
          html: `<ul class="mb0">
                   <li>Grover: <b>√N</b> — guadagno <b>quadratico</b></li>
                   <li>QFT: <b>log²N</b> porte — ma il risultato non si può leggere tutto (livello 18)</li>
                   <li>Shor: <b>n³</b> circa — guadagno <b>esponenziale</b>, ed è il colpo grosso</li>
                   <li>Simulazione quantistica: <b>polinomiale</b> — il motivo originario per cui Feynman
                       propose la cosa, nel 1981</li>
                 </ul>`,
        },
        numeri: [
          { cosa: 'chiave AES-128 (forza bruta)', classico: '2¹²⁸', quantistico: '2⁶⁴ (Grover)' },
          { cosa: 'RSA-2048 (fattorizzare)', classico: 'miliardi di anni', quantistico: 'ore, con una macchina che non esiste ancora' },
          { cosa: 'commesso viaggiatore', classico: 'esponenziale', quantistico: 'esponenziale (nessun guadagno noto)' },
        ],
        verdetto: `<b>Tre righe, tre verdetti diversi.</b> Un vantaggio quadratico si compensa raddoppiando le
                   chiavi; uno esponenziale rifà la crittografia del mondo; e per la maggior parte dei problemi
                   difficili non si conosce <b>nessun</b> vantaggio. Chi ti racconta il quantistico come una
                   riga sola ti sta raccontando una favola.`,
      }),
    },
    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Con il cursore su N = 40: quante operazioni fa un algoritmo N² e quante uno 2ⁿ? Quante volte di più?</p>
        <p><b>2.</b> Un computer 1000 volte più veloce di quanti bit sposta il muro di 2ⁿ? <span class="muted">(1000 ≈ 2¹⁰: dieci bit. Dieci.)</span></p>
        <p><b>3.</b> Se Grover porta 2¹²⁸ a 2⁶⁴, che cosa fa a 2²⁵⁶? Perché la raccomandazione post-quantistica è «raddoppia la chiave»?</p>
        <p class="mb0"><b>4.</b> Da inventore: quale delle sei curve descrive «cercare una parola in un dizionario di carta»? E «confrontare ogni foto con ogni altra foto»?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Un algoritmo O(2ⁿ): cosa succede aggiungendo UN bit al problema?',
      options: ['il lavoro cresce di 1', 'il lavoro raddoppia', 'il lavoro va al quadrato', 'non cambia niente'], correct: 1,
      why: 'Ogni bit raddoppia. È il motivo per cui comprare un computer doppiamente veloce ti fa guadagnare un solo bit.' },
    { q: 'Perché si trascurano le costanti moltiplicative?',
      options: ['perché non si sanno calcolare', 'perché al crescere di N la forma della curva domina comunque', 'per pigrizia', 'perché tutti i computer sono uguali'], correct: 1,
      why: 'Prima o poi la curva vince. Ma "prima o poi" può essere lontano: sul quantistico reale le costanti contano eccome.' },
    { q: 'La fattorizzazione, quella che Shor risolve, è un problema NP-completo?',
      options: ['sì, è il più difficile di tutti', 'no: è un caso speciale con una struttura periodica nascosta', 'sì, ma solo per numeri grandi', 'la domanda non ha senso'], correct: 1,
      why: 'Non è NP-completa. Il quantistico ne approfitta perché c\'è una periodicità da trovare, non perché "risolve i problemi difficili".' },
    { q: 'Il guadagno di Grover è…',
      options: ['esponenziale', 'quadratico', 'logaritmico', 'nullo'], correct: 1,
      why: 'Da N a √N: dimezza l\'esponente. Per questo basta raddoppiare la lunghezza delle chiavi simmetriche.' },
  ],

  outro: `<div class="callout ok"><b>Cosa ti porti a casa:</b> il costo di un algoritmo si misura da come
          cresce, non da quanto è veloce oggi; polinomiale ed esponenziale sono due mondi diversi;
          e i vantaggi quantistici sono di due tipi ben distinti, quadratico ed esponenziale, con conseguenze
          incomparabili. Prossimo livello: l'ultima cosa da sapere del computer classico, quella che spiega
          perché il quantistico è fatto come è fatto.</div>`,
});
@endsection
