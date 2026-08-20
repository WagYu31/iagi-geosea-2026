<?php

namespace App\Mail;

use App\Models\VisitorTicket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VisitorTicketIssued extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 30;

    public $ticket;

    /**
     * Create a new message instance.
     */
    public function __construct(VisitorTicket $ticket)
    {
        $this->ticket = $ticket;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $category = $this->ticket->visitor_type === 'exclusive' ? 'Exclusive VIP' : 'Non-Exclusive';

        return $this->subject("E-Tiket Konferensi PIT IAGI & GEOSEA 2026 - [{$this->ticket->ticket_code}]")
                    ->view('emails.visitor_ticket_issued');
    }
}
