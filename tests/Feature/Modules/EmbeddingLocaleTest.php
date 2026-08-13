<?php

namespace Tests\Feature\Modules;

use Modules\Chat\Embeddings\EmbeddingLocale;
use NeuronAI\RAG\Document;
use Tests\TestCase;

/**
 * Gli embedding calcolati in casa, che permettono al tutor di funzionare con
 * la sola chiave del modello (DeepSeek non offre embedding).
 *
 * Qui non si collauda "il codice gira", ma la proprietà che conta davvero:
 * DUE TESTI CHE PARLANO DELLA STESSA COSA DEVONO SOMIGLIARSI PIÙ di due testi
 * che parlano di cose diverse. Se questa proprietà cade, il tutor recupera i
 * pezzi sbagliati e risponde male: è il test che protegge la qualità delle
 * risposte, non la sintassi.
 */
class EmbeddingLocaleTest extends TestCase
{
    private EmbeddingLocale $emb;

    protected function setUp(): void
    {
        parent::setUp();
        $this->emb = new EmbeddingLocale();
    }

    /** Coseno fra due vettori già normalizzati = prodotto scalare. */
    private function somiglianza(string $a, string $b): float
    {
        $va = $this->emb->embedText($a);
        $vb = $this->emb->embedText($b);

        return array_sum(array_map(fn (float $x, float $y): float => $x * $y, $va, $vb));
    }

    public function test_il_vettore_ha_la_dimensione_dichiarata_ed_e_normalizzato(): void
    {
        $v = $this->emb->embedText('Il qubit è una coppia di ampiezze che possono essere negative.');

        $this->assertCount(EmbeddingLocale::DIMENSIONI, $v);

        $norma = sqrt(array_sum(array_map(fn (float $x): float => $x * $x, $v)));
        $this->assertEqualsWithDelta(1.0, $norma, 1e-9, 'i vettori vanno normalizzati, sennò i testi lunghi vincono sempre');
    }

    public function test_lo_stesso_testo_da_sempre_lo_stesso_vettore(): void
    {
        $a = $this->emb->embedText('trasformata di Fourier quantistica');
        $b = $this->emb->embedText('trasformata di Fourier quantistica');

        $this->assertSame($a, $b, 'senza determinismo l\'indice andrebbe ricalcolato a ogni avvio');
    }

    public function test_maiuscole_e_punteggiatura_non_cambiano_il_significato(): void
    {
        $this->assertEqualsWithDelta(
            1.0,
            $this->somiglianza('La MISURA, del qubit!', 'la misura del qubit'),
            0.01,
            'le stesse parole scritte diversamente devono dare lo stesso vettore',
        );
    }

    public function test_due_testi_sullo_stesso_argomento_si_somigliano_piu_di_due_scollegati(): void
    {
        $vicini = $this->somiglianza(
            'La misura fa collassare il qubit su 0 oppure su 1, in modo casuale.',
            'Quando misuri il qubit collassa: esce 0 o esce 1, con una probabilità.',
        );
        $lontani = $this->somiglianza(
            'La misura fa collassare il qubit su 0 oppure su 1, in modo casuale.',
            'La trasformata di Fourier scompone un segnale nelle sue frequenze.',
        );

        // Conta il RAPPORTO, non il valore assoluto: il recupero sceglie i
        // pezzi più vicini, quindi basta che i pertinenti stacchino gli altri.
        $this->assertGreaterThan($lontani * 2.5, $vicini, 'è la proprietà su cui si regge tutto il recupero');
        $this->assertGreaterThan(0.2, $vicini, 'due frasi sullo stesso concetto devono somigliarsi davvero');
    }

    public function test_le_parole_derivate_si_riconoscono(): void
    {
        // "misura" e "misurazione" condividono il prefisso: senza questo
        // accorgimento sarebbero due parole totalmente estranee
        $this->assertGreaterThan(
            0.4,
            $this->somiglianza('la misurazione del qubit', 'la misura del qubit'),
        );
    }

    public function test_le_coppie_di_parole_distinguono_i_concetti_composti(): void
    {
        // "trasformata di Fourier" non è "una trasformata" più "un Fourier":
        // la coppia consecutiva ha un peso suo
        $conCoppia  = $this->somiglianza('trasformata di Fourier discreta', 'la trasformata di Fourier');
        $senzaCoppia = $this->somiglianza('trasformata di Fourier discreta', 'una trasformata qualunque');

        $this->assertGreaterThan($senzaCoppia, $conCoppia);
    }

    public function test_un_testo_vuoto_non_rompe_niente(): void
    {
        foreach (['', '   ', '... !!! ???', 'di che il e a'] as $niente) {
            $v = $this->emb->embedText($niente);

            $this->assertCount(EmbeddingLocale::DIMENSIONI, $v);
            $this->assertSame(0.0, array_sum($v), "«{$niente}» deve dare il vettore nullo, non un errore");
        }
    }

    public function test_indicizza_un_documento_e_una_lista(): void
    {
        $doc = new Document('Il diffusore di Grover riflette le ampiezze attorno alla media.');
        $this->assertCount(EmbeddingLocale::DIMENSIONI, $this->emb->embedDocument($doc)->embedding);

        $lista = $this->emb->embedDocuments([
            new Document('primo pezzo di sito'),
            new Document('secondo pezzo di sito'),
        ]);
        $this->assertCount(2, $lista);
        $this->assertCount(EmbeddingLocale::DIMENSIONI, $lista[1]->embedding);
    }

    public function test_e_abbastanza_veloce_da_indicizzare_tutto_il_sito(): void
    {
        $testo = str_repeat('Il qubit vive sulla sfera di Bloch e la fase decide l\'interferenza. ', 40);

        $t0 = microtime(true);
        for ($i = 0; $i < 200; $i++) {
            $this->emb->embedText($testo);
        }
        $secondi = microtime(true) - $t0;

        $this->assertLessThan(10, $secondi, '200 pezzi devono richiedere secondi, non minuti');
    }
}
