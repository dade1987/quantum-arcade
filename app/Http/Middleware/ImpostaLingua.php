<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Decide in che lingua risponde il backend.
 *
 * Il gioco è un sito statico servito da public_html/ in tre copie — la radice
 * (italiano), /en/ e /es/ — mentre il backend è uno solo. Quindi la lingua non
 * si può dedurre dalla rotta: bisogna che sia il chiamante a dirla.
 *
 * L'ordine di preferenza, dal più esplicito al più generico:
 *
 *   1. ?lang=en          per i link condivisibili (la pagina di verifica di un
 *                        attestato finisce su LinkedIn: chi la apre deve poterla
 *                        leggere nella lingua di chi gliel'ha mandata);
 *   2. il prefisso del percorso (/en/… , /es/…) e quello del Referer, così una
 *      pagina del sito inglese ottiene risposte inglesi anche se il browser è
 *      configurato in un'altra lingua;
 *   3. l'header Accept-Language, che il client del gioco manda sempre
 *      (public_html/js/core/api.js) e che i browser mandano da soli;
 *   4. l'italiano, che è la lingua sorgente: le chiavi di traduzione SONO le
 *      frasi italiane, quindi senza dizionario non si rompe niente.
 */
class ImpostaLingua
{
    /** Le lingue in cui il sito esiste davvero. Aggiungerne una qui non basta: serve anche lang/<lingua>.json. */
    public const LINGUE = ['it', 'en', 'es'];

    public const PREDEFINITA = 'it';

    public function handle(Request $request, Closure $next): Response
    {
        $lingua = $this->daQuery($request)
            ?? $this->daPercorso($request->path())
            ?? $this->daPercorso($this->percorsoDelReferer($request))
            ?? $this->daHeader($request)
            ?? self::PREDEFINITA;

        app()->setLocale($lingua);

        return $next($request);
    }

    private function daQuery(Request $request): ?string
    {
        return $this->valida((string) $request->query('lang', ''));
    }

    /** «en/lessons/01-qubit.html» → «en». */
    private function daPercorso(?string $percorso): ?string
    {
        if ($percorso === null) {
            return null;
        }

        return $this->valida(strtok(ltrim($percorso, '/'), '/') ?: '');
    }

    private function percorsoDelReferer(Request $request): ?string
    {
        $referer = $request->headers->get('referer');

        if (! $referer || ! ($host = parse_url($referer, PHP_URL_HOST))) {
            return null;
        }

        // solo il nostro sito: un Referer esterno non deve poter scegliere la lingua
        if ($host !== $request->getHost()) {
            return null;
        }

        return parse_url($referer, PHP_URL_PATH) ?: null;
    }

    /**
     * Accept-Language, letto sul serio: «es-ES,es;q=0.9,en;q=0.8» va scomposto
     * in preferenze ordinate, altrimenti si sceglie la prima che capita.
     */
    private function daHeader(Request $request): ?string
    {
        $header = (string) $request->headers->get('accept-language', '');

        if ($header === '') {
            return null;
        }

        $preferenze = [];

        foreach (explode(',', $header) as $pezzo) {
            $parti = explode(';q=', trim($pezzo));
            $tag   = strtolower(trim($parti[0]));

            if ($tag === '') {
                continue;
            }

            $preferenze[] = [$tag, isset($parti[1]) ? (float) $parti[1] : 1.0];
        }

        // ordinamento stabile: a parità di q vince chi è scritto prima
        usort($preferenze, fn (array $a, array $b): int => $b[1] <=> $a[1]);

        foreach ($preferenze as [$tag]) {
            // «it-IT» vale quanto «it»: la variante regionale non ci interessa
            if ($lingua = $this->valida(strtok($tag, '-') ?: '')) {
                return $lingua;
            }
        }

        return null;
    }

    private function valida(string $lingua): ?string
    {
        return in_array($lingua, self::LINGUE, true) ? $lingua : null;
    }
}
