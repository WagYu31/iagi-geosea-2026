import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Box, Typography, Paper } from '@mui/material';

export default function TestAdmin() {
    const { auth } = usePage().props;

    return (
        <SidebarLayout>
            <Head title="Test Admin" />
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Test Admin Role
                </Typography>
                <Paper sx={{ p: 3, mt: 2 }}>
                    <Typography variant="h6">Auth Data:</Typography>
                    <pre style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
                        {JSON.stringify(auth, null, 2)}
                    </pre>
                    <Typography variant="h6" sx={{ mt: 2 }}>User Role:</Typography>
                    <Typography variant="body1" sx={{ fontSize: '24px', fontWeight: 'bold', color: auth.user?.role === 'admin' ? 'green' : 'red' }}>
                        {auth.user?.role || 'NO ROLE'}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>Is Admin:</Typography>
                    <Typography variant="body1" sx={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {auth.user?.role === 'admin' ? '✅ YES' : '❌ NO'}
                    </Typography>
                </Paper>
            </Box>
        </SidebarLayout>
    );
}
