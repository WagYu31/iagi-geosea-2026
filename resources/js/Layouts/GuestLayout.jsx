import { Link } from '@inertiajs/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';

export default function GuestLayout({ children }) {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #094d42 0%, #0a3d35 40%, #062e28 100%)',
                px: { xs: 2, sm: 3 },
                py: { xs: 4, sm: 6 },
            }}
        >
            {/* Animated Background Pattern */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.06,
                    backgroundImage: `radial-gradient(circle at 20% 50%, #1abc9c 1px, transparent 1px),
                                      radial-gradient(circle at 80% 20%, #1abc9c 1px, transparent 1px),
                                      radial-gradient(circle at 40% 80%, #1abc9c 1px, transparent 1px)`,
                    backgroundSize: '100px 100px, 150px 150px, 120px 120px',
                    animation: 'float 20s ease-in-out infinite',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0)' },
                        '50%': { transform: 'translateY(-20px)' },
                    },
                }}
            />

            {/* Top Accent Bar */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #0d7a6a, #1abc9c, #4dd4ac, #1abc9c, #0d7a6a)',
                }}
            />

            {/* Decorative Glow */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-30%',
                    right: '-20%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(26, 188, 156, 0.12) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-20%',
                    left: '-15%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(13, 122, 106, 0.15) 0%, transparent 70%)',
                    filter: 'blur(50px)',
                }}
            />

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Logo & Branding */}
                <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: { xs: 72, sm: 88, md: 100 },
                                height: { xs: 72, sm: 88, md: 100 },
                                borderRadius: '50%',
                                bgcolor: 'white',
                                mb: 2.5,
                                overflow: 'hidden',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src="/favicon.ico"
                                alt="Logo"
                                sx={{
                                    width: '75%',
                                    height: '75%',
                                    objectFit: 'contain',
                                }}
                            />
                        </Box>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                color: '#4dd4ac',
                                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                                letterSpacing: '0.02em',
                                mb: 0.5,
                                textShadow: '0 2px 12px rgba(77, 212, 172, 0.3)',
                            }}
                        >
                            55ᵀᴴ PIT IAGI-GEOSEA{' '}
                            <Box component="span" sx={{ color: '#1abc9c' }}>
                                XIX 2026
                            </Box>
                        </Typography>

                        <Typography
                            sx={{
                                color: alpha('#ffffff', 0.6),
                                fontWeight: 600,
                                letterSpacing: '0.15em',
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                textTransform: 'uppercase',
                            }}
                        >
                            Annual Convention
                        </Typography>
                    </Link>
                </Box>

                {/* Main Card */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: { xs: '20px', sm: '24px' },
                        p: { xs: 3, sm: 4, md: 5 },
                        bgcolor: 'white',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
                        border: `1px solid ${alpha('#ffffff', 0.1)}`,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Card top accent */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: 'linear-gradient(90deg, #0d9488, #1abc9c, #4dd4ac)',
                        }}
                    />
                    {children}
                </Paper>

                {/* Back to Home */}
                <Box sx={{ textAlign: 'center', mt: { xs: 3, sm: 4 } }}>
                    <Button
                        component={Link}
                        href="/"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: alpha('#ffffff', 0.65),
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            textTransform: 'none',
                            letterSpacing: '0.02em',
                            '&:hover': {
                                color: '#4dd4ac',
                                bgcolor: 'transparent',
                            },
                        }}
                    >
                        Back to Home
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
