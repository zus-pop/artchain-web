import myAxios from "@/lib/custom-axios";
import { AuthResponse, LoginRequest, RegisterRequest, WhoAmI } from "@/types";

export const loginApi = async (
  loginRequest: LoginRequest
): Promise<AuthResponse> => {
  const response = await myAxios.post<AuthResponse>(
    "/auth/login",
    loginRequest
  );
  return response.data;
};

export const registerApi = async (
  registerRequest: RegisterRequest
): Promise<void> => {
  const response = await myAxios.post("/auth/register", registerRequest);
  return response.data;
};

export const getMeApi = async (): Promise<WhoAmI> => {
  const response = await myAxios.get<WhoAmI>("/users/me");
  return response.data;
};

export const logoutApi = async (): Promise<void> => {
  const response = await myAxios.post("/auth/logout");
  return response.data;
};
