<?php

use App\Http\Middleware\ImpostaLingua;
use Illuminate\Support\Facades\Route;

/*
 * Il gioco è un sito statico che vive dentro public/.
 * Serviamo esplicitamente index.html sulla radice così il comportamento è
 * identico ovunque: server di sviluppo, Apache di Hostinger, nginx.
 * Tutto il resto (/api, /verifica, /attestato) lo gestiscono i moduli.
 */
Route::get('/', fn () => response()->file(public_path('index.html')));

/*
 * Le altre lingue vivono in sottocartelle (public_html/en/, public_html/es/).
 * Apache e nginx ci servono index.html da soli grazie al DirectoryIndex, ma
 * `php artisan serve` no: senza questa rotta il sito inglese e quello spagnolo
 * funzionerebbero online e darebbero 404 sul computer di chi ci lavora, che è
 * il modo migliore per accorgersi di un guasto il giorno del deploy.
 */
Route::get('/{lingua}', fn (string $lingua) => response()->file(public_path($lingua . '/index.html')))
    ->whereIn('lingua', array_diff(ImpostaLingua::LINGUE, ['it']));
