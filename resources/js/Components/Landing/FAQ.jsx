import React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import DescriptionIcon from '@mui/icons-material/Description';

export default function FAQ({ settings }) {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (_, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    // Get text settings from faq_text
    const faqText = settings.faq_text || {};
    const sectionTitle = faqText.title || 'All About Procedure of Submission';
    const sectionSubtitle = faqText.subtitle || 'Follow these simple steps to submit your abstract for the conference';

    // Get submission procedure sections from admin settings
    const procedureSections = Array.isArray(settings.submission_procedure)
        ? settings.submission_procedure
        : [];

    // Background image
    const faqBg = settings.faq_background || {};

    return (
        <Box
            id="faq"
            sx={{
                py: { xs: 8, sm: 12 },
                position: 'relative',
                overflow: 'hidden',
                ...(!faqBg.url && {
                    background: 'linear-gradient(180deg, #eef9f5 0%, #f5fcfa 30%, #ffffff 100%)',
                }),
                ...(faqBg.url && {
                    backgroundImage: `url(${faqBg.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                }),
            }}
        >
            {/* Overlay when background image is present */}
            {faqBg.url && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: alpha('#ffffff', 0.2),
                        zIndex: 0,
                    }}
                />
            )}

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
                            fontWeight: 700,
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
                                <AccordionDetails sx={{ pt: 0, pb: 2.5, px: 3 }}>
                                    {section.items && section.items.map((step, stepIndex) => (
                                        <Box
                                            key={stepIndex}
                                            component={step.link ? 'a' : 'div'}
                                            href={step.link || undefined}
                                            target={step.link ? '_blank' : undefined}
                                            rel={step.link ? 'noopener noreferrer' : undefined}
                                            download={step.link ? true : undefined}
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
                        ))
                    ) : (
                        /* Fallback if no procedure data */
                        <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                            Submission procedure steps will be published soon.
                        </Typography>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
