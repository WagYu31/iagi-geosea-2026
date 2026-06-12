<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="55th Annual Convention of Indonesian Association of Geologists (IAGI) and GEOSEA XIX 2026 — Southeast Asia's premier geological conference.">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Favicon & PWA -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png">
        <link rel="apple-touch-icon" sizes="512x512" href="/apple-touch-icon.png">
        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#004D40">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite('resources/js/app.jsx')
        @inertiaHead

    </head>
    <body class="font-sans antialiased">
        @inertia

        <!-- Midtrans Snap.js (loaded async to avoid blocking page render) -->
        <script
            src="{{ config('midtrans.snap_url') }}"
            data-client-key="{{ config('midtrans.client_key') }}"
            async
        ></script>

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
