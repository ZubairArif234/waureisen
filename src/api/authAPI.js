// src/api/authAPI.js
import API from "./config";

// User authentication
export const userLogin = async (credentials) => {
  try {
    console.log("Attempting user login with:", credentials);
    const response = await API.post("/users/login", credentials);
    console.log("User login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const userSignup = async (userData) => {
  try {
    console.log("Attempting user signup with:", userData);
    const response = await API.post("/users/signup", userData);
    console.log("User signup response:", response.data);
    return response.data;
  } catch (error) {
    console.error("User signup error:", error);
    throw error;
  }
};

// Provider authentication
export const providerLogin = async (credentials) => {
  try {
    console.log("Attempting provider login with:", credentials);
    const response = await API.post("/providers/login", credentials);
    console.log("Provider login response:", response.data);

    // Set auth header immediately if token is received
    if (response.data.token) {
      API.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (error) {
    console.error("Provider login error:", error);
    throw error;
  }
};

export const providerSignup = async (providerData) => {
  try {
    console.log("Attempting provider signup with:", providerData);
    const response = await API.post("/providers/signup", providerData);
    console.log("Provider signup response:", response.data);

    // Set auth header immediately if token is received
    if (response.data.token) {
      API.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (error) {
    console.error("Provider signup error:", error);
    throw error;
  }
};

export const completeProviderRegistration = async (registrationData) => {
  try {
    console.log("Completing provider registration with:", registrationData);
    const response = await API.post(
      "/providers/complete-registration",
      registrationData
    );
    console.log("Registration completion response:", response.data);

    // Update the stored provider data with the completed registration
    if (response.data.provider) {
      const currentData = JSON.parse(
        localStorage.getItem("provider_user") || "{}"
      );
      const updatedData = { ...currentData, ...response.data.provider };
      localStorage.setItem("provider_user", JSON.stringify(updatedData));
    }

    return response.data;
  } catch (error) {
    console.error("Error completing provider registration:", error);
    throw error;
  }
};

// Admin authentication
export const adminLogin = async (credentials) => {
  try {
    console.log("Attempting admin login with:", credentials);
    const response = await API.post("/admins/login", credentials);
    console.log("Admin login response:", response.data);

    // Set auth header immediately if token is received
    if (response.data.token) {
      API.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
};

export const adminSignup = async (adminData) => {
  try {
    const response = await API.post("/admins/signup", adminData);
    return response.data;
  } catch (error) {
    console.error("Admin signup error:", error);
    throw error;
  }
};

// Get user profile
// Update this function to use the new endpoint and handle customer number assignment
export const getUserProfile = async () => {
  try {
    const response = await API.get("/users/profile");

    // If no customer number is assigned, let's update the profile with one
    if (!response.data.customerNumber) {
      const updatedData = {
        ...response.data,
        customerNumber: generateCustomerNumber(),
      };

      // Update the user profile with the new customer number
      const updateResponse = await API.put("/users/profile", updatedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Assigned new customer number:", updatedData.customerNumber);
      return updateResponse.data;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Helper function to generate a customer number
function generateCustomerNumber() {
  // Format: WAU-YYYY-XXXXX where YYYY is current year and XXXXX is a random 5-digit number
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit number
  return `WAU-${year}-${randomNum}`;
}

// Get provider profile
export const getProviderProfile = async () => {
  try {
    const response = await API.get("/providers/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    throw error;
  }
};

// Update user profile
// Update this function to use the correct endpoint and handle image upload
export const updateUserProfile = async (userData) => {
  try {
    // Make a copy of the data to avoid modifying the original
    const dataToSend = { ...userData };

    // Handle profile picture separately if it's a File object
    if (dataToSend.profilePicture instanceof File) {
      try {
        // Import the uploadImageToCloudinary function
        const { uploadImageToCloudinary } = await import(
          "../utils/cloudinaryUtils"
        );

        // Upload the image to Cloudinary
        const imageUrl = await uploadImageToCloudinary(
          dataToSend.profilePicture
        );

        // Replace the File object with the uploaded image URL
        dataToSend.profilePicture = imageUrl;

        // Update the profile picture in local storage immediately
        // to ensure the Navbar shows the new picture without waiting for the API
        const { updateUserProfilePicture } = await import(
          "../utils/authService"
        );
        updateUserProfilePicture(imageUrl);

        console.log("Profile picture uploaded to Cloudinary:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        // Remove the profile picture if upload fails
        delete dataToSend.profilePicture;
      }
    }

    console.log("Sending profile update:", dataToSend);

    // Ensure we're sending proper JSON with the correct Content-Type header
    const response = await API.put("/users/profile", dataToSend, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Trigger a storage event to make sure the Navbar updates
    window.dispatchEvent(new Event("storage"));

    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Update provider profile
export const updateProviderProfile = async (profileData) => {
  try {
    const response = await API.put("/providers/profile", profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating provider profile:", error);
    throw error;
  }
};

// Verify token
export const verifyToken = async () => {
  try {
    const response = await API.get("/auth/verify");
    return response.data;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
};

// Logout function - only clears frontend state
export const logout = () => {
  // Return a resolved promise for consistency with other functions
  return Promise.resolve({ success: true });
};
