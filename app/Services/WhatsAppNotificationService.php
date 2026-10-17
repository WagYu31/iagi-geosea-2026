<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppNotificationService
{
    protected $token;
    protected $provider;

    public function __construct()
    {
        // Support FONNTE_TOKEN (priority), WHATSAPP_TOKEN, or FLOWKIRIM_API_KEY
        $this->token = env('FONNTE_TOKEN') ?: (env('WHATSAPP_TOKEN') ?: env('FLOWKIRIM_API_KEY'));
        $this->provider = env('WHATSAPP_PROVIDER', 'fonnte');
    }

    /**
     * Send WhatsApp notification
     *
     * @param string $phoneNumber Phone number with country code (e.g., 6285771593522)
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

            // Manual mode: Log message if explicitly set to manual mode AND no token provided
            $isManual = env('WHATSAPP_MANUAL_MODE', false);
            if ($isManual && empty($this->token)) {
                Log::info('WhatsApp notification (MANUAL MODE - No Token configured)', [
                    'phone' => $phoneNumber,
                    'message' => $message,
                    'whatsapp_url' => "https://wa.me/{$phoneNumber}?text=" . urlencode($message),
                    'note' => 'Admin needs to send this message manually via WhatsApp.'
                ]);
                return true;
            }

            // 1. Send via Fonnte API (Primary Gateway)
            if (!empty($this->token) && ($this->provider === 'fonnte' || empty($this->provider))) {
                $response = Http::withHeaders([
                    'Authorization' => $this->token,
                ])->asForm()->post('https://api.fonnte.com/send', [
                    'target' => $phoneNumber,
                    'message' => $message,
                    'countryCode' => '62',
                ]);

                if ($response->successful()) {
                    Log::info('WhatsApp notification sent successfully via Fonnte', [
                        'phone' => $phoneNumber,
                        'response' => $response->json(),
                    ]);
                    return true;
                } else {
                    Log::error('Failed to send WhatsApp notification via Fonnte', [
                        'phone' => $phoneNumber,
                        'status' => $response->status(),
                        'response' => $response->body(),
                    ]);
                    return false;
                }
            }

            // 2. Fallback to FlowKirim if configured
            if (!empty($this->token) && $this->provider === 'flowkirim') {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->token,
                    'Content-Type' => 'application/json',
                ])->post('https://api.flowkirim.com/v1/messages', [
                    'to' => $phoneNumber,
                    'message' => $message,
                ]);

                if ($response->successful()) {
                    Log::info('WhatsApp notification sent successfully via FlowKirim', [
                        'phone' => $phoneNumber,
                        'response' => $response->json()
                    ]);
                    return true;
                }
            }

            Log::warning('WhatsApp notification skipped: No active token found in FONNTE_TOKEN.', ['phone' => $phoneNumber]);
            return false;
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

    /**
     * Send Two-Factor Authentication OTP code via WhatsApp
     *
     * @param string $phoneNumber
     * @param string $otp
     * @return bool
     */
    public function sendOtp($phoneNumber, $otp)
    {
        $message = "🔐 *KODE VERIFIKASI KEAMANAN (OTP)*\n"
            . "*55th PIT IAGI - GEOSEA XIX 2026*\n\n"
            . "Kode OTP Login Portal Anda adalah:\n"
            . "*{$otp}*\n\n"
            . "⏱️ *Berlaku:* 5 Menit\n"
            . "⚠️ *PENTING:* Jangan berikan kode ini kepada siapa pun demi keamanan akun Anda.\n\n"
            . "Jika Anda tidak sedang mencoba masuk, abaikan pesan ini atau segera hubungi Super Admin.";

        return $this->sendMessage($phoneNumber, $message);
    }
}
