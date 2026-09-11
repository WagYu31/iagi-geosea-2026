import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import LoginIcon from '@mui/icons-material/Login';
import { alpha } from '@mui/material/styles';

export default function Register() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        full_name: '',
        affiliation: '',
        whatsapp: '',
        category: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const teal = '#0d9488';
    const tealDark = '#0d7a6a';
    const tealLight = '#1abc9c';

    const textFieldSx = {
        mb: 2,
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
    };

    return (
        <GuestLayout>
            <Head title="Register - Closed" />

            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: { xs: 2.5, sm: 3 } }}>
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '18px',
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        border: '1.5px solid #fde68a',
                        borderBottom: '3.5px solid #d97706',
                        boxShadow: '0 4px 12px rgba(217, 119, 6, 0.2)',
                        mb: 2,
                    }}
                >
                    <LockClockOutlinedIcon sx={{ fontSize: 32, color: '#92400e' }} />
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Chip
                        label="🔒 REGISTRATION CLOSED"
                        size="small"
                        sx={{
                            bgcolor: '#fee2e2',
                            color: '#991b1b',
                            fontWeight: 900,
                            fontSize: '0.72rem',
                            border: '1px solid #fca5a5',
                            borderBottom: '2.5px solid #dc2626',
                            boxShadow: '0 2px 5px rgba(220, 38, 38, 0.15)',
                            height: 24,
                            px: 0.8,
                        }}
                    />
                </Box>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 900,
                        color: '#111827',
                        fontSize: { xs: '1.4rem', sm: '1.75rem' },
                        mb: 0.5,
                    }}
                >
                    Author Registration is Closed
                </Typography>
                <Typography
                    sx={{
                        color: '#64748b',
                        fontSize: '0.86rem',
                        fontWeight: 500,
                    }}
                >
                    55ᵀᴴ PIT IAGI - GEOSEA XIX 2026 Annual Convention
                </Typography>
            </Box>

            {/* 3D Closed Notice & Conference Passes CTA Card */}
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    mb: 3,
                    borderRadius: '20px',
                    background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)',
                    border: '1.5px solid #a7f3d0',
                    borderBottom: '4.5px solid #059669',
                    boxShadow: '0 6px 20px rgba(5, 150, 105, 0.18)',
                    textAlign: 'center',
                }}
            >
                <Typography variant="body2" sx={{ color: '#065f46', fontSize: '0.88rem', lineHeight: 1.55, fontWeight: 600, mb: 2 }}>
                    Online account creation for Paper Authors & Presenters has closed. You can still register for <strong>Conference & Visitor Passes</strong>.
                </Typography>

                <Button
                    component={Link}
                    href="/tickets"
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                    sx={{
                        background: 'linear-gradient(180deg, #10b981 0%, #059669 50%, #047857 100%)',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        borderRadius: '12px',
                        py: 1.1,
                        textTransform: 'none',
                        border: '1.5px solid #34d399',
                        borderBottom: '3.5px solid #022c22',
                        boxShadow: '0 4px 14px rgba(4, 120, 87, 0.35)',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                            background: 'linear-gradient(180deg, #34d399 0%, #10b981 50%, #059669 100%)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 6px 18px rgba(4, 120, 87, 0.45)',
                        },
                    }}
                >
                    🎟️ Get Conference & Visitor Pass
                </Button>
            </Paper>

            {/* Success Message */}
            {flash?.success && (
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
                    {flash.success}
                </Alert>
            )}

            <form onSubmit={submit}>
                {/* Account Information Section */}
                <Box sx={{ mb: 1 }}>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            color: tealDark,
                            fontSize: '1rem',
                            mb: 2,
                            pb: 1,
                            borderBottom: `2px solid ${alpha(tealLight, 0.2)}`,
                        }}
                    >
                        Account Information
                    </Typography>

                    {/* Email */}
                    <TextField
                        id="email"
                        label="Email (Username)"
                        type="email"
                        fullWidth
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
                                        <EmailOutlinedIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={textFieldSx}
                    />

                    {/* Password */}
                    <TextField
                        id="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        autoComplete="new-password"
                        required
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
                                            sx={{ color: '#9ca3af', '&:hover': { color: tealDark } }}
                                        >
                                            {showPassword ? <VisibilityOffIcon sx={{ fontSize: 20 }} /> : <VisibilityIcon sx={{ fontSize: 20 }} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={textFieldSx}
                    />

                    {/* Confirm Password */}
                    <TextField
                        id="password_confirmation"
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        fullWidth
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
                                        <LockOutlinedIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                            size="small"
                                            sx={{ color: '#9ca3af', '&:hover': { color: tealDark } }}
                                        >
                                            {showConfirmPassword ? <VisibilityOffIcon sx={{ fontSize: 20 }} /> : <VisibilityIcon sx={{ fontSize: 20 }} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={textFieldSx}
                    />
                </Box>

                {/* Profile Information Section */}
                <Box sx={{ mb: 1 }}>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            color: tealDark,
                            fontSize: '1rem',
                            mb: 2,
                            pb: 1,
                            borderBottom: `2px solid ${alpha(tealLight, 0.2)}`,
                        }}
                    >
                        Profile Information
                    </Typography>

                    {/* Full Name */}
                    <TextField
                        id="full_name"
                        label="Full Name (with title if any)"
                        type="text"
                        fullWidth
                        value={data.full_name}
                        onChange={(e) => setData('full_name', e.target.value)}
                        error={!!errors.full_name}
                        helperText={errors.full_name}
                        required
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlineIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={textFieldSx}
                    />

                    {/* Affiliation */}
                    <TextField
                        id="affiliation"
                        label="Affiliation/Institution"
                        type="text"
                        fullWidth
                        value={data.affiliation}
                        onChange={(e) => setData('affiliation', e.target.value)}
                        error={!!errors.affiliation}
                        helperText={errors.affiliation}
                        required
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BusinessOutlinedIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={textFieldSx}
                    />

                    {/* WhatsApp */}
                    <TextField
                        id="whatsapp"
                        label="WhatsApp/Phone Number"
                        type="text"
                        fullWidth
                        value={data.whatsapp}
                        onChange={(e) => setData('whatsapp', e.target.value)}
                        error={!!errors.whatsapp}
                        helperText={errors.whatsapp}
                        required
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <WhatsAppIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={textFieldSx}
                    />

                    {/* Category */}
                    <TextField
                        id="category"
                        label="Participant Category"
                        select
                        fullWidth
                        value={data.category}
                        onChange={(e) => setData('category', e.target.value)}
                        error={!!errors.category}
                        helperText={errors.category}
                        required
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CategoryOutlinedIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={textFieldSx}
                    >
                        <MenuItem value="">
                            <em>Select a category</em>
                        </MenuItem>
                        <MenuItem value="Student">Student</MenuItem>
                        <MenuItem value="Professional">Professional</MenuItem>
                        <MenuItem value="International Delegate">Professional and Non-IAGI member</MenuItem>
                    </TextField>
                </Box>

                {/* Register Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={processing}
                    startIcon={
                        processing ? (
                            <CircularProgress size={18} sx={{ color: 'white' }} />
                        ) : (
                            <PersonAddOutlinedIcon />
                        )
                    }
                    sx={{
                        py: 1.5,
                        mt: 1,
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
                    {processing ? 'Creating Account...' : 'Create Account'}
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

                {/* Login Link */}
                <Button
                    component={Link}
                    href={route('login')}
                    fullWidth
                    variant="outlined"
                    startIcon={<LoginIcon />}
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
                    Already have an account? Sign in
                </Button>
            </form>
        </GuestLayout>
    );
}
