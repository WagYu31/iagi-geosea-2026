<?php

namespace App\Mail;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RevisionUploaded extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 30;

    public $submission;
    public $reviewerName;
    public $authorName;
    public $phase;

    /**
     * Create a new message instance.
     */
    public function __construct(Submission $submission, $reviewerName, $authorName, $phase)
    {
        $this->submission = $submission;
        $this->reviewerName = $reviewerName;
        $this->authorName = $authorName;
        $this->phase = $phase;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject("Revision Uploaded - {$this->submission->title} - PIT IAGI-GEOSEA 2026")
                    ->view('emails.revision_uploaded');
    }
}
