import React from 'react';
import { Link } from '@inertiajs/react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';

export default function RegistrationClosedDialog({ open, onClose }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '26px',
                    p: 0,
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1.5px solid #cbd5e1',
                    borderBottom: '6px solid #94a3b8',
                    boxShadow: '0 25px 60px -10px rgba(15, 23, 42, 0.35), 0 8px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                },
            }}
        >
            {/* Header with 3D Banner & Close Button */}
            <Box
                sx={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, #094d42 0%, #065f46 60%, #047857 100%)',
                    p: { xs: 3, sm: 3.5 },
                    pb: { xs: 4, sm: 4.5 },
                    textAlign: 'center',
                    borderBottom: '3px solid #022c22',
                    boxShadow: 'inset 0 -2px 6px rgba(0,0,0,0.2)',
                }}
            >
                {/* Close Button */}
                <IconButton
                    onClick={onClose}
                    size="small"
                    aria-label="Close notification"
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        color: '#ffffff',
                        background: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderBottom: '2.5px solid rgba(0, 0, 0, 0.3)',
                        borderRadius: '10px',
                        backdropFilter: 'blur(8px)',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.25)',
                            transform: 'translateY(-1px)',
                        },
                        '&:active': {
                            transform: 'translateY(1px)',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
                        },
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>

                {/* Floating 3D Icon Badge */}
                <Box
                    sx={{
                        width: { xs: 68, sm: 76 },
                        height: { xs: 68, sm: 76 },
                        borderRadius: '22px',
                        mx: 'auto',
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #fde047 0%, #eab308 50%, #ca8a04 100%)',
                        border: '2px solid #fef08a',
                        borderBottom: '4.5px solid #713f12',
                        boxShadow: '0 8px 24px rgba(234, 179, 8, 0.45), inset 0 2px 0 rgba(255,255,255,0.7)',
                    }}
                >
                    <LockClockOutlinedIcon sx={{ fontSize: { xs: 36, sm: 42 }, color: '#422006' }} />
                </Box>

                {/* 3D Chip Badge */}
                <Chip
                    icon={<EventBusyOutlinedIcon sx={{ fontSize: '15px !important', color: '#991b1b !important' }} />}
                    label="REGISTRATION CLOSED &bull; DEADLINE PASSED"
                    size="small"
                    sx={{
                        background: 'linear-gradient(180deg, #fee2e2 0%, #fecaca 100%)',
                        color: '#991b1b',
                        fontWeight: 900,
                        fontSize: '0.7rem',
                        letterSpacing: '0.04em',
                        border: '1.5px solid #fca5a5',
                        borderBottom: '2.5px solid #dc2626',
                        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)',
                        mb: 1.5,
                        px: 1,
                        height: 26,
                    }}
                />

                <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                        fontWeight: 900,
                        color: '#ffffff',
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        lineHeight: 1.25,
                        textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                >
                    Author & Account Registration is Closed
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontSize: { xs: '0.82rem', sm: '0.88rem' },
                        mt: 0.5,
                        fontWeight: 500,
                    }}
                >
                    55ᵀᴴ PIT IAGI - GEOSEA XIX 2026 Annual Convention
                </Typography>
            </Box>

            {/* Modal Body Content */}
            <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                {/* 3D Closed Notice Box */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        mb: 2.5,
                        borderRadius: '18px',
                        background: 'linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)',
                        border: '1.5px solid #fde68a',
                        borderBottom: '4px solid #d97706',
                        boxShadow: '0 4px 14px rgba(217, 119, 6, 0.12)',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#78350f',
                            fontSize: { xs: '0.85rem', sm: '0.92rem' },
                            lineHeight: 1.6,
                            fontWeight: 600,
                        }}
                    >
                        Online registration for <strong>Paper Authors, Speakers, and Oral/Poster Presenters</strong> has officially ended as the conference schedule and paper submission timeline have concluded.
                    </Typography>
                </Paper>

                {/* 3D Active Pass Promo Box */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: '18px',
                        background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)',
                        border: '1.5px solid #a7f3d0',
                        borderBottom: '4px solid #059669',
                        boxShadow: '0 4px 14px rgba(5, 150, 105, 0.15)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                        <Box
                            sx={{
                                p: 0.8,
                                borderRadius: '12px',
                                background: 'linear-gradient(130deg, #10b981 0%, #059669 100%)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)',
                                flexShrink: 0,
                            }}
                        >
                            <ConfirmationNumberIcon sx={{ fontSize: 22 }} />
                        </Box>
                        <Box>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 900,
                                    color: '#064e3b',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.2,
                                }}
                            >
                                Looking to Attend the Conference?
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#047857',
                                    fontWeight: 700,
                                    display: 'block',
                                    mt: 0.3,
                                }}
                            >
                                Conference & Visitor passes are currently open!
                            </Typography>
                        </Box>
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            color: '#065f46',
                            fontSize: '0.84rem',
                            lineHeight: 1.5,
                            mb: 2,
                        }}
                    >
                        You can still join the keynote presentations, exhibition booths, technical workshops, and networking sessions by obtaining a <strong>Conference Pass</strong> or <strong>Visitor Pass</strong>.
                    </Typography>

                    {/* 3D Action CTA to /tickets */}
                    <Button
                        component={Link}
                        href="/tickets"
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowForwardIcon sx={{ fontSize: '18px !important' }} />}
                        onClick={onClose}
                        sx={{
                            background: 'linear-gradient(180deg, #10b981 0%, #059669 50%, #047857 100%)',
                            color: '#ffffff',
                            fontWeight: 900,
                            fontSize: '0.92rem',
                            borderRadius: '14px',
                            py: 1.2,
                            textTransform: 'none',
                            border: '1.5px solid #34d399',
                            borderBottom: '4px solid #022c22',
                            boxShadow: '0 6px 18px rgba(4, 120, 87, 0.4), inset 0 1px 0 rgba(255,255,255,0.4)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                            transition: 'all 0.15s ease',
                            '&:hover': {
                                background: 'linear-gradient(180deg, #34d399 0%, #10b981 50%, #059669 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 22px rgba(4, 120, 87, 0.5)',
                            },
                            '&:active': {
                                transform: 'translateY(1.5px)',
                                borderBottom: '1.5px solid #022c22',
                            },
                        }}
                    >
                        Get Conference & Visitor Pass
                    </Button>
                </Paper>

                {/* Bottom Inquiries WhatsApp Section */}
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed #cbd5e1', textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1.2 }}>
                        Already submitted a paper or have an author inquiry?
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
                        <Button
                            variant="outlined"
                            size="small"
                            component="a"
                            href="https://wa.me/6281325779040?text=Hello%20PIT%20IAGI%20Secretariat%2C%20I%20have%20an%20inquiry%20regarding%20Author%20Registration."
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<WhatsAppIcon sx={{ color: '#16a34a' }} />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 800,
                                fontSize: '0.8rem',
                                borderRadius: '12px',
                                background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
                                border: '1.5px solid #86efac',
                                borderBottom: '3px solid #16a34a',
                                color: '#15803d',
                                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.1)',
                                px: 2,
                                py: 0.7,
                                transition: 'all 0.15s ease',
                                '&:hover': { background: 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)', transform: 'translateY(-1px)' },
                                '&:active': { transform: 'translateY(1px)', borderBottom: '1.5px solid #16a34a' },
                            }}
                        >
                            Contact Secretariat (Tiyas)
                        </Button>

                        <Button
                            variant="outlined"
                            size="small"
                            onClick={onClose}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                borderRadius: '12px',
                                background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
                                border: '1.5px solid #cbd5e1',
                                borderBottom: '3px solid #94a3b8',
                                color: '#475569',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
                                px: 2.5,
                                py: 0.7,
                                transition: 'all 0.15s ease',
                                '&:hover': { background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)', color: '#0f172a', transform: 'translateY(-1px)' },
                                '&:active': { transform: 'translateY(1px)', borderBottom: '1.5px solid #94a3b8' },
                            }}
                        >
                            Close
                        </Button>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
