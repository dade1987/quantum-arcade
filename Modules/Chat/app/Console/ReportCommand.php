<?php

namespace Modules\Chat\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * "Dove il corso non è chiaro?" — questo comando risponde con i dati veri.
 *
 *   php artisan chat:report
 *
 * Le domande più frequenti e le risposte bocciate sono la lista delle cose
 * da riscrivere nei livelli: è il ciclo di miglioramento continuo del gioco.
 */
class ReportCommand extends Command
{
    protected $signature = 'chat:report {--days=30}';

    protected $description = 'Cosa chiedono i giocatori al tutor, e dove il corso non funziona';

    public function handle(): int
    {
        $since = now()->subDays((int) $this->option('days'));

        $this->info("Ultimi {$this->option('days')} giorni");

        $this->newLine();
        $this->line('<comment>Livelli da cui partono più domande</comment>');
        $rows = DB::table('conversations')
            ->select('level_id', DB::raw('count(*) as n'))
            ->where('created_at', '>=', $since)
            ->whereNotNull('level_id')
            ->groupBy('level_id')->orderByDesc('n')->limit(15)->get();
        $this->table(['livello', 'domande'], $rows->map(fn ($r) => [$r->level_id, $r->n])->toArray());

        $this->newLine();
        $this->line('<comment>Risposte bocciate dagli utenti (👎) — da controllare a mano</comment>');
        $bad = DB::table('chat_messages')
            ->where('rating', -1)->where('created_at', '>=', $since)
            ->orderByDesc('created_at')->limit(20)->get(['id', 'content']);
        foreach ($bad as $m) {
            $this->line("  #{$m->id} " . Str::limit(str_replace("\n", ' ', $m->content), 120));
        }
        if ($bad->isEmpty()) {
            $this->line('  nessuna, per ora.');
        }

        $this->newLine();
        $stats = DB::table('chat_messages')->where('role', 'assistant')->where('created_at', '>=', $since)
            ->selectRaw('count(*) n, avg(latency_ms) lat, sum(case when rating=1 then 1 else 0 end) up, sum(case when rating=-1 then 1 else 0 end) down')
            ->first();
        $this->line(sprintf(
            'Totale risposte: %d · tempo medio %d ms · 👍 %d · 👎 %d',
            $stats->n ?? 0, (int) ($stats->lat ?? 0), $stats->up ?? 0, $stats->down ?? 0
        ));

        return self::SUCCESS;
    }
}
