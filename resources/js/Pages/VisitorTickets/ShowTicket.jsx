import React, { useRef } from 'react';
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
    Grid,
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
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

export default function ShowTicket({
    ticket = {},
    groupTickets = [],
    eventDate = 'October 2026',
    eventVenue = 'Grand Ballroom Hotel Indonesia, Jakarta',
}) {
    const isExclusive = ticket.visitor_type === 'exclusive';
    const isCheckedIn = ticket.checked_in;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'radial-gradient(ellipse at top, #092c25 0%, #05141b 50%, #03080c 100%)',
                color: '#f8fafc',
                py: { xs: 3, md: 6 },
                position: 'relative',
                '@media print': {
                    bgcolor: '#fff',
                    p: 0,
                    minHeight: 'auto',
                },
            }}
        >
            <Head title={`E-Tiket: ${ticket.visitor_name} - 55th PIT IAGI & GEOSEA 2026`} />

            <Container maxWidth="sm">
                {/* Top Action Bar (hidden when printing) */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, '@media print': { display: 'none' } }}>
                    <Button
                        component={Link}
                        href={route('visitor.tickets')}
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: '#94a3b8',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            px: 2,
                            py: 0.8,
                            '&:hover': { color: '#fff', bgcolor: 'rgba(255, 255, 255, 0.08)' },
                        }}
                    >
                        Pendaftaran Baru
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                        sx={{
                            background: isExclusive
                                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: isExclusive ? '#000' : '#fff',
                            fontWeight: 800,
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontSize: '0.9rem',
                            px: 3,
                            py: 1,
                            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                        }}
                    >
                        Cetak / Simpan PDF
                    </Button>
                </Box>

                {/* Digital E-Ticket Card */}
                <Card
                    sx={{
                        borderRadius: '24px',
                        bgcolor: 'rgba(15, 23, 42, 0.85)',
                        border: `2px solid ${isExclusive ? '#f59e0b' : '#10b981'}`,
                        backdropFilter: 'blur(20px)',
                        boxShadow: isExclusive
                            ? '0 20px 50px rgba(245, 158, 11, 0.25)'
                            : '0 20px 50px rgba(16, 185, 129, 0.25)',
                        overflow: 'hidden',
                        position: 'relative',
                        mb: 4,
                        '@media print': {
                            boxShadow: 'none',
                            border: '2px solid #000',
                            bgcolor: '#fff',
                            color: '#000',
                            borderRadius: 0,
                        },
                    }}
                >
                    {/* Header Banner */}
                    <Box
                        sx={{
                            background: isExclusive
                                ? 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)'
                                : 'linear-gradient(135deg, #094d42 0%, #0d7a6a 100%)',
                            p: 3.5,
                            textAlign: 'center',
                            color: '#fff',
                        }}
                    >
                        <Chip
                            icon={isExclusive ? <StarIcon sx={{ fontSize: 13, color: '#000 !important' }} /> : undefined}
                            label={isExclusive ? 'OFFICIAL VIP PASS' : 'OFFICIAL VISITOR PASS'}
                            size="small"
                            sx={{
                                bgcolor: isExclusive ? '#fff' : 'rgba(255,255,255,0.2)',
                                color: isExclusive ? '#000' : '#fff',
                                fontWeight: 900,
                                fontSize: '0.72rem',
                                letterSpacing: '0.06em',
                                mb: 1.5,
                            }}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em', mb: 0.5 }}>
                            55th PIT IAGI & GEOSEA XIX 2026
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                            E-Ticket Pass &bull; Gate Admission
                        </Typography>
                    </Box>

                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                        {/* Check-In Status Pill */}
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            {isCheckedIn ? (
                                <Chip
                                    icon={<CheckCircleIcon sx={{ fontSize: 16, color: '#10b981 !important' }} />}
                                    label={`SUDAH CHECK-IN: ${new Date(ticket.checked_in_at).toLocaleTimeString('id-ID')}`}
                                    sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.3)' }}
                                />
                            ) : (
                                <Chip
                                    label="BELUM CHECK-IN (TUNJUKKAN DI PINTU MASUK)"
                                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', fontWeight: 700, fontSize: '0.72rem' }}
                                />
                            )}
                        </Box>

                        {/* Center QR Code Container */}
                        <Box
                            sx={{
                                p: 2.5,
                                bgcolor: '#ffffff',
                                borderRadius: '18px',
                                border: '1px solid #e2e8f0',
                                width: 'fit-content',
                                mx: 'auto',
                                mb: 3,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                textAlign: 'center',
                            }}
                        >
                            <QRCodeSVG
                                value={ticket.ticket_code}
                                size={180}
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
                                bgcolor: 'rgba(30, 41, 59, 0.6)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                mb: 3,
                            }}
                        >
                            <Stack spacing={1.8}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <PersonIcon sx={{ color: isExclusive ? '#fbbf24' : '#34d399', fontSize: 20 }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>NAMA PENGUNJUNG</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 800, color: '#fff' }}>{ticket.visitor_name}</Typography>
                                    </Box>
                                </Box>

                                {ticket.visitor_institution && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <BusinessIcon sx={{ color: '#38bdf8', fontSize: 20 }} />
                                        <Box>
                                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>INSTANSI / UNIVERSITAS</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#e2e8f0' }}>{ticket.visitor_institution}</Typography>
                                        </Box>
                                    </Box>
                                )}

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <EmailIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>EMAIL TERDAFTAR</Typography>
                                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>{ticket.visitor_email}</Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Event Schedule & Location */}
                        <Box sx={{ p: 2, bgcolor: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 700, display: 'block', mb: 0.5 }}>
                                📍 {eventVenue}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                📅 {eventDate} &bull; Tunjukkan QR Code ini kepada petugas gate scanner saat memasuki venue.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* Group Members Section (if multi-member) */}
                {groupTickets.length > 1 && (
                    <Box sx={{ '@media print': { display: 'none' } }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fff', mb: 2 }}>
                            Tiket Anggota Rombongan Lainnya ({groupTickets.length} Orang):
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
                                        bgcolor: t.ticket_code === ticket.ticket_code ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                                        border: `1px solid ${t.ticket_code === ticket.ticket_code ? '#10b981' : 'rgba(255,255,255,0.08)'}`,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'rgba(30, 41, 59, 0.9)', borderColor: '#34d399' },
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#fff' }}>
                                            {t.visitor_name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>
                                            {t.ticket_code}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={t.checked_in ? 'Checked In' : 'Belum Scan'}
                                        size="small"
                                        sx={{
                                            bgcolor: t.checked_in ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.08)',
                                            color: t.checked_in ? '#34d399' : '#94a3b8',
                                            fontWeight: 700,
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
