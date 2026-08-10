/* ============================================================
   BANCA DOMANDE DELL'ESAME FINALE — unica fonte di verità.

   Da qui il backend genera la propria copia con:
       node tools/sync-exam.mjs
   Le risposte esatte restano SOLO lato server: il browser riceve
   le domande senza soluzione, e la correzione la fa Laravel.
   ============================================================ */

export const EXAM = [
  { q: 'Un\'onda ha periodo T = 0,2 s. Qual è la sua frequenza?', o: ['0,2 Hz', '2 Hz', '5 Hz', '20 Hz'], c: 2, w: 'f = 1/T = 1/0,2 = 5 Hz.' },
  { q: 'Che cosa descrive la <b>fase</b> di un\'onda?', o: ['Quanto è alta', 'Quanti cicli fa al secondo', 'A che punto del ciclo si trova', 'Quanto dura'], c: 2, w: 'La fase dice in quale punto del giro si trova l\'onda; 360° equivalgono a 0°.' },
  { q: 'Due onde identiche sfasate di 180° vengono sommate. Risultato?', o: ['Onda doppia', 'Zero', 'Frequenza doppia', 'Invariata'], c: 1, w: 'Interferenza distruttiva: si cancellano.' },
  { q: 'Quanto vale e^{iπ}?', o: ['1', 'i', '−1', 'π'], c: 2, w: 'Mezzo giro sul cerchio unitario porta a −1 (identità di Eulero).' },
  { q: 'Moltiplicare un numero complesso per e^{iθ} significa…', o: ['allungarlo', 'ruotarlo di θ', 'coniugarlo', 'azzerarlo'], c: 1, w: 'e^{iθ} ha modulo 1: cambia solo l\'angolo.' },
  { q: 'Nella DFT, e^{−i2πkn/N} serve a…', o: ['normalizzare', 'ruotare ogni campione', 'togliere il rumore', 'contare i campioni'], c: 1, w: 'È la freccia che ruota: la DFT è "ruota e somma".' },
  { q: 'X(0) della DFT corrisponde a…', o: ['la frequenza massima', 'la somma dei campioni', 'la fase iniziale', 'zero'], c: 1, w: 'Con k = 0 non c\'è rotazione: si sommano i dati così come sono.' },
  { q: 'Con N = 16 campioni, quante frequenze può testare la DFT?', o: ['4', '8', '16', 'infinite'], c: 2, w: 'Esattamente N: da k = 0 a k = N−1.' },
  { q: 'La FFT su N punti costa circa…', o: ['N', 'N log N', 'N²', '2^N'], c: 1, w: 'Dividi et impera: log N livelli, N operazioni per livello.' },
  { q: 'La probabilità di misurare uno stato con ampiezza a vale…', o: ['a', '|a|', '|a|²', '2a'], c: 2, w: 'Regola di Born: probabilità = modulo dell\'ampiezza al quadrato.' },
  { q: 'Un qubit dopo H|0⟩ è…', o: ['0 col 50% e 1 col 50%, come una moneta', 'in sovrapposizione coerente di |0⟩ e |1⟩', 'sempre 1', 'entangled'], c: 1, w: 'La differenza con la moneta è la fase: applicando un\'altra H torna esattamente a |0⟩.' },
  { q: 'Cosa fa la porta Z?', o: ['scambia |0⟩ e |1⟩', 'mette un segno meno su |1⟩', 'crea entanglement', 'misura il qubit'], c: 1, w: 'Z lascia |0⟩ e moltiplica |1⟩ per −1: è una rotazione di fase di 180°.' },
  { q: 'Sulla sfera di Bloch, il polo nord e il polo sud sono…', o: ['|+⟩ e |−⟩', '|0⟩ e |1⟩', 'due qubit diversi', 'stati entangled'], c: 1, w: 'Nord = |0⟩, sud = |1⟩; l\'equatore contiene le sovrapposizioni al 50%, differenziate dalla fase.' },
  { q: 'Con 10 qubit, quante ampiezze descrivono lo stato?', o: ['10', '100', '1024', '2·10'], c: 2, w: '2^10 = 1024: la crescita esponenziale è il motivo di tutto.' },
  { q: 'Lo stato (|00⟩ + |11⟩)/√2 è…', o: ['separabile', 'entangled', 'classico', 'non normalizzato'], c: 1, w: 'Non si può scrivere come prodotto di due stati singoli: misurando uno, l\'altro è determinato.' },
  { q: 'Il teorema di no-cloning dice che…', o: ['non si può misurare un qubit', 'non si può copiare uno stato quantistico sconosciuto', 'non si può creare entanglement', 'non si possono usare più di 2 qubit'], c: 1, w: 'Nessuna operazione unitaria copia uno stato arbitrario sconosciuto.' },
  { q: 'Nel teletrasporto quantistico servono anche…', o: ['due bit classici comunicati normalmente', 'niente, è istantaneo', 'un terzo qubit entangled con Bob', 'una misura di Bob prima di tutto'], c: 0, w: 'Senza i due bit classici Bob non sa quale correzione applicare: niente informazione più veloce della luce.' },
  { q: 'Deutsch–Jozsa distingue funzione costante da bilanciata con…', o: ['1 interrogazione', 'N/2 interrogazioni', 'N interrogazioni', 'log N interrogazioni'], c: 0, w: 'Una sola, contro le 2^{n−1}+1 del caso peggiore classico.' },
  { q: 'Bernstein–Vazirani trova una stringa segreta di n bit con…', o: ['n interrogazioni', '1 interrogazione', '2^n interrogazioni', 'n² interrogazioni'], c: 1, w: 'Una sola: l\'oracolo scrive s nelle fasi e le Hadamard finali lo riportano in posizione.' },
  { q: 'Grover su N elementi richiede circa…', o: ['N passi', 'log N passi', '√N passi', 'N² passi'], c: 2, w: 'Circa (π/4)√N iterazioni: guadagno quadratico, non esponenziale.' },
  { q: 'Se in Grover si fanno troppe iterazioni…', o: ['la probabilità continua a salire', 'la probabilità ricala', 'il circuito si blocca', 'si perde l\'entanglement'], c: 1, w: 'È una rotazione: superato il bersaglio si comincia a tornare indietro.' },
  { q: 'La QFT su n qubit richiede circa quante porte?', o: ['n', 'n²', '2^n', 'n log n'], c: 1, w: 'n(n+1)/2 rotazioni e Hadamard più gli SWAP: dell\'ordine di n².' },
  { q: 'Quali porte compongono il circuito della QFT?', o: ['solo CNOT', 'Hadamard e rotazioni di fase controllate', 'solo X e Z', 'misure ripetute'], c: 1, w: 'Su ogni qubit una H, poi rotazioni di fase controllate dai qubit meno significativi, infine gli SWAP.' },
  { q: 'La QFT applicata a |01⟩ con 2 qubit produce ampiezze proporzionali a…', o: ['[1,1,1,1]', '[1, i, −1, −i]', '[0,1,0,0]', '[1,−1,1,−1]'], c: 1, w: 'Quattro frecce a 0°, 90°, 180°, 270°: l\'informazione è passata dalla posizione alla fase.' },
  { q: 'Perché la QFT NON serve a calcolare velocemente lo spettro di un file audio?', o: ['perché è imprecisa', 'perché misurando si ottiene un solo risultato, non tutta la lista', 'perché è più lenta della FFT', 'perché funziona solo su numeri primi'], c: 1, w: 'La QFT trasforma tutte le ampiezze, ma la misura ne restituisce una sola: serve a far interferire, non a stampare.' },
  { q: 'Se uno stato ha periodicità r, dopo la QFT i picchi cadono su…', o: ['multipli di r', 'multipli di N/r', 'numeri primi', 'posizioni casuali'], c: 1, w: 'Periodo r nel dominio di partenza → passo N/r nel dominio trasformato.' },
  { q: 'La Quantum Phase Estimation serve a…', o: ['misurare l\'energia di un qubit', 'leggere una fase come numero binario', 'creare entanglement', 'correggere errori'], c: 1, w: 'Scrive la fase di un autovalore nei qubit di lettura e la rende misurabile tramite QFT inversa.' },
  { q: 'Shor riduce la fattorizzazione al problema di…', o: ['trovare il periodo di a^x mod N', 'sommare numeri primi', 'ordinare una lista', 'cercare in un database'], c: 0, w: 'Trovato r, i fattori si ottengono con MCD(a^{r/2} ± 1, N).' },
  { q: 'Nel dopo-misura di Shor si usano le frazioni continue per…', o: ['ridurre il rumore', 'ricavare r da y/M', 'moltiplicare i fattori', 'inizializzare i qubit'], c: 1, w: 'Approssimano y/M con la frazione k/r più semplice: il denominatore è il periodo cercato.' },
  { q: 'La decoerenza è…', o: ['un errore di programmazione', 'la perdita dello stato quantistico per interazione con l\'ambiente', 'una porta logica', 'un tipo di misura'], c: 1, w: 'L\'ambiente "misura" il sistema senza chiedere permesso, distruggendo le relazioni di fase.' },
];
