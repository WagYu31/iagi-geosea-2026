<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Awaiting Verification - PIT IAGI-GEOSEA 2026 Ticket Payment</title>
</head>
<body style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f1f5f9;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%); padding: 35px 30px; text-align: center; border-radius: 16px 16px 0 0; box-shadow: 0 4px 15px rgba(217,119,6,0.2);">
        <div style="display: inline-block; background: rgba(255,255,255,0.18); padding: 6px 16px; border-radius: 20px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.25);">
            <span style="color: #fef3c7; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
                ⏳ AWAITING VERIFICATION
            </span>
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.02em;">
            55th PIT IAGI & GEOSEA XIX 2026
        </h1>
        <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0 0; font-size: 13px; font-weight: 500;">
            Visitor Exclusive VIP Registration
        </p>
    </div>
    
    <!-- Body -->
    <div style="background: #ffffff; padding: 35px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; border-top: none;">
        
        <!-- Greeting -->
        <p style="font-size: 16px; margin-top: 0; margin-bottom: 8px;">
            Hello <strong>Registrant</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.7; color: #475569; margin-bottom: 25px;">
            Thank you for registering as a <strong>Visitor Exclusive VIP</strong> for <strong>55th PIT IAGI & GEOSEA XIX 2026</strong>. Your payment proof has been received and is currently being verified by the conference treasury team.
        </p>
        
        <!-- Payment Details Box -->
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 14px; padding: 20px; margin-bottom: 25px;">
            <div style="font-size: 11px; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">TRANSACTION CODE</div>
            <div style="font-family: 'Courier New', monospace; font-size: 20px; font-weight: 900; color: #b45309; letter-spacing: 1.5px; margin-bottom: 12px;">
                {{ $payment->payment_code }}
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr style="border-top: 1px dashed #fde68a;">
                    <td style="padding: 8px 0; color: #78350f; font-weight: 700;">Total Tickets:</td>
                    <td style="padding: 8px 0; color: #78350f; font-weight: 800; text-align: right;">{{ $payment->total_members }} Ticket(s)</td>
                </tr>
                <tr style="border-top: 1px dashed #fde68a;">
                    <td style="padding: 8px 0; color: #78350f; font-weight: 700;">Total Payment:</td>
                    <td style="padding: 8px 0; color: #b45309; font-weight: 900; font-size: 16px; text-align: right;">Rp {{ number_format($payment->total_amount, 0, ',', '.') }}</td>
                </tr>
                <tr style="border-top: 1px dashed #fde68a;">
                    <td style="padding: 8px 0; color: #78350f; font-weight: 700;">Current Status:</td>
                    <td style="padding: 8px 0; color: #d97706; font-weight: 900; text-align: right;">AWAITING VERIFICATION</td>
                </tr>
            </table>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ route('visitor.payment.status', ['payment_code' => $payment->payment_code]) }}" style="display: inline-block; background: linear-gradient(180deg, #d97706 0%, #b45309 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 12px; font-weight: 900; font-size: 15px; box-shadow: 0 4px 12px rgba(217,119,6,0.3);">
                🔍 Check Payment & Ticket Status
            </a>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
            Once the payment is approved by the committee, our system will automatically send the <strong>official E-Ticket and QR Code</strong> to each registered participant's email address.
        </p>

        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8; margin-top: 25px;">
            <p style="margin: 0 0 5px 0;">
                Have questions regarding payment? Contact the committee: <a href="mailto:admin@iagi-geosea2026.com" style="color: #d97706; font-weight: 700; text-decoration: none;">admin@iagi-geosea2026.com</a>
            </p>
            <p style="margin: 0;">&copy; 2026 Organizing Committee 55th PIT IAGI & GEOSEA XIX 2026. All rights reserved.</p>
        </div>

    </div>

</body>
</html>
