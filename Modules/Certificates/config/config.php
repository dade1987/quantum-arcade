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

    // Vero quando sul server c'è l'esame vero e non quello d'esempio:
    // lo usa `php artisan sito:controlla` per avvisare prima di aprire al pubblico.
    'questions_are_real' => file_exists($riservate),

    'questions' => $banca,
];
