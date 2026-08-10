<?php

use Illuminate\Support\Facades\Route;
use Modules\Certificates\Http\Controllers\CertificateController;

Route::get('/verifica/{code}', [CertificateController::class, 'show'])
    ->where('code', '[A-Za-z0-9\-]{4,16}')
    ->name('certificates.verify');

Route::get('/attestato/{code}.pdf', [CertificateController::class, 'pdf'])
    ->where('code', '[A-Za-z0-9\-]{4,16}')
    ->name('certificates.pdf');
