import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    Chip,
    Stack,
    Divider,
    Alert,
    IconButton,
    Grid,
    Paper,
    CircularProgress,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PrintIcon from '@mui/icons-material/Print';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import StopIcon from '@mui/icons-material/Stop';

export default function GateScanner({
    exclusiveTemplate = null,
    nonExclusiveTemplate = null,
    eventVenue = 'Grand Ballroom Hotel Indonesia, Jakarta',
}) {
    const [scanning, setScanning] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [processing, setProcessing] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [scanResult, setScanResult] = useState(null); // { success, status, message, ticket, templatePath }
    const [recentScans, setRecentScans] = useState([]);
    const [cameraError, setCameraError] = useState(null);

    const html5QrCodeRef = useRef(null);
    const isProcessingRef = useRef(false);

    // Web Audio API Synthesis for Sound Feedback
    const playSound = (type) => {
        if (!soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'success') {
                // High double beep for success
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
                osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.1); // D6
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
            } else if (type === 'warning') {
                // Low double buzzer for already checked-in
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, ctx.currentTime);
                osc.frequency.setValueAtTime(200, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.4, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.4);
            } else {
                // Error buzz
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, ctx.currentTime);
                gain.gain.setValueAtTime(0.4, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.35);
            }
        } catch (e) {
            console.error('Audio playback error:', e);
        }
    };

    const processTicketCheckIn = async (code) => {
        if (!code || isProcessingRef.current) return;
        isProcessingRef.current = true;
        setProcessing(true);
        setCameraError(null);

        try {
            const response = await axios.post(route('admin.gateScanner.checkin'), {
                ticket_code: code.trim(),
            });

            const data = response.data;
            setScanResult(data);
            playSound('success');

            // Add to recent scans list
            setRecentScans((prev) => [
                {
                    ticket: data.ticket,
                    timestamp: new Date().toLocaleTimeString('id-ID'),
                    status: 'success',
                },
                ...prev.slice(0, 9),
            ]);
        } catch (err) {
            const errorData = err.response?.data || {
                success: false,
                status: 'error',
                message: 'Gagal memverifikasi tiket. Silakan periksa koneksi server.',
            };

            setScanResult(errorData);

            if (errorData.status === 'already_checked_in') {
                playSound('warning');
            } else {
                playSound('error');
            }

            if (errorData.ticket) {
                setRecentScans((prev) => [
                    {
                        ticket: errorData.ticket,
                        timestamp: new Date().toLocaleTimeString('id-ID'),
                        status: errorData.status,
                    },
                    ...prev.slice(0, 9),
                ]);
            }
        } finally {
            setProcessing(false);
            setManualCode('');
            // Cooldown 1.5s before next scan
            setTimeout(() => {
                isProcessingRef.current = false;
            }, 1500);
        }
    };

    const startCamera = async () => {
        setCameraError(null);
        try {
            if (!html5QrCodeRef.current) {
                html5QrCodeRef.current = new Html5Qrcode('qr-reader');
            }

            await html5QrCodeRef.current.start(
                { facingMode: 'environment' }, // Rear camera
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    processTicketCheckIn(decodedText);
                },
                (errorMessage) => {
                    // Ignore frame scanning errors
                }
            );

            setScanning(true);
        } catch (err) {
            console.error('Camera start error:', err);
            setCameraError('Gagal mengakses kamera. Pastikan izin kamera aktif di browser Anda atau gunakan input manual.');
            setScanning(false);
        }
    };

    const stopCamera = async () => {
        if (html5QrCodeRef.current && scanning) {
            try {
                await html5QrCodeRef.current.stop();
                setScanning(false);
            } catch (err) {
                console.error('Camera stop error:', err);
            }
        }
    };

    useEffect(() => {
        // Cleanup camera on unmount
        return () => {
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                html5QrCodeRef.current.stop().catch(console.error);
            }
        };
    }, []);

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualCode.trim()) {
            processTicketCheckIn(manualCode.trim());
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#090e1a', color: '#f8fafc', py: { xs: 2, md: 4 } }}>
            <Head title="Gate Web Scanner - 55th PIT IAGI & GEOSEA 2026" />

            <Container maxWidth="md">
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Button
                        component={Link}
                        href={route('admin.visitorTickets')}
                        startIcon={<ArrowBackIcon />}
                        sx={{ color: '#94a3b8', textTransform: 'none', fontSize: '0.85rem' }}
                    >
                        Kembali ke Dashboard
                    </Button>
                    <IconButton
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        sx={{ color: soundEnabled ? '#10b981' : '#64748b', bgcolor: 'rgba(255,255,255,0.05)' }}
                    >
                        {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
                    </IconButton>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', mb: 0.5 }}>
                        Gate Scanner Pintu Masuk 📱
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        Scan QR Code pengunjung untuk validasi tiket dan pemicu cetak kartu Lanyard fisik.
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* Left Column: Camera / Scanner */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: '18px', bgcolor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(51, 65, 85, 0.8)', overflow: 'hidden' }}>
                            <CardContent sx={{ p: 2.5 }}>
                                {/* Camera Box */}
                                <Box
                                    id="qr-reader"
                                    sx={{
                                        width: '100%',
                                        minHeight: 280,
                                        bgcolor: '#000',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        mb: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                />

                                {cameraError && (
                                    <Alert severity="error" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.8rem' }}>
                                        {cameraError}
                                    </Alert>
                                )}

                                <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
                                    {!scanning ? (
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            startIcon={<CameraAltIcon />}
                                            onClick={startCamera}
                                            sx={{
                                                bgcolor: '#10b981',
                                                color: '#fff',
                                                fontWeight: 700,
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                py: 1.2,
                                                '&:hover': { bgcolor: '#059669' },
                                            }}
                                        >
                                            Nyalakan Kamera Scanner
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            color="error"
                                            startIcon={<StopIcon />}
                                            onClick={stopCamera}
                                            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, py: 1.2 }}
                                        >
                                            Matikan Kamera
                                        </Button>
                                    )}
                                </Box>

                                <Divider sx={{ borderColor: 'rgba(51, 65, 85, 0.7)', my: 2 }}>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>ATAU INPUT MANUAL</Typography>
                                </Divider>

                                {/* Manual Input Form */}
                                <form onSubmit={handleManualSubmit}>
                                    <Stack direction="row" spacing={1}>
                                        <TextField
                                            placeholder="Ketik Kode Tiket (mis: TKT-EXC-...)"
                                            value={manualCode}
                                            onChange={(e) => setManualCode(e.target.value)}
                                            size="small"
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: 'rgba(30, 41, 59, 0.8)',
                                                    color: '#fff',
                                                    borderRadius: '10px',
                                                    fontSize: '0.85rem',
                                                    fontFamily: 'monospace',
                                                },
                                            }}
                                        />
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={processing || !manualCode.trim()}
                                            sx={{
                                                bgcolor: '#3b82f6',
                                                color: '#fff',
                                                fontWeight: 700,
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                px: 2.5,
                                                '&:hover': { bgcolor: '#2563eb' },
                                            }}
                                        >
                                            {processing ? <CircularProgress size={18} color="inherit" /> : 'Check'}
                                        </Button>
                                    </Stack>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Column: Scan Result Popup & Lanyard Badge Print */}
                    <Grid item xs={12} md={6}>
                        {scanResult ? (
                            <Card
                                sx={{
                                    borderRadius: '18px',
                                    bgcolor: scanResult.success
                                        ? 'rgba(16, 185, 129, 0.15)'
                                        : scanResult.status === 'already_checked_in'
                                            ? 'rgba(234, 179, 8, 0.15)'
                                            : 'rgba(239, 68, 68, 0.15)',
                                    border: `2px solid ${scanResult.success ? '#10b981' : scanResult.status === 'already_checked_in' ? '#eab308' : '#ef4444'}`,
                                    p: 3,
                                    textAlign: 'center',
                                    mb: 3,
                                }}
                            >
                                <Box sx={{ mb: 1.5 }}>
                                    {scanResult.success ? (
                                        <CheckCircleIcon sx={{ fontSize: 56, color: '#10b981' }} />
                                    ) : scanResult.status === 'already_checked_in' ? (
                                        <WarningAmberIcon sx={{ fontSize: 56, color: '#eab308' }} />
                                    ) : (
                                        <ErrorOutlineIcon sx={{ fontSize: 56, color: '#ef4444' }} />
                                    )}
                                </Box>

                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
                                    {scanResult.success ? 'CHECK-IN BERHASIL!' : 'CHECK-IN GAGAL'}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 2 }}>
                                    {scanResult.message}
                                </Typography>

                                {scanResult.ticket && (
                                    <Paper sx={{ p: 2, bgcolor: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', textAlign: 'left', mb: 2.5 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Chip
                                                icon={scanResult.ticket.visitor_type === 'exclusive' ? <StarIcon sx={{ fontSize: 13, color: '#000 !important' }} /> : undefined}
                                                label={scanResult.ticket.visitor_type === 'exclusive' ? 'EXCLUSIVE VIP' : 'NON-EXCLUSIVE'}
                                                size="small"
                                                sx={{
                                                    bgcolor: scanResult.ticket.visitor_type === 'exclusive' ? '#eab308' : '#3b82f6',
                                                    color: scanResult.ticket.visitor_type === 'exclusive' ? '#000' : '#fff',
                                                    fontWeight: 800,
                                                    fontSize: '0.7rem',
                                                }}
                                            />
                                            <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>
                                                {scanResult.ticket.ticket_code}
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>
                                            {scanResult.ticket.visitor_name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                            {scanResult.ticket.visitor_email}
                                        </Typography>
                                        {scanResult.ticket.visitor_institution && (
                                            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600, display: 'block', mt: 0.5 }}>
                                                🏢 {scanResult.ticket.visitor_institution}
                                            </Typography>
                                        )}
                                    </Paper>
                                )}

                                {/* Action: Trigger Print Lanyard Card */}
                                {scanResult.ticket && (
                                    <Button
                                        component="a"
                                        href={route('admin.visitorTickets.printBadge', scanResult.ticket.id)}
                                        target="_blank"
                                        variant="contained"
                                        fullWidth
                                        startIcon={<PrintIcon />}
                                        sx={{
                                            bgcolor: scanResult.ticket.visitor_type === 'exclusive' ? '#eab308' : '#8b5cf6',
                                            color: scanResult.ticket.visitor_type === 'exclusive' ? '#000' : '#fff',
                                            fontWeight: 800,
                                            borderRadius: '10px',
                                            textTransform: 'none',
                                            py: 1.2,
                                        }}
                                    >
                                        Cetak Kartu Lanyard ({scanResult.ticket.visitor_type === 'exclusive' ? 'Exclusive VIP' : 'Non-Exclusive'})
                                    </Button>
                                )}
                            </Card>
                        ) : (
                            <Card sx={{ borderRadius: '18px', bgcolor: 'rgba(15, 23, 42, 0.6)', border: '1px dashed rgba(51, 65, 85, 0.7)', p: 4, textAlign: 'center', mb: 3 }}>
                                <QrCodeScannerIcon sx={{ fontSize: 50, color: '#475569', mb: 1 }} />
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    Arahkan kamera ke QR Code tiket penonton atau ketik kode tiket untuk memvalidasi.
                                </Typography>
                            </Card>
                        )}

                        {/* Recent Scans Session List */}
                        <Card sx={{ borderRadius: '18px', bgcolor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(51, 65, 85, 0.8)', p: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#94a3b8', mb: 1.5 }}>
                                Riwayat Scan Sesi Ini ({recentScans.length})
                            </Typography>
                            {recentScans.length === 0 ? (
                                <Typography variant="caption" sx={{ color: '#475569' }}>Belum ada scan.</Typography>
                            ) : (
                                <Stack spacing={1}>
                                    {recentScans.map((r, i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 1.2,
                                                bgcolor: 'rgba(30, 41, 59, 0.5)',
                                                borderRadius: '8px',
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>
                                                    {r.ticket?.visitor_name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                                                    {r.ticket?.ticket_code} &bull; {r.timestamp}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={r.ticket?.visitor_type === 'exclusive' ? 'EXCLUSIVE' : 'NON-EXC'}
                                                size="small"
                                                sx={{
                                                    bgcolor: r.ticket?.visitor_type === 'exclusive' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                                    color: r.ticket?.visitor_type === 'exclusive' ? '#fbbf24' : '#60a5fa',
                                                    fontWeight: 700,
                                                    fontSize: '0.65rem',
                                                    height: 20,
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
