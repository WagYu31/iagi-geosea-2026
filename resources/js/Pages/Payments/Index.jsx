import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Alert,
    IconButton,
    Stack,
    Card,
    CardContent,
    useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function Index({ payments = [], submissions = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        submission_id: '',
        amount: '',
        payment_proof: null,
    });

    const handleOpenDialog = (submission) => {
        setSelectedSubmission(submission);
        setData({
            submission_id: submission.id,
            amount: '',
            payment_proof: null,
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedSubmission(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payments.store'), {
            forceFormData: true,
            onSuccess: () => {
                handleCloseDialog();
            },
        });
    };

    // Get submissions that don't have payment yet or payment not verified
    // AND only show if submission status is 'accepted'
    const submissionsNeedingPayment = submissions.filter(sub => {
        const payment = payments.find(p => p.submission_id === sub.id);
        const isAccepted = sub.status && sub.status.toLowerCase() === 'accepted';
        return isAccepted && (!payment || !payment.verified);
    });

    return (
        <SidebarLayout>
            <Head title="Payments" />

            <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '1400px', margin: '0 auto' }}>
                {/* Page Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography sx={{
                        fontWeight: 800,
                        color: c.textPrimary,
                        fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.75rem' },
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                    }}>
                        My Payments
                    </Typography>
                    <Typography sx={{ color: c.textMuted, fontSize: '0.85rem', mt: 0.5 }}>
                        Upload payment proofs and track verification status
                    </Typography>
                </Box>

                {/* Submissions Needing Payment */}
                {submissionsNeedingPayment.length > 0 && (
                    <Paper elevation={0} sx={{
                        p: { xs: 2, md: 3 },
                        mb: 3,
                        border: '1px solid #fde68a',
                        borderRadius: '16px',
                        bgcolor: '#fffef5',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                        },
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <WarningAmberRoundedIcon sx={{ color: '#d97706', fontSize: '1.2rem' }} />
                            <Typography sx={{ fontWeight: 700, color: '#92400e', fontSize: '0.95rem' }}>
                                Submissions Requiring Payment
                            </Typography>
                        </Box>
                        <Typography sx={{ color: '#a16207', fontSize: '0.8rem', mb: 2.5, pl: 3.5 }}>
                            The following accepted submissions need payment proof upload
                        </Typography>

                        <Stack spacing={1.5}>
                            {submissionsNeedingPayment.map((submission) => (
                                <Paper key={submission.id} elevation={0} sx={{
                                    p: { xs: 1.5, md: 2 },
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: 'space-between',
                                    alignItems: { xs: 'stretch', sm: 'center' },
                                    gap: { xs: 1.5, sm: 2 },
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '12px',
                                    bgcolor: '#fff',
                                    maxWidth: '700px',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: '#e5e7eb',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    },
                                }}>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', lineHeight: 1.3 }} noWrap>
                                            {submission.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', mt: 0.3 }}>
                                            Submitted: {new Date(submission.created_at).toLocaleDateString('id-ID')}
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={<CloudUploadIcon sx={{ fontSize: '1rem !important' }} />}
                                        onClick={() => handleOpenDialog(submission)}
                                        sx={{
                                            background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                            boxShadow: '0 4px 14px rgba(13, 122, 106, 0.25)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #0a6b5c 0%, #16a085 100%)',
                                                boxShadow: '0 6px 20px rgba(13, 122, 106, 0.35)',
                                            },
                                            textTransform: 'none',
                                            borderRadius: '10px',
                                            fontWeight: 600,
                                            fontSize: '0.8rem',
                                            px: 2.5,
                                            py: 1,
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0,
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        Upload Payment
                                    </Button>
                                </Paper>
                            ))}
                        </Stack>
                    </Paper>
                )}

                {/* Payment History */}
                <Paper elevation={0} sx={{
                    p: { xs: 2, md: 3 },
                    border: '1px solid #f0f0f0',
                    borderRadius: '16px',
                    bgcolor: '#fff',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ReceiptLongIcon sx={{ color: '#6b7280', fontSize: '1.1rem' }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
                            Payment History
                        </Typography>
                    </Box>

                    {payments.length === 0 ? (
                        <Box sx={{
                            textAlign: 'center',
                            py: { xs: 5, md: 8 },
                            px: 2,
                        }}>
                            {/* NO PAYMENT Icon */}
                            <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: isDark ? 'rgba(239, 68, 68, 0.08)' : '#fef2f2',
                                border: `2px dashed ${isDark ? 'rgba(239, 68, 68, 0.25)' : '#fecaca'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                mb: 3,
                                position: 'relative',
                            }}>
                                <ReceiptLongIcon sx={{ color: isDark ? '#f87171' : '#ef4444', fontSize: '2rem' }} />
                                {/* Strikethrough line */}
                                <Box sx={{
                                    position: 'absolute',
                                    width: '60%',
                                    height: '3px',
                                    bgcolor: isDark ? '#f87171' : '#ef4444',
                                    borderRadius: '2px',
                                    transform: 'rotate(-45deg)',
                                }} />
                            </Box>
                            <Typography sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '1.1rem', mb: 1 }}>
                                No Payment Required Yet
                            </Typography>
                            <Typography sx={{
                                color: c.textMuted,
                                fontSize: '0.85rem',
                                maxWidth: 480,
                                mx: 'auto',
                                lineHeight: 1.7,
                            }}>
                                Payment will be required once the abstract has been confirmed as accepted and the participant is declared to have advanced to the next stage.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#f8fafb' }}>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: '2px solid #f0f0f0' }}>Submission</TableCell>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: '2px solid #f0f0f0' }}>Amount</TableCell>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: '2px solid #f0f0f0' }}>Status</TableCell>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: '2px solid #f0f0f0' }}>Uploaded</TableCell>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: '2px solid #f0f0f0' }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {payments.map((payment) => (
                                                <TableRow key={payment.id} sx={{
                                                    transition: 'background-color 0.15s ease',
                                                    '&:hover': { bgcolor: '#f9fafb' },
                                                    '& td': { borderBottom: '1px solid #f3f4f6', py: 1.8, fontSize: '0.85rem', color: '#374151' },
                                                }}>
                                                    <TableCell>
                                                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827' }}>
                                                            {payment.submission?.title || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', fontFamily: 'monospace' }}>
                                                            {payment.amount ? `Rp ${parseFloat(payment.amount).toLocaleString('id-ID')}` : 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={payment.verified ? 'Verified' : 'Pending Verification'}
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 700,
                                                                fontSize: '0.65rem',
                                                                borderRadius: '8px',
                                                                ...(payment.verified ? {
                                                                    bgcolor: '#ecfdf5', color: '#059669', border: '1px solid #d1fae5',
                                                                } : {
                                                                    bgcolor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a',
                                                                }),
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography sx={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                                            {payment.created_at ? new Date(payment.created_at).toLocaleDateString('id-ID') : 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {payment.payment_proof_url && (
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={<VisibilityIcon sx={{ fontSize: '0.9rem !important' }} />}
                                                                href={`/storage/${payment.payment_proof_url}`}
                                                                target="_blank"
                                                                sx={{
                                                                    color: '#0d7a6a',
                                                                    borderColor: '#d1fae5',
                                                                    bgcolor: '#f0fdf4',
                                                                    borderRadius: '8px',
                                                                    textTransform: 'none',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.75rem',
                                                                    px: 1.5,
                                                                    '&:hover': {
                                                                        borderColor: '#0d7a6a',
                                                                        bgcolor: '#ecfdf5',
                                                                    },
                                                                }}
                                                            >
                                                                View Proof
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            {/* Mobile Card View */}
                            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                                <Stack spacing={1.5}>
                                    {payments.map((payment) => (
                                        <Card key={payment.id} variant="outlined" sx={{
                                            borderRadius: '14px',
                                            border: '1px solid #f0f0f0',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                                                borderColor: '#e5e7eb',
                                            },
                                        }}>
                                            <CardContent sx={{ p: 2.5 }}>
                                                {/* Header: Amount + Status */}
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                    <Typography sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.9rem', color: '#111827' }}>
                                                        {payment.amount ? `Rp ${parseFloat(payment.amount).toLocaleString('id-ID')}` : 'N/A'}
                                                    </Typography>
                                                    <Chip
                                                        label={payment.verified ? 'Verified' : 'Pending'}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                            fontSize: '0.65rem',
                                                            borderRadius: '8px',
                                                            ...(payment.verified ? {
                                                                bgcolor: '#ecfdf5', color: '#059669', border: '1px solid #d1fae5',
                                                            } : {
                                                                bgcolor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a',
                                                            }),
                                                        }}
                                                    />
                                                </Box>

                                                {/* Title */}
                                                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151', mb: 0.3 }}>
                                                    {payment.submission?.title || 'N/A'}
                                                </Typography>

                                                {/* Date */}
                                                <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', mb: 2 }}>
                                                    Uploaded: {payment.created_at ? new Date(payment.created_at).toLocaleDateString('id-ID') : 'N/A'}
                                                </Typography>

                                                {/* Action */}
                                                {payment.payment_proof_url && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        fullWidth
                                                        startIcon={<VisibilityIcon sx={{ fontSize: '0.9rem !important' }} />}
                                                        href={`/storage/${payment.payment_proof_url}`}
                                                        target="_blank"
                                                        sx={{
                                                            color: '#0d7a6a',
                                                            borderColor: '#d1fae5',
                                                            bgcolor: '#f0fdf4',
                                                            borderRadius: '10px',
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            fontSize: '0.8rem',
                                                            py: 0.8,
                                                            '&:hover': {
                                                                borderColor: '#0d7a6a',
                                                                bgcolor: '#ecfdf5',
                                                            },
                                                        }}
                                                    >
                                                        View Proof
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            </Box>
                        </>
                    )}
                </Paper>
            </Box>

            {/* Upload Payment Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        overflow: 'hidden',
                    },
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                        Upload Payment Proof
                    </Typography>
                    <IconButton
                        onClick={handleCloseDialog}
                        sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ pt: 3 }}>
                        {selectedSubmission && (
                            <Box sx={{ mb: 3, p: 2, bgcolor: '#f8fafb', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                                <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, mb: 0.3 }}>
                                    Submission
                                </Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>
                                    {selectedSubmission.title}
                                </Typography>
                            </Box>
                        )}

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Payment Amount (Rp) *"
                                    type="number"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    error={!!errors.amount}
                                    helperText={errors.amount || 'Enter the amount you paid'}
                                    required
                                    inputProps={{ min: 0, step: 0.01 }}
                                    InputProps={{
                                        sx: { borderRadius: '10px' },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{
                                    border: '2px dashed #e5e7eb',
                                    borderRadius: '14px',
                                    p: { xs: 2.5, md: 3 },
                                    textAlign: 'center',
                                    bgcolor: '#fafafa',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: '#0d7a6a',
                                        bgcolor: '#f0fdf4',
                                    },
                                }}>
                                    <Box sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '12px',
                                        bgcolor: '#ecfdf5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto',
                                        mb: 1.5,
                                    }}>
                                        <CloudUploadIcon sx={{ fontSize: '1.4rem', color: '#0d7a6a' }} />
                                    </Box>
                                    <Typography sx={{ mb: 0.5, fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>
                                        Upload Payment Proof *
                                    </Typography>
                                    <Typography sx={{ mb: 2, fontSize: '0.75rem', color: '#9ca3af' }}>
                                        Screenshot or photo of your payment receipt
                                        <br />
                                        (JPG, PNG, or PDF — Max 5MB)
                                    </Typography>
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUploadIcon sx={{ fontSize: '1rem !important' }} />}
                                        sx={{
                                            background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                            boxShadow: 'none',
                                            borderRadius: '10px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '0.8rem',
                                            px: 3,
                                            py: 1,
                                            '&:hover': {
                                                boxShadow: '0 4px 14px rgba(13, 122, 106, 0.3)',
                                            },
                                        }}
                                    >
                                        Choose File
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            onChange={(e) => setData('payment_proof', e.target.files[0])}
                                            required
                                        />
                                    </Button>
                                    {data.payment_proof && (
                                        <Typography sx={{ mt: 2, color: '#059669', fontWeight: 700, fontSize: '0.8rem' }}>
                                            ✓ {data.payment_proof.name}
                                        </Typography>
                                    )}
                                    {errors.payment_proof && (
                                        <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                                            {errors.payment_proof}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{
                                    p: 2,
                                    bgcolor: '#eff6ff',
                                    borderRadius: '12px',
                                    border: '1px solid #dbeafe',
                                }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#1e40af', mb: 0.5 }}>
                                        Payment Information
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', lineHeight: 1.6 }}>
                                        Please transfer to the conference account and upload your payment proof here.
                                        Admin will verify your payment within 1-2 business days.
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5, gap: 1 }}>
                        <Button
                            onClick={handleCloseDialog}
                            disabled={processing}
                            sx={{
                                color: '#6b7280',
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: '10px',
                                px: 2.5,
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing || !data.payment_proof}
                            sx={{
                                background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                boxShadow: '0 4px 14px rgba(13, 122, 106, 0.25)',
                                '&:hover': {
                                    boxShadow: '0 6px 20px rgba(13, 122, 106, 0.35)',
                                },
                                '&:disabled': {
                                    background: '#e5e7eb',
                                    color: '#9ca3af',
                                    boxShadow: 'none',
                                },
                                textTransform: 'none',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                px: 3,
                                py: 1,
                            }}
                        >
                            {processing ? 'Uploading...' : 'Upload Payment'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </SidebarLayout>
    );
}
