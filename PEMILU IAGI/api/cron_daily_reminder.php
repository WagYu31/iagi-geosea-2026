<?php
/**
 * KPKU IAGI 2026 - Automated Daily Voting Reminder & Google Calendar Dispatcher
 * 
 * Mengirimkan notifikasi email pengingat harian otomatis dan sinkronisasi Google Calendar
 * kepada seluruh Anggota DPT yang BELUM MEMILIH (Belum Menggunakan Hak Suara).
 * 
 * Penggunaan:
 * 1. CLI (cPanel Cron Job):
 *    php /home/pitiagic/pemiluiagi.web.id/api/cron_daily_reminder.php
 *    php cron_daily_reminder.php --batch=50
 *    php cron_daily_reminder.php --test=email@domain.com
 *    php cron_daily_reminder.php --dry-run
 * 
 * 2. HTTP Web API (Admin Dashboard):
 *    GET  ?action=status
 *    POST ?action=test&email=...
 *    POST ?action=broadcast&batch=50
 */

if (!defined('IN_KPKU_APP')) define('IN_KPKU_APP', true);

date_default_timezone_set('Asia/Jakarta');

// CORS for official domain
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$allowedOrigins = [
    'https://pemiluiagi.web.id',
    'https://www.pemiluiagi.web.id',
    'http://localhost:8088',
    'http://127.0.0.1:8088'
];
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header("Access-Control-Allow-Credentials: true");
} else {
    header("Access-Control-Allow-Origin: https://pemiluiagi.web.id");
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Secret key for web-triggered cron (optional fallback)
define('CRON_SECRET_KEY', 'kpku_reminder_cron_secure_2026_wagyua');
define('DEADLINE_WIB', '2026-11-03 23:59:00');

// Proteksi Keamanan: Hanya izinkan eksekusi via CLI (cPanel Cron Job)
// atau panggilan internal dari vote_sync.php (IN_VOTE_SYNC).
// Akses publik/eksternal langsung dari browser diblokir 403 Forbidden!
$isCli = (php_sapi_name() === 'cli');
$isInternal = defined('IN_VOTE_SYNC');
$secretKey = $_GET['key'] ?? ($_POST['key'] ?? '');

if (!$isCli && !$isInternal && $secretKey !== CRON_SECRET_KEY) {
    http_response_code(403);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'error' => 'Akses ditolak (403 Forbidden). Script pengingat ini diproteksi ketat dan hanya dapat dieksekusi secara internal oleh sistem server atau Cron Job resmi.'
    ]);
    exit;
}

// Direktori Data Aman
if (!function_exists('resolveSecureDataDir')) {
    function resolveSecureDataDir() {
        $secureDir = dirname(__DIR__, 2) . '/pemiluiagi_data';
        $localDir = __DIR__ . '/data';

        if (@is_dir($secureDir) || @mkdir($secureDir, 0750, true)) {
            return $secureDir;
        }
        if (!@is_dir($localDir)) {
            @mkdir($localDir, 0755, true);
        }
        return $localDir;
    }
}

if (!function_exists('readJsonFile')) {
    function readJsonFile($path, $default = []) {
        if (!file_exists($path)) return $default;
        $content = @file_get_contents($path);
        if ($content === false || $content === '') return $default;
        $data = @json_decode($content, true);
        return is_array($data) ? $data : $default;
    }
}

if (!function_exists('writeJsonFile')) {
    function writeJsonFile($path, $data) {
        $tmp = $path . '.tmp.' . bin2hex(random_bytes(4));
        $encoded = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if (@file_put_contents($tmp, $encoded, LOCK_EX) !== false) {
            return @rename($tmp, $path);
        }
        return false;
    }
}

// -------------------------------------------------------------
// HELPER: Google Calendar URL Builder
// -------------------------------------------------------------
function buildGoogleCalendarUrl($npa = '', $name = '') {
    $title = "Pemilu Ketua Umum IAGI 2026–2029 (Bilik Suara Ditutup Hari Ini)";
    // Tanggal Penutupan: 03 November 2026 23:59 WIB (UTC: 2026-11-03 16:59:00)
    // Acara pengingat fokus pada hari penutupan (08:00 - 23:59 WIB)
    $dates = "20261103T010000Z/20261103T165900Z";
    
    $cleanNpa = urlencode(trim($npa));
    $details = "Yth. Rekan Geologis IAGI,\n\n"
        . "Pengingat Resmi Panitia Pemilihan Ketua Umum (KPKU) IAGI Periode 2026–2029.\n"
        . "Pemungutan suara elektronik akan DITUTUP RESMI pada:\n"
        . "📅 Selasa, 03 November 2026 pukul 23:59 WIB.\n\n"
        . "🗳️ Masuk Bilik Suara: https://pemiluiagi.web.id/bilik.html\n"
        . "🔑 Klaim Token Mandiri: https://pemiluiagi.web.id/claim.html?npa={$cleanNpa}\n"
        . "💬 Hotline Panitia WhatsApp: https://wa.me/6285771593522\n\n"
        . "Suara Anda menentukan masa depan organisasi IAGI!";
    
    $location = "https://pemiluiagi.web.id/bilik.html";

    return "https://calendar.google.com/calendar/render?action=TEMPLATE"
        . "&text=" . urlencode($title)
        . "&dates=" . $dates
        . "&details=" . urlencode($details)
        . "&location=" . urlencode($location);
}

// -------------------------------------------------------------
// HELPER: iCalendar (.ics) Attachment Builder
// -------------------------------------------------------------
function buildIcsAttachment($npa = '', $name = '') {
    $dtStamp = gmdate('Ymd\THis\Z');
    $uid = 'kpku-reminder-' . md5($npa . '-2026-iagi') . '@pemiluiagi.web.id';
    $cleanNpa = trim($npa);

    return "BEGIN:VCALENDAR\r\n"
        . "VERSION:2.0\r\n"
        . "PRODID:-//KPKU IAGI//Pemilu Ketua Umum 2026//ID\r\n"
        . "CALSCALE:GREGORIAN\r\n"
        . "METHOD:REQUEST\r\n"
        . "BEGIN:VTIMEZONE\r\n"
        . "TZID:Asia/Jakarta\r\n"
        . "BEGIN:STANDARD\r\n"
        . "DTSTART:19700101T000000\r\n"
        . "TZOFFSETFROM:+0700\r\n"
        . "TZOFFSETTO:+0700\r\n"
        . "TZNAME:WIB\r\n"
        . "END:STANDARD\r\n"
        . "END:VTIMEZONE\r\n"
        . "BEGIN:VEVENT\r\n"
        . "UID:{$uid}\r\n"
        . "DTSTAMP:{$dtStamp}\r\n"
        . "ORGANIZER;CN=\"KPKU IAGI 2026\":mailto:noreply@pitiagi.cloud\r\n"
        . "DTSTART;TZID=Asia/Jakarta:20261103T080000\r\n"
        . "DTEND;TZID=Asia/Jakarta:20261103T235900\r\n"
        . "SUMMARY:Pemilihan Ketua Umum IAGI 2026–2029 (Bilik Suara Ditutup Hari Ini)\r\n"
        . "DESCRIPTION:Pengingat Resmi KPKU IAGI: Bilik Suara Elektronik DITUTUP RESMI pada Selasa, 03 November 2026 pukul 23:59 WIB.\\n\\nMasuk Bilik Suara: https://pemiluiagi.web.id/bilik.html\\nKlaim Token: https://pemiluiagi.web.id/claim.html?npa={$cleanNpa}\\nBantuan WhatsApp: wa.me/6285771593522\r\n"
        . "LOCATION:https://pemiluiagi.web.id/bilik.html\r\n"
        . "STATUS:CONFIRMED\r\n"
        . "TRANSP:OPAQUE\r\n"
        . "SEQUENCE:1\r\n"
        . "BEGIN:VALARM\r\n"
        . "ACTION:DISPLAY\r\n"
        . "DESCRIPTION:Pengingat: 1 Hari Menuju Penutupan Bilik Suara Pemilu IAGI 2026!\r\n"
        . "TRIGGER:-P1D\r\n"
        . "END:VALARM\r\n"
        . "BEGIN:VALARM\r\n"
        . "ACTION:DISPLAY\r\n"
        . "DESCRIPTION:Mendesak: 3 Jam Menuju Penutupan Bilik Suara Pemilu IAGI 2026!\r\n"
        . "TRIGGER:-PT3H\r\n"
        . "END:VALARM\r\n"
        . "END:VEVENT\r\n"
        . "END:VCALENDAR";
}

// -------------------------------------------------------------
// HELPER: HTML Email Builder
// -------------------------------------------------------------
function buildReminderEmailHtml($npa, $name, $daysLeft) {
    $logoUrl = 'https://pemiluiagi.web.id/assets/iagi-logo.png';
    $bilikUrl = 'https://pemiluiagi.web.id/bilik.html';
    $claimUrl = 'https://pemiluiagi.web.id/claim.html' . ($npa ? '?npa=' . urlencode($npa) : '');
    $gCalUrl = buildGoogleCalendarUrl($npa, $name);
    $icsUrl = 'https://pemiluiagi.web.id/api/vote_sync.php?action=calendar_auto&npa=' . urlencode($npa);
    
    // Status text & urgency
    if ($daysLeft <= 1) {
        $urgencyBadge = "🚨 HARI TERAKHIR (DITUTUP MALAM INI PUKUL 23:59 WIB)";
        $countdownText = "Bilik Suara Ditutup <strong>Malam Ini, 03 November 2026 Pukul 23:59 WIB</strong>!";
        $countdownColor = "#DC2626";
    } elseif ($daysLeft == 2) {
        $urgencyBadge = "⚠️ TINGGAL 1 HARI LAGI (DITUTUP BESOK MALAM)";
        $countdownText = "Sisa Waktu: <strong>1 Hari Lagi</strong> (Selasa, 03 Nov 2026 pukul 23:59 WIB)";
        $countdownColor = "#EA580C";
    } else {
        $urgencyBadge = "⏳ SISA {$daysLeft} HARI LAGI";
        $countdownText = "Sisa Waktu: <strong>{$daysLeft} Hari Lagi</strong> (Ditutup 03 Nov 2026, 23:59 WIB)";
        $countdownColor = "#D97706";
    }

    $safeName = htmlspecialchars($name ?: 'Anggota IAGI', ENT_QUOTES, 'UTF-8');
    $safeNpa = htmlspecialchars($npa ?: '-', ENT_QUOTES, 'UTF-8');

    return <<<HTML
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Pengingat Resmi: Pemilu Ketua Umum IAGI 2026–2029</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Schema.org Microdata untuk Google Calendar Auto-Event (Standar Traveloka & Maskapai) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Pemilihan Ketua Umum IAGI 2026–2029 (Bilik Suara Ditutup Hari Ini)",
    "description": "Pengingat Resmi KPKU IAGI: Bilik Suara Elektronik DITUTUP RESMI pada Selasa, 03 November 2026 pukul 23:59 WIB.",
    "startDate": "2026-11-03T08:00:00+07:00",
    "endDate": "2026-11-03T23:59:00+07:00",
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "VirtualLocation",
      "url": "https://pemiluiagi.web.id/bilik.html"
    },
    "organizer": {
      "@type": "Organization",
      "name": "KPKU IAGI 2026",
      "url": "https://pemiluiagi.web.id"
    }
  }
  </script>
  <style>
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0B131E; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0B131E; padding: 24px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0F172A; border: 1px solid #1E293B; border-radius: 18px; overflow: hidden; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);">
          
          <!-- Top Gold Ribbon -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #D97706 0%, #F5BA42 50%, #D97706 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background-color: #07221C; padding: 28px 24px; text-align: center; border-bottom: 1px solid rgba(245, 186, 66, 0.2);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <img src="{$logoUrl}" alt="Logo IAGI" width="70" height="70" style="display: block; width: 70px; height: 70px; margin: 0 auto; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));">
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.16em; color: #F5BA42; text-transform: uppercase; margin-bottom: 4px;">
                      IKATAN AHLI GEOLOGI INDONESIA (IAGI)
                    </div>
                    <div style="font-size: 11px; font-weight: 700; color: #94A3B8; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 10px;">
                      KOMISI PEMILIHAN KETUA UMUM (KPKU) 2026–2029
                    </div>
                    <div style="display: inline-block; background: rgba(245, 186, 66, 0.15); border: 1px solid rgba(245, 186, 66, 0.4); color: #FDE68A; font-size: 10.5px; font-weight: 800; padding: 4px 14px; border-radius: 999px; letter-spacing: 0.05em; text-transform: uppercase;">
                      {$urgencyBadge}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px 24px;">
              <h2 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 800; color: #FFFFFF; text-align: center; line-height: 1.35;">
                Pengingat Resmi Pemilihan Ketua Umum IAGI
              </h2>
              
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #94A3B8; text-align: center; line-height: 1.55;">
                Berdasarkan data sistem KPKU IAGI, Anda terdaftar resmi dalam DPT namun <strong>belum menggunakan hak suara</strong>.
              </p>

              <!-- Voter Info Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #162032; border: 1px solid #1E293B; border-radius: 12px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="font-size: 12px; color: #64748B; padding: 4px 0;">Nama Pemilih:</td>
                        <td style="font-size: 13px; font-weight: 700; color: #FFFFFF; padding: 4px 0; text-align: right;">{$safeName}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748B; padding: 4px 0;">No. Anggota (NPA):</td>
                        <td style="font-size: 13px; font-weight: 800; color: #F5BA42; font-family: monospace; padding: 4px 0; text-align: right;">{$safeNpa}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748B; padding: 4px 0;">Status Hak Suara:</td>
                        <td style="font-size: 12px; font-weight: 800; color: #F87171; padding: 4px 0; text-align: right;">
                          <span style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); padding: 3px 8px; border-radius: 6px;">❌ Belum Memilih</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Countdown Box -->
              <div style="background: rgba(217, 119, 6, 0.1); border: 1px solid rgba(245, 186, 66, 0.35); border-radius: 12px; padding: 14px 18px; text-align: center; margin-bottom: 24px;">
                <div style="font-size: 13px; color: #FDE68A; line-height: 1.5;">
                  {$countdownText}
                </div>
              </div>

              <!-- Action Button 1: Masuk Bilik Suara -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 14px;">
                <tr>
                  <td align="center">
                    <a href="{$bilikUrl}" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background: linear-gradient(135deg, #059669 0%, #10B981 100%); color: #FFFFFF; text-decoration: none; font-size: 15px; font-weight: 800; text-align: center; padding: 15px 24px; border-radius: 10px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35); letter-spacing: 0.04em;">
                      🗳️ MASUK BILIK SUARA SEKARANG &raquo;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Action Button 2: Direct Google Calendar Integration -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 12px;">
                <tr>
                  <td align="center">
                    <a href="{$gCalUrl}" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%); color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 700; text-align: center; padding: 14px 20px; border-radius: 10px; border: 1px solid #3B82F6; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); letter-spacing: 0.02em;">
                      📅 Pasang Pengingat di Google Calendar (1-Klik)
                    </a>
                  </td>
                </tr>
              </table>

              <div style="text-align: center; margin-bottom: 22px;">
                <span style="font-size: 11.5px; color: #94A3B8; line-height: 1.5;">
                  💡 <em>Klik tombol di atas untuk langsung membuka formulir jadwal dan menekan "Simpan" (otomatis masuk ke kalender HP seperti Traveloka).</em>
                </span>
              </div>

              <!-- Token Helper Box -->
              <div style="background-color: #162032; border: 1px dashed #334155; border-radius: 10px; padding: 14px 16px; margin-bottom: 20px;">
                <div style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5; text-align: center;">
                  <strong>Belum menerima atau lupa Token Surat Suara Anda?</strong><br>
                  <a href="{$claimUrl}" target="_blank" style="color: #F5BA42; font-weight: 700; text-decoration: underline;">
                    🔑 Klik di sini untuk Klaim Token Otomatis ke Email
                  </a>
                </div>
              </div>

              <!-- Security Assurance -->
              <div style="border-top: 1px solid #1E293B; padding-top: 18px; margin-top: 10px; font-size: 11.5px; color: #64748B; line-height: 1.55; text-align: center;">
                🛡️ <strong>Asas LUBER & JURDIL:</strong> Pilihan Anda dilindungi enkripsi kriptografi 128-bit <em>Zero-Knowledge</em>. Panitia maupun sistem tidak dapat melihat calon yang Anda pilih.
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0A0F1D; padding: 22px 24px; text-align: center; border-top: 1px solid #1E293B;">
              <div style="font-size: 12px; color: #94A3B8; font-weight: 700; margin-bottom: 8px;">
                KOMISI PEMILIHAN KETUA UMUM (KPKU) IAGI 2026–2029
              </div>
              <div style="font-size: 11px; color: #64748B; margin-bottom: 12px;">
                Ketua Panitia: <strong>M. Addiansyah</strong> &bull; Sekretariat & Admin Teknis
              </div>
              <div style="font-size: 11px; color: #94A3B8; margin-bottom: 12px;">
                💬 Hotline WhatsApp: <a href="https://wa.me/6285771593522" target="_blank" style="color: #34D399; font-weight: 700; text-decoration: none;">+62 857-7159-3522</a> &bull; 
                ✉️ Email: <a href="mailto:iagisekretariat@gmail.com" style="color: #F5BA42; text-decoration: none;">iagisekretariat@gmail.com</a>
              </div>
              <div style="font-size: 10px; color: #475569; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 10px; line-height: 1.5;">
                Surel pengingat otomatis ini diterbitkan oleh Sistem Pemilu KPKU IAGI 2026.<br>
                Hak Cipta &copy; 2026 Ikatan Ahli Geologi Indonesia (IAGI).
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

// -------------------------------------------------------------
// HELPER: Send Calendar Reminder Email (MIME Multipart + iCal)
// -------------------------------------------------------------
function sendCalendarReminderEmail($toEmail, $toName, $subject, $htmlBody, $icsContent = null) {
    $plainText = strip_tags(str_replace(['<br>', '<br/>', '<br />', '</p>', '</tr>'], "\n", $htmlBody));
    $boundary = '----=_Part_' . md5(uniqid(mt_rand(), true));

    $headers = [
        'MIME-Version: 1.0',
        'From: KPKU IAGI 2026 <noreply@pitiagi.cloud>',
        'Reply-To: KPKU IAGI <iagisekretariat@gmail.com>',
        'X-Mailer: KPKU-Reminder-Engine/2026.1',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"'
    ];

    $body = "--{$boundary}\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $body .= $plainText . "\r\n\r\n";

    $body .= "--{$boundary}\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $body .= $htmlBody . "\r\n\r\n";

    if (!empty($icsContent)) {
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: text/calendar; method=REQUEST; charset=UTF-8; component=VEVENT; name=\"pemilu_iagi_2026.ics\"\r\n";
        $body .= "Content-Transfer-Encoding: 8bit\r\n";
        $body .= "Content-Disposition: inline; filename=\"pemilu_iagi_2026.ics\"\r\n\r\n";
        $body .= $icsContent . "\r\n\r\n";
    }

    $body .= "--{$boundary}--";

    $mailSent = false;
    $errorDetail = '';

    // Attempt 1: Standard PHP mail()
    try {
        $mailSent = @mail($toEmail, $subject, $body, implode("\r\n", $headers));
    } catch (Exception $e) {
        $errorDetail = $e->getMessage();
    }

    // Attempt 2: Fallback direct SSL SMTP socket (pitiagi.cloud:465)
    if (!$mailSent) {
        $smtpHost = 'pitiagi.cloud';
        $smtpPort = 465;
        $smtpUser = 'noreply@pitiagi.cloud';
        $smtpPass = 'Wagyu312226';

        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ]);

        $socket = @stream_socket_client("ssl://{$smtpHost}:{$smtpPort}", $errno, $errstr, 5, STREAM_CLIENT_CONNECT, $context);
        if ($socket) {
            $read = function($sock) {
                $resp = '';
                while ($line = fgets($sock, 515)) {
                    $resp .= $line;
                    if (substr($line, 3, 1) === ' ') break;
                }
                return $resp;
            };

            $read($socket);
            fwrite($socket, "EHLO pemiluiagi.web.id\r\n"); $read($socket);
            fwrite($socket, "AUTH LOGIN\r\n"); $read($socket);
            fwrite($socket, base64_encode($smtpUser) . "\r\n"); $read($socket);
            fwrite($socket, base64_encode($smtpPass) . "\r\n"); $read($socket);
            fwrite($socket, "MAIL FROM:<{$smtpUser}>\r\n"); $read($socket);
            fwrite($socket, "RCPT TO:<{$toEmail}>\r\n"); $read($socket);
            fwrite($socket, "DATA\r\n"); $read($socket);

            $dataPayload = "Subject: {$subject}\r\n";
            $dataPayload .= "To: {$toName} <{$toEmail}>\r\n";
            $dataPayload .= implode("\r\n", $headers) . "\r\n\r\n";
            $dataPayload .= $body . "\r\n.\r\n";

            fwrite($socket, $dataPayload);
            $resultResp = $read($socket);
            fwrite($socket, "QUIT\r\n");
            fclose($socket);

            if (strpos($resultResp, '250') !== false) {
                $mailSent = true;
            } else {
                $errorDetail = 'SMTP response: ' . trim($resultResp);
            }
        } else {
            $errorDetail = "Koneksi SMTP socket gagal: {$errstr} ({$errno})";
        }
    }

    return [
        'success' => $mailSent,
        'error' => $mailSent ? null : $errorDetail
    ];
}

// -------------------------------------------------------------
// CORE CONTROLLER: Ambil Daftar DPT yang Belum Memilih
// -------------------------------------------------------------
function getUnvotedVoterRegistry() {
    $dataDir = resolveSecureDataDir();
    $masterRegistryPath = __DIR__ . '/dpt_master_registry.php';
    if (!file_exists($masterRegistryPath)) {
        return ['error' => 'Master DPT registry not found.'];
    }

    $dptMaster = require $masterRegistryPath;
    $votersFile = $dataDir . '/voters_status.json';
    $votersStatus = readJsonFile($votersFile, []);
    $ballotsFile = $dataDir . '/ballots.json';
    $ballots = readJsonFile($ballotsFile, []);
    $totalBallots = count($ballots);

    $unvotedList = [];
    $votedCount = 0;
    $validEmailCount = 0;

    foreach ($dptMaster as $npa => $info) {
        $hasVoted = false;
        if (isset($votersStatus[$npa]) && !empty($votersStatus[$npa]['voted'])) {
            $hasVoted = true;
        }

        if ($hasVoted) {
            $votedCount++;
        } else {
            $email = trim($info['email'] ?? '');
            $hasValidEmail = !empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL);
            if ($hasValidEmail) {
                $validEmailCount++;
            }
            $unvotedList[] = [
                'npa' => $npa,
                'name' => $info['name'] ?? '',
                'email' => $email,
                'has_valid_email' => $hasValidEmail,
                'claimed' => !empty($votersStatus[$npa]['claimed'])
            ];
        }
    }

    return [
        'total_dpt' => count($dptMaster),
        'total_voted_dpt' => $votedCount,
        'total_ballots_vault' => $totalBallots,
        'total_unvoted' => count($unvotedList),
        'total_valid_emails_unvoted' => $validEmailCount,
        'unvoted_voters' => $unvotedList
    ];
}

// -------------------------------------------------------------
// CORE RUNNER: Eksekusi Batch Pengingat
// -------------------------------------------------------------
function executeReminderBatch($batchSize = 50, $dryRun = false, $force = false) {
    $dataDir = resolveSecureDataDir();
    $historyFile = $dataDir . '/reminder_history.json';
    $logsFile = $dataDir . '/reminder_logs.json';

    $registry = getUnvotedVoterRegistry();
    if (isset($registry['error'])) {
        return ['success' => false, 'error' => $registry['error']];
    }

    $history = readJsonFile($historyFile, []);
    $now = time();
    $throttleThreshold = 20 * 3600; // 20 jam agar tepat 1 kali sehari per pemilih

    // Hitung sisa hari
    $deadlineTs = strtotime(DEADLINE_WIB);
    $diffSec = $deadlineTs - $now;
    $daysLeft = max(1, (int)ceil($diffSec / 86400));

    $subject = ($daysLeft <= 1)
        ? "🚨 [HARI TERAKHIR] Pengingat Bilik Suara Pemilu Ketua Umum IAGI 2026 Ditutup Malam Ini!"
        : "⏳ [PENGINGAT RESMI] Sisa {$daysLeft} Hari: Gunakan Hak Suara Anda di Pemilu Ketua Umum IAGI 2026";

    $targeted = [];
    foreach ($registry['unvoted_voters'] as $v) {
        if (!$v['has_valid_email']) continue;
        $npa = $v['npa'];

        // Cek riwayat pengiriman
        if (!$force && isset($history[$npa]['last_sent'])) {
            $lastSent = $history[$npa]['last_sent'];
            if (($now - $lastSent) < $throttleThreshold) {
                continue; // Sudah dikirim hari ini
            }
        }

        $targeted[] = $v;
        if ($batchSize > 0 && count($targeted) >= $batchSize) {
            break;
        }
    }

    $totalTargeted = count($targeted);
    $sentCount = 0;
    $failedCount = 0;
    $results = [];

    if (!$dryRun && $totalTargeted > 0) {
        foreach ($targeted as $voter) {
            $npa = $voter['npa'];
            $name = $voter['name'];
            $email = $voter['email'];

            $htmlBody = buildReminderEmailHtml($npa, $name, $daysLeft);
            $icsContent = buildIcsAttachment($npa, $name);

            $sendRes = sendCalendarReminderEmail($email, $name, $subject, $htmlBody, $icsContent);

            if ($sendRes['success']) {
                $sentCount++;
                $history[$npa] = [
                    'last_sent' => $now,
                    'last_sent_str' => date('d-m-Y H:i:s'),
                    'send_count' => ($history[$npa]['send_count'] ?? 0) + 1,
                    'email' => $email
                ];
                $results[] = ['npa' => $npa, 'email' => $email, 'status' => 'SENT'];
            } else {
                $failedCount++;
                $results[] = ['npa' => $npa, 'email' => $email, 'status' => 'FAILED', 'error' => $sendRes['error']];
            }

            // Delay 150ms agar server mail tidak terkena rate limit
            usleep(150000);
        }

        writeJsonFile($historyFile, $history);

        // Catat ke logs
        $logs = readJsonFile($logsFile, []);
        array_unshift($logs, [
            'id' => 'rem-' . bin2hex(random_bytes(4)),
            'timestamp' => $now,
            'time_str' => date('d-m-Y H:i:s') . ' WIB',
            'days_left' => $daysLeft,
            'batch_size' => $batchSize,
            'targeted' => $totalTargeted,
            'sent' => $sentCount,
            'failed' => $failedCount
        ]);
        if (count($logs) > 100) $logs = array_slice($logs, 0, 100);
        writeJsonFile($logsFile, $logs);
    }

    return [
        'success' => true,
        'dry_run' => $dryRun,
        'days_left' => $daysLeft,
        'total_dpt' => $registry['total_dpt'],
        'total_unvoted' => $registry['total_unvoted'],
        'total_valid_emails_unvoted' => $registry['total_valid_emails_unvoted'],
        'targeted_in_batch' => $totalTargeted,
        'sent_count' => $sentCount,
        'failed_count' => $failedCount,
        'results_sample' => array_slice($results, 0, 10)
    ];
}

// =============================================================
// DISPATCHER: CLI atau Web API
// =============================================================
if (defined('IN_VOTE_SYNC')) {
    return;
}

$isCli = (php_sapi_name() === 'cli');

if ($isCli) {
    // Mode CLI (Untuk cPanel Cron Job)
    $args = getopt('', ['test::', 'batch::', 'dry-run', 'force', 'help']);

    if (isset($args['help'])) {
        echo "=== KPKU IAGI 2026 Daily Reminder CLI ===\n";
        echo "Usage:\n";
        echo "  php cron_daily_reminder.php                (Jalankan pengingat harian default 50 batch)\n";
        echo "  php cron_daily_reminder.php --batch=100    (Tentukan ukuran batch pengiriman)\n";
        echo "  php cron_daily_reminder.php --test=email   (Kirim uji coba ke 1 alamat email)\n";
        echo "  php cron_daily_reminder.php --dry-run      (Simulasi hitung pemilih tanpa kirim email)\n";
        echo "  php cron_daily_reminder.php --force        (Abaikan throttle 20 jam harian)\n";
        exit(0);
    }

    if (isset($args['test'])) {
        $testEmail = trim($args['test']) ?: 'addiansyah@unsri.ac.id';
        echo "[*] Mengirim test email pengingat & Google Calendar ke: {$testEmail}...\n";
        $now = time();
        $diffSec = strtotime(DEADLINE_WIB) - $now;
        $daysLeft = max(1, (int)ceil($diffSec / 86400));
        $html = buildReminderEmailHtml('99999', 'Penguji Panitia KPKU', $daysLeft);
        $ics = buildIcsAttachment('99999', 'Penguji Panitia KPKU');
        $subject = "🧪 [UJI COBA KALENDER] Pengingat Pemilu Ketua Umum IAGI 2026";
        $res = sendCalendarReminderEmail($testEmail, 'Penguji Panitia', $subject, $html, $ics);
        if ($res['success']) {
            echo "[✓] Berhasil terkirim ke {$testEmail}!\n";
        } else {
            echo "[✕] Gagal kirim: " . ($res['error'] ?? 'Unknown error') . "\n";
        }
        exit(0);
    }

    // Default 0 = Kirim otomatis ke SELURUH pemilih yang Belum Memilih (1.442 pemilih)
    $batchSize = isset($args['batch']) ? (int)$args['batch'] : 0;
    $dryRun = isset($args['dry-run']);
    $force = isset($args['force']);

    echo "[*] Menjalankan Pengingat Harian Pemilu IAGI 2026 (Batch: {$batchSize}, DryRun: " . ($dryRun ? 'YA' : 'TIDAK') . ")...\n";
    $result = executeReminderBatch($batchSize, $dryRun, $force);
    echo "[✓] Hasil: " . json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
    exit(0);

} else {
    // Mode Web API (Admin Dashboard atau Webhook)
    header('Content-Type: application/json; charset=utf-8');

    $action = $_GET['action'] ?? ($_POST['action'] ?? 'status');

    if ($action === 'status') {
        $dataDir = resolveSecureDataDir();
        $logsFile = $dataDir . '/reminder_logs.json';
        $historyFile = $dataDir . '/reminder_history.json';
        $logs = readJsonFile($logsFile, []);
        $history = readJsonFile($historyFile, []);

        $registry = getUnvotedVoterRegistry();
        $now = time();
        $diffSec = strtotime(DEADLINE_WIB) - $now;
        $daysLeft = max(1, (int)ceil($diffSec / 86400));

        echo json_encode([
            'success' => true,
            'days_left' => $daysLeft,
            'deadline_wib' => DEADLINE_WIB,
            'total_dpt' => $registry['total_dpt'],
            'total_voted' => $registry['total_voted_dpt'],
            'total_ballots' => $registry['total_ballots_vault'],
            'total_unvoted' => $registry['total_unvoted'],
            'total_valid_emails_unvoted' => $registry['total_valid_emails_unvoted'],
            'total_unique_reminders_sent' => count($history),
            'last_run' => $logs[0] ?? null,
            'recent_logs' => array_slice($logs, 0, 5)
        ]);
        exit;
    }

    if ($action === 'test') {
        $rawPost = @file_get_contents('php://input');
        $body = @json_decode($rawPost, true) ?: $_POST;
        $targetEmail = trim($body['email'] ?? ($_GET['email'] ?? ''));

        if (empty($targetEmail) || !filter_var($targetEmail, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Alamat email uji coba tidak valid.']);
            exit;
        }

        $now = time();
        $diffSec = strtotime(DEADLINE_WIB) - $now;
        $daysLeft = max(1, (int)ceil($diffSec / 86400));

        $html = buildReminderEmailHtml('00880', 'M. Addiansyah (Uji Coba)', $daysLeft);
        $ics = buildIcsAttachment('00880', 'M. Addiansyah');
        $subject = "🧪 [UJI COBA RESMI] Pengingat Bilik Suara & Google Calendar Pemilu IAGI 2026";

        $res = sendCalendarReminderEmail($targetEmail, 'Admin Penguji', $subject, $html, $ics);
        if ($res['success']) {
            echo json_encode(['success' => true, 'message' => "Email pengingat uji coba berhasil dikirim ke {$targetEmail}"]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Gagal mengirim email: ' . ($res['error'] ?? 'Unknown error')]);
        }
        exit;
    }

    if ($action === 'broadcast') {
        $rawPost = @file_get_contents('php://input');
        $body = @json_decode($rawPost, true) ?: $_POST;
        $batchSize = isset($body['batch_size']) ? (int)$body['batch_size'] : 50;
        $force = !empty($body['force']);

        $res = executeReminderBatch($batchSize, false, $force);
        echo json_encode($res);
        exit;
    }

    echo json_encode(['success' => false, 'error' => 'Action tidak dikenali.']);
    exit;
}
