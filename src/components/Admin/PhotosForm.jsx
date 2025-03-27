import React, { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, PawPrint } from 'lucide-react';
import i1 from '../../assets/bg.png';
import i2 from '../../assets/s1.png';
import i3 from '../../assets/i1.png';
import i4 from '../../assets/i2.png';

// Example mock image URLs for edit mode
const mockImages = {
  main: i1,
  gallery: [
    i2,
    i3,
    i4
  ]
};

const PhotosForm = ({ formData, handleInputChange }) => {
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const isEditMode = formData.title !== ''; // Simple check to determine if we're in edit mode
  
  // Initialize previews in edit mode
  useEffect(() => {
    if (isEditMode) {
      // In a real app, you'd use the actual image URLs from formData
      // For now, we'll use mock data
      setMainImagePreview(mockImages.main);
      
      const initialPreviews = mockImages.gallery.map(url => ({
        file: null, // We don't have the file object in edit mode
        previewUrl: url
      }));
      
      setGalleryPreviews(initialPreviews);
    }
  }, [isEditMode]);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
        // In a real app, you'd handle file upload differently
        handleInputChange('mainImage', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageAdd = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Process each file to get preview URLs
      const newPreviews = files.map(file => {
        return { file, previewUrl: URL.createObjectURL(file) };
      });
      
      setGalleryPreviews([...galleryPreviews, ...newPreviews]);
      
      // In a real app, you'd handle file upload differently
      const updatedGallery = [...(formData.galleryImages || []), ...files];
      handleInputChange('galleryImages', updatedGallery);
    }
  };

  const removeGalleryImage = (index) => {
    const updatedPreviews = galleryPreviews.filter((_, i) => i !== index);
    setGalleryPreviews(updatedPreviews);
    
    const updatedGallery = [...(formData.galleryImages || [])];
    updatedGallery.splice(index, 1);
    handleInputChange('galleryImages', updatedGallery);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Photos</h2>
        <p className="text-gray-600 text-sm">Upload and manage photos for your listing. The first photo will be the main image.</p>
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
                  handleInputChange('mainImage', null);
                }}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-80 cursor-pointer">
              <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
              <span className="text-gray-600 font-medium mb-1">Drag & drop your image here</span>
              <span className="text-gray-500 text-sm mb-4">or</span>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Browse Files
              </span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleMainImageChange}
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
            <div key={index} className="relative group h-40 bg-gray-100 rounded-lg overflow-hidden">
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
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-black text-white text-xs rounded">
                  Main
                </div>
              )}
            </div>
          ))}

          {/* Upload new image button */}
          <label className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-gray-600 text-sm text-center">Upload Image</span>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={handleGalleryImageAdd}
            />
          </label>
        </div>
        <p className="text-xs text-gray-500">
          At least 5 pictures. For best results, use high-resolution images in landscape orientation.<br /><br />
        </p>
         {/* Dog pictures note with PawPrint */}
         <div className="flex items-center gap-2 mt-4">
          <PawPrint className="w-6 h-6 text-[#B4A481]" />
          <p className="text-sm text-gray-600">
            For more bookings,
            we recommend uploading pictures
            with dogs
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotosForm;