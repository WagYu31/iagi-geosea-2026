import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Stack,
    Divider,
    Paper,
    CircularProgress,
    IconButton,
    Tooltip,
    Dialog,
    DialogContent,
    DialogActions,
} from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import QrCodeIcon from '@mui/icons-material/QrCode';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';

const CATEGORY_MAP = {
    // Roles & Invitations
    vip: { label: 'VIP', shortLabel: 'VIP', badge: 'VIP', bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
    speaker: { label: 'Speaker', shortLabel: 'SPEAKER', badge: 'SPEAKER', bg: '#fdf2f8', color: '#9d174d', border: '#fbcfe8' },
    panelist: { label: 'Panelist', shortLabel: 'PANELIST', badge: 'PANELIST', bg: '#f5f3ff', color: '#5b21b6', border: '#ddd6fe' },
    moderator: { label: 'Moderator', shortLabel: 'MODERATOR', badge: 'MODERATOR', bg: '#ecfeff', color: '#155e75', border: '#a5f3fc' },
    exhibition: { label: 'Exhibition', shortLabel: 'EXHIBITION', badge: 'EXHIBITION', bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' },
    committee: { label: 'Committee', shortLabel: 'COMMITTEE', badge: 'COMMITTEE', bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
    student_volunteer: { label: 'Student Volunteer', shortLabel: 'VOLUNTEER', badge: 'STUDENT VOLUNTEER', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },

    // 1. Participant
    iagi_member_professional: { label: 'Professional (Member)', shortLabel: 'PRO (MEMBER)', badge: 'PROFESSIONAL (MEMBER)', bg: '#dcfce7', color: '#15803d', border: '#86efac' },
    non_iagi_member_professional: { label: 'Professional (Non-Member)', shortLabel: 'PRO (NON-MEMBER)', badge: 'PROFESSIONAL (NON-MEMBER)', bg: '#e0f2fe', color: '#0369a1', border: '#7dd3fc' },
    iagi_member_expatriate: { label: 'Expatriate (Member)', shortLabel: 'EXPAT (MEMBER)', badge: 'EXPATRIATE (MEMBER)', bg: '#ede9fe', color: '#6d28d9', border: '#c4b5fd' },
    non_iagi_member_expatriate: { label: 'Expatriate (Non-Member)', shortLabel: 'EXPAT (NON-MEMBER)', badge: 'EXPATRIATE (NON-MEMBER)', bg: '#ede9fe', color: '#5b21b6', border: '#c4b5fd' },
    student_undergraduate: { label: 'Student Undergraduate', shortLabel: 'STUDENT', badge: 'STUDENT UNDERGRADUATE', bg: '#e0e7ff', color: '#3730a3', border: '#a5b4fc' },

    // 2. Visitor
    non_exclusive: { label: 'Visitor Pass (Free)', shortLabel: 'VISITOR', badge: 'VISITOR PASS (FREE)', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
};

const getCategoryMeta = (type) => CATEGORY_MAP[type] || CATEGORY_MAP.non_exclusive;

export default function PaymentStatus({ payment = {}, tickets = [] }) {
    const isApproved = payment.status === 'approved';
    const isRejected = payment.status === 'rejected';
    const isPending = payment.status === 'pending' || !payment.status;

    const firstCategory = tickets[0]?.visitor_type;
    const categoryLabel = firstCategory ? getCategoryMeta(firstCategory).label : 'Ticket';

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    const [noticeModalOpen, setNoticeModalOpen] = useState(true);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // 3D Card Tilt on Mouse Move
    const handleCardMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x: x * 10, y: y * -10 });
    };

    const handleCardMouseLeave = () => {
        setMousePos({ x: 0, y: 0 });
    };

    // Auto-poll status every 10 seconds if still pending
    useEffect(() => {
        if (!isPending) return;

        const interval = setInterval(() => {
            router.reload({
                preserveScroll: true,
                only: ['payment', 'tickets'],
            });
        }, 10000);

        return () => clearInterval(interval);
    }, [isPending]);

    const handleManualRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            preserveScroll: true,
            only: ['payment', 'tickets'],
            onFinish: () => setIsRefreshing(false),
        });
    };

    const handleCopyPaymentCode = () => {
        if (navigator.clipboard && payment.payment_code) {
            navigator.clipboard.writeText(payment.payment_code);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const statusTheme = isApproved
        ? {
              color: '#059669',
              lightBg: '#ecfdf5',
              border: '#10b981',
              gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              badgeBg: '#dcfce7',
              badgeText: '#047857',
              icon: <CheckCircleIcon sx={{ fontSize: 44, color: '#10b981' }} />,
              title: 'Payment Successfully Verified! 🎉',
              desc: `Congratulations! Your ${categoryLabel} Ticket is now active. You can view or print your E-Ticket below.`,
          }
        : isRejected
        ? {
              color: '#dc2626',
              lightBg: '#fef2f2',
              border: '#ef4444',
              gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              badgeBg: '#fee2e2',
              badgeText: '#b91c1c',
              icon: <HighlightOffIcon sx={{ fontSize: 44, color: '#ef4444' }} />,
              title: 'Payment Rejected',
              desc: payment.notes || 'Payment proof does not match the invoice amount. Please contact the committee for assistance.',
          }
        : {
              color: '#d97706',
              lightBg: '#fffbeb',
              border: '#f59e0b',
              gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              badgeBg: '#fef3c7',
              badgeText: '#92400e',
              icon: <HourglassEmptyIcon sx={{ fontSize: 44, color: '#d97706', animation: 'spin 4s linear infinite' }} />,
              title: 'Awaiting Committee Verification',
              desc: 'Your payment proof has been received and is being verified by the IAGI treasury team. This page will update automatically.',
          };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f8fafc',
                color: '#0f172a',
                py: { xs: 2.5, md: 4 },
            }}
        >
            <Head title={`Payment Status: ${payment.payment_code || 'Details'}`} />

            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        50% { transform: rotate(180deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes pulseGlow {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.85; transform: scale(1.03); }
                    }
                `}
            </style>

            <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 3 } }}>
                {/* Navigation Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        p: 1.2,
                        px: 2,
                        borderRadius: '14px',
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        mb: 3,
                    }}
                >
                    <Button
                        component={Link}
                        href={route('visitor.tickets')}
                        startIcon={<ArrowBackIcon />}
                        size="small"
                        sx={{
                            color: '#334155',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            borderRadius: '8px',
                            px: 1.5,
                            py: 0.5,
                            bgcolor: '#f1f5f9',
                            '&:hover': {
                                color: '#094d42',
                                bgcolor: '#e2e8f0',
                            },
                        }}
                    >
                        Back to Registration
                    </Button>

                    <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                        <Button
                            variant="outlined"
                            startIcon={<InfoOutlinedIcon sx={{ color: '#d97706' }} />}
                            onClick={() => setNoticeModalOpen(true)}
                            size="small"
                            sx={{
                                color: '#92400e',
                                borderColor: '#fde68a',
                                bgcolor: '#fffbeb',
                                textTransform: 'none',
                                fontWeight: 800,
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                px: 1.5,
                                py: 0.6,
                                '&:hover': {
                                    bgcolor: '#fef3c7',
                                    borderColor: '#f59e0b',
                                },
                            }}
                        >
                            Email & Verification Notice
                        </Button>

                        <Button
                            component={Link}
                            href={route('visitor.receipt.show', payment.payment_code)}
                            startIcon={<ReceiptLongIcon />}
                            size="small"
                            variant="contained"
                            sx={{
                                bgcolor: '#094d42',
                                color: '#ffffff',
                                textTransform: 'none',
                                fontWeight: 800,
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                px: 1.8,
                                py: 0.6,
                                boxShadow: '0 2px 8px rgba(9, 77, 66, 0.25)',
                                '&:hover': {
                                    bgcolor: '#063830',
                                },
                            }}
                        >
                            Print / Download Receipt
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={isRefreshing ? <CircularProgress size={14} color="inherit" /> : <RefreshIcon />}
                            onClick={handleManualRefresh}
                            disabled={isRefreshing}
                            size="small"
                            sx={{
                                color: '#0284c7',
                                borderColor: '#bae6fd',
                                bgcolor: '#f0f9ff',
                                textTransform: 'none',
                                fontWeight: 800,
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                '&:hover': {
                                    bgcolor: '#e0f2fe',
                                    borderColor: '#0284c7',
                                },
                            }}
                        >
                            {isRefreshing ? 'Checking...' : 'Check Status'}
                        </Button>
                    </Stack>
                </Box>

                {/* 3D TACTILE MAIN STATUS CARD */}
                <Box
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    sx={{
                        perspective: '1000px',
                        mb: 3,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
                            transition: 'transform 0.15s ease-out',
                            borderRadius: '20px',
                            bgcolor: '#ffffff',
                            border: `2px solid ${statusTheme.border}`,
                            boxShadow: `0 15px 35px -5px ${isApproved ? 'rgba(16, 185, 129, 0.15)' : isRejected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.18)'}, 0 4px 12px rgba(0,0,0,0.03)`,
                            p: { xs: 2.5, sm: 3.5 },
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Status Header Pill & Icon */}
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, gap: 2.5, mb: 3 }}>
                            <Box
                                sx={{
                                    width: 76,
                                    height: 76,
                                    borderRadius: '20px',
                                    bgcolor: statusTheme.lightBg,
                                    border: `2px solid ${statusTheme.border}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                }}
                            >
                                {statusTheme.icon}
                            </Box>

                            <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1, mb: 0.8, flexWrap: 'wrap' }}>
                                    <Chip
                                        label={isApproved ? 'VERIFIED' : isRejected ? 'REJECTED' : 'AWAITING VERIFICATION'}
                                        size="small"
                                        sx={{
                                            bgcolor: statusTheme.badgeBg,
                                            color: statusTheme.badgeText,
                                            fontWeight: 900,
                                            fontSize: '0.72rem',
                                            height: 22,
                                            letterSpacing: '0.04em',
                                        }}
                                    />
                                    {isPending && (
                                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>
                                            &bull; Auto-refresh active every 10 seconds
                                        </Typography>
                                    )}
                                </Box>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 900,
                                        color: '#0f172a',
                                        fontSize: { xs: '1.25rem', sm: '1.45rem' },
                                        letterSpacing: '-0.02em',
                                        lineHeight: 1.25,
                                        mb: 0.8,
                                    }}
                                >
                                    {statusTheme.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#64748b',
                                        fontSize: '0.86rem',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {statusTheme.desc}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Transaction Summary Grid Box */}
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: '#f8fafc',
                                borderRadius: '14px',
                                border: '1px solid #e2e8f0',
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 0.3 }}>
                                    Payment Code:
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 900,
                                            color: '#0f172a',
                                            fontFamily: 'monospace',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        {payment.payment_code}
                                    </Typography>
                                    <Tooltip title={copiedCode ? 'Copied!' : 'Copy Code'}>
                                        <IconButton size="small" onClick={handleCopyPaymentCode} sx={{ p: 0.3, color: '#0284c7' }}>
                                            <ContentCopyIcon sx={{ fontSize: 13 }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>

                            <Box>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 0.3 }}>
                                    Total Amount:
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 900,
                                        color: '#d97706',
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    Rp {Number(payment.total_amount || 0).toLocaleString('id-ID')}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 0.3 }}>
                                    Category & Quantity:
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 800,
                                        color: '#334155',
                                        fontSize: '0.88rem',
                                    }}
                                >
                                    {tickets.length} {categoryLabel} Ticket(s)
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>

                {/* TICKET LIST SECTION WITH 3D INTERACTIVE CARDS */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, px: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <ConfirmationNumberIcon sx={{ fontSize: 20, color: '#094d42' }} /> Participant E-Tickets ({tickets.length})
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                            {isApproved ? 'Click the green button to view your E-Ticket' : 'Tickets will be activated once verified'}
                        </Typography>
                    </Box>

                    <Stack spacing={2}>
                        {tickets.map((ticket, idx) => {
                            const cat = getCategoryMeta(ticket.visitor_type);
                            return (
                                <Paper
                                    key={ticket.id || idx}
                                    elevation={0}
                                    sx={{
                                        p: 2.2,
                                        borderRadius: '16px',
                                        bgcolor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        justifyContent: 'space-between',
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        gap: 2,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            borderColor: isApproved ? '#10b981' : '#cbd5e1',
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        {/* Number / Initial Avatar */}
                                        <Box
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: '12px',
                                                bgcolor: isApproved ? '#ecfdf5' : '#fef3c7',
                                                border: `1.5px solid ${isApproved ? '#86efac' : '#fde68a'}`,
                                                color: isApproved ? '#047857' : '#92400e',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 900,
                                                fontSize: '1rem',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {ticket.visitor_name ? ticket.visitor_name.charAt(0).toUpperCase() : idx + 1}
                                        </Box>

                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '0.95rem' }}>
                                                    {ticket.visitor_name || 'Participant Name'}
                                                </Typography>
                                                <Chip
                                                    label={cat.badge}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: cat.bg,
                                                        color: cat.color,
                                                        border: `1px solid ${cat.border}`,
                                                        fontWeight: 900,
                                                        fontSize: '0.62rem',
                                                        height: 20,
                                                    }}
                                                />
                                            </Box>

                                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>
                                                {ticket.visitor_email} &bull; {ticket.visitor_institution || ticket.institution || 'Individual'}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 800,
                                                    color: '#0284c7',
                                                fontFamily: 'monospace',
                                                fontSize: '0.78rem',
                                                bgcolor: '#f0f9ff',
                                                px: 1,
                                                py: 0.2,
                                                borderRadius: '4px',
                                                display: 'inline-block',
                                                mt: 0.4,
                                            }}
                                        >
                                            {ticket.ticket_code}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Action / Status Button */}
                                <Box sx={{ width: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'right', sm: 'left' } }}>
                                    {ticket.status === 'active' || isApproved ? (
                                        <Button
                                            component={Link}
                                            href={route('visitor.ticket.show', ticket.ticket_code)}
                                            variant="contained"
                                            startIcon={<VisibilityIcon />}
                                            fullWidth={false}
                                            sx={{
                                                background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                                                color: '#ffffff',
                                                fontWeight: 900,
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                fontSize: '0.8rem',
                                                px: 2,
                                                py: 0.8,
                                                boxShadow: '0 3px 0 #047857, 0 6px 12px rgba(16, 185, 129, 0.3)',
                                                '&:hover': {
                                                    background: 'linear-gradient(180deg, #34d399 0%, #047857 100%)',
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: '0 4px 0 #047857, 0 8px 15px rgba(16, 185, 129, 0.4)',
                                                },
                                                '&:active': {
                                                    transform: 'translateY(2px)',
                                                    boxShadow: '0 1px 0 #047857, 0 2px 4px rgba(16, 185, 129, 0.3)',
                                                },
                                                transition: 'all 0.12s ease',
                                            }}
                                        >
                                            Open E-Ticket & Badge
                                        </Button>
                                    ) : (
                                        <Box
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 0.8,
                                                bgcolor: '#fef3c7',
                                                border: '1px solid #fde68a',
                                                borderRadius: '8px',
                                                px: 1.5,
                                                py: 0.6,
                                            }}
                                        >
                                            <HourglassEmptyIcon sx={{ fontSize: 14, color: '#d97706' }} />
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#92400e', fontSize: '0.74rem' }}>
                                                Awaiting Verification
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        ); })}
                    </Stack>
                </Box>

                {/* PANITIA CONTACT / ASSISTANCE FOOTER */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.2,
                        borderRadius: '16px',
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'center' },
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <ShieldOutlinedIcon sx={{ color: '#094d42', fontSize: 22 }} />
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', display: 'block', fontSize: '0.82rem' }}>
                                Need Assistance with Payment / Registration?
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.74rem' }}>
                                Contact PIT IAGI & GEOSEA 2026 Committee via WhatsApp
                            </Typography>
                        </Box>
                    </Box>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                        {/* Registrasi - Adeline */}
                        <Button
                            component="a"
                            href={`https://wa.me/62859207771789?text=Hello%20Adeline%20(Registration),%20I%20would%20like%20to%20inquire%20about%20my%20visitor%20ticket%20payment%20code:%20${payment.payment_code || ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<WhatsAppIcon sx={{ color: '#16a34a', fontSize: 18 }} />}
                            size="small"
                            sx={{
                                bgcolor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                color: '#15803d',
                                fontWeight: 800,
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontSize: '0.78rem',
                                px: 1.5,
                                py: 0.6,
                                justifyContent: 'center',
                                '&:hover': { bgcolor: '#dcfce7', borderColor: '#86efac' },
                            }}
                        >
                            Registration (Adeline)
                        </Button>

                        {/* Secretariat - Tiyas */}
                        <Button
                            component="a"
                            href={`https://wa.me/6281212200782?text=Hello%20Tiyas%20(Secretariat),%20I%20would%20like%20to%20inquire%20about%20my%20visitor%20ticket%20payment%20code:%20${payment.payment_code || ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<WhatsAppIcon sx={{ color: '#16a34a', fontSize: 18 }} />}
                            size="small"
                            sx={{
                                bgcolor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                color: '#15803d',
                                fontWeight: 800,
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontSize: '0.78rem',
                                px: 1.5,
                                py: 0.6,
                                justifyContent: 'center',
                                '&:hover': { bgcolor: '#dcfce7', borderColor: '#86efac' },
                            }}
                        >
                            Secretariat (Tiyas)
                        </Button>
                    </Stack>
                </Paper>

                {/* PROFESSIONAL EMAIL & 1X24H VERIFICATION POP-UP MODAL */}
                <Dialog
                    open={noticeModalOpen}
                    onClose={() => setNoticeModalOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '24px',
                            border: '1.5px solid #e2e8f0',
                            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)',
                            overflow: 'hidden',
                            p: 0,
                        }
                    }}
                >
                    {/* Modal Header with Event Brand Gradient */}
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #094d42 0%, #063830 100%)',
                            color: '#ffffff',
                            p: 3,
                            pb: 2.5,
                            position: 'relative',
                        }}
                    >
                        <IconButton
                            size="small"
                            onClick={() => setNoticeModalOpen(false)}
                            sx={{
                                position: 'absolute',
                                top: 14,
                                right: 14,
                                color: '#ffffff',
                                bgcolor: 'rgba(255,255,255,0.15)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                            }}
                        >
                            <CloseIcon sx={{ fontSize: 18 }} />
                        </IconButton>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.5 }}>
                            <Box
                                sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: '10px',
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fef08a',
                                }}
                            >
                                <MarkEmailUnreadIcon sx={{ fontSize: 22 }} />
                            </Box>
                            <Chip
                                label="OFFICIAL NOTIFICATION"
                                size="small"
                                sx={{
                                    bgcolor: '#fef08a',
                                    color: '#713f12',
                                    fontWeight: 900,
                                    fontSize: '0.65rem',
                                    height: 20,
                                    letterSpacing: '0.05em',
                                }}
                            />
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', fontSize: '1.18rem', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
                            Important Notice: E-Ticket Delivery & Verification
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#cbd5e1', fontSize: '0.78rem', display: 'block', mt: 0.5 }}>
                            55th PIT IAGI & GEOSEA XIX 2026 Organizing Committee
                        </Typography>
                    </Box>

                    <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 }, bgcolor: '#ffffff' }}>
                        <Stack spacing={2.5}>
                            {/* Point 1: Check Spam Folder */}
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: '14px',
                                    bgcolor: '#f0fdf4',
                                    border: '1.5px solid #bbf7d0',
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '10px',
                                        bgcolor: '#dcfce7',
                                        color: '#15803d',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        mt: 0.3,
                                    }}
                                >
                                    <ForwardToInboxIcon sx={{ fontSize: 20 }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#166534', fontSize: '0.9rem', mb: 0.4 }}>
                                        1. Please Check Your Spam / Junk Folder
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.82rem', lineHeight: 1.55 }}>
                                        Official E-Tickets and registration receipts are automatically dispatched to your registered email address (<strong>{tickets[0]?.visitor_email || 'your email'}</strong>). If not found in your Primary Inbox, please check your <strong>Spam</strong>, <strong>Junk</strong>, or <strong>Promotions</strong> folder and mark it as <em>"Not Spam"</em>.
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Point 2: 1x24 Hours Verification Window */}
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: '14px',
                                    bgcolor: '#fffbeb',
                                    border: '1.5px solid #fde68a',
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '10px',
                                        bgcolor: '#fef3c7',
                                        color: '#b45309',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        mt: 0.3,
                                    }}
                                >
                                    <AccessTimeIcon sx={{ fontSize: 20 }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#92400e', fontSize: '0.9rem', mb: 0.4 }}>
                                        2. 24-Hour (1x24 Hours) Verification Window
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.82rem', lineHeight: 1.55 }}>
                                        Payment verification and ticket activation take up to <strong>24 hours (1x24 Jam)</strong>. You may keep this page bookmarked to track real-time verification updates.
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Point 3: Contact Committee if No Email */}
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: '14px',
                                    bgcolor: '#f8fafc',
                                    border: '1.5px solid #e2e8f0',
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '10px',
                                        bgcolor: '#f1f5f9',
                                        color: '#0284c7',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        mt: 0.3,
                                    }}
                                >
                                    <SupportAgentIcon sx={{ fontSize: 20 }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '0.9rem', mb: 0.4 }}>
                                        3. Haven't Received Email After 24 Hours?
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.55, mb: 1.5 }}>
                                        If you have not received your confirmation or E-Ticket after 24 hours, please contact our committee directly via WhatsApp with your Payment Code:
                                    </Typography>

                                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, bgcolor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', px: 1.2, py: 0.4, mb: 1.5 }}>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                                            Payment Code:
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 900, color: '#094d42' }}>
                                            {payment.payment_code}
                                        </Typography>
                                        <Tooltip title={copiedCode ? 'Copied!' : 'Copy Code'}>
                                            <IconButton size="small" onClick={handleCopyPaymentCode} sx={{ p: 0.2, color: '#0284c7' }}>
                                                <ContentCopyIcon sx={{ fontSize: 13 }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                        <Button
                                            component="a"
                                            href={`https://wa.me/62859207771789?text=Hello%20Adeline%20(Registration),%20I%20have%20not%20received%20my%20e-ticket%20email%20after%2024%20hours.%20Payment%20Code:%20${payment.payment_code || ''}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            startIcon={<WhatsAppIcon sx={{ color: '#16a34a', fontSize: 16 }} />}
                                            size="small"
                                            sx={{
                                                bgcolor: '#f0fdf4',
                                                border: '1px solid #bbf7d0',
                                                color: '#15803d',
                                                fontWeight: 800,
                                                fontSize: '0.75rem',
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                py: 0.6,
                                                px: 1.5,
                                                '&:hover': { bgcolor: '#dcfce7' },
                                            }}
                                        >
                                            WhatsApp Registration (Adeline)
                                        </Button>
                                        <Button
                                            component="a"
                                            href={`https://wa.me/6281212200782?text=Hello%20Tiyas%20(Secretariat),%20I%20have%20not%20received%20my%20e-ticket%20email%20after%2024%20hours.%20Payment%20Code:%20${payment.payment_code || ''}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            startIcon={<WhatsAppIcon sx={{ color: '#16a34a', fontSize: 16 }} />}
                                            size="small"
                                            sx={{
                                                bgcolor: '#f0fdf4',
                                                border: '1px solid #bbf7d0',
                                                color: '#15803d',
                                                fontWeight: 800,
                                                fontSize: '0.75rem',
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                py: 0.6,
                                                px: 1.5,
                                                '&:hover': { bgcolor: '#dcfce7' },
                                            }}
                                        >
                                            WhatsApp Secretariat (Tiyas)
                                        </Button>
                                    </Stack>
                                </Box>
                            </Box>
                        </Stack>
                    </DialogContent>

                    <DialogActions sx={{ p: 2.5, px: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                            Thank you for your cooperation and patience.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => setNoticeModalOpen(false)}
                            sx={{
                                bgcolor: '#094d42',
                                color: '#ffffff',
                                fontWeight: 900,
                                fontSize: '0.82rem',
                                px: 3,
                                py: 0.9,
                                borderRadius: '10px',
                                textTransform: 'none',
                                boxShadow: '0 3px 0 #063830, 0 6px 16px rgba(9,77,66,0.25)',
                                '&:hover': {
                                    bgcolor: '#063830',
                                    transform: 'translateY(1px)',
                                    boxShadow: '0 2px 0 #063830',
                                },
                            }}
                        >
                            I Understand & Proceed
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}
