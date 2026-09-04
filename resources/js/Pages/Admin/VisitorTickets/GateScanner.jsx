import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    Button,
    TextField,
    Chip,
    Stack,
    Divider,
    Alert,
    IconButton,
    Paper,
    CircularProgress,
    Tooltip,
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
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';

const CATEGORY_MAP = {
    iagi_member_professional: {
        label: 'IAGI MEMBER - PROFESSIONAL',
        shortLabel: 'IAGI PRO',
        bg: '#dcfce7',
        color: '#15803d',
        border: '#86efac',
    },
    non_iagi_member_professional: {
        label: 'NON IAGI MEMBER - PROFESSIONAL',
        shortLabel: 'NON-IAGI PRO',
        bg: '#e0f2fe',
        color: '#0369a1',
        border: '#7dd3fc',
    },
    iagi_member_expatriate: {
        label: 'IAGI MEMBER - EXPATRIATE',
        shortLabel: 'IAGI EXPAT',
        bg: '#ede9fe',
        color: '#6d28d9',
        border: '#c4b5fd',
    },
    non_iagi_member_expatriate: {
        label: 'NON IAGI MEMBER - EXPATRIATE',
        shortLabel: 'NON-IAGI EXPAT',
        bg: '#ede9fe',
        color: '#5b21b6',
        border: '#c4b5fd',
    },
    student_undergraduate: {
        label: 'STUDENT UNDERGRADUATE',
        shortLabel: 'STUDENT',
        bg: '#e0e7ff',
        color: '#3730a3',
        border: '#a5b4fc',
    },
    exclusive: {
        label: 'EXCLUSIVE VIP',
        shortLabel: 'EXCLUSIVE VIP',
        bg: '#fef3c7',
        color: '#92400e',
        border: '#fde68a',
    },
    non_exclusive: {
        label: 'VISITOR NON-EXCLUSIVE',
        shortLabel: 'NON-EXC',
        bg: '#ecfdf5',
        color: '#047857',
        border: '#a7f3d0',
    },
};

const getCategoryMeta = (type) => CATEGORY_MAP[type] || CATEGORY_MAP.non_exclusive;

export default function GateScanner({
    exclusiveTemplate = null,
    nonExclusiveTemplate = null,
    eventVenue = 'Royal Ambarrukmo Yogyakarta',
}) {
    const [scanning, setScanning] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [processing, setProcessing] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [facingMode, setFacingMode] = useState('environment'); // 'environment' or 'user'
    const [scanResult, setScanResult] = useState(null);
    const [recentScans, setRecentScans] = useState([]);
    const [cameraError, setCameraError] = useState(null);

    const html5QrCodeRef = useRef(null);
    const isProcessingRef = useRef(false);

    // Audio Feedback Synthesis
    const playSound = (type) => {
        if (!soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'success') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
            } else if (type === 'warning') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(320, ctx.currentTime);
                osc.frequency.setValueAtTime(220, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.35, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.35);
            } else {
                osc.type = 'square';
                osc.frequency.setValueAtTime(160, ctx.currentTime);
                gain.gain.setValueAtTime(0.35, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
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

            setRecentScans((prev) => [
                {
                    ticket: data.ticket,
                    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    status: 'success',
                },
                ...prev.slice(0, 14),
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
                        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                        status: errorData.status,
                    },
                    ...prev.slice(0, 14),
                ]);
            }
        } finally {
            setProcessing(false);
            setManualCode('');
            setTimeout(() => {
                isProcessingRef.current = false;
            }, 1500);
        }
    };

    const startCamera = async (mode = facingMode) => {
        setCameraError(null);
        try {
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                await html5QrCodeRef.current.stop();
            }

            if (!html5QrCodeRef.current) {
                html5QrCodeRef.current = new Html5Qrcode('qr-reader');
            }

            await html5QrCodeRef.current.start(
                { facingMode: mode },
                {
                    fps: 15,
                    qrbox: (viewfinderWidth, viewfinderHeight) => {
                        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                        const qrboxSize = Math.floor(minEdge * 0.75);
                        return {
                            width: Math.min(qrboxSize, 250),
                            height: Math.min(qrboxSize, 250),
                        };
                    },
                },
                (decodedText) => {
                    processTicketCheckIn(decodedText);
                },
                () => {}
            );

            setScanning(true);
        } catch (err) {
            console.error('Camera start error:', err);
            setCameraError('Gagal mengakses kamera. Pastikan izin kamera telah disetujui di browser atau gunakan input manual.');
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

    const toggleCameraFacing = async () => {
        const nextMode = facingMode === 'environment' ? 'user' : 'environment';
        setFacingMode(nextMode);
        if (scanning) {
            await startCamera(nextMode);
        }
    };

    useEffect(() => {
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

    const totalSuccess = recentScans.filter(s => s.status === 'success').length;
    const totalVip = recentScans.filter(s => s.ticket?.visitor_type === 'exclusive' && s.status === 'success').length;
    const totalWarn = recentScans.filter(s => s.status !== 'success').length;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', color: '#0f172a', py: { xs: 2, md: 3 } }}>
            <Head title="Gate Web Scanner - 55th PIT IAGI & GEOSEA 2026" />

            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 } }}>
                {/* 3D HEADER BAR */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        px: 3,
                        borderRadius: '18px',
                        bgcolor: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        boxShadow: '0 4px 0 #e2e8f0, 0 10px 25px rgba(0,0,0,0.03)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Button
                            component={Link}
                            href={route('admin.visitorTickets')}
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                bgcolor: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                color: '#334155',
                                textTransform: 'none',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                borderRadius: '10px',
                                px: 1.8,
                                py: 0.8,
                                boxShadow: '0 2px 0 #cbd5e1',
                                '&:hover': { bgcolor: '#f1f5f9', transform: 'translateY(-1px)' },
                                '&:active': { transform: 'translateY(1px)' },
                            }}
                        >
                            Dashboard Tiket
                        </Button>

                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.15rem', lineHeight: 1.2 }}>
                                Gate Scanner Pintu Masuk 📱
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                55th PIT IAGI & GEOSEA XIX 2026 &bull; {eventVenue}
                            </Typography>
                        </Box>
                    </Box>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Chip
                            label="GATE SCANNER AKTIF"
                            size="small"
                            sx={{
                                bgcolor: '#dcfce7',
                                color: '#15803d',
                                fontWeight: 900,
                                fontSize: '0.68rem',
                                border: '1px solid #86efac',
                                height: 26,
                            }}
                        />

                        <Tooltip title={soundEnabled ? 'Matikan Suara Beep' : 'Aktifkan Suara Beep'}>
                            <IconButton
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                sx={{
                                    bgcolor: soundEnabled ? '#ecfdf5' : '#f1f5f9',
                                    border: `1.5px solid ${soundEnabled ? '#a7f3d0' : '#cbd5e1'}`,
                                    color: soundEnabled ? '#059669' : '#64748b',
                                    boxShadow: soundEnabled ? '0 2px 0 #a7f3d0' : '0 2px 0 #cbd5e1',
                                    borderRadius: '10px',
                                    p: 0.8,
                                }}
                            >
                                {soundEnabled ? <VolumeUpIcon sx={{ fontSize: 19 }} /> : <VolumeOffIcon sx={{ fontSize: 19 }} />}
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Paper>

                {/* 3D QUICK SESSION STATS */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.8,
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                            border: '1.5px solid #a7f3d0',
                            boxShadow: '0 4px 0 #a7f3d0, 0 6px 16px rgba(16,185,129,0.06)',
                        }}
                    >
                        <Typography variant="caption" sx={{ color: '#065f46', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                            Total Sukses Masuk
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#047857', mt: 0.2 }}>
                            {totalSuccess} <Typography component="span" variant="caption" sx={{ color: '#065f46', fontWeight: 700 }}>Orang</Typography>
                        </Typography>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.8,
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                            border: '1.5px solid #fde68a',
                            boxShadow: '0 4px 0 #fde68a, 0 6px 16px rgba(245,158,11,0.06)',
                        }}
                    >
                        <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                            Pengunjung VIP
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#b45309', mt: 0.2 }}>
                            {totalVip} <Typography component="span" variant="caption" sx={{ color: '#92400e', fontWeight: 700 }}>VIP</Typography>
                        </Typography>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.8,
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                            border: '1.5px solid #fecaca',
                            boxShadow: '0 4px 0 #fecaca, 0 6px 16px rgba(239,68,68,0.06)',
                        }}
                    >
                        <Typography variant="caption" sx={{ color: '#991b1b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                            Duplikat / Ditolak
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#dc2626', mt: 0.2 }}>
                            {totalWarn} <Typography component="span" variant="caption" sx={{ color: '#991b1b', fontWeight: 700 }}>Tiket</Typography>
                        </Typography>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.8,
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                            border: '1.5px solid #bae6fd',
                            boxShadow: '0 4px 0 #bae6fd, 0 6px 16px rgba(2,132,199,0.06)',
                        }}
                    >
                        <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                            Total Scan Sesi Ini
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#0284c7', mt: 0.2 }}>
                            {recentScans.length} <Typography component="span" variant="caption" sx={{ color: '#0369a1', fontWeight: 700 }}>Kali</Typography>
                        </Typography>
                    </Paper>
                </Box>

                {/* 2-COLUMN STRICT SIDE-BY-SIDE GRID LAYOUT */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: 3,
                        alignItems: 'start',
                        width: '100%',
                    }}
                >
                    {/* LEFT COLUMN: CAMERA SCANNER & MANUAL INPUT */}
                    <Box sx={{ width: '100%', minWidth: 0 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: '20px',
                                bgcolor: '#ffffff',
                                border: '1.5px solid #e2e8f0',
                                boxShadow: '0 4px 0 #e2e8f0, 0 12px 28px rgba(0,0,0,0.03)',
                                overflow: 'hidden',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CameraAltIcon sx={{ color: '#094d42', fontSize: 20 }} />
                                    Kamera Pemindai QR Code
                                </Typography>

                                {scanning && (
                                    <Tooltip title="Ganti Kamera Depan / Belakang">
                                        <Button
                                            size="small"
                                            onClick={toggleCameraFacing}
                                            startIcon={<FlipCameraIosIcon />}
                                            sx={{
                                                textTransform: 'none',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                color: '#0284c7',
                                                bgcolor: '#f0f9ff',
                                                border: '1px solid #bae6fd',
                                                borderRadius: '8px',
                                                py: 0.4,
                                                px: 1.2,
                                            }}
                                        >
                                            {facingMode === 'environment' ? 'Kamera Belakang' : 'Kamera Depan'}
                                        </Button>
                                    </Tooltip>
                                )}
                            </Box>

                            {/* Camera Viewfinder Box */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    bgcolor: '#0f172a',
                                    border: '2px solid #334155',
                                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
                                    mb: 2.5,
                                    height: 290,
                                    width: '100%',
                                    maxWidth: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box
                                    id="qr-reader"
                                    sx={{
                                        width: '100% !important',
                                        maxWidth: '100% !important',
                                        height: '100% !important',
                                        border: 'none !important',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        '& video': {
                                            width: '100% !important',
                                            maxWidth: '100% !important',
                                            height: '290px !important',
                                            objectFit: 'cover !important',
                                            borderRadius: '14px',
                                        },
                                        '& canvas': {
                                            display: 'none !important',
                                        },
                                        '& #qr-reader__scan_region': {
                                            width: '100% !important',
                                            height: '100% !important',
                                            display: 'flex !important',
                                            alignItems: 'center !important',
                                            justifyContent: 'center !important',
                                        },
                                        '& #qr-reader__scan_region video': {
                                            width: '100% !important',
                                            height: '290px !important',
                                            objectFit: 'cover !important',
                                        },
                                        '& #qr-reader__dashboard_section_csr': {
                                            display: 'none !important',
                                        },
                                        '& #qr-reader__header_message': {
                                            display: 'none !important',
                                        },
                                        '& img': {
                                            display: 'none !important',
                                        },
                                    }}
                                />

                                {!scanning && (
                                    <Box sx={{ position: 'absolute', textAlign: 'center', p: 3, color: '#94a3b8', zIndex: 2 }}>
                                        <QrCodeScannerIcon sx={{ fontSize: 56, color: '#475569', mb: 1 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#cbd5e1' }}>
                                            Kamera Sedang Tidak Aktif
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                            Klik tombol hijau di bawah untuk memulai scanner.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            {cameraError && (
                                <Alert severity="error" sx={{ mb: 2, borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
                                    {cameraError}
                                </Alert>
                            )}

                            {/* 3D Pushable Camera Control Button */}
                            <Box sx={{ mb: 2.5 }}>
                                {!scanning ? (
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<CameraAltIcon />}
                                        onClick={() => startCamera(facingMode)}
                                        sx={{
                                            background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                                            color: '#ffffff',
                                            fontWeight: 900,
                                            fontSize: '0.9rem',
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            py: 1.3,
                                            boxShadow: '0 4px 0 #047857, 0 8px 20px rgba(16, 185, 129, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(180deg, #34d399 0%, #047857 100%)',
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 5px 0 #047857, 0 10px 22px rgba(16, 185, 129, 0.4)',
                                            },
                                            '&:active': {
                                                transform: 'translateY(3px)',
                                                boxShadow: '0 1px 0 #047857',
                                            },
                                            transition: 'all 0.12s ease',
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
                                        sx={{
                                            background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
                                            color: '#ffffff',
                                            fontWeight: 900,
                                            fontSize: '0.9rem',
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            py: 1.3,
                                            boxShadow: '0 4px 0 #991b1b, 0 8px 20px rgba(239, 68, 68, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(180deg, #f87171 0%, #991b1b 100%)',
                                                transform: 'translateY(-1px)',
                                            },
                                            '&:active': {
                                                transform: 'translateY(3px)',
                                                boxShadow: '0 1px 0 #991b1b',
                                            },
                                            transition: 'all 0.12s ease',
                                        }}
                                    >
                                        Matikan Kamera
                                    </Button>
                                )}
                            </Box>

                            <Divider sx={{ my: 2 }}>
                                <Chip label="ATAU KETIK KODE TIKET" size="small" sx={{ fontSize: '0.68rem', fontWeight: 800, bgcolor: '#f1f5f9', color: '#64748b' }} />
                            </Divider>

                            {/* 3D Manual Input Form */}
                            <form onSubmit={handleManualSubmit}>
                                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                                    <TextField
                                        placeholder="Ketik Kode Tiket (mis: TKT-EXC-26-XXXX)"
                                        value={manualCode}
                                        onChange={(e) => setManualCode(e.target.value)}
                                        size="small"
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: '#f8fafc',
                                                borderRadius: '12px',
                                                fontSize: '0.85rem',
                                                fontFamily: 'monospace',
                                                fontWeight: 800,
                                            },
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={processing || !manualCode.trim()}
                                        sx={{
                                            background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
                                            color: '#ffffff',
                                            fontWeight: 900,
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            px: 3,
                                            boxShadow: '0 3px 0 #075985',
                                            '&:hover': { bgcolor: '#0369a1', transform: 'translateY(-1px)' },
                                            '&:active': { transform: 'translateY(2px)', boxShadow: '0 1px 0 #075985' },
                                        }}
                                    >
                                        {processing ? <CircularProgress size={18} color="inherit" /> : 'Check'}
                                    </Button>
                                </Stack>
                            </form>
                        </Paper>
                    </Box>

                    {/* RIGHT COLUMN: REALTIME SCAN RESULT & LANYARD BADGE PRINT */}
                    <Box sx={{ width: '100%', minWidth: 0 }}>
                        {scanResult ? (
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '20px',
                                    bgcolor: scanResult.success
                                        ? '#f0fdf4'
                                        : scanResult.status === 'already_checked_in'
                                            ? '#fffbeb'
                                            : '#fef2f2',
                                    border: `2px solid ${
                                        scanResult.success
                                            ? '#86efac'
                                            : scanResult.status === 'already_checked_in'
                                                ? '#fde68a'
                                                : '#fecaca'
                                    }`,
                                    boxShadow: `0 4px 0 ${
                                        scanResult.success
                                            ? '#86efac'
                                            : scanResult.status === 'already_checked_in'
                                                ? '#fde68a'
                                                : '#fecaca'
                                    }, 0 12px 28px rgba(0,0,0,0.04)`,
                                    p: 3,
                                    textAlign: 'center',
                                    mb: 3,
                                }}
                            >
                                <Box sx={{ mb: 1.5 }}>
                                    {scanResult.success ? (
                                        <CheckCircleIcon sx={{ fontSize: 60, color: '#16a34a' }} />
                                    ) : scanResult.status === 'already_checked_in' ? (
                                        <WarningAmberIcon sx={{ fontSize: 60, color: '#d97706' }} />
                                    ) : (
                                        <ErrorOutlineIcon sx={{ fontSize: 60, color: '#dc2626' }} />
                                    )}
                                </Box>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 900,
                                        color: scanResult.success ? '#166534' : scanResult.status === 'already_checked_in' ? '#92400e' : '#991b1b',
                                        mb: 0.5,
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    {scanResult.success ? 'CHECK-IN BERHASIL! 🎟️' : scanResult.status === 'already_checked_in' ? 'SUDAH PERNAH CHECK-IN' : 'CHECK-IN GAGAL'}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600, mb: 2.5 }}>
                                    {scanResult.message}
                                </Typography>

                                {scanResult.ticket && (
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            bgcolor: '#ffffff',
                                            borderRadius: '16px',
                                            border: '1.5px solid #e2e8f0',
                                            textAlign: 'left',
                                            mb: 2.5,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                            <Chip
                                                icon={scanResult.ticket.visitor_type === 'exclusive' ? <StarIcon sx={{ fontSize: 13, color: '#92400e !important' }} /> : undefined}
                                                label={getCategoryMeta(scanResult.ticket.visitor_type).label}
                                                size="small"
                                                sx={{
                                                    bgcolor: getCategoryMeta(scanResult.ticket.visitor_type).bg,
                                                    color: getCategoryMeta(scanResult.ticket.visitor_type).color,
                                                    border: `1px solid ${getCategoryMeta(scanResult.ticket.visitor_type).border}`,
                                                    fontWeight: 900,
                                                    fontSize: '0.72rem',
                                                    height: 24,
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ color: '#094d42', fontFamily: 'monospace', fontWeight: 900 }}>
                                                {scanResult.ticket.ticket_code}
                                            </Typography>
                                        </Box>

                                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.15rem' }}>
                                            {scanResult.ticket.visitor_name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.4 }}>
                                            <EmailIcon sx={{ fontSize: 15 }} /> {scanResult.ticket.visitor_email}
                                        </Typography>

                                        {scanResult.ticket.visitor_institution && (
                                            <Typography variant="body2" sx={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.4 }}>
                                                <BusinessIcon sx={{ fontSize: 15 }} /> {scanResult.ticket.visitor_institution}
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
                                            background: 'linear-gradient(180deg, #094d42 0%, #06352e 100%)',
                                            color: '#ffffff',
                                            fontWeight: 900,
                                            fontSize: '0.88rem',
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            py: 1.3,
                                            boxShadow: '0 4px 0 #04221d',
                                            '&:hover': { transform: 'translateY(-1px)' },
                                            '&:active': { transform: 'translateY(2px)' },
                                        }}
                                    >
                                        🖨️ Cetak Kartu Lanyard ({getCategoryMeta(scanResult.ticket.visitor_type).shortLabel})
                                    </Button>
                                )}
                            </Paper>
                        ) : (
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '20px',
                                    bgcolor: '#ffffff',
                                    border: '2px dashed #cbd5e1',
                                    p: 4.5,
                                    textAlign: 'center',
                                    mb: 3,
                                }}
                            >
                                <QrCodeScannerIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#475569', mb: 0.5 }}>
                                    Menunggu Pemindaian QR Code...
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                    Arahkan kamera ke QR Code pada ponsel pengunjung atau ketik kode tiket untuk memvalidasi.
                                </Typography>
                            </Paper>
                        )}

                        {/* RECENT SCANS SESSION LIST */}
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: '20px',
                                bgcolor: '#ffffff',
                                border: '1.5px solid #e2e8f0',
                                boxShadow: '0 4px 0 #e2e8f0, 0 12px 28px rgba(0,0,0,0.03)',
                                p: 2.5,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <HowToRegIcon sx={{ color: '#0284c7', fontSize: 20 }} />
                                    Riwayat Scan Sesi Ini ({recentScans.length})
                                </Typography>
                                {recentScans.length > 0 && (
                                    <Button
                                        size="small"
                                        onClick={() => setRecentScans([])}
                                        startIcon={<DeleteSweepIcon />}
                                        sx={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'none', fontWeight: 700 }}
                                    >
                                        Bersihkan
                                    </Button>
                                )}
                            </Box>

                            {recentScans.length === 0 ? (
                                <Box sx={{ py: 3, textAlign: 'center', color: '#94a3b8' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>Belum ada riwayat scan pada sesi ini.</Typography>
                                </Box>
                            ) : (
                                <Stack spacing={1.2}>
                                    {recentScans.map((r, i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 1.4,
                                                bgcolor: r.status === 'success' ? '#f0fdf4' : '#fef2f2',
                                                border: `1px solid ${r.status === 'success' ? '#bbf7d0' : '#fecaca'}`,
                                                borderRadius: '12px',
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '0.88rem' }}>
                                                    {r.ticket?.visitor_name || 'Pengunjung Tidak Dikenal'}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>
                                                    {r.ticket?.ticket_code} &bull; {r.timestamp}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={getCategoryMeta(r.ticket?.visitor_type).shortLabel}
                                                size="small"
                                                sx={{
                                                    bgcolor: getCategoryMeta(r.ticket?.visitor_type).bg,
                                                    color: getCategoryMeta(r.ticket?.visitor_type).color,
                                                    border: `1px solid ${getCategoryMeta(r.ticket?.visitor_type).border}`,
                                                    fontWeight: 900,
                                                    fontSize: '0.65rem',
                                                    height: 22,
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
