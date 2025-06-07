import { apiClient } from "./api";
import { LoginData, RegisterData, User } from "./schemas";

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },
};
