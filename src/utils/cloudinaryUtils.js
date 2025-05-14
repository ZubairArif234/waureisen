// src/utils/cloudinaryUtils.js

// Default cloud name - this ensures the app works even if environment variables are missing
const DEFAULT_CLOUD_NAME = "waureisen";
const DEFAULT_UPLOAD_PRESET = "waureisen_blog_images";

/**
 * Uploads an image to Cloudinary
 * @param {File} imageFile - The image file to upload
 * @param {Function} onProgress - Optional callback for upload progress
 * @returns {Promise<string>} The Cloudinary URL of the uploaded image
 */
export const uploadImageToCloudinary = async (imageFile, onProgress) => {
  if (!imageFile) {
    throw new Error("No image file provided");
  }

  // Create form data to send to Cloudinary
  const formData = new FormData();

  // Add the file to the form data with "file" key
  formData.append("file", imageFile);

  // Get Cloudinary config from env vars or use defaults
  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;
  const uploadPreset =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || DEFAULT_UPLOAD_PRESET;

  // Add your Cloudinary upload preset (unsigned)
  formData.append("upload_preset", uploadPreset);

  try {
    // console.log(
    //  `Uploading to Cloudinary cloud: ${cloudName}, preset: ${uploadPreset}`
    //);

    // Make the API request to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Cloudinary upload failed:", error);
      throw new Error(error.message || "Failed to upload image to Cloudinary");
    }

    // Parse the response to get the URL
    const data = await response.json();

    // Return the secure URL
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

/**
 * Extracts the public ID from a Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} The public ID or null if not a valid Cloudinary URL
 */
export const getPublicIdFromUrl = (url) => {
  if (!url || typeof url !== "string") return null;

  try {
    // Parse the URL to extract the public ID
    // Format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/public-id.jpg
    const urlParts = url.split("/");
    const filenameParts = urlParts[urlParts.length - 1].split(".");

    // Remove file extension
    filenameParts.pop();

    return filenameParts.join(".");
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    return null;
  }
};

/**
 * Fixes or validates a Cloudinary URL
 * @param {string} url - URL to fix or validate
 * @param {string} fallbackUrl - Optional fallback URL to use if the input URL is invalid
 * @returns {string} A valid Cloudinary URL or the fallback URL
 */
export const ensureCloudinaryUrl = (url, fallbackUrl = null) => {
  try {
    // If URL is null or undefined, return the fallback or null
    if (!url) return fallbackUrl || null;

    // If already a valid Cloudinary URL, return as is
    if (
      typeof url === "string" &&
      url.includes("cloudinary.com") &&
      url.includes("/image/upload/")
    ) {
      return url;
    }

    // If it's another kind of URL (like a data URL or from another domain)
    // we can't convert it, so return fallback
    if (
      typeof url === "string" &&
      (url.startsWith("http") || url.startsWith("data:"))
    ) {
      return url; // Keep external URLs as they are
    }

    // Otherwise, assume it's a public ID or path and construct a full URL
    const cloudName =
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;

    // Remove any leading slash if it's a string
    const cleanId =
      typeof url === "string" && url.startsWith("/") ? url.substring(1) : url;

    return `https://res.cloudinary.com/${cloudName}/image/upload/${cleanId}`;
  } catch (error) {
    console.error("Error in ensureCloudinaryUrl:", error);
    return fallbackUrl || null;
  }
};
