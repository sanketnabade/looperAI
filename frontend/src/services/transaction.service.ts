import { Transaction } from "@financial-dashboard/shared";
import api from "./api";

interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  type?: "income" | "expense";
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

interface TransactionResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}

export const transactionService = {
  async getTransactions(
    page = 1,
    pageSize = 10,
    filters?: TransactionFilters,
    sortBy?: { id: string; desc: boolean }
  ): Promise<TransactionResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(filters &&
        Object.fromEntries(
          Object.entries(filters)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, value.toString()])
        )),
      ...(sortBy && {
        sortBy: sortBy.id,
        sortOrder: sortBy.desc ? "desc" : "asc",
      }),
    });

    const response = await api.get(`/transactions?${params}`);
    return response.data;
  },

  async createTransaction(
    transaction: Omit<Transaction, "_id">
  ): Promise<Transaction> {
    const response = await api.post("/transactions", transaction);
    return response.data;
  },

  async updateTransaction(
    id: string,
    transaction: Partial<Transaction>
  ): Promise<Transaction> {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  },

  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },
};
