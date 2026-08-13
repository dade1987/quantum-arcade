<?php

namespace Tests\Feature\Modules;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Progress\Models\PlayerState;
use Tests\TestCase;

/** I progressi vivono sul server: qui si verifica che non se ne perda mai nessuno. */
class ProgressTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_nuovo_iscritto_parte_da_zero(): void
    {
        $this->actingAs(User::factory()->create())
            ->getJson('/api/progress')
            ->assertOk()->assertJsonPath('xp', 0);
    }

    public function test_il_salvataggio_crea_e_aggiorna_lo_stato(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->putJson('/api/progress', [
            'xp' => 150,
            'state' => ['lessons' => ['01-qubit' => ['mastered' => true]], 'missions' => ['01-qubit/m' => 1]],
        ])->assertOk()->assertJsonPath('xp', 150);

        $this->assertDatabaseHas('player_states', ['user_id' => $user->id, 'xp' => 150, 'levels_mastered' => 1]);
    }

    public function test_gli_xp_non_scendono_mai(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->putJson('/api/progress', ['xp' => 500, 'state' => []]);
        $this->actingAs($user)->putJson('/api/progress', ['xp' => 10, 'state' => []])
            ->assertOk()->assertJsonPath('xp', 500);
    }

    public function test_due_dispositivi_uniscono_i_progressi_senza_perdere_nulla(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->putJson('/api/progress', [
            'xp' => 100, 'state' => ['lessons' => ['01-qubit' => ['mastered' => true]]],
        ]);
        $r = $this->actingAs($user)->putJson('/api/progress', [
            'xp' => 80, 'state' => ['lessons' => ['02-bloch' => ['mastered' => true]]],
        ]);

        $r->assertOk();
        $this->assertArrayHasKey('01-qubit', $r->json('state.lessons'), 'il primo dispositivo non deve essere cancellato');
        $this->assertArrayHasKey('02-bloch', $r->json('state.lessons'));
    }

    public function test_il_ripasso_tiene_la_scatola_piu_bassa(): void
    {
        $unito = PlayerState::mergeState(
            ['bank' => ['k' => ['box' => 4]]],
            ['bank' => ['k' => ['box' => 1]], 'free' => true],
        );

        $this->assertSame(1, $unito['bank']['k']['box'], 'la domanda meno consolidata deve avere la precedenza');
        $this->assertTrue($unito['free']);
    }

    public function test_merge_accetta_stati_vuoti(): void
    {
        $unito = PlayerState::mergeState([], []);
        $this->assertSame([], $unito['lessons']);
        $this->assertSame([], $unito['bank']);
        $this->assertFalse($unito['free']);
    }

    public function test_il_salvataggio_rifiuta_dati_assurdi(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->putJson('/api/progress', ['xp' => -5, 'state' => []])->assertStatus(422);
        $this->actingAs($user)->putJson('/api/progress', ['xp' => 10])->assertStatus(422);
        $this->actingAs($user)->putJson('/api/progress', ['xp' => 999999, 'state' => []])->assertStatus(422);
    }

    public function test_gli_ospiti_non_possono_leggere_ne_scrivere_progressi(): void
    {
        $this->getJson('/api/progress')->assertUnauthorized();
        $this->putJson('/api/progress', ['xp' => 1, 'state' => []])->assertUnauthorized();
    }

    public function test_gli_eventi_di_livello_si_registrano_anche_dagli_ospiti(): void
    {
        $this->postJson('/api/progress/event', ['level_id' => '01-qubit', 'event' => 'entered'])->assertOk();
        $this->assertDatabaseHas('level_events', ['level_id' => '01-qubit', 'event' => 'entered', 'user_id' => null]);

        $user = User::factory()->create();
        $this->actingAs($user)->postJson('/api/progress/event', ['level_id' => '01-qubit', 'event' => 'mastered'])->assertOk();
        $this->assertDatabaseHas('level_events', ['user_id' => $user->id, 'event' => 'mastered']);

        $this->postJson('/api/progress/event', ['level_id' => '01-qubit', 'event' => 'inventato'])->assertStatus(422);
    }

    public function test_lo_stato_e_collegato_all_utente(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->putJson('/api/progress', ['xp' => 10, 'state' => []]);
        $this->assertSame($user->id, PlayerState::first()->user->id);
    }

    public function test_cancellare_l_account_cancella_anche_i_progressi(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->putJson('/api/progress', ['xp' => 10, 'state' => []]);
        $user->delete();
        $this->assertDatabaseMissing('player_states', ['user_id' => $user->id]);
    }
}
