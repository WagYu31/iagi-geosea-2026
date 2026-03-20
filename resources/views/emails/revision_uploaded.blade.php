<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revision Uploaded</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">PIT IAGI-GEOSEA 2026</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">📝 Revision Uploaded Notification</p>
    </div>
    
    <!-- Body -->
    <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <p style="font-size: 16px; margin-bottom: 10px;">Dear <strong>{{ $reviewerName }}</strong>,</p>
        
        <p style="font-size: 15px; line-height: 1.8; margin-bottom: 20px;">
            A participant has uploaded a revised file for a submission assigned to you. Please review the updated submission at your earliest convenience.
        </p>
        
        <!-- Alert -->
        <div style="background: #2196f3; color: white; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 600;">📄 {{ $phase === 'phase1' ? 'Phase 1' : 'Phase 2' }} Revision Submitted</h2>
        </div>
        
        <!-- Submission Details -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #1abc9c;">
            <h3 style="color: #0d7a6a; margin-top: 0; margin-bottom: 15px; font-size: 18px;">📋 Submission Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; width: 180px; color: #555;">Submission Code:</td>
                    <td style="padding: 10px 0; color: #333;">{{ $submission->submission_code }}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Paper Title:</td>
                    <td style="padding: 10px 0; color: #333;">{{ $submission->title }}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Author:</td>
                    <td style="padding: 10px 0; color: #333;">{{ $authorName }}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Revision Phase:</td>
                    <td style="padding: 10px 0;">
                        <span style="background: #ff9800; padding: 6px 14px; border-radius: 12px; color: white; font-weight: 600; font-size: 13px; display: inline-block;">
                            {{ $phase === 'phase1' ? 'Phase 1' : 'Phase 2' }}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Uploaded Date:</td>
                    <td style="padding: 10px 0; color: #333;">{{ now()->format('d F Y, H:i') }} WIB</td>
                </tr>
            </table>
        </div>
        
        <!-- Next Steps -->
        <div style="background: #e7f6f4; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #0d7a6a; margin-top: 0; margin-bottom: 15px; font-size: 18px;">✅ Action Required</h3>
            <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8; color: #333;">
                <li style="margin-bottom: 8px;">Log in to the reviewer panel to review the updated submission</li>
                <li style="margin-bottom: 8px;">Compare the revisions with your previous review comments</li>
                <li style="margin-bottom: 8px;">Provide your updated review and recommendation</li>
                <li style="margin-bottom: 8px;">Submit your review at your earliest convenience</li>
            </ul>
        </div>
        
        <!-- Important Note -->
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ff9800;">
            <p style="margin: 0; color: #663c00; font-size: 14px;">
                <strong>📌 Important:</strong> 
                The submission status has been automatically updated to "Under Review". Please complete your review in a timely manner.
            </p>
        </div>
        
        <p style="font-size: 15px; margin-top: 25px; line-height: 1.8;">If you have any questions, please contact the organizing committee.</p>
        
        <p style="margin-top: 30px; font-size: 15px;">
            Best regards,<br>
            <strong style="color: #0d7a6a;">PIT IAGI-GEOSEA 2026 Organizing Committee</strong>
        </p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; margin-top: 20px;">
        <p style="margin: 5px 0;">This is an automated message. Please do not reply to this email.</p>
        <p style="margin: 5px 0; color: #999;">© 2026 PIT IAGI-GEOSEA. All rights reserved.</p>
    </div>
    
</body>
</html>
