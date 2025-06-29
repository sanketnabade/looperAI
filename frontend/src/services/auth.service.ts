import { LoginRequest, LoginResponse } from "../../../shared/src/index.ts";
import api from "./api";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", credentials);
    localStorage.setItem("token", data.token);
    return data;
  },

  async register(
    userData: LoginRequest & { name: string }
  ): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/register", userData);
    localStorage.setItem("token", data.token);
    return data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem("token");
  },

  async getProfile() {
    const { data } = await api.get("/profile/me");
    return data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};
