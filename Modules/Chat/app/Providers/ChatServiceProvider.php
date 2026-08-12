<?php

namespace Modules\Chat\Providers;

use Nwidart\Modules\Support\ModuleServiceProvider;
use Illuminate\Console\Scheduling\Schedule;

class ChatServiceProvider extends ModuleServiceProvider
{
    /**
     * The name of the module.
     */
    protected string $name = 'Chat';

    /**
     * The lowercase version of the module name.
     */
    protected string $nameLower = 'chat';

    /**
     * Command classes to register.
     *
     * @var string[]
     */
    protected array $commands = [
        \Modules\Chat\Console\IngestSiteCommand::class,
        \Modules\Chat\Console\ReportCommand::class,
    ];

    /**
     * Provider classes to register.
     *
     * @var string[]
     */
    protected array $providers = [
        EventServiceProvider::class,
        RouteServiceProvider::class,
    ];

    public function register(): void
    {
        parent::register();

        $this->tracciamentoSenzaProcOpen();
    }

    /**
     * Neuron AI manda le sue tracce a Inspector, e lo fa in un processo separato
     * (proc_open) per non rallentare la risposta. Sugli hosting condivisi
     * proc_open è quasi sempre disattivato: il trasporto asincrono non si riesce
     * nemmeno a costruire e la prima domanda al tutor muore con
     * "PHP function 'proc_open' is not available" — anche a chi Inspector non lo
     * usa affatto, perché l'osservatore predefinito viene creato comunque.
     *
     * Qui diciamo a Inspector di usare il trasporto "sync" (cURL, che c'è
     * sempre). Senza INSPECTOR_INGESTION_KEY non parte nessuna richiesta: la
     * libreria raccoglie e spedisce solo se una chiave c'è. Dove proc_open
     * esiste non tocchiamo niente, così il tracciamento resta asincrono.
     *
     * La configurazione si legge da $_ENV: è l'unica fonte che
     * InspectorObserver::instance() guarda, quindi env() o config() non
     * basterebbero.
     */
    private function tracciamentoSenzaProcOpen(): void
    {
        if (function_exists('proc_open')) {
            return;
        }

        $_ENV['INSPECTOR_TRANSPORT'] = 'sync';
    }

    /**
     * Define module schedules.
     * 
     * @param $schedule
     */
    // protected function configureSchedules(Schedule $schedule): void
    // {
    //     $schedule->command('inspire')->hourly();
    // }
}
