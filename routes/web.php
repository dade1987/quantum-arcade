<?php

use App\Http\Controllers\PageController;
use App\Support\Site;
use Illuminate\Support\Facades\Route;

/*
 * The site in three languages, from one set of route definitions.
 *
 * Every locale gets its own paths, with its own words in them — a Spanish
 * reader gets /es/lecciones/20-shor.html, not /es/lezioni/. The addresses
 * come from config/site.php, which `npm run sync` generates from the game's
 * own level list, so a level renamed there cannot keep its old URL here.
 *
 * The .html suffix stays. It is not pretty, but those addresses are already
 * indexed, already printed inside certificates, and already cited by the AI
 * tutor: dropping the suffix would buy tidiness and pay for it in redirects
 * and broken links. It can go later, with a redirect, as its own change.
 */

foreach (Site::locales() as $locale) {
    $prefix = rtrim(config("site.locales.$locale.prefix"), '/');

    Route::prefix($prefix)->group(function () use ($locale) {
        Route::get('/', [PageController::class, 'home'])
            ->defaults('locale', $locale)
            ->name("home.$locale");

        foreach (['method', 'privacy'] as $page) {
            Route::get(config("site.locales.$locale.pages.$page"), [PageController::class, 'page'])
                ->defaults('locale', $locale)
                ->defaults('page', $page)
                ->name("$page.$locale");
        }

        Route::get(Site::lessonsFolder($locale) . '/{slug}.html', [PageController::class, 'lesson'])
            ->defaults('locale', $locale)
            ->name("lesson.$locale");
    });
}
