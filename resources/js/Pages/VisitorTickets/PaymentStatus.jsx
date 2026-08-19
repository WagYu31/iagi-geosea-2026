import React from 'react';
import { Head, Link } from '@inertiajs/react';
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
    Alert,
} from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PaymentStatus({ payment = {}, tickets = [] }) {
    const isApproved = payment.status === 'approved';
    const isRejected = payment.status === 'rejected';
    const isPending = payment.status === 'pending';

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0b1329', color: '#f8fafc', py: { xs: 4, md: 8 } }}>
            <Head title={`Status Pembayaran: ${payment.payment_code}`} />

            <Container maxWidth="sm">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Button
                        component={Link}
                        href={route('visitor.tickets')}
                        startIcon={<ArrowBackIcon />}
                        sx={{ color: '#94a3b8', textTransform: 'none' }}
                    >
                        Halaman Registrasi
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                        size="small"
                        sx={{ color: '#38bdf8', borderColor: '#38bdf8', textTransform: 'none', borderRadius: '8px' }}
                    >
                        Cek Status Terbaru
                    </Button>
                </Box>

                <Card
                    sx={{
                        borderRadius: '20px',
                        bgcolor: 'rgba(15, 23, 42, 0.95)',
                        border: `2px solid ${isApproved ? '#10b981' : isRejected ? '#ef4444' : '#eab308'}`,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        p: { xs: 2.5, sm: 4 },
                        textAlign: 'center',
                    }}
                >
                    <CardContent>
                        {/* Status Icon */}
                        <Box sx={{ mb: 2 }}>
                            {isApproved ? (
                                <CheckCircleIcon sx={{ fontSize: 64, color: '#10b981' }} />
                            ) : isRejected ? (
                                <HighlightOffIcon sx={{ fontSize: 64, color: '#ef4444' }} />
                            ) : (
                                <HourglassEmptyIcon sx={{ fontSize: 64, color: '#eab308' }} />
                            )}
                        </Box>

                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>
                            {isApproved 
                                ? 'Pembayaran Berhasil Diverifikasi!' 
                                : isRejected 
                                    ? 'Pembayaran Ditolak' 
                                    : 'Menunggu Verifikasi Admin'
                            }
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                            {isApproved
                                ? 'Selamat! Tiket Exclusive Anda telah aktif. Silakan buka E-Tiket di bawah ini.'
                                : isRejected
                                    ? (payment.notes || 'Bukti transfer tidak sesuai. Silakan hubungi panitia.')
                                    : 'Bukti transfer Anda sedang diverifikasi oleh tim panitia. Halaman ini akan diperbarui otomatis.'
                            }
                        </Typography>

                        <Box sx={{ p: 2, bgcolor: 'rgba(30, 41, 59, 0.8)', borderRadius: '12px', mb: 3, textAlign: 'left' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>Kode Pembayaran:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#fbbf24', fontFamily: 'monospace' }}>
                                    {payment.payment_code}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>Total Tagihan:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff' }}>
                                    Rp {Number(payment.total_amount || 0).toLocaleString('id-ID')}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>Jumlah Tiket:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff' }}>
                                    {tickets.length} Tiket Exclusive
                                </Typography>
                            </Box>
                        </Box>

                        {/* List of Tickets */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#cbd5e1', mb: 1.5, textAlign: 'left' }}>
                            Daftar Tiket:
                        </Typography>

                        <Stack spacing={1.5}>
                            {tickets.map((ticket) => (
                                <Box
                                    key={ticket.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        p: 2,
                                        bgcolor: 'rgba(30, 41, 59, 0.6)',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(51, 65, 85, 0.6)',
                                        textAlign: 'left',
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff' }}>
                                            {ticket.visitor_name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                            {ticket.visitor_email}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 600, fontFamily: 'monospace' }}>
                                            {ticket.ticket_code}
                                        </Typography>
                                    </Box>
                                    {ticket.status === 'active' ? (
                                        <Button
                                            component={Link}
                                            href={route('visitor.ticket.show', ticket.ticket_code)}
                                            variant="contained"
                                            size="small"
                                            sx={{
                                                bgcolor: '#10b981',
                                                color: '#fff',
                                                fontWeight: 700,
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                fontSize: '0.75rem',
                                                '&:hover': { bgcolor: '#059669' },
                                            }}
                                        >
                                            Buka E-Tiket
                                        </Button>
                                    ) : (
                                        <Chip label="Menunggu" size="small" sx={{ bgcolor: 'rgba(234, 179, 8, 0.2)', color: '#fbbf24', fontSize: '0.7rem', fontWeight: 700 }} />
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
