// src/api/config.js
import axios from "axios";
import { isAccountNotFoundError, redirectToSignup } from "../utils/authService";

// Create an axios instance with default configs
const API = axios.create({

  baseURL: import.meta.env.VITE_BACKEND_URL || "https://waureisen-backend.onrender.com/api",
  // baseURL:"http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // Increase timeout from 15s to 30s
});

// Set constant token key
const TOKEN_KEY = "token";

// Maximum number of retries for network errors
const MAX_RETRIES = 3;

// Add request interceptor to include auth token for protected routes
API.interceptors.request.use(
  (config) => {
    // Add retry count to config if not already present
    if (config.retryCount === undefined) {
      config.retryCount = 0;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // Ensure we're using the correct Bearer format
      config.headers["Authorization"] = `Bearer ${token}`;
      // console.log(`Setting Authorization header for ${config.url}`);
    }

    // Log the request for debugging
    // console.log(`API Request to ${config.url}:`, {
    //   method: config.method,
    //   headers: config.headers,
    //   params: config.params,
    //   // Don't log password or sensitive data
    //   data: config.data ? sanitizeRequestData(config.data) : undefined,
    // });

    return config;
  },
  (error) => {
    //console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common error cases
API.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    // console.log(`API Response from ${response.config.url}:`, {
    //   status: response.status,
    //   data: response.data,
    // });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors with retry logic
    if (!error.response) {
      console.error("Network error - no response from server");

      // Check if we should retry the request
      if (originalRequest.retryCount < MAX_RETRIES) {
        originalRequest.retryCount++;

        // Exponential backoff delay
        const delay = Math.pow(2, originalRequest.retryCount) * 1000;

        console.log(
          `Retrying request (${originalRequest.retryCount}/${MAX_RETRIES}) after ${delay}ms...`
        );

        // Wait for the delay before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Retry the request
        return API(originalRequest);
      }

      return Promise.reject(
        new Error(
          `Network error - please check your connection (after ${MAX_RETRIES} retries)`
        )
      );
    }

    // Log specific errors for debugging
    if (error.response) {
      console.error(
        `API Error ${error.response.status} (${error.response.config.url}):`,
        error.response.data
      );

      // Handle token expiration/invalid token
      if (error.response.status === 401) {
        console.error("401 Unauthorized - Token invalid or expired");

        // Get the current user type before clearing localStorage
        const userType = localStorage.getItem("userType");

        // Clear auth data from localStorage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("userType");
        localStorage.removeItem("user_data");
        localStorage.removeItem("provider_user");
        localStorage.removeItem("admin_data");

        // Redirect to appropriate page if not already there
        const currentPath = window.location.pathname;

        if (
          !currentPath.includes("/login") &&
          !currentPath.includes("/signup")
        ) {
          // Check if error indicates account doesn't exist
          if (isAccountNotFoundError(error)) {
            // Use utility function to redirect to signup with user type
            redirectToSignup(userType || "user");
          } else {
            // Otherwise just redirect to login with session expired parameter
            window.location.href = "/login?session_expired=true";
          }
        }
      } else if (error.response.status === 403) {
        console.error("403 Forbidden - Permission denied");
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to sanitize request data for logging (removes passwords)
function sanitizeRequestData(data) {
  if (!data) return data;

  // Create a copy to avoid modifying the original data
  const sanitized = { ...data };

  // Remove sensitive fields
  if (sanitized.password) sanitized.password = "[REDACTED]";
  if (sanitized.newPassword) sanitized.newPassword = "[REDACTED]";
  if (sanitized.currentPassword) sanitized.currentPassword = "[REDACTED]";

  return sanitized;
}

// Helper function to reinitialize auth headers - useful after page refresh
export const initializeAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("Auth headers initialized from localStorage");
    return true;
  }
  return false;
};

export default API;
