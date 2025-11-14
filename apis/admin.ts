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

// GET /api/admin/statistics/contest/{contestId} - Get statistics for a single contest
export const getContestStatistics = async (contestId: number | string): Promise<any> => {
  const response = await myAxios.get(`/admin/statistics/contest/${contestId}`);
  return response.data; // expected shape: { success: true, data: { ... } }
};

// GET /api/admin/statistics/user-growth - Get user growth over time
export const getUserGrowth = async (params?: {
  startDate?: string;
  endDate?: string;
  groupBy?: string; // day|week|month|year
}): Promise<any> => {
  const response = await myAxios.get(`/admin/statistics/user-growth`, { params });
  return response.data; // expected shape: { success: true, data: { summary, growth: [...] } }
};

// GET /api/admin/statistics/top-competitors?limit=10
export const getTopCompetitors = async (limit = 10): Promise<any> => {
  const response = await myAxios.get(`/admin/statistics/top-competitors`, { params: { limit } });
  return response.data;
};

// GET /api/admin/statistics/top-examiners?limit=10
export const getTopExaminers = async (limit = 10): Promise<any> => {
  const response = await myAxios.get(`/admin/statistics/top-examiners`, { params: { limit } });
  return response.data;
};

// GET /api/admin/statistics/most-voted-paintings?limit=10
export const getMostVotedPaintings = async (limit = 10): Promise<any> => {
  const response = await myAxios.get(`/admin/statistics/most-voted-paintings`, { params: { limit } });
  return response.data;
};
