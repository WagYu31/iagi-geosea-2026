import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Box, Typography, IconButton, Button, TextField, Paper, Chip,
    Tooltip, Drawer, Avatar, Divider, Stack, Badge, Fade,
} from '@mui/material';
import HighlightIcon from '@mui/icons-material/Highlight';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const HIGHLIGHT_COLORS = {
    yellow: { bg: 'rgba(250,204,21,0.35)', border: '#facc15', label: 'Note', icon: '📝' },
    red:    { bg: 'rgba(239,68,68,0.3)', border: '#ef4444', label: 'Error', icon: '❌' },
    green:  { bg: 'rgba(34,197,94,0.3)', border: '#22c55e', label: 'Good', icon: '✅' },
    blue:   { bg: 'rgba(59,130,246,0.3)', border: '#3b82f6', label: 'Info', icon: 'ℹ️' },
};

export default function PdfAnnotator({
    fileUrl,
    submissionId,
    annotations: initialAnnotations = [],
    isReviewer = false,
    isDark = false,
    currentReviewId = null,
    currentUserId = null,
}) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const overlayRef = useRef(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [scale, setScale] = useState(1.5);
    const [annotations, setAnnotations] = useState(initialAnnotations);
    const [selectedColor, setSelectedColor] = useState('yellow');
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectionPopup, setSelectionPopup] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [editingAnnotation, setEditingAnnotation] = useState(null);
    const [loading, setLoading] = useState(true);
    const renderTaskRef = useRef(null);

    // Load PDF
    useEffect(() => {
        let cancelled = false;
        const loadPdf = async () => {
            try {
                const pdfjsLib = await import('pdfjs-dist');
                pdfjsLib.GlobalWorkerOptions.workerSrc = '/build/pdf.worker.min.js';

                const loadingTask = pdfjsLib.getDocument(fileUrl);
                const pdf = await loadingTask.promise;
                if (!cancelled) {
                    setPdfDoc(pdf);
                    setTotalPages(pdf.numPages);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Failed to load PDF:', err);
                setLoading(false);
            }
        };
        loadPdf();
        return () => { cancelled = true; };
    }, [fileUrl]);

    // Render page
    useEffect(() => {
        if (!pdfDoc || !canvasRef.current) return;
        const renderPage = async () => {
            try {
                const page = await pdfDoc.getPage(currentPage);
                const viewport = page.getViewport({ scale });
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (renderTaskRef.current) {
                    renderTaskRef.current.cancel();
                }

                const renderTask = page.render({ canvasContext: ctx, viewport });
                renderTaskRef.current = renderTask;
                await renderTask.promise;
            } catch (err) {
                if (err.name !== 'RenderingCancelled') {
                    console.error('Render error:', err);
                }
            }
        };
        renderPage();
    }, [pdfDoc, currentPage, scale]);

    // Handle text selection for annotations
    const handleMouseUp = useCallback(() => {
        if (!isReviewer) return;
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !selection.toString().trim()) {
            return;
        }

        const selectedText = selection.toString().trim();
        if (selectedText.length < 2) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();

        if (!containerRect) return;

        const positionData = {
            top: rect.top - containerRect.top,
            left: rect.left - containerRect.left,
            width: rect.width,
            height: rect.height,
            pageX: rect.x,
            pageY: rect.y,
        };

        setSelectionPopup({
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top - 10,
            text: selectedText,
            positionData,
        });
    }, [isReviewer]);

    // Save annotation
    const handleSaveAnnotation = async () => {
        if (!selectionPopup) return;
        try {
            const response = await axios.post(`/reviewer/submissions/${submissionId}/annotations`, {
                page_number: currentPage,
                highlight_color: selectedColor,
                selected_text: selectionPopup.text,
                comment: newComment || null,
                position_data: selectionPopup.positionData,
            });

            setAnnotations(prev => [...prev, response.data]);
            setSelectionPopup(null);
            setNewComment('');
            window.getSelection()?.removeAllRanges();
        } catch (err) {
            console.error('Failed to save annotation:', err);
        }
    };

    // Delete annotation
    const handleDeleteAnnotation = async (annotationId) => {
        try {
            await axios.delete(`/reviewer/annotations/${annotationId}`);
            setAnnotations(prev => prev.filter(a => a.id !== annotationId));
        } catch (err) {
            console.error('Failed to delete annotation:', err);
        }
    };

    // Toggle resolved
    const handleToggleResolved = async (annotation) => {
        try {
            const response = await axios.put(`/reviewer/annotations/${annotation.id}`, {
                resolved: !annotation.resolved,
            });
            setAnnotations(prev => prev.map(a => a.id === annotation.id ? response.data : a));
        } catch (err) {
            console.error('Failed to update annotation:', err);
        }
    };

    // Update comment
    const handleUpdateComment = async (annotation, comment) => {
        try {
            const response = await axios.put(`/reviewer/annotations/${annotation.id}`, { comment });
            setAnnotations(prev => prev.map(a => a.id === annotation.id ? response.data : a));
            setEditingAnnotation(null);
        } catch (err) {
            console.error('Failed to update annotation:', err);
        }
    };

    const pageAnnotations = annotations.filter(a => a.page_number === currentPage);
    const annotationCount = annotations.length;

    const cardBg = isDark ? 'rgba(17,24,39,0.95)' : '#ffffff';
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
    const textPrimary = isDark ? '#f3f4f6' : '#111827';
    const textSecondary = isDark ? '#9ca3af' : '#6b7280';

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 500, bgcolor: isDark ? '#111827' : '#f8fafc', borderRadius: '14px', border: `1px solid ${borderColor}` }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: isDark ? 'rgba(26,188,156,0.1)' : '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, animation: 'pulse 1.5s ease infinite' }}>
                        <MenuBookIcon sx={{ color: '#1abc9c', fontSize: 24 }} />
                    </Box>
                    <Typography sx={{ color: textSecondary, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>Loading document...</Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative' }}>
            {/* ─── Toolbar ─── */}
            <Paper elevation={0} sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1,
                p: 1.5, mb: 1.5, borderRadius: '12px',
                bgcolor: isDark ? 'rgba(0,0,0,0.3)' : '#f8fafc',
                border: `1px solid ${borderColor}`,
            }}>
                {/* Left: Navigation */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}
                        sx={{ color: textSecondary, '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb' } }}>
                        <NavigateBeforeIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: textPrimary, fontFamily: 'Inter, sans-serif', minWidth: 80, textAlign: 'center' }}>
                        Page {currentPage} / {totalPages}
                    </Typography>
                    <IconButton size="small" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}
                        sx={{ color: textSecondary, '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb' } }}>
                        <NavigateNextIcon fontSize="small" />
                    </IconButton>

                    <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor }} />

                    <IconButton size="small" onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
                        sx={{ color: textSecondary, '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb' } }}>
                        <ZoomOutIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ fontSize: '0.75rem', color: textSecondary, fontWeight: 600, minWidth: 40, textAlign: 'center' }}>
                        {Math.round(scale * 100)}%
                    </Typography>
                    <IconButton size="small" onClick={() => setScale(s => Math.min(3, s + 0.25))}
                        sx={{ color: textSecondary, '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb' } }}>
                        <ZoomInIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Center: Color Selector (Reviewer Only) */}
                {isReviewer && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <HighlightIcon sx={{ fontSize: 18, color: textSecondary, mr: 0.5 }} />
                        {Object.entries(HIGHLIGHT_COLORS).map(([color, config]) => (
                            <Tooltip key={color} title={`${config.icon} ${config.label}`} arrow>
                                <IconButton
                                    size="small"
                                    onClick={() => setSelectedColor(color)}
                                    sx={{
                                        width: 28, height: 28,
                                        bgcolor: config.bg,
                                        border: selectedColor === color ? `2.5px solid ${config.border}` : '2px solid transparent',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s ease',
                                        transform: selectedColor === color ? 'scale(1.15)' : 'scale(1)',
                                        '&:hover': { transform: 'scale(1.15)', border: `2px solid ${config.border}` },
                                    }}
                                />
                            </Tooltip>
                        ))}
                    </Box>
                )}

                {/* Right: Sidebar Toggle */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                        size="small"
                        startIcon={<Badge badgeContent={annotationCount} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 16, height: 16 } }}><FormatListBulletedIcon fontSize="small" /></Badge>}
                        onClick={() => setShowSidebar(!showSidebar)}
                        sx={{
                            textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', borderRadius: '8px', px: 1.5,
                            color: showSidebar ? '#1abc9c' : textSecondary,
                            bgcolor: showSidebar ? (isDark ? 'rgba(26,188,156,0.1)' : '#ecfdf5') : 'transparent',
                            '&:hover': { bgcolor: isDark ? 'rgba(26,188,156,0.08)' : '#f0fdf9' },
                        }}
                    >
                        Annotations
                    </Button>
                </Box>
            </Paper>

            {/* ─── Main Content: PDF + Sidebar ─── */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                {/* PDF Canvas */}
                <Box
                    ref={containerRef}
                    onMouseUp={handleMouseUp}
                    sx={{
                        flex: 1, position: 'relative', overflow: 'auto',
                        borderRadius: '14px', border: `1px solid ${borderColor}`,
                        bgcolor: isDark ? '#1a1a2e' : '#525659',
                        maxHeight: 700,
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, position: 'relative' }}>
                        <canvas ref={canvasRef} style={{ display: 'block', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }} />

                        {/* Annotation overlays for current page */}
                        <Box ref={overlayRef} sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                            {pageAnnotations.map(ann => {
                                const pos = ann.position_data;
                                if (!pos) return null;
                                const colorConfig = HIGHLIGHT_COLORS[ann.highlight_color] || HIGHLIGHT_COLORS.yellow;
                                return (
                                    <Tooltip key={ann.id} title={
                                        <Box sx={{ p: 0.5, maxWidth: 250 }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, mb: 0.3 }}>
                                                {ann.user?.name || 'Reviewer'}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.75rem', fontStyle: 'italic', mb: 0.5, opacity: 0.9 }}>
                                                "{ann.selected_text?.substring(0, 80)}{ann.selected_text?.length > 80 ? '...' : ''}"
                                            </Typography>
                                            {ann.comment && (
                                                <Typography sx={{ fontSize: '0.72rem', borderTop: '1px solid rgba(255,255,255,0.2)', pt: 0.5, mt: 0.5 }}>
                                                    💬 {ann.comment}
                                                </Typography>
                                            )}
                                        </Box>
                                    } arrow placement="top">
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: pos.top, left: pos.left,
                                                width: pos.width, height: pos.height,
                                                bgcolor: colorConfig.bg,
                                                borderBottom: `2px solid ${colorConfig.border}`,
                                                borderRadius: '2px',
                                                pointerEvents: 'auto',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                opacity: ann.resolved ? 0.4 : 1,
                                                '&:hover': { opacity: 1, boxShadow: `0 0 8px ${colorConfig.border}` },
                                            }}
                                            onClick={() => isReviewer && ann.user_id === currentUserId && setEditingAnnotation(ann)}
                                        />
                                    </Tooltip>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* Selection Popup */}
                    {selectionPopup && isReviewer && (
                        <Fade in>
                            <Paper elevation={8} sx={{
                                position: 'absolute',
                                top: selectionPopup.y - 160,
                                left: Math.max(10, Math.min(selectionPopup.x - 160, (containerRef.current?.offsetWidth || 400) - 340)),
                                width: 320, zIndex: 1000,
                                borderRadius: '14px', overflow: 'hidden',
                                bgcolor: cardBg,
                                border: `1px solid ${borderColor}`,
                                boxShadow: isDark ? '0 12px 32px rgba(0,0,0,0.5)' : '0 12px 32px rgba(0,0,0,0.15)',
                            }}>
                                {/* Popup Header */}
                                <Box sx={{ px: 2, py: 1.5, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: textPrimary, fontFamily: 'Inter, sans-serif' }}>
                                        <HighlightIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle', color: HIGHLIGHT_COLORS[selectedColor].border }} />
                                        Add Annotation
                                    </Typography>
                                    <IconButton size="small" onClick={() => { setSelectionPopup(null); window.getSelection()?.removeAllRanges(); }}
                                        sx={{ color: textSecondary, width: 24, height: 24 }}>
                                        <CloseIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Box>

                                <Box sx={{ p: 2 }}>
                                    {/* Selected text preview */}
                                    <Box sx={{ bgcolor: HIGHLIGHT_COLORS[selectedColor].bg, borderRadius: '8px', p: 1.5, mb: 1.5, borderLeft: `3px solid ${HIGHLIGHT_COLORS[selectedColor].border}` }}>
                                        <Typography sx={{ fontSize: '0.72rem', color: textPrimary, fontStyle: 'italic', lineHeight: 1.5 }}>
                                            "{selectionPopup.text.substring(0, 120)}{selectionPopup.text.length > 120 ? '...' : ''}"
                                        </Typography>
                                    </Box>

                                    {/* Color selector */}
                                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5 }}>
                                        {Object.entries(HIGHLIGHT_COLORS).map(([color, config]) => (
                                            <Chip
                                                key={color}
                                                label={`${config.icon} ${config.label}`}
                                                size="small"
                                                onClick={() => setSelectedColor(color)}
                                                sx={{
                                                    fontSize: '0.68rem', fontWeight: 700, height: 26,
                                                    bgcolor: selectedColor === color ? config.bg : 'transparent',
                                                    border: selectedColor === color ? `1.5px solid ${config.border}` : `1px solid ${borderColor}`,
                                                    color: textPrimary,
                                                    cursor: 'pointer',
                                                    '&:hover': { bgcolor: config.bg },
                                                }}
                                            />
                                        ))}
                                    </Box>

                                    {/* Comment */}
                                    <TextField
                                        multiline rows={2} fullWidth
                                        placeholder="Add a comment (optional)..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        size="small"
                                        sx={{
                                            mb: 1.5,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '10px', fontSize: '0.82rem',
                                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#fafafa',
                                                '& fieldset': { borderColor },
                                                '&:hover fieldset': { borderColor: '#1abc9c' },
                                                '&.Mui-focused fieldset': { borderColor: '#1abc9c' },
                                            },
                                            '& textarea': { color: textPrimary },
                                            '& textarea::placeholder': { color: textSecondary },
                                        }}
                                    />

                                    {/* Actions */}
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                        <Button size="small" onClick={() => { setSelectionPopup(null); setNewComment(''); window.getSelection()?.removeAllRanges(); }}
                                            sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.78rem', color: textSecondary }}>
                                            Cancel
                                        </Button>
                                        <Button size="small" variant="contained"
                                            startIcon={<SendIcon sx={{ fontSize: 14 }} />}
                                            onClick={handleSaveAnnotation}
                                            sx={{
                                                textTransform: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.78rem',
                                                background: 'linear-gradient(135deg, #0d7a6a, #1abc9c)',
                                                '&:hover': { background: 'linear-gradient(135deg, #16a085, #0d7a6a)' },
                                                boxShadow: '0 2px 8px rgba(26,188,156,0.25)',
                                            }}>
                                            Highlight
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        </Fade>
                    )}
                </Box>

                {/* ─── Sidebar ─── */}
                {showSidebar && (
                    <Paper elevation={0} sx={{
                        width: { xs: '100%', md: 340 }, flexShrink: 0,
                        borderRadius: '14px', border: `1px solid ${borderColor}`,
                        bgcolor: cardBg, overflow: 'hidden', maxHeight: 700,
                        display: 'flex', flexDirection: 'column',
                    }}>
                        {/* Sidebar Header */}
                        <Box sx={{ px: 2, py: 2, borderBottom: `1px solid ${borderColor}`, bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#fafbfd' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CommentIcon sx={{ fontSize: 18, color: '#1abc9c' }} />
                                    <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: textPrimary, fontFamily: 'Inter, sans-serif' }}>
                                        Annotations
                                    </Typography>
                                    <Chip label={annotationCount} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: isDark ? 'rgba(26,188,156,0.1)' : '#ecfdf5', color: '#1abc9c', borderRadius: '6px' }} />
                                </Box>
                                <IconButton size="small" onClick={() => setShowSidebar(false)} sx={{ color: textSecondary }}>
                                    <CloseIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Box>

                            {/* Color Legend */}
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5, flexWrap: 'wrap' }}>
                                {Object.entries(HIGHLIGHT_COLORS).map(([color, config]) => {
                                    const count = annotations.filter(a => a.highlight_color === color).length;
                                    return (
                                        <Chip
                                            key={color}
                                            label={`${config.icon} ${count}`}
                                            size="small"
                                            sx={{
                                                height: 22, fontSize: '0.68rem', fontWeight: 700,
                                                bgcolor: config.bg, color: textPrimary,
                                                borderRadius: '6px',
                                            }}
                                        />
                                    );
                                })}
                            </Box>
                        </Box>

                        {/* Annotations List */}
                        <Box sx={{ flex: 1, overflow: 'auto', p: 1.5 }}>
                            {annotations.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
                                    <HighlightIcon sx={{ fontSize: 36, color: textSecondary, opacity: 0.3, mb: 1 }} />
                                    <Typography sx={{ fontSize: '0.82rem', color: textSecondary, fontFamily: 'Inter, sans-serif' }}>
                                        No annotations yet
                                    </Typography>
                                    {isReviewer && (
                                        <Typography sx={{ fontSize: '0.72rem', color: textSecondary, mt: 0.5, opacity: 0.7 }}>
                                            Select text on the PDF to add highlights
                                        </Typography>
                                    )}
                                </Box>
                            ) : (
                                <Stack spacing={1}>
                                    {annotations.map(ann => {
                                        const colorConfig = HIGHLIGHT_COLORS[ann.highlight_color] || HIGHLIGHT_COLORS.yellow;
                                        const isOwn = ann.user_id === currentUserId;
                                        return (
                                            <Paper key={ann.id} elevation={0} sx={{
                                                p: 1.5, borderRadius: '10px',
                                                border: `1px solid ${borderColor}`,
                                                borderLeft: `3px solid ${colorConfig.border}`,
                                                bgcolor: ann.resolved ? (isDark ? 'rgba(34,197,94,0.03)' : '#f0fdf4') : (isDark ? 'rgba(255,255,255,0.02)' : '#fafafa'),
                                                opacity: ann.resolved ? 0.7 : 1,
                                                transition: 'all 0.2s ease',
                                                cursor: 'pointer',
                                                '&:hover': { borderColor: colorConfig.border, boxShadow: `0 2px 8px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)'}` },
                                            }}
                                                onClick={() => setCurrentPage(ann.page_number)}
                                            >
                                                {/* Header: page + user + actions */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Chip label={`P.${ann.page_number}`} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', color: textSecondary, borderRadius: '4px' }} />
                                                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: textSecondary }}>
                                                            {ann.user?.name || 'Reviewer'}
                                                        </Typography>
                                                    </Box>
                                                    {isOwn && isReviewer && (
                                                        <Box sx={{ display: 'flex', gap: 0.3 }}>
                                                            <Tooltip title={ann.resolved ? 'Mark unresolved' : 'Mark resolved'}>
                                                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleToggleResolved(ann); }}
                                                                    sx={{ width: 22, height: 22, color: ann.resolved ? '#22c55e' : textSecondary }}>
                                                                    {ann.resolved ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />}
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete">
                                                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteAnnotation(ann.id); }}
                                                                    sx={{ width: 22, height: 22, color: '#ef4444', opacity: 0.6, '&:hover': { opacity: 1 } }}>
                                                                    <DeleteIcon sx={{ fontSize: 14 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    )}
                                                </Box>

                                                {/* Selected text */}
                                                <Typography sx={{
                                                    fontSize: '0.75rem', color: textPrimary, fontStyle: 'italic',
                                                    bgcolor: colorConfig.bg, borderRadius: '6px', p: 0.8, mb: 0.8,
                                                    lineHeight: 1.5,
                                                    textDecoration: ann.resolved ? 'line-through' : 'none',
                                                }}>
                                                    "{ann.selected_text?.substring(0, 100)}{ann.selected_text?.length > 100 ? '...' : ''}"
                                                </Typography>

                                                {/* Comment */}
                                                {ann.comment && (
                                                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-start' }}>
                                                        <CommentIcon sx={{ fontSize: 12, color: textSecondary, mt: 0.2, flexShrink: 0 }} />
                                                        <Typography sx={{ fontSize: '0.72rem', color: textSecondary, lineHeight: 1.5 }}>
                                                            {ann.comment}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {/* Resolved badge */}
                                                {ann.resolved && (
                                                    <Chip label="✓ Resolved" size="small" sx={{
                                                        mt: 0.8, height: 18, fontSize: '0.6rem', fontWeight: 700,
                                                        bgcolor: isDark ? 'rgba(34,197,94,0.1)' : '#dcfce7',
                                                        color: '#16a34a', borderRadius: '4px',
                                                    }} />
                                                )}
                                            </Paper>
                                        );
                                    })}
                                </Stack>
                            )}
                        </Box>
                    </Paper>
                )}
            </Box>
        </Box>
    );
}
