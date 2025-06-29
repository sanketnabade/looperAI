# CSV Export System Guide

## Overview

The CSV Export System provides a comprehensive solution for exporting transaction data with advanced column configuration and filtering capabilities. The system includes auto-download functionality and a user-friendly interface for customizing exports.

## Features

### ✅ Core Features Implemented

1. **Column Configuration**

   - User can select which fields to export via checkboxes
   - Default selections based on most commonly needed fields
   - Select All / Deselect All functionality
   - Field descriptions to help users understand each column

2. **Auto-download**

   - Automatic file download when export is ready
   - Files are automatically named with timestamps
   - Custom filename support
   - Browser-compatible download (works in all modern browsers)

3. **Advanced Filtering**

   - Date range filtering with calendar picker
   - Category filtering (Revenue/Expense)
   - Status filtering (Paid/Pending)
   - Text search across multiple fields
   - Real-time export preview showing filtered record count

4. **User Experience Enhancements**
   - Export preview showing number of records to be exported
   - Active filters visualization with chips
   - Progress indicators during export
   - Success notifications with download confirmation
   - Error handling with user-friendly messages

## Available Export Fields

| Field          | Label          | Description                   | Default Selected |
| -------------- | -------------- | ----------------------------- | ---------------- |
| `date`         | Date           | Transaction date              | ✅               |
| `amount`       | Amount         | Transaction amount            | ✅               |
| `category`     | Category       | Revenue or Expense            | ✅               |
| `status`       | Status         | Paid or Pending               | ✅               |
| `user_id`      | User ID        | Associated user identifier    | ❌               |
| `user_profile` | User Profile   | User profile image            | ❌               |
| `id`           | Transaction ID | Unique transaction identifier | ❌               |

## How to Use

### 1. Access Export Function

- Navigate to the Transactions page
- Click the "Export CSV" button in the top-right corner
- The button shows the current number of records available for export

### 2. Configure Export Settings

#### Column Selection

- The "Column Selection" section is expanded by default
- Check/uncheck fields you want to include in the export
- Use "Select All" or "Deselect All" for quick selection
- Each field includes a description to help you understand its purpose

#### Apply Filters (Optional)

- **Search**: Enter keywords to search across category, status, or amount fields
- **Category**: Filter by Revenue or Expense transactions
- **Status**: Filter by Paid or Pending transactions
- **Date Range**: Select start and end dates to limit the export timeframe

#### Export Settings

- **Custom Filename**: Optionally provide a custom filename
- Files are automatically saved as: `[filename]-YYYY-MM-DD.csv`
- Default filename: `transactions-export-YYYY-MM-DD.csv`

### 3. Preview and Export

- The "Export Preview" section shows:
  - Number of transactions that will be exported
  - Selected columns as chips
  - Active filters as colored chips
- Click "Export CSV" to download the file
- A success notification will appear confirming the download

## Technical Implementation

### Frontend Components

1. **ExportModal Component** (`/frontend/src/components/ExportModal.tsx`)

   - Main export dialog with all configuration options
   - Real-time preview updates
   - Form validation and error handling

2. **Export Service** (`/frontend/src/services/export.service.ts`)
   - API communication layer
   - File download handling
   - Error processing

### Backend API

1. **Export Controller** (`/backend/src/controllers/export.controller.ts`)

   - `GET /api/export/fields` - Returns available export fields
   - `POST /api/export/transactions` - Generates and returns CSV file

2. **Export Routes** (`/backend/src/routes/export.routes.ts`)
   - Protected routes requiring authentication
   - RESTful API design

### Data Flow

1. User opens export modal
2. System fetches available export fields
3. User configures columns, filters, and settings
4. Real-time preview shows filtered record count
5. User clicks export button
6. Backend processes request and generates CSV
7. File is automatically downloaded to user's device
8. Success notification confirms completion

## CSV Format

The exported CSV file includes:

- UTF-8 encoding with BOM for Excel compatibility
- Proper headers matching field labels
- Formatted data:
  - Dates in localized format (MM/DD/YYYY)
  - Amounts with 2 decimal places
  - Proper handling of special characters

## Error Handling

- **No Records Found**: Clear message when filters return no results
- **Network Errors**: User-friendly error messages for connectivity issues
- **Server Errors**: Detailed error information for debugging
- **Validation Errors**: Real-time validation feedback

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security

- All export requests require user authentication
- Users can only export their own transaction data
- Server-side filtering ensures data isolation
- No sensitive data exposed in export URLs

## Performance Considerations

- Large exports are processed server-side
- Streaming response for large datasets
- Client-side progress indicators
- Automatic cleanup of temporary files

## Future Enhancements

Potential improvements for future versions:

1. **Additional Export Formats**

   - Excel (.xlsx) export
   - PDF reports
   - JSON export for API integration

2. **Advanced Features**

   - Scheduled exports
   - Email delivery
   - Export templates
   - Bulk export management

3. **Analytics**
   - Export usage tracking
   - Popular field combinations
   - Performance metrics

## Troubleshooting

### Common Issues

1. **Export Button Disabled**

   - Ensure at least one column is selected
   - Check that you have transactions to export

2. **Download Not Starting**

   - Check browser's download settings
   - Ensure pop-ups are not blocked
   - Try a different browser

3. **Empty CSV File**

   - Verify your filters aren't too restrictive
   - Check the export preview for record count

4. **File Won't Open in Excel**
   - The CSV includes UTF-8 BOM for Excel compatibility
   - Try importing the file rather than opening directly

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify your network connection
3. Try refreshing the page and attempting the export again
4. Contact support with error details and steps to reproduce
