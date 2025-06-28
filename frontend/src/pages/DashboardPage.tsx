import React, { useMemo } from 'react';
import {
    Box,
    Typography,
    Grid,
    Skeleton,
    TextField,
    InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from '../components/StatsCard';
import { TransactionList } from '../components/TransactionList';
import { RevenueExpenseChart } from '../components/RevenueExpenseChart';
import { dashboardService } from '../services/dashboard.service';

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const getMonthKey = (date: Date): string => {
    return date.toLocaleString('en-US', { month: 'short' });
};

export const DashboardPage: React.FC = () => {
    const { data: metrics, isLoading, error } = useQuery(
        ['dashboardMetrics'],
        () => dashboardService.getMetrics()
    );

    const chartData = useMemo(() => {
        if (!metrics?.recentTransactions?.length) {
            // Return sample data for the chart
            return [
                { month: 'Jan', income: 400, expenses: 200 },
                { month: 'Feb', income: 500, expenses: 300 },
                { month: 'Mar', income: 350, expenses: 400 },
                { month: 'Apr', income: 600, expenses: 250 },
                { month: 'May', income: 224, expenses: 400 },
                { month: 'Jun', income: 750, expenses: 300 },
                { month: 'Jul', income: 500, expenses: 350 },
                { month: 'Aug', income: 650, expenses: 400 },
                { month: 'Sep', income: 800, expenses: 300 },
                { month: 'Oct', income: 600, expenses: 450 },
                { month: 'Nov', income: 700, expenses: 350 },
                { month: 'Dec', income: 500, expenses: 300 },
            ];
        }

        // Process real transaction data
        const monthlyTotals = new Map<string, { income: number; expenses: number }>();

        metrics.recentTransactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthKey = getMonthKey(date);

            if (!monthlyTotals.has(monthKey)) {
                monthlyTotals.set(monthKey, { income: 0, expenses: 0 });
            }

            const monthData = monthlyTotals.get(monthKey)!;
            if (transaction.category === 'Revenue') {
                monthData.income += transaction.amount;
            } else {
                monthData.expenses += Math.abs(transaction.amount);
            }
        });

        return Array.from(monthlyTotals.entries()).map(([month, data]) => ({
            month,
            income: data.income,
            expenses: data.expenses
        }));
    }, [metrics?.recentTransactions]);

    if (error) {
        return (
            <Box>
                <Typography variant="h4" sx={{ mb: 3, color: 'white' }}>
                    Dashboard
                </Typography>
                <Typography color="error">
                    Error loading dashboard data. Please try again later.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header with Search */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                    Dashboard
                </Typography>
                <TextField
                    placeholder="Search..."
                    size="small"
                    sx={{
                        width: 300,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#1E293B',
                            border: '1px solid #334155',
                            borderRadius: 2,
                            '& fieldset': {
                                border: 'none',
                            },
                            '&:hover fieldset': {
                                border: 'none',
                            },
                            '&.Mui-focused fieldset': {
                                border: '1px solid #00D4FF',
                            },
                        },
                        '& .MuiInputBase-input': {
                            color: 'white',
                            '&::placeholder': {
                                color: '#94A3B8',
                                opacity: 1,
                            },
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: '#94A3B8' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} lg={3}>
                    {isLoading ? (
                        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
                    ) : (
                        <StatsCard
                            title="Balance"
                            value={formatCurrency(metrics?.netIncome ?? 41210)}
                            type="balance"
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    {isLoading ? (
                        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
                    ) : (
                        <StatsCard
                            title="Revenue"
                            value={formatCurrency(metrics?.totalRevenue ?? 41210)}
                            type="revenue"
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    {isLoading ? (
                        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
                    ) : (
                        <StatsCard
                            title="Expenses"
                            value={formatCurrency(Math.abs(metrics?.totalExpenses ?? 41210))}
                            type="expenses"
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    {isLoading ? (
                        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
                    ) : (
                        <StatsCard
                            title="Savings"
                            value={formatCurrency((metrics?.totalRevenue ?? 41210) - Math.abs(metrics?.totalExpenses ?? 0))}
                            type="savings"
                        />
                    )}
                </Grid>
            </Grid>

            {/* Chart and Transactions */}
            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    {isLoading ? (
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
                    ) : (
                        <RevenueExpenseChart data={chartData} />
                    )}
                </Grid>
                <Grid item xs={12} lg={4}>
                    {isLoading ? (
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
                    ) : (
                        <TransactionList
                            transactions={metrics?.recentTransactions?.slice(0, 5) ?? []}
                            title="Recent Transaction"
                            showSeeAll={true}
                        />
                    )}
                </Grid>
            </Grid>

            {/* Full Transaction List */}
            <Box sx={{ mt: 4 }}>
                {isLoading ? (
                    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
                ) : (
                    <TransactionList
                        transactions={metrics?.recentTransactions ?? []}
                        title="Transactions"
                        showSeeAll={false}
                    />
                )}
            </Box>
        </Box>
    );
};
