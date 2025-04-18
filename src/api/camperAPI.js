// src/api/camperAPI.js
import API from './config';

// Admin-only endpoints
/**
 * Get all campers (admin)
 * @param {Object} filters - Optional query parameters
 * @returns {Promise} API response with campers data
 */
export const getAllCampers = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await API.get(`/campers${queryString}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all campers:', error);
    throw error;
  }
};

/**
 * Get camper by ID (admin)
 * @param {string} id - Camper ID
 * @returns {Promise} API response with camper data
 */
export const getCamperById = async (id) => {
  try {
    const response = await API.get(`/campers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching camper ${id}:`, error);
    throw error;
  }
};

/**
 * Create new camper (admin)
 * @param {Object} camperData - Camper data
 * @returns {Promise} API response with created camper
 */
export const createCamper = async (camperData) => {
  try {
    const response = await API.post('/campers', camperData);
    return response.data;
  } catch (error) {
    console.error('Error creating camper:', error);
    throw error;
  }
};

/**
 * Update camper (admin)
 * @param {string} id - Camper ID
 * @param {Object} camperData - Updated camper data
 * @returns {Promise} API response with updated camper
 */
export const updateCamper = async (id, camperData) => {
  try {
    const response = await API.put(`/campers/${id}`, camperData);
    return response.data;
  } catch (error) {
    console.error('Error updating camper:', error);
    throw error;
  }
};

/**
 * Delete camper (admin)
 * @param {string} id - Camper ID
 * @returns {Promise} API response
 */
export const deleteCamper = async (id) => {
  try {
    const response = await API.delete(`/campers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting camper:', error);
    throw error;
  }
};

// Public endpoints
/**
 * Get available campers (public)
 * @param {number} limit - Maximum number of campers to return
 * @returns {Promise} API response with available campers
 */
export const getAvailableCampers = async (limit = 10) => {
  try {
    const response = await API.get(`/campers/public?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching available campers:', error);
    throw error;
  }
};

/**
 * Get campers by category (public)
 * @param {string} category - Category name
 * @returns {Promise} API response with category campers
 */
export const getCampersByCategory = async (category) => {
  try {
    const response = await API.get(`/campers/public/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching campers in category ${category}:`, error);
    throw error;
  }
};