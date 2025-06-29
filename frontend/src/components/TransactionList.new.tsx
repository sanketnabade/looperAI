import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { Transaction } from '../../../shared/src/index.ts';
import { format } from 'date-fns';

interface TransactionListProps {
    transactions: Transaction[];
    title?: string;
    showSeeAll?: boolean;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Paid':
            return { color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)' };
        case 'Pending':
            return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
        default:
            return { color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)' };
    }
};

export const TransactionList: React.FC<TransactionListProps> = ({
    transactions,
    title = "Recent Transaction",
    showSeeAll = true
}) => {
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'white',
                            fontWeight: 600,
                        }}
                    >
                        {title}
                    </Typography>
                    {showSeeAll && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#00D4FF',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            See all
                        </Typography>
                    )}
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: '#94A3B8', border: 'none', fontSize: '0.875rem', pb: 2 }}>
                                    Name
                                </TableCell>
                                <TableCell sx={{ color: '#94A3B8', border: 'none', fontSize: '0.875rem', pb: 2 }}>
                                    Date
                                </TableCell>
                                <TableCell sx={{ color: '#94A3B8', border: 'none', fontSize: '0.875rem', pb: 2 }}>
                                    Amount
                                </TableCell>
                                <TableCell sx={{ color: '#94A3B8', border: 'none', fontSize: '0.875rem', pb: 2 }}>
                                    Status
                                </TableCell>
                                <TableCell sx={{ border: 'none', pb: 2 }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((transaction) => {
                                const statusStyle = getStatusColor(transaction.status);
                                return (
                                    <TableRow key={transaction.id}>
                                        <TableCell sx={{ border: 'none', py: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar
                                                    src={transaction.user_profile}
                                                    sx={{ width: 40, height: 40 }}
                                                >
                                                    {transaction.user_id?.toString().charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'white',
                                                        fontWeight: 500,
                                                        fontSize: '0.875rem',
                                                    }}
                                                >
                                                    User {transaction.user_id?.toString().slice(-4)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ border: 'none', py: 2 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#94A3B8',
                                                    fontSize: '0.875rem',
                                                }}
                                            >
                                                {format(new Date(transaction.date), 'E,d MMM yyyy')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ border: 'none', py: 2 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: transaction.category === 'Revenue' ? '#22C55E' : '#EF4444',
                                                    fontWeight: 600,
                                                    fontSize: '0.875rem',
                                                }}
                                            >
                                                {transaction.category === 'Revenue' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ border: 'none', py: 2 }}>
                                            <Chip
                                                label={transaction.status}
                                                size="small"
                                                sx={{
                                                    backgroundColor: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500,
                                                    border: 'none',
                                                    height: 24,
                                                    '& .MuiChip-label': {
                                                        px: 1.5,
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ border: 'none', py: 2, width: 40 }}>
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    color: '#94A3B8',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(148, 163, 184, 0.1)',
                                                    },
                                                }}
                                            >
                                                <MoreVert fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};
