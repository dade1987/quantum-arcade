@php($description = 'Prodotto tensoriale ed entanglement spiegati giocando: perché due qubit fanno quattro ampiezze e non quattro numeri qualsiasi, la definizione onesta di entangled («non si scrive come due cose separate») e il conto in una riga che lo riconosce: a00·a11 − a01·a10.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { tensoreLab, groviglioLab } from '/js/widgets/tensore.js';

const L = renderLesson({
  id: 'm6-tensore',
  lead: `Al livello M·4 hai scoperto <b>che</b> n qubit vivono in uno spazio di dimensione 2<sup>n</sup>. Qui vedi
         <b>come</b>: c'è un'operazione che mette insieme due registri, e non somma le dimensioni — le
         <b>moltiplica</b>. Da quella operazione, in tre righe di conto, esce anche la definizione onesta della
         parola più abusata della fisica: <b>entangled</b>. Che non vuol dire «i due qubit si parlano a distanza».
         Vuol dire una cosa molto più precisa, e la riconoscerai con una moltiplicazione.`,

  steps: [
    {
      t: 'Come si mettono insieme due registri',
      html: `<p>Hai due qubit. Il primo è descritto da due ampiezze, il secondo pure. Domanda: la <b>coppia</b>, da
             quanti numeri è descritta?</p>
             <p>La risposta classica sarebbe «due più due, quattro numeri in due liste». Quella quantistica è
             diversa, ed è la radice di tutto: la coppia ha <b>quattro ampiezze in una lista sola</b>, una per ogni
             configurazione possibile — |00⟩, |01⟩, |10⟩, |11⟩ — e ciascuna si ottiene <b>moltiplicando</b>:</p>
             <div class="formula">(a₀ , a₁) ⊗ (b₀ , b₁) = (a₀b₀ , a₀b₁ , a₁b₀ , a₁b₁)</div>
             <p>Il simbolo ⊗ si chiama <b>prodotto tensoriale</b>. La regola è tutta lì: <b>ogni ampiezza per ogni
             ampiezza</b>.</p>
             <div class="callout key">E qui c'è il conto che spiega il 2<sup>n</sup>. Le dimensioni non si sommano,
             si moltiplicano: 2 × 2 = 4, poi 4 × 2 = 8, poi 16, 32… Ogni qubit aggiunto <b>raddoppia</b>, mentre due
             registri classici da n bit ne fanno semplicemente 2n. Il livello M·4 ti aveva dato il numero; questa è
             la macchina che lo produce.</div>
             <p>Nel gioco muovi i due qubit e guarda le quattro barrette in basso: sono sempre i prodotti dei due
             gruppi in alto.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'tensore', title: 'Tre coppie', text: 'costruisci 3 coppie diverse.', xp: 45 });
        el.appendChild(m.root);
        tensoreLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Nota la riga verde in fondo al gioco: il numero <b>a₀₀·a₁₁ − a₀₁·a₁₀</b> resta <b>zero</b>, sempre,
              per qualunque coppia tu costruisca. Non è un caso, ed è facile vedere perché: con a₀₀ = a₀b₀ e
              a₁₁ = a₁b₁, il primo prodotto vale a₀a₁b₀b₁ — e il secondo, a₀₁·a₁₀ = a₀b₁ · a₁b₀, vale esattamente
              la stessa cosa. Si cancellano.</p>
              <div class="callout key">Tieni questo numero: si chiama <b>incrocio</b> in questo corso e lo hai già
              incontrato al livello M·4, dove diceva se due frecce erano indipendenti. Qui dirà un'altra cosa, e
              sarà la cosa importante.</div>`,
    },

    {
      t: 'La domanda che rovescia tutto',
      html: `<p>Adesso il passaggio decisivo, e vale la pena porlo come domanda prima di rispondere.</p>
             <p>Il prodotto tensoriale prende due qubit e produce quattro ampiezze. Ma <b>tutte</b> le quaterne di
             quattro ampiezze si ottengono così? Cioè: <b>dato uno stato di due qubit, si può sempre dire "il primo
             sta così e il secondo sta così"?</b></p>
             <div class="callout warn">Fermati un attimo prima di leggere oltre. Conta i gradi di libertà: due qubit
             separati sono <b>due</b> numeri (un angolo per uno). Una quaterna normalizzata di ampiezze ne ha
             <b>tre</b>. Tre parametri non entrano in due: <b>devono</b> esistere stati che non si scrivono come
             prodotto.</div>
             <p>Ed esistono. Il più famoso è questo, e in questo corso lo hai già incontrato al livello 4:</p>
             <div class="formula">|00⟩ + |11⟩ &nbsp;(diviso √2)</div>
             <p>Cioè: le ampiezze sono (0,707 ; 0 ; 0 ; 0,707). Nel gioco che segue prova a ricostruirlo muovendo i
             due qubit. <b>Provaci sul serio</b>, poi leggi il riquadro.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'groviglio', title: 'Separali (o dimostra che non si può)', text: 'classifica correttamente 3 stati.', xp: 60 });
        el.appendChild(m.root);
        groviglioLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Non ci sei riuscito, e non è colpa tua: <b>è impossibile</b>. Ecco la dimostrazione, che sta in
              quattro righe e che puoi seguire tutta:</p>`,
    },

    {
      t: 'Perché è impossibile, dimostrato',
      html: `<p>Supponiamo che lo stato di Bell si possa scrivere come prodotto, cioè che esistano due qubit
             (a₀, a₁) e (b₀, b₁) tali che il prodotto dia (0,707 ; 0 ; 0 ; 0,707). Vediamo dove porta.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Le quattro condizioni', html: 'Il prodotto tensoriale ci dice che dovrebbe valere: <b>a₀b₀ = 0,707</b>, <b>a₀b₁ = 0</b>, <b>a₁b₀ = 0</b>, <b>a₁b₁ = 0,707</b>.' },
          { h: 'La prima cosa che si deduce', html: 'Da <b>a₀b₀ = 0,707</b> segue che né a₀ né b₀ sono zero. Da <b>a₁b₁ = 0,707</b> segue che né a₁ né b₁ sono zero. Quindi <b>tutti e quattro</b> i numeri sono diversi da zero.' },
          { h: 'La contraddizione', html: 'Ma la seconda condizione dice <b>a₀b₁ = 0</b>: un prodotto di due numeri diversi da zero che dovrebbe fare zero. Impossibile. Fine.' },
          { h: 'Cosa abbiamo dimostrato', html: 'Non che «non ci siamo riusciti»: che <b>non esiste</b> nessuna coppia di qubit il cui prodotto dia lo stato di Bell. È una dimostrazione per assurdo, corta e definitiva.' },
          { h: 'Il test in una riga', html: 'Lo stesso ragionamento, condensato: uno stato (a₀₀, a₀₁, a₁₀, a₁₁) si separa <b>se e solo se</b> a₀₀·a₁₁ − a₀₁·a₁₀ = 0. Per Bell quel conto fa 0,5, non zero — ed è il numero che vedi nella barra del gioco.' },
          { h: 'E quanto è entangled', html: 'Il valore assoluto di quel numero, moltiplicato per due, va da 0 (separabile) a 1 (massimamente entangled). Si chiama <b>concorrenza</b>. Lo stato di Bell vale esattamente 1: non si può fare di più.' },
        ], { doneLabel: 'Dimostrato!' });
      },
      after: `<div class="callout ok"><b>Ecco la definizione che vale la pena portarsi via:</b>
              <p class="mb0" style="margin-top:8px"><b>Entangled = lo stato della coppia non si spezza in uno stato
              del primo e uno del secondo.</b></p>
              <p class="mb0" style="margin-top:8px">Non «i due qubit comunicano». Non «si influenzano a distanza».
              Non «uno sa cosa fa l'altro». Semplicemente: <b>non c'è modo di descriverli separatamente</b>, perché
              la descrizione completa esiste solo per la coppia intera.</p></div>
              <p>E la conseguenza fisica che di solito si racconta come misteriosa diventa quasi ovvia: se lo stato
              è (|00⟩ + |11⟩)/√2 e misuri il primo qubit ottenendo 0, l'unico termine sopravvissuto è |00⟩ — quindi
              anche il secondo darà 0. Non perché il primo abbia «avvisato» il secondo: perché non c'era mai stata
              una descrizione separata da avvisare.</p>`,
    },

    {
      t: 'Chi crea l\'entanglement: la CNOT',
      html: `<p>Ultima domanda pratica: se gli stati entangled non si scrivono come prodotto, <b>come si
             fabbricano?</b></p>
             <p>Non con due porte separate. Anche questo si dimostra: applicare una porta al primo qubit e un'altra
             al secondo vuol dire applicare il <b>prodotto tensoriale delle due matrici</b>, e un prodotto di
             matrici separate manda stati separabili in stati separabili. Sempre. I test di questo livello lo
             verificano su centinaia di combinazioni.</p>
             <div class="callout key">Serve una porta che <b>non sia</b> un prodotto tensoriale — cioè che tratti i
             due qubit <b>insieme</b> e non uno per volta. La più semplice è la <b>CNOT</b> del livello 4: «se il
             primo è 1, ribalta il secondo». Quella frase non si può spezzare in due frasi separate, ed è
             precisamente per questo che funziona.</div>
             <p>La ricetta dello stato di Bell, che al livello 4 hai eseguito, adesso si legge tutta:</p>
             <ol>
               <li>parti da |0⟩⊗|0⟩ — separabile, incrocio zero;</li>
               <li>una <b>H</b> sul primo qubit: diventa (|0⟩+|1⟩)/√2 ⊗ |0⟩ — ancora separabile, la H è una porta
                   su un qubit solo;</li>
               <li>una <b>CNOT</b>: e l'incrocio passa da 0 a 0,5. <b>Lì</b> nasce l'entanglement.</li>
             </ol>
             <p class="mb0">Nota il passaggio 2: la sovrapposizione da sola <b>non basta</b>. Serve la
             sovrapposizione <i>e poi</i> una porta a due qubit. Su |0⟩⊗|0⟩ la CNOT non fa niente — provalo nella
             tua testa, e i test lo confermano.</p>`,
    },

    {
      t: 'Da dove viene: una parola inventata per una lettera',
      html: `<p>La parola nasce in un anno solo, il <b>1935</b>, ed è un anno affollato.</p>
             <p>In primavera <b>Einstein, Podolsky e Rosen</b> pubblicano l'articolo che oggi si chiama <b>EPR</b>:
             prendono due particelle preparate insieme e mostrano che, secondo la meccanica quantistica, misurare
             l'una determina immediatamente cosa si otterrà dall'altra. La loro conclusione non è «che meraviglia»:
             è che la teoria dev'essere <b>incompleta</b>, perché non può essere che la realtà funzioni così.</p>
             <p>Pochi mesi dopo <b>Erwin Schrödinger</b> risponde con un lungo articolo — quello in cui compare
             anche il famoso gatto — e nel farlo <b>conia la parola</b>. In tedesco scrive
             <i>Verschränkung</i>, che vuol dire «intreccio, incrocio delle braccia». E siccome scrive anche una
             versione inglese, la traduce lui stesso: <b>entanglement</b>.</p>
             <div class="callout key">La frase con cui la presenta è rimasta, ed è più forte di come di solito viene
             citata: l'entanglement non è <i>un</i> tratto, ma <b>il</b> tratto caratteristico della meccanica
             quantistica — quello che impone l'intero distacco dalle linee di pensiero classiche. E la descrive
             esattamente come l'hai vista qui: quando due sistemi interagiscono, <b>le loro funzioni d'onda non si
             possono più separare</b>.</div>
             <p>Per trent'anni la questione resta filosofica: EPR dice «la teoria è incompleta», Bohr dice di no, e
             non c'è modo di decidere con un esperimento. Poi nel <b>1964</b> <b>John Bell</b> fa la cosa che nessuno
             si aspettava: trasforma la disputa in una <b>disuguaglianza numerica</b> che si può misurare in
             laboratorio. Dagli anni Ottanta in poi gli esperimenti la violano, sempre — e il <b>Nobel per la fisica
             2022</b> va proprio a <b>Aspect, Clauser e Zeilinger</b> per averlo fatto in modo inattaccabile.</p>
             <div class="callout ok"><b>Curiosità sulla parola «tensore».</b> Non ha niente a che vedere con la
             fisica quantistica: viene dal latino <i>tendere</i>, ed è stata introdotta alla fine dell'Ottocento
             (<b>Woldemar Voigt</b>) per descrivere le <b>tensioni dentro un materiale</b> — quanto tira un pezzo di
             metallo in ciascuna direzione. Il calcolo tensoriale come strumento generale lo costruiscono due
             italiani, <b>Gregorio Ricci-Curbastro</b> e il suo allievo <b>Tullio Levi-Civita</b>, fra il 1890 e il
             1900. Einstein lo userà per la relatività generale, e i fisici quantistici per mettere insieme i
             registri. Ancora una volta: uno strumento costruito per un problema, che si rivela decisivo per un
             altro.</div>`,
    },

    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel primo gioco metti tutti e due i qubit a 45°: che quattro ampiezze vengono? E l'incrocio?
           <span class="muted">(0,5 ciascuna, e l'incrocio è zero: 0,25 − 0,25)</span></p>
        <p><b>2.</b> Nel secondo gioco, sullo stato 3, trova i due angoli che lo ricostruiscono. Ci sono riuscito con
           30° e 60°: prova a capire perché guardando i numeri.</p>
        <p><b>3.</b> Sullo stato 4 (0 ; 0,707 ; 0,707 ; 0), rifai la dimostrazione per assurdo da solo: quale delle
           quattro condizioni si contraddice? <span class="muted">(stavolta sono a₀b₀ = 0 e a₁b₁ = 0 a non poter
           stare insieme alle altre due)</span></p>
        <p><b>4.</b> Se n qubit hanno 2<sup>n</sup> ampiezze, quante ne servono per <b>tre</b> qubit? Scrivi la lista
           delle configurazioni. <span class="muted">(otto: 000, 001, 010, 011, 100, 101, 110, 111)</span></p>
        <p class="mb0"><b>5.</b> Da inventore: se l'entanglement si crea solo con porte a due qubit, quante CNOT
           servono <b>al minimo</b> per legare fra loro n qubit? <span class="muted">(indizio: pensa a una catena —
           e questo numero conta davvero quando si progetta un circuito su una macchina vera, dove non tutte le
           coppie di qubit sono collegate fisicamente)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Come si combinano le ampiezze di due qubit per descrivere la coppia?', options: ['si sommano', 'si moltiplicano ogni ampiezza con ogni ampiezza: (a₀,a₁) ⊗ (b₀,b₁) = (a₀b₀, a₀b₁, a₁b₀, a₁b₁)', 'si mettono in fila una dopo l\'altra', 'si fa la media'], correct: 1,
      why: 'È il prodotto tensoriale, e la conseguenza è che le dimensioni si moltiplicano invece di sommarsi: 2 × 2 = 4. Da lì il 2^n per n qubit.' },
    { q: 'Che cosa significa che uno stato di due qubit è «entangled»?', options: ['che i due qubit si scambiano segnali', 'che lo stato della coppia NON si può scrivere come «il primo sta così e il secondo così»', 'che i due qubit hanno la stessa ampiezza', 'che la misura è casuale'], correct: 1,
      why: 'È un\'impossibilità di fattorizzazione, non una comunicazione. La descrizione completa esiste solo per la coppia intera: non c\'è una descrizione separata dei due pezzi.' },
    { q: 'Come si riconosce un\'entanglement con un conto solo?', options: ['sommando le ampiezze', 'calcolando a₀₀·a₁₁ − a₀₁·a₁₀: se non è zero, lo stato è entangled', 'guardando quale ampiezza è più grande', 'contando quante ampiezze sono nulle'], correct: 1,
      why: 'È lo stesso «incrocio» che al livello M·4 diceva se due frecce erano indipendenti. Per un prodotto tensoriale fa sempre zero; se non fa zero, il prodotto non esiste.' },
    { q: 'Perché lo stato (|00⟩ + |11⟩)/√2 non si può separare?', options: ['perché le ampiezze sono irrazionali', 'perché servirebbero a₀, a₁, b₀, b₁ tutti diversi da zero e insieme a₀b₁ = 0: due condizioni incompatibili', 'perché non è normalizzato', 'perché ha due termini invece di uno'], correct: 1,
      why: 'Dalle ampiezze di |00⟩ e |11⟩ segue che nessuno dei quattro numeri è zero; ma le ampiezze di |01⟩ e |10⟩ pretendono che alcuni prodotti facciano zero. Contraddizione: nessuna coppia di qubit dà quello stato.' },
    { q: 'Due porte separate, una per qubit, possono creare entanglement?', options: ['sì, se sono abbastanza forti', 'no: il loro effetto è un prodotto tensoriale, che manda stati separabili in stati separabili', 'sì, se applicate molte volte', 'solo se sono unitarie'], correct: 1,
      why: 'Serve una porta che tratti i due qubit insieme, come la CNOT: «se il primo è 1, ribalta il secondo» è una frase che non si spezza in due frasi separate.' },
    { q: 'Chi ha coniato la parola «entanglement», e quando?', options: ['Einstein, nel 1905', 'Schrödinger nel 1935, traducendo il tedesco Verschränkung', 'Bell, nel 1964', 'Bohr, negli anni Venti'], correct: 1,
      why: 'Schrödinger la introduce rispondendo all\'articolo EPR, nello stesso lavoro in cui compare il gatto. La definì il tratto caratteristico della meccanica quantistica, quello che impone il distacco dal pensiero classico.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> Il prodotto tensoriale moltiplica le dimensioni invece di sommarle, ed
          è da lì che nasce il 2<sup>n</sup>. Un prodotto ha sempre incrocio zero; quindi ogni stato con incrocio
          diverso da zero <b>non è un prodotto</b> — ed è quello che «entangled» significa, dimostrato in quattro
          righe invece che raccontato. E la porta che quell'incrocio lo accende è la CNOT.</div>`,
});
@endsection
