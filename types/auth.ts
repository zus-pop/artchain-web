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
  // Optional fields for COMPETITOR
  birthday?: string;
  schoolName?: string;
  ward?: string;
  grade?: string;
}

export interface AuthResponse {
  access_token: string;
}
