/* ============================================================
   ENGLISH — interface strings.

   The key is the Italian sentence as it appears in the source: see
   js/core/i18n.js for why. A missing entry falls back to Italian, so
   adding a string to the game never breaks this file — it just leaves
   one sentence untranslated until someone fills it in.

   `npm run lingue` lists what is missing here.
   ============================================================ */

export default {
  /* ---------------- map, parts, ranks ---------------- */
  'Parte 0 — Le basi (per chi parte proprio da zero)': 'Part 0 — The basics (for absolute beginners)',
  'Numeri, percentuali, coordinate, gradi, seno e coseno, probabilità. Per chi ha finito le medie. Facoltativa se le sai già.':
    'Numbers, percentages, coordinates, degrees, sine and cosine, probability. Middle-school level. Optional if you already know it.',
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
  'Mappa': 'Map',
  'Lingua': 'Language',
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
};
