<?php

use Illuminate\Support\Facades\Route;
use Modules\Chat\Http\Controllers\ChatController;

Route::post('chat',          [ChatController::class, 'ask'])->name('chat.ask');
Route::post('chat/feedback', [ChatController::class, 'feedback'])->name('chat.feedback');
