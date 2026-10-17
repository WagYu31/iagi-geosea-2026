import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SendIcon from '@mui/icons-material/Send';
import LockResetIcon from '@mui/icons-material/LockReset';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { alpha } from '@mui/material/styles';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
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
            <Head title="Reset Password - 55th PIT IAGI - GEOSEA XIX 2026" />

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
                    <LockResetIcon sx={{ fontSize: 26, color: tealPrimary }} />
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
                    Reset Password
                </Typography>
                <Typography
                    sx={{
                        color: '#64748b',
                        fontSize: '0.88rem',
                        lineHeight: 1.5,
                    }}
                >
                    Enter your account email and we'll send you a secure link to reset your password.
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
                <Box sx={{ mb: 3 }}>
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
                        autoComplete="email"
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

                {/* Primary CTA Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={processing}
                    startIcon={
                        processing ? (
                            <CircularProgress size={18} sx={{ color: 'white' }} />
                        ) : (
                            <SendIcon sx={{ fontSize: 18 }} />
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
                    {processing ? 'Sending Link...' : 'Email Password Reset Link'}
                </Button>

                {/* Back to Sign In Link */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button
                        component={Link}
                        href={route('login')}
                        startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                        sx={{
                            color: tealDark,
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                                color: tealPrimary,
                                bgcolor: alpha(tealPrimary, 0.05),
                            },
                        }}
                    >
                        Return to Sign In
                    </Button>
                </Box>
            </form>
        </GuestLayout>
    );
}
