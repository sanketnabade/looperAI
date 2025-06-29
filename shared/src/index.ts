import { Types } from "mongoose";

export interface Transaction {
  id?: string;
  date: Date | string;
  amount: number;
  category: "Revenue" | "Expense";
  status: "Paid" | "Pending";
  user_id: Types.ObjectId | string | User;
  user_profile?: string;
  categoryId?: Types.ObjectId | string;
  fromTo?: string; // Person name - from whom (for Revenue) or to whom (for Expense)
}

export interface User {
  id: string;
  email: string;
  name: string;
  profile?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  pendingTransactions: number;
  recentTransactions: Transaction[];
}

export interface CSVExportConfig {
  fields: (keyof Transaction)[];
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: {
    category?: string;
    status?: string;
    user_id?: string;
  };
}

export interface ExportableField {
  key: keyof Transaction;
  label: string;
  description?: string;
  defaultSelected: boolean;
}

export interface CSVExportRequest {
  selectedFields: (keyof Transaction)[];
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: {
    category?: "Revenue" | "Expense";
    status?: "Paid" | "Pending";
    search?: string;
  };
  filename?: string;
}

export interface CSVExportResponse {
  success: boolean;
  message?: string;
  downloadUrl?: string;
}

export interface Category {
  id?: string;
  name: string;
  type: "Revenue" | "Expense";
  description?: string;
  color?: string;
  user_id: Types.ObjectId | string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface DeleteAccountRequest {
  password: string;
}
