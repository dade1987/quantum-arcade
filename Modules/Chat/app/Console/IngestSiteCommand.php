<?php

namespace Modules\Chat\Console;

use Illuminate\Console\Command;
use Modules\Chat\Agents\QuantumTutor;
use NeuronAI\RAG\Document;

/**
 * Legge le pagine del gioco (che stanno in public/) e le trasforma in
 * "documenti" ricercabili dal tutor.
 *
 *   php artisan chat:ingest
 *
 * Va rilanciato ogni volta che si modificano i contenuti dei livelli.
 */
class IngestSiteCommand extends Command
{
    protected $signature = 'chat:ingest {--dry : mostra cosa verrebbe indicizzato senza chiamare le API}';

    protected $description = 'Indicizza le pagine di Quantum Arcade per il tutor AI';

    /** ~900 caratteri: abbastanza da contenere un concetto intero, poco da restare preciso. */
    private const CHUNK = 900;
    private const OVERLAP = 150;

    public function handle(): int
    {
        $root  = public_path();
        $pages = array_merge(
            glob($root . '/*.html') ?: [],
            glob($root . '/lezioni/*.html') ?: [],
        );

        if ($pages === []) {
            $this->error("Nessuna pagina trovata in {$root}. Il gioco è stato copiato dentro public/?");
            return self::FAILURE;
        }

        $documents = [];

        foreach ($pages as $path) {
            $html  = file_get_contents($path);
            $title = $this->extract('/<title>(.*?)<\/title>/s', $html) ?: basename($path);
            $url   = '/' . ltrim(str_replace($root, '', $path), '/');
            $level = $this->levelFromPath($path);

            $text = $this->toPlainText($html);
            if (mb_strlen($text) < 200) {
                continue;
            }

            foreach ($this->chunk($text) as $i => $piece) {
                $doc = new Document(
                    "TITOLO: {$title}\nLIVELLO: {$level}\nURL: {$url}\n\n{$piece}"
                );
                $doc->sourceType = 'html';
                $doc->sourceName = $url;
                $doc->metadata   = ['url' => $url, 'title' => $title, 'level' => $level, 'chunk' => $i];
                $documents[] = $doc;
            }

            $this->line(sprintf('  %-34s %s', basename($path), '→ ' . count($this->chunk($text)) . ' pezzi'));
        }

        $this->info(count($documents) . ' pezzi da ' . count($pages) . ' pagine.');

        if ($this->option('dry')) {
            $this->comment('Modalità dry: nessuna chiamata alle API, nessun costo.');
            return self::SUCCESS;
        }

        if (QuantumTutor::embeddingsRichiedonoChiave() && ! config('chat.embeddings_key')) {
            $this->error('CHAT_EMBEDDINGS=' . config('chat.embeddings')
                . ' richiede una chiave: mettila in CHAT_EMBEDDINGS_KEY nel .env, '
                . 'oppure usa CHAT_EMBEDDINGS=locale (nessuna chiave, nessun costo).');
            return self::FAILURE;
        }

        $this->info(QuantumTutor::embeddingsRichiedonoChiave()
            ? 'Calcolo gli embedding e salvo l\'archivio…'
            : 'Calcolo gli embedding in locale (nessuna chiamata alle API) e salvo l\'archivio…');
        app(QuantumTutor::class)->reindexBySource($documents);

        $this->info('✅ Fatto. Il tutor adesso conosce il sito aggiornato.');

        return self::SUCCESS;
    }

    /** Toglie script, stile, tag e normalizza gli spazi: resta il testo che legge lo studente. */
    private function toPlainText(string $html): string
    {
        // il contenuto delle lezioni vive dentro stringhe JS: teniamo anche quelle,
        // ma senza il codice che le circonda
        $html = preg_replace('/<style[\s\S]*?<\/style>/i', ' ', $html);
        $html = preg_replace('/<script[^>]*type="application\/ld\+json"[\s\S]*?<\/script>/i', ' ', $html);

        // dagli script dei moduli estraiamo solo i template letterali (i testi delle lezioni)
        $texts = [];
        if (preg_match_all('/`([^`]{80,})`/s', $html, $m)) {
            $texts = $m[1];
        }
        $html = preg_replace('/<script[\s\S]*?<\/script>/i', ' ', $html);

        $all = $html . "\n" . implode("\n", $texts);
        $all = preg_replace('/<[^>]+>/', ' ', $all);
        $all = html_entity_decode($all, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $all = preg_replace('/\s+/u', ' ', $all);

        return trim($all);
    }

    /** @return string[] */
    private function chunk(string $text): array
    {
        $out = [];
        $len = mb_strlen($text);

        for ($i = 0; $i < $len; $i += self::CHUNK - self::OVERLAP) {
            $piece = mb_substr($text, $i, self::CHUNK);
            if (mb_strlen(trim($piece)) > 120) {
                $out[] = trim($piece);
            }
        }

        return $out;
    }

    private function levelFromPath(string $path): string
    {
        if (! str_contains($path, '/lezioni/')) {
            return 'home';
        }

        return preg_replace('/\.html$/', '', basename($path));
    }

    private function extract(string $pattern, string $subject): ?string
    {
        return preg_match($pattern, $subject, $m) ? trim(strip_tags($m[1])) : null;
    }
}
