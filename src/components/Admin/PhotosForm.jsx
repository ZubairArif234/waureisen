import React, { useState, useEffect } from "react";
import { Upload, X, Image as ImageIcon, PawPrint, Loader } from "lucide-react";
import {
  uploadImageToCloudinary,
  ensureCloudinaryUrl,
} from "../../utils/cloudinaryUtils";

const PhotosForm = ({ formData, handleInputChange }) => {
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    main: false,
    gallery: [],
  });

  // Initialize previews in edit mode or if there are existing images
  useEffect(() => {
    // Handle main image preview
    if (formData && formData.mainImage) {
      try {
        // Make sure the main image URL is a valid, complete URL
        const validatedUrl = ensureCloudinaryUrl(formData.mainImage);
        if (validatedUrl) {
          setMainImagePreview(validatedUrl);
          handleInputChange("mainImage", validatedUrl); // Update with validated URL
        }
      } catch (err) {
        console.error("Error setting main image preview:", err);
      }
    }

    // Handle gallery images
    if (
      formData &&
      formData.galleryImages &&
      Array.isArray(formData.galleryImages) &&
      formData.galleryImages.length > 0
    ) {
      try {
        // Make sure all gallery image URLs are valid, complete URLs
        const validatedGalleryUrls = formData.galleryImages
          .filter((url) => url) // Filter out any null/undefined URLs
          .map((url) => ensureCloudinaryUrl(url))
          .filter(Boolean); // Filter out any null values

        const initialPreviews = validatedGalleryUrls.map((url) => ({
          file: null, // We don't have the file object for existing images
          previewUrl: url,
        }));

        setGalleryPreviews(initialPreviews);
        handleInputChange("galleryImages", validatedGalleryUrls); // Update with validated URLs
      } catch (err) {
        console.error("Error setting gallery previews:", err);
      }
    }
  }, [
    formData.title,
    formData.mainImage,
    formData.galleryImages,
    handleInputChange,
  ]);

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // First show a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      try {
        setUploading(true);
        setUploadProgress({ ...uploadProgress, main: true });

        const cloudinaryUrl = await uploadImageToCloudinary(file);

        // Validate the returned URL
        const validatedUrl = ensureCloudinaryUrl(cloudinaryUrl);

        // Update the form data with the Cloudinary URL
        handleInputChange("mainImage", validatedUrl);
        console.log("Main image uploaded:", validatedUrl);

        // Update preview with the validated URL
        setMainImagePreview(validatedUrl);

        setUploadProgress({ ...uploadProgress, main: false });
      } catch (error) {
        console.error("Error uploading main image to Cloudinary:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleGalleryImageAdd = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // First show previews for all files
      const tempPreviews = files.map((file) => {
        return { file, previewUrl: URL.createObjectURL(file) };
      });

      const newGalleryPreviews = [...galleryPreviews, ...tempPreviews];
      setGalleryPreviews(newGalleryPreviews);

      // Update upload progress array
      setUploadProgress({
        ...uploadProgress,
        gallery: [...uploadProgress.gallery, ...files.map(() => true)],
      });

      setUploading(true);

      // Upload each file to Cloudinary
      const uploadedUrls = [];
      const currentGalleryImages = [...(formData.galleryImages || [])];

      for (let i = 0; i < files.length; i++) {
        try {
          const cloudinaryUrl = await uploadImageToCloudinary(files[i]);

          // Validate the returned URL
          const validatedUrl = ensureCloudinaryUrl(cloudinaryUrl);
          uploadedUrls.push(validatedUrl);

          // Also update the preview for this image with the validated URL
          const updatedPreviews = [...newGalleryPreviews];
          updatedPreviews[galleryPreviews.length + i].previewUrl = validatedUrl;
          setGalleryPreviews(updatedPreviews);

          // Update upload progress
          const newProgress = [...uploadProgress.gallery];
          newProgress[galleryPreviews.length + i] = false;
          setUploadProgress({
            ...uploadProgress,
            gallery: newProgress,
          });
        } catch (error) {
          console.error(
            `Error uploading gallery image ${i} to Cloudinary:`,
            error
          );
          // Mark this upload as failed in the progress
          const newProgress = [...uploadProgress.gallery];
          newProgress[galleryPreviews.length + i] = false;
          setUploadProgress({
            ...uploadProgress,
            gallery: newProgress,
          });
        }
      }

      // Update the form data with all successfully uploaded URLs
      const updatedGallery = [...currentGalleryImages, ...uploadedUrls];
      handleInputChange("galleryImages", updatedGallery);
      console.log("Gallery images uploaded:", uploadedUrls);

      setUploading(false);
    }
  };

  const removeGalleryImage = (index) => {
    const updatedPreviews = galleryPreviews.filter((_, i) => i !== index);
    setGalleryPreviews(updatedPreviews);

    const updatedGallery = [...(formData.galleryImages || [])];
    updatedGallery.splice(index, 1);
    handleInputChange("galleryImages", updatedGallery);

    // Update progress array
    const newProgress = [...uploadProgress.gallery];
    newProgress.splice(index, 1);
    setUploadProgress({
      ...uploadProgress,
      gallery: newProgress,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Photos</h2>
        <p className="text-gray-600 text-sm">
          Upload and manage photos for your listing. The first photo will be the
          main image.
        </p>
      </div>

      {/* Main Image Upload */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Main Image
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          {mainImagePreview ? (
            <div className="relative">
              <img
                src={mainImagePreview}
                alt="Main property"
                className="w-full h-80 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setMainImagePreview(null);
                  handleInputChange("mainImage", null);
                }}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Upload indicator */}
              {uploadProgress.main && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
                  <div className="bg-white p-3 rounded-lg flex items-center">
                    <Loader className="w-5 h-5 text-brand animate-spin mr-2" />
                    <span className="text-sm">Uploading...</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-80 cursor-pointer">
              <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
              <span className="text-gray-600 font-medium mb-1">
                Drag & drop your image here
              </span>
              <span className="text-gray-500 text-sm mb-4">or</span>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Browse Files
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleMainImageChange}
                disabled={uploading}
              />
            </label>
          )}
        </div>
      </div>

      {/* Gallery Images */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Gallery Images
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Display existing gallery images */}
          {galleryPreviews.map((image, index) => (
            <div
              key={index}
              className="relative group h-40 bg-gray-100 rounded-lg overflow-hidden"
            >
              <img
                src={image.previewUrl}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Upload indicator */}
              {uploadProgress.gallery[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                  <Loader className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>
          ))}

          {/* Upload new image button */}
          <label className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-gray-600 text-sm text-center">
              Upload Image
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleGalleryImageAdd}
              disabled={uploading}
            />
          </label>
        </div>
        <p className="text-xs text-gray-500">
          At least 5 pictures. For best results, use high-resolution images in
          landscape orientation.
          <br />
          <br />
        </p>
        {/* Dog pictures note with PawPrint */}
        <div className="flex items-center gap-2 mt-4">
          <PawPrint className="w-6 h-6 text-[#B4A481]" />
          <p className="text-sm text-gray-600">
            For more bookings, we recommend uploading pictures with dogs
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotosForm;
