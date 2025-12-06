import axios from "axios";

// Get base URL from environment variable
// Normalize to use localhost instead of 127.0.0.1 to avoid CORS issues
const baseURL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"
).replace("127.0.0.1", "localhost");

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
