import { Request, Response } from "express";
import { TransactionModel } from "../models/transaction.model";
import { DashboardMetrics } from "@financial-dashboard/shared";

interface AuthRequest extends Request {
  user?: any;
}

export const getDashboardMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    // Get total revenue
    const revenueResult = await TransactionModel.aggregate([
      {
        $match: {
          user_id: userId,
          category: "Revenue",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Get total expenses
    const expenseResult = await TransactionModel.aggregate([
      {
        $match: {
          user_id: userId,
          category: "Expense",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Get pending transactions count
    const pendingTransactions = await TransactionModel.countDocuments({
      user_id: userId,
      status: "Pending",
    });

    // Get recent transactions
    const recentTransactions = await TransactionModel.find({ user_id: userId })
      .sort({ date: -1 })
      .limit(5);

    const metrics: DashboardMetrics = {
      totalRevenue: revenueResult[0]?.total || 0,
      totalExpenses: expenseResult[0]?.total || 0,
      netIncome:
        (revenueResult[0]?.total || 0) - (expenseResult[0]?.total || 0),
      pendingTransactions,
      recentTransactions,
    };

    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
