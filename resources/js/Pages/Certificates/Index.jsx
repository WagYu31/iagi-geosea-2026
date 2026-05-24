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

export default function AuthorCertificates({ certificates = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const getTypeConfig = (type) => {
        const map = {
            participation: {
                label: 'Certificate of Participation',
                icon: <SchoolIcon />,
                gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                bg: isDark ? 'rgba(37,99,235,0.08)' : '#eff6ff',
                border: isDark ? 'rgba(37,99,235,0.2)' : '#bfdbfe',
                chipBg: isDark ? 'rgba(37,99,235,0.15)' : '#dbeafe',
                chipColor: '#2563eb',
            },
            presenter: {
                label: 'Certificate of Presenter',
                icon: <MicIcon />,
                gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                bg: isDark ? 'rgba(5,150,105,0.08)' : '#ecfdf5',
                border: isDark ? 'rgba(5,150,105,0.2)' : '#a7f3d0',
                chipBg: isDark ? 'rgba(22,163,74,0.15)' : '#dcfce7',
                chipColor: '#16a34a',
            },
            best_paper: {
                label: 'Best Paper Award',
                icon: <EmojiEventsIcon />,
                gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                bg: isDark ? 'rgba(217,119,6,0.08)' : '#fffbeb',
                border: isDark ? 'rgba(217,119,6,0.2)' : '#fde68a',
                chipBg: isDark ? 'rgba(234,88,12,0.15)' : '#fff7ed',
                chipColor: '#ea580c',
            },
        };
        return map[type] || map.participation;
    };

    return (
        <SidebarLayout>
            <Head title="My Certificates" />
            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                {/* Header */}
                <Box sx={{ mb: 3.5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: { xs: '1.5rem', sm: '1.85rem' }, letterSpacing: '-0.02em' }}>
                        My Certificates 🏆
                    </Typography>
                    <Typography variant="body2" sx={{ color: c.textMuted, mt: 0.5 }}>Download your certificates from the conference</Typography>
                </Box>

                {certificates.length === 0 ? (
                    /* Empty State */
                    <Card elevation={0} sx={{ borderRadius: '20px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, textAlign: 'center', py: 8, px: 3 }}>
                        <WorkspacePremiumIcon sx={{ fontSize: 72, color: isDark ? '#374151' : '#d1d5db', mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: c.textPrimary, mb: 1 }}>No Certificates Yet</Typography>
                        <Typography variant="body2" sx={{ color: c.textMuted, maxWidth: 400, mx: 'auto' }}>
                            Your certificates will appear here once the committee uploads them. Please check back later.
                        </Typography>
                    </Card>
                ) : (
                    /* Certificate Cards */
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2.5 }}>
                        {certificates.map((cert) => {
                            const tc = getTypeConfig(cert.certificate_type);
                            return (
                                <Card key={cert.id} elevation={0} sx={{
                                    borderRadius: '18px',
                                    border: `1px solid ${tc.border}`,
                                    bgcolor: tc.bg,
                                    overflow: 'hidden',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 12px 35px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                                    },
                                }}>
                                    {/* Gradient Header */}
                                    <Box sx={{
                                        background: tc.gradient,
                                        px: 2.5, py: 2,
                                        display: 'flex', alignItems: 'center', gap: 1.5,
                                    }}>
                                        <Avatar variant="rounded" sx={{
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            width: 44, height: 44, borderRadius: '12px',
                                            backdropFilter: 'blur(8px)',
                                        }}>
                                            {React.cloneElement(tc.icon, { sx: { color: '#fff', fontSize: 24 } })}
                                        </Avatar>
                                        <Box>
                                            <Chip label={tc.label} size="small" sx={{
                                                bgcolor: 'rgba(255,255,255,0.2)', color: '#fff',
                                                fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px', height: 22,
                                                backdropFilter: 'blur(4px)',
                                            }} />
                                        </Box>
                                    </Box>

                                    <CardContent sx={{ p: 2.5 }}>
                                        {/* Certificate Label */}
                                        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: c.textPrimary, mb: 0.5 }}>
                                            {cert.label}
                                        </Typography>

                                        {/* Submission Info */}
                                        <Typography variant="body2" noWrap sx={{ color: c.textMuted, fontSize: '0.8rem', mb: 0.5 }}>
                                            {cert.submission?.title || 'N/A'}
                                        </Typography>
                                        {cert.submission?.submission_code && (
                                            <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.7rem', fontFamily: 'monospace' }}>
                                                {cert.submission.submission_code}
                                            </Typography>
                                        )}

                                        {/* Date */}
                                        <Typography variant="caption" sx={{ color: c.textMuted, display: 'block', mt: 1, fontSize: '0.7rem' }}>
                                            Issued: {new Date(cert.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </Typography>

                                        {/* Download Button */}
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={<DownloadIcon />}
                                            href={route('certificates.download', cert.id)}
                                            sx={{
                                                mt: 2,
                                                background: tc.gradient,
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                py: 1.2,
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    boxShadow: `0 4px 14px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.15)'}`,
                                                    transform: 'translateY(-1px)',
                                                },
                                                transition: 'all 0.25s ease',
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
            </Box>
        </SidebarLayout>
    );
}
