<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode Verifikasi Login Admin (OTP)</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 580px; margin: 0 auto; padding: 24px 12px; background-color: #f1f5f9;">
    
    <!-- Top Conference Header -->
    <div style="background: linear-gradient(135deg, #064e3b 0%, #0d9488 50%, #10b981 100%); padding: 32px 24px; text-align: center; border-radius: 16px 16px 0 0; box-shadow: 0 4px 20px rgba(13, 148, 136, 0.2);">
        <p style="color: #6ee7b7; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 6px 0;">ANNUAL SCIENTIFIC CONVENTION</p>
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">55<sup>TH</sup> PIT IAGI · GEOSEA XIX 2026</h1>
        <p style="color: rgba(255, 255, 255, 0.85); margin: 6px 0 0 0; font-size: 14px;">Portal Keamanan Akun Admin</p>
    </div>
    
    <!-- Main Card Body -->
    <div style="background: #ffffff; padding: 32px 28px; border-radius: 0 0 16px 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0; border-top: none;">
        
        <p style="font-size: 16px; margin: 0 0 12px 0; color: #0f172a;">Halo, <strong>{{ $user->name }}</strong> 👋</p>
        
        <p style="font-size: 14.5px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
            Kami menerima permintaan verifikasi masuk (Two-Factor Authentication) untuk akun Administrator Anda. Gunakan kode OTP berikut untuk menyelesaikan proses masuk:
        </p>
        
        <!-- Big OTP Display Box -->
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px dashed #10b981; border-radius: 14px; padding: 24px 16px; text-align: center; margin: 24px 0;">
            <p style="font-size: 12px; font-weight: 700; color: #065f46; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 8px 0;">KODE VERIFIKASI RESMI</p>
            <div style="font-size: 34px; font-weight: 900; letter-spacing: 0.35em; color: #065f46; font-family: 'Courier New', Courier, monospace; padding-left: 0.35em;">
                {{ $otp }}
            </div>
            <p style="font-size: 12.5px; color: #047857; margin: 10px 0 0 0; font-weight: 600;">
                ⏱️ Berlaku selama 5 menit
            </p>
        </div>
        
        <!-- Security Caution Box -->
        <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 8px; margin: 24px 0;">
            <p style="font-size: 13px; color: #92400e; margin: 0; line-height: 1.5;">
                <strong>⚠️ Peringatan Keamanan:</strong> Jangan berikan kode OTP ini kepada siapa pun, termasuk panitia. Jika Anda tidak merasa mencoba login, segera hubungi tim IT Super Admin dan amankan kata sandi Anda.
            </p>
        </div>

        <!-- Details Info -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; color: #64748b;">
            <tr>
                <td style="padding: 6px 0; width: 130px;">Waktu Permintaan:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">{{ now()->timezone('Asia/Jakarta')->format('d M Y, H:i:s') }} WIB</td>
            </tr>
            <tr>
                <td style="padding: 6px 0;">Email Tujuan:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">{{ $user->email }}</td>
            </tr>
        </table>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 26px 0 18px 0;">
        
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0; line-height: 1.5;">
            Email ini dikirimkan secara otomatis oleh Sistem Portal PIT IAGI-GEOSEA 2026.<br>
            © {{ date('Y') }} 55th PIT IAGI - GEOSEA XIX. All rights reserved.
        </p>
    </div>

</body>
</html>
