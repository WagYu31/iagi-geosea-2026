import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';

export default function Pricing({ settings }) {
    const resources = settings.resources && settings.resources.length > 0
        ? settings.resources.filter(r => r.title && r.title.trim() !== '')
        : [];

    if (resources.length === 0) return null;

    return (
        <Box
            id="resources"
            sx={{
                py: { xs: 8, sm: 12 },
                bgcolor: undefined,
                background: 'linear-gradient(180deg, #f0f7f6 0%, #f5faf9 40%, #ffffff 100%)',
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: { xs: 3, md: 5 },
                }}
            >
                <Box sx={{ width: { sm: '100%', md: '60%' }, textAlign: 'center' }}>
                    <Typography
                        variant="overline"
                        sx={{
                            color: '#0d9488',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            fontSize: '0.8rem',
                            display: 'block',
                            mb: 1,
                        }}
                    >
                        DOWNLOADS
                    </Typography>
                    <Typography component="h2" variant="h4" gutterBottom sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {settings.resources_title || 'Resources'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {settings.resources_description || 'Download important documents, templates, and guidelines for the conference.'}
                    </Typography>
                </Box>

                <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: '1000px' }}>
                    {resources.map((resource, index) => (
                        <Grid size={{ xs: 12, sm: resources.length === 1 ? 12 : 6, md: resources.length === 1 ? 8 : resources.length === 2 ? 6 : 4 }} key={index}>
                            <Paper
                                elevation={0}
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '16px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 32px rgba(13, 148, 136, 0.12)',
                                        borderColor: '#0d9488',
                                    },
                                }}
                            >
                                {/* Icon */}
                                <Box
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <DescriptionIcon sx={{ color: '#0d7a6a', fontSize: 26 }} />
                                </Box>

                                {/* Title */}
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                                    {resource.title}
                                </Typography>

                                {/* Description */}
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, flexGrow: 1, lineHeight: 1.6 }}>
                                    {resource.description || 'Click below to download this resource.'}
                                </Typography>

                                {/* Download Button */}
                                <Button
                                    component="a"
                                    href={resource.file_url || resource.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    variant="outlined"
                                    size="small"
                                    startIcon={<DownloadIcon />}
                                    sx={{
                                        borderColor: '#0d9488',
                                        color: '#0d7a6a',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        borderRadius: '10px',
                                        '&:hover': {
                                            bgcolor: '#0d9488',
                                            color: 'white',
                                            borderColor: '#0d9488',
                                        },
                                    }}
                                >
                                    Download
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
