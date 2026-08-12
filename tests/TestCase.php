<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Ogni richiesta di prova parla italiano, se non chiede altro.
     *
     * Non è una preferenza estetica: Symfony infila «Accept-Language: en-us»
     * in ogni richiesta costruita a mano, quindi senza questa riga il backend
     * risponderebbe in inglese e tutte le asserzioni sui messaggi italiani
     * fallirebbero per il motivo sbagliato — sembrerebbe rotta la funzione,
     * mentre è rotta la premessa.
     *
     * Chi vuole provare un'altra lingua lo dice: vedi inLingua().
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->withHeader('Accept-Language', 'it-IT');
    }

    /** La stessa prova, ma chiesta in un'altra lingua. */
    protected function inLingua(string $lingua): static
    {
        return $this->withHeader('Accept-Language', $lingua);
    }
}
