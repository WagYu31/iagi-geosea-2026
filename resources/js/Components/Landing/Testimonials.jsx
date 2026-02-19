import React from 'react';
import { alpha, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ScrollReveal from './ScrollReveal';

// Shimmer glow border animation
const shimmerBorder = keyframes`
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

const glowPulse = keyframes`
    0%, 100% { opacity: 0; transform: scale(0.95); }
    50%       { opacity: 1; transform: scale(1.05); }
`;

export default function Testimonials({ settings }) {
    const speakers = (settings.keynote_speakers && settings.keynote_speakers.length > 0
        ? settings.keynote_speakers.filter(s => s.name && s.name.trim() !== '')
        : []);

    // Hide entire section if no speakers configured
    // if (speakers.length === 0) return null;

    return (
        <Box
            id="speakers"
            sx={{
                py: { xs: 8, sm: 12 },
                background: 'linear-gradient(180deg, #ffffff 0%, #f5fdf9 50%, #eef9f5 100%)',
            }}
        >
            <Container maxWidth="lg">
                {/* Section Header */}
                <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
                    <Typography
                        variant="overline"
                        sx={{
                            color: '#0d9488',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            fontSize: '0.8rem',
                            display: 'block',
                            mb: 1,
                        }}
                    >
                        VISIONARIES
                    </Typography>
                    <Typography
                        component="h2"
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            color: 'text.primary',
                            fontSize: { xs: '2rem', md: '2.8rem' },
                            mb: 2,
                        }}
                    >
                        Keynote Speakers
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '600px',
                            mx: 'auto',
                            fontSize: { xs: '1rem', md: '1.1rem' },
                        }}
                    >
                        {settings.keynote_speakers_description || 'Distinguished experts bridging the gap between geological science and practical sustainability.'}
                    </Typography>
                </Box>

                {speakers.length === 0 ? null : (
                    /* Speaker Cards — horizontal scroll on mobile, wrap on desktop */
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: { xs: 'nowrap', lg: 'wrap' },
                            justifyContent: { lg: 'center' },
                            gap: { xs: 2, md: 3 },
                            overflowX: { xs: 'auto', lg: 'visible' },
                            scrollSnapType: { xs: 'x mandatory', lg: 'none' },
                            scrollBehavior: 'smooth',
                            pb: { xs: 2, lg: 0 },
                            px: { xs: 1, md: 0 },
                            '&::-webkit-scrollbar': { height: 6 },
                            '&::-webkit-scrollbar-track': { bgcolor: '#e5e7eb', borderRadius: 3 },
                            '&::-webkit-scrollbar-thumb': { bgcolor: '#0d9488', borderRadius: 3 },
                        }}
                    >
                        {speakers.map((speaker, index) => (
                            <ScrollReveal key={index} variant="fadeUp" delay={index * 150} duration={800}>
                                <Box
                                    key={index}
                                    sx={{
                                        minWidth: { xs: '80%', sm: '46%', md: '46%', lg: '30%' },
                                        flex: { xs: '0 0 80%', sm: '0 0 46%', md: '0 0 46%', lg: '0 0 30%' },
                                        scrollSnapAlign: { xs: 'center', lg: 'none' },
                                    }}
                                >
                                    {/* Image Card — with shimmer glow border on hover */}
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            aspectRatio: '3/4',
                                            borderRadius: '20px',
                                            // Shimmer glow border via box-shadow layering
                                            transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                inset: -2,
                                                borderRadius: '22px',
                                                background: 'linear-gradient(135deg, #4dd4ac, #0d9488, #094d42, #4dd4ac, #6ee7b7, #0d9488)',
                                                backgroundSize: '300% 300%',
                                                opacity: 0,
                                                transition: 'opacity 0.45s ease',
                                                zIndex: 0,
                                            },
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                inset: 0,
                                                borderRadius: '20px',
                                                background: 'inherit',
                                                zIndex: 0,
                                            },
                                            '&:hover': {
                                                transform: 'translateY(-8px) scale(1.02)',
                                                boxShadow: `0 20px 48px ${alpha('#0d9488', 0.35)}, 0 0 30px ${alpha('#4dd4ac', 0.2)}`,
                                                '&::before': {
                                                    opacity: 1,
                                                    animation: `${shimmerBorder} 2.5s ease infinite`,
                                                },
                                                '& .speaker-overlay': {
                                                    background: 'linear-gradient(to top, rgba(9, 77, 66, 0.9) 0%, rgba(13, 122, 106, 0.6) 40%, transparent 100%)',
                                                },
                                            },
                                        }}
                                    >
                                        <Box
                                            role="img"
                                            aria-label={`Photo of ${speaker.name}`}
                                            sx={{
                                                position: 'absolute',
                                                inset: 2,
                                                borderRadius: '18px',
                                                backgroundImage: speaker.photo
                                                    ? `url(${speaker.photo})`
                                                    : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                zIndex: 1,
                                                overflow: 'hidden',
                                            }}
                                        />
                                        <Box
                                            className="speaker-overlay"
                                            sx={{
                                                position: 'absolute',
                                                inset: 2,
                                                borderRadius: '18px',
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)',
                                                transition: 'background 0.4s ease',
                                                zIndex: 1,
                                            }}
                                        />
                                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 3, zIndex: 2 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    fontSize: { xs: '1.1rem', md: '1.2rem' },
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {speaker.name}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Speaker info below */}
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <Typography
                                            sx={{
                                                color: 'text.primary',
                                                fontWeight: 700,
                                                fontSize: '0.95rem',
                                                letterSpacing: '0.02em',
                                                mb: 0.5,
                                            }}
                                        >
                                            {speaker.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.9rem',
                                                fontStyle: 'italic',
                                            }}
                                        >
                                            {speaker.institution}
                                        </Typography>
                                    </Box>
                                </Box>
                            </ScrollReveal>
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
}
