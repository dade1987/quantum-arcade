<?php

namespace App\Http\Controllers;

use App\Support\Site;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * The pages of the course.
 *
 * One view per page per language, one layout for all of them. That split is
 * deliberate: the prose differs between languages because it is a
 * translation, but the <head> — title, canonical, hreflang, structured data
 * — has the same shape everywhere and is built from the level list.
 *
 * Before this, every page existed as three static HTML files, each with its
 * own hand-written <head>. Twenty-one lessons out of twenty-eight ended up
 * announcing a level number that no longer matched the one the page showed.
 * Here that cannot happen, because nobody writes a title.
 *
 * The locale is not a method argument on purpose. Laravel binds scalar route
 * parameters BY POSITION, not by name, so a signature that spelled out
 * ($locale, $slug) silently received them the other way round — the route
 * declares `slug` in the URI and `locale` as a default, in that order. The
 * locale comes from the middleware instead, which reads it from the route
 * and cannot be got wrong by adding a parameter.
 */
class PageController extends Controller
{
    /** The map of levels: the home page of each language. */
    public function home(): View
    {
        return view('pages.' . app()->getLocale() . '.home', $this->shared('home'));
    }

    /** A fixed page — the method, the privacy notice. */
    public function page(Request $request): View
    {
        $page = (string) $request->route()->defaults['page'];

        return view('pages.' . app()->getLocale() . '.' . $page, $this->shared($page));
    }

    /** A lesson, looked up by the slug that this language uses for it. */
    public function lesson(string $slug): View
    {
        $locale = app()->getLocale();
        $level = Site::levelBySlug($slug, $locale);

        abort_if($level === null, 404);

        return view("lessons.$locale." . $level['id'], $this->shared('lesson', $level) + [
            'level' => $level,
        ]);
    }

    /**
     * What every page needs in its <head>, whatever page it is.
     *
     * @param  array<string, mixed>|null $level
     * @return array<string, mixed>
     */
    private function shared(string $page, ?array $level = null): array
    {
        $locale = app()->getLocale();
        $alternates = Site::alternates($page, $level);

        return [
            'locale' => $locale,
            'alternates' => $alternates,
            'canonical' => Site::url($alternates[$locale]),
            'localeNames' => Site::localeNames(),
        ];
    }
}
