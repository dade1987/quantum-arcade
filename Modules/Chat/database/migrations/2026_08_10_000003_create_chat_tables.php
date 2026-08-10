<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('session_id', 64)->index();     // per chi non ha un account
            $table->string('level_id', 40)->nullable();    // da quale livello è partita la domanda
            $table->timestamps();
        });

        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->cascadeOnDelete();
            $table->string('role', 12);                    // user | assistant
            $table->text('content');
            $table->json('sources')->nullable();           // livelli usati per rispondere
            $table->tinyInteger('rating')->nullable();     // 1 = utile, -1 = non utile
            $table->unsignedInteger('latency_ms')->nullable();
            $table->timestamps();
            $table->index(['role', 'rating']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
        Schema::dropIfExists('conversations');
    }
};
