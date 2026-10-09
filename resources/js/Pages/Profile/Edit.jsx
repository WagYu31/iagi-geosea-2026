import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Avatar, Chip,
    Grid, Stack, useTheme, Divider,
} from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import SecurityIcon from '@mui/icons-material/Security';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const { auth } = usePage().props;
    const user = auth.user;

    const getRoleConfig = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return { label: 'ADMINISTRATOR', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
            case 'reviewer':
                return { label: 'SCIENTIFIC REVIEWER', bg: '#fffbeb', color: '#d97706', border: '#fde68a' };
            case 'juri':
                return { label: 'OFFICIAL JURY / JUDGE', bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' };
            default:
                return { label: (role || 'PARTICIPANT').toUpperCase(), bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
        }
    };

    const roleConfig = getRoleConfig(user.role);

    return (
        <SidebarLayout>
            <Head title="Profile Settings • 55th PIT IAGI & GEOSEA 2026" />

            <Box component="main" role="main" aria-label="Profile Settings" sx={{
                p: { xs: 1.5, sm: 2.5, md: 4 },
                maxWidth: '1600px',
                mx: 'auto',
                minHeight: '100vh',
                bgcolor: c.surfaceBg,
            }}>
                {/* ── 21st.dev HERO PROFILE BANNER ── */}
                <Box sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: { xs: '20px', sm: '24px' },
                    p: { xs: 2.2, sm: 3, md: 4 },
                    mb: { xs: 2, sm: 3 },
                    background: isDark
                        ? 'linear-gradient(135deg, #052e25 0%, #031c17 50%, #02120e 100%)'
                        : 'linear-gradient(135deg, #094d42 0%, #063830 50%, #03241f 100%)',
                    color: '#ffffff',
                    boxShadow: '0 20px 45px -15px rgba(4, 41, 35, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                }}>
                    <Box sx={{
                        position: 'absolute',
                        top: -70,
                        right: -70,
                        width: 260,
                        height: 260,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    <Box sx={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'flex-start', md: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                    }}>
                        {/* Avatar & User meta - Horizontal on mobile for sleek compact layout */}
                        <Stack direction="row" spacing={{ xs: 2, sm: 3 }} alignItems="center">
                            <Avatar sx={{
                                width: { xs: 56, sm: 84 },
                                height: { xs: 56, sm: 84 },
                                bgcolor: '#10b981',
                                color: '#ffffff',
                                fontSize: { xs: '1.45rem', sm: '2.2rem' },
                                fontWeight: 900,
                                border: '3px solid rgba(255, 255, 255, 0.25)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                                flexShrink: 0,
                            }}>
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>

                            <Box sx={{ minWidth: 0 }}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.8, mb: 0.8 }}>
                                    <Chip
                                        label={roleConfig.label}
                                        size="small"
                                        sx={{
                                            height: 22,
                                            fontWeight: 800,
                                            fontSize: '0.64rem',
                                            borderRadius: '6px',
                                            bgcolor: 'rgba(255, 255, 255, 0.15)',
                                            color: '#ffffff',
                                            border: '1px solid rgba(255, 255, 255, 0.25)',
                                        }}
                                    />
                                    {user.email_verified_at && (
                                        <Chip
                                            icon={<VerifiedOutlinedIcon sx={{ fontSize: '13px !important', color: '#6ee7b7 !important' }} />}
                                            label="Verified Account"
                                            size="small"
                                            sx={{
                                                height: 22,
                                                fontWeight: 800,
                                                fontSize: '0.64rem',
                                                borderRadius: '6px',
                                                bgcolor: 'rgba(16, 185, 129, 0.25)',
                                                color: '#a7f3d0',
                                                border: '1px solid rgba(16, 185, 129, 0.35)',
                                            }}
                                        />
                                    )}
                                    <Chip
                                        label="55th PIT IAGI & GEOSEA XIX 2026"
                                        size="small"
                                        sx={{
                                            height: 22,
                                            fontWeight: 700,
                                            fontSize: '0.64rem',
                                            borderRadius: '6px',
                                            bgcolor: 'rgba(245, 158, 11, 0.2)',
                                            color: '#fde68a',
                                            border: '1px solid rgba(245, 158, 11, 0.35)',
                                            display: { xs: 'none', sm: 'inline-flex' },
                                        }}
                                    />
                                </Box>

                                <Typography variant="h4" sx={{
                                    fontWeight: 900,
                                    letterSpacing: '-0.025em',
                                    fontSize: { xs: '1.25rem', sm: '1.85rem' },
                                    lineHeight: 1.2,
                                    color: '#ffffff',
                                    mb: 0.3,
                                }}>
                                    {user.name}
                                </Typography>

                                <Typography variant="body2" sx={{
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: { xs: '0.78rem', sm: '0.88rem' },
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {user.email}
                                    {user.affiliation ? ` • ${user.affiliation}` : ''}
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Quick Status Tag on Right */}
                        <Box sx={{
                            display: { xs: 'none', md: 'block' },
                            p: 2,
                            borderRadius: '16px',
                            bgcolor: 'rgba(0, 0, 0, 0.22)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'right',
                            minWidth: 180,
                        }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                System Privileges
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 800, color: '#6ee7b7', mt: 0.3 }}>
                                {user.role ? user.role.toUpperCase() : 'USER'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', display: 'block', mt: 0.2 }}>
                                Active Delegate / Committee
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* ── BENTO GRID: PROFILE INFO, ACCOUNT METADATA & PASSWORD ── */}
                <Grid container spacing={{ xs: 2, md: 3 }}>
                    {/* BENTO CARD 1: Profile Information */}
                    <Grid size={{ xs: 12, md: 6, lg: 4.5 }}>
                        <Card elevation={0} sx={{
                            borderRadius: { xs: '18px', sm: '24px' },
                            border: `1.5px solid ${c.cardBorder}`,
                            bgcolor: c.cardBg,
                            p: { xs: 2, sm: 3.5 },
                            height: '100%',
                            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '12px',
                                    bgcolor: 'rgba(16, 185, 129, 0.12)',
                                    color: '#059669',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <PersonOutlineRoundedIcon sx={{ fontSize: 22 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '1.05rem' }}>
                                        Profile Information
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.75rem' }}>
                                        Update your personal data and contact details.
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2, borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }} />

                            <Box sx={{ flex: 1 }}>
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </Box>
                        </Card>
                    </Grid>

                    {/* BENTO CARD 2: Account Information & Credentials */}
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        <Card elevation={0} sx={{
                            borderRadius: '24px',
                            border: `1.5px solid ${c.cardBorder}`,
                            bgcolor: c.cardBg,
                            p: { xs: 2.5, sm: 3.5 },
                            height: '100%',
                            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '12px',
                                    bgcolor: 'rgba(2, 132, 199, 0.12)',
                                    color: '#0284c7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <BadgeOutlinedIcon sx={{ fontSize: 22 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '1.05rem' }}>
                                        Account Details
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.75rem' }}>
                                        Privileges and verified platform status.
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2, borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }} />

                            <Stack spacing={2} sx={{ flex: 1 }}>
                                {/* Tile 1: Member Since */}
                                <Box sx={{
                                    p: 2,
                                    borderRadius: '16px',
                                    bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                    border: `1px solid ${c.cardBorder}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.8,
                                }}>
                                    <Box sx={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: '10px',
                                        bgcolor: 'rgba(5, 150, 105, 0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#059669',
                                    }}>
                                        <CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase', display: 'block' }}>
                                            Member Since
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '0.88rem' }}>
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            }) : 'Conference 2026'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Tile 2: Verification Status */}
                                <Box sx={{
                                    p: 2,
                                    borderRadius: '16px',
                                    bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                    border: `1px solid ${c.cardBorder}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.8,
                                }}>
                                    <Box sx={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: '10px',
                                        bgcolor: user.email_verified_at ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: user.email_verified_at ? '#059669' : '#d97706',
                                    }}>
                                        <VerifiedOutlinedIcon sx={{ fontSize: 20 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase', display: 'block' }}>
                                            Account Status
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 800, color: user.email_verified_at ? '#059669' : '#d97706', fontSize: '0.88rem' }}>
                                            {user.email_verified_at ? '✓ Verified Account' : '⚠ Unverified'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Tile 3: Role */}
                                <Box sx={{
                                    p: 2,
                                    borderRadius: '16px',
                                    bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                    border: `1px solid ${c.cardBorder}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.8,
                                }}>
                                    <Box sx={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: '10px',
                                        bgcolor: 'rgba(2, 132, 199, 0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#0284c7',
                                    }}>
                                        <SecurityIcon sx={{ fontSize: 20 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase', display: 'block' }}>
                                            Platform Role
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '0.88rem', textTransform: 'capitalize' }}>
                                            {user.role || 'Participant'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Tile 4: Conference Standing */}
                                <Box sx={{
                                    p: 2,
                                    borderRadius: '16px',
                                    bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                    border: `1px solid ${c.cardBorder}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.8,
                                }}>
                                    <Box sx={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: '10px',
                                        bgcolor: 'rgba(217, 119, 6, 0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#d97706',
                                    }}>
                                        <WorkspacePremiumIcon sx={{ fontSize: 20 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase', display: 'block' }}>
                                            Conference Access
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '0.88rem' }}>
                                            55th PIT IAGI & GEOSEA
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Card>
                    </Grid>

                    {/* BENTO CARD 3: Update Password */}
                    <Grid size={{ xs: 12, md: 12, lg: 4.5 }}>
                        <Card elevation={0} sx={{
                            borderRadius: '24px',
                            border: `1.5px solid ${c.cardBorder}`,
                            bgcolor: c.cardBg,
                            p: { xs: 2.5, sm: 3.5 },
                            height: '100%',
                            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '12px',
                                    bgcolor: 'rgba(217, 119, 6, 0.12)',
                                    color: '#d97706',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <LockOutlinedIcon sx={{ fontSize: 22 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '1.05rem' }}>
                                        Update Password
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.75rem' }}>
                                        Ensure your account uses a secure passphrase.
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2, borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }} />

                            <Box sx={{ flex: 1 }}>
                                <UpdatePasswordForm />
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </SidebarLayout>
    );
}
