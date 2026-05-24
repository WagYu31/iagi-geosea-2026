import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Box, Typography, IconButton, Button, TextField, Paper, Chip,
    Tooltip, Divider, Stack, Badge, Fade, Alert,
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
import AddCommentIcon from '@mui/icons-material/AddComment';
import EditNoteIcon from '@mui/icons-material/EditNote';
import RateReviewIcon from '@mui/icons-material/RateReview';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import axios from 'axios';

const HIGHLIGHT_COLORS = {
    yellow: { bg: 'rgba(250,204,21,0.35)', border: '#facc15', label: 'Catatan', icon: '📝', desc: 'Catatan umum' },
    red:    { bg: 'rgba(239,68,68,0.3)', border: '#ef4444', label: 'Kesalahan', icon: '❌', desc: 'Perlu diperbaiki' },
    green:  { bg: 'rgba(34,197,94,0.3)', border: '#22c55e', label: 'Sudah Baik', icon: '✅', desc: 'Bagian yang bagus' },
    blue:   { bg: 'rgba(59,130,246,0.3)', border: '#3b82f6', label: 'Saran', icon: 'ℹ️', desc: 'Saran perbaikan' },
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
    const isPdf = fileUrl?.toLowerCase().endsWith('.pdf');
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const docViewerRef = useRef(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [scale, setScale] = useState(1.5);
    const [annotations, setAnnotations] = useState(initialAnnotations);
    const [selectedColor, setSelectedColor] = useState('yellow');
    const [showSidebar, setShowSidebar] = useState(true);
    const [selectionPopup, setSelectionPopup] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [activeAnnotationId, setActiveAnnotationId] = useState(null);
    const renderTaskRef = useRef(null);

    // DOCX state
    const [docHtml, setDocHtml] = useState('');

    // Manual form
    const [showAddForm, setShowAddForm] = useState(false);
    const [manualPage, setManualPage] = useState('');
    const [manualText, setManualText] = useState('');
    const [manualComment, setManualComment] = useState('');

    const cardBg = isDark ? 'rgba(17,24,39,0.95)' : '#ffffff';
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
    const textPrimary = isDark ? '#f3f4f6' : '#111827';
    const textSecondary = isDark ? '#9ca3af' : '#6b7280';

    // CSRF
    useEffect(() => {
        const t = document.head.querySelector('meta[name="csrf-token"]');
        if (t) axios.defaults.headers.common['X-CSRF-TOKEN'] = t.content;
    }, []);

    // ─── DOCX: Load with mammoth ───
    useEffect(() => {
        if (isPdf) return;
        const loadDocx = async () => {
            try {
                const mammoth = await import('mammoth');
                const response = await fetch(fileUrl);
                const buffer = await response.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
                setDocHtml(result.value);
                setLoading(false);
            } catch (err) {
                console.error('DOCX load error:', err);
                // Fallback: show google docs iframe
                setDocHtml('__FALLBACK__');
                setLoading(false);
            }
        };
        loadDocx();
    }, [fileUrl, isPdf]);

    // ─── PDF: Load ───
    useEffect(() => {
        if (!isPdf) return;
        let cancelled = false;
        const loadPdf = async () => {
            try {
                const pdfjsLib = await import('pdfjs-dist');
                pdfjsLib.GlobalWorkerOptions.workerSrc = '/build/pdf.worker.min.js';
                const pdf = await (pdfjsLib.getDocument(fileUrl)).promise;
                if (!cancelled) { setPdfDoc(pdf); setTotalPages(pdf.numPages); setLoading(false); }
            } catch (err) { console.error('PDF load error:', err); setLoading(false); }
        };
        loadPdf();
        return () => { cancelled = true; };
    }, [fileUrl, isPdf]);

    // PDF: Render page
    useEffect(() => {
        if (!isPdf || !pdfDoc || !canvasRef.current) return;
        const renderPage = async () => {
            try {
                const page = await pdfDoc.getPage(currentPage);
                const viewport = page.getViewport({ scale });
                const canvas = canvasRef.current;
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                if (renderTaskRef.current) renderTaskRef.current.cancel();
                const task = page.render({ canvasContext: canvas.getContext('2d'), viewport });
                renderTaskRef.current = task;
                await task.promise;
            } catch (err) { if (err.name !== 'RenderingCancelled') console.error(err); }
        };
        renderPage();
    }, [pdfDoc, currentPage, scale, isPdf]);

    // ─── DOCX: Handle text selection for inline annotation ───
    const handleDocTextSelect = useCallback(() => {
        if (!isReviewer || isPdf) return;
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.toString().trim()) return;
        const text = sel.toString().trim();
        if (text.length < 2) return;

        // Pre-fill the add form with selected text
        setManualText(text);
        setShowAddForm(true);
        // Keep selection visible
    }, [isReviewer, isPdf]);

    // ─── DOCX: Scroll to and highlight text in document ───
    const scrollToTextInDoc = useCallback((searchText, annotationId) => {
        if (!docViewerRef.current || !searchText) return;
        setActiveAnnotationId(annotationId);

        // Remove previous highlights
        const existing = docViewerRef.current.querySelectorAll('.annotation-highlight-active');
        existing.forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });

        // Search text in document
        const walker = document.createTreeWalker(docViewerRef.current, NodeFilter.SHOW_TEXT, null, false);
        const normalizedSearch = searchText.toLowerCase().trim().substring(0, 60);
        let found = false;

        while (walker.nextNode()) {
            const node = walker.currentNode;
            const nodeText = node.textContent.toLowerCase();
            const idx = nodeText.indexOf(normalizedSearch);

            if (idx !== -1) {
                // Split text node and wrap matched part
                const range = document.createRange();
                range.setStart(node, idx);
                range.setEnd(node, Math.min(idx + normalizedSearch.length, node.textContent.length));

                const highlight = document.createElement('mark');
                highlight.className = 'annotation-highlight-active';
                highlight.style.cssText = 'background: linear-gradient(135deg, rgba(250,204,21,0.5), rgba(250,204,21,0.3)); padding: 2px 4px; border-radius: 4px; border-bottom: 3px solid #facc15; scroll-margin-top: 120px; transition: all 0.3s ease; animation: highlightPulse 1.5s ease-in-out 2;';

                try {
                    range.surroundContents(highlight);
                    highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    found = true;
                } catch (e) {
                    // Complex DOM, try simpler approach
                    console.warn('Complex DOM structure, using fallback scroll');
                }
                break;
            }
        }

        if (!found) {
            // Fallback: just flash the annotation card
            setTimeout(() => setActiveAnnotationId(null), 2000);
        }

        // Auto-clear highlight after 5s
        setTimeout(() => {
            const marks = docViewerRef.current?.querySelectorAll('.annotation-highlight-active');
            marks?.forEach(el => {
                el.style.background = 'rgba(250,204,21,0.15)';
                el.style.borderBottom = '2px dashed #facc1580';
            });
            setActiveAnnotationId(null);
        }, 5000);
    }, []);

    // Save annotation
    const saveAnnotation = async (payload) => {
        setSaving(true);
        try {
            const res = await axios.post(`/reviewer/submissions/${submissionId}/annotations`, payload);
            setAnnotations(prev => [...prev, res.data]);
            setSuccessMsg('✅ Anotasi berhasil disimpan!');
            setTimeout(() => setSuccessMsg(''), 3000);
            return true;
        } catch (err) {
            console.error('Save error:', err);
            alert('Gagal menyimpan anotasi. Silakan coba lagi.');
            return false;
        } finally { setSaving(false); }
    };

    const handleSaveFromPopup = async () => {
        if (!selectionPopup) return;
        const ok = await saveAnnotation({
            page_number: currentPage, highlight_color: selectedColor,
            selected_text: selectionPopup.text, comment: newComment || null,
            position_data: selectionPopup.positionData,
        });
        if (ok) { setSelectionPopup(null); setNewComment(''); window.getSelection()?.removeAllRanges(); }
    };

    const handleSubmitManual = async () => {
        if (!manualText.trim()) return;
        const ok = await saveAnnotation({
            page_number: parseInt(manualPage) || 1, highlight_color: selectedColor,
            selected_text: manualText.trim(), comment: manualComment.trim() || null,
            position_data: { top: 0, left: 0, width: 0, height: 0, manual: true },
        });
        if (ok) { setManualText(''); setManualComment(''); setManualPage(''); setShowAddForm(false); window.getSelection()?.removeAllRanges(); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus anotasi ini?')) return;
        try { await axios.delete(`/reviewer/annotations/${id}`); setAnnotations(prev => prev.filter(a => a.id !== id)); } catch (err) { console.error(err); }
    };

    const handleToggleResolved = async (ann) => {
        try { const res = await axios.put(`/reviewer/annotations/${ann.id}`, { resolved: !ann.resolved }); setAnnotations(prev => prev.map(a => a.id === ann.id ? res.data : a)); } catch (err) { console.error(err); }
    };

    const annotationCount = annotations.length;
    const inputSx = {
        '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#fff', '& fieldset': { borderColor }, '&:hover fieldset': { borderColor: '#1abc9c' }, '&.Mui-focused fieldset': { borderColor: '#1abc9c', borderWidth: 2 } },
        '& textarea, & input': { color: textPrimary }, '& .MuiInputLabel-root': { color: textSecondary, fontSize: '0.82rem' }, '& .MuiInputLabel-root.Mui-focused': { color: '#1abc9c' },
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 500, bgcolor: isDark ? '#111827' : '#f8fafc', borderRadius: '14px', border: `1px solid ${borderColor}` }}>
                <Box sx={{ textAlign: 'center' }}>
                    <MenuBookIcon sx={{ color: '#1abc9c', fontSize: 36, mb: 1, opacity: 0.6 }} />
                    <Typography sx={{ color: textSecondary, fontSize: '0.85rem' }}>Memuat dokumen...</Typography>
                </Box>
            </Box>
        );
    }

    // ─── SIDEBAR ─────────────────────────────────────────
    const Sidebar = () => (
        <Paper elevation={0} sx={{
            width: { xs: '100%', md: 360 }, flexShrink: 0,
            borderRadius: '14px', border: `1px solid ${borderColor}`,
            bgcolor: cardBg, overflow: 'hidden', maxHeight: 700,
            display: 'flex', flexDirection: 'column',
        }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: `1px solid ${borderColor}`, bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#fafbfd' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RateReviewIcon sx={{ fontSize: 20, color: '#1abc9c' }} />
                        <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: textPrimary, fontFamily: 'Inter, sans-serif' }}>Review Panel</Typography>
                        {annotationCount > 0 && <Chip label={annotationCount} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#1abc9c', color: '#fff', borderRadius: '10px' }} />}
                    </Box>
                    <IconButton size="small" onClick={() => setShowSidebar(false)} sx={{ color: textSecondary }}><CloseIcon sx={{ fontSize: 16 }} /></IconButton>
                </Box>
                {successMsg && <Alert severity="success" sx={{ mb: 1, borderRadius: '10px', fontSize: '0.78rem', py: 0 }}>{successMsg}</Alert>}
                {isReviewer && !showAddForm && (
                    <Button fullWidth variant="contained" size="medium" startIcon={<AddCommentIcon />}
                        onClick={() => setShowAddForm(true)}
                        sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.85rem', py: 1.2, borderRadius: '12px', fontFamily: 'Inter, sans-serif', background: 'linear-gradient(135deg, #0d7a6a, #1abc9c)', boxShadow: '0 4px 14px rgba(26,188,156,0.3)', '&:hover': { background: 'linear-gradient(135deg, #16a085, #0d7a6a)' } }}>
                        ✍️ Tambah Anotasi Baru
                    </Button>
                )}
            </Box>

            {/* Add Form */}
            {showAddForm && isReviewer && (
                <Box sx={{ p: 2, borderBottom: `1px solid ${borderColor}`, bgcolor: isDark ? 'rgba(26,188,156,0.02)' : '#f0fdf9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 800, color: textPrimary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EditNoteIcon sx={{ fontSize: 18, color: '#1abc9c' }} /> Anotasi Baru
                        </Typography>
                        <IconButton size="small" onClick={() => { setShowAddForm(false); setManualText(''); setManualComment(''); }} sx={{ color: textSecondary }}><CloseIcon sx={{ fontSize: 16 }} /></IconButton>
                    </Box>

                    {/* Instruction */}
                    {!isPdf && (
                        <Box sx={{ bgcolor: isDark ? 'rgba(59,130,246,0.08)' : '#eff6ff', borderRadius: '10px', p: 1.5, mb: 2, border: `1px solid ${isDark ? 'rgba(59,130,246,0.15)' : '#dbeafe'}` }}>
                            <Typography sx={{ fontSize: '0.75rem', color: isDark ? '#93c5fd' : '#1d4ed8', lineHeight: 1.6 }}>
                                <TouchAppIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                <b>💡 Tip:</b> Select/blok teks di dokumen → otomatis terisi di form ini. Atau tulis manual.
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#1abc9c', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>📄 Halaman</Typography>
                        <TextField fullWidth size="small" type="number" placeholder="Contoh: 5" value={manualPage} onChange={(e) => setManualPage(e.target.value)} inputProps={{ min: 1 }} sx={inputSx} />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#1abc9c', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>📝 Kutipan Teks yang di-Review *</Typography>
                        <TextField fullWidth size="small" multiline rows={3}
                            placeholder='Salin teks dari dokumen, contoh: "Metodologi yang digunakan..."'
                            value={manualText} onChange={(e) => setManualText(e.target.value)} sx={inputSx} />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#1abc9c', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>💬 Komentar / Koreksi</Typography>
                        <TextField fullWidth size="small" multiline rows={3}
                            placeholder="Tuliskan koreksi atau saran Anda..."
                            value={manualComment} onChange={(e) => setManualComment(e.target.value)} sx={inputSx} />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#1abc9c', mb: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🏷️ Kategori</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {Object.entries(HIGHLIGHT_COLORS).map(([color, config]) => (
                                <Chip key={color}
                                    label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                        <span>{config.icon}</span>
                                        <Box><Typography sx={{ fontSize: '0.7rem', fontWeight: 700, lineHeight: 1.1 }}>{config.label}</Typography><Typography sx={{ fontSize: '0.58rem', opacity: 0.7, lineHeight: 1 }}>{config.desc}</Typography></Box>
                                    </Box>}
                                    onClick={() => setSelectedColor(color)}
                                    sx={{ height: 'auto', py: 0.5, px: 0.5, cursor: 'pointer', bgcolor: selectedColor === color ? config.bg : 'transparent', border: selectedColor === color ? `2px solid ${config.border}` : `1px solid ${borderColor}`, borderRadius: '10px', color: textPrimary, transform: selectedColor === color ? 'scale(1.03)' : 'scale(1)', transition: 'all 0.2s', '&:hover': { bgcolor: config.bg }, '& .MuiChip-label': { px: 0.5 } }}
                                />
                            ))}
                        </Box>
                    </Box>

                    <Button fullWidth variant="contained" startIcon={<SendIcon sx={{ fontSize: 16 }} />}
                        onClick={handleSubmitManual} disabled={!manualText.trim() || saving}
                        sx={{ textTransform: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.88rem', py: 1.2, background: 'linear-gradient(135deg, #0d7a6a, #1abc9c)', '&:hover': { background: 'linear-gradient(135deg, #16a085, #0d7a6a)' }, boxShadow: '0 4px 14px rgba(26,188,156,0.3)', '&.Mui-disabled': { bgcolor: isDark ? '#374151' : '#e5e7eb' } }}>
                        {saving ? 'Menyimpan...' : '💾 Simpan Anotasi'}
                    </Button>
                </Box>
            )}

            {/* Annotations List */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 1.5 }}>
                {annotations.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 5, px: 2 }}>
                        <RateReviewIcon sx={{ fontSize: 28, color: '#1abc9c', opacity: 0.4, mb: 1 }} />
                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: textPrimary, mb: 0.5 }}>Belum ada anotasi</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: textSecondary, lineHeight: 1.6 }}>
                            {isReviewer ? 'Blok teks di dokumen atau klik "Tambah Anotasi Baru"' : 'Reviewer belum memberikan anotasi.'}
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {/* Summary */}
                        <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
                            {Object.entries(HIGHLIGHT_COLORS).map(([color, config]) => {
                                const count = annotations.filter(a => a.highlight_color === color).length;
                                return count > 0 ? <Chip key={color} label={`${config.icon} ${config.label}: ${count}`} size="small"
                                    sx={{ height: 24, fontSize: '0.68rem', fontWeight: 700, bgcolor: config.bg, color: textPrimary, borderRadius: '8px' }} /> : null;
                            })}
                        </Box>

                        {/* Clickable hint */}
                        {!isPdf && (
                            <Box sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.05)' : '#ecfdf5', borderRadius: '8px', p: 1, mb: 1.5, border: `1px solid ${isDark ? 'rgba(26,188,156,0.1)' : '#d1fae5'}` }}>
                                <Typography sx={{ fontSize: '0.68rem', color: isDark ? '#6ee7b7' : '#059669', textAlign: 'center', fontWeight: 600 }}>
                                    👆 Klik anotasi di bawah untuk scroll ke teks di dokumen
                                </Typography>
                            </Box>
                        )}

                        <Stack spacing={1}>
                            {annotations.map(ann => {
                                const cc = HIGHLIGHT_COLORS[ann.highlight_color] || HIGHLIGHT_COLORS.yellow;
                                const isOwn = ann.user_id === currentUserId;
                                const isActive = activeAnnotationId === ann.id;
                                return (
                                    <Paper key={ann.id} elevation={0}
                                        onClick={() => {
                                            if (!isPdf) scrollToTextInDoc(ann.selected_text, ann.id);
                                        }}
                                        sx={{
                                            p: 1.5, borderRadius: '12px', cursor: !isPdf ? 'pointer' : 'default',
                                            border: isActive ? `2px solid ${cc.border}` : `1px solid ${borderColor}`,
                                            borderLeft: `4px solid ${cc.border}`,
                                            bgcolor: isActive ? cc.bg : (ann.resolved ? (isDark ? 'rgba(34,197,94,0.03)' : '#f0fdf4') : (isDark ? 'rgba(255,255,255,0.02)' : '#fafafa')),
                                            opacity: ann.resolved ? 0.65 : 1,
                                            transition: 'all 0.3s ease',
                                            transform: isActive ? 'scale(1.02)' : 'scale(1)',
                                            boxShadow: isActive ? `0 4px 16px ${cc.border}40` : 'none',
                                            '&:hover': { borderColor: cc.border, boxShadow: `0 2px 12px ${isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.06)'}`, transform: 'scale(1.01)' },
                                        }}>
                                        {/* Header */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Chip label={`Hal. ${ann.page_number}`} size="small" sx={{ height: 20, fontSize: '0.63rem', fontWeight: 800, bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: textSecondary, borderRadius: '6px' }} />
                                                <Chip label={`${cc.icon} ${cc.label}`} size="small" sx={{ height: 20, fontSize: '0.63rem', fontWeight: 700, bgcolor: cc.bg, color: textPrimary, borderRadius: '6px' }} />
                                            </Box>
                                            {isOwn && isReviewer && (
                                                <Box sx={{ display: 'flex', gap: 0.3 }}>
                                                    <Tooltip title={ann.resolved ? 'Batalkan selesai' : 'Tandai selesai'}>
                                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleToggleResolved(ann); }}
                                                            sx={{ width: 24, height: 24, color: ann.resolved ? '#22c55e' : textSecondary }}>
                                                            {ann.resolved ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />}
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Hapus">
                                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(ann.id); }}
                                                            sx={{ width: 24, height: 24, color: '#ef4444', opacity: 0.5, '&:hover': { opacity: 1 } }}>
                                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            )}
                                        </Box>

                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: textSecondary, mb: 0.5 }}>👤 {ann.user?.name || 'Reviewer'}</Typography>

                                        {/* Text */}
                                        <Box sx={{ bgcolor: cc.bg, borderRadius: '8px', p: 1, mb: 1, borderLeft: `3px solid ${cc.border}` }}>
                                            <Typography sx={{ fontSize: '0.78rem', color: textPrimary, fontStyle: 'italic', lineHeight: 1.6, textDecoration: ann.resolved ? 'line-through' : 'none' }}>
                                                "{ann.selected_text?.substring(0, 150)}{ann.selected_text?.length > 150 ? '...' : ''}"
                                            </Typography>
                                        </Box>

                                        {ann.comment && (
                                            <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'flex-start', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', borderRadius: '8px', p: 1, border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9'}` }}>
                                                <CommentIcon sx={{ fontSize: 14, color: '#1abc9c', mt: 0.2, flexShrink: 0 }} />
                                                <Typography sx={{ fontSize: '0.78rem', color: textPrimary, lineHeight: 1.6 }}>{ann.comment}</Typography>
                                            </Box>
                                        )}

                                        {ann.resolved && <Chip label="✓ Sudah Dikoreksi" size="small" sx={{ mt: 1, height: 20, fontSize: '0.63rem', fontWeight: 700, bgcolor: isDark ? 'rgba(34,197,94,0.1)' : '#dcfce7', color: '#16a34a', borderRadius: '6px' }} />}

                                        {/* Click indicator for DOCX */}
                                        {!isPdf && (
                                            <Typography sx={{ fontSize: '0.6rem', color: textSecondary, mt: 0.8, textAlign: 'right', opacity: 0.5 }}>
                                                👆 Klik untuk lihat di dokumen
                                            </Typography>
                                        )}
                                    </Paper>
                                );
                            })}
                        </Stack>
                    </>
                )}
            </Box>
        </Paper>
    );

    // ═══════════════════════════════════════════════════
    // DOCX MODE: Native HTML Viewer (mammoth) + Sidebar
    // ═══════════════════════════════════════════════════
    if (!isPdf) {
        const fullUrl = `${window.location.origin}${fileUrl}`;
        const useFallback = docHtml === '__FALLBACK__';

        return (
            <Box>
                <style>{`
                    @keyframes highlightPulse {
                        0%, 100% { box-shadow: 0 0 0 0 rgba(250,204,21,0.4); }
                        50% { box-shadow: 0 0 12px 4px rgba(250,204,21,0.6); }
                    }
                    .docx-viewer { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.8; color: #1a1a1a; max-width: 210mm; margin: 0 auto; padding: 40px 50px; }
                    .docx-viewer p { margin-bottom: 12px; text-align: justify; }
                    .docx-viewer h1, .docx-viewer h2, .docx-viewer h3 { font-weight: bold; margin: 20px 0 10px; }
                    .docx-viewer h1 { font-size: 18pt; }
                    .docx-viewer h2 { font-size: 16pt; }
                    .docx-viewer h3 { font-size: 14pt; }
                    .docx-viewer table { border-collapse: collapse; width: 100%; margin: 10px 0; }
                    .docx-viewer td, .docx-viewer th { border: 1px solid #ccc; padding: 6px 10px; }
                    .docx-viewer img { max-width: 100%; height: auto; }
                    .docx-viewer strong, .docx-viewer b { font-weight: bold; }
                    .docx-viewer em, .docx-viewer i { font-style: italic; }
                    .docx-viewer ::selection { background: rgba(26,188,156,0.3); }
                `}</style>

                {/* Toolbar */}
                <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, p: 1.5, mb: 1.5, borderRadius: '12px', bgcolor: isDark ? 'rgba(0,0,0,0.3)' : '#f8fafc', border: `1px solid ${borderColor}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RateReviewIcon sx={{ fontSize: 20, color: '#1abc9c' }} />
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: textPrimary, fontFamily: 'Inter, sans-serif' }}>Mode Review Dokumen</Typography>
                    </Box>

                    {isReviewer && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TouchAppIcon sx={{ fontSize: 16, color: textSecondary }} />
                            <Typography sx={{ fontSize: '0.72rem', color: textSecondary, fontWeight: 600 }}>
                                Blok teks → otomatis isi form
                            </Typography>
                        </Box>
                    )}

                    <Button size="small"
                        startIcon={<Badge badgeContent={annotationCount} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 16, height: 16 } }}><FormatListBulletedIcon fontSize="small" /></Badge>}
                        onClick={() => setShowSidebar(!showSidebar)}
                        sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', borderRadius: '10px', px: 2, color: showSidebar ? '#fff' : textSecondary, bgcolor: showSidebar ? '#1abc9c' : 'transparent', '&:hover': { bgcolor: showSidebar ? '#16a085' : '#f0fdf9' } }}>
                        Review Panel
                    </Button>
                </Paper>

                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                    {/* Document Viewer */}
                    <Box sx={{ flex: 1, borderRadius: '14px', overflow: 'hidden', border: `1px solid ${borderColor}`, bgcolor: '#fff', maxHeight: 700, overflowY: 'auto' }}>
                        {useFallback ? (
                            <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(fullUrl)}&embedded=true`} width="100%" height="700" style={{ border: 'none', display: 'block' }} title="Document Viewer" />
                        ) : (
                            <Box
                                ref={docViewerRef}
                                className="docx-viewer"
                                onMouseUp={handleDocTextSelect}
                                dangerouslySetInnerHTML={{ __html: docHtml }}
                                sx={{ bgcolor: '#fff', minHeight: 700, cursor: isReviewer ? 'text' : 'default', userSelect: 'text' }}
                            />
                        )}
                    </Box>

                    {showSidebar && <Sidebar />}
                </Box>
            </Box>
        );
    }

    // ═══════════════════════════════════════════════════
    // PDF MODE (unchanged)
    // ═══════════════════════════════════════════════════
    const handleMouseUp = () => {
        if (!isReviewer) return;
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.toString().trim()) return;
        const text = sel.toString().trim();
        if (text.length < 2) return;
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const cRect = containerRef.current?.getBoundingClientRect();
        if (!cRect) return;
        setSelectionPopup({
            x: rect.left - cRect.left + rect.width / 2, y: rect.top - cRect.top - 10, text,
            positionData: { top: rect.top - cRect.top, left: rect.left - cRect.left, width: rect.width, height: rect.height },
        });
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, p: 1.5, mb: 1.5, borderRadius: '12px', bgcolor: isDark ? 'rgba(0,0,0,0.3)' : '#f8fafc', border: `1px solid ${borderColor}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} sx={{ color: textSecondary }}><NavigateBeforeIcon fontSize="small" /></IconButton>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: textPrimary, fontFamily: 'Inter, sans-serif', minWidth: 80, textAlign: 'center' }}>Hal. {currentPage} / {totalPages}</Typography>
                    <IconButton size="small" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} sx={{ color: textSecondary }}><NavigateNextIcon fontSize="small" /></IconButton>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor }} />
                    <IconButton size="small" onClick={() => setScale(s => Math.max(0.5, s - 0.25))} sx={{ color: textSecondary }}><ZoomOutIcon fontSize="small" /></IconButton>
                    <Typography sx={{ fontSize: '0.75rem', color: textSecondary, fontWeight: 600, minWidth: 40, textAlign: 'center' }}>{Math.round(scale * 100)}%</Typography>
                    <IconButton size="small" onClick={() => setScale(s => Math.min(3, s + 0.25))} sx={{ color: textSecondary }}><ZoomInIcon fontSize="small" /></IconButton>
                </Box>
                {isReviewer && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <HighlightIcon sx={{ fontSize: 18, color: textSecondary, mr: 0.5 }} />
                        {Object.entries(HIGHLIGHT_COLORS).map(([color, config]) => (
                            <Tooltip key={color} title={`${config.icon} ${config.label}`} arrow>
                                <IconButton size="small" onClick={() => setSelectedColor(color)}
                                    sx={{ width: 28, height: 28, bgcolor: config.bg, border: selectedColor === color ? `2.5px solid ${config.border}` : '2px solid transparent', borderRadius: '8px', transition: 'all 0.2s', transform: selectedColor === color ? 'scale(1.15)' : 'scale(1)', '&:hover': { transform: 'scale(1.15)', border: `2px solid ${config.border}` } }} />
                            </Tooltip>
                        ))}
                    </Box>
                )}
                <Button size="small"
                    startIcon={<Badge badgeContent={annotationCount} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 16, height: 16 } }}><FormatListBulletedIcon fontSize="small" /></Badge>}
                    onClick={() => setShowSidebar(!showSidebar)}
                    sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', borderRadius: '10px', px: 2, color: showSidebar ? '#fff' : textSecondary, bgcolor: showSidebar ? '#1abc9c' : 'transparent', '&:hover': { bgcolor: showSidebar ? '#16a085' : '#f0fdf9' } }}>
                    Review Panel
                </Button>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box ref={containerRef} onMouseUp={handleMouseUp}
                    sx={{ flex: 1, position: 'relative', overflow: 'auto', borderRadius: '14px', border: `1px solid ${borderColor}`, bgcolor: isDark ? '#1a1a2e' : '#525659', maxHeight: 700 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, position: 'relative' }}>
                        <canvas ref={canvasRef} style={{ display: 'block', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }} />
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                            {annotations.filter(a => a.page_number === currentPage).map(ann => {
                                const pos = ann.position_data; if (!pos || pos.manual) return null;
                                const cc = HIGHLIGHT_COLORS[ann.highlight_color] || HIGHLIGHT_COLORS.yellow;
                                return (<Tooltip key={ann.id} title={<Box sx={{ p: 0.5, maxWidth: 250 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 700 }}>{ann.user?.name}</Typography><Typography sx={{ fontSize: '0.75rem', fontStyle: 'italic' }}>"{ann.selected_text?.substring(0, 80)}"</Typography>{ann.comment && <Typography sx={{ fontSize: '0.72rem', borderTop: '1px solid rgba(255,255,255,0.2)', pt: 0.5, mt: 0.5 }}>💬 {ann.comment}</Typography>}</Box>} arrow>
                                    <Box sx={{ position: 'absolute', top: pos.top, left: pos.left, width: pos.width, height: pos.height, bgcolor: cc.bg, borderBottom: `2px solid ${cc.border}`, borderRadius: '2px', pointerEvents: 'auto', cursor: 'pointer', opacity: ann.resolved ? 0.4 : 1, '&:hover': { opacity: 1, boxShadow: `0 0 8px ${cc.border}` } }} />
                                </Tooltip>);
                            })}
                        </Box>
                    </Box>
                    {selectionPopup && isReviewer && (
                        <Fade in><Paper elevation={8} sx={{ position: 'absolute', top: selectionPopup.y - 160, left: Math.max(10, Math.min(selectionPopup.x - 160, (containerRef.current?.offsetWidth || 400) - 340)), width: 320, zIndex: 1000, borderRadius: '14px', overflow: 'hidden', bgcolor: cardBg, border: `1px solid ${borderColor}` }}>
                            <Box sx={{ px: 2, py: 1.5, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: textPrimary }}><HighlightIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle', color: HIGHLIGHT_COLORS[selectedColor].border }} /> Tambah Anotasi</Typography>
                                <IconButton size="small" onClick={() => { setSelectionPopup(null); window.getSelection()?.removeAllRanges(); }} sx={{ color: textSecondary, width: 24, height: 24 }}><CloseIcon sx={{ fontSize: 16 }} /></IconButton>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <Box sx={{ bgcolor: HIGHLIGHT_COLORS[selectedColor].bg, borderRadius: '8px', p: 1.5, mb: 1.5, borderLeft: `3px solid ${HIGHLIGHT_COLORS[selectedColor].border}` }}>
                                    <Typography sx={{ fontSize: '0.72rem', color: textPrimary, fontStyle: 'italic', lineHeight: 1.5 }}>"{selectionPopup.text.substring(0, 120)}{selectionPopup.text.length > 120 ? '...' : ''}"</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5 }}>
                                    {Object.entries(HIGHLIGHT_COLORS).map(([c, cfg]) => (<Chip key={c} label={`${cfg.icon} ${cfg.label}`} size="small" onClick={() => setSelectedColor(c)} sx={{ fontSize: '0.68rem', fontWeight: 700, height: 26, bgcolor: selectedColor === c ? cfg.bg : 'transparent', border: selectedColor === c ? `1.5px solid ${cfg.border}` : `1px solid ${borderColor}`, color: textPrimary, cursor: 'pointer', '&:hover': { bgcolor: cfg.bg } }} />))}
                                </Box>
                                <TextField multiline rows={2} fullWidth placeholder="Komentar (opsional)..." value={newComment} onChange={(e) => setNewComment(e.target.value)} size="small" sx={{ mb: 1.5, ...inputSx }} />
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                    <Button size="small" onClick={() => { setSelectionPopup(null); setNewComment(''); window.getSelection()?.removeAllRanges(); }} sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600, color: textSecondary }}>Batal</Button>
                                    <Button size="small" variant="contained" startIcon={<SendIcon sx={{ fontSize: 14 }} />} onClick={handleSaveFromPopup} disabled={saving}
                                        sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700, background: 'linear-gradient(135deg, #0d7a6a, #1abc9c)', '&:hover': { background: 'linear-gradient(135deg, #16a085, #0d7a6a)' } }}>
                                        {saving ? '...' : 'Simpan'}
                                    </Button>
                                </Box>
                            </Box>
                        </Paper></Fade>
                    )}
                </Box>
                {showSidebar && <Sidebar />}
            </Box>
        </Box>
    );
}
