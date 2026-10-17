import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const tealPrimary = '#0d9488';
    const tealDark = '#094d42';

    // 21st.dev Clean Input Styling - Labels placed cleanly ABOVE inputs
    const modernInputSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: '#f8fafc',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            fontSize: '0.9rem',
            '& fieldset': {
                borderColor: '#e2e8f0',
                borderWidth: '1.5px',
            },
            '&:hover fieldset': {
                borderColor: '#cbd5e1',
            },
            '&.Mui-focused': {
                backgroundColor: '#ffffff',
                '& fieldset': {
                    borderColor: tealPrimary,
                    borderWidth: '1.5px',
                },
                boxShadow: '0 0 0 3.5px rgba(13, 148, 136, 0.15)',
            },
            '&.Mui-error fieldset': {
                borderColor: '#ef4444',
            },
        },
        '& .MuiFormHelperText-root': {
            mx: 0.5,
            mt: 0.6,
            fontSize: '0.78rem',
            fontWeight: 500,
        },
    };

    return (
        <GuestLayout>
            <Head title="Set New Password - 55th PIT IAGI - GEOSEA XIX 2026" />

            {/* Header with 21st.dev Badge & Icon */}
            <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 3.5 } }}>
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 54,
                        height: 54,
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.12) 0%, rgba(52, 211, 153, 0.2) 100%)',
                        border: '1px solid rgba(13, 148, 136, 0.25)',
                        boxShadow: '0 4px 16px rgba(13, 148, 136, 0.15)',
                        mb: 2,
                    }}
                >
                    <KeyIcon sx={{ fontSize: 26, color: tealPrimary }} />
                </Box>

                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        fontWeight: 900,
                        color: '#0f172a',
                        fontSize: { xs: '1.45rem', sm: '1.75rem' },
                        letterSpacing: '-0.025em',
                        lineHeight: 1.25,
                        mb: 0.6,
                    }}
                >
                    Set New Password
                </Typography>
                <Typography
                    sx={{
                        color: '#64748b',
                        fontSize: '0.88rem',
                        lineHeight: 1.5,
                    }}
                >
                    Please create a strong new password for your account.
                </Typography>
            </Box>

            <form onSubmit={submit}>
                {/* Email Field (Read Only / Pre-filled) */}
                <Box sx={{ mb: 2.2 }}>
                    <Typography
                        component="label"
                        htmlFor="email"
                        sx={{
                            display: 'block',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: '#334155',
                            mb: 0.6,
                        }}
                    >
                        Email Address
                    </Typography>
                    <TextField
                        id="email"
                        type="email"
                        fullWidth
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        autoComplete="username"
                        slotProps={{
                            input: {
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlinedIcon sx={{ color: '#94a3b8', fontSize: 19 }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={modernInputSx}
                    />
                </Box>

                {/* Password Field */}
                <Box sx={{ mb: 2.2 }}>
                    <Typography
                        component="label"
                        htmlFor="password"
                        sx={{
                            display: 'block',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: '#334155',
                            mb: 0.6,
                        }}
                    >
                        New Password <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                    </Typography>
                    <TextField
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        placeholder="Min. 8 characters"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        autoComplete="new-password"
                        autoFocus
                        required
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon sx={{ color: '#94a3b8', fontSize: 19 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            size="small"
                                            sx={{
                                                color: '#94a3b8',
                                                '&:hover': { color: tealPrimary },
                                            }}
                                        >
                                            {showPassword ? (
                                                <VisibilityOffIcon sx={{ fontSize: 19 }} />
                                            ) : (
                                                <VisibilityIcon sx={{ fontSize: 19 }} />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={modernInputSx}
                    />
                </Box>

                {/* Confirm Password Field */}
                <Box sx={{ mb: 3 }}>
                    <Typography
                        component="label"
                        htmlFor="password_confirmation"
                        sx={{
                            display: 'block',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: '#334155',
                            mb: 0.6,
                        }}
                    >
                        Confirm New Password <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                    </Typography>
                    <TextField
                        id="password_confirmation"
                        type={showConfirmPassword ? 'text' : 'password'}
                        fullWidth
                        placeholder="Repeat new password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={!!errors.password_confirmation}
                        helperText={errors.password_confirmation}
                        autoComplete="new-password"
                        required
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon sx={{ color: '#94a3b8', fontSize: 19 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                            size="small"
                                            sx={{
                                                color: '#94a3b8',
                                                '&:hover': { color: tealPrimary },
                                            }}
                                        >
                                            {showConfirmPassword ? (
                                                <VisibilityOffIcon sx={{ fontSize: 19 }} />
                                            ) : (
                                                <VisibilityIcon sx={{ fontSize: 19 }} />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={modernInputSx}
                    />
                </Box>

                {/* Submit Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={processing}
                    startIcon={
                        processing ? (
                            <CircularProgress size={18} sx={{ color: 'white' }} />
                        ) : (
                            <KeyIcon sx={{ fontSize: 18 }} />
                        )
                    }
                    sx={{
                        py: 1.4,
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        letterSpacing: '0.01em',
                        background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 50%, #059669 100%)',
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 10px 24px -5px rgba(9, 77, 66, 0.45)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #0d7a6a 0%, #059669 100%)',
                            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.45), 0 14px 28px -4px rgba(9, 77, 66, 0.55)',
                            transform: 'translateY(-2px)',
                        },
                        '&:active': {
                            transform: 'translateY(1px) scale(0.99)',
                        },
                        '&.Mui-disabled': {
                            background: '#94a3b8',
                            color: '#ffffff',
                        },
                    }}
                >
                    {processing ? 'Updating Password...' : 'Reset & Save Password'}
                </Button>
            </form>
        </GuestLayout>
    );
}
