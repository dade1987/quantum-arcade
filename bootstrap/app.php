<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        /*
         * Gioco e API vivono sullo STESSO dominio (un solo hosting, un solo deploy),
         * quindi l'autenticazione usa la sessione con cookie: niente token da
         * conservare nel browser, che sarebbero più esposti.
         *
         * Per farlo, le rotte /api devono passare da sessione e protezione CSRF,
         * che nel gruppo "api" di default non ci sono.
         */
        $middleware->api(prepend: [
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
        ]);

        $middleware->redirectGuestsTo(fn () => null);   // le API rispondono 401 JSON, non redirect

        /*
         * Il sito esiste in italiano, inglese e spagnolo, ma il backend è uno solo:
         * ogni risposta va tradotta nella lingua di chi ha chiesto. Vale sia per le
         * API (messaggi di errore, esame) sia per le pagine servite da Laravel
         * (verifica dell'attestato, PDF, email di accesso).
         */
        $middleware->web(prepend: [\App\Http\Middleware\ImpostaLingua::class]);
        $middleware->api(prepend: [\App\Http\Middleware\ImpostaLingua::class]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })
    ->create()
    /*
     * Su Hostinger la cartella servita dal web si chiama SEMPRE public_html
     * e non è rinominabile: quindi è Laravel ad adeguarsi, non il contrario.
     * Così il deploy è una copia secca nella home, senza toccare pannelli.
     */
    ->usePublicPath(dirname(__DIR__) . '/public_html');
