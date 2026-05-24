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
import MyLocationIcon from '@mui/icons-material/MyLocation';
import axios from 'axios';

const HIGHLIGHT_COLORS = {
    yellow: { bg: 'rgba(250,204,21,0.35)', border: '#facc15', label: 'Catatan', icon: '📝', desc: 'Catatan umum' },
    red:    { bg: 'rgba(239,68,68,0.3)', border: '#ef4444', label: 'Kesalahan', icon: '❌', desc: 'Perlu diperbaiki' },
    green:  { bg: 'rgba(34,197,94,0.3)', border: '#22c55e', label: 'Sudah Baik', icon: '✅', desc: 'Bagian yang bagus' },
    blue:   { bg: 'rgba(59,130,246,0.3)', border: '#3b82f6', label: 'Saran', icon: 'ℹ️', desc: 'Saran perbaikan' },
};

// Styles for the DOCX document
const DOCX_STYLES = `
    .docx-page-wrap {
        background: #fff;
        max-width: 850px;
        margin: 20px auto;
        padding: 60px 70px;
        box-shadow: 0 2px 20px rgba(0,0,0,0.08);
        border-radius: 4px;
        min-height: 1100px;
        position: relative;
    }
    .docx-page-wrap * { box-sizing: border-box; }
    .docx-page-wrap p {
        font-family: 'Times New Roman', 'Serif', Georgia, serif;
        font-size: 12pt;
        line-height: 2;
        color: #1a1a1a;
        margin: 0 0 6px 0;
        text-align: justify;
        word-wrap: break-word;
    }
    .docx-page-wrap h1, .docx-page-wrap h2, .docx-page-wrap h3, .docx-page-wrap h4 {
        font-family: 'Times New Roman', serif;
        color: #111;
        margin: 16px 0 8px;
        line-height: 1.4;
    }
    .docx-page-wrap h1 { font-size: 16pt; font-weight: bold; }
    .docx-page-wrap h2 { font-size: 14pt; font-weight: bold; }
    .docx-page-wrap h3 { font-size: 13pt; font-weight: bold; }
    .docx-page-wrap h4 { font-size: 12pt; font-weight: bold; }
    .docx-page-wrap strong, .docx-page-wrap b { font-weight: bold; }
    .docx-page-wrap em, .docx-page-wrap i { font-style: italic; }
    .docx-page-wrap u { text-decoration: underline; }
    .docx-page-wrap img {
        display: block;
        max-width: 60%;
        height: auto;
        margin: 16px auto;
    }
    .docx-page-wrap table {
        border-collapse: collapse;
        width: 100%;
        margin: 12px 0;
        font-size: 11pt;
    }
    .docx-page-wrap td, .docx-page-wrap th {
        border: 1px solid #999;
        padding: 6px 10px;
        font-family: 'Times New Roman', serif;
        vertical-align: top;
    }
    .docx-page-wrap th {
        background: #f0f0f0;
        font-weight: bold;
    }
    .docx-page-wrap ul, .docx-page-wrap ol {
        margin: 6px 0 6px 24px;
        font-family: 'Times New Roman', serif;
        font-size: 12pt;
        line-height: 2;
    }
    .docx-page-wrap a { color: #1a73e8; text-decoration: underline; }
    .docx-page-wrap sup { font-size: 8pt; vertical-align: super; }
    .docx-page-wrap sub { font-size: 8pt; vertical-align: sub; }
    .docx-page-wrap ::selection { background: rgba(26,188,156,0.35); }

    @keyframes scrollHighlight {
        0% { background: rgba(250,204,21,0.7); box-shadow: 0 0 0 4px rgba(250,204,21,0.3); }
        50% { background: rgba(250,204,21,0.4); box-shadow: 0 0 0 8px rgba(250,204,21,0.15); }
        100% { background: rgba(250,204,21,0.2); box-shadow: none; }
    }
    .annotation-scroll-target {
        background: rgba(250,204,21,0.5) !important;
        border-radius: 3px;
        padding: 1px 3px;
        border-bottom: 3px solid #facc15;
        animation: scrollHighlight 2s ease-out 1 forwards;
        scroll-margin-top: 80px;
    }
`;

export default function PdfAnnotator({
    fileUrl, submissionId,
    annotations: initialAnnotations = [],
    isReviewer = false, isDark = false,
    currentReviewId = null, currentUserId = null,
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

    // DOCX
    const [docHtml, setDocHtml] = useState('');
    const [docError, setDocError] = useState(false);

    // Manual form
    const [showAddForm, setShowAddForm] = useState(false);
    const [manualPage, setManualPage] = useState('');
    const [manualText, setManualText] = useState('');
    const [manualComment, setManualComment] = useState('');

    const cardBg = isDark ? 'rgba(17,24,39,0.95)' : '#ffffff';
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
    const textPrimary = isDark ? '#f3f4f6' : '#111827';
    const textSecondary = isDark ? '#9ca3af' : '#6b7280';

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
                const resp = await fetch(fileUrl);
                if (!resp.ok) throw new Error('Fetch failed');
                const buf = await resp.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer: buf }, {
                    styleMap: [
                        "p[style-name='Title'] => h1:fresh",
                        "p[style-name='Heading 1'] => h1:fresh",
                        "p[style-name='Heading 2'] => h2:fresh",
                        "p[style-name='Heading 3'] => h3:fresh",
                    ],
                });
                setDocHtml(result.value);
            } catch (err) {
                console.error('DOCX load error:', err);
                setDocError(true);
            }
            setLoading(false);
        };
        loadDocx();
    }, [fileUrl, isPdf]);

    // ─── PDF: Load ───
    useEffect(() => {
        if (!isPdf) return;
        let cancelled = false;
        (async () => {
            try {
                const pdfjsLib = await import('pdfjs-dist');
                pdfjsLib.GlobalWorkerOptions.workerSrc = '/build/pdf.worker.min.js';
                const pdf = await (pdfjsLib.getDocument(fileUrl)).promise;
                if (!cancelled) { setPdfDoc(pdf); setTotalPages(pdf.numPages); setLoading(false); }
            } catch (err) { console.error(err); setLoading(false); }
        })();
        return () => { cancelled = true; };
    }, [fileUrl, isPdf]);

    // PDF: Render page
    useEffect(() => {
        if (!isPdf || !pdfDoc || !canvasRef.current) return;
        (async () => {
            try {
                const page = await pdfDoc.getPage(currentPage);
                const vp = page.getViewport({ scale });
                const c = canvasRef.current;
                c.height = vp.height; c.width = vp.width;
                if (renderTaskRef.current) renderTaskRef.current.cancel();
                const t = page.render({ canvasContext: c.getContext('2d'), viewport: vp });
                renderTaskRef.current = t;
                await t.promise;
            } catch (e) { if (e.name !== 'RenderingCancelled') console.error(e); }
        })();
    }, [pdfDoc, currentPage, scale, isPdf]);

    // ─── DOCX: Text selection → auto fill form ───
    const handleDocSelect = useCallback(() => {
        if (!isReviewer) return;
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) return;
        const text = sel.toString().trim();
        if (text.length >= 3) {
            setManualText(text);
            setShowAddForm(true);
        }
    }, [isReviewer]);

    // ─── DOCX: Scroll to text ───
    const scrollToText = useCallback((searchText, annotationId) => {
        if (!docViewerRef.current || !searchText) return;
        setActiveAnnotationId(annotationId);

        // Clear previous highlights
        docViewerRef.current.querySelectorAll('.annotation-scroll-target').forEach(el => {
            const parent = el.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(el.textContent), el);
                parent.normalize();
            }
        });

        // Search for text
        const search = searchText.toLowerCase().trim();
        // Try first 50 chars for matching
        const query = search.substring(0, 50);
        const walker = document.createTreeWalker(docViewerRef.current, NodeFilter.SHOW_TEXT);
        let found = false;

        while (walker.nextNode()) {
            const node = walker.currentNode;
            const idx = node.textContent.toLowerCase().indexOf(query);
            if (idx === -1) continue;

            try {
                const range = document.createRange();
                range.setStart(node, idx);
                range.setEnd(node, Math.min(idx + query.length, node.textContent.length));
                const mark = document.createElement('mark');
                mark.className = 'annotation-scroll-target';
                range.surroundContents(mark);
                mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
                found = true;
                break;
            } catch (e) {
                // If surroundContents fails (spans multiple elements), try scrolling to the node
                const parent = node.parentElement;
                if (parent) {
                    parent.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    parent.style.transition = 'background 0.3s';
                    parent.style.background = 'rgba(250,204,21,0.4)';
                    parent.style.borderRadius = '4px';
                    setTimeout(() => { parent.style.background = ''; }, 4000);
                    found = true;
                }
                break;
            }
        }

        // Auto-clear highlight
        setTimeout(() => {
            docViewerRef.current?.querySelectorAll('.annotation-scroll-target').forEach(el => {
                const parent = el.parentNode;
                if (parent) {
                    parent.replaceChild(document.createTextNode(el.textContent), el);
                    parent.normalize();
                }
            });
            setActiveAnnotationId(null);
        }, 4000);

        if (!found) setTimeout(() => setActiveAnnotationId(null), 1500);
    }, []);

    // ─── Save / Delete / Toggle ───
    const saveAnnotation = async (payload) => {
        setSaving(true);
        try {
            const res = await axios.post(`/reviewer/submissions/${submissionId}/annotations`, payload);
            setAnnotations(prev => [...prev, res.data]);
            setSuccessMsg('✅ Anotasi berhasil disimpan!');
            setTimeout(() => setSuccessMsg(''), 3000);
            return true;
        } catch (err) { console.error(err); alert('Gagal menyimpan. Coba lagi.'); return false; }
        finally { setSaving(false); }
    };

    const handleSavePopup = async () => {
        if (!selectionPopup) return;
        if (await saveAnnotation({ page_number: currentPage, highlight_color: selectedColor, selected_text: selectionPopup.text, comment: newComment || null, position_data: selectionPopup.positionData })) {
            setSelectionPopup(null); setNewComment(''); window.getSelection()?.removeAllRanges();
        }
    };

    const handleSubmitManual = async () => {
        if (!manualText.trim()) return;
        if (await saveAnnotation({ page_number: parseInt(manualPage) || 1, highlight_color: selectedColor, selected_text: manualText.trim(), comment: manualComment.trim() || null, position_data: { manual: true } })) {
            setManualText(''); setManualComment(''); setManualPage(''); setShowAddForm(false); window.getSelection()?.removeAllRanges();
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus anotasi ini?')) return;
        try { await axios.delete(`/reviewer/annotations/${id}`); setAnnotations(p => p.filter(a => a.id !== id)); } catch (e) { console.error(e); }
    };

    const handleToggle = async (ann) => {
        try { const r = await axios.put(`/reviewer/annotations/${ann.id}`, { resolved: !ann.resolved }); setAnnotations(p => p.map(a => a.id === ann.id ? r.data : a)); } catch (e) { console.error(e); }
    };

    const annotationCount = annotations.length;
    const inputSx = {
        '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.85rem', fontFamily: 'Inter,sans-serif', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#fff', '& fieldset': { borderColor }, '&:hover fieldset': { borderColor: '#1abc9c' }, '&.Mui-focused fieldset': { borderColor: '#1abc9c', borderWidth: 2 } },
        '& textarea, & input': { color: textPrimary }, '& .MuiInputLabel-root': { color: textSecondary, fontSize: '0.82rem' }, '& .MuiInputLabel-root.Mui-focused': { color: '#1abc9c' },
    };

    if (loading) return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 500, bgcolor: isDark ? '#111827' : '#f8fafc', borderRadius: '14px', border: `1px solid ${borderColor}` }}>
            <Box sx={{ textAlign: 'center' }}>
                <MenuBookIcon sx={{ color: '#1abc9c', fontSize: 36, mb: 1, opacity: 0.6 }} />
                <Typography sx={{ color: textSecondary, fontSize: '0.85rem' }}>Memuat dokumen...</Typography>
            </Box>
        </Box>
    );

    // ─── SIDEBAR ───
    const Sidebar = () => (
        <Paper elevation={0} sx={{ width: { xs: '100%', md: 360 }, flexShrink: 0, borderRadius: '14px', border: `1px solid ${borderColor}`, bgcolor: cardBg, overflow: 'hidden', maxHeight: 700, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: `1px solid ${borderColor}`, bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#fafbfd' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RateReviewIcon sx={{ fontSize: 20, color: '#1abc9c' }} />
                        <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: textPrimary, fontFamily: 'Inter,sans-serif' }}>Review Panel</Typography>
                        {annotationCount > 0 && <Chip label={annotationCount} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#1abc9c', color: '#fff', borderRadius: '10px' }} />}
                    </Box>
                    <IconButton size="small" onClick={() => setShowSidebar(false)} sx={{ color: textSecondary }}><CloseIcon sx={{ fontSize: 16 }} /></IconButton>
                </Box>
                {successMsg && <Alert severity="success" sx={{ mb: 1, borderRadius: '10px', fontSize: '0.78rem', py: 0 }}>{successMsg}</Alert>}
                {isReviewer && !showAddForm && (
                    <Button fullWidth variant="contained" startIcon={<AddCommentIcon />} onClick={() => setShowAddForm(true)}
                        sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.85rem', py: 1.2, borderRadius: '12px', background: 'linear-gradient(135deg,#0d7a6a,#1abc9c)', boxShadow: '0 4px 14px rgba(26,188,156,0.3)', '&:hover': { background: 'linear-gradient(135deg,#16a085,#0d7a6a)' } }}>
                        ✍️ Tambah Anotasi Baru
                    </Button>
                )}
            </Box>

            {showAddForm && isReviewer && (
                <Box sx={{ p: 2, borderBottom: `1px solid ${borderColor}`, bgcolor: isDark ? 'rgba(26,188,156,0.02)' : '#f0fdf9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 800, color: textPrimary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EditNoteIcon sx={{ fontSize: 18, color: '#1abc9c' }} /> Anotasi Baru
                        </Typography>
                        <IconButton size="small" onClick={() => { setShowAddForm(false); setManualText(''); setManualComment(''); }} sx={{ color: textSecondary }}><CloseIcon sx={{ fontSize: 16 }} /></IconButton>
                    </Box>
                    {!isPdf && (
                        <Box sx={{ bgcolor: '#eff6ff', borderRadius: '10px', p: 1.5, mb: 2, border: '1px solid #dbeafe' }}>
                            <Typography sx={{ fontSize: '0.73rem', color: '#1d4ed8', lineHeight: 1.6 }}>
                                💡 <b>Tip:</b> Blok/select teks di dokumen → otomatis terisi di sini!
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#1abc9c', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>📄 Halaman</Typography>
                        <TextField fullWidth size="small" type="number" placeholder="Contoh: 5" value={manualPage} onChange={(e) => setManualPage(e.target.value)} inputProps={{ min: 1 }} sx={inputSx} />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#1abc9c', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>📝 Kutipan Teks *</Typography>
                        <TextField fullWidth size="small" multiline rows={3} placeholder='Salin teks yang ingin di-review...' value={manualText} onChange={(e) => setManualText(e.target.value)} sx={inputSx} />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#1abc9c', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>💬 Komentar / Koreksi</Typography>
                        <TextField fullWidth size="small" multiline rows={3} placeholder="Tuliskan koreksi Anda..." value={manualComment} onChange={(e) => setManualComment(e.target.value)} sx={inputSx} />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#1abc9c', mb: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🏷️ Kategori</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {Object.entries(HIGHLIGHT_COLORS).map(([c, cfg]) => (
                                <Chip key={c} label={`${cfg.icon} ${cfg.label}`} size="small" onClick={() => setSelectedColor(c)}
                                    sx={{ fontSize: '0.7rem', fontWeight: 700, height: 28, cursor: 'pointer', bgcolor: selectedColor === c ? cfg.bg : 'transparent', border: selectedColor === c ? `2px solid ${cfg.border}` : `1px solid ${borderColor}`, borderRadius: '8px', color: textPrimary, '&:hover': { bgcolor: cfg.bg } }} />
                            ))}
                        </Box>
                    </Box>
                    <Button fullWidth variant="contained" startIcon={<SendIcon sx={{ fontSize: 16 }} />} onClick={handleSubmitManual} disabled={!manualText.trim() || saving}
                        sx={{ textTransform: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.88rem', py: 1.2, background: 'linear-gradient(135deg,#0d7a6a,#1abc9c)', '&:hover': { background: 'linear-gradient(135deg,#16a085,#0d7a6a)' }, boxShadow: '0 4px 14px rgba(26,188,156,0.3)', '&.Mui-disabled': { bgcolor: '#e5e7eb' } }}>
                        {saving ? 'Menyimpan...' : '💾 Simpan Anotasi'}
                    </Button>
                </Box>
            )}

            <Box sx={{ flex: 1, overflow: 'auto', p: 1.5 }}>
                {annotations.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 5, px: 2 }}>
                        <RateReviewIcon sx={{ fontSize: 28, color: '#1abc9c', opacity: 0.4, mb: 1 }} />
                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: textPrimary, mb: 0.5 }}>Belum ada anotasi</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: textSecondary, lineHeight: 1.6 }}>
                            {isReviewer ? 'Blok teks di dokumen atau klik "Tambah Anotasi Baru".' : 'Reviewer belum memberikan anotasi.'}
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
                            {Object.entries(HIGHLIGHT_COLORS).map(([c, cfg]) => {
                                const cnt = annotations.filter(a => a.highlight_color === c).length;
                                return cnt > 0 ? <Chip key={c} label={`${cfg.icon} ${cnt}`} size="small" sx={{ height: 22, fontSize: '0.68rem', fontWeight: 700, bgcolor: cfg.bg, color: textPrimary, borderRadius: '8px' }} /> : null;
                            })}
                        </Box>
                        {!isPdf && (
                            <Box sx={{ bgcolor: '#ecfdf5', borderRadius: '8px', p: 1, mb: 1.5, border: '1px solid #d1fae5' }}>
                                <Typography sx={{ fontSize: '0.7rem', color: '#059669', textAlign: 'center', fontWeight: 600 }}>
                                    <MyLocationIcon sx={{ fontSize: 13, verticalAlign: 'middle', mr: 0.3 }} /> Klik anotasi → langsung scroll ke teks di dokumen
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
                                        onClick={() => { if (!isPdf) scrollToText(ann.selected_text, ann.id); else setCurrentPage(ann.page_number); }}
                                        sx={{
                                            p: 1.5, borderRadius: '12px', cursor: 'pointer',
                                            border: isActive ? `2px solid ${cc.border}` : `1px solid ${borderColor}`,
                                            borderLeft: `4px solid ${cc.border}`,
                                            bgcolor: isActive ? cc.bg : (ann.resolved ? '#f0fdf4' : '#fafafa'),
                                            opacity: ann.resolved ? 0.65 : 1,
                                            transition: 'all 0.3s', transform: isActive ? 'scale(1.02)' : 'scale(1)',
                                            boxShadow: isActive ? `0 4px 16px ${cc.border}40` : 'none',
                                            '&:hover': { borderColor: cc.border, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transform: 'scale(1.01)' },
                                        }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Chip label={`Hal. ${ann.page_number}`} size="small" sx={{ height: 20, fontSize: '0.63rem', fontWeight: 800, bgcolor: '#f1f5f9', color: textSecondary, borderRadius: '6px' }} />
                                                <Chip label={`${cc.icon} ${cc.label}`} size="small" sx={{ height: 20, fontSize: '0.63rem', fontWeight: 700, bgcolor: cc.bg, color: textPrimary, borderRadius: '6px' }} />
                                            </Box>
                                            {isOwn && isReviewer && (
                                                <Box sx={{ display: 'flex', gap: 0.3 }}>
                                                    <Tooltip title={ann.resolved ? 'Batalkan' : 'Selesai'}>
                                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleToggle(ann); }} sx={{ width: 24, height: 24, color: ann.resolved ? '#22c55e' : textSecondary }}>
                                                            {ann.resolved ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />}
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Hapus">
                                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(ann.id); }} sx={{ width: 24, height: 24, color: '#ef4444', opacity: 0.5, '&:hover': { opacity: 1 } }}>
                                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            )}
                                        </Box>
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: textSecondary, mb: 0.5 }}>👤 {ann.user?.name || 'Reviewer'}</Typography>
                                        <Box sx={{ bgcolor: cc.bg, borderRadius: '8px', p: 1, mb: ann.comment ? 1 : 0, borderLeft: `3px solid ${cc.border}` }}>
                                            <Typography sx={{ fontSize: '0.78rem', color: textPrimary, fontStyle: 'italic', lineHeight: 1.6, textDecoration: ann.resolved ? 'line-through' : 'none' }}>
                                                "{ann.selected_text?.substring(0, 150)}{ann.selected_text?.length > 150 ? '...' : ''}"
                                            </Typography>
                                        </Box>
                                        {ann.comment && (
                                            <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'flex-start', bgcolor: '#f8fafc', borderRadius: '8px', p: 1, border: '1px solid #f1f5f9' }}>
                                                <CommentIcon sx={{ fontSize: 14, color: '#1abc9c', mt: 0.2, flexShrink: 0 }} />
                                                <Typography sx={{ fontSize: '0.78rem', color: textPrimary, lineHeight: 1.6 }}>{ann.comment}</Typography>
                                            </Box>
                                        )}
                                        {ann.resolved && <Chip label="✓ Sudah Dikoreksi" size="small" sx={{ mt: 1, height: 20, fontSize: '0.63rem', fontWeight: 700, bgcolor: '#dcfce7', color: '#16a34a', borderRadius: '6px' }} />}
                                    </Paper>
                                );
                            })}
                        </Stack>
                    </>
                )}
            </Box>
        </Paper>
    );

    // ═══════════════════════════════════════════════
    // DOCX MODE
    // ═══════════════════════════════════════════════
    if (!isPdf) {
        const fullUrl = `${window.location.origin}${fileUrl}`;
        return (
            <Box>
                <style>{DOCX_STYLES}</style>
                <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, p: 1.5, mb: 1.5, borderRadius: '12px', bgcolor: '#f8fafc', border: `1px solid ${borderColor}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RateReviewIcon sx={{ fontSize: 20, color: '#1abc9c' }} />
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: textPrimary, fontFamily: 'Inter,sans-serif' }}>Mode Review Dokumen</Typography>
                    </Box>
                    <Button size="small"
                        startIcon={<Badge badgeContent={annotationCount} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 16, height: 16 } }}><FormatListBulletedIcon fontSize="small" /></Badge>}
                        onClick={() => setShowSidebar(!showSidebar)}
                        sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', borderRadius: '10px', px: 2, color: showSidebar ? '#fff' : textSecondary, bgcolor: showSidebar ? '#1abc9c' : 'transparent', '&:hover': { bgcolor: showSidebar ? '#16a085' : '#f0fdf9' } }}>
                        Review Panel
                    </Button>
                </Paper>

                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                    {/* Document */}
                    <Box sx={{ flex: 1, borderRadius: '14px', overflow: 'hidden', border: `1px solid ${borderColor}`, bgcolor: '#e8e8e8', maxHeight: 700, overflowY: 'auto' }}>
                        {docError ? (
                            <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(fullUrl)}&embedded=true`} width="100%" height="700" style={{ border: 'none', display: 'block' }} title="Doc" />
                        ) : (
                            <Box ref={docViewerRef} className="docx-page-wrap" onMouseUp={handleDocSelect}
                                dangerouslySetInnerHTML={{ __html: docHtml }}
                            />
                        )}
                    </Box>
                    {showSidebar && <Sidebar />}
                </Box>
            </Box>
        );
    }

    // ═══════════════════════════════════════════════
    // PDF MODE
    // ═══════════════════════════════════════════════
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
        setSelectionPopup({ x: rect.left - cRect.left + rect.width / 2, y: rect.top - cRect.top - 10, text, positionData: { top: rect.top - cRect.top, left: rect.left - cRect.left, width: rect.width, height: rect.height } });
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, p: 1.5, mb: 1.5, borderRadius: '12px', bgcolor: '#f8fafc', border: `1px solid ${borderColor}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} sx={{ color: textSecondary }}><NavigateBeforeIcon fontSize="small" /></IconButton>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: textPrimary, fontFamily: 'Inter,sans-serif', minWidth: 80, textAlign: 'center' }}>Hal. {currentPage} / {totalPages}</Typography>
                    <IconButton size="small" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} sx={{ color: textSecondary }}><NavigateNextIcon fontSize="small" /></IconButton>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor }} />
                    <IconButton size="small" onClick={() => setScale(s => Math.max(0.5, s - 0.25))} sx={{ color: textSecondary }}><ZoomOutIcon fontSize="small" /></IconButton>
                    <Typography sx={{ fontSize: '0.75rem', color: textSecondary, fontWeight: 600, minWidth: 40, textAlign: 'center' }}>{Math.round(scale * 100)}%</Typography>
                    <IconButton size="small" onClick={() => setScale(s => Math.min(3, s + 0.25))} sx={{ color: textSecondary }}><ZoomInIcon fontSize="small" /></IconButton>
                </Box>
                {isReviewer && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <HighlightIcon sx={{ fontSize: 18, color: textSecondary, mr: 0.5 }} />
                        {Object.entries(HIGHLIGHT_COLORS).map(([c, cfg]) => (
                            <Tooltip key={c} title={`${cfg.icon} ${cfg.label}`} arrow>
                                <IconButton size="small" onClick={() => setSelectedColor(c)}
                                    sx={{ width: 28, height: 28, bgcolor: cfg.bg, border: selectedColor === c ? `2.5px solid ${cfg.border}` : '2px solid transparent', borderRadius: '8px', transition: 'all 0.2s', transform: selectedColor === c ? 'scale(1.15)' : 'scale(1)', '&:hover': { transform: 'scale(1.15)', border: `2px solid ${cfg.border}` } }} />
                            </Tooltip>
                        ))}
                    </Box>
                )}
                <Button size="small" startIcon={<Badge badgeContent={annotationCount} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 16, height: 16 } }}><FormatListBulletedIcon fontSize="small" /></Badge>}
                    onClick={() => setShowSidebar(!showSidebar)}
                    sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', borderRadius: '10px', px: 2, color: showSidebar ? '#fff' : textSecondary, bgcolor: showSidebar ? '#1abc9c' : 'transparent', '&:hover': { bgcolor: showSidebar ? '#16a085' : '#f0fdf9' } }}>
                    Review Panel
                </Button>
            </Paper>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box ref={containerRef} onMouseUp={handleMouseUp} sx={{ flex: 1, position: 'relative', overflow: 'auto', borderRadius: '14px', border: `1px solid ${borderColor}`, bgcolor: '#525659', maxHeight: 700 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, position: 'relative' }}>
                        <canvas ref={canvasRef} style={{ display: 'block', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }} />
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                            {annotations.filter(a => a.page_number === currentPage).map(ann => {
                                const pos = ann.position_data; if (!pos || pos.manual) return null;
                                const cc = HIGHLIGHT_COLORS[ann.highlight_color] || HIGHLIGHT_COLORS.yellow;
                                return (<Tooltip key={ann.id} title={<Box sx={{ p: 0.5 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 700 }}>{ann.user?.name}</Typography><Typography sx={{ fontSize: '0.75rem', fontStyle: 'italic' }}>"{ann.selected_text?.substring(0, 80)}"</Typography>{ann.comment && <Typography sx={{ fontSize: '0.72rem', mt: 0.5, pt: 0.5, borderTop: '1px solid rgba(255,255,255,0.2)' }}>💬 {ann.comment}</Typography>}</Box>} arrow>
                                    <Box sx={{ position: 'absolute', top: pos.top, left: pos.left, width: pos.width, height: pos.height, bgcolor: cc.bg, borderBottom: `2px solid ${cc.border}`, borderRadius: '2px', pointerEvents: 'auto', cursor: 'pointer', opacity: ann.resolved ? 0.4 : 1, '&:hover': { opacity: 1, boxShadow: `0 0 8px ${cc.border}` } }} />
                                </Tooltip>);
                            })}
                        </Box>
                    </Box>
                    {selectionPopup && isReviewer && (
                        <Fade in><Paper elevation={8} sx={{ position: 'absolute', top: selectionPopup.y - 160, left: Math.max(10, Math.min(selectionPopup.x - 160, (containerRef.current?.offsetWidth || 400) - 340)), width: 320, zIndex: 1000, borderRadius: '14px', overflow: 'hidden', bgcolor: cardBg, border: `1px solid ${borderColor}` }}>
                            <Box sx={{ px: 2, py: 1.5, bgcolor: '#f8fafc', borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                    <Button size="small" variant="contained" startIcon={<SendIcon sx={{ fontSize: 14 }} />} onClick={handleSavePopup} disabled={saving}
                                        sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700, background: 'linear-gradient(135deg,#0d7a6a,#1abc9c)', '&:hover': { background: 'linear-gradient(135deg,#16a085,#0d7a6a)' } }}>
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
