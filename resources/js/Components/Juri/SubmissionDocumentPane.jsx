import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Chip, Button, Stack,
    useTheme, Tabs, Tab, IconButton, Tooltip, Divider,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import TagIcon from '@mui/icons-material/Tag';
import DescriptionIcon from '@mui/icons-material/Description';
import UniversalDocumentViewer, {
    getFileUrl, getCoAuthorsList, getKeywordsList, ModalErrorBoundary,
} from './UniversalDocumentViewer';

/**
 * SubmissionDocumentPane
 * Dedicated Split-Screen pane for viewing Full Paper, Presentation Slides/Poster, and Abstract
 */
export default function SubmissionDocumentPane({
    submission,
    rubricType = 'oral',
    height = 'calc(100vh - 140px)',
}) {
    const theme = useTheme();
    const c = theme.palette.custom || {};
    const isDark = theme.palette.mode === 'dark';
    const isOral = rubricType === 'oral';

    const hasPaper = Boolean(submission.full_paper_file);
    const hasSlides = Boolean(submission.presentation_file || submission.abstract_file);
    const hasAbstract = Boolean(submission.abstract);

    const defaultTab = hasPaper ? 'paper' : (hasSlides ? 'slides' : 'abstract');
    const [activeTab, setActiveTab] = useState(defaultTab);

    const coAuthors = getCoAuthorsList(submission);
    const keywords = getKeywordsList(submission);

    // Active file URL and title
    const currentFileUrl = activeTab === 'paper'
        ? getFileUrl(submission.full_paper_file)
        : (activeTab === 'slides' ? getFileUrl(submission.presentation_file || submission.abstract_file) : '');

    const currentDocTitle = activeTab === 'paper'
        ? 'Full Paper (PDF)'
        : (isOral ? 'Presentation Slides' : 'Poster Document');

    return (
        <Card elevation={0} sx={{
            height,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: { xs: '18px', lg: '24px' },
            border: `1.5px solid ${c.cardBorder || 'rgba(0,0,0,0.1)'}`,
            bgcolor: c.cardBg || '#ffffff',
            boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.3)' : '0 8px 30px rgba(0,0,0,0.03)',
            overflow: 'hidden',
            position: 'sticky',
            top: 24,
        }}>
            {/* ── TOP CONTROL TABS & HEADER ── */}
            <Box sx={{
                px: 2,
                py: 1,
                bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                borderBottom: `1.5px solid ${c.cardBorder || 'rgba(0,0,0,0.1)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
            }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, val) => setActiveTab(val)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        minHeight: 40,
                        '& .MuiTab-root': {
                            minHeight: 40,
                            py: 0.5,
                            px: 1.5,
                            textTransform: 'none',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            borderRadius: '10px',
                            minWidth: 'auto',
                            color: c.textSecondary || '#64748b',
                            '&.Mui-selected': {
                                color: isDark ? '#34d399' : '#059669',
                                bgcolor: isDark ? 'rgba(5, 150, 105, 0.15)' : '#ecfdf5',
                            },
                        },
                        '& .MuiTabs-indicator': {
                            display: 'none',
                        },
                    }}
                >
                    <Tab
                        value="paper"
                        icon={<PictureAsPdfIcon sx={{ fontSize: 16 }} />}
                        iconPosition="start"
                        label={`Full Paper ${hasPaper ? '✓' : '(—)'}`}
                    />
                    <Tab
                        value="slides"
                        icon={isOral ? <CoPresentIcon sx={{ fontSize: 16 }} /> : <ArticleIcon sx={{ fontSize: 16 }} />}
                        iconPosition="start"
                        label={isOral ? `Slides ${hasSlides ? '✓' : '(—)'}` : `Poster ${hasSlides ? '✓' : '(—)'}`}
                    />
                    <Tab
                        value="abstract"
                        icon={<DescriptionIcon sx={{ fontSize: 16 }} />}
                        iconPosition="start"
                        label="Abstrak & Meta"
                    />
                </Tabs>

                {/* External Actions */}
                {currentFileUrl && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Tooltip title="Buka di tab browser baru" arrow>
                            <IconButton
                                size="small"
                                component="a"
                                href={currentFileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    border: `1px solid ${c.cardBorder || 'rgba(0,0,0,0.1)'}`,
                                    borderRadius: '8px',
                                    color: c.textSecondary,
                                    p: 0.6,
                                }}
                            >
                                <OpenInNewIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Unduh file dokumen" arrow>
                            <IconButton
                                size="small"
                                component="a"
                                href={currentFileUrl}
                                download
                                sx={{
                                    border: `1px solid ${c.cardBorder || 'rgba(0,0,0,0.1)'}`,
                                    borderRadius: '8px',
                                    color: c.textSecondary,
                                    p: 0.6,
                                }}
                            >
                                <DownloadIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                )}
            </Box>

            {/* ── VIEWER CONTENT ── */}
            <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <ModalErrorBoundary>
                    {activeTab === 'paper' && (
                        hasPaper ? (
                            <UniversalDocumentViewer
                                fileUrl={currentFileUrl}
                                fileName={submission.full_paper_file.split('/').pop()}
                                rubricType={rubricType}
                                docTitle={currentDocTitle}
                                heightOverride="100%"
                            />
                        ) : (
                            <Box sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <PictureAsPdfIcon sx={{ fontSize: 52, color: '#94a3b8', mb: 1.5, opacity: 0.6 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary, mb: 0.5 }}>
                                    Full Paper Belum Tersedia
                                </Typography>
                                <Typography variant="body2" sx={{ color: c.textSecondary, maxWidth: 360, fontSize: '0.8rem', mb: 2 }}>
                                    Penulis belum mengunggah berkas naskah lengkap (Full Paper PDF) untuk submission ini. Silakan periksa tab Abstrak atau Slide Presentasi.
                                </Typography>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => setActiveTab('abstract')}
                                    sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: 700 }}
                                >
                                    Baca Abstrak Naskah
                                </Button>
                            </Box>
                        )
                    )}

                    {activeTab === 'slides' && (
                        hasSlides ? (
                            <UniversalDocumentViewer
                                fileUrl={currentFileUrl}
                                fileName={(submission.presentation_file || submission.abstract_file).split('/').pop()}
                                rubricType={rubricType}
                                docTitle={currentDocTitle}
                                heightOverride="100%"
                            />
                        ) : (
                            <Box sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <CoPresentIcon sx={{ fontSize: 52, color: '#94a3b8', mb: 1.5, opacity: 0.6 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary, mb: 0.5 }}>
                                    {isOral ? 'Slide Presentasi Belum Diunggah' : 'Berkas Poster Belum Diunggah'}
                                </Typography>
                                <Typography variant="body2" sx={{ color: c.textSecondary, maxWidth: 360, fontSize: '0.8rem', mb: 2 }}>
                                    Presenter belum mengunggah file materi presentasi. Anda dapat merujuk ke berkas Full Paper atau Abstrak.
                                </Typography>
                                {hasPaper && (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => setActiveTab('paper')}
                                        sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: 700 }}
                                    >
                                        Buka Full Paper
                                    </Button>
                                )}
                            </Box>
                        )
                    )}

                    {activeTab === 'abstract' && (
                        <Box sx={{
                            height: '100%',
                            overflowY: 'auto',
                            p: { xs: 2, sm: 3 },
                            bgcolor: isDark ? 'rgba(0,0,0,0.1)' : '#ffffff',
                        }}>
                            {/* Abstract Header Card */}
                            <Box sx={{ mb: 2.5 }}>
                                <Typography variant="caption" sx={{
                                    fontWeight: 800,
                                    color: isDark ? '#34d399' : '#059669',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    fontSize: '0.68rem',
                                    display: 'block',
                                    mb: 0.5,
                                }}>
                                    {submission.submission_code || `SUB-${submission.id}`} • {submission.category_submission || (isOral ? 'Oral Presentation' : 'Poster Presentation')}
                                </Typography>
                                <Typography variant="h6" sx={{
                                    fontWeight: 900,
                                    color: c.textPrimary,
                                    fontSize: { xs: '1.05rem', sm: '1.25rem' },
                                    lineHeight: 1.35,
                                    mb: 1.5,
                                }}>
                                    {submission.title}
                                </Typography>

                                {/* Presenter & Co-authors */}
                                <Stack spacing={1} sx={{
                                    p: 1.8,
                                    borderRadius: '12px',
                                    bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                    border: `1px solid ${c.cardBorder || '#e2e8f0'}`,
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon sx={{ fontSize: 18, color: '#059669' }} />
                                        <Typography variant="body2" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '0.85rem' }}>
                                            {submission.author_full_name || submission.user?.name || 'Author'}
                                        </Typography>
                                        <Chip label="Presenter" size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#ecfdf5', color: '#059669' }} />
                                    </Box>

                                    {submission.institute_organization && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 0.2 }}>
                                            <SchoolIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                            <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 600 }}>
                                                {submission.institute_organization}
                                            </Typography>
                                        </Box>
                                    )}

                                    {coAuthors.length > 0 && (
                                        <Box sx={{ pt: 0.8, borderTop: `1px dashed ${c.cardBorder || '#e2e8f0'}` }}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: c.textSecondary, display: 'block', mb: 0.5, fontSize: '0.68rem', textTransform: 'uppercase' }}>
                                                Co-Authors ({coAuthors.length}):
                                            </Typography>
                                            <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                                                {coAuthors.map((co, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        size="small"
                                                        label={co.institute ? `${co.name} (${co.institute})` : co.name}
                                                        sx={{
                                                            fontSize: '0.68rem',
                                                            bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff',
                                                            border: `1px solid ${c.cardBorder || '#e2e8f0'}`,
                                                        }}
                                                    />
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>

                            {/* Keywords Strip */}
                            {keywords.length > 0 && (
                                <Box sx={{ mb: 2.5 }}>
                                    <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap" useFlexGap>
                                        <TagIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                        {keywords.map((kw, idx) => (
                                            <Chip
                                                key={idx}
                                                label={kw}
                                                size="small"
                                                sx={{
                                                    height: 22,
                                                    fontSize: '0.68rem',
                                                    fontWeight: 600,
                                                    bgcolor: isDark ? 'rgba(2, 132, 199, 0.15)' : '#eff6ff',
                                                    color: '#0284c7',
                                                    border: '1px solid rgba(2, 132, 199, 0.25)',
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            {/* Abstract Body */}
                            <Box sx={{
                                p: 2.2,
                                borderRadius: '14px',
                                bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fdfdfd',
                                border: `1px solid ${c.cardBorder || '#e2e8f0'}`,
                            }}>
                                <Typography variant="subtitle2" sx={{
                                    fontWeight: 800,
                                    fontSize: '0.8rem',
                                    color: c.textPrimary,
                                    mb: 1.2,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}>
                                    Abstract Content
                                </Typography>
                                <Typography variant="body2" sx={{
                                    color: c.textPrimary,
                                    lineHeight: 1.75,
                                    fontSize: '0.88rem',
                                    textAlign: 'justify',
                                    whiteSpace: 'pre-line',
                                }}>
                                    {submission.abstract || 'Teks abstrak tidak disertakan pada naskah ini.'}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </ModalErrorBoundary>
            </Box>
        </Card>
    );
}
