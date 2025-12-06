import axios from "axios";

// Get base URL from environment variable
// In production, VITE_API_BASE_URL must be set
// In development, fallback to localhost if not set
const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_BASE_URL;
  
  if (envURL) {
    // Normalize to use localhost instead of 127.0.0.1 to avoid CORS issues
    return envURL.replace("127.0.0.1", "localhost");
  }
  
  // Only use localhost fallback in development mode
  if (import.meta.env.DEV) {
    return "http://localhost:8000/api/v1";
  }
  
  // In production, throw error if URL is not set
  throw new Error(
    "VITE_API_BASE_URL environment variable is required in production. " +
    "Please set it in your deployment environment."
  );
};

const baseURL = getBaseURL();

// Create axios instance
// Note: withCredentials is not needed for Bearer token authentication
// It's only needed for cookie-based authentication (Sanctum SPA mode)
const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Removed withCredentials to avoid CORS issues with wildcard origins
  // If your backend uses Sanctum SPA mode (cookie-based), you'll need to:
  // 1. Configure backend CORS to allow specific origin (not wildcard)
  // 2. Re-enable withCredentials: true
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - clear auth and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
