<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Accesso senza password: si riceve un link via email, si clicca, si è dentro.
 * La conferma dell'email è implicita nel primo accesso riuscito.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('magic_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('token', 64)->unique();      // hash del token, mai il token in chiaro
            $table->string('purpose', 32)->default('login');
            $table->string('ip', 45)->nullable();
            $table->timestamp('expires_at');
            $table->timestamp('used_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'used_at']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('locale', 8)->default('it')->after('email');
            $table->string('display_name')->nullable()->after('name');   // nome per l'attestato
            $table->boolean('newsletter')->default(false);
            $table->timestamp('last_seen_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('magic_links');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['locale', 'display_name', 'newsletter', 'last_seen_at']);
        });
    }
};
