<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">55<sup>TH</sup> PIT IAGI-GEOSEA XIX 2026</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Account Status Update</p>
    </div>
    
    <!-- Body -->
    <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <p style="font-size: 16px; margin-bottom: 10px;">Dear <strong>{{ $user->full_name ?? $user->name }}</strong>,</p>
        
        <p style="font-size: 15px; line-height: 1.8; margin-bottom: 20px;">We would like to inform you that your account verification status has been updated by our admin team.</p>
        
        <!-- Status Alert -->
        <div style="background: #dc3545; color: white; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <h2 style="margin: 0; font-size: 22px; font-weight: 600;">⚠️ Account Verification Revoked</h2>
        </div>
        
        <!-- Account Details -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #dc3545;">
            <h3 style="color: #721c24; margin-top: 0; margin-bottom: 15px; font-size: 18px;">👤 Account Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; width: 150px; color: #555;">Name:</td>
                    <td style="padding: 10px 0; color: #333;">{{ $user->full_name ?? $user->name }}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Email:</td>
                    <td style="padding: 10px 0; color: #333;">{{ $user->email }}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Status:</td>
                    <td style="padding: 10px 0;">
                        <span style="background: #dc3545; padding: 6px 14px; border-radius: 12px; color: white; font-weight: 600; font-size: 13px; display: inline-block;">
                            ✗ Unverified
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Updated:</td>
                    <td style="padding: 10px 0; color: #333;">{{ now()->format('d F Y, H:i') }} WIB</td>
                </tr>
            </table>
        </div>
        
        <!-- Info Notice -->
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0; margin-bottom: 10px; font-size: 16px;">ℹ️ What does this mean?</h3>
            <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                Your account access has been temporarily restricted. You may not be able to submit papers or access certain features until your account is re-verified. If you believe this is an error, please contact our organizing committee.
            </p>
        </div>
        
        <p style="font-size: 15px; margin-top: 25px; line-height: 1.8;">If you have any questions or need assistance, please don't hesitate to contact our organizing committee.</p>
        
        <p style="margin-top: 30px; font-size: 15px;">
            Best regards,<br>
            <strong style="color: #0d7a6a;">55<sup>TH</sup> PIT IAGI-GEOSEA XIX 2026 Organizing Committee</strong>
        </p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; margin-top: 20px;">
        <p style="margin: 5px 0;">This is an automated message. Please do not reply to this email.</p>
        <p style="margin: 5px 0; color: #999;">&copy; 2026 55<sup>TH</sup> PIT IAGI-GEOSEA XIX. All rights reserved.</p>
    </div>
    
</body>
</html>
