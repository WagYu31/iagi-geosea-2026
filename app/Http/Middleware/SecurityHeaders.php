<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request and attach strong security headers.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Anti-clickjacking: Prevent the website from being embedded inside unauthorized iframes
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Anti-MIME sniffing: Prevent browsers from trying to guess MIME types
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // XSS Filter Protection
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Referrer Policy: Send full referrer on same-origin, but only origin on cross-origin HTTPS
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permissions Policy: Restrict sensitive hardware access by default
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        return $response;
    }
}
