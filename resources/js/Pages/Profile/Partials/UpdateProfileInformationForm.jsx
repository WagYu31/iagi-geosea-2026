import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import {
    Box, Typography, TextField, Button, MenuItem, Stack,
    Alert, useTheme, InputAdornment, CircularProgress,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import CategoryIcon from '@mui/icons-material/Category';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name || '',
            email: user.email || '',
            affiliation: user.affiliation || '',
            whatsapp: user.whatsapp || '',
            category: user.category || '',
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={submit} className={className}>
            <Stack spacing={2.5}>
                {/* Name */}
                <Box>
                    <Typography variant="caption" sx={{
                        color: c.textSecondary,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'block',
                        mb: 0.8,
                    }}>
                        Full Name *
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        placeholder="e.g. Dr. John Doe, S.T., M.Sc."
                        error={!!errors.name}
                        helperText={errors.name}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlineIcon sx={{ color: c.textSecondary, fontSize: 18 }} />
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: '12px',
                                fontSize: '0.88rem',
                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                '& fieldset': { borderColor: c.cardBorder },
                                '&:hover fieldset': { borderColor: '#059669' },
                                '&.Mui-focused fieldset': { borderColor: '#059669', borderWidth: 2 },
                            },
                        }}
                    />
                </Box>

                {/* Email */}
                <Box>
                    <Typography variant="caption" sx={{
                        color: c.textSecondary,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'block',
                        mb: 0.8,
                    }}>
                        Email Address *
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        placeholder="yourname@institution.ac.id"
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MailOutlineIcon sx={{ color: c.textSecondary, fontSize: 18 }} />
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: '12px',
                                fontSize: '0.88rem',
                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                '& fieldset': { borderColor: c.cardBorder },
                                '&:hover fieldset': { borderColor: '#059669' },
                                '&.Mui-focused fieldset': { borderColor: '#059669', borderWidth: 2 },
                            },
                        }}
                    />
                </Box>

                {/* Affiliation / Institution */}
                <Box>
                    <Typography variant="caption" sx={{
                        color: c.textSecondary,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'block',
                        mb: 0.8,
                    }}>
                        Affiliation / Institution {user.role === 'Reviewer' && <span style={{ color: '#dc2626' }}>*</span>}
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        id="affiliation"
                        value={data.affiliation}
                        onChange={(e) => setData('affiliation', e.target.value)}
                        autoComplete="organization"
                        required={user.role === 'Reviewer'}
                        placeholder="e.g. Institut Teknologi Bandung / PT Pertamina"
                        error={!!errors.affiliation}
                        helperText={errors.affiliation || (user.role === 'Reviewer' ? 'Required for Reviewer accounts' : '')}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BusinessIcon sx={{ color: c.textSecondary, fontSize: 18 }} />
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: '12px',
                                fontSize: '0.88rem',
                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                '& fieldset': { borderColor: c.cardBorder },
                                '&:hover fieldset': { borderColor: '#059669' },
                                '&.Mui-focused fieldset': { borderColor: '#059669', borderWidth: 2 },
                            },
                        }}
                    />
                </Box>

                {/* WhatsApp */}
                <Box>
                    <Typography variant="caption" sx={{
                        color: c.textSecondary,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'block',
                        mb: 0.8,
                    }}>
                        WhatsApp / Phone Number
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        id="whatsapp"
                        type="tel"
                        value={data.whatsapp}
                        onChange={(e) => setData('whatsapp', e.target.value)}
                        autoComplete="tel"
                        placeholder="08123456789"
                        error={!!errors.whatsapp}
                        helperText={errors.whatsapp}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhoneIcon sx={{ color: c.textSecondary, fontSize: 18 }} />
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: '12px',
                                fontSize: '0.88rem',
                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                '& fieldset': { borderColor: c.cardBorder },
                                '&:hover fieldset': { borderColor: '#059669' },
                                '&.Mui-focused fieldset': { borderColor: '#059669', borderWidth: 2 },
                            },
                        }}
                    />
                </Box>

                {/* Category */}
                <Box>
                    <Typography variant="caption" sx={{
                        color: c.textSecondary,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'block',
                        mb: 0.8,
                    }}>
                        Participant Category
                    </Typography>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        id="category"
                        value={data.category}
                        onChange={(e) => setData('category', e.target.value)}
                        error={!!errors.category}
                        helperText={errors.category}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CategoryIcon sx={{ color: c.textSecondary, fontSize: 18 }} />
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: '12px',
                                fontSize: '0.88rem',
                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                '& fieldset': { borderColor: c.cardBorder },
                                '&:hover fieldset': { borderColor: '#059669' },
                                '&.Mui-focused fieldset': { borderColor: '#059669', borderWidth: 2 },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Select Category</em>
                        </MenuItem>
                        <MenuItem value="Student">Student / Mahasiswa</MenuItem>
                        <MenuItem value="Professional">Professional (IAGI Member)</MenuItem>
                        <MenuItem value="International Delegate">Professional and Non-IAGI Member</MenuItem>
                    </TextField>
                </Box>

                {/* Email verification notice */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <Alert severity="warning" sx={{ borderRadius: '12px', fontSize: '0.8rem' }}>
                        Your email address is unverified.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            style={{ fontWeight: 700, color: '#059669', textDecoration: 'underline' }}
                        >
                            Click here to resend the verification email.
                        </Link>
                        {status === 'verification-link-sent' && (
                            <Typography sx={{ color: '#059669', fontWeight: 700, mt: 0.5, fontSize: '0.75rem' }}>
                                A new verification link has been sent to your email address.
                            </Typography>
                        )}
                    </Alert>
                )}

                {/* Save Button */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 1 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={processing}
                        startIcon={processing ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #094d42 0%, #059669 100%)',
                            color: '#ffffff',
                            borderRadius: '12px',
                            px: 3,
                            py: 1.2,
                            textTransform: 'none',
                            fontWeight: 800,
                            fontSize: '0.86rem',
                            letterSpacing: '0.02em',
                            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #063830 0%, #047857 100%)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 18px rgba(5, 150, 105, 0.4)',
                            },
                        }}
                    >
                        {processing ? 'Saving...' : 'Save Profile'}
                    </Button>

                    {recentlySuccessful && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: '#059669' }}>
                            <CheckCircleIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>
                                Profile saved successfully!
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Stack>
        </form>
    );
}
