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
        sponsors: [],
        resources: [],
        timeline: [],
        countdown_target_date: '2026-01-18T00:00:00',
        contact_phone: '+62 21 1234 5678',
        contact_email: 'info@iagi-geosea2026.org',
        contact_address: 'UPN Veteran Yogyakarta\nJl. SWK 104 (Lingkar Utara)\nYogyakarta 55283'
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
        { label: 'CONTACT', action: () => document.getElementById('contact-us')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
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
                                    PIT IAHI-GEOSEA XIX <Box component="span" sx={{ color: scrolled ? '#0d7a6a' : '#4dd4ac', transition: 'color 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>2026</Box>
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
                                    55TH EDITION
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
                                    Login
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
                    {/* Video Background */}
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
                        <source src="/hero-background.mp4" type="video/mp4" />
                    </Box>

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
                            {/* Logo */}
                            <Box sx={{ mb: { xs: 3, sm: 4, md: 4 } }}>
                                <Avatar
                                    src="/WhatsApp_Image_2025-12-29_at_19.37.46-removebg-preview.png"
                                    sx={{
                                        width: { xs: 80, sm: 100, md: 120, lg: 140 },
                                        height: { xs: 80, sm: 100, md: 120, lg: 140 },
                                        margin: '0 auto',
                                        bgcolor: 'white',
                                        p: { xs: 1.5, sm: 2 },
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                        border: { xs: '3px solid rgba(255,255,255,0.2)', md: '4px solid rgba(255,255,255,0.2)' },
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </Box>

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
                                    55TH IAHI -
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
                                    GEOSEA XIX 2026
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
                                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                                        letterSpacing: { xs: '0.15em', sm: '0.2em' },
                                        display: 'block',
                                        textShadow: '0 2px 10px rgba(77, 212, 172, 0.2)',
                                    }}
                                >
                                    CONFERENCE THEME
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontStyle: 'italic',
                                        opacity: 0.95,
                                        fontWeight: 400,
                                        lineHeight: { xs: 1.6, md: 1.5 },
                                        fontSize: { xs: '1rem', sm: '1.15rem', md: '1.35rem', lg: '1.5rem' },
                                        color: 'white',
                                        textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    "Advancing Geological Sciences for Sustainable Development"
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

                {/* About the Conference Section */}
                <Box
                    id="about"
                    ref={aboutRef}
                    sx={{
                        bgcolor: '#f5f7fa',
                        py: { xs: 6, sm: 7, md: 8, lg: 10 },
                        scrollMarginTop: '80px',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(135deg, #006838 0%, #00934d 50%, #10b981 100%)',
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
                            {/* Left Box - Conference Description */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper
                                    sx={{
                                        p: { xs: 3, sm: 4, md: 5 },
                                        height: '100%',
                                        bgcolor: 'white',
                                        borderRadius: '16px',
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                        transform: aboutVisible ? 'translateY(0)' : 'translateY(30px)',
                                        opacity: aboutVisible ? 1 : 0,
                                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                        transitionDelay: '0.5s',
                                        '&:hover': {
                                            transform: aboutVisible ? 'translateY(-8px)' : 'translateY(30px)',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        },
                                        '&:active': {
                                            transform: aboutVisible ? 'translateY(-4px) scale(0.98)' : 'translateY(30px)',
                                            boxShadow: '0 4px 16px rgba(0,0,0,0.16)',
                                            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
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
                                            A Premier Regional
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
                                        The 55th IAGI-GEOSEA 2026 is organized by the{' '}
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

                            {/* Right Box - Why Attend */}
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
                                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                        transitionDelay: '0.7s',
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
                        </Grid>
                    </Container>
                </Box>

                {/* Keynote Speakers Section */}
                <Box
                    id="speakers"
                    ref={speakersRef}
                    sx={{
                        bgcolor: 'white',
                        py: { xs: 6, sm: 8, md: 10, lg: 12 },
                        scrollMarginTop: '80px',
                        transform: speakersVisible ? 'translateY(0)' : 'translateY(50px)',
                        opacity: speakersVisible ? 1 : 0,
                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: '0.2s',
                    }}
                >
                    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                        {/* Section Header */}
                        <Box sx={{ mb: { xs: 4, md: 6 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                    <Typography
                                        variant="overline"
                                        sx={{
                                            color: '#0d7a6a',
                                            fontWeight: 600,
                                            letterSpacing: '0.15em',
                                            fontSize: '0.75rem',
                                            display: 'block',
                                            mb: 1.5,
                                        }}
                                    >
                                        VISIONARIES
                                    </Typography>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: 800,
                                            color: '#111827',
                                            fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                                            mb: 2,
                                            letterSpacing: '-0.02em',
                                        }}
                                    >
                                        Keynote Speakers
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: '#6b7280',
                                            maxWidth: '600px',
                                            lineHeight: 1.7,
                                            fontSize: { xs: '0.95rem', md: '1rem' },
                                        }}
                                    >
                                        Distinguished experts bridging the gap between geological science and practical sustainability.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Speaker Cards - Responsive Horizontal Scroll */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: { xs: 2, sm: 2.5, md: 3, lg: 3 },
                                overflowX: { xs: 'auto', lg: 'visible' },
                                overflowY: 'visible',
                                scrollSnapType: { xs: 'x mandatory', lg: 'none' },
                                scrollBehavior: 'smooth',
                                pb: { xs: 2, md: 0 },
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
                            {(settings.keynote_speakers && settings.keynote_speakers.length > 0 ? settings.keynote_speakers : [
                                {
                                    name: 'Dr. Maria',
                                    title: 'Research Director',
                                    institution: 'Asian Geological Institute',
                                    photo: '/api/placeholder/400/500'
                                },
                                {
                                    name: 'Prof. Adip',
                                    title: 'Professor',
                                    institution: 'Institute of Technology',
                                    photo: '/api/placeholder/400/500'
                                },
                                {
                                    name: 'Wahyu Utomo S.kom, M.kom',
                                    title: 'Lead Researcher',
                                    institution: 'Geoscience Center',
                                    photo: '/api/placeholder/400/500'
                                },
                                {
                                    name: 'Dr. Wahyu',
                                    title: 'Exploration Manager',
                                    institution: 'Regional Resources',
                                    photo: '/api/placeholder/400/500'
                                },
                                {
                                    name: 'Adrian Fathurahman',
                                    title: 'Chief Geologist',
                                    institution: 'Global Solutions',
                                    photo: '/api/placeholder/400/500'
                                },
                            ]).map((speaker, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        // Responsive card sizing with breakpoints
                                        // xs (0-600px): 1 card visible (85% width)
                                        // sm (600-900px): 2 cards visible (45% width each)
                                        // md (900-1200px): 3 cards visible (30% width each)
                                        // lg (1200px+): 5 cards visible (18% width each)
                                        minWidth: {
                                            xs: '85%',
                                            sm: '45%',
                                            md: '30%',
                                            lg: '18%',
                                        },
                                        flex: {
                                            xs: '0 0 85%',
                                            sm: '0 0 45%',
                                            md: '0 0 30%',
                                            lg: '0 0 18%',
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
                                            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                '& .speaker-overlay': {
                                                    background: 'linear-gradient(to top, rgba(9, 77, 66, 0.85) 0%, rgba(13, 122, 106, 0.5) 50%, transparent 100%)',
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
                                    <Box sx={{ mt: 2 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#0d7a6a',
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                letterSpacing: '0.05em',
                                                textTransform: 'uppercase',
                                                mb: 0.5,
                                            }}
                                        >
                                            {speaker.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#9ca3af',
                                                fontSize: '0.875rem',
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

                {/* Timeline Section */}
                <Box
                    id="timeline"
                    ref={timelineRef}
                    sx={{
                        bgcolor: '#f5f7fa',
                        py: { xs: 6, sm: 7, md: 8, lg: 10 },
                        scrollMarginTop: '80px',
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
                                            elevation={item.status === 'active' ? 8 : 2}
                                            sx={{
                                                p: { xs: 2.5, md: 3 },
                                                textAlign: 'center',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                border: item.status === 'active'
                                                    ? '3px solid #006838'
                                                    : item.status === 'completed'
                                                        ? '1px solid #4caf50'
                                                        : '1px solid #e0e0e0',
                                                borderRadius: 3,
                                                position: 'relative',
                                                bgcolor: item.status === 'active' ? '#f0f9f4' : 'white',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                overflow: 'hidden',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '4px',
                                                    background: item.status === 'active'
                                                        ? 'linear-gradient(135deg, #006838 0%, #00934d 50%, #10b981 100%)'
                                                        : item.status === 'completed'
                                                            ? '#4caf50'
                                                            : 'transparent',
                                                    transition: 'all 0.3s ease',
                                                },
                                                '&:hover': {
                                                    transform: 'translateY(-12px) scale(1.02)',
                                                    boxShadow: item.status === 'active' ? '0 20px 40px rgba(0,104,56,0.2)' : '0 12px 24px rgba(0,0,0,0.15)',
                                                },
                                            }}
                                        >
                                            {/* Status Badge */}
                                            {item.status === 'active' && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -12,
                                                        left: '50%',
                                                        transform: 'translateX(-50%)',
                                                        bgcolor: '#006838',
                                                        color: 'white',
                                                        px: 2,
                                                        py: 0.5,
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    ACTIVE NOW
                                                </Box>
                                            )}

                                            {/* Icon */}
                                            <Box
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: '50%',
                                                    bgcolor: item.status === 'completed'
                                                        ? '#4caf50'
                                                        : item.status === 'active'
                                                            ? '#006838'
                                                            : '#bdbdbd',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto',
                                                    mb: 2,
                                                    boxShadow: item.status === 'active' || item.status === 'completed' ? 3 : 1,
                                                    border: '4px solid',
                                                    borderColor: item.status === 'completed'
                                                        ? '#e8f5e9'
                                                        : item.status === 'active'
                                                            ? '#f0f9f4'
                                                            : '#f5f5f5',
                                                }}
                                            >
                                                <CheckIcon sx={{ fontSize: 28 }} />
                                            </Box>

                                            {/* Title */}
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{
                                                    fontWeight: 'bold',
                                                    fontSize: '0.95rem',
                                                    color: item.status === 'active' ? '#006838' : '#1a3a4a',
                                                    mb: 1,
                                                    minHeight: '2.8em',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {item.title}
                                            </Typography>

                                            {/* Date */}
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                    fontSize: '0.875rem',
                                                }}
                                            >
                                                {item.date}
                                            </Typography>

                                            {/* Progress Indicator */}
                                            {item.status === 'completed' && (
                                                <Box
                                                    sx={{
                                                        mt: 2,
                                                        width: '100%',
                                                        height: 4,
                                                        bgcolor: '#e8f5e9',
                                                        borderRadius: 2,
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            bgcolor: '#4caf50',
                                                        }}
                                                    />
                                                </Box>
                                            )}
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
                        bgcolor: 'white',
                        py: { xs: 6, sm: 7, md: 8, lg: 10 },
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                            DOWNLOADS
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
                            Seminar Resources
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
                            Everything you need to prepare a professional presentation for the IAGI-GEOSEA 2026 conference.
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
                                                background: 'linear-gradient(135deg, #d1f2e6 0%, #c1edd9 100%)',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                borderRadius: '24px',
                                                border: '2px solid rgba(13, 122, 106, 0.1)',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '4px',
                                                    background: 'linear-gradient(90deg, #0d7a6a 0%, #1abc9c 100%)',
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease',
                                                },
                                                '&:hover': {
                                                    transform: 'translateY(-12px) scale(1.02)',
                                                    boxShadow: '0 20px 40px rgba(13, 122, 106, 0.15)',
                                                    '&::before': {
                                                        opacity: 1,
                                                    },
                                                },
                                            }}
                                        >
                                            <DescriptionIcon sx={{ fontSize: 64, color: '#0d7a6a', mb: 2 }} />
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#0d7a6a' }}>
                                                {resource.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 3, color: '#5a6c7d' }}>
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
                                                    bgcolor: '#1abc9c',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    py: 1.5,
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    fontSize: '0.95rem',
                                                    '&:hover': {
                                                        bgcolor: '#16a085',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 8px 16px rgba(26, 188, 156, 0.3)',
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


                {/* Sponsors Section */}
                <Box
                    ref={sponsorsRef}
                    sx={{
                        bgcolor: '#f5f7fa',
                        py: { xs: 6, sm: 7, md: 8, lg: 10 },
                        background: 'linear-gradient(180deg, #ffffff 0%, #f5f7fa 100%)',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(135deg, #7c4dff 0%, #9d7aff 100%)',
                        },
                        transform: sponsorsVisible ? 'translateY(0)' : 'translateY(50px)',
                        opacity: sponsorsVisible ? 1 : 0,
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
                                fontSize: { xs: '0.85rem', md: '0.92rem' },
                                display: 'block',
                                mb: 1.5,
                            }}
                        >
                            COLLABORATION
                        </Typography>

                        {/* Main Title */}
                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                                color: '#111827',
                                fontSize: { xs: '1.75rem', md: '2.125rem' },
                                px: { xs: 2, sm: 0 },
                            }}
                        >
                            Partners & Sponsors
                        </Typography>

                        {/* Subtitle */}
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
                            Empowering the future of geological science through strategic partnerships.
                        </Typography>

                        {/* Group sponsors by tier */}
                        {(() => {
                            const sponsors = settings.sponsors && settings.sponsors.length > 0 ? settings.sponsors : [];
                            // Add default tier 'gold' for sponsors without tier property (backward compatibility)
                            const sponsorsWithTier = sponsors.map(s => ({
                                ...s,
                                tier: s.tier || 'gold' // default to gold if no tier specified
                            }));
                            const platinumSponsors = sponsorsWithTier.filter(s => s.tier === 'platinum');
                            const goldSponsors = sponsorsWithTier.filter(s => s.tier === 'gold');
                            const silverSponsors = sponsorsWithTier.filter(s => s.tier === 'silver');

                            const renderSponsorTier = (tierSponsors, tierName, tierColor, tierBg) => {
                                if (tierSponsors.length === 0) return null;

                                return (
                                    <Box key={tierName} sx={{ mb: 6 }}>
                                        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} justifyContent="center">
                                            {tierSponsors.map((sponsor, index) => (
                                                <Grid key={index} size={{ xs: 6, sm: 4, md: tierName === 'Platinum' ? 4 : 3 }}>
                                                    <Paper
                                                        elevation={tierName === 'Platinum' ? 4 : 2}
                                                        sx={{
                                                            p: { xs: 2, md: 3 },
                                                            height: '100%',
                                                            minHeight: tierName === 'Platinum' ? 180 : 140,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            cursor: 'pointer',
                                                            bgcolor: 'white',
                                                            border: '2px solid',
                                                            borderColor: tierName === 'Platinum' ? tierColor : 'transparent',
                                                            position: 'relative',
                                                            overflow: 'visible',
                                                            '&:hover': {
                                                                transform: 'translateY(-8px)',
                                                                boxShadow: 6,
                                                                borderColor: tierColor,
                                                            },
                                                        }}
                                                    >
                                                        {/* Tier Badge */}
                                                        <Chip
                                                            label={tierName}
                                                            size="small"
                                                            sx={{
                                                                position: 'absolute',
                                                                top: -12,
                                                                right: 8,
                                                                bgcolor: tierBg,
                                                                color: tierColor,
                                                                fontWeight: 'bold',
                                                                fontSize: '0.7rem',
                                                                boxShadow: 2,
                                                            }}
                                                        />

                                                        {/* Logo Display */}
                                                        {sponsor.logo ? (
                                                            <Box
                                                                sx={{
                                                                    width: '100%',
                                                                    height: tierName === 'Platinum' ? '100px' : '80px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    bgcolor: '#f9fafb',
                                                                    borderRadius: 2,
                                                                    mb: 1.5,
                                                                    border: '2px solid #e5e7eb',
                                                                    overflow: 'hidden',
                                                                }}
                                                            >
                                                                <img
                                                                    src={sponsor.logo}
                                                                    alt={sponsor.name}
                                                                    style={{
                                                                        maxWidth: '100%',
                                                                        maxHeight: '100%',
                                                                        objectFit: 'contain',
                                                                        padding: '8px',
                                                                    }}
                                                                />
                                                            </Box>
                                                        ) : (
                                                            <Box
                                                                sx={{
                                                                    width: '100%',
                                                                    height: tierName === 'Platinum' ? '100px' : '80px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    bgcolor: '#f9fafb',
                                                                    borderRadius: 2,
                                                                    mb: 1.5,
                                                                    border: '2px dashed #e5e7eb',
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontWeight: 'bold',
                                                                        color: '#6b7280',
                                                                        fontSize: '0.85rem',
                                                                        textAlign: 'center',
                                                                    }}
                                                                >
                                                                    {sponsor.name}
                                                                </Typography>
                                                            </Box>
                                                        )}

                                                        {/* Sponsor Name (if logo exists) */}
                                                        {sponsor.logo && (
                                                            <Typography
                                                                variant="body2"
                                                                align="center"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    color: 'text.primary',
                                                                    fontSize: '0.875rem',
                                                                }}
                                                            >
                                                                {sponsor.name}
                                                            </Typography>
                                                        )}
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                );
                            };

                            return (
                                <>
                                    {renderSponsorTier(platinumSponsors, 'Platinum', '#475569', '#e2e8f0')}
                                    {renderSponsorTier(goldSponsors, 'Gold', '#92400e', '#fef3c7')}
                                    {renderSponsorTier(silverSponsors, 'Silver', '#3730a3', '#e0e7ff')}
                                </>
                            );
                        })()}

                        {/* CTA Section */}
                        <Box
                            sx={{
                                mt: { xs: 5, sm: 6, md: 8 },
                                textAlign: 'center',
                                p: { xs: 4, sm: 5, md: 6 },
                                background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                                borderRadius: '24px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                border: '1px solid rgba(13, 122, 106, 0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: 'linear-gradient(90deg, #0d7a6a 0%, #1abc9c 100%)',
                                },
                            }}
                        >
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{
                                    fontWeight: 800,
                                    color: '#111827',
                                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                                    mb: 1.5,
                                }}
                            >
                                Interested in Sponsoring?
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 4,
                                    color: '#6b7280',
                                    fontSize: { xs: '0.95rem', md: '1rem' },
                                    maxWidth: '600px',
                                    mx: 'auto',
                                }}
                            >
                                Join us in supporting the advancement of geological sciences
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => {
                                    document.getElementById('contact-us')?.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                }}
                                sx={{
                                    px: 5,
                                    py: 1.75,
                                    bgcolor: '#1abc9c',
                                    color: 'white',
                                    borderRadius: '50px',
                                    textTransform: 'uppercase',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    letterSpacing: '0.05em',
                                    boxShadow: '0 4px 16px rgba(26, 188, 156, 0.3)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        bgcolor: '#16a085',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 24px rgba(26, 188, 156, 0.4)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                    },
                                }}
                            >
                                Become a Sponsor
                            </Button>
                        </Box>
                    </Container>
                </Box>

                {/* Contact Us Section */}
                <Box
                    id="contact-us"
                    ref={contactRef}
                    sx={{
                        bgcolor: '#f5f7fa',
                        py: { xs: 6, sm: 7, md: 8, lg: 10 },
                        scrollMarginTop: '80px',
                        position: 'relative',
                        transform: contactVisible ? 'translateY(0)' : 'translateY(50px)',
                        opacity: contactVisible ? 1 : 0,
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
                                fontSize: { xs: '0.85rem', md: '0.92rem' },
                                display: 'block',
                                mb: 1.5,
                            }}
                        >
                            GET IN TOUCH
                        </Typography>

                        {/* Main Title */}
                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                                color: '#111827',
                                fontSize: { xs: '1.75rem', md: '2.125rem' },
                            }}
                        >
                            Connect with Us
                        </Typography>

                        {/* Subtitle */}
                        <Typography
                            variant="body1"
                            align="center"
                            sx={{
                                mb: { xs: 4, md: 6 },
                                color: '#6366f1',
                                maxWidth: '800px',
                                mx: 'auto',
                                fontStyle: 'italic',
                                fontSize: { xs: '0.95rem', md: '1rem' },
                            }}
                        >
                            Our team is here to support your conference experience. Reach out with any inquiries.
                        </Typography>

                        {/* Contact Cards */}
                        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: { xs: 4, md: 6 } }}>
                            {/* Phone Card */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card
                                    sx={{
                                        textAlign: 'center',
                                        p: { xs: 3, md: 4 },
                                        height: '100%',
                                        borderRadius: 4,
                                        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                                        border: '1px solid rgba(0,0,0,0.06)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            bgcolor: 'rgba(0, 104, 56, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                        }}
                                    >
                                        <PhoneIcon sx={{ fontSize: 40, color: '#006838' }} />
                                    </Box>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a3a4a' }}>
                                        Phone
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {settings.contact_info?.phone || '+62 21 1234 5678'}
                                    </Typography>
                                </Card>
                            </Grid>

                            {/* Email Card */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card
                                    sx={{
                                        textAlign: 'center',
                                        p: { xs: 3, md: 4 },
                                        height: '100%',
                                        borderRadius: 4,
                                        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                                        border: '1px solid rgba(0,0,0,0.06)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            bgcolor: 'rgba(0, 104, 56, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                        }}
                                    >
                                        <EmailIcon sx={{ fontSize: 40, color: '#006838' }} />
                                    </Box>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a3a4a' }}>
                                        Email
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                                        {settings.contact_info?.email || 'info@iagi-geosea2026.org'}
                                    </Typography>
                                </Card>
                            </Grid>

                            {/* Location Card */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card
                                    sx={{
                                        textAlign: 'center',
                                        p: { xs: 3, md: 4 },
                                        height: '100%',
                                        borderRadius: 4,
                                        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                                        border: '1px solid rgba(0,0,0,0.06)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            bgcolor: 'rgba(0, 104, 56, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                        }}
                                    >
                                        <LocationIcon sx={{ fontSize: 40, color: '#006838' }} />
                                    </Box>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a3a4a' }}>
                                        Location
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
                                        {settings.contact_info?.location || 'UPN Veteran Yogyakarta\nJl. SWK 104 (Lingkar Utara)\nYogyakarta 55283'}
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Google Maps Embed */}
                        {settings.contact_info?.maps_url && settings.contact_info.maps_url.trim() !== '' && (
                            <Box
                                sx={{
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                    height: { xs: 300, sm: 400, md: 450 },
                                }}
                            >
                                <iframe
                                    src={settings.contact_info.maps_url}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </Box>
                        )}
                    </Container>
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #094d42 0%, #0a3d35 100%)',
                        color: 'white',
                        py: { xs: 6, sm: 7, md: 8 },
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: 'linear-gradient(90deg, #0d7a6a 0%, #1abc9c 50%, #0d7a6a 100%)',
                        },
                    }}
                >
                    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                        <Grid container spacing={{ xs: 4, sm: 4.5, md: 5 }}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: { xs: '1.35rem', md: '1.5rem' },
                                        mb: 2,
                                        color: '#4dd4ac',
                                        letterSpacing: '0.02em',
                                    }}
                                >
                                    55TH PIT IAGI-GEOSEA 2026
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        opacity: 0.9,
                                        mb: 2.5,
                                        fontSize: { xs: '0.95rem', md: '1rem' },
                                        lineHeight: 1.7,
                                        color: 'rgba(255,255,255,0.85)',
                                    }}
                                >
                                    Indonesian Association of Geologists<br />
                                    Southeast Asia Geological Conference
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: { xs: '1.15rem', md: '1.2rem' },
                                        mb: 2.5,
                                        color: '#4dd4ac',
                                    }}
                                >
                                    Quick Links
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
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
                                                color: 'rgba(255,255,255,0.85)',
                                                fontSize: '0.95rem',
                                                transition: 'all 0.2s ease',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    color: '#4dd4ac',
                                                    transform: 'translateX(5px)',
                                                }
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                    ))}
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: { xs: '1.15rem', md: '1.2rem' },
                                        mb: 2.5,
                                        color: '#4dd4ac',
                                    }}
                                >
                                    Register
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {!auth.user && (
                                        <>
                                            <Link
                                                href="/register"
                                                sx={{
                                                    color: 'rgba(255,255,255,0.85)',
                                                    textDecoration: 'none',
                                                    fontSize: '0.95rem',
                                                    transition: 'all 0.2s ease',
                                                    display: 'inline-block',
                                                    '&:hover': {
                                                        color: '#4dd4ac',
                                                        transform: 'translateX(5px)',
                                                    }
                                                }}
                                            >
                                                Create Account
                                            </Link>
                                            <Link
                                                href="/login"
                                                sx={{
                                                    color: 'rgba(255,255,255,0.85)',
                                                    textDecoration: 'none',
                                                    fontSize: '0.95rem',
                                                    transition: 'all 0.2s ease',
                                                    display: 'inline-block',
                                                    '&:hover': {
                                                        color: '#4dd4ac',
                                                        transform: 'translateX(5px)',
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
                                                color: 'rgba(255,255,255,0.85)',
                                                textDecoration: 'none',
                                                fontSize: '0.95rem',
                                                transition: 'all 0.2s ease',
                                                display: 'inline-block',
                                                '&:hover': {
                                                    color: '#4dd4ac',
                                                    transform: 'translateX(5px)',
                                                }
                                            }}
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                        <Box
                            sx={{
                                mt: { xs: 5, md: 6 },
                                pt: { xs: 3, md: 4 },
                                borderTop: '1px solid rgba(77, 212, 172, 0.2)',
                                textAlign: 'center'
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    opacity: 0.75,
                                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                                    color: 'rgba(255,255,255,0.7)',
                                    letterSpacing: '0.02em',
                                }}
                            >
                                © 2026 PIT IAGI-GEOSEA. All rights reserved. | Privacy Policy | Terms & Conditions
                            </Typography>
                        </Box>
                    </Container>
                </Box>
            </Box >
        </ThemeProvider >
    );
}
