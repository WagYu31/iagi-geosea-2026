import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Box, Typography, Container, Paper, useTheme, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function TermsAndConditions() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const sectionStyle = { mb: 3 };
    const titleStyle = { fontWeight: 800, fontSize: '1.1rem', color: isDark ? '#f3f4f6' : '#1f2937', mb: 1.5, fontFamily: 'Inter, sans-serif' };
    const textStyle = { fontSize: '0.88rem', color: isDark ? '#d1d5db' : '#4b5563', lineHeight: 1.9, fontFamily: 'Inter, sans-serif' };

    return (
        <>
            <Head title="Terms and Conditions - PIT IAGI-GEOSEA 2026" />
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
                            Terms and Conditions
                        </Typography>
                        <Typography sx={{ fontSize: '0.82rem', color: isDark ? '#6b7280' : '#94a3b8', mb: 4, fontFamily: 'Inter, sans-serif' }}>
                            Last updated: June 1, 2026
                        </Typography>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>1. General</Typography>
                            <Typography sx={textStyle}>
                                By registering for the 55th PIT IAGI & GEOSEA XIX 2026 conference and using this platform, 
                                you agree to be bound by these Terms and Conditions. This platform is operated by the 
                                PIT IAGI-GEOSEA 2026 Organizing Committee under IAGI (Ikatan Ahli Geologi Indonesia).
                            </Typography>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>2. Registration & Payment</Typography>
                            <Typography sx={textStyle}>
                                Conference registration requires submission of an abstract/paper and payment of the applicable registration fee. 
                                Registration fees vary by participant category:
                            </Typography>
                            <Box component="ul" sx={{ ...textStyle, pl: 3, mt: 1 }}>
                                <li><strong>Professional & IAGI Member</strong> — As listed on the registration page</li>
                                <li><strong>Profesional and Non-IAGI member</strong> — As listed on the registration page</li>
                                <li><strong>Student</strong> — As listed on the registration page (valid student ID required)</li>
                            </Box>
                            <Typography sx={{ ...textStyle, mt: 1 }}>
                                Payment is processed securely through Midtrans payment gateway. 
                                Registration is confirmed only after successful payment verification.
                            </Typography>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>3. Paper Submission</Typography>
                            <Typography sx={textStyle}>
                                All submitted papers undergo a peer review process. The organizing committee reserves the right to 
                                accept or reject submissions based on scientific merit, relevance, and quality. 
                                Accepted papers must be presented at the conference by at least one registered author.
                            </Typography>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>4. Payment Methods</Typography>
                            <Typography sx={textStyle}>
                                We accept various payment methods through our Midtrans payment gateway, including but not limited to:
                            </Typography>
                            <Box component="ul" sx={{ ...textStyle, pl: 3, mt: 1 }}>
                                <li>Bank Transfer (BCA, Mandiri, BNI, BRI, Permata, and other banks)</li>
                                <li>Virtual Account</li>
                                <li>Credit/Debit Card (Visa, Mastercard, JCB, American Express)</li>
                                <li>E-wallet (GoPay, ShopeePay, DANA)</li>
                                <li>QRIS</li>
                                <li>Convenience Store (Indomaret, Alfamart)</li>
                            </Box>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>5. Certificates</Typography>
                            <Typography sx={textStyle}>
                                Participation and/or presentation certificates will be issued to registered participants 
                                who have completed payment and attended the conference. Digital certificates can be downloaded 
                                from the participant dashboard after the conference.
                            </Typography>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>6. Intellectual Property</Typography>
                            <Typography sx={textStyle}>
                                Authors retain copyright of their submitted papers. By submitting a paper, 
                                authors grant the organizing committee a non-exclusive license to publish the paper 
                                in the conference proceedings. Authors are responsible for ensuring that their submissions 
                                do not infringe upon any existing copyrights or intellectual property rights.
                            </Typography>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>7. Limitation of Liability</Typography>
                            <Typography sx={textStyle}>
                                The organizing committee shall not be liable for any indirect, incidental, or consequential 
                                damages arising from the use of this platform or participation in the conference. 
                                Our total liability shall not exceed the amount of the registration fee paid.
                            </Typography>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>8. Changes to Terms</Typography>
                            <Typography sx={textStyle}>
                                We reserve the right to modify these Terms and Conditions at any time. 
                                Changes will be posted on this page with an updated revision date. 
                                Continued use of the platform after changes constitutes acceptance of the modified terms.
                            </Typography>
                        </Box>

                        <Box sx={sectionStyle}>
                            <Typography sx={titleStyle}>9. Contact</Typography>
                            <Typography sx={textStyle}>
                                For questions regarding these Terms and Conditions, please contact:<br />
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
