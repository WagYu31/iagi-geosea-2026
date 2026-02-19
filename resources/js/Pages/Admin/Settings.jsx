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
    Avatar,
    useTheme,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
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
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const [tabValue, setTabValue] = useState(0); // Start with Landing Page Settings
    const [uploading, setUploading] = useState(false);

    // Shared premium styles
    const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: '10px', '& fieldset': { borderColor: c.cardBorder }, '&:hover fieldset': { borderColor: '#1abc9c' }, '&.Mui-focused fieldset': { borderColor: '#1abc9c' } }, '& .MuiInputLabel-root.Mui-focused': { color: '#1abc9c' }, '& input, & textarea': { color: c.textPrimary }, '& .MuiFormHelperText-root': { color: c.textMuted } };
    const tealBtnSx = { background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)', '&:hover': { background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600, px: 3, boxShadow: '0 4px 14px rgba(26,188,156,0.35)' };
    const sectionCardSx = { borderRadius: '14px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, overflow: 'hidden' };
    const sectionTitleSx = { fontWeight: 700, fontSize: '1rem', color: '#1abc9c', mb: 2 };

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
    const [partners, setPartners] = useState(getSettingValue('partners', []));
    const [savingPartners, setSavingPartners] = useState(false);
    const [resources, setResources] = useState(getSettingValue('resources', []));
    // Conference Resources Text Settings
    const [resourcesText, setResourcesText] = useState(() => {
        const data = getSettingValue('resources_text', null);
        if (data && typeof data === 'object') return data;
        return {
            section_label: 'DOWNLOADS',
            title: 'Seminar Resources',
            subtitle: 'Everything you need to prepare a professional presentation for the IAGI-GEOSEA 2026 conference.',
        };
    });
    const [savingResourcesText, setSavingResourcesText] = useState(false);
    const [savingCountdown, setSavingCountdown] = useState(false);
    const [savingContactInfo, setSavingContactInfo] = useState(false);
    const [savingSpeakers, setSavingSpeakers] = useState(false);
    const [savingSponsors, setSavingSponsors] = useState(false);

    // AFGEO Members State
    const [afgeoMembers, setAfgeoMembers] = useState(() => {
        const data = getSettingValue('afgeo_members', null);
        if (data && Array.isArray(data)) return data;
        return [
            { name: 'IAGI', country: 'Indonesia', logo: '' },
            { name: 'GSM', country: 'Malaysia', logo: '' },
            { name: 'GST', country: 'Thailand', logo: '' },
            { name: 'GSP', country: 'Philippines', logo: '' },
            { name: 'GSV', country: 'Vietnam', logo: '' },
            { name: 'GSJ', country: 'Japan', logo: '' },
            { name: 'GSK', country: 'Korea', logo: '' },
            { name: 'GSC', country: 'China', logo: '' },
        ];
    });
    const [savingAfgeoMembers, setSavingAfgeoMembers] = useState(false);

    // AFGEO Text Settings State
    const [afgeoText, setAfgeoText] = useState(() => {
        const data = getSettingValue('afgeo_text', null);
        if (data && typeof data === 'object') return data;
        return {
            section_label: 'OUR NETWORK',
            title: 'AFGEO Member',
            subtitle: 'Association of Federation of Geoscientists of East and Southeast Asia',
        };
    });
    const [savingAfgeoText, setSavingAfgeoText] = useState(false);

    // Custom Sections State (dynamic sections like AFGEO)
    const [customSections, setCustomSections] = useState(() => {
        const data = getSettingValue('custom_sections', null);
        if (data && Array.isArray(data)) return data;
        return [];
    });
    const [savingCustomSections, setSavingCustomSections] = useState(false);
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

    // Submission Procedure State - Array of sections with title and items
    const [submissionProcedure, setSubmissionProcedure] = useState(() => {
        const data = getSettingValue('submission_procedure', null);
        // Support both old format (object with pendaftaran/abstract) and new format (array of sections)
        if (data && Array.isArray(data)) return data;
        if (data && typeof data === 'object' && data.pendaftaran) {
            // Convert old format to new format
            return [
                {
                    title: 'PENDAFTARAN',
                    items: data.pendaftaran || [],
                },
                {
                    title: 'SUBMISSION ABSTRACT',
                    items: data.abstract || [],
                },
            ];
        }
        return [
            {
                title: 'PENDAFTARAN',
                items: [
                    { text: 'Register on our platform with your email', link: '/register' },
                    { text: 'Complete your profile information', link: '/dashboard' },
                    { text: 'Choose your participation category', link: '/register' },
                    { text: 'Wait for account verification', link: '' },
                ],
            },
            {
                title: 'SUBMISSION ABSTRACT',
                items: [
                    { text: 'Download the abstract template from Resources', link: '#resources' },
                    { text: 'Prepare your abstract following the guidelines', link: '#resources' },
                    { text: 'Upload your abstract through the submission portal', link: '/dashboard' },
                    { text: 'Track your submission status in your dashboard', link: '/dashboard' },
                ],
            },
        ];
    });
    const [savingSubmissionProcedure, setSavingSubmissionProcedure] = useState(false);
    // FAQ/Submission Procedure Background
    const [faqBackground, setFaqBackground] = useState(() => {
        const data = getSettingValue('faq_background', null);
        if (data && typeof data === 'object') return data;
        return { url: '', filename: '' };
    });
    const [uploadingFaqBackground, setUploadingFaqBackground] = useState(false);
    // FAQ Text Settings State
    const [faqText, setFaqText] = useState(() => {
        const data = getSettingValue('faq_text', null);
        if (data && typeof data === 'object') return data;
        return {
            title: 'FREQUENTLY ASKED QUESTION',
            subtitle: 'Follow these simple steps to submit your abstract for the conference',
        };
    });
    const [savingFaqText, setSavingFaqText] = useState(false);

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
    const saveSponsors = () => {
        const settingId = getSettingId('sponsors');
        if (!settingId) {
            alert('Sponsors setting not found');
            return;
        }

        setSavingSponsors(true);

        // Save sponsors using Inertia router with hardcoded URL
        router.patch(`/admin/settings/${settingId}`, {
            value: JSON.stringify(sponsors),
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // After sponsors saved, save description
                const descSettingId = getSettingId('sponsors_description');
                if (descSettingId) {
                    router.patch(`/admin/settings/${descSettingId}`, {
                        value: sponsorsDescription,
                    }, {
                        preserveScroll: true,
                        onSuccess: () => {
                            setSavingSponsors(false);
                            alert('Sponsors saved successfully!');
                        },
                        onError: (errors) => {
                            setSavingSponsors(false);
                            console.error('Description save error:', errors);
                            alert('Sponsors saved, but description failed.');
                        },
                    });
                } else {
                    router.post('/admin/settings', {
                        key: 'sponsors_description',
                        value: sponsorsDescription,
                    }, {
                        preserveScroll: true,
                        onSuccess: () => {
                            setSavingSponsors(false);
                            alert('Sponsors saved successfully!');
                        },
                        onError: () => {
                            setSavingSponsors(false);
                            alert('Sponsors saved, but description failed.');
                        },
                    });
                }
            },
            onError: (errors) => {
                setSavingSponsors(false);
                console.error('Sponsors save error:', errors);
                alert('Failed to save sponsors.');
            },
        });
    };

    // Save AFGEO Members
    const saveAfgeoMembers = async () => {
        setSavingAfgeoMembers(true);
        try {
            const settingId = getSettingId('afgeo_members');
            if (settingId) {
                await router.patch(route('admin.settings.update', settingId), {
                    value: JSON.stringify(afgeoMembers),
                }, {
                    preserveScroll: true,
                });
            } else {
                await router.post(route('admin.settings.store'), {
                    key: 'afgeo_members',
                    value: JSON.stringify(afgeoMembers),
                    type: 'json',
                }, {
                    preserveScroll: true,
                });
            }
            alert('AFGEO Members saved successfully!');
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save AFGEO Members');
        } finally {
            setSavingAfgeoMembers(false);
        }
    };

    // Add new AFGEO member
    const addAfgeoMember = () => {
        setAfgeoMembers([...afgeoMembers, { name: '', country: '', logo: '' }]);
    };

    // Remove AFGEO member
    const removeAfgeoMember = (index) => {
        if (confirm('Are you sure you want to remove this member?')) {
            const updated = afgeoMembers.filter((_, i) => i !== index);
            setAfgeoMembers(updated);
        }
    };

    // Handle AFGEO member logo upload
    const handleAfgeoMemberLogoUpload = async (index, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('logo', file);
        formData.append('index', index);

        try {
            const response = await axios.post('/admin/settings/afgeo-member-logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                const updated = [...afgeoMembers];
                updated[index].logo = response.data.logo_url;
                setAfgeoMembers(updated);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload logo');
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

    // Save Resources Text Settings
    const saveResourcesText = async () => {
        setSavingResourcesText(true);
        try {
            const settingId = getSettingId('resources_text');
            if (settingId) {
                await router.patch(route('admin.settings.update', settingId), {
                    value: JSON.stringify(resourcesText),
                }, {
                    preserveScroll: true,
                });
            } else {
                await router.post(route('admin.settings.store'), {
                    key: 'resources_text',
                    value: JSON.stringify(resourcesText),
                    type: 'json',
                }, {
                    preserveScroll: true,
                });
            }
            alert('Resources text settings saved successfully!');
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save resources text settings');
        } finally {
            setSavingResourcesText(false);
        }
    };

    // Save FAQ Text Settings
    const saveFaqText = async () => {
        setSavingFaqText(true);
        try {
            const settingId = getSettingId('faq_text');
            if (settingId) {
                await router.patch(route('admin.settings.update', settingId), {
                    value: JSON.stringify(faqText),
                }, {
                    preserveScroll: true,
                });
            } else {
                await router.post(route('admin.settings.store'), {
                    key: 'faq_text',
                    value: JSON.stringify(faqText),
                    type: 'json',
                }, {
                    preserveScroll: true,
                });
            }
            alert('FAQ text settings saved successfully!');
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save FAQ text settings');
        } finally {
            setSavingFaqText(false);
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

    // ── Partners CRUD ──
    const addPartner = () => {
        setPartners([...partners, { name: '', poster: '', url: '' }]);
    };

    const removePartner = (index) => {
        const updated = partners.filter((_, i) => i !== index);
        setPartners(updated);
    };

    const updatePartner = (index, field, value) => {
        const updated = [...partners];
        updated[index][field] = value;
        setPartners(updated);
    };

    const handlePartnerPosterUpload = async (index, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('poster', file);
        formData.append('index', index);

        setUploading(true);
        try {
            const response = await fetch(route('admin.settings.uploadPartnerPoster'), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });

            const data = await response.json();

            if (data.success) {
                const updated = [...partners];
                updated[index].poster = data.poster_url;
                setPartners(updated);
            }
        } catch (error) {
            console.error('Partner poster upload failed:', error);
            alert('Failed to upload poster');
        } finally {
            setUploading(false);
        }
    };

    const savePartners = () => {
        const settingId = getSettingId('partners');

        setSavingPartners(true);

        if (!settingId) {
            // Create new setting
            router.post(route('admin.settings.store'), {
                key: 'partners',
                value: JSON.stringify(partners),
                group: 'landing_page',
                type: 'json',
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setSavingPartners(false);
                    alert('Partners saved successfully!');
                    router.reload({ preserveScroll: true });
                },
                onError: (errors) => {
                    setSavingPartners(false);
                    console.error('Partners save error:', errors);
                    alert('Failed to save partners.');
                },
            });
            return;
        }

        router.patch(`/admin/settings/${settingId}`, {
            value: JSON.stringify(partners),
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSavingPartners(false);
                alert('Partners saved successfully!');
            },
            onError: (errors) => {
                setSavingPartners(false);
                console.error('Partners save error:', errors);
                alert('Failed to save partners.');
            },
        });
    };

    // Update submission procedure item (now uses section index)
    const updateSubmissionProcedure = (sectionIndex, itemIndex, field, value) => {
        const newProcedure = [...submissionProcedure];
        newProcedure[sectionIndex].items[itemIndex][field] = value;
        setSubmissionProcedure(newProcedure);
    };

    // Update section title
    const updateSectionTitle = (sectionIndex, title) => {
        const newProcedure = [...submissionProcedure];
        newProcedure[sectionIndex].title = title;
        setSubmissionProcedure(newProcedure);
    };

    // Add submission procedure item to section
    const addSubmissionProcedureItem = (sectionIndex) => {
        const newProcedure = [...submissionProcedure];
        newProcedure[sectionIndex].items = [...newProcedure[sectionIndex].items, { text: '', link: '', filename: '' }];
        setSubmissionProcedure(newProcedure);
    };

    // Remove submission procedure item from section
    const removeSubmissionProcedureItem = (sectionIndex, itemIndex) => {
        const newProcedure = [...submissionProcedure];
        newProcedure[sectionIndex].items = newProcedure[sectionIndex].items.filter((_, i) => i !== itemIndex);
        setSubmissionProcedure(newProcedure);
    };

    // Add new section
    const addSubmissionProcedureSection = () => {
        setSubmissionProcedure([
            ...submissionProcedure,
            {
                title: 'NEW SECTION',
                items: [{ text: '', link: '', filename: '' }],
            },
        ]);
    };

    // Remove section
    const removeSubmissionProcedureSection = (sectionIndex) => {
        if (submissionProcedure.length <= 1) return;
        setSubmissionProcedure(submissionProcedure.filter((_, i) => i !== sectionIndex));
    };

    // Save submission procedure settings
    const saveSubmissionProcedure = () => {
        setSavingSubmissionProcedure(true);
        router.patch(route('admin.settings.update', 'submission_procedure'), {
            value: JSON.stringify(submissionProcedure),
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSavingSubmissionProcedure(false);
                alert('Submission procedure settings saved successfully!');
            },
            onError: (errors) => {
                setSavingSubmissionProcedure(false);
                console.error('Save errors:', errors);
                alert('Failed to save submission procedure settings');
            },
            onFinish: () => {
                setSavingSubmissionProcedure(false);
            }
        });
    };

    // Handle PDF upload for submission procedure
    const [uploadingProcedurePdf, setUploadingProcedurePdf] = useState(null);
    const handleSubmissionProcedurePdfUpload = async (sectionIndex, itemIndex, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', submissionProcedure[sectionIndex].items[itemIndex].text || `procedure_${sectionIndex}_${itemIndex}`);
        formData.append('description', `${submissionProcedure[sectionIndex].title} Step ${itemIndex + 1}`);

        setUploadingProcedurePdf(`${sectionIndex}_${itemIndex}`);
        try {
            const response = await axios.post(route('admin.settings.uploadResourceFile'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                // Update the link with the uploaded file URL
                const newProcedure = [...submissionProcedure];
                newProcedure[sectionIndex].items[itemIndex].link = response.data.resource.file_url;
                newProcedure[sectionIndex].items[itemIndex].filename = response.data.resource.title + '.' + response.data.resource.file_type;
                setSubmissionProcedure(newProcedure);
                alert('PDF uploaded successfully! Click Save to persist changes.');
            }
        } catch (error) {
            console.error('PDF upload error:', error);
            alert('Failed to upload PDF: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploadingProcedurePdf(null);
        }
    };

    // Compress image client-side before upload (stays under PHP 2MB limit)
    const compressImage = (file, maxWidth = 1920, quality = 0.7) => {
        return new Promise((resolve) => {
            // If file is already small enough, skip compression
            if (file.size <= 1.8 * 1024 * 1024) {
                resolve(file);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;

                    // Scale down if larger than maxWidth
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            console.log(`Compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
                            resolve(compressedFile);
                        },
                        'image/jpeg',
                        quality
                    );
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    // Handle FAQ background upload
    const handleFaqBackgroundUpload = async (file) => {
        if (!file) return;

        setUploadingFaqBackground(true);
        try {
            // Compress image before upload
            const compressedFile = await compressImage(file);

            const formData = new FormData();
            formData.append('background', compressedFile);

            const response = await axios.post('/admin/settings/faq-background', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setFaqBackground({
                    url: response.data.background_url,
                    filename: file.name,
                });
                alert('FAQ background uploaded successfully!');
            }
        } catch (error) {
            console.error('FAQ background upload error:', error);
            alert('Failed to upload background: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploadingFaqBackground(false);
        }
    };

    // Remove FAQ background
    const removeFaqBackground = async () => {
        if (confirm('Are you sure you want to remove the FAQ background?')) {
            try {
                const settingId = getSettingId('faq_background');
                if (settingId) {
                    await router.patch(route('admin.settings.update', settingId), {
                        value: JSON.stringify({ url: '', filename: '' }),
                    }, {
                        preserveScroll: true,
                    });
                }
                setFaqBackground({ url: '', filename: '' });
                alert('FAQ background removed successfully!');
            } catch (error) {
                console.error('Remove FAQ background error:', error);
                alert('Failed to remove background');
            }
        }
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

            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 }, maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', bgcolor: c.surfaceBg }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: { xs: '1.5rem', sm: '1.85rem' }, letterSpacing: '-0.02em' }}>
                        System Settings ⚙️
                    </Typography>
                    <Typography variant="body2" sx={{ color: c.textMuted, mt: 0.5 }}>Configure your landing page and submission settings</Typography>
                </Box>

                <Card elevation={0} sx={{ borderRadius: '16px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, overflow: 'hidden' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{
                            borderBottom: `1px solid ${c.cardBorder}`,
                            px: 2,
                            bgcolor: isDark ? 'rgba(0,0,0,0.1)' : '#f9fafb',
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                color: c.textMuted,
                                borderRadius: '8px 8px 0 0',
                                py: 1.5,
                            },
                            '& .Mui-selected': {
                                color: '#1abc9c',
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#1abc9c',
                                height: 3,
                                borderRadius: '3px 3px 0 0',
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
                                <Card elevation={0} sx={sectionCardSx}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={sectionTitleSx}>
                                            ⏱️ Countdown Timer
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type="datetime-local"
                                            label="Target Date & Time"
                                            value={countdownDate}
                                            onChange={(e) => setCountdownDate(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ mb: 2, ...inputSx }}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button variant="contained" onClick={saveCountdown} disabled={savingCountdown} sx={tealBtnSx}>
                                                {savingCountdown ? 'Saving...' : 'Save Countdown'}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Hero Background Section */}
                                <Card elevation={0} sx={sectionCardSx}>
                                    <CardContent>
                                        <Typography variant="h6" sx={sectionTitleSx}>
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
                                <Card elevation={0} sx={sectionCardSx}>
                                    <CardContent>
                                        <Typography variant="h6" sx={sectionTitleSx}>
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
                                <Card elevation={0} sx={sectionCardSx}>
                                    <CardContent>
                                        <Typography variant="h6" sx={sectionTitleSx}>
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
                                <Card elevation={0} sx={sectionCardSx}>
                                    <CardContent>
                                        <Typography variant="h6" sx={sectionTitleSx}>
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
                                <Card elevation={0} sx={sectionCardSx}>
                                    <CardContent>
                                        <Typography variant="h6" sx={sectionTitleSx}>
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
                                <Card elevation={0} sx={sectionCardSx}>
                                    <CardContent>
                                        <Typography variant="h6" sx={sectionTitleSx}>
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
                                <Card elevation={0} sx={sectionCardSx}>
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
                                <Card elevation={0} sx={sectionCardSx}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" sx={{ color: '#1abc9c' }}>
                                                SUPPORTED
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={addSponsor}
                                                sx={{ backgroundColor: '#1abc9c' }}
                                            >
                                                Add Supported
                                            </Button>
                                        </Box>

                                        {/* Sponsors Description */}
                                        <TextField
                                            fullWidth
                                            label="Supported Section Description"
                                            value={sponsorsDescription}
                                            onChange={(e) => setSponsorsDescription(e.target.value)}
                                            multiline
                                            rows={2}
                                            placeholder="Description text shown below 'Partners & Sponsors' heading"
                                            helperText="This text appears on the landing page under the SUPPORTED BY : title"
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

                                {/* Event Partners Section */}
                                <Card elevation={0} sx={sectionCardSx}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" sx={{ color: '#1abc9c' }}>
                                                Event Partners
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={addPartner}
                                                sx={{ backgroundColor: '#1abc9c' }}
                                            >
                                                Add Partner
                                            </Button>
                                        </Box>

                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            Upload partner posters with name and link URL. These will appear on the landing page as clickable poster cards.
                                        </Alert>

                                        <Grid container spacing={2}>
                                            {partners.map((partner, index) => (
                                                <Grid item xs={12} sm={6} md={4} key={index}>
                                                    <Card variant="outlined" sx={{ p: 2, position: 'relative' }}>
                                                        {/* Delete Button */}
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => removePartner(index)}
                                                            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>

                                                        {/* Poster Preview */}
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
                                                                backgroundImage: partner.poster ? `url(${partner.poster})` : 'none',
                                                                backgroundSize: 'contain',
                                                                backgroundPosition: 'center',
                                                                backgroundRepeat: 'no-repeat',
                                                            }}
                                                        >
                                                            {!partner.poster && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    No Poster
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
                                                            Upload Poster
                                                            <input
                                                                type="file"
                                                                hidden
                                                                accept="image/*"
                                                                onChange={(e) => handlePartnerPosterUpload(index, e.target.files[0])}
                                                            />
                                                        </Button>

                                                        {/* Name Field */}
                                                        <TextField
                                                            fullWidth
                                                            label="Partner Name"
                                                            value={partner.name || ''}
                                                            onChange={(e) => updatePartner(index, 'name', e.target.value)}
                                                            sx={{ mb: 2 }}
                                                            size="small"
                                                        />

                                                        {/* URL Field */}
                                                        <TextField
                                                            fullWidth
                                                            label="Website URL"
                                                            value={partner.url || ''}
                                                            onChange={(e) => updatePartner(index, 'url', e.target.value)}
                                                            placeholder="https://example.com"
                                                            size="small"
                                                        />
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        {/* Save Button */}
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                onClick={savePartners}
                                                disabled={savingPartners}
                                                sx={{
                                                    backgroundColor: '#1abc9c',
                                                    '&:hover': { backgroundColor: '#16a085' },
                                                }}
                                            >
                                                {savingPartners ? 'Saving...' : 'Save Partners'}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Resources Section */}
                                <Card elevation={0} sx={sectionCardSx}>
                                    <CardContent>
                                        <Typography variant="h6" sx={sectionTitleSx}>
                                            Conference Resources
                                        </Typography>
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            Upload presentation templates and guidelines for conference submissions
                                        </Alert>

                                        {/* Section Header Text Settings */}
                                        <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280', fontWeight: 600 }}>
                                            Section Header Text
                                        </Typography>
                                        <Grid container spacing={2} sx={{ mb: 3 }}>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    label="Section Label"
                                                    value={resourcesText.section_label}
                                                    onChange={(e) => setResourcesText({ ...resourcesText, section_label: e.target.value })}
                                                    fullWidth
                                                    size="small"
                                                    helperText="e.g. DOWNLOADS"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    label="Title"
                                                    value={resourcesText.title}
                                                    onChange={(e) => setResourcesText({ ...resourcesText, title: e.target.value })}
                                                    fullWidth
                                                    size="small"
                                                    helperText="e.g. Seminar Resources"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    label="Subtitle"
                                                    value={resourcesText.subtitle}
                                                    onChange={(e) => setResourcesText({ ...resourcesText, subtitle: e.target.value })}
                                                    fullWidth
                                                    size="small"
                                                    helperText="Full description"
                                                />
                                            </Grid>
                                        </Grid>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={saveResourcesText}
                                                disabled={savingResourcesText}
                                                sx={{ borderColor: '#1abc9c', color: '#1abc9c' }}
                                            >
                                                {savingResourcesText ? 'Saving...' : 'Save Section Text'}
                                            </Button>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

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

                                {/* AFGEO Members Section */}
                                <Card elevation={0} sx={sectionCardSx}>
                                    <CardContent>
                                        <Typography variant="h6" sx={sectionTitleSx}>
                                            AFGEO Members
                                        </Typography>
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            Manage AFGEO (Association of Federation of Geoscientists of East and Southeast Asia) member organizations
                                        </Alert>

                                        {/* Section Text Settings */}
                                        <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280', fontWeight: 600 }}>
                                            Section Header Text
                                        </Typography>
                                        <Grid container spacing={2} sx={{ mb: 3 }}>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    label="Section Label"
                                                    value={afgeoText.section_label}
                                                    onChange={(e) => setAfgeoText({ ...afgeoText, section_label: e.target.value })}
                                                    fullWidth
                                                    size="small"
                                                    helperText="e.g. OUR NETWORK"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    label="Title"
                                                    value={afgeoText.title}
                                                    onChange={(e) => setAfgeoText({ ...afgeoText, title: e.target.value })}
                                                    fullWidth
                                                    size="small"
                                                    helperText="e.g. AFGEO Member"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    label="Subtitle"
                                                    value={afgeoText.subtitle}
                                                    onChange={(e) => setAfgeoText({ ...afgeoText, subtitle: e.target.value })}
                                                    fullWidth
                                                    size="small"
                                                    helperText="Full description"
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* AFGEO Background Image Upload */}
                                        <Box sx={{ mt: 2, p: 2, bgcolor: '#f9fafb', borderRadius: 1, border: '1px dashed #e5e7eb' }}>
                                            <Typography variant="subtitle2" sx={{ mb: 1, color: '#6b7280', fontSize: '0.8rem' }}>
                                                Section Background Image
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                {afgeoText.background && (
                                                    <Box
                                                        component="img"
                                                        src={afgeoText.background}
                                                        sx={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 1, border: '1px solid #e5e7eb' }}
                                                    />
                                                )}
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    component="label"
                                                    startIcon={<UploadFileIcon />}
                                                >
                                                    {afgeoText.background ? 'Change Background' : 'Upload Background'}
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            if (!file) return;
                                                            try {
                                                                const formData = new FormData();
                                                                formData.append('background', file);
                                                                const response = await axios.post('/admin/settings/afgeo-background', formData, {
                                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                                });
                                                                if (response.data.background_url) {
                                                                    setAfgeoText({ ...afgeoText, background: response.data.background_url });
                                                                }
                                                            } catch (error) {
                                                                console.error('Background upload error:', error);
                                                                alert('Failed to upload background');
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                                {afgeoText.background && (
                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        color="error"
                                                        onClick={() => setAfgeoText({ ...afgeoText, background: '' })}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280', fontWeight: 600 }}>
                                            Member Organizations
                                        </Typography>

                                        <Grid container spacing={2}>
                                            {afgeoMembers.map((member, index) => (
                                                <Grid item xs={12} sm={6} md={4} key={index}>
                                                    <Paper sx={{ p: 2, border: '1px solid #e5e7eb' }}>
                                                        <Stack spacing={2}>
                                                            <TextField
                                                                label="Organization Name"
                                                                value={member.name}
                                                                onChange={(e) => {
                                                                    const updated = [...afgeoMembers];
                                                                    updated[index].name = e.target.value;
                                                                    setAfgeoMembers(updated);
                                                                }}
                                                                fullWidth
                                                                size="small"
                                                            />
                                                            <TextField
                                                                label="Country"
                                                                value={member.country}
                                                                onChange={(e) => {
                                                                    const updated = [...afgeoMembers];
                                                                    updated[index].country = e.target.value;
                                                                    setAfgeoMembers(updated);
                                                                }}
                                                                fullWidth
                                                                size="small"
                                                            />

                                                            {/* Logo Upload */}
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                {member.logo && (
                                                                    <Box
                                                                        component="img"
                                                                        src={member.logo}
                                                                        sx={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 1, border: '1px solid #e5e7eb' }}
                                                                    />
                                                                )}
                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    component="label"
                                                                    startIcon={<UploadFileIcon />}
                                                                >
                                                                    Logo
                                                                    <input
                                                                        type="file"
                                                                        hidden
                                                                        accept="image/*"
                                                                        onChange={(e) => handleAfgeoMemberLogoUpload(index, e.target.files[0])}
                                                                    />
                                                                </Button>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => removeAfgeoMember(index)}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Box>
                                                        </Stack>
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                                onClick={addAfgeoMember}
                                                sx={{ borderColor: '#1abc9c', color: '#1abc9c' }}
                                            >
                                                Add Member
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={async () => {
                                                    setSavingAfgeoMembers(true);
                                                    try {
                                                        // Save members
                                                        const membersSettingId = getSettingId('afgeo_members');
                                                        if (membersSettingId) {
                                                            await router.patch(route('admin.settings.update', membersSettingId), {
                                                                value: JSON.stringify(afgeoMembers),
                                                            }, { preserveScroll: true });
                                                        } else {
                                                            await router.post(route('admin.settings.store'), {
                                                                key: 'afgeo_members',
                                                                value: JSON.stringify(afgeoMembers),
                                                                type: 'json',
                                                            }, { preserveScroll: true });
                                                        }

                                                        // Save text settings
                                                        const textSettingId = getSettingId('afgeo_text');
                                                        if (textSettingId) {
                                                            await router.patch(route('admin.settings.update', textSettingId), {
                                                                value: JSON.stringify(afgeoText),
                                                            }, { preserveScroll: true });
                                                        } else {
                                                            await router.post(route('admin.settings.store'), {
                                                                key: 'afgeo_text',
                                                                value: JSON.stringify(afgeoText),
                                                                type: 'json',
                                                            }, { preserveScroll: true });
                                                        }

                                                        alert('AFGEO Settings saved successfully!');
                                                    } catch (error) {
                                                        console.error('Save error:', error);
                                                        alert('Failed to save AFGEO Settings');
                                                    } finally {
                                                        setSavingAfgeoMembers(false);
                                                    }
                                                }}
                                                disabled={savingAfgeoMembers}
                                                sx={{
                                                    backgroundColor: '#1abc9c',
                                                    '&:hover': { backgroundColor: '#16a085' },
                                                }}
                                            >
                                                {savingAfgeoMembers ? 'Saving...' : 'Save AFGEO Settings'}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Custom Sections - Dynamic Landing Page Sections */}
                                <Card elevation={0} sx={sectionCardSx}>
                                    <CardContent>
                                        <Typography variant="h6" sx={sectionTitleSx}>
                                            Custom Sections
                                        </Typography>
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            Create additional sections on the landing page (similar to AFGEO Member section)
                                        </Alert>

                                        {customSections.length === 0 ? (
                                            <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#f9fafb', borderRadius: 2 }}>
                                                <Typography color="text.secondary" sx={{ mb: 2 }}>
                                                    No custom sections yet. Click "Add New Section" to create one.
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Stack spacing={3}>
                                                {customSections.map((section, sectionIndex) => (
                                                    <Paper key={sectionIndex} sx={{ p: 3, border: '1px solid #e5e7eb' }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#374151' }}>
                                                                Section #{sectionIndex + 1}
                                                            </Typography>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => {
                                                                    if (confirm('Delete this section?')) {
                                                                        setCustomSections(customSections.filter((_, i) => i !== sectionIndex));
                                                                    }
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>

                                                        {/* Section Header Settings */}
                                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                                            <Grid item xs={12} sm={4}>
                                                                <TextField
                                                                    label="Section Label"
                                                                    value={section.section_label || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...customSections];
                                                                        updated[sectionIndex].section_label = e.target.value;
                                                                        setCustomSections(updated);
                                                                    }}
                                                                    fullWidth
                                                                    size="small"
                                                                    placeholder="e.g. OUR PARTNERS"
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4}>
                                                                <TextField
                                                                    label="Title"
                                                                    value={section.title || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...customSections];
                                                                        updated[sectionIndex].title = e.target.value;
                                                                        setCustomSections(updated);
                                                                    }}
                                                                    fullWidth
                                                                    size="small"
                                                                    placeholder="e.g. Our Partners"
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4}>
                                                                <TextField
                                                                    label="Subtitle"
                                                                    value={section.subtitle || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...customSections];
                                                                        updated[sectionIndex].subtitle = e.target.value;
                                                                        setCustomSections(updated);
                                                                    }}
                                                                    fullWidth
                                                                    size="small"
                                                                    placeholder="Description"
                                                                />
                                                            </Grid>
                                                        </Grid>

                                                        {/* Background Image Upload */}
                                                        <Box sx={{ mt: 2, p: 2, bgcolor: '#f9fafb', borderRadius: 1, border: '1px dashed #e5e7eb' }}>
                                                            <Typography variant="subtitle2" sx={{ mb: 1, color: '#6b7280', fontSize: '0.8rem' }}>
                                                                Section Background Image
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                {section.background && (
                                                                    <Box
                                                                        component="img"
                                                                        src={section.background}
                                                                        sx={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 1, border: '1px solid #e5e7eb' }}
                                                                    />
                                                                )}
                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    component="label"
                                                                    startIcon={<UploadFileIcon />}
                                                                >
                                                                    {section.background ? 'Change Background' : 'Upload Background'}
                                                                    <input
                                                                        type="file"
                                                                        hidden
                                                                        accept="image/*"
                                                                        onChange={async (e) => {
                                                                            const file = e.target.files[0];
                                                                            if (!file) return;
                                                                            try {
                                                                                const formData = new FormData();
                                                                                formData.append('background', file);
                                                                                formData.append('section_index', sectionIndex);
                                                                                const response = await axios.post('/admin/settings/custom-section-background', formData, {
                                                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                                                });
                                                                                if (response.data.background_url) {
                                                                                    const updated = [...customSections];
                                                                                    updated[sectionIndex].background = response.data.background_url;
                                                                                    setCustomSections(updated);
                                                                                }
                                                                            } catch (error) {
                                                                                console.error('Background upload error:', error);
                                                                                alert('Failed to upload background');
                                                                            }
                                                                        }}
                                                                    />
                                                                </Button>
                                                                {section.background && (
                                                                    <Button
                                                                        variant="text"
                                                                        size="small"
                                                                        color="error"
                                                                        onClick={() => {
                                                                            const updated = [...customSections];
                                                                            updated[sectionIndex].background = '';
                                                                            setCustomSections(updated);
                                                                        }}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                )}
                                                            </Box>
                                                        </Box>

                                                        <Divider sx={{ my: 2 }} />

                                                        {/* Section Members/Items */}
                                                        <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
                                                            Items
                                                        </Typography>
                                                        <Grid container spacing={2}>
                                                            {(section.members || []).map((member, memberIndex) => (
                                                                <Grid item xs={12} sm={6} md={4} key={memberIndex}>
                                                                    <Paper sx={{ p: 2, border: '1px solid #e5e7eb' }}>
                                                                        <Stack spacing={1}>
                                                                            <TextField
                                                                                label="Name"
                                                                                value={member.name || ''}
                                                                                onChange={(e) => {
                                                                                    const updated = [...customSections];
                                                                                    updated[sectionIndex].members[memberIndex].name = e.target.value;
                                                                                    setCustomSections(updated);
                                                                                }}
                                                                                fullWidth
                                                                                size="small"
                                                                            />
                                                                            <TextField
                                                                                label="Description"
                                                                                value={member.country || ''}
                                                                                onChange={(e) => {
                                                                                    const updated = [...customSections];
                                                                                    updated[sectionIndex].members[memberIndex].country = e.target.value;
                                                                                    setCustomSections(updated);
                                                                                }}
                                                                                fullWidth
                                                                                size="small"
                                                                            />
                                                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                                                {member.logo && (
                                                                                    <Box
                                                                                        component="img"
                                                                                        src={member.logo}
                                                                                        sx={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 1, border: '1px solid #e5e7eb' }}
                                                                                    />
                                                                                )}
                                                                                <Button
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    component="label"
                                                                                    startIcon={<UploadFileIcon />}
                                                                                    sx={{ fontSize: '0.7rem' }}
                                                                                >
                                                                                    Logo
                                                                                    <input
                                                                                        type="file"
                                                                                        hidden
                                                                                        accept="image/*"
                                                                                        onChange={async (e) => {
                                                                                            const file = e.target.files[0];
                                                                                            if (!file) return;
                                                                                            try {
                                                                                                const formData = new FormData();
                                                                                                formData.append('logo', file);
                                                                                                formData.append('section_index', sectionIndex);
                                                                                                formData.append('member_index', memberIndex);
                                                                                                const response = await axios.post('/admin/settings/custom-section-logo', formData, {
                                                                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                                                                });
                                                                                                if (response.data.logo_url) {
                                                                                                    const updated = [...customSections];
                                                                                                    updated[sectionIndex].members[memberIndex].logo = response.data.logo_url;
                                                                                                    setCustomSections(updated);
                                                                                                }
                                                                                            } catch (error) {
                                                                                                console.error('Logo upload error:', error);
                                                                                                alert('Failed to upload logo');
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </Button>
                                                                                <IconButton
                                                                                    size="small"
                                                                                    color="error"
                                                                                    onClick={() => {
                                                                                        const updated = [...customSections];
                                                                                        updated[sectionIndex].members = updated[sectionIndex].members.filter((_, i) => i !== memberIndex);
                                                                                        setCustomSections(updated);
                                                                                    }}
                                                                                >
                                                                                    <DeleteIcon fontSize="small" />
                                                                                </IconButton>
                                                                            </Box>
                                                                        </Stack>
                                                                    </Paper>
                                                                </Grid>
                                                            ))}
                                                        </Grid>

                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<AddIcon />}
                                                            onClick={() => {
                                                                const updated = [...customSections];
                                                                if (!updated[sectionIndex].members) {
                                                                    updated[sectionIndex].members = [];
                                                                }
                                                                updated[sectionIndex].members.push({ name: '', country: '', logo: '' });
                                                                setCustomSections(updated);
                                                            }}
                                                            sx={{ mt: 2, borderColor: '#1abc9c', color: '#1abc9c' }}
                                                        >
                                                            Add Item
                                                        </Button>
                                                    </Paper>
                                                ))}
                                            </Stack>
                                        )}

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                                onClick={() => {
                                                    setCustomSections([
                                                        ...customSections,
                                                        {
                                                            section_label: 'NEW SECTION',
                                                            title: 'Section Title',
                                                            subtitle: 'Section description',
                                                            members: [],
                                                        },
                                                    ]);
                                                }}
                                                sx={{ borderColor: '#1abc9c', color: '#1abc9c' }}
                                            >
                                                Add New Section
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={async () => {
                                                    setSavingCustomSections(true);
                                                    try {
                                                        const settingId = getSettingId('custom_sections');
                                                        if (settingId) {
                                                            await router.patch(route('admin.settings.update', settingId), {
                                                                value: JSON.stringify(customSections),
                                                            }, { preserveScroll: true });
                                                        } else {
                                                            await router.post(route('admin.settings.store'), {
                                                                key: 'custom_sections',
                                                                value: JSON.stringify(customSections),
                                                                type: 'json',
                                                            }, { preserveScroll: true });
                                                        }
                                                        alert('Custom Sections saved successfully!');
                                                    } catch (error) {
                                                        console.error('Save error:', error);
                                                        alert('Failed to save Custom Sections');
                                                    } finally {
                                                        setSavingCustomSections(false);
                                                    }
                                                }}
                                                disabled={savingCustomSections}
                                                sx={{
                                                    backgroundColor: '#1abc9c',
                                                    '&:hover': { backgroundColor: '#16a085' },
                                                }}
                                            >
                                                {savingCustomSections ? 'Saving...' : 'Save Custom Sections'}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Submission Procedure Section */}
                                <Card elevation={0} sx={sectionCardSx}>
                                    <CardContent>
                                        <Typography variant="h6" sx={sectionTitleSx}>
                                            Submission Procedure
                                        </Typography>
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            Manage the submission procedure steps shown on the landing page. You can add new sections and steps.
                                        </Alert>

                                        {/* FAQ Text Settings */}
                                        <Box sx={{ mb: 3, p: 2, bgcolor: '#f9fafb', borderRadius: 1, border: '1px dashed #e5e7eb' }}>
                                            <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280', fontWeight: 600, fontSize: '0.85rem' }}>
                                                Section Text Settings
                                            </Typography>
                                            <Stack spacing={2}>
                                                <TextField
                                                    label="Section Title"
                                                    fullWidth
                                                    size="small"
                                                    value={faqText.title}
                                                    onChange={(e) => setFaqText({ ...faqText, title: e.target.value })}
                                                    placeholder="e.g. FREQUENTLY ASKED QUESTION"
                                                />
                                                <TextField
                                                    label="Section Subtitle"
                                                    fullWidth
                                                    size="small"
                                                    value={faqText.subtitle}
                                                    onChange={(e) => setFaqText({ ...faqText, subtitle: e.target.value })}
                                                    placeholder="e.g. Follow these simple steps to submit your abstract..."
                                                />
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={saveFaqText}
                                                    disabled={savingFaqText}
                                                    sx={{ alignSelf: 'flex-start', backgroundColor: '#1abc9c', '&:hover': { backgroundColor: '#16a085' } }}
                                                >
                                                    {savingFaqText ? 'Saving...' : 'Save Text Settings'}
                                                </Button>
                                            </Stack>
                                        </Box>

                                        {/* Section Background Image Upload */}
                                        <Box sx={{ mb: 3, p: 2, bgcolor: '#f9fafb', borderRadius: 1, border: '1px dashed #e5e7eb' }}>
                                            <Typography variant="subtitle2" sx={{ mb: 1, color: '#6b7280', fontWeight: 600, fontSize: '0.85rem' }}>
                                                Section Background Image
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                                {faqBackground.url && (
                                                    <Box
                                                        component="img"
                                                        src={faqBackground.url}
                                                        sx={{ width: 120, height: 70, objectFit: 'cover', borderRadius: 1, border: '1px solid #e5e7eb' }}
                                                    />
                                                )}
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    component="label"
                                                    startIcon={<UploadFileIcon />}
                                                    disabled={uploadingFaqBackground}
                                                    sx={{ borderColor: '#1abc9c', color: '#1abc9c' }}
                                                >
                                                    {uploadingFaqBackground ? 'Uploading...' : (faqBackground.url ? 'Change Background' : 'Upload Background')}
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={(e) => handleFaqBackgroundUpload(e.target.files[0])}
                                                    />
                                                </Button>
                                                {faqBackground.url && (
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        color="error"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={removeFaqBackground}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </Box>
                                            {faqBackground.filename && (
                                                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#9ca3af' }}>
                                                    Current: {faqBackground.filename}
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Dynamic Sections */}
                                        {submissionProcedure.map((section, sectionIndex) => (
                                            <Box key={sectionIndex} sx={{ mb: 4, p: 2, bgcolor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                                                {/* Section Header */}
                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                                    <TextField
                                                        value={section.title}
                                                        onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                                                        size="small"
                                                        sx={{
                                                            flex: 1,
                                                            '& .MuiOutlinedInput-root': {
                                                                fontWeight: 600,
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#1abc9c',
                                                                },
                                                            },
                                                        }}
                                                        placeholder="Section Title"
                                                    />
                                                    <IconButton
                                                        onClick={() => removeSubmissionProcedureSection(sectionIndex)}
                                                        color="error"
                                                        disabled={submissionProcedure.length <= 1}
                                                        title="Remove Section"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>

                                                {/* Section Items */}
                                                <Stack spacing={2}>
                                                    {section.items.map((item, itemIndex) => (
                                                        <Box key={itemIndex} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                            <TextField
                                                                fullWidth
                                                                label={`Step ${itemIndex + 1} Text`}
                                                                value={item.text}
                                                                onChange={(e) => updateSubmissionProcedure(sectionIndex, itemIndex, 'text', e.target.value)}
                                                                size="small"
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        '&.Mui-focused fieldset': {
                                                                            borderColor: '#1abc9c',
                                                                        },
                                                                    },
                                                                }}
                                                            />
                                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', minWidth: 220 }}>
                                                                <Button
                                                                    variant="outlined"
                                                                    component="label"
                                                                    size="small"
                                                                    startIcon={<UploadFileIcon />}
                                                                    disabled={uploadingProcedurePdf === `${sectionIndex}_${itemIndex}`}
                                                                    sx={{
                                                                        borderColor: item.link ? '#1abc9c' : '#ccc',
                                                                        color: item.link ? '#1abc9c' : '#666',
                                                                        minWidth: 120,
                                                                        '&:hover': { borderColor: '#16a085' },
                                                                    }}
                                                                >
                                                                    {uploadingProcedurePdf === `${sectionIndex}_${itemIndex}` ? 'Uploading...' : (item.filename || 'Upload PDF')}
                                                                    <input
                                                                        type="file"
                                                                        hidden
                                                                        accept=".pdf"
                                                                        onChange={(e) => handleSubmissionProcedurePdfUpload(sectionIndex, itemIndex, e.target.files[0])}
                                                                    />
                                                                </Button>
                                                                {item.link && (
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => window.open(item.link, '_blank')}
                                                                        sx={{ color: '#1abc9c' }}
                                                                        title="View PDF"
                                                                    >
                                                                        <DescriptionIcon fontSize="small" />
                                                                    </IconButton>
                                                                )}
                                                            </Box>
                                                            <IconButton
                                                                onClick={() => removeSubmissionProcedureItem(sectionIndex, itemIndex)}
                                                                color="error"
                                                                disabled={section.items.length <= 1}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    ))}
                                                    <Button
                                                        startIcon={<AddIcon />}
                                                        variant="outlined"
                                                        onClick={() => addSubmissionProcedureItem(sectionIndex)}
                                                        sx={{
                                                            alignSelf: 'flex-start',
                                                            borderColor: '#1abc9c',
                                                            color: '#1abc9c',
                                                            '&:hover': { borderColor: '#16a085', backgroundColor: 'rgba(26, 188, 156, 0.04)' }
                                                        }}
                                                    >
                                                        Add Step
                                                    </Button>
                                                </Stack>
                                            </Box>
                                        ))}

                                        {/* Add Section Button */}
                                        <Button
                                            startIcon={<AddIcon />}
                                            variant="contained"
                                            onClick={addSubmissionProcedureSection}
                                            sx={{
                                                mb: 3,
                                                backgroundColor: '#0d7a6a',
                                                '&:hover': { backgroundColor: '#095c50' }
                                            }}
                                        >
                                            Add New Section
                                        </Button>

                                        {/* Save Button */}
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                onClick={saveSubmissionProcedure}
                                                disabled={savingSubmissionProcedure}
                                                sx={{
                                                    backgroundColor: '#1abc9c',
                                                    '&:hover': { backgroundColor: '#16a085' },
                                                }}
                                            >
                                                {savingSubmissionProcedure ? 'Saving...' : 'Save Submission Procedure'}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>


                                {/* Timeline Section */}
                                <Card elevation={0} sx={sectionCardSx}>
                                    <CardContent>
                                        <Typography variant="h6" sx={sectionTitleSx}>
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

                            <Card elevation={0} sx={sectionCardSx}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box component="form" onSubmit={handleDeadlineSubmit}>
                                        <Stack spacing={3}>
                                            {/* Enable/Disable Toggle */}
                                            <Box>
                                                <Typography variant="h6" sx={sectionTitleSx}>
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
                                                <Typography variant="h6" sx={sectionTitleSx}>
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
                                                        InputLabelProps={{ shrink: true }}
                                                        sx={inputSx}
                                                    />

                                                    <TextField
                                                        fullWidth
                                                        type="datetime-local"
                                                        label="End Date & Time"
                                                        value={deadlineData.submission_deadline_end}
                                                        onChange={(e) => setDeadlineData('submission_deadline_end', e.target.value)}
                                                        error={!!deadlineErrors.submission_deadline_end}
                                                        helperText={deadlineErrors.submission_deadline_end || 'When submissions will close (leave empty for no end restriction)'}
                                                        InputLabelProps={{ shrink: true }}
                                                        sx={inputSx}
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
                                                        color: c.textMuted,
                                                        borderColor: c.cardBorder,
                                                        borderRadius: '10px',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        '&:hover': {
                                                            borderColor: '#1abc9c',
                                                            backgroundColor: isDark ? 'rgba(26,188,156,0.06)' : '#f9fafb',
                                                        },
                                                    }}
                                                >
                                                    Reset
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disabled={processingDeadline}
                                                    sx={tealBtnSx}
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
                </Card>
            </Box>
        </SidebarLayout>
    );
}
