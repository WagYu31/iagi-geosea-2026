import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Hero({ settings, auth }) {
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
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

    const heroText = settings.hero_text || {};

    return (
        <Box
            id="hero"
            sx={{
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                backgroundImage:
                    'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(13, 122, 106, 0.15), transparent)',
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
                    preload="metadata"
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
                    preload="metadata"
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

            {/* Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(9, 77, 66, 0.20) 0%, rgba(9, 77, 66, 0.20) 100%)',
                    zIndex: 1,
                }}
            />

            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: { xs: 18, sm: 22, md: 26 },
                    pb: { xs: 10, sm: 14, md: 18 },
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                {/* Logo */}
                {settings.hero_logo?.url && (
                    <Box
                        sx={{
                            width: { xs: 100, sm: 130, md: 160 },
                            height: { xs: 100, sm: 130, md: 160 },
                            borderRadius: '50%',
                            bgcolor: 'white',
                            overflow: 'hidden',
                            mb: 3,
                            filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            component="img"
                            src={settings.hero_logo.url}
                            alt="Conference Logo"
                            loading="eager"
                            sx={{
                                width: '110%',
                                height: '110%',
                                objectFit: 'cover',
                            }}
                        />
                    </Box>
                )}

                {/* Title */}
                <Typography
                    variant="h1"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                        fontWeight: 800,
                        color: 'white',
                        textAlign: 'center',
                        letterSpacing: '-0.02em',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }}
                >
                    <Box component="span" sx={{ lineHeight: 1.1 }}>
                        {heroText.title_line1 || 'PIT IAGI'}
                    </Box>
                    <Typography
                        component="span"
                        sx={{
                            fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
                            fontWeight: 700,
                            color: '#4dd4ac',
                            textShadow: '0 2px 12px rgba(77, 212, 172, 0.4)',
                        }}
                    >
                        {heroText.title_line2 || 'GEOSEA XIX 2026'}
                    </Typography>
                </Typography>

                {/* Theme */}
                <Box
                    sx={{
                        mt: 3,
                        px: 3,
                        py: 1.5,
                        borderRadius: '40px',
                        bgcolor: alpha('#ffffff', 0.15),
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                    }}
                >
                    <Typography
                        variant="overline"
                        sx={{
                            display: 'block',
                            fontSize: '0.65rem',
                            letterSpacing: '0.2em',
                            color: 'rgba(255,255,255,0.7)',
                            mb: 0.3,
                            textAlign: 'center',
                        }}
                    >
                        {heroText.theme_label || 'CONFERENCE THEME'}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' },
                            fontWeight: 500,
                            color: 'white',
                            textAlign: 'center',
                            fontStyle: 'italic',
                        }}
                    >
                        {heroText.theme_text || 'Advancing Geological Sciences for Sustainable Development'}
                    </Typography>
                </Box>

                {/* CTA Buttons */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{ mt: 4 }}
                >
                    {auth?.user ? (
                        <Button
                            component={Link}
                            href="/dashboard"
                            variant="contained"
                            size="large"
                            sx={{
                                background: 'linear-gradient(135deg, #4dd4ac 0%, #0d9488 100%)',
                                color: '#094d42',
                                fontWeight: 700,
                                textTransform: 'none',
                                borderRadius: '12px',
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                boxShadow: '0 4px 16px rgba(77, 212, 172, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #6ee7b7 0%, #14b8a6 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 24px rgba(77, 212, 172, 0.5)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Go to Dashboard
                        </Button>
                    ) : (
                        <>
                            <Button
                                component={Link}
                                href="/register"
                                variant="contained"
                                size="large"
                                sx={{
                                    background: 'linear-gradient(135deg, #4dd4ac 0%, #0d9488 100%)',
                                    color: '#094d42',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    borderRadius: '12px',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 16px rgba(77, 212, 172, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #6ee7b7 0%, #14b8a6 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 24px rgba(77, 212, 172, 0.5)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Register Now
                            </Button>
                            <Button
                                component={Link}
                                href="/login"
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderColor: 'rgba(255,255,255,0.5)',
                                    color: 'white',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderRadius: '12px',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: alpha('#ffffff', 0.1),
                                    },
                                }}
                            >
                                Sign In
                            </Button>
                        </>
                    )}
                </Stack>

                {/* Secondary Hero Logos */}
                {settings.hero_logos_secondary && settings.hero_logos_secondary.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            gap: { xs: 1.5, sm: 2 },
                            mt: 4,
                            px: { xs: 2, sm: 4 },
                            py: 1.5,
                            borderRadius: '50px',
                            bgcolor: alpha('#ffffff', 0.1),
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                        }}
                    >
                        {settings.hero_logos_secondary.map((logo, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: { xs: 48, sm: 56, md: 64 },
                                    height: { xs: 48, sm: 56, md: 64 },
                                    borderRadius: '50%',
                                    bgcolor: 'white',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                    border: '2px solid rgba(255,255,255,0.6)',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                    },
                                }}
                            >
                                <Box
                                    component="img"
                                    src={logo.url}
                                    alt={`Partner ${index + 1}`}
                                    sx={{
                                        width: '85%',
                                        height: '85%',
                                        objectFit: 'contain',
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Countdown */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: { xs: 2, sm: 3 },
                        mt: 5,
                    }}
                >
                    {[
                        { value: countdown.days, label: 'Days' },
                        { value: countdown.hours, label: 'Hours' },
                        { value: countdown.minutes, label: 'Minutes' },
                        { value: countdown.seconds, label: 'Seconds' },
                    ].map((item) => (
                        <Box
                            key={item.label}
                            sx={{
                                textAlign: 'center',
                                px: { xs: 1.5, sm: 2.5 },
                                py: { xs: 1.5, sm: 2 },
                                borderRadius: '16px',
                                bgcolor: alpha('#ffffff', 0.12),
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                minWidth: { xs: 60, sm: 80 },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                                    fontWeight: 800,
                                    color: 'white',
                                    lineHeight: 1,
                                    fontFamily: '"Inter", "Segoe UI", sans-serif',
                                }}
                            >
                                {String(item.value).padStart(2, '0')}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'rgba(255,255,255,0.75)',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.6rem', sm: '0.75rem' },
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
