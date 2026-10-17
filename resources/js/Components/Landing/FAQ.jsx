import React, { useState } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import CarouselSpotlight from './CarouselSpotlight';
import ScrollReveal from './ScrollReveal';
import { Sparkles, ListFilter, Layers } from 'lucide-react';

export default function FAQ({ settings = {} }) {
    const [viewMode, setViewMode] = useState('carousel'); // 'carousel' | 'accordion'
    const [expanded, setExpanded] = useState('panel0');

    const handleChange = (panel) => (_, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    // Get text settings from faq_text
    const faqText = settings.faq_text || {};
    const sectionTitle = faqText.title || 'All About Procedure of Submission';
    const sectionSubtitle = faqText.subtitle || 'Follow these simple, step-by-step procedures to submit your abstract and register for the conference.';

    // Get submission procedure sections from admin settings
    const procedureSections = Array.isArray(settings.submission_procedure)
        ? settings.submission_procedure
        : [];

    // Background image
    const faqBg = settings.faq_background || {};

    // Dynamic steps for Carousel Spotlight
    const dynamicSteps = [
        {
            id: 1,
            stepNumber: '01',
            title: 'Create Account',
            category: 'Registration · Step 1',
            tagline: 'Account Setup',
            description: 'Sign up on the official PIT IAGI - GEOSEA 2026 conference portal with your active email address and complete email verification.',
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
            link: '/register',
            linkText: 'Register Account',
        },
        {
            id: 2,
            stepNumber: '02',
            title: 'Author Profile',
            category: 'Profile · Step 2',
            tagline: 'Affiliation Setup',
            description: 'Complete your personal and institutional profile. Add co-authors, academic credentials, and contact details for official indexing.',
            image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
            link: '/dashboard',
            linkText: 'Complete Profile',
        },
        {
            id: 3,
            stepNumber: '03',
            title: 'Abstract Submission',
            category: 'Call for Papers · Step 3',
            tagline: 'Paper Submission',
            description: 'Format your abstract according to conference guidelines (Word/PDF template). Select your technical session and submit through the portal.',
            image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
            link: '#resources',
            linkText: 'Download Guideline',
        },
        {
            id: 4,
            stepNumber: '04',
            title: 'Peer Review & Acceptance',
            category: 'Scientific Review · Step 4',
            tagline: 'Review Process',
            description: 'Track the review status of your submission in real time. Official notification letters (LoA) will be announced and sent via email.',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
            link: '/dashboard',
            linkText: 'Track Status',
        },
        {
            id: 5,
            stepNumber: '05',
            title: 'Full Manuscript',
            category: 'Proceedings · Step 5',
            tagline: 'Indexed Publication',
            description: 'Accepted authors upload the final full paper manuscript and presentation slides for inclusion in indexed scientific proceedings.',
            image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
            link: '#resources',
            linkText: 'View Template',
        },
        {
            id: 6,
            stepNumber: '06',
            title: 'Payment & Conference Pass',
            category: 'Delegates · Step 6',
            tagline: 'Final Confirmation',
            description: 'Select your registration package, complete secure payment via Virtual Account or Card, and download your official conference delegate badge.',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
            link: '/register',
            linkText: 'Get Conference Pass',
        },
    ];

    return (
        <Box
            id="faq"
            role="region"
            aria-label="Submission Procedure"
            sx={{
                py: { xs: 8, sm: 12 },
                position: 'relative',
                overflow: 'hidden',
                ...(!faqBg.url && {
                    background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f0fdfa 100%)',
                }),
                ...(faqBg.url && {
                    backgroundImage: `url(${faqBg.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }),
            }}
        >
            {/* View Mode Toggle Pill Bar */}
            <div className="flex items-center justify-center mb-6 relative z-20">
                <div className="inline-flex items-center p-1 rounded-full bg-slate-100/90 border border-slate-200/90 shadow-2xs backdrop-blur-sm">
                    <button
                        onClick={() => setViewMode('carousel')}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                            viewMode === 'carousel'
                                ? 'bg-teal-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5" />
                        <span>3D Carousel Spotlight</span>
                    </button>
                    <button
                        onClick={() => setViewMode('accordion')}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                            viewMode === 'accordion'
                                ? 'bg-teal-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <ListFilter className="w-3.5 h-3.5" />
                        <span>Accordion List</span>
                    </button>
                </div>
            </div>

            {/* View Mode 1: 3D Carousel Spotlight (Gambar 2 - Layers.ai Style) */}
            {viewMode === 'carousel' && (
                <CarouselSpotlight
                    items={dynamicSteps}
                    title={sectionTitle}
                    subtitle={sectionSubtitle}
                    sectionLabel="SUBMISSION PROCEDURE · 55TH PIT IAGI & GEOSEA XIX 2026"
                />
            )}

            {/* View Mode 2: Classical Accordion List */}
            {viewMode === 'accordion' && (
                <Container
                    maxWidth="md"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: { xs: 3, sm: 4 },
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: '#0d9488',
                                fontWeight: 800,
                                letterSpacing: '0.15em',
                                fontSize: '0.8rem',
                                display: 'block',
                                mb: 1,
                            }}
                        >
                            SUBMISSION PROCEDURE
                        </Typography>
                        <Typography
                            component="h2"
                            variant="h4"
                            gutterBottom
                            sx={{ color: 'text.primary', fontWeight: 800 }}
                        >
                            {sectionTitle}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                            {sectionSubtitle}
                        </Typography>
                    </Box>

                    <Box sx={{ width: '100%' }}>
                        {procedureSections.length > 0 ? (
                            procedureSections.map((section, sectionIndex) => (
                                <ScrollReveal key={sectionIndex} variant="fadeUp" delay={sectionIndex * 120} duration={700}>
                                    <Accordion
                                        key={sectionIndex}
                                        expanded={expanded === `panel${sectionIndex}`}
                                        onChange={handleChange(`panel${sectionIndex}`)}
                                        disableGutters
                                        elevation={0}
                                        sx={{
                                            borderRadius: '12px !important',
                                            border: '1px solid',
                                            borderColor: expanded === `panel${sectionIndex}` ? '#0d9488' : 'divider',
                                            mb: 1.5,
                                            bgcolor: expanded === `panel${sectionIndex}` ? alpha('#0d9488', 0.04) : 'background.paper',
                                            transition: 'all 0.3s ease',
                                            '&:before': { display: 'none' },
                                            '&:hover': {
                                                borderColor: '#0d9488',
                                            },
                                        }}
                                    >
                                        <AccordionSummary
                                            id={`panel${sectionIndex}-header`}
                                            aria-controls={`panel${sectionIndex}-content`}
                                            expandIcon={
                                                <ExpandMoreIcon
                                                    sx={{
                                                        color: expanded === `panel${sectionIndex}` ? '#0d9488' : 'text.secondary',
                                                        transition: 'color 0.2s',
                                                    }}
                                                />
                                            }
                                            sx={{
                                                minHeight: 56,
                                                '& .MuiAccordionSummary-content': { my: 1.5 },
                                            }}
                                        >
                                            <Typography
                                                component="span"
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: expanded === `panel${sectionIndex}` ? 700 : 600,
                                                    color: expanded === `panel${sectionIndex}` ? '#094d42' : 'text.primary',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                }}
                                            >
                                                {section.title}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails id={`panel${sectionIndex}-content`} aria-labelledby={`panel${sectionIndex}-header`} sx={{ pt: 0, pb: 2.5, px: 3 }}>
                                            {section.items && section.items.map((step, stepIndex) => (
                                                <Box
                                                    key={stepIndex}
                                                    component={step.link ? 'a' : 'div'}
                                                    href={step.link || undefined}
                                                    target={step.link ? '_blank' : undefined}
                                                    rel={step.link ? 'noopener noreferrer' : undefined}
                                                    download={step.link ? true : undefined}
                                                    aria-label={step.link ? `Download ${step.filename || step.text}` : undefined}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                        mb: stepIndex < section.items.length - 1 ? 1.5 : 0,
                                                        py: 1.5,
                                                        px: 2,
                                                        borderRadius: '10px',
                                                        textDecoration: 'none',
                                                        color: 'inherit',
                                                        cursor: step.link ? 'pointer' : 'default',
                                                        transition: 'all 0.2s ease',
                                                        ...(step.link && {
                                                            '&:hover': {
                                                                bgcolor: alpha('#0d9488', 0.08),
                                                                transform: 'translateX(4px)',
                                                            },
                                                        }),
                                                    }}
                                                >
                                                    {/* Step number */}
                                                    <Box
                                                        sx={{
                                                            minWidth: 32,
                                                            height: 32,
                                                            borderRadius: '50%',
                                                            bgcolor: '#0d9488',
                                                            color: 'white',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 700,
                                                            fontSize: '0.85rem',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {stepIndex + 1}
                                                    </Box>
                                                    {/* Step text */}
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: 'text.primary',
                                                                fontWeight: 500,
                                                                lineHeight: 1.6,
                                                            }}
                                                        >
                                                            {step.text}
                                                        </Typography>
                                                        {step.filename && (
                                                            <Typography
                                                                variant="caption"
                                                                sx={{ color: '#0d9488', fontWeight: 600 }}
                                                            >
                                                                📎 {step.filename}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                    {/* Download icon */}
                                                    {step.link && (
                                                        <DescriptionIcon sx={{ color: '#0d9488', fontSize: 20, flexShrink: 0 }} />
                                                    )}
                                                </Box>
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
                                </ScrollReveal>
                            ))
                        ) : (
                            <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                                Submission procedure steps will be published soon.
                            </Typography>
                        )}
                    </Box>
                </Container>
            )}
        </Box>
    );
}
