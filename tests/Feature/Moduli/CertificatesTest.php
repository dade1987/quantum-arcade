<?php

namespace Tests\Feature\Moduli;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Certificates\Models\Certificate;
use Modules\Certificates\Models\ExamAttempt;
use Tests\TestCase;

/**
 * Esame e attestato: la parte in cui la correttezza conta di più, perché
 * un attestato manipolabile non varrebbe nulla.
 */
class CertificatesTest extends TestCase
{
    use RefreshDatabase;

    private function tutteGiuste(): array
    {
        $r = [];
        foreach (config('certificates.questions') as $q) $r[$q['id']] = $q['c'];
        return $r;
    }

    private function tutteSbagliate(): array
    {
        $r = [];
        foreach (config('certificates.questions') as $q) $r[$q['id']] = $q['c'] === 0 ? 1 : 0;
        return $r;
    }

    public function test_le_domande_non_contengono_mai_la_risposta_esatta(): void
    {
        $r = $this->actingAs(User::factory()->create())->getJson('/api/exam/questions')->assertOk();

        // il numero non è fissato: cresce quando si aggiungono livelli (Simon ne
        // ha portate 3). Quello che deve restare vero è che l'esame le manda tutte
        // e che sono abbastanza da coprire il corso.
        $totale = count(config('certificates.questions'));
        $this->assertSame($totale, $r->json('total'));
        $this->assertGreaterThanOrEqual(30, $totale);
        $this->assertSame(80, $r->json('pass'));
        foreach ($r->json('questions') as $q) {
            $this->assertArrayNotHasKey('c', $q, 'la soluzione non deve uscire dal server');
            $this->assertArrayNotHasKey('correct', $q);
            $this->assertArrayHasKey('options', $q);
        }
    }

    public function test_le_domande_sono_mescolate(): void
    {
        $user = User::factory()->create();
        $primo = collect($this->actingAs($user)->getJson('/api/exam/questions')->json('questions'))->pluck('id')->all();
        $ordini = [];
        for ($i = 0; $i < 6; $i++) {
            $ordini[] = collect($this->actingAs($user)->getJson('/api/exam/questions')->json('questions'))->pluck('id')->all();
        }
        $this->assertTrue(collect($ordini)->contains(fn ($o) => $o !== $primo), 'devono cambiare ordine');
    }

    public function test_esame_superato_emette_l_attestato(): void
    {
        $user = User::factory()->create(['first_name' => 'Amos', 'last_name' => 'Rossi', 'display_name' => 'Amos Rossi']);

        $r = $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => $this->tutteGiuste(), 'seconds' => 600]);

        $r->assertOk()
            ->assertJsonPath('percent', 100)
            ->assertJsonPath('passed', true)
            ->assertJsonPath('certificate.name', 'Amos Rossi');

        $this->assertDatabaseHas('exam_attempts', ['user_id' => $user->id, 'percent' => 100, 'passed' => true]);
        $this->assertDatabaseHas('certificates', ['user_id' => $user->id, 'holder_name' => 'Amos Rossi']);
        $this->assertMatchesRegularExpression('/^QA-[A-Z0-9]{7}$/', $r->json('certificate.code'));
    }

    /**
     * Il numero di livelli era rimasto a 27 sull'attestato e sulla pagina di
     * verifica mentre il sito ne dichiarava 28: chi controlla l'attestato di
     * qualcun altro trovava due numeri diversi. Ora arriva dalla config, e
     * `npm run validate` tiene la config allineata a levels.js — ma la config
     * potrebbe smettere di arrivare fino alla pagina, e questo se ne accorge.
     */
    public function test_attestato_e_verifica_dicono_lo_stesso_numero_di_livelli(): void
    {
        $n = config('certificates.levels_count');
        $user = User::factory()->create();
        $codice = $this->actingAs($user)
            ->postJson('/api/exam/submit', ['answers' => $this->tutteGiuste()])
            ->json('certificate.code');

        $html = $this->get('/verifica/' . $codice)->assertOk()->getContent();
        $this->assertStringContainsString("— {$n} livelli interattivi", $html);
        $this->assertStringContainsString("percorso strutturato di {$n} livelli", $html);

        $badge = $this->getJson('/api/badge/' . $codice . '.json')->assertOk();
        $this->assertStringContainsString("i {$n} livelli del corso", $badge->json('credentialSubject.achievement.description'));
    }

    public function test_esame_fallito_non_emette_niente_ma_spiega_gli_errori(): void
    {
        $user = User::factory()->create();
        $r = $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => $this->tutteSbagliate()]);

        $r->assertOk()->assertJsonPath('passed', false)->assertJsonPath('certificate', null);
        $this->assertCount(count(config('certificates.questions')), $r->json('review'));
        $this->assertArrayHasKey('why', $r->json('review')[0]);
        $this->assertDatabaseCount('certificates', 0);
    }

    public function test_le_risposte_mancanti_contano_come_sbagliate(): void
    {
        $user = User::factory()->create();
        $r = $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => [1 => 0]]);
        $r->assertOk();
        $this->assertLessThan(10, $r->json('percent'));
    }

    public function test_ripetere_l_esame_aggiorna_l_attestato_solo_se_migliori(): void
    {
        $user = User::factory()->create();
        $parziali = $this->tutteGiuste();
        $parziali[1] = ($parziali[1] + 1) % 2;                    // ne sbaglio una: 96%

        $primo = $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => $parziali])->json();
        $this->assertTrue($primo['passed']);
        $codice = $primo['certificate']['code'];

        $peggiore = $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => $parziali])->json();
        $this->assertSame($codice, $peggiore['certificate']['code'], 'il codice non cambia');

        $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => $this->tutteGiuste()]);
        $this->assertSame(100, Certificate::firstWhere('user_id', $user->id)->percent);
        $this->assertDatabaseCount('certificates', 1);
    }

    public function test_la_pagina_di_verifica_mostra_gli_attestati_veri_e_nega_i_falsi(): void
    {
        $user = User::factory()->create(['display_name' => 'Amos Rossi']);
        $codice = $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => $this->tutteGiuste()])->json('certificate.code');

        $this->get('/verifica/' . $codice)->assertOk()->assertSee('Amos Rossi')->assertSee('Attestato valido');
        $this->get('/verifica/' . strtolower($codice))->assertOk()->assertSee('Amos Rossi');
        $this->get('/verifica/QA-FALSO1')->assertNotFound()->assertSee('Nessun attestato');
    }

    public function test_un_attestato_revocato_risulta_revocato(): void
    {
        $user = User::factory()->create();
        $codice = $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => $this->tutteGiuste()])->json('certificate.code');
        Certificate::where('code', $codice)->update(['revoked_at' => now()]);

        $this->get('/verifica/' . $codice)->assertOk()->assertSee('revocato');
        $this->get('/attestato/' . $codice . '.pdf')->assertStatus(410);
    }

    public function test_il_pdf_si_genera_ed_e_un_pdf_vero(): void
    {
        $user = User::factory()->create(['display_name' => 'Amos Rossi', 'birth_date' => '2011-05-03']);
        $codice = $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => $this->tutteGiuste()])->json('certificate.code');

        $r = $this->get('/attestato/' . $codice . '.pdf');
        $r->assertOk()->assertHeader('content-type', 'application/pdf');
        $this->assertStringStartsWith('%PDF', $r->getContent());

        $this->get('/attestato/' . $codice . '.pdf?inline=1')->assertOk();
        $this->get('/attestato/QA-FALSO1.pdf')->assertNotFound();
    }

    public function test_l_open_badge_e_leggibile_e_dichiara_i_limiti(): void
    {
        $user = User::factory()->create(['display_name' => 'Amos Rossi']);
        $codice = $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => $this->tutteGiuste()])->json('certificate.code');

        $r = $this->getJson('/api/badge/' . $codice . '.json')->assertOk();
        $this->assertContains('OpenBadgeCredential', $r->json('type'));
        $this->assertSame('Amos Rossi', $r->json('credentialSubject.name'));
        $this->assertStringContainsString('Non costituisce una certificazione accreditata', $r->json('evidence.0.description'));
        $this->assertFalse($r->json('revoked'));

        $this->getJson('/api/badge/QA-FALSO1.json')->assertNotFound();
    }

    public function test_l_esame_e_riservato_agli_iscritti(): void
    {
        $this->getJson('/api/exam/questions')->assertUnauthorized();
        $this->postJson('/api/exam/submit', ['answers' => [1 => 0]])->assertUnauthorized();
    }

    public function test_l_invio_rifiuta_dati_malformati(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->postJson('/api/exam/submit', [])->assertStatus(422);
        $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => ['x' => 'sì']])->assertStatus(422);
        $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => [1 => 99]])->assertStatus(422);
    }

    public function test_i_codici_generati_sono_unici_e_leggibili(): void
    {
        $codici = collect(range(1, 30))->map(fn () => Certificate::makeCode());
        $this->assertSame(30, $codici->unique()->count());
        foreach ($codici as $c) {
            $this->assertMatchesRegularExpression('/^QA-[A-Z0-9]{7}$/', $c);
            foreach (['O', '0', 'I', 'L', '1'] as $ambigua) {
                $this->assertStringNotContainsString($ambigua, substr($c, 3), "il codice non deve contenere '{$ambigua}': si confonde a leggerlo");
            }
        }
    }

    public function test_il_modello_espone_validita_e_indirizzo_di_verifica(): void
    {
        $c = new Certificate(['code' => 'QA-TEST123']);
        $this->assertTrue($c->isValid());
        $this->assertStringContainsString('/verifica/QA-TEST123', $c->verifyUrl());
        $c->revoked_at = now();
        $this->assertFalse($c->isValid());
    }

    public function test_relazioni_fra_tentativo_utente_e_attestato(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->postJson('/api/exam/submit', ['answers' => $this->tutteGiuste()]);

        $cert = Certificate::first();
        $this->assertSame($user->id, $cert->user->id);
        $this->assertInstanceOf(ExamAttempt::class, $cert->attempt);
        $this->assertSame($user->id, $cert->attempt->user->id);
    }
}
