# Sponsors Management - Complete Implementation Guide

## ✅ Step 1: Sponsors State & Form (DONE)
Already added to Settings.jsx:
- `sponsors` state
- `sponsorDialog` state  
- `editingSponsor` state
- `sponsorForm` state
- `logoPreview` state

## 🔧 Step 2: Add Sponsor Handlers

Add these functions AFTER `handlePhotoChange` function in Settings.jsx:

```javascript
// ============ SPONSOR HANDLERS ============

const handleOpenSponsorDialog = (sponsor = null, index = null) => {
    if (sponsor) {
        setEditingSponsor(index);
        setSponsorForm({
            name: sponsor.name || '',
            level: sponsor.level || 'Silver',
            logo: null
        });
    } else {
        setEditingSponsor(null);
        setSponsorForm({
            name: '',
            level: 'Silver',
            logo: null
        });
    }
    setSponsorDialog(true);
};

const handleCloseSponsorDialog = () => {
    setSponsorDialog(false);
    setEditingSponsor(null);
    setSponsorForm({
        name: '',
        level: 'Silver',
        logo: null
    });
    setLogoPreview(null);
};

const handleSaveSponsor = () => {
    let updatedSponsors = [...sponsors];
    const currentIndex = editingSponsor !== null ? editingSponsor : sponsors.length;

    // Update sponsor data
    if (editingSponsor !== null) {
        updatedSponsors[editingSponsor] = {
            ...updatedSponsors[editingSponsor],
            name: sponsorForm.name,
            level: sponsorForm.level,
        };
    } else {
        updatedSponsors.push({
            name: sponsorForm.name,
            level: sponsorForm.level,
            logo: null
        });
    }

    // Save sponsor data first
    setSponsors(updatedSponsors);
    const sponsorsSetting = settings.sponsors?.[0];
    if (sponsorsSetting) {
        router.patch(route('admin.settings.update', sponsorsSetting.id), {
            value: JSON.stringify(updatedSponsors)
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // If logo was selected, upload it
                if (sponsorForm.logo) {
                    setUploading(true);
                    const formData = new FormData();
                    formData.append('logo', sponsorForm.logo, sponsorForm.logo.name);
                    formData.append('index', currentIndex);

                    fetch(route('admin.settings.uploadSponsorLogo'), {
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        },
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            setSuccess(true);
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        } else if (data.error) {
                            alert('Upload failed: ' + data.error);
                        }
                        setUploading(false);
                    })
                    .catch(error => {
                        console.error('Upload error:', error);
                        setUploading(false);
                        alert('Failed to upload logo: ' + error.message);
                    });
                } else {
                    // No logo, just reload
                    window.location.reload();
                }
            }
        });
    }
    handleCloseSponsorDialog();
};

const handleDeleteSponsor = (index) => {
    if (confirm('Are you sure you want to delete this sponsor?')) {
        const updatedSponsors = sponsors.filter((_, i) => i !== index);
        setSponsors(updatedSponsors);
        const sponsorsSetting = settings.sponsors?.[0];
        if (sponsorsSetting) {
            handleSave('sponsors', JSON.stringify(updatedSponsors));
        }
    }
};

const handleLogoChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 2048000) {
            alert('File size must be less than 2MB');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('logo', file, file.name);
        formData.append('index', index);

        fetch(route('admin.settings.uploadSponsorLogo'), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const updatedSponsors = [...sponsors];
                updatedSponsors[index].logo = data.logo_url;
                setSponsors(updatedSponsors);
                setSuccess(true);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else if (data.error) {
                alert('Upload failed: ' + data.error);
            }
            setUploading(false);
        })
        .catch(error => {
            console.error('Upload error:', error);
            setUploading(false);
            alert('Failed to upload logo: ' + error.message);
        });
    }
};
```

## 📝 Step 3: Add Sponsors Management UI

Add this section AFTER "Keynote Speakers Management" Grid item and BEFORE "Info Card":

```jsx
{/* Sponsors Management */}
<Grid item xs={12}>
    <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Sponsors
            </Typography>
            <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenSponsorDialog()}
            >
                Add Sponsor
            </Button>
        </Box>

        <Grid container spacing={2}>
            {sponsors.map((sponsor, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card sx={{ height: '100%', position: 'relative' }}>
                        {sponsor.logo ? (
                            <CardMedia
                                component="img"
                                height="150"
                                image={sponsor.logo}
                                alt={sponsor.name}
                                sx={{ objectFit: 'contain', p: 2, bgcolor: 'grey.100' }}
                            />
                        ) : (
                            <CardMedia
                                component="div"
                                sx={{
                                    height: 150,
                                    bgcolor: 'grey.200',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <PhotoCamera sx={{ fontSize: 50, color: 'grey.400' }} />
                            </CardMedia>
                        )}
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id={`logo-upload-${index}`}
                            type="file"
                            onChange={(e) => handleLogoChange(e, index)}
                        />
                        <label htmlFor={`logo-upload-${index}`}>
                            <IconButton
                                component="span"
                                disabled={uploading}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    bgcolor: 'white',
                                    zIndex: 10,
                                    boxShadow: 2,
                                    '&:hover': {
                                        bgcolor: 'grey.200',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <PhotoCamera />
                            </IconButton>
                        </label>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {sponsor.name}
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    px: 1, 
                                    py: 0.5, 
                                    bgcolor: sponsor.level === 'Platinum' ? 'grey.300' : 
                                            sponsor.level === 'Gold' ? 'warning.light' : 'info.light',
                                    borderRadius: 1,
                                    fontWeight: 600
                                }}
                            >
                                {sponsor.level}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenSponsorDialog(sponsor, index)}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteSponsor(index)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </CardActions>
                    </Card>
                </Grid>
            ))}

            {sponsors.length === 0 && (
                <Grid item xs={12}>
                    <Alert severity="info">
                        No sponsors added yet. Click "Add Sponsor" to add your first sponsor.
                    </Alert>
                </Grid>
            )}
        </Grid>
    </Paper>
</Grid>
```

## 🎯 Step 4: Add Sponsor Dialog

Add this AFTER Speaker Dialog and BEFORE the closing </SidebarLayout>:

```jsx
{/* Sponsor Dialog */}
<Dialog open={sponsorDialog} onClose={handleCloseSponsorDialog} maxWidth="sm" fullWidth>
    <DialogTitle>
        {editingSponsor !== null ? 'Edit Sponsor' : 'Add New Sponsor'}
    </DialogTitle>
    <DialogContent>
        <Box sx={{ pt: 2 }}>
            <TextField
                fullWidth
                label="Sponsor Name"
                value={sponsorForm.name}
                onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                sx={{ mb: 2 }}
                required
            />
            <TextField
                fullWidth
                select
                label="Sponsorship Level"
                value={sponsorForm.level}
                onChange={(e) => setSponsorForm({ ...sponsorForm, level: e.target.value })}
                sx={{ mb: 2 }}
                SelectProps={{
                    native: true,
                }}
            >
                <option value="Platinum">Platinum Partner</option>
                <option value="Gold">Gold Partner</option>
                <option value="Silver">Silver Partner</option>
            </TextField>
            <Box sx={{ mt: 2 }}>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="sponsor-logo-upload-dialog"
                    type="file"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setSponsorForm({ ...sponsorForm, logo: file });
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setLogoPreview(reader.result);
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                />
                <label htmlFor="sponsor-logo-upload-dialog">
                    <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PhotoCamera />}
                        fullWidth
                    >
                        {sponsorForm.logo || logoPreview ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                </label>
                {logoPreview && (
                    <Box sx={{ mt: 2, textAlign: 'center', p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <img src={logoPreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain' }} />
                    </Box>
                )}
            </Box>
        </Box>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseSponsorDialog}>
            Cancel
        </Button>
        <Button
            onClick={handleSaveSponsor}
            variant="contained"
            color="secondary"
            disabled={!sponsorForm.name || !sponsorForm.level}
        >
            {editingSponsor !== null ? 'Update' : 'Add'}
        </Button>
    </DialogActions>
</Dialog>
```

## 🚀 Next Steps:
1. Add all sponsor handlers to Settings.jsx
2. Add Sponsors Management UI section
3. Add Sponsor Dialog
4. Update controller for logo upload
5. Update Landing Page
6. Test!
