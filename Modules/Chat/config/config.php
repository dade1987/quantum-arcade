<?php

return [
    'name' => 'Chat',

    // Modello che risponde
    'anthropic_key'    => env('ANTHROPIC_API_KEY'),
    'model'            => env('CHAT_MODEL', 'claude-sonnet-4-6'),

    // Modello che trasforma i testi in vettori per la ricerca
    'embeddings_key'   => env('OPENAI_API_KEY'),
    'embeddings_model' => env('CHAT_EMBEDDINGS_MODEL', 'text-embedding-3-small'),

    // Limiti di cortesia (e di bolletta)
    'rate_per_hour'    => (int) env('CHAT_RATE_PER_HOUR', 30),
    'max_chars'        => (int) env('CHAT_MAX_CHARS', 600),

    // Conservazione delle conversazioni per migliorare il corso.
    // Va dichiarata nell'informativa privacy: vedi /privacy.html
    'store_conversations' => (bool) env('CHAT_STORE_CONVERSATIONS', true),
    'retention_days'      => (int) env('CHAT_RETENTION_DAYS', 180),
];
