import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { Transaction } from '@financial-dashboard/shared';
import { transactionService } from '../services/transaction.service';
import { useQuery } from '@tanstack/react-query';
import TransactionModal from '../components/TransactionModal';
import { TransactionList } from '../components/TransactionList';

const TransactionsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | undefined>();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: transactionResponse, error, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getTransactions(),
  });

  const transactions = transactionResponse?.transactions || [];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(undefined);
  };

  const filteredTransactions = React.useMemo(() => {
    if (!transactions || !searchTerm) return transactions || [];

    return transactions.filter((transaction: Transaction) =>
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm)
    );
  }, [transactions, searchTerm]);

  if (error) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3, color: 'white' }}>
          Transactions
        </Typography>
        <Typography color="error">
          Error loading transactions. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
          Transactions
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsModalOpen(true)}
          sx={{
            backgroundColor: '#00D4FF',
            color: 'white',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#0099B2',
            },
          }}
        >
          New Transaction
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 4 }}>
        <TextField
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: 400,
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
        />
      </Box>

      {/* Transactions List */}
      {isLoading ? (
        <Card
          sx={{
            backgroundColor: '#1E293B',
            border: '1px solid #334155',
            borderRadius: 3,
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ color: '#94A3B8' }}>Loading transactions...</Typography>
          </CardContent>
        </Card>
      ) : filteredTransactions.length > 0 ? (
        <TransactionList
          transactions={filteredTransactions}
          title="All Transactions"
          showSeeAll={false}
        />
      ) : (
        <Card
          sx={{
            backgroundColor: '#1E293B',
            border: '1px solid #334155',
            borderRadius: 3,
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              No transactions found
            </Typography>
            <Typography sx={{ color: '#94A3B8', mb: 3 }}>
              Get started by creating your first transaction
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setIsModalOpen(true)}
              sx={{
                backgroundColor: '#00D4FF',
                color: 'white',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#0099B2',
                },
              }}
            >
              Add Transaction
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={selectedTransaction}
      />
    </Box>
  );
};

export default TransactionsPage;
