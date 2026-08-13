<?php

namespace Modules\Certificates\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Support\Site;
use Illuminate\Routing\Controller;
use Modules\Certificates\Models\Certificate;

class CertificateController extends Controller
{
    /**
     * GET /verifica/{code} — pagina pubblica: chiunque può controllare un attestato.
     *
     * È l'unica pagina del sito che arriva a gente che non ci è mai passata: la si
     * riceve su LinkedIn o allegata a un CV. Quindi ha il suo cambio-lingua, e i
     * link al corso puntano alla copia del sito nella lingua in cui la si sta
     * leggendo, non alla radice italiana.
     */
    public function show(string $code)
    {
        $certificate = Certificate::with('attempt')->where('code', strtoupper($code))->first();

        return response()->view('certificates::verify', [
            'certificate' => $certificate,
            'code'        => strtoupper($code),
            'home'        => $this->home(app()->getLocale()),
            'lingue'      => Site::localeNames(),
        ], $certificate ? 200 : 404);
    }

    /** La radice del sito nella lingua indicata: '/', '/en/', '/es/'. */
    private function home(string $lingua): string
    {
        return $lingua === 'it' ? '/' : '/' . $lingua . '/';
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

        abort_if(! $c->isValid(), 410, __('Attestato revocato.'));

        $pdf = Pdf::loadView('certificates::pdf', [
            'c'         => $c,
            'user'      => $c->user,
            'attempt'   => $c->attempt,
            'verifyUrl' => $c->verifyUrl(),
        ])->setPaper('a4', 'landscape');

        $name = __('Attestato') . '-QuantumArcade-' . str_replace(' ', '-', $c->holder_name) . '.pdf';

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
            'name'     => 'Quantum Arcade — ' . __('Attestato di completamento del corso'),
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
                    'name'        => __('Informatica quantistica giocando') . ' — ' . __('percorso completo'),
                    'description' => __('Ha completato i :livelli livelli del corso, dalle basi matematiche alla trasformata di Fourier quantistica e all\'algoritmo di Shor, superando l\'esame finale con il :percento%.', ['livelli' => config('certificates.levels_count'), 'percento' => $c->percent]),
                    'criteria'    => ['narrative' => __('Superamento dell\'esame finale a risposta multipla con almeno l\'80% di risposte corrette, corretto lato server.')],
                ],
            ],
            'evidence' => [[
                'id'          => $c->verifyUrl(),
                'name'        => __('Verifica pubblica'),
                'description' => __('Attestato di completamento rilasciato dall\'autore del corso. Non costituisce una certificazione accreditata da un ente terzo.'),
            ]],
            'revoked' => ! $c->isValid(),
        ], 200, [], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
}
