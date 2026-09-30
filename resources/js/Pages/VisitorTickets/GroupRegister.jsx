import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Tooltip,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupsIcon from '@mui/icons-material/Groups';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

export default function GroupRegister({
    categories = [],
    enabled = true,
    qrisImage = null,
    bankTransferInfo = '',
    eventDate = '3-5 November 2026',
    eventVenue = 'Royal Ambarrukmo Yogyakarta',
}) {
    const fileInputRef = useRef(null);

    // Initial default categories fallback
    const defaultCategories = [
        { id: 'iagi_member_professional', name: 'Professional (Member)', price: 3000000, tagColor: '#047857', tagBg: '#dcfce7' },
        { id: 'non_iagi_member_professional', name: 'Professional (Non-Member)', price: 4000000, tagColor: '#0284c7', tagBg: '#e0f2fe' },
        { id: 'iagi_member_expatriate', name: 'Expatriate (Member)', price: 6000000, tagColor: '#b45309', tagBg: '#fef3c7' },
        { id: 'non_iagi_member_expatriate', name: 'Expatriate (Non-Member)', price: 7000000, tagColor: '#7c3aed', tagBg: '#ede9fe' },
        { id: 'student_undergraduate', name: 'Student Undergraduate', price: 1000000, tagColor: '#4338ca', tagBg: '#e0e7ff' },
    ];

    const categoryList = categories.length > 0 ? categories : defaultCategories;
    const defaultCatId = categoryList[0]?.id || 'iagi_member_professional';

    const [uniqueCode] = useState(() => Math.floor(Math.random() * 900) + 100);
    const [picIsParticipant, setPicIsParticipant] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileStats, setFileStats] = useState(null);

    // Form state via Inertia useForm
    const { data, setData, post, processing, errors } = useForm({
        registration_mode: 'mixed',
        pic: {
            name: '',
            email: '',
            phone: '',
            institution: '',
        },
        members: [
            {
                name: '',
                email: '',
                phone: '',
                institution: '',
                visitor_type: defaultCatId,
            },
        ],
        unique_code: uniqueCode,
        proof_of_payment: null,
    });

    // Pricing map lookup helper
    const pricingMap = useMemo(() => {
        const map = {};
        categoryList.forEach((c) => {
            map[c.id] = Number(c.price || 0);
        });
        return map;
    }, [categoryList]);

    // Calculate Breakdown & Totals
    const breakdown = useMemo(() => {
        const counts = {};
        let subtotal = 0;

        data.members.forEach((m) => {
            const type = m.visitor_type || defaultCatId;
            const price = pricingMap[type] || 0;
            counts[type] = (counts[type] || 0) + 1;
            subtotal += price;
        });

        const totalAmount = subtotal + uniqueCode;

        return {
            counts,
            subtotal,
            totalAmount,
            totalMembers: data.members.length,
        };
    }, [data.members, pricingMap, uniqueCode, defaultCatId]);

    // Handle PIC field changes
    const handlePicChange = (field, value) => {
        const updatedPic = { ...data.pic, [field]: value };
        setData('pic', updatedPic);

        // If PIC is participant #1, keep it synced
        if (picIsParticipant && data.members.length > 0) {
            const updatedMembers = [...data.members];
            if (field === 'name') updatedMembers[0].name = value;
            if (field === 'email') updatedMembers[0].email = value;
            if (field === 'phone') updatedMembers[0].phone = value;
            if (field === 'institution') updatedMembers[0].institution = value;
            setData((prev) => ({
                ...prev,
                pic: updatedPic,
                members: updatedMembers,
            }));
        }
    };

    // Toggle PIC as participant #1
    const handleTogglePicAsParticipant = (checked) => {
        setPicIsParticipant(checked);
        if (checked) {
            const updatedMembers = [...data.members];
            updatedMembers[0] = {
                ...updatedMembers[0],
                name: data.pic.name || updatedMembers[0].name,
                email: data.pic.email || updatedMembers[0].email,
                phone: data.pic.phone || updatedMembers[0].phone,
                institution: data.pic.institution || updatedMembers[0].institution,
            };
            setData('members', updatedMembers);
        }
    };

    // Handle Member field changes
    const handleMemberChange = (index, field, value) => {
        const updated = [...data.members];
        updated[index][field] = value;
        setData('members', updated);
    };

    // Add Participant
    const addMember = () => {
        if (data.members.length >= 50) return;
        const newMember = {
            name: '',
            email: '',
            phone: '',
            institution: data.pic.institution || '',
            visitor_type: defaultCatId,
        };
        setData('members', [...data.members, newMember]);
    };

    // Remove Participant
    const removeMember = (index) => {
        if (data.members.length <= 1) return;
        const updated = data.members.filter((_, i) => i !== index);
        setData('members', updated);
        if (index === 0 && picIsParticipant) {
            setPicIsParticipant(false);
        }
    };

    // Client-side image compression
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
                            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', {
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
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const compressed = await compressImage(file);
            setData('proof_of_payment', compressed.file);
            setPreviewUrl(compressed.previewUrl);
            setFileStats({
                original: compressed.originalSizeKb,
                compressed: compressed.compressedSizeKb,
            });
        } catch (err) {
            setData('proof_of_payment', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleClearFile = () => {
        setData('proof_of_payment', null);
        setPreviewUrl(null);
        setFileStats(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleCopyBankInfo = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(bankTransferInfo);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2500);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('visitor.tickets.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', color: '#0f172a', py: { xs: 3, md: 6 } }}>
            <Head title="Corporate & Mixed-Category Group Registration - 55th PIT IAGI & GEOSEA XIX 2026" />

            <Container maxWidth="lg">
                {/* TOP MODE TOGGLE SWITCHER */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 0.6,
                            borderRadius: '30px',
                            bgcolor: '#e2e8f0',
                            display: 'inline-flex',
                            alignItems: 'center',
                            border: '1px solid #cbd5e1',
                        }}
                    >
                        <Link href="/tickets" style={{ textDecoration: 'none' }}>
                            <Button
                                size="small"
                                sx={{
                                    borderRadius: '24px',
                                    px: 2.5,
                                    py: 0.8,
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    textTransform: 'none',
                                    color: '#475569',
                                    bgcolor: 'transparent',
                                    '&:hover': { bgcolor: '#cbd5e1' },
                                }}
                            >
                                👤 Individual / Single Category
                            </Button>
                        </Link>
                        <Button
                            size="small"
                            sx={{
                                borderRadius: '24px',
                                px: 2.8,
                                py: 0.8,
                                fontWeight: 800,
                                fontSize: '0.84rem',
                                textTransform: 'none',
                                color: '#ffffff',
                                bgcolor: '#094d42',
                                boxShadow: '0 2px 8px rgba(9, 77, 66, 0.25)',
                                '&:hover': { bgcolor: '#06362e' },
                            }}
                        >
                            🏢 Company / Group (Mixed Categories)
                        </Button>
                    </Paper>
                </Box>

                {/* HEADER / HERO BANNER */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 4.5 },
                        mb: 4,
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #094d42 0%, #06362e 100%)',
                        color: '#ffffff',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(9, 77, 66, 0.15)',
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                            <Chip
                                label="CORPORATE & GROUP ACCESS"
                                size="small"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.18)',
                                    color: '#fef3c7',
                                    fontWeight: 800,
                                    fontSize: '0.70rem',
                                    letterSpacing: '0.08em',
                                    backdropFilter: 'blur(4px)',
                                }}
                            />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                                55th PIT IAGI & GEOSEA XIX 2026
                            </Typography>
                        </Stack>

                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.4rem' } }}>
                            Mixed-Category Group Registration
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#e2e8f0', maxWidth: 760, fontSize: { xs: '0.9rem', md: '1rem' }, lineHeight: 1.6 }}>
                            Register your company delegation or organization in a single transaction. Each participant can have their own ticket category (Professional Member/Non-Member, Expatriate, or Student) with 1 unified invoice and 1 payment proof.
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2.5, pt: 2, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                            <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                📅 <strong>Event:</strong> {eventDate}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                📍 <strong>Venue:</strong> {eventVenue}
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Link href="/tickets" style={{ textDecoration: 'none', color: '#86efac', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <SearchIcon sx={{ fontSize: 16 }} /> Lookup Existing Registration
                            </Link>
                        </Stack>
                    </Box>
                </Paper>

                {/* FORM CONTAINER */}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        {/* LEFT COLUMN: PIC DETAILS & PARTICIPANT LIST */}
                        <Grid item xs={12} md={7.5}>
                            {/* STEP 1: PIC / CORPORATE DETAILS */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 2.5, sm: 3.5 },
                                    mb: 3.5,
                                    borderRadius: '16px',
                                    border: '1px solid #e2e8f0',
                                    bgcolor: '#ffffff',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                                    <Box
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: '10px',
                                            bgcolor: '#e0f2fe',
                                            color: '#0284c7',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 900,
                                            fontSize: '0.95rem',
                                        }}
                                    >
                                        1
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>
                                            PIC / Company Information (Penanggung Jawab)
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                            The person or corporate representative in charge of registration and receiving the official invoice.
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Company / Institution Name *"
                                            placeholder="e.g. PT Pertamina Hulu Energi"
                                            fullWidth
                                            size="small"
                                            value={data.pic.institution}
                                            onChange={(e) => handlePicChange('institution', e.target.value)}
                                            error={Boolean(errors['pic.institution'])}
                                            helperText={errors['pic.institution']}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="PIC Full Name *"
                                            placeholder="e.g. Budi Santoso"
                                            fullWidth
                                            size="small"
                                            value={data.pic.name}
                                            onChange={(e) => handlePicChange('name', e.target.value)}
                                            error={Boolean(errors['pic.name'])}
                                            helperText={errors['pic.name']}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="PIC Email (For Invoice & Updates) *"
                                            placeholder="e.g. budi@company.com"
                                            type="email"
                                            fullWidth
                                            size="small"
                                            value={data.pic.email}
                                            onChange={(e) => handlePicChange('email', e.target.value)}
                                            error={Boolean(errors['pic.email'])}
                                            helperText={errors['pic.email']}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="PIC WhatsApp / Phone"
                                            placeholder="e.g. 08123456789"
                                            fullWidth
                                            size="small"
                                            value={data.pic.phone}
                                            onChange={(e) => handlePicChange('phone', e.target.value)}
                                            error={Boolean(errors['pic.phone'])}
                                            helperText={errors['pic.phone']}
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px dashed #e2e8f0' }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={picIsParticipant}
                                                onChange={(e) => handleTogglePicAsParticipant(e.target.checked)}
                                                sx={{ color: '#094d42', '&.Mui-checked': { color: '#094d42' } }}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                                                The PIC is also one of the participants (Include in delegate list as Participant #1)
                                            </Typography>
                                        }
                                    />
                                </Box>
                            </Paper>

                            {/* STEP 2: PARTICIPANTS LIST */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 2.5, sm: 3.5 },
                                    mb: 3.5,
                                    borderRadius: '16px',
                                    border: '1px solid #e2e8f0',
                                    bgcolor: '#ffffff',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
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
                                                fontWeight: 900,
                                                fontSize: '0.95rem',
                                            }}
                                        >
                                            2
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>
                                                Delegates & Participants ({data.members.length})
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                Add team members and assign their specific ticket categories.
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<PersonAddIcon />}
                                        onClick={addMember}
                                        disabled={data.members.length >= 50}
                                        sx={{
                                            borderColor: '#094d42',
                                            color: '#094d42',
                                            fontWeight: 800,
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            '&:hover': { bgcolor: '#f0fdf4', borderColor: '#06362e' },
                                        }}
                                    >
                                        Add Participant
                                    </Button>
                                </Box>

                                {errors.members && (
                                    <Alert severity="error" sx={{ mb: 2.5 }}>
                                        {errors.members}
                                    </Alert>
                                )}

                                <Stack spacing={2.5}>
                                    {data.members.map((member, idx) => {
                                        const selectedPrice = pricingMap[member.visitor_type] || 0;
                                        const memberNameError = errors[`members.${idx}.name`];
                                        const memberEmailError = errors[`members.${idx}.email`];
                                        const memberCatError = errors[`members.${idx}.visitor_type`];

                                        return (
                                            <Paper
                                                key={idx}
                                                elevation={0}
                                                sx={{
                                                    p: 2.2,
                                                    borderRadius: '12px',
                                                    border: '1.5px solid #e2e8f0',
                                                    bgcolor: '#f8fafc',
                                                    transition: 'all 0.2s',
                                                    '&:hover': { borderColor: '#cbd5e1', bgcolor: '#ffffff' },
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Chip
                                                            label={`Participant #${idx + 1}`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: '#094d42',
                                                                color: '#fff',
                                                                fontWeight: 800,
                                                                fontSize: '0.70rem',
                                                                height: 22,
                                                            }}
                                                        />
                                                        {idx === 0 && picIsParticipant && (
                                                            <Chip
                                                                label="PIC / Leader"
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: '#fef3c7',
                                                                    color: '#92400e',
                                                                    border: '1px solid #fde68a',
                                                                    fontWeight: 800,
                                                                    fontSize: '0.65rem',
                                                                    height: 22,
                                                                }}
                                                            />
                                                        )}
                                                    </Stack>

                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#094d42', fontSize: '0.85rem' }}>
                                                            IDR {selectedPrice.toLocaleString('id-ID')}
                                                        </Typography>
                                                        {data.members.length > 1 && (
                                                            <Tooltip title="Remove Participant">
                                                                <IconButton size="small" onClick={() => removeMember(idx)} sx={{ color: '#ef4444' }}>
                                                                    <DeleteOutlineIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Stack>
                                                </Box>

                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Full Name *"
                                                            placeholder="Participant full name"
                                                            fullWidth
                                                            size="small"
                                                            value={member.name}
                                                            onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                                            error={Boolean(memberNameError)}
                                                            helperText={memberNameError}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Email Address *"
                                                            placeholder="participant@email.com"
                                                            type="email"
                                                            fullWidth
                                                            size="small"
                                                            value={member.email}
                                                            onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                                                            error={Boolean(memberEmailError)}
                                                            helperText={memberEmailError}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="WhatsApp / Phone"
                                                            placeholder="08123456789"
                                                            fullWidth
                                                            size="small"
                                                            value={member.phone}
                                                            onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Institution / Department"
                                                            placeholder="Company or branch"
                                                            fullWidth
                                                            size="small"
                                                            value={member.institution}
                                                            onChange={(e) => handleMemberChange(idx, 'institution', e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <FormControl fullWidth size="small" error={Boolean(memberCatError)}>
                                                            <InputLabel id={`cat-label-${idx}`}>Ticket Category *</InputLabel>
                                                            <Select
                                                                labelId={`cat-label-${idx}`}
                                                                label="Ticket Category *"
                                                                value={member.visitor_type}
                                                                onChange={(e) => handleMemberChange(idx, 'visitor_type', e.target.value)}
                                                            >
                                                                {categoryList.map((cat) => (
                                                                    <MenuItem key={cat.id} value={cat.id}>
                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                                {cat.name}
                                                                            </Typography>
                                                                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', bgcolor: '#f0fdf4', px: 1, py: 0.2, borderRadius: '4px' }}>
                                                                                IDR {Number(cat.price || 0).toLocaleString('id-ID')}
                                                                            </Typography>
                                                                        </Box>
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        );
                                    })}
                                </Stack>

                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<PersonAddIcon />}
                                        onClick={addMember}
                                        disabled={data.members.length >= 50}
                                        sx={{
                                            borderColor: '#cbd5e1',
                                            color: '#334155',
                                            fontWeight: 700,
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            px: 3,
                                            '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' },
                                        }}
                                    >
                                        Add Another Delegate ({data.members.length}/50)
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* RIGHT COLUMN: ORDER SUMMARY & PAYMENT */}
                        <Grid item xs={12} md={4.5}>
                            <Box sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
                                {/* ORDER SUMMARY CARD */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        mb: 3,
                                        borderRadius: '16px',
                                        border: '1px solid #e2e8f0',
                                        bgcolor: '#ffffff',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <ReceiptLongIcon sx={{ color: '#094d42' }} /> Order Summary
                                    </Typography>

                                    {/* Breakdown List */}
                                    <Stack spacing={1.2} sx={{ mb: 2 }}>
                                        {categoryList.map((cat) => {
                                            const count = breakdown.counts[cat.id] || 0;
                                            if (count === 0) return null;
                                            const lineTotal = count * Number(cat.price || 0);
                                            return (
                                                <Box key={cat.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', lineHeight: 1.2 }}>
                                                            {cat.name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                            {count} &times; IDR {Number(cat.price).toLocaleString('id-ID')}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                                        IDR {lineTotal.toLocaleString('id-ID')}
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                    </Stack>

                                    <Divider sx={{ my: 1.8 }} />

                                    {/* Subtotal & Unique Code */}
                                    <Stack spacing={0.8} sx={{ mb: 2, fontSize: '0.82rem' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                                            <span>Subtotal ({breakdown.totalMembers} delegates)</span>
                                            <span style={{ fontWeight: 700, color: '#0f172a' }}>IDR {breakdown.subtotal.toLocaleString('id-ID')}</span>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                                            <span>Unique Verification Code</span>
                                            <span style={{ fontWeight: 700, color: '#094d42' }}>+ IDR {uniqueCode}</span>
                                        </Box>
                                    </Stack>

                                    {/* GRAND TOTAL */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: '12px',
                                            bgcolor: '#ecfdf5',
                                            border: '1.5px solid #a7f3d0',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 0.5,
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Total Payment Due
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#094d42', fontSize: '1.45rem' }}>
                                            IDR {breakdown.totalAmount.toLocaleString('id-ID')}
                                        </Typography>
                                    </Box>
                                </Paper>

                                {/* PAYMENT INSTRUCTIONS & PROOF UPLOAD */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '16px',
                                        border: '1px solid #e2e8f0',
                                        bgcolor: '#ffffff',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1, mb: 1.8 }}>
                                        <AccountBalanceIcon sx={{ color: '#094d42' }} /> Bank Transfer Information
                                    </Typography>

                                    <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#f8fafc', border: '1px solid #e2e8f0', mb: 2.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                                            Official Committee Account:
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                            {bankTransferInfo || "Bank : Mandiri\nAccount No. : 1030099991461\nAccount Holder : IAGI"}
                                        </Typography>
                                        <Button
                                            size="small"
                                            startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
                                            onClick={handleCopyBankInfo}
                                            sx={{
                                                mt: 1.2,
                                                textTransform: 'none',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                color: copySuccess ? '#15803d' : '#0284c7',
                                            }}
                                        >
                                            {copySuccess ? 'Copied to Clipboard!' : 'Copy Bank Information'}
                                        </Button>
                                    </Box>

                                    {/* PROOF OF PAYMENT UPLOAD */}
                                    <Box sx={{ mb: 2.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', display: 'block', mb: 0.8 }}>
                                            Upload Proof of Payment (Bukti Transfer) *
                                        </Typography>

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />

                                        {!previewUrl ? (
                                            <Box
                                                onClick={() => fileInputRef.current?.click()}
                                                sx={{
                                                    p: 3,
                                                    border: '2px dashed #cbd5e1',
                                                    borderRadius: '12px',
                                                    bgcolor: '#f8fafc',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    '&:hover': { borderColor: '#094d42', bgcolor: '#f0fdf4' },
                                                }}
                                            >
                                                <CloudUploadIcon sx={{ fontSize: 36, color: '#64748b', mb: 1 }} />
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>
                                                    Click to Select Transfer Receipt
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5 }}>
                                                    JPG, PNG, WEBP (Max 5MB) &bull; Auto-optimized
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Box sx={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                                <img
                                                    src={previewUrl}
                                                    alt="Payment Receipt Preview"
                                                    style={{ width: '100%', maxHeight: 220, objectFit: 'contain', backgroundColor: '#000' }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={handleClearFile}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        bgcolor: 'rgba(0,0,0,0.6)',
                                                        color: '#fff',
                                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' },
                                                    }}
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                                {fileStats && (
                                                    <Box sx={{ p: 1, bgcolor: '#f1f5f9', fontSize: '0.72rem', color: '#475569', textAlign: 'center' }}>
                                                        Size optimized: {fileStats.original} KB &rarr; <strong>{fileStats.compressed} KB</strong>
                                                    </Box>
                                                )}
                                            </Box>
                                        )}

                                        {errors.proof_of_payment && (
                                            <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, display: 'block', mt: 0.6 }}>
                                                {errors.proof_of_payment}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* SUBMIT BUTTON */}
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={processing}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: '10px',
                                            bgcolor: '#094d42',
                                            color: '#ffffff',
                                            fontWeight: 900,
                                            fontSize: '0.95rem',
                                            textTransform: 'none',
                                            boxShadow: '0 4px 14px rgba(9, 77, 66, 0.3)',
                                            '&:hover': { bgcolor: '#06362e' },
                                        }}
                                    >
                                        {processing ? (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <CircularProgress size={20} color="inherit" />
                                                <span>Submitting Registration...</span>
                                            </Stack>
                                        ) : (
                                            `Submit Group Registration (IDR ${breakdown.totalAmount.toLocaleString('id-ID')})`
                                        )}
                                    </Button>

                                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', textAlign: 'center', mt: 1.5, fontSize: '0.72rem' }}>
                                        🔒 Official invoice and individual E-Tickets will be emailed after treasury verification.
                                    </Typography>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </Box>
    );
}
