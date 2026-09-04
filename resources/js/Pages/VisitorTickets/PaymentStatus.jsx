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

export default function PaymentStatus({ payment = {}, tickets = [] }) {
    const isApproved = payment.status === 'approved';
    const isRejected = payment.status === 'rejected';
    const isPending = payment.status === 'pending' || !payment.status;

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
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
              desc: 'Congratulations! Your Exclusive VIP Ticket is now active. You can view or print your E-Ticket below.',
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
                        {isRefreshing ? 'Checking...' : 'Check Latest Status'}
                    </Button>
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
                                    {tickets.length} Exclusive VIP Ticket(s)
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
                        {tickets.map((ticket, idx) => (
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
                                                label={ticket.visitor_type === 'exclusive' ? 'VIP PASS' : 'FREE PASS'}
                                                size="small"
                                                sx={{
                                                    bgcolor: ticket.visitor_type === 'exclusive' ? '#fef3c7' : '#ecfdf5',
                                                    color: ticket.visitor_type === 'exclusive' ? '#92400e' : '#047857',
                                                    fontWeight: 900,
                                                    fontSize: '0.62rem',
                                                    height: 18,
                                                }}
                                            />
                                        </Box>

                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>
                                            {ticket.visitor_email} &bull; {ticket.institution || 'Individual'}
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
                        ))}
                    </Stack>
                </Box>

                {/* PANITIA CONTACT / ASSISTANCE FOOTER */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderRadius: '14px',
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1.5,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShieldOutlinedIcon sx={{ color: '#094d42', fontSize: 20 }} />
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', display: 'block' }}>
                                Need Assistance with Payment?
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                                Contact PIT IAGI & GEOSEA 2026 Conference Secretariat
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        component="a"
                        href="https://wa.me/628121593522?text=Hello%20IAGI%20Committee,%20I%20would%20like%20to%20inquire%20about%20my%20visitor%20ticket%20payment%20code:%20"
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<WhatsAppIcon sx={{ color: '#16a34a' }} />}
                        size="small"
                        sx={{
                            bgcolor: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            color: '#15803d',
                            fontWeight: 800,
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '0.78rem',
                            px: 1.8,
                            '&:hover': { bgcolor: '#dcfce7' },
                        }}
                    >
                        WhatsApp Committee
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}
