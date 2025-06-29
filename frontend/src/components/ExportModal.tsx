import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox,
    TextField,
    Box,
    Typography,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Snackbar,
} from '@mui/material';
import {
    ExpandMore,
    Download,
    FileDownload,
    FilterList,
    DateRange,
    ViewColumn,
    CheckCircle,
} from '@mui/icons-material';
import { ExportableField, CSVExportRequest, Transaction } from '@financial-dashboard/shared';
import { exportService } from '../services/export.service';
import { format } from 'date-fns';

interface ExportModalProps {
    open: boolean;
    onClose: () => void;
    onExportComplete?: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ open, onClose, onExportComplete }) => {
    const [exportableFields, setExportableFields] = useState<ExportableField[]>([]);
    const [selectedFields, setSelectedFields] = useState<(keyof Transaction)[]>([]);
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
        start: '',
        end: '',
    });
    const [filters, setFilters] = useState<{
        category?: 'Revenue' | 'Expense';
        status?: 'Paid' | 'Pending';
        search?: string;
    }>({});
    const [filename, setFilename] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [exportPreview, setExportPreview] = useState<{
        count: number;
        sampleData: any[];
    } | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

    // Load exportable fields on mount
    useEffect(() => {
        if (open) {
            loadExportableFields();
        }
    }, [open]);

    // Update preview when filters change
    useEffect(() => {
        if (open && selectedFields.length > 0) {
            loadExportPreview();
        }
    }, [open, dateRange, filters, selectedFields]);

    const loadExportableFields = async () => {
        try {
            setIsLoading(true);
            const response = await exportService.getExportableFields();
            setExportableFields(response.fields);

            // Set default selected fields
            const defaultFields = response.fields
                .filter(field => field.defaultSelected)
                .map(field => field.key);
            setSelectedFields(defaultFields);
        } catch (error: any) {
            setError('Failed to load export fields');
        } finally {
            setIsLoading(false);
        }
    };

    const loadExportPreview = async () => {
        try {
            const exportRequest: Omit<CSVExportRequest, 'selectedFields'> = {
                dateRange: dateRange.start && dateRange.end ? {
                    start: dateRange.start,
                    end: dateRange.end,
                } : undefined,
                filters: Object.keys(filters).length > 0 ? filters : undefined,
            };

            const preview = await exportService.getExportPreview(exportRequest);
            setExportPreview(preview);
        } catch (error) {
            setExportPreview({ count: 0, sampleData: [] });
        }
    };

    const handleFieldToggle = (fieldKey: keyof Transaction) => {
        setSelectedFields(prev =>
            prev.includes(fieldKey)
                ? prev.filter(key => key !== fieldKey)
                : [...prev, fieldKey]
        );
    };

    const handleSelectAll = () => {
        setSelectedFields(exportableFields.map(field => field.key));
    };

    const handleDeselectAll = () => {
        setSelectedFields([]);
    };

    const handleExport = async () => {
        if (selectedFields.length === 0) {
            setError('Please select at least one field to export');
            return;
        }

        try {
            setIsExporting(true);
            setError(null);

            const exportRequest: CSVExportRequest = {
                selectedFields,
                dateRange: dateRange.start && dateRange.end ? {
                    start: dateRange.start,
                    end: dateRange.end,
                } : undefined,
                filters: Object.keys(filters).length > 0 ? filters : undefined,
                filename: filename.trim() || undefined,
            };

            const result = await exportService.exportTransactionsCSV(exportRequest);

            // Show success message
            setSuccessMessage(`Successfully exported ${result.recordCount} transactions to ${result.filename}`);
            setShowSuccessSnackbar(true);

            onExportComplete?.();

            // Close modal after a brief delay to show success message
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (error: any) {
            setError(error.message || 'Export failed');
        } finally {
            setIsExporting(false);
        }
    };

    const handleClose = () => {
        if (!isExporting) {
            onClose();
            // Reset form state
            setSelectedFields([]);
            setDateRange({ start: '', end: '' });
            setFilters({});
            setFilename('');
            setError(null);
            setExportPreview(null);
            setSuccessMessage(null);
            setShowSuccessSnackbar(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: 3,
                }
            }}
        >
            <DialogTitle sx={{ color: 'white', borderBottom: '1px solid #334155' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FileDownload />
                    Export Transactions
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ p: 3 }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Export Preview */}
                        {exportPreview && (
                            <Card sx={{ mb: 3, backgroundColor: '#0F172A', border: '1px solid #334155' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                                        Export Preview
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography sx={{ color: '#94A3B8', mb: 1 }}>
                                            📊 {exportPreview.count} transactions will be exported
                                        </Typography>
                                        {exportPreview.count === 0 && (
                                            <Alert severity="warning" sx={{ mt: 1 }}>
                                                No transactions match your current filters. Please adjust your criteria.
                                            </Alert>
                                        )}
                                    </Box>

                                    {/* Selected Columns */}
                                    {selectedFields.length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" sx={{ color: '#00D4FF', mb: 1 }}>
                                                Selected Columns ({selectedFields.length}):
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                {selectedFields.map(field => (
                                                    <Chip
                                                        key={field}
                                                        label={exportableFields.find(f => f.key === field)?.label || field}
                                                        size="small"
                                                        sx={{ backgroundColor: '#00D4FF', color: 'white' }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Active Filters */}
                                    {(filters.category || filters.status || filters.search || (dateRange.start && dateRange.end)) && (
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ color: '#F59E0B', mb: 1 }}>
                                                Active Filters:
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                {filters.category && (
                                                    <Chip
                                                        label={`Category: ${filters.category}`}
                                                        size="small"
                                                        sx={{ backgroundColor: '#F59E0B', color: 'white' }}
                                                    />
                                                )}
                                                {filters.status && (
                                                    <Chip
                                                        label={`Status: ${filters.status}`}
                                                        size="small"
                                                        sx={{ backgroundColor: '#F59E0B', color: 'white' }}
                                                    />
                                                )}
                                                {filters.search && (
                                                    <Chip
                                                        label={`Search: "${filters.search}"`}
                                                        size="small"
                                                        sx={{ backgroundColor: '#F59E0B', color: 'white' }}
                                                    />
                                                )}
                                                {dateRange.start && dateRange.end && (
                                                    <Chip
                                                        label={`Date: ${format(new Date(dateRange.start), 'MMM dd')} - ${format(new Date(dateRange.end), 'MMM dd')}`}
                                                        size="small"
                                                        sx={{ backgroundColor: '#F59E0B', color: 'white' }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Column Selection */}
                        <Accordion
                            defaultExpanded
                            sx={{ backgroundColor: '#0F172A', border: '1px solid #334155', mb: 2 }}
                        >
                            <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#94A3B8' }} />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ViewColumn sx={{ color: '#00D4FF' }} />
                                    <Typography sx={{ color: 'white' }}>
                                        Column Selection ({selectedFields.length} selected)
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={handleSelectAll}
                                        sx={{ color: '#00D4FF' }}
                                    >
                                        Select All
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={handleDeselectAll}
                                        sx={{ color: '#94A3B8' }}
                                    >
                                        Deselect All
                                    </Button>
                                </Box>
                                <FormGroup>
                                    <Grid container spacing={1}>
                                        {exportableFields.map((field) => (
                                            <Grid item xs={12} sm={6} key={field.key}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedFields.includes(field.key)}
                                                            onChange={() => handleFieldToggle(field.key)}
                                                            sx={{ color: '#00D4FF' }}
                                                        />
                                                    }
                                                    label={
                                                        <Box>
                                                            <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                                                                {field.label}
                                                            </Typography>
                                                            {field.description && (
                                                                <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                                                                    {field.description}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>

                        {/* Filters */}
                        <Accordion sx={{ backgroundColor: '#0F172A', border: '1px solid #334155', mb: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#94A3B8' }} />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FilterList sx={{ color: '#00D4FF' }} />
                                    <Typography sx={{ color: 'white' }}>
                                        Filters {Object.keys(filters).some(key => filters[key as keyof typeof filters]) &&
                                            <Chip size="small" label="Active" sx={{ ml: 1, backgroundColor: '#00D4FF', color: 'white' }} />}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Search Transactions"
                                            value={filters.search || ''}
                                            onChange={(e) => setFilters(prev => ({
                                                ...prev,
                                                search: e.target.value || undefined
                                            }))}
                                            placeholder="Search by category, status, or amount..."
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#1E293B',
                                                    color: 'white',
                                                    '& fieldset': { borderColor: '#334155' },
                                                    '&:hover fieldset': { borderColor: '#00D4FF' },
                                                    '&.Mui-focused fieldset': { borderColor: '#00D4FF' },
                                                },
                                                '& .MuiInputLabel-root': { color: '#94A3B8' },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            label="Category"
                                            value={filters.category || ''}
                                            onChange={(e) => setFilters(prev => ({
                                                ...prev,
                                                category: e.target.value as 'Revenue' | 'Expense' | undefined
                                            }))}
                                            SelectProps={{ native: true }}
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#1E293B',
                                                    color: 'white',
                                                    '& fieldset': { borderColor: '#334155' },
                                                    '&:hover fieldset': { borderColor: '#00D4FF' },
                                                    '&.Mui-focused fieldset': { borderColor: '#00D4FF' },
                                                },
                                                '& .MuiInputLabel-root': { color: '#94A3B8' },
                                            }}
                                        >
                                            <option value="">All Categories</option>
                                            <option value="Revenue">Revenue</option>
                                            <option value="Expense">Expense</option>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            label="Status"
                                            value={filters.status || ''}
                                            onChange={(e) => setFilters(prev => ({
                                                ...prev,
                                                status: e.target.value as 'Paid' | 'Pending' | undefined
                                            }))}
                                            SelectProps={{ native: true }}
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#1E293B',
                                                    color: 'white',
                                                    '& fieldset': { borderColor: '#334155' },
                                                    '&:hover fieldset': { borderColor: '#00D4FF' },
                                                    '&.Mui-focused fieldset': { borderColor: '#00D4FF' },
                                                },
                                                '& .MuiInputLabel-root': { color: '#94A3B8' },
                                            }}
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Pending">Pending</option>
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        {/* Date Range */}
                        <Accordion sx={{ backgroundColor: '#0F172A', border: '1px solid #334155', mb: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#94A3B8' }} />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <DateRange sx={{ color: '#00D4FF' }} />
                                    <Typography sx={{ color: 'white' }}>Date Range</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Start Date"
                                            type="date"
                                            value={dateRange.start}
                                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                                sx: { color: '#94A3B8' }
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#1E293B',
                                                    color: 'white',
                                                    '& fieldset': { borderColor: '#334155' },
                                                    '&:hover fieldset': { borderColor: '#00D4FF' },
                                                    '&.Mui-focused fieldset': { borderColor: '#00D4FF' },
                                                },
                                                '& .MuiInputBase-input': { color: 'white' },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="End Date"
                                            type="date"
                                            value={dateRange.end}
                                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                                sx: { color: '#94A3B8' }
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#1E293B',
                                                    color: 'white',
                                                    '& fieldset': { borderColor: '#334155' },
                                                    '&:hover fieldset': { borderColor: '#00D4FF' },
                                                    '&.Mui-focused fieldset': { borderColor: '#00D4FF' },
                                                },
                                                '& .MuiInputBase-input': { color: 'white' },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        {/* Export Settings */}
                        <Card sx={{ backgroundColor: '#0F172A', border: '1px solid #334155' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                                    Export Settings
                                </Typography>
                                <TextField
                                    label="Custom Filename (optional)"
                                    value={filename}
                                    onChange={(e) => setFilename(e.target.value)}
                                    placeholder="e.g., monthly-report"
                                    fullWidth
                                    helperText="File will be saved as: filename-YYYY-MM-DD.csv"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#1E293B',
                                            color: 'white',
                                            '& fieldset': { borderColor: '#334155' },
                                            '&:hover fieldset': { borderColor: '#00D4FF' },
                                            '&.Mui-focused fieldset': { borderColor: '#00D4FF' },
                                        },
                                        '& .MuiInputLabel-root': { color: '#94A3B8' },
                                        '& .MuiFormHelperText-root': { color: '#94A3B8' },
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: '1px solid #334155' }}>
                <Button
                    onClick={handleClose}
                    disabled={isExporting}
                    sx={{ color: '#94A3B8' }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleExport}
                    disabled={selectedFields.length === 0 || isExporting}
                    startIcon={isExporting ? <CircularProgress size={20} /> : <Download />}
                    variant="contained"
                    sx={{
                        backgroundColor: '#00D4FF',
                        color: 'white',
                        '&:hover': { backgroundColor: '#0099B2' },
                        '&:disabled': { backgroundColor: '#334155' },
                    }}
                >
                    {isExporting ? 'Exporting...' : 'Export CSV'}
                </Button>
            </DialogActions>

            {/* Success Snackbar */}
            <Snackbar
                open={showSuccessSnackbar}
                autoHideDuration={3000}
                onClose={() => setShowSuccessSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setShowSuccessSnackbar(false)}
                    severity="success"
                    sx={{
                        width: '100%',
                        backgroundColor: '#22C55E',
                        color: 'white', '& .MuiAlert-icon': { color: 'white' }
                    }}
                    icon={<CheckCircle />}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default ExportModal;
