import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PlaceIcon from '@mui/icons-material/Place';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import PublicIcon from '@mui/icons-material/Public';
import GroupsIcon from '@mui/icons-material/Groups';
import ViewListIcon from '@mui/icons-material/ViewList';
import TableChartIcon from '@mui/icons-material/TableChart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ScrollReveal from './ScrollReveal';

export const SCHEDULE_DAYS = [
    {
        id: 'day-0',
        dayNumber: 'Pre-Event',
        dateStr: 'Monday, 2 November 2026',
        shortDate: 'Mon, 2 Nov',
        badge: 'GOBAR & Ice Breaking Night',
        events: [
            {
                time: '13:00 – 17:30',
                title: 'GOBAR IAGI (Golf Bareng)',
                subtitle: 'Turnamen Golf Bareng IAGI di Merapi Golf Yogyakarta (Tee Off 13:00 WIB – Selesai 17:30 WIB). Fasilitas: Golf Cart, Green Fee, Lunch, dan Cool Box.',
                track: 'all',
                badge: 'General & GEOSEA',
                generalTopic: 'GOBAR IAGI – Golf Bareng (Tee Off 13:00 – 17:30 WIB)',
                geoseaTopic: 'GOBAR IAGI – Pre-Event Golf Tournament (Tee Off 13:00 – 17:30 WIB)',
                category: 'Sports & Social',
                location: 'Merapi Golf Yogyakarta',
                highlight: true,
            },
            {
                time: '18:30 – 21:00',
                title: 'Ice Breaking Night (Invitation Only)',
                subtitle: 'Welcoming cocktail, delegate gathering, and informal networking for invited VIPs and international participants.',
                track: 'all',
                badge: 'General & GEOSEA',
                generalTopic: 'Ice Breaking Night (Invitation Only)',
                geoseaTopic: 'Ice Breaking Night (Invitation Only)',
                category: 'Social Event',
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
                time: '08:00 – 10:10',
                title: 'Opening Ceremony & VIP Exhibition Tour',
                subtitle: 'Official grand opening ceremony of the 55th PIT IAGI & GEOSEA XIX 2026, followed by VIP walkthrough of international exhibition booths.',
                track: 'all',
                badge: 'General & GEOSEA',
                generalTopic: 'Opening Ceremony & VIP Exhibition Tour',
                geoseaTopic: 'Opening Ceremony & VIP Exhibition Tour',
                category: 'Plenary',
                location: 'Main Plenary Ballroom',
                highlight: true,
            },
            {
                time: '10:25 – 11:45',
                title: 'CEO Talks',
                subtitle: 'Regulation, Risk, and Responsibility: How Energy Leaders Respond to Indonesia\'s Evolving Policy Landscape',
                track: 'general',
                badge: 'General Session',
                generalTopic: 'CEO Talks – Regulation, Risk, and Responsibility: How Energy Leaders Respond to Indonesia\'s Evolving Policy Landscape',
                geoseaTopic: '—',
                category: 'Executive Forum',
                location: 'Main Plenary Hall',
                highlight: true,
            },
            {
                time: '11:45 – 12:45',
                title: 'Lunch Break & Exhibition Viewing',
                subtitle: 'Buffet lunch, prayer break, and professional networking in the exhibition arena.',
                track: 'all',
                badge: 'General & GEOSEA',
                generalTopic: 'Lunch Time',
                geoseaTopic: 'Lunch Time',
                category: 'Break',
                location: 'Dining Hall & Foyer',
            },
            {
                time: '12:45 – 13:45',
                title: 'Special Session – Exploration Roadmap',
                subtitle: 'Road Map to Giant Discovery of Indonesia\'s Exploration',
                track: 'general',
                badge: 'General Session',
                generalTopic: 'Special Session – Road Map to Giant Discovery of Indonesia\'s Exploration',
                geoseaTopic: '—',
                category: 'Special Session',
                location: 'Plenary Hall',
            },
            {
                time: '13:00 – 15:00',
                title: 'GEOSEA Congress',
                subtitle: 'Annual council congress of the Geological Society of Southeast Asia (GEOSEA) member countries.',
                track: 'geosea',
                badge: 'GEOSEA Participant',
                generalTopic: '—',
                geoseaTopic: 'GEOSEA Congress (8th Floor)',
                category: 'GEOSEA Congress',
                location: '8th Floor Meeting Hall',
                highlight: true,
            },
            {
                time: '13:45 – 15:00',
                title: 'Panel Discussion #1 – GEORESOURCES',
                subtitle: '“Critical Georesources for Energy Transition: Innovation, Sustainability, and Regional Collaboration in ASEAN”',
                track: 'general',
                badge: 'General Session',
                generalTopic: 'Panel Discussion #1 – GEORESOURCES: "Critical Georesources for Energy Transition: Innovation, Sustainability, and Regional Collaboration in ASEAN"',
                geoseaTopic: '—',
                category: 'Panel Discussion',
                location: 'Plenary Hall',
                highlight: true,
            },
            {
                time: '15:00 – 17:00',
                title: 'Ratu Boko Prambanan City Tour',
                subtitle: 'Scenic excursion visiting the historic royal complex of Ratu Boko and surrounding Yogyakarta cultural heritage.',
                track: 'geosea',
                badge: 'GEOSEA Participant',
                generalTopic: '—',
                geoseaTopic: 'Ratu Boko Prambanan City Tour',
                category: 'City Tour',
                location: 'Ratu Boko Heritage Complex',
            },
            {
                time: '17:00 – 18:30',
                title: 'GEOSEA Dinner',
                subtitle: 'Sunset dinner for GEOSEA delegates overlooking the panoramic valley of Yogyakarta.',
                track: 'geosea',
                badge: 'GEOSEA Participant',
                generalTopic: '—',
                geoseaTopic: 'GEOSEA Dinner (Chandari Heaven)',
                category: 'Dinner Gathering',
                location: 'Chandari Heaven',
            },
            {
                time: '19:00 – 21:00',
                title: 'Sendratari Ramayana (Ramayana Ballet)',
                subtitle: 'World-famous Indonesian epic cultural performance against the illuminated backdrop of Prambanan Temple.',
                track: 'geosea',
                badge: 'GEOSEA Participant',
                generalTopic: '—',
                geoseaTopic: 'Sendratari Ramayana (Prambanan Temple)',
                category: 'Cultural Show',
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
                time: '08:00 – 08:30',
                title: 'GEOSEA Leadership Handover Ceremony',
                subtitle: 'Ceremonial transfer of GEOSEA Presidency and leadership from INDONESIA to PHILIPPINES.',
                track: 'all',
                badge: 'General & GEOSEA',
                generalTopic: 'GEOSEA Leadership Handover Ceremony from INDONESIA to PHILIPPINES',
                geoseaTopic: 'GEOSEA Leadership Handover Ceremony from INDONESIA to PHILIPPINES',
                category: 'International Handover',
                location: 'Plenary Hall',
                highlight: true,
            },
            {
                time: '08:30 – 10:45',
                title: 'Panel Discussion #2 – GEOHERITAGE',
                subtitle: '“Geoheritage and Geoparks: Strengthening Regional Collaboration in Southeast Asia”',
                track: 'general',
                badge: 'General Session',
                generalTopic: 'Panel Discussion #2 – GEOHERITAGE: "Geoheritage and Geoparks: Strengthening Regional Collaboration in Southeast Asia"',
                geoseaTopic: '—',
                category: 'Panel Discussion',
                location: 'Plenary Hall',
                highlight: true,
            },
            {
                time: '10:45 – 11:45',
                title: 'Special Session – Geothermal Community Launching',
                subtitle: 'Official launching of the Society of Indonesian Geothermal Geologists (ISGG).',
                track: 'general',
                badge: 'General Session',
                generalTopic: 'Special Session – Geothermal Community Launching (Society of Indonesian Geothermal Geologists)',
                geoseaTopic: '—',
                category: 'Special Launching',
                location: 'Main Stage',
            },
            {
                time: '11:45 – 12:45',
                title: 'Lunch Break & Poster Sessions',
                subtitle: 'Lunch break and viewing of peer-reviewed technical poster presentations.',
                track: 'all',
                badge: 'General & GEOSEA',
                generalTopic: 'Lunch Time',
                geoseaTopic: 'Lunch Time',
                category: 'Break',
                location: 'Dining Area & Poster Hall',
            },
            {
                time: '12:45 – 13:45',
                title: 'Student Session',
                subtitle: 'Dedicated platform for undergraduate and postgraduate student papers and research discoveries.',
                track: 'general',
                badge: 'General Session',
                generalTopic: 'Student Session',
                geoseaTopic: '—',
                category: 'Student Research',
                location: 'Breakout Hall A',
            },
            {
                time: '13:45 – 15:30',
                title: 'Panel Discussion #3 – GEOHAZARD',
                subtitle: '“Geohazard Management for Sustainable Mining, Energy, and Infrastructure”',
                track: 'general',
                badge: 'General Session',
                generalTopic: 'Panel Discussion #3 – GEOHAZARD: "Geohazard Management for Sustainable Mining, Energy, and Infrastructure"',
                geoseaTopic: '—',
                category: 'Panel Discussion',
                location: 'Plenary Hall',
                highlight: true,
            },
            {
                time: '13:45 – 17:00',
                title: 'GEOSEA Field Trip – Yogyakarta',
                subtitle: 'Guided scientific field excursion examining active volcanic deposits and regional geo-sites in Yogyakarta.',
                track: 'geosea',
                badge: 'GEOSEA Participant',
                generalTopic: '—',
                geoseaTopic: 'GEOSEA Field Trip – Yogyakarta',
                category: 'Field Trip',
                location: 'Yogyakarta Geological Sites',
                highlight: true,
            },
            {
                time: '16:00 – 17:00',
                title: 'National Congress (Munas) IAGI & Chairman Election 2026',
                subtitle: 'Musyawarah Nasional (Munas) IAGI and democratic election for Chairman of IAGI 2026–2029.',
                track: 'general',
                badge: 'General (IAGI)',
                generalTopic: 'National Congress (Munas) IAGI and Chairman Election 2026',
                geoseaTopic: '—',
                category: 'National Congress',
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
                time: '08:30 – 09:00',
                title: 'Special Session',
                subtitle: 'Special morning technical keynote & industry announcements.',
                track: 'general',
                badge: 'General Session',
                generalTopic: 'Special Session',
                geoseaTopic: '—',
                category: 'Special Session',
                location: 'Plenary Hall',
            },
            {
                time: '09:00 – 11:00',
                title: 'Special Session: Exploration Strategy in Underexplored Basins',
                subtitle: 'Exploration Strategy in Underexplored Basins: Data, Policy & De-risking',
                track: 'general',
                badge: 'General Session',
                generalTopic: 'Special Session: Exploration Strategy in Underexplored Basins: Data, Policy & De-risking',
                geoseaTopic: '—',
                category: 'Special Plenary',
                location: 'Plenary Hall',
                highlight: true,
            },
            {
                time: '11:00 – 12:00',
                title: 'Arie F. Lasut Groundbreaking Ceremony',
                subtitle: 'Ceremonial groundbreaking commemorating Indonesian National Hero of Mining & Geology, Arie Frederik Lasut.',
                track: 'all',
                badge: 'General & GEOSEA',
                generalTopic: 'Arie F. Lasut Groundbreaking Ceremony',
                geoseaTopic: 'Arie F. Lasut Groundbreaking Ceremony',
                category: 'Memorial Ceremony',
                location: 'Groundbreaking Site',
                highlight: true,
            },
            {
                time: '12:00 – 13:30',
                title: 'Lunch Break & Networking',
                subtitle: 'Final conference luncheon and participant networking.',
                track: 'all',
                badge: 'General & GEOSEA',
                generalTopic: 'Lunch Time',
                geoseaTopic: 'Lunch Time',
                category: 'Break',
                location: 'Dining Area',
            },
            {
                time: '14:00 – 15:00',
                title: 'Closing Ceremony & Awards',
                subtitle: 'Formal conclusion of 55th PIT IAGI & GEOSEA XIX 2026, presentation of Best Paper, Best Poster, and Student Awards.',
                track: 'all',
                badge: 'General & GEOSEA',
                generalTopic: 'Closing Ceremony & Awards',
                geoseaTopic: 'Closing Ceremony & Awards',
                category: 'Grand Closing',
                location: 'Plenary Hall',
                highlight: true,
            },
            {
                time: '15:00 onwards',
                title: 'Geologist\'s Art Performance at Tebing Breksi',
                subtitle: 'Vibrant musical & theatrical performances by Indonesian geologists against the magnificent carved volcanic ash cliffs of Tebing Breksi.',
                track: 'all',
                badge: 'General & GEOSEA',
                generalTopic: 'Gelologist\'s Art Performance at Tebing Breksi',
                geoseaTopic: 'Gelologist\'s Art Performance at Tebing Breksi',
                category: 'Cultural Celebration',
                location: 'Tebing Breksi Geoheritage Park',
                highlight: true,
            },
        ],
    },
];

function EventCard({ event, compact = false, index = 0 }) {
    const isGeoseaTrack = event.track === 'geosea';
    const isGeneralTrack = event.track === 'general';
    const isCombinedTrack = event.track === 'all';

    // Accent line & color scheme based on track
    const accentColor = isGeoseaTrack ? '#2563eb' : (isGeneralTrack ? '#0d9488' : '#d97706');
    const accentBorder = isGeoseaTrack ? '3.5px solid #2563eb' : (isGeneralTrack ? '3.5px solid #0d9488' : '3.5px solid #f59e0b');

    return (
        <Box
            sx={{
                p: compact ? 1.6 : 2.2,
                borderRadius: "15px",
                border: "1px solid",
                borderColor: event.highlight
                    ? (isGeoseaTrack ? "rgba(37, 99, 235, 0.4)" : (isGeneralTrack ? "rgba(13, 148, 136, 0.4)" : "rgba(245, 158, 11, 0.4)"))
                    : "rgba(226, 232, 240, 0.95)",
                borderLeft: accentBorder,
                bgcolor: "#ffffff",
                boxShadow: event.highlight
                    ? "0 4px 16px rgba(13, 148, 136, 0.08), 0 1px 3px rgba(0,0,0,0.03)"
                    : "0 2px 8px rgba(0, 0, 0, 0.025)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                boxSizing: "border-box",
                animation: 'eventCardEnter 0.45s cubic-bezier(0.16, 1, 0.3, 1) backwards',
                animationDelay: `${Math.min(index * 35, 350)}ms`,
                '@keyframes eventCardEnter': {
                    '0%': { opacity: 0, transform: 'translateY(14px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                    bgcolor: "#ffffff",
                    transform: "translateY(-4px) scale(1.012)",
                    boxShadow: isGeoseaTrack
                        ? "0 14px 28px -6px rgba(37, 99, 235, 0.18), 0 4px 12px rgba(0,0,0,0.04)"
                        : "0 14px 28px -6px rgba(13, 148, 136, 0.2), 0 4px 12px rgba(0,0,0,0.04)",
                    borderColor: accentColor,
                },
            }}
        >
            <Box>
                {/* Time Badge & Live Category Indicator */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1.2 }}>
                    {/* Time Pill Badge */}
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.6,
                            bgcolor: "#0f172a",
                            color: "#ffffff",
                            px: 1,
                            py: 0.35,
                            borderRadius: "8px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                        }}
                    >
                        <AccessTimeFilledIcon
                            sx={{
                                fontSize: 13,
                                color: isGeoseaTrack ? "#60a5fa" : (isGeneralTrack ? "#2dd4bf" : "#fbbf24"),
                            }}
                        />
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: "0.75rem",
                                color: "#f8fafc",
                                letterSpacing: "0.02em",
                            }}
                        >
                            {event.time} WIB
                        </Typography>
                    </Box>

                    {/* Category Chip with Live Pulse if highlighted */}
                    {event.category && (
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                            {event.highlight && (
                                <Box
                                    sx={{
                                        width: 7,
                                        height: 7,
                                        borderRadius: "50%",
                                        bgcolor: accentColor,
                                        boxShadow: `0 0 0 ${accentColor}`,
                                        animation: "livePulseBeacon 2s infinite",
                                        "@keyframes livePulseBeacon": {
                                            "0%": { boxShadow: `0 0 0 0 ${accentColor}88` },
                                            "70%": { boxShadow: "0 0 0 6px transparent" },
                                            "100%": { boxShadow: "0 0 0 0 transparent" },
                                        },
                                    }}
                                />
                            )}
                            <Chip
                                label={event.category}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: "0.68rem",
                                    fontWeight: 700,
                                    bgcolor: event.highlight
                                        ? (isGeoseaTrack ? "rgba(37, 99, 235, 0.08)" : (isGeneralTrack ? "rgba(13, 148, 136, 0.09)" : "rgba(245, 158, 11, 0.1)"))
                                        : "#f1f5f9",
                                    color: isGeoseaTrack ? "#1d4ed8" : (isGeneralTrack ? "#0f766e" : "#b45309"),
                                    border: event.highlight
                                        ? `1px solid ${isGeoseaTrack ? "rgba(37, 99, 235, 0.25)" : "rgba(13, 148, 136, 0.25)"}`
                                        : "1px solid #e2e8f0",
                                }}
                            />
                        </Box>
                    )}
                </Box>

                {/* Track Badge */}
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1 }}>
                    {isGeoseaTrack && (
                        <Chip
                            icon={<PublicIcon sx={{ fontSize: 11 }} />}
                            label="GEOSEA Track"
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: "0.66rem",
                                fontWeight: 700,
                                bgcolor: "#eff6ff",
                                color: "#1d4ed8",
                                border: "1px solid #bfdbfe",
                                "& .MuiChip-icon": { color: "#1d4ed8 !important" },
                            }}
                        />
                    )}
                    {isGeneralTrack && (
                        <Chip
                            icon={<GroupsIcon sx={{ fontSize: 11 }} />}
                            label="PIT IAGI General"
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: "0.66rem",
                                fontWeight: 700,
                                bgcolor: "#f0fdfa",
                                color: "#0f766e",
                                border: "1px solid #99f6e4",
                                "& .MuiChip-icon": { color: "#0f766e !important" },
                            }}
                        />
                    )}
                    {isCombinedTrack && (
                        <Chip
                            label="All Delegates"
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: "0.66rem",
                                fontWeight: 700,
                                bgcolor: "#f8fafc",
                                color: "#475569",
                                border: "1px solid #e2e8f0",
                            }}
                        />
                    )}
                </Box>

                {/* Title */}
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 800,
                        color: "#0f172a",
                        fontSize: compact ? "0.88rem" : "0.95rem",
                        lineHeight: 1.35,
                        mb: 0.6,
                        letterSpacing: "-0.01em",
                    }}
                >
                    {event.title}
                </Typography>

                {/* Subtitle */}
                {event.subtitle && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#64748b",
                            fontSize: "0.78rem",
                            lineHeight: 1.48,
                            display: "-webkit-box",
                            WebkitLineClamp: compact ? 2 : 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {event.subtitle}
                    </Typography>
                )}
            </Box>

            {/* Location */}
            {event.location && (
                <Box
                    sx={{
                        pt: 1,
                        mt: 1.2,
                        borderTop: "1px dashed #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.6,
                    }}
                >
                    <PlaceIcon sx={{ fontSize: 13, color: accentColor }} />
                    <Typography
                        variant="caption"
                        sx={{
                            color: isGeoseaTrack ? "#1d4ed8" : (isGeneralTrack ? "#0f766e" : "#b45309"),
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {event.location}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default function ProgramSchedule() {
    // Default to Day 1 (Tue, 3 Nov) for fast initial render
    const [selectedDayId, setSelectedDayId] = useState("day-1");
    const [selectedTrack, setSelectedTrack] = useState("all");
    const [viewMode, setViewMode] = useState("cards"); // "cards" | "table"
    const [flyerOpen, setFlyerOpen] = useState(false);
    const [flyerLoading, setFlyerLoading] = useState(true);
    const scrollContainerRef = useRef(null);

    const handleScroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 360;
            scrollContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const currentDay = SCHEDULE_DAYS.find(d => d.id === selectedDayId) || SCHEDULE_DAYS[1];

    const filterEvents = (events) => {
        return events.filter(ev => {
            if (selectedTrack === "all") return true;
            if (selectedTrack === "general") return ev.track === "general" || ev.track === "all";
            if (selectedTrack === "geosea") return ev.track === "geosea" || ev.track === "all";
            return true;
        });
    };

    const singleDayEvents = filterEvents(currentDay ? currentDay.events : []);

    return (
        <Box
            id="schedule"
            sx={{
                py: { xs: 7, md: 10 },
                position: "relative",
                background: "linear-gradient(180deg, #f0fdfa 0%, #ffffff 40%, #f8fafc 100%)",
            }}
        >
            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
                {/* Section Header */}
                <ScrollReveal variant="fadeUp" duration={600}>
                    <Box sx={{ textAlign: "center", maxWidth: "800px", mx: "auto", mb: { xs: 3.5, md: 5 } }}>
                        <Box
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 1,
                                bgcolor: "rgba(13, 148, 136, 0.08)",
                                borderRadius: "50px",
                                px: 2.2,
                                py: 0.6,
                                mb: 1.8,
                                border: "1px solid rgba(13, 148, 136, 0.25)",
                            }}
                        >
                            <CalendarMonthIcon sx={{ color: "#0d9488", fontSize: 17 }} />
                            <Typography
                                variant="overline"
                                sx={{
                                    color: "#0d9488",
                                    fontWeight: 800,
                                    letterSpacing: "0.15em",
                                    fontSize: "0.74rem",
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
                                color: "#0f172a",
                                fontSize: { xs: "1.9rem", sm: "2.6rem", md: "3rem" },
                                letterSpacing: "-0.02em",
                                lineHeight: 1.18,
                                mb: 1.5,
                            }}
                        >
                            Conference Agenda & <br />
                            <Box component="span" sx={{ fontStyle: "italic", color: "#0d9488" }}>
                                Rundown Acara
                            </Box>
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: "#64748b",
                                fontSize: { xs: "0.92rem", md: "1rem" },
                                lineHeight: 1.6,
                                maxWidth: "680px",
                                mx: "auto",
                            }}
                        >
                            Jadwal lengkap konferensi internasional 4 hari: sesi pleno umum, forum CEO, simposium geoheritage & geopark, GEOSEA Congress, hingga cultural excursion di Yogyakarta.
                        </Typography>

                        {/* Top Action Buttons (Fast Flyer & View Toggle) */}
                        <Box sx={{ mt: 2.5, display: "flex", justifyContent: "center", gap: 1.2, flexWrap: "wrap" }}>
                            <Button
                                variant="outlined"
                                startIcon={<VisibilityIcon />}
                                onClick={() => {
                                    setFlyerLoading(true);
                                    setFlyerOpen(true);
                                }}
                                sx={{
                                    borderColor: "#0d9488",
                                    color: "#0d9488",
                                    fontWeight: 700,
                                    borderRadius: "30px",
                                    px: 2.4,
                                    py: 0.75,
                                    fontSize: "0.84rem",
                                    textTransform: "none",
                                    bgcolor: "#ffffff",
                                    "&:hover": {
                                        bgcolor: "#f0fdfa",
                                        borderColor: "#0f766e",
                                    },
                                }}
                            >
                                📋 Lihat Poster Rundown Resmi
                            </Button>
                            <Button
                                variant="contained"
                                component="a"
                                href="/images/program-schedule.webp"
                                download="PIT-IAGI-GEOSEA-2026-Program-Schedule.webp"
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<DownloadIcon />}
                                sx={{
                                    bgcolor: "#0d9488",
                                    color: "#ffffff",
                                    fontWeight: 700,
                                    borderRadius: "30px",
                                    px: 2.4,
                                    py: 0.75,
                                    fontSize: "0.84rem",
                                    textTransform: "none",
                                    boxShadow: "none",
                                    "&:hover": {
                                        bgcolor: "#0f766e",
                                        boxShadow: "0 4px 12px rgba(13, 148, 136, 0.3)",
                                    },
                                }}
                            >
                                Unduh Rundown
                            </Button>
                        </Box>
                    </Box>
                </ScrollReveal>

                {/* Day Switcher Segmented Buttons */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 2.5,
                    }}
                >
                    <Box
                        sx={{
                            display: "inline-flex",
                            p: 0.5,
                            borderRadius: "50px",
                            bgcolor: "#ffffff",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: 0.4,
                        }}
                    >
                        {SCHEDULE_DAYS.map(day => (
                            <Button
                                key={day.id}
                                onClick={() => setSelectedDayId(day.id)}
                                sx={{
                                    borderRadius: "40px",
                                    px: { xs: 1.6, sm: 2.2 },
                                    py: 0.7,
                                    fontSize: { xs: "0.78rem", sm: "0.85rem" },
                                    fontWeight: 700,
                                    textTransform: "none",
                                    bgcolor: selectedDayId === day.id ? "#0d9488" : "transparent",
                                    color: selectedDayId === day.id ? "#ffffff" : "#475569",
                                    "&:hover": {
                                        bgcolor: selectedDayId === day.id ? "#0f766e" : "#f8fafc",
                                    },
                                    transition: "all 0.15s ease",
                                }}
                            >
                                📅 {day.shortDate} ({day.dayNumber})
                            </Button>
                        ))}
                        <Button
                            onClick={() => setSelectedDayId("all")}
                            sx={{
                                borderRadius: "40px",
                                px: { xs: 1.6, sm: 2.2 },
                                py: 0.7,
                                fontSize: { xs: "0.78rem", sm: "0.85rem" },
                                fontWeight: 700,
                                textTransform: "none",
                                bgcolor: selectedDayId === "all" ? "#0d9488" : "transparent",
                                color: selectedDayId === "all" ? "#ffffff" : "#475569",
                                "&:hover": {
                                    bgcolor: selectedDayId === "all" ? "#0f766e" : "#f8fafc",
                                },
                                transition: "all 0.15s ease",
                            }}
                        >
                            Semua Hari (4 Hari)
                        </Button>
                    </Box>
                </Box>

                {/* Sub-toolbar: Track Filter & View Mode Toggle */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.5,
                        flexWrap: "wrap",
                        mb: { xs: 3, md: 4 },
                    }}
                >
                    {/* Track Pills */}
                    <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap", justifyContent: "center" }}>
                        <Chip
                            label="Semua Track"
                            clickable
                            size="small"
                            onClick={() => setSelectedTrack("all")}
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.78rem",
                                height: 30,
                                bgcolor: selectedTrack === "all" ? "#1e293b" : "#ffffff",
                                color: selectedTrack === "all" ? "#ffffff" : "#64748b",
                                border: "1px solid",
                                borderColor: selectedTrack === "all" ? "#1e293b" : "#e2e8f0",
                            }}
                        />
                        <Chip
                            icon={<GroupsIcon sx={{ fontSize: 14 }} />}
                            label="General (PIT IAGI)"
                            clickable
                            size="small"
                            onClick={() => setSelectedTrack("general")}
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.78rem",
                                height: 30,
                                bgcolor: selectedTrack === "general" ? "#0d9488" : "#ffffff",
                                color: selectedTrack === "general" ? "#ffffff" : "#0d9488",
                                border: "1px solid",
                                borderColor: selectedTrack === "general" ? "#0d9488" : "rgba(13, 148, 136, 0.3)",
                                "& .MuiChip-icon": {
                                    color: selectedTrack === "general" ? "#ffffff !important" : "#0d9488 !important",
                                },
                            }}
                        />
                        <Chip
                            icon={<PublicIcon sx={{ fontSize: 14 }} />}
                            label="GEOSEA Track"
                            clickable
                            size="small"
                            onClick={() => setSelectedTrack("geosea")}
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.78rem",
                                height: 30,
                                bgcolor: selectedTrack === "geosea" ? "#2563eb" : "#ffffff",
                                color: selectedTrack === "geosea" ? "#ffffff" : "#2563eb",
                                border: "1px solid",
                                borderColor: selectedTrack === "geosea" ? "#2563eb" : "rgba(37, 99, 235, 0.3)",
                                "& .MuiChip-icon": {
                                    color: selectedTrack === "geosea" ? "#ffffff !important" : "#2563eb !important",
                                },
                            }}
                        />
                    </Box>

                    {/* View Mode Toggle: Cards vs Table */}
                    <Box
                        sx={{
                            display: "inline-flex",
                            p: 0.3,
                            bgcolor: "#f1f5f9",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                        }}
                    >
                        <Tooltip title="Tampilan Kartu Meluncur (Landscape)">
                            <IconButton
                                size="small"
                                onClick={() => setViewMode("cards")}
                                sx={{
                                    p: 0.6,
                                    borderRadius: "6px",
                                    bgcolor: viewMode === "cards" ? "#ffffff" : "transparent",
                                    color: viewMode === "cards" ? "#0d9488" : "#64748b",
                                    boxShadow: viewMode === "cards" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                                }}
                            >
                                <ViewListIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Tampilan Tabel Ringkas (Seperti Flyer)">
                            <IconButton
                                size="small"
                                onClick={() => setViewMode("table")}
                                sx={{
                                    p: 0.6,
                                    borderRadius: "6px",
                                    bgcolor: viewMode === "table" ? "#ffffff" : "transparent",
                                    color: viewMode === "table" ? "#0d9488" : "#64748b",
                                    boxShadow: viewMode === "table" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                                }}
                            >
                                <TableChartIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Main Schedule Content: Table vs Landscape Cards */}
                {viewMode === "table" ? (
                    <Stack spacing={3} sx={{ maxWidth: "1000px", mx: "auto" }}>
                        {(selectedDayId === "all" ? SCHEDULE_DAYS : [currentDay]).map((day) => {
                            const events = filterEvents(day.events);
                            if (events.length === 0) return null;

                            return (
                                <Box
                                    key={day.id}
                                    sx={{
                                        bgcolor: "#ffffff",
                                        borderRadius: "16px",
                                        border: "1px solid #e2e8f0",
                                        overflow: "hidden",
                                        boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            px: 2.5,
                                            py: 1.2,
                                            bgcolor: "#094d42",
                                            color: "#ffffff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 800, fontSize: "0.95rem" }}>
                                            {day.dateStr} ({day.dayNumber})
                                        </Typography>
                                        <Typography sx={{ color: "#4dd4ac", fontSize: "0.78rem", fontWeight: 600 }}>
                                            {day.badge}
                                        </Typography>
                                    </Box>

                                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                                                    <TableCell sx={{ fontWeight: 800, color: "#1e293b", width: 130, fontSize: "0.78rem" }}>
                                                        TIME (WIB)
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 800, color: "#0d9488", fontSize: "0.78rem" }}>
                                                        GENERAL: SESSION / TOPIC
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 800, color: "#2563eb", width: { xs: 160, sm: 240 }, fontSize: "0.78rem" }}>
                                                        GEOSEA: PARTICIPANT
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {events.map((ev, idx) => (
                                                    <TableRow
                                                        key={idx}
                                                        hover
                                                        sx={{
                                                            bgcolor: ev.highlight ? "rgba(13, 148, 136, 0.02)" : "inherit",
                                                            "&:nth-of-type(even)": { bgcolor: "#fafafa" },
                                                        }}
                                                    >
                                                        <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem", color: "#0f172a", whiteSpace: "nowrap" }}>
                                                            {ev.time}
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: "0.82rem", color: "#334155" }}>
                                                            <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: "#0f172a" }}>
                                                                {ev.generalTopic}
                                                            </Typography>
                                                            {ev.location && ev.track !== "geosea" && (
                                                                <Typography variant="caption" sx={{ color: "#0d9488", display: "block", mt: 0.2 }}>
                                                                    📍 {ev.location}
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: "0.82rem", color: "#1e40af" }}>
                                                            <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: ev.geoseaTopic !== "—" ? "#1e40af" : "#94a3b8" }}>
                                                                {ev.geoseaTopic}
                                                            </Typography>
                                                            {ev.location && ev.track === "geosea" && (
                                                                <Typography variant="caption" sx={{ color: "#2563eb", display: "block", mt: 0.2 }}>
                                                                    📍 {ev.location}
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            );
                        })}
                    </Stack>
                ) : selectedDayId === "all" ? (
                    /* CASE A: All Days in Landscape 4-Column Board (Side-by-Side Horizontally) */
                    <Box sx={{ width: "100%" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, px: 0.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Chip
                                    label="Panorama 4 Hari"
                                    size="small"
                                    sx={{
                                        bgcolor: "#0d9488",
                                        color: "#ffffff",
                                        fontWeight: 800,
                                        fontSize: "0.74rem",
                                        boxShadow: "0 2px 8px rgba(13, 148, 136, 0.3)",
                                    }}
                                />
                                <Typography sx={{ color: "#475569", fontSize: "0.86rem", fontWeight: 700 }}>
                                    Jadwal 4 hari berdampingan ke samping (geser horizontal)
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <IconButton
                                    size="small"
                                    onClick={() => handleScroll("left")}
                                    sx={{
                                        bgcolor: "#ffffff",
                                        border: "1px solid #cbd5e1",
                                        color: "#0d9488",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                                        "&:hover": {
                                            bgcolor: "#f0fdfa",
                                            borderColor: "#0d9488",
                                            transform: "translateX(-2px)",
                                        },
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <ChevronLeftIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => handleScroll("right")}
                                    sx={{
                                        bgcolor: "#ffffff",
                                        border: "1px solid #cbd5e1",
                                        color: "#0d9488",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                                        "&:hover": {
                                            bgcolor: "#f0fdfa",
                                            borderColor: "#0d9488",
                                            transform: "translateX(2px)",
                                        },
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <ChevronRightIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>

                        <Box
                            ref={scrollContainerRef}
                            sx={{
                                display: "flex",
                                overflowX: "auto",
                                gap: 2.5,
                                pb: 2.5,
                                scrollSnapType: "x mandatory",
                                scrollBehavior: "smooth",
                                alignItems: "stretch",
                                "&::-webkit-scrollbar": {
                                    height: 8,
                                },
                                "&::-webkit-scrollbar-track": {
                                    bgcolor: "#f1f5f9",
                                    borderRadius: 4,
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    bgcolor: "#cbd5e1",
                                    borderRadius: 4,
                                    "&:hover": { bgcolor: "#94a3b8" },
                                },
                            }}
                        >
                            {SCHEDULE_DAYS.map((day) => {
                                const dayEvents = filterEvents(day.events);

                                return (
                                    <Box
                                        key={day.id}
                                        sx={{
                                            flex: "0 0 auto",
                                            width: { xs: "290px", sm: "320px", md: "340px" },
                                            scrollSnapAlign: "start",
                                            bgcolor: "#f8fafc",
                                            borderRadius: "18px",
                                            border: "1px solid rgba(226, 232, 240, 0.9)",
                                            overflow: "hidden",
                                            display: "flex",
                                            flexDirection: "column",
                                            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        {/* Day Column Header with Rich Gradient and Ambient Glow */}
                                        <Box
                                            sx={{
                                                p: 2,
                                                background: "linear-gradient(135deg, #052e27 0%, #084c3f 55%, #0d6e5c 100%)",
                                                color: "#ffffff",
                                                borderTop: "3px solid #10b981",
                                                borderBottom: "1px solid rgba(255,255,255,0.1)",
                                                position: "relative",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {/* Subtle ambient light dot in header */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: -20,
                                                    right: -20,
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: '50%',
                                                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
                                                    pointerEvents: 'none',
                                                }}
                                            />
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.8, position: 'relative', zIndex: 1 }}>
                                                <Chip
                                                    label={day.dayNumber}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: "rgba(16, 185, 129, 0.2)",
                                                        color: "#34d399",
                                                        border: "1px solid rgba(52, 211, 153, 0.45)",
                                                        fontWeight: 800,
                                                        fontSize: "0.72rem",
                                                        height: 22,
                                                        backdropFilter: "blur(6px)",
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        bgcolor: "rgba(255, 255, 255, 0.12)",
                                                        px: 1.1,
                                                        py: 0.2,
                                                        borderRadius: "10px",
                                                    }}
                                                >
                                                    <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.72rem", fontWeight: 700 }}>
                                                        {dayEvents.length} Sesi
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: 800,
                                                    fontSize: "1.05rem",
                                                    color: "#ffffff",
                                                    fontFamily: '"Playfair Display", Georgia, serif',
                                                    letterSpacing: '-0.01em',
                                                    position: 'relative',
                                                    zIndex: 1,
                                                }}
                                            >
                                                {day.shortDate}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: "#6ee7b7",
                                                    fontSize: "0.74rem",
                                                    fontWeight: 600,
                                                    display: "block",
                                                    mt: 0.3,
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    position: 'relative',
                                                    zIndex: 1,
                                                }}
                                            >
                                                {day.badge}
                                            </Typography>
                                        </Box>

                                        {/* Column Event Cards List */}
                                        <Box sx={{ p: 1.4, display: "flex", flexDirection: "column", gap: 1.3, flexGrow: 1 }}>
                                            {dayEvents.map((ev, evIdx) => (
                                                <EventCard key={evIdx} event={ev} compact index={evIdx} />
                                            ))}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                ) : (
                    /* CASE B: Single Day in Landscape Horizontal Timeline Track */
                    <Box
                        sx={{
                            bgcolor: "#ffffff",
                            borderRadius: "18px",
                            border: "1px solid #e2e8f0",
                            overflow: "hidden",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                        }}
                    >
                        {/* Day Header Banner with Left / Right Arrows */}
                        <Box
                            sx={{
                                px: { xs: 2, sm: 3 },
                                py: 1.8,
                                background: "linear-gradient(135deg, #052e27 0%, #084c3f 55%, #0d6e5c 100%)",
                                color: "#ffffff",
                                borderTop: "3px solid #10b981",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: 1.5,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                                <Chip
                                    label={currentDay?.dayNumber}
                                    size="small"
                                    sx={{
                                        bgcolor: "rgba(16, 185, 129, 0.2)",
                                        color: "#34d399",
                                        border: "1px solid rgba(52, 211, 153, 0.45)",
                                        fontWeight: 800,
                                        fontSize: "0.74rem",
                                        height: 24,
                                        backdropFilter: "blur(6px)",
                                    }}
                                />
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: { xs: "1.05rem", sm: "1.18rem" },
                                        fontFamily: '"Playfair Display", Georgia, serif',
                                        color: "#ffffff",
                                    }}
                                >
                                    {currentDay?.dateStr}
                                </Typography>
                                <Typography
                                    sx={{
                                        display: { xs: "none", md: "inline" },
                                        color: "#6ee7b7",
                                        fontSize: "0.82rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    — {currentDay?.badge}
                                </Typography>
                            </Box>

                            {/* Scroll Controls & Indicator */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "rgba(255,255,255,0.75)",
                                        fontSize: "0.75rem",
                                        display: { xs: "none", sm: "inline-block" },
                                    }}
                                >
                                    Geser ke samping 👉
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => handleScroll("left")}
                                    sx={{
                                        color: "#ffffff",
                                        bgcolor: "rgba(255,255,255,0.12)",
                                        "&:hover": { bgcolor: "rgba(255,255,255,0.25)", transform: "translateX(-2px)" },
                                        p: 0.6,
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <ChevronLeftIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => handleScroll("right")}
                                    sx={{
                                        color: "#ffffff",
                                        bgcolor: "rgba(255,255,255,0.12)",
                                        "&:hover": { bgcolor: "rgba(255,255,255,0.25)", transform: "translateX(2px)" },
                                        p: 0.6,
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <ChevronRightIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* Horizontal Cards Flow */}
                        <Box
                            ref={scrollContainerRef}
                            sx={{
                                display: "flex",
                                overflowX: "auto",
                                gap: 2,
                                p: { xs: 2, sm: 2.5 },
                                scrollSnapType: "x mandatory",
                                scrollBehavior: "smooth",
                                "&::-webkit-scrollbar": {
                                    height: 8,
                                },
                                "&::-webkit-scrollbar-track": {
                                    bgcolor: "#f1f5f9",
                                    borderRadius: 4,
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    bgcolor: "#cbd5e1",
                                    borderRadius: 4,
                                    "&:hover": { bgcolor: "#94a3b8" },
                                },
                            }}
                        >
                            {singleDayEvents.map((event, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        flex: "0 0 auto",
                                        width: { xs: "280px", sm: "320px", md: "340px" },
                                        scrollSnapAlign: "start",
                                    }}
                                >
                                    <EventCard event={event} index={idx} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
            </Container>

            {/* Fast, Clean Lightbox Dialog with Loading Spinner */}
            <Dialog
                open={flyerOpen}
                onClose={() => setFlyerOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        overflow: 'hidden',
                        bgcolor: '#ffffff',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    },
                }}
            >
                <Box
                    sx={{
                        px: 2.5,
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: '#094d42',
                        color: '#ffffff',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarMonthIcon sx={{ color: '#4dd4ac', fontSize: '1.2rem' }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>
                            Official Program & Schedule Poster
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            variant="contained"
                            size="small"
                            component="a"
                            href="/images/program-schedule.webp"
                            download="PIT-IAGI-GEOSEA-2026-Program-Schedule.webp"
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<DownloadIcon />}
                            sx={{
                                bgcolor: '#0d9488',
                                '&:hover': { bgcolor: '#0f766e' },
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                px: 1.6,
                                boxShadow: 'none',
                            }}
                        >
                            Unduh Poster
                        </Button>
                        <IconButton
                            onClick={() => setFlyerOpen(false)}
                            sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#ffffff' }, p: 0.5 }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <Box
                    sx={{
                        p: { xs: 1.5, sm: 2.5 },
                        maxHeight: '82vh',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: '#f8fafc',
                    }}
                >
                    {flyerLoading && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 1.5 }}>
                            <CircularProgress size={36} sx={{ color: '#0d9488' }} />
                            <Typography sx={{ color: '#64748b', fontSize: '0.84rem', fontWeight: 600 }}>
                                Memuat poster rundown...
                            </Typography>
                        </Box>
                    )}
                    <Box
                        component="img"
                        src="/images/program-schedule.webp"
                        alt="PIT IAGI - GEOSEA XIX 2026 Official Program & Schedule"
                        onLoad={() => setFlyerLoading(false)}
                        onError={(e) => {
                            e.target.src = '/images/program-schedule.jpg';
                            setFlyerLoading(false);
                        }}
                        sx={{
                            display: flyerLoading ? 'none' : 'block',
                            width: '100%',
                            maxWidth: '720px',
                            height: 'auto',
                            borderRadius: '8px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        }}
                    />
                </Box>
            </Dialog>
        </Box>
    );
}
