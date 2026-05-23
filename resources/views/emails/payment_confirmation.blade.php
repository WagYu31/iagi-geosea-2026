<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation</title>
</head>
<body style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f4f8;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%); padding: 35px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <div style="display: inline-block; background: rgba(255,255,255,0.12); padding: 6px 16px; border-radius: 20px; margin-bottom: 15px;">
            <span style="color: #6ee7b7; font-size: 12px; font-weight: bold; letter-spacing: 1px;">✓ PAYMENT SUCCESSFUL</span>
        </div>
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800;">PIT IAGI-GEOSEA 2026</h1>
        <p style="color: rgba(255,255,255,0.75); margin: 8px 0 0 0; font-size: 14px;">Payment Confirmation Receipt</p>
    </div>
    
    <!-- Body -->
    <div style="background: #ffffff; padding: 35px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
        
        <!-- Success Badge -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #ecfdf5, #d1fae5); line-height: 64px; font-size: 28px;">
                ✅
            </div>
        </div>

        <p style="font-size: 16px; margin-bottom: 5px;">Dear <strong>{{ $payment->user->name ?? 'Participant' }}</strong>,</p>
        
        <p style="font-size: 15px; line-height: 1.8; color: #4b5563;">
            Thank you for your payment! Your conference registration fee for <strong>PIT IAGI-GEOSEA 2026</strong> has been successfully processed and confirmed.
        </p>
        
        <!-- Payment Receipt -->
        <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #e2e8f0;">
            <h3 style="color: #064e3b; margin-top: 0; margin-bottom: 18px; font-size: 16px; border-bottom: 2px solid #d1fae5; padding-bottom: 10px;">
                🧾 Payment Receipt
            </h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; font-weight: 600; width: 160px; color: #6b7280; font-size: 14px; vertical-align: top;">Order ID</td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 14px;">
                        <code style="background: #f1f5f9; padding: 3px 8px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 13px;">{{ $payment->order_id }}</code>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #6b7280; font-size: 14px; vertical-align: top;">Paper Title</td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 14px;">{{ $payment->submission->title ?? '—' }}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #6b7280; font-size: 14px;">Category</td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 14px;">
                        @php
                            $catMap = [
                                'professional' => 'Professional & IAGI Member',
                                'international' => 'International Delegate',
                                'student' => 'Student',
                            ];
                            $catKey = strtolower($payment->submission->participant_category ?? '');
                            $catLabel = $catMap[$catKey] ?? ($payment->submission->participant_category ?? '—');
                        @endphp
                        {{ $catLabel }}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #6b7280; font-size: 14px;">Payment Method</td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 14px;">
                        @php
                            $methodMap = [
                                'bank_transfer' => 'Bank Transfer',
                                'echannel' => 'Mandiri Bill',
                                'credit_card' => 'Credit Card',
                                'gopay' => 'GoPay',
                                'shopeepay' => 'ShopeePay',
                                'qris' => 'QRIS',
                                'cstore' => 'Convenience Store',
                            ];
                            $methodLabel = $methodMap[$payment->payment_type ?? ''] ?? ucfirst(str_replace('_', ' ', $payment->payment_type ?? 'Midtrans'));
                        @endphp
                        {{ $methodLabel }}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #6b7280; font-size: 14px;">Payment Date</td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 14px;">
                        {{ $payment->paid_at ? \Carbon\Carbon::parse($payment->paid_at)->format('d F Y, H:i') : now()->format('d F Y, H:i') }} WIB
                    </td>
                </tr>
            </table>

            <!-- Total Amount -->
            <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); padding: 18px 20px; border-radius: 8px; margin-top: 15px; border: 1px solid #a7f3d0;">
                <table style="width: 100%;">
                    <tr>
                        <td style="font-weight: bold; font-size: 15px; color: #064e3b;">Total Paid</td>
                        <td style="text-align: right; font-weight: 900; font-size: 22px; color: #047857; font-family: Arial, sans-serif;">
                            Rp {{ number_format($payment->amount, 0, ',', '.') }}
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Status Badge -->
            <div style="text-align: center; margin-top: 18px;">
                <span style="display: inline-block; background: #dcfce7; color: #166534; padding: 6px 20px; border-radius: 20px; font-weight: 700; font-size: 13px; letter-spacing: 0.5px; border: 1px solid #bbf7d0;">
                    ✓ PAYMENT VERIFIED
                </span>
            </div>
        </div>

        <!-- What's Next -->
        <div style="background: #eff6ff; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 12px; font-size: 16px;">📌 What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px; line-height: 2; color: #374151; font-size: 14px;">
                <li>Your registration is now <strong>confirmed</strong></li>
                <li>Continue tracking your paper submission status in the dashboard</li>
                <li>Conference materials and schedules will be sent closer to the event date</li>
                <li>Save this email as your payment receipt</li>
            </ul>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0 25px;">
            <a href="{{ url('/payments') }}" style="display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 14px 36px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(5,150,105,0.25);">
                View Payment Dashboard →
            </a>
        </div>

        <p style="font-size: 14px; margin-top: 25px; line-height: 1.8; color: #6b7280;">
            If you have any questions or need assistance, please don't hesitate to contact our organizing committee.
        </p>
        
        <p style="margin-top: 25px; font-size: 15px;">
            Best regards,<br>
            <strong style="color: #064e3b;">PIT IAGI-GEOSEA 2026 Organizing Committee</strong>
        </p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; margin-top: 15px;">
        <p style="margin: 5px 0;">This is an automated payment confirmation. Please do not reply to this email.</p>
        <p style="margin: 5px 0;">Keep this email as your official payment receipt.</p>
        <p style="margin: 8px 0; color: #d1d5db;">© 2026 PIT IAGI-GEOSEA. All rights reserved.</p>
    </div>
    
</body>
</html>
