/* ============================================================
   MAPPA DEI LIVELLI — unica fonte di verità.

   ORDINE (curriculum a spirale, difficoltà crescente):
   0) basi matematiche          → per chi parte da zero
   K) il computer CLASSICO      → bit, porte, somma, ricerca, costo,
                                  reversibilità. Sta prima di tutto perché
                                  «quantistico» è una differenza, e una
                                  differenza si vede solo se si conosce il
                                  termine di paragone: chi non sa cos'è un bit
                                  non può stupirsi di un qubit.
   A) il qubit SUBITO           → con ampiezze "con il segno" (+/−): niente
                                  numeri complessi, niente onde. Paga subito.
   B) frecce, fasi, algoritmi   → si scopre che il segno non basta: servono
                                  le frecce (numeri complessi). E si usano.
   C) onde e Fourier            → introdotte quando servono davvero, cioè
                                  appena prima della QFT (just-in-time).
   D) QFT, Shor, invenzione     → il cuore, e poi l'officina creativa.

   Principio: nessun attrezzo viene introdotto più di un livello prima
   del punto in cui serve, e ogni concetto torna almeno due volte
   (prima in forma semplice, poi in forma completa).

   LINGUE: l'`id` è lo stesso in tutte le lingue — è la chiave con cui il
   progresso vive sul server, quindi chi ricomincia il corso in inglese
   ritrova i livelli che aveva già superato in italiano. Cambiano solo
   l'indirizzo del file (SLUG) e i testi (t()).
   ============================================================ */

import { t, LOCALE, LESSON_DIR, ROOT, PREFIX } from './i18n.js';

/* Indirizzi tradotti. In italiano lo slug è l'id stesso: la voce qui sotto
   serve solo alle altre lingue. */
const SLUG = {
  '00-numeri': { en: '00-numbers', es: '00-numeros' },
  '00-griglia': { en: '00-grid', es: '00-cuadricula' },
  '00-seno': { en: '00-sine', es: '00-seno' },
  '00-caso': { en: '00-chance', es: '00-azar' },
  '00-orologio': { en: '00-clock', es: '00-reloj' },
  '00-matrici': { en: '00-matrices', es: '00-matrices' },
  '00-equazioni': { en: '00-equations', es: '00-ecuaciones' },
  '00-secondogrado': { en: '00-quadratics', es: '00-segundo-grado' },
  '00-logaritmi': { en: '00-logarithms', es: '00-logaritmos' },
  '00-scalare': { en: '00-dot-product', es: '00-producto-escalar' },
  'm1-polinomi': { en: 'm1-polynomials', es: 'm1-polinomios' },
  'm2-goniometria': { en: 'm2-trigonometry', es: 'm2-trigonometria' },
  'm3-complessi': { en: 'm3-complex-numbers', es: 'm3-numeros-complejos' },
  'm4-spazi': { en: 'm4-vector-spaces', es: 'm4-espacios-vectoriales' },
  'm5-operatori': { en: 'm5-operators', es: 'm5-operadores' },
  'm6-tensore': { en: 'm6-tensor-product', es: 'm6-producto-tensorial' },
  'm7-probabilita': { en: 'm7-probability', es: 'm7-probabilidad' },
  'm8-limiti': { en: 'm8-limits', es: 'm8-limites' },
  'm9-integrali': { en: 'm9-integrals', es: 'm9-integrales' },
  'm10-taylor': { en: 'm10-taylor', es: 'm10-taylor' },
  'k1-bit': { en: 'k1-bit', es: 'k1-bit' },
  'k2-porte': { en: 'k2-logic-gates', es: 'k2-puertas-logicas' },
  'k3-somma': { en: 'k3-addition', es: 'k3-suma' },
  'k4-ricerca': { en: 'k4-search', es: 'k4-busqueda' },
  'k5-costo': { en: 'k5-cost', es: 'k5-coste' },
  'k6-reversibile': { en: 'k6-reversible', es: 'k6-reversible' },
  '01-qubit': { en: '01-qubit', es: '01-qubit' },
  '02-bloch': { en: '02-bloch', es: '02-bloch' },
  '03-porte': { en: '03-gates', es: '03-puertas' },
  '04-due-qubit': { en: '04-two-qubits', es: '04-dos-qubits' },
  '05-circuiti': { en: '05-circuits', es: '05-circuitos' },
  '06-teletrasporto': { en: '06-teleportation', es: '06-teletransporte' },
  '07-interferenza': { en: '07-interference', es: '07-interferencia' },
  '08-frecce': { en: '08-arrows', es: '08-flechas' },
  '09-deutsch': { en: '09-deutsch', es: '09-deutsch' },
  '10-bernstein': { en: '10-bernstein', es: '10-bernstein' },
  '11-grover': { en: '11-grover', es: '11-grover' },
  '12-simon': { en: '12-simon', es: '12-simon' },
  '13-onde': { en: '13-waves', es: '13-ondas' },
  '14-fase': { en: '14-phase', es: '14-fase' },
  '15-somma-onde': { en: '15-wave-sum', es: '15-suma-de-ondas' },
  '15b-serie': { en: '15b-geometric-series', es: '15b-serie-geometrica' },
  '16-dft': { en: '16-dft', es: '16-dft' },
  '17-fft': { en: '17-fft', es: '17-fft' },
  '18-qft': { en: '18-qft', es: '18-qft' },
  '18b-autovettori': { en: '18b-eigenvectors', es: '18b-autovectores' },
  '19-qpe': { en: '19-qpe', es: '19-qpe' },
  '20-shor': { en: '20-shor', es: '20-shor' },
  '21-rumore': { en: '21-noise', es: '21-ruido' },
  '21b-variazionale': { en: '21b-variational', es: '21b-variacional' },
  '22-officina': { en: '22-workshop', es: '22-taller' },
  '23-glossario': { en: '23-glossary', es: '23-glosario' },
  '24-esame': { en: '24-exam', es: '24-examen' },
};

/** Nome del file di un livello nella lingua data, senza estensione. */
export function slugOf(id, locale = LOCALE) {
  if (locale === 'it') return id;
  return (SLUG[id] && SLUG[id][locale]) || id;
}

export const PARTS = [
  {
    id: '0',
    title: t('Parte 0 — Le basi (per chi parte proprio da zero)'),
    sub: t('Numeri, percentuali, coordinate, gradi, seno e coseno, probabilità, contare a giri, matrici, equazioni (anche di secondo grado), logaritmi e prodotto scalare. Dalle medie in su. Facoltativa se le sai già.'),
    color: 'green',
  },
  {
    id: 'M',
    title: t('Parte M — La matematica delle superiori e dell\'università'),
    sub: t('Dalla prima superiore ad Analisi 2, ma solo i pezzi che questo corso usa davvero, e sempre con la curiosità dentro: perché quella formula è fatta così, da quale problema è nata, e a che serve qui. Facoltativa come la Parte 0 — però chi la fa capisce il resto molto meglio.'),
    color: 'green',
  },
  {
    id: 'K',
    title: t('Parte K — Il computer classico (il termine di paragone)'),
    sub: t('Bit, porte logiche, somma binaria, ricerca, costo di un algoritmo, reversibilità. Ogni livello finisce con l\'anticipazione di cosa cambierà nel quantistico. Facoltativa se sai già come funziona un computer normale.'),
    color: 'blue',
  },
  {
    id: 'A',
    title: t('Parte A — Il qubit, subito'),
    sub: t('Sovrapposizione, misura, porte, entanglement, circuiti. Con ampiezze positive e negative: nessuna matematica difficile.'),
    color: 'violet',
  },
  {
    id: 'B',
    title: t('Parte B — Frecce, fasi e primi algoritmi'),
    sub: t('Il segno non basta più: arrivano le frecce (numeri complessi). E i primi algoritmi che battono il computer classico.'),
    color: 'cyan',
  },
  {
    id: 'C',
    title: t('Parte C — Onde e Fourier (l\'attrezzo che ci manca)'),
    sub: t('Ora che sappiamo cosa vogliamo fare, impariamo lo strumento: onde, frequenze, trasformata di Fourier.'),
    color: 'amber',
  },
  {
    id: 'D',
    title: t('Parte D — Il cuore: QFT, Shor e invenzione'),
    sub: t('Tutto si unisce. E alla fine si inventa il proprio algoritmo e si dà l\'esame.'),
    color: 'pink',
  },
];

export const LEVELS = [
  // ---------- PARTE 0 — sempre aperta ----------
  { id: '00-numeri',  part: '0', n: '0·1', open: true,
    title: t('Numeri: negativi, metà, doppi, quadrati'),
    desc: t('Linea dei numeri, percentuali, potenze di 2 e radice quadrata. Tutto giocato.'), xp: 60 },

  { id: '00-griglia', part: '0', n: '0·2', open: true,
    title: t('Griglia, frecce e gradi'),
    desc: t('Coordinate come in battaglia navale e il giro completo di 360°.'), xp: 60 },

  { id: '00-seno',    part: '0', n: '0·3', open: true,
    title: t('Seno e coseno senza triangoli'),
    desc: t('Le due ombre di un punto che gira. Il ponte fra i gradi e le onde.'), xp: 70 },

  { id: '00-caso',    part: '0', n: '0·4', open: true,
    title: t('Il caso: monete, dadi, probabilità'),
    desc: t('Lancia, conta, scopri che le percentuali si sistemano da sole.'), xp: 60 },

  { id: '00-orologio', part: '0', n: '0·5', open: true,
    title: t("L'orologio dei numeri: resto, MCD e ritmi che tornano"),
    desc: t('Contare a giri, il pavimento di Euclide e il ritmo di a^x mod N: la matematica classica che sta dentro Shor.'), xp: 80 },

  { id: '00-matrici', part: '0', n: '0·6', open: true,
    title: t('La macchina che trasforma le frecce: le matrici'),
    desc: t('Quattro manopole, due frecce e la scoperta che ogni porta quantistica è una tabella di numeri.'), xp: 90 },

  { id: '00-equazioni', part: '0', n: '0·7', open: true,
    title: t('Equazioni, formule girate e macchine che tornano indietro'),
    desc: t('La bilancia che non si sbilancia mai, come si gira una formula, e la domanda che vale tutto: si può risalire da dove si è arrivati?'), xp: 80 },

  { id: '00-secondogrado', part: '0', n: '0·7b', open: true,
    title: t('Secondo grado: la parabola e il quadrato a cui manca un angolo'),
    desc: t('Il delta in tre parole, la formula costruita invece che imparata, e il «mai» che nel Cinquecento ha aperto la porta ai numeri immaginari.'), xp: 85 },

  { id: '00-logaritmi', part: '0', n: '0·8', open: true,
    title: t('Esponenziali e logaritmi: quante cifre servono'),
    desc: t('Quanti interruttori per mille casi, quante volte si può dimezzare, e perché «polinomiale nel numero di cifre» cambia tutto.'), xp: 80 },

  { id: '00-scalare', part: '0', n: '0·9', open: true,
    title: t('Quanto due frecce si somigliano: il prodotto scalare'),
    desc: t('Un numero solo che dice se due frecce vanno d\'accordo. E la misura quantistica scoperta per quello che è: un\'ombra.'), xp: 85 },

  // ---------- PARTE M — matematica delle superiori e dell'università, sempre aperta ----------
  { id: 'm1-polinomi', part: 'M', n: 'M·1', open: true,
    title: t('Polinomi, Ruffini e la formula che non esiste'),
    desc: t('Scomporre cercando i sospettati, la staffetta di Ruffini che è anche il modo più veloce di calcolare un polinomio, e il motivo per cui dal quinto grado in poi una formula non c\'è — e non ci sarà mai.'), xp: 90 },

  { id: 'm2-goniometria', part: 'M', n: 'M·2', open: true,
    title: t('Girare due volte: le formule di addizione'),
    desc: t('L\'identità fondamentale che è Pitagora travestito, due giri che ne fanno uno solo — e la scoperta che ogni giro di Grover aggiunge 2θ.'), xp: 90 },

  { id: 'm3-complessi', part: 'M', n: 'M·3', open: true,
    title: t('Numeri complessi per bene: e^(iθ) e le radici dell\'unità'),
    desc: t('Moltiplicare è allungare e girare, da lì la scrittura e^(iθ) — e le n frecce che sommate fanno zero, cioè il motore della trasformata di Fourier.'), xp: 95 },

  { id: 'm4-spazi', part: 'M', n: 'M·4', open: true,
    title: t('Spazi vettoriali: base, dimensione, e perché 2^n'),
    desc: t('Poche frecce che raggiungono tutto, il numero che non cambia qualunque base tu scelga, e la ragione per cui n qubit vivono in uno spazio di dimensione 2^n.'), xp: 90 },

  { id: 'm5-operatori', part: 'M', n: 'M·5', open: true,
    title: t('Operatori: porte, osservabili e misure sono tre tipi di matrice'),
    desc: t('Unitaria = non cambia le lunghezze. Hermitiana = autovalori reali. Proiettore = rifarlo non cambia niente. Le tre parole della quantistica, costruite con quattro manopole.'), xp: 95 },

  { id: 'm6-tensore', part: 'M', n: 'M·6', open: true,
    title: t('Prodotto tensoriale: e finalmente cosa vuol dire «entangled»'),
    desc: t('Mettere insieme due registri moltiplica le dimensioni invece di sommarle — e uno stato è entangled quando quel prodotto non si può disfare. Con il conto che lo dice in una riga.'), xp: 95 },

  { id: 'm7-probabilita', part: 'M', n: 'M·7', open: true,
    title: t('Probabilità sul serio: media, errore, e la prova che il mondo non è classico'),
    desc: t('Perché un decimale in più costa cento volte le misure, come si aggiorna quello che si crede, e il test di Bell — quello del Nobel 2022 — giocato con le mani.'), xp: 100 },

  { id: 'm8-limiti', part: 'M', n: 'M·8', open: true,
    title: t('Successioni e limiti: cosa vuol dire davvero «tende a»'),
    desc: t('Il gioco del corridoio, la banca che paga interessi immaginari — e la scoperta che «quanti tiri servono» era già la definizione di limite.'), xp: 95 },

  { id: 'm9-integrali', part: 'M', n: 'M·9', open: true,
    title: t('Integrali: l\'area, e il teorema che la lega alla derivata'),
    desc: t('Rettangoli sempre più stretti, il tachimetro che è la pendenza del contachilometri, e due aree che hanno un nome: il logaritmo e la probabilità che fa 1.'), xp: 95 },

  { id: 'm10-taylor', part: 'M', n: 'M·10', open: true,
    title: t('Serie di Taylor: qualunque curva, vista da vicino, è un polinomio'),
    desc: t('Il polinomio che insegue la curva finché ce la fa, la formula di Eulero letta sul foglio — e la scoperta che il √N di Grover è un\'approssimazione troncata al primo termine.'), xp: 100 },

  // ---------- PARTE K — il computer classico, sempre aperta ----------
  { id: 'k1-bit', part: 'K', n: 'K·1', open: true,
    title: t('Il bit: acceso, spento, e come ci si scrive tutto'),
    desc: t('Interruttori, binario, byte, testo. E il conto che tornerà: con n bit scegli UN numero fra 2ⁿ.'), xp: 80 },

  { id: 'k2-porte', part: 'K', n: 'K·2', open: true,
    title: t('Porte logiche: AND, OR, NOT, XOR'),
    desc: t('Tabelle di verità giocate, e la scoperta che una porta sola basta per costruire tutte le altre.'), xp: 80 },

  { id: 'k3-somma', part: 'K', n: 'K·3', open: true,
    title: t('La somma, come la fa davvero il processore'),
    desc: t('Riporto, mezzo sommatore, sommatore completo: monti l\'addizione a 4 bit con le tue mani.'), xp: 90 },

  { id: 'k4-ricerca', part: 'K', n: 'K·4', open: true,
    title: t('Cercare: a tentoni, oppure dimezzando'),
    desc: t('Ricerca lineare e ricerca binaria, contando i confronti uno per uno. Il metro di paragone di Grover.'), xp: 80 },

  { id: 'k5-costo', part: 'K', n: 'K·5', open: true,
    title: t('Quanto costa un algoritmo: N, log N, N², 2ⁿ'),
    desc: t('La gara fra le curve di crescita. Qui si capisce che cosa significa davvero "vantaggio quantistico".'), xp: 80 },

  { id: 'k6-reversibile', part: 'K', n: 'K·6', open: true,
    title: t('Informazione che si perde: il ponte verso il quantistico'),
    desc: t('AND butta via un bit, cancellare scalda (Landauer), Toffoli calcola all\'indietro. Da qui parte tutto.'), xp: 90 },

  // ---------- PARTE A — il qubit subito ----------
  { id: '01-qubit',   part: 'A', n: 1, open: true,
    title: t('Il qubit: cos\'è davvero'),
    desc: t('Fotoni, filtri polaroid, ampiezze e la differenza vera con una moneta truccata.'), xp: 110 },

  { id: '02-bloch',   part: 'A', n: 2,
    title: t('La sfera di Bloch e la misura'),
    desc: t('Ruota la sfera col mouse, misura, guarda il collasso.'), xp: 100 },

  { id: '03-porte',   part: 'A', n: 3,
    title: t('Le porte: X, Z, H e le rotazioni'),
    desc: t('Ogni porta è una rotazione. E H·Z·H = X è già mezzo algoritmo.'), xp: 100 },

  { id: '04-due-qubit', part: 'A', n: 4,
    title: t('Due qubit, CNOT ed entanglement'),
    desc: t('Da 2 ampiezze a 4. Stati di Bell e correlazioni impossibili.'), xp: 120 },

  { id: '05-circuiti', part: 'A', n: 5,
    title: t('Il laboratorio dei circuiti'),
    desc: t('Sandbox: costruisci circuiti a 3 qubit, simula, misura, sperimenta.'), xp: 110 },

  { id: '06-teletrasporto', part: 'A', n: 6,
    title: t('No-cloning, teletrasporto e dense coding'),
    desc: t('Perché non puoi copiare un qubit, e cosa puoi fare invece.'), xp: 120 },

  // ---------- PARTE B — frecce, fasi, primi algoritmi ----------
  { id: '07-interferenza', part: 'B', n: 7,
    title: t('Interferenza: quando le possibilità si cancellano'),
    desc: t('Il meccanismo unico che sta sotto a ogni algoritmo quantistico.'), xp: 100 },

  { id: '08-frecce', part: 'B', n: 8,
    title: t('Le frecce: numeri complessi ed e^{iθ}'),
    desc: t('Quando il "più o meno" non basta più: fasi intermedie e rotazioni.'), xp: 120 },

  { id: '09-deutsch', part: 'B', n: 9,
    title: t('Oracoli e Deutsch–Jozsa'),
    desc: t('Il primo algoritmo che batte il classico: 1 domanda invece di 2^{n−1}+1.'), xp: 130 },

  { id: '10-bernstein', part: 'B', n: 10,
    title: t('Bernstein–Vazirani: la stringa segreta'),
    desc: t('Indovina n bit segreti con una sola interrogazione.'), xp: 110 },

  { id: '11-grover', part: 'B', n: 11,
    title: t('Grover: amplificare la risposta giusta'),
    desc: t('Guarda le barre delle ampiezze crescere passo dopo passo (e poi ricalare!).'), xp: 130 },

  { id: '12-simon', part: 'B', n: 12,
    title: t('Simon: il periodo nascosto'),
    desc: t('Il primo vantaggio ESPONENZIALE dimostrato. E il ponte diretto verso Shor.'), xp: 150 },

  // ---------- PARTE C — onde e Fourier, just-in-time ----------
  { id: '13-onde', part: 'C', n: 13,
    title: t('L\'onda: ampiezza, periodo, frequenza'),
    desc: t('Ci serve per il passo successivo. Muovi i cursori e senti cosa cambia.'), xp: 80 },

  { id: '14-fase', part: 'C', n: 14,
    title: t('La fase delle onde e i battimenti'),
    desc: t('La stessa onda, spostata: dalla fase del qubit alla fase delle onde.'), xp: 80 },

  { id: '15-somma-onde', part: 'C', n: 15,
    title: t('Ogni segnale è una somma di onde'),
    desc: t('Sfida: ricostruisci il segnale misterioso mescolando onde semplici.'), xp: 90 },

  { id: '15b-serie', part: 'C', n: '15·b',
    title: t('Tante cose sommate: quando si accumulano e quando si annullano'),
    desc: t('La serie geometrica giocata con i pezzi e con le frecce. È la ragione per cui la trasformata di Fourier fa un picco.'), xp: 100 },

  { id: '16-dft', part: 'C', n: 16,
    title: t('La DFT passo passo: il rilevatore di periodicità'),
    desc: t('La formula smontata pezzo per pezzo, con le frecce che vedi ruotare.'), xp: 140 },

  { id: '17-fft', part: 'C', n: 17,
    title: t('FFT: perché il computer ci mette N·log N'),
    desc: t('Dividi et impera: da N² a N·log N, contato operazione per operazione.'), xp: 80 },

  // ---------- PARTE D — il cuore ----------
  { id: '18-qft', part: 'D', n: 18,
    title: t('QFT: Fourier sulle ampiezze quantistiche'),
    desc: t('Il cuore del corso: dalla DFT al circuito con Hadamard, rotazioni controllate e SWAP.'), xp: 200 },

  { id: '18b-autovettori', part: 'D', n: '18·b',
    title: t('Le frecce che la macchina non gira: autovettori e autovalori'),
    desc: t('Trascina finché la freccia non resta in linea con sé stessa. E scopri che su quelle frecce una porta cambia solo la fase.'), xp: 130 },

  { id: '19-qpe', part: 'D', n: 19,
    title: t('Quantum Phase Estimation'),
    desc: t('Leggere una fase nascosta come numero binario: la QFT usata al contrario.'), xp: 150 },

  { id: '20-shor', part: 'D', n: 20, boss: true,
    title: t('BOSS — Shor: dal periodo ai fattori'),
    desc: t('Fattorizza 15 e 21 con le tue mani: periodo, picchi, frazioni continue, MCD.'), xp: 250 },

  { id: '21-rumore', part: 'D', n: 21,
    title: t('Rumore, decoerenza e correzione d\'errore'),
    desc: t('Perché non hai ancora un computer quantistico in tasca. E come si combatte.'), xp: 130 },

  { id: '21b-variazionale', part: 'D', n: '21·b',
    title: t('La pendenza e il quantistico che gira oggi: VQE'),
    desc: t('La derivata giocata come pendenza, e la discesa che i computer quantistici veri fanno adesso, rumore compreso.'), xp: 140 },

  { id: '22-officina', part: 'D', n: 22, boss: true,
    title: t('OFFICINA — inventa il tuo algoritmo'),
    desc: t('Sandbox creativa: monta blocchi, scegli una sfida, misura, batti il tuo record.'), xp: 300 },

  { id: '23-glossario', part: 'D', n: 23,
    title: t('Glossario e mappa completa'),
    desc: t('Tutti i termini in una pagina, con il filo che li collega dall\'inizio alla fine.'), xp: 120 },

  { id: '24-esame', part: 'D', n: 24, boss: true,
    title: t('ESAME FINALE — attestato di completamento'),
    desc: t('Tutte le domande del corso, in una volta sola. Dall\'80% in su generi il tuo attestato.'), xp: 300 },
];

/* Indirizzi: derivati dall'id, così una lingua nuova non può dimenticarsi
   un file a metà elenco. `slug` è il nome nudo (serve alla navigazione fra
   lezioni vicine, che sono nella stessa cartella), `file` è il percorso
   visto dalla home della lingua. */
LEVELS.forEach(l => {
  l.slug = slugOf(l.id);
  l.file = `${LESSON_DIR}/${l.slug}.html`;
});

/**
 * L'indirizzo di un livello, dalla radice del sito.
 *
 * Perché non si usa `l.file` così com'è: quello è un indirizzo RELATIVO, e
 * dove porta dipende da come è scritto l'indirizzo della pagina in cui sta.
 * La home inglese si raggiunge sia come /en/ sia come /en — l'.htaccess
 * toglie la barra finale con un 301, quindi è la SECONDA forma quella in cui
 * ci si ritrova davvero — e da /en il link «lessons/01-qubit.html» punta a
 * /lessons/01-qubit.html, che non esiste. Erano tutte le carte della mappa e
 * il bottone «Continua», rotti in inglese e in spagnolo.
 *
 * Con ROOT davanti l'indirizzo è lo stesso da qualunque pagina si parta.
 */
export function lessonHref(level) {
  return ROOT + PREFIX + level.file;
}

export const TOTAL_XP = LEVELS.reduce((s, l) => s + l.xp, 0);

/* Parti FACOLTATIVE: si giocano quando si vuole, non sbloccano niente e non
   vengono sbloccate da niente.

   Sono due, e per lo stesso motivo: contengono i prerequisiti, non il corso.
   La Parte 0 è la matematica delle medie, la Parte K è il computer classico.
   Chi le sa già le salta senza pagare pegno; chi ha dei buchi ci torna nel
   momento in cui il buco si fa sentire — che è il momento in cui si impara
   davvero, e non due settimane prima "perché è nel programma".

   Tenerle fuori dalla catena ha anche un effetto pratico che vale da solo:
   una parte nuova aggiunta qui in mezzo non richiude i livelli a chi era già
   a metà corso. */
export const OPTIONAL_PARTS = ['0', 'K'];

/** Un livello del percorso principale, cioè quello che va superato in ordine. */
export const isMain = l => !OPTIONAL_PARTS.includes(l.part);

/* Prerequisiti: ogni livello del percorso principale richiede la PADRONANZA
   del precedente. Parti facoltative e livello 1 sono sempre aperti. */
const MAIN = LEVELS.filter(isMain);
LEVELS.forEach(l => { l.req = null; });
MAIN.forEach((l, i) => { if (i > 0 && !l.open) l.req = MAIN[i - 1].id; });

export function levelById(id) { return LEVELS.find(l => l.id === id) || null; }

/**
 * Il numero mostrato di un livello, a partire dal suo id.
 *
 * Serve ai testi che rimandano ad altri livelli — il glossario ne ha
 * trentasei. Scritti a mano si scollegano al primo riordino: quindici voci
 * puntavano ancora alla numerazione di prima che nascesse Simon, e mandavano
 * chi cercava «QFT» al livello 17, che è la FFT. Scritti così non possono.
 */
export function nOf(id) {
  const lv = levelById(id);
  return lv ? String(lv.n) : '?';
}

export function neighbours(id) {
  const i = LEVELS.findIndex(l => l.id === id);
  return { prev: i > 0 ? LEVELS[i - 1] : null, next: i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null };
}

export const RANKS = [
  { xp: 0,    name: t('Curioso') },
  { xp: 200,  name: t('Domatore di qubit') },
  { xp: 500,  name: t('Signore delle frecce') },
  { xp: 900,  name: t('Cacciatore di interferenze') },
  { xp: 1400, name: t('Analista di Fourier') },
  { xp: 1900, name: t('Ingegnere di circuiti') },
  { xp: 2400, name: t('Cacciatore di periodi') },
  { xp: 2900, name: t('Quantum Wizard') },
  { xp: 3400, name: t('Inventore di algoritmi') },
];

export function rankFor(xp) {
  let r = RANKS[0];
  for (const c of RANKS) if (xp >= c.xp) r = c;
  return r;
}
