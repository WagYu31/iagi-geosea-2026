import React, { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    Chip,
    Stack,
    Divider,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    Alert,
    CircularProgress,
    Tooltip,
    Paper,
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
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

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

                    // Max resolution dimension: 1600px
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

                    // Compress to JPEG quality 0.75
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

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        for (let i = 0; i < members.length; i++) {
            if (!members[i].name || !members[i].email) {
                alert(`Harap lengkapi Nama dan Email untuk Peserta #${i + 1}`);
                return;
            }
        }

        if (visitorType === 'exclusive' && !proofFile) {
            alert('Harap unggah bukti pembayaran untuk Visitor Exclusive.');
            return;
        }

        post(route('visitor.tickets.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const totalEstimate = visitorType === 'exclusive' ? priceExclusive * members.length : 0;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0b1329', color: '#f8fafc', py: { xs: 4, md: 8 } }}>
            <Head title="Registrasi Tiket Penonton - 55th PIT IAGI & GEOSEA 2026" />

            <Container maxWidth="md">
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    <Chip
                        icon={<ConfirmationNumberIcon sx={{ fontSize: 16, color: '#10b981 !important' }} />}
                        label="55th PIT IAGI & GEOSEA XIX 2026"
                        sx={{
                            bgcolor: 'rgba(16, 185, 129, 0.12)',
                            color: '#10b981',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            mb: 2,
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                        }}
                    />
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.8rem', md: '2.5rem' },
                            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.02em',
                            mb: 1.5,
                        }}
                    >
                        Registrasi Tiket Penonton
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#94a3b8', maxWidth: 600, mx: 'auto', fontSize: '0.95rem' }}>
                        Dapatkan tiket resmi dan akses langsung ke arena pameran & konferensi geologi terbesar di Asia Tenggara.
                    </Typography>

                    {/* Venue & Date Card */}
                    <Box
                        sx={{
                            display: 'inline-flex',
                            gap: 3,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            bgcolor: 'rgba(30, 41, 59, 0.6)',
                            border: '1px solid rgba(51, 65, 85, 0.7)',
                            borderRadius: '12px',
                            px: 3,
                            py: 1.2,
                            mt: 3,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon sx={{ fontSize: 18, color: '#38bdf8' }} />
                            <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.85rem' }}>
                                {eventDate}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon sx={{ fontSize: 18, color: '#f43f5e' }} />
                            <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.85rem' }}>
                                {eventVenue}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {!enabled ? (
                    <Alert severity="warning" sx={{ borderRadius: '12px' }}>
                        Pendaftaran tiket penonton saat ini sedang ditutup oleh panitia. Silakan hubungi panitia untuk informasi lebih lanjut.
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Choose Visitor Category */}
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#10b981', color: '#fff', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>1</Box>
                            Pilih Kategori Tiket
                        </Typography>

                        <Grid container spacing={2.5} sx={{ mb: 4 }}>
                            {/* Non-Exclusive Card */}
                            <Grid item xs={12} sm={6}>
                                <Card
                                    onClick={() => handleTypeChange('non_exclusive')}
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: '16px',
                                        bgcolor: visitorType === 'non_exclusive' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(15, 23, 42, 0.8)',
                                        border: `2px solid ${visitorType === 'non_exclusive' ? '#3b82f6' : 'rgba(51, 65, 85, 0.7)'}`,
                                        transition: 'all 0.25s ease',
                                        '&:hover': { borderColor: '#3b82f6', transform: 'translateY(-2px)' },
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                            <Chip
                                                label="GRATIS / FREE"
                                                size="small"
                                                sx={{ bgcolor: '#2563eb', color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}
                                            />
                                            <Radio
                                                checked={visitorType === 'non_exclusive'}
                                                onChange={() => handleTypeChange('non_exclusive')}
                                                sx={{ color: '#64748b', '&.Mui-checked': { color: '#3b82f6' }, p: 0 }}
                                            />
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc', mb: 0.5 }}>
                                            Visitor Non-Exclusive
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.85rem', mb: 2 }}>
                                            Akses area pameran umum & poster session. Tanpa dipungut biaya registrasi.
                                        </Typography>
                                        <Divider sx={{ borderColor: 'rgba(51, 65, 85, 0.6)', my: 1.5 }} />
                                        <Stack spacing={1}>
                                            <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CheckCircleIcon sx={{ fontSize: 15, color: '#10b981' }} /> E-Tiket instan ber-QR Code
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CheckCircleIcon sx={{ fontSize: 15, color: '#10b981' }} /> Cetak Kartu Lanyard Non-Exclusive di Gate
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CheckCircleIcon sx={{ fontSize: 15, color: '#10b981' }} /> Tidak perlu upload bukti bayar
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Exclusive Card */}
                            <Grid item xs={12} sm={6}>
                                <Card
                                    onClick={() => handleTypeChange('exclusive')}
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: '16px',
                                        bgcolor: visitorType === 'exclusive' ? 'rgba(234, 179, 8, 0.12)' : 'rgba(15, 23, 42, 0.8)',
                                        border: `2px solid ${visitorType === 'exclusive' ? '#eab308' : 'rgba(51, 65, 85, 0.7)'}`,
                                        transition: 'all 0.25s ease',
                                        position: 'relative',
                                        '&:hover': { borderColor: '#eab308', transform: 'translateY(-2px)' },
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                            <Chip
                                                icon={<StarIcon sx={{ fontSize: 14, color: '#000 !important' }} />}
                                                label="EXCLUSIVE VIP"
                                                size="small"
                                                sx={{ bgcolor: '#eab308', color: '#000', fontWeight: 800, fontSize: '0.7rem' }}
                                            />
                                            <Radio
                                                checked={visitorType === 'exclusive'}
                                                onChange={() => handleTypeChange('exclusive')}
                                                sx={{ color: '#64748b', '&.Mui-checked': { color: '#eab308' }, p: 0 }}
                                            />
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc', mb: 0.5 }}>
                                            Visitor Exclusive
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#fbbf24', mb: 1 }}>
                                            Rp {priceExclusive.toLocaleString('id-ID')} <Typography component="span" variant="caption" sx={{ color: '#94a3b8' }}>/ orang</Typography>
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.85rem', mb: 2 }}>
                                            Akses penuh area VIP, Plenary Session, Exhibition, Seminar Kit & Lanyard Badge Khusus.
                                        </Typography>
                                        <Divider sx={{ borderColor: 'rgba(51, 65, 85, 0.6)', my: 1.5 }} />
                                        <Stack spacing={1}>
                                            <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CheckCircleIcon sx={{ fontSize: 15, color: '#eab308' }} /> Kartu Lanyard Desain Exclusive VIP
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CheckCircleIcon sx={{ fontSize: 15, color: '#eab308' }} /> Akses Main Plenary & VIP Lounge
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CheckCircleIcon sx={{ fontSize: 15, color: '#eab308' }} /> E-Certificate & Seminar Kit
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Step 2: Visitor Data (Single or Group) */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#10b981', color: '#fff', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>2</Box>
                                Data Pengunjung {members.length > 1 && `(${members.length} Orang)`}
                            </Typography>
                            <Button
                                startIcon={<PersonAddIcon />}
                                onClick={addMember}
                                size="small"
                                sx={{
                                    color: '#10b981',
                                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.8rem',
                                    '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.2)' },
                                }}
                            >
                                + Tambah Peserta Rombongan
                            </Button>
                        </Box>

                        <Stack spacing={2.5} sx={{ mb: 4 }}>
                            {members.map((member, idx) => (
                                <Card
                                    key={idx}
                                    sx={{
                                        borderRadius: '14px',
                                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                                        border: '1px solid rgba(51, 65, 85, 0.7)',
                                    }}
                                >
                                    <CardContent sx={{ p: 2.5 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#38bdf8' }}>
                                                {idx === 0 ? '👤 Data Pemesan / Ketua' : `👤 Peserta #${idx + 1}`}
                                            </Typography>
                                            {members.length > 1 && (
                                                <IconButton
                                                    onClick={() => removeMember(idx)}
                                                    size="small"
                                                    sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Nama Lengkap *"
                                                    value={member.name}
                                                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                                    fullWidth
                                                    size="small"
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': { bgcolor: 'rgba(30, 41, 59, 0.8)', color: '#fff', borderRadius: '10px' },
                                                        '& .MuiInputLabel-root': { color: '#94a3b8' },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Alamat Email *"
                                                    type="email"
                                                    value={member.email}
                                                    onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                                                    fullWidth
                                                    size="small"
                                                    required
                                                    helperText="E-Tiket & QR Code akan dikirim ke email ini"
                                                    FormHelperTextProps={{ sx: { color: '#64748b', fontSize: '0.7rem' } }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': { bgcolor: 'rgba(30, 41, 59, 0.8)', color: '#fff', borderRadius: '10px' },
                                                        '& .MuiInputLabel-root': { color: '#94a3b8' },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="No. WhatsApp / HP"
                                                    value={member.phone}
                                                    onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                                                    fullWidth
                                                    size="small"
                                                    placeholder="0812xxxxxxxx"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': { bgcolor: 'rgba(30, 41, 59, 0.8)', color: '#fff', borderRadius: '10px' },
                                                        '& .MuiInputLabel-root': { color: '#94a3b8' },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Instansi / Universitas / Perusahaan"
                                                    value={member.institution}
                                                    onChange={(e) => handleMemberChange(idx, 'institution', e.target.value)}
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Contoh: ITB / Pertamina / Umum"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': { bgcolor: 'rgba(30, 41, 59, 0.8)', color: '#fff', borderRadius: '10px' },
                                                        '& .MuiInputLabel-root': { color: '#94a3b8' },
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>

                        {/* Step 3: Payment Section (Exclusive only) */}
                        {visitorType === 'exclusive' && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#10b981', color: '#fff', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>3</Box>
                                    Pembayaran Tiket Exclusive
                                </Typography>

                                <Card sx={{ borderRadius: '14px', bgcolor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(51, 65, 85, 0.7)', mb: 3 }}>
                                    <CardContent sx={{ p: 3 }}>
                                        {/* Total Summary */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, bgcolor: 'rgba(30, 41, 59, 0.8)', p: 2, borderRadius: '10px' }}>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Total Tagihan ({members.length} Tiket Exclusive)</Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#fbbf24' }}>
                                                    Rp {totalEstimate.toLocaleString('id-ID')}
                                                </Typography>
                                            </Box>
                                            <Chip label="Menunggu Pembayaran" size="small" sx={{ bgcolor: 'rgba(234, 179, 8, 0.2)', color: '#fbbf24', fontWeight: 700 }} />
                                        </Box>

                                        {/* Payment Method Selector */}
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#cbd5e1', mb: 1.5 }}>
                                            Pilih Metode Pembayaran:
                                        </Typography>

                                        <RadioGroup
                                            value={paymentMethod}
                                            onChange={(e) => {
                                                setPaymentMethod(e.target.value);
                                                setData('payment_method', e.target.value);
                                            }}
                                            sx={{ mb: 2.5 }}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Paper
                                                        onClick={() => {
                                                            setPaymentMethod('qris_indo');
                                                            setData('payment_method', 'qris_indo');
                                                        }}
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: '12px',
                                                            bgcolor: paymentMethod === 'qris_indo' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                                                            border: `1px solid ${paymentMethod === 'qris_indo' ? '#10b981' : 'rgba(51, 65, 85, 0.6)'}`,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1.5,
                                                        }}
                                                    >
                                                        <QrCodeIcon sx={{ color: '#10b981', fontSize: 28 }} />
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff' }}>QRIS Indonesia</Typography>
                                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>BCA, Mandiri, GoPay, OVO, Dana</Typography>
                                                        </Box>
                                                        <Radio checked={paymentMethod === 'qris_indo'} sx={{ p: 0, color: '#10b981' }} />
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Paper
                                                        onClick={() => {
                                                            setPaymentMethod('foreign_bank_transfer');
                                                            setData('payment_method', 'foreign_bank_transfer');
                                                        }}
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: '12px',
                                                            bgcolor: paymentMethod === 'foreign_bank_transfer' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                                                            border: `1px solid ${paymentMethod === 'foreign_bank_transfer' ? '#3b82f6' : 'rgba(51, 65, 85, 0.6)'}`,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1.5,
                                                        }}
                                                    >
                                                        <AccountBalanceIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff' }}>Bank Transfer / Luar Negeri</Typography>
                                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>SWIFT / Manual Transfer</Typography>
                                                        </Box>
                                                        <Radio checked={paymentMethod === 'foreign_bank_transfer'} sx={{ p: 0, color: '#3b82f6' }} />
                                                    </Paper>
                                                </Grid>
                                            </Grid>
                                        </RadioGroup>

                                        {/* QRIS Display or Bank Info */}
                                        {paymentMethod === 'qris_indo' && (
                                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(30, 41, 59, 0.6)', borderRadius: '12px', mb: 3 }}>
                                                {qrisImage ? (
                                                    <Box component="img" src={qrisImage} alt="QRIS IAGI" sx={{ maxWidth: 220, borderRadius: '8px', mx: 'auto', mb: 1.5 }} />
                                                ) : (
                                                    <Box sx={{ p: 3, border: '2px dashed #475569', borderRadius: '8px', maxWidth: 220, mx: 'auto', mb: 1.5 }}>
                                                        <QrCodeIcon sx={{ fontSize: 60, color: '#64748b' }} />
                                                        <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8' }}>QRIS PIT IAGI</Typography>
                                                    </Box>
                                                )}
                                                <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'block' }}>
                                                    Scan QRIS di atas menggunakan aplikasi m-Banking atau E-Wallet pilihan Anda.
                                                </Typography>
                                            </Box>
                                        )}

                                        {paymentMethod === 'foreign_bank_transfer' && (
                                            <Box sx={{ p: 2.5, bgcolor: 'rgba(30, 41, 59, 0.6)', borderRadius: '12px', mb: 3 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#38bdf8', mb: 1 }}>
                                                    Rekening Transfer Bank IAGI:
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#f8fafc', whiteSpace: 'pre-line', fontFamily: 'monospace', bgcolor: 'rgba(15, 23, 42, 0.8)', p: 1.5, borderRadius: '8px' }}>
                                                    {bankTransferInfo}
                                                </Typography>
                                            </Box>
                                        )}

                                        {/* Upload Proof of Payment with Direct Camera & Auto-Compress */}
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#cbd5e1', mb: 1 }}>
                                            Unggah Bukti Pembayaran *
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1.5 }}>
                                            Foto berukuran besar (10MB+) akan dikompresi otomatis di HP Anda menjadi &lt; 500KB agar cepat terunggah.
                                        </Typography>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            style={{ display: 'none' }}
                                        />
                                        <input
                                            ref={cameraInputRef}
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handleFileSelect}
                                            style={{ display: 'none' }}
                                        />

                                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<CloudUploadIcon />}
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={compressing}
                                                sx={{
                                                    borderRadius: '10px',
                                                    borderColor: '#475569',
                                                    color: '#cbd5e1',
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    '&:hover': { borderColor: '#10b981', color: '#10b981' },
                                                }}
                                            >
                                                Pilih dari Galeri
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<PhotoCameraIcon />}
                                                onClick={() => cameraInputRef.current?.click()}
                                                disabled={compressing}
                                                sx={{
                                                    borderRadius: '10px',
                                                    borderColor: '#475569',
                                                    color: '#cbd5e1',
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    '&:hover': { borderColor: '#38bdf8', color: '#38bdf8' },
                                                }}
                                            >
                                                Buka Kamera HP
                                            </Button>
                                        </Box>

                                        {compressing && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 2 }}>
                                                <CircularProgress size={20} sx={{ color: '#10b981' }} />
                                                <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                                                    Mengompresi foto otomatis di browser...
                                                </Typography>
                                            </Box>
                                        )}

                                        {proofPreview && (
                                            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(30, 41, 59, 0.8)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box component="img" src={proofPreview} alt="Bukti Transfer" sx={{ width: 70, height: 70, objectFit: 'cover', borderRadius: '8px', border: '1px solid #475569' }} />
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <CheckCircleIcon sx={{ fontSize: 16 }} /> Foto siap diunggah!
                                                    </Typography>
                                                    {compressionStats && (
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                                            Ukuran asli: {compressionStats.original} KB &rarr; <strong>Tersimpan: {compressionStats.compressed} KB</strong> (Hemat {Math.round((1 - compressionStats.compressed / compressionStats.original) * 100)}%)
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>
                        )}

                        {/* Submit Button */}
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={processing || compressing}
                                startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <ConfirmationNumberIcon />}
                                sx={{
                                    background: visitorType === 'exclusive' 
                                        ? 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' 
                                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: visitorType === 'exclusive' ? '#000' : '#fff',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    px: 5,
                                    py: 1.6,
                                    borderRadius: '14px',
                                    textTransform: 'none',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                                    },
                                    transition: 'all 0.25s ease',
                                }}
                            >
                                {processing 
                                    ? 'Memproses Pendaftaran...' 
                                    : visitorType === 'exclusive' 
                                        ? `Submit Pendaftaran Exclusive (Rp ${totalEstimate.toLocaleString('id-ID')})` 
                                        : 'Terbitkan E-Tiket Gratis Sekarang'
                                }
                            </Button>
                        </Box>
                    </form>
                )}
            </Container>
        </Box>
    );
}
