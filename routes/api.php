<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
 * Il token CSRF, su richiesta.
 *
 * Gioco e API stanno sullo stesso dominio e l'accesso è a cookie di sessione:
 * ogni POST deve portare il token CSRF, che il browser riceve nel cookie
 * XSRF-TOKEN. Quel cookie lo mette qualunque risposta a una GET — comprese
 * le pagine — quindi finché si naviga non serve chiederlo.
 *
 * Serve quando NON si naviga. Il token scade insieme alla sessione (due ore),
 * e chi sta giocando resta sulla stessa pagina per ore: da lì in poi ogni
 * salvataggio dei progressi tornerebbe 419, e siccome un token scaduto non
 * viene rinnovato dalla risposta che lo rifiuta, non se ne uscirebbe più
 * senza ricaricare la pagina a mano. Con questa rotta il client se ne
 * riprende da solo: chiede un token nuovo e rimanda la richiesta.
 *
 * Il client la chiamava già, ma all'indirizzo /sanctum/csrf-cookie — che è di
 * Laravel Sanctum, qui non installato: rispondeva 404 e nessuno se ne
 * accorgeva, perché l'errore veniva ignorato di proposito.
 */
Route::get('csrf', fn (Request $request) => response()->noContent())->name('csrf');
