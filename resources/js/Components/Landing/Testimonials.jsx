import React, { useState, useMemo } from 'react';
import { alpha, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MicIcon from '@mui/icons-material/Mic';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import ScrollReveal from './ScrollReveal';

// Shimmer glow border animation
const shimmerBorder = keyframes`
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

// Session metadata presets
const SESSION_CONFIGS = {
    'Special Keynote Speech': {
        title: 'SPECIAL KEYNOTE SPEECH',
        badge: 'Special Keynote',
        theme: 'High-Level Strategic Keynote Address — Energy & Geological Governance',
        date: 'Day 1 — November 3, 2026',
        accentColor: '#f59e0b',
        gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
        borderGradient: 'linear-gradient(90deg, #d97706, #fbbf24, #d97706)',
        bgTint: 'rgba(245, 158, 11, 0.05)',
    },
    'CEO Forum': {
        title: 'CEO FORUM',
        badge: 'CEO Forum',
        theme: 'Regulation, Risk, and Responsibility: How Energy Leaders Respond to Indonesia\'s Evolving Policy Landscape',
        date: 'Day 1 — November 3, 2026',
        accentColor: '#10b981',
        gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        borderGradient: 'linear-gradient(90deg, #059669, #34d399, #059669)',
        bgTint: 'rgba(16, 185, 129, 0.05)',
    },
    'Special Session': {
        title: 'SPECIAL SESSION',
        badge: 'Special Session',
        theme: 'Road Map to Giant Discovery of Indonesia\'s Exploration',
        date: 'Day 1 — November 3, 2026',
        accentColor: '#06b6d4',
        gradient: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
        borderGradient: 'linear-gradient(90deg, #0891b2, #38bdf8, #0891b2)',
        bgTint: 'rgba(6, 182, 212, 0.05)',
    },
    'Panel Discussion 1': {
        title: 'PANEL DISCUSSION 1',
        badge: 'Panel Discussion 1',
        theme: 'Critical Georesources for Energy Transition: Innovation, Sustainability, and Regional Collaboration in ASEAN',
        date: 'Day 1 — November 3, 2026',
        accentColor: '#6366f1',
        gradient: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
        borderGradient: 'linear-gradient(90deg, #4f46e5, #818cf8, #4f46e5)',
        bgTint: 'rgba(99, 102, 241, 0.05)',
    },
};

// Helper for speaker role badges
function getRoleBadge(role) {
    const r = (role || '').toLowerCase();
    if (r.includes('keynote')) {
        return {
            label: role || 'Keynote Speaker',
            icon: <WorkspacePremiumIcon sx={{ fontSize: 13 }} />,
            color: '#b45309',
            bgColor: 'rgba(254, 243, 199, 0.95)',
            border: '1px solid #fcd34d',
        };
    }
    if (r.includes('moderator')) {
        return {
            label: 'Moderator',
            icon: <MicIcon sx={{ fontSize: 13 }} />,
            color: '#0f766e',
            bgColor: 'rgba(204, 251, 241, 0.95)',
            border: '1px solid #5eead4',
        };
    }
    return {
        label: role || 'Speaker / Panelist',
        icon: <RecordVoiceOverIcon sx={{ fontSize: 13 }} />,
        color: '#065f46',
        bgColor: 'rgba(209, 250, 229, 0.95)',
        border: '1px solid #6ee7b7',
    };
}

const OFFICIAL_PHOTO_MAP = {
    'yuliot': '/images/speakers/yuliot-tanjung.jpg',
    'sultan': '/images/speakers/sri-sultan-hb-x.jpg',
    'hamengkubuwana': '/images/speakers/sri-sultan-hb-x.jpg',
    'budi santoso': '/images/speakers/stj-budi-santoso.jpg',
    'maroef': '/images/speakers/maroef-sjamsoeddin.jpg',
    'yudistian': '/images/speakers/yudistian-yunis.jpg',
};

export default function Testimonials({ settings }) {
    const [selectedTab, setSelectedTab] = useState('all');
    const [posterOpen, setPosterOpen] = useState(false);

    const rawSpeakers = (settings?.keynote_speakers && settings.keynote_speakers.length > 0)
        ? settings.keynote_speakers.filter(s => s.name && s.name.trim() !== '')
        : [];

    // Standardize session names, photo paths, and ensure fallbacks
    const speakers = useMemo(() => {
        return rawSpeakers.map(s => {
            let photo = s.photo;
            if (!photo || photo.trim() === '') {
                const lower = (s.name || '').toLowerCase();
                for (const [key, p] of Object.entries(OFFICIAL_PHOTO_MAP)) {
                    if (lower.includes(key)) {
                        photo = p;
                        break;
                    }
                }
            }
            return {
                ...s,
                photo,
                session: s.session && s.session.trim() !== '' ? s.session.trim() : 'Special Keynote Speech',
                role: s.role && s.role.trim() !== '' ? s.role.trim() : 'Speaker / Panelist',
            };
        });
    }, [rawSpeakers]);

    // Extract unique sessions in preferred order
    const sessions = useMemo(() => {
        const order = ['Special Keynote Speech', 'CEO Forum', 'Special Session', 'Panel Discussion 1'];
        const unique = Array.from(new Set(speakers.map(s => s.session)));
        
        return unique.sort((a, b) => {
            const idxA = order.indexOf(a);
            const idxB = order.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [speakers]);

    // Group speakers by session
    const speakersBySession = useMemo(() => {
        const map = {};
        sessions.forEach(sess => { map[sess] = []; });
        speakers.forEach(sp => {
            if (!map[sp.session]) map[sp.session] = [];
            map[sp.session].push(sp);
        });
        return map;
    }, [speakers, sessions]);

    if (speakers.length === 0) return null;

    return (
        <Box
            id="speakers"
            sx={{
                py: { xs: 8, sm: 12 },
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #ffffff 0%, #f4fbf7 35%, #ebf8f2 70%, #ffffff 100%)',
            }}
        >
            {/* Ambient Background Aura */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: { xs: '100%', md: '900px' },
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(13, 148, 136, 0.03) 50%, transparent 75%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Section Header */}
                <ScrollReveal variant="fadeUp" duration={700}>
                    <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <Chip
                                icon={<CalendarMonthIcon sx={{ fontSize: '1rem !important', color: '#0d9488 !important' }} />}
                                label="CONFERENCE SESSIONS & KEYNOTES"
                                size="small"
                                sx={{
                                    bgcolor: 'rgba(13, 148, 136, 0.1)',
                                    color: '#0d9488',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.08em',
                                    border: '1px solid rgba(13, 148, 136, 0.25)',
                                    px: 0.5,
                                }}
                            />
                        </Box>

                        <Typography
                            component="h2"
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                color: '#0f172a',
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '2.9rem' },
                                letterSpacing: '-0.025em',
                                mb: 2,
                            }}
                        >
                            Distinguished Speakers & Forums
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: '#475569',
                                maxWidth: '720px',
                                mx: 'auto',
                                fontSize: { xs: '0.98rem', md: '1.08rem' },
                                lineHeight: 1.6,
                                mb: 3,
                            }}
                        >
                            {settings?.keynote_speakers_description ||
                                'Bringing together visionary policymakers, leading energy CEOs, and renowned geoscientists for transformative dialogues at the 55th PIT IAGI & GEOSEA XIX 2026.'}
                        </Typography>

                        {/* Action Bar: View Poster Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                                variant="outlined"
                                startIcon={<VisibilityIcon />}
                                onClick={() => setPosterOpen(true)}
                                sx={{
                                    borderColor: '#0d9488',
                                    color: '#0d9488',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    borderRadius: '30px',
                                    px: 2.8,
                                    py: 0.8,
                                    fontSize: '0.9rem',
                                    bgcolor: '#ffffff',
                                    boxShadow: '0 2px 8px rgba(13, 148, 136, 0.12)',
                                    '&:hover': {
                                        borderColor: '#0f766e',
                                        bgcolor: '#f0fdfa',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 16px rgba(13, 148, 136, 0.2)',
                                    },
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                Lihat Flyer Poster Resmi (DAY 1)
                            </Button>
                        </Box>
                    </Box>
                </ScrollReveal>

                {/* Session Filter Tabs */}
                {sessions.length > 1 && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: { xs: 'flex-start', sm: 'center' },
                            gap: 1,
                            overflowX: 'auto',
                            pb: 2,
                            mb: { xs: 4, md: 5 },
                            '&::-webkit-scrollbar': { height: 4 },
                            '&::-webkit-scrollbar-thumb': { bgcolor: '#99f6e4', borderRadius: 2 },
                        }}
                    >
                        <Chip
                            label={`Semua Sesi (${speakers.length})`}
                            clickable
                            onClick={() => setSelectedTab('all')}
                            sx={{
                                fontWeight: 700,
                                fontSize: '0.86rem',
                                px: 1,
                                height: 38,
                                borderRadius: '20px',
                                bgcolor: selectedTab === 'all' ? '#0d9488' : '#ffffff',
                                color: selectedTab === 'all' ? '#ffffff' : '#334155',
                                border: selectedTab === 'all' ? '1px solid #0d9488' : '1px solid #cbd5e1',
                                boxShadow: selectedTab === 'all' ? '0 4px 12px rgba(13, 148, 136, 0.3)' : 'none',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: selectedTab === 'all' ? '#0f766e' : '#f8fafc',
                                },
                            }}
                        />
                        {sessions.map(sessName => {
                            const count = speakersBySession[sessName]?.length || 0;
                            const isSelected = selectedTab === sessName;
                            const conf = SESSION_CONFIGS[sessName];
                            return (
                                <Chip
                                    key={sessName}
                                    label={`${conf?.badge || sessName} (${count})`}
                                    clickable
                                    onClick={() => setSelectedTab(sessName)}
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '0.86rem',
                                        px: 1,
                                        height: 38,
                                        borderRadius: '20px',
                                        bgcolor: isSelected ? (conf?.accentColor || '#0d9488') : '#ffffff',
                                        color: isSelected ? '#ffffff' : '#334155',
                                        border: isSelected ? `1px solid ${conf?.accentColor || '#0d9488'}` : '1px solid #cbd5e1',
                                        boxShadow: isSelected ? `0 4px 12px ${alpha(conf?.accentColor || '#0d9488', 0.35)}` : 'none',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: isSelected ? conf?.accentColor : '#f8fafc',
                                        },
                                    }}
                                />
                            );
                        })}
                    </Box>
                )}

                {/* Render Sessions */}
                {sessions
                    .filter(sessName => selectedTab === 'all' || selectedTab === sessName)
                    .map((sessName, sessIdx) => {
                        const sessSpeakers = speakersBySession[sessName] || [];
                        if (sessSpeakers.length === 0) return null;
                        const conf = SESSION_CONFIGS[sessName] || {
                            title: sessName.toUpperCase(),
                            badge: sessName,
                            theme: sessSpeakers[0]?.session_theme || '',
                            date: 'November 3, 2026',
                            accentColor: '#0d9488',
                            borderGradient: 'linear-gradient(90deg, #0d9488, #14b8a6, #0d9488)',
                            bgTint: 'rgba(13, 148, 136, 0.05)',
                        };

                        return (
                            <Box key={sessName} sx={{ mb: { xs: 6, md: 8 } }}>
                                {/* Forum / Session Header Banner */}
                                <ScrollReveal variant="fadeUp" duration={600}>
                                    <Box
                                        sx={{
                                            mb: 4,
                                            p: { xs: 2.5, sm: 3 },
                                            borderRadius: '16px',
                                            bgcolor: '#ffffff',
                                            border: `1px solid ${alpha(conf.accentColor, 0.25)}`,
                                            borderLeft: `6px solid ${conf.accentColor}`,
                                            boxShadow: `0 4px 20px ${alpha(conf.accentColor, 0.08)}`,
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                            <Typography
                                                variant="overline"
                                                sx={{
                                                    color: conf.accentColor,
                                                    fontWeight: 800,
                                                    letterSpacing: '0.12em',
                                                    fontSize: '0.85rem',
                                                    lineHeight: 1.2,
                                                }}
                                            >
                                                {conf.title}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: '#64748b',
                                                    fontWeight: 600,
                                                    bgcolor: '#f1f5f9',
                                                    px: 1.5,
                                                    py: 0.4,
                                                    borderRadius: '12px',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                }}
                                            >
                                                <CalendarMonthIcon sx={{ fontSize: 13, color: '#64748b' }} />
                                                {conf.date}
                                            </Typography>
                                        </Box>

                                        {conf.theme && (
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: '#0f172a',
                                                    fontSize: { xs: '1.05rem', sm: '1.25rem' },
                                                    lineHeight: 1.4,
                                                }}
                                            >
                                                {conf.theme}
                                            </Typography>
                                        )}
                                    </Box>
                                </ScrollReveal>

                                {/* Speakers Cards Grid for This Session */}
                                <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
                                    {sessSpeakers.map((speaker, sIndex) => {
                                        const roleBadge = getRoleBadge(speaker.role);
                                        const isSpecialKeynote = (speaker.session || '').toLowerCase().includes('special keynote');

                                        // Column sizing: 2 columns for Special Keynote VVIPs, 3-4 for Forums
                                        const colProps = isSpecialKeynote
                                            ? { xs: 12, sm: 6, md: 5, lg: 4 }
                                            : { xs: 12, sm: 6, md: 4, lg: 3 };

                                        return (
                                            <Grid item key={`${speaker.name}-${sIndex}`} {...colProps}>
                                                <ScrollReveal variant="fadeUp" delay={sIndex * 100} duration={700}>
                                                    <Box
                                                        sx={{
                                                            bgcolor: '#ffffff',
                                                            borderRadius: '20px',
                                                            border: `1px solid ${isSpecialKeynote ? '#fbbf24' : '#e2e8f0'}`,
                                                            boxShadow: isSpecialKeynote
                                                                ? '0 10px 30px rgba(245, 158, 11, 0.12)'
                                                                : '0 4px 20px rgba(0, 0, 0, 0.04)',
                                                            overflow: 'hidden',
                                                            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            height: '100%',
                                                            position: 'relative',
                                                            '&:hover': {
                                                                transform: 'translateY(-6px)',
                                                                boxShadow: `0 16px 36px ${alpha(conf.accentColor, 0.22)}`,
                                                                borderColor: conf.accentColor,
                                                                '& .speaker-photo': {
                                                                    transform: 'scale(1.04)',
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        {/* Photo Container */}
                                                        <Box
                                                            sx={{
                                                                position: 'relative',
                                                                aspectRatio: isSpecialKeynote ? '4/4.8' : '4/4.5',
                                                                bgcolor: '#0f172a',
                                                                overflow: 'hidden',
                                                            }}
                                                        >
                                                            {speaker.photo ? (
                                                                <Box
                                                                    className="speaker-photo"
                                                                    component="img"
                                                                    src={speaker.photo}
                                                                    alt={speaker.name}
                                                                    loading="lazy"
                                                                    sx={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover',
                                                                        objectPosition: 'top center',
                                                                        transition: 'transform 0.5s ease',
                                                                    }}
                                                                />
                                                            ) : (
                                                                /* Elegant Fallback Avatar */
                                                                <Box
                                                                    sx={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        background: 'linear-gradient(135deg, #094d42 0%, #0d9488 100%)',
                                                                        color: '#ffffff',
                                                                        p: 2,
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: '3rem',
                                                                            fontWeight: 800,
                                                                            letterSpacing: '0.05em',
                                                                            color: 'rgba(255, 255, 255, 0.9)',
                                                                        }}
                                                                    >
                                                                        {speaker.name
                                                                            ? speaker.name
                                                                                  .split(' ')
                                                                                  .filter(Boolean)
                                                                                  .slice(0, 2)
                                                                                  .map(n => n[0])
                                                                                  .join('')
                                                                            : 'SP'}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {/* Bottom Vignette Gradient */}
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    inset: 0,
                                                                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 35%, transparent 60%)',
                                                                    pointerEvents: 'none',
                                                                }}
                                                            />

                                                            {/* Role Badge Floating Top Right */}
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 12,
                                                                    right: 12,
                                                                    zIndex: 2,
                                                                }}
                                                            >
                                                                <Chip
                                                                    icon={roleBadge.icon}
                                                                    label={roleBadge.label}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: roleBadge.bgColor,
                                                                        color: roleBadge.color,
                                                                        border: roleBadge.border,
                                                                        fontWeight: 700,
                                                                        fontSize: '0.72rem',
                                                                        backdropFilter: 'blur(8px)',
                                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                                        '& .MuiChip-icon': {
                                                                            color: `${roleBadge.color} !important`,
                                                                        },
                                                                    }}
                                                                />
                                                            </Box>

                                                            {/* Name Overlay at the Bottom of Photo */}
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    bottom: 0,
                                                                    left: 0,
                                                                    right: 0,
                                                                    p: 2,
                                                                    zIndex: 2,
                                                                }}
                                                            >
                                                                <Typography
                                                                    component="h3"
                                                                    variant="h6"
                                                                    sx={{
                                                                        color: '#ffffff',
                                                                        fontWeight: 800,
                                                                        fontSize: isSpecialKeynote ? { xs: '1.15rem', md: '1.25rem' } : '1.05rem',
                                                                        lineHeight: 1.25,
                                                                        textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                                                                    }}
                                                                >
                                                                    {speaker.name}
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                        {/* Speaker Info Body */}
                                                        <Box sx={{ p: 2.2, display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                                                            <Box>
                                                                <Typography
                                                                    sx={{
                                                                        color: '#1e293b',
                                                                        fontWeight: 700,
                                                                        fontSize: '0.88rem',
                                                                        lineHeight: 1.4,
                                                                        mb: 0.8,
                                                                    }}
                                                                >
                                                                    {speaker.title}
                                                                </Typography>
                                                            </Box>

                                                            {speaker.institution && (
                                                                <Box sx={{ mt: 1 }}>
                                                                    <Chip
                                                                        label={speaker.institution}
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: '#f1f5f9',
                                                                            color: '#475569',
                                                                            fontWeight: 600,
                                                                            fontSize: '0.74rem',
                                                                            maxWidth: '100%',
                                                                            height: 'auto',
                                                                            py: 0.4,
                                                                            borderRadius: '8px',
                                                                            '& .MuiChip-label': {
                                                                                whiteSpace: 'normal',
                                                                                textAlign: 'left',
                                                                                px: 1,
                                                                            },
                                                                        }}
                                                                    />
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </ScrollReveal>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Box>
                        );
                    })}
            </Container>

            {/* Lightbox Dialog: Full Official Day 1 Flyer Poster */}
            <Dialog
                open={posterOpen}
                onClose={() => setPosterOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        overflow: 'hidden',
                        bgcolor: '#0f172a',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                    },
                }}
            >
                <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#1e293b', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CollectionsBookmarkIcon sx={{ color: '#10b981', fontSize: '1.2rem' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                            Flyer Resmi: DAY 1 — November 3, 2026
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            variant="contained"
                            size="small"
                            component="a"
                            href="/images/day1-poster.jpg"
                            download="DAY1_KEYNOTE_PIT_IAGI_GEOSEA_2026.jpg"
                            startIcon={<DownloadIcon />}
                            sx={{
                                bgcolor: '#0d9488',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                borderRadius: '16px',
                                '&:hover': { bgcolor: '#0f766e' },
                            }}
                        >
                            Download Flyer
                        </Button>
                        <IconButton onClick={() => setPosterOpen(false)} size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#fff' } }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
                <DialogContent sx={{ p: 0, textAlign: 'center', bgcolor: '#091512' }}>
                    <Box
                        component="img"
                        src="/images/day1-poster.jpg"
                        alt="PIT IAGI & GEOSEA XIX 2026 Day 1 Keynote Speakers and Forums"
                        sx={{
                            width: '100%',
                            maxHeight: '85vh',
                            objectFit: 'contain',
                            display: 'block',
                            mx: 'auto',
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}
