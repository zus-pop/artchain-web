import myAxios from "@/lib/custom-axios";

/**
 * Admin API - User Management
 */

export interface AdminUser {
  userId: string;
  username: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: "ADMIN" | "STAFF" | "EXAMINER" | "GUARDIAN" | "COMPETITOR";
  status: number; // 1 = active, 0 = suspended
  createdAt: string;
  positionLevel: string | null;
}

export interface GetAllUsersResponse {
  data: AdminUser[];
  meta: {
    total: number;
    page: string;
    limit: string;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

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
