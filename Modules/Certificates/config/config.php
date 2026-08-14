<?php

/*
 * Configurazione del modulo Certificates.
 *
 * Le DOMANDE non stanno qui dentro: stanno in un file a parte, generato da
 * `npm run exam:sync`, e ne esistono due versioni.
 *
 *   domande-riservate.php   l'esame vero. Non è nel repository (che è pubblico)
 *                           e non è nella cartella web: si carica a mano sul
 *                           server. Se c'è, vince lui.
 *   domande-esempio.php     un sottoinsieme pubblico, così chi contribuisce può
 *                           far girare sito e test senza avere l'esame vero.
 *
 * Il motivo è semplice: un esame le cui risposte si possono leggere non misura
 * niente, e un attestato che non misura niente non vale niente. Il codice del
 * progetto è aperto apposta; le soluzioni no, ed è l'unica eccezione.
 */

$riservate = __DIR__ . '/domande-riservate.php';
$esempio   = __DIR__ . '/domande-esempio.php';

$banca = file_exists($riservate) ? require $riservate : (file_exists($esempio) ? require $esempio : []);

return [
    'name' => 'Certificates',

    // Versione del corso, stampata sull'attestato
    'course_version' => '1.0',

    /*
     * Quanti livelli ha il corso. È scritto sull'attestato, sul PDF e sulla
     * pagina pubblica di verifica: se non combacia con quello che dice il sito,
     * chi controlla l'attestato di qualcun altro trova due numeri diversi e non
     * si fida più di nessuno dei due.
     *
     * La sorgente vera è l'elenco LEVELS in public_html/js/core/levels.js: qui
     * c'è una copia perché il PHP quel file non lo legge. A tenerli allineati
     * ci pensa `npm run validate`, che confronta i due numeri e si ferma se
     * hanno preso strade diverse — è già successo aggiungendo il livello 12.
     */
    'levels_count' => 53,

    // Vero quando sul server c'è l'esame vero e non quello d'esempio:
    // lo usa `php artisan site:check` per avvisare prima di aprire al pubblico.
    'questions_are_real' => file_exists($riservate),

    'questions' => $banca,
];
