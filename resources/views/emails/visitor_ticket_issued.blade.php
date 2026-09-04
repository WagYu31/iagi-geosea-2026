<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conference E-Ticket PIT IAGI-GEOSEA 2026</title>
</head>
<body style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f1f5f9;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #094d42 0%, #0d695c 50%, #10b981 100%); padding: 35px 30px; text-align: center; border-radius: 16px 16px 0 0; box-shadow: 0 4px 15px rgba(9,77,66,0.2);">
        <div style="display: inline-block; background: rgba(255,255,255,0.18); padding: 6px 16px; border-radius: 20px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.25);">
            <span style="color: #6ee7b7; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
                🎫 OFFICIAL VISITOR E-TICKET
            </span>
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.02em;">
            55th PIT IAGI & GEOSEA XIX 2026
        </h1>
        <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0 0; font-size: 13px; font-weight: 500;">
            International Geosciences Conference & Exhibition
        </p>
    </div>
    
    <!-- Body -->
    <div style="background: #ffffff; padding: 35px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; border-top: none;">
        
        <!-- Greeting -->
        <p style="font-size: 16px; margin-top: 0; margin-bottom: 8px;">
            Hello <strong>{{ $ticket->visitor_name }}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.7; color: #475569; margin-bottom: 25px;">
            Congratulations! Your visitor ticket registration for <strong>55th PIT IAGI & GEOSEA XIX 2026</strong> is <strong>SUCCESSFUL & ACTIVE</strong>. Below are your official Digital E-Ticket details:
        </p>
        
        <!-- 3D Ticket Box -->
        <div style="background: #f8fafc; border: 2px dashed #094d42; border-radius: 14px; padding: 25px; margin-bottom: 25px; text-align: center;">
            <div style="margin-bottom: 15px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data={{ urlencode($ticket->ticket_code) }}" alt="Ticket QR Code" style="width: 150px; height: 150px; border-radius: 10px; border: 1px solid #cbd5e1; padding: 8px; background: #ffffff; display: inline-block;">
            </div>

            <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">YOUR TICKET CODE</div>
            <div style="font-family: 'Courier New', monospace; font-size: 24px; font-weight: 900; color: #094d42; letter-spacing: 2px;">
                {{ $ticket->ticket_code }}
            </div>

            <div style="margin-top: 12px;">
                <span style="display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 800; {{ $ticket->visitor_type === 'exclusive' ? 'background: #fef3c7; color: #92400e; border: 1px solid #fde68a;' : 'background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0;' }}">
                    {{ $ticket->visitor_type === 'exclusive' ? '⭐ EXCLUSIVE VIP VISITOR' : '🎟️ NON-EXCLUSIVE VISITOR' }}
                </span>
            </div>
        </div>

        <!-- Details Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 700; width: 140px;">Visitor Name</td>
                <td style="padding: 10px 0; color: #0f172a; font-weight: 700;">{{ $ticket->visitor_name }}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 700;">Registered Email</td>
                <td style="padding: 10px 0; color: #0f172a;">{{ $ticket->visitor_email }}</td>
            </tr>
            @if($ticket->visitor_phone)
            <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 700;">WhatsApp / Phone</td>
                <td style="padding: 10px 0; color: #0f172a;">{{ $ticket->visitor_phone }}</td>
            </tr>
            @endif
            @if($ticket->visitor_institution)
            <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 700;">Institution / Org</td>
                <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">{{ $ticket->visitor_institution }}</td>
            </tr>
            @endif
            <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 700;">Ticket Status</td>
                <td style="padding: 10px 0; color: #15803d; font-weight: 800;">ACTIVE (Ready to Use)</td>
            </tr>
        </table>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ route('visitor.ticket.show', ['ticket_code' => $ticket->ticket_code]) }}" style="display: inline-block; background: linear-gradient(180deg, #094d42 0%, #064036 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 12px; font-weight: 900; font-size: 15px; box-shadow: 0 4px 12px rgba(9,77,66,0.3);">
                📱 Open Digital E-Ticket & Lanyard Badge
            </a>
        </div>

        <!-- Instructions -->
        <div style="background: #f8fafc; border-left: 4px solid #094d42; padding: 15px 18px; border-radius: 0 8px 8px 0; margin-bottom: 25px;">
            <p style="margin: 0 0 6px 0; font-weight: 800; font-size: 13px; color: #0f172a;">
                📌 Event Day Instructions:
            </p>
            <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #475569; line-height: 1.6;">
                <li>Present the QR Code on your E-Ticket link above to the staff at the venue scanner gate.</li>
                <li>Staff will scan your QR Code and print your official conference Lanyard ID Card at the registration desk.</li>
                <li>Save this email or download your E-Ticket in PDF/Image format on your mobile device.</li>
            </ul>
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8;">
            <p style="margin: 0 0 5px 0;">
                Need help? Contact the committee at: <a href="mailto:admin@iagi-geosea2026.com" style="color: #094d42; font-weight: 700; text-decoration: none;">admin@iagi-geosea2026.com</a>
            </p>
            <p style="margin: 0;">&copy; 2026 Organizing Committee 55th PIT IAGI & GEOSEA XIX 2026. All rights reserved.</p>
        </div>

    </div>

</body>
</html>
