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
        <Box sx={{ minHeight: '100vh', bgcolor: '#0b1329', color: '#f8fafc', py: { xs: 3, md: 6 } }}>
            <Head title={`E-Tiket: ${ticket.visitor_name} - 55th PIT IAGI & GEOSEA 2026`} />

            <Container maxWidth="sm">
                {/* Top Action Bar (hidden when printing) */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, '@media print': { display: 'none' } }}>
                    <Button
                        component={Link}
                        href={route('visitor.tickets')}
                        startIcon={<ArrowBackIcon />}
                        sx={{ color: '#94a3b8', textTransform: 'none', fontSize: '0.85rem' }}
                    >
                        Halaman Registrasi
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                        sx={{
                            bgcolor: '#10b981',
                            color: '#fff',
                            fontWeight: 700,
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontSize: '0.85rem',
                            '&:hover': { bgcolor: '#059669' },
                        }}
                    >
                        Cetak / Simpan PDF
                    </Button>
                </Box>

                {/* E-Ticket Card */}
                <Card
                    sx={{
                        borderRadius: '20px',
                        bgcolor: 'rgba(15, 23, 42, 0.95)',
                        border: `2px solid ${isExclusive ? '#eab308' : '#3b82f6'}`,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        overflow: 'hidden',
                        position: 'relative',
                        '@media print': {
                            boxShadow: 'none',
                            border: '2px solid #000',
                            bgcolor: '#fff',
                            color: '#000',
                        },
                    }}
                >
                    {/* Header Banner */}
                    <Box
                        sx={{
                            background: isExclusive
                                ? 'linear-gradient(135deg, #eab308 0%, #b45309 100%)'
                                : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            p: 3,
                            textAlign: 'center',
                            color: '#fff',
                        }}
                    >
                        <Chip
                            icon={isExclusive ? <StarIcon sx={{ fontSize: 14, color: '#000 !important' }} /> : undefined}
                            label={isExclusive ? 'EXCLUSIVE VIP PASS' : 'NON-EXCLUSIVE VISITOR'}
                            size="small"
                            sx={{
                                bgcolor: isExclusive ? '#000' : 'rgba(255,255,255,0.2)',
                                color: isExclusive ? '#fbbf24' : '#fff',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                mb: 1,
                            }}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
                            55th PIT IAGI & GEOSEA XIX 2026
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', fontSize: '0.8rem' }}>
                            Official Visitor E-Ticket & Gate Entry Pass
                        </Typography>
                    </Box>

                    <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                        {/* Status Chip */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>Kode Tiket:</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: isExclusive ? '#fbbf24' : '#38bdf8', fontFamily: 'monospace' }}>
                                    {ticket.ticket_code}
                                </Typography>
                            </Box>
                            <Chip
                                label={isCheckedIn ? 'SUDAH CHECK-IN' : (ticket.status === 'active' ? 'TIKET AKTIF' : 'MENUNGGU VERIFIKASI')}
                                size="small"
                                sx={{
                                    bgcolor: isCheckedIn ? '#10b981' : (ticket.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)'),
                                    color: isCheckedIn ? '#fff' : (ticket.status === 'active' ? '#10b981' : '#fbbf24'),
                                    fontWeight: 800,
                                    fontSize: '0.75rem',
                                }}
                            />
                        </Box>

                        {/* QR Code Section */}
                        <Box
                            sx={{
                                textAlign: 'center',
                                p: 3,
                                bgcolor: '#ffffff',
                                borderRadius: '16px',
                                width: 'fit-content',
                                mx: 'auto',
                                mb: 3,
                                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                            }}
                        >
                            <QRCodeSVG
                                value={ticket.ticket_code}
                                size={180}
                                level="H"
                                includeMargin={false}
                            />
                            <Typography variant="caption" sx={{ display: 'block', color: '#64748b', mt: 1, fontWeight: 700, fontFamily: 'monospace' }}>
                                SCAN DI PINTU MASUK
                            </Typography>
                        </Box>

                        {/* Visitor Details */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: '12px',
                                bgcolor: 'rgba(30, 41, 59, 0.7)',
                                border: '1px solid rgba(51, 65, 85, 0.6)',
                                mb: 3,
                                '@media print': { bgcolor: '#f8fafc', border: '1px solid #cbd5e1', color: '#000' },
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <PersonIcon sx={{ fontSize: 16, color: '#38bdf8' }} />
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Nama Pengunjung</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc', '@media print': { color: '#000' } }}>
                                        {ticket.visitor_name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <EmailIcon sx={{ fontSize: 16, color: '#38bdf8' }} />
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Email</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#cbd5e1', '@media print': { color: '#000' } }}>
                                        {ticket.visitor_email}
                                    </Typography>
                                </Grid>
                                {ticket.visitor_institution && (
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            <BusinessIcon sx={{ fontSize: 16, color: '#38bdf8' }} />
                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Instansi / Perusahaan</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#cbd5e1', '@media print': { color: '#000' } }}>
                                            {ticket.visitor_institution}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>

                        {/* Venue & Schedule */}
                        <Box sx={{ borderTop: '1px dashed rgba(51, 65, 85, 0.8)', pt: 2.5, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <EventIcon sx={{ fontSize: 18, color: '#10b981' }} />
                                <Typography variant="body2" sx={{ color: '#cbd5e1', '@media print': { color: '#000' } }}>
                                    <strong>Waktu:</strong> {eventDate}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <LocationOnIcon sx={{ fontSize: 18, color: '#f43f5e' }} />
                                <Typography variant="body2" sx={{ color: '#cbd5e1', '@media print': { color: '#000' } }}>
                                    <strong>Lokasi:</strong> {eventVenue}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Instructions */}
                        <Alert
                            severity="info"
                            sx={{
                                borderRadius: '10px',
                                bgcolor: 'rgba(37, 99, 235, 0.1)',
                                color: '#93c5fd',
                                border: '1px solid rgba(59, 130, 246, 0.25)',
                                fontSize: '0.8rem',
                                '& .MuiAlert-icon': { color: '#60a5fa' },
                                '@media print': { display: 'none' },
                            }}
                        >
                            Tunjukkan QR Code ini kepada petugas di pintu masuk (gate). Setelah di-scan, Anda akan langsung mendapatkan <strong>Kartu Lanyard ({isExclusive ? 'Exclusive VIP' : 'Non-Exclusive'})</strong> sebagai tanda pengenal resmi.
                        </Alert>

                        {/* Companion tickets in group */}
                        {groupTickets.length > 0 && (
                            <Box sx={{ mt: 3, '@media print': { display: 'none' } }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#cbd5e1', mb: 1.5 }}>
                                    Tiket Anggota Rombongan Lainnya:
                                </Typography>
                                <Stack spacing={1}>
                                    {groupTickets.map((t) => (
                                        <Box
                                            key={t.id}
                                            component={Link}
                                            href={route('visitor.ticket.show', t.ticket_code)}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 1.5,
                                                bgcolor: 'rgba(30, 41, 59, 0.6)',
                                                borderRadius: '8px',
                                                textDecoration: 'none',
                                                border: '1px solid rgba(51, 65, 85, 0.6)',
                                                '&:hover': { bgcolor: 'rgba(51, 65, 85, 0.8)' },
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff' }}>{t.visitor_name}</Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>{t.ticket_code}</Typography>
                                            </Box>
                                            <Button size="small" sx={{ color: '#38bdf8', textTransform: 'none' }}>
                                                Buka Tiket &rarr;
                                            </Button>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
