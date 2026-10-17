import React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HowItWorks from '@/Components/ui/how-it-works';

export default function Highlights({ settings }) {
    const timeline = settings?.timeline && settings.timeline.length > 0
        ? settings.timeline
        : [
            { title: 'Abstract Submission', date: 'February 9, 2026', status: 'active', description: 'Opening of research abstract submission for oral and poster presentation tracks.' },
            { title: 'Abstract Deadline', date: 'March 21, 2026', status: 'active', description: 'Final submission deadline for research abstracts and peer-review process.' },
            { title: 'Abstract Acceptance Announcement', date: 'May 07, 2026', status: 'upcoming', description: 'Official notification and announcement of accepted research papers and presentations.' },
            { title: 'Full Manuscript Submission Deadline', date: 'Agustus 07, 2026', status: 'upcoming', description: 'Deadline for submitting full manuscripts for indexed conference proceedings.' },
            { title: 'Main Event Conference', date: 'November 3, 2026', status: 'upcoming', description: 'The 55th PIT IAGI & GEOSEA XIX Annual Scientific Convention & Exhibition.' },
        ];

    // Color theme mapping for the 5 pinned steps (Orange -> Blue -> Purple -> Orange -> Blue)
    const colorThemes = ['orange', 'blue', 'purple', 'orange', 'blue'];

    const timelineFeatures = timeline.map((item, index) => {
        let desc = item.description;
        if (!desc) {
            if (item.status === 'active') {
                desc = 'Active milestone. Submission and registration open for authors and delegates.';
            } else if (item.status === 'completed') {
                desc = 'Milestone successfully completed.';
            } else {
                desc = 'Scheduled milestone for 55th PIT IAGI - GEOSEA XIX 2026.';
            }
        }

        return {
            title: item.title,
            description: desc,
            date: item.date,
            status: item.status,
            colorTheme: colorThemes[index % colorThemes.length],
        };
    });

    return (
        <Box
            id="timeline"
            sx={{
                py: { xs: 8, sm: 12 },
                background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f0fdfa 100%)',
            }}
        >
            <Container
                maxWidth="xl"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: { xs: 4, sm: 6 },
                    px: { xs: 2, sm: 3, md: 4 },
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: 'center', maxWidth: '650px' }}>
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
                            border: '1px solid rgba(13, 148, 136, 0.2)',
                        }}
                    >
                        <AccessTimeIcon sx={{ color: '#0d9488', fontSize: 18 }} />
                        <Typography
                            variant="overline"
                            sx={{
                                color: '#0d9488',
                                fontWeight: 800,
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
                            fontWeight: 900,
                            color: '#0f172a',
                            fontSize: { xs: '2rem', md: '2.6rem' },
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Event Timeline
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', fontStyle: 'italic', fontSize: '1rem' }}>
                        "Time is the canvas upon which we build the future of geology."
                    </Typography>
                </Box>

                {/* 21st.dev Style Pinned Interactive Timeline Board (Horizontal White Mode) */}
                <Box
                    className="w-full"
                    sx={{
                        borderRadius: { xs: '20px', md: '28px' },
                        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
                        border: '1px solid rgba(226, 232, 240, 0.9)',
                        bgcolor: '#ffffff',
                        p: { xs: 1, sm: 1.5, md: 2 },
                    }}
                >
                    <HowItWorks
                        features={timelineFeatures}
                        className="bg-white text-slate-800"
                    />
                </Box>
            </Container>
        </Box>
    );
}
