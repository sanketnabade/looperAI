import { Request, Response } from "express";
import { TransactionModel } from "../models/transaction.model";
import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
} from "date-fns";

interface AuthRequest extends Request {
  user?: any;
}

// Get monthly summary
export const getMonthlyReport = async (req: AuthRequest, res: Response) => {
  try {
    const { year, month } = req.query;
    const start = startOfMonth(
      new Date(parseInt(year as string), parseInt(month as string) - 1)
    );
    const end = endOfMonth(start);

    const report = await TransactionModel.aggregate([
      {
        $match: {
          user_id: req.user._id,
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          transactions: { $push: "$$ROOT" },
        },
      },
    ]);

    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get yearly summary
export const getYearlyReport = async (req: AuthRequest, res: Response) => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const start = startOfYear(new Date(year, 0));
    const end = endOfYear(start);

    const report = await TransactionModel.aggregate([
      {
        $match: {
          user_id: req.user._id,
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            category: "$category",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          categories: {
            $push: {
              category: "$_id.category",
              total: "$total",
            },
          },
          totalAmount: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get category trends
export const getCategoryTrends = async (req: AuthRequest, res: Response) => {
  try {
    const months = parseInt(req.query.months as string) || 6;
    const endDate = new Date();
    const startDate = subMonths(endDate, months);

    const trends = await TransactionModel.aggregate([
      {
        $match: {
          user_id: req.user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            category: "$category",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    res.json(trends);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get income vs expense analysis
export const getIncomeExpenseAnalysis = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const months = parseInt(req.query.months as string) || 12;
    const endDate = new Date();
    const startDate = subMonths(endDate, months);

    const analysis = await TransactionModel.aggregate([
      {
        $match: {
          user_id: req.user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            category: "$category",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$_id.category", "Revenue"] }, "$total", 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ["$_id.category", "Expense"] }, "$total", 0],
            },
          },
        },
      },
      {
        $addFields: {
          netIncome: { $subtract: ["$income", "$expenses"] },
          savingsRate: {
            $multiply: [
              { $divide: [{ $subtract: ["$income", "$expenses"] }, "$income"] },
              100,
            ],
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
