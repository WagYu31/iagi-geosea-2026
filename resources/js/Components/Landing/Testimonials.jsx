import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

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
                            <Box
                                key={index}
                                sx={{
                                    minWidth: { xs: '80%', sm: '46%', md: '46%', lg: '30%' },
                                    flex: { xs: '0 0 80%', sm: '0 0 46%', md: '0 0 46%', lg: '0 0 30%' },
                                    scrollSnapAlign: { xs: 'center', lg: 'none' },
                                }}
                            >
                                {/* Image Card */}
                                <Box
                                    sx={{
                                        position: 'relative',
                                        aspectRatio: '3/4',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px) scale(1.02)',
                                            boxShadow: '0 20px 48px rgba(13, 148, 136, 0.2)',
                                            '& .speaker-overlay': {
                                                background: 'linear-gradient(to top, rgba(9, 77, 66, 0.9) 0%, rgba(13, 122, 106, 0.6) 40%, transparent 100%)',
                                            },
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            backgroundImage: speaker.photo
                                                ? `url(${speaker.photo})`
                                                : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                    <Box
                                        className="speaker-overlay"
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)',
                                            transition: 'background 0.4s ease',
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
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
}
