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

// 9 Official Lanyard Badge Designs (High-Res 790x1253 PNG for fast, reliable, zero-latency printing)
export const BADGE_TEMPLATES = {
    // 1. Participant
    iagi_member_professional: '/images/badges/Participant.png',
    non_iagi_member_professional: '/images/badges/Participant.png',
    iagi_member_expatriate: '/images/badges/Participant.png',
    non_iagi_member_expatriate: '/images/badges/Participant.png',
    student_undergraduate: '/images/badges/Student.png',
    dosen: '/images/badges/Participant.png',
    student: '/images/badges/Student.png',

    // 2. Visitor
    non_exclusive: '/images/badges/Visitor.png',

    // 3. VIP
    vip: '/images/badges/VIP.png',
    exclusive: '/images/badges/VIP.png',

    // 4. Keynote Speaker
    speaker: '/images/badges/Speaker.png',
    keynote_speech: '/images/badges/Speaker.png',
    keynote_speaker: '/images/badges/Speaker.png',

    // 5. Panelist
    panelist: '/images/badges/Panelist.png',

    // 6. Moderator
    moderator: '/images/badges/Moderator.png',

    // 7. Exhibition
    exhibition: '/images/badges/Exhibitor.png',

    // 8. Committee
    committee: '/images/badges/Committee.png',

    // 9. Student Volunteer
    student_volunteer: '/images/badges/Student_Volunteer.png',

    // 10. Board
    board: '/images/badges/Board.png',

    // 11. Delegate
    sponsorship: '/images/badges/Sponsorship.png',
    sponsor: '/images/badges/Sponsorship.png',
    delegate: '/images/badges/Sponsorship.png',

    // 12. Student Crowd
    student_crowd: '/images/badges/Student.png',

    // Technical
    presenter: '/images/badges/Presenter.png',
    invited_speaker: '/images/badges/Invited_Speaker.png',
    session_chair_judge: '/images/badges/Session_Chair_Judge.png',
    session_chair: '/images/badges/Session_Chair.png',
    judge: '/images/badges/Judge.png',
    oral: '/images/badges/Presenter.png',
    oral_presenter: '/images/badges/Presenter.png',
    poster: '/images/badges/Presenter.png',
    poster_presenter: '/images/badges/Presenter.png',
};

const CATEGORY_MAP = {
    // 1. Participant
    iagi_member_professional: { label: 'PARTICIPANT: PROFESSIONAL (MEMBER)', short: 'PRO MEMBER' },
    non_iagi_member_professional: { label: 'PARTICIPANT: PROFESSIONAL (NON-MEMBER)', short: 'PRO NON-MEMBER' },
    iagi_member_expatriate: { label: 'PARTICIPANT: EXPATRIATE (MEMBER)', short: 'EXPAT MEMBER' },
    non_iagi_member_expatriate: { label: 'PARTICIPANT: EXPATRIATE (NON-MEMBER)', short: 'EXPAT NON-MEMBER' },
    student_undergraduate: { label: 'PARTICIPANT: STUDENT UNDERGRADUATE', short: 'STUDENT' },
    dosen: { label: 'PARTICIPANT: DOSEN', short: 'DOSEN' },

    // 2. Technical
    student: { label: 'PRESENTER', short: 'PRESENTER' },
    presenter: { label: 'PRESENTER', short: 'PRESENTER' },
    invited_speaker: { label: 'INVITED SPEAKER', short: 'INVITED SPEAKER' },
    session_chair_judge: { label: 'SESSION CHAIR / JUDGE', short: 'CHAIR / JUDGE' },
    session_chair: { label: 'SESSION CHAIR', short: 'SESSION CHAIR' },
    judge: { label: 'JUDGE', short: 'JUDGE' },
    oral: { label: 'PRESENTER', short: 'PRESENTER' },
    oral_presenter: { label: 'PRESENTER', short: 'PRESENTER' },
    poster: { label: 'PRESENTER', short: 'PRESENTER' },
    poster_presenter: { label: 'PRESENTER', short: 'PRESENTER' },

    // 3. Visitor
    non_exclusive: { label: 'VISITOR PASS', short: 'VISITOR' },

    // 4. VIP
    vip: { label: 'VIP', short: 'VIP' },
    exclusive: { label: 'VIP', short: 'VIP' },

    // 5. Keynote Speaker
    speaker: { label: 'KEYNOTE SPEAKER', short: 'KEYNOTE SPEAKER' },
    keynote_speech: { label: 'KEYNOTE SPEAKER', short: 'KEYNOTE SPEAKER' },
    keynote_speaker: { label: 'KEYNOTE SPEAKER', short: 'KEYNOTE SPEAKER' },

    // 6. Panelist
    panelist: { label: 'PANELIST', short: 'PANELIST' },

    // 7. Moderator
    moderator: { label: 'MODERATOR', short: 'MODERATOR' },

    // 8. Exhibition
    exhibition: { label: 'EXHIBITION', short: 'EXHIBITION' },

    // 9. Committee
    committee: { label: 'COMMITTEE', short: 'COMMITTEE' },

    // 10. Student Volunteer
    student_volunteer: { label: 'STUDENT VOLUNTEER', short: 'STUDENT VOLUNTEER' },

    // 11. Board
    board: { label: 'BOARD', short: 'BOARD' },

    // 12. Delegate
    sponsorship: { label: 'DELEGATE', short: 'DELEGATE' },
    sponsor: { label: 'DELEGATE', short: 'DELEGATE' },
    delegate: { label: 'DELEGATE', short: 'DELEGATE' },

    // 13. Student Crowd
    student_crowd: { label: 'STUDENT CROWD', short: 'STUDENT CROWD' },
};

export const BADGE_VERSION = '20261031_original_clean_v9';

export function appendBadgeVersion(url) {
    if (!url) return url;
    if (url.includes('?v=') || url.includes('&v=')) return url;
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}v=${BADGE_VERSION}`;
}

function SingleLanyardCard({
    ticket,
    templatePath,
    isBulk,
    showHoleGuide = true,
    holeShape = 'slot',
    holePosition = 2.75,
}) {
    const visitorType = ticket.visitor_type || 'non_exclusive';
    const cat = CATEGORY_MAP[visitorType] || CATEGORY_MAP.non_exclusive;
    let rawBg = templatePath || ticket.templatePath || BADGE_TEMPLATES[visitorType] || '/images/badges/Participant.png';

    // Prefer high-res PNG (5x lighter & instant rendering vs 4.4MB SVG)
    if (rawBg && rawBg.includes('.svg')) {
        rawBg = rawBg.replace(/\.svg(\?.*)?$/i, '.png$1');
    }
    const bgImage = appendBadgeVersion(rawBg);

    const isVisitor = visitorType === 'non_exclusive' || visitorType === 'visitor' || (bgImage && bgImage.toLowerCase().includes('visitor.'));

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
                flexShrink: 0,
                '@media print': {
                    boxShadow: 'none !important',
                    borderRadius: '0 !important',
                    width: '54mm !important',
                    height: '85.6mm !important',
                    minWidth: '54mm !important',
                    maxWidth: '54mm !important',
                    minHeight: '85.6mm !important',
                    maxHeight: '85.6mm !important',
                    margin: '0 auto !important',
                    padding: '0 !important',
                    pageBreakInside: 'avoid !important',
                    breakInside: 'avoid !important',
                    pageBreakAfter: 'always !important',
                    breakAfter: 'page !important',
                },
            }}
        >
            {/* Real DOM Image Element - Full edge-to-edge with natural card background & contours */}
            <img
                src={bgImage}
                alt="Badge Background"
                className="badge-bg-img"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                    zIndex: 1,
                    pointerEvents: 'none',
                    display: 'block',
                }}
            />

            {/* Lanyard Hole Punch Visual Guide - Placed in SAFE CLEAR ZONE between yellow line and logos (NEVER touching yellow line or logos) */}
            {showHoleGuide && (
                <Box
                    className="badge-hole-guide"
                    sx={{
                        position: 'absolute',
                        top: `${(holePosition / 85.6) * 100}%`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: holeShape === 'round'
                            ? `${(2.8 / 54) * 100}%`
                            : `${(12.5 / 54) * 100}%`,
                        height: holeShape === 'round'
                            ? `${(2.8 / 85.6) * 100}%`
                            : `${(2.4 / 85.6) * 100}%`,
                        borderRadius: '100px',
                        border: '1.2px dashed rgba(71, 85, 105, 0.75)',
                        bgcolor: 'transparent',
                        zIndex: 10,
                        pointerEvents: 'none',
                        boxSizing: 'border-box',
                        '@media print': {
                            top: `${holePosition}mm !important`,
                            width: holeShape === 'round' ? '2.8mm !important' : '12.5mm !important',
                            height: holeShape === 'round' ? '2.8mm !important' : '2.4mm !important',
                            border: '0.6pt dashed rgba(71, 85, 105, 0.8) !important',
                            bgcolor: 'transparent !important',
                        },
                    }}
                />
            )}

            {/* 1. VISITOR NAME OVERLAY (Positioned INSIDE the Pill Box at y: 765.5 - 856.5 / 61.1% - 68.35% - BLACK FONT FOR VISITOR, WHITE FOR OTHERS) */}
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
                        color: isVisitor ? '#000000' : '#ffffff',
                        fontSize: nameFontSize,
                        fontFamily: "'Inter', 'Montserrat', 'Roboto', sans-serif",
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        lineHeight: 1.15,
                        wordBreak: 'break-word',
                        textAlign: 'center',
                        width: '100%',
                        textShadow: isVisitor ? 'none' : '0 1px 4px rgba(0,0,0,0.3)',
                        '@media print': {
                            color: isVisitor ? '#000000 !important' : '#ffffff !important',
                            fontSize: nameLength > 28 ? '6.5pt !important' : nameLength > 20 ? '7.5pt !important' : nameLength > 14 ? '8.5pt !important' : '9.5pt !important',
                            lineHeight: '1.15 !important',
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
                            fontSize: institutionLength > 28 ? '5.5pt !important' : institutionLength > 20 ? '6.5pt !important' : '7.5pt !important',
                            lineHeight: '1.15 !important',
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

    const [imagesReady, setImagesReady] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);

    // Lanyard hole punch visual guide settings (positioned directly on natural card background above logos)
    const [showHoleGuide, setShowHoleGuide] = useState(() => {
        try {
            const saved = localStorage.getItem('badge_show_hole_guide');
            return saved !== null ? saved === 'true' : true;
        } catch {
            return true;
        }
    });

    const [holeShape, setHoleShape] = useState(() => {
        try {
            return localStorage.getItem('badge_hole_shape') || 'slot';
        } catch {
            return 'slot';
        }
    });

    const [holePosition, setHolePosition] = useState(() => {
        try {
            const saved = localStorage.getItem('badge_hole_position_v3');
            return saved !== null ? Number(saved) : 2.75; // 2.75mm from top (safely between yellow line at 2.3mm and logos at 5.6mm)
        } catch {
            return 2.75;
        }
    });

    const handleToggleHoleGuide = () => {
        const next = !showHoleGuide;
        setShowHoleGuide(next);
        try {
            localStorage.setItem('badge_show_hole_guide', String(next));
        } catch {}
    };

    const handleHoleShapeChange = (shape) => {
        setHoleShape(shape);
        try {
            localStorage.setItem('badge_hole_shape', shape);
        } catch {}
    };

    const handleHolePositionChange = (pos) => {
        setHolePosition(pos);
        try {
            localStorage.setItem('badge_hole_position_v3', String(pos));
        } catch {}
    };

    useEffect(() => {
        // Collect all distinct background image URLs (prefer .png for fast, reliable, lightweight loading)
        const urls = new Set();
        badgeList.forEach(t => {
            let path = templatePath || t.templatePath || BADGE_TEMPLATES[t.visitor_type] || '/images/badges/Participant.png';
            if (path && path.includes('.svg')) {
                path = path.replace(/\.svg(\?.*)?$/i, '.png$1');
            }
            urls.add(appendBadgeVersion(path));
        });

        let isCancelled = false;
        let printed = false;

        const triggerPrint = () => {
            if (printed || isCancelled) return;
            printed = true;
            setImagesReady(true);
            setProgressPercent(100);

            // Wait 350ms to guarantee browser layout & paint has committed to the frame
            setTimeout(() => {
                if (!isCancelled) {
                    window.print();
                }
            }, 350);
        };

        const total = urls.size;
        if (total === 0) {
            triggerPrint();
            return;
        }

        let loadedCount = 0;
        const markOneLoaded = () => {
            loadedCount++;
            setProgressPercent(Math.round((loadedCount / total) * 100));
            if (loadedCount >= total) {
                // Ensure custom typography fonts are also loaded
                if (document.fonts && document.fonts.ready) {
                    document.fonts.ready.then(triggerPrint).catch(triggerPrint);
                } else {
                    triggerPrint();
                }
            }
        };

        urls.forEach(url => {
            const img = new Image();
            img.src = url;

            const onComplete = () => {
                if (img.decode) {
                    img.decode().then(markOneLoaded).catch(markOneLoaded);
                } else {
                    markOneLoaded();
                }
            };

            if (img.complete && img.naturalWidth > 0) {
                onComplete();
            } else {
                img.onload = onComplete;
                img.onerror = () => {
                    console.warn('Badge image failed to load, proceeding:', url);
                    markOneLoaded();
                };
            }
        });

        // Safety fallback timer: 6 seconds (never triggers prematurely on slow networks)
        const fallbackTimer = setTimeout(triggerPrint, 6000);

        return () => {
            isCancelled = true;
            clearTimeout(fallbackTimer);
        };
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
                            size: 54mm 85.6mm;
                            margin: 0mm;
                        }
                        *, *::before, *::after {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            color-adjust: exact !important;
                        }
                        html, body {
                            background: #ffffff !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            width: 54mm !important;
                            height: 85.6mm !important;
                        }
                        .badge-page {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            page-break-after: always !important;
                            break-after: page !important;
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                            display: block !important;
                            position: relative !important;
                            width: 54mm !important;
                            height: 85.6mm !important;
                            min-width: 54mm !important;
                            max-width: 54mm !important;
                            min-height: 85.6mm !important;
                            max-height: 85.6mm !important;
                            margin: 0 auto !important;
                            padding: 0 !important;
                            box-sizing: border-box !important;
                            overflow: hidden !important;
                        }
                        .badge-bg-img {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            position: absolute !important;
                            top: 0 !important;
                            left: 0 !important;
                            width: 100% !important;
                            height: 100% !important;
                            object-fit: fill !important;
                            display: block !important;
                            z-index: 1 !important;
                        }
                        .badge-page:last-of-type {
                            page-break-after: auto !important;
                            break-after: auto !important;
                        }
                    }
                `}
            </style>

            {/* Loading Indicator Banner (Only shown while images are downloading) */}
            {!imagesReady && (
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '1200px',
                        mb: 2,
                        p: 1.5,
                        px: 2.5,
                        borderRadius: '12px',
                        bgcolor: '#0284c7',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        boxShadow: '0 4px 12px rgba(2,132,199,0.3)',
                        '@media print': { display: 'none !important' },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CircularProgress size={20} sx={{ color: '#ffffff' }} />
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                            Memuat gambar badge resolusi tinggi ({progressPercent}%)... Dialog cetak akan otomatis terbuka setelah gambar siap.
                        </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 700 }}>
                        Mohon tunggu sebentar
                    </Typography>
                </Box>
            )}

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
                        label={imagesReady ? `${count} ${count > 1 ? 'Badges' : 'Badge'} Ready` : `Memuat (${progressPercent}%)`}
                        size="small"
                        sx={{
                            bgcolor: imagesReady ? '#10b981' : '#f59e0b',
                            color: '#ffffff',
                            fontWeight: 900,
                            fontSize: '0.72rem',
                        }}
                    />
                    <Chip
                        label="Format: 54 × 85.6 mm (CR-80)"
                        size="small"
                        sx={{
                            bgcolor: 'rgba(56, 189, 248, 0.12)',
                            color: '#38bdf8',
                            border: '1px solid rgba(56, 189, 248, 0.35)',
                            fontWeight: 800,
                            fontSize: '0.72rem',
                        }}
                    />
                </Box>

                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                    <Button
                        variant="contained"
                        startIcon={imagesReady ? <PrintIcon /> : <CircularProgress size={16} sx={{ color: '#fff' }} />}
                        onClick={() => window.print()}
                        disabled={!imagesReady}
                        sx={{
                            bgcolor: imagesReady ? '#10b981' : '#64748b',
                            color: '#ffffff',
                            fontWeight: 900,
                            fontSize: '0.88rem',
                            borderRadius: '12px',
                            textTransform: 'none',
                            px: 3,
                            py: 0.9,
                            boxShadow: imagesReady ? '0 4px 0 #047857, 0 8px 20px rgba(16,185,129,0.3)' : 'none',
                            '&:hover': { bgcolor: imagesReady ? '#059669' : '#64748b', transform: imagesReady ? 'translateY(-1px)' : 'none' },
                            '&:active': { transform: 'translateY(1px)', boxShadow: '0 2px 0 #047857' },
                        }}
                    >
                        {imagesReady
                            ? (count > 1 ? `Print All ${count} Badges` : 'Print Badge')
                            : `Memuat Template (${progressPercent}%)...`}
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

            {/* Lanyard Hole Punch Guide Control Bar (Hidden when printing) */}
            <Box
                sx={{
                    mb: 3,
                    width: '100%',
                    maxWidth: '1200px',
                    p: 2,
                    px: 3,
                    borderRadius: '16px',
                    bgcolor: '#1e293b',
                    border: '1px solid #334155',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                    '@media print': { display: 'none !important' },
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>🏷️ Panduan Lubang Gantungan (Di Atas Logo):</span>
                        <Chip
                            label={showHoleGuide ? `Aktif (${holeShape === 'slot' ? 'Oval 13×3mm' : 'Bulat Ø4.5mm'})` : 'Nonaktif (Polos)'}
                            size="small"
                            sx={{
                                bgcolor: showHoleGuide ? '#10b981' : '#64748b',
                                color: '#ffffff',
                                fontWeight: 900,
                                fontSize: '0.72rem',
                            }}
                        />
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        Garis putus-putus dicetak di atas latar asli kartu (tepat di atas deretan logo) tanpa blok putih, sebagai acuan alat pembolong tali ID Card.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Button
                        size="small"
                        variant={showHoleGuide ? 'contained' : 'outlined'}
                        onClick={handleToggleHoleGuide}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            borderRadius: '10px',
                            px: 1.8,
                            py: 0.6,
                            bgcolor: showHoleGuide ? '#10b981' : 'transparent',
                            borderColor: showHoleGuide ? '#10b981' : '#475569',
                            color: '#ffffff',
                            '&:hover': { bgcolor: showHoleGuide ? '#059669' : 'rgba(255,255,255,0.06)' },
                        }}
                    >
                        {showHoleGuide ? '✓ Panduan Lubang: ON' : '✗ Panduan Lubang: OFF'}
                    </Button>

                    {showHoleGuide && (
                        <>
                            <Box sx={{ width: '1px', height: '24px', bgcolor: '#334155', mx: 0.5 }} />
                            {[
                                { label: 'Oval Pipih (12.5×2.4mm)', shape: 'slot' },
                                { label: 'Bulat (Ø2.8mm)', shape: 'round' },
                            ].map(opt => (
                                <Button
                                    key={opt.shape}
                                    size="small"
                                    variant={holeShape === opt.shape ? 'contained' : 'outlined'}
                                    onClick={() => handleHoleShapeChange(opt.shape)}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        borderRadius: '10px',
                                        px: 1.5,
                                        py: 0.6,
                                        bgcolor: holeShape === opt.shape ? '#0284c7' : 'transparent',
                                        borderColor: holeShape === opt.shape ? '#0284c7' : '#475569',
                                        color: holeShape === opt.shape ? '#ffffff' : '#cbd5e1',
                                        '&:hover': { bgcolor: holeShape === opt.shape ? '#0369a1' : 'rgba(255,255,255,0.06)' },
                                    }}
                                >
                                    {opt.label}
                                </Button>
                            ))}

                            <Box sx={{ width: '1px', height: '24px', bgcolor: '#334155', mx: 0.5 }} />
                            {[
                                { label: 'Atas (2.6mm)', val: 2.6 },
                                { label: 'Tengah Aman (2.75mm ⭐)', val: 2.75 },
                                { label: 'Bawah (2.9mm)', val: 2.9 },
                            ].map(opt => (
                                <Button
                                    key={opt.val}
                                    size="small"
                                    variant={holePosition === opt.val ? 'contained' : 'outlined'}
                                    onClick={() => handleHolePositionChange(opt.val)}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        borderRadius: '10px',
                                        px: 1.2,
                                        py: 0.6,
                                        bgcolor: holePosition === opt.val ? '#0284c7' : 'transparent',
                                        borderColor: holePosition === opt.val ? '#0284c7' : '#475569',
                                        color: holePosition === opt.val ? '#ffffff' : '#cbd5e1',
                                        '&:hover': { bgcolor: holePosition === opt.val ? '#0369a1' : 'rgba(255,255,255,0.06)' },
                                    }}
                                >
                                    {opt.label}
                                </Button>
                            ))}
                        </>
                    )}
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
                            showHoleGuide={showHoleGuide}
                            holeShape={holeShape}
                            holePosition={holePosition}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
