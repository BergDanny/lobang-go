import type { AxiosError } from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../services/api";
import type { LoginCredentials, RegisterData, User } from "../types/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initializeAuth: () => {
        const token = localStorage.getItem("auth_token");
        const userStr = localStorage.getItem("user");

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({ user, token, isAuthenticated: true });
          } catch {
            // Invalid user data, clear it
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            set({ user: null, token: null, isAuthenticated: false });
          }
        }
      },

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authApi.login(credentials);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Handle validation errors from backend
          let errorMessage = "Login failed";

          const axiosError = error as AxiosError<{
            message?: string;
            errors?: Record<string, string[]>;
          }>;

          if (axiosError.response?.data) {
            // Backend validation errors structure
            if (axiosError.response.data.errors) {
              // Laravel validation errors - format them nicely
              const errors = axiosError.response.data.errors;
              const errorMessages = Object.values(errors).flat();
              errorMessage =
                errorMessages[0] ||
                axiosError.response.data.message ||
                "Validation failed";
            } else if (axiosError.response.data.message) {
              errorMessage = axiosError.response.data.message;
            }
          } else if (axiosError.message) {
            errorMessage = axiosError.message;
          }

          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authApi.register(data);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const axiosError = error as AxiosError<{ message?: string }>;
          const errorMessage =
            axiosError.response?.data?.message ||
            axiosError.message ||
            "Registration failed";
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch (error) {
          // Even if logout fails on server, clear local state
          console.error("Logout error:", error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
