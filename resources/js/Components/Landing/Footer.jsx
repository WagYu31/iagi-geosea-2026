import React from 'react';
import { Link } from '@inertiajs/react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MuiLink from '@mui/material/Link';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const SocialIcon = ({ type }) => {
    const icons = {
        instagram: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
        facebook: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        twitter: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        youtube: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
        whatsapp: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        ),
        telegram: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
        ),
    };
    return icons[type] || null;
};

export default function Footer({ settings, auth }) {
    const contact = settings.contact_info || {};
    const social = settings.social_media || {};

    // Sponsors marquee
    const sponsors = settings.sponsors && settings.sponsors.length > 0 ? settings.sponsors : [];
    const duplicatedSponsors = sponsors.length > 0 ? [...sponsors, ...sponsors, ...sponsors] : [];

    return (
        <>
            {/* Sponsors Section */}
            {sponsors.length > 0 && (
                <Box sx={{ py: { xs: 6, sm: 8 }, background: 'linear-gradient(180deg, #ffffff 0%, #fafffe 30%, #f5fdfb 60%, #edf8f5 100%)' }}>
                    <Container maxWidth="lg">
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                                color: 'text.primary',
                                fontSize: { xs: '1.5rem', md: '2rem' },
                                letterSpacing: '0.05em',
                            }}
                        >
                            SUPPORTED BY :
                        </Typography>
                        {settings.sponsors_description && settings.sponsors_description.trim() !== '' && (
                            <Typography
                                variant="body1"
                                align="center"
                                sx={{ mb: { xs: 3, md: 5 }, color: '#3b82f6', fontStyle: 'italic', maxWidth: 600, mx: 'auto' }}
                            >
                                {settings.sponsors_description}
                            </Typography>
                        )}

                        {/* Marquee */}
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100vw',
                                ml: 'calc(-50vw + 50%)',
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
                                    '&:hover': { animationPlayState: 'paused' },
                                    '@keyframes marquee': {
                                        '0%': { transform: 'translateX(0)' },
                                        '100%': { transform: `translateX(-${sponsors.length * 312}px)` },
                                    },
                                }}
                            >
                                {duplicatedSponsors.map((sponsor, index) => (
                                    <Paper
                                        key={index}
                                        elevation={1}
                                        sx={{
                                            p: 3,
                                            minWidth: { xs: 220, sm: 260, md: 280 },
                                            height: { xs: 140, sm: 150, md: 160 },
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            bgcolor: 'white',
                                            borderRadius: '20px',
                                            border: '1px solid rgba(0,0,0,0.06)',
                                            flexShrink: 0,
                                            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                                            '&:hover': {
                                                transform: 'translateY(-6px)',
                                                boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                                            },
                                        }}
                                    >
                                        {sponsor.logo ? (
                                            <Box
                                                component="img"
                                                src={sponsor.logo}
                                                alt="Supported by"
                                                loading="lazy"
                                                sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <Typography sx={{ color: '#9ca3af', fontWeight: 500, fontSize: '0.9rem' }}>
                                                {sponsor.name || 'Sponsor'}
                                            </Typography>
                                        )}
                                    </Paper>
                                ))}
                            </Box>
                        </Box>
                    </Container>
                </Box>
            )}

            {/* Footer with Venue */}
            <Box
                id="venue"
                sx={{
                    background: 'linear-gradient(180deg, #094d42 0%, #073d34 60%, #062e28 100%)',
                    color: 'white',
                    pt: { xs: 6, md: 8 },
                    pb: { xs: 3, md: 4 },
                }}
            >
                <Container maxWidth="lg">
                    {/* ── Venue & Map Row ── */}
                    <Box sx={{ mb: { xs: 5, md: 6 } }}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: '#4dd4ac',
                                fontWeight: 700,
                                letterSpacing: '0.15em',
                                fontSize: '0.75rem',
                                display: 'block',
                                mb: 1,
                                textAlign: 'center',
                            }}
                        >
                            VENUE & LOCATION
                        </Typography>
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{
                                fontWeight: 800,
                                mb: { xs: 3, md: 4 },
                                fontSize: { xs: '1.5rem', md: '2rem' },
                                color: 'white',
                            }}
                        >
                            {contact.venue_name || 'Conference Venue'}
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Contact Info Card */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        borderRadius: '20px',
                                        background: 'rgba(255,255,255,0.07)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2.5,
                                    }}
                                >
                                    {/* Venue subtitle */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: 'linear-gradient(135deg, #0d9488, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                                            🏛️
                                        </Box>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                                            {contact.venue_subtitle || 'Main Conference Hall'}
                                        </Typography>
                                    </Box>

                                    {/* Address */}
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                        <LocationOnIcon sx={{ color: '#4dd4ac', mt: 0.3, fontSize: 20, flexShrink: 0 }} />
                                        <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                                            {contact.location || settings.contact_address || 'Address not set'}
                                        </Typography>
                                    </Box>

                                    {/* Phone */}
                                    <Box
                                        component="a"
                                        href={`https://wa.me/${(contact.phone || settings.contact_phone || '').replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', transition: 'opacity 0.2s', '&:hover': { opacity: 0.8 } }}
                                    >
                                        <Box sx={{ color: '#4dd4ac', display: 'flex', flexShrink: 0 }}><SocialIcon type="whatsapp" /></Box>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                                            {contact.phone || settings.contact_phone}
                                        </Typography>
                                    </Box>

                                    {/* Telegram */}
                                    <Box
                                        component="a"
                                        href={(() => {
                                            const tg = contact.telegram || '@iagi_geosea2026';
                                            if (tg.startsWith('http://') || tg.startsWith('https://')) return tg;
                                            if (tg.includes('.') && !tg.startsWith('@')) return `https://${tg}`;
                                            return `https://t.me/${tg.replace('@', '')}`;
                                        })()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', transition: 'opacity 0.2s', '&:hover': { opacity: 0.8 } }}
                                    >
                                        <Box sx={{ color: '#4dd4ac', display: 'flex', flexShrink: 0 }}><SocialIcon type="telegram" /></Box>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                                            {contact.telegram || '@iagi_geosea2026'}
                                        </Typography>
                                    </Box>

                                    {/* Email */}
                                    <Box
                                        component="a"
                                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email || settings.contact_email || ''}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', transition: 'opacity 0.2s', '&:hover': { opacity: 0.8 } }}
                                    >
                                        <EmailIcon sx={{ color: '#4dd4ac', fontSize: 20, flexShrink: 0 }} />
                                        <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                                            {contact.email || settings.contact_email}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Map */}
                            <Grid size={{ xs: 12, md: 8 }}>
                                {contact.maps_url && contact.maps_url.trim() !== '' ? (
                                    <Box sx={{ borderRadius: '20px', height: { xs: 260, md: '100%' }, minHeight: 280, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                                        <iframe
                                            src={contact.maps_url}
                                            title="Conference venue location map"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0, minHeight: 280 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </Box>
                                ) : (
                                    <Box sx={{ borderRadius: '20px', height: { xs: 260, md: '100%' }, minHeight: 280, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.2)' }}>
                                        <Box sx={{ textAlign: 'center', p: 4 }}>
                                            <Typography sx={{ fontSize: '3rem', mb: 1 }}>🗺️</Typography>
                                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, mb: 0.5 }}>Interactive Map</Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Set Maps URL in Landing Page Settings</Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Box>

                    {/* ── Divider ── */}
                    <Divider sx={{ borderColor: 'rgba(77, 212, 172, 0.15)', mb: { xs: 4, md: 5 } }} />

                    {/* ── Brand + Links + Account + Social Row ── */}
                    <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mb: { xs: 4, md: 5 } }}>
                        {/* Brand */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                                <Avatar
                                    src="/WhatsApp_Image_2025-12-29_at_19.37.46-removebg-preview.png"
                                    alt="PIT IAGI-GEOSEA XIX Logo"
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        bgcolor: 'white',
                                        p: 0.6,
                                        boxShadow: '0 6px 24px rgba(77, 212, 172, 0.2)',
                                        border: '2px solid rgba(77, 212, 172, 0.3)',
                                    }}
                                />
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: '1.1rem',
                                            background: 'linear-gradient(135deg, #4dd4ac 0%, #6ee7b7 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        55ᵀᴴ IAGI Annual Scientific Meeting 2026
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                        GEOSEA XIX Convention & Exhibition
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, fontSize: '0.85rem' }}>
                                Indonesian Association of Geologists (IAGI) proudly presents the 55th Annual Convention & GEOSEA XIX — Southeast Asia's premier geological conference.
                            </Typography>
                        </Grid>

                        {/* Quick Links */}
                        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4dd4ac', mb: 2, fontSize: '0.9rem' }}>
                                Quick Links
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                                {[
                                    { label: 'About', target: 'about' },
                                    { label: 'Speakers', target: 'speakers' },
                                    { label: 'Timeline', target: 'timeline' },
                                    { label: 'Resources', target: 'resources' },
                                    { label: 'FAQ', target: 'faq' },
                                ].map((item) => (
                                    <Typography
                                        key={item.target}
                                        onClick={() => document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                        sx={{
                                            color: 'rgba(255,255,255,0.6)',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.25s ease',
                                            '&:hover': { color: '#4dd4ac', pl: 0.5 },
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                ))}
                            </Box>
                        </Grid>

                        {/* Account */}
                        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4dd4ac', mb: 2, fontSize: '0.9rem' }}>
                                Account
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                                {!auth?.user ? (
                                    <>
                                        <MuiLink href="/register" sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', transition: 'all 0.25s ease', '&:hover': { color: '#4dd4ac' } }}>
                                            Register
                                        </MuiLink>
                                        <MuiLink href="/login" sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', transition: 'all 0.25s ease', '&:hover': { color: '#4dd4ac' } }}>
                                            Login
                                        </MuiLink>
                                    </>
                                ) : (
                                    <MuiLink href="/dashboard" sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', transition: 'all 0.25s ease', '&:hover': { color: '#4dd4ac' } }}>
                                        Dashboard
                                    </MuiLink>
                                )}
                            </Box>
                        </Grid>

                        {/* Social Media */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4dd4ac', mb: 2, fontSize: '0.9rem' }}>
                                Follow Us
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                {[
                                    { icon: 'instagram', label: 'Instagram', url: social.instagram || '#', hoverColor: '#E4405F' },
                                    { icon: 'facebook', label: 'Facebook', url: social.facebook || '#', hoverColor: '#1877F2' },
                                    { icon: 'twitter', label: 'X (Twitter)', url: social.twitter || '#', hoverColor: '#1DA1F2' },
                                    { icon: 'youtube', label: 'YouTube', url: social.youtube || '#', hoverColor: '#FF0000' },
                                ].map((item, index) => (
                                    <Box
                                        key={index}
                                        component="a"
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Follow us on ${item.label}`}
                                        sx={{
                                            width: 42,
                                            height: 42,
                                            borderRadius: '10px',
                                            bgcolor: 'rgba(255,255,255,0.08)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                            color: 'white',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            '&:hover': {
                                                bgcolor: item.hoverColor,
                                                transform: 'translateY(-3px)',
                                                boxShadow: `0 6px 20px ${item.hoverColor}40`,
                                                borderColor: 'transparent',
                                            },
                                        }}
                                    >
                                        <SocialIcon type={item.icon} />
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>

                    {/* ── Copyright Bar ── */}
                    <Box
                        sx={{
                            pt: 3,
                            borderTop: '1px solid rgba(77, 212, 172, 0.15)',
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 1.5,
                        }}
                    >
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', textAlign: { xs: 'center', md: 'left' } }}>
                            © 2026 PIT IAGI-GEOSEA XIX. All rights reserved.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                            {['Privacy Policy', 'Terms of Service'].map((item) => (
                                <Typography
                                    key={item}
                                    sx={{
                                        fontSize: '0.8rem',
                                        color: 'rgba(255,255,255,0.4)',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                        transition: 'color 0.25s ease',
                                        '&:hover': { color: '#4dd4ac' },
                                    }}
                                >
                                    {item}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
