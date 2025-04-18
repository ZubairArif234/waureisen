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

// Transactions
export const getAllTransactions = async () => {
  try {
    const response = await API.get('/admins/view-all-transactions');
    return response.data;
  } catch (error) {
    console.error('Error fetching all transactions:', error);
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
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const cancelBookingTransaction = async (id) => {
  try {
    const response = await API.put(`/transactions/${id}`, { status: 'cancelled' });
    return response.data;
  } catch (error) {
    console.error('Error cancelling booking transaction:', error);
    throw error;
  }
};

// Vouchers
export const getAllVouchers = async () => {
  try {
    const response = await API.get('/admins/view-all-vouchers');
    return response.data;
  } catch (error) {
    console.error('Error fetching all vouchers:', error);
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
    const response = await API.post('/admins/add-voucher', voucherData);
    return response.data;
  } catch (error) {
    console.error('Error creating voucher:', error);
    throw error;
  }
};

export const updateVoucher = async (id, voucherData) => {
  try {
    const response = await API.put(`/admins/update-voucher/${id}`, voucherData);
    return response.data;
  } catch (error) {
    console.error('Error updating voucher:', error);
    throw error;
  }
};

export const deleteVoucher = async (id) => {
  try {
    const response = await API.delete(`/admins/del-voucher/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting voucher:', error);
    throw error;
  }
};

export const getActiveFilters = async () => {
  try {
    const response = await API.get('/filters/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active filters:', error);
    throw error;
  }
};

export const createSubsection = async (filterId, subsectionData) => {
  try {
    const response = await API.post(`/filters/${filterId}/subsections`, subsectionData);
    return response.data;
  } catch (error) {
    console.error('Error creating filter subsection:', error);
    throw error;
  }
};

export const updateSubsection = async (filterId, subsectionId, subsectionData) => {
  try {
    const response = await API.put(`/filters/${filterId}/subsections/${subsectionId}`, subsectionData);
    return response.data;
  } catch (error) {
    console.error('Error updating filter subsection:', error);
    throw error;
  }
};

export const deleteSubsection = async (filterId, subsectionId) => {
  try {
    const response = await API.delete(`/filters/${filterId}/subsections/${subsectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting filter subsection:', error);
    throw error;
  }
};

export const createFilter = async (filterId, subsectionId, filterData) => {
  try {
    const response = await API.post(`/filters/${filterId}/subsections/${subsectionId}/filters`, filterData);
    return response.data;
  } catch (error) {
    console.error('Error creating filter:', error);
    throw error;
  }
};

export const updateFilter = async (filterId, subsectionId, subFilterId, filterData) => {
  try {
    const response = await API.put(`/filters/${filterId}/subsections/${subsectionId}/filters/${subFilterId}`, filterData);
    return response.data;
  } catch (error) {
    console.error('Error updating filter:', error);
    throw error;
  }
};

export const deleteFilter = async (filterId, subsectionId, subFilterId) => {
  try {
    const response = await API.delete(`/filters/${filterId}/subsections/${subsectionId}/filters/${subFilterId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting filter:', error);
    throw error;
  }
};