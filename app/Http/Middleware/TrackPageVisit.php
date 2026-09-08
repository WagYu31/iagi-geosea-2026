<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\PageVisit;

class TrackPageVisit
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        return $next($request);
    }

    /**
     * Handle tasks after the response has been sent to the browser.
     */
    public function terminate(Request $request, $response)
    {
        $userAgent = $request->userAgent() ?? '';

        // Skip common bots
        $bots = ['bot', 'crawl', 'spider', 'slurp', 'curl', 'wget', 'python', 'java/', 'fetcher'];
        foreach ($bots as $bot) {
            if (stripos($userAgent, $bot) !== false) {
                return;
            }
        }

        try {
            PageVisit::create([
                'ip_address' => $request->ip(),
                'user_agent' => substr($userAgent, 0, 500),
                'page' => $request->path() === '/' ? '/' : '/' . $request->path(),
                'visited_at' => now(),
            ]);
        } catch (\Exception $e) {
            // Silently fail - don't break the page for analytics
        }
    }
}
