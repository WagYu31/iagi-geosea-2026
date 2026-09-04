import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
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
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PrintIcon from '@mui/icons-material/Print';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CATEGORY_MAP = {
    iagi_member_professional: {
        label: 'IAGI Member - Professional',
        badge: 'PROFESSIONAL PASS',
        gradient: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 100%)',
        border: '#094d42',
        shadow: 'rgba(9, 77, 66, 0.25)',
        textColor: '#094d42',
        tagBg: '#dcfce7',
        tagColor: '#15803d',
    },
    non_iagi_member_professional: {
        label: 'Non IAGI Member - Professional',
        badge: 'PROFESSIONAL PASS',
        gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        border: '#0284c7',
        shadow: 'rgba(2, 132, 199, 0.25)',
        textColor: '#0284c7',
        tagBg: '#e0f2fe',
        tagColor: '#0369a1',
    },
    iagi_member_expatriate: {
        label: 'IAGI Member - Expatriate',
        badge: 'INTERNATIONAL DELEGATE',
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
        border: '#7c3aed',
        shadow: 'rgba(124, 58, 237, 0.25)',
        textColor: '#7c3aed',
        tagBg: '#ede9fe',
        tagColor: '#6d28d9',
    },
    non_iagi_member_expatriate: {
        label: 'Non IAGI Member - Expatriate',
        badge: 'INTERNATIONAL DELEGATE',
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
        border: '#7c3aed',
        shadow: 'rgba(124, 58, 237, 0.25)',
        textColor: '#7c3aed',
        tagBg: '#ede9fe',
        tagColor: '#5b21b6',
    },
    student_undergraduate: {
        label: 'Student Undergraduate',
        badge: 'STUDENT PASS',
        gradient: 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
        border: '#6366f1',
        shadow: 'rgba(99, 102, 241, 0.25)',
        textColor: '#4338ca',
        tagBg: '#e0e7ff',
        tagColor: '#3730a3',
    },
    exclusive: {
        label: 'Visitor Exclusive (VIP)',
        badge: 'VIP PASS',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        border: '#f59e0b',
        shadow: 'rgba(245, 158, 11, 0.25)',
        textColor: '#d97706',
        tagBg: '#fef3c7',
        tagColor: '#b45309',
    },
    non_exclusive: {
        label: 'Visitor Non-Exclusive',
        badge: 'FREE PASS',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        border: '#10b981',
        shadow: 'rgba(16, 185, 129, 0.25)',
        textColor: '#059669',
        tagBg: '#ecfdf5',
        tagColor: '#047857',
    },
};

export default function ShowTicket({
    ticket = {},
    groupTickets = [],
    eventDate = '3-5 November 2026',
    eventVenue = 'Royal Ambarrukmo Yogyakarta',
}) {
    const categoryInfo = CATEGORY_MAP[ticket.visitor_type] || CATEGORY_MAP.non_exclusive;
    const isCheckedIn = ticket.checked_in;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f6f5f3',
                color: '#0f172a',
                py: { xs: 3, md: 6 },
                position: 'relative',
                '@media print': {
                    bgcolor: '#fff',
                    p: 0,
                    minHeight: 'auto',
                },
            }}
        >
            <Head title={`E-Ticket: ${ticket.visitor_name} - 55th PIT IAGI & GEOSEA 2026`} />

            <Container maxWidth="sm">
                {/* Top Action Bar (hidden when printing) */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, '@media print': { display: 'none' } }}>
                    <Button
                        component={Link}
                        href={route('visitor.tickets')}
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: '#475569',
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: '10px',
                            bgcolor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            px: 2,
                            py: 0.8,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                            '&:hover': { color: '#094d42', bgcolor: '#f8fafc' },
                        }}
                    >
                        New Registration
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                        sx={{
                            background: categoryInfo.gradient,
                            color: '#fff',
                            fontWeight: 800,
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontSize: '0.9rem',
                            px: 3,
                            py: 1,
                            boxShadow: `0 4px 0 #04221d, 0 10px 20px ${categoryInfo.shadow}`,
                        }}
                    >
                        Print / Save PDF
                    </Button>
                </Box>

                {/* Digital E-Ticket Card */}
                <Box
                    sx={{
                        borderRadius: '24px',
                        bgcolor: '#ffffff',
                        border: `2px solid ${categoryInfo.border}`,
                        boxShadow: `0 20px 45px -10px ${categoryInfo.shadow}, 0 8px 16px rgba(0,0,0,0.04)`,
                        overflow: 'hidden',
                        position: 'relative',
                        mb: 4,
                        '@media print': {
                            boxShadow: 'none',
                            border: '2px solid #000',
                            borderRadius: 0,
                        },
                    }}
                >
                    {/* Header Banner */}
                    <Box
                        sx={{
                            background: categoryInfo.gradient,
                            p: 3.5,
                            textAlign: 'center',
                            color: '#fff',
                        }}
                    >
                        <Chip
                            icon={ticket.visitor_type === 'exclusive' ? <StarIcon sx={{ fontSize: 13, color: '#000 !important' }} /> : undefined}
                            label={categoryInfo.badge}
                            size="small"
                            sx={{
                                bgcolor: '#ffffff',
                                color: categoryInfo.textColor,
                                fontWeight: 900,
                                fontSize: '0.72rem',
                                letterSpacing: '0.06em',
                                mb: 1.5,
                            }}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em', mb: 0.5 }}>
                            55th PIT IAGI & GEOSEA XIX 2026
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                            {categoryInfo.label} Pass &bull; Gate Admission
                        </Typography>
                    </Box>

                    <Box sx={{ p: { xs: 3, sm: 4 } }}>
                        {/* Check-In Status Pill */}
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            {isCheckedIn ? (
                                <Chip
                                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: '#059669 !important' }} />}
                                    label={`CHECKED IN: ${new Date(ticket.checked_in_at).toLocaleTimeString('en-US')}`}
                                    sx={{ bgcolor: '#ecfdf5', color: '#047857', fontWeight: 800, border: '1px solid #a7f3d0' }}
                                />
                            ) : (
                                <Chip
                                    label="NOT CHECKED IN (SHOW AT GATE ENTRANCE)"
                                    sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 800, fontSize: '0.72rem' }}
                                />
                            )}
                        </Box>

                        {/* Center QR Code Container */}
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: '#ffffff',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                                width: 'fit-content',
                                mx: 'auto',
                                mb: 3,
                                boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                                textAlign: 'center',
                            }}
                        >
                            <QRCodeSVG
                                value={ticket.ticket_code}
                                size={170}
                                level="H"
                                includeMargin={false}
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: 'monospace',
                                    fontWeight: 900,
                                    color: '#0f172a',
                                    mt: 1.5,
                                    fontSize: '1rem',
                                    letterSpacing: '0.08em',
                                }}
                            >
                                {ticket.ticket_code}
                            </Typography>
                        </Box>

                        {/* Visitor Details */}
                        <Paper
                            sx={{
                                p: 2.5,
                                borderRadius: '16px',
                                bgcolor: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                mb: 3,
                            }}
                        >
                            <Stack spacing={1.5}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <PersonIcon sx={{ color: isExclusive ? '#d97706' : '#059669', fontSize: 20 }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>VISITOR NAME</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 800, color: '#0f172a' }}>{ticket.visitor_name}</Typography>
                                    </Box>
                                </Box>

                                {ticket.visitor_institution && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <BusinessIcon sx={{ color: '#0284c7', fontSize: 20 }} />
                                        <Box>
                                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>INSTITUTION / UNIVERSITY</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>{ticket.visitor_institution}</Typography>
                                        </Box>
                                    </Box>
                                )}

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <EmailIcon sx={{ color: '#64748b', fontSize: 20 }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>REGISTERED EMAIL</Typography>
                                        <Typography variant="body2" sx={{ color: '#334155' }}>{ticket.visitor_email}</Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Event Schedule & Location */}
                        <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderRadius: '12px', textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#094d42', fontWeight: 800, display: 'block', mb: 0.5 }}>
                                📍 {eventVenue}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontWeight: 600 }}>
                                📅 {eventDate} &bull; Present this QR Code to the gate scanner staff upon entering the venue.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Group Members Section (if multi-member) */}
                {groupTickets.length > 1 && (
                    <Box sx={{ '@media print': { display: 'none' } }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
                            Other Group Tickets ({groupTickets.length} Participants):
                        </Typography>
                        <Stack spacing={1.5}>
                            {groupTickets.map((t) => (
                                <Paper
                                    key={t.id}
                                    component={Link}
                                    href={route('visitor.tickets.show', t.ticket_code)}
                                    sx={{
                                        p: 2,
                                        borderRadius: '14px',
                                        bgcolor: t.ticket_code === ticket.ticket_code ? '#f0fdf4' : '#ffffff',
                                        border: `1px solid ${t.ticket_code === ticket.ticket_code ? '#86efac' : '#e2e8f0'}`,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        textDecoration: 'none',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                        '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' },
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                            {t.visitor_name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
                                            {t.ticket_code}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={t.checked_in ? 'Checked In' : 'Pending Scan'}
                                        size="small"
                                        sx={{
                                            bgcolor: t.checked_in ? '#ecfdf5' : '#f1f5f9',
                                            color: t.checked_in ? '#047857' : '#64748b',
                                            fontWeight: 800,
                                            fontSize: '0.68rem',
                                        }}
                                    />
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
