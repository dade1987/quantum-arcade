<?php

return [
    'name' => 'Chat',

    /*
    |---------------------------------------------------------------------
    | Chi risponde
    |---------------------------------------------------------------------
    | 'deepseek' | 'anthropic' | 'openai'. Cambiare fornitore è una riga nel
    | .env: il resto del tutor (istruzioni, RAG, salvataggi) non cambia.
    */
    'provider' => env('CHAT_PROVIDER', 'deepseek'),

    // Una chiave sola, quella del fornitore scelto. I nomi specifici sono
    // accettati come ripiego per non rompere le installazioni esistenti.
    'key' => env('CHAT_API_KEY')
        ?: env('DEEPSEEK_API_KEY')
        ?: env('ANTHROPIC_API_KEY')
        ?: env('OPENAI_API_KEY'),

    // Vuoto = il modello predefinito del fornitore (vedi QuantumTutor::MODELLI).
    'model' => env('CHAT_MODEL'),

    /*
    |---------------------------------------------------------------------
    | Come si cerca dentro il sito (RAG)
    |---------------------------------------------------------------------
    | 'locale'  → nessuna API, nessun costo, nessuna chiave: i testi diventano
    |             vettori qui dentro. È il default perché DeepSeek NON offre
    |             un'API di embedding, e perché il corpus è piccolo e in una
    |             lingua sola: la ricerca per parole pesate basta e avanza.
    | 'openai' | 'gemini' | 'mistral' | 'voyage' | 'cohere'
    |           → embedding veri, servono chiave e connessione. Migliorano il
    |             recupero quando la domanda usa parole diverse dal testo.
    */
    'embeddings'       => env('CHAT_EMBEDDINGS', 'locale'),
    'embeddings_key'   => env('CHAT_EMBEDDINGS_KEY') ?: env('OPENAI_API_KEY'),
    'embeddings_model' => env('CHAT_EMBEDDINGS_MODEL'),

    // Quanti pezzi di sito vengono passati al modello a ogni domanda.
    'top_k' => (int) env('CHAT_TOP_K', 6),

    // Limiti di cortesia (e di bolletta)
    'rate_per_hour' => (int) env('CHAT_RATE_PER_HOUR', 30),
    'max_chars'     => (int) env('CHAT_MAX_CHARS', 600),

    // Conservazione delle conversazioni per migliorare il corso.
    // Va dichiarata nell'informativa privacy: vedi /privacy.html
    'store_conversations' => (bool) env('CHAT_STORE_CONVERSATIONS', true),
    'retention_days'      => (int) env('CHAT_RETENTION_DAYS', 180),
];
