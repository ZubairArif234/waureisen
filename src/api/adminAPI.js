// src/api/adminAPI.js
import API from './config';

// Accommodations/Listings
export const getAllListings = async () => {
  try {
    const response = await API.get('/admins/view-all-listings');
    return response.data;
  } catch (error) {
    console.error('Error fetching all listings:', error);
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
    const response = await API.post('/admins/add-listing', listingData);
    return response.data;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

export const updateListing = async (id, listingData) => {
  try {
    const response = await API.put(`/listings/${id}`, listingData);
    return response.data;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

export const deleteListing = async (id) => {
  try {
    const response = await API.delete(`/admins/delete-listing/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

export const closeListing = async (id) => {
  try {
    const response = await API.put(`/admins/close-listing/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error closing listing:', error);
    throw error;
  }
};

// Users
export const getAllUsers = async () => {
  try {
    const response = await API.get('/admins/view-all-customers');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
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
    const response = await API.put(`/admins/ban-user/${id}`, {}, {
      headers: {
        'profile-status': status
      }
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
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Providers
export const getAllProviders = async () => {
  try {
    const response = await API.get('/admins/view-all-providers');
    return response.data;
  } catch (error) {
    console.error('Error fetching all providers:', error);
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
    const response = await API.put(`/admins/ban-provider/${id}`, {}, {
      headers: {
        'profile-status': status
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating provider status:`, error);
    throw error;
  }
};

export const deleteProvider = async (id) => {
  try {
    const response = await API.delete(`/providers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting provider:', error);
    throw error;
  }
};