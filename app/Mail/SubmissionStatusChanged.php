<?php

namespace App\Mail;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SubmissionStatusChanged extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 30;

    public $submission;
    public $oldStatus;
    public $newStatus;
    public $authorName;

    /**
     * Create a new message instance.
     */
    public function __construct(Submission $submission, $oldStatus, $newStatus, $authorName)
    {
        $this->submission = $submission;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
        $this->authorName = $authorName;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Submission Status Update - PIT IAGI-GEOSEA 2026')
                    ->view('emails.submission_status_changed');
    }
}
