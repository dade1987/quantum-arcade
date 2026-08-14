/* ============================================================
   ENGLISH — interface strings.

   The key is the Italian sentence as it appears in the source: see
   js/core/i18n.js for why. A missing entry falls back to Italian, so
   adding a string to the game never breaks this file — it just leaves
   one sentence untranslated until someone fills it in.

   `npm run languages` lists what is missing here.
   ============================================================ */

export default {
  /* ---------------- map, parts, ranks ---------------- */
  'Parte 0 — Le basi (per chi parte proprio da zero)': 'Part 0 — The basics (for absolute beginners)',
  "Numeri, percentuali, coordinate, gradi, seno e coseno, probabilità, contare a giri, matrici, equazioni (anche di secondo grado), logaritmi e prodotto scalare. Dalle medie in su. Facoltativa se le sai già.":
    "Numbers, percentages, coordinates, degrees, sine and cosine, probability, counting in circles, matrices, equations (quadratics included), logarithms and the dot product. Middle school and up. Optional if you already know them.",
  'Parte A — Il qubit, subito': 'Part A — The qubit, right away',
  'Sovrapposizione, misura, porte, entanglement, circuiti. Con ampiezze positive e negative: nessuna matematica difficile.':
    'Superposition, measurement, gates, entanglement, circuits. With positive and negative amplitudes: no hard maths.',
  'Parte B — Frecce, fasi e primi algoritmi': 'Part B — Arrows, phases and first algorithms',
  'Il segno non basta più: arrivano le frecce (numeri complessi). E i primi algoritmi che battono il computer classico.':
    'A sign is no longer enough: enter the arrows (complex numbers). And the first algorithms that beat a classical computer.',
  "Parte C — Onde e Fourier (l'attrezzo che ci manca)": 'Part C — Waves and Fourier (the tool we still need)',
  'Ora che sappiamo cosa vogliamo fare, impariamo lo strumento: onde, frequenze, trasformata di Fourier.':
    'Now that we know what we want to do, we learn the tool: waves, frequencies, the Fourier transform.',
  'Parte D — Il cuore: QFT, Shor e invenzione': 'Part D — The heart: QFT, Shor and invention',
  "Tutto si unisce. E alla fine si inventa il proprio algoritmo e si dà l'esame.":
    'Everything comes together. And at the end you invent your own algorithm and sit the exam.',

  'Curioso': 'Curious',
  'Domatore di qubit': 'Qubit tamer',
  'Signore delle frecce': 'Lord of the arrows',
  'Cacciatore di interferenze': 'Interference hunter',
  'Analista di Fourier': 'Fourier analyst',
  'Ingegnere di circuiti': 'Circuit engineer',
  'Cacciatore di periodi': 'Period hunter',
  'Quantum Wizard': 'Quantum Wizard',
  'Inventore di algoritmi': 'Algorithm inventor',

  /* ---------------- level titles and blurbs ---------------- */
  'Numeri: negativi, metà, doppi, quadrati': 'Numbers: negatives, halves, doubles, squares',
  'Linea dei numeri, percentuali, potenze di 2 e radice quadrata. Tutto giocato.':
    'The number line, percentages, powers of 2 and square roots. All played, not read.',
  'Griglia, frecce e gradi': 'Grid, arrows and degrees',
  'Coordinate come in battaglia navale e il giro completo di 360°.':
    'Coordinates like in Battleship, and the full 360° turn.',
  'Seno e coseno senza triangoli': 'Sine and cosine without triangles',
  'Le due ombre di un punto che gira. Il ponte fra i gradi e le onde.':
    'The two shadows of a spinning point. The bridge between degrees and waves.',
  'Il caso: monete, dadi, probabilità': 'Chance: coins, dice, probability',
  'Lancia, conta, scopri che le percentuali si sistemano da sole.':
    'Toss, count, and watch the percentages settle by themselves.',

  "Il qubit: cos'è davvero": 'The qubit: what it really is',
  'Fotoni, filtri polaroid, ampiezze e la differenza vera con una moneta truccata.':
    'Photons, polaroid filters, amplitudes, and the real difference from a loaded coin.',
  'La sfera di Bloch e la misura': 'The Bloch sphere and measurement',
  'Ruota la sfera col mouse, misura, guarda il collasso.':
    'Spin the sphere with the mouse, measure, watch it collapse.',
  'Le porte: X, Z, H e le rotazioni': 'Gates: X, Z, H and rotations',
  'Ogni porta è una rotazione. E H·Z·H = X è già mezzo algoritmo.':
    'Every gate is a rotation. And H·Z·H = X is already half an algorithm.',
  'Due qubit, CNOT ed entanglement': 'Two qubits, CNOT and entanglement',
  'Da 2 ampiezze a 4. Stati di Bell e correlazioni impossibili.':
    'From 2 amplitudes to 4. Bell states and impossible correlations.',
  'Il laboratorio dei circuiti': 'The circuit laboratory',
  'Sandbox: costruisci circuiti a 3 qubit, simula, misura, sperimenta.':
    'Sandbox: build 3-qubit circuits, simulate, measure, experiment.',
  'No-cloning, teletrasporto e dense coding': 'No-cloning, teleportation and dense coding',
  'Perché non puoi copiare un qubit, e cosa puoi fare invece.':
    'Why you cannot copy a qubit, and what you can do instead.',

  'Interferenza: quando le possibilità si cancellano': 'Interference: when possibilities cancel out',
  'Il meccanismo unico che sta sotto a ogni algoritmo quantistico.':
    'The single mechanism underneath every quantum algorithm.',
  'Le frecce: numeri complessi ed e^{iθ}': 'Arrows: complex numbers and e^{iθ}',
  'Quando il "più o meno" non basta più: fasi intermedie e rotazioni.':
    'When "plus or minus" is no longer enough: in-between phases and rotations.',
  'Oracoli e Deutsch–Jozsa': 'Oracles and Deutsch–Jozsa',
  'Il primo algoritmo che batte il classico: 1 domanda invece di 2^{n−1}+1.':
    'The first algorithm that beats the classical one: 1 query instead of 2^{n−1}+1.',
  'Bernstein–Vazirani: la stringa segreta': 'Bernstein–Vazirani: the secret string',
  'Indovina n bit segreti con una sola interrogazione.': 'Guess n secret bits with a single query.',
  'Grover: amplificare la risposta giusta': 'Grover: amplifying the right answer',
  'Guarda le barre delle ampiezze crescere passo dopo passo (e poi ricalare!).':
    'Watch the amplitude bars grow step after step (and then shrink again!).',
  'Simon: il periodo nascosto': 'Simon: the hidden period',
  'Il primo vantaggio ESPONENZIALE dimostrato. E il ponte diretto verso Shor.':
    'The first proven EXPONENTIAL speed-up. And the direct bridge to Shor.',

  "L'onda: ampiezza, periodo, frequenza": 'The wave: amplitude, period, frequency',
  'Ci serve per il passo successivo. Muovi i cursori e senti cosa cambia.':
    'We need it for the next step. Move the sliders and hear what changes.',
  'La fase delle onde e i battimenti': 'Wave phase and beats',
  'La stessa onda, spostata: dalla fase del qubit alla fase delle onde.':
    'The same wave, shifted: from the phase of a qubit to the phase of a wave.',
  'Ogni segnale è una somma di onde': 'Every signal is a sum of waves',
  'Sfida: ricostruisci il segnale misterioso mescolando onde semplici.':
    'Challenge: rebuild the mystery signal by mixing simple waves.',
  'La DFT passo passo: il rilevatore di periodicità': 'The DFT step by step: the periodicity detector',
  'La formula smontata pezzo per pezzo, con le frecce che vedi ruotare.':
    'The formula taken apart piece by piece, with arrows you can watch spin.',
  'FFT: perché il computer ci mette N·log N': 'FFT: why a computer takes N·log N',
  'Dividi et impera: da N² a N·log N, contato operazione per operazione.':
    'Divide and conquer: from N² to N·log N, counted operation by operation.',

  'QFT: Fourier sulle ampiezze quantistiche': 'QFT: Fourier on quantum amplitudes',
  'Il cuore del corso: dalla DFT al circuito con Hadamard, rotazioni controllate e SWAP.':
    'The heart of the course: from the DFT to the circuit with Hadamard, controlled rotations and SWAP.',
  'Quantum Phase Estimation': 'Quantum Phase Estimation',
  'Leggere una fase nascosta come numero binario: la QFT usata al contrario.':
    'Reading a hidden phase as a binary number: the QFT used backwards.',
  'BOSS — Shor: dal periodo ai fattori': 'BOSS — Shor: from period to factors',
  'Fattorizza 15 e 21 con le tue mani: periodo, picchi, frazioni continue, MCD.':
    'Factor 15 and 21 with your own hands: period, peaks, continued fractions, GCD.',
  "Rumore, decoerenza e correzione d'errore": 'Noise, decoherence and error correction',
  'Perché non hai ancora un computer quantistico in tasca. E come si combatte.':
    'Why you do not have a quantum computer in your pocket yet. And how we fight back.',
  'OFFICINA — inventa il tuo algoritmo': 'WORKSHOP — invent your own algorithm',
  'Sandbox creativa: monta blocchi, scegli una sfida, misura, batti il tuo record.':
    'Creative sandbox: stack blocks, pick a challenge, measure, beat your own record.',
  'Glossario e mappa completa': 'Glossary and full map',
  "Tutti i termini in una pagina, con il filo che li collega dall'inizio alla fine.":
    'Every term on one page, with the thread that links them from beginning to end.',
  'ESAME FINALE — attestato di completamento': 'FINAL EXAM — certificate of completion',
  "Tutte le domande del corso, in una volta sola. Dall'80% in su generi il tuo attestato.":
    'Every question in the course, all at once. Score 80% or more and you generate your certificate.',

  /* ---------------- topbar, map, home ---------------- */
  'informatica quantistica giocando': 'quantum computing by playing',
  'Cambia lingua': 'Change language',
  'cambia lingua': 'change language',
  'Mappa': 'Map',
  'percorso': 'breadcrumb',
  'Livello :n': 'Level :n',
  'LIVELLO :n': 'LEVEL :n',
  ':fatti/:totali superati': ':fatti/:totali passed',
  'Si apre superando il livello :n': 'Unlocked by passing level :n',
  'superato': 'passed',
  'gioca': 'play',
  'chiuso': 'locked',
  'Sei <b>:grado</b> · :xp XP · :fatti/:totali livelli superati':
    'You are a <b>:grado</b> · :xp XP · :fatti/:totali levels passed',
  ' — si comincia quando vuoi.': ' — start whenever you like.',
  'Continua — livello :n: :titolo': 'Continue — level :n: :titolo',
  'Inizia dal livello 1': 'Start from level 1',
  'Azzerare tutti i progressi (XP, livelli, quiz, ripasso)?':
    'Reset all progress (XP, levels, quizzes, review)?',
  'Qui compariranno le domande dei livelli che hai già giocato, riproposte <b>a distanza di giorni</b>: è il modo più efficace, secondo la ricerca, per non dimenticarle. Gioca un livello e torna qui.':
    'This is where the questions from levels you have played will show up, asked again <b>days apart</b>: the most effective way, according to research, not to forget them. Play a level and come back.',
  'Nessuna domanda in scadenza. Hai <b>:quante</b> domande nel mazzo: torna fra qualche giorno e te le riproporrò al momento giusto.':
    'Nothing due right now. You have <b>:quante</b> questions in the deck: come back in a few days and I will ask them at the right moment.',
  'Ripasso finito. Ottimo lavoro: ogni richiamo a memoria rende il ricordo più solido.':
    'Review done. Nice work: every recall from memory makes the memory stronger.',
  'domanda :i di :totali · dal livello :livello': 'question :i of :totali · from level :livello',

  /* ---------------- lesson scaffolding ---------------- */
  'Missione': 'Mission',
  'missione': 'mission',
  'completata': 'completed',
  'in corso…': 'in progress…',
  'Controllo rapido': 'Quick check',
  "Rispondere a memoria — anche sbagliando — fa imparare più che rileggere. Se sbagli, riprova: non c'è nessuna penalità.":
    'Answering from memory — even getting it wrong — teaches you more than re-reading. If you miss, try again: there is no penalty.',
  'riprova': 'try again',
  'risposta esatta': 'correct answer',
  'livello superato': 'level passed',
  'Livello superato': 'Level passed',
  'Prova di padronanza': 'Mastery check',
  'Hai dimostrato di saperlo <b>fare</b> e di saperlo <b>spiegare</b>. Il livello successivo è sbloccato.':
    'You have shown you can <b>do</b> it and <b>explain</b> it. The next level is unlocked.',
  'Per sbloccare il livello successivo servono due cose: averlo fatto nel gioco e saperlo richiamare a memoria. Nessuna fretta e nessun punteggio negativo.':
    'Two things unlock the next level: having done it in the game, and being able to recall it from memory. No rush, and no negative marking.',
  'Missioni completate: <b>:fatte/:totali</b>': 'Missions completed: <b>:fatte/:totali</b>',
  'Domande risposte correttamente: <b>:fatte/:totali</b>': 'Questions answered correctly: <b>:fatte/:totali</b>',
  'Livello di sola lettura: nessuna prova richiesta.': 'Reading-only level: no check required.',
  'Vai al livello :n: :titolo': 'Go to level :n: :titolo',
  'Sei bloccato? Torna sul mini-gioco del passo corrispondente: la risposta si vede muovendo i cursori. In alternativa, dalla mappa puoi attivare la <b>modalità libera</b> (per adulti curiosi o per rivedere).':
    'Stuck? Go back to the mini-game in the matching step: the answer shows up as you move the sliders. Otherwise, from the map you can switch on <b>free mode</b> (for curious adults, or for revision).',
  'non ho capito questo passaggio': 'I did not understand this step',
  'grazie, segnalato': 'thanks, noted',
  'Non ho capito il passaggio ":titolo". Me lo rispieghi in modo più semplice, senza formule?':
    'I did not understand the step ":titolo". Could you explain it again more simply, without formulas?',
  'Livello ancora chiuso': 'Level still locked',
  'Per aprire questo livello devi prima superare la prova del livello <b>:livello</b>. È così apposta: ogni livello usa gli attrezzi costruiti nel precedente, e saltarli rende tutto più difficile del necessario.':
    'To open this level you first have to pass the check for level <b>:livello</b>. That is on purpose: every level uses the tools built in the previous one, and skipping them makes everything harder than it needs to be.',
  'Vai al livello richiesto': 'Go to the required level',
  'Modalità libera (adulti/ripasso)': 'Free mode (adults / revision)',
  'Widget non caricato: :errore': 'Widget failed to load: :errore',
  'Come è fatto questo corso': 'How this course is made',
  'Torna alla mappa': 'Back to the map',

  /* ---------------- formula and stepper ---------------- */
  'Tocca un pezzo della formula per capire cosa fa.': 'Tap a piece of the formula to see what it does.',
  'Fatto!': 'Done!',
  'Avanti': 'Next',
  'passo :i di :totali': 'step :i of :totali',
  'reale': 'real',
  'immag.': 'imag.',

  /* ---------------- sound ---------------- */
  'Attiva/disattiva i suoni': 'Turn sound on/off',
  'Attiva o disattiva i suoni': 'Turn sound on or off',

  /* ---------------- account ---------------- */
  'Entra': 'Sign in',
  'Account': 'Account',
  'solo locale': 'local only',
  'Backend non raggiungibile: i progressi restano in questo browser':
    'Backend unreachable: your progress stays in this browser',
  'Email da confermare': 'Email not confirmed yet',
  'Crea il mio account': 'Create my account',
  'Crea il tuo account': 'Create your account',
  "Nome e cognome servono perché finiscono sull'attestato finale, che è verificabile pubblicamente. Nient'altro ti verrà chiesto.":
    'Your first and last name are needed because they go on the final certificate, which anyone can verify. Nothing else will be asked of you.',
  'Nome': 'First name',
  'Nome *': 'First name *',
  'Cognome': 'Last name',
  'Cognome *': 'Last name *',
  'Data di nascita': 'Date of birth',
  "facoltativa: distingue gli omonimi sull'attestato":
    'optional: it tells apart people with the same name on the certificate',
  'Email': 'Email',
  'Email *': 'Email *',
  'ti mando un link per confermarla': 'I will send you a link to confirm it',
  'Password': 'Password',
  'Password *': 'Password *',
  'almeno 8 caratteri, con lettere e numeri': 'at least 8 characters, with letters and numbers',
  'Ripeti password *': 'Repeat password *',
  'Ho letto l\'<a href=":privacy" target="_blank">informativa privacy</a> e accetto il trattamento dei dati per l\'accesso al corso e l\'emissione dell\'attestato.':
    'I have read the <a href=":privacy" target="_blank">privacy notice</a> and I consent to my data being processed so I can access the course and be issued the certificate.',
  'Ho già un account': 'I already have an account',
  'Non ho un account': "I don't have an account",
  "Nome e cognome sono obbligatori: senza, l'attestato non si può emettere.":
    'First and last name are required: without them the certificate cannot be issued.',
  'Serve la tua email.': 'Your email is required.',
  'La password deve avere almeno 8 caratteri.': 'The password must be at least 8 characters long.',
  'Le due password non coincidono.': 'The two passwords do not match.',
  "Devi accettare l'informativa privacy.": 'You have to accept the privacy notice.',
  "Creo l'account…": 'Creating your account…',
  'Ci sei!': "You're in!",
  "Account creato per <b>:nome</b>. Ti ho mandato un'email a <b>:email</b>: confermala quando vuoi — serve per l'attestato, non per giocare.":
    'Account created for <b>:nome</b>. I sent an email to <b>:email</b>: confirm it whenever you like — it is needed for the certificate, not for playing.',
  'Comincia a giocare': 'Start playing',
  "Il server non risponde: se stai aprendo i file in locale senza PHP, l'account non è disponibile.":
    'The server is not responding: if you are opening the files locally without PHP, accounts are not available.',
  'Bentornato': 'Welcome back',
  'Scrivi prima la tua email, poi ti mando il link.': 'Type your email first, then I will send you the link.',
  'Password dimenticata? Ti mando un link di accesso': 'Forgot your password? I will send you a sign-in link',
  'Servono email e password.': 'Email and password are both required.',
  "Email confermata: adesso puoi anche ottenere l'attestato.":
    'Email confirmed: now you can also get your certificate.',
  'Quel link era scaduto o già usato. Accedi con la password, oppure fattene mandare un altro.':
    'That link had expired or was already used. Sign in with your password, or ask for a new one.',
  'Il tuo account': 'Your account',
  'email confermata': 'email confirmed',
  'email da confermare': 'email not confirmed',
  "<b>Conferma l'email</b> per poter sostenere l'esame e ottenere l'attestato.":
    '<b>Confirm your email</b> so you can sit the exam and get the certificate.',
  "Rimanda l'email": 'Resend the email',
  'Dati aggiornati.': 'Details updated.',
  'Salva i dati': 'Save details',
  'Esci': 'Sign out',
  'Elimino account, progressi, attestato e conversazioni con il tutor. È definitivo. Procedo?':
    'This deletes your account, progress, certificate and tutor conversations. It is permanent. Go ahead?',
  'Elimina tutto': 'Delete everything',
  'Chiudi': 'Close',
  'XP attuali: :xp · i progressi vengono salvati sul server automaticamente.':
    'Current XP: :xp · progress is saved to the server automatically.',
  'Serve il tuo account': 'You need an account',
  "Per giocare <b>:livello</b> devi essere registrato. Non è per raccogliere dati: è perché i progressi si salvano <b>sul server</b> e l'attestato finale riporta nome, cognome e un codice che chiunque può verificare.":
    'To play <b>:livello</b> you need to be registered. It is not about collecting data: it is because progress is saved <b>on the server</b>, and the final certificate carries your name, surname and a code anyone can verify.',
  '<b>Ti servono 30 secondi:</b> nome, cognome, email e password.':
    '<b>It takes 30 seconds:</b> first name, last name, email and password.',
  '<b>I progressi ti seguono</b> su computer, tablet e telefono.':
    '<b>Your progress follows you</b> across computer, tablet and phone.',
  '<b>Zero pubblicità, zero profilazione.</b> Puoi cancellare tutto con un click.':
    '<b>Zero ads, zero profiling.</b> You can delete everything with one click.',
  'Crea account (gratis)': 'Create account (free)',
  'Come tratto i dati': 'How I handle your data',
  'giorno': 'day',
  'mese': 'month',
  'anno': 'year',
  'gennaio': 'January',
  'febbraio': 'February',
  'marzo': 'March',
  'aprile': 'April',
  'maggio': 'May',
  'giugno': 'June',
  'luglio': 'July',
  'agosto': 'August',
  'settembre': 'September',
  'ottobre': 'October',
  'novembre': 'November',
  'dicembre': 'December',

  /* ---------------- network ---------------- */
  'Server non raggiungibile': 'Server unreachable',
  'Errore :codice': 'Error :codice',
  'Punti esperienza': 'Experience points',

  /* ---------------- widgets, screens and the tutor ---------------- */
  "  DFT diretta : <span class=\"p\">:quante</span> moltiplicazioni":
    "  direct DFT : <span class=\"p\">:quante</span> multiplications",
  "  FFT         : <span class=\"a\">:quante</span> \"farfalle\"  → :volte× più veloce della DFT":
    "  FFT        : <span class=\"a\">:quante</span> \"butterflies\"  → :volte× faster than the DFT",
  "  QFT         : <span class=\"g\">:quante</span> porte quantistiche":
    "  QFT        : <span class=\"g\">:quante</span> quantum gates",
  "\"che lato serve per questa area?\"":
    "\"what side gives this area?\"",
  "(0° = in fase · 180° = in opposizione)":
    "(0° = in phase · 180° = in opposition)",
  "(:quante per n=:n) — la DFT classica su :N numeri ne farebbe :classiche.":
    "(:quante for n=:n) — the classical DFT on :N numbers would do :classiche.",
  "(adesso sei a :gradi°, dove il :quale vale :valore)":
    "(right now you are at :gradi°, where the :quale is :valore)",
  "(doppio)":
    "(double)",
  "(giusto!)":
    "(correct!)",
  "(la FASE)":
    "(the PHASE)",
  "(la FASE, giro sull'equatore)":
    "(the PHASE, turn around the equator)",
  "(lunghezza sempre = 1)":
    "(length always = 1)",
  "(metà)":
    "(half)",
  "(mezzo giro)":
    "(half a turn)",
  "(punto di partenza)":
    "(starting point)",
  "(quanto è \"giù\")":
    "(how far \"down\" it is)",
  "(regola: probabilità = |ampiezza|², cioè lunghezza della freccia al quadrato)":
    "(rule: probability = |amplitude|², that is, the arrow's length squared)",
  "(sempre)":
    "(always)",
  "(tre quarti)":
    "(three quarters)",
  "(un quarto di giro)":
    "(a quarter turn)",
  "(vuota — aggiungi blocchi qui sotto)":
    "(empty — add blocks below)",
  "+3 iterazioni (guarda cosa succede)":
    "+3 iterations (watch what happens)",
  "1 ciclo":
    "1 cycle",
  "1 problema da 8":
    "1 problem of size 8",
  "1° → 3° (in mezzo): cos²(:gradi°) = :percento%":
    "1st → 3rd (in the middle): cos²(:gradi°) = :percento%",
  "2 moltiplicato per sé stesso :n volte:":
    "2 multiplied by itself :n times:",
  "3 cicli":
    "3 cycles",
  "3° → 2°: cos²(:gradi°) = :percento%":
    "3rd → 2nd: cos²(:gradi°) = :percento%",
  ":lanci lanci — la riga tratteggiata è la probabilità teorica (:percento%)":
    ":lanci tosses — the dashed line is the theoretical probability (:percento%)",
  ":lanci lanci — tratteggio = teoria (:percento%)":
    ":lanci tosses — dashed = theory (:percento%)",
  ":medi tentativi in media, :peggiore nel caso peggiore":
    ":medi attempts on average, :peggiore in the worst case",
  ":n qubit → :quante possibilità contemporanee":
    ":n qubits → :quante simultaneous possibilities",
  ":passi passi a DESTRA":
    ":passi steps to the RIGHT",
  ":passi passi a SINISTRA":
    ":passi steps to the LEFT",
  ":passi passi in GIÙ":
    ":passi steps DOWN",
  ":passi passi in SU":
    ":passi steps UP",
  ":quante frecce, ognuna lunga 1":
    ":quante arrows, each of length 1",
  ":quante interrogazioni":
    ":quante queries",
  ":quante interrogazioni nel caso peggiore":
    ":quante queries in the worst case",
  ":quante misure":
    ":quante measurements",
  ":quante onde sommate (armoniche dispari fino a :max)":
    ":quante waves added up (odd harmonics up to :max)",
  ":quanti problemi da :quanto":
    ":quanti problems of size :quanto",
  ":quanti qubit → :valori valori":
    ":quanti qubits → :valori values",
  "<b>:esatte/:totali</b> risposte esatte (:percento%) in circa :minuti minuti.":
    "<b>:esatte/:totali</b> correct answers (:percento%) in about :minuti minutes.",
  "<b>ATTENZIONE al trucco:</b> la FFT ti restituisce <b>tutti</b> i :N numeri, e li puoi leggere.":
    "<b>MIND THE CATCH:</b> the FFT hands you back <b>all</b> :N numbers, and you can read them.",
  "<b>Adesso il nome:</b> quello che hai appena mosso si chiama <b>ampiezza</b>, e l'area del quadrato — cioè l'ampiezza moltiplicata per sé stessa — è la <b>probabilità</b> di ottenere quel risultato quando misuri. Si scrive <code>|ampiezza|²</code>: sono le stesse tre cose che hai davanti, scritte corte.":
    "<b>Now the name:</b> what you just moved is called an <b>amplitude</b>, and the area of the square — the amplitude times itself — is the <b>probability</b> of getting that outcome when you measure. It is written <code>|amplitude|²</code>: the same three things you have in front of you, written short.",
  "<b>Attenzione a cosa NON è:</b> nessuna materia si sposta e nessuna informazione viaggia più veloce della luce — servono i due <b>bit classici</b> telefonati a Bob, che viaggiano normalmente. E lo stato di partenza viene <b>distrutto</b> dalla misura: è un trasferimento, non una fotocopia. Il teorema di <b>no-cloning</b> resta salvo.":
    "<b>Careful about what it is NOT:</b> no matter moves and no information travels faster than light — you still need the two <b>classical bits</b> phoned over to Bob, and those travel normally. And the starting state is <b>destroyed</b> by the measurement: it is a transfer, not a photocopy. The <b>no-cloning</b> theorem is safe.",
  "<b>Attenzione al tranello:</b> con pochi lanci le percentuali ballano parecchio. Nel corso misureremo i qubit centinaia di volte proprio per questo: una misura sola non dice quasi nulla, tante misure disegnano la forma della probabilità.":
    "<b>Mind the trap:</b> with few tosses the percentages swing wildly. That is exactly why in this course we measure qubits hundreds of times: a single measurement says almost nothing, many measurements draw the shape of the probability.",
  "<b>Bersaglio:</b> ampiezza :a · frequenza :f · fase :p":
    "<b>Target:</b> amplitude :a · frequency :f · phase :p",
  "<b>DOPO la QFT</b> — restano solo i multipli di N/r":
    "<b>AFTER the QFT</b> — only the multiples of N/r survive",
  "<b>Da notare:</b> \"×2\" è un salto che raddoppia la distanza da zero, \"÷2\" la dimezza, \"×(−1)\" ti ribalta dall'altra parte. Fra poco useremo le stesse tre mosse su una <b>freccia</b> invece che su un punto: raddoppiarla, dimezzarla, girarla dall'altra parte.":
    "<b>Worth noticing:</b> \"×2\" is a jump that doubles your distance from zero, \"÷2\" halves it, \"×(−1)\" flips you to the other side. Soon we will use those same three moves on an <b>arrow</b> instead of a point: double it, halve it, turn it around.",
  "<b>Da provare:</b> metti r = 4 e muovi lo sfasamento da 0 a 3. Le barre in alto si spostano tutte… e quelle in basso restano identiche. Questa è l'invarianza che rende utilizzabile il risultato di una misura casuale.":
    "<b>Worth trying:</b> set r = 4 and move the offset from 0 to 3. The top bars all shift… and the bottom ones stay identical. That invariance is what makes the result of a random measurement usable.",
  "<b>Da qui nasce tutto:</b> se il punto continua a girare, la sua altezza disegna un'<b>onda</b> (il seno) e la sua ombra ne disegna un'altra (il coseno), identica ma <b>spostata di 90°</b>. Questa è la definizione di onda che useremo nel livello 1.":
    "<b>Everything starts here:</b> if the point keeps turning, its height draws a <b>wave</b> (the sine) and its shadow draws another one (the cosine), identical but <b>shifted by 90°</b>. That is the definition of a wave we will use in level 1.",
  "<b>Da ricordare:</b> e^{iθ} non è un numero \"strano\", è solo <b>la freccia lunga 1 che punta all'angolo θ</b>. La sua ombra orizzontale è il coseno, quella verticale è il seno.":
    "<b>Worth remembering:</b> e^{iθ} is not a \"weird\" number, it is just <b>the arrow of length 1 pointing at angle θ</b>. Its horizontal shadow is the cosine, its vertical one the sine.",
  "<b>Il confronto:</b> classicamente, nel caso peggiore, servono <b>:quante</b> domande per esserne certi. Quantisticamente ne basta <b>1</b>. Non perché il computer \"provi tutti i casi in parallelo e li legga\", ma perché l'oracolo scrive la risposta nelle <b>fasi</b> e le Hadamard finali fanno cancellare tutto tranne l'informazione che ci interessa.":
    "<b>The comparison:</b> classically, in the worst case, you need <b>:quante</b> queries to be sure. Quantumly <b>1</b> is enough. Not because the computer \"tries every case in parallel and reads them all\", but because the oracle writes the answer into the <b>phases</b> and the final Hadamards cancel everything except the information we care about.",
  "<b>Il conto che conta:</b> classicamente, per trovare un elemento fra :N servono in media :medi tentativi. Grover ne usa circa <b>√:N = :radice</b>. Non è esponenziale come Shor: è un guadagno \"quadratico\", ma vale per <b>qualsiasi</b> ricerca senza struttura.":
    "<b>The count that matters:</b> classically, finding one element among :N takes :medi attempts on average. Grover uses about <b>√:N = :radice</b>. It is not exponential like Shor: it is a \"quadratic\" gain, but it works for <b>any</b> unstructured search.",
  "<b>Manca solo la conferma dell'email.</b> Ti ho mandato un link quando ti sei registrato: cliccalo e torna qui. Serve perché l'attestato riporta i tuoi dati e deve essere collegato a un indirizzo reale.":
    "<b>Only the email confirmation is missing.</b> I sent you a link when you registered: click it and come back here. It matters because the certificate carries your details and has to be tied to a real address.",
  "<b>Nota fondamentale:</b> due stati possono avere le <b>stesse probabilità</b> ma <b>fase diversa</b> (stessa altezza sulla sfera, punto diverso sull'equatore). Le probabilità non li distinguono, ma un'altra porta H sì: è lì che vive tutta la potenza quantistica.":
    "<b>Key note:</b> two states can have the <b>same probabilities</b> but a <b>different phase</b> (same height on the sphere, different point around the equator). Probabilities cannot tell them apart, but another H gate can: that is where all the quantum power lives.",
  "<b>PRIMA</b> — lo stato \"a pettine\": ampiezze diverse da zero ogni r posizioni":
    "<b>BEFORE</b> — the \"comb\" state: non-zero amplitudes every r positions",
  "<b>Per sostenere l'esame serve il tuo account.</b> Le domande vengono dal server e la correzione la fa il server: è così che l'attestato diventa verificabile da chiunque, invece di essere un'immagine che ognuno può fabbricarsi.":
    "<b>You need an account to sit the exam.</b> The questions come from the server and the server grades them: that is what makes the certificate verifiable by anyone, instead of an image anyone could make up.",
  "<b>Perché ci serve:</b> nel corso, \"fase\" vorrà dire esattamente questo — <b>a che punto del giro sei</b>. E 360° sarà sempre uguale a 0°, perché dopo un giro completo sei tornato al punto di partenza.":
    "<b>Why we need it:</b> in this course \"phase\" will mean exactly this — <b>where in the turn you are</b>. And 360° will always equal 0°, because after a full turn you are back where you started.",
  "<b>Perché ci servirà:</b> nel quantistico ogni possibilità ha una \"freccia\" (l'ampiezza) e la probabilità di vederla è <b>l'area del suo quadrato</b>. Ampiezza 0,7 → probabilità 0,49 ≈ 50%. Ampiezza 1/√2 ≈ 0,71 → probabilità esattamente 0,5.":
    "<b>Why we will need it:</b> in the quantum world every possibility has an \"arrow\" (the amplitude) and the probability of seeing it is <b>the area of its square</b>. Amplitude 0.7 → probability 0.49 ≈ 50%. Amplitude 1/√2 ≈ 0.71 → probability exactly 0.5.",
  "<b>Perché serve la parte quantistica:</b> trovare il periodo di a^x mod N classicamente costa tempo esponenziale nel numero di cifre di N. La QFT lo trasforma in picchi misurabili con un numero di operazioni polinomiale. Tutto il resto di Shor (MCD, frazioni continue) è matematica classica dell'Ottocento.":
    "<b>Why the quantum part is needed:</b> finding the period of a^x mod N classically costs time exponential in the number of digits of N. The QFT turns it into measurable peaks with a polynomial number of operations. Everything else in Shor (GCD, continued fractions) is nineteenth-century classical maths.",
  "<b>Perché una misura sola dà un'equazione:</b> dopo l'oracolo i due soli ingressi rimasti sono x₀ e x₀⊕s. Le Hadamard finali li fanno interferire, e le y per cui <b>y·s = 1</b> ricevono due contributi opposti che si <b>cancellano</b>. Sopravvivono solo le y con <b>y·s = 0</b>: ogni misura è una riga di un sistema lineare, e con n−1 righe indipendenti il periodo è tuo.":
    "<b>Why a single measurement gives an equation:</b> after the oracle the only two inputs left are x₀ and x₀⊕s. The final Hadamards make them interfere, and the y with <b>y·s = 1</b> receive two opposite contributions that <b>cancel</b>. Only the y with <b>y·s = 0</b> survive: every measurement is one row of a linear system, and with n−1 independent rows the period is yours.",
  "<b>Perché?</b> Dopo la prima H il qubit non è \"0 oppure 1 con il 50%\": è <b>entrambi con due ampiezze</b>.":
    "<b>Why?</b> After the first H the qubit is not \"0 or 1 at 50%\": it is <b>both, with two amplitudes</b>.",
  "<b>Prova la ricetta di Bell:</b> premi <b>H q0</b> e poi <b>CNOT q0→q1</b>. Ottieni |00⟩ + |11⟩: quando misuri, i due qubit escono <b>sempre uguali</b>, anche se prima nessuno dei due aveva un valore. Nota che le due sfere di Bloch si accorciano fino a sparire: l'informazione non è più nei singoli qubit, è <b>nella coppia</b>.":
    "<b>Try the Bell recipe:</b> press <b>H q0</b> and then <b>CNOT q0→q1</b>. You get |00⟩ + |11⟩: when you measure, the two qubits always come out <b>the same</b>, even though neither had a value before. Notice the two Bloch spheres shrink until they vanish: the information is no longer in the individual qubits, it is <b>in the pair</b>.",
  "<b>Prova:</b> muovi solo φ. Le probabilità NON cambiano… ma lo stato sì. Quella differenza invisibile è ciò che la prossima porta userà.":
    "<b>Try it:</b> move only φ. The probabilities do NOT change… but the state does. That invisible difference is what the next gate will use.",
  "<b>Regola d'oro dell'officina:</b> ogni algoritmo quantistico utile ha la stessa forma — <b>metti tutto in gioco</b> (H), <b>scrivi l'informazione nelle fasi</b> (oracolo), <b>fai interferire</b> (diffusore, QFT), <b>misura</b>. Quello che cambia è solo il terzo passo. Se inventi un terzo passo nuovo, hai inventato un algoritmo.":
    "<b>The workshop's golden rule:</b> every useful quantum algorithm has the same shape — <b>put everything in play</b> (H), <b>write the information into the phases</b> (oracle), <b>make it interfere</b> (diffuser, QFT), <b>measure</b>. Only the third step changes. Invent a new third step and you have invented an algorithm.",
  "<b>⚛️ QUBIT</b> — applichi H due volte":
    "<b>⚛️ QUBIT</b> — you apply H twice",
  "<b>🪙 MONETA CLASSICA</b> — la mescoli due volte":
    "<b>🪙 CLASSICAL COIN</b> — you shuffle it twice",
  "A 90°":
    "At 90°",
  "A <b>:gradi°</b>:  coseno = <span class=\"a\">:coseno</span>   ·   seno = <span class=\"g\">:seno</span>":
    "At <b>:gradi°</b>:  cosine = <span class=\"a\">:coseno</span>   ·   sine = <span class=\"g\">:seno</span>",
  "A cosa serve davvero la QFT?":
    "What is the QFT actually for?",
  "ALLINEAMENTO PERFETTO":
    "PERFECT ALIGNMENT",
  "AREA":
    "AREA",
  "Adesso il bicchiere è pieno per <b>:percento%</b> = <b>:decimale</b> = <b>:frazione</b>":
    "The glass is now <b>:percento%</b> full = <b>:decimale</b> = <b>:frazione</b>",
  "Adesso la domanda vera: <b>riesci a farcela con meno?</b> Cambia pipeline e riprova.":
    "Now the real question: <b>can you do it with fewer?</b> Change the pipeline and try again.",
  "Aggiungendo un filtro la luce passa DI PIÙ, non di meno!":
    "Adding a filter lets MORE light through, not less!",
  "Aggiungere un qubit di lettura <b>raddoppia la precisione</b>: da :prima a :dopo.":
    "Adding one read-out qubit <b>doubles the precision</b>: from :prima to :dopo.",
  "Alice \"mescola\" il suo qubit con la sua metà della coppia: CNOT q0→q1.":
    "Alice \"mixes\" her qubit with her half of the pair: CNOT q0→q1.",
  "Alice MISURA q0 e q1: ottiene due bit classici. Il suo stato originale è ormai distrutto.":
    "Alice MEASURES q0 and q1: she gets two classical bits. Her original state is now destroyed.",
  "Alice applica H su q0.":
    "Alice applies H to q0.",
  "Alice telefona a Bob e gli detta i due bit. Bob applica le correzioni (X e/o Z) su q2.":
    "Alice phones Bob and reads him the two bits. Bob applies the corrections (X and/or Z) to q2.",
  "Ampiezza <b>A</b>":
    "Amplitude <b>A</b>",
  "Ampiezza <b>A</b> — quanto è \"alta\" l'onda":
    "Amplitude <b>A</b> — how \"tall\" the wave is",
  "Ampiezza <b>B</b>":
    "Amplitude <b>B</b>",
  "Anche una forma con gli <b>spigoli</b> si ottiene sommando onde tonde. Servono infinite onde per farla perfetta, ma con 10 ci siamo quasi. Formula: onda quadra = (4/π)·[sin(2πt) + ⅓sin(6πt) + ⅕sin(10πt) + …]":
    "Even a shape with <b>sharp corners</b> comes out of adding round waves. It takes infinitely many to make it perfect, but with 10 we are nearly there. Formula: square wave = (4/π)·[sin(2πt) + ⅓sin(6πt) + ⅕sin(10πt) + …]",
  "Angoli: il giro completo è 360°":
    "Angles: a full turn is 360°",
  "Angolo":
    "Angle",
  "Angolo <b>θ</b>":
    "Angle <b>θ</b>",
  "Appena applicata:":
    "Just applied:",
  "Armoniche usate":
    "Harmonics used",
  "Arrotola il segnale attorno al cerchio":
    "Wind the signal around the circle",
  "Ascolta questa frequenza":
    "Listen to this frequency",
  "Attestato di completamento del corso":
    "Certificate of course completion",
  "Attestato di completamento rilasciato dall'autore del corso. Non costituisce una certificazione accreditata da un ente terzo.":
    "Certificate of completion issued by the course author. It is not a certification accredited by a third party.",
  "C'è una funzione segreta f che dà 0 o 1 per ognuno degli :N ingressi. O è <b>costante</b> (sempre lo stesso valore) o è <b>bilanciata</b> (metà 0 e metà 1). Scopri quale.":
    "There is a secret function f giving 0 or 1 for each of the :N inputs. It is either <b>constant</b> (always the same value) or <b>balanced</b> (half 0 and half 1). Find out which.",
  "C'è una stringa segreta <b>s</b> di :n bit. La funzione risponde f(x) = s·x mod 2 (parità dei bit in comune). Trova s.":
    "There is a secret string <b>s</b> of :n bits. The function answers f(x) = s·x mod 2 (parity of the shared bits). Find s.",
  "CANCELLAZIONE":
    "CANCELLATION",
  "CENTRATO in :mosse mosse!":
    "ON TARGET in :mosse moves!",
  "CENTRATO!":
    "ON TARGET!",
  "COLPITO! (:fatti/:totali)":
    "HIT! (:fatti/:totali)",
  "CROCE":
    "TAILS",
  "Cambia segno solo allo stato tutto-zero.":
    "Flips the sign of the all-zero state only.",
  "Carico le domande…":
    "Loading the questions…",
  "Cerchi il lato che dà area :area: la risposta è √:area = <b>:lato</b>.":
    "You want the side that gives area :area: the answer is √:area = <b>:lato</b>.",
  "Chiedi al tutor":
    "Ask the tutor",
  "Chiedimi qualsiasi cosa sul corso…":
    "Ask me anything about the course…",
  "Ciao! Sono il tutor di Quantum Arcade. Rispondo usando i contenuti del corso e ti dico sempre in quale livello trovi la spiegazione completa.\n\nUna regola: se mi chiedi la soluzione di una missione ti do un **indizio**, non la risposta. Serve a te, fidati.":
    "Hi! I am the Quantum Arcade tutor. I answer using the course content and I always tell you which level holds the full explanation.\n\nOne rule: if you ask me for the solution to a mission I give you a **hint**, not the answer. It is for your own good, trust me.",
  "Circuito finito.":
    "Circuit finished.",
  "Classicamente devi chiedere un bit alla volta: f(001), f(010), f(100)… → servono <b>:quante</b> domande. Ne hai fatte <b>:fatte</b>.":
    "Classically you have to ask one bit at a time: f(001), f(010), f(100)… → <b>:quante</b> queries are needed. You have made <b>:fatte</b>.",
  "Codice":
    "Code",
  "Collisione trovata: f(:a) = f(:b) → ":
    "Collision found: f(:a) = f(:b) → ",
  "Con 20 qubit un computer quantistico maneggia più di un milione di ampiezze insieme.":
    "With 20 qubits a quantum computer handles more than a million amplitudes at once.",
  "Con :n bit il vantaggio non si vede — ed è giusto così: il punto non è quante domande servono <b>adesso</b>, ma <b>come crescono i due numeri</b>. Con 40 bit: classicamente ~1.048.576 domande, quantisticamente ~39. Con 80 bit il computer classico non finisce prima della fine dell'universo.":
    "With :n bits the advantage does not show — and rightly so: the point is not how many queries you need <b>now</b>, but <b>how the two numbers grow</b>. With 40 bits: classically ~1,048,576 queries, quantumly ~39. With 80 bits the classical computer does not finish before the end of the universe.",
  "Con :quante domande hai già la risposta: BILANCIATA (hai visto sia 0 sia 1).":
    "With :quante queries you already have the answer: BALANCED (you have seen both 0 and 1).",
  "Con <b>:N</b> valori:":
    "With <b>:N</b> values:",
  "Con <b>n bit</b> classici puoi rappresentare uno solo di 2^n valori alla volta. Con <b>n qubit</b> lo stato è descritto da <b>tutte</b> le 2^n ampiezze insieme. Questa singola riga è il motivo per cui l'informatica quantistica esiste.":
    "With <b>n classical bits</b> you can represent just one of 2^n values at a time. With <b>n qubits</b> the state is described by <b>all</b> 2^n amplitudes together. That single line is the reason quantum computing exists.",
  "Con queste equazioni il sistema ha ancora :quante soluzioni: serve un'altra interrogazione.":
    "With these equations the system still has :quante solutions: another query is needed.",
  "Con una sola interrogazione quantistica":
    "With a single quantum query",
  "Consiglio: non rileggere il corso adesso. Rispondere a memoria — anche sbagliando — fissa i concetti molto più del ripasso passivo.":
    "A tip: do not re-read the course now. Answering from memory — even getting it wrong — fixes the concepts far better than passive review.",
  "Conto \"a mano\":":
    "Working it out \"by hand\":",
  "Conto \"con le frecce\": lunghezze <b>si moltiplicano</b>, angoli <b>si sommano</b>. Stesso risultato, molto meno fatica.":
    "Working it out \"with arrows\": lengths <b>multiply</b>, angles <b>add</b>. Same result, far less effort.",
  "Coordinate: (x, y)":
    "Coordinates: (x, y)",
  "Correggo…":
    "Grading…",
  "Correzione domanda per domanda":
    "Question-by-question review",
  "Cos'è un qubit, in due righe?":
    "What is a qubit, in two lines?",
  "Cosa fa esattamente H":
    "Exactly what H does",
  "Costante o bilanciata?":
    "Constant or balanced?",
  "Costruisci il tuo qubit":
    "Build your own qubit",
  "Crea account e fai l'esame":
    "Create an account and take the exam",
  "DFT diretta (la formula)":
    "Direct DFT (the formula)",
  "Da dove comincio?":
    "Where do I start?",
  "Differenza fra i due filtri: :gradi° → cos²(:gradi°) = <b>:percento%</b>":
    "Difference between the two filters: :gradi° → cos²(:gradi°) = <b>:percento%</b>",
  "Diffusore":
    "Diffuser",
  "Disordine (0° = tutte uguali)":
    "Disorder (0° = all the same)",
  "Dividi e conquista":
    "Divide and conquer",
  "Dopo <b>:lanci</b> lanci, lo scostamento massimo dalla teoria è <b>:errore%</b>":
    "After <b>:lanci</b> tosses, the largest gap from theory is <b>:errore%</b>",
  "Dopo la QFT i picchi sono in:":
    "After the QFT the peaks are at:",
  "Due onde, una somma":
    "Two waves, one sum",
  "Due qubit":
    "Two qubits",
  "ESATTO":
    "CORRECT",
  "Ecco perché \"raddoppiare ogni volta\" fa numeri assurdi in fretta.":
    "That is why \"doubling every time\" makes absurd numbers so fast.",
  "Elemento da trovare":
    "Element to find",
  "Equazioni raccolte: :elenco":
    "Equations collected: :elenco",
  "Esame finale":
    "Final exam",
  "Esame superato!":
    "Exam passed!",
  "Esegui passo per passo":
    "Run step by step",
  "FFT (algoritmo classico veloce)":
    "FFT (fast classical algorithm)",
  "Fai altri lanci e guarda le barre avvicinarsi alla riga tratteggiata.":
    "Toss some more and watch the bars close in on the dashed line.",
  "Fase <b>A</b>":
    "Phase <b>A</b>",
  "Fase <b>B</b>":
    "Phase <b>B</b>",
  "Fase <b>φ</b> — di quanto è spostata":
    "Phase <b>φ</b> — how far it is shifted",
  "Fase nascosta <b>φ</b> (da 0 a 1)":
    "Hidden phase <b>φ</b> (from 0 to 1)",
  "Fatto: il qubit di Bob è ORA esattamente lo stato di partenza.":
    "Done: Bob's qubit is NOW exactly the starting state.",
  "Filtri incrociati (90°): non passa NIENTE.":
    "Crossed filters (90°): NOTHING gets through.",
  "Filtro 1":
    "Filter 1",
  "Filtro finale":
    "Final filter",
  "Filtro in mezzo":
    "Middle filter",
  "Finora tutte uguali: potrebbe essere costante, ma per esserne <b>sicuro</b> nel caso peggiore ti servono :quante domande.":
    "All the same so far: it could be constant, but to be <b>sure</b> in the worst case you need :quante queries.",
  "Fondamentale:":
    "Crucial:",
  "Fotoni e filtri polaroid":
    "Photons and polaroid filters",
  "Frazioni = decimali = percentuali":
    "Fractions = decimals = percentages",
  "Frequenza <b>A</b>":
    "Frequency <b>A</b>",
  "Frequenza <b>B</b>":
    "Frequency <b>B</b>",
  "Frequenza <b>f</b> — quanti cicli al secondo":
    "Frequency <b>f</b> — how many cycles per second",
  "Frequenza da testare <b>k</b> (cicli sull'intera finestra)":
    "Frequency to test <b>k</b> (cycles over the whole window)",
  "Funzione segreta su <b>:N</b> ingressi (:n qubit).":
    "Secret function over <b>:N</b> inputs (:n qubits).",
  "GHZ (3 qubit)":
    "GHZ (3 qubits)",
  "Grover: la ricerca amplificata":
    "Grover: amplified search",
  "Guarda l'istogramma: cosa avresti dovuto leggere?":
    "Look at the histogram: what should you have read?",
  "H su tutti":
    "H on all",
  "Hadamard: crea (e disfa) la sovrapposizione.":
    "Hadamard: creates (and undoes) superposition.",
  "Hadamard: crea sovrapposizione":
    "Hadamard: creates superposition",
  "Hai misurato <b>:bit</b> (probabilità era :p). Lo stato è <b>collassato</b> su |:bit⟩: la sovrapposizione è persa.":
    "You measured <b>:bit</b> (the probability was :p). The state has <b>collapsed</b> onto |:bit⟩: the superposition is gone.",
  "Hai superato l'ottimo: continuando, la probabilità RICALA. Grover non è \"più giri = meglio\": è una rotazione che, se esageri, ti porta oltre il bersaglio.":
    "You have gone past the optimum: keep going and the probability DROPS again. Grover is not \"more rounds = better\": it is a rotation that, overdone, takes you past the target.",
  "H·H = identità":
    "H·H = identity",
  "INTERFERENZA COSTRUTTIVA — si sommano!":
    "CONSTRUCTIVE INTERFERENCE — they add up!",
  "INTERFERENZA DISTRUTTIVA — si annullano!":
    "DESTRUCTIVE INTERFERENCE — they cancel out!",
  "Il coseno è quanto sei spostato a <b>destra</b>, il seno quanto sei <b>in alto</b>. Entrambi stanno sempre fra −1 e +1.":
    "The cosine is how far <b>right</b> you are, the sine how far <b>up</b>. Both always stay between −1 and +1.",
  "Il giro completo = un periodo":
    "A full turn = one period",
  "Il lato è cresciuto di poco, l'area di molto: è questo che vuol dire \"al quadrato\".":
    "The side grew a little, the area a lot: that is what \"squared\" means.",
  "Il nome sull'attestato è quello del tuo profilo. Se è sbagliato, correggilo nel pannello account e riscarica il PDF.":
    "The name on the certificate is the one in your profile. If it is wrong, fix it in the account panel and download the PDF again.",
  "Il periodo vero è r = :r (qui lo sappiamo perché stiamo simulando: il computer quantistico NON lo sa).":
    "The true period is r = :r (we know it here because we are simulating: the quantum computer does NOT).",
  "Il segreto <b>s</b> ha :n bit.":
    "The secret <b>s</b> is :n bits long.",
  "Il segreto era <b>:segreto</b> → :esito":
    "The secret was <b>:segreto</b> → :esito",
  "Il tuo punto: <b>x = :x</b>, <b>y = :y</b>":
    "Your point: <b>x = :x</b>, <b>y = :y</b>",
  "Il tuo qubit":
    "Your qubit",
  "Il tutor non è ancora configurato su questo server.":
    "The tutor is not configured on this server yet.",
  "In fase (0°)":
    "In phase (0°)",
  "Indipendenti: <b>:rango</b> su :servono necessarie — ":
    "Independent ones: <b>:rango</b> of the :servono needed — ",
  "Indizio: il bersaglio è :orizzontale e :verticale.":
    "Hint: the target is :orizzontale and :verticale.",
  "Inizia l'esame":
    "Start the exam",
  "Interroga la funzione segreta: mette l'informazione nelle fasi. Ogni uso costa 1 query!":
    "Queries the secret function: it writes the information into the phases. Each use costs 1 query!",
  "Interrogazioni dell'oracolo usate: <b>:quante</b>":
    "Oracle queries used: <b>:quante</b>",
  "Invia":
    "Send",
  "L'esame copre tutto il corso. <b>Nessun limite di tempo</b>, nessuna penalità, puoi rifarlo quante volte vuoi. Durante l'esame non ricevi la correzione: la vedi alla fine, domanda per domanda. Si passa dall'<b>:soglia%</b>.":
    "The exam covers the whole course. <b>No time limit</b>, no penalties, you can retake it as often as you like. You get no feedback during the exam: you see it at the end, question by question. The pass mark is <b>:soglia%</b>.",
  "L'ho confermata, ricarica":
    "I have confirmed it, reload",
  "L'oracolo \"periodico\" lascia in gioco solo gli stati x che stanno su una griglia con passo <b>r</b> (più uno sfasamento casuale). Trova r.":
    "The \"periodic\" oracle keeps in play only the states x sitting on a grid of step <b>r</b> (plus a random offset). Find r.",
  "L'oracolo nasconde un <b>periodo s</b> di :n bit: <b>f(x) = f(x ⊕ s)</b>, cioè ogni valore esce esattamente <b>due volte</b>.":
    "The oracle hides a <b>period s</b> of :n bits: <b>f(x) = f(x ⊕ s)</b>, that is, every value comes out exactly <b>twice</b>.",
  "L'unica differenza fra le due righe è quel MENO. Tutta l'interferenza quantistica nasce da lì.":
    "The only difference between the two lines is that MINUS. All quantum interference is born there.",
  "La QFT trasforma :N ampiezze con :porte porte, ma quando misuri ottieni <b>un solo</b> risultato.":
    "The QFT transforms :N amplitudes with :porte gates, but when you measure you get <b>one single</b> result.",
  "La QFT, porta per porta":
    "The QFT, gate by gate",
  "La QPE è la QFT <b>al contrario</b>: invece di trasformare posizioni in fasi, prende un'informazione già scritta nelle fasi (con rotazioni controllate) e la riporta in una posizione <b>leggibile con una misura</b>. È il motore di Shor e di mezza chimica quantistica.":
    "QPE is the QFT <b>backwards</b>: instead of turning positions into phases, it takes information already written into the phases (with controlled rotations) and brings it back to a position <b>readable by a measurement</b>. It is the engine of Shor and of half of quantum chemistry.",
  "La differenza è quel MENO: da lì nasce l'interferenza.":
    "The difference is that MINUS: interference is born there.",
  "La freccia che gira":
    "The spinning arrow",
  "La funzione segreta è <b>f(x) = s·x mod 2</b> (quante posizioni hanno 1 in comune, pari o dispari).":
    "The secret function is <b>f(x) = s·x mod 2</b> (how many positions share a 1, odd or even).",
  "La linea dei numeri":
    "The number line",
  "La macchina di Fourier":
    "The Fourier machine",
  "La seconda H fa incontrare quelle ampiezze: sul risultato |1⟩ una arriva <b>+</b> e l'altra <b>−</b>, e si cancellano.":
    "The second H makes those amplitudes meet: on the outcome |1⟩ one arrives <b>+</b> and the other <b>−</b>, and they cancel.",
  "La stringa segreta":
    "The secret string",
  "La tua risposta:":
    "Your answer:",
  "Laboratorio dei circuiti":
    "Circuit laboratory",
  "Laboratorio dell'onda":
    "Wave laboratory",
  "Lancia e conta":
    "Toss and count",
  "Lascia |0⟩, gira di 180° la fase di |1⟩.":
    "Leaves |0⟩ alone, turns the phase of |1⟩ by 180°.",
  "Lato <b>:lato</b> → area <b>:area%</b>":
    "Side <b>:lato</b> → area <b>:area%</b>",
  "Lato <b>:lato</b> → area <b>:area</b>":
    "Side <b>:lato</b> → area <b>:area</b>",
  "Lato del quadrato":
    "Side of the square",
  "Le <b>barre colorate</b> sono le ampiezze: altezza = quanto è grande, colore e freccia = la fase. Due barre uguali ma di colore opposto sono due frecce opposte: se un'altra porta le fa incontrare, <b>si cancellano</b>.":
    "The <b>coloured bars</b> are the amplitudes: height = how big, colour and arrow = the phase. Two equal bars of opposite colour are two opposite arrows: if another gate makes them meet, <b>they cancel</b>.",
  "Le frazioni continue cercano la frazione semplice più vicina a :valore:":
    "Continued fractions look for the simplest fraction closest to :valore:",
  "Le frecce si sono allineate: questa frequenza C'È.":
    "The arrows lined up: this frequency IS THERE.",
  "Le frecce si sono cancellate: questa frequenza NON c'è.":
    "The arrows cancelled out: this frequency is NOT there.",
  "Le probabilità sono tutte uguali: così la misura non ti dice niente. Serve un blocco che faccia INTERFERIRE le ampiezze dopo l'oracolo.":
    "The probabilities are all equal: measuring like this tells you nothing. You need a block that makes the amplitudes INTERFERE after the oracle.",
  "Legge di Malus:":
    "Malus's law:",
  "Leggi l'istogramma e prova a dare la risposta qui sopra.":
    "Read the histogram and try to answer above.",
  "Lunghezza del lato (l'ampiezza)":
    "Length of the side (the amplitude)",
  "MISURA":
    "MEASURE",
  "MONETA: 0 → :zeri volte, 1 → :uni volte  (resta 50/50: il caso non si \"disfa\")":
    "COIN: 0 → :zeri times, 1 → :uni times  (stays 50/50: randomness does not \"undo\" itself)",
  "Massimo possibile: :max (in fase) · Minimo possibile: :min (in opposizione)":
    "Largest possible: :max (in phase) · Smallest possible: :min (in opposition)",
  "Mette tutte le possibilità in gioco con la stessa ampiezza.":
    "Puts every possibility in play with the same amplitude.",
  "Metti il disordine a <b>0°</b>: la somma vale esattamente quanto il numero di frecce. Portalo a <b>360°</b>: la somma crolla vicino a zero, per quanto siano tante. Questo semplice fatto è il motore della trasformata di Fourier <b>e</b> di ogni algoritmo quantistico.":
    "Set disorder to <b>0°</b>: the sum equals exactly the number of arrows. Take it to <b>360°</b>: the sum collapses to nearly zero, however many there are. That simple fact is the engine of the Fourier transform <b>and</b> of every quantum algorithm.",
  "Miglior risultato: <b>:binario</b> = :y/:M = <b>:valore</b>  (probabilità :percento%)":
    "Best result: <b>:binario</b> = :y/:M = <b>:valore</b>  (probability :percento%)",
  "Misure":
    "Measurements",
  "Misure (200 tiri)":
    "Measurements (200 shots)",
  "Modo quantistico — una sola interrogazione:":
    "Quantum way — a single query:",
  "Moltiplicare frecce = sommare angoli":
    "Multiplying arrows = adding angles",
  "Moneta contro qubit":
    "Coin versus qubit",
  "Muovi il cursore fin lì.":
    "Move the slider there.",
  "N = 2^:n = :N numeri  (cioè :n qubit)":
    "N = 2^:n = :N numbers  (that is, :n qubits)",
  "N = <b>:N</b> possibilità, iterazioni fatte: <b>:fatte</b>":
    "N = <b>:N</b> possibilities, iterations done: <b>:fatte</b>",
  "N/r = :N/:r = <b>:valore</b> → i picchi cadono sui <b>multipli di N/r</b>.":
    "N/r = :N/:r = <b>:valore</b> → the peaks fall on the <b>multiples of N/r</b>.",
  "NOT controllato: clicca prima il controllo, poi il bersaglio":
    "Controlled NOT: click the control first, then the target",
  "NOT quantistico":
    "Quantum NOT",
  "NOT quantistico: scambia |0⟩ e |1⟩.":
    "Quantum NOT: swaps |0⟩ and |1⟩.",
  "Nel resto del corso le probabilità appariranno come <b>percentuale</b> (50%) o come <b>numero fra 0 e 1</b> (0,5): ormai sai che sono la stessa cosa.":
    "In the rest of the course probabilities will show up as a <b>percentage</b> (50%) or as a <b>number between 0 and 1</b> (0.5): you now know they are the same thing.",
  "Non ancora — ma ci sei vicino":
    "Not yet — but you are close",
  "Non fa nulla (identità).":
    "Does nothing (identity).",
  "Non riesco a raggiungere il server: se stai giocando in locale senza PHP, il tutor è spento. Il resto del gioco funziona lo stesso.":
    "I cannot reach the server: if you are playing locally without PHP, the tutor is off. The rest of the game works anyway.",
  "Nota le barre: <b>una sola</b> è alta al 100%. Tutte le altre possibilità si sono cancellate a vicenda.":
    "Look at the bars: <b>only one</b> stands at 100%. All the other possibilities cancelled each other out.",
  "Numero da fattorizzare <b>N</b>":
    "Number to factor <b>N</b>",
  "Numero di qubit <b>n</b>  (N = 2^n campioni/ampiezze)":
    "Number of qubits <b>n</b>  (N = 2^n samples/amplitudes)",
  "ORACOLO":
    "ORACLE",
  "Obiettivo: <b>:etichetta</b> (:spiegazione) → :percento%.":
    "Goal: <b>:etichetta</b> (:spiegazione) → :percento%.",
  "Officina degli algoritmi":
    "Algorithm workshop",
  "Officina di Shor":
    "Shor's workshop",
  "Opposte (180°)":
    "Opposite (180°)",
  "Osserva: si parte da <b>una</b> barra sola e si finisce con <b>tutte le barre uguali</b> ma con <b>fasi diverse</b> (colori diversi). L'informazione non è sparita: è passata dalla <b>posizione</b> alla <b>fase</b>. Questa frase è tutta la QFT.":
    "Watch: you start from <b>one</b> single bar and end with <b>all bars equal</b> but with <b>different phases</b> (different colours). The information has not vanished: it moved from <b>position</b> to <b>phase</b>. That sentence is the whole QFT.",
  "Ottimo punto per misurare!":
    "Great moment to measure!",
  "PERFETTO!":
    "PERFECT!",
  "Pagina di verifica":
    "Verification page",
  "Partenza: Alice ha il qubit misterioso q0 da mandare. q1 e q2 sono a zero.":
    "Start: Alice has the mystery qubit q0 to send. q1 and q2 are at zero.",
  "Passo 1 (classico).":
    "Step 1 (classical).",
  "Passo 2 (quantistico).":
    "Step 2 (quantum).",
  "Passo 3 (misura).":
    "Step 3 (measurement).",
  "Passo 4 (classico).":
    "Step 4 (classical).",
  "Passo 5.":
    "Step 5.",
  "Passo :i/:totali":
    "Step :i/:totali",
  "Pausa/Play":
    "Pause/Play",
  "Perché due H riportano il qubit a zero?":
    "Why do two H gates take the qubit back to zero?",
  "Perché funziona: dopo le prime Hadamard ogni possibilità x ha la stessa ampiezza. L'oracolo mette un <b>meno</b> su quelle con parità dispari: è come \"scrivere s nelle fasi\". Le Hadamard finali trasformano quel disegno di segni in <b>un unico stato</b>, proprio s. È già un piccolo Fourier.":
    "Why it works: after the first Hadamards every possibility x has the same amplitude. The oracle puts a <b>minus</b> on those with odd parity: it is like \"writing s into the phases\". The final Hadamards turn that pattern of signs into <b>one single state</b>, exactly s. It is already a small Fourier.",
  "Perché si eleva al quadrato":
    "Why you square it",
  "Percorso: :percorso":
    "Path: :percorso",
  "Perfetto! Prova un altro obiettivo.":
    "Perfect! Try another goal.",
  "Periodicità dentro, picchi fuori":
    "Periodicity in, peaks out",
  "Periodo <b>r</b>":
    "Period <b>r</b>",
  "Porta la lancetta su :gradi°.":
    "Move the hand to :gradi°.",
  "Porte applicate":
    "Gates applied",
  "Porte totali del circuito:":
    "Total gates in the circuit:",
  "Porte: :porte · qubit: :qubit":
    "Gates: :porte · qubits: :qubit",
  "Premi il bottone quantistico e guarda cosa succede alle ampiezze.":
    "Press the quantum button and watch what happens to the amplitudes.",
  "Premi il bottone quantistico: <b>una sola</b> chiamata all'oracolo dà un'equazione su s.":
    "Press the quantum button: <b>one single</b> call to the oracle gives an equation on s.",
  "Premi il bottone quantistico: una sola interrogazione basta, sempre.":
    "Press the quantum button: one query is always enough.",
  "Premi «misura» e ricava r dal risultato.":
    "Press \"measure\" and work out r from the result.",
  "Probabilità più alta: :percento% su |:stato⟩":
    "Highest probability: :percento% on |:stato⟩",
  "Probabilità teorica di ogni faccia: <b>1/:facce</b> = :percento%":
    "Theoretical probability of each face: <b>1/:facce</b> = :percento%",
  "Prossima porta:":
    "Next gate:",
  "Prova ad aggiungere un terzo filtro a 45° <b>in mezzo</b>…":
    "Try adding a third filter at 45° <b>in the middle</b>…",
  "Prova:":
    "Try it:",
  "QFT (porte del circuito quantistico)":
    "QFT (gates of the quantum circuit)",
  "QFT inversa.":
    "Inverse QFT.",
  "QFT su 3 qubit":
    "QFT on 3 qubits",
  "QUBIT : 0 → <span class=\"g\">:zeri</span> volte, 1 → <span class=\"g\">:uni</span> volte  (torna SEMPRE a 0!)":
    "QUBIT: 0 → <span class=\"g\">:zeri</span> times, 1 → <span class=\"g\">:uni</span> times  (it ALWAYS comes back to 0!)",
  "Quadrato e radice quadrata":
    "Square and square root",
  "Quando la velocità di avvolgimento <b>coincide con una frequenza contenuta nel segnale</b> (qui :frequenze Hz), i \"picchi\" del segnale finiscono sempre dalla stessa parte del cerchio e il centro di massa scappa via dall'origine. È esattamente ciò che calcola la formula della trasformata.":
    "When the winding speed <b>matches a frequency contained in the signal</b> (here :frequenze Hz), the signal's \"peaks\" always land on the same side of the circle and the centre of mass runs away from the origin. That is exactly what the transform's formula computes.",
  "Quante frecce":
    "How many arrows",
  "Quante onde servono per fare uno spigolo?":
    "How many waves does a sharp corner take?",
  "Quante volte dividiamo":
    "How many times we divide",
  "Quante volte raddoppi (n)":
    "How many times you double (n)",
  "Quanto costa?":
    "What does it cost?",
  "Quanto riempi":
    "How much you fill",
  "Qubit di Bob (q2)":
    "Bob's qubit (q2)",
  "Qubit di lettura <b>t</b>":
    "Read-out qubits <b>t</b>",
  "Qubit di partenza (Alice, q0)":
    "Starting qubit (Alice, q0)",
  "Questa è <b>la sintesi</b>: costruire un segnale sommando onde. La <b>trasformata di Fourier</b> fa il lavoro inverso: guarda il segnale e ti dice da sola quanto vale ogni cursore.":
    "This is <b>synthesis</b>: building a signal by adding waves. The <b>Fourier transform</b> does the reverse job: it looks at the signal and tells you by itself what every slider is worth.",
  "Questo è il <b>colpo di scena</b>: le probabilità classiche non si cancellano mai, le ampiezze sì.":
    "That is the <b>plot twist</b>: classical probabilities never cancel, amplitudes do.",
  "RICETTA":
    "RECIPE",
  "RISPOSTA GIUSTA con :quante interrogazioni!":
    "CORRECT ANSWER with :quante queries!",
  "Raddoppia, raddoppia, raddoppia…":
    "Double, double, double…",
  "Regola di lettura: <b>tutto |0…0⟩ → costante</b>; <b>qualsiasi altra cosa → bilanciata</b>.":
    "Reading rule: <b>all |0…0⟩ → constant</b>; <b>anything else → balanced</b>.",
  "Ribalta tutti i qubit.":
    "Flips every qubit.",
  "Ricostruisci il segnale":
    "Rebuild the signal",
  "Rifai l'esame":
    "Retake the exam",
  "Riflessione attorno alla media: amplifica ciò che l'oracolo ha marcato.":
    "Reflection about the mean: it amplifies whatever the oracle marked.",
  "Rimanda l'email di conferma":
    "Resend the confirmation email",
  "Riprova":
    "Try again",
  "Risposta esatta:":
    "Correct answer:",
  "Risposta sbagliata":
    "Wrong answer",
  "Risposta: :valore":
    "Answer: :valore",
  "Risposte classiche ottenute: :elenco":
    "Classical answers obtained: :elenco",
  "Risultati (q1q0)":
    "Results (q1q0)",
  "Risultati delle misure":
    "Measurement results",
  "Risultato più probabile: <b>|:stato⟩</b> con :percento%":
    "Most likely result: <b>|:stato⟩</b> at :percento%",
  "Rotazione <b>RY(θ)</b> — spinge verso il basso":
    "Rotation <b>RY(θ)</b> — pushes downwards",
  "Rotazione di 180° attorno all'asse Y.":
    "180° rotation about the Y axis.",
  "Rotazione di fase <b>P(θ)</b> — gira sull'equatore":
    "Phase rotation <b>P(θ)</b> — turns around the equator",
  "Ruota la fase di |1⟩ di 45°.":
    "Rotates the phase of |1⟩ by 45°.",
  "Ruota la fase di |1⟩ di 90°.":
    "Rotates the phase of |1⟩ by 90°.",
  "Ruota la fase di |1⟩ di −45°.":
    "Rotates the phase of |1⟩ by −45°.",
  "Ruota la fase di |1⟩ di −90°.":
    "Rotates the phase of |1⟩ by −90°.",
  "SPARA!":
    "FIRE!",
  "STATI INTRECCIATI (entangled)":
    "ENTANGLED STATES",
  "Scarica il PDF":
    "Download the PDF",
  "Scegli a = :a. Controlla che MCD(:a, :N) = :mcd = 1 ✓ (se fosse diverso da 1 avresti già trovato un fattore per fortuna!)":
    "Pick a = :a. Check that GCD(:a, :N) = :mcd = 1 ✓ (if it were anything other than 1 you would have found a factor by luck already!)",
  "Se un qubit fosse solo \"una moneta nascosta\", mescolare due volte lo lascerebbe casuale. Invece torna esattamente al punto di partenza: la prova che dentro c'è qualcosa che <b>si può cancellare</b>, cioè un'onda.":
    "If a qubit were just \"a hidden coin\", shuffling twice would leave it random. Instead it comes back exactly to where it started: proof that inside there is something that <b>can cancel</b>, that is, a wave.",
  "Se |B| = 1 (freccia lunga 1, cioè e^{iθ}), moltiplicare per B <b>non cambia la lunghezza di A: la fa solo ruotare</b>. Ecco perché tutta Fourier — e tutte le porte di fase quantistiche — sono moltiplicazioni per e^{iθ}.":
    "If |B| = 1 (an arrow of length 1, that is e^{iθ}), multiplying by B <b>does not change A's length: it only rotates it</b>. That is why the whole of Fourier — and every quantum phase gate — is a multiplication by e^{iθ}.",
  "Sei <b>sopra</b>: abbassa il cursore.":
    "You are <b>above</b>: lower the slider.",
  "Sei <b>sotto</b>: alza il cursore.":
    "You are <b>below</b>: raise the slider.",
  "Sei a <b>:gradi°</b> = <b>:frazione</b> di giro completo":
    "You are at <b>:gradi°</b> = <b>:frazione</b> of a full turn",
  "Sei su <b>:posizione</b>, il bersaglio è <b>:bersaglio</b>. Mosse: :mosse":
    "You are on <b>:posizione</b>, the target is <b>:bersaglio</b>. Moves: :mosse",
  "Sei sul bersaglio!":
    "You are on target!",
  "Seno e coseno: le due ombre":
    "Sine and cosine: the two shadows",
  "Serve quindi a far <b>interferire</b> le ampiezze, non a stampare la lista.":
    "So it is there to make amplitudes <b>interfere</b>, not to print the list.",
  "Serve una <b>collisione</b>: due x diversi con lo stesso f. Con :n bit ne bastano poche, ma con 40 bit servirebbero <b>un milione</b> di domande.":
    "You need a <b>collision</b>: two different x with the same f. With :n bits a few will do, but with 40 bits it would take <b>a million</b> queries.",
  "Sfasamento iniziale":
    "Initial offset",
  "Sfida":
    "Challenge",
  "Si calcola :a^x mod :N in sovrapposizione su tutti gli x, si misura il secondo registro e si applica la QFT al primo: le probabilità si concentrano sui multipli di M/r.":
    "You compute :a^x mod :N in superposition over every x, measure the second register and apply the QFT to the first: the probabilities concentrate on the multiples of M/r.",
  "Si crea la coppia intrecciata fra q1 (Alice) e q2 (Bob): H su q1, poi CNOT q1→q2.":
    "The entangled pair between q1 (Alice) and q2 (Bob) is created: H on q1, then CNOT q1→q2.",
  "Si scrive così: <b>(:x, :y)</b> — prima sempre la x (orizzontale), poi la y (verticale).":
    "It is written like this: <b>(:x, :y)</b> — x first (horizontal), then y (vertical).",
  "Sistema risolto: s = :s":
    "System solved: s = :s",
  "Somma delle due frecce: lunghezza <span class=\"p\">:lunghezza</span>, angolo :angolo°":
    "Sum of the two arrows: length <span class=\"p\">:lunghezza</span>, angle :angolo°",
  "Sono bloccato in questo livello":
    "I am stuck on this level",
  "Sono tre modi di scrivere <b>la stessa quantità</b>: \"per cento\" vuol dire letteralmente \"ogni 100\".":
    "They are three ways of writing <b>the same quantity</b>: \"per cent\" literally means \"per 100\".",
  "Sovrapposizione totale":
    "Full superposition",
  "Stato attuale:":
    "Current state:",
  "Stato di Bell":
    "Bell state",
  "Stato di partenza |x⟩":
    "Starting state |x⟩",
  "Stato di partenza:":
    "Starting state:",
  "Stato di partenza: ampiezze diverse da zero in :posizioni":
    "Starting state: non-zero amplitudes at :posizioni",
  "Stiamo cercando di leggere una fase <b>φ = :fase</b> scrivendola in binario con :cifre cifre.":
    "We are trying to read a phase <b>φ = :fase</b> by writing it in binary with :cifre digits.",
  "Stima di fase (QPE)":
    "Phase estimation (QPE)",
  "Strada classica":
    "Classical route",
  "Strada quantistica":
    "Quantum route",
  "TELETRASPORTO RIUSCITO":
    "TELEPORTATION SUCCEEDED",
  "TESTA":
    "HEADS",
  "Tante frecce insieme":
    "Many arrows together",
  "Teletrasporto quantistico":
    "Quantum teleportation",
  "Ti sono bastate <b>:quante</b> interrogazioni quantistiche.":
    "It took you just <b>:quante</b> quantum queries.",
  "Totale: :percento%":
    "Total: :percento%",
  "Trasformata di Fourier quantistica: trasforma periodicità in picchi.":
    "Quantum Fourier transform: it turns periodicity into peaks.",
  "Trova il periodo":
    "Find the period",
  "Trova l'ago nel pagliaio":
    "Find the needle in the haystack",
  "Tutor":
    "Tutor",
  "Tutor di Quantum Arcade":
    "Quantum Arcade tutor",
  "Ultima misura: <b>y = :y</b> → equazione <b>:y · s = 0</b>":
    "Last measurement: <b>y = :y</b> → equation <b>:y · s = 0</b>",
  "Un <b>giro completo</b> del pallino = <b>un ciclo</b> dell'onda. Se il pallino fa 2 giri al secondo, l'onda ha frequenza 2 Hz e periodo ½ secondo. Frequenza e periodo sono la stessa informazione, letta in due modi: <b>T = 1/f</b>.":
    "One <b>full turn</b> of the dot = <b>one cycle</b> of the wave. If the dot makes 2 turns per second, the wave has frequency 2 Hz and period ½ second. Frequency and period are the same information read two ways: <b>T = 1/f</b>.",
  "Un chicco di riso sulla prima casella, due sulla seconda, quattro sulla terza…":
    "One grain of rice on the first square, two on the second, four on the third…",
  "Un computer classico se la caverebbe con: :costo.":
    "A classical computer would get by with: :costo.",
  "Un filtro non \"seleziona\": <b>misura</b>, e la misura <b>riscrive</b> lo stato del fotone. Dopo il filtro a 45° il fotone È a 45°, e da lì ha di nuovo una possibilità di passare a 90°.":
    "A filter does not \"select\": it <b>measures</b>, and the measurement <b>rewrites</b> the photon's state. After the 45° filter the photon IS at 45°, and from there it has a fresh chance of getting through at 90°.",
  "Un fotone polarizzato è il <b>qubit fisico</b> più semplice: verticale = |0⟩, orizzontale = |1⟩, e le direzioni oblique sono <b>sovrapposizioni</b>. La probabilità di passare è il <b>quadrato del coseno</b> dell'angolo: ecco da dove viene \"probabilità = ampiezza²\".":
    "A polarised photon is the simplest <b>physical qubit</b>: vertical = |0⟩, horizontal = |1⟩, and the slanted directions are <b>superpositions</b>. The probability of getting through is the <b>cosine squared</b> of the angle: that is where \"probability = amplitude²\" comes from.",
  "Un giro intero = <b>360°</b>. Mezzo giro = 180°. Un quarto = 90°.":
    "A whole turn = <b>360°</b>. Half a turn = 180°. A quarter = 90°.",
  "Una DFT su 8 punti costa 8×8 = 64 moltiplicazioni. Ma una DFT su 8 punti si può scrivere usando <b>due</b> DFT su 4 punti (pari e dispari) più 8 combinazioni finali. Ripetendo il trucco fino in fondo: <b>log₂8 = 3 livelli</b> × 8 = 24 operazioni invece di 64. Più N cresce, più il risparmio esplode.":
    "A DFT on 8 points costs 8×8 = 64 multiplications. But a DFT on 8 points can be written using <b>two</b> DFTs on 4 points (even and odd) plus 8 final combinations. Repeating the trick all the way down: <b>log₂8 = 3 levels</b> × 8 = 24 operations instead of 64. The bigger N gets, the more the saving explodes.",
  "Una coppia di numeri (x, y) individua <b>un punto</b> sul piano, oppure — che è lo stesso — <b>una freccia</b> che parte dal centro. Fra due livelli chiameremo quella stessa freccia \"numero complesso\": x sarà la parte reale e y quella immaginaria.":
    "A pair of numbers (x, y) pins down <b>a point</b> on the plane, or — same thing — <b>an arrow</b> starting from the centre. Two levels from now we will call that very arrow a \"complex number\": x will be the real part and y the imaginary one.",
  "Uno solo degli :N stati è quello \"giusto\". L'oracolo sa dirti soltanto <b>sì/no</b> (mettendo un segno meno). Trovalo.":
    "Only one of the :N states is the \"right\" one. The oracle can only tell you <b>yes/no</b> (by putting a minus sign). Find it.",
  "Vedi? Con tanti lanci le percentuali si sistemano da sole. Si chiama legge dei grandi numeri.":
    "See? With many tosses the percentages settle by themselves. It is called the law of large numbers.",
  "Velocità di avvolgimento <b>f</b>":
    "Winding speed <b>f</b>",
  "Velocità di rotazione <b>f</b>":
    "Rotation speed <b>f</b>",
  "Velocità di rotazione <b>ω</b>":
    "Rotation speed <b>ω</b>",
  "Verifica pubblica":
    "Public verification",
  "X su tutti":
    "X on all",
  "Z controllata":
    "Controlled Z",
  "a caso":
    "random",
  "accorciate: presi da soli i qubit non hanno più uno stato definito!":
    "shortened: taken on their own the qubits no longer have a definite state!",
  "alla casella :casella ce ne sono già :quanti.":
    "by square :casella there are already :quanti.",
  "altezza":
    "height",
  "altezza del pallino, disegnata nel tempo":
    "the dot's height, drawn over time",
  "ampiezza della somma":
    "amplitude of the sum",
  "ampiezza di :ket":
    "amplitude of :ket",
  "applica P(θ)":
    "apply P(θ)",
  "applica RY(θ)":
    "apply RY(θ)",
  "applica le porte e guarda la freccia muoversi":
    "apply the gates and watch the arrow move",
  "area":
    "area",
  "area = 0,01 → che lato?":
    "area = 0.01 → what side?",
  "area = 0,25 → che lato?":
    "area = 0.25 → what side?",
  "area = 0,5 → che lato?":
    "area = 0.5 → what side?",
  "attraverso un filtro passa cos²(differenza di angolo).":
    "through a filter, cos²(angle difference) gets past.",
  "azzera":
    "reset",
  "azzera istogramma":
    "reset histogram",
  "azzera misure":
    "reset measurements",
  "bastano: premi \"risolvi il sistema\"":
    "that is enough: press \"solve the system\"",
  "bersaglio":
    "target",
  "bilanciata":
    "balanced",
  "bit classici inviati ad Alice→Bob: <b>:bit</b> (→ correzione: :correzione)":
    "classical bits sent Alice→Bob: <b>:bit</b> (→ correction: :correzione)",
  "cambia segno":
    "change sign",
  "centrati: :fatti/:totali":
    "on target: :fatti/:totali",
  "centrato!":
    "on target!",
  "centro di massa = :valore":
    "centre of mass = :valore",
  "chiedi 1 valore (modo classico)":
    "ask for 1 value (classical way)",
  "chiedi UNA volta":
    "ask ONCE",
  "chiedi UNA volta (modo quantistico)":
    "ask ONCE (quantum way)",
  "chiedi a caso":
    "ask at random",
  "chiedi pure":
    "ask away",
  "chiedi un bit alla volta":
    "ask one bit at a time",
  "ci sei!":
    "you got it!",
  "circuito completo":
    "full circuit",
  "clicca sulla griglia o usa i cursori, poi premi SPARA":
    "click on the grid or use the sliders, then press FIRE",
  "clicca sulla griglia, poi SPARA":
    "click on the grid, then FIRE",
  "clicca una casella per chiedere f(x) all'oracolo":
    "click a cell to ask the oracle for f(x)",
  "colpisci il bersaglio":
    "hit the target",
  "come la FFT taglia il lavoro a metà, ogni volta":
    "how the FFT halves the work, every time",
  "cosa succede se le sposti?":
    "what happens if you shift them?",
  "coseno":
    "cosine",
  "costante":
    "constant",
  "costante o bilanciata? Una sola domanda.":
    "constant or balanced? One single question.",
  "dado (6 facce)":
    "die (6 faces)",
  "denominatore <b>r = :r</b>":
    "denominator <b>r = :r</b>",
  "devi provare i valori uno per uno":
    "you have to try the values one by one",
  "differenza di fase":
    "phase difference",
  "differenza fra lo stato di partenza e quello di Bob: <b>:distanza</b>":
    "difference between the starting state and Bob's: <b>:distanza</b>",
  "dimezza il lato e l'area diventa un quarto, non la metà":
    "halve the side and the area becomes a quarter, not a half",
  "dimezza il lato: l'area diventa un quarto":
    "halve the side: the area becomes a quarter",
  "divisioni":
    "splits",
  "domanda :i di :totali":
    "question :i of :totali",
  "domanda precedente":
    "previous question",
  "domande e correzione lato server":
    "questions and grading on the server",
  "domande fatte: <b>:fatte</b> su :totali possibili.":
    "queries made: <b>:fatte</b> out of :totali possible.",
  "dopo il passo :n":
    "after step :n",
  "dopo la QFT sul registro di lettura (:qubit qubit → :valori valori)":
    "after the QFT on the read-out register (:qubit qubits → :valori values)",
  "due \"lanci\" a testa: chi torna a casa?":
    "two \"tosses\" each: who comes home?",
  "due manopole: quanto |1⟩ e quale fase":
    "two knobs: how much |1⟩ and which phase",
  "e al contrario:":
    "and the other way round:",
  "e guarda il centro di massa":
    "and watch the centre of mass",
  "ed è davvero il periodo nascosto":
    "and it really is the hidden period",
  "era <b>:cosa</b>":
    "it was <b>:cosa</b>",
  "era <b>:valore</b>":
    "it was <b>:valore</b>",
  "era <b>r = :r</b> (con partenza da :off)":
    "it was <b>r = :r</b> (starting from :off)",
  "era <b>|:valore⟩</b>":
    "it was <b>|:valore⟩</b>",
  "errore :valore":
    "error :valore",
  "esame finale superato":
    "final exam passed",
  "fai diventare l'area :quanto%":
    "make the area :quanto%",
  "fase":
    "phase",
  "fase +45° su |1⟩":
    "+45° phase on |1⟩",
  "fase +90° su |1⟩":
    "+90° phase on |1⟩",
  "fase vera":
    "true phase",
  "fattore trovato":
    "factor found",
  "fattorizza un numero con le tue mani":
    "factor a number with your own hands",
  "filtri incrociati (0° e 90°)":
    "crossed filters (0° and 90°)",
  "frecce ruotate a velocità k = :k":
    "arrows rotated at speed k = :k",
  "freccia":
    "arrow",
  "frequenze diverse: le frecce girano a velocità diverse":
    "different frequencies: the arrows spin at different speeds",
  "giri/s":
    "turns/s",
  "grazie: mi aiuta a migliorare il corso":
    "thanks: it helps me improve the course",
  "guarda la barra giusta crescere":
    "watch the right bar grow",
  "guarda le fasi disporsi a ventaglio":
    "watch the phases fan out",
  "guarda quando ricomincia da 1":
    "watch when it starts over from 1",
  "ha completato i :quanti livelli di <b>“Informatica quantistica giocando”</b> superando l'esame finale con <b>:percento%</b> di risposte esatte.":
    "has completed the :quanti levels of <b>“Quantum computing by playing”</b>, passing the final exam with <b>:percento%</b> correct answers.",
  "hai misurato y = :y":
    "you measured y = :y",
  "i picchi cadono sui multipli di M/r = :M/:r = :valore":
    "the peaks fall on the multiples of M/r = :M/:r = :valore",
  "il lato e l'area di un quadrato":
    "the side and the area of a square",
  "il lato è l'ampiezza, l'area è la probabilità":
    "the side is the amplitude, the area is the probability",
  "il lato è la \"radice quadrata\" dell'area":
    "the side is the \"square root\" of the area",
  "il misterioso":
    "the mystery one",
  "il pallino gira, l'onda esce a destra":
    "the dot turns, the wave comes out on the right",
  "il risultato è:":
    "the result is:",
  "il trucco che usa Shor":
    "the trick Shor uses",
  "il tuo":
    "yours",
  "il valore 1 ritorna ogni :r passi → PERIODO r = :r":
    "the value 1 comes back every :r steps → PERIOD r = :r",
  "interferenza parziale":
    "partial interference",
  "interrogazione quantistica":
    "quantum query",
  "interrogazioni: <b>:quante</b>":
    "queries: <b>:quante</b>",
  "iterazioni":
    "iterations",
  "l'altezza disegnata mentre l'angolo cresce = un'ONDA":
    "the height drawn as the angle grows = a WAVE",
  "l'esperimento dei tre filtri":
    "the three-filter experiment",
  "la freccia gira → escono le due onde":
    "the arrow turns → out come the two waves",
  "la probabilità si vede solo con tanti lanci":
    "probability only shows up after many tosses",
  "la radice quadrata è la domanda:":
    "the square root is the question:",
  "la serie di Fourier dell'onda quadra":
    "the Fourier series of the square wave",
  "lancia :quanti":
    "toss :quanti",
  "lato":
    "side",
  "lato minore di 1 → area ancora più piccola":
    "side smaller than 1 → an even smaller area",
  "lato × lato = area":
    "side × side = area",
  "le potenze di 2 (e perché i qubit sono speciali)":
    "powers of 2 (and why qubits are special)",
  "le quattro regole, disegnate":
    "the four rules, drawn out",
  "leggere una fase nascosta come numero binario":
    "reading a hidden phase as a binary number",
  "lunghezza :quanto < 1 → intrecciato":
    "length :quanto < 1 → entangled",
  "lunghezza :quanto < 1 → qubit intrecciato con altri":
    "length :quanto < 1 → qubit entangled with others",
  "lunghezza <span class=\"a\">:lunghezza</span>, fase :fase°":
    "length <span class=\"a\">:lunghezza</span>, phase :fase°",
  "lunghezza della freccia di Bloch: q0 = :q0, q1 = :q1":
    "length of the Bloch arrow: q0 = :q0, q1 = :q1",
  "metti/togli il filtro in mezzo":
    "add/remove the middle filter",
  "mettimi alla prova":
    "test me",
  "metà bicchiere":
    "half a glass",
  "miglior lettura: :y/:M = :valore (:percento%)":
    "best reading: :y/:M = :valore (:percento%)",
  "misterioso":
    "mystery",
  "misura 1 volta":
    "measure once",
  "misura 100 volte":
    "measure 100 times",
  "misura 200 volte":
    "measure 200 times",
  "misura il registro (come farebbe il computer quantistico)":
    "measure the register (as a quantum computer would)",
  "moneta (2 facce)":
    "coin (2 faces)",
  "moneta: mescola, mescola, guarda":
    "coin: shuffle, shuffle, look",
  "monta, lancia, indovina, migliora":
    "build, run, guess, improve",
  "muovi i cursori e guarda cosa cambia":
    "move the sliders and watch what changes",
  "muovi il cursore qui sotto — la riga tratteggiata è il bersaglio":
    "move the slider below — the dashed line is the target",
  "muovi il lato e guarda l'area":
    "move the side and watch the area",
  "n=:n: x=:x ruotato di :gradi° → (:re, :imi)":
    "n=:n: x=:x rotated by :gradi° → (:re, :imi)",
  "negativi":
    "negatives",
  "nessun denominatore utile (y = 0 capita spesso e non dice nulla). Rimisura.":
    "no useful denominator (y = 0 happens often and says nothing). Measure again.",
  "nessuna":
    "none",
  "numero ottimo di iterazioni ≈ (π/4)·√N = <b>:quante</b>":
    "optimal number of iterations ≈ (π/4)·√N = <b>:quante</b>",
  "nuova funzione segreta":
    "new secret function",
  "nuovo bersaglio":
    "new target",
  "nuovo segnale":
    "new signal",
  "nuovo segreto":
    "new secret",
  "obiettivo":
    "goal",
  "obiettivo :quanto%":
    "goal :quanto%",
  "ogni riga: indici pari a sinistra, dispari a destra":
    "each row: even indices on the left, odd on the right",
  "ombra orizz.":
    "horiz. shadow",
  "ombra orizzontale":
    "horizontal shadow",
  "onda A":
    "wave A",
  "onda B":
    "wave B",
  "onde":
    "waves",
  "ora clicca il bersaglio":
    "now click the target",
  "ordine = somma grande, disordine = zero":
    "order = big sum, disorder = zero",
  "ottimo ≈ :quante":
    "optimum ≈ :quante",
  "parte da :n":
    "starts at :n",
  "parte immaginaria = sin":
    "imaginary part = sin",
  "parte reale = cos":
    "real part = cos",
  "passa :percento%":
    ":percento% gets through",
  "passo :i/:totali":
    "step :i/:totali",
  "passo successivo":
    "next step",
  "percentuale · decimale · frazione":
    "percentage · decimal · fraction",
  "periodo 4":
    "period 4",
  "periodo T = 1/f = <span class=\"g\">:T s</span>  ·  in :durata s ci stanno :cicli cicli":
    "period T = 1/f = <span class=\"g\">:T s</span>  ·  :cicli cycles fit into :durata s",
  "porta il punto a :gradi° e leggi il :quale":
    "take the point to :gradi° and read the :quale",
  "porta il punto a <b>:gradi°</b> e guarda quanto vale il <b>:quale</b>.":
    "take the point to <b>:gradi°</b> and see what the <b>:quale</b> is.",
  "porta il razzo su :bersaglio":
    "take the rocket to :bersaglio",
  "porta la lancetta a :gradi°":
    "take the hand to :gradi°",
  "porta la lancetta dove ti chiedo":
    "take the hand where I ask",
  "porte applicate: :elenco":
    "gates applied: :elenco",
  "porte: :elenco":
    "gates: :elenco",
  "positivi":
    "positives",
  "possibili segreti ancora in gioco: <b>:quanti</b>":
    "possible secrets still in play: <b>:quanti</b>",
  "probabilità di leggere 0: <span class=\"g\">:p0%</span>   ·   di leggere 1: <span class=\"a\">:p1%</span>":
    "probability of reading 0: <span class=\"g\">:p0%</span>   ·   of reading 1: <span class=\"a\">:p1%</span>",
  "probabilità di leggere ciascun numero y (con :quanti qubit di lettura)":
    "probability of reading each number y (with :quanti read-out qubits)",
  "probabilità di misurare |:zeri⟩ = <b>:percento%</b>":
    "probability of measuring |:zeri⟩ = <b>:percento%</b>",
  "probabilità di pescare l'elemento giusto: <b>:ora%</b> (all'inizio era :prima%)":
    "probability of drawing the right element: <b>:ora%</b> (at the start it was :prima%)",
  "probabilità di trovare l'elemento giusto, iterazione per iterazione":
    "probability of finding the right element, iteration by iteration",
  "probabilità: 0 → <span class=\"g\">:p0%</span>, 1 → <span class=\"a\">:p1%</span>  (somma sempre 100%: :somma)":
    "probabilities: 0 → <span class=\"g\">:p0%</span>, 1 → <span class=\"a\">:p1%</span>  (always adds to 100%: :somma)",
  "prova 200 volte entrambi":
    "try both 200 times",
  "quanto c'è di ogni frequenza?":
    "how much of each frequency is there?",
  "quanto vale il centro di massa al variare di f":
    "what the centre of mass is worth as f varies",
  "quattro ampiezze, e la sorpresa dell'entanglement":
    "four amplitudes, and the surprise of entanglement",
  "qubit: H, H, misura":
    "qubit: H, H, measure",
  "questo r non porta a fattori utili: rimisura.":
    "this r leads to no useful factors: measure again.",
  "r è dispari: questo tentativo non serve. Rimisura (capita, è normale).":
    "r is odd: this attempt is no use. Measure again (it happens, it is normal).",
  "raggio":
    "radius",
  "raggio del cerchio":
    "radius of the circle",
  "raggiungi il bersaglio in poche mosse":
    "reach the target in few moves",
  "ricomincia":
    "start over",
  "riempi fino a :etichetta  (:spiegazione)":
    "fill up to :etichetta  (:spiegazione)",
  "riempi il bicchiere fino alla riga!":
    "fill the glass up to the line!",
  "rimescola":
    "reshuffle",
  "riparti da |0⟩":
    "start again from |0⟩",
  "risolvi il sistema":
    "solve the system",
  "rotazione 180° attorno a Y":
    "180° rotation about Y",
  "scambia due qubit":
    "swaps two qubits",
  "scansiona tutte le frequenze":
    "sweep every frequency",
  "scegli una porta, clicca sulla griglia":
    "pick a gate, click on the grid",
  "se sposti lo \"sfasamento iniziale\", i picchi <b>NON si muovono</b>. Le probabilità dipendono solo dal <b>periodo</b>, non da dove comincia. Ecco perché Shor può misurare il secondo registro senza rovinare tutto: qualunque cosa esca, la periodicità resta leggibile.":
    "if you move the \"initial offset\", the peaks <b>do NOT move</b>. The probabilities depend only on the <b>period</b>, not on where it starts. That is why Shor can measure the second register without ruining everything: whatever comes out, the periodicity stays readable.",
  "segnale: :frequenze Hz":
    "signal: :frequenze Hz",
  "segno meno su |1⟩":
    "minus sign on |1⟩",
  "seno":
    "sine",
  "sfasamento":
    "phase shift",
  "si scrive 2^:n":
    "written 2^:n",
  "soluzione":
    "solution",
  "somma =":
    "sum =",
  "somma = :somma  (massimo possibile: :max)":
    "sum = :somma  (largest possible: :max)",
  "somma le frecce una alla volta":
    "add the arrows one at a time",
  "somma parziale":
    "partial sum",
  "sorgente":
    "source",
  "sposta il cursore: quante operazioni servono":
    "move the slider: how many operations it takes",
  "sposta uno stato senza spostare la particella":
    "move a state without moving the particle",
  "stai giocando:":
    "you are playing:",
  "stato separabile: i due qubit sono indipendenti":
    "separable state: the two qubits are independent",
  "sto cercando nel corso…":
    "searching the course…",
  "sto sommando la freccia n = :n":
    "adding arrow n = :n",
  "sulla tua colonna":
    "in your column",
  "sulla tua riga":
    "in your row",
  "svuota":
    "clear",
  "tempo":
    "time",
  "test di separabilità |a·d − b·c| = <b>:valore</b> → ":
    "separability test |a·d − b·c| = <b>:valore</b> → ",
  "ti è servito?":
    "was it useful?",
  "togli ultima":
    "remove last",
  "trascina A e B":
    "drag A and B",
  "trascina i campioni, cambia k, guarda le frecce":
    "drag the samples, change k, watch the arrows",
  "trascina il punto sul cerchio":
    "drag the point around the circle",
  "trascina la lancetta o usa il cursore · un giro intero = 360°":
    "drag the hand or use the slider · a whole turn = 360°",
  "trascina per girare la palla":
    "drag to turn the ball",
  "trascinala col mouse!":
    "drag it with the mouse!",
  "tre quarti":
    "three quarters",
  "trova il bersaglio nascosto — colpiti :fatti/:totali":
    "find the hidden target — hits :fatti/:totali",
  "trova il lato che dà area :area":
    "find the side that gives area :area",
  "trova il periodo nascosto s: f(x) = f(x ⊕ s)":
    "find the hidden period s: f(x) = f(x ⊕ s)",
  "trova la stringa segreta con UNA domanda":
    "find the secret string with ONE query",
  "tu avevi risposto: :tua":
    "you answered: :tua",
  "tuo record per questa sfida: <b>:record</b>":
    "your record for this challenge: <b>:record</b>",
  "tutto":
    "all",
  "tutto uguale":
    "all the same",
  "un decimo":
    "a tenth",
  "un quarto":
    "a quarter",
  "un quinto":
    "a fifth",
  "un solo colpo":
    "a single spike",
  "una iterazione di Grover":
    "one Grover iteration",
  "una sola barra alta, tutto il resto a zero.":
    "one tall bar, everything else at zero.",
  "usa i bottoni: +1, −1, doppio, metà, cambia segno":
    "use the buttons: +1, −1, double, half, change sign",
  "vai a :gradi°":
    "go to :gradi°",
  "vai all'ottimo (:quante)":
    "go to the optimum (:quante)",
  "x (destra/sinistra)":
    "x (right/left)",
  "x(n) — i tuoi dati (trascinali!)":
    "x(n) — your data (drag it!)",
  "y (su/giù)":
    "y (up/down)",
  "|X(k)| — quanto c'è di ogni frequenza (clicca una barra)":
    "|X(k)| — how much of each frequency there is (click a bar)",
  "È uscito <b>y = :y</b> → y/M = :y/:M = <b>:valore</b>":
    "Out came <b>y = :y</b> → y/M = :y/:M = <b>:valore</b>",
  "è BILANCIATA":
    "it is BALANCED",
  "è COSTANTE":
    "it is CONSTANT",
  "è la probabilità":
    "is the probability",
  "θ dello stato da mandare":
    "θ of the state to send",
  "θ — <b>quanto |1⟩</b> c'è":
    "θ — <b>how much |1⟩</b> there is",
  "φ dello stato da mandare":
    "φ of the state to send",
  "φ non è rappresentabile esattamente: la probabilità si sparpaglia sui valori vicini (ma resta concentrata: almeno :minimo% sul valore più vicino).":
    "φ cannot be represented exactly: the probability spreads over nearby values (but stays concentrated: at least :minimo% on the closest one).",
  "φ è esattamente rappresentabile con questi qubit: il risultato esce con probabilità 100%.":
    "φ is exactly representable with these qubits: the result comes out with probability 100%.",
  "φ — <b>la fase</b> (non cambia le probabilità!)":
    "φ — <b>the phase</b> (it does not change the probabilities!)",
  "… e altri :quanti (non ci stanno nello schermo)":
    "… and :quanti more (they do not fit on screen)",
  "→ risposta: :risposta (la funzione era davvero <b>:vera</b>) :esito":
    "→ answer: :risposta (the function really was <b>:vera</b>) :esito",

  /* ---------------- Part K: classical computing, and the comparison blocks ---------------- */
  'quanto costa': 'what it costs',
  'computer normale': 'normal computer',
  'computer quantistico': 'quantum computer',
  'Ripassa il livello :n — :titolo': 'Review level :n — :titolo',
  'Prima in classico, poi in quantistico': 'Classical first, quantum second',
  'Come si fa con un computer normale': 'How it is done on a normal computer',
  'Cosa cambia con quello quantistico': 'What changes on a quantum one',

  'Parte K — Il computer classico (il termine di paragone)': 'Part K — The classical computer (the yardstick)',
  "Bit, porte logiche, somma binaria, ricerca, costo di un algoritmo, reversibilità. Ogni livello finisce con l'anticipazione di cosa cambierà nel quantistico. Facoltativa se sai già come funziona un computer normale.":
    'Bits, logic gates, binary addition, searching, the cost of an algorithm, reversibility. Every level ends with a preview of what quantum will change. Optional if you already know how a normal computer works.',
  'Il bit: acceso, spento, e come ci si scrive tutto': 'The bit: on, off, and how everything is written with it',
  'Interruttori, binario, byte, testo. E il conto che tornerà: con n bit scegli UN numero fra 2ⁿ.':
    'Switches, binary, bytes, text. And the count that keeps coming back: with n bits you pick ONE number out of 2ⁿ.',
  'Porte logiche: AND, OR, NOT, XOR': 'Logic gates: AND, OR, NOT, XOR',
  'Tabelle di verità giocate, e la scoperta che una porta sola basta per costruire tutte le altre.':
    'Truth tables played, and the discovery that one single gate is enough to build all the others.',
  'La somma, come la fa davvero il processore': 'Addition, the way the processor really does it',
  "Riporto, mezzo sommatore, sommatore completo: monti l'addizione a 4 bit con le tue mani.":
    'Carry, half adder, full adder: you build the 4-bit addition with your own hands.',
  'Cercare: a tentoni, oppure dimezzando': 'Searching: groping around, or halving',
  'Ricerca lineare e ricerca binaria, contando i confronti uno per uno. Il metro di paragone di Grover.':
    'Linear search and binary search, counting the comparisons one by one. The yardstick for Grover.',
  'Quanto costa un algoritmo: N, log N, N², 2ⁿ': 'What an algorithm costs: N, log N, N², 2ⁿ',
  'La gara fra le curve di crescita. Qui si capisce che cosa significa davvero "vantaggio quantistico".':
    'The race between growth curves. This is where "quantum advantage" starts to mean something.',
  'Informazione che si perde: il ponte verso il quantistico': 'Information that gets lost: the bridge to quantum',
  "AND butta via un bit, cancellare scalda (Landauer), Toffoli calcola all'indietro. Da qui parte tutto.":
    'AND throws a bit away, erasing releases heat (Landauer), Toffoli computes backwards. Everything starts here.',

  'FATTO!': 'DONE!',

  /* bit lab */
  'La macchina a interruttori': 'The switch machine',
  'accendi i bit finché il numero non è quello giusto': 'flip the bits until the number is the right one',
  'accendi gli interruttori per fare :numero': 'flip the switches to make :numero',
  'ogni interruttore vale il doppio di quello alla sua destra — tocca per accenderlo':
    'every switch is worth double the one to its right — tap to turn it on',
  'tutto spento = 0': 'all off = 0',
  'nuovo numero': 'new number',
  'spegni tutto': 'all off',
  'Binario: <b>:bin</b>  ·  decimale: <b>:dec</b>  ·  esadecimale: <b>:hex</b>':
    'Binary: <b>:bin</b>  ·  decimal: <b>:dec</b>  ·  hexadecimal: <b>:hex</b>',
  'Se questi 8 bit fossero testo, sarebbero il carattere «<b>:carattere</b>».':
    'If these 8 bits were text, they would be the character "<b>:carattere</b>".',
  'Con :n interruttori i numeri diversi possibili sono 2^:n = <b>:totale</b>. Ma tu, in questo momento, ne stai tenendo <b>uno solo</b>.':
    'With :n switches the possible different numbers are 2^:n = <b>:totale</b>. But right now you are holding <b>exactly one</b> of them.',
  '<b>Tienilo da parte:</b> con 8 bit ci sono 256 configurazioni possibili, e il computer ne tiene <b>una</b>. Fra qualche livello vedrai 8 <i>qubit</i> che tengono tutte e 256 le ampiezze <b>insieme</b> — ed è lì che comincia la storia, non prima.':
    '<b>Keep this in your pocket:</b> with 8 bits there are 256 possible configurations, and the computer holds <b>one</b>. A few levels from now you will see 8 <i>qubits</i> holding all 256 amplitudes <b>together</b> — and that is where the story starts, not before.',

  /* logic lab */
  'Il banco delle porte logiche': 'The logic gate bench',
  'accendi gli ingressi e guarda cosa esce': 'flip the inputs and watch what comes out',
  'scopri quale porta è nascosta nella scatola': 'work out which gate is hidden in the box',
  'domande fatte alla scatola: :n — poi dichiara la porta qui sotto':
    'questions asked so far: :n — then name the gate below',
  'esplora tutte e 4 le righe della tabella di :porta': 'explore all 4 rows of the :porta table',
  'tocca gli ingressi A e B per cambiarli': 'tap inputs A and B to change them',
  'uscita': 'output',
  'tabella di verità': 'truth table',
  'porta al banco': 'gate on the bench',
  'è :porta': 'it is :porta',
  'banco libero': 'free bench',
  'porta misteriosa': 'mystery gate',
  '✓ era :porta, trovata con :n domande': '✓ it was :porta, found with :n questions',
  '✗ no: la tabella non torna. Guarda meglio le righe che hai già chiesto.':
    '✗ no: the table does not match. Look again at the rows you have already asked for.',
  'Righe già chieste alla scatola: <b>:viste su 4</b>. Per essere <b>certo</b> di quale porta è, quante te ne servono?':
    'Rows asked for so far: <b>:viste out of 4</b>. To be <b>certain</b> which gate it is, how many do you need?',
  'Indovinate: <b>:fatte/:totali</b>': 'Identified: <b>:fatte/:totali</b>',
  '<b>:porta</b>(:a, :b) = <b>:uscita</b>  ·  la sua tabella di verità per intero è <b>:firma</b>':
    '<b>:porta</b>(:a, :b) = <b>:uscita</b>  ·  its full truth table is <b>:firma</b>',
  'Righe esplorate: <b>:viste/4</b>': 'Rows explored: <b>:viste/4</b>',
  "<b>Da notare:</b> per essere sicuro di quale porta c'è nella scatola devi provare <b>tutte e quattro</b> le combinazioni. La scatola risponde a una domanda per volta, e non c'è furbizia che tenga. Al livello 9 la stessa scatola, interrogata da un computer quantistico, risponderà a <b>tutte le combinazioni in una volta sola</b>.":
    '<b>Worth noticing:</b> to be sure which gate is in the box you have to try <b>all four</b> combinations. The box answers one question at a time, and no cleverness gets around it. At level 9 the same box, questioned by a quantum computer, will answer <b>all the combinations in one go</b>.',

  /* NAND workshop */
  "L'officina del NAND": 'The NAND workshop',
  'una porta sola, e ci costruisci tutte le altre': 'one gate only, and you build all the others out of it',
  'un NAND con lo stesso filo in tutti e due gli ingressi': 'one NAND with the same wire in both inputs',
  'NAND, e poi un NAND che fa da NOT': 'a NAND, then a NAND acting as a NOT',
  'nega A, nega B, e poi mettili in NAND (è De Morgan)': 'negate A, negate B, then NAND them (this is De Morgan)',
  'quattro NAND: è il pezzo che il livello K·3 userà per sommare':
    'four NANDs: this is the piece level K·3 will use for adding',
  'costruisci :porta usando solo NAND': 'build :porta using NAND gates only',
  'la tua': 'yours',
  'ingresso 1': 'input 1',
  'ingresso 2': 'input 2',
  'uscita della rete': 'network output',
  'La tua rete fa <b>:mia</b>, il bersaglio è <b>:bersaglio</b>.': 'Your network gives <b>:mia</b>, the target is <b>:bersaglio</b>.',
  'Costruite finora: <b>:elenco</b>': 'Built so far: <b>:elenco</b>',
  'è esattamente :porta, fatta di soli NAND.': 'that is exactly :porta, made of NANDs only.',
  '<b>G1, G2, G3, G4</b> sono le quattro porte NAND che hai a disposizione — <b>G</b> sta per <i>gate</i>, porta. Per ognuna scegli da dove arrivano i suoi due ingressi: da A, da B, oppure dall\'uscita di una porta precedente.':
    '<b>G1, G2, G3, G4</b> are the four NAND gates you get — <b>G</b> is for <i>gate</i>. For each one you choose where its two inputs come from: from A, from B, or from the output of an earlier gate.',
  '<b>Uscita della rete</b> dice quale di quelle quattro porte leggi alla fine: il bit che esce da lei è il risultato di tutta la rete. Le altre porte, se non arrivano fin lì, non contano niente.':
    '<b>Network output</b> says which of those four gates you read at the end: the bit coming out of it is the result of the whole network. Any other gate that does not reach it counts for nothing.',
  'gli ingressi sono due — tocca per cambiarli': 'there are two inputs — tap to flip them',
  'adesso stai provando il caso :caso, la colonna :caso qui sotto':
    'right now you are trying case :caso, column :caso below',
  scollegata: 'not wired in',
  'azzera la rete': 'clear the network',
  'con A=:a e B=:b (colonna :caso):': 'with A=:a and B=:b (column :caso):',
  '(:elenco non arrivano all\'uscita: non contano)': '(:elenco never reach the output: they do not count)',
  'La colonna azzurra è la stessa porta provata in tutti e quattro i casi: <b>un</b> bit alla volta, quattro volte.':
    'The cyan column is that same gate tried in all four cases: <b>one</b> bit at a time, four times over.',
  'Adesso dalla rete esce <b>un</b> bit solo: :bit. Le quattro cifre qui sotto sono le quattro risposte, una per ogni caso di A e B.':
    'Right now <b>one</b> bit comes out of the network: :bit. The four digits below are the four answers, one per case of A and B.',
  'nessuno, un filo va all\'indietro': 'none, one wire runs backwards',
  'Hai usato :usate porte: lo stesso risultato si ottiene con :minimo. Guarda la catena: qualche porta rifà un lavoro già fatto (due NOT di fila si annullano).':
    'You used :usate gates: the same result needs only :minimo. Look at the chain: some gate is redoing work already done (two NOTs in a row cancel out).',
  'E con :minimo porte, che è il minimo per questa ricetta.': 'And with :minimo gates, which is the minimum for this recipe.',

  /* NAND workshop — the recipe, revealed one step at a time */
  '👣 fammi vedere i passi': '👣 show me the steps',
  'nascondi i passi': 'hide the steps',
  'passo successivo (:passo di :quanti)': 'next step (:passo of :quanti)',
  '<b>:passo.</b> G:gate: ingresso 1 = <b>:uno</b>, ingresso 2 = <b>:due</b> — :motivo Controlla G:gate: deve fare <b>:firma</b>.':
    '<b>:passo.</b> G:gate: input 1 = <b>:uno</b>, input 2 = <b>:due</b> — :motivo Check G:gate: it must give <b>:firma</b>.',
  '<b>:passo.</b> Uscita della rete = <b>G:gate</b>. Ecco :porta con :quante porte, e ogni passo si vede da solo nella catena qui sotto.':
    '<b>:passo.</b> Network output = <b>G:gate</b>. There is :porta with :quante gates, and every step shows for itself in the chain below.',
  'lo stesso filo nei due ingressi: «non (A e A)» è «non A».':
    'the same wire in both inputs: "not (A and A)" is "not A".',
  'un NAND è l\'AND rovesciato: 1110 è 0001 con gli 0 e gli 1 scambiati.':
    'a NAND is the AND turned over: 1110 is 0001 with the 0s and 1s swapped.',
  'un NAND con lo stesso filo due volte fa da NOT: rovescia G1 e resta l\'AND.':
    'a NAND with the same wire twice acts as a NOT: it turns G1 over and the AND is left.',
  'questo è NOT A.': 'this one is NOT A.',
  'e questo è NOT B.': 'and this one is NOT B.',
  'De Morgan: «non (non A e non B)» è «A oppure B».': 'De Morgan: "not (not A and not B)" is "A or B".',
  'il NAND di partenza: vale 0 solo quando A e B sono tutti e due 1.':
    'the starting NAND: it is 0 only when A and B are both 1.',
  'vale 0 solo nel caso A=1, B=0.': 'it is 0 only in the case A=1, B=0.',
  'vale 0 solo nel caso opposto, A=0, B=1.': 'it is 0 only in the opposite case, A=0, B=1.',
  'il NAND dei due: dà 1 esattamente quando A e B sono diversi.':
    'the NAND of those two: it gives 1 exactly when A and B differ.',
  '<b>Perché conta:</b> un tipo solo di porta basta per costruire qualunque calcolo — si dice che il NAND è <b>universale</b>. Anche il computer quantistico ha i suoi insiemi universali di porte, e ci si arriva con lo stesso ragionamento: pochi mattoni, combinati, fanno tutto il resto.':
    '<b>Why it matters:</b> a single kind of gate is enough to build any computation — NAND is said to be <b>universal</b>. Quantum computers have universal gate sets too, reached by the same reasoning: a few bricks, combined, make all the rest.',

  /* adder */
  'Il sommatore a :n bit': 'The :n-bit adder',
  'metti tu i riporti, come si fa in colonna': 'you put in the carries, the way you do it on paper',
  'somma :a + :b in binario': 'add :a + :b in binary',
  'tocca le caselle blu per metterci 0 o 1 — parti da destra, come in prima elementare':
    'tap the blue cells to put 0 or 1 in them — start from the right, as in primary school',
  'riporto': 'carry',
  'somma': 'sum',
  'sommate giuste: :fatte/:totali': 'correct additions: :fatte/:totali',
  'nuova somma': 'new addition',
  'mostrami la soluzione': 'show me the solution',
  '(soluzione mostrata: questa non conta)': '(solution shown: this one does not count)',
  'In decimale: <b>:a + :b = :tot</b>. In binario le colonne si fanno una per volta, da destra: se la colonna fa 2, scrivi 0 e <b>porti 1</b>.':
    'In decimal: <b>:a + :b = :tot</b>. In binary the columns are done one at a time, from the right: if the column makes 2, write 0 and <b>carry 1</b>.',
  'Ogni colonna è due porte: <b>somma = A XOR B</b>, <b>riporto = A AND B</b>. Sono le stesse porte del livello K·2.':
    'Every column is two gates: <b>sum = A XOR B</b>, <b>carry = A AND B</b>. The very same gates as level K·2.',
  'colonne tutte giuste.': 'every column correct.',
  '<b>Il punto da tenere:</b> il riporto passa da una colonna alla successiva, quindi le colonne vanno fatte <b>in ordine</b>. È una catena, e una catena non si accorcia mettendo più processori. Il sommatore quantistico ha lo stesso problema — e in più deve essere <b>reversibile</b>, cosa che il livello K·6 spiega.':
    '<b>The point to keep:</b> the carry passes from one column to the next, so the columns must be done <b>in order</b>. It is a chain, and a chain does not get shorter by adding processors. The quantum adder has the same problem — and on top of that it must be <b>reversible</b>, which level K·6 explains.',

  /* search */
  'La caccia nello scaffale': 'The hunt on the shelf',
  'apri le scatole finché non trovi il numero — e conta quante ne apri':
    'open boxes until you find the number — and count how many you open',
  'trova il numero :numero': 'find the number :numero',
  'lo scaffale è ORDINATO: ogni scatola aperta ti dice anche da che parte continuare':
    'the shelf is SORTED: every opened box also tells you which way to go on',
  'lo scaffale è in disordine: una scatola aperta dice solo sé stessa':
    'the shelf is unsorted: an opened box only tells you about itself',
  'scatole aperte: :n': 'boxes opened: :n',
  'con il dimezzamento bastano :n aperture, sempre': 'by halving, :n openings are always enough',
  'in media servono :n aperture, e nel caso peggiore :max': 'on average it takes :n openings, and :max in the worst case',
  'scaffale in disordine': 'unsorted shelf',
  'scaffale ordinato': 'sorted shelf',
  'nuova partita': 'new game',
  'Ogni apertura ti dice «più grande» o «più piccolo», quindi puoi buttare via <b>metà</b> scaffale ogni volta: :n scatole → log₂(:n) ≈ <b>:passi aperture</b>.':
    'Every opening tells you "bigger" or "smaller", so you can throw away <b>half</b> the shelf each time: :n boxes → log₂(:n) ≈ <b>:passi openings</b>.',
  "Nessun indizio: l'unica strategia è provare. Su :n scatole, in media <b>:media</b> aperture, nel caso peggiore <b>:n</b>.":
    'No hints: the only strategy is trying. On :n boxes, <b>:media</b> openings on average, <b>:n</b> in the worst case.',
  'Scatole ancora possibili: <b>:rimaste</b> · aperture usate: <b>:mosse</b>':
    'Boxes still possible: <b>:rimaste</b> · openings used: <b>:mosse</b>',
  'Record — disordine: <b>:a</b> · ordinato: <b>:b</b>': 'Best — unsorted: <b>:a</b> · sorted: <b>:b</b>',
  'trovato in :n aperture!': 'found in :n openings!',
  '<b>Da ricordare per il livello 11:</b> se la lista è ordinata, dimezzare porta a log N ed è imbattibile. Se è in <b>disordine</b> — e senza struttura da sfruttare — il classico non può fare meglio di N/2 tentativi. Grover, su quello stesso scaffale disordinato, ne farà circa <b>√N</b>: su 10.000 scatole, 100 aperture invece di 5.000.':
    '<b>Remember this for level 11:</b> if the list is sorted, halving gives log N and is unbeatable. If it is <b>unsorted</b> — with no structure to exploit — a classical computer cannot do better than N/2 tries. Grover, on that same unsorted shelf, will take about <b>√N</b>: on 10,000 boxes, 100 openings instead of 5,000.',

  /* cost */
  'La gara delle crescite': 'The growth race',
  'quante operazioni servono, al crescere del problema': 'how many operations it takes as the problem grows',
  'meno di un microsecondo': 'less than a microsecond',
  'millisecondi': 'milliseconds',
  'secondi': 'seconds',
  'minuti': 'minutes',
  'ore': 'hours',
  'giorni': 'days',
  'anni': 'years',
  ":volte volte l'età dell'universo": ':volte times the age of the universe',
  'trova il primo N per cui 2^N supera un anno di calcolo': 'find the first N for which 2^N passes one year of computing',
  'un miliardo di operazioni al secondo, che è un computer normale':
    'a billion operations per second, which is a normal computer',
  'un anno di calcolo': 'one year of computing',
  'operazioni con 2^N': 'operations with 2^N',
  'dimensione del problema <b>N</b>': 'problem size <b>N</b>',
  "eccolo: da N = :n in poi la forza bruta non è più un'opzione.":
    'there it is: from N = :n on, brute force is no longer an option.',
  '<b>La riga che spiega tutto il corso:</b> passare da N² a N·log N è una buona ottimizzazione. Passare da N a √N (Grover) è un bel guadagno. Passare da <b>2^N a N³</b> — da esponenziale a polinomiale, che è quello che fa Shor sulla fattorizzazione — non è una ottimizzazione: è la differenza fra «impossibile per sempre» e «fatto stasera».':
    '<b>The line that explains the whole course:</b> going from N² to N·log N is a good optimisation. Going from N to √N (Grover) is a nice gain. Going from <b>2^N to N³</b> — from exponential to polynomial, which is what Shor does to factoring — is not an optimisation: it is the difference between "impossible forever" and "done tonight".',

  /* reversibility */
  'Avanti e indietro': 'Forwards and backwards',
  'la porta AND perde la strada di casa, Toffoli no': 'the AND gate loses its way home, Toffoli does not',
  "riporta i tre bit a com'erano all'inizio": 'put the three bits back the way they started',
  'nessuna porta qui butta via niente: si torna indietro ripercorrendo la strada':
    'no gate here throws anything away: you go back by walking the same road',
  'partenza': 'start',
  'adesso': 'now',
  'porte applicate da te: :n': 'gates you applied: :n',
  'rimesse a posto: :n': 'put back: :n',
  'nuova sfida': 'new challenge',
  'come si torna indietro?': 'how do I go back?',
  "Queste cinque porte sono <b>reversibili</b>: da come esce si risale a com'era entrato, sempre. Basta rifare le stesse porte <b>in ordine inverso</b> — e ognuna di queste è l'inversa di sé stessa.":
    'These five gates are <b>reversible</b>: from the output you can always get back to the input. Just reapply the same gates <b>in reverse order</b> — and each one of these is its own inverse.',
  "Suggerimento: il computer ha applicato <b>:elenco</b>. Rifalle dall'ultima alla prima.":
    'Hint: the computer applied <b>:elenco</b>. Redo them from the last to the first.',
  "Confronta con <b>AND</b>: da un'uscita 0 non si risale agli ingressi (potevano essere 00, 01 o 10). Quel bit è <b>perso</b>, e per la fisica «perso» significa <b>scaldato</b>: cancellare un bit costa almeno kT·ln2 ≈ 3·10⁻²¹ joule (Landauer, 1961; misurato in laboratorio da Bérut et al., 2012).":
    'Compare with <b>AND</b>: from a 0 output you cannot get back to the inputs (they could have been 00, 01 or 10). That bit is <b>lost</b>, and for physics "lost" means <b>heated</b>: erasing one bit costs at least kT·ln2 ≈ 3·10⁻²¹ joules (Landauer, 1961; measured in the lab by Bérut et al., 2012).',
  'tornato al punto di partenza in :n mosse.': 'back to the starting point in :n moves.',
  "<b>Il ponte:</b> le porte quantistiche sono <b>tutte</b> reversibili, senza eccezioni — è una conseguenza delle regole della fisica, non una scelta di ingegneria. Per questo un computer quantistico non può usare AND così com'è: deve usare Toffoli, che l'AND se lo tiene in un bit in più invece di buttarlo via.":
    '<b>The bridge:</b> quantum gates are <b>all</b> reversible, no exceptions — a consequence of the rules of physics, not an engineering choice. That is why a quantum computer cannot use AND as it is: it has to use Toffoli, which keeps the AND on an extra bit instead of throwing it away.',

  /* classical oracle */
  'La scatola: costante o bilanciata?': 'The box: constant or balanced?',
  'La scatola con la stringa segreta': 'The box with the secret string',
  'ogni interrogazione conta — e si vede': 'every query counts — and it shows',
  'scopri se la funzione nella scatola è costante o bilanciata':
    'work out whether the function in the box is constant or balanced',
  'scopri la stringa segreta di :n bit': 'work out the secret string of :n bits',
  'domande fatte: :n — classicamente ne servono :max': 'questions asked: :n — classically you need :max',
  'la tua domanda x': 'your query x',
  '✓ giusto, con :n domande.': '✓ right, with :n questions.',
  "✓ giusto! Un'altra scatola ti aspetta.": '✓ right! Another box is waiting for you.',
  '✗ no. Non hai ancora abbastanza informazione: chiedi ancora.':
    '✗ no. You do not have enough information yet: ask again.',
  'interroga la scatola': 'query the box',
  'è costante': 'it is constant',
  'è bilanciata': 'it is balanced',
  'il segreto è la stringa che ho impostato': 'the secret is the string I have set',
  'nuova scatola': 'new box',
  "La scatola nasconde una funzione da 1 bit a 1 bit. <b>Costante</b> vuol dire che risponde sempre uguale; <b>bilanciata</b> che risponde 0 a un ingresso e 1 all'altro.":
    'The box hides a function from 1 bit to 1 bit. <b>Constant</b> means it always answers the same; <b>balanced</b> means it answers 0 to one input and 1 to the other.',
  'Con una domanda sola non puoi mai deciderlo: qualunque risposta è compatibile con tutte e due i casi. Servono <b>2 domande su 2 ingressi possibili</b>.':
    'With a single question you can never decide: any answer is compatible with both cases. You need <b>2 questions on 2 possible inputs</b>.',
  'La scatola nasconde :n bit segreti e risponde con il «prodotto» della tua domanda con il segreto (somma dei bit in comune, modulo 2).':
    'The box hides :n secret bits and answers with the "product" of your query and the secret (sum of the shared bits, modulo 2).',
  'La strategia migliore è chiedere 1000…, 0100…, 0010… — un bit per volta. <b>:n domande per :n bit</b>: una a testa, non si scappa.':
    'The best strategy is to ask 1000…, 0100…, 0010… — one bit at a time. <b>:n questions for :n bits</b>: one each, no way around it.',
  '<b>Segnati il numero: 2.</b> Con n bit invece di 1, il classico ha bisogno nel caso peggiore di <b>2ⁿ⁻¹+1</b> domande. Al livello 9 il computer quantistico ne farà <b>una</b>, e non perché è più veloce: perché fa una domanda diversa.':
    '<b>Note the number down: 2.</b> With n bits instead of 1, a classical computer needs <b>2ⁿ⁻¹+1</b> questions in the worst case. At level 9 the quantum computer will ask <b>one</b>, and not because it is faster: because it asks a different question.',
  '<b>Segnati il numero: :n.</b> Una domanda per ogni bit del segreto, ed è dimostrato che meglio non si può fare classicamente. Al livello 10 Bernstein–Vazirani tirerà fuori tutta la stringa con <b>una sola</b> interrogazione.':
    '<b>Note the number down: :n.</b> One question per bit of the secret, and it is proved that classically you cannot do better. At level 10 Bernstein–Vazirani will pull out the whole string with <b>a single</b> query.',

  /* repetition code */
  'Il codice a ripetizione': 'The repetition code',
  'dire la stessa cosa tre volte, e votare a maggioranza': 'say the same thing three times, and vote by majority',
  'manda almeno 200 bit e guarda le due percentuali separarsi':
    'send at least 200 bits and watch the two percentages pull apart',
  'con rumore basso, ripetere conviene; con rumore alto, peggiora':
    'with low noise, repeating pays off; with high noise, it makes things worse',
  'bit da mandare': 'bit to send',
  'senza codice': 'without the code',
  'in tre copie': 'in three copies',
  'voto': 'vote',
  'errori senza codice': 'errors without the code',
  'errori con le tre copie': 'errors with three copies',
  'probabilità che un bit si rovesci <b>p</b>': 'probability that a bit flips <b>p</b>',
  'manda 1 bit': 'send 1 bit',
  'manda 100 bit': 'send 100 bits',
  'azzera il conteggio': 'reset the count',
  'Senza codice sbagli con probabilità <b>p = :p%</b>. Con tre copie sbagli solo se si rovesciano <b>due o tre</b> copie: 3p² − 2p³ = <b>:teorico%</b>.':
    'Without the code you get it wrong with probability <b>p = :p%</b>. With three copies you only get it wrong if <b>two or three</b> copies flip: 3p² − 2p³ = <b>:teorico%</b>.',
  'Bit mandati: <b>:n</b> · errori senza codice: <b>:a</b> · errori con le copie: <b>:b</b>':
    'Bits sent: <b>:n</b> · errors without the code: <b>:a</b> · errors with the copies: <b>:b</b>',
  "Sotto p = 50% ripetere <b>conviene</b>, e più copie metti meglio va: è la soglia sotto cui la correzione d'errore funziona.":
    'Below p = 50% repeating <b>pays off</b>, and the more copies the better: that is the threshold below which error correction works.',
  "Sopra p = 50% ripetere <b>peggiora</b> le cose: la maggioranza vota per l'errore. Anche il quantistico ha la sua soglia, ed è il motivo per cui il livello 21 esiste.":
    'Above p = 50% repeating <b>makes things worse</b>: the majority votes for the error. Quantum has its own threshold too, and that is why level 21 exists.',
  "<b>Perché il quantistico non può copiare questo trucco così com'è:</b> ripetere vuol dire <b>copiare</b>, e un qubit non si può copiare (teorema di no-cloning, livello 6). E poi qui l'errore è uno solo — il bit si rovescia — mentre un qubit può sbagliare anche di <b>fase</b>. Il codice di Shor a 9 qubit risolve tutti e due i problemi in una volta.":
    '<b>Why quantum cannot copy this trick as it is:</b> repeating means <b>copying</b>, and a qubit cannot be copied (the no-cloning theorem, level 6). And here there is only one kind of error — the bit flips — while a qubit can also go wrong in <b>phase</b>. Shor’s 9-qubit code solves both problems at once.',

  /* ---------------- paired exercises: classical mode → quantum mode ---------------- */
  'Questo gioco calcola con un :macchina': 'This game computes with a :macchina',
  'con un computer normale': 'with a normal computer',
  'con uno quantistico': 'with a quantum one',

  /* the register */
  'Lo stesso registro, due macchine': 'The same register, two machines',
  "tre caselle: prova a leggerle con l'una e con l'altra": 'three cells: try reading them on one machine, then the other',
  'leggi il registro 5 volte: esce sempre lo stesso?': 'read the register 5 times: is it always the same?',
  'metti tutte e :n le caselle in sovrapposizione, poi leggi 20 volte':
    'put all :n cells in superposition, then read 20 times',
  'un registro classico contiene UNA configurazione: le altre :quante non esistono da nessuna parte':
    'a classical register holds ONE configuration: the other :quante exist nowhere at all',
  'un registro quantistico porta :quante ampiezze insieme — ma la lettura ne restituisce una sola':
    'a quantum register carries :quante amplitudes together — but reading gives back only one',
  'bit': 'bit',
  'qubit': 'qubit',
  'dove sta il registro adesso': 'where the register is right now',
  'probabilità di ogni risultato': 'probability of each result',
  'letture: :n — valori diversi usciti: :diversi': 'readings: :n — different values seen: :diversi',
  'rovescia un bit a caso': 'flip a random bit',
  'leggi il registro': 'read the register',
  'misura': 'measure',
  "Il registro contiene <b>:valore</b> e nient'altro. Le altre :quante configurazioni sono possibili, non presenti: nessuno le sta calcolando.":
    'The register holds <b>:valore</b> and nothing else. The other :quante configurations are possible, not present: nobody is computing them.',
  'Leggerlo non lo cambia: puoi leggerlo mille volte e trovare mille volte lo stesso numero. Letture fatte: <b>:n</b>, valori diversi usciti: <b>:diversi</b>.':
    'Reading it does not change it: read it a thousand times and find the same number a thousand times. Readings so far: <b>:n</b>, different values seen: <b>:diversi</b>.',
  'Il circuito che hai montato accende <b>:piene ampiezze</b> su :totale. Con una H per qubit diventano tutte e :totale, ognuna con probabilità :percento%.':
    'The circuit you have built lights up <b>:piene amplitudes</b> out of :totale. With one H per qubit they all become :totale, each with probability :p%.',
  'La misura ne restituirà <b>una sola</b>, a caso — e quella che esce è tutto quello che ti resta.':
    'The measurement will give back <b>one only</b>, at random — and the one that comes out is all you are left with.',
  "L'ultima misura ha fatto <b>collassare</b> lo stato su :valore: le altre ampiezze sono sparite. Premi ancora e il circuito riparte da capo, come su una macchina vera.":
    'The last measurement <b>collapsed</b> the state onto :valore: the other amplitudes are gone. Press again and the circuit runs from scratch, as on a real machine.',
  'Letture fatte: <b>:n</b>, valori diversi usciti: <b>:diversi</b>.':
    'Readings so far: <b>:n</b>, different values seen: <b>:diversi</b>.',
  'fatto in questo modo.': 'done in this mode.',
  "<b>Quello che hai appena visto:</b> le barre sono lo stesso disegno nei due modi, e sono l'unica cosa che cambia. Una sola colonna piena contro :totale colonne insieme — ma la lettura, in tutti e due i casi, ti restituisce <b>una riga di :n cifre</b>. Il mestiere dell'informatica quantistica è far sì che la riga che esce sia quella che serve.":
    '<b>What you have just seen:</b> the bars are the same drawing in both modes, and they are the only thing that changes. One single full column against :totale columns together — but reading, in both cases, gives you back <b>one row of :n digits</b>. The craft of quantum computing is making sure the row that comes out is the one you need.',

  /* jumps against rotations */
  'Salti contro rotazioni': 'Jumps against rotations',
  'la stessa lancetta, e cosa le si può fare': 'the same hand, and what can be done to it',
  "con un bit hai una porta sola che muove: NOT, e salta da un estremo all'altro":
    'with a bit you have one gate that moves: NOT, and it jumps from one end to the other',
  'con un qubit ogni porta è una rotazione: H fa un quarto di giro, X mezzo':
    'with a qubit every gate is a rotation: H turns a quarter, X a half',
  'probabilità di leggere 0: :p0%  ·  di leggere 1: :p1%':
    'probability of reading 0: :p0%  ·  of reading 1: :p1%',
  'nessuna porta classica arriva a metà: un bit è 0 oppure 1':
    'no classical gate reaches halfway: a bit is 0 or 1',
  'lascia stare (identità)': 'leave it alone (identity)',
  "Con un bit ci sono <b>due sole posizioni</b>: 0 e 1. L'unica porta che muove è NOT, e ti sbatte da una all'altra.":
    'With a bit there are <b>only two positions</b>: 0 and 1. The only gate that moves is NOT, and it throws you from one to the other.',
  'Il bersaglio a 90° <b>non è raggiungibile</b>, e non perché manchi la porta giusta: non esiste niente da mettere lì. Un bit «mezzo acceso» non è uno stato, è un guasto.':
    'The target at 90° is <b>unreachable</b>, and not because the right gate is missing: there is nothing that could be put there. A "half-on" bit is not a state, it is a fault.',
  'Con un qubit la lancetta si muove con continuità: <b>H</b> è il quarto di giro che manda |0⟩ in |+⟩, X è mezzo giro, e le rotazioni fanno il resto.':
    'With a qubit the hand moves continuously: <b>H</b> is the quarter turn that takes |0⟩ to |+⟩, X is a half turn, and rotations do the rest.',
  "A 90° le due probabilità sono 50% e 50%. Sembra una moneta — e invece <b>applica H un'altra volta</b> e torni esattamente a |0⟩: una moneta mescolata due volte resta casuale, questa no.":
    'At 90° the two probabilities are 50% and 50%. It looks like a coin — but <b>apply H once more</b> and you are back exactly at |0⟩: a coin shuffled twice stays random, this does not.',
  'Mosse: :elenco': 'Moves: :elenco',
  'hai toccato il muro: è quello il punto.': 'you have hit the wall: that is the point.',
  'centrato, e classicamente era impossibile.': 'on target, and classically it was impossible.',
  "<b>La differenza, detta bene:</b> una porta classica è una <b>tabella</b> (a ogni ingresso il suo uscita) e i valori possibili sono due. Una porta quantistica è una <b>rotazione</b>, e fra 0 e 1 c'è tutto un giro di posizioni intermedie. Le rotazioni si compongono e si disfano — ed è per questo che H·Z·H fa esattamente X.":
    '<b>The difference, put properly:</b> a classical gate is a <b>table</b> (one output per input) and there are two possible values. A quantum gate is a <b>rotation</b>, and between 0 and 1 there is a whole turn of intermediate positions. Rotations compose and undo each other — which is why H·Z·H gives exactly X.',

  /* the two envelopes (CHSH) */
  'La sfida delle due buste': 'The two-envelope challenge',
  'Alice e Bob, lontani, senza potersi parlare': 'Alice and Bob, far apart, unable to talk to each other',
  'gioca 200 turni: quanto riesci a vincere?': 'play 200 rounds: how much can you win?',
  'gioca 200 turni e supera il 78%': 'play 200 rounds and pass 78%',
  "l'accordo si prende PRIMA di partire: dopo, Alice e Bob non comunicano più":
    'the agreement is made BEFORE leaving: afterwards, Alice and Bob no longer communicate',
  'stessa sfida, ma Alice e Bob condividono una coppia entangled':
    'same challenge, but Alice and Bob share an entangled pair',
  'domanda: :d': 'question: :d',
  'un accordo preso prima': 'an agreement made beforehand',
  'una coppia entangled': 'an entangled pair',
  'turni vinti su :n giocati': 'rounds won out of :n played',
  'muro classico 75%': 'classical wall 75%',
  'quantistico 85%': 'quantum 85%',
  'accordo di Alice e Bob (deciso prima di separarsi)': "Alice and Bob's agreement (decided before parting)",
  'rispondiamo sempre 0': 'we always answer 0',
  'rispondiamo sempre 1': 'we always answer 1',
  'rispondiamo la nostra domanda': 'we answer our own question',
  'io la domanda, lui il contrario': 'I answer my question, he answers the opposite',
  'un turno': 'one round',
  '100 turni': '100 rounds',
  '200 turni': '200 rounds',
  "<b>La regola del turno:</b> l'arbitro manda una domanda (0 o 1) a ciascuno. La coppia vince se <code>rispostaA XOR rispostaB = domandaA AND domandaB</code>.":
    '<b>The rule of a round:</b> the referee sends a question (0 or 1) to each. The pair wins if <code>answerA XOR answerB = questionA AND questionB</code>.',
  'Qualunque accordo preso prima è una tabella fissa: su quattro coppie di domande possibili, nessuna tabella ne indovina più di <b>tre</b>. Il muro è <b>75%</b>, e non lo si scavalca nemmeno tirando a sorte.':
    'Any agreement made beforehand is a fixed table: out of four possible question pairs, no table gets more than <b>three</b> right. The wall is <b>75%</b>, and tossing coins does not get you over it either.',
  'Con una coppia entangled misurata negli angoli giusti la probabilità di vincere un turno è cos²(π/8) = <b>85,4%</b>. Non è una strategia più furba: è che le risposte <b>non esistevano</b> prima della misura.':
    'With an entangled pair measured at the right angles the probability of winning a round is cos²(π/8) = <b>85.4%</b>. It is not a cleverer strategy: it is that the answers <b>did not exist</b> before the measurement.',
  "Record — con le buste: <b>:a%</b> · con l'entanglement: <b>:b%</b>":
    'Best — with envelopes: <b>:a%</b> · with entanglement: <b>:b%</b>',
  'hai misurato la differenza con le tue mani: è quella che ha vinto il Nobel nel 2022.':
    'you have measured the difference with your own hands: that is what won the Nobel Prize in 2022.',
  "<b>Perché questo conta più di «sono correlati»:</b> anche due buste sigillate sono correlate, e infatti arrivano al 75%. Il punto è il <b>sorpasso</b>: nessun accordo preso prima — nessuna informazione nascosta nelle particelle alla partenza — può superare quel muro. L'esperimento è stato fatto davvero, sempre più a prova di scappatoia, e il muro è stato superato: Aspect, Clauser e Zeilinger, Nobel 2022.":
    '<b>Why this matters more than "they are correlated":</b> two sealed envelopes are correlated too, and indeed they reach 75%. The point is the <b>overtaking</b>: no agreement made beforehand — no information hidden in the particles at departure — can pass that wall. The experiment has actually been done, in ever more loophole-free versions, and the wall was passed: Aspect, Clauser and Zeilinger, Nobel 2022.',

  /* two routes */
  'Due strade per lo stesso posto': 'Two routes to the same place',
  'apri la seconda strada e guarda il rivelatore': 'open the second route and watch the detector',
  'prova a SPEGNERE il rivelatore aprendo la seconda strada':
    'try to SWITCH OFF the detector by opening the second route',
  'spegni il rivelatore tenendo aperte tutte e due le strade':
    'switch off the detector while keeping both routes open',
  'in classico ogni strada porta una probabilità, e le probabilità si sommano':
    'classically each route carries a probability, and probabilities add up',
  "in quantistico ogni strada porta un'ampiezza, che può essere negativa":
    'quantumly each route carries an amplitude, which may be negative',
  'rivelatore': 'detector',
  'probabilità :v': 'probability :v',
  'ampiezza :v': 'amplitude :v',
  'strada chiusa': 'route closed',
  'arriva :a + :b = :tot': 'arriving :a + :b = :tot',
  '(:a :segno :b)² = :tot': '(:a :segno :b)² = :tot',
  'al rivelatore arriva il :p%': ':p% reaches the detector',
  'strada di sopra': 'upper route',
  'strada di sotto': 'lower route',
  'apri/chiudi la seconda strada': 'open/close the second route',
  'Le probabilità sono numeri fra 0 e 1 e si <b>sommano</b>. Aprire una strada in più non può far arrivare <b>meno</b> roba: al massimo la seconda strada porta zero.':
    'Probabilities are numbers between 0 and 1 and they <b>add up</b>. Opening one more route cannot make <b>less</b> arrive: at worst the second route carries zero.',
  'Prova quanto vuoi: con due strade aperte il rivelatore non si spegne mai. Non è un limite del gioco, è come funziona la probabilità.':
    'Try as long as you like: with two routes open the detector never switches off. That is not a limit of the game, it is how probability works.',
  'Le ampiezze si sommano <b>prima</b> di diventare probabilità, e possono essere <b>negative</b>. Metti la seconda strada a −:a e guarda cosa succede: (:a − :a)² = <b>0</b>.':
    'Amplitudes add up <b>before</b> becoming probabilities, and they may be <b>negative</b>. Set the second route to −:a and watch what happens: (:a − :a)² = <b>0</b>.',
  "Due strade aperte, e non arriva niente. Chiudine una — <b>una qualsiasi</b> — e il rivelatore si riaccende. È l'interferenza distruttiva, ed è il motore di ogni algoritmo di questo corso.":
    'Two routes open, and nothing arrives. Close one — <b>either one</b> — and the detector lights up again. That is destructive interference, and it is the engine of every algorithm in this course.',
  'confermato: in classico non si spegne.': 'confirmed: classically it does not switch off.',
  'spento, con tutte e due le strade aperte.': 'switched off, with both routes open.',
  "<b>Questa è la differenza, ed è una sola:</b> un computer classico che «prova tante strade» somma probabilità, e sommare roba positiva fa sempre crescere il totale. Un computer quantistico somma ampiezze, che hanno un segno — e le strade sbagliate possono cancellarsi a vicenda prima che tu guardi. Tutto il resto del corso è imparare a scegliere i segni.":
    '<b>This is the difference, and there is only one:</b> a classical computer that "tries many routes" adds probabilities, and adding positive things always grows the total. A quantum computer adds amplitudes, which have a sign — and the wrong routes can cancel each other out before you look. All the rest of this course is learning how to choose the signs.',
  /* ---------------- glossary: panel, terms in the text ---------------- */
  'Glossario': 'Glossary',
  'Glossario — si apre anche col tasto G': 'Glossary — the G key opens it too',
  'sempre qui · tasto G': 'always here · key G',
  'cerca un termine, o il numero di un livello…': 'search for a term, or a level number…',
  'Cerca nel glossario': 'Search the glossary',
  'chiudi (Esc)': 'close (Esc)',
  'chiudi': 'close',
  'evidenzia i termini nel testo': 'highlight the terms in the text',
  'mappa completa →': 'full map →',
  ':quanti termini': ':quanti terms',
  ':trovati di :totale': ':trovati of :totale',
  'Nessun termine con questa parola. Prova con una parola più corta, o chiedi al tutor 🎓.': 'No term matches that word. Try a shorter one, or ask the tutor 🎓.',
  'liv. :n': 'lv. :n',
  'cosa vuol dire — tocca per la definizione': 'what it means — tap for the definition',
  'tutto il glossario': 'the whole glossary',
  'Glossario dei termini': 'Glossary of terms',
  'tienilo aperto mentre leggi — si apre anche col tasto <b>G</b>, da qualsiasi livello. Le parole <span class="gloss-t">sottolineate così</span> nel testo danno la definizione al tocco.': 'keep it open while you read — the <b>G</b> key opens it too, from any level. Words <span class="gloss-t">underlined like this</span> in the text give you the definition at a tap.',
  'Termine': 'Term',
  'Che cosa significa (in italiano vero)': 'What it means (in plain English)',
  'Livello': 'Level',

  /* the A–Z entries: one source for the panel, the bubbles and level 23 */
  'Ampiezza': 'Amplitude',
  "Il numero (in generale una freccia complessa) associato a un possibile risultato. Il suo <b>quadrato</b> è la probabilità. Può essere negativa: da qui l'interferenza.":
    'The number (in general a complex arrow) associated with a possible result. Its <b>square</b> is the probability. It can be negative: hence interference.',
  "Ampiezza (di un'onda)": 'Amplitude (of a wave)',
  "Quanto è alta un'onda; nel suono è il volume.":
    'How tall a wave is; in sound it is the volume.',
  'Autostato / autovalore': 'Eigenstate / eigenvalue',
  'Base di misura': 'Measurement basis',
  'La "direzione" lungo cui si misura. Misurare in base Z dà 0/1; in base X dà +/−. Non esiste uno stato certo in tutte le basi.':
    'The "direction" along which you measure. Measuring in the Z basis gives 0/1; in the X basis it gives +/−. There is no state that is certain in every basis.',
  'Bloch (sfera di)': 'Bloch (sphere)',
  'Mappa di tutti gli stati di un qubit: nord |0⟩, sud |1⟩, equatore le sovrapposizioni al 50%.':
    'A map of all the states of a qubit: north |0⟩, south |1⟩, equator the 50% superpositions.',
  'Born (regola di)': 'Born (rule)',
  'Probabilità = |ampiezza|². Il ponte fra matematica e laboratorio.':
    'Probability = |amplitude|². The bridge between mathematics and the laboratory.',
  'Bra-ket': 'Bra-ket',
  'Notazione |ψ⟩ per gli stati (ket) e ⟨ψ| per i "duali" (bra). È solo una scatola per dire "questo è uno stato".':
    'The notation |ψ⟩ for states (ket) and ⟨ψ| for the "duals" (bra). It is only a box for saying "this is a state".',
  'CNOT': 'CNOT',
  'Porta a due qubit: ribalta il bersaglio solo se il controllo vale 1. Su una sovrapposizione crea entanglement.':
    'A two-qubit gate: it flips the target only if the control is 1. On a superposition it creates entanglement.',
  'Decoerenza': 'Decoherence',
  "L'ambiente \"misura\" involontariamente il sistema e distrugge le fasi. Il nemico numero uno dell'hardware.":
    'The environment involuntarily "measures" the system and destroys the phases. Enemy number one of the hardware.',
  'Dense coding': 'Dense coding',
  'Mandare 2 bit classici trasmettendo 1 qubit, sfruttando entanglement già condiviso.':
    'Sending 2 classical bits by transmitting 1 qubit, exploiting already-shared entanglement.',
  'DFT': 'DFT',
  'Trasformata di Fourier discreta: "ruota ogni dato e somma" per scoprire le periodicità.':
    'Discrete Fourier transform: "rotate every datum and add up" to discover the periodicities.',
  'Diffusore': 'Diffuser',
  'In Grover: riflette le ampiezze attorno alla media, amplificando quella marcata.':
    'In Grover: reflects the amplitudes about the average, amplifying the marked one.',
  'Entanglement': 'Entanglement',
  "Stato di più qubit che non si può descrivere qubit per qubit: l'informazione sta nella relazione.":
    'A state of several qubits that cannot be described qubit by qubit: the information is in the relationship.',
  'Fase': 'Phase',
  "\"A che punto del giro sei\". Non cambia le probabilità, ma decide cosa si cancellerà. L'ingrediente segreto di tutto.":
    '"Where in the turn you are". It does not change the probabilities, but it decides what will cancel out. The secret ingredient of everything.',
  'FFT': 'FFT',
  'Algoritmo classico che calcola la DFT in N·log N invece di N² (dividi et impera).':
    'The classical algorithm that computes the DFT in N·log N instead of N² (divide and conquer).',
  'Frequenza': 'Frequency',
  'Quanti cicli al secondo (Hz). Inversa del periodo: f = 1/T.':
    'How many cycles per second (Hz). The inverse of the period: f = 1/T.',
  'Grover': 'Grover',
  'Ricerca in √N tentativi invece di N/2. Guadagno quadratico, valido per qualunque ricerca senza struttura.':
    'Search in √N attempts instead of N/2. A quadratic gain, valid for any search without structure.',
  'Hadamard (H)': 'Hadamard (H)',
  'La porta più importante: crea e disfa le sovrapposizioni. È lei che trasforma le fasi in probabilità osservabili.':
    'The most important gate: it creates and undoes superpositions. It is what turns phases into observable probabilities.',
  'Interferenza': 'Interference',
  'Le ampiezze si sommano prima del quadrato: quelle concordi si rinforzano, quelle opposte si annullano.':
    'The amplitudes add up before squaring: those in agreement reinforce each other, opposite ones cancel out.',
  'Misura': 'Measurement',
  'Operazione irreversibile: sceglie un risultato a caso secondo |ampiezza|² e riscrive lo stato.':
    'An irreversible operation: it picks a result at random according to |amplitude|² and rewrites the state.',
  'No-cloning': 'No-cloning',
  'Non esiste una macchina che copia uno stato quantistico sconosciuto.':
    'There is no machine that copies an unknown quantum state.',
  'Numero complesso': 'Complex number',
  "Una freccia: lunghezza + angolo. e^{iθ} è la freccia lunga 1 all'angolo θ.":
    'An arrow: length + angle. e^{iθ} is the arrow of length 1 at angle θ.',
  'Oracolo': 'Oracle',
  "Scatola nera che marca con un segno meno gli stati che soddisfano una condizione: scrive l'informazione nelle fasi.":
    'A black box that marks with a minus sign the states satisfying a condition: it writes the information into the phases.',
  'Periodo': 'Period',
  "Ogni quanto una cosa si ripete. Per un'onda T = 1/f; per la sequenza a^x mod N è dopo quanti passi si ritorna sull'1, ed è il numero che Shor va a cercare.":
    'How often something repeats. For a wave T = 1/f; for the sequence a^x mod N it is how many steps it takes to get back to 1, and it is the number Shor goes looking for.',
  'Phase kickback': 'Phase kickback',
  'Il trucco per cui la fase generata da un oracolo "rimbalza" sul registro di controllo.':
    'The trick by which the phase generated by an oracle "kicks back" onto the control register.',
  'Porta (gate)': 'Gate',
  'Operazione reversibile (unitaria) su uno o più qubit: sulla sfera è sempre una rotazione.':
    'A reversible (unitary) operation on one or more qubits: on the sphere it is always a rotation.',
  'Post-quantistica (crittografia)': 'Post-quantum (cryptography)',
  'Algoritmi classici resistenti a Shor e Grover; standardizzati dal NIST nel 2024.':
    'Classical algorithms resistant to Shor and Grover; standardised by NIST in 2024.',
  'QFT': 'QFT',
  'Trasformata di Fourier sulle ampiezze: n²/2 porte, trasforma periodicità in picchi.':
    'Fourier transform on the amplitudes: n²/2 gates, turns periodicity into peaks.',
  'QPE': 'QPE',
  'Stima di fase: copia una fase nei qubit di lettura e la rende misurabile con la QFT inversa.':
    'Phase estimation: copies a phase into the reading qubits and makes it measurable with the inverse QFT.',
  'Qubit': 'Qubit',
  'Unità elementare: due ampiezze, una per |0⟩ e una per |1⟩.':
    'The elementary unit: two amplitudes, one for |0⟩ and one for |1⟩.',
  'Shor': 'Shor',
  'Fattorizzazione in tempo polinomiale, riducendo il problema alla ricerca di un periodo.':
    'Factorisation in polynomial time, by reducing the problem to the search for a period.',
  'Sindrome (misura di)': 'Syndrome (measurement)',
  "Misura che rivela <b>dove</b> è avvenuto un errore senza rivelare l'informazione codificata.":
    'A measurement that reveals <b>where</b> an error happened without revealing the encoded information.',
  'Sovrapposizione': 'Superposition',
  'Stato in cui più risultati hanno ampiezza diversa da zero contemporaneamente.':
    'A state in which several results have non-zero amplitude at the same time.',
  'SWAP': 'SWAP',
  'Porta che scambia due qubit; chiude il circuito della QFT.':
    'A gate that swaps two qubits; it closes the QFT circuit.',
  'Teletrasporto': 'Teleportation',
  "Trasferire uno stato usando entanglement + 2 bit classici. L'originale viene distrutto.":
    'Transferring a state using entanglement + 2 classical bits. The original is destroyed.',
  'Unitaria (operazione)': 'Unitary (operation)',
  'Conserva la probabilità totale ed è reversibile: tutte le porte lo sono, la misura no.':
    'It preserves the total probability and is reversible: all gates are, measurement is not.',

  /* other written forms of each term, used only to spot it in the text */
  'ampiezze': 'amplitudes',
  'basi di misura, base Z, base X': 'measurement bases, Z basis, X basis',
  'sfera di Bloch': 'Bloch sphere',
  'regola di Born': "Born rule, Born's rule",
  'bra, ket': 'bra, ket',
  'decoerente': 'decoherent',
  'codifica densa': 'superdense coding',
  'trasformata di Fourier discreta': 'discrete Fourier transform',
  'entangled, entangolati': 'entangled',
  'fasi': 'phases',
  'frequenze': 'frequencies',
  'Hadamard, porta H': 'Hadamard, H gate',
  'interferenze, interferire, interferiscono': 'interfere, interferes, interfering',
  'misure, misurare, misurazione': 'measure, measures, measuring',
  'teorema di no-cloning': 'no-cloning theorem',
  'numeri complessi': 'complex numbers',
  'oracoli': 'oracles',
  'periodi, periodicità': 'periods, periodicity',
  'kickback': 'kickback',
  'porte, porta quantistica, gate': 'gates, quantum gate',
  'crittografia post-quantistica': 'post-quantum cryptography',
  'trasformata di Fourier quantistica': 'quantum Fourier transform',
  'stima di fase': 'phase estimation',
  'algoritmo di Shor': "Shor algorithm, Shor's algorithm",
  'misura di sindrome': 'syndrome, syndrome measurement',
  'sovrapposizioni': 'superpositions',
  'teletrasportare': 'teleport, teleporting',
  'unitaria, unitarie, operazione unitaria': 'unitary, unitary operation',
  /* ---------------- livello 0·5: l'orologio dei numeri ---------------- */
  ":giri giri + :resto":
    ":giri laps + :resto",
  "<b>:numero</b> diviso :ore fa :giri con il resto di <b>:resto</b>.":
    "<b>:numero</b> divided by :ore is :giri, remainder <b>:resto</b>.",
  "<b>Da portarsi dietro:</b> «mod» non è un'operazione strana, è <b>il resto della divisione</b>. E i numeri che finiscono nella stessa ora — 3, 10, 17, 24 con un quadrante da 7 — per l'orologio sono <b>la stessa cosa</b>. Nel livello di Shor l'orologio avrà N ore, con N il numero da fattorizzare.":
    "<b>Worth taking with you:</b> «mod» is not some strange operation, it is <b>the remainder of the division</b>. And numbers that land on the same hour — 3, 10, 17, 24 on a 7-hour dial — are <b>the same thing</b> as far as the clock is concerned. In the Shor level the dial will have N hours, with N the number to be factored.",
  "<b>Perché ci servirà:</b> è l'algoritmo di Euclide, di circa 2300 anni fa, e in Shor è <b>l'ultimo passo</b>: trovato il periodo, i fattori del numero saltano fuori con due massimi comuni divisori. Su numeri da centinaia di cifre ci mette meno di un battito di ciglia — il collo di bottiglia è tutto altrove.":
    "<b>Why we will need it:</b> this is Euclid's algorithm, some 2300 years old, and in Shor it is <b>the last step</b>: once the period is known, the factors of the number fall out of two greatest common divisors. On numbers with hundreds of digits it takes less than the blink of an eye — the bottleneck is entirely elsewhere.",
  "<b>Qui c'è tutto Shor:</b> fattorizzare un numero N si riduce a trovare questo ritmo r. Su un quadrante da 15 lo si vede a occhio; su un N da 600 cifre nemmeno tutti i computer del mondo messi insieme ci arrivano, perché i passi da provare sono troppi. Il computer quantistico non prova i passi uno per uno: li fa <b>tutti insieme</b> e poi usa la trasformata di Fourier per far emergere il ritmo. È il livello :n.":
    "<b>All of Shor is in here:</b> factoring a number N boils down to finding this rhythm r. On a 15-hour dial you can see it by eye; on an N with 600 digits not even every computer in the world put together gets there, because there are too many steps to try. A quantum computer does not try the steps one by one: it does them <b>all at once</b> and then uses the Fourier transform to make the rhythm surface. That is level :n.",
  "Avanza sempre un rettangolo più piccolo: è per questo che il metodo finisce presto. Continua.":
    "A smaller rectangle is always left over: that is why the method finishes quickly. Carry on.",
  "Contare a giri, il pavimento di Euclide e il ritmo di a^x mod N: la matematica classica che sta dentro Shor.":
    "Counting in laps, Euclid's floor and the rhythm of a^x mod N: the classical maths that sits inside Shor.",
  "Esatto: r = :r. Prova ora un'altra coppia (N, a): il ritmo cambia.":
    "Correct: r = :r. Now try another (N, a) pair: the rhythm changes.",
  "Il bersaglio è <b>:ora</b>: cerca un numero che finisca lì. Ce ne sono infiniti, distanti :ore l'uno dall'altro.":
    "The target is <b>:ora</b>: look for a number that lands there. There are infinitely many, exactly :ore apart.",
  "Il moltiplicatore (a)":
    "The multiplier (a)",
  "Il numero da contare":
    "The number to count",
  "Il pavimento di Euclide":
    "Euclid's floor",
  "Il quadrante (N)":
    "The dial (N)",
  "Il ritmo che torna":
    "The rhythm that comes back",
  "L'orologio dei numeri":
    "The clock of numbers",
  "L'orologio dei numeri: resto, MCD e ritmi che tornano":
    "The clock of numbers: remainder, GCD and rhythms that come back",
  "L'ultimo quadrato ha lato <b>:mcd</b>: è il righello più grande che misura per intero sia :a sia :b. Si chiama <b>massimo comune divisore</b>.":
    "The last square has side <b>:mcd</b>: the longest ruler that measures both :a and :b a whole number of times. It is called the <b>greatest common divisor</b>.",
  "No: conta i passi disegnati, l'1 di partenza non si conta.":
    "No: count the steps drawn — the 1 you started from does not count.",
  "Ogni passo è «moltiplica per :a e prendi il resto della divisione per :N». Continua finché non ricompare l'1.":
    "Every step is «multiply by :a and take the remainder of the division by :N». Carry on until the 1 shows up again.",
  "Pavimento <b>:a × :b</b>. Quadrati posati finora (lato): :lati":
    "Floor <b>:a × :b</b>. Squares laid so far (side): :lati",
  "Quadrante <b>:N</b>, moltiplicatore <b>:a</b>. Passeggiata: :seq":
    "Dial <b>:N</b>, multiplier <b>:a</b>. Walk: :seq",
  "Quante ore ha il quadrante":
    "How many hours the dial has",
  "Sei tornato sull'1 dopo <b>:quanti</b> passi. Quel numero si chiama <b>periodo</b> e si scrive r.":
    "You are back on 1 after <b>:quanti</b> steps. That number is called the <b>period</b>, and is written r.",
  "altra coppia":
    "another pair",
  "cambia bersaglio":
    "change target",
  "conta oltre la fine del quadrante e guarda dove ti fermi":
    "count past the end of the dial and see where you stop",
  "sempre il più grande che ci sta — risolti: :fatte su :totali":
    "always the largest one that fits — solved: :fatte of :totali",
  "copri :a × :b con quadrati":
    "cover :a × :b with squares",
  "porta la lancetta sul :ora":
    "stop the hand on :ora",
  "fino in fondo":
    "all the way",
  "il periodo è :n":
    "the period is :n",
  "moltiplica":
    "multiply",
  "moltiplica sempre per lo stesso numero: quando ripassi dall'1?":
    "always multiply by the same number: when do you pass through 1 again?",
  "passi fatti: :quanti":
    "steps taken: :quanti",
  "piastrelle quadrate, tutte uguali alla fine: quanto misura il lato?":
    "square tiles, all identical: how long is the side?",
  "premi «taglia» e guarda cosa avanza":
    "press «cut» and watch what is left over",
  "torna sull'1 premendo ×:a":
    "get back to 1 by pressing ×:a",
  "ritmi trovati: :fatti su :totali":
    "rhythms found: :fatti of :totali",
  "sul bersaglio! Numeri diversi trovati: :fatti su :totali":
    "on target! Different numbers found: :fatti of :totali",
  "taglia un quadrato":
    "cut one square",
  "servono :totali numeri diversi — trovati: :fatti":
    "you need :totali different numbers — found: :fatti",
  "ultimo quadrato: lato :lato = MCD(:a, :b)":
    "last square: side :lato = GCD(:a, :b)",
  /* ---------------- glossario: modulo, MCD, frazioni continue ---------------- */
  "Frazioni continue":
    "Continued fractions",
  "Il modo di trovare la frazione più semplice vicinissima a un numero decimale. In Shor traducono il numero misurato nel periodo cercato: il denominatore è la risposta.":
    "The way to find the simplest fraction very close to a decimal number. In Shor they turn the measured number into the period being hunted: the denominator is the answer.",
  "Il numero più grande che divide due numeri senza lasciare resto. Si trova con l'algoritmo di Euclide, ed è l'ultimo passo — tutto classico — dell'algoritmo di Shor.":
    "The largest number that divides two numbers leaving no remainder. It is found with Euclid's algorithm, and it is the last step — entirely classical — of Shor's algorithm.",
  "Il resto della divisione: 17 mod 5 = 2. Contare «mod N» vuol dire contare a giri su un quadrante da N ore, come sull'orologio.":
    "The remainder of a division: 17 mod 5 = 2. Counting «mod N» means counting in laps on a dial with N hours, like a clock.",
  "MCD (massimo comune divisore)":
    "GCD (greatest common divisor)",
  "Modulo (mod)":
    "Modulo (mod)",
  "aritmetica modulare, mod":
    "modular arithmetic, mod",
  "frazione continua":
    "continued fraction",
  "massimo comune divisore, massimi comuni divisori":
    "greatest common divisor, greatest common divisors",
  /* ---------------- livello 0·6: le matrici ---------------- */
  "<b>La regola sta tutta qui:</b> le due colonne della matrice sono i due posti dove finiscono le frecce di base. Sapendo quelli, sai dove finisce <b>qualunque</b> altra freccia — perché ogni freccia è una somma delle due di base. Non c'è altro da sapere su cosa fa una matrice.":
    "<b>The whole rule is here:</b> the two columns of the matrix are the two places where the basis arrows land. Knowing those, you know where <b>any</b> other arrow lands — because every arrow is a sum of the two basis ones. There is nothing else to know about what a matrix does.",
  "<b>Perché la freccia resta sul cerchio:</b> X, Z e H sono matrici <b>unitarie</b>, cioè macchine che non allungano e non accorciano niente. Siccome la probabilità è il quadrato dell'ampiezza, una freccia sempre lunga 1 vuol dire probabilità che fanno sempre 100%. È la ragione per cui non esiste una porta quantistica che «perde» un pezzo di stato — e la ritroverai al livello :n.":
    "<b>Why the arrow stays on the circle:</b> X, Z and H are <b>unitary</b> matrices, machines that neither stretch nor shrink anything. Since probability is the square of the amplitude, an arrow that is always 1 long means probabilities that always add to 100%. That is why no quantum gate can «lose» a piece of the state — and you will meet it again at level :n.",
  "E hai appena dimostrato che <b>:mosse fanno la stessa cosa della X</b>: più macchine di fila sono una macchina sola.":
    "And you have just shown that <b>:mosse do the same as X</b>: several machines in a row are a single machine.",
  "Il puzzle delle porte":
    "The gate puzzle",
  "La freccia rossa (1, 0) finisce in (<b>:x</b>, <b>:y</b>) — che è la <b>prima colonna</b>.":
    "The red arrow (1, 0) lands at (<b>:x</b>, <b>:y</b>) — which is the <b>first column</b>.",
  "La freccia verde (0, 1) finisce in (<b>:x</b>, <b>:y</b>) — che è la <b>seconda colonna</b>.":
    "The green arrow (0, 1) lands at (<b>:x</b>, <b>:y</b>) — which is the <b>second column</b>.",
  "La macchina a quattro manopole":
    "The four-knob machine",
  "La macchina che trasforma le frecce: le matrici":
    "The machine that transforms arrows: matrices",
  "La macchina, scritta come tabella:":
    "The machine, written as a table:",
  "Obiettivo: :puzzle. Prova una porta e guarda dove va la freccia — la lunghezza non cambia mai.":
    "Goal: :puzzle. Try a gate and watch where the arrow goes — the length never changes.",
  "Obiettivo: :sfida. Le frecce tratteggiate dicono dove devono arrivare.":
    "Goal: :sfida. The dashed arrows show where they have to land.",
  "Quattro manopole, due frecce e la scoperta che ogni porta quantistica è una tabella di numeri.":
    "Four knobs, two arrows and the discovery that every quantum gate is a table of numbers.",
  "Questa macchina allunga o accorcia le frecce: nel quantistico non sarebbe una porta valida.":
    "This machine stretches or shrinks the arrows: in the quantum world it would not be a valid gate.",
  "Questa macchina non cambia le lunghezze: nel quantistico sarebbe una porta valida.":
    "This machine does not change lengths: in the quantum world it would be a valid gate.",
  "Stato: (<b>:zero</b> · <b>:uno</b>). Lunghezza della freccia: <b>:lung</b>.":
    "State: (<b>:zero</b> · <b>:uno</b>). Arrow length: <b>:lung</b>.",
  "altra sfida":
    "another challenge",
  "altro puzzle":
    "another puzzle",
  "ampiezza di |0⟩":
    "amplitude of |0⟩",
  "ampiezza di |1⟩":
    "amplitude of |1⟩",
  "arriva alla sovrapposizione (0,71 · 0,71)":
    "reach the superposition (0.71 · 0.71)",
  "arriva alla sovrapposizione con il meno (0,71 · −0,71)":
    "reach the superposition with the minus (0.71 · −0.71)",
  "bersaglio centrato in :n mosse: :mosse":
    "target hit in :n moves: :mosse",
  "gira le manopole e guarda dove finiscono le due frecce":
    "turn the knobs and watch where the two arrows land",
  "gira tutto di 90° in senso antiorario":
    "turn everything 90° anticlockwise",
  "identità":
    "identity",
  "lascia ferma la rossa e ribalta la verde":
    "leave the red one alone and flip the green one",
  "mosse: :mosse":
    "moves: :mosse",
  "porta lo stato da |0⟩ a |1⟩":
    "take the state from |0⟩ to |1⟩",
  "probabilità: :zero% e :uno%":
    "probabilities: :zero% and :uno%",
  "puzzle risolti: :fatti su :totali":
    "puzzles solved: :fatti of :totali",
  "raddoppia la lunghezza di tutte e due":
    "double the length of both",
  "ribalta (Z)":
    "flip (Z)",
  "rossa: dove finisce (1, 0)":
    "red: where (1, 0) lands",
  "scambia (X)":
    "swap (X)",
  "scambia le due frecce":
    "swap the two arrows",
  "sfida risolta! Premi «altra sfida» per la prossima.":
    "challenge solved! Press «another challenge» for the next one.",
  "sfide risolte: :fatte su :totali":
    "challenges solved: :fatte of :totali",
  "somma: :tot% — sempre":
    "total: :tot% — always",
  "tre matrici, un bersaglio: quale sequenza ci arriva?":
    "three matrices, one target: which sequence gets there?",
  "verde: dove finisce (0, 1)":
    "green: where (0, 1) lands",
  /* ---------------- glossario: matrice ---------------- */
  "Matrice":
    "Matrix",
  "Una tabella di numeri che trasforma una freccia in un'altra. Le sue colonne dicono dove finiscono le frecce di base: da lì si ricava dove finisce qualunque altra freccia.":
    "A table of numbers that turns one arrow into another. Its columns say where the basis arrows land: from those you can work out where any other arrow lands.",
  "matrici, matrice 2×2":
    "matrices, 2×2 matrix",
  /* ---------------- livello 18·b: autovettori e autovalori ---------------- */
  "<b>I nomi:</b> una freccia che la macchina lascia in linea con sé stessa si chiama <b>autovettore</b>; il numero per cui viene moltiplicata si chiama <b>autovalore</b>. Sono le due parole che aprono il livello :n — e la rotazione, che di autovettori reali non ne ha nessuno, spiega da sola perché nel quantistico gli autovalori sono <b>fasi</b> e non allungamenti.":
    "<b>The names:</b> an arrow the machine leaves in line with itself is called an <b>eigenvector</b>; the number it gets multiplied by is called the <b>eigenvalue</b>. They are the two words level :n opens with — and the rotation, which has no real eigenvectors at all, explains on its own why in the quantum world eigenvalues are <b>phases</b> and not stretches.",
  "<b>Questa è la stima di fase, fatta a mano.</b> Tu hai contato le applicazioni una per una: sono tante quante il denominatore della frazione di giro. Il livello :n fa la stessa identica cosa <b>in sovrapposizione</b> — applica U una volta, due, quattro, otto in parallelo, e poi con la trasformata di Fourier legge la fase da un picco solo. E se il conteggio ti ricorda il ritmo che tornava sull'orologio del livello :m, hai visto giusto: è la stessa matematica.":
    "<b>This is phase estimation, done by hand.</b> You counted the applications one at a time: there are as many as the denominator of the fraction of a turn. Level :n does exactly the same thing <b>in superposition</b> — it applies U once, twice, four times, eight times in parallel, and then reads the phase off a single peak with the Fourier transform. And if the counting reminds you of the rhythm that came back on the clock in level :m, you saw right: it is the same mathematics.",
  "Esatto: :n applicazioni per un giro intero, cioè :g° l'una. Prova un'altra porta.":
    "Correct: :n applications for a full turn, that is :g° each. Try another gate.",
  "Fuori linea: la freccia in uscita punta da un'altra parte. Continua a girare.":
    "Out of line: the outgoing arrow points somewhere else. Keep turning.",
  "IN LINEA! ×:lambda":
    "IN LINE! ×:lambda",
  "In linea! La macchina non ha girato questa freccia: l'ha solo moltiplicata per <b>:lambda</b>. È un <b>autovettore</b>, e :lambda è il suo <b>autovalore</b>.":
    "In line! The machine did not turn this arrow: it only multiplied it by <b>:lambda</b>. It is an <b>eigenvector</b>, and :lambda is its <b>eigenvalue</b>.",
  "La caccia alle frecce che non girano":
    "The hunt for arrows that do not turn",
  "La fase che si conta":
    "The phase you count",
  "La macchina da esaminare":
    "The machine to examine",
  "La porta U (di quanto gira la fase)":
    "The gate U (how far it turns the phase)",
  "La probabilità di leggere il risultato non è cambiata di un capello: la fase da sola non si vede. Si vede solo <b>facendola interferire</b> — ed è quello che fa la QFT.":
    "The probability of reading the result has not changed one bit: a phase on its own cannot be seen. It only shows up <b>by making it interfere</b> — and that is what the QFT does.",
  "Le frecce che la macchina non gira: autovettori e autovalori":
    "The arrows the machine does not turn: eigenvectors and eigenvalues",
  "Macchina: <b>:nome</b>. La tua freccia punta a :gradi°.":
    "Machine: <b>:nome</b>. Your arrow points at :gradi°.",
  "No: conta le applicazioni che hai fatto per tornare a casa.":
    "No: count the applications it took you to get home.",
  "Ogni applicazione di U gira la fase di <b>:g°</b>. Applicazioni fatte: <b>:n</b>, fase totale <b>:tot°</b>.":
    "Every application of U turns the phase by <b>:g°</b>. Applications so far: <b>:n</b>, total phase <b>:tot°</b>.",
  "Questa macchina ha :quante direzioni ferme.":
    "This machine has :quante still directions.",
  "Questa macchina non ha nessuna direzione ferma: gira tutto. Con i soli numeri reali, qui non c'è niente da trovare.":
    "This machine has no still direction at all: it turns everything. With real numbers alone there is nothing to find here.",
  "Sei tornato a casa dopo <b>:n</b> applicazioni. Quindi ogni applicazione valeva <b>1/:n di giro</b>: hai misurato la fase contando.":
    "You are home after <b>:n</b> applications. So each one was worth <b>1/:n of a turn</b>: you measured the phase by counting.",
  "Trascina finché la freccia non resta in linea con sé stessa. E scopri che su quelle frecce una porta cambia solo la fase.":
    "Drag until the arrow stays in line with itself. And discover that on those arrows a gate changes only the phase.",
  "applica U":
    "apply U",
  "riporta la freccia a casa":
    "bring the arrow home",
  "applicazioni: :n":
    "applications: :n",
  "cambia solo la fase":
    "only the phase changes",
  "casa":
    "home",
  ":macchina — trovate :fatte su :totali":
    ":macchina — found :fatte of :totali",
  "fase totale: :g°":
    "total phase: :g°",
  "fasi misurate: :fatte su :totali":
    "phases measured: :fatte of :totali",
  "la porta H":
    "the H gate",
  "la porta non muove lo stato: gli gira solo la freccia della fase":
    "the gate does not move the state: it only turns the phase arrow",
  "la rotazione di 90°: nessuna freccia resta in linea":
    "the 90° rotation: no arrow stays in line",
  "la tua freccia":
    "your arrow",
  "lo scivolo: una sola direzione ferma":
    "the shear: a single still direction",
  "lo specchio: Z":
    "the mirror: Z",
  "lo stato non cambia:":
    "the state does not change:",
  "porta H":
    "H gate",
  "probabilità: 100%":
    "probability: 100%",
  "quella che esce dalla macchina":
    "the one that comes out of the machine",
  "rotazione 90°":
    "90° rotation",
  "ruota di poco":
    "turn a little",
  "ruota indietro":
    "turn back",
  "scivolo":
    "shear",
  "specchio Z":
    "mirror Z",
  "stira":
    "stretch",
  "stira in orizzontale, schiaccia in verticale":
    "stretches horizontally, squashes vertically",
  "trascina la freccia: per quasi tutte la macchina cambia direzione. Per qualcuna no.":
    "drag the arrow: for almost every one the machine changes the direction. For a few it does not.",
  "un giro = :n applicazioni":
    "one turn = :n applications",
  /* ---------------- glossario: autostato ampliato ---------------- */
  "Stato (o freccia) che un'operazione lascia in linea con sé stesso: cambia solo per un fattore, l'autovalore. Su una porta quantistica quel fattore è una fase, ed è il numero che la stima di fase va a leggere.":
    "A state (or arrow) that an operation leaves in line with itself: it changes only by a factor, the eigenvalue. On a quantum gate that factor is a phase, and it is the number phase estimation goes to read.",
  "autostati, autovalore, autovalori, autovettore, autovettori":
    "eigenstates, eigenvalue, eigenvalues, eigenvector, eigenvectors",
  "trova una direzione ferma":
    "find a still direction",
  /* ---------------- livello 15·b: la serie geometrica ---------------- */
  "<b>Il fatto sorprendente:</b> infiniti pezzi, totale finito. Mezzo più un quarto più un ottavo… non arriva mai a 2, ci si avvicina e basta. La formula che lo dice — <b>(1 − rⁿ)/(1 − r)</b> — è la stessa che fra un attimo farà nascere il picco della trasformata di Fourier: cambia solo che al posto di una frazione ci sarà una <b>rotazione</b>.":
    "<b>The surprising part:</b> infinitely many pieces, a finite total. A half plus a quarter plus an eighth… never reaches 2, it only gets closer. The formula that says so — <b>(1 − rⁿ)/(1 − r)</b> — is the same one that in a moment will make the Fourier peak appear: the only change is that instead of a fraction there will be a <b>rotation</b>.",
  "<b>Questa è la trasformata di Fourier, in una frase.</b> Per ogni frequenza di prova, la DFT gira i dati di un passo fisso e li somma: se il passo è sbagliato, la catena si chiude e viene zero; se è quello giusto, il passo è nullo, le frecce si allineano e nasce il <b>picco</b>. Il livello :n lo fa sui dati veri — ma il motivo per cui funziona è quello che hai appena mosso con il cursore.":
    "<b>This is the Fourier transform, in one sentence.</b> For every test frequency the DFT turns the data by a fixed step and adds it up: if the step is wrong the chain closes and the result is zero; if it is right the step is null, the arrows line up and the <b>peak</b> appears. Level :n does it on real data — but the reason it works is what you have just been moving with the slider.",
  "Con la formula: (1 − :r^:n) / (1 − :r) = <b>:formula</b> — stesso numero, senza sommare a mano.":
    "With the formula: (1 − :r^:n) / (1 − :r) = <b>:formula</b> — same number, without adding by hand.",
  "Con la formula: |sin(:n·Δ/2) / sin(Δ/2)| = <b>:formula</b>.":
    "With the formula: |sin(:n·Δ/2) / sin(Δ/2)| = <b>:formula</b>.",
  "Di quanto gira ogni freccia in più (gradi)":
    "How much further each arrow turns (degrees)",
  "I pezzi che si rimpiccioliscono":
    "The pieces that keep shrinking",
  "La catena di frecce":
    "The chain of arrows",
  "La catena si è chiusa: le frecce fanno un giro esatto e si annullano a vicenda. Somma zero — non \"piccola\": zero.":
    "The chain has closed: the arrows make one exact turn and cancel each other out. Sum zero — not \"small\": zero.",
  "La serie geometrica giocata con i pezzi e con le frecce. È la ragione per cui la trasformata di Fourier fa un picco.":
    "The geometric series played with pieces and with arrows. It is the reason the Fourier transform makes a peak.",
  "Le frecce puntano un po' ovunque: la somma è un numero qualunque, né grande né nullo.":
    "The arrows point more or less everywhere: the sum is just some number, neither large nor null.",
  "Ogni pezzo è questa frazione del precedente":
    "Each piece is this fraction of the previous one",
  "Passo <b>:passo°</b>, <b>:n</b> frecce. Lunghezza della somma: <b>:mod</b> (su :n possibili).":
    "Step <b>:passo°</b>, <b>:n</b> arrows. Length of the sum: <b>:mod</b> (out of :n possible).",
  "Passo nullo (o un giro intero): tutte le frecce puntano nello stesso verso e si sommano tutte. È il picco.":
    "Null step (or a whole turn): every arrow points the same way and they all add up. That is the peak.",
  "Quanti pezzi":
    "How many pieces",
  "Se i pezzi non finissero mai: <b>:limite</b>. Il totale non supera mai quel muro, per quanti pezzi aggiungi.":
    "If the pieces never ended: <b>:limite</b>. The total never passes that wall, however many pieces you add.",
  "Somma dei primi :n pezzi: <b>:tot</b>.":
    "Sum of the first :n pieces: <b>:tot</b>.",
  "Tante cose sommate: quando si accumulano e quando si annullano":
    "Many things added up: when they pile up and when they cancel",
  "altro bersaglio":
    "another target",
  "bersaglio centrato!":
    "target hit!",
  "cambia obiettivo":
    "change goal",
  "fai la somma più grande possibile":
    "make the sum as large as possible",
  "fai sparire la somma":
    "make the sum vanish",
  "il muro: :limite":
    "the wall: :limite",
  "lunghezza della somma: :mod su :n":
    "length of the sum: :mod out of :n",
    "metà ogni volta":
    "half every time",
  "obiettivi centrati: :fatti su :totali":
    "goals hit: :fatti of :totali",
  "ogni pezzo è una frazione del precedente: dove si ferma il totale?":
    "each piece is a fraction of the previous one: where does the total stop?",
  "porta il totale a :bersaglio":
    "bring the total to :bersaglio",
  "stessa somma, ma ogni pezzo è girato di un passo fisso":
    "same sum, but each piece is turned by a fixed step",
  "totale: :tot":
    "total: :tot",
  "totali centrati: :fatti su :totali":
    "totals hit: :fatti of :totali",
  "un giro diviso il numero di frecce":
    "one turn divided by the number of arrows",
  /* ---------------- livello 21·b: pendenza e algoritmi variazionali ---------------- */
  ":curva — valli trovate: :fatte su :totali":
    ":curva — valleys found: :fatte of :totali",
  ":problema — minimi raggiunti: :fatti su :totali":
    ":problema — minima reached: :fatti of :totali",
  "<b>Il nome:</b> questa pendenza si chiama <b>derivata</b>. Serve a una cosa sola, ma fondamentale: se vuoi far scendere un numero, la derivata ti dice da che parte muoverti e quando fermarti. È il motore di tutto l'apprendimento automatico — e, come vedrai fra un attimo, anche del quantistico che gira oggi sulle macchine vere.":
    "<b>The name:</b> this slope is called the <b>derivative</b>. It is good for one thing, but a crucial one: if you want to bring a number down, the derivative tells you which way to move and when to stop. It is the engine of all machine learning — and, as you are about to see, of the quantum computing that runs today on real machines.",
  "<b>Questo è il quantistico che gira oggi.</b> Nessuna macchina al mondo esegue ancora Shor su numeri veri, ma i metodi variazionali girano da anni su processori rumorosi: il quantistico prepara lo stato e misura, il classico gira le manopole. Il rumore lo hai visto: con pochi tiri la pendenza balla. E la parte che il classico non sa fare è proprio quella misura — lo stesso mestiere della stima di fase del livello :n, ma con un obiettivo diverso: non leggere un numero nascosto, bensì <b>abbassarne</b> uno.":
    "<b>This is the quantum computing that runs today.</b> No machine in the world runs Shor on real numbers yet, but variational methods have been running for years on noisy processors: the quantum side prepares the state and measures, the classical side turns the knobs. You have seen the noise: with few shots the slope jumps about. And the part the classical side cannot do is precisely that measurement — the same trade as phase estimation in level :n, with a different goal: not reading a hidden number, but <b>bringing one down</b>.",
  "Curva: <b>:curva</b>. Sei in x = <b>:x</b>, l'altezza è <b>:y</b>.":
    "Curve: <b>:curva</b>. You are at x = <b>:x</b>, the height is <b>:y</b>.",
  "Dove sei sulla curva":
    "Where you are on the curve",
  "H = Z + 0,5·X":
    "H = Z + 0.5·X",
  "H = −0,4·Z + X":
    "H = −0.4·Z + X",
  "Il problema da risolvere":
    "The problem to solve",
  "Il segno dice il verso: pendenza positiva → si scende andando a sinistra; negativa → a destra.":
    "The sign gives the direction: positive slope → down is to the left; negative → to the right.",
  "La curva":
    "The curve",
  "La derivata giocata come pendenza, e la discesa che i computer quantistici veri fanno adesso, rumore compreso.":
    "The derivative played as a slope, and the descent that real quantum computers are doing right now, noise included.",
  "La discesa variazionale":
    "The variational descent",
  "La manopola del circuito (θ)":
    "The circuit knob (θ)",
  "La pendenza":
    "The slope",
  "La pendenza e il quantistico che gira oggi: VQE":
    "The slope and the quantum computing that runs today: VQE",
  "La pendenza si misura <b>senza derivate approssimate</b>: si valuta la stessa energia con la manopola spostata di un quarto di giro avanti e indietro, e si divide per due. Qui: <b>:spost</b>, che è esattamente la pendenza vera.":
    "The slope is measured <b>with no approximate derivatives</b>: you evaluate the same energy with the knob shifted a quarter turn forwards and backwards, and divide by two. Here: <b>:spost</b>, which is exactly the true slope.",
  "Manopola a <b>:g°</b> → energia <b>:e</b>. Il fondo vale <b>:min</b>. Passi di discesa fatti: <b>:passi</b>.":
    "Knob at <b>:g°</b> → energy <b>:e</b>. The bottom is <b>:min</b>. Descent steps taken: <b>:passi</b>.",
  "Pendenza della retta che tocca la curva: <b>:p</b>. Misurata a mano con due punti vicini: <b>:num</b>.":
    "Slope of the line touching the curve: <b>:p</b>. Measured by hand from two nearby points: <b>:num</b>.",
  "Pendenza zero e curva che risale da tutte e due le parti: sei <b>in fondo a una valle</b>. È quello che cerca un algoritmo variazionale.":
    "Zero slope and the curve rising on both sides: you are <b>at the bottom of a valley</b>. That is what a variational algorithm is looking for.",
  "Pendenza zero, ma sei <b>in cima</b>: da qui si scende da entrambe le parti. Pendenza nulla non vuol dire minimo — è la trappola numero uno di questi metodi.":
    "Zero slope, but you are <b>at the top</b>: from here it goes down both ways. A null slope does not mean a minimum — it is trap number one for these methods.",
  "Quanti tiri per ogni misura":
    "How many shots per measurement",
  "Scendi: la pendenza dice da che parte. Con pochi tiri la misura balla, e i passi ballano con lei.":
    "Walk down: the slope says which way. With few shots the measurement jumps about, and the steps jump with it.",
  "Sei in fondo. Questo numero è la risposta che il VQE cerca: la minima energia raggiungibile con quel circuito.":
    "You are at the bottom. This number is the answer a VQE is after: the lowest energy that circuit can reach.",
  "abbassa l'energia":
    "bring the energy down",
  "energia: :e":
    "energy: :e",
  "il computer quantistico misura, quello normale gira la manopola":
    "the quantum computer measures, the ordinary one turns the knob",
  "il fondo: :e":
    "the bottom: :e",
  "l'onda":
    "the wave",
  "la valle":
    "the valley",
  "la valle doppia":
    "the double valley",
  "misura la pendenza":
    "measure the slope",
  "muovi il punto: la retta che lo tocca dice da che parte si scende":
    "move the point: the line touching it says which way is down",
  "pendenza misurata con :tiri tiri: :p (esatta: :vera)":
    "slope measured with :tiri shots: :p (exact: :vera)",
  "pendenza: :p":
    "slope: :p",
  "pendenza a zero, in fondo":
    "slope to zero, at the bottom",
  "chiedila alla macchina: «misura la pendenza»":
    "ask the machine: «measure the slope»",
  "riparti da un punto a caso":
    "restart from a random point",
  "scendi di un passo":
    "take one step down",
  "scendi finché puoi":
    "walk down as far as you can",
  "si scende di qua":
    "down is this way",
  /* ---------------- livello 0·7: equazioni e funzioni ---------------- */
  "<b>Il ponte con il quantistico:</b> una macchina si può percorrere all'indietro solo se non fa mai finire due numeri diversi nello stesso posto. Quando succede, l'informazione non è «difficile da recuperare»: <b>non c'è più</b>. È esattamente la reversibilità del livello :k, ed è il motivo per cui ogni porta quantistica dev'essere invertibile — nel livello :m lo vedrai scritto come «unitaria».":
    "<b>The bridge to quantum:</b> a machine can be run backwards only if it never sends two different numbers to the same place. When it does, the information is not «hard to recover»: it is <b>gone</b>. This is exactly the reversibility of level :k, and it is why every quantum gate must be invertible — in level :m you will see it written as «unitary».",
  "<b>La regola, tutta:</b> quello che fai a un piatto lo devi fare anche all'altro. Se lo fai, l'equilibrio regge e la risposta non cambia; se non lo fai, hai scritto una cosa falsa. La parola <b>algebra</b> viene proprio da qui: nel titolo del libro di al-Khwārizmī, intorno all'820, «al-jabr» vuol dire «rimettere a posto».":
    "<b>The rule, all of it:</b> whatever you do to one pan you must do to the other. Do that and the balance holds and the answer does not change; fail to, and you have written something false. The word <b>algebra</b> comes from exactly here: in the title of al-Khwārizmī's book, around 820, «al-jabr» means «restoring».",
  "Adesso la bilancia dice: <b>:sinistra = :destra</b>.":
    "Now the scale reads: <b>:sinistra = :destra</b>.",
  "Da :y non si può risalire: per esempio :a e :b escono <b>tutti e due</b> come :uguale.":
    "From :y there is no way back: for instance :a and :b <b>both</b> come out as :uguale.",
  "Equazioni, formule girate e macchine che tornano indietro":
    "Equations, formulas turned around, and machines that go back",
  "Giusto: ci sono ingressi diversi con la stessa uscita, quindi dall'uscita non si può sapere da dove si veniva. L'informazione è persa.":
    "Right: there are different inputs with the same output, so from the output there is no telling where you came from. The information is lost.",
  "Giusto: nessun ingresso finisce dove ne finisce un altro, quindi dall'uscita si risale sempre.":
    "Right: no input lands where another one lands, so from the output you can always work your way back.",
  "Il numero che entra":
    "The number going in",
  "La bilancia":
    "The balance scale",
  "La bilancia che non si sbilancia mai, come si gira una formula, e la domanda che vale tutto: si può risalire da dove si è arrivati?":
    "The scale that never tips, how to turn a formula around, and the question that decides everything: can you work back from where you ended up?",
  "La macchina":
    "The machine",
  "La macchina dei numeri":
    "The number machine",
  "La x vale <b>:vera</b> anche adesso: qualunque mossa fatta su tutti e due i piatti lascia la risposta dov'era. Continua finché a sinistra non resta una scatola sola.":
    "x is worth <b>:vera</b> right now too: any move made on both pans leaves the answer where it was. Carry on until a single box is left on the left.",
  "Macchina <b>:nome</b>: entra <b>:x</b>, esce <b>:y</b>.":
    "Machine <b>:nome</b>: <b>:x</b> goes in, <b>:y</b> comes out.",
  "No. Guarda se esistono due numeri diversi che escono uguali: se esistono, indietro non si torna.":
    "No. Check whether two different numbers come out the same: if they do, there is no going back.",
  "Prova a tornare indietro: da :y si risale a <b>:x</b>. Funziona per <b>ogni</b> numero, non solo per questo.":
    "Try going back: from :y you get to <b>:x</b>. It works for <b>every</b> number, not just this one.",
  "Risolta: <b>x = :valore</b>. Nota che la x valeva :valore fin dall'inizio — le mosse non l'hanno cambiata, l'hanno solo <b>messa in mostra</b>.":
    "Solved: <b>x = :valore</b>. Note that x was worth :valore from the start — the moves did not change it, they only <b>brought it into view</b>.",
  "aggiungi 3":
    "add 3",
  "altra equazione":
    "another equation",
  "due numeri diversi, stessa uscita":
    "two different numbers, same output",
  "e attenzione:":
    "and watch out:",
  "eleva al quadrato":
    "square it",
  "entra":
    "in",
  "equazioni risolte: :fatte su :totali":
    "equations solved: :fatte of :totali",
  "esce":
    "out",
  "lascia una sola scatola, da sola":
    "leave a single box, on its own",
  "macchine classificate: :fatte su :totali":
    "machines classified: :fatte of :totali",
  "moltiplica per zero":
    "multiply by zero",
  "nessuna mossa ancora":
    "no moves yet",
  "no, è persa":
    "no, it is lost",
  "raddoppia":
    "double it",
  "resto della divisione per 4":
    "remainder of division by 4",
  "si può tornare indietro?":
    "can you go back?",
  "si torna indietro, e si ritrova esattamente il numero di partenza":
    "you can go back, and you land exactly on the number you started from",
  "sì, si torna indietro":
    "yes, you can go back",
  "togli e dividi da tutte e due le parti: la bilancia resta in equilibrio":
    "take away and divide on both sides: the scale stays balanced",
  "un numero entra, uno esce: si può risalire a quello entrato?":
    "one number goes in, one comes out: can you work back to the one that went in?",
  /* ---------------- livello 0·8: esponenziali e logaritmi ---------------- */
  ":caso (:quanti casi) — risolti :fatti su :totali":
    ":caso (:quanti cases) — solved :fatti of :totali",
  ":n interruttori":
    ":n switches",
  "<b>Che cos'è un logaritmo, detto una volta per tutte:</b> è la risposta alla domanda «a quale potenza devo elevare?». Se 2¹⁰ = 1024, allora log₂(1024) = 10. Nel corso serve quasi sempre in questa forma: <b>quanti bit (o quanti qubit) servono per N casi</b>.":
    "<b>What a logarithm is, once and for all:</b> it is the answer to «to what power must I raise?». If 2¹⁰ = 1024, then log₂(1024) = 10. In this course it almost always shows up in this shape: <b>how many bits (or qubits) are needed for N cases</b>.",
  "<b>Perché è la stessa cosa:</b> dimezzare fino a 1 e chiedersi quanti bit servono sono due modi di fare la stessa domanda — «quante volte ci sta il 2 dentro N, moltiplicandolo per sé stesso?». La risposta è log₂N in tutti e due i casi. E questo numero è dappertutto: i confronti della ricerca binaria (livello :k), gli stadi della FFT (livello :f), e il numero di qubit che servono per rappresentare N possibilità.":
    "<b>Why it is the same thing:</b> halving down to 1 and asking how many bits are needed are two ways of asking the same question — «how many times does 2 fit inside N, multiplied by itself?». The answer is log₂N either way. And that number is everywhere: the comparisons of binary search (level :k), the stages of the FFT (level :f), and the number of qubits needed to represent N possibilities.",
  "Cerca il <b>minimo</b> numero di interruttori che basta: uno in meno non deve farcela.":
    "Look for the <b>smallest</b> number of switches that does it: one fewer must not be enough.",
  "Ci sono voluti <b>:n</b> dimezzamenti. E ora guarda: <b>:n</b> è anche il numero di interruttori che servirebbero per :N casi. Non è una coincidenza: è lo stesso logaritmo.":
    "It took <b>:n</b> halvings. Now look: <b>:n</b> is also the number of switches you would need for :N cases. That is no coincidence: it is the same logarithm.",
  "Con <b>:n</b> interruttori copri <b>:copre</b> casi. Te ne servono <b>:servono</b>.":
    "With <b>:n</b> switches you cover <b>:copre</b> cases. You need <b>:servono</b>.",
  "Esatto: log₂(:N) arrotondato in su fa :n.":
    "Correct: log₂(:N) rounded up is :n.",
  "Esponenziali e logaritmi: quante cifre servono":
    "Exponentials and logarithms: how many digits it takes",
  "Il minimo è <b>:serve</b>. Questo numero si chiama <b>logaritmo in base 2</b> di :N, arrotondato in su: log₂(:N) ≈ :esatto.":
    "The minimum is <b>:serve</b>. That number is called the <b>base-2 logarithm</b> of :N, rounded up: log₂(:N) ≈ :esatto.",
  "Il numero di partenza":
    "The starting number",
  "Interruttori accesi":
    "Switches on",
  "No: conta le barre disegnate, quella di partenza esclusa.":
    "No: count the bars drawn, not counting the first one.",
  "Ogni taglio dimezza. Da mille a uno bastano dieci tagli: è questo che rende la ricerca binaria così veloce.":
    "Every cut halves. From a thousand down to one takes ten cuts: that is what makes binary search so fast.",
  "Parti da <b>:N</b>. Dopo <b>:n</b> dimezzamenti resta <b>:v</b>.":
    "You start from <b>:N</b>. After <b>:n</b> halvings, <b>:v</b> is left.",
  "Quante cose devi distinguere":
    "How many things you must tell apart",
  "Quante volte posso dimezzare":
    "How many times can I halve",
  "Quanti interruttori per mille casi, quante volte si può dimezzare, e perché «polinomiale nel numero di cifre» cambia tutto.":
    "How many switches for a thousand cases, how many times you can halve, and why «polynomial in the number of digits» changes everything.",
  "Quanti interruttori servono":
    "How many switches it takes",
  "arriva a uno solo":
    "get down to one",
  "bastano, ma ne stai usando più del necessario":
    "enough, but you are using more than you need",
  "ci vogliono :n dimezzamenti":
    "it takes :n halvings",
  "copri :quanti casi":
    "you cover :quanti cases",
  "da :N a 1 in :n dimezzamenti":
    "from :N to 1 in :n halvings",
  "dimezza":
    "halve",
  "dimezza finché non resta uno solo: quante volte ci riesci?":
    "halve until one is left: how many times can you do it?",
  "dimezzamenti fatti: :n":
    "halvings so far: :n",
  "i giorni dell'anno":
    "the days of the year",
  "il minimo che basta":
    "the minimum that does it",
  "le carte di un mazzo":
    "the cards in a deck",
  "le lettere dell'alfabeto inglese":
    "the letters of the English alphabet",
  "mille numeri":
    "a thousand numbers",
  "non bastano: ne servono di più":
    "not enough: you need more",
  "non «quanto fa 2⁵», ma «per 26 lettere quanti bit?»: la domanda girata":
    "not «what is 2⁵», but «for 26 letters, how many bits?»: the question turned around",
  "numeri finiti: :fatti su :totali":
    "numbers finished: :fatti of :totali",
  "resta :v":
    ":v left",
  "te ne servono :quanti":
    "you need :quanti",
  "un milione di numeri":
    "a million numbers",
  "✓ :n è il minimo: con :meno non basterebbe":
    "✓ :n is the minimum: with :meno it would not be enough",
  /* ---------------- livello 0·9: il prodotto scalare ---------------- */
  "<b>Le due formule sono una sola.</b> «Moltiplica le coordinate e somma» e «lunghezza × lunghezza × coseno dell'angolo» danno sempre lo stesso numero: la prima si calcola, la seconda si capisce. E il caso che conta è quello di mezzo: <b>prodotto zero = perpendicolari</b>.":
    "<b>The two formulas are one.</b> «Multiply the coordinates and add» and «length × length × cosine of the angle» always give the same number: the first is for computing, the second for understanding. And the case that matters is the one in between: <b>product zero = perpendicular</b>.",
  "<b>Questa figura è la regola di Born.</b> L'ampiezza di un risultato è l'<b>ombra</b> dello stato sulla direzione di quel risultato — cioè il prodotto scalare — e la probabilità è quell'ombra al quadrato. Le due direzioni sono perpendicolari, quindi vale Pitagora e i quadrati fanno sempre 1. Girare la base è cambiare <b>domanda</b>: è la base di misura del livello :n.":
    "<b>This picture is Born's rule.</b> The amplitude of a result is the <b>shadow</b> of the state on that result's direction — the dot product — and the probability is that shadow squared. The two directions are perpendicular, so Pythagoras holds and the squares always add to 1. Turning the basis means changing the <b>question</b>: it is the measurement basis of level :n.",
  "Centrato. Nota che la somma dei quadrati non si è mossa: è Pitagora, e nel quantistico si chiama «le probabilità fanno 100%».":
    "Hit. Notice the sum of the squares has not moved: that is Pythagoras, and in the quantum world it is called «the probabilities make 100%».",
  "Come è girata la base di misura":
    "How the measurement basis is turned",
  "Freccia azzurra (:ax · :ay), lunga :la. Freccia viola (:bx · :by), lunga :lb.":
    "Blue arrow (:ax · :ay), length :la. Purple arrow (:bx · :by), length :lb.",
  "La misura è un'ombra":
    "Measurement is a shadow",
  "Lo stato punta a <b>:g°</b>; la base di misura è girata di <b>:b°</b>.":
    "The state points at <b>:g°</b>; the measurement basis is turned by <b>:b°</b>.",
  "Negativo: puntano <b>in versi opposti</b>.":
    "Negative: they point <b>opposite ways</b>.",
  "Ombre (le <b>ampiezze</b>): :a0 e :a1. Quadrati (le <b>probabilità</b>): :p0% e :p1%. Somma: <b>:tot%</b>.":
    "Shadows (the <b>amplitudes</b>): :a0 and :a1. Squares (the <b>probabilities</b>): :p0% and :p1%. Total: <b>:tot%</b>.",
  "Positivo: puntano <b>più o meno dalla stessa parte</b>.":
    "Positive: they point <b>roughly the same way</b>.",
  "Quanto due frecce si somigliano: il prodotto scalare":
    "How alike two arrows are: the dot product",
  "Quanto due frecce vanno d'accordo":
    "How well two arrows agree",
  "Stesso numero anche così: :la × :lb × cos(:g°) = :p — le due formule sono la stessa cosa.":
    "Same number this way too: :la × :lb × cos(:g°) = :p — the two formulas are the same thing.",
  "Trascina la freccia dello stato, oppure gira la base: le ombre cambiano, la loro somma di quadrati no.":
    "Drag the state arrow, or turn the basis: the shadows change, the sum of their squares does not.",
  "Un numero solo che dice se due frecce vanno d'accordo. E la misura quantistica scoperta per quello che è: un'ombra.":
    "One number saying whether two arrows agree. And quantum measurement uncovered for what it is: a shadow.",
  "Zero: le due frecce sono <b>perpendicolari</b>. Non si somigliano per niente — nel quantistico è la condizione che rende due stati distinguibili con certezza.":
    "Zero: the two arrows are <b>perpendicular</b>. Not alike at all — in the quantum world that is the condition making two states tellable apart with certainty.",
  "al quadrato: :p%":
    "squared: :p%",
  "altra configurazione":
    "another configuration",
  "angolo fra le due: :g°  ·  ombra: :om":
    "angle between them: :g°  ·  shadow: :om",
  "configurazioni centrate: :fatte su :totali":
    "configurations hit: :fatte of :totali",
  "fai venire il prodotto ZERO":
    "make the product come out ZERO",
  "fallo diventare negativo":
    "make it go negative",
  "fallo più grande che puoi":
    "make it as large as you can",
  "gira la base e guarda le due ombre: sono le ampiezze":
    "turn the basis and watch the two shadows: they are the amplitudes",
  "mettile perpendicolari":
    "make them perpendicular",
  "ombra su 0: :a":
    "shadow on 0: :a",
  "ombra su 1: :a":
    "shadow on 1: :a",
  "portalo a metà e metà":
    "bring it to fifty-fifty",
  "prodotto scalare: :p":
    "dot product: :p",
  "rendi certo il secondo risultato":
    "make the second result certain",
  "rendi il primo risultato certo (100%)":
    "make the first result certain (100%)",
  "rimettile come erano":
    "put them back as they were",
  "sempre 100, comunque giri":
    "always 100, however you turn",
  "sfide riuscite: :fatte su :totali":
    "challenges done: :fatte of :totali",
  "somma: :tot%":
    "total: :tot%",
  "trascina le punte: un numero solo dice quanto puntano nella stessa direzione":
    "drag the tips: one number says how much they point the same way",
  /* ---------------- livello 0·7b: equazioni di secondo grado ---------------- */
  "Secondo grado: la parabola e il quadrato a cui manca un angolo":
    "Quadratics: the parabola and the square with a missing corner",
  "Il delta in tre parole, la formula costruita invece che imparata, e il «mai» che nel Cinquecento ha aperto la porta ai numeri immaginari.":
    "The discriminant in three words, the formula built instead of memorised, and the «never» that opened the door to imaginary numbers in the sixteenth century.",
  "La parabola e le sue radici":
    "The parabola and its roots",
  "muovi i tre numeri: le soluzioni sono i punti dove la curva taglia la riga":
    "move the three numbers: the solutions are the points where the curve cuts the line",
  "fai tagliare la parabola in DUE punti":
    "make the parabola cut at TWO points",
  "falla toccare l'asse in UN punto solo":
    "make it touch the axis at just ONE point",
  "fai in modo che non lo tocchi MAI":
    "make it NEVER touch the axis",
  "situazioni trovate: :fatte su :totali":
    "cases found: :fatte of :totali",
  "delta = b² − 4ac = :d":
    "discriminant = b² − 4ac = :d",
  "due soluzioni":
    "two solutions",
  "una soluzione sola":
    "just one solution",
  "nessuna soluzione reale":
    "no real solution",
  "altra situazione":
    "another case",
  "Equazione: <b>:a x² + :b x + :c = 0</b>.":
    "Equation: <b>:a x² + :b x + :c = 0</b>.",
  "delta = :b² − 4·:a·:c = <b>:d</b>":
    "discriminant = :b² − 4·:a·:c = <b>:d</b>",
  "Due soluzioni: x = :x1 e x = :x2. La curva taglia la riga in due punti.":
    "Two solutions: x = :x1 and x = :x2. The curve cuts the line at two points.",
  "Una soluzione sola: x = :x. La curva <b>tocca</b> la riga senza attraversarla — il delta è zero.":
    "Just one solution: x = :x. The curve <b>touches</b> the line without crossing it — the discriminant is zero.",
  "Nessuna soluzione reale: la curva sta tutta da una parte. Il delta è negativo, e la radice di un numero negativo non è un numero della retta.":
    "No real solution: the curve stays entirely on one side. The discriminant is negative, and the square root of a negative number is not a number on the line.",
  "<b>Il delta in tre parole:</b> è quello che sta sotto la radice, e dice <b>quante volte</b> la parabola incontra la riga: due volte se è positivo, una se è zero, mai se è negativo. Quel «mai» non è un vicolo cieco: è la porta da cui, nel Cinquecento, sono entrati i numeri immaginari.":
    "<b>The discriminant in three words:</b> it is what sits under the square root, and it says <b>how many times</b> the parabola meets the line: twice if it is positive, once if it is zero, never if it is negative. That «never» is not a dead end: it is the door through which, in the sixteenth century, imaginary numbers came in.",
  "Il quadrato a cui manca un angolo":
    "The square with a missing corner",
  "il metodo di mille anni fa: completa il disegno e la soluzione compare":
    "the method from a thousand years ago: complete the drawing and the solution appears",
  "completa il quadrato":
    "complete the square",
  "equazioni risolte col disegno: :fatte su :totali":
    "equations solved with the drawing: :fatte of :totali",
  "lato = x + :m = :r":
    "side = x + :m = :r",
  "metà di :b è :m":
    "half of :b is :m",
  "L'equazione":
    "The equation",
  "spezza in due il rettangolo":
    "split the rectangle in two",
  "aggiungi l'angolo mancante":
    "add the missing corner",
  "prendi la radice":
    "take the square root",
  "Parti da <b>x² + :b x = :c</b>. Il disegno è un quadrato di lato x, e :b x da sistemare intorno.":
    "Start from <b>x² + :b x = :c</b>. The drawing is a square of side x, with :b x to arrange around it.",
  "I :b nani si mettono in <b>due file uguali da :m</b>, una a destra e una sotto: due rettangoli da :m x. Adesso il disegno è quasi un quadrato grande — ma manca l'angolo.":
    "The :b dwarfs split into <b>two equal rows of :m</b>, one on the right and one below: two rectangles of :m x. Now the drawing is almost a big square — but the corner is missing.",
  "L'angolo che manca è un quadratino <b>:m × :m = :p</b>: la mattonella che avanza. La aggiungi — ma allora, regola della bilancia, la devi aggiungere anche <b>all'altro piatto</b>: :c + :p = :d.":
    "The missing corner is a little square <b>:m × :m = :p</b>: the leftover tile. You add it — but then, by the balance rule, you have to add it <b>to the other pan too</b>: :c + :p = :d.",
  "Adesso a sinistra c'è un quadrato perfetto di lato (x + :m), e vale :d. Quindi <b>x + :m = :r</b>, cioè <b>x = :x</b>.":
    "Now on the left there is a perfect square of side (x + :m), and it is worth :d. So <b>x + :m = :r</b>, that is <b>x = :x</b>.",
  "E questa è la formula risolutiva, costruita invece che imparata: la radice, la metà di b, la sottrazione.":
    "And this is the quadratic formula, built instead of memorised: the square root, half of b, the subtraction.",
  "<b>Questo disegno ha 1200 anni.</b> È il metodo con cui al-Khwārizmī risolveva «un quadrato e dieci radici uguali a trentanove» — cioè x² + 10x = 39, la seconda equazione qui sopra. Non aveva la formula: aveva il disegno. La formula che si impara a scuola è questo disegno scritto con le lettere, e il pezzo sotto la radice è l'angolo mancante. Nel livello :n ritroverai lo stesso conto sotto un altro nome: il polinomio degli autovalori.":
    "<b>This drawing is 1200 years old.</b> It is the method with which al-Khwārizmī solved «a square and ten roots equal to thirty-nine» — that is x² + 10x = 39, the second equation above. He had no formula: he had the drawing. The formula taught at school is this drawing written with letters, and the piece under the square root is the missing corner. At level :n you will meet the same calculation under another name: the eigenvalue polynomial.",
  /* ---------------- livello M·1: polinomi e Ruffini ---------------- */
  "Parte M — La matematica delle superiori e dell'università":
    "Part M — The maths of high school and university",
  "Dalla prima superiore ad Analisi 2, ma solo i pezzi che questo corso usa davvero, e sempre con la curiosità dentro: perché quella formula è fatta così, da quale problema è nata, e a che serve qui. Facoltativa come la Parte 0 — però chi la fa capisce il resto molto meglio.":
    "From the first year of high school to second-year calculus, but only the pieces this course actually uses, and always with the curiosity inside: why that formula looks like that, which problem it was born from, and what it is for here. Optional like Part 0 — but whoever does it understands the rest far better.",
  "Polinomi, Ruffini e la formula che non esiste":
    "Polynomials, Ruffini, and the formula that does not exist",
  "Scomporre cercando i sospettati, la staffetta di Ruffini che è anche il modo più veloce di calcolare un polinomio, e il motivo per cui dal quinto grado in poi una formula non c'è — e non ci sarà mai.":
    "Factoring by questioning the suspects, Ruffini's relay which is also the fastest way to evaluate a polynomial, and the reason why from the fifth degree on there is no formula — and never will be.",
  "I sospettati":
    "The suspects",
  "le radici intere si nascondono solo fra i divisori del termine noto: interrogali":
    "whole roots hide only among the divisors of the constant term: question them",
  "non si scompone più: fatto":
    "it factors no further: done",
  "trova le radici e sfilale una per una":
    "find the roots and peel them off one at a time",
  "polinomi scomposti: :fatte su :totali":
    "polynomials factored: :fatte of :totali",
  "sfilate finora: :lista":
    "peeled off so far: :lista",
  "ancora nessuna radice sfilata":
    "no root peeled off yet",
  "Il polinomio":
    "The polynomial",
  "Termine noto <b>:noto</b> → i sospettati sono solo i suoi divisori, col più e col meno: <b>:lista</b>. Tutti gli altri numeri hanno un alibi automatico.":
    "Constant term <b>:noto</b> → the suspects are only its divisors, plus and minus: <b>:lista</b>. Every other number has an automatic alibi.",
  "x = :c non è una radice: il resto viene :r, non zero. Alibi confermato.":
    "x = :c is not a root: the remainder comes out :r, not zero. Alibi confirmed.",
  "Finora: :pezzi · (:resto)":
    "So far: :pezzi · (:resto)",
  "Quello che resta non ha radici intere: si ferma qui, ed è una risposta giusta. Guarda il suo delta.":
    "What is left has no whole roots: it stops here, and that is a correct answer. Look at its discriminant.",
  "Scomposto fino in fondo.":
    "Factored all the way down.",
  "<b>Perché i sospettati sono così pochi.</b> Se un intero r annulla il polinomio, raccogliendo r da tutti i termini con la x resta da spartire solo il <b>termine noto</b>: quindi r deve dividerlo esatto. Da infiniti candidati a una manciata — la stessa mossa che al livello :n rende Grover utile: prima si restringe lo spazio di ricerca, poi si cerca.":
    "<b>Why the suspects are so few.</b> If a whole number r makes the polynomial zero, factoring r out of every term containing x leaves only the <b>constant term</b> to be shared out: so r must divide it exactly. From infinitely many candidates to a handful — the same move that makes Grover useful at level :n: first you narrow the search space, then you search.",
  "La staffetta di Ruffini":
    "Ruffini's relay",
  "ogni corridore riceve il testimone, lo moltiplica per r e lo passa: alla fine esce il valore del polinomio":
    "each runner takes the baton, multiplies it by r and passes it on: at the end out comes the value of the polynomial",
  "porta il testimone fino in fondo":
    "carry the baton all the way",
  "staffette finite: :fatte su :totali":
    "relays finished: :fatte of :totali",
  "coefficienti":
    "coefficients",
  "× :r e passa avanti":
    "× :r and pass it on",
  "testimone":
    "baton",
  "P(:r) = :v = il resto della divisione":
    "P(:r) = :v = the remainder of the division",
  "moltiplicazioni: :h con la staffetta, :b a forza bruta":
    "multiplications: :h with the relay, :b by brute force",
  "Il numero r":
    "The number r",
  "passa il testimone":
    "pass the baton",
  "Il primo corridore parte con il coefficiente più alto: non riceve niente da nessuno.":
    "The first runner sets off with the highest coefficient: it receives nothing from anybody.",
  "Testimone: <b>:s</b>. Adesso lo moltiplichi per r = :r e lo passi al corridore dopo.":
    "Baton: <b>:s</b>. Now you multiply it by r = :r and pass it to the next runner.",
  "Il corridore :quale riceve <b>:portato</b> (cioè :prima × :erre), lo somma al suo coefficiente :suo e ottiene <b>:totale</b>.":
    "Runner :quale receives <b>:portato</b> (that is :prima × :erre), adds it to its own coefficient :suo and gets <b>:totale</b>.",
  "L'ultimo numero è <b>:v</b>. Se è zero, r è una radice e gli altri numeri sono il polinomio rimasto. Se non è zero, hai comunque appena calcolato P(:r) con :h sole moltiplicazioni invece di :b.":
    "The last number is <b>:v</b>. If it is zero, r is a root and the other numbers are the polynomial left over. If it is not zero, you have still just evaluated P(:r) with only :h multiplications instead of :b.",
  "<b>La stessa riga di numeri fa due cose.</b> Se il resto è zero hai <b>diviso</b> il polinomio; se non lo è hai <b>calcolato</b> il polinomio in quel punto (teorema del resto). E l'hai fatto con una moltiplicazione per coefficiente: è lo schema di Horner, il modo più veloce che si conosca. Al livello :n scoprirai che la DFT è proprio questo — calcolare un polinomio in tanti punti — e la FFT è il «dividi a metà» applicato qui dentro.":
    "<b>The same row of numbers does two things.</b> If the remainder is zero you have <b>divided</b> the polynomial; if it is not, you have <b>evaluated</b> the polynomial at that point (remainder theorem). And you did it with one multiplication per coefficient: that is Horner's scheme, the fastest known. At level :n you will discover that the DFT is exactly this — evaluating a polynomial at many points — and the FFT is the «split in half» applied inside it.",
  /* ---------------- livello M·2: goniometria ---------------- */
  "Girare due volte: le formule di addizione":
    "Turning twice: the addition formulas",
  "L'identità fondamentale che è Pitagora travestito, due giri che ne fanno uno solo — e la scoperta che ogni giro di Grover aggiunge 2θ.":
    "The fundamental identity that is Pythagoras in disguise, two turns that make one — and the discovery that every Grover round adds 2θ.",
  "La giostra: due giri fanno un giro solo":
    "The carousel: two turns make one turn",
  "gira di a, poi di b: dove finisci? e che numeri ci sono dietro?":
    "turn by a, then by b: where do you end up? and what numbers are behind it?",
  "arriva esattamente a :b° sommando i due giri":
    "land exactly on :b° by adding the two turns",
  "bersagli presi: :fatte su :totali":
    "targets hit: :fatte of :totali",
  "a = :a°":
    "a = :a°",
  "b = :b°":
    "b = :b°",
  "a + b = :s°":
    "a + b = :s°",
  "sin² + cos² = :p":
    "sin² + cos² = :p",
  "il giro azzurro poi quello viola finiscono dove finisce un giro solo di :s°":
    "the blue turn then the purple one end up where a single turn of :s° ends up",
  "Giro di <b>:a°</b>, poi di <b>:b°</b>: finisci a <b>:s°</b>.":
    "A turn of <b>:a°</b>, then of <b>:b°</b>: you end up at <b>:s°</b>.",
  "Con la formula: cos(a+b) = cos a · cos b − sin a · sin b = <b>:f</b>.":
    "With the formula: cos(a+b) = cos a · cos b − sin a · sin b = <b>:f</b>.",
  "Girando davvero di :s°: cos = <b>:d</b>.":
    "Actually turning by :s°: cos = <b>:d</b>.",
  "Stesso numero. Non è una coincidenza: la formula dice soltanto che due giri sono un giro solo.":
    "Same number. Not a coincidence: the formula says only that two turns are one turn.",
  "<b>Da dove esce la formula.</b> Al livello :n hai visto che una rotazione è una matrice. Fare due rotazioni è <b>moltiplicare le due matrici</b>: svolgi il prodotto riga per colonna e nelle caselle compaiono, già scritte, cos a·cos b − sin a·sin b e sin a·cos b + cos a·sin b. Le formule di addizione non sono da imparare: sono il prodotto di due matrici letto ad alta voce.":
    "<b>Where the formula comes from.</b> At level :n you saw that a rotation is a matrix. Doing two rotations means <b>multiplying the two matrices</b>: work the product out row by column and the cells already contain cos a·cos b − sin a·sin b and sin a·cos b + cos a·sin b. The addition formulas are not to be learnt: they are the product of two matrices read out loud.",
  "Grover visto come un angolo che cresce":
    "Grover seen as a growing angle",
  "ogni giro aggiunge 2θ: arriva più vicino che puoi a 90°, e prova a superarlo":
    "each round adds 2θ: get as close to 90° as you can, then try going past it",
  "porta la freccia il più vicino possibile a 90°":
    "bring the arrow as close as possible to 90°",
  "elenchi centrati: :fatte su :totali":
    "lists hit: :fatte of :totali",
  "sbagliate":
    "wrong ones",
  "giusta":
    "right one",
  "probabilità":
    "probability",
  "θ = :t° · giri fatti: :k · angolo = (2·:k+1)·θ = :a°":
    "θ = :t° · rounds done: :k · angle = (2·:k+1)·θ = :a°",
  "hai superato i 90°: da qui in poi la probabilità SCENDE":
    "you have gone past 90°: from here on the probability GOES DOWN",
  "il numero di giri che centra meglio è :o":
    "the number of rounds that hits best is :o",
  "Quante risposte in tutto":
    "How many answers in total",
  "un giro di Grover":
    "one Grover round",
  "Su <b>:n</b> risposte, all'inizio la freccia sta a θ = <b>:t°</b> dall'asse delle sbagliate: sin θ = √(1/:n).":
    "On <b>:n</b> answers, at the start the arrow sits at θ = <b>:t°</b> from the axis of the wrong ones: sin θ = √(1/:n).",
  "Dopo <b>:k</b> giri l'angolo è (2·:k+1)·θ = <b>:a°</b>, e la probabilità di leggere la risposta giusta è sin² di quell'angolo = <b>:p%</b>.":
    "After <b>:k</b> rounds the angle is (2·:k+1)·θ = <b>:a°</b>, and the probability of reading the right answer is sin² of that angle = <b>:p%</b>.",
  "Oltre i 90° la freccia si allontana di nuovo: continuare a girare PEGGIORA le cose. È il difetto che nessuna ricerca classica ha.":
    "Beyond 90° the arrow moves away again: going on rotating MAKES THINGS WORSE. It is the flaw no classical search has.",
  "Questo è il punto migliore: :o giri, cioè circa π/4·√:n. Ecco da dove esce il √N di Grover.":
    "This is the best point: :o rounds, that is about π/4·√:n. That is where Grover's √N comes from.",
  "Ancora lontano dai 90°: prova un altro giro.":
    "Still far from 90°: try another round.",
  "<b>Perché 2θ e non θ.</b> Un giro di Grover fa due specchiate, e due specchiate di fila sono <b>una rotazione del doppio dell'angolo fra i due specchi</b>. Quindi ogni giro somma 2θ — ed è la formula di duplicazione applicata al livello :n. Il √N non è una scelta: è il numero di volte che ci sta 2θ dentro 90°.":
    "<b>Why 2θ and not θ.</b> A Grover round performs two reflections, and two reflections in a row are <b>a rotation by twice the angle between the two mirrors</b>. So each round adds 2θ — and that is the double-angle formula applied to level :n. The √N is not a choice: it is how many times 2θ fits inside 90°.",
  /* ---------------- livello M·3: numeri complessi ---------------- */
  "Numeri complessi per bene: e^(iθ) e le radici dell'unità":
    "Complex numbers properly: e^(iθ) and the roots of unity",
  "Moltiplicare è allungare e girare, da lì la scrittura e^(iθ) — e le n frecce che sommate fanno zero, cioè il motore della trasformata di Fourier.":
    "Multiplying is stretching and turning, hence the notation e^(iθ) — and the n arrows that add up to zero, the engine of the Fourier transform.",
  "Moltiplicare due frecce":
    "Multiplying two arrows",
  "le lunghezze si moltiplicano, gli angoli si sommano: guardalo succedere":
    "the lengths multiply, the angles add: watch it happen",
  "fai finire il prodotto sul bersaglio (lungo :r, girato di :g°)":
    "land the product on the target (length :r, turned by :g°)",
  "freccia 1: lunga :r, a :g°":
    "arrow 1: length :r, at :g°",
  "freccia 2: lunga :r, a :g°":
    "arrow 2: length :r, at :g°",
  "prodotto: lungo :r, a :g°":
    "product: length :r, at :g°",
  ":a × :b = :c":
    ":a × :b = :c",
  ":a° + :b° = :c°":
    ":a° + :b° = :c°",
  "in coordinate: (:a + :b i) × (:c + :d i)":
    "in coordinates: (:a + :b i) × (:c + :d i)",
  "= :e + :f i":
    "= :e + :f i",
  "lunghezza 1":
    "length 1",
  "angolo 1":
    "angle 1",
  "lunghezza 2":
    "length 2",
  "angolo 2":
    "angle 2",
  "Lunghezze: :a × :b = <b>:c</b>. Angoli: :d° + :e° = <b>:f°</b>.":
    "Lengths: :a × :b = <b>:c</b>. Angles: :d° + :e° = <b>:f°</b>.",
  "E il prodotto calcolato in coordinate viene lungo <b>:r</b> e girato di <b>:g°</b>: gli stessi due numeri.":
    "And the product worked out in coordinates comes out with length <b>:r</b> and turned by <b>:g°</b>: the same two numbers.",
  "Moltiplicare non è «fare più grande»: è <b>allungare e girare</b>. Con lunghezza 1 resta solo il girare — ed è quello che fa una fase quantistica.":
    "Multiplying is not «making bigger»: it is <b>stretching and turning</b>. With length 1 only the turning is left — and that is what a quantum phase does.",
  "<b>Perché gli angoli si sommano.</b> Svolgi il prodotto di due frecce di lunghezza 1: (cos a + i·sin a)(cos b + i·sin b). La parte senza i viene cos a·cos b − sin a·sin b, quella con la i viene sin a·cos b + cos a·sin b. Sono <b>esattamente</b> le formule di addizione del livello :n: cioè cos(a+b) e sin(a+b). Il prodotto è la freccia a a+b gradi, e non poteva essere altro.":
    "<b>Why the angles add.</b> Expand the product of two arrows of length 1: (cos a + i·sin a)(cos b + i·sin b). The part without i comes out cos a·cos b − sin a·sin b, the part with the i comes out sin a·cos b + cos a·sin b. Those are <b>exactly</b> the addition formulas of level :n: that is, cos(a+b) and sin(a+b). The product is the arrow at a+b degrees, and it could not have been anything else.",
  "Le radici dell'unità: n frecce che si annullano":
    "The roots of unity: n arrows that cancel out",
  "gli n numeri che elevati alla n danno 1 — e la loro somma":
    "the n numbers that raised to the n give 1 — and their sum",
  "somma tutte le :n frecce e guarda dove arrivi":
    "add up all :n arrows and see where you land",
  "poligoni chiusi: :fatte su :totali":
    "polygons closed: :fatte of :totali",
  "punta contro coda":
    "tip to tail",
  "torna al punto di partenza: somma = 0":
    "back to the starting point: sum = 0",
  "somma delle prime :q: (:a ; :b)":
    "sum of the first :q: (:a ; :b)",
  "Quante radici":
    "How many roots",
  "aggiungi una freccia":
    "add one arrow",
  "tutte insieme":
    "all at once",
  "Le <b>:n</b> radici stanno a :p° una dall'altra: sono i vertici di un poligono regolare, il primo in 1.":
    "The <b>:n</b> roots sit :p° apart: they are the vertices of a regular polygon, the first one on 1.",
  "Sommate le prime :q, sei arrivato a (<b>:a</b> ; <b>:b</b>).":
    "Having added the first :q, you have reached (<b>:a</b> ; <b>:b</b>).",
  "Zero. Le :n frecce si annullano fra loro: puntano in tutte le direzioni in modo perfettamente bilanciato, e la catena si chiude.":
    "Zero. The :n arrows cancel one another: they point in every direction in perfect balance, and the chain closes.",
  "Aggiungine ancora: la catena non si è ancora chiusa.":
    "Add some more: the chain has not closed yet.",
  "<b>Questo zero è l'interferenza distruttiva.</b> Le n radici dell'unità sono le stesse frecce che la DFT del livello :dft usa per pesare i campioni, e il fatto che sommate facciano zero è il motivo per cui tutte le frequenze sbagliate si cancellano e resta solo il picco. La stessa catena che si chiude l'hai già vista al livello :serie: qui sai anche <b>chi sono</b> quelle frecce.":
    "<b>This zero is destructive interference.</b> The n roots of unity are the same arrows the DFT of level :dft uses to weight the samples, and the fact that they add to zero is why every wrong frequency cancels and only the peak is left. You have seen the same closing chain at level :serie: here you also know <b>who</b> those arrows are.",
  /* ---------------- livello M·4: spazi vettoriali ---------------- */
  "Spazi vettoriali: base, dimensione, e perché 2^n":
    "Vector spaces: basis, dimension, and why 2^n",
  "Poche frecce che raggiungono tutto, il numero che non cambia qualunque base tu scelga, e la ragione per cui n qubit vivono in uno spazio di dimensione 2^n.":
    "A few arrows that reach everything, the number that stays the same whichever basis you pick, and the reason n qubits live in a space of dimension 2^n.",
  "Costruire una freccia da altre due":
    "Building an arrow out of two others",
  "allunga le due frecce della base e sommale: ci arrivi sempre?":
    "stretch the two basis arrows and add them: can you always get there?",
  "arriva sul bersaglio (:x ; :y)":
    "land on the target (:x ; :y)",
  "bersagli raggiunti: :fatte su :totali":
    "targets reached: :fatte of :totali",
  "prima freccia × :a":
    "first arrow × :a",
  "seconda freccia × :c":
    "second arrow × :c",
  "arrivi in (:x ; :y)":
    "you land on (:x ; :y)",
  "è una base: ci arrivi sempre":
    "it is a basis: you always get there",
  "NON è una base":
    "NOT a basis",
  "due frecce non in linea bastano per tutto il piano":
    "two arrows not in line are enough for the whole plane",
  "le due frecce sono in linea: si raggiunge solo la retta tratteggiata":
    "the two arrows are in line: only the dashed straight line is reachable",
  "La base":
    "The basis",
  "gli assi":
    "the axes",
  "girata di 45°":
    "turned by 45°",
  "storta":
    "skewed",
  "due in linea":
    "two in line",
  "quanto della prima":
    "how much of the first",
  "quanto della seconda":
    "how much of the second",
  "Stai costruendo <b>:a</b> volte la prima freccia più <b>:c</b> volte la seconda, e arrivi in (<b>:x</b> ; <b>:y</b>).":
    "You are building <b>:a</b> times the first arrow plus <b>:c</b> times the second, and you land on (<b>:x</b> ; <b>:y</b>).",
  "Questa è una <b>base</b>: le due frecce non stanno in linea, quindi con i due cursori si arriva in <b>qualunque</b> punto del piano. Per questo bersaglio i numeri giusti sono :a e :c.":
    "This is a <b>basis</b>: the two arrows are not in line, so the two sliders reach <b>any</b> point of the plane. For this target the right numbers are :a and :c.",
  "Queste due frecce stanno <b>sulla stessa retta</b>: allungale come vuoi, la somma resterà sempre su quella retta. Non è un tuo errore ed è inutile insistere — non è una base, e metà del piano è irraggiungibile.":
    "These two arrows lie <b>on the same straight line</b>: stretch them however you like, the sum will always stay on that line. It is not your mistake and there is no point insisting — it is not a basis, and half the plane is unreachable.",
  "Centrato.":
    "Hit.",
  "<b>Due parole che adesso hai in mano.</b> Le due frecce che bastano si chiamano <b>base</b>; il loro numero — qui due — si chiama <b>dimensione</b>, ed è lo stesso qualunque base tu scelga. I due numeri dei cursori sono le <b>coordinate</b> del punto <i>in quella base</i>: cambiando base cambiano i numeri, ma il punto resta dov'è. È esattamente ciò che succede quando al livello :n misuri lo stesso qubit in due basi diverse.":
    "<b>Two words you now have in hand.</b> The two arrows that suffice are called a <b>basis</b>; their number — two here — is called the <b>dimension</b>, and it is the same whichever basis you pick. The two slider numbers are the point's <b>coordinates</b> <i>in that basis</i>: change basis and the numbers change, but the point stays where it is. That is exactly what happens at level :n when you measure the same qubit in two different bases.",
  "Quante frecce servono davvero":
    "How many arrows are really needed",
  "accendi e spegni le frecce: quali insiemi coprono tutto il piano?":
    "switch the arrows on and off: which sets cover the whole plane?",
  "copri tutto il piano con il <b>minimo</b> numero di frecce":
    "cover the whole plane with the <b>smallest</b> number of arrows",
  "insiemi minimi trovati: :fatte su :totali":
    "minimal sets found: :fatte of :totali",
  "raggiungi TUTTO il piano":
    "you reach the WHOLE plane",
  "raggiungi solo una retta":
    "you only reach a straight line",
  "non raggiungi niente":
    "you reach nothing",
  "frecce accese: :q · direzioni indipendenti: :r":
    "arrows on: :q · independent directions: :r",
  "La collezione":
    "The collection",
  "collezione :n":
    "collection :n",
  "freccia :n":
    "arrow :n",
  "Frecce accese: <b>:q</b>. Direzioni indipendenti: <b>:r</b>.":
    "Arrows on: <b>:q</b>. Independent directions: <b>:r</b>.",
  "Senza frecce non si va da nessuna parte.":
    "With no arrows you go nowhere.",
  "Tutte le frecce accese stanno sulla stessa retta: sommandole e allungandole resti sempre lì. Una direzione sola.":
    "Every arrow switched on lies on the same straight line: adding and stretching them keeps you there. One direction only.",
  "Due frecce, due direzioni: questa è una <b>base</b>, ed è il minimo possibile. La <b>dimensione</b> del piano è 2.":
    "Two arrows, two directions: this is a <b>basis</b>, and it is the smallest possible. The plane's <b>dimension</b> is 2.",
  "Copri tutto il piano, ma con :q frecce: una è di troppo, si può scrivere usando le altre. Spegnine una.":
    "You cover the whole plane, but with :q arrows: one is redundant, it can be written using the others. Switch one off.",
  "<b>Il numero che non cambia mai.</b> Comunque scegli le frecce, per coprire il piano ce ne vogliono <b>esattamente due</b>: meno non bastano, di più sono ridondanti. Quel numero è la <b>dimensione</b>, e non dipende dalla base. Un qubit vive in dimensione 2 (le ampiezze di 0 e 1); due qubit in dimensione 4; <b>n qubit in dimensione 2^n</b> — non 2n. È tutta lì la ragione per cui, da qualche decina di qubit in su, simulare il registro su un computer normale diventa impossibile.":
    "<b>The number that never changes.</b> However you pick the arrows, covering the plane takes <b>exactly two</b>: fewer are not enough, more are redundant. That number is the <b>dimension</b>, and it does not depend on the basis. A qubit lives in dimension 2 (the amplitudes of 0 and 1); two qubits in dimension 4; <b>n qubits in dimension 2^n</b> — not 2n. That is the whole reason why, from a few dozen qubits up, simulating the register on an ordinary computer becomes impossible.",
  /* ---------------- livello M·5: operatori ---------------- */
  "Operatori: porte, osservabili e misure sono tre tipi di matrice":
    "Operators: gates, observables and measurements are three kinds of matrix",
  "Unitaria = non cambia le lunghezze. Hermitiana = autovalori reali. Proiettore = rifarlo non cambia niente. Le tre parole della quantistica, costruite con quattro manopole.":
    "Unitary = does not change lengths. Hermitian = real eigenvalues. Projector = redoing it changes nothing. The three words of quantum mechanics, built with four knobs.",
  "Che razza di macchina è?":
    "What kind of machine is it?",
  "quattro manopole, tre etichette: conserva le lunghezze? è uguale al suo aggiunto? si può rifare?":
    "four knobs, three labels: does it keep lengths? does it equal its adjoint? can it be redone?",
  "costruisci una unitaria, una hermitiana e una che sia tutte e due":
    "build a unitary, a Hermitian, and one that is both",
  "famiglie trovate: :fatte su :totali":
    "families found: :fatte of :totali",
  "✓ unitaria: non cambia le lunghezze":
    "✓ unitary: it does not change lengths",
  "✗ non unitaria: le lunghezze cambiano":
    "✗ not unitary: lengths change",
  "✓ hermitiana: uguale al suo aggiunto":
    "✓ Hermitian: equal to its adjoint",
  "✗ non hermitiana":
    "✗ not Hermitian",
  "✓ proiettore: rifarlo non cambia niente":
    "✓ projector: redoing it changes nothing",
  "autovalori: :a e :b":
    "eigenvalues: :a and :b",
  "autovalori complessi (delta < 0)":
    "complex eigenvalues (discriminant < 0)",
  "unitaria":
    "unitary",
  "hermitiana":
    "Hermitian",
  "proiettore":
    "projector",
  "i pallini grigi sono le frecce di partenza, quelli colorati dove finiscono":
    "the grey dots are the starting arrows, the coloured ones where they end up",
  "Macchine pronte":
    "Ready-made machines",
  "rotazione":
    "rotation",
  "schiaccia":
    "flatten",
  "Traccia :t, determinante :d.":
    "Trace :t, determinant :d.",
  "Autovalori <b>:a</b> e <b>:b</b>: numeri veri, quindi ci sono direzioni ferme.":
    "Eigenvalues <b>:a</b> and <b>:b</b>: real numbers, so there are still directions.",
  "Autovalori complessi: nessuna direzione resta ferma — è una rotazione.":
    "Complex eigenvalues: no direction stays still — it is a rotation.",
  "Unitaria <b>e</b> hermitiana insieme: è una specchiata. Applicandola due volte torni al punto di partenza — come le porte X, Z e H.":
    "Unitary <b>and</b> Hermitian at once: it is a reflection. Apply it twice and you are back where you started — like the X, Z and H gates.",
  "Unitaria: nessuna freccia cambia lunghezza. Una porta quantistica deve essere così, altrimenti le probabilità non farebbero più 100%.":
    "Unitary: no arrow changes length. A quantum gate has to be like this, otherwise the probabilities would stop making 100%.",
  "Hermitiana: uguale al suo aggiunto, e i suoi autovalori sono sempre numeri reali. È la forma di un'osservabile.":
    "Hermitian: equal to its adjoint, and its eigenvalues are always real numbers. That is the shape of an observable.",
  "Proiettore: schiaccia tutto su una retta, e rifarlo non cambia più niente. È la forma di una misura.":
    "Projector: it flattens everything onto a line, and redoing it changes nothing more. That is the shape of a measurement.",
  "Per ora non è di nessuna delle tre famiglie: continua a girare le manopole.":
    "For now it belongs to none of the three families: keep turning the knobs.",
  "<b>Le tre parole della meccanica quantistica.</b> Una <b>porta</b> è una macchina unitaria: non cambia le lunghezze, quindi le probabilità restano 100% e il circuito si può rifare al contrario (livello :k). Un'<b>osservabile</b> è una macchina hermitiana: i suoi autovalori sono reali, cioè numeri che si possono leggere su uno strumento. Una <b>misura</b> è un proiettore. Tre famiglie di matrici, tre concetti — e li hai appena costruiti con quattro manopole.":
    "<b>The three words of quantum mechanics.</b> A <b>gate</b> is a unitary machine: it does not change lengths, so the probabilities stay at 100% and the circuit can be run backwards (level :k). An <b>observable</b> is a Hermitian machine: its eigenvalues are real, that is, numbers you can read on an instrument. A <b>measurement</b> is a projector. Three families of matrices, three concepts — and you have just built them with four knobs.",
  "Misurare è proiettare":
    "Measuring is projecting",
  "lo stato si schiaccia sulla direzione che esce — e se rileggi, trovi lo stesso":
    "the state flattens onto whichever direction comes out — and if you read again, you find the same",
  "misura, poi rimisura: cambia qualcosa?":
    "measure, then measure again: does anything change?",
  "basi provate: :fatte su :totali":
    "bases tried: :fatte of :totali",
  "probabilità: :a% sulla verde, :b% sulla rosa":
    "probability: :a% on the green, :b% on the pink",
  "letture: :l":
    "readings: :l",
  "verde":
    "green",
  "rosa":
    "pink",
  "nessuna lettura ancora":
    "no reading yet",
  "Direzione di misura":
    "Measurement direction",
  "lo stato, a quanti gradi":
    "the state, at how many degrees",
  "rimetti lo stato com'era":
    "put the state back as it was",
  "Lo stato è a <b>:s°</b>, la direzione di misura a <b>:d°</b>. Le due ombre al quadrato fanno <b>:a%</b> e <b>:b%</b> — e sommano a 100.":
    "The state is at <b>:s°</b>, the measurement direction at <b>:d°</b>. The two shadows squared make <b>:a%</b> and <b>:b%</b> — and they add to 100.",
  "Premi «misura»: il risultato esce a caso, con quelle probabilità.":
    "Press «measure»: the result comes out at random, with those probabilities.",
  "È uscito <b>:e</b>, e lo stato si è schiacciato su quella direzione. Adesso rimisura: la probabilità è diventata 100% da quella parte.":
    "It came out <b>:e</b>, and the state has flattened onto that direction. Now measure again: the probability has become 100% on that side.",
  "Letto :q volte, sempre lo stesso. Non è fortuna: il proiettore applicato due volte dà lo stesso risultato della prima — P·P = P, e i numeri lo confermano: :n.":
    "Read :q times, always the same. It is not luck: the projector applied twice gives the same result as the first time — P·P = P, and the numbers confirm it: :n.",
  "<b>Perché rileggere non cambia la risposta.</b> Un proiettore ha una proprietà che si scrive in tre simboli — <b>P·P = P</b> — e vuol dire «applicarlo due volte è come applicarlo una volta». Nel mondo quantistico è la frase «una volta misurato, lo stato è quello»: il collasso non è un'ipotesi in più, è la faccia fisica dell'idempotenza. E le due probabilità che sommano a 100 sono l'altra proprietà: i due proiettori messi insieme fanno l'identità.":
    "<b>Why re-reading does not change the answer.</b> A projector has a property that fits in three symbols — <b>P·P = P</b> — meaning «applying it twice is like applying it once». In the quantum world that is the sentence «once measured, the state is that one»: collapse is not an extra hypothesis, it is the physical face of idempotence. And the two probabilities adding to 100 are the other property: the two projectors put together make the identity.",
  /* ---------------- livello M·6: prodotto tensoriale ---------------- */
  "Prodotto tensoriale: e finalmente cosa vuol dire «entangled»":
    "Tensor product: and finally what «entangled» means",
  "Mettere insieme due registri moltiplica le dimensioni invece di sommarle — e uno stato è entangled quando quel prodotto non si può disfare. Con il conto che lo dice in una riga.":
    "Putting two registers together multiplies the dimensions instead of adding them — and a state is entangled when that product cannot be undone. With the one-line calculation that says so.",
  "Due qubit fanno quattro ampiezze":
    "Two qubits make four amplitudes",
  "ogni ampiezza del primo per ogni ampiezza del secondo: le dimensioni si moltiplicano":
    "every amplitude of the first times every amplitude of the second: the dimensions multiply",
  "costruisci la coppia :a° e :b°":
    "build the pair :a° and :b°",
  "coppie costruite: :fatte su :totali":
    "pairs built: :fatte of :totali",
  "primo qubit":
    "first qubit",
  "secondo qubit":
    "second qubit",
  "la coppia: quattro ampiezze":
    "the pair: four amplitudes",
  "incrocio a00·a11 − a01·a10 = :i → separabile per costruzione":
    "cross a00·a11 − a01·a10 = :i → separable by construction",
  "Primo qubit (<b>:a0</b> ; <b>:a1</b>), secondo (<b>:b0</b> ; <b>:b1</b>).":
    "First qubit (<b>:a0</b> ; <b>:a1</b>), second (<b>:b0</b> ; <b>:b1</b>).",
  "La coppia: |00⟩ = :p00, |01⟩ = :p01, |10⟩ = :p10, |11⟩ = :p11 — ognuna è un prodotto delle due di sopra.":
    "The pair: |00⟩ = :p00, |01⟩ = :p01, |10⟩ = :p10, |11⟩ = :p11 — each one is a product of the two above.",
  "Due numeri più due numeri non fanno quattro numeri qualsiasi: ne fanno solo quelli che si ottengono moltiplicando. Ed è per questo che esistono stati di due qubit che <b>non</b> si possono scrivere così.":
    "Two numbers plus two numbers do not make four arbitrary numbers: they make only those you get by multiplying. And that is why there exist two-qubit states that <b>cannot</b> be written this way.",
  "<b>Da dove viene davvero il 2^n.</b> Il livello :m diceva che n qubit vivono in dimensione 2^n; qui vedi il meccanismo. Mettere insieme due registri non somma le dimensioni: le <b>moltiplica</b>, perché ogni ampiezza dell'uno va accoppiata con ogni ampiezza dell'altro. 2 × 2 = 4, poi 4 × 2 = 8, e così via — mentre due registri classici da n bit ne fanno semplicemente 2n.":
    "<b>Where the 2^n really comes from.</b> Level :m said that n qubits live in dimension 2^n; here you see the mechanism. Putting two registers together does not add the dimensions: it <b>multiplies</b> them, because every amplitude of one has to be paired with every amplitude of the other. 2 × 2 = 4, then 4 × 2 = 8, and so on — while two classical n-bit registers simply make 2n.",
  "Prova a separarlo":
    "Try to separate it",
  "cerca i due qubit che ricostruiscono lo stato — e guarda quando è impossibile":
    "look for the two qubits that rebuild the state — and see when it is impossible",
  "trova i due qubit che lo ricostruiscono":
    "find the two qubits that rebuild it",
  "provaci: poi dichiara che è impossibile":
    "give it a try: then declare it impossible",
  "stati classificati: :fatte su :totali":
    "states classified: :fatte of :totali",
  "lo stato da separare (viola) e il tuo tentativo (azzurro)":
    "the state to separate (purple) and your attempt (blue)",
  "incrocio = 0 → separabile":
    "cross = 0 → separable",
  "incrocio = :i → NON separabile":
    "cross = :i → NOT separable",
  "scarto dal bersaglio: :s":
    "distance from the target: :s",
  "Lo stato":
    "The state",
  "stato :n":
    "state :n",
  "dichiaro: è impossibile":
    "I declare: it is impossible",
  "Incrocio a00·a11 − a01·a10 = <b>:i</b>.":
    "Cross a00·a11 − a01·a10 = <b>:i</b>.",
  "È <b>separabile</b>: esistono due qubit che lo ricostruiscono, ed è la coppia (:a0 ; :a1) con (:b0 ; :b1). Muovi i cursori finché le barrette azzurre non coprono quelle viola.":
    "It is <b>separable</b>: two qubits that rebuild it do exist, and they are the pair (:a0 ; :a1) with (:b0 ; :b1). Move the sliders until the blue bars cover the purple ones.",
  "È <b>entangled</b>: nessuna coppia di qubit lo ricostruisce, e non è una questione di pazienza. Guarda: servirebbe a00·a11 ≠ 0 e insieme a01·a10 = 0 con a01 e a10 che non sono entrambi nulli — cioè due cose che non possono valere insieme. Premi «dichiaro: è impossibile».":
    "It is <b>entangled</b>: no pair of qubits rebuilds it, and it is not a matter of patience. Look: you would need a00·a11 ≠ 0 and at the same time a01·a10 = 0 with a01 and a10 not both zero — that is, two things that cannot hold together. Press «I declare: it is impossible».",
  "Questo però si separa: cercalo ancora, i cursori bastano.":
    "This one does separate, though: keep looking, the sliders are enough.",
  "Ricostruito.":
    "Rebuilt.",
  "<b>Entangled vuol dire «non si scrive come due cose separate».</b> Non «i due qubit comunicano», non «si influenzano a distanza»: vuol dire che lo stato della coppia <b>non si spezza</b> in uno stato del primo e uno del secondo. E si riconosce con un conto solo, a00·a11 − a01·a10 — la stessa riga che al livello :m diceva se due frecce erano indipendenti. La porta che quel numero lo rende diverso da zero è la CNOT del livello :c.":
    "<b>Entangled means «it cannot be written as two separate things».</b> Not «the two qubits communicate», not «they influence each other at a distance»: it means the pair's state <b>does not split</b> into a state of the first and a state of the second. And it is detected by one calculation, a00·a11 − a01·a10 — the same line that at level :m said whether two arrows were independent. The gate that makes that number non-zero is the CNOT of level :c.",
  /* ---------------- livello M·7: probabilità ---------------- */
  "Probabilità sul serio: media, errore, e la prova che il mondo non è classico":
    "Probability for real: mean, error, and the proof the world is not classical",
  "Perché un decimale in più costa cento volte le misure, come si aggiorna quello che si crede, e il test di Bell — quello del Nobel 2022 — giocato con le mani.":
    "Why one more decimal digit costs a hundred times the measurements, how you update what you believe, and the Bell test — the 2022 Nobel one — played by hand.",
  "La media si assesta, ma piano":
    "The mean settles, but slowly",
  "tira, guarda la media avvicinarsi — e guarda quanto costa un decimale in più":
    "throw, watch the mean close in — and watch what one more decimal digit costs",
  "errore atteso sotto :s":
    "expected error below :s",
  "traguardi raggiunti: :fatte su :totali":
    "targets reached: :fatte of :totali",
  "tiri: :n · media: :m · errore atteso σ/√n: :e":
    "throws: :n · mean: :m · expected error σ/√n: :e",
  "la moneta esce 1 con probabilità":
    "the coin comes up 1 with probability",
  "+10 tiri":
    "+10 throws",
  "+100":
    "+100",
  "+1000":
    "+1000",
  "altro traguardo":
    "another target",
  "La moneta vale 1 con probabilità <b>:p</b>. La sua deviazione standard è √(p·(1−p)) = <b>:s</b>.":
    "The coin is worth 1 with probability <b>:p</b>. Its standard deviation is √(p·(1−p)) = <b>:s</b>.",
  "Con <b>:n</b> tiri la media misurata è <b>:m</b> e lo scarto vero dal valore giusto è <b>:d</b>; l'errore che ti aspettavi era σ/√n = <b>:e</b>.":
    "With <b>:n</b> throws the measured mean is <b>:m</b> and the true gap from the right value is <b>:d</b>; the error you expected was σ/√n = <b>:e</b>.",
  "Non hai ancora tirato niente.":
    "You have not thrown anything yet.",
  "Per un errore di :s servono circa <b>:q</b> tiri. Per un decimale in più — cioè dieci volte più preciso — ne servirebbero <b>cento volte tanti</b>.":
    "An error of :s takes about <b>:q</b> throws. For one more decimal digit — ten times more precise — it would take <b>a hundred times as many</b>.",
  "<b>Questa è la riga che al livello :n costa cara.</b> Un computer quantistico non «legge» una probabilità: la stima ripetendo la misura, e l'errore sulla stima scende come 1/√tiri. Un decimale in più costa cento volte le misure. Non è un difetto delle macchine di oggi: è statistica, e vale anche per le macchine perfette di domani.":
    "<b>This is the line that costs dearly at level :n.</b> A quantum computer does not «read» a probability: it estimates it by repeating the measurement, and the error on the estimate falls as 1/√shots. One more decimal digit costs a hundred times the measurements. It is not a flaw of today's machines: it is statistics, and it holds for tomorrow's perfect machines too.",
  "Il gioco di Bell":
    "The Bell game",
  "Anna e Bruno non possono parlarsi: quante domande su quattro riescono a indovinare?":
    "Anna and Bruno cannot talk to each other: how many of the four questions can they get right?",
  "arriva al massimo classico":
    "reach the classical maximum",
  "supera il muro del 75%":
    "break the 75% wall",
  "sfide vinte: :fatte su :totali":
    "challenges won: :fatte of :totali",
  "vinci il :p% delle volte":
    "you win :p% of the time",
  "accordo classico":
    "classical agreement",
  "coppia entangled":
    "entangled pair",
  "Anna, se le chiedono 0: risponde :r":
    "Anna, if asked 0: answers :r",
  "Anna, se le chiedono 1: risponde :r":
    "Anna, if asked 1: answers :r",
  "Bruno, se gli chiedono 0: risponde :r":
    "Bruno, if asked 0: answers :r",
  "Bruno, se gli chiedono 1: risponde :r":
    "Bruno, if asked 1: answers :r",
  "Anna, domanda 0":
    "Anna, question 0",
  "Anna, domanda 1":
    "Anna, question 1",
  "Bruno, domanda 0":
    "Bruno, question 0",
  "Bruno, domanda 1":
    "Bruno, question 1",
  "Anna e Bruno si sono messi d'accordo <b>prima</b>, e poi non possono più parlarsi. Con questa strategia vincono il <b>:p%</b> delle volte.":
    "Anna and Bruno agreed <b>beforehand</b>, and after that they cannot talk. With this strategy they win <b>:p%</b> of the time.",
  "Questo è il massimo. E non è «il massimo che hai trovato»: le strategie possibili sono <b>sedici</b> in tutto, e nessuna supera il 75%. Puoi provarle tutte, ci vogliono due minuti.":
    "This is the maximum. And not «the maximum you found»: the possible strategies are <b>sixteen</b> in all, and none exceeds 75%. You can try them all, it takes two minutes.",
  "Si può fare meglio: prova a cambiare una risposta.":
    "You can do better: try changing one answer.",
  "Anna e Bruno condividono una coppia entangled e misurano ciascuno nella direzione che ha scelto per quella domanda. Vincono il <b>:p%</b>.":
    "Anna and Bruno share an entangled pair and each measures in the direction they chose for that question. They win <b>:p%</b>.",
  "Sopra il 75%. Nessun accordo preso prima può arrivarci: questo è il punto dell'esperimento che ha vinto il Nobel 2022. Il massimo possibile è :m%, cioè cos²(22,5°).":
    "Above 75%. No agreement made beforehand can get there: that is the point of the experiment that won the 2022 Nobel. The best possible is :m%, that is cos²(22.5°).",
  "Ancora sotto il muro classico: prova con Anna a 0° e 45°, Bruno a 22,5° e −22,5°.":
    "Still below the classical wall: try Anna at 0° and 45°, Bruno at 22.5° and −22.5°.",
  "<b>Perché questo esperimento conta.</b> Se le risposte fossero già decise in partenza — cioè se ogni particella «portasse con sé» il risultato di ogni misura possibile — allora si ricadrebbe in una delle sedici strategie, e il tetto sarebbe il 75%. Superarlo, in laboratorio, vuol dire che quelle risposte <b>non erano decise prima</b>. È la cosa più vicina a una dimostrazione sperimentale che il mondo non è classico, e vale il Nobel per la fisica 2022. Nel corso l'hai già incontrata come sfida delle buste, al livello :n.":
    "<b>Why this experiment matters.</b> If the answers were already settled in advance — that is, if every particle «carried with it» the result of every possible measurement — then you would fall back into one of the sixteen strategies, and the ceiling would be 75%. Beating it, in a laboratory, means those answers <b>were not decided beforehand</b>. It is the closest thing to an experimental proof that the world is not classical, and it is worth the 2022 Nobel Prize in Physics. You have already met it in this course as the envelope challenge, at level :n.",
  "valore vero: :p":
    "true value: :p",
  "quadruplicare i tiri dimezza l'errore":
    "four times the throws, half the error",
  "è il √ che sta nella formula σ/√n":
    "that is the √ in the formula σ/√n",
  "Anna :x · Bruno :y → risposte :cosa":
    "Anna :x · Bruno :y → answers :cosa",
  "DIVERSE":
    "DIFFERENT",
  "UGUALI":
    "THE SAME",
  "nessun accordo preso prima supera il 75%":
    "no agreement made beforehand beats 75%",
  "il tetto quantistico è cos²(22,5°) = 85,4%":
    "the quantum ceiling is cos²(22.5°) = 85.4%",
  /* ---------------- livello M·8: successioni e limiti ---------------- */
  "Successioni e limiti: cosa vuol dire davvero «tende a»":
    "Sequences and limits: what «tends to» really means",
  "Il gioco del corridoio, la banca che paga interessi immaginari — e la scoperta che «quanti tiri servono» era già la definizione di limite.":
    "The corridor game, the bank that pays imaginary interest — and the discovery that «how many shots do I need» was already the definition of a limit.",
  "Il gioco del corridoio":
    "The corridor game",
  "io stringo il corridoio, tu dimmi da che punto in poi la successione non esce più":
    "I tighten the corridor, you tell me from which point on the sequence never leaves it",
  "resta nel corridoio ±:e":
    "stay inside the corridor ±:e",
  "corridoi vinti: :fatte su :totali":
    "corridors won: :fatte of :totali",
  "limite :L":
    "limit :L",
  "da N in poi escono ancora :q termini":
    "from N on, :q terms still get out",
  "da N in poi non esce più nessuno":
    "from N on, none of them gets out",
  "questa non tende a niente":
    "this one tends to nothing",
  "da qui in poi":
    "from here on",
  "il più piccolo N che vince":
    "the smallest N that wins",
  "stringi il corridoio":
    "tighten the corridor",
  "La sfida è questa: io scelgo un corridoio largo <b>±:e</b> attorno al limite, tu trovi un <b>N</b> tale che da lì in poi la successione ci resti dentro <b>per sempre</b>. Se ci riesci per ogni corridoio, per quanto stretto, allora quella successione <b>tende</b> a quel numero. Questa è la definizione, tutta qui.":
    "The challenge is this: I pick a corridor <b>±:e</b> wide around the limit, you find an <b>N</b> such that from there on the sequence stays inside <b>forever</b>. If you can do it for every corridor, however narrow, then that sequence <b>tends</b> to that number. That is the definition, all of it.",
  "Questa non ha limite: qualunque N scegli, più avanti la successione torna a scappare. Non è che «non lo hai trovato»: non c'è.":
    "This one has no limit: whatever N you pick, further on the sequence escapes again. It is not that «you have not found it»: there is none.",
  "Qui l'N esiste, ma è <b>:m</b>: fuori da questo grafico. Non è un difetto del gioco — è che questa successione ci mette troppo. Con un corridoio così stretto serve una successione che scenda più in fretta.":
    "Here the N exists, but it is <b>:m</b>: off this chart. It is not a flaw of the game — this sequence simply takes too long. With a corridor this narrow you need a sequence that falls faster.",
  "Da N = :n in poi escono ancora :q termini. Sposta N più a destra.":
    "From N = :n on, :q terms still get out. Move N further right.",
  "✓ Da N = :n in poi la successione non esce più. Il minimo che bastava era <b>:m</b>.":
    "✓ From N = :n on the sequence never gets out again. The smallest one that would do was <b>:m</b>.",
  "Nella finestra che si vede non c'è: o la successione non tende a niente, o il corridoio è così stretto che N finisce fuori dal grafico.":
    "It is not in the window you can see: either the sequence tends to nothing, or the corridor is so narrow that N falls off the chart.",
  "<b>Questo gioco lo hai già giocato al livello :n.</b> Lì la domanda era «quanti tiri servono per stare sotto un certo errore», e la risposta era (σ/errore)². Ecco: quel numero È l'N di questo gioco, per la successione 1/√n. La definizione di limite non è un formalismo da matematici — è la stessa domanda che si fa chi deve decidere quante volte far girare un circuito.":
    "<b>You have already played this game at level :n.</b> There the question was «how many shots to stay under a given error», and the answer was (σ/error)². Well: that number IS the N of this game, for the sequence 1/√n. The definition of a limit is not mathematicians' formalism — it is the same question asked by anyone deciding how many times to run a circuit.",
  "La banca di Bernoulli":
    "Bernoulli's bank",
  "interesse del 100% spezzato in n rate: dove va a finire il capitale?":
    "100% interest split into n instalments: where does the capital end up?",
  "arriva a e a meno di :s":
    "get within :s of e",
  "porta la freccia sul cerchio":
    "bring the arrow onto the circle",
  "prove riuscite: :fatte su :totali":
    "attempts succeeded: :fatte of :totali",
  "rate: :n · capitale: :c":
    "instalments: :n · capital: :c",
  "più rate, più il capitale sale — ma non supera mai e":
    "more instalments, more capital — but never past e",
  "il cerchio dove il capitale non cresce":
    "the circle where the capital does not grow",
  "rate: :n · capitale: :a + :b i · lunghezza: :l":
    "instalments: :n · capital: :a + :b i · length: :l",
  "l'interesse immaginario non fa crescere il capitale: lo fa girare":
    "imaginary interest does not grow the capital: it turns it",
  "interesse vero":
    "real interest",
  "interesse immaginario":
    "imaginary interest",
  "in quante rate":
    "in how many instalments",
  "interesse immaginario θ":
    "imaginary interest θ",
  "Metti 1 in banca al 100% di interesse. Pagato in una volta sola diventa 2. Spezzato in <b>:n</b> rate diventa (1 + 1/:n)^:n = <b>:c</b>: ogni rata è più piccola, ma frutta anche lei.":
    "Put 1 in the bank at 100% interest. Paid all at once it becomes 2. Split into <b>:n</b> instalments it becomes (1 + 1/:n)^:n = <b>:c</b>: each instalment is smaller, but it earns interest too.",
  "Più si spezza, più si guadagna — ma sempre meno. Il capitale non scappa: si ferma a <b>e = 2,718281…</b>, e ne dista ancora :d.":
    "The more you split it, the more you earn — but by less and less. The capital does not run away: it stops at <b>e = 2.718281…</b>, and it is still :d away.",
  "Questo è un limite, ed è il primo numero della storia definito così: non «quanto fa», ma «dove va a finire».":
    "This is a limit, and it is the first number in history defined this way: not «what it equals», but «where it ends up».",
  "Stessa banca, ma l'interesse è <b>i·θ</b>: immaginario. Ogni rata moltiplica per (1 + iθ/n), e moltiplicare per un numero complesso vuol dire <b>allungare e girare</b> — solo che qui l'allungamento è quasi zero e il giro no.":
    "Same bank, but the interest is <b>i·θ</b>: imaginary. Each instalment multiplies by (1 + iθ/n), and multiplying by a complex number means <b>stretch and turn</b> — except that here the stretching is almost zero and the turning is not.",
  "Con <b>:n</b> rate il capitale è <b>:a + :b i</b>, lungo <b>:l</b>. Il punto giusto sul cerchio è (cos θ, sin θ), e ne dista :d.":
    "With <b>:n</b> instalments the capital is <b>:a + :b i</b>, of length <b>:l</b>. The right point on the circle is (cos θ, sin θ), and it is :d away.",
  "Ecco perché e^(iθ) è la freccia girata di θ e non un'altra cosa: è l'unico posto dove quel limite può andare a finire.":
    "This is why e^(iθ) is the arrow turned by θ and not something else: it is the only place that limit can end up.",
  "<b>Serve davvero, e non solo per essere pignoli.</b> Al livello :n si scrive e^(iθ) per «freccia girata di θ», e la giustificazione era che moltiplicando le frecce gli angoli si sommano. Quella è una somiglianza; questo è il conto. E lo stesso limite, con al posto di iθ una matrice, è il modo in cui un computer quantistico simula un sistema fisico: si spezza il tempo in n pezzetti e si applica n volte una porta quasi-identità.":
    "<b>This is genuinely useful, not just fussy.</b> At level :n we write e^(iθ) for «arrow turned by θ», and the justification was that multiplying arrows adds the angles. That is a resemblance; this is the calculation. And the same limit, with a matrix in place of iθ, is how a quantum computer simulates a physical system: time is split into n little pieces and an almost-identity gate is applied n times.",
};
