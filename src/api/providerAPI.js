// src/api/providerAPI.js
import API from './config';
import { setAuthHeader } from '../utils/authService';

// Provider profile functions
export const getProviderProfile = async () => {
  try {
    setAuthHeader();
    const response = await API.get('/providers/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching provider profile:', error);
    throw error;
  }
};

export const updateProviderProfile = async (profileData) => {
  try {
    setAuthHeader();
    const response = await API.put('/providers/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating provider profile:', error);
    throw error;
  }
};

// Listing management functions
export const getProviderListings = async () => {
  try {
    const response = await API.get('/providers/listings');
    return response.data;
  } catch (error) {
    console.error('Error fetching provider listings:', error);
    throw error;
  }
};

export const getListingDetails = async (listingId) => {
  try {
    const response = await API.get(`/providers/listings/${listingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching listing details:', error);
    throw error;
  }
};

export const createListing = async (listingData) => {
  try {
    setAuthHeader();
    const response = await API.post('/providers/add-listing', listingData);
    return response.data;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

export const updateListing = async (id, listingData) => {
  try {
    setAuthHeader();
    const response = await API.put(`/providers/listings/${id}`, listingData);
    return response.data;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

export const deleteListing = async (id) => {
  try {
    setAuthHeader();
    const response = await API.delete(`/providers/listings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

export const getProviderBookings = async (params = {}) => {
  try {
    const { 
      status = 'all', 
      page = 1, 
      limit = 10,
      sortOrder = 'asc',
      dateRange,
      listingId
    } = params;
    
    // Log received parameters for debugging
    console.log('Getting provider bookings with params:', { 
      status, page, limit, sortOrder, dateRange, listingId 
    });
    
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
    
    const response = await API.get(`/providers/bookings?${queryParams}`);
    
    // Log response for debugging
    console.log('Bookings API response:', response.data);
    
    if (response.data.bookings && response.data.pagination) {
      return response.data;
    } else {
      // Handle legacy response format
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
    console.error('Error accepting booking:', error);
    throw error;
  }
};

export const rejectBooking = async (id) => {
  try {
    setAuthHeader();
    const response = await API.put(`/providers/bookings/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting booking:', error);
    throw error;
  }
};

export const getBookingDetails = async (bookingId) => {
  try {
    const response = await API.get(`/providers/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
};

export const getBookingUserDetails = async (bookingId) => {
  try {
    const response = await API.get(`/providers/bookings/${bookingId}/user`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking user details:', error);
    throw error;
  }
};


export const getProviderStats = async (timeRange = 'month') => {
  try {
    setAuthHeader();
    const response = await API.get('/providers/analytics', { 
      params: { timeRange } 
    });
    
    
    const performanceDefaults = {
      totalBookings: { current: 0, previous: 0 },
      totalRevenue: { current: 0, previous: 0 },
      occupancyRate: { current: 0, previous: 0 }
    };
    
    
    const data = {
      ...response.data,
      performance: {
        ...performanceDefaults,
        ...response.data?.performance
      },
      charts: response.data?.charts || {
        labels: [],
        revenue: [],
        bookings: []
      }
    };
    
    return data;
  } catch (error) {
    console.error('Error fetching provider analytics:', error);
    
    // Return default structure on error to prevent UI crashes
    return {
      timeRange,
      performance: {
        totalBookings: { current: 0, previous: 0 },
        totalRevenue: { current: 0, previous: 0 },
        occupancyRate: { current: 0, previous: 0 }
      },
      charts: {
        labels: [],
        revenue: [],
        bookings: []
      }
    };
  }
};

// Calendar management functions
export const blockCalendarDates = async (blockData) => {
  try {
    setAuthHeader();
    const response = await API.post('/providers/calendar/block', blockData);
    return response.data;
  } catch (error) {
    console.error('Error blocking calendar dates:', error);
    throw error;
  }
};

// Earnings functions
export const getProviderEarnings = async (timeFrame = 'all') => {
  try {
    setAuthHeader();
    const response = await API.get('/providers/earnings', { 
      params: { timeFrame } 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching provider earnings:', error);
    return {
      totalEarnings: '0 CHF',
      pendingPayouts: '0 CHF',
      nextPayout: '0 CHF'
    };
  }
};

export const getProviderTransactions = async (filters = {}) => {
  try {
    setAuthHeader();
    const response = await API.get('/providers/transactions', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching provider transactions:', error);
    return [];
  }
};

export const getProviderDashboardStats = async (timeFrame = 'month') => {
  return getProviderStats(timeFrame);
};
  
  export const cancelBooking = async (id) => {
    return rejectBooking(id);
  };



  /**
 * Get provider's unavailable dates
 * @param {string} startDate - Optional start date (YYYY-MM-DD)
 * @param {string} endDate - Optional end date (YYYY-MM-DD)
 * @returns {Promise<Array>} Array of unavailable dates
 */
  export const getUnavailableDates = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.listingId) queryParams.append('listingId', filters.listingId);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
  
      const response = await API.get(`/providers/calendar/unavailable-dates?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unavailable dates:', error);
      throw error;
    }
  };
  
  /**
   * Block dates for a listing
   * @param {Object} blockData - Date blocking data
   * @returns {Promise} API response
   */
  export const blockDates = async (blockData) => {
    try {
      const response = await API.post('/providers/calendar/block-dates', blockData);
      return response.data;
    } catch (error) {
      console.error('Error blocking dates:', error);
      throw error;
    }
  };
  
  /**
   * Unblock dates for a listing
   * @param {Object} unblockData - Date unblocking data
   * @returns {Promise} API response
   */
  export const unblockDates = async (unblockData) => {
    try {
      setAuthHeader();
      const response = await API.delete('/providers/calendar/unblock-dates', { data: unblockData });
      return response.data;
    } catch (error) {
      console.error('Error unblocking dates:', error);
      throw error;
    }
  };