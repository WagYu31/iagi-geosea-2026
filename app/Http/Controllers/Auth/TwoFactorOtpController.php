<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\WhatsAppNotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TwoFactorOtpController extends Controller
{
    /**
     * Display the 2FA WhatsApp OTP verification view.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        $twoFactorData = $request->session()->get('auth_2fa');

        if (!$twoFactorData || empty($twoFactorData['user_id'])) {
            return redirect()->route('login');
        }

        $phone = $twoFactorData['phone'] ?? '';
        $maskedPhone = $this->maskPhoneNumber($phone);
        $expiresAt = $twoFactorData['expires_at'] ?? now()->timestamp;
        $remainingSeconds = max(0, $expiresAt - now()->timestamp);

        return Inertia::render('Auth/VerifyOtp', [
            'maskedPhone' => $maskedPhone,
            'remainingSeconds' => $remainingSeconds,
            'status' => session('status'),
        ]);
    }

    /**
     * Verify the 6-digit WhatsApp OTP code and log the user in.
     */
    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'otp' => ['required', 'string', 'min:6', 'max:8'],
        ]);

        $twoFactorData = $request->session()->get('auth_2fa');

        if (!$twoFactorData || empty($twoFactorData['user_id'])) {
            return redirect()->route('login')->withErrors([
                'email' => 'Sesi verifikasi telah kedaluwarsa. Silakan login kembali.',
            ]);
        }

        // Throttle OTP attempts (Max 5 attempts)
        $throttleKey = 'otp_verify|' . $twoFactorData['user_id'] . '|' . $request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'otp' => "Terlalu banyak percobaan kode salah. Mohon tunggu {$seconds} detik.",
            ]);
        }

        // Check expiration
        if (now()->timestamp > ($twoFactorData['expires_at'] ?? 0)) {
            throw ValidationException::withMessages([
                'otp' => 'Kode OTP telah kedaluwarsa. Silakan klik tombol "Kirim Ulang Kode".',
            ]);
        }

        // Clean user input
        $submittedOtp = preg_replace('/[^0-9]/', '', (string) $request->input('otp'));

        // Verify Hash
        if (!Hash::check($submittedOtp, $twoFactorData['otp_hash'] ?? '')) {
            RateLimiter::hit($throttleKey, 180);

            throw ValidationException::withMessages([
                'otp' => 'Kode OTP yang Anda masukkan salah. Silakan periksa pesan WhatsApp Anda.',
            ]);
        }

        // Success: Clear Rate Limiter and Authenticate
        RateLimiter::clear($throttleKey);

        $user = User::find($twoFactorData['user_id']);

        if (!$user) {
            $request->session()->forget('auth_2fa');
            return redirect()->route('login');
        }

        // Complete login
        Auth::login($user, $twoFactorData['remember'] ?? false);

        // Clear 2FA Session & Regenerate session token
        $request->session()->forget('auth_2fa');
        $request->session()->regenerate();

        Log::info('2FA WhatsApp Login successful', [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'ip' => $request->ip(),
        ]);

        // Role-based redirection
        if (strtolower($user->role) === 'admin') {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        if (strtolower($user->role) === 'reviewer') {
            return redirect()->intended(route('reviewer.dashboard', absolute: false));
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Resend a fresh OTP via WhatsApp.
     */
    public function resend(Request $request, WhatsAppNotificationService $whatsappService): RedirectResponse
    {
        $twoFactorData = $request->session()->get('auth_2fa');

        if (!$twoFactorData || empty($twoFactorData['user_id'])) {
            return redirect()->route('login');
        }

        // Cooldown check: 45 seconds between resends
        $lastSent = $twoFactorData['last_sent_at'] ?? 0;
        $elapsed = now()->timestamp - $lastSent;

        if ($elapsed < 45) {
            $wait = 45 - $elapsed;
            return back()->withErrors([
                'otp' => "Mohon tunggu {$wait} detik sebelum meminta kode baru.",
            ]);
        }

        // Generate fresh 6-digit cryptographic OTP
        $newOtp = (string) random_int(100000, 999999);
        $phone = $twoFactorData['phone'] ?? '';

        // Update session
        $twoFactorData['otp_hash'] = Hash::make($newOtp);
        $twoFactorData['expires_at'] = now()->addMinutes(5)->timestamp;
        $twoFactorData['last_sent_at'] = now()->timestamp;

        $request->session()->put('auth_2fa', $twoFactorData);

        // Send via WhatsApp
        if (!empty($phone)) {
            $whatsappService->sendOtp($phone, $newOtp);
        }

        return back()->with('status', 'Kode OTP baru telah berhasil dikirimkan ke WhatsApp Anda.');
    }

    /**
     * Cancel 2FA verification and return to standard login.
     */
    public function cancel(Request $request): RedirectResponse
    {
        $request->session()->forget('auth_2fa');
        return redirect()->route('login');
    }

    /**
     * Helper to mask phone number for security (e.g., 085771593522 -> +62 857-••••-3522)
     */
    private function maskPhoneNumber(string $phone): string
    {
        $cleaned = preg_replace('/[^0-9]/', '', $phone);
        if (empty($cleaned)) {
            $cleaned = preg_replace('/[^0-9]/', '', env('ADMIN_WHATSAPP', '085771593522'));
        }

        // Ensure 62 prefix
        if (str_starts_with($cleaned, '0')) {
            $cleaned = '62' . substr($cleaned, 1);
        }

        $length = strlen($cleaned);
        if ($length < 8) {
            return '+' . $cleaned;
        }

        // For Indonesian numbers e.g. 6285771593522 -> prefix: +62 857, suffix: 3522
        $prefix = substr($cleaned, 0, 5); // 62857
        $suffix = substr($cleaned, -4);    // 3522
        $maskedLength = max(4, $length - 9);

        return '+' . substr($prefix, 0, 2) . ' ' . substr($prefix, 2) . '-' . str_repeat('•', $maskedLength) . '-' . $suffix;
    }
}
