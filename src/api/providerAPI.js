// src/api/providerAPI.js
import API from "./config";
import { setAuthHeader } from "../utils/authService";

export const getProviderProfile = async () => {
  try {
    setAuthHeader();
    const response = await API.get("/providers/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    throw error;
  }
};

export const updateProviderProfile = async (profileData) => {
  try {
    // Make a copy of the data to avoid modifying the original
    const dataToSend = { ...profileData };

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

        console.log(
          "Provider profile picture uploaded to Cloudinary:",
          imageUrl
        );
      } catch (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        // Remove the profile picture if upload fails
        delete dataToSend.profilePicture;
      }
    }

    console.log("Sending provider profile update:", dataToSend);

    const response = await API.put("/providers/profile", dataToSend, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Update provider data in localStorage to reflect in Navbar
    if (response.data) {
      const providerData = JSON.parse(
        localStorage.getItem("provider_user") || "{}"
      );
      const updatedProviderData = {
        ...providerData,
        ...response.data,
      };
      localStorage.setItem(
        "provider_user",
        JSON.stringify(updatedProviderData)
      );

      // Dispatch storage event to notify all components
      window.dispatchEvent(new Event("storage"));
    }

    return response.data;
  } catch (error) {
    console.error("Error updating provider profile:", error);
    throw error;
  }
};

export const updateProviderBanking = async (bankingData) => {
  try {
    setAuthHeader();
    console.log("Updating provider banking details:", bankingData);
    const response = await API.put("/providers/profile/banking", bankingData);

    if (response.data) {
      const currentData = JSON.parse(
        localStorage.getItem("provider_user") || "{}"
      );
      const updatedData = { ...currentData, ...bankingData };
      localStorage.setItem("provider_user", JSON.stringify(updatedData));
    }

    return response.data;
  } catch (error) {
    console.error("Error updating provider banking details:", error);
    throw error;
  }
};

export const updateProviderSecurity = async (securityData) => {
  try {
    setAuthHeader();
    const response = await API.put("/providers/profile/security", securityData);
    return response.data;
  } catch (error) {
    console.error("Error updating provider security settings:", error);
    throw error;
  }
};

export const updateProviderSettings = async (settingsData) => {
  try {
    setAuthHeader();
    const response = await API.put("/providers/profile/settings", settingsData);

    // Update local storage if needed
    if (response.data) {
      const currentData = JSON.parse(
        localStorage.getItem("provider_user") || "{}"
      );
      const updatedData = { ...currentData, settings: settingsData };
      localStorage.setItem("provider_user", JSON.stringify(updatedData));
    }

    return response.data;
  } catch (error) {
    console.error("Error updating provider settings:", error);
    throw error;
  }
};

export const getProviderListings = async () => {
  try {
    const response = await API.get("/providers/listings");
    return response.data;
  } catch (error) {
    console.error("Error fetching provider listings:", error);
    throw error;
  }
};

export const getListingDetails = async (listingId) => {
  try {
    const response = await API.get(`/providers/listings/${listingId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching listing details:", error);
    throw error;
  }
};

export const createListing = async (listingData) => {
  try {
    setAuthHeader();
    const response = await API.post("/providers/add-listing", listingData);
    return response.data;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
};

export const updateListing = async (id, listingData) => {
  try {
    setAuthHeader();
    const response = await API.put(`/providers/listings/${id}`, listingData);
    return response.data;
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
};

export const deleteListing = async (id) => {
  try {
    setAuthHeader();
    const response = await API.delete(`/providers/listings/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
};

export const getProviderBookings = async (params = {}) => {
  try {
    const { 
      status = 'all', 
      page = 1, 
      limit = 10,
      sortOrder = 'desc',
      sortBy = 'createdAt',
      dateRange,
      listingId
    } = params;
    
    const queryParams = new URLSearchParams();
    
    if (status !== 'all') {
      queryParams.append('status', status);
    }
    
    if (listingId) {
      queryParams.append('listingId', listingId);
    }
    
    if (dateRange) {
      queryParams.append('dateRange', dateRange);
    }
    
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    queryParams.append('sortOrder', sortOrder);
    queryParams.append('sortBy', sortBy);  // Add this line
    
    const response = await API.get(`/providers/bookings?${queryParams}`);
    
    
    if (response.data.bookings && response.data.pagination) {
      return response.data;
    } else {
      return {
        bookings: Array.isArray(response.data) ? response.data : [],
        pagination: {
          totalCount: Array.isArray(response.data) ? response.data.length : 0,
          page: 1,
          limit: limit,
          totalPages: 1
        }
      };
    }
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    return {
      bookings: [],
      pagination: {
        totalCount: 0,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    };
  }
};

export const acceptBooking = async (id) => {
  try {
    setAuthHeader();
    const response = await API.put(`/providers/bookings/${id}/accept`);
    return response.data;
  } catch (error) {
    console.error("Error accepting booking:", error);
    throw error;
  }
};

export const rejectBooking = async (id) => {
  try {
    setAuthHeader();
    const response = await API.put(`/providers/bookings/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting booking:", error);
    throw error;
  }
};

export const getBookingDetails = async (bookingId) => {
  try {
    const response = await API.get(`/providers/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw error;
  }
};

export const getBookingUserDetails = async (bookingId) => {
  try {
    const response = await API.get(`/providers/bookings/${bookingId}/user`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking user details:", error);
    throw error;
  }
};

export const getProviderStats = async (timeRange = "month") => {
  try {
    setAuthHeader();
    const response = await API.get("/providers/analytics", {
      params: { timeRange },
    });

    const performanceDefaults = {
      totalBookings: { current: 0, previous: 0 },
      totalRevenue: { current: 0, previous: 0 },
      occupancyRate: { current: 0, previous: 0 },
    };

    const data = {
      ...response.data,
      performance: {
        ...performanceDefaults,
        ...response.data?.performance,
      },
      charts: response.data?.charts || {
        labels: [],
        revenue: [],
        bookings: [],
      },
    };

    return data;
  } catch (error) {
    console.error("Error fetching provider analytics:", error);

    return {
      timeRange,
      performance: {
        totalBookings: { current: 0, previous: 0 },
        totalRevenue: { current: 0, previous: 0 },
        occupancyRate: { current: 0, previous: 0 },
      },
      charts: {
        labels: [],
        revenue: [],
        bookings: [],
      },
    };
  }
};

export const blockCalendarDates = async (blockData) => {
  try {
    setAuthHeader();
    const response = await API.post("/providers/calendar/block", blockData);
    return response.data;
  } catch (error) {
    console.error("Error blocking calendar dates:", error);
    throw error;
  }
};

export const getProviderEarnings = async (timeFrame = "all") => {
  try {
    setAuthHeader();
    const response = await API.get("/providers/earnings", {
      params: { timeFrame },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching provider earnings:", error);
    return {
      totalEarnings: "0 CHF",
      pendingPayouts: "0 CHF",
      nextPayout: "0 CHF",
    };
  }
};

export const getProviderTransactions = async (filters = {}) => {
  try {
    setAuthHeader();
    const response = await API.get("/providers/transactions", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching provider transactions:", error);
    return [];
  }
};

export const getProviderDashboardStats = async (timeFrame = "month") => {
  return getProviderStats(timeFrame);
};

export const cancelBooking = async (id) => {
  return rejectBooking(id);
};

export const getUnavailableDates = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.listingId) queryParams.append("listingId", filters.listingId);
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);

    console.log(
      "Fetching unavailable dates with params:",
      queryParams.toString()
    );
    const response = await API.get(
      `/providers/calendar/unavailable-dates?${queryParams}`
    );
    console.log("Unavailable dates response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching unavailable dates:", error);
    return [];
  }
};

export const blockDates = async (blockData) => {
  try {
    const response = await API.post(
      "/providers/calendar/block-dates",
      blockData
    );
    return response.data;
  } catch (error) {
    console.error("Error blocking dates:", error);
    throw error;
  }
};

export const unblockDates = async (unblockData) => {
  try {
    setAuthHeader();
    const response = await API.delete("/providers/calendar/unblock-dates", {
      data: unblockData,
    });
    return response.data;
  } catch (error) {
    console.error("Error unblocking dates:", error);
    throw error;
  }
};

export const getProviderCalendarBookings = async (params = {}) => {
  try {
    const { status = "all", dateRange, listingId } = params;

    console.log("Getting calendar bookings with params:", {
      status,
      dateRange,
      listingId,
    });

    const queryParams = new URLSearchParams();

    if (status !== "all") {
      queryParams.append("status", status);
    }

    if (listingId) {
      queryParams.append("listingId", listingId);
    }

    if (dateRange) {
      queryParams.append("dateRange", dateRange);
    }

    queryParams.append("calendarView", "true");

    const response = await API.get(
      `/providers/calendar-bookings?${queryParams}`
    );

    console.log("Calendar bookings API response:", response.data);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching calendar bookings:", error);
    return [];
  }
};
