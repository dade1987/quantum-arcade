/* ============================================================
   ESPAÑOL — cadenas de la interfaz.

   La clave es la frase italiana tal como aparece en el código fuente:
   en js/core/i18n.js está explicado el porqué. Si falta una entrada, el
   texto vuelve al italiano, así que añadir una cadena al juego nunca
   rompe este archivo: solo deja una frase sin traducir hasta que
   alguien la complete.

   `npm run lingue` enumera lo que falta aquí.
   ============================================================ */

export default {
  /* ---------------- mapa, partes, rangos ---------------- */
  'Parte 0 — Le basi (per chi parte proprio da zero)': 'Parte 0 — Las bases (para quien empieza desde cero)',
  'Numeri, percentuali, coordinate, gradi, seno e coseno, probabilità. Per chi ha finito le medie. Facoltativa se le sai già.':
    'Números, porcentajes, coordenadas, grados, seno y coseno, probabilidad. Nivel de secundaria. Opcional si ya lo sabes.',
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
  'Mappa': 'Mapa',
  'Lingua': 'Idioma',
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
};
