<?php

namespace Tests\Feature\Modules;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Modules\Accounts\Mail\MagicLinkMail;
use Modules\Accounts\Models\MagicLink;
use Tests\TestCase;

/** Registrazione, conferma email e accesso: il cancello d'ingresso del corso. */
class AccountsTest extends TestCase
{
    use RefreshDatabase;

    private array $datiValidi = [
        'first_name' => 'Amos',
        'last_name'  => 'Rossi',
        'birth_date' => '2011-05-03',
        'email'      => 'amos@example.com',
        'password'   => 'quantum123',
        'password_confirmation' => 'quantum123',
        'privacy'    => true,
    ];

    public function test_registrazione_crea_utente_e_invia_email(): void
    {
        Mail::fake();

        $r = $this->postJson('/api/auth/register', $this->datiValidi);

        $r->assertCreated()
            ->assertJsonPath('user.first_name', 'Amos')
            ->assertJsonPath('user.verified', false);

        $this->assertDatabaseHas('users', ['email' => 'amos@example.com', 'last_name' => 'Rossi']);
        Mail::assertSent(MagicLinkMail::class);
        $this->assertAuthenticated();
    }

    public function test_registrazione_rifiuta_dati_incompleti(): void
    {
        $this->postJson('/api/auth/register', [])->assertStatus(422)
            ->assertJsonValidationErrors(['first_name', 'last_name', 'email', 'password', 'privacy']);
    }

    public function test_registrazione_rifiuta_email_gia_usata(): void
    {
        User::factory()->create(['email' => 'amos@example.com']);
        $this->postJson('/api/auth/register', $this->datiValidi)
            ->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_registrazione_rifiuta_password_deboli_o_diverse(): void
    {
        $this->postJson('/api/auth/register', [...$this->datiValidi, 'password' => 'corta', 'password_confirmation' => 'corta'])
            ->assertStatus(422)->assertJsonValidationErrors('password');

        $this->postJson('/api/auth/register', [...$this->datiValidi, 'password_confirmation' => 'altra12345'])
            ->assertStatus(422)->assertJsonValidationErrors('password');
    }

    public function test_registrazione_rifiuta_senza_consenso_privacy(): void
    {
        $this->postJson('/api/auth/register', [...$this->datiValidi, 'privacy' => false])
            ->assertStatus(422)->assertJsonValidationErrors('privacy');
    }

    public function test_il_link_conferma_email_e_apre_la_sessione(): void
    {
        $user = User::factory()->create(['email_verified_at' => null]);
        $token = MagicLink::issueFor($user, '127.0.0.1');

        $this->get('/api/auth/verify?token=' . $token)->assertRedirect('/?auth=ok');

        $this->assertNotNull($user->fresh()->email_verified_at);
        $this->assertAuthenticatedAs($user);
    }

    public function test_il_link_vale_una_volta_sola(): void
    {
        $user = User::factory()->create();
        $token = MagicLink::issueFor($user);

        $this->get('/api/auth/verify?token=' . $token)->assertRedirect('/?auth=ok');
        $this->post('/api/auth/logout');
        $this->get('/api/auth/verify?token=' . $token)->assertRedirect('/?auth=scaduto');
    }

    public function test_link_scaduto_o_inventato_non_apre_niente(): void
    {
        $this->get('/api/auth/verify?token=inventato')->assertRedirect('/?auth=scaduto');
        $this->get('/api/auth/verify')->assertRedirect('/?auth=scaduto');

        $user = User::factory()->create();
        $token = MagicLink::issueFor($user);
        MagicLink::query()->update(['expires_at' => now()->subHour()]);
        $this->get('/api/auth/verify?token=' . $token)->assertRedirect('/?auth=scaduto');
    }

    public function test_nel_database_non_finisce_mai_il_token_in_chiaro(): void
    {
        $user = User::factory()->create();
        $token = MagicLink::issueFor($user);
        $this->assertDatabaseMissing('magic_links', ['token' => $token]);
        $this->assertDatabaseHas('magic_links', ['token' => hash('sha256', $token)]);
    }

    public function test_accesso_con_password_giusta_e_sbagliata(): void
    {
        $user = User::factory()->create(['email' => 'a@b.it', 'password' => bcrypt('quantum123')]);

        $this->postJson('/api/auth/login', ['email' => 'a@b.it', 'password' => 'sbagliata'])
            ->assertStatus(422)->assertJsonPath('ok', false);

        $this->postJson('/api/auth/login', ['email' => 'A@B.it', 'password' => 'quantum123'])
            ->assertOk()->assertJsonPath('user.email', 'a@b.it');
        $this->assertAuthenticatedAs($user);
    }

    public function test_link_di_accesso_non_rivela_se_l_email_esiste(): void
    {
        Mail::fake();
        $rNoto = $this->postJson('/api/auth/magic', ['email' => 'ignoto@example.com']);
        User::factory()->create(['email' => 'noto@example.com']);
        $rIgnoto = $this->postJson('/api/auth/magic', ['email' => 'noto@example.com']);

        $this->assertSame($rNoto->json('message'), $rIgnoto->json('message'));
        Mail::assertSentCount(1);
    }

    public function test_me_distingue_ospite_e_iscritto(): void
    {
        $this->getJson('/api/auth/me')->assertOk()->assertJsonPath('authenticated', false);

        $user = User::factory()->create();
        $this->actingAs($user)->getJson('/api/auth/me')
            ->assertOk()->assertJsonPath('authenticated', true)->assertJsonPath('user.email', $user->email);
    }

    public function test_profilo_e_password_si_aggiornano(): void
    {
        $user = User::factory()->create(['password' => bcrypt('quantum123')]);

        $this->actingAs($user)->postJson('/api/auth/profile', [
            'first_name' => 'Nuovo', 'last_name' => 'Nome', 'birth_date' => '2000-01-01',
        ])->assertOk()->assertJsonPath('user.name', 'Nuovo Nome');

        $this->actingAs($user)->postJson('/api/auth/password', [
            'current' => 'sbagliata', 'password' => 'nuova12345', 'password_confirmation' => 'nuova12345',
        ])->assertStatus(422);

        $this->actingAs($user)->postJson('/api/auth/password', [
            'current' => 'quantum123', 'password' => 'nuova12345', 'password_confirmation' => 'nuova12345',
        ])->assertOk();
    }

    public function test_rinvio_email_di_conferma(): void
    {
        Mail::fake();
        $user = User::factory()->create(['email_verified_at' => null]);
        $this->actingAs($user)->postJson('/api/auth/resend')->assertOk();
        Mail::assertSent(MagicLinkMail::class);

        $verificato = User::factory()->create(['email_verified_at' => now()]);
        $this->actingAs($verificato)->postJson('/api/auth/resend')
            ->assertOk()->assertJsonPath('message', 'La tua email risulta già confermata.');
    }

    public function test_logout_e_cancellazione_definitiva(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->postJson('/api/auth/logout')->assertOk();
        $this->assertGuest();

        $this->actingAs($user)->deleteJson('/api/auth/me')->assertOk();
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_troppi_tentativi_di_accesso_vengono_bloccati(): void
    {
        User::factory()->create(['email' => 'a@b.it', 'password' => bcrypt('quantum123')]);

        for ($i = 0; $i < 8; $i++) {
            $this->postJson('/api/auth/login', ['email' => 'a@b.it', 'password' => 'no']);
        }

        $this->postJson('/api/auth/login', ['email' => 'a@b.it', 'password' => 'quantum123'])
            ->assertStatus(429)
            ->assertJsonPath('ok', false);
    }

    public function test_troppe_richieste_di_link_vengono_bloccate(): void
    {
        \Illuminate\Support\Facades\Mail::fake();
        User::factory()->create(['email' => 'c@d.it']);

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/auth/magic', ['email' => 'c@d.it'])->assertOk();
        }

        $this->postJson('/api/auth/magic', ['email' => 'c@d.it'])->assertStatus(429);
    }

    public function test_l_email_di_accesso_ha_oggetto_e_contenuto_giusti(): void
    {
        $user = User::factory()->create(['email' => 'x@y.it']);

        $benvenuto = new MagicLinkMail($user, 'https://esempio.it/token', true);
        $this->assertStringContainsString('conferma la tua email', $benvenuto->envelope()->subject);
        $this->assertSame('accounts::emails.magic-link', $benvenuto->content()->view);

        $ritorno = new MagicLinkMail($user, 'https://esempio.it/token', false);
        $this->assertStringContainsString('link di accesso', $ritorno->envelope()->subject);

        $html = $benvenuto->render();
        $this->assertStringContainsString('https://esempio.it/token', $html);
        $this->assertStringContainsString('20 minuti', $html);
    }

    public function test_un_nuovo_link_annulla_quello_precedente(): void
    {
        $user = User::factory()->create();
        $primo = MagicLink::issueFor($user);
        $secondo = MagicLink::issueFor($user);

        $this->get('/api/auth/verify?token=' . $primo)->assertRedirect('/?auth=scaduto');
        $this->get('/api/auth/verify?token=' . $secondo)->assertRedirect('/?auth=ok');
    }

    public function test_il_modello_sa_dire_se_un_link_e_ancora_valido(): void
    {
        $user = User::factory()->create();
        MagicLink::issueFor($user);
        $link = MagicLink::first();

        $this->assertTrue($link->isValid());
        $this->assertSame($user->id, $link->user->id);

        $link->update(['used_at' => now()]);
        $this->assertFalse($link->fresh()->isValid());
    }

    public function test_le_rotte_riservate_rispondono_401_agli_ospiti(): void
    {
        foreach ([['post', '/api/auth/profile'], ['post', '/api/auth/password'], ['post', '/api/auth/logout'], ['delete', '/api/auth/me']] as [$m, $url]) {
            $this->json($m, $url)->assertUnauthorized();
        }
    }
}
