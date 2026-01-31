import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
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
    IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

export default function AdminPayments({ payments = [] }) {
    const [proofDialog, setProofDialog] = useState({ open: false, payment: null });

    const handleVerify = (paymentId) => {
        if (confirm('Are you sure you want to verify this payment?')) {
            router.patch(route('admin.payments.verify', paymentId), {}, {
                preserveScroll: true,
            });
        }
    };

    const handleReject = (paymentId) => {
        if (confirm('Are you sure you want to reject this payment?')) {
            router.patch(route('admin.payments.reject', paymentId), {}, {
                preserveScroll: true,
            });
        }
    };

    const handleViewProof = (payment) => {
        setProofDialog({ open: true, payment });
    };

    return (
        <SidebarLayout>
            <Head title="Manage Payments" />

            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1abc9c', mb: 3 }}>
                    Manage Payments
                </Typography>

                <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Submission</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Uploaded At</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                                No payments found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map((payment) => (
                                        <TableRow key={payment.id} hover>
                                            <TableCell>{payment.id}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {payment.user?.name || 'N/A'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {payment.user?.email || 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{payment.submission?.title || 'N/A'}</TableCell>
                                            <TableCell>
                                                {payment.amount ? `Rp ${parseFloat(payment.amount).toLocaleString('id-ID')}` : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={payment.verified ? 'Verified' : 'Pending'}
                                                    color={payment.verified ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {payment.created_at ? new Date(payment.created_at).toLocaleDateString('id-ID') : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    {payment.payment_proof_url && (
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<VisibilityIcon />}
                                                            onClick={() => handleViewProof(payment)}
                                                            sx={{
                                                                color: '#1976d2',
                                                                borderColor: '#1976d2',
                                                            }}
                                                        >
                                                            View
                                                        </Button>
                                                    )}
                                                    {!payment.verified ? (
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            startIcon={<CheckCircleIcon />}
                                                            onClick={() => handleVerify(payment.id)}
                                                            sx={{
                                                                backgroundColor: '#2e7d32',
                                                                '&:hover': { backgroundColor: '#1b5e20' },
                                                            }}
                                                        >
                                                            Verify
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<CancelIcon />}
                                                            onClick={() => handleReject(payment.id)}
                                                            color="error"
                                                        >
                                                            Reject
                                                        </Button>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>

            {/* Payment Proof Dialog */}
            <Dialog
                open={proofDialog.open}
                onClose={() => setProofDialog({ open: false, payment: null })}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{
                    backgroundColor: '#1abc9c',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    Payment Proof
                    <IconButton
                        onClick={() => setProofDialog({ open: false, payment: null })}
                        sx={{ color: 'white' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    {proofDialog.payment && (
                        <Box>
                            <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    User:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {proofDialog.payment.user?.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Submission:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {proofDialog.payment.submission?.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Amount:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Rp {parseFloat(proofDialog.payment.amount || 0).toLocaleString('id-ID')}
                                </Typography>
                            </Box>

                            {proofDialog.payment.payment_proof_url && (
                                <Box sx={{ textAlign: 'center' }}>
                                    <img
                                        src={`/storage/${proofDialog.payment.payment_proof_url}`}
                                        alt="Payment Proof"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '500px',
                                            objectFit: 'contain',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<p style="padding: 40px; text-align: center; color: #666;">Unable to load image. <a href="/storage/' + proofDialog.payment.payment_proof_url + '" target="_blank">Download file</a></p>';
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    {proofDialog.payment && !proofDialog.payment.verified && (
                        <Button
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => {
                                handleVerify(proofDialog.payment.id);
                                setProofDialog({ open: false, payment: null });
                            }}
                            sx={{
                                backgroundColor: '#2e7d32',
                                '&:hover': { backgroundColor: '#1b5e20' },
                            }}
                        >
                            Verify Payment
                        </Button>
                    )}
                    <Button onClick={() => setProofDialog({ open: false, payment: null })}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </SidebarLayout>
    );
}
