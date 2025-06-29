import { Request, Response } from "express";
import { Parser } from "json2csv";
import { TransactionModel } from "../models/transaction.model";
import { CSVExportConfig } from "../../../shared/src/index.ts";

interface AuthRequest extends Request {
  user?: any;
}

export const exportTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const config: CSVExportConfig = req.body;

    // Build filter object
    const filter: any = { user_id: req.user._id };

    if (config.filters?.category) {
      filter.category = config.filters.category;
    }
    if (config.filters?.status) {
      filter.status = config.filters.status;
    }
    if (config.dateRange) {
      filter.date = {
        $gte: new Date(config.dateRange.start),
        $lte: new Date(config.dateRange.end),
      };
    }

    // Get transactions
    const transactions = await TransactionModel.find(filter).sort({ date: -1 });

    // Transform dates to local format and prepare data for CSV
    const csvData = transactions.map((t) => {
      const row: any = {};
      config.fields.forEach((field) => {
        if (field === "date") {
          row[field] = new Date(t[field]).toLocaleDateString();
        } else {
          row[field] = t[field];
        }
      });
      return row;
    });

    // Generate CSV
    const parser = new Parser({
      fields: config.fields,
      header: true,
    });

    const csv = parser.parse(csvData);

    // Set headers for file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=transactions-${
        new Date().toISOString().split("T")[0]
      }.csv`
    );

    res.send(csv);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
