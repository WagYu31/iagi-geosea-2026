import React from 'react';
import {
    Box, Typography, Card, Stack, useTheme, Avatar, Switch, Chip,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

/**
 * NominationCard
 * Allows judges to recommend extraordinary presentations for Best Oral / Best Poster Awards
 */
export default function NominationCard({
    isNominated = false,
    selectedCategory = '',
    onToggle,
    onSelectCategory,
    isOral = true,
}) {
    const theme = useTheme();
    const c = theme.palette.custom || {};
    const isDark = theme.palette.mode === 'dark';

    const oralCategories = [
        'Best Oral Presentation',
        'Best Presentation Delivery & Impact',
        'Best Scientific & Technical Rigor',
        'Most Innovative Geological Research',
    ];

    const posterCategories = [
        'Best Poster Presentation',
        'Best Visual Design & Infographic',
        'Best Scientific & Practical Content',
        'Best Presenter & Q&A Mastery',
    ];

    const categories = isOral ? oralCategories : posterCategories;

    return (
        <Card elevation={0} sx={{
            borderRadius: { xs: '18px', sm: '24px' },
            border: `1.5px solid ${isNominated ? '#f59e0b' : (c.cardBorder || '#e2e8f0')}`,
            bgcolor: isNominated
                ? (isDark ? 'rgba(245, 158, 11, 0.08)' : '#fffbeb')
                : (c.cardBg || '#ffffff'),
            p: { xs: 2, sm: 3 },
            boxShadow: isNominated
                ? (isDark ? '0 8px 30px rgba(245, 158, 11, 0.25)' : '0 8px 25px rgba(245, 158, 11, 0.15)')
                : (isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.02)'),
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                <Stack direction="row" spacing={1.8} alignItems="center">
                    <Avatar sx={{
                        bgcolor: isNominated ? '#f59e0b' : (isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'),
                        color: isNominated ? '#ffffff' : (c.textSecondary || '#64748b'),
                        width: 44,
                        height: 44,
                        boxShadow: isNominated ? '0 4px 12px rgba(245, 158, 11, 0.4)' : 'none',
                        transition: 'all 0.25s ease',
                    }}>
                        <EmojiEventsIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{
                            fontWeight: 900,
                            color: c.textPrimary || '#1e293b',
                            fontSize: { xs: '0.94rem', sm: '1.05rem' },
                        }}>
                            Rekomendasi Penghargaan Terbaik (Award Nomination)
                        </Typography>
                        <Typography variant="caption" sx={{
                            color: c.textSecondary || '#64748b',
                            fontSize: '0.74rem',
                            display: 'block',
                            mt: 0.2,
                        }}>
                            Nominasikan naskah ini ke sidang pleno dewan juri untuk penghargaan resmi.
                        </Typography>
                    </Box>
                </Stack>

                <Switch
                    checked={isNominated}
                    onChange={(e) => onToggle(e.target.checked)}
                    color="warning"
                    sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#f59e0b',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#f59e0b',
                        },
                    }}
                />
            </Box>

            {isNominated && (
                <Box sx={{
                    mt: 2.2,
                    pt: 2,
                    borderTop: `1px dashed ${isDark ? 'rgba(245, 158, 11, 0.35)' : '#fde68a'}`,
                }}>
                    <Typography variant="subtitle2" sx={{
                        fontWeight: 800,
                        fontSize: '0.76rem',
                        color: c.textPrimary || '#1e293b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        mb: 1.2,
                    }}>
                        Kategori Nominasi Terpilih:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                        {categories.map((catOption) => {
                            const isSelected = (selectedCategory || categories[0]) === catOption;
                            return (
                                <Chip
                                    key={catOption}
                                    label={catOption}
                                    clickable
                                    onClick={() => onSelectCategory(catOption)}
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: '0.74rem',
                                        py: 1.8,
                                        px: 0.5,
                                        borderRadius: '10px',
                                        bgcolor: isSelected ? '#f59e0b' : (isDark ? 'rgba(255,255,255,0.04)' : '#ffffff'),
                                        color: isSelected ? '#ffffff' : (c.textPrimary || '#1e293b'),
                                        border: `1.5px solid ${isSelected ? '#f59e0b' : (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0')}`,
                                        boxShadow: isSelected ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none',
                                        transition: 'all 0.15s ease',
                                        '&:hover': {
                                            borderColor: '#f59e0b',
                                            bgcolor: isSelected ? '#d97706' : (isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7'),
                                        },
                                    }}
                                />
                            );
                        })}
                    </Stack>

                    <Typography variant="caption" sx={{
                        color: isDark ? '#fcd34d' : '#b45309',
                        fontWeight: 600,
                        fontSize: '0.72rem',
                        display: 'block',
                    }}>
                        ⭐ Presentasi bernominasi akan memiliki lencana emas pada rekap nilai dan masuk ke daftar kandidat juara dewan juri.
                    </Typography>
                </Box>
            )}
        </Card>
    );
}
