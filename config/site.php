<?php

/*
 * GENERATED AUTOMATICALLY by tools/sync-site.mjs — do not edit by hand.
 * Source: public_html/js/core/levels.js and public_html/js/core/i18n.js
 *
 * The routes, the <head> of every page and the sitemap are all built from
 * here, so that a level renamed in one place cannot keep its old name in
 * another. Run `npm run sync` after touching levels.js.
 */

return [
    'locales' => [
        'it' => [
            'name' => 'Italiano',
            'tag' => 'it-IT',
            'prefix' => '',
            'lessons' => 'lezioni',
            'pages' => [
                'home' => '',
                'method' => 'metodo.html',
                'privacy' => 'privacy.html',
            ],
        ],
        'en' => [
            'name' => 'English',
            'tag' => 'en',
            'prefix' => 'en/',
            'lessons' => 'lessons',
            'pages' => [
                'home' => '',
                'method' => 'method.html',
                'privacy' => 'privacy.html',
            ],
        ],
        'es' => [
            'name' => 'Español',
            'tag' => 'es',
            'prefix' => 'es/',
            'lessons' => 'lecciones',
            'pages' => [
                'home' => '',
                'method' => 'metodo.html',
                'privacy' => 'privacidad.html',
            ],
        ],
    ],
    'levels' => [
        [
            'id' => '00-numeri',
            'n' => '0·1',
            'part' => '0',
            'xp' => 60,
            'slug' => [
                'it' => '00-numeri',
                'en' => '00-numbers',
                'es' => '00-numeros',
            ],
            'title' => [
                'it' => 'Numeri: negativi, metà, doppi, quadrati',
                'en' => 'Numbers: negatives, halves, doubles, squares',
                'es' => 'Números: negativos, mitades, dobles, cuadrados',
            ],
            'description' => [
                'it' => 'Linea dei numeri, percentuali, potenze di 2 e radice quadrata. Tutto giocato.',
                'en' => 'The number line, percentages, powers of 2 and square roots. All played, not read.',
                'es' => 'La recta numérica, porcentajes, potencias de 2 y raíz cuadrada. Todo jugado, no leído.',
            ],
        ],
        [
            'id' => '00-griglia',
            'n' => '0·2',
            'part' => '0',
            'xp' => 60,
            'slug' => [
                'it' => '00-griglia',
                'en' => '00-grid',
                'es' => '00-cuadricula',
            ],
            'title' => [
                'it' => 'Griglia, frecce e gradi',
                'en' => 'Grid, arrows and degrees',
                'es' => 'Cuadrícula, flechas y grados',
            ],
            'description' => [
                'it' => 'Coordinate come in battaglia navale e il giro completo di 360°.',
                'en' => 'Coordinates like in Battleship, and the full 360° turn.',
                'es' => 'Coordenadas como en los barquitos, y la vuelta completa de 360°.',
            ],
        ],
        [
            'id' => '00-seno',
            'n' => '0·3',
            'part' => '0',
            'xp' => 70,
            'slug' => [
                'it' => '00-seno',
                'en' => '00-sine',
                'es' => '00-seno',
            ],
            'title' => [
                'it' => 'Seno e coseno senza triangoli',
                'en' => 'Sine and cosine without triangles',
                'es' => 'Seno y coseno sin triángulos',
            ],
            'description' => [
                'it' => 'Le due ombre di un punto che gira. Il ponte fra i gradi e le onde.',
                'en' => 'The two shadows of a spinning point. The bridge between degrees and waves.',
                'es' => 'Las dos sombras de un punto que gira. El puente entre los grados y las ondas.',
            ],
        ],
        [
            'id' => '00-caso',
            'n' => '0·4',
            'part' => '0',
            'xp' => 60,
            'slug' => [
                'it' => '00-caso',
                'en' => '00-chance',
                'es' => '00-azar',
            ],
            'title' => [
                'it' => 'Il caso: monete, dadi, probabilità',
                'en' => 'Chance: coins, dice, probability',
                'es' => 'El azar: monedas, dados, probabilidad',
            ],
            'description' => [
                'it' => 'Lancia, conta, scopri che le percentuali si sistemano da sole.',
                'en' => 'Toss, count, and watch the percentages settle by themselves.',
                'es' => 'Lanza, cuenta y descubre que los porcentajes se ordenan solos.',
            ],
        ],
        [
            'id' => '00-orologio',
            'n' => '0·5',
            'part' => '0',
            'xp' => 80,
            'slug' => [
                'it' => '00-orologio',
                'en' => '00-clock',
                'es' => '00-reloj',
            ],
            'title' => [
                'it' => 'L\'orologio dei numeri: resto, MCD e ritmi che tornano',
                'en' => 'The clock of numbers: remainder, GCD and rhythms that come back',
                'es' => 'El reloj de los números: resto, MCD y ritmos que vuelven',
            ],
            'description' => [
                'it' => 'Contare a giri, il pavimento di Euclide e il ritmo di a^x mod N: la matematica classica che sta dentro Shor.',
                'en' => 'Counting in laps, Euclid\'s floor and the rhythm of a^x mod N: the classical maths that sits inside Shor.',
                'es' => 'Contar dando vueltas, el suelo de Euclides y el ritmo de a^x mod N: la matemática clásica que hay dentro de Shor.',
            ],
        ],
        [
            'id' => '00-matrici',
            'n' => '0·6',
            'part' => '0',
            'xp' => 90,
            'slug' => [
                'it' => '00-matrici',
                'en' => '00-matrices',
                'es' => '00-matrices',
            ],
            'title' => [
                'it' => 'La macchina che trasforma le frecce: le matrici',
                'en' => 'The machine that transforms arrows: matrices',
                'es' => 'La máquina que transforma las flechas: las matrices',
            ],
            'description' => [
                'it' => 'Quattro manopole, due frecce e la scoperta che ogni porta quantistica è una tabella di numeri.',
                'en' => 'Four knobs, two arrows and the discovery that every quantum gate is a table of numbers.',
                'es' => 'Cuatro mandos, dos flechas y el descubrimiento de que cada puerta cuántica es una tabla de números.',
            ],
        ],
        [
            'id' => '00-equazioni',
            'n' => '0·7',
            'part' => '0',
            'xp' => 80,
            'slug' => [
                'it' => '00-equazioni',
                'en' => '00-equations',
                'es' => '00-ecuaciones',
            ],
            'title' => [
                'it' => 'Equazioni, formule girate e macchine che tornano indietro',
                'en' => 'Equations, formulas turned around, and machines that go back',
                'es' => 'Ecuaciones, fórmulas giradas y máquinas que vuelven atrás',
            ],
            'description' => [
                'it' => 'La bilancia che non si sbilancia mai, come si gira una formula, e la domanda che vale tutto: si può risalire da dove si è arrivati?',
                'en' => 'The scale that never tips, how to turn a formula around, and the question that decides everything: can you work back from where you ended up?',
                'es' => 'La balanza que nunca se desequilibra, cómo se gira una fórmula y la pregunta que lo decide todo: ¿se puede volver desde donde has llegado?',
            ],
        ],
        [
            'id' => '00-secondogrado',
            'n' => '0·7b',
            'part' => '0',
            'xp' => 85,
            'slug' => [
                'it' => '00-secondogrado',
                'en' => '00-quadratics',
                'es' => '00-segundo-grado',
            ],
            'title' => [
                'it' => 'Secondo grado: la parabola e il quadrato a cui manca un angolo',
                'en' => 'Quadratics: the parabola and the square with a missing corner',
                'es' => 'Segundo grado: la parábola y el cuadrado al que le falta una esquina',
            ],
            'description' => [
                'it' => 'Il delta in tre parole, la formula costruita invece che imparata, e il «mai» che nel Cinquecento ha aperto la porta ai numeri immaginari.',
                'en' => 'The discriminant in three words, the formula built instead of memorised, and the «never» that opened the door to imaginary numbers in the sixteenth century.',
                'es' => 'El discriminante en tres palabras, la fórmula construida en vez de memorizada, y el «nunca» que en el siglo XVI abrió la puerta a los números imaginarios.',
            ],
        ],
        [
            'id' => '00-logaritmi',
            'n' => '0·8',
            'part' => '0',
            'xp' => 80,
            'slug' => [
                'it' => '00-logaritmi',
                'en' => '00-logarithms',
                'es' => '00-logaritmos',
            ],
            'title' => [
                'it' => 'Esponenziali e logaritmi: quante cifre servono',
                'en' => 'Exponentials and logarithms: how many digits it takes',
                'es' => 'Exponenciales y logaritmos: cuántas cifras hacen falta',
            ],
            'description' => [
                'it' => 'Quanti interruttori per mille casi, quante volte si può dimezzare, e perché «polinomiale nel numero di cifre» cambia tutto.',
                'en' => 'How many switches for a thousand cases, how many times you can halve, and why «polynomial in the number of digits» changes everything.',
                'es' => 'Cuántos interruptores para mil casos, cuántas veces se puede dividir por la mitad y por qué «polinómico en el número de cifras» lo cambia todo.',
            ],
        ],
        [
            'id' => '00-scalare',
            'n' => '0·9',
            'part' => '0',
            'xp' => 85,
            'slug' => [
                'it' => '00-scalare',
                'en' => '00-dot-product',
                'es' => '00-producto-escalar',
            ],
            'title' => [
                'it' => 'Quanto due frecce si somigliano: il prodotto scalare',
                'en' => 'How alike two arrows are: the dot product',
                'es' => 'Cuánto se parecen dos flechas: el producto escalar',
            ],
            'description' => [
                'it' => 'Un numero solo che dice se due frecce vanno d\'accordo. E la misura quantistica scoperta per quello che è: un\'ombra.',
                'en' => 'One number saying whether two arrows agree. And quantum measurement uncovered for what it is: a shadow.',
                'es' => 'Un solo número que dice si dos flechas se llevan bien. Y la medida cuántica descubierta por lo que es: una sombra.',
            ],
        ],
        [
            'id' => 'm1-polinomi',
            'n' => 'M·1',
            'part' => 'M',
            'xp' => 90,
            'slug' => [
                'it' => 'm1-polinomi',
                'en' => 'm1-polynomials',
                'es' => 'm1-polinomios',
            ],
            'title' => [
                'it' => 'Polinomi, Ruffini e la formula che non esiste',
                'en' => 'Polynomials, Ruffini, and the formula that does not exist',
                'es' => 'Polinomios, Ruffini y la fórmula que no existe',
            ],
            'description' => [
                'it' => 'Scomporre cercando i sospettati, la staffetta di Ruffini che è anche il modo più veloce di calcolare un polinomio, e il motivo per cui dal quinto grado in poi una formula non c\'è — e non ci sarà mai.',
                'en' => 'Factoring by questioning the suspects, Ruffini\'s relay which is also the fastest way to evaluate a polynomial, and the reason why from the fifth degree on there is no formula — and never will be.',
                'es' => 'Factorizar interrogando a los sospechosos, el relevo de Ruffini que es también la forma más rápida de calcular un polinomio, y el motivo por el que del quinto grado en adelante no hay fórmula — ni la habrá.',
            ],
        ],
        [
            'id' => 'm2-goniometria',
            'n' => 'M·2',
            'part' => 'M',
            'xp' => 90,
            'slug' => [
                'it' => 'm2-goniometria',
                'en' => 'm2-trigonometry',
                'es' => 'm2-trigonometria',
            ],
            'title' => [
                'it' => 'Girare due volte: le formule di addizione',
                'en' => 'Turning twice: the addition formulas',
                'es' => 'Girar dos veces: las fórmulas de adición',
            ],
            'description' => [
                'it' => 'L\'identità fondamentale che è Pitagora travestito, due giri che ne fanno uno solo — e la scoperta che ogni giro di Grover aggiunge 2θ.',
                'en' => 'The fundamental identity that is Pythagoras in disguise, two turns that make one — and the discovery that every Grover round adds 2θ.',
                'es' => 'La identidad fundamental que es Pitágoras disfrazado, dos giros que hacen uno solo — y el descubrimiento de que cada vuelta de Grover añade 2θ.',
            ],
        ],
        [
            'id' => 'm3-complessi',
            'n' => 'M·3',
            'part' => 'M',
            'xp' => 95,
            'slug' => [
                'it' => 'm3-complessi',
                'en' => 'm3-complex-numbers',
                'es' => 'm3-numeros-complejos',
            ],
            'title' => [
                'it' => 'Numeri complessi per bene: e^(iθ) e le radici dell\'unità',
                'en' => 'Complex numbers properly: e^(iθ) and the roots of unity',
                'es' => 'Números complejos como es debido: e^(iθ) y las raíces de la unidad',
            ],
            'description' => [
                'it' => 'Moltiplicare è allungare e girare, da lì la scrittura e^(iθ) — e le n frecce che sommate fanno zero, cioè il motore della trasformata di Fourier.',
                'en' => 'Multiplying is stretching and turning, hence the notation e^(iθ) — and the n arrows that add up to zero, the engine of the Fourier transform.',
                'es' => 'Multiplicar es alargar y girar, de ahí la escritura e^(iθ) — y las n flechas que sumadas dan cero, es decir el motor de la transformada de Fourier.',
            ],
        ],
        [
            'id' => 'm4-spazi',
            'n' => 'M·4',
            'part' => 'M',
            'xp' => 90,
            'slug' => [
                'it' => 'm4-spazi',
                'en' => 'm4-vector-spaces',
                'es' => 'm4-espacios-vectoriales',
            ],
            'title' => [
                'it' => 'Spazi vettoriali: base, dimensione, e perché 2^n',
                'en' => 'Vector spaces: basis, dimension, and why 2^n',
                'es' => 'Espacios vectoriales: base, dimensión y por qué 2^n',
            ],
            'description' => [
                'it' => 'Poche frecce che raggiungono tutto, il numero che non cambia qualunque base tu scelga, e la ragione per cui n qubit vivono in uno spazio di dimensione 2^n.',
                'en' => 'A few arrows that reach everything, the number that stays the same whichever basis you pick, and the reason n qubits live in a space of dimension 2^n.',
                'es' => 'Pocas flechas que lo alcanzan todo, el número que no cambia elijas la base que elijas, y la razón por la que n cúbits viven en un espacio de dimensión 2^n.',
            ],
        ],
        [
            'id' => 'm5-operatori',
            'n' => 'M·5',
            'part' => 'M',
            'xp' => 95,
            'slug' => [
                'it' => 'm5-operatori',
                'en' => 'm5-operators',
                'es' => 'm5-operadores',
            ],
            'title' => [
                'it' => 'Operatori: porte, osservabili e misure sono tre tipi di matrice',
                'en' => 'Operators: gates, observables and measurements are three kinds of matrix',
                'es' => 'Operadores: puertas, observables y medidas son tres tipos de matriz',
            ],
            'description' => [
                'it' => 'Unitaria = non cambia le lunghezze. Hermitiana = autovalori reali. Proiettore = rifarlo non cambia niente. Le tre parole della quantistica, costruite con quattro manopole.',
                'en' => 'Unitary = does not change lengths. Hermitian = real eigenvalues. Projector = redoing it changes nothing. The three words of quantum mechanics, built with four knobs.',
                'es' => 'Unitaria = no cambia las longitudes. Hermítica = autovalores reales. Proyector = rehacerlo no cambia nada. Las tres palabras de lo cuántico, construidas con cuatro mandos.',
            ],
        ],
        [
            'id' => 'm6-tensore',
            'n' => 'M·6',
            'part' => 'M',
            'xp' => 95,
            'slug' => [
                'it' => 'm6-tensore',
                'en' => 'm6-tensor-product',
                'es' => 'm6-producto-tensorial',
            ],
            'title' => [
                'it' => 'Prodotto tensoriale: e finalmente cosa vuol dire «entangled»',
                'en' => 'Tensor product: and finally what «entangled» means',
                'es' => 'Producto tensorial: y por fin qué significa «entrelazado»',
            ],
            'description' => [
                'it' => 'Mettere insieme due registri moltiplica le dimensioni invece di sommarle — e uno stato è entangled quando quel prodotto non si può disfare. Con il conto che lo dice in una riga.',
                'en' => 'Putting two registers together multiplies the dimensions instead of adding them — and a state is entangled when that product cannot be undone. With the one-line calculation that says so.',
                'es' => 'Juntar dos registros multiplica las dimensiones en vez de sumarlas — y un estado está entrelazado cuando ese producto no se puede deshacer. Con la cuenta que lo dice en una línea.',
            ],
        ],
        [
            'id' => 'k1-bit',
            'n' => 'K·1',
            'part' => 'K',
            'xp' => 80,
            'slug' => [
                'it' => 'k1-bit',
                'en' => 'k1-bit',
                'es' => 'k1-bit',
            ],
            'title' => [
                'it' => 'Il bit: acceso, spento, e come ci si scrive tutto',
                'en' => 'The bit: on, off, and how everything is written with it',
                'es' => 'El bit: encendido, apagado, y cómo se escribe todo con él',
            ],
            'description' => [
                'it' => 'Interruttori, binario, byte, testo. E il conto che tornerà: con n bit scegli UN numero fra 2ⁿ.',
                'en' => 'Switches, binary, bytes, text. And the count that keeps coming back: with n bits you pick ONE number out of 2ⁿ.',
                'es' => 'Interruptores, binario, byte, texto. Y la cuenta que volverá: con n bits eliges UN número entre 2ⁿ.',
            ],
        ],
        [
            'id' => 'k2-porte',
            'n' => 'K·2',
            'part' => 'K',
            'xp' => 80,
            'slug' => [
                'it' => 'k2-porte',
                'en' => 'k2-logic-gates',
                'es' => 'k2-puertas-logicas',
            ],
            'title' => [
                'it' => 'Porte logiche: AND, OR, NOT, XOR',
                'en' => 'Logic gates: AND, OR, NOT, XOR',
                'es' => 'Puertas lógicas: AND, OR, NOT, XOR',
            ],
            'description' => [
                'it' => 'Tabelle di verità giocate, e la scoperta che una porta sola basta per costruire tutte le altre.',
                'en' => 'Truth tables played, and the discovery that one single gate is enough to build all the others.',
                'es' => 'Tablas de verdad jugadas, y el descubrimiento de que una sola puerta basta para construir todas las demás.',
            ],
        ],
        [
            'id' => 'k3-somma',
            'n' => 'K·3',
            'part' => 'K',
            'xp' => 90,
            'slug' => [
                'it' => 'k3-somma',
                'en' => 'k3-addition',
                'es' => 'k3-suma',
            ],
            'title' => [
                'it' => 'La somma, come la fa davvero il processore',
                'en' => 'Addition, the way the processor really does it',
                'es' => 'La suma, tal como la hace de verdad el procesador',
            ],
            'description' => [
                'it' => 'Riporto, mezzo sommatore, sommatore completo: monti l\'addizione a 4 bit con le tue mani.',
                'en' => 'Carry, half adder, full adder: you build the 4-bit addition with your own hands.',
                'es' => 'Acarreo, semisumador, sumador completo: montas la suma de 4 bits con tus propias manos.',
            ],
        ],
        [
            'id' => 'k4-ricerca',
            'n' => 'K·4',
            'part' => 'K',
            'xp' => 80,
            'slug' => [
                'it' => 'k4-ricerca',
                'en' => 'k4-search',
                'es' => 'k4-busqueda',
            ],
            'title' => [
                'it' => 'Cercare: a tentoni, oppure dimezzando',
                'en' => 'Searching: groping around, or halving',
                'es' => 'Buscar: a tientas, o dividiendo por la mitad',
            ],
            'description' => [
                'it' => 'Ricerca lineare e ricerca binaria, contando i confronti uno per uno. Il metro di paragone di Grover.',
                'en' => 'Linear search and binary search, counting the comparisons one by one. The yardstick for Grover.',
                'es' => 'Búsqueda lineal y búsqueda binaria, contando las comparaciones una a una. La vara de medir de Grover.',
            ],
        ],
        [
            'id' => 'k5-costo',
            'n' => 'K·5',
            'part' => 'K',
            'xp' => 80,
            'slug' => [
                'it' => 'k5-costo',
                'en' => 'k5-cost',
                'es' => 'k5-coste',
            ],
            'title' => [
                'it' => 'Quanto costa un algoritmo: N, log N, N², 2ⁿ',
                'en' => 'What an algorithm costs: N, log N, N², 2ⁿ',
                'es' => 'Cuánto cuesta un algoritmo: N, log N, N², 2ⁿ',
            ],
            'description' => [
                'it' => 'La gara fra le curve di crescita. Qui si capisce che cosa significa davvero "vantaggio quantistico".',
                'en' => 'The race between growth curves. This is where "quantum advantage" starts to mean something.',
                'es' => 'La carrera entre las curvas de crecimiento. Aquí se entiende qué significa de verdad "ventaja cuántica".',
            ],
        ],
        [
            'id' => 'k6-reversibile',
            'n' => 'K·6',
            'part' => 'K',
            'xp' => 90,
            'slug' => [
                'it' => 'k6-reversibile',
                'en' => 'k6-reversible',
                'es' => 'k6-reversible',
            ],
            'title' => [
                'it' => 'Informazione che si perde: il ponte verso il quantistico',
                'en' => 'Information that gets lost: the bridge to quantum',
                'es' => 'Información que se pierde: el puente hacia lo cuántico',
            ],
            'description' => [
                'it' => 'AND butta via un bit, cancellare scalda (Landauer), Toffoli calcola all\'indietro. Da qui parte tutto.',
                'en' => 'AND throws a bit away, erasing releases heat (Landauer), Toffoli computes backwards. Everything starts here.',
                'es' => 'AND tira un bit, borrar calienta (Landauer), Toffoli calcula hacia atrás. De aquí sale todo.',
            ],
        ],
        [
            'id' => '01-qubit',
            'n' => '1',
            'part' => 'A',
            'xp' => 110,
            'slug' => [
                'it' => '01-qubit',
                'en' => '01-qubit',
                'es' => '01-qubit',
            ],
            'title' => [
                'it' => 'Il qubit: cos\'è davvero',
                'en' => 'The qubit: what it really is',
                'es' => 'El cúbit: qué es de verdad',
            ],
            'description' => [
                'it' => 'Fotoni, filtri polaroid, ampiezze e la differenza vera con una moneta truccata.',
                'en' => 'Photons, polaroid filters, amplitudes, and the real difference from a loaded coin.',
                'es' => 'Fotones, filtros polaroid, amplitudes y la diferencia real con una moneda trucada.',
            ],
        ],
        [
            'id' => '02-bloch',
            'n' => '2',
            'part' => 'A',
            'xp' => 100,
            'slug' => [
                'it' => '02-bloch',
                'en' => '02-bloch',
                'es' => '02-bloch',
            ],
            'title' => [
                'it' => 'La sfera di Bloch e la misura',
                'en' => 'The Bloch sphere and measurement',
                'es' => 'La esfera de Bloch y la medida',
            ],
            'description' => [
                'it' => 'Ruota la sfera col mouse, misura, guarda il collasso.',
                'en' => 'Spin the sphere with the mouse, measure, watch it collapse.',
                'es' => 'Gira la esfera con el ratón, mide y observa el colapso.',
            ],
        ],
        [
            'id' => '03-porte',
            'n' => '3',
            'part' => 'A',
            'xp' => 100,
            'slug' => [
                'it' => '03-porte',
                'en' => '03-gates',
                'es' => '03-puertas',
            ],
            'title' => [
                'it' => 'Le porte: X, Z, H e le rotazioni',
                'en' => 'Gates: X, Z, H and rotations',
                'es' => 'Las puertas: X, Z, H y las rotaciones',
            ],
            'description' => [
                'it' => 'Ogni porta è una rotazione. E H·Z·H = X è già mezzo algoritmo.',
                'en' => 'Every gate is a rotation. And H·Z·H = X is already half an algorithm.',
                'es' => 'Cada puerta es una rotación. Y H·Z·H = X ya es medio algoritmo.',
            ],
        ],
        [
            'id' => '04-due-qubit',
            'n' => '4',
            'part' => 'A',
            'xp' => 120,
            'slug' => [
                'it' => '04-due-qubit',
                'en' => '04-two-qubits',
                'es' => '04-dos-qubits',
            ],
            'title' => [
                'it' => 'Due qubit, CNOT ed entanglement',
                'en' => 'Two qubits, CNOT and entanglement',
                'es' => 'Dos cúbits, CNOT y entrelazamiento',
            ],
            'description' => [
                'it' => 'Da 2 ampiezze a 4. Stati di Bell e correlazioni impossibili.',
                'en' => 'From 2 amplitudes to 4. Bell states and impossible correlations.',
                'es' => 'De 2 amplitudes a 4. Estados de Bell y correlaciones imposibles.',
            ],
        ],
        [
            'id' => '05-circuiti',
            'n' => '5',
            'part' => 'A',
            'xp' => 110,
            'slug' => [
                'it' => '05-circuiti',
                'en' => '05-circuits',
                'es' => '05-circuitos',
            ],
            'title' => [
                'it' => 'Il laboratorio dei circuiti',
                'en' => 'The circuit laboratory',
                'es' => 'El laboratorio de circuitos',
            ],
            'description' => [
                'it' => 'Sandbox: costruisci circuiti a 3 qubit, simula, misura, sperimenta.',
                'en' => 'Sandbox: build 3-qubit circuits, simulate, measure, experiment.',
                'es' => 'Zona libre: construye circuitos de 3 cúbits, simula, mide, experimenta.',
            ],
        ],
        [
            'id' => '06-teletrasporto',
            'n' => '6',
            'part' => 'A',
            'xp' => 120,
            'slug' => [
                'it' => '06-teletrasporto',
                'en' => '06-teleportation',
                'es' => '06-teletransporte',
            ],
            'title' => [
                'it' => 'No-cloning, teletrasporto e dense coding',
                'en' => 'No-cloning, teleportation and dense coding',
                'es' => 'No-clonación, teletransporte y codificación densa',
            ],
            'description' => [
                'it' => 'Perché non puoi copiare un qubit, e cosa puoi fare invece.',
                'en' => 'Why you cannot copy a qubit, and what you can do instead.',
                'es' => 'Por qué no puedes copiar un cúbit, y qué puedes hacer en su lugar.',
            ],
        ],
        [
            'id' => '07-interferenza',
            'n' => '7',
            'part' => 'B',
            'xp' => 100,
            'slug' => [
                'it' => '07-interferenza',
                'en' => '07-interference',
                'es' => '07-interferencia',
            ],
            'title' => [
                'it' => 'Interferenza: quando le possibilità si cancellano',
                'en' => 'Interference: when possibilities cancel out',
                'es' => 'Interferencia: cuando las posibilidades se anulan',
            ],
            'description' => [
                'it' => 'Il meccanismo unico che sta sotto a ogni algoritmo quantistico.',
                'en' => 'The single mechanism underneath every quantum algorithm.',
                'es' => 'El único mecanismo que hay debajo de todo algoritmo cuántico.',
            ],
        ],
        [
            'id' => '08-frecce',
            'n' => '8',
            'part' => 'B',
            'xp' => 120,
            'slug' => [
                'it' => '08-frecce',
                'en' => '08-arrows',
                'es' => '08-flechas',
            ],
            'title' => [
                'it' => 'Le frecce: numeri complessi ed e^{iθ}',
                'en' => 'Arrows: complex numbers and e^{iθ}',
                'es' => 'Las flechas: números complejos y e^{iθ}',
            ],
            'description' => [
                'it' => 'Quando il "più o meno" non basta più: fasi intermedie e rotazioni.',
                'en' => 'When "plus or minus" is no longer enough: in-between phases and rotations.',
                'es' => 'Cuando el "más o menos" ya no basta: fases intermedias y rotaciones.',
            ],
        ],
        [
            'id' => '09-deutsch',
            'n' => '9',
            'part' => 'B',
            'xp' => 130,
            'slug' => [
                'it' => '09-deutsch',
                'en' => '09-deutsch',
                'es' => '09-deutsch',
            ],
            'title' => [
                'it' => 'Oracoli e Deutsch–Jozsa',
                'en' => 'Oracles and Deutsch–Jozsa',
                'es' => 'Oráculos y Deutsch–Jozsa',
            ],
            'description' => [
                'it' => 'Il primo algoritmo che batte il classico: 1 domanda invece di 2^{n−1}+1.',
                'en' => 'The first algorithm that beats the classical one: 1 query instead of 2^{n−1}+1.',
                'es' => 'El primer algoritmo que gana al clásico: 1 consulta en vez de 2^{n−1}+1.',
            ],
        ],
        [
            'id' => '10-bernstein',
            'n' => '10',
            'part' => 'B',
            'xp' => 110,
            'slug' => [
                'it' => '10-bernstein',
                'en' => '10-bernstein',
                'es' => '10-bernstein',
            ],
            'title' => [
                'it' => 'Bernstein–Vazirani: la stringa segreta',
                'en' => 'Bernstein–Vazirani: the secret string',
                'es' => 'Bernstein–Vazirani: la cadena secreta',
            ],
            'description' => [
                'it' => 'Indovina n bit segreti con una sola interrogazione.',
                'en' => 'Guess n secret bits with a single query.',
                'es' => 'Adivina n bits secretos con una sola consulta.',
            ],
        ],
        [
            'id' => '11-grover',
            'n' => '11',
            'part' => 'B',
            'xp' => 130,
            'slug' => [
                'it' => '11-grover',
                'en' => '11-grover',
                'es' => '11-grover',
            ],
            'title' => [
                'it' => 'Grover: amplificare la risposta giusta',
                'en' => 'Grover: amplifying the right answer',
                'es' => 'Grover: amplificar la respuesta correcta',
            ],
            'description' => [
                'it' => 'Guarda le barre delle ampiezze crescere passo dopo passo (e poi ricalare!).',
                'en' => 'Watch the amplitude bars grow step after step (and then shrink again!).',
                'es' => 'Mira crecer las barras de las amplitudes paso a paso (¡y luego bajar!).',
            ],
        ],
        [
            'id' => '12-simon',
            'n' => '12',
            'part' => 'B',
            'xp' => 150,
            'slug' => [
                'it' => '12-simon',
                'en' => '12-simon',
                'es' => '12-simon',
            ],
            'title' => [
                'it' => 'Simon: il periodo nascosto',
                'en' => 'Simon: the hidden period',
                'es' => 'Simon: el periodo escondido',
            ],
            'description' => [
                'it' => 'Il primo vantaggio ESPONENZIALE dimostrato. E il ponte diretto verso Shor.',
                'en' => 'The first proven EXPONENTIAL speed-up. And the direct bridge to Shor.',
                'es' => 'La primera ventaja EXPONENCIAL demostrada. Y el puente directo hacia Shor.',
            ],
        ],
        [
            'id' => '13-onde',
            'n' => '13',
            'part' => 'C',
            'xp' => 80,
            'slug' => [
                'it' => '13-onde',
                'en' => '13-waves',
                'es' => '13-ondas',
            ],
            'title' => [
                'it' => 'L\'onda: ampiezza, periodo, frequenza',
                'en' => 'The wave: amplitude, period, frequency',
                'es' => 'La onda: amplitud, periodo, frecuencia',
            ],
            'description' => [
                'it' => 'Ci serve per il passo successivo. Muovi i cursori e senti cosa cambia.',
                'en' => 'We need it for the next step. Move the sliders and hear what changes.',
                'es' => 'Nos hace falta para el paso siguiente. Mueve los deslizadores y escucha qué cambia.',
            ],
        ],
        [
            'id' => '14-fase',
            'n' => '14',
            'part' => 'C',
            'xp' => 80,
            'slug' => [
                'it' => '14-fase',
                'en' => '14-phase',
                'es' => '14-fase',
            ],
            'title' => [
                'it' => 'La fase delle onde e i battimenti',
                'en' => 'Wave phase and beats',
                'es' => 'La fase de las ondas y los batidos',
            ],
            'description' => [
                'it' => 'La stessa onda, spostata: dalla fase del qubit alla fase delle onde.',
                'en' => 'The same wave, shifted: from the phase of a qubit to the phase of a wave.',
                'es' => 'La misma onda, desplazada: de la fase del cúbit a la fase de las ondas.',
            ],
        ],
        [
            'id' => '15-somma-onde',
            'n' => '15',
            'part' => 'C',
            'xp' => 90,
            'slug' => [
                'it' => '15-somma-onde',
                'en' => '15-wave-sum',
                'es' => '15-suma-de-ondas',
            ],
            'title' => [
                'it' => 'Ogni segnale è una somma di onde',
                'en' => 'Every signal is a sum of waves',
                'es' => 'Toda señal es una suma de ondas',
            ],
            'description' => [
                'it' => 'Sfida: ricostruisci il segnale misterioso mescolando onde semplici.',
                'en' => 'Challenge: rebuild the mystery signal by mixing simple waves.',
                'es' => 'Reto: reconstruye la señal misteriosa mezclando ondas simples.',
            ],
        ],
        [
            'id' => '15b-serie',
            'n' => '15·b',
            'part' => 'C',
            'xp' => 100,
            'slug' => [
                'it' => '15b-serie',
                'en' => '15b-geometric-series',
                'es' => '15b-serie-geometrica',
            ],
            'title' => [
                'it' => 'Tante cose sommate: quando si accumulano e quando si annullano',
                'en' => 'Many things added up: when they pile up and when they cancel',
                'es' => 'Muchas cosas sumadas: cuándo se acumulan y cuándo se anulan',
            ],
            'description' => [
                'it' => 'La serie geometrica giocata con i pezzi e con le frecce. È la ragione per cui la trasformata di Fourier fa un picco.',
                'en' => 'The geometric series played with pieces and with arrows. It is the reason the Fourier transform makes a peak.',
                'es' => 'La serie geométrica jugada con trozos y con flechas. Es la razón por la que la transformada de Fourier hace un pico.',
            ],
        ],
        [
            'id' => '16-dft',
            'n' => '16',
            'part' => 'C',
            'xp' => 140,
            'slug' => [
                'it' => '16-dft',
                'en' => '16-dft',
                'es' => '16-dft',
            ],
            'title' => [
                'it' => 'La DFT passo passo: il rilevatore di periodicità',
                'en' => 'The DFT step by step: the periodicity detector',
                'es' => 'La DFT paso a paso: el detector de periodicidad',
            ],
            'description' => [
                'it' => 'La formula smontata pezzo per pezzo, con le frecce che vedi ruotare.',
                'en' => 'The formula taken apart piece by piece, with arrows you can watch spin.',
                'es' => 'La fórmula desmontada pieza a pieza, con las flechas girando a la vista.',
            ],
        ],
        [
            'id' => '17-fft',
            'n' => '17',
            'part' => 'C',
            'xp' => 80,
            'slug' => [
                'it' => '17-fft',
                'en' => '17-fft',
                'es' => '17-fft',
            ],
            'title' => [
                'it' => 'FFT: perché il computer ci mette N·log N',
                'en' => 'FFT: why a computer takes N·log N',
                'es' => 'FFT: por qué el ordenador tarda N·log N',
            ],
            'description' => [
                'it' => 'Dividi et impera: da N² a N·log N, contato operazione per operazione.',
                'en' => 'Divide and conquer: from N² to N·log N, counted operation by operation.',
                'es' => 'Divide y vencerás: de N² a N·log N, contado operación por operación.',
            ],
        ],
        [
            'id' => '18-qft',
            'n' => '18',
            'part' => 'D',
            'xp' => 200,
            'slug' => [
                'it' => '18-qft',
                'en' => '18-qft',
                'es' => '18-qft',
            ],
            'title' => [
                'it' => 'QFT: Fourier sulle ampiezze quantistiche',
                'en' => 'QFT: Fourier on quantum amplitudes',
                'es' => 'QFT: Fourier sobre las amplitudes cuánticas',
            ],
            'description' => [
                'it' => 'Il cuore del corso: dalla DFT al circuito con Hadamard, rotazioni controllate e SWAP.',
                'en' => 'The heart of the course: from the DFT to the circuit with Hadamard, controlled rotations and SWAP.',
                'es' => 'El corazón del curso: de la DFT al circuito con Hadamard, rotaciones controladas y SWAP.',
            ],
        ],
        [
            'id' => '18b-autovettori',
            'n' => '18·b',
            'part' => 'D',
            'xp' => 130,
            'slug' => [
                'it' => '18b-autovettori',
                'en' => '18b-eigenvectors',
                'es' => '18b-autovectores',
            ],
            'title' => [
                'it' => 'Le frecce che la macchina non gira: autovettori e autovalori',
                'en' => 'The arrows the machine does not turn: eigenvectors and eigenvalues',
                'es' => 'Las flechas que la máquina no gira: autovectores y autovalores',
            ],
            'description' => [
                'it' => 'Trascina finché la freccia non resta in linea con sé stessa. E scopri che su quelle frecce una porta cambia solo la fase.',
                'en' => 'Drag until the arrow stays in line with itself. And discover that on those arrows a gate changes only the phase.',
                'es' => 'Arrastra hasta que la flecha se quede en línea consigo misma. Y descubre que sobre esas flechas una puerta solo cambia la fase.',
            ],
        ],
        [
            'id' => '19-qpe',
            'n' => '19',
            'part' => 'D',
            'xp' => 150,
            'slug' => [
                'it' => '19-qpe',
                'en' => '19-qpe',
                'es' => '19-qpe',
            ],
            'title' => [
                'it' => 'Quantum Phase Estimation',
                'en' => 'Quantum Phase Estimation',
                'es' => 'Quantum Phase Estimation',
            ],
            'description' => [
                'it' => 'Leggere una fase nascosta come numero binario: la QFT usata al contrario.',
                'en' => 'Reading a hidden phase as a binary number: the QFT used backwards.',
                'es' => 'Leer una fase escondida como número binario: la QFT usada al revés.',
            ],
        ],
        [
            'id' => '20-shor',
            'n' => '20',
            'part' => 'D',
            'xp' => 250,
            'slug' => [
                'it' => '20-shor',
                'en' => '20-shor',
                'es' => '20-shor',
            ],
            'title' => [
                'it' => 'BOSS — Shor: dal periodo ai fattori',
                'en' => 'BOSS — Shor: from period to factors',
                'es' => 'BOSS — Shor: del periodo a los factores',
            ],
            'description' => [
                'it' => 'Fattorizza 15 e 21 con le tue mani: periodo, picchi, frazioni continue, MCD.',
                'en' => 'Factor 15 and 21 with your own hands: period, peaks, continued fractions, GCD.',
                'es' => 'Factoriza 15 y 21 con tus propias manos: periodo, picos, fracciones continuas, MCD.',
            ],
        ],
        [
            'id' => '21-rumore',
            'n' => '21',
            'part' => 'D',
            'xp' => 130,
            'slug' => [
                'it' => '21-rumore',
                'en' => '21-noise',
                'es' => '21-ruido',
            ],
            'title' => [
                'it' => 'Rumore, decoerenza e correzione d\'errore',
                'en' => 'Noise, decoherence and error correction',
                'es' => 'Ruido, decoherencia y corrección de errores',
            ],
            'description' => [
                'it' => 'Perché non hai ancora un computer quantistico in tasca. E come si combatte.',
                'en' => 'Why you do not have a quantum computer in your pocket yet. And how we fight back.',
                'es' => 'Por qué todavía no llevas un ordenador cuántico en el bolsillo. Y cómo se combate.',
            ],
        ],
        [
            'id' => '21b-variazionale',
            'n' => '21·b',
            'part' => 'D',
            'xp' => 140,
            'slug' => [
                'it' => '21b-variazionale',
                'en' => '21b-variational',
                'es' => '21b-variacional',
            ],
            'title' => [
                'it' => 'La pendenza e il quantistico che gira oggi: VQE',
                'en' => 'The slope and the quantum computing that runs today: VQE',
                'es' => 'La pendiente y la computación cuántica que se ejecuta hoy: VQE',
            ],
            'description' => [
                'it' => 'La derivata giocata come pendenza, e la discesa che i computer quantistici veri fanno adesso, rumore compreso.',
                'en' => 'The derivative played as a slope, and the descent that real quantum computers are doing right now, noise included.',
                'es' => 'La derivada jugada como pendiente, y la bajada que los ordenadores cuánticos de verdad hacen ahora mismo, ruido incluido.',
            ],
        ],
        [
            'id' => '22-officina',
            'n' => '22',
            'part' => 'D',
            'xp' => 300,
            'slug' => [
                'it' => '22-officina',
                'en' => '22-workshop',
                'es' => '22-taller',
            ],
            'title' => [
                'it' => 'OFFICINA — inventa il tuo algoritmo',
                'en' => 'WORKSHOP — invent your own algorithm',
                'es' => 'TALLER — inventa tu propio algoritmo',
            ],
            'description' => [
                'it' => 'Sandbox creativa: monta blocchi, scegli una sfida, misura, batti il tuo record.',
                'en' => 'Creative sandbox: stack blocks, pick a challenge, measure, beat your own record.',
                'es' => 'Zona libre creativa: monta bloques, elige un reto, mide y bate tu propio récord.',
            ],
        ],
        [
            'id' => '23-glossario',
            'n' => '23',
            'part' => 'D',
            'xp' => 120,
            'slug' => [
                'it' => '23-glossario',
                'en' => '23-glossary',
                'es' => '23-glosario',
            ],
            'title' => [
                'it' => 'Glossario e mappa completa',
                'en' => 'Glossary and full map',
                'es' => 'Glosario y mapa completo',
            ],
            'description' => [
                'it' => 'Tutti i termini in una pagina, con il filo che li collega dall\'inizio alla fine.',
                'en' => 'Every term on one page, with the thread that links them from beginning to end.',
                'es' => 'Todos los términos en una página, con el hilo que los une de principio a fin.',
            ],
        ],
        [
            'id' => '24-esame',
            'n' => '24',
            'part' => 'D',
            'xp' => 300,
            'slug' => [
                'it' => '24-esame',
                'en' => '24-exam',
                'es' => '24-examen',
            ],
            'title' => [
                'it' => 'ESAME FINALE — attestato di completamento',
                'en' => 'FINAL EXAM — certificate of completion',
                'es' => 'EXAMEN FINAL — certificado de finalización',
            ],
            'description' => [
                'it' => 'Tutte le domande del corso, in una volta sola. Dall\'80% in su generi il tuo attestato.',
                'en' => 'Every question in the course, all at once. Score 80% or more and you generate your certificate.',
                'es' => 'Todas las preguntas del curso, de una sola vez. Del 80% para arriba generas tu certificado.',
            ],
        ],
    ],
];
