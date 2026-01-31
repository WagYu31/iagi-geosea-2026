<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppNotificationService
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = env('FLOWKIRIM_API_KEY', 'ea0eaebe96e43a3fd9ea82583192b0ab9c0720b18f8b40c0253da3f18bfe391a');
        $this->baseUrl = 'https://api.flowkirim.com';
    }

    /**
     * Send WhatsApp notification
     *
     * @param string $phoneNumber Phone number with country code (e.g., 628212226504)
     * @param string $message Message to send
     * @return bool
     */
    public function sendMessage($phoneNumber, $message)
    {
        try {
            // Clean phone number - remove any spaces, dashes, or plus signs
            $phoneNumber = preg_replace('/[^0-9]/', '', $phoneNumber);

            // Ensure phone number starts with 62 (Indonesia country code)
            if (substr($phoneNumber, 0, 1) === '0') {
                $phoneNumber = '62' . substr($phoneNumber, 1);
            } elseif (substr($phoneNumber, 0, 2) !== '62') {
                $phoneNumber = '62' . $phoneNumber;
            }

            // Manual mode: Log message for admin to send manually
            if (env('WHATSAPP_MANUAL_MODE', true)) {
                Log::info('WhatsApp notification (MANUAL MODE)', [
                    'phone' => $phoneNumber,
                    'message' => $message,
                    'whatsapp_url' => "https://wa.me/{$phoneNumber}?text=" . urlencode($message),
                    'note' => 'Admin needs to send this message manually via WhatsApp.'
                ]);
                return true;
            }

            // Send message via FlowKirim API (production mode)
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/v1/send-message', [
                'phone' => $phoneNumber,
                'message' => $message,
            ]);

            if ($response->successful()) {
                Log::info('WhatsApp notification sent successfully', [
                    'phone' => $phoneNumber,
                    'response' => $response->json()
                ]);
                return true;
            } else {
                Log::error('Failed to send WhatsApp notification', [
                    'phone' => $phoneNumber,
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error('Exception while sending WhatsApp notification', [
                'phone' => $phoneNumber,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Send submission status update notification
     *
     * @param \App\Models\User $user
     * @param \App\Models\Submission $submission
     * @param string $status
     * @return bool
     */
    public function sendSubmissionStatusNotification($user, $submission, $status)
    {
        if (!$user->whatsapp) {
            Log::warning('User does not have WhatsApp number', ['user_id' => $user->id]);
            return false;
        }

        $statusMessages = [
            'pending' => "Status submission Anda telah diubah menjadi *Pending*.\n\nSubmission akan segera ditinjau oleh tim kami.",
            'under_review' => "Status submission Anda telah diubah menjadi *Under Review*.\n\nSubmission Anda sedang dalam proses peninjauan oleh reviewer.",
            'revision_required_phase1' => "Status submission Anda telah diubah menjadi *Revision Phase 1*.\n\nSilakan lakukan revisi sesuai dengan komentar reviewer.",
            'revision_required_phase2' => "Status submission Anda telah diubah menjadi *Revision Phase 2*.\n\nSilakan lakukan revisi tambahan sesuai dengan komentar reviewer.",
            'accepted' => "🎉 *Selamat!* 🎉\n\nSubmission Anda telah *DITERIMA* (Accepted).\n\nTerima kasih atas kontribusi Anda dalam konferensi ini.",
            'rejected' => "Status submission Anda telah diubah menjadi *Rejected*.\n\nMohon maaf submission Anda tidak dapat diterima kali ini. Terima kasih atas partisipasi Anda.",
        ];

        $statusText = $statusMessages[$status] ?? "Status submission Anda telah diperbarui.";

        $message = "*IAGI-GEOSEA 2026 - Notification*\n\n";
        $message .= "Halo *{$user->name}*,\n\n";
        $message .= "Submission ID: *{$submission->id}*\n";
        $message .= "Judul: *{$submission->title}*\n\n";
        $message .= $statusText . "\n\n";
        $message .= "Silakan login ke dashboard Anda untuk informasi lebih lanjut.\n\n";
        $message .= "Terima kasih,\n";
        $message .= "Tim IAGI-GEOSEA 2026";

        return $this->sendMessage($user->whatsapp, $message);
    }
}
