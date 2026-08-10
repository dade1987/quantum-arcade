<?php

namespace Modules\Chat\Embeddings;

use NeuronAI\RAG\Embeddings\AbstractEmbeddingsProvider;

/**
 * Embedding calcolati in casa, senza chiamare nessuna API.
 *
 * PERCHÉ ESISTE
 * DeepSeek offre solo il modello che risponde: non ha un'API di embedding.
 * Senza embedding il RAG non può cercare, e il tutor non saprebbe da quale
 * pezzo di sito rispondere. Le alternative erano chiedere una seconda chiave
 * a un secondo fornitore (OpenAI, Gemini, Mistral…) oppure calcolarseli da
 * soli: qui si fa la seconda, e la prima resta disponibile con una riga di
 * .env (CHAT_EMBEDDINGS=openai).
 *
 * COME FUNZIONA
 * È un "sacco di parole con hash" (feature hashing), la tecnica classica
 * pre-reti neurali per trasformare testo in vettori:
 *
 *   1. il testo viene spezzato in parole e messo in minuscolo;
 *   2. si buttano via le parole vuote italiane (di, che, per, come…), che
 *      compaiono ovunque e non distinguono niente;
 *   3. ogni parola finisce in una delle DIMENSIONI caselle del vettore,
 *      scelta con un hash. Anche le coppie di parole consecutive ("trasformata
 *      fourier") hanno la loro casella: è ciò che distingue "trasformata di
 *      Fourier" da due parole capitate vicine per caso;
 *   4. ogni parola conta anche con il suo prefisso, così "misura", "misurare"
 *      e "misurazione" si somigliano invece di essere estranee — è uno
 *      stemming povero ma sufficiente per l'italiano;
 *   5. il peso cresce col logaritmo delle ripetizioni (una parola detta dieci
 *      volte conta più di una detta una volta, ma non dieci volte tanto);
 *   6. alla fine il vettore viene normalizzato, così il coseno fra due vettori
 *      misura quanto due testi condividono vocabolario.
 *
 * LIMITE, DETTO CHIARO
 * Non capisce i sinonimi: se la domanda usa parole che nel sito non compaiono,
 * recupera peggio di un embedding neurale. Sul corpus di Quantum Arcade —
 * poche centinaia di pezzi, una lingua sola, vocabolario tecnico molto
 * caratterizzato ("ampiezza", "diffusore", "periodo") — è un compromesso
 * ottimo: costo zero, nessuna chiave, nessuna latenza, e funziona offline.
 */
class EmbeddingLocale extends AbstractEmbeddingsProvider
{
    /** Numero di caselle del vettore. Poche = più collisioni, tante = file più grandi. */
    public const DIMENSIONI = 512;

    /**
     * Lunghezza del prefisso usato come radice approssimata della parola, e
     * quanto pesano prefissi e coppie rispetto alla parola intera (che vale 1).
     * I valori non sono a caso: sono quelli che, misurati sulle frasi del
     * corso, separano meglio "stesso concetto detto in altre parole" da
     * "argomento diverso" (vedi EmbeddingLocaleTest).
     */
    private const PREFISSO      = 4;
    private const PESO_PREFISSO = 0.7;
    private const PESO_COPPIA   = 0.4;

    /**
     * Parole vuote italiane: compaiono in ogni pagina, quindi non aiutano a
     * distinguerle. Tenerle dentro peggiorerebbe la ricerca, non la migliorerebbe.
     */
    private const PAROLE_VUOTE = [
        'a', 'ad', 'al', 'alla', 'alle', 'allo', 'agli', 'ai', 'anche', 'ancora',
        'c', 'che', 'chi', 'ci', 'co', 'col', 'come', 'con', 'cosa', 'cui',
        'da', 'dal', 'dalla', 'dei', 'del', 'della', 'delle', 'dello', 'degli',
        'di', 'dove', 'due', 'e', 'ed', 'ecco', 'era', 'essere', 'fa', 'fare',
        'gli', 'ha', 'hai', 'hanno', 'ho', 'i', 'il', 'in', 'io', 'la', 'le',
        'lo', 'ma', 'me', 'mi', 'ne', 'nei', 'nel', 'nella', 'nelle', 'no',
        'noi', 'non', 'o', 'od', 'ogni', 'oppure', 'per', 'perche', 'perché',
        'piu', 'più', 'po', 'poi', 'qua', 'quale', 'quando', 'quanto', 'quel',
        'quella', 'quelle', 'quello', 'questa', 'queste', 'questi', 'questo',
        'qui', 'sarà', 'se', 'sei', 'senza', 'si', 'sia', 'sono', 'su', 'sul',
        'sulla', 'sulle', 'suo', 'sua', 'ti', 'tra', 'tu', 'tuo', 'tutti',
        'tutto', 'un', 'una', 'uno', 'va', 'vi', 'è',
    ];

    /**
     * @return float[]
     */
    public function embedText(string $text): array
    {
        $vettore = array_fill(0, self::DIMENSIONI, 0.0);
        $parole  = $this->parole($text);

        // conteggio di parole singole, prefissi e coppie consecutive
        $conteggi = [];
        $precedente = null;

        foreach ($parole as $parola) {
            $this->conta($conteggi, $parola, 1.0);

            if (mb_strlen($parola) > self::PREFISSO) {
                $this->conta($conteggi, '~' . mb_substr($parola, 0, self::PREFISSO), self::PESO_PREFISSO);
            }
            if ($precedente !== null) {
                $this->conta($conteggi, $precedente . '_' . $parola, self::PESO_COPPIA);
            }

            $precedente = $parola;
        }

        foreach ($conteggi as $chiave => [$occorrenze, $peso]) {
            // Il peso dice quanto conta quel TIPO di indizio (parola intera,
            // radice, coppia); il logaritmo smorza le RIPETIZIONI: una parola
            // detta dieci volte conta più di una detta una volta, ma non dieci
            // volte tanto. Tenere le due cose separate evita di prendere il
            // logaritmo di un peso frazionario, che sarebbe negativo.
            $vettore[$this->casella((string) $chiave)] += $peso * (1 + log($occorrenze));
        }

        return $this->normalizza($vettore);
    }

    /**
     * Spezza il testo in parole utili: minuscole, senza punteggiatura,
     * senza parole vuote e senza monosillabi che non dicono niente.
     *
     * @return string[]
     */
    private function parole(string $text): array
    {
        $pezzi = preg_split('/[^\p{L}\p{N}]+/u', mb_strtolower($text), -1, PREG_SPLIT_NO_EMPTY) ?: [];

        return array_values(array_filter(
            $pezzi,
            fn (string $p): bool => mb_strlen($p) > 1 && ! in_array($p, self::PAROLE_VUOTE, true),
        ));
    }

    /**
     * Registra un indizio: quante volte è comparso e quanto pesa il suo tipo.
     *
     * @param array<string, array{int, float}> $conteggi
     */
    private function conta(array &$conteggi, string $chiave, float $peso): void
    {
        $conteggi[$chiave] = [($conteggi[$chiave][0] ?? 0) + 1, $peso];
    }

    /** In quale casella del vettore finisce questa chiave. */
    private function casella(string $chiave): int
    {
        return (int) (crc32($chiave) % self::DIMENSIONI);
    }

    /**
     * Porta il vettore a lunghezza 1: così il prodotto scalare fra due vettori
     * È il coseno dell'angolo, cioè la somiglianza, e i testi lunghi non
     * vincono solo perché sono lunghi.
     *
     * @param  float[] $vettore
     * @return float[]
     */
    private function normalizza(array $vettore): array
    {
        $norma = sqrt(array_sum(array_map(fn (float $v): float => $v * $v, $vettore)));

        if ($norma <= 0.0) {
            return $vettore;   // testo vuoto o fatto di sole parole vuote
        }

        return array_map(fn (float $v): float => $v / $norma, $vettore);
    }
}
