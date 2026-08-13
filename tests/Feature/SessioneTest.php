<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * La sessione: il pezzo che, quando si rompe, non dà errore — semplicemente
 * i progressi smettono di salvarsi e chi gioca se ne accorge il giorno dopo.
 *
 * Gioco e API stanno sullo stesso dominio e l'accesso è a cookie di sessione,
 * quindi ogni POST deve portare con sé il token CSRF. Il client lo prendeva
 * chiedendo /sanctum/csrf-cookie — una rotta di Laravel Sanctum, che qui non
 * è installato: rispondeva 404, il client ignorava l'errore e tirava avanti.
 * Finché la pagina era appena stata caricata funzionava lo stesso (il cookie
 * lo mette la pagina); dopo due ore di gioco a pagina aperta il token era
 * scaduto, ogni salvataggio tornava 419 e non c'era modo di riprendersi
 * senza ricaricare.
 */
class SessioneTest extends TestCase
{
    use RefreshDatabase;

    public function test_esiste_una_rotta_che_rinfresca_il_token_csrf(): void
    {
        $r = $this->get('/api/csrf');

        $r->assertNoContent();
        $this->assertNotNull($r->getCookie('XSRF-TOKEN', false), 'la risposta deve portare il cookie XSRF-TOKEN');
    }

    public function test_la_rotta_del_token_non_richiede_di_essere_entrati(): void
    {
        $this->assertGuest();

        $this->get('/api/csrf')->assertNoContent();
    }

    public function test_la_rotta_del_token_non_tocca_chi_e_gia_entrato(): void
    {
        $utente = User::factory()->create();

        $this->actingAs($utente)->get('/api/csrf')->assertNoContent();

        $this->assertAuthenticatedAs($utente);
        $this->getJson('/api/auth/me')->assertOk()->assertJsonPath('authenticated', true);
    }

    /**
     * Il cookie «ricordami» è quello che tiene dentro chi torna il giorno dopo:
     * la sessione dura due ore, il corso dura settimane. Se smettesse di essere
     * emesso, ogni assenza lunga diventerebbe un accesso perso — e siccome i
     * progressi si scaricano dal server all'avvio, il gioco ripartirebbe vuoto.
     */
    public function test_la_registrazione_emette_il_cookie_ricordami(): void
    {
        $r = $this->postJson('/api/auth/register', [
            'first_name' => 'Amos',
            'last_name'  => 'Rossi',
            'email'      => 'amos@example.com',
            'password'   => 'quantum123',
            'password_confirmation' => 'quantum123',
            'privacy'    => true,
        ]);

        $r->assertCreated();
        $this->assertNotNull($this->cookieRicordami($r), 'senza «ricordami» la sessione si perde in due ore');
    }

    public function test_l_accesso_emette_il_cookie_ricordami(): void
    {
        User::factory()->create(['email' => 'amos@example.com', 'password' => bcrypt('quantum123')]);

        $r = $this->postJson('/api/auth/login', ['email' => 'amos@example.com', 'password' => 'quantum123']);

        $r->assertOk();
        $this->assertNotNull($this->cookieRicordami($r));
    }

    /** Le API rispondono 401 in JSON, non un redirect a una pagina di login che non esiste. */
    public function test_le_api_protette_rispondono_401_in_json(): void
    {
        $this->getJson('/api/progress')->assertUnauthorized();
        $this->putJson('/api/progress', ['xp' => 1, 'state' => []])->assertUnauthorized();
        $this->getJson('/api/exam/questions')->assertUnauthorized();
    }

    private function cookieRicordami(\Illuminate\Testing\TestResponse $r): ?\Symfony\Component\HttpFoundation\Cookie
    {
        foreach ($r->headers->getCookies() as $cookie) {
            if (str_starts_with($cookie->getName(), 'remember_web')) {
                return $cookie;
            }
        }

        return null;
    }
}
