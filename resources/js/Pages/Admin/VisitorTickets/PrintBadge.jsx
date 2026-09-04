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

const CATEGORY_MAP = {
    // Invited Categories
    vip: {
        label: 'VIP',
        badge: 'VIP GUEST',
        banner: '#d97706',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
        border: '#d97706',
        textColor: '#ffffff',
    },
    speaker: {
        label: 'SPEAKER',
        badge: 'SPEAKER',
        banner: '#db2777',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
        border: '#db2777',
        textColor: '#ffffff',
    },
    panelist: {
        label: 'PANELIST',
        badge: 'PANELIST',
        banner: '#7c3aed',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        border: '#7c3aed',
        textColor: '#ffffff',
    },
    moderator: {
        label: 'MODERATOR',
        badge: 'MODERATOR',
        banner: '#0891b2',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)',
        border: '#0891b2',
        textColor: '#ffffff',
    },
    exhibition: {
        label: 'EXHIBITOR',
        badge: 'EXHIBITOR',
        banner: '#ea580c',
        gradient: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)',
        border: '#ea580c',
        textColor: '#ffffff',
    },
    committee: {
        label: 'COMMITTEE',
        badge: 'COMMITTEE',
        banner: '#2563eb',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        border: '#2563eb',
        textColor: '#ffffff',
    },
    student_volunteer: {
        label: 'STUDENT VOLUNTEER',
        badge: 'VOLUNTEER',
        banner: '#16a34a',
        gradient: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
        border: '#16a34a',
        textColor: '#ffffff',
    },
    // Conference / Standard Categories
    iagi_member_professional: {
        label: 'IAGI MEMBER - PROFESSIONAL',
        badge: 'IAGI PRO',
        banner: '#094d42',
        gradient: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 100%)',
        border: '#094d42',
        textColor: '#ffffff',
    },
    non_iagi_member_professional: {
        label: 'NON IAGI MEMBER - PROFESSIONAL',
        badge: 'NON-IAGI PRO',
        banner: '#0284c7',
        gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        border: '#0284c7',
        textColor: '#ffffff',
    },
    iagi_member_expatriate: {
        label: 'IAGI MEMBER - EXPATRIATE',
        badge: 'INTERNATIONAL DELEGATE',
        banner: '#7c3aed',
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
        border: '#7c3aed',
        textColor: '#ffffff',
    },
    non_iagi_member_expatriate: {
        label: 'NON IAGI MEMBER - EXPATRIATE',
        badge: 'INTERNATIONAL DELEGATE',
        banner: '#6d28d9',
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
        border: '#6d28d9',
        textColor: '#ffffff',
    },
    student_undergraduate: {
        label: 'STUDENT UNDERGRADUATE',
        badge: 'STUDENT',
        banner: '#4338ca',
        gradient: 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
        border: '#4338ca',
        textColor: '#ffffff',
    },
    student_postgraduate: {
        label: 'STUDENT POSTGRADUATE',
        badge: 'POSTGRADUATE',
        banner: '#4f46e5',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        border: '#4f46e5',
        textColor: '#ffffff',
    },
    general_ticket: {
        label: 'PARTICIPANT',
        badge: 'PARTICIPANT',
        banner: '#059669',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        border: '#059669',
        textColor: '#ffffff',
    },
    exclusive: {
        label: 'VISITOR EXCLUSIVE (VIP)',
        badge: 'VIP PASS',
        banner: '#d97706',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        border: '#d97706',
        textColor: '#ffffff',
    },
    non_exclusive: {
        label: 'PARTICIPANT',
        badge: 'PARTICIPANT',
        banner: '#059669',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        border: '#059669',
        textColor: '#ffffff',
    },
};

export default function PrintBadge({
    ticket = {},
    templatePath = null,
}) {
    const cat = CATEGORY_MAP[ticket.visitor_type] || CATEGORY_MAP.non_exclusive;
    const [customCategoryBanner, setCustomCategoryBanner] = useState(
        ticket.visitor_type && !['non_exclusive', 'general_ticket'].includes(ticket.visitor_type)
    );

    const defaultTemplate = '/images/lanyard-badge-template.png';
    const bgImage = templatePath || defaultTemplate;

    useEffect(() => {
        // Preload image and wait for document ready
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
    const nameFontSize = nameLength > 28 ? '1.05rem' : nameLength > 20 ? '1.2rem' : '1.38rem';

    const institutionLength = (ticket.visitor_institution || '').length;
    const instFontSize = institutionLength > 28 ? '0.85rem' : institutionLength > 20 ? '0.95rem' : '1.08rem';

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
            <Head title={`Print Badge: ${ticket.visitor_name} - 55th PIT IAGI & GEOSEA 2026`} />

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
                    Print Lanyard Badge
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

            {/* Physical Lanyard Card Container (Matches 638x1011 aspect ratio = 0.631 : 1) */}
            <Box
                id="lanyard-card"
                sx={{
                    width: { xs: '330px', sm: '380px' },
                    height: { xs: '522px', sm: '602px' },
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
                        height: '158mm',
                        pageBreakInside: 'avoid',
                        margin: '0 auto',
                    },
                }}
            >
                {/* VISITOR NAME INPUT OVERLAY (Sits right above the Name line at y: 57.3%) */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '49.5%',
                        height: '7.8%',
                        left: '8%',
                        right: '8%',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        textAlign: 'center',
                        pb: '1px',
                        zIndex: 5,
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 900,
                            color: '#0f172a',
                            fontSize: nameFontSize,
                            fontFamily: "'Inter', 'Montserrat', 'Roboto', sans-serif",
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            lineHeight: 1.1,
                            wordBreak: 'break-word',
                            textAlign: 'center',
                            width: '100%',
                            textShadow: '0 0 1px rgba(255,255,255,0.8)',
                            '@media print': {
                                color: '#000000',
                                fontSize: nameLength > 28 ? '11pt' : nameLength > 20 ? '13pt' : '15pt',
                            },
                        }}
                    >
                        {ticket.visitor_name}
                    </Typography>
                </Box>

                {/* INSTITUTION INPUT OVERLAY (Sits right above the Institution line at y: 66.6%) */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '59.8%',
                        height: '6.8%',
                        left: '8%',
                        right: '8%',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        textAlign: 'center',
                        pb: '1px',
                        zIndex: 5,
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 800,
                            color: '#1e293b',
                            fontSize: instFontSize,
                            fontFamily: "'Inter', 'Montserrat', 'Roboto', sans-serif",
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            lineHeight: 1.15,
                            wordBreak: 'break-word',
                            textAlign: 'center',
                            width: '100%',
                            textShadow: '0 0 1px rgba(255,255,255,0.8)',
                            '@media print': {
                                color: '#000000',
                                fontSize: institutionLength > 28 ? '9pt' : institutionLength > 20 ? '10pt' : '11.5pt',
                            },
                        }}
                    >
                        {ticket.visitor_institution || '-'}
                    </Typography>
                </Box>

                {/* DYNAMIC CATEGORY BANNER OVERLAY (For VIP, Speaker, Committee, Moderator, Exhibitor, etc.) */}
                {customCategoryBanner && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '86.8%',
                            bottom: '4.8%',
                            left: '5%',
                            right: '5%',
                            borderRadius: '12px',
                            background: cat.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            zIndex: 8,
                            px: 2,
                            '@media print': {
                                borderRadius: '3mm',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 950,
                                color: cat.textColor,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                fontSize: { xs: '1.25rem', sm: '1.45rem' },
                                fontFamily: "'Inter', 'Montserrat', sans-serif",
                                textAlign: 'center',
                                '@media print': {
                                    fontSize: '15pt',
                                    color: '#ffffff !important',
                                },
                            }}
                        >
                            {cat.label}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
