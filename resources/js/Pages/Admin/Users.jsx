import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Select, MenuItem, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, CircularProgress,
    Snackbar, Alert, Avatar, Tooltip, InputAdornment, FormControl, InputLabel,
    useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PeopleIcon from '@mui/icons-material/People';
import PersonOffIcon from '@mui/icons-material/PersonOff';

export default function AdminUsers({ users = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
    const [roleDialog, setRoleDialog] = useState({ open: false, user: null, newRole: null });
    const [passwordDialog, setPasswordDialog] = useState({ open: false, user: null, password: '', confirmPassword: '', error: '' });
    const [createDialog, setCreateDialog] = useState({ open: false, name: '', email: '', password: '', confirmPassword: '', role: 'Author', error: '', showPassword: false, showConfirmPassword: false });
    const [loading, setLoading] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleRoleChange = (user, newRole) => {
        const oldRole = user.role || 'Author';
        if (newRole === 'Admin' || (oldRole === 'Admin' && newRole !== 'Admin')) {
            setRoleDialog({ open: true, user, newRole });
        } else {
            updateUserRole(user.id, newRole, user.name);
        }
    };

    const updateUserRole = (userId, newRole, userName) => {
        setLoading(userId);
        router.patch(route('admin.users.updateRole', userId), { role: newRole }, {
            preserveScroll: true, preserveState: false,
            onSuccess: () => { setLoading(null); setSnackbar({ open: true, message: `Updated ${userName}'s role to ${newRole}`, severity: 'success' }); },
            onError: () => { setLoading(null); setSnackbar({ open: true, message: 'Failed to update role.', severity: 'error' }); }
        });
    };

    const handleRoleConfirm = () => {
        if (roleDialog.user) { updateUserRole(roleDialog.user.id, roleDialog.newRole, roleDialog.user.name); setRoleDialog({ open: false, user: null, newRole: null }); }
    };
    const handleDeleteClick = (user) => setDeleteDialog({ open: true, user });
    const handleDeleteConfirm = () => {
        if (deleteDialog.user) { router.delete(route('admin.users.delete', deleteDialog.user.id), { preserveScroll: true, onSuccess: () => setDeleteDialog({ open: false, user: null }) }); }
    };
    const handleEditPasswordClick = (user) => setPasswordDialog({ open: true, user, password: '', confirmPassword: '', error: '' });
    const handlePasswordUpdate = () => {
        const { user, password, confirmPassword } = passwordDialog;
        if (!password || password.length < 8) { setPasswordDialog({ ...passwordDialog, error: 'Password must be at least 8 characters' }); return; }
        if (password !== confirmPassword) { setPasswordDialog({ ...passwordDialog, error: 'Passwords do not match' }); return; }
        setLoading(user.id);
        router.patch(route('admin.users.updatePassword', user.id), { password }, {
            preserveScroll: true,
            onSuccess: () => { setLoading(null); setPasswordDialog({ open: false, user: null, password: '', confirmPassword: '', error: '' }); setSnackbar({ open: true, message: `Updated password for ${user.name}`, severity: 'success' }); },
            onError: (errors) => { setLoading(null); setPasswordDialog({ ...passwordDialog, error: errors.password || 'Failed to update password.' }); }
        });
    };
    const handleCreateUser = () => {
        const { name, email, password, confirmPassword, role } = createDialog;
        if (!name || !email || !password || !confirmPassword || !role) { setCreateDialog({ ...createDialog, error: 'All fields are required' }); return; }
        if (password.length < 8) { setCreateDialog({ ...createDialog, error: 'Password must be at least 8 characters' }); return; }
        if (password !== confirmPassword) { setCreateDialog({ ...createDialog, error: 'Passwords do not match' }); return; }
        setLoading('creating');
        router.post(route('admin.users.create'), { name, email, password, role }, {
            preserveScroll: true,
            onSuccess: () => { setLoading(null); setCreateDialog({ open: false, name: '', email: '', password: '', confirmPassword: '', role: 'Author', error: '' }); setSnackbar({ open: true, message: `Created user ${name}`, severity: 'success' }); },
            onError: (errors) => { setLoading(null); setCreateDialog({ ...createDialog, error: errors.email || errors.password || 'Failed to create user.' }); }
        });
    };
    const handleToggleVerification = (user) => {
        const newStatus = !user.email_verified_at;
        setLoading(user.id);
        router.patch(route('admin.users.toggleVerification', user.id), { verify: newStatus }, {
            preserveScroll: true,
            onSuccess: () => { setLoading(null); setSnackbar({ open: true, message: `${newStatus ? 'Verified' : 'Unverified'} ${user.name}'s account`, severity: 'success' }); },
            onError: () => { setLoading(null); setSnackbar({ open: true, message: 'Failed to update verification.', severity: 'error' }); }
        });
    };

    const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()));

    const cellSx = { borderBottom: `1px solid ${c.cardBorder}`, py: 1.5, fontSize: '0.825rem', color: c.textPrimary };
    const headCellSx = { ...cellSx, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: c.textMuted, bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb' };

    const getRoleStyle = (role) => {
        const map = {
            Admin: { bg: isDark ? 'rgba(239,68,68,0.15)' : '#fee2e2', color: '#dc2626' },
            Reviewer: { bg: isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7', color: '#d97706' },
            Author: { bg: isDark ? 'rgba(107,114,128,0.15)' : '#f3f4f6', color: '#6b7280' },
        };
        return map[role] || map.Author;
    };

    const dialogPaper = { sx: { borderRadius: '16px', bgcolor: c.cardBg, border: `1px solid ${c.cardBorder}` } };
    const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: '10px', '& fieldset': { borderColor: c.cardBorder }, '&:hover fieldset': { borderColor: '#1abc9c' }, '&.Mui-focused fieldset': { borderColor: '#1abc9c' } } };
    const tealBtn = { background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)', '&:hover': { background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600, px: 3 };

    return (
        <SidebarLayout>
            <Head title="User Management" />
            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                {/* Header */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: { xs: '1.5rem', sm: '1.85rem' }, letterSpacing: '-0.02em' }}>
                            User Management 👥
                        </Typography>
                        <Typography variant="body2" sx={{ color: c.textMuted, mt: 0.5 }}>{users.length} registered users</Typography>
                    </Box>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialog({ open: true, name: '', email: '', password: '', confirmPassword: '', role: 'Author', error: '', showPassword: false, showConfirmPassword: false })} sx={{ ...tealBtn, boxShadow: '0 4px 14px rgba(26,188,156,0.35)', py: 1.2 }}>
                        Add User
                    </Button>
                </Box>

                {/* Search */}
                <Card elevation={0} sx={{ borderRadius: '14px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, mb: 2.5 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <TextField fullWidth placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} size="small"
                            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: c.textMuted, fontSize: 20 }} /></InputAdornment> }}
                            sx={{ ...inputSx, '& .MuiOutlinedInput-root': { ...inputSx['& .MuiOutlinedInput-root'], bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb' }, '& input': { color: c.textPrimary, fontSize: '0.85rem' } }}
                        />
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card elevation={0} sx={{ borderRadius: '16px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, overflow: 'hidden' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.5, py: 2, borderBottom: `1px solid ${c.cardBorder}` }}>
                        <Typography sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.95rem' }}>All Users ({filteredUsers.length})</Typography>
                    </Box>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {['Name', 'Email', 'Role', 'Account Status', 'Registered', 'Actions'].map(h => (
                                        <TableCell key={h} sx={headCellSx}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow><TableCell colSpan={6} align="center" sx={cellSx}>
                                        <Box sx={{ py: 5 }}><PersonOffIcon sx={{ fontSize: 48, color: isDark ? '#374151' : '#d1d5db', mb: 1 }} /><Typography variant="body2" sx={{ color: c.textMuted }}>No users found</Typography></Box>
                                    </TableCell></TableRow>
                                ) : filteredUsers.map((user) => {
                                    const rs = getRoleStyle(user.role || 'Author');
                                    return (
                                        <TableRow key={user.id} hover sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb' } }}>
                                            <TableCell sx={cellSx}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 34, height: 34, bgcolor: '#1abc9c', fontSize: '0.8rem', fontWeight: 700 }}>{(user.name || 'U').charAt(0)}</Avatar>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: c.textPrimary, fontSize: '0.85rem' }}>{user.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={cellSx}>
                                                <Typography variant="body2" sx={{ fontSize: '0.825rem', color: c.textMuted }}>{user.email}</Typography>
                                            </TableCell>
                                            <TableCell sx={cellSx}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Select value={user.role || 'Author'} onChange={(e) => handleRoleChange(user, e.target.value)} size="small" disabled={loading === user.id}
                                                        sx={{ minWidth: 110, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, bgcolor: rs.bg, color: rs.color, '& .MuiSelect-select': { py: 0.75 }, '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: rs.color } }}>
                                                        <MenuItem value="Author">Author</MenuItem>
                                                        <MenuItem value="Reviewer">Reviewer</MenuItem>
                                                        <MenuItem value="Admin">Admin</MenuItem>
                                                    </Select>
                                                    {loading === user.id && <CircularProgress size={18} sx={{ color: '#1abc9c' }} />}
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={cellSx}>
                                                <Chip label={user.email_verified_at ? '✓ Verified' : '⚠ Unverified'} size="small" onClick={() => handleToggleVerification(user)}
                                                    sx={{ bgcolor: user.email_verified_at ? (isDark ? 'rgba(22,163,74,0.15)' : '#dcfce7') : (isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7'), color: user.email_verified_at ? '#16a34a' : '#d97706', fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px', height: 24, cursor: 'pointer', '&:hover': { opacity: 0.85 } }} />
                                            </TableCell>
                                            <TableCell sx={cellSx}>
                                                <Typography variant="body2" sx={{ fontSize: '0.8rem', color: c.textMuted }}>{new Date(user.created_at).toLocaleDateString('id-ID')}</Typography>
                                            </TableCell>
                                            <TableCell sx={cellSx}>
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Tooltip title="Edit Password">
                                                        <IconButton size="small" onClick={() => handleEditPasswordClick(user)} sx={{ color: '#1abc9c', '&:hover': { bgcolor: isDark ? 'rgba(26,188,156,0.1)' : '#ecfdf5' } }}>
                                                            <EditIcon sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete User">
                                                        <IconButton size="small" onClick={() => handleDeleteClick(user)} sx={{ color: isDark ? '#f87171' : '#ef4444', '&:hover': { bgcolor: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2' } }}>
                                                            <DeleteIcon sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Box>

            {/* Role Confirm Dialog */}
            <Dialog open={roleDialog.open} onClose={() => setRoleDialog({ open: false, user: null, newRole: null })} maxWidth="sm" fullWidth PaperProps={dialogPaper}>
                <DialogTitle sx={{ fontWeight: 700, color: '#dc2626', borderBottom: `1px solid ${c.cardBorder}`, pb: 2 }}>⚠️ Critical Role Change</DialogTitle>
                <DialogContent sx={{ pt: 2.5 }}>
                    <Box sx={{ p: 2, bgcolor: isDark ? 'rgba(245,158,11,0.08)' : '#fff7ed', borderRadius: '10px', border: `1px solid ${isDark ? 'rgba(245,158,11,0.2)' : '#fed7aa'}`, mb: 2, mt: 1 }}>
                        <Typography variant="body2" sx={{ color: c.textPrimary, mb: 0.5 }}><strong>User:</strong> {roleDialog.user?.name}</Typography>
                        <Typography variant="body2" sx={{ color: c.textPrimary, mb: 0.5 }}><strong>Current:</strong> {roleDialog.user?.role || 'Author'}</Typography>
                        <Typography variant="body2" sx={{ color: c.textPrimary }}><strong>New:</strong> {roleDialog.newRole}</Typography>
                    </Box>
                    <Alert severity="warning" sx={{ borderRadius: '10px', mb: 2 }}>
                        {roleDialog.newRole === 'Admin' ? <><strong>Warning:</strong> This user will receive full admin access.</> : <><strong>Warning:</strong> Admin privileges will be revoked.</>}
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${c.cardBorder}` }}>
                    <Button onClick={() => setRoleDialog({ open: false, user: null, newRole: null })} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: c.textMuted }}>Cancel</Button>
                    <Button onClick={handleRoleConfirm} variant="contained" sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })} PaperProps={dialogPaper}>
                <DialogTitle sx={{ fontWeight: 700, color: '#dc2626', borderBottom: `1px solid ${c.cardBorder}`, pb: 2 }}>Delete User</DialogTitle>
                <DialogContent sx={{ pt: 2.5 }}>
                    <Typography sx={{ color: c.textPrimary, mt: 1 }}>Are you sure you want to delete <strong>{deleteDialog.user?.name}</strong>? This cannot be undone.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${c.cardBorder}` }}>
                    <Button onClick={() => setDeleteDialog({ open: false, user: null })} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: c.textMuted }}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} variant="contained" sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Password Dialog */}
            <Dialog open={passwordDialog.open} onClose={() => setPasswordDialog({ open: false, user: null, password: '', confirmPassword: '', error: '' })} maxWidth="sm" fullWidth PaperProps={dialogPaper}>
                <DialogTitle sx={{ fontWeight: 700, color: c.textPrimary, borderBottom: `1px solid ${c.cardBorder}`, pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5', width: 40, height: 40, borderRadius: '10px' }}>
                            <EditIcon sx={{ color: '#1abc9c', fontSize: 22 }} />
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Edit Password</Typography>
                            <Typography variant="caption" sx={{ color: c.textMuted }}>{passwordDialog.user?.name}</Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2.5 }}>
                    {passwordDialog.error && <Alert severity="error" sx={{ borderRadius: '10px', mb: 2, mt: 1 }}>{passwordDialog.error}</Alert>}
                    <TextField fullWidth label="New Password" type="password" value={passwordDialog.password} onChange={(e) => setPasswordDialog({ ...passwordDialog, password: e.target.value, error: '' })} sx={{ mb: 2, mt: 1, ...inputSx }} helperText="Minimum 8 characters" />
                    <TextField fullWidth label="Confirm Password" type="password" value={passwordDialog.confirmPassword} onChange={(e) => setPasswordDialog({ ...passwordDialog, confirmPassword: e.target.value, error: '' })} sx={inputSx} />
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${c.cardBorder}` }}>
                    <Button onClick={() => setPasswordDialog({ open: false, user: null, password: '', confirmPassword: '', error: '' })} disabled={loading === passwordDialog.user?.id} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: c.textMuted }}>Cancel</Button>
                    <Button onClick={handlePasswordUpdate} variant="contained" disabled={loading === passwordDialog.user?.id} sx={tealBtn}>{loading === passwordDialog.user?.id ? 'Updating...' : 'Update'}</Button>
                </DialogActions>
            </Dialog>

            {/* Create User Dialog */}
            <Dialog open={createDialog.open} onClose={() => setCreateDialog({ open: false, name: '', email: '', password: '', confirmPassword: '', role: 'Author', error: '' })} maxWidth="sm" fullWidth PaperProps={dialogPaper}>
                <DialogTitle sx={{ fontWeight: 700, color: c.textPrimary, borderBottom: `1px solid ${c.cardBorder}`, pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5', width: 40, height: 40, borderRadius: '10px' }}>
                            <AddIcon sx={{ color: '#1abc9c', fontSize: 22 }} />
                        </Avatar>
                        <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Create User</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2.5 }}>
                    {createDialog.error && <Alert severity="error" sx={{ borderRadius: '10px', mb: 2, mt: 1 }}>{createDialog.error}</Alert>}
                    <TextField fullWidth label="Full Name" value={createDialog.name} onChange={(e) => setCreateDialog({ ...createDialog, name: e.target.value, error: '' })} sx={{ mb: 2, mt: 1, ...inputSx }} required />
                    <TextField fullWidth label="Email" type="email" value={createDialog.email} onChange={(e) => setCreateDialog({ ...createDialog, email: e.target.value, error: '' })} sx={{ mb: 2, ...inputSx }} required />
                    <TextField fullWidth label="Password" type={createDialog.showPassword ? 'text' : 'password'} value={createDialog.password} onChange={(e) => setCreateDialog({ ...createDialog, password: e.target.value, error: '' })} sx={{ mb: 2, ...inputSx }} helperText="Minimum 8 characters" required
                        InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setCreateDialog({ ...createDialog, showPassword: !createDialog.showPassword })} edge="end">{createDialog.showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
                    <TextField fullWidth label="Confirm Password" type={createDialog.showConfirmPassword ? 'text' : 'password'} value={createDialog.confirmPassword} onChange={(e) => setCreateDialog({ ...createDialog, confirmPassword: e.target.value, error: '' })} sx={{ mb: 2, ...inputSx }} required
                        InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setCreateDialog({ ...createDialog, showConfirmPassword: !createDialog.showConfirmPassword })} edge="end">{createDialog.showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
                    <FormControl fullWidth sx={inputSx}>
                        <InputLabel>Role</InputLabel>
                        <Select value={createDialog.role} label="Role" onChange={(e) => setCreateDialog({ ...createDialog, role: e.target.value, error: '' })} sx={{ borderRadius: '10px' }}>
                            <MenuItem value="Author">Author</MenuItem>
                            <MenuItem value="Reviewer">Reviewer</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${c.cardBorder}` }}>
                    <Button onClick={() => setCreateDialog({ open: false, name: '', email: '', password: '', confirmPassword: '', role: 'Author', error: '' })} disabled={loading === 'creating'} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: c.textMuted }}>Cancel</Button>
                    <Button onClick={handleCreateUser} variant="contained" disabled={loading === 'creating'} sx={tealBtn}>{loading === 'creating' ? 'Creating...' : 'Create User'}</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: '10px' }}>{snackbar.message}</Alert>
            </Snackbar>
        </SidebarLayout>
    );
}
