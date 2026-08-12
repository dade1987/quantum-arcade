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
};
