<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verified</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">55<sup>TH</sup> PIT IAGI-GEOSEA XIX 2026</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Account Verification</p>
    </div>
    
    <!-- Body -->
    <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <p style="font-size: 16px; margin-bottom: 10px;">Dear <strong>{{ $user->name }}</strong>,</p>
        
        <p style="font-size: 15px; line-height: 1.8; margin-bottom: 20px;">We are pleased to inform you that your account has been successfully verified by our admin team.</p>
        
        <!-- Verification Alert -->
        <div style="background: #28a745; color: white; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <h2 style="margin: 0; font-size: 22px; font-weight: 600;">✅ Your Account is Now Verified!</h2>
        </div>
        
        <!-- Account Details -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #1abc9c;">
            <h3 style="color: #0d7a6a; margin-top: 0; margin-bottom: 15px; font-size: 18px;">👤 Account Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; width: 150px; color: #555;">Name:</td>
                    <td style="padding: 10px 0; color: #333;">{{ $user->name }}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Email:</td>
                    <td style="padding: 10px 0; color: #333;">{{ $user->email }}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Status:</td>
                    <td style="padding: 10px 0;">
                        <span style="background: #28a745; padding: 6px 14px; border-radius: 12px; color: white; font-weight: 600; font-size: 13px; display: inline-block;">
                            ✓ Verified
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Verified Date:</td>
                    <td style="padding: 10px 0; color: #333;">{{ now()->format('d F Y, H:i') }} WIB</td>
                </tr>
            </table>
        </div>
        
        <!-- Next Steps -->
        <div style="background: #e7f6f4; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #0d7a6a; margin-top: 0; margin-bottom: 15px; font-size: 18px;">🚀 What You Can Do Now</h3>
            <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8; color: #333;">
                <li style="margin-bottom: 8px;">Access the <strong>My Submissions</strong> page to submit your paper</li>
                <li style="margin-bottom: 8px;">Submit your abstract and/or full paper for the conference</li>
                <li style="margin-bottom: 8px;">Track the status of your submissions</li>
                <li style="margin-bottom: 8px;">Manage your payments and registration</li>
            </ul>
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
        <p style="margin: 5px 0; color: #999;">© 2026 55<sup>TH</sup> PIT IAGI-GEOSEA XIX. All rights reserved.</p>
    </div>
    
</body>
</html>
