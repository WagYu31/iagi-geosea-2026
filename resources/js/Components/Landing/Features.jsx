import React from 'react';
import { alpha, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PublicIcon from '@mui/icons-material/Public';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ScrollReveal from './ScrollReveal';
import SpotlightCard from './SpotlightCard';
import useCountUp from './useCountUp';

// Subtle ambient gradient pulse
const pulseGlow = keyframes`
    0%, 100% { opacity: 0.35; transform: scale(1); }
    50%      { opacity: 0.65; transform: scale(1.08); }
`;

function CountUpStat({ end, suffix, label, icon, index }) {
    const { ref, display } = useCountUp(end, 2000, suffix);

    return (
        <ScrollReveal key={index} variant="fadeUp" delay={index * 100} duration={650}>
            <SpotlightCard
                spotlightColor="rgba(13, 148, 136, 0.16)"
                sx={{
                    textAlign: 'center',
                    p: { xs: 2.2, md: 2.8 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }}
            >
                <Box ref={ref} sx={{ width: '100%' }}>
                    <Box
                        sx={{
                            color: '#0d9488',
                            mb: 0.8,
                            display: 'inline-flex',
                            p: 1,
                            borderRadius: '12px',
                            bgcolor: 'rgba(13, 148, 136, 0.08)',
                            '& svg': { fontSize: 26 },
                            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            '&:hover': { transform: 'scale(1.15) rotate(6deg)' },
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            color: '#094d42',
                            fontSize: { xs: '1.6rem', md: '1.85rem' },
                            lineHeight: 1.2,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {display}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#6b7280',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'block',
                            mt: 0.5,
                        }}
                    >
                        {label}
                    </Typography>
                </Box>
            </SpotlightCard>
        </ScrollReveal>
    );
}

export default function Features({ settings }) {
    const stats = [
        { end: 2000, suffix: '+', label: 'Expected Participants', icon: <GroupsIcon /> },
        { end: 50, suffix: '+', label: 'Expert Speakers', icon: <RecordVoiceOverIcon /> },
        { end: 3, suffix: '', label: 'Days of Sessions', icon: <CalendarMonthIcon /> },
        { end: 8, suffix: '+', label: 'Countries', icon: <PublicIcon /> },
    ];

    // 6 perfectly balanced items to ensure clean 3x2 grid layout (fixes "kepotong tuh yang no 5")
    const whyAttend = [
        'Network with leading geologists, academics, and industry executives',
        'Learn about cutting-edge geological research & energy innovations',
        'Present your research to an esteemed international audience',
        'Explore bilateral ASEAN and global partnerships & collaboration',
        'Gain hands-on insights through specialized technical field trips',
        'Earn professional credentials and official certification points',
    ];

    return (
        <Box id="about" sx={{
            py: { xs: 8, sm: 12 },
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 50%, #f0fdfa 100%)',
        }}>
            {/* Ambient background light accents */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '10%',
                    right: '-5%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(13, 148, 136, 0.06) 0%, transparent 70%)',
                    filter: 'blur(50px)',
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Top Section: Title + Stats Row */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { md: 'flex-end' },
                        gap: { xs: 4, md: 6 },
                        mb: { xs: 6, md: 8 },
                    }}
                >
                    {/* Left: Section text */}
                    <Box sx={{ flex: 1 }}>
                        <ScrollReveal variant="fadeUp" duration={700}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    bgcolor: alpha('#0d9488', 0.1),
                                    borderRadius: '50px',
                                    px: 2.5,
                                    py: 0.7,
                                    mb: 2.5,
                                    border: '1px solid rgba(13, 148, 136, 0.18)',
                                }}
                            >
                                <EmojiEventsIcon sx={{ color: '#0d9488', fontSize: 18 }} />
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: '#0d9488',
                                        fontWeight: 700,
                                        letterSpacing: '0.12em',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    ABOUT THE EVENT
                                </Typography>
                            </Box>
                            <Typography
                                component="h2"
                                variant="h3"
                                sx={{
                                    color: '#111827',
                                    fontWeight: 800,
                                    fontSize: { xs: '2rem', md: '2.5rem' },
                                    lineHeight: 1.2,
                                    letterSpacing: '-0.02em',
                                    mb: 2,
                                }}
                            >
                                A Premier International{' '}
                                <Box
                                    component="span"
                                    sx={{
                                        background: 'linear-gradient(135deg, #094d42, #0d9488)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Geological Gathering
                                </Box>
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    lineHeight: 1.8,
                                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                                    maxWidth: '550px',
                                }}
                            >
                                The 55th IAGI – GEOSEA XIX 2026 is organized by the Indonesian Association of Geologists (IAGI).
                                This landmark event facilitates high-level exchange between geologists, industry leaders, and researchers across the globe.
                            </Typography>
                        </ScrollReveal>
                    </Box>

                    {/* Right: Stats Grid */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 2,
                            minWidth: { md: '360px' },
                        }}
                    >
                        {stats.map((stat, index) => (
                            <CountUpStat
                                key={index}
                                index={index}
                                end={stat.end}
                                suffix={stat.suffix}
                                label={stat.label}
                                icon={stat.icon}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Bottom: Why Attend - Full Width Premium Card with Living Gradient */}
                <ScrollReveal variant="fadeUp" delay={200} duration={800}>
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 50%, #0d9488 100%)',
                            borderRadius: '24px',
                            p: { xs: 3, md: 5 },
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(9, 77, 66, 0.22)',
                        }}
                    >
                        {/* Living decorative ambient orbs */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -60,
                                right: -60,
                                width: 320,
                                height: 320,
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(77, 212, 172, 0.22) 0%, transparent 70%)',
                                animation: `${pulseGlow} 6s ease-in-out infinite`,
                                pointerEvents: 'none',
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -50,
                                left: '20%',
                                width: 260,
                                height: 260,
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                animation: `${pulseGlow} 8s ease-in-out infinite 2s`,
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Header */}
                        <Box sx={{ position: 'relative', zIndex: 1, mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: '12px',
                                        bgcolor: alpha('#ffffff', 0.15),
                                        backdropFilter: 'blur(10px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <EmojiEventsIcon sx={{ color: '#4dd4ac', fontSize: 24 }} />
                                </Box>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 700,
                                        color: '#ffffff',
                                        fontSize: { xs: '1.3rem', md: '1.5rem' },
                                    }}
                                >
                                    Why Attend?
                                </Typography>
                            </Box>
                            <Typography
                                variant="body2"
                                sx={{ color: alpha('#ffffff', 0.75), ml: { xs: 0, sm: 7.5 }, mt: { xs: 0.5, sm: 0 } }}
                            >
                                Here's what makes this conference unmissable
                            </Typography>
                        </Box>

                        {/* Why Attend Items - Perfectly Symmetrical 3x2 Grid */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                                gap: 2,
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            {whyAttend.map((item, index) => (
                                <ScrollReveal key={index} variant="fadeUp" delay={index * 80} duration={550}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 1.5,
                                            p: 2.5,
                                            height: '100%',
                                            borderRadius: '14px',
                                            bgcolor: alpha('#ffffff', 0.08),
                                            backdropFilter: 'blur(8px)',
                                            border: `1px solid ${alpha('#ffffff', 0.15)}`,
                                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                            '&:hover': {
                                                bgcolor: alpha('#ffffff', 0.16),
                                                borderColor: alpha('#ffffff', 0.35),
                                                transform: 'translateY(-3px)',
                                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                            },
                                        }}
                                    >
                                        <CheckCircleIcon
                                            sx={{
                                                color: '#4dd4ac',
                                                fontSize: 22,
                                                mt: 0.2,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: alpha('#ffffff', 0.95),
                                                lineHeight: 1.6,
                                                fontSize: '0.9rem',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {item}
                                        </Typography>
                                    </Box>
                                </ScrollReveal>
                            ))}
                        </Box>
                    </Box>
                </ScrollReveal>
            </Container>
        </Box>
    );
}
