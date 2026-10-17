import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import SparklesIcon from '@mui/icons-material/AutoAwesome';
import { alpha } from '@mui/material/styles';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
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
            <Head title="Sign In - 55th PIT IAGI - GEOSEA XIX 2026" />

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
                    <LoginIcon sx={{ fontSize: 26, color: tealPrimary }} />
                </Box>

                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        fontWeight: 900,
                        color: '#0f172a',
                        fontSize: { xs: '1.5rem', sm: '1.8rem' },
                        letterSpacing: '-0.025em',
                        lineHeight: 1.25,
                        mb: 0.6,
                    }}
                >
                    Welcome Back
                </Typography>
                <Typography
                    sx={{
                        color: '#64748b',
                        fontSize: '0.88rem',
                        fontWeight: 400,
                    }}
                >
                    Sign in to access your author & delegate dashboard
                </Typography>
            </Box>

            {/* Status Message */}
            {status && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 3,
                        borderRadius: '12px',
                        bgcolor: alpha(tealPrimary, 0.08),
                        color: tealDark,
                        fontWeight: 500,
                        '& .MuiAlert-icon': { color: tealPrimary },
                        border: `1px solid ${alpha(tealPrimary, 0.25)}`,
                    }}
                >
                    {status}
                </Alert>
            )}

            <form onSubmit={submit}>
                {/* Email Field with Clean Above-Label */}
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
                            letterSpacing: '0.01em',
                        }}
                    >
                        Email Address <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                    </Typography>
                    <TextField
                        id="email"
                        type="email"
                        fullWidth
                        placeholder="you@institution.edu"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        autoComplete="username"
                        autoFocus
                        required
                        slotProps={{
                            input: {
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

                {/* Password Field with Clean Above-Label */}
                <Box sx={{ mb: 1.6 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.6 }}>
                        <Typography
                            component="label"
                            htmlFor="password"
                            sx={{
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                color: '#334155',
                                letterSpacing: '0.01em',
                            }}
                        >
                            Password <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                        </Typography>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                style={{
                                    color: tealPrimary,
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    transition: 'color 0.15s ease',
                                }}
                            >
                                Forgot password?
                            </Link>
                        )}
                    </Box>
                    <TextField
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        placeholder="Enter your password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        autoComplete="current-password"
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

                {/* Remember Me Checkbox */}
                <Box sx={{ mb: 2.8 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                sx={{
                                    color: '#cbd5e1',
                                    '&.Mui-checked': { color: tealPrimary },
                                    padding: '4px 6px',
                                }}
                                size="small"
                            />
                        }
                        label={
                            <Typography sx={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 500 }}>
                                Keep me signed in on this device
                            </Typography>
                        }
                    />
                </Box>

                {/* 21st.dev Style Signature Primary CTA Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={processing}
                    startIcon={
                        processing ? (
                            <CircularProgress size={18} sx={{ color: 'white' }} />
                        ) : (
                            <LoginIcon sx={{ fontSize: 19 }} />
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
                    {processing ? 'Signing in...' : 'Sign In to Account'}
                </Button>

                {/* Divider */}
                <Divider sx={{ my: 2.8 }}>
                    <Typography
                        sx={{
                            color: '#94a3b8',
                            fontSize: '0.72rem',
                            px: 1.4,
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                        }}
                    >
                        NEW TO PIT IAGI - GEOSEA?
                    </Typography>
                </Divider>

                {/* Secondary Register Button */}
                <Button
                    component={Link}
                    href={route('register')}
                    fullWidth
                    variant="outlined"
                    startIcon={<PersonAddOutlinedIcon sx={{ fontSize: 19 }} />}
                    sx={{
                        py: 1.25,
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        color: tealDark,
                        borderColor: '#e2e8f0',
                        borderWidth: '1.5px',
                        background: '#ffffff',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            borderColor: tealPrimary,
                            borderWidth: '1.5px',
                            bgcolor: alpha(tealPrimary, 0.05),
                            transform: 'translateY(-1.5px)',
                            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.08)',
                        },
                        '&:active': {
                            transform: 'translateY(1px)',
                        },
                    }}
                >
                    Create Author / Delegate Account
                </Button>
            </form>
        </GuestLayout>
    );
}
