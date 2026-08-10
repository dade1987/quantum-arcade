<?php

use Illuminate\Support\Facades\Route;
use Modules\Progress\Http\Controllers\ProgressController;

Route::post('progress/event', [ProgressController::class, 'event'])->name('progress.event');

Route::middleware('auth')->group(function () {
    Route::get('progress', [ProgressController::class, 'show'])->name('progress.show');
    Route::put('progress', [ProgressController::class, 'sync'])->name('progress.sync');
});
