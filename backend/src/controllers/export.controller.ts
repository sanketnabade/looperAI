import { Request, Response } from "express";
import { Parser } from "json2csv";
import { TransactionModel } from "../models/transaction.model";
import {
  CSVExportConfig,
  CSVExportRequest,
  ExportableField,
} from "@financial-dashboard/shared";

interface AuthRequest extends Request {
  user?: any;
}

// Available fields for export with their display labels
export const getExportableFields = (req: AuthRequest, res: Response) => {
  try {
    const fields: ExportableField[] = [
      {
        key: "date",
        label: "Date",
        description: "Transaction date",
        defaultSelected: true,
      },
      {
        key: "amount",
        label: "Amount",
        description: "Transaction amount",
        defaultSelected: true,
      },
      {
        key: "category",
        label: "Category",
        description: "Revenue or Expense",
        defaultSelected: true,
      },
      {
        key: "status",
        label: "Status",
        description: "Paid or Pending",
        defaultSelected: true,
      },
      {
        key: "user_id",
        label: "User ID",
        description: "Associated user identifier",
        defaultSelected: false,
      },
      {
        key: "user_profile",
        label: "User Profile",
        description: "User profile image",
        defaultSelected: false,
      },
      {
        key: "id",
        label: "Transaction ID",
        description: "Unique transaction identifier",
        defaultSelected: false,
      },
    ];

    res.json({ fields });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const exportTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const exportRequest: CSVExportRequest = req.body;

    // Build filter object
    const filter: any = { user_id: req.user._id };

    if (exportRequest.filters?.category) {
      filter.category = exportRequest.filters.category;
    }
    if (exportRequest.filters?.status) {
      filter.status = exportRequest.filters.status;
    }
    if (exportRequest.filters?.search) {
      // Add search functionality (case-insensitive search across relevant fields)
      filter.$or = [
        { category: { $regex: exportRequest.filters.search, $options: "i" } },
        { status: { $regex: exportRequest.filters.search, $options: "i" } },
      ];
    }
    if (exportRequest.dateRange) {
      filter.date = {
        $gte: new Date(exportRequest.dateRange.start),
        $lte: new Date(exportRequest.dateRange.end),
      };
    }

    // Get transactions
    const transactions = await TransactionModel.find(filter).sort({ date: -1 });

    if (transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found matching the specified criteria",
      });
    }

    // Transform data based on selected fields
    const csvData = transactions.map((transaction) => {
      const row: any = {};
      exportRequest.selectedFields.forEach((field) => {
        let value = transaction[field];

        // Format specific fields for better CSV output
        switch (field) {
          case "date":
            value = new Date(value).toLocaleDateString();
            break;
          case "amount":
            value = parseFloat(value).toFixed(2);
            break;
          case "user_id":
            value = value?.toString();
            break;
        }

        row[field] = value;
      });
      return row;
    });

    // Create field labels for CSV headers
    const fieldLabels: Record<string, string> = {
      date: "Date",
      amount: "Amount",
      category: "Category",
      status: "Status",
      user_id: "User ID",
      user_profile: "User Profile",
      id: "Transaction ID",
    };

    // Generate CSV with custom headers
    const parser = new Parser({
      fields: exportRequest.selectedFields.map((field) => ({
        label: fieldLabels[field] || field,
        value: field,
      })),
      header: true,
    });

    const csv = parser.parse(csvData);

    // Generate filename
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = exportRequest.filename
      ? `${exportRequest.filename}-${dateStr}.csv`
      : `transactions-export-${dateStr}.csv`;

    // Set headers for file download
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Pragma", "no-cache");

    // Add BOM for Excel compatibility
    res.send("\ufeff" + csv);
  } catch (error: any) {
    console.error("Export error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to export transactions",
    });
  }
};
