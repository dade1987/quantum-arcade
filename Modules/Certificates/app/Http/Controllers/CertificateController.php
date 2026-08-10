<?php

namespace Modules\Certificates\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Certificates\Models\Certificate;

class CertificateController extends Controller
{
    /** GET /verifica/{code} — pagina pubblica: chiunque può controllare un attestato. */
    public function show(string $code)
    {
        $certificate = Certificate::with('attempt')->where('code', strtoupper($code))->first();

        return response()->view('certificates::verify', [
            'certificate' => $certificate,
            'code'        => strtoupper($code),
        ], $certificate ? 200 : 404);
    }

    /**
     * GET /attestato/{code}.pdf — l'attestato da stampare o allegare al CV.
     *
     * Il PDF è generato dal server a partire dai dati salvati: non è una schermata
     * catturata dal browser, quindi non può essere alterato da chi lo scarica.
     */
    public function pdf(string $code, Request $request)
    {
        $c = Certificate::with(['user', 'attempt'])->where('code', strtoupper($code))->firstOrFail();

        abort_if(! $c->isValid(), 410, 'Attestato revocato.');

        $pdf = Pdf::loadView('certificates::pdf', [
            'c'         => $c,
            'user'      => $c->user,
            'attempt'   => $c->attempt,
            'verifyUrl' => $c->verifyUrl(),
        ])->setPaper('a4', 'landscape');

        $name = 'Attestato-QuantumArcade-' . str_replace(' ', '-', $c->holder_name) . '.pdf';

        return $request->boolean('inline')
            ? $pdf->stream($name)
            : $pdf->download($name);
    }

    /**
     * GET /api/badge/{code}.json — l'attestato in formato Open Badge (1EdTech).
     * Serve a renderlo leggibile da LinkedIn e dai portafogli di credenziali.
     */
    public function badge(string $code): JsonResponse
    {
        $c = Certificate::where('code', strtoupper($code))->firstOrFail();

        return response()->json([
            '@context' => 'https://www.w3.org/ns/credentials/v2',
            'id'       => $c->verifyUrl(),
            'type'     => ['VerifiableCredential', 'OpenBadgeCredential'],
            'name'     => 'Quantum Arcade — Attestato di completamento',
            'issuer'   => [
                'id'   => url('/'),
                'type' => ['Profile'],
                'name' => 'Quantum Arcade · Davide Cavallini',
                'url'  => url('/'),
            ],
            'validFrom'         => $c->issued_at->toIso8601String(),
            'credentialSubject' => [
                'type'         => ['AchievementSubject'],
                'identifier'   => $c->code,
                'name'         => $c->holder_name,
                'achievement'  => [
                    'id'          => url('/#course'),
                    'type'        => ['Achievement'],
                    'name'        => 'Informatica quantistica giocando — percorso completo',
                    'description' => 'Ha completato i 27 livelli del corso, dalle basi matematiche alla trasformata di Fourier quantistica e all\'algoritmo di Shor, superando l\'esame finale con il ' . $c->percent . '%.',
                    'criteria'    => ['narrative' => 'Superamento dell\'esame finale a risposta multipla con almeno l\'80% di risposte corrette, corretto lato server.'],
                ],
            ],
            'evidence' => [[
                'id'          => $c->verifyUrl(),
                'name'        => 'Pagina di verifica pubblica',
                'description' => 'Attestato di completamento rilasciato dall\'autore del corso. Non è una certificazione accreditata da un ente terzo.',
            ]],
            'revoked' => ! $c->isValid(),
        ], 200, [], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
}
