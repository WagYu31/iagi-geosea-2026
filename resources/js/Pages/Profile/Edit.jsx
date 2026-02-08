import { Head } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box,
    Typography,
    Paper,
    Avatar,
    Chip,
    Grid,
    Stack,
    useTheme,
} from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { usePage } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const { auth } = usePage().props;
    const user = auth.user;

    const getRoleBadgeStyle = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return { bgcolor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' };
            case 'reviewer':
                return { bgcolor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' };
            default:
                return { bgcolor: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe' };
        }
    };

    return (
        <SidebarLayout>
            <Head title="Profile" />

            <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '1400px', margin: '0 auto' }}>
                {/* Page Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography sx={{
                        fontWeight: 800,
                        color: c.textPrimary,
                        fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.75rem' },
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                    }}>
                        Profile
                    </Typography>
                    <Typography sx={{ color: c.textMuted, fontSize: '0.85rem', mt: 0.5 }}>
                        Manage your account information and security
                    </Typography>
                </Box>

                {/* Profile Card */}
                <Paper elevation={0} sx={{
                    p: { xs: 2.5, md: 3 },
                    mb: 3,
                    border: `1px solid ${c.cardBorder}`,
                    borderRadius: '16px',
                    bgcolor: c.cardBg,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #0d7a6a, #1abc9c)',
                    },
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        gap: { xs: 2, sm: 3 },
                    }}>
                        <Avatar sx={{
                            width: { xs: 64, sm: 72 },
                            height: { xs: 64, sm: 72 },
                            bgcolor: '#ecfdf5',
                            color: '#0d7a6a',
                            fontSize: { xs: '1.5rem', sm: '1.8rem' },
                            fontWeight: 800,
                            border: '3px solid #d1fae5',
                        }}>
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flex: 1 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.1rem', sm: '1.25rem' }, color: '#111827', lineHeight: 1.3 }}>
                                {user.name}
                            </Typography>
                            <Typography sx={{ color: c.textMuted, fontSize: '0.85rem', mt: 0.3 }}>
                                {user.email}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1.5, justifyContent: { xs: 'center', sm: 'flex-start' }, flexWrap: 'wrap' }}>
                                <Chip
                                    label={user.role?.toUpperCase() || 'USER'}
                                    size="small"
                                    sx={{
                                        ...getRoleBadgeStyle(user.role),
                                        fontWeight: 700,
                                        fontSize: '0.65rem',
                                        borderRadius: '8px',
                                        height: 24,
                                    }}
                                />
                                {user.email_verified_at && (
                                    <Chip
                                        label="✓ Verified"
                                        size="small"
                                        sx={{
                                            bgcolor: '#ecfdf5',
                                            color: '#059669',
                                            border: '1px solid #d1fae5',
                                            fontWeight: 700,
                                            fontSize: '0.65rem',
                                            borderRadius: '8px',
                                            height: 24,
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Grid Layout for Forms */}
                <Grid container spacing={2.5}>
                    {/* Profile Information */}
                    <Grid item xs={12} lg={8}>
                        <Paper elevation={0} sx={{
                            p: { xs: 2.5, md: 3 },
                            border: `1px solid ${c.cardBorder}`,
                            borderRadius: '16px',
                            bgcolor: c.cardBg,
                            height: '100%',
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <PersonOutlineRoundedIcon sx={{ color: c.textSecondary, fontSize: '1.1rem' }} />
                                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: c.textPrimary }}>
                                    Profile Information
                                </Typography>
                            </Box>
                            <Typography sx={{ color: c.textMuted, fontSize: '0.8rem', mb: 2.5, pl: 3.5 }}>
                                Update your account's profile information and email address.
                            </Typography>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </Paper>
                    </Grid>

                    {/* Account Info Card */}
                    <Grid item xs={12} lg={4}>
                        <Paper elevation={0} sx={{
                            p: { xs: 2.5, md: 3 },
                            border: `1px solid ${c.cardBorder}`,
                            borderRadius: '16px',
                            bgcolor: c.surfaceBg,
                        }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: c.textPrimary, mb: 2.5 }}>
                                Account Info
                            </Typography>
                            <Stack spacing={2.5}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                    <Box sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '10px',
                                        bgcolor: '#ecfdf5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <CalendarMonthOutlinedIcon sx={{ fontSize: '1rem', color: '#059669' }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.7rem', color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Member Since
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: c.textPrimary }}>
                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                    <Box sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '10px',
                                        bgcolor: user.email_verified_at ? '#ecfdf5' : '#fffbeb',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <VerifiedOutlinedIcon sx={{ fontSize: '1rem', color: user.email_verified_at ? '#059669' : '#d97706' }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.7rem', color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Account Status
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: user.email_verified_at ? '#059669' : '#d97706' }}>
                                            {user.email_verified_at ? '✓ Verified' : '⚠ Unverified'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                    <Box sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '10px',
                                        bgcolor: '#eff6ff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <BadgeOutlinedIcon sx={{ fontSize: '1rem', color: '#2563eb' }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.7rem', color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Role
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: c.textPrimary, textTransform: 'capitalize' }}>
                                            {user.role || 'User'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Update Password */}
                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{
                            p: { xs: 2.5, md: 3 },
                            border: `1px solid ${c.cardBorder}`,
                            borderRadius: '16px',
                            bgcolor: c.cardBg,
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <LockOutlinedIcon sx={{ color: c.textSecondary, fontSize: '1.1rem' }} />
                                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: c.textPrimary }}>
                                    Update Password
                                </Typography>
                            </Box>
                            <Typography sx={{ color: c.textMuted, fontSize: '0.8rem', mb: 2.5, pl: 3.5 }}>
                                Ensure your account is using a long, random password to stay secure.
                            </Typography>
                            <UpdatePasswordForm />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </SidebarLayout>
    );
}
