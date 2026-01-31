import React, { useState, useMemo } from 'react';
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
    ToggleButton,
    ToggleButtonGroup,
    Chip,
} from '@mui/material';
import { Link } from '@inertiajs/react';
import ArticleIcon from '@mui/icons-material/Article';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GetAppIcon from '@mui/icons-material/GetApp';
import PersonIcon from '@mui/icons-material/Person';
import FilterListIcon from '@mui/icons-material/FilterList';
import { BarChart } from '@mui/x-charts/BarChart';

export default function AdminDashboard({ analytics, recentSubmissions = [], pendingPayments = 0, submissionsPerTopic = [], participantStats = {}, submissionsPerTopicByParticipant = [] }) {
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [participantFilter, setParticipantFilter] = useState('all');

    const totalSubmissions = analytics?.totalSubmissions || 0;
    const pendingReviews = analytics?.pendingReviews || 0;
    const verifiedPayments = analytics?.verifiedPayments || 0;
    const acceptedSubmissions = analytics?.acceptedSubmissions || 0;
    const rejectedSubmissions = analytics?.rejectedSubmissions || 0;
    const totalUsers = analytics?.totalUsers || 0;

    // Filter submissions by presentation category and participant category
    const filteredSubmissionsPerTopic = useMemo(() => {
        // Use submissionsPerTopicByParticipant as it now has all breakdown data
        // (both participant categories AND presentation types)
        const dataSource = submissionsPerTopicByParticipant;

        if (!dataSource || dataSource.length === 0) {
            return [];
        }

        // Apply participant filter
        let filtered = dataSource;
        if (participantFilter !== 'all') {
            const countKey = participantFilter;
            filtered = dataSource.map(item => ({
                ...item,
                count: item[countKey] || 0
            })).filter(item => item.count > 0);
        }

        // Apply presentation category filter
        if (categoryFilter !== 'all') {
            const countKey = `${categoryFilter}_count`;
            filtered = filtered.map(item => ({
                ...item,
                count: item[countKey] || 0
            })).filter(item => item.count > 0);
        }

        return filtered;
    }, [submissionsPerTopic, submissionsPerTopicByParticipant, categoryFilter, participantFilter]);

    return (
        <SidebarLayout>
            <Head title="Admin Dashboard" />

            <Box sx={{ p: { xs: 2, md: 3 } }}>
                {/* Header with Gradient Background */}
                <Box sx={{
                    background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 50%, #16a085 100%)',
                    borderRadius: '20px',
                    p: { xs: 2, sm: 3, md: 4 },
                    mb: 4,
                    boxShadow: '0 8px 32px rgba(13, 122, 106, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #4dd4ac 0%, #1abc9c 50%, #4dd4ac 100%)',
                    }
                }}>
                    <Typography variant="h4" sx={{
                        fontWeight: 700,
                        color: 'white',
                        mb: 1,
                        letterSpacing: '0.02em'
                    }}>
                        Admin Dashboard Overview
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '1rem'
                    }}>
                        Monitor dan kelola seluruh aktivitas konferensi PIT IAGI-GEOSEA 2026
                    </Typography>
                </Box>

                {/* Stat Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                            boxShadow: '0 4px 20px rgba(13, 122, 106, 0.15)',
                            borderRadius: '16px',
                            border: '1px solid rgba(13, 122, 106, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 30px rgba(13, 122, 106, 0.25)',
                            }
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{
                                        backgroundColor: '#0d7a6a',
                                        borderRadius: '12px',
                                        p: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(13, 122, 106, 0.3)'
                                    }}>
                                        <ArticleIcon sx={{ color: 'white', fontSize: 28 }} />
                                    </Box>
                                    <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        Total
                                    </Typography>
                                </Box>
                                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#0d7a6a', mb: 0.5, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                                    {totalSubmissions}
                                </Typography>
                                <Typography color="text.secondary" variant="body2" sx={{ fontSize: '0.875rem' }}>
                                    Total Submissions
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
                            boxShadow: '0 4px 20px rgba(237, 108, 2, 0.15)',
                            borderRadius: '16px',
                            border: '1px solid rgba(237, 108, 2, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 30px rgba(237, 108, 2, 0.25)',
                            }
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{
                                        backgroundColor: '#ed6c02',
                                        borderRadius: '12px',
                                        p: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(237, 108, 2, 0.3)'
                                    }}>
                                        <PendingIcon sx={{ color: 'white', fontSize: 28 }} />
                                    </Box>
                                    <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        Pending
                                    </Typography>
                                </Box>
                                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ed6c02', mb: 0.5, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                                    {pendingReviews}
                                </Typography>
                                <Typography color="text.secondary" variant="body2" sx={{ fontSize: '0.875rem' }}>
                                    Pending Reviews
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%)',
                            boxShadow: '0 4px 20px rgba(25, 118, 210, 0.15)',
                            borderRadius: '16px',
                            border: '1px solid rgba(25, 118, 210, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 30px rgba(25, 118, 210, 0.25)',
                            }
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{
                                        backgroundColor: '#1976d2',
                                        borderRadius: '12px',
                                        p: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                                    }}>
                                        <PaymentIcon sx={{ color: 'white', fontSize: 28 }} />
                                    </Box>
                                    <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        Verified
                                    </Typography>
                                </Box>
                                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 0.5, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                                    {verifiedPayments}
                                </Typography>
                                <Typography color="text.secondary" variant="body2" sx={{ fontSize: '0.875rem' }}>
                                    Verified Payments
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%)',
                            boxShadow: '0 4px 20px rgba(156, 39, 176, 0.15)',
                            borderRadius: '16px',
                            border: '1px solid rgba(156, 39, 176, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 30px rgba(156, 39, 176, 0.25)',
                            }
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{
                                        backgroundColor: '#9c27b0',
                                        borderRadius: '12px',
                                        p: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)'
                                    }}>
                                        <PeopleIcon sx={{ color: 'white', fontSize: 28 }} />
                                    </Box>
                                    <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        Users
                                    </Typography>
                                </Box>
                                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#9c27b0', mb: 0.5, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                                    {totalUsers}
                                </Typography>
                                <Typography color="text.secondary" variant="body2" sx={{ fontSize: '0.875rem' }}>
                                    Total Users
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Quick Actions */}
                <Paper elevation={0} sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    border: '1px solid rgba(13, 122, 106, 0.2)',
                    borderRadius: '20px',
                    background: 'linear-gradient(to bottom, #ffffff 0%, #f8faf9 100%)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                    <Typography variant="h5" gutterBottom sx={{
                        fontWeight: 700,
                        mb: { xs: 2, md: 3 },
                        color: '#0d7a6a',
                        fontSize: { xs: '1.25rem', md: '1.5rem' }
                    }}>
                        Quick Actions
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Button
                                component={Link}
                                href={route('admin.submissions')}
                                variant="contained"
                                fullWidth
                                sx={{
                                    backgroundColor: '#1abc9c',
                                    '&:hover': {
                                        backgroundColor: '#16a085',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 24px rgba(26, 188, 156, 0.4)',
                                    },
                                    py: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    borderRadius: '50px',
                                    boxShadow: '0 4px 16px rgba(26, 188, 156, 0.3)',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Workflow Control
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Button
                                component={Link}
                                href={route('admin.submissions')}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    color: '#1abc9c',
                                    borderColor: '#1abc9c',
                                    '&:hover': {
                                        borderColor: '#16a085',
                                        backgroundColor: 'rgba(26, 188, 156, 0.08)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 16px rgba(26, 188, 156, 0.2)',
                                    },
                                    py: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    borderRadius: '50px',
                                    borderWidth: '2px',
                                    '&:hover': {
                                        borderWidth: '2px',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Reviewer Assignment
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Button
                                component={Link}
                                href={route('admin.export')}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    color: '#1976d2',
                                    borderColor: '#1976d2',
                                    '&:hover': {
                                        borderColor: '#115293',
                                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 16px rgba(25, 118, 210, 0.2)',
                                    },
                                    py: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    borderRadius: '50px',
                                    borderWidth: '2px',
                                    '&:hover': {
                                        borderWidth: '2px',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Database Export
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Button
                                component={Link}
                                href={route('admin.payments')}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    color: '#ed6c02',
                                    borderColor: '#ed6c02',
                                    '&:hover': {
                                        borderColor: '#c55500',
                                        backgroundColor: 'rgba(237, 108, 2, 0.08)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 16px rgba(237, 108, 2, 0.2)',
                                    },
                                    py: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    borderRadius: '50px',
                                    borderWidth: '2px',
                                    '&:hover': {
                                        borderWidth: '2px',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Payment Validation
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Button
                                component={Link}
                                href={route('admin.users')}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    color: '#9c27b0',
                                    borderColor: '#9c27b0',
                                    '&:hover': {
                                        borderColor: '#7b1fa2',
                                        backgroundColor: 'rgba(156, 39, 176, 0.08)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 16px rgba(156, 39, 176, 0.2)',
                                    },
                                    py: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    borderRadius: '50px',
                                    borderWidth: '2px',
                                    '&:hover': {
                                        borderWidth: '2px',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Kelola Akun USER
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Submissions per Topic Chart */}
                {submissionsPerTopic.length > 0 && (
                    <Paper elevation={0} sx={{
                        p: { xs: 2, sm: 3, md: 4 },
                        border: '1px solid rgba(13, 122, 106, 0.2)',
                        borderRadius: '20px',
                        mt: 3,
                        background: 'linear-gradient(to bottom, #ffffff 0%, #f8faf9 100%)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{
                                    background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                    borderRadius: '12px',
                                    p: 1.5,
                                    mr: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(13, 122, 106, 0.3)'
                                }}>
                                    <Typography sx={{ fontSize: '28px' }}>📊</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#0d7a6a', mb: 0.5 }}>
                                        Statistik Submission per Topik
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Distribusi paper berdasarkan sub-tema penelitian
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Category Filters */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* Presentation Type Filter */}
                                <ToggleButtonGroup
                                    value={categoryFilter}
                                    exclusive
                                    onChange={(e, newValue) => {
                                        if (newValue !== null) {
                                            setCategoryFilter(newValue);
                                        }
                                    }}
                                    size="small"
                                    sx={{
                                        backgroundColor: '#ffffff',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        borderRadius: 2,
                                    }}
                                >
                                    <ToggleButton
                                        value="all"
                                        sx={{
                                            px: 3,
                                            py: 1,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            '&.Mui-selected': {
                                                backgroundColor: '#1abc9c',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#16a085',
                                                },
                                            },
                                        }}
                                    >
                                        <FilterListIcon sx={{ mr: 1, fontSize: 18 }} />
                                        Semua
                                    </ToggleButton>
                                    <ToggleButton
                                        value="oral_presentation"
                                        sx={{
                                            px: 3,
                                            py: 1,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            '&.Mui-selected': {
                                                backgroundColor: '#1976d2',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#115293',
                                                },
                                            },
                                        }}
                                    >
                                        🎤 Oral
                                    </ToggleButton>
                                    <ToggleButton
                                        value="poster_presentation"
                                        sx={{
                                            px: 3,
                                            py: 1,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            '&.Mui-selected': {
                                                backgroundColor: '#9c27b0',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#7b1fa2',
                                                },
                                            },
                                        }}
                                    >
                                        📋 Poster
                                    </ToggleButton>
                                </ToggleButtonGroup>

                                {/* Participant Category Filter */}
                                <ToggleButtonGroup
                                    value={participantFilter}
                                    exclusive
                                    onChange={(e, newValue) => {
                                        if (newValue !== null) {
                                            setParticipantFilter(newValue);
                                        }
                                    }}
                                    size="small"
                                    sx={{
                                        backgroundColor: '#ffffff',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        borderRadius: 2,
                                    }}
                                >
                                    <ToggleButton
                                        value="all"
                                        sx={{
                                            px: 3,
                                            py: 1,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            '&.Mui-selected': {
                                                backgroundColor: '#1abc9c',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#16a085',
                                                },
                                            },
                                        }}
                                    >
                                        👥 All Participants
                                    </ToggleButton>
                                    <ToggleButton
                                        value="student_count"
                                        sx={{
                                            px: 3,
                                            py: 1,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            '&.Mui-selected': {
                                                backgroundColor: '#0891b2',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#0e7490',
                                                },
                                            },
                                        }}
                                    >
                                        🎓 Student
                                    </ToggleButton>
                                    <ToggleButton
                                        value="professional_count"
                                        sx={{
                                            px: 3,
                                            py: 1,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            '&.Mui-selected': {
                                                backgroundColor: '#ea580c',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#c2410c',
                                                },
                                            },
                                        }}
                                    >
                                        💼 Professional
                                    </ToggleButton>
                                    <ToggleButton
                                        value="international_count"
                                        sx={{
                                            px: 3,
                                            py: 1,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            '&.Mui-selected': {
                                                backgroundColor: '#7c3aed',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#6d28d9',
                                                },
                                            },
                                        }}
                                    >
                                        🌍 International
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        </Box>

                        <Box sx={{
                            width: '100%',
                            height: Math.max(400, filteredSubmissionsPerTopic.length * 70),
                            backgroundColor: '#ffffff',
                            borderRadius: 3,
                            p: 3,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08), inset 0 1px 3px rgba(0,0,0,0.02)',
                            border: '1px solid #e5e7eb'
                        }}>
                            <BarChart
                                dataset={filteredSubmissionsPerTopic}
                                layout="horizontal"
                                yAxis={[{
                                    scaleType: 'band',
                                    dataKey: 'topic',
                                    tickLabelStyle: {
                                        fontSize: 14,
                                        fontWeight: 600,
                                        fill: '#1f2937',
                                        textAnchor: 'end',
                                    },
                                }]}
                                xAxis={[{
                                    tickLabelStyle: {
                                        fontSize: 13,
                                        fontWeight: 500,
                                        fill: '#6b7280',
                                    },
                                }]}
                                series={[
                                    {
                                        dataKey: 'count',
                                        label: categoryFilter === 'all' ? 'Total Submission' :
                                            categoryFilter === 'oral_presentation' ? 'Oral Presentation' :
                                                'Poster Presentation',
                                        color: categoryFilter === 'all' ? '#059669' :
                                            categoryFilter === 'oral_presentation' ? '#2563eb' :
                                                '#9333ea',
                                        valueFormatter: (value) => `${value} paper${value > 1 ? 's' : ''}`,
                                    },
                                ]}
                                margin={{ top: 30, bottom: 50, left: 150, right: 60 }}
                                grid={{ horizontal: true }}
                                slotProps={{
                                    legend: {
                                        direction: 'row',
                                        position: { vertical: 'top', horizontal: 'right' },
                                        padding: 0,
                                        itemMarkWidth: 16,
                                        itemMarkHeight: 16,
                                        markGap: 10,
                                        itemGap: 20,
                                        labelStyle: {
                                            fontSize: 14,
                                            fontWeight: 600,
                                            fill: '#1f2937',
                                        },
                                    },
                                    bar: {
                                        rx: 6,
                                        ry: 6,
                                    },
                                }}
                                sx={{
                                    '& .MuiChartsAxis-tickLabel': {
                                        fill: '#1f2937',
                                        fontWeight: 600,
                                    },
                                    '& .MuiChartsAxis-line': {
                                        stroke: '#d1d5db',
                                        strokeWidth: 1.5,
                                    },
                                    '& .MuiChartsAxis-tick': {
                                        stroke: '#d1d5db',
                                        strokeWidth: 1.5,
                                    },
                                    '& .MuiChartsGrid-line': {
                                        stroke: '#f3f4f6',
                                        strokeDasharray: '5 5',
                                        strokeWidth: 1,
                                    },
                                    '& .MuiBarElement-root': {
                                        cursor: 'pointer',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        filter: categoryFilter === 'all' ?
                                            'drop-shadow(0 2px 4px rgba(5, 150, 105, 0.3))' :
                                            categoryFilter === 'oral_presentation' ?
                                                'drop-shadow(0 2px 4px rgba(37, 99, 235, 0.3))' :
                                                'drop-shadow(0 2px 4px rgba(147, 51, 234, 0.3))',
                                        '&:hover': {
                                            opacity: 0.85,
                                            filter: categoryFilter === 'all' ?
                                                'drop-shadow(0 4px 8px rgba(5, 150, 105, 0.5)) brightness(1.05)' :
                                                categoryFilter === 'oral_presentation' ?
                                                    'drop-shadow(0 4px 8px rgba(37, 99, 235, 0.5)) brightness(1.05)' :
                                                    'drop-shadow(0 4px 8px rgba(147, 51, 234, 0.5)) brightness(1.05)',
                                            transform: 'translateX(4px)',
                                        },
                                    },
                                    '& .MuiChartsLegend-series': {
                                        padding: '8px 16px',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                    },
                                }}
                            />
                        </Box>

                        {/* Statistics Summary Cards */}
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <Box sx={{
                                    p: 2.5,
                                    backgroundColor: '#ecfdf5',
                                    borderRadius: 2,
                                    border: '1px solid #a7f3d0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <Box sx={{
                                        backgroundColor: '#10b981',
                                        borderRadius: '50%',
                                        width: 48,
                                        height: 48,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '20px'
                                    }}>
                                        {submissionsPerTopic.length}
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            Total Topik
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#065f46', fontWeight: 500 }}>
                                            Sub-tema berbeda
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <Box sx={{
                                    p: 2.5,
                                    backgroundColor: '#dbeafe',
                                    borderRadius: 2,
                                    border: '1px solid #93c5fd',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <Box sx={{
                                        backgroundColor: '#3b82f6',
                                        borderRadius: '50%',
                                        width: 48,
                                        height: 48,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '20px'
                                    }}>
                                        {submissionsPerTopic.reduce((sum, item) => sum + item.count, 0)}
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            Total Submission
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#1e40af', fontWeight: 500 }}>
                                            Paper yang masuk
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <Box sx={{
                                    p: 2.5,
                                    backgroundColor: '#fef3c7',
                                    borderRadius: 2,
                                    border: '1px solid #fcd34d',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <Box sx={{
                                        backgroundColor: '#f59e0b',
                                        borderRadius: '50%',
                                        width: 48,
                                        height: 48,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '16px'
                                    }}>
                                        {submissionsPerTopic.length > 0
                                            ? Math.round(submissionsPerTopic.reduce((sum, item) => sum + item.count, 0) / submissionsPerTopic.length * 10) / 10
                                            : 0}
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#d97706', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            Rata-rata
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#92400e', fontWeight: 500 }}>
                                            Per topik
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Top Topic Highlight */}
                        {submissionsPerTopic.length > 0 && (
                            <Box sx={{
                                mt: 3,
                                p: 3,
                                background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 50%, #16a085 100%)',
                                borderRadius: '16px',
                                boxShadow: '0 8px 24px rgba(13, 122, 106, 0.3)'
                            }}>
                                <Typography variant="subtitle2" sx={{ color: '#d1fae5', fontWeight: 600, mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    🏆 Topik Terpopuler
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                                    {submissionsPerTopic[0].topic}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#a7f3d0' }}>
                                    {submissionsPerTopic[0].count} submission ({Math.round(submissionsPerTopic[0].count / submissionsPerTopic.reduce((sum, item) => sum + item.count, 0) * 100)}% dari total)
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                )}

                {/* Recent Submissions & Alerts */}
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {/* Pending Payments Alert */}
                    {pendingPayments > 0 && (
                        <Grid size={{ xs: 12 }}>
                            <Paper elevation={0} sx={{
                                p: 3,
                                border: '2px solid #ed6c02',
                                borderRadius: '16px',
                                backgroundColor: '#fff8e1',
                                boxShadow: '0 4px 16px rgba(237, 108, 2, 0.15)'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#ed6c02', mb: 1 }}>
                                            ⚠️ Pending Payment Verifications
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            There are {pendingPayments} payment{pendingPayments > 1 ? 's' : ''} waiting for verification
                                        </Typography>
                                    </Box>
                                    <Button
                                        component={Link}
                                        href={route('admin.payments')}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#ed6c02',
                                            '&:hover': {
                                                backgroundColor: '#c55500',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 20px rgba(237, 108, 2, 0.4)',
                                            },
                                            borderRadius: '50px',
                                            px: 3,
                                            py: 1.5,
                                            fontWeight: 600,
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        Review Now
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    )}

                    {/* Recent Submissions */}
                    <Grid size={{ xs: 12 }}>
                        <Paper elevation={0} sx={{
                            p: 3,
                            border: '1px solid rgba(13, 122, 106, 0.2)',
                            borderRadius: '20px',
                            background: 'linear-gradient(to bottom, #ffffff 0%, #f8faf9 100%)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                        }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2, color: '#0d7a6a' }}>
                                Recent Submissions
                            </Typography>
                            {recentSubmissions.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    No recent submissions
                                </Typography>
                            ) : (
                                <Box>
                                    {recentSubmissions.map((submission) => (
                                        <Box
                                            key={submission.id}
                                            sx={{
                                                p: 2,
                                                mb: 2,
                                                border: '1px solid rgba(13, 122, 106, 0.15)',
                                                borderRadius: '12px',
                                                '&:last-child': { mb: 0 },
                                                '&:hover': {
                                                    backgroundColor: 'rgba(26, 188, 156, 0.05)',
                                                    borderColor: 'rgba(13, 122, 106, 0.3)',
                                                    transform: 'translateX(4px)',
                                                },
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        {submission.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        by {submission.user?.name || 'Unknown'} • {new Date(submission.created_at).toLocaleDateString('id-ID')}
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    component={Link}
                                                    href={route('admin.submissions')}
                                                    size="small"
                                                    sx={{
                                                        color: '#1abc9c',
                                                        fontWeight: 600,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(26, 188, 156, 0.1)',
                                                        }
                                                    }}
                                                >
                                                    Manage
                                                </Button>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </SidebarLayout>
    );
}
