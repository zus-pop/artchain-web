import myAxios from "@/lib/custom-axios";
import { AdminUser, GetAllUsersResponse } from "@/types/admin/user";
import { SystemStatisticsResponse } from "@/types/admin/system";

/**
 * Admin API - User Management
 */

// GET /api/admin/accounts - Get all accounts with pagination and role filtering
export const getAllUsers = async (params?: {
  page?: number;
  limit?: number;
  role?: string;
  status?: number;
  search?: string;
}): Promise<GetAllUsersResponse> => {
  const response = await myAxios.get("/admin/accounts", { params });
  return response.data;
};

// PATCH /api/admin/users/ban/{id} - Ban a user
export const banUser = async (id: string): Promise<{
  success: boolean;
  message: string;
  data: {
    userId: string;
    status: number;
  };
}> => {
  const response = await myAxios.patch(`/admin/users/ban/${id}`);
  return response.data;
};

// PATCH /api/admin/users/activate/{id} - Activate a user
export const activateUser = async (id: string): Promise<{
  success: boolean;
  message: string;
  data: {
    userId: string;
    status: number;
  };
}> => {
  const response = await myAxios.patch(`/admin/users/activate/${id}`);
  return response.data;
};

/**
 * Admin API - System Statistics
 */

// GET /api/admin/statistics/system - Get system statistics overview
export const getSystemStatistics = async (): Promise<SystemStatisticsResponse> => {
  const response = await myAxios.get("/admin/statistics/system");
  return response.data;
};
