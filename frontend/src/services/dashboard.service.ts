import { DashboardMetrics } from "@financial-dashboard/shared";
import api from "./api";

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const { data } = await api.get<DashboardMetrics>("/dashboard/metrics");
    return data;
  },
};
