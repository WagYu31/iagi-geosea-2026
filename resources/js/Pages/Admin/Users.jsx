import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
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
    Select,
    MenuItem,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';

export default function AdminUsers({ users = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
    const [roleDialog, setRoleDialog] = useState({ open: false, user: null, newRole: null });
    const [passwordDialog, setPasswordDialog] = useState({ open: false, user: null, password: '', confirmPassword: '', error: '' });
    const [createDialog, setCreateDialog] = useState({ open: false, name: '', email: '', password: '', confirmPassword: '', role: 'Author', error: '', showPassword: false, showConfirmPassword: false });
    const [loading, setLoading] = useState(null); // stores userId that's being updated
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleRoleChange = (user, newRole) => {
        const oldRole = user.role || 'Author';

        // Check if it's a critical role change that needs confirmation
        if (newRole === 'Admin' || (oldRole === 'Admin' && newRole !== 'Admin')) {
            setRoleDialog({ open: true, user, newRole });
        } else {
            // For non-critical changes, update immediately
            updateUserRole(user.id, newRole, user.name);
        }
    };

    const updateUserRole = (userId, newRole, userName) => {
        setLoading(userId);
        router.patch(route('admin.users.updateRole', userId), {
            role: newRole,
        }, {
            preserveScroll: true,
            preserveState: false, // This ensures fresh data is loaded
            onSuccess: () => {
                setLoading(null);
                setSnackbar({
                    open: true,
                    message: `Successfully updated ${userName}'s role to ${newRole}`,
                    severity: 'success'
                });
            },
            onError: () => {
                setLoading(null);
                setSnackbar({
                    open: true,
                    message: `Failed to update role. Please try again.`,
                    severity: 'error'
                });
            }
        });
    };

    const handleRoleConfirm = () => {
        if (roleDialog.user) {
            updateUserRole(roleDialog.user.id, roleDialog.newRole, roleDialog.user.name);
            setRoleDialog({ open: false, user: null, newRole: null });
        }
    };

    const handleDeleteClick = (user) => {
        setDeleteDialog({ open: true, user });
    };

    const handleDeleteConfirm = () => {
        if (deleteDialog.user) {
            router.delete(route('admin.users.delete', deleteDialog.user.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, user: null });
                },
            });
        }
    };

    const handleEditPasswordClick = (user) => {
        setPasswordDialog({ open: true, user, password: '', confirmPassword: '', error: '' });
    };

    const handlePasswordUpdate = () => {
        const { user, password, confirmPassword } = passwordDialog;

        // Validation
        if (!password || password.length < 8) {
            setPasswordDialog({ ...passwordDialog, error: 'Password must be at least 8 characters' });
            return;
        }

        if (password !== confirmPassword) {
            setPasswordDialog({ ...passwordDialog, error: 'Passwords do not match' });
            return;
        }

        setLoading(user.id);
        router.patch(route('admin.users.updatePassword', user.id), {
            password: password,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(null);
                setPasswordDialog({ open: false, user: null, password: '', confirmPassword: '', error: '' });
                setSnackbar({
                    open: true,
                    message: `Successfully updated password for ${user.name}`,
                    severity: 'success'
                });
            },
            onError: (errors) => {
                setLoading(null);
                setPasswordDialog({
                    ...passwordDialog,
                    error: errors.password || 'Failed to update password. Please try again.'
                });
            }
        });
    };

    const handleCreateUser = () => {
        const { name, email, password, confirmPassword, role } = createDialog;

        // Validation
        if (!name || !email || !password || !confirmPassword || !role) {
            setCreateDialog({ ...createDialog, error: 'All fields are required' });
            return;
        }

        if (password.length < 8) {
            setCreateDialog({ ...createDialog, error: 'Password must be at least 8 characters' });
            return;
        }

        if (password !== confirmPassword) {
            setCreateDialog({ ...createDialog, error: 'Passwords do not match' });
            return;
        }

        setLoading('creating');
        router.post(route('admin.users.create'), {
            name, email, password, role
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(null);
                setCreateDialog({ open: false, name: '', email: '', password: '', confirmPassword: '', role: 'Author', error: '' });
                setSnackbar({
                    open: true,
                    message: `Successfully created user ${name}`,
                    severity: 'success'
                });
            },
            onError: (errors) => {
                setLoading(null);
                setCreateDialog({
                    ...createDialog,
                    error: errors.email || errors.password || 'Failed to create user. Please try again.'
                });
            }
        });
    };

    const handleToggleVerification = (user) => {
        const newStatus = !user.email_verified_at;
        const statusText = newStatus ? 'verify' : 'unverify';

        setLoading(user.id);
        router.patch(route('admin.users.toggleVerification', user.id), {
            verify: newStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(null);
                setSnackbar({
                    open: true,
                    message: `Successfully ${statusText === 'verify' ? 'verified' : 'unverified'} ${user.name}'s account`,
                    severity: 'success'
                });
            },
            onError: () => {
                setLoading(null);
                setSnackbar({
                    open: true,
                    message: `Failed to ${statusText} account. Please try again.`,
                    severity: 'error'
                });
            }
        });
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const roleColors = {
        Admin: 'error',
        Reviewer: 'warning',
        Author: 'default',
    };

    return (
        <SidebarLayout>
            <Head title="User Management" />

            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1abc9c', mb: 3 }}>
                    User Management
                </Typography>

                {/* Search Bar */}
                <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                    />
                </Paper>

                {/* Users Table */}
                <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            All Users ({filteredUsers.length})
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setCreateDialog({ open: true, name: '', email: '', password: '', confirmPassword: '', role: 'Author', error: '' })}
                            sx={{
                                backgroundColor: '#1abc9c',
                                '&:hover': { backgroundColor: '#16a085' },
                                textTransform: 'none'
                            }}
                        >
                            Add User
                        </Button>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Account Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Registered</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Select
                                                    value={user.role || 'Author'}
                                                    onChange={(e) => handleRoleChange(user, e.target.value)}
                                                    size="small"
                                                    disabled={loading === user.id}
                                                    displayEmpty
                                                    renderValue={(selected) => {
                                                        if (!selected) return 'Select Role';
                                                        // Capitalize first letter
                                                        return selected.charAt(0).toUpperCase() + selected.slice(1);
                                                    }}
                                                    sx={{
                                                        minWidth: 120,
                                                        '& .MuiSelect-select': {
                                                            py: 1
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="Author">Author</MenuItem>
                                                    <MenuItem value="Reviewer">Reviewer</MenuItem>
                                                    <MenuItem value="Admin">Admin</MenuItem>
                                                </Select>
                                                {loading === user.id && (
                                                    <CircularProgress size={20} />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.email_verified_at ? '✓ Verified' : '⚠ Unverified'}
                                                size="small"
                                                onClick={() => handleToggleVerification(user)}
                                                sx={{
                                                    bgcolor: user.email_verified_at ? '#d4edda' : '#fff3cd',
                                                    color: user.email_verified_at ? '#155724' : '#856404',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        bgcolor: user.email_verified_at ? '#c3e6cb' : '#ffe69c',
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.created_at).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <IconButton
                                                    onClick={() => handleEditPasswordClick(user)}
                                                    color="primary"
                                                    size="small"
                                                    title="Edit Password"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDeleteClick(user)}
                                                    color="error"
                                                    size="small"
                                                    title="Delete User"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>

            {/* Role Change Confirmation Dialog */}
            <Dialog
                open={roleDialog.open}
                onClose={() => setRoleDialog({ open: false, user: null, newRole: null })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ color: '#d32f2f', fontWeight: 600 }}>
                    ⚠️ Confirm Critical Role Change
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        You are about to change a critical role:
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 1, mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>User:</strong> {roleDialog.user?.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Current Role:</strong> {roleDialog.user?.role || 'Author'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>New Role:</strong> {roleDialog.newRole}
                        </Typography>
                    </Box>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        {roleDialog.newRole === 'Admin' ? (
                            <>
                                <strong>Warning:</strong> Promoting to Administrator will grant this user full system access, including:
                                <ul style={{ marginTop: 8, marginBottom: 0 }}>
                                    <li>Ability to manage all users</li>
                                    <li>Access to all submissions</li>
                                    <li>Permission to assign reviewers</li>
                                    <li>Control over payments and system settings</li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <strong>Warning:</strong> Demoting from Administrator will revoke all administrative privileges.
                            </>
                        )}
                    </Alert>
                    <Typography variant="body2" color="text.secondary">
                        This action will take effect immediately. Are you sure you want to proceed?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setRoleDialog({ open: false, user: null, newRole: null })}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRoleConfirm}
                        variant="contained"
                        sx={{
                            backgroundColor: '#d32f2f',
                            '&:hover': { backgroundColor: '#b71c1c' },
                            textTransform: 'none'
                        }}
                    >
                        Confirm Role Change
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete user <strong>{deleteDialog.user?.name}</strong>?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, user: null })}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Password Dialog */}
            <Dialog
                open={passwordDialog.open}
                onClose={() => setPasswordDialog({ open: false, user: null, password: '', confirmPassword: '', error: '' })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600, color: '#1abc9c' }}>
                    Edit User Password
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Changing password for: <strong>{passwordDialog.user?.name}</strong>
                    </Typography>

                    {passwordDialog.error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {passwordDialog.error}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={passwordDialog.password}
                        onChange={(e) => setPasswordDialog({ ...passwordDialog, password: e.target.value, error: '' })}
                        sx={{ mb: 2 }}
                        helperText="Minimum 8 characters"
                    />

                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        value={passwordDialog.confirmPassword}
                        onChange={(e) => setPasswordDialog({ ...passwordDialog, confirmPassword: e.target.value, error: '' })}
                        helperText="Re-enter the new password"
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setPasswordDialog({ open: false, user: null, password: '', confirmPassword: '', error: '' })}
                        sx={{ textTransform: 'none' }}
                        disabled={loading === passwordDialog.user?.id}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePasswordUpdate}
                        variant="contained"
                        disabled={loading === passwordDialog.user?.id}
                        sx={{
                            backgroundColor: '#1abc9c',
                            '&:hover': { backgroundColor: '#16a085' },
                            textTransform: 'none'
                        }}
                    >
                        {loading === passwordDialog.user?.id ? 'Updating...' : 'Update Password'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create User Dialog */}
            <Dialog
                open={createDialog.open}
                onClose={() => setCreateDialog({ open: false, name: '', email: '', password: '', confirmPassword: '', role: 'Author', error: '' })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600, color: '#1abc9c' }}>
                    Create New User
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {createDialog.error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {createDialog.error}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Full Name"
                        value={createDialog.name}
                        onChange={(e) => setCreateDialog({ ...createDialog, name: e.target.value, error: '' })}
                        sx={{ mb: 2 }}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={createDialog.email}
                        onChange={(e) => setCreateDialog({ ...createDialog, email: e.target.value, error: '' })}
                        sx={{ mb: 2 }}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type={createDialog.showPassword ? 'text' : 'password'}
                        value={createDialog.password}
                        onChange={(e) => setCreateDialog({ ...createDialog, password: e.target.value, error: '' })}
                        sx={{ mb: 2 }}
                        helperText="Minimum 8 characters"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setCreateDialog({ ...createDialog, showPassword: !createDialog.showPassword })}
                                        edge="end"
                                    >
                                        {createDialog.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type={createDialog.showConfirmPassword ? 'text' : 'password'}
                        value={createDialog.confirmPassword}
                        onChange={(e) => setCreateDialog({ ...createDialog, confirmPassword: e.target.value, error: '' })}
                        sx={{ mb: 2 }}
                        helperText="Re-enter the password"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setCreateDialog({ ...createDialog, showConfirmPassword: !createDialog.showConfirmPassword })}
                                        edge="end"
                                    >
                                        {createDialog.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Select
                        fullWidth
                        value={createDialog.role}
                        onChange={(e) => setCreateDialog({ ...createDialog, role: e.target.value, error: '' })}
                        displayEmpty
                    >
                        <MenuItem value="Author">Author</MenuItem>
                        <MenuItem value="Reviewer">Reviewer</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setCreateDialog({ open: false, name: '', email: '', password: '', confirmPassword: '', role: 'Author', error: '' })}
                        sx={{ textTransform: 'none' }}
                        disabled={loading === 'creating'}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateUser}
                        variant="contained"
                        disabled={loading === 'creating'}
                        sx={{
                            backgroundColor: '#1abc9c',
                            '&:hover': { backgroundColor: '#16a085' },
                            textTransform: 'none'
                        }}
                    >
                        {loading === 'creating' ? 'Creating...' : 'Create User'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success/Error Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SidebarLayout>
    );
}
