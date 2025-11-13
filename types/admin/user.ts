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