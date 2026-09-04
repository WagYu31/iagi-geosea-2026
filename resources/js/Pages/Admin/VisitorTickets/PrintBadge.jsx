import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Box,
    Typography,
    Button,
    Chip,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import StarIcon from '@mui/icons-material/Star';

export default function PrintBadge({
    ticket = {},
    templatePath = null,
}) {
    const isExclusive = ticket.visitor_type === 'exclusive';

    useEffect(() => {
        // Auto trigger print dialog after 500ms
        const timer = setTimeout(() => {
            window.print();
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#1e293b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                '@media print': {
                    bgcolor: '#fff',
                    p: 0,
                    minHeight: 'auto',
                },
            }}
        >
            <Head title={`Cetak ID Card: ${ticket.visitor_name} (${isExclusive ? 'Exclusive' : 'Non-Exclusive'})`} />

            {/* Action Bar (hidden when printing) */}
            <Box sx={{ mb: 2, display: 'flex', gap: 2, '@media print': { display: 'none' } }}>
                <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={() => window.print()}
                    sx={{
                        bgcolor: isExclusive ? '#eab308' : '#3b82f6',
                        color: isExclusive ? '#000' : '#fff',
                        fontWeight: 800,
                        borderRadius: '10px',
                        textTransform: 'none',
                    }}
                >
                    Cetak Kartu Lanyard
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => window.close()}
                    sx={{ color: '#94a3b8', borderColor: '#475569', textTransform: 'none', borderRadius: '10px' }}
                >
                    Tutup Jendela
                </Button>
            </Box>

            {/* Physical Lanyard Card Container (Standard A6 Badge / 95mm x 135mm) */}
            <Box
                id="lanyard-card"
                sx={{
                    width: '360px',
                    height: '520px',
                    bgcolor: '#ffffff',
                    borderRadius: '14px',
                    border: `3px solid ${isExclusive ? '#eab308' : '#2563eb'}`,
                    boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundImage: templatePath ? `url('${templatePath}')` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    '@media print': {
                        boxShadow: 'none',
                        width: '95mm',
                        height: '135mm',
                        border: `2px solid ${isExclusive ? '#eab308' : '#2563eb'}`,
                        pageBreakInside: 'avoid',
                        margin: '0 auto',
                    },
                }}
            >
                {/* Lanyard Hole Punch Area Guide (Top Center) */}
                <Box
                    sx={{
                        width: 32,
                        height: 8,
                        borderRadius: '4px',
                        border: '1px dashed rgba(0,0,0,0.2)',
                        mx: 'auto',
                        mt: 1,
                        '@media print': { border: '1px dashed #cbd5e1' },
                    }}
                />

                {/* Event Header */}
                <Box sx={{ textAlign: 'center', px: 2, pt: 1 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: '#1e293b',
                            fontSize: '0.75rem',
                            display: 'block',
                        }}
                    >
                        55th PIT IAGI & GEOSEA XIX 2026
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: '0.65rem',
                            color: '#64748b',
                            display: 'block',
                            fontWeight: 600,
                        }}
                    >
                        Royal Ambarrukmo Yogyakarta &bull; 3-5 November 2026
                    </Typography>
                </Box>

                {/* Card Center: QR Code & Visitor Details */}
                <Box sx={{ textAlign: 'center', px: 2.5, my: 'auto' }}>
                    {/* QR Code */}
                    <Box
                        sx={{
                            p: 1.5,
                            bgcolor: '#ffffff',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            width: 'fit-content',
                            mx: 'auto',
                            mb: 2,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                        }}
                    >
                        <QRCodeSVG
                            value={ticket.ticket_code}
                            size={120}
                            level="H"
                            includeMargin={false}
                        />
                    </Box>

                    {/* Visitor Name */}
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 900,
                            color: '#0f172a',
                            lineHeight: 1.2,
                            mb: 0.5,
                            fontSize: '1.25rem',
                            wordBreak: 'break-word',
                        }}
                    >
                        {ticket.visitor_name}
                    </Typography>

                    {/* Institution */}
                    {ticket.visitor_institution && (
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 700,
                                color: '#475569',
                                fontSize: '0.85rem',
                                mb: 0.5,
                            }}
                        >
                            {ticket.visitor_institution}
                        </Typography>
                    )}

                    {/* Ticket Code */}
                    <Typography
                        variant="caption"
                        sx={{
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            color: '#64748b',
                            fontSize: '0.75rem',
                            letterSpacing: '0.05em',
                            display: 'block',
                        }}
                    >
                        {ticket.ticket_code}
                    </Typography>
                </Box>

                {/* Bottom Category Banner (EXCLUSIVE vs NON-EXCLUSIVE) */}
                <Box
                    sx={{
                        bgcolor: isExclusive ? '#eab308' : '#2563eb',
                        color: isExclusive ? '#000' : '#fff',
                        py: 1.2,
                        textAlign: 'center',
                        fontWeight: 900,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.8,
                    }}
                >
                    {isExclusive && <StarIcon sx={{ fontSize: 18 }} />}
                    {isExclusive ? 'VISITOR EXCLUSIVE (VIP)' : 'VISITOR NON-EXCLUSIVE'}
                    {isExclusive && <StarIcon sx={{ fontSize: 18 }} />}
                </Box>
            </Box>
        </Box>
    );
}
