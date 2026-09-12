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
    InputAdornment,
    Tooltip,
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
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import GroupsIcon from '@mui/icons-material/Groups';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ConstructionIcon from '@mui/icons-material/Construction';
import SearchIcon from '@mui/icons-material/Search';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import axios from 'axios';

export default function Register({
    categories: propCategories = [],
    priceExclusive: propPriceExclusive,
    priceNonExclusive: propPriceNonExclusive,
    enabled: propEnabled,
    qrisImage: propQrisImage,
    bankTransferInfo: propBankTransferInfo,
    eventDate: propEventDate,
    eventVenue: propEventVenue,
    settings = {},
}) {
    const defaultCategories = [
        {
            id: 'iagi_member_professional',
            group: 'conference',
            name: 'Professional (Member)',
            badge: 'PROFESSIONAL (MEMBER)',
            normalPrice: 3000000,
            price: 3000000,
            tag: 'PROFESSIONAL (MEMBER)',
            discountAmount: 0,
            tagColor: '#047857',
            tagBg: '#dcfce7',
            borderSelected: '#10b981',
            darkBorder: '#047857',
            bgSelected: '#f0fdf4',
            lanyardTheme: { border: '#059669', banner: '#094d42', badge: 'PROFESSIONAL', darkBorder: '#022c22' },
            description: 'For Professional IAGI Member',
            perks: [
                'Full Access for Exhibition Hall/Panel Discussion/Technical Session',
                'Seminar Kit',
                'Lunch and Snack',
            ],
        },
        {
            id: 'non_iagi_member_professional',
            group: 'conference',
            name: 'Professional (Non-Member)',
            badge: 'PROFESSIONAL (NON-MEMBER)',
            normalPrice: 4000000,
            price: 4000000,
            tag: 'PROFESSIONAL (NON-MEMBER)',
            discountAmount: 0,
            tagColor: '#0284c7',
            tagBg: '#e0f2fe',
            borderSelected: '#0284c7',
            darkBorder: '#0369a1',
            bgSelected: '#f0f9ff',
            lanyardTheme: { border: '#0284c7', banner: '#0369a1', badge: 'PROFESSIONAL', darkBorder: '#0c4a6e' },
            description: 'For Professional Non - IAGI Member',
            perks: [
                'Full Access for Exhibition Hall/Panel Discussion/Technical Session',
                'Seminar Kit',
                'Lunch and Snack',
            ],
        },
        {
            id: 'iagi_member_expatriate',
            group: 'conference',
            name: 'Expatriate (Member)',
            badge: 'EXPATRIATE (MEMBER)',
            normalPrice: 6000000,
            price: 6000000,
            tag: 'EXPATRIATE (MEMBER)',
            discountAmount: 0,
            tagColor: '#b45309',
            tagBg: '#fef3c7',
            borderSelected: '#f59e0b',
            darkBorder: '#b45309',
            bgSelected: '#fffbeb',
            lanyardTheme: { border: '#f59e0b', banner: '#b45309', badge: 'EXPATRIATE', darkBorder: '#78350f' },
            description: 'For Expatriate IAGI Member',
            perks: [
                'Full Access for Exhibition Hall/Panel Discussion/Technical Session',
                'Seminar Kit',
                'Lunch and Snack',
            ],
        },
        {
            id: 'non_iagi_member_expatriate',
            group: 'conference',
            name: 'Expatriate (Non-Member)',
            badge: 'EXPATRIATE (NON-MEMBER)',
            normalPrice: 7000000,
            price: 7000000,
            tag: 'EXPATRIATE (NON-MEMBER)',
            discountAmount: 0,
            tagColor: '#7c3aed',
            tagBg: '#ede9fe',
            borderSelected: '#8b5cf6',
            darkBorder: '#6d28d9',
            bgSelected: '#f5f3ff',
            lanyardTheme: { border: '#8b5cf6', banner: '#6d28d9', badge: 'EXPATRIATE', darkBorder: '#4c1d95' },
            description: 'For Expatriate Non - IAGI Member',
            perks: [
                'Full Access for Exhibition Hall/Panel Discussion/Technical Session',
                'Seminar Kit',
                'Lunch and Snack',
            ],
        },
        {
            id: 'student_undergraduate',
            group: 'conference',
            name: 'Student Undergraduate',
            badge: 'STUDENT UNDERGRADUATE',
            normalPrice: 1000000,
            price: 1000000,
            tag: 'STUDENT UNDERGRADUATE',
            discountAmount: 0,
            tagColor: '#4338ca',
            tagBg: '#e0e7ff',
            borderSelected: '#6366f1',
            darkBorder: '#4338ca',
            bgSelected: '#eef2ff',
            lanyardTheme: { border: '#6366f1', banner: '#4338ca', badge: 'STUDENT', darkBorder: '#312e81' },
            description: 'For Undergraduate Student',
            perks: [
                'Full Access for Exhibition Hall/Panel Discussion/Technical Session',
                'Seminar Kit',
                'Lunch and Snack',
            ],
        },
        {
            id: 'non_exclusive',
            group: 'visitor',
            name: 'Visitor Pass (Free)',
            badge: 'VISITOR PASS (FREE)',
            normalPrice: 0,
            price: 0,
            tag: 'VISITOR PASS (FREE)',
            discountAmount: 0,
            tagColor: '#059669',
            tagBg: '#d1fae5',
            borderSelected: '#10b981',
            darkBorder: '#047857',
            bgSelected: '#f0fdf4',
            lanyardTheme: { border: '#10b981', banner: '#094d42', badge: 'VISITOR PASS', darkBorder: '#022c22' },
            description: 'For anyone who visiting on site',
            perks: ['Free Registration', 'Access Exhibition Hall only'],
        },
    ];

    const regularPrices = {
        iagi_member_professional: 3000000,
        non_iagi_member_professional: 4000000,
        iagi_member_expatriate: 6000000,
        non_iagi_member_expatriate: 7000000,
        student_undergraduate: 1000000,
        non_exclusive: 0,
    };

    const categoriesList = defaultCategories.map(d => {
        const propCat = propCategories?.find(c => c.id === d.id);
        const regularPrice = regularPrices[d.id] ?? d.price;
        return {
            ...d,
            ...(propCat || {}),
            price: regularPrice,
            normalPrice: regularPrice,
            discountAmount: 0,
        };
    });

    const enabled = propEnabled ?? settings.enabled ?? true;
    const rawBankTransferInfo = propBankTransferInfo ?? settings.bankTransferInfo ?? settings.bankInfo ?? "Bank Mandiri\nAccount Number: 137-00-1234567-8\nAccount Holder: Ikatan Ahli Geologi Indonesia (IAGI)";
    const bankTransferInfo = typeof rawBankTransferInfo === 'string'
        ? rawBankTransferInfo
            .replace(/No\.\s*Rek\s*:/gi, 'Account Number:')
            .replace(/a\.\s*n\.\s*:?/gi, 'Account Holder: ')
            .replace(/atas\s*nama\s*:?/gi, 'Account Holder: ')
        : rawBankTransferInfo;
    const eventDate = propEventDate ?? settings.eventDate ?? '3-5 November 2026';
    const eventVenue = propEventVenue ?? settings.eventVenue ?? 'Royal Ambarrukmo Yogyakarta';
    
    const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'conference', 'visitor'
    const [visitorType, setVisitorType] = useState('iagi_member_professional');
    const [paymentMethod, setPaymentMethod] = useState('foreign_bank_transfer');
    const [members, setMembers] = useState([
        { name: '', email: '', phone: '', institution: '' }
    ]);
    const [uniqueCode] = useState(() => Math.floor(100 + Math.random() * 900));
    const [proofFile, setProofFile] = useState(null);
    const [proofPreview, setProofPreview] = useState(null);
    const [compressing, setCompressing] = useState(false);
    const [compressionStats, setCompressionStats] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Check Status & Find Ticket Modal State
    const [checkStatusOpen, setCheckStatusOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [searchError, setSearchError] = useState(null);
    const [searchHasSubmitted, setSearchHasSubmitted] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);

    const handleCopyCode = (code) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        }
    };

    const handlePerformSearch = async (e) => {
        if (e) e.preventDefault();
        const trimmed = searchQuery.trim();
        if (!trimmed || trimmed.length < 3) {
            setSearchError('Please enter at least 3 characters (e.g. your Email, Phone Number, or Payment Code).');
            return;
        }

        setIsSearching(true);
        setSearchError(null);
        setSearchResults(null);
        setSearchHasSubmitted(true);

        try {
            const response = await axios.post(route('visitor.tickets.lookup'), {
                query: trimmed,
            });

            if (response.data && response.data.success) {
                setSearchResults(response.data.data || []);
            } else {
                setSearchError(response.data?.message || 'No registration records found.');
                setSearchResults([]);
            }
        } catch (err) {
            console.error('Ticket lookup failed:', err);
            setSearchError(err.response?.data?.message || 'Failed to search records. Please check your internet connection or try again.');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleResetSearch = () => {
        setSearchQuery('');
        setSearchResults(null);
        setSearchError(null);
        setSearchHasSubmitted(false);
    };

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
        visitor_type: 'iagi_member_professional',
        members: members,
        payment_method: 'foreign_bank_transfer',
        unique_code: uniqueCode,
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
            alert('Failed to process image. Please try another file.');
        } finally {
            setCompressing(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        processFileAndSet(file);
    };

    // DIRECT CAMERA STREAM (WebRTC Live Viewfinder)
    useEffect(() => {
        let stream = null;
        let isCancelled = false;

        if (cameraModalOpen) {
            setCameraLoading(true);
            setCameraError(null);

            const initCamera = async () => {
                try {
                    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                        throw new Error('WebRTC camera is not supported in this browser.');
                    }

                    let constraints = {
                        video: {
                            facingMode: cameraFacingMode === 'environment' ? { ideal: 'environment' } : 'user',
                            width: { ideal: 1280 },
                            height: { ideal: 720 },
                        },
                        audio: false,
                    };

                    let mediaStream;
                    try {
                        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                    } catch (fallbackErr) {
                        console.warn('Ideal constraints failed, trying default video:', fallbackErr);
                        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                    }

                    if (isCancelled) {
                        mediaStream.getTracks().forEach(track => track.stop());
                        return;
                    }

                    stream = mediaStream;
                    streamRef.current = mediaStream;

                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                        videoRef.current.onloadedmetadata = () => {
                            videoRef.current?.play().catch(e => console.log('Video play interrupted:', e));
                            setCameraLoading(false);
                        };
                    }
                } catch (err) {
                    console.error('Camera stream error:', err);
                    setCameraLoading(false);
                    setCameraError('Unable to access camera. Please ensure camera permissions are granted or use your device camera.');
                }
            };

            initCamera();
        } else {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        }

        return () => {
            isCancelled = true;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraModalOpen, cameraFacingMode]);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraModalOpen(false);
    };

    const handleOpenDirectCamera = () => {
        setCameraModalOpen(true);
    };

    const handleSwitchCamera = () => {
        setCameraFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
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
                alert('Failed to capture photo from camera.');
                return;
            }

            const capturedFile = new File([blob], `payment_proof_${Date.now()}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now(),
            });

            stopCamera();
            processFileAndSet(capturedFile);
        }, 'image/jpeg', 0.85);
    };

    const selectedCategory = categoriesList.find(c => c.id === visitorType) || categoriesList[0];
    const isPaid = (selectedCategory?.price ?? 0) > 0;
    const subtotal = (selectedCategory?.price ?? 0) * members.length;
    const totalEstimate = isPaid ? subtotal + uniqueCode : 0;
    const primaryMember = members[0] || { name: '', institution: '' };

    const filteredCategories = selectedTab === 'all'
        ? categoriesList
        : categoriesList.filter(c => c.group === selectedTab);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        for (let i = 0; i < members.length; i++) {
            if (!members[i].name || !members[i].email) {
                alert(`Please complete Full Name and Email for Participant #${i + 1}`);
                return;
            }
        }

        if (isPaid && !proofFile) {
            alert(`Please upload payment proof for ${selectedCategory.name} registration.`);
            return;
        }

        post(route('visitor.tickets.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f8fafc',
                color: '#0f172a',
                py: { xs: 2.5, md: 4 },
                backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
            }}
        >
            <Head title="Registration & Ticket Portal - 55ᵀᴴ PIT IAGI-GEOSEA XIX 2026" />

            <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {/* 3D Top Nav Bar */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        p: 1.4,
                        px: { xs: 2, sm: 2.8 },
                        borderRadius: '20px',
                        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                        border: '1.5px solid #e2e8f0',
                        borderBottom: '4.5px solid #cbd5e1',
                        boxShadow: '0 10px 24px -4px rgba(0,0,0,0.05), inset 0 1px 0 #ffffff',
                        mb: 3.5,
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
                            fontWeight: 800,
                            fontSize: '0.84rem',
                            borderRadius: '12px',
                            px: 2,
                            py: 0.7,
                            background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
                            border: '1.5px solid #cbd5e1',
                            borderBottom: '3.5px solid #94a3b8',
                            boxShadow: '0 3px 6px rgba(0,0,0,0.05)',
                            transition: 'all 0.15s ease',
                            '&:hover': {
                                color: '#094d42',
                                background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
                            },
                            '&:active': {
                                transform: 'translateY(1px)',
                                borderBottom: '1.5px solid #94a3b8',
                            },
                        }}
                    >
                        Back to Home
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, flexWrap: 'wrap' }}>
                        <Button
                            onClick={() => {
                                setCheckStatusOpen(true);
                                setSearchError(null);
                            }}
                            startIcon={<SearchIcon sx={{ color: '#065f46' }} />}
                            size="small"
                            sx={{
                                background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)',
                                color: '#065f46',
                                border: '1.5px solid #6ee7b7',
                                borderBottom: '3.5px solid #059669',
                                textTransform: 'none',
                                fontWeight: 900,
                                fontSize: '0.84rem',
                                borderRadius: '12px',
                                px: 2.2,
                                py: 0.7,
                                boxShadow: '0 4px 10px rgba(4,120,87,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    background: 'linear-gradient(180deg, #d1fae5 0%, #a7f3d0 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 7px 16px rgba(4,120,87,0.3)',
                                },
                                '&:active': {
                                    transform: 'translateY(1px)',
                                    borderBottom: '1.5px solid #059669',
                                },
                            }}
                        >
                            Check Status / Find Ticket
                        </Button>

                        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                Official Registration Portal &bull; 55ᵀᴴ PIT IAGI-GEOSEA XIX 2026
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Hero Header Section */}
                <Box sx={{ textAlign: 'center', mb: 3.5 }}>
                    <Chip
                        icon={<ConfirmationNumberIcon sx={{ fontSize: '15px !important', color: '#047857 !important' }} />}
                        label="CONFERENCE & VISITOR &bull; REGISTRATION OPEN"
                        size="small"
                        sx={{
                            background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)',
                            color: '#047857',
                            border: '1.5px solid #a7f3d0',
                            borderBottom: '3px solid #059669',
                            fontWeight: 900,
                            fontSize: '0.72rem',
                            letterSpacing: '0.06em',
                            px: 1.2,
                            py: 0.5,
                            mb: 1.8,
                            borderRadius: '20px',
                            boxShadow: '0 3px 8px rgba(4,120,87,0.15)',
                        }}
                    />

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                            letterSpacing: '-0.03em',
                            color: '#0f172a',
                            lineHeight: 1.2,
                            mb: 0.8,
                            textShadow: '0 1px 2px rgba(0,0,0,0.06)',
                        }}
                    >
                        Conference & Visitor Registration
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: '#64748b',
                            maxWidth: 680,
                            mx: 'auto',
                            fontSize: { xs: '0.88rem', md: '0.95rem' },
                            lineHeight: 1.6,
                            mb: 2.2,
                        }}
                    >
                        Select your registration category below to receive your official conference badge, digital QR ticket pass, and seminar credentials for 55ᵀᴴ PIT IAGI-GEOSEA XIX 2026.
                    </Typography>

                    {/* 3D Venue & Date Pills */}
                    <Box
                        sx={{
                            display: 'inline-flex',
                            gap: { xs: 1.5, sm: 2.5 },
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                            border: '1.5px solid #cbd5e1',
                            borderBottom: '4px solid #94a3b8',
                            borderRadius: '16px',
                            px: 3,
                            py: 1,
                            boxShadow: '0 6px 18px rgba(0,0,0,0.05), inset 0 1px 0 #ffffff',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <EventIcon sx={{ fontSize: 19, color: '#0284c7' }} />
                            <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 900, fontSize: '0.82rem' }}>
                                {eventDate}
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ height: 16, my: 'auto', borderColor: '#cbd5e1' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <LocationOnIcon sx={{ fontSize: 19, color: '#e11d48' }} />
                            <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 900, fontSize: '0.82rem' }}>
                                {eventVenue}
                            </Typography>
                        </Box>
                    </Box>

                    {/* 3D High-Prominence Quick Status & Ticket Lookup Banner (Gambar 3) */}
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <Paper
                            elevation={0}
                            onClick={() => {
                                setCheckStatusOpen(true);
                                setSearchError(null);
                            }}
                            sx={{
                                maxWidth: 760,
                                width: '100%',
                                p: { xs: 1.8, sm: 2 },
                                px: { xs: 2, sm: 2.8 },
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #064e3b 0%, #047857 55%, #059669 100%)',
                                color: '#ffffff',
                                border: '2px solid #34d399',
                                borderBottom: '5px solid #022c22',
                                boxShadow: '0 12px 28px -6px rgba(4, 120, 87, 0.45), 0 4px 10px rgba(0,0,0,0.12), inset 0 2px 0 rgba(255, 255, 255, 0.35)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                gap: 2,
                                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-4px) scale(1.015)',
                                    borderColor: '#6ee7b7',
                                    borderBottom: '5px solid #022c22',
                                    boxShadow: '0 20px 38px -8px rgba(4, 120, 87, 0.6), 0 8px 16px rgba(0,0,0,0.18), inset 0 2px 0 rgba(255, 255, 255, 0.5)',
                                    '& .cta-btn': {
                                        transform: 'scale(1.04)',
                                        boxShadow: '0 6px 18px rgba(245, 158, 11, 0.65)',
                                    },
                                    '& .search-icon-box': {
                                        transform: 'rotate(-8deg) scale(1.1)',
                                    },
                                },
                                '&:active': {
                                    transform: 'translateY(2px)',
                                    borderBottom: '2px solid #022c22',
                                    boxShadow: '0 4px 12px rgba(4, 120, 87, 0.3)',
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '50%',
                                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)',
                                    pointerEvents: 'none',
                                }
                            }}
                        >
                            {/* Left Icon & Text */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                                <Box
                                    className="search-icon-box"
                                    sx={{
                                        width: { xs: 44, sm: 52 },
                                        height: { xs: 44, sm: 52 },
                                        borderRadius: '14px',
                                        bgcolor: 'rgba(255, 255, 255, 0.18)',
                                        border: '1.5px solid rgba(255, 255, 255, 0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fef08a',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.5)',
                                        flexShrink: 0,
                                        transition: 'transform 0.3s ease',
                                    }}
                                >
                                    <ManageSearchIcon sx={{ fontSize: { xs: 26, sm: 32 } }} />
                                </Box>
                                <Box sx={{ textAlign: 'left' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.3 }}>
                                        <Chip
                                            label="⚡ ALREADY REGISTERED?"
                                            size="small"
                                            sx={{
                                                bgcolor: '#fef08a',
                                                color: '#713f12',
                                                fontWeight: 900,
                                                fontSize: '0.68rem',
                                                letterSpacing: '0.04em',
                                                height: 20,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
                                            }}
                                        />
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', display: { xs: 'none', sm: 'inline' } }}>
                                            FIND PASS & E-TICKET
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 900,
                                            color: '#ffffff',
                                            fontSize: { xs: '0.92rem', sm: '1.08rem' },
                                            lineHeight: 1.25,
                                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                        }}
                                    >
                                        Check Registration Status & Find My E-Ticket
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'rgba(255,255,255,0.88)',
                                            fontSize: { xs: '0.72rem', sm: '0.78rem' },
                                            display: 'block',
                                            mt: 0.2,
                                        }}
                                    >
                                        Check registration status, payment verification & retrieve QR ticket pass
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Right 3D Action CTA Button */}
                            <Box sx={{ width: { xs: '100%', sm: 'auto' }, flexShrink: 0, textAlign: { xs: 'right', sm: 'inherit' } }}>
                                <Button
                                    className="cta-btn"
                                    variant="contained"
                                    endIcon={<ArrowForwardIcon sx={{ fontSize: '18px !important' }} />}
                                    sx={{
                                        width: { xs: '100%', sm: 'auto' },
                                        background: 'linear-gradient(180deg, #fde047 0%, #eab308 50%, #ca8a04 100%)',
                                        color: '#422006',
                                        fontWeight: 900,
                                        fontSize: '0.88rem',
                                        borderRadius: '12px',
                                        px: { xs: 2, sm: 2.8 },
                                        py: 1,
                                        textTransform: 'none',
                                        border: '1.5px solid #fef08a',
                                        borderBottom: '3.5px solid #713f12',
                                        boxShadow: '0 4px 14px rgba(234, 179, 8, 0.45), inset 0 1px 0 rgba(255,255,255,0.8)',
                                        textShadow: '0 1px 0 rgba(255,255,255,0.6)',
                                        transition: 'all 0.2s ease',
                                        pointerEvents: 'none', // parent is clickable
                                    }}
                                >
                                    Check Status Now &bull; Search
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Box>

                {!enabled ? (
                    <Alert
                        severity="warning"
                        sx={{
                            borderRadius: '16px',
                            bgcolor: '#fffbeb',
                            color: '#b45309',
                            border: '1px solid #fde68a',
                            p: 3,
                            fontSize: '0.95rem',
                            fontWeight: 700,
                        }}
                    >
                        Conference ticket registration is currently closed by the committee.
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* 2-COLUMN LAYOUT: FORM ON LEFT, BADGE ON RIGHT */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', lg: 'row' },
                                gap: 3.5,
                                alignItems: 'flex-start',
                            }}
                        >
                            {/* LEFT COLUMN: STEPS 1, 2, 3 */}
                            <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 65%' }, width: '100%' }}>
                                <Stack spacing={3}>
                                    
                                    {/* STEP 1: SELECT TICKET CATEGORY */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: { xs: 2.5, sm: 3.5 },
                                            borderRadius: '24px',
                                            background: 'linear-gradient(180deg, #ffffff 0%, #fcfdfd 100%)',
                                            border: '1.5px solid #cbd5e1',
                                            borderBottom: '5px solid #94a3b8',
                                            boxShadow: '0 10px 28px -4px rgba(15, 23, 42, 0.07), inset 0 2px 0 #ffffff',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                <Box
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '10px',
                                                        background: 'linear-gradient(180deg, #059669 0%, #064e3b 100%)',
                                                        border: '1px solid #34d399',
                                                        borderBottom: '3.5px solid #022c22',
                                                        boxShadow: '0 4px 10px rgba(4, 120, 87, 0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
                                                        color: '#fff',
                                                        fontSize: '0.92rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 900,
                                                    }}
                                                >
                                                    1
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.08rem' }}>
                                                    Select Ticket Category
                                                </Typography>
                                            </Box>

                                            {/* Category Segmented Tabs */}
                                            <Box sx={{ display: 'flex', bgcolor: '#e2e8f0', p: 0.6, borderRadius: '14px', border: '1px solid #cbd5e1', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)', gap: 0.6 }}>
                                                {[
                                                    { key: 'all', label: `All Passes (${categoriesList.length})` },
                                                    { key: 'conference', label: `Conference (${categoriesList.filter(c => c.group === 'conference').length})` },
                                                    { key: 'visitor', label: `Visitor & Expo (${categoriesList.filter(c => c.group === 'visitor').length})` },
                                                ].map((tab) => (
                                                    <Button
                                                        key={tab.key}
                                                        size="small"
                                                        onClick={() => setSelectedTab(tab.key)}
                                                        sx={{
                                                            px: 1.8,
                                                            py: 0.6,
                                                            borderRadius: '10px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 900,
                                                            textTransform: 'none',
                                                            background: selectedTab === tab.key ? 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' : 'transparent',
                                                            border: selectedTab === tab.key ? '1.5px solid #cbd5e1' : '1.5px solid transparent',
                                                            borderBottom: selectedTab === tab.key ? '3.5px solid #94a3b8' : '3.5px solid transparent',
                                                            color: selectedTab === tab.key ? '#064e3b' : '#64748b',
                                                            boxShadow: selectedTab === tab.key ? '0 3px 8px rgba(0,0,0,0.08), inset 0 1px 0 #ffffff' : 'none',
                                                            transition: 'all 0.15s ease',
                                                            '&:hover': {
                                                                bgcolor: selectedTab === tab.key ? '#ffffff' : 'rgba(255,255,255,0.6)',
                                                                color: selectedTab === tab.key ? '#064e3b' : '#334155',
                                                            },
                                                        }}
                                                    >
                                                        {tab.label}
                                                    </Button>
                                                ))}
                                            </Box>
                                        </Box>

                                        {/* Categories Grid */}
                                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.2 }}>
                                            {filteredCategories.map((cat) => {
                                                const isSelected = visitorType === cat.id;

                                                return (
                                                    <Box
                                                        key={cat.id}
                                                        onClick={() => handleTypeChange(cat.id)}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            borderRadius: '20px',
                                                            background: isSelected 
                                                                ? (cat.bgSelected || 'linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)') 
                                                                : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                                                            border: `2px solid ${isSelected ? (cat.borderSelected || '#10b981') : '#e2e8f0'}`,
                                                            borderBottom: isSelected 
                                                                ? `6px solid ${cat.darkBorder || '#047857'}` 
                                                                : '5px solid #cbd5e1',
                                                            p: 2.5,
                                                            height: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'space-between',
                                                            transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                                            boxShadow: isSelected 
                                                                ? `0 14px 30px -4px ${cat.borderSelected || '#10b981'}35, inset 0 2px 0 rgba(255,255,255,0.9)` 
                                                                : '0 6px 18px -2px rgba(15, 23, 42, 0.05), inset 0 1px 0 #ffffff',
                                                            transform: isSelected ? 'translateY(-3px)' : 'none',
                                                            '&:hover': {
                                                                borderColor: cat.borderSelected || '#10b981',
                                                                borderBottom: isSelected ? `6px solid ${cat.darkBorder || '#047857'}` : `5px solid ${cat.borderSelected || '#94a3b8'}`,
                                                                transform: 'translateY(-5px)',
                                                                boxShadow: `0 16px 32px -4px rgba(15, 23, 42, 0.12), inset 0 1px 0 #ffffff`,
                                                            },
                                                        }}
                                                    >
                                                        <Box>
                                                            {/* Top Badges Bar */}
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
                                                                <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap">
                                                                    <Chip
                                                                        label={cat.tag || cat.badge}
                                                                        size="small"
                                                                        sx={{
                                                                            background: isSelected 
                                                                                ? `linear-gradient(180deg, #ffffff 0%, ${cat.tagBg || '#dcfce7'} 100%)` 
                                                                                : `linear-gradient(180deg, ${cat.tagBg || '#dcfce7'} 0%, #f1f5f9 100%)`,
                                                                            color: cat.tagColor || '#047857',
                                                                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                                                                            fontWeight: 900,
                                                                            fontSize: '0.66rem',
                                                                            height: 25,
                                                                            px: 1,
                                                                            letterSpacing: '0.06em',
                                                                            borderRadius: '8px',
                                                                            border: `1.5px solid ${cat.borderSelected || '#86efac'}`,
                                                                            borderBottom: `2.5px solid ${cat.darkBorder || '#4ade80'}`,
                                                                            boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                                                                        }}
                                                                    />
                                                                </Stack>

                                                                {/* 3D Radio Circle Indicator */}
                                                                <Box
                                                                    sx={{
                                                                        width: 24,
                                                                        height: 24,
                                                                        borderRadius: '50%',
                                                                        border: `2px solid ${isSelected ? (cat.borderSelected || '#10b981') : '#cbd5e1'}`,
                                                                        borderBottom: isSelected ? `3.5px solid ${cat.darkBorder || '#047857'}` : '3px solid #94a3b8',
                                                                        background: isSelected 
                                                                            ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)' 
                                                                            : 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        transition: 'all 0.18s ease',
                                                                        flexShrink: 0,
                                                                        boxShadow: isSelected ? `0 4px 10px ${cat.borderSelected || '#10b981'}70` : 'inset 0 1px 2px rgba(0,0,0,0.06)',
                                                                    }}
                                                                >
                                                                    {isSelected && <CheckCircleIcon sx={{ fontSize: 16, color: '#ffffff' }} />}
                                                                </Box>
                                                            </Box>

                                                            {/* Category Title */}
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{
                                                                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                                                                    fontWeight: 900,
                                                                    color: '#0f172a',
                                                                    fontSize: '1.08rem',
                                                                    mb: 0.8,
                                                                    lineHeight: 1.3,
                                                                    letterSpacing: '-0.02em',
                                                                }}
                                                            >
                                                                {cat.name}
                                                            </Typography>

                                                            {/* Price Display with Outfit font & separated IDR prefix */}
                                                            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1.2, flexWrap: 'wrap' }}>
                                                                {cat.price === 0 ? (
                                                                    <Typography
                                                                        sx={{
                                                                            fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                                                                            fontWeight: 900,
                                                                            color: '#059669',
                                                                            fontSize: '1.45rem',
                                                                            letterSpacing: '0.02em',
                                                                            lineHeight: 1,
                                                                            textShadow: '0 1px 1px rgba(5,150,105,0.2)',
                                                                        }}
                                                                    >
                                                                        FREE
                                                                    </Typography>
                                                                ) : (
                                                                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                                                                        <Typography
                                                                            component="span"
                                                                            sx={{
                                                                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                                                                fontWeight: 900,
                                                                                fontSize: '0.8rem',
                                                                                letterSpacing: '0.07em',
                                                                                color: isSelected ? (cat.tagColor || '#047857') : '#64748b',
                                                                                mr: 0.6,
                                                                                textTransform: 'uppercase',
                                                                            }}
                                                                        >
                                                                            IDR
                                                                        </Typography>
                                                                        <Typography
                                                                            component="span"
                                                                            sx={{
                                                                                fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                                                                                fontWeight: 900,
                                                                                color: isSelected ? (cat.tagColor || '#0f172a') : '#0f172a',
                                                                                fontSize: '1.5rem',
                                                                                lineHeight: 1,
                                                                                letterSpacing: '-0.03em',
                                                                            }}
                                                                        >
                                                                            {cat.price.toLocaleString('id-ID')}
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                            </Box>

                                                            {/* Description */}
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                                                                    color: '#64748b',
                                                                    display: 'block',
                                                                    lineHeight: 1.55,
                                                                    mb: 1.5,
                                                                    fontSize: '0.78rem',
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {cat.description}
                                                            </Typography>
                                                        </Box>

                                                        {/* Perks Bullet List */}
                                                        {cat.perks && cat.perks.length > 0 && (
                                                            <Box sx={{ mt: 1, pt: 1.2, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                                                                <Stack spacing={0.7}>
                                                                    {cat.perks.map((perk, perkIdx) => (
                                                                        <Box key={perkIdx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                                            <CheckCircleIcon sx={{ fontSize: 14, color: cat.borderSelected || '#10b981', flexShrink: 0 }} />
                                                                            <Typography
                                                                                variant="caption"
                                                                                sx={{
                                                                                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                                                                                    color: '#334155',
                                                                                    fontWeight: 700,
                                                                                    fontSize: '0.74rem',
                                                                                }}
                                                                            >
                                                                                {perk}
                                                                            </Typography>
                                                                        </Box>
                                                                    ))}
                                                                </Stack>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </Paper>

                                    {/* STEP 2: VISITOR / PARTICIPANT INFORMATION */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: { xs: 2.5, sm: 3.5 },
                                            borderRadius: '24px',
                                            background: 'linear-gradient(180deg, #ffffff 0%, #fcfdfd 100%)',
                                            border: '1.5px solid #cbd5e1',
                                            borderBottom: '5px solid #94a3b8',
                                            boxShadow: '0 10px 28px -4px rgba(15, 23, 42, 0.07), inset 0 2px 0 #ffffff',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                <Box
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '10px',
                                                        background: 'linear-gradient(180deg, #059669 0%, #064e3b 100%)',
                                                        border: '1px solid #34d399',
                                                        borderBottom: '3.5px solid #022c22',
                                                        boxShadow: '0 4px 10px rgba(4, 120, 87, 0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
                                                        color: '#fff',
                                                        fontSize: '0.92rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 900,
                                                    }}
                                                >
                                                    2
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.08rem' }}>
                                                    Participant Details {members.length > 1 && `(${members.length} People)`}
                                                </Typography>
                                            </Box>

                                            <Button
                                                startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                                                onClick={addMember}
                                                size="small"
                                                sx={{
                                                    color: '#065f46',
                                                    background: 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)',
                                                    border: '1.5px solid #86efac',
                                                    borderBottom: '3.5px solid #16a34a',
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    fontWeight: 900,
                                                    fontSize: '0.8rem',
                                                    px: 2,
                                                    py: 0.7,
                                                    boxShadow: '0 4px 10px rgba(22, 163, 74, 0.18), inset 0 1px 0 #ffffff',
                                                    transition: 'all 0.15s ease',
                                                    '&:hover': {
                                                        background: 'linear-gradient(180deg, #dcfce7 0%, #bbf7d0 100%)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 6px 14px rgba(22, 163, 74, 0.25)',
                                                    },
                                                    '&:active': {
                                                        transform: 'translateY(1px)',
                                                        borderBottom: '1.5px solid #16a34a',
                                                    },
                                                }}
                                            >
                                                + Add Another Participant
                                            </Button>
                                        </Box>

                                        <Stack spacing={2.5}>
                                            {members.map((member, idx) => (
                                                <Box
                                                    key={idx}
                                                    sx={{
                                                        p: 2.8,
                                                        borderRadius: '20px',
                                                        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                                                        border: '1.5px solid #cbd5e1',
                                                        borderBottom: '4.5px solid #94a3b8',
                                                        boxShadow: '0 6px 18px -2px rgba(15, 23, 42, 0.05), inset 0 1px 0 #ffffff',
                                                        position: 'relative',
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Chip
                                                                label={idx === 0 ? 'Primary Registrant / Group Leader' : `Participant #${idx + 1}`}
                                                                size="small"
                                                                sx={{
                                                                    background: idx === 0 
                                                                        ? 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)' 
                                                                        : 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
                                                                    border: idx === 0 ? '1.5px solid #7dd3fc' : '1.5px solid #cbd5e1',
                                                                    borderBottom: idx === 0 ? '3px solid #0284c7' : '3px solid #94a3b8',
                                                                    color: idx === 0 ? '#0369a1' : '#334155',
                                                                    fontWeight: 900,
                                                                    fontSize: '0.74rem',
                                                                    height: 26,
                                                                    px: 1,
                                                                    borderRadius: '8px',
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                                                                }}
                                                            />
                                                        </Box>

                                                        {members.length > 1 && (
                                                            <Button
                                                                onClick={() => removeMember(idx)}
                                                                size="small"
                                                                startIcon={<DeleteOutlineIcon sx={{ fontSize: 15 }} />}
                                                                sx={{
                                                                    background: 'linear-gradient(180deg, #fee2e2 0%, #fecaca 100%)',
                                                                    border: '1px solid #fca5a5',
                                                                    borderBottom: '2.5px solid #ef4444',
                                                                    color: '#991b1b',
                                                                    fontSize: '0.74rem',
                                                                    fontWeight: 800,
                                                                    textTransform: 'none',
                                                                    borderRadius: '8px',
                                                                    px: 1.5,
                                                                    py: 0.4,
                                                                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.15)',
                                                                    '&:hover': { background: 'linear-gradient(180deg, #fecaca 0%, #fca5a5 100%)', transform: 'translateY(-1px)' },
                                                                    '&:active': { transform: 'translateY(1px)', borderBottom: '1px solid #ef4444' },
                                                                }}
                                                            >
                                                                Remove
                                                            </Button>
                                                        )}
                                                    </Box>

                                                    {/* 2x2 Airy Grid Input Layout */}
                                                    <Grid container spacing={2.2}>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Full Name *"
                                                                placeholder="e.g. Dr. John Doe, S.T., M.T."
                                                                value={member.name}
                                                                onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                                                fullWidth
                                                                required
                                                                size="small"
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <Box sx={{ p: 0.6, borderRadius: '8px', bgcolor: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                                <PersonOutlineIcon sx={{ color: '#047857', fontSize: 17 }} />
                                                                            </Box>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        bgcolor: '#ffffff',
                                                                        borderRadius: '12px',
                                                                        border: '1.5px solid #cbd5e1',
                                                                        borderBottom: '3.5px solid #94a3b8',
                                                                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.02)',
                                                                        fontSize: '0.88rem',
                                                                        fontWeight: 700,
                                                                        transition: 'all 0.15s ease',
                                                                        '&:hover': {
                                                                            borderColor: '#94a3b8',
                                                                            borderBottom: '3.5px solid #64748b',
                                                                        },
                                                                        '&.Mui-focused': {
                                                                            border: '1.5px solid #059669',
                                                                            borderBottom: '3.5px solid #047857',
                                                                            boxShadow: '0 0 0 3px rgba(5, 150, 105, 0.15)',
                                                                        },
                                                                        '& fieldset': { border: 'none' },
                                                                    },
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Email Address *"
                                                                type="email"
                                                                placeholder="e.g. john.doe@organization.com"
                                                                value={member.email}
                                                                onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                                                                fullWidth
                                                                required
                                                                size="small"
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <Box sx={{ p: 0.6, borderRadius: '8px', bgcolor: '#f0f9ff', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                                <EmailOutlinedIcon sx={{ color: '#0284c7', fontSize: 17 }} />
                                                                            </Box>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        bgcolor: '#ffffff',
                                                                        borderRadius: '12px',
                                                                        border: '1.5px solid #cbd5e1',
                                                                        borderBottom: '3.5px solid #94a3b8',
                                                                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.02)',
                                                                        fontSize: '0.88rem',
                                                                        fontWeight: 700,
                                                                        transition: 'all 0.15s ease',
                                                                        '&:hover': {
                                                                            borderColor: '#94a3b8',
                                                                            borderBottom: '3.5px solid #64748b',
                                                                        },
                                                                        '&.Mui-focused': {
                                                                            border: '1.5px solid #0284c7',
                                                                            borderBottom: '3.5px solid #0369a1',
                                                                            boxShadow: '0 0 0 3px rgba(2, 132, 199, 0.15)',
                                                                        },
                                                                        '& fieldset': { border: 'none' },
                                                                    },
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="WhatsApp / Phone Number"
                                                                placeholder="e.g. +62 812 3456 7890"
                                                                value={member.phone}
                                                                onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                                                                fullWidth
                                                                size="small"
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <Box sx={{ p: 0.6, borderRadius: '8px', bgcolor: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                                <PhoneIphoneIcon sx={{ color: '#059669', fontSize: 17 }} />
                                                                            </Box>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        bgcolor: '#ffffff',
                                                                        borderRadius: '12px',
                                                                        border: '1.5px solid #cbd5e1',
                                                                        borderBottom: '3.5px solid #94a3b8',
                                                                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.02)',
                                                                        fontSize: '0.88rem',
                                                                        fontWeight: 700,
                                                                        transition: 'all 0.15s ease',
                                                                        '&:hover': {
                                                                            borderColor: '#94a3b8',
                                                                            borderBottom: '3.5px solid #64748b',
                                                                        },
                                                                        '&.Mui-focused': {
                                                                            border: '1.5px solid #059669',
                                                                            borderBottom: '3.5px solid #047857',
                                                                            boxShadow: '0 0 0 3px rgba(5, 150, 105, 0.15)',
                                                                        },
                                                                        '& fieldset': { border: 'none' },
                                                                    },
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Institution / Company / University"
                                                                placeholder="e.g. Pertamina / ITB / UGM / ESDM"
                                                                value={member.institution}
                                                                onChange={(e) => handleMemberChange(idx, 'institution', e.target.value)}
                                                                fullWidth
                                                                size="small"
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <Box sx={{ p: 0.6, borderRadius: '8px', bgcolor: '#f5f3ff', border: '1px solid #ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                                <BusinessOutlinedIcon sx={{ color: '#7c3aed', fontSize: 17 }} />
                                                                            </Box>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        bgcolor: '#ffffff',
                                                                        borderRadius: '12px',
                                                                        border: '1.5px solid #cbd5e1',
                                                                        borderBottom: '3.5px solid #94a3b8',
                                                                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.02)',
                                                                        fontSize: '0.88rem',
                                                                        fontWeight: 700,
                                                                        transition: 'all 0.15s ease',
                                                                        '&:hover': {
                                                                            borderColor: '#94a3b8',
                                                                            borderBottom: '3.5px solid #64748b',
                                                                        },
                                                                        '&.Mui-focused': {
                                                                            border: '1.5px solid #7c3aed',
                                                                            borderBottom: '3.5px solid #6d28d9',
                                                                            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)',
                                                                        },
                                                                        '& fieldset': { border: 'none' },
                                                                    },
                                                                }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Paper>

                                    {/* STEP 3: PAYMENT INSTRUCTIONS (IF PAID) */}
                                    {isPaid && (
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: { xs: 2.5, sm: 3.5 },
                                                borderRadius: '24px',
                                                background: 'linear-gradient(180deg, #ffffff 0%, #fcfdfd 100%)',
                                                border: `2px solid ${selectedCategory?.borderSelected || '#86efac'}`,
                                                borderBottom: `5px solid ${selectedCategory?.darkBorder || '#047857'}`,
                                                boxShadow: '0 10px 28px -4px rgba(15, 23, 42, 0.07), inset 0 2px 0 #ffffff',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5 }}>
                                                <Box
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '10px',
                                                        background: 'linear-gradient(180deg, #059669 0%, #064e3b 100%)',
                                                        border: '1px solid #34d399',
                                                        borderBottom: '3.5px solid #022c22',
                                                        boxShadow: '0 4px 10px rgba(4, 120, 87, 0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
                                                        color: '#fff',
                                                        fontSize: '0.92rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 900,
                                                    }}
                                                >
                                                    3
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.08rem' }}>
                                                    Payment Method
                                                </Typography>
                                            </Box>

                                            {/* Payment Method Selector Pills */}
                                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.8, mb: 2.5 }}>
                                                {/* Bank Transfer (Active & Recommended) */}
                                                <Paper
                                                    onClick={() => {
                                                        setPaymentMethod('foreign_bank_transfer');
                                                        setData('payment_method', 'foreign_bank_transfer');
                                                    }}
                                                    sx={{
                                                        p: 2.2,
                                                        borderRadius: '16px',
                                                        background: paymentMethod === 'foreign_bank_transfer' 
                                                            ? 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)' 
                                                            : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                                                        border: `2px solid ${paymentMethod === 'foreign_bank_transfer' ? '#0284c7' : '#cbd5e1'}`,
                                                        borderBottom: paymentMethod === 'foreign_bank_transfer' ? '5px solid #0369a1' : '4px solid #94a3b8',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        gap: 1.5,
                                                        transition: 'all 0.18s ease',
                                                        boxShadow: paymentMethod === 'foreign_bank_transfer' 
                                                            ? '0 8px 20px rgba(2, 132, 199, 0.2), inset 0 1px 0 #ffffff' 
                                                            : '0 3px 8px rgba(0,0,0,0.03), inset 0 1px 0 #ffffff',
                                                        transform: paymentMethod === 'foreign_bank_transfer' ? 'translateY(-2px)' : 'none',
                                                        '&:hover': {
                                                            borderColor: '#0284c7',
                                                            borderBottom: '5px solid #0369a1',
                                                            transform: 'translateY(-3px)',
                                                            boxShadow: '0 10px 22px rgba(2, 132, 199, 0.25)',
                                                        },
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Box sx={{ p: 1, borderRadius: '10px', background: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)', border: '1px solid #7dd3fc', borderBottom: '2.5px solid #0284c7', color: '#0284c7', boxShadow: '0 2px 4px rgba(2,132,199,0.2)' }}>
                                                            <AccountBalanceIcon sx={{ fontSize: 22 }} />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a' }}>Bank Transfer</Typography>
                                                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 600 }}>Direct Bank Transfer / SWIFT</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Chip
                                                        label="ACTIVE"
                                                        size="small"
                                                        sx={{
                                                            height: 22,
                                                            fontSize: '0.64rem',
                                                            fontWeight: 900,
                                                            background: 'linear-gradient(180deg, #dcfce7 0%, #bbf7d0 100%)',
                                                            color: '#14532d',
                                                            border: '1px solid #86efac',
                                                            borderBottom: '2.5px solid #16a34a',
                                                            letterSpacing: '0.05em',
                                                            boxShadow: '0 2px 4px rgba(22,163,74,0.15)',
                                                        }}
                                                    />
                                                </Paper>

                                                {/* QRIS Indonesia (Under Maintenance / Coming Soon) */}
                                                <Paper
                                                    onClick={() => {
                                                        setPaymentMethod('qris_indo');
                                                        setData('payment_method', 'qris_indo');
                                                    }}
                                                    sx={{
                                                        p: 2.2,
                                                        borderRadius: '16px',
                                                        background: paymentMethod === 'qris_indo' 
                                                            ? 'linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)' 
                                                            : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                                                        border: `2px solid ${paymentMethod === 'qris_indo' ? '#f59e0b' : '#cbd5e1'}`,
                                                        borderBottom: paymentMethod === 'qris_indo' ? '5px solid #b45309' : '4px solid #94a3b8',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        gap: 1.5,
                                                        transition: 'all 0.18s ease',
                                                        boxShadow: paymentMethod === 'qris_indo' 
                                                            ? '0 8px 20px rgba(245, 158, 11, 0.2), inset 0 1px 0 #ffffff' 
                                                            : '0 3px 8px rgba(0,0,0,0.03), inset 0 1px 0 #ffffff',
                                                        transform: paymentMethod === 'qris_indo' ? 'translateY(-2px)' : 'none',
                                                        '&:hover': {
                                                            borderColor: '#f59e0b',
                                                            borderBottom: '5px solid #b45309',
                                                            transform: 'translateY(-3px)',
                                                            boxShadow: '0 10px 22px rgba(245, 158, 11, 0.25)',
                                                        },
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Box sx={{ p: 1, borderRadius: '10px', background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)', border: '1px solid #fcd34d', borderBottom: '2.5px solid #d97706', color: '#d97706', boxShadow: '0 2px 4px rgba(217,119,6,0.2)' }}>
                                                            <QrCodeIcon sx={{ fontSize: 22 }} />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a' }}>QRIS Indonesia</Typography>
                                                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 600 }}>BCA, GoPay, OVO, Dana</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Chip
                                                        label="COMING SOON"
                                                        size="small"
                                                        sx={{
                                                            height: 22,
                                                            fontSize: '0.64rem',
                                                            fontWeight: 900,
                                                            background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)',
                                                            color: '#78350f',
                                                            border: '1px solid #fcd34d',
                                                            borderBottom: '2.5px solid #b45309',
                                                            letterSpacing: '0.04em',
                                                            boxShadow: '0 2px 4px rgba(180,83,9,0.15)',
                                                        }}
                                                    />
                                                </Paper>
                                            </Box>

                                            {/* QRIS Container (Maintenance / Coming Soon Display) */}
                                            {paymentMethod === 'qris_indo' && (
                                                <Box sx={{ textAlign: 'center', p: 3.5, background: 'linear-gradient(180deg, #fffdf5 0%, #fffbeb 100%)', borderRadius: '18px', border: '2px dashed #fcd34d', borderBottom: '4.5px solid #f59e0b', mb: 2.5, boxShadow: '0 6px 16px rgba(245, 158, 11, 0.1)' }}>
                                                    <Box sx={{ display: 'inline-flex', p: 1.8, borderRadius: '50%', background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)', border: '1.5px solid #fcd34d', borderBottom: '3px solid #d97706', color: '#d97706', mb: 1.5, boxShadow: '0 4px 10px rgba(217, 119, 6, 0.2)' }}>
                                                        <ConstructionIcon sx={{ fontSize: 34 }} />
                                                    </Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#92400e', mb: 0.6 }}>
                                                        QRIS Indonesia (Under Maintenance / Coming Soon)
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#b45309', maxWidth: 480, mx: 'auto', mb: 2.2, fontSize: '0.84rem', lineHeight: 1.55 }}>
                                                        Instant QRIS payment gateway is currently under scheduled maintenance & gateway configuration. Please proceed with <strong>Bank Transfer</strong> for immediate registration processing.
                                                    </Typography>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<AccountBalanceIcon sx={{ fontSize: 16 }} />}
                                                        onClick={() => {
                                                            setPaymentMethod('foreign_bank_transfer');
                                                            setData('payment_method', 'foreign_bank_transfer');
                                                        }}
                                                        sx={{
                                                            background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
                                                            color: '#fff',
                                                            fontWeight: 900,
                                                            borderRadius: '12px',
                                                            textTransform: 'none',
                                                            px: 3,
                                                            py: 1,
                                                            border: '1.5px solid #38bdf8',
                                                            borderBottom: '3.5px solid #075985',
                                                            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
                                                            '&:hover': { background: 'linear-gradient(180deg, #0369a1 0%, #075985 100%)', transform: 'translateY(-1px)' },
                                                            '&:active': { transform: 'translateY(1px)', borderBottom: '1.5px solid #075985' },
                                                        }}
                                                    >
                                                        Switch to Bank Transfer
                                                    </Button>
                                                </Box>
                                            )}

                                            {/* Bank Transfer Container */}
                                            {paymentMethod === 'foreign_bank_transfer' && (
                                                <Box sx={{ p: 2.8, background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '18px', border: '1.5px solid #cbd5e1', borderBottom: '4.5px solid #94a3b8', mb: 2.5, boxShadow: '0 6px 18px rgba(0,0,0,0.04), inset 0 1px 0 #ffffff' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0284c7', fontSize: '0.92rem' }}>
                                                            Bank Account
                                                        </Typography>
                                                        <Button
                                                            size="small"
                                                            startIcon={<ContentCopyIcon sx={{ fontSize: 13 }} />}
                                                            onClick={handleCopyBankInfo}
                                                            sx={{
                                                                color: '#0369a1',
                                                                background: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)',
                                                                border: '1.5px solid #7dd3fc',
                                                                borderBottom: '3px solid #0284c7',
                                                                fontSize: '0.74rem',
                                                                fontWeight: 900,
                                                                borderRadius: '8px',
                                                                px: 1.5,
                                                                py: 0.5,
                                                                textTransform: 'none',
                                                                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.2), inset 0 1px 0 #ffffff',
                                                                '&:hover': { background: 'linear-gradient(180deg, #bae6fd 0%, #7dd3fc 100%)', transform: 'translateY(-1px)' },
                                                                '&:active': { transform: 'translateY(1px)', borderBottom: '1.5px solid #0284c7' },
                                                            }}
                                                        >
                                                            {copySuccess ? 'Copied to Clipboard!' : 'Copy Info'}
                                                        </Button>
                                                    </Box>
                                                    <Typography variant="body2" sx={{ color: '#0f172a', whiteSpace: 'pre-line', fontFamily: 'monospace', background: '#ffffff', p: 2.2, borderRadius: '14px', border: '1.5px solid #cbd5e1', borderBottom: '3.5px solid #94a3b8', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)', display: 'block', fontSize: '0.86rem', lineHeight: 1.6, fontWeight: 600 }}>
                                                        {bankTransferInfo}
                                                    </Typography>

                                                    {isPaid && (
                                                        <Box sx={{ mt: 2, p: 2, background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', borderRadius: '14px', border: '2px solid #86efac', borderBottom: '4.5px solid #16a34a', boxShadow: '0 6px 16px rgba(22, 163, 74, 0.15), inset 0 1px 0 #ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                                            <Box>
                                                                <Typography variant="caption" sx={{ color: '#166534', fontWeight: 800, display: 'block', fontSize: '0.74rem' }}>
                                                                    Total Amount to Transfer:
                                                                </Typography>
                                                                <Typography variant="subtitle1" sx={{ color: '#094d42', fontWeight: 900, fontSize: '1.25rem', fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif' }}>
                                                                    IDR {totalEstimate.toLocaleString('id-ID')}
                                                                </Typography>
                                                            </Box>
                                                            <Chip 
                                                                label={`Unique Code: ${uniqueCode}`} 
                                                                size="small" 
                                                                sx={{ 
                                                                    background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)', 
                                                                    border: '1.5px solid #86efac', 
                                                                    borderBottom: '3px solid #16a34a', 
                                                                    color: '#15803d', 
                                                                    fontWeight: 900, 
                                                                    fontSize: '0.75rem',
                                                                    boxShadow: '0 2px 4px rgba(22,163,74,0.15)',
                                                                }} 
                                                            />
                                                        </Box>
                                                    )}
                                                </Box>
                                            )}

                                            {/* Proof Upload Action Zone */}
                                            <Typography variant="caption" sx={{ fontWeight: 900, color: '#334155', display: 'block', mb: 1.2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                 Upload Payment Receipt *
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

                                            <Box sx={{ display: 'flex', gap: 1.8, flexWrap: 'wrap' }}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<PhotoCameraIcon sx={{ fontSize: 17 }} />}
                                                    onClick={handleOpenDirectCamera}
                                                    disabled={compressing}
                                                    sx={{
                                                        borderRadius: '14px',
                                                        background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
                                                        border: '1.5px solid #38bdf8',
                                                        borderBottom: '4.5px solid #075985',
                                                        color: '#ffffff',
                                                        textTransform: 'none',
                                                        fontWeight: 900,
                                                        fontSize: '0.85rem',
                                                        px: 2.5,
                                                        py: 1.1,
                                                        boxShadow: '0 6px 16px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
                                                        transition: 'all 0.15s ease',
                                                        '&:hover': { 
                                                            background: 'linear-gradient(180deg, #0369a1 0%, #075985 100%)',
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 8px 20px rgba(2, 132, 199, 0.45)',
                                                        },
                                                        '&:active': {
                                                            transform: 'translateY(2px)',
                                                            borderBottom: '2px solid #075985',
                                                        },
                                                    }}
                                                >
                                                    Open Camera
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<CloudUploadIcon sx={{ fontSize: 17 }} />}
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={compressing}
                                                    sx={{
                                                        borderRadius: '14px',
                                                        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                                                        border: '1.5px solid #cbd5e1',
                                                        borderBottom: '4.5px solid #94a3b8',
                                                        color: '#1e293b',
                                                        textTransform: 'none',
                                                        fontWeight: 900,
                                                        fontSize: '0.85rem',
                                                        px: 2.5,
                                                        py: 1.1,
                                                        boxShadow: '0 6px 16px rgba(0,0,0,0.06), inset 0 1px 0 #ffffff',
                                                        transition: 'all 0.15s ease',
                                                        '&:hover': { 
                                                            background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
                                                            transform: 'translateY(-2px)',
                                                            borderColor: '#94a3b8',
                                                            borderBottom: '4.5px solid #64748b',
                                                        },
                                                        '&:active': {
                                                            transform: 'translateY(2px)',
                                                            borderBottom: '2px solid #64748b',
                                                        },
                                                    }}
                                                >
                                                    Browse Gallery / File
                                                </Button>
                                            </Box>

                                            {compressing && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.8 }}>
                                                    <CircularProgress size={16} sx={{ color: '#059669' }} />
                                                    <Typography variant="caption" sx={{ color: '#059669', fontWeight: 800 }}>
                                                        Auto-compressing image preview...
                                                    </Typography>
                                                </Box>
                                            )}

                                            {proofPreview && (
                                                <Box sx={{ mt: 2.2, p: 2.2, background: 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)', border: '1.5px solid #86efac', borderBottom: '4px solid #16a34a', borderRadius: '16px', boxShadow: '0 6px 18px rgba(22, 163, 74, 0.15)', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box component="img" src={proofPreview} alt="Proof Preview" sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '10px', border: '2px solid #86efac', boxShadow: '0 3px 8px rgba(0,0,0,0.1)' }} />
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#059669', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.82rem' }}>
                                                            <CheckCircleIcon sx={{ fontSize: 18 }} /> Payment proof attached ({compressionStats?.compressed} KB)
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.74rem', display: 'block', fontWeight: 600, mt: 0.3 }}>
                                                            Original: {compressionStats?.original} KB &bull; Compressed for fast server verification.
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Paper>
                                    )}
                                </Stack>
                            </Box>

                            {/* RIGHT COLUMN: 3D BADGE PREVIEW + ORDER SUMMARY + CTA BUTTON */}
                            <Box sx={{ flex: { xs: '1 1 100%', lg: '0 0 380px' }, width: '100%', position: { lg: 'sticky' }, top: { lg: 24 } }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2.5, sm: 3 },
                                        borderRadius: '24px',
                                        background: 'linear-gradient(180deg, #ffffff 0%, #fcfdfd 100%)',
                                        border: '1.5px solid #cbd5e1',
                                        borderBottom: '5px solid #94a3b8',
                                        boxShadow: '0 10px 28px -4px rgba(15, 23, 42, 0.07), inset 0 2px 0 #ffffff',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 0.6, fontSize: '0.75rem' }}>
                                            <VisibilityIcon sx={{ fontSize: 16, color: selectedCategory.lanyardTheme?.banner || '#059669' }} /> Live 3D Lanyard Badge
                                        </Typography>
                                        <Chip
                                            label={selectedCategory.badge || 'PASS'}
                                            size="small"
                                            sx={{
                                                background: `linear-gradient(180deg, ${selectedCategory.tagBg || '#ecfdf5'} 0%, ${selectedCategory.tagBg || '#ecfdf5'}ee 100%)`,
                                                color: selectedCategory.tagColor || '#047857',
                                                border: `1.5px solid ${selectedCategory.borderSelected || '#10b981'}`,
                                                borderBottom: `2.5px solid ${selectedCategory.darkBorder || '#047857'}`,
                                                fontWeight: 900,
                                                fontSize: '0.68rem',
                                                height: 24,
                                                px: 0.8,
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
                                            }}
                                        />
                                    </Box>

                                    {/* 3D Perspective Card Container */}
                                    <Box
                                        onMouseMove={handleCardMouseMove}
                                        onMouseLeave={handleCardMouseLeave}
                                        sx={{
                                            perspective: '900px',
                                            cursor: 'pointer',
                                            my: 1.5,
                                        }}
                                    >
                                        {/* Lanyard Top Strap & Metallic Clip */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: -1, position: 'relative', zIndex: 3 }}>
                                            {/* Fabric Strap with woven texture & depth */}
                                            <Box
                                                sx={{
                                                    width: 38,
                                                    height: 22,
                                                    background: `linear-gradient(90deg, ${selectedCategory.lanyardTheme?.banner || '#094d42'} 0%, ${selectedCategory.lanyardTheme?.border || '#059669'} 50%, ${selectedCategory.lanyardTheme?.banner || '#094d42'} 100%)`,
                                                    borderRadius: '6px 6px 0 0',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderBottom: 'none',
                                                    boxShadow: 'inset 0 -3px 4px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.15)',
                                                }}
                                            />
                                            {/* Brushed Chrome / Stainless Swivel Clip */}
                                            <Box
                                                sx={{
                                                    width: 18,
                                                    height: 14,
                                                    background: 'linear-gradient(180deg, #f8fafc 0%, #cbd5e1 50%, #94a3b8 100%)',
                                                    borderRadius: '4px',
                                                    border: '1.5px solid #e2e8f0',
                                                    borderBottom: '2.5px solid #64748b',
                                                    boxShadow: '0 3px 6px rgba(0,0,0,0.15), inset 0 1px 0 #ffffff',
                                                }}
                                            />
                                        </Box>

                                        {/* Physical Lanyard Card 3D Body */}
                                        <Box
                                            sx={{
                                                transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
                                                transition: 'transform 0.15s ease-out',
                                                borderRadius: '20px',
                                                background: 'linear-gradient(145deg, #ffffff 0%, #fcfdfd 60%, #f8fafc 100%)',
                                                border: `2px solid ${selectedCategory.lanyardTheme?.border || '#10b981'}`,
                                                borderBottom: `6px solid ${selectedCategory.lanyardTheme?.darkBorder || '#047857'}`,
                                                boxShadow: `0 18px 38px -6px ${selectedCategory.lanyardTheme?.border || '#10b981'}40, 0 6px 14px rgba(0,0,0,0.06), inset 0 2px 0 #ffffff`,
                                                p: 2.8,
                                                textAlign: 'center',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '45%',
                                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
                                                    pointerEvents: 'none',
                                                }
                                            }}
                                        >
                                            {/* Hole Punch */}
                                            <Box
                                                sx={{
                                                    width: 28,
                                                    height: 7,
                                                    borderRadius: '4px',
                                                    background: 'linear-gradient(180deg, #cbd5e1 0%, #f1f5f9 100%)',
                                                    border: '1px solid #94a3b8',
                                                    mx: 'auto',
                                                    mb: 1.5,
                                                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.25)',
                                                }}
                                            />

                                            <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#094d42', fontSize: '0.72rem', display: 'block' }}>
                                                55ᵀᴴ PIT IAGI-GEOSEA XIX 2026
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.64rem', display: 'block', mb: 1.5, fontWeight: 700 }}>
                                                ANNUAL SCIENTIFIC CONVENTION
                                            </Typography>

                                            {/* QR Code with 3D bevel */}
                                            <Box
                                                sx={{
                                                    p: 1.2,
                                                    bgcolor: '#ffffff',
                                                    borderRadius: '14px',
                                                    border: '1.5px solid #cbd5e1',
                                                    borderBottom: '3.5px solid #94a3b8',
                                                    width: 'fit-content',
                                                    mx: 'auto',
                                                    mb: 1.8,
                                                    boxShadow: '0 6px 16px rgba(0,0,0,0.06), inset 0 1px 2px rgba(0,0,0,0.02)',
                                                }}
                                            >
                                                <QRCodeSVG
                                                    value="TKT-SAMPLE-PREVIEW"
                                                    size={105}
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
                                                    fontSize: '1.08rem',
                                                    minHeight: '1.2em',
                                                    mb: 0.3,
                                                }}
                                            >
                                                {primaryMember.name || 'Participant Name'}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: selectedCategory.lanyardTheme?.banner || '#0284c7',
                                                    fontSize: '0.8rem',
                                                    display: 'block',
                                                    minHeight: '1.2em',
                                                    mb: 1.8,
                                                }}
                                            >
                                                {primaryMember.institution || 'Institution / Organization'}
                                            </Typography>

                                            {/* Bottom Banner */}
                                            <Box
                                                sx={{
                                                    background: isPaid 
                                                        ? `linear-gradient(180deg, ${selectedCategory.lanyardTheme?.banner || '#094d42'} 0%, ${selectedCategory.lanyardTheme?.darkBorder || '#042e27'} 100%)` 
                                                        : `linear-gradient(180deg, ${selectedCategory.lanyardTheme?.banner || '#059669'} 0%, ${selectedCategory.lanyardTheme?.darkBorder || '#047857'} 100%)`,
                                                    color: '#ffffff',
                                                    py: 1,
                                                    px: 1.5,
                                                    borderRadius: '12px',
                                                    fontWeight: 900,
                                                    letterSpacing: '0.06em',
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.76rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 0.6,
                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                    borderBottom: '3px solid rgba(0,0,0,0.3)',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.4)',
                                                    textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                                                }}
                                            >
                                                {isPaid && <StarIcon sx={{ fontSize: 14, color: '#fef08a' }} />}
                                                {selectedCategory.lanyardTheme?.badge || selectedCategory.name}
                                                {isPaid && <StarIcon sx={{ fontSize: 14, color: '#fef08a' }} />}
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Order Summary Box */}
                                    <Box 
                                        sx={{ 
                                            mt: 2.5, 
                                            p: 2.5, 
                                            background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', 
                                            borderRadius: '18px', 
                                            border: '1.5px solid #cbd5e1',
                                            borderBottom: '4px solid #94a3b8',
                                            boxShadow: '0 6px 16px rgba(0,0,0,0.04), inset 0 1px 0 #ffffff',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                                fontWeight: 800,
                                                color: '#475569',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.08em',
                                                display: 'block',
                                                mb: 1.5,
                                                fontSize: '0.74rem',
                                            }}
                                        >
                                            Order Summary:
                                        </Typography>
                                        <Stack spacing={1.2}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#64748b', fontWeight: 600 }}>
                                                    Category:
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: selectedCategory.tagColor || '#059669' }}>
                                                    {selectedCategory.name}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#64748b', fontWeight: 600 }}>
                                                    Price / Ticket:
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif', fontWeight: 800, color: '#0f172a' }}>
                                                    {selectedCategory.price > 0 ? `IDR ${selectedCategory.price.toLocaleString('id-ID')}` : 'FREE'}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#64748b', fontWeight: 600 }}>
                                                    Total Participants:
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: '#0f172a' }}>
                                                    {members.length} Person(s)
                                                </Typography>
                                            </Box>
                                            {isPaid && (
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="caption" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#64748b', fontWeight: 600 }}>
                                                        Unique Code:
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif', fontWeight: 800, color: '#0284c7' }}>
                                                        +IDR {uniqueCode}
                                                    </Typography>
                                                </Box>
                                            )}
                                            <Divider sx={{ borderColor: '#cbd5e1', my: 0.5 }} />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="subtitle2" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>
                                                    Total Amount:
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                                                        fontWeight: 900,
                                                        color: isPaid ? '#094d42' : '#059669',
                                                        fontSize: '1.35rem',
                                                        letterSpacing: '-0.02em',
                                                        textShadow: '0 1px 1px rgba(0,0,0,0.06)',
                                                    }}
                                                >
                                                    {isPaid ? `IDR ${totalEstimate.toLocaleString('id-ID')}` : 'FREE (Rp 0)'}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>

                                    {/* Submit CTA Button */}
                                    <Box sx={{ mt: 2.5 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            disabled={processing || compressing}
                                            startIcon={processing ? <CircularProgress size={18} color="inherit" /> : <ConfirmationNumberIcon />}
                                            sx={{
                                                background: isPaid 
                                                    ? 'linear-gradient(180deg, #094d42 0%, #063d34 50%, #03241e 100%)' 
                                                    : 'linear-gradient(180deg, #10b981 0%, #059669 50%, #047857 100%)',
                                                color: '#ffffff',
                                                fontWeight: 900,
                                                fontSize: '0.98rem',
                                                py: 1.6,
                                                borderRadius: '16px',
                                                textTransform: 'none',
                                                border: '1.5px solid rgba(255,255,255,0.4)',
                                                borderBottom: isPaid ? '6px solid #021a15' : '6px solid #022c22',
                                                boxShadow: isPaid
                                                    ? '0 12px 28px -4px rgba(9, 77, 66, 0.5), inset 0 2px 0 rgba(255,255,255,0.45)'
                                                    : '0 12px 28px -4px rgba(16, 185, 129, 0.5), inset 0 2px 0 rgba(255,255,255,0.45)',
                                                textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                                                transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                                '&:hover': {
                                                    background: isPaid
                                                        ? 'linear-gradient(180deg, #0c6153 0%, #094d42 50%, #063d34 100%)'
                                                        : 'linear-gradient(180deg, #34d399 0%, #10b981 50%, #059669 100%)',
                                                    transform: 'translateY(-3px)',
                                                    borderBottom: isPaid ? '7px solid #021a15' : '7px solid #022c22',
                                                    boxShadow: isPaid
                                                        ? '0 16px 34px -4px rgba(9, 77, 66, 0.6), inset 0 2px 0 rgba(255,255,255,0.6)'
                                                        : '0 16px 34px -4px rgba(16, 185, 129, 0.6), inset 0 2px 0 rgba(255,255,255,0.6)',
                                                },
                                                '&:active': {
                                                    transform: 'translateY(3px)',
                                                    borderBottom: isPaid ? '2px solid #021a15' : '2px solid #022c22',
                                                    boxShadow: isPaid
                                                        ? '0 4px 10px rgba(9, 77, 66, 0.35)'
                                                        : '0 4px 10px rgba(16, 185, 129, 0.35)',
                                                },
                                            }}
                                        >
                                            {processing 
                                                ? 'Processing Registration...' 
                                                : 'Submit Registration'
                                            }
                                        </Button>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1.4, fontSize: '0.72rem', fontWeight: 600 }}>
                                            <ShieldOutlinedIcon sx={{ fontSize: 14, color: '#059669' }} /> Encrypted & verified by IAGI Secretariat Committee
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
                        borderRadius: '24px',
                        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                        border: '2px solid #475569',
                        borderBottom: '6px solid #020617',
                        color: '#fff',
                        overflow: 'hidden',
                        boxShadow: '0 25px 60px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2.2,
                        px: 3,
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        background: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Box sx={{ p: 0.6, borderRadius: '10px', bgcolor: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PhotoCameraIcon sx={{ color: '#38bdf8', fontSize: 20 }} />
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#fff', fontSize: '1.05rem' }}>
                            Capture Payment Proof
                        </Typography>
                    </Box>
                    <IconButton 
                        onClick={stopCamera} 
                        size="small" 
                        sx={{ 
                            color: '#94a3b8', 
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderBottom: '2.5px solid rgba(0,0,0,0.4)',
                            borderRadius: '10px',
                            '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.15)' } 
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0, position: 'relative', bgcolor: '#000', minHeight: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cameraLoading && (
                        <Box sx={{ textAlign: 'center', p: 3 }}>
                            <CircularProgress sx={{ color: '#38bdf8', mb: 1.5 }} />
                            <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 700 }}>
                                Initializing camera stream...
                            </Typography>
                        </Box>
                    )}

                    {cameraError ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#f87171', mb: 2, fontWeight: 700 }}>
                                {cameraError}
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    stopCamera();
                                    cameraInputRef.current?.click();
                                }}
                                sx={{
                                    color: '#38bdf8',
                                    background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.1) 0%, rgba(56, 189, 248, 0.05) 100%)',
                                    borderColor: '#38bdf8',
                                    borderBottom: '3px solid #0284c7',
                                    textTransform: 'none',
                                    fontWeight: 800,
                                    borderRadius: '12px',
                                    px: 2.5,
                                    py: 0.8,
                                }}
                            >
                                Use Native Camera App
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    maxHeight: '480px',
                                    objectFit: 'contain',
                                    display: cameraLoading ? 'none' : 'block',
                                }}
                            />
                            {/* Scanning Guide Box Overlay */}
                            {!cameraLoading && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '75%',
                                        height: '65%',
                                        border: '2px dashed rgba(56, 189, 248, 0.8)',
                                        borderRadius: '16px',
                                        boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)',
                                        pointerEvents: 'none',
                                    }}
                                />
                            )}
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2, px: 3, bgcolor: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.1)', justifyContent: 'space-between' }}>
                    <Button
                        startIcon={<CameraswitchIcon />}
                        onClick={handleSwitchCamera}
                        size="small"
                        sx={{
                            color: '#e2e8f0',
                            background: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
                            border: '1.5px solid #475569',
                            borderBottom: '3px solid #0f172a',
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 800,
                            px: 2,
                            py: 0.8,
                            boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
                            '&:hover': { background: 'linear-gradient(180deg, #475569 0%, #334155 100%)', color: '#fff' },
                            '&:active': { transform: 'translateY(1px)', borderBottom: '1.5px solid #0f172a' },
                        }}
                    >
                        Switch Camera
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleCapturePhoto}
                        disabled={cameraLoading || !!cameraError}
                        startIcon={<PhotoCameraIcon />}
                        sx={{
                            background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
                            color: '#fff',
                            fontWeight: 900,
                            borderRadius: '14px',
                            border: '1.5px solid #38bdf8',
                            borderBottom: '4px solid #0c4a6e',
                            textTransform: 'none',
                            px: 3.2,
                            py: 1,
                            boxShadow: '0 6px 18px rgba(2, 132, 199, 0.45), inset 0 1px 0 rgba(255,255,255,0.4)',
                            '&:hover': { 
                                background: 'linear-gradient(180deg, #0369a1 0%, #075985 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 22px rgba(2, 132, 199, 0.6)',
                            },
                            '&:active': {
                                transform: 'translateY(2px)',
                                borderBottom: '1.5px solid #0c4a6e',
                            },
                        }}
                    >
                        Capture Photo
                    </Button>
                </DialogActions>
            </Dialog>

            {/* CHECK STATUS & FIND TICKET MODAL */}
            <Dialog
                open={checkStatusOpen}
                onClose={() => setCheckStatusOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        background: 'linear-gradient(180deg, #ffffff 0%, #fcfdfd 100%)',
                        border: '1.5px solid #cbd5e1',
                        borderBottom: '6px solid #94a3b8',
                        overflow: 'hidden',
                        boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.25), inset 0 2px 0 #ffffff',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        p: { xs: 2.5, sm: 3 },
                        pb: 2.2,
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        borderBottom: '1.5px solid #e2e8f0',
                        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '14px',
                                background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)',
                                border: '1.5px solid #86efac',
                                borderBottom: '3.5px solid #16a34a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#047857',
                                boxShadow: '0 4px 10px rgba(22, 163, 74, 0.15)',
                            }}
                        >
                            <ManageSearchIcon sx={{ fontSize: 30 }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1.2, fontSize: { xs: '1.1rem', sm: '1.3rem' } }}>
                                Find My Ticket & Payment Status
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.84rem', mt: 0.3, fontWeight: 600 }}>
                                Check Registration Status & Participant E-Ticket for 55ᵀᴴ PIT IAGI-GEOSEA 2026
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        onClick={() => setCheckStatusOpen(false)}
                        size="small"
                        sx={{
                            color: '#64748b',
                            background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
                            border: '1.5px solid #cbd5e1',
                            borderBottom: '3px solid #94a3b8',
                            borderRadius: '10px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            '&:hover': { color: '#0f172a', background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)' },
                            '&:active': { transform: 'translateY(1px)', borderBottom: '1.5px solid #94a3b8' },
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                    {/* Search Input Box Form */}
                    <Box component="form" onSubmit={handlePerformSearch} sx={{ mb: 3 }}>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1, fontSize: '0.74rem' }}>
                            Search by Email / Phone / Payment Code
                        </Typography>
                        <TextField
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="e.g. yourname@gmail.com, 08123456789, or VPAY-260911..."
                            variant="outlined"
                            size="medium"
                            disabled={isSearching}
                            autoFocus
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box sx={{ p: 0.6, borderRadius: '8px', bgcolor: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <SearchIcon sx={{ color: '#047857', fontSize: 18 }} />
                                        </Box>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            {searchQuery && (
                                                <IconButton size="small" onClick={handleResetSearch} sx={{ color: '#94a3b8' }}>
                                                    <HighlightOffIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={isSearching || !searchQuery.trim()}
                                                startIcon={isSearching ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SearchIcon sx={{ fontSize: 17 }} />}
                                                sx={{
                                                    background: 'linear-gradient(180deg, #10b981 0%, #059669 50%, #047857 100%)',
                                                    color: '#fff',
                                                    fontWeight: 900,
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    px: 2.8,
                                                    py: 1,
                                                    border: '1.5px solid #34d399',
                                                    borderBottom: '3.5px solid #022c22',
                                                    boxShadow: '0 4px 12px rgba(4, 120, 87, 0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
                                                    transition: 'all 0.15s ease',
                                                    '&:hover': { 
                                                        background: 'linear-gradient(180deg, #34d399 0%, #10b981 50%, #059669 100%)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 6px 16px rgba(4, 120, 87, 0.45)',
                                                    },
                                                    '&:active': {
                                                        transform: 'translateY(1.5px)',
                                                        borderBottom: '1.5px solid #022c22',
                                                    },
                                                }}
                                            >
                                                {isSearching ? 'Searching...' : 'Search'}
                                            </Button>
                                        </Stack>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '14px',
                                    background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                                    border: '1.5px solid #cbd5e1',
                                    borderBottom: '3.5px solid #94a3b8',
                                    pr: 1,
                                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.02)',
                                    '& fieldset': { border: 'none' },
                                    '&:hover': { 
                                        borderColor: '#10b981',
                                        borderBottom: '3.5px solid #059669',
                                    },
                                    '&.Mui-focused': { 
                                        borderColor: '#059669', 
                                        borderBottom: '3.5px solid #047857',
                                        boxShadow: '0 0 0 4px rgba(5, 150, 105, 0.12), inset 0 1px 2px rgba(0,0,0,0.03)',
                                    },
                                },
                            }}
                        />
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.76rem', display: 'block', mt: 1, ml: 0.5, fontWeight: 600 }}>
                            💡 <strong>Tip:</strong> Enter the email address used during registration to find all your registered tickets.
                        </Typography>
                    </Box>

                    {/* Loading State */}
                    {isSearching && (
                        <Box sx={{ py: 6, textAlign: 'center' }}>
                            <CircularProgress size={38} sx={{ color: '#047857', mb: 1.8 }} />
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                                Searching registration records...
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', mt: 0.4, display: 'block' }}>
                                Checking ticket records and payment proofs on the server...
                            </Typography>
                        </Box>
                    )}

                    {/* Search Error / Not Found State */}
                    {!isSearching && searchError && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.8,
                                borderRadius: '18px',
                                background: 'linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)',
                                border: '1.5px solid #fde68a',
                                borderBottom: '4.5px solid #d97706',
                                boxShadow: '0 6px 18px rgba(217, 119, 6, 0.12)',
                                mb: 2.5,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.8 }}>
                                <Box sx={{ p: 0.8, borderRadius: '10px', bgcolor: 'rgba(217, 119, 6, 0.15)', border: '1px solid #d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <HourglassEmptyIcon sx={{ color: '#b45309', fontSize: 22 }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#92400e', fontSize: '0.95rem' }}>
                                        Registration Record Not Found
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#78350f', fontSize: '0.84rem', mt: 0.5, lineHeight: 1.5, fontWeight: 600 }}>
                                        {searchError}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#92400e', display: 'block', mt: 1.2, fontWeight: 700 }}>
                                        Need direct help? Contact the PIT IAGI organizing committee via WhatsApp:
                                    </Typography>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 1.8 }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            component="a"
                                            href="https://wa.me/628122699923?text=Hello%20PIT%20IAGI%20Committee%2C%20I%20would%20like%20to%20inquire%20about%20my%20registration%20status."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            startIcon={<WhatsAppIcon sx={{ color: '#16a34a' }} />}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 800,
                                                fontSize: '0.82rem',
                                                borderRadius: '12px',
                                                background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
                                                border: '1.5px solid #86efac',
                                                borderBottom: '3px solid #16a34a',
                                                color: '#15803d',
                                                boxShadow: '0 3px 8px rgba(22, 163, 74, 0.12)',
                                                px: 2,
                                                py: 0.8,
                                                transition: 'all 0.15s ease',
                                                '&:hover': { background: 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)', transform: 'translateY(-1px)' },
                                                '&:active': { transform: 'translateY(1px)', borderBottom: '1.5px solid #16a34a' },
                                            }}
                                        >
                                            WhatsApp Registration (Adeline)
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            component="a"
                                            href="https://wa.me/6281325779040?text=Hello%20PIT%20IAGI%20Secretariat%2C%20I%20would%20like%20to%20inquire%20about%20my%20registration%20status."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            startIcon={<WhatsAppIcon sx={{ color: '#16a34a' }} />}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 800,
                                                fontSize: '0.82rem',
                                                borderRadius: '12px',
                                                background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
                                                border: '1.5px solid #86efac',
                                                borderBottom: '3px solid #16a34a',
                                                color: '#15803d',
                                                boxShadow: '0 3px 8px rgba(22, 163, 74, 0.12)',
                                                px: 2,
                                                py: 0.8,
                                                transition: 'all 0.15s ease',
                                                '&:hover': { background: 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)', transform: 'translateY(-1px)' },
                                                '&:active': { transform: 'translateY(1px)', borderBottom: '1.5px solid #16a34a' },
                                            }}
                                        >
                                            WhatsApp Secretariat (Tiyas)
                                        </Button>
                                    </Stack>
                                </Box>
                            </Box>
                        </Paper>
                    )}

                    {/* Search Results List */}
                    {!isSearching && searchResults && searchResults.length > 0 && (
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Chip
                                    label={`Found ${searchResults.length} Registration Record(s)`}
                                    size="small"
                                    sx={{ 
                                        background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)', 
                                        color: '#047857', 
                                        fontWeight: 900, 
                                        border: '1.5px solid #86efac',
                                        borderBottom: '2.5px solid #16a34a',
                                        boxShadow: '0 2px 5px rgba(22, 163, 74, 0.12)',
                                        height: 26,
                                        px: 1,
                                    }}
                                />
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                    Click button to open ticket verification / payment status page
                                </Typography>
                            </Box>

                            <Stack spacing={2.2}>
                                {searchResults.map((item) => {
                                    const isItemPending = item.status === 'pending' || item.payment_status === 'pending';
                                    const isItemActive = item.status === 'active' || item.payment_status === 'verified';
                                    const isItemRejected = item.status === 'rejected' || item.payment_status === 'rejected';

                                    let badgeBg = 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)';
                                    let badgeBorder = '#cbd5e1';
                                    let badgeBottomBorder = '#94a3b8';
                                    let badgeColor = '#475569';
                                    let badgeLabel = item.status?.toUpperCase() || 'UNKNOWN';

                                    if (isItemPending) {
                                        badgeBg = 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)';
                                        badgeBorder = '#f59e0b';
                                        badgeBottomBorder = '#b45309';
                                        badgeColor = '#92400e';
                                        badgeLabel = '⏳ Awaiting Verification';
                                    } else if (isItemActive) {
                                        badgeBg = 'linear-gradient(180deg, #dcfce7 0%, #bbf7d0 100%)';
                                        badgeBorder = '#4ade80';
                                        badgeBottomBorder = '#16a34a';
                                        badgeColor = '#14532d';
                                        badgeLabel = '✓ Verified & Active';
                                    } else if (isItemRejected) {
                                        badgeBg = 'linear-gradient(180deg, #fee2e2 0%, #fecaca 100%)';
                                        badgeBorder = '#f87171';
                                        badgeBottomBorder = '#dc2626';
                                        badgeColor = '#991b1b';
                                        badgeLabel = '✕ Rejected';
                                    } else if (item.status === 'used') {
                                        badgeBg = 'linear-gradient(180deg, #e0e7ff 0%, #c7d2fe 100%)';
                                        badgeBorder = '#818cf8';
                                        badgeBottomBorder = '#4338ca';
                                        badgeColor = '#312e81';
                                        badgeLabel = 'Check-in Done';
                                    }

                                    return (
                                        <Paper
                                            key={item.id}
                                            elevation={0}
                                            sx={{
                                                p: 2.5,
                                                borderRadius: '20px',
                                                border: `1.5px solid ${isItemActive ? '#86efac' : isItemPending ? '#fde68a' : '#cbd5e1'}`,
                                                borderBottom: `4.5px solid ${isItemActive ? '#16a34a' : isItemPending ? '#d97706' : '#94a3b8'}`,
                                                background: isItemActive 
                                                    ? 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)' 
                                                    : isItemPending 
                                                        ? 'linear-gradient(180deg, #ffffff 0%, #fffdf5 100%)' 
                                                        : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                                                boxShadow: isItemActive 
                                                    ? '0 6px 18px rgba(22, 163, 74, 0.1), inset 0 1px 0 #ffffff' 
                                                    : isItemPending 
                                                        ? '0 6px 18px rgba(217, 119, 6, 0.1), inset 0 1px 0 #ffffff' 
                                                        : '0 6px 18px rgba(0,0,0,0.04), inset 0 1px 0 #ffffff',
                                                transition: 'all 0.18s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: isItemActive 
                                                        ? '0 10px 24px rgba(22, 163, 74, 0.18)' 
                                                        : isItemPending 
                                                            ? '0 10px 24px rgba(217, 119, 6, 0.18)' 
                                                            : '0 10px 24px rgba(0,0,0,0.08)',
                                                },
                                            }}
                                        >
                                            <Grid container spacing={2} alignItems="center">
                                                {/* Left Details */}
                                                <Grid item xs={12} md={7}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.8 }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.05rem' }}>
                                                            {item.name}
                                                        </Typography>
                                                        <Chip
                                                            label={item.category_label}
                                                            size="small"
                                                            sx={{
                                                                background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
                                                                color: '#334155',
                                                                fontWeight: 800,
                                                                fontSize: '0.68rem',
                                                                height: 22,
                                                                border: '1px solid #cbd5e1',
                                                                borderBottom: '2.5px solid #94a3b8',
                                                                borderRadius: '8px',
                                                            }}
                                                        />
                                                        <Chip
                                                            label={badgeLabel}
                                                            size="small"
                                                            sx={{
                                                                background: badgeBg,
                                                                color: badgeColor,
                                                                fontWeight: 900,
                                                                fontSize: '0.72rem',
                                                                height: 24,
                                                                border: `1.5px solid ${badgeBorder}`,
                                                                borderBottom: `2.5px solid ${badgeBottomBorder}`,
                                                                borderRadius: '8px',
                                                                boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
                                                            }}
                                                        />
                                                    </Box>

                                                    <Stack spacing={0.5} sx={{ color: '#475569', fontSize: '0.82rem' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                            <EmailOutlinedIcon sx={{ fontSize: 16, color: '#059669' }} />
                                                            <Typography variant="caption" sx={{ color: '#1e293b', fontWeight: 700, fontSize: '0.8rem' }}>
                                                                {item.email}
                                                            </Typography>
                                                        </Box>
                                                        {item.phone && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                                <PhoneIphoneIcon sx={{ fontSize: 16, color: '#0284c7' }} />
                                                                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, fontSize: '0.78rem' }}>
                                                                    {item.phone}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                        {item.institution && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                                <BusinessOutlinedIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                                                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, fontSize: '0.78rem' }}>
                                                                    {item.institution}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Stack>

                                                    {/* Code Box with 3D Pills */}
                                                    <Box sx={{ mt: 1.4, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                        {item.payment_code && (
                                                            <Box
                                                                sx={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: 0.6,
                                                                    px: 1.3,
                                                                    py: 0.4,
                                                                    borderRadius: '10px',
                                                                    background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
                                                                    border: '1px solid #cbd5e1',
                                                                    borderBottom: '2.5px solid #94a3b8',
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                                                                }}
                                                            >
                                                                <Typography variant="caption" sx={{ fontWeight: 900, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.76rem' }}>
                                                                    Payment: {item.payment_code}
                                                                </Typography>
                                                                <Tooltip title={copiedCode === item.payment_code ? 'Copied!' : 'Copy Code'}>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleCopyCode(item.payment_code)}
                                                                        sx={{ p: 0.2, color: copiedCode === item.payment_code ? '#16a34a' : '#64748b' }}
                                                                    >
                                                                        {copiedCode === item.payment_code ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        )}
                                                        <Box
                                                            sx={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: 0.6,
                                                                px: 1.3,
                                                                py: 0.4,
                                                                borderRadius: '10px',
                                                                background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
                                                                border: '1px solid #cbd5e1',
                                                                borderBottom: '2.5px solid #94a3b8',
                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                                                            }}
                                                        >
                                                            <Typography variant="caption" sx={{ fontWeight: 900, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.76rem' }}>
                                                                Ticket: {item.ticket_code}
                                                            </Typography>
                                                            <Tooltip title={copiedCode === item.ticket_code ? 'Copied!' : 'Copy Code'}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleCopyCode(item.ticket_code)}
                                                                    sx={{ p: 0.2, color: copiedCode === item.ticket_code ? '#16a34a' : '#64748b' }}
                                                                >
                                                                    {copiedCode === item.ticket_code ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </Box>
                                                </Grid>

                                                {/* Right Action CTA */}
                                                <Grid item xs={12} md={5}>
                                                    <Stack spacing={1.2} sx={{ alignItems: { xs: 'stretch', md: 'flex-end' } }}>
                                                        {item.has_payment ? (
                                                            <>
                                                                <Button
                                                                    component="a"
                                                                    href={item.status_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    variant="contained"
                                                                    size="small"
                                                                    endIcon={<ArrowForwardIcon sx={{ fontSize: 17 }} />}
                                                                    sx={{
                                                                        background: isItemActive 
                                                                            ? 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)' 
                                                                            : 'linear-gradient(180deg, #059669 0%, #047857 100%)',
                                                                        color: '#fff',
                                                                        fontWeight: 900,
                                                                        fontSize: '0.84rem',
                                                                        textTransform: 'none',
                                                                        borderRadius: '12px',
                                                                        px: 2.4,
                                                                        py: 0.9,
                                                                        border: '1px solid rgba(255,255,255,0.4)',
                                                                        borderBottom: isItemActive ? '3.5px solid #14532d' : '3.5px solid #022c22',
                                                                        boxShadow: isItemActive ? '0 4px 12px rgba(22, 163, 74, 0.35)' : '0 4px 12px rgba(4, 120, 87, 0.35)',
                                                                        width: { xs: '100%', md: 'auto' },
                                                                        transition: 'all 0.15s ease',
                                                                        '&:hover': { 
                                                                            background: isItemActive 
                                                                                ? 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)' 
                                                                                : 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                                                                            transform: 'translateY(-1.5px)',
                                                                            boxShadow: isItemActive ? '0 6px 16px rgba(22, 163, 74, 0.45)' : '0 6px 16px rgba(4, 120, 87, 0.45)',
                                                                        },
                                                                        '&:active': {
                                                                            transform: 'translateY(1px)',
                                                                            borderBottom: isItemActive ? '1.5px solid #14532d' : '1.5px solid #022c22',
                                                                        },
                                                                    }}
                                                                >
                                                                    {isItemPending ? 'Open Payment Status Page' : 'Open Verification Page'}
                                                                </Button>

                                                                {isItemActive && (
                                                                    <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', md: 'auto' } }}>
                                                                        <Button
                                                                            component="a"
                                                                            href={item.ticket_url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            startIcon={<QrCodeIcon sx={{ fontSize: 16 }} />}
                                                                            sx={{
                                                                                color: '#047857',
                                                                                background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
                                                                                border: '1.5px solid #86efac',
                                                                                borderBottom: '3px solid #16a34a',
                                                                                fontWeight: 800,
                                                                                fontSize: '0.8rem',
                                                                                textTransform: 'none',
                                                                                borderRadius: '10px',
                                                                                flex: 1,
                                                                                boxShadow: '0 2px 5px rgba(22, 163, 74, 0.1)',
                                                                                transition: 'all 0.15s ease',
                                                                                '&:hover': { background: 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)', transform: 'translateY(-1px)' },
                                                                                '&:active': { transform: 'translateY(1px)', borderBottom: '1.5px solid #16a34a' },
                                                                            }}
                                                                        >
                                                                            E-Ticket
                                                                        </Button>
                                                                        {item.receipt_url && (
                                                                            <Button
                                                                                component="a"
                                                                                href={item.receipt_url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                startIcon={<ReceiptLongIcon sx={{ fontSize: 16 }} />}
                                                                                sx={{
                                                                                    color: '#334155',
                                                                                    background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
                                                                                    border: '1.5px solid #cbd5e1',
                                                                                    borderBottom: '3px solid #94a3b8',
                                                                                    fontWeight: 800,
                                                                                    fontSize: '0.8rem',
                                                                                    textTransform: 'none',
                                                                                    borderRadius: '10px',
                                                                                    flex: 1,
                                                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                                                                    transition: 'all 0.15s ease',
                                                                                    '&:hover': { background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)', transform: 'translateY(-1px)' },
                                                                                    '&:active': { transform: 'translateY(1px)', borderBottom: '1.5px solid #94a3b8' },
                                                                                }}
                                                                            >
                                                                                Receipt
                                                                            </Button>
                                                                        )}
                                                                    </Stack>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <Button
                                                                component="a"
                                                                href={item.ticket_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                variant="contained"
                                                                size="small"
                                                                endIcon={<ArrowForwardIcon sx={{ fontSize: 17 }} />}
                                                                startIcon={<QrCodeIcon sx={{ fontSize: 17 }} />}
                                                                sx={{
                                                                    background: 'linear-gradient(180deg, #10b981 0%, #059669 50%, #047857 100%)',
                                                                    color: '#fff',
                                                                    fontWeight: 900,
                                                                    fontSize: '0.84rem',
                                                                    textTransform: 'none',
                                                                    borderRadius: '12px',
                                                                    px: 2.4,
                                                                    py: 0.9,
                                                                    border: '1.5px solid #34d399',
                                                                    borderBottom: '3.5px solid #022c22',
                                                                    boxShadow: '0 4px 12px rgba(4, 120, 87, 0.35)',
                                                                    width: { xs: '100%', md: 'auto' },
                                                                    transition: 'all 0.15s ease',
                                                                    '&:hover': { 
                                                                        background: 'linear-gradient(180deg, #34d399 0%, #10b981 50%, #059669 100%)',
                                                                        transform: 'translateY(-1.5px)',
                                                                        boxShadow: '0 6px 16px rgba(4, 120, 87, 0.45)',
                                                                    },
                                                                    '&:active': {
                                                                        transform: 'translateY(1px)',
                                                                        borderBottom: '1.5px solid #022c22',
                                                                    },
                                                                }}
                                                            >
                                                                View Digital E-Ticket
                                                            </Button>
                                                        )}
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    );
                                })}
                            </Stack>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions
                    sx={{
                        p: 2.2,
                        px: 3.5,
                        bgcolor: '#f8fafc',
                        borderTop: '1.5px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                        PIT IAGI-GEOSEA XIX 2026 Ticketing Support
                    </Typography>
                    <Button
                        onClick={() => setCheckStatusOpen(false)}
                        sx={{
                            color: '#334155',
                            background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
                            border: '1.5px solid #cbd5e1',
                            borderBottom: '3px solid #94a3b8',
                            fontWeight: 800,
                            textTransform: 'none',
                            borderRadius: '10px',
                            px: 2.5,
                            py: 0.6,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                            '&:hover': { background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)' },
                            '&:active': { transform: 'translateY(1px)', borderBottom: '1.5px solid #94a3b8' },
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
