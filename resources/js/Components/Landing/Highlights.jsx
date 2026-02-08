import React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Highlights({ settings }) {
    const timeline = settings.timeline && settings.timeline.length > 0
        ? settings.timeline
        : [
            { title: 'Registration Opens', date: 'January 18, 2026', status: 'completed' },
            { title: 'Abstract Submission', date: 'February 28, 2026', status: 'active' },
            { title: 'Early Bird Deadline', date: 'April 30, 2026', status: 'upcoming' },
            { title: 'Final Registration', date: 'June 30, 2026', status: 'upcoming' },
            { title: 'Conference Date', date: 'August 15-17, 2026', status: 'upcoming' },
        ];

    const getIcon = (status) => {
        if (status === 'completed') return <CheckCircleIcon sx={{ fontSize: 28, color: '#ffffff' }} />;
        if (status === 'active') return <AccessTimeIcon sx={{ fontSize: 28, color: '#ffffff' }} />;
        return <RadioButtonUncheckedIcon sx={{ fontSize: 28, color: '#9ca3af' }} />;
    };

    return (
        <Box
            id="timeline"
            sx={{
                py: { xs: 8, sm: 12 },
                background: 'linear-gradient(180deg, #ffffff 0%, #f5faf9 50%, #f0f7f6 100%)',
            }}
        >
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: { xs: 4, sm: 6 },
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: 'center', maxWidth: '600px' }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            bgcolor: alpha('#0d9488', 0.1),
                            borderRadius: '50px',
                            px: 2.5,
                            py: 0.7,
                            mb: 2,
                        }}
                    >
                        <AccessTimeIcon sx={{ color: '#0d9488', fontSize: 18 }} />
                        <Typography
                            variant="overline"
                            sx={{
                                color: '#0d9488',
                                fontWeight: 700,
                                letterSpacing: '0.15em',
                                fontSize: '0.75rem',
                            }}
                        >
                            ROADMAP
                        </Typography>
                    </Box>
                    <Typography
                        component="h2"
                        variant="h3"
                        gutterBottom
                        sx={{
                            fontWeight: 800,
                            color: '#111827',
                            fontSize: { xs: '2rem', md: '2.5rem' },
                        }}
                    >
                        Event Timeline
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280', fontStyle: 'italic' }}>
                        "Time is the canvas upon which we build the future of geology."
                    </Typography>
                </Box>

                {/* Timeline Cards */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: `repeat(${Math.min(timeline.length, 5)}, 1fr)`,
                        },
                        gap: 2.5,
                        width: '100%',
                        maxWidth: '1100px',
                    }}
                >
                    {timeline.map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                borderRadius: '20px',
                                border: '1px solid',
                                borderColor: item.status === 'active'
                                    ? '#0d9488'
                                    : alpha('#0d9488', 0.12),
                                borderWidth: item.status === 'active' ? 2 : 1,
                                bgcolor: item.status === 'active'
                                    ? alpha('#0d9488', 0.04)
                                    : '#ffffff',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                overflow: 'visible',
                                boxShadow: item.status === 'active'
                                    ? `0 8px 24px ${alpha('#0d9488', 0.15)}`
                                    : '0 2px 8px rgba(0,0,0,0.04)',
                                '&:hover': {
                                    transform: 'translateY(-6px)',
                                    borderColor: '#0d9488',
                                    boxShadow: `0 12px 32px ${alpha('#0d9488', 0.15)}`,
                                },
                            }}
                        >
                            {/* Active badge */}
                            {item.status === 'active' && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -14,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: 'linear-gradient(135deg, #0d7a6a 0%, #10b981 100%)',
                                        color: 'white',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: '20px',
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.5px',
                                        boxShadow: '0 4px 12px rgba(13, 122, 106, 0.3)',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    ACTIVE NOW
                                </Box>
                            )}

                            {/* Icon */}
                            <Box
                                sx={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: '14px',
                                    background: item.status === 'completed'
                                        ? 'linear-gradient(135deg, #10b981 0%, #0d7a6a 100%)'
                                        : item.status === 'active'
                                            ? 'linear-gradient(135deg, #0d7a6a 0%, #059669 100%)'
                                            : '#f3f4f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                    boxShadow: item.status !== 'upcoming'
                                        ? `0 6px 16px ${alpha('#0d9488', 0.25)}`
                                        : 'none',
                                }}
                            >
                                {getIcon(item.status)}
                            </Box>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    color: item.status === 'active' ? '#094d42' : '#111827',
                                    mb: 1,
                                    minHeight: '2.8em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    lineHeight: 1.3,
                                }}
                            >
                                {item.title}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: item.status === 'active' ? '#0d9488' : '#6b7280',
                                    fontWeight: item.status === 'active' ? 600 : 400,
                                    fontSize: '0.85rem',
                                }}
                            >
                                {item.date}
                            </Typography>

                            {/* Progress bar */}
                            <Box
                                sx={{
                                    mt: 2,
                                    width: '100%',
                                    height: 3,
                                    bgcolor: alpha('#0d9488', 0.1),
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: item.status === 'completed' ? '100%' : item.status === 'active' ? '50%' : '0%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #0d7a6a 0%, #10b981 100%)',
                                        borderRadius: 2,
                                        transition: 'width 0.5s ease',
                                    }}
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
