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

    const teal = '#0d9488';
    const tealDark = '#0d7a6a';
    const tealLight = '#1abc9c';

    return (
        <GuestLayout>
            <Head title="Sign In" />

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
                    <LoginIcon sx={{ fontSize: 28, color: teal }} />
                </Box>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 800,
                        color: '#111827',
                        fontSize: { xs: '1.4rem', sm: '1.6rem' },
                        mb: 0.5,
                    }}
                >
                    Welcome Back
                </Typography>
                <Typography
                    sx={{
                        color: '#6b7280',
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    }}
                >
                    Sign in to access your account
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
                {/* Email Field */}
                <TextField
                    id="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    autoComplete="username"
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
                        mb: 2.5,
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

                {/* Password Field */}
                <TextField
                    id="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    autoComplete="current-password"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        size="small"
                                        sx={{
                                            color: '#9ca3af',
                                            '&:hover': { color: tealDark },
                                        }}
                                    >
                                        {showPassword ? (
                                            <VisibilityOffIcon sx={{ fontSize: 20 }} />
                                        ) : (
                                            <VisibilityIcon sx={{ fontSize: 20 }} />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{
                        mb: 1.5,
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

                {/* Remember Me & Forgot Password */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1, sm: 0 },
                        mb: 3,
                    }}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                sx={{
                                    color: '#d1d5db',
                                    '&.Mui-checked': { color: teal },
                                    padding: '4px 8px',
                                }}
                                size="small"
                            />
                        }
                        label={
                            <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                Remember me
                            </Typography>
                        }
                    />

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            style={{
                                color: tealDark,
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            Forgot password?
                        </Link>
                    )}
                </Box>

                {/* Sign In Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={processing}
                    startIcon={
                        processing ? (
                            <CircularProgress size={18} sx={{ color: 'white' }} />
                        ) : (
                            <LoginIcon />
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
                    {processing ? 'Signing in...' : 'Sign In'}
                </Button>

                {/* Divider */}
                <Divider sx={{ my: 3 }}>
                    <Typography
                        sx={{
                            color: '#9ca3af',
                            fontSize: '0.75rem',
                            px: 2,
                            fontWeight: 500,
                        }}
                    >
                        OR
                    </Typography>
                </Divider>

                {/* Register Link */}
                <Button
                    component={Link}
                    href={route('register')}
                    fullWidth
                    variant="outlined"
                    startIcon={<PersonAddOutlinedIcon />}
                    sx={{
                        py: 1.3,
                        borderRadius: '50px',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                        color: tealDark,
                        borderColor: alpha(teal, 0.3),
                        '&:hover': {
                            borderColor: teal,
                            bgcolor: alpha(teal, 0.05),
                        },
                    }}
                >
                    Create an account
                </Button>
            </form>
        </GuestLayout>
    );
}
