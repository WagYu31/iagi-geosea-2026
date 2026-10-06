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
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';

// Icons
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import LoginIcon from '@mui/icons-material/Login';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PublicIcon from '@mui/icons-material/Public';
import VerifiedIcon from '@mui/icons-material/Verified';

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
        category: 'Professional',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const tealPrimary = '#0d9488';
    const tealDark = '#094d42';

    // Premium clean input styling - labels placed ABOVE input, avoiding MUI legend notches
    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            backgroundColor: '#f8fafc',
            transition: 'all 0.2s ease',
            fontSize: '0.88rem',
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
                boxShadow: '0 0 0 3px rgba(13, 148, 136, 0.12)',
            },
            '&.Mui-error fieldset': {
                borderColor: '#ef4444',
            },
        },
        '& .MuiFormHelperText-root': {
            mx: 0.5,
            mt: 0.5,
            fontSize: '0.75rem',
            fontWeight: 500,
        },
    };

    const categories = [
        {
            id: 'Student',
            title: 'Student',
            subtitle: 'Undergrad & Postgrad',
            icon: SchoolOutlinedIcon,
        },
        {
            id: 'Professional',
            title: 'Professional',
            subtitle: 'IAGI Member / Domestic',
            icon: WorkOutlineIcon,
        },
        {
            id: 'International Delegate',
            title: 'International',
            subtitle: 'Non-IAGI / Overseas',
            icon: PublicIcon,
        },
    ];

    return (
        <GuestLayout wide={true}>
            <Head title="Author & Delegate Registration - 55th PIT IAGI - GEOSEA XIX 2026" />

            {/* UNIFIED MASTER CARD: Pure CSS Flexbox Side-by-Side on Desktop */}
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    borderRadius: { xs: '20px', md: '24px' },
                    overflow: 'hidden',
                    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4)',
                    border: '1.5px solid rgba(255, 255, 255, 0.16)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'stretch',
                }}
            >
                {/* ======================================================== */}
                {/* LEFT PANEL: 39% Width - Conference Identity & Author Hub */}
                {/* ======================================================== */}
                <Box
                    sx={{
                        width: { xs: '100%', md: '39%' },
                        p: { xs: 3.5, sm: 4, lg: 4.8 },
                        background: 'linear-gradient(165deg, #094d42 0%, #06372f 50%, #022620 100%)',
                        borderRight: { md: '1px solid rgba(77, 212, 172, 0.16)' },
                        borderBottom: { xs: '1px solid rgba(77, 212, 172, 0.16)', md: 'none' },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        color: '#ffffff',
                    }}
                >
                    <Box>
                        {/* Conference Emblem & Title */}
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                            <Box
                                sx={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: '14px',
                                    bgcolor: '#ffffff',
                                    p: 0.8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                                    flexShrink: 0,
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/favicon.ico"
                                    alt="PIT IAGI Logo"
                                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </Box>
                            <Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#34d399',
                                        fontWeight: 800,
                                        letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                        fontSize: '0.68rem',
                                        display: 'block',
                                    }}
                                >
                                    Annual Convention & Exhibition
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 900,
                                        lineHeight: 1.2,
                                        fontSize: { xs: '1.1rem', sm: '1.22rem' },
                                        color: '#ffffff',
                                    }}
                                >
                                    55ᵀᴴ PIT IAGI · GEOSEA XIX 2026
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Theme Quote */}
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.88)',
                                fontSize: '0.86rem',
                                lineHeight: 1.55,
                                mb: 3.5,
                                fontStyle: 'italic',
                                borderLeft: '3px solid #34d399',
                                pl: 1.8,
                            }}
                        >
                            “Harmony of Geoscience and Technology for Sustainable Future”
                        </Typography>

                        {/* Author Privileges Showcase */}
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#6ee7b7',
                                fontWeight: 800,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                fontSize: '0.72rem',
                                display: 'block',
                                mb: 2,
                            }}
                        >
                            Author & Delegate Privileges
                        </Typography>

                        <Stack spacing={2}>
                            <Box
                                sx={{
                                    p: 1.8,
                                    borderRadius: '14px',
                                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    display: 'flex',
                                    gap: 1.5,
                                    alignItems: 'flex-start',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                                        borderColor: 'rgba(52, 211, 153, 0.25)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 0.8,
                                        borderRadius: '10px',
                                        bgcolor: 'rgba(16, 185, 129, 0.2)',
                                        color: '#34d399',
                                        display: 'flex',
                                        flexShrink: 0,
                                    }}
                                >
                                    <ArticleOutlinedIcon sx={{ fontSize: 20 }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.86rem', color: '#ffffff' }}>
                                        Abstract & Paper Submission
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.76rem', lineHeight: 1.4, display: 'block', mt: 0.3 }}>
                                        Oral & poster research tracks with peer-review workflow and indexed proceedings.
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    p: 1.8,
                                    borderRadius: '14px',
                                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    display: 'flex',
                                    gap: 1.5,
                                    alignItems: 'flex-start',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                                        borderColor: 'rgba(52, 211, 153, 0.25)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 0.8,
                                        borderRadius: '10px',
                                        bgcolor: 'rgba(16, 185, 129, 0.2)',
                                        color: '#34d399',
                                        display: 'flex',
                                        flexShrink: 0,
                                    }}
                                >
                                    <GroupsOutlinedIcon sx={{ fontSize: 20 }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.86rem', color: '#ffffff' }}>
                                        Regional Geoscience Network
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.76rem', lineHeight: 1.4, display: 'block', mt: 0.3 }}>
                                        Connect with over 1,500+ ASEAN geoscientists, academics, and energy leaders.
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    p: 1.8,
                                    borderRadius: '14px',
                                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    display: 'flex',
                                    gap: 1.5,
                                    alignItems: 'flex-start',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                                        borderColor: 'rgba(52, 211, 153, 0.25)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 0.8,
                                        borderRadius: '10px',
                                        bgcolor: 'rgba(16, 185, 129, 0.2)',
                                        color: '#34d399',
                                        display: 'flex',
                                        flexShrink: 0,
                                    }}
                                >
                                    <EmojiEventsOutlinedIcon sx={{ fontSize: 20 }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.86rem', color: '#ffffff' }}>
                                        Scored Reviews & Official Awards
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.76rem', lineHeight: 1.4, display: 'block', mt: 0.3 }}>
                                        Accredited participation certificates, jury scoring, and best paper awards.
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Box>

                    {/* Bottom Organizer Signature */}
                    <Box sx={{ mt: 4, pt: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <VerifiedIcon sx={{ color: '#34d399', fontSize: 18 }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.82)', fontWeight: 600, fontSize: '0.78rem' }}>
                                Organized by Ikatan Ahli Geologi Indonesia (IAGI) & GEOSEA
                            </Typography>
                        </Stack>
                    </Box>
                </Box>

                {/* ======================================================== */}
                {/* RIGHT PANEL: 61% Width - Clean, Modern Registration Form  */}
                {/* ======================================================== */}
                <Box
                    sx={{
                        width: { xs: '100%', md: '61%' },
                        p: { xs: 3.5, sm: 4, lg: 4.8 },
                        bgcolor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'relative',
                    }}
                >
                    {/* Top Accent Gradient Bar */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3.5px',
                            background: 'linear-gradient(90deg, #0d9488 0%, #10b981 50%, #34d399 100%)',
                        }}
                    />

                    {/* Form Header */}
                    <Box sx={{ mb: 3 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.8,
                                px: 1.2,
                                py: 0.4,
                                bgcolor: alpha(tealPrimary, 0.08),
                                borderRadius: '6px',
                                mb: 1.2,
                            }}
                        >
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: tealPrimary }} />
                            <Typography
                                sx={{
                                    color: tealDark,
                                    fontWeight: 800,
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Author & Presenter Portal
                            </Typography>
                        </Box>
                        <Typography
                            variant="h5"
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                color: '#0f172a',
                                fontSize: { xs: '1.45rem', sm: '1.75rem' },
                                letterSpacing: '-0.02em',
                                mb: 0.5,
                            }}
                        >
                            Create Your Account
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                            Register as an author or presenter for 55ᵀᴴ PIT IAGI-GEOSEA XIX 2026.
                        </Typography>
                    </Box>

                    {/* Flash Alerts */}
                    {flash?.success && (
                        <Alert severity="success" sx={{ mb: 2.5, borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                            {flash.success}
                        </Alert>
                    )}
                    {flash?.error && (
                        <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px', border: '1px solid #fecaca' }}>
                            {flash.error}
                        </Alert>
                    )}

                    <form onSubmit={submit}>
                        {/* 1. ACCOUNT CREDENTIALS */}
                        <Box sx={{ mb: 2.6 }}>
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    color: tealDark,
                                    fontSize: '0.76rem',
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    mb: 1.2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.6,
                                }}
                            >
                                <LockOutlinedIcon sx={{ fontSize: 15, color: tealPrimary }} />
                                Account Credentials
                            </Typography>

                            {/* Email */}
                            <Box sx={{ mb: 1.8 }}>
                                <Typography
                                    component="label"
                                    htmlFor="email"
                                    sx={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', mb: 0.6 }}
                                >
                                    Email Address (Login Username) <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                                </Typography>
                                <TextField
                                    id="email"
                                    type="email"
                                    fullWidth
                                    size="small"
                                    placeholder="author@institution.edu"
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
                                                    <EmailOutlinedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={textFieldSx}
                                />
                            </Box>

                            {/* Password & Confirm Password (Grid 2-col) */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.6 }}>
                                <Box>
                                    <Typography
                                        component="label"
                                        htmlFor="password"
                                        sx={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', mb: 0.6 }}
                                    >
                                        Password <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                                    </Typography>
                                    <TextField
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        fullWidth
                                        size="small"
                                        placeholder="Min. 8 characters"
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
                                                        <LockOutlinedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            size="small"
                                                        >
                                                            {showPassword ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        sx={textFieldSx}
                                    />
                                </Box>
                                <Box>
                                    <Typography
                                        component="label"
                                        htmlFor="password_confirmation"
                                        sx={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', mb: 0.6 }}
                                    >
                                        Confirm Password <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                                    </Typography>
                                    <TextField
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        fullWidth
                                        size="small"
                                        placeholder="Repeat password"
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
                                                        <LockOutlinedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle confirm password visibility"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            edge="end"
                                                            size="small"
                                                        >
                                                            {showConfirmPassword ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        sx={textFieldSx}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* 2. PROFILE & AFFILIATION */}
                        <Box sx={{ mb: 2.6 }}>
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    color: tealDark,
                                    fontSize: '0.76rem',
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    mb: 1.2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.6,
                                }}
                            >
                                <PersonOutlineIcon sx={{ fontSize: 16, color: tealPrimary }} />
                                Profile & Affiliation
                            </Typography>

                            {/* Full Name & WhatsApp (Grid 2-col) */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.6, mb: 1.6 }}>
                                <Box>
                                    <Typography
                                        component="label"
                                        htmlFor="full_name"
                                        sx={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', mb: 0.6 }}
                                    >
                                        Full Name (with title if any) <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                                    </Typography>
                                    <TextField
                                        id="full_name"
                                        type="text"
                                        fullWidth
                                        size="small"
                                        placeholder="e.g. Dr. Jane Doe, S.T., M.T."
                                        value={data.full_name}
                                        onChange={(e) => setData('full_name', e.target.value)}
                                        error={!!errors.full_name}
                                        helperText={errors.full_name}
                                        autoComplete="name"
                                        required
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonOutlineIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        sx={textFieldSx}
                                    />
                                </Box>
                                <Box>
                                    <Typography
                                        component="label"
                                        htmlFor="whatsapp"
                                        sx={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', mb: 0.6 }}
                                    >
                                        WhatsApp / Phone Number <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                                    </Typography>
                                    <TextField
                                        id="whatsapp"
                                        type="tel"
                                        fullWidth
                                        size="small"
                                        placeholder="+62 812..."
                                        value={data.whatsapp}
                                        onChange={(e) => setData('whatsapp', e.target.value)}
                                        error={!!errors.whatsapp}
                                        helperText={errors.whatsapp}
                                        autoComplete="tel"
                                        required
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <WhatsAppIcon sx={{ color: '#16a34a', fontSize: 18 }} />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        sx={textFieldSx}
                                    />
                                </Box>
                            </Box>

                            {/* Affiliation */}
                            <Box>
                                <Typography
                                    component="label"
                                    htmlFor="affiliation"
                                    sx={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', mb: 0.6 }}
                                >
                                    Affiliation / Institution / University <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                                </Typography>
                                <TextField
                                    id="affiliation"
                                    type="text"
                                    fullWidth
                                    size="small"
                                    placeholder="e.g. ITB / Pertamina / Chevron / Universiti Malaya"
                                    value={data.affiliation}
                                    onChange={(e) => setData('affiliation', e.target.value)}
                                    error={!!errors.affiliation}
                                    helperText={errors.affiliation}
                                    required
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <BusinessOutlinedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={textFieldSx}
                                />
                            </Box>
                        </Box>

                        {/* 3. PARTICIPANT CATEGORY CARDS */}
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    color: tealDark,
                                    fontSize: '0.76rem',
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    mb: 1.2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.6,
                                }}
                            >
                                <CategoryOutlinedIcon sx={{ fontSize: 15, color: tealPrimary }} />
                                Participant Category <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                            </Typography>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1.4 }}>
                                {categories.map((cat) => {
                                    const isSelected = data.category === cat.id;
                                    const IconComponent = cat.icon;
                                    return (
                                        <Box
                                            key={cat.id}
                                            onClick={() => setData('category', cat.id)}
                                            sx={{
                                                p: 1.5,
                                                borderRadius: '10px',
                                                border: isSelected ? '2px solid #0d9488' : '1.5px solid #e2e8f0',
                                                bgcolor: isSelected ? '#f0fdf4' : '#ffffff',
                                                boxShadow: isSelected ? '0 4px 14px rgba(13, 148, 136, 0.14)' : 'none',
                                                cursor: 'pointer',
                                                transition: 'all 0.18s ease',
                                                position: 'relative',
                                                '&:hover': {
                                                    borderColor: isSelected ? '#0d9488' : '#cbd5e1',
                                                    bgcolor: isSelected ? '#f0fdf4' : '#f8fafc',
                                                    transform: 'translateY(-1.5px)',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                                },
                                                '&:active': {
                                                    transform: 'translateY(1px)',
                                                },
                                            }}
                                        >
                                            {isSelected && (
                                                <CheckCircleIcon
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        fontSize: 16,
                                                        color: tealPrimary,
                                                    }}
                                                />
                                            )}
                                            <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.4 }}>
                                                <IconComponent
                                                    sx={{
                                                        fontSize: 18,
                                                        color: isSelected ? tealPrimary : '#64748b',
                                                    }}
                                                />
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        fontWeight: 700,
                                                        fontSize: '0.84rem',
                                                        color: isSelected ? '#064e3b' : '#1e293b',
                                                    }}
                                                >
                                                    {cat.title}
                                                </Typography>
                                            </Stack>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: isSelected ? tealDark : '#64748b',
                                                    fontWeight: 500,
                                                    fontSize: '0.72rem',
                                                    display: 'block',
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {cat.subtitle}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                            {errors.category && (
                                <Typography variant="caption" sx={{ color: '#ef4444', mt: 0.6, display: 'block', fontWeight: 600 }}>
                                    {errors.category}
                                </Typography>
                            )}
                        </Box>

                        {/* SUBMIT BUTTON */}
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
                                py: 1.3,
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.94rem',
                                background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 50%, #059669 100%)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 4px 16px rgba(9, 77, 66, 0.3)',
                                color: '#ffffff',
                                transition: 'all 0.15s ease',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #0d7a6a 0%, #059669 100%)',
                                    transform: 'translateY(-1.5px)',
                                    boxShadow: '0 6px 20px rgba(9, 77, 66, 0.4)',
                                },
                                '&:active': {
                                    transform: 'translateY(1px) scale(0.99)',
                                },
                                '&.Mui-disabled': {
                                    background: '#94a3b8',
                                    color: '#f8fafc',
                                },
                            }}
                        >
                            {processing ? 'Creating Your Account...' : 'Complete Registration'}
                        </Button>

                        {/* DIVIDER */}
                        <Divider sx={{ my: 2.2 }}>
                            <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem', px: 1.2, fontWeight: 600 }}>
                                ALREADY REGISTERED?
                            </Typography>
                        </Divider>

                        {/* SIGN IN LINK */}
                        <Button
                            component={Link}
                            href={route('login')}
                            fullWidth
                            variant="outlined"
                            startIcon={<LoginIcon />}
                            sx={{
                                py: 1,
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                color: tealDark,
                                borderColor: '#e2e8f0',
                                borderWidth: '1.5px',
                                background: '#ffffff',
                                '&:hover': {
                                    borderColor: tealPrimary,
                                    borderWidth: '1.5px',
                                    bgcolor: alpha(tealPrimary, 0.04),
                                },
                                '&:active': {
                                    transform: 'translateY(1px)',
                                },
                            }}
                        >
                            Already have an account? Sign In
                        </Button>
                    </form>
                </Box>
            </Paper>
        </GuestLayout>
    );
}
