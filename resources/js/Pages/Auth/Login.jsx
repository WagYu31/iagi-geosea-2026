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
import Stack from '@mui/material/Stack';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import SparklesIcon from '@mui/icons-material/AutoAwesome';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion, AnimatePresence } from 'motion/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isOpening, setIsOpening] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const submit = (e) => {
        e.preventDefault();
        if (isOpening || processing) return;

        // Trigger the door opening choreography
        setIsOpening(true);

        // Allow user to visually witness the grand door opening sequence before sending request
        setTimeout(() => {
            post(route('login'), {
                onFinish: () => reset('password'),
                onError: () => {
                    // If login fails, smoothly close the doors back so user can correct their input
                    setTimeout(() => {
                        setIsOpening(false);
                    }, 400);
                },
            });
        }, 500);
    };

    const tealPrimary = '#0d9488';
    const tealDark = '#094d42';

    // Clean Input Styling - Labels placed cleanly ABOVE inputs
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
        <GuestLayout wide={true} containerMaxWidth={{ xs: '100%', sm: '580px', md: '980px', lg: '1040px' }}>
            <Head title="Sign In - 55th PIT IAGI - GEOSEA XIX 2026" />

            {/* 3D PERSPECTIVE STAGE */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    perspective: { xs: '1200px', md: '1800px' },
                    perspectiveOrigin: 'center center',
                    minHeight: { xs: 'auto', md: '560px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* ======================================================== */}
                {/* PORTAL CHAMBER: REVEALED BEHIND THE PARTING DOORS        */}
                {/* ======================================================== */}
                <Box
                    component={motion.div}
                    initial={false}
                    animate={isOpening ? {
                        opacity: 1,
                        scale: 1,
                        filter: 'blur(0px)',
                    } : {
                        opacity: 0,
                        scale: 0.88,
                        filter: 'blur(10px)',
                    }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: { xs: 3, md: 5 },
                        textAlign: 'center',
                        pointerEvents: isOpening ? 'auto' : 'none',
                    }}
                >
                    {/* Atmospheric Portal Light Burst */}
                    <Box
                        sx={{
                            position: 'absolute',
                            width: '450px',
                            height: '450px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(52, 211, 153, 0.35) 0%, rgba(13, 148, 136, 0.15) 50%, transparent 75%)',
                            filter: 'blur(40px)',
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Concentric Glowing Emblem */}
                    <Box
                        sx={{
                            width: { xs: 88, sm: 104 },
                            height: { xs: 88, sm: 104 },
                            borderRadius: '50%',
                            bgcolor: '#ffffff',
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 60px rgba(52, 211, 153, 0.7), 0 0 100px rgba(13, 148, 136, 0.4), 0 16px 36px rgba(0, 0, 0, 0.6)',
                            border: '2px solid rgba(52, 211, 153, 0.6)',
                            mb: 2.5,
                            position: 'relative',
                            zIndex: 2,
                            animation: 'portalPulse 2.4s infinite ease-in-out',
                            '@keyframes portalPulse': {
                                '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 50px rgba(52, 211, 153, 0.6)' },
                                '50%': { transform: 'scale(1.08)', boxShadow: '0 0 90px rgba(52, 211, 153, 0.9)' },
                            },
                        }}
                    >
                        <Box
                            component="img"
                            src="/favicon.webp"
                            alt="PIT IAGI - GEOSEA Logo"
                            width={72}
                            height={72}
                            sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    </Box>

                    {/* Verified Badge */}
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.8,
                            px: 1.6,
                            py: 0.45,
                            borderRadius: '9999px',
                            bgcolor: 'rgba(52, 211, 153, 0.18)',
                            border: '1px solid rgba(52, 211, 153, 0.4)',
                            backdropFilter: 'blur(8px)',
                            mb: 1.5,
                            position: 'relative',
                            zIndex: 2,
                        }}
                    >
                        <SparklesIcon sx={{ fontSize: 13, color: '#34d399' }} />
                        <Typography
                            sx={{
                                color: '#6ee7b7',
                                fontWeight: 800,
                                fontSize: '0.72rem',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                            }}
                        >
                            VERIFYING CREDENTIALS • OPENING PORTAL
                        </Typography>
                    </Box>

                    {/* Entrance Headline */}
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 900,
                            color: '#ffffff',
                            fontSize: { xs: '1.45rem', sm: '1.85rem' },
                            letterSpacing: '-0.02em',
                            mb: 1,
                            position: 'relative',
                            zIndex: 2,
                        }}
                    >
                        Entering PIT IAGI - GEOSEA 2026
                    </Typography>

                    <Typography
                        sx={{
                            color: 'rgba(255, 255, 255, 0.85)',
                            fontSize: '0.88rem',
                            mb: 3,
                            maxWidth: '460px',
                            lineHeight: 1.5,
                            position: 'relative',
                            zIndex: 2,
                        }}
                    >
                        Access granted. Opening conference chamber and loading your personalized dashboard...
                    </Typography>

                    {/* Animated Neon Light Tube */}
                    <Box
                        sx={{
                            width: '240px',
                            height: '4px',
                            borderRadius: '9999px',
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            overflow: 'hidden',
                            position: 'relative',
                            zIndex: 2,
                            boxShadow: '0 0 15px rgba(52, 211, 153, 0.4)',
                        }}
                    >
                        <Box
                            component={motion.div}
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                            sx={{
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent 0%, #34d399 50%, #2dd4bf 80%, transparent 100%)',
                            }}
                        />
                    </Box>
                </Box>

                {/* ======================================================== */}
                {/* 2-DOOR SPLIT STAGE: PARTING DOORS CHOREOGRAPHY           */}
                {/* ======================================================== */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'stretch',
                        width: '100%',
                        position: 'relative',
                        zIndex: 2,
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {/* ======================================================== */}
                    {/* KOTAK KIRI (LEFT DOOR): Swings Open to Left               */}
                    {/* ======================================================== */}
                    <Box
                        component={motion.div}
                        initial={false}
                        animate={isOpening ? (
                            isMobile
                                ? { y: -150, rotateX: 35, opacity: 0, scale: 0.94 }
                                : { x: -160, rotateY: -65, opacity: 0, scale: 0.94 }
                        ) : {
                            x: 0,
                            y: 0,
                            rotateY: 0,
                            rotateX: 0,
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            transformOrigin: isMobile ? 'top center' : 'left center',
                            transformStyle: 'preserve-3d',
                        }}
                        sx={{
                            width: { xs: '100%', md: '44%' },
                            p: { xs: 3, sm: 4, lg: 4.5 },
                            background: 'linear-gradient(165deg, #021a15 0%, #06372f 45%, #031e19 100%)',
                            borderRadius: { xs: '20px 20px 0 0', md: '24px 0 0 24px' },
                            border: '1.5px solid rgba(255, 255, 255, 0.2)',
                            borderRight: { md: '1px solid rgba(77, 212, 172, 0.25)' },
                            borderBottom: { xs: '1px solid rgba(77, 212, 172, 0.25)', md: '1.5px solid rgba(255, 255, 255, 0.2)' },
                            boxShadow: '0 30px 90px -20px rgba(0, 0, 0, 0.65), 0 0 50px -10px rgba(20, 184, 166, 0.25)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                            overflow: 'hidden',
                            color: '#ffffff',
                            backfaceVisibility: 'hidden',
                        }}
                    >
                        {/* Top Laser Strip on Left Door */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3.5px',
                                background: 'linear-gradient(90deg, #10b981 0%, #34d399 50%, #2dd4bf 100%)',
                            }}
                        />

                        {/* Subtle Radial Glow Behind Left Panel */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '-20%',
                                left: '-20%',
                                width: '380px',
                                height: '380px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(20, 184, 166, 0.28) 0%, transparent 70%)',
                                filter: 'blur(55px)',
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Top Content */}
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            {/* Emblem Medallion & Event Title */}
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
                                <Box
                                    sx={{
                                        width: { xs: 52, sm: 60 },
                                        height: { xs: 52, sm: 60 },
                                        borderRadius: '16px',
                                        bgcolor: '#ffffff',
                                        p: 0.85,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 0 25px rgba(20, 184, 166, 0.4), 0 8px 24px rgba(0, 0, 0, 0.45)',
                                        border: '1.5px solid rgba(52, 211, 153, 0.45)',
                                        flexShrink: 0,
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.04)',
                                        },
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src="/favicon.webp"
                                        alt="PIT IAGI - GEOSEA Logo"
                                        width={48}
                                        height={48}
                                        fetchPriority="high"
                                        decoding="async"
                                        sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                </Box>
                                <Box>
                                    <Box
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 0.6,
                                            px: 1,
                                            py: 0.3,
                                            borderRadius: '9999px',
                                            bgcolor: 'rgba(52, 211, 153, 0.15)',
                                            border: '1px solid rgba(52, 211, 153, 0.3)',
                                            mb: 0.5,
                                        }}
                                    >
                                        <SparklesIcon sx={{ fontSize: 11, color: '#34d399' }} />
                                        <Typography
                                            sx={{
                                                color: '#6ee7b7',
                                                fontWeight: 800,
                                                letterSpacing: '0.08em',
                                                textTransform: 'uppercase',
                                                fontSize: '0.62rem',
                                            }}
                                        >
                                            Annual Convention
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 900,
                                            lineHeight: 1.2,
                                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                            color: '#ffffff',
                                            letterSpacing: '-0.015em',
                                        }}
                                    >
                                        55ᵀᴴ PIT IAGI ·{' '}
                                        <Box
                                            component="span"
                                            sx={{
                                                background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #2dd4bf 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            GEOSEA XIX 2026
                                        </Box>
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* Theme Motto Quote */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.92)',
                                    fontSize: '0.85rem',
                                    lineHeight: 1.5,
                                    mb: 3,
                                    fontStyle: 'italic',
                                    borderLeft: '3px solid #34d399',
                                    pl: 1.6,
                                }}
                            >
                                “Harmony of Geoscience and Technology for Sustainable Future”
                            </Typography>

                            {/* Professional Credentials / Features */}
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#6ee7b7',
                                        fontWeight: 800,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        fontSize: '0.7rem',
                                        display: 'block',
                                        mb: 1.8,
                                    }}
                                >
                                    Conference Portal Gateway
                                </Typography>

                                <Stack spacing={1.5}>
                                    {/* Feature 1: Paper Submissions */}
                                    <Box
                                        sx={{
                                            p: 1.6,
                                            borderRadius: '12px',
                                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)',
                                            display: 'flex',
                                            gap: 1.4,
                                            alignItems: 'center',
                                            transition: 'all 0.25s ease',
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 255, 255, 0.09)',
                                                borderColor: 'rgba(52, 211, 153, 0.35)',
                                                transform: 'translateX(3px)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '10px',
                                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(20, 184, 166, 0.15) 100%)',
                                                border: '1px solid rgba(52, 211, 153, 0.3)',
                                                color: '#34d399',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <ArticleOutlinedIcon sx={{ fontSize: 18 }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#ffffff' }}>
                                                Scientific Papers & Proceedings
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.72rem', display: 'block' }}>
                                                Oral & poster editorial tracking and peer review workflow.
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Feature 2: ASEAN Regional Network */}
                                    <Box
                                        sx={{
                                            p: 1.6,
                                            borderRadius: '12px',
                                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)',
                                            display: 'flex',
                                            gap: 1.4,
                                            alignItems: 'center',
                                            transition: 'all 0.25s ease',
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 255, 255, 0.09)',
                                                borderColor: 'rgba(52, 211, 153, 0.35)',
                                                transform: 'translateX(3px)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '10px',
                                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(20, 184, 166, 0.15) 100%)',
                                                border: '1px solid rgba(52, 211, 153, 0.3)',
                                                color: '#34d399',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <GroupsOutlinedIcon sx={{ fontSize: 18 }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#ffffff' }}>
                                                Regional Geoscience Community
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.72rem', display: 'block' }}>
                                                Connect with 1,500+ ASEAN geoscientists and leaders.
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Feature 3: Official Badges & Certificates */}
                                    <Box
                                        sx={{
                                            p: 1.6,
                                            borderRadius: '12px',
                                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)',
                                            display: 'flex',
                                            gap: 1.4,
                                            alignItems: 'center',
                                            transition: 'all 0.25s ease',
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 255, 255, 0.09)',
                                                borderColor: 'rgba(52, 211, 153, 0.35)',
                                                transform: 'translateX(3px)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '10px',
                                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(20, 184, 166, 0.15) 100%)',
                                                border: '1px solid rgba(52, 211, 153, 0.3)',
                                                color: '#34d399',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <VerifiedUserOutlinedIcon sx={{ fontSize: 18 }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#ffffff' }}>
                                                Delegate QR Badges & Certificates
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.72rem', display: 'block' }}>
                                                Instant check-in and accredited participation certificates.
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Box>
                        </Box>

                        {/* Bottom Organizer Signature */}
                        <Box
                            sx={{
                                mt: 3.5,
                                pt: 2.2,
                                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            <Stack direction="row" spacing={1.2} alignItems="center">
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#34d399', boxShadow: '0 0 10px #34d399' }} />
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600, fontSize: '0.76rem' }}>
                                    Organized by Ikatan Ahli Geologi Indonesia (IAGI) & GEOSEA
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>

                    {/* ======================================================== */}
                    {/* KOTAK KANAN (RIGHT DOOR): Swings Open to Right            */}
                    {/* ======================================================== */}
                    <Box
                        component={motion.div}
                        initial={false}
                        animate={isOpening ? (
                            isMobile
                                ? { y: 150, rotateX: -35, opacity: 0, scale: 0.94 }
                                : { x: 160, rotateY: 65, opacity: 0, scale: 0.94 }
                        ) : {
                            x: 0,
                            y: 0,
                            rotateY: 0,
                            rotateX: 0,
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            transformOrigin: isMobile ? 'bottom center' : 'right center',
                            transformStyle: 'preserve-3d',
                        }}
                        sx={{
                            width: { xs: '100%', md: '56%' },
                            p: { xs: 3, sm: 4, lg: 4.5 },
                            bgcolor: '#ffffff',
                            borderRadius: { xs: '0 0 20px 20px', md: '0 24px 24px 0' },
                            border: '1.5px solid rgba(255, 255, 255, 0.2)',
                            borderLeft: { md: 'none' },
                            borderTop: { xs: 'none', md: '1.5px solid rgba(255, 255, 255, 0.2)' },
                            boxShadow: '0 30px 90px -20px rgba(0, 0, 0, 0.65)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            position: 'relative',
                            backfaceVisibility: 'hidden',
                        }}
                    >
                        {/* Header with Login Icon Badge */}
                        <Box sx={{ mb: 3 }}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 48,
                                    height: 48,
                                    borderRadius: '14px',
                                    background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.12) 0%, rgba(52, 211, 153, 0.2) 100%)',
                                    border: '1px solid rgba(13, 148, 136, 0.25)',
                                    boxShadow: '0 4px 16px rgba(13, 148, 136, 0.12)',
                                    mb: 1.5,
                                }}
                            >
                                <LoginIcon sx={{ fontSize: 24, color: tealPrimary }} />
                            </Box>

                            <Typography
                                variant="h5"
                                component="h1"
                                sx={{
                                    fontWeight: 900,
                                    color: '#0f172a',
                                    fontSize: { xs: '1.45rem', sm: '1.7rem' },
                                    letterSpacing: '-0.025em',
                                    lineHeight: 1.25,
                                    mb: 0.5,
                                }}
                            >
                                Welcome Back
                            </Typography>
                            <Typography
                                sx={{
                                    color: '#64748b',
                                    fontSize: '0.86rem',
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
                                    mb: 2.5,
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
                                    disabled={isOpening || processing}
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
                                    disabled={isOpening || processing}
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
                                                        disabled={isOpening || processing}
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
                            <Box sx={{ mb: 2.6 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            disabled={isOpening || processing}
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

                            {/* Signature Primary CTA Button with Door Opening Feedback */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={processing || isOpening}
                                startIcon={
                                    processing || isOpening ? (
                                        <CircularProgress size={18} sx={{ color: 'white' }} />
                                    ) : (
                                        <LoginIcon sx={{ fontSize: 19 }} />
                                    )
                                }
                                sx={{
                                    py: 1.35,
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.94rem',
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
                                        background: isOpening ? 'linear-gradient(135deg, #0d7a6a 0%, #059669 100%)' : '#94a3b8',
                                        color: '#ffffff',
                                    },
                                }}
                            >
                                {isOpening ? 'Opening Conference Portal...' : processing ? 'Signing in...' : 'Sign In to Account'}
                            </Button>

                            {/* Divider */}
                            <Divider sx={{ my: 2.6 }}>
                                <Typography
                                    sx={{
                                        color: '#94a3b8',
                                        fontSize: '0.7rem',
                                        px: 1.2,
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
                                disabled={isOpening || processing}
                                startIcon={<PersonAddOutlinedIcon sx={{ fontSize: 19 }} />}
                                sx={{
                                    py: 1.2,
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

                            {/* Security Assurance Footer */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.7, mt: 2.2 }}>
                                <ShieldOutlinedIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
                                    Official SSL Encrypted Conference Portal
                                </Typography>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Box>
        </GuestLayout>
    );
}
