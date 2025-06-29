import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, FileDownload, CheckCircle } from '@mui/icons-material';
import { Transaction } from '@financial-dashboard/shared';
import { transactionService } from '../services/transaction.service';
import { useQuery } from '@tanstack/react-query';
import TransactionModal from '../components/TransactionModal';
import ExportModal from '../components/ExportModal';
import { TransactionList } from '../components/TransactionList';

const TransactionsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | undefined>();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [exportSuccess, setExportSuccess] = React.useState(false);
  const [exportMessage, setExportMessage] = React.useState('');

  const { data: transactionResponse, error, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getTransactions(),
  });

  const transactions = transactionResponse?.transactions || [];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(undefined);
  };

  const handleExportComplete = () => {
    setExportMessage('CSV export completed successfully! Check your downloads folder.');
    setExportSuccess(true);
    console.log('Export completed successfully');
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={() => setIsExportModalOpen(true)}
            sx={{
              borderColor: '#334155',
              color: '#94A3B8',
              '&:hover': {
                borderColor: '#00D4FF',
                color: '#00D4FF',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
              },
            }}
          >
            Export CSV
            {transactions.length > 0 && (
              <Typography component="span" sx={{ ml: 1, fontSize: '0.75rem', opacity: 0.7 }}>
                ({transactions.length} records)
              </Typography>
            )}
          </Button>
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

      {/* Export Modal */}
      <ExportModal
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportComplete={handleExportComplete}
      />

      {/* Export Success Snackbar */}
      <Snackbar
        open={exportSuccess}
        autoHideDuration={4000}
        onClose={() => setExportSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setExportSuccess(false)}
          severity="success"
          sx={{
            width: '100%',
            backgroundColor: '#22C55E',
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' }
          }}
          icon={<CheckCircle />}
        >
          {exportMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TransactionsPage;
