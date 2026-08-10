<?php

namespace Modules\Accounts\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Un link di accesso monouso.
 *
 * Nel database salviamo SOLO l'hash del token: se qualcuno leggesse la tabella
 * non potrebbe comunque entrare negli account. È lo stesso principio con cui si
 * salvano le password.
 */
class MagicLink extends Model
{
    protected $fillable = ['user_id', 'token', 'purpose', 'ip', 'expires_at', 'used_at'];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at'    => 'datetime',
    ];

    public const TTL_MINUTES = 20;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Crea un link e restituisce il token IN CHIARO (da mettere nell'email, e mai altrove). */
    public static function issueFor(User $user, ?string $ip = null, string $purpose = 'login'): string
    {
        // invalida i link precedenti ancora aperti: uno alla volta
        static::where('user_id', $user->id)->whereNull('used_at')->update(['used_at' => now()]);

        $plain = Str::random(48);

        static::create([
            'user_id'    => $user->id,
            'token'      => hash('sha256', $plain),
            'purpose'    => $purpose,
            'ip'         => $ip,
            'expires_at' => now()->addMinutes(self::TTL_MINUTES),
        ]);

        return $plain;
    }

    /** Consuma un token: ritorna l'utente se valido, altrimenti null. */
    public static function consume(string $plain): ?User
    {
        $link = static::with('user')
            ->where('token', hash('sha256', $plain))
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->first();

        if (! $link) {
            return null;
        }

        $link->update(['used_at' => now()]);

        // primo accesso riuscito = email confermata
        if (! $link->user->email_verified_at) {
            $link->user->forceFill(['email_verified_at' => now()])->save();
        }

        return $link->user;
    }

    public function isValid(): bool
    {
        return is_null($this->used_at) && $this->expires_at->isFuture();
    }
}
