import React from 'react';
import {
    Grid,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    IconButton,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function DynamicResourceCards({
    resources,
    setResources,
    uploading,
    handleResourceFileUpload,
    handleResourceDelete
}) {
    return (
        <Grid container spacing={3}>
            {/* Dynamic Resource Cards */}
            {resources.map((resource, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                            borderRadius: 2,
                            textAlign: 'center',
                            minHeight: 300,
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                        }}
                    >
                        {/* Delete Button */}
                        <IconButton
                            onClick={() => handleResourceDelete(index)}
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

                        <DescriptionIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2, mx: 'auto' }} />

                        <TextField
                            label="Resource Title"
                            value={resource?.title || ''}
                            onChange={(e) => {
                                const newResources = [...resources];
                                newResources[index] = { ...newResources[index], title: e.target.value };
                                setResources(newResources);
                            }}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            label="Description"
                            value={resource?.description || ''}
                            onChange={(e) => {
                                const newResources = [...resources];
                                newResources[index] = { ...newResources[index], description: e.target.value };
                                setResources(newResources);
                            }}
                            fullWidth
                            multiline
                            rows={2}
                            variant="outlined"
                            sx={{ mb: 2, flex: 1 }}
                        />

                        <Box sx={{ mt: 'auto' }}>
                            <input
                                type="file"
                                id={`resource-upload-${index}`}
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const title = resource?.title || `Resource ${index + 1}`;
                                        const description = resource?.description || '';
                                        handleResourceFileUpload(title, description, file, index);
                                    }
                                }}
                            />
                            <label htmlFor={`resource-upload-${index}`}>
                                <Button
                                    variant="contained"
                                    component="span"
                                    fullWidth
                                    disabled={uploading}
                                    sx={{
                                        backgroundColor: '#006838',
                                        '&:hover': { backgroundColor: '#004d28' },
                                        mb: 1
                                    }}
                                >
                                    {resource?.file_url ? 'Replace File' : 'Upload File'}
                                </Button>
                            </label>
                            {resource?.file_url && (
                                <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 1 }}>
                                    ✓ File uploaded: {resource.file_type?.toUpperCase()}
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            ))}

            {/* Add New Resource Button */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                        borderRadius: 2,
                        textAlign: 'center',
                        minHeight: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                            transform: 'scale(1.02)',
                        }
                    }}
                    onClick={() => setResources([...resources, { title: '', description: '' }])}
                >
                    <AddIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Add New Resource
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Click to add a new resource card
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}
