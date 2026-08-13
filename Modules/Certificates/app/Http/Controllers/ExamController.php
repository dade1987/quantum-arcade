<?php

namespace Modules\Certificates\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Certificates\Models\Certificate;
use Modules\Certificates\Models\ExamAttempt;

/**
 * Esame finale, corretto DAL SERVER.
 *
 * Perché non basta correggerlo nel browser: le risposte giuste sarebbero
 * dentro il codice della pagina, quindi l'attestato non dimostrerebbe niente.
 * Qui il browser riceve solo le domande; le risposte esatte non escono mai dal server.
 */
class ExamController extends Controller
{
    private const PASS = 80;   // percentuale minima

    /** GET /api/exam/questions — domande mescolate, SENZA la soluzione. */
    public function questions(Request $request): JsonResponse
    {
        $bank = collect(config('certificates.questions'))->shuffle()->values();

        return response()->json([
            'ok'        => true,
            'pass'      => self::PASS,
            'total'     => $bank->count(),
            'questions' => $bank->map(function (array $q): array {
                $testo = $this->tradotta($q);

                return ['id' => $q['id'], 'q' => $testo['q'], 'options' => $testo['o']];
            }),
        ]);
    }

    /**
     * La domanda nella lingua di chi la sta leggendo.
     *
     * Le traduzioni viaggiano dentro la domanda (vedi data/exam-bank-sample.js)
     * e non in lang/*.json, per un motivo preciso: l'indice della risposta giusta
     * è uno solo per tutte le lingue, quindi le opzioni tradotte devono restare
     * nello stesso ordine di quelle italiane. Tenerle nello stesso record è ciò
     * che rende visibile — e correggibile — un ordine sbagliato.
     *
     * Se la traduzione manca (per esempio nella banca riservata caricata a mano
     * sul server) si ricade sull'italiano: una domanda in una lingua sola è un
     * fastidio, una domanda corretta con la risposta di un'altra è un esame rotto.
     *
     * @param  array<string, mixed> $q
     * @return array{q: string, o: array<int, string>, w: string}
     */
    private function tradotta(array $q): array
    {
        $lingua = app()->getLocale();
        $t      = is_array($q[$lingua] ?? null) ? $q[$lingua] : [];

        // le opzioni tradotte valgono solo se sono tante quante le originali:
        // altrimenti l'indice della risposta giusta punterebbe altrove
        $opzioni = (is_array($t['o'] ?? null) && count($t['o']) === count($q['o'])) ? $t['o'] : $q['o'];

        return [
            'q' => $t['q'] ?? $q['q'],
            'o' => $opzioni,
            'w' => $t['w'] ?? $q['w'],
        ];
    }

    /** POST /api/exam/submit  { answers: {id: indice}, seconds } */
    public function submit(Request $request): JsonResponse
    {
        $data = $request->validate([
            'answers'         => ['required', 'array', 'min:1'],
            'answers.*'       => ['required', 'integer', 'min:0', 'max:9'],
            'seconds'         => ['nullable', 'integer', 'min:0', 'max:86400'],
        ]);

        $bank    = collect(config('certificates.questions'))->keyBy('id');
        $total   = $bank->count();
        $score   = 0;
        $review  = [];

        foreach ($bank as $id => $q) {
            $given   = $data['answers'][$id] ?? null;
            $correct = $given !== null && (int) $given === (int) $q['c'];
            $score  += $correct ? 1 : 0;
            $testo   = $this->tradotta($q);
            $review[] = [
                'id'      => $id,
                'q'       => $testo['q'],
                'correct' => $testo['o'][$q['c']],
                'yours'   => $given !== null ? ($testo['o'][$given] ?? '—') : '—',
                'ok'      => $correct,
                'why'     => $testo['w'],
            ];
        }

        $percent = (int) round($score / max(1, $total) * 100);
        $passed  = $percent >= self::PASS;

        $attempt = ExamAttempt::create([
            'user_id' => $request->user()->id,
            'score'   => $score,
            'total'   => $total,
            'percent' => $percent,
            'passed'  => $passed,
            'answers' => $data['answers'],
            'seconds' => $data['seconds'] ?? null,
        ]);

        $certificate = null;

        if ($passed) {
            $user = $request->user();
            $name = $user->display_name ?: $user->name;

            // un solo attestato per persona: se ripete l'esame e va meglio, si aggiorna
            $certificate = Certificate::firstOrNew(['user_id' => $user->id]);

            if (! $certificate->exists || $percent > $certificate->percent) {
                $certificate->fill([
                    'code'            => $certificate->code ?: Certificate::makeCode(),
                    'exam_attempt_id' => $attempt->id,
                    'holder_name'     => $name,
                    'percent'         => $percent,
                    'course_version'  => config('certificates.course_version'),
                    'issued_at'       => $certificate->issued_at ?: now(),
                ])->save();
            }
        }

        return response()->json([
            'ok'      => true,
            'score'   => $score,
            'total'   => $total,
            'percent' => $percent,
            'passed'  => $passed,
            'review'  => $review,
            'certificate' => $certificate ? [
                'code' => $certificate->code,
                'url'  => $certificate->verifyUrl(),
                'name' => $certificate->holder_name,
            ] : null,
        ]);
    }
}
