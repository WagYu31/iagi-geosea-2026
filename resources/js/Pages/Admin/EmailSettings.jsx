import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    Alert,
    MenuItem,
    Snackbar,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';

export default function EmailSettings() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [testEmail, setTestEmail] = useState('');
    const [testResult, setTestResult] = useState('');

    const [formData, setFormData] = useState({
        mail_host: '',
        mail_port: 587,
        mail_username: '',
        mail_password: '',
        mail_encryption: 'tls',
        mail_from_address: '',
        mail_from_name: 'IAGI-GEOSEA 2026',
    });

    useEffect(() => {
        // Load existing settings
        fetch(route('admin.email.settings'))
            .then(res => res.json())
            .then(data => {
                if (data.id) {
                    setFormData({
                        mail_host: data.mail_host || '',
                        mail_port: data.mail_port || 587,
                        mail_username: data.mail_username || '',
                        mail_password: data.mail_password || '',
                        mail_encryption: data.mail_encryption || 'tls',
                        mail_from_address: data.mail_from_address || '',
                        mail_from_name: data.mail_from_name || 'IAGI-GEOSEA 2026',
                    });
                }
            });
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        setLoading(true);
        setError('');

        router.post(route('admin.email.save'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccess(true);
                setLoading(false);
            },
            onError: (errors) => {
                setError(Object.values(errors).join(', '));
                setLoading(false);
            }
        });
    };

    const handleTestEmail = () => {
        if (!testEmail) {
            setTestResult('Please enter a test email address');
            return;
        }

        setLoading(true);
        fetch(route('admin.email.test'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
            body: JSON.stringify({ test_email: testEmail })
        })
        .then(res => res.json())
        .then(data => {
            setTestResult(data.message);
            setLoading(false);
        })
        .catch(err => {
            setTestResult('Error: ' + err.message);
            setLoading(false);
        });
    };

    return (
        <SidebarLayout>
            <Head title="SMTP Email Settings" />

            <Box>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#1a3a4a' }}>
                    SMTP Email Settings
                </Typography>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                        Mail Server Configuration
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="SMTP Host"
                                value={formData.mail_host}
                                onChange={(e) => handleChange('mail_host', e.target.value)}
                                placeholder="smtp.gmail.com"
                                helperText="SMTP server address"
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                type="number"
                                label="SMTP Port"
                                value={formData.mail_port}
                                onChange={(e) => handleChange('mail_port', e.target.value)}
                                helperText="Usually 587 or 465"
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                select
                                label="Encryption"
                                value={formData.mail_encryption}
                                onChange={(e) => handleChange('mail_encryption', e.target.value)}
                            >
                                <MenuItem value="tls">TLS</MenuItem>
                                <MenuItem value="ssl">SSL</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Username"
                                value={formData.mail_username}
                                onChange={(e) => handleChange('mail_username', e.target.value)}
                                placeholder="your-email@gmail.com"
                                helperText="SMTP username (usually your email)"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Password"
                                value={formData.mail_password}
                                onChange={(e) => handleChange('mail_password', e.target.value)}
                                placeholder="Your SMTP password or app password"
                                helperText="For Gmail, use App Password"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="email"
                                label="From Email Address"
                                value={formData.mail_from_address}
                                onChange={(e) => handleChange('mail_from_address', e.target.value)}
                                placeholder="noreply@iagi-geosea.com"
                                helperText="Email address that appears as sender"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="From Name"
                                value={formData.mail_from_name}
                                onChange={(e) => handleChange('mail_from_name', e.target.value)}
                                placeholder="IAGI-GEOSEA 2026"
                                helperText="Name that appears as sender"
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            disabled={loading}
                            sx={{
                                backgroundColor: '#006838',
                                '&:hover': { backgroundColor: '#004d28' },
                            }}
                        >
                            Save SMTP Settings
                        </Button>
                    </Box>
                </Paper>

                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                        Test Email Configuration
                    </Typography>

                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="email"
                                label="Test Email Address"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                placeholder="test@example.com"
                                helperText="Enter email address to send test email"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<SendIcon />}
                                onClick={handleTestEmail}
                                disabled={loading}
                                fullWidth
                            >
                                Send Test Email
                            </Button>
                        </Grid>
                    </Grid>

                    {testResult && (
                        <Alert
                            severity={testResult.includes('success') ? 'success' : 'error'}
                            sx={{ mt: 2 }}
                        >
                            {testResult}
                        </Alert>
                    )}
                </Paper>
            </Box>

            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="success" onClose={() => setSuccess(false)}>
                    SMTP settings saved successfully!
                </Alert>
            </Snackbar>
        </SidebarLayout>
    );
}
