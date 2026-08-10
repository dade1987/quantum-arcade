<?php

namespace Modules\Progress\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlayerState extends Model
{
    protected $fillable = ['user_id', 'xp', 'levels_mastered', 'state', 'synced_at'];

    protected $casts = [
        'state'     => 'array',
        'synced_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Unisce lo stato del browser con quello del server SENZA perdere niente:
     * gli XP sono il massimo, le altre voci sono unioni. Così giocare su due
     * dispositivi non cancella mai i progressi fatti sull'altro.
     */
    public static function mergeState(array $server, array $client): array
    {
        $out = $server ?: [];

        foreach (['lessons', 'missions', 'quiz', 'seen'] as $key) {
            $out[$key] = array_merge($server[$key] ?? [], $client[$key] ?? []);
        }

        // mazzo di ripasso: tiene la scatola più bassa (= la domanda meno consolidata)
        $bank = $server['bank'] ?? [];
        foreach (($client['bank'] ?? []) as $k => $card) {
            if (! isset($bank[$k]) || ($card['box'] ?? 1) < ($bank[$k]['box'] ?? 1)) {
                $bank[$k] = $card;
            }
        }
        $out['bank'] = $bank;
        $out['free'] = ($server['free'] ?? false) || ($client['free'] ?? false);

        return $out;
    }
}
