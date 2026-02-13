import React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PublicIcon from '@mui/icons-material/Public';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function Features({ settings }) {
    const stats = [
        { number: '200+', label: 'Expected Participants', icon: <GroupsIcon /> },
        { number: '50+', label: 'Expert Speakers', icon: <RecordVoiceOverIcon /> },
        { number: '3', label: 'Days of Sessions', icon: <CalendarMonthIcon /> },
        { number: '8+', label: 'Countries', icon: <PublicIcon /> },
    ];

    const whyAttend = [
        'Network with leading geologists and researchers',
        'Learn about cutting-edge geological research',
        'Present your research to an international audience',
        'Explore opportunities for collaboration',
        'Stay updated on industry trends and innovations',
    ];

    return (
        <Box id="about" sx={{ py: { xs: 8, sm: 12 }, background: 'linear-gradient(180deg, #e6f7f4 0%, #f0fdfa 30%, #ffffff 100%)' }}>
            <Container maxWidth="lg">
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
                            <Box
                                key={index}
                                sx={{
                                    textAlign: 'center',
                                    p: { xs: 2, md: 2.5 },
                                    borderRadius: '16px',
                                    bgcolor: '#ffffff',
                                    border: '1px solid',
                                    borderColor: alpha('#0d9488', 0.12),
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 12px 24px ${alpha('#0d9488', 0.12)}`,
                                        borderColor: '#0d9488',
                                    },
                                }}
                            >
                                <Box sx={{ color: '#0d9488', mb: 0.5, '& svg': { fontSize: 28 } }}>
                                    {stat.icon}
                                </Box>
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        color: '#094d42',
                                        fontSize: { xs: '1.5rem', md: '1.75rem' },
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {stat.number}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#6b7280',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    {stat.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Bottom: Why Attend - Full Width Premium Card */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 50%, #0d9488 100%)',
                        borderRadius: '24px',
                        p: { xs: 3, md: 5 },
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 16px 48px rgba(9, 77, 66, 0.2)',
                    }}
                >
                    {/* Decorative elements */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -60,
                            right: -60,
                            width: 300,
                            height: 300,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(77, 212, 172, 0.15) 0%, transparent 70%)',
                            pointerEvents: 'none',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -40,
                            left: '30%',
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
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
                            sx={{ color: alpha('#ffffff', 0.7), ml: 7.5 }}
                        >
                            Here's what makes this conference unmissable
                        </Typography>
                    </Box>

                    {/* Why Attend Items - Card Grid */}
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
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1.5,
                                    p: 2.5,
                                    borderRadius: '14px',
                                    bgcolor: alpha('#ffffff', 0.08),
                                    backdropFilter: 'blur(8px)',
                                    border: `1px solid ${alpha('#ffffff', 0.12)}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: alpha('#ffffff', 0.14),
                                        borderColor: alpha('#ffffff', 0.25),
                                        transform: 'translateY(-2px)',
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
                                        color: alpha('#ffffff', 0.92),
                                        lineHeight: 1.6,
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                    }}
                                >
                                    {item}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
