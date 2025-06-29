import { ExportableField, CSVExportRequest } from "@financial-dashboard/shared";
import api from "./api";

export const exportService = {
  /**
   * Get available fields for export with their labels and descriptions
   */
  async getExportableFields(): Promise<{ fields: ExportableField[] }> {
    const response = await api.get("/export/fields");
    return response.data;
  },

  /**
   * Export transactions to CSV with column configuration
   */
  async exportTransactionsCSV(
    exportRequest: CSVExportRequest
  ): Promise<{ filename: string; recordCount: number }> {
    try {
      const response = await api.post("/export/transactions", exportRequest, {
        responseType: "blob",
        headers: {
          Accept: "text/csv",
        },
      });

      // Create blob and trigger download
      const blob = new Blob([response.data], {
        type: "text/csv; charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);

      // Create temporary download link
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from response headers or use default
      const contentDisposition = response.headers["content-disposition"];
      let filename = "transactions-export.csv";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      link.download = filename;

      // Add some styling to make the download more visible
      link.style.display = "none";
      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Cleanup after a brief delay to ensure download started
      setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(url);
      }, 100);

      // Parse CSV to get record count for success message
      const csvText = await blob.text();
      const lines = csvText.trim().split("\n");
      const recordCount = Math.max(0, lines.length - 1); // Subtract 1 for header row

      return { filename, recordCount };
    } catch (error: any) {
      // Handle error response
      if (error.response?.data instanceof Blob) {
        // If error response is a blob, try to extract the JSON error message
        const text = await error.response.data.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || "Export failed");
        } catch {
          throw new Error("Export failed");
        }
      }
      throw error;
    }
  },

  /**
   * Generate export preview to show how many records will be exported
   */
  async getExportPreview(
    exportRequest: Omit<CSVExportRequest, "selectedFields">
  ): Promise<{
    count: number;
    sampleData: any[];
  }> {
    try {
      // We'll make a regular API call to get transaction count
      const params = new URLSearchParams();

      if (exportRequest.dateRange) {
        params.append("startDate", exportRequest.dateRange.start);
        params.append("endDate", exportRequest.dateRange.end);
      }

      if (exportRequest.filters?.category) {
        params.append("category", exportRequest.filters.category);
      }

      if (exportRequest.filters?.status) {
        params.append("status", exportRequest.filters.status);
      }

      params.append("limit", "5"); // Get first 5 for preview

      const response = await api.get(`/transactions?${params}`);

      return {
        count: response.data.pagination?.total || 0,
        sampleData: response.data.transactions.slice(0, 3), // Show only 3 for preview
      };
    } catch (error) {
      return {
        count: 0,
        sampleData: [],
      };
    }
  },
};
