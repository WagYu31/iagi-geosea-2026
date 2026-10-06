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
import Grid from '@mui/material/Grid';
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
        category: 'Professional', // Default recommended category
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
    const tealAccent = '#10b981';

    const textFieldSx = {
        mb: 2,
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
            fontSize: '0.92rem',
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
            desc: 'For students enrolled in universities/institutions',
        },
        {
            id: 'Professional',
            title: 'Professional',
            subtitle: 'IAGI Member / Domestic',
            icon: WorkOutlineIcon,
            desc: 'For industry professionals and Indonesian delegates',
        },
        {
            id: 'International Delegate',
            title: 'International',
            subtitle: 'Non-IAGI / Overseas',
            icon: PublicIcon,
            desc: 'For international & non-IAGI member delegates',
        },
    ];

    return (
        <GuestLayout wide={true}>
            <Head title="Author & Delegate Registration - 55th PIT IAGI - GEOSEA XIX 2026" />

            <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="stretch">
                {/* LEFT COLUMN: Conference Showcase & Author Hub */}
                <Grid item xs={12} md={5} sx={{ display: 'flex' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            width: '100%',
                            p: { xs: 3, sm: 4, lg: 4.5 },
                            borderRadius: '24px',
                            background: 'linear-gradient(165deg, rgba(255, 255, 255, 0.08) 0%, rgba(13, 148, 136, 0.15) 100%)',
                            border: '1.5px solid rgba(77, 212, 172, 0.25)',
                            borderBottom: '4px solid rgba(6, 78, 59, 0.6)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            color: '#ffffff',
                        }}
                    >
                        <Box>
                            {/* Brand Header */}
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '16px',
                                        bgcolor: '#ffffff',
                                        p: 0.8,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
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
                                            color: '#6ee7b7',
                                            fontWeight: 800,
                                            letterSpacing: '0.12em',
                                            textTransform: 'uppercase',
                                            fontSize: '0.72rem',
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
                                            fontSize: { xs: '1.05rem', sm: '1.2rem' },
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
                                    color: 'rgba(255, 255, 255, 0.85)',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.55,
                                    mb: 3,
                                    fontStyle: 'italic',
                                    borderLeft: '3px solid #34d399',
                                    pl: 1.5,
                                }}
                            >
                                “Harmony of Geoscience and Technology for Sustainable Future”
                            </Typography>

                            {/* Event Logistics Badge */}
                            <Stack spacing={1.2} sx={{ mb: 3.5 }}>
                                <Stack direction="row" spacing={1.2} alignItems="center">
                                    <EventOutlinedIcon sx={{ color: '#34d399', fontSize: 20 }} />
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600, fontSize: '0.84rem' }}>
                                        September 28 – October 1, 2026
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1.2} alignItems="center">
                                    <PlaceOutlinedIcon sx={{ color: '#34d399', fontSize: 20 }} />
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600, fontSize: '0.84rem' }}>
                                        Grand Ballroom, Balikpapan, East Kalimantan
                                    </Typography>
                                </Stack>
                            </Stack>

                            {/* Author Benefits List */}
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#6ee7b7',
                                    fontWeight: 800,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    fontSize: '0.74rem',
                                    display: 'block',
                                    mb: 1.5,
                                }}
                            >
                                Author & Presenter Hub
                            </Typography>

                            <Stack spacing={2} sx={{ mb: 3.5 }}>
                                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                    <Box
                                        sx={{
                                            p: 0.8,
                                            borderRadius: '10px',
                                            bgcolor: 'rgba(16, 185, 129, 0.2)',
                                            color: '#34d399',
                                            display: 'flex',
                                        }}
                                    >
                                        <ArticleOutlinedIcon sx={{ fontSize: 20 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>
                                            Abstract & Paper Submissions
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.78rem', lineHeight: 1.4, display: 'block' }}>
                                            Submit and track oral and poster presentations through our peer-review workflow.
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                    <Box
                                        sx={{
                                            p: 0.8,
                                            borderRadius: '10px',
                                            bgcolor: 'rgba(16, 185, 129, 0.2)',
                                            color: '#34d399',
                                            display: 'flex',
                                        }}
                                    >
                                        <GroupsOutlinedIcon sx={{ fontSize: 20 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>
                                            Regional Geoscience Network
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.78rem', lineHeight: 1.4, display: 'block' }}>
                                            Engage with researchers, academics, and energy industry delegates across ASEAN.
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                    <Box
                                        sx={{
                                            p: 0.8,
                                            borderRadius: '10px',
                                            bgcolor: 'rgba(16, 185, 129, 0.2)',
                                            color: '#34d399',
                                            display: 'flex',
                                        }}
                                    >
                                        <EmojiEventsOutlinedIcon sx={{ fontSize: 20 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>
                                            Judged Scores & Certificates
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.78rem', lineHeight: 1.4, display: 'block' }}>
                                            Official convention accreditation, presentation scoring, and best paper awards.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Switch Track Callout: Conference & Visitor Passes */}
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: '16px',
                                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)',
                                border: '1px solid rgba(255, 255, 255, 0.18)',
                            }}
                        >
                            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
                                <ConfirmationNumberOutlinedIcon sx={{ color: '#6ee7b7', fontSize: 20 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6ee7b7', fontSize: '0.84rem' }}>
                                    Attending Without Submitting a Paper?
                                </Typography>
                            </Stack>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.78rem', display: 'block', mb: 1.5, lineHeight: 1.4 }}>
                                You don't need an author account to attend keynotes or exhibition booths. Get your passes directly:
                            </Typography>
                            <Button
                                component={Link}
                                href="/tickets"
                                variant="contained"
                                size="small"
                                fullWidth
                                endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
                                sx={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    py: 0.8,
                                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                                    },
                                }}
                            >
                                Get Conference & Visitor Pass
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* RIGHT COLUMN: Ultra-Clean Registration Form */}
                <Grid item xs={12} md={7} sx={{ display: 'flex' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            width: '100%',
                            borderRadius: '24px',
                            p: { xs: 3, sm: 4, lg: 5 },
                            bgcolor: '#ffffff',
                            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.35)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Top Gradient Stripe */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #0d9488 0%, #10b981 50%, #34d399 100%)',
                            }}
                        />

                        {/* Form Header */}
                        <Box sx={{ mb: 3 }}>
                            <Chip
                                label="AUTHOR & DELEGATE REGISTRATION"
                                size="small"
                                sx={{
                                    bgcolor: alpha(tealPrimary, 0.08),
                                    color: tealDark,
                                    fontWeight: 800,
                                    fontSize: '0.72rem',
                                    letterSpacing: '0.06em',
                                    borderRadius: '6px',
                                    mb: 1.5,
                                }}
                            />
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: 900,
                                    color: '#0f172a',
                                    fontSize: { xs: '1.6rem', sm: '2rem' },
                                    letterSpacing: '-0.02em',
                                    mb: 0.5,
                                }}
                            >
                                Create Your Account
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.9rem' }}>
                                Register as an author or delegate for 55ᵀᴴ PIT IAGI-GEOSEA XIX 2026.
                            </Typography>
                        </Box>

                        {/* Flash Alerts */}
                        {flash?.success && (
                            <Alert
                                severity="success"
                                sx={{ mb: 3, borderRadius: '12px', border: '1px solid #a7f3d0' }}
                            >
                                {flash.success}
                            </Alert>
                        )}
                        {flash?.error && (
                            <Alert
                                severity="error"
                                sx={{ mb: 3, borderRadius: '12px', border: '1px solid #fecaca' }}
                            >
                                {flash.error}
                            </Alert>
                        )}

                        <form onSubmit={submit}>
                            {/* SECTION 1: ACCOUNT CREDENTIALS */}
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 800,
                                        color: tealDark,
                                        fontSize: '0.86rem',
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                        mb: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.8,
                                    }}
                                >
                                    <LockOutlinedIcon sx={{ fontSize: 18, color: tealPrimary }} />
                                    Account Credentials
                                </Typography>

                                {/* Email Field */}
                                <TextField
                                    id="email"
                                    label="Email Address (Login Username) *"
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
                                                    <EmailOutlinedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={textFieldSx}
                                />

                                {/* Password & Confirm Password in 2-Columns */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="password"
                                            label="Password *"
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
                                                            <LockOutlinedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
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
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="password_confirmation"
                                            label="Confirm Password *"
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
                                                            <LockOutlinedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
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
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* SECTION 2: PROFILE & AFFILIATION */}
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 800,
                                        color: tealDark,
                                        fontSize: '0.86rem',
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                        mb: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.8,
                                    }}
                                >
                                    <PersonOutlineIcon sx={{ fontSize: 18, color: tealPrimary }} />
                                    Author Profile & Affiliation
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="full_name"
                                            label="Full Name (with title if any) *"
                                            type="text"
                                            fullWidth
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
                                                            <PersonOutlineIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                            sx={textFieldSx}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="whatsapp"
                                            label="WhatsApp / Phone Number *"
                                            type="tel"
                                            fullWidth
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
                                                            <WhatsAppIcon sx={{ color: '#16a34a', fontSize: 20 }} />
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                            sx={textFieldSx}
                                        />
                                    </Grid>
                                </Grid>

                                <TextField
                                    id="affiliation"
                                    label="Affiliation / Institution / University *"
                                    type="text"
                                    fullWidth
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
                                                    <BusinessOutlinedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={textFieldSx}
                                />
                            </Box>

                            {/* SECTION 3: PARTICIPANT CATEGORY (INTERACTIVE VISUAL CARDS) */}
                            <Box sx={{ mb: 3.5 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 800,
                                        color: tealDark,
                                        fontSize: '0.86rem',
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                        mb: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.8,
                                    }}
                                >
                                    <CategoryOutlinedIcon sx={{ fontSize: 18, color: tealPrimary }} />
                                    Participant Category *
                                </Typography>

                                <Grid container spacing={1.5}>
                                    {categories.map((cat) => {
                                        const isSelected = data.category === cat.id;
                                        const IconComponent = cat.icon;
                                        return (
                                            <Grid item xs={12} sm={4} key={cat.id}>
                                                <Box
                                                    onClick={() => setData('category', cat.id)}
                                                    sx={{
                                                        p: 1.8,
                                                        borderRadius: '14px',
                                                        border: isSelected ? '2px solid #0d9488' : '1.5px solid #e2e8f0',
                                                        borderBottom: isSelected ? '3.5px solid #064e3b' : '1.5px solid #cbd5e1',
                                                        bgcolor: isSelected ? alpha(tealPrimary, 0.06) : '#ffffff',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.18s ease',
                                                        position: 'relative',
                                                        '&:hover': {
                                                            borderColor: isSelected ? '#0d9488' : '#94a3b8',
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
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
                                                                top: 10,
                                                                right: 10,
                                                                fontSize: 18,
                                                                color: tealPrimary,
                                                            }}
                                                        />
                                                    )}
                                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                                        <IconComponent
                                                            sx={{
                                                                fontSize: 20,
                                                                color: isSelected ? tealPrimary : '#64748b',
                                                            }}
                                                        />
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{
                                                                fontWeight: 800,
                                                                fontSize: '0.88rem',
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
                                                            fontSize: '0.74rem',
                                                            display: 'block',
                                                            lineHeight: 1.3,
                                                        }}
                                                    >
                                                        {cat.subtitle}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                                {errors.category && (
                                    <Typography variant="caption" sx={{ color: '#dc2626', mt: 0.8, display: 'block', fontWeight: 600 }}>
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
                                    py: 1.5,
                                    borderRadius: '14px',
                                    textTransform: 'none',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    letterSpacing: '0.02em',
                                    background: 'linear-gradient(135deg, #094d42 0%, #0d9488 50%, #10b981 100%)',
                                    border: '1px solid #34d399',
                                    borderBottom: '4px solid #022c22',
                                    boxShadow: '0 6px 20px rgba(9, 77, 66, 0.35)',
                                    color: '#ffffff',
                                    transition: 'all 0.15s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0d7a6a 0%, #10b981 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 24px rgba(9, 77, 66, 0.45)',
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
                            <Divider sx={{ my: 3 }}>
                                <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', px: 1.5, fontWeight: 600 }}>
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
                                    py: 1.2,
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    color: tealDark,
                                    borderColor: '#cbd5e1',
                                    borderBottom: '3px solid #cbd5e1',
                                    background: '#ffffff',
                                    '&:hover': {
                                        borderColor: tealPrimary,
                                        borderBottom: '3px solid #0d7a6a',
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
                    </Paper>
                </Grid>
            </Grid>
        </GuestLayout>
    );
}
