import { Request, Response } from "express";
import { TransactionModel } from "../models/transaction.model";
import { Transaction } from "@financial-dashboard/shared";
import { AppError } from "../middleware/error.middleware";
import mongoose from "mongoose";

interface AuthRequest extends Request {
  user?: any;
}

// Get all transactions with pagination and filtering
export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      throw new AppError("Authentication required", 401);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = { user_id: req.user._id };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }

    // Execute query with pagination
    const transactions = await TransactionModel.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Get total count for pagination
    const total = await TransactionModel.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error("Transaction fetch error:", error);
    throw new AppError(error.message || "Error fetching transactions", 500);
  }
};

// Get single transaction
export const getTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await TransactionModel.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create new transaction
export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      throw new AppError("Authentication required", 401);
    }

    const transaction: Partial<Transaction> = {
      ...req.body,
      user_id: req.user._id,
      user_profile: req.user.profile,
    };

    const newTransaction = await TransactionModel.create(transaction);
    res.status(201).json(newTransaction);
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        error: "Validation Error",
        details: Object.values(error.errors).map((err) => err.message),
      });
    }
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Transaction creation error:", error);
    res.status(500).json({ error: "Error creating transaction" });
  }
};

// Update transaction
export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await TransactionModel.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    // console.log(transaction);
    Object.assign(transaction, req.body);
    await transaction.save();

    res.json(transaction);
  } catch (error: any) {
    // console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Delete transaction
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await TransactionModel.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
