import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PlaceIcon from '@mui/icons-material/Place';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import PublicIcon from '@mui/icons-material/Public';
import GroupsIcon from '@mui/icons-material/Groups';
import StarIcon from '@mui/icons-material/Star';
import CelebrationIcon from '@mui/icons-material/Celebration';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LandscapeIcon from '@mui/icons-material/Landscape';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import SchoolIcon from '@mui/icons-material/School';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ScrollReveal from './ScrollReveal';

export const SCHEDULE_DAYS = [
    {
        id: 'day-0',
        dayNumber: 'Pre-Event',
        dateStr: 'Monday, 2 November 2026',
        shortDate: 'Mon, 2 Nov',
        badge: 'Ice Breaking Night',
        events: [
            {
                time: '18:30 – 21:00 WIB',
                title: 'Ice Breaking Night (Invitation Only)',
                subtitle: 'Welcoming cocktail, delegate gathering, and informal networking for invited VIPs and international participants.',
                track: 'all',
                badge: 'General & GEOSEA',
                category: 'Social Event',
                icon: <CelebrationIcon sx={{ fontSize: 16 }} />,
                location: 'Designated Venue',
                highlight: true,
            },
        ],
    },
    {
        id: 'day-1',
        dayNumber: 'Day 1',
        dateStr: 'Tuesday, 3 November 2026',
        shortDate: 'Tue, 3 Nov',
        badge: 'Opening, CEO Talks & Georesources',
        events: [
            {
                time: '08:00 – 10:10 WIB',
                title: 'Opening Ceremony & VIP Exhibition Tour',
                subtitle: 'Official grand opening ceremony of the 55th PIT IAGI & GEOSEA XIX 2026, followed by VIP walkthrough of international exhibition booths.',
                track: 'all',
                badge: 'General & GEOSEA',
                category: 'Plenary',
                icon: <StarIcon sx={{ fontSize: 16 }} />,
                location: 'Main Plenary Ballroom',
                highlight: true,
            },
            {
                time: '10:25 – 11:45 WIB',
                title: 'CEO Talks',
                subtitle: 'Regulation, Risk, and Responsibility: How Energy Leaders Respond to Indonesia\'s Evolving Policy Landscape',
                track: 'general',
                badge: 'General Session',
                category: 'Executive Forum',
                icon: <GroupsIcon sx={{ fontSize: 16 }} />,
                location: 'Main Plenary Hall',
                highlight: true,
            },
            {
                time: '11:45 – 12:45 WIB',
                title: 'Lunch Break & Exhibition Viewing',
                subtitle: 'Buffet lunch, prayer break, and professional networking in the exhibition arena.',
                track: 'all',
                badge: 'General & GEOSEA',
                category: 'Break',
                icon: <RestaurantIcon sx={{ fontSize: 16 }} />,
                location: 'Dining Hall & Foyer',
            },
            {
                time: '12:45 – 13:45 WIB',
                title: 'Special Session – Exploration Roadmap',
                subtitle: 'Road Map to Giant Discovery of Indonesia\'s Exploration',
                track: 'general',
                badge: 'General Session',
                category: 'Special Session',
                icon: <StarIcon sx={{ fontSize: 16 }} />,
                location: 'Plenary Hall',
            },
            {
                time: '13:00 – 15:00 WIB',
                title: 'GEOSEA Congress',
                subtitle: 'Annual council congress of the Geological Society of Southeast Asia (GEOSEA) member countries.',
                track: 'geosea',
                badge: 'GEOSEA Participant',
                category: 'GEOSEA Congress',
                icon: <PublicIcon sx={{ fontSize: 16 }} />,
                location: '8th Floor Meeting Hall',
                highlight: true,
            },
            {
                time: '13:45 – 15:00 WIB',
                title: 'Panel Discussion #1 – GEORESOURCES',
                subtitle: '“Critical Georesources for Energy Transition: Innovation, Sustainability, and Regional Collaboration in ASEAN”',
                track: 'general',
                badge: 'General Session',
                category: 'Panel Discussion',
                icon: <GroupsIcon sx={{ fontSize: 16 }} />,
                location: 'Plenary Hall',
                highlight: true,
            },
            {
                time: '15:00 – 17:00 WIB',
                title: 'Ratu Boko Prambanan City Tour',
                subtitle: 'Scenic excursion visiting the historic royal complex of Ratu Boko and surrounding Yogyakarta cultural heritage.',
                track: 'geosea',
                badge: 'GEOSEA Participant',
                category: 'City Tour',
                icon: <DirectionsBusIcon sx={{ fontSize: 16 }} />,
                location: 'Ratu Boko Heritage Complex',
            },
            {
                time: '17:00 – 18:30 WIB',
                title: 'GEOSEA Dinner',
                subtitle: 'Sunset dinner for GEOSEA delegates overlooking the panoramic valley of Yogyakarta.',
                track: 'geosea',
                badge: 'GEOSEA Participant',
                category: 'Dinner Gathering',
                icon: <RestaurantIcon sx={{ fontSize: 16 }} />,
                location: 'Chandari Heaven',
            },
            {
                time: '19:00 – 21:00 WIB',
                title: 'Sendratari Ramayana (Ramayana Ballet)',
                subtitle: 'World-famous Indonesian epic cultural performance against the illuminated backdrop of Prambanan Temple.',
                track: 'geosea',
                badge: 'GEOSEA Participant',
                category: 'Cultural Masterpiece',
                icon: <TheaterComedyIcon sx={{ fontSize: 16 }} />,
                location: 'Prambanan Temple Open-Air Theater',
                highlight: true,
            },
        ],
    },
    {
        id: 'day-2',
        dayNumber: 'Day 2',
        dateStr: 'Wednesday, 4 November 2026',
        shortDate: 'Wed, 4 Nov',
        badge: 'Geoheritage, Geothermal & Geohazard',
        events: [
            {
                time: '08:00 – 08:30 WIB',
                title: 'GEOSEA Leadership Handover Ceremony',
                subtitle: 'Ceremonial transfer of GEOSEA Presidency and leadership from INDONESIA to PHILIPPINES.',
                track: 'all',
                badge: 'General & GEOSEA',
                category: 'International Handover',
                icon: <HandshakeIcon sx={{ fontSize: 16 }} />,
                location: 'Plenary Hall',
                highlight: true,
            },
            {
                time: '08:30 – 10:45 WIB',
                title: 'Panel Discussion #2 – GEOHERITAGE',
                subtitle: '“Geoheritage and Geoparks: Strengthening Regional Collaboration in Southeast Asia”',
                track: 'general',
                badge: 'General Session',
                category: 'Panel Discussion',
                icon: <LandscapeIcon sx={{ fontSize: 16 }} />,
                location: 'Plenary Hall',
                highlight: true,
            },
            {
                time: '10:45 – 11:45 WIB',
                title: 'Special Session – Geothermal Community Launching',
                subtitle: 'Official launching of the Society of Indonesian Geothermal Geologists (ISGG).',
                track: 'general',
                badge: 'General Session',
                category: 'Special Launching',
                icon: <CelebrationIcon sx={{ fontSize: 16 }} />,
                location: 'Main Stage',
            },
            {
                time: '11:45 – 12:45 WIB',
                title: 'Lunch Break & Poster Sessions',
                subtitle: 'Lunch break and viewing of peer-reviewed technical poster presentations.',
                track: 'all',
                badge: 'General & GEOSEA',
                category: 'Break',
                icon: <RestaurantIcon sx={{ fontSize: 16 }} />,
                location: 'Dining Area & Poster Hall',
            },
            {
                time: '12:45 – 13:45 WIB',
                title: 'Student Session',
                subtitle: 'Dedicated platform for undergraduate and postgraduate student papers and research discoveries.',
                track: 'general',
                badge: 'General Session',
                category: 'Student Research',
                icon: <SchoolIcon sx={{ fontSize: 16 }} />,
                location: 'Breakout Hall A',
            },
            {
                time: '13:45 – 15:30 WIB',
                title: 'Panel Discussion #3 – GEOHAZARD',
                subtitle: '“Geohazard Management for Sustainable Mining, Energy, and Infrastructure”',
                track: 'general',
                badge: 'General Session',
                category: 'Panel Discussion',
                icon: <GroupsIcon sx={{ fontSize: 16 }} />,
                location: 'Plenary Hall',
                highlight: true,
            },
            {
                time: '13:45 – 17:00 WIB',
                title: 'GEOSEA Field Trip – Yogyakarta',
                subtitle: 'Guided scientific field excursion examining active volcanic deposits and regional geo-sites in Yogyakarta.',
                track: 'geosea',
                badge: 'GEOSEA Participant',
                category: 'Field Trip',
                icon: <LandscapeIcon sx={{ fontSize: 16 }} />,
                location: 'Yogyakarta Geological Sites',
                highlight: true,
            },
            {
                time: '16:00 – 17:00 WIB',
                title: 'National Congress (Munas) IAGI & Chairman Election 2026',
                subtitle: 'Musyawarah Nasional (Munas) IAGI and democratic election for Chairman of IAGI 2026–2029.',
                track: 'general',
                badge: 'General (IAGI)',
                category: 'National Congress',
                icon: <HowToVoteIcon sx={{ fontSize: 16 }} />,
                location: 'Plenary Hall',
                highlight: true,
            },
        ],
    },
    {
        id: 'day-3',
        dayNumber: 'Day 3',
        dateStr: 'Thursday, 5 November 2026',
        shortDate: 'Thu, 5 Nov',
        badge: 'Exploration Frontiers, Awards & Art Show',
        events: [
            {
                time: '08:30 – 09:00 WIB',
                title: 'Special Session',
                subtitle: 'Special morning technical keynote & industry announcements.',
                track: 'general',
                badge: 'General Session',
                category: 'Special Session',
                icon: <StarIcon sx={{ fontSize: 16 }} />,
                location: 'Plenary Hall',
            },
            {
                time: '09:00 – 11:00 WIB',
                title: 'Special Session: Exploration Strategy in Underexplored Basins',
                subtitle: 'Exploration Strategy in Underexplored Basins: Data, Policy & De-risking',
                track: 'general',
                badge: 'General Session',
                category: 'Special Plenary',
                icon: <GroupsIcon sx={{ fontSize: 16 }} />,
                location: 'Plenary Hall',
                highlight: true,
            },
            {
                time: '11:00 – 12:00 WIB',
                title: 'Arie F. Lasut Groundbreaking Ceremony',
                subtitle: 'Ceremonial groundbreaking commemorating Indonesian National Hero of Mining & Geology, Arie Frederik Lasut.',
                track: 'all',
                badge: 'General & GEOSEA',
                category: 'Memorial Ceremony',
                icon: <CelebrationIcon sx={{ fontSize: 16 }} />,
                location: 'Groundbreaking Site',
                highlight: true,
            },
            {
                time: '12:00 – 13:30 WIB',
                title: 'Lunch Break & Networking',
                subtitle: 'Final conference luncheon and participant networking.',
                track: 'all',
                badge: 'General & GEOSEA',
                category: 'Break',
                icon: <RestaurantIcon sx={{ fontSize: 16 }} />,
                location: 'Dining Area',
            },
            {
                time: '14:00 – 15:00 WIB',
                title: 'Closing Ceremony & Awards',
                subtitle: 'Formal conclusion of 55th PIT IAGI & GEOSEA XIX 2026, presentation of Best Paper, Best Poster, and Student Awards.',
                track: 'all',
                badge: 'General & GEOSEA',
                category: 'Grand Closing',
                icon: <StarIcon sx={{ fontSize: 16 }} />,
                location: 'Plenary Hall',
                highlight: true,
            },
            {
                time: '15:00 onwards WIB',
                title: 'Geologist\'s Art Performance at Tebing Breksi',
                subtitle: 'Vibrant musical & theatrical performances by Indonesian geologists against the magnificent carved volcanic ash cliffs of Tebing Breksi.',
                track: 'all',
                badge: 'General & GEOSEA',
                category: 'Cultural Celebration',
                icon: <TheaterComedyIcon sx={{ fontSize: 16 }} />,
                location: 'Tebing Breksi Geoheritage Park',
                highlight: true,
            },
        ],
    },
];

export default function ProgramSchedule() {
    const [selectedDayId, setSelectedDayId] = useState('all');
    const [selectedTrack, setSelectedTrack] = useState('all');
    const [flyerOpen, setFlyerOpen] = useState(false);

    // Days to show
    const daysToShow = selectedDayId === 'all'
        ? SCHEDULE_DAYS
        : SCHEDULE_DAYS.filter(d => d.id === selectedDayId);

    // Track filter count
    const totalEventsCount = SCHEDULE_DAYS.reduce((acc, d) => acc + d.events.length, 0);

    return (
        <Box
            id="schedule"
            sx={{
                py: { xs: 8, md: 12 },
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 40%, #f8fafc 100%)',
            }}
        >
            {/* Subtle Background Glow */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '15%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(13, 148, 136, 0.06) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Section Header */}
                <ScrollReveal variant="fadeUp" duration={700}>
                    <Box sx={{ textAlign: 'center', maxWidth: '850px', mx: 'auto', mb: { xs: 4, md: 6 } }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: 'rgba(13, 148, 136, 0.08)',
                                borderRadius: '50px',
                                px: 2.5,
                                py: 0.7,
                                mb: 2,
                                border: '1px solid rgba(13, 148, 136, 0.25)',
                            }}
                        >
                            <CalendarMonthIcon sx={{ color: '#0d9488', fontSize: 18 }} />
                            <Typography
                                variant="overline"
                                sx={{
                                    color: '#0d9488',
                                    fontWeight: 800,
                                    letterSpacing: '0.15em',
                                    fontSize: '0.75rem',
                                }}
                            >
                                PROGRAM & SCHEDULE
                            </Typography>
                        </Box>

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
                            Conference Agenda & <br />
                            <Box component="span" sx={{ fontStyle: 'italic', color: '#0d9488' }}>
                                Rundown Acara
                            </Box>
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: '#64748b',
                                fontSize: { xs: '0.95rem', md: '1.05rem' },
                                lineHeight: 1.6,
                                maxWidth: '700px',
                                mx: 'auto',
                            }}
                        >
                            Jadwal lengkap konferensi internasional 4 hari, mencakup sesi pleno umum, forum CEO, simposium geoheritage & geopark, GEOSEA Congress, hingga cultural excursion di Yogyakarta.
                        </Typography>

                        {/* Button to View Official Schedule Flyer */}
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                            <Button
                                variant="outlined"
                                startIcon={<VisibilityIcon />}
                                onClick={() => setFlyerOpen(true)}
                                sx={{
                                    borderColor: '#0d9488',
                                    color: '#0d9488',
                                    fontWeight: 700,
                                    borderRadius: '30px',
                                    px: 2.8,
                                    py: 0.9,
                                    fontSize: '0.88rem',
                                    textTransform: 'none',
                                    bgcolor: '#ffffff',
                                    boxShadow: '0 2px 10px rgba(13, 148, 136, 0.1)',
                                    '&:hover': {
                                        bgcolor: '#f0fdfa',
                                        borderColor: '#0f766e',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 18px rgba(13, 148, 136, 0.18)',
                                    },
                                    transition: 'all 0.25s ease',
                                }}
                            >
                                📋 Lihat Poster Rundown Resmi
                            </Button>
                            <Button
                                variant="contained"
                                component="a"
                                href="/images/program-schedule.png"
                                download="PIT-IAGI-GEOSEA-2026-Program-Schedule.png"
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<DownloadIcon />}
                                sx={{
                                    bgcolor: '#0d9488',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    borderRadius: '30px',
                                    px: 2.8,
                                    py: 0.9,
                                    fontSize: '0.88rem',
                                    textTransform: 'none',
                                    boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
                                    '&:hover': {
                                        bgcolor: '#0f766e',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(13, 148, 136, 0.45)',
                                    },
                                    transition: 'all 0.25s ease',
                                }}
                            >
                                Unduh Rundown (PNG)
                            </Button>
                        </Box>
                    </Box>
                </ScrollReveal>

                {/* Day Switcher Segmented Buttons */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                        mb: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: 'inline-flex',
                            p: 0.6,
                            borderRadius: '50px',
                            bgcolor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 0.5,
                        }}
                    >
                        <Button
                            onClick={() => setSelectedDayId('all')}
                            sx={{
                                borderRadius: '40px',
                                px: { xs: 1.8, sm: 2.5 },
                                py: 0.8,
                                fontSize: { xs: '0.78rem', sm: '0.86rem' },
                                fontWeight: 700,
                                textTransform: 'none',
                                bgcolor: selectedDayId === 'all' ? '#0d9488' : 'transparent',
                                color: selectedDayId === 'all' ? '#ffffff' : '#475569',
                                boxShadow: selectedDayId === 'all' ? '0 4px 12px rgba(13, 148, 136, 0.35)' : 'none',
                                '&:hover': {
                                    bgcolor: selectedDayId === 'all' ? '#0f766e' : '#f8fafc',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            🗓️ Semua Hari (4 Hari)
                        </Button>
                        {SCHEDULE_DAYS.map(day => (
                            <Button
                                key={day.id}
                                onClick={() => setSelectedDayId(day.id)}
                                sx={{
                                    borderRadius: '40px',
                                    px: { xs: 1.8, sm: 2.4 },
                                    py: 0.8,
                                    fontSize: { xs: '0.78rem', sm: '0.86rem' },
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    bgcolor: selectedDayId === day.id ? '#0d9488' : 'transparent',
                                    color: selectedDayId === day.id ? '#ffffff' : '#475569',
                                    boxShadow: selectedDayId === day.id ? '0 4px 12px rgba(13, 148, 136, 0.35)' : 'none',
                                    '&:hover': {
                                        bgcolor: selectedDayId === day.id ? '#0f766e' : '#f8fafc',
                                    },
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                📅 {day.shortDate} ({day.dayNumber})
                            </Button>
                        ))}
                    </Box>
                </Box>

                {/* Track Filter Pills (General vs GEOSEA) */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1,
                        flexWrap: 'wrap',
                        mb: { xs: 4, md: 5 },
                    }}
                >
                    <Chip
                        label="Semua Track"
                        clickable
                        onClick={() => setSelectedTrack('all')}
                        sx={{
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            height: 34,
                            bgcolor: selectedTrack === 'all' ? '#1e293b' : '#ffffff',
                            color: selectedTrack === 'all' ? '#ffffff' : '#64748b',
                            border: '1px solid',
                            borderColor: selectedTrack === 'all' ? '#1e293b' : '#e2e8f0',
                            boxShadow: selectedTrack === 'all' ? '0 2px 8px rgba(30, 41, 59, 0.2)' : 'none',
                        }}
                    />
                    <Chip
                        icon={<GroupsIcon sx={{ fontSize: 15 }} />}
                        label="General Sessions (PIT IAGI)"
                        clickable
                        onClick={() => setSelectedTrack('general')}
                        sx={{
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            height: 34,
                            bgcolor: selectedTrack === 'general' ? '#0d9488' : '#ffffff',
                            color: selectedTrack === 'general' ? '#ffffff' : '#0d9488',
                            border: '1px solid',
                            borderColor: selectedTrack === 'general' ? '#0d9488' : 'rgba(13, 148, 136, 0.3)',
                            '& .MuiChip-icon': {
                                color: selectedTrack === 'general' ? '#ffffff !important' : '#0d9488 !important',
                            },
                        }}
                    />
                    <Chip
                        icon={<PublicIcon sx={{ fontSize: 15 }} />}
                        label="GEOSEA Participants Track"
                        clickable
                        onClick={() => setSelectedTrack('geosea')}
                        sx={{
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            height: 34,
                            bgcolor: selectedTrack === 'geosea' ? '#2563eb' : '#ffffff',
                            color: selectedTrack === 'geosea' ? '#ffffff' : '#2563eb',
                            border: '1px solid',
                            borderColor: selectedTrack === 'geosea' ? '#2563eb' : 'rgba(37, 99, 235, 0.3)',
                            '& .MuiChip-icon': {
                                color: selectedTrack === 'geosea' ? '#ffffff !important' : '#2563eb !important',
                            },
                        }}
                    />
                </Box>

                {/* Day-by-Day Schedule List */}
                <Stack spacing={5} sx={{ maxWidth: '1000px', mx: 'auto' }}>
                    {daysToShow.map((day) => {
                        // Filter events by track
                        const events = day.events.filter(ev => {
                            if (selectedTrack === 'all') return true;
                            if (selectedTrack === 'general') return ev.track === 'general' || ev.track === 'all';
                            if (selectedTrack === 'geosea') return ev.track === 'geosea' || ev.track === 'all';
                            return true;
                        });

                        if (events.length === 0) return null;

                        return (
                            <Box
                                key={day.id}
                                sx={{
                                    bgcolor: '#ffffff',
                                    borderRadius: '24px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {/* Day Header Banner */}
                                <Box
                                    sx={{
                                        px: { xs: 2.5, sm: 4 },
                                        py: 2.5,
                                        background: 'linear-gradient(135deg, #094d42 0%, #0d9488 100%)',
                                        color: '#ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: 1.5,
                                    }}
                                >
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.3 }}>
                                            <Chip
                                                label={day.dayNumber}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                    color: '#ffffff',
                                                    fontWeight: 800,
                                                    fontSize: '0.72rem',
                                                    height: 22,
                                                    backdropFilter: 'blur(4px)',
                                                }}
                                            />
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontWeight: 800,
                                                    fontSize: { xs: '1.15rem', sm: '1.35rem' },
                                                    fontFamily: '"Playfair Display", Georgia, serif',
                                                }}
                                            >
                                                {day.dateStr}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.82rem' }}>
                                            {day.badge}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={`${events.length} Agenda Sesi`}
                                        size="small"
                                        sx={{
                                            bgcolor: '#ffffff',
                                            color: '#0d9488',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            height: 26,
                                        }}
                                    />
                                </Box>

                                {/* Agenda Items for the Day */}
                                <Box sx={{ p: { xs: 2, sm: 3.5 } }}>
                                    <Stack spacing={2}>
                                        {events.map((event, idx) => {
                                            const isGeoseaTrack = event.track === 'geosea';
                                            const isGeneralTrack = event.track === 'general';
                                            const isCombinedTrack = event.track === 'all';

                                            return (
                                                <Box
                                                    key={idx}
                                                    sx={{
                                                        p: { xs: 2, sm: 2.5 },
                                                        borderRadius: '16px',
                                                        border: '1px solid',
                                                        borderColor: event.highlight
                                                            ? (isGeoseaTrack ? 'rgba(37, 99, 235, 0.35)' : 'rgba(13, 148, 136, 0.35)')
                                                            : '#f1f5f9',
                                                        bgcolor: event.highlight
                                                            ? (isGeoseaTrack ? 'rgba(37, 99, 235, 0.03)' : 'rgba(13, 148, 136, 0.03)')
                                                            : '#fafafa',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            bgcolor: '#ffffff',
                                                            boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                                                            borderColor: isGeoseaTrack ? '#3b82f6' : '#0d9488',
                                                            transform: 'translateX(4px)',
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: { xs: 'column', md: 'row' },
                                                            alignItems: { xs: 'flex-start', md: 'center' },
                                                            justifyContent: 'space-between',
                                                            gap: 1.5,
                                                        }}
                                                    >
                                                        {/* Left: Time & Track Badges */}
                                                        <Box sx={{ minWidth: { md: 230 }, flexShrink: 0 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8 }}>
                                                                <AccessTimeFilledIcon
                                                                    sx={{
                                                                        fontSize: 16,
                                                                        color: isGeoseaTrack ? '#2563eb' : '#0d9488',
                                                                    }}
                                                                />
                                                                <Typography
                                                                    sx={{
                                                                        fontWeight: 800,
                                                                        fontSize: '0.92rem',
                                                                        color: '#0f172a',
                                                                        letterSpacing: '-0.01em',
                                                                    }}
                                                                >
                                                                    {event.time}
                                                                </Typography>
                                                            </Box>

                                                            {/* Track Badges */}
                                                            <Stack direction="row" spacing={0.6} flexWrap="wrap">
                                                                {isGeoseaTrack && (
                                                                    <Chip
                                                                        icon={<PublicIcon sx={{ fontSize: 13 }} />}
                                                                        label="GEOSEA Track"
                                                                        size="small"
                                                                        sx={{
                                                                            height: 22,
                                                                            fontSize: '0.68rem',
                                                                            fontWeight: 700,
                                                                            bgcolor: 'rgba(37, 99, 235, 0.12)',
                                                                            color: '#1d4ed8',
                                                                            border: '1px solid rgba(37, 99, 235, 0.3)',
                                                                            '& .MuiChip-icon': { color: '#1d4ed8 !important' },
                                                                        }}
                                                                    />
                                                                )}
                                                                {isGeneralTrack && (
                                                                    <Chip
                                                                        icon={<GroupsIcon sx={{ fontSize: 13 }} />}
                                                                        label="General Session"
                                                                        size="small"
                                                                        sx={{
                                                                            height: 22,
                                                                            fontSize: '0.68rem',
                                                                            fontWeight: 700,
                                                                            bgcolor: 'rgba(13, 148, 136, 0.12)',
                                                                            color: '#0f766e',
                                                                            border: '1px solid rgba(13, 148, 136, 0.3)',
                                                                            '& .MuiChip-icon': { color: '#0f766e !important' },
                                                                        }}
                                                                    />
                                                                )}
                                                                {isCombinedTrack && (
                                                                    <Chip
                                                                        label="All Participants"
                                                                        size="small"
                                                                        sx={{
                                                                            height: 22,
                                                                            fontSize: '0.68rem',
                                                                            fontWeight: 700,
                                                                            bgcolor: '#f1f5f9',
                                                                            color: '#475569',
                                                                            border: '1px solid #cbd5e1',
                                                                        }}
                                                                    />
                                                                )}
                                                                <Chip
                                                                    label={event.category}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 22,
                                                                        fontSize: '0.68rem',
                                                                        fontWeight: 600,
                                                                        bgcolor: 'transparent',
                                                                        color: '#64748b',
                                                                    }}
                                                                />
                                                            </Stack>
                                                        </Box>

                                                        {/* Center/Right: Title, Subtitle, Location */}
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{
                                                                    fontWeight: 800,
                                                                    fontSize: { xs: '1rem', sm: '1.08rem' },
                                                                    color: '#0f172a',
                                                                    lineHeight: 1.35,
                                                                    mb: 0.5,
                                                                }}
                                                            >
                                                                {event.title}
                                                            </Typography>

                                                            {event.subtitle && (
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: '#475569',
                                                                        fontSize: '0.86rem',
                                                                        lineHeight: 1.5,
                                                                        mb: event.location ? 0.8 : 0,
                                                                    }}
                                                                >
                                                                    {event.subtitle}
                                                                </Typography>
                                                            )}

                                                            {event.location && (
                                                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 0.4 }}>
                                                                    <PlaceIcon sx={{ fontSize: 14, color: '#0d9488' }} />
                                                                    <Typography
                                                                        variant="caption"
                                                                        sx={{
                                                                            color: '#0d9488',
                                                                            fontWeight: 700,
                                                                            fontSize: '0.78rem',
                                                                        }}
                                                                    >
                                                                        {event.location}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                </Box>
                            </Box>
                        );
                    })}
                </Stack>
            </Container>

            {/* Lightbox Dialog: Full Official Program & Schedule Flyer Poster */}
            <Dialog
                open={flyerOpen}
                onClose={() => setFlyerOpen(false)}
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
                        p: 1.8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: '#1e293b',
                        color: '#fff',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarMonthIcon sx={{ color: '#10b981', fontSize: '1.3rem' }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                            Official Program & Schedule — 55th PIT IAGI & GEOSEA XIX 2026
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            variant="contained"
                            size="small"
                            component="a"
                            href="/images/program-schedule.png"
                            download="PIT-IAGI-GEOSEA-2026-Program-Schedule.png"
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<DownloadIcon />}
                            sx={{
                                bgcolor: '#0d9488',
                                '&:hover': { bgcolor: '#0f766e' },
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                px: 1.5,
                            }}
                        >
                            Unduh Poster
                        </Button>
                        <IconButton
                            onClick={() => setFlyerOpen(false)}
                            sx={{ color: '#94a3b8', '&:hover': { color: '#fff' }, p: 0.5 }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <Box
                    sx={{
                        p: { xs: 1, sm: 2 },
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        bgcolor: '#020617',
                    }}
                >
                    <Box
                        component="img"
                        src="/images/program-schedule.png"
                        alt="PIT IAGI - GEOSEA XIX 2026 Official Program & Schedule"
                        sx={{
                            width: '100%',
                            maxWidth: '750px',
                            height: 'auto',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                            display: 'block',
                        }}
                    />
                </Box>
            </Dialog>
        </Box>
    );
}
