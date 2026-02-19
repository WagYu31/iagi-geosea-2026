import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { alpha, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Keyframe animations
const fadeInUp = keyframes`
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
    from { opacity: 0; }
    to   { opacity: 1; }
`;

const float1 = keyframes`
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25%      { transform: translate(30px, -40px) rotate(45deg); }
    50%      { transform: translate(-20px, -80px) rotate(90deg); }
    75%      { transform: translate(40px, -30px) rotate(135deg); }
`;

const float2 = keyframes`
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33%      { transform: translate(-50px, -30px) rotate(-60deg); }
    66%      { transform: translate(30px, -60px) rotate(60deg); }
`;

const float3 = keyframes`
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%      { transform: translate(20px, -50px) scale(1.2); }
`;

const gradientShift = keyframes`
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

const pulseGlow = keyframes`
    0%, 100% { opacity: 0.3; }
    50%      { opacity: 0.6; }
`;

// Floating particle component
function FloatingParticle({ size, top, left, delay, duration, variant = 1 }) {
    const animations = [float1, float2, float3];
    const anim = animations[(variant - 1) % 3];

    return (
        <Box
            sx={{
                position: 'absolute',
                top,
                left,
                width: size,
                height: size,
                borderRadius: variant === 3 ? '4px' : '50%',
                background: variant === 1
                    ? 'radial-gradient(circle, rgba(77, 212, 172, 0.4), transparent)'
                    : variant === 2
                        ? 'radial-gradient(circle, rgba(13, 148, 136, 0.3), transparent)'
                        : 'linear-gradient(135deg, rgba(77, 212, 172, 0.25), rgba(13, 148, 136, 0.15))',
                animation: `${anim} ${duration}s ease-in-out ${delay}s infinite`,
                pointerEvents: 'none',
                zIndex: 1,
                transform: variant === 3 ? 'rotate(45deg)' : undefined,
            }}
        />
    );
}

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

    // Split title into words for staggered animation
    const titleLine1 = heroText.title_line1 || 'PIT IAGI';
    const titleLine2 = heroText.title_line2 || 'GEOSEA XIX 2026';

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

            {/* Animated Gradient Overlay */}
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

            {/* Subtle animated glow orb */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(13, 148, 136, 0.15) 0%, transparent 70%)',
                    animation: `${pulseGlow} 4s ease-in-out infinite`,
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
            />

            {/* Floating Particles */}
            <FloatingParticle size={12} top="15%" left="10%" delay={0} duration={18} variant={1} />
            <FloatingParticle size={8} top="25%" left="85%" delay={2} duration={22} variant={2} />
            <FloatingParticle size={16} top="60%" left="5%" delay={1} duration={20} variant={3} />
            <FloatingParticle size={10} top="70%" left="90%" delay={3} duration={16} variant={1} />
            <FloatingParticle size={6} top="40%" left="20%" delay={4} duration={24} variant={2} />
            <FloatingParticle size={14} top="50%" left="75%" delay={0.5} duration={19} variant={3} />
            <FloatingParticle size={8} top="80%" left="40%" delay={2.5} duration={21} variant={1} />
            <FloatingParticle size={10} top="10%" left="60%" delay={1.5} duration={17} variant={2} />

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
                {/* Logo — fade in */}
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
                            animation: `${fadeIn} 1s ease-out 0.2s both`,
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

                {/* Title — word-by-word staggered reveal */}
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
                    <Box component="span" sx={{ lineHeight: 1.1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.3em' }}>
                        {titleLine1.split(' ').map((word, i) => (
                            <Box
                                key={i}
                                component="span"
                                sx={{
                                    display: 'inline-block',
                                    animation: `${fadeInUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.12}s both`,
                                }}
                            >
                                {word}
                            </Box>
                        ))}
                    </Box>
                    <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.3em' }}>
                        {titleLine2.split(' ').map((word, i) => (
                            <Box
                                key={i}
                                component="span"
                                sx={{
                                    display: 'inline-block',
                                    fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
                                    fontWeight: 700,
                                    color: '#4dd4ac',
                                    textShadow: '0 2px 12px rgba(77, 212, 172, 0.4)',
                                    animation: `${fadeInUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.6 + i * 0.12}s both`,
                                }}
                            >
                                {word}
                            </Box>
                        ))}
                    </Box>
                </Typography>

                {/* Theme — fade in */}
                <Box
                    sx={{
                        mt: 3,
                        px: 3,
                        py: 1.5,
                        borderRadius: '40px',
                        bgcolor: alpha('#ffffff', 0.15),
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        animation: `${fadeInUp} 0.9s cubic-bezier(0.16, 1, 0.3, 1) 1s both`,
                    }}
                >
                    <Typography
                        variant="overline"
                        sx={{
                            display: 'block',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            color: 'rgba(255,255,255,0.9)',
                            mb: 0.5,
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

                {/* CTA Buttons — fade in */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{
                        mt: 4,
                        animation: `${fadeInUp} 0.9s cubic-bezier(0.16, 1, 0.3, 1) 1.2s both`,
                    }}
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

                {/* Secondary Hero Logos — fade in */}
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
                            animation: `${fadeInUp} 0.9s cubic-bezier(0.16, 1, 0.3, 1) 1.4s both`,
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

                {/* Countdown — fade in */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: { xs: 2, sm: 3 },
                        mt: 5,
                        animation: `${fadeInUp} 0.9s cubic-bezier(0.16, 1, 0.3, 1) 1.6s both`,
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
