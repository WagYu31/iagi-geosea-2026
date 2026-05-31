import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Box, Typography, Container, Paper, useTheme, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PrivacyPolicy() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const sectionStyle = { mb: 3 };
    const titleStyle = { fontWeight: 800, fontSize: '1.1rem', color: isDark ? '#f3f4f6' : '#1f2937', mb: 1.5, fontFamily: 'Inter, sans-serif' };
    const textStyle = { fontSize: '0.88rem', color: isDark ? '#d1d5db' : '#4b5563', lineHeight: 1.9, fontFamily: 'Inter, sans-serif' };

    return (
        <>
            <Head title="Privacy Policy - PIT IAGI-GEOSEA 2026" />
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
                            Privacy Policy
                        </Typography>
                        <Typography sx={{ fontSize: '0.82rem', color: isDark ? '#6b7280' : '#94a3b8', mb: 4, fontFamily: 'Inter, sans-serif' }}>
                            Last updated: June 1, 2026
                        </Typography>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>1. Information We Collect</Typography>
                            <Typography sx={textStyle}>
                                When you register for the 55th PIT IAGI & GEOSEA XIX 2026 conference and submit your paper, we collect the following information:
                            </Typography>
                            <Box component="ul" sx={{ ...textStyle, pl: 3, mt: 1 }}>
                                <li>Full name and academic title</li>
                                <li>Email address</li>
                                <li>Phone/WhatsApp number</li>
                                <li>Institutional affiliation</li>
                                <li>Paper/abstract submission details</li>
                                <li>Participant category (Professional, International, Student)</li>
                                <li>Payment transaction data (processed securely by Midtrans)</li>
                            </Box>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>2. How We Use Your Information</Typography>
                            <Typography sx={textStyle}>
                                Your personal information is used exclusively for:
                            </Typography>
                            <Box component="ul" sx={{ ...textStyle, pl: 3, mt: 1 }}>
                                <li>Processing your conference registration and paper submission</li>
                                <li>Processing payment transactions via our payment gateway (Midtrans)</li>
                                <li>Sending payment confirmation receipts and conference-related communications</li>
                                <li>Generating participation certificates</li>
                                <li>Conference administration and participant management</li>
                            </Box>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>3. Payment Data Security</Typography>
                            <Typography sx={textStyle}>
                                All payment transactions are processed through <strong>Midtrans</strong>, a PCI-DSS Level 1 certified payment gateway. 
                                We do not store your credit card numbers, bank account details, or any sensitive payment credentials on our servers. 
                                All payment data is encrypted using 256-bit SSL encryption and transmitted directly to Midtrans' secure servers. 
                                3D Secure (3DS) authentication is enabled for all credit card transactions.
                            </Typography>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>4. Data Sharing</Typography>
                            <Typography sx={textStyle}>
                                We do not sell, trade, or rent your personal information to third parties. Your data may only be shared with:
                            </Typography>
                            <Box component="ul" sx={{ ...textStyle, pl: 3, mt: 1 }}>
                                <li><strong>Midtrans</strong> — for payment processing only</li>
                                <li><strong>IAGI (Ikatan Ahli Geologi Indonesia)</strong> — for conference administration purposes</li>
                                <li><strong>Conference reviewers</strong> — limited to submitted paper content for peer review</li>
                            </Box>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>5. Data Retention</Typography>
                            <Typography sx={textStyle}>
                                Your personal data will be retained for the duration necessary to fulfill the purposes outlined in this policy, 
                                including conference administration, certificate issuance, and compliance with legal obligations. 
                                Payment transaction records are retained for a minimum of 5 years as required by applicable financial regulations.
                            </Typography>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>6. Your Rights</Typography>
                            <Typography sx={textStyle}>
                                You have the right to access, correct, or request deletion of your personal data. 
                                To exercise these rights, please contact our organizing committee at the email address provided below.
                            </Typography>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>7. Contact Us</Typography>
                            <Typography sx={textStyle}>
                                If you have any questions about this Privacy Policy, please contact us at:<br />
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
