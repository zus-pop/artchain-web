export interface LoginRequest {
  username: string;
  password: string;
  staySignedIn?: boolean;
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

export interface Wallet {
  walletId: string;
  balance: number;
  currency: string;
  status: string;
  withdrawalAvailableAt?: string;
}

export interface WhoAmI {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string | null;
  birthday?: string;
  schoolName?: string;
  ward?: string;
  grade?: string;
  wallet?: Wallet;
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
