// src/api/adminAPI.js
import API from "./config";

// Featured, Popular, and New Accommodations
export const getFeaturedAccommodations = async (retryCount = 0) => {
  try {
    // Create empty default structure for recommendations
    const defaultData = {
      featured_accommodations: [],
      new_accommodations: [],
      popular_accommodations: [],
    };

    const response = await API.get("/admins/recommendations");

    // Return data from API if available
    if (response.data) {
      return {
        featured_accommodations:
          response.data.topRecommendations?.map((item) =>
            typeof item === "string" ? item : item._id
          ) || [],
        new_accommodations:
          response.data.exclusiveFinds?.map((item) =>
            typeof item === "string" ? item : item._id
          ) || [],
        popular_accommodations:
          response.data.popularAccommodations?.map((item) =>
            typeof item === "string" ? item : item._id
          ) || [],
      };
    }

    return defaultData;
  } catch (error) {
    console.error("Error fetching featured accommodations:", error);

    // Implement manual retry for this specific function
    if (!error.response && retryCount < 3) {
      console.log(
        `Retrying getFeaturedAccommodations (attempt ${retryCount + 1})...`
      );
      // Exponential backoff
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return getFeaturedAccommodations(retryCount + 1);
    }

    // Return empty arrays as fallback
    return {
      featured_accommodations: [],
      new_accommodations: [],
      popular_accommodations: [],
    };
  }
};

export const addToFeaturedSection = async (id, section) => {
  try {
    // Map the frontend section names to the backend endpoint names
    const sectionEndpointMap = {
      featured_accommodations: "top",
      new_accommodations: "exclusive",
      popular_accommodations: "popular",
    };

    // First verify this listing ID exists
    try {
      console.log(`Verifying listing ID ${id} exists...`);
      const listingCheck = await API.get(`/listings/${id}`);
      if (!listingCheck.data || !listingCheck.data._id) {
        throw {
          response: {
            status: 404,
            data: { message: `Listing with ID ${id} not found` },
          },
        };
      }

      // Check if listing is not active
      if (listingCheck.data.status !== "active") {
        throw {
          response: {
            status: 400,
            data: {
              message: `Listing with ID ${id} is ${listingCheck.data.status}. Only active listings can be added to recommendations.`,
              skippedListings: [
                {
                  id,
                  title: listingCheck.data.title || "Unnamed Listing",
                  reason: `${listingCheck.data.status}. Only active listings can be added to recommendations.`,
                },
              ],
            },
          },
        };
      }
    } catch (listingErr) {
      if (listingErr.response?.status === 404) {
        throw {
          response: {
            status: 404,
            data: {
              message: `Listing with ID ${id} not found or not available`,
            },
          },
        };
      }
      // Pass through other errors
      throw listingErr;
    }

    // Add a small delay between verification and update to reduce race conditions
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get current items to check count - just to display a warning if we're over limit
    console.log(`Getting current featured items for ${section}...`);
    const currentFeatures = await getFeaturedAccommodations();
    const currentItems = currentFeatures[section] || [];

    // Check if we already have 6 items - this is just for UI warning
    // The backend will enforce the limit anyway
    if (currentItems.length >= 6) {
      console.warn(
        `Already have ${currentItems.length} items in ${section}, backend will trim to 6 items`
      );
    }

    // Always try to add the item - the backend will handle validation and limits
    // Get the endpoint to call
    const endpoint = sectionEndpointMap[section];
    if (!endpoint) {
      throw new Error(`Invalid section: ${section}`);
    }

    // Add the new ID to the list
    const updatedListingIds = currentItems.includes(id)
      ? currentItems // Don't add if already present
      : [...currentItems, id]; // Add if not already in list

    // Call the API endpoint - backend will enforce the 6 item limit
    console.log(`Updating ${section} with new listing ID ${id}...`);
    const response = await API.put(`/admins/recommendations/${endpoint}`, {
      listingIds: updatedListingIds,
    });

    return {
      success: true,
      message: `Added to ${section} successfully`,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error adding to ${section} section:`, error);

    // Check if it's the specific "Listing not found" error
    if (error.response?.data?.message?.includes("Listing with ID")) {
      throw {
        response: {
          status: 404,
          data: { message: error.response.data.message },
        },
      };
    }

    // More detailed error handling for network issues
    if (!error.response) {
      throw new Error(
        `Network error while updating ${section}. Please try again.`
      );
    }

    throw error;
  }
};

export const removeFromFeaturedSection = async (id, section) => {
  try {
    // Map the frontend section names to the backend endpoint names
    const sectionEndpointMap = {
      featured_accommodations: "top",
      new_accommodations: "exclusive",
      popular_accommodations: "popular",
    };

    // Get current items
    const currentFeatures = await getFeaturedAccommodations();
    const currentItems = currentFeatures[section] || [];

    // Remove the ID
    const updatedItems = currentItems.filter((itemId) => itemId !== id);

    // Get the endpoint to call
    const endpoint = sectionEndpointMap[section];
    if (!endpoint) {
      throw new Error(`Invalid section: ${section}`);
    }

    // Call the API endpoint
    await API.put(`/admins/recommendations/${endpoint}`, {
      listingIds: updatedItems,
    });

    return { success: true, message: `Removed from ${section} successfully` };
  } catch (error) {
    console.error(`Error removing from ${section} section:`, error);
    throw error;
  }
};

// Accommodations/Listings
export const getAllListings = async () => {
  try {
    const response = await API.get("/admins/view-all-listings");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all listings:", error);
    throw error;
  }
};

export const getPaginatedListings = async (
  page = 1,
  limit = 9,
  search = ""
) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
    });

    const response = await API.get(`/admins/paginated-listings?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated listings:", error);
    throw error;
  }
};

export const getListingById = async (id) => {
  try {
    const response = await API.get(`/listings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching listing ${id}:`, error);
    throw error;
  }
};

export const createListing = async (listingData) => {
  try {
    const response = await API.post("/admins/add-listing", listingData);
    return response.data;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
};

export const updateListing = async (id, listingData) => {
  try {
    const response = await API.put(`/listings/${id}`, listingData);
    return response.data;
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
};

export const deleteListing = async (id) => {
  try {
    const response = await API.delete(`/admins/delete-listing/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
};

export const closeListing = async (id) => {
  try {
    const response = await API.put(`/admins/close-listing/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error closing listing:", error);
    throw error;
  }
};

// Users
export const getAllUsers = async () => {
  try {
    const response = await API.get("/admins/view-all-customers");
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await API.get(`/admins/view-customer/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

export const updateUserStatus = async (id, status) => {
  try {
    const response = await API.put(`/admins/update-user-status/${id}`, {
      profileStatus: status,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating user status:`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Providers
export const getAllProviders = async () => {
  try {
    const response = await API.get("/admins/view-all-providers");
    return response.data;
  } catch (error) {
    console.error("Error fetching all providers:", error);
    throw error;
  }
};

export const getProviderById = async (id) => {
  try {
    const response = await API.get(`/admins/view-provider/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching provider ${id}:`, error);
    throw error;
  }
};

export const updateProviderStatus = async (id, status) => {
  try {
    console.log(`Attempting to update provider ${id} status to ${status}`);

    // Ensure proper authentication headers are set
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Set up proper headers
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "profile-status": status,
    };

    // Make request with headers
    const response = await API.put(
      `/admins/ban-provider/${id}`,
      {}, // Empty request body
      { headers }
    );

    console.log(
      `Successfully updated provider ${id} status to ${status}:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating provider status:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteProvider = async (id) => {
  try {
    const response = await API.delete(`/providers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting provider:", error);
    throw error;
  }
};

// Transactions
export const getAllTransactions = async () => {
  try {
    const response = await API.get("/admins/view-all-transactions");
    return response.data;
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    throw error;
  }
};

export const getTransactionById = async (id) => {
  try {
    const response = await API.get(`/admins/view-transaction/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transaction ${id}:`, error);
    throw error;
  }
};

export const updateTransaction = async (id, data) => {
  try {
    const response = await API.put(`/transactions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

export const cancelBookingTransaction = async (id) => {
  try {
    const response = await API.put(`/transactions/${id}`, {
      status: "cancelled",
    });
    return response.data;
  } catch (error) {
    console.error("Error cancelling booking transaction:", error);
    throw error;
  }
};

// Vouchers
export const getAllVouchers = async () => {
  try {
    const response = await API.get("/admins/view-all-vouchers");
    return response.data;
  } catch (error) {
    console.error("Error fetching all vouchers:", error);
    throw error;
  }
};

export const getVoucherById = async (id) => {
  try {
    const response = await API.get(`/admins/view-voucher/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching voucher ${id}:`, error);
    throw error;
  }
};

export const createVoucher = async (voucherData) => {
  try {
    const response = await API.post("/admins/add-voucher", voucherData);
    return response.data;
  } catch (error) {
    console.error("Error creating voucher:", error);
    throw error;
  }
};

export const updateVoucher = async (id, voucherData) => {
  try {
    const response = await API.put(`/admins/update-voucher/${id}`, voucherData);
    return response.data;
  } catch (error) {
    console.error("Error updating voucher:", error);
    throw error;
  }
};

export const deleteVoucher = async (id) => {
  try {
    const response = await API.delete(`/admins/del-voucher/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting voucher:", error);
    throw error;
  }
};

export const getActiveFilters = async () => {
  try {
    const response = await API.get('/filters/template');
    return response.data;
  } catch (error) {
    console.error('Error fetching active filters:', error);
    throw error;
  }
};

export const updateTemplateFilter = async (filterData) => {
  try {
    const response = await API.put('/filters/template', filterData);
    return response.data;
  } catch (error) {
    console.error('Error updating template filter:', error);
    throw error;
  }
};

export const createSubsection = async (filterId, subsectionData) => {
  try {
    const response = await API.post(`/filters/${filterId}/subsections`, subsectionData);
    return response.data;
  } catch (error) {
    console.error('Error creating subsection:', error);
    throw error;
  }
};

export const updateSubsection = async (filterId, subsectionId, subsectionData) => {
  try {
    const response = await API.put(`/filters/${filterId}/subsections/${subsectionId}`, subsectionData);
    return response.data;
  } catch (error) {
    console.error('Error updating subsection:', error);
    throw error;
  }
};

export const deleteSubsection = async (filterId, subsectionId) => {
  try {
    const response = await API.delete(`/filters/${filterId}/subsections/${subsectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting subsection:', error);
    throw error;
  }
};

export const createSubsubsection = async (filterId, subsectionId, subsubsectionData) => {
  try {
    const response = await API.post(`/filters/${filterId}/subsections/${subsectionId}/subsubsections`, subsubsectionData);
    return response.data;
  } catch (error) {
    console.error('Error creating subsubsection:', error);
    throw error;
  }
};

export const updateSubsubsection = async (filterId, subsectionId, subsubsectionId, subsubsectionData) => {
  try {
    const response = await API.put(`/filters/${filterId}/subsections/${subsectionId}/subsubsections/${subsubsectionId}`, subsubsectionData);
    return response.data;
  } catch (error) {
    console.error('Error updating subsubsection:', error);
    throw error;
  }
};

export const deleteSubsubsection = async (filterId, subsectionId, subsubsectionId) => {
  try {
    const response = await API.delete(`/filters/${filterId}/subsections/${subsectionId}/subsubsections/${subsubsectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting subsubsection:', error);
    throw error;
  }
};

export const createFilter = async (filterId, subsectionId, filterData, subsubsectionId = null) => {
  try {
    const endpoint = subsubsectionId 
      ? `/filters/${filterId}/subsections/${subsectionId}/subsubsections/${subsubsectionId}/filters`
      : `/filters/${filterId}/subsections/${subsectionId}/filters`;
    
    const response = await API.post(endpoint, filterData);
    return response.data;
  } catch (error) {
    console.error('Error creating filter:', error);
    throw error;
  }
};

export const updateFilter = async (filterId, subsectionId, subFilterId, filterData, subsubsectionId = null) => {
  try {
    const endpoint = subsubsectionId 
      ? `/filters/${filterId}/subsections/${subsectionId}/subsubsections/${subsubsectionId}/filters/${subFilterId}`
      : `/filters/${filterId}/subsections/${subsectionId}/filters/${subFilterId}`;
    
    const response = await API.put(endpoint, filterData);
    return response.data;
  } catch (error) {
    console.error('Error updating filter:', error);
    throw error;
  }
};

export const deleteFilter = async (filterId, subsectionId, subFilterId, subsubsectionId = null) => {
  try {
    const endpoint = subsubsectionId 
      ? `/filters/${filterId}/subsections/${subsectionId}/subsubsections/${subsubsectionId}/filters/${subFilterId}`
      : `/filters/${filterId}/subsections/${subsectionId}/filters/${subFilterId}`;
    
    const response = await API.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error deleting filter:', error);
    throw error;
  }
};

export const getTemplateFilter = async () => {
  try {
    const response = await API.get('/filters/template');
    return response.data;
  } catch (error) {
    console.error('Error fetching template filter:', error);
    throw error;
  }
};

export const createListingFilter = async (filterData) => {
  try {
    const response = await API.post('/filters', filterData);
    return response.data;
  } catch (error) {
    console.error('Error creating listing filter:', error);
    throw error;
  }
};
