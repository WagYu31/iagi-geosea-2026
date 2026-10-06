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
import Chip from '@mui/material/Chip';
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
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PublicIcon from '@mui/icons-material/Public';

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

    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            transition: 'all 0.2s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: tealPrimary,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: tealPrimary,
                borderWidth: '2px',
            },
        },
        '& .MuiInputLabel-root': {
            fontWeight: 500,
            fontSize: '0.9rem',
            '&.Mui-focused': {
                color: tealDark,
                fontWeight: 600,
            },
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
            <Head title="Register Author & Delegate - 55th PIT IAGI - GEOSEA XIX 2026" />

            {/* UNIFIED MASTER CARD: Pure CSS Flexbox Side-by-Side on Desktop */}
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    borderRadius: { xs: '20px', md: '26px' },
                    overflow: 'hidden',
                    boxShadow: '0 24px 75px rgba(0, 0, 0, 0.4)',
                    border: '1.5px solid rgba(255, 255, 255, 0.18)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'stretch',
                }}
            >
                {/* ======================================================== */}
                {/* LEFT PANEL: 40% Width - Conference Identity & Author Hub */}
                {/* ======================================================== */}
                <Box
                    sx={{
                        width: { xs: '100%', md: '40%' },
                        p: { xs: 3, sm: 4, lg: 4.5 },
                        background: 'linear-gradient(165deg, #094d42 0%, #06372f 50%, #03231e 100%)',
                        borderRight: { md: '1px solid rgba(77, 212, 172, 0.18)' },
                        borderBottom: { xs: '1px solid rgba(77, 212, 172, 0.18)', md: 'none' },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        color: '#ffffff',
                    }}
                >
                    <Box>
                        {/* Conference Emblem & Title */}
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
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
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
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
                                        fontSize: '0.7rem',
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
                                        fontSize: { xs: '1.05rem', sm: '1.15rem' },
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
                                color: 'rgba(255, 255, 255, 0.82)',
                                fontSize: '0.85rem',
                                lineHeight: 1.5,
                                mb: 2.5,
                                fontStyle: 'italic',
                                borderLeft: '3px solid #34d399',
                                pl: 1.5,
                            }}
                        >
                            “Harmony of Geoscience and Technology for Sustainable Future”
                        </Typography>

                        {/* Date & Location Chips */}
                        <Stack spacing={1} sx={{ mb: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <EventOutlinedIcon sx={{ color: '#34d399', fontSize: 18 }} />
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600, fontSize: '0.82rem' }}>
                                    September 28 – October 1, 2026
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <PlaceOutlinedIcon sx={{ color: '#34d399', fontSize: 18 }} />
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600, fontSize: '0.82rem' }}>
                                    Grand Ballroom, Balikpapan, East Kalimantan
                                </Typography>
                            </Stack>
                        </Stack>

                        {/* Author Hub Benefits */}
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#6ee7b7',
                                fontWeight: 800,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                fontSize: '0.72rem',
                                display: 'block',
                                mb: 1.5,
                            }}
                        >
                            Author & Delegate Privileges
                        </Typography>

                        <Stack spacing={1.8} sx={{ mb: 3 }}>
                            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                <Box
                                    sx={{
                                        p: 0.6,
                                        borderRadius: '8px',
                                        bgcolor: 'rgba(16, 185, 129, 0.2)',
                                        color: '#34d399',
                                        display: 'flex',
                                    }}
                                >
                                    <ArticleOutlinedIcon sx={{ fontSize: 18 }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#ffffff' }}>
                                        Abstract & Paper Submission
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.76rem', lineHeight: 1.35, display: 'block' }}>
                                        Oral & poster research tracks with peer-review workflow.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                <Box
                                    sx={{
                                        p: 0.6,
                                        borderRadius: '8px',
                                        bgcolor: 'rgba(16, 185, 129, 0.2)',
                                        color: '#34d399',
                                        display: 'flex',
                                    }}
                                >
                                    <GroupsOutlinedIcon sx={{ fontSize: 18 }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#ffffff' }}>
                                        Regional Geoscience Network
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.76rem', lineHeight: 1.35, display: 'block' }}>
                                        Connect with over 1,500+ ASEAN geoscientists & leaders.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                <Box
                                    sx={{
                                        p: 0.6,
                                        borderRadius: '8px',
                                        bgcolor: 'rgba(16, 185, 129, 0.2)',
                                        color: '#34d399',
                                        display: 'flex',
                                    }}
                                >
                                    <EmojiEventsOutlinedIcon sx={{ fontSize: 18 }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#ffffff' }}>
                                        Presentation Scoring & Awards
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.76rem', lineHeight: 1.35, display: 'block' }}>
                                        Accredited participation certificates and best-paper awards.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>

                    {/* Quick Link for General Attendees / Visitor Passes */}
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: '14px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.8 }}>
                            <ConfirmationNumberOutlinedIcon sx={{ color: '#34d399', fontSize: 18 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#34d399', fontSize: '0.82rem' }}>
                                Attending Without Submitting a Paper?
                            </Typography>
                        </Stack>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.76rem', display: 'block', mb: 1.2, lineHeight: 1.35 }}>
                            You can get a Conference Pass or Visitor Pass directly without an author account:
                        </Typography>
                        <Button
                            component={Link}
                            href="/tickets"
                            variant="contained"
                            size="small"
                            fullWidth
                            endIcon={<ArrowForwardIcon sx={{ fontSize: '15px !important' }} />}
                            sx={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                borderRadius: '8px',
                                textTransform: 'none',
                                py: 0.7,
                                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                                },
                            }}
                        >
                            Get Conference & Visitor Pass
                        </Button>
                    </Box>
                </Box>

                {/* ======================================================== */}
                {/* RIGHT PANEL: 60% Width - Modern Registration Form        */}
                {/* ======================================================== */}
                <Box
                    sx={{
                        width: { xs: '100%', md: '60%' },
                        p: { xs: 3, sm: 4, lg: 4.5 },
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
                    <Box sx={{ mb: 2.5 }}>
                        <Chip
                            label="AUTHOR & DELEGATE REGISTRATION"
                            size="small"
                            sx={{
                                bgcolor: alpha(tealPrimary, 0.08),
                                color: tealDark,
                                fontWeight: 800,
                                fontSize: '0.7rem',
                                letterSpacing: '0.06em',
                                borderRadius: '6px',
                                mb: 1,
                            }}
                        />
                        <Typography
                            variant="h5"
                            component="h1"
                            sx={{
                                fontWeight: 900,
                                color: '#0f172a',
                                fontSize: { xs: '1.45rem', sm: '1.75rem' },
                                letterSpacing: '-0.02em',
                                mb: 0.4,
                            }}
                        >
                            Create Your Account
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.86rem' }}>
                            Register as an author or delegate for 55ᵀᴴ PIT IAGI-GEOSEA XIX 2026.
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
                        <Box sx={{ mb: 2.5 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 800,
                                    color: tealDark,
                                    fontSize: '0.78rem',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    mb: 1.2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.6,
                                }}
                            >
                                <LockOutlinedIcon sx={{ fontSize: 16, color: tealPrimary }} />
                                Account Credentials
                            </Typography>

                            {/* Email */}
                            <TextField
                                id="email"
                                label="Email Address (Login Username) *"
                                type="email"
                                fullWidth
                                size="small"
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
                                sx={{ ...textFieldSx, mb: 1.8 }}
                            />

                            {/* Password & Confirm Password (Grid 2-col) */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.8 }}>
                                <TextField
                                    id="password"
                                    label="Password *"
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    size="small"
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
                                                    >
                                                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={textFieldSx}
                                />
                                <TextField
                                    id="password_confirmation"
                                    label="Confirm Password *"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    fullWidth
                                    size="small"
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
                                                    >
                                                        {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={textFieldSx}
                                />
                            </Box>
                        </Box>

                        {/* 2. PROFILE & AFFILIATION */}
                        <Box sx={{ mb: 2.5 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 800,
                                    color: tealDark,
                                    fontSize: '0.78rem',
                                    letterSpacing: '0.05em',
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
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.8, mb: 1.8 }}>
                                <TextField
                                    id="full_name"
                                    label="Full Name (with title if any) *"
                                    type="text"
                                    fullWidth
                                    size="small"
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
                                                    <PersonOutlineIcon sx={{ color: '#94a3b8', fontSize: 19 }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={textFieldSx}
                                />
                                <TextField
                                    id="whatsapp"
                                    label="WhatsApp / Phone Number *"
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
                                                    <WhatsAppIcon sx={{ color: '#16a34a', fontSize: 19 }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={textFieldSx}
                                />
                            </Box>

                            {/* Affiliation */}
                            <TextField
                                id="affiliation"
                                label="Affiliation / Institution / University *"
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
                                                <BusinessOutlinedIcon sx={{ color: '#94a3b8', fontSize: 19 }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                                sx={textFieldSx}
                            />
                        </Box>

                        {/* 3. PARTICIPANT CATEGORY CARDS */}
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 800,
                                    color: tealDark,
                                    fontSize: '0.78rem',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    mb: 1.2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.6,
                                }}
                            >
                                <CategoryOutlinedIcon sx={{ fontSize: 16, color: tealPrimary }} />
                                Participant Category *
                            </Typography>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1.5 }}>
                                {categories.map((cat) => {
                                    const isSelected = data.category === cat.id;
                                    const IconComponent = cat.icon;
                                    return (
                                        <Box
                                            key={cat.id}
                                            onClick={() => setData('category', cat.id)}
                                            sx={{
                                                p: 1.5,
                                                borderRadius: '12px',
                                                border: isSelected ? '2px solid #0d9488' : '1.5px solid #e2e8f0',
                                                borderBottom: isSelected ? '3.5px solid #064e3b' : '1.5px solid #cbd5e1',
                                                bgcolor: isSelected ? alpha(tealPrimary, 0.06) : '#ffffff',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                                position: 'relative',
                                                '&:hover': {
                                                    borderColor: isSelected ? '#0d9488' : '#94a3b8',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
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
                                                        fontWeight: 800,
                                                        fontSize: '0.82rem',
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
                                                    fontWeight: 600,
                                                    fontSize: '0.72rem',
                                                    display: 'block',
                                                    lineHeight: 1.25,
                                                }}
                                            >
                                                {cat.subtitle}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                            {errors.category && (
                                <Typography variant="caption" sx={{ color: '#dc2626', mt: 0.6, display: 'block', fontWeight: 600 }}>
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
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 800,
                                fontSize: '0.95rem',
                                background: 'linear-gradient(135deg, #094d42 0%, #0d9488 50%, #10b981 100%)',
                                border: '1px solid #34d399',
                                borderBottom: '3.5px solid #022c22',
                                boxShadow: '0 4px 16px rgba(9, 77, 66, 0.35)',
                                color: '#ffffff',
                                transition: 'all 0.15s ease',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #0d7a6a 0%, #10b981 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(9, 77, 66, 0.45)',
                                },
                                '&:active': {
                                    transform: 'translateY(1.5px)',
                                    borderBottom: '1.5px solid #022c22',
                                },
                                '&.Mui-disabled': {
                                    background: '#94a3b8',
                                    color: '#f8fafc',
                                    borderBottom: '2px solid #64748b',
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
                                fontSize: '0.86rem',
                                color: tealDark,
                                borderColor: '#cbd5e1',
                                borderBottom: '2.5px solid #cbd5e1',
                                background: '#ffffff',
                                '&:hover': {
                                    borderColor: tealPrimary,
                                    borderBottom: '2.5px solid #0d7a6a',
                                    bgcolor: alpha(tealPrimary, 0.04),
                                },
                                '&:active': {
                                    transform: 'translateY(1px)',
                                    borderBottom: '1.5px solid #0d7a6a',
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
