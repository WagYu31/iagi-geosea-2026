import React, { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Box, Typography, TextField, Button, Stack, useTheme,
    InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';

export default function UpdatePasswordForm({ className = '' }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errs.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <form onSubmit={updatePassword} className={className}>
            <Stack spacing={2.5}>
                {/* Current Password */}
                <Box>
                    <Typography variant="caption" sx={{
                        color: c.textSecondary,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'block',
                        mb: 0.8,
                    }}>
                        Current Password *
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        id="current_password"
                        inputRef={currentPasswordInput}
                        type={showCurrent ? 'text' : 'password'}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                        error={!!errors.current_password}
                        helperText={errors.current_password}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <VpnKeyOutlinedIcon sx={{ color: c.textSecondary, fontSize: 18 }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        edge="end"
                                    >
                                        {showCurrent ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: '12px',
                                fontSize: '0.88rem',
                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                '& fieldset': { borderColor: c.cardBorder },
                                '&:hover fieldset': { borderColor: '#059669' },
                                '&.Mui-focused fieldset': { borderColor: '#059669', borderWidth: 2 },
                            },
                        }}
                    />
                </Box>

                {/* New Password */}
                <Box>
                    <Typography variant="caption" sx={{
                        color: c.textSecondary,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'block',
                        mb: 0.8,
                    }}>
                        New Password *
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        id="password"
                        inputRef={passwordInput}
                        type={showNew ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        placeholder="••••••••••••"
                        error={!!errors.password}
                        helperText={errors.password || 'Minimum 8 characters with numbers & symbols'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon sx={{ color: c.textSecondary, fontSize: 18 }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setShowNew(!showNew)}
                                        edge="end"
                                    >
                                        {showNew ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: '12px',
                                fontSize: '0.88rem',
                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                '& fieldset': { borderColor: c.cardBorder },
                                '&:hover fieldset': { borderColor: '#059669' },
                                '&.Mui-focused fieldset': { borderColor: '#059669', borderWidth: 2 },
                            },
                        }}
                    />
                </Box>

                {/* Confirm Password */}
                <Box>
                    <Typography variant="caption" sx={{
                        color: c.textSecondary,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'block',
                        mb: 0.8,
                    }}>
                        Confirm New Password *
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        id="password_confirmation"
                        type={showConfirm ? 'text' : 'password'}
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        placeholder="••••••••••••"
                        error={!!errors.password_confirmation}
                        helperText={errors.password_confirmation}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon sx={{ color: c.textSecondary, fontSize: 18 }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        edge="end"
                                    >
                                        {showConfirm ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: '12px',
                                fontSize: '0.88rem',
                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                '& fieldset': { borderColor: c.cardBorder },
                                '&:hover fieldset': { borderColor: '#059669' },
                                '&.Mui-focused fieldset': { borderColor: '#059669', borderWidth: 2 },
                            },
                        }}
                    />
                </Box>

                {/* Update Button */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: 1.5,
                    pt: 1,
                }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={processing}
                        startIcon={processing ? <CircularProgress size={16} color="inherit" /> : <SecurityIcon />}
                        sx={{
                            width: { xs: '100%', sm: 'auto' },
                            background: 'linear-gradient(135deg, #094d42 0%, #059669 100%)',
                            color: '#ffffff',
                            borderRadius: '12px',
                            px: 3,
                            py: 1.3,
                            textTransform: 'none',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            letterSpacing: '0.02em',
                            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #063830 0%, #047857 100%)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 18px rgba(5, 150, 105, 0.4)',
                            },
                        }}
                    >
                        {processing ? 'Updating...' : 'Update Password'}
                    </Button>

                    {recentlySuccessful && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 0.6, color: '#059669' }}>
                            <CheckCircleIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>
                                Password updated!
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Stack>
        </form>
    );
}
