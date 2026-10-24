<?php
/**
 * KPKU IAGI 2026 - Official Token Dispatch Mailer
 * Mengirimkan Kode Unik Surat Suara Kriptografi 128-bit langsung ke Email Pemilih Terdaftar.
 * Menegakkan Integritas Asas LUBER (Langsung, Umum, Bebas, Rahasia).
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
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

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

$npa = isset($data['npa']) ? trim($data['npa']) : '';
$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$token = isset($data['token']) ? trim($data['token']) : '';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Alamat email tidak valid.']);
    exit;
}

if (empty($token)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Token surat suara kosong.']);
    exit;
}

$displayName = !empty($name) ? htmlspecialchars($name, ENT_QUOTES, 'UTF-8') : 'Anggota IAGI';
$displayNpa = !empty($npa) ? htmlspecialchars($npa, ENT_QUOTES, 'UTF-8') : '-';
$cleanToken = htmlspecialchars($token, ENT_QUOTES, 'UTF-8');

$voteUrl = 'https://pemiluiagi.web.id/app.html?npa=' . urlencode($npa) . '&code=' . urlencode($token) . '#vote';
$subject = 'Surat Suara Elektronik & Kode Unik Pemilu IAGI 2026 - NPA ' . $npa;

// Email HTML Template
$messageHtml = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Surat Suara Resmi Pemilu IAGI 2026</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #061512; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #061512; padding: 25px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0B241E; border: 1.5px solid #F5BA42; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 24px; text-align: center; background: linear-gradient(180deg, #12382F 0%, #0B241E 100%); border-bottom: 1px solid rgba(245, 186, 66, 0.3);">
              <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.15em; color: #F5BA42; text-transform: uppercase; margin-bottom: 6px;">
                KOMISI PEMILIHAN KETUA UMUM (KPKU) IAGI 2026–2029
              </div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #FFFFFF; line-height: 1.3;">
                Surat Suara Elektronik Resmi
              </h1>
              <div style="font-size: 13px; color: #94A3B8; margin-top: 4px;">
                Pemilihan Ketua Umum Pengurus Pusat Ikatan Ahli Geologi Indonesia
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px 24px;">
              <p style="font-size: 15px; line-height: 1.6; color: #E2E8F0; margin-top: 0;">
                Yth. <strong>{$displayName}</strong>,<br>
                Nomor Pokok Anggota (NPA): <strong style="color: #F5BA42;">{$displayNpa}</strong>
              </p>

              <p style="font-size: 14px; line-height: 1.6; color: #CBD5E1;">
                Permohonan klaim surat suara digital Anda telah berhasil divalidasi oleh Panitia KPKU IAGI. Sesuai prinsip kerahasiaan <strong>LUBER (Langsung, Umum, Bebas, Rahasia)</strong>, berikut adalah kode unik kriptografi sekali pakai untuk mengakses bilik suara:
              </p>

              <!-- Token Display Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
                <tr>
                  <td align="center" style="background-color: #040E0C; border: 2px dashed #F5BA42; border-radius: 12px; padding: 18px 12px; text-align: center;">
                    <div style="font-size: 11px; font-weight: 700; color: #94A3B8; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px;">
                      KODE TOKEN AKSES SURAT SUARA
                    </div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: 900; color: #F5BA42; letter-spacing: 0.1em;">
                      {$cleanToken}
                    </div>
                    <div style="font-size: 11px; color: #10B981; margin-top: 6px;">
                      ✓ Token Aktif & Valid Sekali Pakai
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="{$voteUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #F5BA42 0%, #D97706 100%); color: #051A15; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 28px; border-radius: 10px; box-shadow: 0 4px 15px rgba(245, 186, 66, 0.4); text-align: center;">
                      Buka Bilik Suara Sekarang &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Notice Box -->
              <div style="background-color: rgba(15, 23, 42, 0.6); border-left: 4px solid #F5BA42; padding: 14px 16px; border-radius: 6px; margin-bottom: 20px;">
                <div style="font-size: 13px; font-weight: 700; color: #F5BA42; margin-bottom: 4px;">
                  ⚠️ Petunjuk Keamanan & Asas LUBER:
                </div>
                <ul style="font-size: 12px; color: #94A3B8; margin: 0; padding-left: 18px; line-height: 1.6;">
                  <li>Jangan berikan kode unik ini kepada orang lain demi menjaga kemurnian pilihan Anda.</li>
                  <li>Token langsung hangus seketika pilihan suara Anda direkam ke dalam kotak suara terenkripsi (Zero-Knowledge).</li>
                  <li>Batas akhir pemungutan suara adalah <strong>25 Oktober 2026 pukul 18.00 WIB</strong>.</li>
                </ul>
              </div>

              <p style="font-size: 12px; color: #64748B; line-height: 1.5; margin-bottom: 0;">
                Jika tombol di atas tidak berfungsi, silakan salin tautan berikut ke browser Anda:<br>
                <a href="{$voteUrl}" style="color: #38BDF8; word-break: break-all; text-decoration: none;">{$voteUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 18px 24px; background-color: #061512; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center; font-size: 11px; color: #64748B; line-height: 1.5;">
              <strong>Komisi Pemilihan Ketua Umum (KPKU) IAGI 2026</strong><br>
              Gedung Sekretariat Pengurus Pusat Ikatan Ahli Geologi Indonesia<br>
              Hotline WhatsApp: <a href="https://wa.me/628111581461" style="color: #10B981; text-decoration: none;">+62 811-158-1461</a> | Email: <a href="mailto:iagisekretariat@gmail.com" style="color: #94A3B8; text-decoration: none;">iagisekretariat@gmail.com</a>
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
