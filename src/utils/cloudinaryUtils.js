// src/utils/cloudinaryUtils.js

/**
 * Uploads an image to Cloudinary
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<string>} The Cloudinary URL of the uploaded image
 */
export const uploadImageToCloudinary = async (imageFile) => {
    if (!imageFile) {
      throw new Error('No image file provided');
    }
    
    // Create form data to send to Cloudinary
    const formData = new FormData();
    
    // Add the file to the form data with "file" key
    formData.append('file', imageFile);
    
    // Add your Cloudinary upload preset (unsigned)
    // You'll need to create an unsigned upload preset in your Cloudinary account
    formData.append('upload_preset', 'waureisen_blog_images');
    
    try {
      // Make the API request to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image to Cloudinary');
      }
      
      // Parse the response to get the URL
      const data = await response.json();
      
      // Return the secure URL
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };
  
  /**
   * Extracts the public ID from a Cloudinary URL
   * @param {string} url - Cloudinary URL
   * @returns {string|null} The public ID or null if not a valid Cloudinary URL
   */
  export const getPublicIdFromUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    
    try {
      // Parse the URL to extract the public ID
      // Format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/public-id.jpg
      const urlParts = url.split('/');
      const filenameParts = urlParts[urlParts.length - 1].split('.');
      
      // Remove file extension
      filenameParts.pop();
      
      return filenameParts.join('.');
    } catch (error) {
      console.error('Error extracting public ID from URL:', error);
      return null;
    }
  };