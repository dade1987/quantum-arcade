<?php

namespace Modules\Chat\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Modules\Chat\Agents\QuantumTutor;
use Modules\Chat\Models\ChatMessage;
use Modules\Chat\Models\Conversation;

class ChatController extends Controller
{
    /** POST /api/chat  { message, session_id, level_id? } */
    public function ask(Request $request): JsonResponse
    {
        $data = $request->validate([
            'message'    => ['required', 'string', 'min:2', 'max:' . config('chat.max_chars')],
            'session_id' => ['required', 'string', 'max:64'],
            'level_id'   => ['nullable', 'string', 'max:40'],
        ]);

        $key = 'chat:' . ($request->user()?->id ?? $request->ip());
        if (RateLimiter::tooManyAttempts($key, config('chat.rate_per_hour'))) {
            return response()->json([
                'ok'      => false,
                'message' => 'Hai fatto molte domande di fila: riprova fra ' . RateLimiter::availableIn($key) . ' secondi.',
            ], 429);
        }
        RateLimiter::hit($key, 3600);

        if (! config('chat.anthropic_key')) {
            return response()->json([
                'ok'      => false,
                'message' => 'Il tutor non è ancora configurato su questo server.',
            ], 503);
        }

        $conversation = Conversation::firstOrCreate(
            ['session_id' => $data['session_id']],
            ['user_id' => $request->user()?->id, 'level_id' => $data['level_id'] ?? null],
        );

        $started = microtime(true);

        try {
            $tutor = app()->makeWith(QuantumTutor::class, ['levelContext' => $data['level_id'] ?? null]);
            $answer = $tutor->ask($data['message']);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'ok'      => false,
                'message' => 'Il tutor ha avuto un problema. Riprova fra poco.',
            ], 500);
        }

        $latency = (int) ((microtime(true) - $started) * 1000);
        $sources = $this->extractLinks($answer);

        $messageId = null;

        if (config('chat.store_conversations')) {
            ChatMessage::create([
                'conversation_id' => $conversation->id,
                'role'            => 'user',
                'content'         => $data['message'],
            ]);

            $messageId = ChatMessage::create([
                'conversation_id' => $conversation->id,
                'role'            => 'assistant',
                'content'         => $answer,
                'sources'         => $sources,
                'latency_ms'      => $latency,
            ])->id;
        }

        return response()->json([
            'ok'         => true,
            'answer'     => $answer,
            'sources'    => $sources,
            'message_id' => $messageId,
            'latency_ms' => $latency,
        ]);
    }

    /** POST /api/chat/feedback  { message_id, rating } — il pollice su/giù. */
    public function feedback(Request $request): JsonResponse
    {
        $data = $request->validate([
            'message_id' => ['required', 'integer'],
            'rating'     => ['required', 'integer', 'in:-1,1'],
        ]);

        ChatMessage::where('id', $data['message_id'])
            ->where('role', 'assistant')
            ->update(['rating' => $data['rating']]);

        return response()->json(['ok' => true]);
    }

    /** Estrae i link ai livelli citati, per mostrarli come bottoni sotto la risposta. */
    private function extractLinks(string $answer): array
    {
        preg_match_all('#/lezioni/[\w\-]+\.html#', $answer, $m);

        return array_values(array_unique($m[0] ?? []));
    }
}
