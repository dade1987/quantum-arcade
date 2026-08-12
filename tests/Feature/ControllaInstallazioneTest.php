<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

/**
 * Il controllo pre-volo (`php artisan sito:controlla`).
 *
 * È il comando che si lancia sul server appena caricato il sito. Se dicesse
 * "tutto a posto" quando non lo è, sarebbe peggio che non esistere: questi
 * test verificano che ogni problema venga davvero segnalato, e che il comando
 * esca con codice di errore quando qualcosa impedisce di aprire al pubblico.
 */
class ControllaInstallazioneTest extends TestCase
{
    use RefreshDatabase;

    /** Mette la configurazione nello stato di un server messo online bene. */
    private function serverPerfetto(): void
    {
        config([
            'app.url'               => 'https://quantumarcade.it',
            'app.debug'             => false,
            'mail.default'          => 'smtp',
            'mail.from.address'     => 'no-reply@quantumarcade.it',
            'certificates.questions' => array_fill(0, 30, ['id' => 1]),
            'certificates.questions_are_real' => true,
            'dompdf.public_path'    => base_path('public_html'),
            'chat.provider'         => 'deepseek',
            'chat.key'              => 'una-chiave',
        ]);

        $archivio = storage_path('app/rag/quantum-arcade.store');
        if (! is_dir(dirname($archivio))) {
            mkdir(dirname($archivio), 0o775, true);
        }
        if (! file_exists($archivio) || filesize($archivio) === 0) {
            file_put_contents($archivio, "pezzo di sito\n");
        }
    }

    public function test_su_un_server_a_posto_dice_che_si_puo_andare_online(): void
    {
        $this->serverPerfetto();

        $this->artisan('sito:controlla')
            ->expectsOutputToContain('Tutto a posto')
            ->assertSuccessful();
    }

    public function test_in_locale_segnala_come_avvisi_le_cose_che_valgono_solo_online(): void
    {
        $this->serverPerfetto();
        config(['app.url' => 'http://localhost', 'mail.default' => 'log', 'mail.from.address' => 'hello@example.com']);

        // in locale sono avvisi: non bloccano chi sta solo sviluppando
        $this->artisan('sito:controlla')
            ->expectsOutputToContain('cose da guardare')
            ->assertSuccessful();
    }

    public function test_in_produzione_gli_stessi_problemi_diventano_bloccanti(): void
    {
        $this->serverPerfetto();
        config(['app.url' => 'http://localhost', 'mail.default' => 'log']);

        $this->artisan('sito:controlla --produzione')
            ->expectsOutputToContain('da risolvere prima di aprire il sito al pubblico')
            ->assertFailed();
    }

    public function test_in_produzione_il_debug_acceso_e_un_errore(): void
    {
        $this->serverPerfetto();
        config(['app.debug' => true]);

        $this->artisan('sito:controlla --produzione')
            ->expectsOutputToContain('APP_DEBUG')
            ->assertFailed();
    }

    public function test_avvisa_se_manca_una_sola_cosa(): void
    {
        $this->serverPerfetto();
        config(['mail.from.address' => 'hello@example.com']);   // un solo avviso

        $this->artisan('sito:controlla')
            ->expectsOutputToContain('una cosa da guardare')
            ->assertSuccessful();
    }

    public function test_avvisa_sulla_versione_di_php_pretesa_dalle_dipendenze(): void
    {
        $this->serverPerfetto();

        // il file lo genera Composer: se c'è, il comando deve leggerlo e spiegare
        // che la versione del SITO può essere diversa da quella della riga di comando
        if (is_readable(base_path('vendor/composer/platform_check.php'))) {
            $this->artisan('sito:controlla')
                ->expectsOutputToContain('Le dipendenze installate richiedono PHP')
                ->assertSuccessful();
        } else {
            $this->markTestSkipped('vendor/composer/platform_check.php non presente');
        }
    }

    public function test_senza_il_controllo_di_composer_non_dice_niente_sulla_versione(): void
    {
        $this->serverPerfetto();

        $vero = base_path('vendor/composer/platform_check.php');
        $copia = $vero . '.spostato';
        $c_era = is_readable($vero);

        if ($c_era) {
            rename($vero, $copia);
        }

        try {
            $this->artisan('sito:controlla')
                ->doesntExpectOutputToContain('Le dipendenze installate richiedono PHP')
                ->assertSuccessful();
        } finally {
            if ($c_era) {
                rename($copia, $vero);
            }
        }
    }

    public function test_se_il_controllo_di_composer_ha_un_formato_inatteso_non_inventa_niente(): void
    {
        $this->serverPerfetto();

        $file = base_path('vendor/composer/platform_check.php');
        if (! is_readable($file)) {
            $this->markTestSkipped('vendor/composer/platform_check.php non presente');
        }

        $originale = file_get_contents($file);
        file_put_contents($file, "<?php\n// niente che assomigli a un vincolo di versione\n");

        try {
            // meglio tacere che stampare una versione inventata
            $this->artisan('sito:controlla')
                ->doesntExpectOutputToContain('Le dipendenze installate richiedono PHP')
                ->assertSuccessful();
        } finally {
            file_put_contents($file, $originale);
        }
    }

    public function test_si_accorge_se_mancano_le_tabelle(): void
    {
        $this->serverPerfetto();
        Schema::drop('conversations');
        $this->assertFalse(Schema::hasTable('conversations'), 'la tabella dev\'essere davvero sparita');

        $this->artisan('sito:controlla')
            ->expectsOutputToContain('Mancano: conversations')
            ->assertFailed();
    }

    public function test_si_accorge_se_il_database_non_risponde(): void
    {
        $this->serverPerfetto();
        $vera = config('database.default');

        try {
            config(['database.default' => 'connessione-che-non-esiste']);

            $this->artisan('sito:controlla')
                ->expectsOutputToContain('Non risponde')
                ->assertFailed();
        } finally {
            // senza questo, la transazione dei test non si chiude più e tutti
            // i test successivi falliscono con "cannot start a transaction"
            config(['database.default' => $vera]);
        }
    }

    public function test_avvisa_se_online_gira_con_le_domande_d_esempio(): void
    {
        $this->serverPerfetto();
        config(['certificates.questions_are_real' => false]);

        // è un avviso, non un errore: il sito funziona, ma l'attestato non vale
        $this->artisan('sito:controlla')
            ->expectsOutputToContain('D\'ESEMPIO')
            ->assertSuccessful();
    }

    public function test_si_accorge_se_la_banca_domande_e_vuota(): void
    {
        $this->serverPerfetto();
        config(['certificates.questions' => []]);

        $this->artisan('sito:controlla')
            ->expectsOutputToContain('npm run exam:sync')
            ->assertFailed();
    }

    public function test_si_accorge_se_dompdf_punta_alla_cartella_sbagliata(): void
    {
        $this->serverPerfetto();
        config(['dompdf.public_path' => '/var/www/public']);

        $this->artisan('sito:controlla')
            ->expectsOutputToContain('dompdf')
            ->assertFailed();
    }

    public function test_il_tutor_senza_chiave_e_solo_un_avviso(): void
    {
        $this->serverPerfetto();
        config(['chat.key' => null]);

        // il tutor spento non impedisce di aprire il sito: tutto il resto funziona
        $this->artisan('sito:controlla')
            ->expectsOutputToContain('Tutor AI non configurato')
            ->assertSuccessful();
    }

    public function test_il_tutor_con_la_chiave_ma_senza_indice_e_un_errore(): void
    {
        $this->serverPerfetto();

        $archivio = storage_path('app/rag/quantum-arcade.store');
        $salvato  = file_get_contents($archivio);
        file_put_contents($archivio, '');

        $this->artisan('sito:controlla')
            ->expectsOutputToContain('php artisan chat:ingest')
            ->assertFailed();

        file_put_contents($archivio, $salvato);
    }
}
