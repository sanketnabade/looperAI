import mongoose from "mongoose";
import { Transaction } from "@financial-dashboard/shared";

interface ITransaction extends Omit<Transaction, "id">, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Transaction date is required"],
      default: Date.now,
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      validate: {
        validator: (value: number) => value > 0,
        message: "Amount must be greater than 0",
      },
    },
    category: {
      type: String,
      enum: {
        values: ["Revenue", "Expense"],
        message: "{VALUE} is not a valid category",
      },
      required: [true, "Transaction category is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["Paid", "Pending"],
        message: "{VALUE} is not a valid status",
      },
      required: [true, "Transaction status is required"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    user_profile: {
      type: String,
      required: [true, "User profile URL is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
transactionSchema.index({ user_id: 1, date: -1 });
transactionSchema.index({ category: 1, date: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ categoryId: 1 });

// Pre-save middleware to validate amount based on category
transactionSchema.pre("save", function (next) {
  if (this.category === "Expense" && this.amount > 0) {
    this.amount = -Math.abs(this.amount);
  } else if (this.category === "Revenue" && this.amount < 0) {
    this.amount = Math.abs(this.amount);
  }
  next();
});

export const TransactionModel = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);
