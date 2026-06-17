<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'submission_id',
        'payment_proof_url',
        'support_document_url',
        'amount',
        'verified',
        'verified_at',
        // Gateway fields
        'snap_token',
        'order_id',
        'payment_type',
        'transaction_id',
        'status',
        'paid_at',
        'midtrans_response',
        'gateway',
    ];

    protected $casts = [
        'verified' => 'boolean',
        'verified_at' => 'datetime',
        'paid_at' => 'datetime',
        'midtrans_response' => 'array',
        'amount' => 'decimal:2',
    ];

    // ============ RELATIONSHIPS ============

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    // ============ STATUS HELPERS ============

    /**
     * Check if payment was completed (either via Midtrans or manual verification).
     */
    public function isPaid(): bool
    {
        return $this->status === 'paid' || $this->verified === true;
    }

    /**
     * Check if payment is still pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending' && !$this->verified;
    }

    /**
     * Check if this is a Midtrans payment (has order_id and gateway is midtrans).
     */
    public function isMidtrans(): bool
    {
        return $this->gateway === 'midtrans' || (!empty($this->order_id) && empty($this->gateway));
    }

    /**
     * Check if this is a Xendit payment.
     */
    public function isXendit(): bool
    {
        return $this->gateway === 'xendit';
    }

    /**
     * Check if this is a legacy manual upload payment.
     */
    public function isManual(): bool
    {
        return $this->gateway === 'manual' || (!empty($this->payment_proof_url) && empty($this->order_id) && empty($this->gateway));
    }

    /**
     * Get a unified display status.
     */
    public function getDisplayStatusAttribute(): string
    {
        if ($this->isPaid()) {
            return 'Paid';
        }

        if ($this->status === 'failed' || $this->status === 'expired') {
            return ucfirst($this->status);
        }

        if ($this->isManual() && !$this->verified) {
            return 'Pending Verification';
        }

        return 'Pending Payment';
    }
}
