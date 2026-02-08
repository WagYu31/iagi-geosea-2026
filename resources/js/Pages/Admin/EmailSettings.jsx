import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, TextField, Button, Grid,
    Alert, MenuItem, Snackbar, Avatar, Stack, InputAdornment, useTheme,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import DnsIcon from '@mui/icons-material/Dns';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

export default function EmailSettings() {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [testEmail, setTestEmail] = useState('');
    const [testResult, setTestResult] = useState('');

    const [formData, setFormData] = useState({
        mail_host: '', mail_port: 587, mail_username: '', mail_password: '',
        mail_encryption: 'tls', mail_from_address: '', mail_from_name: 'IAGI-GEOSEA 2026',
    });

    useEffect(() => {
        fetch(route('admin.email.settings'))
            .then(res => res.json())
            .then(data => {
                if (data.id) {
                    setFormData({
                        mail_host: data.mail_host || '', mail_port: data.mail_port || 587,
                        mail_username: data.mail_username || '', mail_password: data.mail_password || '',
                        mail_encryption: data.mail_encryption || 'tls',
                        mail_from_address: data.mail_from_address || '',
                        mail_from_name: data.mail_from_name || 'IAGI-GEOSEA 2026',
                    });
                }
            });
    }, []);

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSave = () => {
        setLoading(true); setError('');
        router.post(route('admin.email.save'), formData, {
            preserveScroll: true,
            onSuccess: () => { setSuccess(true); setLoading(false); },
            onError: (errors) => { setError(Object.values(errors).join(', ')); setLoading(false); }
        });
    };

    const handleTestEmail = () => {
        if (!testEmail) { setTestResult('Please enter a test email address'); return; }
        setLoading(true);
        fetch(route('admin.email.test'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') },
            body: JSON.stringify({ test_email: testEmail })
        })
            .then(res => res.json())
            .then(data => { setTestResult(data.message); setLoading(false); })
            .catch(err => { setTestResult('Error: ' + err.message); setLoading(false); });
    };

    const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: '10px', '& fieldset': { borderColor: c.cardBorder }, '&:hover fieldset': { borderColor: '#1abc9c' }, '&.Mui-focused fieldset': { borderColor: '#1abc9c' } }, '& .MuiInputLabel-root.Mui-focused': { color: '#1abc9c' }, '& input': { color: c.textPrimary }, '& .MuiFormHelperText-root': { color: c.textMuted } };
    const tealBtn = { background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)', '&:hover': { background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600, px: 3, boxShadow: '0 4px 14px rgba(26,188,156,0.35)' };

    return (
        <SidebarLayout>
            <Head title="SMTP Email Settings" />
            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: { xs: '1.5rem', sm: '1.85rem' }, letterSpacing: '-0.02em' }}>
                        Email Settings ✉️
                    </Typography>
                    <Typography variant="body2" sx={{ color: c.textMuted, mt: 0.5 }}>Configure SMTP server for outgoing emails</Typography>
                </Box>

                {/* Mail Server Config */}
                <Card elevation={0} sx={{ borderRadius: '16px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, mb: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5', width: 40, height: 40, borderRadius: '10px' }}>
                                <DnsIcon sx={{ color: '#1abc9c', fontSize: 22 }} />
                            </Avatar>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: c.textPrimary }}>Mail Server Configuration</Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>{error}</Alert>}

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="SMTP Host" value={formData.mail_host} onChange={(e) => handleChange('mail_host', e.target.value)} placeholder="smtp.gmail.com" helperText="SMTP server address" sx={inputSx} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth type="number" label="SMTP Port" value={formData.mail_port} onChange={(e) => handleChange('mail_port', e.target.value)} helperText="Usually 587 or 465" sx={inputSx} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth select label="Encryption" value={formData.mail_encryption} onChange={(e) => handleChange('mail_encryption', e.target.value)} sx={inputSx}>
                                    <MenuItem value="tls">TLS</MenuItem>
                                    <MenuItem value="ssl">SSL</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="Username" value={formData.mail_username} onChange={(e) => handleChange('mail_username', e.target.value)} placeholder="your-email@gmail.com" helperText="SMTP username (usually your email)" sx={inputSx} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth type="password" label="Password" value={formData.mail_password} onChange={(e) => handleChange('mail_password', e.target.value)} placeholder="Your SMTP password or app password" helperText="For Gmail, use App Password" sx={inputSx} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth type="email" label="From Email Address" value={formData.mail_from_address} onChange={(e) => handleChange('mail_from_address', e.target.value)} placeholder="noreply@iagi-geosea.com" helperText="Email address that appears as sender" sx={inputSx} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="From Name" value={formData.mail_from_name} onChange={(e) => handleChange('mail_from_name', e.target.value)} placeholder="IAGI-GEOSEA 2026" helperText="Name that appears as sender" sx={inputSx} />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 3 }}>
                            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={loading} sx={tealBtn}>
                                {loading ? 'Saving...' : 'Save SMTP Settings'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Test Email */}
                <Card elevation={0} sx={{ borderRadius: '16px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(37,99,235,0.12)' : '#dbeafe', width: 40, height: 40, borderRadius: '10px' }}>
                                <SendIcon sx={{ color: '#2563eb', fontSize: 22 }} />
                            </Avatar>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: c.textPrimary }}>Test Email Configuration</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <TextField value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="test@example.com" helperText="Enter email address to send test email" size="small" sx={{ flex: 1, minWidth: 250, ...inputSx }} />
                            <Button variant="contained" startIcon={<SendIcon />} onClick={handleTestEmail} disabled={loading} sx={{ ...tealBtn, mt: 0.3 }}>
                                Send Test Email
                            </Button>
                        </Box>

                        {testResult && (
                            <Alert severity={testResult.includes('success') ? 'success' : 'error'} sx={{ mt: 2, borderRadius: '10px' }}>
                                {testResult}
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </Box>

            <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity="success" onClose={() => setSuccess(false)} variant="filled" sx={{ borderRadius: '10px' }}>
                    SMTP settings saved successfully!
                </Alert>
            </Snackbar>
        </SidebarLayout>
    );
}
