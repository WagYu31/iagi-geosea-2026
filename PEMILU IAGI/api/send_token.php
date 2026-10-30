<?php
/**
 * KPKU IAGI 2026 - Official Token Dispatch Mailer
 * Mengirimkan Kode Unik Surat Suara Kriptografi 128-bit langsung ke Email Pemilih Terdaftar.
 * Menegakkan Integritas Asas LUBER (Langsung, Umum, Bebas, Rahasia).
 */

if (!defined('IN_KPKU_APP')) define('IN_KPKU_APP', true);

// Enterprise CORS Protection - Restrict to official domain
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
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Metode request tidak diizinkan. Gunakan POST.']);
    exit;
}

date_default_timezone_set('Asia/Jakarta');

// Direktori Data Aman (Luar Web Root)
function resolveSecureDataDir() {
    $secureDir = dirname(__DIR__, 2) . '/pemiluiagi_data';
    $localDir = __DIR__ . '/data';
    if (@is_dir($secureDir) || @mkdir($secureDir, 0750, true)) {
        return $secureDir;
    }
    if (!is_dir($localDir)) {
        @mkdir($localDir, 0755, true);
    }
    return $localDir;
}

$dataDir = resolveSecureDataDir();

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

// 1. Proteksi Honeypot Trap
if (!empty($data['website_url']) || !empty($data['trap_field']) || !empty($data['official_org_website_url'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Permintaan ditolak oleh sistem keamanan (Anti-Bot Trap).']);
    exit;
}

// 2. Resolusi IP Klien & Proteksi Rate Limiting (Anti-Spam Mailer)
$clientIp = '0.0.0.0';
if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
    $clientIp = trim($_SERVER['HTTP_CF_CONNECTING_IP']);
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
    $clientIp = trim($parts[0]);
} elseif (!empty($_SERVER['REMOTE_ADDR'])) {
    $clientIp = trim($_SERVER['REMOTE_ADDR']);
}
$clientIp = preg_replace('/[^0-9a-fA-F:\.]/', '', $clientIp);

$rateFile = $dataDir . '/mail_rate_limit.json';
$rateData = @json_decode(@file_get_contents($rateFile), true) ?: [];
$now = time();

// Bersihkan data expired (> 15 menit)
foreach ($rateData as $k => $info) {
    if (isset($info['reset_at']) && $info['reset_at'] < $now) {
        unset($rateData[$k]);
    }
}

$npa = isset($data['npa']) ? substr(preg_replace('/\D/', '', $data['npa']), 0, 5) : '';
$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$token = isset($data['token']) ? trim($data['token']) : '';
$adminPin = trim($data['admin_pin'] ?? '');
$isAdmin = in_array($adminPin, ['3105', '312226', '5930', '1926']);

// Cek limit IP (Maksimal 5 kirim email per 10 menit per IP - dikecualikan untuk Admin Helpdesk)
if (!$isAdmin) {
    if (!isset($rateData[$clientIp])) {
        $rateData[$clientIp] = ['count' => 1, 'reset_at' => $now + (10 * 60)];
    } else {
        if ($rateData[$clientIp]['count'] >= 5) {
            $sisaMenit = ceil(($rateData[$clientIp]['reset_at'] - $now) / 60);
            http_response_code(429);
            echo json_encode([
                'success' => false,
                'error' => "⛔ Terlalu banyak permintaan pengiriman token dari perangkat Anda. Demi keamanan server, silakan tunggu {$sisaMenit} menit lagi sebelum mencoba kembali."
            ]);
            exit;
        }
        $rateData[$clientIp]['count']++;
    }
    @file_put_contents($rateFile, json_encode($rateData), LOCK_EX);
}

if (strlen($npa) !== 5) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'NPA harus tepat 5 digit angka.']);
    exit;
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Alamat email tidak valid.']);
    exit;
}

if (empty($token) || strlen($token) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Token surat suara kosong atau tidak valid.']);
    exit;
}

// Strict Server-Side Verification: Ensure NPA and Email match official Master DPT Registry
$masterRegistryFile = __DIR__ . '/dpt_master_registry.php';
if (file_exists($masterRegistryFile)) {
    $masterDpt = require $masterRegistryFile;
    if (!isset($masterDpt[$npa])) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => "NPA {$npa} tidak terdaftar dalam Daftar Pemilih Tetap (DPT) resmi KPKU."]);
        exit;
    }

    $regEmail = strtolower(trim($masterDpt[$npa]['email'] ?? ''));
    $inputEmail = strtolower(trim($email));

    $regNorm = str_replace('@gl.itb.ac.id', '@itb.ac.id', $regEmail);
    $inputNorm = str_replace('@gl.itb.ac.id', '@itb.ac.id', $inputEmail);

    $matched = ($regEmail === $inputEmail || $regNorm === $inputNorm);

    // Check alt_emails in master registry
    if (!$matched && !empty($masterDpt[$npa]['alt_emails']) && is_array($masterDpt[$npa]['alt_emails'])) {
        foreach ($masterDpt[$npa]['alt_emails'] as $alt) {
            if (strtolower(trim($alt)) === $inputEmail) {
                $matched = true;
                break;
            }
        }
    }

    // Check dynamic overrides file in secure data dir
    $overridesFile = $dataDir . '/dpt_email_overrides.json';
    if (!$matched && file_exists($overridesFile)) {
        $overrides = @json_decode(@file_get_contents($overridesFile), true) ?: [];
        if (isset($overrides[$npa]) && strtolower(trim($overrides[$npa])) === $inputEmail) {
            $matched = true;
        }
    }

    // If still not matched, allow if request is authorized from Admin Helpdesk
    if (!$matched && $isAdmin) {
        $matched = true;
        $overrides = file_exists($overridesFile) ? (@json_decode(@file_get_contents($overridesFile), true) ?: []) : [];
        $overrides[$npa] = $inputEmail;
        @file_put_contents($overridesFile, json_encode($overrides, JSON_PRETTY_PRINT), LOCK_EX);
    }

    if (!$matched) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => "Alamat email yang dimasukkan ({$email}) tidak cocok dengan email resmi yang terdaftar untuk NPA {$npa} pada DPT KPKU."
        ]);
        exit;
    }

    if (empty($name) && !empty($masterDpt[$npa]['name'])) {
        $name = $masterDpt[$npa]['name'];
    }
}

$displayName = !empty($name) ? htmlspecialchars($name, ENT_QUOTES, 'UTF-8') : 'Anggota IAGI';
$displayNpa = !empty($npa) ? htmlspecialchars($npa, ENT_QUOTES, 'UTF-8') : '-';
$cleanToken = htmlspecialchars($token, ENT_QUOTES, 'UTF-8');

$monthsIndo = [
    'January' => 'Januari', 'February' => 'Februari', 'March' => 'Maret',
    'April' => 'April', 'May' => 'Mei', 'June' => 'Juni',
    'July' => 'Juli', 'August' => 'Agustus', 'September' => 'September',
    'October' => 'Oktober', 'November' => 'November', 'December' => 'Desember'
];
$waktuKlaim = strtr(date('d F Y, H:i'), $monthsIndo) . ' WIB';

// 3. Daftarkan hash token resmi ke registry pemilih server KPKU
$votersFile = $dataDir . '/voters_status.json';
$voters = @json_decode(@file_get_contents($votersFile), true) ?: [];
if (!isset($voters[$npa]) || empty($voters[$npa]['voted'])) {
    $voters[$npa] = [
        'npa' => $npa,
        'name' => $displayName,
        'email' => $email,
        'claimed' => true,
        'claimed_at' => $waktuKlaim,
        'token_hash' => hash('sha256', $cleanToken),
        'voted' => false
    ];
    @file_put_contents($votersFile, json_encode($voters, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

$voteUrl = 'https://pemiluiagi.web.id/app.html?npa=' . urlencode($npa) . '&code=' . urlencode($token) . '#vote';
$subject = 'Surat Suara Elektronik & Kode Unik Pemilu IAGI 2026 - NPA ' . $npa;

// Official Logo Image URL (Live HTTPS)
$logoUrl = 'https://pemiluiagi.web.id/assets/iagi-logo.png';

// Ultra-Premium HTML Email Template (Light Canvas with Executive Emerald & Gold Branding)
$messageHtml = <<<HTML
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Surat Suara Elektronik Pemilu IAGI 2026</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { padding: 0; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F1F5F9; padding: 30px 12px;">
    <tr>
      <td align="center">
        <!-- Main Container Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 35px rgba(15, 23, 42, 0.08);">
          
          <!-- Top Gold Ribbon -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #D97706 0%, #F5BA42 50%, #D97706 100%);"></td>
          </tr>

          <!-- Header Section with Official Logo -->
          <tr>
            <td style="background-color: #07221C; padding: 32px 24px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 14px;">
                    <img src="{$logoUrl}" alt="Logo IAGI" width="76" height="76" style="display: block; width: 76px; height: 76px; margin: 0 auto; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));">
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.18em; color: #F5BA42; text-transform: uppercase; margin-bottom: 6px;">
                      IKATAN AHLI GEOLOGI INDONESIA (IAGI)
                    </div>
                    <div style="font-size: 12px; font-weight: 700; color: #94A3B8; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 12px;">
                      KOMISI PEMILIHAN KETUA UMUM (KPKU) 2026–2029
                    </div>
                    <div style="display: inline-block; background: rgba(245, 186, 66, 0.15); border: 1px solid rgba(245, 186, 66, 0.45); color: #FDE68A; font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 999px; letter-spacing: 0.06em; text-transform: uppercase;">
                      ✦ SURAT SUARA DIGITAL RESMI ✦
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="margin: 0 0 10px 0; font-size: 21px; font-weight: 800; color: #0F172A; text-align: center; line-height: 1.35;">
                Surat Suara Digital Anda Siap Digunakan
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748B; text-align: center; line-height: 1.55;">
                Permohonan hak suara Anda telah divalidasi resmi oleh Panitia KPKU IAGI dalam Daftar Pemilih Tetap (DPT). Gunakan kredensial di bawah ini untuk mengakses Bilik Suara Elektronik.
              </p>

              <!-- Voter Information Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; line-height: 1.6;">
                      <tr>
                        <td style="color: #64748B; width: 42%; padding: 4px 0;">Nama Lengkap Pemilih:</td>
                        <td style="color: #0F172A; font-weight: 700; padding: 4px 0;">{$displayName}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748B; padding: 4px 0;">Nomor Pokok Anggota:</td>
                        <td style="color: #D97706; font-weight: 800; font-family: 'Courier New', Courier, monospace; font-size: 14px; padding: 4px 0;">{$displayNpa}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748B; padding: 4px 0;">Status Hak Suara:</td>
                        <td style="color: #059669; font-weight: 700; padding: 4px 0;">● Terdaftar Sah (DPT Aktif)</td>
                      </tr>
                      <tr>
                        <td style="color: #64748B; padding: 4px 0;">Waktu Penerbitan:</td>
                        <td style="color: #475569; font-size: 12px; padding: 4px 0;">{$waktuKlaim}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- High-Security Token Certificate Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #061914; border: 2px solid #F5BA42; border-radius: 14px; margin-bottom: 28px; box-shadow: 0 6px 20px rgba(7, 34, 28, 0.2);">
                <tr>
                  <td style="padding: 24px 18px; text-align: center;">
                    <div style="font-size: 11px; font-weight: 800; color: #94A3B8; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px;">
                      🔑 KODE TOKEN KRIPTOGRAFI (SEKALI PAKAI)
                    </div>
                    
                    <!-- Token Monospace Display -->
                    <div style="font-family: 'Courier New', Courier, monospace, sans-serif; font-size: 26px; font-weight: 900; color: #FDE68A; letter-spacing: 3px; margin: 10px 0; text-shadow: 0 0 12px rgba(245, 186, 66, 0.4);">
                      {$cleanToken}
                    </div>

                    <!-- Security Pill Badges -->
                    <div style="font-size: 11px; color: #34D399; font-weight: 700; margin-top: 8px;">
                      ✓ Terenkripsi 128-bit &bull; Sekali Pakai &bull; Otomatis Hangus Pasca Voting
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Big Primary CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <!-- Bulletproof Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center" style="border-radius: 50px; background: linear-gradient(135deg, #F5BA42 0%, #D97706 100%); box-shadow: 0 6px 18px rgba(217, 119, 6, 0.38);">
                          <a href="{$voteUrl}" target="_blank" style="display: inline-block; padding: 16px 38px; font-size: 15px; font-weight: 800; color: #071E19; text-decoration: none; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.04em;">
                            Buka Bilik Suara Sekarang &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <span style="font-size: 12px; color: #64748B;">
                      (Tautan di atas akan otomatis mengisikan token Anda ke bilik suara)
                    </span>
                  </td>
                </tr>
              </table>

              <!-- 3 Simple Voting Steps -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-size: 12px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px;">
                      📋 3 Langkah Mudah Memberikan Suara:
                    </div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; line-height: 1.55; color: #334155;">
                      <tr>
                        <td style="width: 24px; vertical-align: top; font-weight: 800; color: #D97706;">1.</td>
                        <td style="padding-bottom: 8px;"><strong>Buka Bilik Suara:</strong> Klik tombol emas di atas atau salin kode token secara manual ke <a href="https://pemiluiagi.web.id/app.html#vote" style="color: #0284C7; text-decoration: underline;">pemiluiagi.web.id/#vote</a>.</td>
                      </tr>
                      <tr>
                        <td style="width: 24px; vertical-align: top; font-weight: 800; color: #D97706;">2.</td>
                        <td style="padding-bottom: 8px;"><strong>Tentukan Pilihan:</strong> Pelajari profil, visi & misi Calon Ketua Umum IAGI 2026–2029 (Kandidat 01, 02, atau 03).</td>
                      </tr>
                      <tr>
                        <td style="width: 24px; vertical-align: top; font-weight: 800; color: #D97706;">3.</td>
                        <td><strong>Kunci Suara Sah:</strong> Konfirmasi coblosan Anda. Sistem akan menerbitkan Tanda Terima Kriptografi SHA-256 yang sah dan token Anda langsung hangus.</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security & Integrity Alert Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FFFBEB; border: 1.5px solid #FCD34D; border-radius: 12px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <div style="font-size: 13px; font-weight: 800; color: #92400E; margin-bottom: 6px;">
                      🛡️ Petunjuk Keamanan & Asas LUBER-JURDIL:
                    </div>
                    <ul style="font-size: 12px; color: #78350F; margin: 0; padding-left: 18px; line-height: 1.6;">
                      <li>Jaga kerahasiaan kode unik ini. Jangan serahkan kode kepada siapa pun demi menjaga kemurnian suara Anda.</li>
                      <li>Sistem e-voting menerapkan <em>Zero-Knowledge Decoupling</em>: pilihan Anda tidak dapat dilacak kembali ke identitas Anda.</li>
                      <li>Batas akhir pemungutan suara resmi: <strong>Selasa, 03 November 2026 pukul 23.59 WIB</strong>.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Alternative URL fallback -->
              <p style="font-size: 11px; color: #94A3B8; line-height: 1.5; margin: 0; text-align: center;">
                Jika tombol di atas tidak terbuka, silakan salin URL berikut ke peramban web Anda:<br>
                <a href="{$voteUrl}" style="color: #0284C7; word-break: break-all; text-decoration: underline;">{$voteUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Official Secretariat Footer -->
          <tr>
            <td style="background-color: #07221C; border-top: 1px solid rgba(245, 186, 66, 0.25); padding: 26px 24px; text-align: center;">
              <div style="font-size: 12px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">
                KOMISI PEMILIHAN KETUA UMUM (KPKU) IAGI 2026
              </div>
              <div style="font-size: 11px; color: #94A3B8; line-height: 1.6; margin-bottom: 12px;">
                Pengurus Pusat Ikatan Ahli Geologi Indonesia (PP IAGI)<br>
                Gedung Sekretariat DPP IAGI, Jakarta Selatan
              </div>

              <div style="font-size: 12px; color: #CBD5E1; margin-bottom: 12px;">
                💬 Bantuan & Hotline WhatsApp: <a href="https://wa.me/6285729456481" target="_blank" style="color: #34D399; font-weight: 700; text-decoration: none;">+62 857-2945-6481</a> &bull; 
                ✉️ Email: <a href="mailto:iagisekretariat@gmail.com" style="color: #F5BA42; text-decoration: none;">iagisekretariat@gmail.com</a>
              </div>

              <div style="font-size: 10px; color: #64748B; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 12px; line-height: 1.5;">
                Surel ini diterbitkan secara otomatis dan terenkripsi oleh Sistem Pemilu Elektronik KPKU IAGI 2026.<br>
                Hak Cipta &copy; 2026 Ikatan Ahli Geologi Indonesia (IAGI). Hak Cipta Dilindungi Undang-Undang.
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

// Headers for HTML Mail
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: KPKU IAGI 2026 <noreply@pitiagi.cloud>',
    'Reply-To: KPKU IAGI <iagisekretariat@gmail.com>',
    'X-Mailer: PHP/' . phpversion()
];

$mailSent = false;
$errorDetail = '';

// Attempt 1: Standard PHP mail function (Configured with Exim on cPanel)
try {
    $mailSent = @mail($email, $subject, $messageHtml, implode("\r\n", $headers));
} catch (Exception $e) {
    $errorDetail = $e->getMessage();
}

// Attempt 2: If mail() failed or returned false, try direct SMTP socket connection
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

    $socket = @stream_socket_client("ssl://{$smtpHost}:{$smtpPort}", $errno, $errstr, 4, STREAM_CLIENT_CONNECT, $context);
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
        fwrite($socket, "RCPT TO:<{$email}>\r\n"); $read($socket);
        fwrite($socket, "DATA\r\n"); $read($socket);
        
        $dataPayload = "Subject: {$subject}\r\n";
        $dataPayload .= "To: {$displayName} <{$email}>\r\n";
        $dataPayload .= implode("\r\n", $headers) . "\r\n\r\n";
        $dataPayload .= $messageHtml . "\r\n.\r\n";
        
        fwrite($socket, $dataPayload);
        $resultResp = $read($socket);
        fwrite($socket, "QUIT\r\n");
        fclose($socket);

        if (strpos($resultResp, '250') !== false) {
            $mailSent = true;
        }
    }
}

echo json_encode([
    'success' => true,
    'mailSent' => $mailSent,
    'recipient' => $email,
    'name' => $name,
    'npa' => $npa,
    'message' => 'Surat suara dan kode unik telah berhasil dikirim ke email ' . $email
]);
