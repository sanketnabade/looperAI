import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Settings } from '@mui/icons-material';

export const SettingsPage: React.FC = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Settings sx={{ color: '#00D4FF', fontSize: 32 }} />
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                    Settings
                </Typography>
            </Box>

            <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        Application Settings
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#CBD5E1' }}>
                        This page is coming soon. Here you'll be able to configure application preferences, 
                        privacy settings, notifications, and account security options.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SettingsPage;
