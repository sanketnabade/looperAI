import api from "./api";
import { User } from "@financial-dashboard/shared";

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  profile?: string;
}

export interface UpdateProfileResponse {
  user: User;
  message: string;
}

class ProfileService {
  async updateProfile(
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    const response = await api.put("/api/profile", data);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await api.get("/api/profile");
    return response.data;
  }

  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post("/api/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }
}

export const profileService = new ProfileService();
