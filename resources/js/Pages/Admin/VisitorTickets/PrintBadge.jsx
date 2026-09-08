import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Box,
    Typography,
    Button,
    Chip,
    Stack,
    Tooltip,
    Paper,
    CircularProgress,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

// 9 Official Lanyard Badge SVG Designs
export const BADGE_TEMPLATES = {
    // 1. Participant
    iagi_member_professional: '/images/badges/Participant.svg',
    non_iagi_member_professional: '/images/badges/Participant.svg',
    iagi_member_expatriate: '/images/badges/Participant.svg',
    non_iagi_member_expatriate: '/images/badges/Participant.svg',
    student_undergraduate: '/images/badges/Participant.svg',

    // 2. Visitor
    non_exclusive: '/images/badges/Visitor.svg',

    // 3. VIP
    vip: '/images/badges/VIP.svg',
    exclusive: '/images/badges/VIP.svg',

    // 4. Speaker
    speaker: '/images/badges/Speaker.svg',

    // 5. Panelist
    panelist: '/images/badges/Panelist.svg',

    // 6. Moderator
    moderator: '/images/badges/Moderator.svg',

    // 7. Exhibition
    exhibition: '/images/badges/Exhibitor.svg',

    // 8. Committee
    committee: '/images/badges/Committee.svg',

    // 9. Student Volunteer
    student_volunteer: '/images/badges/Student_Volunteer.svg',
};

const CATEGORY_MAP = {
    // 1. Participant
    iagi_member_professional: { label: 'PARTICIPANT: PROFESSIONAL (MEMBER)', short: 'PRO MEMBER' },
    non_iagi_member_professional: { label: 'PARTICIPANT: PROFESSIONAL (NON-MEMBER)', short: 'PRO NON-MEMBER' },
    iagi_member_expatriate: { label: 'PARTICIPANT: EXPATRIATE (MEMBER)', short: 'EXPAT MEMBER' },
    non_iagi_member_expatriate: { label: 'PARTICIPANT: EXPATRIATE (NON-MEMBER)', short: 'EXPAT NON-MEMBER' },
    student_undergraduate: { label: 'PARTICIPANT: STUDENT UNDERGRADUATE', short: 'STUDENT' },

    // 2. Visitor
    non_exclusive: { label: 'VISITOR PASS', short: 'VISITOR' },

    // 3. VIP
    vip: { label: 'VIP', short: 'VIP' },
    exclusive: { label: 'VIP', short: 'VIP' },

    // 4. Speaker
    speaker: { label: 'SPEAKER', short: 'SPEAKER' },

    // 5. Panelist
    panelist: { label: 'PANELIST', short: 'PANELIST' },

    // 6. Moderator
    moderator: { label: 'MODERATOR', short: 'MODERATOR' },

    // 7. Exhibition
    exhibition: { label: 'EXHIBITION', short: 'EXHIBITION' },

    // 8. Committee
    committee: { label: 'COMMITTEE', short: 'COMMITTEE' },

    // 9. Student Volunteer
    student_volunteer: { label: 'STUDENT VOLUNTEER', short: 'STUDENT VOLUNTEER' },
};

function SingleLanyardCard({ ticket, templatePath, isBulk }) {
    const visitorType = ticket.visitor_type || 'non_exclusive';
    const cat = CATEGORY_MAP[visitorType] || CATEGORY_MAP.non_exclusive;
    const bgImage = templatePath || ticket.templatePath || BADGE_TEMPLATES[visitorType] || '/images/badges/Participant.svg';

    const nameLength = (ticket.visitor_name || '').length;
    const nameFontSize = nameLength > 28 ? '1.05rem' : nameLength > 20 ? '1.22rem' : '1.4rem';

    const institutionLength = (ticket.visitor_institution || '').length;
    const instFontSize = institutionLength > 28 ? '0.82rem' : institutionLength > 20 ? '0.92rem' : '1.02rem';

    return (
        <Box
            className="badge-page"
            sx={{
                width: { xs: '330px', sm: '380px' },
                height: { xs: '523px', sm: '602px' },
                bgcolor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: `url('${bgImage}')`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                flexShrink: 0,
                '@media print': {
                    boxShadow: 'none !important',
                    borderRadius: '0 !important',
                    width: '100mm !important',
                    height: '158.6mm !important',
                    margin: '0 auto !important',
                    pageBreakInside: 'avoid !important',
                    breakInside: 'avoid !important',
                    pageBreakAfter: 'always !important',
                    breakAfter: 'page !important',
                },
            }}
        >
            {/* 1. VISITOR NAME OVERLAY (Positioned INSIDE the Blue Pill Box at y: 765.5 - 856.5 / 61.1% - 68.35% with WHITE FONT) */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '61.1%',
                    height: '7.25%',
                    left: '15.5%',
                    right: '15.5%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    zIndex: 5,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 900,
                        color: '#ffffff',
                        fontSize: nameFontSize,
                        fontFamily: "'Inter', 'Montserrat', 'Roboto', sans-serif",
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        lineHeight: 1.15,
                        wordBreak: 'break-word',
                        textAlign: 'center',
                        width: '100%',
                        textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                        '@media print': {
                            color: '#ffffff !important',
                            fontSize: nameLength > 28 ? '10pt' : nameLength > 20 ? '12pt' : '14pt',
                        },
                    }}
                >
                    {ticket.visitor_name}
                </Typography>
            </Box>

            {/* 2. INSTITUTION OVERLAY (Positioned BELOW the Blue Box at y: 865 - 922.6 / 68.8% - 73.6% right above underline) */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '68.8%',
                    height: '4.8%',
                    left: '10%',
                    right: '10%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    textAlign: 'center',
                    pb: '2px',
                    zIndex: 5,
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 800,
                        color: '#0f172a',
                        fontSize: instFontSize,
                        fontFamily: "'Inter', 'Montserrat', 'Roboto', sans-serif",
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        lineHeight: 1.15,
                        wordBreak: 'break-word',
                        textAlign: 'center',
                        width: '100%',
                        '@media print': {
                            color: '#000000 !important',
                            fontSize: institutionLength > 28 ? '8.5pt' : institutionLength > 20 ? '9.5pt' : '11pt',
                        },
                    }}
                >
                    {ticket.visitor_institution || '-'}
                </Typography>
            </Box>
        </Box>
    );
}

export default function PrintBadge({
    ticket = {},
    tickets = [],
    templatePath = null,
    isBulk = false,
    totalCount = 0,
}) {
    // Standardize badge list
    const badgeList = tickets && tickets.length > 0 ? tickets : ticket && ticket.id ? [ticket] : [];
    const count = badgeList.length;

    const singleVisitorType = badgeList[0]?.visitor_type || 'non_exclusive';
    const singleCat = CATEGORY_MAP[singleVisitorType] || CATEGORY_MAP.non_exclusive;

    const pageTitle = isBulk || count > 1
        ? `Print ${count} Lanyard Badges - 55th PIT IAGI & GEOSEA 2026`
        : `Print Badge: ${badgeList[0]?.visitor_name || 'Visitor'} - ${singleCat.label} - 55th PIT IAGI & GEOSEA 2026`;

    useEffect(() => {
        // Collect all distinct background image URLs
        const urls = new Set();
        badgeList.forEach(t => {
            const path = templatePath || t.templatePath || BADGE_TEMPLATES[t.visitor_type] || '/images/badges/Participant.svg';
            urls.add(path);
        });

        let printed = false;
        const triggerPrint = () => {
            if (printed) return;
            printed = true;
            window.print();
        };

        // Preload all background images
        let loaded = 0;
        const total = urls.size;
        if (total === 0) {
            triggerPrint();
            return;
        }

        urls.forEach(url => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                loaded++;
                if (loaded >= total) {
                    setTimeout(triggerPrint, 300);
                }
            };
            img.onerror = () => {
                loaded++;
                if (loaded >= total) {
                    setTimeout(triggerPrint, 300);
                }
            };
        });

        const fallbackTimer = setTimeout(triggerPrint, 800);
        return () => clearTimeout(fallbackTimer);
    }, []);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#0f172a',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: { xs: 1.5, sm: 3 },
                '@media print': {
                    bgcolor: '#ffffff !important',
                    p: '0 !important',
                    m: '0 !important',
                    minHeight: 'auto !important',
                    display: 'block !important',
                },
            }}
        >
            <Head title={pageTitle} />

            {/* Print Styling Fixes */}
            <style>
                {`
                    @media print {
                        @page {
                            size: portrait;
                            margin: 0mm;
                        }
                        html, body {
                            background: #ffffff !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                        .badge-page {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            page-break-after: always !important;
                            break-after: page !important;
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                            display: block !important;
                            margin: 0 auto !important;
                        }
                        .badge-page:last-of-type {
                            page-break-after: auto !important;
                            break-after: auto !important;
                        }
                    }
                `}
            </style>

            {/* Top Action Bar (hidden when printing) */}
            <Box
                sx={{
                    mb: 3,
                    width: '100%',
                    maxWidth: '1200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    flexWrap: 'wrap',
                    p: 2,
                    px: 3,
                    borderRadius: '16px',
                    bgcolor: '#1e293b',
                    border: '1px solid #334155',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    '@media print': { display: 'none !important' },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', fontSize: '1rem', letterSpacing: '-0.01em' }}>
                        🖨️ Lanyard Badge Printing
                    </Typography>
                    <Chip
                        label={`${count} ${count > 1 ? 'Badges' : 'Badge'} Ready`}
                        size="small"
                        sx={{ bgcolor: '#10b981', color: '#ffffff', fontWeight: 900, fontSize: '0.72rem' }}
                    />
                </Box>

                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                    <Button
                        variant="contained"
                        startIcon={<PrintIcon />}
                        onClick={() => window.print()}
                        sx={{
                            bgcolor: '#10b981',
                            color: '#ffffff',
                            fontWeight: 900,
                            fontSize: '0.88rem',
                            borderRadius: '12px',
                            textTransform: 'none',
                            px: 3,
                            py: 0.9,
                            boxShadow: '0 4px 0 #047857, 0 8px 20px rgba(16,185,129,0.3)',
                            '&:hover': { bgcolor: '#059669', transform: 'translateY(-1px)' },
                            '&:active': { transform: 'translateY(1px)', boxShadow: '0 2px 0 #047857' },
                        }}
                    >
                        Print {count > 1 ? `All ${count} Badges` : 'Badge'}
                    </Button>

                    <Button
                        component={Link}
                        href={route('admin.visitorTickets')}
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: '#cbd5e1',
                            borderColor: '#475569',
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: '12px',
                            px: 2,
                            py: 0.8,
                            '&:hover': { color: '#ffffff', borderColor: '#94a3b8', bgcolor: 'rgba(255,255,255,0.05)' },
                        }}
                    >
                        Back to Visitor Tickets
                    </Button>
                </Stack>
            </Box>

            {/* Badges Display Container */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: { xs: 3, sm: 4 },
                    width: '100%',
                    maxWidth: '1300px',
                    pb: 6,
                    '@media print': {
                        display: 'block !important',
                        p: 0,
                        m: 0,
                    },
                }}
            >
                {badgeList.map((t, idx) => (
                    <Box
                        key={t.id || idx}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1.5,
                            '@media print': {
                                display: 'block !important',
                                m: 0,
                                p: 0,
                            },
                        }}
                    >
                        {/* Screen Label (hidden on print) */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                '@media print': { display: 'none !important' },
                            }}
                        >
                            <Chip
                                label={`#${idx + 1} • ${t.ticket_code}`}
                                size="small"
                                sx={{ bgcolor: '#334155', color: '#f8fafc', fontWeight: 800, fontSize: '0.7rem' }}
                            />
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                {t.visitor_name}
                            </Typography>
                        </Box>

                        {/* Physical Lanyard Card Component */}
                        <SingleLanyardCard
                            ticket={t}
                            templatePath={templatePath}
                            isBulk={isBulk || count > 1}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
