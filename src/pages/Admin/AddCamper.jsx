import React, { useState } from 'react';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Electricity',
  'Driver cabin',
  'Living area & kitchen',
  'Bathroom',
  'Dog facilities',
  'Additional',
  'Security deposit',
  'Rules & requirements'
];

const AddCamper = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedCategory: '',
    featuredImage: null,
    categoryDescription: ''
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, featuredImage: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    // console.log(formData);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/campers')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          Register Camper
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter blog title"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter blog content..."
            rows="5"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
          <p className="text-xs text-gray-500">
            You can use Markdown formatting for rich content
          </p>
        </div>

        {/* Featured Image */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Featured Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {!previewImage ? (
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                <span className="text-gray-600 font-medium mb-1">Drag & drop your image here</span>
                <span className="text-gray-500 text-sm mb-3">or</span>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Choose File
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div className="relative">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-[200px] object-cover rounded-lg"
                />
                <button 
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setFormData(prev => ({ ...prev, featuredImage: null }));
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={formData.selectedCategory}
            onChange={(e) => setFormData(prev => ({ ...prev, selectedCategory: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Category Description */}
        {formData.selectedCategory && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description of this category
            </label>
            <textarea
              value={formData.categoryDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryDescription: e.target.value }))}
              placeholder="Enter category description..."
              rows="5"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/admin/campers')}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2 text-brand bg-brand/10 rounded-lg hover:bg-brand/20 transition-colors"
          >
            View page
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCamper;