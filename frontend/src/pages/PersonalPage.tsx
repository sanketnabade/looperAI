import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Person } from '@mui/icons-material';

export const PersonalPage: React.FC = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Person sx={{ color: '#00D4FF', fontSize: 32 }} />
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                    Personal
                </Typography>
            </Box>

            <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        Personal Information
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#CBD5E1' }}>
                        This page is coming soon. Here you'll be able to manage your personal profile,
                        update your information, and configure your account settings.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PersonalPage;
