<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = Auth::user();

        // 2FA WhatsApp Enforcement for Admin (defaults to true, configurable via ADMIN_2FA_ENABLED)
        if ($user && strtolower($user->role) === 'admin' && env('ADMIN_2FA_ENABLED', true)) {
            Auth::guard('web')->logout();

            $otp = (string) random_int(100000, 999999);

            // Prioritize user's saved WhatsApp, fallback to ADMIN_WHATSAPP env or correct default '085771593522'
            $configuredAdminPhone = env('ADMIN_WHATSAPP', '085771593522');
            $phone = $user->whatsapp;

            // If empty or still carrying the old test number, update to the correct admin WhatsApp
            if (empty($phone) || in_array($phone, ['628212226504', '08212226504', '+628212226504', '8212226504'])) {
                $phone = $configuredAdminPhone;
                try {
                    $user->whatsapp = $phone;
                    $user->save();
                } catch (\Throwable $e) {
                    \Illuminate\Support\Facades\Log::warning('Unable to update admin phone in database: ' . $e->getMessage());
                }
            }

            $request->session()->put('auth_2fa', [
                'user_id' => $user->id,
                'otp_hash' => \Illuminate\Support\Facades\Hash::make($otp),
                'expires_at' => now()->addMinutes(5)->timestamp,
                'last_sent_at' => now()->timestamp,
                'phone' => $phone,
                'remember' => $request->boolean('remember'),
            ]);

            // Dispatch OTP via WhatsApp
            if (!empty($phone)) {
                app(\App\Services\WhatsAppNotificationService::class)->sendOtp($phone, $otp);
            }

            return redirect()->route('2fa.verify');
        }

        $request->session()->regenerate();

        if (strtolower($user->role) === 'reviewer') {
            return redirect()->intended(route('reviewer.dashboard', absolute: false));
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
