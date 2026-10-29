<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Official E-Tiket Konferensi 55th PIT IAGI & GEOSEA XIX 2026 - [{{ $ticket->ticket_code }}]</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; line-height: 1.6; color: #1e293b;">

    <!-- Preheader preview text for mail clients (invisible in body) -->
    <div style="display: none; font-size: 1px; color: #f1f5f9; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        Official E-Tiket & QR Code Masuk 55th PIT IAGI & GEOSEA XIX 2026. Kode: {{ $ticket->ticket_code }} ({{ $ticket->category_label }}). Tunjukkan QR Code ini pada Scanner Gate venue.
    </div>

    <!-- Main Container -->
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 25px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">
                    
                    <!-- Top Gold Gradient Accent Line -->
                    <tr>
                        <td style="height: 5px; background: linear-gradient(90deg, #b45309 0%, #f59e0b 50%, #d97706 100%); font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>

                    <!-- Executive Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #022c22 0%, #064e3b 55%, #094d42 100%); padding: 36px 30px 32px; text-align: center;">
                            <!-- Pill Badge -->
                            <div style="display: inline-block; background: rgba(255, 255, 255, 0.12); padding: 5px 16px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.22); margin-bottom: 14px;">
                                <span style="color: #6ee7b7; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
                                    ✨ OFFICIAL CONVENTION E-CREDENTIAL
                                </span>
                            </div>
                            <!-- Title -->
                            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.02em; line-height: 1.3;">
                                55th PIT IAGI &amp; GEOSEA XIX 2026
                            </h1>
                            <p style="color: rgba(255, 255, 255, 0.85); margin: 6px 0 0 0; font-size: 13px; font-weight: 500; letter-spacing: 0.2px;">
                                Annual Convention &amp; Exhibition of Indonesian Association of Geologists
                            </p>
                        </td>
                    </tr>

                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 32px 28px 25px;">
                            
                            <!-- Salutation -->
                            <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">
                                Dear {{ $ticket->visitor_name }},
                            </h2>
                            <p style="font-size: 14px; line-height: 1.7; color: #475569; margin: 0 0 24px 0;">
                                Selamat! Pendaftaran Anda untuk konferensi internasional <strong>55th PIT IAGI &amp; GEOSEA XIX 2026</strong> telah <strong>TERVERIFIKASI &amp; AKTIF</strong>. Di bawah ini adalah kartu akses digital dan QR Code resmi Anda untuk memasuki venue dan mencetak ID Card konferensi.
                            </p>

                            <!-- THE OFFICIAL PASS CARD (Executive Design) -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 14px; overflow: hidden; margin-bottom: 26px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);">
                                
                                <!-- Pass Header Bar -->
                                <tr>
                                    <td style="background-color: #064e3b; padding: 12px 20px;">
                                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="left" style="color: #ffffff; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                                                    🎟️ OFFICIAL VISITOR PASS
                                                </td>
                                                <td align="right">
                                                    <span style="display: inline-block; background-color: #ecfdf5; color: #065f46; font-size: 11px; font-weight: 900; padding: 3px 12px; border-radius: 12px; border: 1px solid #a7f3d0; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        {{ $ticket->category_label }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Pass QR Code Section -->
                                <tr>
                                    <td align="center" style="padding: 24px 20px 18px; text-align: center;">
                                        
                                        <!-- QR Code Framed Container -->
                                        <div style="background-color: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); margin-bottom: 14px;">
                                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={{ urlencode($ticket->ticket_code) }}&margin=2" 
                                                 alt="Official QR Code - {{ $ticket->ticket_code }}" 
                                                 width="170" 
                                                 height="170" 
                                                 style="display: block; width: 170px; height: 170px; border-radius: 8px;">
                                        </div>

                                        <!-- Scan Helper Text -->
                                        <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">
                                            [ Pindai pada Scanner Gate di Meja Registrasi ]
                                        </p>

                                        <!-- Ticket Code Display -->
                                        <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 18px; display: inline-block; margin-bottom: 12px;">
                                            <div style="font-size: 10px; font-weight: 800; color: #64748b; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 2px;">
                                                KODE TIKET RESMI
                                            </div>
                                            <div style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: 900; color: #094d42; letter-spacing: 2px; line-height: 1.2;">
                                                {{ $ticket->ticket_code }}
                                            </div>
                                        </div>

                                        <!-- Status Badge -->
                                        <div>
                                            <span style="display: inline-block; background-color: #dcfce7; color: #15803d; font-size: 11px; font-weight: 800; padding: 4px 14px; border-radius: 20px; border: 1px solid #86efac; letter-spacing: 0.5px;">
                                                ● TERVERIFIKASI AKTIF (READY TO USE)
                                            </span>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Tear-off Perforated Line -->
                                <tr>
                                    <td style="padding: 0 20px;">
                                        <div style="border-top: 1.5px dashed #cbd5e1; height: 1px; font-size: 0; line-height: 0;">&nbsp;</div>
                                    </td>
                                </tr>

                                <!-- Pass Attendee Details Grid -->
                                <tr>
                                    <td style="padding: 18px 24px 22px;">
                                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px;">
                                            <tr>
                                                <td width="50%" valign="top" style="padding-bottom: 12px; padding-right: 10px;">
                                                    <span style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px;">Nama Peserta / Name</span>
                                                    <strong style="color: #0f172a; font-size: 14px;">{{ $ticket->visitor_name }}</strong>
                                                </td>
                                                <td width="50%" valign="top" style="padding-bottom: 12px; padding-left: 10px;">
                                                    <span style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px;">Kategori / Category</span>
                                                    <strong style="color: #094d42; font-size: 13px;">{{ $ticket->category_label }}</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="50%" valign="top" style="padding-bottom: 12px; padding-right: 10px;">
                                                    <span style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px;">Instansi / Organization</span>
                                                    <span style="color: #1e293b; font-size: 13px; font-weight: 600;">{{ $ticket->visitor_institution ?: '—' }}</span>
                                                </td>
                                                <td width="50%" valign="top" style="padding-bottom: 12px; padding-left: 10px;">
                                                    <span style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px;">Tanggal / Dates</span>
                                                    <span style="color: #1e293b; font-size: 13px; font-weight: 600;">{{ $eventDate ?? '3 - 5 November 2026' }}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="50%" valign="top" style="padding-right: 10px;">
                                                    <span style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px;">Email Terdaftar</span>
                                                    <span style="color: #1e293b; font-size: 12px;">{{ $ticket->visitor_email }}</span>
                                                </td>
                                                <td width="50%" valign="top" style="padding-left: 10px;">
                                                    <span style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px;">Lokasi / Venue</span>
                                                    <span style="color: #1e293b; font-size: 12px; font-weight: 600;">{{ $eventVenue ?? 'Royal Ambarrukmo Yogyakarta' }}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                            </table>

                            <!-- Primary CTA Button -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 25px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ route('visitor.ticket.show', ['ticket_code' => $ticket->ticket_code]) }}" 
                                           target="_blank"
                                           style="display: inline-block; background: linear-gradient(135deg, #094d42 0%, #064e3b 50%, #022c22 100%); color: #ffffff; text-decoration: none; padding: 15px 36px; border-radius: 12px; font-weight: 900; font-size: 15px; box-shadow: 0 6px 18px rgba(9, 77, 66, 0.3); letter-spacing: 0.2px;">
                                            📱 Buka E-Tiket &amp; ID Card Lanyard
                                        </a>
                                        <div style="font-size: 11px; color: #64748b; margin-top: 8px;">
                                            Tautan langsung untuk membuka barcode digital dan mengunduh kartu tanda peserta
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Check-in Protocol / Event Day Instructions -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-left: 4px solid #094d42; border-radius: 0 10px 10px 0; margin-bottom: 25px; border: 1px solid #e2e8f0; border-left: 4px solid #094d42;">
                                <tr>
                                    <td style="padding: 18px 20px;">
                                        <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
                                            📌 Panduan Penting Registrasi di Venue (Event Day)
                                        </h3>
                                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 12px; color: #475569; line-height: 1.6;">
                                            <tr>
                                                <td valign="top" width="22" style="padding-bottom: 8px; font-weight: 800; color: #094d42;">1.</td>
                                                <td style="padding-bottom: 8px;">
                                                    <strong>Tunjukkan QR Code:</strong> Buka email ini atau simpan tangkapan layar (screenshot) QR Code pada smartphone Anda saat tiba di lokasi konferensi.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td valign="top" width="22" style="padding-bottom: 8px; font-weight: 800; color: #094d42;">2.</td>
                                                <td style="padding-bottom: 8px;">
                                                    <strong>Pemindaian Cepat di Fast-Track Gate:</strong> Petugas registrasi akan memindai QR Code untuk verifikasi instan tanpa perlu mengisi formulir ulang.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td valign="top" width="22" style="font-weight: 800; color: #094d42;">3.</td>
                                                <td>
                                                    <strong>Pencetakan ID Card Lanyard Resmi:</strong> Setelah dipindai, ID Card Lanyard dan Conference Kit Anda akan langsung diserahkan di registration desk.
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Need Help / Secretariat Contact -->
                            <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px 18px; text-align: center; margin-bottom: 10px;">
                                <span style="font-size: 12px; color: #1e40af; font-weight: 600;">
                                    Butuh bantuan atau pertanyaan pendaftaran? Hubungi panitia di: 
                                    <a href="mailto:admin@iagi-geosea2026.com" style="color: #094d42; font-weight: 800; text-decoration: underline;">admin@iagi-geosea2026.com</a>
                                </span>
                            </div>

                        </td>
                    </tr>

                    <!-- Executive Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 22px 30px; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.6;">
                            <p style="margin: 0 0 4px 0; font-weight: 700; color: #64748b;">
                                Organizing Committee 55th PIT IAGI &amp; GEOSEA XIX 2026
                            </p>
                            <p style="margin: 0 0 8px 0;">
                                Ikatan Ahli Geologi Indonesia (IAGI) &bull; Gedung Mineral &amp; Batubara, Jakarta, Indonesia
                            </p>
                            <p style="margin: 0; font-size: 10px; color: #94a3b8;">
                                &copy; 2026 Organizing Committee 55th PIT IAGI &amp; GEOSEA XIX 2026. All rights reserved.<br>
                                Email ini dikirimkan secara otomatis oleh sistem registrasi resmi. Harap simpan email ini sebagai bukti sah kepesertaan Anda.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
