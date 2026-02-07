import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ThemeProvider } from '@mui/material/styles';
import {
    AppBar,
    Toolbar,
    Container,
    Typography,
    Button,
    Box,
    Grid,
    Card,
    CardContent,
    CssBaseline,
    Paper,
    Avatar,
    Chip,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    CheckCircle as CheckIcon,
    Download as DownloadIcon,
    Description as DescriptionIcon,
    Menu as MenuIcon,
    Close as CloseIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import theme from '../theme';

export default function LandingPage({ auth }) {
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Animation states
    const [heroVisible, setHeroVisible] = useState(false);
    const [aboutVisible, setAboutVisible] = useState(false);
    const [speakersVisible, setSpeakersVisible] = useState(false);
    const [timelineVisible, setTimelineVisible] = useState(false);
    const [resourcesVisible, setResourcesVisible] = useState(false);
    const [contactVisible, setContactVisible] = useState(false);
    const [sponsorsVisible, setSponsorsVisible] = useState(false);

    // Refs for scroll observation
    const heroRef = useRef(null);
    const aboutRef = useRef(null);
    const speakersRef = useRef(null);
    const timelineRef = useRef(null);
    const resourcesRef = useRef(null);
    const contactRef = useRef(null);
    const sponsorsRef = useRef(null);

    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const [settings, setSettings] = useState({
        keynote_speakers: [],
        keynote_speakers_description: 'Distinguished experts bridging the gap between geological science and practical sustainability.',
        sponsors: [],
        sponsors_description: '',
        resources: [],
        timeline: [],
        countdown_target_date: '2026-01-18T00:00:00',
        contact_phone: '+62 21 1234 5678',
        contact_email: 'info@iagi-geosea2026.org',
        contact_address: 'UPN Veteran Yogyakarta\nJl. SWK 104 (Lingkar Utara)\nYogyakarta 55283',
        social_media: {
            instagram: 'https://www.instagram.com/iagi_official/',
            facebook: 'https://www.facebook.com/iagi.official',
            twitter: 'https://twitter.com/iagi_official',
            linkedin: 'https://www.linkedin.com/company/iagi-official',
            youtube: 'https://www.youtube.com/@iagi_official',
        },
        hero_background: {
            url: '/hero-background1.mp4',
            type: 'video',
            filename: 'hero-background1.mp4',
        },
        hero_text: {
            title_line1: 'PIT IAGI',
            title_line2: 'GEOSEA XIX 2026',
            theme_label: 'CONFERENCE THEME',
            theme_text: 'Advancing Geological Sciences for Sustainable Development',
        },
        hero_logo: {
            url: '/WhatsApp_Image_2025-12-29_at_19.37.46-removebg-preview.png',
            filename: 'default_logo.png',
        },
    });

    useEffect(() => {
        // Fetch settings from API
        fetch('/api/landing-settings')
            .then(response => response.json())
            .then(data => {
                setSettings(prev => ({
                    ...prev,
                    ...data
                }));
            })
            .catch(error => console.error('Error fetching settings:', error));
    }, []);

    // Scroll detection for header
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setScrolled(offset > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Set target date for registration opening
        const targetDate = new Date(settings.countdown_target_date || '2026-01-18T00:00:00').getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance > 0) {
                setCountdown({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [settings.countdown_target_date]);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    if (target === heroRef.current) setHeroVisible(true);
                    else if (target === aboutRef.current) setAboutVisible(true);
                    else if (target === speakersRef.current) setSpeakersVisible(true);
                    else if (target === timelineRef.current) setTimelineVisible(true);
                    else if (target === resourcesRef.current) setResourcesVisible(true);
                    else if (target === contactRef.current) setContactVisible(true);
                    else if (target === sponsorsRef.current) setSponsorsVisible(true);
                }
            });
        }, observerOptions);

        // Observe all sections
        [heroRef, aboutRef, speakersRef, timelineRef, resourcesRef, contactRef, sponsorsRef].forEach((ref) => {
            if (ref.current) observer.observe(ref.current);
        });

        // Trigger hero animation immediately
        setHeroVisible(true);

        return () => observer.disconnect();
    }, []);

    const menuItems = [
        { label: 'HOME', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { label: 'ABOUT', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
        { label: 'SPEAKERS', action: () => document.getElementById('speakers')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
        { label: 'TIMELINE', action: () => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
        { label: 'RESOURCES', action: () => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
        { label: 'FAQ', action: () => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
        { label: 'CONTACT', action: () => document.getElementById('venue')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
        { label: 'AFGEO', action: () => document.getElementById('afgeo')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
    ];

    const handleMenuClick = (action) => {
        setMobileMenuOpen(false);
        // Add a small delay to allow drawer to close before scrolling
        setTimeout(() => {
            action();
        }, 300);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Head title="55th PIT IAGI-GEOSEA 2026 Conference" />

            <Box sx={{ flexGrow: 1 }}>
                {/* Navigation Bar */}
                <AppBar
                    position="sticky"
                    sx={{
                        bgcolor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(9, 77, 66, 0.75)',
                        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(9, 77, 66, 0.75)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    elevation={0}
                    color="transparent"
                >
                    <Toolbar sx={{ py: { xs: 1, sm: 1.5, md: 1.5 }, px: { xs: 2, sm: 3, md: 4, lg: 5 }, minHeight: { xs: '64px', md: '72px' }, bgcolor: 'transparent' }}>
                        {/* Logo */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                            {/* Favicon Logo */}
                            <Box
                                component="img"
                                src="/favicon.ico"
                                alt="Logo"
                                sx={{
                                    width: { xs: 32, sm: 36, md: 40 },
                                    height: { xs: 32, sm: 36, md: 40 },
                                    objectFit: 'contain',
                                }}
                            />
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                                        fontWeight: 700,
                                        letterSpacing: '0.05em',
                                        color: scrolled ? '#094d42' : '#ffffff',
                                        textShadow: scrolled ? 'none' : '0 2px 10px rgba(0,0,0,0.3)',
                                        lineHeight: 1.2,
                                        mb: 0.25,
                                        transition: 'color 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease',
                                        transform: scrolled ? 'scale(1)' : 'scale(1)',
                                    }}
                                >
                                    55ᵀᴴ PIT IAGI-GEOSEA XIX <Box component="span" sx={{ color: scrolled ? '#0d7a6a' : '#4dd4ac', transition: 'color 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>2026</Box>
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: { xs: '0.5rem', sm: '0.6rem', md: '0.65rem' },
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                        color: scrolled ? 'rgba(9, 77, 66, 0.6)' : 'rgba(255,255,255,0.7)',
                                        transition: 'color 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
                                        display: { xs: 'block', sm: 'block' },
                                    }}
                                >
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ flexGrow: 1 }} />

                        {/* Desktop Menu */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: { md: 0.5, lg: 1 }, alignItems: 'center' }}>
                            {menuItems.map((item, index) => (
                                <Button
                                    key={index}
                                    size="small"
                                    onClick={item.action}
                                    sx={{
                                        color: scrolled ? '#094d42' : 'rgba(255,255,255,0.95)',
                                        fontWeight: 500,
                                        fontSize: { md: '0.85rem', lg: '0.9rem' },
                                        px: { md: 1.5, lg: 2 },
                                        py: 1,
                                        textTransform: 'none',
                                        textShadow: scrolled ? 'none' : '0 1px 4px rgba(0,0,0,0.2)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            bgcolor: scrolled ? 'rgba(13, 122, 106, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                                            color: scrolled ? '#0d7a6a' : '#ffffff',
                                            transform: 'translateY(-1px)',
                                        }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}

                            {/* Login Button */}
                            {!auth.user && (
                                <Button
                                    component={Link}
                                    href="/login"
                                    size="small"
                                    sx={{
                                        color: scrolled ? '#094d42' : 'rgba(255,255,255,0.95)',
                                        fontWeight: 500,
                                        fontSize: { md: '0.85rem', lg: '0.9rem' },
                                        px: { md: 2, lg: 2.5 },
                                        py: 1,
                                        ml: { md: 0.5, lg: 1 },
                                        textTransform: 'none',
                                        textShadow: scrolled ? 'none' : '0 1px 4px rgba(0,0,0,0.2)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            bgcolor: scrolled ? 'rgba(13, 122, 106, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                                            color: scrolled ? '#0d7a6a' : '#ffffff',
                                            transform: 'translateY(-1px)',
                                        }
                                    }}
                                >
                                    LOGIN
                                </Button>
                            )}

                            {/* Register Now Button */}
                            {auth.user ? (
                                <Button
                                    component={Link}
                                    href="/dashboard"
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        bgcolor: '#4dd4ac',
                                        color: '#094d42',
                                        fontWeight: 600,
                                        fontSize: { md: '0.85rem', lg: '0.9rem' },
                                        px: { md: 2.5, lg: 3 },
                                        py: 1,
                                        ml: { md: 1.5, lg: 2 },
                                        borderRadius: '6px',
                                        textTransform: 'none',
                                        boxShadow: 'none',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            bgcolor: '#3bc494',
                                            boxShadow: '0 4px 12px rgba(77, 212, 172, 0.4)',
                                            transform: 'translateY(-2px)',
                                        }
                                    }}
                                >
                                    Dashboard
                                </Button>
                            ) : (
                                <Button
                                    component={Link}
                                    href="/register"
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        bgcolor: '#4dd4ac',
                                        color: '#094d42',
                                        fontWeight: 600,
                                        fontSize: { md: '0.85rem', lg: '0.9rem' },
                                        px: { md: 3, lg: 3.5 },
                                        py: { md: 1, lg: 1.2 },
                                        ml: { md: 1.5, lg: 2 },
                                        borderRadius: '50px',
                                        textTransform: 'none',
                                        boxShadow: 'none',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            bgcolor: '#3bc494',
                                            boxShadow: '0 4px 12px rgba(77, 212, 172, 0.4)',
                                            transform: 'translateY(-2px)',
                                        }
                                    }}
                                    endIcon={
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '4px' }}>
                                            <path d="M13.5 4.5L21 12M21 12L13.5 19.5M21 12H3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    }
                                >
                                    Register Now
                                </Button>
                            )}
                        </Box>

                        {/* Mobile Menu Button */}
                        <IconButton
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                color: scrolled ? '#094d42' : 'white',
                                transition: 'color 0.3s ease',
                            }}
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* Mobile Drawer Menu */}
                <Drawer
                    anchor="right"
                    open={mobileMenuOpen}
                    onClose={() => setMobileMenuOpen(false)}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            width: { xs: '85%', sm: '70%' },
                            maxWidth: { xs: '320px', sm: '380px' },
                            bgcolor: 'white',
                            backgroundImage: 'none',
                        }
                    }}
                >
                    <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.08)', bgcolor: '#f9fafb' }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#094d42', fontSize: '1.1rem', letterSpacing: '0.02em' }}>
                                IAHI-GEOSEA XIX <Box component="span" sx={{ color: '#0d7a6a' }}>2026</Box>
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem', letterSpacing: '0.1em', fontWeight: 600 }}>
                                55TH EDITION
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: '#094d42' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <List sx={{ pt: 0 }}>
                        {menuItems.map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    onClick={() => handleMenuClick(item.action)}
                                    sx={{
                                        py: 2,
                                        px: 3,
                                        '&:hover': {
                                            bgcolor: 'rgba(13, 122, 106, 0.08)',
                                            borderLeft: '3px solid #0d7a6a',
                                        }
                                    }}
                                >
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontWeight: 500,
                                            color: '#374151',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <Box sx={{ px: 2, py: 2, borderTop: '1px solid rgba(0,0,0,0.1)', mt: 2 }}>
                            {auth.user ? (
                                <Button
                                    component={Link}
                                    href="/dashboard"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        fontWeight: 600,
                                        py: 1.5,
                                        borderRadius: '8px',
                                    }}
                                >
                                    Dashboard
                                </Button>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <Button
                                        component={Link}
                                        href="/register"
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            borderColor: 'primary.main',
                                            color: 'primary.main',
                                            fontWeight: 600,
                                            py: 1.5,
                                            borderRadius: '8px',
                                        }}
                                    >
                                        REGISTER
                                    </Button>
                                    <Button
                                        component={Link}
                                        href="/login"
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            fontWeight: 600,
                                            py: 1.5,
                                            borderRadius: '8px',
                                        }}
                                    >
                                        LOGIN
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </List>
                </Drawer>

                {/* Hero Section */}
                <Box
                    ref={heroRef}
                    sx={{
                        bgcolor: '#094d42',
                        color: 'white',
                        py: { xs: 8, sm: 10, md: 12, lg: 16 },
                        minHeight: { xs: '500px', sm: '600px', md: '700px', lg: '800px' },
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        transform: heroVisible ? 'translateY(0)' : 'translateY(50px)',
                        opacity: heroVisible ? 1 : 0,
                        transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    {/* Dynamic Background (Video or Image) */}
                    {settings.hero_background?.type === 'video' ? (
                        <Box
                            component="video"
                            autoPlay
                            muted
                            loop
                            playsInline
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                minWidth: '100%',
                                minHeight: '100%',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'cover',
                                zIndex: 0,
                            }}
                        >
                            <source src={settings.hero_background?.url || '/hero-background1.mp4'} type="video/mp4" />
                        </Box>
                    ) : settings.hero_background?.type === 'image' ? (
                        <Box
                            component="img"
                            src={settings.hero_background?.url}
                            alt="Hero Background"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                zIndex: 0,
                            }}
                        />
                    ) : (
                        <Box
                            component="video"
                            autoPlay
                            muted
                            loop
                            playsInline
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                minWidth: '100%',
                                minHeight: '100%',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'cover',
                                zIndex: 0,
                            }}
                        >
                            <source src="/hero-background1.mp4" type="video/mp4" />
                        </Box>
                    )}

                    {/* Dark Overlay for text readability */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(9, 77, 66, 0)',
                            zIndex: 0,
                        }}
                    />

                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3, md: 4 } }}>
                        <Box sx={{ textAlign: 'center' }}>
                            {/* Main Logo */}
                            <Box sx={{ mb: { xs: 2, sm: 2, md: 2 } }}>
                                <Box
                                    component="img"
                                    src={settings.hero_logo?.url || '/WhatsApp_Image_2025-12-29_at_19.37.46-removebg-preview.png'}
                                    alt="Conference Logo"
                                    sx={{
                                        width: { xs: 100, sm: 120, md: 150, lg: 180 },
                                        height: { xs: 100, sm: 120, md: 150, lg: 180 },
                                        objectFit: 'cover',
                                        margin: '0 auto',
                                        display: 'block',
                                        borderRadius: '50%',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </Box>

                            {/* Secondary Logos (smaller, multiple) */}
                            {settings.hero_logos_secondary && settings.hero_logos_secondary.length > 0 && (
                                <Box sx={{ mb: { xs: 3, sm: 4, md: 4 }, display: 'flex', justifyContent: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
                                    {settings.hero_logos_secondary.map((logo, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: { xs: 50, sm: 60, md: 70, lg: 80 },
                                                height: { xs: 50, sm: 60, md: 70, lg: 80 },
                                                borderRadius: '50%',
                                                bgcolor: 'white',
                                                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                p: 0.5,
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={logo.url}
                                                alt={`Secondary Logo ${index + 1}`}
                                                sx={{
                                                    maxWidth: '85%',
                                                    maxHeight: '85%',
                                                    objectFit: 'contain',
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {/* Title */}
                            <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
                                {/* 55TH IAHI - */}
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem', lg: '4.5rem' },
                                        letterSpacing: { xs: '0.02em', md: '0.05em' },
                                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                        lineHeight: 1.1,
                                        mb: { xs: 0.5, md: 1 },
                                        color: 'white',
                                    }}
                                >
                                    {settings.hero_text?.title_line1 || 'PIT IAGI'}
                                </Typography>

                                {/* GEOSEA 2026 */}
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem', lg: '4.5rem' },
                                        letterSpacing: { xs: '0.02em', md: '0.05em' },
                                        textShadow: '0 4px 20px rgba(77, 212, 172, 0.3)',
                                        lineHeight: 1.1,
                                        color: '#4dd4ac',
                                        mb: { xs: 4, sm: 5, md: 6 },
                                    }}
                                >
                                    {settings.hero_text?.title_line2 || 'GEOSEA XIX 2026'}
                                </Typography>
                            </Box>

                            {/* Theme */}
                            <Box sx={{ mb: { xs: 4, sm: 5, md: 6 }, maxWidth: '800px', mx: 'auto', px: { xs: 2, sm: 3, md: 0 } }}>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: '#4dd4ac',
                                        mb: { xs: 2, sm: 2.5 },
                                        fontWeight: 600,
                                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                        letterSpacing: { xs: '0.15em', sm: '0.2em' },
                                        display: 'block',
                                        textShadow: '0 2px 10px rgba(77, 212, 172, 0.2)',
                                    }}
                                >
                                    {settings.hero_text?.theme_label || 'CONFERENCE THEME'}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontStyle: 'italic',
                                        opacity: 0.95,
                                        fontWeight: 400,
                                        lineHeight: { xs: 1.6, md: 1.5 },
                                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                                        color: 'white',
                                        textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    "{settings.hero_text?.theme_text || 'Advancing Geological Sciences for Sustainable Development'}"
                                </Typography>
                            </Box>

                            {/* Countdown Timer */}
                            <Box sx={{ mb: { xs: 0, sm: 0, md: 0 } }}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: { xs: 2, sm: 2.5, md: 3 },
                                        color: 'rgba(255,255,255,0.9)',
                                        fontWeight: 500,
                                        fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
                                    }}
                                >
                                    Registration Opens In
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: { xs: 1, sm: 1.5, md: 2, lg: 3 },
                                        flexWrap: 'nowrap',
                                        px: { xs: 1, sm: 2, md: 0 },
                                        maxWidth: { xs: '100%', sm: '500px', md: '600px' },
                                        mx: 'auto',
                                    }}
                                >
                                    {[
                                        { label: 'Days', value: countdown.days },
                                        { label: 'Hours', value: countdown.hours },
                                        { label: 'Minutes', value: countdown.minutes },
                                        { label: 'Seconds', value: countdown.seconds },
                                    ].map((item, index) => (
                                        <Paper
                                            key={index}
                                            elevation={12}
                                            sx={{
                                                bgcolor: 'rgba(9, 77, 66, 0.5)',
                                                backdropFilter: 'blur(10px)',
                                                p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                                                minWidth: { xs: 70, sm: 85, md: 100, lg: 120 },
                                                flex: { xs: '1 1 0', sm: '0 0 auto' },
                                                textAlign: 'center',
                                                borderRadius: { xs: 2, md: 2.5 },
                                                border: '2px solid rgba(77, 212, 172, 0.4)',
                                                background: 'transparent',
                                                boxShadow: 'none',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    border: '2px solid rgba(77, 212, 172, 0.6)',
                                                    bgcolor: 'rgba(9, 77, 66, 0.65)',
                                                },
                                            }}
                                        >
                                            <Typography
                                                variant="h3"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: 'white',
                                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                                                    lineHeight: 1,
                                                    mb: { xs: 0.5, sm: 0.75 },
                                                    textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                                }}
                                            >
                                                {String(item.value).padStart(2, '0')}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.8)',
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
                                                    letterSpacing: '0.12em',
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                        </Paper>
                                    ))}
                                </Box>
                            </Box>

                        </Box>
                    </Container>
                </Box>


                {/* AFGEO Member Section */}
                <Box
                    id="afgeo"
                    sx={{
                        py: { xs: 5, sm: 6, md: 7 },
                        backgroundImage: settings.afgeo_text?.background
                            ? `linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(248,250,252,0.35) 100%), url("${settings.afgeo_text.background}")`
                            : 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(248,250,252,0.35) 100%), url("/Gemini_Generated_Image_ckbitcckbitcckbi.jpeg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed',
                        position: 'relative',
                    }}
                >
                    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                        {/* Section Header */}
                        <Typography
                            variant="overline"
                            align="center"
                            display="block"
                            sx={{
                                color: '#0d9488',
                                fontWeight: 700,
                                letterSpacing: '0.15em',
                                mb: 1.5,
                                fontSize: { xs: '0.7rem', md: '0.8rem' },
                            }}
                        >
                            {settings.afgeo_text?.section_label || 'OUR NETWORK'}
                        </Typography>
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                                color: '#111827',
                                fontSize: { xs: '1.75rem', md: '2.25rem' },
                            }}
                        >
                            {settings.afgeo_text?.title || 'AFGEO Member'}
                        </Typography>
                        <Typography
                            variant="body1"
                            align="center"
                            sx={{
                                mb: { xs: 4, md: 5 },
                                color: '#6b7280',
                                maxWidth: '700px',
                                mx: 'auto',
                                fontSize: { xs: '0.95rem', md: '1.05rem' },
                            }}
                        >
                            {settings.afgeo_text?.subtitle || 'Association of Federation of Geoscientists of East and Southeast Asia'}
                        </Typography>

                        {/* Member Logos Grid */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: { xs: 3, md: 4 },
                                maxWidth: '1000px',
                                mx: 'auto',
                            }}
                        >
                            {(settings.afgeo_members || [
                                { name: 'IAGI', country: 'Indonesia' },
                                { name: 'GSM', country: 'Malaysia' },
                                { name: 'GST', country: 'Thailand' },
                                { name: 'GSP', country: 'Philippines' },
                                { name: 'GSV', country: 'Vietnam' },
                                { name: 'GSJ', country: 'Japan' },
                                { name: 'GSK', country: 'Korea' },
                                { name: 'GSC', country: 'China' },
                            ]).map((member, index) => (
                                <Paper
                                    key={index}
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2.5, md: 3 },
                                        minWidth: { xs: 120, md: 140 },
                                        textAlign: 'center',
                                        borderRadius: 3,
                                        border: '1px solid #e5e7eb',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 30px rgba(13, 148, 136, 0.15)',
                                            borderColor: '#0d9488',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            bgcolor: '#f0fdfa',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 1.5,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {member.logo ? (
                                            <Box
                                                component="img"
                                                src={member.logo}
                                                alt={member.name}
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        ) : (
                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    color: '#0d9488',
                                                    fontSize: '1.1rem',
                                                }}
                                            >
                                                {member.name}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#6b7280',
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        {member.country}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>
                    </Container>
                </Box>

                {/* Custom Sections - Dynamic sections from admin */}
                {(settings.custom_sections || []).map((section, sectionIndex) => (
                    <Box
                        key={sectionIndex}
                        sx={{
                            py: { xs: 5, sm: 6, md: 7 },
                            backgroundImage: section.background
                                ? `linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(248,250,252,0.35) 100%), url("${section.background}")`
                                : sectionIndex % 2 === 0
                                    ? 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
                                    : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                            backgroundSize: section.background ? 'cover' : 'auto',
                            backgroundPosition: section.background ? 'center' : 'auto',
                            backgroundAttachment: section.background ? 'fixed' : 'scroll',
                            position: 'relative',
                        }}
                    >
                        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                            {/* Section Header */}
                            <Typography
                                variant="overline"
                                align="center"
                                display="block"
                                sx={{
                                    color: '#0d9488',
                                    fontWeight: 700,
                                    letterSpacing: '0.15em',
                                    mb: 1.5,
                                    fontSize: { xs: '0.7rem', md: '0.8rem' },
                                }}
                            >
                                {section.section_label || 'SECTION'}
                            </Typography>
                            <Typography
                                variant="h4"
                                align="center"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    color: '#111827',
                                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                                }}
                            >
                                {section.title || 'Section Title'}
                            </Typography>
                            <Typography
                                variant="body1"
                                align="center"
                                sx={{
                                    mb: { xs: 4, md: 5 },
                                    color: '#6b7280',
                                    maxWidth: '700px',
                                    mx: 'auto',
                                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                                }}
                            >
                                {section.subtitle || ''}
                            </Typography>

                            {/* Items Grid */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: { xs: 3, md: 4 },
                                    maxWidth: '1000px',
                                    mx: 'auto',
                                }}
                            >
                                {(section.members || []).map((member, index) => (
                                    <Paper
                                        key={index}
                                        elevation={0}
                                        sx={{
                                            p: { xs: 2.5, md: 3 },
                                            minWidth: { xs: 120, md: 140 },
                                            textAlign: 'center',
                                            borderRadius: 3,
                                            border: '1px solid #e5e7eb',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 8px 30px rgba(13, 148, 136, 0.15)',
                                                borderColor: '#0d9488',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: '50%',
                                                bgcolor: '#f0fdfa',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 1.5,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {member.logo ? (
                                                <Box
                                                    component="img"
                                                    src={member.logo}
                                                    alt={member.name}
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            ) : (
                                                <Typography
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: '#0d9488',
                                                        fontSize: '1.1rem',
                                                    }}
                                                >
                                                    {member.name?.substring(0, 3) || ''}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#6b7280',
                                                fontSize: '0.85rem',
                                            }}
                                        >
                                            {member.country || member.name}
                                        </Typography>
                                    </Paper>
                                ))}
                            </Box>
                        </Container>
                    </Box>
                ))}

                {/* About the Conference Section */}
                <Box
                    id="about"
                    ref={aboutRef}
                    sx={{
                        backgroundImage: 'linear-gradient(180deg, rgba(248,250,252,0.5) 0%, rgba(241,245,249,0.45) 50%, rgba(226,232,240,0.5) 100%), url("/about-background.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed',
                        py: { xs: 6, sm: 7, md: 8, lg: 10 },
                        scrollMarginTop: '80px',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '5px',
                            background: 'linear-gradient(90deg, #0d9488 0%, #059669 25%, #10b981 50%, #34d399 75%, #0d9488 100%)',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: '20%',
                            right: '-10%',
                            width: '40%',
                            height: '60%',
                            background: 'radial-gradient(circle, rgba(13, 148, 136, 0.05) 0%, transparent 70%)',
                            borderRadius: '50%',
                            pointerEvents: 'none',
                        },
                        transform: aboutVisible ? 'translateY(0)' : 'translateY(50px)',
                        opacity: aboutVisible ? 1 : 0,
                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: '0.2s',
                    }}
                >
                    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                        {/* Overline */}
                        <Typography
                            variant="overline"
                            align="center"
                            sx={{
                                color: '#0d7a6a',
                                fontWeight: 600,
                                letterSpacing: '0.15em',
                                fontSize: '0.75rem',
                                display: 'block',
                                mb: 2,
                            }}
                        >
                            OUR LEGACY
                        </Typography>

                        {/* Main Title */}
                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                mb: 1,
                                color: '#111827',
                                fontSize: { xs: '1.75rem', md: '2.125rem' },
                                px: { xs: 2, sm: 0 },
                            }}
                        >
                            About the Conference
                        </Typography>

                        {/* Teal Underline */}
                        <Box
                            sx={{
                                width: '60px',
                                height: '4px',
                                bgcolor: '#0d7a6a',
                                mx: 'auto',
                                mb: 3,
                            }}
                        />

                        {/* Subtitle */}
                        <Typography
                            variant="body1"
                            align="center"
                            sx={{
                                mb: { xs: 4, md: 6 },
                                color: '#6b7280',
                                maxWidth: '800px',
                                mx: 'auto',
                                px: { xs: 2, sm: 0 },
                                fontSize: { xs: '0.95rem', md: '1.05rem' },
                                lineHeight: 1.7,
                                transform: aboutVisible ? 'translateY(0)' : 'translateY(20px)',
                                opacity: aboutVisible ? 1 : 0,
                                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                transitionDelay: '0.4s',
                            }}
                        >
                            Joining heritage with sustainable innovation in the heart of Southeast Asian geology.
                        </Typography>

                        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                            {/* Left Box - Why Attend */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper
                                    sx={{
                                        p: { xs: 3, sm: 4, md: 5 },
                                        height: '100%',
                                        background: 'linear-gradient(135deg, #0a4d3c 0%, #094d42 100%)',
                                        color: 'white',
                                        borderRadius: '24px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                        transform: aboutVisible ? 'translateY(0)' : 'translateY(30px)',
                                        opacity: aboutVisible ? 1 : 0,
                                        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                        transitionDelay: '0.5s',
                                        '&:hover': {
                                            transform: aboutVisible ? 'translateY(-8px)' : 'translateY(30px)',
                                            boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        },
                                        '&:active': {
                                            transform: aboutVisible ? 'translateY(-4px) scale(0.98)' : 'translateY(30px)',
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                                            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: '-50px',
                                            right: '-50px',
                                            width: '300px',
                                            height: '300px',
                                            background: 'radial-gradient(circle, rgba(13, 122, 106, 0.2) 0%, transparent 70%)',
                                            borderRadius: '50%',
                                        },
                                    }}
                                >
                                    {/* Ribbon Icon and Title */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
                                        <Box
                                            sx={{
                                                mr: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="8" r="6" />
                                                <path d="M15 13l3 7-3-1-3 1 3-7" />
                                                <path d="M9 13l-3 7 3-1 3 1-3-7" />
                                            </svg>
                                        </Box>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: { xs: '1.4rem', md: '1.65rem' },
                                            }}
                                        >
                                            Why Attend?
                                        </Typography>
                                    </Box>

                                    {/* Benefits List */}
                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                        {[
                                            'Network with leading geologists and researchers',
                                            'Learn about cutting-edge geological research',
                                            'Present your research to an international audience',
                                            'Explore opportunities for collaboration',
                                            'Stay updated on industry trends and innovations',
                                        ].map((item, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'start',
                                                    mb: 2.5,
                                                    '&:last-child': { mb: 0 },
                                                }}
                                            >
                                                {/* Circular Check Icon */}
                                                <Box
                                                    sx={{
                                                        mr: 2,
                                                        mt: 0.2,
                                                        flexShrink: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                                        <path d="M8 12.5L11 15.5L16 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        lineHeight: 1.6,
                                                        fontSize: { xs: '0.92rem', md: '0.98rem' },
                                                        color: 'rgba(255, 255, 255, 0.95)',
                                                    }}
                                                >
                                                    {item}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Right Box - Conference Description */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper
                                    sx={{
                                        p: { xs: 3, sm: 4, md: 5 },
                                        height: '100%',
                                        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                                        borderRadius: '20px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                        border: '1px solid rgba(255,255,255,0.8)',
                                        backdropFilter: 'blur(10px)',
                                        transform: aboutVisible ? 'translateY(0)' : 'translateY(30px)',
                                        opacity: aboutVisible ? 1 : 0,
                                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                        transitionDelay: '0.7s',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '3px',
                                            background: 'linear-gradient(90deg, #0d9488, #14b8a6, #2dd4bf)',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                        },
                                        '&:hover': {
                                            transform: aboutVisible ? 'translateY(-10px) scale(1.01)' : 'translateY(30px)',
                                            boxShadow: '0 20px 40px rgba(13, 148, 136, 0.15)',
                                            border: '1px solid rgba(13, 148, 136, 0.2)',
                                        },
                                        '&:hover::before': {
                                            opacity: 1,
                                        },
                                    }}
                                >
                                    {/* Title */}
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 3,
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        <Box component="span" sx={{ color: '#111827', display: 'block' }}>
                                            A Premier International
                                        </Box>
                                        <Box component="span" sx={{ color: '#0d7a6a', display: 'block' }}>
                                            Geological Gathering
                                        </Box>
                                    </Typography>

                                    {/* First Paragraph */}
                                    <Typography
                                        variant="body2"
                                        paragraph
                                        sx={{
                                            lineHeight: 1.8,
                                            color: '#6b7280',
                                            mb: 2.5,
                                        }}
                                    >
                                        The 55th IAGI – GEOSEA XIX 2026 is organized by the{' '}
                                        <Box component="span" sx={{ fontWeight: 600, color: '#111827' }}>
                                            Indonesian Association of Geologists (IAGI)
                                        </Box>
                                        . This landmark event facilitates high-level exchange between geologists, industry leaders, and researchers across the globe.
                                    </Typography>

                                    {/* Second Paragraph */}
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            lineHeight: 1.8,
                                            color: '#6b7280',
                                        }}
                                    >
                                        We focus on the intersection of resource management, hazard mitigation, and environmental stewardship to build a resilient future for our region.
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Timeline Section */}
                <Box
                    id="timeline"
                    ref={timelineRef}
                    sx={{
                        background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
                        py: { xs: 6, sm: 7, md: 8, lg: 10 },
                        scrollMarginTop: '80px',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '5px',
                            background: 'linear-gradient(90deg, #0d9488 0%, #14b8a6 25%, #2dd4bf 50%, #14b8a6 75%, #0d9488 100%)',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-30%',
                            right: '-10%',
                            width: '50%',
                            height: '80%',
                            background: 'radial-gradient(circle, rgba(13, 148, 136, 0.06) 0%, transparent 60%)',
                            pointerEvents: 'none',
                        },
                        transform: timelineVisible ? 'translateY(0)' : 'translateY(50px)',
                        opacity: timelineVisible ? 1 : 0,
                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: '0.2s',
                    }}
                >
                    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                        {/* Overline */}
                        <Typography
                            variant="overline"
                            align="center"
                            sx={{
                                color: '#0d7a6a',
                                fontWeight: 600,
                                letterSpacing: '0.15em',
                                fontSize: '0.75rem',
                                display: 'block',
                                mb: 1.5,
                            }}
                        >
                            ROADMAP
                        </Typography>

                        {/* Main Title */}
                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                mb: 1.5,
                                color: '#111827',
                                fontSize: { xs: '1.75rem', md: '2.125rem' },
                                px: { xs: 2, sm: 0 }
                            }}
                        >
                            Event Timeline
                        </Typography>

                        {/* Teal Underline */}
                        <Box
                            sx={{
                                width: '60px',
                                height: '4px',
                                bgcolor: '#0d7a6a',
                                mx: 'auto',
                                mb: 3,
                            }}
                        />

                        {/* Subtitle - Quote in Italic */}
                        <Typography
                            variant="body1"
                            align="center"
                            sx={{
                                mb: { xs: 4, md: 6 },
                                color: '#6b7280',
                                px: { xs: 2, sm: 0 },
                                fontStyle: 'italic',
                                fontSize: { xs: '0.95rem', md: '1rem' },
                            }}
                        >
                            "Time is the canvas upon which we build the future of geology."
                        </Typography>

                        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
                            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} justifyContent="center" alignItems="stretch">
                                {(settings.timeline && settings.timeline.length > 0 ? settings.timeline : [
                                    { title: 'Registration Opens', date: 'January 18, 2026', status: 'completed' },
                                    { title: 'Abstract Submission', date: 'February 28, 2026', status: 'active' },
                                    { title: 'Early Bird Deadline', date: 'April 30, 2026', status: 'upcoming' },
                                    { title: 'Final Registration', date: 'June 30, 2026', status: 'upcoming' },
                                    { title: 'Conference Date', date: 'August 15-17, 2026', status: 'upcoming' },
                                ]).map((item, index) => (
                                    <Grid
                                        key={index}
                                        size={{ xs: 12, sm: 6, md: 4, lg: 2.4, xl: 2.4 }}
                                        sx={{
                                            transform: timelineVisible ? 'translateY(0)' : `translateY(${40 + index * 15}px)`,
                                            opacity: timelineVisible ? 1 : 0,
                                            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transitionDelay: `${0.6 + index * 0.15}s`,
                                        }}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: { xs: 3, md: 3.5 },
                                                textAlign: 'center',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                border: item.status === 'active'
                                                    ? '2px solid #0d7a6a'
                                                    : '1px solid rgba(0, 0, 0, 0.06)',
                                                borderRadius: '24px',
                                                position: 'relative',
                                                bgcolor: item.status === 'active'
                                                    ? 'linear-gradient(135deg, #f0fdf9 0%, #ecfdf5 100%)'
                                                    : 'rgba(255, 255, 255, 0.9)',
                                                background: item.status === 'active'
                                                    ? 'linear-gradient(135deg, #f0fdf9 0%, #ecfdf5 100%)'
                                                    : 'rgba(255, 255, 255, 0.95)',
                                                backdropFilter: 'blur(10px)',
                                                boxShadow: item.status === 'active'
                                                    ? '0 8px 32px rgba(13, 122, 106, 0.15), 0 0 0 1px rgba(13, 122, 106, 0.1)'
                                                    : '0 4px 20px rgba(0, 0, 0, 0.04), 0 8px 32px rgba(0, 0, 0, 0.02)',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                overflow: 'visible',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    width: item.status === 'active' ? '80%' : '0%',
                                                    height: '3px',
                                                    borderRadius: '0 0 8px 8px',
                                                    background: 'linear-gradient(90deg, #0d7a6a 0%, #10b981 100%)',
                                                    transition: 'width 0.3s ease',
                                                },
                                                '&:hover': {
                                                    transform: 'translateY(-10px)',
                                                    boxShadow: item.status === 'active'
                                                        ? '0 20px 48px rgba(13, 122, 106, 0.25), 0 0 0 1px rgba(13, 122, 106, 0.15)'
                                                        : '0 16px 40px rgba(0, 0, 0, 0.1)',
                                                    '&::before': {
                                                        width: '80%',
                                                    },
                                                },
                                            }}
                                        >
                                            {/* Status Badge */}
                                            {item.status === 'active' && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -14,
                                                        left: '50%',
                                                        transform: 'translateX(-50%)',
                                                        background: 'linear-gradient(135deg, #0d7a6a 0%, #10b981 100%)',
                                                        color: 'white',
                                                        px: 2.5,
                                                        py: 0.75,
                                                        borderRadius: '20px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 700,
                                                        letterSpacing: '0.5px',
                                                        boxShadow: '0 4px 12px rgba(13, 122, 106, 0.3)',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    ACTIVE NOW
                                                </Box>
                                            )}

                                            {/* Icon Container */}
                                            <Box
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: '20px',
                                                    background: item.status === 'completed'
                                                        ? 'linear-gradient(135deg, #10b981 0%, #0d7a6a 100%)'
                                                        : item.status === 'active'
                                                            ? 'linear-gradient(135deg, #0d7a6a 0%, #059669 100%)'
                                                            : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                                                    color: item.status === 'upcoming' ? '#9ca3af' : 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mb: 2.5,
                                                    boxShadow: item.status === 'active' || item.status === 'completed'
                                                        ? '0 8px 24px rgba(13, 122, 106, 0.25)'
                                                        : '0 4px 12px rgba(0, 0, 0, 0.06)',
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                <CheckIcon sx={{ fontSize: 30 }} />
                                            </Box>

                                            {/* Title */}
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: { xs: '0.95rem', md: '1rem' },
                                                    color: item.status === 'active' ? '#0d7a6a' : '#1f2937',
                                                    mb: 1,
                                                    minHeight: '2.8em',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {item.title}
                                            </Typography>

                                            {/* Date */}
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: item.status === 'active' ? '#059669' : '#6b7280',
                                                    fontSize: '0.875rem',
                                                    fontWeight: item.status === 'active' ? 600 : 400,
                                                }}
                                            >
                                                {item.date}
                                            </Typography>

                                            {/* Status Indicator Bar */}
                                            <Box
                                                sx={{
                                                    mt: 2.5,
                                                    width: '100%',
                                                    height: 4,
                                                    bgcolor: item.status === 'completed'
                                                        ? 'rgba(16, 185, 129, 0.15)'
                                                        : item.status === 'active'
                                                            ? 'rgba(13, 122, 106, 0.1)'
                                                            : 'rgba(0, 0, 0, 0.04)',
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: item.status === 'completed'
                                                            ? '100%'
                                                            : item.status === 'active'
                                                                ? '50%'
                                                                : '0%',
                                                        height: '100%',
                                                        background: item.status === 'completed'
                                                            ? 'linear-gradient(90deg, #10b981 0%, #0d7a6a 100%)'
                                                            : 'linear-gradient(90deg, #0d7a6a 0%, #10b981 100%)',
                                                        borderRadius: 2,
                                                        transition: 'width 0.5s ease',
                                                    }}
                                                />
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Container>
                </Box>

                {/* Seminar Resources Section */}
                <Box
                    id="resources"
                    ref={resourcesRef}
                    sx={{
                        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
                        py: { xs: 6, sm: 7, md: 8, lg: 10 },
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '5px',
                            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 25%, #a855f7 50%, #8b5cf6 75%, #6366f1 100%)',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: '10%',
                            left: '-15%',
                            width: '45%',
                            height: '70%',
                            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 60%)',
                            pointerEvents: 'none',
                        },
                        transform: resourcesVisible ? 'translateY(0)' : 'translateY(50px)',
                        opacity: resourcesVisible ? 1 : 0,
                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: '0.2s',
                    }}
                >
                    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                        <Typography
                            variant="overline"
                            align="center"
                            sx={{
                                color: '#0d7a6a',
                                fontWeight: 600,
                                letterSpacing: '0.15em',
                                fontSize: { xs: '0.85rem', md: '0.92rem' },
                                display: 'block',
                                mb: 1.5,
                            }}
                        >
                            {settings.resources_text?.section_label || 'DOWNLOADS'}
                        </Typography>
                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                mb: 2,
                                color: '#111827',
                                fontSize: { xs: '1.75rem', md: '2.125rem' },
                                px: { xs: 2, sm: 0 },
                            }}
                        >
                            {settings.resources_text?.title || 'Seminar Resources'}
                        </Typography>
                        <Typography
                            variant="body1"
                            align="center"
                            sx={{
                                mb: { xs: 4, md: 6 },
                                color: '#6b7280',
                                px: { xs: 2, sm: 0 },
                                maxWidth: '600px',
                                mx: 'auto',
                                transform: resourcesVisible ? 'translateY(0)' : 'translateY(20px)',
                                opacity: resourcesVisible ? 1 : 0,
                                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                transitionDelay: '0.4s',
                            }}
                        >
                            {settings.resources_text?.subtitle || 'Everything you need to prepare a professional presentation for the IAGI-GEOSEA 2026 conference.'}
                        </Typography>

                        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
                            {settings.resources && settings.resources.length > 0 ? (
                                settings.resources.map((resource, index) => (
                                    <Grid
                                        key={index}
                                        size={{ xs: 12, sm: 6, md: 4 }}
                                        sx={{
                                            transform: resourcesVisible ? 'translateY(0)' : `translateY(${30 + index * 10}px)`,
                                            opacity: resourcesVisible ? 1 : 0,
                                            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transitionDelay: `${0.6 + index * 0.1}s`,
                                        }}
                                    >
                                        <Paper
                                            sx={{
                                                p: { xs: 3, sm: 3.5, md: 4 },
                                                textAlign: 'center',
                                                background: '#ffffff',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                borderRadius: '20px',
                                                border: '1px solid rgba(0, 0, 0, 0.06)',
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04), 0 8px 32px rgba(0, 0, 0, 0.02)',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                height: '100%',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '4px',
                                                    background: 'linear-gradient(90deg, #0d7a6a 0%, #10b981 50%, #34d399 100%)',
                                                    transform: 'scaleX(0)',
                                                    transformOrigin: 'left',
                                                    transition: 'transform 0.4s ease',
                                                },
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: '0 12px 40px rgba(13, 122, 106, 0.12), 0 20px 48px rgba(0, 0, 0, 0.06)',
                                                    border: '1px solid rgba(13, 122, 106, 0.15)',
                                                    '&::before': {
                                                        transform: 'scaleX(1)',
                                                    },
                                                },
                                            }}
                                        >
                                            {/* Icon Container with Gradient Background */}
                                            <Box
                                                sx={{
                                                    width: 72,
                                                    height: 72,
                                                    borderRadius: '16px',
                                                    background: 'linear-gradient(135deg, rgba(13, 122, 106, 0.08) 0%, rgba(16, 185, 129, 0.12) 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mx: 'auto',
                                                    mb: 2.5,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, rgba(13, 122, 106, 0.12) 0%, rgba(16, 185, 129, 0.18) 100%)',
                                                        transform: 'scale(1.05)',
                                                    },
                                                }}
                                            >
                                                <DescriptionIcon sx={{ fontSize: 36, color: '#0d7a6a' }} />
                                            </Box>

                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{
                                                    fontWeight: 700,
                                                    color: '#1f2937',
                                                    fontSize: { xs: '1rem', md: '1.1rem' },
                                                    lineHeight: 1.4,
                                                    minHeight: { xs: 'auto', md: '2.8em' },
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {resource.title}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mb: 3,
                                                    color: '#6b7280',
                                                    fontSize: '0.875rem',
                                                    lineHeight: 1.6,
                                                    flexGrow: 1,
                                                }}
                                            >
                                                {resource.description || 'Downloadable resource'}
                                            </Typography>

                                            <Button
                                                component="a"
                                                href={resource.file_url}
                                                download
                                                variant="contained"
                                                startIcon={<DownloadIcon />}
                                                fullWidth
                                                sx={{
                                                    background: 'linear-gradient(135deg, #0d7a6a 0%, #10b981 100%)',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    py: 1.5,
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    fontSize: '0.9rem',
                                                    boxShadow: '0 4px 12px rgba(13, 122, 106, 0.25)',
                                                    mt: 'auto',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #0a6356 0%, #0d9668 100%)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 8px 20px rgba(13, 122, 106, 0.35)',
                                                    },
                                                }}
                                            >
                                                Download {
                                                    resource.file_type === 'pdf' ? 'PDF' :
                                                        ['ppt', 'pptx'].includes(resource.file_type) ? 'PowerPoint' :
                                                            ['doc', 'docx'].includes(resource.file_type) ? 'Word Document' :
                                                                resource.file_type === 'txt' ? 'Text File' :
                                                                    'File'
                                                }
                                            </Button>
                                        </Paper>
                                    </Grid>
                                ))
                            ) : (
                                <Grid size={12}>
                                    <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
                                        No resources available yet. Please check back later.
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Container>
                </Box>

                {/* Submission Procedure Section */}
                <Box
                    id="faq"
                    sx={{
                        py: { xs: 6, sm: 7, md: 8, lg: 10 },
                        background: settings.faq_background?.url
                            ? 'none'
                            : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                        backgroundImage: settings.faq_background?.url
                            ? `linear-gradient(rgba(248, 250, 252, 0.65), rgba(226, 232, 240, 0.65)), url(${settings.faq_background?.url})`
                            : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: { xs: 'scroll', md: 'fixed' },
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                        {/* Title */}
                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                                color: '#111827',
                                fontSize: { xs: '1.75rem', md: '2.5rem' },
                                letterSpacing: '0.05em',
                            }}
                        >
                            {settings.faq_text?.title || 'FREQUENTLY ASKED QUESTION'}
                        </Typography>

                        <Typography
                            variant="body1"
                            align="center"
                            sx={{
                                mb: { xs: 4, md: 6 },
                                color: '#6b7280',
                                maxWidth: '700px',
                                mx: 'auto',
                                fontSize: { xs: '0.95rem', md: '1.1rem' },
                            }}
                        >
                            {settings.faq_text?.subtitle || 'Follow these simple steps to submit your abstract for the conference'}
                        </Typography>

                        {/* Glassmorphism Box Container */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 3, sm: 4, md: 5 },
                                borderRadius: '20px',
                                bgcolor: 'rgba(255, 255, 255, 0.25)',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                            }}
                        >
                            {/* Two Column Layout - Dynamic Sections */}
                            <Grid container spacing={6}>
                                {(() => {
                                    // Get procedure data with backward compatibility
                                    const procedureData = settings.submission_procedure;
                                    let sections = [];

                                    if (Array.isArray(procedureData)) {
                                        // New array format
                                        sections = procedureData;
                                    } else if (procedureData && typeof procedureData === 'object') {
                                        // Old object format - convert to array
                                        if (procedureData.pendaftaran) {
                                            sections.push({ title: 'PENDAFTARAN', items: procedureData.pendaftaran });
                                        }
                                        if (procedureData.abstract) {
                                            sections.push({ title: 'SUBMISSION ABSTRACT', items: procedureData.abstract });
                                        }
                                    }

                                    // Fallback to defaults if empty
                                    if (sections.length === 0) {
                                        sections = [
                                            {
                                                title: 'PENDAFTARAN',
                                                items: [
                                                    { text: 'Register on our platform with your email', link: '/register' },
                                                    { text: 'Complete your profile information', link: '/dashboard' },
                                                    { text: 'Choose your participation category', link: '/register' },
                                                    { text: 'Wait for account verification', link: '' },
                                                ],
                                            },
                                            {
                                                title: 'SUBMISSION ABSTRACT',
                                                items: [
                                                    { text: 'Download the abstract template from Resources', link: '#resources' },
                                                    { text: 'Prepare your abstract following the guidelines', link: '#resources' },
                                                    { text: 'Upload your abstract through the submission portal', link: '/dashboard' },
                                                    { text: 'Track your submission status in your dashboard', link: '/dashboard' },
                                                ],
                                            },
                                        ];
                                    }

                                    return sections.map((section, sectionIndex) => (
                                        <Grid item xs={12} md={6} key={sectionIndex}>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: '#111827',
                                                    mb: 3,
                                                    fontSize: { xs: '1.75rem', md: '2rem' },
                                                    letterSpacing: '0.02em',
                                                }}
                                            >
                                                {section.title}
                                            </Typography>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                                {(section.items || []).map((item, index) => {
                                                    // Determine if this is an external link (PDF/storage) or internal route
                                                    const isExternalLink = item.link && (item.link.includes('/storage/') || item.link.startsWith('http'));
                                                    const LinkComponent = isExternalLink ? 'a' : (item.link ? Link : 'div');

                                                    return (
                                                        <Box
                                                            key={index}
                                                            component={LinkComponent}
                                                            href={item.link || undefined}
                                                            target={isExternalLink ? '_blank' : undefined}
                                                            rel={isExternalLink ? 'noopener noreferrer' : undefined}
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                gap: 1.5,
                                                                textDecoration: 'none',
                                                                cursor: item.link ? 'pointer' : 'default',
                                                                p: 1.5,
                                                                mx: -1.5,
                                                                borderRadius: '8px',
                                                                transition: 'all 0.2s ease',
                                                                '&:hover': item.link ? {
                                                                    bgcolor: 'rgba(13, 122, 106, 0.08)',
                                                                    transform: 'translateX(4px)',
                                                                } : {},
                                                            }}
                                                        >
                                                            <Typography sx={{ color: '#0d7a6a', fontWeight: 600, fontSize: '1.5rem' }}>›</Typography>
                                                            <Typography
                                                                sx={{
                                                                    color: item.link ? '#0d7a6a' : '#374151',
                                                                    fontSize: { xs: '1.15rem', md: '1.3rem' },
                                                                    lineHeight: 1.6,
                                                                    fontWeight: item.link ? 500 : 400,
                                                                    '&:hover': item.link ? {
                                                                        textDecoration: 'underline',
                                                                    } : {},
                                                                }}
                                                            >
                                                                {item.text}
                                                            </Typography>
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        </Grid>
                                    ));
                                })()}
                            </Grid>
                        </Paper>
                    </Container>
                </Box>


                {/* Keynote Speakers Section */}
                <Box
                    id="speakers"
                    ref={speakersRef}
                    sx={{
                        backgroundImage: 'url("/keynote-speakers-bg.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed',
                        py: { xs: 6, sm: 8, md: 10, lg: 12 },
                        scrollMarginTop: '80px',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(248,250,252,0.35) 100%)',
                            pointerEvents: 'none',
                        },
                        transform: speakersVisible ? 'translateY(0)' : 'translateY(50px)',
                        opacity: speakersVisible ? 1 : 0,
                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: '0.2s',
                    }}
                >
                    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
                        {/* Section Header */}
                        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
                            <Typography
                                variant="overline"
                                sx={{
                                    color: '#0d7a6a',
                                    fontWeight: 700,
                                    letterSpacing: '0.15em',
                                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                                    display: 'block',
                                    mb: 1.5,
                                    textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                                }}
                            >
                                VISIONARIES
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    color: '#1e3a5f',
                                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                                    mb: 2,
                                    letterSpacing: '-0.02em',
                                    textShadow: '0 2px 4px rgba(255,255,255,0.8)',
                                }}
                            >
                                Keynote Speakers
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#374151',
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    lineHeight: 1.7,
                                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                                    textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                                }}
                            >
                                {settings.keynote_speakers_description}
                            </Typography>
                        </Box>

                        {/* Speaker Cards - Responsive Horizontal Scroll */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: { xs: 'nowrap', lg: 'wrap' },
                                justifyContent: { lg: 'center' },
                                gap: { xs: 2, sm: 2.5, md: 3, lg: 3 },
                                overflowX: { xs: 'auto', lg: 'visible' },
                                overflowY: 'visible',
                                scrollSnapType: { xs: 'x mandatory', lg: 'none' },
                                scrollBehavior: 'smooth',
                                pb: { xs: 2, lg: 3 },
                                px: { xs: 2, md: 0 },
                                mx: { xs: -2, md: 0 },
                                // Custom scrollbar styling
                                '&::-webkit-scrollbar': {
                                    height: '8px',
                                    display: { xs: 'block', lg: 'none' },
                                },
                                '&::-webkit-scrollbar-track': {
                                    bgcolor: '#e5e7eb',
                                    borderRadius: '4px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    bgcolor: '#0d7a6a',
                                    borderRadius: '4px',
                                    '&:hover': {
                                        bgcolor: '#094d42',
                                    },
                                },
                            }}
                        >
                            {(settings.keynote_speakers && settings.keynote_speakers.length > 0
                                ? settings.keynote_speakers.filter(speaker => speaker.name && speaker.name.trim() !== '')
                                : []
                            ).map((speaker, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        // Responsive card sizing with breakpoints
                                        // xs (0-600px): 1 card visible (85% width)
                                        // sm (600-900px): 2 cards visible (48% width each)
                                        // md (900-1200px): 2 cards visible (48% width each)
                                        // lg (1200px+): 3 cards visible (31% width each)
                                        minWidth: {
                                            xs: '85%',
                                            sm: '48%',
                                            md: '48%',
                                            lg: '31%',
                                        },
                                        flex: {
                                            xs: '0 0 85%',
                                            sm: '0 0 48%',
                                            md: '0 0 48%',
                                            lg: '0 0 31%',
                                        },
                                        scrollSnapAlign: { xs: 'center', lg: 'none' },
                                        transform: speakersVisible ? 'translateY(0)' : `translateY(${30 + index * 10}px)`,
                                        opacity: speakersVisible ? 1 : 0,
                                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                        transitionDelay: `${0.4 + index * 0.1}s`,
                                    }}
                                >
                                    {/* Speaker Card with Image Background */}
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            aspectRatio: '3/4',
                                            borderRadius: '20px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                transform: 'translateY(-12px) scale(1.02)',
                                                boxShadow: '0 25px 50px rgba(13, 148, 136, 0.25)',
                                                '& .speaker-overlay': {
                                                    background: 'linear-gradient(to top, rgba(9, 77, 66, 0.9) 0%, rgba(13, 122, 106, 0.6) 40%, transparent 100%)',
                                                },
                                                '& .speaker-image': {
                                                    transform: 'scale(1.1)',
                                                },
                                            },
                                        }}
                                    >
                                        {/* Background Image */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundImage: speaker.photo ? `url(${speaker.photo})` : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}
                                        />

                                        {/* Gradient Overlay */}
                                        <Box
                                            className="speaker-overlay"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 30%)',
                                                transition: 'background 0.4s ease',
                                            }}
                                        />

                                        {/* Speaker Name on Card */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                p: 3,
                                                zIndex: 2,
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {speaker.name}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Speaker Info Below Card */}
                                    <Box sx={{ mt: 2.5, textAlign: 'center' }}>
                                        <Typography
                                            sx={{
                                                color: '#ffffff',
                                                fontWeight: 700,
                                                fontSize: '1.1rem',
                                                letterSpacing: '0.05em',
                                                textTransform: 'uppercase',
                                                mb: 0.5,
                                                textShadow: '0 2px 6px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)',
                                            }}
                                        >
                                            {speaker.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: 'rgba(255,255,255,0.9)',
                                                fontSize: '1rem',
                                                fontWeight: 500,
                                                fontStyle: 'italic',
                                                textShadow: '0 2px 6px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)',
                                            }}
                                        >
                                            {speaker.institution}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>



                    </Container>
                </Box>


                {/* Sponsors Section */}
                <Box
                    ref={sponsorsRef}
                    sx={{
                        py: { xs: 6, sm: 7, md: 8, lg: 10 },
                        backgroundImage: 'url("/WhatsApp Image 2026-02-06 at 09.55.24.jpeg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(248,250,252,0.35) 50%, rgba(226,232,240,0.35) 100%)',
                            pointerEvents: 'none',
                        },
                        transform: sponsorsVisible ? 'translateY(0)' : 'translateY(50px)',
                        opacity: sponsorsVisible ? 1 : 0,
                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: '0.2s',
                    }}
                >
                    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                        {/* Main Title */}
                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                                color: '#111827',
                                fontSize: { xs: '1.75rem', md: '2.5rem' },
                                px: { xs: 2, sm: 0 },
                                letterSpacing: '0.05em',
                            }}
                        >
                            SUPPORTED BY :
                        </Typography>

                        {/* Subtitle - only show if description is not empty */}
                        {settings.sponsors_description && settings.sponsors_description.trim() !== '' && (
                            <Typography
                                variant="body1"
                                align="center"
                                sx={{
                                    mb: { xs: 4, md: 6 },
                                    color: '#3b82f6',
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    px: { xs: 2, sm: 0 },
                                    fontStyle: 'italic',
                                    fontSize: { xs: '0.95rem', md: '1rem' },
                                    transform: sponsorsVisible ? 'translateY(0)' : 'translateY(20px)',
                                    opacity: sponsorsVisible ? 1 : 0,
                                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transitionDelay: '0.4s',
                                }}
                            >
                                {settings.sponsors_description}
                            </Typography>
                        )}

                        {/* Display all sponsors logos without tiers */}
                        {(() => {
                            const sponsors = settings.sponsors && settings.sponsors.length > 0 ? settings.sponsors : [];
                            if (sponsors.length === 0) return null;

                            // Duplicate sponsors for seamless infinite scroll
                            const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors];

                            return (
                                <Box sx={{ mb: 5 }}>
                                    {/* Full Width Marquee Container */}
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: '100vw',
                                            marginLeft: 'calc(-50vw + 50%)',
                                            overflow: 'hidden',
                                            '&::before, &::after': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                bottom: 0,
                                                width: '60px',
                                                zIndex: 2,
                                                pointerEvents: 'none',
                                            },
                                            '&::before': {
                                                left: 0,
                                                background: 'linear-gradient(to right, rgba(255,255,255,0.5) 0%, transparent 100%)',
                                            },
                                            '&::after': {
                                                right: 0,
                                                background: 'linear-gradient(to left, rgba(255,255,255,0.5) 0%, transparent 100%)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 4,
                                                animation: 'marquee 40s linear infinite',
                                                '&:hover': {
                                                    animationPlayState: 'paused',
                                                },
                                                '@keyframes marquee': {
                                                    '0%': { transform: 'translateX(0)' },
                                                    '100%': { transform: `translateX(-${sponsors.length * 312}px)` },
                                                },
                                            }}
                                        >
                                            {duplicatedSponsors.map((sponsor, index) => (
                                                <Paper
                                                    key={index}
                                                    elevation={2}
                                                    sx={{
                                                        p: 3,
                                                        minWidth: { xs: 220, sm: 260, md: 280 },
                                                        height: { xs: 140, sm: 150, md: 160 },
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        cursor: 'pointer',
                                                        bgcolor: 'white',
                                                        borderRadius: '20px',
                                                        border: '1px solid rgba(0, 0, 0, 0.06)',
                                                        flexShrink: 0,
                                                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                                                        '&:hover': {
                                                            transform: 'translateY(-8px) scale(1.03)',
                                                            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)',
                                                        },
                                                    }}
                                                >
                                                    {/* Logo Display Only */}
                                                    {sponsor.logo ? (
                                                        <Box
                                                            sx={{
                                                                width: '100%',
                                                                height: '100%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <img
                                                                src={sponsor.logo}
                                                                alt="Supported by"
                                                                style={{
                                                                    maxWidth: '100%',
                                                                    maxHeight: '100%',
                                                                    objectFit: 'contain',
                                                                }}
                                                            />
                                                        </Box>
                                                    ) : (
                                                        <Box
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: '#f9fafb',
                                                                borderRadius: 2,
                                                            }}
                                                        >
                                                            <SettingsIcon sx={{ fontSize: 40, color: '#9ca3af' }} />
                                                        </Box>
                                                    )}
                                                </Paper>
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })()}
                    </Container>
                </Box>

                {/* Combined Footer with Venue */}
                <Box
                    id="venue"
                    sx={{
                        background: 'linear-gradient(135deg, #094d42 0%, #0a3d35 100%)',
                        color: 'white',
                        pt: { xs: 6, sm: 7, md: 8 },
                        pb: { xs: 4, sm: 5, md: 6 },
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #0d9488 0%, #475569 25%, #78716c 50%, #a8a29e 75%, #0d9488 100%)',
                        },
                    }}
                >
                    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>

                        <Grid container spacing={{ xs: 4, sm: 5, md: 4 }} justifyContent="space-between">
                            {/* Brand & Social Media Column */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                {/* Logo & Title */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3.5 }}>
                                    <Avatar
                                        src="/WhatsApp_Image_2025-12-29_at_19.37.46-removebg-preview.png"
                                        sx={{
                                            width: 70,
                                            height: 70,
                                            bgcolor: 'white',
                                            p: 1,
                                            boxShadow: '0 8px 32px rgba(77, 212, 172, 0.25)',
                                            border: '2px solid rgba(77, 212, 172, 0.3)',
                                        }}
                                    />
                                    <Box>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: { xs: '1.35rem', md: '1.5rem' },
                                                background: 'linear-gradient(135deg, #4dd4ac 0%, #6ee7b7 50%, #4dd4ac 100%)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                letterSpacing: '0.03em',
                                                lineHeight: 1.2,
                                                fontFamily: '"Inter", "Segoe UI", sans-serif',
                                                textShadow: '0 2px 20px rgba(77, 212, 172, 0.3)',
                                            }}
                                        >
                                            PIT IAGI-GEOSEA XIX
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: '0.9rem',
                                                color: 'rgba(255,255,255,0.75)',
                                                fontWeight: 600,
                                                letterSpacing: '0.15em',
                                                textTransform: 'uppercase',
                                                fontFamily: '"Inter", "Segoe UI", sans-serif',
                                                mt: 0.3,
                                            }}
                                        >
                                            55TH 2026 Conference
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 4,
                                        fontSize: { xs: '0.92rem', md: '0.98rem' },
                                        lineHeight: 1.85,
                                        color: 'rgba(255,255,255,0.8)',
                                        maxWidth: '420px',
                                        fontFamily: '"Inter", "Segoe UI", sans-serif',
                                        fontWeight: 400,
                                    }}
                                >
                                    Indonesian Association of Geologists (IAGI) proudly presents the 55th Annual Convention & GEOSEA XIX - Southeast Asia's premier geological conference.
                                </Typography>
                            </Grid>

                            {/* Quick Links Column */}
                            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: { xs: '1rem', md: '1.1rem' },
                                        mb: 3,
                                        color: '#4dd4ac',
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: -8,
                                            left: 0,
                                            width: 30,
                                            height: 2,
                                            bgcolor: '#4dd4ac',
                                            borderRadius: 1,
                                        }
                                    }}
                                >
                                    Quick Links
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                                    {[
                                        { label: 'About', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
                                        { label: 'Speakers', action: () => document.getElementById('speakers')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
                                        { label: 'Timeline', action: () => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
                                        { label: 'Resources', action: () => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
                                    ].map((item, index) => (
                                        <Typography
                                            key={index}
                                            onClick={item.action}
                                            sx={{
                                                color: 'rgba(255,255,255,0.75)',
                                                fontSize: '0.92rem',
                                                fontFamily: '"Inter", "Segoe UI", sans-serif',
                                                fontWeight: 400,
                                                transition: 'all 0.25s ease',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                '&:hover': {
                                                    color: '#4dd4ac',
                                                    pl: 1,
                                                },
                                                '&::before': {
                                                    content: '"→"',
                                                    opacity: 0,
                                                    transition: 'all 0.25s ease',
                                                },
                                                '&:hover::before': {
                                                    opacity: 1,
                                                }
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                    ))}
                                </Box>
                            </Grid>

                            {/* Account Column */}
                            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: { xs: '1rem', md: '1.1rem' },
                                        mb: 3,
                                        color: '#4dd4ac',
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: -8,
                                            left: 0,
                                            width: 30,
                                            height: 2,
                                            bgcolor: '#4dd4ac',
                                            borderRadius: 1,
                                        }
                                    }}
                                >
                                    Account
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                                    {!auth.user && (
                                        <>
                                            <Link
                                                href="/register"
                                                sx={{
                                                    color: 'rgba(255,255,255,0.75)',
                                                    textDecoration: 'none',
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.25s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    '&:hover': {
                                                        color: '#4dd4ac',
                                                        pl: 1,
                                                    },
                                                    '&::before': {
                                                        content: '"→"',
                                                        opacity: 0,
                                                        transition: 'all 0.25s ease',
                                                    },
                                                    '&:hover::before': {
                                                        opacity: 1,
                                                    }
                                                }}
                                            >
                                                Register
                                            </Link>
                                            <Link
                                                href="/login"
                                                sx={{
                                                    color: 'rgba(255,255,255,0.75)',
                                                    textDecoration: 'none',
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.25s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    '&:hover': {
                                                        color: '#4dd4ac',
                                                        pl: 1,
                                                    },
                                                    '&::before': {
                                                        content: '"→"',
                                                        opacity: 0,
                                                        transition: 'all 0.25s ease',
                                                    },
                                                    '&:hover::before': {
                                                        opacity: 1,
                                                    }
                                                }}
                                            >
                                                Login
                                            </Link>
                                        </>
                                    )}
                                    {auth.user && (
                                        <Link
                                            href="/dashboard"
                                            sx={{
                                                color: 'rgba(255,255,255,0.75)',
                                                textDecoration: 'none',
                                                fontSize: '0.9rem',
                                                transition: 'all 0.25s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                '&:hover': {
                                                    color: '#4dd4ac',
                                                    pl: 1,
                                                },
                                                '&::before': {
                                                    content: '"→"',
                                                    opacity: 0,
                                                    transition: 'all 0.25s ease',
                                                },
                                                '&:hover::before': {
                                                    opacity: 1,
                                                }
                                            }}
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Divider */}
                        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.15)', pt: { xs: 4, md: 5 } }} />
                        {/* Venue & Map Row */}
                        <Grid container spacing={3} sx={{ mb: { xs: 5, md: 6 } }}>
                            {/* Venue Info Card */}
                            <Grid size={{ xs: 12, md: 5 }}>
                                <Box
                                    sx={{
                                        p: { xs: 3, md: 4 },
                                        borderRadius: '20px',
                                        height: '100%',
                                        background: 'rgba(255,255,255,0.08)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.3rem',
                                            }}
                                        >
                                            🏛️
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>
                                                {settings.contact_info?.venue_name || 'Conference Venue'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                {settings.contact_info?.venue_subtitle || 'Main Conference Hall'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                            <LocationIcon sx={{ color: '#4dd4ac', mt: 0.3, fontSize: 20 }} />
                                            <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                                {settings.contact_info?.location || settings.contact_address || 'Address not set'}
                                            </Typography>
                                        </Box>
                                        <Box
                                            component="a"
                                            href={`https://wa.me/${(settings.contact_info?.phone || settings.contact_phone || '').replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                                        >
                                            <Box sx={{ color: '#4dd4ac', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                </svg>
                                            </Box>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                                                {settings.contact_info?.phone || settings.contact_phone}
                                            </Typography>
                                        </Box>
                                        <Box
                                            component="a"
                                            href={(() => {
                                                const telegram = settings.contact_info?.telegram || '@iagi_geosea2026';
                                                // If it's a full URL (http/https) or a known shortener, use directly
                                                if (telegram.startsWith('http://') || telegram.startsWith('https://')) {
                                                    return telegram;
                                                }
                                                // If it looks like a domain (contains . but doesn't start with @), add https://
                                                if (telegram.includes('.') && !telegram.startsWith('@')) {
                                                    return `https://${telegram}`;
                                                }
                                                // Otherwise treat as username
                                                const username = telegram.replace('@', '');
                                                return `https://t.me/${username}`;
                                            })()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                                        >
                                            <Box sx={{ color: '#4dd4ac', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                                </svg>
                                            </Box>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                                                {settings.contact_info?.telegram || '@iagi_geosea2026'}
                                            </Typography>
                                        </Box>
                                        <Box
                                            component="a"
                                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${settings.contact_info?.email || settings.contact_email || ''}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                                        >
                                            <EmailIcon sx={{ color: '#4dd4ac', fontSize: 20 }} />
                                            <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                                                {settings.contact_info?.email || settings.contact_email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                </Box>
                            </Grid>

                            {/* Map */}
                            <Grid size={{ xs: 12, md: 7 }}>
                                {settings.contact_info?.maps_url && settings.contact_info.maps_url.trim() !== '' ? (
                                    <Box
                                        sx={{
                                            borderRadius: '20px',
                                            height: { xs: 280, md: '100%' },
                                            minHeight: 300,
                                            overflow: 'hidden',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                        }}
                                    >
                                        <iframe
                                            src={settings.contact_info.maps_url}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0, minHeight: 300 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            borderRadius: '20px',
                                            height: { xs: 280, md: '100%' },
                                            minHeight: 300,
                                            background: 'rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px dashed rgba(255,255,255,0.2)',
                                        }}
                                    >
                                        <Box sx={{ textAlign: 'center', p: 4 }}>
                                            <Typography sx={{ fontSize: '3rem', mb: 1 }}>🗺️</Typography>
                                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, mb: 0.5 }}>
                                                Interactive Map
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 250 }}>
                                                Set Maps URL in Landing Page Settings
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>

                        {/* Follow Us Section - Full Width Centered */}
                        <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 5 } }}>
                            <Typography
                                sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: 'rgba(255,255,255,0.5)',
                                    mb: 2,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.2em',
                                    fontFamily: '"Inter", "Segoe UI", sans-serif',
                                }}
                            >
                                Follow Us
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                                {[
                                    { icon: 'instagram', url: settings.social_media?.instagram || '#', color: '#E4405F' },
                                    { icon: 'facebook', url: settings.social_media?.facebook || '#', color: '#1877F2' },
                                    { icon: 'twitter', url: settings.social_media?.twitter || '#', color: '#1DA1F2' },
                                    { icon: 'youtube', url: settings.social_media?.youtube || '#', color: '#FF0000' },
                                ].map((social, index) => (
                                    <Box
                                        key={index}
                                        component="a"
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: '12px',
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            cursor: 'pointer',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            '&:hover': {
                                                bgcolor: social.color,
                                                transform: 'translateY(-4px)',
                                                boxShadow: `0 8px 25px ${social.color}40`,
                                                border: 'none',
                                            }
                                        }}
                                    >
                                        {social.icon === 'instagram' && (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            </svg>
                                        )}
                                        {social.icon === 'facebook' && (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        )}
                                        {social.icon === 'twitter' && (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        )}
                                        {social.icon === 'youtube' && (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                            </svg>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* Bottom Bar */}
                        <Box
                            sx={{
                                mt: { xs: 5, md: 6 },
                                pt: { xs: 3, md: 4 },
                                borderTop: '1px solid rgba(77, 212, 172, 0.2)',
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 2.5,
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: { xs: '0.82rem', md: '0.88rem' },
                                    color: 'rgba(255,255,255,0.55)',
                                    letterSpacing: '0.03em',
                                    textAlign: { xs: 'center', md: 'left' },
                                    fontFamily: '"Inter", "Segoe UI", sans-serif',
                                    fontWeight: 400,
                                }}
                            >
                                © 2026 PIT IAGI-GEOSEA XIX. All rights reserved.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: { xs: 2, md: 3.5 } }}>
                                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, index) => (
                                    <Typography
                                        key={index}
                                        sx={{
                                            fontSize: { xs: '0.78rem', md: '0.82rem' },
                                            color: 'rgba(255,255,255,0.5)',
                                            cursor: 'pointer',
                                            transition: 'all 0.25s ease',
                                            fontFamily: '"Inter", "Segoe UI", sans-serif',
                                            fontWeight: 500,
                                            '&:hover': {
                                                color: '#4dd4ac',
                                            }
                                        }}
                                    >
                                        {item}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    </Container>
                </Box >
            </Box >
        </ThemeProvider >
    );
}
