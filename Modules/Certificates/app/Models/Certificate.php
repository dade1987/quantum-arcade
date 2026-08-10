<?php

namespace Modules\Certificates\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Certificate extends Model
{
    protected $fillable = [
        'code', 'user_id', 'exam_attempt_id', 'holder_name',
        'percent', 'course_version', 'issued_at', 'revoked_at',
    ];

    protected $casts = [
        'issued_at'  => 'datetime',
        'revoked_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(ExamAttempt::class, 'exam_attempt_id');
    }

    /**
     * Codice leggibile e non indovinabile: QA- più 7 caratteri.
     * Vengono escluse le lettere e le cifre che si confondono quando qualcuno
     * legge il codice da un foglio stampato: 0/O, 1/I/L.
     */
    public static function makeCode(): string
    {
        $alfabeto = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';   // niente 0 O 1 I L

        do {
            $code = 'QA-';
            for ($i = 0; $i < 7; $i++) {
                $code .= $alfabeto[random_int(0, strlen($alfabeto) - 1)];
            }
        } while (static::where('code', $code)->exists());

        return $code;
    }

    public function isValid(): bool
    {
        return is_null($this->revoked_at);
    }

    public function verifyUrl(): string
    {
        return url('/verifica/' . $this->code);
    }
}
