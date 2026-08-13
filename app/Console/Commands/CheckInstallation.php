<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Controllo pre-volo dell'installazione.
 *
 * Da lanciare SUL SERVER subito dopo aver caricato il sito, e ogni volta che
 * si tocca il .env. Verifica una per una le cose che, se sbagliate, si
 * scoprono di solito nel modo peggiore: dall'utente che non riceve l'email,
 * dall'attestato che non si scarica, dal messaggio di errore di PHP mostrato
 * in pagina con dentro il percorso del database.
 *
 * Ogni controllo dice tre cose: com'è andata, perché conta, e cosa fare se è
 * rosso. Un elenco di ✗ senza istruzioni sarebbe solo un modo elegante di
 * lasciare la persona da sola.
 */
class CheckInstallation extends Command
{
    protected $signature = 'site:check {--production : also run the checks that only make sense online}';

    protected $description = 'Controlla che il server sia pronto: PHP, permessi, database, posta, attestati, tutor';

    /** @var array<int, array{stato: string, titolo: string, dettaglio: string}> */
    private array $esiti = [];

    public function handle(): int
    {
        $produzione = (bool) $this->option('production') || app()->environment('production');

        $this->newLine();
        $this->line('  <options=bold>Controllo dell\'installazione di Quantum Arcade</>');
        $this->line('  ' . ($produzione ? 'modalità produzione (controlli severi)' : 'modalità locale'));
        $this->newLine();

        $this->controllaPhp();
        $this->controllaChiaveEAmbiente($produzione);
        $this->controllaCartelle();
        $this->controllaDatabase();
        $this->controllaPosta($produzione);
        $this->controllaAttestati();
        $this->controllaTutor();

        return $this->riepilogo();
    }

    /* ------------------------------------------------------------------ */

    private function controllaPhp(): void
    {
        $this->esito(
            version_compare(PHP_VERSION, '8.2', '>=') ? 'ok' : 'errore',
            'PHP ' . PHP_VERSION,
            'Laravel 12 richiede almeno PHP 8.2. Su Hostinger si cambia dal pannello, sezione PHP.',
        );

        // Ognuna serve a qualcosa di preciso: se manca, si rompe quella cosa lì.
        foreach ([
            'pdo'      => 'parlare col database',
            'mbstring' => 'gestire le lettere accentate',
            'dom'      => 'generare il PDF dell\'attestato',
            'curl'     => 'chiamare il modello del tutor',
            'openssl'  => 'cifrare sessioni e token',
            'fileinfo' => 'riconoscere i tipi di file',
        ] as $estensione => $aCosaServe) {
            $this->esito(
                extension_loaded($estensione) ? 'ok' : 'errore',
                "Estensione PHP {$estensione}",
                "Serve per {$aCosaServe}. Su Hostinger si attiva dal pannello, nella stessa pagina della versione di PHP.",
            );
        }
    }

    private function controllaChiaveEAmbiente(bool $produzione): void
    {
        // Trappola classica degli hosting condivisi: la riga di comando e il sito
        // usano DUE versioni di PHP diverse. Composer installa le dipendenze
        // guardando quella della riga di comando; se il sito ne ha una più
        // vecchia, ogni pagina PHP risponde 500 con un messaggio che parla di
        // Composer e non dice dove si cambia la versione.
        $richiesta = $this->versioneRichiestaDalleDipendenze();

        if ($richiesta !== null) {
            // Verde quando la riga di comando basta: un avviso permanente
            // diventerebbe rumore, e il rumore si smette di leggerlo.
            $this->esito(
                version_compare(PHP_VERSION, $richiesta, '>=') ? 'ok' : 'errore',
                "Le dipendenze installate richiedono PHP >= {$richiesta} — controlla che anche il SITO usi questa versione",
                'Questo controllo gira da riga di comando (PHP ' . PHP_VERSION . '), ma il SITO può usare '
                . 'una versione diversa: si imposta nel pannello dell\'hosting. Se è più vecchia, ogni pagina '
                . 'dinamica risponde 500 dicendo "Your Composer dependencies require a PHP version". '
                . 'Allinea la versione del sito a quella della riga di comando.',
            );
        }

        // Sugli hosting condivisi proc_open è quasi sempre disattivato: non è un
        // guaio per il sito, ma fa fallire gli script di Composer. Meglio dirlo
        // prima che scoprirlo da un messaggio di errore incomprensibile.
        $this->esito(
            function_exists('proc_open') ? 'ok' : 'avviso',
            function_exists('proc_open') ? 'proc_open disponibile' : 'proc_open disattivato dall\'hosting',
            'Il sito funziona lo stesso. Ma Composer va lanciato con --no-scripts, seguito da '
            . '`php artisan package:discover`, sennò si ferma con "The Process class relies on proc_open". '
            . 'tools/deploy.sh lo fa già da solo.',
        );

        $this->esito(
            config('app.key') ? 'ok' : 'errore',
            'APP_KEY impostata',
            'Senza, sessioni e token non si possono cifrare. Si genera con: php artisan key:generate',
        );

        $url = (string) config('app.url');
        $this->esito(
            str_starts_with($url, 'https://') ? 'ok' : ($produzione ? 'errore' : 'avviso'),
            "APP_URL = {$url}",
            'Online dev\'essere l\'indirizzo pubblico in https: ci finiscono dentro i link di conferma '
            . 'email e quelli di verifica degli attestati. Se è sbagliato, quei link non funzionano.',
        );

        if ($produzione) {
            $this->esito(
                config('app.debug') ? 'errore' : 'ok',
                'APP_DEBUG disattivato',
                'Con APP_DEBUG=true una pagina di errore mostra al pubblico percorsi, query e pezzi di .env. '
                . 'Online va sempre false.',
            );
        }
    }

    /**
     * Versione di PHP pretesa dai pacchetti installati, letta dal controllo che
     * Composer stesso genera in vendor/composer/platform_check.php.
     */
    private function versioneRichiestaDalleDipendenze(): ?string
    {
        $file = base_path('vendor/composer/platform_check.php');

        if (! is_readable($file)) {
            return null;
        }
        if (! preg_match('/PHP_VERSION_ID\s*>=\s*(\d)(\d{2})(\d{2})/', (string) file_get_contents($file), $m)) {
            return null;
        }

        return sprintf('%d.%d.%d', $m[1], (int) $m[2], (int) $m[3]);
    }

    private function controllaCartelle(): void
    {
        foreach ([storage_path(), base_path('bootstrap/cache')] as $cartella) {
            $this->esito(
                is_writable($cartella) ? 'ok' : 'errore',
                'Scrivibile: ' . str_replace(base_path() . '/', '', $cartella),
                'Laravel ci scrive cache, sessioni e log. Si sistema con: chmod -R 775 storage bootstrap/cache',
            );
        }

        $this->esito(
            file_exists(public_path('index.php')) && is_dir(resource_path('views/pages')) ? 'ok' : 'errore',
            'public_html contiene il sito e il front controller',
            'Su Hostinger la radice del web è public_html e non si può cambiare: ci devono stare sia index.php '
            . '(Laravel) e che resources/views/pages contenga le pagine del gioco.',
        );

        // Il .env fuori dalla radice pubblica è ciò che separa "configurazione
        // privata" da "file scaricabile da chiunque".
        $this->esito(
            file_exists(public_path('.env')) ? 'errore' : 'ok',
            'Il .env non è dentro public_html',
            'Se ci finisce, chiunque può scaricarlo con /.env e leggere password del database e chiavi API. '
            . 'Va tenuto nella cartella superiore.',
        );
    }

    private function controllaDatabase(): void
    {
        try {
            DB::connection()->getPdo();
        } catch (\Throwable $e) {
            $this->esito('errore', 'Connessione al database', 'Non risponde: ' . $e->getMessage()
                . ' — controlla DB_HOST, DB_DATABASE, DB_USERNAME e DB_PASSWORD nel .env.');
            return;
        }

        $this->esito('ok', 'Connessione al database', 'Il database risponde.');

        $mancanti = array_values(array_filter(
            ['users', 'player_states', 'certificates', 'exam_attempts', 'conversations'],
            fn (string $t): bool => ! Schema::hasTable($t),
        ));

        $this->esito(
            $mancanti === [] ? 'ok' : 'errore',
            'Tabelle create',
            $mancanti === []
                ? 'Ci sono tutte.'
                : 'Mancano: ' . implode(', ', $mancanti) . '. Si creano con: php artisan migrate --force',
        );
    }

    private function controllaPosta(bool $produzione): void
    {
        $mailer = (string) config('mail.default');

        $this->esito(
            $mailer === 'log' ? ($produzione ? 'errore' : 'avviso') : 'ok',
            "Posta: {$mailer}",
            $mailer === 'log'
                ? 'Con MAIL_MAILER=log le email finiscono in storage/logs/laravel.log invece che nella casella '
                  . 'di chi si iscrive: nessuno riuscirebbe a confermare la registrazione. Online serve SMTP.'
                : 'Le email di conferma partono davvero. Provalo iscrivendoti con un tuo indirizzo.',
        );

        $mittente = (string) config('mail.from.address');
        $this->esito(
            $mittente && ! str_contains($mittente, 'example.com') ? 'ok' : 'avviso',
            "Mittente: {$mittente}",
            'Meglio una casella del dominio (no-reply@iltuodominio.it): i mittenti generici finiscono nello spam.',
        );
    }

    private function controllaAttestati(): void
    {
        $domande = count((array) config('certificates.questions', []));
        $vere    = (bool) config('certificates.questions_are_real');

        $this->esito(
            $domande >= 10 ? 'ok' : 'errore',
            "Banca domande d'esame: {$domande} domande",
            'L\'esame le pesca da qui, lato server. Si rigenera con: npm run exam:sync',
        );

        // Le domande d'esempio sono pubbliche su GitHub: se l'esame vero gira
        // con quelle, chiunque può passarlo copiando, e l'attestato non vale niente.
        $this->esito(
            $vere ? 'ok' : 'avviso',
            $vere ? 'In uso la banca domande riservata' : 'In uso la banca domande D\'ESEMPIO',
            'Le domande d\'esempio stanno nel repository pubblico: online serve quella riservata. '
            . 'Genera Modules/Certificates/config/exam-questions-private.php con npm run exam:sync '
            . 'e caricalo sul server (non è in git, quindi non arriva con il deploy).',
        );

        $this->esito(
            str_contains((string) config('dompdf.public_path'), 'public_html') ? 'ok' : 'errore',
            'dompdf punta a public_html',
            'Se punta a una cartella che non esiste, il PDF dell\'attestato risponde 500. '
            . 'Si imposta in config/dompdf.php.',
        );
    }

    private function controllaTutor(): void
    {
        $fornitore = (string) config('chat.provider');

        if (! config('chat.key')) {
            $this->esito('avviso', 'Tutor AI non configurato',
                'Il resto del sito funziona lo stesso: il tutor risponde che non è configurato. '
                . 'Per accenderlo metti CHAT_API_KEY nel .env (fornitore attuale: ' . $fornitore . ').');
            return;
        }

        $this->esito('ok', "Tutor AI: {$fornitore}", 'La chiave c\'è.');

        // Conteggio in PHP e non con `wc -l`: sugli hosting condivisi
        // shell_exec è spesso disabilitato, e questo controllo deve funzionare
        // proprio lì.
        $archivio = storage_path('app/rag/quantum-arcade.store');
        $pezzi = 0;

        if (is_readable($archivio) && ($f = fopen($archivio, 'r')) !== false) {
            while (fgets($f) !== false) {
                $pezzi++;
            }
            fclose($f);
        }

        $this->esito(
            $pezzi > 0 ? 'ok' : 'errore',
            "Indice del sito per il tutor: {$pezzi} pezzi",
            'Senza indice il tutor non trova niente da citare e risponde "questo il corso non lo copre" a tutto. '
            . 'Si costruisce con: php artisan chat:ingest (da rilanciare dopo ogni modifica ai livelli).',
        );
    }

    /* ------------------------------------------------------------------ */

    private function esito(string $stato, string $titolo, string $dettaglio): void
    {
        $this->esiti[] = compact('stato', 'titolo', 'dettaglio');

        $segno = match ($stato) {
            'ok'     => '<fg=green>  ✓</>',
            'avviso' => '<fg=yellow>  !</>',
            default  => '<fg=red>  ✗</>',
        };

        $this->line("{$segno} {$titolo}");

        if ($stato !== 'ok') {
            $this->line("     <fg=gray>{$dettaglio}</>");
        }
    }

    private function riepilogo(): int
    {
        $conta = fn (string $stato): int => count(array_filter($this->esiti, fn (array $e): bool => $e['stato'] === $stato));
        $errori = $conta('errore');
        $avvisi = $conta('avviso');

        $this->newLine();

        if ($errori > 0) {
            $this->error(sprintf(
                '  %s da risolvere prima di aprire il sito al pubblico%s',
                $errori === 1 ? '1 problema' : "{$errori} problemi",
                $avvisi ? ($avvisi === 1 ? ', 1 avviso' : ", {$avvisi} avvisi") : '',
            ));
            return self::FAILURE;
        }

        if ($avvisi > 0) {
            $this->warn($avvisi === 1
                ? '  Tutto in piedi, ma c\'è una cosa da guardare (sopra, in giallo).'
                : "  Tutto in piedi, ma ci sono {$avvisi} cose da guardare (sopra, in giallo).");
            return self::SUCCESS;
        }

        $this->info('  ✅ Tutto a posto: il sito può andare online.');

        return self::SUCCESS;
    }
}
