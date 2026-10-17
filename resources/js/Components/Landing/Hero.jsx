import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { alpha, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';

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

const livingMountain = keyframes`
    0%   { transform: scale(1.0) translate3d(0, 0, 0); }
    50%  { transform: scale(1.06) translate3d(-10px, -6px, 0); }
    100% { transform: scale(1.0) translate3d(0, 0, 0); }
`;

const auroraWave1 = keyframes`
    0%   { transform: translate3d(-8%, 0, 0) rotate(0deg) scale(1); opacity: 0.45; }
    50%  { transform: translate3d(6%, -15px, 0) rotate(2deg) scale(1.08); opacity: 0.8; }
    100% { transform: translate3d(-8%, 0, 0) rotate(0deg) scale(1); opacity: 0.45; }
`;

const auroraWave2 = keyframes`
    0%   { transform: translate3d(10%, 10px, 0) rotate(-2deg) scale(1.04); opacity: 0.35; }
    50%  { transform: translate3d(-8%, -10px, 0) rotate(1.5deg) scale(0.96); opacity: 0.7; }
    100% { transform: translate3d(10%, 10px, 0) rotate(-2deg) scale(1.04); opacity: 0.35; }
`;

const mistDrift1 = keyframes`
    0%   { transform: translate3d(-20%, 0, 0); }
    50%  { transform: translate3d(15%, -10px, 0); }
    100% { transform: translate3d(-20%, 0, 0); }
`;

const mistDrift2 = keyframes`
    0%   { transform: translate3d(18%, 0, 0); }
    50%  { transform: translate3d(-15%, 8px, 0); }
    100% { transform: translate3d(18%, 0, 0); }
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
                transform: variant === 3 ? 'rotate(45deg)' : 'translate3d(0,0,0)',
                willChange: 'transform',
            }}
        />
    );
}

// Isolated countdown timer component to prevent re-rendering the entire Hero every 1 second
const CountdownSection = React.memo(function CountdownSection({ targetDateStr, fadeInUpAnim }) {
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date(targetDateStr || '2026-01-18T00:00:00').getTime();
        const calculate = () => {
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
        };
        calculate();
        const interval = setInterval(calculate, 1000);
        return () => clearInterval(interval);
    }, [targetDateStr]);

    const timeUnits = [
        { value: countdown.days, label: 'Days' },
        { value: countdown.hours, label: 'Hours' },
        { value: countdown.minutes, label: 'Minutes' },
        { value: countdown.seconds, label: 'Seconds' },
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                gap: { xs: 1.5, sm: 2.5, md: 3 },
                mt: { xs: 4, sm: 5 },
                justifyContent: 'center',
                flexWrap: 'wrap',
                position: 'relative',
                zIndex: 2,
            }}
        >
            {timeUnits.map((item, index) => (
                <Box
                    key={item.label}
                    component={motion.div}
                    initial={{ opacity: 0, y: 35, scale: 0.88 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                        duration: 0.75,
                        delay: 1.6 + index * 0.09,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{
                        y: -8,
                        scale: 1.07,
                        boxShadow: '0 20px 40px rgba(13, 148, 136, 0.45), 0 0 25px rgba(77, 212, 172, 0.35)',
                        borderColor: 'rgba(77, 212, 172, 0.7)',
                        backgroundColor: 'rgba(255, 255, 255, 0.24)',
                        transition: { duration: 0.25 },
                    }}
                    sx={{
                        textAlign: 'center',
                        px: { xs: 1.8, sm: 2.8, md: 3.2 },
                        py: { xs: 1.6, sm: 2.2 },
                        borderRadius: '20px',
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1.5px solid rgba(255, 255, 255, 0.28)',
                        minWidth: { xs: 72, sm: 90, md: 105 },
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
                        cursor: 'default',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'border-color 0.25s ease, background-color 0.25s ease',
                    }}
                >
                    {/* Top ambient glowing accent line */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: '20%',
                            right: '20%',
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, rgba(77, 212, 172, 0.9), transparent)',
                        }}
                    />

                    <Typography
                        component={motion.div}
                        key={item.value}
                        initial={{ opacity: 0.6, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        sx={{
                            fontSize: { xs: '1.65rem', sm: '2.2rem', md: '2.75rem' },
                            fontWeight: 900,
                            color: '#ffffff',
                            lineHeight: 1,
                            fontFamily: '"Inter", "Segoe UI", sans-serif',
                            letterSpacing: '-0.02em',
                            textShadow: '0 2px 14px rgba(0,0,0,0.35)',
                        }}
                    >
                        {String(item.value).padStart(2, '0')}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#a7f3d0',
                            fontWeight: 700,
                            fontSize: { xs: '0.65rem', sm: '0.78rem' },
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            display: 'block',
                            mt: 0.7,
                            textShadow: '0 1px 6px rgba(0,0,0,0.3)',
                        }}
                    >
                        {item.label}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
});

export default function Hero({ settings, auth }) {
    const [videoMounted, setVideoMounted] = useState(false);
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
    const heroText = settings.hero_text || {};

    useEffect(() => {
        const timer = setTimeout(() => setVideoMounted(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        setMouseOffset({ x, y });
    };

    const handleMouseLeave = () => {
        setMouseOffset({ x: 0, y: 0 });
    };

    // Split title into words for staggered animation
    const titleLine1 = heroText.title_line1 || '55ᵀᴴ IAGI Annual Scientific Meeting 2026';
    const titleLine2 = heroText.title_line2 || 'GEOSEA XIX Convention & Exhibition';

    return (
        <Box
            id="hero"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            sx={{
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                backgroundImage:
                    'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(13, 122, 106, 0.15), transparent)',
            }}
        >
            {/* Living Background Mountain Layer with Ken-Burns Breathing and Multi-plane Parallax */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-6%',
                    left: '-6%',
                    width: '112%',
                    height: '112%',
                    zIndex: 0,
                    pointerEvents: 'none',
                    transform: `translate3d(${mouseOffset.x * -14}px, ${mouseOffset.y * -10}px, 0)`,
                    transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                    willChange: 'transform',
                }}
            >
                {/* Baseline High-Res Mountain Image from Gambar 1 with Living Breathing Ken Burns Zoom & 3D Depth */}
                <Box
                    component="img"
                    src={settings.hero_background?.type === 'image' && settings.hero_background?.url ? settings.hero_background.url : '/about-background.webp'}
                    alt="Hero Background Mount Merapi"
                    fetchPriority="high"
                    decoding="async"
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        animation: `${livingMountain} 24s ease-in-out infinite`,
                        transformOrigin: 'center 40%',
                        willChange: 'transform',
                    }}
                />

                {/* Optional Custom Background Video (only if explicitly set in admin settings) */}
                {videoMounted && settings.hero_background?.type === 'video' && settings.hero_background?.url && (
                    <Box
                        component="video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 0,
                            animation: `${fadeIn} 0.8s ease-in both, ${livingMountain} 24s ease-in-out infinite`,
                        }}
                    >
                        <source src={settings.hero_background.url} type="video/mp4" />
                    </Box>
                )}
            </Box>

            {/* Drifting Volcanic Mountain Clouds/Mist Layer 1 */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '25%',
                    left: '-15%',
                    width: '135%',
                    height: '240px',
                    pointerEvents: 'none',
                    zIndex: 1,
                    opacity: 0.35,
                    filter: 'blur(28px)',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.45) 40%, rgba(204, 251, 241, 0.35) 70%, transparent 100%)',
                    animation: `${mistDrift1} 24s ease-in-out infinite`,
                }}
            />

            {/* Drifting Volcanic Mountain Clouds/Mist Layer 2 */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '18%',
                    left: '-10%',
                    width: '130%',
                    height: '190px',
                    pointerEvents: 'none',
                    zIndex: 1,
                    opacity: 0.28,
                    filter: 'blur(32px)',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(240, 253, 250, 0.45) 30%, rgba(255, 255, 255, 0.35) 60%, transparent 100%)',
                    animation: `${mistDrift2} 28s ease-in-out infinite 3s`,
                }}
            />

            {/* Relay-style Flowing Luminous Aurora Wave across the Mountain */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '8%',
                    left: '-20%',
                    width: '140%',
                    height: '80%',
                    pointerEvents: 'none',
                    zIndex: 1,
                    opacity: 0.85,
                    transform: `translate3d(${mouseOffset.x * 20}px, ${mouseOffset.y * 14}px, 0)`,
                    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                    filter: 'blur(35px)',
                    animation: `${auroraWave1} 16s ease-in-out infinite`,
                    background: 'radial-gradient(ellipse 65% 45% at 50% 35%, rgba(77, 212, 172, 0.35), rgba(13, 148, 136, 0.2) 50%, transparent 75%)',
                }}
            />

            {/* Flowing Organic Light Spline Ribbon (GetLayers Relay Style - Bright Theme) */}
            <Box
                component="svg"
                viewBox="0 0 1440 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                sx={{
                    position: 'absolute',
                    top: '12%',
                    left: 0,
                    width: '100%',
                    height: '75%',
                    pointerEvents: 'none',
                    zIndex: 1,
                    opacity: 0.65,
                    transform: `translate3d(${mouseOffset.x * 12}px, ${mouseOffset.y * 8}px, 0)`,
                    transition: 'transform 0.4s ease-out',
                    animation: `${auroraWave1} 22s ease-in-out infinite`,
                }}
            >
                <path
                    d="M -120 280 C 280 80, 580 400, 960 170 C 1280 30, 1480 200, 1620 280"
                    stroke="url(#relayBeamGradient)"
                    strokeWidth="36"
                    strokeLinecap="round"
                    style={{ filter: 'blur(26px)' }}
                />
                <path
                    d="M -120 280 C 280 80, 580 400, 960 170 C 1280 30, 1480 200, 1620 280"
                    stroke="url(#relayBeamGradientCore)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    style={{ filter: 'blur(6px)' }}
                />
                <defs>
                    <linearGradient id="relayBeamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4dd4ac" stopOpacity="0" />
                        <stop offset="25%" stopColor="#2dd4bf" stopOpacity="0.8" />
                        <stop offset="60%" stopColor="#10b981" stopOpacity="0.85" />
                        <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.65" />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="relayBeamGradientCore" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                        <stop offset="30%" stopColor="#ffffff" stopOpacity="0.9" />
                        <stop offset="65%" stopColor="#a7f3d0" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </Box>

            {/* Clean Bright Atmospheric Gradient Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(9, 77, 66, 0.16) 70%, rgba(9, 77, 66, 0.3) 100%)',
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

            {/* Floating Particles (Render only on desktop to eliminate mobile CPU overhead) */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <FloatingParticle size={12} top="15%" left="10%" delay={0} duration={18} variant={1} />
                <FloatingParticle size={8} top="25%" left="85%" delay={2} duration={22} variant={2} />
                <FloatingParticle size={16} top="60%" left="5%" delay={1} duration={20} variant={3} />
                <FloatingParticle size={10} top="70%" left="90%" delay={3} duration={16} variant={1} />
                <FloatingParticle size={6} top="40%" left="20%" delay={4} duration={24} variant={2} />
                <FloatingParticle size={14} top="50%" left="75%" delay={0.5} duration={19} variant={3} />
                <FloatingParticle size={8} top="80%" left="40%" delay={2.5} duration={21} variant={1} />
                <FloatingParticle size={10} top="10%" left="60%" delay={1.5} duration={17} variant={2} />
            </Box>

            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: { xs: 18, sm: 22, md: 26 },
                    pb: { xs: 10, sm: 14, md: 18 },
                    position: 'relative',
                    zIndex: 2,
                    transform: `translate3d(${mouseOffset.x * 6}px, ${mouseOffset.y * 4}px, 0)`,
                    transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                    willChange: 'transform',
                }}
            >
                {/* Logo — Animated Scale, Levitation & Radiant Aura Pulse */}
                {settings.hero_logo?.url && (
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.5, y: -30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        sx={{
                            position: 'relative',
                            mb: { xs: 2.5, sm: 3 },
                        }}
                    >
                        {/* Aura Pulsing Glow */}
                        <Box
                            component={motion.div}
                            animate={{
                                scale: [1, 1.25, 1],
                                opacity: [0.45, 0.1, 0.45],
                            }}
                            transition={{
                                duration: 3.6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            sx={{
                                position: 'absolute',
                                inset: -12,
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(77, 212, 172, 0.6) 0%, rgba(13, 148, 136, 0.15) 50%, transparent 75%)',
                                zIndex: 0,
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Floating Levitation Container */}
                        <Box
                            component={motion.div}
                            animate={{
                                y: [0, -8, 0],
                            }}
                            transition={{
                                duration: 4.8,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            whileHover={{
                                scale: 1.08,
                                rotate: [0, -2, 2, 0],
                                transition: { duration: 0.35 },
                            }}
                            sx={{
                                width: { xs: 110, sm: 135, md: 165 },
                                height: { xs: 110, sm: 135, md: 165 },
                                borderRadius: '50%',
                                bgcolor: '#ffffff',
                                overflow: 'hidden',
                                filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.35))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '3px solid rgba(255, 255, 255, 0.95)',
                                boxShadow: '0 0 30px rgba(77, 212, 172, 0.45)',
                                position: 'relative',
                                zIndex: 1,
                                cursor: 'pointer',
                            }}
                        >
                            <Box
                                component="img"
                                src={settings.hero_logo.url}
                                alt="Conference Logo"
                                fetchPriority="high"
                                decoding="async"
                                width={165}
                                height={165}
                                sx={{
                                    width: '108%',
                                    height: '108%',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>
                    </Box>
                )}

                {/* Title — word-by-word staggered reveal */}
                <Typography
                    variant="h1"
                    aria-label={`${titleLine1} ${titleLine2}`}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        fontSize: 'clamp(2.4rem, 7.5vw, 4.4rem)',
                        fontWeight: 800,
                        color: 'white',
                        textAlign: 'center',
                        letterSpacing: '-0.02em',
                        textShadow: '0 4px 20px rgba(0,0,0,0.35)',
                    }}
                >
                    <Box component="span" sx={{ lineHeight: 1.15, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.3em' }}>
                        {titleLine1.split(' ').map((word, i) => (
                            <Box
                                key={i}
                                component={motion.span}
                                initial={{ opacity: 0, y: 35, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.42 + i * 0.07,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                sx={{
                                    display: 'inline-block',
                                    textShadow: '0 4px 24px rgba(0,0,0,0.4)',
                                }}
                            >
                                {word}
                            </Box>
                        ))}
                    </Box>
                    <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.3em', mt: 0.6 }}>
                        {titleLine2.split(' ').map((word, i) => (
                            <Box
                                key={i}
                                component={motion.span}
                                initial={{ opacity: 0, y: 35, filter: 'blur(8px)', scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                                transition={{
                                    duration: 0.85,
                                    delay: 0.72 + i * 0.08,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                sx={{
                                    display: 'inline-block',
                                    fontSize: 'clamp(1.75rem, 4.8vw, 3.1rem)',
                                    fontWeight: 800,
                                    color: '#4dd4ac',
                                    textShadow: '0 2px 20px rgba(77, 212, 172, 0.55), 0 0 35px rgba(13, 148, 136, 0.3)',
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                {word}
                            </Box>
                        ))}
                    </Box>
                </Typography>

                {/* Conference Theme Card — Glassmorphic Reveal with Ambient Shimmer */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 40, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                        duration: 0.9,
                        delay: 0.98,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{
                        y: -5,
                        scale: 1.015,
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35), 0 0 30px rgba(77, 212, 172, 0.35)',
                        borderColor: 'rgba(77, 212, 172, 0.6)',
                        transition: { duration: 0.35 },
                    }}
                    sx={{
                        mt: 3.5,
                        px: { xs: 3, sm: 4.5 },
                        py: { xs: 2, sm: 2.2 },
                        borderRadius: '40px',
                        bgcolor: 'rgba(255, 255, 255, 0.16)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1.5px solid rgba(255, 255, 255, 0.28)',
                        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'default',
                        maxWidth: '860px',
                        textAlign: 'center',
                    }}
                >
                    {/* Shimmer light reflection sweep */}
                    <Box
                        component={motion.div}
                        initial={{ x: '-150%' }}
                        animate={{ x: '250%' }}
                        transition={{
                            duration: 2.8,
                            repeat: Infinity,
                            repeatDelay: 4,
                            ease: 'easeInOut',
                        }}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            width: '80px',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
                            transform: 'skewX(-25deg)',
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Badge with Sparkles */}
                    <Stack direction="row" spacing={1.2} alignItems="center" justifyContent="center" sx={{ mb: 0.8 }}>
                        <Box
                            component={motion.div}
                            animate={{ rotate: [0, 180, 360], scale: [1, 1.25, 1] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                            sx={{
                                width: 7,
                                height: 7,
                                borderRadius: '50%',
                                bgcolor: '#4dd4ac',
                                boxShadow: '0 0 10px #4dd4ac',
                            }}
                        />
                        <Typography
                            variant="overline"
                            sx={{
                                display: 'block',
                                fontSize: { xs: '0.82rem', sm: '0.94rem' },
                                fontWeight: 800,
                                letterSpacing: '0.22em',
                                color: '#a7f3d0',
                                textTransform: 'uppercase',
                                textShadow: '0 0 12px rgba(167, 243, 208, 0.4)',
                            }}
                        >
                            {heroText.theme_label || 'CONFERENCE THEME'}
                        </Typography>
                        <Box
                            component={motion.div}
                            animate={{ rotate: [360, 180, 0], scale: [1, 1.25, 1] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                            sx={{
                                width: 7,
                                height: 7,
                                borderRadius: '50%',
                                bgcolor: '#4dd4ac',
                                boxShadow: '0 0 10px #4dd4ac',
                            }}
                        />
                    </Stack>

                    <Typography
                        sx={{
                            fontSize: { xs: '0.9rem', sm: '1.02rem', md: '1.12rem' },
                            fontWeight: 500,
                            color: '#ffffff',
                            fontStyle: 'italic',
                            lineHeight: 1.5,
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                        }}
                    >
                        "{heroText.theme_text || 'Harmonizing Georesources, Geohazard, and Heritage Conservation to Promote Sustainable Development'}"
                    </Typography>
                </Box>

                {/* CTA Buttons — Staggered Entrance with Rich Hover Physics */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    sx={{
                        mt: 4,
                    }}
                >
                    {auth?.user ? (
                        <Box
                            component={motion.div}
                            whileHover={{ y: -3, scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
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
                                        boxShadow: '0 8px 24px rgba(77, 212, 172, 0.5)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Go to Dashboard
                            </Button>
                        </Box>
                    ) : (
                        <>
                            <Box
                                component={motion.div}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.24, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ y: -3, scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Button
                                    component={Link}
                                    href="/tickets"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: '#ffffff',
                                        fontWeight: 800,
                                        textTransform: 'none',
                                        borderRadius: '12px',
                                        px: 3.5,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.45)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                                            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.55)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Conference Registration
                                </Button>
                            </Box>
                            <Box
                                component={motion.div}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ y: -3, scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
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
                                        px: 3.5,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        whiteSpace: 'nowrap',
                                        boxShadow: '0 4px 16px rgba(77, 212, 172, 0.4)',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #6ee7b7 0%, #14b8a6 100%)',
                                            boxShadow: '0 8px 24px rgba(77, 212, 172, 0.5)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Author Registration
                                </Button>
                            </Box>
                            <Box
                                component={motion.div}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.36, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ y: -3, scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Button
                                    component={Link}
                                    href="/login"
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        borderColor: 'rgba(255,255,255,0.6)',
                                        color: 'white',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        borderRadius: '12px',
                                        px: 3.5,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        bgcolor: 'rgba(255,255,255,0.06)',
                                        backdropFilter: 'blur(8px)',
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255,255,255,0.18)',
                                            boxShadow: '0 4px 16px rgba(255,255,255,0.2)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Sign In
                                </Button>
                            </Box>
                        </>
                    )}
                </Stack>

                {/* Secondary Hero Logos — Pill Card with Staggered Interactive Floating Badges */}
                {settings.hero_logos_secondary && settings.hero_logos_secondary.length > 0 && (
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 35, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 0.85,
                            delay: 1.38,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        whileHover={{
                            boxShadow: '0 16px 45px rgba(0, 0, 0, 0.3), 0 0 30px rgba(77, 212, 172, 0.25)',
                            borderColor: 'rgba(77, 212, 172, 0.45)',
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            gap: { xs: 1.2, sm: 1.6, md: 1.8 },
                            mt: 4.5,
                            px: { xs: 2.2, sm: 3.5 },
                            py: 1.6,
                            borderRadius: '60px',
                            bgcolor: 'rgba(255, 255, 255, 0.16)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            border: '1.5px solid rgba(255, 255, 255, 0.28)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                            position: 'relative',
                            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                        }}
                    >
                        {settings.hero_logos_secondary.map((logo, index) => (
                            <Box
                                key={index}
                                component={motion.div}
                                initial={{ opacity: 0, scale: 0.2, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{
                                    duration: 0.55,
                                    delay: 1.45 + index * 0.05,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                whileHover={{
                                    scale: 1.24,
                                    y: -6,
                                    rotate: [0, -3, 3, 0],
                                    boxShadow: '0 12px 25px rgba(77, 212, 172, 0.55), 0 0 18px rgba(255, 255, 255, 0.85)',
                                    borderColor: '#4dd4ac',
                                    zIndex: 10,
                                    transition: { duration: 0.25 },
                                }}
                                whileTap={{ scale: 0.95 }}
                                sx={{
                                    width: { xs: 46, sm: 54, md: 62 },
                                    height: { xs: 46, sm: 54, md: 62 },
                                    borderRadius: '50%',
                                    bgcolor: '#ffffff',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.22)',
                                    border: '2.5px solid rgba(255, 255, 255, 0.9)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    flexShrink: 0,
                                    transition: 'border-color 0.25s ease',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={logo.url}
                                    alt={`Partner ${index + 1}`}
                                    loading="lazy"
                                    decoding="async"
                                    width={56}
                                    height={56}
                                    sx={{
                                        width: '84%',
                                        height: '84%',
                                        objectFit: 'contain',
                                        transition: 'transform 0.25s ease',
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Isolated Countdown Component (does not re-render parent Hero) */}
                <CountdownSection targetDateStr={settings.countdown_target_date} fadeInUpAnim={fadeInUp} />
            </Container>
        </Box>
    );
}
