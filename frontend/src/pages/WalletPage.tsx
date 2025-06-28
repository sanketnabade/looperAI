import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    AccountBalanceWallet,
    CreditCard,
    TrendingUp,
    TrendingDown,
    Add,
    MoreVert,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';

// Mock data for wallet accounts
const walletAccounts = [
    {
        id: '1',
        name: 'Main Checking',
        type: 'checking',
        balance: 12543.67,
        currency: 'USD',
        accountNumber: '****1234',
        bank: 'Chase Bank',
        color: '#00D4FF',
    },
    {
        id: '2',
        name: 'Savings Account',
        type: 'savings',
        balance: 25678.90,
        currency: 'USD',
        accountNumber: '****5678',
        bank: 'Bank of America',
        color: '#22C55E',
    },
    {
        id: '3',
        name: 'Business Account',
        type: 'business',
        balance: 8932.45,
        currency: 'USD',
        accountNumber: '****9012',
        bank: 'Wells Fargo',
        color: '#F59E0B',
    },
    {
        id: '4',
        name: 'Credit Card',
        type: 'credit',
        balance: -2156.78,
        currency: 'USD',
        accountNumber: '****3456',
        bank: 'Capital One',
        color: '#EF4444',
    },
];

// Mock data for recent transactions
const recentTransactions = [
    {
        id: '1',
        description: 'Grocery Store',
        amount: -89.50,
        account: 'Main Checking',
        date: '2025-06-28',
        category: 'Food',
    },
    {
        id: '2',
        description: 'Salary Deposit',
        amount: 3200.00,
        account: 'Main Checking',
        date: '2025-06-28',
        category: 'Income',
    },
    {
        id: '3',
        description: 'Transfer to Savings',
        amount: -500.00,
        account: 'Main Checking',
        date: '2025-06-27',
        category: 'Transfer',
    },
    {
        id: '4',
        description: 'Online Purchase',
        amount: -156.99,
        account: 'Credit Card',
        date: '2025-06-27',
        category: 'Shopping',
    },
];

export const WalletPage: React.FC = () => {
    const [balanceVisible, setBalanceVisible] = useState(true);
    const [addAccountOpen, setAddAccountOpen] = useState(false);
    const [newAccount, setNewAccount] = useState({
        name: '',
        type: 'checking',
        balance: '',
        bank: '',
    });

    const totalBalance = walletAccounts.reduce((sum, account) => sum + account.balance, 0);
    const totalAssets = walletAccounts.filter(acc => acc.balance > 0).reduce((sum, acc) => sum + acc.balance, 0);
    const totalLiabilities = Math.abs(walletAccounts.filter(acc => acc.balance < 0).reduce((sum, acc) => sum + acc.balance, 0));

    const handleAddAccount = () => {
        // In a real app, this would make an API call
        console.log('Adding account:', newAccount);
        setAddAccountOpen(false);
        setNewAccount({ name: '', type: 'checking', balance: '', bank: '' });
    };

    const getAccountTypeIcon = (type: string) => {
        switch (type) {
            case 'credit':
                return <CreditCard />;
            default:
                return <AccountBalanceWallet />;
        }
    };

    const getAccountTypeColor = (type: string) => {
        switch (type) {
            case 'checking':
                return '#00D4FF';
            case 'savings':
                return '#22C55E';
            case 'business':
                return '#F59E0B';
            case 'credit':
                return '#EF4444';
            default:
                return '#64748B';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                    Wallet
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setAddAccountOpen(true)}
                    sx={{
                        background: 'linear-gradient(135deg, #00D4FF 0%, #22C55E 100%)',
                        textTransform: 'none',
                    }}
                >
                    Add Account
                </Button>
            </Box>

            {/* Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ color: '#CBD5E1' }}>
                                    Total Balance
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => setBalanceVisible(!balanceVisible)}
                                    sx={{ color: '#CBD5E1' }}
                                >
                                    {balanceVisible ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </Box>
                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                                {balanceVisible ? `$${totalBalance.toLocaleString()}` : '****'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TrendingUp sx={{ color: '#22C55E', fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2" sx={{ color: '#22C55E' }}>
                                    +2.5% from last month
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: '#CBD5E1', mb: 2 }}>
                                Total Assets
                            </Typography>
                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                                {balanceVisible ? `$${totalAssets.toLocaleString()}` : '****'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TrendingUp sx={{ color: '#22C55E', fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2" sx={{ color: '#22C55E' }}>
                                    +1.8% from last month
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: '#CBD5E1', mb: 2 }}>
                                Total Liabilities
                            </Typography>
                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                                {balanceVisible ? `$${totalLiabilities.toLocaleString()}` : '****'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TrendingDown sx={{ color: '#EF4444', fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2" sx={{ color: '#EF4444' }}>
                                    +0.3% from last month
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Accounts */}
                <Grid item xs={12} lg={8}>
                    <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                                Accounts
                            </Typography>
                            <Grid container spacing={2}>
                                {walletAccounts.map((account) => (
                                    <Grid item xs={12} sm={6} key={account.id}>
                                        <Card sx={{ backgroundColor: '#0F172A', border: '1px solid #334155' }}>
                                            <CardContent sx={{ p: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', mb: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box
                                                            sx={{
                                                                p: 1,
                                                                backgroundColor: getAccountTypeColor(account.type) + '20',
                                                                borderRadius: 1,
                                                                color: getAccountTypeColor(account.type),
                                                            }}
                                                        >
                                                            {getAccountTypeIcon(account.type)}
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 500 }}>
                                                                {account.name}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#64748B' }}>
                                                                {account.bank} • {account.accountNumber}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <IconButton size="small" sx={{ color: '#64748B' }}>
                                                        <MoreVert />
                                                    </IconButton>
                                                </Box>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="h5" sx={{
                                                        color: account.balance >= 0 ? 'white' : '#EF4444',
                                                        fontWeight: 600
                                                    }}>
                                                        {balanceVisible
                                                            ? `${account.balance >= 0 ? '+' : ''}$${Math.abs(account.balance).toLocaleString()}`
                                                            : '****'
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: getAccountTypeColor(account.type) + '20',
                                                        color: getAccountTypeColor(account.type),
                                                        textTransform: 'capitalize',
                                                    }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Transactions */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                                Recent Transactions
                            </Typography>
                            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                                {recentTransactions.map((transaction) => (
                                    <Box
                                        key={transaction.id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            py: 2,
                                            borderBottom: '1px solid #334155',
                                            '&:last-child': { borderBottom: 'none' },
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                                                {transaction.description}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#64748B' }}>
                                                {transaction.account} • {transaction.category}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: transaction.amount >= 0 ? '#22C55E' : 'white',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Add Account Dialog */}
            <Dialog
                open={addAccountOpen}
                onClose={() => setAddAccountOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: '#1E293B',
                        border: '1px solid #334155',
                    },
                }}
            >
                <DialogTitle sx={{ color: 'white' }}>Add New Account</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Account Name"
                            value={newAccount.name}
                            onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#334155' },
                                    '&:hover fieldset': { borderColor: '#00D4FF' },
                                    '&.Mui-focused fieldset': { borderColor: '#00D4FF' },
                                },
                                '& .MuiInputLabel-root': { color: '#CBD5E1' },
                            }}
                        />
                        <FormControl fullWidth>
                            <InputLabel sx={{ color: '#CBD5E1' }}>Account Type</InputLabel>
                            <Select
                                value={newAccount.type}
                                onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00D4FF' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00D4FF' },
                                }}
                            >
                                <MenuItem value="checking">Checking</MenuItem>
                                <MenuItem value="savings">Savings</MenuItem>
                                <MenuItem value="business">Business</MenuItem>
                                <MenuItem value="credit">Credit Card</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Initial Balance"
                            type="number"
                            value={newAccount.balance}
                            onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#334155' },
                                    '&:hover fieldset': { borderColor: '#00D4FF' },
                                    '&.Mui-focused fieldset': { borderColor: '#00D4FF' },
                                },
                                '& .MuiInputLabel-root': { color: '#CBD5E1' },
                            }}
                        />
                        <TextField
                            label="Bank Name"
                            value={newAccount.bank}
                            onChange={(e) => setNewAccount({ ...newAccount, bank: e.target.value })}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#334155' },
                                    '&:hover fieldset': { borderColor: '#00D4FF' },
                                    '&.Mui-focused fieldset': { borderColor: '#00D4FF' },
                                },
                                '& .MuiInputLabel-root': { color: '#CBD5E1' },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setAddAccountOpen(false)}
                        sx={{ color: '#CBD5E1' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddAccount}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #00D4FF 0%, #22C55E 100%)',
                        }}
                    >
                        Add Account
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WalletPage;
