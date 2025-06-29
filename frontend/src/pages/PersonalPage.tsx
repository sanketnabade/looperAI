import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Avatar,
    Stack,
    Alert,
    Snackbar,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { Person, PhotoCamera, Save } from '@mui/icons-material';
import { useAuthStore } from '../store/auth.store';
import { profileService } from '../services/profile.service';

export const PersonalPage: React.FC = () => {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        profile: user?.profile || '',
    });

    const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
        setToastMessage(message);
        setToastSeverity(severity);
        setToastOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast('File size must be less than 5MB', 'error');
            return;
        }

        try {
            setUploadingAvatar(true);
            const response = await profileService.uploadAvatar(file);
            setFormData(prev => ({ ...prev, profile: response.url }));
            showToast('Avatar uploaded successfully');
        } catch (error) {
            console.error('Avatar upload error:', error);
            showToast('Failed to upload avatar', 'error');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            showToast('Name is required', 'error');
            return;
        }

        if (!formData.email.trim()) {
            showToast('Email is required', 'error');
            return;
        }

        try {
            setIsLoading(true);
            await profileService.updateProfile({
                name: formData.name.trim(),
                email: formData.email.trim(),
                profile: formData.profile,
            });

            // Update the auth store with new user data
            useAuthStore.setState(state => ({
                ...state,
                user: state.user ? {
                    ...state.user,
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    profile: formData.profile,
                } : null
            }));

            setIsEditing(false);
            showToast('Profile updated successfully');
        } catch (error: any) {
            console.error('Profile update error:', error);
            showToast(error.response?.data?.error || 'Failed to update profile', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            profile: user?.profile || '',
        });
        setIsEditing(false);
    };

    return (
        <>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Person sx={{ color: '#00D4FF', fontSize: 32 }} />
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                        Personal Profile
                    </Typography>
                </Box>

                <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Stack spacing={4}>
                            {/* Avatar Section */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        src={formData.profile}
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            fontSize: '3rem',
                                            backgroundColor: '#334155',
                                        }}
                                    >
                                        {formData.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    {isEditing && (
                                        <IconButton
                                            component="label"
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                backgroundColor: '#00D4FF',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#0099CC',
                                                },
                                                width: 40,
                                                height: 40,
                                            }}
                                            disabled={uploadingAvatar}
                                        >
                                            {uploadingAvatar ? (
                                                <CircularProgress size={20} sx={{ color: 'white' }} />
                                            ) : (
                                                <PhotoCamera />
                                            )}
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                            />
                                        </IconButton>
                                    )}
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                                        {user?.name || 'Your Name'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#94A3B8' }}>
                                        {user?.email || 'your@email.com'}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Form Fields */}
                            <Stack spacing={3}>
                                <TextField
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    required
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: isEditing ? '#0F172A' : 'transparent',
                                            '& fieldset': {
                                                borderColor: '#334155',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: isEditing ? '#475569' : '#334155',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#00D4FF',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#94A3B8',
                                            '&.Mui-focused': {
                                                color: '#00D4FF',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiInputBase-input.Mui-disabled': {
                                            WebkitTextFillColor: '#CBD5E1',
                                        },
                                    }}
                                />

                                <TextField
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    required
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: isEditing ? '#0F172A' : 'transparent',
                                            '& fieldset': {
                                                borderColor: '#334155',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: isEditing ? '#475569' : '#334155',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#00D4FF',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#94A3B8',
                                            '&.Mui-focused': {
                                                color: '#00D4FF',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiInputBase-input.Mui-disabled': {
                                            WebkitTextFillColor: '#CBD5E1',
                                        },
                                    }}
                                />
                            </Stack>

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                {isEditing ? (
                                    <>
                                        <Button
                                            onClick={handleCancel}
                                            sx={{
                                                color: '#94A3B8',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(148, 163, 184, 0.1)',
                                                },
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            variant="contained"
                                            disabled={isLoading}
                                            startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
                                            sx={{
                                                backgroundColor: '#00D4FF',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#0099CC',
                                                },
                                                '&.Mui-disabled': {
                                                    backgroundColor: '#334155',
                                                    color: '#94A3B8',
                                                },
                                            }}
                                        >
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#00D4FF',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#0099CC',
                                            },
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>

            <Snackbar
                open={toastOpen}
                autoHideDuration={6000}
                onClose={() => setToastOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setToastOpen(false)}
                    severity={toastSeverity}
                    sx={{
                        backgroundColor: toastSeverity === 'success' ? '#065F46' : '#7F1D1D',
                        color: 'white',
                        '& .MuiAlert-icon': {
                            color: toastSeverity === 'success' ? '#10B981' : '#EF4444',
                        },
                    }}
                >
                    {toastMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default PersonalPage;
