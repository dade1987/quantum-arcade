<?php

namespace App\Support;

/**
 * What the server knows about the site's shape: its locales, its levels, and
 * the address of every page in every language.
 *
 * The facts themselves are not written here. They live in the game's own
 * source — public_html/js/core/levels.js — and `npm run sync` copies them
 * into config/site.php. This class is only the way PHP asks questions about
 * them, so that routes, <head> tags and the sitemap all answer the same way.
 */
class Site
{
    /** @return array<int, string> the locale codes, Italian first: it is the source language. */
    public static function locales(): array
    {
        return array_keys(config('site.locales'));
    }

    /** @return array<string, string> code => the language's name in that language. */
    public static function localeNames(): array
    {
        return array_map(fn (array $l): string => $l['name'], config('site.locales'));
    }

    public static function tag(string $locale): string
    {
        return config("site.locales.$locale.tag", $locale);
    }

    /** The folder a locale calls its lessons: lezioni, lessons, lecciones. */
    public static function lessonsFolder(string $locale): string
    {
        return config("site.locales.$locale.lessons", 'lezioni');
    }

    /** @return array<int, array<string, mixed>> every level, in course order. */
    public static function levels(): array
    {
        return config('site.levels', []);
    }

    /** @return array<string, mixed>|null the level with this id, or null. */
    public static function level(string $id): ?array
    {
        foreach (self::levels() as $level) {
            if ($level['id'] === $id) {
                return $level;
            }
        }

        return null;
    }

    /**
     * The level a slug refers to in a given language.
     *
     * Slugs are translated (20-shor, but 03-porte / 03-gates / 03-puertas), so
     * the same path segment means different things depending on which copy of
     * the site you are reading.
     *
     * @return array<string, mixed>|null
     */
    public static function levelBySlug(string $slug, string $locale): ?array
    {
        foreach (self::levels() as $level) {
            if (($level['slug'][$locale] ?? null) === $slug) {
                return $level;
            }
        }

        return null;
    }

    /**
     * The path of a fixed page: '/', '/en/', '/es/privacidad.html'.
     *
     * Absolute, always. Relative addresses would have to know how deep the
     * page they are written on happens to sit, and that is the kind of thing
     * that breaks silently the day a page moves.
     */
    public static function page(string $name, string $locale): string
    {
        $prefix = config("site.locales.$locale.prefix", '');
        $file = config("site.locales.$locale.pages.$name", '');

        return '/' . $prefix . $file;
    }

    /** The path of a lesson: '/lezioni/20-shor.html', '/en/lessons/20-shor.html'. */
    public static function lessonPath(string $id, string $locale): string
    {
        $level = self::level($id);
        $slug = $level['slug'][$locale] ?? $id;

        return '/' . config("site.locales.$locale.prefix", '') . self::lessonsFolder($locale) . '/' . $slug . '.html';
    }

    /**
     * The same page in every language, for the hreflang tags and the picker.
     *
     * @param  array<string, mixed>|null $level  null for a fixed page
     * @return array<string, string> locale => path
     */
    public static function alternates(string $page, ?array $level = null): array
    {
        $out = [];
        foreach (self::locales() as $locale) {
            $out[$locale] = $level
                ? self::lessonPath($level['id'], $locale)
                : self::page($page, $locale);
        }

        return $out;
    }

    /** The absolute URL of a path, for canonical and hreflang tags. */
    public static function url(string $path): string
    {
        return rtrim(config('app.url'), '/') . $path;
    }
}
