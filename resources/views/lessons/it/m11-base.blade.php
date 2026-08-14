@php($description = 'Cambio di base spiegato giocando: misurare è proiettare, lo stesso stato è casuale con un righello e certo con un altro, la porta di Hadamard è il cambio di righello scritto come matrice, e nella base degli autovettori una matrice diventa una pura stiratura — la scorciatoia su cui è costruita la stima di fase.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { cambioBaseLab, diagonaleLab } from '/js/widgets/base.js';

const L = renderLesson({
  id: 'm11-base',
  lead: `C'è una frase che in questo corso ricorre dal livello 1: «lo stesso stato è casuale se lo misuri in un modo
         e certo se lo misuri in un altro». Suona come un paradosso, e invece è una banalità di geometria — la
         stessa per cui la tua altezza in centimetri e in pollici sono due numeri diversi per la stessa persona.
         Qui si vede, si tocca, e si scopre che la <b>porta di Hadamard</b> non è una porta misteriosa: è
         letteralmente il cambio di righello.`,

  steps: [
    {
      t: 'Due righelli, una freccia sola',
      html: `<p>Al livello M·4 una <b>base</b> è arrivata come «poche frecce che raggiungono tutto». Prendiamola sul
             serio: una base è un <b>righello</b>, cioè un modo di dare le coordinate.</p>
             <p>Nel piano ci sono infinite basi ortonormali: basta girare i due assi tutti insieme. La freccia non
             si muove — cambiano i due numeri con cui la descrivi.</p>
             <div class="callout key"><b>E adesso il pezzo quantistico.</b> Misurare uno stato vuol dire
             <b>proiettarlo</b> sugli assi di un righello, e la probabilità di ciascun risultato è il
             <b>quadrato</b> della proiezione. Questa è la regola di Born, ed è tutto quello che c'è.</div>
             <p>Nel gioco: scegli uno stato, gira il righello e guarda le due frecce colorate — sono le proiezioni,
             cioè le due possibili risposte della misura. Prova a rendere la misura <b>certa</b>, e poi a renderla
             <b>testa o croce</b>.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'base', title: 'Certo e casuale, con la stessa freccia', text: 'trova un righello che rende la misura certa, e uno che la rende 50 e 50.', xp: 55 });
        el.appendChild(m.root);
        cambioBaseLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Ecco il punto, e vale la pena leggerlo due volte: <b>non è cambiato lo stato, è cambiato il
              righello</b>. La stessa identica freccia dà una risposta certa con un righello e una moneta con un
              altro.</p>
              <div class="callout key"><b>Da qui in poi «casuale» va detto meglio.</b> Non esiste «uno stato
              casuale»: esiste uno stato <b>obliquo rispetto al righello che stai usando</b>. Il caso non è nello
              stato, è nel rapporto fra lo stato e la domanda che gli fai.</div>
              <p class="mb0">E c'è un corollario che spiega mezzo corso: se metti il righello a 45° rispetto a
              |0⟩ ottieni 50 e 50. Cioè: <b>far diventare un qubit «in sovrapposizione» è girare di 45°</b>. Nulla
              di più esotico.</p>`,
    },

    {
      t: 'La porta di Hadamard, smontata',
      html: `<p>A questo punto la porta H del livello 3 si può smontare e guardare dentro. È questa matrice:</p>
             <div class="formula">H = 1/√2 · [ 1 &nbsp; 1 ; &nbsp;1 &nbsp; −1 ]</div>
             <p>e fa esattamente una cosa: <b>riscrive lo stato nel righello a 45°</b>.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Che cosa fa a |0⟩', html: 'Lo manda in (1, 1)/√2, cioè <b>|+⟩</b>. Nel righello dritto quello stato è 50 e 50 — ecco «la sovrapposizione».' },
          { h: 'Che cosa fa a |1⟩', html: 'Lo manda in (1, −1)/√2, cioè <b>|−⟩</b>. Anche questo è 50 e 50 lungo Z, ma è uno stato <b>diverso</b> da |+⟩: il segno conta, ed è la fase del livello 14.' },
          { h: 'Perché applicandola due volte non succede niente', html: 'Perché cambiare righello e poi ricambiarlo allo stesso modo ti riporta al punto di partenza: <b>H·H = identità</b>. È il motivo per cui negli algoritmi le H vanno sempre a coppie, una all\'andata e una al ritorno.' },
          { h: 'Perché la misura poi cambia', html: 'Il trucco degli algoritmi quantistici è tutto qui: <b>non cambiano il righello dell\'apparecchio</b> — quello misura sempre lungo Z — ma girano lo stato in modo che, letto lungo Z, dia la risposta giusta. Deutsch, Bernstein-Vazirani, Grover: tutti fanno questo.' },
          { h: 'Il conto che lo dimostra', html: 'I test di questo livello verificano che i due numeri che H tira fuori, <b>al quadrato</b>, siano esattamente le probabilità di misurare nella base a 45° calcolate per proiezione. Le due strade danno lo stesso numero su ogni stato del gioco.' },
          { h: 'Un dettaglio onesto', html: 'H ha determinante <b>−1</b>: non è una rotazione, è uno <b>specchio</b>. Gira il righello di 45° e poi ribalta il secondo asse. Per le probabilità non cambia niente — sono quadrati — ma è giusto saperlo.' },
        ], { doneLabel: 'Ora torna!' });
      },
      after: `<div class="callout ok"><b>Da portarsi via:</b> una porta quantistica non «fa succedere qualcosa di
              strano allo stato». Gira lo stato, o gira il modo di leggerlo. Tutto il resto è conseguenza.</div>`,
    },

    {
      t: 'La base in cui la macchina si semplifica',
      html: `<p>Seconda metà del livello, e serve per il livello successivo. Anche una <b>matrice</b> — cioè una
             macchina che trasforma frecce, come al livello 0·6 — si può guardare da righelli diversi. E i suoi
             numeri cambiano.</p>
             <div class="formula">stessa macchina, altro righello: <b>A′ = P⁻¹ · A · P</b></div>
             <p>Adesso la domanda che vale il livello: <b>esiste un righello in cui la macchina diventa
             semplice?</b> Semplice vuol dire <b>diagonale</b>: niente numeri fuori dalla diagonale, cioè nessun
             mescolamento fra le due direzioni. La macchina si limita ad allungare il primo asse di un numero e il
             secondo di un altro.</p>
             <p>Nel gioco: gira il righello e guarda i quattro numeri a destra. Quando i due fuori diagonale
             diventano zero — e le frecce verde e rosa escono <b>dritte</b> invece che storte — ci sei.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'diagonale', title: 'Due macchine domate', text: 'trova la base che le rende diagonali.', xp: 60 });
        el.appendChild(m.root);
        diagonaleLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Le direzioni che escono dritte hanno un nome che conosci: sono gli <b>autovettori</b> del livello
              18·b, e i due numeri sulla diagonale sono gli <b>autovalori</b>. Al livello 18·b li hai trovati; qui
              vedi <b>a che servono</b>.</p>
              <div class="callout key"><b>Il regalo.</b> Nella base giusta, applicare la macchina mille volte vuol
              dire elevare <b>due numeri</b> alla millesima. Fuori da quella base vorrebbe dire moltiplicare mille
              matrici.
              <p class="mb0" style="margin-top:8px"><b>A<sup>n</sup> = P · D<sup>n</sup> · P⁻¹</b>, e D<sup>n</sup>
              è solo la diagonale elevata a n.</p></div>
              <p>I test lo verificano confrontando le due strade: A elevato alla trentesima calcolato a forza bruta
              e calcolato con la scorciatoia danno lo stesso identico risultato, su tutte le macchine del gioco.</p>
              <div class="callout ok"><b>E qui si capisce la stima di fase.</b> Al livello 19 il circuito applica
              una porta <b>2, 4, 8, 16… volte</b>. Se dovesse farlo moltiplicando matrici sarebbe un disastro. Ma
              nella base degli autovettori quella porta è solo «moltiplica per e^(iθ)», e applicarla 2^k volte
              diventa «moltiplica per e^(i·2^k·θ)». Tutto l'algoritmo di Shor sta in piedi su questo.</div>
              <p class="mb0">Due cose che il cambio di base <b>non</b> tocca, e i test lo controllano: la
              <b>traccia</b> (la somma della diagonale) e il <b>determinante</b>. Sono quello che la macchina «è»,
              indipendentemente da chi la guarda — ed è il motivo per cui compaiono in tutte le formule.</p>`,
    },

    {
      t: 'Due teorie che erano la stessa, e nessuno se ne accorgeva',
      html: `<p>La storia di questo livello è la più bella della meccanica quantistica, e parla esattamente di
             cambi di base.</p>
             <p>Nel <b>1925</b> <b>Werner Heisenberg</b>, ventitreenne, in cura per il raffreddore da fieno
             sull'isola di Helgoland, costruisce una teoria dell'atomo fatta di <b>tabelle di numeri</b> che si
             moltiplicano in modo strano — l'ordine conta, A·B ≠ B·A. Born e Jordan riconoscono che quelle tabelle
             sono <b>matrici</b>, che i matematici conoscevano da settant'anni ma che i fisici non usavano. Nasce
             la <b>meccanica delle matrici</b>: astratta, algebrica, senza nessuna immagine.</p>
             <p>Pochi mesi dopo, nel <b>1926</b>, <b>Erwin Schrödinger</b> pubblica una teoria completamente
             diversa: niente tabelle, ma un'<b>onda</b> che si propaga nello spazio, con un'equazione
             differenziale. È intuitiva, si disegna, e i fisici tirano un sospiro di sollievo.</p>
             <div class="callout warn">Le due teorie sembrano non avere <b>niente</b> in comune. Heisenberg
             detesta le onde di Schrödinger («più ci penso, più le trovo ripugnanti», scrive a Pauli). Schrödinger
             trova la meccanica delle matrici incomprensibile. Eppure danno gli <b>stessi numeri</b> per lo spettro
             dell'idrogeno.</div>
             <p>Nel <b>marzo 1926</b> è Schrödinger stesso a mostrare il legame fra le due — arrivando a scrivere
             che «dal punto di vista matematico formale si può anche dire che le due teorie sono identiche». La
             dimostrazione, per gli standard di oggi, era incompleta; il quadro pulito arriva con la <b>teoria
             delle trasformazioni</b> di <b>Dirac</b> e <b>Jordan</b> nel <b>1927</b>, e poi con il libro di <b>von
             Neumann</b> del 1932.</p>
             <div class="callout key"><b>E la risposta è questo livello.</b> Le due teorie sono la <b>stessa
             teoria scritta in due basi diverse</b>. Heisenberg usava la base dell'energia, dove le grandezze sono
             tabelle; Schrödinger usava la base della posizione, dove diventano funzioni. Stesso stato, righelli
             diversi. Esattamente il gioco che hai appena fatto — solo con infinite dimensioni invece di due.</div>
             <p class="mb0">Un'ultima nota, e riguarda il secondo gioco. Girare gli assi finché i numeri fuori
             diagonale si azzerano è un metodo vero, e ha un nome: lo pubblicò <b>Carl Gustav Jacob Jacobi</b> nel
             <b>1846</b>, e per un secolo restò una curiosità perché a mano era una tortura. Poi arrivarono i
             computer e diventò uno degli algoritmi più usati del calcolo numerico. Quando giri il cursore stai
             facendo, a occhio, una <b>rotazione di Jacobi</b>.</p>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel primo gioco metti |0⟩ e porta il righello a 45°. Quanto viene? E a 90°?
           <span class="muted">(50 e 50 a 45°; a 90° torna certo, ma con le due risposte scambiate)</span></p>
        <p><b>2.</b> Metti |+⟩ e cerca <b>due</b> righelli che lo rendono certo.
           <span class="muted">(45° e 135°: sono lo stesso asse, letto nei due versi)</span></p>
        <p><b>3.</b> Prendi lo stato obliquo (20°) e trova il righello che lo rende testa o croce.
           <span class="muted">(65°, cioè 20° + 45°: la regola è sempre «a 45° dallo stato»)</span></p>
        <p><b>4.</b> Nel secondo gioco scegli «schiaccia» e prova a indovinare la base giusta <b>prima</b> di
           girare. <span class="muted">(45°: la matrice è simmetrica e con i due diagonali uguali, quindi gli assi
           buoni sono le due bisettrici)</span></p>
        <p class="mb0"><b>5.</b> Da inventore: nel secondo gioco, mentre giri il righello, tieni d'occhio la somma
           dei due numeri sulla diagonale. Che cosa noti? <span class="muted">(non cambia mai: è la traccia, e non
           dipende dal righello — come il determinante)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Che cosa vuol dire misurare uno stato in una certa base?', options: ['cambiare lo stato', 'proiettarlo sugli assi di quella base: le probabilità sono i quadrati delle proiezioni', 'ruotare l\'apparecchio', 'moltiplicarlo per una costante'], correct: 1,
      why: 'È la regola di Born. Per questo lo stesso stato può dare una risposta certa con un righello e 50 e 50 con un altro: non è cambiato lo stato, è cambiata la direzione su cui lo proietti.' },
    { q: '|+⟩ misurato lungo Z e lungo X che cosa dà?', options: ['certo in entrambi i casi', '50 e 50 lungo Z, certo lungo X', 'casuale in entrambi i casi', 'dipende dal rumore'], correct: 1,
      why: 'È la stessa freccia: sta a 45° rispetto agli assi Z e sull\'asse X. «Casuale» non è una proprietà dello stato, è il rapporto fra lo stato e il righello che usi.' },
    { q: 'Che cos\'è la porta di Hadamard, guardata da vicino?', options: ['una porta che aggiunge rumore', 'la matrice che riscrive uno stato nel righello a 45°: un cambio di base', 'una misura', 'una rotazione di 90°'], correct: 1,
      why: 'I due numeri che tira fuori, al quadrato, sono le probabilità di misurare nella base a 45°. E applicata due volte non fa niente, perché cambiare righello e ricambiarlo riporta al punto di partenza.' },
    { q: 'Che cosa succede a una matrice nella base dei suoi autovettori?', options: ['sparisce', 'diventa diagonale: non mescola più le direzioni, le allunga solo, ciascuna per conto suo', 'diventa l\'identità', 'raddoppia'], correct: 1,
      why: 'Gli autovettori sono le direzioni che la macchina non storce, e gli autovalori di quanto le allunga. In quella base la matrice è solo una coppia di numeri.' },
    { q: 'Perché la diagonalizzazione rende possibile la stima di fase?', options: ['perché fa risparmiare memoria', 'perché A^n diventa D^n, cioè due numeri elevati a n invece di n prodotti di matrici', 'perché elimina il rumore', 'perché riduce il numero di qubit'], correct: 1,
      why: 'Il circuito del livello 19 applica una porta 2, 4, 8, 16… volte. Nella base degli autovettori quella porta è «moltiplica per e^(iθ)», quindi applicarla 2^k volte è «moltiplica per e^(i·2^k·θ)».' },
    { q: 'Che rapporto c\'è fra la meccanica delle matrici di Heisenberg e quella ondulatoria di Schrödinger?', options: ['sono teorie rivali, una è sbagliata', 'sono la stessa teoria scritta in due basi diverse', 'una vale per gli atomi, l\'altra per le molecole', 'la seconda ha sostituito la prima'], correct: 1,
      why: 'Heisenberg usava la base dell\'energia, Schrödinger quella della posizione. Il legame lo mostra Schrödinger stesso nel 1926; il quadro pulito arriva con la teoria delle trasformazioni di Dirac e Jordan nel 1927.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> Un cambio di base non cambia niente della realtà e cambia tutti i
          numeri con cui la descrivi. Da qui cadono tre cose: «casuale» dipende dal righello e non dallo stato, la
          porta di Hadamard è il cambio di righello scritto come matrice, e nella base degli autovettori una macchina
          diventa due numeri — che è la scorciatoia su cui stanno in piedi la stima di fase e l'algoritmo di Shor. Al
          prossimo livello quella stessa scorciatoia servirà a calcolare e^(iHt), cioè a far evolvere un sistema
          fisico.</div>`,
});
@endsection
