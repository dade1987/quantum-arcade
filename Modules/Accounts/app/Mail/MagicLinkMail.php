<?php

namespace Modules\Accounts\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MagicLinkMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $url,
        public bool $isNew = false,
    ) {}

    /**
     * L'oggetto va tradotto qui e non nella vista: è l'unica riga che si legge
     * nella lista dei messaggi, e arrivare in italiano a chi sta facendo il
     * corso in spagnolo è il modo più veloce per finire nel cestino.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->isNew
                ? __('Benvenuto in Quantum Arcade — conferma la tua email')
                : __('Il tuo link di accesso a Quantum Arcade'),
        );
    }

    public function content(): Content
    {
        return new Content(view: 'accounts::emails.magic-link');
    }
}
