@php($description = 'Successioni e limiti spiegati giocando: il gioco del corridoio (che è la definizione di Weierstrass travestita), perché «quanti tiri servono» era già un limite, la banca di Bernoulli da cui nasce e — e la banca che paga interessi immaginari, cioè la dimostrazione di e^(iθ) = cos θ + i·sin θ.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { corridoioLab, bancaLab } from '/js/widgets/limiti.js';

const L = renderLesson({
  id: 'm8-limiti',
  lead: `Questa è la parola più usata di tutta l'analisi, e quasi sempre spiegata male: «la successione <b>tende</b>
         a zero». Tende come? Ci arriva o no? Qui la risposta arriva sotto forma di gioco — perché la definizione
         vera <b>è</b> un gioco, con due giocatori e una mossa a testa. E poi si scopre una cosa: quel gioco lo hai
         già giocato al livello M·7, quando hai chiesto «quanti tiri servono per stare sotto un certo errore».
         Stessa domanda, stesso numero.`,

  steps: [
    {
      t: 'Il gioco del corridoio: la definizione, senza formule',
      html: `<p>Una <b>successione</b> è una fila infinita di numeri, uno per ogni n: a₁, a₂, a₃, … Per esempio
             1/√n, che fa 1 · 0,707 · 0,577 · 0,5 … Si vede che scende verso zero. Ma «si vede» non è una
             definizione, e per due secoli nessuno è riuscito a scriverne una che tenesse.</p>
             <p>Quella che ha funzionato è questa, ed è un gioco fra due giocatori:</p>
             <div class="callout key">
               <p><b>Io</b> scelgo un corridoio: una striscia larga <b>±ε</b> attorno al numero L.</p>
               <p><b>Tu</b> devi rispondere con un <b>N</b>: da lì in poi la successione resta dentro il corridoio,
                  e non ne esce <b>mai più</b>.</p>
               <p class="mb0">Se hai una risposta per <b>ogni</b> corridoio, per quanto stretto lo faccia io,
                  allora la successione <b>tende</b> a L. Altrimenti no.</p>
             </div>
             <p>Nota la forma della cosa: non si dice mai «ci arriva». Si dice solo che, quanto vuoi vicino, prima
             o poi ci si mette e ci resta. La successione 1 + 1/2ⁿ non vale mai 1 — eppure tende a 1, perché a
             qualunque corridoio attorno a 1 tu sappia rispondere con un N.</p>
             <p>Gioca. Comincia dal corridoio largo, poi stringilo — e guarda che cosa succede all'N.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'corridoio', title: 'Tre corridoi, sempre più stretti', text: 'trova un N che vinca per tutti e tre.', xp: 50 });
        el.appendChild(m.root);
        corridoioLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Se hai provato a vincere il corridoio più stretto restando su 1/√n, hai sbattuto contro un muro:
              l'N esiste, ma vale <b>10.000</b> e non entra nel grafico. Con 1 + 1/2ⁿ ne bastano <b>7</b>.</p>
              <div class="callout key"><b>Ecco la cosa che il gioco insegna e che le formule nascondono.</b> «Tende
              a zero» non è una proprietà sola: c'è un abisso fra chi ci tende <b>in fretta</b> e chi ci tende
              piano. Entrambe le successioni tendono a zero; una ci mette sette termini, l'altra diecimila.</div>
              <p>E le due che non tendono a niente? Con <b>(−1)ⁿ</b> è ovvio: rimbalza fra −1 e 1 per sempre. Ma
              guarda la quinta, <b>Grover su 16 caselle</b>: quella è la probabilità di trovare la casella giusta
              dopo n giri, la stessa curva del livello 11. Sale, tocca quasi 1 al terzo giro — e poi <b>ridiscende
              fino a quasi zero</b>. Non tende a niente nemmeno lei.</p>
              <div class="callout warn"><b>Per questo Grover ha un numero di giri e non «più giri è meglio».</b> È
              l'unico algoritmo del corso in cui insistere <b>peggiora</b>, e adesso hai la parola per dirlo con
              precisione: quella successione non converge, oscilla.</div>`,
    },

    {
      t: 'Achille e la tartaruga, cioè la prima volta che qualcuno ci ha provato',
      html: `<p>Il problema è vecchio di 2500 anni, e nella forma in cui lo pose <b>Zenone di Elea</b> suonava come
             una dimostrazione che il movimento è impossibile.</p>
             <p>Achille corre dieci volte più veloce della tartaruga, che parte 100 metri avanti. Quando Achille
             arriva a 100, la tartaruga è a 110. Quando lui arriva a 110, lei è a 111. E così via, <b>per sempre</b>:
             ogni volta che lui arriva dov'era lei, lei si è spostata un po'. Quindi — concludeva Zenone — non la
             raggiunge mai.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Dov\'è l\'inganno', html: 'Non nei numeri: quei passi sono <b>davvero</b> infiniti. L\'inganno è nell\'ultima parola: «mai». Zenone sta assumendo che infiniti passi richiedano un tempo infinito. È esattamente quello che va verificato, non dato per buono.' },
          { h: 'Contiamo il tempo, non i passi', html: 'Se Achille va a 10 m/s, il primo pezzo gli costa <b>10 s</b>. Il secondo (10 metri) gli costa <b>1 s</b>. Il terzo (1 metro) <b>0,1 s</b>. Ogni pezzo dura un decimo del precedente.' },
          { h: 'La somma', html: 'Il tempo totale è 10 + 1 + 0,1 + 0,01 + … Questa è una <b>serie geometrica</b> di ragione 1/10, quella del livello 15·b. La sua somma non è infinita: fa <b>11,111… = 100/9</b> secondi.' },
          { h: 'La risposta a Zenone', html: 'Achille la raggiunge dopo <b>11,11 secondi</b>, a 111,11 metri. Infiniti passi, in un tempo finito. Non c\'è nessun paradosso: c\'era solo una somma infinita, e nessuno prima sapeva che potesse fare un numero.' },
          { h: 'Che c\'entra con il corridoio', html: 'Le somme parziali — 10 · 11 · 11,1 · 11,11 — sono una <b>successione</b>. E tende a 100/9 nel senso preciso del gioco: qualunque corridoio tu metta attorno a 100/9, da un certo passo in poi le somme ci stanno dentro.' },
          { h: 'Perché ci interessa in questo corso', html: 'Perché la <b>trasformata di Fourier</b> è fatta di somme di frecce, la serie geometrica è il motore che le fa cancellare o sommare (livello 15·b), e ogni volta che si scrive «= » fra una somma infinita e un numero, dietro c\'è questo gioco.' },
        ], { doneLabel: 'Ora torna!' });
      },
      after: `<div class="callout ok"><b>Da portarsi via:</b> «infiniti pezzi» non vuol dire «totale infinito». Se i
              pezzi rimpiccioliscono abbastanza in fretta, la somma è un numero — e quel numero è un limite.</div>`,
    },

    {
      t: 'La banca di Bernoulli: da dove esce davvero e',
      html: `<p>Nel <b>1683</b> Jakob Bernoulli si pone una domanda da contabile, non da filosofo. Metti 1 in banca
             al <b>100% di interesse</b> all'anno.</p>
             <ul>
               <li>Pagato tutto alla fine: alla fine hai <b>2</b>.</li>
               <li>Pagato in <b>due rate</b> del 50%: 1 → 1,5 → 2,25. Meglio, perché la prima metà di interesse
                   frutta a sua volta.</li>
               <li>Pagato in <b>dodici rate</b> mensili: 2,613. In <b>365</b> rate giornaliere: 2,7146.</li>
             </ul>
             <div class="formula">capitale con n rate = (1 + 1/n)<sup>n</sup></div>
             <p>Più si spezza, più si guadagna. La domanda vera è: <b>fino a dove?</b> Se le rate diventano
             infinite, il capitale esplode o si ferma?</p>
             <p>Nel gioco, alza le rate e guarda la curva blu. Poi — e questa è la parte da vedere — cambia il tipo
             di interesse.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'banca', title: 'Due banche', text: 'arriva vicino a e, poi porta la freccia sul cerchio.', xp: 55 });
        el.appendChild(m.root);
        bancaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Non esplode: si ferma a <b>2,718281828…</b>, cioè <b>e</b>. Bernoulli non riuscì a calcolarlo, ma
              dimostrò con il binomio di Newton che doveva stare <b>fra 2 e 3</b>. Ed è il primo numero della storia
              definito così: non con un conto che finisce, ma con un <b>dove va a finire</b>.</p>
              <div class="callout key"><b>Ora la seconda banca, quella assurda.</b> Stessa storia, ma l'interesse è
              <b>immaginario</b>: i·θ. Ogni rata moltiplica per (1 + iθ/n), e moltiplicare per un numero complesso
              vuol dire <b>allungare e girare</b> (livello M·3).
              <p class="mb0" style="margin-top:8px">Solo che qui la parte che allunga è quasi zero — la freccia
              1 + iθ/n è lunga √(1 + θ²/n²), cioè poco più di 1 — mentre la parte che gira no. Risultato: <b>il
              capitale non cresce, gira</b>. Con infinite rate finisce esattamente sul cerchio di raggio 1, nel
              punto (cos θ, sin θ).</p></div>
              <div class="formula">lim<sub>n→∞</sub> (1 + iθ/n)<sup>n</sup> = cos θ + i·sin θ = e<sup>iθ</sup></div>
              <p>Ai livelli 14 e M·3 la formula di Eulero è arrivata così: «moltiplicare le frecce somma gli angoli,
              e le potenze fanno la stessa cosa, quindi si scrive come un esponenziale». Vero, ed è una buona
              intuizione — ma è una <b>somiglianza</b>, non una dimostrazione. La dimostrazione è quella riga qui
              sopra, ed è un limite. <b>e<sup>iθ</sup> è una freccia girata di θ perché è lì che quel limite va a
              finire, e non c'è altro posto dove possa andare.</b></p>
              <p class="mb0">C'è anche un dettaglio che il gioco fa notare da solo: più θ è grande, più rate servono
              per la stessa precisione. Tienilo a mente per il prossimo punto.</p>`,
    },

    {
      t: 'A che serve tutto questo, qui dentro',
      html: `<p>Tre debiti che questo livello salda, in ordine di quanto sono grossi.</p>
             <div class="callout key"><b>1. Il costo di ogni misura.</b> Al livello M·7 la domanda era: quanti tiri
             servono per stimare una probabilità con errore ε? Risposta (σ/ε)². Ecco: quello <b>è</b> l'N del gioco
             del corridoio, per la successione σ/√n. Non gli somiglia — è lo stesso numero, e nei test di questo
             livello i due conti sono confrontati direttamente. Quando dici «l'errore tende a zero» stai dicendo
             una cosa vera e inutile; la cosa utile è <b>quanto in fretta</b>, ed è lenta.</div>
             <div class="callout key"><b>2. La formula di Eulero, dimostrata.</b> Quella qui sopra. Da qui in poi,
             ogni volta che nel corso compare e<sup>iθ</sup> — nelle fasi, nella QFT, negli autovalori della stima
             di fase — sai da dove viene.</div>
             <div class="callout key"><b>3. Come si simula un sistema fisico.</b> Questo è un anticipo, ma vale la
             pena vederlo adesso che hai la banca in mente. Un sistema fisico evolve secondo e<sup>iHt</sup>, dove H
             è una matrice (l'energia) e t il tempo. Un computer quantistico non sa applicare quella cosa in un
             colpo solo: sa applicare solo porte semplici. Allora fa <b>esattamente quello che fa la banca</b>:</div>
             <div class="formula">e<sup>iHt</sup> ≈ (1 + iHt/n)<sup>n</sup>, con n grande</div>
             <p>spezza il tempo in n pezzetti e applica n volte una porta che è quasi l'identità. Si chiama
             <b>decomposizione di Trotter</b>, ed è il modo in cui si fa chimica quantistica su una macchina vera.
             E il dettaglio di prima diventa il conto del costo: <b>più lungo è il tempo da simulare, più pezzetti
             servono</b> per la stessa precisione. Nel gioco lo hai visto con θ; lì è con t.</p>
             <div class="callout ok">Tre cose diversissime — quante volte ripetere una misura, perché e<sup>iθ</sup>
             gira, come si simula una molecola — e sotto c'è <b>lo stesso limite</b>.</div>`,
    },

    {
      t: 'Due secoli senza sapere che cos\'è un limite',
      html: `<p>La parte storica di questo argomento è imbarazzante, e vale la pena raccontarla per bene: fa capire
             che la definizione rigorosa non arriva mai <b>prima</b>, arriva dopo, quando i conti hanno già
             funzionato per generazioni.</p>
             <p><b>Archimede</b>, nel III secolo a.C., calcola aree e volumi con il <b>metodo di esaustione</b>:
             inscrive poligoni con sempre più lati e stringe il risultato fra due valori. È un limite in tutto
             tranne che nel nome, e gli mancava solo il permesso di dire «e ora vado all'infinito».</p>
             <p><b>Newton</b> e <b>Leibniz</b>, nel Seicento, inventano il calcolo infinitesimale e ci costruiscono
             sopra la fisica moderna. Parlano di quantità «evanescenti» e di infinitesimi: numeri che sono più
             piccoli di qualunque numero ma non zero. Funziona benissimo e non sta in piedi. Il vescovo
             <b>Berkeley</b>, nel 1734, li prende in giro senza pietà chiamandoli «fantasmi di quantità defunte» —
             e ha ragione lui.</p>
             <p><b>Bernoulli</b>, come hai visto, nel 1683 definisce e con un limite: è la prima volta che un numero
             viene definito da un processo invece che da un conto. <b>Eulero</b> gli dà il nome e nel 1748 pubblica
             e<sup>ix</sup> = cos x + i·sin x, usando serie infinite con una disinvoltura che oggi farebbe bocciare
             chiunque — e sbagliando quasi mai.</p>
             <div class="callout key"><b>La definizione che hai giocato arriva solo nell'Ottocento.</b>
             <b>Bolzano</b> la scrive per primo nel <b>1817</b>, ma pubblica in una rivista praticamente sconosciuta
             e non lo legge nessuno. <b>Cauchy</b>, nel 1821-1823, introduce i simboli ε e δ ma continua a
             ragionare con gli infinitesimi. Ed è <b>Weierstrass</b>, nelle sue lezioni a Berlino intorno al
             <b>1861</b>, a darle la forma definitiva: quella con i due giocatori, il corridoio e l'N.</div>
             <p class="mb0">Fai il conto: dal calcolo di Newton alla definizione di limite passano <b>quasi due
             secoli</b>. Nel frattempo si erano già calcolate le orbite dei pianeti. Se hai avuto la sensazione che
             il gioco del corridoio fosse una pignoleria da matematici, sappi che l'hanno pensato in tanti — finché
             non si è scoperto che senza quella pignoleria certe serie danno risultati diversi a seconda
             dell'ordine in cui le sommi, e allora la faccenda è diventata seria.</p>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel gioco del corridoio, con ε = 0,05: quanto vale l'N per 1/√n? E per (−1)ⁿ/n?
           <span class="muted">(400 contro 20: la prima è venti volte più lenta)</span></p>
        <p><b>2.</b> Verifica a mente la formula: per 1/√n, quando è che 1/√n scende sotto ε?
           <span class="muted">(quando n ≥ 1/ε². Con ε = 0,01 fa 10.000, ed è lo stesso conto del livello M·7)</span></p>
        <p><b>3.</b> Nella banca vera, quante rate servono per arrivare a 0,01 da e?
           <span class="muted">(135: e anche qui l'errore scende come 1/n, quindi il decimale in più costa
           dieci volte le rate)</span></p>
        <p><b>4.</b> Nella banca immaginaria metti θ = 180°. La freccia dove dovrebbe finire?
           <span class="muted">(su −1: è e^(iπ) = −1, il regalo di Eulero del livello M·3 — e adesso lo hai
           dimostrato)</span></p>
        <p class="mb0"><b>5.</b> Da inventore: con θ = 180° prova a portare l'errore sotto 0,02 alzando le rate al
           massimo. Ci riesci? <span class="muted">(no: il gioco arriva a 200 rate e ne servirebbero 250. Il giro è largo il
           doppio e le rate servono in proporzione — è esattamente il costo della decomposizione di Trotter)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cosa vuol dire che una successione «tende a L»?', options: ['che prima o poi vale esattamente L', 'che per ogni corridoio ±ε attorno a L esiste un N da cui in poi la successione ci resta dentro', 'che si avvicina sempre di più senza mai fermarsi', 'che i suoi termini diventano piccoli'], correct: 1,
      why: 'Non si dice mai «ci arriva»: 1 + 1/2ⁿ non vale mai 1, eppure tende a 1. La definizione è il gioco: tu stringi il corridoio, io trovo l\'N, per ogni corridoio possibile.' },
    { q: 'Per la successione 1/√n, quanto vale l\'N che vince il corridoio ±ε?', options: ['1/ε', '1/ε², cioè lo stesso numero di tiri del livello M·7', '√ε', 'non esiste'], correct: 1,
      why: '1/√n ≤ ε quando n ≥ 1/ε². È lo stesso conto che al livello M·7 dice quanti tiri servono per stimare una probabilità con quell\'errore: la definizione di limite e il costo di una misura sono la stessa cosa.' },
    { q: 'La probabilità di Grover, al crescere del numero di giri, tende a 1?', options: ['sì, sempre più vicino a 1', 'no: oscilla, e dopo il giro ottimale ridiscende', 'sì, ma solo con molti qubit', 'tende a 1/2'], correct: 1,
      why: 'È una successione che non converge. Per questo Grover ha un numero preciso di giri: continuare a girare peggiora, e questa è la parola giusta per dirlo.' },
    { q: 'Da dove nasce il numero e?', options: ['dalla lunghezza di una circonferenza', 'dal limite di (1 + 1/n)ⁿ, cioè da un interesse del 100% spezzato in infinite rate', 'da una radice quadrata', 'è stato scelto a caso da Eulero'], correct: 1,
      why: 'Jakob Bernoulli, 1683, problema di interesse composto. È il primo numero della storia definito da un limite invece che da un conto che finisce, e lui riuscì a incastrarlo solo fra 2 e 3.' },
    { q: 'Perché e^(iθ) è una freccia lunga 1?', options: ['per convenzione', 'perché il limite di (1 + iθ/n)ⁿ ha lunghezza (1 + θ²/n²)^(n/2), che tende a 1: l\'interesse immaginario non fa crescere il capitale, lo fa girare', 'perché θ è un angolo', 'perché i vale √(−1)'], correct: 1,
      why: 'Ogni rata moltiplica per 1 + iθ/n, che è lunga poco più di 1 e gira di poco. Elevando alla n, i giri si sommano e gli allungamenti spariscono: si finisce esattamente sul cerchio, in (cos θ, sin θ).' },
    { q: 'Che cosa c\'entra la banca di Bernoulli con la simulazione di una molecola?', options: ['niente, è solo una storia', 'e^(iHt) si calcola come (1 + iHt/n)ⁿ: si spezza il tempo in n pezzetti, come le rate. È la decomposizione di Trotter', 'perché servono soldi per costruire i computer quantistici', 'perché le molecole crescono in modo esponenziale'], correct: 1,
      why: 'Una macchina quantistica sa applicare solo porte semplici, non e^(iHt) in un colpo. Lo spezza in n passi quasi-identici, esattamente come le rate — e più lungo è il tempo da simulare, più passi servono.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> «Tende a» adesso è un gioco con regole precise: tu stringi il
          corridoio, io trovo l'N. Da lì cadono tre cose che il corso usava a credito: quanti tiri servono per una
          misura (è l'N di 1/√n), perché e^(iθ) gira invece di crescere (è la banca con l'interesse immaginario) e
          come si simula un sistema fisico spezzando il tempo in pezzetti. E un premio: la prossima volta che
          qualcuno dice «tende a zero», puoi chiedere <b>quanto in fretta</b> — che è sempre la domanda che
          conta.</div>`,
});
@endsection
