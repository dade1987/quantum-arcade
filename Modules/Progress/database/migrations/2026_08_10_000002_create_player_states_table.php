<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Stato del giocatore: una riga per utente. Il dettaglio (missioni, quiz,
        // mazzo di ripasso) sta in JSON perché cambia insieme al gioco.
        Schema::create('player_states', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->unsignedInteger('xp')->default(0);
            $table->unsignedSmallInteger('levels_mastered')->default(0);
            $table->json('state');                       // {lessons, missions, quiz, seen, bank}
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });

        // Storico per capire dove i giocatori si bloccano (dato aggregato, non personale)
        Schema::create('level_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('level_id', 40);
            $table->string('event', 24);                 // 'entered' | 'mission' | 'mastered'
            $table->timestamps();
            $table->index(['level_id', 'event']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('level_events');
        Schema::dropIfExists('player_states');
    }
};
