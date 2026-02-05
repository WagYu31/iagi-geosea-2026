import { Head } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box,
    Typography,
    Paper,
    Avatar,
    Chip,
    Grid,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { usePage } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin': return 'error';
            case 'reviewer': return 'warning';
            default: return 'default';
        }
    };

    const getRoleBadgeStyle = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return { bgcolor: '#d32f2f', color: 'white' };
            case 'reviewer':
                return { bgcolor: '#f57c00', color: 'white' };
            default:
                return { bgcolor: '#1976d2', color: 'white' };
        }
    };

    return (
        <SidebarLayout>
            <Head title="Profile" />

            <Box sx={{ p: 3 }}>
                {/* Header with Profile Summary */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 3,
                        background: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)',
                        color: 'white',
                        borderRadius: 2
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                bgcolor: 'white',
                                color: '#1abc9c',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                border: '4px solid rgba(255,255,255,0.3)'
                            }}
                        >
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {user.name}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                                {user.email}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Chip
                                    label={user.role?.toUpperCase() || 'USER'}
                                    size="small"
                                    sx={{
                                        ...getRoleBadgeStyle(user.role),
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        height: 24
                                    }}
                                />
                                {user.email_verified_at && (
                                    <Chip
                                        label="✓ Verified"
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            height: 24
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Profile Management Title */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <PersonIcon sx={{ fontSize: 32, color: '#1abc9c' }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1abc9c' }}>
                        Profile Management
                    </Typography>
                </Box>

                {/* Grid Layout for Forms */}
                <Grid container spacing={3}>
                    {/* Profile Information */}
                    <Grid item xs={12} lg={8}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                border: '1px solid #e0e0e0',
                                borderRadius: 2,
                                height: '100%'
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1,
                                    color: '#1abc9c',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <PersonIcon />
                                Profile Information
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Update your account's profile information and email address.
                            </Typography>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </Paper>
                    </Grid>

                    {/* Account Stats (Optional Info Card) */}
                    <Grid item xs={12} lg={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid #e0e0e0',
                                borderRadius: 2,
                                bgcolor: '#f8f9fa'
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1abc9c' }}>
                                Account Info
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                        Member Since
                                    </Typography>
                                    <Typography variant="body2">
                                        {new Date(user.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                        Account Status
                                    </Typography>
                                    <Typography variant="body2">
                                        {user.email_verified_at ? '✓ Verified' : '⚠ Unverified'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                        Role
                                    </Typography>
                                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                        {user.role || 'User'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Update Password */}
                    <Grid item xs={12}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                border: '1px solid #e0e0e0',
                                borderRadius: 2
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1,
                                    color: '#1abc9c',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                🔒 Update Password
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Ensure your account is using a long, random password to stay secure.
                            </Typography>
                            <UpdatePasswordForm />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </SidebarLayout>
    );
}
