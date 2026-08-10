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

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->isNew
                ? 'Benvenuto in Quantum Arcade — conferma la tua email'
                : 'Il tuo link di accesso a Quantum Arcade',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'accounts::emails.magic-link');
    }
}
