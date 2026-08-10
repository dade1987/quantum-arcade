<?php

use Illuminate\Support\Facades\Route;
use Modules\Accounts\Http\Controllers\AuthController;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('login',    [AuthController::class, 'login'])->name('auth.login');
    Route::post('magic',    [AuthController::class, 'magic'])->name('auth.magic');
    Route::get('verify',    [AuthController::class, 'verify'])->name('auth.verify');
    Route::get('me',        [AuthController::class, 'me'])->name('auth.me');

    Route::middleware('auth')->group(function () {
        Route::post('resend',   [AuthController::class, 'resend'])->name('auth.resend');
        Route::post('profile',  [AuthController::class, 'updateProfile'])->name('auth.profile');
        Route::post('password', [AuthController::class, 'updatePassword'])->name('auth.password');
        Route::post('logout',   [AuthController::class, 'logout'])->name('auth.logout');
        Route::delete('me',     [AuthController::class, 'destroy'])->name('auth.destroy');
    });
});
