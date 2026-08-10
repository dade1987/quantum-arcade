<?php

use Illuminate\Support\Facades\Route;

/*
 * Il gioco è un sito statico che vive dentro public/.
 * Serviamo esplicitamente index.html sulla radice così il comportamento è
 * identico ovunque: server di sviluppo, Apache di Hostinger, nginx.
 * Tutto il resto (/api, /verifica, /attestato) lo gestiscono i moduli.
 */
Route::get('/', fn () => response()->file(public_path('index.html')));
