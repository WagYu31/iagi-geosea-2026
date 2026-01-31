<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submission Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    
    @php
        // Status configuration with colors, icons, and messages
        $statusConfig = [
            'accepted' => [
                'color' => '#28a745',
                'icon' => '✅',
                'message' => 'Congratulations! Your paper has been accepted!'
            ],
            'rejected' => [
                'color' => '#dc3545',
                'icon' => '❌',
                'message' => 'We regret to inform you that your paper was not accepted.'
            ],
            'revision_required_phase1' => [
                'color' => '#ff9800',
                'icon' => '📝',
                'message' => 'Your paper requires revisions (Phase 1).'
            ],
            'revision_required_phase2' => [
                'color' => '#ff9800',
                'icon' => '📝',
                'message' => 'Your paper requires revisions (Phase 2).'
            ],
            'under_review' => [
                'color' => '#2196f3',
                'icon' => '🔍',
                'message' => 'Your paper is now under review.'
            ],
            'pending' => [
                'color' => '#ffc107',
                'icon' => '⏳',
                'message' => 'Your paper status has been updated to pending.'
            ],
        ];
        
        $config = $statusConfig[$newStatus] ?? [
            'color' => '#6c757d',
            'icon' => 'ℹ️',
            'message' => 'Your submission status has been updated.'
        ];
    @endphp
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">PIT IAGI-GEOSEA 2026</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Submission Status Update</p>
    </div>
    
    <!-- Body -->
    <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <p style="font-size: 16px; margin-bottom: 10px;">Dear <strong>{{ $authorName }}</strong>,</p>
        
        <p style="font-size: 15px; line-height: 1.8; margin-bottom: 20px;">We would like to inform you that the status of your paper submission has been updated.</p>
        
        <!-- Status Change Alert -->
        <div style="background: {{ $config['color'] }}; color: white; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <h2 style="margin: 0; font-size: 22px; font-weight: 600;">{{ $config['icon'] }} {{ $config['message'] }}</h2>
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
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Previous Status:</td>
                    <td style="padding: 10px 0; color: #999;">
                        <span style="text-decoration: line-through;">{{ ucfirst(str_replace('_', ' ', $oldStatus)) }}</span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">New Status:</td>
                    <td style="padding: 10px 0;">
                        <span style="background: {{ $config['color'] }}; padding: 6px 14px; border-radius: 12px; color: white; font-weight: 600; font-size: 13px; display: inline-block;">
                            {{ ucfirst(str_replace('_', ' ', $newStatus)) }}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Updated Date:</td>
                    <td style="padding: 10px 0; color: #333;">{{ now()->format('d F Y, H:i') }} WIB</td>
                </tr>
            </table>
        </div>
        
        <!-- Next Steps - Dynamic per Status -->
        <div style="background: #e7f6f4; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #0d7a6a; margin-top: 0; margin-bottom: 15px; font-size: 18px;">✅ Next Steps</h3>
            
            @if($newStatus === 'accepted')
                <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8; color: #333;">
                    <li style="margin-bottom: 8px;">Congratulations on your paper acceptance!</li>
                    <li style="margin-bottom: 8px;">Prepare your final manuscript following the conference guidelines</li>
                    <li style="margin-bottom: 8px;">Complete your conference registration and payment if not done yet</li>
                    <li style="margin-bottom: 8px;">Upload the camera-ready version of your paper by the deadline</li>
                    <li style="margin-bottom: 8px;">Start preparing your presentation materials for the conference</li>
                </ul>
            @elseif($newStatus === 'rejected')
                <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8; color: #333;">
                    <li style="margin-bottom: 8px;">Thank you for your submission to our conference</li>
                    <li style="margin-bottom: 8px;">We encourage you to review the feedback from our reviewers</li>
                    <li style="margin-bottom: 8px;">Consider making improvements for future submissions to other venues</li>
                    <li style="margin-bottom: 8px;">Please contact us if you have any questions about this decision</li>
                </ul>
            @elseif(str_contains($newStatus, 'revision_required'))
                <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8; color: #333;">
                    <li style="margin-bottom: 8px;">Please review the detailed comments from our reviewers in your submission portal</li>
                    <li style="margin-bottom: 8px;">Make the necessary revisions to address all reviewer concerns</li>
                    <li style="margin-bottom: 8px;">Prepare a response document explaining how you addressed each comment</li>
                    <li style="margin-bottom: 8px;">Resubmit your revised paper through the submission portal by the deadline</li>
                    <li style="margin-bottom: 8px;">Contact us if you need clarification on any reviewer comments</li>
                </ul>
            @elseif($newStatus === 'under_review')
                <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8; color: #333;">
                    <li style="margin-bottom: 8px;">Your paper is currently being evaluated by our scientific committee</li>
                    <li style="margin-bottom: 8px;">The review process typically takes 2-4 weeks depending on reviewer availability</li>
                    <li style="margin-bottom: 8px;">You will receive email notification when the review is completed</li>
                    <li style="margin-bottom: 8px;">No action is required from you at this time</li>
                    <li style="margin-bottom: 8px;">Thank you for your patience during the review process</li>
                </ul>
            @else
                <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8; color: #333;">
                    <li style="margin-bottom: 8px;">You will receive further updates about your submission via email</li>
                    <li style="margin-bottom: 8px;">Please check your submission portal regularly for any updates</li>
                    <li style="margin-bottom: 8px;">Contact our organizing committee if you have any questions</li>
                </ul>
            @endif
        </div>
        
        <!-- Important Note -->
        @if($newStatus === 'accepted' || str_contains($newStatus, 'revision_required'))
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ff9800;">
                <p style="margin: 0; color: #663c00; font-size: 14px;">
                    <strong>📌 Important:</strong> 
                    @if($newStatus === 'accepted')
                        Please ensure you complete all registration requirements and submit your camera-ready paper before the deadline to be included in the conference proceedings.
                    @else
                        Please submit your revisions by the specified deadline to ensure your paper can be reconsidered for acceptance.
                    @endif
                </p>
            </div>
        @endif
        
        <p style="font-size: 15px; margin-top: 25px; line-height: 1.8;">If you have any questions about this status change or need assistance, please don't hesitate to contact our organizing committee.</p>
        
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
