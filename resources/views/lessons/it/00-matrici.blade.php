@php($description = 'Le matrici 2×2 spiegate senza algebra: una macchina che prende una freccia e ne restituisce un\'altra. Le colonne come destinazioni, il prodotto come composizione, e la scoperta che X, Z e H sono matrici unitarie.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { matrixLab, gatePuzzle } from '/js/widgets/matrici.js';

const L = renderLesson({
  id: '00-matrici',
  lead: `«Matrice» è una parola che spaventa e non dovrebbe: una matrice 2×2 è <b>una tabella di quattro numeri</b>,
         e quello che fa è una cosa sola — <b>prende una freccia e ne restituisce un'altra</b>. Da qui in poi, nel
         corso, ogni porta quantistica sarà una di queste tabelle. Impararle adesso, giocando, costa venti minuti;
         incontrarle per la prima volta dentro la trasformata di Fourier quantistica costa molto di più.`,

  steps: [
    {
      t: 'Una macchina che sposta le frecce',
      html: `<p>Immagina una macchina con <b>quattro manopole</b>. Ci infili una freccia, e ne esce un'altra freccia:
             magari più lunga, magari girata, magari ribaltata.</p>
             <p>Per sapere <b>tutto</b> di questa macchina non serve provarla con infinite frecce. Bastano due prove:</p>
             <ul>
               <li>dove va a finire la freccia <b>rossa</b>, quella che va a destra di un passo: <b>(1, 0)</b>;</li>
               <li>dove va a finire la freccia <b>verde</b>, quella che va in su di un passo: <b>(0, 1)</b>.</li>
             </ul>
             <p>Perché? Perché ogni altra freccia è fatta di quelle due. La freccia (3, 2) è «tre passi a destra e due in su»:
             se sai dove finiscono i passi, sai dove finisce lei.</p>
             <div class="callout key">Nel gioco qui sotto le frecce tratteggiate dicono <b>dove devono arrivare</b>.
             Gira le manopole finché le frecce piene non ci finiscono sopra. Guarda anche il rettangolo azzurro: non
             stai spostando due frecce, stai spostando <b>tutto il piano</b>.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'manopole', title: 'Tre macchine su ordinazione', text: 'centra 3 sfide diverse girando le manopole.', xp: 35 });
        el.appendChild(m.root);
        matrixLab(el, { need: 3, onWin: () => m.complete() });
      },
    },

    {
      t: 'Le colonne sono le destinazioni',
      html: `<p>Adesso guarda i quattro numeri che hai girato, scritti in tabella:</p>
             <div class="formula">[ <span class="hl-n">a</span> &nbsp; <span class="hl-N">b</span> ]<br>
                                  [ <span class="hl-n">c</span> &nbsp; <span class="hl-N">d</span> ]</div>
             <p>La <b>prima colonna</b> (a, c) è esattamente il posto dove finisce la freccia rossa. La <b>seconda
             colonna</b> (b, d) è il posto dove finisce la verde. Non è una regola da imparare: è quello che hai appena
             visto succedere sullo schermo.</p>
             <p>E il conto per una freccia qualunque viene da sé:</p>`,
      mount: el => {
        formula(el, {
          title: 'Matrice per freccia, pezzo per pezzo',
          parts: [
            { t: '[a b; c d]', id: 'm', color: 'cyan', name: 'la macchina', say: 'I quattro numeri: la prima colonna dice dove finisce (1,0), la seconda dove finisce (0,1).', ex: 'Per la porta X: [0 1; 1 0] — la rossa finisce in alto, la verde a destra: si scambiano.' },
            { t: '·' },
            { t: '(x, y)', id: 'v', color: 'amber', name: 'la freccia in entrata', say: 'x passi a destra e y passi in su.', ex: '(3, 2) vuol dire tre passi di rossa più due di verde.' },
            { t: '=' },
            { t: '(a·x + b·y', id: 'r1', color: 'green', name: 'la prima coordinata del risultato', say: 'Quanto ti sposti in orizzontale: il contributo della rossa più quello della verde.', ex: 'Con [2 0; 0 3] e (3, 2): 2·3 + 0·2 = 6.' },
            { t: ',' },
            { t: 'c·x + d·y)', id: 'r2', color: 'pink', name: 'la seconda coordinata del risultato', say: "Quanto ti sposti in verticale, con lo stesso ragionamento.", ex: 'Con [2 0; 0 3] e (3, 2): 0·3 + 3·2 = 6.' },
          ],
        });
      },
      after: `<div class="callout key">Due macchine di fila fanno ancora una macchina sola, e la sua tabella si chiama
              <b>prodotto</b> delle due. Attenzione all'ordine: prima la camicia e poi la giacca non è come prima la
              giacca e poi la camicia. In matematica si dice che il prodotto <b>non è commutativo</b>, e nel prossimo
              gioco lo tocchi con mano.</div>`,
    },

    {
      t: 'Le porte quantistiche sono matrici',
      html: `<p>Ecco le tre porte che incontrerai in tutto il corso, scritte come sono davvero:</p>
             <table class="table">
               <tr><th>Porta</th><th>Tabella</th><th>Che cosa fa</th></tr>
               <tr><td class="mono">X</td><td class="mono">[0 1 ; 1 0]</td><td>scambia |0⟩ e |1⟩: è il NOT quantistico</td></tr>
               <tr><td class="mono">Z</td><td class="mono">[1 0 ; 0 −1]</td><td>lascia |0⟩ com'è e cambia il segno a |1⟩</td></tr>
               <tr><td class="mono">H</td><td class="mono">[0,71 &nbsp;0,71 ; 0,71 &nbsp;−0,71]</td><td>crea la sovrapposizione a metà — quel 0,71 è 1/√2</td></tr>
             </table>
             <p>Lo stato di un qubit, per adesso, è una freccia con due numeri: <b>quanto pesa |0⟩</b> e <b>quanto pesa |1⟩</b>.
             Applicare una porta vuol dire far passare quella freccia dentro la macchina.</p>
             <div class="callout key">Nel gioco c'è un <b>cerchio tratteggiato</b>. Premi tutte le porte che vuoi, in
             qualunque ordine: <b>la punta della freccia non esce mai dal cerchio</b>. Tienilo d'occhio, perché è la
             cosa più importante di questo livello.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'puzzle', title: 'Due bersagli, tre porte', text: 'risolvi 2 puzzle componendo X, Z e H.', xp: 45 });
        el.appendChild(m.root);
        gatePuzzle(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Se hai risolto il primo puzzle con <b>H, poi Z, poi H</b>, hai appena scoperto da solo una cosa vera e
              famosa: quelle tre porte di fila fanno esattamente quello che fa la X.</p>
              <div class="formula">H · Z · H = X</div>
              <p>Non è un trucco da manuale: è il prodotto di tre tabelle che dà una quarta tabella. E tornerà in tutto
              il corso, perché è il modo standard di trasformare un «cambio di segno» in un «cambio di risposta».</p>`,
    },

    {
      t: 'Perché la lunghezza non cambia mai',
      html: `<p>Le macchine che <b>non allungano e non accorciano niente</b> hanno un nome: si chiamano <b>unitarie</b>.
             X, Z e H lo sono; una macchina che raddoppia tutto, no.</p>
             <p>Nel gioco delle manopole te lo scrive sotto: prova a mettere <span class="mono">a = 2</span> e guarda il
             messaggio cambiare. E adesso il punto:</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Il fatto di partenza', html: 'La probabilità di leggere un risultato è il <b>quadrato</b> della sua ampiezza (livello 0·1: 0,71² ≈ 0,5).' },
          { h: 'La somma delle probabilità', html: 'Le probabilità di tutti i risultati devono fare <b>100%</b>. Sempre. Un qubit che desse 40% e 30% non vorrebbe dire niente.' },
          { h: 'Che cosa vuol dire per la freccia', html: 'Somma dei quadrati = 1 è Pitagora: vuol dire che la freccia dello stato è <b>lunga esattamente 1</b>. Ecco perché nel gioco sta sul cerchio.' },
          { h: 'La conclusione', html: 'Una porta può girare la freccia, ribaltarla, mescolarla — ma <b>non può cambiarne la lunghezza</b>, altrimenti le probabilità smetterebbero di fare 100%. Ecco perché ogni porta quantistica è unitaria.' },
          { h: 'Una conseguenza gratis', html: 'Una macchina che non schiaccia niente si può sempre <b>tornare indietro</b>: nessuna informazione è andata persa. È la reversibilità del livello K·6, ritrovata da un\'altra strada.' },
        ], { doneLabel: 'Chiaro!' });
      },
      after: `<div class="callout ok">Da adesso «porta quantistica» e «matrice unitaria 2×2» sono per te la stessa cosa,
              e il cerchio del gioco è il motivo. È la definizione che troverai in qualunque libro — solo che tu ci sei
              arrivato premendo dei bottoni.</div>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel gioco delle manopole, che tabella serve per <b>schiacciare tutto sull'asse orizzontale</b>?
           È unitaria? Che cosa succederebbe alle probabilità di un qubit?</p>
        <p><b>2.</b> Applica <b>X e poi Z</b>, e poi ricomincia con <b>Z e poi X</b>. La freccia finisce nello stesso
           punto? <span class="muted">(risposta: quasi — cambia un segno, e quel segno nel quantistico si vede eccome)</span></p>
        <p><b>3.</b> Premi <b>H due volte</b> di fila partendo da |0⟩. Dove torni? Sai dire cosa vale H·H?</p>
        <p class="mb0"><b>4.</b> Da inventore: la porta che rota di 90° che hai costruito nel primo gioco è unitaria?
           Se sì, potrebbe essere una porta quantistica vera — e infatti lo è: nel corso si chiama rotazione, e la
           incontrerai sulla sfera di Bloch.</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cosa dicono le due colonne di una matrice 2×2?', options: ['due numeri a caso', 'dove finiscono le due frecce di base', 'la lunghezza della freccia', 'la probabilità del risultato'], correct: 1,
      why: 'La prima colonna è il posto dove finisce (1, 0), la seconda dove finisce (0, 1). Sapendo quelle due destinazioni si sa dove finisce qualunque freccia.' },
    { q: 'La matrice [0 1 ; 1 0] applicata alla freccia (1, 0) dà…', options: ['(1, 0)', '(0, 1)', '(1, 1)', '(0, 0)'], correct: 1,
      why: 'La prima colonna è (0, 1): la freccia che andava a destra finisce in alto. È la porta X, il NOT quantistico.' },
    { q: 'Perché ogni porta quantistica deve essere unitaria?', options: ['per tradizione', 'perché altrimenti le probabilità non farebbero più 100%', 'per andare più veloce', 'per risparmiare qubit'], correct: 1,
      why: 'La probabilità è il quadrato dell\'ampiezza: se la lunghezza della freccia cambiasse, la somma delle probabilità non farebbe più 1. Unitaria significa esattamente "non cambia le lunghezze".' },
    { q: 'Due porte applicate una dopo l\'altra…', options: ['non si possono combinare', 'equivalgono a una sola matrice, il loro prodotto', 'si annullano sempre', 'raddoppiano la lunghezza'], correct: 1,
      why: 'Comporre due macchine dà ancora una macchina: la sua tabella è il prodotto delle due, e l\'ordine conta.' },
    { q: 'Che cosa fa H · Z · H?', options: ['niente, è l\'identità', 'la stessa cosa della porta X', 'raddoppia l\'ampiezza', 'misura il qubit'], correct: 1,
      why: 'È il risultato che si scopre giocando col puzzle: le tre porte di fila danno esattamente la matrice X. Trasformare un cambio di segno in un cambio di risposta è una mossa che tornerà in tutti gli algoritmi.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> Una matrice è una macchina, le colonne sono le destinazioni, il prodotto
          è "una dopo l'altra" e unitaria vuol dire "non cambia le lunghezze". Con questi quattro fatti in tasca, le
          porte del corso smettono di essere simboli da ricordare e diventano tabelle che sai leggere.</div>`,
});
@endsection
