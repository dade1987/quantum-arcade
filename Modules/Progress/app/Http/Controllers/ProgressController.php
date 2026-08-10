<?php

namespace Modules\Progress\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Progress\Models\PlayerState;

class ProgressController extends Controller
{
    /** GET /api/progress — lo stato salvato sul server. */
    public function show(Request $request): JsonResponse
    {
        $state = PlayerState::firstWhere('user_id', $request->user()->id);

        return response()->json([
            'ok'    => true,
            'xp'    => $state?->xp ?? 0,
            'state' => $state?->state ?? new \stdClass,
        ]);
    }

    /** PUT /api/progress — il browser manda il suo stato, il server unisce e restituisce il risultato. */
    public function sync(Request $request): JsonResponse
    {
        $data = $request->validate([
            'xp'    => ['required', 'integer', 'min:0', 'max:100000'],
            // 'present' e non 'required': uno stato VUOTO è legittimo (giocatore
            // appena iscritto) e deve poter essere salvato lo stesso.
            'state' => ['present', 'array'],
        ]);

        $user  = $request->user();
        $row   = PlayerState::firstOrNew(['user_id' => $user->id]);
        $merged = PlayerState::mergeState($row->state ?? [], $data['state']);

        $row->fill([
            'xp'              => max($row->xp ?? 0, $data['xp']),
            'levels_mastered' => count(array_filter($merged['lessons'] ?? [], fn ($l) => ! empty($l['mastered']))),
            'state'           => $merged,
            'synced_at'       => now(),
        ])->save();

        return response()->json([
            'ok'    => true,
            'xp'    => $row->xp,
            'state' => $row->state,
        ]);
    }

    /** POST /api/progress/event  { level_id, event } — statistiche anonime sull'uso. */
    public function event(Request $request): JsonResponse
    {
        $data = $request->validate([
            'level_id' => ['required', 'string', 'max:40'],
            'event'    => ['required', 'in:entered,mission,mastered'],
        ]);

        \DB::table('level_events')->insert([
            'user_id'    => $request->user()?->id,
            'level_id'   => $data['level_id'],
            'event'      => $data['event'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['ok' => true]);
    }
}
