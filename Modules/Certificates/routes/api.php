<?php

use Illuminate\Support\Facades\Route;
use Modules\Certificates\Http\Controllers\CertificateController;
use Modules\Certificates\Http\Controllers\ExamController;

Route::middleware('auth')->group(function () {
    Route::get('exam/questions', [ExamController::class, 'questions'])->name('exam.questions');
    Route::post('exam/submit',   [ExamController::class, 'submit'])->name('exam.submit');
});

Route::get('badge/{code}.json', [CertificateController::class, 'badge'])->name('certificates.badge');
