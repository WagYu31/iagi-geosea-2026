<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pemberitahuan Status Pembayaran Tiket PIT IAGI-GEOSEA 2026</title>
</head>
<body style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f1f5f9;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%); padding: 35px 30px; text-align: center; border-radius: 16px 16px 0 0; box-shadow: 0 4px 15px rgba(239,68,68,0.2);">
        <div style="display: inline-block; background: rgba(255,255,255,0.18); padding: 6px 16px; border-radius: 20px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.25);">
            <span style="color: #fee2e2; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
                ⚠️ STATUS PEMBAYARAN
            </span>
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.02em;">
            55th PIT IAGI & GEOSEA XIX 2026
        </h1>
        <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0 0; font-size: 13px; font-weight: 500;">
            Pemberitahuan Verifikasi Tiket Penonton
        </p>
    </div>
    
    <!-- Body -->
    <div style="background: #ffffff; padding: 35px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; border-top: none;">
        
        <!-- Greeting -->
        <p style="font-size: 16px; margin-top: 0; margin-bottom: 8px;">
            Halo <strong>Bapak/Ibu Pendaftar</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.7; color: #475569; margin-bottom: 25px;">
            Mohon maaf, bukti pembayaran yang Anda unggah untuk transaksi <strong>{{ $payment->payment_code }}</strong> belum dapat kami setujui dengan catatan sebagai berikut:
        </p>
        
        <!-- Rejection Reason Box -->
        <div style="background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 0 10px 10px 0; padding: 18px 20px; margin-bottom: 25px;">
            <div style="font-size: 11px; font-weight: 800; color: #991b1b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">ALASAN / CATATAN PANITIA:</div>
            <div style="font-size: 14px; font-weight: 700; color: #b91c1c; line-height: 1.6;">
                {{ $notes ?: 'Bukti transfer tidak valid atau nominal pembayaran tidak sesuai.' }}
            </div>
        </div>

        <p style="font-size: 13px; color: #475569; line-height: 1.7; margin-bottom: 25px;">
            Silakan lakukan pendaftaran ulang dengan mengunggah bukti transfer yang jelas dan sesuai, atau hubungi tim sekretariat panitia untuk bantuan lebih lanjut.
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 25px 0;">
            <a href="{{ route('visitor.register') }}" style="display: inline-block; background: linear-gradient(180deg, #094d42 0%, #064036 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 900; font-size: 14px; box-shadow: 0 4px 12px rgba(9,77,66,0.3);">
                🔄 Daftar Ulang Tiket Penonton
            </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8; margin-top: 25px;">
            <p style="margin: 0 0 5px 0;">
                Bantuan Panitia: <a href="mailto:admin@iagi-geosea2026.com" style="color: #ef4444; font-weight: 700; text-decoration: none;">admin@iagi-geosea2026.com</a>
            </p>
            <p style="margin: 0;">&copy; 2026 Panitia Pelaksana 55th PIT IAGI & GEOSEA XIX 2026. All rights reserved.</p>
        </div>

    </div>

</body>
</html>
