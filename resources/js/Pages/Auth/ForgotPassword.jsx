import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
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
import { alpha } from '@mui/material/styles';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    const teal = '#0d9488';
    const tealDark = '#0d7a6a';
    const tealLight = '#1abc9c';

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 56,
                        height: 56,
                        borderRadius: '16px',
                        background: `linear-gradient(135deg, ${alpha(teal, 0.1)}, ${alpha(tealLight, 0.15)})`,
                        mb: 2,
                    }}
                >
                    <LockResetIcon sx={{ fontSize: 28, color: teal }} />
                </Box>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 800,
                        color: '#111827',
                        fontSize: { xs: '1.4rem', sm: '1.6rem' },
                        mb: 1,
                    }}
                >
                    Reset Password
                </Typography>
                <Typography
                    sx={{
                        color: '#6b7280',
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                        lineHeight: 1.5,
                    }}
                >
                    Enter your email address and we'll send you a password reset link.
                </Typography>
            </Box>

            {/* Status Message */}
            {status && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 3,
                        borderRadius: '12px',
                        bgcolor: alpha(teal, 0.08),
                        color: tealDark,
                        '& .MuiAlert-icon': { color: teal },
                        border: `1px solid ${alpha(teal, 0.2)}`,
                    }}
                >
                    {status}
                </Alert>
            )}

            <form onSubmit={submit}>
                <TextField
                    id="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    autoComplete="email"
                    autoFocus
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailOutlinedIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: teal,
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: teal,
                                borderWidth: '2px',
                            },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: tealDark,
                        },
                    }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={processing}
                    startIcon={
                        processing ? (
                            <CircularProgress size={18} sx={{ color: 'white' }} />
                        ) : (
                            <SendIcon />
                        )
                    }
                    sx={{
                        py: 1.5,
                        borderRadius: '50px',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                        letterSpacing: '0.08em',
                        bgcolor: tealLight,
                        boxShadow: `0 6px 24px ${alpha(tealLight, 0.4)}`,
                        '&:hover': {
                            bgcolor: tealDark,
                            boxShadow: `0 8px 32px ${alpha(tealDark, 0.5)}`,
                            transform: 'translateY(-2px)',
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        },
                        transition: 'all 0.3s ease',
                        '&.Mui-disabled': {
                            bgcolor: '#d1d5db',
                            color: 'white',
                        },
                    }}
                >
                    {processing ? 'Sending...' : 'Email Password Reset Link'}
                </Button>
            </form>
        </GuestLayout>
    );
}
