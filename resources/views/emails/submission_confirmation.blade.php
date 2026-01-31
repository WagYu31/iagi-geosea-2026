<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submission Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">PIT IAGI-GEOSEA 2026</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Paper Submission Confirmation</p>
    </div>
    
    <!-- Body -->
    <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <p style="font-size: 16px; margin-bottom: 10px;">Dear <strong>{{ $authorName }}</strong>,</p>
        
        <p style="font-size: 15px; line-height: 1.8;">Thank you for submitting your paper to the <strong>PIT IAGI-GEOSEA 2026 Conference</strong>. We have successfully received your submission and it is now under review.</p>
        
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
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Submission Date:</td>
                    <td style="padding: 10px 0; color: #333;">{{ $submission->created_at->format('d F Y, H:i') }} WIB</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Current Status:</td>
                    <td style="padding: 10px 0;">
                        <span style="background: #fff3cd; padding: 6px 14px; border-radius: 12px; color: #856404; font-weight: 600; font-size: 13px; display: inline-block;">
                            Pending Review
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Presentation Type:</td>
                    <td style="padding: 10px 0; color: #333;">{{ $submission->category_submission }}</td>
                </tr>
            </table>
        </div>
        
        <!-- Next Steps -->
        <div style="background: #e7f6f4; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #0d7a6a; margin-top: 0; margin-bottom: 15px; font-size: 18px;">✅ Next Steps</h3>
            <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8; color: #333;">
                <li style="margin-bottom: 8px;">Your paper will be carefully reviewed by our scientific committee</li>
                <li style="margin-bottom: 8px;">You will receive email notifications about any status changes or updates</li>
                <li style="margin-bottom: 8px;">The review process typically takes 2-4 weeks</li>
                <li style="margin-bottom: 8px;">Please ensure your registration payment is completed if not done yet</li>
            </ul>
        </div>
        
        <!-- Important Note -->
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ff9800;">
            <p style="margin: 0; color: #663c00; font-size: 14px;">
                <strong>📌 Important:</strong> Please keep this submission code (<strong>{{ $submission->submission_code }}</strong>) for your records. You will need it for future reference and communication.
            </p>
        </div>
        
        <p style="font-size: 15px; margin-top: 25px; line-height: 1.8;">If you have any questions or need assistance, please don't hesitate to contact our organizing committee.</p>
        
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
