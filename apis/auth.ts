import myAxios from "@/lib/custom-axios";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types";

/**
 * Auth API Service Layer
 * Contains all authentication-related API calls
 */

// Login API call
export const loginApi = async (loginRequest: LoginRequest): Promise<AuthResponse> => {
  const response = await myAxios.post<AuthResponse>("/auth/login", loginRequest);
  return response.data;
};

// Register API call
export const registerApi = async (registerRequest: RegisterRequest): Promise<void> => {
  const response = await myAxios.post("/auth/register", registerRequest);
  return response.data;
};

// Get current user info API call
export const getMeApi = async (): Promise<User> => {
  const response = await myAxios.get<User>("/users/me");
  return response.data;
};

// Logout API call
export const logoutApi = async (): Promise<void> => {
  const response = await myAxios.post("/auth/logout");
  return response.data;
};
