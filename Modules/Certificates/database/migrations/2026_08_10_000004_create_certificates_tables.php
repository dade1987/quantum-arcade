<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('score');
            $table->unsignedTinyInteger('total');
            $table->unsignedTinyInteger('percent');
            $table->boolean('passed')->default(false);
            $table->json('answers');            // per la correzione e per capire quali domande sbagliano tutti
            $table->unsignedInteger('seconds')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'passed']);
        });

        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('code', 16)->unique();          // QA-XXXXXXX, stampato sull'attestato
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exam_attempt_id')->constrained('exam_attempts')->cascadeOnDelete();
            $table->string('holder_name');                 // congelato: se poi cambia nome, l'attestato resta com'era
            $table->unsignedTinyInteger('percent');
            $table->string('course_version', 16)->default('1.0');
            $table->timestamp('issued_at');
            $table->timestamp('revoked_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('exam_attempts');
    }
};
