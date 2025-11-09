export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  role: UserRole;
  birthday?: string;
  schoolName?: string;
  ward?: string;
  grade?: string;
}

export interface WhoAmI {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  birthday?: string;
  schoolName?: string;
  ward?: string;
  grade?: string;
}

export interface AuthResponse {
  access_token: string;
  user?: WhoAmI;
}

export type UserRole =
  | "COMPETITOR"
  | "GUARDIAN"
  | "ADMIN"
  | "STAFF"
  | "EXAMINER";
