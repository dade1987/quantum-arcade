<?php

namespace Modules\Certificates\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamAttempt extends Model
{
    protected $fillable = ['user_id', 'score', 'total', 'percent', 'passed', 'answers', 'seconds'];

    protected $casts = ['answers' => 'array', 'passed' => 'boolean'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
