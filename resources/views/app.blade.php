<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="55th Annual Convention of Indonesian Association of Geologists (IAGI) and GEOSEA XIX 2026 — Southeast Asia's premier geological conference.">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Favicon & PWA -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png">
        <link rel="apple-touch-icon" sizes="512x512" href="/apple-touch-icon.png">
        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#ffffff">
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
        <meta name="theme-color" content="#052e25" media="(prefers-color-scheme: dark)">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">

        <!-- Fonts: DNS Prefetch, Preconnect & Non-blocking Swap -->
        <link rel="dns-prefetch" href="https://fonts.googleapis.com">
        <link rel="dns-prefetch" href="https://fonts.gstatic.com">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
        <noscript>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap">
        </noscript>

        <!-- Dynamic Modulepreload for Active Page Component -->
        @php
            $pageComponent = $page['component'] ?? null;
            $manifestPath = public_path('build/manifest.json');
            $preloadPageAssets = [];
            if ($pageComponent && file_exists($manifestPath)) {
                $manifest = json_decode(file_get_contents($manifestPath), true);
                $entryKey = "resources/js/Pages/{$pageComponent}.jsx";
                if (isset($manifest[$entryKey])) {
                    $item = $manifest[$entryKey];
                    $preloadPageAssets[] = '/build/' . $item['file'];
                    if (!empty($item['imports'])) {
                        foreach ($item['imports'] as $imp) {
                            if (isset($manifest[$imp])) {
                                $preloadPageAssets[] = '/build/' . $manifest[$imp]['file'];
                            }
                        }
                    }
                }
            }
        @endphp
        @foreach(array_unique($preloadPageAssets) as $assetUrl)
            <link rel="modulepreload" as="script" href="{{ $assetUrl }}">
        @endforeach

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite('resources/js/app.jsx')
        @inertiaHead

    </head>
    <body class="font-sans antialiased">
        <div id="app" data-page="{{ json_encode($page) }}">
            <style>
                .app-splash {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #094d42 0%, #0a3d35 40%, #062e28 100%);
                    color: #ffffff;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    z-index: 99999;
                    text-align: center;
                    padding: 24px;
                }
                .app-splash-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    max-width: 420px;
                }
                .app-splash-logo {
                    width: 76px;
                    height: 76px;
                    border-radius: 50%;
                    background: #ffffff;
                    padding: 7px;
                    margin-bottom: 18px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }
                .app-splash-title {
                    font-size: 1.55rem;
                    font-weight: 800;
                    color: #4dd4ac;
                    letter-spacing: 0.02em;
                    margin: 0 0 6px 0;
                    line-height: 1.2;
                }
                .app-splash-sub {
                    font-size: 0.72rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.7);
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    margin: 0 0 20px 0;
                }
                .app-splash-spinner {
                    width: 24px;
                    height: 24px;
                    border: 2.5px solid rgba(26,188,156,0.25);
                    border-top-color: #1abc9c;
                    border-radius: 50%;
                    animation: app-spin 0.8s linear infinite;
                }
                @keyframes app-spin {
                    to { transform: rotate(360deg); }
                }
            </style>
            <div class="app-splash">
                <div class="app-splash-card">
                    <img src="/favicon.webp" alt="PIT IAGI - GEOSEA 2026" class="app-splash-logo" width="76" height="76" fetchpriority="high" decoding="async">
                    <h1 class="app-splash-title">55ᵀᴴ PIT IAGI-GEOSEA <span style="color:#1abc9c">XIX 2026</span></h1>
                    <p class="app-splash-sub">Annual Convention & Exhibition</p>
                    <div class="app-splash-spinner"></div>
                </div>
            </div>
        </div>

        <!-- Auto-refresh: detect new deployments -->
        <script>
        (function() {
            var currentVersion = null;
            var CHECK_INTERVAL = 30000; // 30 seconds

            function checkVersion() {
                fetch('/build/version.txt?t=' + Date.now())
                    .then(function(r) { return r.text(); })
                    .then(function(v) {
                        v = v.trim();
                        if (!currentVersion) {
                            currentVersion = v;
                        } else if (v !== currentVersion) {
                            console.log('[AutoRefresh] New version detected, reloading...');
                            window.location.reload();
                        }
                    })
                    .catch(function() {}); // silently fail
            }

            // Start checking after page load
            setTimeout(function() {
                checkVersion();
                setInterval(checkVersion, CHECK_INTERVAL);
            }, 5000);
        })();
        </script>
    </body>
</html>
