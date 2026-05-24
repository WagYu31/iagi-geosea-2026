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

/* ─── Ornate corner SVG for certificate frame ─── */
const OrnateCorner = ({ style, color = '#c9a84c' }) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ position: 'absolute', ...style }}>
        <path d="M0 0 L40 0 L40 6 Q20 6 6 20 L6 40 L0 40 Z" fill={color} opacity="0.6" />
        <path d="M0 0 L40 0 L40 3 Q22 3 3 22 L3 40 L0 40 Z" fill={color} opacity="0.3" />
    </svg>
);

/* ─── Seal/stamp watermark ─── */
const SealWatermark = ({ color = 'rgba(201,168,76,0.08)' }) => (
    <Box sx={{
        position: 'absolute', top: 16, right: 16, width: 70, height: 70,
        borderRadius: '50%', border: `3px double ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', zIndex: 0,
    }}>
        <Box sx={{
            width: 50, height: 50, borderRadius: '50%',
            border: `1.5px solid ${color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <VerifiedIcon sx={{ color, fontSize: 22 }} />
        </Box>
    </Box>
);

export default function AuthorCertificates({ certificates = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const gold = isDark ? '#d4a853' : '#b8860b';
    const goldLight = isDark ? 'rgba(212,168,83,0.12)' : 'rgba(184,134,11,0.06)';
    const goldBorder = isDark ? 'rgba(212,168,83,0.25)' : 'rgba(184,134,11,0.2)';
    const sealColor = isDark ? 'rgba(212,168,83,0.12)' : 'rgba(184,134,11,0.1)';
    const cornerColor = isDark ? '#8b7332' : '#c9a84c';

    const getTypeConfig = (type) => {
        const map = {
            participation: {
                label: 'Certificate of Participation',
                icon: <SchoolIcon />,
                gradient: 'linear-gradient(135deg, #0c4a3e 0%, #0d6b52 50%, #10b981 100%)',
                chipBg: isDark ? 'rgba(16,185,129,0.15)' : '#d1fae5',
                chipColor: '#059669',
                ribbon: '🎓',
            },
            presenter: {
                label: 'Certificate of Presenter',
                icon: <MicIcon />,
                gradient: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #3b82f6 100%)',
                chipBg: isDark ? 'rgba(59,130,246,0.15)' : '#dbeafe',
                chipColor: '#2563eb',
                ribbon: '🎤',
            },
            best_paper: {
                label: 'Best Paper Award',
                icon: <EmojiEventsIcon />,
                gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)',
                chipBg: isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7',
                chipColor: '#d97706',
                ribbon: '🏆',
            },
        };
        return map[type] || map.participation;
    };

    return (
        <SidebarLayout>
            <Head title="My Certificates" />
            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>

                {/* ━━━ Hero Banner ━━━ */}
                <Box sx={{
                    mb: 4, borderRadius: '22px', position: 'relative', overflow: 'hidden',
                    background: isDark
                        ? 'linear-gradient(135deg, #052e22 0%, #064e3b 40%, #0a3d33 70%, #0c2d48 100%)'
                        : 'linear-gradient(135deg, #064e3b 0%, #059669 40%, #10b981 70%, #34d399 100%)',
                    border: `1px solid ${isDark ? 'rgba(212,168,83,0.15)' : 'rgba(255,255,255,0.2)'}`,
                    p: { xs: 3, sm: 4 },
                    textAlign: 'center',
                }}>
                    {/* Gold corner ornaments */}
                    <OrnateCorner style={{ top: 0, left: 0 }} color={isDark ? '#8b7332' : 'rgba(255,255,255,0.25)'} />
                    <OrnateCorner style={{ top: 0, right: 0, transform: 'scaleX(-1)' }} color={isDark ? '#8b7332' : 'rgba(255,255,255,0.25)'} />
                    <OrnateCorner style={{ bottom: 0, left: 0, transform: 'scaleY(-1)' }} color={isDark ? '#8b7332' : 'rgba(255,255,255,0.25)'} />
                    <OrnateCorner style={{ bottom: 0, right: 0, transform: 'scale(-1)' }} color={isDark ? '#8b7332' : 'rgba(255,255,255,0.25)'} />

                    {/* Decorative gold line */}
                    <Box sx={{
                        position: 'absolute', top: 8, left: 48, right: 48, height: '1px',
                        background: `linear-gradient(90deg, transparent, ${isDark ? 'rgba(212,168,83,0.3)' : 'rgba(255,255,255,0.3)'}, transparent)`,
                    }} />
                    <Box sx={{
                        position: 'absolute', bottom: 8, left: 48, right: 48, height: '1px',
                        background: `linear-gradient(90deg, transparent, ${isDark ? 'rgba(212,168,83,0.3)' : 'rgba(255,255,255,0.3)'}, transparent)`,
                    }} />

                    {/* Background particles */}
                    {[...Array(8)].map((_, i) => (
                        <Box key={i} sx={{
                            position: 'absolute',
                            width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2,
                            borderRadius: '50%',
                            bgcolor: isDark ? 'rgba(212,168,83,0.2)' : 'rgba(255,255,255,0.2)',
                            top: `${15 + (i * 11) % 70}%`,
                            left: `${8 + (i * 13) % 85}%`,
                            animation: `sparkle 3s ease-in-out ${i * 0.4}s infinite`,
                            '@keyframes sparkle': {
                                '0%, 100%': { opacity: 0.2, transform: 'scale(1)' },
                                '50%': { opacity: 0.7, transform: 'scale(1.5)' },
                            },
                        }} />
                    ))}

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ fontSize: '48px', mb: 1, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }}>🏆</Box>
                        <Typography sx={{
                            fontWeight: 900, fontSize: { xs: '1.6rem', sm: '2rem' },
                            color: '#fff', letterSpacing: '-0.02em',
                            textShadow: '0 2px 12px rgba(0,0,0,0.2)',
                        }}>
                            My Certificates
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', mt: 0.5 }}>
                            Download your official conference certificates
                        </Typography>
                        {certificates.length > 0 && (
                            <Chip icon={<VerifiedIcon sx={{ fontSize: 14, color: '#fff !important' }} />}
                                label={`${certificates.length} Certificate${certificates.length > 1 ? 's' : ''} Available`}
                                sx={{
                                    mt: 2, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff',
                                    fontWeight: 600, fontSize: '0.78rem', borderRadius: '8px', height: 30,
                                    backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)',
                                }}
                            />
                        )}
                    </Box>
                </Box>

                {certificates.length === 0 ? (
                    /* ━━━ Empty State ━━━ */
                    <Card elevation={0} sx={{
                        borderRadius: '24px', border: `2px solid ${goldBorder}`, bgcolor: c.cardBg,
                        textAlign: 'center', py: 10, px: 3, position: 'relative', overflow: 'hidden', maxWidth: 560, mx: 'auto',
                    }}>
                        <OrnateCorner style={{ top: 0, left: 0 }} color={cornerColor} />
                        <OrnateCorner style={{ top: 0, right: 0, transform: 'scaleX(-1)' }} color={cornerColor} />
                        <OrnateCorner style={{ bottom: 0, left: 0, transform: 'scaleY(-1)' }} color={cornerColor} />
                        <OrnateCorner style={{ bottom: 0, right: 0, transform: 'scale(-1)' }} color={cornerColor} />
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Box sx={{ fontSize: '64px', mb: 2, opacity: 0.6 }}>📜</Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: c.textPrimary, mb: 1 }}>No Certificates Yet</Typography>
                            <Typography variant="body1" sx={{ color: c.textMuted, maxWidth: 400, mx: 'auto', lineHeight: 1.7 }}>
                                Your certificates will appear here once the committee uploads them. Check back after the conference.
                            </Typography>
                        </Box>
                    </Card>
                ) : (
                    /* ━━━ Certificate Cards ━━━ */
                    <Box sx={{
                        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3.5,
                    }}>
                        {certificates.map((cert, index) => {
                            const tc = getTypeConfig(cert.certificate_type);
                            return (
                                <Card key={cert.id} elevation={0} sx={{
                                    width: '100%', maxWidth: 420,
                                    borderRadius: '20px',
                                    border: `2px solid ${goldBorder}`,
                                    bgcolor: c.cardBg,
                                    overflow: 'visible',
                                    position: 'relative',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                    animation: `certFloat 5s ease-in-out ${index * 0.7}s infinite, certAppear 0.7s ease ${index * 0.15}s both`,
                                    '@keyframes certFloat': {
                                        '0%, 100%': { transform: 'translateY(0)' },
                                        '50%': { transform: 'translateY(-10px)' },
                                    },
                                    '@keyframes certAppear': {
                                        '0%': { opacity: 0, transform: 'translateY(40px) scale(0.95)' },
                                        '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
                                    },
                                    '&:hover': {
                                        animationPlayState: 'paused',
                                        borderColor: gold,
                                        boxShadow: isDark
                                            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${goldBorder}`
                                            : `0 20px 60px rgba(184,134,11,0.12), 0 0 0 1px ${goldBorder}`,
                                    },
                                }}>
                                    {/* Gold corner ornaments */}
                                    <OrnateCorner style={{ top: -1, left: -1 }} color={cornerColor} />
                                    <OrnateCorner style={{ top: -1, right: -1, transform: 'scaleX(-1)' }} color={cornerColor} />
                                    <OrnateCorner style={{ bottom: -1, left: -1, transform: 'scaleY(-1)' }} color={cornerColor} />
                                    <OrnateCorner style={{ bottom: -1, right: -1, transform: 'scale(-1)' }} color={cornerColor} />

                                    {/* Seal watermark */}
                                    <SealWatermark color={sealColor} />

                                    {/* Inner gold border line */}
                                    <Box sx={{
                                        position: 'absolute', inset: 6,
                                        border: `1px solid ${isDark ? 'rgba(212,168,83,0.1)' : 'rgba(184,134,11,0.08)'}`,
                                        borderRadius: '14px', pointerEvents: 'none', zIndex: 0,
                                    }} />

                                    {/* ─── Card Content ─── */}
                                    <Box sx={{ position: 'relative', zIndex: 1, p: 3 }}>
                                        {/* Type Badge */}
                                        <Chip label={tc.label} size="small"
                                            icon={React.cloneElement(tc.icon, { sx: { fontSize: 15, color: `${tc.chipColor} !important` } })}
                                            sx={{
                                                bgcolor: tc.chipBg, color: tc.chipColor,
                                                fontWeight: 700, fontSize: '0.72rem',
                                                borderRadius: '8px', height: 28,
                                                mb: 2.5,
                                                boxShadow: `0 2px 8px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)'}`,
                                            }}
                                        />

                                        {/* Certificate Label */}
                                        <Typography sx={{
                                            fontWeight: 800, fontSize: '1.2rem',
                                            color: c.textPrimary, mb: 2, lineHeight: 1.3,
                                            letterSpacing: '-0.01em',
                                        }}>
                                            {cert.label}
                                        </Typography>

                                        {/* Divider line */}
                                        <Box sx={{
                                            height: '1px', mb: 2,
                                            background: `linear-gradient(90deg, transparent, ${goldBorder}, transparent)`,
                                        }} />

                                        {/* Info rows */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 2.5 }}>
                                            <Box>
                                                <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.3 }}>
                                                    Paper Title
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: c.textPrimary, lineHeight: 1.4 }}>
                                                    {cert.submission?.title || 'N/A'}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: 3 }}>
                                                <Box>
                                                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.3 }}>
                                                        Submission Code
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: c.textPrimary, fontFamily: 'monospace' }}>
                                                        {cert.submission?.submission_code || '—'}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.3 }}>
                                                        Issue Date
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: c.textPrimary }}>
                                                        {new Date(cert.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Download Button */}
                                        <Button
                                            fullWidth variant="contained"
                                            startIcon={<DownloadIcon />}
                                            href={route('certificates.download', cert.id)}
                                            sx={{
                                                background: tc.gradient,
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                fontSize: '0.88rem',
                                                py: 1.4,
                                                letterSpacing: '-0.01em',
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    boxShadow: `0 8px 24px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)'}`,
                                                    transform: 'translateY(-2px)',
                                                },
                                                transition: 'all 0.25s ease',
                                            }}
                                        >
                                            Download PDF
                                        </Button>
                                    </Box>
                                </Card>
                            );
                        })}
                    </Box>
                )}

                {/* ━━━ Footer ━━━ */}
                {certificates.length > 0 && (
                    <Box sx={{
                        mt: 4, p: 2.5, borderRadius: '14px',
                        bgcolor: goldLight,
                        border: `1px solid ${goldBorder}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5,
                    }}>
                        <VerifiedIcon sx={{ fontSize: 18, color: gold }} />
                        <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem', textAlign: 'center' }}>
                            All certificates are officially issued by the <strong>55th PIT IAGI & GEOSEA XIX 2026</strong> organizing committee.
                        </Typography>
                    </Box>
                )}
            </Box>
        </SidebarLayout>
    );
}
