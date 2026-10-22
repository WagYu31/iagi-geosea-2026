import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MicIcon from '@mui/icons-material/Mic';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScrollReveal from './ScrollReveal';

// Official Day 1 Presets (15 speakers)
const DAY1_DEFAULT_SPEAKERS = [
    {
        name: 'Yuliot Tanjung*',
        title: 'Wakil Menteri Energi dan Sumber Daya Mineral',
        institution: 'Kementerian ESDM',
        session: 'Special Keynote Speech',
        role: 'Special Keynote',
        day: 'Day 1',
        photo: '/images/speakers/yuliot-tanjung.webp',
    },
    {
        name: 'Sri Sultan Hamengkubuwana X*',
        title: 'Gubernur Daerah Istimewa Yogyakarta',
        institution: 'Pemda D.I. Yogyakarta',
        session: 'Special Keynote Speech',
        role: 'Special Keynote',
        day: 'Day 1',
        photo: '/images/speakers/sri-sultan-hb-x.webp',
    },
    {
        name: 'STJ Budi Santoso',
        title: 'Chairman of IAGI',
        institution: 'Ikatan Ahli Geologi Indonesia (IAGI)',
        session: 'CEO Forum',
        role: 'Moderator',
        day: 'Day 1',
        photo: '/images/speakers/stj-budi-santoso.webp',
    },
    {
        name: 'Maroef Sjamsoeddin',
        title: 'President Director MIND ID',
        institution: 'MIND ID',
        session: 'CEO Forum',
        role: 'Speaker / Panelist',
        day: 'Day 1',
        photo: '/images/speakers/maroef-sjamsoeddin.webp',
    },
    {
        name: 'Asep Samsul Arifin',
        title: 'Exploration Director PT Pertamina Hulu Energi (PHE)',
        institution: 'PT Pertamina Hulu Energi (PHE)',
        session: 'CEO Forum',
        role: 'Speaker / Panelist',
        day: 'Day 1',
        photo: '',
    },
    {
        name: 'Ir. Yudistian Yunis, M.Eng.',
        title: 'President Director PT Geo Dipa Energi',
        institution: 'PT Geo Dipa Energi',
        session: 'CEO Forum',
        role: 'Speaker / Panelist',
        day: 'Day 1',
        photo: '/images/speakers/yudistian-yunis.webp',
    },
    {
        name: 'Rikky Rahmat Firdaus*',
        title: 'Deputy for Exploration, Development and Working Area Management',
        institution: 'SKK Migas',
        session: 'Special Session',
        role: 'Keynote Speaker',
        day: 'Day 1',
        photo: '',
    },
    {
        name: 'Dr. N. Alit Ascaria, PhD',
        title: 'Geology Agency',
        institution: 'Badan Geologi Kementerian ESDM',
        session: 'Special Session',
        role: 'Moderator',
        day: 'Day 1',
        photo: '',
    },
    {
        name: 'Feriyanto',
        title: 'Exploration Leadership',
        institution: 'MedcoEnergi',
        session: 'Special Session',
        role: 'Speaker / Panelist',
        day: 'Day 1',
        photo: '',
    },
    {
        name: 'Resky Yustiawan',
        title: 'Exploration Executive',
        institution: 'PT Energi Mega Persada Tbk',
        session: 'Special Session',
        role: 'Speaker / Panelist',
        day: 'Day 1',
        photo: '',
    },
    {
        name: 'Bayu Giriansyah',
        title: 'Exploration Manager',
        institution: 'Pertamina Hulu Energi',
        session: 'Special Session',
        role: 'Speaker / Panelist',
        day: 'Day 1',
        photo: '',
    },
    {
        name: 'Dr.mont. Ir. Andy Yahya Al Hakim, S.T., M.T.',
        title: 'Secretary General MGEI',
        institution: 'MGEI',
        session: 'Panel Discussion 1',
        role: 'Moderator',
        day: 'Day 1',
        photo: '',
    },
    {
        name: 'Dr. Asep Kurnia Permana',
        title: 'Direktur Pembinaan Pengusahaan Batubara',
        institution: 'Ditjen Minerba ESDM',
        session: 'Panel Discussion 1',
        role: 'Speaker / Panelist',
        day: 'Day 1',
        photo: '',
    },
    {
        name: 'Ivan Crabb',
        title: 'VP Exploration & Exploitation',
        institution: 'Mubadala Energy',
        session: 'Panel Discussion 1',
        role: 'Speaker / Panelist',
        day: 'Day 1',
        photo: '',
    },
    {
        name: 'Ahmad Yani',
        title: 'CEO PT PGE',
        institution: 'PT Pertamina Geothermal Energy Tbk',
        session: 'Panel Discussion 1',
        role: 'Speaker / Panelist',
        day: 'Day 1',
        photo: '',
    },
];

// Official Day 2 Presets (10 speakers)
const DAY2_DEFAULT_SPEAKERS = [
    {
        name: 'Prof. Ir. Mega Fatimah Rosana, M.Sc., Ph.D.',
        title: 'Professor of Exploration Geology, UNPAD',
        institution: 'Universitas Padjadjaran (UNPAD)',
        session: 'Panel Discussion 2',
        role: 'Moderator',
        day: 'Day 2',
        photo: '',
    },
    {
        name: 'Dr. Ir. Carolus Prasetyadi, M.Sc.',
        title: 'Geopark Expert / Lead',
        institution: 'Geopark Yogyakarta',
        session: 'Panel Discussion 2',
        role: 'Speaker / Panelist',
        day: 'Day 2',
        photo: '',
    },
    {
        name: 'Narongrit Thungprue',
        title: 'Expert UGGp Satun (Thailand)',
        institution: 'UNESCO Global Geopark Satun',
        session: 'Panel Discussion 2',
        role: 'Speaker / Panelist',
        day: 'Day 2',
        photo: '',
    },
    {
        name: 'Leo T. Virtucio',
        title: 'Vice-Chairperson National Geopark Committee',
        institution: 'National Geopark Committee (Philippines)',
        session: 'Panel Discussion 2',
        role: 'Speaker / Panelist',
        day: 'Day 2',
        photo: '',
    },
    {
        name: 'Dr. Priatin Hadi Wijaya, S.T., M.T.*',
        title: 'Director of Geothermal',
        institution: 'Ditjen EBTKE Kementerian ESDM',
        session: 'Special Session',
        role: 'Keynote Speaker',
        day: 'Day 2',
        photo: '',
    },
    {
        name: 'Dr. Lana Saria, S.Si., M.Si.',
        title: 'Head of Badan Geologi',
        institution: 'Badan Geologi Kementerian ESDM',
        session: 'Panel Discussion 3',
        role: 'Keynote Speaker',
        day: 'Day 2',
        photo: '',
    },
    {
        name: 'Prof Dr. Ir. Eko Teguh Paripurno, M.T',
        title: 'Center of Disaster Management Studies UPNVY',
        institution: 'UPN "Veteran" Yogyakarta',
        session: 'Panel Discussion 3',
        role: 'Moderator',
        day: 'Day 2',
        photo: '',
    },
    {
        name: 'Dr. Nelly Florida Riama, M.Si.',
        title: 'Deputy for Geophysics BMKG',
        institution: 'BMKG',
        session: 'Panel Discussion 3',
        role: 'Speaker / Panelist',
        day: 'Day 2',
        photo: '',
    },
    {
        name: 'Noer Isrodin Muchlisin',
        title: 'Direktur Kesiapsiagaan BASARNAS',
        institution: 'BASARNAS',
        session: 'Panel Discussion 3',
        role: 'Speaker / Panelist',
        day: 'Day 2',
        photo: '',
    },
    {
        name: 'Prof. Dr. Eng. IR. Wahyu Wilopo, S.T., M.Eng., IPM',
        title: 'Geotechnical and Disaster Expert UGM',
        institution: 'Universitas Gadjah Mada (UGM)',
        session: 'Panel Discussion 3',
        role: 'Speaker / Panelist',
        day: 'Day 2',
        photo: '',
    },
];

const ALL_PRESET_SPEAKERS = [...DAY1_DEFAULT_SPEAKERS, ...DAY2_DEFAULT_SPEAKERS];

const OFFICIAL_PHOTO_MAP = {
    'yuliot': '/images/speakers/yuliot-tanjung.webp',
    'sultan': '/images/speakers/sri-sultan-hb-x.webp',
    'hamengkubuwana': '/images/speakers/sri-sultan-hb-x.webp',
    'budi santoso': '/images/speakers/stj-budi-santoso.webp',
    'maroef': '/images/speakers/maroef-sjamsoeddin.webp',
    'yudistian': '/images/speakers/yudistian-yunis.webp',
};

// Ultra-fast progressive image component with smooth fade-in and shimmer
function SpeakerCardImage({ src, alt, isCenter }) {
    const [loaded, setLoaded] = useState(false);
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
        setLoaded(false);
    }, [src]);

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', bgcolor: '#0b1320' }}>
            {/* Shimmer skeleton while loading */}
            {!loaded && (
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'speakerShimmer 1.6s infinite',
                        '@keyframes speakerShimmer': {
                            '0%': { backgroundPosition: '200% 0' },
                            '100%': { backgroundPosition: '-200% 0' },
                        },
                    }}
                />
            )}
            <Box
                component="img"
                src={imgSrc}
                alt={alt}
                decoding="async"
                loading={isCenter ? 'eager' : 'lazy'}
                onLoad={() => setLoaded(true)}
                onError={() => {
                    if (imgSrc && imgSrc.endsWith('.webp')) {
                        setImgSrc(imgSrc.replace('.webp', '.jpg'));
                    }
                }}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    display: 'block',
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? 'scale(1)' : 'scale(1.04)',
                    transition: 'opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            />
        </Box>
    );
}

// Helper for speaker role badges
function getRoleBadge(role) {
    const r = (role || '').toLowerCase();
    if (r.includes('keynote')) {
        return {
            label: role || 'Keynote Speaker',
            icon: <WorkspacePremiumIcon sx={{ fontSize: 13 }} />,
            color: '#d97706',
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
        color: '#059669',
        bgColor: 'rgba(209, 250, 229, 0.95)',
        border: '1px solid #6ee7b7',
    };
}

export default function Testimonials({ settings }) {
    const [selectedDay, setSelectedDay] = useState('Day 1');
    const [selectedTab, setSelectedTab] = useState('all');
    const [activeIndex, setActiveIndex] = useState(0);
    const [posterOpen, setPosterOpen] = useState(false);
    const [posterModalDay, setPosterModalDay] = useState('Day 1');
    const [posterLoaded, setPosterLoaded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragDistance, setDragDistance] = useState(0);

    // Merge incoming settings with defaults
    const rawSpeakers = (settings?.keynote_speakers && settings.keynote_speakers.length > 0)
        ? settings.keynote_speakers.filter(s => s.name && s.name.trim() !== '')
        : [];

    const allSpeakers = useMemo(() => {
        let list = [];
        if (rawSpeakers.length === 0) {
            list = [...ALL_PRESET_SPEAKERS];
        } else {
            // Check if rawSpeakers has any Day 1 and Day 2 items
            const hasExplicitDay2 = rawSpeakers.some(s => {
                const day = (s.day || '').trim();
                const sess = (s.session || '').toLowerCase();
                return day === 'Day 2' || sess.includes('panel discussion 2') || sess.includes('panel discussion 3') || sess.includes('geothermal') || sess.includes('geopark') || sess.includes('geohazard');
            });
            const hasExplicitDay1 = rawSpeakers.some(s => {
                const day = (s.day || '').trim();
                const sess = (s.session || '').toLowerCase();
                return day === 'Day 1' || sess.includes('ceo') || sess.includes('keynote') || sess.includes('panel discussion 1');
            });

            list = [...rawSpeakers];
            // If database only has Day 1 (which happened because only Day 1 was saved previously), auto-append default Day 2 so Day 2 is never empty!
            if (!hasExplicitDay2) {
                list = [...list, ...DAY2_DEFAULT_SPEAKERS];
            }
            // In case database only has Day 2, auto-append default Day 1
            if (!hasExplicitDay1) {
                list = [...DAY1_DEFAULT_SPEAKERS, ...list];
            }
        }

        return list.map((s, idx) => {
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

            // Detect Day if not explicitly defined
            let day = s.day;
            if (!day) {
                const session = (s.session || '').toLowerCase();
                if (session.includes('panel discussion 2') || session.includes('panel discussion 3') || session.includes('geothermal') || session.includes('geopark') || session.includes('geohazard')) {
                    day = 'Day 2';
                } else {
                    day = 'Day 1';
                }
            }

            return {
                ...s,
                photo,
                day,
                session: s.session && s.session.trim() !== '' ? s.session.trim() : (day === 'Day 2' ? 'Panel Discussion 2' : 'Special Keynote Speech'),
                role: s.role && s.role.trim() !== '' ? s.role.trim() : 'Speaker / Panelist',
                originalIndex: idx,
            };
        });
    }, [rawSpeakers]);

    // Speakers for selected Day
    const daySpeakers = useMemo(() => {
        return allSpeakers.filter(s => s.day === selectedDay);
    }, [allSpeakers, selectedDay]);

    // Unique Sessions for the currently selected Day
    const sessions = useMemo(() => {
        const order = [
            'Special Keynote Speech',
            'CEO Forum',
            'Special Session',
            'Panel Discussion 1',
            'Panel Discussion 2',
            'Panel Discussion 3',
        ];
        const unique = Array.from(new Set(daySpeakers.map(s => s.session)));
        return unique.sort((a, b) => {
            const idxA = order.indexOf(a);
            const idxB = order.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [daySpeakers]);

    // Filtered Speakers (by Day + Session)
    const filteredSpeakers = useMemo(() => {
        if (selectedTab === 'all') return daySpeakers;
        return daySpeakers.filter(s => s.session === selectedTab);
    }, [daySpeakers, selectedTab]);

    // Reset carousel index when Day or Session tab changes
    const handleDayChange = (newDay) => {
        setSelectedDay(newDay);
        setSelectedTab('all');
        setActiveIndex(0);
    };

    useEffect(() => {
        setActiveIndex(0);
    }, [selectedTab]);

    // Clamped active speaker
    const safeActiveIndex = Math.min(Math.max(activeIndex, 0), Math.max(filteredSpeakers.length - 1, 0));
    const activeSpeaker = filteredSpeakers[safeActiveIndex] || filteredSpeakers[0] || {};

    // Navigation Handlers
    const handlePrev = useCallback(() => {
        setActiveIndex(prev => (prev > 0 ? prev - 1 : filteredSpeakers.length - 1));
    }, [filteredSpeakers.length]);

    const handleNext = useCallback(() => {
        setActiveIndex(prev => (prev < filteredSpeakers.length - 1 ? prev + 1 : 0));
    }, [filteredSpeakers.length]);

    // Keyboard Arrow Keys
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePrev, handleNext]);

    // Drag / Swipe Handlers
    const handleTouchStart = (e) => {
        setIsDragging(true);
        setDragStartX(e.touches ? e.touches[0].clientX : e.clientX);
        setDragDistance(0);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const currentX = e.touches ? e.touches[0].clientX : e.clientX;
        setDragDistance(currentX - dragStartX);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        if (dragDistance > 50) {
            handlePrev();
        } else if (dragDistance < -50) {
            handleNext();
        }
        setDragDistance(0);
    };

    if (allSpeakers.length === 0) return null;

    const day1Total = allSpeakers.filter(s => s.day === 'Day 1').length;
    const day2Total = allSpeakers.filter(s => s.day === 'Day 2').length;

    return (
        <Box
            id="speakers"
            sx={{
                py: { xs: 8, md: 12 },
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #fdfdfd 0%, #f7fbf9 50%, #f0f8f4 100%)',
                userSelect: 'none',
            }}
        >
            {/* Soft Ambient Radial Glow Under Carousel */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -35%)',
                    width: { xs: '100%', md: '1000px' },
                    height: '520px',
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse at center, rgba(13, 148, 136, 0.09) 0%, rgba(16, 185, 129, 0.03) 50%, transparent 75%)',
                    filter: 'blur(50px)',
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Header Section */}
                <ScrollReveal variant="fadeUp" duration={700}>
                    <Box sx={{ mb: { xs: 3, md: 4 }, textAlign: 'center' }}>
                        {/* Day 1 & Day 2 Switcher Toggle */}
                        <Box sx={{ display: 'inline-flex', p: 0.6, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '35px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', mb: 3 }}>
                            <Button
                                onClick={() => handleDayChange('Day 1')}
                                sx={{
                                    borderRadius: '30px',
                                    px: { xs: 2.2, sm: 3.2 },
                                    py: 0.9,
                                    fontSize: { xs: '0.82rem', sm: '0.92rem' },
                                    fontWeight: 800,
                                    textTransform: 'none',
                                    bgcolor: selectedDay === 'Day 1' ? '#0d9488' : 'transparent',
                                    color: selectedDay === 'Day 1' ? '#ffffff' : '#64748b',
                                    boxShadow: selectedDay === 'Day 1' ? '0 4px 14px rgba(13, 148, 136, 0.35)' : 'none',
                                    '&:hover': {
                                        bgcolor: selectedDay === 'Day 1' ? '#0f766e' : '#f1f5f9',
                                    },
                                    transition: 'all 0.25s ease',
                                }}
                            >
                                📅 DAY 1 — 3 Nov 2026 ({day1Total})
                            </Button>
                            <Button
                                onClick={() => handleDayChange('Day 2')}
                                sx={{
                                    borderRadius: '30px',
                                    px: { xs: 2.2, sm: 3.2 },
                                    py: 0.9,
                                    fontSize: { xs: '0.82rem', sm: '0.92rem' },
                                    fontWeight: 800,
                                    textTransform: 'none',
                                    bgcolor: selectedDay === 'Day 2' ? '#0d9488' : 'transparent',
                                    color: selectedDay === 'Day 2' ? '#ffffff' : '#64748b',
                                    boxShadow: selectedDay === 'Day 2' ? '0 4px 14px rgba(13, 148, 136, 0.35)' : 'none',
                                    '&:hover': {
                                        bgcolor: selectedDay === 'Day 2' ? '#0f766e' : '#f1f5f9',
                                    },
                                    transition: 'all 0.25s ease',
                                }}
                            >
                                📅 DAY 2 — 4 Nov 2026 ({day2Total})
                            </Button>
                        </Box>

                        <Typography
                            variant="overline"
                            sx={{
                                color: '#0d9488',
                                fontWeight: 800,
                                letterSpacing: '0.22em',
                                fontSize: '0.8rem',
                                display: 'block',
                                mb: 1,
                            }}
                        >
                            — THE SPOTLIGHT COLLECTION • {selectedDay.toUpperCase()} —
                        </Typography>

                        <Typography
                            component="h2"
                            variant="h2"
                            sx={{
                                fontFamily: '"Playfair Display", Georgia, serif',
                                fontWeight: 700,
                                color: '#0f172a',
                                fontSize: { xs: '2rem', sm: '2.8rem', md: '3.3rem' },
                                letterSpacing: '-0.02em',
                                lineHeight: 1.15,
                                mb: 2,
                            }}
                        >
                            Distinguished speakers, <br />
                            <Box component="span" sx={{ fontStyle: 'italic', color: '#0d9488' }}>
                                framed in prestige
                            </Box>
                        </Typography>

                        {/* Session Filter Tabs for the Active Day */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                gap: 1,
                                mt: 2.5,
                            }}
                        >
                            <Chip
                                label={`Semua Sesi (${daySpeakers.length})`}
                                clickable
                                onClick={() => setSelectedTab('all')}
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    height: 36,
                                    borderRadius: '20px',
                                    bgcolor: selectedTab === 'all' ? '#0d9488' : '#ffffff',
                                    color: selectedTab === 'all' ? '#ffffff' : '#334155',
                                    border: selectedTab === 'all' ? '1px solid #0d9488' : '1px solid #e2e8f0',
                                    boxShadow: selectedTab === 'all' ? '0 4px 14px rgba(13, 148, 136, 0.28)' : '0 2px 6px rgba(0,0,0,0.03)',
                                    transition: 'all 0.25s ease',
                                    '&:hover': { bgcolor: selectedTab === 'all' ? '#0f766e' : '#f8fafc' },
                                }}
                            />
                            {sessions.map(sessName => {
                                const count = daySpeakers.filter(s => s.session === sessName).length;
                                const isSelected = selectedTab === sessName;
                                const shortName = sessName === 'Special Keynote Speech' ? 'Special Keynote' : sessName;
                                return (
                                    <Chip
                                        key={sessName}
                                        label={`${shortName} (${count})`}
                                        clickable
                                        onClick={() => setSelectedTab(sessName)}
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '0.82rem',
                                            height: 36,
                                            borderRadius: '20px',
                                            bgcolor: isSelected ? '#0d9488' : '#ffffff',
                                            color: isSelected ? '#ffffff' : '#334155',
                                            border: isSelected ? '1px solid #0d9488' : '1px solid #e2e8f0',
                                            boxShadow: isSelected ? '0 4px 14px rgba(13, 148, 136, 0.28)' : '0 2px 6px rgba(0,0,0,0.03)',
                                            transition: 'all 0.25s ease',
                                            '&:hover': { bgcolor: isSelected ? '#0f766e' : '#f8fafc' },
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    </Box>
                </ScrollReveal>

                {filteredSpeakers.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8, my: 4, bgcolor: '#ffffff', borderRadius: '24px', border: '1px dashed #cbd5e1', maxWidth: 500, mx: 'auto', p: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <Typography sx={{ color: '#475569', fontSize: '1.05rem', mb: 2, fontWeight: 700 }}>
                            Belum ada pembicara untuk kategori sesi ini di {selectedDay}.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => setSelectedTab('all')}
                            sx={{ bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' }, textTransform: 'none', fontWeight: 700, borderRadius: '20px', px: 3 }}
                        >
                            Lihat Semua Pembicara {selectedDay}
                        </Button>
                    </Box>
                ) : (
                    <>
                        {/* 3D Coverflow Stage Area */}
                        <Box
                            onMouseDown={handleTouchStart}
                            onMouseMove={handleTouchMove}
                            onMouseUp={handleTouchEnd}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                    sx={{
                        position: 'relative',
                        height: { xs: '320px', sm: '380px', md: '430px' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        perspective: '1200px',
                        transformStyle: 'preserve-3d',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        my: { xs: 2, md: 3 },
                    }}
                >
                    {/* Giant Faint Watermark Number Behind Cards */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '46%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: { xs: '9rem', sm: '15rem', md: '21rem' },
                            fontWeight: 900,
                            fontFamily: '"Playfair Display", Georgia, serif',
                            color: 'rgba(15, 23, 42, 0.038)',
                            lineHeight: 1,
                            userSelect: 'none',
                            pointerEvents: 'none',
                            zIndex: 0,
                            letterSpacing: '-0.04em',
                            transition: 'all 0.4s ease',
                        }}
                    >
                        {String(safeActiveIndex + 1).padStart(2, '0')}
                    </Box>

                    {/* Cards Container */}
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {filteredSpeakers.map((speaker, index) => {
                            const offset = index - safeActiveIndex;
                            const absOffset = Math.abs(offset);
                            const isCenter = offset === 0;

                            // Skip rendering cards too far off screen
                            if (absOffset > 3) return null;

                            // 3D positioning calculations
                            const stepX = typeof window !== 'undefined' && window.innerWidth < 600 ? 95 : (typeof window !== 'undefined' && window.innerWidth < 960 ? 140 : 185);
                            const translateX = offset * stepX + (isDragging ? dragDistance * 0.4 : 0);
                            const translateZ = -absOffset * (absOffset === 1 ? 90 : 160);
                            const rotateY = -Math.sign(offset) * Math.min(absOffset * 22, 40);
                            const scale = isCenter ? 1.05 : Math.max(1 - absOffset * 0.13, 0.68);
                            const opacity = isCenter ? 1 : Math.max(0.92 - absOffset * 0.22, 0.35);
                            const zIndex = 30 - absOffset * 6;
                            const roleBadge = getRoleBadge(speaker.role);

                            return (
                                <Box
                                    key={`${speaker.name}-${index}`}
                                    sx={{
                                        position: 'absolute',
                                        width: { xs: 170, sm: 220, md: 250 },
                                        height: { xs: 240, sm: 310, md: 350 },
                                        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                                        opacity,
                                        zIndex,
                                        transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
                                    }}
                                >
                                    {/* Ambient Aura for Active Center Card */}
                                    {isCenter && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                inset: -6,
                                                borderRadius: '28px',
                                                background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.7) 0%, rgba(16, 185, 129, 0.4) 50%, rgba(245, 158, 11, 0.5) 100%)',
                                                filter: 'blur(16px)',
                                                zIndex: -1,
                                                pointerEvents: 'none',
                                                animation: 'auraPulse 3.5s ease-in-out infinite',
                                                '@keyframes auraPulse': {
                                                    '0%, 100%': { opacity: 0.65, transform: 'scale(0.98)' },
                                                    '50%': { opacity: 1, transform: 'scale(1.03)' },
                                                },
                                            }}
                                        />
                                    )}

                                    {/* The Card Surface */}
                                    <Box
                                        onClick={() => {
                                            if (!isCenter) setActiveIndex(index);
                                        }}
                                        sx={{
                                            position: 'relative',
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '22px',
                                            overflow: 'hidden',
                                            bgcolor: '#0f172a',
                                            border: isCenter ? '2px solid rgba(45, 212, 191, 0.95)' : '1px solid rgba(255, 255, 255, 0.7)',
                                            boxShadow: isCenter
                                                ? '0 25px 50px -12px rgba(13, 148, 136, 0.4), 0 12px 24px -8px rgba(0, 0, 0, 0.25)'
                                                : '0 10px 24px -6px rgba(0, 0, 0, 0.16)',
                                            filter: isCenter ? 'none' : `brightness(${Math.max(1 - absOffset * 0.12, 0.65)})`,
                                            cursor: isCenter ? 'default' : 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: isCenter
                                                    ? '0 32px 64px -12px rgba(13, 148, 136, 0.5)'
                                                    : '0 16px 36px -6px rgba(0, 0, 0, 0.25)',
                                            },
                                        }}
                                    >
                                        {/* Photo with progressive webp and fade-in, or Initials Fallback */}
                                        {speaker.photo ? (
                                            <SpeakerCardImage
                                                src={speaker.photo}
                                                alt={speaker.name}
                                                isCenter={isCenter}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: 'linear-gradient(135deg, #094d42 0%, #0d9488 100%)',
                                                    color: '#ffffff',
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: { xs: '2.5rem', md: '3.2rem' },
                                                        fontWeight: 800,
                                                        letterSpacing: '0.05em',
                                                        color: 'rgba(255, 255, 255, 0.9)',
                                                        fontFamily: '"Playfair Display", serif',
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

                                        {/* Number Top-Left */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                left: 12,
                                                zIndex: 2,
                                                bgcolor: 'rgba(15, 23, 42, 0.65)',
                                                backdropFilter: 'blur(6px)',
                                                px: 1,
                                                py: 0.2,
                                                borderRadius: '8px',
                                            }}
                                        >
                                            <Typography sx={{ color: '#ffffff', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                                                {String(index + 1).padStart(2, '0')}
                                            </Typography>
                                        </Box>

                                        {/* Role Badge Top-Right */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
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
                                                    fontSize: '0.66rem',
                                                    height: 22,
                                                    backdropFilter: 'blur(8px)',
                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                                    '& .MuiChip-icon': {
                                                        color: `${roleBadge.color} !important`,
                                                    },
                                                }}
                                            />
                                        </Box>

                                        {/* Gradient Vignette at Bottom */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.4) 40%, transparent 68%)',
                                                pointerEvents: 'none',
                                            }}
                                        />

                                        {/* Name at Card Bottom */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                p: 1.8,
                                                zIndex: 2,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: '#ffffff',
                                                    fontWeight: 800,
                                                    fontSize: { xs: '0.92rem', md: '1.05rem' },
                                                    lineHeight: 1.25,
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.7)',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {speaker.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* Bottom Controls & Active Speaker Details */}
                <Box sx={{ mt: { xs: 4, md: 5 }, maxWidth: '850px', mx: 'auto' }}>
                    {/* Micro-hint */}
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            textAlign: 'center',
                            color: '#94a3b8',
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            fontSize: '0.72rem',
                            mb: 2.5,
                        }}
                    >
                        DRAG • SWIPE • ARROW KEYS
                    </Typography>

                    {/* Active Speaker Detail Bar */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                            gap: 2,
                            p: { xs: 2.5, sm: 3 },
                            borderRadius: '24px',
                            bgcolor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
                        }}
                    >
                        {/* Left Counter */}
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, minWidth: { sm: 90 } }}>
                            <Typography
                                key={safeActiveIndex}
                                sx={{
                                    fontFamily: '"Playfair Display", Georgia, serif',
                                    fontSize: { xs: '2rem', md: '2.4rem' },
                                    fontWeight: 800,
                                    color: '#0f172a',
                                    lineHeight: 1,
                                    animation: 'counterPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    '@keyframes counterPop': {
                                        '0%': { opacity: 0, transform: 'scale(0.82)' },
                                        '100%': { opacity: 1, transform: 'scale(1)' },
                                    },
                                }}
                            >
                                {String(safeActiveIndex + 1).padStart(2, '0')}
                            </Typography>
                            <Typography sx={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 700 }}>
                                / {String(filteredSpeakers.length).padStart(2, '0')}
                            </Typography>
                        </Box>

                        {/* Center Speaker Typography */}
                        {/* Center Speaker Typography with Choreographed Slide */}
                        <Box
                            key={`${activeSpeaker.name}-${safeActiveIndex}`}
                            sx={{
                                flex: 1,
                                textAlign: 'center',
                                px: { xs: 1, sm: 2 },
                                animation: 'speakerSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                                '@keyframes speakerSlideUp': {
                                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                                    '100%': { opacity: 1, transform: 'translateY(0)' },
                                },
                            }}
                        >
                            <Typography
                                component="h3"
                                sx={{
                                    fontFamily: '"Playfair Display", Georgia, serif',
                                    fontWeight: 800,
                                    color: '#0f172a',
                                    fontSize: { xs: '1.25rem', sm: '1.6rem', md: '1.85rem' },
                                    lineHeight: 1.25,
                                    mb: 0.6,
                                }}
                            >
                                {activeSpeaker.name}
                            </Typography>

                            <Typography
                                sx={{
                                    color: '#0d9488',
                                    fontWeight: 700,
                                    fontSize: { xs: '0.82rem', md: '0.92rem' },
                                    mb: 0.4,
                                }}
                            >
                                {activeSpeaker.role} • {activeSpeaker.session}
                            </Typography>

                            <Typography
                                sx={{
                                    color: '#64748b',
                                    fontSize: { xs: '0.8rem', md: '0.88rem' },
                                    maxWidth: 520,
                                    mx: 'auto',
                                    lineHeight: 1.45,
                                }}
                            >
                                {activeSpeaker.title}
                                {activeSpeaker.institution ? ` — ${activeSpeaker.institution}` : ''}
                            </Typography>

                            {/* Capsule Dots Pagination with smooth stretching */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.7, mt: 2 }}>
                                {filteredSpeakers.map((_, idx) => (
                                    <Box
                                        key={idx}
                                        onClick={() => setActiveIndex(idx)}
                                        sx={{
                                            cursor: 'pointer',
                                            height: 6,
                                            width: safeActiveIndex === idx ? 28 : 6,
                                            borderRadius: 3,
                                            bgcolor: safeActiveIndex === idx ? '#0d9488' : '#cbd5e1',
                                            background: safeActiveIndex === idx ? 'linear-gradient(90deg, #0d9488 0%, #10b981 100%)' : '#cbd5e1',
                                            boxShadow: safeActiveIndex === idx ? '0 2px 8px rgba(13, 148, 136, 0.45)' : 'none',
                                            transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                            '&:hover': {
                                                bgcolor: safeActiveIndex === idx ? '#0f766e' : '#94a3b8',
                                                transform: 'scale(1.2)',
                                            },
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        {/* Right Navigation Arrows */}
                        <Box sx={{ display: 'flex', gap: 1, minWidth: { sm: 90 }, justifyContent: 'flex-end' }}>
                            <IconButton
                                onClick={handlePrev}
                                aria-label="Previous speaker"
                                sx={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: '50%',
                                    bgcolor: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    color: '#1e293b',
                                    '&:hover': {
                                        bgcolor: '#f8fafc',
                                        transform: 'translateX(-2px)',
                                        borderColor: '#0d9488',
                                        color: '#0d9488',
                                    },
                                    transition: 'all 0.2s',
                                }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                            <IconButton
                                onClick={handleNext}
                                aria-label="Next speaker"
                                sx={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: '50%',
                                    bgcolor: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    color: '#1e293b',
                                    '&:hover': {
                                        bgcolor: '#f8fafc',
                                        transform: 'translateX(2px)',
                                        borderColor: '#0d9488',
                                        color: '#0d9488',
                                    },
                                    transition: 'all 0.2s',
                                }}
                            >
                                <ChevronRightIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
                </>
            )}

                {/* View Official Flyer Action */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap', mt: 4 }}>
                    <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => {
                            setPosterModalDay('Day 1');
                            setPosterLoaded(false);
                            setPosterOpen(true);
                        }}
                        sx={{
                            borderColor: '#0d9488',
                            color: '#0d9488',
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: '30px',
                            px: 2.5,
                            py: 0.8,
                            fontSize: '0.85rem',
                            bgcolor: '#ffffff',
                            boxShadow: '0 2px 8px rgba(13, 148, 136, 0.08)',
                            '&:hover': {
                                borderColor: '#0f766e',
                                bgcolor: '#f0fdfa',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(13, 148, 136, 0.16)',
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Lihat Flyer Poster (DAY 1)
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => {
                            setPosterModalDay('Day 2');
                            setPosterLoaded(false);
                            setPosterOpen(true);
                        }}
                        sx={{
                            borderColor: '#0d9488',
                            color: '#0d9488',
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: '30px',
                            px: 2.5,
                            py: 0.8,
                            fontSize: '0.85rem',
                            bgcolor: '#ffffff',
                            boxShadow: '0 2px 8px rgba(13, 148, 136, 0.08)',
                            '&:hover': {
                                borderColor: '#0f766e',
                                bgcolor: '#f0fdfa',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(13, 148, 136, 0.16)',
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Lihat Flyer Poster (DAY 2)
                    </Button>
                </Box>
            </Container>

            {/* Lightbox Dialog: Full Official Day 1 / Day 2 Flyer Poster */}
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
                <Box
                    sx={{
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: '#1e293b',
                        color: '#fff',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CollectionsBookmarkIcon sx={{ color: '#10b981', fontSize: '1.2rem' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                            Flyer Resmi: {posterModalDay === 'Day 1' ? 'DAY 1 — 3 Nov 2026' : 'DAY 2 — 4 Nov 2026'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Switch Day buttons inside modal */}
                        <Button
                            size="small"
                            variant={posterModalDay === 'Day 1' ? 'contained' : 'outlined'}
                            onClick={() => {
                                setPosterModalDay('Day 1');
                                setPosterLoaded(false);
                            }}
                            sx={{
                                fontSize: '0.72rem',
                                py: 0.3,
                                px: 1.2,
                                bgcolor: posterModalDay === 'Day 1' ? '#0d9488' : 'transparent',
                                borderColor: '#0d9488',
                                color: '#ffffff',
                            }}
                        >
                            Day 1
                        </Button>
                        <Button
                            size="small"
                            variant={posterModalDay === 'Day 2' ? 'contained' : 'outlined'}
                            onClick={() => {
                                setPosterModalDay('Day 2');
                                setPosterLoaded(false);
                            }}
                            sx={{
                                fontSize: '0.72rem',
                                py: 0.3,
                                px: 1.2,
                                bgcolor: posterModalDay === 'Day 2' ? '#0d9488' : 'transparent',
                                borderColor: '#0d9488',
                                color: '#ffffff',
                            }}
                        >
                            Day 2
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            component="a"
                            href={posterModalDay === 'Day 1' ? '/images/day1-poster.webp' : '/images/day2-poster.webp'}
                            download={posterModalDay === 'Day 1' ? 'DAY1_POSTER_PIT_IAGI_2026.webp' : 'DAY2_POSTER_PIT_IAGI_2026.webp'}
                            startIcon={<DownloadIcon />}
                            sx={{
                                bgcolor: '#0d9488',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                borderRadius: '16px',
                                '&:hover': { bgcolor: '#0f766e' },
                                ml: 1,
                            }}
                        >
                            Download
                        </Button>
                        <IconButton
                            onClick={() => setPosterOpen(false)}
                            size="small"
                            sx={{ color: '#94a3b8', '&:hover': { color: '#fff' } }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
                <DialogContent sx={{ p: 0, textAlign: 'center', bgcolor: '#091512', minHeight: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {!posterLoaded && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 1.5 }}>
                            <CircularProgress size={36} sx={{ color: '#0d9488' }} />
                            <Typography sx={{ color: '#94a3b8', fontSize: '0.84rem', fontWeight: 600 }}>
                                Memuat poster flyer resmi...
                            </Typography>
                        </Box>
                    )}
                    <Box
                        component="img"
                        src={posterModalDay === 'Day 1' ? '/images/day1-poster.webp' : '/images/day2-poster.webp'}
                        alt={`PIT IAGI & GEOSEA XIX 2026 ${posterModalDay} Keynote Speakers and Forums`}
                        onLoad={() => setPosterLoaded(true)}
                        onError={(e) => {
                            e.target.src = posterModalDay === 'Day 1' ? '/images/day1-poster.jpg' : '/images/day2-poster.jpg';
                            setPosterLoaded(true);
                        }}
                        sx={{
                            width: '100%',
                            maxHeight: '85vh',
                            objectFit: 'contain',
                            display: posterLoaded ? 'block' : 'none',
                            mx: 'auto',
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}
