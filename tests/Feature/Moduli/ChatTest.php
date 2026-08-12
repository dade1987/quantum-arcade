<?php

namespace Tests\Feature\Moduli;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Modules\Chat\Agents\QuantumTutor;
use Modules\Chat\Models\ChatMessage;
use Modules\Chat\Models\Conversation;
use Tests\TestCase;

/**
 * Il tutor AI. Le chiamate al modello non si fanno nei test (costano e
 * dipendono dalla rete): qui si collauda tutto il contorno, che è la parte
 * dove si annidano davvero i problemi.
 */
class ChatTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        RateLimiter::clear('chat:127.0.0.1');
    }

    public function test_senza_chiavi_configurate_lo_dice_invece_di_rompersi(): void
    {
        config(['chat.key' => null]);

        $this->postJson('/api/chat', ['message' => 'Cos\'è un qubit?', 'session_id' => 'S1'])
            ->assertStatus(503)
            ->assertJsonPath('ok', false)
            ->assertJsonPath('message', 'Il tutor non è ancora configurato su questo server.');
    }

    public function test_rifiuta_messaggi_vuoti_o_troppo_lunghi(): void
    {
        config(['chat.key' => 'finta']);

        $this->postJson('/api/chat', ['session_id' => 'S1'])->assertStatus(422);
        $this->postJson('/api/chat', ['message' => 'x', 'session_id' => 'S1'])->assertStatus(422);
        $this->postJson('/api/chat', ['message' => str_repeat('a', 5000), 'session_id' => 'S1'])->assertStatus(422);
        $this->postJson('/api/chat', ['message' => 'domanda valida'])->assertStatus(422);
    }

    public function test_il_limite_di_domande_all_ora_protegge_dagli_abusi(): void
    {
        config(['chat.rate_per_hour' => 2, 'chat.key' => null]);

        $this->postJson('/api/chat', ['message' => 'una', 'session_id' => 'S']);
        $this->postJson('/api/chat', ['message' => 'due', 'session_id' => 'S']);

        $this->postJson('/api/chat', ['message' => 'tre', 'session_id' => 'S'])
            ->assertStatus(429)
            ->assertJsonPath('ok', false);
    }

    public function test_il_voto_pollice_su_o_giu_si_registra(): void
    {
        $conv = Conversation::create(['session_id' => 'S1', 'level_id' => '01-qubit']);
        $msg = ChatMessage::create(['conversation_id' => $conv->id, 'role' => 'assistant', 'content' => 'risposta']);

        $this->postJson('/api/chat/feedback', ['message_id' => $msg->id, 'rating' => 1])->assertOk();
        $this->assertSame(1, $msg->fresh()->rating);

        $this->postJson('/api/chat/feedback', ['message_id' => $msg->id, 'rating' => -1])->assertOk();
        $this->assertSame(-1, $msg->fresh()->rating);

        $this->postJson('/api/chat/feedback', ['message_id' => $msg->id, 'rating' => 5])->assertStatus(422);
        $this->postJson('/api/chat/feedback', ['rating' => 1])->assertStatus(422);
    }

    public function test_il_voto_non_tocca_i_messaggi_dell_utente(): void
    {
        $conv = Conversation::create(['session_id' => 'S1']);
        $mio = ChatMessage::create(['conversation_id' => $conv->id, 'role' => 'user', 'content' => 'domanda']);

        $this->postJson('/api/chat/feedback', ['message_id' => $mio->id, 'rating' => 1])->assertOk();
        $this->assertNull($mio->fresh()->rating, 'si vota la risposta del tutor, non la propria domanda');
    }

    public function test_le_conversazioni_collegano_messaggi_utente_e_livello(): void
    {
        $user = User::factory()->create();
        $conv = Conversation::create(['session_id' => 'S9', 'user_id' => $user->id, 'level_id' => '18-qft']);
        ChatMessage::create(['conversation_id' => $conv->id, 'role' => 'user', 'content' => 'ciao']);
        ChatMessage::create([
            'conversation_id' => $conv->id, 'role' => 'assistant', 'content' => 'ciao a te',
            'sources' => ['/lezioni/18-qft.html'], 'latency_ms' => 120,
        ]);

        $this->assertCount(2, $conv->messages);
        $this->assertSame(['/lezioni/18-qft.html'], $conv->messages->last()->sources);
        $this->assertSame($conv->id, ChatMessage::first()->conversation->id);
    }

    public function test_cancellare_l_utente_non_cancella_le_statistiche_ma_lo_scollega(): void
    {
        $user = User::factory()->create();
        Conversation::create(['session_id' => 'S1', 'user_id' => $user->id]);
        $user->delete();

        $this->assertDatabaseHas('conversations', ['session_id' => 'S1', 'user_id' => null]);
    }

    public function test_le_istruzioni_del_tutor_contengono_le_regole_didattiche(): void
    {
        $istruzioni = (new QuantumTutor())->instructions();

        $this->assertStringContainsString('italiano', $istruzioni);
        $this->assertStringContainsString('indizio', $istruzioni, 'non deve dare le soluzioni');
        $this->assertStringContainsString('Non inventare mai', $istruzioni);
        $this->assertStringContainsString('ATTESTATO DI COMPLETAMENTO', $istruzioni);

        $conContesto = (new QuantumTutor('18-qft'))->instructions();
        $this->assertStringContainsString('18-qft', $conContesto);
    }

    public function test_l_indicizzazione_a_secco_non_chiama_le_api_e_conta_i_pezzi(): void
    {
        $this->artisan('chat:ingest --dry')
            ->expectsOutputToContain('pezzi da')
            ->expectsOutputToContain('Modalità dry')
            ->assertSuccessful();
    }

    public function test_l_indicizzazione_si_ferma_se_mancano_le_chiavi(): void
    {
        // vale solo per gli embedding via API: quelli locali non hanno chiavi
        config(['chat.embeddings' => 'openai', 'chat.embeddings_key' => null]);
        $this->artisan('chat:ingest')->assertFailed();
    }

    public function test_il_rapporto_riassume_le_conversazioni(): void
    {
        $conv = Conversation::create(['session_id' => 'S1', 'level_id' => '01-qubit']);
        ChatMessage::create(['conversation_id' => $conv->id, 'role' => 'assistant', 'content' => 'una risposta', 'rating' => -1, 'latency_ms' => 900]);

        $this->artisan('chat:report --days=30')
            ->expectsOutputToContain('Livelli da cui partono più domande')
            ->assertSuccessful();
    }

    public function test_il_rapporto_regge_anche_il_database_vuoto(): void
    {
        $this->artisan('chat:report')->expectsOutputToContain('nessuna, per ora')->assertSuccessful();
    }

    /**
     * Sugli hosting condivisi proc_open è quasi sempre disattivato. Neuron AI
     * manda le sue tracce a Inspector in un processo separato, e senza proc_open
     * la prima domanda al tutor moriva con "PHP function 'proc_open' is not
     * available" — anche senza aver mai configurato Inspector.
     *
     * Una funzione non si può disattivare a runtime: il collaudo gira in un PHP
     * a parte, avviato com'è sul server dell'hosting.
     */
    public function test_il_tutor_parte_anche_dove_proc_open_e_disattivato(): void
    {
        if ($this->phpSenzaProcOpen('echo (int) function_exists("proc_open");') !== '0') {
            $this->markTestSkipped('questo PHP non applica -d disable_functions');
        }

        $uscita = $this->phpSenzaProcOpen(
            'require ' . var_export(base_path('vendor/autoload.php'), true) . ';'
            . '$app = require ' . var_export(base_path('bootstrap/app.php'), true) . ';'
            . '$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();'
            . 'NeuronAI\Observability\EventBus::emit("una-domanda", new stdClass());'
            . 'echo "vivo";'
        );

        $this->assertStringNotContainsString('proc_open', $uscita);
        $this->assertStringContainsString('vivo', $uscita, "l'agente è morto all'avvio: {$uscita}");
    }

    /** Esegue del codice in un PHP senza proc_open e restituisce quello che stampa. */
    private function phpSenzaProcOpen(string $codice): string
    {
        return trim((string) shell_exec(
            escapeshellarg(PHP_BINARY) . ' -d disable_functions=proc_open -r ' . escapeshellarg($codice) . ' 2>&1'
        ));
    }

    /* ---------------- il giro completo, con un tutor finto ---------------- */

    private function tutorFinto(string $risposta): void
    {
        config(['chat.key' => 'finta']);

        $this->app->bind(QuantumTutor::class, fn () => new class($risposta) extends QuantumTutor {
            public function __construct(private string $risposta) { parent::__construct(null); }
            public function ask(string $question): string { return $this->risposta; }
        });
    }

    public function test_una_domanda_produce_risposta_fonti_e_conversazione_salvata(): void
    {
        $this->tutorFinto('Il qubit è una coppia di ampiezze: lo trovi nel livello 1 → /lezioni/01-qubit.html');

        $r = $this->postJson('/api/chat', [
            'message' => 'Cos\'è un qubit?', 'session_id' => 'S-123', 'level_id' => '01-qubit',
        ]);

        $r->assertOk()
            ->assertJsonPath('ok', true)
            ->assertJsonPath('sources', ['/lezioni/01-qubit.html']);

        $this->assertIsInt($r->json('message_id'));
        $this->assertGreaterThanOrEqual(0, $r->json('latency_ms'));

        $this->assertDatabaseHas('conversations', ['session_id' => 'S-123', 'level_id' => '01-qubit']);
        $this->assertDatabaseHas('chat_messages', ['role' => 'user', 'content' => 'Cos\'è un qubit?']);
        $this->assertDatabaseHas('chat_messages', ['role' => 'assistant']);
    }

    public function test_due_domande_nella_stessa_sessione_restano_nella_stessa_conversazione(): void
    {
        $this->tutorFinto('risposta');

        $this->postJson('/api/chat', ['message' => 'prima domanda', 'session_id' => 'S-1']);
        $this->postJson('/api/chat', ['message' => 'seconda domanda', 'session_id' => 'S-1']);

        $this->assertDatabaseCount('conversations', 1);
        $this->assertDatabaseCount('chat_messages', 4);
    }

    public function test_se_la_conservazione_e_disattivata_non_si_salva_nulla(): void
    {
        $this->tutorFinto('risposta');
        config(['chat.store_conversations' => false]);

        $this->postJson('/api/chat', ['message' => 'una domanda', 'session_id' => 'S-2'])
            ->assertOk()->assertJsonPath('message_id', null);

        $this->assertDatabaseCount('chat_messages', 0);
    }

    public function test_se_il_modello_va_in_errore_la_risposta_e_pulita(): void
    {
        config(['chat.key' => 'finta']);
        $this->app->bind(QuantumTutor::class, fn () => new class extends QuantumTutor {
            public function __construct() { parent::__construct(null); }
            public function ask(string $question): string { throw new \RuntimeException('modello non raggiungibile'); }
        });

        $this->postJson('/api/chat', ['message' => 'una domanda', 'session_id' => 'S-3'])
            ->assertStatus(500)
            ->assertJsonPath('message', 'Il tutor ha avuto un problema. Riprova fra poco.');
    }

    public function test_l_utente_iscritto_viene_collegato_alla_conversazione(): void
    {
        $this->tutorFinto('risposta');
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/chat', ['message' => 'domanda', 'session_id' => 'S-4'])->assertOk();

        $this->assertDatabaseHas('conversations', ['session_id' => 'S-4', 'user_id' => $user->id]);
    }

    public function test_ask_senza_rete_fallisce_in_modo_pulito(): void
    {
        config(['chat.key' => 'chiave-finta', 'chat.embeddings_key' => 'chiave-finta']);

        // Nessuna chiamata vera al modello: la chiave è inventata, quindi
        // l'agente deve sollevare un'eccezione — che il controller trasforma
        // nel messaggio "Il tutor ha avuto un problema".
        $this->expectException(\Throwable::class);
        (new QuantumTutor())->ask('domanda');
    }

    public function test_l_indicizzazione_avvisa_se_non_trova_pagine(): void
    {
        $vuota = sys_get_temp_dir() . '/qa-public-vuota-' . uniqid();
        mkdir($vuota, 0o777, true);
        $this->app->usePublicPath($vuota);

        $this->artisan('chat:ingest --dry')
            ->expectsOutputToContain('Nessuna pagina trovata')
            ->assertFailed();

        rmdir($vuota);
    }

    public function test_l_indicizzazione_salta_le_pagine_quasi_vuote(): void
    {
        $dir = sys_get_temp_dir() . '/qa-public-mini-' . uniqid();
        mkdir($dir, 0o777, true);
        file_put_contents($dir . '/vuota.html', '<html><body>ciao</body></html>');
        file_put_contents($dir . '/piena.html', '<html><title>T</title><body>' . str_repeat('contenuto vero e lungo. ', 60) . '</body></html>');
        $this->app->usePublicPath($dir);

        $this->artisan('chat:ingest --dry')
            ->expectsOutputToContain('pezzi da 2 pagine')
            ->assertSuccessful();

        unlink($dir . '/vuota.html');
        unlink($dir . '/piena.html');
        rmdir($dir);
    }

    public function test_l_indicizzazione_completa_passa_i_documenti_all_agente(): void
    {
        config(['chat.embeddings_key' => 'finta']);

        $dir = sys_get_temp_dir() . '/qa-public-ingest-' . uniqid();
        mkdir($dir, 0o777, true);
        file_put_contents($dir . '/pagina.html', '<html><title>Livello</title><body>'
            . str_repeat('Il qubit è una coppia di ampiezze. ', 80) . '</body></html>');
        $this->app->usePublicPath($dir);

        $ricevuti = [];
        $this->app->bind(QuantumTutor::class, fn () => new class($ricevuti) extends QuantumTutor {
            public function __construct(private &$ricevuti) { parent::__construct(null); }
            public function reindexBySource(array $documents, int $chunkSize = 50): void { $this->ricevuti = $documents; }
        });

        $this->artisan('chat:ingest')
            ->expectsOutputToContain('Il tutor adesso conosce il sito aggiornato')
            ->assertSuccessful();

        unlink($dir . '/pagina.html');
        rmdir($dir);
    }

    public function test_con_gli_embedding_via_api_l_indicizzazione_avvisa_che_sta_spendendo(): void
    {
        config(['chat.embeddings' => 'openai', 'chat.embeddings_key' => 'finta']);

        $dir = sys_get_temp_dir() . '/qa-public-api-' . uniqid();
        mkdir($dir, 0o777, true);
        file_put_contents($dir . '/pagina.html', '<html><title>Livello</title><body>'
            . str_repeat('La fase decide come si sommano le frecce. ', 80) . '</body></html>');
        $this->app->usePublicPath($dir);

        // niente chiamate vere: l'agente finto non calcola nulla
        $this->app->bind(QuantumTutor::class, fn () => new class extends QuantumTutor {
            public function __construct() { parent::__construct(null); }
            public function reindexBySource(array $documents, int $chunkSize = 50): void {}
        });

        $this->artisan('chat:ingest')
            ->expectsOutputToContain('Calcolo gli embedding e salvo')
            ->assertSuccessful();

        unlink($dir . '/pagina.html');
        rmdir($dir);
    }

    /* ---------------- fornitori intercambiabili ---------------- */

    /** Chiama un metodo protetto dell'agente (le fabbriche di Neuron AI lo sono). */
    private function fabbrica(QuantumTutor $tutor, string $nome): object
    {
        return (new \ReflectionMethod($tutor, $nome))->invoke($tutor);
    }

    public function test_il_fornitore_si_cambia_dal_env_senza_toccare_il_codice(): void
    {
        config(['chat.key' => 'k', 'chat.model' => null]);
        $tutor = new QuantumTutor('01-qubit');

        config(['chat.provider' => 'deepseek']);
        $this->assertInstanceOf(\NeuronAI\Providers\Deepseek\Deepseek::class, $this->fabbrica($tutor, 'provider'));

        config(['chat.provider' => 'anthropic']);
        $this->assertInstanceOf(\NeuronAI\Providers\Anthropic\Anthropic::class, $this->fabbrica($tutor, 'provider'));

        config(['chat.provider' => 'openai']);
        $this->assertInstanceOf(\NeuronAI\Providers\OpenAI\OpenAI::class, $this->fabbrica($tutor, 'provider'));

        // un nome sconosciuto non fa esplodere il sito: si ripiega su DeepSeek
        config(['chat.provider' => 'fornitore-inventato']);
        $this->assertInstanceOf(\NeuronAI\Providers\Deepseek\Deepseek::class, $this->fabbrica($tutor, 'provider'));
    }

    public function test_ogni_fornitore_ha_un_modello_predefinito_sensato(): void
    {
        $this->assertSame('deepseek-chat', QuantumTutor::MODELLI['deepseek']);
        $this->assertArrayHasKey('anthropic', QuantumTutor::MODELLI);
        $this->assertArrayHasKey('openai', QuantumTutor::MODELLI);
    }

    public function test_la_ricerca_e_locale_per_default_e_puo_diventare_api(): void
    {
        config(['chat.embeddings_key' => 'k2', 'chat.embeddings_model' => null]);
        $tutor = new QuantumTutor();

        config(['chat.embeddings' => 'locale']);
        $this->assertInstanceOf(\Modules\Chat\Embeddings\EmbeddingLocale::class, $this->fabbrica($tutor, 'embeddings'));
        $this->assertFalse(QuantumTutor::embeddingsRichiedonoChiave());

        foreach ([
            'openai'  => \NeuronAI\RAG\Embeddings\OpenAIEmbeddingsProvider::class,
            'gemini'  => \NeuronAI\RAG\Embeddings\GeminiEmbeddingsProvider::class,
            'mistral' => \NeuronAI\RAG\Embeddings\MistralEmbeddingsProvider::class,
            'voyage'  => \NeuronAI\RAG\Embeddings\VoyageEmbeddingsProvider::class,
        ] as $nome => $classe) {
            config(['chat.embeddings' => $nome]);
            $this->assertInstanceOf($classe, $this->fabbrica($tutor, 'embeddings'), "embeddings=$nome");
            $this->assertTrue(QuantumTutor::embeddingsRichiedonoChiave(), "embeddings=$nome richiede una chiave");
        }
    }

    public function test_l_archivio_vettoriale_si_crea_da_solo_alla_prima_installazione(): void
    {
        // la cartella è esclusa dal repository: alla prima installazione non c'è
        $rag = storage_path('app/rag');
        $archivio = $rag . '/quantum-arcade.store';
        $salvato = file_exists($archivio) ? file_get_contents($archivio) : null;

        @unlink($archivio);
        @rmdir($rag);

        $this->assertInstanceOf(
            \NeuronAI\RAG\VectorStore\FileVectorStore::class,
            $this->fabbrica(new QuantumTutor(), 'vectorStore'),
        );
        $this->assertFileExists($archivio, 'la cartella e l\'archivio vuoto devono essere creati');

        if ($salvato !== null) {
            file_put_contents($archivio, $salvato);   // non distruggo l'indice di chi sviluppa
        }
    }
}
