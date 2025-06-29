import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    IconButton,
    Alert,
    Snackbar,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Transaction } from '@financial-dashboard/shared';
import { transactionService } from '../services/transaction.service';
import { useQueryClient } from '@tanstack/react-query';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction?: Transaction;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
    isOpen,
    onClose,
    transaction,
}) => {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [toastOpen, setToastOpen] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastSeverity, setToastSeverity] = React.useState<'success' | 'error'>('success');

    const [formData, setFormData] = React.useState<{
        amount: string;
        category: 'Revenue' | 'Expense';
        status: 'Paid' | 'Pending';
        date: string;
        user_profile: string;
        user_id: string;
    }>({
        amount: '',
        category: 'Expense',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        user_profile: '', // This will be set from the current user
        user_id: '', // This will be set from the current user
    });

    React.useEffect(() => {
        if (transaction) {
            setFormData({
                amount: transaction.amount.toString(),
                category: transaction.category,
                status: transaction.status,
                date: new Date(transaction.date).toISOString().split('T')[0],
                user_profile: transaction.user_profile ?? '',
                user_id: transaction.user_id.toString(),
            });
        }
    }, [transaction]);

    const showToast = (message: string, severity: 'success' | 'error') => {
        setToastMessage(message);
        setToastSeverity(severity);
        setToastOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const transactionData: Omit<Transaction, 'id'> = {
                amount: parseFloat(formData.amount),
                category: formData.category,
                status: formData.status,
                date: new Date(formData.date),
                user_profile: formData.user_profile || 'default-avatar.png',
                user_id: formData.user_id || 'current-user-id',
            };

            if (transaction?.id) {
                await transactionService.updateTransaction(transaction.id, transactionData);
                showToast('Transaction updated successfully', 'success');
            } else {
                await transactionService.createTransaction(transactionData);
                showToast('Transaction created successfully', 'success');
            }

            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
            onClose();
        } catch (error) {
            showToast('Failed to save transaction', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <Dialog
                open={isOpen}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: 3,
                        color: 'white',
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 2,
                    color: 'white',
                    fontWeight: 600
                }}>
                    {transaction ? 'Edit Transaction' : 'New Transaction'}
                    <IconButton
                        onClick={onClose}
                        sx={{ color: '#94A3B8' }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ pb: 3 }}>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <TextField
                                label="Amount"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                fullWidth
                                inputProps={{ min: 0, step: 0.01 }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#0F172A',
                                        '& fieldset': {
                                            borderColor: '#334155',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#475569',
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
                                }}
                            />

                            <FormControl fullWidth required>
                                <InputLabel sx={{ color: '#94A3B8', '&.Mui-focused': { color: '#00D4FF' } }}>
                                    Category
                                </InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    label="Category"
                                    sx={{
                                        backgroundColor: '#0F172A',
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#334155',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#475569',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#00D4FF',
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: '#94A3B8',
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: '#1E293B',
                                                border: '1px solid #334155',
                                                '& .MuiMenuItem-root': {
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: '#334155',
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="Revenue">Revenue</MenuItem>
                                    <MenuItem value="Expense">Expense</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth required>
                                <InputLabel sx={{ color: '#94A3B8', '&.Mui-focused': { color: '#00D4FF' } }}>
                                    Status
                                </InputLabel>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    label="Status"
                                    sx={{
                                        backgroundColor: '#0F172A',
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#334155',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#475569',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#00D4FF',
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: '#94A3B8',
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: '#1E293B',
                                                border: '1px solid #334155',
                                                '& .MuiMenuItem-root': {
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: '#334155',
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="Paid">Paid</MenuItem>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label="Date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    sx: { color: '#94A3B8', '&.Mui-focused': { color: '#00D4FF' } }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#0F172A',
                                        '& fieldset': {
                                            borderColor: '#334155',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#475569',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#00D4FF',
                                        },
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'white',
                                    },
                                }}
                            />
                        </Stack>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button
                            onClick={onClose}
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
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{
                                backgroundColor: '#00D4FF',
                                color: 'white',
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: '#0099B2',
                                },
                                '&:disabled': {
                                    backgroundColor: '#334155',
                                    color: '#94A3B8',
                                },
                            }}
                        >
                            {isSubmitting
                                ? (transaction ? 'Updating...' : 'Creating...')
                                : (transaction ? 'Update' : 'Create')
                            }
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Snackbar
                open={toastOpen}
                autoHideDuration={3000}
                onClose={() => setToastOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setToastOpen(false)}
                    severity={toastSeverity}
                    sx={{ width: '100%' }}
                >
                    {toastMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default TransactionModal;
