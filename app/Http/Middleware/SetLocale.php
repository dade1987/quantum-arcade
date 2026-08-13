<?php

namespace App\Http\Middleware;

use App\Support\Site;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Decides which language the backend answers in.
 *
 * The order runs from the most explicit signal to the vaguest:
 *
 *   1. the route itself. Every page of the course declares its language —
 *      /lezioni/… is Italian, /en/lessons/… is English — and that beats
 *      everything, because it is what the reader asked for by typing or
 *      clicking the address. Without this rule an Italian page opened in an
 *      English browser would come back translated, which nobody wants;
 *   2. ?lang=en, for shareable links. A certificate verification page ends
 *      up on LinkedIn: whoever opens it has to be able to read it in the
 *      language of the person who sent it;
 *   3. the path prefix, and the prefix of the Referer, so that a request
 *      fired by a page of the English site gets an English answer even if
 *      the browser is configured otherwise;
 *   4. the Accept-Language header, which the game's own client always sends
 *      (public_html/js/core/api.js) and which browsers send by themselves;
 *   5. Italian, the source language: the translation keys ARE the Italian
 *      sentences, so with no dictionary nothing breaks.
 */
class SetLocale
{
    public const FALLBACK = 'it';

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $this->fromRoute($request)
            ?? $this->fromQuery($request)
            ?? $this->fromPath($request->path())
            ?? $this->fromPath($this->refererPath($request))
            ?? $this->fromHeader($request)
            ?? self::FALLBACK;

        app()->setLocale($locale);

        return $next($request);
    }

    /** The language the matched route declares, which is the reader's own choice. */
    private function fromRoute(Request $request): ?string
    {
        return $this->valid((string) ($request->route()?->defaults['locale'] ?? ''));
    }

    private function fromQuery(Request $request): ?string
    {
        return $this->valid((string) $request->query('lang', ''));
    }

    /** «en/lessons/01-qubit.html» → «en». */
    private function fromPath(?string $path): ?string
    {
        if ($path === null) {
            return null;
        }

        return $this->valid(strtok(ltrim($path, '/'), '/') ?: '');
    }

    private function refererPath(Request $request): ?string
    {
        $referer = $request->headers->get('referer');

        if (! $referer || ! ($host = parse_url($referer, PHP_URL_HOST))) {
            return null;
        }

        // our own site only: an external Referer must not get to pick the language
        if ($host !== $request->getHost()) {
            return null;
        }

        return parse_url($referer, PHP_URL_PATH) ?: null;
    }

    /**
     * Accept-Language, read properly: «es-ES,es;q=0.9,en;q=0.8» has to be
     * broken into ordered preferences, otherwise we pick whichever comes first.
     */
    private function fromHeader(Request $request): ?string
    {
        $header = (string) $request->headers->get('accept-language', '');

        if ($header === '') {
            return null;
        }

        $preferences = [];

        foreach (explode(',', $header) as $piece) {
            $parts = explode(';q=', trim($piece));
            $tag = strtolower(trim($parts[0]));

            if ($tag === '') {
                continue;
            }

            $preferences[] = [$tag, isset($parts[1]) ? (float) $parts[1] : 1.0];
        }

        // stable sort: at equal q, whoever is written first wins
        usort($preferences, fn (array $a, array $b): int => $b[1] <=> $a[1]);

        foreach ($preferences as [$tag]) {
            // «it-IT» counts as «it»: the regional variant is not our business
            if ($locale = $this->valid(strtok($tag, '-') ?: '')) {
                return $locale;
            }
        }

        return null;
    }

    private function valid(string $locale): ?string
    {
        return in_array($locale, Site::locales(), true) ? $locale : null;
    }
}
