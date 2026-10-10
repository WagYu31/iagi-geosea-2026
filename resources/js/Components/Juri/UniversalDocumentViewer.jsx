import React, { useState, useMemo, useEffect } from 'react';
import {
    Box, Typography, Button, Stack, useTheme, Chip, IconButton,
    Tooltip, LinearProgress, Divider,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';

// Error Boundary to prevent any viewer rendering issue from breaking the entire page
export class ModalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error("Document Viewer Error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="error" gutterBottom sx={{ fontWeight: 800 }}>
                        Terjadi kendala saat memuat preview dokumen
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {String(this.state.error?.message || 'Unknown error')}
                    </Typography>
                    <Button variant="outlined" size="small" onClick={() => this.setState({ hasError: false })}>
                        Coba Lagi
                    </Button>
                </Box>
            );
        }
        return this.props.children;
    }
}

// Helpers for file handling & document previews
export const getFileUrl = (filePath) => {
    if (!filePath) return '';
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;
    return `/storage/${filePath.replace(/^\/+/, '')}`;
};

export const isPdfFile = (filePath) => {
    if (!filePath) return false;
    return filePath.toLowerCase().endsWith('.pdf');
};

export const isImgFile = (filePath) => {
    if (!filePath) return false;
    return /\.(png|jpe?g|webp|gif|svg)$/i.test(filePath);
};

export const getCoAuthorsList = (submission) => {
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

export const getKeywordsList = (submission) => {
    if (!submission?.keywords) return [];
    if (Array.isArray(submission.keywords)) return submission.keywords;
    return String(submission.keywords)
        .split(/[,;]/)
        .map(k => k.trim())
        .filter(Boolean);
};

/**
 * Universal In-App Document Viewer
 * Direct in-browser viewing for PDF, Word (.docx/.doc), PowerPoint (.pptx), & Images
 */
export default function UniversalDocumentViewer({
    fileUrl,
    fileName,
    rubricType = 'oral',
    docTitle = 'Document Preview',
    isFullscreen = false,
    heightOverride = null,
}) {
    const theme = useTheme();
    const c = theme.palette.custom || {};
    const isDark = theme.palette.mode === 'dark';
    const [viewerType, setViewerType] = useState('office'); // 'office' | 'google'
    const [iframeLoading, setIframeLoading] = useState(true);
    const [reloadKey, setReloadKey] = useState(0);

    const isPdf = isPdfFile(fileUrl);
    const isDocx = Boolean(fileUrl && String(fileUrl).toLowerCase().endsWith('.docx'));
    const isDoc = Boolean(fileUrl && String(fileUrl).toLowerCase().endsWith('.doc'));
    const isPpt = Boolean(fileUrl && /\.(pptx?|ppsx?)$/i.test(String(fileUrl)));
    const isImage = isImgFile(fileUrl);
    const isOfficeDoc = isDocx || isDoc || isPpt;

    const safeFileName = fileName || (fileUrl ? String(fileUrl).split('/').pop() : 'Document');

    // Format badge and styling
    const formatInfo = useMemo(() => {
        if (isPdf) return { label: 'PDF Document', ext: 'PDF', color: '#dc2626', bg: isDark ? 'rgba(220, 38, 38, 0.15)' : '#fef2f2', border: isDark ? 'rgba(220, 38, 38, 0.3)' : '#fca5a5' };
        if (isDocx) return { label: 'Word Document', ext: 'DOCX', color: '#2563eb', bg: isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff', border: isDark ? 'rgba(37, 99, 235, 0.3)' : '#93c5fd' };
        if (isDoc) return { label: 'Word Document', ext: 'DOC', color: '#2563eb', bg: isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff', border: isDark ? 'rgba(37, 99, 235, 0.3)' : '#93c5fd' };
        if (isPpt) return { label: 'Slides Presentation', ext: 'PPTX', color: '#ea580c', bg: isDark ? 'rgba(234, 88, 12, 0.15)' : '#fff7ed', border: isDark ? 'rgba(234, 88, 12, 0.3)' : '#fdba74' };
        if (isImage) return { label: 'Graphic Poster', ext: 'IMG', color: '#059669', bg: isDark ? 'rgba(5, 150, 105, 0.15)' : '#ecfdf5', border: isDark ? 'rgba(5, 150, 105, 0.3)' : '#86efac' };
        return { label: 'Document', ext: 'FILE', color: '#64748b', bg: isDark ? 'rgba(100, 116, 139, 0.15)' : '#f8fafc', border: isDark ? 'rgba(100, 116, 139, 0.3)' : '#cbd5e1' };
    }, [isPdf, isDocx, isDoc, isPpt, isImage, isDark]);

    // Absolute URL for external cloud viewers (Office Online / Google Docs)
    const absoluteUrl = useMemo(() => {
        if (!fileUrl) return '';
        if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) return fileUrl;
        if (typeof window !== 'undefined') {
            return `${window.location.origin}${fileUrl}`;
        }
        return fileUrl;
    }, [fileUrl]);

    // Reset loading state when viewer mode, file, or reloadKey changes
    useEffect(() => {
        setIframeLoading(true);
    }, [fileUrl, viewerType, reloadKey]);

    const handleReload = () => {
        setIframeLoading(true);
        setReloadKey(prev => prev + 1);
    };

    const computedMinHeight = heightOverride || (isFullscreen ? 'calc(100vh - 240px)' : '68vh');
    const computedHeight = heightOverride || (isFullscreen ? 'calc(100vh - 240px)' : '72vh');

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Action & Control Bar */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1.5,
                p: { xs: 1, sm: 1.2 },
                borderRadius: '14px',
                background: isDark
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)'
                    : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                border: `1px solid ${c.cardBorder || '#e2e8f0'}`,
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.04)',
                flexWrap: 'wrap',
                gap: 1.2,
            }}>
                {/* Left: Document Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                    <Box sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '9px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: formatInfo.bg,
                        border: `1px solid ${formatInfo.border}`,
                        color: formatInfo.color,
                        flexShrink: 0,
                    }}>
                        {isPdf ? (
                            <PictureAsPdfIcon sx={{ fontSize: 18 }} />
                        ) : isDocx || isDoc ? (
                            <ArticleIcon sx={{ fontSize: 18 }} />
                        ) : isPpt ? (
                            <CoPresentIcon sx={{ fontSize: 18 }} />
                        ) : isImage ? (
                            <WallpaperIcon sx={{ fontSize: 18 }} />
                        ) : (
                            <InsertDriveFileIcon sx={{ fontSize: 18 }} />
                        )}
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{
                                fontWeight: 800,
                                color: c.textPrimary,
                                fontSize: '0.82rem',
                                lineHeight: 1.2,
                            }}>
                                {docTitle}
                            </Typography>
                            <Chip
                                label={formatInfo.ext}
                                size="small"
                                sx={{
                                    height: 18,
                                    fontSize: '0.6rem',
                                    fontWeight: 800,
                                    borderRadius: '5px',
                                    bgcolor: formatInfo.bg,
                                    color: formatInfo.color,
                                    border: `1px solid ${formatInfo.border}`,
                                }}
                            />
                        </Box>
                        <Tooltip title={safeFileName} arrow>
                            <Typography variant="caption" sx={{
                                color: c.textSecondary,
                                fontSize: '0.7rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block',
                                maxWidth: { xs: 160, sm: 240, md: 320 },
                                mt: 0.1,
                            }}>
                                {safeFileName}
                            </Typography>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Right: Controls & Actions */}
                <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap">
                    {/* Switcher for Office/Word/PPT */}
                    {isOfficeDoc && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: '2px',
                            borderRadius: '9px',
                            bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#cbd5e1'}`,
                            gap: '2px',
                        }}>
                            <Tooltip title="Tampilan Word/PowerPoint resmi dengan format halaman akurat" arrow>
                                <Button
                                    size="small"
                                    onClick={() => setViewerType('office')}
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: '0.7rem',
                                        fontWeight: viewerType === 'office' ? 800 : 600,
                                        py: 0.25,
                                        px: 1,
                                        borderRadius: '6px',
                                        bgcolor: viewerType === 'office' ? (isDark ? '#2563eb' : '#ffffff') : 'transparent',
                                        color: viewerType === 'office' ? (isDark ? '#ffffff' : '#1e40af') : c.textSecondary,
                                        boxShadow: viewerType === 'office' ? '0 2px 6px rgba(0,0,0,0.12)' : 'none',
                                    }}
                                >
                                    🌐 Office
                                </Button>
                            </Tooltip>
                            <Tooltip title="Alternatif cepat jika Office Online lambat memuat" arrow>
                                <Button
                                    size="small"
                                    onClick={() => setViewerType('google')}
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: '0.7rem',
                                        fontWeight: viewerType === 'google' ? 800 : 600,
                                        py: 0.25,
                                        px: 1,
                                        borderRadius: '6px',
                                        bgcolor: viewerType === 'google' ? (isDark ? '#d97706' : '#ffffff') : 'transparent',
                                        color: viewerType === 'google' ? (isDark ? '#ffffff' : '#b45309') : c.textSecondary,
                                        boxShadow: viewerType === 'google' ? '0 2px 6px rgba(0,0,0,0.12)' : 'none',
                                    }}
                                >
                                    📑 Google
                                </Button>
                            </Tooltip>
                        </Box>
                    )}

                    {/* Reload Button */}
                    <Tooltip title="Muat ulang dokumen" arrow>
                        <IconButton
                            size="small"
                            onClick={handleReload}
                            sx={{
                                border: `1px solid ${c.cardBorder || '#e2e8f0'}`,
                                borderRadius: '8px',
                                p: 0.5,
                                color: c.textSecondary,
                                '&:hover': {
                                    bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                                    color: c.textPrimary,
                                }
                            }}
                        >
                            <RefreshIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                    </Tooltip>

                    {/* Open in Tab */}
                    <Tooltip title="Buka berkas di tab browser terpisah" arrow>
                        <Button
                            component="a"
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outlined"
                            size="small"
                            endIcon={<OpenInNewIcon sx={{ fontSize: 12 }} />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: '8px',
                                borderColor: c.cardBorder,
                                color: c.textSecondary,
                                fontSize: '0.72rem',
                                py: 0.35,
                                px: 1,
                                '&:hover': {
                                    borderColor: '#059669',
                                    color: '#059669',
                                    bgcolor: isDark ? 'rgba(5, 150, 105, 0.1)' : '#f0fdf4',
                                }
                            }}
                        >
                            Tab Baru
                        </Button>
                    </Tooltip>

                    {/* Download */}
                    <Tooltip title="Unduh file dokumen asli" arrow>
                        <Button
                            component="a"
                            href={fileUrl}
                            download
                            target="_blank"
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadIcon sx={{ fontSize: 12 }} />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: '8px',
                                borderColor: c.cardBorder,
                                color: c.textSecondary,
                                fontSize: '0.72rem',
                                py: 0.35,
                                px: 1,
                                '&:hover': {
                                    borderColor: '#0284c7',
                                    color: '#0284c7',
                                    bgcolor: isDark ? 'rgba(2, 132, 199, 0.1)' : '#f0f9ff',
                                }
                            }}
                        >
                            Unduh
                        </Button>
                    </Tooltip>
                </Stack>
            </Box>

            {/* Viewer Display Body */}
            {isPdf && (
                <Box sx={{
                    flex: 1,
                    minHeight: computedMinHeight,
                    height: computedHeight,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: `1.5px solid ${c.cardBorder || '#e2e8f0'}`,
                    boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 8px 30px rgba(0,0,0,0.06)',
                    bgcolor: isDark ? '#111827' : '#f1f5f9',
                }}>
                    <iframe
                        key={`pdf-${reloadKey}`}
                        src={`${fileUrl}#toolbar=1`}
                        title="PDF Document Viewer"
                        width="100%"
                        height="100%"
                        style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
                    />
                </Box>
            )}

            {isImage && (
                <Box sx={{
                    flex: 1,
                    minHeight: computedMinHeight,
                    height: computedHeight,
                    p: 2,
                    borderRadius: '16px',
                    bgcolor: isDark ? '#090d16' : '#f8fafc',
                    border: `1.5px solid ${c.cardBorder || '#e2e8f0'}`,
                    textAlign: 'center',
                    overflow: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Box
                        component="img"
                        src={fileUrl}
                        alt="Poster / File Preview"
                        sx={{
                            maxWidth: '100%',
                            maxHeight: isFullscreen ? 'calc(100vh - 260px)' : '66vh',
                            objectFit: 'contain',
                            borderRadius: '10px',
                            boxShadow: '0 12px 35px rgba(0,0,0,0.2)',
                        }}
                    />
                </Box>
            )}

            {isOfficeDoc && (
                <Box sx={{
                    flex: 1,
                    minHeight: computedMinHeight,
                    height: computedHeight,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: `1.5px solid ${c.cardBorder || '#e2e8f0'}`,
                    boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 8px 30px rgba(0,0,0,0.06)',
                    bgcolor: isDark ? '#1e293b' : '#334155',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {iframeLoading && (
                        <Box sx={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.92)',
                            backdropFilter: 'blur(8px)',
                            gap: 1.5,
                            p: 3,
                            textAlign: 'center',
                        }}>
                            <Box sx={{
                                width: 50,
                                height: 50,
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: formatInfo.bg,
                                border: `2px solid ${formatInfo.border}`,
                                color: formatInfo.color,
                                mb: 1,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                            }}>
                                {isDocx || isDoc ? <ArticleIcon sx={{ fontSize: 26 }} /> : <CoPresentIcon sx={{ fontSize: 26 }} />}
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 800, color: c.textPrimary }}>
                                Memuat dokumen {isDocx ? 'Word (.docx)' : isPpt ? 'PowerPoint (.pptx)' : ''} di layar...
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textSecondary, maxWidth: 420, lineHeight: 1.5 }}>
                                Menghubungkan ke <strong>{viewerType === 'office' ? 'Microsoft Office Online' : 'Google Docs Viewer'}</strong> agar dokumen dapat dibaca langsung oleh Juri tanpa perlu diunduh.
                            </Typography>
                            <Box sx={{ width: 200, my: 0.5 }}>
                                <LinearProgress sx={{
                                    borderRadius: '4px',
                                    height: 5,
                                    bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: viewerType === 'office' ? '#2563eb' : '#d97706',
                                    }
                                }} />
                            </Box>
                            <Button
                                size="small"
                                variant="text"
                                onClick={() => setViewerType(prev => prev === 'office' ? 'google' : 'office')}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '0.72rem',
                                    color: c.textSecondary,
                                    '&:hover': { color: c.textPrimary },
                                }}
                            >
                                Ganti ke {viewerType === 'office' ? 'Google Docs Viewer' : 'Microsoft Office Viewer'}
                            </Button>
                        </Box>
                    )}

                    <iframe
                        key={`${viewerType}-${reloadKey}`}
                        src={viewerType === 'office'
                            ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteUrl)}`
                            : `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`
                        }
                        title="Office Online Viewer"
                        width="100%"
                        height="100%"
                        onLoad={() => setIframeLoading(false)}
                        style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
                    />
                </Box>
            )}

            {!isPdf && !isImage && !isOfficeDoc && (
                <Box sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: '16px',
                    border: `1.5px dashed ${c.cardBorder || '#e2e8f0'}`,
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                }}>
                    <InsertDriveFileIcon sx={{ fontSize: 44, color: c.textSecondary, mb: 1, opacity: 0.5 }} />
                    <Typography variant="body1" sx={{ fontWeight: 800, color: c.textPrimary, mb: 0.5 }}>
                        Format Berkas Tidak Didukung Preview Langsung
                    </Typography>
                    <Typography variant="caption" sx={{ color: c.textSecondary, display: 'block', mb: 2 }}>
                        Silakan unduh atau buka berkas melalui tab browser baru.
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                            component="a"
                            href={fileUrl}
                            target="_blank"
                            variant="outlined"
                            size="small"
                            endIcon={<OpenInNewIcon sx={{ fontSize: 13 }} />}
                            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
                        >
                            Buka di Tab Baru
                        </Button>
                        <Button
                            component="a"
                            href={fileUrl}
                            download
                            variant="contained"
                            size="small"
                            startIcon={<DownloadIcon sx={{ fontSize: 13 }} />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #094d42 0%, #059669 100%)',
                            }}
                        >
                            Unduh File
                        </Button>
                    </Stack>
                </Box>
            )}
        </Box>
    );
}
