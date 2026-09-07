import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    Box,
    Typography,
    Button,
    Chip,
    Stack,
    Tooltip,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';

// 9 Official Lanyard Badge SVG Designs
export const BADGE_TEMPLATES = {
    // 1. VIP (Invited / Free) & Exclusive VIP
    vip: '/images/badges/VIP.svg',
    exclusive: '/images/badges/VIP.svg',

    // 2. Speaker (Invited / Free)
    speaker: '/images/badges/Speaker.svg',

    // 3. Panelist (Invited / Free)
    panelist: '/images/badges/Panelist.svg',

    // 4. Moderator (Invited / Free)
    moderator: '/images/badges/Moderator.svg',

    // 5. Exhibition (Invited / Free)
    exhibition: '/images/badges/Exhibitor.svg',

    // 6. Committee (Invited / Free)
    committee: '/images/badges/Committee.svg',

    // 7. Student Volunteer (Invited / Free)
    student_volunteer: '/images/badges/Student_Volunteer.svg',

    // 8. Conference & Standard Categories (Participant)
    iagi_member_professional: '/images/badges/Participant.svg',
    non_iagi_member_professional: '/images/badges/Participant.svg',
    iagi_member_expatriate: '/images/badges/Participant.svg',
    non_iagi_member_expatriate: '/images/badges/Participant.svg',
    student_undergraduate: '/images/badges/Participant.svg',
    student_postgraduate: '/images/badges/Participant.svg',
    general_ticket: '/images/badges/Participant.svg',

    // 9. Visitor Pass
    non_exclusive: '/images/badges/Visitor.svg',
};

const CATEGORY_MAP = {
    vip: { label: 'VIP', short: 'VIP' },
    speaker: { label: 'SPEAKER', short: 'SPEAKER' },
    panelist: { label: 'PANELIST', short: 'PANELIST' },
    moderator: { label: 'MODERATOR', short: 'MODERATOR' },
    exhibition: { label: 'EXHIBITOR', short: 'EXHIBITOR' },
    committee: { label: 'COMMITTEE', short: 'COMMITTEE' },
    student_volunteer: { label: 'STUDENT VOLUNTEER', short: 'VOLUNTEER' },
    iagi_member_professional: { label: 'IAGI MEMBER - PROFESSIONAL', short: 'IAGI PRO' },
    non_iagi_member_professional: { label: 'NON IAGI MEMBER - PROFESSIONAL', short: 'NON-IAGI PRO' },
    iagi_member_expatriate: { label: 'IAGI MEMBER - EXPATRIATE', short: 'IAGI EXPAT' },
    non_iagi_member_expatriate: { label: 'NON IAGI MEMBER - EXPATRIATE', short: 'NON-IAGI EXPAT' },
    student_undergraduate: { label: 'STUDENT UNDERGRADUATE', short: 'STUDENT' },
    student_postgraduate: { label: 'STUDENT POSTGRADUATE', short: 'POSTGRAD' },
    general_ticket: { label: 'PARTICIPANT', short: 'PARTICIPANT' },
    exclusive: { label: 'VIP PASS', short: 'VIP' },
    non_exclusive: { label: 'VISITOR PASS', short: 'VISITOR' },
};

export default function PrintBadge({
    ticket = {},
    templatePath = null,
}) {
    const visitorType = ticket.visitor_type || 'non_exclusive';
    const cat = CATEGORY_MAP[visitorType] || CATEGORY_MAP.non_exclusive;

    // Resolve template SVG based on category
    const defaultTemplate = BADGE_TEMPLATES[visitorType] || '/images/badges/Participant.svg';
    const bgImage = templatePath || defaultTemplate;

    useEffect(() => {
        // Preload image and auto trigger system print dialog
        let printed = false;
        const triggerPrint = () => {
            if (printed) return;
            printed = true;
            window.print();
        };

        const img = new Image();
        img.src = bgImage;
        img.onload = () => {
            setTimeout(triggerPrint, 250);
        };

        // Fallback timer
        const timer = setTimeout(triggerPrint, 600);

        return () => clearTimeout(timer);
    }, [bgImage]);

    const nameLength = (ticket.visitor_name || '').length;
    const nameFontSize = nameLength > 28 ? '1.05rem' : nameLength > 20 ? '1.22rem' : '1.4rem';

    const institutionLength = (ticket.visitor_institution || '').length;
    const instFontSize = institutionLength > 28 ? '0.82rem' : institutionLength > 20 ? '0.92rem' : '1.02rem';

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#0f172a',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 1.5, sm: 3 },
                '@media print': {
                    bgcolor: '#fff',
                    p: 0,
                    minHeight: 'auto',
                },
            }}
        >
            <Head title={`Print Badge: ${ticket.visitor_name} - ${cat.label} - 55th PIT IAGI & GEOSEA 2026`} />

            {/* Print Styling Fixes */}
            <style>
                {`
                    @media print {
                        @page {
                            size: portrait;
                            margin: 0;
                        }
                        body {
                            background: #ffffff !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        #lanyard-card {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                `}
            </style>

            {/* Top Action Bar (hidden when printing) */}
            <Box
                sx={{
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.5,
                    flexWrap: 'wrap',
                    '@media print': { display: 'none' },
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={() => window.print()}
                    sx={{
                        bgcolor: '#10b981',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        borderRadius: '12px',
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        boxShadow: '0 4px 0 #047857, 0 8px 20px rgba(16,185,129,0.3)',
                        '&:hover': { bgcolor: '#059669', transform: 'translateY(-1px)' },
                    }}
                >
                    Print Lanyard Badge ({cat.short})
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    onClick={() => window.close()}
                    sx={{
                        color: '#94a3b8',
                        borderColor: '#475569',
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: '12px',
                        px: 2,
                        py: 0.9,
                        '&:hover': { color: '#ffffff', borderColor: '#cbd5e1' },
                    }}
                >
                    Close Window
                </Button>
            </Box>

            {/* Physical Lanyard Card Container (Matches 790x1253 aspect ratio = 0.6305 : 1) */}
            <Box
                id="lanyard-card"
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
                    '@media print': {
                        boxShadow: 'none',
                        borderRadius: 0,
                        width: '100mm',
                        height: '158.6mm',
                        pageBreakInside: 'avoid',
                        margin: '0 auto',
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
        </Box>
    );
}
