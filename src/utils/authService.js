// src/utils/authService.js
import API from "../api/config";
import { providerLogin, userLogin, adminLogin } from "../api/authAPI";

// Local Storage Keys - using consistent keys throughout the application
const TOKEN_KEY = "token";
const USER_TYPE_KEY = "userType";
const USER_DATA_KEY = "user_data";
const PROVIDER_USER_KEY = "provider_user";
const ADMIN_DATA_KEY = "admin_data";

// Generic login function that delegates to the appropriate API call
export const login = async (credentials, userType) => {
  try {
    let response;

    // Call the appropriate login function based on user type
    switch (userType) {
      case "provider":
        response = await providerLogin(credentials);
        break;
      case "admin":
        response = await adminLogin(credentials);
        break;
      case "user":
      default:
        response = await userLogin(credentials);
        break;
    }

    // For debugging, check the response structure
    console.log(`${userType} login response:`, response);

    // Store authentication data in localStorage
    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_TYPE_KEY, userType);

      // Set the authorization header immediately for subsequent requests
      API.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;
      console.log("Token saved and auth header set");

      // Get full profile data with profile picture
      try {
        if (userType === "provider") {
          const { getProviderProfile } = await import("../api/providerAPI");
          const profileData = await getProviderProfile();
          console.log("Provider profile data fetched:", profileData);
          localStorage.setItem(PROVIDER_USER_KEY, JSON.stringify(profileData));
        } else if (userType === "user") {
          const { getUserProfile } = await import("../api/authAPI");
          const profileData = await getUserProfile();
          console.log("User profile data fetched:", profileData);
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(profileData));
        } else if (userType === "admin" && response.admin) {
          localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(response.admin));
        }
      } catch (profileError) {
        console.error("Error fetching full profile after login:", profileError);

        // Still store basic user data if profile fetch fails
        if (userType === "provider" && response.provider) {
          localStorage.setItem(
            PROVIDER_USER_KEY,
            JSON.stringify(response.provider)
          );
        } else if (userType === "user" && response.user) {
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
        } else if (userType === "admin" && response.admin) {
          localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(response.admin));
        }
      }

      // Dispatch storage event to notify all components of auth change
      window.dispatchEvent(new Event("storage"));
    } else {
      console.error("No token returned in login response");
    }

    return response;
  } catch (error) {
    console.error("Login error in authService:", error);
    throw error;
  }
};

// Logout function
export const logout = (options = {}) => {
  // Get userType before clearing storage (in case we need to redirect to signup)
  const userType = localStorage.getItem(USER_TYPE_KEY);

  // Clear all auth-related data from localStorage
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  localStorage.removeItem(PROVIDER_USER_KEY);
  localStorage.removeItem(ADMIN_DATA_KEY);

  // Clear auth header
  delete API.defaults.headers.common["Authorization"];

  // Dispatch storage event to notify all components of auth change
  window.dispatchEvent(new Event("storage"));

  // Handle redirects based on options
  if (options.redirect) {
    if (options.redirect === "signup") {
      // Redirect to signup with the user type
      window.location.href = `/signup?userType=${userType || "user"}`;
    } else if (options.redirect === "login") {
      // Redirect to login, optionally with session expired parameter
      const params = options.sessionExpired ? "?session_expired=true" : "";
      window.location.href = `/login${params}`;
    } else {
      // Redirect to provided path
      window.location.href = options.redirect;
    }
  } else {
    // Default redirect to home page
    window.location.href = "/";
  }
};

// Get current user data (works for any user type)
export const getCurrentUser = () => {
  const userType = localStorage.getItem(USER_TYPE_KEY);

  if (!userType) return null;

  let userData;

  switch (userType) {
    case "provider":
      userData = localStorage.getItem(PROVIDER_USER_KEY);
      break;
    case "admin":
      userData = localStorage.getItem(ADMIN_DATA_KEY);
      break;
    case "user":
    default:
      userData = localStorage.getItem(USER_DATA_KEY);
      break;
  }

  return userData ? JSON.parse(userData) : null;
};

// Get current provider data
export const getCurrentProvider = () => {
  if (isUserType("provider")) {
    const providerData = localStorage.getItem(PROVIDER_USER_KEY);
    return providerData ? JSON.parse(providerData) : null;
  }
  return null;
};

// Get current provider ID
export const getCurrentProviderId = () => {
  const provider = getCurrentProvider();
  if (!provider) return null;

  // Handle different ID formats
  return provider.id || provider._id;
};

// Get current user ID (works for any user type)
export const getCurrentUserId = () => {
  const user = getCurrentUser();
  if (!user) return null;

  // Handle different ID formats
  return user.id || user._id;
};

// Get user type
export const getUserType = () => {
  return localStorage.getItem(USER_TYPE_KEY);
};

// Check if user is logged in
export const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userType = localStorage.getItem(USER_TYPE_KEY);

  console.log("Auth check - token exists:", !!token);
  console.log("Auth check - user type:", userType);

  return !!token && !!userType;
};

// Check if user is of specific type
export const isUserType = (type) => {
  const userType = localStorage.getItem(USER_TYPE_KEY);
  return userType === type;
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Update user profile in local storage
export const updateUserProfile = (updatedData) => {
  const userType = localStorage.getItem(USER_TYPE_KEY);

  if (!userType) return null;

  let storageKey;

  switch (userType) {
    case "provider":
      storageKey = PROVIDER_USER_KEY;
      break;
    case "admin":
      storageKey = ADMIN_DATA_KEY;
      break;
    case "user":
    default:
      storageKey = USER_DATA_KEY;
      break;
  }

  const currentData = getCurrentUser();
  if (currentData) {
    const newData = { ...currentData, ...updatedData };
    localStorage.setItem(storageKey, JSON.stringify(newData));
    return newData;
  }
  return null;
};

// Update provider profile in local storage
export const updateProviderProfile = (updatedData) => {
  if (!isUserType("provider")) return null;

  const currentData = getCurrentProvider();
  if (currentData) {
    const newData = { ...currentData, ...updatedData };
    localStorage.setItem(PROVIDER_USER_KEY, JSON.stringify(newData));
    return newData;
  }
  return null;
};

export const setAuthHeader = () => {
  const token = getToken();
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("Authorization header set explicitly");
    return true;
  } else {
    delete API.defaults.headers.common["Authorization"];
    console.log("Authorization header removed - no token found");
    return false;
  }
};

// Initialize auth on app load
export const initializeAuth = () => {
  return setAuthHeader();
};

// Helper function to redirect to signup for non-existent accounts
export const redirectToSignup = (userType = "user") => {
  // Map 'user' to whatever the signup form expects (customer)
  const mappedType = userType === "user" ? "user" : userType;
  window.location.href = `/signup?userType=${mappedType}`;
};

// Helper function to check if an error indicates account doesn't exist
export const isAccountNotFoundError = (error) => {
  if (!error || !error.response) return false;

  // Skip banned accounts - they exist but are banned
  if (error.response?.data?.isBanned) return false;

  const status = error.response.status;
  const message = error.response?.data?.message || "";

  return (
    status === 401 ||
    status === 404 ||
    message.includes("Invalid credentials") ||
    message.includes("not found") ||
    message.toLowerCase().includes("user not exist")
  );
};

// Add this function at the end of the file
export const updateUserProfilePicture = (profilePictureUrl) => {
  const userType = localStorage.getItem(USER_TYPE_KEY);

  if (!userType) return null;

  let storageKey;

  switch (userType) {
    case "provider":
      storageKey = PROVIDER_USER_KEY;
      break;
    case "admin":
      storageKey = ADMIN_DATA_KEY;
      break;
    case "user":
    default:
      storageKey = USER_DATA_KEY;
      break;
  }

  const userData = JSON.parse(localStorage.getItem(storageKey) || "{}");
  userData.profilePicture = profilePictureUrl;
  localStorage.setItem(storageKey, JSON.stringify(userData));

  // Dispatch storage event to notify all components including Navbar
  window.dispatchEvent(new Event("storage"));

  console.log("Profile picture updated:", profilePictureUrl);
  return userData;
};
