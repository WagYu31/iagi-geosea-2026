import { ThemeProvider } from '@mui/material/styles';
import { Box, Paper, Typography } from '@mui/material';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import theme from '@/theme';

export default function MUIGuestLayout({ children }) {
    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: '100vh',
                    bgcolor: 'grey.100',
                    pt: 6,
                }}
            >
                <Box sx={{ mb: 4 }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                    </Link>
                </Box>

                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 600,
                        px: 2,
                    }}
                >
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
}
