import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    LinearProgress,
    Avatar,
} from '@mui/material';
import {
    Analytics,
    TrendingUp,
    TrendingDown,
    AccountBalanceWallet,
    Restaurant,
    LocalGasStation,
    Home,
    HealthAndSafety,
    School,
    SportsEsports,
} from '@mui/icons-material';
// import { Line, Bar, Doughnut } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement,
// } from 'chart.js';

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement
// );

// Mock data for analytics
// const monthlyTrends = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//         {
//             label: 'Income',
//             data: [4200, 4500, 4100, 4800, 4600, 5200],
//             borderColor: '#22C55E',
//             backgroundColor: 'rgba(34, 197, 94, 0.1)',
//             tension: 0.4,
//         },
//         {
//             label: 'Expenses',
//             data: [3200, 3100, 3400, 3300, 3700, 3500],
//             borderColor: '#EF4444',
//             backgroundColor: 'rgba(239, 68, 68, 0.1)',
//             tension: 0.4,
//         },
//     ],
// };

// const categoryData = {
//     labels: ['Food', 'Transport', 'Housing', 'Healthcare', 'Education', 'Entertainment'],
//     datasets: [
//         {
//             data: [850, 420, 1200, 320, 280, 180],
//             backgroundColor: [
//                 '#00D4FF',
//                 '#22C55E',
//                 '#F59E0B',
//                 '#EF4444',
//                 '#8B5CF6',
//                 '#EC4899',
//             ],
//             borderWidth: 0,
//         },
//     ],
// };

const spendingByCategory = [
    { category: 'Food & Dining', amount: 850, percentage: 28, icon: Restaurant, color: '#00D4FF' },
    { category: 'Housing', amount: 1200, percentage: 40, icon: Home, color: '#22C55E' },
    { category: 'Transportation', amount: 420, percentage: 14, icon: LocalGasStation, color: '#F59E0B' },
    { category: 'Healthcare', amount: 320, percentage: 11, icon: HealthAndSafety, color: '#EF4444' },
    { category: 'Education', amount: 280, percentage: 9, icon: School, color: '#8B5CF6' },
    { category: 'Entertainment', amount: 180, percentage: 6, icon: SportsEsports, color: '#EC4899' },
];

// const monthlyComparison = {
//     labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
//     datasets: [
//         {
//             label: 'This Month',
//             data: [800, 950, 1100, 850],
//             backgroundColor: '#00D4FF',
//         },
//         {
//             label: 'Last Month',
//             data: [750, 880, 920, 980],
//             backgroundColor: '#64748B',
//         },
//     ],
// };

const topMerchants = [
    { name: 'Amazon', amount: 245.67, transactions: 8, category: 'Shopping' },
    { name: 'Starbucks', amount: 89.50, transactions: 12, category: 'Food' },
    { name: 'Shell Gas Station', amount: 156.30, transactions: 6, category: 'Transport' },
    { name: 'Netflix', amount: 15.99, transactions: 1, category: 'Entertainment' },
    { name: 'Whole Foods', amount: 198.45, transactions: 4, category: 'Groceries' },
];

export const AnalyticsPage: React.FC = () => {
    const [timeRange, setTimeRange] = useState('6months');
    const [viewType, setViewType] = useState('overview');

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                    Analytics
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel sx={{ color: '#CBD5E1' }}>Time Range</InputLabel>
                        <Select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            sx={{
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00D4FF' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00D4FF' },
                            }}
                        >
                            <MenuItem value="1month">1 Month</MenuItem>
                            <MenuItem value="3months">3 Months</MenuItem>
                            <MenuItem value="6months">6 Months</MenuItem>
                            <MenuItem value="1year">1 Year</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel sx={{ color: '#CBD5E1' }}>View</InputLabel>
                        <Select
                            value={viewType}
                            onChange={(e) => setViewType(e.target.value)}
                            sx={{
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00D4FF' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00D4FF' },
                            }}
                        >
                            <MenuItem value="overview">Overview</MenuItem>
                            <MenuItem value="categories">Categories</MenuItem>
                            <MenuItem value="trends">Trends</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: '#22C55E20',
                                        borderRadius: 2,
                                        color: '#22C55E',
                                    }}
                                >
                                    <TrendingUp />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                                        Total Income
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                                        $5,200
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#22C55E' }}>
                                        +13% vs last month
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: '#EF444420',
                                        borderRadius: 2,
                                        color: '#EF4444',
                                    }}
                                >
                                    <TrendingDown />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                                        Total Expenses
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                                        $3,500
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#EF4444' }}>
                                        -5% vs last month
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: '#00D4FF20',
                                        borderRadius: 2,
                                        color: '#00D4FF',
                                    }}
                                >
                                    <AccountBalanceWallet />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                                        Net Worth
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                                        $1,700
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#00D4FF' }}>
                                        +32% vs last month
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: '#F59E0B20',
                                        borderRadius: 2,
                                        color: '#F59E0B',
                                    }}
                                >
                                    <Analytics />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                                        Savings Rate
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                                        32.7%
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#F59E0B' }}>
                                        +2.1% vs last month
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Income vs Expenses Trend */}
                <Grid item xs={12} lg={8}>
                    <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                                Income vs Expenses Trend
                            </Typography>
                            <Box sx={{
                                height: 300,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#0F172A',
                                borderRadius: 1,
                                border: '1px solid #334155'
                            }}>
                                <Typography sx={{ color: '#64748B' }}>
                                    Income vs Expenses Chart
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Category Breakdown */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                                Spending by Category
                            </Typography>
                            <Box sx={{
                                height: 300,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#0F172A',
                                borderRadius: 1,
                                border: '1px solid #334155'
                            }}>
                                <Typography sx={{ color: '#64748B' }}>
                                    Category Breakdown Chart
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Detailed Category Breakdown */}
                <Grid item xs={12} lg={6}>
                    <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                                Category Analysis
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {spendingByCategory.map((category, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box
                                            sx={{
                                                p: 1,
                                                backgroundColor: category.color + '20',
                                                borderRadius: 1,
                                                color: category.color,
                                            }}
                                        >
                                            <category.icon fontSize="small" />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="body1" sx={{ color: 'white' }}>
                                                    {category.category}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                                                    ${category.amount}
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={category.percentage}
                                                sx={{
                                                    height: 6,
                                                    borderRadius: 3,
                                                    backgroundColor: '#334155',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: category.color,
                                                    },
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                                                {category.percentage}% of total spending
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Weekly Comparison */}
                <Grid item xs={12} lg={6}>
                    <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                                Weekly Spending Comparison
                            </Typography>
                            <Box sx={{
                                height: 300,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#0F172A',
                                borderRadius: 1,
                                border: '1px solid #334155'
                            }}>
                                <Typography sx={{ color: '#64748B' }}>
                                    Weekly Comparison Chart
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Top Merchants */}
                <Grid item xs={12}>
                    <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                                Top Merchants
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: '#CBD5E1', borderColor: '#334155' }}>
                                                Merchant
                                            </TableCell>
                                            <TableCell sx={{ color: '#CBD5E1', borderColor: '#334155' }}>
                                                Category
                                            </TableCell>
                                            <TableCell sx={{ color: '#CBD5E1', borderColor: '#334155' }}>
                                                Transactions
                                            </TableCell>
                                            <TableCell sx={{ color: '#CBD5E1', borderColor: '#334155' }} align="right">
                                                Total Spent
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {topMerchants.map((merchant, index) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ color: 'white', borderColor: '#334155' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                backgroundColor: '#00D4FF20',
                                                                color: '#00D4FF',
                                                                fontSize: '0.75rem',
                                                            }}
                                                        >
                                                            {merchant.name[0]}
                                                        </Avatar>
                                                        {merchant.name}
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ borderColor: '#334155' }}>
                                                    <Chip
                                                        label={merchant.category}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: '#00D4FF20',
                                                            color: '#00D4FF',
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ color: '#CBD5E1', borderColor: '#334155' }}>
                                                    {merchant.transactions}
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderColor: '#334155' }} align="right">
                                                    ${merchant.amount.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsPage;
