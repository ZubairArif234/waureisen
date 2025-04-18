// src/api/travelMagazineAPI.js
import API from './config';

// Admin-only endpoints
/**
 * Get all blog posts (admin)
 * @param {Object} filters - Optional query parameters
 * @returns {Promise} API response with blogs data
 */
export const getAllBlogs = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await API.get(`/travel-magazine${queryString}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    throw error;
  }
};

/**
 * Get blog by ID (admin)
 * @param {string} id - Blog post ID
 * @returns {Promise} API response with blog data
 */
export const getBlogById = async (id) => {
  try {
    const response = await API.get(`/travel-magazine/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog ${id}:`, error);
    throw error;
  }
};

/**
 * Create new blog post (admin)
 * @param {Object} blogData - Blog post data
 * @returns {Promise} API response with created blog
 */
export const createBlog = async (blogData) => {
  try {
    const response = await API.post('/travel-magazine', blogData);
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

/**
 * Update blog post (admin)
 * @param {string} id - Blog post ID
 * @param {Object} blogData - Updated blog data
 * @returns {Promise} API response with updated blog
 */
export const updateBlog = async (id, blogData) => {
  try {
    const response = await API.put(`/travel-magazine/${id}`, blogData);
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

/**
 * Delete blog post (admin)
 * @param {string} id - Blog post ID
 * @returns {Promise} API response
 */
export const deleteBlog = async (id) => {
  try {
    const response = await API.delete(`/travel-magazine/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

// Public endpoints
/**
 * Get published blogs (public)
 * @param {number} limit - Maximum number of blogs to return
 * @returns {Promise} API response with published blogs
 */
export const getPublishedBlogs = async (limit = 10) => {
  try {
    const response = await API.get(`/travel-magazine/public?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching published blogs:', error);
    throw error;
  }
};

/**
 * Get blogs by category (public)
 * @param {string} category - Category name
 * @returns {Promise} API response with category blogs
 */
export const getBlogsByCategory = async (category) => {
  try {
    const response = await API.get(`/travel-magazine/public/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blogs in category ${category}:`, error);
    throw error;
  }
};