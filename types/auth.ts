export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  role: "GUARDIAN" | "COMPETITOR";
  birthday?: string;
  schoolName?: string;
  ward?: string;
  grade?: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: "GUARDIAN" | "COMPETITOR";
}

export interface AuthResponse {
  access_token: string;
  user?: User;
}
