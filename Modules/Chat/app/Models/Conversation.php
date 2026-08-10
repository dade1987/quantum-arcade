<?php

namespace Modules\Chat\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    protected $fillable = ['user_id', 'session_id', 'level_id'];

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }
}
