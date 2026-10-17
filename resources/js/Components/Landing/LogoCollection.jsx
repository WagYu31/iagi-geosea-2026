import React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import PublicIcon from '@mui/icons-material/Public';
import ScrollReveal from './ScrollReveal';
import SpotlightCard from './SpotlightCard';

// Country flag emojis for visual flair
const countryFlags = {
    'Indonesia': '🇮🇩',
    'Malaysia': '🇲🇾',
    'Thailand': '🇹🇭',
    'Philippines': '🇵🇭',
    'Vietnam': '🇻🇳',
    'Japan': '🇯🇵',
    'Korea': '🇰🇷',
    'China': '🇨🇳',
    'Singapore': '🇸🇬',
    'Myanmar': '🇲🇲',
    'Laos': '🇱🇦',
    'Cambodia': '🇰🇭',
    'Taiwan': '🇹🇼',
    'India': '🇮🇳',
    'Australia': '🇦🇺',
};

export default function LogoCollection({ settings }) {
    const afgeoText = settings.afgeo_text || {};
    const members = settings.afgeo_members || [
        { name: 'IAGI', country: 'Indonesia' },
        { name: 'GSM', country: 'Malaysia' },
        { name: 'GST', country: 'Thailand' },
        { name: 'GSP', country: 'Philippines' },
        { name: 'GSV', country: 'Vietnam' },
        { name: 'GSJ', country: 'Japan' },
        { name: 'GSK', country: 'Korea' },
        { name: 'GSC', country: 'China' },
    ];

    return (
        <Box
            id="afgeo"
            sx={{
                py: { xs: 8, sm: 10 },
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #ffffff 0%, #f0fdfa 40%, #e6f7f4 100%)',
            }}
        >


            {/* Soft Ambient Light Blob (GetLayers Relay Style - Bright Theme) */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-15%',
                    left: '20%',
                    width: '600px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(13, 148, 136, 0.08) 0%, rgba(77, 212, 172, 0.04) 50%, transparent 70%)',
                    filter: 'blur(50px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '15%',
                    width: '500px',
                    height: '350px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(77, 212, 172, 0.07) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Section Header */}
                <ScrollReveal variant="fadeUp" duration={700}>
                    <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 6 } }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: alpha('#0d9488', 0.1),
                                borderRadius: '50px',
                                px: 3,
                                py: 0.8,
                                mb: 2.5,
                                border: '1px solid rgba(13, 148, 136, 0.18)',
                            }}
                        >
                            <PublicIcon sx={{ color: '#0d9488', fontSize: 18 }} />
                            <Typography
                                variant="overline"
                                sx={{
                                    color: '#0d9488',
                                    fontWeight: 700,
                                    letterSpacing: '0.15em',
                                    fontSize: '0.75rem',
                                }}
                            >
                                {afgeoText.section_label || 'OUR NETWORK'}
                            </Typography>
                        </Box>

                        <Typography
                            component="h2"
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                                color: '#111827',
                                fontSize: { xs: '2rem', md: '2.75rem' },
                                letterSpacing: '-0.02em',
                            }}
                        >
                            {afgeoText.title || 'AFGEO Member'}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#6b7280',
                                maxWidth: '650px',
                                mx: 'auto',
                                fontSize: { xs: '0.95rem', md: '1.05rem' },
                                lineHeight: 1.7,
                            }}
                        >
                            {afgeoText.subtitle || 'Association of Federation of Geoscientists of East and Southeast Asia'}
                        </Typography>
                    </Box>
                </ScrollReveal>

                {/* Members Grid with Interactive Spotlight Cards */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(2, 1fr)',
                            sm: 'repeat(3, 1fr)',
                            md: `repeat(${Math.min(members.length, 3)}, 1fr)`,
                        },
                        gap: { xs: 2, md: 2.5 },
                        maxWidth: '900px',
                        mx: 'auto',
                    }}
                >
                    {members.map((member, index) => (
                        <ScrollReveal
                            key={index}
                            variant="fadeUp"
                            delay={index * 60}
                            duration={600}
                        >
                            <SpotlightCard
                                spotlightColor="rgba(13, 148, 136, 0.14)"
                                sx={{
                                    p: { xs: 2.5, md: 3 },
                                    textAlign: 'center',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {/* Logo Circle */}
                                <Box
                                    sx={{
                                        width: { xs: 80, md: 96 },
                                        height: { xs: 80, md: 96 },
                                        borderRadius: '50%',
                                        bgcolor: '#ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2,
                                        overflow: 'hidden',
                                        boxShadow: `0 4px 16px ${alpha('#0d9488', 0.1)}`,
                                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                        '&:hover': {
                                            transform: 'rotate(5deg) scale(1.08)',
                                        },
                                    }}
                                >
                                    {member.logo ? (
                                        <Box
                                            component="img"
                                            src={member.logo}
                                            alt={member.name}
                                            loading="lazy"
                                            decoding="async"
                                            width={80}
                                            height={80}
                                            sx={{
                                                width: '90%',
                                                height: '90%',
                                                objectFit: 'contain',
                                            }}
                                        />
                                    ) : (
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                color: '#094d42',
                                                fontSize: { xs: '0.85rem', md: '0.95rem' },
                                            }}
                                        >
                                            {member.name}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Member Name */}
                                <Typography
                                    component="h3"
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
                                        color: '#111827',
                                        fontSize: { xs: '0.85rem', md: '0.95rem' },
                                        mb: 0.5,
                                    }}
                                >
                                    {member.name}
                                </Typography>

                                {/* Country with flag */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                    <Typography sx={{ fontSize: '1rem', lineHeight: 1 }}>
                                        {countryFlags[member.country] || '🌏'}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: '#6b7280',
                                            fontWeight: 500,
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        {member.country}
                                    </Typography>
                                </Box>
                            </SpotlightCard>
                        </ScrollReveal>
                    ))}
                </Box>

                {/* Member count badge */}
                <ScrollReveal variant="fadeUp" delay={Math.min(members.length * 50, 400)}>
                    <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 5 } }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: alpha('#0d9488', 0.08),
                                borderRadius: '50px',
                                px: 3,
                                py: 1,
                                border: `1px solid ${alpha('#0d9488', 0.15)}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: alpha('#0d9488', 0.12),
                                    transform: 'scale(1.03)',
                                },
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#094d42',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                }}
                            >
                                🌍 {members.length} Member Countries
                            </Typography>
                        </Box>
                    </Box>
                </ScrollReveal>
            </Container>
        </Box>
    );
}
