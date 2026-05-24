import React from 'react';
import { Head } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Button, Chip, Avatar, useTheme,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import MicIcon from '@mui/icons-material/Mic';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';

export default function AuthorCertificates({ certificates = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const getTypeConfig = (type) => {
        const map = {
            participation: {
                label: 'Certificate of Participation',
                shortLabel: 'Participation',
                icon: <SchoolIcon />,
                gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
                headerGlow: 'radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.3) 0%, transparent 70%)',
                accentColor: '#3b82f6',
                lightBg: isDark ? 'rgba(59,130,246,0.06)' : '#eff6ff',
                borderColor: isDark ? 'rgba(59,130,246,0.15)' : '#bfdbfe',
                ribbon: '🎓',
            },
            presenter: {
                label: 'Certificate of Presenter',
                shortLabel: 'Presenter',
                icon: <MicIcon />,
                gradient: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #34d399 100%)',
                headerGlow: 'radial-gradient(ellipse at 30% 50%, rgba(5,150,105,0.3) 0%, transparent 70%)',
                accentColor: '#059669',
                lightBg: isDark ? 'rgba(5,150,105,0.06)' : '#ecfdf5',
                borderColor: isDark ? 'rgba(5,150,105,0.15)' : '#a7f3d0',
                ribbon: '🎤',
            },
            best_paper: {
                label: 'Best Paper Award',
                shortLabel: 'Best Paper',
                icon: <EmojiEventsIcon />,
                gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 50%, #fbbf24 100%)',
                headerGlow: 'radial-gradient(ellipse at 30% 50%, rgba(217,119,6,0.3) 0%, transparent 70%)',
                accentColor: '#d97706',
                lightBg: isDark ? 'rgba(217,119,6,0.06)' : '#fffbeb',
                borderColor: isDark ? 'rgba(217,119,6,0.15)' : '#fde68a',
                ribbon: '🏆',
            },
        };
        return map[type] || map.participation;
    };

    return (
        <SidebarLayout>
            <Head title="My Certificates" />
            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>

                {/* ─── Premium Header ─── */}
                <Box sx={{
                    mb: 4, p: { xs: 3, sm: 4 }, borderRadius: '20px', position: 'relative', overflow: 'hidden',
                    background: isDark
                        ? 'linear-gradient(135deg, #0c2d48 0%, #0a3d33 50%, #1a1a2e 100%)'
                        : 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 50%, #fefce8 100%)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
                }}>
                    {/* Decorative background elements */}
                    <Box sx={{ position: 'absolute', top: -40, right: -20, fontSize: '120px', opacity: isDark ? 0.04 : 0.06, pointerEvents: 'none', transform: 'rotate(15deg)' }}>🏆</Box>
                    <Box sx={{ position: 'absolute', bottom: -20, left: '30%', fontSize: '80px', opacity: isDark ? 0.03 : 0.04, pointerEvents: 'none', transform: 'rotate(-10deg)' }}>📜</Box>
                    <Box sx={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        backgroundImage: 'radial-gradient(circle, rgba(26,188,156,0.08) 1px, transparent 1px)',
                        backgroundSize: '24px 24px', opacity: 0.5,
                    }} />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Avatar variant="rounded" sx={{
                                width: 52, height: 52, borderRadius: '14px',
                                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                boxShadow: '0 4px 14px rgba(5,150,105,0.3)',
                            }}>
                                <WorkspacePremiumIcon sx={{ color: '#fff', fontSize: 28 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: { xs: '1.5rem', sm: '1.85rem' }, letterSpacing: '-0.02em' }}>
                                    My Certificates
                                </Typography>
                                <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.85rem' }}>
                                    Download your official certificates from the conference
                                </Typography>
                            </Box>
                        </Box>

                        {/* Summary chip */}
                        {certificates.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                <Chip icon={<VerifiedIcon sx={{ fontSize: 16 }} />} label={`${certificates.length} Certificate${certificates.length > 1 ? 's' : ''} Available`}
                                    sx={{
                                        bgcolor: isDark ? 'rgba(5,150,105,0.15)' : '#dcfce7',
                                        color: '#059669', fontWeight: 600, fontSize: '0.78rem',
                                        borderRadius: '8px', height: 30,
                                        '& .MuiChip-icon': { color: '#059669' },
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                </Box>

                {certificates.length === 0 ? (
                    /* ─── Empty State ─── */
                    <Card elevation={0} sx={{
                        borderRadius: '24px',
                        border: `1px solid ${c.cardBorder}`,
                        bgcolor: c.cardBg,
                        textAlign: 'center',
                        py: 10, px: 3,
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <Box sx={{
                            position: 'absolute', inset: 0, pointerEvents: 'none',
                            backgroundImage: isDark
                                ? 'radial-gradient(circle at 50% 30%, rgba(26,188,156,0.04) 0%, transparent 60%)'
                                : 'radial-gradient(circle at 50% 30%, rgba(26,188,156,0.06) 0%, transparent 60%)',
                        }} />
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Box sx={{ fontSize: '64px', mb: 2, opacity: 0.7 }}>📜</Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: c.textPrimary, mb: 1 }}>No Certificates Yet</Typography>
                            <Typography variant="body1" sx={{ color: c.textMuted, maxWidth: 450, mx: 'auto', lineHeight: 1.7 }}>
                                Your certificates will appear here once the committee uploads them.
                                Please check back later after the conference.
                            </Typography>
                        </Box>
                    </Card>
                ) : (
                    /* ─── Certificate Cards ─── */
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        {certificates.map((cert, index) => {
                            const tc = getTypeConfig(cert.certificate_type);
                            return (
                                <Card key={cert.id} elevation={0} sx={{
                                    borderRadius: '20px',
                                    border: `1px solid ${tc.borderColor}`,
                                    bgcolor: c.cardBg,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    width: '100%',
                                    maxWidth: 520,
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                    animation: `fadeInUp 0.6s ease ${index * 0.15}s both, gentleFloat 4s ease-in-out ${index * 0.5}s infinite`,
                                    '@keyframes fadeInUp': {
                                        '0%': { opacity: 0, transform: 'translateY(30px) scale(0.97)' },
                                        '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
                                    },
                                    '@keyframes gentleFloat': {
                                        '0%, 100%': { transform: 'translateY(0px)' },
                                        '50%': { transform: 'translateY(-8px)' },
                                    },
                                    '&:hover': {
                                        boxShadow: `0 24px 60px ${isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.14)'}`,
                                        borderColor: tc.accentColor,
                                        animationPlayState: 'paused',
                                    },
                                }}>
                                    {/* ─── Certificate Header with gradient ─── */}
                                    <Box sx={{
                                        background: tc.gradient,
                                        px: 3, py: 3,
                                        position: 'relative', overflow: 'hidden',
                                    }}>
                                        {/* Decorative glow */}
                                        <Box sx={{ position: 'absolute', inset: 0, background: tc.headerGlow, pointerEvents: 'none' }} />

                                        {/* Decorative ribbon emoji */}
                                        <Box sx={{
                                            position: 'absolute', top: -10, right: 10,
                                            fontSize: '60px', opacity: 0.15,
                                            transform: 'rotate(15deg)', pointerEvents: 'none',
                                        }}>{tc.ribbon}</Box>

                                        {/* Star decorations */}
                                        <Box sx={{ position: 'absolute', top: 8, right: 70, opacity: 0.2, pointerEvents: 'none' }}>
                                            <StarIcon sx={{ color: '#fff', fontSize: 14 }} />
                                        </Box>
                                        <Box sx={{ position: 'absolute', bottom: 12, right: 30, opacity: 0.15, pointerEvents: 'none' }}>
                                            <StarIcon sx={{ color: '#fff', fontSize: 10 }} />
                                        </Box>

                                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                                                <Avatar variant="rounded" sx={{
                                                    bgcolor: 'rgba(255,255,255,0.18)',
                                                    width: 50, height: 50, borderRadius: '14px',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(255,255,255,0.15)',
                                                }}>
                                                    {React.cloneElement(tc.icon, { sx: { color: '#fff', fontSize: 26 } })}
                                                </Avatar>
                                                <Box>
                                                    <Typography sx={{
                                                        color: 'rgba(255,255,255,0.95)', fontWeight: 800,
                                                        fontSize: '1.15rem', lineHeight: 1.2, letterSpacing: '-0.01em',
                                                    }}>
                                                        {tc.label}
                                                    </Typography>
                                                    <Chip label="Official" size="small" icon={<VerifiedIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.9) !important' }} />}
                                                        sx={{
                                                            mt: 0.5,
                                                            bgcolor: 'rgba(255,255,255,0.15)',
                                                            color: 'rgba(255,255,255,0.9)',
                                                            fontWeight: 600, fontSize: '0.65rem',
                                                            borderRadius: '6px', height: 22,
                                                            backdropFilter: 'blur(4px)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* ─── Certificate Body ─── */}
                                    <CardContent sx={{ p: 3 }}>
                                        {/* Decorative certificate border pattern */}
                                        <Box sx={{
                                            p: 2.5, borderRadius: '14px',
                                            bgcolor: tc.lightBg,
                                            border: `1px dashed ${tc.borderColor}`,
                                            mb: 2.5,
                                            position: 'relative',
                                        }}>
                                            {/* Small badge */}
                                            <Box sx={{
                                                position: 'absolute', top: -10, left: 20,
                                                bgcolor: c.cardBg, px: 1, py: 0.3,
                                                borderRadius: '6px',
                                                border: `1px solid ${tc.borderColor}`,
                                            }}>
                                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: tc.accentColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    Conference Certificate
                                                </Typography>
                                            </Box>

                                            {/* Certificate Label */}
                                            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: c.textPrimary, mb: 1, mt: 0.5, lineHeight: 1.3 }}>
                                                {cert.label}
                                            </Typography>

                                            {/* Submission Info */}
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                    <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, minWidth: 55, mt: 0.2 }}>Paper:</Typography>
                                                    <Typography variant="body2" sx={{ color: c.textPrimary, fontSize: '0.83rem', fontWeight: 500, lineHeight: 1.4 }}>
                                                        {cert.submission?.title || 'N/A'}
                                                    </Typography>
                                                </Box>
                                                {cert.submission?.submission_code && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, minWidth: 55 }}>Code:</Typography>
                                                        <Chip label={cert.submission.submission_code} size="small" sx={{
                                                            fontFamily: 'monospace', fontWeight: 600, fontSize: '0.72rem',
                                                            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                                                            color: c.textPrimary, height: 22, borderRadius: '6px',
                                                        }} />
                                                    </Box>
                                                )}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, minWidth: 55 }}>Issued:</Typography>
                                                    <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem' }}>
                                                        {new Date(cert.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Download Button */}
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={<DownloadIcon />}
                                            href={route('certificates.download', cert.id)}
                                            sx={{
                                                background: tc.gradient,
                                                borderRadius: '14px',
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                fontSize: '0.9rem',
                                                py: 1.5,
                                                boxShadow: `0 4px 14px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.12)'}`,
                                                letterSpacing: '-0.01em',
                                                '&:hover': {
                                                    boxShadow: `0 8px 24px ${isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.18)'}`,
                                                    transform: 'translateY(-2px)',
                                                },
                                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                            }}
                                        >
                                            Download Certificate
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                )}

                {/* ─── Footer info ─── */}
                {certificates.length > 0 && (
                    <Box sx={{
                        mt: 3, p: 2.5, borderRadius: '14px',
                        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                        border: `1px solid ${c.cardBorder}`,
                        display: 'flex', alignItems: 'center', gap: 1.5,
                    }}>
                        <Box sx={{ fontSize: '20px' }}>💡</Box>
                        <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem' }}>
                            All certificates are officially issued by the 55th PIT IAGI & GEOSEA XIX 2026 organizing committee.
                            Contact <strong>support</strong> if you have any issues downloading.
                        </Typography>
                    </Box>
                )}
            </Box>
        </SidebarLayout>
    );
}
