/* ============================================================
   ESPAÑOL — cadenas de la interfaz.

   La clave es la frase italiana tal como aparece en el código fuente:
   en js/core/i18n.js está explicado el porqué. Si falta una entrada, el
   texto vuelve al italiano, así que añadir una cadena al juego nunca
   rompe este archivo: solo deja una frase sin traducir hasta que
   alguien la complete.

   `npm run languages` enumera lo que falta aquí.
   ============================================================ */

export default {
  /* ---------------- mapa, partes, rangos ---------------- */
  'Parte 0 — Le basi (per chi parte proprio da zero)': 'Parte 0 — Las bases (para quien empieza desde cero)',
  "Numeri, percentuali, coordinate, gradi, seno e coseno, probabilità, contare a giri, matrici. Per chi ha finito le medie. Facoltativa se le sai già.":
    "Números, porcentajes, coordenadas, grados, seno y coseno, probabilidad, contar dando vueltas, matrices. Nivel de secundaria. Opcional si ya lo sabes.",
  'Parte A — Il qubit, subito': 'Parte A — El cúbit, ya mismo',
  'Sovrapposizione, misura, porte, entanglement, circuiti. Con ampiezze positive e negative: nessuna matematica difficile.':
    'Superposición, medida, puertas, entrelazamiento, circuitos. Con amplitudes positivas y negativas: nada de matemáticas difíciles.',
  'Parte B — Frecce, fasi e primi algoritmi': 'Parte B — Flechas, fases y primeros algoritmos',
  'Il segno non basta più: arrivano le frecce (numeri complessi). E i primi algoritmi che battono il computer classico.':
    'El signo ya no basta: llegan las flechas (números complejos). Y los primeros algoritmos que ganan al ordenador clásico.',
  "Parte C — Onde e Fourier (l'attrezzo che ci manca)": 'Parte C — Ondas y Fourier (la herramienta que nos falta)',
  'Ora che sappiamo cosa vogliamo fare, impariamo lo strumento: onde, frequenze, trasformata di Fourier.':
    'Ahora que sabemos qué queremos hacer, aprendemos la herramienta: ondas, frecuencias, transformada de Fourier.',
  'Parte D — Il cuore: QFT, Shor e invenzione': 'Parte D — El corazón: QFT, Shor e invención',
  "Tutto si unisce. E alla fine si inventa il proprio algoritmo e si dà l'esame.":
    'Todo encaja. Y al final inventas tu propio algoritmo y te examinas.',

  'Curioso': 'Curioso',
  'Domatore di qubit': 'Domador de cúbits',
  'Signore delle frecce': 'Señor de las flechas',
  'Cacciatore di interferenze': 'Cazador de interferencias',
  'Analista di Fourier': 'Analista de Fourier',
  'Ingegnere di circuiti': 'Ingeniero de circuitos',
  'Cacciatore di periodi': 'Cazador de periodos',
  'Quantum Wizard': 'Quantum Wizard',
  'Inventore di algoritmi': 'Inventor de algoritmos',

  /* ---------------- títulos y resúmenes de los niveles ---------------- */
  'Numeri: negativi, metà, doppi, quadrati': 'Números: negativos, mitades, dobles, cuadrados',
  'Linea dei numeri, percentuali, potenze di 2 e radice quadrata. Tutto giocato.':
    'La recta numérica, porcentajes, potencias de 2 y raíz cuadrada. Todo jugado, no leído.',
  'Griglia, frecce e gradi': 'Cuadrícula, flechas y grados',
  'Coordinate come in battaglia navale e il giro completo di 360°.':
    'Coordenadas como en los barquitos, y la vuelta completa de 360°.',
  'Seno e coseno senza triangoli': 'Seno y coseno sin triángulos',
  'Le due ombre di un punto che gira. Il ponte fra i gradi e le onde.':
    'Las dos sombras de un punto que gira. El puente entre los grados y las ondas.',
  'Il caso: monete, dadi, probabilità': 'El azar: monedas, dados, probabilidad',
  'Lancia, conta, scopri che le percentuali si sistemano da sole.':
    'Lanza, cuenta y descubre que los porcentajes se ordenan solos.',

  "Il qubit: cos'è davvero": 'El cúbit: qué es de verdad',
  'Fotoni, filtri polaroid, ampiezze e la differenza vera con una moneta truccata.':
    'Fotones, filtros polaroid, amplitudes y la diferencia real con una moneda trucada.',
  'La sfera di Bloch e la misura': 'La esfera de Bloch y la medida',
  'Ruota la sfera col mouse, misura, guarda il collasso.':
    'Gira la esfera con el ratón, mide y observa el colapso.',
  'Le porte: X, Z, H e le rotazioni': 'Las puertas: X, Z, H y las rotaciones',
  'Ogni porta è una rotazione. E H·Z·H = X è già mezzo algoritmo.':
    'Cada puerta es una rotación. Y H·Z·H = X ya es medio algoritmo.',
  'Due qubit, CNOT ed entanglement': 'Dos cúbits, CNOT y entrelazamiento',
  'Da 2 ampiezze a 4. Stati di Bell e correlazioni impossibili.':
    'De 2 amplitudes a 4. Estados de Bell y correlaciones imposibles.',
  'Il laboratorio dei circuiti': 'El laboratorio de circuitos',
  'Sandbox: costruisci circuiti a 3 qubit, simula, misura, sperimenta.':
    'Zona libre: construye circuitos de 3 cúbits, simula, mide, experimenta.',
  'No-cloning, teletrasporto e dense coding': 'No-clonación, teletransporte y codificación densa',
  'Perché non puoi copiare un qubit, e cosa puoi fare invece.':
    'Por qué no puedes copiar un cúbit, y qué puedes hacer en su lugar.',

  'Interferenza: quando le possibilità si cancellano': 'Interferencia: cuando las posibilidades se anulan',
  'Il meccanismo unico che sta sotto a ogni algoritmo quantistico.':
    'El único mecanismo que hay debajo de todo algoritmo cuántico.',
  'Le frecce: numeri complessi ed e^{iθ}': 'Las flechas: números complejos y e^{iθ}',
  'Quando il "più o meno" non basta più: fasi intermedie e rotazioni.':
    'Cuando el "más o menos" ya no basta: fases intermedias y rotaciones.',
  'Oracoli e Deutsch–Jozsa': 'Oráculos y Deutsch–Jozsa',
  'Il primo algoritmo che batte il classico: 1 domanda invece di 2^{n−1}+1.':
    'El primer algoritmo que gana al clásico: 1 consulta en vez de 2^{n−1}+1.',
  'Bernstein–Vazirani: la stringa segreta': 'Bernstein–Vazirani: la cadena secreta',
  'Indovina n bit segreti con una sola interrogazione.': 'Adivina n bits secretos con una sola consulta.',
  'Grover: amplificare la risposta giusta': 'Grover: amplificar la respuesta correcta',
  'Guarda le barre delle ampiezze crescere passo dopo passo (e poi ricalare!).':
    'Mira crecer las barras de las amplitudes paso a paso (¡y luego bajar!).',
  'Simon: il periodo nascosto': 'Simon: el periodo escondido',
  'Il primo vantaggio ESPONENZIALE dimostrato. E il ponte diretto verso Shor.':
    'La primera ventaja EXPONENCIAL demostrada. Y el puente directo hacia Shor.',

  "L'onda: ampiezza, periodo, frequenza": 'La onda: amplitud, periodo, frecuencia',
  'Ci serve per il passo successivo. Muovi i cursori e senti cosa cambia.':
    'Nos hace falta para el paso siguiente. Mueve los deslizadores y escucha qué cambia.',
  'La fase delle onde e i battimenti': 'La fase de las ondas y los batidos',
  'La stessa onda, spostata: dalla fase del qubit alla fase delle onde.':
    'La misma onda, desplazada: de la fase del cúbit a la fase de las ondas.',
  'Ogni segnale è una somma di onde': 'Toda señal es una suma de ondas',
  'Sfida: ricostruisci il segnale misterioso mescolando onde semplici.':
    'Reto: reconstruye la señal misteriosa mezclando ondas simples.',
  'La DFT passo passo: il rilevatore di periodicità': 'La DFT paso a paso: el detector de periodicidad',
  'La formula smontata pezzo per pezzo, con le frecce che vedi ruotare.':
    'La fórmula desmontada pieza a pieza, con las flechas girando a la vista.',
  'FFT: perché il computer ci mette N·log N': 'FFT: por qué el ordenador tarda N·log N',
  'Dividi et impera: da N² a N·log N, contato operazione per operazione.':
    'Divide y vencerás: de N² a N·log N, contado operación por operación.',

  'QFT: Fourier sulle ampiezze quantistiche': 'QFT: Fourier sobre las amplitudes cuánticas',
  'Il cuore del corso: dalla DFT al circuito con Hadamard, rotazioni controllate e SWAP.':
    'El corazón del curso: de la DFT al circuito con Hadamard, rotaciones controladas y SWAP.',
  'Quantum Phase Estimation': 'Quantum Phase Estimation',
  'Leggere una fase nascosta come numero binario: la QFT usata al contrario.':
    'Leer una fase escondida como número binario: la QFT usada al revés.',
  'BOSS — Shor: dal periodo ai fattori': 'BOSS — Shor: del periodo a los factores',
  'Fattorizza 15 e 21 con le tue mani: periodo, picchi, frazioni continue, MCD.':
    'Factoriza 15 y 21 con tus propias manos: periodo, picos, fracciones continuas, MCD.',
  "Rumore, decoerenza e correzione d'errore": 'Ruido, decoherencia y corrección de errores',
  'Perché non hai ancora un computer quantistico in tasca. E come si combatte.':
    'Por qué todavía no llevas un ordenador cuántico en el bolsillo. Y cómo se combate.',
  'OFFICINA — inventa il tuo algoritmo': 'TALLER — inventa tu propio algoritmo',
  'Sandbox creativa: monta blocchi, scegli una sfida, misura, batti il tuo record.':
    'Zona libre creativa: monta bloques, elige un reto, mide y bate tu propio récord.',
  'Glossario e mappa completa': 'Glosario y mapa completo',
  "Tutti i termini in una pagina, con il filo che li collega dall'inizio alla fine.":
    'Todos los términos en una página, con el hilo que los une de principio a fin.',
  'ESAME FINALE — attestato di completamento': 'EXAMEN FINAL — certificado de finalización',
  "Tutte le domande del corso, in una volta sola. Dall'80% in su generi il tuo attestato.":
    'Todas las preguntas del curso, de una sola vez. Del 80% para arriba generas tu certificado.',

  /* ---------------- barra superior, mapa, inicio ---------------- */
  'informatica quantistica giocando': 'computación cuántica jugando',
  'Cambia lingua': 'Cambiar idioma',
  'cambia lingua': 'cambiar idioma',
  'Mappa': 'Mapa',
  'percorso': 'ruta',
  'Livello :n': 'Nivel :n',
  'LIVELLO :n': 'NIVEL :n',
  ':fatti/:totali superati': ':fatti/:totali superados',
  'Si apre superando il livello :n': 'Se abre al superar el nivel :n',
  'superato': 'superado',
  'gioca': 'jugar',
  'chiuso': 'cerrado',
  'Sei <b>:grado</b> · :xp XP · :fatti/:totali livelli superati':
    'Eres <b>:grado</b> · :xp XP · :fatti/:totali niveles superados',
  ' — si comincia quando vuoi.': ' — se empieza cuando quieras.',
  'Continua — livello :n: :titolo': 'Continuar — nivel :n: :titolo',
  'Inizia dal livello 1': 'Empieza por el nivel 1',
  'Azzerare tutti i progressi (XP, livelli, quiz, ripasso)?':
    '¿Borrar todo el progreso (XP, niveles, cuestionarios, repaso)?',
  'Qui compariranno le domande dei livelli che hai già giocato, riproposte <b>a distanza di giorni</b>: è il modo più efficace, secondo la ricerca, per non dimenticarle. Gioca un livello e torna qui.':
    'Aquí aparecerán las preguntas de los niveles que ya has jugado, repetidas <b>con días de separación</b>: es la forma más eficaz, según la investigación, de no olvidarlas. Juega un nivel y vuelve aquí.',
  'Nessuna domanda in scadenza. Hai <b>:quante</b> domande nel mazzo: torna fra qualche giorno e te le riproporrò al momento giusto.':
    'No hay nada pendiente. Tienes <b>:quante</b> preguntas en la baraja: vuelve dentro de unos días y te las plantearé en el momento justo.',
  'Ripasso finito. Ottimo lavoro: ogni richiamo a memoria rende il ricordo più solido.':
    'Repaso terminado. Buen trabajo: cada recuerdo evocado deja la memoria más firme.',
  'domanda :i di :totali · dal livello :livello': 'pregunta :i de :totali · del nivel :livello',

  /* ---------------- estructura de la lección ---------------- */
  'Missione': 'Misión',
  'missione': 'misión',
  'completata': 'completada',
  'in corso…': 'en curso…',
  'Controllo rapido': 'Comprobación rápida',
  "Rispondere a memoria — anche sbagliando — fa imparare più che rileggere. Se sbagli, riprova: non c'è nessuna penalità.":
    'Responder de memoria — aunque falles — enseña más que releer. Si te equivocas, inténtalo otra vez: no hay ninguna penalización.',
  'riprova': 'reintentar',
  'risposta esatta': 'respuesta correcta',
  'livello superato': 'nivel superado',
  'Livello superato': 'Nivel superado',
  'Prova di padronanza': 'Prueba de dominio',
  'Hai dimostrato di saperlo <b>fare</b> e di saperlo <b>spiegare</b>. Il livello successivo è sbloccato.':
    'Has demostrado que sabes <b>hacerlo</b> y sabes <b>explicarlo</b>. El nivel siguiente está desbloqueado.',
  'Per sbloccare il livello successivo servono due cose: averlo fatto nel gioco e saperlo richiamare a memoria. Nessuna fretta e nessun punteggio negativo.':
    'Para desbloquear el nivel siguiente hacen falta dos cosas: haberlo hecho en el juego y saber recordarlo de memoria. Sin prisas y sin puntuación negativa.',
  'Missioni completate: <b>:fatte/:totali</b>': 'Misiones completadas: <b>:fatte/:totali</b>',
  'Domande risposte correttamente: <b>:fatte/:totali</b>': 'Preguntas acertadas: <b>:fatte/:totali</b>',
  'Livello di sola lettura: nessuna prova richiesta.': 'Nivel de solo lectura: no hace falta ninguna prueba.',
  'Vai al livello :n: :titolo': 'Ir al nivel :n: :titolo',
  'Sei bloccato? Torna sul mini-gioco del passo corrispondente: la risposta si vede muovendo i cursori. In alternativa, dalla mappa puoi attivare la <b>modalità libera</b> (per adulti curiosi o per rivedere).':
    '¿Atascado? Vuelve al minijuego del paso correspondiente: la respuesta se ve moviendo los deslizadores. Si no, desde el mapa puedes activar el <b>modo libre</b> (para adultos curiosos o para repasar).',
  'non ho capito questo passaggio': 'no he entendido este paso',
  'grazie, segnalato': 'gracias, anotado',
  'Non ho capito il passaggio ":titolo". Me lo rispieghi in modo più semplice, senza formule?':
    'No he entendido el paso ":titolo". ¿Me lo explicas otra vez de forma más sencilla, sin fórmulas?',
  'Livello ancora chiuso': 'Nivel todavía cerrado',
  'Per aprire questo livello devi prima superare la prova del livello <b>:livello</b>. È così apposta: ogni livello usa gli attrezzi costruiti nel precedente, e saltarli rende tutto più difficile del necessario.':
    'Para abrir este nivel primero tienes que superar la prueba del nivel <b>:livello</b>. Es así a propósito: cada nivel usa las herramientas construidas en el anterior, y saltárselos lo vuelve todo más difícil de lo necesario.',
  'Vai al livello richiesto': 'Ir al nivel requerido',
  'Modalità libera (adulti/ripasso)': 'Modo libre (adultos / repaso)',
  'Widget non caricato: :errore': 'No se ha cargado el widget: :errore',
  'Come è fatto questo corso': 'Cómo está hecho este curso',
  'Torna alla mappa': 'Volver al mapa',

  /* ---------------- fórmula y pasos ---------------- */
  'Tocca un pezzo della formula per capire cosa fa.': 'Toca una pieza de la fórmula para ver qué hace.',
  'Fatto!': '¡Hecho!',
  'Avanti': 'Siguiente',
  'passo :i di :totali': 'paso :i de :totali',
  'reale': 'real',
  'immag.': 'imag.',

  /* ---------------- sonido ---------------- */
  'Attiva/disattiva i suoni': 'Activar/desactivar los sonidos',
  'Attiva o disattiva i suoni': 'Activar o desactivar los sonidos',

  /* ---------------- cuenta ---------------- */
  'Entra': 'Entrar',
  'Account': 'Cuenta',
  'solo locale': 'solo local',
  'Backend non raggiungibile: i progressi restano in questo browser':
    'Servidor no accesible: el progreso se queda en este navegador',
  'Email da confermare': 'Correo sin confirmar',
  'Crea il mio account': 'Crear mi cuenta',
  'Crea il tuo account': 'Crea tu cuenta',
  "Nome e cognome servono perché finiscono sull'attestato finale, che è verificabile pubblicamente. Nient'altro ti verrà chiesto.":
    'El nombre y los apellidos hacen falta porque acaban en el certificado final, que cualquiera puede verificar. No se te pedirá nada más.',
  'Nome': 'Nombre',
  'Nome *': 'Nombre *',
  'Cognome': 'Apellidos',
  'Cognome *': 'Apellidos *',
  'Data di nascita': 'Fecha de nacimiento',
  "facoltativa: distingue gli omonimi sull'attestato":
    'opcional: distingue a las personas con el mismo nombre en el certificado',
  'Email': 'Correo electrónico',
  'Email *': 'Correo electrónico *',
  'ti mando un link per confermarla': 'te mando un enlace para confirmarlo',
  'Password': 'Contraseña',
  'Password *': 'Contraseña *',
  'almeno 8 caratteri, con lettere e numeri': 'al menos 8 caracteres, con letras y números',
  'Ripeti password *': 'Repite la contraseña *',
  'Ho letto l\'<a href=":privacy" target="_blank">informativa privacy</a> e accetto il trattamento dei dati per l\'accesso al corso e l\'emissione dell\'attestato.':
    'He leído el <a href=":privacy" target="_blank">aviso de privacidad</a> y acepto el tratamiento de mis datos para acceder al curso y para la emisión del certificado.',
  'Ho già un account': 'Ya tengo una cuenta',
  'Non ho un account': 'No tengo cuenta',
  "Nome e cognome sono obbligatori: senza, l'attestato non si può emettere.":
    'El nombre y los apellidos son obligatorios: sin ellos no se puede emitir el certificado.',
  'Serve la tua email.': 'Hace falta tu correo electrónico.',
  'La password deve avere almeno 8 caratteri.': 'La contraseña debe tener al menos 8 caracteres.',
  'Le due password non coincidono.': 'Las dos contraseñas no coinciden.',
  "Devi accettare l'informativa privacy.": 'Tienes que aceptar el aviso de privacidad.',
  "Creo l'account…": 'Creando la cuenta…',
  'Ci sei!': '¡Ya estás dentro!',
  "Account creato per <b>:nome</b>. Ti ho mandato un'email a <b>:email</b>: confermala quando vuoi — serve per l'attestato, non per giocare.":
    'Cuenta creada para <b>:nome</b>. Te he mandado un correo a <b>:email</b>: confírmalo cuando quieras — hace falta para el certificado, no para jugar.',
  'Comincia a giocare': 'Empieza a jugar',
  "Il server non risponde: se stai aprendo i file in locale senza PHP, l'account non è disponibile.":
    'El servidor no responde: si estás abriendo los archivos en local sin PHP, las cuentas no están disponibles.',
  'Bentornato': 'Bienvenido de nuevo',
  'Scrivi prima la tua email, poi ti mando il link.': 'Escribe primero tu correo y te mando el enlace.',
  'Password dimenticata? Ti mando un link di accesso': '¿Contraseña olvidada? Te mando un enlace de acceso',
  'Servono email e password.': 'Hacen falta el correo y la contraseña.',
  "Email confermata: adesso puoi anche ottenere l'attestato.":
    'Correo confirmado: ahora también puedes obtener el certificado.',
  'Quel link era scaduto o già usato. Accedi con la password, oppure fattene mandare un altro.':
    'Ese enlace había caducado o ya se había usado. Entra con la contraseña, o pide que te manden otro.',
  'Il tuo account': 'Tu cuenta',
  'email confermata': 'correo confirmado',
  'email da confermare': 'correo sin confirmar',
  "<b>Conferma l'email</b> per poter sostenere l'esame e ottenere l'attestato.":
    '<b>Confirma el correo</b> para poder hacer el examen y obtener el certificado.',
  "Rimanda l'email": 'Reenviar el correo',
  'Dati aggiornati.': 'Datos actualizados.',
  'Salva i dati': 'Guardar los datos',
  'Esci': 'Salir',
  'Elimino account, progressi, attestato e conversazioni con il tutor. È definitivo. Procedo?':
    'Se borran la cuenta, el progreso, el certificado y las conversaciones con el tutor. Es definitivo. ¿Sigo adelante?',
  'Elimina tutto': 'Borrarlo todo',
  'Chiudi': 'Cerrar',
  'XP attuali: :xp · i progressi vengono salvati sul server automaticamente.':
    'XP actuales: :xp · el progreso se guarda en el servidor automáticamente.',
  'Serve il tuo account': 'Hace falta tu cuenta',
  "Per giocare <b>:livello</b> devi essere registrato. Non è per raccogliere dati: è perché i progressi si salvano <b>sul server</b> e l'attestato finale riporta nome, cognome e un codice che chiunque può verificare.":
    'Para jugar <b>:livello</b> tienes que estar registrado. No es para recoger datos: es porque el progreso se guarda <b>en el servidor</b> y el certificado final lleva tu nombre, tus apellidos y un código que cualquiera puede verificar.',
  '<b>Ti servono 30 secondi:</b> nome, cognome, email e password.':
    '<b>Te lleva 30 segundos:</b> nombre, apellidos, correo y contraseña.',
  '<b>I progressi ti seguono</b> su computer, tablet e telefono.':
    '<b>Tu progreso te sigue</b> en ordenador, tableta y móvil.',
  '<b>Zero pubblicità, zero profilazione.</b> Puoi cancellare tutto con un click.':
    '<b>Cero publicidad, cero perfilado.</b> Puedes borrarlo todo con un clic.',
  'Crea account (gratis)': 'Crear cuenta (gratis)',
  'Come tratto i dati': 'Cómo trato los datos',
  'giorno': 'día',
  'mese': 'mes',
  'anno': 'año',
  'gennaio': 'enero',
  'febbraio': 'febrero',
  'marzo': 'marzo',
  'aprile': 'abril',
  'maggio': 'mayo',
  'giugno': 'junio',
  'luglio': 'julio',
  'agosto': 'agosto',
  'settembre': 'septiembre',
  'ottobre': 'octubre',
  'novembre': 'noviembre',
  'dicembre': 'diciembre',

  /* ---------------- red ---------------- */
  'Server non raggiungibile': 'Servidor no accesible',
  'Errore :codice': 'Error :codice',
  'Punti esperienza': 'Puntos de experiencia',

  /* ---------------- widgets, pantallas y el tutor ---------------- */
  "  DFT diretta : <span class=\"p\">:quante</span> moltiplicazioni":
    "  DFT directa : <span class=\"p\">:quante</span> multiplicaciones",
  "  FFT         : <span class=\"a\">:quante</span> \"farfalle\"  → :volte× più veloce della DFT":
    "  FFT         : <span class=\"a\">:quante</span> \"mariposas\"  → :volte× más rápida que la DFT",
  "  QFT         : <span class=\"g\">:quante</span> porte quantistiche":
    "  QFT         : <span class=\"g\">:quante</span> puertas cuánticas",
  "\"che lato serve per questa area?\"":
    "\"¿qué lado da esta área?\"",
  "(0° = in fase · 180° = in opposizione)":
    "(0° = en fase · 180° = en oposición)",
  "(:quante per n=:n) — la DFT classica su :N numeri ne farebbe :classiche.":
    "(:quante para n=:n) — la DFT clásica sobre :N números haría :classiche.",
  "(adesso sei a :gradi°, dove il :quale vale :valore)":
    "(ahora estás en :gradi°, donde el :quale vale :valore)",
  "(doppio)":
    "(doble)",
  "(giusto!)":
    "(¡correcto!)",
  "(la FASE)":
    "(la FASE)",
  "(la FASE, giro sull'equatore)":
    "(la FASE, vuelta por el ecuador)",
  "(lunghezza sempre = 1)":
    "(longitud siempre = 1)",
  "(metà)":
    "(mitad)",
  "(mezzo giro)":
    "(media vuelta)",
  "(punto di partenza)":
    "(punto de partida)",
  "(quanto è \"giù\")":
    "(cuánto está \"abajo\")",
  "(regola: probabilità = |ampiezza|², cioè lunghezza della freccia al quadrato)":
    "(regla: probabilidad = |amplitud|², es decir, la longitud de la flecha al cuadrado)",
  "(sempre)":
    "(siempre)",
  "(tre quarti)":
    "(tres cuartos)",
  "(un quarto di giro)":
    "(un cuarto de vuelta)",
  "(vuota — aggiungi blocchi qui sotto)":
    "(vacía — añade bloques aquí abajo)",
  "+3 iterazioni (guarda cosa succede)":
    "+3 iteraciones (mira qué pasa)",
  "1 ciclo":
    "1 ciclo",
  "1 problema da 8":
    "1 problema de 8",
  "1° → 3° (in mezzo): cos²(:gradi°) = :percento%":
    "1.º → 3.º (en medio): cos²(:gradi°) = :percento%",
  "2 moltiplicato per sé stesso :n volte:":
    "2 multiplicado por sí mismo :n veces:",
  "3 cicli":
    "3 ciclos",
  "3° → 2°: cos²(:gradi°) = :percento%":
    "3.º → 2.º: cos²(:gradi°) = :percento%",
  ":lanci lanci — la riga tratteggiata è la probabilità teorica (:percento%)":
    ":lanci lanzamientos — la línea de puntos es la probabilidad teórica (:percento%)",
  ":lanci lanci — tratteggio = teoria (:percento%)":
    ":lanci lanzamientos — puntos = teoría (:percento%)",
  ":medi tentativi in media, :peggiore nel caso peggiore":
    ":medi intentos de media, :peggiore en el peor caso",
  ":n qubit → :quante possibilità contemporanee":
    ":n cúbits → :quante posibilidades simultáneas",
  ":passi passi a DESTRA":
    ":passi pasos a la DERECHA",
  ":passi passi a SINISTRA":
    ":passi pasos a la IZQUIERDA",
  ":passi passi in GIÙ":
    ":passi pasos ABAJO",
  ":passi passi in SU":
    ":passi pasos ARRIBA",
  ":quante frecce, ognuna lunga 1":
    ":quante flechas, cada una de longitud 1",
  ":quante interrogazioni":
    ":quante consultas",
  ":quante interrogazioni nel caso peggiore":
    ":quante consultas en el peor caso",
  ":quante misure":
    ":quante medidas",
  ":quante onde sommate (armoniche dispari fino a :max)":
    ":quante ondas sumadas (armónicos impares hasta :max)",
  ":quanti problemi da :quanto":
    ":quanti problemas de :quanto",
  ":quanti qubit → :valori valori":
    ":quanti cúbits → :valori valores",
  "<b>:esatte/:totali</b> risposte esatte (:percento%) in circa :minuti minuti.":
    "<b>:esatte/:totali</b> respuestas correctas (:percento%) en unos :minuti minutos.",
  "<b>ATTENZIONE al trucco:</b> la FFT ti restituisce <b>tutti</b> i :N numeri, e li puoi leggere.":
    "<b>OJO CON LA TRAMPA:</b> la FFT te devuelve <b>todos</b> los :N números, y puedes leerlos.",
  "<b>Adesso il nome:</b> quello che hai appena mosso si chiama <b>ampiezza</b>, e l'area del quadrato — cioè l'ampiezza moltiplicata per sé stessa — è la <b>probabilità</b> di ottenere quel risultato quando misuri. Si scrive <code>|ampiezza|²</code>: sono le stesse tre cose che hai davanti, scritte corte.":
    "<b>Ahora el nombre:</b> lo que acabas de mover se llama <b>amplitud</b>, y el área del cuadrado — la amplitud multiplicada por sí misma — es la <b>probabilidad</b> de obtener ese resultado al medir. Se escribe <code>|amplitud|²</code>: son las mismas tres cosas que tienes delante, escritas corto.",
  "<b>Attenzione a cosa NON è:</b> nessuna materia si sposta e nessuna informazione viaggia più veloce della luce — servono i due <b>bit classici</b> telefonati a Bob, che viaggiano normalmente. E lo stato di partenza viene <b>distrutto</b> dalla misura: è un trasferimento, non una fotocopia. Il teorema di <b>no-cloning</b> resta salvo.":
    "<b>Cuidado con lo que NO es:</b> no se desplaza materia y ninguna información viaja más rápido que la luz — hacen falta los dos <b>bits clásicos</b> que se le dictan a Bob, y esos viajan normalmente. Y el estado de partida queda <b>destruido</b> por la medida: es una transferencia, no una fotocopia. El teorema de <b>no-clonación</b> sigue en pie.",
  "<b>Attenzione al tranello:</b> con pochi lanci le percentuali ballano parecchio. Nel corso misureremo i qubit centinaia di volte proprio per questo: una misura sola non dice quasi nulla, tante misure disegnano la forma della probabilità.":
    "<b>Cuidado con la trampa:</b> con pocos lanzamientos los porcentajes bailan mucho. Por eso en el curso mediremos los cúbits cientos de veces: una sola medida no dice casi nada, muchas medidas dibujan la forma de la probabilidad.",
  "<b>Bersaglio:</b> ampiezza :a · frequenza :f · fase :p":
    "<b>Objetivo:</b> amplitud :a · frecuencia :f · fase :p",
  "<b>DOPO la QFT</b> — restano solo i multipli di N/r":
    "<b>DESPUÉS de la QFT</b> — solo quedan los múltiplos de N/r",
  "<b>Da notare:</b> \"×2\" è un salto che raddoppia la distanza da zero, \"÷2\" la dimezza, \"×(−1)\" ti ribalta dall'altra parte. Fra poco useremo le stesse tre mosse su una <b>freccia</b> invece che su un punto: raddoppiarla, dimezzarla, girarla dall'altra parte.":
    "<b>Fíjate:</b> \"×2\" es un salto que duplica la distancia al cero, \"÷2\" la reduce a la mitad, \"×(−1)\" te da la vuelta al otro lado. Dentro de poco usaremos esos mismos tres movimientos sobre una <b>flecha</b> en vez de sobre un punto: duplicarla, partirla por la mitad, darle la vuelta.",
  "<b>Da provare:</b> metti r = 4 e muovi lo sfasamento da 0 a 3. Le barre in alto si spostano tutte… e quelle in basso restano identiche. Questa è l'invarianza che rende utilizzabile il risultato di una misura casuale.":
    "<b>Para probar:</b> pon r = 4 y mueve el desfase de 0 a 3. Las barras de arriba se desplazan todas… y las de abajo quedan idénticas. Esa invariancia es lo que hace utilizable el resultado de una medida al azar.",
  "<b>Da qui nasce tutto:</b> se il punto continua a girare, la sua altezza disegna un'<b>onda</b> (il seno) e la sua ombra ne disegna un'altra (il coseno), identica ma <b>spostata di 90°</b>. Questa è la definizione di onda che useremo nel livello 1.":
    "<b>De aquí nace todo:</b> si el punto sigue girando, su altura dibuja una <b>onda</b> (el seno) y su sombra dibuja otra (el coseno), idéntica pero <b>desplazada 90°</b>. Esa es la definición de onda que usaremos en el nivel 1.",
  "<b>Da ricordare:</b> e^{iθ} non è un numero \"strano\", è solo <b>la freccia lunga 1 che punta all'angolo θ</b>. La sua ombra orizzontale è il coseno, quella verticale è il seno.":
    "<b>Para recordar:</b> e^{iθ} no es un número \"raro\", es solo <b>la flecha de longitud 1 que apunta al ángulo θ</b>. Su sombra horizontal es el coseno, la vertical el seno.",
  "<b>Il confronto:</b> classicamente, nel caso peggiore, servono <b>:quante</b> domande per esserne certi. Quantisticamente ne basta <b>1</b>. Non perché il computer \"provi tutti i casi in parallelo e li legga\", ma perché l'oracolo scrive la risposta nelle <b>fasi</b> e le Hadamard finali fanno cancellare tutto tranne l'informazione che ci interessa.":
    "<b>La comparación:</b> clásicamente, en el peor caso, hacen falta <b>:quante</b> preguntas para estar seguro. Cuánticamente basta <b>1</b>. No porque el ordenador \"pruebe todos los casos en paralelo y los lea\", sino porque el oráculo escribe la respuesta en las <b>fases</b> y las Hadamard finales cancelan todo salvo la información que nos interesa.",
  "<b>Il conto che conta:</b> classicamente, per trovare un elemento fra :N servono in media :medi tentativi. Grover ne usa circa <b>√:N = :radice</b>. Non è esponenziale come Shor: è un guadagno \"quadratico\", ma vale per <b>qualsiasi</b> ricerca senza struttura.":
    "<b>La cuenta que importa:</b> clásicamente, encontrar un elemento entre :N cuesta de media :medi intentos. Grover usa unos <b>√:N = :radice</b>. No es exponencial como Shor: es una ganancia \"cuadrática\", pero vale para <b>cualquier</b> búsqueda sin estructura.",
  "<b>Manca solo la conferma dell'email.</b> Ti ho mandato un link quando ti sei registrato: cliccalo e torna qui. Serve perché l'attestato riporta i tuoi dati e deve essere collegato a un indirizzo reale.":
    "<b>Solo falta confirmar el correo.</b> Te mandé un enlace al registrarte: haz clic y vuelve aquí. Hace falta porque el certificado lleva tus datos y tiene que estar ligado a una dirección real.",
  "<b>Nota fondamentale:</b> due stati possono avere le <b>stesse probabilità</b> ma <b>fase diversa</b> (stessa altezza sulla sfera, punto diverso sull'equatore). Le probabilità non li distinguono, ma un'altra porta H sì: è lì che vive tutta la potenza quantistica.":
    "<b>Nota fundamental:</b> dos estados pueden tener las <b>mismas probabilidades</b> pero <b>fase distinta</b> (misma altura en la esfera, punto distinto del ecuador). Las probabilidades no los distinguen, pero otra puerta H sí: ahí vive toda la potencia cuántica.",
  "<b>PRIMA</b> — lo stato \"a pettine\": ampiezze diverse da zero ogni r posizioni":
    "<b>ANTES</b> — el estado \"en peine\": amplitudes distintas de cero cada r posiciones",
  "<b>Per sostenere l'esame serve il tuo account.</b> Le domande vengono dal server e la correzione la fa il server: è così che l'attestato diventa verificabile da chiunque, invece di essere un'immagine che ognuno può fabbricarsi.":
    "<b>Para hacer el examen hace falta tu cuenta.</b> Las preguntas vienen del servidor y el servidor las corrige: así el certificado es verificable por cualquiera, en vez de ser una imagen que cada cual puede fabricarse.",
  "<b>Perché ci serve:</b> nel corso, \"fase\" vorrà dire esattamente questo — <b>a che punto del giro sei</b>. E 360° sarà sempre uguale a 0°, perché dopo un giro completo sei tornato al punto di partenza.":
    "<b>Por qué nos hace falta:</b> en el curso, \"fase\" querrá decir exactamente esto — <b>en qué punto de la vuelta estás</b>. Y 360° será siempre igual a 0°, porque tras una vuelta completa has vuelto al punto de partida.",
  "<b>Perché ci servirà:</b> nel quantistico ogni possibilità ha una \"freccia\" (l'ampiezza) e la probabilità di vederla è <b>l'area del suo quadrato</b>. Ampiezza 0,7 → probabilità 0,49 ≈ 50%. Ampiezza 1/√2 ≈ 0,71 → probabilità esattamente 0,5.":
    "<b>Por qué nos hará falta:</b> en lo cuántico cada posibilidad tiene una \"flecha\" (la amplitud) y la probabilidad de verla es <b>el área de su cuadrado</b>. Amplitud 0,7 → probabilidad 0,49 ≈ 50%. Amplitud 1/√2 ≈ 0,71 → probabilidad exactamente 0,5.",
  "<b>Perché serve la parte quantistica:</b> trovare il periodo di a^x mod N classicamente costa tempo esponenziale nel numero di cifre di N. La QFT lo trasforma in picchi misurabili con un numero di operazioni polinomiale. Tutto il resto di Shor (MCD, frazioni continue) è matematica classica dell'Ottocento.":
    "<b>Por qué hace falta la parte cuántica:</b> encontrar el periodo de a^x mod N clásicamente cuesta un tiempo exponencial en el número de cifras de N. La QFT lo convierte en picos medibles con un número polinómico de operaciones. Todo lo demás de Shor (MCD, fracciones continuas) es matemática clásica del siglo XIX.",
  "<b>Perché una misura sola dà un'equazione:</b> dopo l'oracolo i due soli ingressi rimasti sono x₀ e x₀⊕s. Le Hadamard finali li fanno interferire, e le y per cui <b>y·s = 1</b> ricevono due contributi opposti che si <b>cancellano</b>. Sopravvivono solo le y con <b>y·s = 0</b>: ogni misura è una riga di un sistema lineare, e con n−1 righe indipendenti il periodo è tuo.":
    "<b>Por qué una sola medida da una ecuación:</b> tras el oráculo los dos únicos entradas que quedan son x₀ y x₀⊕s. Las Hadamard finales los hacen interferir, y las y con <b>y·s = 1</b> reciben dos contribuciones opuestas que se <b>cancelan</b>. Solo sobreviven las y con <b>y·s = 0</b>: cada medida es una fila de un sistema lineal, y con n−1 filas independientes el periodo es tuyo.",
  "<b>Perché?</b> Dopo la prima H il qubit non è \"0 oppure 1 con il 50%\": è <b>entrambi con due ampiezze</b>.":
    "<b>¿Por qué?</b> Tras la primera H el cúbit no es \"0 o 1 al 50%\": es <b>ambos, con dos amplitudes</b>.",
  "<b>Prova la ricetta di Bell:</b> premi <b>H q0</b> e poi <b>CNOT q0→q1</b>. Ottieni |00⟩ + |11⟩: quando misuri, i due qubit escono <b>sempre uguali</b>, anche se prima nessuno dei due aveva un valore. Nota che le due sfere di Bloch si accorciano fino a sparire: l'informazione non è più nei singoli qubit, è <b>nella coppia</b>.":
    "<b>Prueba la receta de Bell:</b> pulsa <b>H q0</b> y luego <b>CNOT q0→q1</b>. Obtienes |00⟩ + |11⟩: al medir, los dos cúbits salen <b>siempre iguales</b>, aunque antes ninguno de los dos tenía un valor. Fíjate en que las dos esferas de Bloch se acortan hasta desaparecer: la información ya no está en los cúbits sueltos, está <b>en la pareja</b>.",
  "<b>Prova:</b> muovi solo φ. Le probabilità NON cambiano… ma lo stato sì. Quella differenza invisibile è ciò che la prossima porta userà.":
    "<b>Pruébalo:</b> mueve solo φ. Las probabilidades NO cambian… pero el estado sí. Esa diferencia invisible es lo que usará la puerta siguiente.",
  "<b>Regola d'oro dell'officina:</b> ogni algoritmo quantistico utile ha la stessa forma — <b>metti tutto in gioco</b> (H), <b>scrivi l'informazione nelle fasi</b> (oracolo), <b>fai interferire</b> (diffusore, QFT), <b>misura</b>. Quello che cambia è solo il terzo passo. Se inventi un terzo passo nuovo, hai inventato un algoritmo.":
    "<b>Regla de oro del taller:</b> todo algoritmo cuántico útil tiene la misma forma — <b>pon todo en juego</b> (H), <b>escribe la información en las fases</b> (oráculo), <b>haz interferir</b> (difusor, QFT), <b>mide</b>. Lo único que cambia es el tercer paso. Si inventas un tercer paso nuevo, has inventado un algoritmo.",
  "<b>⚛️ QUBIT</b> — applichi H due volte":
    "<b>⚛️ CÚBIT</b> — aplicas H dos veces",
  "<b>🪙 MONETA CLASSICA</b> — la mescoli due volte":
    "<b>🪙 MONEDA CLÁSICA</b> — la mezclas dos veces",
  "A 90°":
    "A 90°",
  "A <b>:gradi°</b>:  coseno = <span class=\"a\">:coseno</span>   ·   seno = <span class=\"g\">:seno</span>":
    "A <b>:gradi°</b>:  coseno = <span class=\"a\">:coseno</span>   ·   seno = <span class=\"g\">:seno</span>",
  "A cosa serve davvero la QFT?":
    "¿Para qué sirve realmente la QFT?",
  "ALLINEAMENTO PERFETTO":
    "ALINEACIÓN PERFECTA",
  "AREA":
    "ÁREA",
  "Adesso il bicchiere è pieno per <b>:percento%</b> = <b>:decimale</b> = <b>:frazione</b>":
    "Ahora el vaso está lleno al <b>:percento%</b> = <b>:decimale</b> = <b>:frazione</b>",
  "Adesso la domanda vera: <b>riesci a farcela con meno?</b> Cambia pipeline e riprova.":
    "Ahora la pregunta de verdad: <b>¿puedes hacerlo con menos?</b> Cambia la secuencia y vuelve a probar.",
  "Aggiungendo un filtro la luce passa DI PIÙ, non di meno!":
    "¡Añadiendo un filtro pasa MÁS luz, no menos!",
  "Aggiungere un qubit di lettura <b>raddoppia la precisione</b>: da :prima a :dopo.":
    "Añadir un cúbit de lectura <b>duplica la precisión</b>: de :prima a :dopo.",
  "Alice \"mescola\" il suo qubit con la sua metà della coppia: CNOT q0→q1.":
    "Alice \"mezcla\" su cúbit con su mitad de la pareja: CNOT q0→q1.",
  "Alice MISURA q0 e q1: ottiene due bit classici. Il suo stato originale è ormai distrutto.":
    "Alice MIDE q0 y q1: obtiene dos bits clásicos. Su estado original ya está destruido.",
  "Alice applica H su q0.":
    "Alice aplica H sobre q0.",
  "Alice telefona a Bob e gli detta i due bit. Bob applica le correzioni (X e/o Z) su q2.":
    "Alice llama a Bob y le dicta los dos bits. Bob aplica las correcciones (X y/o Z) sobre q2.",
  "Ampiezza <b>A</b>":
    "Amplitud <b>A</b>",
  "Ampiezza <b>A</b> — quanto è \"alta\" l'onda":
    "Amplitud <b>A</b> — cuánto de \"alta\" es la onda",
  "Ampiezza <b>B</b>":
    "Amplitud <b>B</b>",
  "Anche una forma con gli <b>spigoli</b> si ottiene sommando onde tonde. Servono infinite onde per farla perfetta, ma con 10 ci siamo quasi. Formula: onda quadra = (4/π)·[sin(2πt) + ⅓sin(6πt) + ⅕sin(10πt) + …]":
    "Incluso una forma con <b>esquinas</b> se obtiene sumando ondas redondas. Hacen falta infinitas para que salga perfecta, pero con 10 ya casi estamos. Fórmula: onda cuadrada = (4/π)·[sin(2πt) + ⅓sin(6πt) + ⅕sin(10πt) + …]",
  "Angoli: il giro completo è 360°":
    "Ángulos: la vuelta completa son 360°",
  "Angolo":
    "Ángulo",
  "Angolo <b>θ</b>":
    "Ángulo <b>θ</b>",
  "Appena applicata:":
    "Recién aplicada:",
  "Armoniche usate":
    "Armónicos usados",
  "Arrotola il segnale attorno al cerchio":
    "Enrolla la señal alrededor del círculo",
  "Ascolta questa frequenza":
    "Escucha esta frecuencia",
  "Attestato di completamento del corso":
    "Certificado de finalización del curso",
  "Attestato di completamento rilasciato dall'autore del corso. Non costituisce una certificazione accreditata da un ente terzo.":
    "Certificado de finalización emitido por el autor del curso. No constituye una certificación acreditada por un tercero.",
  "C'è una funzione segreta f che dà 0 o 1 per ognuno degli :N ingressi. O è <b>costante</b> (sempre lo stesso valore) o è <b>bilanciata</b> (metà 0 e metà 1). Scopri quale.":
    "Hay una función secreta f que da 0 o 1 para cada una de las :N entradas. O es <b>constante</b> (siempre el mismo valor) o es <b>equilibrada</b> (mitad 0 y mitad 1). Averigua cuál.",
  "C'è una stringa segreta <b>s</b> di :n bit. La funzione risponde f(x) = s·x mod 2 (parità dei bit in comune). Trova s.":
    "Hay una cadena secreta <b>s</b> de :n bits. La función responde f(x) = s·x mod 2 (paridad de los bits en común). Encuentra s.",
  "CANCELLAZIONE":
    "CANCELACIÓN",
  "CENTRATO in :mosse mosse!":
    "¡EN EL BLANCO en :mosse movimientos!",
  "CENTRATO!":
    "¡EN EL BLANCO!",
  "COLPITO! (:fatti/:totali)":
    "¡TOCADO! (:fatti/:totali)",
  "CROCE":
    "CRUZ",
  "Cambia segno solo allo stato tutto-zero.":
    "Cambia el signo solo al estado todo-ceros.",
  "Carico le domande…":
    "Cargando las preguntas…",
  "Cerchi il lato che dà area :area: la risposta è √:area = <b>:lato</b>.":
    "Buscas el lado que da área :area: la respuesta es √:area = <b>:lato</b>.",
  "Chiedi al tutor":
    "Pregunta al tutor",
  "Chiedimi qualsiasi cosa sul corso…":
    "Pregúntame lo que quieras del curso…",
  "Ciao! Sono il tutor di Quantum Arcade. Rispondo usando i contenuti del corso e ti dico sempre in quale livello trovi la spiegazione completa.\n\nUna regola: se mi chiedi la soluzione di una missione ti do un **indizio**, non la risposta. Serve a te, fidati.":
    "¡Hola! Soy el tutor de Quantum Arcade. Respondo usando los contenidos del curso y siempre te digo en qué nivel está la explicación completa.\n\nUna regla: si me pides la solución de una misión te doy una **pista**, no la respuesta. Es por tu bien, confía en mí.",
  "Circuito finito.":
    "Circuito terminado.",
  "Classicamente devi chiedere un bit alla volta: f(001), f(010), f(100)… → servono <b>:quante</b> domande. Ne hai fatte <b>:fatte</b>.":
    "Clásicamente tienes que preguntar bit a bit: f(001), f(010), f(100)… → hacen falta <b>:quante</b> preguntas. Has hecho <b>:fatte</b>.",
  "Codice":
    "Código",
  "Collisione trovata: f(:a) = f(:b) → ":
    "Colisión encontrada: f(:a) = f(:b) → ",
  "Con 20 qubit un computer quantistico maneggia più di un milione di ampiezze insieme.":
    "Con 20 cúbits un ordenador cuántico maneja más de un millón de amplitudes a la vez.",
  "Con :n bit il vantaggio non si vede — ed è giusto così: il punto non è quante domande servono <b>adesso</b>, ma <b>come crescono i due numeri</b>. Con 40 bit: classicamente ~1.048.576 domande, quantisticamente ~39. Con 80 bit il computer classico non finisce prima della fine dell'universo.":
    "Con :n bits la ventaja no se ve — y está bien así: la cuestión no es cuántas preguntas hacen falta <b>ahora</b>, sino <b>cómo crecen los dos números</b>. Con 40 bits: clásicamente ~1.048.576 preguntas, cuánticamente ~39. Con 80 bits el ordenador clásico no termina antes del fin del universo.",
  "Con :quante domande hai già la risposta: BILANCIATA (hai visto sia 0 sia 1).":
    "Con :quante preguntas ya tienes la respuesta: EQUILIBRADA (has visto tanto 0 como 1).",
  "Con <b>:N</b> valori:":
    "Con <b>:N</b> valores:",
  "Con <b>n bit</b> classici puoi rappresentare uno solo di 2^n valori alla volta. Con <b>n qubit</b> lo stato è descritto da <b>tutte</b> le 2^n ampiezze insieme. Questa singola riga è il motivo per cui l'informatica quantistica esiste.":
    "Con <b>n bits</b> clásicos puedes representar uno solo de 2^n valores a la vez. Con <b>n cúbits</b> el estado lo describen <b>todas</b> las 2^n amplitudes juntas. Esa única línea es la razón por la que existe la computación cuántica.",
  "Con queste equazioni il sistema ha ancora :quante soluzioni: serve un'altra interrogazione.":
    "Con estas ecuaciones el sistema todavía tiene :quante soluciones: hace falta otra consulta.",
  "Con una sola interrogazione quantistica":
    "Con una sola consulta cuántica",
  "Consiglio: non rileggere il corso adesso. Rispondere a memoria — anche sbagliando — fissa i concetti molto più del ripasso passivo.":
    "Un consejo: no releas el curso ahora. Responder de memoria — aunque falles — fija los conceptos mucho más que el repaso pasivo.",
  "Conto \"a mano\":":
    "La cuenta \"a mano\":",
  "Conto \"con le frecce\": lunghezze <b>si moltiplicano</b>, angoli <b>si sommano</b>. Stesso risultato, molto meno fatica.":
    "La cuenta \"con flechas\": las longitudes <b>se multiplican</b>, los ángulos <b>se suman</b>. Mismo resultado, mucho menos esfuerzo.",
  "Coordinate: (x, y)":
    "Coordenadas: (x, y)",
  "Correggo…":
    "Corrigiendo…",
  "Correzione domanda per domanda":
    "Corrección pregunta a pregunta",
  "Cos'è un qubit, in due righe?":
    "¿Qué es un cúbit, en dos líneas?",
  "Cosa fa esattamente H":
    "Qué hace exactamente H",
  "Costante o bilanciata?":
    "¿Constante o equilibrada?",
  "Costruisci il tuo qubit":
    "Construye tu cúbit",
  "Crea account e fai l'esame":
    "Crea una cuenta y haz el examen",
  "DFT diretta (la formula)":
    "DFT directa (la fórmula)",
  "Da dove comincio?":
    "¿Por dónde empiezo?",
  "Differenza fra i due filtri: :gradi° → cos²(:gradi°) = <b>:percento%</b>":
    "Diferencia entre los dos filtros: :gradi° → cos²(:gradi°) = <b>:percento%</b>",
  "Diffusore":
    "Difusor",
  "Disordine (0° = tutte uguali)":
    "Desorden (0° = todas iguales)",
  "Dividi e conquista":
    "Divide y vencerás",
  "Dopo <b>:lanci</b> lanci, lo scostamento massimo dalla teoria è <b>:errore%</b>":
    "Tras <b>:lanci</b> lanzamientos, la mayor desviación respecto a la teoría es <b>:errore%</b>",
  "Dopo la QFT i picchi sono in:":
    "Tras la QFT los picos están en:",
  "Due onde, una somma":
    "Dos ondas, una suma",
  "Due qubit":
    "Dos cúbits",
  "ESATTO":
    "CORRECTO",
  "Ecco perché \"raddoppiare ogni volta\" fa numeri assurdi in fretta.":
    "Por eso \"duplicar cada vez\" da números absurdos tan rápido.",
  "Elemento da trovare":
    "Elemento a encontrar",
  "Equazioni raccolte: :elenco":
    "Ecuaciones recogidas: :elenco",
  "Esame finale":
    "Examen final",
  "Esame superato!":
    "¡Examen superado!",
  "Esegui passo per passo":
    "Ejecuta paso a paso",
  "FFT (algoritmo classico veloce)":
    "FFT (algoritmo clásico rápido)",
  "Fai altri lanci e guarda le barre avvicinarsi alla riga tratteggiata.":
    "Haz más lanzamientos y mira cómo las barras se acercan a la línea de puntos.",
  "Fase <b>A</b>":
    "Fase <b>A</b>",
  "Fase <b>B</b>":
    "Fase <b>B</b>",
  "Fase <b>φ</b> — di quanto è spostata":
    "Fase <b>φ</b> — cuánto está desplazada",
  "Fase nascosta <b>φ</b> (da 0 a 1)":
    "Fase escondida <b>φ</b> (de 0 a 1)",
  "Fatto: il qubit di Bob è ORA esattamente lo stato di partenza.":
    "Hecho: el cúbit de Bob es AHORA exactamente el estado de partida.",
  "Filtri incrociati (90°): non passa NIENTE.":
    "Filtros cruzados (90°): no pasa NADA.",
  "Filtro 1":
    "Filtro 1",
  "Filtro finale":
    "Filtro final",
  "Filtro in mezzo":
    "Filtro de en medio",
  "Finora tutte uguali: potrebbe essere costante, ma per esserne <b>sicuro</b> nel caso peggiore ti servono :quante domande.":
    "Hasta ahora todas iguales: podría ser constante, pero para estar <b>seguro</b> en el peor caso necesitas :quante preguntas.",
  "Fondamentale:":
    "Fundamental:",
  "Fotoni e filtri polaroid":
    "Fotones y filtros polaroid",
  "Frazioni = decimali = percentuali":
    "Fracciones = decimales = porcentajes",
  "Frequenza <b>A</b>":
    "Frecuencia <b>A</b>",
  "Frequenza <b>B</b>":
    "Frecuencia <b>B</b>",
  "Frequenza <b>f</b> — quanti cicli al secondo":
    "Frecuencia <b>f</b> — cuántos ciclos por segundo",
  "Frequenza da testare <b>k</b> (cicli sull'intera finestra)":
    "Frecuencia a probar <b>k</b> (ciclos en toda la ventana)",
  "Funzione segreta su <b>:N</b> ingressi (:n qubit).":
    "Función secreta sobre <b>:N</b> entradas (:n cúbits).",
  "GHZ (3 qubit)":
    "GHZ (3 cúbits)",
  "Grover: la ricerca amplificata":
    "Grover: la búsqueda amplificada",
  "Guarda l'istogramma: cosa avresti dovuto leggere?":
    "Mira el histograma: ¿qué deberías haber leído?",
  "H su tutti":
    "H en todos",
  "Hadamard: crea (e disfa) la sovrapposizione.":
    "Hadamard: crea (y deshace) la superposición.",
  "Hadamard: crea sovrapposizione":
    "Hadamard: crea superposición",
  "Hai misurato <b>:bit</b> (probabilità era :p). Lo stato è <b>collassato</b> su |:bit⟩: la sovrapposizione è persa.":
    "Has medido <b>:bit</b> (la probabilidad era :p). El estado ha <b>colapsado</b> en |:bit⟩: la superposición se ha perdido.",
  "Hai superato l'ottimo: continuando, la probabilità RICALA. Grover non è \"più giri = meglio\": è una rotazione che, se esageri, ti porta oltre il bersaglio.":
    "Has pasado el óptimo: si sigues, la probabilidad VUELVE A BAJAR. Grover no es \"más vueltas = mejor\": es una rotación que, si te pasas, te lleva más allá del objetivo.",
  "H·H = identità":
    "H·H = identidad",
  "INTERFERENZA COSTRUTTIVA — si sommano!":
    "INTERFERENCIA CONSTRUCTIVA — ¡se suman!",
  "INTERFERENZA DISTRUTTIVA — si annullano!":
    "INTERFERENCIA DESTRUCTIVA — ¡se anulan!",
  "Il coseno è quanto sei spostato a <b>destra</b>, il seno quanto sei <b>in alto</b>. Entrambi stanno sempre fra −1 e +1.":
    "El coseno es cuánto estás desplazado a la <b>derecha</b>, el seno cuánto estás <b>arriba</b>. Ambos están siempre entre −1 y +1.",
  "Il giro completo = un periodo":
    "La vuelta completa = un periodo",
  "Il lato è cresciuto di poco, l'area di molto: è questo che vuol dire \"al quadrato\".":
    "El lado ha crecido poco, el área mucho: eso es lo que significa \"al cuadrado\".",
  "Il nome sull'attestato è quello del tuo profilo. Se è sbagliato, correggilo nel pannello account e riscarica il PDF.":
    "El nombre del certificado es el de tu perfil. Si está mal, corrígelo en el panel de cuenta y vuelve a descargar el PDF.",
  "Il periodo vero è r = :r (qui lo sappiamo perché stiamo simulando: il computer quantistico NON lo sa).":
    "El periodo verdadero es r = :r (aquí lo sabemos porque estamos simulando: el ordenador cuántico NO lo sabe).",
  "Il segreto <b>s</b> ha :n bit.":
    "El secreto <b>s</b> tiene :n bits.",
  "Il segreto era <b>:segreto</b> → :esito":
    "El secreto era <b>:segreto</b> → :esito",
  "Il tuo punto: <b>x = :x</b>, <b>y = :y</b>":
    "Tu punto: <b>x = :x</b>, <b>y = :y</b>",
  "Il tuo qubit":
    "Tu cúbit",
  "Il tutor non è ancora configurato su questo server.":
    "El tutor todavía no está configurado en este servidor.",
  "In fase (0°)":
    "En fase (0°)",
  "Indipendenti: <b>:rango</b> su :servono necessarie — ":
    "Independientes: <b>:rango</b> de las :servono necesarias — ",
  "Indizio: il bersaglio è :orizzontale e :verticale.":
    "Pista: el objetivo está :orizzontale y :verticale.",
  "Inizia l'esame":
    "Empieza el examen",
  "Interroga la funzione segreta: mette l'informazione nelle fasi. Ogni uso costa 1 query!":
    "Consulta la función secreta: pone la información en las fases. ¡Cada uso cuesta 1 consulta!",
  "Interrogazioni dell'oracolo usate: <b>:quante</b>":
    "Consultas al oráculo usadas: <b>:quante</b>",
  "Invia":
    "Enviar",
  "L'esame copre tutto il corso. <b>Nessun limite di tempo</b>, nessuna penalità, puoi rifarlo quante volte vuoi. Durante l'esame non ricevi la correzione: la vedi alla fine, domanda per domanda. Si passa dall'<b>:soglia%</b>.":
    "El examen cubre todo el curso. <b>Sin límite de tiempo</b>, sin penalizaciones, puedes repetirlo las veces que quieras. Durante el examen no recibes corrección: la ves al final, pregunta a pregunta. Se aprueba a partir del <b>:soglia%</b>.",
  "L'ho confermata, ricarica":
    "Ya lo he confirmado, recarga",
  "L'oracolo \"periodico\" lascia in gioco solo gli stati x che stanno su una griglia con passo <b>r</b> (più uno sfasamento casuale). Trova r.":
    "El oráculo \"periódico\" deja en juego solo los estados x que están en una rejilla de paso <b>r</b> (más un desfase al azar). Encuentra r.",
  "L'oracolo nasconde un <b>periodo s</b> di :n bit: <b>f(x) = f(x ⊕ s)</b>, cioè ogni valore esce esattamente <b>due volte</b>.":
    "El oráculo esconde un <b>periodo s</b> de :n bits: <b>f(x) = f(x ⊕ s)</b>, es decir, cada valor sale exactamente <b>dos veces</b>.",
  "L'unica differenza fra le due righe è quel MENO. Tutta l'interferenza quantistica nasce da lì.":
    "La única diferencia entre las dos líneas es ese MENOS. De ahí nace toda la interferencia cuántica.",
  "La QFT trasforma :N ampiezze con :porte porte, ma quando misuri ottieni <b>un solo</b> risultato.":
    "La QFT transforma :N amplitudes con :porte puertas, pero al medir obtienes <b>un solo</b> resultado.",
  "La QFT, porta per porta":
    "La QFT, puerta a puerta",
  "La QPE è la QFT <b>al contrario</b>: invece di trasformare posizioni in fasi, prende un'informazione già scritta nelle fasi (con rotazioni controllate) e la riporta in una posizione <b>leggibile con una misura</b>. È il motore di Shor e di mezza chimica quantistica.":
    "La QPE es la QFT <b>al revés</b>: en vez de convertir posiciones en fases, toma información ya escrita en las fases (con rotaciones controladas) y la devuelve a una posición <b>legible con una medida</b>. Es el motor de Shor y de media química cuántica.",
  "La differenza è quel MENO: da lì nasce l'interferenza.":
    "La diferencia es ese MENOS: de ahí nace la interferencia.",
  "La freccia che gira":
    "La flecha que gira",
  "La funzione segreta è <b>f(x) = s·x mod 2</b> (quante posizioni hanno 1 in comune, pari o dispari).":
    "La función secreta es <b>f(x) = s·x mod 2</b> (cuántas posiciones tienen un 1 en común, par o impar).",
  "La linea dei numeri":
    "La recta numérica",
  "La macchina di Fourier":
    "La máquina de Fourier",
  "La seconda H fa incontrare quelle ampiezze: sul risultato |1⟩ una arriva <b>+</b> e l'altra <b>−</b>, e si cancellano.":
    "La segunda H hace que esas amplitudes se encuentren: sobre el resultado |1⟩ una llega <b>+</b> y la otra <b>−</b>, y se cancelan.",
  "La stringa segreta":
    "La cadena secreta",
  "La tua risposta:":
    "Tu respuesta:",
  "Laboratorio dei circuiti":
    "Laboratorio de circuitos",
  "Laboratorio dell'onda":
    "Laboratorio de la onda",
  "Lancia e conta":
    "Lanza y cuenta",
  "Lascia |0⟩, gira di 180° la fase di |1⟩.":
    "Deja |0⟩, gira 180° la fase de |1⟩.",
  "Lato <b>:lato</b> → area <b>:area%</b>":
    "Lado <b>:lato</b> → área <b>:area%</b>",
  "Lato <b>:lato</b> → area <b>:area</b>":
    "Lado <b>:lato</b> → área <b>:area</b>",
  "Lato del quadrato":
    "Lado del cuadrado",
  "Le <b>barre colorate</b> sono le ampiezze: altezza = quanto è grande, colore e freccia = la fase. Due barre uguali ma di colore opposto sono due frecce opposte: se un'altra porta le fa incontrare, <b>si cancellano</b>.":
    "Las <b>barras de colores</b> son las amplitudes: altura = cuánto vale, color y flecha = la fase. Dos barras iguales pero de color opuesto son dos flechas opuestas: si otra puerta las hace encontrarse, <b>se cancelan</b>.",
  "Le frazioni continue cercano la frazione semplice più vicina a :valore:":
    "Las fracciones continuas buscan la fracción simple más cercana a :valore:",
  "Le frecce si sono allineate: questa frequenza C'È.":
    "Las flechas se han alineado: esta frecuencia SÍ ESTÁ.",
  "Le frecce si sono cancellate: questa frequenza NON c'è.":
    "Las flechas se han cancelado: esta frecuencia NO está.",
  "Le probabilità sono tutte uguali: così la misura non ti dice niente. Serve un blocco che faccia INTERFERIRE le ampiezze dopo l'oracolo.":
    "Las probabilidades son todas iguales: así la medida no te dice nada. Hace falta un bloque que haga INTERFERIR las amplitudes después del oráculo.",
  "Legge di Malus:":
    "Ley de Malus:",
  "Leggi l'istogramma e prova a dare la risposta qui sopra.":
    "Lee el histograma e intenta responder aquí arriba.",
  "Lunghezza del lato (l'ampiezza)":
    "Longitud del lado (la amplitud)",
  "MISURA":
    "MEDIR",
  "MONETA: 0 → :zeri volte, 1 → :uni volte  (resta 50/50: il caso non si \"disfa\")":
    "MONEDA: 0 → :zeri veces, 1 → :uni veces  (sigue 50/50: el azar no se \"deshace\")",
  "Massimo possibile: :max (in fase) · Minimo possibile: :min (in opposizione)":
    "Máximo posible: :max (en fase) · Mínimo posible: :min (en oposición)",
  "Mette tutte le possibilità in gioco con la stessa ampiezza.":
    "Pone todas las posibilidades en juego con la misma amplitud.",
  "Metti il disordine a <b>0°</b>: la somma vale esattamente quanto il numero di frecce. Portalo a <b>360°</b>: la somma crolla vicino a zero, per quanto siano tante. Questo semplice fatto è il motore della trasformata di Fourier <b>e</b> di ogni algoritmo quantistico.":
    "Pon el desorden a <b>0°</b>: la suma vale exactamente el número de flechas. Llévalo a <b>360°</b>: la suma se desploma cerca de cero, por muchas que sean. Ese hecho tan simple es el motor de la transformada de Fourier <b>y</b> de todo algoritmo cuántico.",
  "Miglior risultato: <b>:binario</b> = :y/:M = <b>:valore</b>  (probabilità :percento%)":
    "Mejor resultado: <b>:binario</b> = :y/:M = <b>:valore</b>  (probabilidad :percento%)",
  "Misure":
    "Medidas",
  "Misure (200 tiri)":
    "Medidas (200 tiradas)",
  "Modo quantistico — una sola interrogazione:":
    "Modo cuántico — una sola consulta:",
  "Moltiplicare frecce = sommare angoli":
    "Multiplicar flechas = sumar ángulos",
  "Moneta contro qubit":
    "Moneda contra cúbit",
  "Muovi il cursore fin lì.":
    "Mueve el deslizador hasta ahí.",
  "N = 2^:n = :N numeri  (cioè :n qubit)":
    "N = 2^:n = :N números  (es decir, :n cúbits)",
  "N = <b>:N</b> possibilità, iterazioni fatte: <b>:fatte</b>":
    "N = <b>:N</b> posibilidades, iteraciones hechas: <b>:fatte</b>",
  "N/r = :N/:r = <b>:valore</b> → i picchi cadono sui <b>multipli di N/r</b>.":
    "N/r = :N/:r = <b>:valore</b> → los picos caen en los <b>múltiplos de N/r</b>.",
  "NOT controllato: clicca prima il controllo, poi il bersaglio":
    "NOT controlado: haz clic primero en el control, luego en el objetivo",
  "NOT quantistico":
    "NOT cuántico",
  "NOT quantistico: scambia |0⟩ e |1⟩.":
    "NOT cuántico: intercambia |0⟩ y |1⟩.",
  "Nel resto del corso le probabilità appariranno come <b>percentuale</b> (50%) o come <b>numero fra 0 e 1</b> (0,5): ormai sai che sono la stessa cosa.":
    "En el resto del curso las probabilidades aparecerán como <b>porcentaje</b> (50%) o como <b>número entre 0 y 1</b> (0,5): ya sabes que son la misma cosa.",
  "Non ancora — ma ci sei vicino":
    "Todavía no — pero estás cerca",
  "Non fa nulla (identità).":
    "No hace nada (identidad).",
  "Non riesco a raggiungere il server: se stai giocando in locale senza PHP, il tutor è spento. Il resto del gioco funziona lo stesso.":
    "No consigo llegar al servidor: si estás jugando en local sin PHP, el tutor está apagado. El resto del juego funciona igual.",
  "Nota le barre: <b>una sola</b> è alta al 100%. Tutte le altre possibilità si sono cancellate a vicenda.":
    "Fíjate en las barras: <b>solo una</b> llega al 100%. Todas las demás posibilidades se han cancelado entre sí.",
  "Numero da fattorizzare <b>N</b>":
    "Número a factorizar <b>N</b>",
  "Numero di qubit <b>n</b>  (N = 2^n campioni/ampiezze)":
    "Número de cúbits <b>n</b>  (N = 2^n muestras/amplitudes)",
  "ORACOLO":
    "ORÁCULO",
  "Obiettivo: <b>:etichetta</b> (:spiegazione) → :percento%.":
    "Objetivo: <b>:etichetta</b> (:spiegazione) → :percento%.",
  "Officina degli algoritmi":
    "Taller de algoritmos",
  "Officina di Shor":
    "Taller de Shor",
  "Opposte (180°)":
    "Opuestas (180°)",
  "Osserva: si parte da <b>una</b> barra sola e si finisce con <b>tutte le barre uguali</b> ma con <b>fasi diverse</b> (colori diversi). L'informazione non è sparita: è passata dalla <b>posizione</b> alla <b>fase</b>. Questa frase è tutta la QFT.":
    "Observa: se parte de <b>una</b> sola barra y se acaba con <b>todas las barras iguales</b> pero con <b>fases distintas</b> (colores distintos). La información no ha desaparecido: ha pasado de la <b>posición</b> a la <b>fase</b>. Esa frase es toda la QFT.",
  "Ottimo punto per misurare!":
    "¡Buen momento para medir!",
  "PERFETTO!":
    "¡PERFECTO!",
  "Pagina di verifica":
    "Página de verificación",
  "Partenza: Alice ha il qubit misterioso q0 da mandare. q1 e q2 sono a zero.":
    "Inicio: Alice tiene el cúbit misterioso q0 que enviar. q1 y q2 están a cero.",
  "Passo 1 (classico).":
    "Paso 1 (clásico).",
  "Passo 2 (quantistico).":
    "Paso 2 (cuántico).",
  "Passo 3 (misura).":
    "Paso 3 (medida).",
  "Passo 4 (classico).":
    "Paso 4 (clásico).",
  "Passo 5.":
    "Paso 5.",
  "Passo :i/:totali":
    "Paso :i/:totali",
  "Pausa/Play":
    "Pausa/Play",
  "Perché due H riportano il qubit a zero?":
    "¿Por qué dos H devuelven el cúbit a cero?",
  "Perché funziona: dopo le prime Hadamard ogni possibilità x ha la stessa ampiezza. L'oracolo mette un <b>meno</b> su quelle con parità dispari: è come \"scrivere s nelle fasi\". Le Hadamard finali trasformano quel disegno di segni in <b>un unico stato</b>, proprio s. È già un piccolo Fourier.":
    "Por qué funciona: tras las primeras Hadamard cada posibilidad x tiene la misma amplitud. El oráculo pone un <b>menos</b> sobre las de paridad impar: es como \"escribir s en las fases\". Las Hadamard finales convierten ese dibujo de signos en <b>un único estado</b>, justo s. Ya es un pequeño Fourier.",
  "Perché si eleva al quadrato":
    "Por qué se eleva al cuadrado",
  "Percorso: :percorso":
    "Recorrido: :percorso",
  "Perfetto! Prova un altro obiettivo.":
    "¡Perfecto! Prueba otro objetivo.",
  "Periodicità dentro, picchi fuori":
    "Periodicidad dentro, picos fuera",
  "Periodo <b>r</b>":
    "Periodo <b>r</b>",
  "Porta la lancetta su :gradi°.":
    "Lleva la aguja a :gradi°.",
  "Porte applicate":
    "Puertas aplicadas",
  "Porte totali del circuito:":
    "Puertas totales del circuito:",
  "Porte: :porte · qubit: :qubit":
    "Puertas: :porte · cúbits: :qubit",
  "Premi il bottone quantistico e guarda cosa succede alle ampiezze.":
    "Pulsa el botón cuántico y mira qué les pasa a las amplitudes.",
  "Premi il bottone quantistico: <b>una sola</b> chiamata all'oracolo dà un'equazione su s.":
    "Pulsa el botón cuántico: <b>una sola</b> llamada al oráculo da una ecuación sobre s.",
  "Premi il bottone quantistico: una sola interrogazione basta, sempre.":
    "Pulsa el botón cuántico: una sola consulta basta, siempre.",
  "Premi «misura» e ricava r dal risultato.":
    "Pulsa «medir» y deduce r del resultado.",
  "Probabilità più alta: :percento% su |:stato⟩":
    "Probabilidad más alta: :percento% en |:stato⟩",
  "Probabilità teorica di ogni faccia: <b>1/:facce</b> = :percento%":
    "Probabilidad teórica de cada cara: <b>1/:facce</b> = :percento%",
  "Prossima porta:":
    "Puerta siguiente:",
  "Prova ad aggiungere un terzo filtro a 45° <b>in mezzo</b>…":
    "Prueba a añadir un tercer filtro a 45° <b>en medio</b>…",
  "Prova:":
    "Prueba:",
  "QFT (porte del circuito quantistico)":
    "QFT (puertas del circuito cuántico)",
  "QFT inversa.":
    "QFT inversa.",
  "QFT su 3 qubit":
    "QFT sobre 3 cúbits",
  "QUBIT : 0 → <span class=\"g\">:zeri</span> volte, 1 → <span class=\"g\">:uni</span> volte  (torna SEMPRE a 0!)":
    "CÚBIT: 0 → <span class=\"g\">:zeri</span> veces, 1 → <span class=\"g\">:uni</span> veces  (¡vuelve SIEMPRE a 0!)",
  "Quadrato e radice quadrata":
    "Cuadrado y raíz cuadrada",
  "Quando la velocità di avvolgimento <b>coincide con una frequenza contenuta nel segnale</b> (qui :frequenze Hz), i \"picchi\" del segnale finiscono sempre dalla stessa parte del cerchio e il centro di massa scappa via dall'origine. È esattamente ciò che calcola la formula della trasformata.":
    "Cuando la velocidad de enrollado <b>coincide con una frecuencia contenida en la señal</b> (aquí :frequenze Hz), los \"picos\" de la señal caen siempre del mismo lado del círculo y el centro de masa se escapa del origen. Es exactamente lo que calcula la fórmula de la transformada.",
  "Quante frecce":
    "Cuántas flechas",
  "Quante onde servono per fare uno spigolo?":
    "¿Cuántas ondas hacen falta para una esquina?",
  "Quante volte dividiamo":
    "Cuántas veces dividimos",
  "Quante volte raddoppi (n)":
    "Cuántas veces duplicas (n)",
  "Quanto costa?":
    "¿Cuánto cuesta?",
  "Quanto riempi":
    "Cuánto llenas",
  "Qubit di Bob (q2)":
    "Cúbit de Bob (q2)",
  "Qubit di lettura <b>t</b>":
    "Cúbits de lectura <b>t</b>",
  "Qubit di partenza (Alice, q0)":
    "Cúbit de partida (Alice, q0)",
  "Questa è <b>la sintesi</b>: costruire un segnale sommando onde. La <b>trasformata di Fourier</b> fa il lavoro inverso: guarda il segnale e ti dice da sola quanto vale ogni cursore.":
    "Esto es <b>la síntesis</b>: construir una señal sumando ondas. La <b>transformada de Fourier</b> hace el trabajo inverso: mira la señal y te dice ella sola cuánto vale cada deslizador.",
  "Questo è il <b>colpo di scena</b>: le probabilità classiche non si cancellano mai, le ampiezze sì.":
    "Ese es el <b>giro de guion</b>: las probabilidades clásicas nunca se cancelan, las amplitudes sí.",
  "RICETTA":
    "RECETA",
  "RISPOSTA GIUSTA con :quante interrogazioni!":
    "¡RESPUESTA CORRECTA con :quante consultas!",
  "Raddoppia, raddoppia, raddoppia…":
    "Duplica, duplica, duplica…",
  "Regola di lettura: <b>tutto |0…0⟩ → costante</b>; <b>qualsiasi altra cosa → bilanciata</b>.":
    "Regla de lectura: <b>todo |0…0⟩ → constante</b>; <b>cualquier otra cosa → equilibrada</b>.",
  "Ribalta tutti i qubit.":
    "Da la vuelta a todos los cúbits.",
  "Ricostruisci il segnale":
    "Reconstruye la señal",
  "Rifai l'esame":
    "Repetir el examen",
  "Riflessione attorno alla media: amplifica ciò che l'oracolo ha marcato.":
    "Reflexión en torno a la media: amplifica lo que el oráculo ha marcado.",
  "Rimanda l'email di conferma":
    "Reenviar el correo de confirmación",
  "Riprova":
    "Reintentar",
  "Risposta esatta:":
    "Respuesta correcta:",
  "Risposta sbagliata":
    "Respuesta incorrecta",
  "Risposta: :valore":
    "Respuesta: :valore",
  "Risposte classiche ottenute: :elenco":
    "Respuestas clásicas obtenidas: :elenco",
  "Risultati (q1q0)":
    "Resultados (q1q0)",
  "Risultati delle misure":
    "Resultados de las medidas",
  "Risultato più probabile: <b>|:stato⟩</b> con :percento%":
    "Resultado más probable: <b>|:stato⟩</b> con :percento%",
  "Rotazione <b>RY(θ)</b> — spinge verso il basso":
    "Rotación <b>RY(θ)</b> — empuja hacia abajo",
  "Rotazione di 180° attorno all'asse Y.":
    "Rotación de 180° en torno al eje Y.",
  "Rotazione di fase <b>P(θ)</b> — gira sull'equatore":
    "Rotación de fase <b>P(θ)</b> — gira por el ecuador",
  "Ruota la fase di |1⟩ di 45°.":
    "Gira la fase de |1⟩ 45°.",
  "Ruota la fase di |1⟩ di 90°.":
    "Gira la fase de |1⟩ 90°.",
  "Ruota la fase di |1⟩ di −45°.":
    "Gira la fase de |1⟩ −45°.",
  "Ruota la fase di |1⟩ di −90°.":
    "Gira la fase de |1⟩ −90°.",
  "SPARA!":
    "¡DISPARA!",
  "STATI INTRECCIATI (entangled)":
    "ESTADOS ENTRELAZADOS",
  "Scarica il PDF":
    "Descargar el PDF",
  "Scegli a = :a. Controlla che MCD(:a, :N) = :mcd = 1 ✓ (se fosse diverso da 1 avresti già trovato un fattore per fortuna!)":
    "Elige a = :a. Comprueba que MCD(:a, :N) = :mcd = 1 ✓ (¡si fuera distinto de 1 ya habrías encontrado un factor por suerte!)",
  "Se un qubit fosse solo \"una moneta nascosta\", mescolare due volte lo lascerebbe casuale. Invece torna esattamente al punto di partenza: la prova che dentro c'è qualcosa che <b>si può cancellare</b>, cioè un'onda.":
    "Si un cúbit fuera solo \"una moneda escondida\", mezclarlo dos veces lo dejaría al azar. En cambio vuelve exactamente al punto de partida: la prueba de que dentro hay algo que <b>se puede cancelar</b>, es decir, una onda.",
  "Se |B| = 1 (freccia lunga 1, cioè e^{iθ}), moltiplicare per B <b>non cambia la lunghezza di A: la fa solo ruotare</b>. Ecco perché tutta Fourier — e tutte le porte di fase quantistiche — sono moltiplicazioni per e^{iθ}.":
    "Si |B| = 1 (flecha de longitud 1, es decir e^{iθ}), multiplicar por B <b>no cambia la longitud de A: solo la hace girar</b>. Por eso todo Fourier — y todas las puertas de fase cuánticas — son multiplicaciones por e^{iθ}.",
  "Sei <b>sopra</b>: abbassa il cursore.":
    "Estás <b>por encima</b>: baja el deslizador.",
  "Sei <b>sotto</b>: alza il cursore.":
    "Estás <b>por debajo</b>: sube el deslizador.",
  "Sei a <b>:gradi°</b> = <b>:frazione</b> di giro completo":
    "Estás en <b>:gradi°</b> = <b>:frazione</b> de vuelta completa",
  "Sei su <b>:posizione</b>, il bersaglio è <b>:bersaglio</b>. Mosse: :mosse":
    "Estás en <b>:posizione</b>, el objetivo es <b>:bersaglio</b>. Movimientos: :mosse",
  "Sei sul bersaglio!":
    "¡Estás en el blanco!",
  "Seno e coseno: le due ombre":
    "Seno y coseno: las dos sombras",
  "Serve quindi a far <b>interferire</b> le ampiezze, non a stampare la lista.":
    "Así que sirve para hacer <b>interferir</b> las amplitudes, no para imprimir la lista.",
  "Serve una <b>collisione</b>: due x diversi con lo stesso f. Con :n bit ne bastano poche, ma con 40 bit servirebbero <b>un milione</b> di domande.":
    "Hace falta una <b>colisión</b>: dos x distintas con la misma f. Con :n bits bastan unas pocas, pero con 40 bits harían falta <b>un millón</b> de preguntas.",
  "Sfasamento iniziale":
    "Desfase inicial",
  "Sfida":
    "Reto",
  "Si calcola :a^x mod :N in sovrapposizione su tutti gli x, si misura il secondo registro e si applica la QFT al primo: le probabilità si concentrano sui multipli di M/r.":
    "Se calcula :a^x mod :N en superposición sobre todas las x, se mide el segundo registro y se aplica la QFT al primero: las probabilidades se concentran en los múltiplos de M/r.",
  "Si crea la coppia intrecciata fra q1 (Alice) e q2 (Bob): H su q1, poi CNOT q1→q2.":
    "Se crea la pareja entrelazada entre q1 (Alice) y q2 (Bob): H sobre q1, luego CNOT q1→q2.",
  "Si scrive così: <b>(:x, :y)</b> — prima sempre la x (orizzontale), poi la y (verticale).":
    "Se escribe así: <b>(:x, :y)</b> — primero siempre la x (horizontal), luego la y (vertical).",
  "Sistema risolto: s = :s":
    "Sistema resuelto: s = :s",
  "Somma delle due frecce: lunghezza <span class=\"p\">:lunghezza</span>, angolo :angolo°":
    "Suma de las dos flechas: longitud <span class=\"p\">:lunghezza</span>, ángulo :angolo°",
  "Sono bloccato in questo livello":
    "Estoy atascado en este nivel",
  "Sono tre modi di scrivere <b>la stessa quantità</b>: \"per cento\" vuol dire letteralmente \"ogni 100\".":
    "Son tres maneras de escribir <b>la misma cantidad</b>: \"por ciento\" quiere decir literalmente \"por cada 100\".",
  "Sovrapposizione totale":
    "Superposición total",
  "Stato attuale:":
    "Estado actual:",
  "Stato di Bell":
    "Estado de Bell",
  "Stato di partenza |x⟩":
    "Estado de partida |x⟩",
  "Stato di partenza:":
    "Estado de partida:",
  "Stato di partenza: ampiezze diverse da zero in :posizioni":
    "Estado de partida: amplitudes distintas de cero en :posizioni",
  "Stiamo cercando di leggere una fase <b>φ = :fase</b> scrivendola in binario con :cifre cifre.":
    "Estamos intentando leer una fase <b>φ = :fase</b> escribiéndola en binario con :cifre cifras.",
  "Stima di fase (QPE)":
    "Estimación de fase (QPE)",
  "Strada classica":
    "Vía clásica",
  "Strada quantistica":
    "Vía cuántica",
  "TELETRASPORTO RIUSCITO":
    "TELETRANSPORTE LOGRADO",
  "TESTA":
    "CARA",
  "Tante frecce insieme":
    "Muchas flechas juntas",
  "Teletrasporto quantistico":
    "Teletransporte cuántico",
  "Ti sono bastate <b>:quante</b> interrogazioni quantistiche.":
    "Te han bastado <b>:quante</b> consultas cuánticas.",
  "Totale: :percento%":
    "Total: :percento%",
  "Trasformata di Fourier quantistica: trasforma periodicità in picchi.":
    "Transformada de Fourier cuántica: convierte periodicidad en picos.",
  "Trova il periodo":
    "Encuentra el periodo",
  "Trova l'ago nel pagliaio":
    "Encuentra la aguja en el pajar",
  "Tutor":
    "Tutor",
  "Tutor di Quantum Arcade":
    "Tutor de Quantum Arcade",
  "Ultima misura: <b>y = :y</b> → equazione <b>:y · s = 0</b>":
    "Última medida: <b>y = :y</b> → ecuación <b>:y · s = 0</b>",
  "Un <b>giro completo</b> del pallino = <b>un ciclo</b> dell'onda. Se il pallino fa 2 giri al secondo, l'onda ha frequenza 2 Hz e periodo ½ secondo. Frequenza e periodo sono la stessa informazione, letta in due modi: <b>T = 1/f</b>.":
    "Una <b>vuelta completa</b> del punto = <b>un ciclo</b> de la onda. Si el punto da 2 vueltas por segundo, la onda tiene frecuencia 2 Hz y periodo ½ segundo. Frecuencia y periodo son la misma información leída de dos maneras: <b>T = 1/f</b>.",
  "Un chicco di riso sulla prima casella, due sulla seconda, quattro sulla terza…":
    "Un grano de arroz en la primera casilla, dos en la segunda, cuatro en la tercera…",
  "Un computer classico se la caverebbe con: :costo.":
    "Un ordenador clásico se apañaría con: :costo.",
  "Un filtro non \"seleziona\": <b>misura</b>, e la misura <b>riscrive</b> lo stato del fotone. Dopo il filtro a 45° il fotone È a 45°, e da lì ha di nuovo una possibilità di passare a 90°.":
    "Un filtro no \"selecciona\": <b>mide</b>, y la medida <b>reescribe</b> el estado del fotón. Tras el filtro a 45° el fotón ESTÁ a 45°, y desde ahí tiene otra vez una posibilidad de pasar a 90°.",
  "Un fotone polarizzato è il <b>qubit fisico</b> più semplice: verticale = |0⟩, orizzontale = |1⟩, e le direzioni oblique sono <b>sovrapposizioni</b>. La probabilità di passare è il <b>quadrato del coseno</b> dell'angolo: ecco da dove viene \"probabilità = ampiezza²\".":
    "Un fotón polarizado es el <b>cúbit físico</b> más simple: vertical = |0⟩, horizontal = |1⟩, y las direcciones oblicuas son <b>superposiciones</b>. La probabilidad de pasar es el <b>coseno al cuadrado</b> del ángulo: de ahí viene \"probabilidad = amplitud²\".",
  "Un giro intero = <b>360°</b>. Mezzo giro = 180°. Un quarto = 90°.":
    "Una vuelta entera = <b>360°</b>. Media vuelta = 180°. Un cuarto = 90°.",
  "Una DFT su 8 punti costa 8×8 = 64 moltiplicazioni. Ma una DFT su 8 punti si può scrivere usando <b>due</b> DFT su 4 punti (pari e dispari) più 8 combinazioni finali. Ripetendo il trucco fino in fondo: <b>log₂8 = 3 livelli</b> × 8 = 24 operazioni invece di 64. Più N cresce, più il risparmio esplode.":
    "Una DFT sobre 8 puntos cuesta 8×8 = 64 multiplicaciones. Pero una DFT sobre 8 puntos se puede escribir usando <b>dos</b> DFT sobre 4 puntos (pares e impares) más 8 combinaciones finales. Repitiendo el truco hasta el fondo: <b>log₂8 = 3 niveles</b> × 8 = 24 operaciones en vez de 64. Cuanto más crece N, más explota el ahorro.",
  "Una coppia di numeri (x, y) individua <b>un punto</b> sul piano, oppure — che è lo stesso — <b>una freccia</b> che parte dal centro. Fra due livelli chiameremo quella stessa freccia \"numero complesso\": x sarà la parte reale e y quella immaginaria.":
    "Un par de números (x, y) localiza <b>un punto</b> en el plano o — que es lo mismo — <b>una flecha</b> que parte del centro. Dentro de dos niveles llamaremos a esa misma flecha \"número complejo\": x será la parte real e y la imaginaria.",
  "Uno solo degli :N stati è quello \"giusto\". L'oracolo sa dirti soltanto <b>sì/no</b> (mettendo un segno meno). Trovalo.":
    "Solo uno de los :N estados es el \"correcto\". El oráculo solo sabe decirte <b>sí/no</b> (poniendo un signo menos). Encuéntralo.",
  "Vedi? Con tanti lanci le percentuali si sistemano da sole. Si chiama legge dei grandi numeri.":
    "¿Ves? Con muchos lanzamientos los porcentajes se ordenan solos. Se llama ley de los grandes números.",
  "Velocità di avvolgimento <b>f</b>":
    "Velocidad de enrollado <b>f</b>",
  "Velocità di rotazione <b>f</b>":
    "Velocidad de rotación <b>f</b>",
  "Velocità di rotazione <b>ω</b>":
    "Velocidad de rotación <b>ω</b>",
  "Verifica pubblica":
    "Verificación pública",
  "X su tutti":
    "X en todos",
  "Z controllata":
    "Z controlada",
  "a caso":
    "al azar",
  "accorciate: presi da soli i qubit non hanno più uno stato definito!":
    "acortadas: ¡tomados por separado los cúbits ya no tienen un estado definido!",
  "alla casella :casella ce ne sono già :quanti.":
    "en la casilla :casella ya hay :quanti.",
  "altezza":
    "altura",
  "altezza del pallino, disegnata nel tempo":
    "la altura del punto, dibujada en el tiempo",
  "ampiezza della somma":
    "amplitud de la suma",
  "ampiezza di :ket":
    "amplitud de :ket",
  "applica P(θ)":
    "aplicar P(θ)",
  "applica RY(θ)":
    "aplicar RY(θ)",
  "applica le porte e guarda la freccia muoversi":
    "aplica las puertas y mira moverse la flecha",
  "area":
    "área",
  "area = 0,01 → che lato?":
    "área = 0,01 → ¿qué lado?",
  "area = 0,25 → che lato?":
    "área = 0,25 → ¿qué lado?",
  "area = 0,5 → che lato?":
    "área = 0,5 → ¿qué lado?",
  "attraverso un filtro passa cos²(differenza di angolo).":
    "a través de un filtro pasa cos²(diferencia de ángulo).",
  "azzera":
    "reiniciar",
  "azzera istogramma":
    "reiniciar histograma",
  "azzera misure":
    "reiniciar medidas",
  "bastano: premi \"risolvi il sistema\"":
    "bastan: pulsa \"resolver el sistema\"",
  "bersaglio":
    "objetivo",
  "bilanciata":
    "equilibrada",
  "bit classici inviati ad Alice→Bob: <b>:bit</b> (→ correzione: :correzione)":
    "bits clásicos enviados Alice→Bob: <b>:bit</b> (→ corrección: :correzione)",
  "cambia segno":
    "cambia de signo",
  "centrati: :fatti/:totali":
    "acertados: :fatti/:totali",
  "centrato!":
    "¡en el blanco!",
  "centro di massa = :valore":
    "centro de masa = :valore",
  "chiedi 1 valore (modo classico)":
    "pide 1 valor (modo clásico)",
  "chiedi UNA volta":
    "pregunta UNA vez",
  "chiedi UNA volta (modo quantistico)":
    "pregunta UNA vez (modo cuántico)",
  "chiedi a caso":
    "pregunta al azar",
  "chiedi pure":
    "pregunta lo que quieras",
  "chiedi un bit alla volta":
    "pregunta bit a bit",
  "ci sei!":
    "¡lo tienes!",
  "circuito completo":
    "circuito completo",
  "clicca sulla griglia o usa i cursori, poi premi SPARA":
    "haz clic en la cuadrícula o usa los deslizadores, luego pulsa DISPARA",
  "clicca sulla griglia, poi SPARA":
    "haz clic en la cuadrícula, luego DISPARA",
  "clicca una casella per chiedere f(x) all'oracolo":
    "haz clic en una casilla para pedirle f(x) al oráculo",
  "colpisci il bersaglio":
    "acierta al objetivo",
  "come la FFT taglia il lavoro a metà, ogni volta":
    "cómo la FFT parte el trabajo por la mitad, cada vez",
  "cosa succede se le sposti?":
    "¿qué pasa si las desplazas?",
  "coseno":
    "coseno",
  "costante":
    "constante",
  "costante o bilanciata? Una sola domanda.":
    "¿constante o equilibrada? Una sola pregunta.",
  "dado (6 facce)":
    "dado (6 caras)",
  "denominatore <b>r = :r</b>":
    "denominador <b>r = :r</b>",
  "devi provare i valori uno per uno":
    "tienes que probar los valores uno a uno",
  "differenza di fase":
    "diferencia de fase",
  "differenza fra lo stato di partenza e quello di Bob: <b>:distanza</b>":
    "diferencia entre el estado de partida y el de Bob: <b>:distanza</b>",
  "dimezza il lato e l'area diventa un quarto, non la metà":
    "reduce el lado a la mitad y el área queda en un cuarto, no en la mitad",
  "dimezza il lato: l'area diventa un quarto":
    "reduce el lado a la mitad: el área queda en un cuarto",
  "divisioni":
    "divisiones",
  "domanda :i di :totali":
    "pregunta :i de :totali",
  "domanda precedente":
    "pregunta anterior",
  "domande e correzione lato server":
    "preguntas y corrección en el servidor",
  "domande fatte: <b>:fatte</b> su :totali possibili.":
    "preguntas hechas: <b>:fatte</b> de :totali posibles.",
  "dopo il passo :n":
    "tras el paso :n",
  "dopo la QFT sul registro di lettura (:qubit qubit → :valori valori)":
    "tras la QFT sobre el registro de lectura (:qubit cúbits → :valori valores)",
  "due \"lanci\" a testa: chi torna a casa?":
    "dos \"lanzamientos\" cada uno: ¿quién vuelve a casa?",
  "due manopole: quanto |1⟩ e quale fase":
    "dos mandos: cuánto |1⟩ y qué fase",
  "e al contrario:":
    "y al revés:",
  "e guarda il centro di massa":
    "y mira el centro de masa",
  "ed è davvero il periodo nascosto":
    "y es de verdad el periodo escondido",
  "era <b>:cosa</b>":
    "era <b>:cosa</b>",
  "era <b>:valore</b>":
    "era <b>:valore</b>",
  "era <b>r = :r</b> (con partenza da :off)":
    "era <b>r = :r</b> (empezando en :off)",
  "era <b>|:valore⟩</b>":
    "era <b>|:valore⟩</b>",
  "errore :valore":
    "error :valore",
  "esame finale superato":
    "examen final superado",
  "fai diventare l'area :quanto%":
    "haz que el área sea :quanto%",
  "fase":
    "fase",
  "fase +45° su |1⟩":
    "fase +45° en |1⟩",
  "fase +90° su |1⟩":
    "fase +90° en |1⟩",
  "fase vera":
    "fase verdadera",
  "fattore trovato":
    "factor encontrado",
  "fattorizza un numero con le tue mani":
    "factoriza un número con tus manos",
  "filtri incrociati (0° e 90°)":
    "filtros cruzados (0° y 90°)",
  "frecce ruotate a velocità k = :k":
    "flechas giradas a velocidad k = :k",
  "freccia":
    "flecha",
  "frequenze diverse: le frecce girano a velocità diverse":
    "frecuencias distintas: las flechas giran a velocidades distintas",
  "giri/s":
    "vueltas/s",
  "grazie: mi aiuta a migliorare il corso":
    "gracias: me ayuda a mejorar el curso",
  "guarda la barra giusta crescere":
    "mira crecer la barra correcta",
  "guarda le fasi disporsi a ventaglio":
    "mira cómo las fases se abren en abanico",
  "guarda quando ricomincia da 1":
    "mira cuándo vuelve a empezar en 1",
  "ha completato i :quanti livelli di <b>“Informatica quantistica giocando”</b> superando l'esame finale con <b>:percento%</b> di risposte esatte.":
    "ha completado los :quanti niveles de <b>“Computación cuántica jugando”</b> superando el examen final con un <b>:percento%</b> de respuestas correctas.",
  "hai misurato y = :y":
    "has medido y = :y",
  "i picchi cadono sui multipli di M/r = :M/:r = :valore":
    "los picos caen en los múltiplos de M/r = :M/:r = :valore",
  "il lato e l'area di un quadrato":
    "el lado y el área de un cuadrado",
  "il lato è l'ampiezza, l'area è la probabilità":
    "el lado es la amplitud, el área es la probabilidad",
  "il lato è la \"radice quadrata\" dell'area":
    "el lado es la \"raíz cuadrada\" del área",
  "il misterioso":
    "la misteriosa",
  "il pallino gira, l'onda esce a destra":
    "el punto gira, la onda sale a la derecha",
  "il risultato è:":
    "el resultado es:",
  "il trucco che usa Shor":
    "el truco que usa Shor",
  "il tuo":
    "la tuya",
  "il valore 1 ritorna ogni :r passi → PERIODO r = :r":
    "el valor 1 vuelve cada :r pasos → PERIODO r = :r",
  "interferenza parziale":
    "interferencia parcial",
  "interrogazione quantistica":
    "consulta cuántica",
  "interrogazioni: <b>:quante</b>":
    "consultas: <b>:quante</b>",
  "iterazioni":
    "iteraciones",
  "l'altezza disegnata mentre l'angolo cresce = un'ONDA":
    "la altura dibujada mientras crece el ángulo = una ONDA",
  "l'esperimento dei tre filtri":
    "el experimento de los tres filtros",
  "la freccia gira → escono le due onde":
    "la flecha gira → salen las dos ondas",
  "la probabilità si vede solo con tanti lanci":
    "la probabilidad solo se ve con muchos lanzamientos",
  "la radice quadrata è la domanda:":
    "la raíz cuadrada es la pregunta:",
  "la serie di Fourier dell'onda quadra":
    "la serie de Fourier de la onda cuadrada",
  "lancia :quanti":
    "lanza :quanti",
  "lato":
    "lado",
  "lato minore di 1 → area ancora più piccola":
    "lado menor que 1 → área aún más pequeña",
  "lato × lato = area":
    "lado × lado = área",
  "le potenze di 2 (e perché i qubit sono speciali)":
    "las potencias de 2 (y por qué los cúbits son especiales)",
  "le quattro regole, disegnate":
    "las cuatro reglas, dibujadas",
  "leggere una fase nascosta come numero binario":
    "leer una fase escondida como número binario",
  "lunghezza :quanto < 1 → intrecciato":
    "longitud :quanto < 1 → entrelazado",
  "lunghezza :quanto < 1 → qubit intrecciato con altri":
    "longitud :quanto < 1 → cúbit entrelazado con otros",
  "lunghezza <span class=\"a\">:lunghezza</span>, fase :fase°":
    "longitud <span class=\"a\">:lunghezza</span>, fase :fase°",
  "lunghezza della freccia di Bloch: q0 = :q0, q1 = :q1":
    "longitud de la flecha de Bloch: q0 = :q0, q1 = :q1",
  "metti/togli il filtro in mezzo":
    "pon/quita el filtro de en medio",
  "mettimi alla prova":
    "ponme a prueba",
  "metà bicchiere":
    "medio vaso",
  "miglior lettura: :y/:M = :valore (:percento%)":
    "mejor lectura: :y/:M = :valore (:percento%)",
  "misterioso":
    "misteriosa",
  "misura 1 volta":
    "medir 1 vez",
  "misura 100 volte":
    "medir 100 veces",
  "misura 200 volte":
    "medir 200 veces",
  "misura il registro (come farebbe il computer quantistico)":
    "mide el registro (como haría el ordenador cuántico)",
  "moneta (2 facce)":
    "moneda (2 caras)",
  "moneta: mescola, mescola, guarda":
    "moneda: mezcla, mezcla, mira",
  "monta, lancia, indovina, migliora":
    "monta, lanza, adivina, mejora",
  "muovi i cursori e guarda cosa cambia":
    "mueve los deslizadores y mira qué cambia",
  "muovi il cursore qui sotto — la riga tratteggiata è il bersaglio":
    "mueve el deslizador de abajo — la línea de puntos es el objetivo",
  "muovi il lato e guarda l'area":
    "mueve el lado y mira el área",
  "n=:n: x=:x ruotato di :gradi° → (:re, :imi)":
    "n=:n: x=:x girado :gradi° → (:re, :imi)",
  "negativi":
    "negativos",
  "nessun denominatore utile (y = 0 capita spesso e non dice nulla). Rimisura.":
    "ningún denominador útil (y = 0 pasa a menudo y no dice nada). Vuelve a medir.",
  "nessuna":
    "ninguna",
  "numero ottimo di iterazioni ≈ (π/4)·√N = <b>:quante</b>":
    "número óptimo de iteraciones ≈ (π/4)·√N = <b>:quante</b>",
  "nuova funzione segreta":
    "nueva función secreta",
  "nuovo bersaglio":
    "nuevo objetivo",
  "nuovo segnale":
    "nueva señal",
  "nuovo segreto":
    "nuevo secreto",
  "obiettivo":
    "objetivo",
  "obiettivo :quanto%":
    "objetivo :quanto%",
  "ogni riga: indici pari a sinistra, dispari a destra":
    "cada fila: índices pares a la izquierda, impares a la derecha",
  "ombra orizz.":
    "sombra horiz.",
  "ombra orizzontale":
    "sombra horizontal",
  "onda A":
    "onda A",
  "onda B":
    "onda B",
  "onde":
    "ondas",
  "ora clicca il bersaglio":
    "ahora haz clic en el objetivo",
  "ordine = somma grande, disordine = zero":
    "orden = suma grande, desorden = cero",
  "ottimo ≈ :quante":
    "óptimo ≈ :quante",
  "parte da :n":
    "empieza en :n",
  "parte immaginaria = sin":
    "parte imaginaria = sin",
  "parte reale = cos":
    "parte real = cos",
  "passa :percento%":
    "pasa el :percento%",
  "passo :i/:totali":
    "paso :i/:totali",
  "passo successivo":
    "paso siguiente",
  "percentuale · decimale · frazione":
    "porcentaje · decimal · fracción",
  "periodo 4":
    "periodo 4",
  "periodo T = 1/f = <span class=\"g\">:T s</span>  ·  in :durata s ci stanno :cicli cicli":
    "periodo T = 1/f = <span class=\"g\">:T s</span>  ·  en :durata s caben :cicli ciclos",
  "porta il punto a :gradi° e leggi il :quale":
    "lleva el punto a :gradi° y lee el :quale",
  "porta il punto a <b>:gradi°</b> e guarda quanto vale il <b>:quale</b>.":
    "lleva el punto a <b>:gradi°</b> y mira cuánto vale el <b>:quale</b>.",
  "porta il razzo su :bersaglio":
    "lleva el cohete a :bersaglio",
  "porta la lancetta a :gradi°":
    "lleva la aguja a :gradi°",
  "porta la lancetta dove ti chiedo":
    "lleva la aguja donde te pido",
  "porte applicate: :elenco":
    "puertas aplicadas: :elenco",
  "porte: :elenco":
    "puertas: :elenco",
  "positivi":
    "positivos",
  "possibili segreti ancora in gioco: <b>:quanti</b>":
    "posibles secretos aún en juego: <b>:quanti</b>",
  "probabilità di leggere 0: <span class=\"g\">:p0%</span>   ·   di leggere 1: <span class=\"a\">:p1%</span>":
    "probabilidad de leer 0: <span class=\"g\">:p0%</span>   ·   de leer 1: <span class=\"a\">:p1%</span>",
  "probabilità di leggere ciascun numero y (con :quanti qubit di lettura)":
    "probabilidad de leer cada número y (con :quanti cúbits de lectura)",
  "probabilità di misurare |:zeri⟩ = <b>:percento%</b>":
    "probabilidad de medir |:zeri⟩ = <b>:percento%</b>",
  "probabilità di pescare l'elemento giusto: <b>:ora%</b> (all'inizio era :prima%)":
    "probabilidad de sacar el elemento correcto: <b>:ora%</b> (al principio era :prima%)",
  "probabilità di trovare l'elemento giusto, iterazione per iterazione":
    "probabilidad de encontrar el elemento correcto, iteración a iteración",
  "probabilità: 0 → <span class=\"g\">:p0%</span>, 1 → <span class=\"a\">:p1%</span>  (somma sempre 100%: :somma)":
    "probabilidades: 0 → <span class=\"g\">:p0%</span>, 1 → <span class=\"a\">:p1%</span>  (siempre suma 100%: :somma)",
  "prova 200 volte entrambi":
    "prueba 200 veces ambos",
  "quanto c'è di ogni frequenza?":
    "¿cuánto hay de cada frecuencia?",
  "quanto vale il centro di massa al variare di f":
    "cuánto vale el centro de masa al variar f",
  "quattro ampiezze, e la sorpresa dell'entanglement":
    "cuatro amplitudes, y la sorpresa del entrelazamiento",
  "qubit: H, H, misura":
    "cúbit: H, H, medir",
  "questo r non porta a fattori utili: rimisura.":
    "esta r no lleva a factores útiles: vuelve a medir.",
  "r è dispari: questo tentativo non serve. Rimisura (capita, è normale).":
    "r es impar: este intento no sirve. Vuelve a medir (pasa, es normal).",
  "raggio":
    "radio",
  "raggio del cerchio":
    "radio del círculo",
  "raggiungi il bersaglio in poche mosse":
    "alcanza el objetivo en pocos movimientos",
  "ricomincia":
    "empezar de nuevo",
  "riempi fino a :etichetta  (:spiegazione)":
    "llena hasta :etichetta  (:spiegazione)",
  "riempi il bicchiere fino alla riga!":
    "¡llena el vaso hasta la raya!",
  "rimescola":
    "vuelve a mezclar",
  "riparti da |0⟩":
    "vuelve a empezar en |0⟩",
  "risolvi il sistema":
    "resolver el sistema",
  "rotazione 180° attorno a Y":
    "rotación de 180° en torno a Y",
  "scambia due qubit":
    "intercambia dos cúbits",
  "scansiona tutte le frequenze":
    "barre todas las frecuencias",
  "scegli una porta, clicca sulla griglia":
    "elige una puerta, haz clic en la cuadrícula",
  "se sposti lo \"sfasamento iniziale\", i picchi <b>NON si muovono</b>. Le probabilità dipendono solo dal <b>periodo</b>, non da dove comincia. Ecco perché Shor può misurare il secondo registro senza rovinare tutto: qualunque cosa esca, la periodicità resta leggibile.":
    "si mueves el \"desfase inicial\", los picos <b>NO se mueven</b>. Las probabilidades dependen solo del <b>periodo</b>, no de dónde empieza. Por eso Shor puede medir el segundo registro sin estropearlo todo: salga lo que salga, la periodicidad sigue siendo legible.",
  "segnale: :frequenze Hz":
    "señal: :frequenze Hz",
  "segno meno su |1⟩":
    "signo menos en |1⟩",
  "seno":
    "seno",
  "sfasamento":
    "desfase",
  "si scrive 2^:n":
    "se escribe 2^:n",
  "soluzione":
    "solución",
  "somma =":
    "suma =",
  "somma = :somma  (massimo possibile: :max)":
    "suma = :somma  (máximo posible: :max)",
  "somma le frecce una alla volta":
    "suma las flechas una a una",
  "somma parziale":
    "suma parcial",
  "sorgente":
    "fuente",
  "sposta il cursore: quante operazioni servono":
    "mueve el deslizador: cuántas operaciones hacen falta",
  "sposta uno stato senza spostare la particella":
    "mueve un estado sin mover la partícula",
  "stai giocando:":
    "estás jugando:",
  "stato separabile: i due qubit sono indipendenti":
    "estado separable: los dos cúbits son independientes",
  "sto cercando nel corso…":
    "buscando en el curso…",
  "sto sommando la freccia n = :n":
    "sumando la flecha n = :n",
  "sulla tua colonna":
    "en tu columna",
  "sulla tua riga":
    "en tu fila",
  "svuota":
    "vaciar",
  "tempo":
    "tiempo",
  "test di separabilità |a·d − b·c| = <b>:valore</b> → ":
    "test de separabilidad |a·d − b·c| = <b>:valore</b> → ",
  "ti è servito?":
    "¿te ha servido?",
  "togli ultima":
    "quitar la última",
  "trascina A e B":
    "arrastra A y B",
  "trascina i campioni, cambia k, guarda le frecce":
    "arrastra las muestras, cambia k, mira las flechas",
  "trascina il punto sul cerchio":
    "arrastra el punto por el círculo",
  "trascina la lancetta o usa il cursore · un giro intero = 360°":
    "arrastra la aguja o usa el deslizador · una vuelta entera = 360°",
  "trascina per girare la palla":
    "arrastra para girar la bola",
  "trascinala col mouse!":
    "¡arrástrala con el ratón!",
  "tre quarti":
    "tres cuartos",
  "trova il bersaglio nascosto — colpiti :fatti/:totali":
    "encuentra el objetivo oculto — aciertos :fatti/:totali",
  "trova il lato che dà area :area":
    "encuentra el lado que da área :area",
  "trova il periodo nascosto s: f(x) = f(x ⊕ s)":
    "encuentra el periodo escondido s: f(x) = f(x ⊕ s)",
  "trova la stringa segreta con UNA domanda":
    "encuentra la cadena secreta con UNA pregunta",
  "tu avevi risposto: :tua":
    "tú respondiste: :tua",
  "tuo record per questa sfida: <b>:record</b>":
    "tu récord en este reto: <b>:record</b>",
  "tutto":
    "todo",
  "tutto uguale":
    "todo igual",
  "un decimo":
    "un décimo",
  "un quarto":
    "un cuarto",
  "un quinto":
    "un quinto",
  "un solo colpo":
    "un solo golpe",
  "una iterazione di Grover":
    "una iteración de Grover",
  "una sola barra alta, tutto il resto a zero.":
    "una sola barra alta, todo lo demás a cero.",
  "usa i bottoni: +1, −1, doppio, metà, cambia segno":
    "usa los botones: +1, −1, doble, mitad, cambia de signo",
  "vai a :gradi°":
    "ve a :gradi°",
  "vai all'ottimo (:quante)":
    "ve al óptimo (:quante)",
  "x (destra/sinistra)":
    "x (derecha/izquierda)",
  "x(n) — i tuoi dati (trascinali!)":
    "x(n) — tus datos (¡arrástralos!)",
  "y (su/giù)":
    "y (arriba/abajo)",
  "|X(k)| — quanto c'è di ogni frequenza (clicca una barra)":
    "|X(k)| — cuánto hay de cada frecuencia (haz clic en una barra)",
  "È uscito <b>y = :y</b> → y/M = :y/:M = <b>:valore</b>":
    "Ha salido <b>y = :y</b> → y/M = :y/:M = <b>:valore</b>",
  "è BILANCIATA":
    "es EQUILIBRADA",
  "è COSTANTE":
    "es CONSTANTE",
  "è la probabilità":
    "es la probabilidad",
  "θ dello stato da mandare":
    "θ del estado a enviar",
  "θ — <b>quanto |1⟩</b> c'è":
    "θ — <b>cuánto |1⟩</b> hay",
  "φ dello stato da mandare":
    "φ del estado a enviar",
  "φ non è rappresentabile esattamente: la probabilità si sparpaglia sui valori vicini (ma resta concentrata: almeno :minimo% sul valore più vicino).":
    "φ no se puede representar exactamente: la probabilidad se reparte entre los valores cercanos (pero sigue concentrada: al menos :minimo% en el más cercano).",
  "φ è esattamente rappresentabile con questi qubit: il risultato esce con probabilità 100%.":
    "φ se puede representar exactamente con estos cúbits: el resultado sale con probabilidad 100%.",
  "φ — <b>la fase</b> (non cambia le probabilità!)":
    "φ — <b>la fase</b> (¡no cambia las probabilidades!)",
  "… e altri :quanti (non ci stanno nello schermo)":
    "… y otros :quanti (no caben en la pantalla)",
  "→ risposta: :risposta (la funzione era davvero <b>:vera</b>) :esito":
    "→ respuesta: :risposta (la función era de verdad <b>:vera</b>) :esito",

  /* ---------------- Parte K: informática clásica y bloques de comparación ---------------- */
  'quanto costa': 'cuánto cuesta',
  'computer normale': 'ordenador normal',
  'computer quantistico': 'ordenador cuántico',
  'Ripassa il livello :n — :titolo': 'Repasa el nivel :n — :titolo',
  'Prima in classico, poi in quantistico': 'Primero en clásico, luego en cuántico',
  'Come si fa con un computer normale': 'Cómo se hace con un ordenador normal',
  'Cosa cambia con quello quantistico': 'Qué cambia con el cuántico',

  'Parte K — Il computer classico (il termine di paragone)': 'Parte K — El ordenador clásico (el término de comparación)',
  "Bit, porte logiche, somma binaria, ricerca, costo di un algoritmo, reversibilità. Ogni livello finisce con l'anticipazione di cosa cambierà nel quantistico. Facoltativa se sai già come funziona un computer normale.":
    'Bits, puertas lógicas, suma binaria, búsqueda, coste de un algoritmo, reversibilidad. Cada nivel termina anticipando qué cambiará en lo cuántico. Opcional si ya sabes cómo funciona un ordenador normal.',
  'Il bit: acceso, spento, e come ci si scrive tutto': 'El bit: encendido, apagado, y cómo se escribe todo con él',
  'Interruttori, binario, byte, testo. E il conto che tornerà: con n bit scegli UN numero fra 2ⁿ.':
    'Interruptores, binario, byte, texto. Y la cuenta que volverá: con n bits eliges UN número entre 2ⁿ.',
  'Porte logiche: AND, OR, NOT, XOR': 'Puertas lógicas: AND, OR, NOT, XOR',
  'Tabelle di verità giocate, e la scoperta che una porta sola basta per costruire tutte le altre.':
    'Tablas de verdad jugadas, y el descubrimiento de que una sola puerta basta para construir todas las demás.',
  'La somma, come la fa davvero il processore': 'La suma, tal como la hace de verdad el procesador',
  "Riporto, mezzo sommatore, sommatore completo: monti l'addizione a 4 bit con le tue mani.":
    'Acarreo, semisumador, sumador completo: montas la suma de 4 bits con tus propias manos.',
  'Cercare: a tentoni, oppure dimezzando': 'Buscar: a tientas, o dividiendo por la mitad',
  'Ricerca lineare e ricerca binaria, contando i confronti uno per uno. Il metro di paragone di Grover.':
    'Búsqueda lineal y búsqueda binaria, contando las comparaciones una a una. La vara de medir de Grover.',
  'Quanto costa un algoritmo: N, log N, N², 2ⁿ': 'Cuánto cuesta un algoritmo: N, log N, N², 2ⁿ',
  'La gara fra le curve di crescita. Qui si capisce che cosa significa davvero "vantaggio quantistico".':
    'La carrera entre las curvas de crecimiento. Aquí se entiende qué significa de verdad "ventaja cuántica".',
  'Informazione che si perde: il ponte verso il quantistico': 'Información que se pierde: el puente hacia lo cuántico',
  "AND butta via un bit, cancellare scalda (Landauer), Toffoli calcola all'indietro. Da qui parte tutto.":
    'AND tira un bit, borrar calienta (Landauer), Toffoli calcula hacia atrás. De aquí sale todo.',

  'FATTO!': '¡HECHO!',

  /* laboratorio del bit */
  'La macchina a interruttori': 'La máquina de interruptores',
  'accendi i bit finché il numero non è quello giusto': 'enciende los bits hasta que el número sea el correcto',
  'accendi gli interruttori per fare :numero': 'enciende los interruptores para hacer :numero',
  'ogni interruttore vale il doppio di quello alla sua destra — tocca per accenderlo':
    'cada interruptor vale el doble que el de su derecha — toca para encenderlo',
  'tutto spento = 0': 'todo apagado = 0',
  'nuovo numero': 'número nuevo',
  'spegni tutto': 'apagar todo',
  'Binario: <b>:bin</b>  ·  decimale: <b>:dec</b>  ·  esadecimale: <b>:hex</b>':
    'Binario: <b>:bin</b>  ·  decimal: <b>:dec</b>  ·  hexadecimal: <b>:hex</b>',
  'Se questi 8 bit fossero testo, sarebbero il carattere «<b>:carattere</b>».':
    'Si estos 8 bits fueran texto, serían el carácter «<b>:carattere</b>».',
  'Con :n interruttori i numeri diversi possibili sono 2^:n = <b>:totale</b>. Ma tu, in questo momento, ne stai tenendo <b>uno solo</b>.':
    'Con :n interruptores los números distintos posibles son 2^:n = <b>:totale</b>. Pero tú, en este momento, estás guardando <b>uno solo</b>.',
  '<b>Tienilo da parte:</b> con 8 bit ci sono 256 configurazioni possibili, e il computer ne tiene <b>una</b>. Fra qualche livello vedrai 8 <i>qubit</i> che tengono tutte e 256 le ampiezze <b>insieme</b> — ed è lì che comincia la storia, non prima.':
    '<b>Guárdatelo:</b> con 8 bits hay 256 configuraciones posibles, y el ordenador guarda <b>una</b>. Dentro de unos niveles verás 8 <i>cúbits</i> que guardan las 256 amplitudes <b>a la vez</b> — y ahí es donde empieza la historia, no antes.',

  /* puertas lógicas */
  'Il banco delle porte logiche': 'El banco de las puertas lógicas',
  'accendi gli ingressi e guarda cosa esce': 'enciende las entradas y mira qué sale',
  'scopri quale porta è nascosta nella scatola': 'averigua qué puerta está escondida en la caja',
  'domande fatte alla scatola: :n — poi dichiara la porta qui sotto':
    'preguntas hechas a la caja: :n — luego declara la puerta aquí abajo',
  'esplora tutte e 4 le righe della tabella di :porta': 'explora las 4 filas de la tabla de :porta',
  'tocca gli ingressi A e B per cambiarli': 'toca las entradas A y B para cambiarlas',
  'uscita': 'salida',
  'tabella di verità': 'tabla de verdad',
  'porta al banco': 'puerta en el banco',
  'è :porta': 'es :porta',
  'banco libero': 'banco libre',
  'porta misteriosa': 'puerta misteriosa',
  '✓ era :porta, trovata con :n domande': '✓ era :porta, encontrada con :n preguntas',
  '✗ no: la tabella non torna. Guarda meglio le righe che hai già chiesto.':
    '✗ no: la tabla no cuadra. Mira mejor las filas que ya has pedido.',
  'Righe già chieste alla scatola: <b>:viste su 4</b>. Per essere <b>certo</b> di quale porta è, quante te ne servono?':
    'Filas ya pedidas a la caja: <b>:viste de 4</b>. Para estar <b>seguro</b> de qué puerta es, ¿cuántas necesitas?',
  'Indovinate: <b>:fatte/:totali</b>': 'Acertadas: <b>:fatte/:totali</b>',
  '<b>:porta</b>(:a, :b) = <b>:uscita</b>  ·  la sua tabella di verità per intero è <b>:firma</b>':
    '<b>:porta</b>(:a, :b) = <b>:uscita</b>  ·  su tabla de verdad entera es <b>:firma</b>',
  'Righe esplorate: <b>:viste/4</b>': 'Filas exploradas: <b>:viste/4</b>',
  "<b>Da notare:</b> per essere sicuro di quale porta c'è nella scatola devi provare <b>tutte e quattro</b> le combinazioni. La scatola risponde a una domanda per volta, e non c'è furbizia che tenga. Al livello 9 la stessa scatola, interrogata da un computer quantistico, risponderà a <b>tutte le combinazioni in una volta sola</b>.":
    '<b>Fíjate:</b> para estar seguro de qué puerta hay en la caja tienes que probar <b>las cuatro</b> combinaciones. La caja responde a una pregunta cada vez, y no hay astucia que valga. En el nivel 9 la misma caja, interrogada por un ordenador cuántico, responderá a <b>todas las combinaciones de una sola vez</b>.',

  /* taller de la NAND */
  "L'officina del NAND": 'El taller de la NAND',
  'una porta sola, e ci costruisci tutte le altre': 'una sola puerta, y con ella construyes todas las demás',
  'un NAND con lo stesso filo in tutti e due gli ingressi': 'una NAND con el mismo cable en las dos entradas',
  'NAND, e poi un NAND che fa da NOT': 'una NAND, y luego una NAND que hace de NOT',
  'nega A, nega B, e poi mettili in NAND (è De Morgan)': 'niega A, niega B, y luego mételos en una NAND (es De Morgan)',
  'quattro NAND: è il pezzo che il livello K·3 userà per sommare':
    'cuatro NAND: es la pieza que el nivel K·3 usará para sumar',
  'costruisci :porta usando solo NAND': 'construye :porta usando solo NAND',
  'la tua': 'la tuya',
  'ingresso 1': 'entrada 1',
  'ingresso 2': 'entrada 2',
  'uscita della rete': 'salida de la red',
  'La tua rete fa <b>:mia</b>, il bersaglio è <b>:bersaglio</b>.': 'Tu red da <b>:mia</b>, el objetivo es <b>:bersaglio</b>.',
  'Costruite finora: <b>:elenco</b>': 'Construidas hasta ahora: <b>:elenco</b>',
  'è esattamente :porta, fatta di soli NAND.': 'es exactamente :porta, hecha solo con NAND.',
  '<b>G1, G2, G3, G4</b> sono le quattro porte NAND che hai a disposizione — <b>G</b> sta per <i>gate</i>, porta. Per ognuna scegli da dove arrivano i suoi due ingressi: da A, da B, oppure dall\'uscita di una porta precedente.':
    '<b>G1, G2, G3, G4</b> son las cuatro puertas NAND que tienes — la <b>G</b> viene de <i>gate</i>, puerta. Para cada una eliges de dónde llegan sus dos entradas: de A, de B, o de la salida de una puerta anterior.',
  '<b>Uscita della rete</b> dice quale di quelle quattro porte leggi alla fine: il bit che esce da lei è il risultato di tutta la rete. Le altre porte, se non arrivano fin lì, non contano niente.':
    '<b>Salida de la red</b> dice cuál de esas cuatro puertas miras al final: el bit que sale de ella es el resultado de toda la red. Las demás puertas, si no llegan hasta ahí, no cuentan nada.',
  'gli ingressi sono due — tocca per cambiarli': 'las entradas son dos — tócalas para cambiarlas',
  'adesso stai provando il caso :caso, la colonna :caso qui sotto':
    'ahora estás probando el caso :caso, la columna :caso de aquí abajo',
  scollegata: 'sin conectar',
  'azzera la rete': 'reiniciar la red',
  'con A=:a e B=:b (colonna :caso):': 'con A=:a y B=:b (columna :caso):',
  '(:elenco non arrivano all\'uscita: non contano)': '(:elenco no llegan a la salida: no cuentan)',
  'La colonna azzurra è la stessa porta provata in tutti e quattro i casi: <b>un</b> bit alla volta, quattro volte.':
    'La columna azul es esa misma puerta probada en los cuatro casos: <b>un</b> bit cada vez, cuatro veces.',
  'Adesso dalla rete esce <b>un</b> bit solo: :bit. Le quattro cifre qui sotto sono le quattro risposte, una per ogni caso di A e B.':
    'Ahora de la red sale <b>un</b> solo bit: :bit. Las cuatro cifras de abajo son las cuatro respuestas, una por cada caso de A y B.',
  'nessuno, un filo va all\'indietro': 'ninguno, un cable va hacia atrás',
  'Hai usato :usate porte: lo stesso risultato si ottiene con :minimo. Guarda la catena: qualche porta rifà un lavoro già fatto (due NOT di fila si annullano).':
    'Has usado :usate puertas: el mismo resultado se consigue con :minimo. Mira la cadena: alguna puerta repite un trabajo ya hecho (dos NOT seguidos se anulan).',
  'E con :minimo porte, che è il minimo per questa ricetta.': 'Y con :minimo puertas, que es el mínimo de esta receta.',

  /* taller de la NAND — la receta, revelada paso a paso */
  '👣 fammi vedere i passi': '👣 enséñame los pasos',
  'nascondi i passi': 'ocultar los pasos',
  'passo successivo (:passo di :quanti)': 'paso siguiente (:passo de :quanti)',
  '<b>:passo.</b> G:gate: ingresso 1 = <b>:uno</b>, ingresso 2 = <b>:due</b> — :motivo Controlla G:gate: deve fare <b>:firma</b>.':
    '<b>:passo.</b> G:gate: entrada 1 = <b>:uno</b>, entrada 2 = <b>:due</b> — :motivo Comprueba G:gate: tiene que dar <b>:firma</b>.',
  '<b>:passo.</b> Uscita della rete = <b>G:gate</b>. Ecco :porta con :quante porte, e ogni passo si vede da solo nella catena qui sotto.':
    '<b>:passo.</b> Salida de la red = <b>G:gate</b>. Ahí tienes :porta con :quante puertas, y cada paso se ve solo en la cadena de aquí abajo.',
  'lo stesso filo nei due ingressi: «non (A e A)» è «non A».':
    'el mismo cable en las dos entradas: «no (A y A)» es «no A».',
  'un NAND è l\'AND rovesciato: 1110 è 0001 con gli 0 e gli 1 scambiati.':
    'una NAND es la AND del revés: 1110 es 0001 con los 0 y los 1 intercambiados.',
  'un NAND con lo stesso filo due volte fa da NOT: rovescia G1 e resta l\'AND.':
    'una NAND con el mismo cable dos veces hace de NOT: le da la vuelta a G1 y queda la AND.',
  'questo è NOT A.': 'esta es NOT A.',
  'e questo è NOT B.': 'y esta es NOT B.',
  'De Morgan: «non (non A e non B)» è «A oppure B».': 'De Morgan: «no (no A y no B)» es «A o B».',
  'il NAND di partenza: vale 0 solo quando A e B sono tutti e due 1.':
    'la NAND de partida: vale 0 solo cuando A y B son los dos 1.',
  'vale 0 solo nel caso A=1, B=0.': 'vale 0 solo en el caso A=1, B=0.',
  'vale 0 solo nel caso opposto, A=0, B=1.': 'vale 0 solo en el caso opuesto, A=0, B=1.',
  'il NAND dei due: dà 1 esattamente quando A e B sono diversi.':
    'la NAND de las dos: da 1 exactamente cuando A y B son distintos.',
  '<b>Perché conta:</b> un tipo solo di porta basta per costruire qualunque calcolo — si dice che il NAND è <b>universale</b>. Anche il computer quantistico ha i suoi insiemi universali di porte, e ci si arriva con lo stesso ragionamento: pochi mattoni, combinati, fanno tutto il resto.':
    '<b>Por qué importa:</b> un solo tipo de puerta basta para construir cualquier cálculo — se dice que la NAND es <b>universal</b>. El ordenador cuántico también tiene sus conjuntos universales de puertas, y se llega a ellos con el mismo razonamiento: pocos ladrillos, combinados, hacen todo lo demás.',

  /* sumador */
  'Il sommatore a :n bit': 'El sumador de :n bits',
  'metti tu i riporti, come si fa in colonna': 'pon tú los acarreos, como se hace en columna',
  'somma :a + :b in binario': 'suma :a + :b en binario',
  'tocca le caselle blu per metterci 0 o 1 — parti da destra, come in prima elementare':
    'toca las casillas azules para poner 0 o 1 — empieza por la derecha, como en primaria',
  'riporto': 'acarreo',
  'somma': 'suma',
  'sommate giuste: :fatte/:totali': 'sumas correctas: :fatte/:totali',
  'nuova somma': 'suma nueva',
  'mostrami la soluzione': 'muéstrame la solución',
  '(soluzione mostrata: questa non conta)': '(solución mostrada: esta no cuenta)',
  'In decimale: <b>:a + :b = :tot</b>. In binario le colonne si fanno una per volta, da destra: se la colonna fa 2, scrivi 0 e <b>porti 1</b>.':
    'En decimal: <b>:a + :b = :tot</b>. En binario las columnas se hacen una cada vez, desde la derecha: si la columna da 2, escribes 0 y <b>llevas 1</b>.',
  'Ogni colonna è due porte: <b>somma = A XOR B</b>, <b>riporto = A AND B</b>. Sono le stesse porte del livello K·2.':
    'Cada columna son dos puertas: <b>suma = A XOR B</b>, <b>acarreo = A AND B</b>. Son las mismas puertas del nivel K·2.',
  'colonne tutte giuste.': 'todas las columnas correctas.',
  '<b>Il punto da tenere:</b> il riporto passa da una colonna alla successiva, quindi le colonne vanno fatte <b>in ordine</b>. È una catena, e una catena non si accorcia mettendo più processori. Il sommatore quantistico ha lo stesso problema — e in più deve essere <b>reversibile</b>, cosa che il livello K·6 spiega.':
    '<b>Lo que hay que retener:</b> el acarreo pasa de una columna a la siguiente, así que las columnas hay que hacerlas <b>en orden</b>. Es una cadena, y una cadena no se acorta poniendo más procesadores. El sumador cuántico tiene el mismo problema — y además debe ser <b>reversible</b>, cosa que explica el nivel K·6.',

  /* búsqueda */
  'La caccia nello scaffale': 'La caza en la estantería',
  'apri le scatole finché non trovi il numero — e conta quante ne apri':
    'abre cajas hasta encontrar el número — y cuenta cuántas abres',
  'trova il numero :numero': 'encuentra el número :numero',
  'lo scaffale è ORDINATO: ogni scatola aperta ti dice anche da che parte continuare':
    'la estantería está ORDENADA: cada caja abierta te dice además hacia qué lado seguir',
  'lo scaffale è in disordine: una scatola aperta dice solo sé stessa':
    'la estantería está desordenada: una caja abierta solo habla de sí misma',
  'scatole aperte: :n': 'cajas abiertas: :n',
  'con il dimezzamento bastano :n aperture, sempre': 'dividiendo por la mitad bastan :n aperturas, siempre',
  'in media servono :n aperture, e nel caso peggiore :max': 'de media hacen falta :n aperturas, y en el peor caso :max',
  'scaffale in disordine': 'estantería desordenada',
  'scaffale ordinato': 'estantería ordenada',
  'nuova partita': 'partida nueva',
  'Ogni apertura ti dice «più grande» o «più piccolo», quindi puoi buttare via <b>metà</b> scaffale ogni volta: :n scatole → log₂(:n) ≈ <b>:passi aperture</b>.':
    'Cada apertura te dice «más grande» o «más pequeño», así que puedes tirar <b>media</b> estantería cada vez: :n cajas → log₂(:n) ≈ <b>:passi aperturas</b>.',
  "Nessun indizio: l'unica strategia è provare. Su :n scatole, in media <b>:media</b> aperture, nel caso peggiore <b>:n</b>.":
    'Ninguna pista: la única estrategia es probar. Sobre :n cajas, de media <b>:media</b> aperturas, en el peor caso <b>:n</b>.',
  'Scatole ancora possibili: <b>:rimaste</b> · aperture usate: <b>:mosse</b>':
    'Cajas todavía posibles: <b>:rimaste</b> · aperturas usadas: <b>:mosse</b>',
  'Record — disordine: <b>:a</b> · ordinato: <b>:b</b>': 'Récord — desorden: <b>:a</b> · ordenada: <b>:b</b>',
  'trovato in :n aperture!': '¡encontrado en :n aperturas!',
  '<b>Da ricordare per il livello 11:</b> se la lista è ordinata, dimezzare porta a log N ed è imbattibile. Se è in <b>disordine</b> — e senza struttura da sfruttare — il classico non può fare meglio di N/2 tentativi. Grover, su quello stesso scaffale disordinato, ne farà circa <b>√N</b>: su 10.000 scatole, 100 aperture invece di 5.000.':
    '<b>Para recordar de cara al nivel 11:</b> si la lista está ordenada, dividir por la mitad lleva a log N y es imbatible. Si está <b>desordenada</b> — y sin estructura que aprovechar — lo clásico no puede hacer mejor que N/2 intentos. Grover, en esa misma estantería desordenada, hará unos <b>√N</b>: sobre 10.000 cajas, 100 aperturas en vez de 5.000.',

  /* coste */
  'La gara delle crescite': 'La carrera de los crecimientos',
  'quante operazioni servono, al crescere del problema': 'cuántas operaciones hacen falta al crecer el problema',
  'meno di un microsecondo': 'menos de un microsegundo',
  'millisecondi': 'milisegundos',
  'secondi': 'segundos',
  'minuti': 'minutos',
  'ore': 'horas',
  'giorni': 'días',
  'anni': 'años',
  ":volte volte l'età dell'universo": ':volte veces la edad del universo',
  'trova il primo N per cui 2^N supera un anno di calcolo': 'encuentra el primer N para el que 2^N supera un año de cálculo',
  'un miliardo di operazioni al secondo, che è un computer normale':
    'mil millones de operaciones por segundo, que es un ordenador normal',
  'un anno di calcolo': 'un año de cálculo',
  'operazioni con 2^N': 'operaciones con 2^N',
  'dimensione del problema <b>N</b>': 'tamaño del problema <b>N</b>',
  "eccolo: da N = :n in poi la forza bruta non è più un'opzione.":
    'ahí está: a partir de N = :n la fuerza bruta deja de ser una opción.',
  '<b>La riga che spiega tutto il corso:</b> passare da N² a N·log N è una buona ottimizzazione. Passare da N a √N (Grover) è un bel guadagno. Passare da <b>2^N a N³</b> — da esponenziale a polinomiale, che è quello che fa Shor sulla fattorizzazione — non è una ottimizzazione: è la differenza fra «impossibile per sempre» e «fatto stasera».':
    '<b>La línea que explica todo el curso:</b> pasar de N² a N·log N es una buena optimización. Pasar de N a √N (Grover) es una buena ganancia. Pasar de <b>2^N a N³</b> — de exponencial a polinómico, que es lo que hace Shor con la factorización — no es una optimización: es la diferencia entre «imposible para siempre» y «hecho esta noche».',

  /* reversibilidad */
  'Avanti e indietro': 'Adelante y atrás',
  'la porta AND perde la strada di casa, Toffoli no': 'la puerta AND pierde el camino de vuelta, Toffoli no',
  "riporta i tre bit a com'erano all'inizio": 'devuelve los tres bits a como estaban al principio',
  'nessuna porta qui butta via niente: si torna indietro ripercorrendo la strada':
    'aquí ninguna puerta tira nada: se vuelve atrás rehaciendo el camino',
  'partenza': 'partida',
  'adesso': 'ahora',
  'porte applicate da te: :n': 'puertas aplicadas por ti: :n',
  'rimesse a posto: :n': 'devueltas a su sitio: :n',
  'nuova sfida': 'reto nuevo',
  'come si torna indietro?': '¿cómo se vuelve atrás?',
  "Queste cinque porte sono <b>reversibili</b>: da come esce si risale a com'era entrato, sempre. Basta rifare le stesse porte <b>in ordine inverso</b> — e ognuna di queste è l'inversa di sé stessa.":
    'Estas cinco puertas son <b>reversibles</b>: de cómo sale se llega siempre a cómo entró. Basta con rehacer las mismas puertas <b>en orden inverso</b> — y cada una de ellas es su propia inversa.',
  "Suggerimento: il computer ha applicato <b>:elenco</b>. Rifalle dall'ultima alla prima.":
    'Pista: el ordenador ha aplicado <b>:elenco</b>. Rehazlas de la última a la primera.',
  "Confronta con <b>AND</b>: da un'uscita 0 non si risale agli ingressi (potevano essere 00, 01 o 10). Quel bit è <b>perso</b>, e per la fisica «perso» significa <b>scaldato</b>: cancellare un bit costa almeno kT·ln2 ≈ 3·10⁻²¹ joule (Landauer, 1961; misurato in laboratorio da Bérut et al., 2012).":
    'Compara con <b>AND</b>: de una salida 0 no se llega a las entradas (podían ser 00, 01 o 10). Ese bit está <b>perdido</b>, y para la física «perdido» significa <b>calentado</b>: borrar un bit cuesta al menos kT·ln2 ≈ 3·10⁻²¹ julios (Landauer, 1961; medido en laboratorio por Bérut et al., 2012).',
  'tornato al punto di partenza in :n mosse.': 'vuelto al punto de partida en :n movimientos.',
  "<b>Il ponte:</b> le porte quantistiche sono <b>tutte</b> reversibili, senza eccezioni — è una conseguenza delle regole della fisica, non una scelta di ingegneria. Per questo un computer quantistico non può usare AND così com'è: deve usare Toffoli, che l'AND se lo tiene in un bit in più invece di buttarlo via.":
    '<b>El puente:</b> las puertas cuánticas son <b>todas</b> reversibles, sin excepciones — es una consecuencia de las reglas de la física, no una elección de ingeniería. Por eso un ordenador cuántico no puede usar AND tal cual: tiene que usar Toffoli, que se guarda el AND en un bit de más en vez de tirarlo.',

  /* oráculo clásico */
  'La scatola: costante o bilanciata?': 'La caja: ¿constante o equilibrada?',
  'La scatola con la stringa segreta': 'La caja con la cadena secreta',
  'ogni interrogazione conta — e si vede': 'cada consulta cuenta — y se ve',
  'scopri se la funzione nella scatola è costante o bilanciata':
    'averigua si la función de la caja es constante o equilibrada',
  'scopri la stringa segreta di :n bit': 'averigua la cadena secreta de :n bits',
  'domande fatte: :n — classicamente ne servono :max': 'preguntas hechas: :n — clásicamente hacen falta :max',
  'la tua domanda x': 'tu pregunta x',
  '✓ giusto, con :n domande.': '✓ correcto, con :n preguntas.',
  "✓ giusto! Un'altra scatola ti aspetta.": '✓ ¡correcto! Te espera otra caja.',
  '✗ no. Non hai ancora abbastanza informazione: chiedi ancora.':
    '✗ no. Todavía no tienes suficiente información: pregunta otra vez.',
  'interroga la scatola': 'interroga a la caja',
  'è costante': 'es constante',
  'è bilanciata': 'es equilibrada',
  'il segreto è la stringa che ho impostato': 'el secreto es la cadena que he puesto',
  'nuova scatola': 'caja nueva',
  "La scatola nasconde una funzione da 1 bit a 1 bit. <b>Costante</b> vuol dire che risponde sempre uguale; <b>bilanciata</b> che risponde 0 a un ingresso e 1 all'altro.":
    'La caja esconde una función de 1 bit a 1 bit. <b>Constante</b> quiere decir que responde siempre igual; <b>equilibrada</b>, que responde 0 a una entrada y 1 a la otra.',
  'Con una domanda sola non puoi mai deciderlo: qualunque risposta è compatibile con tutte e due i casi. Servono <b>2 domande su 2 ingressi possibili</b>.':
    'Con una sola pregunta nunca puedes decidirlo: cualquier respuesta es compatible con los dos casos. Hacen falta <b>2 preguntas sobre 2 entradas posibles</b>.',
  'La scatola nasconde :n bit segreti e risponde con il «prodotto» della tua domanda con il segreto (somma dei bit in comune, modulo 2).':
    'La caja esconde :n bits secretos y responde con el «producto» de tu pregunta con el secreto (suma de los bits en común, módulo 2).',
  'La strategia migliore è chiedere 1000…, 0100…, 0010… — un bit per volta. <b>:n domande per :n bit</b>: una a testa, non si scappa.':
    'La mejor estrategia es preguntar 1000…, 0100…, 0010… — un bit cada vez. <b>:n preguntas para :n bits</b>: una por cabeza, no hay escapatoria.',
  '<b>Segnati il numero: 2.</b> Con n bit invece di 1, il classico ha bisogno nel caso peggiore di <b>2ⁿ⁻¹+1</b> domande. Al livello 9 il computer quantistico ne farà <b>una</b>, e non perché è più veloce: perché fa una domanda diversa.':
    '<b>Apúntate el número: 2.</b> Con n bits en vez de 1, lo clásico necesita en el peor caso <b>2ⁿ⁻¹+1</b> preguntas. En el nivel 9 el ordenador cuántico hará <b>una</b>, y no porque sea más rápido: porque hace una pregunta distinta.',
  '<b>Segnati il numero: :n.</b> Una domanda per ogni bit del segreto, ed è dimostrato che meglio non si può fare classicamente. Al livello 10 Bernstein–Vazirani tirerà fuori tutta la stringa con <b>una sola</b> interrogazione.':
    '<b>Apúntate el número: :n.</b> Una pregunta por cada bit del secreto, y está demostrado que clásicamente no se puede hacer mejor. En el nivel 10 Bernstein–Vazirani sacará toda la cadena con <b>una sola</b> consulta.',

  /* código de repetición */
  'Il codice a ripetizione': 'El código de repetición',
  'dire la stessa cosa tre volte, e votare a maggioranza': 'decir lo mismo tres veces, y votar por mayoría',
  'manda almeno 200 bit e guarda le due percentuali separarsi':
    'manda al menos 200 bits y mira cómo se separan los dos porcentajes',
  'con rumore basso, ripetere conviene; con rumore alto, peggiora':
    'con ruido bajo, repetir compensa; con ruido alto, empeora',
  'bit da mandare': 'bit que mandar',
  'senza codice': 'sin código',
  'in tre copie': 'en tres copias',
  'voto': 'voto',
  'errori senza codice': 'errores sin código',
  'errori con le tre copie': 'errores con las tres copias',
  'probabilità che un bit si rovesci <b>p</b>': 'probabilidad de que un bit se dé la vuelta <b>p</b>',
  'manda 1 bit': 'manda 1 bit',
  'manda 100 bit': 'manda 100 bits',
  'azzera il conteggio': 'pon el contador a cero',
  'Senza codice sbagli con probabilità <b>p = :p%</b>. Con tre copie sbagli solo se si rovesciano <b>due o tre</b> copie: 3p² − 2p³ = <b>:teorico%</b>.':
    'Sin código te equivocas con probabilidad <b>p = :p%</b>. Con tres copias te equivocas solo si se dan la vuelta <b>dos o tres</b> copias: 3p² − 2p³ = <b>:teorico%</b>.',
  'Bit mandati: <b>:n</b> · errori senza codice: <b>:a</b> · errori con le copie: <b>:b</b>':
    'Bits mandados: <b>:n</b> · errores sin código: <b>:a</b> · errores con las copias: <b>:b</b>',
  "Sotto p = 50% ripetere <b>conviene</b>, e più copie metti meglio va: è la soglia sotto cui la correzione d'errore funziona.":
    'Por debajo de p = 50% repetir <b>compensa</b>, y cuantas más copias pongas mejor: es el umbral por debajo del cual la corrección de errores funciona.',
  "Sopra p = 50% ripetere <b>peggiora</b> le cose: la maggioranza vota per l'errore. Anche il quantistico ha la sua soglia, ed è il motivo per cui il livello 21 esiste.":
    'Por encima de p = 50% repetir <b>empeora</b> las cosas: la mayoría vota por el error. Lo cuántico también tiene su umbral, y es el motivo por el que existe el nivel 21.',
  "<b>Perché il quantistico non può copiare questo trucco così com'è:</b> ripetere vuol dire <b>copiare</b>, e un qubit non si può copiare (teorema di no-cloning, livello 6). E poi qui l'errore è uno solo — il bit si rovescia — mentre un qubit può sbagliare anche di <b>fase</b>. Il codice di Shor a 9 qubit risolve tutti e due i problemi in una volta.":
    '<b>Por qué lo cuántico no puede copiar este truco tal cual:</b> repetir quiere decir <b>copiar</b>, y un cúbit no se puede copiar (teorema de no clonación, nivel 6). Y además aquí el error es uno solo — el bit se da la vuelta — mientras que un cúbit puede equivocarse también de <b>fase</b>. El código de Shor de 9 cúbits resuelve los dos problemas a la vez.',

  /* ---------------- ejercicios emparejados: modo clásico → modo cuántico ---------------- */
  'Questo gioco calcola con un :macchina': 'Este juego calcula con un :macchina',
  'con un computer normale': 'con un ordenador normal',
  'con uno quantistico': 'con uno cuántico',

  /* el registro */
  'Lo stesso registro, due macchine': 'El mismo registro, dos máquinas',
  "tre caselle: prova a leggerle con l'una e con l'altra": 'tres casillas: prueba a leerlas con una máquina y con la otra',
  'leggi il registro 5 volte: esce sempre lo stesso?': 'lee el registro 5 veces: ¿sale siempre lo mismo?',
  'metti tutte e :n le caselle in sovrapposizione, poi leggi 20 volte':
    'pon las :n casillas en superposición y luego lee 20 veces',
  'un registro classico contiene UNA configurazione: le altre :quante non esistono da nessuna parte':
    'un registro clásico contiene UNA configuración: las otras :quante no existen en ninguna parte',
  'un registro quantistico porta :quante ampiezze insieme — ma la lettura ne restituisce una sola':
    'un registro cuántico lleva :quante amplitudes a la vez — pero la lectura devuelve una sola',
  'bit': 'bit',
  'qubit': 'cúbit',
  'dove sta il registro adesso': 'dónde está el registro ahora',
  'probabilità di ogni risultato': 'probabilidad de cada resultado',
  'letture: :n — valori diversi usciti: :diversi': 'lecturas: :n — valores distintos salidos: :diversi',
  'rovescia un bit a caso': 'da la vuelta a un bit al azar',
  'leggi il registro': 'lee el registro',
  'misura': 'mide',
  "Il registro contiene <b>:valore</b> e nient'altro. Le altre :quante configurazioni sono possibili, non presenti: nessuno le sta calcolando.":
    'El registro contiene <b>:valore</b> y nada más. Las otras :quante configuraciones son posibles, no presentes: nadie las está calculando.',
  'Leggerlo non lo cambia: puoi leggerlo mille volte e trovare mille volte lo stesso numero. Letture fatte: <b>:n</b>, valori diversi usciti: <b>:diversi</b>.':
    'Leerlo no lo cambia: puedes leerlo mil veces y encontrar mil veces el mismo número. Lecturas hechas: <b>:n</b>, valores distintos salidos: <b>:diversi</b>.',
  'Il circuito che hai montato accende <b>:piene ampiezze</b> su :totale. Con una H per qubit diventano tutte e :totale, ognuna con probabilità :p%.':
    'El circuito que has montado enciende <b>:piene amplitudes</b> de :totale. Con una H por cúbit se encienden las :totale, cada una con probabilidad :p%.',
  'La misura ne restituirà <b>una sola</b>, a caso — e quella che esce è tutto quello che ti resta.':
    'La medida devolverá <b>una sola</b>, al azar — y la que sale es todo lo que te queda.',
  "L'ultima misura ha fatto <b>collassare</b> lo stato su :valore: le altre ampiezze sono sparite. Premi ancora e il circuito riparte da capo, come su una macchina vera.":
    'La última medida ha hecho <b>colapsar</b> el estado en :valore: las demás amplitudes han desaparecido. Pulsa otra vez y el circuito se ejecuta desde cero, como en una máquina de verdad.',
  'Letture fatte: <b>:n</b>, valori diversi usciti: <b>:diversi</b>.':
    'Lecturas hechas: <b>:n</b>, valores distintos salidos: <b>:diversi</b>.',
  'fatto in questo modo.': 'hecho en este modo.',
  "<b>Quello che hai appena visto:</b> le barre sono lo stesso disegno nei due modi, e sono l'unica cosa che cambia. Una sola colonna piena contro :totale colonne insieme — ma la lettura, in tutti e due i casi, ti restituisce <b>una riga di :n cifre</b>. Il mestiere dell'informatica quantistica è far sì che la riga che esce sia quella che serve.":
    '<b>Lo que acabas de ver:</b> las barras son el mismo dibujo en los dos modos, y son lo único que cambia. Una sola columna llena frente a :totale columnas a la vez — pero la lectura, en los dos casos, te devuelve <b>una fila de :n cifras</b>. El oficio de la computación cuántica es conseguir que la fila que sale sea la que hace falta.',

  /* saltos contra rotaciones */
  'Salti contro rotazioni': 'Saltos contra rotaciones',
  'la stessa lancetta, e cosa le si può fare': 'la misma aguja, y qué se le puede hacer',
  "con un bit hai una porta sola che muove: NOT, e salta da un estremo all'altro":
    'con un bit tienes una sola puerta que mueve: NOT, y salta de un extremo al otro',
  'con un qubit ogni porta è una rotazione: H fa un quarto di giro, X mezzo':
    'con un cúbit cada puerta es una rotación: H gira un cuarto, X medio',
  'probabilità di leggere 0: :p0%  ·  di leggere 1: :p1%':
    'probabilidad de leer 0: :p0%  ·  de leer 1: :p1%',
  'nessuna porta classica arriva a metà: un bit è 0 oppure 1':
    'ninguna puerta clásica llega a la mitad: un bit es 0 o 1',
  'lascia stare (identità)': 'déjalo estar (identidad)',
  "Con un bit ci sono <b>due sole posizioni</b>: 0 e 1. L'unica porta che muove è NOT, e ti sbatte da una all'altra.":
    'Con un bit hay <b>solo dos posiciones</b>: 0 y 1. La única puerta que mueve es NOT, y te lanza de una a la otra.',
  'Il bersaglio a 90° <b>non è raggiungibile</b>, e non perché manchi la porta giusta: non esiste niente da mettere lì. Un bit «mezzo acceso» non è uno stato, è un guasto.':
    'El objetivo a 90° <b>no es alcanzable</b>, y no porque falte la puerta adecuada: no existe nada que poner ahí. Un bit «medio encendido» no es un estado, es una avería.',
  'Con un qubit la lancetta si muove con continuità: <b>H</b> è il quarto di giro che manda |0⟩ in |+⟩, X è mezzo giro, e le rotazioni fanno il resto.':
    'Con un cúbit la aguja se mueve con continuidad: <b>H</b> es el cuarto de vuelta que lleva |0⟩ a |+⟩, X es media vuelta, y las rotaciones hacen el resto.',
  "A 90° le due probabilità sono 50% e 50%. Sembra una moneta — e invece <b>applica H un'altra volta</b> e torni esattamente a |0⟩: una moneta mescolata due volte resta casuale, questa no.":
    'A 90° las dos probabilidades son 50% y 50%. Parece una moneda — y en cambio <b>aplica H otra vez</b> y vuelves exactamente a |0⟩: una moneda mezclada dos veces sigue siendo aleatoria, esto no.',
  'Mosse: :elenco': 'Movimientos: :elenco',
  'hai toccato il muro: è quello il punto.': 'has tocado el muro: ese es el punto.',
  'centrato, e classicamente era impossibile.': 'acertado, y clásicamente era imposible.',
  "<b>La differenza, detta bene:</b> una porta classica è una <b>tabella</b> (a ogni ingresso il suo uscita) e i valori possibili sono due. Una porta quantistica è una <b>rotazione</b>, e fra 0 e 1 c'è tutto un giro di posizioni intermedie. Le rotazioni si compongono e si disfano — ed è per questo che H·Z·H fa esattamente X.":
    '<b>La diferencia, dicha bien:</b> una puerta clásica es una <b>tabla</b> (a cada entrada su salida) y los valores posibles son dos. Una puerta cuántica es una <b>rotación</b>, y entre 0 y 1 hay toda una vuelta de posiciones intermedias. Las rotaciones se componen y se deshacen — y por eso H·Z·H da exactamente X.',

  /* los dos sobres (CHSH) */
  'La sfida delle due buste': 'El reto de los dos sobres',
  'Alice e Bob, lontani, senza potersi parlare': 'Alice y Bob, lejos, sin poder hablarse',
  'gioca 200 turni: quanto riesci a vincere?': 'juega 200 rondas: ¿cuánto consigues ganar?',
  'gioca 200 turni e supera il 78%': 'juega 200 rondas y supera el 78%',
  "l'accordo si prende PRIMA di partire: dopo, Alice e Bob non comunicano più":
    'el acuerdo se toma ANTES de separarse: después, Alice y Bob ya no se comunican',
  'stessa sfida, ma Alice e Bob condividono una coppia entangled':
    'mismo reto, pero Alice y Bob comparten un par entrelazado',
  'domanda: :d': 'pregunta: :d',
  'un accordo preso prima': 'un acuerdo tomado antes',
  'una coppia entangled': 'un par entrelazado',
  'turni vinti su :n giocati': 'rondas ganadas de :n jugadas',
  'muro classico 75%': 'muro clásico 75%',
  'quantistico 85%': 'cuántico 85%',
  'accordo di Alice e Bob (deciso prima di separarsi)': 'acuerdo de Alice y Bob (decidido antes de separarse)',
  'rispondiamo sempre 0': 'respondemos siempre 0',
  'rispondiamo sempre 1': 'respondemos siempre 1',
  'rispondiamo la nostra domanda': 'respondemos nuestra propia pregunta',
  'io la domanda, lui il contrario': 'yo mi pregunta, él lo contrario',
  'un turno': 'una ronda',
  '100 turni': '100 rondas',
  '200 turni': '200 rondas',
  "<b>La regola del turno:</b> l'arbitro manda una domanda (0 o 1) a ciascuno. La coppia vince se <code>rispostaA XOR rispostaB = domandaA AND domandaB</code>.":
    '<b>La regla de la ronda:</b> el árbitro manda una pregunta (0 o 1) a cada uno. La pareja gana si <code>respuestaA XOR respuestaB = preguntaA AND preguntaB</code>.',
  'Qualunque accordo preso prima è una tabella fissa: su quattro coppie di domande possibili, nessuna tabella ne indovina più di <b>tre</b>. Il muro è <b>75%</b>, e non lo si scavalca nemmeno tirando a sorte.':
    'Cualquier acuerdo tomado antes es una tabla fija: de cuatro pares de preguntas posibles, ninguna tabla acierta más de <b>tres</b>. El muro es el <b>75%</b>, y no se salta ni echándolo a suertes.',
  'Con una coppia entangled misurata negli angoli giusti la probabilità di vincere un turno è cos²(π/8) = <b>85,4%</b>. Non è una strategia più furba: è che le risposte <b>non esistevano</b> prima della misura.':
    'Con un par entrelazado medido en los ángulos adecuados la probabilidad de ganar una ronda es cos²(π/8) = <b>85,4%</b>. No es una estrategia más astuta: es que las respuestas <b>no existían</b> antes de la medida.',
  "Record — con le buste: <b>:a%</b> · con l'entanglement: <b>:b%</b>":
    'Récord — con los sobres: <b>:a%</b> · con el entrelazamiento: <b>:b%</b>',
  'hai misurato la differenza con le tue mani: è quella che ha vinto il Nobel nel 2022.':
    'has medido la diferencia con tus propias manos: es la que ganó el Nobel en 2022.',
  "<b>Perché questo conta più di «sono correlati»:</b> anche due buste sigillate sono correlate, e infatti arrivano al 75%. Il punto è il <b>sorpasso</b>: nessun accordo preso prima — nessuna informazione nascosta nelle particelle alla partenza — può superare quel muro. L'esperimento è stato fatto davvero, sempre più a prova di scappatoia, e il muro è stato superato: Aspect, Clauser e Zeilinger, Nobel 2022.":
    '<b>Por qué esto cuenta más que «están correlacionados»:</b> también dos sobres cerrados están correlacionados, y de hecho llegan al 75%. El punto es el <b>adelantamiento</b>: ningún acuerdo tomado antes — ninguna información escondida en las partículas al partir — puede superar ese muro. El experimento se ha hecho de verdad, cada vez más a prueba de escapatorias, y el muro se superó: Aspect, Clauser y Zeilinger, Nobel 2022.',

  /* dos caminos */
  'Due strade per lo stesso posto': 'Dos caminos al mismo sitio',
  'apri la seconda strada e guarda il rivelatore': 'abre el segundo camino y mira el detector',
  'prova a SPEGNERE il rivelatore aprendo la seconda strada':
    'intenta APAGAR el detector abriendo el segundo camino',
  'spegni il rivelatore tenendo aperte tutte e due le strade':
    'apaga el detector manteniendo abiertos los dos caminos',
  'in classico ogni strada porta una probabilità, e le probabilità si sommano':
    'en clásico cada camino lleva una probabilidad, y las probabilidades se suman',
  "in quantistico ogni strada porta un'ampiezza, che può essere negativa":
    'en cuántico cada camino lleva una amplitud, que puede ser negativa',
  'rivelatore': 'detector',
  'probabilità :v': 'probabilidad :v',
  'ampiezza :v': 'amplitud :v',
  'strada chiusa': 'camino cerrado',
  'arriva :a + :b = :tot': 'llega :a + :b = :tot',
  '(:a :segno :b)² = :tot': '(:a :segno :b)² = :tot',
  'al rivelatore arriva il :p%': 'al detector llega el :p%',
  'strada di sopra': 'camino de arriba',
  'strada di sotto': 'camino de abajo',
  'apri/chiudi la seconda strada': 'abre/cierra el segundo camino',
  'Le probabilità sono numeri fra 0 e 1 e si <b>sommano</b>. Aprire una strada in più non può far arrivare <b>meno</b> roba: al massimo la seconda strada porta zero.':
    'Las probabilidades son números entre 0 y 1 y se <b>suman</b>. Abrir un camino más no puede hacer que llegue <b>menos</b>: como mucho el segundo camino lleva cero.',
  'Prova quanto vuoi: con due strade aperte il rivelatore non si spegne mai. Non è un limite del gioco, è come funziona la probabilità.':
    'Prueba cuanto quieras: con dos caminos abiertos el detector no se apaga nunca. No es un límite del juego, es cómo funciona la probabilidad.',
  'Le ampiezze si sommano <b>prima</b> di diventare probabilità, e possono essere <b>negative</b>. Metti la seconda strada a −:a e guarda cosa succede: (:a − :a)² = <b>0</b>.':
    'Las amplitudes se suman <b>antes</b> de convertirse en probabilidades, y pueden ser <b>negativas</b>. Pon el segundo camino en −:a y mira qué pasa: (:a − :a)² = <b>0</b>.',
  "Due strade aperte, e non arriva niente. Chiudine una — <b>una qualsiasi</b> — e il rivelatore si riaccende. È l'interferenza distruttiva, ed è il motore di ogni algoritmo di questo corso.":
    'Dos caminos abiertos, y no llega nada. Cierra uno — <b>cualquiera de los dos</b> — y el detector se vuelve a encender. Es la interferencia destructiva, y es el motor de todos los algoritmos de este curso.',
  'confermato: in classico non si spegne.': 'confirmado: en clásico no se apaga.',
  'spento, con tutte e due le strade aperte.': 'apagado, con los dos caminos abiertos.',
  "<b>Questa è la differenza, ed è una sola:</b> un computer classico che «prova tante strade» somma probabilità, e sommare roba positiva fa sempre crescere il totale. Un computer quantistico somma ampiezze, che hanno un segno — e le strade sbagliate possono cancellarsi a vicenda prima che tu guardi. Tutto il resto del corso è imparare a scegliere i segni.":
    '<b>Esta es la diferencia, y es una sola:</b> un ordenador clásico que «prueba muchos caminos» suma probabilidades, y sumar cosas positivas siempre hace crecer el total. Un ordenador cuántico suma amplitudes, que tienen un signo — y los caminos equivocados pueden cancelarse entre sí antes de que mires. Todo el resto del curso es aprender a elegir los signos.',
  /* ---------------- glossary: panel, terms in the text ---------------- */
  'Glossario': 'Glosario',
  'Glossario — si apre anche col tasto G': 'Glosario — también se abre con la tecla G',
  'sempre qui · tasto G': 'siempre aquí · tecla G',
  'cerca un termine, o il numero di un livello…': 'busca un término, o el número de un nivel…',
  'Cerca nel glossario': 'Buscar en el glosario',
  'chiudi (Esc)': 'cerrar (Esc)',
  'chiudi': 'cerrar',
  'evidenzia i termini nel testo': 'resaltar los términos en el texto',
  'mappa completa →': 'mapa completo →',
  ':quanti termini': ':quanti términos',
  ':trovati di :totale': ':trovati de :totale',
  'Nessun termine con questa parola. Prova con una parola più corta, o chiedi al tutor 🎓.': 'Ningún término con esa palabra. Prueba con una más corta, o pregunta al tutor 🎓.',
  'liv. :n': 'niv. :n',
  'cosa vuol dire — tocca per la definizione': 'qué significa — toca para ver la definición',
  'tutto il glossario': 'todo el glosario',
  'Glossario dei termini': 'Glosario de términos',
  'tienilo aperto mentre leggi — si apre anche col tasto <b>G</b>, da qualsiasi livello. Le parole <span class="gloss-t">sottolineate così</span> nel testo danno la definizione al tocco.': 'tenlo abierto mientras lees — también se abre con la tecla <b>G</b>, desde cualquier nivel. Las palabras <span class="gloss-t">subrayadas así</span> en el texto dan la definición con un toque.',
  'Termine': 'Término',
  'Che cosa significa (in italiano vero)': 'Qué significa (en castellano de verdad)',
  'Livello': 'Nivel',

  /* the A–Z entries: one source for the panel, the bubbles and level 23 */
  'Ampiezza': 'Amplitud',
  "Il numero (in generale una freccia complessa) associato a un possibile risultato. Il suo <b>quadrato</b> è la probabilità. Può essere negativa: da qui l'interferenza.":
    'El número (en general una flecha compleja) asociado a un resultado posible. Su <b>cuadrado</b> es la probabilidad. Puede ser negativa: de ahí la interferencia.',
  "Ampiezza (di un'onda)": 'Amplitud (de una onda)',
  "Quanto è alta un'onda; nel suono è il volume.":
    'Cómo de alta es una onda; en el sonido es el volumen.',
  'Autostato / autovalore': 'Autoestado / autovalor',
  "Stato che un'operazione lascia identico a parte una fase; quella fase è l'autovalore.":
    'Estado que una operación deja idéntico salvo por una fase; esa fase es el autovalor.',
  'Base di misura': 'Base de medida',
  'La "direzione" lungo cui si misura. Misurare in base Z dà 0/1; in base X dà +/−. Non esiste uno stato certo in tutte le basi.':
    'La "dirección" a lo largo de la cual se mide. Medir en base Z da 0/1; en base X da +/−. No existe un estado que sea seguro en todas las bases.',
  'Bloch (sfera di)': 'Bloch (esfera de)',
  'Mappa di tutti gli stati di un qubit: nord |0⟩, sud |1⟩, equatore le sovrapposizioni al 50%.':
    'Mapa de todos los estados de un cúbit: norte |0⟩, sur |1⟩, ecuador las superposiciones al 50%.',
  'Born (regola di)': 'Born (regla de)',
  'Probabilità = |ampiezza|². Il ponte fra matematica e laboratorio.':
    'Probabilidad = |amplitud|². El puente entre las matemáticas y el laboratorio.',
  'Bra-ket': 'Bra-ket',
  'Notazione |ψ⟩ per gli stati (ket) e ⟨ψ| per i "duali" (bra). È solo una scatola per dire "questo è uno stato".':
    'Notación |ψ⟩ para los estados (ket) y ⟨ψ| para los "duales" (bra). Es solo una caja para decir "esto es un estado".',
  'CNOT': 'CNOT',
  'Porta a due qubit: ribalta il bersaglio solo se il controllo vale 1. Su una sovrapposizione crea entanglement.':
    'Puerta de dos cúbits: da la vuelta al objetivo solo si el control vale 1. Sobre una superposición crea entrelazamiento.',
  'Decoerenza': 'Decoherencia',
  "L'ambiente \"misura\" involontariamente il sistema e distrugge le fasi. Il nemico numero uno dell'hardware.":
    'El entorno "mide" involuntariamente el sistema y destruye las fases. El enemigo número uno del hardware.',
  'Dense coding': 'Codificación densa',
  'Mandare 2 bit classici trasmettendo 1 qubit, sfruttando entanglement già condiviso.':
    'Mandar 2 bits clásicos transmitiendo 1 cúbit, aprovechando entrelazamiento ya compartido.',
  'DFT': 'DFT',
  'Trasformata di Fourier discreta: "ruota ogni dato e somma" per scoprire le periodicità.':
    'Transformada discreta de Fourier: "rota cada dato y suma" para descubrir las periodicidades.',
  'Diffusore': 'Difusor',
  'In Grover: riflette le ampiezze attorno alla media, amplificando quella marcata.':
    'En Grover: refleja las amplitudes alrededor de la media, amplificando la marcada.',
  'Entanglement': 'Entrelazamiento',
  "Stato di più qubit che non si può descrivere qubit per qubit: l'informazione sta nella relazione.":
    'Estado de varios cúbits que no se puede describir cúbit a cúbit: la información está en la relación.',
  'Fase': 'Fase',
  "\"A che punto del giro sei\". Non cambia le probabilità, ma decide cosa si cancellerà. L'ingrediente segreto di tutto.":
    '"En qué punto de la vuelta estás". No cambia las probabilidades, pero decide qué se cancelará. El ingrediente secreto de todo.',
  'FFT': 'FFT',
  'Algoritmo classico che calcola la DFT in N·log N invece di N² (dividi et impera).':
    'Algoritmo clásico que calcula la DFT en N·log N en vez de N² (divide y vencerás).',
  'Frequenza': 'Frecuencia',
  'Quanti cicli al secondo (Hz). Inversa del periodo: f = 1/T.':
    'Cuántos ciclos por segundo (Hz). Inversa del periodo: f = 1/T.',
  'Grover': 'Grover',
  'Ricerca in √N tentativi invece di N/2. Guadagno quadratico, valido per qualunque ricerca senza struttura.':
    'Búsqueda en √N intentos en vez de N/2. Ganancia cuadrática, válida para cualquier búsqueda sin estructura.',
  'Hadamard (H)': 'Hadamard (H)',
  'La porta più importante: crea e disfa le sovrapposizioni. È lei che trasforma le fasi in probabilità osservabili.':
    'La puerta más importante: crea y deshace las superposiciones. Es ella la que convierte las fases en probabilidades observables.',
  'Interferenza': 'Interferencia',
  'Le ampiezze si sommano prima del quadrato: quelle concordi si rinforzano, quelle opposte si annullano.':
    'Las amplitudes se suman antes del cuadrado: las concordes se refuerzan, las opuestas se anulan.',
  'Misura': 'Medida',
  'Operazione irreversibile: sceglie un risultato a caso secondo |ampiezza|² e riscrive lo stato.':
    'Operación irreversible: elige un resultado al azar según |amplitud|² y reescribe el estado.',
  'No-cloning': 'No-clonación',
  'Non esiste una macchina che copia uno stato quantistico sconosciuto.':
    'No existe una máquina que copie un estado cuántico desconocido.',
  'Numero complesso': 'Número complejo',
  "Una freccia: lunghezza + angolo. e^{iθ} è la freccia lunga 1 all'angolo θ.":
    'Una flecha: longitud + ángulo. e^{iθ} es la flecha de longitud 1 en el ángulo θ.',
  'Oracolo': 'Oráculo',
  "Scatola nera che marca con un segno meno gli stati che soddisfano una condizione: scrive l'informazione nelle fasi.":
    'Caja negra que marca con un signo menos los estados que cumplen una condición: escribe la información en las fases.',
  'Periodo': 'Periodo',
  "Ogni quanto una cosa si ripete. Per un'onda T = 1/f; per la sequenza a^x mod N è dopo quanti passi si ritorna sull'1, ed è il numero che Shor va a cercare.":
    'Cada cuánto se repite algo. Para una onda T = 1/f; para la secuencia a^x mod N es tras cuántos pasos se vuelve al 1, y es el número que Shor va a buscar.',
  'Phase kickback': 'Phase kickback',
  'Il trucco per cui la fase generata da un oracolo "rimbalza" sul registro di controllo.':
    'El truco por el que la fase generada por un oráculo "rebota" sobre el registro de control.',
  'Porta (gate)': 'Puerta (gate)',
  'Operazione reversibile (unitaria) su uno o più qubit: sulla sfera è sempre una rotazione.':
    'Operación reversible (unitaria) sobre uno o más cúbits: en la esfera es siempre una rotación.',
  'Post-quantistica (crittografia)': 'Poscuántica (criptografía)',
  'Algoritmi classici resistenti a Shor e Grover; standardizzati dal NIST nel 2024.':
    'Algoritmos clásicos resistentes a Shor y Grover; estandarizados por el NIST en 2024.',
  'QFT': 'QFT',
  'Trasformata di Fourier sulle ampiezze: n²/2 porte, trasforma periodicità in picchi.':
    'Transformada de Fourier sobre las amplitudes: n²/2 puertas, convierte periodicidad en picos.',
  'QPE': 'QPE',
  'Stima di fase: copia una fase nei qubit di lettura e la rende misurabile con la QFT inversa.':
    'Estimación de fase: copia una fase en los cúbits de lectura y la hace medible con la QFT inversa.',
  'Qubit': 'Cúbit',
  'Unità elementare: due ampiezze, una per |0⟩ e una per |1⟩.':
    'Unidad elemental: dos amplitudes, una para |0⟩ y otra para |1⟩.',
  'Shor': 'Shor',
  'Fattorizzazione in tempo polinomiale, riducendo il problema alla ricerca di un periodo.':
    'Factorización en tiempo polinómico, reduciendo el problema a la búsqueda de un periodo.',
  'Sindrome (misura di)': 'Síndrome (medida de)',
  "Misura che rivela <b>dove</b> è avvenuto un errore senza rivelare l'informazione codificata.":
    'Medida que revela <b>dónde</b> ha ocurrido un error sin revelar la información codificada.',
  'Sovrapposizione': 'Superposición',
  'Stato in cui più risultati hanno ampiezza diversa da zero contemporaneamente.':
    'Estado en el que varios resultados tienen amplitud distinta de cero a la vez.',
  'SWAP': 'SWAP',
  'Porta che scambia due qubit; chiude il circuito della QFT.':
    'Puerta que intercambia dos cúbits; cierra el circuito de la QFT.',
  'Teletrasporto': 'Teletransporte',
  "Trasferire uno stato usando entanglement + 2 bit classici. L'originale viene distrutto.":
    'Transferir un estado usando entrelazamiento + 2 bits clásicos. El original se destruye.',
  'Unitaria (operazione)': 'Unitaria (operación)',
  'Conserva la probabilità totale ed è reversibile: tutte le porte lo sono, la misura no.':
    'Conserva la probabilidad total y es reversible: todas las puertas lo son, la medida no.',

  /* other written forms of each term, used only to spot it in the text */
  'ampiezze': 'amplitudes',
  'autostati, autovalore, autovalori': 'autoestados, autovalor, autovalores',
  'basi di misura, base Z, base X': 'bases de medida, base Z, base X',
  'sfera di Bloch': 'esfera de Bloch',
  'regola di Born': 'regla de Born',
  'bra, ket': 'bra, ket',
  'decoerente': 'decoherente',
  'codifica densa': 'dense coding',
  'trasformata di Fourier discreta': 'transformada discreta de Fourier',
  'entangled, entangolati': 'entrelazados, entangled',
  'fasi': 'fases',
  'frequenze': 'frecuencias',
  'Hadamard, porta H': 'Hadamard, puerta H',
  'interferenze, interferire, interferiscono': 'interferencias, interferir, interfieren',
  'misure, misurare, misurazione': 'medidas, medir, medición',
  'teorema di no-cloning': 'teorema de no-clonación',
  'numeri complessi': 'números complejos',
  'oracoli': 'oráculos',
  'periodi, periodicità': 'periodos, periodicidad',
  'kickback': 'kickback',
  'porte, porta quantistica, gate': 'puertas, puerta cuántica, gate',
  'crittografia post-quantistica': 'criptografía poscuántica',
  'trasformata di Fourier quantistica': 'transformada de Fourier cuántica',
  'stima di fase': 'estimación de fase',
  'algoritmo di Shor': 'algoritmo de Shor',
  'misura di sindrome': 'síndrome, medida de síndrome',
  'sovrapposizioni': 'superposiciones',
  'teletrasportare': 'teletransportar',
  'unitaria, unitarie, operazione unitaria': 'unitaria, unitarias, operación unitaria',
  /* ---------------- livello 0·5: l'orologio dei numeri ---------------- */
  ":giri giri + :resto":
    ":giri vueltas + :resto",
  "<b>:numero</b> diviso :ore fa :giri con il resto di <b>:resto</b>.":
    "<b>:numero</b> dividido entre :ore da :giri con resto <b>:resto</b>.",
  "<b>Da portarsi dietro:</b> «mod» non è un'operazione strana, è <b>il resto della divisione</b>. E i numeri che finiscono nella stessa ora — 3, 10, 17, 24 con un quadrante da 7 — per l'orologio sono <b>la stessa cosa</b>. Nel livello di Shor l'orologio avrà N ore, con N il numero da fattorizzare.":
    "<b>Para llevarte:</b> «mod» no es una operación rara, es <b>el resto de la división</b>. Y los números que caen en la misma hora — 3, 10, 17, 24 con una esfera de 7 — para el reloj son <b>la misma cosa</b>. En el nivel de Shor la esfera tendrá N horas, siendo N el número que hay que factorizar.",
  "<b>Perché ci servirà:</b> è l'algoritmo di Euclide, di circa 2300 anni fa, e in Shor è <b>l'ultimo passo</b>: trovato il periodo, i fattori del numero saltano fuori con due massimi comuni divisori. Su numeri da centinaia di cifre ci mette meno di un battito di ciglia — il collo di bottiglia è tutto altrove.":
    "<b>Por qué nos servirá:</b> es el algoritmo de Euclides, de hace unos 2300 años, y en Shor es <b>el último paso</b>: hallado el periodo, los factores del número salen con dos máximos comunes divisores. Con números de cientos de cifras tarda menos que un parpadeo: el cuello de botella está en otra parte.",
  "<b>Qui c'è tutto Shor:</b> fattorizzare un numero N si riduce a trovare questo ritmo r. Su un quadrante da 15 lo si vede a occhio; su un N da 600 cifre nemmeno tutti i computer del mondo messi insieme ci arrivano, perché i passi da provare sono troppi. Il computer quantistico non prova i passi uno per uno: li fa <b>tutti insieme</b> e poi usa la trasformata di Fourier per far emergere il ritmo. È il livello :n.":
    "<b>Aquí está todo Shor:</b> factorizar un número N se reduce a encontrar este ritmo r. En una esfera de 15 se ve a simple vista; con una N de 600 cifras no llegan ni todos los ordenadores del mundo juntos, porque los pasos que habría que probar son demasiados. El ordenador cuántico no prueba los pasos uno por uno: los hace <b>todos a la vez</b> y luego usa la transformada de Fourier para hacer emerger el ritmo. Es el nivel :n.",
  "Avanza sempre un rettangolo più piccolo: è per questo che il metodo finisce presto. Continua.":
    "Siempre sobra un rectángulo más pequeño: por eso el método termina pronto. Sigue.",
  "Contare a giri, il pavimento di Euclide e il ritmo di a^x mod N: la matematica classica che sta dentro Shor.":
    "Contar dando vueltas, el suelo de Euclides y el ritmo de a^x mod N: la matemática clásica que hay dentro de Shor.",
  "Esatto: r = :r. Prova ora un'altra coppia (N, a): il ritmo cambia.":
    "Exacto: r = :r. Prueba ahora otra pareja (N, a): el ritmo cambia.",
  "Il bersaglio è <b>:ora</b>: cerca un numero che finisca lì. Ce ne sono infiniti, distanti :ore l'uno dall'altro.":
    "El objetivo es <b>:ora</b>: busca un número que caiga ahí. Hay infinitos, separados exactamente por :ore.",
  "Il moltiplicatore (a)":
    "El multiplicador (a)",
  "Il numero da contare":
    "El número que hay que contar",
  "Il pavimento di Euclide":
    "El suelo de Euclides",
  "Il quadrante (N)":
    "La esfera (N)",
  "Il ritmo che torna":
    "El ritmo que vuelve",
  "L'orologio dei numeri":
    "El reloj de los números",
  "L'orologio dei numeri: resto, MCD e ritmi che tornano":
    "El reloj de los números: resto, MCD y ritmos que vuelven",
  "L'ultimo quadrato ha lato <b>:mcd</b>: è il righello più grande che misura per intero sia :a sia :b. Si chiama <b>massimo comune divisore</b>.":
    "El último cuadrado tiene lado <b>:mcd</b>: es la regla más larga que mide por entero tanto :a como :b. Se llama <b>máximo común divisor</b>.",
  "No: conta i passi disegnati, l'1 di partenza non si conta.":
    "No: cuenta los pasos dibujados, el 1 de partida no cuenta.",
  "Ogni passo è «moltiplica per :a e prendi il resto della divisione per :N». Continua finché non ricompare l'1.":
    "Cada paso es «multiplica por :a y toma el resto de la división entre :N». Sigue hasta que reaparezca el 1.",
  "Pavimento <b>:a × :b</b>. Quadrati posati finora (lato): :lati":
    "Suelo <b>:a × :b</b>. Cuadrados colocados hasta ahora (lado): :lati",
  "Quadrante <b>:N</b>, moltiplicatore <b>:a</b>. Passeggiata: :seq":
    "Esfera <b>:N</b>, multiplicador <b>:a</b>. Paseo: :seq",
  "Quante ore ha il quadrante":
    "Cuántas horas tiene la esfera",
  "Sei tornato sull'1 dopo <b>:quanti</b> passi. Quel numero si chiama <b>periodo</b> e si scrive r.":
    "Has vuelto al 1 tras <b>:quanti</b> pasos. Ese número se llama <b>periodo</b> y se escribe r.",
  "altra coppia":
    "otra pareja",
  "cambia bersaglio":
    "cambiar objetivo",
  "conta oltre la fine del quadrante e guarda dove ti fermi":
    "cuenta más allá del final de la esfera y mira dónde te paras",
  "sempre il più grande che ci sta — risolti: :fatte su :totali":
    "siempre el más grande que quepa — resueltos: :fatte de :totali",
  "copri :a × :b con quadrati":
    "cubre :a × :b con cuadrados",
  "porta la lancetta sul :ora":
    "para la aguja en :ora",
  "fino in fondo":
    "hasta el final",
  "il periodo è :n":
    "el periodo es :n",
  "moltiplica":
    "multiplica",
  "moltiplica sempre per lo stesso numero: quando ripassi dall'1?":
    "multiplica siempre por el mismo número: ¿cuándo vuelves a pasar por el 1?",
  "passi fatti: :quanti":
    "pasos dados: :quanti",
  "piastrelle quadrate, tutte uguali alla fine: quanto misura il lato?":
    "baldosas cuadradas, todas iguales: ¿cuánto mide el lado?",
  "premi «taglia» e guarda cosa avanza":
    "pulsa «corta» y mira lo que sobra",
  "torna sull'1 premendo ×:a":
    "vuelve al 1 pulsando ×:a",
  "ritmi trovati: :fatti su :totali":
    "ritmos encontrados: :fatti de :totali",
  "sul bersaglio! Numeri diversi trovati: :fatti su :totali":
    "¡en el objetivo! Números distintos encontrados: :fatti de :totali",
  "taglia un quadrato":
    "corta un cuadrado",
  "servono :totali numeri diversi — trovati: :fatti":
    "hacen falta :totali números distintos — encontrados: :fatti",
  "ultimo quadrato: lato :lato = MCD(:a, :b)":
    "último cuadrado: lado :lato = MCD(:a, :b)",
  /* ---------------- glossario: modulo, MCD, frazioni continue ---------------- */
  "Frazioni continue":
    "Fracciones continuas",
  "Il modo di trovare la frazione più semplice vicinissima a un numero decimale. In Shor traducono il numero misurato nel periodo cercato: il denominatore è la risposta.":
    "La forma de encontrar la fracción más simple pegadísima a un número decimal. En Shor traducen el número medido en el periodo buscado: el denominador es la respuesta.",
  "Il numero più grande che divide due numeri senza lasciare resto. Si trova con l'algoritmo di Euclide, ed è l'ultimo passo — tutto classico — dell'algoritmo di Shor.":
    "El número más grande que divide a dos números sin dejar resto. Se encuentra con el algoritmo de Euclides y es el último paso — completamente clásico — del algoritmo de Shor.",
  "Il resto della divisione: 17 mod 5 = 2. Contare «mod N» vuol dire contare a giri su un quadrante da N ore, come sull'orologio.":
    "El resto de la división: 17 mod 5 = 2. Contar «mod N» significa contar dando vueltas en una esfera de N horas, como en el reloj.",
  "MCD (massimo comune divisore)":
    "MCD (máximo común divisor)",
  "Modulo (mod)":
    "Módulo (mod)",
  "aritmetica modulare, mod":
    "aritmética modular, mod",
  "frazione continua":
    "fracción continua",
  "massimo comune divisore, massimi comuni divisori":
    "máximo común divisor, máximos comunes divisores",
  /* ---------------- livello 0·6: le matrici ---------------- */
  "<b>La regola sta tutta qui:</b> le due colonne della matrice sono i due posti dove finiscono le frecce di base. Sapendo quelli, sai dove finisce <b>qualunque</b> altra freccia — perché ogni freccia è una somma delle due di base. Non c'è altro da sapere su cosa fa una matrice.":
    "<b>Toda la regla está aquí:</b> las dos columnas de la matriz son los dos lugares donde acaban las flechas de base. Sabiendo esos, sabes dónde acaba <b>cualquier</b> otra flecha, porque toda flecha es una suma de las dos de base. No hay nada más que saber sobre lo que hace una matriz.",
  "<b>Perché la freccia resta sul cerchio:</b> X, Z e H sono matrici <b>unitarie</b>, cioè macchine che non allungano e non accorciano niente. Siccome la probabilità è il quadrato dell'ampiezza, una freccia sempre lunga 1 vuol dire probabilità che fanno sempre 100%. È la ragione per cui non esiste una porta quantistica che «perde» un pezzo di stato — e la ritroverai al livello :n.":
    "<b>Por qué la flecha se queda en el círculo:</b> X, Z y H son matrices <b>unitarias</b>, es decir, máquinas que no alargan ni acortan nada. Como la probabilidad es el cuadrado de la amplitud, una flecha siempre de longitud 1 significa probabilidades que siempre suman 100%. Por eso no existe una puerta cuántica que «pierda» un trozo de estado, y volverás a encontrarlo en el nivel :n.",
  "E hai appena dimostrato che <b>:mosse fanno la stessa cosa della X</b>: più macchine di fila sono una macchina sola.":
    "Y acabas de demostrar que <b>:mosse hacen lo mismo que la X</b>: varias máquinas seguidas son una sola máquina.",
  "Il puzzle delle porte":
    "El puzle de las puertas",
  "La freccia rossa (1, 0) finisce in (<b>:x</b>, <b>:y</b>) — che è la <b>prima colonna</b>.":
    "La flecha roja (1, 0) acaba en (<b>:x</b>, <b>:y</b>), que es la <b>primera columna</b>.",
  "La freccia verde (0, 1) finisce in (<b>:x</b>, <b>:y</b>) — che è la <b>seconda colonna</b>.":
    "La flecha verde (0, 1) acaba en (<b>:x</b>, <b>:y</b>), que es la <b>segunda columna</b>.",
  "La macchina a quattro manopole":
    "La máquina de cuatro mandos",
  "La macchina che trasforma le frecce: le matrici":
    "La máquina que transforma las flechas: las matrices",
  "La macchina, scritta come tabella:":
    "La máquina, escrita como tabla:",
  "Obiettivo: :puzzle. Prova una porta e guarda dove va la freccia — la lunghezza non cambia mai.":
    "Objetivo: :puzzle. Prueba una puerta y mira adónde va la flecha: la longitud no cambia nunca.",
  "Obiettivo: :sfida. Le frecce tratteggiate dicono dove devono arrivare.":
    "Objetivo: :sfida. Las flechas discontinuas dicen dónde tienen que llegar.",
  "Quattro manopole, due frecce e la scoperta che ogni porta quantistica è una tabella di numeri.":
    "Cuatro mandos, dos flechas y el descubrimiento de que cada puerta cuántica es una tabla de números.",
  "Questa macchina allunga o accorcia le frecce: nel quantistico non sarebbe una porta valida.":
    "Esta máquina alarga o acorta las flechas: en lo cuántico no sería una puerta válida.",
  "Questa macchina non cambia le lunghezze: nel quantistico sarebbe una porta valida.":
    "Esta máquina no cambia las longitudes: en lo cuántico sería una puerta válida.",
  "Stato: (<b>:zero</b> · <b>:uno</b>). Lunghezza della freccia: <b>:lung</b>.":
    "Estado: (<b>:zero</b> · <b>:uno</b>). Longitud de la flecha: <b>:lung</b>.",
  "altra sfida":
    "otro reto",
  "altro puzzle":
    "otro puzle",
  "ampiezza di |0⟩":
    "amplitud de |0⟩",
  "ampiezza di |1⟩":
    "amplitud de |1⟩",
  "arriva alla sovrapposizione (0,71 · 0,71)":
    "llega a la superposición (0,71 · 0,71)",
  "arriva alla sovrapposizione con il meno (0,71 · −0,71)":
    "llega a la superposición con el menos (0,71 · −0,71)",
  "bersaglio centrato in :n mosse: :mosse":
    "objetivo acertado en :n jugadas: :mosse",
  "gira le manopole e guarda dove finiscono le due frecce":
    "gira los mandos y mira dónde acaban las dos flechas",
  "gira tutto di 90° in senso antiorario":
    "gíralo todo 90° en sentido antihorario",
  "identità":
    "identidad",
  "lascia ferma la rossa e ribalta la verde":
    "deja quieta la roja y voltea la verde",
  "mosse: :mosse":
    "jugadas: :mosse",
  "porta lo stato da |0⟩ a |1⟩":
    "lleva el estado de |0⟩ a |1⟩",
  "probabilità: :zero% e :uno%":
    "probabilidades: :zero% y :uno%",
  "puzzle risolti: :fatti su :totali":
    "puzles resueltos: :fatti de :totali",
  "raddoppia la lunghezza di tutte e due":
    "duplica la longitud de las dos",
  "ribalta (Z)":
    "voltea (Z)",
  "rossa: dove finisce (1, 0)":
    "roja: dónde acaba (1, 0)",
  "scambia (X)":
    "intercambia (X)",
  "scambia le due frecce":
    "intercambia las dos flechas",
  "sfida risolta! Premi «altra sfida» per la prossima.":
    "¡reto resuelto! Pulsa «otro reto» para el siguiente.",
  "sfide risolte: :fatte su :totali":
    "retos resueltos: :fatte de :totali",
  "somma: :tot% — sempre":
    "suma: :tot% — siempre",
  "tre matrici, un bersaglio: quale sequenza ci arriva?":
    "tres matrices, un objetivo: ¿qué secuencia llega?",
  "verde: dove finisce (0, 1)":
    "verde: dónde acaba (0, 1)",
  /* ---------------- glossario: matrice ---------------- */
  "Matrice":
    "Matriz",
  "Una tabella di numeri che trasforma una freccia in un'altra. Le sue colonne dicono dove finiscono le frecce di base: da lì si ricava dove finisce qualunque altra freccia.":
    "Una tabla de números que convierte una flecha en otra. Sus columnas dicen dónde acaban las flechas de base: de ahí se deduce dónde acaba cualquier otra flecha.",
  "matrici, matrice 2×2":
    "matrices, matriz 2×2",
  /* ---------------- livello 18·b: autovettori e autovalori ---------------- */
  "<b>I nomi:</b> una freccia che la macchina lascia in linea con sé stessa si chiama <b>autovettore</b>; il numero per cui viene moltiplicata si chiama <b>autovalore</b>. Sono le due parole che aprono il livello :n — e la rotazione, che di autovettori reali non ne ha nessuno, spiega da sola perché nel quantistico gli autovalori sono <b>fasi</b> e non allungamenti.":
    "<b>Los nombres:</b> una flecha que la máquina deja en línea consigo misma se llama <b>autovector</b>; el número por el que queda multiplicada se llama <b>autovalor</b>. Son las dos palabras con las que empieza el nivel :n, y la rotación, que no tiene ningún autovector real, explica por sí sola por qué en lo cuántico los autovalores son <b>fases</b> y no estiramientos.",
  "<b>Questa è la stima di fase, fatta a mano.</b> Tu hai contato le applicazioni una per una: sono tante quante il denominatore della frazione di giro. Il livello :n fa la stessa identica cosa <b>in sovrapposizione</b> — applica U una volta, due, quattro, otto in parallelo, e poi con la trasformata di Fourier legge la fase da un picco solo. E se il conteggio ti ricorda il ritmo che tornava sull'orologio del livello :m, hai visto giusto: è la stessa matematica.":
    "<b>Esto es la estimación de fase, hecha a mano.</b> Tú has contado las aplicaciones una a una: son tantas como el denominador de la fracción de vuelta. El nivel :n hace exactamente lo mismo <b>en superposición</b>: aplica U una vez, dos, cuatro, ocho en paralelo, y luego con la transformada de Fourier lee la fase de un único pico. Y si el recuento te recuerda al ritmo que volvía en el reloj del nivel :m, has visto bien: es la misma matemática.",
  "Esatto: :n applicazioni per un giro intero, cioè :g° l'una. Prova un'altra porta.":
    "Exacto: :n aplicaciones para una vuelta entera, es decir :g° cada una. Prueba otra puerta.",
  "Fuori linea: la freccia in uscita punta da un'altra parte. Continua a girare.":
    "Fuera de línea: la flecha de salida apunta a otro sitio. Sigue girando.",
  "IN LINEA! ×:lambda":
    "¡EN LÍNEA! ×:lambda",
  "In linea! La macchina non ha girato questa freccia: l'ha solo moltiplicata per <b>:lambda</b>. È un <b>autovettore</b>, e :lambda è il suo <b>autovalore</b>.":
    "¡En línea! La máquina no ha girado esta flecha: solo la ha multiplicado por <b>:lambda</b>. Es un <b>autovector</b>, y :lambda es su <b>autovalor</b>.",
  "La caccia alle frecce che non girano":
    "La caza de las flechas que no giran",
  "La fase che si conta":
    "La fase que se cuenta",
  "La macchina da esaminare":
    "La máquina que examinar",
  "La porta U (di quanto gira la fase)":
    "La puerta U (cuánto gira la fase)",
  "La probabilità di leggere il risultato non è cambiata di un capello: la fase da sola non si vede. Si vede solo <b>facendola interferire</b> — ed è quello che fa la QFT.":
    "La probabilidad de leer el resultado no ha cambiado ni un pelo: la fase por sí sola no se ve. Solo se ve <b>haciéndola interferir</b>, que es lo que hace la QFT.",
  "Le frecce che la macchina non gira: autovettori e autovalori":
    "Las flechas que la máquina no gira: autovectores y autovalores",
  "Macchina: <b>:nome</b>. La tua freccia punta a :gradi°.":
    "Máquina: <b>:nome</b>. Tu flecha apunta a :gradi°.",
  "No: conta le applicazioni che hai fatto per tornare a casa.":
    "No: cuenta las aplicaciones que has hecho para volver a casa.",
  "Ogni applicazione di U gira la fase di <b>:g°</b>. Applicazioni fatte: <b>:n</b>, fase totale <b>:tot°</b>.":
    "Cada aplicación de U gira la fase <b>:g°</b>. Aplicaciones hechas: <b>:n</b>, fase total <b>:tot°</b>.",
  "Questa macchina ha :quante direzioni ferme.":
    "Esta máquina tiene :quante direcciones quietas.",
  "Questa macchina non ha nessuna direzione ferma: gira tutto. Con i soli numeri reali, qui non c'è niente da trovare.":
    "Esta máquina no tiene ninguna dirección quieta: lo gira todo. Solo con números reales aquí no hay nada que encontrar.",
  "Sei tornato a casa dopo <b>:n</b> applicazioni. Quindi ogni applicazione valeva <b>1/:n di giro</b>: hai misurato la fase contando.":
    "Has vuelto a casa tras <b>:n</b> aplicaciones. Así que cada aplicación valía <b>1/:n de vuelta</b>: has medido la fase contando.",
  "Trascina finché la freccia non resta in linea con sé stessa. E scopri che su quelle frecce una porta cambia solo la fase.":
    "Arrastra hasta que la flecha se quede en línea consigo misma. Y descubre que sobre esas flechas una puerta solo cambia la fase.",
  "applica U":
    "aplica U",
  "riporta la freccia a casa":
    "lleva la flecha a casa",
  "applicazioni: :n":
    "aplicaciones: :n",
  "cambia solo la fase":
    "solo cambia la fase",
  "casa":
    "casa",
  ":macchina — trovate :fatte su :totali":
    ":macchina — encontradas :fatte de :totali",
  "fase totale: :g°":
    "fase total: :g°",
  "fasi misurate: :fatte su :totali":
    "fases medidas: :fatte de :totali",
  "la porta H":
    "la puerta H",
  "la porta non muove lo stato: gli gira solo la freccia della fase":
    "la puerta no mueve el estado: solo le gira la flecha de la fase",
  "la rotazione di 90°: nessuna freccia resta in linea":
    "la rotación de 90°: ninguna flecha se queda en línea",
  "la tua freccia":
    "tu flecha",
  "lo scivolo: una sola direzione ferma":
    "el tobogán: una sola dirección quieta",
  "lo specchio: Z":
    "el espejo: Z",
  "lo stato non cambia:":
    "el estado no cambia:",
  "porta H":
    "puerta H",
  "probabilità: 100%":
    "probabilidad: 100%",
  "quella che esce dalla macchina":
    "la que sale de la máquina",
  "rotazione 90°":
    "rotación 90°",
  "ruota di poco":
    "gira un poco",
  "ruota indietro":
    "gira hacia atrás",
  "scivolo":
    "tobogán",
  "specchio Z":
    "espejo Z",
  "stira":
    "estira",
  "stira in orizzontale, schiaccia in verticale":
    "estira en horizontal, aplasta en vertical",
  "trascina la freccia: per quasi tutte la macchina cambia direzione. Per qualcuna no.":
    "arrastra la flecha: para casi todas la máquina cambia la dirección. Para alguna, no.",
  "un giro = :n applicazioni":
    "una vuelta = :n aplicaciones",
  /* ---------------- glossario: autostato ampliato ---------------- */
  "Stato (o freccia) che un'operazione lascia in linea con sé stesso: cambia solo per un fattore, l'autovalore. Su una porta quantistica quel fattore è una fase, ed è il numero che la stima di fase va a leggere.":
    "Estado (o flecha) que una operación deja en línea consigo mismo: solo cambia por un factor, el autovalor. En una puerta cuántica ese factor es una fase, y es el número que la estimación de fase va a leer.",
  "autostati, autovalore, autovalori, autovettore, autovettori":
    "autoestados, autovalor, autovalores, autovector, autovectores",
  "trova una direzione ferma":
    "encuentra una dirección quieta",
  /* ---------------- livello 15·b: la serie geometrica ---------------- */
  "<b>Il fatto sorprendente:</b> infiniti pezzi, totale finito. Mezzo più un quarto più un ottavo… non arriva mai a 2, ci si avvicina e basta. La formula che lo dice — <b>(1 − rⁿ)/(1 − r)</b> — è la stessa che fra un attimo farà nascere il picco della trasformata di Fourier: cambia solo che al posto di una frazione ci sarà una <b>rotazione</b>.":
    "<b>Lo sorprendente:</b> infinitos trozos, total finito. Un medio más un cuarto más un octavo… nunca llega a 2, solo se acerca. La fórmula que lo dice — <b>(1 − rⁿ)/(1 − r)</b> — es la misma que dentro de un momento hará nacer el pico de la transformada de Fourier: lo único que cambia es que en lugar de una fracción habrá una <b>rotación</b>.",
  "<b>Questa è la trasformata di Fourier, in una frase.</b> Per ogni frequenza di prova, la DFT gira i dati di un passo fisso e li somma: se il passo è sbagliato, la catena si chiude e viene zero; se è quello giusto, il passo è nullo, le frecce si allineano e nasce il <b>picco</b>. Il livello :n lo fa sui dati veri — ma il motivo per cui funziona è quello che hai appena mosso con il cursore.":
    "<b>Esto es la transformada de Fourier, en una frase.</b> Para cada frecuencia de prueba, la DFT gira los datos un paso fijo y los suma: si el paso es equivocado, la cadena se cierra y sale cero; si es el correcto, el paso es nulo, las flechas se alinean y nace el <b>pico</b>. El nivel :n lo hace con datos de verdad, pero el motivo por el que funciona es lo que acabas de mover con el cursor.",
  "Con la formula: (1 − :r^:n) / (1 − :r) = <b>:formula</b> — stesso numero, senza sommare a mano.":
    "Con la fórmula: (1 − :r^:n) / (1 − :r) = <b>:formula</b>, el mismo número sin sumar a mano.",
  "Con la formula: |sin(:n·Δ/2) / sin(Δ/2)| = <b>:formula</b>.":
    "Con la fórmula: |sin(:n·Δ/2) / sin(Δ/2)| = <b>:formula</b>.",
  "Di quanto gira ogni freccia in più (gradi)":
    "Cuánto gira de más cada flecha (grados)",
  "I pezzi che si rimpiccioliscono":
    "Los trozos que se encogen",
  "La catena di frecce":
    "La cadena de flechas",
  "La catena si è chiusa: le frecce fanno un giro esatto e si annullano a vicenda. Somma zero — non \"piccola\": zero.":
    "La cadena se ha cerrado: las flechas dan una vuelta exacta y se anulan entre sí. Suma cero, no «pequeña»: cero.",
  "La serie geometrica giocata con i pezzi e con le frecce. È la ragione per cui la trasformata di Fourier fa un picco.":
    "La serie geométrica jugada con trozos y con flechas. Es la razón por la que la transformada de Fourier hace un pico.",
  "Le frecce puntano un po' ovunque: la somma è un numero qualunque, né grande né nullo.":
    "Las flechas apuntan un poco a todas partes: la suma es un número cualquiera, ni grande ni nulo.",
  "Ogni pezzo è questa frazione del precedente":
    "Cada trozo es esta fracción del anterior",
  "Passo <b>:passo°</b>, <b>:n</b> frecce. Lunghezza della somma: <b>:mod</b> (su :n possibili).":
    "Paso <b>:passo°</b>, <b>:n</b> flechas. Longitud de la suma: <b>:mod</b> (de :n posibles).",
  "Passo nullo (o un giro intero): tutte le frecce puntano nello stesso verso e si sommano tutte. È il picco.":
    "Paso nulo (o una vuelta entera): todas las flechas apuntan en el mismo sentido y se suman. Ese es el pico.",
  "Quanti pezzi":
    "Cuántos trozos",
  "Se i pezzi non finissero mai: <b>:limite</b>. Il totale non supera mai quel muro, per quanti pezzi aggiungi.":
    "Si los trozos no acabaran nunca: <b>:limite</b>. El total nunca pasa de ese muro, por muchos trozos que añadas.",
  "Somma dei primi :n pezzi: <b>:tot</b>.":
    "Suma de los primeros :n trozos: <b>:tot</b>.",
  "Tante cose sommate: quando si accumulano e quando si annullano":
    "Muchas cosas sumadas: cuándo se acumulan y cuándo se anulan",
  "altro bersaglio":
    "otro objetivo",
  "bersaglio centrato!":
    "¡objetivo acertado!",
  "cambia obiettivo":
    "cambiar objetivo",
  "fai la somma più grande possibile":
    "haz la suma lo más grande posible",
  "fai sparire la somma":
    "haz desaparecer la suma",
  "il muro: :limite":
    "el muro: :limite",
  "lunghezza della somma: :mod su :n":
    "longitud de la suma: :mod de :n",
    "metà ogni volta":
    "la mitad cada vez",
  "obiettivi centrati: :fatti su :totali":
    "objetivos acertados: :fatti de :totali",
  "ogni pezzo è una frazione del precedente: dove si ferma il totale?":
    "cada trozo es una fracción del anterior: ¿dónde se para el total?",
  "porta il totale a :bersaglio":
    "lleva el total a :bersaglio",
  "stessa somma, ma ogni pezzo è girato di un passo fisso":
    "la misma suma, pero cada trozo está girado un paso fijo",
  "totale: :tot":
    "total: :tot",
  "totali centrati: :fatti su :totali":
    "totales acertados: :fatti de :totali",
  "un giro diviso il numero di frecce":
    "una vuelta dividida entre el número de flechas",
  /* ---------------- livello 21·b: pendenza e algoritmi variazionali ---------------- */
  ":curva — valli trovate: :fatte su :totali":
    ":curva — valles encontrados: :fatte de :totali",
  ":problema — minimi raggiunti: :fatti su :totali":
    ":problema — mínimos alcanzados: :fatti de :totali",
  "<b>Il nome:</b> questa pendenza si chiama <b>derivata</b>. Serve a una cosa sola, ma fondamentale: se vuoi far scendere un numero, la derivata ti dice da che parte muoverti e quando fermarti. È il motore di tutto l'apprendimento automatico — e, come vedrai fra un attimo, anche del quantistico che gira oggi sulle macchine vere.":
    "<b>El nombre:</b> esta pendiente se llama <b>derivada</b>. Sirve para una sola cosa, pero fundamental: si quieres hacer bajar un número, la derivada te dice hacia dónde moverte y cuándo parar. Es el motor de todo el aprendizaje automático y, como verás enseguida, también de la computación cuántica que hoy se ejecuta en máquinas de verdad.",
  "<b>Questo è il quantistico che gira oggi.</b> Nessuna macchina al mondo esegue ancora Shor su numeri veri, ma i metodi variazionali girano da anni su processori rumorosi: il quantistico prepara lo stato e misura, il classico gira le manopole. Il rumore lo hai visto: con pochi tiri la pendenza balla. E la parte che il classico non sa fare è proprio quella misura — lo stesso mestiere della stima di fase del livello :n, ma con un obiettivo diverso: non leggere un numero nascosto, bensì <b>abbassarne</b> uno.":
    "<b>Esto es la computación cuántica que se ejecuta hoy.</b> Ninguna máquina del mundo ejecuta todavía Shor sobre números reales, pero los métodos variacionales llevan años funcionando en procesadores ruidosos: lo cuántico prepara el estado y mide, lo clásico gira los mandos. El ruido ya lo has visto: con pocos disparos la pendiente baila. Y la parte que lo clásico no sabe hacer es justamente esa medida, el mismo oficio de la estimación de fase del nivel :n, pero con otro objetivo: no leer un número escondido, sino <b>bajar</b> uno.",
  "Curva: <b>:curva</b>. Sei in x = <b>:x</b>, l'altezza è <b>:y</b>.":
    "Curva: <b>:curva</b>. Estás en x = <b>:x</b>, la altura es <b>:y</b>.",
  "Dove sei sulla curva":
    "Dónde estás en la curva",
  "H = Z + 0,5·X":
    "H = Z + 0,5·X",
  "H = −0,4·Z + X":
    "H = −0,4·Z + X",
  "Il problema da risolvere":
    "El problema que resolver",
  "Il segno dice il verso: pendenza positiva → si scende andando a sinistra; negativa → a destra.":
    "El signo da el sentido: pendiente positiva → se baja hacia la izquierda; negativa → hacia la derecha.",
  "La curva":
    "La curva",
  "La derivata giocata come pendenza, e la discesa che i computer quantistici veri fanno adesso, rumore compreso.":
    "La derivada jugada como pendiente, y la bajada que los ordenadores cuánticos de verdad hacen ahora mismo, ruido incluido.",
  "La discesa variazionale":
    "La bajada variacional",
  "La manopola del circuito (θ)":
    "El mando del circuito (θ)",
  "La pendenza":
    "La pendiente",
  "La pendenza e il quantistico che gira oggi: VQE":
    "La pendiente y la computación cuántica que se ejecuta hoy: VQE",
  "La pendenza si misura <b>senza derivate approssimate</b>: si valuta la stessa energia con la manopola spostata di un quarto di giro avanti e indietro, e si divide per due. Qui: <b>:spost</b>, che è esattamente la pendenza vera.":
    "La pendiente se mide <b>sin derivadas aproximadas</b>: se evalúa la misma energía con el mando desplazado un cuarto de vuelta hacia delante y hacia atrás, y se divide entre dos. Aquí: <b>:spost</b>, que es exactamente la pendiente verdadera.",
  "Manopola a <b>:g°</b> → energia <b>:e</b>. Il fondo vale <b>:min</b>. Passi di discesa fatti: <b>:passi</b>.":
    "Mando a <b>:g°</b> → energía <b>:e</b>. El fondo vale <b>:min</b>. Pasos de bajada dados: <b>:passi</b>.",
  "Pendenza della retta che tocca la curva: <b>:p</b>. Misurata a mano con due punti vicini: <b>:num</b>.":
    "Pendiente de la recta que toca la curva: <b>:p</b>. Medida a mano con dos puntos cercanos: <b>:num</b>.",
  "Pendenza zero e curva che risale da tutte e due le parti: sei <b>in fondo a una valle</b>. È quello che cerca un algoritmo variazionale.":
    "Pendiente cero y curva que sube por los dos lados: estás <b>en el fondo de un valle</b>. Es lo que busca un algoritmo variacional.",
  "Pendenza zero, ma sei <b>in cima</b>: da qui si scende da entrambe le parti. Pendenza nulla non vuol dire minimo — è la trappola numero uno di questi metodi.":
    "Pendiente cero, pero estás <b>en la cima</b>: desde aquí se baja por los dos lados. Pendiente nula no significa mínimo; es la trampa número uno de estos métodos.",
  "Quanti tiri per ogni misura":
    "Cuántos disparos por medida",
  "Scendi: la pendenza dice da che parte. Con pochi tiri la misura balla, e i passi ballano con lei.":
    "Baja: la pendiente dice por dónde. Con pocos disparos la medida baila, y los pasos bailan con ella.",
  "Sei in fondo. Questo numero è la risposta che il VQE cerca: la minima energia raggiungibile con quel circuito.":
    "Estás en el fondo. Este número es la respuesta que busca el VQE: la mínima energía alcanzable con ese circuito.",
  "abbassa l'energia":
    "baja la energía",
  "energia: :e":
    "energía: :e",
  "il computer quantistico misura, quello normale gira la manopola":
    "el ordenador cuántico mide, el normal gira el mando",
  "il fondo: :e":
    "el fondo: :e",
  "l'onda":
    "la onda",
  "la valle":
    "el valle",
  "la valle doppia":
    "el valle doble",
  "misura la pendenza":
    "mide la pendiente",
  "muovi il punto: la retta che lo tocca dice da che parte si scende":
    "mueve el punto: la recta que lo toca dice por dónde se baja",
  "pendenza misurata con :tiri tiri: :p (esatta: :vera)":
    "pendiente medida con :tiri disparos: :p (exacta: :vera)",
  "pendenza: :p":
    "pendiente: :p",
  "pendenza a zero, in fondo":
    "pendiente a cero, en el fondo",
  "chiedila alla macchina: «misura la pendenza»":
    "pídesela a la máquina: «mide la pendiente»",
  "riparti da un punto a caso":
    "vuelve a empezar en un punto al azar",
  "scendi di un passo":
    "baja un paso",
  "scendi finché puoi":
    "baja todo lo que puedas",
  "si scende di qua":
    "se baja por aquí",
  /* ---------------- livello 0·7: equazioni e funzioni ---------------- */
  "<b>Il ponte con il quantistico:</b> una macchina si può percorrere all'indietro solo se non fa mai finire due numeri diversi nello stesso posto. Quando succede, l'informazione non è «difficile da recuperare»: <b>non c'è più</b>. È esattamente la reversibilità del livello :k, ed è il motivo per cui ogni porta quantistica dev'essere invertibile — nel livello :m lo vedrai scritto come «unitaria».":
    "<b>El puente con lo cuántico:</b> una máquina se puede recorrer hacia atrás solo si nunca manda dos números distintos al mismo sitio. Cuando ocurre, la información no es «difícil de recuperar»: <b>ya no está</b>. Es exactamente la reversibilidad del nivel :k, y es la razón por la que toda puerta cuántica tiene que ser invertible; en el nivel :m lo verás escrito como «unitaria».",
  "<b>La regola, tutta:</b> quello che fai a un piatto lo devi fare anche all'altro. Se lo fai, l'equilibrio regge e la risposta non cambia; se non lo fai, hai scritto una cosa falsa. La parola <b>algebra</b> viene proprio da qui: nel titolo del libro di al-Khwārizmī, intorno all'820, «al-jabr» vuol dire «rimettere a posto».":
    "<b>La regla, entera:</b> lo que le haces a un platillo se lo tienes que hacer al otro. Si lo haces, el equilibrio aguanta y la respuesta no cambia; si no, has escrito algo falso. La palabra <b>álgebra</b> viene justo de aquí: en el título del libro de al-Juarismi, hacia el 820, «al-yabr» significa «recomponer».",
  "Adesso la bilancia dice: <b>:sinistra = :destra</b>.":
    "Ahora la balanza dice: <b>:sinistra = :destra</b>.",
  "Da :y non si può risalire: per esempio :a e :b escono <b>tutti e due</b> come :uguale.":
    "Desde :y no se puede volver: por ejemplo :a y :b salen <b>los dos</b> como :uguale.",
  "Equazioni, formule girate e macchine che tornano indietro":
    "Ecuaciones, fórmulas giradas y máquinas que vuelven atrás",
  "Giusto: ci sono ingressi diversi con la stessa uscita, quindi dall'uscita non si può sapere da dove si veniva. L'informazione è persa.":
    "Correcto: hay entradas distintas con la misma salida, así que desde la salida no se puede saber de dónde se venía. La información se ha perdido.",
  "Giusto: nessun ingresso finisce dove ne finisce un altro, quindi dall'uscita si risale sempre.":
    "Correcto: ninguna entrada acaba donde acaba otra, así que desde la salida siempre se puede volver.",
  "Il numero che entra":
    "El número que entra",
  "La bilancia":
    "La balanza",
  "La bilancia che non si sbilancia mai, come si gira una formula, e la domanda che vale tutto: si può risalire da dove si è arrivati?":
    "La balanza que nunca se desequilibra, cómo se gira una fórmula y la pregunta que lo decide todo: ¿se puede volver desde donde has llegado?",
  "La macchina":
    "La máquina",
  "La macchina dei numeri":
    "La máquina de los números",
  "La x vale <b>:vera</b> anche adesso: qualunque mossa fatta su tutti e due i piatti lascia la risposta dov'era. Continua finché a sinistra non resta una scatola sola.":
    "La x vale <b>:vera</b> también ahora: cualquier jugada hecha en los dos platillos deja la respuesta donde estaba. Sigue hasta que a la izquierda quede una sola caja.",
  "Macchina <b>:nome</b>: entra <b>:x</b>, esce <b>:y</b>.":
    "Máquina <b>:nome</b>: entra <b>:x</b>, sale <b>:y</b>.",
  "No. Guarda se esistono due numeri diversi che escono uguali: se esistono, indietro non si torna.":
    "No. Mira si existen dos números distintos que salgan iguales: si existen, no se vuelve atrás.",
  "Prova a tornare indietro: da :y si risale a <b>:x</b>. Funziona per <b>ogni</b> numero, non solo per questo.":
    "Prueba a volver atrás: desde :y se llega a <b>:x</b>. Funciona para <b>cualquier</b> número, no solo para este.",
  "Risolta: <b>x = :valore</b>. Nota che la x valeva :valore fin dall'inizio — le mosse non l'hanno cambiata, l'hanno solo <b>messa in mostra</b>.":
    "Resuelta: <b>x = :valore</b>. Fíjate en que la x valía :valore desde el principio: las jugadas no la han cambiado, solo la han <b>sacado a la vista</b>.",
  "aggiungi 3":
    "suma 3",
  "altra equazione":
    "otra ecuación",
  "due numeri diversi, stessa uscita":
    "dos números distintos, la misma salida",
  "e attenzione:":
    "y atención:",
  "eleva al quadrato":
    "eleva al cuadrado",
  "entra":
    "entra",
  "equazioni risolte: :fatte su :totali":
    "ecuaciones resueltas: :fatte de :totali",
  "esce":
    "sale",
  "lascia una sola scatola, da sola":
    "deja una sola caja, ella sola",
  "macchine classificate: :fatte su :totali":
    "máquinas clasificadas: :fatte de :totali",
  "moltiplica per zero":
    "multiplica por cero",
  "nessuna mossa ancora":
    "todavía ninguna jugada",
  "no, è persa":
    "no, se ha perdido",
  "raddoppia":
    "duplica",
  "resto della divisione per 4":
    "resto de la división entre 4",
  "si può tornare indietro?":
    "¿se puede volver atrás?",
  "si torna indietro, e si ritrova esattamente il numero di partenza":
    "se vuelve atrás, y se recupera exactamente el número de partida",
  "sì, si torna indietro":
    "sí, se vuelve atrás",
  "togli e dividi da tutte e due le parti: la bilancia resta in equilibrio":
    "quita y divide en los dos lados: la balanza sigue en equilibrio",
  "un numero entra, uno esce: si può risalire a quello entrato?":
    "entra un número, sale otro: ¿se puede volver al que entró?",
};
