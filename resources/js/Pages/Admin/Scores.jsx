import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, TextField, InputAdornment, Select, MenuItem,
    FormControl, InputLabel, Avatar, useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GradeIcon from '@mui/icons-material/Grade';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function AdminScores({ submissions = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('highest');
    const [limitResults, setLimitResults] = useState('all');

    const calculateAverageScore = (reviews) => {
        if (!reviews || reviews.length === 0) return 'N/A';
        const valid = reviews.filter(r => r.overall_score);
        if (valid.length === 0) return 'N/A';
        const totalAvg = valid.reduce((sum, r) => {
            const avg = (parseInt(r.originality_score || 0) + parseInt(r.relevance_score || 0) + parseInt(r.clarity_score || 0) + parseInt(r.methodology_score || 0) + parseInt(r.overall_score || 0)) / 5;
            return sum + avg;
        }, 0) / valid.length;
        return totalAvg.toFixed(1);
    };

    const getStatusChip = (status) => {
        const map = {
            accepted: { bg: isDark ? 'rgba(22,163,74,0.15)' : '#dcfce7', color: '#16a34a' },
            rejected: { bg: isDark ? 'rgba(239,68,68,0.15)' : '#fee2e2', color: '#dc2626' },
            under_review: { bg: isDark ? 'rgba(37,99,235,0.15)' : '#dbeafe', color: '#2563eb' },
            'under review': { bg: isDark ? 'rgba(37,99,235,0.15)' : '#dbeafe', color: '#2563eb' },
            revision_required_phase1: { bg: isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7', color: '#d97706' },
            revision_required_phase2: { bg: isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7', color: '#d97706' },
        };
        const s = map[status?.toLowerCase()] || { bg: isDark ? 'rgba(107,114,128,0.15)' : '#f3f4f6', color: '#6b7280' };
        return s;
    };

    let filteredSubmissions = submissions.filter(sub =>
        sub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder !== 'none') {
        filteredSubmissions = [...filteredSubmissions].sort((a, b) => {
            const avgA = calculateAverageScore(a.reviews);
            const avgB = calculateAverageScore(b.reviews);
            if (avgA === 'N/A' && avgB === 'N/A') return 0;
            if (avgA === 'N/A') return 1;
            if (avgB === 'N/A') return -1;
            return sortOrder === 'highest' ? parseFloat(avgB) - parseFloat(avgA) : parseFloat(avgA) - parseFloat(avgB);
        });
    }

    const totalFiltered = filteredSubmissions.length;
    if (limitResults !== 'all') filteredSubmissions = filteredSubmissions.slice(0, parseInt(limitResults));

    const withScores = submissions.filter(s => s.reviews?.some(r => r.overall_score)).length;
    const pendingReview = submissions.length - withScores;

    const cellSx = { borderBottom: `1px solid ${c.cardBorder}`, py: 1.5, fontSize: '0.825rem', color: c.textPrimary };
    const headCellSx = { ...cellSx, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: c.textMuted, bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb' };
    const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: '10px', '& fieldset': { borderColor: c.cardBorder }, '&:hover fieldset': { borderColor: '#1abc9c' }, '&.Mui-focused fieldset': { borderColor: '#1abc9c' } } };

    const stats = [
        { label: 'Total Submissions', value: submissions.length, icon: <AssignmentIcon />, color: '#1abc9c', bg: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5' },
        { label: 'With Scores', value: withScores, icon: <CheckCircleIcon />, color: '#2563eb', bg: isDark ? 'rgba(37,99,235,0.12)' : '#dbeafe' },
        { label: 'Pending Review', value: pendingReview, icon: <PendingActionsIcon />, color: '#d97706', bg: isDark ? 'rgba(245,158,11,0.12)' : '#fef3c7' },
    ];

    return (
        <SidebarLayout>
            <Head title="Scores" />
            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: { xs: '1.5rem', sm: '1.85rem' }, letterSpacing: '-0.02em' }}>
                        Scores & Rankings 📊
                    </Typography>
                    <Typography variant="body2" sx={{ color: c.textMuted, mt: 0.5 }}>{submissions.length} submissions tracked</Typography>
                </Box>

                {/* Stats */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                    {stats.map((s) => (
                        <Card key={s.label} elevation={0} sx={{ borderRadius: '14px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, transition: 'all 0.25s', '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 25px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}` } }}>
                            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar variant="rounded" sx={{ bgcolor: s.bg, width: 44, height: 44, borderRadius: '12px' }}>
                                        {React.cloneElement(s.icon, { sx: { color: s.color, fontSize: 22 } })}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>{s.label}</Typography>
                                        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: c.textPrimary, lineHeight: 1.2 }}>{s.value}</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Search & Sort */}
                <Card elevation={0} sx={{ borderRadius: '14px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, mb: 2.5 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField fullWidth placeholder="Search by title or author..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} size="small"
                                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: c.textMuted, fontSize: 20 }} /></InputAdornment> }}
                                sx={{ flex: 1, minWidth: 250, ...inputSx, '& .MuiOutlinedInput-root': { ...inputSx['& .MuiOutlinedInput-root'], bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb' }, '& input': { color: c.textPrimary, fontSize: '0.85rem' } }}
                            />
                            <FormControl size="small" sx={{ minWidth: 180, ...inputSx }}>
                                <InputLabel sx={{ color: c.textMuted }}>Sort by Score</InputLabel>
                                <Select value={sortOrder} label="Sort by Score" onChange={(e) => setSortOrder(e.target.value)} sx={{ bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb', color: c.textPrimary, fontSize: '0.85rem' }}>
                                    <MenuItem value="highest">Highest → Lowest</MenuItem>
                                    <MenuItem value="lowest">Lowest → Highest</MenuItem>
                                    <MenuItem value="none">No Sorting</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl size="small" sx={{ minWidth: 140, ...inputSx }}>
                                <InputLabel sx={{ color: c.textMuted }}>Show Top</InputLabel>
                                <Select value={limitResults} label="Show Top" onChange={(e) => setLimitResults(e.target.value)} sx={{ bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb', color: c.textPrimary, fontSize: '0.85rem' }}>
                                    <MenuItem value="all">All ({totalFiltered})</MenuItem>
                                    <MenuItem value="50">Top 50</MenuItem>
                                    <MenuItem value="20">Top 20</MenuItem>
                                    <MenuItem value="10">Top 10</MenuItem>
                                    <MenuItem value="3">Top 3</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card elevation={0} sx={{ borderRadius: '16px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, overflow: 'hidden' }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {['#', 'Title', 'Author', 'Status', 'Reviewers', 'Avg Score', 'Detail'].map(h => (
                                        <TableCell key={h} sx={headCellSx} align={h === 'Avg Score' ? 'center' : 'left'}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSubmissions.length === 0 ? (
                                    <TableRow><TableCell colSpan={7} align="center" sx={cellSx}>
                                        <Box sx={{ py: 5 }}><AssessmentIcon sx={{ fontSize: 48, color: isDark ? '#374151' : '#d1d5db', mb: 1 }} /><Typography variant="body2" sx={{ color: c.textMuted }}>No submissions found</Typography></Box>
                                    </TableCell></TableRow>
                                ) : filteredSubmissions.map((sub, idx) => {
                                    const avg = calculateAverageScore(sub.reviews);
                                    const valid = sub.reviews?.filter(r => r.overall_score) || [];
                                    const sc = getStatusChip(sub.status);
                                    const scoreNum = avg !== 'N/A' ? parseFloat(avg) : null;
                                    const scoreBg = scoreNum !== null ? (scoreNum >= 4 ? (isDark ? 'rgba(22,163,74,0.15)' : '#dcfce7') : scoreNum >= 3 ? (isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7') : (isDark ? 'rgba(239,68,68,0.15)' : '#fee2e2')) : 'transparent';
                                    const scoreColor = scoreNum !== null ? (scoreNum >= 4 ? '#16a34a' : scoreNum >= 3 ? '#d97706' : '#dc2626') : c.textMuted;

                                    return (
                                        <TableRow key={sub.id} hover sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb' } }}>
                                            <TableCell sx={{ ...cellSx, fontWeight: 600, color: c.textMuted, fontSize: '0.8rem' }}>#{sub.id}</TableCell>
                                            <TableCell sx={{ ...cellSx, maxWidth: 250 }}>
                                                <Typography variant="body2" noWrap sx={{ fontWeight: 600, fontSize: '0.825rem', maxWidth: 250 }}>{sub.title}</Typography>
                                            </TableCell>
                                            <TableCell sx={cellSx}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 30, height: 30, bgcolor: '#1abc9c', fontSize: '0.75rem', fontWeight: 700 }}>{(sub.user?.name || 'U').charAt(0)}</Avatar>
                                                    <Typography variant="body2" sx={{ fontSize: '0.825rem', color: c.textPrimary }}>{sub.user?.name || 'Unknown'}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={cellSx}>
                                                <Chip label={sub.status} size="small" sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px', height: 24 }} />
                                            </TableCell>
                                            <TableCell sx={cellSx}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.825rem' }}>{sub.reviews?.length || 0} assigned</Typography>
                                                <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.7rem' }}>{valid.length} completed</Typography>
                                            </TableCell>
                                            <TableCell align="center" sx={cellSx}>
                                                {scoreNum !== null ? (
                                                    <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: scoreBg, color: scoreColor, px: 2, py: 0.75, borderRadius: '8px', minWidth: 55 }}>
                                                        <Typography sx={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}>{avg}</Typography>
                                                    </Box>
                                                ) : (
                                                    <Chip label="N/A" size="small" sx={{ bgcolor: isDark ? 'rgba(107,114,128,0.15)' : '#f3f4f6', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px', height: 24 }} />
                                                )}
                                            </TableCell>
                                            <TableCell sx={cellSx}>
                                                {valid.length > 0 ? (
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                        {valid.map((r, i) => {
                                                            const rAvg = ((parseInt(r.originality_score || 0) + parseInt(r.relevance_score || 0) + parseInt(r.clarity_score || 0) + parseInt(r.methodology_score || 0) + parseInt(r.overall_score || 0)) / 5).toFixed(1);
                                                            const rNum = parseFloat(rAvg);
                                                            return (
                                                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 70, color: c.textMuted, fontSize: '0.7rem' }}>Reviewer {i + 1}:</Typography>
                                                                    <Chip label={rAvg} size="small" sx={{ bgcolor: rNum >= 4 ? (isDark ? 'rgba(22,163,74,0.15)' : '#dcfce7') : rNum >= 3 ? (isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7') : (isDark ? 'rgba(239,68,68,0.15)' : '#fee2e2'), color: rNum >= 4 ? '#16a34a' : rNum >= 3 ? '#d97706' : '#dc2626', fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px', height: 22 }} />
                                                                </Box>
                                                            );
                                                        })}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="caption" sx={{ fontStyle: 'italic', color: c.textMuted, fontSize: '0.75rem' }}>No scores yet</Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Box>
        </SidebarLayout>
    );
}
