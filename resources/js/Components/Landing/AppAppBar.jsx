import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: alpha('#094d42', 0.12),
    backgroundColor: alpha('#ffffff', 0.7),
    boxShadow: '0 2px 12px rgba(9, 77, 66, 0.08)',
    padding: '8px 12px',
}));

const navItems = [
    { label: 'AFGEO', target: 'afgeo' },
    { label: 'About', target: 'about' },
    { label: 'Timeline', target: 'timeline' },
    { label: 'Resources', target: 'resources' },
    { label: 'Speakers', target: 'speakers' },
    { label: 'FAQ', target: 'faq' },
    { label: 'Contact', target: 'venue' },
];

export default function AppAppBar({ auth }) {
    const [open, setOpen] = useState(false);

    const scrollTo = (id) => {
        setOpen(false);
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    return (
        <AppBar
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                mt: 'calc(var(--template-frame-height, 0px) + 28px)',
            }}
        >
            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters>
                    {/* Logo */}
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                cursor: 'pointer',
                            }}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <Box
                                component="img"
                                src="/favicon.ico"
                                alt="Logo"
                                sx={{ width: 32, height: 32, objectFit: 'contain' }}
                            />
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Typography
                                    sx={{
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.03em',
                                        color: '#094d42',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    55ᵀᴴ PIT IAGI-GEOSEA XIX 2026
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.65rem',
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                        color: '#6b7280',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Annual Convention
                                </Typography>
                            </Box>
                        </Box>
                        {/* Desktop nav links */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 3 }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.target}
                                    variant="text"
                                    size="small"
                                    onClick={() => scrollTo(item.target)}
                                    sx={{
                                        color: '#374151',
                                        fontWeight: 500,
                                        fontSize: '0.85rem',
                                        textTransform: 'none',
                                        '&:hover': { color: '#094d42', bgcolor: alpha('#094d42', 0.06) },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    {/* Desktop CTA */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
                        {auth?.user ? (
                            <Button
                                component={Link}
                                href="/dashboard"
                                variant="contained"
                                size="small"
                                sx={{
                                    background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 100%)',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: '8px',
                                    px: 2.5,
                                    boxShadow: '0 2px 8px rgba(9, 77, 66, 0.25)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #073d34 0%, #0a6356 100%)',
                                    },
                                }}
                            >
                                Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button
                                    component={Link}
                                    href="/login"
                                    variant="text"
                                    size="small"
                                    sx={{
                                        color: '#094d42',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Sign in
                                </Button>
                                <Button
                                    component={Link}
                                    href="/register"
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 100%)',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: '8px',
                                        px: 2.5,
                                        boxShadow: '0 2px 8px rgba(9, 77, 66, 0.25)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #073d34 0%, #0a6356 100%)',
                                        },
                                    }}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>

                    {/* Mobile menu button */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
                        <IconButton aria-label="Menu" onClick={() => setOpen(true)} sx={{ color: '#094d42' }}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="top"
                            open={open}
                            onClose={() => setOpen(false)}
                            PaperProps={{
                                sx: { top: 'var(--template-frame-height, 0px)' },
                            }}
                        >
                            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography sx={{ fontWeight: 700, color: '#094d42', fontSize: '1rem' }}>
                                        IAGI-GEOSEA XIX 2026
                                    </Typography>
                                    <IconButton onClick={() => setOpen(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Box>
                                {navItems.map((item) => (
                                    <MenuItem key={item.target} onClick={() => scrollTo(item.target)}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                                <Divider sx={{ my: 2 }} />
                                {auth?.user ? (
                                    <MenuItem>
                                        <Button
                                            component={Link}
                                            href="/dashboard"
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 100%)',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Dashboard
                                        </Button>
                                    </MenuItem>
                                ) : (
                                    <>
                                        <MenuItem>
                                            <Button
                                                component={Link}
                                                href="/register"
                                                variant="contained"
                                                fullWidth
                                                sx={{
                                                    background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 100%)',
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Register
                                            </Button>
                                        </MenuItem>
                                        <MenuItem>
                                            <Button
                                                component={Link}
                                                href="/login"
                                                variant="outlined"
                                                fullWidth
                                                sx={{
                                                    borderColor: '#094d42',
                                                    color: '#094d42',
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Sign in
                                            </Button>
                                        </MenuItem>
                                    </>
                                )}
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}
