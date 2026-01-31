import React from 'react';
import {
    Grid,
    Paper,
    TextField,
    Typography,
    Box,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function DynamicTimelineCards({
    timeline,
    setTimeline,
    handleTimelineDelete
}) {
    return (
        <Grid container spacing={3}>
            {/* Dynamic Timeline Cards */}
            {timeline.map((item, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 3,
                            background: item.status === 'active'
                                ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
                                : item.status === 'completed'
                                    ? 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
                                    : 'linear-gradient(135deg, #fff9e6 0%, #ffecb3 100%)',
                            borderRadius: 2,
                            textAlign: 'center',
                            minHeight: 320,
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            border: item.status === 'active' ? '2px solid #4caf50' : 'none',
                        }}
                    >
                        {/* Delete Button */}
                        <IconButton
                            onClick={() => handleTimelineDelete(index)}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                color: 'error.main',
                                '&:hover': { backgroundColor: 'error.lighter' }
                            }}
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>

                        {/* Status Badge */}
                        {item.status === 'active' && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: -10,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: '#006838',
                                    color: 'white',
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                ACTIVE NOW
                            </Box>
                        )}

                        <EventIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2, mx: 'auto', mt: item.status === 'active' ? 2 : 0 }} />

                        <TextField
                            label="Event Title"
                            value={item?.title || ''}
                            onChange={(e) => {
                                const newTimeline = [...timeline];
                                newTimeline[index] = { ...newTimeline[index], title: e.target.value };
                                setTimeline(newTimeline);
                            }}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            label="Date"
                            placeholder="e.g., January 18, 2026"
                            value={item?.date || ''}
                            onChange={(e) => {
                                const newTimeline = [...timeline];
                                newTimeline[index] = { ...newTimeline[index], date: e.target.value };
                                setTimeline(newTimeline);
                            }}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={item?.status || 'upcoming'}
                                label="Status"
                                onChange={(e) => {
                                    const newTimeline = [...timeline];
                                    newTimeline[index] = { ...newTimeline[index], status: e.target.value };
                                    setTimeline(newTimeline);
                                }}
                            >
                                <MenuItem value="upcoming">Upcoming</MenuItem>
                                <MenuItem value="active">Active Now</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                            </Select>
                        </FormControl>

                        <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto' }}>
                            {item.status === 'active' && '🟢 Currently happening'}
                            {item.status === 'upcoming' && '⏳ Coming soon'}
                            {item.status === 'completed' && '✅ Completed'}
                        </Typography>
                    </Paper>
                </Grid>
            ))}

            {/* Add New Timeline Button */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                        borderRadius: 2,
                        textAlign: 'center',
                        minHeight: 320,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                            transform: 'scale(1.02)',
                        }
                    }}
                    onClick={() => setTimeline([...timeline, { title: '', date: '', status: 'upcoming' }])}
                >
                    <AddIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Add Timeline Event
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Click to add a new milestone
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}
