@php($description = 'Il prodotto scalare spiegato come «quanto due frecce si somigliano»: le due formule, l\'ortogonalità come distinguibilità e la misura quantistica come proiezione. Con la storia di Gibbs, Heaviside e la notazione di Dirac.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { scalareLab, ombraLab } from '/js/widgets/scalare.js';

const L = renderLesson({
  id: '00-scalare',
  lead: `In tutta la letteratura quantistica c'è un simbolo che compare più di ogni altro: <b>⟨φ|ψ⟩</b>. Sembra
         geroglifico e invece è una cosa che sai già fare a occhio: <b>quanto due frecce vanno nella stessa
         direzione</b>. Un numero solo. Da quel numero escono, senza aggiungere altro, l'ortogonalità, la lunghezza,
         la distanza fra due stati e — la cosa grossa — <b>la regola con cui si calcolano le probabilità
         quantistiche</b>.`,

  steps: [
    {
      t: 'Un numero solo per dire «quanto vanno d\'accordo»',
      html: `<p>Prendi due frecce. Vorresti un numero che dica se puntano dalla stessa parte, se sono perpendicolari,
             o se vanno in versi opposti. Quel numero c'è, si chiama <b>prodotto scalare</b>, e si calcola così:</p>
             <div class="formula">a · b = a<sub>x</sub>·b<sub>x</sub> + a<sub>y</sub>·b<sub>y</sub></div>
             <p>Si moltiplicano le coordinate a due a due e si somma. Tutto qui. E il risultato dice esattamente
             quello che volevamo:</p>
             <ul>
               <li><b>grande e positivo</b> → le frecce puntano più o meno dalla stessa parte;</li>
               <li><b>zero</b> → sono <b>perpendicolari</b>: non si somigliano per niente;</li>
               <li><b>negativo</b> → puntano in versi opposti.</li>
             </ul>
             <p>Nel gioco trascina le due punte e guarda il numero muoversi. Cerca lo zero: è il caso che conta.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'scalare', title: 'Zero, massimo, negativo', text: 'centra le 3 sfide muovendo le due frecce.', xp: 40 });
        el.appendChild(m.root);
        scalareLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Il gioco mostra anche l'altra faccia dello stesso numero:</p>
              <div class="formula">a · b = |a| · |b| · cos(angolo fra le due)</div>
              <p>Le due formule danno <b>sempre</b> lo stesso risultato: la prima si calcola in fretta, la seconda si
              capisce. E spiega perché lo zero cade sui 90°: il coseno di 90° è zero (livello 0·3, il punto che gira:
              in cima, l'ombra orizzontale è nulla).</p>
              <div class="callout key"><b>Un po' di storia.</b> Questa notazione non è antica: nasce negli anni Ottanta
              dell'Ottocento, quando <b>Josiah Willard Gibbs</b> e <b>Oliver Heaviside</b> presero il prodotto fra
              quaternioni di Hamilton — un oggetto ingombrante — e lo spezzarono in due pezzi più utili: uno che
              restituisce un numero (questo, il prodotto <i>scalare</i>) e uno che restituisce una freccia (il prodotto
              vettoriale). Il calcolo vettoriale che si studia oggi è quel taglio, fatto per far tornare i conti
              dell'elettromagnetismo.</div>`,
    },

    {
      t: "L'ombra: la parte di una freccia che va in una certa direzione",
      html: `<p>C'è un modo di leggere il prodotto scalare che vale più della formula. Prendi una direzione (una
             freccia <b>lunga 1</b>) e chiediti: <b>quanto della mia freccia va in quella direzione?</b></p>
             <p>La risposta è la sua <b>ombra</b> su quella direzione — e l'ombra è esattamente il prodotto scalare
             con quella direzione.</p>
             <div class="callout key">È la stessa ombra del livello 0·3: seno e coseno erano le due ombre di un punto
             che gira, sul muro e sul pavimento. Adesso hanno un nome generale: <b>proiezione</b>.</div>
             <p>Due conseguenze immediate, e vale la pena fermarcisi:</p>
             <ul>
               <li>l'ombra di una freccia <b>su sé stessa</b> è la sua lunghezza: da qui <b>|a|² = a · a</b>, che è
                   Pitagora scritto in un altro modo;</li>
               <li>la <b>distanza</b> fra due frecce è la lunghezza della loro differenza — quanto sono lontane le
                   punte. Nel quantistico serve a dire quanto due stati si somigliano.</li>
             </ul>`,
      mount: el => {
        stepper(el, [
          { h: 'La domanda', html: 'Ho la freccia (3, 4) e la direzione orizzontale (1, 0). Quanto della mia freccia va in orizzontale?' },
          { h: 'Il conto', html: '(3, 4) · (1, 0) = 3·1 + 4·0 = <b>3</b>. È la coordinata x — cioè: le coordinate <b>sono già</b> delle ombre, sulle due direzioni di base.' },
          { h: 'La lunghezza', html: '(3, 4) · (3, 4) = 9 + 16 = 25, e la lunghezza è √25 = <b>5</b>. Il prodotto scalare con sé stessa dà il quadrato della lunghezza: è il teorema di Pitagora, scritto con un puntino.' },
          { h: 'La distanza', html: 'Fra (3, 4) e (0, 4) la differenza è (3, 0), lunga <b>3</b>. Distanza = lunghezza della differenza: sempre lo stesso attrezzo.' },
          { h: 'Perché ci servirà', html: 'Nel quantistico l\'<b>ampiezza</b> di un risultato è l\'ombra dello stato sulla direzione di quel risultato, e la <b>fedeltà</b> fra due stati (quanto si somigliano) è il loro prodotto scalare al quadrato.' },
        ], { doneLabel: 'Chiaro!' });
      },
    },

    {
      t: 'La misura quantistica è un\'ombra (e la sua regola è Pitagora)',
      html: `<p>Adesso il pezzo grosso. Uno stato quantistico è una freccia <b>lunga 1</b>. Misurarlo vuol dire
             scegliere <b>due direzioni perpendicolari</b> — una per ogni risultato possibile — e guardare le due
             ombre dello stato su quelle direzioni.</p>
             <ul>
               <li>le due ombre sono le <b>ampiezze</b>;</li>
               <li>i loro <b>quadrati</b> sono le probabilità dei due risultati;</li>
               <li>e i due quadrati fanno sempre <b>1</b>, perché le direzioni sono perpendicolari e vale Pitagora.</li>
             </ul>
             <div class="callout key">Rileggi l'ultima riga: <b>«le probabilità fanno sempre il 100%» non è una regola
             imposta, è il teorema di Pitagora</b>. Nel gioco puoi girare lo stato e girare la base quanto vuoi: quella
             somma non si muove.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'ombra', title: 'Certezza, certezza, metà e metà', text: 'centra le 3 configurazioni girando lo stato e la base.', xp: 50 });
        el.appendChild(m.root);
        ombraLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>E ora la frase che nel corso torna in continuazione: <b>|0⟩ e |1⟩ sono ortogonali</b>. Vuol dire che
              il loro prodotto scalare è zero, cioè che <b>non si somigliano per niente</b>, cioè che si possono
              distinguere <b>con certezza</b>: se lo stato è esattamente su una delle due direzioni, l'ombra sull'altra
              è nulla e quel risultato non esce mai.</p>
              <p>Due stati <b>non</b> ortogonali, invece, non si possono distinguere con certezza da una misura sola.
              È un limite di fisica, non di tecnologia — ed è il motivo per cui la crittografia quantistica funziona:
              chi origlia deve indovinare la base, e sbagliando lascia tracce.</p>
              <div class="callout key"><b>Un po' di storia.</b> Il simbolo ⟨φ|ψ⟩ lo inventò <b>Paul Dirac</b> nel 1939:
              prese la parola inglese <i>bracket</i> (parentesi) e la tagliò in due, <i>bra</i> ⟨φ| e <i>ket</i> |ψ⟩.
              Un gioco di parole diventato la notazione standard della fisica, per il motivo migliore: quel simbolo
              <b>è</b> il prodotto scalare, e ricorda a chi scrive che dentro c'è una domanda — «quanto questo stato
              somiglia a quello?».</div>`,
    },

    {
      t: 'Il riassunto in una formula sola',
      html: ``,
      mount: el => {
        formula(el, {
          title: 'Il prodotto scalare e i suoi quattro mestieri',
          hint: 'Tocca i pezzi: è sempre lo stesso conto, con quattro nomi diversi.',
          parts: [
            { t: 'a · b', id: 'p', color: 'cyan', name: 'quanto si somigliano', say: 'Un numero: grande se puntano insieme, zero se perpendicolari, negativo se opposte.', ex: '(1,0) · (0,1) = 0 → perpendicolari.' },
            { t: '|a|² = a · a', id: 'l', color: 'green', name: 'la lunghezza', say: 'Il prodotto scalare di una freccia con sé stessa è il quadrato della sua lunghezza. È Pitagora.', ex: '(3,4) · (3,4) = 25 → lunghezza 5.' },
            { t: 'ombra = ψ · d', id: 'o', color: 'amber', name: "l'ampiezza", say: 'Con d direzione lunga 1: quanto dello stato va in quella direzione. Nel quantistico si chiama ampiezza.', ex: 'Stato a 45°, direzione orizzontale → ombra 0,707.' },
            { t: 'ombra² = probabilità', id: 'b', color: 'pink', name: 'la regola di Born', say: 'La probabilità di quel risultato è l\'ombra al quadrato. E la somma dei quadrati fa 1 per Pitagora.', ex: '0,707² = 0,5 → 50%.' },
          ],
        });
      },
      after: `<div class="callout ok">Quattro cose che sembravano diverse — somiglianza, lunghezza, ampiezza,
              probabilità — sono lo stesso conto guardato da quattro lati. Quando incontrerai ⟨φ|ψ⟩ saprai
              esattamente cosa stai leggendo.</div>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel primo gioco, allunga una delle due frecce senza girarla: il prodotto scalare cambia? E
           l'angolo? <span class="muted">(il prodotto sì, l'angolo no: sono due informazioni diverse)</span></p>
        <p><b>2.</b> Due frecce lunghe 1 con prodotto scalare 0,5: che angolo c'è fra loro?
           <span class="muted">(indizio: cos di quanto fa 0,5?)</span></p>
        <p><b>3.</b> Nel secondo gioco metti la base a 45° e lo stato a 0°: che probabilità escono? E dove l'hai già
           visto quel numero? <span class="muted">(0,707² = 0,5: è la porta H)</span></p>
        <p class="mb0"><b>4.</b> Da inventore: se due stati quantistici <b>non</b> sono ortogonali, nessuna misura può
           distinguerli con certezza. Prova a spiegarti perché guardando le ombre — e poi pensa a cosa vuol dire per
           qualcuno che voglia spiare una comunicazione quantistica.</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cosa dice il prodotto scalare di due frecce?', options: ['la loro lunghezza totale', 'quanto puntano nella stessa direzione', 'l\'area fra le due', 'la loro somma'], correct: 1,
      why: 'È un numero solo: grande e positivo se vanno insieme, zero se sono perpendicolari, negativo se opposte. Si calcola moltiplicando le coordinate a due a due e sommando.' },
    { q: 'Il prodotto scalare fra (1, 0) e (0, 1) quanto fa?', options: ['1', '0', '2', '−1'], correct: 1,
      why: '1·0 + 0·1 = 0. Zero significa perpendicolari: nel quantistico è la condizione che rende due stati distinguibili con certezza.' },
    { q: 'Che cos\'è l\'ampiezza di un risultato, geometricamente?', options: ['la lunghezza dello stato', 'l\'ombra (proiezione) dello stato sulla direzione di quel risultato', 'l\'angolo dello stato', 'la distanza dall\'origine'], correct: 1,
      why: 'È il prodotto scalare fra lo stato e la direzione del risultato: quanto dello stato va in quella direzione. La probabilità è quell\'ombra al quadrato.' },
    { q: 'Perché le probabilità di una misura fanno sempre 100%?', options: ['per convenzione', 'perché le direzioni della base sono perpendicolari e vale il teorema di Pitagora', 'perché si normalizzano dopo', 'perché lo stato è complesso'], correct: 1,
      why: 'Lo stato è lungo 1 e le due direzioni sono perpendicolari: la somma dei quadrati delle ombre è il quadrato della lunghezza, cioè 1. Non è una regola imposta, è geometria.' },
    { q: 'Due stati NON ortogonali si possono distinguere con certezza da una misura?', options: ['sì, sempre', 'no, mai con certezza', 'solo se sono lunghi 1', 'solo con più qubit'], correct: 1,
      why: 'Se non sono perpendicolari, ognuno ha un\'ombra non nulla anche sulla direzione dell\'altro: qualunque misura può sbagliare. È un limite fisico, ed è la base della crittografia quantistica.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> Un numero che dice quanto due frecce si somigliano, e da lì: lunghezza,
          distanza, ampiezza, probabilità. La prossima volta che leggerai ⟨φ|ψ⟩ non vedrai un geroglifico, vedrai
          un'ombra.</div>`,
});
@endsection
