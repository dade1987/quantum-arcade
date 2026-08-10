<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Dati anagrafici minimi indispensabili per un attestato serio:
 * nome e cognome (chi lo ha ottenuto) e data di nascita (per distinguere
 * gli omonimi, che su un attestato verificabile non sono un dettaglio).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name', 60)->nullable()->after('name');
            $table->string('last_name', 60)->nullable()->after('first_name');
            $table->date('birth_date')->nullable()->after('last_name');
            $table->string('country', 2)->default('IT')->after('birth_date');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['first_name', 'last_name', 'birth_date', 'country']);
        });
    }
};
