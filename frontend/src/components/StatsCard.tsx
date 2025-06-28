import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import {
    AccountBalanceWallet,
    TrendingUp,
    TrendingDown,
    Savings,
} from '@mui/icons-material';

interface StatsCardProps {
    title: string;
    value: string;
    type: 'balance' | 'revenue' | 'expenses' | 'savings';
    color?: string;
}

const getIcon = (type: string) => {
    switch (type) {
        case 'balance':
            return <AccountBalanceWallet />;
        case 'revenue':
            return <TrendingUp />;
        case 'expenses':
            return <TrendingDown />;
        case 'savings':
            return <Savings />;
        default:
            return <AccountBalanceWallet />;
    }
};

const getColors = (type: string) => {
    switch (type) {
        case 'balance':
            return { bg: 'rgba(0, 212, 255, 0.1)', color: '#00D4FF' };
        case 'revenue':
            return { bg: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' };
        case 'expenses':
            return { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' };
        case 'savings':
            return { bg: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' };
        default:
            return { bg: 'rgba(0, 212, 255, 0.1)', color: '#00D4FF' };
    }
};

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, type }) => {
    const colors = getColors(type);

    return (
        <Card
            sx={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: 3,
                boxShadow: 'none',
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            backgroundColor: colors.bg,
                            color: colors.color,
                            width: 48,
                            height: 48,
                        }}
                    >
                        {getIcon(type)}
                    </Avatar>
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#94A3B8',
                                fontSize: '0.875rem',
                                mb: 0.5,
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '1.875rem',
                            }}
                        >
                            {value}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
