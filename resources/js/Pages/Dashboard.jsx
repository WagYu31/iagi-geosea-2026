import React from 'react';
import { Head } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Paper,
    Avatar,
    LinearProgress,
    Chip,
} from '@mui/material';
import { Link } from '@inertiajs/react';
import ArticleIcon from '@mui/icons-material/Article';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function Dashboard({ submissions = [], user }) {
    const totalSubmissions = submissions.length;
    const paidSubmissions = submissions.filter(s => s.payment_status === 'paid').length;
    const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
    const acceptedSubmissions = submissions.filter(s => s.status === 'accepted').length;
    const paymentProgress = totalSubmissions > 0 ? (paidSubmissions / totalSubmissions) * 100 : 0;

    return (
        <SidebarLayout>
            <Head title="Dashboard" />

            <Box sx={{
                p: { xs: 2, sm: 3 },
                background: 'linear-gradient(to bottom, #f8faf9 0%, #ffffff 100%)',
                minHeight: '100vh'
            }}>
                {/* Welcome Banner */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        mb: 3,
                        background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 50%, #16a085 100%)',
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -50,
                            right: -50,
                            width: 200,
                            height: 200,
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '50%',
                        }
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: 'white',
                                mb: 1,
                                fontSize: { xs: '1.5rem', sm: '2rem' }
                            }}
                        >
                            Welcome back, {user?.name || 'User'}! 👋
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                mb: 2,
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        >
                            Track your submissions and manage your conference participation
                        </Typography>
                        <Chip
                            icon={<TrendingUpIcon />}
                            label={`${totalSubmissions} Total Submissions`}
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                fontWeight: 600,
                                backdropFilter: 'blur(10px)'
                            }}
                        />
                    </Box>
                </Paper>

                {/* Stat Cards */}
                <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Card sx={{
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            borderRadius: 3,
                            border: '1px solid #e5e7eb',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            }
                        }}>
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Avatar sx={{
                                        backgroundColor: '#ecfdf5',
                                        width: { xs: 48, sm: 56 },
                                        height: { xs: 48, sm: 56 }
                                    }}>
                                        <ArticleIcon sx={{ color: '#1abc9c', fontSize: { xs: 24, sm: 28 } }} />
                                    </Avatar>
                                    <Chip
                                        label="Total"
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(26, 188, 156, 0.1)',
                                            color: '#0d7a6a',
                                            fontWeight: 600
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#1abc9c',
                                        mb: 0.5,
                                        fontSize: { xs: '2rem', sm: '2.5rem' }
                                    }}
                                >
                                    {totalSubmissions}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    Total Submissions
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Card sx={{
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            borderRadius: 3,
                            border: '1px solid #e5e7eb',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            }
                        }}>
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Avatar sx={{
                                        backgroundColor: '#dcfce7',
                                        width: { xs: 48, sm: 56 },
                                        height: { xs: 48, sm: 56 }
                                    }}>
                                        <CheckCircleIcon sx={{ color: '#16a34a', fontSize: { xs: 24, sm: 28 } }} />
                                    </Avatar>
                                    <Chip
                                        label="Success"
                                        size="small"
                                        sx={{
                                            backgroundColor: '#dcfce7',
                                            color: '#16a34a',
                                            fontWeight: 600
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#16a34a',
                                        mb: 0.5,
                                        fontSize: { xs: '2rem', sm: '2.5rem' }
                                    }}
                                >
                                    {acceptedSubmissions}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    Accepted Papers
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Card sx={{
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            borderRadius: 3,
                            border: '1px solid #e5e7eb',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            }
                        }}>
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Avatar sx={{
                                        backgroundColor: '#fed7aa',
                                        width: { xs: 48, sm: 56 },
                                        height: { xs: 48, sm: 56 }
                                    }}>
                                        <PendingIcon sx={{ color: '#ea580c', fontSize: { xs: 24, sm: 28 } }} />
                                    </Avatar>
                                    <Chip
                                        label="Review"
                                        size="small"
                                        sx={{
                                            backgroundColor: '#fed7aa',
                                            color: '#ea580c',
                                            fontWeight: 600
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#ea580c',
                                        mb: 0.5,
                                        fontSize: { xs: '2rem', sm: '2.5rem' }
                                    }}
                                >
                                    {pendingSubmissions}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    Under Review
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Card sx={{
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            borderRadius: 3,
                            border: '1px solid #e5e7eb',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            }
                        }}>
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Avatar sx={{
                                        backgroundColor: '#dbeafe',
                                        width: { xs: 48, sm: 56 },
                                        height: { xs: 48, sm: 56 }
                                    }}>
                                        <PaymentIcon sx={{ color: '#2563eb', fontSize: { xs: 24, sm: 28 } }} />
                                    </Avatar>
                                    <Chip
                                        label="Payment"
                                        size="small"
                                        sx={{
                                            backgroundColor: '#dbeafe',
                                            color: '#2563eb',
                                            fontWeight: 600
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#2563eb',
                                        mb: 0.5,
                                        fontSize: { xs: '2rem', sm: '2.5rem' }
                                    }}
                                >
                                    {paidSubmissions}/{totalSubmissions}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                    sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    Payment Status
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={paymentProgress}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: '#e0e7ff',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#2563eb',
                                            borderRadius: 3,
                                        }
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Quick Actions */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        border: '1px solid #e5e7eb',
                        borderRadius: 3,
                        mb: 3
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box sx={{
                            width: 4,
                            height: 24,
                            backgroundColor: '#1abc9c',
                            borderRadius: 2,
                            mr: 2
                        }} />
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: '1.25rem', sm: '1.5rem' }
                            }}
                        >
                            Quick Actions
                        </Typography>
                    </Box>
                    <Grid container spacing={{ xs: 2, sm: 2 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Button
                                component={Link}
                                href={route('submissions.index')}
                                variant="contained"
                                fullWidth
                                startIcon={<AddIcon />}
                                sx={{
                                    background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 16px rgba(26, 188, 156, 0.3)',
                                    },
                                    py: { xs: 1.5, sm: 2 },
                                    textTransform: 'none',
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Submit New Paper
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Button
                                component={Link}
                                href={route('submissions.index')}
                                variant="outlined"
                                fullWidth
                                startIcon={<ListAltIcon />}
                                sx={{
                                    color: '#1abc9c',
                                    borderColor: '#1abc9c',
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderColor: '#16a085',
                                        backgroundColor: 'rgba(26, 188, 156, 0.08)',
                                        borderWidth: 2,
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(26, 188, 156, 0.2)',
                                    },
                                    py: { xs: 1.5, sm: 2 },
                                    textTransform: 'none',
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                View All Submissions
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Button
                                component={Link}
                                href={route('payments.index')}
                                variant="outlined"
                                fullWidth
                                startIcon={<AccountBalanceWalletIcon />}
                                sx={{
                                    color: '#2563eb',
                                    borderColor: '#2563eb',
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderColor: '#1d4ed8',
                                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                                        borderWidth: 2,
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                                    },
                                    py: { xs: 1.5, sm: 2 },
                                    textTransform: 'none',
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Manage Payments
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Welcome Message for New Users */}
                {submissions.length === 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, sm: 4 },
                            border: '2px dashed #d1d5db',
                            borderRadius: 3,
                            backgroundColor: '#fafafa',
                            textAlign: 'center'
                        }}
                    >
                        <Box sx={{ mb: 2 }}>
                            <Typography sx={{ fontSize: '64px', mb: 2 }}>📄</Typography>
                        </Box>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: '1.125rem', sm: '1.25rem' }
                            }}
                        >
                            Ready to submit your first paper?
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                mb: 3,
                                maxWidth: '600px',
                                mx: 'auto',
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        >
                            Get started with IAGI-GEOSEA 2026! Click the button above to submit your paper and join the conference.
                        </Typography>
                    </Paper>
                )}
            </Box>
        </SidebarLayout>
    );
}
