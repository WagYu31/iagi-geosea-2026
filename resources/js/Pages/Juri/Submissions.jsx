import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Chip, Button, TextField,
    InputAdornment, Stack, useTheme, Grid, Avatar, IconButton,
    LinearProgress, Divider, Tooltip, Dialog, DialogTitle,
    DialogContent, DialogActions, Tabs, Tab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import MicIcon from '@mui/icons-material/Mic';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import StarIcon from '@mui/icons-material/Star';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import ShieldIcon from '@mui/icons-material/Shield';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PrintIcon from '@mui/icons-material/Print';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import LanguageIcon from '@mui/icons-material/Language';
import CircularProgress from '@mui/material/CircularProgress';
import mammoth from 'mammoth/mammoth.browser.js';

// Helpers for file handling & document previews
const getFileUrl = (filePath) => {
    if (!filePath) return '';
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;
    return `/storage/${filePath.replace(/^\/+/, '')}`;
};

const isPdfFile = (filePath) => {
    if (!filePath) return false;
    return filePath.toLowerCase().endsWith('.pdf');
};

const isImgFile = (filePath) => {
    if (!filePath) return false;
    return /\.(png|jpe?g|webp|gif|svg)$/i.test(filePath);
};

const getCoAuthorsList = (submission) => {
    if (!submission) return [];
    const list = [];
    for (let i = 1; i <= 5; i++) {
        const name = submission[`co_author_${i}`];
        const inst = submission[`co_author_${i}_institute`];
        if (name && name.trim()) {
            list.push({ name: name.trim(), institute: (inst && inst.trim()) || '' });
        }
    }
    if (list.length === 0 && submission.co_authors) {
        return [{ name: submission.co_authors, institute: '' }];
    }
    return list;
};

const getKeywordsList = (submission) => {
    if (!submission?.keywords) return [];
    if (Array.isArray(submission.keywords)) return submission.keywords;
    return String(submission.keywords)
        .split(/[,;]/)
        .map(k => k.trim())
        .filter(Boolean);
};

// ── UNIVERSAL IN-APP DOCUMENT VIEWER COMPONENT ──
// Allows viewing PDF, DOCX, DOC, PPTX, and images directly in-browser without download
function UniversalDocumentViewer({ fileUrl, fileName, rubricType = 'oral', isDark, c }) {
    const [mode, setMode] = useState('auto'); // 'auto', 'mammoth', 'office', 'google'
    const [docxHtml, setDocxHtml] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fontSize, setFontSize] = useState(16);

    const isPdf = isPdfFile(fileUrl);
    const isDocx = Boolean(fileUrl && fileUrl.toLowerCase().endsWith('.docx'));
    const isDoc = Boolean(fileUrl && fileUrl.toLowerCase().endsWith('.doc'));
    const isPpt = Boolean(fileUrl && /\.(pptx?|ppsx?)$/i.test(fileUrl));
    const isImage = isImgFile(fileUrl);
    const isOral = (rubricType || '').toLowerCase() === 'oral';

    // Absolute URL for external cloud viewers (Office Online / Google Docs)
    const absoluteUrl = useMemo(() => {
        if (!fileUrl) return '';
        if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) return fileUrl;
        if (typeof window !== 'undefined') {
            return `${window.location.origin}${fileUrl}`;
        }
        return fileUrl;
    }, [fileUrl]);

    // Parse DOCX with Mammoth directly in browser
    useEffect(() => {
        if (!isDocx || !fileUrl) {
            setDocxHtml('');
            setLoading(false);
            return;
        }

        let isMounted = true;
        setLoading(true);
        setError(null);

        fetch(fileUrl)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to fetch file`);
                return res.arrayBuffer();
            })
            .then(arrayBuffer => {
                return mammoth.convertToHtml({ arrayBuffer });
            })
            .then(result => {
                if (isMounted) {
                    setDocxHtml(result.value || '<p><em>(Empty document)</em></p>');
                    setLoading(false);
                }
            })
            .catch(err => {
                console.warn('Docx client parse failed, switching to cloud viewer fallback:', err);
                if (isMounted) {
                    setError('Local parsing unavailable. Using Online Office viewer.');
                    setMode('office');
                    setLoading(false);
                }
            });

        return () => { isMounted = false; };
    }, [fileUrl, isDocx]);

    // Determine actual active viewer mode
    const activeMode = useMemo(() => {
        if (isPdf) return 'pdf';
        if (isImage) return 'image';
        if (mode === 'office') return 'office';
        if (mode === 'google') return 'google';
        if (mode === 'mammoth') return 'mammoth';
        if (isDocx && docxHtml) return 'mammoth';
        if (isDocx && loading) return 'mammoth';
        if (isDoc || isPpt) return 'office';
        return 'mammoth';
    }, [isPdf, isImage, mode, isDocx, docxHtml, loading, isDoc, isPpt]);

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Action & Control Bar */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1.5,
                p: 1.2,
                borderRadius: '12px',
                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                border: `1px solid ${c.cardBorder}`,
                flexWrap: 'wrap',
                gap: 1,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                    {isPdf ? (
                        <PictureAsPdfIcon sx={{ color: '#dc2626', fontSize: 20, flexShrink: 0 }} />
                    ) : isDocx || isDoc ? (
                        <ArticleIcon sx={{ color: '#2563eb', fontSize: 20, flexShrink: 0 }} />
                    ) : isPpt ? (
                        <CoPresentIcon sx={{ color: '#ea580c', fontSize: 20, flexShrink: 0 }} />
                    ) : (
                        <InsertDriveFileIcon sx={{ color: '#059669', fontSize: 20, flexShrink: 0 }} />
                    )}
                    <Typography variant="body2" sx={{
                        fontWeight: 800,
                        color: c.textPrimary,
                        fontSize: '0.82rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: { xs: 200, sm: 350 },
                    }}>
                        {fileName || fileUrl.split('/').pop()}
                    </Typography>
                </Box>

                {/* Controls depending on file format */}
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    {/* If DOCX or DOC or PPT, allow switching between In-App Reader and Online Office Viewer */}
                    {(isDocx || isDoc || isPpt) && (
                        <Stack direction="row" spacing={0.5} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', p: 0.3, borderRadius: '8px' }}>
                            {isDocx && (
                                <Button
                                    size="small"
                                    onClick={() => setMode('mammoth')}
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: '0.72rem',
                                        fontWeight: activeMode === 'mammoth' ? 800 : 600,
                                        py: 0.3,
                                        px: 1,
                                        borderRadius: '6px',
                                        bgcolor: activeMode === 'mammoth' ? (isDark ? '#059669' : '#ffffff') : 'transparent',
                                        color: activeMode === 'mammoth' ? (isDark ? '#ffffff' : '#059669') : c.textSecondary,
                                        boxShadow: activeMode === 'mammoth' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                    }}
                                >
                                    📄 In-App Reader
                                </Button>
                            )}
                            <Button
                                size="small"
                                onClick={() => setMode('office')}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '0.72rem',
                                    fontWeight: activeMode === 'office' ? 800 : 600,
                                    py: 0.3,
                                    px: 1,
                                    borderRadius: '6px',
                                    bgcolor: activeMode === 'office' ? (isDark ? '#2563eb' : '#ffffff') : 'transparent',
                                    color: activeMode === 'office' ? (isDark ? '#ffffff' : '#2563eb') : c.textSecondary,
                                    boxShadow: activeMode === 'office' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                }}
                            >
                                🌐 Office Online
                            </Button>
                            <Button
                                size="small"
                                onClick={() => setMode('google')}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '0.72rem',
                                    fontWeight: activeMode === 'google' ? 800 : 600,
                                    py: 0.3,
                                    px: 1,
                                    borderRadius: '6px',
                                    bgcolor: activeMode === 'google' ? (isDark ? '#d97706' : '#ffffff') : 'transparent',
                                    color: activeMode === 'google' ? (isDark ? '#ffffff' : '#d97706') : c.textSecondary,
                                    boxShadow: activeMode === 'google' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                }}
                            >
                                Google Docs
                            </Button>
                        </Stack>
                    )}

                    {/* Font Size Controls when in Mammoth Reader Mode */}
                    {activeMode === 'mammoth' && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Tooltip title="Decrease font size" arrow>
                                <IconButton
                                    size="small"
                                    onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                                    sx={{ p: 0.4, border: `1px solid ${c.cardBorder}`, borderRadius: '6px' }}
                                >
                                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 800 }}>A-</Typography>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Increase font size" arrow>
                                <IconButton
                                    size="small"
                                    onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
                                    sx={{ p: 0.4, border: `1px solid ${c.cardBorder}`, borderRadius: '6px' }}
                                >
                                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 800 }}>A+</Typography>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Reset font size" arrow>
                                <IconButton
                                    size="small"
                                    onClick={() => setFontSize(16)}
                                    sx={{ p: 0.4, border: `1px solid ${c.cardBorder}`, borderRadius: '6px' }}
                                >
                                    <RestartAltIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    )}

                    {/* Direct Download & Open in Tab buttons */}
                    <Button
                        component="a"
                        href={fileUrl}
                        download
                        target="_blank"
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon sx={{ fontSize: 13 }} />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: '8px',
                            borderColor: c.cardBorder,
                            color: c.textSecondary,
                            fontSize: '0.72rem',
                            py: 0.4,
                            px: 1,
                        }}
                    >
                        Download
                    </Button>
                    <Button
                        component="a"
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="text"
                        size="small"
                        endIcon={<OpenInNewIcon sx={{ fontSize: 13 }} />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            color: c.textSecondary,
                            fontSize: '0.72rem',
                            py: 0.4,
                            px: 1,
                        }}
                    >
                        Open Tab
                    </Button>
                </Stack>
            </Box>

            {/* Viewer Display Body */}
            {activeMode === 'pdf' && (
                <Box sx={{
                    flex: 1,
                    minHeight: '68vh',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: `1px solid ${c.cardBorder}`,
                    bgcolor: isDark ? '#111827' : '#f1f5f9',
                }}>
                    <iframe
                        src={`${fileUrl}#toolbar=1`}
                        title="PDF Document Viewer"
                        width="100%"
                        height="100%"
                        style={{ border: 'none', minHeight: '68vh', display: 'block' }}
                    />
                </Box>
            )}

            {activeMode === 'mammoth' && (
                <Box sx={{
                    flex: 1,
                    minHeight: '68vh',
                    maxHeight: '72vh',
                    overflowY: 'auto',
                    borderRadius: '12px',
                    border: `1px solid ${c.cardBorder}`,
                    bgcolor: isDark ? '#0b1324' : '#f1f5f9',
                    p: { xs: 1.5, sm: 3 },
                }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '45vh', gap: 2 }}>
                            <CircularProgress size={36} sx={{ color: '#059669' }} />
                            <Typography variant="body2" sx={{ color: c.textSecondary, fontWeight: 700 }}>
                                Preparing and formatting manuscript for in-browser reading...
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{
                            maxWidth: 880,
                            mx: 'auto',
                            bgcolor: '#ffffff',
                            color: '#1e293b',
                            p: { xs: 2.5, sm: 4.5, md: 6 },
                            borderRadius: '16px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
                            fontSize: `${fontSize}px`,
                            lineHeight: 1.85,
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                            '& h1': {
                                fontSize: '1.75em',
                                fontWeight: 800,
                                mt: 2,
                                mb: 1,
                                color: '#0f172a',
                                borderBottom: '2px solid #e2e8f0',
                                pb: 0.5,
                            },
                            '& h2': {
                                fontSize: '1.38em',
                                fontWeight: 800,
                                mt: 2,
                                mb: 0.8,
                                color: '#0f172a',
                            },
                            '& h3': {
                                fontSize: '1.18em',
                                fontWeight: 700,
                                mt: 1.8,
                                mb: 0.6,
                                color: '#1e293b',
                            },
                            '& p': {
                                mb: 1.4,
                                textAlign: 'justify',
                            },
                            '& table': {
                                width: '100%',
                                borderCollapse: 'collapse',
                                my: 2.5,
                                fontSize: '0.9em',
                            },
                            '& th, & td': {
                                border: '1px solid #cbd5e1',
                                p: 1.2,
                                textAlign: 'left',
                            },
                            '& th': {
                                bgcolor: '#f8fafc',
                                fontWeight: 800,
                                color: '#0f172a',
                            },
                            '& img': {
                                maxWidth: '100%',
                                height: 'auto',
                                display: 'block',
                                my: 2,
                                mx: 'auto',
                                borderRadius: '8px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                            },
                            '& ul, & ol': {
                                pl: 3,
                                mb: 1.5,
                            },
                            '& blockquote': {
                                borderLeft: '4px solid #059669',
                                pl: 2,
                                ml: 0,
                                color: '#475569',
                                fontStyle: 'italic',
                                my: 1.5,
                            },
                        }}>
                            <div dangerouslySetInnerHTML={{ __html: docxHtml }} />
                        </Box>
                    )}
                </Box>
            )}

            {activeMode === 'office' && (
                <Box sx={{
                    flex: 1,
                    minHeight: '68vh',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: `1px solid ${c.cardBorder}`,
                    bgcolor: isDark ? '#111827' : '#f1f5f9',
                    position: 'relative',
                }}>
                    <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteUrl)}`}
                        title="Microsoft Office Online Viewer"
                        width="100%"
                        height="100%"
                        style={{ border: 'none', minHeight: '68vh', display: 'block' }}
                    />
                </Box>
            )}

            {activeMode === 'google' && (
                <Box sx={{
                    flex: 1,
                    minHeight: '68vh',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: `1px solid ${c.cardBorder}`,
                    bgcolor: isDark ? '#111827' : '#f1f5f9',
                    position: 'relative',
                }}>
                    <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`}
                        title="Google Docs Viewer"
                        width="100%"
                        height="100%"
                        style={{ border: 'none', minHeight: '68vh', display: 'block' }}
                    />
                </Box>
            )}

            {activeMode === 'image' && (
                <Box sx={{
                    flex: 1,
                    minHeight: '68vh',
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: isDark ? '#000000' : '#f8fafc',
                    border: `1px solid ${c.cardBorder}`,
                    textAlign: 'center',
                    overflow: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Box
                        component="img"
                        src={fileUrl}
                        alt="Poster Layout"
                        sx={{
                            maxWidth: '100%',
                            maxHeight: '70vh',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}

export default function JuriSubmissions({ scores = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, scored, oral, poster


    // Modal state for previewing abstract & presentation files
    const [previewModal, setPreviewModal] = useState({
        open: false,
        activeTab: 'abstract', // 'abstract', 'paper', 'slides'
        submission: null,
        rubricType: 'oral',
    });

    const openPreview = (tab, submission, rubricType = 'oral') => {
        // Fallback tab if requested tab has no content
        let initialTab = tab;
        if (tab === 'paper' && !submission.full_paper_file) {
            initialTab = submission.abstract || submission.abstract_file ? 'abstract' : 'slides';
        } else if (tab === 'slides' && !submission.layouting_file) {
            initialTab = submission.abstract || submission.abstract_file ? 'abstract' : 'paper';
        }

        setPreviewModal({
            open: true,
            activeTab: initialTab,
            submission,
            rubricType,
        });
    };

    const closePreview = () => {
        setPreviewModal(prev => ({ ...prev, open: false }));
    };

    // Derived statistics
    const totalCount = scores.length;
    const scoredCount = scores.filter(s => s.weighted_final_score !== null && s.weighted_final_score !== undefined).length;
    const pendingCount = totalCount - scoredCount;
    const oralCount = scores.filter(s => (s.rubric_type || '').toLowerCase() === 'oral').length;
    const posterCount = scores.filter(s => (s.rubric_type || '').toLowerCase() === 'poster').length;

    const completionRate = totalCount > 0 ? (scoredCount / totalCount) * 100 : 0;

    // Average Score
    const averageScore = useMemo(() => {
        const scored = scores.filter(s => s.weighted_final_score !== null);
        if (scored.length === 0) return null;
        const sum = scored.reduce((acc, curr) => acc + parseFloat(curr.weighted_final_score || 0), 0);
        return (sum / scored.length).toFixed(2);
    }, [scores]);

    // Interpretation Helper
    const getInterpretation = (score) => {
        const val = parseFloat(score);
        if (isNaN(val)) return null;
        if (val >= 9.0) return { label: 'Exceptional (Top 5%)', color: '#059669', bg: isDark ? 'rgba(5, 150, 105, 0.15)' : '#ecfdf5', border: '#a7f3d0' };
        if (val >= 7.0) return { label: 'Good / Strong', color: '#2563eb', bg: isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff', border: '#bfdbfe' };
        if (val >= 5.0) return { label: 'Acceptable', color: '#d97706', bg: isDark ? 'rgba(217, 119, 6, 0.15)' : '#fffbeb', border: '#fde68a' };
        return { label: 'Below Standard', color: '#dc2626', bg: isDark ? 'rgba(220, 38, 38, 0.15)' : '#fef2f2', border: '#fecaca' };
    };

    // Filter Logic
    const filteredScores = useMemo(() => {
        return scores.filter((score) => {
            const isScored = score.weighted_final_score !== null && score.weighted_final_score !== undefined;
            const rubric = (score.rubric_type || '').toLowerCase();
            const title = (score.submission?.title || '').toLowerCase();
            const author = (score.submission?.user?.name || score.submission?.author_full_name || '').toLowerCase();
            const code = (score.submission?.submission_code || `id-${score.submission_id}`).toLowerCase();
            const affiliation = (score.submission?.institute_organization || score.submission?.affiliation || '').toLowerCase();

            // Tab Filter
            if (filter === 'pending' && isScored) return false;
            if (filter === 'scored' && !isScored) return false;
            if (filter === 'oral' && rubric !== 'oral') return false;
            if (filter === 'poster' && rubric !== 'poster') return false;

            // Search Filter
            if (search.trim()) {
                const q = search.toLowerCase();
                return title.includes(q) || author.includes(q) || code.includes(q) || affiliation.includes(q);
            }

            return true;
        });
    }, [scores, filter, search]);

    return (
        <SidebarLayout>
            <Head title="Assigned Presentations • 55th PIT IAGI & GEOSEA 2026" />

            <Box sx={{
                p: { xs: 1.5, sm: 2.5, md: 4 },
                minHeight: '100vh',
                bgcolor: c.surfaceBg,
                maxWidth: '1600px',
                mx: 'auto',
            }}>
                {/* ── HERO BANNER: 21st.dev Style Header ── */}
                <Box sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: { xs: '20px', sm: '24px' },
                    p: { xs: 2.2, sm: 3, md: 4 },
                    mb: { xs: 2, sm: 3 },
                    background: isDark
                        ? 'linear-gradient(135deg, #052e25 0%, #031c17 50%, #02120e 100%)'
                        : 'linear-gradient(135deg, #094d42 0%, #063830 50%, #03241f 100%)',
                    color: '#ffffff',
                    boxShadow: '0 20px 45px -15px rgba(4, 41, 35, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                }}>
                    {/* Ambient Glow Circles */}
                    <Box sx={{
                        position: 'absolute',
                        top: -60,
                        right: -60,
                        width: 240,
                        height: 240,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        {/* Live Status Badge */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.8, mb: { xs: 1, sm: 1.5 } }}>
                            <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.8,
                                px: { xs: 1.2, sm: 1.5 },
                                py: 0.35,
                                borderRadius: '20px',
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                fontSize: { xs: '0.64rem', sm: '0.72rem' },
                                fontWeight: 800,
                                letterSpacing: '0.04em',
                                color: '#a7f3d0',
                                textTransform: 'uppercase',
                            }}>
                                <Box sx={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: '50%',
                                    bgcolor: '#10b981',
                                    boxShadow: '0 0 8px #10b981',
                                }} />
                                Scientific Evaluation Portal
                            </Box>
                            <Box sx={{
                                px: { xs: 1, sm: 1.2 },
                                py: 0.35,
                                borderRadius: '20px',
                                bgcolor: 'rgba(217, 119, 6, 0.2)',
                                border: '1px solid rgba(245, 158, 11, 0.35)',
                                fontSize: { xs: '0.64rem', sm: '0.7rem' },
                                fontWeight: 800,
                                color: '#fde68a',
                                letterSpacing: '0.04em',
                            }}>
                                55th PIT IAGI & GEOSEA XIX 2026
                            </Box>
                        </Box>

                        {/* Title */}
                        <Typography variant="h3" sx={{
                            fontWeight: 900,
                            letterSpacing: '-0.03em',
                            fontSize: { xs: '1.35rem', sm: '1.9rem', md: '2.35rem' },
                            lineHeight: 1.2,
                            color: '#ffffff',
                            mb: { xs: 0.6, sm: 1 },
                        }}>
                            Assigned Presentations ⚖️
                        </Typography>

                        {/* Subtitle - visible on desktop, concise on mobile */}
                        <Typography variant="body1" sx={{
                            color: 'rgba(255, 255, 255, 0.82)',
                            fontSize: { xs: '0.78rem', sm: '0.92rem' },
                            lineHeight: 1.45,
                            mb: { xs: 1.5, sm: 2.5 },
                            maxWidth: 700,
                            display: { xs: 'none', sm: 'block' },
                        }}>
                            Review, evaluate, and submit rubric scores for your assigned scientific presentations. All evaluations are cryptographically secured and confidential.
                        </Typography>

                        {/* Metric Highlights in Hero (Compact on mobile) */}
                        <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }} sx={{ maxWidth: 850 }}>
                            {[
                                { label: 'Total Assigned', val: totalCount, sub: `${oralCount} Oral • ${posterCount} Poster`, color: '#67e8f9' },
                                { label: 'Scored & Finalized', val: scoredCount, sub: averageScore ? `Avg Score: ${averageScore}/10` : 'None scored yet', color: '#6ee7b7' },
                                { label: 'Awaiting Evaluation', val: pendingCount, sub: pendingCount === 0 ? 'All caught up! 🎉' : 'Action required', color: '#fde047' },
                                { label: 'Completion Rate', val: `${Math.round(completionRate)}%`, sub: `${scoredCount}/${totalCount} completed`, color: '#c4b5fd' },
                            ].map((m, idx) => (
                                <Grid size={{ xs: 6, sm: 3 }} key={idx}>
                                    <Box sx={{
                                        p: { xs: 1.1, sm: 1.5 },
                                        borderRadius: { xs: '12px', sm: '14px' },
                                        bgcolor: 'rgba(0, 0, 0, 0.25)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                    }}>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', fontSize: { xs: '0.58rem', sm: '0.68rem' }, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                                            {m.label}
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 900, color: m.color, fontSize: { xs: '1.25rem', sm: '1.45rem' }, mt: 0.1, fontFamily: 'monospace', lineHeight: 1.1 }}>
                                            {m.val}
                                        </Typography>
                                        <Typography variant="caption" sx={{
                                            color: 'rgba(255,255,255,0.65)',
                                            fontSize: { xs: '0.62rem', sm: '0.7rem' },
                                            display: 'block',
                                            mt: 0.2,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {m.sub}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>

                {/* ── SEARCH & FILTER CONTROLS (21st.dev Style) ── */}
                <Card elevation={0} sx={{
                    borderRadius: { xs: '16px', sm: '20px' },
                    border: `1.5px solid ${c.cardBorder}`,
                    bgcolor: c.cardBg,
                    p: { xs: 1.5, sm: 2.2 },
                    mb: { xs: 2, sm: 3 },
                    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.02)',
                }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
                        {/* Live Search */}
                        <TextField
                            placeholder="Search title, author, institution, code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="small"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: c.textSecondary, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: search ? (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearch('')}>
                                            <ClearIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null,
                                sx: {
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                                }
                            }}
                            sx={{ minWidth: { md: 360 }, flex: { md: 1 } }}
                        />

                        {/* Filter Tabs with Smooth Touch Momentum Scrolling */}
                        <Stack
                            direction="row"
                            spacing={0.8}
                            sx={{
                                overflowX: 'auto',
                                WebkitOverflowScrolling: 'touch',
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': { display: 'none' },
                                pb: { xs: 0.5, md: 0 },
                                width: { xs: '100%', md: 'auto' },
                                flexShrink: 0,
                            }}
                        >
                            {[
                                { key: 'all', label: `All (${totalCount})` },
                                { key: 'pending', label: `Pending (${pendingCount})` },
                                { key: 'scored', label: `Scored (${scoredCount})` },
                                { key: 'oral', label: `Oral (${oralCount})` },
                                { key: 'poster', label: `Poster (${posterCount})` },
                            ].map((tab) => {
                                const active = filter === tab.key;
                                return (
                                    <Button
                                        key={tab.key}
                                        size="small"
                                        onClick={() => setFilter(tab.key)}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: '10px',
                                            fontSize: '0.78rem',
                                            fontWeight: active ? 800 : 600,
                                            px: { xs: 1.5, sm: 1.8 },
                                            py: 0.7,
                                            minWidth: 'fit-content',
                                            flexShrink: 0,
                                            bgcolor: active
                                                ? (isDark ? '#059669' : '#094d42')
                                                : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
                                            color: active ? '#ffffff' : c.textSecondary,
                                            '&:hover': {
                                                bgcolor: active
                                                    ? (isDark ? '#047857' : '#063830')
                                                    : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
                                            },
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {tab.label}
                                    </Button>
                                );
                            })}
                        </Stack>
                    </Stack>
                </Card>

                {/* ── PRESENTATIONS GRID (Bento Card Layout) ── */}
                {filteredScores.length === 0 ? (
                    <Card elevation={0} sx={{
                        borderRadius: '20px',
                        border: `1.5px dashed ${c.cardBorder}`,
                        bgcolor: c.cardBg,
                        p: { xs: 4, sm: 8 },
                        textAlign: 'center',
                    }}>
                        <GavelIcon sx={{ fontSize: 56, color: c.textSecondary, opacity: 0.3, mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary, mb: 0.5 }}>
                            No Presentations Found
                        </Typography>
                        <Typography variant="body2" sx={{ color: c.textSecondary, maxWidth: 450, mx: 'auto', mb: 2.5 }}>
                            {search
                                ? `No presentations match your search query "${search}". Try searching with different keywords.`
                                : `There are currently no presentations matching the selected filter.`}
                        </Typography>
                        {(search || filter !== 'all') && (
                            <Button
                                variant="outlined"
                                onClick={() => { setSearch(''); setFilter('all'); }}
                                sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: 700 }}
                            >
                                Reset Search & Filters
                            </Button>
                        )}
                    </Card>
                ) : (
                    <Grid container spacing={2.5}>
                        {filteredScores.map((score) => {
                            const sub = score.submission || {};
                            const isScored = score.weighted_final_score !== null && score.weighted_final_score !== undefined;
                            const isOral = (score.rubric_type || '').toLowerCase() === 'oral';
                            const tier = isScored ? getInterpretation(score.weighted_final_score) : null;
                            const presenterName = sub.author_full_name || sub.user?.name || 'Author Not Provided';
                            const institution = sub.institute_organization || sub.affiliation || 'Academic / Institution';
                            const paperCode = sub.submission_code || `SUB-${score.submission_id}`;
                            const subTheme = sub.paper_sub_theme || sub.topic || 'General Geology';

                            return (
                                <Grid size={{ xs: 12, md: 6, lg: 6 }} key={score.id}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: '20px',
                                            border: `1.5px solid ${isScored ? (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0') : (isDark ? 'rgba(245, 158, 11, 0.4)' : '#fde68a')}`,
                                            bgcolor: c.cardBg,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: isScored
                                                ? (isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 18px rgba(0,0,0,0.02)')
                                                : (isDark ? '0 4px 20px rgba(245, 158, 11, 0.1)' : '0 4px 18px rgba(245, 158, 11, 0.05)'),
                                            '&:hover': {
                                                borderColor: isOral ? '#0284c7' : '#9333ea',
                                                transform: 'translateY(-3px)',
                                                boxShadow: isDark
                                                    ? '0 12px 30px rgba(0,0,0,0.4)'
                                                    : '0 12px 28px rgba(0,0,0,0.06)',
                                            },
                                        }}
                                    >
                                        {/* Top Accent Strip */}
                                        <Box sx={{
                                            height: 4,
                                            background: isOral
                                                ? 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)'
                                                : 'linear-gradient(90deg, #9333ea 0%, #c084fc 100%)',
                                        }} />

                                        <CardContent sx={{ p: { xs: 1.8, sm: 2.5 }, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Box>
                                                {/* Category + Code + Status */}
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
                                                    <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap">
                                                        <Chip
                                                            icon={isOral ? <MicIcon sx={{ fontSize: '13px !important' }} /> : <WallpaperIcon sx={{ fontSize: '13px !important' }} />}
                                                            label={isOral ? 'ORAL' : 'POSTER'}
                                                            size="small"
                                                            sx={{
                                                                height: 22,
                                                                fontSize: '0.66rem',
                                                                fontWeight: 800,
                                                                letterSpacing: '0.04em',
                                                                borderRadius: '6px',
                                                                bgcolor: isOral
                                                                    ? (isDark ? 'rgba(2, 132, 199, 0.18)' : '#e0f2fe')
                                                                    : (isDark ? 'rgba(147, 51, 234, 0.18)' : '#f3e8ff'),
                                                                color: isOral ? '#0284c7' : '#9333ea',
                                                                border: `1px solid ${isOral ? '#7dd3fc' : '#d8b4fe'}`,
                                                            }}
                                                        />

                                                        <Chip
                                                            label={paperCode}
                                                            size="small"
                                                            sx={{
                                                                height: 22,
                                                                fontSize: '0.66rem',
                                                                fontFamily: 'monospace',
                                                                fontWeight: 800,
                                                                borderRadius: '6px',
                                                                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                                                color: c.textSecondary,
                                                            }}
                                                        />

                                                        {subTheme && (
                                                            <Chip
                                                                label={subTheme}
                                                                size="small"
                                                                sx={{
                                                                    height: 22,
                                                                    fontSize: '0.66rem',
                                                                    fontWeight: 600,
                                                                    borderRadius: '6px',
                                                                    bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                                                    color: c.textSecondary,
                                                                    maxWidth: { xs: 150, sm: 180 },
                                                                    '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
                                                                }}
                                                            />
                                                        )}
                                                    </Stack>

                                                    {/* Status Badge */}
                                                    {isScored ? (
                                                        <Box sx={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                            px: 1,
                                                            py: 0.3,
                                                            borderRadius: '6px',
                                                            bgcolor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
                                                            color: '#059669',
                                                            border: '1px solid #a7f3d0',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 800,
                                                        }}>
                                                            <TaskAltIcon sx={{ fontSize: 13 }} />
                                                            SCORED
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                            px: 1,
                                                            py: 0.3,
                                                            borderRadius: '6px',
                                                            bgcolor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb',
                                                            color: '#d97706',
                                                            border: '1px solid #fde68a',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 800,
                                                        }}>
                                                            <HourglassEmptyRoundedIcon sx={{ fontSize: 12 }} />
                                                            PENDING
                                                        </Box>
                                                    )}
                                                </Box>

                                                {/* Title */}
                                                <Typography
                                                    component={Link}
                                                    href={route('juri.submissions.view', score.submission_id)}
                                                    variant="h6"
                                                    sx={{
                                                        fontSize: { xs: '0.94rem', sm: '1.08rem' },
                                                        fontWeight: 800,
                                                        color: c.textPrimary,
                                                        lineHeight: 1.35,
                                                        letterSpacing: '-0.015em',
                                                        mb: { xs: 1.2, sm: 2 },
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textDecoration: 'none',
                                                        minHeight: 'auto',
                                                        '&:hover': {
                                                            color: '#059669',
                                                            textDecoration: 'underline',
                                                        },
                                                    }}
                                                >
                                                    {sub.title || 'Untitled Scientific Presentation'}
                                                </Typography>

                                                {/* Author & Affiliation Details */}
                                                <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: { xs: 1.5, sm: 2.2 } }}>
                                                    <Avatar sx={{
                                                        width: { xs: 32, sm: 38 },
                                                        height: { xs: 32, sm: 38 },
                                                        bgcolor: isOral ? '#0284c7' : '#9333ea',
                                                        color: '#ffffff',
                                                        fontSize: { xs: '0.78rem', sm: '0.85rem' },
                                                        fontWeight: 800,
                                                    }}>
                                                        {presenterName.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                                        <Typography variant="body2" sx={{
                                                            fontWeight: 700,
                                                            color: c.textPrimary,
                                                            fontSize: '0.84rem',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}>
                                                            {presenterName}
                                                         </Typography>
                                                         <Typography variant="caption" sx={{
                                                             color: c.textSecondary,
                                                             fontSize: '0.72rem',
                                                             display: 'flex',
                                                             alignItems: 'center',
                                                             gap: 0.5,
                                                             overflow: 'hidden',
                                                             textOverflow: 'ellipsis',
                                                             whiteSpace: 'nowrap',
                                                         }}>
                                                             <SchoolIcon sx={{ fontSize: 13, flexShrink: 0 }} />
                                                             {institution}
                                                         </Typography>
                                                     </Box>
                                                 </Stack>

                                                 {/* ── PRESENTATION FILES & MANUSCRIPT ACCESS ── */}
                                                 {(() => {
                                                     const hasAbstract = Boolean(sub.abstract || sub.abstract_file);
                                                     const hasFullPaper = Boolean(sub.full_paper_file);
                                                     const hasSlidesOrPoster = Boolean(sub.layouting_file);
                                                     const hasEditorFeedback = Boolean(sub.editor_feedback_file);
                                                     const hasAnyFiles = hasAbstract || hasFullPaper || hasSlidesOrPoster || hasEditorFeedback;
                                                     const fileCount = [hasAbstract, hasFullPaper, hasSlidesOrPoster, hasEditorFeedback].filter(Boolean).length;

                                                     return (
                                                         <Box sx={{
                                                             mt: 0.5,
                                                             mb: 1.2,
                                                             p: { xs: 1.2, sm: 1.4 },
                                                             borderRadius: '14px',
                                                             bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                                                             border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : '#e2e8f0'}`,
                                                         }}>
                                                             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                                 <Typography variant="caption" sx={{
                                                                     color: c.textSecondary,
                                                                     fontSize: '0.66rem',
                                                                     fontWeight: 800,
                                                                     textTransform: 'uppercase',
                                                                     letterSpacing: '0.04em',
                                                                     display: 'flex',
                                                                     alignItems: 'center',
                                                                     gap: 0.6,
                                                                 }}>
                                                                     <DescriptionIcon sx={{ fontSize: 13, color: isOral ? '#0284c7' : '#9333ea' }} />
                                                                     Presentation Assets & Manuscript
                                                                 </Typography>

                                                                 {hasAnyFiles && (
                                                                     <Chip
                                                                         label={`${fileCount} Asset${fileCount > 1 ? 's' : ''}`}
                                                                         size="small"
                                                                         sx={{
                                                                             height: 18,
                                                                             fontSize: '0.58rem',
                                                                             fontWeight: 800,
                                                                             letterSpacing: '0.03em',
                                                                             textTransform: 'uppercase',
                                                                             bgcolor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
                                                                             color: '#059669',
                                                                             border: '1px solid rgba(16, 185, 129, 0.3)',
                                                                         }}
                                                                     />
                                                                 )}
                                                             </Box>

                                                             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                                                 {/* 1. Abstract Button */}
                                                                 {hasAbstract && (
                                                                     <Box sx={{
                                                                         display: 'inline-flex',
                                                                         alignItems: 'center',
                                                                         borderRadius: '8px',
                                                                         border: '1px solid',
                                                                         borderColor: isDark ? 'rgba(5, 150, 105, 0.4)' : '#a7f3d0',
                                                                         bgcolor: isDark ? 'rgba(5, 150, 105, 0.12)' : '#ecfdf5',
                                                                         overflow: 'hidden',
                                                                         transition: 'all 0.2s ease',
                                                                         '&:hover': {
                                                                             borderColor: '#059669',
                                                                             transform: 'translateY(-1px)',
                                                                             boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)',
                                                                         },
                                                                     }}>
                                                                         <Button
                                                                             size="small"
                                                                             onClick={() => openPreview('abstract', sub, score.rubric_type)}
                                                                             startIcon={<MenuBookIcon sx={{ fontSize: '14px !important', color: '#059669' }} />}
                                                                             sx={{
                                                                                 textTransform: 'none',
                                                                                 fontSize: '0.72rem',
                                                                                 fontWeight: 700,
                                                                                 color: '#059669',
                                                                                 py: 0.35,
                                                                                 px: 1,
                                                                                 minWidth: 0,
                                                                             }}
                                                                         >
                                                                             Abstract
                                                                         </Button>
                                                                         {sub.abstract_file && (
                                                                             <Tooltip title="Download Abstract File" arrow>
                                                                                 <IconButton
                                                                                     component="a"
                                                                                     href={getFileUrl(sub.abstract_file)}
                                                                                     download
                                                                                     target="_blank"
                                                                                     size="small"
                                                                                     sx={{
                                                                                         p: 0.4,
                                                                                         color: '#059669',
                                                                                         borderLeft: '1px solid',
                                                                                         borderColor: isDark ? 'rgba(5, 150, 105, 0.3)' : '#a7f3d0',
                                                                                         borderRadius: 0,
                                                                                         '&:hover': { bgcolor: 'rgba(5, 150, 105, 0.2)' },
                                                                                     }}
                                                                                 >
                                                                                     <DownloadIcon sx={{ fontSize: 13 }} />
                                                                                 </IconButton>
                                                                             </Tooltip>
                                                                         )}
                                                                     </Box>
                                                                 )}

                                                                 {/* 2. Full Paper PDF Button */}
                                                                 {hasFullPaper && (
                                                                     <Box sx={{
                                                                         display: 'inline-flex',
                                                                         alignItems: 'center',
                                                                         borderRadius: '8px',
                                                                         border: '1px solid',
                                                                         borderColor: isDark ? 'rgba(239, 68, 68, 0.4)' : '#fecaca',
                                                                         bgcolor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2',
                                                                         overflow: 'hidden',
                                                                         transition: 'all 0.2s ease',
                                                                         '&:hover': {
                                                                             borderColor: '#dc2626',
                                                                             transform: 'translateY(-1px)',
                                                                             boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)',
                                                                         },
                                                                     }}>
                                                                         <Button
                                                                             size="small"
                                                                             onClick={() => openPreview('paper', sub, score.rubric_type)}
                                                                             startIcon={<PictureAsPdfIcon sx={{ fontSize: '14px !important', color: '#dc2626' }} />}
                                                                             sx={{
                                                                                 textTransform: 'none',
                                                                                 fontSize: '0.72rem',
                                                                                 fontWeight: 700,
                                                                                 color: '#dc2626',
                                                                                 py: 0.35,
                                                                                 px: 1,
                                                                                 minWidth: 0,
                                                                             }}
                                                                         >
                                                                             Full Paper
                                                                         </Button>
                                                                         <Tooltip title="Download Full Paper" arrow>
                                                                             <IconButton
                                                                                 component="a"
                                                                                 href={getFileUrl(sub.full_paper_file)}
                                                                                 download
                                                                                 target="_blank"
                                                                                 size="small"
                                                                                 sx={{
                                                                                     p: 0.4,
                                                                                     color: '#dc2626',
                                                                                     borderLeft: '1px solid',
                                                                                     borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca',
                                                                                     borderRadius: 0,
                                                                                     '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' },
                                                                                 }}
                                                                             >
                                                                                 <DownloadIcon sx={{ fontSize: 13 }} />
                                                                             </IconButton>
                                                                         </Tooltip>
                                                                     </Box>
                                                                 )}

                                                                 {/* 3. Slide or Poster File Button */}
                                                                 {hasSlidesOrPoster && (
                                                                     <Box sx={{
                                                                         display: 'inline-flex',
                                                                         alignItems: 'center',
                                                                         borderRadius: '8px',
                                                                         border: '1px solid',
                                                                         borderColor: isOral
                                                                             ? (isDark ? 'rgba(2, 132, 199, 0.4)' : '#bae6fd')
                                                                             : (isDark ? 'rgba(147, 51, 234, 0.4)' : '#e9d5ff'),
                                                                         bgcolor: isOral
                                                                             ? (isDark ? 'rgba(2, 132, 199, 0.12)' : '#f0f9ff')
                                                                             : (isDark ? 'rgba(147, 51, 234, 0.12)' : '#faf5ff'),
                                                                         overflow: 'hidden',
                                                                         transition: 'all 0.2s ease',
                                                                         '&:hover': {
                                                                             borderColor: isOral ? '#0284c7' : '#9333ea',
                                                                             transform: 'translateY(-1px)',
                                                                             boxShadow: isOral ? '0 2px 8px rgba(2, 132, 199, 0.2)' : '0 2px 8px rgba(147, 51, 234, 0.2)',
                                                                         },
                                                                     }}>
                                                                         <Button
                                                                             size="small"
                                                                             onClick={() => openPreview('slides', sub, score.rubric_type)}
                                                                             startIcon={isOral ? <CoPresentIcon sx={{ fontSize: '14px !important', color: '#0284c7' }} /> : <WallpaperIcon sx={{ fontSize: '14px !important', color: '#9333ea' }} />}
                                                                             sx={{
                                                                                 textTransform: 'none',
                                                                                 fontSize: '0.72rem',
                                                                                 fontWeight: 700,
                                                                                 color: isOral ? '#0284c7' : '#9333ea',
                                                                                 py: 0.35,
                                                                                 px: 1,
                                                                                 minWidth: 0,
                                                                             }}
                                                                         >
                                                                             {isOral ? 'Slides' : 'Poster'}
                                                                         </Button>
                                                                         <Tooltip title={`Download ${isOral ? 'Presentation Slides' : 'Poster File'}`} arrow>
                                                                             <IconButton
                                                                                 component="a"
                                                                                 href={getFileUrl(sub.layouting_file)}
                                                                                 download
                                                                                 target="_blank"
                                                                                 size="small"
                                                                                 sx={{
                                                                                     p: 0.4,
                                                                                     color: isOral ? '#0284c7' : '#9333ea',
                                                                                     borderLeft: '1px solid',
                                                                                     borderColor: isOral
                                                                                         ? (isDark ? 'rgba(2, 132, 199, 0.3)' : '#bae6fd')
                                                                                         : (isDark ? 'rgba(147, 51, 234, 0.3)' : '#e9d5ff'),
                                                                                     borderRadius: 0,
                                                                                     '&:hover': {
                                                                                         bgcolor: isOral ? 'rgba(2, 132, 199, 0.2)' : 'rgba(147, 51, 234, 0.2)',
                                                                                     },
                                                                                 }}
                                                                             >
                                                                                 <DownloadIcon sx={{ fontSize: 13 }} />
                                                                             </IconButton>
                                                                         </Tooltip>
                                                                     </Box>
                                                                 )}

                                                                 {/* 4. Editor Feedback (if any) */}
                                                                 {hasEditorFeedback && (
                                                                     <Box sx={{
                                                                         display: 'inline-flex',
                                                                         alignItems: 'center',
                                                                         borderRadius: '8px',
                                                                         border: '1px solid',
                                                                         borderColor: isDark ? 'rgba(234, 88, 12, 0.4)' : '#fed7aa',
                                                                         bgcolor: isDark ? 'rgba(234, 88, 12, 0.12)' : '#fff7ed',
                                                                         overflow: 'hidden',
                                                                         transition: 'all 0.2s ease',
                                                                         '&:hover': { borderColor: '#ea580c', transform: 'translateY(-1px)' },
                                                                     }}>
                                                                         <Button
                                                                             size="small"
                                                                             component="a"
                                                                             href={getFileUrl(sub.editor_feedback_file)}
                                                                             target="_blank"
                                                                             download
                                                                             startIcon={<RateReviewIcon sx={{ fontSize: '14px !important', color: '#ea580c' }} />}
                                                                             sx={{
                                                                                 textTransform: 'none',
                                                                                 fontSize: '0.72rem',
                                                                                 fontWeight: 700,
                                                                                 color: '#ea580c',
                                                                                 py: 0.35,
                                                                                 px: 1,
                                                                                 minWidth: 0,
                                                                             }}
                                                                         >
                                                                             Editor Notes
                                                                         </Button>
                                                                     </Box>
                                                                 )}

                                                                 {/* Fallback if no files uploaded */}
                                                                 {!hasAnyFiles && (
                                                                     <Typography variant="caption" sx={{
                                                                         color: c.textSecondary,
                                                                         fontSize: '0.72rem',
                                                                         fontStyle: 'italic',
                                                                         display: 'flex',
                                                                         alignItems: 'center',
                                                                         gap: 0.6,
                                                                         py: 0.3,
                                                                     }}>
                                                                         <InfoOutlinedIcon sx={{ fontSize: 14, opacity: 0.6 }} />
                                                                         No presentation files uploaded by author yet.
                                                                     </Typography>
                                                                 )}
                                                             </Box>
                                                         </Box>
                                                     );
                                                 })()}
                                             </Box>

                                             <Divider sx={{ my: 1.5, opacity: 0.6 }} />

                                            {/* Bottom Score & Action Bar */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                pt: 0.5,
                                            }}>
                                                {/* Left: Score readout */}
                                                <Box>
                                                    {isScored ? (
                                                        <Box>
                                                            <Typography variant="caption" sx={{
                                                                color: c.textSecondary,
                                                                fontSize: '0.68rem',
                                                                fontWeight: 700,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.04em',
                                                                display: 'block',
                                                            }}>
                                                                Final Score
                                                            </Typography>
                                                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.2 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                                                    <StarIcon sx={{ color: '#d97706', fontSize: 18 }} />
                                                                    <Typography variant="h6" sx={{
                                                                        fontWeight: 900,
                                                                        color: '#d97706',
                                                                        fontSize: '1.25rem',
                                                                        lineHeight: 1,
                                                                        fontFamily: 'monospace',
                                                                    }}>
                                                                        {parseFloat(score.weighted_final_score).toFixed(2)}
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.72rem' }}>
                                                                        /10
                                                                    </Typography>
                                                                </Box>

                                                                {tier && (
                                                                    <Chip
                                                                        label={tier.label}
                                                                        size="small"
                                                                        sx={{
                                                                            height: 20,
                                                                            fontSize: '0.65rem',
                                                                            fontWeight: 800,
                                                                            bgcolor: tier.bg,
                                                                            color: tier.color,
                                                                            border: `1px solid ${tier.border}`,
                                                                            borderRadius: '6px',
                                                                        }}
                                                                    />
                                                                )}
                                                            </Stack>
                                                        </Box>
                                                    ) : (
                                                        <Box>
                                                            <Typography variant="caption" sx={{
                                                                color: c.textSecondary,
                                                                fontSize: '0.68rem',
                                                                fontWeight: 700,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.04em',
                                                                display: 'block',
                                                            }}>
                                                                Evaluation
                                                            </Typography>
                                                            <Typography variant="body2" sx={{
                                                                fontWeight: 700,
                                                                color: '#d97706',
                                                                fontSize: '0.84rem',
                                                                mt: 0.2,
                                                            }}>
                                                                Awaiting Evaluation
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>

                                                {/* Right: Action Button */}
                                                <Button
                                                    component={Link}
                                                    href={route('juri.submissions.view', score.submission_id)}
                                                    variant={isScored ? 'outlined' : 'contained'}
                                                    size="small"
                                                    startIcon={isScored ? <EditIcon sx={{ fontSize: 14 }} /> : undefined}
                                                    endIcon={!isScored ? <ArrowForwardIcon sx={{ fontSize: 14 }} /> : undefined}
                                                    sx={{
                                                        textTransform: 'none',
                                                        fontWeight: 800,
                                                        borderRadius: '10px',
                                                        px: 2,
                                                        py: 0.8,
                                                        fontSize: '0.8rem',
                                                        ...(isScored ? {
                                                            borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1',
                                                            color: c.textPrimary,
                                                            '&:hover': {
                                                                borderColor: '#059669',
                                                                color: '#059669',
                                                                bgcolor: isDark ? 'rgba(5, 150, 105, 0.1)' : '#f0fdf4',
                                                            }
                                                        } : {
                                                            background: 'linear-gradient(135deg, #094d42 0%, #059669 100%)',
                                                            color: '#ffffff',
                                                            boxShadow: '0 4px 14px rgba(9, 77, 66, 0.3)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, #063830 0%, #047857 100%)',
                                                                transform: 'translateY(-1px)',
                                                                boxShadow: '0 6px 18px rgba(9, 77, 66, 0.4)',
                                                            },
                                                        }),
                                                    }}
                                                >
                                                    {isScored ? 'Edit Evaluation' : 'Evaluate Now'}
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}

                {/* ── IN-APP DOCUMENT & ABSTRACT VIEWER MODAL ── */}
                <Dialog
                    open={previewModal.open}
                    onClose={closePreview}
                    maxWidth="lg"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '20px',
                            bgcolor: c.cardBg,
                            border: `1.5px solid ${c.cardBorder}`,
                            boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(0,0,0,0.15)',
                            overflow: 'hidden',
                            maxHeight: '92vh',
                            display: 'flex',
                            flexDirection: 'column',
                        }
                    }}
                >
                    {previewModal.submission && (() => {
                        const mSub = previewModal.submission;
                        const isModalOral = (previewModal.rubricType || '').toLowerCase() === 'oral';
                        const mPresenter = mSub.author_full_name || mSub.user?.name || 'Author';
                        const mCode = mSub.submission_code || `SUB-${mSub.id}`;
                        const mAffiliation = mSub.institute_organization || mSub.affiliation || 'Academic / Institution';
                        const mKeywords = getKeywordsList(mSub);
                        const mCoAuthors = getCoAuthorsList(mSub);
                        const hasAbstractContent = Boolean(mSub.abstract || mSub.abstract_file);
                        const hasPaperContent = Boolean(mSub.full_paper_file);
                        const hasSlidesContent = Boolean(mSub.layouting_file);

                        return (
                            <>
                                {/* Dialog Header */}
                                <DialogTitle sx={{
                                    p: { xs: 2, sm: 2.8 },
                                    pb: { xs: 1.5, sm: 2 },
                                    borderBottom: `1px solid ${c.cardBorder}`,
                                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            {/* Badges */}
                                            <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
                                                <Chip
                                                    icon={isModalOral ? <MicIcon sx={{ fontSize: '13px !important' }} /> : <WallpaperIcon sx={{ fontSize: '13px !important' }} />}
                                                    label={isModalOral ? 'ORAL PRESENTATION' : 'POSTER PRESENTATION'}
                                                    size="small"
                                                    sx={{
                                                        height: 22,
                                                        fontSize: '0.66rem',
                                                        fontWeight: 800,
                                                        letterSpacing: '0.04em',
                                                        borderRadius: '6px',
                                                        bgcolor: isModalOral
                                                            ? (isDark ? 'rgba(2, 132, 199, 0.18)' : '#e0f2fe')
                                                            : (isDark ? 'rgba(147, 51, 234, 0.18)' : '#f3e8ff'),
                                                        color: isModalOral ? '#0284c7' : '#9333ea',
                                                        border: `1px solid ${isModalOral ? '#7dd3fc' : '#d8b4fe'}`,
                                                    }}
                                                />
                                                <Chip
                                                    label={mCode}
                                                    size="small"
                                                    sx={{
                                                        height: 22,
                                                        fontSize: '0.66rem',
                                                        fontFamily: 'monospace',
                                                        fontWeight: 800,
                                                        borderRadius: '6px',
                                                        bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                                        color: c.textSecondary,
                                                    }}
                                                />
                                                {mSub.paper_sub_theme && (
                                                    <Chip
                                                        label={mSub.paper_sub_theme}
                                                        size="small"
                                                        sx={{
                                                            height: 22,
                                                            fontSize: '0.66rem',
                                                            fontWeight: 600,
                                                            borderRadius: '6px',
                                                            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                                            color: c.textSecondary,
                                                        }}
                                                    />
                                                )}
                                            </Stack>

                                            {/* Presentation Title */}
                                            <Typography variant="h6" sx={{
                                                fontSize: { xs: '1.05rem', sm: '1.25rem' },
                                                fontWeight: 800,
                                                color: c.textPrimary,
                                                lineHeight: 1.35,
                                                letterSpacing: '-0.015em',
                                                mb: 0.8,
                                            }}>
                                                {mSub.title || 'Untitled Scientific Presentation'}
                                            </Typography>

                                            {/* Presenter & Affiliation */}
                                            <Typography variant="body2" sx={{ color: c.textSecondary, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box component="span" sx={{ fontWeight: 700, color: c.textPrimary }}>{mPresenter}</Box>
                                                <span>•</span>
                                                <Box component="span">{mAffiliation}</Box>
                                            </Typography>
                                        </Box>

                                        {/* Close Button */}
                                        <IconButton
                                            onClick={closePreview}
                                            size="small"
                                            sx={{
                                                color: c.textSecondary,
                                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0',
                                                borderRadius: '10px',
                                                '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1' },
                                            }}
                                        >
                                            <CloseIcon sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Box>

                                    {/* Multi-Tab Navigation */}
                                    <Tabs
                                        value={previewModal.activeTab}
                                        onChange={(e, newTab) => setPreviewModal(prev => ({ ...prev, activeTab: newTab }))}
                                        sx={{
                                            mt: 2,
                                            minHeight: 38,
                                            '& .MuiTab-root': {
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                fontSize: '0.82rem',
                                                minHeight: 38,
                                                py: 0.8,
                                                px: { xs: 1.5, sm: 2.2 },
                                                borderRadius: '10px 10px 0 0',
                                                mr: 1,
                                                color: c.textSecondary,
                                                '&.Mui-selected': {
                                                    color: isDark ? '#34d399' : '#059669',
                                                },
                                            },
                                            '& .MuiTabs-indicator': {
                                                backgroundColor: isDark ? '#34d399' : '#059669',
                                                height: 3,
                                                borderRadius: '3px 3px 0 0',
                                            }
                                        }}
                                    >
                                        <Tab
                                            value="abstract"
                                            label="Scientific Abstract"
                                            icon={<MenuBookIcon sx={{ fontSize: 17 }} />}
                                            iconPosition="start"
                                        />
                                        {hasPaperContent && (
                                            <Tab
                                                value="paper"
                                                label="Full Paper Manuscript"
                                                icon={<PictureAsPdfIcon sx={{ fontSize: 17 }} />}
                                                iconPosition="start"
                                            />
                                        )}
                                        {hasSlidesContent && (
                                            <Tab
                                                value="slides"
                                                label={isModalOral ? 'Presentation Slides' : 'Poster Layout'}
                                                icon={isModalOral ? <CoPresentIcon sx={{ fontSize: 17 }} /> : <WallpaperIcon sx={{ fontSize: 17 }} />}
                                                iconPosition="start"
                                            />
                                        )}
                                    </Tabs>
                                </DialogTitle>

                                {/* Dialog Body */}
                                <DialogContent sx={{ p: { xs: 1.8, sm: 3 }, flex: 1, overflowY: 'auto' }}>
                                    {/* ── TAB 1: ABSTRACT READER ── */}
                                    {previewModal.activeTab === 'abstract' && (
                                        <Box sx={{ maxWidth: 900, mx: 'auto', py: 1 }}>
                                            {/* Sub-theme and Co-authors Banner */}
                                            <Box sx={{
                                                p: 2,
                                                mb: 2.5,
                                                borderRadius: '14px',
                                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                                border: `1px solid ${c.cardBorder}`,
                                            }}>
                                                <Grid container spacing={2}>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.66rem', display: 'block', mb: 0.3 }}>
                                                            Scientific Theme / Category
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '0.85rem' }}>
                                                            {mSub.paper_sub_theme || mSub.topic || 'General Geosciences'}
                                                        </Typography>
                                                        {mSub.paper_theme && (
                                                            <Typography variant="caption" sx={{ color: c.textSecondary, display: 'block', mt: 0.2 }}>
                                                                {mSub.paper_theme}
                                                            </Typography>
                                                        )}
                                                    </Grid>

                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.66rem', display: 'block', mb: 0.3 }}>
                                                            Primary Author & Affiliation
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '0.85rem' }}>
                                                            {mPresenter}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: c.textSecondary, display: 'block', mt: 0.2 }}>
                                                            {mAffiliation}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>

                                                {/* Co-Authors List if any */}
                                                {mCoAuthors.length > 0 && (
                                                    <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${c.cardBorder}` }}>
                                                        <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.64rem', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.8 }}>
                                                            <GroupIcon sx={{ fontSize: 13 }} />
                                                            Contributing Co-Authors:
                                                        </Typography>
                                                        <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap sx={{ gap: 0.8 }}>
                                                            {mCoAuthors.map((ca, idx) => (
                                                                <Chip
                                                                    key={idx}
                                                                    label={ca.institute ? `${ca.name} (${ca.institute})` : ca.name}
                                                                    size="small"
                                                                    sx={{
                                                                        fontSize: '0.7rem',
                                                                        fontWeight: 600,
                                                                        borderRadius: '6px',
                                                                        bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff',
                                                                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                                                                    }}
                                                                />
                                                            ))}
                                                        </Stack>
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Abstract Text Section */}
                                            <Box sx={{ mb: 3 }}>
                                                <Typography variant="subtitle2" sx={{
                                                    fontWeight: 800,
                                                    color: c.textPrimary,
                                                    fontSize: '0.92rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.04em',
                                                    mb: 1.5,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.8,
                                                }}>
                                                    <MenuBookIcon sx={{ fontSize: 18, color: '#059669' }} />
                                                    Abstract
                                                </Typography>

                                                {mSub.abstract ? (
                                                    <Box sx={{
                                                        p: { xs: 2, sm: 2.8 },
                                                        borderRadius: '16px',
                                                        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
                                                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                                                        lineHeight: 1.85,
                                                        fontSize: { xs: '0.88rem', sm: '0.94rem' },
                                                        color: c.textPrimary,
                                                        whiteSpace: 'pre-wrap',
                                                        textAlign: 'justify',
                                                        fontFamily: 'inherit',
                                                    }}>
                                                        {mSub.abstract}
                                                    </Box>
                                                ) : (
                                                    <Box sx={{
                                                        p: 3,
                                                        textAlign: 'center',
                                                        borderRadius: '16px',
                                                        border: `1.5px dashed ${c.cardBorder}`,
                                                        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                                    }}>
                                                        <Typography variant="body2" sx={{ color: c.textSecondary, fontStyle: 'italic' }}>
                                                            No plain-text abstract entered. Please refer to the attached Abstract document or Full Paper.
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Keywords Section */}
                                            {mKeywords.length > 0 && (
                                                <Box sx={{ mb: 3 }}>
                                                    <Typography variant="caption" sx={{
                                                        color: c.textSecondary,
                                                        fontWeight: 800,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.04em',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.6,
                                                        mb: 1,
                                                    }}>
                                                        <LocalOfferIcon sx={{ fontSize: 13, color: '#059669' }} />
                                                        Keywords
                                                    </Typography>
                                                    <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap sx={{ gap: 0.8 }}>
                                                        {mKeywords.map((kw, i) => (
                                                            <Chip
                                                                key={i}
                                                                label={kw}
                                                                size="small"
                                                                sx={{
                                                                    fontSize: '0.72rem',
                                                                    fontWeight: 700,
                                                                    borderRadius: '8px',
                                                                    bgcolor: isDark ? 'rgba(5, 150, 105, 0.15)' : '#ecfdf5',
                                                                    color: '#059669',
                                                                    border: '1px solid rgba(5, 150, 105, 0.3)',
                                                                }}
                                                            />
                                                        ))}
                                                    </Stack>
                                                </Box>
                                            )}

                                            {/* If original abstract document uploaded, offer download */}
                                            {mSub.abstract_file && (
                                                <Box sx={{
                                                    p: 1.8,
                                                    borderRadius: '14px',
                                                    border: `1px solid ${isDark ? 'rgba(5, 150, 105, 0.3)' : '#a7f3d0'}`,
                                                    bgcolor: isDark ? 'rgba(5, 150, 105, 0.08)' : '#f0fdf4',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    flexWrap: 'wrap',
                                                    gap: 1.5,
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <InsertDriveFileIcon sx={{ color: '#059669', fontSize: 20 }} />
                                                        <Box>
                                                            <Typography variant="body2" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '0.82rem' }}>
                                                                Original Abstract Document
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.7rem' }}>
                                                                {mSub.abstract_file.split('/').pop()}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Stack direction="row" spacing={1}>
                                                        <Button
                                                            component="a"
                                                            href={getFileUrl(mSub.abstract_file)}
                                                            download
                                                            target="_blank"
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
                                                            sx={{
                                                                textTransform: 'none',
                                                                fontWeight: 700,
                                                                borderRadius: '8px',
                                                                borderColor: '#059669',
                                                                color: '#059669',
                                                                fontSize: '0.75rem',
                                                            }}
                                                        >
                                                            Download Abstract File
                                                        </Button>
                                                        <Button
                                                            component="a"
                                                            href={getFileUrl(mSub.abstract_file)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            variant="text"
                                                            size="small"
                                                            endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                                                            sx={{
                                                                textTransform: 'none',
                                                                fontWeight: 700,
                                                                color: c.textSecondary,
                                                                fontSize: '0.75rem',
                                                            }}
                                                        >
                                                            Open File
                                                        </Button>
                                                    </Stack>
                                                </Box>
                                            )}
                                        </Box>
                                    )}

                                    {/* ── TAB 2: FULL PAPER MANUSCRIPT VIEWER ── */}
                                    {previewModal.activeTab === 'paper' && mSub.full_paper_file && (
                                        <UniversalDocumentViewer
                                            fileUrl={getFileUrl(mSub.full_paper_file)}
                                            fileName={mSub.full_paper_file.split('/').pop()}
                                            rubricType={previewModal.rubricType}
                                            isDark={isDark}
                                            c={c}
                                        />
                                    )}

                                    {/* ── TAB 3: SLIDES / POSTER VIEWER ── */}
                                    {previewModal.activeTab === 'slides' && mSub.layouting_file && (
                                        <UniversalDocumentViewer
                                            fileUrl={getFileUrl(mSub.layouting_file)}
                                            fileName={mSub.layouting_file.split('/').pop()}
                                            rubricType={previewModal.rubricType}
                                            isDark={isDark}
                                            c={c}
                                        />
                                    )}

                                </DialogContent>

                                {/* Dialog Footer */}
                                <DialogActions sx={{
                                    p: { xs: 1.5, sm: 2 },
                                    borderTop: `1px solid ${c.cardBorder}`,
                                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                    justifyContent: 'space-between',
                                }}>
                                    <Button
                                        onClick={closePreview}
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            borderRadius: '10px',
                                            borderColor: c.cardBorder,
                                            color: c.textSecondary,
                                            px: 2,
                                        }}
                                    >
                                        Close
                                    </Button>

                                    <Button
                                        component={Link}
                                        href={route('juri.submissions.view', mSub.id)}
                                        variant="contained"
                                        size="small"
                                        endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 800,
                                            borderRadius: '10px',
                                            px: 2.5,
                                            py: 0.8,
                                            fontSize: '0.82rem',
                                            background: 'linear-gradient(135deg, #094d42 0%, #059669 100%)',
                                            color: '#ffffff',
                                            boxShadow: '0 4px 14px rgba(9, 77, 66, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #063830 0%, #047857 100%)',
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 6px 18px rgba(9, 77, 66, 0.4)',
                                            },
                                        }}
                                    >
                                        Proceed to Evaluation
                                    </Button>
                                </DialogActions>
                            </>
                        );
                    })()}
                </Dialog>
            </Box>
        </SidebarLayout>
    );
}
