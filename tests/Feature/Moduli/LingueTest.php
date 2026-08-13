<?php

namespace Tests\Feature\Moduli;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Modules\Accounts\Mail\MagicLinkMail;
use Tests\TestCase;

/**
 * Il sito esiste in italiano, inglese e spagnolo, ma il backend è uno solo.
 *
 * Il rischio da cui difendersi è preciso: un pezzo di interfaccia tradotto e
 * un pezzo no, e chi studia in spagnolo si ritrova un messaggio d'errore in
 * italiano proprio nel momento in cui qualcosa è andato storto. Qui si
 * controlla che la lingua venga scelta bene e che arrivi fino in fondo —
 * messaggi delle API, esame, attestato, email.
 */
class LingueTest extends TestCase
{
    use RefreshDatabase;

    /** @return array<int, int> le risposte giuste, per arrivare all'attestato */
    private function tutteGiuste(): array
    {
        $r = [];
        foreach (config('certificates.questions') as $q) {
            $r[$q['id']] = $q['c'];
        }

        return $r;
    }

    /* ---------------- scelta della lingua ---------------- */

    /**
     * Una richiesta davvero muta — nessun header, nessun parametro — deve
     * ricadere sull'italiano, che è la lingua sorgente.
     *
     * Si prova sul middleware e non con $this->get(): il client di prova di
     * Symfony infila comunque un «Accept-Language: en-us» che non si può
     * togliere, quindi da lì il caso «nessuna indicazione» non è osservabile.
     */
    public function test_senza_indicazioni_risponde_in_italiano(): void
    {
        $richiesta = \Illuminate\Http\Request::create('/api/auth/me');
        $richiesta->headers->remove('accept-language');

        (new \App\Http\Middleware\SetLocale())->handle(
            $richiesta,
            fn () => new \Illuminate\Http\Response(),
        );

        $this->assertSame('it', app()->getLocale());
    }

    public function test_una_lingua_che_non_esiste_ricade_sull_italiano(): void
    {
        $this->inLingua('de-DE')
            ->postJson('/api/auth/login', ['email' => 'nessuno@esempio.it', 'password' => 'sbagliata'])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Email o password non corrette.');
    }

    public function test_accept_language_sceglie_la_lingua(): void
    {
        $this->inLingua('en')
            ->postJson('/api/auth/login', ['email' => 'nessuno@esempio.it', 'password' => 'sbagliata'])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Email or password not correct.');

        $this->inLingua('es-ES')
            ->postJson('/api/auth/login', ['email' => 'nessuno@esempio.it', 'password' => 'sbagliata'])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Correo o contraseña incorrectos.');
    }

    public function test_accept_language_rispetta_le_priorita_q(): void
    {
        // il tedesco è primo ma non esiste; fra le nostre vince lo spagnolo, che ha q più alto
        $this->inLingua('de-DE,es;q=0.9,en;q=0.5')
            ->postJson('/api/auth/login', ['email' => 'nessuno@esempio.it', 'password' => 'sbagliata'])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Correo o contraseña incorrectos.');
    }

    public function test_il_parametro_lang_batte_l_header(): void
    {
        // il link condiviso vince sulle impostazioni del browser di chi lo apre:
        // chi riceve un attestato su LinkedIn deve vederlo come glielo hanno mandato
        $user   = User::factory()->create(['display_name' => 'Amos Rossi']);
        $codice = $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => $this->tutteGiuste()])->json('certificate.code');

        $this->inLingua('it-IT')->get('/verifica/' . $codice . '?lang=es')
            ->assertOk()
            ->assertSee('Certificado de finalización del curso')
            ->assertSee('Amos Rossi');
    }

    public function test_il_referer_del_sito_inglese_porta_risposte_inglesi(): void
    {
        // il gioco è statico e vive in /en/: le chiamate partono da lì anche se
        // il browser è configurato in un'altra lingua
        $this->inLingua('it-IT')
            ->withHeader('referer', 'http://localhost/en/lessons/01-qubit.html')
            ->postJson('/api/auth/login', ['email' => 'nessuno@esempio.it', 'password' => 'sbagliata'])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Email or password not correct.');
    }

    public function test_un_referer_esterno_non_puo_scegliere_la_lingua(): void
    {
        $this->inLingua('it-IT')
            ->withHeader('referer', 'https://sito-altrui.example/en/qualcosa')
            ->postJson('/api/auth/login', ['email' => 'nessuno@esempio.it', 'password' => 'sbagliata'])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Email o password non corrette.');
    }

    public function test_le_radici_delle_altre_lingue_rispondono(): void
    {
        // online ci pensa il DirectoryIndex, in sviluppo ci pensa la rotta:
        // se salta, il sito tradotto è raggiungibile solo dopo il deploy
        foreach (['/', '/en', '/es'] as $percorso) {
            $this->get($percorso)->assertOk();
        }

        $this->get('/de')->assertNotFound();
    }

    /* ---------------- esame ---------------- */

    public function test_l_esame_arriva_nella_lingua_richiesta(): void
    {
        $user = User::factory()->create();

        $italiane = $this->actingAs($user)->inLingua('it-IT')->getJson('/api/exam/questions')->assertOk()->json('questions');
        $inglesi  = $this->actingAs($user)->inLingua('en')->getJson('/api/exam/questions')->assertOk()->json('questions');
        $spagnole = $this->actingAs($user)->inLingua('es')->getJson('/api/exam/questions')->assertOk()->json('questions');

        $perId = fn (array $qs): array => collect($qs)->keyBy('id')->all();
        [$it, $en, $es] = [$perId($italiane), $perId($inglesi), $perId($spagnole)];

        // le domande escono mescolate a ogni chiamata: conta l'insieme degli id, non l'ordine
        $ordinati = function (array $qs): array {
            $id = array_keys($qs);
            sort($id);

            return $id;
        };
        $this->assertSame($ordinati($it), $ordinati($en), 'le stesse domande, con gli stessi id');
        $this->assertSame($ordinati($it), $ordinati($es), 'le stesse domande, con gli stessi id');

        // una domanda qualsiasi deve risultare davvero diversa in tutte e tre
        $id = array_key_first($it);
        $this->assertNotSame($it[$id]['q'], $en[$id]['q']);
        $this->assertNotSame($it[$id]['q'], $es[$id]['q']);
        $this->assertNotSame($en[$id]['q'], $es[$id]['q']);
    }

    /**
     * Il pericolo vero della traduzione di un esame: l'indice della risposta
     * giusta è UNO SOLO per tutte le lingue, quindi se le opzioni tradotte
     * finissero in un altro ordine l'esame boccerebbe chi risponde bene.
     */
    public function test_le_opzioni_tradotte_restano_nello_stesso_ordine(): void
    {
        foreach (config('certificates.questions') as $q) {
            foreach (['en', 'es'] as $lingua) {
                if (! isset($q[$lingua])) {
                    continue;
                }
                $this->assertCount(
                    count($q['o']),
                    $q[$lingua]['o'],
                    "la domanda {$q['id']} in {$lingua} ha un numero di opzioni diverso dall'italiano",
                );
            }
        }
    }

    public function test_l_esame_si_supera_uguale_in_ogni_lingua(): void
    {
        foreach (['it-IT', 'en', 'es'] as $lingua) {
            $user = User::factory()->create();

            $this->actingAs($user)->inLingua($lingua)
                ->postJson('/api/exam/submit', ['answers' => $this->tutteGiuste()])
                ->assertOk()
                ->assertJsonPath('percent', 100)
                ->assertJsonPath('passed', true);
        }
    }

    public function test_la_correzione_spiega_gli_errori_nella_lingua_giusta(): void
    {
        $user  = User::factory()->create();
        $prima = collect(config('certificates.questions'))->first();

        $review = $this->actingAs($user)->inLingua('es')
            ->postJson('/api/exam/submit', ['answers' => [$prima['id'] => $prima['c']]])
            ->assertOk()
            ->json('review');

        $riga = collect($review)->firstWhere('id', $prima['id']);

        $this->assertSame($prima['es']['q'], $riga['q']);
        $this->assertSame($prima['es']['w'], $riga['why']);
        $this->assertSame($prima['es']['o'][$prima['c']], $riga['correct']);
    }

    /* ---------------- attestato ---------------- */

    public function test_la_pagina_di_verifica_e_tradotta_e_offre_le_altre_lingue(): void
    {
        $user   = User::factory()->create(['display_name' => 'Amos Rossi']);
        $codice = $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => $this->tutteGiuste()])->json('certificate.code');

        $this->inLingua('en')->get('/verifica/' . $codice)
            ->assertOk()
            ->assertSee('Course completion certificate')
            ->assertSee('Valid certificate', escape: false)
            // il link al corso porta alla copia inglese, non alla radice italiana
            ->assertSee('href="/en/"', escape: false)
            // il selettore dice in che lingua sei, con il nome nella lingua stessa
            ->assertSee('<span class="lang-name">English</span>', escape: false)
            // e da qui si può passare alle altre due
            ->assertSee('?lang=es', escape: false)
            ->assertSee('?lang=it', escape: false)
            ->assertSee('Español', escape: false)
            ->assertSee('Italiano', escape: false);
    }

    public function test_l_open_badge_e_tradotto(): void
    {
        $user   = User::factory()->create(['display_name' => 'Amos Rossi']);
        $codice = $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => $this->tutteGiuste()])->json('certificate.code');

        $r = $this->inLingua('es')->getJson('/api/badge/' . $codice . '.json')->assertOk();

        $this->assertStringContainsString('Certificado de finalización', $r->json('name'));
        $this->assertStringContainsString('acreditada por un organismo tercero', $r->json('evidence.0.description'));

        // i dati verificabili non si traducono: sono gli stessi ovunque
        $this->assertSame($codice, $r->json('credentialSubject.identifier'));
        $this->assertSame('Amos Rossi', $r->json('credentialSubject.name'));
    }

    public function test_il_pdf_si_genera_anche_nelle_altre_lingue(): void
    {
        $user   = User::factory()->create(['display_name' => 'Amos Rossi', 'birth_date' => '2011-05-03']);
        $codice = $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => $this->tutteGiuste()])->json('certificate.code');

        foreach (['it-IT', 'en', 'es'] as $lingua) {
            $r = $this->inLingua($lingua)->get('/attestato/' . $codice . '.pdf');
            $r->assertOk()->assertHeader('content-type', 'application/pdf');
            $this->assertStringStartsWith('%PDF', $r->getContent());
        }
    }

    /* ---------------- email ---------------- */

    public function test_l_email_di_accesso_parte_nella_lingua_di_chi_si_iscrive(): void
    {
        Mail::fake();

        $this->inLingua('es')->postJson('/api/auth/register', [
            'first_name' => 'Amos', 'last_name' => 'Rossi',
            'email' => 'amos@esempio.es', 'password' => 'segreta123',
            'password_confirmation' => 'segreta123', 'privacy' => true,
        ])->assertCreated()
          ->assertJsonPath('message', 'Cuenta creada. Te he mandado un correo para confirmar la dirección: hace falta para el certificado final.');

        Mail::assertSent(MagicLinkMail::class, fn (MagicLinkMail $m): bool => $m->locale === 'es');
    }

    /* ---------------- tutor ---------------- */

    public function test_il_tutor_dice_in_che_lingua_deve_rispondere(): void
    {
        // le istruzioni restano scritte in italiano (le legge il modello, non lo studente),
        // ma devono ordinare la lingua di uscita e i link della copia giusta del sito
        $inglese = (new \Modules\Chat\Agents\QuantumTutor(levelContext: null, lingua: 'en'))->instructions();
        $this->assertStringContainsString('in inglese', $inglese);
        $this->assertStringContainsString('/en/lessons/', $inglese);

        $spagnolo = (new \Modules\Chat\Agents\QuantumTutor(levelContext: null, lingua: 'es'))->instructions();
        $this->assertStringContainsString('in spagnolo', $spagnolo);
        $this->assertStringContainsString('/es/lecciones/', $spagnolo);
    }
}
