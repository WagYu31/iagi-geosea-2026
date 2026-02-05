import React, { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import axios from 'axios';
import SidebarLayout from '@/Layouts/SidebarLayout';
import DynamicResourceCards from '@/Components/DynamicResourceCards';
import DynamicTimelineCards from '@/Components/DynamicTimelineCards';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    FormControlLabel,
    Switch,
    Alert,
    Card,
    CardContent,
    Stack,
    Tabs,
    Tab,
    Grid,
    IconButton,
    Divider,
    MenuItem,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

// Resource Upload Form Component
function ResourceUploadForm({ onUpload, uploading }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!title || !selectedFile) {
            alert('Please provide both title and file');
            return;
        }

        await onUpload(title, description, selectedFile);

        // Reset form
        setTitle('');
        setDescription('');
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Stack spacing={2}>
            <TextField
                label="Resource Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                size="small"
            />
            <TextField
                label="Description (Optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={2}
                size="small"
            />
            <Box>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="resource-file-input"
                />
                <label htmlFor="resource-file-input">
                    <Button variant="outlined" component="span" fullWidth>
                        {selectedFile ? selectedFile.name : 'Choose File'}
                    </Button>
                </label>
            </Box>
            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={uploading || !title || !selectedFile}
                sx={{
                    backgroundColor: '#1abc9c',
                    '&:hover': { backgroundColor: '#16a085' },
                }}
            >
                {uploading ? 'Uploading...' : 'Upload Resource'}
            </Button>
        </Stack>
    );
}

export default function Settings({ settings, submissionSettings }) {
    const [tabValue, setTabValue] = useState(0); // Start with Landing Page Settings
    const [uploading, setUploading] = useState(false);

    // Parse settings from grouped format
    const getSettingValue = (key, defaultValue = '') => {
        if (!settings) return defaultValue;

        for (const section in settings) {
            const setting = settings[section].find(s => s.key === key);
            if (setting) {
                if (setting.type === 'json') {
                    try {
                        return JSON.parse(setting.value);
                    } catch (e) {
                        return defaultValue;
                    }
                }
                return setting.value;
            }
        }
        return defaultValue;
    };

    // Get setting ID by key
    const getSettingId = (key) => {
        if (!settings) return null;

        for (const section in settings) {
            const setting = settings[section].find(s => s.key === key);
            if (setting) return setting.id;
        }
        return null;
    };

    // Landing Page Settings State
    const [countdownDate, setCountdownDate] = useState(getSettingValue('countdown_target_date', ''));
    const [contactInfo, setContactInfo] = useState(() => {
        const info = getSettingValue('contact_info', '{}');
        try {
            return typeof info === 'string' ? JSON.parse(info) : info;
        } catch (e) {
            return { phone: '', email: '', location: '', maps_url: '' };
        }
    });
    const [timeline, setTimeline] = useState(getSettingValue('timeline', []));
    const speakersFromDB = getSettingValue('keynote_speakers', []);
    const [speakers, setSpeakers] = useState(
        speakersFromDB && speakersFromDB.length > 0
            ? speakersFromDB
            : [{ name: '', title: '', photo: '', institution: '' }]
    );
    const [speakersDescription, setSpeakersDescription] = useState(
        getSettingValue('keynote_speakers_description', 'Distinguished experts bridging the gap between geological science and practical sustainability.')
    );
    const [sponsors, setSponsors] = useState(getSettingValue('sponsors', []));
    const [sponsorsDescription, setSponsorsDescription] = useState(
        getSettingValue('sponsors_description', 'Empowering the future of geological science through strategic partnerships.')
    );
    const [resources, setResources] = useState(getSettingValue('resources', []));
    const [savingCountdown, setSavingCountdown] = useState(false);
    const [savingContactInfo, setSavingContactInfo] = useState(false);
    const [savingSpeakers, setSavingSpeakers] = useState(false);
    const [savingSponsors, setSavingSponsors] = useState(false);
    const [socialMedia, setSocialMedia] = useState(() => {
        const data = getSettingValue('social_media', null);
        if (data && typeof data === 'object') return data;
        return {
            instagram: 'https://www.instagram.com/iagi_official/',
            facebook: 'https://www.facebook.com/iagi.official',
            twitter: 'https://twitter.com/iagi_official',
            youtube: 'https://www.youtube.com/@iagi_official',
        };
    });
    const [savingSocialMedia, setSavingSocialMedia] = useState(false);
    const [heroBackground, setHeroBackground] = useState(() => {
        const data = getSettingValue('hero_background', null);
        if (data && typeof data === 'object') return data;
        return { url: '/hero-background1.mp4', type: 'video', filename: 'hero-background1.mp4' };
    });
    const [uploadingHero, setUploadingHero] = useState(false);
    const heroInputRef = useRef(null);
    const [heroText, setHeroText] = useState(() => {
        const data = getSettingValue('hero_text', null);
        if (data && typeof data === 'object') return data;
        return {
            title_line1: 'PIT IAGI',
            title_line2: 'GEOSEA XIX 2026',
            theme_label: 'CONFERENCE THEME',
            theme_text: 'Advancing Geological Sciences for Sustainable Development',
        };
    });
    const [savingHeroText, setSavingHeroText] = useState(false);
    const [heroLogo, setHeroLogo] = useState(() => {
        const data = getSettingValue('hero_logo', null);
        if (data && typeof data === 'object') return data;
        return { url: '/WhatsApp_Image_2025-12-29_at_19.37.46-removebg-preview.png', filename: 'default_logo.png' };
    });
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const logoInputRef = useRef(null);
    const [heroLogosSecondary, setHeroLogosSecondary] = useState(() => {
        const data = getSettingValue('hero_logos_secondary', null);
        if (data && Array.isArray(data)) return data;
        return [];
    });
    const [uploadingLogoSecondary, setUploadingLogoSecondary] = useState(false);
    const logoSecondaryInputRef = useRef(null);
    const [deletingLogoIndex, setDeletingLogoIndex] = useState(null);

    // Form for submission deadline settings
    const { data: deadlineData, setData: setDeadlineData, post: postDeadline, processing: processingDeadline, errors: deadlineErrors } = useForm({
        submission_deadline_start: submissionSettings?.submission_deadline_start || '',
        submission_deadline_end: submissionSettings?.submission_deadline_end || '',
        submission_enabled: submissionSettings?.submission_enabled === '1',
    });

    const handleDeadlineSubmit = (e) => {
        e.preventDefault();
        postDeadline(route('admin.submission.settings.update'));
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Save Countdown Timer
    const saveCountdown = async () => {
        const settingId = getSettingId('countdown_target_date');
        if (!settingId) {
            alert('Countdown setting not found');
            return;
        }

        setSavingCountdown(true);
        try {
            await router.patch(route('admin.settings.update', settingId), {
                value: countdownDate,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    alert('Countdown timer updated successfully!');
                },
                onError: (errors) => {
                    console.error('Save failed:', errors);
                    alert('Failed to save countdown timer');
                },
            });
        } finally {
            setSavingCountdown(false);
        }
    };

    // Save Contact Information
    const saveContactInfo = () => {
        const settingId = getSettingId('contact_info');
        console.log('Saving contact info, settingId:', settingId);
        console.log('Contact info data:', contactInfo);

        if (!settingId) {
            alert('Contact info setting not found');
            console.error('Setting ID not found for contact_info');
            return;
        }

        setSavingContactInfo(true);

        router.patch(route('admin.settings.update', settingId), {
            value: JSON.stringify(contactInfo),
        }, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Contact info saved successfully');
                alert('Contact information updated successfully!');
                setSavingContactInfo(false);
            },
            onError: (errors) => {
                console.error('Save failed:', errors);
                alert('Failed to save contact information. Check console for details.');
                setSavingContactInfo(false);
            },
            onFinish: () => {
                setSavingContactInfo(false);
            },
        });
    };

    // Save Social Media Links
    const saveSocialMedia = () => {
        const settingId = getSettingId('social_media');

        setSavingSocialMedia(true);

        // If setting doesn't exist, create it via POST
        if (!settingId) {
            router.post(route('admin.settings.store'), {
                key: 'social_media',
                value: JSON.stringify(socialMedia),
                group: 'landing_page',
                type: 'json',
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    alert('Social media links saved successfully!');
                    setSavingSocialMedia(false);
                    router.reload({ preserveScroll: true });
                },
                onError: (errors) => {
                    console.error('Save failed:', errors);
                    alert('Failed to save social media links');
                    setSavingSocialMedia(false);
                },
            });
            return;
        }

        router.patch(route('admin.settings.update', settingId), {
            value: JSON.stringify(socialMedia),
        }, {
            preserveScroll: true,
            onSuccess: () => {
                alert('Social media links updated successfully!');
                setSavingSocialMedia(false);
            },
            onError: (errors) => {
                console.error('Save failed:', errors);
                alert('Failed to save social media links');
                setSavingSocialMedia(false);
            },
            onFinish: () => {
                setSavingSocialMedia(false);
            },
        });
    };

    // Save Keynote Speakers
    const saveSpeakers = async () => {
        const settingId = getSettingId('keynote_speakers');
        if (!settingId) {
            alert('Keynote speakers setting not found');
            return;
        }

        setSavingSpeakers(true);
        try {
            // Save speakers
            await router.patch(route('admin.settings.update', settingId), {
                value: JSON.stringify(speakers),
            }, {
                preserveScroll: true,
            });

            // Save speakers description
            const descSettingId = getSettingId('keynote_speakers_description');
            if (descSettingId) {
                await router.patch(route('admin.settings.update', descSettingId), {
                    value: speakersDescription,
                }, {
                    preserveScroll: true,
                });
            } else {
                // Create new setting if not exists
                await router.post(route('admin.settings.store'), {
                    key: 'keynote_speakers_description',
                    value: speakersDescription,
                }, {
                    preserveScroll: true,
                });
            }

            alert('Keynote speakers updated successfully!');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save keynote speakers');
        } finally {
            setSavingSpeakers(false);
        }
    };

    // Add new speaker
    const addSpeaker = () => {
        setSpeakers([...speakers, { name: '', title: '', photo: '', institution: '' }]);
    };

    // Remove speaker
    const removeSpeaker = (index) => {
        if (confirm('Are you sure you want to remove this speaker?')) {
            const updatedSpeakers = speakers.filter((_, i) => i !== index);
            setSpeakers(updatedSpeakers);
        }
    };

    // Save Sponsors
    const saveSponsors = async () => {
        const settingId = getSettingId('sponsors');
        if (!settingId) {
            alert('Sponsors setting not found');
            return;
        }

        setSavingSponsors(true);
        try {
            // Save sponsors
            await router.patch(route('admin.settings.update', settingId), {
                value: JSON.stringify(sponsors),
            }, {
                preserveScroll: true,
            });

            // Save sponsors description
            const descSettingId = getSettingId('sponsors_description');
            if (descSettingId) {
                await router.patch(route('admin.settings.update', descSettingId), {
                    value: sponsorsDescription,
                }, {
                    preserveScroll: true,
                });
            } else {
                // Create new setting if not exists
                await router.post(route('admin.settings.store'), {
                    key: 'sponsors_description',
                    value: sponsorsDescription,
                }, {
                    preserveScroll: true,
                });
            }

            alert('Sponsors saved successfully!');
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save sponsors');
        } finally {
            setSavingSponsors(false);
        }
    };

    // Handle speaker photo upload
    const handleSpeakerPhotoUpload = async (index, file) => {
        if (!file) return;

        // Check if this is a new speaker (not yet in DB)
        const speakersInDB = getSettingValue('keynote_speakers', []);
        if (index >= speakersInDB.length) {
            alert('Please save the speakers first before uploading photos for new speakers.');
            return;
        }

        const formData = new FormData();
        formData.append('photo', file);
        formData.append('index', index);

        setUploading(true);

        try {
            const response = await axios.post(route('admin.settings.uploadSpeakerPhoto'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success) {
                alert('Speaker photo uploaded successfully!');
                const newSpeakers = [...speakers];
                newSpeakers[index].photo = response.data.photo_url;
                setSpeakers(newSpeakers);
            } else {
                alert('Upload failed: ' + (response.data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload photo: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploading(false);
        }
    };

    // Handle sponsor logo upload
    const handleSponsorLogoUpload = async (index, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('logo', file);
        formData.append('index', index);

        setUploading(true);
        try {
            const response = await fetch(route('admin.settings.uploadSponsorLogo'), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });

            const data = await response.json();

            if (data.success) {
                const newSponsors = [...sponsors];
                newSponsors[index].logo = data.logo_url;
                setSponsors(newSponsors);
            }
        } catch (error) {
            console.error('Logo upload failed:', error);
            alert('Failed to upload logo');
        } finally {
            setUploading(false);
        }
    };

    // Handle resource file upload
    const handleResourceFileUpload = async (title, description, file, resourceIndex = null) => {
        if (!file || !title) {
            alert('Please provide a title and select a file');
            return false;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description || '');
        if (resourceIndex !== null) {
            formData.append('resource_index', resourceIndex);
        }

        setUploading(true);
        try {
            const response = await axios.post(route('admin.settings.uploadResourceFile'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                // Update resources state
                let newResources = [...resources];
                if (resourceIndex !== null) {
                    // Update specific slot
                    newResources[resourceIndex] = response.data.resource;
                } else {
                    // Append new resource
                    newResources.push(response.data.resource);
                }
                setResources(newResources);

                // Reload page to refresh all Inertia props (including Landing Page)
                router.reload({ preserveScroll: true });

                alert('Resource uploaded successfully! Landing Page will be updated.');
                return true;
            }
        } catch (error) {
            console.error('Resource upload error:', error);
            alert('Failed to upload resource');
        } finally {
            setUploading(false);
        }
        return false;
    };

    // Handle resource delete
    const handleResourceDelete = (index) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            const newResources = resources.filter((_, i) => i !== index);
            setResources(newResources);

            // Save to database
            const settingId = getSettingId('resources');
            if (settingId) {
                router.patch(route('admin.settings.update', settingId), {
                    value: JSON.stringify(newResources),
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        alert('Resource deleted successfully!');
                    },
                });
            }
        }
    };

    // Handle save resources (metadata only, no file upload required)
    const handleSaveResources = async () => {
        try {
            const response = await axios.post(route('admin.settings.saveResources'), {
                resources: resources
            });

            if (response.data.success) {
                setResources(response.data.resources);
                router.reload({ preserveScroll: true });
                alert('Resources saved successfully!');
            }
        } catch (error) {
            console.error('Save resources error:', error);
            alert('Failed to save resources');
        }
    };

    // Handle timeline delete
    const handleTimelineDelete = (index) => {
        if (confirm('Are you sure you want to delete this timeline event?')) {
            const newTimeline = timeline.filter((_, i) => i !== index);
            setTimeline(newTimeline);
        }
    };

    // Handle save timeline
    const handleSaveTimeline = async () => {
        try {
            const response = await axios.post(route('admin.settings.saveTimeline'), {
                timeline: timeline
            });

            if (response.data.success) {
                setTimeline(response.data.timeline);
                router.reload({ preserveScroll: true });
                alert('Timeline saved successfully!');
            }
        } catch (error) {
            console.error('Save timeline error:', error);
            alert('Failed to save timeline: ' + (error.response?.data?.error || error.message));
        }
    };

    // Save hero text settings
    const saveHeroText = async () => {
        setSavingHeroText(true);
        try {
            await axios.post(route('admin.settings.saveHeroText'), {
                hero_text: heroText,
            });
            router.reload({ preserveScroll: true });
            alert('Hero text saved successfully!');
        } catch (error) {
            console.error('Save hero text error:', error);
            alert('Failed to save hero text: ' + (error.response?.data?.error || error.message));
        } finally {
            setSavingHeroText(false);
        }
    };

    // Handle hero logo upload
    const handleHeroLogoUpload = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('hero_logo', file);

        setUploadingLogo(true);
        try {
            const response = await axios.post(route('admin.settings.uploadHeroLogo'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setHeroLogo(response.data.hero_logo);
                router.reload({ preserveScroll: true });
                alert('Hero logo uploaded successfully!');
            }
        } catch (error) {
            console.error('Hero logo upload error:', error);
            alert('Failed to upload hero logo: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploadingLogo(false);
        }
    };

    // Handle secondary hero logo upload (add to array)
    const handleHeroLogoSecondaryUpload = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('hero_logo_secondary', file);

        setUploadingLogoSecondary(true);
        try {
            const response = await axios.post(route('admin.settings.uploadHeroLogoSecondary'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setHeroLogosSecondary(response.data.hero_logos_secondary);
                alert('Secondary logo added successfully!');
            }
        } catch (error) {
            console.error('Secondary logo upload error:', error);
            alert('Failed to upload secondary logo: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploadingLogoSecondary(false);
        }
    };

    // Handle delete secondary logo
    const handleDeleteLogoSecondary = async (index) => {
        if (!confirm('Are you sure you want to delete this logo?')) return;

        setDeletingLogoIndex(index);
        try {
            const response = await axios.post(route('admin.settings.deleteHeroLogoSecondary'), {
                index: index,
            });

            if (response.data.success) {
                setHeroLogosSecondary(response.data.hero_logos_secondary);
                alert('Secondary logo deleted successfully!');
            }
        } catch (error) {
            console.error('Delete logo error:', error);
            alert('Failed to delete logo: ' + (error.response?.data?.error || error.message));
        } finally {
            setDeletingLogoIndex(null);
        }
    };

    // Handle hero background upload
    const handleHeroBackgroundUpload = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('hero_background', file);

        setUploadingHero(true);
        try {
            const response = await axios.post(route('admin.settings.uploadHeroBackground'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setHeroBackground(response.data.hero_background);
                router.reload({ preserveScroll: true });
                alert('Hero background uploaded successfully!');
            }
        } catch (error) {
            console.error('Hero background upload error:', error);
            alert('Failed to upload hero background: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploadingHero(false);
        }
    };

    // Update speaker
    const updateSpeaker = (index, field, value) => {
        const newSpeakers = [...speakers];
        newSpeakers[index][field] = value;
        setSpeakers(newSpeakers);
    };

    // Update sponsor
    const updateSponsor = (index, field, value) => {
        const newSponsors = [...sponsors];
        newSponsors[index][field] = value;
        setSponsors(newSponsors);
    };

    // Add sponsor
    const addSponsor = () => {
        setSponsors([...sponsors, { name: '', logo: '', tier: 'gold' }]);
    };

    // Remove sponsor
    const removeSponsor = (index) => {
        const newSponsors = sponsors.filter((_, i) => i !== index);
        setSponsors(newSponsors);
    };

    // Save Landing Page Settings
    const saveLandingPageSettings = async () => {
        // Implementation for saving settings
        // This would typically make PATCH requests to update each setting
        alert('Save functionality to be implemented with PATCH requests to update settings');
    };

    return (
        <SidebarLayout>
            <Head title="Settings" />

            <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1abc9c', mb: 3 }}>
                    System Settings
                </Typography>

                <Paper sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            px: 2,
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                            },
                            '& .Mui-selected': {
                                color: '#1abc9c',
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#1abc9c',
                            },
                        }}
                    >
                        <Tab label="Landing Page Settings" />
                        <Tab label="Submission Deadline" />
                    </Tabs>

                    {/* Landing Page Settings Tab */}
                    <TabPanel value={tabValue} index={0}>
                        <Box sx={{ p: 3 }}>
                            <Stack spacing={4}>
                                {/* Countdown Timer Section */}
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2, color: '#1abc9c' }}>
                                            Countdown Timer
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type="datetime-local"
                                            label="Target Date & Time"
                                            value={countdownDate}
                                            onChange={(e) => setCountdownDate(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{
                                                mb: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#1abc9c',
                                                    },
                                                },
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                onClick={saveCountdown}
                                                disabled={savingCountdown}
                                                sx={{
                                                    backgroundColor: '#1abc9c',
                                                    '&:hover': { backgroundColor: '#16a085' },
                                                }}
                                            >
                                                {savingCountdown ? 'Saving...' : 'Save Countdown'}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Hero Background Section */}
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2, color: '#1abc9c' }}>
                                            Hero Background
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            Upload a video (.mp4, .webm) or image (.jpg, .png, .gif) for the hero section background. Max size: 50MB.
                                        </Typography>

                                        {/* Current Background Preview */}
                                        {heroBackground?.url && (
                                            <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', maxHeight: 200 }}>
                                                {heroBackground.type === 'video' ? (
                                                    <video
                                                        src={heroBackground.url}
                                                        autoPlay
                                                        muted
                                                        loop
                                                        playsInline
                                                        style={{ width: '100%', height: 200, objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={heroBackground.url}
                                                        alt="Hero Background"
                                                        style={{ width: '100%', height: 200, objectFit: 'cover' }}
                                                    />
                                                )}
                                            </Box>
                                        )}

                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <input
                                                ref={heroInputRef}
                                                type="file"
                                                accept="video/mp4,video/webm,image/jpeg,image/png,image/gif"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        handleHeroBackgroundUpload(e.target.files[0]);
                                                    }
                                                }}
                                                style={{ display: 'none' }}
                                                id="hero-background-input"
                                            />
                                            <label htmlFor="hero-background-input">
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    disabled={uploadingHero}
                                                    startIcon={<UploadFileIcon />}
                                                    sx={{
                                                        backgroundColor: '#1abc9c',
                                                        '&:hover': { backgroundColor: '#16a085' },
                                                    }}
                                                >
                                                    {uploadingHero ? 'Uploading...' : 'Upload New Background'}
                                                </Button>
                                            </label>
                                            {heroBackground?.filename && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Current: {heroBackground.filename}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* Hero Text Section */}
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2, color: '#1abc9c' }}>
                                            Hero Text Settings
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            Customize the main title, subtitle, and conference theme text displayed on the hero section.
                                        </Typography>

                                        <Stack spacing={2}>
                                            <TextField
                                                fullWidth
                                                label="Title Line 1 (e.g., PIT IAGI)"
                                                value={heroText.title_line1}
                                                onChange={(e) => setHeroText({ ...heroText, title_line1: e.target.value })}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#1abc9c',
                                                        },
                                                    },
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Title Line 2 (e.g., GEOSEA XIX 2026)"
                                                value={heroText.title_line2}
                                                onChange={(e) => setHeroText({ ...heroText, title_line2: e.target.value })}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#1abc9c',
                                                        },
                                                    },
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Theme Label (e.g., CONFERENCE THEME)"
                                                value={heroText.theme_label}
                                                onChange={(e) => setHeroText({ ...heroText, theme_label: e.target.value })}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#1abc9c',
                                                        },
                                                    },
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Conference Theme Text"
                                                value={heroText.theme_text}
                                                onChange={(e) => setHeroText({ ...heroText, theme_text: e.target.value })}
                                                multiline
                                                rows={2}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#1abc9c',
                                                        },
                                                    },
                                                }}
                                            />
                                        </Stack>

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                            <Button
                                                variant="contained"
                                                onClick={saveHeroText}
                                                disabled={savingHeroText}
                                                sx={{
                                                    backgroundColor: '#1abc9c',
                                                    '&:hover': { backgroundColor: '#16a085' },
                                                }}
                                            >
                                                {savingHeroText ? 'Saving...' : 'Save Hero Text'}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Hero Logo Section */}
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2, color: '#1abc9c' }}>
                                            Hero Logo
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            Upload the center logo displayed on the hero section. Recommended: transparent PNG or SVG. Max size: 5MB.
                                        </Typography>

                                        {/* Current Logo Preview */}
                                        {heroLogo?.url && (
                                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                                                <Box
                                                    sx={{
                                                        width: 120,
                                                        height: 120,
                                                        borderRadius: '50%',
                                                        bgcolor: 'white',
                                                        p: 2,
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <img
                                                        src={heroLogo.url}
                                                        alt="Hero Logo"
                                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                    />
                                                </Box>
                                            </Box>
                                        )}

                                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                                            <input
                                                ref={logoInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/gif,image/svg+xml"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        handleHeroLogoUpload(e.target.files[0]);
                                                    }
                                                }}
                                                style={{ display: 'none' }}
                                                id="hero-logo-input"
                                            />
                                            <label htmlFor="hero-logo-input">
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    disabled={uploadingLogo}
                                                    startIcon={<UploadFileIcon />}
                                                    sx={{
                                                        backgroundColor: '#1abc9c',
                                                        '&:hover': { backgroundColor: '#16a085' },
                                                    }}
                                                >
                                                    {uploadingLogo ? 'Uploading...' : 'Upload New Logo'}
                                                </Button>
                                            </label>
                                            {heroLogo?.filename && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Current: {heroLogo.filename}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* Secondary Hero Logos Section */}
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2, color: '#1abc9c' }}>
                                            Secondary Hero Logos
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            Upload smaller secondary logos displayed below the main logo. You can add multiple logos.
                                        </Typography>

                                        {/* Logos Grid */}
                                        {heroLogosSecondary.length > 0 && (
                                            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                                                {heroLogosSecondary.map((logo, index) => (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            position: 'relative',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                borderRadius: '50%',
                                                                bgcolor: 'white',
                                                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                                                overflow: 'hidden',
                                                                position: 'relative',
                                                            }}
                                                        >
                                                            <img
                                                                src={logo.url}
                                                                alt={`Secondary Logo ${index + 1}`}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        </Box>
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteLogoSecondary(index)}
                                                            disabled={deletingLogoIndex === index}
                                                            sx={{ mt: 1, fontSize: '0.7rem' }}
                                                        >
                                                            {deletingLogoIndex === index ? 'Deleting...' : 'Delete'}
                                                        </Button>
                                                    </Box>
                                                ))}
                                            </Box>
                                        )}

                                        {heroLogosSecondary.length === 0 && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                                                No secondary logos uploaded yet.
                                            </Typography>
                                        )}

                                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                                            <input
                                                ref={logoSecondaryInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/gif,image/svg+xml"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        handleHeroLogoSecondaryUpload(e.target.files[0]);
                                                    }
                                                }}
                                                style={{ display: 'none' }}
                                                id="hero-logo-secondary-input"
                                            />
                                            <label htmlFor="hero-logo-secondary-input">
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    disabled={uploadingLogoSecondary}
                                                    startIcon={<UploadFileIcon />}
                                                    sx={{
                                                        backgroundColor: '#1abc9c',
                                                        '&:hover': { backgroundColor: '#16a085' },
                                                    }}
                                                >
                                                    {uploadingLogoSecondary ? 'Uploading...' : 'Add Secondary Logo'}
                                                </Button>
                                            </label>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* Contact Information Section */}
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2, color: '#1abc9c' }}>
                                            Contact Information
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            Manage contact details displayed on the landing page (Phone, Email, Location with map)
                                        </Typography>

                                        <Stack spacing={2}>
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                value={contactInfo.phone || ''}
                                                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                                placeholder="e.g., 0857/1593522"
                                            />

                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                type="email"
                                                value={contactInfo.email || ''}
                                                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                                placeholder="e.g., wahyuwutomo31@gmail.com"
                                            />

                                            <TextField
                                                fullWidth
                                                label="Telegram Username"
                                                value={contactInfo.telegram || ''}
                                                onChange={(e) => setContactInfo({ ...contactInfo, telegram: e.target.value })}
                                                placeholder="e.g., @iagi_geosea2026"
                                            />

                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label="Location Address"
                                                value={contactInfo.location || ''}
                                                onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
                                                placeholder="e.g., UPN Veteran Yogyakarta, Jl. SWK 104 (Lingkar Utara), Yogyakarta 55283"
                                            />

                                            <TextField
                                                fullWidth
                                                label="Google Maps Embed URL"
                                                value={contactInfo.maps_url || ''}
                                                onChange={(e) => setContactInfo({ ...contactInfo, maps_url: e.target.value })}
                                                placeholder="Enter Google Maps embed URL or coordinates"
                                                helperText="Paste the embed URL from Google Maps (Share > Embed a map)"
                                            />

                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    onClick={saveContactInfo}
                                                    disabled={savingContactInfo}
                                                    sx={{
                                                        backgroundColor: '#1abc9c',
                                                        '&:hover': { backgroundColor: '#16a085' },
                                                    }}
                                                >
                                                    {savingContactInfo ? 'Saving...' : 'Save Contact Info'}
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* Follow Us - Social Media Section */}
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2, color: '#1abc9c' }}>
                                            Follow Us
                                        </Typography>
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            Manage social media links displayed on the landing page footer
                                        </Alert>

                                        <Stack spacing={2}>
                                            <TextField
                                                fullWidth
                                                label="Instagram URL"
                                                value={socialMedia.instagram || ''}
                                                onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                                                placeholder="https://www.instagram.com/your_account"
                                                InputProps={{
                                                    startAdornment: (
                                                        <Box sx={{ mr: 1, color: '#E4405F', display: 'flex' }}>
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                                            </svg>
                                                        </Box>
                                                    ),
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Facebook URL"
                                                value={socialMedia.facebook || ''}
                                                onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                                                placeholder="https://www.facebook.com/your_page"
                                                InputProps={{
                                                    startAdornment: (
                                                        <Box sx={{ mr: 1, color: '#1877F2', display: 'flex' }}>
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                            </svg>
                                                        </Box>
                                                    ),
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Twitter / X URL"
                                                value={socialMedia.twitter || ''}
                                                onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                                                placeholder="https://twitter.com/your_handle"
                                                InputProps={{
                                                    startAdornment: (
                                                        <Box sx={{ mr: 1, color: '#000', display: 'flex' }}>
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                            </svg>
                                                        </Box>
                                                    ),
                                                }}
                                            />


                                            <TextField
                                                fullWidth
                                                label="YouTube URL"
                                                value={socialMedia.youtube || ''}
                                                onChange={(e) => setSocialMedia({ ...socialMedia, youtube: e.target.value })}
                                                placeholder="https://www.youtube.com/@your_channel"
                                                InputProps={{
                                                    startAdornment: (
                                                        <Box sx={{ mr: 1, color: '#FF0000', display: 'flex' }}>
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                            </svg>
                                                        </Box>
                                                    ),
                                                }}
                                            />

                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    onClick={saveSocialMedia}
                                                    disabled={savingSocialMedia}
                                                    sx={{
                                                        backgroundColor: '#1abc9c',
                                                        '&:hover': { backgroundColor: '#16a085' },
                                                    }}
                                                >
                                                    {savingSocialMedia ? 'Saving...' : 'Save Social Media Links'}
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* Keynote Speakers Section */}
                                <Card variant="outlined">
                                    <CardContent>
                                        <Alert severity="info" sx={{ mb: 2 }}>
                                            Manage keynote speakers for the conference. Upload photos and add speaker details.
                                        </Alert>

                                        {/* Add Speaker Button */}
                                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Alert severity="warning" sx={{ flex: 1, mr: 2 }}>
                                                Save speakers first before uploading photos for new speakers!
                                            </Alert>
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                                onClick={addSpeaker}
                                                sx={{ borderColor: '#1abc9c', color: '#1abc9c', whiteSpace: 'nowrap' }}
                                            >
                                                Add Speaker
                                            </Button>
                                        </Box>

                                        {/* Speakers Description */}
                                        <TextField
                                            fullWidth
                                            label="Speakers Section Description"
                                            value={speakersDescription}
                                            onChange={(e) => setSpeakersDescription(e.target.value)}
                                            multiline
                                            rows={2}
                                            placeholder="Description text shown below 'Keynote Speakers' heading"
                                            helperText="This text appears on the landing page under the Keynote Speakers title"
                                            sx={{ mb: 3 }}
                                        />

                                        <Grid container spacing={2}>
                                            {speakers.map((speaker, index) => (
                                                <Grid item xs={12} sm={6} md={3} key={index}>
                                                    <Card sx={{ p: 2, height: '100%', position: 'relative' }}>
                                                        {/* Remove Button */}
                                                        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                color="error"
                                                                onClick={() => removeSpeaker(index)}
                                                                sx={{ minWidth: 'auto', p: 0.5 }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </Button>
                                                        </Box>

                                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                                            Speaker {index + 1}
                                                        </Typography>
                                                        {/* Photo Preview */}
                                                        <Box
                                                            sx={{
                                                                width: '100%',
                                                                height: 200,
                                                                backgroundColor: '#f5f5f5',
                                                                borderRadius: 1,
                                                                mb: 2,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                overflow: 'hidden',
                                                                backgroundImage: speaker.photo ? `url(${speaker.photo})` : 'none',
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center',
                                                            }}
                                                        >
                                                            {!speaker.photo && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    No Photo
                                                                </Typography>
                                                            )}
                                                        </Box>

                                                        {/* Upload Button */}
                                                        <Button
                                                            fullWidth
                                                            variant="outlined"
                                                            component="label"
                                                            startIcon={<UploadFileIcon />}
                                                            disabled={uploading}
                                                            sx={{ mb: 2 }}
                                                        >
                                                            Upload Photo
                                                            <input
                                                                type="file"
                                                                hidden
                                                                accept="image/*"
                                                                onChange={(e) => handleSpeakerPhotoUpload(index, e.target.files[0])}
                                                            />
                                                        </Button>

                                                        {/* Name */}
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Name"
                                                            value={speaker.name}
                                                            onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                                                            sx={{ mb: 1 }}
                                                        />

                                                        {/* Title */}
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Title/Affiliation"
                                                            value={speaker.title}
                                                            onChange={(e) => updateSpeaker(index, 'title', e.target.value)}
                                                            sx={{ mb: 1 }}
                                                        />

                                                        {/* Institution */}
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Institution (Optional)"
                                                            value={speaker.institution || ''}
                                                            onChange={(e) => updateSpeaker(index, 'institution', e.target.value)}
                                                            placeholder="e.g., Asian Geological Institute"
                                                        />
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                onClick={saveSpeakers}
                                                disabled={savingSpeakers}
                                                sx={{
                                                    backgroundColor: '#1abc9c',
                                                    '&:hover': { backgroundColor: '#16a085' },
                                                }}
                                            >
                                                {savingSpeakers ? 'Saving...' : 'Save Speakers'}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Sponsors Section */}
                                <Card variant="outlined">
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" sx={{ color: '#1abc9c' }}>
                                                Sponsors
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={addSponsor}
                                                sx={{ backgroundColor: '#1abc9c' }}
                                            >
                                                Add Sponsor
                                            </Button>
                                        </Box>

                                        {/* Sponsors Description */}
                                        <TextField
                                            fullWidth
                                            label="Sponsors Section Description"
                                            value={sponsorsDescription}
                                            onChange={(e) => setSponsorsDescription(e.target.value)}
                                            multiline
                                            rows={2}
                                            placeholder="Description text shown below 'Partners & Sponsors' heading"
                                            helperText="This text appears on the landing page under the Partners & Sponsors title"
                                            sx={{ mb: 3 }}
                                        />

                                        <Grid container spacing={2}>
                                            {sponsors.map((sponsor, index) => (
                                                <Grid item xs={12} sm={6} md={4} key={index}>
                                                    <Card variant="outlined" sx={{ p: 2, position: 'relative' }}>
                                                        {/* Delete Button */}
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => removeSponsor(index)}
                                                            sx={{ position: 'absolute', top: 8, right: 8 }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>

                                                        {/* Logo Preview */}
                                                        <Box
                                                            sx={{
                                                                width: '100%',
                                                                height: 150,
                                                                backgroundColor: '#f5f5f5',
                                                                borderRadius: 1,
                                                                mb: 2,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                overflow: 'hidden',
                                                                backgroundImage: sponsor.logo ? `url(${sponsor.logo})` : 'none',
                                                                backgroundSize: 'contain',
                                                                backgroundPosition: 'center',
                                                                backgroundRepeat: 'no-repeat',
                                                            }}
                                                        >
                                                            {!sponsor.logo && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    No Logo
                                                                </Typography>
                                                            )}
                                                        </Box>

                                                        {/* Upload Button */}
                                                        <Button
                                                            fullWidth
                                                            variant="outlined"
                                                            component="label"
                                                            startIcon={<UploadFileIcon />}
                                                            disabled={uploading}
                                                            sx={{ mb: 2 }}
                                                        >
                                                            Upload Logo
                                                            <input
                                                                type="file"
                                                                hidden
                                                                accept="image/*"
                                                                onChange={(e) => handleSponsorLogoUpload(index, e.target.files[0])}
                                                            />
                                                        </Button>

                                                        {/* Tier Selection */}
                                                        <TextField
                                                            fullWidth
                                                            select
                                                            size="small"
                                                            label="Sponsor Tier"
                                                            value={sponsor.tier || 'gold'}
                                                            onChange={(e) => updateSponsor(index, 'tier', e.target.value)}
                                                            sx={{ mb: 1 }}
                                                        >
                                                            <MenuItem value="gold">Gold</MenuItem>
                                                            <MenuItem value="platinum">Platinum</MenuItem>
                                                            <MenuItem value="silver">Silver</MenuItem>
                                                        </TextField>

                                                        {/* Name */}
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Sponsor Name"
                                                            value={sponsor.name}
                                                            onChange={(e) => updateSponsor(index, 'name', e.target.value)}
                                                        />
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        {/* Save Button */}
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                onClick={saveSponsors}
                                                disabled={savingSponsors}
                                                sx={{
                                                    backgroundColor: '#1abc9c',
                                                    '&:hover': { backgroundColor: '#16a085' },
                                                }}
                                            >
                                                {savingSponsors ? 'Saving...' : 'Save Sponsors'}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Resources Section */}
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2, color: '#1abc9c' }}>
                                            Conference Resources
                                        </Typography>
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            Upload presentation templates and guidelines for conference submissions
                                        </Alert>

                                        <DynamicResourceCards
                                            resources={resources}
                                            setResources={setResources}
                                            uploading={uploading}
                                            handleResourceFileUpload={handleResourceFileUpload}
                                            handleResourceDelete={handleResourceDelete}
                                        />

                                        {/* Save All Resources Button */}
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                size="large"
                                                onClick={handleSaveResources}
                                                sx={{
                                                    backgroundColor: '#1abc9c',
                                                    '&:hover': { backgroundColor: '#16a085' },
                                                }}
                                            >
                                                Save All Resources
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>


                                {/* Timeline Section */}
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2, color: '#1abc9c' }}>
                                            Conference Timeline
                                        </Typography>
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            Manage important conference dates and milestones
                                        </Alert>

                                        <DynamicTimelineCards
                                            timeline={timeline}
                                            setTimeline={setTimeline}
                                            handleTimelineDelete={handleTimelineDelete}
                                        />

                                        {/* Save All Timeline Button */}
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                size="large"
                                                onClick={handleSaveTimeline}
                                                sx={{
                                                    backgroundColor: '#1abc9c',
                                                    '&:hover': { backgroundColor: '#16a085' },
                                                }}
                                            >
                                                Save All Timeline
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Save Button */}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => window.open('/', '_blank')}
                                        sx={{
                                            borderColor: '#1abc9c',
                                            color: '#1abc9c',
                                            '&:hover': {
                                                borderColor: '#16a085',
                                                backgroundColor: 'rgba(26, 188, 156, 0.04)'
                                            },
                                            px: 4,
                                        }}
                                    >
                                        Preview Landing Page
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={saveLandingPageSettings}
                                        sx={{
                                            backgroundColor: '#1abc9c',
                                            '&:hover': { backgroundColor: '#16a085' },
                                            px: 4,
                                        }}
                                    >
                                        Save All Settings
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>
                    </TabPanel>

                    {/* Submission Deadline Tab */}
                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{ p: 3 }}>
                            <Alert severity="success" sx={{ mb: 3 }}>
                                <Typography variant="body2">
                                    <strong>Active Settings:</strong> Configure when users can submit their papers for the conference.
                                </Typography>
                            </Alert>

                            <Card variant="outlined" sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box component="form" onSubmit={handleDeadlineSubmit}>
                                        <Stack spacing={3}>
                                            {/* Enable/Disable Toggle */}
                                            <Box>
                                                <Typography variant="h6" sx={{ mb: 2, color: '#1abc9c' }}>
                                                    Submission Control
                                                </Typography>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={deadlineData.submission_enabled}
                                                            onChange={(e) => setDeadlineData('submission_enabled', e.target.checked)}
                                                            sx={{
                                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                                    color: '#1abc9c',
                                                                },
                                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: '#1abc9c',
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 600 }}>
                                                                {deadlineData.submission_enabled ? '✅ Submissions Enabled' : '🚫 Submissions Disabled'}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {deadlineData.submission_enabled
                                                                    ? 'Users can submit papers (subject to deadline dates below)'
                                                                    : 'All submissions are currently blocked'
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </Box>

                                            {/* Deadline Dates */}
                                            <Box>
                                                <Typography variant="h6" sx={{ mb: 2, color: '#1abc9c' }}>
                                                    Submission Period
                                                </Typography>

                                                <Stack spacing={2}>
                                                    <TextField
                                                        fullWidth
                                                        type="datetime-local"
                                                        label="Start Date & Time"
                                                        value={deadlineData.submission_deadline_start}
                                                        onChange={(e) => setDeadlineData('submission_deadline_start', e.target.value)}
                                                        error={!!deadlineErrors.submission_deadline_start}
                                                        helperText={deadlineErrors.submission_deadline_start || 'When submissions will open (leave empty for no start restriction)'}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#1abc9c',
                                                                },
                                                            },
                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                color: '#1abc9c',
                                                            },
                                                        }}
                                                    />

                                                    <TextField
                                                        fullWidth
                                                        type="datetime-local"
                                                        label="End Date & Time"
                                                        value={deadlineData.submission_deadline_end}
                                                        onChange={(e) => setDeadlineData('submission_deadline_end', e.target.value)}
                                                        error={!!deadlineErrors.submission_deadline_end}
                                                        helperText={deadlineErrors.submission_deadline_end || 'When submissions will close (leave empty for no end restriction)'}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#1abc9c',
                                                                },
                                                            },
                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                color: '#1abc9c',
                                                            },
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>

                                            {/* Info Alert */}
                                            <Alert severity="info">
                                                <Typography variant="body2">
                                                    <strong>Note:</strong> Users will not be able to submit new papers outside the specified deadline period.
                                                    The "New Submission" button will be disabled and show a notification about the deadline.
                                                </Typography>
                                            </Alert>

                                            {/* Error Display */}
                                            {deadlineErrors.error && (
                                                <Alert severity="error">
                                                    {deadlineErrors.error}
                                                </Alert>
                                            )}

                                            {/* Save Button */}
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2, gap: 2 }}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => window.location.reload()}
                                                    sx={{
                                                        color: '#666',
                                                        borderColor: '#ddd',
                                                        '&:hover': {
                                                            borderColor: '#999',
                                                            backgroundColor: '#f5f5f5',
                                                        },
                                                    }}
                                                >
                                                    Reset
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disabled={processingDeadline}
                                                    sx={{
                                                        backgroundColor: '#1abc9c',
                                                        '&:hover': {
                                                            backgroundColor: '#16a085',
                                                        },
                                                        px: 4,
                                                        py: 1.5,
                                                    }}
                                                >
                                                    {processingDeadline ? 'Saving...' : 'Save Settings'}
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </TabPanel>
                </Paper>
            </Box>
        </SidebarLayout>
    );
}
