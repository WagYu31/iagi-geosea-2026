#!/bin/bash
# =========================================================================
# LAUNCHER KIOSK GATE SCANNER 2026 (AUTO-ALLOW CAMERA WITHOUT PROMPTS)
# 55th PIT IAGI & GEOSEA XIX 2026
# =========================================================================

echo "🚀 Membuka Gate Scanner Kiosk Mode..."
echo "✅ Auto-Bypass Izin Kamera Aktif (Zero Permission Prompts)"

# Cek OS (Mac / Windows via Git Bash)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open -na "Google Chrome" --args --use-fake-ui-for-media-stream --app="https://pitiagi.cloud/admin/gate-scanner"
elif [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "win32"* ]]; then
    # Windows
    start chrome --use-fake-ui-for-media-stream --app="https://pitiagi.cloud/admin/gate-scanner"
else
    # Linux
    google-chrome --use-fake-ui-for-media-stream --app="https://pitiagi.cloud/admin/gate-scanner" &
fi
