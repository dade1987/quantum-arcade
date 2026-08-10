<?php

namespace Modules\Accounts\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Modules\Accounts\Mail\MagicLinkMail;
use Modules\Accounts\Models\MagicLink;

/**
 * Registrazione, conferma email e accesso.
 *
 * Flusso scelto:
 *  1. REGISTRAZIONE con nome, cognome, data di nascita, email e password.
 *     I dati anagrafici non sono burocrazia: finiscono sull'attestato, che deve
 *     poter essere verificato da un terzo. Senza nome e cognome non si emette.
 *  2. CONFERMA EMAIL con link monouso: finché non la confermi puoi giocare,
 *     ma non puoi sostenere l'esame né ottenere l'attestato.
 *  3. ACCESSO con email + password, oppure — se la password l'hai persa —
 *     con un link di accesso via email.
 */
class AuthController extends Controller
{
    /** POST /api/auth/register */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'min:2', 'max:60'],
            'last_name'  => ['required', 'string', 'min:2', 'max:60'],
            'birth_date' => ['nullable', 'date', 'before:today', 'after:1900-01-01'],
            'email'      => ['required', 'email:rfc', 'max:190', 'unique:users,email'],
            'password'   => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            'privacy'    => ['accepted'],
        ], [
            'email.unique'       => 'Questa email è già registrata: prova ad accedere, oppure fatti mandare un link.',
            'privacy.accepted'   => 'Per creare l\'account devi accettare l\'informativa privacy.',
            'password.confirmed' => 'Le due password non coincidono.',
        ]);

        $user = User::create([
            'first_name'   => trim($data['first_name']),
            'last_name'    => trim($data['last_name']),
            'birth_date'   => $data['birth_date'] ?? null,
            'name'         => trim($data['first_name'] . ' ' . $data['last_name']),
            'display_name' => trim($data['first_name'] . ' ' . $data['last_name']),
            'email'        => Str::lower($data['email']),
            'password'     => Hash::make($data['password']),
        ]);

        $this->sendVerification($user, $request->ip(), isNew: true);

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return response()->json([
            'ok'      => true,
            'user'    => $this->present($user),
            'message' => 'Account creato. Ti ho mandato un\'email per confermare l\'indirizzo: serve per l\'attestato finale.',
        ], 201);
    }

    /** POST /api/auth/login  { email, password } */
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $key = 'login:' . Str::lower($data['email']) . '|' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 8)) {
            return response()->json([
                'ok'      => false,
                'message' => 'Troppi tentativi. Riprova fra ' . RateLimiter::availableIn($key) . ' secondi.',
            ], 429);
        }

        if (! Auth::attempt(['email' => Str::lower($data['email']), 'password' => $data['password']], true)) {
            RateLimiter::hit($key, 900);

            return response()->json(['ok' => false, 'message' => 'Email o password non corrette.'], 422);
        }

        RateLimiter::clear($key);
        $request->session()->regenerate();
        $request->user()->forceFill(['last_seen_at' => now()])->save();

        return response()->json(['ok' => true, 'user' => $this->present($request->user())]);
    }

    /** POST /api/auth/magic  { email } — accesso senza password / password dimenticata. */
    public function magic(Request $request): JsonResponse
    {
        $data = $request->validate(['email' => ['required', 'email']]);

        $key = 'magic:' . Str::lower($data['email']) . '|' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json([
                'ok'      => false,
                'message' => 'Troppe richieste. Riprova fra ' . RateLimiter::availableIn($key) . ' secondi.',
            ], 429);
        }
        RateLimiter::hit($key, 3600);

        $user = User::firstWhere('email', Str::lower($data['email']));

        // risposta identica anche se l'utente non esiste: non riveliamo chi è iscritto
        if ($user) {
            $this->sendVerification($user, $request->ip(), isNew: false);
        }

        return response()->json([
            'ok'      => true,
            'message' => 'Se quell\'indirizzo è registrato, fra pochi istanti riceverai un link di accesso.',
        ]);
    }

    /** GET /api/auth/verify?token=... — click dall'email. */
    public function verify(Request $request)
    {
        $token = (string) $request->query('token', '');
        $user  = $token ? MagicLink::consume($token) : null;

        if (! $user) {
            return redirect('/?auth=scaduto');
        }

        Auth::login($user, remember: true);
        $request->session()->regenerate();
        $user->forceFill(['last_seen_at' => now()])->save();

        return redirect('/?auth=ok');
    }

    /** POST /api/auth/resend — rimanda l'email di conferma. */
    public function resend(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->email_verified_at) {
            return response()->json(['ok' => true, 'message' => 'La tua email risulta già confermata.']);
        }

        $this->sendVerification($user, $request->ip(), isNew: false);

        return response()->json(['ok' => true, 'message' => 'Email inviata di nuovo a ' . $user->email]);
    }

    /** GET /api/auth/me */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'ok'            => true,
            'authenticated' => (bool) $user,
            'user'          => $user ? $this->present($user) : null,
        ]);
    }

    /** POST /api/auth/profile — correzione dei dati che finiscono sull'attestato. */
    public function updateProfile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'min:2', 'max:60'],
            'last_name'  => ['required', 'string', 'min:2', 'max:60'],
            'birth_date' => ['nullable', 'date', 'before:today'],
        ]);

        $user = $request->user();
        $user->forceFill([
            'first_name'   => trim($data['first_name']),
            'last_name'    => trim($data['last_name']),
            'birth_date'   => $data['birth_date'] ?? $user->birth_date,
            'name'         => trim($data['first_name'] . ' ' . $data['last_name']),
            'display_name' => trim($data['first_name'] . ' ' . $data['last_name']),
        ])->save();

        return response()->json(['ok' => true, 'user' => $this->present($user)]);
    }

    /** POST /api/auth/password */
    public function updatePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current'  => ['required', 'string'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
        ]);

        if (! Hash::check($data['current'], $request->user()->password)) {
            return response()->json(['ok' => false, 'message' => 'La password attuale non è corretta.'], 422);
        }

        $request->user()->forceFill(['password' => Hash::make($data['password'])])->save();

        return response()->json(['ok' => true, 'message' => 'Password aggiornata.']);
    }

    /** POST /api/auth/logout */
    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['ok' => true]);
    }

    /** DELETE /api/auth/me — cancellazione completa (GDPR art. 17). */
    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();
        Auth::logout();
        $user->delete();

        return response()->json(['ok' => true, 'message' => 'Account e dati collegati eliminati.']);
    }

    /* ---------------- interni ---------------- */

    private function sendVerification(User $user, ?string $ip, bool $isNew): void
    {
        $token = MagicLink::issueFor($user, $ip, $isNew ? 'verify' : 'login');
        Mail::to($user->email)->send(new MagicLinkMail($user, url('/api/auth/verify?token=' . $token), $isNew));
    }

    private function present(User $user): array
    {
        return [
            'id'         => $user->id,
            'email'      => $user->email,
            'first_name' => $user->first_name,
            'last_name'  => $user->last_name,
            'name'       => $user->display_name ?: $user->name,
            'birth_date' => $user->birth_date?->format('Y-m-d'),
            'verified'   => (bool) $user->email_verified_at,
        ];
    }
}
