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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1abc9c', mb: 3 }}>
                    My Payments
                </Typography>

                {/* Submissions Needing Payment */}
                {submissionsNeedingPayment.length > 0 && (
                    <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#fff8e1' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#f57c00' }}>
                            ⚠️ Submissions Requiring Payment
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            The following submissions need payment proof upload
                        </Typography>
                        <Grid container spacing={2}>
                            {submissionsNeedingPayment.map((submission) => (
                                <Grid item xs={12} key={submission.id}>
                                    <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e0e0e0' }}>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {submission.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Submitted: {new Date(submission.created_at).toLocaleDateString('id-ID')}
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            startIcon={<CloudUploadIcon />}
                                            onClick={() => handleOpenDialog(submission)}
                                            sx={{
                                                backgroundColor: '#1abc9c',
                                                '&:hover': { backgroundColor: '#16a085' },
                                            }}
                                        >
                                            Upload Payment
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                )}

                {/* Payment History */}
                <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Payment History
                    </Typography>
                    {payments.length === 0 ? (
                        <Alert severity="info">
                            No payment records found. Upload your payment proof after submitting a paper.
                        </Alert>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                        <TableCell sx={{ fontWeight: 600 }}>Submission Title</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Uploaded At</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {payments.map((payment) => (
                                        <TableRow key={payment.id} hover>
                                            <TableCell>{payment.submission?.title || 'N/A'}</TableCell>
                                            <TableCell>
                                                {payment.amount ? `Rp ${parseFloat(payment.amount).toLocaleString('id-ID')}` : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={payment.verified ? 'Verified' : 'Pending Verification'}
                                                    color={payment.verified ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {payment.created_at ? new Date(payment.created_at).toLocaleDateString('id-ID') : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {payment.payment_proof_url && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<VisibilityIcon />}
                                                        href={`/storage/${payment.payment_proof_url}`}
                                                        target="_blank"
                                                        sx={{
                                                            color: '#1abc9c',
                                                            borderColor: '#1abc9c',
                                                            '&:hover': { borderColor: '#16a085', backgroundColor: 'rgba(26, 188, 156, 0.04)' },
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
                    )}
                </Paper>
            </Box>

            {/* Upload Payment Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{
                    backgroundColor: '#1abc9c',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    Upload Payment Proof
                    <IconButton
                        onClick={handleCloseDialog}
                        sx={{ color: 'white' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {selectedSubmission && (
                            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Submission:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
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
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{
                                    border: '2px dashed #e0e0e0',
                                    borderRadius: 2,
                                    p: 3,
                                    textAlign: 'center',
                                    backgroundColor: '#fafafa'
                                }}>
                                    <CloudUploadIcon sx={{ fontSize: 48, color: '#1abc9c', mb: 2 }} />
                                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                                        Upload Payment Proof *
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Upload a screenshot or photo of your payment receipt
                                        <br />
                                        (JPG, PNG, or PDF - Max 5MB)
                                    </Typography>
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{
                                            backgroundColor: '#1abc9c',
                                            '&:hover': { backgroundColor: '#16a085' },
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
                                        <Typography variant="body2" sx={{ mt: 2, color: '#1abc9c', fontWeight: 600 }}>
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
                                <Alert severity="info">
                                    <strong>Payment Information:</strong>
                                    <br />
                                    Please transfer to the conference account and upload your payment proof here.
                                    Admin will verify your payment within 1-2 business days.
                                </Alert>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button
                            onClick={handleCloseDialog}
                            disabled={processing}
                            sx={{ color: '#666' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing || !data.payment_proof}
                            sx={{
                                backgroundColor: '#1abc9c',
                                '&:hover': { backgroundColor: '#16a085' },
                                '&:disabled': { backgroundColor: '#cccccc' },
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
