import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Box, Typography, Container, Paper, useTheme, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function RefundPolicy() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const sectionStyle = { mb: 3 };
    const titleStyle = { fontWeight: 800, fontSize: '1.1rem', color: isDark ? '#f3f4f6' : '#1f2937', mb: 1.5, fontFamily: 'Inter, sans-serif' };
    const textStyle = { fontSize: '0.88rem', color: isDark ? '#d1d5db' : '#4b5563', lineHeight: 1.9, fontFamily: 'Inter, sans-serif' };

    return (
        <>
            <Head title="Refund Policy - PIT IAGI-GEOSEA 2026" />
            <Box sx={{ minHeight: '100vh', bgcolor: isDark ? '#0f172a' : '#f8fafc', py: 6 }}>
                <Container maxWidth="md">
                    <Button
                        component={Link}
                        href="/"
                        startIcon={<ArrowBackIcon />}
                        sx={{ mb: 3, color: isDark ? '#9ca3af' : '#64748b', textTransform: 'none', fontWeight: 600 }}
                    >
                        Back to Home
                    </Button>

                    <Paper elevation={0} sx={{
                        p: { xs: 3, md: 5 }, borderRadius: '16px',
                        bgcolor: isDark ? '#1e293b' : 'white',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
                    }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: isDark ? '#f3f4f6' : '#064e3b', mb: 1, fontFamily: 'Inter, sans-serif' }}>
                            Refund Policy
                        </Typography>
                        <Typography sx={{ fontSize: '0.82rem', color: isDark ? '#6b7280' : '#94a3b8', mb: 4, fontFamily: 'Inter, sans-serif' }}>
                            Last updated: June 1, 2026
                        </Typography>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>1. Refund Eligibility</Typography>
                            <Typography sx={textStyle}>
                                Refund requests for conference registration fees are subject to the following conditions:
                            </Typography>
                            <Box component="ul" sx={{ ...textStyle, pl: 3, mt: 1 }}>
                                <li><strong>More than 30 days before the conference:</strong> Full refund minus administrative fees (10% of the registration fee)</li>
                                <li><strong>15–30 days before the conference:</strong> 50% refund of the registration fee</li>
                                <li><strong>Less than 15 days before the conference:</strong> No refund</li>
                            </Box>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>2. How to Request a Refund</Typography>
                            <Typography sx={textStyle}>
                                To request a refund, please send an email to <strong>committee@iagi-geosea2026.com</strong> with the following information:
                            </Typography>
                            <Box component="ul" sx={{ ...textStyle, pl: 3, mt: 1 }}>
                                <li>Your full name as registered</li>
                                <li>Registered email address</li>
                                <li>Payment Order ID (shown in your payment receipt)</li>
                                <li>Reason for refund request</li>
                                <li>Bank account details for refund transfer (account name, bank name, account number)</li>
                            </Box>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>3. Processing Time</Typography>
                            <Typography sx={textStyle}>
                                Approved refund requests will be processed within <strong>14 business days</strong> from the date of approval. 
                                Refunds will be transferred to the bank account provided by the registrant. 
                                Please note that bank transfer processing times may vary depending on your bank.
                            </Typography>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>4. Non-Refundable Items</Typography>
                            <Typography sx={textStyle}>
                                The following are non-refundable:
                            </Typography>
                            <Box component="ul" sx={{ ...textStyle, pl: 3, mt: 1 }}>
                                <li>Payment gateway transaction fees charged by Midtrans</li>
                                <li>Administrative processing fees</li>
                                <li>Registrations where the participant has already attended any conference session</li>
                            </Box>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>5. Conference Cancellation</Typography>
                            <Typography sx={textStyle}>
                                In the event that the conference is cancelled by the organizing committee due to force majeure or unforeseen circumstances, 
                                all registered participants will receive a full refund of their registration fees. 
                                The organizing committee will notify all registered participants via email.
                            </Typography>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>6. Substitution</Typography>
                            <Typography sx={textStyle}>
                                If you are unable to attend, you may transfer your registration to a substitute participant 
                                by notifying the organizing committee at least 7 days before the conference. 
                                The substitute must meet the same registration category requirements. No additional fee is required for substitution.
                            </Typography>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>7. Contact</Typography>
                            <Typography sx={textStyle}>
                                For refund inquiries, please contact:<br />
                                <strong>Email:</strong> committee@iagi-geosea2026.com<br />
                                <strong>Organization:</strong> 55th PIT IAGI & GEOSEA XIX 2026 Organizing Committee
                            </Typography>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
}
