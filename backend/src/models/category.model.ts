import mongoose from "mongoose";
import { Category } from "../../../shared/src/index.ts";

interface ICategory extends Omit<Category, "id">, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: [2, "Category name must be at least 2 characters long"],
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    type: {
      type: String,
      enum: {
        values: ["Revenue", "Expense"],
        message: "{VALUE} is not a valid category type",
      },
      required: [true, "Category type is required"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    color: {
      type: String,
      default: "#000000",
      validate: {
        validator: (value: string) => colorRegex.test(value),
        message: "Invalid hex color code",
      },
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
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

// Ensure unique categories per user
categorySchema.index(
  { name: 1, user_id: 1, type: 1 },
  {
    unique: true,
    name: "unique_category_per_user",
    partialFilterExpression: { deleted: { $exists: false } },
  }
);

// Pre-save middleware for name capitalization
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
  next();
});

// Add a static method to find or create default categories
categorySchema.statics.createDefaultCategories = async function (
  userId: mongoose.Types.ObjectId
) {
  const defaults = [
    { name: "Salary", type: "Revenue", color: "#4CAF50" },
    { name: "Investments", type: "Revenue", color: "#2196F3" },
    { name: "Rent", type: "Expense", color: "#f44336" },
    { name: "Utilities", type: "Expense", color: "#FF9800" },
    { name: "Groceries", type: "Expense", color: "#9C27B0" },
  ];

  const categories = defaults.map((cat) => ({
    ...cat,
    user_id: userId,
  }));

  await this.insertMany(categories).catch((err) => {
    if (err.code !== 11000) {
      // Ignore duplicate key errors
      throw err;
    }
  });
};

export const CategoryModel = mongoose.model<
  ICategory,
  mongoose.Model<ICategory> & {
    createDefaultCategories(userId: mongoose.Types.ObjectId): Promise<void>;
  }
>("Category", categorySchema);
