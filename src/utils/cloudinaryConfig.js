export const CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "waureisen";
export const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "waureisen_blog_images";

/**
 * Generate a Cloudinary URL from an image ID or path
 * @param {string} imageId - The image ID or path
 * @returns {string} The complete Cloudinary URL
 */
export const getCloudinaryUrl = (imageId) => {
  if (!imageId) return null;

  // If it's already a full URL, return it as is
  if (imageId.startsWith("http")) return imageId;

  // Remove any leading slash if present
  const cleanImageId = imageId.startsWith("/") ? imageId.substring(1) : imageId;

  // Construct the Cloudinary URL
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${cleanImageId}`;
};

/**
 * Check if an image URL is a valid Cloudinary URL
 * @param {string} url - URL to check
 * @returns {boolean} True if it's a Cloudinary URL
 */
export const isCloudinaryUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  return url.includes("cloudinary.com") || url.includes("res.cloudinary.com");
};

/**
 * Handle image loading errors with a fallback
 * @param {Event} event - The error event from the img element
 */
export const handleImageError = (event) => {
  const imgElement = event.target;
  imgElement.onerror = null; // Prevent infinite error loop

  // Find parent container
  const container = imgElement.parentElement;
  if (!container) return;

  // Add gray background
  container.classList.add("bg-gray-100");

  // Replace with "No Image" text
  container.innerHTML =
    '<div class="flex items-center justify-center h-full text-gray-500">No Image</div>';
};
