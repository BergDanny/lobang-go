// API Response Types
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: Record<string, string[]> | string[];
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Auth Types
export interface User {
  name: string;
  email: string;
  roles?: string[];
  permissions?: string[];
}

export interface AuthData {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Quest Types
export interface Quest {
  id: string; // UUID
  title: string;
  description: string;
  category: string;
  location_from: string | null;
  location_to: string;
  bounty: number;
  deadline: string; // ISO datetime string
  status: string;
  poster_id: string; // UUID
  runner_id?: string | null; // UUID
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  poster?: User;
  runner?: User;
}

