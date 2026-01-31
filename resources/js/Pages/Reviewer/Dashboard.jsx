import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Paper,
    Chip,
    Avatar,
    LinearProgress,
    Button,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function ReviewerDashboard({ analytics = {}, recentAssignments = [] }) {
    const totalAssigned = analytics.totalAssigned || 0;
    const completed = analytics.completed || 0;
    const pending = analytics.pending || 0;
    const completionRate = totalAssigned > 0 ? (completed / totalAssigned) * 100 : 0;

    return (
        <SidebarLayout>
            <Head title="Reviewer Dashboard" />

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
                        mb: 4,
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
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -30,
                            left: -30,
                            width: 150,
                            height: 150,
                            background: 'rgba(255, 255, 255, 0.08)',
                            borderRadius: '50%',
                        }
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TrendingUpIcon sx={{ fontSize: 40, color: 'white', mr: 2 }} />
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: 'white',
                                    fontSize: { xs: '1.5rem', sm: '2rem' }
                                }}
                            >
                                Welcome, Reviewer! 👋
                            </Typography>
                        </Box>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.95)',
                                mb: 2,
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        >
                            Manage your paper reviews and track your progress
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Chip
                                icon={<AssignmentIcon />}
                                label={`${totalAssigned} Total Assigned`}
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    fontWeight: 600,
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)'
                                }}
                            />
                            <Chip
                                icon={<CheckCircleIcon />}
                                label={`${Math.round(completionRate)}% Complete`}
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    fontWeight: 600,
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)'
                                }}
                            />
                        </Box>
                    </Box>
                </Paper>

                {/* Stats Cards */}
                <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card sx={{
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            borderRadius: 3,
                            border: '1px solid #e5e7eb',
                            background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 24px rgba(0, 104, 56, 0.15)',
                            }
                        }}>
                            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Avatar sx={{
                                        backgroundColor: '#ecfdf5',
                                        width: { xs: 48, sm: 56 },
                                        height: { xs: 48, sm: 56 },
                                        boxShadow: '0 4px 12px rgba(0, 104, 56, 0.2)'
                                    }}>
                                        <AssignmentIcon sx={{ color: '#1abc9c', fontSize: { xs: 24, sm: 28 } }} />
                                    </Avatar>
                                    <Chip
                                        label="Total"
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(26, 188, 156, 0.1)',
                                            color: '#0d7a6a',
                                            fontWeight: 600,
                                            border: '1px solid #d1fae5'
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
                                    {totalAssigned}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 500 }}
                                >
                                    Total Assigned
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card sx={{
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            borderRadius: 3,
                            border: '1px solid #e5e7eb',
                            background: 'linear-gradient(135deg, #dcfce7 0%, #ffffff 100%)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 24px rgba(22, 163, 74, 0.15)',
                            }
                        }}>
                            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Avatar sx={{
                                        backgroundColor: '#dcfce7',
                                        width: { xs: 48, sm: 56 },
                                        height: { xs: 48, sm: 56 },
                                        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)'
                                    }}>
                                        <CheckCircleIcon sx={{ color: '#16a34a', fontSize: { xs: 24, sm: 28 } }} />
                                    </Avatar>
                                    <Chip
                                        label="Done"
                                        size="small"
                                        sx={{
                                            backgroundColor: '#dcfce7',
                                            color: '#16a34a',
                                            fontWeight: 600,
                                            border: '1px solid #bbf7d0'
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
                                    {completed}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 500 }}
                                >
                                    Completed Reviews
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={completionRate}
                                    sx={{
                                        mt: 2,
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: '#f0fdf4',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#16a34a',
                                            borderRadius: 3,
                                        }
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card sx={{
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            borderRadius: 3,
                            border: '1px solid #e5e7eb',
                            background: 'linear-gradient(135deg, #fed7aa 0%, #ffffff 100%)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 24px rgba(234, 88, 12, 0.15)',
                            }
                        }}>
                            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Avatar sx={{
                                        backgroundColor: '#fed7aa',
                                        width: { xs: 48, sm: 56 },
                                        height: { xs: 48, sm: 56 },
                                        boxShadow: '0 4px 12px rgba(234, 88, 12, 0.2)'
                                    }}>
                                        <PendingIcon sx={{ color: '#ea580c', fontSize: { xs: 24, sm: 28 } }} />
                                    </Avatar>
                                    <Chip
                                        label="Pending"
                                        size="small"
                                        sx={{
                                            backgroundColor: '#fed7aa',
                                            color: '#ea580c',
                                            fontWeight: 600,
                                            border: '1px solid #fdba74'
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
                                    {pending}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 500 }}
                                >
                                    Pending Reviews
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Recent Assignments */}
                <Paper elevation={0} sx={{
                    p: { xs: 3, sm: 4 },
                    border: '1px solid #e5e7eb',
                    borderRadius: 3,
                    background: '#ffffff',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{
                                width: 4,
                                height: 28,
                                backgroundColor: '#1abc9c',
                                borderRadius: 2,
                                mr: 2
                            }} />
                            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                                Recent Assignments
                            </Typography>
                        </Box>
                        {recentAssignments.length > 0 && (
                            <Button
                                component={Link}
                                href={route('reviewer.submissions')}
                                variant="outlined"
                                size="small"
                                sx={{
                                    textTransform: 'none',
                                    borderColor: '#1abc9c',
                                    color: '#1abc9c',
                                    '&:hover': {
                                        borderColor: '#16a085',
                                        backgroundColor: 'rgba(26, 188, 156, 0.08)',
                                    }
                                }}
                            >
                                View All
                            </Button>
                        )}
                    </Box>

                    {recentAssignments.length === 0 ? (
                        <Box sx={{
                            textAlign: 'center',
                            py: 6,
                            px: 2,
                            background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
                            borderRadius: 2,
                            border: '2px dashed #d1d5db'
                        }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography sx={{ fontSize: '64px', mb: 1 }}>📝</Typography>
                            </Box>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#374151' }}>
                                No Assignments Yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '500px', mx: 'auto' }}>
                                You will be notified when papers are assigned to you for review.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {recentAssignments.map((review) => (
                                <Card key={review.id} sx={{
                                    border: '1px solid #e5e7eb',
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        transform: 'translateX(4px)',
                                        borderColor: '#1abc9c',
                                    }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box sx={{ flex: 1, mr: 2 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
                                                    {review.submission?.title || 'Untitled'}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <PersonIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {review.submission?.user?.name || 'Unknown'}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <CalendarTodayIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            Assigned {new Date(review.created_at).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Chip
                                                label={review.originality_score ? 'Completed' : 'Pending'}
                                                color={review.originality_score ? 'success' : 'warning'}
                                                size="small"
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </Box>
                                        {review.originality_score && (
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                p: 2,
                                                backgroundColor: '#f9fafb',
                                                borderRadius: 2,
                                                mb: 2
                                            }}>
                                                <CheckCircleIcon sx={{ color: '#16a34a' }} />
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#16a34a' }}>
                                                    Overall Score: {review.overall_score}/5
                                                </Typography>
                                            </Box>
                                        )}
                                        <Button
                                            component={Link}
                                            href={route('reviewer.submissions.view', review.submission_id)}
                                            variant="contained"
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            sx={{
                                                textTransform: 'none',
                                                background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)',
                                                }
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Paper>
            </Box>
        </SidebarLayout>
    );
}
