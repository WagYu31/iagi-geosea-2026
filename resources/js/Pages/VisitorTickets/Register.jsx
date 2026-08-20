import React, { useState, useRef, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Chip,
    Stack,
    Divider,
    IconButton,
    Alert,
    CircularProgress,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import StarIcon from '@mui/icons-material/Star';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';

export default function Register({
    priceExclusive = 150000,
    priceNonExclusive = 0,
    enabled = true,
    qrisImage = null,
    bankTransferInfo = '',
    eventDate = 'October 2026',
    eventVenue = 'Grand Ballroom Hotel Indonesia, Jakarta',
}) {
    const [visitorType, setVisitorType] = useState('non_exclusive');
    const [paymentMethod, setPaymentMethod] = useState('qris_indo');
    const [members, setMembers] = useState([
        { name: '', email: '', phone: '', institution: '' }
    ]);
    const [proofFile, setProofFile] = useState(null);
    const [proofPreview, setProofPreview] = useState(null);
    const [compressing, setCompressing] = useState(false);
    const [compressionStats, setCompressionStats] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Live Camera Viewfinder Modal State
    const [cameraModalOpen, setCameraModalOpen] = useState(false);
    const [cameraFacingMode, setCameraFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
    const [cameraLoading, setCameraLoading] = useState(false);
    const [cameraError, setCameraError] = useState(null);

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        visitor_type: 'non_exclusive',
        members: members,
        payment_method: 'qris_indo',
        proof_of_payment: null,
        original_file_size_kb: null,
        compressed_file_size_kb: null,
    });

    const handleTypeChange = (type) => {
        setVisitorType(type);
        setData('visitor_type', type);
    };

    const handleMemberChange = (index, field, value) => {
        const updated = [...members];
        updated[index][field] = value;
        setMembers(updated);
        setData('members', updated);
    };

    const addMember = () => {
        const updated = [...members, { name: '', email: '', phone: '', institution: '' }];
        setMembers(updated);
        setData('members', updated);
    };

    const removeMember = (index) => {
        if (members.length === 1) return;
        const updated = members.filter((_, i) => i !== index);
        setMembers(updated);
        setData('members', updated);
    };

    const handleCopyBankInfo = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(bankTransferInfo);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2500);
        }
    };

    // 3D Card Tilt on Mouse Move
    const handleCardMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x: x * 14, y: y * -14 });
    };

    const handleCardMouseLeave = () => {
        setMousePos({ x: 0, y: 0 });
    };

    // Client-side auto-image compression via HTML5 Canvas
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const originalSizeKb = Math.round(file.size / 1024);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    const MAX_DIM = 1600;
                    if (width > height && width > MAX_DIM) {
                        height = Math.round((height * MAX_DIM) / width);
                        width = MAX_DIM;
                    } else if (height > MAX_DIM) {
                        width = Math.round((width * MAX_DIM) / height);
                        height = MAX_DIM;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Canvas compression failed'));
                                return;
                            }
                            const compressedSizeKb = Math.round(blob.size / 1024);
                            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve({
                                file: compressedFile,
                                originalSizeKb,
                                compressedSizeKb,
                                previewUrl: URL.createObjectURL(blob),
                            });
                        },
                        'image/jpeg',
                        0.75
                    );
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const processFileAndSet = async (file) => {
        try {
            setCompressing(true);
            const result = await compressImage(file);
            setProofFile(result.file);
            setProofPreview(result.previewUrl);
            setCompressionStats({
                original: result.originalSizeKb,
                compressed: result.compressedSizeKb,
            });
            setData((prev) => ({
                ...prev,
                proof_of_payment: result.file,
                original_file_size_kb: result.originalSizeKb,
                compressed_file_size_kb: result.compressedSizeKb,
            }));
        } catch (error) {
            console.error('Image compression failed:', error);
            alert('Gagal memproses gambar. Silakan coba file lain.');
        } finally {
            setCompressing(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        processFileAndSet(file);
    };

    // ==========================================
    // DIRECT CAMERA STREAM (WebRTC Live Viewfinder)
    // ==========================================
    const startCamera = async (facingMode = 'environment') => {
        setCameraError(null);
        setCameraLoading(true);

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('WebRTC getUserMedia tidak didukung.');
            }

            const constraints = {
                video: {
                    facingMode: { ideal: facingMode },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setCameraLoading(false);
        } catch (err) {
            console.warn('Direct camera stream failed, falling back to native capture input:', err);
            setCameraLoading(false);
            setCameraModalOpen(false);
            // Fallback directly to native camera input
            if (cameraInputRef.current) {
                cameraInputRef.current.click();
            }
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraModalOpen(false);
    };

    const handleOpenDirectCamera = () => {
        // Check if browser has getUserMedia support and secure context (HTTPS / localhost)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            setCameraModalOpen(true);
            setCameraFacingMode('environment');
            setTimeout(() => {
                startCamera('environment');
            }, 100);
        } else {
            // Direct native camera trigger
            if (cameraInputRef.current) {
                cameraInputRef.current.click();
            }
        }
    };

    const handleSwitchCamera = () => {
        const nextMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
        setCameraFacingMode(nextMode);
        startCamera(nextMode);
    };

    const handleCapturePhoto = () => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (!blob) {
                alert('Gagal mengambil foto dari kamera.');
                return;
            }

            const capturedFile = new File([blob], `bukti_transfer_${Date.now()}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now(),
            });

            stopCamera();
            processFileAndSet(capturedFile);
        }, 'image/jpeg', 0.85);
    };

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        for (let i = 0; i < members.length; i++) {
            if (!members[i].name || !members[i].email) {
                alert(`Harap lengkapi Nama dan Email untuk Peserta #${i + 1}`);
                return;
            }
        }

        if (visitorType === 'exclusive' && !proofFile) {
            alert('Harap unggah bukti pembayaran untuk pendaftaran Visitor Exclusive.');
            return;
        }

        post(route('visitor.tickets.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const totalEstimate = visitorType === 'exclusive' ? priceExclusive * members.length : 0;
    const isExclusive = visitorType === 'exclusive';
    const primaryMember = members[0] || { name: '', institution: '' };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f8fafc',
                color: '#0f172a',
                py: { xs: 2, md: 3 },
            }}
        >
            <Head title="Registrasi Tiket Penonton - 55th PIT IAGI & GEOSEA 2026" />

            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3, md: 4 } }}>
                {/* Header Navigation Bar */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.2,
                        px: 2.5,
                        borderRadius: '14px',
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        mb: 2.5,
                    }}
                >
                    <Button
                        component={Link}
                        href="/"
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
                        Kembali ke Beranda
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                        <Typography variant="caption" sx={{ color: '#475569', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                            Official Conference Portal &bull; PIT IAGI & GEOSEA 2026
                        </Typography>
                    </Box>
                </Box>

                {/* Hero Header Section */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: '1.6rem', sm: '2rem', md: '2.2rem' },
                            letterSpacing: '-0.03em',
                            color: '#0f172a',
                            lineHeight: 1.2,
                            mb: 0.6,
                        }}
                    >
                        Registrasi Tiket Penonton
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: '#64748b',
                            maxWidth: 650,
                            mx: 'auto',
                            fontSize: { xs: '0.85rem', md: '0.92rem' },
                            lineHeight: 1.5,
                            mb: 1.5,
                        }}
                    >
                        Dapatkan tiket resmi & QR Code digital untuk akses arena pameran geologi, sesi poster ilmiah, serta zona industri energi & mineral.
                    </Typography>

                    {/* Venue & Date */}
                    <Box
                        sx={{
                            display: 'inline-flex',
                            gap: { xs: 1.5, sm: 2.5 },
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            px: 2,
                            py: 0.6,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <EventIcon sx={{ fontSize: 16, color: '#0284c7' }} />
                            <Typography variant="caption" sx={{ color: '#334155', fontWeight: 700 }}>
                                {eventDate}
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ height: 14, my: 'auto', borderColor: '#cbd5e1' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <LocationOnIcon sx={{ fontSize: 16, color: '#e11d48' }} />
                            <Typography variant="caption" sx={{ color: '#334155', fontWeight: 700 }}>
                                {eventVenue}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {!enabled ? (
                    <Alert
                        severity="warning"
                        sx={{
                            borderRadius: '14px',
                            bgcolor: '#fffbeb',
                            color: '#b45309',
                            border: '1px solid #fde68a',
                            p: 2.5,
                        }}
                    >
                        Pendaftaran tiket penonton saat ini sedang ditutup oleh panitia.
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* BULLETPROOF FLEXBOX 2-COLUMN LAYOUT: FORM ON LEFT, BADGE ON RIGHT */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', lg: 'row' },
                                gap: 3,
                                alignItems: 'flex-start',
                            }}
                        >
                            {/* LEFT COLUMN: STEPS 1, 2, 3 (FORM) */}
                            <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 65%' }, width: '100%' }}>
                                <Stack spacing={2.5}>
                                    {/* SECTION 1: PILIH KATEGORI TIKET */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            borderRadius: '16px',
                                            bgcolor: '#ffffff',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 26,
                                                    height: 26,
                                                    borderRadius: '8px',
                                                    bgcolor: '#094d42',
                                                    color: '#fff',
                                                    fontSize: '0.8rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 900,
                                                }}
                                            >
                                                1
                                            </Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                                Pilih Kategori Tiket
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                            {/* Free Card */}
                                            <Box
                                                onClick={() => handleTypeChange('non_exclusive')}
                                                sx={{
                                                    cursor: 'pointer',
                                                    borderRadius: '14px',
                                                    bgcolor: visitorType === 'non_exclusive' ? '#f0fdf4' : '#ffffff',
                                                    border: `2px solid ${visitorType === 'non_exclusive' ? '#10b981' : '#e2e8f0'}`,
                                                    p: 2,
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    transition: 'all 0.2s',
                                                    '&:hover': { borderColor: '#10b981', bgcolor: '#f0fdf4' },
                                                }}
                                            >
                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Chip
                                                            label="FREE PASS"
                                                            size="small"
                                                            sx={{ bgcolor: '#dcfce7', color: '#047857', fontWeight: 900, fontSize: '0.68rem', height: 20 }}
                                                        />
                                                        <Box
                                                            sx={{
                                                                width: 18,
                                                                height: 18,
                                                                borderRadius: '50%',
                                                                border: `2px solid ${visitorType === 'non_exclusive' ? '#10b981' : '#cbd5e1'}`,
                                                                bgcolor: visitorType === 'non_exclusive' ? '#10b981' : 'transparent',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            {visitorType === 'non_exclusive' && <CheckCircleIcon sx={{ fontSize: 13, color: '#fff' }} />}
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                                        Visitor Non-Exclusive
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#059669', mb: 0.8, fontSize: '1.1rem' }}>
                                                        GRATIS
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', lineHeight: 1.4 }}>
                                                        Akses pameran umum & poster presentation.
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ mt: 1.5, pt: 1, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                                                    <Typography variant="caption" sx={{ color: '#334155', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                                                        <CheckCircleIcon sx={{ fontSize: 13, color: '#10b981' }} /> E-Tiket instan & Cetak Lanyard
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* VIP Card */}
                                            <Box
                                                onClick={() => handleTypeChange('exclusive')}
                                                sx={{
                                                    cursor: 'pointer',
                                                    borderRadius: '14px',
                                                    bgcolor: visitorType === 'exclusive' ? '#fffbeb' : '#ffffff',
                                                    border: `2px solid ${visitorType === 'exclusive' ? '#f59e0b' : '#e2e8f0'}`,
                                                    p: 2,
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    transition: 'all 0.2s',
                                                    '&:hover': { borderColor: '#f59e0b', bgcolor: '#fffbeb' },
                                                }}
                                            >
                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Chip
                                                            icon={<StarIcon sx={{ fontSize: 11, color: '#92400e !important' }} />}
                                                            label="VIP PASS"
                                                            size="small"
                                                            sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 900, fontSize: '0.68rem', height: 20 }}
                                                        />
                                                        <Box
                                                            sx={{
                                                                width: 18,
                                                                height: 18,
                                                                borderRadius: '50%',
                                                                border: `2px solid ${visitorType === 'exclusive' ? '#f59e0b' : '#cbd5e1'}`,
                                                                bgcolor: visitorType === 'exclusive' ? '#f59e0b' : 'transparent',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            {visitorType === 'exclusive' && <CheckCircleIcon sx={{ fontSize: 13, color: '#fff' }} />}
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                                        Visitor Exclusive
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#b45309', mb: 0.8, fontSize: '1.1rem' }}>
                                                        Rp {priceExclusive.toLocaleString('id-ID')}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', lineHeight: 1.4 }}>
                                                        Plenary Session, VIP Lounge, Lanyard Gold & Seminar Kit.
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ mt: 1.5, pt: 1, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                                                    <Typography variant="caption" sx={{ color: '#334155', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                                                        <StarIcon sx={{ fontSize: 13, color: '#d97706' }} /> Akses Full VIP & Seminar Kit
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Paper>

                                    {/* SECTION 2: DATA PENGUNJUNG */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            borderRadius: '16px',
                                            bgcolor: '#ffffff',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                <Box
                                                    sx={{
                                                        width: 26,
                                                        height: 26,
                                                        borderRadius: '8px',
                                                        bgcolor: '#094d42',
                                                        color: '#fff',
                                                        fontSize: '0.8rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 900,
                                                    }}
                                                >
                                                    2
                                                </Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                                    Data Pengunjung {members.length > 1 && `(${members.length} Orang)`}
                                                </Typography>
                                            </Box>

                                            <Button
                                                startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                                                onClick={addMember}
                                                size="small"
                                                sx={{
                                                    color: '#094d42',
                                                    bgcolor: '#f0fdf4',
                                                    border: '1px dashed #86efac',
                                                    borderRadius: '8px',
                                                    textTransform: 'none',
                                                    fontWeight: 800,
                                                    fontSize: '0.78rem',
                                                    px: 1.5,
                                                    py: 0.4,
                                                    '&:hover': { bgcolor: '#dcfce7' },
                                                }}
                                            >
                                                + Tambah Peserta
                                            </Button>
                                        </Box>

                                        <Stack spacing={2}>
                                            {members.map((member, idx) => (
                                                <Box
                                                    key={idx}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: '12px',
                                                        bgcolor: '#f8fafc',
                                                        border: '1px solid #e2e8f0',
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Box
                                                                sx={{
                                                                    width: 20,
                                                                    height: 20,
                                                                    borderRadius: '4px',
                                                                    bgcolor: idx === 0 ? '#e0f2fe' : '#e2e8f0',
                                                                    color: idx === 0 ? '#0284c7' : '#475569',
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: 900,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                {idx + 1}
                                                            </Box>
                                                            <Typography variant="caption" sx={{ fontWeight: 800, color: idx === 0 ? '#0284c7' : '#334155' }}>
                                                                {idx === 0 ? 'Pemesan Utama / Ketua' : `Peserta #${idx + 1}`}
                                                            </Typography>
                                                        </Box>

                                                        {members.length > 1 && (
                                                            <IconButton
                                                                onClick={() => removeMember(idx)}
                                                                size="small"
                                                                sx={{ color: '#ef4444', p: 0.3 }}
                                                            >
                                                                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                                                            </IconButton>
                                                        )}
                                                    </Box>

                                                    <Grid container spacing={1.5}>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Nama Lengkap *"
                                                                placeholder="Sesuai KTP"
                                                                value={member.name}
                                                                onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                                                fullWidth
                                                                required
                                                                size="small"
                                                                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#ffffff', borderRadius: '8px' } }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Alamat Email *"
                                                                type="email"
                                                                placeholder="contoh@gmail.com"
                                                                value={member.email}
                                                                onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                                                                fullWidth
                                                                required
                                                                size="small"
                                                                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#ffffff', borderRadius: '8px' } }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="No. WhatsApp / HP"
                                                                placeholder="0812xxxxxxxx"
                                                                value={member.phone}
                                                                onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                                                                fullWidth
                                                                size="small"
                                                                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#ffffff', borderRadius: '8px' } }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Instansi / Universitas"
                                                                placeholder="Contoh: ITB / Pertamina"
                                                                value={member.institution}
                                                                onChange={(e) => handleMemberChange(idx, 'institution', e.target.value)}
                                                                fullWidth
                                                                size="small"
                                                                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#ffffff', borderRadius: '8px' } }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Paper>

                                    {/* SECTION 3: PEMBAYARAN (EXCLUSIVE ONLY) */}
                                    {visitorType === 'exclusive' && (
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2.5,
                                                borderRadius: '16px',
                                                bgcolor: '#ffffff',
                                                border: '1.5px solid #fde68a',
                                                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.08)',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                                                <Box
                                                    sx={{
                                                        width: 26,
                                                        height: 26,
                                                        borderRadius: '8px',
                                                        bgcolor: '#d97706',
                                                        color: '#fff',
                                                        fontSize: '0.8rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 900,
                                                    }}
                                                >
                                                    3
                                                </Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                                    Instruksi Pembayaran VIP
                                                </Typography>
                                            </Box>

                                            {/* Payment Method Selector */}
                                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 2 }}>
                                                <Paper
                                                    onClick={() => {
                                                        setPaymentMethod('qris_indo');
                                                        setData('payment_method', 'qris_indo');
                                                    }}
                                                    sx={{
                                                        p: 1.5,
                                                        borderRadius: '10px',
                                                        bgcolor: paymentMethod === 'qris_indo' ? '#f0fdf4' : '#f8fafc',
                                                        border: `2px solid ${paymentMethod === 'qris_indo' ? '#10b981' : '#e2e8f0'}`,
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1.2,
                                                    }}
                                                >
                                                    <QrCodeIcon sx={{ color: '#059669', fontSize: 20 }} />
                                                    <Box>
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', display: 'block' }}>QRIS Indonesia</Typography>
                                                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>BCA, GoPay, OVO, Dana</Typography>
                                                    </Box>
                                                </Paper>
                                                <Paper
                                                    onClick={() => {
                                                        setPaymentMethod('foreign_bank_transfer');
                                                        setData('payment_method', 'foreign_bank_transfer');
                                                    }}
                                                    sx={{
                                                        p: 1.5,
                                                        borderRadius: '10px',
                                                        bgcolor: paymentMethod === 'foreign_bank_transfer' ? '#f0f9ff' : '#f8fafc',
                                                        border: `2px solid ${paymentMethod === 'foreign_bank_transfer' ? '#0284c7' : '#e2e8f0'}`,
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1.2,
                                                    }}
                                                >
                                                    <AccountBalanceIcon sx={{ color: '#0284c7', fontSize: 20 }} />
                                                    <Box>
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', display: 'block' }}>Bank Transfer</Typography>
                                                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>Manual Transfer Bank</Typography>
                                                    </Box>
                                                </Paper>
                                            </Box>

                                            {/* QRIS / Bank Detail */}
                                            {paymentMethod === 'qris_indo' && (
                                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', mb: 2 }}>
                                                    {qrisImage ? (
                                                        <Box
                                                            component="img"
                                                            src={qrisImage.startsWith('http') || qrisImage.startsWith('/') ? qrisImage : `/storage/${qrisImage}`}
                                                            alt="QRIS IAGI"
                                                            sx={{ maxWidth: 160, borderRadius: '10px', mx: 'auto', mb: 1, p: 1, bgcolor: '#fff', border: '1px solid #e2e8f0' }}
                                                        />
                                                    ) : (
                                                        <Box sx={{ p: 2, border: '2px dashed #cbd5e1', borderRadius: '10px', maxWidth: 160, mx: 'auto', mb: 1, bgcolor: '#fff' }}>
                                                            <QrCodeIcon sx={{ fontSize: 45, color: '#94a3b8' }} />
                                                            <Typography variant="caption" sx={{ display: 'block', color: '#64748b' }}>QRIS Resmi PIT IAGI</Typography>
                                                        </Box>
                                                    )}
                                                    <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, display: 'block' }}>
                                                        Scan QRIS menggunakan aplikasi m-Banking / E-Wallet pilihan Anda.
                                                    </Typography>
                                                </Box>
                                            )}

                                            {paymentMethod === 'foreign_bank_transfer' && (
                                                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', mb: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#0284c7' }}>
                                                            Rekening Transfer Bank:
                                                        </Typography>
                                                        <Button
                                                            size="small"
                                                            startIcon={<ContentCopyIcon sx={{ fontSize: 12 }} />}
                                                            onClick={handleCopyBankInfo}
                                                            sx={{ color: '#0284c7', fontSize: '0.7rem', p: 0.2 }}
                                                        >
                                                            {copySuccess ? 'Tersalin!' : 'Salin'}
                                                        </Button>
                                                    </Box>
                                                    <Typography variant="caption" sx={{ color: '#0f172a', whiteSpace: 'pre-line', fontFamily: 'monospace', bgcolor: '#fff', p: 1.5, borderRadius: '8px', border: '1px solid #e2e8f0', display: 'block' }}>
                                                        {bankTransferInfo}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Upload Proof with Direct Camera Trigger */}
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', display: 'block', mb: 0.5 }}>
                                                Unggah Bukti Transfer *
                                            </Typography>

                                            {/* Hidden Standard File Input */}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                                style={{ display: 'none' }}
                                            />
                                            {/* Hidden Native Direct Camera Input */}
                                            <input
                                                ref={cameraInputRef}
                                                type="file"
                                                accept="image/*"
                                                capture="environment"
                                                onChange={handleFileSelect}
                                                style={{ display: 'none' }}
                                            />

                                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<PhotoCameraIcon sx={{ fontSize: 16 }} />}
                                                    onClick={handleOpenDirectCamera}
                                                    disabled={compressing}
                                                    sx={{
                                                        borderRadius: '8px',
                                                        bgcolor: '#0284c7',
                                                        color: '#ffffff',
                                                        textTransform: 'none',
                                                        fontWeight: 800,
                                                        fontSize: '0.78rem',
                                                        boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
                                                        '&:hover': { bgcolor: '#0369a1' },
                                                    }}
                                                >
                                                    📷 Buka Kamera Langsung
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<CloudUploadIcon sx={{ fontSize: 16 }} />}
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={compressing}
                                                    sx={{ borderRadius: '8px', borderColor: '#cbd5e1', color: '#475569', textTransform: 'none', fontWeight: 700, fontSize: '0.78rem' }}
                                                >
                                                    📁 Pilih dari Galeri
                                                </Button>
                                            </Box>

                                            {compressing && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                                                    <CircularProgress size={16} sx={{ color: '#059669' }} />
                                                    <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>
                                                        Mengompresi foto otomatis...
                                                    </Typography>
                                                </Box>
                                            )}

                                            {proofPreview && (
                                                <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box component="img" src={proofPreview} alt="Bukti" sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '6px', border: '1px solid #86efac' }} />
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                                            <CheckCircleIcon sx={{ fontSize: 14 }} /> Foto berhasil diambil ({compressionStats?.compressed} KB)
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>
                                                            Siap dikirim bersama formulir pendaftaran.
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Paper>
                                    )}
                                </Stack>
                            </Box>

                            {/* RIGHT COLUMN: 3D BADGE PREVIEW + ORDER SUMMARY + CTA BUTTON */}
                            <Box sx={{ flex: { xs: '1 1 100%', lg: '0 0 360px' }, width: '100%', position: { lg: 'sticky' }, top: { lg: 20 } }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        borderRadius: '16px',
                                        bgcolor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <VisibilityIcon sx={{ fontSize: 14, color: isExclusive ? '#d97706' : '#059669' }} /> Live 3D Badge
                                        </Typography>
                                        <Chip
                                            label={isExclusive ? 'VIP PASS' : 'FREE PASS'}
                                            size="small"
                                            sx={{
                                                bgcolor: isExclusive ? '#fef3c7' : '#ecfdf5',
                                                color: isExclusive ? '#b45309' : '#047857',
                                                fontWeight: 900,
                                                fontSize: '0.68rem',
                                                height: 20,
                                            }}
                                        />
                                    </Box>

                                    {/* 3D Perspective Card Container */}
                                    <Box
                                        onMouseMove={handleCardMouseMove}
                                        onMouseLeave={handleCardMouseLeave}
                                        sx={{
                                            perspective: '800px',
                                            cursor: 'pointer',
                                            my: 1,
                                        }}
                                    >
                                        {/* Lanyard Top Strap & Clip */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: -1, position: 'relative', zIndex: 3 }}>
                                            <Box
                                                sx={{
                                                    width: 30,
                                                    height: 18,
                                                    bgcolor: isExclusive ? '#d97706' : '#094d42',
                                                    borderRadius: '3px 3px 0 0',
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    width: 14,
                                                    height: 10,
                                                    bgcolor: '#cbd5e1',
                                                    borderRadius: '2px',
                                                    border: '1px solid #94a3b8',
                                                }}
                                            />
                                        </Box>

                                        {/* Physical Lanyard Card 3D Body */}
                                        <Box
                                            sx={{
                                                transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
                                                transition: 'transform 0.15s ease-out',
                                                borderRadius: '16px',
                                                bgcolor: '#ffffff',
                                                border: `2px solid ${isExclusive ? '#f59e0b' : '#10b981'}`,
                                                boxShadow: isExclusive
                                                    ? '0 12px 25px -5px rgba(245, 158, 11, 0.25), 0 4px 10px rgba(0,0,0,0.04)'
                                                    : '0 12px 25px -5px rgba(16, 185, 129, 0.25), 0 4px 10px rgba(0,0,0,0.04)',
                                                p: 2,
                                                textAlign: 'center',
                                                position: 'relative',
                                            }}
                                        >
                                            {/* Hole Punch */}
                                            <Box
                                                sx={{
                                                    width: 24,
                                                    height: 5,
                                                    borderRadius: '3px',
                                                    bgcolor: '#e2e8f0',
                                                    mx: 'auto',
                                                    mb: 1.5,
                                                }}
                                            />

                                            <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#094d42', fontSize: '0.68rem', display: 'block' }}>
                                                55TH PIT IAGI & GEOSEA 2026
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6rem', display: 'block', mb: 1.5 }}>
                                                ANNUAL SCIENTIFIC CONVENTION
                                            </Typography>

                                            {/* QR Code */}
                                            <Box
                                                sx={{
                                                    p: 1.2,
                                                    bgcolor: '#ffffff',
                                                    borderRadius: '10px',
                                                    border: '1px solid #e2e8f0',
                                                    width: 'fit-content',
                                                    mx: 'auto',
                                                    mb: 1.5,
                                                }}
                                            >
                                                <QRCodeSVG
                                                    value="TKT-SAMPLE-PREVIEW"
                                                    size={95}
                                                    level="H"
                                                    includeMargin={false}
                                                />
                                            </Box>

                                            {/* Live Name & Institution */}
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: 900,
                                                    color: '#0f172a',
                                                    lineHeight: 1.2,
                                                    fontSize: '1rem',
                                                    minHeight: '1.2em',
                                                    mb: 0.2,
                                                }}
                                            >
                                                {primaryMember.name || 'Nama Peserta'}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: isExclusive ? '#d97706' : '#0284c7',
                                                    fontSize: '0.75rem',
                                                    display: 'block',
                                                    minHeight: '1.2em',
                                                    mb: 1.5,
                                                }}
                                            >
                                                {primaryMember.institution || 'Instansi / Universitas'}
                                            </Typography>

                                            {/* Bottom Banner */}
                                            <Box
                                                sx={{
                                                    bgcolor: isExclusive ? '#f59e0b' : '#094d42',
                                                    color: '#ffffff',
                                                    py: 0.7,
                                                    borderRadius: '8px',
                                                    fontWeight: 900,
                                                    letterSpacing: '0.06em',
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.72rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 0.5,
                                                }}
                                            >
                                                {isExclusive && <StarIcon sx={{ fontSize: 13 }} />}
                                                {isExclusive ? 'VISITOR VIP' : 'VISITOR PASS'}
                                                {isExclusive && <StarIcon sx={{ fontSize: 13 }} />}
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Order Summary Box */}
                                    <Box sx={{ mt: 2, p: 1.8, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', mb: 1 }}>
                                            Ringkasan Pesanan:
                                        </Typography>
                                        <Stack spacing={0.6}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="caption" sx={{ color: '#64748b' }}>Kategori:</Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: isExclusive ? '#b45309' : '#059669' }}>
                                                    {isExclusive ? 'Exclusive VIP' : 'Non-Exclusive'}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="caption" sx={{ color: '#64748b' }}>Jumlah Tiket:</Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                                    {members.length} Orang
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ borderColor: '#e2e8f0', my: 0.5 }} />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a' }}>Total Tagihan:</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 900, color: isExclusive ? '#b45309' : '#059669' }}>
                                                    {isExclusive ? `Rp ${totalEstimate.toLocaleString('id-ID')}` : 'GRATIS'}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>

                                    {/* Submit CTA Button */}
                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            disabled={processing || compressing}
                                            startIcon={processing ? <CircularProgress size={18} color="inherit" /> : <ConfirmationNumberIcon />}
                                            sx={{
                                                background: isExclusive 
                                                    ? 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)' 
                                                    : 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                                                color: '#ffffff',
                                                fontWeight: 900,
                                                fontSize: '0.92rem',
                                                py: 1.4,
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                boxShadow: isExclusive
                                                    ? '0 4px 0 #92400e, 0 8px 18px rgba(245, 158, 11, 0.35)'
                                                    : '0 4px 0 #047857, 0 8px 18px rgba(16, 185, 129, 0.35)',
                                                '&:hover': {
                                                    background: isExclusive
                                                        ? 'linear-gradient(180deg, #fbbf24 0%, #b45309 100%)'
                                                        : 'linear-gradient(180deg, #34d399 0%, #047857 100%)',
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: isExclusive
                                                        ? '0 5px 0 #92400e, 0 10px 20px rgba(245, 158, 11, 0.45)'
                                                        : '0 5px 0 #047857, 0 10px 20px rgba(16, 185, 129, 0.45)',
                                                },
                                                '&:active': {
                                                    transform: 'translateY(3px)',
                                                    boxShadow: isExclusive
                                                        ? '0 1px 0 #92400e, 0 3px 6px rgba(245, 158, 11, 0.3)'
                                                        : '0 1px 0 #047857, 0 3px 6px rgba(16, 185, 129, 0.3)',
                                                },
                                                transition: 'all 0.12s ease',
                                            }}
                                        >
                                            {processing 
                                                ? 'Memproses...' 
                                                : isExclusive 
                                                    ? `Terbitkan VIP (Rp ${totalEstimate.toLocaleString('id-ID')})` 
                                                    : 'Terbitkan E-Tiket Gratis'
                                            }
                                        </Button>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', textAlign: 'center', mt: 1, fontSize: '0.68rem', fontWeight: 600 }}>
                                            🔒 Data terenkripsi & dikelola Panitia IAGI
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Box>
                        </Box>
                    </form>
                )}
            </Container>

            {/* LIVE CAMERA VIEWFINDER MODAL */}
            <Dialog
                open={cameraModalOpen}
                onClose={stopCamera}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        bgcolor: '#0f172a',
                        color: '#fff',
                        overflow: 'hidden',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        px: 2.5,
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhotoCameraIcon sx={{ color: '#38bdf8' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fff' }}>
                            Ambil Foto Bukti Transfer
                        </Typography>
                    </Box>
                    <IconButton onClick={stopCamera} size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#fff' } }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0, bgcolor: '#000', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
                    {cameraLoading ? (
                        <Box sx={{ textAlign: 'center', p: 4 }}>
                            <CircularProgress sx={{ color: '#38bdf8', mb: 2 }} />
                            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                                Menghubungkan ke kamera HP...
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', bgcolor: '#000' }}>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '65vh',
                                    objectFit: 'contain',
                                    display: 'block',
                                }}
                            />
                            {/* Viewfinder Target Border Overlay */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: '10%',
                                    border: '2px dashed rgba(255, 255, 255, 0.6)',
                                    borderRadius: '12px',
                                    pointerEvents: 'none',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    pt: 1,
                                }}
                            >
                                <Typography variant="caption" sx={{ bgcolor: 'rgba(0,0,0,0.6)', px: 1, py: 0.3, borderRadius: '4px', color: '#fff', fontSize: '0.7rem' }}>
                                    Arahkan ke struk / bukti transfer
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions
                    sx={{
                        p: 2,
                        px: 2.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: '#0f172a',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <Button
                        startIcon={<CameraswitchIcon />}
                        onClick={handleSwitchCamera}
                        size="small"
                        sx={{
                            color: '#94a3b8',
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: '8px',
                            '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
                        }}
                    >
                        Ganti Kamera
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleCapturePhoto}
                        startIcon={<PhotoCameraIcon />}
                        sx={{
                            bgcolor: '#10b981',
                            color: '#fff',
                            fontWeight: 900,
                            borderRadius: '12px',
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                            '&:hover': { bgcolor: '#059669' },
                        }}
                    >
                        📸 Jepret Foto
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
